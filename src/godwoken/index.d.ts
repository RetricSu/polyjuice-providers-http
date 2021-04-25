import { Map } from "immutable";

export type Uint32 = number;
export type Uint64 = bigint;
export type Uint128 = bigint;
export type Uint256 = bigint;

import { HexNumber, HexString, Hash, Script } from "@ckb-lumos/base";
import * as core from "./schemas";
import * as normalizer from "./normalizer";
export { core, normalizer };

export function numberToUInt32LE(value: number): HexString;
export function UInt32LEToNumber(hex: HexString): number;
export function hexToU32(hex: HexString): number;
export function u32ToHex(value: number): HexString;
export function toBuffer(ab: ArrayBuffer): Buffer;

export interface RunResult {
  read_values: Map<Hash, Hash>;
  write_values: Map<Hash, Hash>;
  return_data: HexString;
  account_count?: HexNumber;
  new_scripts: Map<Hash, HexString>;
  write_data: Map<Hash, HexString>;
  read_data: Map<Hash, HexNumber>;
}
export interface RawL2Transaction {
  from_id: HexNumber;
  to_id: HexNumber;
  nonce: HexNumber;
  args: HexString;
}
export interface L2Transaction {
  raw: RawL2Transaction;
  signature: HexString;
}

export interface CreateAccount {
  script: Script;
}

export interface RawWithdrawalRequest {
  nonce: HexNumber;
  // CKB amount
  capacity: HexNumber;
  // SUDT amount
  amount: HexNumber;
  sudt_script_hash: Hash;
  // layer2 account_script_hash
  account_script_hash: Hash;
  // buyer can pay sell_amount and sell_capacity to unlock
  sell_amount: HexNumber;
  sell_capacity: HexNumber;
  // layer1 lock to withdraw after challenge period
  owner_lock_hash: Hash;
  // layer1 lock to receive the payment, must exists on the chain
  payment_lock_hash: Hash;
}
export interface WithdrawalRequest {
  raw: RawWithdrawalRequest;
  signature: HexString;
}
export interface WithdrawalLockArgs {
  // the original deposition info
  // used for helping programs generate reverted custodian cell
  deposition_block_hash: Hash,
  deposition_block_number: HexNumber,
  // the original custodian lock hash
  withdrawal_block_hash: Hash,
  withdrawal_block_number: HexNumber,
  // buyer can pay sell_amount token to unlock
  sudt_script_hash: Hash,
  sell_amount: HexNumber,
  sell_capacity: HexNumber,
  // layer1 lock to withdraw after challenge period
  owner_lock_hash: Hash,
  // layer1 lock to receive the payment, must exists on the chain
  payment_lock_hash: Hash,
}

export interface UnlockWithdrawalViaFinalize {
  block_proof: HexString,
}

// export interface HeaderInfo {
//     number: Uint64;
//     block_hash: Hash;
// }
// FIXME: todo
// export interface L2Block {}
export enum Status {
  Running = "running",
  Halting = "halting",
}

export declare class Godwoken {
  constructor(url: string);

  executeL2Transaction(l2tx: L2Transaction): Promise<RunResult>;
  submitL2Transaction(l2tx: L2Transaction): Promise<RunResult>;
  submitWithdrawalRequest(request: WithdrawalRequest): Promise<void>;
  getBalance(sudt_id: Uint32, account_id: Uint32): Promise<Uint128>;
  getStorageAt(account_id: Uint32, key: Hash): Promise<Hash>;
  getAccountIdByScriptHash(script_hash: Hash): Promise<Uint32>;
  getNonce(account_id: Uint32): Promise<Uint32>;
  getScript(script_hash: Hash): Promise<Script>;
  getScriptHash(account_id: Uint32): Promise<Hash>;
  getData(data_hash: Hash): Promise<HexString>;
  // gw_getDataHash
  hasDataHash(data_hash: Hash): Promise<boolean>;
}

export declare class GodwokenUtils {
  constructor(rollup_type_hash: Hash);
  generateTransactionMessageToSign(
    raw_l2tx: RawL2Transaction,
    sender_script_hash: Hash,
    receiver_script_hash: Hash,
  ): Hash;
  generateWithdrawalMessageToSign(
    raw_request: RawWithdrawalRequest
  ): Hash;
  static createAccountRawL2Transaction(
    from_id: Uint32,
    nonce: Uint32,
    script: Script
  ): RawL2Transaction;
  static createRawWithdrawalRequest(
    nonce: Uint32,
    capacity: Uint64,
    amount: Uint128,
    sudt_script_hash: Hash,
    account_script_hash: Hash,
    sell_amount: Uint128,
    sell_capacity: Uint64,
    owner_lock_hash: Hash,
    payment_lock_hash: Hash
  ): RawWithdrawalRequest;
}
