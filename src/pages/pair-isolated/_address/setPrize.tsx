import { formatUnits } from '@ethersproject/units';
import { multicall, prepareWriteContract, writeContract } from '@wagmi/core';
import PairRewarderABI from 'abis/pairRewarder';
import { erc20ABI } from 'abis/types/generated';
import TokenAddressInput from 'components/basic/input/TokenAddressInput';
import Sidenav from 'components/navigation/sidenav';
import usePairName from 'hooks/dibs/usePairName';
import { usePairRewarder } from 'hooks/dibs/usePairRewarder';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import RoutePath from 'routes';
import { Address, parseUnits } from 'viem';

export default function PairRewarderSetPrize() {
  const params = useParams();
  const pairRewarderAddress = params.address as Address;

  const { pairAddress: pairAddressFromContract, activeLeaderBoardInfo } = usePairRewarder(pairRewarderAddress);
  const [pairAddress, setPairAddress] = useState('');
  useEffect(() => {
    if (pairAddressFromContract) {
      setPairAddress(pairAddressFromContract);
    }
  }, [pairAddressFromContract]);

  const [rewardTokenCount, setRewardTokenCount] = useState(1);
  const [rewardTokenAddresses, setRewardTokenAddresses] = useState<string[]>(Array(4).fill(''));

  const [leaderBoardSpotsCount, setLeaderBoardSpotsCount] = useState(1);
  const [allTokenAmounts, setAllTokenAmounts] = useState<number[][]>(Array(4).fill(Array(16).fill(0)));
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
  }, [activeLeaderBoardInfo]);
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
  return (
    <div className={'page-spacing'}>
      <Sidenav></Sidenav>
      <main className={'main-spacing'}>
        <header className={'border-b pb-4 mb-16'}>
          <h2> Dibs pair isolated leaderboard {pairName}</h2>
        </header>

        <main>
          <section className={'px-2 rounded-2xl h-80 bg-cover mt-4 flex flex-col gap-3'}>
            <p>
              <Link
                to={RoutePath.PAIR_REWARDER_LEADERBOARD.replace(':address', pairRewarderAddress)}
                className={`btn-primary btn-large font-medium mt-4 w-full xl:w-auto px-8`}
              >
                View Leaderboard
              </Link>
            </p>
            {loadingCurrentRewards ? (
              <div>Loading...</div>
            ) : (
              <form className="w-full max-w-lg px-8 py-4 mx-auto bg-white rounded-lg shadow-md mt-2">
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="tokenCount">
                    Pair
                  </label>
                  <input
                    className={`block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md ${
                      !!pairAddressFromContract && 'text-gray cursor-not-allowed'
                    }`}
                    disabled={!!pairAddressFromContract}
                    value={pairAddress}
                    onChange={(e) => setPairAddress(e.target.value)}
                  />
                  {pairName || 'Unknown Pair'}
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="tokenCount">
                    Number of LeaderBoard Spots (1-16)
                  </label>
                  <input
                    type="number"
                    className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                    value={leaderBoardSpotsCount}
                    onChange={(e) => setLeaderBoardSpotsCount(Math.max(Math.min(Number(e.target.value), 16), 1))}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="tokenCount">
                    Number of Reward Tokens (1-4)
                  </label>
                  <input
                    type="number"
                    className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                    value={rewardTokenCount}
                    onChange={(e) => setRewardTokenCount(Math.max(Math.min(Number(e.target.value), 4), 1))}
                  />
                </div>

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
                    <div className="flex py-2 flex-wrap">
                      {allTokenAmounts[i].slice(0, leaderBoardSpotsCount).map((rewardAmount, j) => (
                        <div className={'w-1/2 px-2'} key={j}>
                          Rank {j + 1} Reward Amount
                          <input
                            type="number"
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                            value={rewardAmount}
                            onChange={(event) => handleTokenAmountChange(i, j, Number(event.target.value))}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleButtonClick();
                  }}
                  disabled={pending}
                  className="w-full px-4 py-2 mt-4 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-700"
                >
                  {pending ? 'Sending Transaction...' : activeLeaderBoardInfo ? 'Update Rewards' : 'Set Rewards'}
                </button>
              </form>
            )}
          </section>
        </main>
      </main>
    </div>
  );
}
