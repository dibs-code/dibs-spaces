/* eslint-disable @typescript-eslint/no-unused-expressions */

import { BigNumber } from '@ethersproject/bignumber';
import { MaxUint256 } from '@ethersproject/constants';
import { DibsSharesAddressMap } from 'constants/addresses';
import RoutePath from 'routes';

import { getTestSelector } from '../utils';
import {
  BONDING_TOKEN_ADDRESS,
  chainId,
  CONNECTOR_TOKEN_DECIMALS,
  multicall3Address,
  TEST_ADDRESS_NEVER_USE,
  UNI_ADDRESS,
} from '../utils/data';
import BondingTokenMockContract from '../utils/mock-contracts/BondingToken';
import DibsSharesMockContract from '../utils/mock-contracts/DibsShares';
import {
  Erc20ConnectorTokenMockContract,
  Erc20ConnectorTokenWithAllowanceMockContract,
} from '../utils/mock-contracts/Erc20';
import Multicall3MockContract from '../utils/mock-contracts/Multicall3';
import { BondingToken, Dibsshares, Erc20, Multicall3 } from '../utils/mock-contracts/types';

describe('Dibs Shares', () => {
  const connectorToken = UNI_ADDRESS;

  beforeEach(() => {
    cy.setupMetamocks();
    cy.registerMockContract<Multicall3>(multicall3Address, Multicall3MockContract);
  });

  it('Can Deploy Dibs Share', function () {
    cy.registerMockContract<Erc20>(connectorToken, Erc20ConnectorTokenMockContract);
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
        const callArgs = spy.getCall(-1).args;

        expect(callArgs[0]).to.equal('Test Share');
        expect(callArgs[1]).to.equal('TSH');
        expect(callArgs[2].toLowerCase()).to.equal(connectorToken);
        expect(callArgs[3]).to.equal(235800);
        expect(callArgs[4].eq(BigNumber.from(1024).mul(BigNumber.from(10).pow(18)))).to.be.true;
        expect(callArgs[5].eq(BigNumber.from(5).mul(BigNumber.from(10).pow(CONNECTOR_TOKEN_DECIMALS)))).to.be.true;
      });
    });
  });

  it.only('Can Buy Dibs Share', function () {
    const connectorTokenContract = this.metamocks.registerMockContract<Erc20>(
      connectorToken,
      Erc20ConnectorTokenMockContract,
    );
    cy.spy(connectorTokenContract, 'approve').as('approveSpy');
    cy.visit(RoutePath.SHARES_SHARE.replace(':address', BONDING_TOKEN_ADDRESS));
    const bondingTokenMockContract = this.metamocks.registerMockContract<BondingToken>(
      BONDING_TOKEN_ADDRESS,
      BondingTokenMockContract,
    );
    cy.spy(bondingTokenMockContract, 'mint').as('mintSpy');
    cy.connectWallet();

    cy.get(getTestSelector('share-buy-connector-token-amount')).clear().type('1');
    cy.get(getTestSelector('share-purchase-return')).contains('0.02');
    cy.get(getTestSelector('share-buy')).contains('Insufficient balance');

    cy.get(getTestSelector('share-buy-connector-token-amount')).clear().type('0.001');
    cy.get(getTestSelector('share-purchase-return')).contains('0.00002');
    cy.get(getTestSelector('share-buy')).contains('Approve');
    cy.registerMockContract<Erc20>(connectorToken, Erc20ConnectorTokenWithAllowanceMockContract);
    cy.get(getTestSelector('share-buy')).click();
    cy.get(getTestSelector('share-buy'))
      .contains('Buy')
      .then(() => {
        cy.get('@approveSpy').then((spy: any) => {
          const callArgs = spy.getCall(-1).args; //getCall(0) to get the first call

          expect(callArgs[0].toLowerCase()).to.equal(BONDING_TOKEN_ADDRESS.toLowerCase());
          expect(callArgs[1].eq(MaxUint256)).to.be.true;
        });
      });
    cy.get(getTestSelector('share-buy')).click();

    cy.wait(3000).then(() => {
      cy.get('@mintSpy').then((spy: any) => {
        const callArgs = spy.getCall(-1).args; //getCall(0) to get the first call

        expect(callArgs[0].toLowerCase()).to.equal(TEST_ADDRESS_NEVER_USE.toLowerCase());
        expect(callArgs[1].eq(BigNumber.from(10).pow(3))).to.be.true;
      });
    });
  });
});
