// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title MockVerifier
 * @notice A mock verifier contract for testing purposes that always returns true
 */
contract MockVerifier {
    function verifyProof(
        uint[2] calldata,
        uint[2][2] calldata,
        uint[2] calldata,
        uint[1] calldata
    ) external pure returns (bool) {
        return true;
    }
}
