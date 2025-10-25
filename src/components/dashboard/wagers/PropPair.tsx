// @ts-expect-error TS 5.0+ is broken
import { PropLine, PropLineProps } from "./PropLine.tsx";

export interface PropPairProps {
    favorite: PropLineProps,
    road: PropLineProps,
    addLeg: (leg: PropLineProps, isAdded: boolean) => void,
}

export function PropPair(props: PropPairProps) {
    const { favorite, road } = props;
    return (
        <div className="prop-pair">
            <div className="prop-line-road">
                <PropLine {...road} />
            </div>
            <div className="prop-line-favorite">
                <PropLine {...favorite} />
            </div>
        </div>
    )
}