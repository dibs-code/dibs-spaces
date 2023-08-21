import { ApolloClient, useApolloClient } from '@apollo/client';
import { multicall } from '@wagmi/core';
import { dibsABI, useDibsLotteryGetLatestLeaderBoard } from 'abis/types/generated';
import { DailyDataQueryQuery } from 'apollo/__generated__/graphql';
import { DailyData } from 'apollo/queries';
import { DibsAddressMap } from 'constants/addresses';
import { useDibsAddresses } from 'hooks/dibs/useDibsAddresses';
import { useDibsCurrentDay } from 'hooks/dibs/useEpochTimer';
import { useContractAddress } from 'hooks/useContractAddress';
import { useCallback, useEffect, useState } from 'react';
import { LeaderBoardRecord } from 'types';
import { fromWei } from 'utils/numbers';
import { useAccount } from 'wagmi';

export const useLeaderboardData = () => {
  const [currentData, setCurrentData] = useState<LeaderBoardRecord[]>([]);
  const [prevData, setPrevData] = useState<LeaderBoardRecord[]>([]);
  const { address } = useAccount();
  const apolloClient = useApolloClient();

  const dibsAddress = useContractAddress(DibsAddressMap);
  const { dibsLotteryAddress } = useDibsAddresses();

  const currentDay = useDibsCurrentDay();
  const { data: leaderBoardConfiguration } = useDibsLotteryGetLatestLeaderBoard({
    address: dibsLotteryAddress,
  });

  const getDailyLeaderboardData = useCallback(
    async (apolloClient: ApolloClient<object>, epoch: number): Promise<LeaderBoardRecord[]> => {
      if (!dibsAddress) return [];

      let offset = 0;
      const result: DailyDataQueryQuery['dailyGeneratedVolumes'] = [];
      let chunkResult: DailyDataQueryQuery['dailyGeneratedVolumes'] = [];
      do {
        chunkResult = (
          await apolloClient.query({
            query: DailyData,
            variables: { day: epoch, skip: offset },
            fetchPolicy: 'cache-first',
          })
        ).data.dailyGeneratedVolumes;
        result.push(...chunkResult);
        offset += chunkResult.length;
      } while (chunkResult.length);

      //TODO: merge this code with the one in usePairRewarderLeaderboard
      const sortedData = result
        .filter((ele) => ele.user !== dibsAddress.toLowerCase())
        .map((ele) => {
          return {
            ...ele,
            volume: fromWei(ele.amountAsReferrer),
          };
        });
      const rawCodeNames = await multicall({
        allowFailure: false,
        contracts: sortedData.map((item) => ({
          abi: dibsABI,
          address: dibsAddress,
          functionName: 'getCodeName',
          args: [item.user],
        })),
      });
      return sortedData.map((data, index) => {
        return {
          ...data,
          code: rawCodeNames[index],
        };
      });
    },
    [dibsAddress],
  );
  useEffect(() => {
    const fetchInfo = async () => {
      if (!currentDay) return;
      try {
        const currentDailyEpoch = currentDay;
        const [cur, prev] = await Promise.all([
          getDailyLeaderboardData(apolloClient, currentDailyEpoch),
          getDailyLeaderboardData(apolloClient, currentDailyEpoch - 1),
        ]);
        setCurrentData(cur);
        setPrevData(prev);
      } catch (error) {
        console.log('leaderboard get error :>> ', error);
      }
    };
    fetchInfo();
  }, [currentDay, address, apolloClient, getDailyLeaderboardData]);

  return { leaderBoardConfiguration, currentData, prevData };
};
