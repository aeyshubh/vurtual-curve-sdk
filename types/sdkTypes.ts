import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { BaseFeeParameters } from './baseFeeParameters';
import { DynamicFeeParameters } from './dynamicFeeParameters';
import { LiquidityDistributionParameters, LiquidityDistributionParametersArgs } from './liquidityDistributionParameters';
import { PoolFeeParamters, PoolFeeParamtersArgs } from './poolFeeParamters';
import { type Address, type TransactionSigner } from '@solana/kit';

export interface CreateConfigParams {
    authority: TransactionSigner<string>;
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

export interface CreatePoolParams {
    config: Address<string>;
    tokenA: Address<string>;
    tokenB: Address<string>;
    authority: TransactionSigner<string>;
    initialLiquidityProvider: TransactionSigner<string>;
    initialTokenAAmount: number | bigint;
    initialTokenBAmount: number | bigint;
}

export interface SwapParams {
    config: Address<string>;
    pool: Address<string>;
    userTokenAccount: TransactionSigner<string>;
    baseVault: Address<string>;
    quoteVault: Address<string>;
    tokenA: Address<string>;
    tokenB: Address<string>;
    tokenProgram: Address<string>;
    authority: TransactionSigner<string>;
    tokenAAmount: number | bigint;
    tokenBAmount: number | bigint;
    slippageTolerance: number;
    isExactIn: boolean;
}
