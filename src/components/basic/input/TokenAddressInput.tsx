import React from 'react';
import { Address } from 'wagmi';

import { useErc20Symbol } from '../../../abis/types/generated';

export default function TokenAddressInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  // eslint-disable-next-line react/prop-types
  const { value } = props;
  const { data: tokenSymbol } = useErc20Symbol({
    address: value as Address,
  });
  return (
    <>
      <input {...props} />
      {tokenSymbol || 'Unknown Token'}
    </>
  );
}
