import './App.css';
import React, { Component } from 'react'
import { Button, Container, Row, Col, Card, ListGroup, ListGroupItem } from 'react-bootstrap'

// Libraries
import Web3 from "web3"

// Components
import NFT from './components/NFT/NFT'
import Wallet from './components/Wallet/Wallet'

// Layout
import Layout from "./layout/Layout"

// State
import AppState from './App.state'

// Configuration
import configData from "./config.json"

// Contracts
import MyNFT from './build/contracts/MyNFT.json'
var contract = require("@truffle/contract")
const myNFT = contract(MyNFT)
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = AppState
    }

    componentDidMount = async () => {
        await this.isEthereumBrowser()
        if (window.web3) {
            await this.setAppState({ web3: window.web3 })
            await this.instantiateContracts()
        }
    }

    isEthereumBrowser = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            alert("Non ethereum browser detected!");
        }
    }

    // Contract Instantiation
    instantiateContracts = async () => {
        this.state.web3.eth.getAccounts(async (error, accounts) => {
            // Get accounts, set web3 and currentAddress
            var web3 = this.state.web3
            web3.eth.defaultAccount = accounts[0]
            await this.setAppState({
                web3: web3,
                wallet: Object.assign({}, this.state.wallet, {
                    address: web3.eth.defaultAccount || AppState.currentAddress
                })
            })

            // Defaults and Providers
            const contractDefaults = {
                from: this.state.wallet.address,
                // gas: 27661108635,
                // gasPrice: web3.utils.toWei('17', "gwei")
            }
            myNFT.defaults(contractDefaults)
            myNFT.setProvider(this.state.web3.currentProvider)

            // Instantiation
            try {
                await this.instantiateNFT()
                await this.updateState()
            }
            catch (error) {
                this.setAppState({ hasError: true })
                console.log(error)
            }
        })
    }

    instantiateNFT = async () => {
        var instance
        switch (configData.ENVIRONMENT) {
            case 'GANACHE-CLI':
                instance = await myNFT.deployed()
                break;
            case 'ROPSTEN':
                instance = await myNFT.at(configData.CONTRACT_ADDRESS)
                break;
            default:
                instance = await myNFT.deployed()
                break;
        }
        return this.setNFTState({ instance: instance })
    }

    // UI Update
    updateState = async () => {
        await this.updateWallet()
        await this.updateNFT()
    }

    updateNFT = async () => {
        if (this.state.nft.instance) {
            await this.setNFTState({ address: this.state.nft.instance.address })
            const owner = await this.state.nft.instance.owner()
            if (owner) {
                await this.setNFTState({ owner: owner })
            }
            const totalSupply = await this.state.nft.instance.totalSupply()
            if (totalSupply) {
                await this.setNFTState({ supply: totalSupply.toString() })
            }
            const maxSupply = await this.state.nft.instance.maxSupply()
            if (maxSupply) {
                await this.setNFTState({ maxSupply: maxSupply.toString() })
            }
            const nft_mint_price = await this.state.nft.instance.pricePerToken()
            if (nft_mint_price) {
                await this.setNFTState({ nftPrice: this.state.web3.utils.fromWei(nft_mint_price, "ether") })
            }
            const saleActiveStatus = await this.state.nft.instance.isSaleActive()
            await this.setNFTState({ isSaleActive: saleActiveStatus ? 'Yes' : 'No' })
        }
    }

    updateWallet = async () => {
        const userEthBalance = await this.state.web3.eth.getBalance(this.state.wallet.address)
        await this.setWalletState({ ethBalance: this.state.web3.utils.fromWei(userEthBalance, "ether") })

        const userNFTBalance = await this.state.nft.instance.balanceOf(this.state.wallet.address)
        await this.setWalletState({ nft_balance: userNFTBalance.toString() })

        const userOwnedNFTs = await this.state.nft.instance.tokensOfOwner(this.state.wallet.address)
        await this.setWalletState({ nfts: userOwnedNFTs.toString() })
    }

    // State Management
    setAppState = async (newState) => {
        await this.setState(Object.assign({}, this.state, newState))
    }

    setWalletState = async (newState) => {
        await this.setState(Object.assign({}, this.state, { wallet: Object.assign({}, this.state.wallet, newState) }))
    }

    setNFTState = async (newState) => {
        await this.setState(Object.assign({}, this.state, { nft: Object.assign({}, this.state.nft, newState) }))
    }

    // UI EventHandlers
    mintNFT = async () => {
        await this.state.nft.instance.safeMint({ value: this.state.web3.utils.toWei("0.001", "ether") })
        await this.updateState()
    }

    burnNFT = async () => {
        // Retrieve first available token from user
        const nftId = parseInt(this.state.wallet.nfts.split(',')[0])
        try {
            // Step-2 : Have the ERC20 contract execute transfer of NFT to blackhole address
            await this.state.erc20.instance.burnToken(this.state.nft.address, nftId, ZERO_ADDRESS)
        } catch (e) {
            // There is a known bug which sometimes causes this to fail during BN conversion
            // https://github.com/trufflesuite/truffle/issues/1729
            console.log(e)
        }
        await this.updateState()
    }

    // Generates random number between range 1 to max
    getRandomInt(max) {
        return Math.floor(Math.random() * max).toString();
    }

    render() {
        return (
            <Layout>
                <Container>
                    <Row xs={1} md={2} className="g-4">
                        <Col >
                            <Wallet wallet={this.state.wallet} />
                        </Col>
                        <Col>
                            <Card bg={'success'} text={'white'} border="success" style={{ width: '10rem' }}>
                                <Card.Header>Operations</Card.Header>
                                <ListGroup className="list-group-flush">
                                    <ListGroupItem><Button variant="primary" size="sm" onClick={this.mintNFT}>Mint NFT</Button></ListGroupItem>
                                    <ListGroupItem><Button variant="danger" size="sm" onClick={this.burnNFT}>Burn NFT</Button></ListGroupItem>
                                </ListGroup>
                            </Card>
                        </Col>
                        <Col >
                            <NFT nft={this.state.nft} />
                        </Col>
                    </Row>
                </Container>
            </Layout>
        )
    }
}

/*function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}*/

export default App;
