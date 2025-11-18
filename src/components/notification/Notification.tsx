import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { NotificationMetadata } from "../../App";

export interface NotificationProps {
  notification: NotificationMetadata;
  setNotification: React.Dispatch<React.SetStateAction<NotificationMetadata>>;
}

export function Notification(props: NotificationProps) {
  const { notification, setNotification } = props;
  useEffect(() => {
    if (notification.show) {
      const timeId = setTimeout(() => {
        // After 3 seconds set the show value to false
        setNotification({ show: false, legs: 0 });
      }, 1500);

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
      <div
        role="alert"
        className="h-[16px] flex-row p-5 mt-16 fixed flex w-1/2 justify-center items-center text-center z-100 text-white bg-gray-900 border border-green-500 rounded-sm"
      >
        <div className="flex w-4/5 flex-row text-sm md:text-base font-bold items-center justify-start">
          <span>{notification.legs} leg parlay saved</span>
        </div>
        <div className="flex text-sm md:text-base w-1/5 justify-end">
          <FontAwesomeIcon
            icon={faCheck as IconProp}
            className="text-green-500 "
          />
        </div>
      </div>
    </div>
  );
}
