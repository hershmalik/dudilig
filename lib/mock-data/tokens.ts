import { Token } from "@/lib/types"

export const tokens: Token[] = [
  {
    id: "tok-001",
    name: "Meridian Private Credit Fund I",
    type: "private-credit",
    totalRaise: 45000000,
    jurisdiction: "Cayman Islands",
    standard: "ERC-1400",
    network: "Polygon",
    contractAddress: "0x742dF4b8e77eDf3c9B2a1E4d6F8c3A09f2e1b3a2",
    deploymentBlock: 54821049,
    maxInvestors: 250,
    currentInvestors: 187,
    transferLockupMonths: 12,
    accreditedOnly: true,
    complianceScore: 94,
    attestationStatus: "verified",
    lastAttested: "2026-04-25T14:32:00Z",
  },
  {
    id: "tok-002",
    name: "APAC Pre-IPO Equity Basket",
    type: "pre-ipo-equity",
    totalRaise: 12000000,
    jurisdiction: "Singapore",
    standard: "ERC-3643",
    network: "Ethereum",
    contractAddress: "0x3b9aF2c1e84D7f5a6B8e2C4d1A7f9e3c5B2d4e1f",
    deploymentBlock: 21954832,
    maxInvestors: 100,
    currentInvestors: 63,
    transferLockupMonths: 24,
    accreditedOnly: true,
    complianceScore: 78,
    attestationStatus: "pending",
    lastAttested: "2026-03-10T09:15:00Z",
  },
  {
    id: "tok-003",
    name: "Gulf Real Estate Income Trust",
    type: "real-estate",
    totalRaise: 28000000,
    jurisdiction: "ADGM",
    standard: "ERC-1400",
    network: "Polygon",
    contractAddress: "0x9c4eF6a2b7D3e1c8A5f4B2e9C1d7F3a6b8E2c4d1",
    deploymentBlock: 55102847,
    maxInvestors: 500,
    currentInvestors: 312,
    transferLockupMonths: 36,
    accreditedOnly: false,
    complianceScore: 61,
    attestationStatus: "failed",
    lastAttested: "2026-04-20T11:45:00Z",
  },
]

export const contractSolidity = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1400/ERC1400.sol";
import "./interfaces/ICompliance.sol";

contract MeridianPrivateCreditFund is ERC1400 {

    uint256 public constant MAX_INVESTORS = 250;
    uint256 public constant TRANSFER_LOCKUP = 365 days;
    bool public constant ACCREDITED_ONLY = true;

    string[] public jurisdictionWhitelist = [
        "KY", "SG", "AE", "HK", "VG", "BVI"
    ];

    mapping(address => bool) private _accreditedInvestors;
    mapping(address => uint256) private _investorSince;
    uint256 private _totalInvestors;

    ICompliance private _compliance;

    modifier onlyAccredited(address investor) {
        require(
            _accreditedInvestors[investor],
            "Investor not accredited"
        );
        _;
    }

    modifier withinInvestorCap() {
        require(
            _totalInvestors < MAX_INVESTORS,
            "Investor cap reached"
        );
        _;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        if (from != address(0)) {
            require(
                block.timestamp >= _investorSince[from] + TRANSFER_LOCKUP,
                "Transfer locked"
            );
        }
        require(
            _compliance.isJurisdictionAllowed(to),
            "Jurisdiction not permitted"
        );
        super._beforeTokenTransfer(from, to, amount);
    }
}`
