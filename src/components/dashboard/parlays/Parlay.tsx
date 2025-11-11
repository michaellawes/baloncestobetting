import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import { ParlayTask } from "../../../App";

library.add(fas);

export interface ParlaySlipProps {
  id: string;
  timestamp: number;
  legs: ParlayTask[];
  totalOdds: number;
  payout: number;
  wager: number;
  isActive: boolean;
  isWinner: boolean;
  isPayedOut: boolean;
}

export interface ParlayProps extends ParlaySlipProps {
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

export function Parlay(props: ParlayProps) {
  const {
    id,
    timestamp,
    legs,
    totalOdds,
    payout,
    wager,
    isActive,
    isWinner,
    setBalance,
  } = props;
  const [isPayedOut, setIsPayedOut] = React.useState(props.isPayedOut);

  const getReadableDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return (
      d.getDate() +
      "/" +
      (d.getMonth() + 1) +
      "/" +
      d.getFullYear() +
      " " +
      d.getHours() +
      ":" +
      d.getMinutes()
    );
  };

  const handleAcceptPayout = () => {
    setIsPayedOut(true);
    setBalance((prev) => prev + payout);
  };

  return (
    <div className="w-full float-left shadow-sm rounded-xs dark:bg-gray-800 dark:border-white border-1">
      <div className="p-4 flex w-full items-center justify-between border-b-1 border-b-gray-400">
        <span className="text-gray-500 text-xs float-left">
          {id.substring(id.length - 5)}
        </span>
        <span className="text-white float-left">
          {getReadableDate(timestamp)}
        </span>
        <span className="text-white float-left">
          {totalOdds > 0 && "+"}
          {totalOdds}
        </span>
        {!isActive && isWinner && (
          <div className="text-green-700 z-40 text-base float-left">
            <FontAwesomeIcon icon="fa-solid fa-square-check" />
          </div>
        )}
        {!isActive && !isWinner && (
          <div className="text-red-700 text-base float-left">
            <FontAwesomeIcon icon="fa-solid fa-square-xmark" />
          </div>
        )}
      </div>
      <div className="float-left max-h-48 overflow-y-scroll scrollbar-hide w-full flex-col dark:bg-gray-800">
        {legs.map((leg) => (
          <div key={leg.id} className="pt-1 h-12">
            <div className="pl-5 float-left w-7/8 h-full">
              <span className="block relative text-white text-sm">
                {leg.team} {leg.text}
              </span>
              <span className="block relative text-gray-400 text-xs">
                {leg.betType}
              </span>
            </div>
            <div className="float-right w-1/8 text-right pr-5">
              <span className="text-gray-300">
                {leg.odds > 0 && "+"}
                {leg.odds}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t-2 flex w-full items-center justify-between border-b-1 rounded-xs dark:bg-gray-800 dark:border-gray-700">
        <div className="float-left text-left">
          <span className="text-gray-200 text-sm">${wager} to </span>
          <span className="text-green-500 text-sm">${payout.toFixed(2)}</span>
        </div>
        <div className="float-left w-1/2">
          {isWinner && !isActive && !isPayedOut && (
            <button
              onClick={() => {
                handleAcceptPayout();
              }}
              className="block w-full hover:bg-gray-600 rounded-xl pl-2 pr-2 text-white text-sm"
            >
              Accept Earnings
            </button>
          )}
          {isWinner && !isActive && isPayedOut && (
            <span className="text-green-500 text-base">CASHHHHHHHHHHH</span>
          )}
        </div>
      </div>
    </div>
  );
}
