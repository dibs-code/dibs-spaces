import { useApolloClient } from '@apollo/client';
import { DailyDataQueryQuery } from 'apollo/__generated__/graphql';
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
    async (day: number): Promise<LeaderBoardRecord[]> => {
      if (!dibsAddress) return [];

      let offset = 0;
      const result: DailyDataQueryQuery['dailyGeneratedVolumes'] = [];
      let chunkResult: DailyDataQueryQuery['dailyGeneratedVolumes'] = [];
      do {
        chunkResult = (
          await apolloClient.query({
            query: DailyData,
            variables: { day, skip: offset },
            fetchPolicy: 'cache-first',
          })
        ).data.dailyGeneratedVolumes;
        result.push(...chunkResult);
        offset += chunkResult.length;
      } while (chunkResult.length);
      return result
        .filter((ele) => ele.user !== dibsAddress.toLowerCase())
        .map((ele) => {
          return {
            ...ele,
            volume: fromWei(ele.amountAsReferrer),
          };
        });
    },
    [apolloClient, dibsAddress],
  );
}
