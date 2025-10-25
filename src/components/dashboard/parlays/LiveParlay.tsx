import { PropLineProps } from "../wagers/PropLine";
import * as React from "react";
import { ParlayProps, Parlay } from "./Parlay";
import { randomUUID } from "node:crypto";
import {useEffect} from "react";

export interface LiveParlayProps {
    wager: number,
    legs: PropLineProps[],
    submitParlay: (props: ParlayProps) => typeof Parlay,
}
export function LiveParlay(props: LiveParlayProps) {
    const { wager, legs, submitParlay } = props;
    const [totalOdds, setTotalOdds] = React.useState<number>(0);
    const [payout, setPayout] = React.useState<number>(0);

    const adjustTotalOdds = (num: number) => {
        let currentTotalOddsAsDecimal;
        if (num < 0) {
            currentTotalOddsAsDecimal = ((100 / totalOdds) + 1);
        } else {
            currentTotalOddsAsDecimal = ((totalOdds / 100) + 1);
        }

        let newDecimalOdds;
        if (num < 0) {
            newDecimalOdds = ((100 / num) + 1) * currentTotalOddsAsDecimal;
        } else {
            newDecimalOdds = ((num / 100) + 1) * currentTotalOddsAsDecimal;
        }

        let newOdds
        if (newDecimalOdds > 2.00) {
            newOdds = (newDecimalOdds - 1) * 100
        } else {
            newOdds = -100 / (newDecimalOdds - 1)
        }
        setTotalOdds(newOdds)
    }

    useEffect(() => {
        adjustTotalOdds(legs[legs.length - 1].odds);
    }, [adjustTotalOdds, legs])

    useEffect(() => {
        let currentTotalOddsAsDecimal;
        if (totalOdds < 0) {
            currentTotalOddsAsDecimal = ((100 / totalOdds) + 1);
        } else {
            currentTotalOddsAsDecimal = ((totalOdds / 100) + 1);
        }
        setPayout(wager * currentTotalOddsAsDecimal);
    }, [totalOdds, wager])

    return (
        <div>
            <div>
                <span>Current Slip:  {totalOdds}</span>
            </div>
            <div>
                <ul>
                    {legs.map(leg => (
                        <li>
                            <span>{leg.text}</span>
                            <span>{leg.odds}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <span>${wager} to ${payout}</span>
                <button onClick={() => {
                    submitParlay({
                        id: randomUUID(),
                        timestamp: Date.now(),
                        legs: legs,
                        totalOdds: totalOdds,
                        payout: payout,
                        wager: wager,
                        isActive: false,
                        isWinner: false,
                        isPayedOut: false
                    })
                }}></button>
            </div>
        </div>
    )
}