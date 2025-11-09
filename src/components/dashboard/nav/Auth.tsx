import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

export function Auth() {
  return (
    <div className="">
      <FontAwesomeIcon icon="fa-solid fa-user" />
    </div>
  );
}
