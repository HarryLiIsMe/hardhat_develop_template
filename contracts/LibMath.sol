// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library LibMath {
    // 访问权限external换成public也可以.
    function add(uint256 a, uint256 b) external pure returns (uint256) {
        return a + b;
    }
}
