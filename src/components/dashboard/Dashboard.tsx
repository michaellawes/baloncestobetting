import { WeeklySlate } from "./wagers/WeeklySlate";
import * as React from "react";
import { useContext, useEffect } from "react";
import { TasksContext, TasksDispatchContext } from "../reducer/TasksContext";
import { Lockout } from "./Lockout";
import { useParams } from "react-router-dom";
import supabase from "../../config/supabaseConfig";
import { MatchupSchema, ParlayTask } from "../../utils/Interfaces";
import { getDailySlate } from "../../utils/Util";

export interface DashboardProps {
  weeklySlate: MatchupSchema[];
  setIsViewingDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  setIsViewingMatchup: React.Dispatch<React.SetStateAction<boolean>>;
  lockout: boolean;
  setCurrentMatchup: React.Dispatch<React.SetStateAction<MatchupSchema>>;
  setMatchup: React.Dispatch<React.SetStateAction<number>>;
  setLockout: React.Dispatch<React.SetStateAction<boolean>>;
  setWeeklySlate: React.Dispatch<React.SetStateAction<MatchupSchema[]>>;
}

export function Dashboard(props: DashboardProps) {
  const {
    weeklySlate,
    setIsViewingDashboard,
    lockout,
    setCurrentMatchup,
    setIsViewingMatchup,
    setMatchup,
    setWeeklySlate,
    setLockout,
  } = props;

  const dispatch = useContext(TasksDispatchContext);
  const tasks: ParlayTask[] = useContext(TasksContext);

  const { parlayId } = useParams();

  useEffect(() => {
    setIsViewingDashboard(true);
    setIsViewingMatchup(false);
    const getMatchup = async () => {
      const { data, error } = await supabase
        .from("matchup")
        .select("id, is_done")
        .order("id", { ascending: false })
        .limit(1);

      if (error) {
        console.log(error);
      }

      if (data) {
        setMatchup(data[0]["id"]);
        setLockout(data[0]["is_done"]);
        const weeklySlate = await getDailySlate(data[0]["id"]);
        //setWeeklySlate(demoWeeklySlate);
        setWeeklySlate(weeklySlate);
      }

      if (parlayId != undefined) {
        const getSharedSlip = async () => {
          const { data, error } = await supabase
            .from("parlays")
            .select("legs, expires_at")
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
        await getSharedSlip();
      }
    };
    getMatchup();
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
