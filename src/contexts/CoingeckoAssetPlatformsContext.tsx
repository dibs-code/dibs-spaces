import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { CoinGeckoAssetPlatform } from 'types';

// Define the context
const CoingeckoAssetPlatformsContext = createContext<CoinGeckoAssetPlatform[] | null>(null);

interface PlatformsProviderProps {
  children: ReactNode;
}

// Define the Provider component
export const CoingeckoAssetPlatformsProvider: React.FC<PlatformsProviderProps> = ({ children }) => {
  const [platforms, setPlatforms] = useState<CoinGeckoAssetPlatform[] | null>(null);

  const fetchPlatforms = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/asset_platforms');
      const data = await response.json();
      // Store into localStorage along with the timestamp
      localStorage.setItem('coingeckoAssetPlatforms', JSON.stringify(data));
      localStorage.setItem('coingeckoAssetPlatformsFetchTimestamp', Date.now().toString());
      setPlatforms(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const coingeckoAssetPlatforms = localStorage.getItem('coingeckoAssetPlatforms');
    const coingeckoAssetPlatformsFetchTimestamp = localStorage.getItem('coingeckoAssetPlatformsFetchTimestamp');
    if (
      coingeckoAssetPlatforms &&
      coingeckoAssetPlatformsFetchTimestamp &&
      (Date.now() - +coingeckoAssetPlatformsFetchTimestamp) / 1000 / 60 <= 60
    ) {
      // Data exists and is not more than 1 hour old
      setPlatforms(JSON.parse(coingeckoAssetPlatforms));
    } else {
      fetchPlatforms();
    }
  }, []);

  return (
    <CoingeckoAssetPlatformsContext.Provider value={platforms}>{children}</CoingeckoAssetPlatformsContext.Provider>
  );
};

// Use this hook in your components to get access to asset platform data
export const useCoingeckoAssetPlatforms = () => useContext(CoingeckoAssetPlatformsContext);
