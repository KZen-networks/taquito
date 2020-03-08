"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
exports.ManagerOperationSchema = {
    branch: 'branch',
    contents: ['operation'],
};
exports.ActivationSchema = {
    pkh: 'tz1',
    secret: 'secret',
};
exports.RevealSchema = {
    source: 'pkh',
    fee: 'zarith',
    counter: 'zarith',
    gas_limit: 'zarith',
    storage_limit: 'zarith',
    public_key: 'public_key',
};
exports.DelegationSchema = {
    source: 'pkh',
    fee: 'zarith',
    counter: 'zarith',
    gas_limit: 'zarith',
    storage_limit: 'zarith',
    delegate: 'delegate',
};
exports.TransactionSchema = {
    source: 'pkh',
    fee: 'zarith',
    counter: 'zarith',
    gas_limit: 'zarith',
    storage_limit: 'zarith',
    amount: 'zarith',
    destination: 'address',
    parameters: 'parameters',
};
exports.OriginationSchema = {
    source: 'pkh',
    fee: 'zarith',
    counter: 'zarith',
    gas_limit: 'zarith',
    storage_limit: 'zarith',
    balance: 'zarith',
    delegate: 'delegate',
    script: 'script',
};
exports.BallotSchema = {
    source: 'pkh',
    period: 'int32',
    proposal: 'proposal',
    ballot: 'ballotStmt',
};
exports.EndorsementSchema = {
    level: 'int32',
};
exports.SeedNonceRevelationSchema = {
    level: 'int32',
    nonce: 'raw',
};
exports.ProposalsSchema = {
    source: 'pkh',
    period: 'int32',
    proposals: 'proposalArr',
};
exports.operationEncoder = function (encoders) { return function (operation) {
    if (!(operation.kind in encoders) || !(operation.kind in constants_1.kindMappingReverse)) {
        throw new Error("Unsupported operation kind: " + operation.kind);
    }
    return constants_1.kindMappingReverse[operation.kind] + encoders[operation.kind](operation);
}; };
exports.operationDecoder = function (decoders) { return function (value) {
    var op = value.consume(1);
    var operationName = constants_1.kindMapping[op[0]];
    var decodedObj = decoders[operationName](value);
    if (typeof decodedObj !== 'object') {
        throw new Error('Decoded invalid operation');
    }
    if (operationName) {
        return __assign({ kind: operationName }, decodedObj);
    }
    else {
        throw new Error("Unsupported operation " + op[0]);
    }
}; };
exports.schemaEncoder = function (encoders) { return function (schema) { return function (value) {
    var keys = Object.keys(schema);
    return keys.reduce(function (prev, key) {
        var valueToEncode = schema[key];
        if (Array.isArray(valueToEncode)) {
            var encoder_1 = encoders[valueToEncode[0]];
            var values = value[key];
            if (!Array.isArray(values)) {
                throw new Error("Exepected value to be Array " + JSON.stringify(values));
            }
            return prev + values.reduce(function (prevBytes, current) { return prevBytes + encoder_1(current); }, '');
        }
        else {
            var encoder = encoders[valueToEncode];
            return prev + encoder(value[key]);
        }
    }, '');
}; }; };
exports.schemaDecoder = function (decoders) { return function (schema) { return function (value) {
    var keys = Object.keys(schema);
    return keys.reduce(function (prev, key) {
        var _a, _b;
        var valueToEncode = schema[key];
        if (Array.isArray(valueToEncode)) {
            var decoder = decoders[valueToEncode[0]];
            var decoded = [];
            var lastLength = value.length();
            while (value.length() > 0) {
                decoded.push(decoder(value));
                if (lastLength === value.length()) {
                    throw new Error('Unable to decode value');
                }
            }
            return __assign(__assign({}, prev), (_a = {}, _a[key] = decoded, _a));
        }
        else {
            var decoder = decoders[valueToEncode];
            var result = decoder(value);
            if (result) {
                return __assign(__assign({}, prev), (_b = {}, _b[key] = result, _b));
            }
            else {
                return __assign({}, prev);
            }
        }
    }, {});
}; }; };
//# sourceMappingURL=operation.js.map