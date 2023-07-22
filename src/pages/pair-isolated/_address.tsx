import { Address } from 'abitype';
import Sidenav from 'components/navigation/sidenav';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { LeaderBoardEpochButtons } from '../../components/pairIsolated/LeaderBoardEpochButtons';
import PairRewarderLeaderBoard from '../../components/pairIsolated/PairRewarderLeaderboard';
import PairRewarderSetPrize from '../../components/pairIsolated/PairRewarderSetPrize';
import TotalPrizes from '../../components/pairIsolated/TotalPrizes';
import { usePairRewarder } from '../../hooks/dibs/usePairRewarder';

const PairRewarder = () => {
  const params = useParams();
  const {
    epochToShowWinners,
    setEpochToShowWinners,
    activeDay,
    pairName,
    epochTimer,
    activeLeaderBoardInfo,
    epochWinners,
    hasSetterRole,
  } = usePairRewarder(params.address as Address);

  const [changePrizesViewActive, setChangePrizesViewActive] = useState(false);
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
                <button
                  className={`btn-primary btn-large font-medium mt-4 w-full xl:w-auto px-8`}
                  onClick={() => setChangePrizesViewActive((value) => !value)}
                >
                  {changePrizesViewActive ? 'View Leaderboard' : 'Change Prizes'}
                </button>
              )}
            </p>
            {changePrizesViewActive ? (
              <PairRewarderSetPrize pairRewarderAddress={params.address as Address} />
            ) : (
              <>
                <LeaderBoardEpochButtons
                  epochToShowWinners={epochToShowWinners}
                  setEpochToShowWinners={setEpochToShowWinners}
                  activeDay={activeDay}
                />
                <PairRewarderLeaderBoard epochWinners={epochWinners} />
              </>
            )}
          </section>
        </main>
      </main>
    </div>
  );
};

export default PairRewarder; /* Rectangle 18 */
