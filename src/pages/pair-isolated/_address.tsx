import { Address } from 'abitype';
import Sidenav from 'components/navigation/sidenav';
import React from 'react';
import { useParams } from 'react-router-dom';

import RewardToken from '../../components/RewardToken';
import { usePairRewarder } from '../../hooks/dibs/usePairRewarder';

const PairIsolated = () => {
  const params = useParams();
  const { pairSymbol, epochInfo, leaderBoardInfo } = usePairRewarder(params.address as Address);
  return (
    <div className={'page-spacing'}>
      <Sidenav></Sidenav>
      <main className={'main-spacing'}>
        <header className={'border-b pb-4 mb-16'}>
          <h2> Dibs pair isolated leaderboard ({pairSymbol})</h2>
        </header>

        <main>
          <section
            className={
              'px-2 rounded-2xl md:bg-codeinfo h-80 bg-cover mt-4 flex flex-col gap-3 justify-center items-center'
            }
          >
            <p>
              Epoch Timer: {epochInfo.hours}h {epochInfo.minutes}m | 24h Total Prizes:{' '}
              {leaderBoardInfo?.rewardTokens.map((t, i) => (
                <RewardToken rewardTokenAddress={t} rewardTokenAmounts={leaderBoardInfo?.rewardAmounts[i]} key={t} />
              ))}
            </p>
          </section>
        </main>
      </main>
    </div>
  );
};

export default PairIsolated; /* Rectangle 18 */
