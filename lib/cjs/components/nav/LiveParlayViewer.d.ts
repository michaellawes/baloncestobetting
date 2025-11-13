import * as React from "react";
export interface LiveParlayViewerProps {
    balance: number;
    setBalance: React.Dispatch<React.SetStateAction<number>>;
    isLoggedIn: boolean;
}
export declare function LiveParlayViewer(props: LiveParlayViewerProps): import("react/jsx-runtime").JSX.Element;
