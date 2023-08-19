import { chains } from 'constants/chains';
import useTestOrRealData from 'hooks/useTestOrRealData';
import { useMemo } from 'react';
import { AddressMap } from 'types';

export function useContractAddress(addressMap: AddressMap) {
  const { chainId } = useTestOrRealData();
  return useMemo(() => addressMap[chainId ?? chains[0].id], [addressMap, chainId]);
}
