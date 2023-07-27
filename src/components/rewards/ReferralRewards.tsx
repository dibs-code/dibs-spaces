import { useDibsReferralRewardsData } from 'hooks/dibs/useDibsReferralRewardsData';
import React from 'react';

import { AccBalance, NoBalance } from './AccBalance';

export function ReferralRewards(props: { onClick: () => void }) {
  const { balancesToClaim, claimedBalances } = useDibsReferralRewardsData();

  return (
    <section className={'mb-20'}>
      <header
        className={
          'text-black items-center mb-8 px-6 py-2 bg-white inline-flex gap-4 inline-block rounded-lg shadow-header'
        }
      >
        {/*<FontAwesomeIcon style={{ fontSize: 24 }} icon={faCircleDollarToSlot}></FontAwesomeIcon>*/}
        <p className={'text-22 mt-0.5'}>Earned Fees</p>
      </header>
      <main className={'flex flex-col lg:flex-row justify-between gap-4 lg:gap-2'}>
        <div
          className={
            'dibs-claim-card bg-cf relative bg-cover px-8 pt-6 pb-4 w-full h-52 sm:w-96 sm:h-[256px] rounded-2xl'
          }
        >
          <label className={'text-22 mb-2 block relative font-light'}>
            Claimable fees {/*<button*/}
            {/*  onClick={() => setOpen(true)}*/}
            {/*  className={'btn-small btn-link absolute -right-2 -top-0.5'}*/}
            {/*>{`Claim separately ->`}</button>*/}
          </label>
          {balancesToClaim.length ? (
            balancesToClaim.map((b) => <AccBalance key={b.tokenAddress} obj={b} />)
          ) : (
            <NoBalance />
          )}
          <footer className={' absolute right-8 bottom-7 pt-1 text-right'}>
            {balancesToClaim.length ? (
              <button className={'btn-medium btn-primary'} onClick={props.onClick}>
                Claim
              </button>
            ) : null}
          </footer>
        </div>

        <div className={'bg-tf relative bg-cover pl-8 pr-4 pt-6 pb-4 w-full h-52 sm:w-96 sm:h-[256px] rounded-2xl'}>
          <label className={'text-22 mb-2 inline-block font-light'}>Total fees claimed</label>
          {claimedBalances?.length ? (
            claimedBalances.map((b) => <AccBalance key={b.tokenAddress} obj={b} />)
          ) : (
            <NoBalance />
          )}
          <footer className={'absolute right-4 bottom-6 pt-1 text-right'}>
            <button className={'btn-medium text-lg btn-link'}>{`Claim History ->`}</button>
          </footer>
        </div>
      </main>
    </section>
  );
}
