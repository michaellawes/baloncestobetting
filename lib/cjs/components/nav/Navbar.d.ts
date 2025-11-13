import * as React from "react";
import { UserData } from "../../App";
interface NavbarProps {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    balance: number;
    setBalance: React.Dispatch<React.SetStateAction<number>>;
    setUser: React.Dispatch<React.SetStateAction<UserData>>;
}
export declare function Navbar(props: NavbarProps): import("react/jsx-runtime").JSX.Element;
export {};
