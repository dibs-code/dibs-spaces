import { formatUnits } from '@ethersproject/units';
import React, { useMemo } from 'react';

import { useErc20Decimals, useErc20Symbol } from '../../abis/types/generated';
import { BalanceObject } from '../../hooks/dibs/useDibsData';

export const AccBalance = (props: { obj: BalanceObject }) => {
  const { data: decimals } = useErc20Decimals({
    address: props.obj.tokenAddress,
  });
  const { data: symbol } = useErc20Symbol({
    address: props.obj.tokenAddress,
  });

  const balance = useMemo(() => {
    return formatUnits(props.obj.balance, decimals);
  }, [decimals, props.obj.balance]);

  return (
    <h2>
      {balance} {symbol}
    </h2>
  );
};
export const NoBalance = () => {
  return <h2>0 USDC</h2>;
};
