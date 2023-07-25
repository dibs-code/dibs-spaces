import Sidenav from 'components/navigation/sidenav';
import PairRewarderCard from 'components/pairIsolated/PairRewarderCard';
import { usePairRewarderFactory } from 'hooks/dibs/usePairRewarderFactory';
import React from 'react';
import { Link } from 'react-router-dom';
import RoutePath from 'routes';

const PairIsolated = () => {
  const { allPairRewarders } = usePairRewarderFactory();
  return (
    <div className={'page-spacing'}>
      <Sidenav></Sidenav>
      <main className={'main-spacing'}>
        <header className={'border-b pb-4 mb-16'}>
          <h2> Dibs pair isolated leaderboards</h2>
        </header>

        <main>
          <section className={'px-2 rounded-2xl h-80 bg-cover mt-4 flex flex-col gap-3'}>
            <Link to={RoutePath.PAIR_REWARDER_CREATE} className="btn-primary btn-large w-72">
              Create LeaderBoard
            </Link>
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
          </section>
        </main>
      </main>
    </div>
  );
};

export default PairIsolated; /* Rectangle 18 */
