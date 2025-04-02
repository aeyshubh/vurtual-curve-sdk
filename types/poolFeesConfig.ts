/**
 * This code was AUTOGENERATED using the codama library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun codama to update it.
 *
 * @see https://github.com/codama-idl/codama
 */

import {
  combineCodec,
  fixDecoderSize,
  fixEncoderSize,
  getArrayDecoder,
  getArrayEncoder,
  getBytesDecoder,
  getBytesEncoder,
  getStructDecoder,
  getStructEncoder,
  getU64Decoder,
  getU64Encoder,
  getU8Decoder,
  getU8Encoder,
  type Codec,
  type Decoder,
  type Encoder,
  type ReadonlyUint8Array,
} from '@solana/kit';
import {
  getBaseFeeConfigDecoder,
  getBaseFeeConfigEncoder,
  getDynamicFeeConfigDecoder,
  getDynamicFeeConfigEncoder,
  type BaseFeeConfig,
  type BaseFeeConfigArgs,
  type DynamicFeeConfig,
  type DynamicFeeConfigArgs,
} from '.';

export type PoolFeesConfig = {
  baseFee: BaseFeeConfig;
  dynamicFee: DynamicFeeConfig;
  padding0: Array<bigint>;
  padding1: ReadonlyUint8Array;
  protocolFeePercent: number;
  referralFeePercent: number;
};

export type PoolFeesConfigArgs = {
  baseFee: BaseFeeConfigArgs;
  dynamicFee: DynamicFeeConfigArgs;
  padding0: Array<number | bigint>;
  padding1: ReadonlyUint8Array;
  protocolFeePercent: number;
  referralFeePercent: number;
};

export function getPoolFeesConfigEncoder(): Encoder<PoolFeesConfigArgs> {
  return getStructEncoder([
    ['baseFee', getBaseFeeConfigEncoder()],
    ['dynamicFee', getDynamicFeeConfigEncoder()],
    ['padding0', getArrayEncoder(getU64Encoder(), { size: 5 })],
    ['padding1', fixEncoderSize(getBytesEncoder(), 6)],
    ['protocolFeePercent', getU8Encoder()],
    ['referralFeePercent', getU8Encoder()],
  ]);
}

export function getPoolFeesConfigDecoder(): Decoder<PoolFeesConfig> {
  return getStructDecoder([
    ['baseFee', getBaseFeeConfigDecoder()],
    ['dynamicFee', getDynamicFeeConfigDecoder()],
    ['padding0', getArrayDecoder(getU64Decoder(), { size: 5 })],
    ['padding1', fixDecoderSize(getBytesDecoder(), 6)],
    ['protocolFeePercent', getU8Decoder()],
    ['referralFeePercent', getU8Decoder()],
  ]);
}

export function getPoolFeesConfigCodec(): Codec<
  PoolFeesConfigArgs,
  PoolFeesConfig
> {
  return combineCodec(getPoolFeesConfigEncoder(), getPoolFeesConfigDecoder());
}
