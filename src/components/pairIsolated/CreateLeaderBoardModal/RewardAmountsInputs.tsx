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
    <div className="flex flex-col mb-2.5 gap-3">
      {leaderboardSpotTokenAmounts.map((rewardAmount, j, arr) => (
        <div className="flex items-center text-white gap-3" key={j}>
          <span className="rounded min-w-12 w-12 min-h-12 h-12 flex justify-center items-center bg-gray4 text-white text-2xl font-medium">
            {j + 1}
          </span>
          <div
            className="w-[150px] pl-4 pr-3.5 text-sm font-semibold flex bg-gray4 rounded h-12 items-center justify-between"
            key={j}
          >
            <input
              type="number"
              placeholder="amount"
              className="bg-transparent w-1/2"
              value={rewardAmount}
              onChange={(event) => handleTokenAmountChange(index, j, Number(event.target.value))}
            />
            <TokenSymbol address={rewardTokenAddresses[j] as Address} />
          </div>
          <p className="font-medium text-2xl">+</p>
          <div
            className="w-[150px] pl-4 pr-3.5 text-sm font-semibold flex bg-gray4 rounded h-12 items-center justify-between"
            key={j}
          >
            <input
              type="number"
              placeholder="amount"
              className="bg-transparent w-1/2"
              value={rewardAmount}
              onChange={(event) => handleTokenAmountChange(index, j, Number(event.target.value))}
            />
            <TokenSymbol address={rewardTokenAddresses[j] as Address} />
          </div>
          <p className="text-xl font-medium">≈</p>
          <p className="text-xl font-medium">250$</p>
        </div>
      ))}
      {/*= {totalAmountUsd ?? '...'}$*/}
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
