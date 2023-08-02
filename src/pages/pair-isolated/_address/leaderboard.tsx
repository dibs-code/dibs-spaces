import { Address } from 'abitype';
import { LeaderBoardEpochButtons } from 'components/pairIsolated/LeaderBoardEpochButtons';
import PairRewarderLeaderBoard from 'components/pairIsolated/PairRewarderLeaderboard';
import TotalPrizes from 'components/pairIsolated/TotalPrizes';
import { usePairRewarder } from 'hooks/dibs/usePairRewarder';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import RoutePath from 'routes';

const PairRewarderLeaderboard = () => {
  const params = useParams();
  const pairRewarderAddress = params.address as Address;
  const {
    epochToShowWinners,
    setEpochToShowWinners,
    activeDay,
    pairName,
    epochTimer,
    activeLeaderBoardInfo,
    epochWinners,
    hasSetterRole,
  } = usePairRewarder(pairRewarderAddress);

  return (
    <div className="page">
      <main>
        <section className="px-8 py-7 rounded bg-primary mb-8 flex w-full justify-between">
          <div className="section--left pr-6">
            <h1 className="text-[32px] font-bold text-secondary mb-3 flex gap-3">
              <img src="/assets/images/pair-coin-icon.svg" alt="" />
              WBNB/USDC leaderboard
            </h1>
            <p className="text-xl">
              This is where you can view the leaderboard of all positions. <br />
              Rewards are distributed based on each participant&apos;s trading volume.
            </p>
          </div>
          <div className="section--right flex gap-4 items-center justify-end">
            <div className="px-6 py-4 bg-gray4 rounded-md w-[218px]">
              <p className="title mb-4 text-primary font-semibold text-2xl">Daily reward:</p>
              <p className="value text-white font-semibold text-2xl text-right">892.30 USDC</p>
            </div>
            <div className="px-6 py-4 bg-gray4 rounded-md w-[218px]">
              <p className="title mb-4 text-primary font-semibold text-2xl">Daily reward:</p>
              <p className="value text-white font-semibold text-2xl text-right">892.30 USDC</p>
            </div>
          </div>
        </section>
        <main>
          <section className={'px-2 rounded-2xl h-80 bg-cover mt-4 flex flex-col gap-3'}>
            <p>
              Epoch Timer: {epochTimer.hours}h {epochTimer.minutes}m | 24h Total Prizes:{' '}
              <TotalPrizes leaderBoardInfo={activeLeaderBoardInfo} />
              {hasSetterRole && (
                <p className={'mt-4'}>
                  <Link
                    to={RoutePath.PAIR_REWARDER_SET_PRIZE.replace(':address', pairRewarderAddress)}
                    className={`btn-primary btn-large font-medium w-full xl:w-auto px-8`}
                  >
                    Change Prizes
                  </Link>
                </p>
              )}
            </p>
            <LeaderBoardEpochButtons
              epochToShowWinners={epochToShowWinners}
              setEpochToShowWinners={setEpochToShowWinners}
              activeDay={activeDay}
            />
            <PairRewarderLeaderBoard epochWinners={epochWinners} />
          </section>
        </main>
      </main>
    </div>
  );
};

export default PairRewarderLeaderboard; /* Rectangle 18 */
