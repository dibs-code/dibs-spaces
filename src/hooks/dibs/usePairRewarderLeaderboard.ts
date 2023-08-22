import { multicall } from '@wagmi/core';
import {
  dibsABI,
  usePairRewarderLeaderBoardInfo,
  usePairRewarderLeaderBoardWinners,
  usePairRewarderPair,
} from 'abis/types/generated';
import { DibsAddressMap } from 'constants/addresses';
import useGetDailyLeaderBoardForPairCallback from 'hooks/dibs/subgraph/useGetDailyLeaderBoardForPairCallback';
import { useDibsCurrentDay } from 'hooks/dibs/useEpochTimer';
import { useContractAddress } from 'hooks/useContractAddress';
import useTestOrRealData from 'hooks/useTestOrRealData';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LeaderBoardInfo, LeaderBoardRecordWithCodeNames } from 'types';
import { Address } from 'wagmi';

export const usePairRewarderLeaderboard = (pairRewarderAddress: Address | undefined) => {
  const { chainId } = useTestOrRealData();
  const [dayLeaderBoard, setDayLeaderBoard] = useState<LeaderBoardRecordWithCodeNames[]>([]);
  const [leaderBoardInfo, setLeaderBoardInfo] = useState<LeaderBoardInfo | undefined>(undefined);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const dibsAddress = useContractAddress(DibsAddressMap);

  const currentDay = useDibsCurrentDay();
  const selectPreviousDay = useCallback(() => {
    if (currentDay) {
      setSelectedDay(currentDay);
    }
  }, [currentDay, setSelectedDay]);
  const selectCurrentDay = useCallback(() => {
    if (currentDay) {
      setSelectedDay(currentDay);
    }
  }, [currentDay, setSelectedDay]);
  useEffect(() => {
    selectCurrentDay();
  }, [selectCurrentDay]);

  const { data: selectedDayWinnersRaw } = usePairRewarderLeaderBoardWinners({
    address: pairRewarderAddress,
    args: selectedDay !== null ? [BigInt(selectedDay)] : undefined,
    chainId,
  });
  const { data: activeLeaderBoardInfo } = usePairRewarderLeaderBoardInfo({
    address: pairRewarderAddress,
    chainId,
  });
  const params = useParams();
  useEffect(() => {
    if (params.address === 'test') {
      setLeaderBoardInfo(activeLeaderBoardInfo);
      return;
    }
    setLeaderBoardInfo(selectedDay === currentDay ? activeLeaderBoardInfo : selectedDayWinnersRaw?.info);
  }, [currentDay, activeLeaderBoardInfo, params.address, selectedDay, selectedDayWinnersRaw?.info]);

  const { data: pairAddress } = usePairRewarderPair({
    address: pairRewarderAddress,
    chainId,
  });
  const getDailyLeaderboardDataForPair = useGetDailyLeaderBoardForPairCallback();

  const getDailyLeaderboardDataWithNames = useCallback(
    async (day: number): Promise<LeaderBoardRecordWithCodeNames[]> => {
      if (!pairAddress) return [];
      //TODO: merge this code with the one in useDibsLeaderboard
      const sortedData = await getDailyLeaderboardDataForPair(pairAddress, day);
      const rawCodeNames = await multicall({
        allowFailure: false,
        contracts: sortedData.map((item) => ({
          abi: dibsABI,
          address: dibsAddress,
          functionName: 'getCodeName',
          args: [item.user],
        })),
        chainId,
      });
      return sortedData.map((data, index) => {
        return {
          ...data,
          code: rawCodeNames[index],
        };
      });
    },
    [chainId, dibsAddress, getDailyLeaderboardDataForPair, pairAddress],
  );

  useEffect(() => {
    const fetchInfo = async () => {
      if (!selectedDay) return;
      try {
        setDayLeaderBoard(await getDailyLeaderboardDataWithNames(Number(selectedDay)));
      } catch (error) {
        console.log('leaderboard get error :>> ', error);
      }
    };
    fetchInfo();
  }, [getDailyLeaderboardDataWithNames, selectedDay]);

  return {
    selectedDay,
    setSelectedDay,
    selectPreviousDay,
    selectCurrentDay,
    dayLeaderBoard,
    leaderBoardInfo,
    currentDay,
  };
};
