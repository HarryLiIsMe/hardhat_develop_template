all: build

.PHONY: build


install:
	pnpm i

update:
	pnpm up

build:
	pnpm run build

chain:
	pnpm run chain

clean:
	pnpm run clean

fmt:
	pnpm run fmt:fix

lint:
	pnpm run lint

dep_dev:
	pnpm run dep:dev

dep_testnet:
	pnpm run dep:testnet

dep_mainnet:
	pnpm run dep:mainnet

upg_dev:
	pnpm run upgrade:dev

upg_testnet:
	pnpm run upgrade:dev

upg_mainnet:
	pnpm run upgrade:testnet

task1_dev:
	pnpm run task1:dev

task1_testnet:
	pnpm run task1:testnet

task1_mainnet:
	pnpm run task1:mainnet
	
task2_dev:
	pnpm run task2:dev

task2_testnet:
	pnpm run task2:testnet

task2_mainnet:
	pnpm run task2:mainnet

verify_testnet:
	pnpm run verify:testnet

verify_mainnet:
	pnpm run verify:mainnet

test_dev:
	pnpm run test:dev

test_testnet:
	pnpm run test:testnet

test_mainnet:
	pnpm run test:mainnet

bench:

coverage:
	pnpm run coverage
