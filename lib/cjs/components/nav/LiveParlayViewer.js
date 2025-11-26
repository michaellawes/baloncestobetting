import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { useContext, useEffect } from "react";
import { TasksContext, TasksDispatchContext } from "../reducer/TasksContext";
import { decimalToOdds, getParlayTypeAbbreviated, getPayoutWithRespectToScreenWidth, getPropTextWithRespectToScreenSize, oddsToDecimal, } from "../../utils/Util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, fas, } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
library.add(fas);
export function LiveParlayViewer(props) {
    var balance = props.balance, setBalance = props.setBalance, isLoggedIn = props.isLoggedIn;
    var _a = React.useState(0), totalOdds = _a[0], setTotalOdds = _a[1];
    var _b = React.useState(0), payout = _b[0], setPayout = _b[1];
    var _c = React.useState(10), wager = _c[0], setWager = _c[1];
    var _d = React.useState(false), showSlip = _d[0], setShowSlip = _d[1];
    var _e = React.useState(""), displayWarning = _e[0], setDisplayWarning = _e[1];
    var _f = React.useState(true), shouldDisplay = _f[0], setShouldDisplay = _f[1];
    var _g = React.useState(false), hasOpenedOnce = _g[0], setHasOpenedOnce = _g[1];
    var tasks = useContext(TasksContext);
    var dispatch = useContext(TasksDispatchContext);
    var getStyling = function (showSlip) {
        if (showSlip) {
            if (tasks.length == 1) {
                return ("bottom-29" +
                    " fixed pt-2 mb-3 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all");
            }
            else if (tasks.length == 2) {
                return ("bottom-53" +
                    " fixed pt-2 mb-3 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all");
            }
            else if (tasks.length == 3) {
                return ("bottom-65" +
                    " fixed pt-2 mb-3 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all");
            }
            else if (tasks.length == 4) {
                return ("bottom-77" +
                    " fixed pt-2 mb-3 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all");
            }
            else if (tasks.length == 5) {
                return ("bottom-88" +
                    " fixed pt-2 mb-3 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all");
            }
            else {
                return ("bottom-83" +
                    " fixed pt-2 mb-8 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all");
            }
        }
        else {
            if (hasOpenedOnce) {
                return "bottom-4 mb-16 fixed pt-2 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all";
            }
            else {
                return "bottom-4 fixed pt-2 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all";
            }
        }
    };
    var handleWagerChange = function (event) {
        var value = Number(event.target.value);
        if (value > balance) {
            event.target.style.borderColor = "red";
            setDisplayWarning("Insufficient balance");
        }
        else if (value < 0) {
            event.target.style.borderColor = "red";
            setDisplayWarning("Min wager $0.01");
        }
        else {
            setShouldDisplay(false);
            event.target.style.borderColor = "";
            setWager(value);
            setDisplayWarning("");
        }
    };
    var removeAllLegs = function () {
        dispatch({ type: "clearSlip" });
    };
    var removeLeg = function (id) {
        dispatch({ type: "removeLeg", frontend_id: id });
    };
    var submitParlay = function () {
        if (wager <= balance) {
            setBalance(balance - wager);
            dispatch({
                type: "submitParlay",
                totalOdds: decimalToOdds(totalOdds),
                wager: wager,
                payout: payout,
            });
        }
    };
    var toggleSlideOver = function () {
        document
            .getElementById("slideover-container")
            .classList.toggle("invisible");
        document.getElementById("slideover").classList.toggle("translate-y-full");
    };
    var toggleSlip = function () {
        setHasOpenedOnce(true);
        setShowSlip(!showSlip);
    };
    useEffect(function () {
        var timeout = setInterval(function () {
            setShouldDisplay(true);
        }, 200);
        return function () { return clearInterval(timeout); };
    }, [wager, payout, shouldDisplay]);
    useEffect(function () {
        setPayout(wager * totalOdds);
    }, [totalOdds, wager, shouldDisplay]);
    useEffect(function () {
        if (tasks.length > 0) {
            if (totalOdds === 0) {
                toggleSlideOver();
            }
            setShouldDisplay(false);
            var totalDecimalOdds = tasks.reduce(function (total, task) {
                return (total *= oddsToDecimal(task.odds));
            }, 1);
            setTotalOdds(totalDecimalOdds);
        }
        else {
            if (totalOdds > 0) {
                toggleSlideOver();
                setTotalOdds(0);
                setShowSlip(false);
                setHasOpenedOnce(false);
            }
            setWager(10);
        }
    }, [totalOdds, tasks]);
    return (_jsx("div", { id: "slideover-container", className: "invisible flex absolute w-full z-50", children: _jsxs("div", { id: "slideover", className: getStyling(showSlip), children: [_jsxs("div", { className: "flex flex-row mb-2", children: [_jsx("div", { className: "flex flex-row ml-5 w-5/8", children: _jsxs("div", { className: "text-base flex flex-row w-full font-bold", children: [_jsx("div", { className: "flex flex-row justify-start text-start items-center w-4/8", children: _jsxs("span", { className: "flex", children: [tasks.length, " leg ", getParlayTypeAbbreviated(tasks.length)] }) }), _jsx("div", { className: "flex flex-row justify-center text-center items-center w-4/8", children: _jsx("div", { className: shouldDisplay
                                                ? "flex w-full text-center justify-center items-center box-border transition-opacity ease-linear delay-150"
                                                : "flex w-full text-center justify-center items-center box-border transition-opacity opacity-0 invisible", children: _jsx("span", { className: "font-[Proxima Nova, serif] w-full tracking-[1px] font-light text-gray-300 text-xs relative", children: getPayoutWithRespectToScreenWidth(payout) }) }) })] }) }, "header"), _jsx("div", { className: shouldDisplay
                                ? "flex flex-row w-2/8 text-center justify-end transition-opacity ease-linear delay-150"
                                : "flex flex-row w-2/8 text-center justify-end transition-opacity opacity-0 invisible", children: totalOdds > 0 && (_jsxs("span", { className: "font-bold ", children: [decimalToOdds(totalOdds) > 0 && "+", decimalToOdds(totalOdds).toFixed()] })) }, "payout"), _jsx("div", { className: "flex justify-end flex-row w-1/8", children: _jsx("button", { onClick: toggleSlip, className: "cursor-pointer justify-center text-blue-500 items-center flex grow hover:bg-gray-700 rounded-xl mx-3", children: showSlip ? (_jsx(FontAwesomeIcon, { icon: faChevronDown })) : (_jsx(FontAwesomeIcon, { icon: faChevronUp })) }) }, "view")] }), _jsx("div", { children: showSlip && (_jsxs("div", { className: "max-h-71 overflow-y-scroll scrollbar-hide w-full flex-col bg-gray-800", children: [tasks.map(function (leg) { return (_jsxs("div", { className: "h-12 w-full flex flex-row border-t-1 border-gray-300", children: [_jsx("div", { className: "flex w-1/16 pl-2 justify-center cursor-pointer mt-2 items-center mb-2", children: _jsx("button", { onClick: function () { return removeLeg(leg.frontend_id); }, className: "text-red-500 text-xs w-[18px] h-[18px] cursor-pointer hover:bg-gray-700 rounded-3xl border border-red-500", children: _jsx("div", { className: "flex h-[1px] border-t border-t-red-500 w-[8px] ml-1 mr-1 pr-1" }) }) }), _jsxs("div", { className: "flex justify-start mt-1 ml-2 flex-col h-full w-13/16", children: [_jsx("span", { className: "flex relative text-white text-sm", children: getPropTextWithRespectToScreenSize(leg, window.innerWidth) }), _jsx("span", { className: "flex relative text-gray-400 text-xs", children: leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] })] }), _jsx("div", { className: "flex justify-end items-center text-right w-1/16", children: _jsxs("span", { className: "text-gray-300 pl-2", children: [leg.odds > 0 && "+", leg.odds] }) })] }, leg.frontend_id)); }), tasks.length > 1 && (_jsx("div", { className: "h-12 w-full flex justify-center flex-row border-t-1 border-gray-300", children: _jsxs("button", { onClick: removeAllLegs, className: "cursor-pointer justify-center flex flex-row grow hover:bg-gray-700 items-center px-2", children: [_jsx("div", { className: "flex text-red-500 mr-2", children: _jsx(FontAwesomeIcon, { icon: faTrashCan }) }), _jsx("div", { className: "flex", children: _jsx("span", { className: "text-red-500 font-light text-sm", children: "Remove all selections" }) })] }) }, "clear"))] })) }), _jsxs("div", { className: "w-full flex row pl-5 bg-gray-800 pt-[2px] border-t-1 text-base", children: [_jsxs("div", { className: "flex w-3/4 md:w-1/2 mb-3 mt-1", children: ["Wager", " ", _jsx("input", { type: "number", value: wager, max: balance, min: 0, onChange: function (e) { return handleWagerChange(e); }, className: "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none focus:outline-none bg-gray-800 w-20 mt-1 h-5 dark:bg-gray-800 rounded-sm  border-1 border-gray-700 ml-3 pr-2 text-right" }), displayWarning.length > 0 && (_jsx("div", { className: "ml-2 flex justify-center  border border-transparent items-center textwhite mt-1", children: _jsx("span", { className: "bg-red-500 font-bold rounded-2xl pl-2 pr-2 text-sm", children: displayWarning }) }))] }), isLoggedIn && balance > 0 && wager > 0.01 && (_jsx("div", { className: "overflow-hidden w-1/4 md:w-1/2 pr-2 ml-2 mr-2", children: _jsx("button", { className: "cursor-pointer float-right hover:bg-gray-700 rounded-xl pl-4 pr-4 mt-1", onClick: submitParlay, children: "Submit" }) }))] })] }) }));
}
//# sourceMappingURL=LiveParlayViewer.js.map