import { multicall, readContract } from '@wagmi/core';
import { erc20ABI, pairRewarderFactoryABI, uniswapV2PairABI } from 'abis/types/generated';
import { Address } from 'abitype';
import { useDibsAddresses } from 'hooks/dibs/useDibsAddresses';
import { useEffect, useMemo, useState } from 'react';

type PairRewardersOfPairs = {
  [pairAddress: Address]: Address[];
};

export function usePairRewarderFactoryAllPairs() {
  const { pairRewarderFactoryAddress } = useDibsAddresses();
  const [allPairs, setAllPairs] = useState<Address[] | null>(null);

  useEffect(() => {
    async function getData() {
      if (!pairRewarderFactoryAddress) return;
      const allPairs = await readContract({
        address: pairRewarderFactoryAddress,
        abi: pairRewarderFactoryABI,
        functionName: 'getAllPairs',
      });
      const pairNames = await multicall({
        contracts: allPairs.map((pair) => {
          return {
            address: pair,
            abi: uniswapV2PairABI,
            functionName: 'name',
          };
        }),
      });
      const validPairs = allPairs.filter((pair, i) => !!pairNames[i].result);
      setAllPairs(validPairs);
    }

    getData().catch(console.log);
  }, [pairRewarderFactoryAddress]);

  return {
    allPairs,
  };
}

export function usePairRewarderFactory() {
  const { pairRewarderFactoryAddress } = useDibsAddresses();
  const { allPairs } = usePairRewarderFactoryAllPairs();
  const [pairRewarders, setPairRewarders] = useState<PairRewardersOfPairs | null>(null);
  const [allPairToken0symbols, setAllPairToken0symbols] = useState<string[] | null>(null);
  const [allPairToken1symbols, setAllPairToken1symbols] = useState<string[] | null>(null);

  useEffect(() => {
    async function getData() {
      if (!pairRewarderFactoryAddress || !allPairs) return;
      const allPairRewarders = await multicall({
        allowFailure: false,
        contracts: allPairs.map((pair) => {
          return {
            address: pairRewarderFactoryAddress,
            abi: pairRewarderFactoryABI,
            functionName: 'getAllPairRewarders',
            args: [pair],
          };
        }),
      });
      const pairRewardersArray: PairRewardersOfPairs = {};
      allPairs.forEach((item, i) => {
        pairRewardersArray[item] = [...allPairRewarders[i]];
      });
      setPairRewarders(pairRewardersArray);
    }

    getData().catch(console.log);
  }, [allPairs, pairRewarderFactoryAddress]);

  //TODO: refactor: merge this useEffect with the one for token1 if possible
  useEffect(() => {
    async function getData() {
      if (!allPairs) return;
      const allPairToken0s = await multicall({
        allowFailure: false,
        contracts: allPairs.map((pair) => {
          return {
            address: pair,
            abi: uniswapV2PairABI,
            functionName: 'token0',
          };
        }),
      });
      setAllPairToken0symbols(
        await multicall({
          allowFailure: false,
          contracts: allPairToken0s.map((tokenAddress) => {
            return {
              address: tokenAddress,
              abi: erc20ABI,
              functionName: 'symbol',
            };
          }),
        }),
      );
    }

    getData();
  }, [allPairs]);

  useEffect(() => {
    async function getData() {
      if (!allPairs) return;
      const allPairToken1s = await multicall({
        allowFailure: false,
        contracts: allPairs.map((pair) => {
          return {
            address: pair,
            abi: uniswapV2PairABI,
            functionName: 'token1',
          };
        }),
      });
      setAllPairToken1symbols(
        await multicall({
          allowFailure: false,
          contracts: allPairToken1s.map((tokenAddress) => {
            return {
              address: tokenAddress,
              abi: erc20ABI,
              functionName: 'symbol',
            };
          }),
        }),
      );
    }

    getData();
  }, [allPairs]);

  const [pairFilterString, setPairFilterString] = useState('');
  const allPairRewarders = useMemo(() => {
    if (!pairRewarders) return null;

    return pairRewarders
      ? Object.entries(pairRewarders).reduce((a, c, i) => {
          if (
            !pairFilterString ||
            allPairToken0symbols?.[i].toLowerCase().includes(pairFilterString.toLowerCase()) ||
            allPairToken1symbols?.[i].toLowerCase().includes(pairFilterString.toLowerCase())
          ) {
            return a.concat(c[1]);
          }
          return a;
        }, [] as Address[])
      : null;
  }, [allPairToken0symbols, allPairToken1symbols, pairRewarders, pairFilterString]);

  return {
    pairFilterString,
    setPairFilterString,
    allPairs,
    pairRewarders,
    allPairRewarders,
  };
}
