// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Arbitems} from "../src/Arbitems.sol";

contract ArbitemsScript is Script {
    Arbitems public arbitems;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        arbitems = new Arbitems();

        vm.stopBroadcast();
    }
}
