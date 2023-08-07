// import {faCopy} from "@fortawesome/pro-regular-svg-icons";
// import { faTicket } from '@fortawesome/pro-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WonPairRewardersRewards } from 'components/rewards/PairRewarderRewards';
import React from 'react';

const Rewards = () => {
  return (
    <div className={'page-spacing'}>
      <main className={'main-spacing'}>
        <>
          <header className={'border-b pb-4 mb-16'}>
            <h2>Rewards</h2>
          </header>

          <main>
            <section>
              <header className="flex flex-row items-center text-black mb-6">
                {/*<FontAwesomeIcon style={{ fontSize: 24 }} icon={faTicket} />*/}
                <p className="text-22 ml-2 mt-0.5">Pair isolated leaderboard rewards</p>
              </header>
              <WonPairRewardersRewards />
            </section>
          </main>
        </>
      </main>
    </div>
  );
};

export default Rewards; /* Rectangle 18 */
