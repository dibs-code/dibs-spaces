import { useDibsGetCodeName, useDibsParents } from 'abis/types/generated';
import { DibsAddressMap } from 'constants/addresses';
import { useContractAddress } from 'hooks/useContractAddress';
import useTestOrRealData from 'hooks/useTestOrRealData';
import { Address } from 'wagmi';

export function useDibsCodeData(address: Address | undefined) {
  const dibsAddress = useContractAddress(DibsAddressMap);
  const { chainId } = useTestOrRealData();

  const { data: addressToName } = useDibsGetCodeName({
    address: dibsAddress,
    args: address ? [address] : undefined,
    watch: true,
    chainId,
  });

  const { data: parent } = useDibsParents({
    address: dibsAddress,
    args: address ? [address] : undefined,
    watch: true,
    chainId,
  });

  const { data: parentCodeName } = useDibsGetCodeName({
    address: dibsAddress,
    args: parent ? [parent] : undefined,
    watch: true,
    chainId,
  });

  return {
    addressToName,
    parent,
    parentCodeName,
  };
}
