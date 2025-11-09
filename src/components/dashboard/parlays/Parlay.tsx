import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { PropLineInterface } from "../wagers/PropLine";
import * as React from "react";

library.add(fas);

export interface ParlayProps {
  id: string;
  timestamp: number;
  legs: PropLineInterface[];
  totalOdds: number;
  payout: number;
  wager: number;
  isActive: boolean;
  isWinner: boolean;
  isPayedOut: boolean;
}

export function Parlay(props: ParlayProps) {
  const { id, timestamp, legs, totalOdds, payout, wager, isActive, isWinner } =
    props;
  const [isPayedOut, setIsPayedOut] = React.useState(props.isPayedOut);
  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div>
        <div>
          <span>
            {id}-{timestamp}:
          </span>
          <span>{totalOdds}</span>
        </div>
        {!isActive && (
          <div>
            {isWinner ? (
              <FontAwesomeIcon icon="fa-solid fa-square-check" />
            ) : (
              <FontAwesomeIcon icon="fa-solid fa-square-xmark" />
            )}
          </div>
        )}
      </div>
      <div>
        <ul>
          {legs.map((leg) => (
            <li>
              <span>{leg.text}</span>
              <span>{leg.odds}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <span>
          ${wager} to ${payout}
        </span>
        {isWinner && !isActive && !isPayedOut && (
          <button
            onClick={() => {
              setIsPayedOut(true);
            }}
          >
            Accept Earnings
          </button>
        )}
        {isWinner && !isActive && isPayedOut && <span>CASHHHHHHHHHHH</span>}
      </div>
    </div>
  );
}
