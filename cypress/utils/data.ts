import { BigNumber } from '@ethersproject/bignumber';
import { Wallet } from '@ethersproject/wallet';
import { DailyDataForPairQuery, UserVolumeDataQuery } from 'apollo/__generated__/graphql';
import { DibsAddressMap } from 'constants/addresses';

import { IPairRewarder } from './mock-contracts/types/PairRewarder';

export const TEST_PRIVATE_KEY = '0xe580410d7c37d26c6ad1a837bbae46bc27f9066a466fb3a66e770523b4666d19';
export const TEST_ADDRESS_NEVER_USE = new Wallet(TEST_PRIVATE_KEY).address.toLowerCase();
export const TOKEN_BALANCE = BigNumber.from(10).pow(16);

export const UWU_ADDRESS = '0x05d35769a222affd6185e20f3f3676abde56c25f'; // token0
export const WETH_ADDRESS = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1'; // token1
export const ARBITRUM_CHAIN_ID = 42161; // arbitrum
export const chainId = ARBITRUM_CHAIN_ID; // arbitrum
export const DibsContractAddresses = {
  dibs: DibsAddressMap[chainId],
  pairRewarderFactory: '0xc9031a1703d2f50cd7c515799370584590f98a1e',
  muonInterface: '0xe00d3b7f25baf1b35f6a2e783560d9fd840e5563',
  dibsLottery: '0x42d4ea7cc64d420d227e4fa820885681b2d3a6c6',
};

export const testPairAddress = '0x46e26733aa90bd74fd6a56e1894c10b4457fa0d0';
export const testPairRewarderIsSetterAddress = '0x21DAcb323a7a23E8B70BA96f2D472bbA92A94D9c';
export const testPairRewarderIsNotSetterAddress = '0x730867fdf227Ba72503AA8154e8c9628c3c0C100';
export const multicall3Address = {
  [ARBITRUM_CHAIN_ID]: '0xca11bde05977b3631167028862be2a173976ca11',
};
export const pairs = [testPairAddress];

export const pairRewarders = {
  [testPairAddress]: [testPairRewarderIsSetterAddress, testPairRewarderIsNotSetterAddress],
};
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const leaderBoardInfo = Object.assign(
  {
    winnersCount: BigNumber.from(1),
    rewardTokens: [WETH_ADDRESS],
    rewardAmounts: [[BigNumber.from(10)]],
  },
  [BigNumber.from(1), [WETH_ADDRESS], [[BigNumber.from(10)]]],
) as IPairRewarder.LeaderBoardInfoStructOutput;

export const leaderBoardWinners = Object.assign(
  {
    info: leaderBoardInfo,
    winners: [TEST_ADDRESS_NEVER_USE],
  },
  [leaderBoardInfo, [TEST_ADDRESS_NEVER_USE]],
) as IPairRewarder.LeaderBoardWinnersStructOutput;

export const TEST_DIBS_USER_1 = '0x6e40691a5ddc2cbc0f2f998ca686bdf6c777ee29';
export const TEST_DIBS_USER_2 = '0xf72f5473a9ea214cda72c12abfab1209635c6313';
export const TEST_DIBS_USER_3 = '0xcca62b006d5be43fb0c66c593618fde83798826c';

export const dibsCodeNames = {
  [TEST_DIBS_USER_1]: 'DIBS_USER_1',
  [TEST_DIBS_USER_2]: 'DIBS_USER_2',
  [TEST_DIBS_USER_3]: 'DIBS_USER_3',
};
export const dibsCodeNamesRegistered = {
  ...dibsCodeNames,
  [TEST_ADDRESS_NEVER_USE]: 'DIBS_ME',
};
export const userGeneratedVolumeData: {
  data: UserVolumeDataQuery;
} = {
  data: {
    dailyGeneratedVolumes: [
      {
        user: TEST_ADDRESS_NEVER_USE,
        day: 5,
        pair: testPairAddress,
        amountAsReferrer: '18327005718129500',
        __typename: 'DailyGeneratedVolume',
      },
      {
        user: TEST_ADDRESS_NEVER_USE,
        day: 10,
        pair: testPairAddress,
        amountAsReferrer: '5718129500',
        __typename: 'DailyGeneratedVolume',
      },
      {
        user: TEST_ADDRESS_NEVER_USE,
        day: 15,
        pair: testPairAddress,
        amountAsReferrer: '28327005718129500',
        __typename: 'DailyGeneratedVolume',
      },
    ],
  },
};
export const testPairDay20LeaderBoard: {
  data: DailyDataForPairQuery;
} = {
  data: {
    dailyGeneratedVolumes: [
      {
        user: TEST_ADDRESS_NEVER_USE,
        amountAsReferrer: '18327005718129500',
        __typename: 'DailyGeneratedVolume',
      },
      {
        user: TEST_DIBS_USER_1,
        amountAsReferrer: '10327005718129500',
        __typename: 'DailyGeneratedVolume',
      },
      {
        user: TEST_DIBS_USER_2,
        amountAsReferrer: '9327005718129500',
        __typename: 'DailyGeneratedVolume',
      },
    ],
  },
};
export const testPairDay21LeaderBoard: {
  data: DailyDataForPairQuery;
} = {
  data: {
    dailyGeneratedVolumes: [
      {
        user: TEST_DIBS_USER_1,
        amountAsReferrer: '18327005718129500',
        __typename: 'DailyGeneratedVolume',
      },
      {
        user: TEST_DIBS_USER_2,
        amountAsReferrer: '10327005718129500',
        __typename: 'DailyGeneratedVolume',
      },
      {
        user: TEST_ADDRESS_NEVER_USE,
        amountAsReferrer: '9327005718129500',
        __typename: 'DailyGeneratedVolume',
      },
    ],
  },
};
