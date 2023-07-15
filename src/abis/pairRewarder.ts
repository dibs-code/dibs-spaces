export default [
  { inputs: [], name: 'AlreadyClaimed', type: 'error' },
  {
    inputs: [],
    name: 'AlreadySet',
    type: 'error',
  },
  { inputs: [], name: 'DayNotOver', type: 'error' },
  {
    inputs: [],
    name: 'InvalidInput',
    type: 'error',
  },
  { inputs: [], name: 'NotWinner', type: 'error' },
  {
    inputs: [],
    name: 'OnlyMuonInterface',
    type: 'error',
  },
  { inputs: [], name: 'TooManyWinners', type: 'error' },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'uint8', name: 'version', type: 'uint8' }],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'winnersCount',
        type: 'uint256',
      },
      { indexed: false, internalType: 'address[]', name: 'rewardTokens', type: 'address[]' },
      {
        indexed: false,
        internalType: 'uint256[][]',
        name: 'rewardAmounts',
        type: 'uint256[][]',
      },
    ],
    name: 'LeaderBoardSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      { indexed: true, internalType: 'bytes32', name: 'newAdminRole', type: 'bytes32' },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SETTER_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'activeDay',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'day', type: 'uint256' },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'claimLeaderBoardReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'dibs',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user_', type: 'address' }],
    name: 'getUserLeaderBoardWins',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'hasRole',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'dibs_', type: 'address' },
      {
        internalType: 'address',
        name: 'pair_',
        type: 'address',
      },
      { internalType: 'address', name: 'admin_', type: 'address' },
      {
        internalType: 'address',
        name: 'setter_',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'leaderBoardInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'winnersCount',
            type: 'uint256',
          },
          { internalType: 'address[]', name: 'rewardTokens', type: 'address[]' },
          {
            internalType: 'uint256[][]',
            name: 'rewardAmounts',
            type: 'uint256[][]',
          },
        ],
        internalType: 'struct IPairRewarder.LeaderBoardInfo',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'day_', type: 'uint256' }],
    name: 'leaderBoardWinners',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'uint256',
                name: 'winnersCount',
                type: 'uint256',
              },
              { internalType: 'address[]', name: 'rewardTokens', type: 'address[]' },
              {
                internalType: 'uint256[][]',
                name: 'rewardAmounts',
                type: 'uint256[][]',
              },
            ],
            internalType: 'struct IPairRewarder.LeaderBoardInfo',
            name: 'info',
            type: 'tuple',
          },
          { internalType: 'address[]', name: 'winners', type: 'address[]' },
        ],
        internalType: 'struct IPairRewarder.LeaderBoardWinners',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pair',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'winnersCount_', type: 'uint256' },
      {
        internalType: 'address[]',
        name: 'rewardTokens_',
        type: 'address[]',
      },
      { internalType: 'uint256[][]', name: 'rewardAmounts_', type: 'uint256[][]' },
    ],
    name: 'setLeaderBoard',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'day', type: 'uint256' },
      {
        internalType: 'address[]',
        name: 'winners',
        type: 'address[]',
      },
    ],
    name: 'setTopReferrers',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'userLeaderBoardClaimedForDay',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'userLeaderBoardWins',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'userLeaderBoardWonOnDay',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
