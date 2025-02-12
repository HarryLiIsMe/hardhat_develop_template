import { InterfaceAbi } from 'ethers';
import AbiCounter from '../build/abi/contracts/Counter.sol/Counter.json';
type ICounter = InterfaceAbi;

export { ICounter, AbiCounter as CounterAbi };
