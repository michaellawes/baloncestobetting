import { Matchup, MatchupProps } from "./Matchup";
import * as React from "react";

export interface WeeklySlateProps {
  matchups: MatchupProps[];
}

export function WeeklySlate(props: WeeklySlateProps) {
  const { matchups } = props;
  return (
    <div>
      {matchups.length > 0 && (
        <div className="weekly-slate-matchup-wrapper">
          {matchups.map((matchup, index) => (
            <div key={index} className="weekly-slate-matchup">
              <Matchup {...matchup} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
