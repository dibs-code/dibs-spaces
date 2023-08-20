import usePairRewarderCreate from 'hooks/dibs/usePairRewarderCreate';
import usePairRewarderSetPrize from 'hooks/dibs/usePairRewarderSetPrize';
import { useMemo, useState } from 'react';

export default function usePairRewarderCreateAndSetPrize() {
  const pairRewarderCreateHook = usePairRewarderCreate();
  const [loadCurrentLeaderBoard, setLoadCurrentLeaderBoard] = useState(false);
  const pairRewarderSetPrizeHook = usePairRewarderSetPrize(
    pairRewarderCreateHook.createdPairRewarderAddress ?? undefined,
    loadCurrentLeaderBoard,
  );

  return {
    ...pairRewarderCreateHook,
    ...pairRewarderSetPrizeHook,
    setLoadCurrentLeaderBoard,
    pairAddress: pairRewarderCreateHook.createdPairRewarderAddress
      ? pairRewarderSetPrizeHook.pairAddressFromContract
      : pairRewarderCreateHook.pairAddress,
    buttonText: useMemo(
      () =>
        pairRewarderCreateHook.createdPairRewarderAddress
          ? pairRewarderSetPrizeHook.buttonText
          : pairRewarderCreateHook.buttonText,
      [
        pairRewarderCreateHook.createdPairRewarderAddress,
        pairRewarderSetPrizeHook.buttonText,
        pairRewarderCreateHook.buttonText,
      ],
    ),
  };
}
