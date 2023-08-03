import usePairRewarderCreate from 'hooks/dibs/usePairRewarderCreate';
import usePairRewarderSetPrize from 'hooks/dibs/usePairRewarderSetPrize';
import { useMemo } from 'react';

export default function usePairRewarderCreateAndSetPrize() {
  const pairRewarderCreateHook = usePairRewarderCreate();
  const pairRewarderSetPrizeHook = usePairRewarderSetPrize(
    pairRewarderCreateHook.createdPairRewarderAddress ?? undefined,
    false,
  );

  return {
    ...pairRewarderCreateHook,
    ...pairRewarderSetPrizeHook,
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
