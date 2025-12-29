import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
import { faBasketball, fas } from "@fortawesome/free-solid-svg-icons";
import { PropLine } from "./PropLine";
import { Link } from "react-router-dom";
import { MatchupSchema, WeeklySlateProps } from "../../utils/Interfaces";
import { propField } from "../../utils/Constants";
import { getDaysSinceLastMonday, getId, getOppId, getTeamNameWithRespectToScreenSize } from "../../utils/Util";

library.add(fas);

export function WeeklySlate(props: WeeklySlateProps) {
  const { matchups, setCurrentMatchup, isDiscountsAvailable } = props;
  const getIsNewUTCDay = () => {
    return new Date().getUTCDate() > new Date().getDate();
  };
  getIsNewUTCDay();
  return (
    <div className="flex flex-col z-10 items-stretch justify-start box-border relative w-full">
      <div
        className={
          isDiscountsAvailable
            ? matchups[0].isClose
              ? "box-border relative border-t-2 mt-2 border-t-yellow-400 w-full"
              : "box-border relative border-t-2 mt-2 border-t-blue-500 w-full"
            : "box-border relative mt-28 w-full"
        }
      >
        <div className="basis-0 grow items-stretch justify-start flex-col flex bg-gray-900 box-border relative w-full">
          <ul className="flex-col overflow-hidden flex min-w-0 box-border relative list-none p-0 m-0 w-full">
            {matchups.map((matchup: MatchupSchema) => (
              <li key={matchup.road.name + "/" + matchup.home.name}>
                <div
                  className={
                    matchup.isClose
                      ? "h-[8.688rem] box-border w-full overflow-hidden pt-1.75 relative cursor-pointer"
                      : "h-[8.688rem] box-border w-full overflow-hidden pt-2.25 relative cursor-pointer"
                  }
                >
                  {matchup.isClose && (
                    <div className="relative z-70 justify-center w-1/2 flex flex-row h-0">
                      <span
                        className={
                          window.innerWidth < 469
                            ? "text-[12px] md:text-base font-bold text-yellow-400 font-face-cinema-upright"
                            : "text-xs md:text-base font-bold text-yellow-400 font-face-cinema-upright"
                        }
                      >
                        cinema matchup
                      </span>
                    </div>
                  )}
                  <div
                    className={
                      matchup.isClose
                        ? "border-b-yellow-400 rounded-b-md w-full pb-2.25 border-b-2 basis-0 grow border-solid items-stretch justify-start flex-row flex box-border relative"
                        : "border-b-gray-700 w-full pb-2.25 border-b basis-0 grow border-solid items-stretch justify-start flex-row flex box-border relative"
                    }
                  >
                    <div className="pl-2 w-1/2 pr-3 bg-transparent basis-0 grow justify-center items-stretch flex-col flex box-border relative">
                      <Link
                        to={"/matchup"}
                        onClick={() => setCurrentMatchup(matchup)}
                      >
                        <div className="basis-0 grow items-stretch justify-start flex-col flex box-border relative">
                          <div className="basis-0 grow justify-between flex-row items-stretch flex box-border relative">
                            <div className="min-w-[64px] min-h-[56px] basis-0 grow justify-center items-stretch flex-col flex box-border relative">
                              <div className="pr-[10px] items-center flex-row flex justify-start box-border relative ">
                                <div className="bg-no-repeat bg-center bg-contain h-10 w-10">
                                  {matchup.road.icon.length > 0 &&
                                  !matchup.road.icon.startsWith(
                                    "https://mystique",
                                  ) &&
                                  !matchup.road.icon.startsWith(
                                    "https://m.media-amazon",
                                  ) ? (
                                    <div className="flex justify-center">
                                      <img
                                        src={matchup.road.icon}
                                        alt="Can't Get Your PFP Buddy"
                                        className="w-10 h-10 border-transparent border rounded-4xl ml-2"
                                      />
                                    </div>
                                  ) : (
                                    <div
                                      className={
                                        "text-center text-4xl text-gray-200"
                                      }
                                    >
                                      <FontAwesomeIcon
                                        icon={faBasketball as IconProp}
                                      />
                                    </div>
                                  )}
                                </div>
                                <div className="pl-4 basis-0 grow items-stretch justify-start flex-row flex box-border relative">
                                  <div className="flex flex-row">
                                    <span className="font-[ProximaNova-Bold, serif] text-gray-200 wrap-break-word hyphens-none text-ellipsis text-sm md:text-lg box-border overflow-hidden relative">
                                      {matchup.road.name}
                                    </span>
                                  </div>
                                  <div className="flex flex-col justify-center">
                                    <span className="font-[ProximaNova-Bold, serif] text-gray-400 wrap-break-word text-ellipsis text-[10px] md:text-xs hidden md:inline box-border overflow-hidden relative ml-2">
                                      {matchup.road.record}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="pl-3.5 mb-1 overflow-visible h-0.25 justify-start items-center z-40 flex-row flex w-full box-border relative">
                          <div className="flex flex-row w-1/6 md:w-1/16">
                            <span className="text-white font-light text-[20px]">
                              @
                            </span>
                          </div>
                          <div className="flex flex-row justify-center md:justify-start w-5/6 md:w-15/16">
                            <div className="font-[ProximaNova, serif] text-[10px] md:text-sm text-yellow-400 items-center">
                              {matchup.isClose ? (
                                <div className="flex flex-row w-full italic justify-center mt-1">
                                  {Math.abs(
                                    matchup.road.live_score -
                                      matchup.home.live_score,
                                  ) < 4 ? (
                                    <span>
                                      {matchup.road.live_score > 0 ||
                                      matchup.home.live_score > 0
                                        ? "Matchup nearly tied!"
                                        : ""}
                                    </span>
                                  ) : matchup.road.live_score >
                                    matchup.home.live_score ? (
                                    <span>
                                      Road team leads by{" "}
                                      {(
                                        matchup.road.live_score -
                                        matchup.home.live_score
                                      ).toFixed()}
                                    </span>
                                  ) : (
                                    <span>
                                      Home team leads by{" "}
                                      {(
                                        matchup.home.live_score -
                                        matchup.road.live_score
                                      ).toFixed()}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span></span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="basis-0 grow items-stretch justify-start flex-col flex box-border relative">
                          <div className="basis-0 grow justify-between flex-row items-stretch flex box-border relative">
                            <div className="min-w-[64px] min-h-[56px] basis-0 grow justify-center items-stretch flex-col flex box-border relative">
                              <div className="pr-[10px] items-center flex-row flex justify-start box-border relative">
                                <div className="bg-no-repeat bg-center bg-contain h-10 w-10">
                                  {matchup.home.icon.length > 0 &&
                                  !matchup.home.icon.startsWith(
                                    "https://mystique",
                                  ) &&
                                  !matchup.home.icon.startsWith(
                                    "https://m.media-amazon",
                                  ) ? (
                                    <div className="flex justify-center">
                                      <img
                                        src={matchup.home.icon}
                                        alt="Can't Get Your PFP Buddy"
                                        className="w-10 h-10 border-transparent border rounded-4xl ml-2"
                                      />
                                    </div>
                                  ) : (
                                    <div
                                      className={
                                        "text-center text-4xl text-blue-400"
                                      }
                                    >
                                      <FontAwesomeIcon
                                        icon={faBasketball as IconProp}
                                      />
                                    </div>
                                  )}
                                </div>
                                <div className="pl-4 basis-0 grow items-stretch justify-start flex-row flex box-border relative">
                                  <div className="flex flex-row">
                                    <span className="font-[ProximaNova-Bold, serif] text-blue-400 wrap-break-word hyphens-none text-ellipsis text-sm md:text-lg box-border overflow-hidden relative">
                                      {getTeamNameWithRespectToScreenSize(
                                        matchup.home.name,
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex flex-col justify-center">
                                    <span className="font-[ProximaNova-Bold, serif] text-gray-400 wrap-break-word text-ellipsis text-[10px] md:text-xs hidden md:inline box-border overflow-hidden relative ml-2">
                                      {matchup.home.record}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-1/2 items-stretch justify-start flex-col flex box-border relative mr-2">
                      {Date.now() >= matchup.lastGame ||
                      (getDaysSinceLastMonday() == 6 && getIsNewUTCDay()) ? (
                        <div className="w-full h-full cursor-default justify-center items-center flex flex-row">
                          <span className="text-gray-500 uppercase">
                            end of matchup
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="h-[56px] flex flex-row justify-start items-center box-border relative mb-2">
                            <PropLine
                              team={matchup.road.name}
                              text={matchup.road.spread.text}
                              betType={propField[0]}
                              odds={matchup.road.spread.odds}
                              frontend_id={getId(
                                matchup.road.name,
                                matchup.road.spread.text,
                                0,
                                matchup.road.name,
                                matchup.home.name,
                              )}
                              oppId={getOppId(
                                matchup.home.name,
                                matchup.home.spread.text,
                                0,
                                matchup.road.name,
                                matchup.home.name,
                              )}
                              isHome={false}
                              isClose={matchup.isClose}
                              specialLegType={
                                matchup.isClose ? "CINEMA" : undefined
                              }
                              isDiscounted={false}
                            />
                            <PropLine
                              team={matchup.road.name}
                              text={matchup.road.points.text}
                              betType={propField[1]}
                              odds={matchup.road.points.odds}
                              frontend_id={getId(
                                matchup.road.name,
                                matchup.road.points.text,
                                1,
                                matchup.road.name,
                                matchup.home.name,
                              )}
                              oppId={getOppId(
                                matchup.home.name,
                                matchup.home.points.text,
                                1,
                                matchup.road.name,
                                matchup.home.name,
                              )}
                              isHome={false}
                              isClose={matchup.isClose}
                              specialLegType={
                                matchup.isClose ? "CINEMA" : undefined
                              }
                              isDiscounted={false}
                            />
                            <PropLine
                              team={matchup.road.name}
                              text={matchup.road.moneyline.text}
                              betType={propField[2]}
                              odds={matchup.road.moneyline.odds}
                              frontend_id={getId(
                                matchup.road.name,
                                matchup.road.moneyline.text,
                                2,
                                matchup.road.name,
                                matchup.home.name,
                              )}
                              oppId={getOppId(
                                matchup.home.name,
                                matchup.home.moneyline.text,
                                2,
                                matchup.road.name,
                                matchup.home.name,
                              )}
                              isHome={false}
                              isClose={matchup.isClose}
                              specialLegType={
                                matchup.isClose ? "CINEMA" : undefined
                              }
                              isDiscounted={false}
                            />
                          </div>
                          <div className="h-[56px] flex flex-row justify-start items-center box-border relative">
                            <PropLine
                              team={matchup.home.name}
                              text={matchup.home.spread.text}
                              betType={propField[0]}
                              odds={matchup.home.spread.odds}
                              frontend_id={getId(
                                matchup.home.name,
                                matchup.home.spread.text,
                                0,
                                matchup.road.name,
                                matchup.home.name,
                              )}
                              oppId={getOppId(
                                matchup.road.name,
                                matchup.road.spread.text,
                                0,
                                matchup.road.name,
                                matchup.home.name,
                              )}
                              isHome={true}
                              isClose={matchup.isClose}
                              specialLegType={
                                matchup.isClose ? "CINEMA" : undefined
                              }
                              isDiscounted={false}
                            />
                            <PropLine
                              team={matchup.home.name}
                              text={matchup.home.points.text}
                              betType={propField[1]}
                              odds={matchup.home.points.odds}
                              frontend_id={getId(
                                matchup.home.name,
                                matchup.home.points.text,
                                1,
                                matchup.road.name,
                                matchup.home.name,
                              )}
                              oppId={getOppId(
                                matchup.road.name,
                                matchup.road.points.text,
                                1,
                                matchup.road.name,
                                matchup.home.name,
                              )}
                              isHome={true}
                              isClose={matchup.isClose}
                              specialLegType={
                                matchup.isClose ? "CINEMA" : undefined
                              }
                              isDiscounted={false}
                            />
                            <PropLine
                              team={matchup.home.name}
                              text={matchup.home.moneyline.text}
                              betType={propField[2]}
                              odds={matchup.home.moneyline.odds}
                              frontend_id={getId(
                                matchup.home.name,
                                matchup.home.moneyline.text,
                                2,
                                matchup.road.name,
                                matchup.home.name,
                              )}
                              oppId={getOppId(
                                matchup.road.name,
                                matchup.road.moneyline.text,
                                2,
                                matchup.road.name,
                                matchup.home.name,
                              )}
                              isHome={true}
                              isClose={matchup.isClose}
                              specialLegType={
                                matchup.isClose ? "CINEMA" : undefined
                              }
                              isDiscounted={false}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
