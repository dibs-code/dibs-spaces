import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';
import { erc20ABI } from 'wagmi';

import DibsABI from './src/abis/dibs';
import DibsLotteryABI from './src/abis/dibsLottery';
import MuonInterfaceABI from './src/abis/muonInterface';

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
  ],
  plugins: [react()],
});
