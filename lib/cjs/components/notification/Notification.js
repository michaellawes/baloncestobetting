import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
export function Notification(props) {
    var notification = props.notification, setNotification = props.setNotification;
    useEffect(function () {
        if (notification.show) {
            var timeId_1 = setTimeout(function () {
                // After 3 seconds set the show value to false
                setNotification({ show: false, legs: 0 });
            }, 1500);
            return function () {
                clearTimeout(timeId_1);
            };
        }
    }, [notification]);
    // If show is false the component will return null and stop here
    if (!notification.show) {
        return null;
    }
    return (_jsx("div", { id: "notification", className: "w-full flex flex-row justify-center items-center duration-300 transition-opacity", children: _jsxs("div", { role: "alert", className: "h-[16px] flex-row p-5 mt-16 fixed flex w-1/2 justify-center items-center text-center z-100 text-white bg-gray-900 border border-green-500 rounded-sm", children: [_jsx("div", { className: "flex w-4/5 flex-row text-sm md:text-base font-bold items-center justify-start", children: _jsxs("span", { children: [notification.legs, " leg parlay saved"] }) }), _jsx("div", { className: "flex text-sm md:text-base w-1/5 justify-end", children: _jsx(FontAwesomeIcon, { icon: faCheck, className: "text-green-500 " }) })] }) }));
}
//# sourceMappingURL=Notification.js.map