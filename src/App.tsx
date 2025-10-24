import { Dashboard } from "./components/dashboard/Dashboard";
import './App.css'
import { NavbarProps } from "./components/dashboard/nav/Navbar";
import {WeeklySlateProps} from "./components/dashboard/wagers/WeeklySlate";

export function App() {

    const navbar: NavbarProps = {
        title: "CnB Baloncesto Betting",
        isLoggedIn: true,
        balance: 0
    };

    const weeklySlate: WeeklySlateProps = {
        matchups: []
    }

    return (
        <Dashboard
            navbar={navbar}
            weeklySlate={weeklySlate}
        />
    )
}

export default App
