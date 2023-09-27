// ***********************************************************
// This file is processed and loaded automatically before your test files.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.ts using ES2015 syntax:
import './ethereum';

Cypress.Commands.overwrite('intercept', (original, arg1, arg2, ...args) => {
  if (typeof arg2 === 'object' && arg2.constructor !== RegExp) {
    // @ts-ignore
    return original(arg1, { ...arg2, log: false }, ...args);
  }
  return original(arg1, arg2, ...args);
});
