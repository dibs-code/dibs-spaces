import { multicall } from '@wagmi/core';
import { bondingTokenABI, dibsSharesABI, useDibsSharesAllBondingTokensLength } from 'abis/types/generated';
import { DibsSharesAddressMap } from 'constants/addresses';
import { useContractAddress } from 'hooks/useContractAddress';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RoutePath from 'routes';
import { Address } from 'wagmi';

type BondingTokenItem = {
  address: Address;
  name: string | undefined;
  symbol: string | undefined;
};
const Shares = () => {
  const dibsSharesAddress = useContractAddress(DibsSharesAddressMap);

  const { data: allBondingTokensLength } = useDibsSharesAllBondingTokensLength({
    address: dibsSharesAddress,
  });

  const [allBondingTokens, setAllBondingTokens] = useState<BondingTokenItem[] | null>(null);

  useEffect(() => {
    async function getData() {
      if (!allBondingTokensLength || !dibsSharesAddress) return;

      const allBondingTokenAddresses = await multicall({
        allowFailure: false,
        contracts: Object.keys(Array(Number(allBondingTokensLength)).fill(null)).map((item) => ({
          address: dibsSharesAddress,
          abi: dibsSharesABI,
          functionName: 'allBondingTokens',
          args: [BigInt(item)],
        })),
      });
      const [symbols, names] = await Promise.all([
        multicall({
          contracts: allBondingTokenAddresses?.map((bondingTokenAddress) => ({
            abi: bondingTokenABI,
            address: bondingTokenAddress,
            functionName: 'symbol',
          })),
        }),
        multicall({
          contracts: allBondingTokenAddresses?.map((bondingTokenAddress) => ({
            abi: bondingTokenABI,
            address: bondingTokenAddress,
            functionName: 'name',
          })),
        }),
      ]);
      setAllBondingTokens(
        allBondingTokenAddresses.map((bondingTokenAddress, i) => ({
          address: bondingTokenAddress,
          symbol: symbols[i].result,
          name: names[i].result,
        })),
      );
    }

    getData();
  }, [allBondingTokensLength, dibsSharesAddress]);

  return (
    <div style={{ color: 'white' }}>
      <Link to={RoutePath.SHARES_CREATE} className={'btn btn--secondary-outlined py-1.5'}>
        Create Share
      </Link>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>symbol</th>
            <th>view</th>
          </tr>
        </thead>
        <tbody>
          {allBondingTokens?.map((bondingToken) => (
            <tr key={bondingToken.address}>
              <td>{bondingToken.name}</td>
              <td>{bondingToken.symbol}</td>
              <td>
                <Link to={RoutePath.SHARES_SHARE.replace(':address', bondingToken.address)}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Shares;
