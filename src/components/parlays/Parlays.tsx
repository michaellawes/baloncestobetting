import { Parlay, SupabaseParlay } from "./Parlay";
import * as React from "react";
import { useContext, useEffect } from "react";
import supabase from "../../config/supabaseConfig";
import {
  evaluateLeg,
  getIndividualLegResultForParlays,
  getTeamData,
} from "../../utils/Util";
import { TasksDispatchContext } from "../reducer/TasksContext";
import { ErrorLander } from "../dashboard/ErrorLander";
import {
  MatchupSchema,
  NotificationMetadata,
  ParlayFieldUpdate,
  UserData,
} from "../../utils/Interfaces";
import { propField } from "../../utils/Constants";

export interface ParlaysViewerProps {
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  user: UserData;
  setParlayFieldUpdate: React.Dispatch<React.SetStateAction<ParlayFieldUpdate>>;
  setIsViewingDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  setIsViewingMatchup: React.Dispatch<React.SetStateAction<boolean>>;
  matchups: MatchupSchema[];
  setNotification: React.Dispatch<React.SetStateAction<NotificationMetadata>>;
}
export function Parlays(props: ParlaysViewerProps) {
  const {
    setBalance,
    setParlayFieldUpdate,
    user,
    setIsViewingDashboard,
    matchups,
    setIsViewingMatchup,
    setNotification,
  } = props;
  const [parlays, setParlays] = React.useState<SupabaseParlay[]>([]);
  const [liveTeamData, setLiveTeamData] = React.useState<
    Map<string, Map<string, string>>
  >(new Map<string, Map<string, string>>());

  const dispatch = useContext(TasksDispatchContext);

  const validateFinishedSlips = async (data: SupabaseParlay[]) => {
    const newlyExpiredParlays: SupabaseParlay[] = [];
    const activeSlips: SupabaseParlay[] = [];
    const expiredParlays: SupabaseParlay[] = [];

    for (const parlay of data) {
      const startOfExpirationDate = new Date(parlay.expires_at);
      startOfExpirationDate.setHours(0, 0, 0, 0);
      parlay.frontend_is_active =
        Date.now() < Date.parse(startOfExpirationDate.toISOString());
      if (!parlay.frontend_is_active && !parlay.is_payed_out) {
        newlyExpiredParlays.push(parlay);
      } else if (!parlay.frontend_is_active && parlay.is_payed_out) {
        expiredParlays.push(parlay);
      } else {
        activeSlips.push(parlay);
      }
    }

    const processedData: SupabaseParlay[] = activeSlips;

    if (expiredParlays.length > 0) {
      for (const parlay of expiredParlays) {
        const processedParlay = await getIndividualLegResultForParlays(parlay);
        processedData.push(processedParlay);
      }
    }

    if (newlyExpiredParlays.length > 0) {
      for (const parlay of newlyExpiredParlays) {
        const processedParlay = await validateResultOfFinishedSlips(parlay);
        processedData.push(processedParlay);
      }
    }

    return processedData.sort((a, b) => b.created_at - a.created_at);
  };

  const validateResultOfFinishedSlips = async (parlay: SupabaseParlay) => {
    const matchup_id = Number(parlay.matchup_id);
    const query_ids = parlay.legs.map((leg) => {
      if (leg.betType !== propField[4]) {
        return leg.team + "/" + leg.betType;
      } else {
        return leg.frontend_id.split("/")[0] + "/" + leg.betType;
      }
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

      for (const leg of parlay.legs) {
        leg.didHit = evaluateLeg(
          leg,
          legDictionary[leg.team + "/" + leg.betType],
        );
      }

      const slipHit = parlay.legs.every((leg) => leg.didHit);

      const updateSlip = async () => {
        parlay["is_payed_out"] = true;
        parlay["is_winner"] = slipHit;
        setParlayFieldUpdate({
          user_id: parlay.user_id,
          parlay_id: parlay.parlay_id,
          parlay_modification_type: "validateSlip",
          parlay: parlay,
          payout: parlay.payout,
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
    setIsViewingDashboard(false);
    setIsViewingMatchup(false);
    const processedTeamData = getTeamData(matchups);
    setLiveTeamData(processedTeamData);
    const getParlays = async () => {
      let userId = "";
      if (user) {
        userId = user.id;
      }
      const { data, error } = await supabase
        .from("parlays")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error || userId === "") {
        console.log("Could not retrieve parlay data", error);
      }

      if (data) {
        const validatedSlips = await validateFinishedSlips(data);
        setParlays(validatedSlips);
      }
    };
    getParlays();
  }, []);

  if (!user) return <ErrorLander />;

  return (
    <div className="w-full h-full bg-gray-900 overflow-hidden scrollbar-hide ">
      <ul className="w-full h-full scrollbar-hide mt-18 ml-1">
        {parlays.map((parlay, i) => (
          <li key={i} className="scrollbar-hide mr-1 pr-1">
            <Parlay
              {...parlay}
              setBalance={setBalance}
              liveTeamData={liveTeamData}
              setNotification={setNotification}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
