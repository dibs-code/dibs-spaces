import { usePairRewarderWrite, usePreparePairRewarderClaimLeaderBoardReward } from 'abis/types/generated';
import { RewardAmounts } from 'components/rewards/RewardAmounts';
import RewardToken from 'components/RewardToken';
import usePairName from 'hooks/dibs/usePairName';
import React from 'react';
// import { Link } from 'react-router-dom';
// import RoutePath from 'routes';
import { AllPairRewarderRewardsItem, PairRewarderRewardItem } from 'types';
import { Address, useAccount } from 'wagmi';

const PairRewarderClaimButton = ({
  rewardItem,
  pairRewarderAddress,
}: {
  pairRewarderAddress: Address;
  rewardItem: PairRewarderRewardItem;
}) => {
  const { address } = useAccount();

  const { config: claimRewardConfig } = usePreparePairRewarderClaimLeaderBoardReward({
    address: pairRewarderAddress,
    args: address && [rewardItem.day, address],
  });
  const { write: claim, isLoading: isLoadingClaim } = usePairRewarderWrite(claimRewardConfig);

  return (
    <button disabled={isLoadingClaim} className="btn btn--secondary-outlined" onClick={claim}>
      Claim
    </button>
  );
};

export const PairRewarderRewards = ({
  pairRewarderAddress,
  allPairRewarderRewardsItem: { rewards, pair },
}: {
  pairRewarderAddress: Address;
  allPairRewarderRewardsItem: AllPairRewarderRewardsItem;
}) => {
  const { pairName } = usePairName(pair);
  if (rewards === null) {
    return null;
  }
  return (
    <>
      {rewards.map((rewardItem) => (
        <tr key={rewardItem.day.toString()} className="text-white text-left bg-gray2">
          <td className="pl-8 rounded-l py-5">
            <span className="flex flex-col justify-center ">
              <span className="flex gap-3">
                <img src="/assets/images/pair-coin-icon.svg" alt="" />
                <span>
                  <p>{pairName}</p>
                  <p className="text-secondary text-sm">Volatile</p>
                </span>
              </span>
            </span>
          </td>
          <td>
            {rewardItem.rewardTokensAndAmounts.map((obj) => (
              <RewardToken key={obj.token} rewardTokenAddress={obj.token} rewardTokenAmount={obj.amount} />
            ))}
          </td>
          <td>{rewardItem.rank}</td>
          <td>
            <RewardAmounts
              rewardTokensAndAmounts={rewardItem.rewardTokensAndAmounts}
              showTotalUsd={!rewardItem.claimed}
            />
          </td>
          <td className="py-4 pr-8 rounded-r w-36">
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
    </>
  );
};
