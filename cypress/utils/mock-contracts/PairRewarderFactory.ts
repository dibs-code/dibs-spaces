import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { BytesLike } from '@ethersproject/bytes';
import pairRewarderFactoryABI from 'abis/pairRewarderFactory.json';
import { CallOverrides } from 'ethers';
import { PromiseOrValue } from 'graphql/jsutils/PromiseOrValue';
import { MockContract, MockContractInterface } from 'metamocks';

import { DibsContractAddresses, pairRewarders, pairs } from '../data';
import { PairRewarderFactory } from './types';

export default class PairRewarderFactoryMockContract
  extends MockContract<PairRewarderFactory>
  implements MockContractInterface<PairRewarderFactory>
{
  abi = pairRewarderFactoryABI;

  deployPairRewarder(
    pair_: PromiseOrValue<string>,
    admin_: PromiseOrValue<string>,
    setter_: PromiseOrValue<string>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }

  dibs(overrides: CallOverrides | undefined): Promise<string> {
    return Promise.resolve(DibsContractAddresses.dibs);
  }

  async getAllPairRewarders(pair_: PromiseOrValue<string>, overrides: CallOverrides | undefined): Promise<string[]> {
    const pair = await pair_;
    return Promise.resolve(pairRewarders[pair.toLowerCase()]);
  }

  getAllPairs(overrides: CallOverrides | undefined): Promise<string[]> {
    return Promise.resolve(pairs);
  }

  initialize(
    dibs_: PromiseOrValue<string>,
    bytecode_: PromiseOrValue<BytesLike>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }

  pairRewarderBytecode(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  pairRewarderImplementation(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  async pairRewarders(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides: CallOverrides | undefined,
  ): Promise<string> {
    const pair = await arg0;
    const index = await arg1;
    return Promise.resolve(
      pairRewarders[pair][typeof index === 'object' && 'toNumber' in index ? index.toNumber() : Number(index)],
    );
  }

  async pairRewardersLength(pair_: PromiseOrValue<string>, overrides: CallOverrides | undefined): Promise<BigNumber> {
    const pair = await pair_;
    return Promise.resolve(BigNumber.from(pairRewarders[pair].length));
  }

  async pairs(arg0: PromiseOrValue<BigNumberish>, overrides: CallOverrides | undefined): Promise<string> {
    const index = await arg0;
    return Promise.resolve(pairs[typeof index === 'object' && 'toNumber' in index ? index.toNumber() : Number(index)]);
  }

  pairsLength(overrides: CallOverrides | undefined): Promise<BigNumber> {
    return Promise.resolve(BigNumber.from(pairs.length));
  }

  proxyAdmin(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  setPairRewarderBytecode(bytecode_: PromiseOrValue<BytesLike>, overrides: CallOverrides | undefined): Promise<void> {
    throw Error('not implemented');
  }

  upgradePairRewarders(
    pairRewarders_: PromiseOrValue<string>[],
    implementation_: PromiseOrValue<string>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }
}
