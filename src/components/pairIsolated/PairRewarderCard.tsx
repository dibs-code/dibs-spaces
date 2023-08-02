import { usePairRewarder } from 'hooks/dibs/usePairRewarder';
import React from 'react';
import { Link } from 'react-router-dom';
import RoutePath from 'routes';
import { Address } from 'wagmi';

import TotalPrizes from './TotalPrizes';

export default function PairRewarderCard({ pairRewarderAddress }: { pairRewarderAddress: Address }) {
  const { pairName, activeLeaderBoardInfo } = usePairRewarder(pairRewarderAddress);
  return (
    <tr className="text-white text-left rounded bg-gray2 overflow-hidden">
      <td className="pl-8 rounded-l flex flex-col justify-center py-5">
        <span className="flex gap-3">
          <img src="/assets/images/pair-coin-icon.svg" alt="" />
          <span>
            <p>{pairName}</p>
            <p className="text-secondary text-sm">Volatile</p>
          </span>
        </span>
      </td>
      <td>$232,195</td>
      <td>
        <TotalPrizes leaderBoardInfo={activeLeaderBoardInfo} />
      </td>
      <td>-</td>
      <td>-</td>
      <td className="py-4 pr-8 rounded-r w-36">
        <Link
          to={RoutePath.PAIR_REWARDER_LEADERBOARD.replace(':address', pairRewarderAddress)}
          className={'btn btn--secondary-outlined py-1.5'}
        >
          Leaderboard
        </Link>
      </td>
    </tr>
  );
}
