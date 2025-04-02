import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import BN from 'bn.js';
import { CreateConfigParams, CreatePoolParams, SwapParams } from './types';
import { getCreateConfigInstruction } from './instructions/createConfig';
import { getSwapInstruction } from './instructions/swap';
import { getInitializeVirtualPoolWithSplTokenInstruction } from './instructions/initializeVirtualPoolWithSplToken';
import { VIRTUAL_CURVE_PROGRAM_ADDRESS } from './programs';
import { type Address, type TransactionSigner } from '@solana/kit';

export class VirtualCurveSDK {
    private connection: Connection;
    private programId: PublicKey;

    constructor(connection: Connection, programId: PublicKey) {
        this.connection = connection;
        this.programId = programId;
    }

    /**
     * Creates a new configuration for the Virtual Curve program
     * @param params Configuration parameters
     * @returns Promise resolving to the configuration creation transaction
     */
    async createConfig(params: CreateConfigParams): Promise<Transaction> {
        const transaction = new Transaction();
        
        const configKeypair = Keypair.generate();
        
        const instruction = getCreateConfigInstruction({
            config: configKeypair as unknown as TransactionSigner<string>,
            feeClaimer: params.authority.address,
            owner: params.authority.address,
            quoteMint: params.quoteMint,
            payer: configKeypair as unknown as TransactionSigner<string>,
            eventAuthority: params.authority.address,
            program: VIRTUAL_CURVE_PROGRAM_ADDRESS as Address<string>,
            poolFees: params.poolFeeParameters,
            collectFeeMode: params.collectFeeMode,
            migrationOption: params.migrationOption,
            activationType: params.activationType,
            tokenType: params.tokenType,
            tokenDecimal: params.tokenDecimal,
            creatorPostMigrationFeePercentage: params.creatorPostMigrationFeePercentage,
            migrationQuoteThreshold: params.migrationQuoteThreshold,
            sqrtStartPrice: params.sqrtStartPrice,
            padding: params.padding || [],
            curve: params.liquidityDistributionParameters || []
        });
        
        transaction.add(instruction as unknown as TransactionInstruction);
        return transaction;
    }

    /**
     * Creates a new pool within the Virtual Curve program
     * @param params Pool creation parameters
     * @returns Promise resolving to the pool creation transaction
     */
    async createPool(params: CreatePoolParams): Promise<Transaction> {
        const transaction = new Transaction();
        
        const poolKeypair = Keypair.generate();
        
        const [tokenAVault] = await PublicKey.findProgramAddress(
            [Buffer.from('token-a-vault'), poolKeypair.publicKey.toBuffer()],
            new PublicKey(VIRTUAL_CURVE_PROGRAM_ADDRESS)
        );

        const [tokenBVault] = await PublicKey.findProgramAddress(
            [Buffer.from('token-b-vault'), poolKeypair.publicKey.toBuffer()],
            new PublicKey(VIRTUAL_CURVE_PROGRAM_ADDRESS)
        );

        const instruction = getInitializeVirtualPoolWithSplTokenInstruction({
            pool: poolKeypair.publicKey.toString() as Address<string>,
            config: params.config,
            poolAuthority: params.authority.address,
            creator: params.authority.address,
            baseMint: params.tokenA as unknown as TransactionSigner<string>,
            quoteMint: params.tokenB,
            baseVault: tokenAVault.toString() as Address<string>,
            quoteVault: tokenBVault.toString() as Address<string>,
            mintMetadata: poolKeypair.publicKey.toString() as Address<string>,
            payer: params.initialLiquidityProvider,
            tokenQuoteProgram: VIRTUAL_CURVE_PROGRAM_ADDRESS as Address<string>,
            eventAuthority: params.authority.address,
            program: VIRTUAL_CURVE_PROGRAM_ADDRESS as Address<string>,
            params: {
                name: 'Virtual Curve Pool',
                symbol: 'VCP',
                uri: ''
            }
        });
        
        transaction.add(instruction as unknown as TransactionInstruction);
        return transaction;
    }

    /**
     * Calculates swap quotation
     * @param params Swap parameters
     * @returns Object containing swap out amount and minimum swap out amount
     */
    swapQuote(params: SwapParams): { swapOutAmount: BN; minSwapOutAmount: BN } {
        // Note: This is a simplified calculation. The actual calculation should be implemented
        // based on your specific curve formula and pool state
        const inputAmount = new BN(params.isExactIn ? params.tokenAAmount.toString() : params.tokenBAmount.toString());
        
        // Example calculation (this should be replaced with actual curve math)
        const swapOutAmount = inputAmount.mul(new BN(98)).div(new BN(100)); // Assuming 2% fee
        const minSwapOutAmount = swapOutAmount.mul(new BN(100 - params.slippageTolerance)).div(new BN(100));
        
        return {
            swapOutAmount,
            minSwapOutAmount
        };
    }

    /**
     * Executes a swap within the pool
     * @param params Swap parameters
     * @returns Promise resolving to the swap transaction
     */
    async swap(params: SwapParams): Promise<Transaction> {
        const transaction = new Transaction();
        
        const { swapOutAmount, minSwapOutAmount } = this.swapQuote(params);
        
        const instruction = getSwapInstruction({
            poolAuthority: params.pool,
            config: params.config,
            pool: params.pool,
            inputTokenAccount: params.userTokenAccount.address,
            outputTokenAccount: params.userTokenAccount.address, // This should be the correct output token account
            baseVault: params.baseVault,
            quoteVault: params.quoteVault,
            baseMint: params.tokenA,
            quoteMint: params.tokenB,
            payer: params.userTokenAccount,
            tokenBaseProgram: params.tokenProgram,
            tokenQuoteProgram: params.tokenProgram,
            eventAuthority: params.authority.address,
            program: VIRTUAL_CURVE_PROGRAM_ADDRESS as Address<string>,
            params: {
                amountIn: BigInt(params.tokenAAmount),
                minimumAmountOut: BigInt(minSwapOutAmount.toString())
            }
        });
        
        transaction.add(instruction as unknown as TransactionInstruction);
        return transaction;
    }
}
