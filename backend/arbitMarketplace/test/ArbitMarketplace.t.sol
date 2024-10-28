// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/ArbitMarketplace.sol";
import "../src/Arbitems.sol"; // NFT contract

contract ArbitMarketplaceTest is Test {
    ArbitMarketplace public marketplace;
    Arbitems public nft;
    
    address payable public admin;
    address public seller;
    address public buyer;
    address public bidder1;
    address public bidder2;

    uint256 public constant LISTING_PRICE = 1 ether;
    uint256 public constant AUCTION_DURATION = 1 days;

    function setUp() public {
        admin = payable(makeAddr("admin"));
        seller = makeAddr("seller");
        buyer = makeAddr("buyer");
        bidder1 = makeAddr("bidder1");
        bidder2 = makeAddr("bidder2");

        // Deploy NFT contract
        vm.prank(admin);
        nft = new Arbitems();

        // Deploy marketplace contract
        vm.prank(admin);
        marketplace = new ArbitMarketplace(address(nft));

        // Fund test accounts
        vm.deal(seller, 10 ether);
        vm.deal(buyer, 10 ether);
        vm.deal(bidder1, 10 ether);
        vm.deal(bidder2, 10 ether);

        // Create an NFT for testing
        vm.startPrank(seller);
        nft.createItem("Test Item", "Rare", "ipfs://test");
        nft.approve(address(marketplace), 1);
        vm.stopPrank();
    }

    function testListItem() public {
        vm.startPrank(seller);
        
        marketplace.listItem(1, "Test Item", "Rare", "ipfs://test", LISTING_PRICE, false, 0);
        
        (
            uint256 tokenId,
            string memory name,
            string memory rarity,
            string memory image,
            address itemSeller,
            uint256 price,
            bool isActive,
            bool allowBids,
            uint256 highestBid,
            address highestBidder,
            uint256 endTime
        ) = marketplace.listings(1);

        assertEq(tokenId, 1);
        assertEq(name, "Test Item");
        assertEq(rarity, "Rare");
        assertEq(image, "ipfs://test");
        assertEq(itemSeller, seller);
        assertEq(price, LISTING_PRICE);
        assertTrue(isActive);
        assertFalse(allowBids);
        assertEq(highestBid, 0);
        assertEq(highestBidder, address(0));
        assertEq(endTime, 0);

        vm.stopPrank();
    }

    function testListItemForAuction() public {
        vm.startPrank(seller);
        
        marketplace.listItem(1, "Test Item", "Rare", "ipfs://test", LISTING_PRICE, true, AUCTION_DURATION);
        
        (
            uint256 tokenId,
            string memory name,
            string memory rarity,
            string memory image,
            address itemSeller,
            uint256 price,
            bool isActive,
            bool allowBids,
            uint256 highestBid,
            address highestBidder,
            uint256 endTime
        ) = marketplace.listings(1);

        assertEq(tokenId, 1);
        assertEq(name, "Test Item");
        assertEq(rarity, "Rare");
        assertEq(image, "ipfs://test");
        assertEq(itemSeller, seller);
        assertEq(price, LISTING_PRICE);
        assertTrue(isActive);
        assertTrue(allowBids);
        assertEq(highestBid, 0);
        assertEq(highestBidder, address(0));
        assertEq(endTime, block.timestamp + AUCTION_DURATION);

        vm.stopPrank();
    }

    function testBuyItem() public {
        // List item
        vm.prank(seller);
        marketplace.listItem(1, "Test Item", "Rare", "ipfs://test", LISTING_PRICE, false, 0);

        // Buy item
        vm.startPrank(buyer);
        uint256 initialBalance = seller.balance;
        marketplace.buyItem{value: LISTING_PRICE}(1);

        // Verify purchase
        assertEq(nft.ownerOf(1), buyer);
        assertEq(seller.balance, initialBalance + LISTING_PRICE);
        
        (
            ,,,,,
            ,
            bool isActive,
            ,,,
        ) = marketplace.listings(1);
        assertFalse(isActive);
        vm.stopPrank();
    }

    function testPlaceBid() public {
        // List item for auction
        vm.prank(seller);
        marketplace.listItem(1, "Test Item", "Rare", "ipfs://test", LISTING_PRICE, true, AUCTION_DURATION);

        // Place bid
        vm.startPrank(bidder1);
        uint256 bidAmount = LISTING_PRICE + 0.1 ether;
        marketplace.placeBid{value: bidAmount}(1);

        // Verify bid
        (uint256 highestBid, address highestBidder) = marketplace.getCurrentBid(1);
        assertEq(highestBid, bidAmount);
        assertEq(highestBidder, bidder1);
        vm.stopPrank();
    }

    function testAcceptBid() public {
        // List item for auction
        vm.prank(seller);
        marketplace.listItem(1, "Test Item", "Rare", "ipfs://test", LISTING_PRICE, true, AUCTION_DURATION);

        // Place bid
        vm.prank(bidder1);
        uint256 bidAmount = LISTING_PRICE + 0.1 ether;
        marketplace.placeBid{value: bidAmount}(1);

        // Accept bid
        vm.startPrank(seller);
        uint256 initialBalance = seller.balance;
        marketplace.acceptBid(1);

        // Verify acceptance
        assertEq(nft.ownerOf(1), bidder1);
        assertEq(seller.balance, initialBalance + bidAmount);
        vm.stopPrank();
    }

    function testCancelBid() public {
        // List item for auction
        vm.prank(seller);
        marketplace.listItem(1, "Test Item", "Rare", "ipfs://test", LISTING_PRICE, true, AUCTION_DURATION);

        // Place first bid
        vm.startPrank(bidder1);
        uint256 bid1Amount = LISTING_PRICE + 0.1 ether;
        marketplace.placeBid{value: bid1Amount}(1);
        vm.stopPrank();
        
        // Place higher bid from bidder2
        vm.startPrank(bidder2);
        uint256 bid2Amount = LISTING_PRICE + 0.2 ether;
        marketplace.placeBid{value: bid2Amount}(1);
        vm.stopPrank();

        // Cancel bid for bidder1 and verify refund
        vm.startPrank(bidder1);
        uint256 balanceBeforeCancel = bidder1.balance;
        marketplace.cancelBid(1);
        
        // Verify bidder1 got their funds back
        assertEq(bidder1.balance, balanceBeforeCancel + bid1Amount);
        
        // Additional verification
        (uint256 currentBid, address currentBidder) = marketplace.getCurrentBid(1);
        assertEq(currentBid, bid2Amount);
        assertEq(currentBidder, bidder2);
        
        vm.stopPrank();
    }

    function testEndAuction() public {
        // List item for auction
        vm.prank(seller);
        marketplace.listItem(1, "Test Item", "Rare", "ipfs://test", LISTING_PRICE, true, AUCTION_DURATION);

        // Place bid
        vm.prank(bidder1);
        uint256 bidAmount = LISTING_PRICE + 0.1 ether;
        marketplace.placeBid{value: bidAmount}(1);

        // Fast forward past auction end
        vm.warp(block.timestamp + AUCTION_DURATION + 1);

        // End auction
        marketplace.endAuction(1);

        // Verify auction end
        assertEq(nft.ownerOf(1), bidder1);
        (
            ,,,,,
            ,
            bool isActive,
            ,,,
        ) = marketplace.listings(1);
        assertFalse(isActive);
    }

    function testUpdatePrice() public {
        // List item
        vm.startPrank(seller);
        marketplace.listItem(1, "Test Item", "Rare", "ipfs://test", LISTING_PRICE, false, 0);

        // Update price
        uint256 newPrice = 2 ether;
        marketplace.updatePrice(1, newPrice);

        // Verify price update
        (
            ,,,,,
            uint256 price,
            ,,,,
        ) = marketplace.listings(1);
        assertEq(price, newPrice);
        vm.stopPrank();
    }

    function testCancelListing() public {
        // List item
        vm.startPrank(seller);
        marketplace.listItem(1, "Test Item", "Rare", "ipfs://test", LISTING_PRICE, false, 0);

        // Cancel listing
        marketplace.cancelListing(1);

        // Verify cancellation
        (
            ,,,,,
            ,
            bool isActive,
            ,,,
        ) = marketplace.listings(1);
        assertFalse(isActive);
        vm.stopPrank();
    }

    function testGetUserListings() public {
        // List multiple items
        vm.startPrank(seller);
        marketplace.listItem(1, "Test Item 1", "Rare", "ipfs://test1", LISTING_PRICE, false, 0);
        
        // Create and list another item
        nft.createItem("Test Item 2", "Rare", "ipfs://test2");
        nft.approve(address(marketplace), 2);
        marketplace.listItem(2, "Test Item 2", "Rare", "ipfs://test2", LISTING_PRICE, false, 0);

        // Get user listings
        ArbitMarketplace.ListItem[] memory listings = marketplace.getUserListings(seller);
        assertEq(listings.length, 2);
        assertEq(listings[0].tokenId, 1);
        assertEq(listings[1].tokenId, 2);
        vm.stopPrank();
    }

    function testGetAllListings() public {
        // List multiple items from different sellers
        vm.startPrank(seller);
        marketplace.listItem(1, "Test Item 1", "Rare", "ipfs://test1", LISTING_PRICE, false, 0);
        vm.stopPrank();

        // Create and list another item from buyer
        vm.startPrank(buyer);
        nft.createItem("Test Item 2", "Rare", "ipfs://test2");
        nft.approve(address(marketplace), 2);
        marketplace.listItem(2, "Test Item 2", "Rare", "ipfs://test2", LISTING_PRICE, false, 0);
        vm.stopPrank();

        // Get all listings
        ArbitMarketplace.ListItem[] memory listings = marketplace.getAllListings();
        assertEq(listings.length, 2);
    }

    // Test failure cases
    function testFailListItemNotOwner() public {
        vm.prank(buyer);
        marketplace.listItem(1, "Test Item", "Rare", "ipfs://test", LISTING_PRICE, false, 0);
    }

    function testFailBuyItemIncorrectPrice() public {
        vm.prank(seller);
        marketplace.listItem(1, "Test Item", "Rare", "ipfs://test", LISTING_PRICE, false, 0);

        vm.prank(buyer);
        marketplace.buyItem{value: LISTING_PRICE - 0.1 ether}(1);
    }

    function testFailBidLowerThanHighest() public {
        vm.prank(seller);
        marketplace.listItem(1, "Test Item", "Rare", "ipfs://test", LISTING_PRICE, true, AUCTION_DURATION);

        vm.prank(bidder1);
        marketplace.placeBid{value: LISTING_PRICE + 0.2 ether}(1);

        vm.prank(bidder2);
        marketplace.placeBid{value: LISTING_PRICE + 0.1 ether}(1);
    }

    receive() external payable {}
}