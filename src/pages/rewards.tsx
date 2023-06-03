// import {faCopy} from "@fortawesome/pro-regular-svg-icons";
import { formatUnits } from '@ethersproject/units';
import { faCircleDollarToSlot, faGift, faTicket } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useErc20Decimals, useErc20Symbol } from 'abis/types/generated';
import Modal from 'components/modal';
import SubmittedModal from 'components/modal/submitted';
import Sidenav from 'components/navigation/sidenav';
import { BalanceObject, BalanceToClaimObject } from 'hooks/dibs/useDibsData';
import { LotteryStatus, useDibsLotteryData } from 'hooks/dibs/useDibsLotteryData';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useDibsData } from '../hooks/dibs/useDibsData';
import { useClaimFees } from '../hooks/muon/useClaimFees';

const AccBalance = (props: { obj: BalanceObject }) => {
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

const NoBalance = () => {
  return <h2>0 USDC</h2>;
};

enum ClaimState {
  LOADED = 'Claim',
  AWAITING_USER_SIGNATURE = 'Waiting for user signature...',
  AWAITING_SERVER_RESPONSE = 'Waiting for server response...',
  AWAITING_TX_USER_CONFIRMATION = 'Waiting for user confirmation...',
}

const ClaimRow = (props: { obj: BalanceToClaimObject }) => {
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
const Rewards = () => {
  const { balancesToClaim, claimedBalances } = useDibsData();
  const { userLotteryStatus } = useDibsLotteryData();

  const wonLottery = useMemo(() => userLotteryStatus === LotteryStatus.WON, [userLotteryStatus]);

  const prePrize = false;

  // Mock variable for type of reward (nft / token)
  // const [isNFT, setIsNFT] = useState(false);

  const [open, setOpen] = useState(false);

  function closeModal() {
    setOpen(false);
  }

  const { activeLotteryRound, firstRoundStartTime, roundDuration, userLotteryTickets } = useDibsLotteryData();

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const [days, setDays] = useState('00');
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  useEffect(() => {
    const diffTime =
      firstRoundStartTime && activeLotteryRound && roundDuration
        ? firstRoundStartTime + (activeLotteryRound + 1) * roundDuration - Math.floor(now.getTime() / 1000)
        : 0;
    const diff = {
      seconds: String(diffTime % 60).padStart(2, '0'),
      minutes: String(Math.floor(diffTime / 60) % 60).padStart(2, '0'),
      hours: String(Math.floor(diffTime / 3600) % 24).padStart(2, '0'),
      days: String(Math.floor(diffTime / 86400)).padStart(2, '0'),
    };
    setSeconds(diff.seconds);
    setMinutes(diff.minutes);
    setHours(diff.hours);
    setDays(diff.days);
  }, [now, activeLotteryRound, firstRoundStartTime, roundDuration]);

  return (
    <div className={'page-spacing'}>
      <Modal className={'!max-w-lg'} title={'Claimable Fee List'} open={open} closeModal={closeModal}>
        {balancesToClaim.length ? (
          balancesToClaim.map((b) => <ClaimRow key={b.tokenAddress} obj={b} />)
        ) : (
          <p className={'flex justify-between rounded-xl  items-center m-3 bg-primary-light px-4 py-3'}>
            Nothing to claim
          </p>
        )}
      </Modal>
      <Sidenav></Sidenav>
      <main className={'main-spacing'}>
        <>
          <header className={'border-b pb-4 mb-16'}>
            <h2>Rewads</h2>
          </header>

          <main>
            <section className={'mb-20'}>
              <header
                className={
                  'text-black items-center mb-8 px-6 py-2 bg-white inline-flex gap-4 inline-block rounded-lg shadow-header'
                }
              >
                <FontAwesomeIcon style={{ fontSize: 24 }} icon={faCircleDollarToSlot}></FontAwesomeIcon>
                <p className={'text-22 mt-0.5'}>Earned Fees</p>
              </header>
              <main className={'flex flex-col lg:flex-row justify-between gap-4 lg:gap-2'}>
                <div
                  className={
                    'dibs-claim-card bg-cf relative bg-cover px-8 pt-6 pb-4 w-full h-52 sm:w-96 sm:h-[256px] rounded-2xl'
                  }
                >
                  <label className={'text-22 mb-2 block relative font-light'}>
                    Claimable fees {/*<button*/}
                    {/*  onClick={() => setOpen(true)}*/}
                    {/*  className={'btn-small btn-link absolute -right-2 -top-0.5'}*/}
                    {/*>{`Claim separately ->`}</button>*/}
                  </label>
                  {balancesToClaim.length ? (
                    balancesToClaim.map((b) => <AccBalance key={b.tokenAddress} obj={b} />)
                  ) : (
                    <NoBalance />
                  )}
                  <footer className={' absolute right-8 bottom-7 pt-1 text-right'}>
                    {balancesToClaim.length ? (
                      <button className={'btn-medium btn-primary'} onClick={() => setOpen(true)}>
                        Claim
                      </button>
                    ) : null}
                  </footer>
                </div>

                <div
                  className={'bg-tf relative bg-cover pl-8 pr-4 pt-6 pb-4 w-full h-52 sm:w-96 sm:h-[256px] rounded-2xl'}
                >
                  <label className={'text-22 mb-2 inline-block font-light'}>Total fees claimed</label>
                  {claimedBalances.length ? (
                    claimedBalances.map((b) => <AccBalance key={b.tokenAddress} obj={b} />)
                  ) : (
                    <NoBalance />
                  )}
                  <footer className={'absolute right-4 bottom-6 pt-1 text-right'}>
                    <button className={'btn-medium text-lg btn-link'}>{`Claim History ->`}</button>
                  </footer>
                </div>
              </main>
            </section>

            <section>
              <header
                className={
                  'text-black items-center mb-6 px-6 py-2 bg-white inline-flex gap-4 inline-block rounded-lg shadow-header'
                }
              >
                <FontAwesomeIcon style={{ fontSize: 24 }} icon={faTicket}></FontAwesomeIcon>
                <p className={'text-22 mt-0.5'}>Lottery Tickets</p>
              </header>
              <main>
                <p className={'mb-2 pl-1'}>[A brief explaination about how this works and what you should do ]</p>
                <div className={'lottery-card  px-12 py-8'}>
                  <section
                    className={
                      'flex justify-between items-center lg:items-baseline gap-8 lg:gap-0 flex-col-reverse lg:flex-row'
                    }
                  >
                    <div className={''}>
                      <h4 className={'mb-6'}>
                        You have {userLotteryTickets?.length || 0} tickets for this week&apos;s lottery
                      </h4>
                      {userLotteryStatus !== LotteryStatus.UNKNOWN && (
                        <div>
                          <p className={'text-sm font-normal text-dark-gray-2'}>Last week result</p>
                          <p className={'text-lg'}>
                            {wonLottery ? 'Congrats! You won the prize' : `Unfortunately, You didn't win the prize`}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <div
                        className={'px-4 py-4 bg-white rounded-xl shadow-lottery-inner-card'}
                        style={{ width: 233.83 }}
                      >
                        <p className={'mb-2'}>Next draw in</p>
                        <p className={'font-normal text-4xl'}>{`${days}:${hours}:${minutes}:${seconds}`}</p>
                      </div>
                    </div>
                  </section>

                  <section className={'flex justify-center lg:justify-between items-end '}>
                    <div>
                      <img src={'/lottery-img.png'} className={'w-44 relative right-4 hidden lg:block'} alt="lottery" />
                      {prePrize && (
                        <div className={'inline-flex gap-2 mt-4 items-center px-3 py-2 bg-primary-light rounded-lg '}>
                          <FontAwesomeIcon style={{ fontSize: 20 }} icon={faGift}></FontAwesomeIcon>
                          <p className={'font-normal'}>
                            It seems you didn’t claim <button>your previous prize (2 Items)</button>
                          </p>
                        </div>
                      )}
                    </div>

                    <div className={'pt-6'}>
                      <div className={'px-4 py-4 bg-white rounded-xl shadow-lottery-inner-card'}>
                        {!wonLottery ? (
                          <div className={'flex flex-col py-0.5 gap-3 items-center'}>
                            <img src={'/sad-robo.png'} className={'w-22 '} alt="lottery lost" />
                            <p className={'font-normal text-gray px-0.5'}>There is nothing to claim</p>
                          </div>
                        ) : (
                          <div className={'flex flex-col gap-4 items-center py-2'}>
                            <img src={'/prize-token.png'} className={'w-20 '} alt="lottery prize" />
                            <h4 className={'font-semibold px-7'}>3203.20 USDC</h4>
                            <button className={'btn-medium btn-primary'}>Claim Your Prize</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </main>
            </section>
          </main>
        </>
      </main>
    </div>
  );
};

export default Rewards; /* Rectangle 18 */
