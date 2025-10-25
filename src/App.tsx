import { Dashboard } from "./components/dashboard/Dashboard";
import './App.css'
import { Navbar } from "./components/dashboard/nav/Navbar";
import { Parlays } from "./components/dashboard/parlays/Parlays";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import { PropLineInterface } from "./components/dashboard/wagers/PropLine";
import { WeeklySlateProps } from "./components/dashboard/wagers/WeeklySlate";
import * as React from "react";


export function App() {
    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
    const [balance, setBalance] = React.useState<number>(0);
    const [weeklySlate, setWeeklySlate] = React.useState<WeeklySlateProps>(null);
    const [legs, setLegs] = React.useState<PropLineInterface[]>([]);
    return (
        <Router>
            <Navbar
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                balance={balance}
                setBalance={setBalance}
                legs={legs}
                setLegs={setLegs}
            />
            <Routes>
                <Route path="/" element={<Dashboard
                    weeklySlate={weeklySlate}
                    legs={legs}
                    setLegs={setLegs}
                />} />
                <Route path="/parlays" element={<Parlays/>} />
            </Routes>
        </Router>
    )
/*
    const navbar: NavbarProps = {
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
    )*/
}

export default App
