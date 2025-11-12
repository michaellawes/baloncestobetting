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
  const { name, icon, record, color } = props;
  console.log(`name=${name}, color=${color}`);
  return (
    <div className="color">
      {icon.length > 0 &&
      !icon.startsWith("https://mystique") &&
      !icon.startsWith("https://m.media-amazon") ? (
        <div className="flex justify-center">
          <img src={icon} alt="Can't Get Your PFP Buddy" className="w-8 h-8" />
        </div>
      ) : (
        <div className={"text-center text-3xl " + { color }}>
          <FontAwesomeIcon icon="fa-solid fa-basketball" />
        </div>
      )}
      <div className="text-center overflow-hidden">
        <span className="block relative text-white text-base">
          {name}'s team
        </span>
        <span className="block relative text-gray-300 text-sm">{record}</span>
      </div>
    </div>
  );
}
