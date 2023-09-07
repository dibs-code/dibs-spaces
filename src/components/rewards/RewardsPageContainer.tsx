// import {faCopy} from "@fortawesome/pro-regular-svg-icons";
// import { faTicket } from '@fortawesome/pro-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { multicall } from '@wagmi/core';
import { pairRewarderABI } from 'abis/types/generated';
import TableViewSwitch from 'components/basic/TableViewSwitch';
import { PairRewarderRewards } from 'components/rewards/PairRewarderRewards';
import { PAIR_ISOLATED_LEADERBOARD_MAXIMUM_SPOT_COUNT } from 'constants/config';
import useGetDailyLeaderBoardForPairCallback from 'hooks/dibs/subgraph/useGetDailyLeaderBoardForPairCallback';
import usePairIsolatedUserTotalRecords from 'hooks/dibs/subgraph/usePairIsolatedUserTotalRecords';
import { usePairRewarderFactory } from 'hooks/dibs/usePairRewarderFactory';
import { useWonPairRewarders } from 'hooks/dibs/usePairRewarderRewards';
import useTestOrRealData from 'hooks/useTestOrRealData';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AllPairRewarderRewards, PairDayPotentialRewardRecord, PairRewardersOfPairs } from 'types/rewards';
import getPairIsolatedRewardTokensAndAmounts from 'utils/getPairIsolatedRewardTokensAndAmounts';
import { Address, useAccount } from 'wagmi';

const RewardsPageContainer = ({ testAddress }: { testAddress?: Address }) => {
  const { address } = useAccount();
  const account = useMemo(() => testAddress ?? address, [address, testAddress]);
  const { allPairRewarderRewards, claimedPairRewarderRewards, unClaimedPairRewarderRewards, pairsJoined } =
    useWonPairRewarders(account);
  const { userTotalVolume, userTotalRecords } = usePairIsolatedUserTotalRecords(
    testAddress ? '0x6e40691a5ddc2cbc0f2f998ca686bdf6c777ee29' : account,
  );
  const { pairRewarders: pairRewardersFromContract } = usePairRewarderFactory();
  const { isTestRewardsRoute, chainId } = useTestOrRealData();
  const pairRewarders: PairRewardersOfPairs | null = useMemo(
    () =>
      isTestRewardsRoute
        ? { '0x46e26733aa90bd74fd6a56e1894c10b4457fa0d0': ['0x21DAcb323a7a23E8B70BA96f2D472bbA92A94D9c'] }
        : pairRewardersFromContract,
    [isTestRewardsRoute, pairRewardersFromContract],
  );
  const [showActiveRewards, setShowActiveRewards] = useState(true);
  const toggleShowActiveRewards = useCallback(() => setShowActiveRewards((value) => !value), []);

  const allPairRewarderRewardsFiltered = useMemo(
    () => (showActiveRewards ? unClaimedPairRewarderRewards : claimedPairRewarderRewards),
    [claimedPairRewarderRewards, showActiveRewards, unClaimedPairRewarderRewards],
  );
  const getDailyLeaderBoardForPair = useGetDailyLeaderBoardForPairCallback();

  const [topReferrersToSet, setTopReferrersToSet] = useState<AllPairRewarderRewards | null>(null);
  useEffect(() => {
    async function getTopReferrersToSet() {
      if (!allPairRewarderRewards || !userTotalRecords || !account || !pairRewarders) return;
      const accountOnSubgraph = testAddress ? '0x6e40691a5ddc2cbc0f2f998ca686bdf6c777ee29' : account;
      const pairDaysWithRecord = userTotalRecords
        .filter((value, index, self) => index === self.findIndex((v) => v.day === value.day && v.pair === value.pair))
        .reduce((a, c) => {
          const pair = c.pair as Address;
          const day = c.day as string;
          if (!a[pair]) {
            a[pair] = [];
          }
          a[pair].push(day);
          return a;
        }, {} as { [pair: Address]: string[] });
      const pairDaysWithPotentialRewards: PairDayPotentialRewardRecord[] = [];
      await Promise.all(
        (Object.keys(pairDaysWithRecord) as Address[]).map(async (pair) => {
          const days = pairDaysWithRecord[pair];
          const leaderboards = await Promise.all(
            days.map((day) =>
              getDailyLeaderBoardForPair(
                pair,
                Number(day),
                PAIR_ISOLATED_LEADERBOARD_MAXIMUM_SPOT_COUNT + 1, // This +1 is for handling if dibsAddress is in leaderbaord records
              ),
            ),
          );
          days.forEach((day, i) => {
            const topReferrers = leaderboards[i]
              .slice(0, PAIR_ISOLATED_LEADERBOARD_MAXIMUM_SPOT_COUNT)
              .map((item) => item.user);
            const rankIndex = topReferrers.findIndex((user) => user === accountOnSubgraph.toLowerCase());
            if (rankIndex !== -1) {
              pairDaysWithPotentialRewards.push({ pair, day, rankIndex, topReferrers });
            }
          });
        }),
      );

      const pairRewarderDaysWithPotentialRewards: {
        [pairRewarderAddress: Address]: PairDayPotentialRewardRecord[];
      } = {};
      pairDaysWithPotentialRewards.forEach((item) => {
        const pairRewardersOfPair = pairRewarders[item.pair];
        pairRewardersOfPair.forEach((pairRewarderAddress) => {
          const pairRewardersHasWinnersSet =
            allPairRewarderRewards[pairRewarderAddress].rewards.findIndex(
              (reward) => Number(reward.day) === Number(item.day),
            ) !== -1;
          if (!pairRewardersHasWinnersSet) {
            if (!pairRewarderDaysWithPotentialRewards[pairRewarderAddress]) {
              pairRewarderDaysWithPotentialRewards[pairRewarderAddress] = [];
            }
            pairRewarderDaysWithPotentialRewards[pairRewarderAddress].push(item);
          }
        });
      });

      const pairRewarderAddressesToCheck = Object.keys(pairRewarderDaysWithPotentialRewards) as Address[];

      const activeLeaderBoards = await multicall({
        contracts: pairRewarderAddressesToCheck.map((pairRewarderAddress) => {
          return {
            abi: pairRewarderABI,
            address: pairRewarderAddress,
            functionName: 'leaderBoardInfo',
          };
        }),
        chainId,
      });

      const topReferrersToSetObject: AllPairRewarderRewards = {};
      pairRewarderAddressesToCheck.forEach((pairRewarderAddress, i) => {
        const activeLeaderBoard = activeLeaderBoards[i].result;
        if (activeLeaderBoard) {
          pairRewarderDaysWithPotentialRewards[pairRewarderAddress].forEach((item) => {
            if (item.rankIndex < Number(activeLeaderBoard.winnersCount)) {
              if (!topReferrersToSetObject[pairRewarderAddress]) {
                topReferrersToSetObject[pairRewarderAddress] = {
                  pair: item.pair,
                  rewards: [],
                };
              }
              topReferrersToSetObject[pairRewarderAddress].rewards.push({
                day: BigInt(item.day),
                rank: item.rankIndex + 1,
                claimed: false,
                topReferrersSet: false,
                rewardTokensAndAmounts: getPairIsolatedRewardTokensAndAmounts(activeLeaderBoard, item.rankIndex),
                topReferrers: item.topReferrers.slice(0, Number(activeLeaderBoard.winnersCount)),
              });
            }
          });
        }
      });
      setTopReferrersToSet(topReferrersToSetObject);
    }

    getTopReferrersToSet();
  }, [
    account,
    allPairRewarderRewards,
    chainId,
    getDailyLeaderBoardForPair,
    pairRewarders,
    testAddress,
    userTotalRecords,
  ]);

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
              <p className="font-medium text-[32px] text-white">...</p>
            </span>
          </div>
        </section>

        <section className="actions flex justify-start mb-4 h-[52px]">
          <TableViewSwitch
            optionOneSelected={showActiveRewards}
            selectOptionOne={toggleShowActiveRewards}
            selectOptionTwo={toggleShowActiveRewards}
            optionOneLabel={'Active'}
            optionTwoLabel={'History'}
          />
        </section>

        <section className="border border-gray8 rounded p-8 pt-0 pb-6">
          {allPairRewarderRewardsFiltered === null || topReferrersToSet === null ? (
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
                {showActiveRewards &&
                  (Object.keys(topReferrersToSet) as Address[]).map((pairRewarderAddress) => (
                    <PairRewarderRewards
                      key={pairRewarderAddress}
                      pairRewarderAddress={pairRewarderAddress}
                      allPairRewarderRewardsItem={topReferrersToSet[pairRewarderAddress]}
                    />
                  ))}
                {(Object.keys(allPairRewarderRewardsFiltered) as Address[]).map((pairRewarderAddress) => (
                  <PairRewarderRewards
                    key={pairRewarderAddress}
                    pairRewarderAddress={pairRewarderAddress}
                    allPairRewarderRewardsItem={allPairRewarderRewardsFiltered[pairRewarderAddress]}
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
