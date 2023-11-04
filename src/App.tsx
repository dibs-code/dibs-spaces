import './App.css';

import CreateLeaderBoardModal from 'components/pairIsolated/CreateLeaderBoardModal';
import { isSupportedChain } from 'constants/chains';
import { useCreateLeaderBoardModalContext } from 'contexts/CreateLeaderBoardModalContext';
import Home from 'pages/home';
import PairRewarderLeaderboard from 'pages/pair-isolated/_address/leaderboard';
import PairIsolated from 'pages/pair-isolated/index';
import Rewards from 'pages/rewards';
import RewardsTest from 'pages/rewards-test';
import Shares from 'pages/shares';
import Share from 'pages/shares/_id';
import CreateShares from 'pages/shares/create';
import SharesSetChat from 'pages/shares/setchat';
import YourCodeTest from 'pages/your-code-test';
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
      navigate(RoutePath.YOUR_CODE, { replace: true });
    }
  }, [chain, location, navigate, address]);
  const { createLeaderBoardModalOpen, setCreateLeaderBoardModalOpen } = useCreateLeaderBoardModalContext();
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path={RoutePath.YOUR_CODE} element={<Home />} />
        <Route path={RoutePath.YOUR_CODE_TEST} element={<YourCodeTest />} />
        <Route path={RoutePath.SHARES} element={<Shares />} />
        <Route path={RoutePath.SHARES_CREATE} element={<CreateShares />} />
        <Route path={RoutePath.SHARES_SHARE} element={<Share />} />
        <Route path={RoutePath.SHARES_SET_CHAT} element={<SharesSetChat />} />
        <Route path={RoutePath.REWARDS} element={<Rewards />} />
        <Route path={RoutePath.REWARDS_TEST} element={<RewardsTest />} />
        <Route path={RoutePath.PAIR_ISOLATED} element={<PairIsolated />} />
        <Route path={RoutePath.PAIR_REWARDER_LEADERBOARD} element={<PairRewarderLeaderboard />} />
      </Routes>
      <CreateLeaderBoardModal
        open={createLeaderBoardModalOpen}
        closeModal={() => setCreateLeaderBoardModalOpen(false)}
      />
    </div>
  );
}

export default App;
