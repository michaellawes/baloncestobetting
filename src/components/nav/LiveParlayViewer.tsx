import * as React from "react";
import { useContext, useEffect } from "react";
import { TasksContext, TasksDispatchContext } from "../reducer/TasksContext";
import { ParlayTask } from "../../App";
import { decimalToOdds, oddsToDecimal } from "../../Util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

export interface LiveParlayViewerProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  isLoggedIn: boolean;
}

export function LiveParlayViewer(props: LiveParlayViewerProps) {
  const { balance, setBalance, isLoggedIn } = props;
  const tasks: ParlayTask[] = useContext(TasksContext);
  const dispatch = useContext(TasksDispatchContext);
  const [totalDecimalOdds, setTotalOdds] = React.useState<number>(0);
  const [payout, setPayout] = React.useState<number>(0);
  const [wager, setWager] = React.useState<number>(10);
  const [showSlip, setShowSlip] = React.useState(false);
  const [displayWarning, setDisplayWarning] = React.useState(false);

  useEffect(() => {
    setPayout(wager * totalDecimalOdds);
  }, [totalDecimalOdds, wager]);

  useEffect(() => {
    if (tasks.length > 0) {
      const totalDecimalOdds = tasks.reduce((total, task) => {
        return (total *= oddsToDecimal(task.odds));
      }, 1);
      setTotalOdds(totalDecimalOdds);
    }
  }, [totalDecimalOdds, tasks]);

  const removeAllLegs = () => {
    dispatch({ type: "clearSlip" });
  };

  const submitParlay = () => {
    if (wager <= balance) {
      setBalance(balance - wager);
      dispatch({
        type: "submitParlay",
        totalOdds: decimalToOdds(totalDecimalOdds),
        wager: wager,
        payout: payout,
      });
    }
  };

  const toggleSlip = () => {
    setShowSlip(!showSlip);
  };

  const removeLeg = (id: string) => {
    dispatch({ type: "removeLeg", id: id });
  };

  const handleWagerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value > balance) {
      event.target.style.borderColor = "red";
      setDisplayWarning(true);
    } else {
      event.target.style.borderColor = "";
      setWager(value);
      setDisplayWarning(false);
    }
  };

  const getStyling = (showSlip: boolean) => {
    if (showSlip) {
      if (tasks.length == 1) {
        return (
          "bottom-18" +
          " fixed pt-2 pb-5 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded-sm dark:border-b-gray-400 border-b-2"
        );
      } else {
        return (
          "bottom-29" +
          " fixed pt-2 pb-5 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded-sm dark:border-b-gray-400 border-b-2"
        );
      }
    } else {
      return "fixed pt-2 pb-5 bottom-5 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded-sm";
    }
  };

  return (
    <div className="flex w-full flex-col-reverse">
      {tasks.length > 0 && (
        <div className={getStyling(showSlip)}>
          <div className="pb-2 w-fit md:w-full">
            <div key={"view"} className="float-left w-fit pb-2 md:w-1/3">
              <button
                onClick={toggleSlip}
                className="block w-full hover:bg-gray-800 rounded-xl pl-2 pr-2"
              >
                View Slip
              </button>
            </div>
            <div
              key={"payout"}
              className="float-left text-center pb-2 w-fit md:w-1/3"
            >
              <span>${wager} to </span>
              <span className="text-green-500">${payout.toFixed(2)}</span>
              <span className="font-bold">
                {" "}
                {decimalToOdds(totalDecimalOdds) > 0 && "+"}
                {decimalToOdds(totalDecimalOdds).toFixed()}
              </span>
              <span> {tasks.length} leg(s)</span>
            </div>
            <div key={"clear"} className="float-right w-fit pb-2 md:w-1/3">
              <button
                onClick={removeAllLegs}
                className="block w-fit md:w-full hover:bg-gray-800 rounded-xl pl-2 pr-2"
              >
                Clear Slip
              </button>
            </div>
          </div>
          {showSlip && (
            <div className="float-left max-h-24 overflow-y-scroll scrollbar-hide w-full flex-col border-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded-sm">
              {tasks.map((leg) => (
                <div
                  key={leg.id}
                  className="pt-1 mb-1 h-12 w-full border-t-1 border-gray-300"
                >
                  <div className="pl-5 float-left w-fit h-full md:w-5/8">
                    <span className="block relative text-white text-base ">
                      {leg.team} {leg.text}
                    </span>
                    <span className="block relative text-gray-400 text-xs ">
                      {leg.betType}
                    </span>
                  </div>
                  <div className="float-left w-fit text-right md:w-2/8">
                    <span className="text-gray-300 pl-2">
                      {leg.odds > 0 && "+"}
                      {leg.odds}
                    </span>
                  </div>
                  <div className="float-right w-fit md:w-1/8">
                    <button
                      onClick={() => removeLeg(leg.id)}
                      className="float-right pr-5"
                    >
                      <FontAwesomeIcon icon="fa-solid fa-xmark" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="w-full flex row pl-5 pt-1.5 mt-6 dark:bg-gray-700 dark:border-gray-600 border-t-2 text-base">
            <div className="w-fit float-left md:w-1/2">
              Wager{" "}
              <input
                type="number"
                value={wager}
                max={balance}
                min={0}
                onChange={(e) => handleWagerChange(e)}
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none mb-5 bg-gray-800 w-20 dark:bg-gray-800 rounded-sm  border-1 dark:border-white border-white ml-3 pr-2 text-right"
              />
              {displayWarning && (
                <span className="text-red-500 pl-2">
                  Not Enough Funds To Place Wager
                </span>
              )}
            </div>
            {isLoggedIn && (
              <div className="w-fit overflow-hidden md:w-1/2">
                <button
                  className="float-right hover:bg-gray-800 rounded-xl pl-2 pr-2 md:pr-5"
                  onClick={submitParlay}
                >
                  LOCK IT IN
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
