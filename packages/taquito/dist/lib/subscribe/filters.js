"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var opHashFilter = function (op, filter) { return op.hash === filter.opHash; };
var sourceFilter = function (x, filter) {
    switch (x.kind) {
        case 'endorsement':
            return 'metadata' in x && x.metadata.delegate === filter.source;
        case 'activate_account':
            return 'metadata' in x && x.pkh === filter.source;
        default:
            return 'source' in x && x.source === filter.source;
    }
};
var kindFilter = function (x, filter) { return 'kind' in x && x.kind === filter.kind; };
var destinationFilter = function (x, filter) {
    switch (x.kind) {
        case 'delegation':
            return x.delegate === filter.destination;
        case 'origination':
            if ('metadata' in x &&
                'operation_result' in x.metadata &&
                'originated_contracts' in x.metadata.operation_result &&
                Array.isArray(x.metadata.operation_result.originated_contracts)) {
                return x.metadata.operation_result.originated_contracts.some(function (contract) { return contract === filter.destination; });
            }
            break;
        case 'transaction':
            return x.destination === filter.destination;
        default:
            return false;
    }
};
exports.evaluateOpFilter = function (op, filter) {
    if ('opHash' in filter) {
        return opHashFilter(op, filter);
    }
    else if ('source' in filter) {
        return sourceFilter(op, filter);
    }
    else if ('kind' in filter) {
        return kindFilter(op, filter);
    }
    else if ('destination' in filter) {
        return destinationFilter(op, filter);
    }
    return false;
};
exports.evaluateExpression = function (op, exp) {
    if (Array.isArray(exp.and)) {
        return exp.and.every(function (x) { return exports.evaluateFilter(op, x); });
    }
    else if (Array.isArray(exp.or)) {
        return exp.or.some(function (x) { return exports.evaluateFilter(op, x); });
    }
    else {
        throw new Error('Filter expression must contains either and/or property');
    }
};
exports.evaluateFilter = function (op, filter) {
    var filters = [];
    if (!Array.isArray(filter)) {
        filters.push(filter);
    }
    else {
        filters.push.apply(filters, __spread(filter));
    }
    return filters.every(function (filterOrExp) {
        if ('and' in filterOrExp || 'or' in filterOrExp) {
            return exports.evaluateExpression(op, filterOrExp);
        }
        else {
            return exports.evaluateOpFilter(op, filterOrExp);
        }
    });
};
//# sourceMappingURL=filters.js.map