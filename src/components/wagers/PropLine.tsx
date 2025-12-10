import * as React from "react";
import { useContext, useEffect } from "react";
import { TasksContext, TasksDispatchContext } from "../reducer/TasksContext";
import {
  ParlayAction,
  ParlayTask,
  PropLineProps,
} from "../../utils/Interfaces";
import { specialLegTypes } from "../../utils/Constants";
import { decimalToOdds, oddsToDecimal } from "../../utils/Util";

export function PropLine(props: PropLineProps) {
  const {
    text,
    odds,
    frontend_id,
    oppId,
    team,
    betType,
    isHome,
    isClose,
    isDiscounted,
    specialLegType,
    oldText,
  } = props;
  const tasks: ParlayTask[] = useContext(TasksContext);
  const dispatch = useContext(TasksDispatchContext);
  const [isAdded, setIsAdded] = React.useState(false);

  const selectParlay = () => {
    const type = !isAdded ? "addLeg" : "removeLeg";
    const action: ParlayAction = {
      type: type,
      frontend_id: frontend_id,
      text: text,
      odds:
        specialLegType !== undefined && specialLegType === specialLegTypes[0]
          ? parseFloat(decimalToOdds(oddsToDecimal(odds) * 1.25).toFixed())
          : odds,
      team: team,
      betType: betType,
      oppId: oppId,
      isHome: isHome,
      special_leg_type: specialLegType,
    };
    dispatch(action);
  };

  useEffect(() => {
    const index = tasks.findIndex(
      (addedLegs) => addedLegs.frontend_id === frontend_id,
    );
    setIsAdded(index !== -1);
  }, [tasks, frontend_id]);

  return (
    <div
      className={`switch ${
        isAdded
          ? isClose !== undefined && isClose
            ? "h-full w-full basis-0 grow border-yellow-400 border border-solid justify-center items-center bg-yellow-400 rounded-xs flex-col flex box-border overflow-hidden relative"
            : "h-full w-full basis-0 grow border-blue-500 border border-solid justify-center items-center bg-blue-500 rounded-xs flex-col flex box-border overflow-hidden relative"
          : isClose !== undefined && isClose
            ? "hover:bg-gray-600 h-full w-full basis-0 grow border-yellow-400 border border-solid justify-center items-center bg-transparent rounded-xs flex-col flex box-border overflow-hidden relative"
            : "hover:bg-gray-600 h-full w-full basis-0 grow border-blue-500 border border-solid justify-center items-center bg-transparent rounded-xs flex-col flex box-border overflow-hidden relative"
      }`}
    >
      {text.length > 0 ? (
        <button
          onClick={() => selectParlay()}
          className={`switch ${
            isAdded
              ? isClose !== undefined && isClose
                ? "h-full w-full basis-0 grow bg-yellow-400 justify-center items-center rounded-xs flex-col flex box-border overflow-hidden relative cursor-pointer"
                : "h-full w-full basis-0 grow bg-blue-500 justify-center items-center rounded-xs flex-col flex box-border overflow-hidden relative cursor-pointer"
              : "hover:bg-gray-800 h-full w-full basis-0 grow justify-center items-center bg-transparent rounded-xs flex-col flex box-border overflow-hidden relative cursor-pointer"
          }`}
        >
          <span
            className={`switch ${
              isAdded
                ? isClose !== undefined && isClose
                  ? "leading-none opacity-[1] text-xs font-[ProximaNova-Bold, serif] text-white font-bold"
                  : "leading-none opacity-[1] text-xs font-[ProximaNova-Bold, serif] text-gray-300 font-bold"
                : isDiscounted !== undefined && isDiscounted
                  ? "leading-none opacity-[1] text-xs font-[ProximaNova-Bold, serif] text-blue-300"
                  : "leading-none opacity-[1] text-xs font-[ProximaNova-Bold, serif] text-gray-300"
            }`}
          >
            {isDiscounted !== undefined &&
            isDiscounted &&
            oldText !== undefined ? (
              <span>
                {text}
                <span className="ml-1 line-through text-gray-500">
                  {oldText}
                </span>
              </span>
            ) : (
              <span>{text}</span>
            )}
          </span>
          <span
            className={`switch ${
              isAdded
                ? isClose !== undefined && isClose
                  ? "tracking-[.5px] leading-none opacity-[1] text-white text-xs font-[ProximaNova-Bold, serif] font-bold"
                  : "tracking-[.5px] leading-none opacity-[1] text-gray-300 text-xs font-[ProximaNova-Bold, serif] font-bold"
                : isClose !== undefined && isClose
                  ? "tracking-[.5px] leading-none opacity-[1] text-yellow-500 text-xs font-[ProximaNova-Bold, serif]"
                  : "tracking-[.5px] leading-none opacity-[1] text-blue-500 text-xs font-[ProximaNova-Bold, serif]"
            }`}
          >
            {odds > 0 && "+"}
            {odds}
          </span>
        </button>
      ) : (
        <button
          onClick={() => selectParlay()}
          className={`switch ${
            isAdded
              ? isClose !== undefined && isClose
                ? "cursor-pointer h-full w-full mr-1 ml-1 bg-yellow-400 basis-0 grow justify-center items-center flex-col flex box-border overflow-hidden rounded-sm relative"
                : "cursor-pointer h-full w-full mr-1 ml-1 bg-blue-500 basis-0 grow justify-center items-center flex-col flex box-border overflow-hidden rounded-sm relative"
              : "hover:bg-gray-800 cursor-pointer h-full w-full mr-1 ml-1 bg-transparent basis-0 grow border border-solid justify-center items-center flex-col flex box-border overflow-hidden rounded-sm relative"
          }`}
        >
          <span
            className={`switch ${
              isAdded
                ? isClose !== undefined && isClose
                  ? "tracking-[.5px] leading-none opacity-[1] text-white text-xs font-[ProximaNova-Bold, serif] font-bold"
                  : "tracking-[.5px] leading-none opacity-[1] text-gray-300 text-xs font-[ProximaNova-Bold, serif] font-bold"
                : isClose !== undefined && isClose
                  ? "tracking-[.5px] leading-none opacity-[1] text-yellow-500 text-xs font-[ProximaNova-Bold, serif]"
                  : "tracking-[.5px] leading-none opacity-[1] text-blue-500 text-xs font-[ProximaNova-Bold, serif]"
            }`}
          >
            {odds > 0 && "+"}
            {odds}
          </span>
        </button>
      )}
    </div>
  );
}
