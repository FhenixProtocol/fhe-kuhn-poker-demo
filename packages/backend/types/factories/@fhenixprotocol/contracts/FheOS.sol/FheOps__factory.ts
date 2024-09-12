/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  FheOps,
  FheOpsInterface,
} from "../../../../@fhenixprotocol/contracts/FheOS.sol/FheOps";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "lhsHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "rhsHash",
        type: "bytes",
      },
    ],
    name: "add",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "lhsHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "rhsHash",
        type: "bytes",
      },
    ],
    name: "and",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "input",
        type: "bytes",
      },
      {
        internalType: "uint8",
        name: "toType",
        type: "uint8",
      },
    ],
    name: "cast",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "input",
        type: "bytes",
      },
    ],
    name: "decrypt",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "lhsHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "rhsHash",
        type: "bytes",
      },
    ],
    name: "div",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "lhsHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "rhsHash",
        type: "bytes",
      },
    ],
    name: "eq",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int32",
        name: "securityZone",
        type: "int32",
      },
    ],
    name: "getNetworkPublicKey",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "lhsHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "rhsHash",
        type: "bytes",
      },
    ],
    name: "gt",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "lhsHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "rhsHash",
        type: "bytes",
      },
    ],
    name: "gte",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "s",
        type: "string",
      },
    ],
    name: "log",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "lhsHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "rhsHash",
        type: "bytes",
      },
    ],
    name: "lt",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "lhsHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "rhsHash",
        type: "bytes",
      },
    ],
    name: "lte",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "lhsHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "rhsHash",
        type: "bytes",
      },
    ],
    name: "max",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "lhsHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "rhsHash",
        type: "bytes",
      },
    ],
    name: "min",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "lhsHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "rhsHash",
        type: "bytes",
      },
    ],
    name: "mul",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "lhsHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "rhsHash",
        type: "bytes",
      },
    ],
    name: "ne",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "value",
        type: "bytes",
      },
    ],
    name: "not",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "lhsHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "rhsHash",
        type: "bytes",
      },
    ],
    name: "or",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "uint64",
        name: "seed",
        type: "uint64",
      },
      {
        internalType: "int32",
        name: "securityZone",
        type: "int32",
      },
    ],
    name: "random",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "lhsHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "rhsHash",
        type: "bytes",
      },
    ],
    name: "rem",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "input",
        type: "bytes",
      },
    ],
    name: "req",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "ctHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "pk",
        type: "bytes",
      },
    ],
    name: "sealOutput",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "controlHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "ifTrueHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "ifFalseHash",
        type: "bytes",
      },
    ],
    name: "select",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "lhsHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "rhsHash",
        type: "bytes",
      },
    ],
    name: "shl",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "lhsHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "rhsHash",
        type: "bytes",
      },
    ],
    name: "shr",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "lhsHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "rhsHash",
        type: "bytes",
      },
    ],
    name: "sub",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "input",
        type: "bytes",
      },
      {
        internalType: "uint8",
        name: "toType",
        type: "uint8",
      },
      {
        internalType: "int32",
        name: "securityZone",
        type: "int32",
      },
    ],
    name: "trivialEncrypt",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "input",
        type: "bytes",
      },
      {
        internalType: "int32",
        name: "securityZone",
        type: "int32",
      },
    ],
    name: "verify",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "utype",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "lhsHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "rhsHash",
        type: "bytes",
      },
    ],
    name: "xor",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

export class FheOps__factory {
  static readonly abi = _abi;
  static createInterface(): FheOpsInterface {
    return new Interface(_abi) as FheOpsInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): FheOps {
    return new Contract(address, _abi, runner) as unknown as FheOps;
  }
}
