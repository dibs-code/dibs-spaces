import {
  useBondingTokenConnectorToken,
  useBondingTokenGetSaleReturn,
  useBondingTokenSymbol,
  useBondingTokenWrite,
  useErc20Decimals,
  useErc20Symbol,
  usePrepareBondingTokenBurn,
} from 'abis/types/generated';
import useBondingTokenDecimalsAndBalance from 'hooks/dibs/useBondingTokenDecimalsAndBalance';
// import { MaxUint256 } from 'constants/number';
import { useCallback, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { Address, useAccount } from 'wagmi';

export const SellCard = ({ bondingTokenAddress }: { bondingTokenAddress: Address }) => {
  const { address } = useAccount();

  const { data: connectorTokenAddress, isLoading: connectorTokenAddressLoading } = useBondingTokenConnectorToken({
    address: bondingTokenAddress,
  });
  const { data: connectorTokenSymbol, isLoading: connectorTokenSymbolLoading } = useErc20Symbol({
    address: connectorTokenAddress,
  });

  const { data: connectorTokenDecimals, isLoading: connectorTokenDecimalsLoading } = useErc20Decimals({
    address: connectorTokenAddress,
  });

  const {
    bondingTokenBalance,
    bondingTokenBalanceParsed,
    bondingTokenDecimals,
    bondingTokenBalanceLoading,
    bondingTokenDecimalsLoading,
  } = useBondingTokenDecimalsAndBalance(bondingTokenAddress, address);

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
    () =>
      connectorTokenDecimals !== undefined && saleReturn !== undefined
        ? formatUnits(saleReturn, connectorTokenDecimals)
        : undefined,
    [connectorTokenDecimals, saleReturn],
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
      bondingTokenBalanceLoading,
      bondingTokenDecimalsLoading,
      connectorTokenAddressLoading,
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
        balance: {bondingTokenBalanceParsed !== undefined ? bondingTokenBalanceParsed.toLocaleString() : '...'}{' '}
        {bondingTokenSymbol}
      </div>
      <input
        style={{ color: 'black' }}
        type="number"
        value={sellAmount}
        data-testid="share-sell-bonding-token-amount"
        onChange={(e) => setSellAmount(e.target.value)}
      />{' '}
      {bondingTokenSymbol}
      <div className="mt-2" data-testid="share-sale-return">
        Sale return: {saleReturnParsed ?? '...'} {connectorTokenSymbol}
      </div>
      <button className="btn btn--secondary my-2" onClick={onSell} data-testid="share-sell">
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
