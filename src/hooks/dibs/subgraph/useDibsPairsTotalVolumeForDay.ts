import { useApolloClient } from '@apollo/client';
import { TotalVolumeForPairsAndDay } from 'apollo/queries';
import { useDibsCurrentDay } from 'hooks/dibs/useEpochTimer';
import { usePairRewarderFactoryAllPairs } from 'hooks/dibs/usePairRewarderFactory';
import { useCallback, useEffect, useState } from 'react';
import { PairVolumes } from 'types';
import { fromWei } from 'utils/numbers';
import { Address } from 'wagmi';

//TODO: this query does not work. use a query that works
export const useDibsPairsTotalVolumeForDay = (pairs: Address[] | null, day: number | null | undefined) => {
  const apolloClient = useApolloClient();

  const [pairsTotalVolumesForDay, setPairsTotalVolumesForDay] = useState<PairVolumes | null>(null);

  const getPairsTotalVolumeForDay = useCallback(
    async (pairsArg: Address[], dayArg: number): Promise<PairVolumes> => {
      const queryResult = (
        await apolloClient.query({
          query: TotalVolumeForPairsAndDay,
          variables: { pairs: pairsArg, day: dayArg },
          fetchPolicy: 'cache-first',
        })
      ).data.dailyGeneratedVolumes;
      const result: PairVolumes = {};
      pairsArg.forEach((pairAddress) => {
        const volumeObject = queryResult.find((item) => item.pair.toLowerCase() === pairAddress.toLowerCase());
        if (volumeObject) {
          result[pairAddress] = fromWei(volumeObject.amountAsReferrer);
        }
      });
      return result;
    },
    [apolloClient],
  );

  useEffect(() => {
    const fetchInfo = async () => {
      if (!pairs || !day) return;
      try {
        setPairsTotalVolumesForDay(await getPairsTotalVolumeForDay(pairs, day));
      } catch (error) {
        console.log('leaderboard get error :>> ', error);
      }
    };
    fetchInfo();
  }, [day, getPairsTotalVolumeForDay, pairs]);

  return { pairsTotalVolumesForDay };
};
export const useDibsAllPairsTotalVolumeForCurrentDay = () => {
  const currentDay = useDibsCurrentDay();
  const { allPairs } = usePairRewarderFactoryAllPairs();
  return useDibsPairsTotalVolumeForDay(allPairs, currentDay);
};
