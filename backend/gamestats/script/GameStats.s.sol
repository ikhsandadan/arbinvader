// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {GameStats} from "../src/GameStats.sol";

contract GameStatsScript is Script {
    GameStats public gameStats;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        gameStats = new GameStats();

        vm.stopBroadcast();
    }
}
