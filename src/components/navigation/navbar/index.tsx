// import { faCircleC, faGift, faRightLeft } from '@fortawesome/pro-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Transition } from '@headlessui/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { disconnect } from '@wagmi/core';
import { isSupportedChain } from 'constants/chains';
import React, { Fragment, PropsWithChildren, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RoutePath, { requiresCode } from 'routes';
import { shortenAddress } from 'utils/index';
import { useAccount, useNetwork } from 'wagmi';

import { ConnectWalletButton } from '../../ConnectWalletButton';

// import { Dialog, Transition } from '@headlessui/react';

export interface ModalPropsInterface extends React.HTMLAttributes<HTMLElement> {
  open?: boolean;

  // closeModal(): void;
}

export type ModalProps = PropsWithChildren<ModalPropsInterface>;

const Navbar = () => {
  const { openConnectModal } = useConnectModal();

  const [show, setShow] = React.useState(false);

  const { address: account } = useAccount();
  const renderConnectorMobile = () => {
    return (
      <div className="flex-1 flex justify-end">
        {account ? (
          <>
            <button className={'btn__secondary--outlined btn-medium text-center'} onClick={() => {}}>
              {shortenAddress(account)}
            </button>
            {/*<h4 className={'font-semibold mb-2 flex-1 text-primary text-center'}>{shortenAddress(account)}</h4>*/}
            {/*<p className={'text-center'}>*/}
            {/*  <span*/}
            {/*    className={`h-9 rounded-md inline-flex items-center px-4 bg-input ${*/}
            {/*      hasCode ? 'text-base font-medium' : 'text-sm font-regular'*/}
            {/*    }`}*/}
            {/*  >*/}
            {/*    {addressToName ?? 'No code exist'}*/}
            {/*  </span>*/}
            {/*</p>*/}
          </>
        ) : (
          <>
            <button
              className={'btn__secondary btn-medium text-center'}
              data-testid={'connect-wallet-button-mobile'}
              onClick={openConnectModal}
            >
              Connect Wallet
            </button>
            {/*<div className={'flex justify-end flex-1'}>*/}
            {/*  <button className={'btn-primary-inverted btn-medium text-center'} onClick={openConnectModal}>*/}
            {/*    Connect Wallet*/}
            {/*  </button>*/}
            {/*</div>*/}
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <nav className="w-full py-8 px-[88px] bg-transparent hidden md:flex justify-between">
        <div className="flex-1">
          <img src="/assets/images/navbar/logo.svg" alt="" />
        </div>
        <Menu />
        <div className="flex-1 flex justify-end">
          <ConnectWalletButton />
        </div>
        {/*{account && (*/}
        {/*  <div className={'flex justify-center flex-1'} onClick={openConnectModal}>*/}
        {/*    <button className={'btn-primary-inverted btn-medium text-center'} onClick={() => disconnect()}>*/}
        {/*      Disconnect Wallet*/}
        {/*    </button>*/}
        {/*  </div>*/}
        {/*)}*/}
      </nav>

      <nav className={'dibs-mobile-nav z-100 block md:hidden fixed w-full text-right right-0 top-0 px-7 py-4 mb-4'}>
        {/*<div onClick={() => {setShow(!show)}} className={'inline-block cursor-pointer'}><FontAwesomeIcon style={{ fontSize: 32, }} icon={faBars}></FontAwesomeIcon></div>*/}
        <div
          onClick={() => {
            setShow(!show);
          }}
          className={'inline-block z-100 cursor-pointer'}
        >
          <input className="checkbox" type="checkbox" name="" id="" />
          <div className="hamburger-lines">
            <span className="line line1"></span>
            <span className="line line2"></span>
            <span className="line line3"></span>
          </div>
        </div>

        <Transition
          as={Fragment}
          show={show}
          enter="transform ease-in-out transition duration-[400ms]"
          enterFrom="opacity-0  translate-x-32"
          enterTo="opacity-100 translate-x-0"
          leave="transform duration-500 transition ease-in-out"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 translate-x-32"
        >
          <div className={'w-full inset-0 h-screen overflow-y-auto bg-white absolute py-20 px-4'}>
            {renderConnectorMobile()}
            <Menu />
            {account && (
              <div className={'flex justify-center'}>
                <button className={'btn-primary-inverted btn-medium text-center'} onClick={() => disconnect()}>
                  Disconnect Wallet
                </button>
              </div>
            )}
          </div>
        </Transition>
      </nav>
    </>
  );
};
type RouteObject = { name: string; icon: string | null; address: RoutePath };
const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { address: account } = useAccount();
  const { chain } = useNetwork();
  const links = useMemo(() => {
    const linksList: RouteObject[] = [
      { name: 'Your code', icon: null, address: RoutePath.YOUR_CODE },
      { name: 'Rewards', icon: null, address: RoutePath.REWARDS },
      {
        name: 'Pair Isolated',
        icon: null,
        address: RoutePath.PAIR_ISOLATED,
      },
    ];
    return [
      {
        name: 'Shares',
        icon: null,
        address: RoutePath.SHARES,
      },
      ...linksList,
    ];
  }, []);

  const [selectedNavbarItemElement, setSelectedNavbarItemElement] = React.useState<HTMLElement | null>(null);

  useEffect(() => {
    if (location.pathname) {
      setSelectedNavbarItemElement(
        document.getElementById('navbar-item-' + links.findIndex((link) => location.pathname.startsWith(link.address))),
      );
    }
  }, [location.pathname, links]);

  return (
    <div className="relative flex items-center">
      <ul className="flex gap-9 mx-auto items-center">
        {links.map((link, index) => {
          const disabled = (!account || !isSupportedChain(chain?.id)) && requiresCode(link.address);
          return (
            <li
              onClick={() => {
                if (!disabled) {
                  navigate(link.address);
                }
              }}
              className={`flex items-center transition duration-200 text-primary
                ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
               ${link.name === 'Reports' ? 'pl-0.5 gap-4' : 'pl-0 gap-3'}`}
              id={'navbar-item-' + index}
              key={link.name}
            >
              <span className="font-medium text-xl">{link.name}</span>
            </li>
          );
        })}
      </ul>
      <span
        className="bg-primary h-[3px] absolute rounded-full transition-all duration-200 bottom-1"
        style={{
          left: selectedNavbarItemElement?.offsetLeft + 'px',
          width: selectedNavbarItemElement?.offsetWidth + 'px',
        }}
      ></span>
    </div>
  );
};

export default Navbar;
