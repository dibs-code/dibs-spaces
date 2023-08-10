// import { TokenSymbol } from 'components/basic/input/TokenAddressInput';
// import { RewardAmountsInputs } from 'components/pairIsolated/CreateLeaderBoardModal/RewardAmountsInputs';
// import { ShowPair } from 'components/pairIsolated/CreateLeaderBoardModal/SetPairStage';
import { useLeaderBoardContext } from 'contexts/CreateLeaderBoardModalContext';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RoutePath from 'routes';

// import { Address } from 'wagmi';
import LeaderboardStage from '../../modal/LeaderboardStage';
import { RewardAmountsInputs } from './RewardAmountsInputs';
import { ShowPair } from './SetPairStage';

export function SubmitStage({ onPrev }: { onPrev?: () => void }) {
  const {
    pairAddress,
    allTokenAmounts,
    rewardTokenCount,
    leaderBoardSpotsCount,
    handleTokenAmountChange,
    rewardTokenAddresses,
    createdPairRewarderAddress,
    handleCreatePairRewarder,
    handlePairRewarderSetPrize,
    buttonText,
  } = useLeaderBoardContext();

  const navigate = useNavigate();
  const handleConfirmButtonClick = useCallback(async () => {
    if (!createdPairRewarderAddress) {
      await handleCreatePairRewarder?.();
      alert('LeaderBoard contract created successfully! Now set the rewards');
    } else {
      await handlePairRewarderSetPrize?.();
      alert('Rewards are set!');
      navigate(RoutePath.PAIR_REWARDER_LEADERBOARD.replace(':address', createdPairRewarderAddress));
    }
  }, [createdPairRewarderAddress, handleCreatePairRewarder, handlePairRewarderSetPrize, navigate]);

  return (
    <>
      <section className="w-52 h-20 mx-auto mb-4">
        <LeaderboardStage count={leaderBoardSpotsCount} />
      </section>
      <p className="text-2xl font-medium mb-11 text-white w-full text-center">Create leaderboard</p>

      <section className="flex gap-4 justify-between mb-14">
        <section className="flex-[258]">
          <p className="text-white font-medium text-xl mb-[30px]">Pair</p>
          <div className="pair flex gap-3 items-center mb-8">
            <img src="/assets/images/pair-coin-icon.svg" alt="" className="h-9 w-auto" />
            <p className="text-xl text-white font-medium">
              <ShowPair pairAddress={pairAddress} />
            </p>
          </div>
          <p className="text-white font-medium text-xl mb-5">Token(s)</p>
          <p className="text-white font-medium text-xl">1. DEUS</p>
          <p className="text-white font-medium text-xl">1. USDT</p>
        </section>
        <section className="flex-[490]">
          <p className="text-white font-medium text-xl mb-[30px]">Reward distribution</p>
          <RewardAmountsInputs disabled />
        </section>
      </section>
      {/*<div className="w-full max-w-lg px-8 py-4 mx-auto bg-white rounded-lg shadow-md mt-2">*/}
      {/*  <ShowPair pairAddress={pairAddress} />*/}
      {/*  {rewardTokenAddresses.slice(0, rewardTokenCount).map((tokenAddress, i) => (*/}
      {/*    <div className="border-t-2 py-2" key={i}>*/}
      {/*      {i + 1}. <TokenSymbol address={tokenAddress as Address} />*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*  <RewardAmountsInputs disabled={true} />*/}
      {/*</div>*/}
      <section className="flex justify-between">
        <button className={'btn btn--secondary-outlined'} onClick={onPrev}>
          Edit
        </button>
        <button className={'btn btn--secondary'} onClick={handleConfirmButtonClick}>
          {buttonText}
        </button>
      </section>
    </>
  );
}
