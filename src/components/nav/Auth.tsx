import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
import { fas, faUser } from "@fortawesome/free-solid-svg-icons";
import { AuthProps } from "../../utils/Interfaces";

library.add(fas);

export function Auth(props: AuthProps) {
  const { isLoggedIn, profileImg } = props;
  return (
    <div className="flex justify-end flex-col">
      {isLoggedIn ? (
        <img
          src={profileImg}
          alt="Google Account Profile Picture"
          referrerPolicy="no-referrer"
          className="md:w-6 md:h-6 h-6 w-6 border-transparent border rounded-4xl"
        />
      ) : (
        <div className="md:w-6 md:h-6 h-6 w-6 flex flex-col justify-center items-center">
          <FontAwesomeIcon icon={faUser as IconProp} />
        </div>
      )}
    </div>
  );
}
