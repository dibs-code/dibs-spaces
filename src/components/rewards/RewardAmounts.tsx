import { formatUnits } from '@ethersproject/units';
import { multicall } from '@wagmi/core';
import { erc20ABI } from 'abis/types/generated';
import { useCoinGeckoTokenAmountsToUsd } from 'hooks/useCoinGeckoPrice';
import React, { useEffect, useMemo, useState } from 'react';
import { RewardTokenAndAmount } from 'types';
import { Address } from 'wagmi';

export function TotalRewardInUsd({
  rewardTokens,
  rewardAmounts,
}: {
  rewardTokens: Address[];
  rewardAmounts: number[];
}) {
  const { totalAmountUsd } = useCoinGeckoTokenAmountsToUsd(rewardTokens, rewardAmounts);
  return <>${totalAmountUsd?.toLocaleString() ?? '...'}</>;
}

export function RewardAmounts({
  rewardTokensAndAmounts,
  showTotalUsd,
}: {
  rewardTokensAndAmounts: RewardTokenAndAmount[];
  showTotalUsd: boolean;
}) {
  const rewardTokens = useMemo(() => rewardTokensAndAmounts.map((obj) => obj.token), [rewardTokensAndAmounts]);
  const [tokenDecimals, setTokenDecimals] = useState<number[] | null>(null);
  const rewardAmounts = useMemo(
    () =>
      tokenDecimals ? rewardTokensAndAmounts.map((obj, i) => Number(formatUnits(obj.amount, tokenDecimals[i]))) : [],
    [rewardTokensAndAmounts, tokenDecimals],
  );

  const [rewardTokenSymbols, setRewardTokenSymbols] = useState<string[]>([]);

  useEffect(() => {
    multicall({
      allowFailure: false,
      contracts: rewardTokens.map((tokenAddress) => ({
        abi: erc20ABI,
        address: tokenAddress,
        functionName: 'symbol',
      })),
    }).then(setRewardTokenSymbols);
    multicall({
      allowFailure: false,
      contracts: rewardTokens.map((tokenAddress) => ({
        abi: erc20ABI,
        address: tokenAddress,
        functionName: 'decimals',
      })),
    }).then(setTokenDecimals);
  }, [rewardTokens]);

  return (
    <>
      {rewardTokenSymbols.map((symbol, i) => (rewardAmounts[i] ?? '...') + ' ' + symbol).join(' + ')}
      {showTotalUsd && (
        <>
          {' ≈ '}
          <TotalRewardInUsd rewardTokens={rewardTokens} rewardAmounts={rewardAmounts} />
        </>
      )}
    </>
  );
}
