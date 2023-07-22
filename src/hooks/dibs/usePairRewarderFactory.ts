import { multicall, readContract } from '@wagmi/core';
import { Address } from 'abitype';
import { useEffect, useMemo, useState } from 'react';

import { pairRewarderFactoryABI } from '../../abis/types/generated';
import { PairRewarderFactoryAddress } from '../../constants/addresses';

export function usePairRewarderFactory() {
  const [pairRewarders, setPairRewarders] = useState<{ [key: Address]: Address[] } | null>(null);
  useEffect(() => {
    async function getData() {
      const allPairs = await readContract({
        address: PairRewarderFactoryAddress,
        abi: pairRewarderFactoryABI,
        functionName: 'getAllPairs',
      });
      const calls = allPairs.map((item) => {
        return {
          address: PairRewarderFactoryAddress,
          abi: pairRewarderFactoryABI,
          functionName: 'getAllPairRewarders',
          args: [item],
        };
      });
      const allPairRewarders = await multicall({
        contracts: calls,
      });
      const pairRewardersArray: { [key: Address]: Address[] } = {};
      allPairs.forEach((item, i) => {
        pairRewardersArray[item] = allPairRewarders[i].result as Address[];
      });
      setPairRewarders(pairRewardersArray);
    }

    getData().catch(console.log);
  }, []);
  const allPairs = useMemo(() => (pairRewarders ? Object.keys(pairRewarders) : null), [pairRewarders]);
  const allPairRewarders = useMemo(
    () => (pairRewarders ? Object.values(pairRewarders).reduce((a, c) => a.concat(c), []) : null),
    [pairRewarders],
  );
  return {
    allPairs,
    pairRewarders,
    allPairRewarders,
  };
}
