import { TASK_TEST } from "hardhat/builtin-tasks/task-names";
import { task } from "hardhat/config";
import { HARDHAT_NETWORK_NAME } from "hardhat/plugins";

task(TASK_TEST, "Deploy fhenix mock contracts on hardhat network test").setAction(async ({}, hre, runSuper) => {
  if (hre.network.name === HARDHAT_NETWORK_NAME) {
    const mockFheOpsArtifact = await hre.artifacts.readArtifact("MockFheOps");
    await hre.network.provider.send("hardhat_setCode", [
      "0x0000000000000000000000000000000000000080",
      mockFheOpsArtifact.deployedBytecode,
    ]);

    console.info("Successfully deployed Fhenix mock contracts (solc 0.8.20) on hardhat network");
  }

  return runSuper();
});
