import Modal from 'components/modal';
import { PAIR_ISOLATED_LEADERBOARD_MAXIMUM_SPOT_COUNT } from 'constants/config';
import { useCreateLeaderBoardModalContext } from 'contexts/CreateLeaderBoardModalContext';
import usePairName from 'hooks/dibs/usePairName';
import React, { useEffect, useState } from 'react';
import { Address } from 'wagmi';

import LeaderboardStage from '../../modal/LeaderboardStage';
import Seekbar from '../../modal/Seekbar';

export function ShowPair({ pairAddress }: { pairAddress: string | undefined }) {
  const { pairName } = usePairName(pairAddress as Address | undefined);
  return <>{pairName || 'Unknown Pair'}</>;
}

function SelectPair({
  pairAddress,
  onConfirm,
}: {
  pairAddress: string | undefined;
  onConfirm: (pairAddress: string) => void;
}) {
  const [pairAddressLocal, setPairAddressLocal] = useState('');
  useEffect(() => {
    if (pairAddress) {
      setPairAddressLocal(pairAddress);
    }
  }, [pairAddress]);
  const { pairName } = usePairName(pairAddressLocal as Address);

  return (
    <div className={'w-full p-4'}>
      <div className="mb-4">
        <label className="block mb-2 text-gray-700 text-white p-2 text-center" htmlFor="tokenCount">
          Enter Pair Address
        </label>
        <input
          className={`block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md`}
          value={pairAddressLocal}
          onChange={(e) => setPairAddressLocal(e.target.value)}
        />
        <div className={'text-white text-center mt-2'}>{pairName || 'Unknown Pair'}</div>
      </div>
      <div className={'w-full text-center'}>
        <button
          className={'btn-medium btn-primary background bg-secondary mx-auto'}
          onClick={() => onConfirm(pairAddressLocal)}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export function SetPairStage({ onNext, onPrev }: { onNext?: () => void; onPrev?: () => void }) {
  const { leaderBoardSpotsCount, setLeaderBoardSpotsCount, pairAddress, setPairAddress, createdPairRewarderAddress } =
    useCreateLeaderBoardModalContext();
  const [pairSelectModalOpen, setPairSelectModalOpen] = useState(false);

  return (
    <>
      <section className="w-52 h-20 mx-auto mb-4 mt-[75px]">
        <LeaderboardStage count={leaderBoardSpotsCount} />
      </section>
      <p className="text-2xl font-medium mb-[22px] text-white w-full text-center">Create leaderboard</p>
      <p className="font-medium mb-[22px] text-white w-full text-center">for</p>
      <div
        className={`pair-button py-[18px] px-7 min-h-[72px] max-w-[375px] mx-auto mb-9 rounded-lg bg-gray4 flex items-center justify-between w-full ${
          createdPairRewarderAddress ? '' : 'cursor-pointer'
        }`}
        onClick={() => {
          if (!createdPairRewarderAddress) {
            setPairSelectModalOpen(true);
          }
        }}
      >
        {pairAddress ? (
          <>
            <div className="pair flex gap-3 items-center">
              <img src="/assets/images/pair-coin-icon.svg" alt="" className="h-9 w-auto" />
              <p className="text-xl text-white font-medium">
                <ShowPair pairAddress={pairAddress} />
              </p>
            </div>
            {!createdPairRewarderAddress && <p className="font-semibold text-secondary pt-2">Change</p>}
          </>
        ) : (
          <>
            <p className="text-xl text-white font-medium">-</p>
            <p className="font-semibold text-secondary pt-2">Select Pair</p>
          </>
        )}
      </div>

      {/*{pairAddress ? (*/}
      {/*  <div>*/}
      {/*    <ShowPair pairAddress={pairAddress} />*/}
      {/*    <button className={'btn-medium btn-primary mb-4'} onClick={() => setPairSelectModalOpen(true)}>*/}
      {/*      Change Pair*/}
      {/*    </button>*/}
      {/*  </div>*/}
      {/*) : (*/}
      {/*  <button className={'btn-medium btn-primary mb-4'} onClick={() => setPairSelectModalOpen(true)}>*/}
      {/*    Select Pair*/}
      {/*  </button>*/}
      {/*)}*/}

      {/*<input*/}
      {/*  type="number"*/}
      {/*  className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"*/}
      {/*  value={leaderBoardSpotsCount}*/}
      {/*  onChange={(e) => setLeaderBoardSpotsCount(Math.max(Math.min(Number(e.target.value), 16), 1))}*/}
      {/*/>*/}
      <section className="leaderboard-spots mb-24">
        <p className="text-white font-medium text-xl mb-5">How many leaderboard spots do you want to reward?</p>
        <Seekbar
          min={1}
          max={PAIR_ISOLATED_LEADERBOARD_MAXIMUM_SPOT_COUNT}
          value={leaderBoardSpotsCount}
          onValueChange={setLeaderBoardSpotsCount}
        />
      </section>
      <section className="pagination flex justify-between w-full px-4 gap-20">
        <img src="/assets/images/modal/back-gray.svg" alt="" className="w-8 h-8" />
        <div className="flex mx-auto items-center gap-2">
          <div className="pagination__page bg-primary w-[72px] h-2 rounded-full"></div>
          <div className="pagination__page bg-gray6 w-[72px] h-2 rounded-full"></div>
          <div className="pagination__page bg-gray6 w-[72px] h-2 rounded-full"></div>
        </div>
        <img src="/assets/images/modal/next-colored.svg" onClick={onNext} alt="" className="w-8 h-8 cursor-pointer" />
      </section>
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
