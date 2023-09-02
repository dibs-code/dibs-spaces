import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { BytesLike } from '@ethersproject/bytes';
import PairRewarderABI from 'abis/pairRewarder.json';
import { CallOverrides } from 'ethers';
import { PromiseOrValue } from 'graphql/jsutils/PromiseOrValue';
import { MockContract, MockContractInterface } from 'metamocks';

import { leaderBoardInfo, leaderBoardWinners, TEST_ADDRESS_NEVER_USE, testPairAddress } from '../data';
import { PairRewarder } from './types';
import { IPairRewarder } from './types/PairRewarder';

const SETTER_ROLE_VALUE = '0x61c92169ef077349011ff0b1383c894d86c5f0b41d986366b58a6cf31e93beda';
export default class PairRewarderMockContract
  extends MockContract<PairRewarder>
  implements MockContractInterface<PairRewarder>
{
  abi = PairRewarderABI;

  DEFAULT_ADMIN_ROLE(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  SETTER_ROLE(overrides: CallOverrides | undefined): Promise<string> {
    return Promise.resolve(SETTER_ROLE_VALUE);
  }

  activeDay(overrides: CallOverrides | undefined): Promise<BigNumber> {
    throw Error('not implemented');
  }

  claimLeaderBoardReward(
    day: PromiseOrValue<BigNumberish>,
    to: PromiseOrValue<string>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }

  dibs(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  getRoleAdmin(role: PromiseOrValue<BytesLike>, overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  getUserLeaderBoardWins(user_: PromiseOrValue<string>, overrides: CallOverrides | undefined): Promise<BigNumber[]> {
    throw Error('not implemented');
  }

  grantRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }

  hasRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides: CallOverrides | undefined,
  ): Promise<boolean> {
    throw Error('not implemented');
  }

  initialize(
    dibs_: PromiseOrValue<string>,
    pair_: PromiseOrValue<string>,
    admin_: PromiseOrValue<string>,
    setter_: PromiseOrValue<string>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }

  leaderBoardInfo(overrides: CallOverrides | undefined): Promise<IPairRewarder.LeaderBoardInfoStructOutput> {
    return Promise.resolve(leaderBoardInfo);
  }

  leaderBoardWinners(
    day_: PromiseOrValue<BigNumberish>,
    overrides: CallOverrides | undefined,
  ): Promise<IPairRewarder.LeaderBoardWinnersStructOutput> {
    return Promise.resolve(leaderBoardWinners);
  }

  pair(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  renounceRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }

  revokeRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }

  setLeaderBoard(
    winnersCount_: PromiseOrValue<BigNumberish>,
    rewardTokens_: PromiseOrValue<string>[],
    rewardAmounts_: PromiseOrValue<BigNumberish>[][],
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }

  setTopReferrers(
    day: PromiseOrValue<BigNumberish>,
    winners: PromiseOrValue<string>[],
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }

  supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides: CallOverrides | undefined): Promise<boolean> {
    throw Error('not implemented');
  }

  userLeaderBoardClaimedForDay(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides: CallOverrides | undefined,
  ): Promise<boolean> {
    throw Error('not implemented');
  }

  userLeaderBoardWins(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides: CallOverrides | undefined,
  ): Promise<BigNumber> {
    throw Error('not implemented');
  }

  userLeaderBoardWonOnDay(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides: CallOverrides | undefined,
  ): Promise<boolean> {
    throw Error('not implemented');
  }
}

export class TestPairRewarder extends PairRewarderMockContract {
  pair(overrides: CallOverrides | undefined): Promise<string> {
    return Promise.resolve(testPairAddress);
  }
}

export class TestPairRewarderIsSetter extends TestPairRewarder {
  async hasRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides: CallOverrides | undefined,
  ): Promise<boolean> {
    return (await role) === SETTER_ROLE_VALUE && (await account).toLowerCase() === TEST_ADDRESS_NEVER_USE.toLowerCase();
  }
}

export class TestPairRewarderIsNotSetter extends TestPairRewarder {
  async hasRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides: CallOverrides | undefined,
  ): Promise<boolean> {
    return false;
  }
}
