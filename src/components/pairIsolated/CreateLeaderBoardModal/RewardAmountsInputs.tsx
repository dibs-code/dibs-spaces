import { TokenSymbol } from 'components/basic/input/TokenAddressInput';
import React from 'react';
import { Address } from 'wagmi';

export function RewardAmountsInputs({
  allTokenAmounts,
  rewardTokenCount,
  leaderBoardSpotsCount,
  handleTokenAmountChange,
  rewardTokenAddresses,
}: {
  allTokenAmounts: number[][];
  rewardTokenCount: number;
  rewardTokenAddresses: string[];
  leaderBoardSpotsCount: number;
  handleTokenAmountChange: (rewardIndex: number, tokenIndex: number, newAmount: number) => void;
}) {
  return (
    <>
      {allTokenAmounts.slice(0, leaderBoardSpotsCount).map((leaderboardSpotTokenAmounts, i) => (
        <div className="border-t-2 py-2" key={i}>
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="tokenCount">
            {i + 1}
          </label>
          <div className="flex py-2 flex-wrap">
            {leaderboardSpotTokenAmounts.slice(0, rewardTokenCount).map((rewardAmount, j, arr) => (
              <div className={'w-1/2 px-2 flex'} key={j}>
                <input
                  type="number"
                  className="block w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                  value={rewardAmount}
                  onChange={(event) => handleTokenAmountChange(i, j, Number(event.target.value))}
                />
                <TokenSymbol address={rewardTokenAddresses[j] as Address} />
                {j !== arr.length - 1 && '+'}
              </div>
            ))}
            = 340$
          </div>
        </div>
      ))}
    </>
  );
}
