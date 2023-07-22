import { multicall, readContract } from '@wagmi/core';
import { Address } from 'abitype';
import { useEffect, useMemo, useState } from 'react';
import { useAccount, useBlockNumber } from 'wagmi';

import {
  dibsABI,
  pairRewarderABI,
  useErc20Symbol,
  usePairRewarderActiveDay,
  usePairRewarderHasRole,
  usePairRewarderLeaderBoardInfo,
  usePairRewarderLeaderBoardWinners,
  usePairRewarderPair,
  usePairRewarderSetterRole,
  useUniswapV2PairToken0,
  useUniswapV2PairToken1,
} from '../../abis/types/generated';
import { DibsAddress } from '../../constants/addresses';
import { PairRewarderEpochWinners, RewardTokenAndAmount } from '../../types';
import getPairIsolatedRewardTokensAndAmounts from '../../utils/getPairIsolatedRewardTokensAndAmounts';

export function usePairRewarder(pairRewarderAddress: Address) {
  const { address } = useAccount();
  const { data: pairAddress } = usePairRewarderPair({
    address: pairRewarderAddress,
  });

  const { data: setterRole } = usePairRewarderSetterRole({
    address: pairRewarderAddress,
  });
  const { data: hasSetterRole } = usePairRewarderHasRole({
    address: pairRewarderAddress,
    args: address && setterRole ? [setterRole, address] : undefined,
  });

  const { data: token0Address } = useUniswapV2PairToken0({
    address: pairAddress,
  });
  const { data: token0Symbol } = useErc20Symbol({
    address: token0Address,
  });
  const { data: token1Address } = useUniswapV2PairToken1({
    address: pairAddress,
  });
  const { data: token1Symbol } = useErc20Symbol({
    address: token1Address,
  });
  const pairName = useMemo(
    () => (token0Symbol && token1Symbol ? token0Symbol + '/' + token1Symbol : undefined),
    [token0Symbol, token1Symbol],
  );

  const { data: activeLeaderBoardInfo } = usePairRewarderLeaderBoardInfo({
    address: pairRewarderAddress,
  });

  const [epochTimer, setEpochTimer] = useState({
    hours: '0',
    minutes: '0',
  });
  const [now, setNow] = useState(new Date().getTime() / 1000);
  useEffect(() => {
    const nextEpoch = Math.ceil(now / 86400) * 86400;
    const hours = Math.floor((nextEpoch - now) / 3600);
    const minutes = Math.floor((nextEpoch - now - hours * 3600) / 60);
    setEpochTimer({
      hours: hours < 10 ? '0' + hours : String(hours),
      minutes: minutes < 10 ? '0' + minutes : String(minutes),
    });
  }, [now]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date().getTime() / 1000), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const [epochToShowWinners, setEpochToShowWinners] = useState<bigint | null>(null);

  const { data: activeDay } = usePairRewarderActiveDay({
    address: pairRewarderAddress,
  });

  useEffect(() => {
    if (activeDay) {
      setEpochToShowWinners(activeDay - BigInt(1));
    }
  }, [activeDay]);

  const { data: epochWinnersRaw } = usePairRewarderLeaderBoardWinners({
    address: pairRewarderAddress,
    args: epochToShowWinners !== null ? [epochToShowWinners] : undefined,
  });

  const [epochWinners, setEpochWinners] = useState<PairRewarderEpochWinners>(undefined);
  useEffect(() => {
    async function getData() {
      if (!epochWinnersRaw) return;
      const calls = epochWinnersRaw.winners.map((item) => {
        return {
          abi: dibsABI,
          address: DibsAddress,
          functionName: 'getCodeName',
          args: [item],
        };
      });
      const winnerCodeNames = await multicall({
        contracts: calls,
      });
      setEpochWinners({
        ...epochWinnersRaw,
        winnerCodeNames: winnerCodeNames.map((item) => item.result) as string[],
      });
    }

    getData().catch(console.log);
  }, [epochWinnersRaw]);

  return {
    epochTimer,
    pairAddress,
    pairName,
    epochToShowWinners,
    setEpochToShowWinners,
    activeDay,
    activeLeaderBoardInfo,
    epochWinners,
    hasSetterRole,
  };
}

export type PairRewarderLeaderBoardRewardItem = {
  day: bigint;
  rank: number;
  claimed: boolean;
  rewardTokensAndAmounts: RewardTokenAndAmount[];
};

export function usePairRewarderRewards(pairRewarderAddress: Address) {
  const { address } = useAccount();

  const [rewards, setRewards] = useState<PairRewarderLeaderBoardRewardItem[] | null>(null);

  const blockNumber = useBlockNumber({
    watch: true,
  });
  useEffect(() => {
    async function getData() {
      if (!address || !pairRewarderAddress) return;
      const winDays = await readContract({
        address: pairRewarderAddress,
        abi: pairRewarderABI,
        functionName: 'getUserLeaderBoardWins',
        args: [address],
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
