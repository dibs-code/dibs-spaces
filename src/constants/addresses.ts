import { AddressMap } from 'types';
import { base, goerli } from 'wagmi/chains';

export const DibsAddressMap: AddressMap = {
  [goerli.id]: '0xC24fC147E160ee7A3AAd1d530f3385EF935e60b1',
  [base.id]: '0x6cb66a0762e7ce3c0abc9d0241bf4cffc67fcda1',
};
export const DibsSharesAddressMap: AddressMap = {
  [goerli.id]: '0x8a5DE5a5a5d8fefeE4249B307CDCa4d96D3Fb60C',
};

export const PairFactoryAddressMap: AddressMap = {
  [goerli.id]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
};
