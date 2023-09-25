import './index.sass';
import '@rainbow-me/rainbowkit/styles.css';
import './assets/fonts/fonts.css';

import { ApolloProvider } from '@apollo/client';
import { darkTheme, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chains } from 'constants/chains';
import { AllPairsDataForCurrentDayContextProvider } from 'contexts/AllPairsDataForCurrentDayContext';
import { CoingeckoAssetPlatformsProvider } from 'contexts/CoingeckoAssetPlatformsContext';
import { CreateLeaderBoardModalContextProvider } from 'contexts/CreateLeaderBoardModalContext';
import * as process from 'process';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

import { dibsClient } from './apollo/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

if (!process.env.REACT_APP_WALLETCONNECT_PROJECT_ID) {
  throw new Error('REACT_APP_WALLETCONNECT_PROJECT_ID not provided');
}

if (!process.env.REACT_APP_INFURA_API_KEY) {
  throw new Error('REACT_APP_INFURA_API_KEY not provided');
}

const { publicClient } = configureChains(chains, [
  infuraProvider({ apiKey: process.env.REACT_APP_INFURA_API_KEY }),
  publicProvider(),
]);

const { connectors } = getDefaultWallets({
  appName: 'Dibs',
  projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={dibsClient}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider theme={darkTheme()} chains={chains}>
            <AllPairsDataForCurrentDayContextProvider>
              <CoingeckoAssetPlatformsProvider>
                <CreateLeaderBoardModalContextProvider>
                  <App />
                </CreateLeaderBoardModalContextProvider>
              </CoingeckoAssetPlatformsProvider>
            </AllPairsDataForCurrentDayContextProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export { BuyCard } from 'components/shares/BuyCard';
