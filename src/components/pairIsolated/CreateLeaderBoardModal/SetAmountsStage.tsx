import { RewardAmountsInputs } from 'components/pairIsolated/CreateLeaderBoardModal/RewardAmountsInputs';
import React from 'react';

export function SetAmountsStage({
  allTokenAmounts,
  rewardTokenCount,
  leaderBoardSpotsCount,
  handleTokenAmountChange,
  rewardTokenAddresses,
  onNext,
  onPrev,
}: {
  allTokenAmounts: number[][];
  rewardTokenCount: number;
  rewardTokenAddresses: string[];
  leaderBoardSpotsCount: number;
  handleTokenAmountChange: (rewardIndex: number, tokenIndex: number, newAmount: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
}) {
  return (
    <div className="w-full max-w-lg px-8 py-4 mx-auto bg-white rounded-lg shadow-md mt-2">
      <RewardAmountsInputs
        allTokenAmounts={allTokenAmounts}
        rewardTokenCount={rewardTokenCount}
        leaderBoardSpotsCount={leaderBoardSpotsCount}
        handleTokenAmountChange={handleTokenAmountChange}
        rewardTokenAddresses={rewardTokenAddresses}
      />
      <section className="pagination flex justify-between w-full px-4 gap-20">
        <img src="/assets/images/modal/back-gray.svg" onClick={onPrev} alt="" className="w-8 h-8" />
        <div className="flex mx-auto items-center gap-2">
          <div className="pagination__page bg-gray6 w-[72px] h-2 rounded-full"></div>
          <div className="pagination__page bg-gray6 w-[72px] h-2 rounded-full"></div>
          <div className="pagination__page bg-primary w-[72px] h-2 rounded-full"></div>
        </div>
        <img src="/assets/images/modal/next-colored.svg" onClick={onNext} alt="" className="w-8 h-8 cursor-pointer" />
      </section>
    </div>
  );
}
