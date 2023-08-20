import usePairRewarderCreateAndSetPrize from 'hooks/dibs/usePairRewarderCreateAndSetPrize';
import React, { createContext, ReactNode, useContext, useState } from 'react';

export enum CreateLeaderBoardStage {
  SET_PAIR,
  SET_TOKENS,
  SET_AMOUNTS,
  SUBMIT,
}

export const CreateLeaderBoardModalContext = createContext<
  | (ReturnType<typeof usePairRewarderCreateAndSetPrize> & {
      createLeaderBoardStage: CreateLeaderBoardStage;
      setCreateLeaderBoardStage: React.Dispatch<React.SetStateAction<CreateLeaderBoardStage>>;
      createLeaderBoardModalOpen: boolean;
      setCreateLeaderBoardModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    })
  | null
>(null);

interface PlatformsProviderProps {
  children: ReactNode;
}

// Define the Provider component
export const CreateLeaderBoardModalContextProvider: React.FC<PlatformsProviderProps> = ({ children }) => {
  const [createLeaderBoardStage, setCreateLeaderBoardStage] = useState(CreateLeaderBoardStage.SET_PAIR);
  const [createLeaderBoardModalOpen, setCreateLeaderBoardModalOpen] = useState(false);

  const hookData = usePairRewarderCreateAndSetPrize();

  return (
    <CreateLeaderBoardModalContext.Provider
      value={{
        createLeaderBoardStage,
        setCreateLeaderBoardStage,
        createLeaderBoardModalOpen,
        setCreateLeaderBoardModalOpen,
        ...hookData,
      }}
    >
      {children}
    </CreateLeaderBoardModalContext.Provider>
  );
};

// Create a hook to use this context easily
export const useCreateLeaderBoardModalContext = () => {
  const context = useContext(CreateLeaderBoardModalContext);
  if (context === null) {
    throw new Error('useCreateLeaderBoardModalContext must be used within a LeaderBoardProvider');
  }
  return context;
};
