import { DailyDataQuery, namedOperations } from 'apollo/__generated__/graphql';
import { isTheSameAddress } from 'metamocks';
import RoutePath from 'routes';
import { fromWei } from 'utils/numbers';

import { getTestSelector, injectDibsContractAddressInLeaderBoardThatShouldBeFiltered } from '../utils';
import {
  chainId,
  dibsCodeNamesRegistered,
  DibsContractAddresses,
  multicall3Address,
  testPairAddress,
  testPairDay20LeaderBoard,
  testPairDay21LeaderBoard,
  testPairRewarderIsNotSetterAddress,
  testPairRewarderIsSetterAddress,
  UWU_ADDRESS,
  WETH_ADDRESS,
} from '../utils/data';
import { DibsMockContractRegistered } from '../utils/mock-contracts/Dibs';
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
    cy.registerMockContract<Dibs>(DibsContractAddresses.dibs, DibsMockContractRegistered);
    cy.registerMockContract<UniswapV2Pair>(testPairAddress, TestPairMockContract);
    cy.registerMockContract<Erc20>(WETH_ADDRESS, WETHMockContract);
    cy.registerMockContract<Erc20>(UWU_ADDRESS, UWUMockContract);
    cy.intercept('POST', /api.thegraph.com\/subgraphs\/name/, (req) => {
      console.log('req.body');
      console.log(req.body);
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
        if (req.body.variables.day === 20 && isTheSameAddress(req.body.variables.pair, testPairAddress)) {
          req.reply(injectDibsContractAddressInLeaderBoardThatShouldBeFiltered(testPairDay20LeaderBoard));
          return;
        }
      }
      req.continue();
    });
  });

  function assertLeaderBoardRecords(data: DailyDataQuery) {
    data.dailyGeneratedVolumes.forEach((item, index) => {
      cy.get(getTestSelector(`leaderboard-record-${index}-rank`)).contains(`#${index + 1}`);
      cy.get(getTestSelector(`leaderboard-record-${index}-code-name`)).contains(dibsCodeNamesRegistered[item.user]);
      cy.get(getTestSelector(`leaderboard-record-${index}-volume`)).contains(
        fromWei(item.amountAsReferrer).toNumber().toLocaleString(),
      );
    });
  }

  function assertPairRewarderRowGeneral() {
    cy.get(getTestSelector(`${testPairRewarderIsSetterAddress}-pair-name`)).contains('UWU/WETH');
    assertLeaderBoardRecords(testPairDay21LeaderBoard.data);
    cy.get(getTestSelector('table-view-switch-option-two')).click();
    assertLeaderBoardRecords(testPairDay20LeaderBoard.data);
    cy.get(getTestSelector('table-view-switch-option-one')).click();
  }

  it('Can visit pair rewarder page', function () {
    cy.registerMockContract<PairRewarder>(testPairRewarderIsSetterAddress, TestPairRewarderIsSetter);
    cy.visit(RoutePath.PAIR_REWARDER_LEADERBOARD.replace(':address', testPairRewarderIsSetterAddress));

    // assert before wallet connection
    assertPairRewarderRowGeneral();
    cy.get(getTestSelector(`${testPairRewarderIsSetterAddress}-edit-or-create`)).contains('Create');

    cy.connectWallet();
    // assert after wallet connection
    cy.get(getTestSelector(`${testPairRewarderIsSetterAddress}-edit-or-create`)).contains('Edit');
    assertPairRewarderRowGeneral();
  });
});
