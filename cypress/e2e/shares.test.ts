/* eslint-disable @typescript-eslint/no-unused-expressions */

import RoutePath from 'routes';

import { getTestSelector } from '../utils';
import {
  chainId,
  CONNECTOR_TOKEN_DECIMALS,
  multicall3Address,
  UNI_ADDRESS,
} from '../utils/data';
import Multicall3MockContract from '../utils/mock-contracts/Multicall3';
import { Dibsshares, Erc20, Multicall3 } from '../utils/mock-contracts/types';
import DibsSharesMockContract from '../utils/mock-contracts/DibsShares';
import {DibsSharesAddressMap} from 'constants/addresses';
import { Erc20ConnectorTokenMockContract } from '../utils/mock-contracts/Erc20';
import { BigNumber } from '@ethersproject/bignumber';

describe('Dibs Shares', () => {
  const connectorToken = UNI_ADDRESS;
  
  beforeEach(() => {
    cy.setupMetamocks();
    cy.registerMockContract<Multicall3>(multicall3Address[chainId], Multicall3MockContract);
    cy.registerMockContract<Erc20>(connectorToken, Erc20ConnectorTokenMockContract);
    cy.visit(RoutePath.SHARES);
  });

  it('Can Deploy Dibs Share', function () {
    const dibsSharesMockContract = this.metamocks.registerMockContract<Dibsshares>(DibsSharesAddressMap[chainId], DibsSharesMockContract);
    cy.spy(dibsSharesMockContract, 'deployBondingToken');
    cy.connectWallet();

    cy.get(getTestSelector('shares-name-input')).type('Test Share');

    cy.get(getTestSelector('shares-symbol-input')).type('TSH');
    
    cy.get(getTestSelector('shares-connector-token-input')).type(connectorToken);

    cy.get(getTestSelector('shares-connector-weight-input')).type('999').should('have.value', '100');
    cy.get(getTestSelector('shares-connector-weight-input')).clear().type('23.5867').should('have.value', '23.58');
    
    cy.get(getTestSelector('shares-initial-supply-input')).type('1024');
    
    cy.get(getTestSelector('shares-initial-price-input')).type('5');

    cy.get(getTestSelector('shares-submit-button')).click();
    
    cy.wait(3000).then(() => {
      expect(dibsSharesMockContract['deployBondingToken']).to.have.been.calledWithExactly(
        'Test Share',
        'TSH',
        connectorToken,
        2358,
        BigNumber.from(1024).mul(BigNumber.from(10).pow(18)),
        BigNumber.from(5).mul(BigNumber.from(10).pow(CONNECTOR_TOKEN_DECIMALS)),
      );
    });
  });
});
