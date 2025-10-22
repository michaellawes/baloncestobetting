import { VisitorSettings } from "./VisitorSettings";
import { UserSettings } from "./UserSettings";

export interface SettingsProps {
    icon: string;
    isLoggedIn: boolean;
}

export function Settings(props: SettingsProps) {
    const { icon, isLoggedIn } = props;
    return (
        <div className="settings-wrapper">
            <div className="settings-icon">
                {icon}
            </div>
            <div className="settings-content">
                {isLoggedIn ?
                    (<UserSettings/>) :
                    (<VisitorSettings/>)}
            </div>
        </div>
    )
}