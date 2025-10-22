import { Matchup, MatchupProps } from './Matchup';

interface WeeklySlateProps {
    matchups: MatchupProps[],
}
export function WeeklySlate(props: WeeklySlateProps) {
    return (
        <div className="weekly-slate">
            <div className="weekly-slate-matchup-wrapper">
                {props.matchups.map((matchup, index) => (
                    <div key={index} className="weekly-slate-matchup">
                        <Matchup
                            favorite={matchup.favorite}
                            road={matchup.road}
                            slate={matchup.slate}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}