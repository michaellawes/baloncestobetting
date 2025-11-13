import * as React from "react";
import { ParlayFieldUpdate, UserData } from "../../App";
export interface ParlaysViewerProps {
    setBalance: React.Dispatch<React.SetStateAction<number>>;
    user: UserData;
    setParlayFieldUpdate: React.Dispatch<React.SetStateAction<ParlayFieldUpdate>>;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}
export declare function Parlays(props: ParlaysViewerProps): import("react/jsx-runtime").JSX.Element;
