// import {faCopy} from "@fortawesome/pro-regular-svg-icons";
import { faTicket } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'components/modal';
import Sidenav from 'components/navigation/sidenav';
import React, { useState } from 'react';
import { Address, useAccount } from 'wagmi';

import { usePairRewarderWrite, usePreparePairRewarderClaimLeaderBoardReward } from '../abis/types/generated';
import { ReferralRewardClaimRow } from '../components/rewards/ReferralRewardClaimRow';
import { useDibsData } from '../hooks/dibs/useDibsData';
import { PairRewarderLeaderBoardRewardItem, usePairRewarderRewards } from '../hooks/dibs/usePairRewarder';

const PairRewarderClaimButton = ({
  rewardItem,
  pairRewarderAddress,
}: {
  pairRewarderAddress: Address;
  rewardItem: PairRewarderLeaderBoardRewardItem;
}) => {
  const { address } = useAccount();
  const [pending, setPending] = useState(false);

  const { config: claimRewardConfig } = usePreparePairRewarderClaimLeaderBoardReward({
    address: pairRewarderAddress,
    args: address && [rewardItem.day, address],
  });
  const { write: claim, isLoading: isLoadingClaim } = usePairRewarderWrite(claimRewardConfig);

  return (
    <button
      disabled={isLoadingClaim}
      className={`btn-primary btn-large font-medium mt-4 w-full xl:w-auto px-8 border-2 mx-2`}
      onClick={claim}
    >
      Claim
    </button>
  );
};
const PairRewarderRewards = () => {
  const pairRewarderAddress = '0x6cB66a0762E7Ce3c0Abc9d0241bF4cfFc67fcdA1';
  const { rewards } = usePairRewarderRewards(pairRewarderAddress);

  return (
    <section>
      <header
        className={
          'text-black items-center mb-6 px-6 py-2 bg-white inline-flex gap-4 inline-block rounded-lg shadow-header'
        }
      >
        <FontAwesomeIcon style={{ fontSize: 24 }} icon={faTicket}></FontAwesomeIcon>
        <p className={'text-22 mt-0.5'}>Pair isolated leaderboard rewards</p>
      </header>
      <main>
        <table className={'w-full align-center text-center'}>
          <thead>
            <tr>
              <th>Day</th>
              <th>Claim</th>
            </tr>
          </thead>
          <tbody>
            {rewards?.map((rewardItem) => (
              <tr key={rewardItem.day.toString()}>
                <td>{rewardItem.day.toString()}</td>
                <td>
                  {rewardItem.claimed ? (
                    'Claimed'
                  ) : (
                    <PairRewarderClaimButton rewardItem={rewardItem} pairRewarderAddress={pairRewarderAddress} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
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
