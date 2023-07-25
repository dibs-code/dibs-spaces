import { LeaderBoardInfo, RewardTokenAndAmount } from 'types';

export default function getPairIsolatedRewardTokensAndAmounts(
  leaderBoardInfo: LeaderBoardInfo | undefined,
  winnerRankIndex: number,
): RewardTokenAndAmount[] {
  if (!leaderBoardInfo) return [];
  return leaderBoardInfo.rewardTokens
    .map((token, i) => {
      const amount = leaderBoardInfo.rewardAmounts[i][winnerRankIndex];
      if (amount) {
        return {
          token,
          amount,
        };
      }
      return undefined;
    })
    .filter((x) => x !== undefined) as RewardTokenAndAmount[];
}
