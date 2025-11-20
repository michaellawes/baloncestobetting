import * as React from "react";
import { MatchupSchema } from "../../../utils/Util";
export interface WeeklySlateProps {
    matchups: MatchupSchema[];
    setCurrentMatchup: React.Dispatch<React.SetStateAction<MatchupSchema>>;
}
export declare function WeeklySlate(props: WeeklySlateProps): import("react/jsx-runtime").JSX.Element;
