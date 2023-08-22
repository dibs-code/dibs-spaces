import { useApolloClient } from '@apollo/client';
import { DailyDataForPairQueryQuery } from 'apollo/__generated__/graphql';
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
    async (pairAddress: Address, day: number): Promise<LeaderBoardRecord[]> => {
      if (!dibsAddress || !pairAddress) return [];

      let offset = 0;
      const result: DailyDataForPairQueryQuery['dailyGeneratedVolumes'] = [];
      let chunkResult: DailyDataForPairQueryQuery['dailyGeneratedVolumes'] = [];
      do {
        chunkResult = (
          await apolloClient.query({
            query: DailyLeaderBoardForPair,
            variables: { day, skip: offset, pair: pairAddress },
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
