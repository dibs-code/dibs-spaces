import { useApolloClient } from '@apollo/client';
import { multicall } from '@wagmi/core';
import {
  dibsABI,
  usePairRewarderLeaderBoardInfo,
  usePairRewarderLeaderBoardWinners,
  usePairRewarderPair,
} from 'abis/types/generated';
import { DailyDataForPairQueryQuery } from 'apollo/__generated__/graphql';
import { DailyLeaderBoardForPair, UserVolumeDataForPairAndDay } from 'apollo/queries';
import BigNumberJS from 'bignumber.js';
import { DibsAddressMap } from 'constants/addresses';
import { useDibsCurrentDay } from 'hooks/dibs/useEpochTimer';
import { useContractAddress } from 'hooks/useContractAddress';
import useTestOrRealData from 'hooks/useTestOrRealData';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LeaderBoardInfo, LeaderBoardRecord } from 'types';
import { fromWei } from 'utils/numbers';
import { Address } from 'wagmi';

export const usePairRewarderLeaderboard = (pairRewarderAddress: Address | undefined) => {
  const apolloClient = useApolloClient();
  const { chainId } = useTestOrRealData();
  const [dayLeaderBoard, setDayLeaderBoard] = useState<LeaderBoardRecord[]>([]);
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
  const getDailyLeaderboardData = useCallback(
    async (day: number): Promise<LeaderBoardRecord[]> => {
      if (!dibsAddress || !pairAddress) return [];

      let offset = 0;
      const result: DailyDataForPairQueryQuery['dailyGeneratedVolumes'] = [];
      let chunkResult: DailyDataForPairQueryQuery['dailyGeneratedVolumes'] = [];
      do {
        chunkResult = (
          await apolloClient.query({
            query: DailyLeaderBoardForPair,
            variables: { day, skip: offset, pair: pairAddress },
            fetchPolicy: 'cache-first',
          })
        ).data.dailyGeneratedVolumes;
        result.push(...chunkResult);
        offset += chunkResult.length;
      } while (chunkResult.length);

      //TODO: merge this code with the one in useDibsLeaderboard
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
        chainId,
      });
      return sortedData.map((data, index) => {
        return {
          ...data,
          code: rawCodeNames[index],
        };
      });
    },
    [apolloClient, chainId, dibsAddress, pairAddress],
  );
  useEffect(() => {
    const fetchInfo = async () => {
      if (!selectedDay) return;
      try {
        setDayLeaderBoard(await getDailyLeaderboardData(Number(selectedDay)));
      } catch (error) {
        console.log('leaderboard get error :>> ', error);
      }
    };
    fetchInfo();
  }, [getDailyLeaderboardData, selectedDay]);

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

export function useUserVolumeForDayAndPair({
  day,
  user,
  pair,
}: {
  day: number | undefined;
  user: Address | undefined;
  pair: Address | undefined;
}) {
  const apolloClient = useApolloClient();
  const [volume, setVolume] = useState<BigNumberJS | null>(null);
  useEffect(() => {
    let mounted = true;
    const fetchInfo = async () => {
      if (!day || !user || !pair) return;
      const result = (
        await apolloClient.query({
          query: UserVolumeDataForPairAndDay,
          variables: {
            day,
            user,
            pair,
          },
          fetchPolicy: 'cache-first',
        })
      ).data.dailyGeneratedVolumes;
      if (mounted && result.length) {
        setVolume(fromWei(result[0].amountAsReferrer));
      }
    };
    fetchInfo();
    return () => {
      mounted = false;
    };
  }, [apolloClient, pair, day, user]);
  return volume;
}
