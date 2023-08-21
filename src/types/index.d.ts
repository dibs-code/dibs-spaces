import { pairRewarderABI } from 'abis/types/generated';
import BigNumber from 'bignumber.js';
import BigNumberJS from 'bignumber.js';
import { Address, Chain } from 'wagmi';
import { ReadContractResult } from 'wagmi/actions';

export enum TransactionStatus {
  SUCCESS,
  PENDING,
}

export type Transaction = {
  status: TransactionStatus;
  type: string;
  message: string;
  amount: string;
  tokenSymbol: string;
  amountTo: string;
};

export type MuonVerificationData = {
  success: boolean;
  result: {
    app: string;
    appId: string;
    cid: string;
    confirmed: boolean;
    confirmedAt: number;
    data: {
      init: {
        nonceAddress: string;
      };
      params: {
        sign: string;
        time: string;
        token: string;
        user: string;
      };
      result: {
        balance: string;
        token: string;
        user: string;
      };
      signParams: {
        name?: string;
        type: string;
        value: string;
      }[];
      timestamp: number;
      uid: string;
    };
    gwAddress: string;
    method: string;
    nSign: number;
    nodeSignature: string;
    reqId: string;
    shieldAddress: string;
    shieldSignature: string;
    signatures: {
      owner: string;
      ownerPubKey: { x: string; yParity: string };
      result: { user: string; token: string; balance: string };
      signature: string;
      timestamp: number;
    }[];
    startedAt: number;
  };
};

export type PairRewarderEpochWinnersRaw =
  | {
      info: {
        winnersCount: bigint;
        rewardTokens: readonly `0x${string}`[];
        rewardAmounts: readonly (readonly bigint[])[];
      };
      winners: readonly `0x${string}`[];
    }
  | undefined;
export type PairRewarderEpochWinners =
  | (PairRewarderEpochWinnersRaw & {
      winnerCodeNames: string[];
    })
  | undefined;

export type LeaderBoardInfo = ReadContractResult<typeof pairRewarderABI, 'leaderBoardInfo'>;

export type RewardTokenAndAmount = { token: Address; amount: bigint };
export type PairRewarderRewardItem = {
  day: bigint;
  rank: number;
  claimed: boolean;
  rewardTokensAndAmounts: RewardTokenAndAmount[];
};

export type AddressMap = {
  [key: Chain['id']]: Address;
};

export type CoinGeckoAssetPlatform = { id: string; chain_identifier: number; name: string; shortname: string };

export interface LeaderBoardRecord {
  amountAsReferrer: string;
  code: string;
  user: Address;
  volume: BigNumber;
}

export type AllPairRewarderRewardsItem = {
  pair: Address;
  rewards: PairRewarderRewardItem[];
};
export type AllPairRewarderRewards = {
  [pairRewarderAddress: Address]: AllPairRewarderRewardsItem;
};

export type PairVolumes = {
  [pairAddress: Address]: BigNumberJS | undefined;
};
