import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
import {
  faDownload,
  fas,
  faSquareCheck,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import { ParlayTask } from "../../App";
import html2canvas from "html2canvas-pro";
import { downloadImage } from "../../utils/exportAsImage";
import { getParlayType, numberWithCommas } from "../../utils/Util";

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
}

export function Parlay(props: ParlayProps) {
  const {
    parlay_id,
    created_at,
    frontend_is_active,
    legs,
    total_odds,
    payout,
    wager,
    is_winner,
  } = props;

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
    timeValue += hours >= 12 ? "PM ET" : "AM ET";

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

  return (
    <div
      className="w-full float-left shadow-sm rounded-xs bg-gray-900 border-gray-500 border-t-1"
      id={parlay_id}
    >
      <div className="p-4 flex flex-row w-full items-center justify-between border-b-1 border-b-gray-500">
        <span className="text-blue-500 text-base flex w-5/8 font-bold">
          {legs.length} leg {getParlayType(legs.length)}
        </span>
        <span className="text-white text-sm w-2/8 justify-end flex font-bold">
          {total_odds > 0 && "+"}
          {total_odds}
        </span>
        {!frontend_is_active && is_winner && (
          <div className="text-green-600 z-40 w-1/8 justify-end flex">
            <FontAwesomeIcon icon={faSquareCheck as IconProp} />
          </div>
        )}
        {!frontend_is_active && is_winner && (
          <div className="text-red-600 text-base w-1/8 justify-end flex">
            <FontAwesomeIcon icon={faSquareXmark as IconProp} />
          </div>
        )}
      </div>
      <div className="float-left max-h-48 overflow-y-scroll scrollbar-hide w-full flex-col bg-gray-900">
        {legs.map((leg, index) => (
          <div
            key={leg.frontend_id}
            className={
              index > 0 ? "pt-1 h-12 border-t border-t-gray-600" : "pt-1 h-12"
            }
          >
            <div className="pl-5 float-left w-7/8 h-full">
              <span className="block relative text-white text-sm">
                {leg.betType == "TOTAL POINTS"
                  ? leg.frontend_id.split("-")[0]
                  : leg.team}{" "}
                {leg.text}
              </span>
              <span className="block relative text-gray-400 text-xs">
                {leg.betType}
              </span>
            </div>
            <div className="float-right w-1/8 text-right pr-5">
              <span className="text-gray-300">
                {leg.odds > 0 && "+"}
                {leg.odds}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t-1 flex flex-col w-full items-center justify-between border-b-1 rounded-xs bg-gray-800 border-gray-700">
        <div className="flex flex-row text-left pl-2 border-b-1 border-b-gray-700 w-full pb-1">
          <div className="flex flex-row w-15/16">
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
