import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';
import { erc20ABI } from 'wagmi';

import DibsABI from './src/abis/dibs';
import DibsLotteryABI from './src/abis/dibsLottery';
import MuonInterfaceABI from './src/abis/muonInterface';
import PairRewarderABI from './src/abis/pairRewarder';
import pairRewarderFactoryABI from './src/abis/pairRewarderFactory';
import UniswapV2PairABI from './src/abis/uniswapV2Pair';

export default defineConfig({
  out: 'src/abis/types/generated.ts',
  contracts: [
    {
      name: 'erc20',
      abi: erc20ABI,
    },
    {
      name: 'Dibs',
      abi: DibsABI,
    },
    {
      name: 'DibsLottery',
      abi: DibsLotteryABI,
    },
    {
      name: 'MuonInterface',
      abi: MuonInterfaceABI,
    },
    {
      name: 'PairRewarderLeaderboard',
      abi: PairRewarderABI,
    },
    {
      name: 'pairRewarderFactory',
      abi: pairRewarderFactoryABI,
    },
    {
      name: 'UniswapV2Pair',
      abi: UniswapV2PairABI,
    },
  ],
  plugins: [react()],
});
