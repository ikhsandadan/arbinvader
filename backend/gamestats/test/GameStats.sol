// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/GameStats.sol";

contract GameStatsTest is Test {
    GameStats public game;
    address public admin;
    address public user1;
    address public user2;

    function setUp() public {
        admin = makeAddr("admin");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        // Deploy contract as admin
        vm.prank(admin);
        game = new GameStats();
    }

    function testInitialState() public {
        assertEq(game.admin(), admin);
    }

    function testSaveFirstGameSession() public {
        vm.startPrank(user1);
        
        game.saveGameSession(1000, "Klaed");
        
        (uint256 gamesPlayed, uint256 bestScore, string memory spaceship) = game.getUserStats(user1);
        
        assertEq(gamesPlayed, 1);
        assertEq(bestScore, 1000);
        assertEq(spaceship, "Klaed");
        
        vm.stopPrank();
    }

    function testUpdateExistingUserStats() public {
        vm.startPrank(user1);
        
        // First game session
        game.saveGameSession(1000, "Klaed");
        
        // Second game session with higher score
        game.saveGameSession(1500, "Klaed");
        
        (uint256 gamesPlayed, uint256 bestScore, string memory spaceship) = game.getUserStats(user1);
        
        assertEq(gamesPlayed, 2);
        assertEq(bestScore, 1500);
        assertEq(spaceship, "Klaed");
        
        // Third game session with lower score (shouldn't update best score)
        game.saveGameSession(900, "Klaed");
        
        (gamesPlayed, bestScore, spaceship) = game.getUserStats(user1);
        
        assertEq(gamesPlayed, 3);
        assertEq(bestScore, 1500); // Best score should remain 150
        assertEq(spaceship, "Klaed");
        
        vm.stopPrank();
    }

    function testGetStatsForNonExistentUser() public {
        (uint256 gamesPlayed, uint256 bestScore, string memory spaceship) = game.getUserStats(user2);
        
        assertEq(gamesPlayed, 0);
        assertEq(bestScore, 0);
        assertEq(spaceship, "");
    }

    function testGetAllUserStats() public {
        // Save game sessions for multiple users
        vm.prank(user1);
        game.saveGameSession(1000, "Klaed");
        
        vm.prank(user2);
        game.saveGameSession(2000, "Klaed");
        
        GameStats.UserStatsView[] memory allStats = game.getAllUserStats();
        
        assertEq(allStats.length, 2);
        
        // Check user1's stats
        assertEq(allStats[0].addr, user1);
        assertEq(allStats[0].gamesPlayed, 1);
        assertEq(allStats[0].bestScore, 1000);
        assertEq(allStats[0].spaceship, "Klaed");
        
        // Check user2's stats
        assertEq(allStats[1].addr, user2);
        assertEq(allStats[1].gamesPlayed, 1);
        assertEq(allStats[1].bestScore, 2000);
        assertEq(allStats[1].spaceship, "Klaed");
    }

    function testEmitGameSessionSavedEvent() public {
        vm.startPrank(user1);
        
        vm.expectEmit(true, false, false, true);
        emit GameStats.GameSessionSaved(user1, 1000, "Klaed");
        
        game.saveGameSession(1000, "Klaed");
        
        vm.stopPrank();
    }

    function testMultipleUsersWithMultipleSessions() public {
        // User1 plays multiple games
        vm.startPrank(user1);
        game.saveGameSession(1000, "Klaed");
        game.saveGameSession(1500, "Klaed");
        vm.stopPrank();

        // User2 plays one game
        vm.prank(user2);
        game.saveGameSession(2000, "Nairan");

        // Check individual stats
        (uint256 gamesPlayed1, uint256 bestScore1, string memory spaceship1) = game.getUserStats(user1);
        (uint256 gamesPlayed2, uint256 bestScore2, string memory spaceship2) = game.getUserStats(user2);

        // Assert User1's stats
        assertEq(gamesPlayed1, 2);
        assertEq(bestScore1, 1500);
        assertEq(spaceship1, "Klaed");

        // Assert User2's stats
        assertEq(gamesPlayed2, 1);
        assertEq(bestScore2, 2000);
        assertEq(spaceship2, "Nairan");

        // Check all stats together
        GameStats.UserStatsView[] memory allStats = game.getAllUserStats();
        assertEq(allStats.length, 2);
    }
}