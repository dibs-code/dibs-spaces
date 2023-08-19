import { usePairRewarderWrite, usePreparePairRewarderClaimLeaderBoardReward } from 'abis/types/generated';
import { RewardAmounts } from 'components/rewards/RewardAmounts';
import usePairName from 'hooks/dibs/usePairName';
import { useUserVolumeForDayAndPair } from 'hooks/dibs/usePairRewarderLeaderboard';
import React from 'react';
import { useLocation } from 'react-router-dom';
import RoutePath from 'routes';
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

export const PairRewarderRewardItemComponent = ({
  pairRewarderAddress,
  rewardItem,
  pairName,
  pair,
  account,
}: {
  rewardItem: PairRewarderRewardItem;
  pairName: string | undefined;
  pairRewarderAddress: Address;
  pair: Address;
  account: Address | undefined;
}) => {
  const location = useLocation();

  const volume = useUserVolumeForDayAndPair(
    location.pathname.startsWith(RoutePath.REWARDS_TEST)
      ? {
          day: 21,
          pair: '0x46e26733aa90bd74fd6a56e1894c10b4457fa0d0',
          user: '0x6e40691a5ddc2cbc0f2f998ca686bdf6c777ee29',
        }
      : {
          day: Number(rewardItem.day),
          pair,
          user: account,
        },
  );
  return (
    <tr className="text-white text-left bg-gray2">
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
      <td>${volume ? volume.toNumber().toLocaleString() : '...'}</td>
      <td>{rewardItem.rank}</td>
      <td>
        <RewardAmounts rewardTokensAndAmounts={rewardItem.rewardTokensAndAmounts} showTotalUsd={!rewardItem.claimed} />
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
  );
};
export const PairRewarderRewards = ({
  pairRewarderAddress,
  allPairRewarderRewardsItem: { rewards, pair },
  account,
}: {
  pairRewarderAddress: Address;
  allPairRewarderRewardsItem: AllPairRewarderRewardsItem;
  account: Address | undefined;
}) => {
  const { pairName } = usePairName(pair);
  return (
    <>
      {rewards.map((rewardItem) => (
        <PairRewarderRewardItemComponent
          key={rewardItem.day.toString()}
          rewardItem={rewardItem}
          account={account}
          pair={pair}
          pairName={pairName}
          pairRewarderAddress={pairRewarderAddress}
        />
      ))}
    </>
  );
};
