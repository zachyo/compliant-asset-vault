// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KYCSBT is ERC721, Ownable {
    uint256 private _nextTokenId;

    event KYCVerified(address indexed user, uint256 tokenId);

    constructor(
        address initialOwner
    ) ERC721("KYC Soulbound Token", "KYCSBT") Ownable(initialOwner) {}

    function mint(address to) public onlyOwner returns (uint256) {
        require(balanceOf(to) == 0, "User already has a KYC token");
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        emit KYCVerified(to, tokenId);
        return tokenId;
    }

    // Soulbound: prevent transfers
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("SBT: Transfer not allowed");
        }
        return super._update(to, tokenId, auth);
    }
}
