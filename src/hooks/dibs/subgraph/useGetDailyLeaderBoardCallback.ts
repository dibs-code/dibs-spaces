import { useApolloClient } from '@apollo/client';
import { DailyDataQuery } from 'apollo/__generated__/graphql';
import { DailyData } from 'apollo/queries';
import { DibsAddressMap } from 'constants/addresses';
import { useContractAddress } from 'hooks/useContractAddress';
import { useCallback } from 'react';
import { LeaderBoardRecord } from 'types';
import { fromWei } from 'utils/numbers';

export default function useGetDailyLeaderBoardCallback() {
  const dibsAddress = useContractAddress(DibsAddressMap);
  const apolloClient = useApolloClient();

  return useCallback(
    async (day: number, first?: number): Promise<LeaderBoardRecord[]> => {
      if (!dibsAddress) return [];

      let offset = 0;
      const result: DailyDataQuery['dailyGeneratedVolumes'] = [];
      let chunkResult: DailyDataQuery['dailyGeneratedVolumes'] = [];
      do {
        chunkResult = (
          await apolloClient.query({
            query: DailyData,
            variables: { day, skip: offset, first: first ?? 1000 },
            fetchPolicy: 'cache-first',
          })
        ).data.dailyGeneratedVolumes;
        result.push(...chunkResult);
        if (first) break;
        offset += chunkResult.length;
      } while (chunkResult.length && offset <= 5000);

      return result.reduce((acc, ele) => {
        if (ele.user !== dibsAddress.toLowerCase()) {
          acc.push({
            ...ele,
            volume: fromWei(ele.amountAsReferrer),
          });
        }
        return acc;
      }, [] as LeaderBoardRecord[]);
    },
    [apolloClient, dibsAddress],
  );
}
