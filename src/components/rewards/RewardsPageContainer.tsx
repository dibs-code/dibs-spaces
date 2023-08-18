// import {faCopy} from "@fortawesome/pro-regular-svg-icons";
// import { faTicket } from '@fortawesome/pro-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LeaderBoardEpochButtons } from 'components/pairIsolated/LeaderBoardEpochButtons';
import { PairRewarderRewards } from 'components/rewards/PairRewarderRewards';
import useDibsUserTotalVolume from 'hooks/dibs/useDibsUserTotalVolume';
import { usePairRewarderLeaderboard } from 'hooks/dibs/usePairRewarderLeaderboard';
import { useWonPairRewarders } from 'hooks/dibs/usePairRewarderRewards';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Address, useAccount } from 'wagmi';

const RewardsPageContainer = ({ testAddress }: { testAddress?: Address }) => {
  const params = useParams();

  const pairRewarderAddress =
    params.address === 'test'
      ? // '0x6cB66a0762E7Ce3c0Abc9d0241bF4cfFc67fcdA1' // has day 10 winners
        '0x21DAcb323a7a23E8B70BA96f2D472bbA92A94D9c' // has day 21 subgraph data
      : (params.address as Address);

  const { selectedEpoch, selectPreviousEpoch, selectCurrentEpoch, activeDay, setSelectedEpoch } =
    usePairRewarderLeaderboard(pairRewarderAddress);
  const { address } = useAccount();

  const { allPairRewarderRewards, pairsJoined } = useWonPairRewarders(testAddress ?? address);
  const { userTotalVolume } = useDibsUserTotalVolume(testAddress ?? address);
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
              <p className="font-medium text-[32px] text-white">{pairsJoined ?? '...'}</p>
            </span>
          </div>
          <div className="card-red rounded flex flex-col gap-20 bg-gray2 py-7 px-9 flex-1">
            <p className="card-title text-white font-medium text-2xl">Volume Generated</p>
            <span className="flex gap-4 items-center ml-auto">
              <p className="font-medium text-[32px] text-white">
                ${userTotalVolume?.toNumber().toLocaleString() ?? '...'}
              </p>
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

        <section className="border border-gray8 rounded p-8 pt-0 pb-6">
          {allPairRewarderRewards === null ? (
            <div>Loading...</div>
          ) : (
            <table className="w-full text-center border-separate border-spacing-y-3 rounded">
              <thead className="text-white">
                <tr>
                  <th className="py-2 text-left pl-8">Pair Joined</th>
                  <th className="py-2 text-left">Your Volume</th>
                  <th className="py-2 text-left">Your Position</th>
                  <th className="py-2 text-left">Your Reward</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(allPairRewarderRewards).map((pairRewarderAddress) => (
                  <PairRewarderRewards
                    key={pairRewarderAddress}
                    pairRewarderAddress={pairRewarderAddress as Address}
                    allPairRewarderRewardsItem={allPairRewarderRewards[pairRewarderAddress as Address]}
                  />
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

export default RewardsPageContainer; /* Rectangle 18 */
