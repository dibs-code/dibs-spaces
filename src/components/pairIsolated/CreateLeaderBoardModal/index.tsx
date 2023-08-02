import TokenAddressInput, { TokenSymbol } from 'components/basic/input/TokenAddressInput';
import Modal, { ModalProps } from 'components/modal';
import { CreateLeaderBoardModalCreateStage } from 'components/pairIsolated/CreateLeaderBoardModal/CreateStage';
import usePairRewarderCreateAndSetPrize from 'hooks/dibs/usePairRewarderCreateAndSetPrize';
import React, { useState } from 'react';
import { Address } from 'wagmi';

export enum CreateLeaderBoardStage {
  CREATE,
  SET_TOKENS,
  SET_AMOUNTS,
}

export default function CreateLeaderBoardModal(props: ModalProps) {
  const [createLeaderBoardStage, setCreateLeaderBoardStage] = useState(CreateLeaderBoardStage.CREATE);
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
    handleButtonClick,
    handleTokenAddressChange,
    pending,
    activeLeaderBoardInfo,
  } = usePairRewarderCreateAndSetPrize();

  return (
    <Modal {...props}>
      <div>
        {createLeaderBoardStage === CreateLeaderBoardStage.CREATE ? (
          <CreateLeaderBoardModalCreateStage
            leaderBoardSpotsCount={leaderBoardSpotsCount}
            setLeaderBoardSpotsCount={setLeaderBoardSpotsCount}
            pairAddress={pairAddress}
            setPairAddress={setPairAddress}
            pairName={pairName}
            onNext={() => setCreateLeaderBoardStage(CreateLeaderBoardStage.SET_TOKENS)}
          />
        ) : (
          <div className="w-full max-w-lg px-8 py-4 mx-auto bg-white rounded-lg shadow-md mt-2">
            {createLeaderBoardStage === CreateLeaderBoardStage.SET_TOKENS ? (
              <>
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

                <button
                  className={'btn-medium btn-primary'}
                  onClick={() => setCreateLeaderBoardStage(CreateLeaderBoardStage.CREATE)}
                >
                  Prev
                </button>
                <button
                  className={'btn-medium btn-primary'}
                  onClick={() => setCreateLeaderBoardStage(CreateLeaderBoardStage.SET_AMOUNTS)}
                >
                  Next
                </button>
              </>
            ) : (
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

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleButtonClick();
                  }}
                  disabled={pending}
                  className="w-full px-4 py-2 mt-4 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-700"
                >
                  {pending
                    ? 'Sending Transaction...'
                    : activeLeaderBoardInfo && activeLeaderBoardInfo?.winnersCount !== BigInt(0)
                    ? 'Update Rewards'
                    : 'Set Rewards'}
                </button>

                <button
                  className={'btn-medium btn-primary'}
                  onClick={() => setCreateLeaderBoardStage(CreateLeaderBoardStage.SET_TOKENS)}
                >
                  Prev
                </button>
                <button className={'btn-medium btn-primary'}>Next</button>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
