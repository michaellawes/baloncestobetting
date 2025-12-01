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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Parlay } from "./Parlay";
import * as React from "react";
import { useContext, useEffect } from "react";
import supabase from "../../config/supabaseConfig";
import { getAllPlayerLiveScores, getIndividualLegResultForParlays, getParlaysWithLegs, getTeamData, } from "../../utils/Util";
import { TasksDispatchContext } from "../reducer/TasksContext";
import { ErrorLander } from "../dashboard/ErrorLander";
import { Lockout } from "../dashboard/Lockout";
export function Parlays(props) {
    var _this = this;
    var setBalance = props.setBalance, balance = props.balance, setParlayFieldUpdate = props.setParlayFieldUpdate, user = props.user, setIsViewingDashboard = props.setIsViewingDashboard, matchups = props.matchups, setIsViewingMatchup = props.setIsViewingMatchup, setNotification = props.setNotification, matchup = props.matchup;
    var _a = React.useState([]), parlays = _a[0], setParlays = _a[1];
    var _b = React.useState([]), filteredParlays = _b[0], setFilteredParlays = _b[1];
    var _c = React.useState(new Map()), liveTeamData = _c[0], setLiveTeamData = _c[1];
    var _d = React.useState(new Map()), livePlayerData = _d[0], setLivePlayerData = _d[1];
    var _e = React.useState(false), hasNoParlays = _e[0], setHasNoParlays = _e[1];
    var _f = React.useState("ACTIVE"), currentFilter = _f[0], setCurrentFilter = _f[1];
    var dispatch = useContext(TasksDispatchContext);
    var selectFilter = function (filterName) {
        if (currentFilter === filterName) {
            setCurrentFilter("ALL");
            setFilteredParlays(parlays);
        }
        else if (filterName === "ALL") {
            setCurrentFilter("ALL");
            setFilteredParlays(parlays);
        }
        else if (filterName === "ACTIVE") {
            setFilteredParlays(parlays.filter(function (parlay) { return parlay.is_active; }));
            setCurrentFilter(filterName);
        }
        else if (filterName === "COMPLETED") {
            setFilteredParlays(parlays.filter(function (parlay) { return !parlay.is_active; }));
            setCurrentFilter(filterName);
        }
        else if (filterName === "WON") {
            setFilteredParlays(parlays.filter(function (parlay) { return !parlay.is_active && parlay.is_winner; }));
            setCurrentFilter(filterName);
        }
        else if (filterName === "LOST") {
            setFilteredParlays(parlays.filter(function (parlay) { return !parlay.is_active && !parlay.is_winner; }));
            setCurrentFilter(filterName);
        }
    };
    var validateFinishedSlips = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var newlyExpiredParlays, activeSlips, expiredParlays, _i, data_1, parlay, startOfExpirationDate, processedData, totalWinnings, _a, newlyExpiredParlays_1, parlay, processedParlay, newBalance, error;
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
                        if (parlay.is_active &&
                            Date.now() > Date.parse(startOfExpirationDate.toISOString())) {
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
                    if (!(newlyExpiredParlays.length > 0)) return [3 /*break*/, 6];
                    totalWinnings = 0;
                    _a = 0, newlyExpiredParlays_1 = newlyExpiredParlays;
                    _b.label = 1;
                case 1:
                    if (!(_a < newlyExpiredParlays_1.length)) return [3 /*break*/, 4];
                    parlay = newlyExpiredParlays_1[_a];
                    return [4 /*yield*/, validateResultOfFinishedSlips(parlay)];
                case 2:
                    processedParlay = _b.sent();
                    if (processedParlay.is_winner) {
                        totalWinnings += processedParlay.payout;
                    }
                    processedData.push(processedParlay);
                    _b.label = 3;
                case 3:
                    _a++;
                    return [3 /*break*/, 1];
                case 4:
                    if (!(totalWinnings > 0)) return [3 /*break*/, 6];
                    newBalance = parseFloat(totalWinnings.toFixed(2)) + balance;
                    return [4 /*yield*/, supabase
                            .from("users")
                            .update({ balance: newBalance })
                            .eq("id", user.id)];
                case 5:
                    error = (_b.sent()).error;
                    if (error) {
                        console.log(error);
                    }
                    setBalance(newBalance);
                    dispatch({
                        type: "updateBalanceAfterWinning",
                    });
                    _b.label = 6;
                case 6: return [2 /*return*/, processedData.sort(function (a, b) { return b.created_at - a.created_at; })];
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
        var getPlayerData = getAllPlayerLiveScores(matchups);
        setLivePlayerData(getPlayerData);
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
                        setFilteredParlays(validatedSlips.filter(function (parlay) { return parlay.is_active; }));
                        if (validatedSlips.length === 0) {
                            setHasNoParlays(true);
                        }
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        getParlays();
    }, []);
    if (!user)
        return (_jsx(ErrorLander, { message: "Please return to the homepage and refresh..." }));
    return (_jsxs("div", { className: "w-full h-full bg-gray-900 overflow-hidden scrollbar-hide ", children: [parlays.length === 0 && matchup >= 0 && !hasNoParlays && (_jsx(Lockout, { message: "Please wait while we load your parlays..." })), hasNoParlays && matchup > 0 && (_jsx(ErrorLander, { message: "No parlays found. Visit the homepage to place some!" })), matchup < 0 && (_jsx(ErrorLander, { message: "Please return to the homepage and refresh..." })), _jsxs("div", { className: "w-full h-full scrollbar-hide mt-18 text-white", children: [parlays.length > 0 && (_jsxs("div", { className: "w-full h-full flex flex-row justify-start p-2 mb-1 mt-2 border-b-blue-500 border-b-2 rounded-b-md", children: [_jsx("div", { className: "w-1/5 h-full flex flex-row justify-center items-center", children: _jsx("div", { className: currentFilter === "ALL"
                                        ? "cursor-pointer w-full h-full flex flex-row justify-center my-1 items-center rounded-md bg-blue-500"
                                        : "cursor-pointer hover:bg-gray-800 w-full h-full flex flex-row justify-center my-1 items-center rounded-md", children: _jsx("button", { onClick: function () { return selectFilter("ALL"); }, className: "switch ".concat(currentFilter === "ALL"
                                            ? 'h-full w-full m-1 py-1 basis-0 grow justify-center items-center bg-blue-500 flex-col flex box-border overflow-hidden rounded-md relative"'
                                            : "h-full w-full m-1 py-1 bg-transparent basis-0 grow border border-transparent justify-center items-center flex-col flex box-border overflow-hidden rounded-sm relative"), children: _jsx("span", { className: "switch ".concat(currentFilter === "ALL"
                                                ? "tracking-[.5px] leading-none opacity-[1] text-gray-300 text-sm md:text-base font-[ProximaNova-Bold, serif] font-bold"
                                                : "tracking-[.5px] leading-none opacity-[1] text-blue-500 text-sm md:text-base font-[ProximaNova-Bold, serif]"), children: "All" }) }) }) }), _jsx("div", { className: "w-1/5 h-full flex flex-row justify-center items-center", children: _jsx("div", { className: currentFilter === "ACTIVE"
                                        ? "cursor-pointer w-full h-full flex flex-row justify-center my-1 items-center rounded-md bg-blue-500"
                                        : "hover:bg-gray-800 cursor-pointer w-full h-full flex flex-row justify-center my-1 items-center rounded-md", children: _jsx("button", { onClick: function () { return selectFilter("ACTIVE"); }, className: "switch ".concat(currentFilter === "ACTIVE"
                                            ? 'w-full h-full m-1 py-1 basis-0 grow justify-center items-center bg-blue-500 flex-col flex box-border overflow-hidden rounded-md relative"'
                                            : "w-full h-full m-1 py-1 bg-transparent basis-0 grow border border-transparent justify-center items-center flex-col flex box-border overflow-hidden rounded-sm relative"), children: _jsx("span", { className: "switch ".concat(currentFilter === "ACTIVE"
                                                ? "tracking-[.5px] leading-none opacity-[1] text-gray-300 text-sm md:text-base font-[ProximaNova-Bold, serif] font-bold"
                                                : "tracking-[.5px] leading-none opacity-[1] text-blue-500 text-sm md:text-base font-[ProximaNova-Bold, serif]"), children: "Active" }) }) }) }), _jsx("div", { className: "w-1/5 h-full flex flex-row justify-center items-center", children: _jsx("div", { className: currentFilter === "COMPLETED"
                                        ? "cursor-pointer w-full h-full flex flex-row justify-center my-1 items-center rounded-md bg-blue-500"
                                        : "cursor-pointer hover:bg-gray-800 w-full h-full flex flex-row justify-center my-1 items-center rounded-md", children: _jsx("button", { onClick: function () { return selectFilter("COMPLETED"); }, className: "switch ".concat(currentFilter === "COMPLETED"
                                            ? 'w-full h-full m-1 py-1 basis-0 grow justify-center items-center bg-blue-500 flex-col flex box-border overflow-hidden rounded-md relative"'
                                            : "w-full h-full m-1 py-1 bg-transparent basis-0 grow border border-transparent justify-center items-center flex-col flex box-border overflow-hidden rounded-sm relative"), children: _jsx("span", { className: "switch ".concat(currentFilter === "COMPLETED"
                                                ? "tracking-[.5px] leading-none opacity-[1] text-gray-300 text-sm md:text-base font-[ProximaNova-Bold, serif] font-bold"
                                                : "tracking-[.5px] leading-none opacity-[1] text-blue-500 text-sm md:text-base font-[ProximaNova-Bold, serif]"), children: window.innerWidth < 469 ? "Done" : "Completed" }) }) }) }), _jsx("div", { className: "w-1/5 h-full flex flex-row justify-center items-center", children: _jsx("div", { className: currentFilter === "WON"
                                        ? "cursor-pointer w-full h-full flex flex-row justify-center my-1 items-center rounded-md bg-blue-500"
                                        : "cursor-pointer hover:bg-gray-800 w-full h-full flex flex-row justify-center my-1 items-center rounded-md", children: _jsx("button", { onClick: function () { return selectFilter("WON"); }, className: "switch ".concat(currentFilter === "WON"
                                            ? 'w-full h-full m-1 py-1 basis-0 grow justify-center items-center bg-blue-500 flex-col flex box-border overflow-hidden rounded-md relative"'
                                            : "w-full h-full m-1 py-1 bg-transparent basis-0 grow border border-transparent justify-center items-center flex-col flex box-border overflow-hidden rounded-sm relative"), children: _jsx("span", { className: "switch ".concat(currentFilter === "WON"
                                                ? "tracking-[.5px] leading-none opacity-[1] text-gray-300 text-sm md:text-base font-[ProximaNova-Bold, serif] font-bold"
                                                : "tracking-[.5px] leading-none opacity-[1] text-blue-500 text-sm md:text-base font-[ProximaNova-Bold, serif]"), children: "Won" }) }) }) }), _jsx("div", { className: "w-1/5 h-full flex flex-row justify-center items-center", children: _jsx("div", { className: currentFilter === "LOST"
                                        ? " cursor-pointer w-full h-full flex flex-row justify-center my-1 items-center rounded-md bg-blue-500"
                                        : " cursor-pointer hover:bg-gray-800 w-full h-full flex flex-row justify-center my-1 items-center rounded-md", children: _jsx("button", { onClick: function () { return selectFilter("LOST"); }, className: "switch ".concat(currentFilter === "LOST"
                                            ? 'w-full h-full m-1 py-1 basis-0 grow justify-center bg-blue-500 items-center flex-col flex box-border overflow-hidden rounded-md relative"'
                                            : "w-full h-full m-1 py-1 bg-transparent basis-0 grow border border-transparent justify-center items-center flex-col flex box-border overflow-hidden rounded-sm relative"), children: _jsx("span", { className: "switch ".concat(currentFilter === "LOST"
                                                ? "tracking-[.5px] leading-none opacity-[1] text-gray-300 text-sm md:text-base font-[ProximaNova-Bold, serif] font-bold"
                                                : "tracking-[.5px] leading-none opacity-[1] text-blue-500 text-sm md:text-base font-[ProximaNova-Bold, serif]"), children: "Lost" }) }) }) })] })), filteredParlays.length === 0 && parlays.length > 0 && (_jsx(ErrorLander, { message: "No parlays match this filter." })), _jsx("div", { className: "w-full h-full scrollbar-hide mx-1", children: _jsx("ul", { className: "w-full h-full scrollbar-hide", children: filteredParlays.map(function (parlay, i) { return (_jsx("li", { className: "scrollbar-hide pr-2", children: _jsx(Parlay, __assign({}, parlay, { setBalance: setBalance, liveTeamData: liveTeamData, livePlayerData: livePlayerData, setNotification: setNotification })) }, i)); }) }) })] })] }));
}
//# sourceMappingURL=Parlays.js.map