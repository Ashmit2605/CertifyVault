const assert = require("node:assert/strict");
const { ethers } = require("hardhat");

describe("CertificateRegistry", function () {
  async function deployRegistry() {
    const [owner, registrar, other] = await ethers.getSigners();
    const registry = await ethers.deployContract("CertificateRegistry");
    await registry.waitForDeployment();
    await (await registry.setRegistrar(registrar.address, true)).wait();
    return { registry, owner, registrar, other };
  }

  it("registers and returns a certificate proof", async function () {
    const { registry, registrar } = await deployRegistry();
    const certificateId = ethers.keccak256(ethers.toUtf8Bytes("CV-2026-001"));
    const fileHash = ethers.sha256(ethers.toUtf8Bytes("final PDF bytes"));

    await (await registry.connect(registrar).registerCertificate(
      certificateId,
      fileHash,
    )).wait();

    const proof = await registry.certificates(certificateId);
    assert.equal(proof.fileHash, fileHash);
    assert.equal(proof.issuer, registrar.address);
    assert(proof.registeredAt > 0n);
    assert.equal(proof.revoked, false);
  });

  it("rejects duplicate registration and unauthorized registrars", async function () {
    const { registry, registrar, other } = await deployRegistry();
    const certificateId = ethers.keccak256(ethers.toUtf8Bytes("CV-2026-002"));
    const fileHash = ethers.sha256(ethers.toUtf8Bytes("final PDF bytes"));

    await (await registry.connect(registrar).registerCertificate(
      certificateId,
      fileHash,
    )).wait();

    await assert.rejects(
      registry.connect(registrar).registerCertificate(certificateId, fileHash),
    );
    await assert.rejects(
      registry.connect(other).registerCertificate(
        ethers.keccak256(ethers.toUtf8Bytes("CV-2026-003")),
        fileHash,
      ),
    );
  });

  it("allows an authorized registrar to revoke a proof", async function () {
    const { registry, registrar, other } = await deployRegistry();
    const certificateId = ethers.keccak256(ethers.toUtf8Bytes("CV-2026-004"));
    const fileHash = ethers.sha256(ethers.toUtf8Bytes("final PDF bytes"));
    await (await registry.connect(registrar).registerCertificate(
      certificateId,
      fileHash,
    )).wait();

    await assert.rejects(
      registry.connect(other).revokeCertificate(certificateId),
    );
    await (await registry.connect(registrar).revokeCertificate(certificateId)).wait();
    assert.equal((await registry.certificates(certificateId)).revoked, true);
  });
});
