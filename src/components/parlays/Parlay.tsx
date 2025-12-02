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
import {
  evaluateLeg,
  exportAsImage,
  getOverUnderStyling,
  getParlayType,
  getPropTextWithRespectToScreenSize,
  getPropValue,
  getReadableDate,
  numberWithCommas,
} from "../../utils/Util";
import { progressBarWidth, propField } from "../../utils/Constants";
import { ParlayProps, ParlayTask } from "../../utils/Interfaces";

library.add(fas);

export function Parlay(props: ParlayProps) {
  const {
    parlay_id,
    created_at,
    expires_at,
    is_active,
    legs,
    total_odds,
    payout,
    wager,
    is_winner,
    liveTeamData,
    setNotification,
    livePlayerData,
  } = props;

  const getLiveValue = (leg: ParlayTask) => {
    if (
      leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] ===
      propField[1]
    ) {
      const teams = leg.frontend_id.split("/")[0].split(" v ");
      const roadTeamName = teams[0];
      return leg.live_value !== undefined
        ? leg.live_value
        : parseFloat(
            liveTeamData.get(roadTeamName).get("live_points"),
          ).toFixed();
    } else if (
      leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] ===
      propField[0]
    ) {
      return leg.live_value !== undefined
        ? leg.live_value
        : parseFloat(liveTeamData.get(leg.team).get("live_points")).toFixed();
    } else if (
      leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] ===
      propField[2]
    ) {
      return leg.live_value !== undefined
        ? leg.live_value
        : parseFloat(liveTeamData.get(leg.team).get("live_points")).toFixed();
    } else if (
      leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] ===
      propField[3]
    ) {
      return leg.live_value !== undefined
        ? leg.live_value
        : parseFloat(liveTeamData.get(leg.team).get("live_score")).toFixed();
    } else if (
      leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] ===
      propField[4]
    ) {
      const playerName = leg.frontend_id.split("/")[0];
      return leg.live_value !== undefined
        ? leg.live_value
        : parseFloat(livePlayerData.get(playerName)).toFixed();
    }
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

  const getProgressBarWidth = (leg: ParlayTask) => {
    if (
      leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] ===
      propField[1]
    ) {
      const teams = leg.frontend_id.split("/")[0].split(" v ");
      const roadTeamName = teams[0];
      const liveTotalPointsScored =
        leg.live_value !== undefined
          ? leg.live_value
          : parseFloat(
              parseFloat(
                liveTeamData.get(roadTeamName).get("live_points"),
              ).toFixed(),
            );
      const propTotalPointsScored = parseFloat(getPropValue(leg.text));
      const propTotalPointsScoredFull = parseFloat(
        (propTotalPointsScored * 1.2).toFixed(),
      );
      const percentFull = parseFloat(
        ((liveTotalPointsScored / propTotalPointsScoredFull) * 100).toFixed(),
      );
      let styling = percentFull.toString();
      if (
        leg.did_hit !== undefined &&
        !leg.did_hit &&
        leg.text.startsWith("O")
      ) {
        styling = Math.min(75, percentFull).toString();
      }
      if (
        leg.did_hit !== undefined &&
        leg.did_hit &&
        leg.text.startsWith("U")
      ) {
        styling = Math.min(75, percentFull).toString();
      }
      return progressBarWidth.get(styling);
    } else if (
      leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] ===
      propField[3]
    ) {
      const team = leg.team;
      const liveTeamScore =
        leg.live_value !== undefined
          ? leg.live_value
          : parseFloat(
              parseFloat(liveTeamData.get(team).get("live_score")).toFixed(),
            );
      const propTeamScore = parseFloat(getPropValue(leg.text));
      const propTeamScoreFull = parseFloat((propTeamScore * 1.2).toFixed());
      const percentFull = parseFloat(
        ((liveTeamScore / propTeamScoreFull) * 100).toFixed(),
      );
      let styling = percentFull.toString();
      if (
        leg.did_hit !== undefined &&
        !leg.did_hit &&
        leg.text.startsWith("O")
      ) {
        styling = Math.min(75, percentFull).toString();
      }
      if (
        leg.did_hit !== undefined &&
        leg.did_hit &&
        leg.text.startsWith("U")
      ) {
        styling = Math.min(75, percentFull).toString();
      }
      return progressBarWidth.get(styling);
    } else if (
      leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1] ===
      propField[4]
    ) {
      const playerName = leg.frontend_id.split("/")[0];
      const livePlayerScore =
        leg.live_value !== undefined
          ? leg.live_value
          : parseFloat(livePlayerData.get(playerName));
      const propPlayerScore = parseFloat(getPropValue(leg.text));
      const propPlayerScoreFull = parseFloat((propPlayerScore * 1.2).toFixed());
      const percentFull = parseFloat(
        ((livePlayerScore / propPlayerScoreFull) * 100).toFixed(),
      );
      let styling = percentFull.toString();
      if (
        leg.did_hit !== undefined &&
        !leg.did_hit &&
        leg.text.startsWith("O")
      ) {
        styling = Math.min(75, percentFull).toString();
      }
      if (
        leg.did_hit !== undefined &&
        leg.did_hit &&
        leg.text.startsWith("U")
      ) {
        styling = Math.min(75, percentFull).toString();
      }
      return progressBarWidth.get(styling);
    }
    return "h-[4px] z-50 bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-full";
  };

  const handleCaptureClick = async () => {
    const parlayElement = document.getElementById(parlay_id);
    if (!parlayElement) return;

    exportAsImage(
      parlayElement,
      `parlay-${parlay_id.substring(parlay_id.length - 5)}.png`,
    );
  };

  const handleShareSlip = (parlay_id: string) => {
    const url = `${window.location.href.substring(0, window.location.href.length - 8)}/${parlay_id}`;
    navigator.clipboard.writeText(url);
    setNotification({
      show: true,
      legs: 0,
      message: "Copied parlay link!",
      type: "CLIPBOARD",
    });
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
        {!is_active && is_winner && (
          <div className="text-green-600 z-40 w-1/8 justify-end flex">
            <FontAwesomeIcon icon={faSquareCheck as IconProp} />
          </div>
        )}
        {!is_active && !is_winner && (
          <div className="text-red-600 text-base w-1/8 justify-end flex">
            <FontAwesomeIcon icon={faSquareXmark as IconProp} />
          </div>
        )}
      </div>
      <div className="flex mb-2 max-h-110 overflow-y-scroll scrollbar-hide w-full flex-col bg-gray-900">
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
                  <span
                    className={
                      !is_active
                        ? leg.did_hit
                          ? "block relative text-green-500 text-sm"
                          : "block relative text-red-500 text-sm"
                        : "block relative text-white text-sm"
                    }
                  >
                    {getPropTextWithRespectToScreenSize(leg, window.innerWidth)}
                  </span>
                  <span className="flex relative text-gray-400 text-xs">
                    {
                      leg.frontend_id.split("/")[
                        leg.frontend_id.split("/").length - 1
                      ]
                    }
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
            {is_active &&
              leg.frontend_id.split("/")[
                leg.frontend_id.split("/").length - 1
              ] === propField[0] && (
                <div className="flex flex-row w-full grow items-center justify-start h-auto m1-2 px-5">
                  <span className={getLiveSpreadUpdateStyle(leg)}>
                    {getLiveSpreadUpdate(leg)}
                  </span>
                </div>
              )}
            {leg.frontend_id.split("/")[
              leg.frontend_id.split("/").length - 1
            ] === propField[1] && (
              <div className="flex w-full pb-4 flex-row grow justify-start h-auto items-center px-3 my-2">
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
              </div>
            )}
            {is_active &&
              leg.frontend_id.split("/")[
                leg.frontend_id.split("/").length - 1
              ] === propField[2] && (
                <div className="flex flex-row w-full grow items-center justify-start h-auto m1-2 px-5">
                  <span className={getLiveMoneylineUpdateStyle(leg)}>
                    {getLiveMoneylineUpdate(leg)}
                  </span>
                </div>
              )}
            {leg.frontend_id.split("/")[
              leg.frontend_id.split("/").length - 1
            ] === propField[3] && (
              <div className="flex w-full pb-4 flex-row grow justify-start h-auto items-center px-3 my-2">
                {leg.frontend_id.split("/")[
                  leg.frontend_id.split("/").length - 1
                ] === propField[3] && (
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
            {leg.frontend_id.split("/")[
              leg.frontend_id.split("/").length - 1
            ] === propField[4] && (
              <div className="flex w-full pb-4 flex-row grow justify-start h-auto items-center px-3 my-2">
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
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="border-t-1 flex flex-col w-full items-center justify-between border-b-1 rounded-b-sm bg-gray-800 border-gray-700">
        <div className="flex flex-row text-left pl-2 border-b-1 border-b-gray-700 w-full pb-1">
          <div
            className={
              is_active ? "flex flex-row w-14/16" : "flex flex-row w-15/16"
            }
          >
            <div className="flex flex-col basis-0 grow justify-center items-stretch box-border relative pl-2">
              <span className="font-[Proxima Nova, serif] tracking-[1px] uppercase text-gray-300 text-base text-left relative">
                ${numberWithCommas(wager)}
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
                    : is_active
                      ? "text-gray-300 text-sm font-bold font-[Proxima Nova, serif]"
                      : "text-gray-500 text-sm font-bold font-[Proxima Nova, serif]"
                }
              >
                ${numberWithCommas(parseFloat(payout.toFixed(2)))}
              </span>
            </div>
          </div>
          {is_active && (
            <div className="flex flex-row w-1/16 m-1 mt-2 justify-end">
              <button
                className="pl-1 pr-1 block text-white text-sm hover:bg-gray-700 border border-transparent rounded-4xl justify-end"
                onClick={() => handleShareSlip(parlay_id)}
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
          <div className="pl-2 flex w-1/3 items-center justify-start box-border relative font-mono">
            <span className="text-gray-400 text-[8px]">
              <span className="uppercase text-gray-400 text-[8px]">
                bet id:{" "}
              </span>
              {parlay_id.substring(parlay_id.length - 5)}
            </span>
          </div>
          <div className="flex w-1/3 items-center justify-center box-border relative font-mono">
            <span className="text-gray-400 text-[8px] float-left font-light uppercase font-mono">
              expires: {getReadableDate(new Date(expires_at))}
            </span>
          </div>
          <div className="pr-2 flex w-1/3 flex-row items-center justify-end box-border relative">
            <span className="text-gray-400 text-[8px] float-left font-light uppercase font-mono">
              placed: {getReadableDate(new Date(created_at))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
