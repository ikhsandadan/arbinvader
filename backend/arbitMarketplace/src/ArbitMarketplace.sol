// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract ArbitMarketplace is ReentrancyGuard {
    IERC721 public nftContract;

    struct ListItem {
        uint256 tokenId;
        string name;
        string rarity;
        string image;
        address seller;
        uint256 price;
        bool isActive;
        bool allowBids;
        uint256 highestBid;
        address highestBidder;
        uint256 endTime;
    }

    struct Bid {
        address bidder;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(uint256 => ListItem) public listings;
    mapping(address => uint256[]) private userListings;
    mapping(uint256 => Bid[]) public itemBids;
    mapping(uint256 => mapping(address => uint256)) public bidderToAmount;

    uint256[] private listedTokenIds;

    event ItemListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price,
        bool allowBids
    );
    event ItemSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );
    event ListingCancelled(uint256 indexed tokenId, address indexed seller);
    event PriceUpdated(uint256 indexed tokenId, uint256 newPrice);
    event BidPlaced(
        uint256 indexed tokenId,
        address indexed bidder,
        uint256 amount
    );
    event BidAccepted(
        uint256 indexed tokenId,
        address indexed bidder,
        uint256 amount
    );
    event BidCancelled(uint256 indexed tokenId, address indexed bidder);
    event BidRefunded(
        uint256 indexed tokenId,
        address indexed bidder,
        uint256 amount
    );

    constructor(address _nftContract) {
        nftContract = IERC721(_nftContract);
    }

    function listItem(
        uint256 _tokenId,
        string memory _name,
        string memory _rarity,
        string memory _image,
        uint256 _price,
        bool _allowBids,
        uint256 _auctionDuration
    ) public {
        require(nftContract.ownerOf(_tokenId) == msg.sender, "Not the owner");
        require(_price > 0, "Price must be greater than 0");
        require(!listings[_tokenId].isActive, "Item already listed");

        // Verify approval
        require(
            nftContract.getApproved(_tokenId) == address(this) ||
                nftContract.isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved"
        );

        uint256 endTime = _allowBids ? block.timestamp + _auctionDuration : 0;

        listings[_tokenId] = ListItem({
            tokenId: _tokenId,
            name: _name,
            rarity: _rarity,
            image: _image,
            seller: msg.sender,
            price: _price,
            isActive: true,
            allowBids: _allowBids,
            highestBid: 0,
            highestBidder: address(0),
            endTime: endTime
        });

        userListings[msg.sender].push(_tokenId);
        listedTokenIds.push(_tokenId);

        emit ItemListed(_tokenId, msg.sender, _price, _allowBids);
    }

    function buyItem(uint256 _tokenId) public payable nonReentrant {
        ListItem storage listing = listings[_tokenId];
        require(listing.isActive, "Item not listed for sale");
        require(msg.value == listing.price, "Incorrect price");
        require(
            msg.sender != listing.seller,
            "Seller cannot buy their own item"
        );
        require(
            !listing.allowBids || block.timestamp >= listing.endTime,
            "Item is in bidding period"
        );

        if (listing.highestBidder != address(0)) {
            payable(listing.highestBidder).transfer(listing.highestBid);
        }

        payable(listing.seller).transfer(msg.value);

        nftContract.transferFrom(listing.seller, msg.sender, _tokenId);
        _removeListing(_tokenId);

        emit ItemSold(_tokenId, listing.seller, msg.sender, listing.price);
    }

    function placeBid(uint256 _tokenId) public payable nonReentrant {
        ListItem storage listing = listings[_tokenId];
        require(
            listing.isActive && listing.allowBids,
            "Item not available for bidding"
        );
        require(block.timestamp < listing.endTime, "Bidding period has ended");
        require(
            msg.sender != listing.seller,
            "Seller cannot bid on their own item"
        );
        require(
            msg.value > listing.highestBid,
            "Bid must be higher than current bid"
        );

        if (listing.highestBidder != address(0)) {
            payable(listing.highestBidder).transfer(listing.highestBid);
        }

        listing.highestBid = msg.value;
        listing.highestBidder = msg.sender;

        itemBids[_tokenId].push(
            Bid({
                bidder: msg.sender,
                amount: msg.value,
                timestamp: block.timestamp
            })
        );

        bidderToAmount[_tokenId][msg.sender] = msg.value;

        emit BidPlaced(_tokenId, msg.sender, msg.value);
    }

    function acceptBid(uint256 _tokenId) public nonReentrant {
        ListItem storage listing = listings[_tokenId];
        require(msg.sender == listing.seller, "Only seller can accept bid");
        require(listing.highestBidder != address(0), "No bids to accept");
        require(
            listing.isActive && listing.allowBids,
            "Item not available for bidding"
        );

        address winner = listing.highestBidder;
        uint256 winningBid = listing.highestBid;

        nftContract.transferFrom(listing.seller, winner, _tokenId);
        payable(listing.seller).transfer(winningBid);

        _removeListing(_tokenId);

        emit BidAccepted(_tokenId, winner, winningBid);
    }

    function cancelBid(uint256 _tokenId) public nonReentrant {
        ListItem storage listing = listings[_tokenId];
        require(
            listing.isActive && listing.allowBids,
            "Item not available for bidding"
        );
        require(bidderToAmount[_tokenId][msg.sender] > 0, "No bid found");
        require(
            msg.sender != listing.highestBidder,
            "Highest bidder cannot cancel bid"
        );

        uint256 bidAmount = bidderToAmount[_tokenId][msg.sender];
        bidderToAmount[_tokenId][msg.sender] = 0;
        payable(msg.sender).transfer(bidAmount);

        emit BidCancelled(_tokenId, msg.sender);
    }

    function endAuction(uint256 _tokenId) public nonReentrant {
        ListItem storage listing = listings[_tokenId];
        require(listing.isActive && listing.allowBids, "Not an active auction");
        require(
            block.timestamp >= listing.endTime,
            "Auction still in progress"
        );

        if (listing.highestBidder != address(0)) {
            nftContract.transferFrom(
                listing.seller,
                listing.highestBidder,
                _tokenId
            );
            payable(listing.seller).transfer(listing.highestBid);
            emit BidAccepted(
                _tokenId,
                listing.highestBidder,
                listing.highestBid
            );
        }

        _removeListing(_tokenId);
    }

    function updatePrice(uint256 _tokenId, uint256 _newPrice) public {
        require(listings[_tokenId].seller == msg.sender, "Not the seller");
        require(listings[_tokenId].isActive, "Item not listed");
        require(_newPrice > 0, "Price must be greater than 0");
        require(
            !listings[_tokenId].allowBids,
            "Cannot update price during auction"
        );

        listings[_tokenId].price = _newPrice;

        emit PriceUpdated(_tokenId, _newPrice);
    }

    function cancelListing(uint256 _tokenId) public nonReentrant {
        ListItem storage listing = listings[_tokenId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.isActive, "Item not listed");

        if (listing.allowBids && listing.highestBidder != address(0)) {
            payable(listing.highestBidder).transfer(listing.highestBid);
            emit BidRefunded(
                _tokenId,
                listing.highestBidder,
                listing.highestBid
            );
        }

        _removeListing(_tokenId);

        emit ListingCancelled(_tokenId, msg.sender);
    }

    function _removeListing(uint256 _tokenId) private {
        address seller = listings[_tokenId].seller;
        listings[_tokenId].isActive = false;

        // Remove from user listings
        for (uint256 i = 0; i < userListings[seller].length; i++) {
            if (userListings[seller][i] == _tokenId) {
                userListings[seller][i] = userListings[seller][
                    userListings[seller].length - 1
                ];
                userListings[seller].pop();
                break;
            }
        }

        // Remove from listedTokenIds
        for (uint256 i = 0; i < listedTokenIds.length; i++) {
            if (listedTokenIds[i] == _tokenId) {
                listedTokenIds[i] = listedTokenIds[listedTokenIds.length - 1];
                listedTokenIds.pop();
                break;
            }
        }
    }

    // View functions
    function getBidHistory(uint256 _tokenId)
        public
        view
        returns (Bid[] memory)
    {
        return itemBids[_tokenId];
    }

    function getCurrentBid(uint256 _tokenId)
        public
        view
        returns (uint256, address)
    {
        ListItem storage listing = listings[_tokenId];
        return (listing.highestBid, listing.highestBidder);
    }

    function getUserBid(uint256 _tokenId, address bidder)
        public
        view
        returns (uint256)
    {
        return bidderToAmount[_tokenId][bidder];
    }

    function getUserListings(address user)
        public
        view
        returns (ListItem[] memory)
    {
        uint256[] memory tokenIds = userListings[user];
        ListItem[] memory activeListings = new ListItem[](tokenIds.length);
        uint256 activeCount = 0;

        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (listings[tokenIds[i]].isActive) {
                activeListings[activeCount] = listings[tokenIds[i]];
                activeCount++;
            }
        }

        ListItem[] memory result = new ListItem[](activeCount);
        for (uint256 i = 0; i < activeCount; i++) {
            result[i] = activeListings[i];
        }

        return result;
    }

    function getAllListings() public view returns (ListItem[] memory) {
        uint256 totalListings = 0;

        for (uint256 i = 0; i < listedTokenIds.length; i++) {
            if (listings[listedTokenIds[i]].isActive) {
                totalListings++;
            }
        }

        ListItem[] memory allListings = new ListItem[](totalListings);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < listedTokenIds.length; i++) {
            if (listings[listedTokenIds[i]].isActive) {
                allListings[currentIndex] = listings[listedTokenIds[i]];
                currentIndex++;
            }
        }

        return allListings;
    }
}
