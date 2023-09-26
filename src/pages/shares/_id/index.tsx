import { useBondingTokenName, useBondingTokenSpotPrice, useBondingTokenSymbol } from 'abis/types/generated';
import { BuyCard } from 'components/shares/BuyCard';
import { SellCard } from 'components/shares/SellCard';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { formatUnits } from 'viem';
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
  const { data: spotPrice } = useBondingTokenSpotPrice({
    address: bondingTokenAddress,
  });
  const spotPriceParsed = useMemo(
    () => (spotPrice !== undefined ? Number(formatUnits(spotPrice, 18)) : undefined),
    [spotPrice],
  );
  return (
    <div style={{ color: 'white' }}>
      <div>
        {tokenName} ({bondingTokenSymbol})
      </div>
      <div>Spot Price: {spotPriceParsed ? spotPriceParsed.toLocaleString() : '...'}</div>
      <br />
      <BuyCard bondingTokenAddress={bondingTokenAddress} />
      <br />
      <SellCard bondingTokenAddress={bondingTokenAddress} />
    </div>
  );
};

export default Share;
