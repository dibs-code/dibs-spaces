import { arbitrum, base, goerli, mainnet } from 'wagmi/chains';

const BLOCK_EXPLORER_PREFIXES: {
  [chainId: number]: string;
} = {
  [mainnet.id]: 'https://etherscan.io',
  [goerli.id]: 'https://goerli.etherscan.io',
  [arbitrum.id]: 'https://arbiscan.io',
  [base.id]: 'https://basescan.org',
};

export enum ExplorerDataType {
  TRANSACTION = 'transaction',
  TOKEN = 'token',
  ADDRESS = 'address',
  BLOCK = 'block',
}

/**
 * Return the explorer link for the given data and data type
 * @param chainId the ID of the chain for which to return the data
 * @param data the data to return a link for
 * @param type the type of the data
 */
export function getExplorerLink(chainId: number, data: string, type: ExplorerDataType): string {
  // if (chainId === SupportedChainId.ARBITRUM_ONE) {
  //   switch (type) {
  //     case ExplorerDataType.TRANSACTION:
  //       return `https://arbiscan.io/tx/${data}`
  //     case ExplorerDataType.ADDRESS:
  //     case ExplorerDataType.TOKEN:
  //       return `https://arbiscan.io/address/${data}`
  //     case ExplorerDataType.BLOCK:
  //       return `https://arbiscan.io/block/${data}`
  //     default:
  //       return `https://arbiscan.io/`
  //   }
  // }
  //
  // if (chainId === SupportedChainId.ARBITRUM_GOERLY) {
  //   switch (type) {
  //     case ExplorerDataType.TRANSACTION:
  //       return `https://rinkeby-explorer.arbitrum.io/tx/${data}`
  //     case ExplorerDataType.ADDRESS:
  //     case ExplorerDataType.TOKEN:
  //       return `https://rinkeby-explorer.arbitrum.io/address/${data}`
  //     case ExplorerDataType.BLOCK:
  //       return `https://rinkeby-explorer.arbitrum.io/block/${data}`
  //     default:
  //       return `https://rinkeby-explorer.arbitrum.io/`
  //   }
  // }

  const prefix = BLOCK_EXPLORER_PREFIXES[chainId] ?? 'https://etherscan.io';

  switch (type) {
    case ExplorerDataType.TRANSACTION:
      return `${prefix}/tx/${data}`;

    case ExplorerDataType.TOKEN:
      return `${prefix}/token/${data}`;

    case ExplorerDataType.BLOCK:
      // if (chainId === SupportedChainId.OPTIMISM || chainId === SupportedChainId.OPTIMISTIC_KOVAN) {
      //   return `${prefix}/tx/${data}`
      // }
      return `${prefix}/block/${data}`;

    case ExplorerDataType.ADDRESS:
      return `${prefix}/address/${data}`;
    default:
      return `${prefix}`;
  }
}
