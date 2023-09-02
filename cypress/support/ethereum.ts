/**
 * Updates cy.visit() to include an injected window.ethereum provider.
 */

import MetaMocks from 'metamocks';

import { chainId, TEST_PRIVATE_KEY } from '../utils/data';

export const injected = new MetaMocks(TEST_PRIVATE_KEY, chainId);
