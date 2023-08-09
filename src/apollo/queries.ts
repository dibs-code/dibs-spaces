import { gql } from './__generated__/gql';

export const DailyData = gql(`query DailyDataQuery($skip: Int!, $day: BigInt!) {
    dailyGeneratedVolumes(first: 20, skip: $skip,  where: {day: $day, amountAsReferrer_gt: 0} orderBy: amountAsReferrer orderDirection: desc) {
      user
      amountAsReferrer
    }
  }`);

export const DailyDataForPair = gql(`query DailyDataForPairQuery($skip: Int!, $day: BigInt!, $pair: Bytes!) {
    dailyGeneratedVolumes(first: 20, skip: $skip,  where: {day: $day, amountAsReferrer_gt: 0, pair: $pair} orderBy: amountAsReferrer orderDirection: desc) {
      user
      amountAsReferrer
    }
  }`);
