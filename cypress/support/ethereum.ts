/**
 * Updates cy.visit() to include an injected window.ethereum provider.
 */

import MetaMocks from 'metamocks';

import { getTestSelector } from '../utils';
import { chainId, TEST_PRIVATE_KEY } from '../utils/data';

export const injected = new MetaMocks(TEST_PRIVATE_KEY, chainId);
Cypress.Commands.add('setupMetamocks', () => {
  cy.intercept(/infura.io/, async (req) => {
    const data = req.body;
    try {
      const result = await injected.handleEthMethod(data);
      if (result.resultIsSet) {
        req.reply({
          id: data.id,
          jsonrpc: data.jsonrpc,
          result: result.result,
        });
      } else {
        if (result.errorIsSet) {
          console.error(result.runError);
        }
        req.continue();
      }
    } catch (e) {
      console.error(e);
      req.continue();
    }
  });
  cy.on('window:before:load', (win) => {
    win.ethereum = injected;
  });
});
Cypress.Commands.add('connectWallet', () => {
  cy.get(getTestSelector('connect-wallet-button')).click();
  cy.get(getTestSelector('rk-wallet-option-injected')).click();
});

beforeEach(() => {
  cy.wrap(injected).as('metamocks');
});

Cypress.Commands.add('registerMockContract', (...args) => {
  cy.get('@metamocks').then((val: any) => {
    const metamocks = val as MetaMocks;
    metamocks.registerMockContract(...args);
  });
});
