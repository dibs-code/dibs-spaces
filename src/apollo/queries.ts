import { gql } from './__generated__/gql';

export const ACCUMULATIVE_TOKEN_BALANCES = gql(
  `query AccumulativeTokenBalancesQuery($user: Bytes!) {
    accumulativeTokenBalances(where: {user: $user}) {
      id
      user
      token
      amount
    }
  }`
);

export const USER_TICKETS = gql(`query UserLotteriesQuery($user: Bytes!, $round: BigInt!) {
    userLotteries(where: {user: $user, round: $round}) {
      id
      user
      round
      tickets
    }
  }`);


export const DailyData = gql(`query DailyDataQuery($skip: Int!, $day: BigInt!) {
    dailyGeneratedVolumes(first: 100, skip: $skip,  where: {day: $day, amountAsReferrer_gt: 0} orderBy: amountAsReferrer orderDirection: desc) {
      user
      amountAsReferrer
    }
  }`);
