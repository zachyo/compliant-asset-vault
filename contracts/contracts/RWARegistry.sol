// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RWARegistry is Ownable {
    struct AssetMetadata {
        string assetType;
        uint256 value;
        string metadataJson;
        bool isRegulated;
        uint256 timestamp;
        address creator;
    }

    mapping(uint256 => AssetMetadata) public assets;
    uint256[] public allAssetIds;

    event AssetRegistered(
        uint256 indexed tokenId,
        string assetType,
        uint256 value,
        address creator
    );

    constructor() Ownable(msg.sender) {}

    function registerAsset(
        uint256 tokenId,
        string memory assetType,
        uint256 value,
        string memory metadataJson,
        bool isRegulated
    ) external {
        // In a production environment, we might want to restrict this to the RWAAsset contract
        assets[tokenId] = AssetMetadata({
            assetType: assetType,
            value: value,
            metadataJson: metadataJson,
            isRegulated: isRegulated,
            timestamp: block.timestamp,
            creator: msg.sender
        });
        allAssetIds.push(tokenId);

        emit AssetRegistered(tokenId, assetType, value, msg.sender);
    }

    function getAsset(
        uint256 tokenId
    ) external view returns (AssetMetadata memory) {
        return assets[tokenId];
    }

    function getAllAssets() external view returns (uint256[] memory) {
        return allAssetIds;
    }
}
