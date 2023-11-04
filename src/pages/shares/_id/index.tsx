import {
  useBondingTokenAuthor,
  useBondingTokenName,
  useBondingTokenSpotPrice,
  useBondingTokenSymbol,
} from 'abis/types/generated';
import axios from 'axios';
import { BuyCard } from 'components/shares/BuyCard';
import { SellCard } from 'components/shares/SellCard';
import useBondingTokenDecimalsAndBalance from 'hooks/dibs/useBondingTokenDecimalsAndBalance';
import useDibsSharesChatSignature from 'hooks/dibs/useDibsSharesChatSignature';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatUnits } from 'viem';
import { Address, useAccount, useNetwork } from 'wagmi';

const Share = () => {
  const { address: tokenAddressParam } = useParams();
  if (!tokenAddressParam) throw Error('address not defined');
  const bondingTokenAddress = tokenAddressParam as Address;
  const { data: tokenName } = useBondingTokenName({
    address: bondingTokenAddress,
  });
  const { data: bondingTokenSymbol } = useBondingTokenSymbol({
    address: bondingTokenAddress,
  });
  const { data: spotPrice } = useBondingTokenSpotPrice({
    address: bondingTokenAddress,
  });
  const { data: author } = useBondingTokenAuthor({
    address: bondingTokenAddress,
  });
  const { address } = useAccount();
  const isAuthor = useMemo(() => {
    return Boolean(address && author && address === author);
  }, [address, author]);
  const { chain } = useNetwork();
  const spotPriceParsed = useMemo(
    () => (spotPrice !== undefined ? Number(formatUnits(spotPrice, 18)) : undefined),
    [spotPrice],
  );

  const [isChatInfoSet, setIsChatInfoSet] = useState<boolean | null>(null);

  useEffect(() => {
    async function getData() {
      setIsChatInfoSet(
        (
          await axios.get(
            process.env.REACT_APP_DIBS_SHARES_BACKEND_URL +
              '/api/isChatInfoSet/' +
              chain?.id +
              '/' +
              bondingTokenAddress,
          )
        ).data.result,
      );
    }

    getData();
  }, [bondingTokenAddress, chain?.id]);
  const { signDibsShareChatJoinRequest } = useDibsSharesChatSignature();
  const [chatInviteLink, setChatInviteLink] = useState<string | undefined>(undefined);

  const { bondingTokenBalanceParsed } = useBondingTokenDecimalsAndBalance(bondingTokenAddress, address);
  return (
    <div style={{ color: 'white' }} className="page">
      <section className="px-8 py-7 rounded bg-primary mb-8 flex w-full justify-between">
        <div className="section--left pr-6 max-w-[840px]">
          <h1 className="text-[32px] font-bold text-secondary mb-3">
            {tokenName} ({bondingTokenSymbol})
          </h1>
        </div>
        <div className="section--right items-center justify-end">
          <img src="/assets/images/header/your-code-icon.svg" alt="" className="w-24 h-24 mr-5" />
        </div>
      </section>
      <section className="border border-gray8 rounded p-8 pt-0 pb-6 m-6">
        <div className="m-4">Telegram Chat</div>
        {isChatInfoSet === null ? (
          <div>loading...</div>
        ) : isAuthor ? (
          <a
            className="btn-primary text-black py-2 px-8"
            target="_blank"
            href={`https://t.me/DibsSharesBot?start=s=${bondingTokenAddress}-c=${chain?.id}`}
            rel="noreferrer"
          >
            {isChatInfoSet ? 'Change' : 'Set'} Telegram Group
          </a>
        ) : isChatInfoSet ? (
          bondingTokenBalanceParsed === undefined ? (
            <div>loading...</div>
          ) : Number(bondingTokenBalanceParsed) < 1 ? (
            <div>You should have at least 1 {bondingTokenSymbol} to join the group</div>
          ) : chatInviteLink ? (
            <div className="py-3 font-bold">
              Your invite link:{' '}
              <a
                target="_blank"
                className="text-blue-500 hover:text-blue-800 underline"
                href={chatInviteLink}
                rel="noreferrer"
              >
                {chatInviteLink}
              </a>
            </div>
          ) : (
            <button
              className="btn-primary text-black py-2 px-8"
              onClick={() => {
                if (!chain) return;
                const timestamp = Math.floor(new Date().getTime() / 1000);
                signDibsShareChatJoinRequest(bondingTokenAddress, BigInt(chain.id), BigInt(timestamp))
                  .then((signature) => {
                    axios
                      .post<{
                        inviteLink: string;
                      }>(process.env.REACT_APP_DIBS_SHARES_BACKEND_URL + '/api/dibsSharesChatJoinRequest', {
                        dibsShareAddress: bondingTokenAddress,
                        chainId: chain.id,
                        signature,
                        timestamp,
                      })
                      .then((res) => {
                        setChatInviteLink(res.data.inviteLink);
                      })
                      .catch((e) => alert('Error: ' + String(e)));
                  })
                  .catch(console.log);
              }}
            >
              Join Telegram Group
            </button>
          )
        ) : (
          <div>This share does not have a Telegram group</div>
        )}
      </section>
      <section className="border border-gray8 rounded p-8 pt-0 pb-6 m-6">
        <div className="pt-4">Spot Price: {spotPriceParsed ? spotPriceParsed.toLocaleString() : '...'}</div>
        <div className="flex pt-4">
          <BuyCard bondingTokenAddress={bondingTokenAddress} />
          <SellCard bondingTokenAddress={bondingTokenAddress} />
        </div>
      </section>
    </div>
  );
};

export default Share;
