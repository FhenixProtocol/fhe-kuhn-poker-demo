import hre from "hardhat";

export async function getTokensFromFaucet() {
  if (hre.network.name === "localfhenix") {
    const signers = await hre.ethers.getSigners();

    if ((await hre.ethers.provider.getBalance(signers[0].address)).toString() === "0") {
      await hre.fhenixjs.getFunds(signers[0].address);
    }
  }
}
