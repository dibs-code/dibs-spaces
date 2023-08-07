import { gql } from './__generated__/gql';

export const DailyData = gql(`query DailyDataQuery($skip: Int!, $day: BigInt!) {
    dailyGeneratedVolumes(first: 100, skip: $skip,  where: {day: $day, amountAsReferrer_gt: 0} orderBy: amountAsReferrer orderDirection: desc) {
      user
      amountAsReferrer
    }
  }`);
