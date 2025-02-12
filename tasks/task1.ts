import { task, types } from 'hardhat/config';
import type { TaskArguments } from 'hardhat/types';
import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import Debug from 'debug';
import { CounterAbi } from './abis';
import { Counter } from '../build/types/Counter';
import { Contract, TransactionReceipt, TransactionResponse } from 'ethers';

const logDebug = Debug('debug');
const logInfo = Debug('info');
const logErr = Debug('error');

task('task1', 'task test example1')
    .addOptionalParam('arg1', 'first argument', 'hello word', types.string)
    .setAction(task1);

async function task1(args: { arg1: string }, hre: HardhatRuntimeEnvironment) {
    try {
        logInfo('task test example1');

        const project_name =
            process.env.PROJECT_NAME || 'HARDHAT_DEVELOP_TEMPLATE';
        logInfo(project_name);

        logDebug(args.arg1);

        const [signer1] = await hre.ethers.getSigners();
        const chainID = hre.network.config.chainId!;
        const bal1 = await hre.ethers.provider.getBalance(signer1);
        logErr('signer1 address: ', await signer1.getAddress());
        logErr('signer1 balance', bal1);
        logInfo('chainID: ', chainID);

        const counter = new Contract(
            process.env.COUNTER_DEPLOY_ADDR!,
            CounterAbi,
            signer1,
        ) as unknown as Counter;

        logInfo('counter value: ', (await counter.number()).toString());

        logInfo('counter increment');
        let txRes: TransactionResponse = await counter.increment();
        let receipt: TransactionReceipt | null = await txRes.wait();
        if (receipt == null) {
            throw 'increment receipt get failed';
        }
        if (receipt.status != 1) {
            throw 'increment transaction failed';
        }
        logInfo('counter value: ', (await counter.number()).toString());

        logInfo('counter setNumber 99');
        txRes = await counter.setNumber(BigInt('99'));
        receipt = await txRes.wait();
        if (receipt == null) {
            throw 'setNumber receipt get failed';
        }
        if (receipt.status != 1) {
            throw 'setNumber transaction failed';
        }
        logInfo('counter value: ', (await counter.number()).toString());
    } catch (err) {
        logErr('error: ', err);
    }
}

task('task2', 'task test example2')
    .addOptionalParam('arg1', 'first argument', 'hello word', types.string)
    .setAction(task2);

async function task2(args: TaskArguments, hre: HardhatRuntimeEnvironment) {
    try {
        logInfo('task test example2');

        const project_name =
            process.env.PROJECT_NAME || 'HARDHAT_DEVELOP_TEMPLATE';
        logInfo(project_name);

        logDebug(args.arg1);

        const [signer1] = await hre.ethers.getSigners();
        const chainID = hre.network.config.chainId!;
        const bal1 = await hre.ethers.provider.getBalance(signer1);
        logErr('signer1 address: ', await signer1.getAddress());
        logErr('signer1 balance', bal1);
        logInfo('chainID: ', chainID);
    } catch (err) {
        logErr('error: ', err);
    }
}
