import { gql } from './__generated__/gql';

export const DailyData = gql(`query DailyData($day: BigInt!, $first: Int!, $skip: Int!) {
    dailyGeneratedVolumes(first: $first, skip: $skip,  where: {day: $day, amountAsReferrer_gt: 0} orderBy: amountAsReferrer orderDirection: desc) {
      user
      amountAsReferrer
    }
  }`);

export const DailyLeaderBoardForPair =
  gql(`query DailyDataForPair($day: BigInt!, $pair: Bytes!, $first: Int!, $skip: Int!) {
    dailyGeneratedVolumes(first: $first, skip: $skip,  where: {day: $day, amountAsReferrer_gt: 0, pair: $pair} orderBy: amountAsReferrer orderDirection: desc) {
      user
      amountAsReferrer
    }
  }`);

export const UserVolumeData = gql(`query UserVolumeData($skip: Int!, $user: Bytes!) {
    dailyGeneratedVolumes(first: 1000, skip: $skip,  where: {user: $user, day_gte: 0, amountAsReferrer_gt: 0} orderBy: day orderDirection: desc) {
      user
      day
      pair
      amountAsReferrer
    }
  }`);

export const UserVolumeDataForPairAndDay =
  gql(`query UserVolumeDataForPairAndDay($user: Bytes!, $day: BigInt!, $pair: Bytes!) {
  dailyGeneratedVolumes(
    first: 1,  
    where: {
      user: $user, 
      day: $day,
      pair: $pair
    } 
  ) {
    amountAsReferrer
  }
}`);

//TODO: this query doesn't work, find a working query
export const TotalVolumeForPairsAndDay = gql(`query TotalVolumeForPairsAndDay($pairs: [Bytes!], $day: BigInt!) {
  dailyGeneratedVolumes(
    where: {
      user: "0x0000000000000000000000000000000000000000"
      day: $day,
      pair_in: $pairs
    } 
  ) {
    pair
    amountAsReferrer
  }
}`);
