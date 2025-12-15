import * as React from "react";
import { useContext, useEffect } from "react";
import { TasksContext, TasksDispatchContext } from "../reducer/TasksContext";
import {
  decimalToOdds,
  getParlayTypeAbbreviated,
  getPayoutWithRespectToScreenWidth,
  getPropTextWithRespectToScreenSize,
  oddsToDecimal,
} from "../../utils/Util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  fas,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { LiveParlayViewerProps, ParlayTask } from "../../utils/Interfaces";
import { specialLegTypes } from "../../utils/Constants";

library.add(fas);

export function LiveParlayViewer(props: LiveParlayViewerProps) {
  const { balance, setBalance, isLoggedIn } = props;
  const [totalOdds, setTotalOdds] = React.useState<number>(0);
  const [payout, setPayout] = React.useState<number>(0);
  const [wager, setWager] = React.useState<number>(10);
  const [showSlip, setShowSlip] = React.useState(false);
  const [displayWarning, setDisplayWarning] = React.useState("");
  const [shouldDisplay, setShouldDisplay] = React.useState(true);
  const [hasOpenedOnce, setHasOpenedOnce] = React.useState(false);

  const tasks: ParlayTask[] = useContext(TasksContext);
  const dispatch = useContext(TasksDispatchContext);

  const getContainsCinemaLeg = () => {
    if (tasks.length > 0) {
      return tasks.some(
        (leg) =>
          leg.special_leg_type !== undefined &&
          leg.special_leg_type === specialLegTypes[0],
      );
    }
    return false;
  };

  const getParlayContainsDiscount = () => {
    return tasks.some(
      (leg) =>
        leg.special_leg_type !== undefined &&
        leg.special_leg_type === specialLegTypes[1],
    );
  };

  const getMeetsDiscountMinimumLegs = () => {
    if (
      tasks.some(
        (leg) =>
          leg.special_leg_type !== undefined &&
          leg.special_leg_type === specialLegTypes[1],
      )
    ) {
      return tasks.length > 1;
    }
    return true;
  };

  const getStyling = (showSlip: boolean) => {
    if (showSlip) {
      if (tasks.length == 1) {
        return (
          "bottom-29" +
          " fixed pt-2 mb-3 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all"
        );
      } else if (tasks.length == 2) {
        return (
          "bottom-53" +
          " fixed pt-2 mb-3 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all"
        );
      } else if (tasks.length == 3) {
        return (
          "bottom-65" +
          " fixed pt-2 mb-3 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all"
        );
      } else if (tasks.length == 4) {
        return (
          "bottom-77" +
          " fixed pt-2 mb-3 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all"
        );
      } else if (tasks.length == 5) {
        return (
          "bottom-88" +
          " fixed pt-2 mb-3 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all"
        );
      } else {
        return (
          "bottom-83" +
          " fixed pt-2 mb-8 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all"
        );
      }
    } else {
      if (hasOpenedOnce) {
        return "bottom-4 mb-16 fixed pt-2 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all";
      } else {
        return "bottom-4 fixed pt-2 w-full h-16 bg-gray-800 border-b border-t-2 border-blue-500 rounded-sm translate-y-full duration-200 ease-in transition-all";
      }
    }
  };

  const handleWagerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value > balance) {
      event.target.style.borderColor = "red";
      setDisplayWarning("Insufficient balance");
    } else if (value > 50 && getParlayContainsDiscount()) {
      event.target.style.borderColor = "red";
      setDisplayWarning("Discount max $50");
    } else if (value < 0) {
      event.target.style.borderColor = "red";
      setDisplayWarning("Min wager $0.01");
    } else {
      setShouldDisplay(false);
      event.target.style.borderColor = "";
      setWager(value);
      setDisplayWarning("");
    }
  };

  const removeAllLegs = () => {
    dispatch({ type: "clearSlip" });
  };

  const removeLeg = (id: string) => {
    dispatch({ type: "removeLeg", frontend_id: id });
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

  const toggleSlideOver = () => {
    document
      .getElementById("slideover-container")
      .classList.toggle("invisible");
    document.getElementById("slideover").classList.toggle("translate-y-full");
  };

  const toggleSlip = () => {
    setHasOpenedOnce(true);
    setShowSlip(!showSlip);
  };

  useEffect(() => {
    const timeout = setInterval(() => {
      setShouldDisplay(true);
    }, 200);
    return () => clearInterval(timeout);
  }, [wager, payout, shouldDisplay]);

  useEffect(() => {
    setPayout(wager * totalOdds);
  }, [totalOdds, wager, shouldDisplay]);

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
        setShowSlip(false);
        setHasOpenedOnce(false);
      }
      setWager(10);
    }
  }, [totalOdds, tasks]);

  return (
    <div
      id="slideover-container"
      className="invisible flex absolute w-full z-50"
    >
      <div id="slideover" className={getStyling(showSlip)}>
        <div className="flex flex-row mb-2">
          <div key={"header"} className="flex flex-row ml-5 w-5/8">
            <div className="text-base flex flex-row w-full font-bold">
              <div className="flex flex-row justify-start text-start items-center w-4/8">
                <span className="flex">
                  {tasks.length} leg {getParlayTypeAbbreviated(tasks.length)}
                </span>
              </div>
              <div className="flex flex-row justify-center text-center items-center w-4/8">
                <div
                  className={
                    shouldDisplay
                      ? "flex w-full text-center justify-center items-center box-border transition-opacity ease-linear delay-150"
                      : "flex w-full text-center justify-center items-center box-border transition-opacity opacity-0 invisible"
                  }
                >
                  <span className="font-[Proxima Nova, serif] w-full tracking-[1px] font-light text-gray-300 text-xs relative">
                    {getPayoutWithRespectToScreenWidth(payout)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            key={"payout"}
            className={
              shouldDisplay
                ? "flex flex-row w-2/8 text-center justify-end transition-opacity ease-linear delay-150"
                : "flex flex-row w-2/8 text-center justify-end transition-opacity opacity-0 invisible"
            }
          >
            {totalOdds > 0 && (
              <span
                className={
                  getContainsCinemaLeg()
                    ? "text-yellow-300 font-bold"
                    : "text-white font-bold"
                }
              >
                {decimalToOdds(totalOdds) > 0 && "+"}
                {decimalToOdds(totalOdds).toFixed()}
              </span>
            )}
          </div>
          <div key={"view"} className="flex justify-end flex-row w-1/8">
            <button
              onClick={toggleSlip}
              className="cursor-pointer justify-center text-blue-500 items-center flex grow hover:bg-gray-700 rounded-xl mx-3"
            >
              {showSlip ? (
                <FontAwesomeIcon icon={faChevronDown as IconProp} />
              ) : (
                <FontAwesomeIcon icon={faChevronUp as IconProp} />
              )}
            </button>
          </div>
        </div>
        <div>
          {showSlip && (
            <div className="max-h-71 overflow-y-scroll scrollbar-hide w-full flex-col bg-gray-800">
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
                      {getPropTextWithRespectToScreenSize(
                        leg,
                        window.innerWidth,
                      )}
                    </span>
                    {leg.special_leg_type !== undefined ? (
                      <>
                        {leg.special_leg_type === specialLegTypes[0] && (
                          <span className="flex relative text-yellow-300 text-xs">
                            {"CINEMA "}
                            {
                              leg.frontend_id.split("/")[
                                leg.frontend_id.split("/").length - 1
                              ]
                            }
                          </span>
                        )}
                        {leg.special_leg_type === specialLegTypes[1] && (
                          <span className="flex relative text-blue-400 text-xs">
                            {"DISCOUNTED "}
                            {
                              leg.frontend_id.split("/")[
                                leg.frontend_id.split("/").length - 1
                              ]
                            }
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="flex relative text-gray-400 text-xs">
                        {
                          leg.frontend_id.split("/")[
                            leg.frontend_id.split("/").length - 1
                          ]
                        }
                      </span>
                    )}
                  </div>
                  <div className="flex justify-end items-center text-right w-1/16">
                    {leg.special_leg_type !== undefined ? (
                      <>
                        {leg.special_leg_type === specialLegTypes[0] && (
                          <span className="text-yellow-300">
                            {leg.odds > 0 && "+"}
                            {leg.odds}
                          </span>
                        )}
                        {leg.special_leg_type === specialLegTypes[1] && (
                          <span className="text-blue-400">
                            {leg.odds > 0 && "+"}
                            {leg.odds}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-300">
                        {leg.odds > 0 && "+"}
                        {leg.odds}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {tasks.length > 1 && (
                <div
                  key={"clear"}
                  className="h-12 w-full flex justify-center flex-row border-t-1 border-gray-300"
                >
                  <button
                    onClick={removeAllLegs}
                    className="cursor-pointer justify-center flex flex-row grow hover:bg-gray-700 items-center px-2"
                  >
                    <div className="flex text-red-500 mr-2">
                      <FontAwesomeIcon icon={faTrashCan as IconProp} />
                    </div>
                    <div className="flex">
                      <span className="text-red-500 font-light text-sm">
                        Remove all selections
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="w-full flex row pl-5 bg-gray-800 pt-[2px] border-t-1 text-base">
          <div className="flex w-3/4 md:w-1/2 mb-3 mt-1">
            Wager{" "}
            <input
              type="number"
              value={wager}
              max={getParlayContainsDiscount() ? 50 : balance}
              min={0}
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
          {isLoggedIn &&
            balance > 0 &&
            wager > 0.01 &&
            getMeetsDiscountMinimumLegs() && (
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
