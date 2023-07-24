import './App.css';

import { isSupportedChain } from 'constants/chains';
import Home from 'pages/home';
import PairRewarder from 'pages/pair-isolated/_address';
import PairIsolated from 'pages/pair-isolated/index';
import Rewards from 'pages/rewards';
import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import RoutePath, { requiresCode } from 'routes';
import { useAccount, useNetwork } from 'wagmi';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { address } = useAccount();
  const { chain } = useNetwork();
  useEffect(() => {
    const walletNotConnected = !address;
    const walletLoadedAndHasWrongChain = chain?.id && !isSupportedChain(chain?.id);
    if ((walletNotConnected || walletLoadedAndHasWrongChain) && requiresCode(location.pathname)) {
      navigate(RoutePath.HOME, { replace: true });
    }
  }, [chain, location, navigate, address]);
  return (
    <Routes>
      <Route path={RoutePath.HOME} element={<Home />} />
      <Route path={RoutePath.REWARDS} element={<Rewards />} />
      <Route path={RoutePath.PAIR_ISOLATED} element={<PairIsolated />} />
      <Route path={RoutePath.PAIR_REWARDER} element={<PairRewarder />} />
    </Routes>
  );
}

export default App;
