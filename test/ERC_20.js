const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  let MyToken, myToken;
  let owner, addr1;
  const initialSupply = ethers.parseUnits("1000", 18);

  this.beforeEach(async function () {
    MyToken = await ethers.getContractFactory("MyToken");
    [owner, addr1] = await ethers.getSigners();

    myToken = await MyToken.deploy(initialSupply);
    await myToken.waitForDeployment();
  });

  it("should assign the initial supply to the owner", async function () {
    const ownerBalance = await myToken.balanceOf(owner.address);
    expect(ownerBalance).to.equal(initialSupply);
  });

  if (
    ("should allow owner to transfer tokens",
    async function () {
      const transferAmount = ethers.parseUnits("100", 18);
      await myToken.transfer(addr1.address, transferAmount);

      expect(await myToken.balanceOf(owner.address)).to.equal(
        initialSupply.sub(transferAmount)
      );
      expect(await myToken.balanceOf(addr1.address)).to.equal(transferAmount);
    })
  );
  it("will not send money, if insufficient amount", async function () {
    const invalidAmount = ethers.parseUnits("1001", 18);

    await expect(
      myToken.transfer(addr1.address, invalidAmount)
    ).to.be.revertedWith("Insufficient balance");
  });
});
