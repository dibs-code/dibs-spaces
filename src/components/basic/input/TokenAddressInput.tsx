import { useErc20Symbol } from 'abis/types/generated';
import React from 'react';
import { Address } from 'wagmi';

export function TokenSymbol({ address }: { address: Address }) {
  const { data: tokenSymbol } = useErc20Symbol({
    address,
  });
  return <>{tokenSymbol || 'Unknown Token'}</>;
}

export default function TokenAddressInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  // eslint-disable-next-line react/prop-types
  const { value } = props;
  return (
    <>
      <input {...props} />
      <TokenSymbol address={value as Address} />
    </>
  );
}
