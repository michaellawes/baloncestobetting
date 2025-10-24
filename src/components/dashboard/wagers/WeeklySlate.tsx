import { Matchup, MatchupProps } from './Matchup';

export interface WeeklySlateProps {
    matchups: MatchupProps[],
}
export function WeeklySlate(props: WeeklySlateProps) {
    return (
        <div className="weekly-slate">
            <div className="weekly-slate-matchup-wrapper">
                {props.matchups.map((matchup, index) => (
                    <div key={index} className="weekly-slate-matchup">
                        <Matchup {...matchup} />
                    </div>
                ))}
            </div>
        </div>
    )
}