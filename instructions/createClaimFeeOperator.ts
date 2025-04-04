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
  getAddressEncoder,
  getBytesDecoder,
  getBytesEncoder,
  getProgramDerivedAddress,
  getStructDecoder,
  getStructEncoder,
  transformEncoder,
  type Address,
  type Codec,
  type Decoder,
  type Encoder,
  type IAccountMeta,
  type IAccountSignerMeta,
  type IInstruction,
  type IInstructionWithAccounts,
  type IInstructionWithData,
  type ReadonlyAccount,
  type ReadonlyUint8Array,
  type TransactionSigner,
  type WritableAccount,
  type WritableSignerAccount,
} from '@solana/kit';
import { VIRTUAL_CURVE_PROGRAM_ADDRESS } from '../programs';
import {
  expectAddress,
  getAccountMetaFactory,
  type ResolvedAccount,
} from '../shared';

export const CREATE_CLAIM_FEE_OPERATOR_DISCRIMINATOR = new Uint8Array([
  169, 62, 207, 107, 58, 187, 162, 109,
]);

export function getCreateClaimFeeOperatorDiscriminatorBytes() {
  return fixEncoderSize(getBytesEncoder(), 8).encode(
    CREATE_CLAIM_FEE_OPERATOR_DISCRIMINATOR
  );
}

export type CreateClaimFeeOperatorInstruction<
  TProgram extends string = typeof VIRTUAL_CURVE_PROGRAM_ADDRESS,
  TAccountClaimFeeOperator extends string | IAccountMeta<string> = string,
  TAccountOperator extends string | IAccountMeta<string> = string,
  TAccountAdmin extends string | IAccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountEventAuthority extends string | IAccountMeta<string> = string,
  TAccountProgram extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends readonly IAccountMeta<string>[] = [],
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountClaimFeeOperator extends string
        ? WritableAccount<TAccountClaimFeeOperator>
        : TAccountClaimFeeOperator,
      TAccountOperator extends string
        ? ReadonlyAccount<TAccountOperator>
        : TAccountOperator,
      TAccountAdmin extends string
        ? WritableSignerAccount<TAccountAdmin> &
            IAccountSignerMeta<TAccountAdmin>
        : TAccountAdmin,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram,
      TAccountEventAuthority extends string
        ? ReadonlyAccount<TAccountEventAuthority>
        : TAccountEventAuthority,
      TAccountProgram extends string
        ? ReadonlyAccount<TAccountProgram>
        : TAccountProgram,
      ...TRemainingAccounts,
    ]
  >;

export type CreateClaimFeeOperatorInstructionData = {
  discriminator: ReadonlyUint8Array;
};

export type CreateClaimFeeOperatorInstructionDataArgs = {};

export function getCreateClaimFeeOperatorInstructionDataEncoder(): Encoder<CreateClaimFeeOperatorInstructionDataArgs> {
  return transformEncoder(
    getStructEncoder([['discriminator', fixEncoderSize(getBytesEncoder(), 8)]]),
    (value) => ({
      ...value,
      discriminator: CREATE_CLAIM_FEE_OPERATOR_DISCRIMINATOR,
    })
  );
}

export function getCreateClaimFeeOperatorInstructionDataDecoder(): Decoder<CreateClaimFeeOperatorInstructionData> {
  return getStructDecoder([
    ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
  ]);
}

export function getCreateClaimFeeOperatorInstructionDataCodec(): Codec<
  CreateClaimFeeOperatorInstructionDataArgs,
  CreateClaimFeeOperatorInstructionData
> {
  return combineCodec(
    getCreateClaimFeeOperatorInstructionDataEncoder(),
    getCreateClaimFeeOperatorInstructionDataDecoder()
  );
}

export type CreateClaimFeeOperatorAsyncInput<
  TAccountClaimFeeOperator extends string = string,
  TAccountOperator extends string = string,
  TAccountAdmin extends string = string,
  TAccountSystemProgram extends string = string,
  TAccountEventAuthority extends string = string,
  TAccountProgram extends string = string,
> = {
  claimFeeOperator?: Address<TAccountClaimFeeOperator>;
  operator: Address<TAccountOperator>;
  admin: TransactionSigner<TAccountAdmin>;
  systemProgram?: Address<TAccountSystemProgram>;
  eventAuthority?: Address<TAccountEventAuthority>;
  program: Address<TAccountProgram>;
};

export async function getCreateClaimFeeOperatorInstructionAsync<
  TAccountClaimFeeOperator extends string,
  TAccountOperator extends string,
  TAccountAdmin extends string,
  TAccountSystemProgram extends string,
  TAccountEventAuthority extends string,
  TAccountProgram extends string,
  TProgramAddress extends Address = typeof VIRTUAL_CURVE_PROGRAM_ADDRESS,
>(
  input: CreateClaimFeeOperatorAsyncInput<
    TAccountClaimFeeOperator,
    TAccountOperator,
    TAccountAdmin,
    TAccountSystemProgram,
    TAccountEventAuthority,
    TAccountProgram
  >,
  config?: { programAddress?: TProgramAddress }
): Promise<
  CreateClaimFeeOperatorInstruction<
    TProgramAddress,
    TAccountClaimFeeOperator,
    TAccountOperator,
    TAccountAdmin,
    TAccountSystemProgram,
    TAccountEventAuthority,
    TAccountProgram
  >
> {
  // Program address.
  const programAddress =
    config?.programAddress ?? VIRTUAL_CURVE_PROGRAM_ADDRESS;

  // Original accounts.
  const originalAccounts = {
    claimFeeOperator: {
      value: input.claimFeeOperator ?? null,
      isWritable: true,
    },
    operator: { value: input.operator ?? null, isWritable: false },
    admin: { value: input.admin ?? null, isWritable: true },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
    eventAuthority: { value: input.eventAuthority ?? null, isWritable: false },
    program: { value: input.program ?? null, isWritable: false },
  };
  const accounts = originalAccounts as Record<
    keyof typeof originalAccounts,
    ResolvedAccount
  >;

  // Resolve default values.
  if (!accounts.claimFeeOperator.value) {
    accounts.claimFeeOperator.value = await getProgramDerivedAddress({
      programAddress,
      seeds: [
        getBytesEncoder().encode(
          new Uint8Array([99, 102, 95, 111, 112, 101, 114, 97, 116, 111, 114])
        ),
        getAddressEncoder().encode(expectAddress(accounts.operator.value)),
      ],
    });
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value =
      '11111111111111111111111111111111' as Address<'11111111111111111111111111111111'>;
  }
  if (!accounts.eventAuthority.value) {
    accounts.eventAuthority.value = await getProgramDerivedAddress({
      programAddress,
      seeds: [
        getBytesEncoder().encode(
          new Uint8Array([
            95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114,
            105, 116, 121,
          ])
        ),
      ],
    });
  }

  const getAccountMeta = getAccountMetaFactory(programAddress, 'programId');
  const instruction = {
    accounts: [
      getAccountMeta(accounts.claimFeeOperator),
      getAccountMeta(accounts.operator),
      getAccountMeta(accounts.admin),
      getAccountMeta(accounts.systemProgram),
      getAccountMeta(accounts.eventAuthority),
      getAccountMeta(accounts.program),
    ],
    programAddress,
    data: getCreateClaimFeeOperatorInstructionDataEncoder().encode({}),
  } as CreateClaimFeeOperatorInstruction<
    TProgramAddress,
    TAccountClaimFeeOperator,
    TAccountOperator,
    TAccountAdmin,
    TAccountSystemProgram,
    TAccountEventAuthority,
    TAccountProgram
  >;

  return instruction;
}

export type CreateClaimFeeOperatorInput<
  TAccountClaimFeeOperator extends string = string,
  TAccountOperator extends string = string,
  TAccountAdmin extends string = string,
  TAccountSystemProgram extends string = string,
  TAccountEventAuthority extends string = string,
  TAccountProgram extends string = string,
> = {
  claimFeeOperator: Address<TAccountClaimFeeOperator>;
  operator: Address<TAccountOperator>;
  admin: TransactionSigner<TAccountAdmin>;
  systemProgram?: Address<TAccountSystemProgram>;
  eventAuthority: Address<TAccountEventAuthority>;
  program: Address<TAccountProgram>;
};

export function getCreateClaimFeeOperatorInstruction<
  TAccountClaimFeeOperator extends string,
  TAccountOperator extends string,
  TAccountAdmin extends string,
  TAccountSystemProgram extends string,
  TAccountEventAuthority extends string,
  TAccountProgram extends string,
  TProgramAddress extends Address = typeof VIRTUAL_CURVE_PROGRAM_ADDRESS,
>(
  input: CreateClaimFeeOperatorInput<
    TAccountClaimFeeOperator,
    TAccountOperator,
    TAccountAdmin,
    TAccountSystemProgram,
    TAccountEventAuthority,
    TAccountProgram
  >,
  config?: { programAddress?: TProgramAddress }
): CreateClaimFeeOperatorInstruction<
  TProgramAddress,
  TAccountClaimFeeOperator,
  TAccountOperator,
  TAccountAdmin,
  TAccountSystemProgram,
  TAccountEventAuthority,
  TAccountProgram
> {
  // Program address.
  const programAddress =
    config?.programAddress ?? VIRTUAL_CURVE_PROGRAM_ADDRESS;

  // Original accounts.
  const originalAccounts = {
    claimFeeOperator: {
      value: input.claimFeeOperator ?? null,
      isWritable: true,
    },
    operator: { value: input.operator ?? null, isWritable: false },
    admin: { value: input.admin ?? null, isWritable: true },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
    eventAuthority: { value: input.eventAuthority ?? null, isWritable: false },
    program: { value: input.program ?? null, isWritable: false },
  };
  const accounts = originalAccounts as Record<
    keyof typeof originalAccounts,
    ResolvedAccount
  >;

  // Resolve default values.
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value =
      '11111111111111111111111111111111' as Address<'11111111111111111111111111111111'>;
  }

  const getAccountMeta = getAccountMetaFactory(programAddress, 'programId');
  const instruction = {
    accounts: [
      getAccountMeta(accounts.claimFeeOperator),
      getAccountMeta(accounts.operator),
      getAccountMeta(accounts.admin),
      getAccountMeta(accounts.systemProgram),
      getAccountMeta(accounts.eventAuthority),
      getAccountMeta(accounts.program),
    ],
    programAddress,
    data: getCreateClaimFeeOperatorInstructionDataEncoder().encode({}),
  } as CreateClaimFeeOperatorInstruction<
    TProgramAddress,
    TAccountClaimFeeOperator,
    TAccountOperator,
    TAccountAdmin,
    TAccountSystemProgram,
    TAccountEventAuthority,
    TAccountProgram
  >;

  return instruction;
}

export type ParsedCreateClaimFeeOperatorInstruction<
  TProgram extends string = typeof VIRTUAL_CURVE_PROGRAM_ADDRESS,
  TAccountMetas extends readonly IAccountMeta[] = readonly IAccountMeta[],
> = {
  programAddress: Address<TProgram>;
  accounts: {
    claimFeeOperator: TAccountMetas[0];
    operator: TAccountMetas[1];
    admin: TAccountMetas[2];
    systemProgram: TAccountMetas[3];
    eventAuthority: TAccountMetas[4];
    program: TAccountMetas[5];
  };
  data: CreateClaimFeeOperatorInstructionData;
};

export function parseCreateClaimFeeOperatorInstruction<
  TProgram extends string,
  TAccountMetas extends readonly IAccountMeta[],
>(
  instruction: IInstruction<TProgram> &
    IInstructionWithAccounts<TAccountMetas> &
    IInstructionWithData<Uint8Array>
): ParsedCreateClaimFeeOperatorInstruction<TProgram, TAccountMetas> {
  if (instruction.accounts.length < 6) {
    // TODO: Coded error.
    throw new Error('Not enough accounts');
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts![accountIndex]!;
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      claimFeeOperator: getNextAccount(),
      operator: getNextAccount(),
      admin: getNextAccount(),
      systemProgram: getNextAccount(),
      eventAuthority: getNextAccount(),
      program: getNextAccount(),
    },
    data: getCreateClaimFeeOperatorInstructionDataDecoder().decode(
      instruction.data
    ),
  };
}
