import { useApolloClient } from '@apollo/client';
import { DailyDataForPairQuery } from 'apollo/__generated__/graphql';
import { DailyLeaderBoardForPair } from 'apollo/queries';
import { DibsAddressMap } from 'constants/addresses';
import { useContractAddress } from 'hooks/useContractAddress';
import { useCallback } from 'react';
import { LeaderBoardRecord } from 'types';
import { fromWei } from 'utils/numbers';
import { Address } from 'wagmi';

export default function useGetDailyLeaderBoardForPairCallback() {
  const dibsAddress = useContractAddress(DibsAddressMap);
  const apolloClient = useApolloClient();

  return useCallback(
    async (pairAddress: Address, day: number, first?: number): Promise<LeaderBoardRecord[]> => {
      if (!dibsAddress || !pairAddress) return [];

      let offset = 0;
      const result: DailyDataForPairQuery['dailyGeneratedVolumes'] = [];
      let chunkResult: DailyDataForPairQuery['dailyGeneratedVolumes'] = [];
      do {
        chunkResult = (
          await apolloClient.query({
            query: DailyLeaderBoardForPair,
            variables: { day, pair: pairAddress, skip: offset, first: first ?? 1000 },
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
