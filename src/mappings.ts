import { Deposit, Withdraw, PoolEarned } from "../generated/Pool/Pool";
import {
  Deposit as DepositSchema,
  Withdraw as WithdrawSchema,
  PoolHistory,
  PoolDepositor,
} from "../generated/schema";

export function handleDeposit(event: Deposit): void {
  let poolDepositor = PoolDepositor.load(event.params.depositor.toHex());

  if (poolDepositor == null) {
    poolDepositor = new PoolDepositor(event.params.depositor.toHex());

    poolDepositor.pool = event.params.poolAddress;
    poolDepositor.address = event.params.depositor;
  }

  let deposit = new DepositSchema(event.transaction.hash.toHex());
  deposit.poolAddress = event.params.poolAddress;
  deposit.tokenAmount = event.params.tokenAmount;
  deposit.poolDepositor = poolDepositor.id;

  deposit.save();
  poolDepositor.save();
}

export function handleWithdraw(event: Withdraw): void {
  let poolDepositor = PoolDepositor.load(event.params.withdrawer.toHexString());
  let withdraw = new WithdrawSchema(event.transaction.hash.toHex());
  withdraw.poolAddress = event.params.poolAddress;
  withdraw.tokenAmount = event.params.tokenAmount;
  if (poolDepositor) {
    withdraw.poolDepositor = poolDepositor.id;
  }
  withdraw.save();
  if (poolDepositor) {
    poolDepositor.save();
  }
}
export function handlePoolEarned(event: PoolEarned): void {
  let pool = new PoolHistory(event.transaction.hash.toHex());

  pool.poolAddress = event.params.poolAddress;
  pool.reward = event.params.reward;

  pool.save();
}
