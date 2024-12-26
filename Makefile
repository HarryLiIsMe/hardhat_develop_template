all: build


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

dep_mainet:
	pnpm run dep:mainet

task1_dev:
	pnpm run task1:dev

task1_testnet:
	pnpm run task1:testnet

task1_mainet:
	pnpm run task1:mainet
	
task2_dev:
	pnpm run task2:dev

task2_testnet:
	pnpm run task2:testnet

task2_mainet:
	pnpm run task2:mainet

verify_testnet:
	pnpm run verify:testnet

verify_mainet:
	pnpm run verify:mainet

test_dev:
	pnpm run test:dev

test_testnet:
	pnpm run test:testnet

test_mainet:
	pnpm run test:mainet

bench:

coverage:
