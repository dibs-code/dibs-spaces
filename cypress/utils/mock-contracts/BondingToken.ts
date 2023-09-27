import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import BondingTokenABI from 'abis/bondingToken.json';
import { CallOverrides } from 'ethers';
import { MockContract, MockContractInterface } from 'metamocks';

import { BONDING_TOKEN_DECIMALS, CONNECTOR_TOKEN_DECIMALS, UNI_ADDRESS } from '../data';
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
    return BONDING_TOKEN_DECIMALS;
  }

  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    overrides: CallOverrides | undefined,
  ): Promise<boolean> {
    throw Error('not implemented');
  }

  async getPurchaseReturn(amount: BigNumberish, overrides: CallOverrides | undefined): Promise<BigNumber> {
    return BigNumber.from(amount).mul(
      BigNumber.from(2).mul(BigNumber.from(10).pow(BONDING_TOKEN_DECIMALS - CONNECTOR_TOKEN_DECIMALS - 2)),
    );
  }

  async getSaleReturn(amount: BigNumberish, overrides: CallOverrides | undefined): Promise<BigNumber> {
    return BigNumber.from(amount).mul(
      BigNumber.from(2).div(BigNumber.from(10).pow(BONDING_TOKEN_DECIMALS - CONNECTOR_TOKEN_DECIMALS - 2)),
    );
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

  factory(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  getMarketCap(overrides: CallOverrides | undefined): Promise<BigNumber> {
    throw Error('not implemented');
  }

  spotPrice(overrides: CallOverrides | undefined): Promise<BigNumber> {
    throw Error('not implemented');
  }
}
