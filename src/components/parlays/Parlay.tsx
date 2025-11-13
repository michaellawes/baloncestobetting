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
      className="w-full float-left shadow-sm rounded-xs dark:bg-gray-800 dark:border-white border-1"
      id={parlay_id}
    >
      <div className="p-4 flex w-full items-center justify-between border-b-1 border-b-gray-400">
        <span className="text-gray-500 text-xs float-left">
          {parlay_id.substring(parlay_id.length - 5)}
        </span>
        <span className="text-white float-left">
          {getReadableDate(created_at)}
        </span>
        <span className="text-white float-left">
          {total_odds > 0 && "+"}
          {total_odds}
        </span>
        {!frontend_is_active && is_winner && (
          <div className="text-green-700 z-40 text-base float-left">
            <FontAwesomeIcon icon={faSquareCheck as IconProp} />
          </div>
        )}
        {!frontend_is_active && !is_winner && (
          <div className="text-red-700 text-base float-left">
            <FontAwesomeIcon icon={faSquareXmark as IconProp} />
          </div>
        )}
      </div>
      <div className="float-left max-h-48 overflow-y-scroll scrollbar-hide w-full flex-col dark:bg-gray-800">
        {legs.map((leg) => (
          <div key={leg.frontend_id} className="pt-1 h-12">
            <div className="pl-5 float-left w-7/8 h-full">
              <span className="block relative text-white text-sm">
                {leg.team} {leg.text}
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
      <div className="p-4 border-t-2 flex w-full items-center justify-between border-b-1 rounded-xs dark:bg-gray-800 dark:border-gray-700">
        <div className="float-left text-left pl-2">
          <span className="text-gray-200 text-sm">${wager} to </span>
          <span className="text-green-500 text-sm">${payout.toFixed(2)}</span>
        </div>
        <div className="float-left w-1/2">
          <button
            className="pl-2 pr-2 block text-white text-base float-right hover:bg-gray-600"
            onClick={() => handleCaptureClick()}
          >
            <FontAwesomeIcon icon={faDownload as IconProp} />
          </button>
        </div>
      </div>
    </div>
  );
}
