export interface PropLineProps {
    text: string;
    odds: number;
}
export function PropLine(props: PropLineProps) {
    const { text, odds } = props;
    return (
        <div className="prop-line">
            <div className="prop-line-text">
                {text}
            </div>
            <div className="prop-line-odds">
                {odds}
            </div>
        </div>
    )
}