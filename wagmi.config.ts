import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';
import { Abi } from 'viem';
import { erc20ABI } from 'wagmi';

import DibsABI from './src/abis/dibs.json';
import DibsSharesABI from './src/abis/dibsshares.json';
import MuonInterfaceABI from './src/abis/muonInterface.json';
import PairRewarderABI from './src/abis/pairRewarder.json';
import pairRewarderFactoryABI from './src/abis/pairRewarderFactory.json';
import UniswapV2PairABI from './src/abis/uniswapV2Pair.json';

export default defineConfig({
  out: 'src/abis/types/generated.ts',
  contracts: [
    {
      name: 'erc20',
      abi: erc20ABI,
    },
    {
      name: 'Dibs',
      abi: DibsABI as Abi,
    },
    {
      name: 'DibsShares',
      abi: DibsSharesABI as Abi,
    },
    {
      name: 'MuonInterface',
      abi: MuonInterfaceABI as Abi,
    },
    {
      name: 'PairRewarder',
      abi: PairRewarderABI as Abi,
    },
    {
      name: 'pairRewarderFactory',
      abi: pairRewarderFactoryABI as Abi,
    },
    {
      name: 'UniswapV2Pair',
      abi: UniswapV2PairABI as Abi,
    },
  ],
  plugins: [react()],
});
