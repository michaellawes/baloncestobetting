import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
import {
  faDownload,
  fas,
  faShare,
  faSquareCheck,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import { ParlayTask } from "../../App";
import html2canvas from "html2canvas-pro";
import { downloadImage } from "../../utils/exportAsImage";
import {
  evaluateLeg,
  getParlayType,
  getPropTextWithRespectToScreenSize,
  numberWithCommas,
  progressBarWidth,
  propField,
  round5,
} from "../../utils/Util";

library.add(fas);

export interface SupabaseParlay {
  frontend_id?: string;
  user_id: string;
  created_at: number;
  expires_at: number;
  parlay_id: string;
  matchup_id: number;
  total_odds: number;
  payout: number;
  wager: number;
  is_winner: boolean;
  is_payed_out: boolean;
  frontend_is_active: boolean;
  legs: ParlayTask[];
}

export interface ParlayProps extends SupabaseParlay {
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  liveTeamData: Map<string, Map<string, string>>;
}

export function Parlay(props: ParlayProps) {
  const {
    parlay_id,
    created_at,
    frontend_is_active,
    matchup_id,
    legs,
    total_odds,
    payout,
    wager,
    is_winner,
    liveTeamData,
  } = props;

  const getProgressBarWidth = (leg: ParlayTask) => {
    if (leg.betType === propField[1]) {
      const teams = leg.frontend_id.split("/")[0].split(" v ");
      const roadTeamName = teams[0];
      const liveTotalPointsScored = parseFloat(
        parseFloat(liveTeamData.get(roadTeamName).get("live_points")).toFixed(),
      );
      const propTotalPointsScored = parseFloat(getPropValue(leg.text));
      let propTotalPointsScoredFull = parseFloat(
        (propTotalPointsScored * 1.2).toFixed(2),
      );
      if (liveTotalPointsScored >= propTotalPointsScored) {
        propTotalPointsScoredFull = liveTotalPointsScored;
      }
      const percentFull = parseFloat(
        ((liveTotalPointsScored / propTotalPointsScoredFull) * 100).toFixed(),
      );
      if (percentFull <= 80) {
        const styling = round5(percentFull).toString();
        return progressBarWidth.get(styling);
      }
    } else if (leg.betType === propField[3]) {
      const team = leg.team;
      const liveTeamScore = parseFloat(
        parseFloat(liveTeamData.get(team).get("live_score")).toFixed(),
      );
      const propTeamScore = parseFloat(getPropValue(leg.text));
      let propTeamScoreFull = parseFloat((propTeamScore * 1.2).toFixed(2));
      if (liveTeamScore >= propTeamScore) {
        propTeamScoreFull = liveTeamScore;
      }
      const percentFull = parseFloat(
        ((liveTeamScore / propTeamScoreFull) * 100).toFixed(),
      );
      if (percentFull <= 80) {
        const styling = round5(percentFull).toString();
        return progressBarWidth.get(styling);
      }
    } else if (leg.betType === propField[4]) {
      const team = leg.team;
      const playerName = leg.frontend_id.split("/")[0];
      const liveTeamScore = parseFloat(
        parseFloat(liveTeamData.get(team).get(`${playerName}_score`)).toFixed(),
      );
      const propTeamScore = parseFloat(getPropValue(leg.text));
      let propTeamScoreFull = parseFloat((propTeamScore * 1.2).toFixed(2));
      if (liveTeamScore >= propTeamScore) {
        propTeamScoreFull = liveTeamScore;
      }
      const percentFull = parseFloat(
        ((liveTeamScore / propTeamScoreFull) * 100).toFixed(),
      );
      if (percentFull <= 80) {
        const styling = round5(percentFull).toString();
        return progressBarWidth.get(styling);
      }
    }
    return "h-[4px] z-50 bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-full";
  };

  const getStandardTime = (hours: number, minutes: number) => {
    let timeValue;

    if (hours > 0 && hours <= 12) {
      timeValue = "" + hours;
    } else if (hours > 12) {
      timeValue = "" + (hours - 12);
    } else if (hours == 0) {
      timeValue = "12";
    }
    timeValue += minutes < 10 ? ":0" + minutes : ":" + minutes;
    timeValue += hours >= 12 ? "PM" : "AM";

    return timeValue;
  };

  const getReadableDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return (
      d.getMonth() +
      1 +
      "/" +
      d.getDate() +
      "/" +
      d.getFullYear() +
      " " +
      getStandardTime(d.getHours(), d.getMinutes())
    );
  };

  const handleShareSlip = (legs: ParlayTask[]) => {
    const payload = { matchup_id: matchup_id, legs: legs };
    navigator.clipboard.writeText(JSON.stringify(payload));
  };

  const handleCaptureClick = async () => {
    const parlayElement = document.getElementById(parlay_id);
    if (!parlayElement) return;

    const userAgent = navigator.userAgent;
    const canvas = await html2canvas(parlayElement);
    if (userAgent.search("Firefox") >= 0) {
      const dataURL = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      downloadImage(
        dataURL,
        `parlay-${parlay_id.substring(parlay_id.length - 5)}.png`,
      );
    } else {
      const dataURL = canvas.toDataURL("image/png");
      downloadImage(
        dataURL,
        `parlay-${parlay_id.substring(parlay_id.length - 5)}.png`,
      );
    }
  };

  const getLiveValue = (leg: ParlayTask) => {
    if (leg.betType === propField[1]) {
      const teams = leg.frontend_id.split("/")[0].split(" v ");
      const roadTeamName = teams[0];
      return parseFloat(
        liveTeamData.get(roadTeamName).get("live_points"),
      ).toFixed();
    } else if (leg.betType === propField[0]) {
      return parseFloat(
        liveTeamData.get(leg.team).get("live_points"),
      ).toFixed();
    } else if (leg.betType === propField[3]) {
      return parseFloat(liveTeamData.get(leg.team).get("live_score")).toFixed();
    } else if (leg.betType === propField[4]) {
      const playerName = leg.frontend_id.split("/")[0];
      return parseFloat(
        liveTeamData.get(leg.team).get(`${playerName}_score`),
      ).toFixed();
    }
  };

  const getPropValue = (text: string) => {
    return text.substring(2);
  };

  const getOverUnderStyling = (text: string) => {
    if (text.startsWith("O")) {
      return "h-[4px] bg-green-400 basis-0 grow flex-rowbox-border rounded-md relative w-full";
    }
    return "h-[4px] bg-red-400 basis-0 grow flex-rowbox-border rounded-md relative w-full";
  };

  const getLiveSpreadUpdateStyle = (leg: ParlayTask) => {
    const live_spread_text: string = liveTeamData
      .get(leg.team)
      .get("live_spread");
    if (live_spread_text === "0.0") {
      return "text-sm text-yellow-400 font-light";
    }
    const live_spread = parseFloat(live_spread_text);
    if (evaluateLeg(leg, live_spread)) {
      return "text-sm text-green-500 font-light";
    } else {
      return "text-sm text-red-500 font-light";
    }
  };

  const getLiveSpreadUpdate = (leg: ParlayTask) => {
    const live_spread: string = liveTeamData.get(leg.team).get("live_spread");
    if (live_spread === "0.0") {
      return "TIE";
    }
    if (parseFloat(live_spread) > 0) {
      return `${leg.team} +${live_spread}`;
    }
    return `${leg.team} ${live_spread}`;
  };

  const getLiveMoneylineUpdateStyle = (leg: ParlayTask) => {
    const live_moneyline: string = liveTeamData
      .get(leg.team)
      .get("live_moneyline");
    if (live_moneyline === "TIE") {
      return "text-sm text-yellow-400 font-light";
    }
    if (leg.team === live_moneyline) {
      return "text-sm text-green-500 font-light";
    } else {
      return "text-sm text-red-500 font-light";
    }
  };

  const getLiveMoneylineUpdate = (leg: ParlayTask) => {
    return liveTeamData.get(leg.team).get("live_moneyline");
  };

  const getParlayLegStyling = (frontend_is_active: boolean) => {
    if (frontend_is_active) {
      return "flex mb-2 max-h-110 overflow-y-scroll scrollbar-hide w-full flex-col bg-gray-900";
    } else {
      return "flex mb-2 max-h-64 overflow-y-scroll scrollbar-hide w-full flex-col bg-gray-900";
    }
  };

  return (
    <div
      className="w-full mb-2 border-l-3 border-l-gray-500 border-t-gray-500  border-r-gray-600 float-left rounded-sm bg-gray-900 border-t-1 border-r-1"
      id={parlay_id}
    >
      <div className="p-4 flex flex-row w-full items-center justify-between border-b-1 border-b-gray-500">
        <span className="text-blue-500 text-base flex w-6/8 font-bold">
          {legs.length} leg {getParlayType(legs.length)}
        </span>
        <span className="text-white text-sm w-1/8 justify-end flex font-bold">
          {total_odds > 0 && "+"}
          {total_odds}
        </span>
        {!frontend_is_active && is_winner && (
          <div className="text-green-600 z-40 w-1/8 justify-end flex">
            <FontAwesomeIcon icon={faSquareCheck as IconProp} />
          </div>
        )}
        {!frontend_is_active && !is_winner && (
          <div className="text-red-600 text-base w-1/8 justify-end flex">
            <FontAwesomeIcon icon={faSquareXmark as IconProp} />
          </div>
        )}
      </div>
      <div className={getParlayLegStyling(frontend_is_active)}>
        {legs.map((leg, index) => (
          <div
            key={leg.frontend_id}
            className="flex flex-col grow items-stretch w-full"
          >
            <div className="flex flew-row grow items-stretch w-full">
              <div
                className={
                  index > 0
                    ? "pt-1 h-auto mt-2 mb-1 border-t border-t-gray-700 flex flex-row w-full"
                    : "pt-1 h-auto mb-1 flex flex-row w-full"
                }
              >
                <div className="flex flex-col grow items-stretch pl-5 justify-start w-7/8">
                  <span className="block relative text-white text-sm">
                    {getPropTextWithRespectToScreenSize(leg, window.innerWidth)}
                  </span>
                  <span className="flex relative text-gray-400 text-xs">
                    {leg.betType}
                  </span>
                </div>
                <div className="flex flex-row justify-end w-1/8 text-right pr-5">
                  <span className="text-gray-300">
                    {leg.odds > 0 && "+"}
                    {leg.odds}
                  </span>
                </div>
              </div>
            </div>
            {frontend_is_active && leg.betType === propField[0] && (
              <div className="flex flex-row w-full grow items-center justify-start h-auto m1-2 px-5">
                <span className={getLiveSpreadUpdateStyle(leg)}>
                  {getLiveSpreadUpdate(leg)}
                </span>
              </div>
            )}
            {frontend_is_active && leg.betType === propField[1] && (
              <div className="flex w-full pb-4 flex-row grow justify-start h-auto items-center px-3 my-2">
                {leg.betType === propField[1] && (
                  <>
                    <div className="flex basis-0 grow flex-rowbox-border rounded-md relative w-full pl-2">
                      <div className={getOverUnderStyling(leg.text)}>
                        <div
                          id={leg.frontend_id}
                          className={getProgressBarWidth(leg)}
                        >
                          <div className="h-[4px] flex justify-end items-center ">
                            <span className="bg-gray-900 text-white text-xs px-2 rounded-md border border-gray-400">
                              {getLiveValue(leg)}
                            </span>
                          </div>
                        </div>
                        <div className="h-[4px] z-8 bg-gray-400 mt-[-4px] border-r-gray-900 border-r-6 basis-0 grow justify-end text-end flex-rowbox-border rounded-l-md relative w-75/100"></div>
                        <div className="w-75/100 flex justify-end ml-4 mt-1">
                          <span className="flex text-white text-end h-[4px] font-light text-xs">
                            {getPropValue(leg.text)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            {frontend_is_active && leg.betType === propField[2] && (
              <div className="flex flex-row w-full grow items-center justify-start h-auto m1-2 px-5">
                <span className={getLiveMoneylineUpdateStyle(leg)}>
                  {getLiveMoneylineUpdate(leg)}
                </span>
              </div>
            )}
            {frontend_is_active && leg.betType === propField[3] && (
              <div className="flex w-full pb-4 flex-row grow justify-start h-auto items-center px-3 my-2">
                {leg.betType === propField[3] && (
                  <>
                    <div className="flex basis-0 grow flex-rowbox-border rounded-md relative w-full pl-2">
                      <div className={getOverUnderStyling(leg.text)}>
                        <div
                          id={leg.frontend_id}
                          className={getProgressBarWidth(leg)}
                        >
                          <div className="h-[4px] flex justify-end items-center ">
                            <span className="bg-gray-900 text-white text-xs px-2 rounded-md border border-gray-400">
                              {getLiveValue(leg)}
                            </span>
                          </div>
                        </div>
                        <div className="h-[4px] z-8 bg-gray-400 mt-[-4px] border-r-gray-900 border-r-6 basis-0 grow justify-end text-end flex-rowbox-border rounded-l-md relative w-75/100"></div>
                        <div className="w-75/100 flex justify-end ml-4 mt-1">
                          <span className="flex text-white text-end h-[4px] font-light text-xs">
                            {getPropValue(leg.text)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            {frontend_is_active && leg.betType === propField[4] && (
              <div className="flex w-full pb-4 flex-row grow justify-start h-auto items-center px-3 my-2">
                {leg.betType === propField[4] && (
                  <>
                    <div className="flex basis-0 grow flex-rowbox-border rounded-md relative w-full pl-2">
                      <div className={getOverUnderStyling(leg.text)}>
                        <div
                          id={leg.frontend_id}
                          className={getProgressBarWidth(leg)}
                        >
                          <div className="h-[4px] flex justify-end items-center ">
                            <span className="bg-gray-900 text-white text-xs px-2 rounded-md border border-gray-400">
                              {getLiveValue(leg)}
                            </span>
                          </div>
                        </div>
                        <div className="h-[4px] z-8 bg-gray-400 mt-[-4px] border-r-gray-900 border-r-6 basis-0 grow rounded-l-md justify-end text-end flex-rowbox-border relative w-75/100"></div>
                        <div className="w-75/100 flex justify-end ml-4 mt-1">
                          <span className="flex text-white text-end h-[4px] font-light text-xs">
                            {getPropValue(leg.text)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="border-t-1 flex flex-col w-full items-center justify-between border-b-1 rounded-b-sm bg-gray-800 border-gray-700">
        <div className="flex flex-row text-left pl-2 border-b-1 border-b-gray-700 w-full pb-1">
          <div
            className={
              frontend_is_active
                ? "flex flex-row w-14/16"
                : "flex flex-row w-15/16"
            }
          >
            <div className="flex flex-col basis-0 grow justify-center items-stretch box-border relative pl-2">
              <span className="font-[Proxima Nova, serif] tracking-[1px] uppercase text-gray-300 text-base text-left relative">
                ${wager}
              </span>
              <span className="font-mono flex flex-row tracking-[1px] uppercase text-gray-300 text-xs text-[7px] relative">
                total wager
              </span>
            </div>
            <div className="flex flex-row justify-end items-center box-border relative mt-1">
              <span
                className={
                  is_winner
                    ? "text-green-500 text-sm font-bold font-[Proxima Nova, serif]"
                    : frontend_is_active
                      ? "text-gray-300 text-sm font-bold font-[Proxima Nova, serif]"
                      : "text-gray-500 text-sm font-bold font-[Proxima Nova, serif]"
                }
              >
                ${numberWithCommas(parseFloat(payout.toFixed(2)))}
              </span>
            </div>
          </div>
          {frontend_is_active && (
            <div className="flex flex-row w-1/16 m-1 mt-2 justify-end">
              <button
                className="pl-1 pr-1 block text-white text-sm hover:bg-gray-700 border border-transparent rounded-4xl justify-end"
                onClick={() => handleShareSlip(legs)}
              >
                <FontAwesomeIcon icon={faShare as IconProp} />
              </button>
            </div>
          )}

          <div className="flex flex-row w-1/16 m-1 mt-2 justify-end">
            <button
              className="pl-1 pr-1 block text-white text-sm hover:bg-gray-700 border border-transparent rounded-4xl justify-end"
              onClick={() => handleCaptureClick()}
            >
              <FontAwesomeIcon icon={faDownload as IconProp} />
            </button>
          </div>
        </div>
        <div className="w-full flex row shadow-sm rounded-xs bg-gray-800 ">
          <div className="pl-2 flex w-1/2 items-center justify-start box-border relative font-mono">
            <span className="text-gray-400 text-[8px]">
              <span className="uppercase text-gray-400 text-[8px]">
                bet id:{" "}
              </span>
              {parlay_id.substring(parlay_id.length - 5)}
            </span>
          </div>
          <div className="pr-2 flex w-1/2 flex-row items-center justify-end box-border relative">
            <span className="text-gray-400 text-[8px] float-left font-light uppercase font-mono">
              placed: {getReadableDate(created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
