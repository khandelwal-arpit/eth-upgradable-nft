<h1 align="center">
  <br>
  <a><img src="https://github.com/khandelwal-arpit/eth-upgradable-nft/blob/main/documentation/images/logo.jpg" alt="Upgradable NFT"></a>
  <br>
  Upgradable NFT Smart Contract Starter-kit
  <br>
</h1>
<h4 align="center">Production ready starter-kit for upgradable smart contract based NFT dApp.</h4>

<p align="center">
    <a alt="Solidity">
        <img src="https://img.shields.io/badge/Solidity-v0.8.2-orange" />
    </a>
    <a alt="Truffle">
        <img src="https://img.shields.io/badge/Truffle-v5.4.8-brightgreen" />
    </a>
    <a alt="Ganache-cli">
        <img src="https://img.shields.io/badge/Ganache--cli-v6.12.0-yellowgreen">
    </a>
    <a alt="Node.js">
        <img src="https://img.shields.io/badge/Node.js-v16.13-blue">  
    </a>      
    <a alt="React.js">
        <img src="https://img.shields.io/badge/React.js-v17.0.2-yellow" />
    </a>
    <a alt="Bootstrap">
        <img src="https://img.shields.io/badge/Bootstrap-v5.1.3-yellowgreen" />
    </a>
    <a alt="Metamask">
        <img src="https://img.shields.io/badge/Metamask-v10.9.3-red" />
    </a>
    <a alt="Contributions">
        <img src="https://img.shields.io/badge/contributions-welcome-orange.svg" />
    </a>
    <a alt="License">
        <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
    </a>
</p>

## Table of Contents ##
1. [Philosophy](#philosophy)
2. [NFTs](#nfts)
3. [OpenZeppelin](#openzeppelin)
4. [Application](#application)
6. [Technology](#technology)
7. [Run Locally](#running-the-app-locally)
8. [Limitations of Contract Upgrades](#limitations-of-contract-upgrades)
9. [User Interface](#User-Interface)
10. [Deployment process to Ropsten network](#steps-to-deploy-this-application-on-ropsten)
11. [Contributor](#Contributor)
12. [License](#License)

## Philosophy ##
I have been developing Blockchain dApps for over two years now and one of the things that really excited me recently was the launch of Upgradable smart contract framework by OpenZeppelin team. As always, I wanted to be an early adopter of the concept and ended up doing research on the topic and came up with this starter-kit that dApp developers can leverage to built similar dApps without ever to worry about having a static and non changeable Ethereum (for that matter any EVM compatible blockchain) smart contract. Happy reading!

## NFTs ##
Before we dive deeper into implementation details, let's just understand what NFTs are and why have they become so popular in recent times.

NFTs are short form for  'Non-fungible Tokens', a digital token that is created using blockchain technology and attached to a work of art (Or any original content) that can be anything from artwork, picture, video, music, website or even a GIF. Unlike cryptocurrencies and specifically fungible tokens, they cannot be exchanged, replaced or are not divisible. 

An NFT token linked to a work of art verifies its authenticity and assigns ownership to the creator. Anybody can mint an NFT from their art form, but this does not guarantee a sure-fire sale on the NFT marketplace. The art form must be one-of-a-kind and appealing to the digital spectrum's masses.

Some of the most famous and expensive NFTs are:

- **Everydays the First 5000 Days** - $69.3 million
- **CryptoPunk #3100** - $7.58 Million
- **CryptoPunk #7804** - $7.57 Million 
- **Crossroads** - $6.6 Million
- **Ocean Front** - $6 million

## OpenZeppelin ##
OpenZeppelin is an open-source platform for building secure dApps. The framework provides the required tools to create and automate Web3 applications. Furthermore, OpenZeppelin has big names such as the Ethereum Foundation and Coinbase among its customers. It provides security, reliability, and risk management for Ethereum projects and has the mission of “protecting the open economy”.

The OpenZeppelin tools can help smart contract developers focus on deployment rather than worrying about the development of dedicated security tools. As a result, developers could reduce the time required for shipping their products alongside resolving the concerns of security risks. Interestingly, the platform also offers tons of resources for developing, managing, and upgrading smart contracts. The thing that really made me dive deeper into OpenZeppelin was the Upgradable smart contract feature which they rolled out for production usage recently.

## Application ##
The current application is a foundation for building innovative dApps on top of EVM compatible blockchains such as Ethereum, BSC, Polygon etc. It consists of the following important folders:

<img src="https://github.com/khandelwal-arpit/eth-upgradable-nft/blob/main/documentation/images/app-structure.jpg" alt="app structure"></a>


**_contracts_**

Contains the smart contracts for an imaginary NFT collection named 'MyNFT'. You will see the following three contracts in this folder:

1. Migrations.sol : Standard OZ migration contract, helps keep track of deployment on blockchain
2. MyNFT.sol : V1 of the NFT smart contract
3. MyNFTV2.sol : V2, an upgraded version of the same smart contract

**_migrations_**

Contains the migration scripts that truffle uses while deploying the smart contracts to a network.

**_test_**

Contains all the test cases for the smart contracts present in the project.

**_client_**

Contains a React.js based frontend application that serves as starting point for creating a user interface for the dApp.

**_.openzeppelin_**

A very important folder which contains information on the deployments done and helps upgrading the smart contracts in future deployments.

## Technology ##
Following libraries were used during the development of this starter kit :

- **Solidity** - Smart Contract Programming Language [Version: 0.8.2]
- **Truffle** - Smart Contract development & migration framework [Version: 5.4.8]
- **Ganache-cli** - Local Ethereum Blockchain  [Version: v6.12.0]
- **Node.js** - Server side technology [Version: 16.13+]
- **React.js** - Frontend technology [Version: 17.0.2]
- **Bootstrap** - CSS framework [Version: 5.1.3]
- **Metamask** - Plugin to interact with Ethereum blockchain

## Running the app locally ##
The dApp can be run locally by using the following commands:

### Installation
Execute the following command (in the root directory as well as inside the client directory)
```
npm i
``` 

### Run ganache cli deterministically
It's quite useful to have Ganache CLI installed in your system to do repeated deployments without having to worry about network fluctuations or having to get ETH from faucets. Use the following command to run the CLI in deterministic mode (it helps to remember the account and their balance etc across repeated runs)
```
ganache-cli -d
```
You may use your seed phrase with a -m flag in this command as well.

### Compile Contracts
To compile the smart contract, run the following command in the root directory
```
truffle compile
```

### Migrate Contracts
To migrate the smart contract to a network, run the following command in the root directory
```
truffle migrate
```
You can use the --reset flag with migrate command in order to do a fresh deployment.

To deploy the contract to a public network, use the following command
```
truffle deploy --network ropsten
```

### Verify Smart Contract
Once the smart contract has been deployed to a public testnet or mainnet, use the following command to run the verification of source code
```
npx truffle run verify MyNFT --network ropsten
```
Replace the ropsten with relevant network before executing the command.

### Running the React UI
Run the following command from the client directory
```
npm start
```

### Run Unit Tests
To run the test cases, run the following command in the root directory
```
truffle test
```

### Run code coverage
This dApp has a Solidity code coverage plugin added as well, you may execute the same with the following command
```
truffle run coverage
```

### Current code coverage

```
--------------|----------|----------|----------|----------|----------------|
File          |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------|----------|----------|----------|----------|----------------|
 contracts/   |     82.5 |     87.5 |    85.71 |    82.93 |                |
  MyNFT.sol   |    94.87 |     87.5 |    88.24 |       95 |        143,167 |
  MyNFTV2.sol |    70.73 |     87.5 |    83.33 |    71.43 |... ,45,149,173 |
--------------|----------|----------|----------|----------|----------------|
All files     |     82.5 |     87.5 |    85.71 |    82.93 |                |
--------------|----------|----------|----------|----------|----------------|
```

## Limitations of contract upgrades ##

- **Initialization** - Upgradeable contracts cannot have a constructor. To help you run initialization code, OpenZeppelin Contracts provides the Initializable base contract that allows you to tag a method as initializer, ensuring it can be run only once. When writing an initializer, you need to take special care to manually call the initializers of all parent contracts. Initializing values of state variables, when a contract is deployed, can be placed inside the initializer functions. Please be aware that the initializer function can be called only once when a contract is first deployed.
- **Upgrading** - Due to technical limitations, when you upgrade a contract to a new version you cannot change the storage layout of that contract. This means that, if you have already declared a state variable in your contract, you cannot remove it, change its type, or declare another variable before it. Fortunately, this limitation only affects state variables. You can change the contract’s functions and events as you wish. Logic implementations can be modified without any restrictions which means that you can either modify current implementation to fix bug, remove existing functions, or adding more functions provide additional features of your project at any part of your codes
- **Upgradeable Smart Contract Libraries** - You should not be using these contracts in your OpenZeppelin Upgrades project. Instead, make sure to use @openzeppelin/contracts-upgradeable, which is an official fork of OpenZeppelin Contracts that has been modified to use initializers instead of constructors.
- **Initial Values in Field Declarations** - Solidity allows defining initial values for fields when declaring them in a contract.This is equivalent to setting these values in the constructor, and as such, will not work for upgradeable contracts. Make sure that all initial values are set in an initializer function; otherwise, any upgradeable instances will not have these fields set. It is still ok to define constant state variables, because the compiler does not reserve a storage slot for these variables, and every occurrence is replaced by the respective constant expression. 
- **Initializing the Implementation Contract** - Do not leave an implementation contract uninitialized. An uninitialized implementation contract can be taken over by an attacker, which may impact the proxy. You can either invoke the initializer manually, or you can include a constructor to automatically mark it as initialized when it is deployed
- **Modifying Your Contracts** - When writing new versions of your contracts, either due to new features or bug fixing, there is an additional restriction to observe: you cannot change the order in which the contract state variables are declared, nor their type. Violating any of these storage layout restrictions will cause the upgraded version of the contract to have its storage values mixed up, and can lead to critical errors in your application. If you need to introduce a new variable, make sure you always do so at the end.
Keep in mind that if you rename a variable, then it will keep the same value as before after upgrading. This may be the desired behavior if the new variable is semantically the same as the old one.
And if you remove a variable from the end of the contract, note that the storage will not be cleared. A subsequent update that adds a new variable will cause that variable to read the leftover value from the deleted one.

## User Interface ##
Here are the various screens of the dApp that you should be able to use once the application is setup properly:

<p align="center">
    <b>Home</b><br>
    <br>
    <img width="800" src="https://github.com/khandelwal-arpit/eth-upgradable-nft/blob/main/documentation/images/ui-1.jpg">
</p>

<p align="center">
    <b>Minting NFT</b><br>
    <br>
    <img width="800" src="https://github.com/khandelwal-arpit/eth-upgradable-nft/blob/main/documentation/images/ui-2.jpg">
</p>

<p align="center">
    <b>Confirmation of NFT mint</b><br>
    <br>
    <img width="800" src="https://github.com/khandelwal-arpit/eth-upgradable-nft/blob/main/documentation/images/ui-3.jpg">
</p>


## Steps to deploy this application on Ropsten ##

To see how the upgrade process works, after you checkout the current project, please remove the following two files:

1. contracts/MyNFTV2.sol
2. migrations/3_MyNFT_V2_migrations.js

This is required in order to deploy the first version of the smart contract. Here is a log of all the steps that I ran to deploy this application on Ropsten testnet:

### Step-1
```
truffle compile
```

### Step-2
```
truffle migrate --network ropsten --reset
```

The output of this step was:

```txt
Compiling your contracts...
===========================
✔ Fetching solc version list from solc-bin. Attempt #1
> Everything is up to date, there is nothing to compile.

Starting migrations...
======================
> Network name:    'ropsten'
> Network id:      3
> Block gas limit: 8000000 (0x7a1200)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0xefb4dfe0eecfafce183a51b8acde0965607801cebd2198f4e5370020e3be921f
   > Blocks: 2            Seconds: 100
   > contract address:    0x1f0d8731c5Cf7B7CDe7979aa0393CECaDC528Fb3
   > block number:        11842143
   > block timestamp:     1642598191
   > account:             0x07732566E3bc4983558a8942C07FfAa30d241644
   > balance:             1.303672969803172263
   > gas used:            176717 (0x2b24d)
   > gas price:           34.942040274 gwei
   > value sent:          0 ETH
   > total cost:          0.006174852531100458 ETH

   Pausing for 2 confirmations...
   ------------------------------
   > confirmation number: 1 (block: 11842144)
   > confirmation number: 2 (block: 11842145)

   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.006174852531100458 ETH


2_MyNFT_V1_migration.js
=======================

   Deploying 'MyNFT'
   -----------------
   > transaction hash:    0x99e9d3763a68e3bc6cd147e026199ebadab81f5d8a64797b7944f4d589da2867
   > Blocks: 1            Seconds: 16
   > contract address:    0xE5CC570C0C3Edc73AF1Fa58e62C161E02994F2FB
   > block number:        11842149
   > block timestamp:     1642598304
   > account:             0x07732566E3bc4983558a8942C07FfAa30d241644
   > balance:             1.20863364158982875
   > gas used:            2833617 (0x2b3cd1)
   > gas price:           33.015817049 gwei
   > value sent:          0 ETH
   > total cost:          0.093554180458936233 ETH

   Pausing for 2 confirmations...
   ------------------------------
   > confirmation number: 1 (block: 11842150)
   > confirmation number: 2 (block: 11842151)

   Deploying 'ProxyAdmin'
   ----------------------
   > transaction hash:    0x1e6acf067af0813860dd6dd7556109a139e698a6a2fb9dc5c6c1fda016f30bcc
   > Blocks: 1            Seconds: 32
   > contract address:    0xDADb043fc7285981b5eCbF9B67492485EaA8fe1c
   > block number:        11842152
   > block timestamp:     1642598343
   > account:             0x07732566E3bc4983558a8942C07FfAa30d241644
   > balance:             1.19230260655898309
   > gas used:            484020 (0x762b4)
   > gas price:           33.740413683 gwei
   > value sent:          0 ETH
   > total cost:          0.01633103503084566 ETH

   Pausing for 2 confirmations...
   ------------------------------
   > confirmation number: 1 (block: 11842153)
   > confirmation number: 2 (block: 11842154)

   Deploying 'TransparentUpgradeableProxy'
   ---------------------------------------
   > transaction hash:    0xc9e8e698f57a3ddc85aa9784e7e8876efb6b817ceb52e0ccf9c8e7dc6ec8ccdf
   > Blocks: 2            Seconds: 32
   > contract address:    0xA5674a799E1e65B4aEE07295172b3A6db2F5c9dA
   > block number:        11842156
   > block timestamp:     1642598425
   > account:             0x07732566E3bc4983558a8942C07FfAa30d241644
   > balance:             1.166833072242643088
   > gas used:            786198 (0xbff16)
   > gas price:           32.395826899 gwei
   > value sent:          0 ETH
   > total cost:          0.025469534316340002 ETH

   Pausing for 2 confirmations...
   ------------------------------
   > confirmation number: 1 (block: 11842157)
   > confirmation number: 2 (block: 11842158)
Deployed 0xA5674a799E1e65B4aEE07295172b3A6db2F5c9dA

   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.135354749806121895 ETH


Summary
=======
> Total deployments:   4
> Final cost:          0.141529602337222353 ETH
```

### Step-3
```
npx truffle run verify MyNFT --network ropsten
```

The output of this step was:

```txt
Verifying MyNFT
Verifying proxy implementation at 0xe5cc570c0c3edc73af1fa58e62c161e02994f2fb
Pass - Verified: https://ropsten.etherscan.io/address/0xA5674a799E1e65B4aEE07295172b3A6db2F5c9dA#code
Successfully verified 1 contract(s).
```
At this point our V1 of the smart contract is deployed to Ropsten and verified as well. Now we need to add the following two files back to respective directories:

1. contracts/MyNFTV2.sol
2. migrations/3_MyNFT_V2_migrations.js

The first file is the V2 of our original smart contract and second file is the deployment/migration script for the same. After these two files have been added, we can now start with Step-4.

### Step-4
```
truffle compile
```

### Step-5
```
truffle migrate --network ropsten
```

The output of this step was:

```txt
Compiling your contracts...
===========================
✔ Fetching solc version list from solc-bin. Attempt #1
> Everything is up to date, there is nothing to compile.



Starting migrations...
======================
> Network name:    'ropsten'
> Network id:      3
> Block gas limit: 8000000 (0x7a1200)


3_MyNFT_V2_migration.js
=======================
Existing Contract 0xA5674a799E1e65B4aEE07295172b3A6db2F5c9dA

   Deploying 'MyNFTV2'
   -------------------
   > transaction hash:    0xe818cb0ae0ed2dc68321b2fb5faa7b0841d9e36bc7629a73395a6e80a30c1cfd
   > Blocks: 1            Seconds: 16
   > contract address:    0xb236A426186C218155A6e86da498F92D44630e02
   > block number:        11842190
   > block timestamp:     1642599017
   > account:             0x07732566E3bc4983558a8942C07FfAa30d241644
   > balance:             1.072067605365952749
   > gas used:            2880962 (0x2bf5c2)
   > gas price:           30.759088455 gwei
   > value sent:          0 ETH
   > total cost:          0.08861576499349371 ETH

   Pausing for 2 confirmations...
   ------------------------------
   > confirmation number: 1 (block: 11842191)
   > confirmation number: 2 (block: 11842192)
Upgraded 0xA5674a799E1e65B4aEE07295172b3A6db2F5c9dA

   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.08861576499349371 ETH


Summary
=======
> Total deployments:   1
> Final cost:          0.08861576499349371 ETH
```

As you can observe, there was just one deployment needed and that ended up upgrading the TransparentUpgradeableProxy to point to the new version of the smart contract deployed at '0xb236A426186C218155A6e86da498F92D44630e02' address. The great thing about this entire process was that the end use still interacts with the same address '0xA5674a799E1e65B4aEE07295172b3A6db2F5c9dA' that we received after Step-2 i.e. the first deployment. In essence, our V2 replaced the V1 without end user noticing the change.

### Step-6
```
npx truffle run verify MyNFTV2 --network ropsten
```

The output of this step was:

```txt
Verifying MyNFTV2
Verifying proxy implementation at 0xb236a426186c218155a6e86da498f92d44630e02
Pass - Verified: https://ropsten.etherscan.io/address/0xA5674a799E1e65B4aEE07295172b3A6db2F5c9dA#code
Successfully verified 1 contract(s).
```

And with this last step, our V2 stands verified on Ropsten network and good to be used for further minting.

## Contributors ##
[Arpit Khandelwal](https://www.linkedin.com/in/arpitkhandelwal1984/)

## License ##
This project is licensed under the terms of the MIT license.