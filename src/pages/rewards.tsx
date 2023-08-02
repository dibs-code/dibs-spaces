// import {faCopy} from "@fortawesome/pro-regular-svg-icons";
// import { faTicket } from '@fortawesome/pro-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'components/modal';
import { WonPairRewardersRewards } from 'components/rewards/PairRewarderRewards';
import { ReferralRewardClaimRow } from 'components/rewards/ReferralRewardClaimRow';
import { useDibsReferralRewardsData } from 'hooks/dibs/useDibsReferralRewardsData';
import React, { useState } from 'react';

const Rewards = () => {
  const { balancesToClaim } = useDibsReferralRewardsData();

  // Mock variable for type of reward (nft / token)
  // const [isNFT, setIsNFT] = useState(false);

  const [open, setOpen] = useState(false);

  function closeModal() {
    setOpen(false);
  }

  return (
    <div className={'page-spacing'}>
      <Modal className={'!max-w-lg'} title={'Claimable Fee List'} open={open} closeModal={closeModal}>
        {balancesToClaim.length ? (
          balancesToClaim.map((b) => <ReferralRewardClaimRow key={b.tokenAddress} obj={b} />)
        ) : (
          <p className={'flex justify-between rounded-xl  items-center m-3 bg-primary-light px-4 py-3'}>
            Nothing to claim
          </p>
        )}
      </Modal>
      <main className={'main-spacing'}>
        <>
          <header className={'border-b pb-4 mb-16'}>
            <h2>Rewards</h2>
          </header>

          <main>
            {/*<ReferralRewards onClick={() => setOpen(true)} />*/}
            {/*<LotteryRewards />*/}

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
