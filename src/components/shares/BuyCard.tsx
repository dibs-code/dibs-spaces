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

  const [buyAmount, setBuyAmount] = useState('0');
  const buyAmountParsed = useMemo(
    () => (connectorTokenDecimals && buyAmount ? parseUnits(buyAmount, connectorTokenDecimals) : undefined),
    [connectorTokenDecimals, buyAmount],
  );
  const { data: purchaseReturn, isLoading: purchaseReturnLoading } = useBondingTokenGetPurchaseReturn({
    address: bondingTokenAddress,
    args: buyAmountParsed ? [buyAmountParsed] : undefined,
  });
  const purchaseReturnParsed = useMemo(
    () => (bondingTokenDecimals && purchaseReturn ? formatUnits(purchaseReturn, bondingTokenDecimals) : undefined),
    [bondingTokenDecimals, purchaseReturn],
  );

  const { address } = useAccount();
  const { data: allowance, isLoading: allowanceLoading } = useErc20Allowance({
    address: connectorTokenAddress,
    args: address ? [address, bondingTokenAddress] : undefined,
    watch: true,
  });
  const isApproved = useMemo(
    () => allowance !== undefined && buyAmountParsed !== undefined && allowance >= buyAmountParsed,
    [allowance, buyAmountParsed],
  );

  const { data: connectorTokenBalance, isLoading: connectorTokenBalanceLoading } = useErc20BalanceOf({
    address: connectorTokenAddress,
    args: address ? [address] : undefined,
  });
  const hasSufficientBalance = useMemo(
    () =>
      connectorTokenBalance !== undefined && buyAmountParsed !== undefined && connectorTokenBalance >= buyAmountParsed,
    [buyAmountParsed, connectorTokenBalance],
  );

  const loading = useMemo(
    () =>
      connectorTokenAddressLoading ||
      connectorTokenSymbolLoading ||
      connectorTokenDecimalsLoading ||
      bondingTokenDecimalsLoading ||
      purchaseReturnLoading ||
      allowanceLoading ||
      connectorTokenBalanceLoading,
    [
      allowanceLoading,
      bondingTokenDecimalsLoading,
      connectorTokenAddressLoading,
      connectorTokenBalanceLoading,
      connectorTokenDecimalsLoading,
      connectorTokenSymbolLoading,
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
    args: buyAmountParsed && address ? [address, buyAmountParsed] : undefined,
  });
  const { write: bondingTokenMint } = useBondingTokenWrite(bondingTokenMintConfig);

  const onBuy = useCallback(async () => {
    if (loading || !buyAmountParsed || !hasSufficientBalance) return;
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
    buyAmountParsed,
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
      <input
        style={{ color: 'black' }}
        type="number"
        value={buyAmount}
        onChange={(e) => setBuyAmount(e.target.value)}
      />{' '}
      {connectorTokenSymbol}
      <div className="mt-2">
        {purchaseReturnParsed || '0'} {bondingTokenSymbol}
      </div>
      <button className="btn btn--secondary my-2" onClick={onBuy}>
        {loading
          ? 'Loading...'
          : buyAmountParsed
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
