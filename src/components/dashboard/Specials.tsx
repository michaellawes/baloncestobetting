import { SpecialsProps } from "../../utils/Interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceDizzy,
  faFaceGrimace,
  faFaceGrin,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  getFinalGameFormatted,
  getPlayerNameIsTooLong,
  getTodayIsLastDay,
  isPlayerLockedOut,
  roundToInteger,
} from "../../utils/Util";
import { PropLine } from "../wagers/PropLine";
import { propField } from "../../utils/Constants";
import * as React from "react";

export function Specials(props: SpecialsProps) {
  const { players } = props;
  return (
    <div className="w-full flex flex-row z-10 justify-start items-stretch box-border relative">
      <div className="w-full box-border relative">
        <div className="w-full flex flex-row justify-start bg-gray-900 box-border relative basis-0 grow">
          {players.map((player) => (
            <div className="w-full flex flex-col" key={player.name}>
              <div className="w-full flex flex-row">
                <div
                  className={
                    "flex flex-col w-full border-b-2 border-b-blue-500"
                  }
                  key={player.name}
                >
                  <div className="flex flex-row justify-start text-4xl w-full">
                    <div className="flex w-2/8 justify-start flex-col items-center ml-2">
                      {player.status === "ACTIVE" && (
                        <FontAwesomeIcon
                          className="text-white"
                          icon={faFaceGrin as IconProp}
                        />
                      )}
                      {player.status === "DAY_TO_DAY" && (
                        <FontAwesomeIcon
                          className="text-orange-400"
                          icon={faFaceGrimace as IconProp}
                        />
                      )}
                      {player.status === "OUT" && (
                        <FontAwesomeIcon
                          className="text-red-600"
                          icon={faFaceDizzy as IconProp}
                        />
                      )}
                    </div>
                    <div className="flex w-6/8 justify-start flex-col">
                      <div className="flex flex-row justify-start items-center text-left">
                        <span className="text-base md:text-xl flex flex-col justify-start items-start">
                          {getPlayerNameIsTooLong(player.name)
                            ? player.name.substring(0, 15) + "..."
                            : player.name}
                        </span>
                      </div>
                      <div className="flex flex-col justify-end w-full">
                        <div className="flex flex-row justify-start w-full">
                          <div className="flex flex-row w-full justify-start">
                            <span className="text-xs text-gray-400 flex flex-col justify-end">
                              {player.team}
                              {" " + player.position}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-start w-full mt-2">
                    <div className="flex flex-row justify-center w-1/2">
                      <div className="flex flex-row justify-center text-sm items-center text-center">
                        <span className="font-[ProximaNova, serif] font-bold text-blue-500 mr-1">
                          AVG:
                        </span>
                        {roundToInteger(player.average.toString()) + " PPG"}
                      </div>
                    </div>
                    <div className="flex flex-row justify-center w-1/2 mr-1">
                      <div className="flex flex-row justify-center text-sm items-center text-center">
                        <span className="font-[ProximaNova, serif] font-bold text-green-500 mr-1">
                          {window.innerWidth < 469 ? "CUR:" : "TOTAL:"}
                        </span>
                        {roundToInteger(player.live_total.toString()) + " PTS"}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-center w-full">
                    <div className="flex flex-row justify-center text-sm items-center text-center my-2">
                      {player.games_left == 1 &&
                      getTodayIsLastDay(player.last_game) ? (
                        <span
                          className={
                            "text-yellow-400 font-bold font-[ProximaNova, serif]"
                          }
                        >
                          {"Final Game Today @ " +
                            getFinalGameFormatted(player.last_game)}
                        </span>
                      ) : (
                        <span className="font-[ProximaNova, serif] font-light text-white mr-1">
                          Games Left:
                        </span>
                      )}
                      {player.status === "OUT" ? (
                        <span className="text-gray-400">TBD</span>
                      ) : (
                        <span>
                          {player.games_left >= 1 &&
                          !getTodayIsLastDay(player.last_game)
                            ? player.games_left
                            : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className={
                      "w-full h-14 my-1 pt-2 items-center justify-center flex flex-row box-border border-t-1 border-t-blue-500 relative px-6 py-1"
                    }
                  >
                    {player.games_left < 1 ||
                    player.status === "OUT" ||
                    isPlayerLockedOut(player.last_game) ? (
                      <div className="text-gray-400 uppercase">
                        {isPlayerLockedOut(player.last_game) ? (
                          <span>Last Game Started</span>
                        ) : (
                          <span>
                            {player.status !== "OUT"
                              ? "no games left"
                              : player.status}
                          </span>
                        )}
                      </div>
                    ) : (
                      <>
                        <PropLine
                          text={"O " + player.prop_line.text}
                          team={player.team}
                          betType={propField[4]}
                          odds={player.prop_line.over_odds}
                          frontend_id={player.name + "/O/" + propField[4]}
                          oppId={player.name + "/U/" + propField[4]}
                          isClose={false}
                        />
                        <PropLine
                          text={"U " + player.prop_line.text}
                          team={player.team}
                          betType={propField[4]}
                          odds={player.prop_line.under_odds}
                          frontend_id={player.name + "/U/" + propField[4]}
                          oppId={player.name + "/O/" + propField[4]}
                          isClose={false}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
