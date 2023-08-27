import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: 30 });
export const fromWei = (number: any, decimals = 18) => new BigNumber(number).div(new BigNumber(10).pow(decimals));
