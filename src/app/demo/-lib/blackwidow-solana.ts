import {
  Keypair,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  type Connection,
} from "@solana/web3.js";

export const BLACKWIDOW_PROGRAM_ID = new PublicKey("3G8KCcMbZEyGJYNsL9jg1LPCJJAHJCUcPmiFxNXPgVwK");
export const NATIVE_MINT = new PublicKey("So11111111111111111111111111111111111111112");
export const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
);

const LAMPORTS_PER_SOL = 1_000_000_000n;
const TOKEN_ACCOUNT_SIZE = 165;
const U64_MAX = (1n << 64n) - 1n;
const DEFAULT_DEPOSIT_SLIPPAGE_BPS = 50n;

const VAULT_SEED = Uint8Array.of(118, 97, 117, 108, 116);
const VAULT_AUTHORITY_SEED = Uint8Array.of(
  118,
  97,
  117,
  108,
  116,
  95,
  97,
  117,
  116,
  104,
  111,
  114,
  105,
  116,
  121,
);

const VAULT_STATE_DISCRIMINATOR = Uint8Array.of(228, 196, 82, 165, 98, 210, 235, 152);
const DEPOSIT_DISCRIMINATOR = Uint8Array.of(242, 35, 198, 137, 82, 225, 242, 182);
const REDEEM_IDLE_DISCRIMINATOR = Uint8Array.of(232, 226, 213, 25, 188, 71, 117, 88);

type InstructionData = NonNullable<ConstructorParameters<typeof TransactionInstruction>[0]["data"]>;

export interface VaultState {
  assetMint: PublicKey;
  shareMint: PublicKey;
  idleTokenAccount: PublicKey;
  admin: PublicKey;
  operator: PublicKey;
  totalIdle: bigint;
  totalDeployed: bigint;
  depositsPaused: boolean;
  withdrawalsPaused: boolean;
  allocationsPaused: boolean;
  bump: number;
  authorityBump: number;
}

export interface SolVaultState {
  vault: PublicKey;
  vaultAuthority: PublicKey;
  account: VaultState | null;
}

export interface BuildDepositSolTransactionParams {
  connection: Connection;
  owner: PublicKey;
  amountLamports: bigint;
  minShares?: bigint;
}

export interface BuildWithdrawSolTransactionParams {
  connection: Connection;
  owner: PublicKey;
  amountLamports: bigint;
}

export interface GetWithdrawAvailabilityParams {
  connection: Connection;
  owner: PublicKey;
}

export interface DepositSolTransaction {
  transaction: Transaction;
  vault: PublicKey;
  vaultAuthority: PublicKey;
  vaultState: VaultState;
  ownerWrappedSolAccount: PublicKey;
  ownerShareTokenAccount: PublicKey;
  amountLamports: bigint;
  expectedShares: bigint;
  minShares: bigint;
}

export interface WithdrawSolTransaction {
  transaction: Transaction;
  signers: Keypair[];
  vault: PublicKey;
  vaultAuthority: PublicKey;
  vaultState: VaultState;
  ownerWrappedSolAccount: PublicKey;
  ownerShareTokenAccount: PublicKey;
  amountLamports: bigint;
  shares: bigint;
  expectedAssets: bigint;
  minAssets: bigint;
}

export interface WithdrawAvailability {
  vault: PublicKey;
  vaultAuthority: PublicKey;
  vaultState: VaultState;
  ownerShareTokenAccount: PublicKey;
  ownerShares: bigint;
  redeemableShares: bigint;
  shareSupply: bigint;
  allocatedLamports: bigint;
  withdrawableLamports: bigint;
  idleLamports: bigint;
  totalAssetsLamports: bigint;
}

function asInstructionData(bytes: Uint8Array): InstructionData {
  return bytes as InstructionData;
}

function assertU64(value: bigint, label: string) {
  if (value < 0n || value > U64_MAX) {
    throw new Error(`${label} is outside the u64 range`);
  }
}

function writeU64(value: bigint, target: Uint8Array, offset: number) {
  assertU64(value, "Instruction value");
  new DataView(target.buffer, target.byteOffset, target.byteLength).setBigUint64(
    offset,
    value,
    true,
  );
}

function readU64(data: Uint8Array, offset: number) {
  return new DataView(data.buffer, data.byteOffset + offset, 8).getBigUint64(0, true);
}

function hasDiscriminator(data: Uint8Array, discriminator: Uint8Array) {
  return discriminator.every((byte, index) => data[index] === byte);
}

function calculateExpectedShares(amount: bigint, vaultState: VaultState, shareSupply: bigint) {
  const totalAssets = vaultState.totalIdle + vaultState.totalDeployed;

  if (shareSupply === 0n || totalAssets === 0n) {
    return amount;
  }

  return (amount * shareSupply) / totalAssets;
}

function calculateSharesForAssets(amount: bigint, vaultState: VaultState, shareSupply: bigint) {
  const totalAssets = vaultState.totalIdle + vaultState.totalDeployed;

  if (shareSupply === 0n || totalAssets === 0n) {
    throw new Error("Vault has no shares available to redeem.");
  }

  return (amount * shareSupply + totalAssets - 1n) / totalAssets;
}

function calculateExpectedAssets(shares: bigint, vaultState: VaultState, shareSupply: bigint) {
  const totalAssets = vaultState.totalIdle + vaultState.totalDeployed;

  if (shareSupply === 0n) {
    throw new Error("Vault has no shares available to redeem.");
  }

  return (shares * totalAssets) / shareSupply;
}

function calculateMaxSharesForAssets(assets: bigint, totalAssets: bigint, shareSupply: bigint) {
  if (assets <= 0n || totalAssets <= 0n || shareSupply <= 0n) {
    return 0n;
  }

  return ((assets + 1n) * shareSupply - 1n) / totalAssets;
}

function applySlippage(value: bigint, slippageBps = DEFAULT_DEPOSIT_SLIPPAGE_BPS) {
  return (value * (10_000n - slippageBps)) / 10_000n;
}

function minBigint(...values: bigint[]) {
  return values.reduce((min, value) => (value < min ? value : min));
}

export function parseSolAmountToLamports(value: string) {
  const normalized = value.trim().replace(",", ".");

  if (!/^\d+(\.\d{0,9})?$/.test(normalized)) {
    throw new Error("Enter a valid SOL amount with up to 9 decimals.");
  }

  const [wholePart, fractionPart = ""] = normalized.split(".");
  const lamports =
    BigInt(wholePart || "0") * LAMPORTS_PER_SOL + BigInt((fractionPart + "000000000").slice(0, 9));

  if (lamports <= 0n) {
    throw new Error("Amount must be greater than zero.");
  }

  assertU64(lamports, "Amount");
  return lamports;
}

export function findVaultPda(assetMint = NATIVE_MINT) {
  return PublicKey.findProgramAddressSync(
    [VAULT_SEED, assetMint.toBuffer()],
    BLACKWIDOW_PROGRAM_ID,
  );
}

export function findVaultAuthorityPda(vault: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [VAULT_AUTHORITY_SEED, vault.toBuffer()],
    BLACKWIDOW_PROGRAM_ID,
  );
}

export function findAssociatedTokenAddress(owner: PublicKey, mint: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID,
  )[0];
}

export function decodeVaultState(data: Uint8Array): VaultState {
  if (data.byteLength < 189 || !hasDiscriminator(data, VAULT_STATE_DISCRIMINATOR)) {
    throw new Error("Invalid Blackwidow vault account data.");
  }

  let offset = VAULT_STATE_DISCRIMINATOR.byteLength;
  const readPubkey = () => {
    const pubkey = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    return pubkey;
  };

  const assetMint = readPubkey();
  const shareMint = readPubkey();
  const idleTokenAccount = readPubkey();
  const admin = readPubkey();
  const operator = readPubkey();
  const totalIdle = readU64(data, offset);
  offset += 8;
  const totalDeployed = readU64(data, offset);
  offset += 8;

  return {
    assetMint,
    shareMint,
    idleTokenAccount,
    admin,
    operator,
    totalIdle,
    totalDeployed,
    depositsPaused: data[offset++] === 1,
    withdrawalsPaused: data[offset++] === 1,
    allocationsPaused: data[offset++] === 1,
    bump: data[offset++],
    authorityBump: data[offset],
  };
}

export async function getSolVaultState(connection: Connection): Promise<SolVaultState> {
  const [vault] = findVaultPda();
  const [vaultAuthority] = findVaultAuthorityPda(vault);
  const accountInfo = await connection.getAccountInfo(vault, "confirmed");

  return {
    vault,
    vaultAuthority,
    account: accountInfo ? decodeVaultState(accountInfo.data) : null,
  };
}

export function createAssociatedTokenAccountIdempotentInstruction(
  payer: PublicKey,
  associatedToken: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
) {
  return new TransactionInstruction({
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    keys: [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: associatedToken, isSigner: false, isWritable: true },
      { pubkey: owner, isSigner: false, isWritable: false },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: asInstructionData(Uint8Array.of(1)),
  });
}

export function createSyncNativeInstruction(account: PublicKey) {
  return new TransactionInstruction({
    programId: TOKEN_PROGRAM_ID,
    keys: [{ pubkey: account, isSigner: false, isWritable: true }],
    data: asInstructionData(Uint8Array.of(17)),
  });
}

export function createInitializeTokenAccountInstruction(
  account: PublicKey,
  mint: PublicKey,
  owner: PublicKey,
) {
  return new TransactionInstruction({
    programId: TOKEN_PROGRAM_ID,
    keys: [
      { pubkey: account, isSigner: false, isWritable: true },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: owner, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ],
    data: asInstructionData(Uint8Array.of(1)),
  });
}

export function createCloseTokenAccountInstruction(
  account: PublicKey,
  destination: PublicKey,
  owner: PublicKey,
) {
  return new TransactionInstruction({
    programId: TOKEN_PROGRAM_ID,
    keys: [
      { pubkey: account, isSigner: false, isWritable: true },
      { pubkey: destination, isSigner: false, isWritable: true },
      { pubkey: owner, isSigner: true, isWritable: false },
    ],
    data: asInstructionData(Uint8Array.of(9)),
  });
}

export function createDepositInstruction(params: {
  owner: PublicKey;
  vault: PublicKey;
  vaultAuthority: PublicKey;
  shareMint: PublicKey;
  vaultIdleTokenAccount: PublicKey;
  ownerAssetTokenAccount: PublicKey;
  ownerShareTokenAccount: PublicKey;
  amount: bigint;
  minShares: bigint;
}) {
  const data = new Uint8Array(24);
  data.set(DEPOSIT_DISCRIMINATOR, 0);
  writeU64(params.amount, data, 8);
  writeU64(params.minShares, data, 16);

  return new TransactionInstruction({
    programId: BLACKWIDOW_PROGRAM_ID,
    keys: [
      { pubkey: params.owner, isSigner: true, isWritable: false },
      { pubkey: params.vault, isSigner: false, isWritable: true },
      { pubkey: params.vaultAuthority, isSigner: false, isWritable: false },
      { pubkey: params.shareMint, isSigner: false, isWritable: true },
      { pubkey: params.vaultIdleTokenAccount, isSigner: false, isWritable: true },
      { pubkey: params.ownerAssetTokenAccount, isSigner: false, isWritable: true },
      { pubkey: params.ownerShareTokenAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: asInstructionData(data),
  });
}

export function createRedeemIdleInstruction(params: {
  owner: PublicKey;
  vault: PublicKey;
  vaultAuthority: PublicKey;
  shareMint: PublicKey;
  vaultIdleTokenAccount: PublicKey;
  ownerAssetTokenAccount: PublicKey;
  ownerShareTokenAccount: PublicKey;
  shares: bigint;
  minAssets: bigint;
}) {
  const data = new Uint8Array(24);
  data.set(REDEEM_IDLE_DISCRIMINATOR, 0);
  writeU64(params.shares, data, 8);
  writeU64(params.minAssets, data, 16);

  return new TransactionInstruction({
    programId: BLACKWIDOW_PROGRAM_ID,
    keys: [
      { pubkey: params.owner, isSigner: true, isWritable: false },
      { pubkey: params.vault, isSigner: false, isWritable: true },
      { pubkey: params.vaultAuthority, isSigner: false, isWritable: false },
      { pubkey: params.shareMint, isSigner: false, isWritable: true },
      { pubkey: params.vaultIdleTokenAccount, isSigner: false, isWritable: true },
      { pubkey: params.ownerAssetTokenAccount, isSigner: false, isWritable: true },
      { pubkey: params.ownerShareTokenAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: asInstructionData(data),
  });
}

function readTokenAccountAmount(data: Uint8Array) {
  if (data.byteLength < 72) {
    throw new Error("Invalid token account data.");
  }

  return readU64(data, 64);
}

export async function getWithdrawAvailability({
  connection,
  owner,
}: GetWithdrawAvailabilityParams): Promise<WithdrawAvailability> {
  const { vault, vaultAuthority, account: vaultState } = await getSolVaultState(connection);

  if (!vaultState) {
    throw new Error("SOL vault is not initialized on this cluster.");
  }

  if (!vaultState.assetMint.equals(NATIVE_MINT)) {
    throw new Error("Configured vault is not a SOL vault.");
  }

  const ownerShareTokenAccount = findAssociatedTokenAddress(owner, vaultState.shareMint);
  const [shareSupplyResponse, ownerShareTokenAccountInfo] = await Promise.all([
    connection.getTokenSupply(vaultState.shareMint, "confirmed"),
    connection.getAccountInfo(ownerShareTokenAccount, "confirmed"),
  ]);
  const ownerShares = ownerShareTokenAccountInfo
    ? readTokenAccountAmount(ownerShareTokenAccountInfo.data)
    : 0n;
  const shareSupply = BigInt(shareSupplyResponse.value.amount);
  const totalAssetsLamports = vaultState.totalIdle + vaultState.totalDeployed;

  if (shareSupply === 0n || totalAssetsLamports === 0n || ownerShares === 0n) {
    return {
      vault,
      vaultAuthority,
      vaultState,
      ownerShareTokenAccount,
      ownerShares,
      redeemableShares: 0n,
      shareSupply,
      allocatedLamports: 0n,
      withdrawableLamports: 0n,
      idleLamports: vaultState.totalIdle,
      totalAssetsLamports,
    };
  }

  const allocatedLamports = calculateExpectedAssets(ownerShares, vaultState, shareSupply);
  const maxSharesByIdle = calculateMaxSharesForAssets(
    vaultState.totalIdle,
    totalAssetsLamports,
    shareSupply,
  );
  const redeemableShares = minBigint(ownerShares, shareSupply, maxSharesByIdle);
  const withdrawableLamports = vaultState.withdrawalsPaused
    ? 0n
    : calculateExpectedAssets(redeemableShares, vaultState, shareSupply);

  return {
    vault,
    vaultAuthority,
    vaultState,
    ownerShareTokenAccount,
    ownerShares,
    redeemableShares,
    shareSupply,
    allocatedLamports,
    withdrawableLamports,
    idleLamports: vaultState.totalIdle,
    totalAssetsLamports,
  };
}

export async function buildDepositSolTransaction({
  connection,
  owner,
  amountLamports,
  minShares,
}: BuildDepositSolTransactionParams): Promise<DepositSolTransaction> {
  assertU64(amountLamports, "Deposit amount");

  const { vault, vaultAuthority, account: vaultState } = await getSolVaultState(connection);

  if (!vaultState) {
    throw new Error("SOL vault is not initialized on this cluster.");
  }

  if (!vaultState.assetMint.equals(NATIVE_MINT)) {
    throw new Error("Configured vault is not a SOL vault.");
  }

  if (vaultState.depositsPaused) {
    throw new Error("Deposits are paused for this vault.");
  }

  const shareSupplyResponse = await connection.getTokenSupply(vaultState.shareMint, "confirmed");
  const shareSupply = BigInt(shareSupplyResponse.value.amount);
  const expectedShares = calculateExpectedShares(amountLamports, vaultState, shareSupply);
  const depositMinShares = minShares ?? applySlippage(expectedShares);

  assertU64(depositMinShares, "Minimum shares");

  const ownerWrappedSolAccount = findAssociatedTokenAddress(owner, NATIVE_MINT);
  const ownerShareTokenAccount = findAssociatedTokenAddress(owner, vaultState.shareMint);
  const transaction = new Transaction().add(
    createAssociatedTokenAccountIdempotentInstruction(
      owner,
      ownerWrappedSolAccount,
      owner,
      NATIVE_MINT,
    ),
    createAssociatedTokenAccountIdempotentInstruction(
      owner,
      ownerShareTokenAccount,
      owner,
      vaultState.shareMint,
    ),
    SystemProgram.transfer({
      fromPubkey: owner,
      toPubkey: ownerWrappedSolAccount,
      lamports: amountLamports,
    }),
    createSyncNativeInstruction(ownerWrappedSolAccount),
    createDepositInstruction({
      owner,
      vault,
      vaultAuthority,
      shareMint: vaultState.shareMint,
      vaultIdleTokenAccount: vaultState.idleTokenAccount,
      ownerAssetTokenAccount: ownerWrappedSolAccount,
      ownerShareTokenAccount,
      amount: amountLamports,
      minShares: depositMinShares,
    }),
  );

  return {
    transaction,
    vault,
    vaultAuthority,
    vaultState,
    ownerWrappedSolAccount,
    ownerShareTokenAccount,
    amountLamports,
    expectedShares,
    minShares: depositMinShares,
  };
}

export async function buildWithdrawSolTransaction({
  connection,
  owner,
  amountLamports,
}: BuildWithdrawSolTransactionParams): Promise<WithdrawSolTransaction> {
  assertU64(amountLamports, "Withdraw amount");

  const availability = await getWithdrawAvailability({ connection, owner });
  const { vault, vaultAuthority, vaultState, ownerShareTokenAccount } = availability;

  if (vaultState.withdrawalsPaused) {
    throw new Error("Withdrawals are paused for this vault.");
  }

  if (availability.withdrawableLamports <= 0n) {
    throw new Error("No SOL is available to withdraw from this wallet.");
  }

  if (amountLamports > availability.withdrawableLamports) {
    throw new Error("Withdraw amount exceeds the available withdraw balance.");
  }

  const shareSupply = availability.shareSupply;
  const shares = calculateSharesForAssets(amountLamports, vaultState, shareSupply);
  const expectedAssets = calculateExpectedAssets(shares, vaultState, shareSupply);

  assertU64(shares, "Shares");
  assertU64(expectedAssets, "Expected assets");

  if (vaultState.totalIdle < expectedAssets) {
    throw new Error("Vault does not have enough idle SOL liquidity for this withdrawal.");
  }

  if (availability.ownerShares < shares) {
    throw new Error("Not enough Blackwidow shares for this withdrawal amount.");
  }

  const ownerWrappedSolAccount = Keypair.generate();
  const rentLamports = await connection.getMinimumBalanceForRentExemption(TOKEN_ACCOUNT_SIZE);
  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: owner,
      newAccountPubkey: ownerWrappedSolAccount.publicKey,
      lamports: rentLamports,
      space: TOKEN_ACCOUNT_SIZE,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeTokenAccountInstruction(ownerWrappedSolAccount.publicKey, NATIVE_MINT, owner),
    createRedeemIdleInstruction({
      owner,
      vault,
      vaultAuthority,
      shareMint: vaultState.shareMint,
      vaultIdleTokenAccount: vaultState.idleTokenAccount,
      ownerAssetTokenAccount: ownerWrappedSolAccount.publicKey,
      ownerShareTokenAccount,
      shares,
      minAssets: amountLamports,
    }),
    createCloseTokenAccountInstruction(ownerWrappedSolAccount.publicKey, owner, owner),
  );

  return {
    transaction,
    signers: [ownerWrappedSolAccount],
    vault,
    vaultAuthority,
    vaultState,
    ownerWrappedSolAccount: ownerWrappedSolAccount.publicKey,
    ownerShareTokenAccount,
    amountLamports,
    shares,
    expectedAssets,
    minAssets: amountLamports,
  };
}
