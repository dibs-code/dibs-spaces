import { formatUnits } from '@ethersproject/units';
import { useErc20Decimals, useErc20Symbol } from 'abis/types/generated';
import useTestOrRealData from 'hooks/useTestOrRealData';
import formatLocaleNumber from 'lib/utils/formatLocaleNumber';
import { useMemo } from 'react';
import { Address } from 'wagmi';

export default function RewardToken({
  rewardTokenAddress,
  rewardTokenAmount,
}: {
  rewardTokenAddress: Address;
  rewardTokenAmount: bigint;
}) {
  const { chainId } = useTestOrRealData();

  const { data: rewardTokenDecimals } = useErc20Decimals({
    address: rewardTokenAddress,
    chainId,
  });
  const { data: rewardTokenSymbol } = useErc20Symbol({
    address: rewardTokenAddress,
    chainId,
  });
  const totalAmount = useMemo(() => {
    return formatUnits(rewardTokenAmount, rewardTokenDecimals);
  }, [rewardTokenAmount, rewardTokenDecimals]);

  return (
    <div className="text-white">
      {formatLocaleNumber({ number: Number(totalAmount) })} {rewardTokenSymbol}
    </div>
  );
}
