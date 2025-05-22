
-include .env

.PHONY: all test clean deploy fund help install snapshot format anvil 

DEFAULT_ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

help:
	@echo "Usage:"
	@echo "  make deploy [ARGS=...]\n    example: make deploy ARGS=\"--network sepolia\""
	@echo ""
	@echo "  make fund [ARGS=...]\n    example: make deploy ARGS=\"--network sepolia\""

all: clean remove install update build

# Clean the repo
clean  :; forge clean

# Remove modules
remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"

install :; forge install foundry-rs/forge-std@v1.9.6 --no-commit && forge install openzeppelin/openzeppelin-contracts --no-commit

# Update Dependencies
update:; forge update

build:; forge build --via-ir

test :; forge test 

coverage :; forge coverage --report debug > coverage-report.txt

snapshot :; forge snapshot

format :; forge fmt

anvil :; anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 1

NETWORK_ARGS := --rpc-url http://localhost:8545 --private-key $(DEFAULT_ANVIL_KEY) --broadcast

ifeq ($(findstring --network sepolia,$(ARGS)),--network sepolia)
	NETWORK_ARGS := --rpc-url $(SEPOLIA_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvv
endif

deploy:
	@forge script script/DeployMoodNft.s.sol:DeployMoodNft $(NETWORK_ARGS) --via-ir


# THIS IS AN ANVIL GLOBALLY KNOWN PRIVATE KEY!!
setup-anvil:
	forge script script/SetupAnvil.s.sol --rpc-url http://127.0.0.1:8545 --private-key ${DEFAULT_ANVIL_KEY} --via-ir --broadcast -vvv

setup-sepolia:
	forge script script/SetupAnvil.s.sol --rpc-url $(SEPOLIA_RPC_URL) --private-key ${PRIVATE_KEY} --via-ir --broadcast -vvv

anvil: 
	anvil --dump-state marketplace-anvil.json

mint-usdc:
	forge script script/MintUSDC.s.sol --rpc-url http://127.0.0.1:8545 --private-key ${DEFAULT_ANVIL_KEY} --via-ir --broadcast -vvv

mint-usdc-sepolia:
	forge script script/MintUSDC.s.sol --rpc-url  $(SEPOLIA_RPC_URL) --private-key ${PRIVATE_KEY} --via-ir --broadcast -vvv