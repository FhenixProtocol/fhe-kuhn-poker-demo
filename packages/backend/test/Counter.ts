import { expect } from "chai";
import hre, { ethers, fhenixjs } from "hardhat";
import { Counter } from "../types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { createFhenixContractPermission, getTokensFromFaucet, unsealMockFheOpsSealed } from "./utils";

describe("Counter", function () {
  // We define a fixture to reuse the same setup in every test.

  let counter: Counter;
  let counterAddress: string;
  let signer: SignerWithAddress;

  before(async () => {
    await getTokensFromFaucet(signer.address);

    const counterFactory = await ethers.getContractFactory("Counter");
    counter = (await counterFactory.deploy()) as Counter;
    await counter.waitForDeployment();
    counterAddress = await counter.getAddress();

    signer = (await ethers.getSigners())[0];
  });

  describe("Deployment", function () {
    it("Should have the correct initial count on deploy", async function () {
      expect(await counter.getCounter()).to.equal(0n);
    });

    it("should add amount to the counter successfully", async function () {
      const toCount = 10;

      // Before sending the amount to count to the Counter contract
      // It must first be encrypted outside the contract (within this test / frontend)
      const encToCount = await fhenixjs.encrypt_uint32(toCount);

      // Add to the counter
      await counter.connect(signer).add(encToCount);

      // Create a permission, which is used to seal the Counter return value
      // Which is then decrypted outside the contract (within this test / frontend)
      const permission = await createFhenixContractPermission(hre, signer, counterAddress);

      const sealedCountedAmount = await counter.connect(signer).getCounterPermitSealed(permission);
      // const unsealedCountedAmount = fhenixjs.unseal(counterAddress, sealedCountedAmount.data);
      const unsealedCountedAmount = unsealMockFheOpsSealed(sealedCountedAmount.data);

      expect(Number(unsealedCountedAmount) === toCount);
      expect(unsealedCountedAmount).to.equal(toCount, "The counted amount should increase by toCount");

      // The Counter contract has a view function that decrypts the counter as a sanity check
      // This function leaks data, and should not be used in prod
      const decryptedCountedAmount = await counter.getCounter();
      expect(unsealedCountedAmount).to.equal(
        decryptedCountedAmount,
        "The unsealed and decrypted counted amount should match",
      );
    });
  });
});
