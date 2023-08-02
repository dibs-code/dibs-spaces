import TokenAddressInput from 'components/basic/input/TokenAddressInput';
import Modal from 'components/modal';
import usePairRewarderCreate from 'hooks/dibs/usePairRewarderCreate';
import React, { useState } from 'react';

export function CreateLeaderBoardModalSetTokenStage({ onNext, onPrev }: { onNext?: () => void; onPrev?: () => void }) {
  const [pairSelectModalOpen, setPairSelectModalOpen] = useState(false);

  const [rewardTokenCount, setRewardTokenCount] = useState(1);
  const [rewardTokenAddresses, setRewardTokenAddresses] = useState<string[]>(Array(4).fill(''));

  const handleTokenAddressChange = (index: number, newTokenAddress: string) => {
    const newTokenAddresses = [...rewardTokenAddresses];
    newTokenAddresses[index] = newTokenAddress;
    setRewardTokenAddresses(newTokenAddresses);
  };

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
          onClick={() => setRewardTokenCount((count) => Math.max(count + 1, 4))}
        >
          +
        </button>
      </div>

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
