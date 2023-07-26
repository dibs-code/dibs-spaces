import { useMemo } from 'react';
import { AddressMap } from 'types';
import { useNetwork } from 'wagmi';

export function useContractAddress(addressMap: AddressMap) {
  const { chain } = useNetwork();
  return useMemo(() => chain && addressMap[chain.id], [chain, addressMap]);
}
