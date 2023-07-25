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
import { Address } from 'abitype';
import { DibsAddress } from 'constants/addresses';
import { useEffect, useState } from 'react';
import { PairRewarderEpochWinners } from 'types';
import { useAccount } from 'wagmi';

import usePairName from './usePairName';

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

  const [epochTimer, setEpochTimer] = useState({
    hours: '0',
    minutes: '0',
  });
  const [now, setNow] = useState(new Date().getTime() / 1000);
  useEffect(() => {
    const nextEpoch = Math.ceil(now / 86400) * 86400;
    const hours = Math.floor((nextEpoch - now) / 3600);
    const minutes = Math.floor((nextEpoch - now - hours * 3600) / 60);
    setEpochTimer({
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

  const [epochWinners, setEpochWinners] = useState<PairRewarderEpochWinners>(undefined);
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
      const winnerCodeNames = await multicall({
        contracts: calls,
      });
      setEpochWinners({
        ...epochWinnersRaw,
        winnerCodeNames: winnerCodeNames.map((item) => item.result) as string[],
      });
    }

    getData().catch(console.log);
  }, [epochWinnersRaw]);

  return {
    epochTimer,
    pairAddress,
    pairName,
    epochToShowWinners,
    setEpochToShowWinners,
    activeDay,
    activeLeaderBoardInfo,
    epochWinners,
    hasSetterRole,
  };
}
