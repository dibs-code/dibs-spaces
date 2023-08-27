import { pairRewarderABI } from 'abis/types/generated';
import { Address } from 'abitype';
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

export type PairRewarderDayWinnersRaw =
  | {
      info: {
        winnersCount: bigint;
        rewardTokens: readonly `0x${string}`[];
        rewardAmounts: readonly (readonly bigint[])[];
      };
      winners: readonly `0x${string}`[];
    }
  | undefined;
export type PairRewarderDayWinners =
  | (PairRewarderDayWinnersRaw & {
      winnerCodeNames: string[];
    })
  | undefined;

export type LeaderBoardInfo = ReadContractResult<typeof pairRewarderABI, 'leaderBoardInfo'>;

export type RewardTokenAndAmount = { token: Address; amount: bigint };

export type AddressMap = {
  [key: Chain['id']]: Address;
};

export type CoinGeckoAssetPlatform = { id: string; chain_identifier: number; name: string; shortname: string };

export interface LeaderBoardRecord {
  amountAsReferrer: string;
  user: Address;
  volume: BigNumber;
}

export interface LeaderBoardRecordWithCodeNames extends LeaderBoardRecord {
  code: string;
}

export type PairVolumes = {
  [pairAddress: Address]: BigNumberJS | undefined;
};

export type PairLeaderBoardsCache = {
  [pairAddress: Address]: LeaderBoardRecord[];
};
