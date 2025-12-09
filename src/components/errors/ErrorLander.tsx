import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
import { faFaceDizzy, fas } from "@fortawesome/free-solid-svg-icons";
import { ErrorLanderProps } from "../../utils/Interfaces";

library.add(fas);

export function ErrorLander(props: ErrorLanderProps) {
  return (
    <div
      className={
        window.innerWidth < 469
          ? "flex flex-col w-full h-[500px] justify-center"
          : "flex flex-col w-full h-screen justify-center"
      }
    >
      <div className="block text-4xl w-full text-white text-center mb-2">
        <FontAwesomeIcon icon={faFaceDizzy as IconProp} className="fa-spin" />
      </div>
      <div className="flex w-full justify-center">
        <span className="text-white text-base">{props.message}</span>
      </div>
    </div>
  );
}
