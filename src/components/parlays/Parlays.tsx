import { Parlay, SupabaseParlay } from "./Parlay";
import * as React from "react";
import { useContext, useEffect } from "react";
import supabase from "../../config/supabaseConfig";
import { ParlayFieldUpdate, UserData } from "../../App";
import { evaluateLeg } from "../../utils/Util";
import { TasksDispatchContext } from "../reducer/TasksContext";

export interface ParlaysViewerProps {
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  user: UserData;
  setParlayFieldUpdate: React.Dispatch<React.SetStateAction<ParlayFieldUpdate>>;
  setIsViewingDashboard: React.Dispatch<React.SetStateAction<boolean>>;
}
export function Parlays(props: ParlaysViewerProps) {
  const { setBalance, setParlayFieldUpdate, user, setIsViewingDashboard } =
    props;
  const [parlays, setParlays] = React.useState<SupabaseParlay[]>([]);

  useEffect(() => {
    setIsViewingDashboard(false);
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
    <div className="w-full h-full bg-gray-900 overflow-hidden scrollbar-hide ">
      <ul className="w-full h-full scrollbar-hide mt-16 ml-2 mr-10 border-r-4 border-r-gray-200">
        {parlays.map((parlay, i) => (
          <li key={i} className="scrollbar-hide mr-3">
            <Parlay {...parlay} setBalance={setBalance} />
          </li>
        ))}
      </ul>
    </div>
  );
}
