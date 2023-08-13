import {
  usePairRewarderHasRole,
  usePairRewarderLeaderBoardInfo,
  usePairRewarderPair,
  usePairRewarderSetterRole,
} from 'abis/types/generated';
import { Address, useAccount } from 'wagmi';

import usePairName from './usePairName';

//TODO: use mutlicall to have fewer calls
export function usePairRewarder(pairRewarderAddress: Address | undefined) {
  const { address } = useAccount();

  const { data: pairAddress } = usePairRewarderPair({
    address: pairRewarderAddress,
  });

  const { data: setterRole } = usePairRewarderSetterRole({
    address: pairRewarderAddress,
  });
  const { data: hasSetterRole } = usePairRewarderHasRole({
    address: pairRewarderAddress,
    args: address && setterRole ? [setterRole, address] : undefined,
  });

  const { pairName } = usePairName(pairAddress);

  const { data: activeLeaderBoardInfo } = usePairRewarderLeaderBoardInfo({
    address: pairRewarderAddress,
  });

  return {
    pairAddress,
    pairName,
    activeLeaderBoardInfo,
    hasSetterRole,
  };
}
