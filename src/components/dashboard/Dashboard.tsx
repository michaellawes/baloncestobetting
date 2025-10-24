import { Navbar, NavbarProps } from "./nav/Navbar";
import { WeeklySlateProps, WeeklySlate } from "./wagers/WeeklySlate";

export interface DashboardProps {
    navbar: NavbarProps,
    weeklySlate: WeeklySlateProps
}

export function Dashboard(props: DashboardProps) {
    const { navbar, weeklySlate } = props;
    return (
        <div className="w-full">
            <Navbar {...navbar} />
            <WeeklySlate {...weeklySlate} />
        </div>
    )
}