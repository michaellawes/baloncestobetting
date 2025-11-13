import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useContext, useEffect } from "react";
// @ts-ignore
import { TasksContext, TasksDispatchContext } from "../../reducer/TasksContext";
export function PropLine(props) {
    var text = props.text, odds = props.odds, frontend_id = props.frontend_id, oppId = props.oppId, team = props.team, betType = props.betType;
    var tasks = useContext(TasksContext);
    var dispatch = useContext(TasksDispatchContext);
    var _a = React.useState(false), isAdded = _a[0], setIsAdded = _a[1];
    var selectParlay = function () {
        var type = !isAdded ? "addLeg" : "removeLeg";
        var action = {
            type: type,
            frontend_id: frontend_id,
            text: text,
            odds: odds,
            team: team,
            betType: betType,
            oppId: oppId,
        };
        // @ts-ignore
        dispatch(action);
    };
    useEffect(function () {
        var index = tasks.findIndex(function (addedLegs) { return addedLegs.frontend_id === frontend_id; });
        setIsAdded(index !== -1);
    }, [tasks, frontend_id]);
    return (_jsx("div", { className: "switch ".concat(isAdded
            ? "h-full w-full basis-0 grow border-blue-500 border border-solid justify-center items-center bg-blue-500 rounded-xs flex-col flex box-border overflow-hidden relative cursor-pointer"
            : "hover:bg-gray-600 h-full w-full basis-0 grow border-blue-500 border border-solid justify-center items-center bg-transparent rounded-xs flex-col flex box-border overflow-hidden relative cursor-pointer"), children: text.length > 0 ? (_jsxs("button", { onClick: function () { return selectParlay(); }, className: "switch ".concat(isAdded
                ? "h-full w-full basis-0 grow bg-blue-500 justify-center items-center rounded-xs flex-col flex box-border overflow-hidden relative cursor-pointer"
                : "hover:bg-gray-800 h-full w-full basis-0 grow justify-center items-center bg-transparent rounded-xs flex-col flex box-border overflow-hidden relative cursor-pointer"), children: [_jsx("span", { className: "switch ".concat(isAdded
                        ? "leading-none opacity-[1] text-xs font-[ProximaNova-Bold, serif] text-gray-300 font-bold"
                        : "leading-none opacity-[1] text-xs font-[ProximaNova-Bold, serif] text-gray-300"), children: text }), _jsxs("span", { className: "switch ".concat(isAdded
                        ? "leading-none tracking-[.5px] opacity-[1] text-xs font-[ProximaNova-Bold, serif] text-gray-300 font-bold"
                        : "leading-none tracking-[.5px] opacity-[1] text-xs font-[ProximaNova-Bold, serif] text-blue-500"), children: [odds > 0 && "+", odds] })] })) : (_jsx("button", { onClick: function () { return selectParlay(); }, className: "switch ".concat(isAdded
                ? 'cursor-pointer h-full w-full mr-1 ml-1 bg-blue-500 basis-0 grow justify-center items-center flex-col flex box-border overflow-hidden rounded-sm relative"'
                : "hover:bg-gray-800 cursor-pointer h-full w-full mr-1 ml-1 bg-transparent basis-0 grow border border-solid justify-center items-center flex-col flex box-border overflow-hidden rounded-sm relative"), children: _jsxs("span", { className: "switch ".concat(isAdded
                    ? "tracking-[.5px] leading-none opacity-[1] text-gray-300 text-xs font-[ProximaNova-Bold, serif] font-bold"
                    : "tracking-[.5px] leading-none opacity-[1] text-blue-500 text-xs font-[ProximaNova-Bold, serif]"), children: [odds > 0 && "+", odds] }) })) }));
}
//# sourceMappingURL=PropLine.js.map