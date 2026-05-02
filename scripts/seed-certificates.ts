/**
 * Seed three pre-curated Trust Certificates by calling the live
 * /api/certificates endpoint. Idempotent: it writes a manifest file
 * (data/certificates/_seed.json) mapping logical names → ids so reruns
 * skip already-seeded entries.
 *
 * Run with: npx tsx scripts/seed-certificates.ts
 */
import { promises as fs } from "node:fs"
import path from "node:path"

const BASE_URL = process.env.SEED_BASE_URL ?? "http://localhost:5000"
const MANIFEST = path.join(process.cwd(), "data", "certificates", "_seed.json")

type SeedInput = {
  key: string
  body: Record<string, unknown>
}

const CONTRACT_CLEAN = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * MeridianSecurityToken — ERC-1400-compliant security token for a
 * tokenized private credit fund. Implements partition-based transfer
 * restrictions, document management with on-chain hashes, operator
 * authorization, controller-forced transfers for regulatory action,
 * issuance controls, and partition-scoped redemption.
 */
contract MeridianSecurityToken {
    string  public name = "Meridian Private Credit Fund I";
    string  public symbol = "MPCF";
    uint8   public constant decimals = 18;
    uint256 public totalSupply;

    address public immutable controller;
    bool    public isControllable = true;
    bool    public isIssuable = true;

    // ── Partitions (ERC-1400) ──
    bytes32 public constant LOCKED_PARTITION    = keccak256("LOCKED");
    bytes32 public constant UNLOCKED_PARTITION  = keccak256("UNLOCKED");

    mapping(address => mapping(bytes32 => uint256)) internal _balanceByPartition;
    mapping(address => bytes32[]) internal _partitionsOf;

    // ── Operators ──
    mapping(address => mapping(address => bool)) internal _operators;
    mapping(bytes32 => mapping(address => mapping(address => bool))) internal _partitionOperators;

    // ── Documents ──
    struct Doc { string uri; bytes32 docHash; uint256 timestamp; }
    mapping(bytes32 => Doc) internal _documents;
    bytes32[] internal _docNames;

    event TransferByPartition(
        bytes32 indexed fromPartition,
        address operator,
        address indexed from,
        address indexed to,
        uint256 value,
        bytes data,
        bytes operatorData
    );
    event IssuedByPartition(bytes32 indexed partition, address operator, address indexed to, uint256 value);
    event RedeemedByPartition(bytes32 indexed partition, address operator, address indexed from, uint256 value);
    event AuthorizedOperator(address indexed operator, address indexed tokenHolder);
    event RevokedOperator(address indexed operator, address indexed tokenHolder);
    event AuthorizedOperatorByPartition(bytes32 indexed partition, address indexed operator, address indexed tokenHolder);
    event RevokedOperatorByPartition(bytes32 indexed partition, address indexed operator, address indexed tokenHolder);
    event DocumentUpdated(bytes32 indexed name, string uri, bytes32 documentHash);
    event ControllerTransfer(address controller, address indexed from, address indexed to, uint256 value, bytes data, bytes operatorData);
    event ControllerRedemption(address controller, address indexed tokenHolder, uint256 value, bytes data, bytes operatorData);

    modifier onlyController() {
        require(msg.sender == controller, "ERC1400: not controller");
        _;
    }

    constructor(address _controller) {
        require(_controller != address(0), "ERC1400: zero controller");
        controller = _controller;
    }

    // ── Documents ──
    function setDocument(bytes32 _name, string calldata _uri, bytes32 _documentHash) external onlyController {
        if (_documents[_name].timestamp == 0) _docNames.push(_name);
        _documents[_name] = Doc(_uri, _documentHash, block.timestamp);
        emit DocumentUpdated(_name, _uri, _documentHash);
    }

    function getDocument(bytes32 _name) external view returns (string memory, bytes32, uint256) {
        Doc memory d = _documents[_name];
        return (d.uri, d.docHash, d.timestamp);
    }

    function getAllDocuments() external view returns (bytes32[] memory) { return _docNames; }

    // ── Operators ──
    function authorizeOperator(address _operator) external {
        require(_operator != msg.sender, "ERC1400: self operator");
        _operators[msg.sender][_operator] = true;
        emit AuthorizedOperator(_operator, msg.sender);
    }

    function revokeOperator(address _operator) external {
        _operators[msg.sender][_operator] = false;
        emit RevokedOperator(_operator, msg.sender);
    }

    function authorizeOperatorByPartition(bytes32 _partition, address _operator) external {
        _partitionOperators[_partition][msg.sender][_operator] = true;
        emit AuthorizedOperatorByPartition(_partition, _operator, msg.sender);
    }

    function revokeOperatorByPartition(bytes32 _partition, address _operator) external {
        _partitionOperators[_partition][msg.sender][_operator] = false;
        emit RevokedOperatorByPartition(_partition, _operator, msg.sender);
    }

    function isOperator(address _operator, address _tokenHolder) public view returns (bool) {
        return _operator == _tokenHolder || _operators[_tokenHolder][_operator] || _operator == controller;
    }

    function isOperatorForPartition(bytes32 _partition, address _operator, address _tokenHolder) public view returns (bool) {
        return isOperator(_operator, _tokenHolder) || _partitionOperators[_partition][_tokenHolder][_operator];
    }

    // ── Transfer eligibility (canTransferByPartition) ──
    /// Returns ESC code, reason code, and destination partition.
    /// 0x51 = success, 0x50 = blocked, 0x52 = locked partition not transferable.
    function canTransferByPartition(
        address _from,
        address _to,
        bytes32 _partition,
        uint256 _value,
        bytes calldata
    ) external view returns (bytes1, bytes32, bytes32) {
        if (_to == address(0))                                         return (0x57, "INVALID_RECIPIENT", _partition);
        if (_balanceByPartition[_from][_partition] < _value)           return (0x52, "INSUFFICIENT_BALANCE", _partition);
        if (_partition == LOCKED_PARTITION)                            return (0x54, "PARTITION_LOCKED", _partition);
        return (0x51, "SUCCESS", _partition);
    }

    // ── Partitioned transfers ──
    function transferByPartition(bytes32 _partition, address _to, uint256 _value, bytes calldata _data) external returns (bytes32) {
        return _transferByPartition(_partition, msg.sender, msg.sender, _to, _value, _data, "");
    }

    function operatorTransferByPartition(
        bytes32 _partition,
        address _from,
        address _to,
        uint256 _value,
        bytes calldata _data,
        bytes calldata _operatorData
    ) external returns (bytes32) {
        require(isOperatorForPartition(_partition, msg.sender, _from), "ERC1400: not authorized operator");
        return _transferByPartition(_partition, msg.sender, _from, _to, _value, _data, _operatorData);
    }

    function _transferByPartition(
        bytes32 _partition,
        address _operator,
        address _from,
        address _to,
        uint256 _value,
        bytes memory _data,
        bytes memory _operatorData
    ) internal returns (bytes32) {
        require(_to != address(0), "ERC1400: zero recipient");
        require(_partition != LOCKED_PARTITION, "ERC1400: partition locked");
        require(_balanceByPartition[_from][_partition] >= _value, "ERC1400: insufficient partition balance");
        _balanceByPartition[_from][_partition] -= _value;
        _balanceByPartition[_to][_partition]   += _value;
        emit TransferByPartition(_partition, _operator, _from, _to, _value, _data, _operatorData);
        return _partition;
    }

    // ── Issuance ──
    function issueByPartition(bytes32 _partition, address _to, uint256 _value, bytes calldata _data) external onlyController {
        require(isIssuable, "ERC1400: not issuable");
        require(_to != address(0), "ERC1400: zero recipient");
        _balanceByPartition[_to][_partition] += _value;
        totalSupply += _value;
        emit IssuedByPartition(_partition, msg.sender, _to, _value);
        emit TransferByPartition(_partition, msg.sender, address(0), _to, _value, _data, "");
    }

    /// Permanently disables further issuance.
    function renounceIssuance() external onlyController {
        isIssuable = false;
    }

    // ── Redemption ──
    function redeemByPartition(bytes32 _partition, uint256 _value, bytes calldata _data) external {
        require(_balanceByPartition[msg.sender][_partition] >= _value, "ERC1400: insufficient balance");
        _balanceByPartition[msg.sender][_partition] -= _value;
        totalSupply -= _value;
        emit RedeemedByPartition(_partition, msg.sender, msg.sender, _value);
        emit TransferByPartition(_partition, msg.sender, msg.sender, address(0), _value, _data, "");
    }

    function operatorRedeemByPartition(bytes32 _partition, address _tokenHolder, uint256 _value, bytes calldata _operatorData) external {
        require(isOperatorForPartition(_partition, msg.sender, _tokenHolder), "ERC1400: not authorized operator");
        require(_balanceByPartition[_tokenHolder][_partition] >= _value, "ERC1400: insufficient balance");
        _balanceByPartition[_tokenHolder][_partition] -= _value;
        totalSupply -= _value;
        emit RedeemedByPartition(_partition, msg.sender, _tokenHolder, _value);
        emit TransferByPartition(_partition, msg.sender, _tokenHolder, address(0), _value, "", _operatorData);
    }

    // ── Controller-forced transfer (regulatory) ──
    function controllerTransfer(address _from, address _to, uint256 _value, bytes calldata _data, bytes calldata _operatorData) external onlyController {
        require(isControllable, "ERC1400: not controllable");
        _transferByPartition(UNLOCKED_PARTITION, msg.sender, _from, _to, _value, _data, _operatorData);
        emit ControllerTransfer(msg.sender, _from, _to, _value, _data, _operatorData);
    }

    function controllerRedeem(address _tokenHolder, uint256 _value, bytes calldata _data, bytes calldata _operatorData) external onlyController {
        require(isControllable, "ERC1400: not controllable");
        require(_balanceByPartition[_tokenHolder][UNLOCKED_PARTITION] >= _value, "ERC1400: insufficient balance");
        _balanceByPartition[_tokenHolder][UNLOCKED_PARTITION] -= _value;
        totalSupply -= _value;
        emit ControllerRedemption(msg.sender, _tokenHolder, _value, _data, _operatorData);
    }

    function balanceOfByPartition(bytes32 _partition, address _tokenHolder) external view returns (uint256) {
        return _balanceByPartition[_tokenHolder][_partition];
    }
}`

const CONTRACT_WARNING = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * AspenRanchlandREIT — Reg D 506(c) real estate investment trust token.
 * Investor cap and lockup are enforced. Accreditation flag is settable
 * by the issuer without an on-chain proof reference; relies on off-chain
 * KYC records that are not hashed into the contract state.
 */
contract AspenRanchlandREIT is ERC20, Ownable {
    uint256 public constant MAX_INVESTORS  = 1500;
    uint256 public constant TRANSFER_LOCKUP = 180 days;

    mapping(address => bool)    public accredited;
    mapping(address => uint256) public mintTimestamp;
    uint256 public investorCount;

    constructor() ERC20("Aspen Ranchland REIT", "ARR") Ownable(msg.sender) {}

    /// Issuer self-attests accreditation. No on-chain proof reference stored.
    function setAccredited(address investor, bool status) external onlyOwner {
        accredited[investor] = status;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(accredited[to], "ARR: not accredited");
        if (balanceOf(to) == 0) {
            require(investorCount < MAX_INVESTORS, "ARR: investor cap reached");
            investorCount++;
        }
        mintTimestamp[to] = block.timestamp;
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 value) internal override {
        if (from != address(0) && to != address(0)) {
            require(accredited[to], "ARR: recipient not accredited");
            require(
                block.timestamp >= mintTimestamp[from] + TRANSFER_LOCKUP,
                "ARR: lockup not expired"
            );
        }
        super._update(from, to, value);
    }
}`

const CONTRACT_MISMATCH = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * GulfRealEstateIncomeTrust — claims to be Reg D 506(c) with a 250 investor
 * cap and accredited-only enforcement. The deployed bytecode below shows
 * MAX_INVESTORS = 500 and accreditation enforcement is missing on transfer.
 */
contract GulfRealEstateIncomeTrust is ERC20, Ownable {
    // Issuer claims 250 in the offering documents; on-chain says 500.
    uint256 public constant MAX_INVESTORS  = 500;
    uint256 public constant TRANSFER_LOCKUP = 1095 days;

    mapping(address => bool)    public accredited;
    mapping(address => uint256) public mintTimestamp;
    uint256 public investorCount;

    constructor() ERC20("Gulf Real Estate Income Trust", "GREIT") Ownable(msg.sender) {}

    function setAccredited(address investor, bool status) external onlyOwner {
        accredited[investor] = status;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(accredited[to], "GREIT: not accredited");
        if (balanceOf(to) == 0) {
            require(investorCount < MAX_INVESTORS, "GREIT: investor cap reached");
            investorCount++;
        }
        mintTimestamp[to] = block.timestamp;
        _mint(to, amount);
    }

    /// Transfers do not re-check accreditation of the recipient.
    function _update(address from, address to, uint256 value) internal override {
        if (from != address(0) && to != address(0)) {
            require(
                block.timestamp >= mintTimestamp[from] + TRANSFER_LOCKUP,
                "GREIT: lockup not expired"
            );
        }
        super._update(from, to, value);
    }
}`

const SEEDS: SeedInput[] = [
  {
    key: "clean",
    body: {
      issuerName: "Meridian Capital Partners",
      tokenName: "Meridian Private Credit Fund I",
      standard: "erc-1400",
      contractAddress: "0x7a3c2d9e8b1f4a5c6d8e9f0a1b2c3d4e5f6a7b8c",
      network: "Polygon",
      claimedFacts: {
        custom: {
          partitions: "LOCKED, UNLOCKED",
          controllerEnabled: "Yes",
          issuanceCloseable: "Yes",
          documentManagement: "On-chain hash + URI",
        },
      },
      contractCode: CONTRACT_CLEAN,
    },
  },
  {
    key: "warning",
    body: {
      issuerName: "Aspen Capital Group",
      tokenName: "Aspen Ranchland REIT Series A",
      standard: "reg-d-506c",
      contractAddress: "0x9f4e3a2b1c0d5e6f7a8b9c0d1e2f3a4b5c6d7e8f",
      network: "Polygon",
      claimedFacts: {
        maxInvestors: 1500,
        transferLockupMonths: 6,
        accreditedOnly: true,
        jurisdictionWhitelist: ["US", "CA"],
      },
      contractCode: CONTRACT_WARNING,
    },
  },
  {
    key: "mismatch",
    body: {
      issuerName: "Gulf Sovereign Holdings",
      tokenName: "Gulf Real Estate Income Trust",
      standard: "reg-d-506c",
      contractAddress: "0x3d8e9f0a1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
      network: "Polygon",
      claimedFacts: {
        maxInvestors: 250,
        transferLockupMonths: 36,
        accreditedOnly: true,
        jurisdictionWhitelist: ["AE", "KY", "BVI"],
      },
      contractCode: CONTRACT_MISMATCH,
    },
  },
]

async function readManifest(): Promise<Record<string, string>> {
  try {
    const raw = await fs.readFile(MANIFEST, "utf8")
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

async function writeManifest(manifest: Record<string, string>) {
  await fs.mkdir(path.dirname(MANIFEST), { recursive: true })
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2), "utf8")
}

async function certExists(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/certificates/${id}`)
    return res.ok
  } catch {
    return false
  }
}

async function main() {
  const manifest = await readManifest()
  const force = process.argv.includes("--force")

  for (const seed of SEEDS) {
    const existingId = manifest[seed.key]
    if (!force && existingId && (await certExists(existingId))) {
      console.log(`✓ ${seed.key} already seeded (${existingId})`)
      continue
    }

    process.stdout.write(`→ Seeding ${seed.key} ... `)
    const t0 = Date.now()
    const headers: Record<string, string> = {
      "content-type": "application/json",
    }
    if (process.env.CERT_API_TOKEN) {
      headers["x-cert-token"] = process.env.CERT_API_TOKEN
    }
    const res = await fetch(`${BASE_URL}/api/certificates`, {
      method: "POST",
      headers,
      body: JSON.stringify(seed.body),
    })
    if (!res.ok) {
      console.error(`FAILED (${res.status})`)
      console.error(await res.text())
      process.exit(1)
    }
    const data = (await res.json()) as {
      id: string
      hash: string
      overallStatus: string
      score: number
    }
    manifest[seed.key] = data.id
    await writeManifest(manifest)
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
    console.log(
      `✓ ${data.id} · ${data.overallStatus.toUpperCase()} ${data.score}/100 (${elapsed}s)`
    )
    console.log(`  ${BASE_URL}/trust/${data.id}`)
  }

  console.log("\nManifest:")
  console.log(JSON.stringify(manifest, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
