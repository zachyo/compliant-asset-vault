// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RWAAsset is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    mapping(uint256 => bool) public isRegulated;

    constructor(
        address initialOwner
    ) ERC721("RWA Asset", "RWAA") Ownable(initialOwner) {}

    function mint(
        address to,
        string memory uri,
        bool regulated
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        isRegulated[tokenId] = regulated;
        return tokenId;
    }
}
