/**
 * This code was AUTOGENERATED using the codama library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun codama to update it.
 *
 * @see https://github.com/codama-idl/codama
 */

import {
  combineCodec,
  getStructDecoder,
  getStructEncoder,
  getU128Decoder,
  getU128Encoder,
  type Codec,
  type Decoder,
  type Encoder,
} from '@solana/kit';

export type LiquidityDistributionConfig = {
  sqrtPrice: bigint;
  liquidity: bigint;
};

export type LiquidityDistributionConfigArgs = {
  sqrtPrice: number | bigint;
  liquidity: number | bigint;
};

export function getLiquidityDistributionConfigEncoder(): Encoder<LiquidityDistributionConfigArgs> {
  return getStructEncoder([
    ['sqrtPrice', getU128Encoder()],
    ['liquidity', getU128Encoder()],
  ]);
}

export function getLiquidityDistributionConfigDecoder(): Decoder<LiquidityDistributionConfig> {
  return getStructDecoder([
    ['sqrtPrice', getU128Decoder()],
    ['liquidity', getU128Decoder()],
  ]);
}

export function getLiquidityDistributionConfigCodec(): Codec<
  LiquidityDistributionConfigArgs,
  LiquidityDistributionConfig
> {
  return combineCodec(
    getLiquidityDistributionConfigEncoder(),
    getLiquidityDistributionConfigDecoder()
  );
}
