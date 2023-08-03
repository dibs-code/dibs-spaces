import './App.css';

import { isSupportedChain } from 'constants/chains';
import Home from 'pages/home';
import PairRewarderLeaderboard from 'pages/pair-isolated/_address/leaderboard';
import PairIsolated from 'pages/pair-isolated/index';
import Rewards from 'pages/rewards';
import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import RoutePath, { requiresCode } from 'routes';
import { useAccount, useNetwork } from 'wagmi';

import Navbar from './components/navigation/navbar';

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
    <div className="app">
      <Navbar />
      <Routes>
        <Route path={RoutePath.HOME} element={<Home />} />
        <Route path={RoutePath.REWARDS} element={<Rewards />} />
        <Route path={RoutePath.PAIR_ISOLATED} element={<PairIsolated />} />
        <Route path={RoutePath.PAIR_REWARDER_LEADERBOARD} element={<PairRewarderLeaderboard />} />
      </Routes>
    </div>
  );
}

export default App;
