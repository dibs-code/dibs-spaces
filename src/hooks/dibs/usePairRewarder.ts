import { ApolloClient, useApolloClient } from '@apollo/client';
import { multicall } from '@wagmi/core';
import {
  dibsABI,
  usePairRewarderActiveDay,
  usePairRewarderHasRole,
  usePairRewarderLeaderBoardInfo,
  usePairRewarderLeaderBoardWinners,
  usePairRewarderPair,
  usePairRewarderSetterRole,
} from 'abis/types/generated';
import { DailyDataForPairQueryQuery } from 'apollo/__generated__/graphql';
import { DailyDataForPair } from 'apollo/queries';
import { DibsAddressMap } from 'constants/addresses';
import { useContractAddress } from 'hooks/useContractAddress';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LeaderBoardInfo, LeaderBoardRecord } from 'types';
import { fromWei } from 'utils/numbers';
import { Address, useAccount } from 'wagmi';

import usePairName from './usePairName';

export const usePairRewarderLeaderboard = (pairRewarderAddress: Address | undefined) => {
  const apolloClient = useApolloClient();

  const [epochLeaderBoard, setEpochLeaderBoard] = useState<LeaderBoardRecord[]>([]);
  const [leaderBoardInfo, setLeaderBoardInfo] = useState<LeaderBoardInfo | undefined>(undefined);
  const [selectedEpoch, setSelectedEpoch] = useState<bigint | null>(null);

  const dibsAddress = useContractAddress(DibsAddressMap);

  const { data: activeDay } = usePairRewarderActiveDay({
    address: pairRewarderAddress,
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
  });
  const { data: activeLeaderBoardInfo } = usePairRewarderLeaderBoardInfo({
    address: pairRewarderAddress,
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
  });
  const getDailyLeaderboardData = useCallback(
    async (apolloClient: ApolloClient<object>, epoch: number): Promise<LeaderBoardRecord[]> => {
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
    [dibsAddress, pairAddress],
  );
  useEffect(() => {
    const fetchInfo = async () => {
      if (!selectedEpoch) return;
      try {
        setEpochLeaderBoard(await getDailyLeaderboardData(apolloClient, Number(selectedEpoch)));
      } catch (error) {
        console.log('leaderboard get error :>> ', error);
      }
    };
    fetchInfo();
  }, [apolloClient, getDailyLeaderboardData, selectedEpoch]);

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

//TODO: use mutlicall to have fewer calls
export function usePairRewarder(pairRewarderAddress: Address | undefined) {
  const { address } = useAccount();

  const { data: pairAddress } = usePairRewarderPair({
    address: pairRewarderAddress,
  });

  const { data: setterRole } = usePairRewarderSetterRole({
    address: pairRewarderAddress,
  });
  const { data: hasSetterRole } = usePairRewarderHasRole({
    address: pairRewarderAddress,
    args: address && setterRole ? [setterRole, address] : undefined,
  });

  const { pairName } = usePairName(pairAddress);

  const { data: activeLeaderBoardInfo } = usePairRewarderLeaderBoardInfo({
    address: pairRewarderAddress,
  });

  return {
    pairAddress,
    pairName,
    activeLeaderBoardInfo,
    hasSetterRole,
  };
}
