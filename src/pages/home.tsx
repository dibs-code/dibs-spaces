// import YourCode from 'components/dashboard/YourCode';
import React from 'react';

const Home = () => {
  const [state, setState] = React.useState(0);
  return (
    <div className="page">
      <main>
        <section className="px-8 py-7 rounded bg-primary mb-8 flex w-full justify-between">
          <div className="section--left pr-6 max-w-[840px]">
            <h1 className="text-[32px] font-bold text-secondary mb-3">Your Code</h1>
            <p className="text-xl">
              Share the code below with others and start earning. share with others to generate volume with your code
              and secure a spot on the leaderboard.
            </p>
          </div>
          <div className="section--right items-center justify-end">
            <img src="/assets/images/header/your-code-icon.svg" alt="" className="w-24 h-24 mr-5" />
          </div>
        </section>

        {state === 0 ? (
          <section
            onClick={() => setState((state + 1) % 3)}
            className="rounded bg-gray2 min-h-[210px] flex flex-col gap-[22px] justify-center items-center mb-8"
          >
            <p className="font-medium text-2xl text-white w-[420px] text-center">
              You have not create your dibs code yet, Create one and start earning!
            </p>
            <p className="font-medium text-white text-center">
              Your DiBs code can consist of both lowercase and uppercase letters, as well as numbers.
            </p>
          </section>
        ) : state === 1 ? (
          <section
            onClick={() => setState((state + 1) % 3)}
            className="rounded bg-gray2 min-h-[210px] flex flex-col gap-[22px] justify-center items-center mb-8"
          >
            <p className="font-medium text-2xl text-white">Your code:</p>
            <span className="flex gap-4 items-center">
              <p className="font-medium text-[32px] text-white">BEIGIZ</p>
              <img src="/assets/images/code/copy-clipboard.svg" alt="" />
            </span>
          </section>
        ) : (
          <section onClick={() => setState((state + 1) % 3)} className="flex gap-8 mb-8">
            <div className="card-yellow rounded flex flex-col gap-20 bg-gray2 py-7 px-9 flex-1">
              <p className="card-title text-white font-medium text-2xl">Your Code</p>
              <span className="flex gap-4 items-center ml-auto">
                <p className="font-medium text-[32px] text-white">BEIGIZ</p>
                <img src="/assets/images/code/copy-clipboard.svg" alt="" />
              </span>
            </div>
            <div className="card-red rounded flex flex-col gap-20 bg-gray2 py-7 px-9 flex-1">
              <p className="card-title text-white font-medium text-2xl">Volume Generated</p>
              <span className="flex gap-4 items-center ml-auto">
                <p className="font-medium text-[32px] text-white">$322,730</p>
                <img src="/assets/images/code/arrow-right.svg" alt="" />
              </span>
            </div>
          </section>
        )}
        {state === 0 && (
          <section className="flex justify-between mb-4">
            <div className="inputs flex gap-8 flex-1">
              <input
                className="flex-1 bg-gray2 placeholder-gray3 text-white rounded py-3.5 pl-4 pr-2 flex items-center"
                type="text"
                placeholder="Your code"
              />
              <input
                className="flex-1 bg-gray2 placeholder-gray3 text-white rounded py-3.5 pl-4 pr-2 flex items-center"
                type="text"
                placeholder="Your referral code"
              />
            </div>
            <div className="flex-1">
              <button className="btn btn--secondary font-bold py-[11px] px-11 ml-auto">Create</button>
            </div>
          </section>
        )}
        {/*<YourCode />*/}
      </main>
    </div>
  );
};

export default Home;
