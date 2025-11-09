import * as React from "react";
import { useContext, useEffect } from "react";
import { TasksContext, TasksDispatchContext } from "../../reducer/TasksContext";
import { ParlayAction, ParlayTask } from "../../../App";

export interface PropLineProps {
  text: string;
  team: string;
  betType: string;
  odds: number;
  id: string;
  oppId: string;
}

export interface PropLineInterface {
  text: string;
  odds: number;
}

export function PropLine(props: PropLineProps) {
  const { text, odds, id, oppId, team, betType } = props;
  const tasks: ParlayTask[] = useContext(TasksContext);
  const dispatch = useContext(TasksDispatchContext);
  const [isAdded, setIsAdded] = React.useState(false);

  const selectParlay = () => {
    const type = !isAdded ? "addLeg" : "removeLeg";
    const action: ParlayAction = {
      type: type,
      id: id,
      text: text,
      odds: odds,
      team: team,
      betType: betType,
    };
    if (!isAdded) {
      action["oppId"] = oppId;
    }
    dispatch(action);
  };

  useEffect(() => {
    const index = tasks.findIndex((addedLegs) => addedLegs.id === id);
    setIsAdded(index !== -1);
  }, [tasks, id]);

  return (
    <div className="prop-line">
      <button
        onClick={() => selectParlay()}
        className={`switch ${
          isAdded
            ? "py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            : "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        }`}
      >
        {text.length > 0 ? (
          <div className="text-center overflow-hidden">
            <span className="block relative text-white text-base">{text}</span>
            <span className="block relative text-gray-400 text-sm">
              {odds > 0 && "+"}
              {odds}
            </span>
          </div>
        ) : (
          <div>
            <span className="block relative text-white text-2xl">
              {odds > 0 && "+"}
              {odds}
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
