import Modal, { ModalProps } from 'components/modal';
import { SetAmountsStage } from 'components/pairIsolated/CreateLeaderBoardModal/SetAmountsStage';
import { SetPairStage } from 'components/pairIsolated/CreateLeaderBoardModal/SetPairStage';
import { SetTokensStage } from 'components/pairIsolated/CreateLeaderBoardModal/SetTokensStage';
import { SubmitStage } from 'components/pairIsolated/CreateLeaderBoardModal/SubmitStage';
import usePairRewarderCreateAndSetPrize from 'hooks/dibs/usePairRewarderCreateAndSetPrize';
import React, { createContext, useContext, useState } from 'react';

export enum CreateLeaderBoardStage {
  SET_PAIR,
  SET_TOKENS,
  SET_AMOUNTS,
  SUBMIT,
}

export const LeaderBoardContext = createContext<ReturnType<typeof usePairRewarderCreateAndSetPrize> | null>(null);

export default function CreateLeaderBoardModalContext(props: ModalProps) {
  const [createLeaderBoardStage, setCreateLeaderBoardStage] = useState(CreateLeaderBoardStage.SET_PAIR);
  const hookData = usePairRewarderCreateAndSetPrize();

  return (
    <LeaderBoardContext.Provider value={hookData}>
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
    </LeaderBoardContext.Provider>
  );
}

// Create a hook to use this context easily
export const useLeaderBoardContext = () => {
  const context = useContext(LeaderBoardContext);
  if (context === null) {
    throw new Error('useLeaderBoardContext must be used within a LeaderBoardProvider');
  }
  return context;
};
