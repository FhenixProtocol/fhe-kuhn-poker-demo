/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../../../../common";

export interface MockFheOpsInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "add"
      | "and"
      | "boolToBytes"
      | "cast"
      | "decrypt"
      | "div"
      | "eq"
      | "getNetworkPublicKey"
      | "gt"
      | "gte"
      | "log"
      | "lt"
      | "lte"
      | "max"
      | "maxValue"
      | "min"
      | "mul"
      | "ne"
      | "not"
      | "or"
      | "random"
      | "rem"
      | "req"
      | "sealOutput"
      | "select"
      | "shl"
      | "shr"
      | "sub"
      | "trivialEncrypt"
      | "uint256ToBytes"
      | "verify"
      | "xor"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "add",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "and",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "boolToBytes",
    values: [boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "cast",
    values: [BigNumberish, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "decrypt",
    values: [BigNumberish, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "div",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "eq",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getNetworkPublicKey",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "gt",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "gte",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "log", values: [string]): string;
  encodeFunctionData(
    functionFragment: "lt",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "lte",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "max",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "maxValue",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "min",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "mul",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "ne",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "not",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "or",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "random",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "rem",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "req",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "sealOutput",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "select",
    values: [BigNumberish, BytesLike, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "shl",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "shr",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "sub",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "trivialEncrypt",
    values: [BytesLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "uint256ToBytes",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "verify",
    values: [BigNumberish, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "xor",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "add", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "and", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "boolToBytes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "cast", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "decrypt", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "div", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "eq", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getNetworkPublicKey",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "gt", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "gte", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "log", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lt", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lte", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "max", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "maxValue", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "min", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mul", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ne", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "not", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "or", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "random", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rem", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "req", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sealOutput", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "select", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "shl", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "shr", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sub", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "trivialEncrypt",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "uint256ToBytes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "verify", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "xor", data: BytesLike): Result;
}

export interface MockFheOps extends BaseContract {
  connect(runner?: ContractRunner | null): MockFheOps;
  waitForDeployment(): Promise<this>;

  interface: MockFheOpsInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  add: TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;

  and: TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;

  boolToBytes: TypedContractMethod<[value: boolean], [string], "view">;

  cast: TypedContractMethod<
    [arg0: BigNumberish, input: BytesLike, toType: BigNumberish],
    [string],
    "view"
  >;

  decrypt: TypedContractMethod<
    [arg0: BigNumberish, input: BytesLike, arg2: BigNumberish],
    [bigint],
    "view"
  >;

  div: TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;

  eq: TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;

  getNetworkPublicKey: TypedContractMethod<
    [arg0: BigNumberish],
    [string],
    "view"
  >;

  gt: TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;

  gte: TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;

  log: TypedContractMethod<[s: string], [void], "view">;

  lt: TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;

  lte: TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;

  max: TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;

  maxValue: TypedContractMethod<[utype: BigNumberish], [bigint], "view">;

  min: TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;

  mul: TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;

  ne: TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;

  not: TypedContractMethod<
    [utype: BigNumberish, value: BytesLike],
    [string],
    "view"
  >;

  or: TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;

  random: TypedContractMethod<
    [utype: BigNumberish, arg1: BigNumberish, arg2: BigNumberish],
    [string],
    "view"
  >;

  rem: TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;

  req: TypedContractMethod<
    [arg0: BigNumberish, input: BytesLike],
    [string],
    "view"
  >;

  sealOutput: TypedContractMethod<
    [arg0: BigNumberish, ctHash: BytesLike, arg2: BytesLike],
    [string],
    "view"
  >;

  select: TypedContractMethod<
    [
      arg0: BigNumberish,
      controlHash: BytesLike,
      ifTrueHash: BytesLike,
      ifFalseHash: BytesLike
    ],
    [string],
    "view"
  >;

  shl: TypedContractMethod<
    [arg0: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;

  shr: TypedContractMethod<
    [arg0: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;

  sub: TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;

  trivialEncrypt: TypedContractMethod<
    [input: BytesLike, toType: BigNumberish, arg2: BigNumberish],
    [string],
    "view"
  >;

  uint256ToBytes: TypedContractMethod<[value: BigNumberish], [string], "view">;

  verify: TypedContractMethod<
    [arg0: BigNumberish, input: BytesLike, arg2: BigNumberish],
    [string],
    "view"
  >;

  xor: TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "add"
  ): TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "and"
  ): TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "boolToBytes"
  ): TypedContractMethod<[value: boolean], [string], "view">;
  getFunction(
    nameOrSignature: "cast"
  ): TypedContractMethod<
    [arg0: BigNumberish, input: BytesLike, toType: BigNumberish],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "decrypt"
  ): TypedContractMethod<
    [arg0: BigNumberish, input: BytesLike, arg2: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "div"
  ): TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "eq"
  ): TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "getNetworkPublicKey"
  ): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "gt"
  ): TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "gte"
  ): TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "log"
  ): TypedContractMethod<[s: string], [void], "view">;
  getFunction(
    nameOrSignature: "lt"
  ): TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "lte"
  ): TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "max"
  ): TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "maxValue"
  ): TypedContractMethod<[utype: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "min"
  ): TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "mul"
  ): TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "ne"
  ): TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "not"
  ): TypedContractMethod<
    [utype: BigNumberish, value: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "or"
  ): TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "random"
  ): TypedContractMethod<
    [utype: BigNumberish, arg1: BigNumberish, arg2: BigNumberish],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "rem"
  ): TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "req"
  ): TypedContractMethod<
    [arg0: BigNumberish, input: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "sealOutput"
  ): TypedContractMethod<
    [arg0: BigNumberish, ctHash: BytesLike, arg2: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "select"
  ): TypedContractMethod<
    [
      arg0: BigNumberish,
      controlHash: BytesLike,
      ifTrueHash: BytesLike,
      ifFalseHash: BytesLike
    ],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "shl"
  ): TypedContractMethod<
    [arg0: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "shr"
  ): TypedContractMethod<
    [arg0: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "sub"
  ): TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "trivialEncrypt"
  ): TypedContractMethod<
    [input: BytesLike, toType: BigNumberish, arg2: BigNumberish],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "uint256ToBytes"
  ): TypedContractMethod<[value: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "verify"
  ): TypedContractMethod<
    [arg0: BigNumberish, input: BytesLike, arg2: BigNumberish],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "xor"
  ): TypedContractMethod<
    [utype: BigNumberish, lhsHash: BytesLike, rhsHash: BytesLike],
    [string],
    "view"
  >;

  filters: {};
}
