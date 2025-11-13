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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx } from "react/jsx-runtime";
import { Parlay } from "./Parlay";
import * as React from "react";
import { useContext, useEffect } from "react";
import supabase from "../../config/supabaseConfig";
import { evaluateLeg } from "../../utils/Util";
import { TasksDispatchContext } from "../reducer/TasksContext";
export function Parlays(props) {
    var _this = this;
    var setBalance = props.setBalance, setParlayFieldUpdate = props.setParlayFieldUpdate, user = props.user;
    var _a = React.useState([]), parlays = _a[0], setParlays = _a[1];
    var validateFinishedSlips = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var newlyExpiredParlays, expiredParlays, _i, data_1, parlay, processedData, _a, newlyExpiredParlays_1, parlay, processedParlay;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    newlyExpiredParlays = [];
                    expiredParlays = [];
                    for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                        parlay = data_1[_i];
                        parlay.frontend_is_active =
                            new Date(parlay.expires_at).getTime() > Date.now();
                        if (!parlay.frontend_is_active && !parlay.is_payed_out) {
                            newlyExpiredParlays.push(parlay);
                        }
                        else {
                            expiredParlays.push(parlay);
                        }
                    }
                    processedData = expiredParlays;
                    if (!(newlyExpiredParlays.length > 0)) return [3 /*break*/, 4];
                    _a = 0, newlyExpiredParlays_1 = newlyExpiredParlays;
                    _b.label = 1;
                case 1:
                    if (!(_a < newlyExpiredParlays_1.length)) return [3 /*break*/, 4];
                    parlay = newlyExpiredParlays_1[_a];
                    return [4 /*yield*/, validateResultOfFinishedSlips(parlay)];
                case 2:
                    processedParlay = _b.sent();
                    processedData.push(processedParlay);
                    _b.label = 3;
                case 3:
                    _a++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, processedData.sort(function (a, b) { return b.created_at - a.created_at; })];
            }
        });
    }); };
    var dispatch = useContext(TasksDispatchContext);
    var validateResultOfFinishedSlips = function (parlay) { return __awaiter(_this, void 0, void 0, function () {
        var matchup_id, query_ids, _a, data, error, legDictionary_1, slipHit_1, updateSlip;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    matchup_id = Number(parlay.matchup_id);
                    query_ids = parlay.legs.map(function (leg) {
                        return leg.team + "-" + leg.betType;
                    });
                    return [4 /*yield*/, supabase
                            .from("legs")
                            .select("*")
                            .eq("matchup_id", matchup_id)
                            .in("id", query_ids)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.log(error);
                    }
                    if (!data) return [3 /*break*/, 3];
                    legDictionary_1 = Object.assign.apply(Object, __spreadArray([{}], data.map(function (x) {
                        var _a;
                        return (_a = {}, _a[x.id] = x.point_value, _a);
                    }), false));
                    slipHit_1 = parlay.legs.every(function (leg) {
                        return evaluateLeg(leg, legDictionary_1[leg.team + "-" + leg.betType]);
                    });
                    updateSlip = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            parlay["is_payed_out"] = true;
                            parlay["is_winner"] = slipHit_1;
                            if (slipHit_1) {
                                setBalance(function (prev) { return prev + parseFloat(parlay.payout.toFixed(2)); });
                                dispatch({
                                    type: "acceptPayout",
                                });
                            }
                            setParlayFieldUpdate({
                                user_id: parlay.user_id,
                                parlay_id: parlay.parlay_id,
                                parlay_modification_type: "validateSlip",
                                parlay: parlay,
                            });
                            dispatch({
                                type: "parlayFieldUpdate",
                            });
                            return [2 /*return*/, parlay];
                        });
                    }); };
                    return [4 /*yield*/, updateSlip()];
                case 2: return [2 /*return*/, _b.sent()];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        var getParlays = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error, validatedSlips;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from("parlays")
                            .select("*")
                            .eq("user_id", user.id)
                            .order("created_at", { ascending: false })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.log(error);
                        }
                        if (!data) return [3 /*break*/, 3];
                        return [4 /*yield*/, validateFinishedSlips(data)];
                    case 2:
                        validatedSlips = _b.sent();
                        setParlays(validatedSlips);
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        getParlays();
    }, []);
    return (_jsx("div", { className: "flex flex-col w-full h-full bg-gray-600", children: _jsx("ul", { className: "bg-gray-600", children: parlays.map(function (parlay, i) { return (_jsx("li", { children: _jsx(Parlay, __assign({}, parlay, { setBalance: setBalance })) }, i)); }) }) }));
}
//# sourceMappingURL=Parlays.js.map