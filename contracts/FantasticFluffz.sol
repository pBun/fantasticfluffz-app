// Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract FantasticFluffz is ERC721A, Ownable, PaymentSplitter {
    using SafeMath for uint256;

    string public constant PROVENANCE =
        "92da0a9a8bc3b69b3393751774fd0e604e20142837bccbc4301606206f151412";
    uint128 public constant MAX_SUPPLY = 1000;
    uint128 public constant MAX_PURCHASE = 20;
    uint256 public constant TOKEN_PRICE = 0.0001 ether;
    address[] private ADDRESS_LIST = [
        0xD1aDe89F8826d122F0a3Ab953Bc293E144042539,
        0x4a4F584cA801192D459aFDF93BE3aE2C627FF8a2
    ];
    uint256[] private SHARE_LIST = [50, 50];

    bool public saleStatus = true;
    string private _baseTokenURI;

    constructor(string memory baseURI)
        ERC721A("FantasticFluffz", "FLUFFZ")
        PaymentSplitter(ADDRESS_LIST, SHARE_LIST)
    {
        _baseTokenURI = baseURI;
    }

    modifier callerIsUser() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
    }

    function mintToken(uint256 numberOfTokens) public payable callerIsUser {
        require(saleStatus, "Sale must be active to mint a token");
        require(
            numberOfTokens <= MAX_PURCHASE,
            "Each wallet can only mint 20 tokens at a time"
        );
        uint256 targetTotalSupply = totalSupply().add(numberOfTokens);
        require(
            targetTotalSupply <= MAX_SUPPLY,
            "Purchase would exceed max supply of tokens"
        );
        uint256 totalCost = TOKEN_PRICE.mul(numberOfTokens);
        require(totalCost <= msg.value, "Ether value sent is too low");

        _safeMint(msg.sender, numberOfTokens);

        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function setSaleStatus(bool newSaleStatus) external onlyOwner {
        saleStatus = newSaleStatus;
    }
}
