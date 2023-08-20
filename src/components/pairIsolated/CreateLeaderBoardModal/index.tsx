import Modal, { ModalProps } from 'components/modal';
import { SetAmountsStage } from 'components/pairIsolated/CreateLeaderBoardModal/SetAmountsStage';
import { SetPairStage } from 'components/pairIsolated/CreateLeaderBoardModal/SetPairStage';
import { SetTokensStage } from 'components/pairIsolated/CreateLeaderBoardModal/SetTokensStage';
import { SubmitStage } from 'components/pairIsolated/CreateLeaderBoardModal/SubmitStage';
import { CreateLeaderBoardStage, useCreateLeaderBoardModalContext } from 'contexts/CreateLeaderBoardModalContext';
import React from 'react';

export default function CreateLeaderBoardModal(props: ModalProps) {
  const { createLeaderBoardStage, setCreateLeaderBoardStage } = useCreateLeaderBoardModalContext();
  return (
    <Modal {...props} className={CreateLeaderBoardStage.SUBMIT === createLeaderBoardStage ? '!max-w-[898px]' : ''}>
      <div className="create-leaderboard-modal px-16 py-20 pt-12">
        {CreateLeaderBoardStage.SET_PAIR === createLeaderBoardStage && (
          <SetPairStage onNext={() => setCreateLeaderBoardStage(CreateLeaderBoardStage.SET_TOKENS)} />
        )}
        {CreateLeaderBoardStage.SET_TOKENS === createLeaderBoardStage && (
          <SetTokensStage
            onPrev={() => setCreateLeaderBoardStage(CreateLeaderBoardStage.SET_PAIR)}
            onNext={() => setCreateLeaderBoardStage(CreateLeaderBoardStage.SET_AMOUNTS)}
          />
        )}
        {CreateLeaderBoardStage.SET_AMOUNTS === createLeaderBoardStage && (
          <SetAmountsStage
            onPrev={() => setCreateLeaderBoardStage(CreateLeaderBoardStage.SET_TOKENS)}
            onNext={() => setCreateLeaderBoardStage(CreateLeaderBoardStage.SUBMIT)}
          />
        )}
        {CreateLeaderBoardStage.SUBMIT === createLeaderBoardStage && (
          <SubmitStage onPrev={() => setCreateLeaderBoardStage(CreateLeaderBoardStage.SET_AMOUNTS)} />
        )}
      </div>
    </Modal>
  );
}
