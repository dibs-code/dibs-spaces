import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { BytesLike } from '@ethersproject/bytes';
import DibsABI from 'abis/dibs.json';
import { CallOverrides } from 'ethers';
import { PromiseOrValue } from 'graphql/jsutils/PromiseOrValue';
import { MockContract, MockContractInterface } from 'metamocks';

import { dibsCodeNames, dibsCodeNamesRegistered, DibsContractAddresses, ZERO_ADDRESS } from '../data';
import { Dibs } from './types';

export default class DibsMockContract extends MockContract<Dibs> implements MockContractInterface<Dibs> {
  abi = DibsABI;

  BLACKLIST_SETTER(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  DEFAULT_ADMIN_ROLE(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  DIBS(overrides: CallOverrides | undefined): Promise<string> {
    return Promise.resolve(ZERO_ADDRESS);
  }

  PROJECT_ID(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('PROJECT_ID not implemented');
  }

  SCALE(overrides: CallOverrides | undefined): Promise<number> {
    throw Error('not implemented');
  }

  SETTER(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('SETTER not implemented');
  }

  addressToCode(arg0: PromiseOrValue<string>, overrides: CallOverrides | undefined): Promise<string> {
    throw Error('addressToCode not implemented');
  }

  blacklisted(arg0: PromiseOrValue<string>, overrides: CallOverrides | undefined): Promise<boolean> {
    throw Error('not implemented');
  }

  claim(
    from: PromiseOrValue<string>,
    token: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    to: PromiseOrValue<string>,
    accumulativeBalance: PromiseOrValue<BigNumberish>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('claim not implemented');
  }

  claimExcessTokens(
    token: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    accumulativeBalance: PromiseOrValue<BigNumberish>,
    amount: PromiseOrValue<BigNumberish>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }

  claimedBalance(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<string>,
    overrides: CallOverrides | undefined,
  ): Promise<BigNumber> {
    throw Error('not implemented');
  }

  codeToAddress(arg0: PromiseOrValue<BytesLike>, overrides: CallOverrides | undefined): Promise<string> {
    throw Error('codeToAddress not implemented');
  }

  codeToName(arg0: PromiseOrValue<BytesLike>, overrides: CallOverrides | undefined): Promise<string> {
    throw Error('codeToName not implemented');
  }

  dibsLottery(overrides: CallOverrides | undefined): Promise<string> {
    return Promise.resolve(DibsContractAddresses.dibsLottery);
  }

  dibsPercentage(overrides: CallOverrides | undefined): Promise<number> {
    throw Error('not implemented');
  }

  excessClaimedBalance(arg0: PromiseOrValue<string>, overrides: CallOverrides | undefined): Promise<BigNumber> {
    throw Error('not implemented');
  }

  firstRoundStartTime(overrides: CallOverrides | undefined): Promise<number> {
    return Promise.resolve(Math.floor(new Date().getTime() / 1000) - 86400 * 21.5);
  }

  getAddress(name: PromiseOrValue<string>, overrides: CallOverrides | undefined): Promise<string> {
    throw Error('getAddress not implemented');
  }

  getCode(name: PromiseOrValue<string>, overrides: CallOverrides | undefined): Promise<string> {
    throw Error('getCode not implemented');
  }

  async getCodeName(user: PromiseOrValue<string>, overrides: CallOverrides | undefined): Promise<string> {
    const codeName = dibsCodeNames[(await user).toLowerCase()];
    if (codeName) return codeName;
    throw Error('Code name not found');
  }

  getRoleAdmin(role: PromiseOrValue<BytesLike>, overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  grandparentPercentage(overrides: CallOverrides | undefined): Promise<number> {
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
    admin_: PromiseOrValue<string>,
    setter_: PromiseOrValue<string>,
    dibsLottery_: PromiseOrValue<string>,
    wethPriceFeed_: PromiseOrValue<string>,
    firstRoundStartTime_: PromiseOrValue<BigNumberish>,
    roundDuration_: PromiseOrValue<BigNumberish>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }

  muonInterface(overrides: CallOverrides | undefined): Promise<string> {
    return Promise.resolve(DibsContractAddresses.muonInterface);
  }

  pairRewarderFactory(overrides: CallOverrides | undefined): Promise<string> {
    return Promise.resolve(DibsContractAddresses.pairRewarderFactory);
  }

  parents(arg0: PromiseOrValue<string>, overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  recoverERC20(
    token: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    to: PromiseOrValue<string>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }

  refereePercentage(overrides: CallOverrides | undefined): Promise<number> {
    throw Error('not implemented');
  }

  referrerPercentage(overrides: CallOverrides | undefined): Promise<number> {
    throw Error('not implemented');
  }

  register(
    name: PromiseOrValue<string>,
    parentCode: PromiseOrValue<BytesLike>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
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

  roundDuration(overrides: CallOverrides | undefined): Promise<number> {
    throw Error('not implemented');
  }

  setBlacklisted(
    _addresses: PromiseOrValue<string>[],
    _isBlacklisted: PromiseOrValue<boolean>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }

  setMuonInterface(_muonInterface: PromiseOrValue<string>, overrides: CallOverrides | undefined): Promise<void> {
    throw Error('not implemented');
  }

  setPairRewarderFactory(
    _pairRewarderFactory: PromiseOrValue<string>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }

  setParent(
    user: PromiseOrValue<string>,
    parent: PromiseOrValue<string>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }

  setPercentages(
    _refereePercentage: PromiseOrValue<BigNumberish>,
    _referrerPercentage: PromiseOrValue<BigNumberish>,
    _grandparentPercentage: PromiseOrValue<BigNumberish>,
    _dibsPercentage: PromiseOrValue<BigNumberish>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }

  supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides: CallOverrides | undefined): Promise<boolean> {
    throw Error('not implemented');
  }

  wethPriceFeed(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }
}

export class DibsMockContractRegistered extends DibsMockContract {
  async getCodeName(user: PromiseOrValue<string>, overrides: CallOverrides | undefined): Promise<string> {
    const codeName = dibsCodeNamesRegistered[(await user).toLowerCase()];
    if (codeName) return codeName;
    throw Error('Code name not found');
  }
}
