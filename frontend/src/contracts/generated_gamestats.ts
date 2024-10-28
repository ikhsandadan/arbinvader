import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GameStats
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const gameStatsAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'admin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllUserStats',
    outputs: [
      {
        name: '',
        internalType: 'struct GameStats.UserStatsView[]',
        type: 'tuple[]',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'gamesPlayed', internalType: 'uint256', type: 'uint256' },
          { name: 'bestScore', internalType: 'uint256', type: 'uint256' },
          { name: 'spaceship', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getUserStats',
    outputs: [
      { name: 'gamesPlayed', internalType: 'uint256', type: 'uint256' },
      { name: 'bestScore', internalType: 'uint256', type: 'uint256' },
      { name: 'spaceship', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'score', internalType: 'uint256', type: 'uint256' },
      { name: 'newSpaceship', internalType: 'string', type: 'string' },
    ],
    name: 'saveGameSession',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'score',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'spaceship',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'GameSessionSaved',
  },
  { type: 'error', inputs: [], name: 'NotAuthorized' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GameStatsScript
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const gameStatsScriptAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'IS_SCRIPT',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'gameStats',
    outputs: [
      { name: '', internalType: 'contract GameStats', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'run',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'setUp',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GameStatsTest
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const gameStatsTestAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'IS_TEST',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'admin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeArtifacts',
    outputs: [
      {
        name: 'excludedArtifacts_',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeContracts',
    outputs: [
      {
        name: 'excludedContracts_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeSelectors',
    outputs: [
      {
        name: 'excludedSelectors_',
        internalType: 'struct StdInvariant.FuzzSelector[]',
        type: 'tuple[]',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeSenders',
    outputs: [
      {
        name: 'excludedSenders_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'failed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'game',
    outputs: [
      { name: '', internalType: 'contract GameStats', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'setUp',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetArtifactSelectors',
    outputs: [
      {
        name: 'targetedArtifactSelectors_',
        internalType: 'struct StdInvariant.FuzzArtifactSelector[]',
        type: 'tuple[]',
        components: [
          { name: 'artifact', internalType: 'string', type: 'string' },
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetArtifacts',
    outputs: [
      {
        name: 'targetedArtifacts_',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetContracts',
    outputs: [
      {
        name: 'targetedContracts_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetInterfaces',
    outputs: [
      {
        name: 'targetedInterfaces_',
        internalType: 'struct StdInvariant.FuzzInterface[]',
        type: 'tuple[]',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'artifacts', internalType: 'string[]', type: 'string[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetSelectors',
    outputs: [
      {
        name: 'targetedSelectors_',
        internalType: 'struct StdInvariant.FuzzSelector[]',
        type: 'tuple[]',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetSenders',
    outputs: [
      {
        name: 'targetedSenders_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testEmitGameSessionSavedEvent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testGetAllUserStats',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testGetStatsForNonExistentUser',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testInitialState',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testMultipleUsersWithMultipleSessions',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testSaveFirstGameSession',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testUpdateExistingUserStats',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'user1',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'user2',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'score',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'spaceship',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'GameSessionSaved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'log_address',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'int256[]',
        type: 'int256[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'log_bytes',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'log_bytes32',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'log_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'log_named_address',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'val',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'log_named_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'val',
        internalType: 'int256[]',
        type: 'int256[]',
        indexed: false,
      },
    ],
    name: 'log_named_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'val',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'log_named_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'log_named_bytes',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'log_named_bytes32',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'int256', type: 'int256', indexed: false },
      {
        name: 'decimals',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'log_named_decimal_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'decimals',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'log_named_decimal_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'log_named_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log_named_string',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'log_named_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log_string',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'log_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'logs',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IMulticall3
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iMulticall3Abi = [
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'returnData', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call3[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'allowFailure', internalType: 'bool', type: 'bool' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate3',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call3Value[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'allowFailure', internalType: 'bool', type: 'bool' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate3Value',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'blockAndAggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBasefee',
    outputs: [{ name: 'basefee', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'blockNumber', internalType: 'uint256', type: 'uint256' }],
    name: 'getBlockHash',
    outputs: [{ name: 'blockHash', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBlockNumber',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getChainId',
    outputs: [{ name: 'chainid', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockCoinbase',
    outputs: [{ name: 'coinbase', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockDifficulty',
    outputs: [{ name: 'difficulty', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockGasLimit',
    outputs: [{ name: 'gaslimit', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockTimestamp',
    outputs: [{ name: 'timestamp', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'getEthBalance',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLastBlockHash',
    outputs: [{ name: 'blockHash', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'requireSuccess', internalType: 'bool', type: 'bool' },
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'tryAggregate',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'requireSuccess', internalType: 'bool', type: 'bool' },
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'tryBlockAndAggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsAbi}__
 */
export const useReadGameStatsundefined = /*#__PURE__*/ createUseReadContract({
  abi: gameStatsAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsAbi}__ and `functionName` set to `"admin"`
 */
export const useReadGameStatsAdmin = /*#__PURE__*/ createUseReadContract({
  abi: gameStatsAbi,
  functionName: 'admin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsAbi}__ and `functionName` set to `"getAllUserStats"`
 */
export const useReadGameStatsGetAllUserStats =
  /*#__PURE__*/ createUseReadContract({
    abi: gameStatsAbi,
    functionName: 'getAllUserStats',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsAbi}__ and `functionName` set to `"getUserStats"`
 */
export const useReadGameStatsGetUserStats = /*#__PURE__*/ createUseReadContract(
  { abi: gameStatsAbi, functionName: 'getUserStats' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gameStatsAbi}__
 */
export const useWriteGameStatsundefined = /*#__PURE__*/ createUseWriteContract({
  abi: gameStatsAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gameStatsAbi}__ and `functionName` set to `"saveGameSession"`
 */
export const useWriteGameStatsSaveGameSession =
  /*#__PURE__*/ createUseWriteContract({
    abi: gameStatsAbi,
    functionName: 'saveGameSession',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gameStatsAbi}__
 */
export const useSimulateGameStatsundefined =
  /*#__PURE__*/ createUseSimulateContract({ abi: gameStatsAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gameStatsAbi}__ and `functionName` set to `"saveGameSession"`
 */
export const useSimulateGameStatsSaveGameSession =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gameStatsAbi,
    functionName: 'saveGameSession',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsAbi}__
 */
export const useWatchGameStatsundefined =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: gameStatsAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsAbi}__ and `eventName` set to `"GameSessionSaved"`
 */
export const useWatchGameStatsGameSessionSaved =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsAbi,
    eventName: 'GameSessionSaved',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsScriptAbi}__
 */
export const useReadGameStatsScriptundefined =
  /*#__PURE__*/ createUseReadContract({ abi: gameStatsScriptAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsScriptAbi}__ and `functionName` set to `"IS_SCRIPT"`
 */
export const useReadGameStatsScriptIsScript =
  /*#__PURE__*/ createUseReadContract({
    abi: gameStatsScriptAbi,
    functionName: 'IS_SCRIPT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsScriptAbi}__ and `functionName` set to `"gameStats"`
 */
export const useReadGameStatsScriptGameStats =
  /*#__PURE__*/ createUseReadContract({
    abi: gameStatsScriptAbi,
    functionName: 'gameStats',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gameStatsScriptAbi}__
 */
export const useWriteGameStatsScriptundefined =
  /*#__PURE__*/ createUseWriteContract({ abi: gameStatsScriptAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gameStatsScriptAbi}__ and `functionName` set to `"run"`
 */
export const useWriteGameStatsScriptRun = /*#__PURE__*/ createUseWriteContract({
  abi: gameStatsScriptAbi,
  functionName: 'run',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gameStatsScriptAbi}__ and `functionName` set to `"setUp"`
 */
export const useWriteGameStatsScriptSetUp =
  /*#__PURE__*/ createUseWriteContract({
    abi: gameStatsScriptAbi,
    functionName: 'setUp',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gameStatsScriptAbi}__
 */
export const useSimulateGameStatsScriptundefined =
  /*#__PURE__*/ createUseSimulateContract({ abi: gameStatsScriptAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gameStatsScriptAbi}__ and `functionName` set to `"run"`
 */
export const useSimulateGameStatsScriptRun =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gameStatsScriptAbi,
    functionName: 'run',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gameStatsScriptAbi}__ and `functionName` set to `"setUp"`
 */
export const useSimulateGameStatsScriptSetUp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gameStatsScriptAbi,
    functionName: 'setUp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsTestAbi}__
 */
export const useReadGameStatsTestundefined =
  /*#__PURE__*/ createUseReadContract({ abi: gameStatsTestAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"IS_TEST"`
 */
export const useReadGameStatsTestIsTest = /*#__PURE__*/ createUseReadContract({
  abi: gameStatsTestAbi,
  functionName: 'IS_TEST',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"admin"`
 */
export const useReadGameStatsTestAdmin = /*#__PURE__*/ createUseReadContract({
  abi: gameStatsTestAbi,
  functionName: 'admin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"excludeArtifacts"`
 */
export const useReadGameStatsTestExcludeArtifacts =
  /*#__PURE__*/ createUseReadContract({
    abi: gameStatsTestAbi,
    functionName: 'excludeArtifacts',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"excludeContracts"`
 */
export const useReadGameStatsTestExcludeContracts =
  /*#__PURE__*/ createUseReadContract({
    abi: gameStatsTestAbi,
    functionName: 'excludeContracts',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"excludeSelectors"`
 */
export const useReadGameStatsTestExcludeSelectors =
  /*#__PURE__*/ createUseReadContract({
    abi: gameStatsTestAbi,
    functionName: 'excludeSelectors',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"excludeSenders"`
 */
export const useReadGameStatsTestExcludeSenders =
  /*#__PURE__*/ createUseReadContract({
    abi: gameStatsTestAbi,
    functionName: 'excludeSenders',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"failed"`
 */
export const useReadGameStatsTestFailed = /*#__PURE__*/ createUseReadContract({
  abi: gameStatsTestAbi,
  functionName: 'failed',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"game"`
 */
export const useReadGameStatsTestGame = /*#__PURE__*/ createUseReadContract({
  abi: gameStatsTestAbi,
  functionName: 'game',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"targetArtifactSelectors"`
 */
export const useReadGameStatsTestTargetArtifactSelectors =
  /*#__PURE__*/ createUseReadContract({
    abi: gameStatsTestAbi,
    functionName: 'targetArtifactSelectors',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"targetArtifacts"`
 */
export const useReadGameStatsTestTargetArtifacts =
  /*#__PURE__*/ createUseReadContract({
    abi: gameStatsTestAbi,
    functionName: 'targetArtifacts',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"targetContracts"`
 */
export const useReadGameStatsTestTargetContracts =
  /*#__PURE__*/ createUseReadContract({
    abi: gameStatsTestAbi,
    functionName: 'targetContracts',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"targetInterfaces"`
 */
export const useReadGameStatsTestTargetInterfaces =
  /*#__PURE__*/ createUseReadContract({
    abi: gameStatsTestAbi,
    functionName: 'targetInterfaces',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"targetSelectors"`
 */
export const useReadGameStatsTestTargetSelectors =
  /*#__PURE__*/ createUseReadContract({
    abi: gameStatsTestAbi,
    functionName: 'targetSelectors',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"targetSenders"`
 */
export const useReadGameStatsTestTargetSenders =
  /*#__PURE__*/ createUseReadContract({
    abi: gameStatsTestAbi,
    functionName: 'targetSenders',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"user1"`
 */
export const useReadGameStatsTestUser1 = /*#__PURE__*/ createUseReadContract({
  abi: gameStatsTestAbi,
  functionName: 'user1',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"user2"`
 */
export const useReadGameStatsTestUser2 = /*#__PURE__*/ createUseReadContract({
  abi: gameStatsTestAbi,
  functionName: 'user2',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gameStatsTestAbi}__
 */
export const useWriteGameStatsTestundefined =
  /*#__PURE__*/ createUseWriteContract({ abi: gameStatsTestAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"setUp"`
 */
export const useWriteGameStatsTestSetUp = /*#__PURE__*/ createUseWriteContract({
  abi: gameStatsTestAbi,
  functionName: 'setUp',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"testEmitGameSessionSavedEvent"`
 */
export const useWriteGameStatsTestTestEmitGameSessionSavedEvent =
  /*#__PURE__*/ createUseWriteContract({
    abi: gameStatsTestAbi,
    functionName: 'testEmitGameSessionSavedEvent',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"testGetAllUserStats"`
 */
export const useWriteGameStatsTestTestGetAllUserStats =
  /*#__PURE__*/ createUseWriteContract({
    abi: gameStatsTestAbi,
    functionName: 'testGetAllUserStats',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"testGetStatsForNonExistentUser"`
 */
export const useWriteGameStatsTestTestGetStatsForNonExistentUser =
  /*#__PURE__*/ createUseWriteContract({
    abi: gameStatsTestAbi,
    functionName: 'testGetStatsForNonExistentUser',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"testInitialState"`
 */
export const useWriteGameStatsTestTestInitialState =
  /*#__PURE__*/ createUseWriteContract({
    abi: gameStatsTestAbi,
    functionName: 'testInitialState',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"testMultipleUsersWithMultipleSessions"`
 */
export const useWriteGameStatsTestTestMultipleUsersWithMultipleSessions =
  /*#__PURE__*/ createUseWriteContract({
    abi: gameStatsTestAbi,
    functionName: 'testMultipleUsersWithMultipleSessions',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"testSaveFirstGameSession"`
 */
export const useWriteGameStatsTestTestSaveFirstGameSession =
  /*#__PURE__*/ createUseWriteContract({
    abi: gameStatsTestAbi,
    functionName: 'testSaveFirstGameSession',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"testUpdateExistingUserStats"`
 */
export const useWriteGameStatsTestTestUpdateExistingUserStats =
  /*#__PURE__*/ createUseWriteContract({
    abi: gameStatsTestAbi,
    functionName: 'testUpdateExistingUserStats',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gameStatsTestAbi}__
 */
export const useSimulateGameStatsTestundefined =
  /*#__PURE__*/ createUseSimulateContract({ abi: gameStatsTestAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"setUp"`
 */
export const useSimulateGameStatsTestSetUp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gameStatsTestAbi,
    functionName: 'setUp',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"testEmitGameSessionSavedEvent"`
 */
export const useSimulateGameStatsTestTestEmitGameSessionSavedEvent =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gameStatsTestAbi,
    functionName: 'testEmitGameSessionSavedEvent',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"testGetAllUserStats"`
 */
export const useSimulateGameStatsTestTestGetAllUserStats =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gameStatsTestAbi,
    functionName: 'testGetAllUserStats',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"testGetStatsForNonExistentUser"`
 */
export const useSimulateGameStatsTestTestGetStatsForNonExistentUser =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gameStatsTestAbi,
    functionName: 'testGetStatsForNonExistentUser',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"testInitialState"`
 */
export const useSimulateGameStatsTestTestInitialState =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gameStatsTestAbi,
    functionName: 'testInitialState',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"testMultipleUsersWithMultipleSessions"`
 */
export const useSimulateGameStatsTestTestMultipleUsersWithMultipleSessions =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gameStatsTestAbi,
    functionName: 'testMultipleUsersWithMultipleSessions',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"testSaveFirstGameSession"`
 */
export const useSimulateGameStatsTestTestSaveFirstGameSession =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gameStatsTestAbi,
    functionName: 'testSaveFirstGameSession',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gameStatsTestAbi}__ and `functionName` set to `"testUpdateExistingUserStats"`
 */
export const useSimulateGameStatsTestTestUpdateExistingUserStats =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gameStatsTestAbi,
    functionName: 'testUpdateExistingUserStats',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__
 */
export const useWatchGameStatsTestundefined =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: gameStatsTestAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__ and `eventName` set to `"GameSessionSaved"`
 */
export const useWatchGameStatsTestGameSessionSaved =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsTestAbi,
    eventName: 'GameSessionSaved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__ and `eventName` set to `"log"`
 */
export const useWatchGameStatsTestLog =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsTestAbi,
    eventName: 'log',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__ and `eventName` set to `"log_address"`
 */
export const useWatchGameStatsTestLogAddress =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsTestAbi,
    eventName: 'log_address',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__ and `eventName` set to `"log_array"`
 */
export const useWatchGameStatsTestLogArray =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsTestAbi,
    eventName: 'log_array',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__ and `eventName` set to `"log_bytes"`
 */
export const useWatchGameStatsTestLogBytes =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsTestAbi,
    eventName: 'log_bytes',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__ and `eventName` set to `"log_bytes32"`
 */
export const useWatchGameStatsTestLogBytes32 =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsTestAbi,
    eventName: 'log_bytes32',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__ and `eventName` set to `"log_int"`
 */
export const useWatchGameStatsTestLogInt =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsTestAbi,
    eventName: 'log_int',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__ and `eventName` set to `"log_named_address"`
 */
export const useWatchGameStatsTestLogNamedAddress =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsTestAbi,
    eventName: 'log_named_address',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__ and `eventName` set to `"log_named_array"`
 */
export const useWatchGameStatsTestLogNamedArray =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsTestAbi,
    eventName: 'log_named_array',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__ and `eventName` set to `"log_named_bytes"`
 */
export const useWatchGameStatsTestLogNamedBytes =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsTestAbi,
    eventName: 'log_named_bytes',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__ and `eventName` set to `"log_named_bytes32"`
 */
export const useWatchGameStatsTestLogNamedBytes32 =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsTestAbi,
    eventName: 'log_named_bytes32',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__ and `eventName` set to `"log_named_decimal_int"`
 */
export const useWatchGameStatsTestLogNamedDecimalInt =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsTestAbi,
    eventName: 'log_named_decimal_int',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__ and `eventName` set to `"log_named_decimal_uint"`
 */
export const useWatchGameStatsTestLogNamedDecimalUint =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsTestAbi,
    eventName: 'log_named_decimal_uint',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__ and `eventName` set to `"log_named_int"`
 */
export const useWatchGameStatsTestLogNamedInt =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsTestAbi,
    eventName: 'log_named_int',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__ and `eventName` set to `"log_named_string"`
 */
export const useWatchGameStatsTestLogNamedString =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsTestAbi,
    eventName: 'log_named_string',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__ and `eventName` set to `"log_named_uint"`
 */
export const useWatchGameStatsTestLogNamedUint =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsTestAbi,
    eventName: 'log_named_uint',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__ and `eventName` set to `"log_string"`
 */
export const useWatchGameStatsTestLogString =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsTestAbi,
    eventName: 'log_string',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__ and `eventName` set to `"log_uint"`
 */
export const useWatchGameStatsTestLogUint =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsTestAbi,
    eventName: 'log_uint',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link gameStatsTestAbi}__ and `eventName` set to `"logs"`
 */
export const useWatchGameStatsTestLogs =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: gameStatsTestAbi,
    eventName: 'logs',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__
 */
export const useReadIMulticall3undefined = /*#__PURE__*/ createUseReadContract({
  abi: iMulticall3Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getBasefee"`
 */
export const useReadIMulticall3GetBasefee = /*#__PURE__*/ createUseReadContract(
  { abi: iMulticall3Abi, functionName: 'getBasefee' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getBlockHash"`
 */
export const useReadIMulticall3GetBlockHash =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getBlockHash',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getBlockNumber"`
 */
export const useReadIMulticall3GetBlockNumber =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getBlockNumber',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getChainId"`
 */
export const useReadIMulticall3GetChainId = /*#__PURE__*/ createUseReadContract(
  { abi: iMulticall3Abi, functionName: 'getChainId' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getCurrentBlockCoinbase"`
 */
export const useReadIMulticall3GetCurrentBlockCoinbase =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getCurrentBlockCoinbase',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getCurrentBlockDifficulty"`
 */
export const useReadIMulticall3GetCurrentBlockDifficulty =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getCurrentBlockDifficulty',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getCurrentBlockGasLimit"`
 */
export const useReadIMulticall3GetCurrentBlockGasLimit =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getCurrentBlockGasLimit',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getCurrentBlockTimestamp"`
 */
export const useReadIMulticall3GetCurrentBlockTimestamp =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getCurrentBlockTimestamp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getEthBalance"`
 */
export const useReadIMulticall3GetEthBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getEthBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getLastBlockHash"`
 */
export const useReadIMulticall3GetLastBlockHash =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getLastBlockHash',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__
 */
export const useWriteIMulticall3undefined =
  /*#__PURE__*/ createUseWriteContract({ abi: iMulticall3Abi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate"`
 */
export const useWriteIMulticall3Aggregate =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate3"`
 */
export const useWriteIMulticall3Aggregate3 =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate3',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate3Value"`
 */
export const useWriteIMulticall3Aggregate3Value =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate3Value',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"blockAndAggregate"`
 */
export const useWriteIMulticall3BlockAndAggregate =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'blockAndAggregate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"tryAggregate"`
 */
export const useWriteIMulticall3TryAggregate =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'tryAggregate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"tryBlockAndAggregate"`
 */
export const useWriteIMulticall3TryBlockAndAggregate =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'tryBlockAndAggregate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__
 */
export const useSimulateIMulticall3undefined =
  /*#__PURE__*/ createUseSimulateContract({ abi: iMulticall3Abi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate"`
 */
export const useSimulateIMulticall3Aggregate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate3"`
 */
export const useSimulateIMulticall3Aggregate3 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate3',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate3Value"`
 */
export const useSimulateIMulticall3Aggregate3Value =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate3Value',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"blockAndAggregate"`
 */
export const useSimulateIMulticall3BlockAndAggregate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'blockAndAggregate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"tryAggregate"`
 */
export const useSimulateIMulticall3TryAggregate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'tryAggregate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"tryBlockAndAggregate"`
 */
export const useSimulateIMulticall3TryBlockAndAggregate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'tryBlockAndAggregate',
  })
