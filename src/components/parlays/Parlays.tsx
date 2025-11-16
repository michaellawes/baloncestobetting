import { Parlay, SupabaseParlay } from "./Parlay";
import * as React from "react";
import { useContext, useEffect } from "react";
import supabase from "../../config/supabaseConfig";
import { ParlayFieldUpdate, UserData } from "../../App";
import { evaluateLeg, MatchupSchema } from "../../utils/Util";
import { TasksDispatchContext } from "../reducer/TasksContext";

export interface ParlaysViewerProps {
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  user: UserData;
  setParlayFieldUpdate: React.Dispatch<React.SetStateAction<ParlayFieldUpdate>>;
  setIsViewingDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  matchups: MatchupSchema[];
}
export function Parlays(props: ParlaysViewerProps) {
  const {
    setBalance,
    setParlayFieldUpdate,
    user,
    setIsViewingDashboard,
    matchups,
  } = props;
  const [parlays, setParlays] = React.useState<SupabaseParlay[]>([]);
  const [liveTeamData, setLiveTeamData] = React.useState<Map<string, number>>(
    new Map<string, number>(),
  );

  const getTeamData = (live_matchups: MatchupSchema[]) => {
    const teamData = new Map<string, number>();
    for (const matchup of live_matchups) {
      teamData.set(matchup.road.name, matchup.road.live_score);
      teamData.set(matchup.home.name, matchup.home.live_score);
    }
    return teamData;
  };

  useEffect(() => {
    setIsViewingDashboard(false);
    const processedTeamData = getTeamData(matchups);
    setLiveTeamData(processedTeamData);
  }, []);

  const validateFinishedSlips = async (data: SupabaseParlay[]) => {
    const newlyExpiredParlays: SupabaseParlay[] = [];
    const expiredParlays: SupabaseParlay[] = [];

    for (const parlay of data) {
      parlay.frontend_is_active =
        new Date(parlay.expires_at).getTime() > Date.now();
      if (!parlay.frontend_is_active && !parlay.is_payed_out) {
        newlyExpiredParlays.push(parlay);
      } else {
        expiredParlays.push(parlay);
      }
    }

    const processedData = expiredParlays;

    if (newlyExpiredParlays.length > 0) {
      for (const parlay of newlyExpiredParlays) {
        const processedParlay = await validateResultOfFinishedSlips(parlay);
        processedData.push(processedParlay);
      }
    }

    return processedData.sort((a, b) => b.created_at - a.created_at);
  };

  const dispatch = useContext(TasksDispatchContext);

  const validateResultOfFinishedSlips = async (parlay: SupabaseParlay) => {
    const matchup_id = Number(parlay.matchup_id);
    const query_ids = parlay.legs.map((leg) => {
      return leg.team + "-" + leg.betType;
    });

    const { data, error } = await supabase
      .from("legs")
      .select("*")
      .eq("matchup_id", matchup_id)
      .in("id", query_ids);

    if (error) {
      console.log(error);
    }

    if (data) {
      const legDictionary = Object.assign(
        {},
        ...data.map((x) => ({ [x.id]: x.point_value })),
      );
      const slipHit = parlay.legs.every((leg) =>
        evaluateLeg(leg, legDictionary[leg.team + "-" + leg.betType]),
      );

      const updateSlip = async () => {
        parlay["is_payed_out"] = true;
        parlay["is_winner"] = slipHit;
        if (slipHit) {
          setBalance((prev) => prev + parseFloat(parlay.payout.toFixed(2)));
          dispatch({
            type: "acceptPayout",
          });
        }
        setParlayFieldUpdate({
          user_id: parlay.user_id,
          parlay_id: parlay.parlay_id,
          parlay_modification_type: "validateSlip",
          parlay: parlay,
        });
        dispatch({
          type: "parlayFieldUpdate",
        });
        return parlay;
      };
      return await updateSlip();
    }
  };

  useEffect(() => {
    const getParlays = async () => {
      const { data, error } = await supabase
        .from("parlays")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
      }

      if (data) {
        const validatedSlips = await validateFinishedSlips(data);
        setParlays(validatedSlips);
      }
    };
    getParlays();
  }, []);

  return (
    <div className="w-full h-screen bg-gray-900 overflow-hidden scrollbar-hide ">
      <ul className="w-full h-full scrollbar-hide mt-18 ml-1">
        {parlays.map((parlay, i) => (
          <li key={i} className="scrollbar-hide mr-1 pr-1">
            <Parlay
              {...parlay}
              setBalance={setBalance}
              liveTeamData={liveTeamData}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
