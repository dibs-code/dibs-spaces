// import {faSackDollar ,faUsers} from "@fortawesome/pro-solid-svg-icons";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Sidenav from 'components/navigation/sidenav';
import React from 'react';

const Report = () => {
  return (
    <div className={'page-spacing'}>
      <Sidenav></Sidenav>
      <main className={'main-spacing'}>
        <header className={'border-b pb-4 mb-16'}>
          <h2>Reports</h2>
        </header>
        {/*<h1 className={'inline-block mt-40 bg-white font-light shadow-lottery-inner-card px-12 py-9 rounded-2xl'}>Coming Soon ...</h1>*/}
        <main className={'flex justify-between'}>
          <div className={'bg-g2 relative bg-cover px-8 pt-6 pb-4 w-96 h-52 rounded-2xl'}>
            <label className={'text-22 mb-2 block relative font-light'}>
              {/*<FontAwesomeIcon style={{ fontSize: 42 }} icon={faUsers}></FontAwesomeIcon>*/}
              <button className={'btn-medium btn-link absolute -right-2 -top-0.5'}>{`See by level ->`}</button>
            </label>

            <footer className={' absolute left-8 bottom-4 pt-1 text-left'}>
              <p className={'font-semibold text-4xl mb-2'}>137</p>
              <p className={'font-normal pl-1'}>People used your code to trade</p>
            </footer>
          </div>

          <div className={'bg-g3 relative bg-cover pl-8 pr-4 pt-6 pb-4 w-96 h-52 rounded-2xl'}>
            <label className={'text-22 mb-2 block relative font-light'}>
              {/*<FontAwesomeIcon style={{ fontSize: 44 }} icon={faSackDollar}></FontAwesomeIcon>*/}
              <button className={'btn-medium btn-link absolute -right-2 -top-0.5'}>{`See by level ->`}</button>
            </label>

            <footer className={' absolute left-8 bottom-4 pt-1 text-left'}>
              <p className={'font-semibold text-4xl mb-2'}>252,320$</p>
              <p className={'font-normal pl-1'}>Total volume traded through my code</p>
            </footer>
          </div>
        </main>
      </main>
    </div>
  );
};

export default Report; /* Rectangle 18 */
