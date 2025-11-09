import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);
export interface TeamProps {
  name: string;
  icon: string;
  record: string;
  color: string;
}

export function Team(props: TeamProps) {
  const iconColor: string = props.color;
  return (
    <div className="color">
      <div className={"text-center text-3xl " + iconColor}>
        <FontAwesomeIcon icon="fa-solid fa-basketball" />
      </div>
      <div className="text-center overflow-hidden">
        <span className="block relative text-white text-base">
          {props.name}
        </span>
        <span className="block relative text-gray-300 text-sm">
          {props.record}
        </span>
      </div>
    </div>
  );
}
