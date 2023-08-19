import { RewardAmountsInputs } from 'components/pairIsolated/CreateLeaderBoardModal/RewardAmountsInputs';
import { TotalRewardInUsd } from 'components/rewards/RewardAmounts';
import { useLeaderBoardContext } from 'contexts/CreateLeaderBoardModalContext';
import React from 'react';

import LeaderboardStage from '../../modal/LeaderboardStage';

export function SetAmountsStage({ onNext, onPrev }: { onNext?: () => void; onPrev?: () => void }) {
  const { finalRewardTokenSymbols, finalRewardTokenAddresses, finalTokenAmountsAggregate, leaderBoardSpotsCount } =
    useLeaderBoardContext();

  return (
    <>
      <section className="w-52 h-20 mx-auto mb-4">
        <LeaderboardStage count={leaderBoardSpotsCount} />
      </section>
      <p className="text-2xl font-medium mb-11 text-white w-full text-center">Create leaderboard</p>

      <section className="leaderboard-spots mb-14">
        <p className="text-white font-medium text-xl mb-8">Specify the reward amount for each spot</p>
        <section className="w-full mb-3.5 border-b border-gray7 border-dashed h-[240px] overflow-y-auto styled-scroll">
          <RewardAmountsInputs />
        </section>
        <section className="total flex gap-3">
          <p className="text-white font-medium text-xl w-[398px]">
            Total:{' '}
            {finalRewardTokenSymbols.map((symbol, i) => finalTokenAmountsAggregate[i] + ' ' + symbol).join(' + ')}
          </p>
          {/*<p className="text-white font-medium text-xl w-[398px]">Total: 2000 USDC + 900 DEUS</p>*/}
          <p className="text-xl font-medium text-white">≈</p>
          <p className="text-xl font-medium text-white">
            <TotalRewardInUsd rewardTokens={finalRewardTokenAddresses} rewardAmounts={finalTokenAmountsAggregate} />
          </p>
        </section>
      </section>

      <section className="pagination flex justify-between w-full px-4 gap-20">
        <img src="/assets/images/modal/back-colored.svg" onClick={onPrev} alt="" className="w-8 h-8 cursor-pointer" />
        <div className="flex mx-auto items-center gap-2">
          <div className="pagination__page bg-gray6 w-[72px] h-2 rounded-full"></div>
          <div className="pagination__page bg-gray6 w-[72px] h-2 rounded-full"></div>
          <div className="pagination__page bg-primary w-[72px] h-2 rounded-full"></div>
        </div>
        <img src="/assets/images/modal/next-colored.svg" onClick={onNext} alt="" className="w-8 h-8 cursor-pointer" />
      </section>
    </>
  );
}
