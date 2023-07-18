// import {faCopy} from "@fortawesome/pro-regular-svg-icons";
import { faTicket } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'components/modal';
import Sidenav from 'components/navigation/sidenav';
import { LotteryRewards } from 'components/rewards/LotteryRewards';
import React, { useState } from 'react';

import { ReferralRewardClaimRow } from '../components/rewards/ReferralRewardClaimRow';
import { ReferralRewards } from '../components/rewards/ReferralRewards';
import { useDibsData } from '../hooks/dibs/useDibsData';
import { usePairRewarderRewards } from '../hooks/dibs/usePairRewarder';

const PairRewarderRewards = () => {
  const { rewards } = usePairRewarderRewards('0x6cB66a0762E7Ce3c0Abc9d0241bF4cfFc67fcdA1');

  return (
    <section>
      <header
        className={
          'text-black items-center mb-6 px-6 py-2 bg-white inline-flex gap-4 inline-block rounded-lg shadow-header'
        }
      >
        <FontAwesomeIcon style={{ fontSize: 24 }} icon={faTicket}></FontAwesomeIcon>
        <p className={'text-22 mt-0.5'}>Pair isolated leaderboard rewards</p>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Claim</th>
            </tr>
          </thead>
          <tbody>
            {rewards?.map((r) => (
              <tr key={r.day.toString()}>
                <td>{r.day.toString()}</td>
                <td>{String(r.claimed)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </section>
  );
};

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
            <ReferralRewards onClick={() => setOpen(true)} />
            <LotteryRewards />
            <PairRewarderRewards />
          </main>
        </>
      </main>
    </div>
  );
};

export default Rewards; /* Rectangle 18 */
