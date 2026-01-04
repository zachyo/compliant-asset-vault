// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IVerifier {
    function verifyProof(
        uint[2] calldata a,
        uint[2][2] calldata b,
        uint[2] calldata c,
        uint[1] calldata input
    ) external view returns (bool);
}

interface IKYCSBT {
    function mint(address to) external returns (uint256);

    function balanceOf(address owner) external view returns (uint256);
}

interface IRWARegistry {
    function assets(
        uint256 tokenId
    )
        external
        view
        returns (
            string memory assetType,
            uint256 value,
            string memory metadataJson,
            bool isRegulated,
            uint256 timestamp,
            address creator
        );
}

interface AggregatorV3Interface {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

contract CompliantAssetVault is Ownable, ReentrancyGuard {
    IVerifier public verifier;
    IERC20 public yieldToken;
    IKYCSBT public kycSbt;
    AggregatorV3Interface public priceFeed;
    IRWARegistry public registry;

    struct Stake {
        uint256 tokenId;
        address owner;
        uint256 startTime;
    }

    function isVerified(address user) public view returns (bool) {
        return kycSbt.balanceOf(user) > 0;
    }

    mapping(uint256 => Stake) public stakes;
    mapping(address => uint256) public pendingYield;

    uint256 public constant BASE_APY = 5; // 5% base APY
    uint256 public totalValueLocked; // Total value of staked assets in USD

    event AssetDeposited(address indexed user, uint256 tokenId);
    event AssetWithdrawn(address indexed user, uint256 tokenId);
    event YieldClaimed(address indexed user, uint256 amount);
    event UserVerified(address indexed user, uint256 identityCommitment);
    event OracleUpdated(address indexed priceFeed);

    constructor(
        address _verifier,
        address _yieldToken,
        address _kycSbt,
        address _priceFeed,
        address _registry
    ) Ownable(msg.sender) {
        verifier = IVerifier(_verifier);
        yieldToken = IERC20(_yieldToken);
        kycSbt = IKYCSBT(_kycSbt);
        priceFeed = AggregatorV3Interface(_priceFeed);
        registry = IRWARegistry(_registry);
    }

    function setPriceFeed(address _priceFeed) external onlyOwner {
        priceFeed = AggregatorV3Interface(_priceFeed);
        emit OracleUpdated(_priceFeed);
    }

    function setRegistry(address _registry) external onlyOwner {
        registry = IRWARegistry(_registry);
    }

    function getLatestPrice() public view returns (int256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }

    function verifyUser(
        uint[2] calldata a,
        uint[2][2] calldata b,
        uint[2] calldata c,
        uint[1] calldata input
    ) external {
        // input[0] is the identityCommitment
        require(verifier.verifyProof(a, b, c, input), "Invalid ZK proof");
        require(!isVerified(msg.sender), "Already verified");

        kycSbt.mint(msg.sender);
        emit UserVerified(msg.sender, input[0]);
    }

    function deposit(
        address rwaContract,
        uint256 tokenId
    ) external nonReentrant {
        require(isVerified(msg.sender), "User not verified");

        IERC721(rwaContract).transferFrom(msg.sender, address(this), tokenId);

        stakes[tokenId] = Stake({
            tokenId: tokenId,
            owner: msg.sender,
            startTime: block.timestamp
        });

        // Update TVL
        if (address(registry) != address(0)) {
            (, uint256 value, , , , ) = registry.assets(tokenId);
            totalValueLocked += value;
        }

        emit AssetDeposited(msg.sender, tokenId);
    }

    function withdraw(
        address rwaContract,
        uint256 tokenId
    ) external nonReentrant {
        require(stakes[tokenId].owner == msg.sender, "Not the owner");

        _updateYield(msg.sender, tokenId);

        // Update TVL
        if (address(registry) != address(0)) {
            (, uint256 value, , , , ) = registry.assets(tokenId);
            totalValueLocked -= value;
        }

        delete stakes[tokenId];
        IERC721(rwaContract).transferFrom(address(this), msg.sender, tokenId);

        emit AssetWithdrawn(msg.sender, tokenId);
    }

    function claimYield() external nonReentrant {
        require(isVerified(msg.sender), "User not verified");

        uint256 amount = pendingYield[msg.sender];
        require(amount > 0, "No yield to claim");

        pendingYield[msg.sender] = 0;
        yieldToken.transfer(msg.sender, amount);

        emit YieldClaimed(msg.sender, amount);
    }

    function _updateYield(address user, uint256 tokenId) internal {
        Stake storage s = stakes[tokenId];
        if (s.startTime > 0) {
            uint256 duration = block.timestamp - s.startTime;

            // Dynamic yield calculation using Oracle data
            // For demo: (duration * base_yield * oracle_multiplier)
            // We'll use the price as a multiplier for the yield rate
            int256 price = getLatestPrice();
            uint256 multiplier = price > 0 ? uint256(price) : 1e8; // Default to 1 if oracle fails

            // yield = (duration * 1e18 * multiplier) / (3600 * 1e8)
            // This makes the yield dynamic based on the oracle price
            uint256 yield = (duration * 1e18 * multiplier) / (3600 * 1e8);

            pendingYield[user] += yield;
            s.startTime = block.timestamp;
        }
    }
}
