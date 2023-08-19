import TableViewSwitch from 'components/basic/TableViewSwitch';
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
      <TableViewSwitch
        optionOneSelected={isCurrentEpoch}
        selectOptionOne={() => selectCurrentEpoch()}
        selectOptionTwo={() => selectPreviousEpoch()}
        optionOneLabel={'Current Epoch'}
        optionTwoLabel={'Previous Epoch'}
      />

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
