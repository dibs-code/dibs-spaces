import './App.css';

import { isSupportedChain } from 'constants/chains';
import Home from 'pages/home';
import Rewards from 'pages/rewards';
import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAccount, useNetwork } from 'wagmi';

import Report from './pages/reports';
import RoutePath from './routes';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { address } = useAccount();
  const { chain } = useNetwork();
  useEffect(() => {
    const walletNotConnected = !address;
    const walletLoadedAndHasWrongChain = chain?.id && !isSupportedChain(chain?.id);
    if ((walletNotConnected || walletLoadedAndHasWrongChain) && location.pathname !== RoutePath.HOME) {
      navigate(RoutePath.HOME, { replace: true });
    }
  }, [chain, location, navigate, address]);
  return (
    <Routes>
      <Route path={RoutePath.HOME} element={<Home />} />
      <Route path={RoutePath.REWARDS} element={<Rewards />} />
      <Route path={RoutePath.REPORTS} element={<Report />} />
    </Routes>
  );
}

export default App;
