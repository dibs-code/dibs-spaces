import { multicall, readContract } from '@wagmi/core';
import { pairRewarderFactoryABI } from 'abis/types/generated';
import { Address } from 'abitype';
import { PairRewarderFactoryAddress } from 'constants/addresses';
import { useEffect, useMemo, useState } from 'react';

export function usePairRewarderFactory() {
  const [pairRewarders, setPairRewarders] = useState<{
    [key: `0x${string}`]: `0x${string}`[];
  } | null>(null);
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
      const pairRewardersArray: {
        [key: Address]: Address[];
      } = {};
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
