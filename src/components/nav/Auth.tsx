import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";

import { fas, faUser } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

export interface AuthProps {
  isLoggedIn: boolean;
  profileImg: string;
}

export function Auth(props: AuthProps) {
  const { isLoggedIn, profileImg } = props;
  return (
    <div className="">
      {isLoggedIn ? (
        <img
          src={profileImg}
          alt="Google Account Profile Picture"
          referrerPolicy="no-referrer"
          className="w-10 h-10 border-transparent border rounded-4xl"
        />
      ) : (
        <FontAwesomeIcon icon={faUser as IconProp} />
      )}
    </div>
  );
}
