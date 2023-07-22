import Sidenav from 'components/navigation/sidenav';
import React from 'react';

import PairRewarderCard from '../../components/pairIsolated/PairRewarderCard';
import { usePairRewarderFactory } from '../../hooks/dibs/usePairRewarderFactory';

const PairIsolated = () => {
  const { allPairRewarders } = usePairRewarderFactory();
  return (
    <div className={'page-spacing'}>
      <Sidenav></Sidenav>
      <main className={'main-spacing'}>
        <header className={'border-b pb-4 mb-16'}>
          <h2> Dibs pair isolated leaderboard</h2>
        </header>

        <main>
          <section className={'px-2 rounded-2xl h-80 bg-cover mt-4 flex flex-col gap-3'}>
            <table>
              <thead>
                <tr>
                  <th>Pair</th>
                  <th>Total Volume</th>
                  <th>Total Prize</th>
                  <th>#1 Winner</th>
                  <th>Your position</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {allPairRewarders?.map((item) => (
                  <PairRewarderCard key={item} pairRewarderAddress={item} />
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </main>
    </div>
  );
};

export default PairIsolated; /* Rectangle 18 */
