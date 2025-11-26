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
    var betType = leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1];
    if (betType === propField[0]) {
        return event <= Number(leg.text);
    }
    else if (betType === propField[1]) {
        var totalPointsProps = leg.text.split(" ");
        if (totalPointsProps[0] === "O") {
            return event > Number(totalPointsProps[1]);
        }
        else {
            return event < Number(totalPointsProps[1]);
        }
    }
    else if (betType === propField[2]) {
        var matchup = leg.frontend_id.split("/")[0];
        if (matchup[0].includes(" v ")) {
            var teamNames = matchup.split(" v ");
            var roadName = teamNames[0];
            var homeName = teamNames[1];
            if (event === 1 && leg.team === homeName) {
                return true;
            }
            else
                return event === -1 && leg.team === roadName;
        }
        else {
            return event === 1;
        }
    }
    else if (betType === propField[3]) {
        var totalTeamScoreProps = leg.text.split(" ");
        if (totalTeamScoreProps[0] === "O") {
            return event > Number(totalTeamScoreProps[1]);
        }
        else {
            return event < Number(totalTeamScoreProps[1]);
        }
    }
    else if (betType === propField[4]) {
        var totalPlayerScoreProps = leg.text.split(" ");
        if (totalPlayerScoreProps[0] === "O") {
            return event > Number(totalPlayerScoreProps[1]);
        }
        else {
            return event < Number(totalPlayerScoreProps[1]);
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
export var getAllParlayLegs = function (parlayIds) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, data, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, supabase
                    .from("fb_parlay_legs")
                    .select("*")
                    .in("parlay_id", parlayIds)];
            case 1:
                _a = _b.sent(), data = _a.data, error = _a.error;
                if (error)
                    throw error;
                if (data) {
                    return [2 /*return*/, data];
                }
                return [2 /*return*/];
        }
    });
}); };
export var getDaysSinceLastMonday = function () {
    return new Date().getDay() - 1;
};
export var getId = function (teamName, text, secondIndex, roadName, homeName) {
    return ((secondIndex === 1 ? roadName + " v " + homeName : teamName) +
        "/" +
        (secondIndex === 1
            ? text.substring(0, 1) + "/" + propField[secondIndex]
            : propField[secondIndex]));
};
export var getIndividualLegResultForParlays = function (parlay) { return __awaiter(void 0, void 0, void 0, function () {
    var matchup_id, query_ids, _a, data, error, legDictionary, _i, _b, leg, betType, legId, lastLiveValue;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                matchup_id = Number(parlay.matchup_id);
                query_ids = parlay.legs.map(function (leg) {
                    var betType = leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1];
                    if (betType === propField[4] || betType === propField[1]) {
                        return leg.frontend_id.split("/")[0] + "/" + betType;
                    }
                    else {
                        return leg.team + "/" + betType;
                    }
                });
                return [4 /*yield*/, supabase
                        .from("fb_props")
                        .select("*")
                        .eq("matchup_id", matchup_id)
                        .eq("day_id", 6)
                        .in("prop_id", query_ids)];
            case 1:
                _a = _c.sent(), data = _a.data, error = _a.error;
                if (error) {
                    console.log(error);
                }
                if (data) {
                    legDictionary = Object.assign.apply(Object, __spreadArray([{}], data.map(function (x) {
                        var _a;
                        return (_a = {}, _a[x.prop_id] = x.live_value, _a);
                    }), false));
                    for (_i = 0, _b = parlay.legs; _i < _b.length; _i++) {
                        leg = _b[_i];
                        betType = leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1];
                        legId = betType !== propField[4] && betType !== propField[1]
                            ? leg.team + "/" + betType
                            : leg.frontend_id.split("/")[0] + "/" + betType;
                        lastLiveValue = legDictionary[legId];
                        /*if (lastLiveValue === undefined) {
                          console.log(legId);
                          leg.didHit = false;
                          leg.lastValue = 0;
                          console.log(
                            `For ${legId} the lastLiveValue ${lastLiveValue} and it was true is? ${leg.didHit}`,
                          );
                        } else {*/
                        leg.did_hit = evaluateLeg(leg, lastLiveValue);
                        leg.live_value =
                            betType === propField[0]
                                ? lastLiveValue
                                : roundToInteger(lastLiveValue.toString());
                        //}
                    }
                    parlay.is_winner = parlay.legs.every(function (leg) { return leg.did_hit; });
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
export var getOppId = function (oppName, oppPropText, secondIndex, roadName, homeName) {
    var totalPointsTeam = roadName + " v " + homeName;
    return ((secondIndex === 1 ? totalPointsTeam : oppName) +
        "/" +
        (secondIndex === 1
            ? oppPropText.substring(0, 1) + "/" + propField[secondIndex]
            : propField[secondIndex]));
};
export var getOverUnderStyling = function (prop) {
    if (prop.startsWith("O")) {
        return "h-[4px] bg-green-400 basis-0 grow flex-rowbox-border rounded-md relative w-full";
    }
    return "h-[4px] bg-red-400 basis-0 grow flex-rowbox-border rounded-md relative w-full";
};
export var getParlayType = function (numberOfLegs) {
    return numberOfLegs === 1 ? "Same Game Parlay" : "Same Game Parlay+";
};
export var getParlayTypeAbbreviated = function (numberOfLegs) {
    return numberOfLegs === 1 ? "SGP" : "SGP+";
};
export var getParlaysWithLegs = function (fbParlays) { return __awaiter(void 0, void 0, void 0, function () {
    var frontendParlays, allParlayIds, allParlayLegs, parlayIdToLegs, _i, allParlayLegs_1, leg, newLeg, legs, newLegs, _a, allParlayIds_1, parlayId, sortedLegs, _b, fbParlays_1, parlay, frontendParlay;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                frontendParlays = [];
                allParlayIds = fbParlays.map(function (parlayMetadata) { return parlayMetadata.parlay_id; });
                return [4 /*yield*/, getAllParlayLegs(allParlayIds)];
            case 1:
                allParlayLegs = _c.sent();
                parlayIdToLegs = new Map();
                for (_i = 0, allParlayLegs_1 = allParlayLegs; _i < allParlayLegs_1.length; _i++) {
                    leg = allParlayLegs_1[_i];
                    newLeg = {
                        text: leg["text"],
                        team: leg["team"],
                        odds: leg["odds"],
                        matchup_id: leg["matchup_id"],
                        day_id: leg["day_id"],
                        parlay_id: leg["parlay_id"],
                        frontend_id: leg["frontend_id"],
                        index: leg["index"],
                    };
                    if (leg["live_value"] !== undefined && leg["live_value"] !== null) {
                        newLeg.live_value = leg["live_value"];
                    }
                    if (leg["did_hit"] !== undefined && leg["did_hit"] !== null) {
                        newLeg.did_hit = leg["did_hit"];
                    }
                    if (parlayIdToLegs.has(leg.parlay_id)) {
                        legs = parlayIdToLegs.get(leg.parlay_id);
                        legs.push(newLeg);
                        parlayIdToLegs.set(leg.parlay_id, legs);
                    }
                    else {
                        newLegs = [newLeg];
                        parlayIdToLegs.set(leg.parlay_id, newLegs);
                    }
                }
                for (_a = 0, allParlayIds_1 = allParlayIds; _a < allParlayIds_1.length; _a++) {
                    parlayId = allParlayIds_1[_a];
                    sortedLegs = parlayIdToLegs
                        .get(parlayId)
                        .sort(function (a, b) { return a.index - b.index; });
                    parlayIdToLegs.set(parlayId, sortedLegs);
                }
                for (_b = 0, fbParlays_1 = fbParlays; _b < fbParlays_1.length; _b++) {
                    parlay = fbParlays_1[_b];
                    frontendParlay = {
                        user_id: parlay.user_id,
                        is_active: parlay.is_active,
                        parlay_id: parlay.parlay_id,
                        created_at: parlay.created_at,
                        expires_at: parlay.expires_at,
                        matchup_id: parlay.matchup_id,
                        total_odds: parlay.total_odds,
                        payout: parlay.payout,
                        wager: parlay.wager,
                        frontend_is_active: parlay.is_active,
                        is_winner: parlay.is_winner,
                        legs: parlayIdToLegs.get(parlay.parlay_id),
                    };
                    frontendParlays.push(frontendParlay);
                }
                return [2 /*return*/, frontendParlays];
        }
    });
}); };
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
    return playerName.length > 15 && window.innerWidth < 501;
};
export var getPropTextWithRespectToScreenSize = function (leg, screenWidth) {
    var betType = leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1];
    if (betType !== propField[1]) {
        if (betType === propField[4]) {
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
        ]));
        for (var _a = 0, _b = matchup.road.top_5; _a < _b.length; _a++) {
            var player = _b[_a];
            teamData
                .get(matchup.road.name)
                .set("".concat(player.name, "_score"), player.live_total.toString());
        }
        teamData.set(matchup.home.name, new Map([
            ["live_score", matchup.home.live_score.toString()],
            ["live_spread", matchup.home.spread.live_value],
            ["live_points", matchup.home.points.live_value],
            ["live_moneyline", matchup.home.moneyline.live_value],
        ]));
        for (var _c = 0, _d = matchup.home.top_5; _c < _d.length; _c++) {
            var player = _d[_c];
            teamData
                .get(matchup.home.name)
                .set("".concat(player.name, "_score"), player.live_total.toString());
        }
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
/*
export interface Team {
  icon: string;
  name: string;
  record: string;
  spread: PropLineMetadata;
  points: PropLineMetadata;
  moneyline: PropLineMetadata;
  live_score: number;
  team_total: IndividualLineMetadata;
  top_5: Player[];
}
* */
var getAllPlayerData = function (matchupId) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, data, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, supabase
                    .from("fb_players")
                    .select("name, team, pos, live_score, status, fantasy_team_name, avg, games_left")
                    .eq("matchup_id", matchupId)];
            case 1:
                _a = _b.sent(), data = _a.data, error = _a.error;
                if (error)
                    throw error;
                if (data) {
                    return [2 /*return*/, data];
                }
                return [2 /*return*/];
        }
    });
}); };
var getAllTeamData = function (teamNames) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, data, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, supabase
                    .from("fb_fantasy_teams")
                    .select("name, live_score, profile_url, wins, losses")
                    .eq("league_id", 889646124)
                    .in("name", teamNames)];
            case 1:
                _a = _b.sent(), data = _a.data, error = _a.error;
                if (error)
                    throw error;
                if (data) {
                    return [2 /*return*/, data];
                }
                return [2 /*return*/];
        }
    });
}); };
var getMatchupInformation = function (matchupId) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, data, error, typedData, distinctTeams, allTeamMetadata, teamToMetadata, _i, allTeamMetadata_1, teamMetadata, allPlayerMetadata, playerToMetadata, _b, allPlayerMetadata_1, playerMetadata, matchups, teamNameToTeam, _c, distinctTeams_1, teamName, metadata, teamNameToMatchupName, matchupToMatchupSchema, _d, matchups_1, matchup, teamNames, roadTeam, homeTeam, _e, typedData_1, propInfo, propIdAndBetType, propId, betType, matchup, teamNames, homeTeam, matchupName, matchup, matchupTeam, playerMetadata, matchupName, matchup, weeklySlate, _f, matchups_2, matchup, matchupPropSlate, roadLiveScore, homeLiveScore, roadName, homeName;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, supabase
                    .from("fb_props")
                    .select("*")
                    .eq("matchup_id", matchupId)
                    .eq("day_id", getDaysSinceLastMonday())];
            case 1:
                _a = _g.sent(), data = _a.data, error = _a.error;
                if (error)
                    throw error;
                if (!data) return [3 /*break*/, 4];
                typedData = data;
                distinctTeams = Array.from(new Set(typedData.map(function (prop_metadata) { return prop_metadata.main_prop_id; })));
                return [4 /*yield*/, getAllTeamData(distinctTeams)];
            case 2:
                allTeamMetadata = _g.sent();
                teamToMetadata = new Map();
                for (_i = 0, allTeamMetadata_1 = allTeamMetadata; _i < allTeamMetadata_1.length; _i++) {
                    teamMetadata = allTeamMetadata_1[_i];
                    teamToMetadata.set(teamMetadata.name, teamMetadata);
                }
                return [4 /*yield*/, getAllPlayerData(matchupId)];
            case 3:
                allPlayerMetadata = _g.sent();
                playerToMetadata = new Map();
                for (_b = 0, allPlayerMetadata_1 = allPlayerMetadata; _b < allPlayerMetadata_1.length; _b++) {
                    playerMetadata = allPlayerMetadata_1[_b];
                    playerToMetadata.set(playerMetadata.name, playerMetadata);
                }
                matchups = Array.from(new Set(typedData.map(function (prop_metadata) {
                    if (prop_metadata.prop_id.split("/")[0].includes(" v ")) {
                        return prop_metadata.prop_id.split("/")[0];
                    }
                }))).filter(function (matchup) { return matchup !== undefined; });
                teamNameToTeam = new Map();
                for (_c = 0, distinctTeams_1 = distinctTeams; _c < distinctTeams_1.length; _c++) {
                    teamName = distinctTeams_1[_c];
                    metadata = teamToMetadata.get(teamName);
                    teamNameToTeam.set(teamName, {
                        icon: metadata.profile_url,
                        name: teamName,
                        top_5: [],
                        team_total: { text: "", over_odds: 0, under_odds: 0 },
                        points: { text: "", odds: 0, live_value: "" },
                        live_score: metadata.live_score,
                        record: "".concat(metadata.wins, "-").concat(metadata.losses),
                        moneyline: { text: "", odds: 0, live_value: "" },
                        spread: { text: "", odds: 0, live_value: "" },
                    });
                }
                teamNameToMatchupName = new Map();
                matchupToMatchupSchema = new Map();
                for (_d = 0, matchups_1 = matchups; _d < matchups_1.length; _d++) {
                    matchup = matchups_1[_d];
                    teamNames = matchup.split(" v ");
                    roadTeam = teamNames[0];
                    homeTeam = teamNames[1];
                    teamNameToMatchupName.set(roadTeam, matchup);
                    teamNameToMatchupName.set(homeTeam, matchup);
                    matchupToMatchupSchema.set(matchup, {
                        road: teamNameToTeam.get(roadTeam),
                        home: teamNameToTeam.get(homeTeam),
                    });
                }
                for (_e = 0, typedData_1 = typedData; _e < typedData_1.length; _e++) {
                    propInfo = typedData_1[_e];
                    propIdAndBetType = propInfo.prop_id.split("/");
                    propId = propIdAndBetType[0];
                    betType = propIdAndBetType[1];
                    if (matchupToMatchupSchema.has(propId)) {
                        matchup = matchupToMatchupSchema.get(propId);
                        teamNames = propId.split(" v ");
                        homeTeam = teamNames[1];
                        if (betType === propField[0]) {
                            matchup.home.spread.odds =
                                homeTeam === propInfo.main_prop_id
                                    ? propInfo.main_prop_odds
                                    : propInfo.sub_prop_odds;
                            matchup.road.spread.odds =
                                homeTeam !== propInfo.main_prop_id
                                    ? propInfo.main_prop_odds
                                    : propInfo.sub_prop_odds;
                            matchup.home.spread.text =
                                homeTeam === propInfo.main_prop_id
                                    ? "- " + propInfo.point_value
                                    : "+ " + propInfo.point_value;
                            matchup.road.spread.text =
                                homeTeam !== propInfo.main_prop_id
                                    ? "- " + propInfo.point_value
                                    : "+ " + propInfo.point_value;
                        }
                        else if (betType === propField[1]) {
                            matchup.home.points.odds =
                                homeTeam === propInfo.main_prop_id
                                    ? propInfo.main_prop_odds
                                    : propInfo.sub_prop_odds;
                            matchup.road.points.odds =
                                homeTeam !== propInfo.main_prop_id
                                    ? propInfo.main_prop_odds
                                    : propInfo.sub_prop_odds;
                            matchup.home.points.text = "U " + propInfo.point_value;
                            matchup.road.points.text = "O " + propInfo.point_value;
                        }
                        else if (betType === propField[2]) {
                            matchup.home.moneyline.odds =
                                homeTeam === propInfo.main_prop_id
                                    ? propInfo.main_prop_odds
                                    : propInfo.sub_prop_odds;
                            matchup.road.moneyline.odds =
                                homeTeam !== propInfo.main_prop_id
                                    ? propInfo.main_prop_odds
                                    : propInfo.sub_prop_odds;
                        }
                        matchupToMatchupSchema.set(propId, matchup);
                    }
                    else {
                        if (teamNameToMatchupName.has(propId)) {
                            matchupName = teamNameToMatchupName.get(propId);
                            matchup = matchupToMatchupSchema.get(matchupName);
                            matchupTeam = matchup.home.name === propId ? matchup.home : matchup.road;
                            matchupTeam.team_total.text = propInfo.point_value.toString();
                            matchupTeam.team_total.over_odds = propInfo.main_prop_odds;
                            matchupTeam.team_total.under_odds = propInfo.sub_prop_odds;
                            matchupToMatchupSchema.set(matchupName, matchup);
                        }
                        else {
                            playerMetadata = playerToMetadata.get(propId);
                            matchupName = teamNameToMatchupName.get(propInfo.main_prop_id);
                            matchup = matchupToMatchupSchema.get(matchupName);
                            if (matchup.home.name === propInfo.main_prop_id) {
                                matchup.home.top_5.push({
                                    name: propId,
                                    average: playerMetadata.avg,
                                    position: playerMetadata.pos,
                                    status: playerMetadata.status,
                                    games_left: playerMetadata.games_left,
                                    team: playerMetadata.team,
                                    live_total: playerMetadata.live_score,
                                    prop_line: {
                                        text: propInfo.point_value.toString(),
                                        over_odds: propInfo.main_prop_odds,
                                        under_odds: propInfo.sub_prop_odds,
                                    },
                                });
                            }
                            else if (matchup.road.name === propInfo.main_prop_id) {
                                matchup.road.top_5.push({
                                    name: propId,
                                    average: playerMetadata.avg,
                                    position: playerMetadata.pos,
                                    status: playerMetadata.status,
                                    games_left: playerMetadata.games_left,
                                    team: playerMetadata.team,
                                    live_total: playerMetadata.live_score,
                                    prop_line: {
                                        text: propInfo.point_value.toString(),
                                        over_odds: propInfo.main_prop_odds,
                                        under_odds: propInfo.sub_prop_odds,
                                    },
                                });
                            }
                            matchupToMatchupSchema.set(matchupName, matchup);
                        }
                    }
                }
                weeklySlate = [];
                for (_f = 0, matchups_2 = matchups; _f < matchups_2.length; _f++) {
                    matchup = matchups_2[_f];
                    matchupPropSlate = matchupToMatchupSchema.get(matchup);
                    roadLiveScore = matchupPropSlate.road.live_score;
                    homeLiveScore = matchupPropSlate.home.live_score;
                    roadName = matchupPropSlate.road.name;
                    homeName = matchupPropSlate.home.name;
                    matchupPropSlate.road.top_5 = matchupPropSlate.road.top_5
                        .sort(function (a, b) { return b.average - a.average; })
                        .slice(0, matchupPropSlate.road.top_5.length < 10
                        ? matchupPropSlate.road.top_5.length
                        : 10);
                    matchupPropSlate.home.top_5 = matchupPropSlate.home.top_5
                        .sort(function (a, b) { return b.average - a.average; })
                        .slice(0, matchupPropSlate.home.top_5.length < 10
                        ? matchupPropSlate.home.top_5.length
                        : 10);
                    matchupPropSlate.road.moneyline.live_value =
                        roadLiveScore === homeLiveScore
                            ? "TIE"
                            : homeLiveScore > roadLiveScore
                                ? homeName
                                : roadName;
                    matchupPropSlate.road.spread.live_value =
                        roadLiveScore === homeLiveScore
                            ? "0.0"
                            : (parseFloat((homeLiveScore - roadLiveScore).toFixed()) + 0.5).toString();
                    matchupPropSlate.road.points.live_value = (roadLiveScore + homeLiveScore).toFixed();
                    matchupPropSlate.home.moneyline.live_value =
                        roadLiveScore === homeLiveScore
                            ? "TIE"
                            : homeLiveScore > roadLiveScore
                                ? homeName
                                : roadName;
                    matchupPropSlate.home.spread.live_value =
                        roadLiveScore === homeLiveScore
                            ? "0.0"
                            : (parseFloat((roadLiveScore - homeLiveScore).toFixed()) + 0.5).toString();
                    matchupPropSlate.home.points.live_value = (roadLiveScore + homeLiveScore).toFixed();
                    weeklySlate.push(matchupPropSlate);
                }
                return [2 /*return*/, weeklySlate];
            case 4: return [2 /*return*/];
        }
    });
}); };
export var getDailySlate = function (matchupId) { return __awaiter(void 0, void 0, void 0, function () {
    var matchupToMatchupSchema;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getMatchupInformation(matchupId)];
            case 1:
                matchupToMatchupSchema = _a.sent();
                return [2 /*return*/, Array.from(matchupToMatchupSchema.values())];
        }
    });
}); };
export var round5 = function (x) {
    return Math.ceil(x / 5) * 5;
};
export var roundToInteger = function (value) {
    return parseFloat(parseFloat(value).toFixed());
};
//# sourceMappingURL=Util.js.map