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
    <div className="flex justify-end">
      {isLoggedIn ? (
        <img
          src={profileImg}
          alt="Google Account Profile Picture"
          referrerPolicy="no-referrer"
          className="md:w-8 md:h-8 h-6 w-6 border-transparent border rounded-4xl"
        />
      ) : (
        <FontAwesomeIcon icon={faUser as IconProp} />
      )}
    </div>
  );
}
