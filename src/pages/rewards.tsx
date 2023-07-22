// import {faCopy} from "@fortawesome/pro-regular-svg-icons";
import Modal from 'components/modal';
import Sidenav from 'components/navigation/sidenav';
import React, { useState } from 'react';

import { PairRewarderRewards } from '../components/rewards/PairRewarderRewards';
import { ReferralRewardClaimRow } from '../components/rewards/ReferralRewardClaimRow';
import { useDibsData } from '../hooks/dibs/useDibsData';

const Rewards = () => {
  const { balancesToClaim } = useDibsData();

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
      <Sidenav></Sidenav>
      <main className={'main-spacing'}>
        <>
          <header className={'border-b pb-4 mb-16'}>
            <h2>Rewards</h2>
          </header>

          <main>
            {/*<ReferralRewards onClick={() => setOpen(true)} />*/}
            {/*<LotteryRewards />*/}
            <PairRewarderRewards />
          </main>
        </>
      </main>
    </div>
  );
};

export default Rewards; /* Rectangle 18 */
