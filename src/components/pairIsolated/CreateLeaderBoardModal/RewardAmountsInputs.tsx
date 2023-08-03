import { TokenSymbol } from 'components/basic/input/TokenAddressInput';
import { useCoinGeckoTokenAmountsToUsd } from 'hooks/useCoinGeckoPrice';
import React from 'react';
import { Address } from 'wagmi';

export function RewardAmountInputRow({
  index,
  leaderboardSpotTokenAmounts,
  rewardTokenCount,
  handleTokenAmountChange,
  rewardTokenAddresses,
}: {
  index: number;
  leaderboardSpotTokenAmounts: number[];
  rewardTokenCount: number;
  rewardTokenAddresses: string[];
  handleTokenAmountChange: (rewardIndex: number, tokenIndex: number, newAmount: number) => void;
}) {
  const { totalAmountUsd } = useCoinGeckoTokenAmountsToUsd(
    rewardTokenAddresses as Address[],
    leaderboardSpotTokenAmounts,
  );
  return (
    <div className="border-t-2 py-2">
      <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="tokenCount">
        {index + 1}
      </label>
      <div className="flex py-2 flex-wrap">
        {leaderboardSpotTokenAmounts.map((rewardAmount, j, arr) => (
          <div className={'w-1/2 px-2 flex'} key={j}>
            <input
              type="number"
              className="block w-1/2 px-4 py-2 border border-gray-300 rounded-md"
              value={rewardAmount}
              onChange={(event) => handleTokenAmountChange(index, j, Number(event.target.value))}
            />
            <TokenSymbol address={rewardTokenAddresses[j] as Address} />
            {j !== arr.length - 1 && '+'}
          </div>
        ))}
        = {totalAmountUsd ?? '...'}$
      </div>
    </div>
  );
}

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
        <RewardAmountInputRow
          key={i}
          index={i}
          leaderboardSpotTokenAmounts={leaderboardSpotTokenAmounts.slice(0, rewardTokenCount)}
          rewardTokenCount={rewardTokenCount}
          handleTokenAmountChange={handleTokenAmountChange}
          rewardTokenAddresses={rewardTokenAddresses}
        />
      ))}
    </>
  );
}
