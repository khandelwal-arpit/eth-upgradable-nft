const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { toWei } = require("web3-utils")
const MyNFT = artifacts.require('MyNFT');

// Token Information
const NAME = 'MyNFT'
const SYMBOL = 'NFT'
const MAX_NFTS = 1000
const NFT_PRICE = toWei('0.001', 'ether') // in ETH
const BASE_URI = "https://mynft.com/"

module.exports = async function (deployer) {
  const instance = await deployProxy(MyNFT, [NAME, SYMBOL, BASE_URI, MAX_NFTS, NFT_PRICE], { deployer });
  console.log('Deployed', instance.address);
};
