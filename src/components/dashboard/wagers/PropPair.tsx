// @ts-expect-error TS 5.0+ is broken
import { PropLine, PropLineProps } from "./PropLine.tsx";

export interface PropPairProps {
    favorite: PropLineProps,
    road: PropLineProps
}

export function PropPair(props: PropPairProps) {
    const { favorite, road } = props;
    return (
        <div className="prop-pair">
            <div className="prop-line-road">
                <PropLine
                    text={road.text}
                    odds={road.odds}
                    />
            </div>
            <div className="prop-line-favorite">
                <PropLine
                    text={favorite.text}
                    odds={favorite.odds}
                />
            </div>
        </div>
    )
}