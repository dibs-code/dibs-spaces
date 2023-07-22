import React from 'react';

import { PairRewarderEpochWinners } from '../../types';
import getPairIsolatedRewardTokensAndAmounts from '../../utils/getPairIsolatedRewardTokensAndAmounts';
import RewardToken from '../RewardToken';

export default function PairRewarderLeaderBoard({ epochWinners }: { epochWinners: PairRewarderEpochWinners }) {
  return (
    <table className="w-full text-center bg-white shadow-primary-xl rounded-lg">
      <thead className="bg-primary text-white">
        <tr>
          <th className="p-4">Rank</th>
          <th className="p-4">Codename</th>
          <th className="p-4">Reward</th>
        </tr>
      </thead>
      <tbody>
        {epochWinners?.winners.map((winner, i) => (
          <tr key={winner} className="border-t border-gray">
            <td className="p-4">{i + 1}</td>
            <td className="p-4">{epochWinners?.winnerCodeNames[i] || winner}</td>
            <td className="p-4">
              {getPairIsolatedRewardTokensAndAmounts(epochWinners?.info, i).map((obj) => (
                <RewardToken key={obj.token} rewardTokenAddress={obj.token} rewardTokenAmount={obj.amount} />
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
