import { Signer } from 'ethers';
import { ethers, upgrades } from 'hardhat';
import Debug from 'debug';
import { writeFileSync } from 'fs';

const logDebug = Debug('debug');
const logInfo = Debug('info');
const logErr = Debug('error');

async function main() {
    const [deployer]: Signer[] = await ethers.getSigners();
    const deployerAddr = await deployer.getAddress();

    const amount = ethers.parseEther('0.0001');

    const Counter = await ethers.getContractFactory('Counter');
    const counter = await upgrades.deployProxy(Counter, [10], {
        kind: 'uups',
        initializer: 'initialize',
        txOverrides: {
            value: amount,
        },
    });
    await counter.waitForDeployment();

    const proxyAddr1 = counter.target;
    const proxyAddr2 = await counter.getAddress();
    const logicAddr =
        await upgrades.erc1967.getImplementationAddress(proxyAddr2);

    if (proxyAddr1.toString().toLowerCase() !== proxyAddr2.toLowerCase()) {
        throw `deploy logic address error: ${proxyAddr1} ${proxyAddr2} ${logicAddr}`;
    }

    logInfo(
        `Counter with ${ethers.formatEther(amount)}ETH and deployed proxy address: ${
            proxyAddr2
        }, logic address: ${logicAddr}, deployer address is ${deployerAddr}`,
    );

    writeFileSync(
        'deploy/counter.json',
        JSON.stringify(
            {
                network: (
                    await ethers.provider.getNetwork()
                ).chainId.toString(),
                state: 'init deploy',
                version: 1,
                proxy_addr: proxyAddr1,
                logic_addr: logicAddr,
                executor: deployerAddr,
            },
            null,
            2,
        ),
    );
}

// async function main() {
//     const [deployer]: Signer[] = await ethers.getSigners();
//     const deployerAddress = await deployer.getAddress();

//     const amount = ethers.parseEther('0.0001');

//     const counter = await ethers.deployContract('Counter', [10], {
//         value: amount,
//     });

//     await counter.waitForDeployment();

//     logInfo(
//         `Counter with ${ethers.formatEther(amount)}ETH and deployed to ${
//             counter.target
//         }, deployer address is ${deployerAddress}`,
//     );
// }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    logErr(error);
    process.exitCode = 1;
});
