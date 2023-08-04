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

      <section className="pagination flex justify-between w-full px-4 gap-20">
        <img src="/assets/images/modal/back-gray.svg" onClick={onPrev} alt="" className="w-8 h-8" />
        <div className="flex mx-auto items-center gap-2">
          <div className="pagination__page bg-gray6 w-[72px] h-2 rounded-full"></div>
          <div className="pagination__page bg-primary w-[72px] h-2 rounded-full"></div>
          <div className="pagination__page bg-gray6 w-[72px] h-2 rounded-full"></div>
        </div>
        <img src="/assets/images/modal/next-colored.svg" onClick={onNext} alt="" className="w-8 h-8 cursor-pointer" />
      </section>
    </div>
  );
}
