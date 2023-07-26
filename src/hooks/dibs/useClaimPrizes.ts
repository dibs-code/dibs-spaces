import { prepareWriteContract, writeContract } from '@wagmi/core';
import DibsLotteryABI from 'abis/dibsLottery';
import { useDibsAddresses } from 'hooks/dibs/useDibsAddresses';
import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';

export const useClaimPrizes = () => {
  const { address } = useAccount();
  const [pending, setPending] = useState(false);
  const { dibsLotteryAddress } = useDibsAddresses();

  const handleClaimFees = useCallback(async () => {
    if (!address || !dibsLotteryAddress) return;
    setPending(true);
    try {
      const { request } = await prepareWriteContract({
        address: dibsLotteryAddress,
        abi: DibsLotteryABI,
        functionName: 'claimReward',
        args: [address],
      });
      await writeContract(request);
    } catch (err) {
      console.log('claim error :>> ', err);
    }
    setPending(false);
  }, [dibsLotteryAddress, address]);

  return { onClaimFees: handleClaimFees, pending };
};
