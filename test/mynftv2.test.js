// Load dependencies
const { expect } = require('chai')
const { fromWei, toWei } = require("web3-utils")
// Import utilities from Test Helpers
const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers')
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades')
const { web3 } = require('@openzeppelin/test-helpers/src/setup')
// Load compiled artifacts
const NFTV1 = artifacts.require('MyNFT')
const NFT = artifacts.require('MyNFTV2')
const { ZERO_ADDRESS } = constants

contract('NFT', (accounts) => {

    // Events expected during this test case
    const EventNames = {
        Transfer: 'Transfer',
        Approval: 'Approval',
        Paused: 'Paused',
        Unpaused: 'Unpaused',
        UriChanged: 'UriChanged'
    }

    // User accounts to be used in the test case
    const [owner, alice, bob, john, shane] = accounts

    // Contract Information
    const NAME = 'MyNFT'
    const SYMBOL = 'NFT'
    const MAX_NFTS = 1000
    const NFT_PRICE = '0.001' // in ETH
    const BASE_URI = 'https://mynft.com/'

    // Constants for testing purpose
    const INCORRECT_NFT_MINT_PRICE = toWei('0.0001', 'ether')
    const NFT_MINT_PRICE = toWei(NFT_PRICE, 'ether')
    const FIRST_TOKEN_ID = new BN('1')
    const NON_EXISTENT_TOKEN_ID = new BN('10000')

    // Smart Contract instance variable
    var tokenV1 = null
    var token = null

    // Contract initialisation function, should be called once in a test's lifetime
    async function initContract() {
        tokenV1 = await deployProxy(NFTV1, [NAME, SYMBOL, BASE_URI, MAX_NFTS, NFT_MINT_PRICE])
        token = await upgradeProxy(tokenV1.address, NFT);
        console.debug(`New NFT contract deployed - address: ${token.address}`)
    }

    before(async () => {
        await initContract()
    })

    describe("Initial State", () => {
        context('when the NFT contract is instantiated', function () {
            it('has a name', async function () {
                expect(await token.name()).to.equal(NAME)
            })

            it('has a symbol', async function () {
                expect(await token.symbol()).to.equal(SYMBOL)
            })

            it('has sale activated', async function () {
                expect(await token.isSaleActive()).is.true
            })

            it('has fixed max supply', async function () {
                expect((await token.maxSupply()).toNumber()).to.equal(MAX_NFTS)
            })

            it('has zero initial supply', async function () {
                expect((await token.totalSupply()).toNumber()).to.equal(0)
                for (const acct of accounts) {
                    expect((await token.balanceOf(acct)).toNumber()).to.equal(0)
                }
            })

            it('has each NFT price set to 0.001 ether', async () => {
                expect(fromWei(await token.pricePerToken())).to.equal(NFT_PRICE)
            })
        })
    })

    describe("setSaleActive()", () => {
        context('when non-owner tries to change sale active status', function () {
            it('reverts', async () => {
                await expectRevert(
                    token.setSaleActive(false, { from: alice }), 'Ownable: caller is not the owner',
                )
            })
        })

        context('when owner tries to change sale active status', function () {
            it('can set sale active state to false', async () => {
                await token.setSaleActive(false, { from: owner })
                expect(await token.isSaleActive()).is.false
            })

            it('can set sale active state to true', async () => {
                await token.setSaleActive(true, { from: owner })
                expect(await token.isSaleActive()).is.true
            })
        })
    })

    describe("pause()", () => {
        context('when owner tries to pause the contract', function () {
            it('deployer can pause', async function () {
                const receipt = await token.pause({ from: owner })
                expectEvent(receipt, EventNames.Paused, { account: owner })
                expect(await token.paused()).to.equal(true)
            })

            it('deployer can unpause', async function () {
                const receipt = await token.unpause({ from: owner })
                expectEvent(receipt, EventNames.Unpaused, { account: owner })
                expect(await token.paused()).to.equal(false)
            })
        })

        context('when minting with paused contract', function () {
            it('cannot mint while paused', async function () {
                await token.pause({ from: owner })
                await expectRevert(
                    token.safeMint({ from: alice, value: NFT_MINT_PRICE }),
                    'Pausable: paused -- Reason given: Pausable: paused.',
                )
                await token.unpause({ from: owner })
            })
        })

        context('when other account tries to pause the contract', function () {
            it('reverts', async function () {
                await expectRevert(
                    token.pause({ from: alice }),
                    'Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.',
                )
            })
        })

        context('when other account tries to unpause the contract', function () {
            it('reverts', async function () {
                await token.pause({ from: owner })
                await expectRevert(
                    token.unpause({ from: alice }),
                    'Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.',
                )
                await token.unpause({ from: owner })
            })
        })
    })

    describe("safeMint()", () => {
        context('when sale is in-active, on trying to mint', async function () {
            it('reverts', async function () {
                await token.setSaleActive(false, { from: owner })
                await expectRevert(
                    token.safeMint({ from: alice, value: NFT_MINT_PRICE }),
                    'Sale must be active to mint NFT',
                )
                await token.setSaleActive(true, { from: owner })
            })
        })

        context('with incorrect amount', async function () {
            it('reverts', async function () {
                await expectRevert(
                    token.safeMint({ from: alice, value: INCORRECT_NFT_MINT_PRICE }), 'Ether value sent is not correct',
                )
            })
        })

        context('with minted token', async function () {
            const firstTokenId = '0'
            before(async function () {
                ({ logs: this.logs } = await token.safeMint({ from: alice, value: NFT_MINT_PRICE }))
            })

            it('emits a Transfer event', function () {
                expectEvent.inLogs(this.logs, EventNames.Transfer, { from: ZERO_ADDRESS, to: alice })
            })

            it('creates the token', async function () {
                expect(await token.balanceOf(alice)).to.be.bignumber.equal('1')
                expect(await token.ownerOf(firstTokenId)).to.equal(alice)
            })
        })
    })

    describe("tokensOfOwner(address _owner)", () => {
        before(async function () {
            await token.safeMint({ from: alice, value: NFT_MINT_PRICE })
            await token.safeMint({ from: alice, value: NFT_MINT_PRICE })
            await token.safeMint({ from: john, value: NFT_MINT_PRICE })
            await token.safeMint({ from: john, value: NFT_MINT_PRICE })
            await token.safeMint({ from: bob, value: NFT_MINT_PRICE })
            await token.safeMint({ from: bob, value: NFT_MINT_PRICE })
        })

        context('when queried for address with no token', async function () {
            it('responds with an empty array', async function () {
                expect((await token.tokensOfOwner(shane)).length).to.equal(0)
            })
        })

        context('when queried for address with tokens', async function () {
            it('responds with an expected owned NFT count', async function () {
                expect((await token.tokensOfOwner(alice)).length).to.equal(3)
                expect((await token.tokensOfOwner(john)).length).to.equal(2)
                expect((await token.tokensOfOwner(bob)).length).to.equal(2)
            })
        })
    })

    describe("tokenURI(uint256 tokenId)", () => {
        it('reverts when queried for non existent token id', async function () {
            await expectRevert(token.tokenURI(1000), 'ERC721URIStorage: URI query for nonexistent token')
        })

        it('returns when queried for existing token id', async function () {
            const tokenId = 1
            const expectedTokenURI = BASE_URI + tokenId
            expect((await token.tokenURI(tokenId))).to.equal(expectedTokenURI)
        })
    })

    describe("setBaseURI(string memory newBaseTokenURI)", () => {
        const newURI = 'https://collectible-aliens.com/v1'
        context('when called with other user', function () {
            it('reverts', async function () {
                await expectRevert(token.setBaseURI(newURI, { from: alice }),
                    'Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.')
            })
        })

        context('when called with owner user', function () {
            it('sets the new URI', async function () {
                const tokenId = 1
                const beforeChangeURI = BASE_URI + tokenId
                expect((await token.tokenURI(tokenId))).to.equal(beforeChangeURI)

                const receipt = await token.setBaseURI(newURI, { from: owner })
                expectEvent(receipt, EventNames.UriChanged)

                const afterChangeURI = newURI + tokenId
                expect((await token.tokenURI(tokenId))).to.equal(afterChangeURI)
            })
        })
    })

    describe('withdraw()', function () {
        context('when other account tries to withdraw the balance', function () {
            it('reverts', async function () {
                await expectRevert(
                    token.withdraw({ from: alice }),
                    'Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.',
                )
            })
        })

        context('when owner tries to withdraw the balance', function () {
            before(async function () {
                ({ logs: this.logs } = await token.withdraw({ from: owner }))
            })

            it('transfers balance succesfully to owner', async function () {
                expect((await web3.eth.getBalance(token.address))).to.equal('0')
            })
        })
    })

    describe('burn(uint256 tokenId)', function () {
        it('reverts when burning a non-existent token id', async function () {
            await expectRevert(
                token.burn(NON_EXISTENT_TOKEN_ID), 'ERC721: operator query for nonexistent token -- Reason given: ERC721: operator query for nonexistent token',
            )
        })

        context('with minted tokens', function () {
            context('with burnt token', function () {
                before(async function () {
                    ({ logs: this.logs } = await token.burn(FIRST_TOKEN_ID, { from: alice }))
                })

                it('emits a Transfer event', function () {
                    expectEvent.inLogs(this.logs, EventNames.Transfer, { from: alice, to: ZERO_ADDRESS, tokenId: FIRST_TOKEN_ID })
                })

                it('emits an Approval event', function () {
                    expectEvent.inLogs(this.logs, EventNames.Approval, { approved: ZERO_ADDRESS, tokenId: FIRST_TOKEN_ID })
                })

                it('deletes the token', async function () {
                    expect(await token.balanceOf(alice)).to.be.bignumber.equal('2')
                    await expectRevert(
                        token.ownerOf(FIRST_TOKEN_ID), 'ERC721: owner query for nonexistent token',
                    )
                })

                it('reverts when burning a token id that has been deleted', async function () {
                    await expectRevert(
                        token.burn(FIRST_TOKEN_ID, { from: alice }), 'ERC721: operator query for nonexistent token -- Reason given: ERC721: operator query for nonexistent token.',
                    )
                })
            })
        })
    })

    after(() => {
        token = null
    })
})