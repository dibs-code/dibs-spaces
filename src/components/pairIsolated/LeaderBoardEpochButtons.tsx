import React, { useCallback } from 'react';

export function LeaderBoardEpochButtons({
  epochToShowWinners,
  setEpochToShowWinners,
  activeDay,
}: {
  epochToShowWinners: bigint | null;
  setEpochToShowWinners: Function;
  activeDay: bigint | undefined;
}) {
  const setPreviousEpochToShowWinners = useCallback(() => {
    if (activeDay) {
      setEpochToShowWinners(activeDay - BigInt(1));
    }
  }, [activeDay, setEpochToShowWinners]);
  return (
    <div className={'flex flex-wrap'}>
      <button
        className={`${
          activeDay && epochToShowWinners === activeDay - BigInt(1) ? 'btn-primary' : 'btn-primary-inverted'
        } btn-large font-medium mt-4 w-full xl:w-auto px-8`}
        onClick={setPreviousEpochToShowWinners}
      >
        Previous Epoch
      </button>
      <button
        className={`${
          epochToShowWinners === BigInt(10) ? 'btn-primary' : 'btn-primary-inverted'
        } btn-large font-medium mt-4 w-full xl:w-auto px-8 border-2 mx-2`}
        onClick={() => setEpochToShowWinners(BigInt(10))}
      >
        Day 10
      </button>
    </div>
  );
}
