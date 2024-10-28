// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Spaceships.sol";

contract SpaceshipsTest is Test {
    Spaceships public spaceships;
    address payable public admin;
    address public user1;
    address public user2;

    function setUp() public {
        admin = payable(makeAddr("admin"));
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        // Deploy contract as admin
        vm.prank(admin);
        spaceships = new Spaceships();

        // Fund test accounts
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
    }

    function getDefaultStats() internal pure returns (Spaceships.SpaceshipStats memory) {
        return Spaceships.SpaceshipStats({
            hp: 100,
            maxEnergy: 100,
            energyRegen: 5,
            laserWidth: 2,
            laserDamage: 20,
            bullet: 1,
            width: 64,
            height: 64,
            maxFrame: 8
        });
    }

    function getDefaultVisuals() internal pure returns (Spaceships.SpaceshipVisuals memory) {
        return Spaceships.SpaceshipVisuals({
            name: "Klaed",
            icon: "ipfs://defaultIcon",
            images: "ipfs://defaultImages",
            laserColor: "#FF0000"
        });
    }

    function testInitialState() public {
        assertEq(spaceships.tokenCounter(), 1);
        assertEq(spaceships.admin(), admin);
    }

    function testCreateSpaceship() public {
        vm.startPrank(user1);
        uint256 mintPrice = 0.1 ether;
        uint256 initialBalance = admin.balance;

        uint256 tokenId = spaceships.createSpaceship{value: mintPrice}(
            getDefaultVisuals(),
            getDefaultStats()
        );

        // Verify token creation
        assertEq(tokenId, 1);
        assertEq(spaceships.tokenCounter(), 2);
        assertEq(spaceships.ownerOf(tokenId), user1);

        // Verify payment
        assertEq(admin.balance, initialBalance + mintPrice);

        // Verify spaceship data
        (address owner, 
         Spaceships.SpaceshipStats memory stats,
         Spaceships.SpaceshipVisuals memory visuals) = spaceships.spaceships(tokenId);

        assertEq(owner, user1);
        assertEq(stats.hp, 100);
        assertEq(stats.maxEnergy, 100);
        assertEq(visuals.name, "Klaed");
        assertEq(visuals.laserColor, "#FF0000");

        vm.stopPrank();
    }

    function testFailCreateSpaceshipWithZeroEther() public {
        vm.prank(user1);
        spaceships.createSpaceship{value: 0}(
            getDefaultVisuals(),
            getDefaultStats()
        );
    }

    function testGetUserTokenIds() public {
        // Create multiple spaceships for different users
        vm.startPrank(user1);
        spaceships.createSpaceship{value: 0.1 ether}(getDefaultVisuals(), getDefaultStats());
        spaceships.createSpaceship{value: 0.1 ether}(getDefaultVisuals(), getDefaultStats());
        vm.stopPrank();

        vm.prank(user2);
        spaceships.createSpaceship{value: 0.1 ether}(getDefaultVisuals(), getDefaultStats());

        // Get user1's tokens
        uint256[] memory user1Tokens = spaceships.getUserTokenIds(user1);
        assertEq(user1Tokens.length, 2);
        assertEq(user1Tokens[0], 1);
        assertEq(user1Tokens[1], 2);

        // Get user2's tokens
        uint256[] memory user2Tokens = spaceships.getUserTokenIds(user2);
        assertEq(user2Tokens.length, 1);
        assertEq(user2Tokens[0], 3);
    }

    function testGetUserSpaceships() public {
        // Create spaceships for user1
        vm.startPrank(user1);
        spaceships.createSpaceship{value: 0.1 ether}(getDefaultVisuals(), getDefaultStats());
        
        Spaceships.SpaceshipVisuals memory customVisuals = getDefaultVisuals();
        customVisuals.name = "Nairan";
        spaceships.createSpaceship{value: 0.1 ether}(customVisuals, getDefaultStats());
        vm.stopPrank();

        // Get user's spaceships
        Spaceships.Spaceship[] memory userSpaceships = spaceships.getUserSpaceships(user1);
        
        assertEq(userSpaceships.length, 2);
        assertEq(userSpaceships[0].owner, user1);
        assertEq(userSpaceships[0].visuals.name, "Klaed");
        assertEq(userSpaceships[1].visuals.name, "Nairan");
        assertEq(userSpaceships[0].stats.hp, 100);
        assertEq(userSpaceships[1].stats.hp, 100);
    }

    receive() external payable {}
}