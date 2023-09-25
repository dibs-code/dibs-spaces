import { AddressMap } from 'types';
import { arbitrum, goerli } from 'wagmi/chains';

export const DibsAddressMap: AddressMap = {
  [goerli.id]: '0xC24fC147E160ee7A3AAd1d530f3385EF935e60b1',
  [arbitrum.id]: '0x21dd036CFAB09243eeffCFC24C47b3baA860f9b7',
};
export const DibsSharesAddressMap: AddressMap = {
  [goerli.id]: '0xd782572E19356D10302C81dad9a3a074cbB878E2',
  [arbitrum.id]: '0x8a5DE5a5a5d8fefeE4249B307CDCa4d96D3Fb60C', //TODO: change to real contract address on arbitreum
};

export const PairFactoryAddressMap: AddressMap = {
  [goerli.id]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  [arbitrum.id]: '0xAAA20D08e59F6561f242b08513D36266C5A29415',
};
