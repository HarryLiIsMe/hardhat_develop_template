import { task, types } from 'hardhat/config';
import type { TaskArguments } from 'hardhat/types';
import type { HardhatRuntimeEnvironment } from 'hardhat/types';

task('task1', 'task test example1')
    .addOptionalParam('arg1', 'first argument', 'hello word', types.string)
    .setAction(task1);

async function task1(args: { arg1: string }, hre: HardhatRuntimeEnvironment) {
    try {
        console.log(args.arg1);
        const [signer1] = await hre.ethers.getSigners();
        const chainID = hre.network.config.chainId!;
        const bal1 = await hre.ethers.provider.getBalance(signer1);
        console.log('signer1 address: ', await signer1.getAddress());
        console.log('signer1 balance', bal1);
        console.log('chainID: ', chainID);
    } catch (err) {
        console.log('error: ', err);
    }
}

task('task2', 'task test example2')
    .addOptionalParam('arg1', 'first argument', 'hello word', types.string)
    .setAction(task2);

async function task2(args: TaskArguments, hre: HardhatRuntimeEnvironment) {
    try {
        try {
            console.log(args.arg1);
            const [signer1] = await hre.ethers.getSigners();
            const chainID = hre.network.config.chainId!;
            const bal1 = await hre.ethers.provider.getBalance(signer1);
            console.log('signer1 address: ', await signer1.getAddress());
            console.log('signer1 balance', bal1);
            console.log('chainID: ', chainID);
        } catch (err) {
            console.log('error: ', err);
        }
    } catch (err) {
        console.log('error: ', err);
    }
}
