import { arbitrum, goerli } from 'wagmi/chains';

export const chains = [arbitrum, goerli];

export function isSupportedChain(chainId: number | null | undefined) {
  // return !!chainId && !!SupportedChainId[chainId];
  return Boolean(chainId && chains.find((chain) => chain.id === chainId));
}
