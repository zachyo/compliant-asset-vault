// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Verifier {
    function verifyProof(
        uint[2] calldata /* a */,
        uint[2][2] calldata /* b */,
        uint[2] calldata /* c */,
        uint[1] calldata /* input */
    ) external pure returns (bool) {
        return true;
    }
}
