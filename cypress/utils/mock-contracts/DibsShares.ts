import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import DibsSharesABI from 'abis/dibsshares.json';
import { CallOverrides } from 'ethers';
import { MockContract, MockContractInterface } from 'metamocks';

import { Dibsshares } from './types';

export default class DibsSharesMockContract
  extends MockContract<Dibsshares>
  implements MockContractInterface<Dibsshares>
{
  abi = DibsSharesABI;

  allBondingTokens(arg0: BigNumberish, overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  allBondingTokensLength(overrides: CallOverrides | undefined): Promise<BigNumber> {
    throw Error('not implemented');
  }

  curve(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }

  async deployBondingToken(
    name: string,
    symbol: string,
    _connectorToken: string,
    _connectorWeight: BigNumberish,
    _initialSupply: BigNumberish,
    _initialPrice: BigNumberish,
    overrides: CallOverrides | undefined,
  ): Promise<string> {
    return '';
  }

  bondingTokenImplementation(overrides: CallOverrides | undefined): Promise<string> {
    throw Error('not implemented');
  }
}
