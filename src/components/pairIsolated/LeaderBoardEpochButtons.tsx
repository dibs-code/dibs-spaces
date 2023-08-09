import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

export function LeaderBoardEpochButtons({
  selectedEpoch,
  selectPreviousEpoch,
  selectCurrentEpoch,
  activeDay,
  setSelectedEpoch,
}: {
  selectedEpoch: bigint | null;
  selectPreviousEpoch: () => void;
  selectCurrentEpoch: () => void;
  activeDay: bigint | undefined;
  setSelectedEpoch: (value: bigint) => void;
}) {
  const params = useParams();
  const isCurrentEpoch = useMemo(() => selectedEpoch === activeDay, [activeDay, selectedEpoch]);
  return (
    <>
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
            onClick={() => selectCurrentEpoch()}
          >
            Current Epoch
          </p>
          <p
            className={`bg-transparent absolute cursor-pointer w-1/2 right-0 top-1/2 -translate-y-1/2 text-center font-medium transition-all duration-300 ease-in-out ${
              isCurrentEpoch ? 'text-secondary' : 'text-white'
            }`}
            onClick={() => selectPreviousEpoch()}
          >
            Previous Epoch
          </p>
        </div>
      </div>

      {params.address === 'test' && (
        <>
          <button
            className={`btn-primary btn-large font-medium w-full xl:w-auto border-2`}
            onClick={() => setSelectedEpoch(BigInt(10))}
          >
            Day 10 test contract
          </button>
          <button
            className={`btn-primary btn-large font-medium w-full xl:w-auto border-2`}
            onClick={() => setSelectedEpoch(BigInt(21))}
          >
            Day 21 test pair subgraph
          </button>
        </>
      )}
    </>
  );
}
