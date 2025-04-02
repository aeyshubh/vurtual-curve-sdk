import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { VirtualCurveSDK } from '../VirtualCurveSDK';
import BN from 'bn.js';
import { type Address, type TransactionSigner } from '@solana/kit';

describe('VirtualCurveSDK', () => {
    let sdk: VirtualCurveSDK;
    let connection: Connection;
    let programId: PublicKey;

    beforeEach(() => {
        connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        programId = new PublicKey('virwvN4ee9tWmGoT37FdxZMmxH54m64sYzPpBvXA3ZV');
        sdk = new VirtualCurveSDK(connection, programId);
    });

    describe('createConfig', () => {
        it('should create a config transaction', async () => {
            const authority = Keypair.generate() as unknown as TransactionSigner<string>;
            const quoteMint = Keypair.generate().publicKey.toString() as Address<string>;

            const tx = await sdk.createConfig({
                authority,
                quoteMint,
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
            // Transaction created
            expect(tx).toBeInstanceOf(Transaction);
            expect(tx.instructions).toHaveLength(1);
        });
    });

    describe('createPool', () => {
        it('should create a pool transaction', async () => {
            const config = Keypair.generate().publicKey.toString() as Address<string>;
            const tokenA = Keypair.generate().publicKey.toString() as Address<string>;
            const tokenB = Keypair.generate().publicKey.toString() as Address<string>;
            const authority = Keypair.generate() as unknown as TransactionSigner<string>;
            const initialLiquidityProvider = Keypair.generate() as unknown as TransactionSigner<string>;

            const tx = await sdk.createPool({
                config,
                tokenA,
                tokenB,
                authority,
                initialLiquidityProvider,
                initialTokenAAmount: 1000000,
                initialTokenBAmount: 1000000
            });
            // Transaction created

            expect(tx).toBeInstanceOf(Transaction);
            expect(tx.instructions).toHaveLength(1);
        });
    });

    describe('swapQuote', () => {
        it('should calculate swap quote', () => {
            const config = Keypair.generate().publicKey.toString() as Address<string>;
            const pool = Keypair.generate().publicKey.toString() as Address<string>;
            const userTokenAccount = Keypair.generate() as unknown as TransactionSigner<string>;
            const baseVault = Keypair.generate().publicKey.toString() as Address<string>;
            const quoteVault = Keypair.generate().publicKey.toString() as Address<string>;
            const tokenA = Keypair.generate().publicKey.toString() as Address<string>;
            const tokenB = Keypair.generate().publicKey.toString() as Address<string>;
            const tokenProgram = Keypair.generate().publicKey.toString() as Address<string>;
            const authority = Keypair.generate() as unknown as TransactionSigner<string>;

            const quote = sdk.swapQuote({
                config,
                pool,
                userTokenAccount,
                baseVault,
                quoteVault,
                tokenA,
                tokenB,
                tokenProgram,
                authority,
                tokenAAmount: 1000000,
                tokenBAmount: 0,
                slippageTolerance: 1,
                isExactIn: true
            });

            expect(quote.swapOutAmount).toBeInstanceOf(BN);
            expect(quote.minSwapOutAmount).toBeInstanceOf(BN);
            expect(quote.swapOutAmount.gt(quote.minSwapOutAmount)).toBe(true);
        });
    });

    describe('swap', () => {
        it('should create a swap transaction', async () => {
            const config = Keypair.generate().publicKey.toString() as Address<string>;
            const pool = Keypair.generate().publicKey.toString() as Address<string>;
            const userTokenAccount = Keypair.generate() as unknown as TransactionSigner<string>;
            const baseVault = Keypair.generate().publicKey.toString() as Address<string>;
            const quoteVault = Keypair.generate().publicKey.toString() as Address<string>;
            const tokenA = Keypair.generate().publicKey.toString() as Address<string>;
            const tokenB = Keypair.generate().publicKey.toString() as Address<string>;
            const tokenProgram = Keypair.generate().publicKey.toString() as Address<string>;
            const authority = Keypair.generate() as unknown as TransactionSigner<string>;

            const tx = await sdk.swap({
                config,
                pool,
                userTokenAccount,
                baseVault,
                quoteVault,
                tokenA,
                tokenB,
                tokenProgram,
                authority,
                tokenAAmount: 1000000,
                tokenBAmount: 0,
                slippageTolerance: 1,
                isExactIn: true
            });

            expect(tx).toBeInstanceOf(Transaction);
            expect(tx.instructions).toHaveLength(1);
        });
    });
});
