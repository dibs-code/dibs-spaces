import './index.sass';
import '@rainbow-me/rainbowkit/styles.css';

import { ApolloProvider } from '@apollo/client';
import { darkTheme, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, bsc, mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import { dibsClient } from './apollo/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const chains = [arbitrum, mainnet, bsc];

if (!process.env.REACT_APP_WALLETCONNECT_PROJECT_ID) {
  throw new Error('REACT_APP_WALLETCONNECT_PROJECT_ID not provided');
}

const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID;

const { publicClient } = configureChains(chains, [
  // w3mProvider({
  //   projectId
  // }),
  publicProvider(),
]);

const { connectors } = getDefaultWallets({
  appName: 'Dibs',
  projectId,
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
            <App />
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
