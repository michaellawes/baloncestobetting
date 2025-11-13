import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Auth } from "./Auth";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { LiveParlayViewer } from "./LiveParlayViewer";
import * as React from "react";
import { Link } from "react-router-dom";
import { GoogleLogin, googleLogout, } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { getUuid } from "../../utils/Util";
export function Navbar(props) {
    var isLoggedIn = props.isLoggedIn, setIsLoggedIn = props.setIsLoggedIn, balance = props.balance, setBalance = props.setBalance, setUser = props.setUser, errorMessage = props.errorMessage;
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
    return (_jsxs("nav", { className: "bg-sky-600 text-white w-full", children: [_jsxs("div", { className: "container flex flex-row mx-auto px-4 md:flex items-center gap-6", children: [_jsx("a", { href: "#", className: "py-5 px-2 text-white flex-1 font-bold", children: "CnB Baloncesto Betting" }), errorMessage.length > 0 && (_jsxs("span", { className: "text-red-600 bg-white rounded-xs pl-2 pr-2", children: ["ERROR: ", errorMessage] })), _jsx("span", { className: "py-2 px-3 block", children: balance }), _jsxs(Menu, { as: "div", className: "relative inline-block", children: [_jsx(MenuButton, { className: "inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring-1 inset-ring-white/5 hover:bg-white/20", children: _jsx(Auth, { isLoggedIn: isLoggedIn, profileImg: profileImg }) }), _jsx(MenuItems, { transition: true, className: "absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-800 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in", children: _jsxs("div", { className: "py-1", children: [isLoggedIn && (_jsx(MenuItem, { children: _jsx("a", { href: "#", className: "block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden", children: _jsx(Link, { to: "/", children: "Return to Dashboard" }) }) })), isLoggedIn && (_jsx(MenuItem, { children: _jsx("a", { href: "#", className: "block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden", children: _jsx(Link, { to: "/parlays", children: "View Parlays" }) }) })), isLoggedIn && (_jsx(MenuItem, { children: _jsx("a", { href: "#", className: "block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden", onClick: handleLogout, children: "Log Out" }) })), !isLoggedIn && (_jsx("form", { action: "#", method: "POST", children: _jsx(MenuItem, { children: _jsx("button", { type: "submit", className: "block w-full px-4 py-2 text-left text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden", children: _jsx(GoogleLogin, { onSuccess: function (credentialResponse) {
                                                            extractUserData(credentialResponse);
                                                        }, onError: function () { return console.log("Login failed"); }, auto_select: true }) }) }) }))] }) })] })] }), _jsx("div", { children: _jsx(LiveParlayViewer, { balance: balance, setBalance: setBalance, isLoggedIn: isLoggedIn }) })] }));
}
//# sourceMappingURL=Navbar.js.map