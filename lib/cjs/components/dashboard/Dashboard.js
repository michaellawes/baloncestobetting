import { jsx as _jsx } from "react/jsx-runtime";
import { WeeklySlate } from "./wagers/WeeklySlate";
import { useContext } from "react";
import { TasksContext } from "../reducer/TasksContext";
export function Dashboard(props) {
    var tasks = useContext(TasksContext);
    return (_jsx("div", { className: tasks.length > 0 ? "w-full mb-16" : "w-full", children: _jsx(WeeklySlate, { matchups: props.weeklySlate }) }));
}
//# sourceMappingURL=Dashboard.js.map