import { Contract, Signer } from 'ethers';
import { ethers, upgrades } from 'hardhat';
import Debug from 'debug';
import { readFileSync, writeFileSync } from 'fs';
import { Counter } from '../build/types/contracts/Counter';
import { CounterAbi } from '../abis';

const logDebug = Debug('debug');
const logInfo = Debug('info');
const logErr = Debug('error');

async function main() {
    const [deployer]: Signer[] = await ethers.getSigners();
    const deployerAddr = await deployer.getAddress();

    const contrInfo: {
        proxy_addr: string;
        logic_addr: string;
        version: number;
    } = JSON.parse(readFileSync('deploy/counter.json', 'utf-8'));
    const proxyAddr1 = contrInfo.proxy_addr;
    const logicAddr1 = contrInfo.logic_addr;
    const verNum1 = contrInfo.version;

    const counter = new Contract(
        contrInfo.proxy_addr,
        CounterAbi,
        deployer,
    ) as unknown as Counter;

    const verNum2 = Number(await counter.getVersion());
    if (verNum1 !== verNum2) {
        throw `upgrade version error1: ${verNum1} ${verNum2}`;
    }

    const newCounter = await ethers.getContractFactory('Counter');
    const upgraded = await upgrades.upgradeProxy(proxyAddr1, newCounter, {
        call: {
            fn: 'updateVersion',
            args: [],
        },
    });
    await upgraded.waitForDeployment();
    const verNum3 = Number(await (upgraded as unknown as Counter).getVersion());
    if (verNum3 !== verNum2 + 1) {
        throw `upgrade version error2: ${verNum2} ${verNum3}`;
    }

    const proxyAddr2 = upgraded.target;
    const proxyAddr3 = await upgraded.getAddress();
    if (
        proxyAddr1.toLowerCase() !== proxyAddr2.toString().toLowerCase() ||
        proxyAddr2.toString().toLowerCase() !== proxyAddr3.toLowerCase()
    ) {
        throw `deploy proxy address error: ${proxyAddr1} ${proxyAddr2} ${proxyAddr3}`;
    }

    const logicAddr2 =
        await upgrades.erc1967.getImplementationAddress(proxyAddr1);
    if (logicAddr1.toLowerCase() === logicAddr2.toLowerCase()) {
        throw `deploy logic address error: ${logicAddr1} ${logicAddr2}`;
    }
    logInfo(
        `Counter be upgraded. proxy address: ${proxyAddr1}, logic address: ${logicAddr1}, deployer address is ${deployerAddr}`,
    );
    writeFileSync(
        'deploy/counter.json',
        JSON.stringify(
            {
                network: (
                    await ethers.provider.getNetwork()
                ).chainId.toString(),
                state: 'upgrade',
                version: verNum3,
                proxy_addr: proxyAddr1,
                logic_addr: logicAddr1,
                executor: deployerAddr,
            },
            null,
            2,
        ),
    );
}

main().catch((error) => {
    logErr(error);
    process.exitCode = 1;
});
