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
  getU16Decoder,
  getU16Encoder,
  getU64Decoder,
  getU64Encoder,
  getU8Decoder,
  getU8Encoder,
  type Codec,
  type Decoder,
  type Encoder,
} from '@solana/kit';

export type BaseFeeParameters = {
  cliffFeeNumerator: bigint;
  numberOfPeriod: number;
  periodFrequency: bigint;
  reductionFactor: bigint;
  feeSchedulerMode: number;
};

export type BaseFeeParametersArgs = {
  cliffFeeNumerator: number | bigint;
  numberOfPeriod: number;
  periodFrequency: number | bigint;
  reductionFactor: number | bigint;
  feeSchedulerMode: number;
};

export function getBaseFeeParametersEncoder(): Encoder<BaseFeeParametersArgs> {
  return getStructEncoder([
    ['cliffFeeNumerator', getU64Encoder()],
    ['numberOfPeriod', getU16Encoder()],
    ['periodFrequency', getU64Encoder()],
    ['reductionFactor', getU64Encoder()],
    ['feeSchedulerMode', getU8Encoder()],
  ]);
}

export function getBaseFeeParametersDecoder(): Decoder<BaseFeeParameters> {
  return getStructDecoder([
    ['cliffFeeNumerator', getU64Decoder()],
    ['numberOfPeriod', getU16Decoder()],
    ['periodFrequency', getU64Decoder()],
    ['reductionFactor', getU64Decoder()],
    ['feeSchedulerMode', getU8Decoder()],
  ]);
}

export function getBaseFeeParametersCodec(): Codec<
  BaseFeeParametersArgs,
  BaseFeeParameters
> {
  return combineCodec(
    getBaseFeeParametersEncoder(),
    getBaseFeeParametersDecoder()
  );
}
