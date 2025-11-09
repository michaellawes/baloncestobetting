import { Parlay, ParlaySlipProps } from "./Parlay";
import * as React from "react";

export interface ParlaysViewerProps {
  parlays: ParlaySlipProps[];
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}
export function Parlays(props: ParlaysViewerProps) {
  const { parlays, setBalance } = props;
  return (
    <div className="flex flex-col w-full h-full bg-gray-600">
      <ul className="bg-gray-600">
        {parlays.map((parlay, i) => (
          <li key={i}>
            <Parlay {...parlay} setBalance={setBalance} />
          </li>
        ))}
      </ul>
    </div>
  );
}
