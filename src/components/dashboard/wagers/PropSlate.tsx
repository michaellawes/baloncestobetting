import { PropPair, PropPairProps } from "./PropPair";
import { PropLineInterface } from "./PropLine";

export interface PropSlateProps {
    spread: PropPairProps,
    points: PropPairProps,
    moneyline: PropPairProps,
    addLeg: (leg: PropLineInterface, isAdded: boolean) => void,
}
export function PropSlate(props: PropSlateProps) {
    const { spread, points, moneyline } = props;
    return (
        <div className="prop-slate">
            <div className="prop-spread">
                <PropPair {...spread} />
            </div>
            <div className="prop-points">
                <PropPair {...points} />
            </div>
            <div className="prop-moneyline">
                <PropPair {...moneyline} />
            </div>
        </div>
    )
}