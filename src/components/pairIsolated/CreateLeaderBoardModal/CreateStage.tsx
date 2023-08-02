import Modal from 'components/modal';
import usePairRewarderCreate from 'hooks/dibs/usePairRewarderCreate';
import React, { useState } from 'react';

export function CreateLeaderBoardModalCreateStage({
  leaderBoardSpotsCount,
  setLeaderBoardSpotsCount,
  onNext,
  onPrev,
}: {
  leaderBoardSpotsCount: number;
  setLeaderBoardSpotsCount: (count: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
}) {
  const [pairSelectModalOpen, setPairSelectModalOpen] = useState(false);

  const {
    pairAddress,
    setPairAddress,
    pairName,
    setterAccount,
    setSetterAccount,
    handleConfirmClick,
    txState,
    createdPairRewarderAddress,
  } = usePairRewarderCreate();
  return (
    <>
      <button className={'btn-medium btn-primary mb-4'} onClick={() => setPairSelectModalOpen(true)}>
        Select Pair
      </button>

      <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="tokenCount">
        Leaderboard spots
      </label>
      <input
        type="number"
        className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
        value={leaderBoardSpotsCount}
        onChange={(e) => setLeaderBoardSpotsCount(Math.max(Math.min(Number(e.target.value), 16), 1))}
      />
      <button className={'btn-medium btn-primary'} disabled={true}>
        Prev
      </button>
      <button className={'btn-medium btn-primary'} onClick={onNext}>
        Next
      </button>
      <Modal open={pairSelectModalOpen} closeModal={() => setPairSelectModalOpen(false)}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="tokenCount">
            Pair
          </label>
          <input
            className={`block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md`}
            value={pairAddress}
            onChange={(e) => setPairAddress(e.target.value)}
          />
          {pairName || 'Unknown Pair'}
        </div>
        <button className={'btn-medium btn-primary'} onClick={() => setPairSelectModalOpen(false)}>
          Confirm
        </button>
      </Modal>
    </>
  );
}
