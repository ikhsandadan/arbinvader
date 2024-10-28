// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Spaceships is ERC721URIStorage {
    uint256 public tokenCounter;
    address payable public admin;
    
    struct SpaceshipStats {
        uint256 hp;
        uint256 maxEnergy;
        uint256 energyRegen;
        uint256 laserWidth;
        uint256 laserDamage;
        uint256 bullet;
        uint256 width;
        uint256 height;
        uint256 maxFrame;
    }
    
    struct SpaceshipVisuals {
        string name;
        string icon;
        string images;
        string laserColor;
    }
    
    struct Spaceship {
        address owner;
        SpaceshipStats stats;
        SpaceshipVisuals visuals;
    }
    
    mapping(uint256 => Spaceship) public spaceships;
    
    constructor() ERC721("Spaceships", "SPS") {
        tokenCounter = 1;
        admin = payable(msg.sender);
    }
    
    function createSpaceship(
        SpaceshipVisuals memory _visuals,
        SpaceshipStats memory _stats
    ) public payable returns (uint256) {
        require(msg.value > 0, "You must send some ether to create a spaceship");
        
        uint256 newItemId = tokenCounter;
        _safeMint(msg.sender, newItemId);
        
        spaceships[newItemId] = Spaceship({
            owner: msg.sender,
            stats: _stats,
            visuals: _visuals
        });
        
        tokenCounter++;
        admin.transfer(msg.value);
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
    
    function getUserSpaceships(address user) public view returns (Spaceship[] memory) {
        uint256[] memory userTokenIds = getUserTokenIds(user);
        Spaceship[] memory userSpaceships = new Spaceship[](userTokenIds.length);
        
        for (uint256 i = 0; i < userTokenIds.length; i++) {
            userSpaceships[i] = spaceships[userTokenIds[i]];
        }
        return userSpaceships;
    }
}