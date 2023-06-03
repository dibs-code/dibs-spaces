import { Currency, CurrencyAmount } from '@uniswap/sdk-core';
import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  currencyBalance?: CurrencyAmount<Currency>;
  onUserInput?: (value: string) => void;
  testid?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const Input = (props: InputProps) => {
  const { className, disabled } = props;


  return (
    // todo #Beigiz we need to programmaticly bind the input focus to its wrapper for ui changes (border + shadow)
    <div className={`${className ? className : ''} inline-flex flex-col`}>
      
    </div>
  );
};

export default Input;
