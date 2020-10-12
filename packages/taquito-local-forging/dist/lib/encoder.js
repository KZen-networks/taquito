"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var codec_1 = require("./codec");
var constants_1 = require("./constants");
var codec_2 = require("./michelson/codec");
var operation_1 = require("./schema/operation");
exports.encoders = (_a = {},
    _a[constants_1.CODEC.SECRET] = function (val) { return val; },
    _a[constants_1.CODEC.RAW] = function (val) { return val; },
    _a[constants_1.CODEC.TZ1] = codec_1.tz1Encoder,
    _a[constants_1.CODEC.BRANCH] = codec_1.branchEncoder,
    _a[constants_1.CODEC.ZARITH] = codec_1.zarithEncoder,
    _a[constants_1.CODEC.PUBLIC_KEY] = codec_1.publicKeyEncoder,
    _a[constants_1.CODEC.PKH] = codec_1.pkhEncoder,
    _a[constants_1.CODEC.DELEGATE] = codec_1.delegateEncoder,
    _a[constants_1.CODEC.SCRIPT] = codec_2.scriptEncoder,
    _a[constants_1.CODEC.BALLOT_STATEMENT] = codec_1.ballotEncoder,
    _a[constants_1.CODEC.PROPOSAL] = codec_1.proposalEncoder,
    _a[constants_1.CODEC.PROPOSAL_ARR] = codec_1.proposalsEncoder,
    _a[constants_1.CODEC.INT32] = codec_1.int32Encoder,
    _a[constants_1.CODEC.PARAMETERS] = codec_1.parametersEncoder,
    _a[constants_1.CODEC.ADDRESS] = codec_1.addressEncoder,
    _a);
exports.encoders[constants_1.CODEC.OPERATION] = operation_1.operationEncoder(exports.encoders);
exports.encoders[constants_1.CODEC.OP_ACTIVATE_ACCOUNT] = function (val) { return operation_1.schemaEncoder(exports.encoders)(operation_1.ActivationSchema)(val); };
exports.encoders[constants_1.CODEC.OP_DELEGATION] = function (val) { return operation_1.schemaEncoder(exports.encoders)(operation_1.DelegationSchema)(val); };
exports.encoders[constants_1.CODEC.OP_TRANSACTION] = function (val) { return operation_1.schemaEncoder(exports.encoders)(operation_1.TransactionSchema)(val); };
exports.encoders[constants_1.CODEC.OP_ORIGINATION] = function (val) { return operation_1.schemaEncoder(exports.encoders)(operation_1.OriginationSchema)(val); };
exports.encoders[constants_1.CODEC.OP_BALLOT] = function (val) { return operation_1.schemaEncoder(exports.encoders)(operation_1.BallotSchema)(val); };
exports.encoders[constants_1.CODEC.OP_ENDORSEMENT] = function (val) { return operation_1.schemaEncoder(exports.encoders)(operation_1.EndorsementSchema)(val); };
exports.encoders[constants_1.CODEC.OP_SEED_NONCE_REVELATION] = function (val) {
    return operation_1.schemaEncoder(exports.encoders)(operation_1.SeedNonceRevelationSchema)(val);
};
exports.encoders[constants_1.CODEC.OP_PROPOSALS] = function (val) { return operation_1.schemaEncoder(exports.encoders)(operation_1.ProposalsSchema)(val); };
exports.encoders[constants_1.CODEC.OP_REVEAL] = function (val) { return operation_1.schemaEncoder(exports.encoders)(operation_1.RevealSchema)(val); };
exports.encoders[constants_1.CODEC.MANAGER] = operation_1.schemaEncoder(exports.encoders)(operation_1.ManagerOperationSchema);
//# sourceMappingURL=encoder.js.map