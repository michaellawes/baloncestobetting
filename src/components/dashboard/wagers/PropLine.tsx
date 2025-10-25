import * as React from "react";

export interface PropLineProps extends PropLineInterface{
    addLeg: (leg: PropLineInterface, isAdded: boolean) => void,
}

export interface PropLineInterface {
    text: string;
    odds: number;
}

export function PropLine(props: PropLineProps) {
    const { text, odds, addLeg } = props;
    const [isAdded, setIsAdded] = React.useState(false);

    const selectParlay = () => {
        const leg: PropLineInterface = { text: text, odds: odds }
        addLeg(leg, isAdded);
        setIsAdded(!isAdded);
    }

    return (
        <div className="prop-line">
            {/*isAdded should determine whether button has "pressed down" styling or not */}
            <button onClick={() => selectParlay()}>
                <span>{text}</span>
                <span>{odds}</span>
            </button>
        </div>
    )
}