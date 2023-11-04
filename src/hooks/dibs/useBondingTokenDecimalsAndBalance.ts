import { useBondingTokenBalanceOf, useBondingTokenDecimals } from 'abis/types/generated';
import { useMemo } from 'react';
import { formatUnits } from 'viem';
import { Address } from 'wagmi';

export default function useBondingTokenDecimalsAndBalance(bondingTokenAddress: Address, account: Address | undefined) {
  const { data: bondingTokenDecimals, isLoading: bondingTokenDecimalsLoading } = useBondingTokenDecimals({
    address: bondingTokenAddress,
  });

  const { data: bondingTokenBalance, isLoading: bondingTokenBalanceLoading } = useBondingTokenBalanceOf({
    address: bondingTokenAddress,
    args: account ? [account] : undefined,
    watch: true,
  });

  const bondingTokenBalanceParsed = useMemo(
    () =>
      bondingTokenDecimals !== undefined && bondingTokenBalance !== undefined
        ? formatUnits(bondingTokenBalance, bondingTokenDecimals)
        : undefined,
    [bondingTokenDecimals, bondingTokenBalance],
  );
  return {
    bondingTokenDecimals,
    bondingTokenBalance,
    bondingTokenBalanceParsed,
    bondingTokenBalanceLoading,
    bondingTokenDecimalsLoading,
  };
}
