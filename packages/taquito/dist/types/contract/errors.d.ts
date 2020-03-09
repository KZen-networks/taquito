import BigNumber from "bignumber.js";
export declare class NotEnoughFundsError implements Error {
    address: string;
    balance: BigNumber;
    required: BigNumber;
    name: string;
    message: string;
    constructor(address: string, balance: BigNumber, required: BigNumber);
}
export declare class InvalidParameterError implements Error {
    smartContractMethodName: string;
    sigs: any[];
    args: any[];
    name: string;
    message: string;
    constructor(smartContractMethodName: string, sigs: any[], args: any[]);
}
export declare class InvalidDelegationSource implements Error {
    source: string;
    name: string;
    message: string;
    constructor(source: string);
}
