// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {MockUSDC} from "../src/MockUSDC.sol";

contract MintUSDC is Script {
    //  address ANVIL_USDC = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
    address SEPOLIA_USDC = 0x2C032Aa43D119D7bf4Adc42583F1f94f3bf3023a;

    // address ANVIL_ONE = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address SEPOLIA_TEST_USER = 0x28556Cc7CBa0A5AF1170fB9eD4E634a811366E70;

    function run() public {
        // Load private key from env for Sepolia
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        MockUSDC usdc = MockUSDC(SEPOLIA_USDC);

        vm.startBroadcast(deployerPrivateKey);
        usdc.mint(SEPOLIA_TEST_USER, 100e6);
        vm.stopBroadcast();
    }
}
