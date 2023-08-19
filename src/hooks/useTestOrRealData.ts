import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import RoutePath from 'routes';
import { useNetwork } from 'wagmi';
import { goerli } from 'wagmi/chains';

export default function useTestOrRealData() {
  const location = useLocation();
  const isTestRewardsRoute = useMemo(() => location.pathname.startsWith(RoutePath.REWARDS_TEST), [location.pathname]);
  const isTestRoute = useMemo(() => location.pathname.startsWith(RoutePath.REWARDS_TEST), [location.pathname]);
  const { chain } = useNetwork();
  const chainId = useMemo(() => (isTestRoute ? goerli.id : chain?.id), [chain, isTestRoute]);
  return {
    chainId,
    isTestRewardsRoute,
    isTestRoute,
  };
}
