import usePairRewarderCreate from 'hooks/dibs/usePairRewarderCreate';
import usePairRewarderSetPrize from 'hooks/dibs/usePairRewarderSetPrize';

export default function usePairRewarderCreateAndSetPrize() {
  const pairRewarderSetPrizeHook = usePairRewarderSetPrize();
  const pairRewarderCreateHook = usePairRewarderCreate();
  return {
    ...pairRewarderCreateHook,
    ...pairRewarderSetPrizeHook,
  };
}
