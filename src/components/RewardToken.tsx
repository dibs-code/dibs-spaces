import { formatUnits } from '@ethersproject/units';
import { useErc20Decimals, useErc20Symbol } from 'abis/types/generated';
import { useMemo } from 'react';
import { Address } from 'wagmi';

import formatLocaleNumber from '../lib/utils/formatLocaleNumber';

export default function RewardToken({
  rewardTokenAddress,
  rewardTokenAmount,
}: {
  rewardTokenAddress: Address;
  rewardTokenAmount: bigint;
}) {
  const { data: rewardTokenDecimals } = useErc20Decimals({
    address: rewardTokenAddress,
  });
  const { data: rewardTokenSymbol } = useErc20Symbol({
    address: rewardTokenAddress,
  });
  const totalAmount = useMemo(() => {
    return formatUnits(rewardTokenAmount, rewardTokenDecimals);
  }, [rewardTokenAmount, rewardTokenDecimals]);

  return (
    <div>
      {formatLocaleNumber({ number: Number(totalAmount) })} {rewardTokenSymbol}
    </div>
  );
}
