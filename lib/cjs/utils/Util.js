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
import { v5 as uuidv5 } from "uuid";
import { propField } from "./Constants";
import supabase from "../config/supabaseConfig";
import html2canvas from "html2canvas-pro";
export var decimalToOdds = function (decimal) {
    if (decimal >= 2) {
        return (decimal - 1) * 100;
    }
    else {
        return -100 / (decimal - 1);
    }
};
var downloadImage = function (blob, imageFileName) { return __awaiter(void 0, void 0, void 0, function () {
    var fakeLink;
    return __generator(this, function (_a) {
        fakeLink = window.document.createElement("a");
        fakeLink.style.display = "none";
        fakeLink.download = imageFileName;
        fakeLink.href = blob;
        document.body.appendChild(fakeLink);
        fakeLink.click();
        document.body.removeChild(fakeLink);
        fakeLink.remove();
        return [2 /*return*/];
    });
}); };
export var evaluateLeg = function (leg, event) {
    if (leg.betType == propField[0]) {
        return event <= Number(leg.text);
    }
    else if (leg.betType == propField[1]) {
        var totalPointsProps = leg.text.split(" ");
        if (totalPointsProps[0] === "O") {
            return event > Number(totalPointsProps[1]);
        }
        else {
            return event < Number(totalPointsProps[1]);
        }
    }
    else if (leg.betType == propField[2]) {
        return event === 1;
    }
    else if (leg.betType == propField[3]) {
        var totalTeamScoreProps = leg.text.split(" ");
        if (totalTeamScoreProps[0] === "O") {
            return event > Number(totalTeamScoreProps[1]);
        }
        else {
            return event < Number(totalTeamScoreProps[1]);
        }
    }
};
export var exportAsImage = function (element, imageFileName) { return __awaiter(void 0, void 0, void 0, function () {
    var canvas, image;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, html2canvas(element)];
            case 1:
                canvas = _a.sent();
                image = canvas.toDataURL("image/png", 1.0);
                downloadImage(image, imageFileName);
                return [2 /*return*/];
        }
    });
}); };
export var generateId = function () {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        S4() +
        S4());
};
export var getIndividualLegResultForParlays = function (parlay) { return __awaiter(void 0, void 0, void 0, function () {
    var matchup_id, query_ids, _a, data, error, legDictionary, _i, _b, leg, legId, lastLiveValue;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                matchup_id = Number(parlay.matchup_id);
                query_ids = parlay.legs.map(function (leg) {
                    if (leg.betType === propField[4] || leg.betType === propField[1]) {
                        return leg.frontend_id.split("/")[0] + "/" + leg.betType;
                    }
                    else {
                        return leg.team + "/" + leg.betType;
                    }
                });
                return [4 /*yield*/, supabase
                        .from("legs")
                        .select("*")
                        .eq("matchup_id", matchup_id)
                        .in("id", query_ids)];
            case 1:
                _a = _c.sent(), data = _a.data, error = _a.error;
                if (error) {
                    console.log(error);
                }
                if (data) {
                    legDictionary = Object.assign.apply(Object, __spreadArray([{}], data.map(function (x) {
                        var _a;
                        return (_a = {}, _a[x.id] = x.point_value, _a);
                    }), false));
                    for (_i = 0, _b = parlay.legs; _i < _b.length; _i++) {
                        leg = _b[_i];
                        legId = leg.betType !== propField[4] && leg.betType !== propField[1]
                            ? leg.team + "/" + leg.betType
                            : leg.frontend_id.split("/")[0] + "/" + leg.betType;
                        lastLiveValue = legDictionary[legId];
                        leg.didHit = evaluateLeg(leg, lastLiveValue);
                        leg.lastValue =
                            leg.betType === propField[0]
                                ? lastLiveValue
                                : roundToInteger(lastLiveValue.toString());
                    }
                    parlay.is_winner = parlay.legs.every(function (leg) { return leg.didHit; });
                    console.log(parlay);
                    return [2 /*return*/, parlay];
                }
                return [2 /*return*/];
        }
    });
}); };
export var getNotificationStyling = function (type) {
    if (type === "SUBMIT") {
        return "h-[16px] flex-row p-5 mt-16 fixed flex w-1/2 justify-center items-center text-center z-100 text-white bg-gray-900 border border-green-500 rounded-sm";
    }
    else if (type === "LIMIT") {
        return "h-[16px] flex-row p-5 mt-16 fixed flex w-1/2 justify-center items-center text-center z-100 text-white bg-gray-900 border border-red-500 rounded-sm";
    }
    else if (type === "CLIPBOARD") {
        return "h-[16px] flex-row p-5 mt-16 fixed flex w-1/2 justify-center items-center text-center z-100 text-white bg-gray-900 border border-blue-500 rounded-sm";
    }
    else {
        return "h-[16px] flex-row p-5 mt-16 fixed flex w-1/2 justify-center items-center text-center z-100 text-white bg-gray-900 border border-gray-500 rounded-sm";
    }
};
export var getOverUnderStyling = function (prop) {
    if (prop.startsWith("O")) {
        return "h-[4px] bg-green-400 basis-0 grow flex-rowbox-border rounded-md relative w-full";
    }
    return "h-[4px] bg-red-400 basis-0 grow flex-rowbox-border rounded-md relative w-full";
};
export var getParlayLegStyling = function (frontend_is_active) {
    if (frontend_is_active) {
        return "flex mb-2 max-h-110 overflow-y-scroll scrollbar-hide w-full flex-col bg-gray-900";
    }
    else {
        return "flex mb-2 max-h-64 overflow-y-scroll scrollbar-hide w-full flex-col bg-gray-900";
    }
};
export var getParlayType = function (numberOfLegs) {
    return numberOfLegs === 1 ? "Same Game Parlay" : "Same Game Parlay+";
};
export var getParlayTypeAbbreviated = function (numberOfLegs) {
    return numberOfLegs === 1 ? "SGP" : "SGP+";
};
export var getPayoutWithRespectToScreenWidth = function (payout) {
    if (window.innerWidth < 501) {
        var fullText = "wins $".concat(numberWithCommas(parseFloat(payout.toFixed(2))));
        if (fullText.length > 20) {
            return "";
        }
        else if (fullText.length > 15) {
            return fullText.substring(0, 15) + "...";
        }
        else {
            return fullText;
        }
    }
    else {
        return "wins $".concat(numberWithCommas(parseFloat(payout.toFixed(2))));
    }
};
export var getPlayerNameIsTooLong = function (playerName) {
    return playerName.length > 16 && window.innerWidth < 501;
};
export var getPropTextWithRespectToScreenSize = function (leg, screenWidth) {
    if (leg.betType !== propField[1]) {
        if (leg.betType === propField[4]) {
            return "".concat(leg.frontend_id.split("/")[0], " ").concat(leg.text);
        }
        return "".concat(leg.team, " ").concat(leg.text);
    }
    else {
        var teamMatchupString = leg.frontend_id.split("/")[0];
        if (screenWidth < 500) {
            teamMatchupString =
                leg.frontend_id.split("/")[0].substring(0, 40) + "...";
        }
        return "".concat(teamMatchupString, " ").concat(leg.text);
    }
};
export var getReadableDate = function (timestamp) {
    var d = new Date(timestamp);
    return (d.getMonth() +
        1 +
        "/" +
        d.getDate() +
        "/" +
        d.getFullYear() +
        " " +
        getStandardTime(d.getHours(), d.getMinutes()));
};
export var getStandardTime = function (hours, minutes) {
    var timeValue;
    if (hours > 0 && hours <= 12) {
        timeValue = "" + hours;
    }
    else if (hours > 12) {
        timeValue = "" + (hours - 12);
    }
    else if (hours == 0) {
        timeValue = "12";
    }
    timeValue += minutes < 10 ? ":0" + minutes : ":" + minutes;
    timeValue += hours >= 12 ? "PM" : "AM";
    return timeValue;
};
export var getTeamData = function (live_matchups) {
    var teamData = new Map();
    for (var _i = 0, live_matchups_1 = live_matchups; _i < live_matchups_1.length; _i++) {
        var matchup = live_matchups_1[_i];
        teamData.set(matchup.road.name, new Map([
            ["live_score", matchup.road.live_score.toString()],
            ["live_spread", matchup.road.spread.live_value],
            ["live_points", matchup.road.points.live_value],
            ["live_moneyline", matchup.road.moneyline.live_value],
            [
                "".concat(matchup.road.top_5[0].name, "_score"),
                matchup.road.top_5[0].live_total.toString(),
            ],
            [
                "".concat(matchup.road.top_5[1].name, "_score"),
                matchup.road.top_5[1].live_total.toString(),
            ],
            [
                "".concat(matchup.road.top_5[2].name, "_score"),
                matchup.road.top_5[2].live_total.toString(),
            ],
            [
                "".concat(matchup.road.top_5[3].name, "_score"),
                matchup.road.top_5[3].live_total.toString(),
            ],
            [
                "".concat(matchup.road.top_5[4].name, "_score"),
                matchup.road.top_5[4].live_total.toString(),
            ],
        ]));
        teamData.set(matchup.home.name, new Map([
            ["live_score", matchup.home.live_score.toString()],
            ["live_spread", matchup.home.spread.live_value],
            ["live_points", matchup.home.points.live_value],
            ["live_moneyline", matchup.home.moneyline.live_value],
            [
                "".concat(matchup.home.top_5[0].name, "_score"),
                matchup.home.top_5[0].live_total.toString(),
            ],
            [
                "".concat(matchup.home.top_5[1].name, "_score"),
                matchup.home.top_5[1].live_total.toString(),
            ],
            [
                "".concat(matchup.home.top_5[2].name, "_score"),
                matchup.home.top_5[2].live_total.toString(),
            ],
            [
                "".concat(matchup.home.top_5[3].name, "_score"),
                matchup.home.top_5[3].live_total.toString(),
            ],
            [
                "".concat(matchup.home.top_5[4].name, "_score"),
                matchup.home.top_5[4].live_total.toString(),
            ],
        ]));
    }
    return teamData;
};
export var getTeamNameIsTooLong = function (teamName) {
    return teamName.length > 16 && window.innerWidth < 469;
};
export var getUuid = function (id) {
    var MY_NAMESPACE = "1b671a64-40d5-491e-99b0-da01ff1f3341";
    return uuidv5(id, MY_NAMESPACE);
};
export var numberWithCommas = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
export var oddsToDecimal = function (value) {
    if (value > 0) {
        return 1 + value / 100;
    }
    else {
        return 1 - 100 / value;
    }
};
export var getPropValue = function (text) {
    return text.substring(2);
};
export var round5 = function (x) {
    return Math.ceil(x / 5) * 5;
};
export var roundToInteger = function (value) {
    return parseFloat(parseFloat(value).toFixed());
};
//# sourceMappingURL=Util.js.map