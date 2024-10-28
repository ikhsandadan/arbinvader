// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {ArbitMarketplace} from "../src/ArbitMarketplace.sol";

contract ArbitMarketplaceScript is Script {
    ArbitMarketplace public arbitMarketplace;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        arbitMarketplace = new ArbitMarketplace(address(this));

        vm.stopBroadcast();
    }
}
