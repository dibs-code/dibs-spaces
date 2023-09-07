import { namedOperations } from 'apollo/__generated__/graphql';
import { isTheSameAddress } from 'metamocks';
import RoutePath from 'routes';

import { getTestSelector, injectDibsContractAddressInLeaderBoardThatShouldBeFiltered } from '../utils';
import {
  chainId,
  dibsCodeNames,
  DibsContractAddresses,
  multicall3Address,
  TEST_DIBS_USER_1,
  testPairAddress,
  testPairDay21LeaderBoard,
  testPairRewarderIsNotSetterAddress,
  testPairRewarderIsSetterAddress,
  UWU_ADDRESS,
  WETH_ADDRESS,
} from '../utils/data';
import DibsMockContract from '../utils/mock-contracts/Dibs';
import { UWUMockContract, WETHMockContract } from '../utils/mock-contracts/Erc20';
import Multicall3MockContract from '../utils/mock-contracts/Multicall3';
import { TestPairRewarderIsNotSetter, TestPairRewarderIsSetter } from '../utils/mock-contracts/PairRewarder';
import PairRewarderFactoryMockContract from '../utils/mock-contracts/PairRewarderFactory';
import {
  Dibs,
  Erc20,
  Multicall3,
  PairRewarder,
  PairRewarderFactory,
  UniswapV2Pair,
} from '../utils/mock-contracts/types';
import { TestPairMockContract } from '../utils/mock-contracts/UniswapV2Pair';

describe('PairRewardersList', () => {
  beforeEach(() => {
    cy.setupMetamocks();
    cy.registerMockContract<Multicall3>(multicall3Address[chainId], Multicall3MockContract);
    cy.registerMockContract<PairRewarderFactory>(
      DibsContractAddresses.pairRewarderFactory,
      PairRewarderFactoryMockContract,
    );
    cy.registerMockContract<PairRewarder>(testPairRewarderIsSetterAddress, TestPairRewarderIsSetter);
    cy.registerMockContract<PairRewarder>(testPairRewarderIsNotSetterAddress, TestPairRewarderIsNotSetter);
    cy.registerMockContract<Dibs>(DibsContractAddresses.dibs, DibsMockContract);
    cy.registerMockContract<UniswapV2Pair>(testPairAddress, TestPairMockContract);
    cy.registerMockContract<Erc20>(WETH_ADDRESS, WETHMockContract);
    cy.registerMockContract<Erc20>(UWU_ADDRESS, UWUMockContract);
    cy.intercept('POST', /api.thegraph.com\/subgraphs\/name/, (req) => {
      if (req.body.operationName === namedOperations.Query.DailyDataForPair) {
        if (req.body.variables.skip) {
          req.reply({
            data: {
              dailyGeneratedVolumes: [],
            },
          });
          return;
        }
        if (req.body.variables.day === 21 && isTheSameAddress(req.body.variables.pair, testPairAddress)) {
          req.reply(injectDibsContractAddressInLeaderBoardThatShouldBeFiltered(testPairDay21LeaderBoard));
          return;
        }
      }
      req.continue();
    });
    cy.visit(RoutePath.PAIR_ISOLATED);
  });

  function assertPairRewarderRowGeneral() {
    cy.get(getTestSelector(`${testPairRewarderIsSetterAddress}-row`)).should('exist');
    cy.get(getTestSelector(`${testPairRewarderIsSetterAddress}-pair-name`)).contains('UWU/WETH');
    cy.get(getTestSelector(`${testPairRewarderIsNotSetterAddress}-row`)).should('exist');
    cy.get(getTestSelector(`${testPairRewarderIsSetterAddress}-winner-1`)).contains(dibsCodeNames[TEST_DIBS_USER_1]);
    cy.get(getTestSelector(`${testPairRewarderIsNotSetterAddress}-winner-1`)).contains(dibsCodeNames[TEST_DIBS_USER_1]);
  }

  it('Can visit pair rewarders list page', function () {
    // assert before wallet connection
    assertPairRewarderRowGeneral();
    cy.get(getTestSelector(`${testPairRewarderIsSetterAddress}-edit`)).should('not.exist');
    cy.get(getTestSelector(`${testPairRewarderIsNotSetterAddress}-edit`)).should('not.exist');
    cy.get(getTestSelector(`${testPairRewarderIsSetterAddress}-your-position`)).contains('-');

    cy.connectWallet();
    // assert after wallet connection
    cy.get(getTestSelector(`${testPairRewarderIsSetterAddress}-your-position`)).contains('#3');
    cy.get(getTestSelector(`${testPairRewarderIsSetterAddress}-edit`)).should('exist');
    cy.get(getTestSelector(`${testPairRewarderIsNotSetterAddress}-edit`)).should('not.exist');
    assertPairRewarderRowGeneral();
  });
});
