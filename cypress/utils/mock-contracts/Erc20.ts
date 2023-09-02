import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { MaxUint256, Zero } from '@ethersproject/constants';
import ERC20_ABI from 'abis/erc20.json';
import { CallOverrides } from 'ethers';
import { MockContract, MockContractInterface } from 'metamocks';

import { TOKEN_BALANCE } from '../data';
import { Erc20 } from './types/Erc20';

export class Erc20MockContract extends MockContract<Erc20> implements MockContractInterface<Erc20> {
  abi = ERC20_ABI;
  allowedList: string[] = [];

  async allowance(_owner: string, _spender: string, overrides: CallOverrides | undefined): Promise<BigNumber> {
    return this.allowedList.includes(_spender) ? MaxUint256 : Zero;
  }

  async approve(_spender: string, _value: BigNumberish, overrides: CallOverrides | undefined): Promise<boolean> {
    this.allowedList.push(_spender);
    return true;
  }

  async balanceOf(_owner: string, overrides: CallOverrides | undefined): Promise<BigNumber> {
    return TOKEN_BALANCE;
  }

  decimals(overrides: CallOverrides | undefined): Promise<number> {
    return Promise.resolve(18);
  }

  name(overrides: CallOverrides | undefined): Promise<string> {
    throw new Error('Method not implemented.');
  }

  symbol(overrides: CallOverrides | undefined): Promise<string> {
    throw new Error('Method not implemented.');
  }

  totalSupply(overrides: CallOverrides | undefined): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  transfer(_to: string, _value: BigNumberish, overrides: CallOverrides | undefined): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  transferFrom(
    _from: string,
    _to: string,
    _value: BigNumberish,
    overrides: CallOverrides | undefined,
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

export class WETHMockContract extends Erc20MockContract {
  symbol(overrides: CallOverrides | undefined): Promise<string> {
    return Promise.resolve('WETH');
  }
}

export class UWUMockContract extends Erc20MockContract {
  symbol(overrides: CallOverrides | undefined): Promise<string> {
    return Promise.resolve('UWU');
  }
}
