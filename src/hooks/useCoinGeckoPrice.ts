import { useCoingeckoAssetPlatforms } from 'contexts/CoingeckoAssetPlatformsContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, useNetwork } from 'wagmi';

export function useCoinGeckoPriceCallback() {
  const assetPlatforms = useCoingeckoAssetPlatforms();
  const { chain } = useNetwork();
  return useCallback(
    async (tokenAddress: Address | null | undefined, chainId?: number | null | undefined): Promise<number | null> => {
      const priceChainId = chainId ?? chain?.id;
      if (!tokenAddress || !priceChainId || !assetPlatforms) return null;
      const assetPlatformId = assetPlatforms.find(
        (assetPlatform) => assetPlatform.chain_identifier === priceChainId,
      )?.id;
      if (!assetPlatformId) {
        return 0;
      }
      const data: { [key: Address]: { usd: number } } = await (
        await fetch(
          `https://api.coingecko.com/api/v3/simple/token_price/${assetPlatformId}?contract_addresses=${tokenAddress}&vs_currencies=usd`,
        )
      ).json();
      return data[tokenAddress].usd;
    },
    [assetPlatforms, chain?.id],
  );
}

export function useCoinGeckoPrice(tokenAddress: Address | null | undefined, chainId?: number | null | undefined) {
  const [tokenPrice, setTokenPrice] = useState<number | null>(null);
  const assetPlatforms = useCoingeckoAssetPlatforms();
  const coinGeckoPriceCallback = useCoinGeckoPriceCallback();
  useEffect(() => {
    coinGeckoPriceCallback(tokenAddress, chainId)
      .then((response) => {
        if (response !== null) setTokenPrice(response);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [assetPlatforms, chainId, coinGeckoPriceCallback, tokenAddress]);

  return { price: tokenPrice };
}

export function useCoinGeckoTokenAmountsToUsd(
  tokenAddresses: Address[],
  amounts: number[],
  chainId?: number | null | undefined,
) {
  const [tokenPrices, setTokenPrices] = useState<(number | null)[] | null>([]);
  const assetPlatforms = useCoingeckoAssetPlatforms();
  const coinGeckoPriceCallback = useCoinGeckoPriceCallback();
  useEffect(() => {
    Promise.all(tokenAddresses?.map((tokenAddress, i) => coinGeckoPriceCallback(tokenAddress, chainId)))
      .then((response) => {
        if (response) setTokenPrices(response);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [assetPlatforms, chainId, coinGeckoPriceCallback, tokenAddresses]);
  const totalAmountUsd = useMemo(() => {
    return tokenPrices?.reduce<number>((a, c, i) => (c ? a + c * (amounts[i] || 0) : a), 0);
  }, [amounts, tokenPrices]);
  return { totalAmountUsd };
}
