/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Permissioned",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Permissioned__factory>;
    getContractFactory(
      name: "FHE",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FHE__factory>;
    getContractFactory(
      name: "FheOps",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FheOps__factory>;
    getContractFactory(
      name: "Precompiles",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Precompiles__factory>;
    getContractFactory(
      name: "IERC5267",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC5267__factory>;
    getContractFactory(
      name: "ECDSA",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ECDSA__factory>;
    getContractFactory(
      name: "EIP712",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.EIP712__factory>;
    getContractFactory(
      name: "Math",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Math__factory>;
    getContractFactory(
      name: "ShortStrings",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ShortStrings__factory>;
    getContractFactory(
      name: "Strings",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Strings__factory>;
    getContractFactory(
      name: "FHEKuhnPoker",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FHEKuhnPoker__factory>;

    getContractAt(
      name: "Permissioned",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Permissioned>;
    getContractAt(
      name: "FHE",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FHE>;
    getContractAt(
      name: "FheOps",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FheOps>;
    getContractAt(
      name: "Precompiles",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Precompiles>;
    getContractAt(
      name: "IERC5267",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC5267>;
    getContractAt(
      name: "ECDSA",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ECDSA>;
    getContractAt(
      name: "EIP712",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.EIP712>;
    getContractAt(
      name: "Math",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Math>;
    getContractAt(
      name: "ShortStrings",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ShortStrings>;
    getContractAt(
      name: "Strings",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Strings>;
    getContractAt(
      name: "FHEKuhnPoker",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FHEKuhnPoker>;

    deployContract(
      name: "Permissioned",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Permissioned>;
    deployContract(
      name: "FHE",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FHE>;
    deployContract(
      name: "FheOps",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FheOps>;
    deployContract(
      name: "Precompiles",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Precompiles>;
    deployContract(
      name: "IERC5267",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC5267>;
    deployContract(
      name: "ECDSA",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ECDSA>;
    deployContract(
      name: "EIP712",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.EIP712>;
    deployContract(
      name: "Math",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Math>;
    deployContract(
      name: "ShortStrings",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ShortStrings>;
    deployContract(
      name: "Strings",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Strings>;
    deployContract(
      name: "FHEKuhnPoker",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FHEKuhnPoker>;

    deployContract(
      name: "Permissioned",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Permissioned>;
    deployContract(
      name: "FHE",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FHE>;
    deployContract(
      name: "FheOps",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FheOps>;
    deployContract(
      name: "Precompiles",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Precompiles>;
    deployContract(
      name: "IERC5267",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC5267>;
    deployContract(
      name: "ECDSA",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ECDSA>;
    deployContract(
      name: "EIP712",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.EIP712>;
    deployContract(
      name: "Math",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Math>;
    deployContract(
      name: "ShortStrings",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ShortStrings>;
    deployContract(
      name: "Strings",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Strings>;
    deployContract(
      name: "FHEKuhnPoker",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FHEKuhnPoker>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}
