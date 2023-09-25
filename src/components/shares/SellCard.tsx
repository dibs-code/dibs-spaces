import {
  useBondingTokenConnectorToken,
  useBondingTokenDecimals,
  useBondingTokenGetSaleReturn,
  useBondingTokenSymbol,
  useBondingTokenWrite,
  useErc20BalanceOf,
  useErc20Decimals,
  useErc20Symbol,
  usePrepareBondingTokenBurn,
} from 'abis/types/generated';
// import { MaxUint256 } from 'constants/number';
import { useCallback, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { Address, useAccount } from 'wagmi';

export const SellCard = ({ bondingTokenAddress }: { bondingTokenAddress: Address }) => {
  const { data: connectorTokenAddress, isLoading: connectorTokenAddressLoading } = useBondingTokenConnectorToken({
    address: bondingTokenAddress,
  });
  const { data: connectorTokenSymbol, isLoading: connectorTokenSymbolLoading } = useErc20Symbol({
    address: connectorTokenAddress,
  });

  const { data: connectorTokenDecimals, isLoading: connectorTokenDecimalsLoading } = useErc20Decimals({
    address: connectorTokenAddress,
  });
  const { data: bondingTokenDecimals, isLoading: bondingTokenDecimalsLoading } = useBondingTokenDecimals({
    address: bondingTokenAddress,
  });

  const [sellAmount, setSellAmount] = useState('0');
  const sellAmountParsed = useMemo(
    () => (bondingTokenDecimals && sellAmount ? parseUnits(sellAmount, bondingTokenDecimals) : undefined),
    [bondingTokenDecimals, sellAmount],
  );
  const { data: saleReturn, isLoading: saleReturnLoading } = useBondingTokenGetSaleReturn({
    address: bondingTokenAddress,
    args: sellAmountParsed ? [sellAmountParsed] : undefined,
  });
  const saleReturnParsed = useMemo(
    () => (connectorTokenDecimals && saleReturn ? formatUnits(saleReturn, connectorTokenDecimals) : undefined),
    [connectorTokenDecimals, saleReturn],
  );

  const { address } = useAccount();

  const { data: bondingTokenBalance, isLoading: bondingTokenBalanceLoading } = useErc20BalanceOf({
    address: bondingTokenAddress,
    args: address ? [address] : undefined,
  });
  const bondingTokenBalanceParsed = useMemo(
    () =>
      bondingTokenDecimals && bondingTokenBalance ? formatUnits(bondingTokenBalance, bondingTokenDecimals) : undefined,
    [bondingTokenDecimals, bondingTokenBalance],
  );

  const hasSufficientBalance = useMemo(
    () =>
      bondingTokenBalance !== undefined && sellAmountParsed !== undefined && bondingTokenBalance >= sellAmountParsed,
    [sellAmountParsed, bondingTokenBalance],
  );

  const loading = useMemo(
    () =>
      connectorTokenAddressLoading ||
      connectorTokenSymbolLoading ||
      connectorTokenDecimalsLoading ||
      bondingTokenDecimalsLoading ||
      saleReturnLoading ||
      bondingTokenBalanceLoading,
    [
      bondingTokenDecimalsLoading,
      connectorTokenAddressLoading,
      bondingTokenBalanceLoading,
      connectorTokenDecimalsLoading,
      connectorTokenSymbolLoading,
      saleReturnLoading,
    ],
  );

  const {
    config: bondingTokenBurnConfig,
    error: burnError,
    isError: isBurnError,
  } = usePrepareBondingTokenBurn({
    address: bondingTokenAddress,
    args: sellAmountParsed && address ? [sellAmountParsed, address] : undefined,
  });
  const { write: bondingTokenBurn } = useBondingTokenWrite(bondingTokenBurnConfig);

  const onSell = useCallback(async () => {
    if (loading || !sellAmountParsed || !hasSufficientBalance) return;
    if (bondingTokenBurn) {
      await bondingTokenBurn();
    } else {
      if (isBurnError) {
        console.log(burnError);
      }
    }
  }, [bondingTokenBurn, sellAmountParsed, hasSufficientBalance, isBurnError, loading, burnError]);

  const { data: bondingTokenSymbol } = useBondingTokenSymbol({
    address: bondingTokenAddress,
  });

  return (
    <div>
      <p>Sell Share</p>
      <div>
        balance: {bondingTokenBalanceParsed?.toLocaleString()} {bondingTokenSymbol}
      </div>
      <input
        style={{ color: 'black' }}
        type="number"
        value={sellAmount}
        onChange={(e) => setSellAmount(e.target.value)}
      />{' '}
      {bondingTokenSymbol}
      <div className="mt-2">
        {saleReturnParsed || '0'} {connectorTokenSymbol}
      </div>
      <button className="btn btn--secondary my-2" onClick={onSell}>
        {loading
          ? 'Loading...'
          : sellAmountParsed
          ? hasSufficientBalance
            ? 'Sell'
            : 'Insufficient balance'
          : 'Enter Amount'}
      </button>
    </div>
  );
};
