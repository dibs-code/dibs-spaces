import { Interface } from '@ethersproject/abi';
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import pairRewarderFactoryABI from 'abis/pairRewarderFactory';
import { useDibsAddresses } from 'hooks/dibs/useDibsAddresses';
import usePairName from 'hooks/dibs/usePairName';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TransactionState } from 'types/transaction';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

export default function usePairRewarderCreate() {
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

  const [txState, setTxState] = useState(TransactionState.INITIAL);
  const handleCreatePairRewarder = useCallback(async () => {
    if (txState !== TransactionState.INITIAL || !address || !pairRewarderFactoryAddress) return;
    setTxState(TransactionState.PREPARING_TRANSACTION);
    try {
      const { request } = await prepareWriteContract({
        address: pairRewarderFactoryAddress,
        abi: pairRewarderFactoryABI,
        functionName: 'deployPairRewarder',
        args: [pairAddress as Address, address, setterAccount as Address],
      });
      setCreatedPairRewarderAddress(null);
      setTxState(TransactionState.AWAITING_USER_CONFIRMATION);
      const { hash } = await writeContract(request);
      setTxState(TransactionState.AWAITING_TRANSACTION);
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
        throw new Error('Error: Could not get the created contract address from the factory contract');
      }
      setCreatedPairRewarderAddress(pairRewarderAddress);
      setTxState(TransactionState.INITIAL);
      // if (address === setterAccount) {
      //   alert('PairRewarder created successfully! Now set the rewards');
      // navigate(RoutePath.PAIR_REWARDER_SET_PRIZE.replace(':address', pairRewarderAddress));
      // } else {
      //   alert('PairRewarder created successfully!');
      // }
      return pairRewarderAddress;
    } catch (err) {
      alert(String(err));
      setTxState(TransactionState.INITIAL);
      throw err;
    }
  }, [pairRewarderFactoryAddress, address, pairAddress, txState, setterAccount]);

  const buttonText = useMemo(
    () =>
      ({
        [TransactionState.INITIAL]: 'Create LeaderBoard',
        [TransactionState.PREPARING_TRANSACTION]: 'Preparing Transaction...',
        [TransactionState.AWAITING_USER_CONFIRMATION]: 'Awaiting user confirmation...',
        [TransactionState.AWAITING_TRANSACTION]: 'Awaiting transaction confirmation...',
      }[txState]),
    [txState],
  );

  return {
    buttonText,
    pairAddress,
    setPairAddress,
    pairName,
    setterAccount,
    setSetterAccount,
    handleCreatePairRewarder,
    txState,
    createdPairRewarderAddress,
  };
}
