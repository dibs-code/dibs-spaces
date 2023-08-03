import usePairRewarderCreate from 'hooks/dibs/usePairRewarderCreate';
import React from 'react';
import { Link } from 'react-router-dom';
import RoutePath from 'routes';

export default function PairRewarderCreate() {
  const {
    pairAddress,
    setPairAddress,
    pairName,
    setterAccount,
    setSetterAccount,
    handleCreatePairRewarder,
    createdPairRewarderAddress,
    buttonText,
  } = usePairRewarderCreate();

  return (
    <div className={'page-spacing'}>
      <main className={'main-spacing'}>
        <header className={'border-b pb-4 mb-16'}>
          <h2>Create Dibs pair isolated leaderboard</h2>
        </header>

        <main>
          <section className={'px-2 rounded-2xl h-80 bg-cover mt-4 flex flex-col gap-3'}>
            <p>
              <Link
                to={RoutePath.PAIR_ISOLATED}
                className={`btn-primary btn-large font-medium mt-4 w-full xl:w-auto px-8`}
              >
                Go Back
              </Link>
            </p>
            <form className="w-full max-w-lg px-8 py-4 mx-auto bg-white rounded-lg shadow-md mt-2">
              <div className="mb-4">
                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="tokenCount">
                  Pair
                </label>
                <input
                  className={`block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md`}
                  value={pairAddress}
                  onChange={(e) => setPairAddress(e.target.value)}
                />
                {pairName || 'Unknown Pair'}
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="tokenCount">
                  Address of the account that can set the reward tokens and amounts
                </label>
                <input
                  className={`block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md`}
                  value={setterAccount}
                  onChange={(e) => setSetterAccount(e.target.value)}
                />
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleCreatePairRewarder();
                }}
                className="w-full px-4 py-2 mt-4 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-700"
              >
                {buttonText}
              </button>
              {createdPairRewarderAddress && (
                <div className={'pt-2'}>Created PairRewarder address: {createdPairRewarderAddress}</div>
              )}
            </form>
          </section>
        </main>
      </main>
    </div>
  );
}
