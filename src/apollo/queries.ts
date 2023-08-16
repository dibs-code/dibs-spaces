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

export const UserVolumeData = gql(`query UserVolumeDataQuery($skip: Int!, $user: Bytes!) {
    dailyGeneratedVolumes(first: 100, skip: $skip,  where: {user: $user, day_gte: 0, amountAsReferrer_gt: 0} orderBy: day orderDirection: desc) {
      user
      day
      amountAsReferrer
    }
  }`);
