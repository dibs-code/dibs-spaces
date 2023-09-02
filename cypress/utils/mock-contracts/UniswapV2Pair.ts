import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { BytesLike } from '@ethersproject/bytes';
import UniswapV2PairABI from 'abis/uniswapV2Pair.json';
import { CallOverrides } from 'ethers';
import { PromiseOrValue } from 'graphql/jsutils/PromiseOrValue';
import { MockContract, MockContractInterface } from 'metamocks';

import { UWU_ADDRESS, WETH_ADDRESS } from '../data';
import { UniswapV2Pair } from './types';

export default class UniswapV2PairMockContract
  extends MockContract<UniswapV2Pair>
  implements MockContractInterface<UniswapV2Pair>
{
  abi = UniswapV2PairABI;

  DOMAIN_SEPARATOR(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  MINIMUM_LIQUIDITY(overrides: CallOverrides | undefined): Promise<BigNumber> {
    throw Error('not implemented');
  }

  PERMIT_TYPEHASH(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  allowance(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<string>,
    overrides: CallOverrides | undefined,
  ): Promise<BigNumber> {
    throw Error('not implemented');
  }

  approve(
    spender: PromiseOrValue<string>,
    value: PromiseOrValue<BigNumberish>,
    overrides: CallOverrides | undefined,
  ): Promise<boolean> {
    throw Error('not implemented');
  }

  balanceOf(arg0: PromiseOrValue<string>, overrides: CallOverrides | undefined): Promise<BigNumber> {
    return Promise.resolve(BigNumber.from(0));
  }

  burn(
    to: PromiseOrValue<string>,
    overrides: CallOverrides | undefined,
  ): Promise<
    [BigNumber, BigNumber] & {
      amount0: BigNumber;
      amount1: BigNumber;
    }
  > {
    throw Error('not implemented');
  }

  decimals(overrides: CallOverrides | undefined): Promise<number> {
    return Promise.resolve(18);
  }

  factory(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  getReserves(overrides: CallOverrides | undefined): Promise<
    [BigNumber, BigNumber, number] & {
      _reserve0: BigNumber;
      _reserve1: BigNumber;
      _blockTimestampLast: number;
    }
  > {
    throw Error('not implemented');
  }

  initialize(
    _token0: PromiseOrValue<string>,
    _token1: PromiseOrValue<string>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }

  kLast(overrides: CallOverrides | undefined): Promise<BigNumber> {
    throw Error('not implemented');
  }

  mint(to: PromiseOrValue<string>, overrides: CallOverrides | undefined): Promise<BigNumber> {
    throw Error('not implemented');
  }

  name(overrides: CallOverrides | undefined): Promise<string> {
    return Promise.resolve('UNISWAP-V2');
  }

  nonces(arg0: PromiseOrValue<string>, overrides: CallOverrides | undefined): Promise<BigNumber> {
    throw Error('not implemented');
  }

  permit(
    owner: PromiseOrValue<string>,
    spender: PromiseOrValue<string>,
    value: PromiseOrValue<BigNumberish>,
    deadline: PromiseOrValue<BigNumberish>,
    v: PromiseOrValue<BigNumberish>,
    r: PromiseOrValue<BytesLike>,
    s: PromiseOrValue<BytesLike>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }

  price0CumulativeLast(overrides: CallOverrides | undefined): Promise<BigNumber> {
    throw Error('not implemented');
  }

  price1CumulativeLast(overrides: CallOverrides | undefined): Promise<BigNumber> {
    throw Error('not implemented');
  }

  skim(to: PromiseOrValue<string>, overrides: CallOverrides | undefined): Promise<void> {
    throw Error('not implemented');
  }

  swap(
    amount0Out: PromiseOrValue<BigNumberish>,
    amount1Out: PromiseOrValue<BigNumberish>,
    to: PromiseOrValue<string>,
    data: PromiseOrValue<BytesLike>,
    overrides: CallOverrides | undefined,
  ): Promise<void> {
    throw Error('not implemented');
  }

  symbol(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  sync(overrides: CallOverrides | undefined): Promise<void> {
    throw Error('not implemented');
  }

  token0(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  token1(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  totalSupply(overrides: CallOverrides | undefined): Promise<BigNumber> {
    throw Error('not implemented');
  }

  transfer(
    to: PromiseOrValue<string>,
    value: PromiseOrValue<BigNumberish>,
    overrides: CallOverrides | undefined,
  ): Promise<boolean> {
    throw Error('not implemented');
  }

  transferFrom(
    from: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    value: PromiseOrValue<BigNumberish>,
    overrides: CallOverrides | undefined,
  ): Promise<boolean> {
    throw Error('not implemented');
  }
}

export class TestPairMockContract extends UniswapV2PairMockContract {
  token0(overrides: CallOverrides | undefined): Promise<string> {
    return Promise.resolve(UWU_ADDRESS);
  }

  token1(overrides: CallOverrides | undefined): Promise<string> {
    return Promise.resolve(WETH_ADDRESS);
  }
}
