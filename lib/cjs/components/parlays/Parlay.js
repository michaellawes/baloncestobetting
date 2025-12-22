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
import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faDownload, fas, faShare, faSquareCheck, faSquareXmark, } from "@fortawesome/free-solid-svg-icons";
import { evaluateLeg, exportAsImage, getOverUnderStyling, getParlayType, getPropTextWithRespectToScreenSize, getPropValue, getReadableDate, numberWithCommas, } from "../../utils/Util";
import { progressBarWidth, propField, specialLegTypes, } from "../../utils/Constants";
library.add(fas);
export function Parlay(props) {
    var _this = this;
    var parlay_id = props.parlay_id, created_at = props.created_at, expires_at = props.expires_at, is_active = props.is_active, legs = props.legs, total_odds = props.total_odds, payout = props.payout, wager = props.wager, is_winner = props.is_winner, liveTeamData = props.liveTeamData, setNotification = props.setNotification, livePlayerData = props.livePlayerData;
    var getLiveValue = function (leg) {
        if (leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] ===
            propField[1]) {
            var teams = leg.frontend_id.split("/")[0].split(" v ");
            var roadTeamName = teams[0];
            return leg.live_value !== undefined
                ? leg.live_value
                : parseFloat(liveTeamData.get(roadTeamName).get("live_points")).toFixed();
        }
        else if (leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] ===
            propField[0]) {
            return leg.live_value !== undefined
                ? leg.live_value
                : parseFloat(liveTeamData.get(leg.team).get("live_points")).toFixed();
        }
        else if (leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] ===
            propField[2]) {
            return leg.live_value !== undefined
                ? leg.live_value
                : parseFloat(liveTeamData.get(leg.team).get("live_points")).toFixed();
        }
        else if (leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] ===
            propField[3]) {
            return leg.live_value !== undefined
                ? leg.live_value
                : parseFloat(liveTeamData.get(leg.team).get("live_score")).toFixed();
        }
        else if (leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] ===
            propField[4]) {
            var playerName = leg.frontend_id.split("/")[0];
            return leg.live_value !== undefined
                ? leg.live_value
                : parseFloat(livePlayerData.get(playerName)).toFixed();
        }
    };
    var getLiveSpreadUpdateStyle = function (leg) {
        var live_spread_text = liveTeamData
            .get(leg.team)
            .get("live_spread");
        if (live_spread_text === "0.0") {
            return "text-sm text-yellow-400 font-light";
        }
        var live_spread = parseFloat(live_spread_text);
        if (evaluateLeg(leg, live_spread)) {
            return "text-sm text-green-500 font-light";
        }
        else {
            return "text-sm text-red-500 font-light";
        }
    };
    var getLiveSpreadUpdate = function (leg) {
        var live_spread = liveTeamData.get(leg.team).get("live_spread");
        if (live_spread === "0.0") {
            return "TIE";
        }
        if (parseFloat(live_spread) > 0) {
            return "".concat(leg.team, " +").concat(live_spread);
        }
        return "".concat(leg.team, " ").concat(live_spread);
    };
    var getLiveMoneylineUpdateStyle = function (leg) {
        var live_moneyline = liveTeamData
            .get(leg.team)
            .get("live_moneyline");
        if (live_moneyline === "TIE") {
            return "text-sm text-yellow-400 font-light";
        }
        if (leg.team === live_moneyline) {
            return "text-sm text-green-500 font-light";
        }
        else {
            return "text-sm text-red-500 font-light";
        }
    };
    var getLiveMoneylineUpdate = function (leg) {
        return liveTeamData.get(leg.team).get("live_moneyline");
    };
    var getProgressBarWidth = function (leg) {
        if (leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] ===
            propField[1]) {
            var teams = leg.frontend_id.split("/")[0].split(" v ");
            var roadTeamName = teams[0];
            var liveTotalPointsScored = leg.live_value !== undefined
                ? leg.live_value
                : parseFloat(parseFloat(liveTeamData.get(roadTeamName).get("live_points")).toFixed());
            var propTotalPointsScored = parseFloat(getPropValue(leg.text));
            var propTotalPointsScoredFull = parseFloat((propTotalPointsScored * 1.2).toFixed());
            if (liveTotalPointsScored > propTotalPointsScoredFull) {
                liveTotalPointsScored = propTotalPointsScoredFull;
            }
            var percentFull = parseFloat(((liveTotalPointsScored / propTotalPointsScoredFull) * 100).toFixed());
            if (percentFull > 75 && percentFull < 80) {
                percentFull = 75;
            }
            var styling = percentFull.toString();
            if (leg.did_hit !== undefined &&
                !leg.did_hit &&
                leg.text.startsWith("O")) {
                styling = Math.min(75, percentFull).toString();
            }
            if (leg.did_hit !== undefined &&
                leg.did_hit &&
                leg.text.startsWith("U")) {
                styling = Math.min(75, percentFull).toString();
            }
            return progressBarWidth.get(styling);
        }
        else if (leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] ===
            propField[3]) {
            var team = leg.team;
            var liveTeamScore = leg.live_value !== undefined
                ? leg.live_value
                : parseFloat(parseFloat(liveTeamData.get(team).get("live_score")).toFixed());
            var propTeamScore = parseFloat(getPropValue(leg.text));
            var propTeamScoreFull = parseFloat((propTeamScore * 1.2).toFixed());
            if (liveTeamScore > propTeamScoreFull) {
                liveTeamScore = propTeamScoreFull;
            }
            var percentFull = parseFloat(((liveTeamScore / propTeamScoreFull) * 100).toFixed());
            if (percentFull > 75 && percentFull < 80) {
                percentFull = 75;
            }
            var styling = percentFull.toString();
            if (leg.did_hit !== undefined &&
                !leg.did_hit &&
                leg.text.startsWith("O")) {
                styling = Math.min(75, percentFull).toString();
            }
            if (leg.did_hit !== undefined &&
                leg.did_hit &&
                leg.text.startsWith("U")) {
                styling = Math.min(75, percentFull).toString();
            }
            return progressBarWidth.get(styling);
        }
        else if (leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] ===
            propField[4]) {
            var playerName = leg.frontend_id.split("/")[0];
            var livePlayerScore = leg.live_value !== undefined
                ? leg.live_value
                : parseFloat(livePlayerData.get(playerName));
            var propPlayerScore = parseFloat(getPropValue(leg.text));
            var propPlayerScoreFull = parseFloat((propPlayerScore * 1.2).toFixed());
            if (livePlayerScore > propPlayerScoreFull) {
                livePlayerScore = propPlayerScoreFull;
            }
            var percentFull = parseFloat(((livePlayerScore / propPlayerScoreFull) * 100).toFixed());
            if (percentFull > 75 && percentFull < 80) {
                percentFull = 75;
            }
            var styling = percentFull.toString();
            if (leg.did_hit !== undefined &&
                !leg.did_hit &&
                leg.text.startsWith("O")) {
                styling = Math.min(75, percentFull).toString();
            }
            if (leg.did_hit !== undefined &&
                leg.did_hit &&
                leg.text.startsWith("U")) {
                styling = Math.min(75, percentFull).toString();
            }
            return progressBarWidth.get(styling);
        }
        return "h-[4px] z-80 bg-blue-900 bases-0 grow flex-row box-border rounded-l-md relative w-full";
    };
    var handleCaptureClick = function () { return __awaiter(_this, void 0, void 0, function () {
        var parlayElement, parlayLegs;
        var _this = this;
        return __generator(this, function (_a) {
            parlayElement = document.getElementById(parlay_id);
            parlayLegs = document.getElementById(parlay_id + "/legs");
            if (!parlayElement)
                return [2 /*return*/];
            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, exportAsImage(parlayElement, parlayLegs, "parlay-".concat(parlay_id.substring(parlay_id.length - 5), ".png"))];
                        case 1:
                            _a.sent();
                            setNotification({
                                show: true,
                                legs: 0,
                                message: "Downloaded parlay!",
                                type: "DOWNLOAD",
                            });
                            return [2 /*return*/];
                    }
                });
            }); }, 1000);
            return [2 /*return*/];
        });
    }); };
    var handleShareSlip = function (parlay_id) {
        var parlayLinkWithId = "".concat(window.location.href.substring(0, window.location.href.length - 8), "/").concat(parlay_id);
        var url = parlayLinkWithId;
        if (window.innerWidth < 469) {
            url =
                "Check out my NEW parlay on\nCnb Baloncesto Fantasy Bets\nwith the parlay link below:\n" +
                    parlayLinkWithId;
        }
        navigator.clipboard.writeText(url);
        setNotification({
            show: true,
            legs: 0,
            message: "Copied parlay link!",
            type: "CLIPBOARD",
        });
    };
    var getContainsCinemaLeg = function () {
        if (legs !== undefined && legs.length > 0) {
            return legs.some(function (leg) {
                return leg.special_leg_type !== undefined &&
                    leg.special_leg_type === specialLegTypes[0];
            });
        }
        return false;
    };
    var getAllCinemaLegs = function () {
        if (legs !== undefined && legs.length > 0) {
            return legs.every(function (leg) {
                return leg.special_leg_type !== undefined &&
                    leg.special_leg_type === specialLegTypes[0];
            });
        }
        return false;
    };
    return (_jsxs("div", { className: getContainsCinemaLeg()
            ? "w-full mb-2 border-l-3 border-l-yellow-400 border-t-yellow-400  border-r-yellow-400 float-left rounded-t-sm rounded-l-sm rounded-r-xs bg-gray-900 border-t-1 border-r-1"
            : "w-full mb-2 border-l-3 border-l-gray-500 border-t-gray-500  border-r-gray-600 float-left rounded-t-sm rounded-l-sm rounded-r-xs bg-gray-900 border-t-1 border-r-1", id: parlay_id, children: [_jsxs("div", { className: getContainsCinemaLeg()
                    ? "p-4 flex flex-row w-full items-center justify-between border-b-1 border-b-yellow-500"
                    : "p-4 flex flex-row w-full items-center justify-between border-b-1 border-b-gray-500", children: [_jsxs("span", { className: getAllCinemaLegs()
                            ? "text-yellow-300 text-base flex w-6/8 font-bold"
                            : "text-blue-500 text-base flex w-6/8 font-bold", children: [legs.length, " leg ", getParlayType(legs.length)] }), getContainsCinemaLeg() ? (_jsxs("span", { className: "text-yellow-300 text-sm w-1/8 justify-end flex font-bold", children: [total_odds > 0 && "+", total_odds] })) : (_jsxs("span", { className: "text-white text-sm w-1/8 justify-end flex font-bold", children: [total_odds > 0 && "+", total_odds] })), !is_active && is_winner && (_jsx("div", { className: getAllCinemaLegs()
                            ? "text-yellow-300 z-40 w-1/8 justify-end flex"
                            : "text-green-600 z-40 w-1/8 justify-end flex", children: _jsx(FontAwesomeIcon, { icon: faSquareCheck }) })), !is_active && !is_winner && (_jsx("div", { className: "text-red-600 text-base w-1/8 justify-end flex", children: _jsx(FontAwesomeIcon, { icon: faSquareXmark }) }))] }), _jsx("div", { id: parlay_id + "/legs", className: "flex mb-2 max-h-110 overflow-y-scroll scrollbar-hide w-full flex-col bg-gray-900", children: legs.map(function (leg, index) { return (_jsxs("div", { id: leg.text + "-" + parlay_id.substring(parlay_id.length - 5), className: "flex flex-col grow items-stretch w-full", children: [_jsx("div", { className: "flex flew-row grow items-stretch w-full", children: _jsxs("div", { className: index > 0
                                    ? "pt-1 h-auto mt-2 mb-1 border-t border-t-gray-700 flex flex-row w-full"
                                    : "pt-1 h-auto mb-1 flex flex-row w-full", children: [_jsxs("div", { className: "flex flex-col grow items-stretch pl-5 justify-start w-7/8", children: [_jsx("span", { className: !is_active
                                                    ? leg.did_hit
                                                        ? "block relative text-green-500 text-sm"
                                                        : "block relative text-red-500 text-sm"
                                                    : "block relative text-white text-sm", children: getPropTextWithRespectToScreenSize(leg, window.innerWidth) }), leg.special_leg_type !== undefined ? (_jsxs(_Fragment, { children: [leg.special_leg_type === specialLegTypes[0] && (_jsxs("span", { className: "flex relative text-yellow-300 text-xs", children: ["CINEMA ", leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1]] })), leg.special_leg_type === specialLegTypes[1] && (_jsxs("span", { className: "flex relative text-blue-400 text-xs", children: ["DISCOUNTED ", leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1]] }))] })) : (_jsx("span", { className: "flex relative text-gray-400 text-xs", children: leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] }))] }), _jsx("div", { className: "flex flex-row justify-end w-1/8 text-right pr-5", children: leg.special_leg_type !== undefined ? (_jsxs(_Fragment, { children: [leg.special_leg_type === specialLegTypes[0] && (_jsxs("span", { className: "text-yellow-300", children: [leg.odds > 0 && "+", leg.odds] })), leg.special_leg_type === specialLegTypes[1] && (_jsxs("span", { className: "text-blue-400", children: [leg.odds > 0 && "+", leg.odds] }))] })) : (_jsxs("span", { className: "text-gray-300", children: [leg.odds > 0 && "+", leg.odds] })) })] }) }), is_active &&
                            leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] === propField[0] && (_jsx("div", { className: "flex flex-row w-full grow items-center justify-start h-auto m1-2 px-5", children: _jsx("span", { className: getLiveSpreadUpdateStyle(leg), children: getLiveSpreadUpdate(leg) }) })), leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] === propField[1] && (_jsx("div", { className: "flex w-full pb-4 flex-row grow justify-start h-auto items-center px-3 my-2", children: _jsx("div", { className: "flex basis-0 grow flex-rowbox-border rounded-md relative w-full pl-2", children: _jsxs("div", { className: getOverUnderStyling(leg.text), children: [_jsx("div", { id: leg.frontend_id, className: getProgressBarWidth(leg), children: _jsx("div", { className: "h-[4px] flex justify-end items-center ml-5", children: _jsx("span", { className: "bg-gray-900 text-white text-xs px-2 rounded-md border border-gray-400", children: getLiveValue(leg) }) }) }), _jsx("div", { className: "h-[4px] z-8 bg-gray-400 mt-[-4px] border-r-gray-900 border-r-6 basis-0 grow justify-end text-end flex-rowbox-border rounded-l-md relative w-75/100" }), _jsx("div", { className: "w-75/100 flex justify-end ml-4 mt-1", children: _jsx("span", { className: "flex text-white text-end h-[4px] font-light text-xs", children: getPropValue(leg.text) }) })] }) }) })), is_active &&
                            leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] === propField[2] && (_jsx("div", { className: "flex flex-row w-full grow items-center justify-start h-auto m1-2 px-5", children: _jsx("span", { className: getLiveMoneylineUpdateStyle(leg), children: getLiveMoneylineUpdate(leg) }) })), leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] === propField[3] && (_jsx("div", { className: "flex w-full pb-4 flex-row grow justify-start h-auto items-center px-3 my-2", children: leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] === propField[3] && (_jsx(_Fragment, { children: _jsx("div", { className: "flex basis-0 grow flex-rowbox-border rounded-md relative w-full pl-2", children: _jsxs("div", { className: getOverUnderStyling(leg.text), children: [_jsx("div", { id: leg.frontend_id, className: getProgressBarWidth(leg), children: _jsx("div", { className: "h-[4px] flex justify-end items-center ml-5", children: _jsx("span", { className: "bg-gray-900 text-white text-xs px-2 rounded-md border border-gray-400", children: getLiveValue(leg) }) }) }), _jsx("div", { className: "h-[4px] z-8 bg-gray-400 mt-[-4px] border-r-gray-900 border-r-6 basis-0 grow justify-end text-end flex-rowbox-border rounded-l-md relative w-75/100" }), _jsx("div", { className: "w-75/100 flex justify-end ml-4 mt-1", children: _jsx("span", { className: "flex text-white text-end h-[4px] font-light text-xs", children: getPropValue(leg.text) }) })] }) }) })) })), leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] === propField[4] && (_jsx("div", { className: "flex w-full pb-4 flex-row grow justify-start h-auto items-center px-3 my-2", children: _jsx("div", { className: "flex basis-0 grow flex-rowbox-border rounded-md relative w-full pl-2", children: _jsxs("div", { className: getOverUnderStyling(leg.text), children: [_jsx("div", { id: leg.frontend_id, className: getProgressBarWidth(leg), children: _jsx("div", { className: "h-[4px] flex justify-end items-center ml-5", children: _jsx("span", { className: "bg-gray-900 text-white text-xs px-2 rounded-md border border-gray-400", children: getLiveValue(leg) }) }) }), _jsx("div", { className: "h-[4px] z-8 bg-gray-400 mt-[-4px] border-r-gray-900 border-r-6 basis-0 grow rounded-l-md justify-end text-end flex-rowbox-border relative w-75/100" }), _jsx("div", { className: "w-75/100 flex justify-end ml-4 mt-1", children: _jsx("span", { className: "flex text-white text-end h-[4px] font-light text-xs", children: getPropValue(leg.text) }) })] }) }) }))] }, leg.frontend_id)); }) }), _jsxs("div", { className: getContainsCinemaLeg()
                    ? "border-t-1 flex flex-col w-full items-center justify-between border-b-1 bg-gray-800 border-yellow-400"
                    : "border-t-1 flex flex-col w-full items-center justify-between border-b-1 bg-gray-800 border-gray-700", children: [_jsxs("div", { className: "flex flex-row text-left pl-2 border-b-1 border-b-gray-700 w-full pb-1", children: [_jsxs("div", { className: is_active ? "flex flex-row w-14/16" : "flex flex-row w-15/16", children: [_jsxs("div", { className: "flex flex-col basis-0 grow justify-center items-stretch box-border relative pl-2", children: [_jsxs("span", { className: "font-[Proxima Nova, serif] tracking-[1px] uppercase text-gray-300 text-base text-left relative", children: ["$", numberWithCommas(wager)] }), _jsx("span", { className: "font-mono flex flex-row tracking-[1px] uppercase text-gray-300 text-xs text-[7px] relative", children: "total wager" })] }), _jsx("div", { className: "flex flex-row justify-end items-center box-border relative mt-1", children: _jsxs("span", { className: is_winner
                                                ? getAllCinemaLegs()
                                                    ? "text-yellow-300 text-sm font-bold font-[Proxima Nova, serif]"
                                                    : "text-green-500 text-sm font-bold font-[Proxima Nova, serif]"
                                                : is_active
                                                    ? "text-gray-300 text-sm font-bold font-[Proxima Nova, serif]"
                                                    : "text-gray-500 text-sm font-bold font-[Proxima Nova, serif]", children: ["$", numberWithCommas(parseFloat(payout.toFixed(2)))] }) })] }), is_active && (_jsx("div", { className: "flex flex-row w-1/16 m-1 mt-2 justify-end", children: _jsx("button", { className: "pl-1 pr-1 block text-white text-sm hover:bg-gray-700 border border-transparent rounded-4xl justify-end", onClick: function () { return handleShareSlip(parlay_id); }, children: _jsx(FontAwesomeIcon, { icon: faShare }) }) })), _jsx("div", { className: "flex flex-row w-1/16 m-1 mt-2 justify-end", children: _jsx("button", { className: "pl-1 pr-1 block text-white text-sm hover:bg-gray-700 border border-transparent rounded-4xl justify-end", onClick: function () { return handleCaptureClick(); }, children: _jsx(FontAwesomeIcon, { icon: faDownload }) }) })] }), _jsxs("div", { className: "w-full flex row shadow-sm rounded-xs bg-gray-800 ", children: [_jsx("div", { className: "flex w-1/5 justify-start items-center box-border relative font-mono pl-2", children: _jsxs("span", { className: "text-gray-400 text-[8px]", children: [_jsxs("span", { className: "uppercase text-gray-400 text-[8px]", children: ["bet id:", " "] }), parlay_id.substring(parlay_id.length - 5)] }) }), _jsx("div", { className: "flex w-2/5 justify-end items-center box-border relative font-mono", children: _jsxs("span", { className: "text-gray-400 text-[8px] float-left font-light uppercase font-mono", children: ["expires: ", getReadableDate(new Date(expires_at))] }) }), _jsx("div", { className: "flex w-2/5 justify-end items-center box-border relative pr-2", children: _jsxs("span", { className: "text-gray-400 text-[8px] float-left font-light uppercase font-mono", children: ["placed: ", getReadableDate(new Date(created_at))] }) })] })] })] }));
}
//# sourceMappingURL=Parlay.js.map