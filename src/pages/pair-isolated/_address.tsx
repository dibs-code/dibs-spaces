import { Address } from 'abitype';
import Sidenav from 'components/navigation/sidenav';
import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import RewardToken from '../../components/RewardToken';
import { usePairRewarder } from '../../hooks/dibs/usePairRewarder';

const PairIsolated = () => {
  const params = useParams();
  const {
    epochToShowWinners,
    setEpochToShowWinners,
    activeDay,
    pairSymbol,
    epochInfo,
    activeLeaderBoardInfo,
    epochWinners,
  } = usePairRewarder(params.address as Address);

  const getRewardTokensAndAmounts = useCallback(
    (winnerRank: number) => {
      const tokensAndAmounts: { token: Address; amount: bigint }[] = [];
      if (!epochWinners) return tokensAndAmounts;
      for (let i = 0; i < epochWinners.info.rewardTokens.length; i++) {
        const amount = epochWinners.info.rewardAmounts[i][winnerRank];
        if (amount) {
          tokensAndAmounts.push({
            token: epochWinners.info.rewardTokens[i],
            amount,
          });
        }
      }
      return tokensAndAmounts;
    },
    [epochWinners],
  );

  const setPreviousEpochToShowWinners = useCallback(() => {
    if (activeDay) {
      setEpochToShowWinners(activeDay - BigInt(1));
    }
  }, [activeDay, setEpochToShowWinners]);

  return (
    <div className={'page-spacing'}>
      <Sidenav></Sidenav>
      <main className={'main-spacing'}>
        <header className={'border-b pb-4 mb-16'}>
          <h2> Dibs pair isolated leaderboard ({pairSymbol})</h2>
        </header>

        <main>
          <section className={'px-2 rounded-2xl h-80 bg-cover mt-4 flex flex-col gap-3'}>
            <p>
              Epoch Timer: {epochInfo.hours}h {epochInfo.minutes}m | 24h Total Prizes:{' '}
              {activeLeaderBoardInfo?.rewardTokens.map((t, i) => (
                <RewardToken
                  rewardTokenAddress={t}
                  rewardTokenAmount={activeLeaderBoardInfo?.rewardAmounts[i].reduce(
                    (sum, amount) => sum + amount,
                    BigInt(0),
                  )}
                  key={t}
                />
              ))}
            </p>
            <div className={'flex flex-wrap'}>
              <button
                className={`${
                  activeDay && epochToShowWinners === activeDay - BigInt(1) ? 'btn-primary' : 'btn-primary-inverted'
                } btn-large font-medium mt-4 w-full xl:w-auto px-8`}
                onClick={setPreviousEpochToShowWinners}
              >
                Previous Epoch
              </button>
              <button
                className={`${
                  epochToShowWinners === BigInt(10) ? 'btn-primary' : 'btn-primary-inverted'
                } btn-large font-medium mt-4 w-full xl:w-auto px-8 border-2 mx-2`}
                onClick={() => setEpochToShowWinners(BigInt(10))}
              >
                Day 10
              </button>
            </div>
            <table>
              <tr>
                <th>Rank</th>
                <th>Codename</th>
                <th>Reward</th>
              </tr>
              {epochWinners?.winners.map((winner, i) => (
                <tr key={winner}>
                  <td>{i + 1}</td>
                  <td>{epochWinners?.winnerCodeNames[i] || winner}</td>
                  <td>
                    {getRewardTokensAndAmounts(i).map((obj) => (
                      <RewardToken key={obj.token} rewardTokenAddress={obj.token} rewardTokenAmount={obj.amount} />
                    ))}
                  </td>
                </tr>
              ))}
            </table>
          </section>
        </main>
      </main>
    </div>
  );
};

export default PairIsolated; /* Rectangle 18 */
