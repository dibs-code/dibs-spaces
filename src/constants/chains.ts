export enum SupportedChainId {
  MAINNET = 1,
  GOERLI = 5,
  BSC = 56,
}

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.MAINNET]: 'mainnet',
  [SupportedChainId.GOERLI]: 'goerli',
  [SupportedChainId.BSC]: 'bsc',
};

/**
 * Array of all the supported chain IDs
 */
export const SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
  (id) => typeof id === 'number',
) as SupportedChainId[];

export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [SupportedChainId.MAINNET];

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [SupportedChainId.MAINNET, SupportedChainId.GOERLI, SupportedChainId.BSC] as const;

export type SupportedL1ChainId = (typeof L1_CHAIN_IDS)[number];

export const FALLBACK_CHAIN_ID = SupportedChainId.BSC;

export const L2_CHAIN_IDS: readonly SupportedChainId[] = [] as const;

export type SupportedL2ChainId = (typeof L2_CHAIN_IDS)[number];

export function isSupportedChain(chainId: number | null | undefined): chainId is SupportedChainId {
  // return !!chainId && !!SupportedChainId[chainId];
  console.log({ chainId });
  return !!chainId && chainId === SupportedChainId.GOERLI;
}
