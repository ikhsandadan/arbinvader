// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Arbitems.sol";

contract ArbitemsTest is Test {
    Arbitems public arbitems;
    address payable public admin;
    address public user1;
    address public user2;
    address public marketplaceAddress;

    function setUp() public {
        admin = payable(makeAddr("admin"));
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        marketplaceAddress = makeAddr("marketplace");

        // Deploy contract as admin
        vm.prank(admin);
        arbitems = new Arbitems();

        // Fund test accounts
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
    }

    function getDefaultItem() internal pure returns (
        string memory name,
        string memory rarity,
        string memory image
    ) {
        return (
            "Sword",
            "Rare",
            "ipfs://defaultImage"
        );
    }

    function testInitialState() public {
        assertEq(arbitems.tokenCounter(), 1);
        assertEq(arbitems.admin(), admin);
        assertEq(arbitems.marketplaceAddress(), address(0));
    }

    function testSetMarketplace() public {
        vm.prank(admin);
        arbitems.setMarketplace(marketplaceAddress);
        assertEq(arbitems.marketplaceAddress(), marketplaceAddress);
    }

    function testFailSetMarketplaceNonAdmin() public {
        vm.prank(user1);
        arbitems.setMarketplace(marketplaceAddress);
    }

    function testCreateItem() public {
        vm.startPrank(user1);
        
        (string memory name, string memory rarity, string memory image) = getDefaultItem();
        uint256 tokenId = arbitems.createItem(name, rarity, image);

        // Verify token creation
        assertEq(tokenId, 1);
        assertEq(arbitems.tokenCounter(), 2);
        assertEq(arbitems.ownerOf(tokenId), user1);

        // Verify item data
        (
            address owner,
            uint256 returnedTokenId,
            string memory returnedName,
            string memory returnedRarity,
            string memory returnedImage
        ) = arbitems.items(tokenId);

        assertEq(owner, user1);
        assertEq(returnedTokenId, tokenId);
        assertEq(returnedName, name);
        assertEq(returnedRarity, rarity);
        assertEq(returnedImage, image);

        vm.stopPrank();
    }

    function testGetUserTokenIds() public {
        // Create multiple items for different users
        vm.startPrank(user1);
        (string memory name, string memory rarity, string memory image) = getDefaultItem();
        arbitems.createItem(name, rarity, image);
        arbitems.createItem(name, rarity, image);
        vm.stopPrank();

        vm.prank(user2);
        arbitems.createItem(name, rarity, image);

        // Get user1's tokens
        uint256[] memory user1Tokens = arbitems.getUserTokenIds(user1);
        assertEq(user1Tokens.length, 2);
        assertEq(user1Tokens[0], 1);
        assertEq(user1Tokens[1], 2);

        // Get user2's tokens
        uint256[] memory user2Tokens = arbitems.getUserTokenIds(user2);
        assertEq(user2Tokens.length, 1);
        assertEq(user2Tokens[0], 3);
    }

    function testGetUserItems() public {
        vm.startPrank(user1);
        
        // Create first item
        (string memory name1, string memory rarity1, string memory image1) = getDefaultItem();
        arbitems.createItem(name1, rarity1, image1);
        
        // Create second item with different name
        string memory name2 = "Shield";
        arbitems.createItem(name2, rarity1, image1);
        
        vm.stopPrank();

        // Get user's items
        Arbitems.Item[] memory userItems = arbitems.getUserItems(user1);
        
        assertEq(userItems.length, 2);
        assertEq(userItems[0].owner, user1);
        assertEq(userItems[0].name, name1);
        assertEq(userItems[1].name, name2);
        assertEq(userItems[0].rarity, rarity1);
        assertEq(userItems[1].rarity, rarity1);
    }

    receive() external payable {}
}