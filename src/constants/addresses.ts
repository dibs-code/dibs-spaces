import { AddressMap } from 'types';
import { arbitrum, goerli } from 'wagmi/chains';

export const DibsAddressMap: AddressMap = {
  [goerli.id]: '0xC24fC147E160ee7A3AAd1d530f3385EF935e60b1',
  [arbitrum.id]: '0x21dd036CFAB09243eeffCFC24C47b3baA860f9b7',
};
