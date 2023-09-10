import PairRewarderCard from 'components/pairIsolated/PairRewarderCard';
import { useCreateLeaderBoardModalContext } from 'contexts/CreateLeaderBoardModalContext';
import { usePairRewarderFactory } from 'hooks/dibs/usePairRewarderFactory';
import React, { useMemo, useState } from 'react';
import { IS_DEV_OR_CYPRESS } from 'utils/env';
// import { Link } from 'react-router-dom';
// import RoutePath from 'routes';
import { Address, useAccount } from 'wagmi';

const PairIsolated = () => {
  const { myPairRewarders, pairRewarders, pairFilterString, setPairFilterString } = usePairRewarderFactory();
  const { setCreateLeaderBoardModalOpen } = useCreateLeaderBoardModalContext();
  const [showMyPairRewarders, setShowMyPairRewarders] = useState(false);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowMyPairRewarders(event.target.checked);
  };

  const pairRewardersToShow = useMemo(
    () => (showMyPairRewarders ? myPairRewarders : pairRewarders),
    [myPairRewarders, pairRewarders, showMyPairRewarders],
  );

  const { address } = useAccount();

  return (
    <div className="page">
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
              placeholder="Search among pairs ..."
              value={pairFilterString}
              onChange={(e) => setPairFilterString(e.target.value)}
            />
          </div>
          <button onClick={() => setCreateLeaderBoardModalOpen(true)} className="btn btn--secondary btn--with-icon">
            <img src="/assets/images/pair-isolated/create-leaderboard-icon.svg" alt="" />
            <p className="mt-1">Create Leaderboard</p>
          </button>
        </section>
        <section className="border border-gray8 rounded p-8 pt-0 pb-6">
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
                <th className="py-2 text-left">
                  {IS_DEV_OR_CYPRESS && address && (
                    <label data-testid="show-my-leaderboards-switch">
                      <input type="checkbox" checked={showMyPairRewarders} onChange={handleCheckboxChange} />
                      My LeaderBoards
                    </label>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {pairRewardersToShow &&
                Object.keys(pairRewardersToShow).map((pairAddress) =>
                  pairRewardersToShow[pairAddress as Address].map((pairRewarderAddress) => (
                    <PairRewarderCard
                      key={pairRewarderAddress}
                      pairAddress={pairAddress as Address}
                      pairRewarderAddress={pairRewarderAddress}
                    />
                  )),
                )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default PairIsolated; /* Rectangle 18 */
