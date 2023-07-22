import React from 'react';
import { Link } from 'react-router-dom';
import { Address } from 'wagmi';

import { usePairRewarder } from '../../hooks/dibs/usePairRewarder';
import RoutePath from '../../routes';
import TotalPrizes from './TotalPrizes';

export default function PairRewarderCard({ pairRewarderAddress }: { pairRewarderAddress: Address }) {
  const { pairName, activeLeaderBoardInfo } = usePairRewarder(pairRewarderAddress);
  return (
    <tr>
      <td>{pairName}</td>
      <td>$232,195</td>
      <td>
        <TotalPrizes leaderBoardInfo={activeLeaderBoardInfo} />
      </td>
      <td>-</td>
      <td>-</td>
      <td>
        <Link to={RoutePath.PAIR_REWARDER.replace(':address', pairRewarderAddress)} className={'btn-primary btn-large'}>
          Leaderboard
        </Link>
      </td>
    </tr>
  );
}
