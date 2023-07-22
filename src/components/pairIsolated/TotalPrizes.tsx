import React from 'react';

import { LeaderBoardInfo } from '../../types';
import RewardToken from '../RewardToken';

export default function TotalPrizes({ leaderBoardInfo }: { leaderBoardInfo: LeaderBoardInfo | undefined }) {
  if (!leaderBoardInfo) return <></>;
  if (leaderBoardInfo.winnersCount === BigInt(0)) return <>Not Set</>;
  return (
    <>
      {leaderBoardInfo.rewardTokens.map((t, i) => (
        <RewardToken
          rewardTokenAddress={t}
          rewardTokenAmount={leaderBoardInfo.rewardAmounts[i].reduce((sum, amount) => sum + amount, BigInt(0))}
          key={t}
        />
      ))}
    </>
  );
}
