import { DailyDataForPairQuery } from 'apollo/__generated__/graphql';

import { DibsContractAddresses } from './data';

export const getTestSelector = (selectorId: string) => `[data-testid=${selectorId}]`;

export const getTestSelectorStartsWith = (selectorId: string) => `[data-testid^=${selectorId}]`;

export function injectDibsContractAddressInLeaderBoardThatShouldBeFiltered({ data }: { data: DailyDataForPairQuery }): {
  data: DailyDataForPairQuery;
} {
  return {
    data: {
      ...data,
      dailyGeneratedVolumes: [
        {
          user: DibsContractAddresses.dibs.toLowerCase(),
          amountAsReferrer: '90327005718129500',
          __typename: 'DailyGeneratedVolume',
        },
        ...data.dailyGeneratedVolumes,
      ],
    },
  };
}
