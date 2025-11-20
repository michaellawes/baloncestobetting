import { Parlay, SupabaseParlay } from "./Parlay";
import * as React from "react";
import { useContext, useEffect } from "react";
import supabase from "../../config/supabaseConfig";
import { ParlayFieldUpdate, UserData } from "../../App";
import { evaluateLeg, MatchupSchema, propField } from "../../utils/Util";
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
  const [liveTeamData, setLiveTeamData] = React.useState<
    Map<string, Map<string, string>>
  >(new Map<string, Map<string, string>>());
  const [dataLoaded, setDataLoaded] = React.useState(true);

  const getTeamData = (live_matchups: MatchupSchema[]) => {
    const teamData = new Map<string, Map<string, string>>();
    for (const matchup of live_matchups) {
      teamData.set(
        matchup.road.name,
        new Map<string, string>([
          ["live_score", matchup.road.live_score.toString()],
          ["live_spread", matchup.road.spread.live_value],
          ["live_points", matchup.road.points.live_value],
          ["live_moneyline", matchup.road.moneyline.live_value],
          [
            `${matchup.road.top_5[0].name}_score`,
            matchup.road.top_5[0].live_total.toString(),
          ],
          [
            `${matchup.road.top_5[1].name}_score`,
            matchup.road.top_5[1].live_total.toString(),
          ],
          [
            `${matchup.road.top_5[2].name}_score`,
            matchup.road.top_5[2].live_total.toString(),
          ],
          [
            `${matchup.road.top_5[3].name}_score`,
            matchup.road.top_5[3].live_total.toString(),
          ],
          [
            `${matchup.road.top_5[4].name}_score`,
            matchup.road.top_5[4].live_total.toString(),
          ],
        ]),
      );
      teamData.set(
        matchup.home.name,
        new Map<string, string>([
          ["live_score", matchup.home.live_score.toString()],
          ["live_spread", matchup.home.spread.live_value],
          ["live_points", matchup.home.points.live_value],
          ["live_moneyline", matchup.home.moneyline.live_value],
          [
            `${matchup.home.top_5[0].name}_score`,
            matchup.home.top_5[0].live_total.toString(),
          ],
          [
            `${matchup.home.top_5[1].name}_score`,
            matchup.home.top_5[1].live_total.toString(),
          ],
          [
            `${matchup.home.top_5[2].name}_score`,
            matchup.home.top_5[2].live_total.toString(),
          ],
          [
            `${matchup.home.top_5[3].name}_score`,
            matchup.home.top_5[3].live_total.toString(),
          ],
          [
            `${matchup.home.top_5[4].name}_score`,
            matchup.home.top_5[4].live_total.toString(),
          ],
        ]),
      );
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
      const startOfExpirationDate = new Date(parlay.expires_at);
      startOfExpirationDate.setHours(0, 0, 0, 0);
      parlay.frontend_is_active =
        Date.now() < Date.parse(startOfExpirationDate.toISOString());
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
      const slipHit = parlay.legs.every((leg) =>
        evaluateLeg(leg, legDictionary[leg.team + "/" + leg.betType]),
      );

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
        console.log(error);
        setDataLoaded(false);
      }

      if (data) {
        const validatedSlips = await validateFinishedSlips(data);
        setParlays(validatedSlips);
        setDataLoaded(false);
      }
    };
    getParlays();
  }, []);

  //if (!dataLoaded) return <ErrorLander />;

  return (
    <div className="w-full h-full bg-gray-900 overflow-hidden scrollbar-hide ">
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
