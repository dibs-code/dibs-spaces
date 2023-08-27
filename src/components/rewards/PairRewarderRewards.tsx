import { prepareWriteContract, writeContract } from '@wagmi/core';
import {
  muonInterfaceABI,
  useDibsProjectId,
  usePairRewarderWrite,
  usePreparePairRewarderClaimLeaderBoardReward,
} from 'abis/types/generated';
import axios from 'axios';
import { RewardAmounts } from 'components/rewards/RewardAmounts';
import { DibsAddressMap } from 'constants/addresses';
import { useUserVolumeForDayAndPair } from 'hooks/dibs/subgraph/useUserVolumeForDayAndPair';
import { useDibsAddresses } from 'hooks/dibs/useDibsAddresses';
import usePairName from 'hooks/dibs/usePairName';
import { useContractAddress } from 'hooks/useContractAddress';
import useTestOrRealData from 'hooks/useTestOrRealData';
import React, { useCallback, useMemo, useState } from 'react';
import { MuonVerificationTopLeaderBoardNMethodData } from 'types/muon';
// import { Link } from 'react-router-dom';
// import RoutePath from 'routes';
import { AllPairRewarderRewardsItem, PairRewarderRewardItem } from 'types/rewards';
import { Address, useAccount, useNetwork } from 'wagmi';
import { arbitrum } from 'wagmi/chains';

const PairRewarderClaimButton = ({
  rewardItem,
  pairRewarderAddress,
}: {
  pairRewarderAddress: Address;
  rewardItem: PairRewarderRewardItem;
}) => {
  const { address } = useAccount();

  const { config: claimRewardConfig } = usePreparePairRewarderClaimLeaderBoardReward({
    address: pairRewarderAddress,
    args: address && [rewardItem.day, address],
  });
  const { write: claim, isLoading: isLoadingClaim } = usePairRewarderWrite(claimRewardConfig);

  return (
    <button disabled={isLoadingClaim} className="btn btn--secondary-outlined mx-auto" onClick={claim}>
      Claim
    </button>
  );
};
const PairRewarderSetTopReferrersButton = ({
  rewardItem,
  pairRewarderAddress,
  pairAddress,
}: {
  pairRewarderAddress: Address;
  rewardItem: PairRewarderRewardItem;
  pairAddress: Address;
}) => {
  const dibsAddress = useContractAddress(DibsAddressMap);
  const { muonInterfaceAddress: muonInterfaceAddressFromContract } = useDibsAddresses();
  const { chain } = useNetwork();
  const { isTestRoute } = useTestOrRealData();
  const chainId = useMemo(() => (isTestRoute ? arbitrum.id : chain?.id), [chain?.id, isTestRoute]);
  const { data: projectId } = useDibsProjectId({
    address: isTestRoute ? '0x21dd036CFAB09243eeffCFC24C47b3baA860f9b7' : dibsAddress,
    chainId,
  });
  const [loading, setLoading] = useState(false);
  const setTopReferrers = useCallback(async () => {
    const topReferrers = rewardItem.topReferrers;
    const muonInterfaceAddress = isTestRoute
      ? '0xe00d3b7f25baf1b35f6a2e783560d9fd840e5563'
      : muonInterfaceAddressFromContract;
    if (loading || !topReferrers || !projectId || !muonInterfaceAddress) return;
    setLoading(true);
    try {
      const axiosInstance = axios.create({
        // baseURL: process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_MUON_API_URL,
        baseURL: 'https://dibs-shield.muon.net/',
      });
      const muonVerificationData = (
        await axiosInstance.get<MuonVerificationTopLeaderBoardNMethodData>(
          `/v1/?app=dibsGlobal&method=topLeaderBoardN&params[projectId]=${projectId}&params[n]=${topReferrers.length}&params[day]=${rewardItem.day}&params[pair]=${pairAddress}`,
        )
      ).data;
      console.log({
        muonVerificationData,
        contractCallArgs: [
          pairRewarderAddress,
          Number(rewardItem.day),
          muonVerificationData.result.data.result.topLeaderBoardN as Address[],
          BigInt(muonVerificationData.result.data.timestamp),
          muonVerificationData.result.reqId,
          {
            signature: BigInt(muonVerificationData.result.signatures[0].signature),
            owner: muonVerificationData.result.signatures[0].owner,
            nonce: muonVerificationData.result.data.init.nonceAddress,
          },
          muonVerificationData.result.shieldSignature,
        ],
      });
      const { request } = await prepareWriteContract({
        address: muonInterfaceAddress,
        abi: muonInterfaceABI,
        functionName: 'setPairRewarderTopReferrers',
        args: [
          pairRewarderAddress,
          Number(rewardItem.day),
          muonVerificationData.result.data.result.topLeaderBoardN as Address[],
          BigInt(muonVerificationData.result.data.timestamp),
          muonVerificationData.result.reqId,
          {
            signature: BigInt(muonVerificationData.result.signatures[0].signature),
            owner: muonVerificationData.result.signatures[0].owner,
            nonce: muonVerificationData.result.data.init.nonceAddress,
          },
          muonVerificationData.result.shieldSignature,
        ],
      });
      await writeContract(request);
    } catch (e) {
      console.log('claim failed');
      console.log(e);
    }
    setLoading(false);
  }, [rewardItem, loading, projectId, muonInterfaceAddressFromContract, pairAddress, isTestRoute, pairRewarderAddress]);
  return (
    <button className="btn btn--secondary-outlined mx-auto" disabled={loading} onClick={setTopReferrers}>
      Set Winners
    </button>
  );
};

export const PairRewarderRewardItemComponent = ({
  pairRewarderAddress,
  rewardItem,
  pairName,
  pair,
}: {
  rewardItem: PairRewarderRewardItem;
  pairName: string | undefined;
  pairRewarderAddress: Address;
  pair: Address;
}) => {
  const { isTestRewardsRoute } = useTestOrRealData();

  const { address } = useAccount();
  const volume = useUserVolumeForDayAndPair(
    isTestRewardsRoute
      ? {
          day: 21,
          pair: '0x46e26733aa90bd74fd6a56e1894c10b4457fa0d0',
          user: '0x6e40691a5ddc2cbc0f2f998ca686bdf6c777ee29',
        }
      : {
          day: Number(rewardItem.day),
          pair,
          user: address,
        },
  );
  return (
    <tr className="text-white text-left bg-gray2">
      <td className="pl-8 rounded-l py-5">
        <span className="flex flex-col justify-center ">
          <span className="flex gap-3">
            <img src="/assets/images/pair-coin-icon.svg" alt="" />
            <span>
              <p>{pairName || 'Unknown Pair'}</p>
              <p className="text-secondary text-sm">Volatile</p>
            </span>
          </span>
        </span>
      </td>
      <td>${volume ? volume.toNumber().toLocaleString() : '...'}</td>
      <td>{rewardItem.rank}</td>
      <td>
        <RewardAmounts rewardTokensAndAmounts={rewardItem.rewardTokensAndAmounts} showTotalUsd={!rewardItem.claimed} />
      </td>
      <td className="py-4 pr-8 rounded-r w-52 text-center">
        {!rewardItem.topReferrersSet ? (
          <PairRewarderSetTopReferrersButton
            rewardItem={rewardItem}
            pairRewarderAddress={pairRewarderAddress}
            pairAddress={pair}
          />
        ) : rewardItem.claimed ? (
          <button className="btn-primary btn-large font-medium mt-4 w-full xl:w-auto px-5 border-2 mx-2 text-white bg-gray shadow-primary-xl">
            Claimed
          </button>
        ) : (
          <PairRewarderClaimButton rewardItem={rewardItem} pairRewarderAddress={pairRewarderAddress} />
        )}
      </td>
    </tr>
  );
};
export const PairRewarderRewards = ({
  pairRewarderAddress,
  allPairRewarderRewardsItem: { rewards, pair },
}: {
  pairRewarderAddress: Address;
  allPairRewarderRewardsItem: AllPairRewarderRewardsItem;
}) => {
  const { pairName } = usePairName(pair);
  return (
    <>
      {rewards.map((rewardItem) => (
        <PairRewarderRewardItemComponent
          key={rewardItem.day.toString()}
          rewardItem={rewardItem}
          pair={pair}
          pairName={pairName}
          pairRewarderAddress={pairRewarderAddress}
        />
      ))}
    </>
  );
};
