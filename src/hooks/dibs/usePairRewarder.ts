import { multicall } from '@wagmi/core';
import { Address } from 'abitype';
import { useEffect, useState } from 'react';

import {
  dibsABI,
  usePairRewarderActiveDay,
  usePairRewarderLeaderBoardInfo,
  usePairRewarderLeaderBoardWinners,
  usePairRewarderPair,
  useUniswapV2PairSymbol,
} from '../../abis/types/generated';
import { DibsAddress } from '../../constants/addresses';

export function usePairRewarder(pairRewarderAddress: Address) {
  const { data: pairAddress } = usePairRewarderPair({
    address: pairRewarderAddress,
  });
  const { data: pairSymbol } = useUniswapV2PairSymbol({
    address: pairAddress,
  });

  const { data: activeLeaderBoardInfo } = usePairRewarderLeaderBoardInfo({
    address: pairRewarderAddress,
  });

  const [epochInfo, setEpochInfo] = useState({
    hours: '0',
    minutes: '0',
  });
  const [now, setNow] = useState(new Date().getTime() / 1000);
  useEffect(() => {
    const nextEpoch = Math.ceil(now / 86400) * 86400;
    const hours = Math.floor((nextEpoch - now) / 3600);
    const minutes = Math.floor((nextEpoch - now - hours * 3600) / 60);
    setEpochInfo({
      hours: hours < 10 ? '0' + hours : String(hours),
      minutes: minutes < 10 ? '0' + minutes : String(minutes),
    });
  }, [now]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date().getTime() / 1000), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const [epochToShowWinners, setEpochToShowWinners] = useState<bigint | null>(null);

  const { data: activeDay } = usePairRewarderActiveDay({
    address: pairRewarderAddress,
  });

  useEffect(() => {
    if (activeDay) {
      setEpochToShowWinners(activeDay - BigInt(1));
    }
  }, [activeDay]);

  const { data: epochWinnersRaw } = usePairRewarderLeaderBoardWinners({
    address: pairRewarderAddress,
    args: epochToShowWinners !== null ? [epochToShowWinners] : undefined,
  });

  const [epochWinners, setEpochWinners] = useState<
    | (typeof epochWinnersRaw & {
        winnerCodeNames: string[];
      })
    | undefined
  >(undefined);
  useEffect(() => {
    async function getData() {
      if (!epochWinnersRaw) return;
      const calls = epochWinnersRaw.winners.map((item) => {
        return {
          abi: dibsABI,
          address: DibsAddress,
          functionName: 'getCodeName',
          args: [item],
        };
      });
      if (!calls) return;
      const winnerCodeNames = await multicall({
        contracts: calls,
      });
      setEpochWinners({
        ...epochWinnersRaw,
        winnerCodeNames: winnerCodeNames.map((item) => item.result) as string[],
      });
    }

    getData();
  }, [epochWinnersRaw]);

  return {
    epochInfo,
    pairAddress,
    pairSymbol,
    epochToShowWinners,
    setEpochToShowWinners,
    activeDay,
    activeLeaderBoardInfo,
    epochWinners,
  };
}
