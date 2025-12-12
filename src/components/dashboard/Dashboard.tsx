import { WeeklySlate } from "../wagers/WeeklySlate";
import * as React from "react";
import { useContext, useEffect } from "react";
import { TasksContext, TasksDispatchContext } from "../reducer/TasksContext";
import { Lockout } from "../errors/Lockout";
import { useParams } from "react-router-dom";
import supabase from "../../config/supabaseConfig";
import { DashboardProps, ParlayTask } from "../../utils/Interfaces";
import {
  createPlayerSpecials,
  getDailySlate,
  getDaysSinceLastMonday,
} from "../../utils/Util";
import { Specials } from "./Specials";

export function Dashboard(props: DashboardProps) {
  const {
    weeklySlate,
    setIsViewingDashboard,
    lockout,
    setCurrentMatchup,
    setIsViewingMatchup,
    setMatchup,
    setWeeklySlate,
    setSpecials,
    specials,
  } = props;

  const dispatch = useContext(TasksDispatchContext);
  const tasks: ParlayTask[] = useContext(TasksContext);

  const { parlayId } = useParams();

  useEffect(() => {
    setIsViewingDashboard(true);
    setIsViewingMatchup(false);
    window.scrollTo(0, 0);
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
        if (!lockout && !data[0]["is_done"]) {
          const weeklySlate = await getDailySlate(data[0]["id"]);
          const getSpecials = createPlayerSpecials(weeklySlate);
          setWeeklySlate(weeklySlate);
          setSpecials(getSpecials);
          if (parlayId != undefined) {
            const getSharedSlip = async () => {
              supabase
                .from("fb_parlay_legs")
                .select("*")
                .eq("parlay_id", parlayId)
                .order("index")
                .then((response) => {
                  if (response.error) {
                    console.log(error);
                  }

                  if (data) {
                    dispatch({
                      type: "loadSharedSlip",
                      legs: response.data,
                    });
                  }
                });
            };
            await getSharedSlip();
          }
        }
      }
    };
    getMatchup();
  }, []);

  return (
    <div
      className={
        tasks.length > 0
          ? specials.length > 0
            ? "w-full h-screen mb-51 bg-gray-900"
            : "w-full h-screen mb-37 bg-gray-900"
          : "w-full h-screen bg-gray-900"
      }
    >
      {lockout || weeklySlate.length === 0 ? (
        <Lockout
          message={
            lockout
              ? getDaysSinceLastMonday() == 6
                ? "Please wait while we process last week's results..."
                : "Please wait while we process yesterday's results..."
              : "Please wait while we load today's slate..."
          }
        />
      ) : (
        <>
          {specials.length > 0 && <Specials players={specials} />}
          <WeeklySlate
            matchups={weeklySlate}
            isDiscountsAvailable={specials.length > 0}
            setCurrentMatchup={setCurrentMatchup}
          />
        </>
      )}
    </div>
  );
}
