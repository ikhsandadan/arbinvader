// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameStats {
    // Struct to store user statistics
    struct UserStats {
        uint256 gamesPlayed;
        uint256 bestScore;
        string spaceship;
    }

    // Error definition
    error NotAuthorized();

    // Storage variables
    address public admin;
    mapping(address => UserStats) private usersStats;
    address[] private userAddresses;

    // Events
    event GameSessionSaved(
        address indexed user,
        uint256 score,
        string spaceship
    );

    constructor() {
        admin = msg.sender;
    }

    // Modifier for admin-only functions
    modifier onlyAdmin() {
        if (msg.sender != admin) {
            revert NotAuthorized();
        }
        _;
    }

    // Save game session stats
    function saveGameSession(uint256 score, string memory newSpaceship)
        external
    {
        UserStats storage stats = usersStats[msg.sender];

        if (stats.gamesPlayed == 0) {
            // New user
            userAddresses.push(msg.sender);
            stats.gamesPlayed = 1;
            stats.bestScore = score;
            stats.spaceship = newSpaceship;
        } else {
            // Existing user
            stats.gamesPlayed += 1;
            if (score > stats.bestScore) {
                stats.bestScore = score;
            }
            stats.spaceship = newSpaceship;
        }

        emit GameSessionSaved(msg.sender, score, newSpaceship);
    }

    // View function to get single user stats
    function getUserStats(address user)
        external
        view
        returns (
            uint256 gamesPlayed,
            uint256 bestScore,
            string memory spaceship
        )
    {
        UserStats memory stats = usersStats[user];
        return (stats.gamesPlayed, stats.bestScore, stats.spaceship);
    }

    // Struct for returning all users stats
    struct UserStatsView {
        address addr;
        uint256 gamesPlayed;
        uint256 bestScore;
        string spaceship;
    }

    // View function to get all users stats
    function getAllUserStats() external view returns (UserStatsView[] memory) {
        UserStatsView[] memory allStats = new UserStatsView[](
            userAddresses.length
        );

        for (uint256 i = 0; i < userAddresses.length; i++) {
            address userAddr = userAddresses[i];
            UserStats memory stats = usersStats[userAddr];

            allStats[i] = UserStatsView({
                addr: userAddr,
                gamesPlayed: stats.gamesPlayed,
                bestScore: stats.bestScore,
                spaceship: stats.spaceship
            });
        }

        return allStats;
    }
}