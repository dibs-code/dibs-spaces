import React from 'react';

export default function TableViewSwitch({
  optionOneSelected,
  optionOneLabel,
  optionTwoLabel,
  selectOptionOne,
  selectOptionTwo,
}: {
  optionOneSelected: boolean;
  optionOneLabel: string;
  optionTwoLabel: string;
  selectOptionOne?: () => void;
  selectOptionTwo?: () => void;
}) {
  return (
    <div className="p-1.5 w-[382px] rounded border border-secondary">
      <div className={'flex flex-wrap relative h-full'}>
        <p
          className={`background bg-secondary absolute w-1/2 top-0 bottom-0 rounded transition-all duration-300 ease-in-out ${
            optionOneSelected ? 'left-0 right-1/2' : 'right-0 left-1/2'
          }`}
        ></p>
        <p
          className={`bg-transparent absolute cursor-pointer w-1/2 left-0 top-1/2 -translate-y-1/2 text-center font-medium transition-all duration-300 ease-in-out ${
            optionOneSelected ? 'text-white' : 'text-secondary'
          }`}
          onClick={selectOptionOne}
          data-testid="table-view-switch-option-one"
        >
          {optionOneLabel}
        </p>
        <p
          className={`bg-transparent absolute cursor-pointer w-1/2 right-0 top-1/2 -translate-y-1/2 text-center font-medium transition-all duration-300 ease-in-out ${
            optionOneSelected ? 'text-secondary' : 'text-white'
          }`}
          onClick={selectOptionTwo}
          data-testid="table-view-switch-option-two"
        >
          {optionTwoLabel}
        </p>
      </div>
    </div>
  );
}
