import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("CompliantAssetVault System", function () {
  async function deploySystemFixture() {
    const [owner, user, otherAccount] = await ethers.getSigners();

    // 1. Deploy Verifier (Mock for testing)
    const Verifier = await ethers.getContractFactory("MockVerifier");
    const verifier = await Verifier.deploy();

    // 2. Deploy Mock Yield Token
    const MockYieldToken = await ethers.getContractFactory("MockYieldToken");
    const yieldToken = await MockYieldToken.deploy();

    // 3. Deploy KYC SBT
    const KYCSBT = await ethers.getContractFactory("KYCSBT");
    const kycSbt = await KYCSBT.deploy(owner.address);

    // 4. Deploy RWA Registry
    const RWARegistry = await ethers.getContractFactory("RWARegistry");
    const registry = await RWARegistry.deploy();

    // 5. Deploy Mock Price Feed (Initial price 1.00 with 8 decimals)
    const MockPriceFeed = await ethers.getContractFactory("MockPriceFeed");
    const priceFeed = await MockPriceFeed.deploy(100000000);

    // 6. Deploy RWA Asset
    const RWAAsset = await ethers.getContractFactory("RWAAsset");
    const rwaAsset = await RWAAsset.deploy(
      owner.address,
      await registry.getAddress()
    );

    // 7. Deploy Vault
    const Vault = await ethers.getContractFactory("CompliantAssetVault");
    const vault = await Vault.deploy(
      await verifier.getAddress(),
      await yieldToken.getAddress(),
      await kycSbt.getAddress(),
      await priceFeed.getAddress(),
      await registry.getAddress()
    );

    // 8. Setup: Transfer KYCSBT ownership to Vault
    await kycSbt.transferOwnership(await vault.getAddress());

    // 9. Setup: Transfer some yield tokens to Vault for rewards
    await yieldToken.transfer(
      await vault.getAddress(),
      ethers.parseEther("1000")
    );

    return {
      verifier,
      yieldToken,
      kycSbt,
      rwaAsset,
      vault,
      registry,
      priceFeed,
      owner,
      user,
      otherAccount,
    };
  }

  describe("RWA Tokenization", function () {
    it("Should mint a tokenized asset with regulation flag", async function () {
      const { rwaAsset, user, owner } = await loadFixture(deploySystemFixture);
      const uri = "ipfs://test";

      await rwaAsset.mint(
        user.address,
        uri,
        true,
        "RealEstate",
        ethers.parseEther("100000"),
        "{}"
      );

      expect(await rwaAsset.ownerOf(0)).to.equal(user.address);
      expect(await rwaAsset.tokenURI(0)).to.equal(uri);
      expect(await rwaAsset.isRegulated(0)).to.be.true;
    });

    it("Should only allow owner to mint", async function () {
      const { rwaAsset, user } = await loadFixture(deploySystemFixture);
      await expect(
        rwaAsset
          .connect(user)
          .mint(
            user.address,
            "uri",
            true,
            "RealEstate",
            ethers.parseEther("100000"),
            "{}"
          )
      ).to.be.revertedWithCustomError(rwaAsset, "OwnableUnauthorizedAccount");
    });
  });

  describe("KYC Soulbound Token", function () {
    it("Should not allow transfers (Soulbound)", async function () {
      const { kycSbt, vault, user, otherAccount } = await loadFixture(
        deploySystemFixture
      );

      // Vault mints to user (via internal call, but we simulate for test)
      // We need to temporarily make vault the owner or use the vault's verifyUser
      // But here we test the SBT logic directly by having owner mint if they were owner
      // Since ownership was transferred to vault, we use the vault to trigger it

      // Mock ZK proof call (Verifier always returns true)
      await vault.connect(user).verifyUser(
        [0, 0],
        [
          [0, 0],
          [0, 0],
        ],
        [0, 0],
        [0]
      );

      expect(await kycSbt.balanceOf(user.address)).to.equal(1);

      await expect(
        kycSbt.connect(user).transferFrom(user.address, otherAccount.address, 0)
      ).to.be.revertedWith("SBT: Transfer not allowed");
    });
  });

  describe("Vault Operations", function () {
    it("Should only allow verified users to deposit", async function () {
      const { vault, rwaAsset, user } = await loadFixture(deploySystemFixture);

      await rwaAsset.mint(
        user.address,
        "uri",
        true,
        "RealEstate",
        ethers.parseEther("100000"),
        "{}"
      );
      await rwaAsset.connect(user).approve(await vault.getAddress(), 0);

      await expect(
        vault.connect(user).deposit(await rwaAsset.getAddress(), 0)
      ).to.be.revertedWith("User not verified");
    });

    it("Should allow verified users to deposit and withdraw", async function () {
      const { vault, rwaAsset, user } = await loadFixture(deploySystemFixture);

      // Verify user
      await vault.connect(user).verifyUser(
        [0, 0],
        [
          [0, 0],
          [0, 0],
        ],
        [0, 0],
        [0]
      );

      // Mint and Deposit
      await rwaAsset.mint(
        user.address,
        "uri",
        true,
        "RealEstate",
        ethers.parseEther("100000"),
        "{}"
      );
      await rwaAsset.connect(user).approve(await vault.getAddress(), 0);
      await vault.connect(user).deposit(await rwaAsset.getAddress(), 0);

      expect(await rwaAsset.ownerOf(0)).to.equal(await vault.getAddress());

      // Withdraw
      await vault.connect(user).withdraw(await rwaAsset.getAddress(), 0);
      expect(await rwaAsset.ownerOf(0)).to.equal(user.address);
    });

    it("Should accumulate yield over time", async function () {
      const { vault, rwaAsset, yieldToken, user } = await loadFixture(
        deploySystemFixture
      );

      await vault.connect(user).verifyUser(
        [0, 0],
        [
          [0, 0],
          [0, 0],
        ],
        [0, 0],
        [0]
      );
      await rwaAsset.mint(
        user.address,
        "uri",
        true,
        "RealEstate",
        ethers.parseEther("100000"),
        "{}"
      );
      await rwaAsset.connect(user).approve(await vault.getAddress(), 0);
      await vault.connect(user).deposit(await rwaAsset.getAddress(), 0);

      // Fast forward 1 hour
      await ethers.provider.send("evm_increaseTime", [3600]);
      await ethers.provider.send("evm_mine", []);

      await vault.connect(user).withdraw(await rwaAsset.getAddress(), 0);

      const yieldEarned = await vault.pendingYield(user.address);
      expect(yieldEarned).to.be.gt(0);

      const initialBalance = await yieldToken.balanceOf(user.address);
      await vault.connect(user).claimYield();
      const finalBalance = await yieldToken.balanceOf(user.address);

      expect(finalBalance).to.be.gt(initialBalance);
    });
  });
});
