import usePairRewarderCreate from 'hooks/dibs/usePairRewarderCreate';
import usePairRewarderSetPrize from 'hooks/dibs/usePairRewarderSetPrize';
import { useCallback, useMemo } from 'react';

export default function usePairRewarderCreateAndSetPrize() {
  const pairRewarderCreateHook = usePairRewarderCreate();
  const pairRewarderSetPrizeHook = usePairRewarderSetPrize(
    pairRewarderCreateHook.createdPairRewarderAddress ?? undefined,
  );

  const handleConfirmButtonClick = useCallback(() => {
    const { createdPairRewarderAddress, handleCreatePairRewarder } = pairRewarderCreateHook;
    const { handlePairRewarderSetPrize } = pairRewarderSetPrizeHook;
    if (!createdPairRewarderAddress) {
      handleCreatePairRewarder?.();
    } else {
      handlePairRewarderSetPrize?.();
    }
  }, [pairRewarderCreateHook, pairRewarderSetPrizeHook]);
  return {
    ...pairRewarderCreateHook,
    ...pairRewarderSetPrizeHook,
    buttonText: useMemo(
      () =>
        pairRewarderCreateHook.createdPairRewarderAddress
          ? pairRewarderCreateHook.buttonText
          : pairRewarderSetPrizeHook.buttonText,
      [
        pairRewarderCreateHook.createdPairRewarderAddress,
        pairRewarderCreateHook.buttonText,
        pairRewarderSetPrizeHook.buttonText,
      ],
    ),
    handleConfirmButtonClick,
  };
}
