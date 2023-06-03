import { prepareWriteContract, writeContract } from '@wagmi/core';
import DibsLotteryABI from 'abis/dibsLottery';
import { DibsLotteryAddress } from 'constants/addresses';
import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';

export const useClaimPrizes = () => {
  const { address } = useAccount();
  const [pending, setPending] = useState(false);

  const handleClaimFees = useCallback(async () => {
    if (!address) return;
    setPending(true);
    try {
      const { request } = await prepareWriteContract({
        address: DibsLotteryAddress,
        abi: DibsLotteryABI,
        functionName: 'claimReward',
        args: [address],
      });
      await writeContract(request);
    } catch (err) {
      console.log('claim error :>> ', err);
      setPending(false);
      return;
    }

    setPending(false);
  }, [address]);

  return { onClaimFees: handleClaimFees, pending };
};
