import { goerli } from 'wagmi/chains';

export const chains = [goerli];

export function isSupportedChain(chainId: number | null | undefined) {
  // return !!chainId && !!SupportedChainId[chainId];
  return Boolean(chainId && chains.find((chain) => chain.id === chainId));
}
