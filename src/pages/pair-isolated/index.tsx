import Sidenav from 'components/navigation/sidenav';
import React, { useState } from 'react';

import PairRewarderCard from '../../components/pairIsolated/PairRewarderCard';
import { usePairRewarderFactory } from '../../hooks/dibs/usePairRewarderFactory';
import PairRewarderSetPrize from './_address/setPrize';

const PairIsolated = () => {
  const { allPairRewarders } = usePairRewarderFactory();
  const [showCreateLeaderBoardForm, setShowCreateLeaderBoardForm] = useState(false);
  return (
    <div className={'page-spacing'}>
      <Sidenav></Sidenav>
      <main className={'main-spacing'}>
        <header className={'border-b pb-4 mb-16'}>
          <h2> Dibs pair isolated leaderboards</h2>
        </header>

        <main>
          <section className={'px-2 rounded-2xl h-80 bg-cover mt-4 flex flex-col gap-3'}>
            <button
              className="btn-primary btn-large w-72"
              onClick={() => setShowCreateLeaderBoardForm((value) => !value)}
            >
              {showCreateLeaderBoardForm ? 'Go Back' : 'Create LeaderBoard'}
            </button>
            {showCreateLeaderBoardForm ? (
              <PairRewarderSetPrize />
            ) : (
              <table className="w-full text-center bg-white shadow-primary-xl rounded-lg">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="p-4">Pair</th>
                    <th className="p-4">Total Volume</th>
                    <th className="p-4">Total Prize</th>
                    <th className="p-4">#1 Winner</th>
                    <th className="p-4">Your position</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {allPairRewarders?.map((item) => (
                    <PairRewarderCard key={item} pairRewarderAddress={item} />
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </main>
      </main>
    </div>
  );
};

export default PairIsolated; /* Rectangle 18 */
