import { useCreateLeaderBoardModalContext } from 'contexts/CreateLeaderBoardModalContext';
import React from 'react';

import LeaderboardStage from '../../modal/LeaderboardStage';

export function SetTokensStage({ onNext, onPrev }: { onNext?: () => void; onPrev?: () => void }) {
  const {
    handleTokenAddressChange,
    leaderBoardSpotsCount,
    rewardTokenAddresses,
    rewardTokenCount,
    setRewardTokenCount,
  } = useCreateLeaderBoardModalContext();
  return (
    <>
      <section className="w-52 h-20 mx-auto mb-4">
        <LeaderboardStage count={leaderBoardSpotsCount} />
      </section>
      <p className="text-2xl font-medium mb-11 text-white w-full text-center">Create leaderboard</p>

      <section className="leaderboard-spots mb-14 h-[342px] overflow-y-auto styled-scroll">
        <p className="text-white font-medium text-xl mb-8">Enter the tokens for distribution as rewards.</p>
        {rewardTokenAddresses.slice(0, rewardTokenCount).map((tokenAddress, i) => (
          <div className="flex mb-2.5 gap-3" key={i}>
            <span className="rounded min-w-14 w-14 min-h-12 h-12 flex justify-center items-center bg-gray4 ">
              <p className="text-white text-2xl font-medium">{i + 1}</p>
            </span>
            <input
              className="w-full max-h-12 rounded text-white bg-gray4 pl-4 pt-[15px] pb-3.5 pr-2 font-medium"
              placeholder="Token contract address"
              value={tokenAddress}
              onChange={(event) => handleTokenAddressChange(i, event.target.value)}
            />
            {/*<TokenAddressInput*/}
            {/*  type="text"*/}
            {/*  className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"*/}
            {/*  value={tokenAddress}*/}
            {/*  placeholder={`Token Address`}*/}
            {/*  onChange={(event) => handleTokenAddressChange(i, event.target.value)}*/}
            {/*/>*/}
          </div>
        ))}
        {rewardTokenCount < 4 && (
          <button
            className={
              'rounded min-w-12 w-12 min-h-12 h-12 flex justify-center items-center bg-secondary font-medium text-white text-2xl pt-1'
            }
            onClick={() => setRewardTokenCount((count) => Math.min(count + 1, 4))}
          >
            +
          </button>
        )}
      </section>

      {/*<div className="w-full max-w-lg px-8 py-4 mx-auto bg-white rounded-lg shadow-md mt-2">*/}
      {/*  {rewardTokenAddresses.slice(0, rewardTokenCount).map((tokenAddress, i) => (*/}
      {/*    <div className="border-t-2 py-2" key={i}>*/}
      {/*      <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="tokenCount">*/}
      {/*        Reward Token {i + 1}*/}
      {/*      </label>*/}
      {/*      <TokenAddressInput*/}
      {/*        type="text"*/}
      {/*        className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"*/}
      {/*        value={tokenAddress}*/}
      {/*        placeholder={`Token Address`}*/}
      {/*        onChange={(event) => handleTokenAddressChange(i, event.target.value)}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*  <div></div>*/}
      {/*</div>*/}
      <section className="pagination flex justify-between w-full px-4 gap-20">
        <img src="/assets/images/modal/back-colored.svg" onClick={onPrev} alt="" className="w-8 h-8 cursor-pointer" />
        <div className="flex mx-auto items-center gap-2">
          <div className="pagination__page bg-gray6 w-[72px] h-2 rounded-full"></div>
          <div className="pagination__page bg-primary w-[72px] h-2 rounded-full"></div>
          <div className="pagination__page bg-gray6 w-[72px] h-2 rounded-full"></div>
        </div>
        <img src="/assets/images/modal/next-colored.svg" onClick={onNext} alt="" className="w-8 h-8 cursor-pointer" />
      </section>
    </>
  );
}
