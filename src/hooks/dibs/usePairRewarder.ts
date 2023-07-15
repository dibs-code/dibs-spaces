import { Address } from 'abitype';
import { useEffect, useState } from 'react';

import {
  usePairRewarderLeaderBoardInfo,
  usePairRewarderPair,
  useUniswapV2PairSymbol,
} from '../../abis/types/generated';

export function usePairRewarder(pairRewarderAddress: Address) {
  const { data: pairAddress } = usePairRewarderPair({
    address: pairRewarderAddress,
  });
  const { data: pairSymbol } = useUniswapV2PairSymbol({
    address: pairAddress,
  });

  const { data: leaderBoardInfo } = usePairRewarderLeaderBoardInfo({
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
  return {
    epochInfo,
    pairAddress,
    pairSymbol,
    leaderBoardInfo,
  };
}
