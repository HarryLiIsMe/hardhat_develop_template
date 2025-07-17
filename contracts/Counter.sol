// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { ReentrancyGuardUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import { AccessControlUpgradeable } from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "./ICounter.sol";
import "./utils/VersionControl.sol";

contract Counter is
    ICounter,
    VersionControl,
    Initializable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    uint256 public number;

    // It cannot serve as initialization function, but must be marked as payable to indicate that it can receive value.
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() payable {
        _disableInitializers();
    }

    function initialize(uint256 _number) public payable initializer {
        __UUPSUpgradeable_init();
        __Ownable_init(_msgSender());
        __ReentrancyGuard_init();

        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());

        initVersion();

        number = _number;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    receive() external payable {}
    fallback() external payable {}

    function getNumber() public view returns (uint256) {
        return number;
    }

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public nonReentrant {
        number++;
    }
}
