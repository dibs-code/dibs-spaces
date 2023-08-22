import { formatUnits } from '@ethersproject/units';
import { multicall } from '@wagmi/core';
import { erc20ABI } from 'abis/types/generated';
import { TotalRewardInUsd } from 'components/rewards/RewardAmounts';
import RewardToken from 'components/RewardToken';
import useTestOrRealData from 'hooks/useTestOrRealData';
import React, { useEffect, useMemo, useState } from 'react';
import { LeaderBoardInfo, LeaderBoardRecordWithCodeNames } from 'types';
import getPairIsolatedRewardTokensAndAmounts from 'utils/getPairIsolatedRewardTokensAndAmounts';

function LeaderBoardRecordRow({
  index,
  leaderBoardRecord,
  leaderBoardInfo,
}: {
  index: number;
  leaderBoardRecord: LeaderBoardRecordWithCodeNames;
  leaderBoardInfo: LeaderBoardInfo | undefined;
}) {
  const rewardTokensAndAmounts = useMemo(
    () => getPairIsolatedRewardTokensAndAmounts(leaderBoardInfo, index),
    [index, leaderBoardInfo],
  );
  const tokenAddresses = useMemo(() => rewardTokensAndAmounts.map((r) => r.token), [rewardTokensAndAmounts]);
  const tokenAmountsRaw = useMemo(() => rewardTokensAndAmounts.map((r) => r.amount), [rewardTokensAndAmounts]);
  const [tokenAmounts, setTokenAmounts] = useState<number[]>([]);
  const { chainId } = useTestOrRealData();

  useEffect(() => {
    async function getTokenAmounts() {
      const tokenDecimals = await multicall({
        allowFailure: false,
        contracts: tokenAddresses.map((tokenAddress) => ({
          abi: erc20ABI,
          address: tokenAddress,
          functionName: 'decimals',
        })),
        chainId,
      });
      setTokenAmounts(tokenAmountsRaw.map((tokenAmount, i) => Number(formatUnits(tokenAmount, tokenDecimals[i]))));
    }

    getTokenAmounts();
  }, [chainId, tokenAddresses, tokenAmountsRaw]);
  return (
    <tr className="text-white text-left bg-gray2">
      <td className="pl-8 rounded-l">
        <span>#{index + 1}</span>
      </td>
      <td className="">{leaderBoardRecord.code || leaderBoardRecord.user}</td>
      <td className="">{leaderBoardRecord.volume.toString()}</td>
      <td className="py-4 pr-8 rounded-r text-right">
        <span className="flex justify-end gap-1">
          {rewardTokensAndAmounts.map((obj) => (
            <RewardToken key={obj.token} rewardTokenAddress={obj.token} rewardTokenAmount={obj.amount} />
          ))}{' '}
          ≈ <TotalRewardInUsd rewardTokens={tokenAddresses} rewardAmounts={tokenAmounts} />
        </span>
      </td>
    </tr>
  );
}

export default function PairRewarderLeaderBoard({
  dayLeaderBoard,
  leaderBoardInfo,
}: {
  dayLeaderBoard: LeaderBoardRecordWithCodeNames[];
  leaderBoardInfo: LeaderBoardInfo | undefined;
}) {
  return (
    <table className="w-full text-center border-separate border-spacing-y-3 rounded">
      <thead className="text-white">
        <tr>
          <th className="py-2 text-left pl-8">Rank</th>
          <th className="py-2 text-left">Code</th>
          <th className="py-2 text-left">Volume</th>
          <th className="py-2 text-right pr-8">Potential reward</th>
        </tr>
      </thead>
      <tbody>
        {dayLeaderBoard?.map((leaderBoardRecord, i) => (
          <LeaderBoardRecordRow
            key={leaderBoardRecord.user}
            index={i}
            leaderBoardRecord={leaderBoardRecord}
            leaderBoardInfo={leaderBoardInfo}
          />
        ))}
      </tbody>
    </table>
  );
}
