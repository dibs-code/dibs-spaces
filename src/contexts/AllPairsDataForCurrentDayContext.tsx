import { useDibsAllPairsTotalVolumeForCurrentDay } from 'hooks/dibs/useDibsPairsTotalVolumeForDay';
import React, { createContext, ReactNode, useContext } from 'react';

export const AllPairsDataForCurrentDayContext = createContext<{
  allPairsTotalVolumeForCurrentDay: ReturnType<
    typeof useDibsAllPairsTotalVolumeForCurrentDay
  >['pairsTotalVolumesForDay'];
} | null>(null);

interface PlatformsProviderProps {
  children: ReactNode;
}

// Define the Provider component
export const AllPairsDataForCurrentDayContextProvider: React.FC<PlatformsProviderProps> = ({ children }) => {
  const { pairsTotalVolumesForDay: allPairsTotalVolumeForCurrentDay } = useDibsAllPairsTotalVolumeForCurrentDay();
  return (
    <AllPairsDataForCurrentDayContext.Provider value={{ allPairsTotalVolumeForCurrentDay }}>
      {children}
    </AllPairsDataForCurrentDayContext.Provider>
  );
};

export const useAllPairsDataForCurrentDayContext = () => {
  const context = useContext(AllPairsDataForCurrentDayContext);
  if (context === null) {
    throw new Error('useCreateLeaderBoardModalContext must be used within a LeaderBoardProvider');
  }
  return context;
};
