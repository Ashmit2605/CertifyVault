import {
  Contract,
  JsonRpcProvider,
  Wallet,
  keccak256,
  toUtf8Bytes,
} from "ethers";

const registryAbi = [
  "function certificates(bytes32) view returns (bytes32 fileHash, address issuer, uint64 registeredAt, bool revoked)",
  "function registerCertificate(bytes32 certificateId, bytes32 fileHash)",
  "function revokeCertificate(bytes32 certificateId)",
];

export interface BlockchainTransactionResult {
  transactionHash: string | null;
  blockNumber: string | null;
  network: string;
  contractAddress: string;
  alreadyRegistered?: boolean;
  alreadyRevoked?: boolean;
}

export interface OnChainCertificateProof {
  fileHash: string;
  issuer: string;
  registeredAt: bigint;
  revoked: boolean;
}

export class BlockchainServiceError extends Error {
  readonly statusCode = 503;

  constructor() {
    super("Blockchain verification is temporarily unavailable.");
    this.name = "BlockchainServiceError";
  }
}

function getBlockchainSettings() {
  const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
  const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
  const contractAddress = process.env.BLOCKCHAIN_CONTRACT_ADDRESS;
  const chainIdValue = process.env.BLOCKCHAIN_CHAIN_ID;
  const network = process.env.BLOCKCHAIN_NETWORK?.trim();
  const confirmations = Number(process.env.BLOCKCHAIN_CONFIRMATIONS ?? "1");

  if (!rpcUrl || !privateKey || !contractAddress || !chainIdValue || !network) {
    throw new Error(
      "Blockchain registration is not configured. Set the RPC, chain ID, network, contract address, and registrar key.",
    );
  }
  if (!/^https?:\/\//i.test(rpcUrl)) {
    throw new Error("BLOCKCHAIN_RPC_URL must use HTTP or HTTPS.");
  }
  if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
    throw new Error("BLOCKCHAIN_PRIVATE_KEY is invalid.");
  }
  if (!/^0x[0-9a-fA-F]{40}$/.test(contractAddress)) {
    throw new Error("BLOCKCHAIN_CONTRACT_ADDRESS is invalid.");
  }

  const chainId = Number(chainIdValue);
  if (!Number.isSafeInteger(chainId) || chainId < 1) {
    throw new Error("BLOCKCHAIN_CHAIN_ID is invalid.");
  }
  if (!Number.isSafeInteger(confirmations) || confirmations < 1) {
    throw new Error("BLOCKCHAIN_CONFIRMATIONS must be a positive integer.");
  }

  return {
    rpcUrl,
    privateKey,
    contractAddress,
    chainId,
    confirmations,
    network,
  };
}

async function getRegistry() {
  const settings = getBlockchainSettings();
  const provider = new JsonRpcProvider(settings.rpcUrl);
  const connectedChain = await provider.getNetwork();
  if (connectedChain.chainId !== BigInt(settings.chainId)) {
    throw new Error("Blockchain provider connected to an unexpected network.");
  }
  const wallet = new Wallet(settings.privateKey, provider);
  const contract = new Contract(settings.contractAddress, registryAbi, wallet);

  return { settings, provider, contract };
}

function getReadOnlySettings() {
  const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
  const contractAddress = process.env.BLOCKCHAIN_CONTRACT_ADDRESS;
  const chainIdValue = process.env.BLOCKCHAIN_CHAIN_ID;
  const network = process.env.BLOCKCHAIN_NETWORK?.trim();
  if (!rpcUrl || !contractAddress || !chainIdValue || !network) {
    throw new Error(
      "Blockchain verification is not configured. Set the RPC, chain ID, network, and contract address.",
    );
  }
  if (!/^https?:\/\//i.test(rpcUrl)) {
    throw new Error("BLOCKCHAIN_RPC_URL must use HTTP or HTTPS.");
  }
  if (!/^0x[0-9a-fA-F]{40}$/.test(contractAddress)) {
    throw new Error("BLOCKCHAIN_CONTRACT_ADDRESS is invalid.");
  }
  const chainId = Number(chainIdValue);
  if (!Number.isSafeInteger(chainId) || chainId < 1) {
    throw new Error("BLOCKCHAIN_CHAIN_ID is invalid.");
  }
  return { rpcUrl, contractAddress, chainId, network };
}

async function getReadOnlyRegistry() {
  const settings = getReadOnlySettings();
  const provider = new JsonRpcProvider(settings.rpcUrl);
  const contract = new Contract(
    settings.contractAddress,
    registryAbi,
    provider,
  );
  const connectedChain = await provider.getNetwork();
  if (connectedChain.chainId !== BigInt(settings.chainId)) {
    throw new Error("Blockchain provider connected to an unexpected network.");
  }
  return { settings, provider, contract };
}

export function getCertificateOnChainId(certificateId: string): string {
  return keccak256(toUtf8Bytes(certificateId));
}

export async function registerCertificateOnChain(
  certificateId: string,
  certificateHash: string,
  onSubmitted: (transactionHash: string) => Promise<void>,
): Promise<BlockchainTransactionResult> {
  const { settings, provider, contract } = await getRegistry();
  const onChainId = getCertificateOnChainId(certificateId);
  const digest = `0x${certificateHash}`;
  const existing = (await contract
    .getFunction("certificates")(onChainId)) as readonly [
    string,
    string,
    bigint,
    boolean,
  ];

  if (existing[2] > 0n) {
    if (existing[0].toLowerCase() !== digest.toLowerCase() || existing[3]) {
      throw new Error("The existing on-chain certificate proof does not match.");
    }
    return {
      transactionHash: null,
      blockNumber: null,
      network: settings.network,
      contractAddress: settings.contractAddress,
      alreadyRegistered: true,
    };
  }

  const transaction = await contract
    .getFunction("registerCertificate")(onChainId, digest);
  await onSubmitted(transaction.hash);

  const receipt = await transaction.wait(settings.confirmations);
  if (!receipt) {
    throw new Error("Blockchain transaction has not been confirmed yet.");
  }
  if (receipt.status !== 1) {
    throw new Error("Blockchain registration transaction reverted.");
  }

  const connectedChain = await provider.getNetwork();
  if (connectedChain.chainId !== BigInt(settings.chainId)) {
    throw new Error("Blockchain provider connected to an unexpected network.");
  }

  return {
    transactionHash: transaction.hash,
    blockNumber: receipt.blockNumber.toString(),
    network: settings.network,
    contractAddress: settings.contractAddress,
  };
}

export async function revokeCertificateOnChain(
  certificateId: string,
  onSubmitted: (transactionHash: string) => Promise<void>,
): Promise<BlockchainTransactionResult> {
  const { settings, provider, contract } = await getRegistry();
  const onChainId = getCertificateOnChainId(certificateId);
  const proof = (await contract
    .getFunction("certificates")(onChainId)) as readonly [
    string,
    string,
    bigint,
    boolean,
  ];
  if (proof[2] === 0n) {
    throw new Error("Certificate has no blockchain registration.");
  }
  if (proof[3]) {
    return {
      transactionHash: null,
      blockNumber: null,
      network: settings.network,
      contractAddress: settings.contractAddress,
      alreadyRevoked: true,
    };
  }
  const transaction = await contract
    .getFunction("revokeCertificate")(onChainId);
  await onSubmitted(transaction.hash);

  const receipt = await transaction.wait(settings.confirmations);
  if (!receipt) {
    throw new Error("Blockchain revocation has not been confirmed yet.");
  }
  if (receipt.status !== 1) {
    throw new Error("Blockchain revocation transaction reverted.");
  }

  const connectedChain = await provider.getNetwork();
  if (connectedChain.chainId !== BigInt(settings.chainId)) {
    throw new Error("Blockchain provider connected to an unexpected network.");
  }

  return {
    transactionHash: transaction.hash,
    blockNumber: receipt.blockNumber.toString(),
    network: settings.network,
    contractAddress: settings.contractAddress,
  };
}

export async function getCertificateProofFromChain(
  certificateId: string,
): Promise<OnChainCertificateProof> {
  try {
    const { contract } = await getReadOnlyRegistry();
    const proof = (await contract.getFunction("certificates")(
      getCertificateOnChainId(certificateId),
    )) as readonly [string, string, bigint, boolean];
    return {
      fileHash: proof[0],
      issuer: proof[1],
      registeredAt: proof[2],
      revoked: proof[3],
    };
  } catch {
    throw new BlockchainServiceError();
  }
}

export async function getBlockchainHealth() {
  try {
    const { settings, provider } = await getReadOnlyRegistry();
    return {
      network: settings.network,
      chainId: settings.chainId.toString(),
      contractAddress: settings.contractAddress,
      blockNumber: await provider.getBlockNumber(),
    };
  } catch {
    throw new BlockchainServiceError();
  }
}

export async function getTransactionConfirmation(transactionHash: string) {
  if (!/^0x[0-9a-fA-F]{64}$/.test(transactionHash)) {
    throw new Error("Blockchain transaction hash is invalid.");
  }
  try {
    const { provider } = await getReadOnlyRegistry();
    const receipt = await provider.getTransactionReceipt(transactionHash);
    if (!receipt) return { status: "pending" as const, blockNumber: null };
    if (receipt.status !== 1) {
      return {
        status: "failed" as const,
        blockNumber: receipt.blockNumber.toString(),
      };
    }
    return {
      status: "confirmed" as const,
      blockNumber: receipt.blockNumber.toString(),
    };
  } catch {
    throw new BlockchainServiceError();
  }
}
