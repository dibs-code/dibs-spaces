import CreateLeaderBoardModal from 'components/pairIsolated/CreateLeaderBoardModal';
import PairRewarderCard from 'components/pairIsolated/PairRewarderCard';
import { usePairRewarderFactory } from 'hooks/dibs/usePairRewarderFactory';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RoutePath from 'routes';

const PairIsolated = () => {
  const { allPairRewarders } = usePairRewarderFactory();
  const [createLeaderBoardModalOpen, setCreateLeaderBoardModalOpen] = useState(false);
  return (
    <div className="page">
      <CreateLeaderBoardModal
        open={createLeaderBoardModalOpen}
        closeModal={() => setCreateLeaderBoardModalOpen(false)}
      />
      <main>
        <section className="px-8 py-7 rounded bg-primary">
          <h1 className="text-[32px] font-bold text-secondary mb-3">Pair Isolated Leaderboards</h1>
          <p className="text-xl">
            Track each pair&apos;s trade volume, prize allocation, and winner rankings. Add your own prize and see the
            impact on your chosen pair. This is your go-to for a smarter, strategic trading journey.
          </p>
        </section>
        <section className={'px-2 rounded-2xl h-80 bg-cover mt-4 flex flex-col gap-3'}>
          <button onClick={() => setCreateLeaderBoardModalOpen(true)} className="btn-primary btn-large w-72">
            Create LeaderBoard (Modal)
          </button>
          <Link to={RoutePath.PAIR_REWARDER_CREATE} className="btn-primary btn-large w-72">
            Create LeaderBoard (Page)
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
    </div>
  );
};

export default PairIsolated; /* Rectangle 18 */
