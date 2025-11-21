import { WeeklySlate } from "./wagers/WeeklySlate";
import * as React from "react";
import { useContext, useEffect } from "react";
import { MatchupSchema } from "../../utils/Util";
import { ParlayTask } from "../../App";
import { TasksContext, TasksDispatchContext } from "../reducer/TasksContext";
import { Lockout } from "./Lockout";
import { useParams } from "react-router-dom";
import supabase from "../../config/supabaseConfig";

export interface DashboardProps {
  weeklySlate: MatchupSchema[];
  setIsViewingDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  setIsViewingMatchup: React.Dispatch<React.SetStateAction<boolean>>;
  lockout: boolean;
  setCurrentMatchup: React.Dispatch<React.SetStateAction<MatchupSchema>>;
}

export function Dashboard(props: DashboardProps) {
  const {
    weeklySlate,
    setIsViewingDashboard,
    lockout,
    setCurrentMatchup,
    setIsViewingMatchup,
  } = props;
  const tasks: ParlayTask[] = useContext(TasksContext);
  const dispatch = useContext(TasksDispatchContext);

  const { parlayId } = useParams();

  useEffect(() => {
    setIsViewingDashboard(true);
    setIsViewingMatchup(false);
    if (parlayId != undefined) {
      const getSharedSlip = async () => {
        const { data, error } = await supabase
          .from("parlays")
          .select("*")
          .eq("parlay_id", parlayId);

        if (error) {
          console.log(error);
        }

        if (data) {
          const parlay = data[0];
          dispatch({
            type: "loadSharedSlip",
            expires_at: parlay["expires_at"],
            legs: parlay["legs"],
          });
        }
      };
      getSharedSlip();
    } else {
      console.log("Standard /parlays");
    }
  }, []);

  return (
    <div
      className={
        tasks.length > 0
          ? "w-full h-screen mb-37 bg-gray-900"
          : "w-full h-screen bg-gray-900"
      }
    >
      {lockout ? (
        <Lockout />
      ) : (
        <WeeklySlate
          matchups={weeklySlate}
          setCurrentMatchup={setCurrentMatchup}
        />
      )}
    </div>
  );
}
