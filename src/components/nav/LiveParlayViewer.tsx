import * as React from "react";
import { useContext, useEffect } from "react";
import { TasksContext, TasksDispatchContext } from "../reducer/TasksContext";
import { ParlayTask } from "../../App";
import {
  decimalToOdds,
  numberWithCommas,
  oddsToDecimal,
} from "../../utils/Util";
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";

import { fas, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    dispatch({ type: "removeLeg", frontend_id: id });
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
          " fixed pt-2 pb-5 z-50 w-full h-16 border-t bg-gray-800 border-b-3 border-gray-700 rounded-sm"
        );
      } else {
        return (
          "bottom-29" +
          " fixed pt-2 pb-5 z-50 w-full h-16 border-t bg-gray-800 border-b-3 border-gray-700 rounded-sm"
        );
      }
    } else {
      return "bottom-5 fixed pt-2 pb-5 z-50 w-full h-16 border-t bg-gray-800 border-b-3 border-gray-700 rounded-sm";
    }
  };

  return (
    <div className="flex w-full flex-col-reverse">
      {tasks.length > 0 && (
        <div className={getStyling(showSlip)}>
          <div className="pb-2 w-full">
            <div key={"view"} className="float-left w-1/4 pb-2 md:w-1/3 pl-2">
              <button
                onClick={toggleSlip}
                className="cursor-pointer block w-full hover:bg-gray-700 rounded-xl pl-2 pr-2"
              >
                View Slip
              </button>
            </div>
            <div
              key={"payout"}
              className="float-left text-center pb-2 w-1/2 md:w-1/3"
            >
              <span>${wager} to </span>
              <span className="text-green-500 mr-3">
                ${numberWithCommas(parseFloat(payout.toFixed(2)))}
              </span>
              <span className="font-bold hidden md:inline-block">
                {decimalToOdds(totalDecimalOdds) > 0 && "+"}
                {decimalToOdds(totalDecimalOdds).toFixed()}
              </span>
              <span> {tasks.length} leg(s)</span>
            </div>
            <div key={"clear"} className="float-right w-1/4 pb-2 md:w-1/3 pr-2">
              <button
                onClick={removeAllLegs}
                className="cursor-pointer block w-full hover:bg-gray-700 rounded-xl mr-2 pr-2 pl-2"
              >
                Clear Slip
              </button>
            </div>
          </div>
          {showSlip && (
            <div className="float-left max-h-24 overflow-y-scroll scrollbar-hide w-full flex-col bg-gray-800">
              {tasks.map((leg) => (
                <div
                  key={leg.frontend_id}
                  className="pt-1 mb-1 h-12 w-full border-t-1 border-gray-300"
                >
                  <div className="pl-5 float-left h-full w-5/8">
                    <span className="block relative text-white text-sm ">
                      {leg.betType == "TOTAL POINTS"
                        ? leg.frontend_id.split("-")[0]
                        : leg.team}{" "}
                      {leg.text}
                    </span>
                    <span className="block relative text-gray-400 text-xs ">
                      {leg.betType}
                    </span>
                  </div>
                  <div className="float-left text-right w-2/8">
                    <span className="text-gray-300 pl-2">
                      {leg.odds > 0 && "+"}
                      {leg.odds}
                    </span>
                  </div>
                  <div className="float-right w-1/8 cursor-pointer pr-5">
                    <button
                      onClick={() => removeLeg(leg.frontend_id)}
                      className="float-right cursor-pointer hover:bg-gray-700 rounded-2xl pl-1 pr-1"
                    >
                      <FontAwesomeIcon icon={faXmark as IconProp} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="w-full flex row pl-5 pt-1.5 mt-6 bg-gray-800  border-t-1 text-base pb-2">
            <div className="float-left w-3/4 md:w-1/2">
              Wager{" "}
              <input
                type="number"
                value={wager}
                max={balance}
                min={0}
                onChange={(e) => handleWagerChange(e)}
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none mb-5 bg-gray-800 w-20 dark:bg-gray-800 rounded-sm  border-1 border-gray-700 ml-3 pr-2 text-right"
              />
              {displayWarning && (
                <span className="text-red-500 pl-2 text-sm">
                  Not Enough Funds To Place Wager
                </span>
              )}
            </div>
            {isLoggedIn && (
              <div className="overflow-hidden w-1/4 md:w-1/2 pr-2 ml-2 mr-2">
                <button
                  className="cursor-pointer float-right hover:bg-gray-700 rounded-xl pl-4 pr-4"
                  onClick={submitParlay}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
