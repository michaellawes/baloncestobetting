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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dashboard } from "./components/dashboard/Dashboard";
import "./App.css";
import { Navbar } from "./components/nav/Navbar";
import { Parlays } from "./components/parlays/Parlays";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import { TasksContext, TasksDispatchContext, } from "./components/reducer/TasksContext";
import { generateId } from "./utils/Util";
import supabase from "./config/supabaseConfig";
export function App() {
    var _this = this;
    var _a = useState(false), isLoggedIn = _a[0], setIsLoggedIn = _a[1];
    var _b = useState(null), user = _b[0], setUser = _b[1];
    var _c = useState(0), balance = _c[0], setBalance = _c[1];
    var _d = useState([]), parlayLegs = _d[0], setParlayLegs = _d[1];
    var _e = useState(null), currentParlay = _e[0], setCurrentParlay = _e[1];
    var _f = useState(0), matchup = _f[0], setMatchup = _f[1];
    var _g = useState([]), weeklySlate = _g[0], setWeeklySlate = _g[1];
    var _h = useState(false), justAffectedBalance = _h[0], setJustAffectedBalance = _h[1];
    var _j = useState(null), parlayFieldUpdate = _j[0], setParlayFieldUpdate = _j[1];
    var _k = useState(false), justAffectedParlayFieldUpdate = _k[0], setJustAffectedParlayFieldUpdate = _k[1];
    useEffect(function () {
        var authenticateUser = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error, getMatchup;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase.auth.signInWithPassword({
                            email: import.meta.env.VITE_AUTH_EMAIL,
                            password: import.meta.env.VITE_AUTH_PASS,
                        })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.log(error);
                        }
                        if (data) {
                            supabase.auth.setSession({
                                access_token: data.session.access_token,
                                refresh_token: data.session.refresh_token,
                            });
                            getMatchup = function () { return __awaiter(_this, void 0, void 0, function () {
                                var _a, data, error;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, supabase
                                                .from("matchup")
                                                .select()
                                                .order("id", { ascending: false })
                                                .limit(1)];
                                        case 1:
                                            _a = _b.sent(), data = _a.data, error = _a.error;
                                            if (error) {
                                                console.log(error);
                                            }
                                            if (data) {
                                                setMatchup(data[0]["id"]);
                                                setWeeklySlate(data[0]["weekly_slate"]);
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            getMatchup();
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        authenticateUser();
    }, []);
    useEffect(function () {
        var fetchUserData = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error, _b, data_1, error_1, balance_1, balance_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from("users")
                            .select()
                            .eq("id", user.id)];
                    case 1:
                        _a = _c.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.log(error);
                            console.log(error);
                        }
                        if (!data) return [3 /*break*/, 4];
                        if (!(data.length == 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, supabase
                                .from("users")
                                .insert([{ id: user.id, name: user.name, profile: user.profile }])
                                .select()];
                    case 2:
                        _b = _c.sent(), data_1 = _b.data, error_1 = _b.error;
                        if (error_1) {
                            console.log(error_1);
                            console.log(error_1);
                        }
                        if (data_1) {
                            balance_1 = data_1[0]["balance"];
                            setBalance(balance_1);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        balance_2 = data[0]["balance"];
                        setBalance(balance_2);
                        _c.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        if (user) {
            fetchUserData();
        }
    }, [user]);
    var tasksReducer = function (tasks, action) {
        switch (action.type) {
            case "addLeg": {
                tasks = tasks.filter(function (task) { return task.frontend_id !== action.oppId; });
                tasks = __spreadArray(__spreadArray([], tasks, true), [
                    {
                        frontend_id: action.frontend_id,
                        team: action.team,
                        betType: action.betType,
                        text: action.text,
                        odds: action.odds,
                    },
                ], false);
                return tasks;
            }
            case "removeLeg": {
                return tasks.filter(function (task) { return task.frontend_id !== action.frontend_id; });
            }
            case "submitParlay": {
                setParlayLegs(tasks);
                setCurrentParlay({
                    totalOdds: action.totalOdds,
                    payout: action.payout,
                    wager: action.wager,
                });
                setJustAffectedBalance(true);
                return [];
            }
            case "acceptPayout": {
                setJustAffectedBalance(true);
                return tasks;
            }
            case "parlayFieldUpdate": {
                setJustAffectedParlayFieldUpdate(true);
                return tasks;
            }
            case "clearSlip": {
                return [];
            }
            default: {
                throw Error("Unknown action: " + action.type);
            }
        }
    };
    var _l = useReducer(tasksReducer, []), tasks = _l[0], dispatch = _l[1];
    // Submit Parlay
    useEffect(function () {
        if (parlayLegs.length > 0 && currentParlay != null) {
            var now_1 = new Date();
            var expires_1 = new Date();
            expires_1.setUTCDate(expires_1.getUTCDate() + ((7 - expires_1.getUTCDay()) % 7) + 1);
            var uploadParlay = function () { return __awaiter(_this, void 0, void 0, function () {
                var newParlay, _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            newParlay = {
                                user_id: user.id,
                                parlay_id: generateId(),
                                created_at: +now_1,
                                expires_at: +expires_1,
                                matchup_id: matchup,
                                total_odds: parseFloat(currentParlay.totalOdds.toFixed()),
                                payout: parseFloat(currentParlay.payout.toFixed(2)),
                                wager: parseFloat(currentParlay.wager.toFixed(2)),
                                is_winner: false,
                                is_payed_out: false,
                                legs: parlayLegs,
                            };
                            return [4 /*yield*/, supabase
                                    .from("parlays")
                                    .insert([newParlay])];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error) {
                                console.log(error);
                                console.log(error);
                            }
                            if (data) {
                                setParlayLegs([]);
                                setCurrentParlay(null);
                            }
                            return [2 /*return*/];
                    }
                });
            }); };
            uploadParlay();
        }
    }, [parlayLegs, currentParlay, user, matchup]);
    // Update balance for either placing parlay or automatically colleting earnings
    useEffect(function () {
        if (user && justAffectedBalance) {
            setJustAffectedBalance(false);
            var updateBalance = function () { return __awaiter(_this, void 0, void 0, function () {
                var error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, supabase
                                .from("users")
                                .update({ balance: balance })
                                .eq("id", user.id)];
                        case 1:
                            error = (_a.sent()).error;
                            if (error) {
                                console.log(error);
                            }
                            return [2 /*return*/];
                    }
                });
            }); };
            updateBalance();
        }
    }, [balance, user, justAffectedBalance]);
    // For newly expired parlays, update that it was payed out and whether it won
    useEffect(function () {
        if (user && justAffectedParlayFieldUpdate) {
            var temp_1 = {
                user_id: parlayFieldUpdate.user_id,
                parlay_id: parlayFieldUpdate.parlay_id,
                parlay: parlayFieldUpdate.parlay,
                parlay_modification_type: parlayFieldUpdate.parlay_modification_type,
            };
            setJustAffectedParlayFieldUpdate(false);
            if (temp_1.parlay_modification_type === "validateSlip") {
                var updateParlay = function () { return __awaiter(_this, void 0, void 0, function () {
                    var error;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, supabase
                                    .from("parlays")
                                    .update({
                                    is_winner: temp_1.parlay.is_winner,
                                    is_payed_out: temp_1.parlay.is_payed_out,
                                })
                                    .eq("user_id", temp_1.user_id)
                                    .eq("parlay_id", temp_1.parlay_id)];
                            case 1:
                                error = (_a.sent()).error;
                                if (error) {
                                    console.log(error);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); };
                updateParlay();
            }
        }
    }, [user, parlayFieldUpdate, justAffectedParlayFieldUpdate]);
    useEffect(function () {
        if (!justAffectedParlayFieldUpdate) {
            setParlayFieldUpdate(null);
        }
    }, [justAffectedParlayFieldUpdate]);
    return (_jsx(Router, { children: _jsx(TasksContext, { value: tasks, children: _jsxs(TasksDispatchContext, { value: dispatch, children: [_jsx(Navbar, { isLoggedIn: isLoggedIn, setIsLoggedIn: setIsLoggedIn, balance: balance, setBalance: setBalance, setUser: setUser }), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, { weeklySlate: weeklySlate }) }), _jsx(Route, { path: "/parlays", element: _jsx(Parlays, { setBalance: setBalance, user: user, setParlayFieldUpdate: setParlayFieldUpdate }) })] })] }) }) }));
}
export default App;
//# sourceMappingURL=App.js.map