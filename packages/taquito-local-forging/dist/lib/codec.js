"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@taquito/utils");
var bignumber_js_1 = require("bignumber.js");
var constants_1 = require("./constants");
var codec_1 = require("./michelson/codec");
var uint8array_consumer_1 = require("./uint8array-consumer");
var utils_2 = require("./utils");
exports.prefixEncoder = function (prefix) { return function (str) {
    return utils_1.buf2hex(Buffer.from(utils_1.b58cdecode(str, utils_1.prefix[prefix])));
}; };
exports.prefixDecoder = function (pre) { return function (str) {
    var val = str.consume(utils_1.prefixLength[pre]);
    return utils_1.b58cencode(val, utils_1.prefix[pre]);
}; };
exports.tz1Decoder = exports.prefixDecoder(utils_1.Prefix.TZ1);
exports.branchDecoder = exports.prefixDecoder(utils_1.Prefix.B);
exports.pkhDecoder = function (val) {
    var prefix = val.consume(1);
    if (prefix[0] === 0x00) {
        return exports.prefixDecoder(utils_1.Prefix.TZ1)(val);
    }
    else if (prefix[0] === 0x01) {
        return exports.prefixDecoder(utils_1.Prefix.TZ2)(val);
    }
    else if (prefix[0] === 0x02) {
        return exports.prefixDecoder(utils_1.Prefix.TZ3)(val);
    }
};
exports.branchEncoder = exports.prefixEncoder(utils_1.Prefix.B);
exports.tz1Encoder = exports.prefixEncoder(utils_1.Prefix.TZ1);
exports.boolEncoder = function (bool) { return (bool ? 'ff' : '00'); };
exports.proposalEncoder = function (proposal) {
    return exports.prefixEncoder(utils_1.Prefix.P)(proposal);
};
exports.proposalDecoder = function (proposal) {
    return exports.prefixDecoder(utils_1.Prefix.P)(proposal);
};
exports.proposalsDecoder = function (proposal) {
    var proposals = [];
    proposal.consume(4);
    while (proposal.length() > 0) {
        proposals.push(exports.proposalDecoder(proposal));
    }
    return proposals;
};
exports.proposalsEncoder = function (proposals) {
    return utils_2.pad(32 * proposals.length) + proposals.map(function (x) { return exports.proposalEncoder(x); }).join('');
};
exports.ballotEncoder = function (ballot) {
    switch (ballot) {
        case 'yay':
            return '00';
        case 'nay':
            return '01';
        case 'pass':
            return '02';
        default:
            throw new Error("Invalid ballot value: " + ballot);
    }
};
exports.ballotDecoder = function (ballot) {
    var value = ballot.consume(1);
    switch (value[0]) {
        case 0x00:
            return 'yay';
        case 0x01:
            return 'nay';
        case 0x02:
            return 'pass';
        default:
            throw new Error("Unable to decode ballot value " + value[0]);
    }
};
exports.delegateEncoder = function (val) {
    if (val) {
        return exports.boolEncoder(true) + exports.pkhEncoder(val);
    }
    else {
        return exports.boolEncoder(false);
    }
};
exports.int32Encoder = function (val) {
    var num = parseInt(String(val), 10);
    var byte = [];
    for (var i = 0; i < 4; i++) {
        var shiftBy = (4 - (i + 1)) * 8;
        byte.push((num & (0xff << shiftBy)) >> shiftBy);
    }
    return Buffer.from(byte).toString('hex');
};
exports.int32Decoder = function (val) {
    var num = val.consume(4);
    var finalNum = 0;
    for (var i = 0; i < num.length; i++) {
        finalNum = finalNum | (num[i] << ((num.length - (i + 1)) * 8));
    }
    return finalNum;
};
exports.boolDecoder = function (val) {
    var bool = val.consume(1);
    return bool[0] === 0xff;
};
exports.delegateDecoder = function (val) {
    var hasDelegate = exports.boolDecoder(val);
    if (hasDelegate) {
        return exports.pkhDecoder(val);
    }
};
exports.pkhEncoder = function (val) {
    var pubkeyPrefix = val.substr(0, 3);
    switch (pubkeyPrefix) {
        case utils_1.Prefix.TZ1:
            return '00' + exports.prefixEncoder(utils_1.Prefix.TZ1)(val);
        case utils_1.Prefix.TZ2:
            return '01' + exports.prefixEncoder(utils_1.Prefix.TZ2)(val);
        case utils_1.Prefix.TZ3:
            return '02' + exports.prefixEncoder(utils_1.Prefix.TZ3)(val);
        default:
            throw new Error('Invalid public key hash');
    }
};
exports.publicKeyEncoder = function (val) {
    var pubkeyPrefix = val.substr(0, 4);
    switch (pubkeyPrefix) {
        case utils_1.Prefix.EDPK:
            return '00' + exports.prefixEncoder(utils_1.Prefix.EDPK)(val);
        case utils_1.Prefix.SPPK:
            return '01' + exports.prefixEncoder(utils_1.Prefix.SPPK)(val);
        case utils_1.Prefix.P2PK:
            return '02' + exports.prefixEncoder(utils_1.Prefix.P2PK)(val);
        default:
            throw new Error('Invalid PK');
    }
};
exports.addressEncoder = function (val) {
    var pubkeyPrefix = val.substr(0, 3);
    switch (pubkeyPrefix) {
        case utils_1.Prefix.TZ1:
        case utils_1.Prefix.TZ2:
        case utils_1.Prefix.TZ3:
            return '00' + exports.pkhEncoder(val);
        case utils_1.Prefix.KT1:
            return '01' + exports.prefixEncoder(utils_1.Prefix.KT1)(val) + '00';
        default:
            throw new Error('Invalid address');
    }
};
exports.publicKeyDecoder = function (val) {
    var preamble = val.consume(1);
    switch (preamble[0]) {
        case 0x00:
            return exports.prefixDecoder(utils_1.Prefix.EDPK)(val);
        case 0x01:
            return exports.prefixDecoder(utils_1.Prefix.SPPK)(val);
        case 0x02:
            return exports.prefixDecoder(utils_1.Prefix.P2PK)(val);
        default:
            throw new Error('Invalid PK');
    }
};
exports.addressDecoder = function (val) {
    var preamble = val.consume(1);
    switch (preamble[0]) {
        case 0x00:
            return exports.pkhDecoder(val);
        case 0x01:
            var address = exports.prefixDecoder(utils_1.Prefix.KT1)(val);
            val.consume(1);
            return address;
        default:
            throw new Error('Invalid Address');
    }
};
exports.zarithEncoder = function (n) {
    var fn = [];
    var nn = new bignumber_js_1.default(n, 10);
    if (nn.isNaN()) {
        throw new TypeError("Invalid zarith number " + n);
    }
    while (true) {
        // eslint-disable-line
        if (nn.lt(128)) {
            if (nn.lt(16))
                fn.push('0');
            fn.push(nn.toString(16));
            break;
        }
        else {
            var b = nn.mod(128);
            nn = nn.minus(b);
            nn = nn.dividedBy(128);
            b = b.plus(128);
            fn.push(b.toString(16));
        }
    }
    return fn.join('');
};
exports.zarithDecoder = function (n) {
    var mostSignificantByte = 0;
    while (mostSignificantByte < n.length() && (n.get(mostSignificantByte) & 128) !== 0) {
        mostSignificantByte += 1;
    }
    var num = new bignumber_js_1.default(0);
    for (var i = mostSignificantByte; i >= 0; i -= 1) {
        var tmp = n.get(i) & 0x7f;
        num = num.multipliedBy(128);
        num = num.plus(tmp);
    }
    n.consume(mostSignificantByte + 1);
    return new bignumber_js_1.default(num).toString();
};
exports.entrypointDecoder = function (value) {
    var preamble = utils_2.pad(value.consume(1)[0], 2);
    if (preamble in constants_1.entrypointMapping) {
        return constants_1.entrypointMapping[preamble];
    }
    else {
        var entry = codec_1.extractRequiredLen(value, 1);
        var entrypoint = Buffer.from(entry).toString('utf8');
        if (entrypoint.length > constants_1.ENTRYPOINT_MAX_LENGTH) {
            throw new Error("Oversized entrypoint: " + entrypoint + ". The maximum length of entrypoint is " + constants_1.ENTRYPOINT_MAX_LENGTH);
        }
        return entrypoint;
    }
};
exports.parametersDecoder = function (val) {
    var preamble = val.consume(1);
    if (preamble[0] === 0x00) {
        return;
    }
    else {
        var encodedEntrypoint = exports.entrypointDecoder(val);
        var params = codec_1.extractRequiredLen(val);
        var parameters = codec_1.valueDecoder(new uint8array_consumer_1.Uint8ArrayConsumer(params));
        return {
            entrypoint: encodedEntrypoint,
            value: parameters,
        };
    }
};
exports.entrypointEncoder = function (entrypoint) {
    if (entrypoint in constants_1.entrypointMappingReverse) {
        return "" + constants_1.entrypointMappingReverse[entrypoint];
    }
    else {
        if (entrypoint.length > constants_1.ENTRYPOINT_MAX_LENGTH) {
            throw new Error("Oversized entrypoint: " + entrypoint + ". The maximum length of entrypoint is " + constants_1.ENTRYPOINT_MAX_LENGTH);
        }
        var value = { string: entrypoint };
        return "ff" + codec_1.valueEncoder(value).slice(8);
    }
};
exports.parametersEncoder = function (val) {
    if (!val || (val.entrypoint === 'default' && 'prim' in val.value && val.value.prim === 'Unit')) {
        return '00';
    }
    var encodedEntrypoint = exports.entrypointEncoder(val.entrypoint);
    var parameters = codec_1.valueEncoder(val.value);
    var length = (parameters.length / 2).toString(16).padStart(8, '0');
    return "ff" + encodedEntrypoint + length + parameters;
};
//# sourceMappingURL=codec.js.map