import { multicall } from '@wagmi/core';
import { dibsABI, useDibsLotteryGetLatestLeaderBoard } from 'abis/types/generated';
import { DibsAddressMap } from 'constants/addresses';
import useGetDailyLeaderBoardCallback from 'hooks/dibs/subgraph/useGetDailyLeaderBoardCallback';
import { useDibsAddresses } from 'hooks/dibs/useDibsAddresses';
import { useDibsCurrentDay } from 'hooks/dibs/useEpochTimer';
import { useContractAddress } from 'hooks/useContractAddress';
import { useCallback, useEffect, useState } from 'react';
import { LeaderBoardRecordWithCodeNames } from 'types';
import { useAccount } from 'wagmi';

export const useLeaderboardData = () => {
  const [currentData, setCurrentData] = useState<LeaderBoardRecordWithCodeNames[]>([]);
  const [prevData, setPrevData] = useState<LeaderBoardRecordWithCodeNames[]>([]);
  const { address } = useAccount();

  const dibsAddress = useContractAddress(DibsAddressMap);
  const { dibsLotteryAddress } = useDibsAddresses();

  const currentDay = useDibsCurrentDay();
  const { data: leaderBoardConfiguration } = useDibsLotteryGetLatestLeaderBoard({
    address: dibsLotteryAddress,
  });
  const getDailyLeaderBoardCallback = useGetDailyLeaderBoardCallback();
  const getDailyLeaderboardData = useCallback(
    async (day: number): Promise<LeaderBoardRecordWithCodeNames[]> => {
      if (!dibsAddress) return [];
      const sortedData = await getDailyLeaderBoardCallback(day);
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
    [getDailyLeaderBoardCallback, dibsAddress],
  );
  useEffect(() => {
    const fetchInfo = async () => {
      if (!currentDay) return;
      try {
        const [cur, prev] = await Promise.all([
          getDailyLeaderboardData(currentDay),
          getDailyLeaderboardData(currentDay - 1),
        ]);
        setCurrentData(cur);
        setPrevData(prev);
      } catch (error) {
        console.log('leaderboard get error :>> ', error);
      }
    };
    fetchInfo();
  }, [currentDay, address, getDailyLeaderboardData]);

  return { leaderBoardConfiguration, currentData, prevData };
};
