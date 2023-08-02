import { Interface } from '@ethersproject/abi';
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import pairRewarderFactoryABI from 'abis/pairRewarderFactory';
import { useDibsAddresses } from 'hooks/dibs/useDibsAddresses';
import usePairName from 'hooks/dibs/usePairName';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoutePath from 'routes';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

export enum CreatePairRewarderTransactionState {
  INITIAL,
  PREPARING_TRANSACTION,
  AWAITING_USER_CONFIRMATION,
  AWAITING_TRANSACTION,
}

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
  const navigate = useNavigate();
  const [txState, setTxState] = useState(CreatePairRewarderTransactionState.INITIAL);
  const handleConfirmClick = useCallback(async () => {
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
  return {
    pairAddress,
    setPairAddress,
    pairName,
    setterAccount,
    setSetterAccount,
    handleConfirmClick,
    txState,
    createdPairRewarderAddress,
  };
}
