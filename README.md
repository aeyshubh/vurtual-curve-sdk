# Virtual Curve TypeScript SDK

This SDK provides a TypeScript interface for interacting with the Virtual Curve program on Solana.

## Development

To build the SDK:
```bash
yarn build
```

To run tests:
```bash
yarn test
```

## Usage

```typescript
import { Connection, PublicKey } from '@solana/web3.js';
import { VirtualCurveSDK } from '@virtual-curve/sdk';
import { type TransactionSigner, type Address } from '@solana/kit';

// Initialize the SDK
const connection = new Connection('https://api.devnet.solana.com');
const programId = new PublicKey('virwvN4ee9tWmGoT37FdxZMmxH54m64sYzPpBvXA3ZV');
const sdk = new VirtualCurveSDK(connection, programId);

// Create a new configuration
const configTx = await sdk.createConfig({
    authority: authorityKeypair as TransactionSigner<string>,
    quoteMint: quoteMintAddress as Address<string>,
    poolFeeParameters: {
        baseFee: {
            cliffFeeNumerator: BigInt(0),
            numberOfPeriod: 1,
            periodFrequency: BigInt(0),
            reductionFactor: BigInt(0),
            feeSchedulerMode: 0
        },
        dynamicFee: null
    },
    collectFeeMode: 0,
    migrationOption: 0,
    activationType: 0,
    tokenType: 0,
    tokenDecimal: 6,
    creatorPostMigrationFeePercentage: 0,
    migrationQuoteThreshold: 0,
    sqrtStartPrice: 0,
    padding: [BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0)],
    liquidityDistributionParameters: [{
        sqrtPrice: BigInt(0),
        liquidity: BigInt(0)
    }]
});

// Create a new pool
const poolTx = await sdk.createPool({
    config: configAddress as Address<string>,
    tokenA: tokenAAddress as Address<string>,
    tokenB: tokenBAddress as Address<string>,
    authority: authorityKeypair as TransactionSigner<string>,
    initialLiquidityProvider: providerKeypair as TransactionSigner<string>,
    initialTokenAAmount: 1000000,
    initialTokenBAmount: 1000000
});

// Get swap quote
const quote = sdk.swapQuote({
    config: 'config_address',
    pool: 'pool_address',
    userTokenAccount: 'user_token_account',
    baseVault: 'base_vault_address',
    quoteVault: 'quote_vault_address',
    tokenA: 'token_a_address',
    tokenB: 'token_b_address',
    tokenProgram: 'token_program_address',
    authority: 'authority_address',
    tokenAAmount: 1000000,
    tokenBAmount: 0,
    slippageTolerance: 1, // 1%
    isExactIn: true
});

// Execute swap
const swapTx = await sdk.swap({
    config: 'config_address',
    pool: 'pool_address',
    userTokenAccount: 'user_token_account',
    baseVault: 'base_vault_address',
    quoteVault: 'quote_vault_address',
    tokenA: 'token_a_address',
    tokenB: 'token_b_address',
    tokenProgram: 'token_program_address',
    authority: 'authority_address',
    tokenAAmount: 1000000,
    tokenBAmount: 0,
    slippageTolerance: 1,
    isExactIn: true
});

```
#### Constructor
```typescript
constructor(connection: Connection, programId: PublicKey)
```

#### Methods

##### createConfig
Creates a new configuration for the Virtual Curve program.
```typescript
async createConfig(params: CreateConfigParams): Promise<Transaction>
```

##### createPool
Creates a new pool within the Virtual Curve program.
```typescript
async createPool(params: CreatePoolParams): Promise<Transaction>
```

##### swapQuote
Calculates swap quotation.
```typescript
swapQuote(params: SwapParams): { swapOutAmount: BN; minSwapOutAmount: BN }
```

##### swap
Executes a swap within the pool.
```typescript
async swap(params: SwapParams): Promise<Transaction>
```

## Types

### CreateConfigParams
```typescript
interface CreateConfigParams {
    authority: Address<string>;
    quoteMint: Address<string>;
    poolFeeParameters: PoolFeeParamtersArgs;
    collectFeeMode: number;
    migrationOption: number;
    activationType: number;
    tokenType: number;
    tokenDecimal: number;
    creatorPostMigrationFeePercentage: number;
    migrationQuoteThreshold: number | bigint;
    sqrtStartPrice: number | bigint;
    padding: Array<number | bigint>;
    liquidityDistributionParameters: Array<LiquidityDistributionParametersArgs>;
}
```

### CreatePoolParams
```typescript
interface CreatePoolParams {
    config: Address<string>;
    tokenA: Address<string>;
    tokenB: Address<string>;
    authority: Address<string>;
    initialLiquidityProvider: Address<string>;
    initialTokenAAmount: number | bigint;
    initialTokenBAmount: number | bigint;
}
```

### SwapParams
```typescript
interface SwapParams {
    config: Address<string>;
    pool: Address<string>;
    userTokenAccount: Address<string>;
    baseVault: Address<string>;
    quoteVault: Address<string>;
    tokenA: Address<string>;
    tokenB: Address<string>;
    tokenProgram: Address<string>;
    authority: Address<string>;
    tokenAAmount: number | bigint;
    tokenBAmount: number | bigint;
    slippageTolerance: number;
    isExactIn: boolean;
}
```
