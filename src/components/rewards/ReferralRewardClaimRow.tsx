import { formatUnits } from '@ethersproject/units';
import { useErc20Decimals, useErc20Symbol } from 'abis/types/generated';
import SubmittedModal from 'components/modal/submitted';
import { BalanceToClaimObject } from 'hooks/dibs/useDibsReferralRewardsData';
import { useClaimFees } from 'hooks/muon/useClaimFees';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export enum ClaimState {
  LOADED = 'Claim',
  AWAITING_USER_SIGNATURE = 'Waiting for user signature...',
  AWAITING_SERVER_RESPONSE = 'Waiting for server response...',
  AWAITING_TX_USER_CONFIRMATION = 'Waiting for user confirmation...',
}

export const ReferralRewardClaimRow = (props: { obj: BalanceToClaimObject }) => {
  const { data: decimals } = useErc20Decimals({
    address: props.obj.tokenAddress,
  });
  const { data: symbol } = useErc20Symbol({
    address: props.obj.tokenAddress,
  });
  const balance = useMemo(() => {
    return formatUnits(props.obj.balance, decimals);
  }, [decimals, props.obj.balance]);

  const { callback: claimFeeCallback } = useClaimFees();

  const [submittedTxHash, setSubmittedTxHash] = useState<string | null>(null);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const [claimState, setClaimState] = useState(ClaimState.LOADED);

  const claim = useCallback(async () => {
    if (claimState !== ClaimState.LOADED) return;
    try {
      if (claimFeeCallback) {
        setClaimState(ClaimState.AWAITING_TX_USER_CONFIRMATION);
        claimFeeCallback(props.obj).finally(() => {
          if (mounted.current) {
            setClaimState(ClaimState.LOADED);
          }
        });
      }
    } catch (e) {
      console.log('claim failed');
      console.log(e);
    }
  }, [claimFeeCallback, claimState, props.obj]);

  function getLogoSrc(symbol: string | null | undefined) {
    if (symbol && ['eth', 'uni', 'usdc'].includes(symbol.toLowerCase())) {
      return `/${symbol.toLowerCase()}-logo.svg`;
    }
    return 'eth-logo.svg';
  }

  return (
    <>
      <SubmittedModal
        hash={submittedTxHash}
        closeModal={() => {
          setSubmittedTxHash(null);
        }}
      ></SubmittedModal>
      <li className={'flex justify-between rounded-xl  items-center m-3 bg-primary-light px-4 py-3'}>
        <div className={'flex items-center gap-4'}>
          {/* shadow-[0px 4px 10px rgba(0, 0, 0, 0.08)] */}
          <div className={'p-2 rounded-full shadow-xl bg-white'}>
            <img className={'w-8 h-8'} src={getLogoSrc(symbol || 'eth')} alt={'token'} />
          </div>
          <p className={'text-xl font-semibold'}>{balance + ' ' + symbol}</p>
        </div>
        <div>
          <button
            className={`btn-medium btn-primary ${claimState !== ClaimState.LOADED ? 'btn-waiting' : ''}`}
            onClick={claim}
          >
            {claimState}
          </button>
        </div>
      </li>
    </>
  );
};
