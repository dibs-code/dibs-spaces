/* eslint-disable @typescript-eslint/no-unused-expressions */

import RoutePath from 'routes';

import { getTestSelector } from '../utils';
import {
  chainId,
  dibsCodeNamesRegistered,
  DibsContractAddresses,
  multicall3Address,
  TEST_ADDRESS_NEVER_USE,
} from '../utils/data';
import DibsMockContract from '../utils/mock-contracts/Dibs';
import Multicall3MockContract from '../utils/mock-contracts/Multicall3';
import { Dibs, Multicall3 } from '../utils/mock-contracts/types';

describe('YourCode', () => {
  beforeEach(() => {
    cy.setupMetamocks();
    cy.registerMockContract<Multicall3>(multicall3Address[chainId], Multicall3MockContract);
    cy.visit(RoutePath.YOUR_CODE);
  });

  it('Can Create Dibs Code', function () {
    const dibsMockContract = this.metamocks.registerMockContract<Dibs>(DibsContractAddresses.dibs, DibsMockContract);
    cy.spy(dibsMockContract, 'register');
    cy.connectWallet();
    cy.get(getTestSelector('your-code-name')).should('not.exist');
    cy.get(getTestSelector('your-code-name-input')).type(dibsCodeNamesRegistered[TEST_ADDRESS_NEVER_USE]);
    cy.get(getTestSelector('your-code-name-create'))
      .click()
      .then(() => {
        expect(dibsMockContract['register']).to.have.called;
        cy.get(getTestSelector('your-code-name')).contains(dibsCodeNamesRegistered[TEST_ADDRESS_NEVER_USE]);
      });
  });
});
