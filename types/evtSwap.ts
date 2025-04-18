/**
 * This code was AUTOGENERATED using the codama library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun codama to update it.
 *
 * @see https://github.com/codama-idl/codama
 */

import {
  combineCodec,
  getAddressDecoder,
  getAddressEncoder,
  getBooleanDecoder,
  getBooleanEncoder,
  getStructDecoder,
  getStructEncoder,
  getU64Decoder,
  getU64Encoder,
  getU8Decoder,
  getU8Encoder,
  type Address,
  type Codec,
  type Decoder,
  type Encoder,
} from '@solana/kit';
import {
  getSwapParametersDecoder,
  getSwapParametersEncoder,
  getSwapResultDecoder,
  getSwapResultEncoder,
  type SwapParameters,
  type SwapParametersArgs,
  type SwapResult,
  type SwapResultArgs,
} from '.';

export type EvtSwap = {
  pool: Address;
  config: Address;
  tradeDirection: number;
  hasReferral: boolean;
  params: SwapParameters;
  swapResult: SwapResult;
  transferFeeExcludedAmountIn: bigint;
  currentTimestamp: bigint;
};

export type EvtSwapArgs = {
  pool: Address;
  config: Address;
  tradeDirection: number;
  hasReferral: boolean;
  params: SwapParametersArgs;
  swapResult: SwapResultArgs;
  transferFeeExcludedAmountIn: number | bigint;
  currentTimestamp: number | bigint;
};

export function getEvtSwapEncoder(): Encoder<EvtSwapArgs> {
  return getStructEncoder([
    ['pool', getAddressEncoder()],
    ['config', getAddressEncoder()],
    ['tradeDirection', getU8Encoder()],
    ['hasReferral', getBooleanEncoder()],
    ['params', getSwapParametersEncoder()],
    ['swapResult', getSwapResultEncoder()],
    ['transferFeeExcludedAmountIn', getU64Encoder()],
    ['currentTimestamp', getU64Encoder()],
  ]);
}

export function getEvtSwapDecoder(): Decoder<EvtSwap> {
  return getStructDecoder([
    ['pool', getAddressDecoder()],
    ['config', getAddressDecoder()],
    ['tradeDirection', getU8Decoder()],
    ['hasReferral', getBooleanDecoder()],
    ['params', getSwapParametersDecoder()],
    ['swapResult', getSwapResultDecoder()],
    ['transferFeeExcludedAmountIn', getU64Decoder()],
    ['currentTimestamp', getU64Decoder()],
  ]);
}

export function getEvtSwapCodec(): Codec<EvtSwapArgs, EvtSwap> {
  return combineCodec(getEvtSwapEncoder(), getEvtSwapDecoder());
}
