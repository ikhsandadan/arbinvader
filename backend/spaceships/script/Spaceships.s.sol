// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Spaceships} from "../src/Spaceships.sol";

contract SpaceshipsScript is Script {
    Spaceships public spaceships;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        spaceships = new Spaceships();

        vm.stopBroadcast();
    }
}
