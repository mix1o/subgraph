// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Deposit extends ethereum.Event {
  get params(): Deposit__Params {
    return new Deposit__Params(this);
  }
}

export class Deposit__Params {
  _event: Deposit;

  constructor(event: Deposit) {
    this._event = event;
  }

  get poolAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get tokenAmount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get depositor(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class PoolEarned extends ethereum.Event {
  get params(): PoolEarned__Params {
    return new PoolEarned__Params(this);
  }
}

export class PoolEarned__Params {
  _event: PoolEarned;

  constructor(event: PoolEarned) {
    this._event = event;
  }

  get poolAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get reward(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class Withdraw extends ethereum.Event {
  get params(): Withdraw__Params {
    return new Withdraw__Params(this);
  }
}

export class Withdraw__Params {
  _event: Withdraw;

  constructor(event: Withdraw) {
    this._event = event;
  }

  get poolAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get tokenAmount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get withdrawer(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class Pool extends ethereum.SmartContract {
  static bind(address: Address): Pool {
    return new Pool("Pool", address);
  }

  flashLoanAddress(): Address {
    let result = super.call(
      "flashLoanAddress",
      "flashLoanAddress():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_flashLoanAddress(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "flashLoanAddress",
      "flashLoanAddress():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  lpTokenAddress(): Address {
    let result = super.call("lpTokenAddress", "lpTokenAddress():(address)", []);

    return result[0].toAddress();
  }

  try_lpTokenAddress(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "lpTokenAddress",
      "lpTokenAddress():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  tokenAddress(): Address {
    let result = super.call("tokenAddress", "tokenAddress():(address)", []);

    return result[0].toAddress();
  }

  try_tokenAddress(): ethereum.CallResult<Address> {
    let result = super.tryCall("tokenAddress", "tokenAddress():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class DepositCall extends ethereum.Call {
  get inputs(): DepositCall__Inputs {
    return new DepositCall__Inputs(this);
  }

  get outputs(): DepositCall__Outputs {
    return new DepositCall__Outputs(this);
  }
}

export class DepositCall__Inputs {
  _call: DepositCall;

  constructor(call: DepositCall) {
    this._call = call;
  }

  get _amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class DepositCall__Outputs {
  _call: DepositCall;

  constructor(call: DepositCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SendRewardCall extends ethereum.Call {
  get inputs(): SendRewardCall__Inputs {
    return new SendRewardCall__Inputs(this);
  }

  get outputs(): SendRewardCall__Outputs {
    return new SendRewardCall__Outputs(this);
  }
}

export class SendRewardCall__Inputs {
  _call: SendRewardCall;

  constructor(call: SendRewardCall) {
    this._call = call;
  }

  get _reward(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SendRewardCall__Outputs {
  _call: SendRewardCall;

  constructor(call: SendRewardCall) {
    this._call = call;
  }
}

export class SetConfigurationPoolCall extends ethereum.Call {
  get inputs(): SetConfigurationPoolCall__Inputs {
    return new SetConfigurationPoolCall__Inputs(this);
  }

  get outputs(): SetConfigurationPoolCall__Outputs {
    return new SetConfigurationPoolCall__Outputs(this);
  }
}

export class SetConfigurationPoolCall__Inputs {
  _call: SetConfigurationPoolCall;

  constructor(call: SetConfigurationPoolCall) {
    this._call = call;
  }

  get _lpTokenAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _flashLoanAddress(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _tokenAddress(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class SetConfigurationPoolCall__Outputs {
  _call: SetConfigurationPoolCall;

  constructor(call: SetConfigurationPoolCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class WithdrawCall extends ethereum.Call {
  get inputs(): WithdrawCall__Inputs {
    return new WithdrawCall__Inputs(this);
  }

  get outputs(): WithdrawCall__Outputs {
    return new WithdrawCall__Outputs(this);
  }
}

export class WithdrawCall__Inputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }
}

export class WithdrawCall__Outputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }
}