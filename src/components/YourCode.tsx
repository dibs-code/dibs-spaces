import { useConnectModal } from '@rainbow-me/rainbowkit';
import SubmittedModal from 'components/modal/submitted';
import { chains, isSupportedChain } from 'constants/chains';
import { useDibsCodeData } from 'hooks/dibs/useDibsCodeData';
import { useDibsRegisterCallback } from 'hooks/dibs/useDibsRegisterCallback';
import useDibsUserTotalVolume from 'hooks/dibs/useDibsUserTotalVolume';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { copyToClipboard } from 'utils/index';
import { Address, useAccount, useNetwork } from 'wagmi';

const YourCode = ({ testAccount }: { testAccount?: Address }) => {
  const { chain } = useNetwork();
  const { address: account } = useAccount();
  const { addressToName, parentCodeName: parentCodeNameFromContract } = useDibsCodeData(testAccount ?? account);
  const [searchParams] = useSearchParams();
  const [parentCodeName, setParentCodeName] = useState('DIBS');
  const { userTotalVolume } = useDibsUserTotalVolume(testAccount ?? account);
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setParentCodeName(refCode);
    } else if (parentCodeNameFromContract) {
      setParentCodeName(parentCodeNameFromContract);
    }
  }, [parentCodeNameFromContract, searchParams]);

  const hasCode = useMemo(() => !!addressToName, [addressToName]);

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const [loading, setLoading] = useState(false);
  const [submittedTxHash, setSubmittedTxHash] = useState<string | null>(null);
  const [name, setName] = useState('');
  const { callback: registerCallback } = useDibsRegisterCallback(name, parentCodeName);
  const selectChain = async (chainId: any) => {
    console.log(chainId);
  };
  const { openConnectModal } = useConnectModal();

  const create = useCallback(async () => {
    if (!account) {
      openConnectModal?.();
      return;
    }
    if (!isSupportedChain(chain?.id)) {
      await selectChain(chains[0].id);
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      await registerCallback?.();
    } catch (e) {
      console.log('register failed');
      console.log(e);
    }
    if (mounted.current) {
      setLoading(false);
    }
  }, [account, chain?.id, loading, openConnectModal, registerCallback]);

  const refUrl = useMemo(() => `${window.location.host}/?ref=${addressToName}`, [addressToName]);

  const copyRefUrl = useCallback(async () => {
    await copyToClipboard(refUrl);
    alert('Copied to clipboard!');
  }, [refUrl]);

  return (
    <div className="page">
      <main>
        <section className="px-8 py-7 rounded bg-primary mb-8 flex w-full justify-between">
          <div className="section--left pr-6 max-w-[840px]">
            <h1 className="text-[32px] font-bold text-secondary mb-3">Your Code</h1>
            <p className="text-xl">
              Share the code below with others and start earning. share with others to generate volume with your code
              and secure a spot on the leaderboard.
            </p>
          </div>
          <div className="section--right items-center justify-end">
            <img src="/assets/images/header/your-code-icon.svg" alt="" className="w-24 h-24 mr-5" />
          </div>
        </section>
        <SubmittedModal
          hash={submittedTxHash}
          closeModal={() => {
            setSubmittedTxHash(null);
          }}
        ></SubmittedModal>
        {hasCode || testAccount ? (
          <section className="flex gap-8 mb-8">
            <div className="card-yellow rounded flex flex-col gap-20 bg-gray2 py-7 px-9 flex-1">
              <p className="card-title text-white font-medium text-2xl">Your Code</p>
              <span className="flex gap-4 items-center ml-auto">
                <p className="font-medium text-[32px] text-white">{addressToName}</p>
                <img onClick={copyRefUrl} src="/assets/images/code/copy-clipboard.svg" alt="" />
              </span>
            </div>
            <div className="card-red rounded flex flex-col gap-20 bg-gray2 py-7 px-9 flex-1">
              <p className="card-title text-white font-medium text-2xl">Volume Generated</p>
              <span className="flex gap-4 items-center ml-auto">
                <p className="font-medium text-[32px] text-white">${userTotalVolume?.toString() ?? '...'}</p>
                <img src="/assets/images/code/arrow-right.svg" alt="" />
              </span>
            </div>
          </section>
        ) : (
          <>
            <section className="rounded bg-gray2 min-h-[210px] flex flex-col gap-[22px] justify-center items-center mb-8">
              <p className="font-medium text-2xl text-white w-[420px] text-center">
                You have not create your dibs code yet, Create one and start earning!
              </p>
              <p className="font-medium text-white text-center">
                Your DiBs code can consist of both lowercase and uppercase letters, as well as numbers.
              </p>
            </section>
            <section className="flex justify-between mb-4">
              <div className="inputs flex gap-8 flex-1">
                <input
                  className="flex-1 bg-gray2 placeholder-gray3 text-white rounded py-3.5 pl-4 pr-2 flex items-center"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your code"
                />
                <input
                  className="flex-1 bg-gray2 placeholder-gray3 text-white rounded py-3.5 pl-4 pr-2 flex items-center"
                  type="text"
                  value={parentCodeName}
                  onChange={(e) => setParentCodeName(e.target.value)}
                  placeholder="Your referral code"
                />
              </div>
              <div className="flex-1">
                <button className="btn btn--secondary font-bold py-[11px] px-11 ml-auto" onClick={create}>
                  Create
                </button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default YourCode;
