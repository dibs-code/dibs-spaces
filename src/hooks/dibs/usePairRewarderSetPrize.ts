import { formatUnits } from '@ethersproject/units';
import { multicall, prepareWriteContract, writeContract } from '@wagmi/core';
import PairRewarderABI from 'abis/pairRewarder';
import { erc20ABI } from 'abis/types/generated';
import usePairName from 'hooks/dibs/usePairName';
import { usePairRewarder } from 'hooks/dibs/usePairRewarder';
import { useCallback, useEffect, useState } from 'react';
import { parseUnits } from 'viem';
import { Address } from 'wagmi';

export default function usePairRewarderSetPrize(pairRewarderAddress?: Address | undefined) {
  const [pairAddress, setPairAddress] = useState('');

  const [rewardTokenCount, setRewardTokenCount] = useState(1);
  const [rewardTokenAddresses, setRewardTokenAddresses] = useState<string[]>(Array(4).fill(''));

  const [leaderBoardSpotsCount, setLeaderBoardSpotsCount] = useState(1);

  const [allTokenAmounts, setAllTokenAmounts] = useState<number[][]>(Array(4).fill(Array(16).fill(0)));
  const { pairName } = usePairName(pairAddress as Address);

  const handleTokenAddressChange = (index: number, newTokenAddress: string) => {
    const newTokenAddresses = [...rewardTokenAddresses];
    newTokenAddresses[index] = newTokenAddress;
    setRewardTokenAddresses(newTokenAddresses);
  };

  const handleTokenAmountChange = (tokenIndex: number, rewardIndex: number, newAmount: number) => {
    if (newAmount < 0) return;
    const newTokenAmounts = allTokenAmounts.map((tokenAmounts) => [...tokenAmounts]);
    newTokenAmounts[tokenIndex][rewardIndex] = newAmount;
    setAllTokenAmounts(newTokenAmounts);
  };
  const [pending, setPending] = useState(false);
  const handleButtonClick = useCallback(async () => {
    if (pending || !pairRewarderAddress) return;
    setPending(true);
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
      await writeContract(request);
    } catch (err) {
      console.log('set reward error :>> ', err);
    }
    setPending(false);
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
    handleButtonClick,
    pending,
    loadingCurrentRewards,
    pairAddressFromContract,
    activeLeaderBoardInfo,
  };
}
