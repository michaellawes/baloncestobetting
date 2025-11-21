import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import { NotificationProps } from "../../utils/Interfaces";
import { getNotificationStyling } from "../../utils/Util";

export function Notification(props: NotificationProps) {
  const { notification, setNotification } = props;

  useEffect(() => {
    if (notification.show) {
      const delay = notification.type === "LIMIT" ? 750 : 1500;
      const timeId = setTimeout(() => {
        // After 3 seconds set the show value to false
        setNotification({ show: false, legs: 0, message: "", type: "INITIAL" });
      }, delay);

      return () => {
        clearTimeout(timeId);
      };
    }
  }, [notification]);

  // If show is false the component will return null and stop here
  if (!notification.show) {
    return null;
  }

  return (
    <div
      id="notification"
      className="w-full flex flex-row justify-center items-center duration-300 transition-opacity"
    >
      <div role="alert" className={getNotificationStyling(notification.type)}>
        <div className="flex w-4/5 flex-row font-bold items-center text-start justify-start">
          {notification.legs > 0 ? (
            <span className="text-sm md:text-base ">
              {notification.legs} leg parlay saved
            </span>
          ) : (
            <span className="text-sm md:text-base ">
              {notification.message}
            </span>
          )}
        </div>
        <div className="flex text-sm md:text-base w-1/5 justify-end">
          {notification.type === "SUBMIT" && (
            <FontAwesomeIcon
              icon={faCheck as IconProp}
              className="text-green-500 "
            />
          )}
          {notification.type === "LIMIT" && (
            <FontAwesomeIcon
              icon={faXmark as IconProp}
              className="text-red-500 "
            />
          )}
          {notification.type === "CLIPBOARD" && (
            <FontAwesomeIcon
              icon={faClipboard as IconProp}
              className="text-blue-500 "
            />
          )}
        </div>
      </div>
    </div>
  );
}
