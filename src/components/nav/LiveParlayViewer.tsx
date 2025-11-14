import * as React from "react";
import { useContext, useEffect } from "react";
import { TasksContext, TasksDispatchContext } from "../reducer/TasksContext";
import { ParlayTask } from "../../App";
import {
  decimalToOdds,
  getParlayTypeAbbreviated,
  numberWithCommas,
  oddsToDecimal,
} from "../../utils/Util";

export interface LiveParlayViewerProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  isLoggedIn: boolean;
}

export function LiveParlayViewer(props: LiveParlayViewerProps) {
  const { balance, setBalance, isLoggedIn } = props;
  const tasks: ParlayTask[] = useContext(TasksContext);
  const dispatch = useContext(TasksDispatchContext);
  const [totalOdds, setTotalOdds] = React.useState<number>(0);
  const [payout, setPayout] = React.useState<number>(0);
  const [wager, setWager] = React.useState<number>(10);
  //const [showSlip, setShowSlip] = React.useState(false);
  const [displayWarning, setDisplayWarning] = React.useState("");
  const [shouldDisplay, setShouldDisplay] = React.useState(true);

  useEffect(() => {
    const timeout = setInterval(() => {
      setShouldDisplay(true);
    }, 200);
    return () => clearInterval(timeout);
  }, [wager, payout, shouldDisplay]);

  useEffect(() => {
    setPayout(wager * totalOdds);
  }, [totalOdds, wager, shouldDisplay]);

  const toggleSlideOver = () => {
    document
      .getElementById("slideover-container")
      .classList.toggle("invisible");
    document.getElementById("slideover").classList.toggle("translate-y-full");
  };

  useEffect(() => {
    if (tasks.length > 0) {
      if (totalOdds === 0) {
        toggleSlideOver();
      }
      setShouldDisplay(false);
      const totalDecimalOdds = tasks.reduce((total, task) => {
        return (total *= oddsToDecimal(task.odds));
      }, 1);
      setTotalOdds(totalDecimalOdds);
    } else {
      if (totalOdds > 0) {
        toggleSlideOver();
        setTotalOdds(0);
      }
    }
  }, [totalOdds, tasks]);

  const removeAllLegs = () => {
    dispatch({ type: "clearSlip" });
  };

  const submitParlay = () => {
    if (wager <= balance) {
      setBalance(balance - wager);
      dispatch({
        type: "submitParlay",
        totalOdds: decimalToOdds(totalOdds),
        wager: wager,
        payout: payout,
      });
    }
  };

  /*
  const toggleSlip = () => {
    setShowSlip(!showSlip);
  };

  const removeLeg = (id: string) => {
    dispatch({ type: "removeLeg", frontend_id: id });
  };
  */

  const handleWagerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value > balance) {
      event.target.style.borderColor = "red";
      setDisplayWarning("Insufficient balance");
    } else if (value < 0.01) {
      event.target.style.borderColor = "red";
      setDisplayWarning("Min wager $0.01");
    } else {
      setShouldDisplay(false);
      event.target.style.borderColor = "";
      setWager(value);
      setDisplayWarning("");
    }
  };

  return (
    <div
      id="slideover-container"
      className="invisible flex w-full flex-col z-50"
    >
      <div
        id="slideover"
        className="bottom-1 fixed pt-2 mb-3 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all"
      >
        <div className="flex flex-row mb-2">
          <div key={"view"} className="flex flex-row ml-5 w-4/6">
            <div className="text-base flex flex-row w-full font-bold">
              <div className="flex flex-row justify-start text-start items-center w-3/8">
                <span className="flex">
                  {tasks.length} leg {getParlayTypeAbbreviated(tasks.length)}
                </span>
              </div>
              <div className="flex flex-row justify-center text-center items-center w-5/8">
                <div
                  className={
                    shouldDisplay
                      ? "flex w-full text-center justify-center items-center box-border transition-opacity ease-linear delay-150"
                      : "flex w-full text-center justify-center items-center box-border transition-opacity opacity-0 invisible"
                  }
                >
                  <span className="font-[Proxima Nova, serif] w-fit tracking-[1px] font-light text-gray-300 text-xs relative">
                    wins ${numberWithCommas(parseFloat(payout.toFixed(2)))}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            key={"payout"}
            className={
              shouldDisplay
                ? "flex flex-row w-1/6 text-center justify-end transition-opacity ease-linear delay-150"
                : "flex flex-row w-1/6 text-center justify-end transition-opacity opacity-0 invisible"
            }
          >
            {totalOdds > 0 && (
              <span className="font-bold ">
                {decimalToOdds(totalOdds) > 0 && "+"}
                {decimalToOdds(totalOdds).toFixed()}
              </span>
            )}
          </div>
          <div key={"clear"} className="flex justify-end flex-row w-1/6">
            <button
              onClick={removeAllLegs}
              className="cursor-pointer justify-center flex grow hover:bg-gray-700 rounded-xl pl-2 pr-2 ml-2 mr-2"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="w-full flex row pl-5 bg-gray-800  border-t-1 text-base">
          <div className="flex w-3/4 md:w-1/2 mb-3 mt-1">
            Wager{" "}
            <input
              type="number"
              value={wager}
              max={balance}
              min={0.01}
              onChange={(e) => handleWagerChange(e)}
              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none focus:outline-none bg-gray-800 w-20 mt-1 h-5 dark:bg-gray-800 rounded-sm  border-1 border-gray-700 ml-3 pr-2 text-right"
            />
            {displayWarning.length > 0 && (
              <div className="ml-2 flex justify-center  border border-transparent items-center textwhite mt-1">
                <span className="bg-red-500 font-bold rounded-2xl pl-2 pr-2 text-sm">
                  {displayWarning}
                </span>
              </div>
            )}
          </div>
          {isLoggedIn && (
            <div className="overflow-hidden w-1/4 md:w-1/2 pr-2 ml-2 mr-2">
              <button
                className="cursor-pointer float-right hover:bg-gray-700 rounded-xl pl-4 pr-4 mt-1"
                onClick={submitParlay}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/*
{showSlip && (
          <div className="max-h-24 overflow-y-scroll scrollbar-hide w-full flex-col bg-gray-800">
            {tasks.map((leg) => (
              <div
                key={leg.frontend_id}
                className="h-12 w-full flex flex-row border-t-1 border-gray-300"
              >
                <div className="flex w-1/16 pl-2 justify-center cursor-pointer mt-2 items-center mb-2">
                  <button
                    onClick={() => removeLeg(leg.frontend_id)}
                    className="text-red-500 text-xs w-[18px] h-[18px] cursor-pointer hover:bg-gray-700 rounded-3xl border border-red-500"
                  >
                    <div className="flex h-[1px] border-t border-t-red-500 w-[8px] ml-1 mr-1 pr-1"></div>
                  </button>
                </div>
                <div className="flex justify-start mt-1 ml-2 flex-col h-full w-13/16">
                  <span className="flex relative text-white text-sm">
                    {leg.betType == "TOTAL POINTS"
                      ? leg.frontend_id.split("-")[0]
                      : leg.team}{" "}
                    {leg.text}
                  </span>
                  <span className="flex relative text-gray-400 text-xs">
                    {leg.betType}
                  </span>
                </div>
                <div className="flex justify-end items-center text-right w-1/16">
                  <span className="text-gray-300 pl-2">
                    {leg.odds > 0 && "+"}
                    {leg.odds}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

 */
/*
 <span className="font-[Proxima Nova, serif]">
                  ${wager}
                  {tasks.length > 1 ? " SGP+ wins $ " : " SGP wins $ "}
                </span>
                <span className="mr-3 font-[Proxima Nova, serif]">
                  {numberWithCommas(parseFloat(payout.toFixed(2)))}
                </span>
  */

/*
className={
          !showSlip
            ? "bottom-1 fixed pt-2 mb-3 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all"
            : tasks.length == 1
              ? "bottom-16 fixed pt-2 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all"
              : "bottom-28 fixed pt-2 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all"
        }
 */

/*
{
            <button
              onClick={toggleSlip}
              className="cursor-pointer justify-center flex grow hover:bg-gray-700 rounded-xl mr-2"
            >
              View Slip
            </button>
            }
 */
