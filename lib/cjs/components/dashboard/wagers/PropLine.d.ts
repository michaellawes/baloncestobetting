export interface PropLineProps {
    text: string;
    team: string;
    betType: string;
    odds: number;
    frontend_id: string;
    oppId: string;
    isHome: boolean;
}
export interface PropLineInterface {
    text: string;
    odds: number;
}
export declare function PropLine(props: PropLineProps): import("react/jsx-runtime").JSX.Element;
