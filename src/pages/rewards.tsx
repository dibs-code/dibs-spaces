// import {faCopy} from "@fortawesome/pro-regular-svg-icons";
// import { faTicket } from '@fortawesome/pro-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Address } from 'abitype';
import { WonPairRewardersRewards } from 'components/rewards/PairRewarderRewards';
import React from 'react';
import { useParams } from 'react-router-dom';

import { LeaderBoardEpochButtons } from '../components/pairIsolated/LeaderBoardEpochButtons';
import { usePairRewarderLeaderboard } from '../hooks/dibs/usePairRewarderLeaderboard';

const Rewards = () => {
  const params = useParams();

  const pairRewarderAddress =
    params.address === 'test'
      ? // '0x6cB66a0762E7Ce3c0Abc9d0241bF4cfFc67fcdA1' // has day 10 winners
        '0x21DAcb323a7a23E8B70BA96f2D472bbA92A94D9c' // has day 21 subgraph data
      : (params.address as Address);

  const { selectedEpoch, selectPreviousEpoch, selectCurrentEpoch, activeDay, setSelectedEpoch } =
    usePairRewarderLeaderboard(pairRewarderAddress);

  return (
    <div className="page">
      <main>
        <section className="px-8 py-7 rounded bg-primary mb-8 flex w-full justify-between">
          <div className="section--left pr-6 max-w-[840px]">
            <h1 className="text-[32px] font-bold text-secondary mb-3">Rewards</h1>
            <p className="text-xl">Monitor your progress and retrieve your earnings here.</p>
          </div>
          <div className="section--right items-center justify-end">
            <img src="/assets/images/header/reward-icon.svg" alt="" className="w-24 h-24 mr-5" />
          </div>
        </section>

        <section className="mb-8 flex w-full gap-6">
          <div className="card-green rounded flex flex-col gap-20 bg-gray2 py-7 px-9 flex-1">
            <p className="card-title text-white font-medium text-2xl">Pairs Joined</p>
            <span className="flex gap-4 items-center ml-auto">
              <p className="font-medium text-[32px] text-white">12</p>
            </span>
          </div>
          <div className="card-red rounded flex flex-col gap-20 bg-gray2 py-7 px-9 flex-1">
            <p className="card-title text-white font-medium text-2xl">Volume Generated</p>
            <span className="flex gap-4 items-center ml-auto">
              <p className="font-medium text-[32px] text-white">$322,730</p>
            </span>
          </div>
          <div className="card-yellow rounded flex flex-col gap-20 bg-gray2 py-7 px-9 flex-1">
            <p className="card-title text-white font-medium text-2xl">Rewards Earned</p>
            <span className="flex gap-4 items-center ml-auto">
              <p className="font-medium text-[32px] text-white">$730</p>
            </span>
          </div>
        </section>

        <section className="actions flex justify-start mb-4 h-[52px]">
          <LeaderBoardEpochButtons
            selectedEpoch={selectedEpoch}
            selectPreviousEpoch={selectPreviousEpoch}
            selectCurrentEpoch={selectCurrentEpoch}
            activeDay={activeDay}
            setSelectedEpoch={setSelectedEpoch}
          />
        </section>

        <section className="border border-primary rounded p-8 pt-0 pb-6">
          {/*<header className="flex flex-row items-center text-black mb-6">*/}
          {/*  /!*<FontAwesomeIcon style={{ fontSize: 24 }} icon={faTicket} />*!/*/}
          {/*  /!*<p className="text-22 ml-2 mt-0.5">Pair isolated leaderboard rewards</p>*!/*/}
          {/*</header>*/}
          <WonPairRewardersRewards />
        </section>
      </main>
    </div>
  );
};

export default Rewards; /* Rectangle 18 */
