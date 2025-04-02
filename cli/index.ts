#!/usr/bin/env node
import { Command } from 'commander';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { VirtualCurveSDK } from '../VirtualCurveSDK';
import { Address, TransactionSigner } from '@solana/kit';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  const envVars = envConfig.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {} as Record<string, string>);
  
  process.env = { ...process.env, ...envVars };
}

const program = new Command();

program
  .version('0.1.0')
  .description('CLI for Virtual Curve SDK');

program
  .command('create-config')
  .description('Create a new Virtual Curve configuration')
  .option('-a, --authority <keypair>', 'Authority keypair file path (or set AUTHORITY_KEYPAIR in .env)')
  .requiredOption('-q, --quote-mint <address>', 'Quote mint address')
  .option('-f, --fee <number>', 'Pool fee percentage', '0.3')
  .option('-m, --mode <number>', 'Collect fee mode', '0')
  .option('-o, --option <number>', 'Migration option', '0')
  .option('-t, --type <number>', 'Token type', '0')
  .option('-d, --decimal <number>', 'Token decimal', '6')
  .option('-p, --post-fee <number>', 'Post migration fee percentage', '0')
  .option('--threshold <number>', 'Migration quote threshold', '0')
  .option('--sqrt-price <number>', 'Square root start price', '1')
  .action(async (options) => {
    try {
      const connection = new Connection('https://api.devnet.solana.com');
      const sdk = new VirtualCurveSDK(connection, new PublicKey('virwvN4ee9tWmGoT37FdxZMmxH54m64sYzPpBvXA3ZV'));
      
      let authorityKeypair: Keypair;
      if (process.env.AUTHORITY_KEYPAIR) {
        authorityKeypair = Keypair.fromSecretKey(
          Uint8Array.from(
            JSON.parse(process.env.AUTHORITY_KEYPAIR)
          )
        );
      } else if (options.authority) {
        authorityKeypair = Keypair.fromSecretKey(
          Buffer.from(JSON.parse(require('fs').readFileSync(options.authority, 'utf-8')))
        );
      } else {
        throw new Error('No authority keypair provided in .env or command line');
      }

      const tx = await sdk.createConfig({
        authority: authorityKeypair as unknown as TransactionSigner<string>,
        quoteMint: options.quoteMint as Address<string>,
        poolFeeParameters: {
          baseFee: {
            cliffFeeNumerator: BigInt(Math.floor(Number(options.fee) * 1e9)),
            numberOfPeriod: 1,
            periodFrequency: BigInt(0),
            reductionFactor: BigInt(0),
            feeSchedulerMode: 0
          },
          dynamicFee: null
        },
        collectFeeMode: Number(options.mode),
        migrationOption: Number(options.option),
        activationType: 0,
        tokenType: Number(options.type),
        tokenDecimal: Number(options.decimal),
        creatorPostMigrationFeePercentage: Number(options.postFee),
        migrationQuoteThreshold: BigInt(options.threshold),
        sqrtStartPrice: BigInt(options.sqrtPrice),
        padding: [0, 0, 0, 0, 0, 0],
        liquidityDistributionParameters: [
          {
            sqrtPrice: BigInt(1e9),
            liquidity: BigInt(1e9)
          }
        ]
      });

      console.log('Configuration transaction created successfully');
    } catch (error) {
      console.error('Error:', error);
    }
  });

program
  .command('create-pool')
  .description('Create a new Virtual Curve pool')
  .requiredOption('-c, --config <address>', 'Config address')
  .option('-a, --authority <keypair>', 'Authority keypair file path (or set AUTHORITY_KEYPAIR in .env)')
  .requiredOption('--token-a <address>', 'Token A mint address')
  .requiredOption('--token-b <address>', 'Token B mint address')
  .requiredOption('-p, --provider <keypair>', 'Initial liquidity provider keypair file path')
  .requiredOption('--amount-a <number>', 'Initial token A amount')
  .requiredOption('--amount-b <number>', 'Initial token B amount')
  .action(async (options) => {
    try {
      const connection = new Connection('https://api.devnet.solana.com');
      const sdk = new VirtualCurveSDK(connection, new PublicKey('virwvN4ee9tWmGoT37FdxZMmxH54m64sYzPpBvXA3ZV'));
      
      let authorityKeypair: Keypair;
      if (process.env.AUTHORITY_KEYPAIR) {
        authorityKeypair = Keypair.fromSecretKey(
          Uint8Array.from(
            JSON.parse(process.env.AUTHORITY_KEYPAIR)
          )
        );
      } else if (options.authority) {
        authorityKeypair = Keypair.fromSecretKey(
          Buffer.from(JSON.parse(require('fs').readFileSync(options.authority, 'utf-8')))
        );
      } else {
        throw new Error('No authority keypair provided in .env or command line');
      }
      
      const providerKeypair = Keypair.fromSecretKey(
        Buffer.from(JSON.parse(require('fs').readFileSync(options.provider, 'utf-8')))
      );

      const tx = await sdk.createPool({
        config: options.config as Address<string>,
        tokenA: options.tokenA as Address<string>,
        tokenB: options.tokenB as Address<string>,
        authority: authorityKeypair as unknown as TransactionSigner<string>,
        initialLiquidityProvider: providerKeypair as unknown as TransactionSigner<string>,
        initialTokenAAmount: BigInt(options.amountA),
        initialTokenBAmount: BigInt(options.amountB)
      });

      console.log('Pool creation transaction created successfully');
    } catch (error) {
      console.error('Error:', error);
    }
  });

program
  .command('swap')
  .description('Execute a swap')
  .requiredOption('-c, --config <address>', 'Config address')
  .requiredOption('-p, --pool <address>', 'Pool address')
  .option('-a, --authority <keypair>', 'Authority keypair file path (or set AUTHORITY_KEYPAIR in .env)')
  .requiredOption('--user-token <address>', 'User token account')
  .requiredOption('--base-vault <address>', 'Base vault address')
  .requiredOption('--quote-vault <address>', 'Quote vault address')
  .requiredOption('--token-a <address>', 'Token A mint address')
  .requiredOption('--token-b <address>', 'Token B mint address')
  .requiredOption('--token-program <address>', 'Token program address')
  .requiredOption('--amount-a <number>', 'Token A amount')
  .requiredOption('--amount-b <number>', 'Token B amount')
  .requiredOption('-s, --slippage <number>', 'Slippage tolerance percentage')
  .requiredOption('--exact-in <boolean>', 'Is exact input')
  .action(async (options) => {
    try {
      const connection = new Connection('https://api.devnet.solana.com');
      const sdk = new VirtualCurveSDK(connection, new PublicKey('virwvN4ee9tWmGoT37FdxZMmxH54m64sYzPpBvXA3ZV'));
      
      let authorityKeypair: Keypair;
      if (process.env.AUTHORITY_KEYPAIR) {
        authorityKeypair = Keypair.fromSecretKey(
          Uint8Array.from(
            JSON.parse(process.env.AUTHORITY_KEYPAIR)
          )
        );
      } else if (options.authority) {
        authorityKeypair = Keypair.fromSecretKey(
          Buffer.from(JSON.parse(require('fs').readFileSync(options.authority, 'utf-8')))
        );
      } else {
        throw new Error('No authority keypair provided in .env or command line');
      }

      const tx = await sdk.swap({
        config: options.config as Address<string>,
        pool: options.pool as Address<string>,
        userTokenAccount: authorityKeypair as unknown as TransactionSigner<string>,
        baseVault: options.baseVault as Address<string>,
        quoteVault: options.quoteVault as Address<string>,
        tokenA: options.tokenA as Address<string>,
        tokenB: options.tokenB as Address<string>,
        tokenProgram: options.tokenProgram as Address<string>,
        authority: authorityKeypair as unknown as TransactionSigner<string>,
        tokenAAmount: BigInt(options.amountA),
        tokenBAmount: BigInt(options.amountB),
        slippageTolerance: Number(options.slippage),
        isExactIn: options.exactIn === 'true'
      });

      console.log('Swap transaction created successfully');
    } catch (error) {
      console.error('Error:', error);
    }
  });

program.parse(process.argv);
