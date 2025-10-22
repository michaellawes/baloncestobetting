import { PropPair, PropPairProps } from "./PropPair";

export interface PropSlateProps {
    spread: PropPairProps,
    points: PropPairProps,
    moneyline: PropPairProps,
}
export function PropSlate(props: PropSlateProps) {
    const { spread, points, moneyline } = props;
    return (
        <div className="prop-slate">
            <div className="prop-spread">
                <PropPair
                    favorite={spread.favorite}
                    road={spread.road}
                />
            </div>
            <div className="prop-points">
                <PropPair
                    favorite={points.favorite}
                    road={points.road}
                />
            </div>
            <div className="prop-moneyline">
                <PropPair
                    favorite={moneyline.favorite}
                    road={moneyline.road}
                />
            </div>
        </div>
    )
}