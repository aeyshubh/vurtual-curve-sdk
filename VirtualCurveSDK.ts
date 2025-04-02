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
        const { blockhash } = await this.connection.getLatestBlockhash();
        const transaction = new Transaction({ recentBlockhash: blockhash });
        
        const configKeypair = Keypair.generate();
        transaction.feePayer = (params.authority as unknown as { publicKey: PublicKey }).publicKey;
        
        const instructionData = getCreateConfigInstruction({
            config: configKeypair as unknown as TransactionSigner<string>,
            feeClaimer: (params.authority as unknown as { publicKey: PublicKey }).publicKey.toString() as Address<string>,
            owner: (params.authority as unknown as { publicKey: PublicKey }).publicKey.toString() as Address<string>,
            quoteMint: params.quoteMint,
            payer: configKeypair as unknown as TransactionSigner<string>,
            eventAuthority: (params.authority as unknown as { publicKey: PublicKey }).publicKey.toString() as Address<string>,
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

        const instruction = new TransactionInstruction({
            keys: instructionData.accounts.map(acc => {
                if (typeof acc === 'string') {
                    return {
                        pubkey: new PublicKey(acc),
                        isSigner: false,
                        isWritable: false
                    };
                }
                if (acc instanceof Keypair) {
                    return {
                        pubkey: acc.publicKey,
                        isSigner: true,
                        isWritable: true
                    };
                }
                if ('publicKey' in acc && acc.publicKey instanceof PublicKey) {
                    return {
                        pubkey: acc.publicKey,
                        isSigner: true,
                        isWritable: true
                    };
                }
                if ('_keypair' in acc) {
                    const keypair = acc._keypair as { publicKey: Uint8Array };
                    if (keypair.publicKey instanceof Uint8Array) {
                        return {
                            pubkey: new PublicKey(keypair.publicKey),
                            isSigner: true,
                            isWritable: true
                        };
                    }
                }
                if ('address' in acc) {
                    const address = acc.address;
                    if (typeof address === 'object' && '_keypair' in address) {
                        const keypair = address as { _keypair: { publicKey: Uint8Array } };
                        return {
                            pubkey: new PublicKey(keypair._keypair.publicKey),
                            isSigner: true,
                            isWritable: true
                        };
                    }
                    if (typeof address === 'string') {
                        return {
                            pubkey: new PublicKey(address),
                            isSigner: false,
                            isWritable: false
                        };
                    }
                }
                throw new Error('Invalid account format');
            }),
            programId: new PublicKey(instructionData.programAddress),
            data: Buffer.from(instructionData.data)
        });
        
        transaction.add(instruction);
        const signer = params.authority as unknown as Keypair;
        transaction.partialSign(signer);
        if (configKeypair) {
            transaction.partialSign(configKeypair);
        }
        const txid = await this.connection.sendTransaction(transaction, [signer, configKeypair]);
        console.log('Create Config Transaction Hash:', txid);
        return transaction;
    }

    /**
     * Creates a new pool within the Virtual Curve program
     * @param params Pool creation parameters
     * @returns Promise resolving to the pool creation transaction
     */
    async createPool(params: CreatePoolParams): Promise<Transaction> {
        const { blockhash } = await this.connection.getLatestBlockhash();
        const transaction = new Transaction({ recentBlockhash: blockhash });
        
        const poolKeypair = Keypair.generate();
        transaction.feePayer = (params.authority as unknown as { publicKey: PublicKey }).publicKey;
        
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
        
        const txInstruction = new TransactionInstruction({
            keys: Object.entries(instruction.accounts).map(([_, account]) => {
                const address = (account as any).address;
                if (address && typeof address === 'object' && '_keypair' in address) {
                    return {
                        pubkey: new PublicKey(address._keypair.publicKey),
                        isSigner: true,
                        isWritable: true
                    };
                }
                return {
                    pubkey: new PublicKey(address),
                    isSigner: true,
                    isWritable: true
                };
            }),
            programId: this.programId,
            data: Buffer.from(instruction.data)
        });
        transaction.add(txInstruction);
        const signer = params.authority as unknown as Keypair;
        transaction.partialSign(signer);
        if (poolKeypair) {
            transaction.partialSign(poolKeypair);
        }
        const txid = await this.connection.sendTransaction(transaction, [signer, poolKeypair]);
        console.log('Create Pool Transaction Hash:', txid);
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
        const { blockhash } = await this.connection.getLatestBlockhash();
        const transaction = new Transaction({ recentBlockhash: blockhash });
        transaction.feePayer = (params.authority as unknown as { publicKey: PublicKey }).publicKey;
        
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
        
        const txInstruction = new TransactionInstruction({
            keys: Object.entries(instruction.accounts).map(([_, account]) => {
                const address = (account as any).address;
                if (address && typeof address === 'object' && '_keypair' in address) {
                    return {
                        pubkey: new PublicKey(address._keypair.publicKey),
                        isSigner: true,
                        isWritable: true
                    };
                }
                return {
                    pubkey: new PublicKey(address),
                    isSigner: true,
                    isWritable: true
                };
            }),
            programId: this.programId,
            data: Buffer.from(instruction.data)
        });
        transaction.add(txInstruction);
        const signer = params.authority as unknown as Keypair;
        transaction.partialSign(signer);
        const txid = await this.connection.sendTransaction(transaction, [signer]);
        console.log('Swap Transaction Hash:', txid);
        return transaction;
    }
}
