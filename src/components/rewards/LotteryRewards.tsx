import { faGift, faTicket } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useMemo, useState } from 'react';

import { LotteryStatus, useDibsLotteryData } from '../../hooks/dibs/useDibsLotteryData';

export function LotteryRewards() {
  const { userLotteryStatus } = useDibsLotteryData();

  const wonLottery = useMemo(() => userLotteryStatus === LotteryStatus.WON, [userLotteryStatus]);

  const prePrize = false;

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
              <div className={'px-4 py-4 bg-white rounded-xl shadow-lottery-inner-card'} style={{ width: 233.83 }}>
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
  );
}
