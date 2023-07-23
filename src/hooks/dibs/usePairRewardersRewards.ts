import { multicall } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { Address, useAccount, useBlockNumber } from 'wagmi';

import { pairRewarderABI } from '../../abis/types/generated';
import { PairRewarderLeaderBoardRewardItem } from '../../types';
import getPairIsolatedRewardTokensAndAmounts from '../../utils/getPairIsolatedRewardTokensAndAmounts';

export function useAllPairRewardersRewards(pairRewarderAddress: Address) {
  const { address } = useAccount();

  const [rewards, setRewards] = useState<PairRewarderLeaderBoardRewardItem[] | null>(null);

  const blockNumber = useBlockNumber({
    watch: true,
  });

  useEffect(() => {
    async function getData() {
      if (!address || !pairRewarderAddress) return;
      const [winDays] = await multicall({
        allowFailure: false,
        contracts: [
          {
            address: pairRewarderAddress,
            abi: pairRewarderABI,
            functionName: 'getUserLeaderBoardWins',
            args: [address],
          },
        ],
      });
      if (!winDays) return;
      const claimedForDays = await multicall({
        allowFailure: false,
        contracts: winDays.map((item) => {
          return {
            abi: pairRewarderABI,
            address: pairRewarderAddress,
            functionName: 'userLeaderBoardClaimedForDay',
            args: [address, item],
          };
        }),
      });
      const leaderBoardWinnersForDays = await multicall({
        allowFailure: false,
        contracts: winDays.map((item) => {
          return {
            abi: pairRewarderABI,
            address: pairRewarderAddress,
            functionName: 'leaderBoardWinners',
            args: [item],
          };
        }),
      });
      const rewardsArray: PairRewarderLeaderBoardRewardItem[] = [];
      for (let i = 0; i < winDays.length; i++) {
        const rankIndex = leaderBoardWinnersForDays[i].winners.findIndex((a) => a === address);
        rewardsArray.push({
          day: winDays[i],
          rank: rankIndex + 1,
          rewardTokensAndAmounts: getPairIsolatedRewardTokensAndAmounts(leaderBoardWinnersForDays[i].info, rankIndex),
          claimed: claimedForDays[i],
        });
      }
      setRewards(rewardsArray);
    }

    getData();
  }, [address, pairRewarderAddress, blockNumber]);

  return {
    rewards,
  };
}
