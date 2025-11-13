import * as React from "react";
import { useContext, useEffect } from "react";
import { TasksContext, TasksDispatchContext } from "../../reducer/TasksContext";
import { ParlayAction, ParlayTask } from "../../../App";

export interface PropLineProps {
  text: string;
  team: string;
  betType: string;
  odds: number;
  frontend_id: string;
  oppId: string;
}

export interface PropLineInterface {
  text: string;
  odds: number;
}

export function PropLine(props: PropLineProps) {
  const { text, odds, frontend_id, oppId, team, betType } = props;
  const tasks: ParlayTask[] = useContext(TasksContext);
  const dispatch = useContext(TasksDispatchContext);
  const [isAdded, setIsAdded] = React.useState(false);

  const selectParlay = () => {
    const type = !isAdded ? "addLeg" : "removeLeg";
    const action: ParlayAction = {
      type: type,
      frontend_id: frontend_id,
      text: text,
      odds: odds,
      team: team,
      betType: betType,
      oppId: oppId,
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
          ? "h-full w-full basis-0 grow border-blue-500 border border-solid justify-center items-center bg-blue-500 rounded-xs flex-col flex box-border overflow-hidden relative cursor-pointer"
          : "hover:bg-gray-600 h-full w-full basis-0 grow border-blue-500 border border-solid justify-center items-center bg-transparent rounded-xs flex-col flex box-border overflow-hidden relative cursor-pointer"
      }`}
    >
      {text.length > 0 ? (
        <button
          onClick={() => selectParlay()}
          className={`switch ${
            isAdded
              ? "h-full w-full basis-0 grow bg-blue-500 justify-center items-center rounded-xs flex-col flex box-border overflow-hidden relative cursor-pointer"
              : "hover:bg-gray-800 h-full w-full basis-0 grow justify-center items-center bg-transparent rounded-xs flex-col flex box-border overflow-hidden relative cursor-pointer"
          }`}
        >
          <span
            className={`switch ${
              isAdded
                ? "leading-none opacity-[1] text-xs font-[ProximaNova-Bold, serif] text-gray-300 font-bold"
                : "leading-none opacity-[1] text-xs font-[ProximaNova-Bold, serif] text-gray-300"
            }`}
          >
            {text}
          </span>
          <span
            className={`switch ${
              isAdded
                ? "leading-none tracking-[.5px] opacity-[1] text-xs font-[ProximaNova-Bold, serif] text-gray-300 font-bold"
                : "leading-none tracking-[.5px] opacity-[1] text-xs font-[ProximaNova-Bold, serif] text-blue-500"
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
              ? 'cursor-pointer h-full w-full mr-1 ml-1 bg-blue-500 basis-0 grow justify-center items-center flex-col flex box-border overflow-hidden rounded-sm relative"'
              : "hover:bg-gray-800 cursor-pointer h-full w-full mr-1 ml-1 bg-transparent basis-0 grow border border-solid justify-center items-center flex-col flex box-border overflow-hidden rounded-sm relative"
          }`}
        >
          <span
            className={`switch ${
              isAdded
                ? "tracking-[.5px] leading-none opacity-[1] text-gray-300 text-xs font-[ProximaNova-Bold, serif] font-bold"
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

  /*return (
    <div className="prop-line w-fit overflow-hidden">
      <button
        onClick={() => selectParlay()}
        className={`switch ${
          isAdded
            ? 'cursor-pointer border-blue-400 h-full w-full mr-1 ml-1 bg-blue-500 basis-0 grow border border-solid justify-center items-center flex-col flex box-border overflow-hidden rounded-sm relative"'
            : "hover:bg-gray-600 cursor-pointer border-blue-500 h-full w-full mr-1 ml-1 bg-transparent basis-0 grow border border-solid justify-center items-center flex-col flex box-border overflow-hidden rounded-sm relative"
        }`}
      >
        {text.length > 0 ? (
          <div className="text-center w-fit overflow-hidden">
            <span className="block relative text-white text-base">{text}</span>
            <span className="block relative text-gray-400 text-sm">
              {odds > 0 && "+"}
              {odds}
            </span>
          </div>
        ) : (
          <div>
            <span className="block relative text-white text-base">
              {odds > 0 && "+"}
              {odds}
            </span>
          </div>
        )}
      </button>
    </div>
  );*/
}
