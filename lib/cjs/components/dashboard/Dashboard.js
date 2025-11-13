import { jsx as _jsx } from "react/jsx-runtime";
import { WeeklySlate } from "./wagers/WeeklySlate";
export function Dashboard(props) {
    return (_jsx("div", { className: "w-full mb-20", children: _jsx(WeeklySlate, { matchups: props.weeklySlate }) }));
}
//# sourceMappingURL=Dashboard.js.map