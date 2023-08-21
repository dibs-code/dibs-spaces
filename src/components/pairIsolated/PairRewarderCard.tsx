import { formatUnits } from '@ethersproject/units';
import { multicall } from '@wagmi/core';
import { erc20ABI } from 'abis/types/generated';
import { TotalRewardInUsd } from 'components/rewards/RewardAmounts';
import { useCreateLeaderBoardModalContext } from 'contexts/CreateLeaderBoardModalContext';
import { usePairRewarder } from 'hooks/dibs/usePairRewarder';
import useTestOrRealData from 'hooks/useTestOrRealData';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import RoutePath from 'routes';
import { Address } from 'wagmi';

export default function PairRewarderCard({ pairRewarderAddress }: { pairRewarderAddress: Address }) {
  const { pairName, activeLeaderBoardInfo, hasSetterRole } = usePairRewarder(pairRewarderAddress);

  const { setCreatedPairRewarderAddress, setLoadCurrentLeaderBoard, setCreateLeaderBoardModalOpen } =
    useCreateLeaderBoardModalContext();
  const [tokenDecimals, setTokenDecimals] = useState<number[] | null>(null);

  const rewardTokens = useMemo(
    () => (activeLeaderBoardInfo ? [...activeLeaderBoardInfo.rewardTokens] : null),
    [activeLeaderBoardInfo],
  );
  const rewardAmountsAggregate = useMemo(() => {
    if (!tokenDecimals || !activeLeaderBoardInfo) return null;
    return activeLeaderBoardInfo.rewardAmounts.map((rewardAmounts, i) =>
      rewardAmounts.reduce((a, c) => a + Number(formatUnits(c, tokenDecimals[i])), 0),
    );
  }, [activeLeaderBoardInfo, tokenDecimals]);

  const { chainId } = useTestOrRealData();
  useEffect(() => {
    if (!rewardTokens) return;
    multicall({
      allowFailure: false,
      contracts: rewardTokens.map((tokenAddress) => ({
        abi: erc20ABI,
        address: tokenAddress,
        functionName: 'decimals',
      })),
      chainId,
    }).then(setTokenDecimals);
  }, [chainId, rewardTokens]);

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
      <td>200$</td>
      <td>
        {rewardTokens && rewardAmountsAggregate ? (
          <TotalRewardInUsd rewardTokens={rewardTokens} rewardAmounts={rewardAmountsAggregate} />
        ) : (
          '-'
        )}
      </td>
      <td>-</td>
      <td>-</td>
      <td className="py-4 pr-8 rounded-r w-36">
        {/*TODO: fix styles if needed*/}
        <div className={'flex flex-row-reverse'}>
          <Link
            to={RoutePath.PAIR_REWARDER_LEADERBOARD.replace(':address', pairRewarderAddress)}
            className={'btn btn--secondary-outlined py-1.5'}
          >
            Leaderboard
          </Link>
          {hasSetterRole && (
            <div
              className={'btn btn--secondary-outlined mr-3 px-1 py-1 w-11'}
              onClick={() => {
                setCreatedPairRewarderAddress(pairRewarderAddress);
                setLoadCurrentLeaderBoard(true);
                setCreateLeaderBoardModalOpen(true);
              }}
            >
              <img src="/assets/images/pen.svg" alt="" />
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
