// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CertificateRegistry {
    struct CertificateProof {
        bytes32 fileHash;
        address issuer;
        uint64 registeredAt;
        bool revoked;
    }

    address public immutable owner;
    mapping(address => bool) public registrars;
    mapping(bytes32 => CertificateProof) public certificates;

    event RegistrarUpdated(address indexed registrar, bool authorized);
    event CertificateRegistered(
        bytes32 indexed certificateId,
        bytes32 indexed fileHash,
        address indexed issuer
    );
    event CertificateRevoked(
        bytes32 indexed certificateId,
        address indexed issuer,
        uint64 revokedAt
    );

    error Unauthorized();
    error InvalidInput();
    error AlreadyRegistered();
    error NotRegistered();
    error AlreadyRevoked();

    constructor() {
        owner = msg.sender;
        registrars[msg.sender] = true;
        emit RegistrarUpdated(msg.sender, true);
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyRegistrar() {
        if (!registrars[msg.sender]) revert Unauthorized();
        _;
    }

    function setRegistrar(address registrar, bool authorized) external onlyOwner {
        if (registrar == address(0)) revert InvalidInput();
        registrars[registrar] = authorized;
        emit RegistrarUpdated(registrar, authorized);
    }

    function registerCertificate(
        bytes32 certificateId,
        bytes32 fileHash
    ) external onlyRegistrar {
        if (certificateId == bytes32(0) || fileHash == bytes32(0)) {
            revert InvalidInput();
        }
        if (certificates[certificateId].registeredAt != 0) {
            revert AlreadyRegistered();
        }

        certificates[certificateId] = CertificateProof({
            fileHash: fileHash,
            issuer: msg.sender,
            registeredAt: uint64(block.timestamp),
            revoked: false
        });

        emit CertificateRegistered(certificateId, fileHash, msg.sender);
    }

    function revokeCertificate(bytes32 certificateId) external onlyRegistrar {
        CertificateProof storage proof = certificates[certificateId];
        if (proof.registeredAt == 0) revert NotRegistered();
        if (proof.revoked) revert AlreadyRevoked();

        proof.revoked = true;
        emit CertificateRevoked(
            certificateId,
            msg.sender,
            uint64(block.timestamp)
        );
    }
}
