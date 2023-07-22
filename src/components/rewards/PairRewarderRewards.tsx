import { faTicket } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Address, useAccount } from 'wagmi';

import { usePairRewarderWrite, usePreparePairRewarderClaimLeaderBoardReward } from '../../abis/types/generated';
import { PairRewarderLeaderBoardRewardItem, usePairRewarderRewards } from '../../hooks/dibs/usePairRewarder';
import RewardToken from '../RewardToken';

const PairRewarderClaimButton = ({
  rewardItem,
  pairRewarderAddress,
}: {
  pairRewarderAddress: Address;
  rewardItem: PairRewarderLeaderBoardRewardItem;
}) => {
  const { address } = useAccount();

  const { config: claimRewardConfig } = usePreparePairRewarderClaimLeaderBoardReward({
    address: pairRewarderAddress,
    args: address && [rewardItem.day, address],
  });
  const { write: claim, isLoading: isLoadingClaim } = usePairRewarderWrite(claimRewardConfig);

  return (
    <button
      disabled={isLoadingClaim}
      className="btn-primary btn-large font-medium mt-4 w-full xl:w-auto px-8 border-2 mx-2 text-white bg-primary shadow-primary-xl hover:bg-primary-light"
      onClick={claim}
    >
      Claim
    </button>
  );
};

export const PairRewarderRewards = () => {
  const pairRewarderAddress = '0x6cB66a0762E7Ce3c0Abc9d0241bF4cfFc67fcdA1';
  const { rewards } = usePairRewarderRewards(pairRewarderAddress);

  return (
    <section>
      <header className="flex flex-row items-center text-black mb-6">
        <FontAwesomeIcon style={{ fontSize: 24 }} icon={faTicket} />
        <p className="text-22 ml-2 mt-0.5">Pair isolated leaderboard rewards</p>
      </header>
      <main className="bg-white shadow-primary-xl rounded-lg">
        <table className="w-full text-center">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-4">Day</th>
              <th className="p-4">Your Rank</th>
              <th className="p-4">Reward</th>
              <th className="p-4">Claim</th>
            </tr>
          </thead>
          <tbody>
            {rewards?.map((rewardItem) => (
              <tr key={rewardItem.day.toString()} className="border-t border-gray">
                <td className="p-4">{rewardItem.day.toString()}</td>
                <td className="p-4">{rewardItem.rank}</td>
                <td className="p-4">
                  {rewardItem.rewardTokensAndAmounts.map((obj) => (
                    <RewardToken key={obj.token} rewardTokenAddress={obj.token} rewardTokenAmount={obj.amount} />
                  ))}
                </td>
                <td className="p-4">
                  {rewardItem.claimed ? (
                    <button className="btn-primary btn-large font-medium mt-4 w-full xl:w-auto px-5 border-2 mx-2 text-white bg-gray shadow-primary-xl">
                      Claimed
                    </button>
                  ) : (
                    <PairRewarderClaimButton rewardItem={rewardItem} pairRewarderAddress={pairRewarderAddress} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </section>
  );
};
