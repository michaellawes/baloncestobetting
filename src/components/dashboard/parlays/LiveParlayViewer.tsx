import { PropLineInterface } from "../wagers/PropLine";
import {useEffect} from "react";
import * as React from "react";

export interface LiveParlayViewerProps {
    legs: PropLineInterface[]
    setLegs: React.Dispatch<React.SetStateAction<PropLineInterface[]>>
}

export function LiveParlayViewer(props: LiveParlayViewerProps) {
    const [isViewable, setIsViewable] = React.useState<boolean>(false)
    const [liveLegs, setLiveLegs] = React.useState<PropLineInterface[]>(props.legs)
    const [totalOdds, setTotalOdds] = React.useState<number>(0)

    useEffect(() => {
        if (liveLegs.length === 0) {
            setIsViewable(false)
        } else {
            setIsViewable(true)
        }
    }, [liveLegs])

    useEffect(() => {
        calculateTotalOdds(liveLegs)
    }, [liveLegs]);

    const calculateTotalOdds = (legs: PropLineInterface[]) => {
        const legsAsDecimalOdds = legs.map((leg: PropLineInterface) => {
            if (leg.odds < 0) {
                return ((100 / leg.odds) + 1);
            } else {
                return ((leg.odds / 100) + 1);
            }
        })
        let totalDecimalOdds = 1;
        legsAsDecimalOdds.forEach((a) => { totalDecimalOdds *= a})

        let newOdds
        if (totalDecimalOdds > 2.00) {
            newOdds = (totalDecimalOdds - 1) * 100
        } else {
            newOdds = -100 / (totalDecimalOdds - 1)
        }
        if (totalDecimalOdds == 1) {
            setTotalOdds(0)
        } else {
            setTotalOdds(newOdds)
        }
    }

    const removeAllLegs = () => {
        setLiveLegs([])
    }
    return (
        <div>{/*Only make vieweable when parlay has leg*/}
            {isViewable && (
                <button onClick={() => removeAllLegs()}>
                    Clear All
                </button>
            )}
            <ul>
                {liveLegs.map(leg => (
                    <li>
                        <span>{leg.text}</span>
                        <span>{leg.odds}</span>
                    </li>
                ))}
            </ul>
            {isViewable && (
                <span></span>
            )}
        </div>
    )
}