import { NotificationMetadata } from "../../App";
export interface NotificationProps {
    notification: NotificationMetadata;
    setNotification: React.Dispatch<React.SetStateAction<NotificationMetadata>>;
}
export declare function Notification(props: NotificationProps): import("react/jsx-runtime").JSX.Element;
