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
import { WeeklySlate } from "./wagers/WeeklySlate";
import { useContext, useEffect } from "react";
import { TasksContext, TasksDispatchContext } from "../reducer/TasksContext";
import { Lockout } from "./Lockout";
import { useParams } from "react-router-dom";
import supabase from "../../config/supabaseConfig";
import { getDailySlate } from "../../utils/Util";
export function Dashboard(props) {
    var _this = this;
    var weeklySlate = props.weeklySlate, setIsViewingDashboard = props.setIsViewingDashboard, lockout = props.lockout, setCurrentMatchup = props.setCurrentMatchup, setIsViewingMatchup = props.setIsViewingMatchup, setMatchup = props.setMatchup, setWeeklySlate = props.setWeeklySlate, setLockout = props.setLockout;
    var dispatch = useContext(TasksDispatchContext);
    var tasks = useContext(TasksContext);
    var parlayId = useParams().parlayId;
    useEffect(function () {
        setIsViewingDashboard(true);
        setIsViewingMatchup(false);
        var getMatchup = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error, weeklySlate_1, getSharedSlip;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from("matchup")
                            .select("id, is_done")
                            .order("id", { ascending: false })
                            .limit(1)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.log(error);
                        }
                        if (!data) return [3 /*break*/, 4];
                        setMatchup(data[0]["id"]);
                        setLockout(data[0]["is_done"]);
                        return [4 /*yield*/, getDailySlate(data[0]["id"])];
                    case 2:
                        weeklySlate_1 = _b.sent();
                        //setWeeklySlate(demoWeeklySlate);
                        setWeeklySlate(weeklySlate_1);
                        if (!(parlayId != undefined)) return [3 /*break*/, 4];
                        getSharedSlip = function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a, data, error;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, supabase
                                            .from("fb_parlay_legs")
                                            .select("*")
                                            .eq("parlay_id", parlayId)
                                            .order("index")];
                                    case 1:
                                        _a = _b.sent(), data = _a.data, error = _a.error;
                                        if (error) {
                                            console.log(error);
                                        }
                                        if (data) {
                                            dispatch({
                                                type: "loadSharedSlip",
                                                legs: data,
                                            });
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, getSharedSlip()];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        getMatchup();
    }, []);
    return (_jsx("div", { className: tasks.length > 0
            ? "w-full h-screen mb-37 bg-gray-900"
            : "w-full h-screen bg-gray-900", children: lockout ? (_jsx(Lockout, {})) : (_jsx(WeeklySlate, { matchups: weeklySlate, setCurrentMatchup: setCurrentMatchup })) }));
}
//# sourceMappingURL=Dashboard.js.map