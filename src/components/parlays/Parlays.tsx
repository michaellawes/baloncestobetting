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
  const [filteredParlays, setFilteredParlays] = React.useState<
    SupabaseParlay[]
  >([]);
  const [liveTeamData, setLiveTeamData] = React.useState<
    Map<string, Map<string, string>>
  >(new Map<string, Map<string, string>>());
  const [hasNoParlays, setHasNoParlays] = React.useState(false);
  const [currentFilter, setCurrentFilter] = React.useState("ACTIVE");

  const dispatch = useContext(TasksDispatchContext);

  const selectFilter = (filterName: string) => {
    if (currentFilter === filterName) {
      setCurrentFilter("ALL");
      setFilteredParlays(parlays);
    } else if (filterName === "ALL") {
      setCurrentFilter("ALL");
      setFilteredParlays(parlays);
    } else if (filterName === "ACTIVE") {
      setFilteredParlays(parlays.filter((parlay) => parlay.is_active));
      setCurrentFilter(filterName);
    } else if (filterName === "COMPLETED") {
      setFilteredParlays(parlays.filter((parlay) => !parlay.is_active));
      setCurrentFilter(filterName);
    } else if (filterName === "WON") {
      setFilteredParlays(
        parlays.filter((parlay) => !parlay.is_active && parlay.is_winner),
      );
      setCurrentFilter(filterName);
    } else if (filterName === "LOST") {
      setFilteredParlays(
        parlays.filter((parlay) => !parlay.is_active && !parlay.is_winner),
      );
      setCurrentFilter(filterName);
    }
  };

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
        setFilteredParlays(validatedSlips.filter((parlay) => parlay.is_active));
        if (validatedSlips.length === 0) {
          setHasNoParlays(true);
        }
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
      {hasNoParlays && matchup > 0 && (
        <ErrorLander
          message={"No parlays found. Visit the homepage to place some!"}
        />
      )}
      {matchup < 0 && (
        <ErrorLander message="Please return to the homepage and refresh..." />
      )}
      <div className="w-full h-full scrollbar-hide mt-18 text-white">
        {parlays.length > 0 && (
          <div className="w-full h-full flex flex-row justify-start p-2 mb-1 mt-2 border-b-blue-500 border-b-2 rounded-b-md">
            <div className="w-1/5 h-full flex flex-row justify-center items-center">
              <div
                className={
                  currentFilter === "ALL"
                    ? "cursor-pointer w-full h-full flex flex-row justify-center my-1 items-center rounded-md bg-blue-500"
                    : "cursor-pointer hover:bg-gray-800 w-full h-full flex flex-row justify-center my-1 items-center rounded-md"
                }
              >
                <button
                  onClick={() => selectFilter("ALL")}
                  className={`switch ${
                    currentFilter === "ALL"
                      ? 'h-full w-full m-1 py-1 basis-0 grow justify-center items-center bg-blue-500 flex-col flex box-border overflow-hidden rounded-md relative"'
                      : "h-full w-full m-1 py-1 bg-transparent basis-0 grow border border-transparent justify-center items-center flex-col flex box-border overflow-hidden rounded-sm relative"
                  }`}
                >
                  <span
                    className={`switch ${
                      currentFilter === "ALL"
                        ? "tracking-[.5px] leading-none opacity-[1] text-gray-300 text-sm md:text-base font-[ProximaNova-Bold, serif] font-bold"
                        : "tracking-[.5px] leading-none opacity-[1] text-blue-500 text-sm md:text-base font-[ProximaNova-Bold, serif]"
                    }`}
                  >
                    All
                  </span>
                </button>
              </div>
            </div>
            <div className="w-1/5 h-full flex flex-row justify-center items-center">
              <div
                className={
                  currentFilter === "ACTIVE"
                    ? "cursor-pointer w-full h-full flex flex-row justify-center my-1 items-center rounded-md bg-blue-500"
                    : "hover:bg-gray-800 cursor-pointer w-full h-full flex flex-row justify-center my-1 items-center rounded-md"
                }
              >
                <button
                  onClick={() => selectFilter("ACTIVE")}
                  className={`switch ${
                    currentFilter === "ACTIVE"
                      ? 'w-full h-full m-1 py-1 basis-0 grow justify-center items-center bg-blue-500 flex-col flex box-border overflow-hidden rounded-md relative"'
                      : "w-full h-full m-1 py-1 bg-transparent basis-0 grow border border-transparent justify-center items-center flex-col flex box-border overflow-hidden rounded-sm relative"
                  }`}
                >
                  <span
                    className={`switch ${
                      currentFilter === "ACTIVE"
                        ? "tracking-[.5px] leading-none opacity-[1] text-gray-300 text-sm md:text-base font-[ProximaNova-Bold, serif] font-bold"
                        : "tracking-[.5px] leading-none opacity-[1] text-blue-500 text-sm md:text-base font-[ProximaNova-Bold, serif]"
                    }`}
                  >
                    Active
                  </span>
                </button>
              </div>
            </div>
            <div className="w-1/5 h-full flex flex-row justify-center items-center">
              <div
                className={
                  currentFilter === "COMPLETED"
                    ? "cursor-pointer w-full h-full flex flex-row justify-center my-1 items-center rounded-md bg-blue-500"
                    : "cursor-pointer hover:bg-gray-800 w-full h-full flex flex-row justify-center my-1 items-center rounded-md"
                }
              >
                <button
                  onClick={() => selectFilter("COMPLETED")}
                  className={`switch ${
                    currentFilter === "COMPLETED"
                      ? 'w-full h-full m-1 py-1 basis-0 grow justify-center items-center bg-blue-500 flex-col flex box-border overflow-hidden rounded-md relative"'
                      : "w-full h-full m-1 py-1 bg-transparent basis-0 grow border border-transparent justify-center items-center flex-col flex box-border overflow-hidden rounded-sm relative"
                  }`}
                >
                  <span
                    className={`switch ${
                      currentFilter === "COMPLETED"
                        ? "tracking-[.5px] leading-none opacity-[1] text-gray-300 text-sm md:text-base font-[ProximaNova-Bold, serif] font-bold"
                        : "tracking-[.5px] leading-none opacity-[1] text-blue-500 text-sm md:text-base font-[ProximaNova-Bold, serif]"
                    }`}
                  >
                    {window.innerWidth < 469 ? "Done" : "Completed"}
                  </span>
                </button>
              </div>
            </div>
            <div className="w-1/5 h-full flex flex-row justify-center items-center">
              <div
                className={
                  currentFilter === "WON"
                    ? "cursor-pointer w-full h-full flex flex-row justify-center my-1 items-center rounded-md bg-blue-500"
                    : "cursor-pointer hover:bg-gray-800 w-full h-full flex flex-row justify-center my-1 items-center rounded-md"
                }
              >
                <button
                  onClick={() => selectFilter("WON")}
                  className={`switch ${
                    currentFilter === "WON"
                      ? 'w-full h-full m-1 py-1 basis-0 grow justify-center items-center bg-blue-500 flex-col flex box-border overflow-hidden rounded-md relative"'
                      : "w-full h-full m-1 py-1 bg-transparent basis-0 grow border border-transparent justify-center items-center flex-col flex box-border overflow-hidden rounded-sm relative"
                  }`}
                >
                  <span
                    className={`switch ${
                      currentFilter === "WON"
                        ? "tracking-[.5px] leading-none opacity-[1] text-gray-300 text-sm md:text-base font-[ProximaNova-Bold, serif] font-bold"
                        : "tracking-[.5px] leading-none opacity-[1] text-blue-500 text-sm md:text-base font-[ProximaNova-Bold, serif]"
                    }`}
                  >
                    Won
                  </span>
                </button>
              </div>
            </div>
            <div className="w-1/5 h-full flex flex-row justify-center items-center">
              <div
                className={
                  currentFilter === "LOST"
                    ? " cursor-pointer w-full h-full flex flex-row justify-center my-1 items-center rounded-md bg-blue-500"
                    : " cursor-pointer hover:bg-gray-800 w-full h-full flex flex-row justify-center my-1 items-center rounded-md"
                }
              >
                <button
                  onClick={() => selectFilter("LOST")}
                  className={`switch ${
                    currentFilter === "LOST"
                      ? 'w-full h-full m-1 py-1 basis-0 grow justify-center bg-blue-500 items-center flex-col flex box-border overflow-hidden rounded-md relative"'
                      : "w-full h-full m-1 py-1 bg-transparent basis-0 grow border border-transparent justify-center items-center flex-col flex box-border overflow-hidden rounded-sm relative"
                  }`}
                >
                  <span
                    className={`switch ${
                      currentFilter === "LOST"
                        ? "tracking-[.5px] leading-none opacity-[1] text-gray-300 text-sm md:text-base font-[ProximaNova-Bold, serif] font-bold"
                        : "tracking-[.5px] leading-none opacity-[1] text-blue-500 text-sm md:text-base font-[ProximaNova-Bold, serif]"
                    }`}
                  >
                    Lost
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
        {filteredParlays.length === 0 && parlays.length > 0 && (
          <ErrorLander message={"No parlays match this filter."} />
        )}
        <div className="w-full h-full scrollbar-hide mx-1">
          <ul className="w-full h-full scrollbar-hide">
            {filteredParlays.map((parlay, i) => (
              <li key={i} className="scrollbar-hide pr-2">
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
      </div>
    </div>
  );
}
