import { formatUnits } from '@ethersproject/units';
import { useMemo } from 'react';
import { Address } from 'wagmi';

import { useErc20Decimals, useErc20Symbol } from '../abis/types/generated';
import formatLocaleNumber from '../lib/utils/formatLocaleNumber';

export default function RewardToken({
  rewardTokenAddress,
  rewardTokenAmounts,
}: {
  rewardTokenAddress: Address;
  rewardTokenAmounts: readonly bigint[];
}) {
  const { data: rewardTokenDecimals } = useErc20Decimals({
    address: rewardTokenAddress,
  });
  const { data: rewardTokenSymbol } = useErc20Symbol({
    address: rewardTokenAddress,
  });
  const totalAmount = useMemo(() => {
    const amount = rewardTokenAmounts.reduce((sum, amount) => sum + amount, BigInt(0));
    return formatUnits(amount, rewardTokenDecimals);
  }, [rewardTokenAmounts, rewardTokenDecimals]);
  return (
    <div>
      {formatLocaleNumber({ number: Number(totalAmount) })} {rewardTokenSymbol}
    </div>
  );
}
