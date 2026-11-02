require("dotenv").config();
require("@nomicfoundation/hardhat-ethers");

const rpcUrl = process.env.BLOCKCHAIN_RPC_URL?.trim();
const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY?.trim();
const chainId = Number(process.env.BLOCKCHAIN_CHAIN_ID || "80002");

module.exports = {
  solidity: "0.8.24",
  networks: {
    polygonAmoy: {
      url: rpcUrl || "http://127.0.0.1:8545",
      chainId,
      accounts: privateKey ? [privateKey] : [],
    },
  },
};
