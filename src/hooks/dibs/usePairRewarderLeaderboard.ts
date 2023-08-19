import { useApolloClient } from '@apollo/client';
import { multicall } from '@wagmi/core';
import {
  dibsABI,
  usePairRewarderActiveDay,
  usePairRewarderLeaderBoardInfo,
  usePairRewarderLeaderBoardWinners,
  usePairRewarderPair,
} from 'abis/types/generated';
import { DailyDataForPairQueryQuery } from 'apollo/__generated__/graphql';
import { DailyDataForPair, UserVolumeDataForPairAndDay } from 'apollo/queries';
import BigNumberJS from 'bignumber.js';
import { DibsAddressMap } from 'constants/addresses';
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
  const [epochLeaderBoard, setEpochLeaderBoard] = useState<LeaderBoardRecord[]>([]);
  const [leaderBoardInfo, setLeaderBoardInfo] = useState<LeaderBoardInfo | undefined>(undefined);
  const [selectedEpoch, setSelectedEpoch] = useState<bigint | null>(null);

  const dibsAddress = useContractAddress(DibsAddressMap);

  const { data: activeDay } = usePairRewarderActiveDay({
    address: pairRewarderAddress,
    chainId,
  });
  const selectPreviousEpoch = useCallback(() => {
    if (activeDay) {
      setSelectedEpoch(activeDay - BigInt(1));
    }
  }, [activeDay, setSelectedEpoch]);
  const selectCurrentEpoch = useCallback(() => {
    if (activeDay) {
      setSelectedEpoch(activeDay);
    }
  }, [activeDay, setSelectedEpoch]);
  useEffect(() => {
    selectCurrentEpoch();
  }, [selectCurrentEpoch]);

  const { data: selectedEpochWinnersRaw } = usePairRewarderLeaderBoardWinners({
    address: pairRewarderAddress,
    args: selectedEpoch !== null ? [selectedEpoch] : undefined,
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
    setLeaderBoardInfo(selectedEpoch === activeDay ? activeLeaderBoardInfo : selectedEpochWinnersRaw?.info);
  }, [activeDay, activeLeaderBoardInfo, params.address, selectedEpoch, selectedEpochWinnersRaw?.info]);

  const { data: pairAddress } = usePairRewarderPair({
    address: pairRewarderAddress,
    chainId,
  });
  const getDailyLeaderboardData = useCallback(
    async (epoch: number): Promise<LeaderBoardRecord[]> => {
      if (!dibsAddress || !pairAddress) return [];

      let offset = 0;
      const result: DailyDataForPairQueryQuery['dailyGeneratedVolumes'] = [];
      let chunkResult: DailyDataForPairQueryQuery['dailyGeneratedVolumes'] = [];
      do {
        chunkResult = (
          await apolloClient.query({
            query: DailyDataForPair,
            variables: { day: epoch, skip: offset, pair: pairAddress },
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
      if (!selectedEpoch) return;
      try {
        setEpochLeaderBoard(await getDailyLeaderboardData(Number(selectedEpoch)));
      } catch (error) {
        console.log('leaderboard get error :>> ', error);
      }
    };
    fetchInfo();
  }, [getDailyLeaderboardData, selectedEpoch]);

  return {
    selectedEpoch,
    setSelectedEpoch,
    selectPreviousEpoch,
    selectCurrentEpoch,
    epochLeaderBoard,
    leaderBoardInfo,
    activeDay,
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
