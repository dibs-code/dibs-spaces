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
  author: Address | undefined;
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
      const [symbols, names, authors] = await Promise.all([
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
        multicall({
          contracts: allBondingTokenAddresses?.map((bondingTokenAddress) => ({
            abi: bondingTokenABI,
            address: bondingTokenAddress,
            functionName: 'author',
          })),
        }),
      ]);
      setAllBondingTokens(
        allBondingTokenAddresses.map((bondingTokenAddress, i) => ({
          address: bondingTokenAddress,
          symbol: symbols[i].result,
          name: names[i].result,
          author: authors[i].result,
        })),
      );
    }

    getData();
  }, [allBondingTokensLength, dibsSharesAddress]);

  return (
    <div className="text-white bg-gray-800 p-6">
      <Link
        to={RoutePath.SHARES_CREATE}
        className="inline-block px-4 py-2 text-center text-white btn--secondary rounded hover:bg-white hover:text-gray-800"
      >
        Create Share
      </Link>
      <table className="table-auto w-full mt-6 text-left rounded">
        <thead>
          <tr className="text-gray-800">
            <th className="px-4 py-2">name</th>
            <th className="px-4 py-2">symbol</th>
            <th className="px-4 py-2">author</th>
            <th className="px-4 py-2">link</th>
          </tr>
        </thead>
        <tbody>
          {allBondingTokens?.map((bondingToken) => (
            <tr key={bondingToken.address} className="text-gray-700">
              <td className="border px-4 py-2">{bondingToken.name}</td>
              <td className="border px-4 py-2">{bondingToken.symbol}</td>
              <td className="border px-4 py-2">{bondingToken.author}</td>
              <td className="border px-4 py-2">
                <Link
                  to={RoutePath.SHARES_SHARE.replace(':address', bondingToken.address)}
                  className="text-blue-500 hover:text-blue-800 underline"
                >
                  Trade
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Shares;
