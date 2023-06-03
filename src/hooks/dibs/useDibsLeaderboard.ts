import { ApolloClient, useApolloClient } from '@apollo/client';
import { multicall } from '@wagmi/core';
import { dibsABI, useDibsLotteryGetLatestLeaderBoard } from 'abis/types/generated';
import { DailyData } from 'apollo/queries';
import { DibsAddress, DibsLotteryAddress } from 'constants/addresses';
import { useDibsLotteryData } from 'hooks/dibs/useDibsLotteryData';
import JSBI from 'jsbi';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export interface LeaderBoardRecord {
  amountAsReferrer: string;
  code: string;
  user: string;
  volume: JSBI;
}

const fromWei = (number: any, decimals = 18) =>
  JSBI.subtract(JSBI.BigInt(number), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)));
const getDailyLeaderboardData = async (apolloClient: ApolloClient<object>, epoch: number) => {
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
    .filter((ele) => ele.user !== DibsAddress.toLowerCase())
    .map((ele) => {
      return {
        ...ele,
        volume: fromWei(ele.amountAsReferrer),
      };
    });
  const calls = sortedData.map((item) => {
    return {
      abi: dibsABI,
      address: DibsAddress,
      functionName: 'getCodeName',
      args: [item.user],
    };
  });
  const rawCodeNames: any[] = await multicall({
    contracts: calls,
  });
  return sortedData.map((data, index) => {
    return {
      ...data,
      code: rawCodeNames[index][0],
    };
  });
};
export const useLeaderboardData = () => {
  const [currentData, setCurrentData] = useState<LeaderBoardRecord[]>([]);
  const [prevData, setPrevData] = useState<LeaderBoardRecord[]>([]);
  const { address } = useAccount();
  const apolloClient = useApolloClient();
  const { firstRoundStartTime } = useDibsLotteryData();

  const { data: leaderBoardConfiguration } = useDibsLotteryGetLatestLeaderBoard({
    address: DibsLotteryAddress,
  });

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
  }, [firstRoundStartTime, address, apolloClient]);

  return { leaderBoardConfiguration, currentData, prevData };
};
