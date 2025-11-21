import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import { getNotificationStyling } from "../../utils/Util";
export function Notification(props) {
    var notification = props.notification, setNotification = props.setNotification;
    useEffect(function () {
        if (notification.show) {
            var delay = notification.type === "LIMIT" ? 750 : 1500;
            var timeId_1 = setTimeout(function () {
                // After 3 seconds set the show value to false
                setNotification({ show: false, legs: 0, message: "", type: "INITIAL" });
            }, delay);
            return function () {
                clearTimeout(timeId_1);
            };
        }
    }, [notification]);
    // If show is false the component will return null and stop here
    if (!notification.show) {
        return null;
    }
    return (_jsx("div", { id: "notification", className: "w-full flex flex-row justify-center items-center duration-300 transition-opacity", children: _jsxs("div", { role: "alert", className: getNotificationStyling(notification.type), children: [_jsx("div", { className: "flex w-4/5 flex-row font-bold items-center text-start justify-start", children: notification.legs > 0 ? (_jsxs("span", { className: "text-sm md:text-base ", children: [notification.legs, " leg parlay saved"] })) : (_jsx("span", { className: "text-sm md:text-base ", children: notification.message })) }), _jsxs("div", { className: "flex text-sm md:text-base w-1/5 justify-end", children: [notification.type === "SUBMIT" && (_jsx(FontAwesomeIcon, { icon: faCheck, className: "text-green-500 " })), notification.type === "LIMIT" && (_jsx(FontAwesomeIcon, { icon: faXmark, className: "text-red-500 " })), notification.type === "CLIPBOARD" && (_jsx(FontAwesomeIcon, { icon: faClipboard, className: "text-blue-500 " }))] })] }) }));
}
//# sourceMappingURL=Notification.js.map