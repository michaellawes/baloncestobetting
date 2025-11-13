import { jsx as _jsx } from "react/jsx-runtime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas, faUser } from "@fortawesome/free-solid-svg-icons";
library.add(fas);
export function Auth(props) {
    var isLoggedIn = props.isLoggedIn, profileImg = props.profileImg;
    return (_jsx("div", { className: "", children: isLoggedIn ? (_jsx("img", { src: profileImg, alt: "Google Account Profile Picture", referrerPolicy: "no-referrer", className: "w-8 h-8" })) : (_jsx(FontAwesomeIcon, { icon: faUser })) }));
}
//# sourceMappingURL=Auth.js.map