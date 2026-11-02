const hre = require("hardhat");

async function main() {
  const rpcUrl = process.env.BLOCKCHAIN_RPC_URL?.trim();
  if (!rpcUrl) {
    throw new Error(
      "BLOCKCHAIN_RPC_URL is missing. Add your Polygon Amoy RPC endpoint to Backend/server/.env.",
    );
  }

  const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY?.trim();
  if (!privateKey || !/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
    throw new Error(
      "BLOCKCHAIN_PRIVATE_KEY must be a 0x-prefixed 32-byte private key for a funded Polygon Amoy test wallet.",
    );
  }

  const expectedChainId = Number(process.env.BLOCKCHAIN_CHAIN_ID || "80002");
  if (!Number.isSafeInteger(expectedChainId) || expectedChainId <= 0) {
    throw new Error("BLOCKCHAIN_CHAIN_ID must be a positive integer.");
  }

  const network = await hre.ethers.provider.getNetwork();
  if (network.chainId !== BigInt(expectedChainId)) {
    throw new Error(
      `The RPC endpoint is connected to chain ${network.chainId}; expected chain ${expectedChainId}.`,
    );
  }

  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployment signer is configured.");
  }

  const registry = await hre.ethers.deployContract("CertificateRegistry");
  await registry.waitForDeployment();
  console.log(`CertificateRegistry deployed at ${await registry.getAddress()}`);
  console.log(`Owner/initial registrar: ${await deployer.getAddress()}`);
}

main().catch((error) => {
  console.error("Contract deployment failed:", error.message);
  process.exitCode = 1;
});
