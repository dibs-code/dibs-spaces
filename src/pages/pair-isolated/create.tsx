import { Interface } from '@ethersproject/abi';
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import pairRewarderFactoryABI from 'abis/pairRewarderFactory';
import Sidenav from 'components/navigation/sidenav';
import { useDibsAddresses } from 'hooks/dibs/useDibsAddresses';
import usePairName from 'hooks/dibs/usePairName';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RoutePath from 'routes';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

enum CreatePairRewarderTransactionState {
  INITIAL,
  PREPARING_TRANSACTION,
  AWAITING_USER_CONFIRMATION,
  AWAITING_TRANSACTION,
}

export default function PairRewarderCreate() {
  const { address } = useAccount();
  const { pairRewarderFactoryAddress } = useDibsAddresses();

  const [pairAddress, setPairAddress] = useState('');
  const [setterAccount, setSetterAccount] = useState('');
  const [createdPairRewarderAddress, setCreatedPairRewarderAddress] = useState<Address | null>(null);
  useEffect(() => {
    if (address) {
      setSetterAccount(address);
    }
  }, [address]);
  const { pairName } = usePairName(pairAddress as Address);
  const navigate = useNavigate();
  const [txState, setTxState] = useState(CreatePairRewarderTransactionState.INITIAL);
  const handleButtonClick = useCallback(async () => {
    if (txState !== CreatePairRewarderTransactionState.INITIAL || !address || !pairRewarderFactoryAddress) return;
    setTxState(CreatePairRewarderTransactionState.PREPARING_TRANSACTION);
    try {
      const { request } = await prepareWriteContract({
        address: pairRewarderFactoryAddress,
        abi: pairRewarderFactoryABI,
        functionName: 'deployPairRewarder',
        args: [pairAddress as Address, address, setterAccount as Address],
      });
      setCreatedPairRewarderAddress(null);
      setTxState(CreatePairRewarderTransactionState.AWAITING_USER_CONFIRMATION);
      const { hash } = await writeContract(request);
      setTxState(CreatePairRewarderTransactionState.AWAITING_TRANSACTION);
      const data = await waitForTransaction({
        hash,
      });
      const iface = new Interface(pairRewarderFactoryABI);
      const events = data.logs.map((l) => {
        try {
          return iface.parseLog(l);
        } catch (_e) {
          return null;
        }
      });
      const pairRewarderDeployedEvent = events.find((e) => e?.name === 'PairRewarderDeployed');
      const pairRewarderAddress: Address = pairRewarderDeployedEvent?.args.pairRewarder;
      if (!pairRewarderAddress) {
        alert('Error: Could not get the created contract address from the factory contract');
        return;
      }
      setCreatedPairRewarderAddress(pairRewarderAddress);
      setTxState(CreatePairRewarderTransactionState.INITIAL);
      if (address === setterAccount) {
        alert('PairRewarder created successfully! Now set the rewards');
        navigate(RoutePath.PAIR_REWARDER_SET_PRIZE.replace(':address', pairRewarderAddress));
      } else {
        alert('PairRewarder created successfully!');
      }
    } catch (err) {
      alert(String(err));
      setTxState(CreatePairRewarderTransactionState.INITIAL);
    }
  }, [pairRewarderFactoryAddress, address, navigate, pairAddress, txState, setterAccount]);

  const buttonText = {
    [CreatePairRewarderTransactionState.INITIAL]: 'Create LeaderBoard',
    [CreatePairRewarderTransactionState.PREPARING_TRANSACTION]: 'Preparing Transaction....',
    [CreatePairRewarderTransactionState.AWAITING_USER_CONFIRMATION]: 'Awaiting user confirmation...',
    [CreatePairRewarderTransactionState.AWAITING_TRANSACTION]: 'Awaiting transaction confirmation...',
  };

  return (
    <div className={'page-spacing'}>
      <Sidenav></Sidenav>
      <main className={'main-spacing'}>
        <header className={'border-b pb-4 mb-16'}>
          <h2>Create Dibs pair isolated leaderboard</h2>
        </header>

        <main>
          <section className={'px-2 rounded-2xl h-80 bg-cover mt-4 flex flex-col gap-3'}>
            <p>
              <Link
                to={RoutePath.PAIR_ISOLATED}
                className={`btn-primary btn-large font-medium mt-4 w-full xl:w-auto px-8`}
              >
                Go Back
              </Link>
            </p>
            <form className="w-full max-w-lg px-8 py-4 mx-auto bg-white rounded-lg shadow-md mt-2">
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
              <div className="mb-4">
                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="tokenCount">
                  Address of the account that can set the reward tokens and amounts
                </label>
                <input
                  className={`block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md`}
                  value={setterAccount}
                  onChange={(e) => setSetterAccount(e.target.value)}
                />
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick();
                }}
                className="w-full px-4 py-2 mt-4 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-700"
              >
                {buttonText[txState]}
              </button>
              {createdPairRewarderAddress && (
                <div className={'pt-2'}>Created PairRewarder address: {createdPairRewarderAddress}</div>
              )}
            </form>
          </section>
        </main>
      </main>
    </div>
  );
}
