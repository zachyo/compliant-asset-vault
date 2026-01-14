// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IRWARegistry {
    function registerAsset(
        uint256 tokenId,
        string calldata assetType,
        uint256 value,
        string calldata metadataJson,
        bool isRegulated
    ) external;
}

contract RWAAsset is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    mapping(uint256 => bool) public isRegulated;
    IRWARegistry public registry;

    constructor(
        address initialOwner,
        address _registry
    ) ERC721("RWA Asset", "RWAA") Ownable(initialOwner) {
        registry = IRWARegistry(_registry);
    }

    function setRegistry(address _registry) external onlyOwner {
        registry = IRWARegistry(_registry);
    }

    function mint(
        address to,
        string memory uri,
        bool regulated,
        string memory assetType,
        uint256 value,
        string memory metadataJson
    ) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        isRegulated[tokenId] = regulated;

        if (address(registry) != address(0)) {
            registry.registerAsset(
                tokenId,
                assetType,
                value,
                metadataJson,
                regulated
            );
        }

        return tokenId;
    }
}
