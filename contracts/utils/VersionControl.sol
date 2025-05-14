// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

abstract contract VersionControl {
    uint256 private version;

    function initVersion() internal {
        version = 1;
    }

    function getVersion() external view returns (uint256) {
        return version;
    }

    function updateVersion() external returns (uint256) {
        version++;
        return version;
    }
}
