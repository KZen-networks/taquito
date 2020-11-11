"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var tezos_context_1 = require("./tezos-context");
var recharts_1 = require("recharts");
var format_1 = require("./format");
var CustomToolTip = function (props) {
    var active = props.active, payload = props.payload, label = props.label;
    if (!active || !payload) {
        return null;
    }
    return (react_1.default.createElement("div", { className: "custom-tooltip" },
        react_1.default.createElement("p", null,
            react_1.default.createElement("strong", null, label)),
        payload.map(function (item, i) { return (react_1.default.createElement("p", { key: i },
            item.name,
            ": ",
            react_1.default.createElement("strong", null, item.value.toLocaleString()))); })));
};
var BalanceHistory = /** @class */ (function (_super) {
    __extends(BalanceHistory, _super);
    function BalanceHistory(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            error: false,
        };
        return _this;
    }
    BalanceHistory.prototype.refreshBalance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, value, timestamp_1, values, ex_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.context.query.balanceHistory(this.props.address, { start: new Date(this.props.start), end: new Date(this.props.end) })];
                    case 1:
                        _a = _b.sent(), value = _a.value, timestamp_1 = _a.timestamp;
                        values = value
                            .map(function (val, i) { return ({ value: val, timestamp: timestamp_1[i] }); })
                            .sort(function (_a, _b) {
                            var timestamp1 = _a.timestamp1;
                            var timestamp2 = _b.timestamp2;
                            return timestamp1 < timestamp2 ? 1 : -1;
                        });
                        this.setState({ balance: values, error: false });
                        return [3 /*break*/, 3];
                    case 2:
                        ex_1 = _b.sent();
                        this.setState({ error: true });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BalanceHistory.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.refreshBalance()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BalanceHistory.prototype.componentDidUpdate = function (prevProps) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(prevProps.end !== this.props.end || prevProps.address !== this.props.address || prevProps.start !== this.props.start)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.refreshBalance()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    BalanceHistory.prototype.render = function () {
        if (this.state.error) {
            return react_1.default.createElement("span", null, "Error fetching balance");
        }
        return react_1.default.createElement(recharts_1.ResponsiveContainer, { width: '100%', height: 400 },
            react_1.default.createElement(recharts_1.LineChart, { data: this.state.balance },
                react_1.default.createElement(recharts_1.XAxis, { dataKey: "timestamp" }),
                react_1.default.createElement(recharts_1.Tooltip, { formatter: function (val) { return (react_1.default.createElement("span", null, format_1.tzFormatter(val, 'tz'))); } }),
                react_1.default.createElement(recharts_1.YAxis, { tickFormatter: function (val) { return format_1.tzFormatter(val, 'tz'); } }),
                react_1.default.createElement(recharts_1.Line, { type: "monotone", dataKey: "value", stroke: "#ff7300", yAxisId: 0 })));
    };
    BalanceHistory.contextType = tezos_context_1.TezosContext;
    return BalanceHistory;
}(react_1.default.Component));
exports.BalanceHistory = BalanceHistory;
//# sourceMappingURL=balance-history.js.map