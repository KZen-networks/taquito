"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var format_1 = require("../format");
var NotEnoughFundsError = /** @class */ (function () {
    function NotEnoughFundsError(address, balance, required) {
        this.address = address;
        this.balance = balance;
        this.required = required;
        this.name = 'Not enough funds error';
        this.message = "Not enough funds. Address " + address + " has " + format_1.format('mutez', 'tz', balance) + " XTZ, but transaction requires " + format_1.format('mutez', 'tz', required) + " XTZ.";
    }
    return NotEnoughFundsError;
}());
exports.NotEnoughFundsError = NotEnoughFundsError;
var InvalidParameterError = /** @class */ (function () {
    function InvalidParameterError(smartContractMethodName, sigs, args) {
        this.smartContractMethodName = smartContractMethodName;
        this.sigs = sigs;
        this.args = args;
        this.name = 'Invalid parameters error';
        this.message = smartContractMethodName + " Received " + args.length + " arguments while expecting on of the follow signatures (" + JSON.stringify(sigs) + ")";
    }
    return InvalidParameterError;
}());
exports.InvalidParameterError = InvalidParameterError;
var InvalidDelegationSource = /** @class */ (function () {
    function InvalidDelegationSource(source) {
        this.source = source;
        this.name = 'Invalid delegation source error';
        this.message = "Since Babylon delegation source can no longer be a contract address " + source + ". Please use the smart contract abstraction to set your delegate.";
    }
    return InvalidDelegationSource;
}());
exports.InvalidDelegationSource = InvalidDelegationSource;
//# sourceMappingURL=errors.js.map