import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import BondingTokenABI from 'abis/bondingToken.json';
import { CallOverrides } from 'ethers';
import { MockContract, MockContractInterface } from 'metamocks';

import { TRADE_SHARE_UNI_AMOUNT, UNI_ADDRESS } from '../data';
import { BondingToken } from './types';

export default class BondingTokenMockContract
  extends MockContract<BondingToken>
  implements MockContractInterface<BondingToken>
{
  abi = BondingTokenABI;

  allowance(owner: string, spender: string, overrides: CallOverrides | undefined): Promise<BigNumber> {
    throw Error('not implemented');
  }

  approve(spender: string, amount: BigNumberish, overrides: CallOverrides | undefined): Promise<boolean> {
    throw Error('not implemented');
  }

  author(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  balanceOf(account: string, overrides: CallOverrides | undefined): Promise<BigNumber> {
    throw Error('not implemented');
  }

  burn(amount: BigNumberish, to: string, overrides: CallOverrides | undefined): Promise<void> {
    throw Error('not implemented');
  }

  connectorBalance(overrides: CallOverrides | undefined): Promise<BigNumber> {
    throw Error('not implemented');
  }

  async connectorToken(overrides: CallOverrides | undefined): Promise<string> {
    return UNI_ADDRESS;
  }

  connectorWeight(overrides: CallOverrides | undefined): Promise<number> {
    throw Error('not implemented');
  }

  curve(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  async decimals(overrides: CallOverrides | undefined): Promise<number> {
    return 18;
  }

  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    overrides: CallOverrides | undefined,
  ): Promise<boolean> {
    throw Error('not implemented');
  }

  async getPurchaseReturn(amount: BigNumberish, overrides: CallOverrides | undefined): Promise<BigNumber> {
    return BigNumber.from(amount).mul(BigNumber.from(2).mul(BigNumber.from(10).pow(10)));
  }

  async getSaleReturn(amount: BigNumberish, overrides: CallOverrides | undefined): Promise<BigNumber> {
    return TRADE_SHARE_UNI_AMOUNT;
  }

  increaseAllowance(spender: string, addedValue: BigNumberish, overrides: CallOverrides | undefined): Promise<boolean> {
    throw Error('not implemented');
  }

  mint(to: string, amount: BigNumberish, overrides: CallOverrides | undefined): Promise<void> {
    throw Error('not implemented');
  }

  name(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  symbol(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  totalSupply(overrides: CallOverrides | undefined): Promise<BigNumber> {
    throw Error('not implemented');
  }

  transfer(to: string, amount: BigNumberish, overrides: CallOverrides | undefined): Promise<boolean> {
    throw Error('not implemented');
  }

  transferFrom(from: string, to: string, amount: BigNumberish, overrides: CallOverrides | undefined): Promise<boolean> {
    throw Error('not implemented');
  }
}
