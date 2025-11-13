import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useContext, useEffect } from "react";
// @ts-ignore
import { TasksContext, TasksDispatchContext } from "../reducer/TasksContext";
// @ts-ignore
import { decimalToOdds, oddsToDecimal } from "../../utils/Util";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(fas);
export function LiveParlayViewer(props) {
    var balance = props.balance, setBalance = props.setBalance, isLoggedIn = props.isLoggedIn;
    var tasks = useContext(TasksContext);
    var dispatch = useContext(TasksDispatchContext);
    var _a = React.useState(0), totalDecimalOdds = _a[0], setTotalOdds = _a[1];
    var _b = React.useState(0), payout = _b[0], setPayout = _b[1];
    var _c = React.useState(10), wager = _c[0], setWager = _c[1];
    var _d = React.useState(false), showSlip = _d[0], setShowSlip = _d[1];
    var _e = React.useState(false), displayWarning = _e[0], setDisplayWarning = _e[1];
    useEffect(function () {
        setPayout(wager * totalDecimalOdds);
    }, [totalDecimalOdds, wager]);
    useEffect(function () {
        if (tasks.length > 0) {
            var totalDecimalOdds_1 = tasks.reduce(function (total, task) {
                return (total *= oddsToDecimal(task.odds));
            }, 1);
            setTotalOdds(totalDecimalOdds_1);
        }
    }, [totalDecimalOdds, tasks]);
    var removeAllLegs = function () {
        // @ts-ignore
        dispatch({ type: "clearSlip" });
    };
    var submitParlay = function () {
        if (wager <= balance) {
            setBalance(balance - wager);
            // @ts-ignore
            dispatch({
                type: "submitParlay",
                totalOdds: decimalToOdds(totalDecimalOdds),
                wager: wager,
                payout: payout,
            });
        }
    };
    var toggleSlip = function () {
        setShowSlip(!showSlip);
    };
    var removeLeg = function (id) {
        // @ts-ignore
        dispatch({ type: "removeLeg", frontend_id: id });
    };
    var handleWagerChange = function (event) {
        var value = Number(event.target.value);
        if (value > balance) {
            event.target.style.borderColor = "red";
            setDisplayWarning(true);
        }
        else {
            event.target.style.borderColor = "";
            setWager(value);
            setDisplayWarning(false);
        }
    };
    var getStyling = function (showSlip) {
        if (showSlip) {
            if (tasks.length == 1) {
                return ("bottom-18" +
                    " fixed pt-2 pb-5 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded-sm dark:border-b-gray-400 border-b-2");
            }
            else {
                return ("bottom-29" +
                    " fixed pt-2 pb-5 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded-sm dark:border-b-gray-400 border-b-2");
            }
        }
        else {
            return "fixed pt-2 pb-5 bottom-5 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded-sm";
        }
    };
    return (_jsx("div", { className: "flex w-full flex-col-reverse", children: tasks.length > 0 && (_jsxs("div", { className: getStyling(showSlip), children: [_jsxs("div", { className: "pb-2 w-fit md:w-full", children: [_jsx("div", { className: "float-left w-fit pb-2 md:w-1/3", children: _jsx("button", { onClick: toggleSlip, className: "block w-full hover:bg-gray-800 rounded-xl pl-2 pr-2", children: "View Slip" }) }, "view"), _jsxs("div", { className: "float-left text-center pb-2 w-fit md:w-1/3", children: [_jsxs("span", { children: ["$", wager, " to "] }), _jsxs("span", { className: "text-green-500", children: ["$", payout.toFixed(2)] }), _jsxs("span", { className: "font-bold", children: [" ", decimalToOdds(totalDecimalOdds) > 0 && "+", decimalToOdds(totalDecimalOdds).toFixed()] }), _jsxs("span", { children: [" ", tasks.length, " leg(s)"] })] }, "payout"), _jsx("div", { className: "float-right w-fit pb-2 md:w-1/3", children: _jsx("button", { onClick: removeAllLegs, className: "block w-fit md:w-full hover:bg-gray-800 rounded-xl pl-2 pr-2", children: "Clear Slip" }) }, "clear")] }), showSlip && (_jsx("div", { className: "float-left max-h-24 overflow-y-scroll scrollbar-hide w-full flex-col border-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded-sm", children: tasks.map(function (leg) { return (_jsxs("div", { className: "pt-1 mb-1 h-12 w-full border-t-1 border-gray-300", children: [_jsxs("div", { className: "pl-5 float-left w-fit h-full md:w-5/8", children: [_jsxs("span", { className: "block relative text-white text-base ", children: [leg.team, " ", leg.text] }), _jsx("span", { className: "block relative text-gray-400 text-xs ", children: leg.betType })] }), _jsx("div", { className: "float-left w-fit text-right md:w-2/8", children: _jsxs("span", { className: "text-gray-300 pl-2", children: [leg.odds > 0 && "+", leg.odds] }) }), _jsx("div", { className: "float-right w-fit md:w-1/8", children: _jsx("button", { onClick: function () { return removeLeg(leg.frontend_id); }, className: "float-right pr-5", children: _jsx(FontAwesomeIcon, { icon: faXmark }) }) })] }, leg.frontend_id)); }) })), _jsxs("div", { className: "w-full flex row pl-5 pt-1.5 mt-6 dark:bg-gray-700 dark:border-gray-600 border-t-2 text-base", children: [_jsxs("div", { className: "w-fit float-left md:w-1/2", children: ["Wager", " ", _jsx("input", { type: "number", value: wager, max: balance, min: 0, onChange: function (e) { return handleWagerChange(e); }, className: "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none mb-5 bg-gray-800 w-20 dark:bg-gray-800 rounded-sm  border-1 dark:border-white border-white ml-3 pr-2 text-right" }), displayWarning && (_jsx("span", { className: "text-red-500 pl-2", children: "Not Enough Funds To Place Wager" }))] }), isLoggedIn && (_jsx("div", { className: "w-fit overflow-hidden md:w-1/2 md:pr-3", children: _jsx("button", { className: "float-right hover:bg-gray-800 rounded-xl pl-2 pr-2", onClick: submitParlay, children: "LOCK IT IN" }) }))] })] })) }));
}
//# sourceMappingURL=LiveParlayViewer.js.map