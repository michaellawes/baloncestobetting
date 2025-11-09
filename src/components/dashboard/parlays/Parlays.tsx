import { Parlay, ParlayProps } from "./Parlay";

export interface ParlaysViewerProps {
  parlays: ParlayProps[];
}
export function Parlays(props: ParlaysViewerProps) {
  const { parlays } = props;
  return (
    <div>
      <ul>
        {parlays.map((parlay, i) => (
          <li key={i}>
            <Parlay {...parlay} />
          </li>
        ))}
      </ul>
    </div>
  );
}
