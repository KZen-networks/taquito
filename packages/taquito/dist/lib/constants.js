"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_GAS_LIMIT;
(function (DEFAULT_GAS_LIMIT) {
    DEFAULT_GAS_LIMIT[DEFAULT_GAS_LIMIT["DELEGATION"] = 10600] = "DELEGATION";
    DEFAULT_GAS_LIMIT[DEFAULT_GAS_LIMIT["ORIGINATION"] = 10600] = "ORIGINATION";
    DEFAULT_GAS_LIMIT[DEFAULT_GAS_LIMIT["TRANSFER"] = 10600] = "TRANSFER";
    DEFAULT_GAS_LIMIT[DEFAULT_GAS_LIMIT["REVEAL"] = 10600] = "REVEAL";
})(DEFAULT_GAS_LIMIT = exports.DEFAULT_GAS_LIMIT || (exports.DEFAULT_GAS_LIMIT = {}));
var DEFAULT_FEE;
(function (DEFAULT_FEE) {
    DEFAULT_FEE[DEFAULT_FEE["DELEGATION"] = 1257] = "DELEGATION";
    DEFAULT_FEE[DEFAULT_FEE["ORIGINATION"] = 10000] = "ORIGINATION";
    DEFAULT_FEE[DEFAULT_FEE["TRANSFER"] = 10000] = "TRANSFER";
    DEFAULT_FEE[DEFAULT_FEE["REVEAL"] = 1420] = "REVEAL";
})(DEFAULT_FEE = exports.DEFAULT_FEE || (exports.DEFAULT_FEE = {}));
var DEFAULT_STORAGE_LIMIT;
(function (DEFAULT_STORAGE_LIMIT) {
    DEFAULT_STORAGE_LIMIT[DEFAULT_STORAGE_LIMIT["DELEGATION"] = 0] = "DELEGATION";
    DEFAULT_STORAGE_LIMIT[DEFAULT_STORAGE_LIMIT["ORIGINATION"] = 257] = "ORIGINATION";
    DEFAULT_STORAGE_LIMIT[DEFAULT_STORAGE_LIMIT["TRANSFER"] = 257] = "TRANSFER";
    DEFAULT_STORAGE_LIMIT[DEFAULT_STORAGE_LIMIT["REVEAL"] = 0] = "REVEAL";
})(DEFAULT_STORAGE_LIMIT = exports.DEFAULT_STORAGE_LIMIT || (exports.DEFAULT_STORAGE_LIMIT = {}));
var Protocols;
(function (Protocols) {
    Protocols["Pt24m4xi"] = "Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd";
    Protocols["PsBABY5H"] = "PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU";
    Protocols["PsBabyM1"] = "PsBabyM1eUXZseaJdmXFApDSBqj8YBfwELoxZHHW77EMcAbbwAS";
    Protocols["PsCARTHA"] = "PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb";
})(Protocols = exports.Protocols || (exports.Protocols = {}));
exports.protocols = {
    '004': [Protocols.Pt24m4xi],
    '005': [Protocols.PsBABY5H, Protocols.PsBabyM1],
    '006': [Protocols.PsCARTHA],
};
//# sourceMappingURL=constants.js.map