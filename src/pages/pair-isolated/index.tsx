import CreateLeaderBoardModal from 'components/pairIsolated/CreateLeaderBoardModal';
import PairRewarderCard from 'components/pairIsolated/PairRewarderCard';
import { usePairRewarderFactory } from 'hooks/dibs/usePairRewarderFactory';
import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import RoutePath from 'routes';

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
        <section className="px-8 py-7 rounded bg-primary mb-8">
          <h1 className="text-[32px] font-bold text-secondary mb-3">Pair Isolated Leaderboards</h1>
          <p className="text-xl">
            Track each pair&apos;s trade volume, prize allocation, and winner rankings. Add your own prize and see the
            impact on your chosen pair. This is your go-to for a smarter, strategic trading journey.
          </p>
        </section>
        <section className="actions flex justify-between mb-4">
          <div className="search rounded bg-gray2 py-3.5 pl-4 pr-2 flex items-center gap-5">
            <img src="/assets/images/pair-isolated/search-icon.svg" alt="" />
            <input
              className="bg-transparent placeholder-gray3 text-white"
              type="text"
              placeholder="Search amoung pairs ..."
            />
          </div>
          <button onClick={() => setCreateLeaderBoardModalOpen(true)} className="btn btn--secondary btn--with-icon">
            <img src="/assets/images/pair-isolated/create-leaderboard-icon.svg" alt="" />
            <p className="mt-1">Create Leaderboard</p>
          </button>
        </section>
        <section className="border border-primary rounded p-8 pt-0 pb-6">
          {/*<button onClick={() => setCreateLeaderBoardModalOpen(true)} className="btn-primary btn-large w-72">*/}
          {/*  Create LeaderBoard (Modal)*/}
          {/*</button>*/}
          {/*<Link to={RoutePath.PAIR_REWARDER_CREATE} className="btn-primary btn-large w-72">*/}
          {/*  Create LeaderBoard (Page)*/}
          {/*</Link>*/}
          <table className="w-full text-center border-separate border-spacing-y-3 rounded">
            <thead className="text-white">
              <tr>
                <th className="py-2 text-left pl-8">Pair</th>
                <th className="py-2 text-left">Total Volume</th>
                <th className="py-2 text-left">Total Prize</th>
                <th className="py-2 text-left">#1 Winner</th>
                <th className="py-2 text-left">Your position</th>
                <th className="py-2 text-left"></th>
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
