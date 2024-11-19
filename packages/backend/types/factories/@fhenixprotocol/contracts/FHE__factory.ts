/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { FHE, FHEInterface } from "../../../@fhenixprotocol/contracts/FHE";

const _abi = [
  {
    inputs: [],
    name: "NIL16",
    outputs: [
      {
        internalType: "euint16",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NIL32",
    outputs: [
      {
        internalType: "euint32",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NIL8",
    outputs: [
      {
        internalType: "euint8",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x609b610038600b82828239805160001a607314602b57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060475760003560e01c80639e80b51314604c578063acfc53ee14604c578063b1c4854414604c575b600080fd5b6053600081565b60405190815260200160405180910390f3fea264697066735822122084843d596ad639552b31493de00979ef093c4c2e910b0ce6f55f4283abc6029d64736f6c63430008140033";

type FHEConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FHEConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FHE__factory extends ContractFactory {
  constructor(...args: FHEConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      FHE & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): FHE__factory {
    return super.connect(runner) as FHE__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FHEInterface {
    return new Interface(_abi) as FHEInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): FHE {
    return new Contract(address, _abi, runner) as unknown as FHE;
  }
}
