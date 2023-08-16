import { useApolloClient } from '@apollo/client';
import { UserVolumeDataQueryQuery } from 'apollo/__generated__/graphql';
import { UserVolumeData } from 'apollo/queries';
import BigNumberJS from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import { Address } from 'wagmi';

const useDibsUserTotalVolume = (account: Address | undefined) => {
  const apolloClient = useApolloClient();

  const [userTotalVolume, setUserTotalVolume] = useState<BigNumberJS | null>(null);

  const getDailyLeaderboardData = useCallback(
    async (user: string): Promise<BigNumberJS> => {
      let offset = 0;
      const result: UserVolumeDataQueryQuery['dailyGeneratedVolumes'] = [];
      let chunkResult: UserVolumeDataQueryQuery['dailyGeneratedVolumes'] = [];
      do {
        chunkResult = (
          await apolloClient.query({
            query: UserVolumeData,
            variables: { user, skip: offset },
            fetchPolicy: 'cache-first',
          })
        ).data.dailyGeneratedVolumes;
        result.push(...chunkResult);
        offset += chunkResult.length;
      } while (chunkResult.length);
      console.log({ result });
      return result.reduce((a, c) => a.plus(new BigNumberJS(c.amountAsReferrer)), new BigNumberJS(0));
    },
    [apolloClient],
  );

  useEffect(() => {
    const fetchInfo = async () => {
      if (!account) return;
      try {
        setUserTotalVolume(await getDailyLeaderboardData(account));
      } catch (error) {
        console.log('leaderboard get error :>> ', error);
      }
    };
    fetchInfo();
  }, [account, getDailyLeaderboardData]);

  return { userTotalVolume };
};
export default useDibsUserTotalVolume;
