import { useDibsAllPairsTotalVolumeForCurrentDay } from 'hooks/dibs/useDibsPairsTotalVolumeForDay';
import React, { createContext, ReactNode, useContext } from 'react';
import { PairVolumes } from 'types';

export const AllPairsTotalVolumeForCurrentDayContext = createContext<PairVolumes | null>(null);

interface PlatformsProviderProps {
  children: ReactNode;
}

// Define the Provider component
export const AllPairsTotalVolumeForCurrentDayContextProvider: React.FC<PlatformsProviderProps> = ({ children }) => {
  const { pairsTotalVolumesForDay: allPairsTotalVolumeForCurrentDay } = useDibsAllPairsTotalVolumeForCurrentDay();
  return (
    <AllPairsTotalVolumeForCurrentDayContext.Provider value={allPairsTotalVolumeForCurrentDay}>
      {children}
    </AllPairsTotalVolumeForCurrentDayContext.Provider>
  );
};

export const useAllPairsTotalVolumeForCurrentDayContext = () => {
  return useContext(AllPairsTotalVolumeForCurrentDayContext);
};
