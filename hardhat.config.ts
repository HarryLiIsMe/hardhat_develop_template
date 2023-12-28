import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'tsconfig-paths/register';
import 'hardhat-abi-exporter';
import 'hardhat-contract-sizer';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import '@nomicfoundation/hardhat-verify';
import '@openzeppelin/hardhat-upgrades';
// import '@nomiclabs/hardhat-etherscan';
// import 'hardhat-etherscan';
import 'dotenv/config';

import './tasks/test';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      accounts: [
        {
          privateKey: process.env.DEV_SECKEY,
          balance: '100000000000000000000000000',
        },
      ],
      chainId: 1024,
      mining: {
        auto: true,
        interval: 3000,
      },
    },
    local: {
      url: 'http://127.0.0.1:8545',
      accounts: [process.env.DEV_SECKEY],
      chainId: 1024,
      timeout: 3000,
    },
    testnet: {
      url: 'http://127.0.0.1:8545',
      accounts: [process.env.TESTNET_SECKEY],
      chainId: 1024,
    },
    mainnet: {
      url: 'http://127.0.0.1:8545',
      accounts: [process.env.MAINNET_SECKEY],
      chainId: 1024,
    },
  },
  etherscan: {
    apiKey: {
      testnet: process.env.TESTNET_APIKEY,
      mainnet: process.env.MAINNET_APIKEY,
    },
  },
  sourcify: {
    enabled: true,
  },
  mocha: {
    timeout: 5000,
  },
  paths: {
    sources: './contracts/',
    tests: './test',
    cache: './build/cache',
    artifacts: './build/artifacts',
  },
  abiExporter: {
    path: './build/abi',
    runOnCompile: true,
    clear: true,
    spacing: 2,
  },
  gasReporter: {
    enabled: true,
    showMethodSig: true,
    maxMethodDiff: 10,
    gasPrice: 127,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  typechain: {
    outDir: './build/types',
    target: 'ethers-v6',
  },
};

export default config;
