// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface ICounter {
    function getNumber() external view returns (uint256);
    function setNumber(uint256 newNumber) external;
    function increment() external;
}
