import { useDibsGetCodeName, useDibsParents } from 'abis/types/generated';
import { DibsAddressMap } from 'constants/addresses';
import { useContractAddress } from 'hooks/useContractAddress';
import { useAccount } from 'wagmi';

export function useDibsCodeData() {
  const { address } = useAccount();
  const dibsAddress = useContractAddress(DibsAddressMap);

  const { data: addressToName } = useDibsGetCodeName({
    address: dibsAddress,
    args: address ? [address] : undefined,
    watch: true,
  });

  const { data: parent } = useDibsParents({
    address: dibsAddress,
    args: address ? [address] : undefined,
    watch: true,
  });

  const { data: parentCodeName } = useDibsGetCodeName({
    address: dibsAddress,
    args: parent ? [parent] : undefined,
    watch: true,
  });

  return {
    addressToName,
    parent,
    parentCodeName,
  };
}
