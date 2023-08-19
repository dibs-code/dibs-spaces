import {
  usePairRewarderHasRole,
  usePairRewarderLeaderBoardInfo,
  usePairRewarderPair,
  usePairRewarderSetterRole,
} from 'abis/types/generated';
import useTestOrRealData from 'hooks/useTestOrRealData';
import { Address, useAccount } from 'wagmi';

import usePairName from './usePairName';

//TODO: use mutlicall to have fewer calls
export function usePairRewarder(pairRewarderAddress: Address | undefined) {
  const { address } = useAccount();
  const { chainId } = useTestOrRealData();
  const { data: pairAddress } = usePairRewarderPair({
    address: pairRewarderAddress,
    chainId,
  });

  const { data: setterRole } = usePairRewarderSetterRole({
    address: pairRewarderAddress,
    chainId,
  });
  const { data: hasSetterRole } = usePairRewarderHasRole({
    address: pairRewarderAddress,
    args: address && setterRole ? [setterRole, address] : undefined,
    chainId,
  });

  const { pairName } = usePairName(pairAddress);

  const { data: activeLeaderBoardInfo } = usePairRewarderLeaderBoardInfo({
    address: pairRewarderAddress,
    chainId,
  });

  return {
    pairAddress,
    pairName,
    activeLeaderBoardInfo,
    hasSetterRole,
  };
}
