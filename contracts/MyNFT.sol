// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

contract MyNFT is Initializable, ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable, PausableUpgradeable, OwnableUpgradeable, ERC721BurnableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    using SafeMathUpgradeable for uint256;

    CountersUpgradeable.Counter private _tokenIdCounter;
    
    // Contract private variables
    bool private _isSaleActive;
    uint256 private _pricePerToken;
    uint256 private _maxSupply;
    string private _baseTokenURI;

    /**
     * @dev Emitted when the base URI is changed.
     */
    event UriChanged();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(string memory name, string memory symbol, string memory baseTokenURI, uint256 maxTokenSupply, uint256 tokenPrice) initializer public {
        __ERC721_init(name, symbol);
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __Pausable_init();
        __Ownable_init();
        __ERC721Burnable_init();

        _isSaleActive = true;
        _baseTokenURI = baseTokenURI;
        _maxSupply = maxTokenSupply;
        _pricePerToken = tokenPrice;
    }


    /// @dev This method should be invoked from WEB3 for minting a new NFT
    function safeMint() public payable {
        uint256 tokenId = _tokenIdCounter.current();

        require(_isSaleActive, "Sale must be active to mint NFT");
        require(tokenId.add(1) <= _maxSupply, "Purchase would exceed max supply of NFTs");
        require(_pricePerToken <= msg.value, "Ether value sent is not correct");

        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }

    /// @notice Returns a list of all NFT IDs assigned to an address.
    /// @param _owner The owner whose NFTs we are interested in.
    /// @dev This method MUST NEVER be called by smart contract code. First, it's fairly
    ///  expensive (it walks the entire Kitty array looking for cats belonging to owner),
    ///  but it also returns a dynamic array, which is only supported for web3 calls, and
    ///  not contract-to-contract calls.
    function tokensOfOwner(address _owner) public view returns(uint256[] memory ownerTokens) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 resultIndex = 0;

            // We count on the fact that all cats have IDs starting at 1 and increasing
            // sequentially up to the totalCat count.
            uint256 index;
            for (index = 0; index < tokenCount; index++) {
                result[resultIndex] = tokenOfOwnerByIndex(_owner ,index);
                resultIndex++;
            }
            return result;
        }
    }

    /// @param isActive Sale status param.
    /// @dev This method should be invoked from WEB3 for setting sale active status
    function setSaleActive(bool isActive) public onlyOwner {
        _isSaleActive = isActive;
    }

    /// @param newBaseTokenURI New base token URI.
    /// @dev This method should be invoked from WEB3 for setting base token URI
    function setBaseURI(string memory newBaseTokenURI) public onlyOwner {
        _baseTokenURI = newBaseTokenURI;
        emit UriChanged();
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /// @dev This method should be invoked from WEB3 from owner's account to PAUSE the smart contract
    function pause() public onlyOwner {
        _pause();
    }

    /// @dev This method should be invoked from WEB3 from owner's account to UNPAUSE the smart contract
    function unpause() public onlyOwner {
        _unpause();
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /// @dev This method should be invoked from WEB3 for getting current sale active status
    function isSaleActive() public view returns (bool) {
        return _isSaleActive;
    }

    /// @dev Method for getting price required for minting per NFT token
    function pricePerToken() public view returns (uint256) {
        return _pricePerToken;
    }

    /// @dev Method for getting max supply count
    function maxSupply() public view returns (uint256) {
        return _maxSupply;
    }

    /// @dev Method for getting base URI for tokens
    function baseURI() public view returns (string memory) {
        return _baseTokenURI;
    }
}
