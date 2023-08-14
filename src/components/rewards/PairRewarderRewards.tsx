import { usePairRewarderWrite, usePreparePairRewarderClaimLeaderBoardReward } from 'abis/types/generated';
import RewardToken from 'components/RewardToken';
import { usePairRewarder } from 'hooks/dibs/usePairRewarder';
import { usePairRewarderRewards, useWonPairRewarders } from 'hooks/dibs/usePairRewarderRewards';
import React from 'react';
// import { Link } from 'react-router-dom';
// import RoutePath from 'routes';
import { PairRewarderLeaderBoardRewardItem } from 'types';
import { Address, useAccount } from 'wagmi';

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
    <button disabled={isLoadingClaim} className="btn btn--secondary-outlined" onClick={claim}>
      Claim
    </button>
  );
};

export const PairRewarderRewards = ({ pairRewarderAddress }: { pairRewarderAddress: Address }) => {
  const { rewards } = usePairRewarderRewards(pairRewarderAddress);
  const { pairName } = usePairRewarder(pairRewarderAddress);
  if (rewards === null) {
    return null;
  }
  return (
    <>
      {/*<div className={'p-4'}>*/}
      {/*  {pairName}*/}
      {/*  <Link*/}
      {/*    to={RoutePath.PAIR_REWARDER_LEADERBOARD.replace(':address', pairRewarderAddress)}*/}
      {/*    className={'btn-link btn-large'}*/}
      {/*  >*/}
      {/*    view leaderboard -&gt;*/}
      {/*  </Link>*/}
      {/*</div>*/}
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
              <td>2000 DEUS + 300 BUSD ≈ $32,195</td>
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
        </tbody>
      </table>
    </>
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
