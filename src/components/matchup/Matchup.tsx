import * as React from "react";
import { useContext, useEffect } from "react";
import { getPlayerNameIsTooLong, getTeamNameIsTooLong, roundToInteger } from "../../utils/Util";
import { TasksContext } from "../reducer/TasksContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketball, faFaceDizzy, faFaceGrimace, faFaceGrin } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { PropLine } from "../dashboard/wagers/PropLine";
import { ErrorLander } from "../dashboard/ErrorLander";
import { propField } from "../../utils/Constants";
import { MatchupsProps, ParlayTask } from "../../utils/Interfaces";

export function Matchup(props: MatchupsProps) {
  const { matchup, setIsViewingDashboard, setIsViewingMatchup } = props;

  const tasks: ParlayTask[] = useContext(TasksContext);

  useEffect(() => {
    setIsViewingDashboard(false);
    setIsViewingMatchup(true);
  }, []);

  if (!matchup)
    return (
      <ErrorLander message="Please return to the homepage and refresh..." />
    );

  return (
    <div className="w-full h-screen bg-gray-900">
      <div className="z-10 items-stretch justify-start bg-gray-800 flex-col flex box-border relative">
        <div className="box-border flex relative  w-full flex-col justify-center text-white items-stretch">
          <div className="flex flex-row w-full h-full pt-20 border-t-2">
            <div className="flex flex-col w-1/2 h-full">
              <div className="items-center  w-full flex-col flex justify-start box-border relative rounded-r-none pb-2">
                <div className="items-center w-full flex-col flex justify-start box-border relative ">
                  <div className="items-center w-full flex-col flex justify-start box-border relative">
                    <div className="items-center w-full flex-col flex justify-start box-border relative">
                      <div className="bg-no-repeat bg-center bg-contain w-full justify-center flex ">
                        {matchup.road.icon.length > 0 &&
                        !matchup.road.icon.startsWith("https://mystique") &&
                        !matchup.road.icon.startsWith(
                          "https://m.media-amazon",
                        ) ? (
                          <div className="flex">
                            <img
                              src={matchup.road.icon}
                              alt="Can't Get Your PFP Buddy"
                              className="h-16 w-16 border-transparent border rounded-[40px]"
                            />
                          </div>
                        ) : (
                          <div
                            className={
                              "text-center text-[40px] pt-1 text-gray-200"
                            }
                          >
                            <FontAwesomeIcon icon={faBasketball as IconProp} />
                          </div>
                        )}
                      </div>
                      <div className=" items-stretch justify-center text-center w-full flex-col flex box-border relative">
                        <span className="font-[ProximaNova-Bold, serif] text-gray-200 text-lg wrap-break-word box-border overflow-hidden relative justify-center">
                          {getTeamNameIsTooLong(matchup.road.name)
                            ? matchup.road.name.substring(0, 16) + "..."
                            : matchup.road.name}
                        </span>
                        <span className="font-[ProximaNova, serif] font-light text-gray-300 text-xs flex box-border overflow-hidden relative w-full justify-center">
                          {matchup.road.record}
                        </span>
                        <span className="font-[ProximaNova, serif] font-light text-white text-base flex box-border overflow-hidden relative w-full justify-center">
                          <span className="font-[ProximaNova, serif] font-bold text-red-500 mr-2">
                            LIVE:
                          </span>
                          {matchup.road.live_score} fpts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-14 mt-2 items-center justify-center flex flex-row box-border relative px-6 py-1 ">
                  <PropLine
                    text={"O " + matchup.road.team_total.text}
                    team={matchup.road.name}
                    betType={propField[3]}
                    odds={matchup.road.team_total.over_odds}
                    frontend_id={matchup.road.name + "/O/" + propField[3]}
                    oppId={matchup.road.name + "/U/" + propField[3]}
                  />
                  <PropLine
                    text={"U " + matchup.road.team_total.text}
                    team={matchup.road.name}
                    betType={propField[3]}
                    odds={matchup.road.team_total.under_odds}
                    frontend_id={matchup.road.name + "/U/" + propField[3]}
                    oppId={matchup.road.name + "/O/" + propField[3]}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col w-1/2 h-full">
              <div className="items-center w-full  flex-col flex justify-start box-border relative rounded-r-none pb-2">
                <div className="items-center w-full flex-col flex justify-start box-border relative">
                  <div className="bg-gray-800 items-center w-full flex-col flex justify-start box-border relative">
                    <div className="bg-no-repeat bg-center bg-contain w-full justify-center flex ">
                      {matchup.home.icon.length > 0 &&
                      !matchup.home.icon.startsWith("https://mystique") &&
                      !matchup.home.icon.startsWith(
                        "https://m.media-amazon",
                      ) ? (
                        <div className="flex">
                          <img
                            src={matchup.home.icon}
                            alt="Can't Get Your PFP Buddy"
                            className="w-16 h-16 border-transparent border rounded-[40px]"
                          />
                        </div>
                      ) : (
                        <div
                          className={
                            "text-center text-[40px] pt-1 text-blue-400"
                          }
                        >
                          <FontAwesomeIcon icon={faBasketball as IconProp} />
                        </div>
                      )}
                    </div>
                    <div className=" items-stretch justify-center text-center w-full flex-col flex box-border relative">
                      <span className="font-[ProximaNova-Bold, serif] text-blue-400 text-lg wrap-break-word box-border overflow-hidden relative justify-center">
                        {getTeamNameIsTooLong(matchup.home.name)
                          ? matchup.home.name.substring(0, 16) + "..."
                          : matchup.home.name}
                      </span>
                      <span className="font-[ProximaNova, serif] font-light text-gray-300 text-xs flex box-border overflow-hidden relative w-full justify-center">
                        {matchup.home.record}
                      </span>
                      <span className="font-[ProximaNova, serif] font-light text-white text-base flex box-border overflow-hidden relative w-full justify-center">
                        <span className="font-[ProximaNova, serif] font-bold text-red-500 mr-2">
                          LIVE:
                        </span>
                        {matchup.home.live_score} fpts
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full h-14 mt-2 items-center justify-center flex flex-row box-border relative px-6 py-1 ">
                  <PropLine
                    text={"O " + matchup.home.team_total.text}
                    team={matchup.home.name}
                    betType={propField[3]}
                    odds={matchup.home.team_total.over_odds}
                    frontend_id={matchup.home.name + "/O/" + propField[3]}
                    oppId={matchup.home.name + "/U/" + propField[3]}
                  />
                  <PropLine
                    text={"U " + matchup.home.team_total.text}
                    team={matchup.home.name}
                    betType={propField[3]}
                    odds={matchup.home.team_total.under_odds}
                    frontend_id={matchup.home.name + "/U/" + propField[3]}
                    oppId={matchup.home.name + "/O/" + propField[3]}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center w-full pb-2 border-b-gray-400 border-b-2 border-t-3 border-t-gray-400">
            <div className="flex flex-col w-full justify-center items-center text-center">
              <span className="font-[ProximaNova, serif] text-white font-bold pt-2">
                Roster Info
              </span>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center w-full grow">
            <div className="flex flex-row w-1/2 justify-center items-center text-center border-r-[0.5px] border-r-gray-400">
              <div className="w-full flex flex-col justify-center text-center">
                <div className="flex flex-col w-full justify-start">
                  <div className="w-full flex flex-col justify-center text-center">
                    <div
                      className={
                        tasks.length > 0
                          ? "flex flex-col w-full justify-start mb-20"
                          : "flex flex-col w-full justify-start"
                      }
                    >
                      {matchup.road.top_5.slice(0, 5).map((player, index) => (
                        <div
                          className="flex flex-col w-full border-b-2 border-b-gray-400"
                          key={player.name}
                        >
                          <div className="flex flex-row w-full justify-start ml-1 mt-1 font-bold items-start">
                            <span className="text-gray-300 text-xs">
                              {index + 1}
                            </span>
                          </div>
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
                                  className="text-yellow-500"
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
                                    <span className="text-xs text-gray-500 flex flex-col justify-end">
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
                                {roundToInteger(player.average.toString()) +
                                  " PPG"}
                              </div>
                            </div>
                            <div className="flex flex-row justify-center w-1/2 mr-1">
                              <div className="flex flex-row justify-center text-sm items-center text-center">
                                <span className="font-[ProximaNova, serif] font-bold text-green-500 mr-1">
                                  {window.innerWidth < 468 ? "CUR:" : "TOTAL:"}
                                </span>
                                {roundToInteger(player.live_total.toString()) +
                                  " PTS"}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-row justify-center w-full">
                            <div className="flex flex-row justify-center text-sm items-center text-center my-2">
                              <span className="font-[ProximaNova, serif] font-light text-white mr-1">
                                Games Left:
                              </span>
                              {player.status === "OUT" ? (
                                <span className="text-gray-500">TBD</span>
                              ) : (
                                player.games_left
                              )}
                            </div>
                          </div>
                          <div className="w-full h-14 my-1 pt-2 items-center justify-center flex flex-row box-border border-t-1 border-t-gray-400 relative px-6 py-1 ">
                            <PropLine
                              text={"O " + player.prop_line.text}
                              team={matchup.road.name}
                              betType={propField[4]}
                              odds={player.prop_line.over_odds}
                              frontend_id={player.name + "/O/" + propField[4]}
                              oppId={player.name + "/U/" + propField[4]}
                            />
                            <PropLine
                              text={"U " + player.prop_line.text}
                              team={matchup.road.name}
                              betType={propField[4]}
                              odds={player.prop_line.under_odds}
                              frontend_id={player.name + "/U/" + propField[4]}
                              oppId={player.name + "/O/" + propField[4]}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row w-1/2 justify-center items-center text-center border-l-[0.5px] border-l-gray-400">
              <div className="w-full flex flex-col justify-center text-center">
                <div className="flex flex-col w-full justify-start">
                  <div className="w-full flex flex-col justify-center text-center">
                    <div
                      className={
                        tasks.length > 0
                          ? "flex flex-col w-full justify-start mb-20"
                          : "flex flex-col w-full justify-start"
                      }
                    >
                      {matchup.home.top_5.slice(0, 5).map((player, index) => (
                        <div
                          className="flex flex-col w-full border-b-2 border-b-gray-400"
                          key={player.name}
                        >
                          <div className="flex flex-row w-full justify-start ml-1 mt-1 font-bold items-start">
                            <span className="text-gray-300 text-xs">
                              {index + 1}
                            </span>
                          </div>
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
                                  className="text-yellow-500"
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
                                    <span className="text-xs text-gray-500 flex flex-col justify-end">
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
                                {roundToInteger(player.average.toString()) +
                                  " PPG"}
                              </div>
                            </div>
                            <div className="flex flex-row justify-center w-1/2 mr-1">
                              <div className="flex flex-row justify-center text-sm items-center text-center">
                                <span className="font-[ProximaNova, serif] font-bold text-green-500 mr-1">
                                  {window.innerWidth < 468 ? "CUR:" : "TOTAL:"}
                                </span>
                                {roundToInteger(player.live_total.toString()) +
                                  " PTS"}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-row justify-center w-full">
                            <div className="flex flex-row justify-center text-sm items-center text-center my-2">
                              <span className="font-[ProximaNova, serif] font-light text-white mr-1">
                                Games Left:
                              </span>
                              {player.status === "OUT" ? (
                                <span className="text-gray-500">TBD</span>
                              ) : (
                                player.games_left
                              )}
                            </div>
                          </div>
                          <div className="w-full h-14 my-1 pt-2 items-center justify-center flex flex-row box-border border-t-1 border-t-gray-400 relative px-6 py-1 ">
                            <PropLine
                              text={"O " + player.prop_line.text}
                              team={matchup.home.name}
                              betType={propField[4]}
                              odds={player.prop_line.over_odds}
                              frontend_id={player.name + "/O/" + propField[4]}
                              oppId={player.name + "/U/" + propField[4]}
                            />
                            <PropLine
                              text={"U " + player.prop_line.text}
                              team={matchup.home.name}
                              betType={propField[4]}
                              odds={player.prop_line.under_odds}
                              frontend_id={player.name + "/U/" + propField[4]}
                              oppId={player.name + "/O/" + propField[4]}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
