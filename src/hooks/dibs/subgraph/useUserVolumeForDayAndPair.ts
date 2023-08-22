import { useApolloClient } from '@apollo/client';
import { UserVolumeDataForPairAndDay } from 'apollo/queries';
import BigNumberJS from 'bignumber.js';
import { useEffect, useState } from 'react';
import { fromWei } from 'utils/numbers';
import { Address } from 'wagmi';

export function useUserVolumeForDayAndPair({
  day,
  user,
  pair,
}: {
  day: number | undefined;
  user: Address | undefined;
  pair: Address | undefined;
}) {
  const apolloClient = useApolloClient();
  const [volume, setVolume] = useState<BigNumberJS | null>(null);
  useEffect(() => {
    let mounted = true;
    const fetchInfo = async () => {
      if (!day || !user || !pair) return;
      const result = (
        await apolloClient.query({
          query: UserVolumeDataForPairAndDay,
          variables: {
            day,
            user,
            pair,
          },
          fetchPolicy: 'cache-first',
        })
      ).data.dailyGeneratedVolumes;
      if (mounted && result.length) {
        setVolume(fromWei(result[0].amountAsReferrer));
      }
    };
    fetchInfo();
    return () => {
      mounted = false;
    };
  }, [apolloClient, pair, day, user]);
  return volume;
}
