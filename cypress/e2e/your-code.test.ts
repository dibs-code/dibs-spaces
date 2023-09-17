/* eslint-disable @typescript-eslint/no-unused-expressions */

import { namedOperations } from 'apollo/__generated__/graphql';
import { isTheSameAddress } from 'metamocks';
import RoutePath from 'routes';

import { getTestSelector } from '../utils';
import {
  chainId,
  dibsCodeNamesRegistered,
  DibsContractAddresses,
  multicall3Address,
  TEST_ADDRESS_NEVER_USE,
  userGeneratedVolumeData,
} from '../utils/data';
import DibsMockContract from '../utils/mock-contracts/Dibs';
import Multicall3MockContract from '../utils/mock-contracts/Multicall3';
import { Dibs, Multicall3 } from '../utils/mock-contracts/types';

describe('YourCode', () => {
  beforeEach(() => {
    cy.setupMetamocks();
    cy.registerMockContract<Multicall3>(multicall3Address[chainId], Multicall3MockContract);
    cy.intercept('POST', /api.thegraph.com\/subgraphs\/name/, (req) => {
      if (req.body.operationName === namedOperations.Query.UserVolumeData) {
        if (req.body.variables.skip) {
          req.reply({
            data: {
              dailyGeneratedVolumes: [],
            },
          });
          return;
        }
        if (isTheSameAddress(req.body.variables.user, TEST_ADDRESS_NEVER_USE)) {
          req.reply(userGeneratedVolumeData);
          return;
        }
      }
      req.continue();
    });
    cy.visit(RoutePath.YOUR_CODE);
  });

  it('Can Create Dibs Code', function () {
    const dibsMockContract = this.metamocks.registerMockContract<Dibs>(DibsContractAddresses.dibs, DibsMockContract);
    cy.spy(dibsMockContract, 'register');
    cy.connectWallet();
    cy.get(getTestSelector('your-code-name')).should('not.exist');
    cy.get(getTestSelector('your-code-name-input')).type(dibsCodeNamesRegistered[TEST_ADDRESS_NEVER_USE]);
    cy.get(getTestSelector('your-code-name-create')).click();
    cy.wait(3000).then(() => {
      expect(dibsMockContract['register']).to.have.calledWithExactly(
        dibsCodeNamesRegistered[TEST_ADDRESS_NEVER_USE],
        '0x46179b40ce845b634390725b96cd52c6a6627d29c6f7a7d0d8951a4ec629afb1',
      );
      cy.get(getTestSelector('your-code-name')).contains(dibsCodeNamesRegistered[TEST_ADDRESS_NEVER_USE]);
      cy.get(getTestSelector('your-code-volume-generated')).contains('$0.047');
    });
  });
});
