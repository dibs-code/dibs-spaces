// import { faCopy } from '@fortawesome/pro-regular-svg-icons';
// import { faCircleInfo } from '@fortawesome/pro-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Input from 'components/basic/input';
import SubmittedModal from 'components/modal/submitted';
import { isSupportedChain, SupportedChainId } from 'constants/chains';
import { useDibsData } from 'hooks/dibs/useDibsData';
import { useDibsRegisterCallback } from 'hooks/dibs/useDibsRegisterCallback';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { copyToClipboard } from 'utils/index';
import { useAccount, useNetwork } from 'wagmi';

const YourCode = () => {
  const { chain } = useNetwork();
  const { address: account } = useAccount();
  const { addressToName, parentCodeName: parentCodeNameFromContract } = useDibsData();
  const [searchParams, _setSearchParams] = useSearchParams();
  const [parentCodeName, setParentCodeName] = useState('');

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setParentCodeName(refCode);
    }
  }, [searchParams]);

  useEffect(() => {
    if (parentCodeNameFromContract) {
      setParentCodeName(parentCodeNameFromContract);
    }
  }, [parentCodeNameFromContract]);

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
      await selectChain(SupportedChainId.BSC);
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
    <>
      <SubmittedModal
        hash={submittedTxHash}
        closeModal={() => {
          setSubmittedTxHash(null);
        }}
      ></SubmittedModal>
      <header className={'border-b pb-4 mb-16'}>
        <h2>Your Code</h2>
      </header>
      {hasCode ? (
        <main>
          <p>
            Share the code below with others and start earning. With each trade of the ones using your code, you earn a
            portion of the trade fee. For more information, please visit [link]
          </p>
          <section
            className={
              'px-2 rounded-2xl md:bg-codeinfo h-80 bg-cover mt-4 flex flex-col gap-3 justify-center items-center'
            }
          >
            <div>
              <div className={'rounded-xl bg-primary-light inline-block p-4'}>
                <span className={'text-lg mr-3'}>Your Dibs Code:</span>
                <span className={'text-2xl text-primary'}>{addressToName}</span>
              </div>
            </div>
            <div>
              <div className={'rounded-xl bg-soft-blue inline-block p-4'}>
                <span className={'mr-2'}>Register link:</span>
                <span className={'font-normal mr-2'}>{refUrl}</span>
                <span
                  className={
                    'py-1 px-2 bg-white rounded shadow-[0_4px_6px_rgba(0,0,0,0.07)] cursor-pointer transition duration-200 hover:shadow-xl'
                  }
                  onClick={copyRefUrl}
                >
                  Copy
                  {/*<FontAwesomeIcon style={{ fontSize: 18 }} icon={faCopy}></FontAwesomeIcon>*/}
                </span>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <main>
          <div className={'rounded-2xl text-xl bg-nocode bg-cover'}>
            <p
              className={
                'text-xl md:text-2xl font-normal h-64 px-8 md:px-18 lg:px-24 text-center flex justify-center items-center'
              }
            >
              You didn’t create your dibs code yet,<br></br>
              Create one and start earning!
            </p>
          </div>
          <div className={'inline-flex gap-2 mt-4 items-center px-4 py-4 bg-blue-gray-light rounded-lg'}>
            {/*<FontAwesomeIcon style={{ fontSize: 20, color: '#2394D3' }} icon={faCircleInfo}></FontAwesomeIcon>*/}
            <p className={'font-normal'}>Your dibs code can contain use lowercase, uppercase Letters and numbers</p>
          </div>
          <section className={'mt-8 flex flex-col xl:flex-row gap-4 items-center'}>
            <Input
              className={'flex-auto w-full xl:w-auto'}
              value={name}
              onUserInput={setName}
              label={'Your Code'}
              placeholder={'Enter code'}
            />
            <Input
              value={parentCodeName}
              onUserInput={setParentCodeName}
              className={'flex-auto w-full xl:w-auto'}
              label={'Your Referral Code'}
              placeholder={'Enter Referral Code'}
            />
            <button
              className={`btn-primary btn-large font-medium mt-4 w-full xl:w-auto px-8 ${loading ? 'btn-waiting' : ''}`}
              onClick={create}
            >
              {account
                ? isSupportedChain(chain?.id)
                  ? loading
                    ? 'Waiting to Confirm'
                    : 'Create'
                  : 'Switch Network'
                : 'Connect Wallet'}
            </button>
          </section>
        </main>
      )}
    </>
  );
};

export default YourCode;
