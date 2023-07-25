import { Address } from 'abitype';
import Sidenav from 'components/navigation/sidenav';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { LeaderBoardEpochButtons } from '../../../components/pairIsolated/LeaderBoardEpochButtons';
import PairRewarderLeaderBoard from '../../../components/pairIsolated/PairRewarderLeaderboard';
import TotalPrizes from '../../../components/pairIsolated/TotalPrizes';
import { usePairRewarder } from '../../../hooks/dibs/usePairRewarder';
import RoutePath from '../../../routes';

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
    <div className={'page-spacing'}>
      <Sidenav></Sidenav>
      <main className={'main-spacing'}>
        <header className={'border-b pb-4 mb-16'}>
          <h2> Dibs pair isolated leaderboard {pairName}</h2>
        </header>

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
