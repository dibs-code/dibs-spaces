import TokenAddressInput from 'components/basic/input/TokenAddressInput';
import usePairRewarderSetPrize from 'hooks/dibs/usePairRewarderSetPrize';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import RoutePath from 'routes';
import { Address } from 'viem';

export default function PairRewarderSetPrize() {
  const params = useParams();
  const pairRewarderAddress = params.address as Address;
  const {
    setLeaderBoardSpotsCount,
    setRewardTokenCount,
    pairName,
    leaderBoardSpotsCount,
    rewardTokenCount,
    rewardTokenAddresses,
    allTokenAmounts,
    handleTokenAmountChange,
    handlePairRewarderSetPrize,
    handleTokenAddressChange,
    pending,
    loadingCurrentRewards,
    pairAddressFromContract,
    activeLeaderBoardInfo,
  } = usePairRewarderSetPrize(pairRewarderAddress);

  return (
    <div className={'page-spacing'}>
      <main className={'main-spacing'}>
        <header className={'border-b pb-4 mb-16'}>
          <h2> Dibs pair isolated leaderboard {pairName}</h2>
        </header>

        <main>
          <section className={'px-2 rounded-2xl h-80 bg-cover mt-4 flex flex-col gap-3'}>
            <p>
              <Link
                to={RoutePath.PAIR_REWARDER_LEADERBOARD.replace(':address', pairRewarderAddress)}
                className={`btn-primary btn-large font-medium mt-4 w-full xl:w-auto px-8`}
              >
                View Leaderboard
              </Link>
            </p>
            {loadingCurrentRewards ? (
              <div>Loading...</div>
            ) : (
              <form className="w-full max-w-lg px-8 py-4 mx-auto bg-white rounded-lg shadow-md mt-2">
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="tokenCount">
                    Pair
                  </label>
                  <input
                    className={`block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md text-gray cursor-not-allowed`}
                    disabled={true}
                    value={pairAddressFromContract}
                  />
                  {pairName || 'Unknown Pair'}
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="tokenCount">
                    Number of LeaderBoard Spots (1-16)
                  </label>
                  <input
                    type="number"
                    className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                    value={leaderBoardSpotsCount}
                    onChange={(e) => setLeaderBoardSpotsCount(Math.max(Math.min(Number(e.target.value), 16), 1))}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="tokenCount">
                    Number of Reward Tokens (1-4)
                  </label>
                  <input
                    type="number"
                    className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                    value={rewardTokenCount}
                    onChange={(e) => setRewardTokenCount(Math.max(Math.min(Number(e.target.value), 4), 1))}
                  />
                </div>

                {rewardTokenAddresses.slice(0, rewardTokenCount).map((tokenAddress, i) => (
                  <div className="border-t-2 py-2" key={i}>
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="tokenCount">
                      Reward Token {i + 1}
                    </label>
                    <TokenAddressInput
                      type="text"
                      className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                      value={tokenAddress}
                      placeholder={`Token Address`}
                      onChange={(event) => handleTokenAddressChange(i, event.target.value)}
                    />
                    <div className="flex py-2 flex-wrap">
                      {allTokenAmounts[i].slice(0, leaderBoardSpotsCount).map((rewardAmount, j) => (
                        <div className={'w-1/2 px-2'} key={j}>
                          Rank {j + 1} Reward Amount
                          <input
                            type="number"
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                            value={rewardAmount}
                            onChange={(event) => handleTokenAmountChange(i, j, Number(event.target.value))}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handlePairRewarderSetPrize();
                  }}
                  disabled={pending}
                  className="w-full px-4 py-2 mt-4 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-700"
                >
                  {pending
                    ? 'Sending Transaction...'
                    : activeLeaderBoardInfo && activeLeaderBoardInfo?.winnersCount !== BigInt(0)
                    ? 'Update Rewards'
                    : 'Set Rewards'}
                </button>
              </form>
            )}
          </section>
        </main>
      </main>
    </div>
  );
}
