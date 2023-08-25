import { RewardTokenAndAmount } from 'types/index';
import { Address } from 'wagmi';

export type PairRewarderRewardItem = {
  day: bigint;
  rank: number;
  claimed: boolean;
  rewardTokensAndAmounts: RewardTokenAndAmount[];
  topReferrersSet: boolean;
  topReferrers?: Address[];
};
export type AllPairRewarderRewardsItem = {
  pair: Address;
  rewards: PairRewarderRewardItem[];
};
export type AllPairRewarderRewards = {
  [pairRewarderAddress: Address]: AllPairRewarderRewardsItem;
};
export type PairRewardersOfPairs = {
  [pairAddress: Address]: Address[];
};
export type PairDayPotentialRewardRecord = { day: string; pair: Address; rankIndex: number; topReferrers: Address[] };
