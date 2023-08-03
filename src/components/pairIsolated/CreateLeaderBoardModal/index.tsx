import TokenAddressInput, { TokenSymbol } from 'components/basic/input/TokenAddressInput';
import Modal, { ModalProps } from 'components/modal';
import { SetPairStage, ShowPair } from 'components/pairIsolated/CreateLeaderBoardModal/SetPairStage';
import usePairRewarderCreateAndSetPrize from 'hooks/dibs/usePairRewarderCreateAndSetPrize';
import React, { useState } from 'react';
import { Address } from 'wagmi';

export enum CreateLeaderBoardStage {
  SET_PAIR,
  SET_TOKENS,
  SET_AMOUNTS,
  SUBMIT,
}

function SetTokensStage({
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

function SetAmountsStage({
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
      <button className={'btn-medium btn-primary'} onClick={onPrev}>
        Prev
      </button>
      <button className={'btn-medium btn-primary'} onClick={onNext}>
        Next
      </button>
    </div>
  );
}

function SubmitStage({
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
      <button className={'btn-medium btn-primary'} onClick={onPrev}>
        Edit
      </button>
      <button className={'btn-medium btn-primary'}>Create</button>
    </div>
  );
}

export default function CreateLeaderBoardModal(props: ModalProps) {
  const [createLeaderBoardStage, setCreateLeaderBoardStage] = useState(CreateLeaderBoardStage.SET_PAIR);
  const hookData = usePairRewarderCreateAndSetPrize();
  const {
    leaderBoardSpotsCount,
    setLeaderBoardSpotsCount,
    setRewardTokenCount,
    setRewardTokenAddresses,
    setAllTokenAmounts,
    pairName,
    pairAddress,
    setPairAddress,
    rewardTokenCount,
    rewardTokenAddresses,
    allTokenAmounts,
    handleTokenAmountChange,
    handlePairRewarderSetPrize,
    handleTokenAddressChange,
    handleConfirmButtonClick,
    pending,
    activeLeaderBoardInfo,
  } = hookData;
  return (
    <Modal {...props}>
      <div>
        {createLeaderBoardStage === CreateLeaderBoardStage.SET_PAIR ? (
          <SetPairStage
            leaderBoardSpotsCount={leaderBoardSpotsCount}
            setLeaderBoardSpotsCount={setLeaderBoardSpotsCount}
            pairAddress={pairAddress}
            setPairAddress={setPairAddress}
            onNext={() => setCreateLeaderBoardStage(CreateLeaderBoardStage.SET_TOKENS)}
          />
        ) : createLeaderBoardStage === CreateLeaderBoardStage.SET_TOKENS ? (
          <SetTokensStage
            rewardTokenAddresses={rewardTokenAddresses}
            handleTokenAddressChange={handleTokenAddressChange}
            rewardTokenCount={rewardTokenCount}
            setRewardTokenCount={setRewardTokenCount}
            onPrev={() => setCreateLeaderBoardStage(CreateLeaderBoardStage.SET_PAIR)}
            onNext={() => setCreateLeaderBoardStage(CreateLeaderBoardStage.SET_AMOUNTS)}
          />
        ) : createLeaderBoardStage === CreateLeaderBoardStage.SET_AMOUNTS ? (
          <SetAmountsStage
            allTokenAmounts={allTokenAmounts}
            handleTokenAmountChange={handleTokenAmountChange}
            rewardTokenAddresses={rewardTokenAddresses}
            rewardTokenCount={rewardTokenCount}
            leaderBoardSpotsCount={leaderBoardSpotsCount}
            onPrev={() => setCreateLeaderBoardStage(CreateLeaderBoardStage.SET_TOKENS)}
            onNext={() => setCreateLeaderBoardStage(CreateLeaderBoardStage.SUBMIT)}
          />
        ) : createLeaderBoardStage === CreateLeaderBoardStage.SUBMIT ? (
          <SubmitStage {...hookData} onPrev={() => setCreateLeaderBoardStage(CreateLeaderBoardStage.SET_AMOUNTS)} />
        ) : (
          <div>Unknown State</div>
        )}
      </div>
    </Modal>
  );
}
