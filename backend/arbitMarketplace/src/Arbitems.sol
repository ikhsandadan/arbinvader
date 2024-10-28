// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Arbitems is ERC721URIStorage, ReentrancyGuard {
    uint256 public tokenCounter;
    address payable public admin;
    address public marketplaceAddress;
    
    struct Item {
        address owner;
        uint256 tokenId;
        string name;
        string rarity;
        string image;
    }
    
    mapping(uint256 => Item) public items;
    
    event MarketplaceSet(address indexed marketplace);
    
    constructor() ERC721("Arbitems", "ABI") {
        tokenCounter = 1;
        admin = payable(msg.sender);
    }

    function setMarketplace(address _marketplace) external {
        require(msg.sender == admin, "Only admin can set marketplace");
        marketplaceAddress = _marketplace;
        emit MarketplaceSet(_marketplace);
    }
    
    function createItem(
        string memory _name,
        string memory _rarity,
        string memory _image
    ) public payable returns (uint256) {
        uint256 newItemId = tokenCounter;
        _safeMint(msg.sender, newItemId);
        
        items[newItemId] = Item({
            owner: msg.sender,
            tokenId: newItemId,
            name: _name,
            rarity: _rarity,
            image: _image
        });
        
        tokenCounter++;
        return newItemId;
    }

    function getUserTokenIds(address user) public view returns (uint256[] memory) {
        uint256 userTokenCount = balanceOf(user);
        uint256[] memory userTokenIds = new uint256[](userTokenCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i < tokenCounter; i++) {
            if (ownerOf(i) == user) {
                userTokenIds[index] = i;
                index++;
            }
        }
        return userTokenIds;
    }
    
    function getUserItems(address user) public view returns (Item[] memory) {
        uint256[] memory userTokenIds = getUserTokenIds(user);
        Item[] memory userItems = new Item[](userTokenIds.length);
        
        for (uint256 i = 0; i < userTokenIds.length; i++) {
            userItems[i] = items[userTokenIds[i]];
        }
        return userItems;
    }
}