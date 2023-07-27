import { dibsABI } from 'abis/types/generated';
import { DibsAddressMap } from 'constants/addresses';
import { useContractAddress } from 'hooks/useContractAddress';
import { useMemo } from 'react';
import { useContractReads } from 'wagmi';

export function useDibsAddresses() {
  const dibsAddress = useContractAddress(DibsAddressMap);
  const args = useMemo(
    () => ({
      address: dibsAddress,
      abi: dibsABI,
    }),
    [dibsAddress],
  );
  const { data: addresses } = useContractReads({
    contracts: [
      {
        ...args,
        functionName: 'dibsLottery',
      },
      {
        ...args,
        functionName: 'muonInterface',
      },
      {
        ...args,
        functionName: 'pairRewarderFactory',
      },
    ],
  });
  return useMemo(
    () => ({
      dibsLotteryAddress: addresses?.[0]?.result,
      muonInterfaceAddress: addresses?.[1]?.result,
      pairRewarderFactoryAddress: addresses?.[2]?.result,
    }),
    [addresses],
  );
}
