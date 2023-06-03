import YourCode from 'components/dashboard/YourCode';
import Sidenav from 'components/navigation/sidenav';
import React from 'react';

const Home = () => {
  return (
    <div className={'page-spacing'}>
      <Sidenav></Sidenav>
      <main className={'main-spacing'}>
        <YourCode></YourCode>
      </main>
    </div>
  );
};

export default Home; /* Rectangle 18 */
