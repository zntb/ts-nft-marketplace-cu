// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {DeployCakeNft} from "./DeployCakeNft.s.sol";
import {DeployMarketplace} from "./DeployMarketplace.s.sol";
import {DeployMoodNft} from "./DeployMoodNft.s.sol";
import {MintAndListCake} from "./MintAndListCake.s.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {MoodNft} from "../src/MoodNft.sol";

contract SetupSepolia is Script {
    DeployMarketplace deployMarketplace;
    DeployCakeNft deployCakeNft;
    DeployMoodNft deployMoodNft;
    MintAndListCake mintAndListCake;

    function run() external {
        // Load private key from env for Sepolia
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        // address deployerAddress = vm.addr(deployerPrivateKey);

        // You might want to add some test addresses for Sepolia
        address SEPOLIA_TEST_ONE = 0x28556Cc7CBa0A5AF1170fB9eD4E634a811366E70; // Replace with actual test address
        address SEPOLIA_TEST_TWO = 0x12ff199bbc384dDa90e66fBFc3b4D95bB922bF06; // Replace with actual test address

        deployMarketplace = new DeployMarketplace();
        deployCakeNft = new DeployCakeNft();
        deployMoodNft = new DeployMoodNft();
        mintAndListCake = new MintAndListCake();

        vm.startBroadcast(deployerPrivateKey);
        MockUSDC usdc = new MockUSDC();
        vm.stopBroadcast();

        console.log("USDC deployed at: ", address(usdc));

        address marketplaceAddy = address(deployMarketplace.deployMarketplace(address(usdc)));
        console.log("Marketplace deployed at: ", marketplaceAddy);

        address cakeAddy = deployCakeNft.run();
        console.log("CakeNft deployed at: ", cakeAddy);

        address moodAddy = deployMoodNft.run();
        console.log("MoodNft deployed at: ", moodAddy);

        mintAndListCake.mintAndListCake(cakeAddy, marketplaceAddy);
        mintAndListCake.mintAndListCake(cakeAddy, marketplaceAddy);
        mintAndListCake.mintAndListCake(cakeAddy, marketplaceAddy);
        mintAndListCake.mintAndListCake(cakeAddy, marketplaceAddy);

        // This is to just mine another block, otherwise the current version of the indexer bugs
        mintAndListCake.justMintCake(cakeAddy);

        vm.startBroadcast(deployerPrivateKey);
        MoodNft(moodAddy).mintNftTo(SEPOLIA_TEST_ONE);
        MoodNft(moodAddy).mintNftTo(SEPOLIA_TEST_TWO);

        usdc.mint(SEPOLIA_TEST_ONE, 100e6);
        usdc.mint(SEPOLIA_TEST_TWO, 100e6);
        usdc.mint(SEPOLIA_TEST_ONE, 100e6);
        vm.stopBroadcast();
    }
}
