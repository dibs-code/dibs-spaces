import Modal from 'components/modal';
import usePairName from 'hooks/dibs/usePairName';
import React, { useEffect, useState } from 'react';
import { Address } from 'wagmi';

function SelectPair({ pairAddress, onConfirm }: { pairAddress: string; onConfirm: (pairAddress: string) => void }) {
  const [pairAddressLocal, setPairAddressLocal] = useState('');
  useEffect(() => {
    setPairAddressLocal(pairAddress);
  }, [pairAddress]);
  const { pairName } = usePairName(pairAddressLocal as Address);

  return (
    <>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="tokenCount">
          Pair
        </label>
        <input
          className={`block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md`}
          value={pairAddressLocal}
          onChange={(e) => setPairAddressLocal(e.target.value)}
        />
        {pairName || 'Unknown Pair'}
      </div>
      <button className={'btn-medium btn-primary'} onClick={() => onConfirm(pairAddressLocal)}>
        Confirm
      </button>
    </>
  );
}

export function CreateLeaderBoardModalCreateStage({
  leaderBoardSpotsCount,
  setLeaderBoardSpotsCount,
  pairAddress,
  setPairAddress,
  pairName,
  onNext,
  onPrev,
}: {
  leaderBoardSpotsCount: number;
  setLeaderBoardSpotsCount: (count: number) => void;
  pairAddress: string;
  setPairAddress: (value: string) => void;
  pairName: string | undefined;
  onNext?: () => void;
  onPrev?: () => void;
}) {
  const [pairSelectModalOpen, setPairSelectModalOpen] = useState(false);

  return (
    <>
      {pairAddress ? (
        <div>
          {pairName || 'Unknown Pair'}
          <button className={'btn-medium btn-primary mb-4'} onClick={() => setPairSelectModalOpen(true)}>
            Change Pair
          </button>
        </div>
      ) : (
        <button className={'btn-medium btn-primary mb-4'} onClick={() => setPairSelectModalOpen(true)}>
          Select Pair
        </button>
      )}

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
        <SelectPair
          pairAddress={pairAddress}
          onConfirm={(value) => {
            setPairAddress(value);
            setPairSelectModalOpen(false);
          }}
        />
      </Modal>
    </>
  );
}
