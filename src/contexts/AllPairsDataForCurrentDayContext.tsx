import { useDibsAllPairsTotalVolumeForCurrentDay } from 'hooks/dibs/subgraph/useDibsPairsTotalVolumeForDay';
import useGetDailyLeaderBoardForPairCallback from 'hooks/dibs/subgraph/useGetDailyLeaderBoardForPairCallback';
import { useDibsCurrentDay } from 'hooks/dibs/useEpochTimer';
import { usePairRewarderFactoryAllPairs } from 'hooks/dibs/usePairRewarderFactory';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { PairLeaderBoardsCache } from 'types';

export const AllPairsDataForCurrentDayContext = createContext<{
  allPairsTotalVolumeForCurrentDay: ReturnType<
    typeof useDibsAllPairsTotalVolumeForCurrentDay
  >['pairsTotalVolumesForDay'];
  pairLeaderBoardsCache: PairLeaderBoardsCache;
} | null>(null);

interface PlatformsProviderProps {
  children: ReactNode;
}

// Define the Provider component
export const AllPairsDataForCurrentDayContextProvider: React.FC<PlatformsProviderProps> = ({ children }) => {
  //TODO: this query does not work. use a query that works
  const { pairsTotalVolumesForDay: allPairsTotalVolumeForCurrentDay } = useDibsAllPairsTotalVolumeForCurrentDay();

  const currentDay = useDibsCurrentDay();

  const [pairLeaderBoardsCache, setPairLeaderBoardsCache] = useState<PairLeaderBoardsCache>({});
  const getDailyLeaderboardDataForPair = useGetDailyLeaderBoardForPairCallback();
  const { allPairsNotFilteredByValid: allPairs } = usePairRewarderFactoryAllPairs();
  useEffect(() => {
    async function getData() {
      if (!currentDay || !allPairs) return;
      allPairs.forEach((pairAddress) => {
        getDailyLeaderboardDataForPair(pairAddress, currentDay).then((data) =>
          setPairLeaderBoardsCache((cacheData) => Object.assign({ [pairAddress]: data }, cacheData)),
        );
      });
    }

    getData();
  }, [allPairs, currentDay, getDailyLeaderboardDataForPair]);

  return (
    <AllPairsDataForCurrentDayContext.Provider value={{ allPairsTotalVolumeForCurrentDay, pairLeaderBoardsCache }}>
      {children}
    </AllPairsDataForCurrentDayContext.Provider>
  );
};

//TODO: this query does not work. use a query that works
export const useAllPairsDataForCurrentDayContext = () => {
  const context = useContext(AllPairsDataForCurrentDayContext);
  if (context === null) {
    throw new Error('useCreateLeaderBoardModalContext must be used within a LeaderBoardProvider');
  }
  return context;
};
