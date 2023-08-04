import Modal, { ModalProps } from 'components/modal';
import { SetAmountsStage } from 'components/pairIsolated/CreateLeaderBoardModal/SetAmountsStage';
import { SetPairStage } from 'components/pairIsolated/CreateLeaderBoardModal/SetPairStage';
import { SetTokensStage } from 'components/pairIsolated/CreateLeaderBoardModal/SetTokensStage';
import { SubmitStage } from 'components/pairIsolated/CreateLeaderBoardModal/SubmitStage';
import usePairRewarderCreateAndSetPrize from 'hooks/dibs/usePairRewarderCreateAndSetPrize';
import React, { useState } from 'react';

export enum CreateLeaderBoardStage {
  SET_PAIR,
  SET_TOKENS,
  SET_AMOUNTS,
  SUBMIT,
}

export default function CreateLeaderBoardModal(props: ModalProps) {
  const [createLeaderBoardStage, setCreateLeaderBoardStage] = useState(CreateLeaderBoardStage.SET_PAIR);
  const hookData = usePairRewarderCreateAndSetPrize();
  const {
    leaderBoardSpotsCount,
    setLeaderBoardSpotsCount,
    setRewardTokenCount,
    pairAddress,
    setPairAddress,
    rewardTokenCount,
    rewardTokenAddresses,
    allTokenAmounts,
    handleTokenAmountChange,
    handleTokenAddressChange,
  } = hookData;

  return (
    <Modal {...props}>
      <div className="create-leaderboard-modal px-16 py-20 pt-12">
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
