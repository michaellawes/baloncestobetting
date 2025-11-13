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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faDownload, fas, faSquareCheck, faSquareXmark, } from "@fortawesome/free-solid-svg-icons";
import html2canvas from "html2canvas-pro";
import { downloadImage } from "../../utils/exportAsImage";
import { saveAs } from "file-saver";
library.add(fas);
export function Parlay(props) {
    var _this = this;
    var parlay_id = props.parlay_id, created_at = props.created_at, frontend_is_active = props.frontend_is_active, legs = props.legs, total_odds = props.total_odds, payout = props.payout, wager = props.wager, is_winner = props.is_winner;
    var getReadableDate = function (timestamp) {
        var d = new Date(timestamp);
        return (d.getMonth() +
            1 +
            "/" +
            d.getDate() +
            "/" +
            d.getFullYear() +
            " " +
            d.getHours() +
            ":" +
            d.getMinutes());
    };
    var handleCaptureClick = function () { return __awaiter(_this, void 0, void 0, function () {
        var parlayElement, userAgent, canvas, dataURL, dataURL;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parlayElement = document.getElementById(parlay_id);
                    if (!parlayElement)
                        return [2 /*return*/];
                    userAgent = navigator.userAgent;
                    return [4 /*yield*/, html2canvas(parlayElement)];
                case 1:
                    canvas = _a.sent();
                    if (userAgent.search("Firefox") >= 0) {
                        dataURL = canvas
                            .toDataURL("image/png")
                            .replace("image/png", "image/octet-stream");
                        saveAs(dataURL, "parlay-".concat(parlay_id.substring(parlay_id.length - 5), ".png"));
                    }
                    else {
                        dataURL = canvas.toDataURL("image/png");
                        downloadImage(dataURL, "parlay-".concat(parlay_id.substring(parlay_id.length - 5), ".png"));
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("div", { className: "w-full float-left shadow-sm rounded-xs dark:bg-gray-800 dark:border-white border-1", id: parlay_id, children: [_jsxs("div", { className: "p-4 flex w-full items-center justify-between border-b-1 border-b-gray-400", children: [_jsx("span", { className: "text-gray-500 text-xs float-left", children: parlay_id.substring(parlay_id.length - 5) }), _jsx("span", { className: "text-white float-left", children: getReadableDate(created_at) }), _jsxs("span", { className: "text-white float-left", children: [total_odds > 0 && "+", total_odds] }), !frontend_is_active && is_winner && (_jsx("div", { className: "text-green-700 z-40 text-base float-left", children: _jsx(FontAwesomeIcon, { icon: faSquareCheck }) })), !frontend_is_active && !is_winner && (_jsx("div", { className: "text-red-700 text-base float-left", children: _jsx(FontAwesomeIcon, { icon: faSquareXmark }) }))] }), _jsx("div", { className: "float-left max-h-48 overflow-y-scroll scrollbar-hide w-full flex-col dark:bg-gray-800", children: legs.map(function (leg) { return (_jsxs("div", { className: "pt-1 h-12", children: [_jsxs("div", { className: "pl-5 float-left w-7/8 h-full", children: [_jsxs("span", { className: "block relative text-white text-sm", children: [leg.team, " ", leg.text] }), _jsx("span", { className: "block relative text-gray-400 text-xs", children: leg.betType })] }), _jsx("div", { className: "float-right w-1/8 text-right pr-5", children: _jsxs("span", { className: "text-gray-300", children: [leg.odds > 0 && "+", leg.odds] }) })] }, leg.frontend_id)); }) }), _jsxs("div", { className: "p-4 border-t-2 flex w-full items-center justify-between border-b-1 rounded-xs dark:bg-gray-800 dark:border-gray-700", children: [_jsxs("div", { className: "float-left text-left pl-2", children: [_jsxs("span", { className: "text-gray-200 text-sm", children: ["$", wager, " to "] }), _jsxs("span", { className: "text-green-500 text-sm", children: ["$", payout.toFixed(2)] })] }), _jsx("div", { className: "float-left w-1/2", children: _jsx("button", { className: "pl-2 pr-2 block text-white text-base float-right hover:bg-gray-600", onClick: function () { return handleCaptureClick(); }, children: _jsx(FontAwesomeIcon, { icon: faDownload }) }) })] })] }));
}
//# sourceMappingURL=Parlay.js.map