import { useBondingTokenName, useBondingTokenSymbol } from 'abis/types/generated';
import { BuyCard } from 'components/shares/BuyCard';
import { SellCard } from 'components/shares/SellCard';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Address } from 'wagmi';

const Share = () => {
  const { address: tokenAddressParam } = useParams();
  if (!tokenAddressParam) throw Error('address not defined');
  const bondingTokenAddress = tokenAddressParam as Address;
  const { data: tokenName } = useBondingTokenName({
    address: bondingTokenAddress,
  });
  const { data: bondingTokenSymbol } = useBondingTokenSymbol({
    address: bondingTokenAddress,
  });
  return (
    <div style={{ color: 'white' }}>
      <div>
        {tokenName} ({bondingTokenSymbol})
      </div>
      <br />
      <BuyCard bondingTokenAddress={bondingTokenAddress} />
      <br />
      <SellCard bondingTokenAddress={bondingTokenAddress} />
    </div>
  );
};

export default Share;
