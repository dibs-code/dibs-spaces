import { ApolloClient, useApolloClient } from '@apollo/client';
import { multicall } from '@wagmi/core';
import { dibsABI, useDibsFirstRoundStartTime, useDibsLotteryGetLatestLeaderBoard } from 'abis/types/generated';
import { DailyData } from 'apollo/queries';
import { DibsAddressMap } from 'constants/addresses';
import { useDibsAddresses } from 'hooks/dibs/useDibsAddresses';
import { useContractAddress } from 'hooks/useContractAddress';
import JSBI from 'jsbi';
import { useCallback, useEffect, useState } from 'react';
import { Address, useAccount } from 'wagmi';

export interface LeaderBoardRecord {
  amountAsReferrer: string;
  code: string;
  user: Address;
  volume: JSBI;
}

const fromWei = (number: any, decimals = 18) =>
  JSBI.subtract(JSBI.BigInt(number), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)));
export const useLeaderboardData = () => {
  const [currentData, setCurrentData] = useState<LeaderBoardRecord[]>([]);
  const [prevData, setPrevData] = useState<LeaderBoardRecord[]>([]);
  const { address } = useAccount();
  const apolloClient = useApolloClient();

  const dibsAddress = useContractAddress(DibsAddressMap);
  const { dibsLotteryAddress } = useDibsAddresses();

  const { data: firstRoundStartTime } = useDibsFirstRoundStartTime({
    address: dibsAddress,
  });

  const { data: leaderBoardConfiguration } = useDibsLotteryGetLatestLeaderBoard({
    address: dibsLotteryAddress,
  });

  const getDailyLeaderboardData = useCallback(
    async (apolloClient: ApolloClient<object>, epoch: number) => {
      if (!dibsAddress) return [];
      let result: any[] = [];
      let index = 0;
      let leaderRes;
      do {
        leaderRes = await apolloClient.query({
          query: DailyData,
          variables: { day: epoch, skip: index },
          fetchPolicy: 'cache-first',
        });
        if (leaderRes.data.dailyGeneratedVolumes.length > 0) {
          result = [...result, ...leaderRes.data.dailyGeneratedVolumes];
        }
        index += leaderRes.data.dailyGeneratedVolumes.length;
      } while (leaderRes.data.dailyGeneratedVolumes.length > 0);
      const sortedData: LeaderBoardRecord[] = result
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
      if (!firstRoundStartTime) return;
      try {
        const time = new Date().getTime() / 1000;
        const currentDailyEpoch = Math.floor((time - firstRoundStartTime) / 86400);
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
  }, [firstRoundStartTime, address, apolloClient, getDailyLeaderboardData]);

  return { leaderBoardConfiguration, currentData, prevData };
};
