import RewardToken from 'components/RewardToken';
import React from 'react';
import { PairRewarderEpochWinners } from 'types';
import getPairIsolatedRewardTokensAndAmounts from 'utils/getPairIsolatedRewardTokensAndAmounts';

export default function PairRewarderLeaderBoard({ epochWinners }: { epochWinners: PairRewarderEpochWinners }) {
  return (
    <table className="w-full text-center border-separate border-spacing-y-3 rounded">
      <thead className="text-white">
        <tr>
          <th className="py-2 text-left pl-8">Rank</th>
          <th className="py-2 text-left">Code</th>
          <th className="py-2 text-left">Volume</th>
          <th className="py-2 text-right pr-8">Potential reward</th>
        </tr>
      </thead>
      <tbody>
        {epochWinners?.winners.map((winner, i) => (
          <tr key={winner} className="text-white text-left bg-gray2">
            <td className="pl-8 rounded-l">
              <span>#{i + 1}</span>
            </td>
            <td className="">Sina ($540)</td>
            <td className="">{epochWinners?.winnerCodeNames[i] || winner}</td>
            <td className="py-4 pr-8 rounded-r text-right">
              <span className="flex justify-end gap-1">
                2000 DEUS + 200 USDC ≈{' '}
                {getPairIsolatedRewardTokensAndAmounts(epochWinners?.info, i).map((obj) => (
                  <RewardToken key={obj.token} rewardTokenAddress={obj.token} rewardTokenAmount={obj.amount} />
                ))}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
