import { jsx as _jsx } from "react/jsx-runtime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas, faUser } from "@fortawesome/free-solid-svg-icons";
library.add(fas);
export function Auth(props) {
    var isLoggedIn = props.isLoggedIn, profileImg = props.profileImg;
    return (_jsx("div", { className: "flex justify-end flex-col", children: isLoggedIn ? (_jsx("img", { src: profileImg, alt: "Google Account Profile Picture", referrerPolicy: "no-referrer", className: "md:w-8 md:h-8 h-6 w-6 border-transparent border rounded-4xl" })) : (_jsx("div", { className: "md:w-8 md:h-8 h-6 w-6 flex flex-col justify-center items-center", children: _jsx(FontAwesomeIcon, { icon: faUser }) })) }));
}
//# sourceMappingURL=Auth.js.map