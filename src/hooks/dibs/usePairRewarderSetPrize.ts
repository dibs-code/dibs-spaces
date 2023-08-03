import { formatUnits } from '@ethersproject/units';
import { multicall, prepareWriteContract, writeContract } from '@wagmi/core';
import PairRewarderABI from 'abis/pairRewarder';
import { erc20ABI } from 'abis/types/generated';
import usePairName from 'hooks/dibs/usePairName';
import { usePairRewarder } from 'hooks/dibs/usePairRewarder';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TransactionState } from 'types/transaction';
import { parseUnits } from 'viem';
import { Address } from 'wagmi';

export default function usePairRewarderSetPrize(pairRewarderAddress?: Address | undefined) {
  const [pairAddress, setPairAddress] = useState('');

  const [rewardTokenCount, setRewardTokenCount] = useState(1);
  const [rewardTokenAddresses, setRewardTokenAddresses] = useState<string[]>(Array(4).fill(''));

  const [leaderBoardSpotsCount, setLeaderBoardSpotsCount] = useState(1);

  const [allTokenAmounts, setAllTokenAmounts] = useState<number[][]>(Array(16).fill(Array(4).fill(0)));
  const { pairName } = usePairName(pairAddress as Address);

  const handleTokenAddressChange = (index: number, newTokenAddress: string) => {
    const newTokenAddresses = [...rewardTokenAddresses];
    newTokenAddresses[index] = newTokenAddress;
    setRewardTokenAddresses(newTokenAddresses);
  };

  const handleTokenAmountChange = (rewardIndex: number, tokenIndex: number, newAmount: number) => {
    if (newAmount < 0) return;
    const newTokenAmounts = allTokenAmounts.map((tokenAmounts) => [...tokenAmounts]);
    newTokenAmounts[rewardIndex][tokenIndex] = newAmount;
    setAllTokenAmounts(newTokenAmounts);
  };
  const [txState, setTxState] = useState(TransactionState.INITIAL);
  const pending = useMemo(() => txState !== TransactionState.INITIAL, [txState]);

  const handlePairRewarderSetPrize = useCallback(async () => {
    if (pending || !pairRewarderAddress) return;
    setTxState(TransactionState.PREPARING_TRANSACTION);
    try {
      const finalRewardTokenAddresses = rewardTokenAddresses.slice(0, rewardTokenCount) as Address[];
      const tokenDecimals = await multicall({
        allowFailure: false,
        contracts: finalRewardTokenAddresses.map((tokenAddress) => ({
          abi: erc20ABI,
          address: tokenAddress,
          functionName: 'decimals',
        })),
      });
      const finalTokenAmounts = allTokenAmounts
        .slice(0, rewardTokenCount)
        .map((tokenAmounts, i) =>
          tokenAmounts.slice(0, leaderBoardSpotsCount).map((item) => parseUnits(`${item}`, tokenDecimals[i])),
        );
      const { request } = await prepareWriteContract({
        address: pairRewarderAddress,
        abi: PairRewarderABI,
        functionName: 'setLeaderBoard',
        args: [BigInt(leaderBoardSpotsCount), finalRewardTokenAddresses, finalTokenAmounts],
      });
      setTxState(TransactionState.AWAITING_USER_CONFIRMATION);
      await writeContract(request);
    } catch (err) {
      console.log('set reward error :>> ', err);
    }
    setTxState(TransactionState.INITIAL);
  }, [allTokenAmounts, leaderBoardSpotsCount, pairRewarderAddress, pending, rewardTokenAddresses, rewardTokenCount]);

  // For loading activeLeaderBoard if any
  const { pairAddress: pairAddressFromContract, activeLeaderBoardInfo } = usePairRewarder(pairRewarderAddress);
  useEffect(() => {
    if (pairAddressFromContract) {
      setPairAddress(pairAddressFromContract);
    }
  }, [pairAddressFromContract, setPairAddress]);
  const [loadingCurrentRewards, setLoadingCurrentRewards] = useState(false);
  useEffect(() => {
    async function updateInfo() {
      if (!activeLeaderBoardInfo) return;
      setLoadingCurrentRewards(true);
      const tokenCount = activeLeaderBoardInfo.rewardTokens.length;
      const tokenAddresses = activeLeaderBoardInfo.rewardTokens as Address[];
      setLeaderBoardSpotsCount(Number(activeLeaderBoardInfo.winnersCount));
      setRewardTokenCount(tokenCount);
      setRewardTokenAddresses((rewardTokenAddresses) => Object.assign([...rewardTokenAddresses], tokenAddresses));
      const tokenDecimals = await multicall({
        allowFailure: false,
        contracts: tokenAddresses.map((tokenAddress) => ({
          abi: erc20ABI,
          address: tokenAddress,
          functionName: 'decimals',
        })),
      });
      setAllTokenAmounts((allTokenAmounts) => {
        return allTokenAmounts.map((tokenAmounts, i) =>
          i < tokenCount
            ? Object.assign(
                [...tokenAmounts],
                activeLeaderBoardInfo.rewardAmounts[i].map((item) =>
                  Number(formatUnits(Number(item), tokenDecimals[i])),
                ),
              )
            : [...tokenAmounts],
        );
      });
      setLoadingCurrentRewards(false);
    }

    updateInfo();
  }, [
    activeLeaderBoardInfo,
    setAllTokenAmounts,
    setLeaderBoardSpotsCount,
    setRewardTokenAddresses,
    setRewardTokenCount,
  ]);

  const buttonText = useMemo(
    () =>
      ({
        [TransactionState.INITIAL]:
          activeLeaderBoardInfo && activeLeaderBoardInfo?.winnersCount !== BigInt(0) ? 'Update Rewards' : 'Set Rewards',
        [TransactionState.PREPARING_TRANSACTION]: 'Preparing Transaction...',
        [TransactionState.AWAITING_USER_CONFIRMATION]: 'Awaiting user confirmation...',
        [TransactionState.AWAITING_TRANSACTION]: 'Awaiting transaction confirmation...',
      }[txState]),
    [activeLeaderBoardInfo, txState],
  );

  return {
    setLeaderBoardSpotsCount,
    setRewardTokenCount,
    setRewardTokenAddresses,
    setAllTokenAmounts,
    pairName,
    pairAddress,
    setPairAddress,
    leaderBoardSpotsCount,
    rewardTokenCount,
    rewardTokenAddresses,
    allTokenAmounts,
    handleTokenAmountChange,
    handleTokenAddressChange,
    handlePairRewarderSetPrize,
    pending,
    buttonText,
    loadingCurrentRewards,
    pairAddressFromContract,
    activeLeaderBoardInfo,
  };
}
