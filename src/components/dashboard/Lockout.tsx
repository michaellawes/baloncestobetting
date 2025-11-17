import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
import { fas, faSpinner } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

export function Lockout() {
  return (
    <div className="flex flex-col w-full h-screen justify-center">
      <div className="block text-4xl w-full text-white text-center mb-2">
        <FontAwesomeIcon icon={faSpinner as IconProp} className="fa-spin" />
      </div>
      <div className="flex w-full justify-center">
        <span className="text-white text-base">
          Please wait while we process last week's results...
        </span>
      </div>
    </div>
  );
}
