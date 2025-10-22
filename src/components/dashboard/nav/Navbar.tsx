import { type AuthProps, Auth } from "./Auth";
import { type SettingsProps, Settings } from "./Settings";

export interface NavbarProps {
    title: string,
    auth: AuthProps,
    settings: SettingsProps
    balance: number;
}

export function Navbar(props: NavbarProps) {
    const { title, auth, settings, balance } = props;
    return (
        <div className="navbar-wrapper">
            <div className="title">
                {title}
            </div>
            <div className="balance">
                {balance}
            </div>
            <div className="auth">
                <Auth
                    icon={auth.icon}
                />
            </div>
            <div className="settings">
                <Settings
                    icon={settings.icon}
                    isLoggedIn={settings.isLoggedIn}
                />
            </div>
        </div>
    )
}
