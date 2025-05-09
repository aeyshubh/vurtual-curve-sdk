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
  getBytesDecoder,
  getBytesEncoder,
  getStructDecoder,
  getStructEncoder,
  getU16Decoder,
  getU16Encoder,
  getU64Decoder,
  getU64Encoder,
  getU8Decoder,
  getU8Encoder,
  type Codec,
  type Decoder,
  type Encoder,
  type ReadonlyUint8Array,
} from '@solana/kit';

export type BaseFeeStruct = {
  cliffFeeNumerator: bigint;
  feeSchedulerMode: number;
  padding0: ReadonlyUint8Array;
  numberOfPeriod: number;
  periodFrequency: bigint;
  reductionFactor: bigint;
  padding1: bigint;
};

export type BaseFeeStructArgs = {
  cliffFeeNumerator: number | bigint;
  feeSchedulerMode: number;
  padding0: ReadonlyUint8Array;
  numberOfPeriod: number;
  periodFrequency: number | bigint;
  reductionFactor: number | bigint;
  padding1: number | bigint;
};

export function getBaseFeeStructEncoder(): Encoder<BaseFeeStructArgs> {
  return getStructEncoder([
    ['cliffFeeNumerator', getU64Encoder()],
    ['feeSchedulerMode', getU8Encoder()],
    ['padding0', fixEncoderSize(getBytesEncoder(), 5)],
    ['numberOfPeriod', getU16Encoder()],
    ['periodFrequency', getU64Encoder()],
    ['reductionFactor', getU64Encoder()],
    ['padding1', getU64Encoder()],
  ]);
}

export function getBaseFeeStructDecoder(): Decoder<BaseFeeStruct> {
  return getStructDecoder([
    ['cliffFeeNumerator', getU64Decoder()],
    ['feeSchedulerMode', getU8Decoder()],
    ['padding0', fixDecoderSize(getBytesDecoder(), 5)],
    ['numberOfPeriod', getU16Decoder()],
    ['periodFrequency', getU64Decoder()],
    ['reductionFactor', getU64Decoder()],
    ['padding1', getU64Decoder()],
  ]);
}

export function getBaseFeeStructCodec(): Codec<
  BaseFeeStructArgs,
  BaseFeeStruct
> {
  return combineCodec(getBaseFeeStructEncoder(), getBaseFeeStructDecoder());
}
