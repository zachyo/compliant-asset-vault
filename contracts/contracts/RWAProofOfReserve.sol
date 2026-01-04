// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

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

contract RWAProofOfReserve is Ownable {
    AggregatorV3Interface public porFeed;
    uint256 public lastUpdate;

    event ReserveUpdated(int256 amount, uint256 timestamp);

    constructor(address _porFeed) Ownable(msg.sender) {
        porFeed = AggregatorV3Interface(_porFeed);
    }

    function setPoRFeed(address _porFeed) external onlyOwner {
        porFeed = AggregatorV3Interface(_porFeed);
    }

    /**
     * @notice Returns the latest reserve amount from the oracle
     * @return answer The reserve amount (e.g., total USD value of backing assets)
     */
    function getLatestReserve() public view returns (int256) {
        (, int256 answer, , , ) = porFeed.latestRoundData();

        return answer;
    }

    /**
     * @notice Checks if the total supply is backed by reserves
     * @param totalSupply The current on-chain supply of tokenized assets
     * @return bool True if reserves >= totalSupply
     */
    function isFullyBacked(uint256 totalSupply) external view returns (bool) {
        int256 reserves = getLatestReserve();
        if (reserves < 0) return false;
        return uint256(reserves) >= totalSupply;
    }
}
