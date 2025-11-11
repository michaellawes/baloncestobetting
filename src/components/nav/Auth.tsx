import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { fas } from "@fortawesome/free-solid-svg-icons";

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
          className="w-8 h-8"
        />
      ) : (
        <FontAwesomeIcon icon="fa-solid fa-user" />
      )}
    </div>
  );
}
