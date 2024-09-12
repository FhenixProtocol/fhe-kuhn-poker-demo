import { BeakerIcon } from "@heroicons/react/24/outline";
import { ethers } from "ethers";
import { useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import {
  useDeployedContractInfo,
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useTransactor,
} from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getParsedError, notification } from "~~/utils/scaffold-eth";
import { IntegerInput } from "../scaffold-eth";
import { Encryptable } from "~~/utils/fhenixUtils";
import { useFhenixScaffoldContractWrite } from "~~/hooks/scaffold-eth/useFhenixScaffoldContractWrite";
import { createPublicClient, http, createWalletClient, custom, toHex } from "viem";
import { fhenixLocal } from "~~/config/fhenixNetworks";
import { InjectFhenixPermission } from "~~/utils/fhenixUtilsTypes";
import { useFhenixScaffoldContractRead } from "~~/hooks/scaffold-eth/useFhenixScaffoldContractRead";
import { useCreateFhenixPermit, useFhenix } from "~~/services/fhenix/store";

const CONTRACT_NAME = "Counter";

type SUBMISSION_OPTION = "ethers" | "viem" | "scaffold" | "fhenix-scaffold";

const CounterForm = () => {
  const [value, setValue] = useState<bigint | string>(0n);
  const { chain: connectedChain } = useNetwork();
  const { data: deployedContractData } = useDeployedContractInfo(CONTRACT_NAME);
  const writeTxn = useTransactor();
  const { targetNetwork } = useTargetNetwork();
  const { fhenixClient, fhenixProvider } = useFhenix();
  const createFhenixPermit = useCreateFhenixPermit();
  const { address } = useAccount();

  const { data: counterValue, isLoading: isTotalCounterLoading } = useScaffoldContractRead({
    contractName: CONTRACT_NAME,
    functionName: "getCounter",
    watch: true,
  });

  const { data: counterValueSealed } = useScaffoldContractRead({
    /**
     *          ^^^   type: SealedOutputUint | undefined
     *                adds strong typing to sealed fhenix outputs
     *                (SealedOutputUint / SealedOutputBool / SealedOutputAddress)
     */
    contractName: CONTRACT_NAME,
    functionName: "getCounterPermitSealed",
    args: [undefined],
    /**
     *     ^^^  type: Permission | undefined
     *          strongly typed to the `Permission` type coming from fhenix.js
     */
    watch: true,
  });

  const { data: counterValueUnSealed } = useFhenixScaffoldContractRead({
    /**
     *          ^^^   type: bigint | undefined
     *                automatically unsealed using available permit
     *                unsealed into bool if sealed ebool, bigint if euintXX, and string if eaddress
     *                can be single result or part of struct / array output
     */
    contractName: CONTRACT_NAME,
    functionName: "getCounterPermitSealed",
    args: [InjectFhenixPermission],
    /**
     *     ^^^  type: "inject-fhenix-permission" | undefined
     *          automatically replaced with available permit before read is sent to the contract
     */
    watch: true,
  });

  const [isAddValueLoading, setIsAddValueLoading] = useState<boolean>(false);

  /**
   * @param value
   * @returns
   */
  async function addValueEthers(encryptableValue: bigint | string) {
    if (fhenixProvider == null) {
      notification.error("No provider found");
      throw new Error("No provider found");
    }

    if (fhenixClient == null) {
      notification.error("No FHE client found");
      throw new Error("No FHE client found");
    }

    if (deployedContractData?.address == null) {
      notification.error("Cannot find the deployed contract");
      throw new Error("Cannot find the deployed contract");
    }

    const signer = await fhenixProvider.getSigner();

    const contract = new ethers.Contract(deployedContractData?.address, deployedContractData?.abi, signer);
    // @todo: Load proper types for the contract.
    const contractWithSigner = contract.connect(signer); // as Counter;

    // Encrypt numeric value to be passed into the Fhenix-powered contract.
    const sealed = Encryptable.encrypt(Encryptable.uint32(encryptableValue), fhenixClient);

    // @ts-expect-error Contract is not correctly typed as Counter yet
    const tx = await contractWithSigner.add(sealed);
    return await tx.wait();
  }

  async function addValueViem(value: number) {
    if (deployedContractData?.address == null) {
      return;
    }

    if (fhenixClient == null) {
      return;
    }

    const publicClient = createPublicClient({
      chain: fhenixLocal,
      transport: http(),
    });

    const walletClient = createWalletClient({
      chain: fhenixLocal,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      transport: custom(window.ethereum!),
    });

    const [account] = await walletClient.getAddresses();

    const param = await prepareArg(value);

    const { request } = await publicClient.simulateContract({
      account,
      address: deployedContractData?.address,
      abi: deployedContractData?.abi,
      functionName: "add",
      args: [param],
    });
    return await walletClient.writeContract(request);
  }

  const prepareArg = async (value: number) => {
    if (fhenixClient == null) {
      notification.error("No FHE client found");
      throw new Error("No FHE client found");
    }

    // Encrypt numeric value to be passed into the Fhenix-powered contract.
    const encryptedValue = await fhenixClient.encrypt_uint8(value);

    const param: any = {
      ...encryptedValue,
      data: toHex(encryptedValue.data),
    };

    console.log({
      param,
    });

    return param;
  };

  // SCAFFOLD ETH - Encrypted
  const { writeAsync: addValueScaffold } = useScaffoldContractWrite({
    contractName: CONTRACT_NAME,
    functionName: "add",
    blockConfirmations: 1,
    args: [Encryptable.uint32(value).encrypt(fhenixClient)],
    onBlockConfirmation: txnReceipt => {
      console.log("Scaffold Transaction blockHash", txnReceipt.blockHash);
    },
  });

  // FHENIX SCAFFOLD ETH - Encryptable
  const { writeAsync: addValueFhenixScaffold } = useFhenixScaffoldContractWrite({
    contractName: CONTRACT_NAME,
    functionName: "add",
    blockConfirmations: 1,
    args: [Encryptable.uint32(value)],
    onBlockConfirmation: txnReceipt => {
      console.log("Fhenix Scaffold Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const handleWrite = async (submissionType: SUBMISSION_OPTION) => {
    if (Number(value) === 0) {
      notification.warning("The value should not be 0");
      return;
    }

    try {
      setIsAddValueLoading(true);
      if (submissionType === "ethers") {
        await writeTxn(() => addValueEthers(value));
      }
      if (submissionType === "viem") {
        await writeTxn(() => addValueViem(Number(value)));
      }
      if (submissionType === "scaffold") {
        await addValueScaffold();
      }
      if (submissionType === "fhenix-scaffold") {
        await addValueFhenixScaffold();
      }
    } catch (e: any) {
      console.error("⚡️ ~ file: CounterForm.tsx:handleWrite ~ error", e);
      const message = getParsedError(e);
      notification.error(message);
    } finally {
      setIsAddValueLoading(false);
    }
  };

  const writeDisabled = !connectedChain || connectedChain?.id !== targetNetwork.id;

  return (
    <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
      <div className="flex flex-col justify-center items-center">
        <BeakerIcon className="h-8 w-8 fill-secondary" />
        <p>Counter demo</p>
      </div>

      {isTotalCounterLoading && <div>Loading</div>}

      <div className="p-2">Decrypted from SC: {Number(counterValue) || 0}</div>
      <div className="p-2">Unsealed: {Number(counterValueUnSealed) || 0}</div>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => createFhenixPermit(deployedContractData?.address, address)}
      >
        Decrypt SC
      </button>

      <div className="py-5 space-y-3 first:pt-0 last:pb-1">
        <div className="flex gap-3 flex-col">
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center ml-2">
              <span className="text-xs font-medium mr-2 leading-none">add to counter</span>
              <span className="block text-xs font-extralight leading-none">num</span>
            </div>
            <IntegerInput
              value={value}
              onChange={setValue}
              placeholder="number"
              disableMultiplyBy1e18={true}
              disabled={isAddValueLoading}
            />
          </div>

          <div className="flex justify-between gap-2">
            <div
              className={`flex gap-2 flex-wrap ${
                writeDisabled &&
                "tooltip before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none"
              }`}
              data-tip={`${writeDisabled && "Wallet not connected or in the wrong network"}`}
            >
              <button
                className="btn btn-secondary btn-sm"
                disabled={writeDisabled || isAddValueLoading}
                onClick={() => handleWrite("ethers")}
              >
                {isAddValueLoading && <span className="loading loading-spinner loading-xs" />}
                Add (ethers)
              </button>
              <button
                className="btn btn-secondary btn-sm"
                disabled={writeDisabled || isAddValueLoading}
                onClick={() => handleWrite("viem")}
              >
                {isAddValueLoading && <span className="loading loading-spinner loading-xs" />}
                Add (viem)
              </button>
              <button
                className="btn btn-secondary btn-sm"
                disabled={writeDisabled || isAddValueLoading}
                onClick={() => handleWrite("scaffold")}
              >
                {isAddValueLoading && <span className="loading loading-spinner loading-xs" />}
                Add (scaffold)
              </button>
              <button
                className="btn btn-secondary btn-sm"
                disabled={writeDisabled || isAddValueLoading}
                onClick={() => handleWrite("fhenix-scaffold")}
              >
                {isAddValueLoading && <span className="loading loading-spinner loading-xs" />}
                Add (fhenix-scaffold)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterForm;
