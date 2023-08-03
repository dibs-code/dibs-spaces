import { TokenSymbol } from 'components/basic/input/TokenAddressInput';
import { RewardAmountsInputs } from 'components/pairIsolated/CreateLeaderBoardModal/RewardAmountsInputs';
import { ShowPair } from 'components/pairIsolated/CreateLeaderBoardModal/SetPairStage';
import usePairRewarderCreateAndSetPrize from 'hooks/dibs/usePairRewarderCreateAndSetPrize';
import React from 'react';
import { Address } from 'wagmi';

export function SubmitStage({
  pairAddress,
  allTokenAmounts,
  rewardTokenCount,
  leaderBoardSpotsCount,
  handleTokenAmountChange,
  rewardTokenAddresses,
  onPrev,
}: ReturnType<typeof usePairRewarderCreateAndSetPrize> & {
  onPrev?: () => void;
}) {
  return (
    <div className="w-full max-w-lg px-8 py-4 mx-auto bg-white rounded-lg shadow-md mt-2">
      <ShowPair pairAddress={pairAddress} />
      {rewardTokenAddresses.slice(0, rewardTokenCount).map((tokenAddress, i) => (
        <div className="border-t-2 py-2" key={i}>
          {i + 1}. <TokenSymbol address={tokenAddress as Address} />
        </div>
      ))}
      <RewardAmountsInputs
        allTokenAmounts={allTokenAmounts}
        rewardTokenCount={rewardTokenCount}
        leaderBoardSpotsCount={leaderBoardSpotsCount}
        handleTokenAmountChange={handleTokenAmountChange}
        rewardTokenAddresses={rewardTokenAddresses}
      />
      <button className={'btn-medium btn-primary'} onClick={onPrev}>
        Edit
      </button>
      <button className={'btn-medium btn-primary'}>Create</button>
    </div>
  );
}
