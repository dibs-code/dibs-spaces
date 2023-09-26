import {
  useBondingTokenConnectorToken,
  useBondingTokenDecimals,
  useBondingTokenGetPurchaseReturn,
  useBondingTokenSymbol,
  useBondingTokenWrite,
  useErc20Allowance,
  useErc20BalanceOf,
  useErc20Decimals,
  useErc20Symbol,
  useErc20Write,
  usePrepareBondingTokenMint,
  usePrepareErc20Approve,
} from 'abis/types/generated';
import { MaxUint256 } from 'constants/number';
import React, { useCallback, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { Address, useAccount } from 'wagmi';

export const BuyCard = ({ bondingTokenAddress }: { bondingTokenAddress: Address }) => {
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

  const [connectorTokenAmount, setConnectorTokenAmount] = useState('0');
  const connectorTokenAmountParsed = useMemo(
    () =>
      connectorTokenDecimals && connectorTokenAmount
        ? parseUnits(connectorTokenAmount, connectorTokenDecimals)
        : undefined,
    [connectorTokenDecimals, connectorTokenAmount],
  );
  const { data: purchaseReturn, isLoading: purchaseReturnLoading } = useBondingTokenGetPurchaseReturn({
    address: bondingTokenAddress,
    args: connectorTokenAmountParsed ? [connectorTokenAmountParsed] : undefined,
  });
  const purchaseReturnParsed = useMemo(
    () =>
      bondingTokenDecimals !== undefined && purchaseReturn !== undefined
        ? formatUnits(purchaseReturn, bondingTokenDecimals)
        : undefined,
    [bondingTokenDecimals, purchaseReturn],
  );

  const { address } = useAccount();
  const { data: allowance, isLoading: allowanceLoading } = useErc20Allowance({
    address: connectorTokenAddress,
    args: address ? [address, bondingTokenAddress] : undefined,
    watch: true,
  });
  const isApproved = useMemo(
    () =>
      allowance !== undefined && connectorTokenAmountParsed !== undefined && allowance >= connectorTokenAmountParsed,
    [allowance, connectorTokenAmountParsed],
  );

  const { data: connectorTokenBalance, isLoading: connectorTokenBalanceLoading } = useErc20BalanceOf({
    address: connectorTokenAddress,
    args: address ? [address] : undefined,
  });
  const connectorTokenBalanceParsed = useMemo(
    () =>
      connectorTokenDecimals !== undefined && connectorTokenBalance !== undefined
        ? Number(formatUnits(connectorTokenBalance, connectorTokenDecimals))
        : undefined,
    [connectorTokenDecimals, connectorTokenBalance],
  );
  const hasSufficientBalance = useMemo(
    () =>
      connectorTokenBalance !== undefined &&
      connectorTokenAmountParsed !== undefined &&
      connectorTokenBalance >= connectorTokenAmountParsed,
    [connectorTokenAmountParsed, connectorTokenBalance],
  );

  const loading = useMemo(
    () =>
      connectorTokenDecimalsLoading ||
      bondingTokenDecimalsLoading ||
      purchaseReturnLoading ||
      allowanceLoading ||
      connectorTokenBalanceLoading,
    [
      allowanceLoading,
      bondingTokenDecimalsLoading,
      connectorTokenBalanceLoading,
      connectorTokenDecimalsLoading,
      purchaseReturnLoading,
    ],
  );

  const { config: connectorTokenApproveConfig } = usePrepareErc20Approve({
    address: connectorTokenAddress,
    args: [bondingTokenAddress, MaxUint256],
  });
  const { write: approveConnectorToken } = useErc20Write(connectorTokenApproveConfig);

  const {
    config: bondingTokenMintConfig,
    error: mintError,
    isError: isMintError,
  } = usePrepareBondingTokenMint({
    address: bondingTokenAddress,
    args: connectorTokenAmountParsed && address ? [address, connectorTokenAmountParsed] : undefined,
  });
  const { write: bondingTokenMint } = useBondingTokenWrite(bondingTokenMintConfig);

  const onBuy = useCallback(async () => {
    if (loading || !connectorTokenAmountParsed || !hasSufficientBalance) return;
    if (!isApproved) {
      approveConnectorToken?.();
    } else {
      if (bondingTokenMint) {
        await bondingTokenMint();
      } else {
        if (isMintError) {
          console.log(mintError);
        }
      }
    }
  }, [
    approveConnectorToken,
    bondingTokenMint,
    connectorTokenAmountParsed,
    hasSufficientBalance,
    isApproved,
    isMintError,
    loading,
    mintError,
  ]);

  const { data: bondingTokenSymbol } = useBondingTokenSymbol({
    address: bondingTokenAddress,
  });

  return (
    <div>
      <p>Buy Share</p>
      <p>
        balance: {connectorTokenBalanceParsed !== undefined ? connectorTokenBalanceParsed.toLocaleString() : '...'}{' '}
        {connectorTokenSymbol}
      </p>
      <input
        style={{ color: 'black' }}
        type="number"
        value={connectorTokenAmount}
        data-testid="share-buy-connector-token-amount"
        onChange={(e) => setConnectorTokenAmount(e.target.value)}
      />{' '}
      {connectorTokenSymbol}
      <div className="mt-2" data-testid="share-purchase-return">
        {purchaseReturnParsed || '0'} {bondingTokenSymbol}
      </div>
      <button className="btn btn--secondary my-2" onClick={onBuy} data-testid="share-buy">
        {loading
          ? 'Loading...'
          : connectorTokenAmountParsed
          ? hasSufficientBalance
            ? isApproved
              ? 'Buy'
              : 'Approve'
            : 'Insufficient balance'
          : 'Enter Amount'}
      </button>
    </div>
  );
};
