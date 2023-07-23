import React from 'react';
import { Link } from 'react-router-dom';
import { Address, useAccount } from 'wagmi';

import { usePairRewarderWrite, usePreparePairRewarderClaimLeaderBoardReward } from '../../abis/types/generated';
import { usePairRewarder } from '../../hooks/dibs/usePairRewarder';
import { usePairRewarderRewards, useWonPairRewarders } from '../../hooks/dibs/usePairRewarderRewards';
import RoutePath from '../../routes';
import { PairRewarderLeaderBoardRewardItem } from '../../types';
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

export const PairRewarderRewards = ({ pairRewarderAddress }: { pairRewarderAddress: Address }) => {
  const { rewards } = usePairRewarderRewards(pairRewarderAddress);
  const { pairName } = usePairRewarder(pairRewarderAddress);
  if (rewards === null) {
    return <div>Loading...</div>;
  }
  return (
    <div className="bg-white shadow-primary-xl rounded-lg">
      <div className={'p-4'}>
        {pairName}
        <Link to={RoutePath.PAIR_REWARDER.replace(':address', pairRewarderAddress)} className={'btn-link btn-large'}>
          view leaderboard -&gt;
        </Link>
      </div>
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
          {rewards.map((rewardItem) => (
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
    </div>
  );
};

export const WonPairRewardersRewards = () => {
  const { wonPairRewarders } = useWonPairRewarders();
  if (wonPairRewarders === null) {
    return <div>Loading...</div>;
  }
  if (wonPairRewarders.length === 0) {
    return <div>No rewards yet</div>;
  }
  return (
    <>
      {wonPairRewarders.map((pairRewarderAddress) => (
        <PairRewarderRewards key={pairRewarderAddress} pairRewarderAddress={pairRewarderAddress} />
      ))}
    </>
  );
};
