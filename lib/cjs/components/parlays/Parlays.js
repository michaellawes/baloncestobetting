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
import { jsx as _jsx } from "react/jsx-runtime";
import { Parlay } from "./Parlay";
import * as React from "react";
import { useContext, useEffect } from "react";
import supabase from "../../config/supabaseConfig";
import { getIndividualLegResultForParlays, getParlaysWithLegs, getTeamData, } from "../../utils/Util";
import { TasksDispatchContext } from "../reducer/TasksContext";
import { ErrorLander } from "../dashboard/ErrorLander";
export function Parlays(props) {
    var _this = this;
    var setBalance = props.setBalance, setParlayFieldUpdate = props.setParlayFieldUpdate, user = props.user, setIsViewingDashboard = props.setIsViewingDashboard, matchups = props.matchups, setIsViewingMatchup = props.setIsViewingMatchup, setNotification = props.setNotification;
    var _a = React.useState([]), parlays = _a[0], setParlays = _a[1];
    var _b = React.useState(new Map()), liveTeamData = _b[0], setLiveTeamData = _b[1];
    var dispatch = useContext(TasksDispatchContext);
    var validateFinishedSlips = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var newlyExpiredParlays, activeSlips, expiredParlays, _i, data_1, parlay, startOfExpirationDate, processedData, _a, newlyExpiredParlays_1, parlay, processedParlay;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    newlyExpiredParlays = [];
                    activeSlips = [];
                    expiredParlays = [];
                    for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                        parlay = data_1[_i];
                        startOfExpirationDate = new Date(parlay.expires_at);
                        startOfExpirationDate.setHours(0, 0, 0, 0);
                        parlay.frontend_is_active =
                            Date.now() < Date.parse(startOfExpirationDate.toISOString());
                        if (!parlay.frontend_is_active && parlay.is_active) {
                            newlyExpiredParlays.push(parlay);
                        }
                        else if (!parlay.frontend_is_active && !parlay.is_active) {
                            expiredParlays.push(parlay);
                        }
                        else {
                            activeSlips.push(parlay);
                        }
                    }
                    processedData = activeSlips.concat(expiredParlays);
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
    var validateResultOfFinishedSlips = function (parlay) { return __awaiter(_this, void 0, void 0, function () {
        var validatedParlay, updateSlip;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getIndividualLegResultForParlays(parlay)];
                case 1:
                    validatedParlay = _a.sent();
                    updateSlip = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            validatedParlay.is_active = false;
                            if (validatedParlay.is_winner) {
                                setBalance(function (prev) { return prev + parseFloat(parlay.payout.toFixed(2)); });
                                dispatch({
                                    type: "acceptPayout",
                                });
                            }
                            setParlayFieldUpdate({
                                user_id: validatedParlay.user_id,
                                parlay_id: validatedParlay.parlay_id,
                                parlay_modification_type: "validateSlip",
                                parlay: validatedParlay,
                                payout: validatedParlay.payout,
                            });
                            dispatch({
                                type: "parlayFieldUpdate",
                            });
                            return [2 /*return*/, validatedParlay];
                        });
                    }); };
                    return [4 /*yield*/, updateSlip()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    useEffect(function () {
        setIsViewingDashboard(false);
        setIsViewingMatchup(false);
        var processedTeamData = getTeamData(matchups);
        setLiveTeamData(processedTeamData);
        var getParlays = function () { return __awaiter(_this, void 0, void 0, function () {
            var userId, _a, data, error, parlaysWithLegs, validatedSlips;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = "";
                        if (user) {
                            userId = user.id;
                        }
                        return [4 /*yield*/, supabase
                                .from("fb_parlays")
                                .select("*")
                                .eq("user_id", userId)
                                .order("created_at", { ascending: false })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error || userId === "") {
                            console.log("Could not retrieve parlay data", error);
                        }
                        if (!data) return [3 /*break*/, 4];
                        return [4 /*yield*/, getParlaysWithLegs(data)];
                    case 2:
                        parlaysWithLegs = _b.sent();
                        return [4 /*yield*/, validateFinishedSlips(parlaysWithLegs)];
                    case 3:
                        validatedSlips = _b.sent();
                        setParlays(validatedSlips);
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        getParlays();
    }, []);
    if (!user)
        return _jsx(ErrorLander, {});
    return (_jsx("div", { className: "w-full h-full bg-gray-900 overflow-hidden scrollbar-hide ", children: _jsx("ul", { className: "w-full h-full scrollbar-hide mt-18 ml-1", children: parlays.map(function (parlay, i) { return (_jsx("li", { className: "scrollbar-hide mr-1 pr-1", children: _jsx(Parlay, __assign({}, parlay, { setBalance: setBalance, liveTeamData: liveTeamData, setNotification: setNotification })) }, i)); }) }) }));
}
//# sourceMappingURL=Parlays.js.map