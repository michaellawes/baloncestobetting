import { Parlay } from "./Parlay";
import * as React from "react";
import { useContext, useEffect } from "react";
import supabase from "../../config/supabaseConfig";
import {
  getIndividualLegResultForParlays,
  getParlaysWithLegs,
  getTeamData,
} from "../../utils/Util";
import { TasksDispatchContext } from "../reducer/TasksContext";
import { ErrorLander } from "../dashboard/ErrorLander";
import { ParlaysViewerProps, SupabaseParlay } from "../../utils/Interfaces";
import { Lockout } from "../dashboard/Lockout";

export function Parlays(props: ParlaysViewerProps) {
  const {
    setBalance,
    setParlayFieldUpdate,
    user,
    setIsViewingDashboard,
    matchups,
    setIsViewingMatchup,
    setNotification,
    matchup,
  } = props;
  const [parlays, setParlays] = React.useState<SupabaseParlay[]>([]);
  const [liveTeamData, setLiveTeamData] = React.useState<
    Map<string, Map<string, string>>
  >(new Map<string, Map<string, string>>());
  const [hasNoParlays, setHasNoParlays] = React.useState(false);

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
      if (!parlay.frontend_is_active && parlay.is_active) {
        newlyExpiredParlays.push(parlay);
      } else if (!parlay.frontend_is_active && !parlay.is_active) {
        expiredParlays.push(parlay);
      } else {
        activeSlips.push(parlay);
      }
    }

    const processedData: SupabaseParlay[] = activeSlips.concat(expiredParlays);

    if (newlyExpiredParlays.length > 0) {
      for (const parlay of newlyExpiredParlays) {
        const processedParlay = await validateResultOfFinishedSlips(parlay);
        processedData.push(processedParlay);
      }
    }

    return processedData.sort((a, b) => b.created_at - a.created_at);
  };

  const validateResultOfFinishedSlips = async (parlay: SupabaseParlay) => {
    const validatedParlay = await getIndividualLegResultForParlays(parlay);
    const updateSlip = async () => {
      validatedParlay.is_active = false;
      if (validatedParlay.is_winner) {
        setBalance((prev) => prev + parseFloat(parlay.payout.toFixed(2)));
        dispatch({
          type: "acceptPayout",
        });
      }
      setParlayFieldUpdate({
        user_id: validatedParlay.user_id,
        parlay_id: validatedParlay.parlay_id,
        parlay_modification_type: "validateSlip",
        parlay: validatedParlay,
        payout: validatedParlay.payout,
      });
      dispatch({
        type: "parlayFieldUpdate",
      });
      return validatedParlay;
    };
    return await updateSlip();
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
      /*const { data, error } = await supabase
        .from("parlays")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });*/
      const { data, error } = await supabase
        .from("fb_parlays")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error || userId === "") {
        console.log("Could not retrieve parlay data", error);
      }

      if (data) {
        const parlaysWithLegs = await getParlaysWithLegs(data);
        const validatedSlips = await validateFinishedSlips(parlaysWithLegs);
        setParlays(validatedSlips);
      } else {
        setHasNoParlays(true);
      }
    };
    getParlays();
  }, []);

  if (!user)
    return (
      <ErrorLander message="Please return to the homepage and refresh..." />
    );

  return (
    <div className="w-full h-full bg-gray-900 overflow-hidden scrollbar-hide ">
      {parlays.length === 0 && matchup >= 0 && !hasNoParlays && (
        <Lockout message={"Please wait while we load your parlays..."} />
      )}
      {hasNoParlays && (
        <ErrorLander
          message={
            "No parlays found. Please return to the homepage and place some!"
          }
        />
      )}
      {matchup < 0 && (
        <ErrorLander message="Please return to the homepage and refresh..." />
      )}
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
