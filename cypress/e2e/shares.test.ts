/* eslint-disable @typescript-eslint/no-unused-expressions */

import { BigNumber } from '@ethersproject/bignumber';
import { DibsSharesAddressMap } from 'constants/addresses';
import RoutePath from 'routes';

import { getTestSelector } from '../utils';
import { chainId, CONNECTOR_TOKEN_DECIMALS, multicall3Address, UNI_ADDRESS } from '../utils/data';
import DibsSharesMockContract from '../utils/mock-contracts/DibsShares';
import { Erc20ConnectorTokenMockContract } from '../utils/mock-contracts/Erc20';
import Multicall3MockContract from '../utils/mock-contracts/Multicall3';
import { Dibsshares, Erc20, Multicall3 } from '../utils/mock-contracts/types';

describe('Dibs Shares', () => {
  const connectorToken = UNI_ADDRESS;

  beforeEach(() => {
    cy.setupMetamocks();
    cy.registerMockContract<Multicall3>(multicall3Address, Multicall3MockContract);
    cy.registerMockContract<Erc20>(connectorToken, Erc20ConnectorTokenMockContract);
  });

  it('Can Deploy Dibs Share', function () {
    cy.visit(RoutePath.SHARES_CREATE);
    const dibsSharesMockContract = this.metamocks.registerMockContract<Dibsshares>(
      DibsSharesAddressMap[chainId],
      DibsSharesMockContract,
    );
    cy.spy(dibsSharesMockContract, 'deployBondingToken').as('deployBondingTokenSpy');
    cy.connectWallet();

    cy.get(getTestSelector('shares-connector-weight-input')).type('999').should('have.value', '100');
    cy.get(getTestSelector('shares-connector-weight-input')).clear().type('23.586799').should('have.value', '23.5867');

    cy.get(getTestSelector('shares-name-input')).type('Test Share');
    cy.get(getTestSelector('shares-symbol-input')).type('TSH');
    cy.get(getTestSelector('shares-connector-token-input')).type(connectorToken);
    cy.get(getTestSelector('shares-connector-weight-input')).clear().type('23.58');
    cy.get(getTestSelector('shares-initial-supply-input')).type('1024');
    cy.get(getTestSelector('shares-initial-price-input')).type('5');
    cy.get(getTestSelector('shares-submit-button')).click();

    cy.wait(3000).then(() => {
      cy.get('@deployBondingTokenSpy').then((spy: any) => {
        const callArgs = spy.getCall(0).args; //getCall(0) to get the first call

        expect(callArgs[0]).to.equal('Test Share');
        expect(callArgs[1]).to.equal('TSH');
        expect(callArgs[2].toLowerCase()).to.equal(connectorToken);
        expect(callArgs[3]).to.equal(235800);
        expect(callArgs[4].eq(BigNumber.from(1024).mul(BigNumber.from(10).pow(18)))).to.be.true;
        expect(callArgs[5].eq(BigNumber.from(5).mul(BigNumber.from(10).pow(CONNECTOR_TOKEN_DECIMALS)))).to.be.true;
      });
    });
  });
});
