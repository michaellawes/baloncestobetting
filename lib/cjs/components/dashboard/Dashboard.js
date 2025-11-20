import { jsx as _jsx } from "react/jsx-runtime";
import { WeeklySlate } from "./wagers/WeeklySlate";
import { useContext, useEffect } from "react";
import { TasksContext } from "../reducer/TasksContext";
import { Lockout } from "./Lockout";
export function Dashboard(props) {
    var weeklySlate = props.weeklySlate, setIsViewingDashboard = props.setIsViewingDashboard, lockout = props.lockout, setCurrentMatchup = props.setCurrentMatchup;
    var tasks = useContext(TasksContext);
    useEffect(function () {
        setIsViewingDashboard(true);
    }, []);
    return (_jsx("div", { className: tasks.length > 0
            ? "w-full h-screen mb-37 bg-gray-900"
            : "w-full h-screen bg-gray-900", children: lockout ? (_jsx(Lockout, {})) : (_jsx(WeeklySlate, { matchups: weeklySlate, setCurrentMatchup: setCurrentMatchup })) }));
}
//# sourceMappingURL=Dashboard.js.map