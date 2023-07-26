import { multicall } from '@wagmi/core';
import { dibsABI } from 'abis/types/generated';
import { DibsAddressMap } from 'constants/addresses';
import { useContractAddress } from 'hooks/useContractAddress';
import { useEffect, useState } from 'react';
import { Address } from 'wagmi';

export type DibsAddresses = {
  dibsLotteryAddress: Address | undefined;
  muonInterfaceAddress: Address | undefined;
  pairRewarderFactoryAddress: Address | undefined;
};

export function useDibsAddresses() {
  const dibsAddress = useContractAddress(DibsAddressMap);

  const [addresses, setAddresses] = useState<DibsAddresses>({
    dibsLotteryAddress: undefined,
    muonInterfaceAddress: undefined,
    pairRewarderFactoryAddress: undefined,
  });

  useEffect(() => {
    async function getData() {
      if (!dibsAddress) return;
      const args = {
        address: dibsAddress,
        abi: dibsABI,
      };
      const [dibsLotteryAddress, muonInterfaceAddress, pairRewarderFactoryAddress] = await multicall({
        allowFailure: false,
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
      setAddresses({
        dibsLotteryAddress,
        muonInterfaceAddress,
        pairRewarderFactoryAddress,
      });
    }

    getData();
  }, [dibsAddress]);
  return addresses;
}
