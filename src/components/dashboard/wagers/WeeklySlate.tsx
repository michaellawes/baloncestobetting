import { Matchup, MatchupProps } from './Matchup';
import * as React from "react";
import { PropLineInterface } from "./PropLine";

export interface WeeklySlateProps {
    matchups: MatchupProps[],
}
export function WeeklySlate(props: WeeklySlateProps) {
    const [legs, setLegs] = React.useState<PropLineInterface[]>([])

    const addLeg = (leg: PropLineInterface, isAdded: boolean) => {
        if (!isAdded) {
            setLegs( // Replace the state
                [ // with a new array
                    ...legs, // that contains all the old items
                    leg // and one new item at the end
                ]
            );
        } else {
            const index = legs.findIndex(addedLegs => addedLegs === leg)
            const adjustedSlip = legs.splice(index, 1);
            setLegs(adjustedSlip)
        }
    }
    return (
        <div className="weekly-slate">
            <div className="weekly-slate-matchup-wrapper">
                {props.matchups.map((matchup, index) => (
                    <div key={index} className="weekly-slate-matchup">
                        <Matchup
                            favorite={matchup.favorite}
                            road={matchup.road}
                            slate={matchup.slate}
                            addLeg={addLeg}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}