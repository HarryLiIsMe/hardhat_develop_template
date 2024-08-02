import { Signer } from 'ethers';
import { ethers } from 'hardhat';

async function main() {
    const [deployer]: Signer[] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();

    const amount = ethers.parseEther('0.0001');

    const counter = await ethers.deployContract('Counter', [10], {
        value: amount,
    });

    await counter.waitForDeployment();

    console.log(
        `Counter with ${ethers.formatEther(amount)}ETH and deployed to ${
            counter.target
        }, deployer address is ${deployerAddress}`,
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
