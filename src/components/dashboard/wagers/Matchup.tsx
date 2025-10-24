// @ts-expect-error TS 5.0+ is broken
import { Team, TeamProps } from "./Team.tsx";
// @ts-expect-error TS 5.0+ is broken
import { PropSlate, PropSlateProps } from "./PropSlate.tsx";

export interface MatchupProps {
    favorite: TeamProps,
    road: TeamProps,
    slate: PropSlateProps
}

export function Matchup(props: MatchupProps) {
    const { favorite, road, slate } = props

    return (
        <div className="matchup">
            <div className="matchup-teams">
                <div className="matchup-road-team">
                    <Team {...road} />
                </div>
                <div className="matchup-favorite-team">
                    <Team {...favorite} />
                </div>
            </div>
            <div className="matchup-slate">
                <PropSlate {...slate} />
            </div>
        </div>
    )
}