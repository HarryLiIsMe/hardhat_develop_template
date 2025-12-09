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

    const LibMath = await ethers.getContractFactory('LibMath');
    const libMath = await LibMath.deploy();
    await libMath.waitForDeployment();

    logInfo(
        `library LibMath be deployed and deployed address is ${libMath.target}, deployer address is ${deployerAddr}`,
    );

    const amount = ethers.parseEther('0.0001');

    const Counter = await ethers.getContractFactory('Counter', {
        // 这里指定外部链接的library库和其部署地址.
        libraries: {
            LibMath: libMath.target,
        },
    });
    const counter = await upgrades.deployProxy(Counter, [10], {
        kind: 'uups',
        initializer: 'initialize',
        // 因为hardhat的可升级代理部署默认不支持外部链接library, 这样会存在安全隐患.
        // 所以这里必须把unsafeAllowLinkedLibraries设置为true来手动跳过这个安全error. 否则部署会报错:
        // Error: Contract `contracts/Counter.sol:Counter` is not upgrade safe
        // contracts/LibMath.sol: Linking external libraries like `LibMath` is not yet supported
        unsafeAllowLinkedLibraries: true,
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
        `contract Counter be deployed with ${ethers.formatEther(amount)}ETH and deployed proxy address is ${proxyAddr2}, deployed logic address is ${logicAddr}, deployer address is ${deployerAddr}`,
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
                lib_math: libMath.target,
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
