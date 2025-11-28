import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFaceDizzy, fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas);
export function ErrorLander(props) {
    return (_jsxs("div", { className: "flex flex-col w-full h-screen justify-center", children: [_jsx("div", { className: "block text-4xl w-full text-white text-center mb-2", children: _jsx(FontAwesomeIcon, { icon: faFaceDizzy, className: "fa-spin" }) }), _jsx("div", { className: "flex w-full justify-center", children: _jsx("span", { className: "text-white text-base", children: props.message }) })] }));
}
//# sourceMappingURL=ErrorLander.js.map