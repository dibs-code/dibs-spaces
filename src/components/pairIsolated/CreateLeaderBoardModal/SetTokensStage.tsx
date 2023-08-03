import TokenAddressInput from 'components/basic/input/TokenAddressInput';
import React from 'react';

export function SetTokensStage({
  rewardTokenAddresses,
  handleTokenAddressChange,
  rewardTokenCount,
  setRewardTokenCount,
  onNext,
  onPrev,
}: {
  rewardTokenAddresses: string[];
  handleTokenAddressChange: (index: number, address: string) => void;
  rewardTokenCount: number;
  setRewardTokenCount: React.Dispatch<React.SetStateAction<number>>;
  onNext?: () => void;
  onPrev?: () => void;
}) {
  return (
    <div className="w-full max-w-lg px-8 py-4 mx-auto bg-white rounded-lg shadow-md mt-2">
      {rewardTokenAddresses.slice(0, rewardTokenCount).map((tokenAddress, i) => (
        <div className="border-t-2 py-2" key={i}>
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="tokenCount">
            Reward Token {i + 1}
          </label>
          <TokenAddressInput
            type="text"
            className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            value={tokenAddress}
            placeholder={`Token Address`}
            onChange={(event) => handleTokenAddressChange(i, event.target.value)}
          />
        </div>
      ))}
      <div>
        <button
          className={'btn-medium btn-primary'}
          onClick={() => setRewardTokenCount((count) => Math.min(count + 1, 4))}
        >
          +
        </button>
      </div>

      <button className={'btn-medium btn-primary'} onClick={onPrev}>
        Prev
      </button>
      <button className={'btn-medium btn-primary'} onClick={onNext}>
        Next
      </button>
    </div>
  );
}
