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

      //TODO: remove this hardcoded contract
      if (dibsAddress.toLowerCase() === '0xe3da69b64641a84509aca772e545c8f048a4643c') {
        setAddresses({
          dibsLotteryAddress: '0xF5e1C6ac54c4C8a654bd0E04D52A357E672d3FEa',
          muonInterfaceAddress: '0x0000000000000000000000000000000000000000',
          pairRewarderFactoryAddress: '0x27Cac1957068F28A86789B750E5eb3714324A2A5',
        });
        return;
      }

      const args = {
        address: dibsAddress,
        abi: dibsABI,
      };
      const [dibsLotteryAddress, muonInterfaceAddress, pairRewarderFactoryAddress] = await multicall({
        allowFailure: true,
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
        dibsLotteryAddress: dibsLotteryAddress.result,
        muonInterfaceAddress: muonInterfaceAddress.result,
        pairRewarderFactoryAddress: pairRewarderFactoryAddress.result,
      });
    }

    getData();
  }, [dibsAddress]);
  return addresses;
}
