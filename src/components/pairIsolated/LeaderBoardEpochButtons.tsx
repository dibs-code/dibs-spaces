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
  const [isCurrentEpoch, setIsCurrentEpoch] = React.useState(true);

  const setPreviousEpochToShowWinners = useCallback(() => {
    if (activeDay) {
      setEpochToShowWinners(activeDay - BigInt(1));
    }
  }, [activeDay, setEpochToShowWinners]);
  return (
    <div className="p-1.5 w-[382px] rounded border border-secondary">
      <div className={'flex flex-wrap relative h-full'}>
        <p
          className={`background bg-secondary absolute w-1/2 top-0 bottom-0 rounded transition-all duration-300 ease-in-out ${
            isCurrentEpoch ? 'left-0 right-1/2' : 'right-0 left-1/2'
          }`}
        ></p>
        <p
          className={`bg-transparent absolute cursor-pointer w-1/2 left-0 top-1/2 -translate-y-1/2 text-center font-medium transition-all duration-300 ease-in-out ${
            isCurrentEpoch ? 'text-white' : 'text-secondary'
          }`}
          onClick={() => setIsCurrentEpoch(true)}
        >
          Current Epoch
        </p>
        <p
          className={`bg-transparent absolute cursor-pointer w-1/2 right-0 top-1/2 -translate-y-1/2 text-center font-medium transition-all duration-300 ease-in-out ${
            isCurrentEpoch ? 'text-secondary' : 'text-white'
          }`}
          onClick={() => setIsCurrentEpoch(false)}
        >
          Previous Epoch
        </p>
        {/*<button*/}
        {/*  className={`${*/}
        {/*    activeDay && epochToShowWinners === activeDay - BigInt(1) ? 'btn-primary' : 'btn-primary-inverted'*/}
        {/*  } btn-large font-medium w-full xl:w-auto`}*/}
        {/*  onClick={setPreviousEpochToShowWinners}*/}
        {/*>*/}
        {/*  Current Epoch*/}
        {/*</button>*/}
        {/*<button*/}
        {/*  className={`${*/}
        {/*    epochToShowWinners === BigInt(10) ? 'btn-primary' : 'btn-primary-inverted'*/}
        {/*  } btn-large font-medium w-full xl:w-auto border-2`}*/}
        {/*  onClick={() => setEpochToShowWinners(BigInt(10))}*/}
        {/*>*/}
        {/*  10 Epoch*/}
        {/*</button>*/}
      </div>
    </div>
  );
}
