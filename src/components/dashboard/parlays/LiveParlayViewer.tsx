import * as React from "react";
import { useContext, useEffect } from "react";
import { TasksContext, TasksDispatchContext } from "../../reducer/TasksContext";
import { ParlayTask } from "../../../App";
import { decimalToOdds, oddsToDecimal } from "../../../Util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

export interface LiveParlayViewerProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

export function LiveParlayViewer(props: LiveParlayViewerProps) {
  const { balance, setBalance } = props;
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
      dispatch({
        type: "submitParlay",
        totalOdds: decimalToOdds(totalDecimalOdds),
        wager: wager,
        payout: payout,
      });
      setBalance(balance - wager);
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
          " fixed pt-2 pb-5 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded-sm"
        );
      } else {
        return (
          "bottom-29" +
          " fixed pt-2 pb-5 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded-sm"
        );
      }
    } else {
      return "fixed pt-2 pb-5 bottom-5 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded-sm";
    }
  };

  return (
    <div className="flex flex-col-reverse">
      {tasks.length > 0 && (
        <div className={getStyling(showSlip)}>
          <div className="pb-2 w-full">
            <div
              key={"view"}
              className="float-left w-1/4 border-b-gray-400 pb-2 border-b-2"
            >
              <button
                onClick={toggleSlip}
                className="block w-full hover:bg-gray-800 rounded-xl pl-2 pr-2"
              >
                View Slip
              </button>
            </div>
            <div
              key={"payout"}
              className="float-left w-1/2 text-center border-b-gray-400 pb-2 border-b-2"
            >
              <span>
                ${wager} to{" "}
                <span className="text-green-500">${payout.toFixed(2)}</span>
                &emsp;&emsp;&emsp;&emsp;
              </span>
              <span className="font-bold">
                {decimalToOdds(totalDecimalOdds) > 0 && "+"}
                {decimalToOdds(totalDecimalOdds).toFixed()} odds
              </span>
              <span> {tasks.length} leg(s)</span>
            </div>
            <div
              key={"clear"}
              className="float-right w-1/4 border-b-gray-400 pb-2 border-b-2"
            >
              <button
                onClick={removeAllLegs}
                className="block w-full hover:bg-gray-800 rounded-xl pl-2 pr-2"
              >
                Clear Slip
              </button>
            </div>
          </div>
          {showSlip && (
            <div className="float-left max-h-24 overflow-y-scroll scrollbar-hide w-full flex-col border-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded-sm">
              {tasks.map((leg) => (
                <div key={leg.id} className="pt-1 mb-1 h-12">
                  <div className="pl-5 float-left w-3/8 h-full border-t-1 border-gray-300">
                    <span className="block relative text-white text-base">
                      {leg.team} {leg.text}
                    </span>
                    <span className="block relative text-gray-400 text-xs">
                      {leg.betType}
                    </span>
                  </div>
                  <div className="float-left w-4/8 text-right border-t-1 border-gray-300">
                    <span className="text-gray-300">
                      {leg.odds > 0 && "+"}
                      {leg.odds}
                    </span>
                  </div>
                  <div className="float-left w-1/8 border-t-1 border-gray-300">
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
          <div className="flex pl-5 pt-1.5 mt-6 dark:bg-gray-700 dark:border-gray-600 border-t-2 text-base w-full">
            <div className="w-3/4 float-left">
              Wager{" "}
              <input
                type="number"
                value={wager}
                max={balance}
                min={0}
                onChange={(e) => handleWagerChange(e)}
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none mb-5 bg-gray-800 dark:bg-gray-800 rounded-sm  border-1 dark:border-white border-white ml-3 pr-2 text-right"
              />
              {displayWarning && (
                <span className="text-red-500 pl-2">
                  Not Enough Funds To Place Wager
                </span>
              )}
            </div>
            <div className="w-1/4 float-left justify-end">
              <button
                className="block w-full hover:bg-gray-800 rounded-xl pl-2 pr-2"
                onClick={submitParlay}
              >
                LOCK IT IN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
