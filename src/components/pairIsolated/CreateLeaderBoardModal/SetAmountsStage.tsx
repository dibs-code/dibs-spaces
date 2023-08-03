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
      <button className={'btn-medium btn-primary'} onClick={onPrev}>
        Prev
      </button>
      <button className={'btn-medium btn-primary'} onClick={onNext}>
        Next
      </button>
    </div>
  );
}
