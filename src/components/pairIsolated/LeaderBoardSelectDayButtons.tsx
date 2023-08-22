import TableViewSwitch from 'components/basic/TableViewSwitch';
import { useDibsCurrentDay } from 'hooks/dibs/useEpochTimer';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

export function LeaderBoardSelectDayButtons({
  selectedDay,
  selectPreviousDay,
  selectCurrentDay,
  setSelectedDay,
}: {
  selectedDay: number | null;
  selectPreviousDay: () => void;
  selectCurrentDay: () => void;
  setSelectedDay: (value: number) => void;
}) {
  const params = useParams();
  const currentDay = useDibsCurrentDay();
  const isCurrentDay = useMemo(() => selectedDay === currentDay, [currentDay, selectedDay]);
  return (
    <>
      <TableViewSwitch
        optionOneSelected={isCurrentDay}
        selectOptionOne={() => selectCurrentDay()}
        selectOptionTwo={() => selectPreviousDay()}
        optionOneLabel={'Current Epoch'}
        optionTwoLabel={'Previous Epoch'}
      />

      {params.address === 'test' && (
        <>
          <button
            className={`btn-primary btn-large font-medium w-full xl:w-auto border-2`}
            onClick={() => setSelectedDay(10)}
          >
            Day 10 test contract
          </button>
          <button
            className={`btn-primary btn-large font-medium w-full xl:w-auto border-2`}
            onClick={() => setSelectedDay(21)}
          >
            Day 21 test pair subgraph
          </button>
        </>
      )}
    </>
  );
}
