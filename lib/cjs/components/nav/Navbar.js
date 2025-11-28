import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Auth } from "./Auth";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import * as React from "react";
import { Link } from "react-router-dom";
import { GoogleLogin, googleLogout, } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { getUuid, numberWithCommas } from "../../utils/Util";
export function Navbar(props) {
    var isLoggedIn = props.isLoggedIn, setIsLoggedIn = props.setIsLoggedIn, balance = props.balance, setBalance = props.setBalance, setUser = props.setUser, isViewingDashboard = props.isViewingDashboard, matchup = props.matchup;
    var _a = React.useState(""), profileImg = _a[0], setProfileImg = _a[1];
    var extractUserData = function (credentialReponse) {
        var data = jwtDecode(credentialReponse.credential);
        setProfileImg(data["picture"]);
        setIsLoggedIn(true);
        setUser({
            id: getUuid(data["email"]),
            name: data["name"],
            profile: data["picture"],
        });
    };
    var handleLogout = function () {
        googleLogout();
        setIsLoggedIn(false);
        setUser(null);
        setBalance(0);
    };
    return (_jsxs("nav", { className: "bg-gray-900 text-white w-full fixed z-60 scrollbar-hide border-b-gray-300 border-b-1", children: [_jsxs("div", { className: "flex-row py-4 items-center flex justify-start box-border relative", children: [_jsx("div", { className: "flex flex-row grow justify-start w-5/8 md:w-18/20", children: _jsxs(Link, { className: "px-4 justify-start text-start text-white flex-1 flex-row font-bold", to: "/", children: [_jsx("span", { className: "", children: "CnB Baloncesto Betting" }), _jsxs("span", { className: "text-xs md:text-sm text-gray-400 pl-1", children: ["Week ", matchup >= 0 ? matchup : ""] })] }) }), _jsx("div", { className: "flex flex-row grow justify-end w-2/8 md:w-1/20", children: _jsxs("span", { className: "px-3 flex font-[ProximaNova-Bold, serif]", children: ["$", numberWithCommas(parseFloat(balance.toFixed(2)))] }) }), _jsxs(Menu, { as: "div", className: "flex justify-center grow px-2 md:justify-end relative w-1/8", children: [_jsx(MenuButton, { className: "cursor-pointer inline-flex rounded-md hover:bg-gray-800 focus:outline-none text-base py-2 px-2 focus-visible:ring-1 focus-visible:ring-gray-800", children: _jsx(Auth, { isLoggedIn: isLoggedIn, profileImg: profileImg }) }), _jsx(MenuItems, { transition: true, className: "absolute right-0 mr-2 z-65 mt-12 w-46 origin-top-right rounded-md bg-gray-900 outline-1 outline-gray-400 -outline-offset-1  transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in", children: _jsxs("div", { className: "", children: [isLoggedIn && (_jsxs("div", { children: [_jsx(MenuItem, { children: _jsx(Link, { className: "block px-4 py-2 text-sm text-end text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden", to: "/", children: "Return to Dashboard" }) }), _jsx(MenuItem, { children: _jsx(Link, { className: "block px-4 py-2 text-sm text-end text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden", to: "/parlays", children: "View Parlays" }) }), _jsx(MenuItem, { children: _jsx("a", { href: "#", className: "block px-4 py-2 text-sm text-end text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden", onClick: handleLogout, children: "Log Out" }) })] })), !isLoggedIn && (_jsxs("form", { action: "#", method: "POST", children: [_jsx(MenuItem, { children: _jsx("button", { type: "submit", className: "block w-full mr-4 bg-transparent", children: _jsx(GoogleLogin, { onSuccess: function (credentialResponse) {
                                                                extractUserData(credentialResponse);
                                                            }, onError: function () { return console.log("Login failed"); }, auto_select: true }) }) }), !isViewingDashboard && (_jsx(MenuItem, { children: _jsx(Link, { className: "block px-4 py-2 text-sm text-end text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden", to: "/", children: "Return to Dashboard" }) }))] }))] }) })] })] }), _jsx("div", { className: isViewingDashboard
                    ? "h-9.5 box-border w-full overflow-hidden z-60 mb-2.5 fixed"
                    : "h-9.5 box-border w-full overflow-hidden z-60 mb-2.5 fixed hidden", children: _jsx("div", { className: "shadow-none overflow-hidden rounded-b-xs list-none", children: _jsxs("div", { className: "h-9.5 border-b-gray-600 bg-gray-700 border-solid border-b flex-row items-stretch flex justify-start box-border relative", children: [_jsx("div", { className: "w-1/2 h-9.5 basis-0 grow items-center justify-between flex box-border relative pl-4", children: _jsx("h3", { className: "text-ellipsis text-xs text-gray-300 box-border overflow-hidden relative m-0 p-0 font-inherit", children: "FANTASY BASKETBALL" }) }), _jsx("div", { className: "w-1/2 items-stretch justify-start flex-col flex box-border relative list-none", children: _jsxs("div", { className: "grow items-center justify-start flex-row flex box-border relative list-none", children: [_jsx("div", { className: "w-1/3 basis-0 grow justify-center items-center flex-row flex box-border relative", children: _jsx("span", { className: "font-[Proxima Nova Condensed, serif] tracking-[1px] uppercase text-gray-300 text-xs text-center box-border relative", children: "spread" }) }), _jsx("div", { className: "w-1/3 basis-0 grow justify-center items-center flex-row flex box-border relative", children: _jsx("span", { className: "font-[Proxima Nova Condensed, serif] tracking-[1px] uppercase text-gray-300 text-xs text-center box-border relative", children: "totals" }) }), _jsx("div", { className: "w-1/3 basis-0 grow justify-center items-center flex-row flex box-border relative", children: _jsx("span", { className: "font-[Proxima Nova Condensed, serif] tracking-[1px] uppercase text-gray-300 text-xs text-center box-border relative", children: "money" }) })] }) })] }) }) })] }));
}
//# sourceMappingURL=Navbar.js.map