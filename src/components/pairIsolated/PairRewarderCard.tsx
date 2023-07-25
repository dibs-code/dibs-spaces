import React from 'react';
import { Link } from 'react-router-dom';
import { Address } from 'wagmi';

import { usePairRewarder } from '../../hooks/dibs/usePairRewarder';
import RoutePath from '../../routes';
import TotalPrizes from './TotalPrizes';

export default function PairRewarderCard({ pairRewarderAddress }: { pairRewarderAddress: Address }) {
  const { pairName, activeLeaderBoardInfo } = usePairRewarder(pairRewarderAddress);
  return (
    <tr className="border-t border-gray">
      <td className={'w-full'}>{pairName}</td>
      <td>$232,195</td>
      <td>
        <TotalPrizes leaderBoardInfo={activeLeaderBoardInfo} />
      </td>
      <td>-</td>
      <td>-</td>
      <td className={'p-4'}>
        <Link
          to={RoutePath.PAIR_REWARDER_LEADERBOARD.replace(':address', pairRewarderAddress)}
          className={'btn-primary btn-large'}
        >
          Leaderboard
        </Link>
      </td>
    </tr>
  );
}
