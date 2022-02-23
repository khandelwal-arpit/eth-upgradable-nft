const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const MyNFT = artifacts.require('MyNFT');
const MyNFTV2 = artifacts.require('MyNFTV2');

module.exports = async function (deployer) {
  const existing = await MyNFT.deployed();
  console.log('Existing Contract', existing.address);
  const instance = await upgradeProxy(existing.address, MyNFTV2, { deployer });
  console.log("Upgraded", instance.address);
};
