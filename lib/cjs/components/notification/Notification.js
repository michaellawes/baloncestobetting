import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
export function Notification(props) {
    var legCount = props.legCount, show = props.show, setShow = props.setShow;
    useEffect(function () {
        var timeId = setTimeout(function () {
            // After 3 seconds set the show value to false
            setShow(false);
        }, 1000);
        return function () {
            clearTimeout(timeId);
        };
    }, []);
    // If show is false the component will return null and stop here
    if (!show) {
        return null;
    }
    return (_jsx("div", { className: "w-full flex flex-row justify-center items-center animate-", children: _jsxs("div", { role: "alert", className: "h-[16px] flex-row p-5 font-bold mt-16 fixed flex w-1/2 justify-center items-center text-center text-base z-100 text-white bg-gray-900 border border-green-500 rounded-sm", children: [_jsx("div", { className: "flex w-4/5 flex-row items-center justify-start", children: _jsxs("span", { children: [legCount, " leg parlay saved"] }) }), _jsx("div", { className: "flex text-base w-1/5 justify-end", children: _jsx(FontAwesomeIcon, { icon: faCheck, className: "text-green-500 " }) })] }) }));
}
//# sourceMappingURL=Notification.js.map