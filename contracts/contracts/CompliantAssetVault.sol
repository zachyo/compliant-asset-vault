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

contract CompliantAssetVault is Ownable, ReentrancyGuard {
    IVerifier public verifier;
    IERC20 public yieldToken;
    IKYCSBT public kycSbt;

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

    uint256 public constant APY = 5; // 5% simulated APY

    event AssetDeposited(address indexed user, uint256 tokenId);
    event AssetWithdrawn(address indexed user, uint256 tokenId);
    event YieldClaimed(address indexed user, uint256 amount);
    event UserVerified(address indexed user, uint256 identityCommitment);

    constructor(
        address _verifier,
        address _yieldToken,
        address _kycSbt
    ) Ownable(msg.sender) {
        verifier = IVerifier(_verifier);
        yieldToken = IERC20(_yieldToken);
        kycSbt = IKYCSBT(_kycSbt);
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

        emit AssetDeposited(msg.sender, tokenId);
    }

    function withdraw(
        address rwaContract,
        uint256 tokenId
    ) external nonReentrant {
        require(stakes[tokenId].owner == msg.sender, "Not the owner");

        _updateYield(msg.sender, tokenId);

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
            // Simple yield calculation for demo: 1 token per hour (simulated)
            uint256 yield = (duration * 1e18) / 3600;
            pendingYield[user] += yield;
            s.startTime = block.timestamp;
        }
    }
}
