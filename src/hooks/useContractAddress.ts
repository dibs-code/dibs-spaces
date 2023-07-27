import { chains } from 'constants/chains';
import { useMemo } from 'react';
import { AddressMap } from 'types';
import { useNetwork } from 'wagmi';

export function useContractAddress(addressMap: AddressMap) {
  const { chain } = useNetwork();
  return useMemo(() => addressMap[chain?.id ?? chains[0].id], [addressMap, chain?.id]);
}
