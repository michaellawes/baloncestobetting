import * as React from "react";
import { MatchupSchema, propField } from "../../../utils/Util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
import { faAt, faBasketball, fas } from "@fortawesome/free-solid-svg-icons";
import { PropLine } from "./PropLine";

library.add(fas);

export interface WeeklySlateProps {
  matchups: MatchupSchema[];
}

export function WeeklySlate(props: WeeklySlateProps) {
  const { matchups } = props;

  const getOppId = (
    oppName: string,
    oppPropText: string,
    secondIndex: number,
    roadName: string,
    homeName: string,
  ) => {
    const totalPointsTeam = roadName + " v " + homeName;
    return (
      (secondIndex === 1 ? totalPointsTeam : oppName) +
      "-" +
      (secondIndex === 1 ? oppPropText : propField[secondIndex])
    );
  };

  const getId = (
    teamName: string,
    text: string,
    secondIndex: number,
    roadName: string,
    homeName: string,
  ) => {
    return (
      (secondIndex === 1 ? roadName + " v " + homeName : teamName) +
      "-" +
      (secondIndex === 1 ? text : propField[secondIndex])
    );
  };

  return (
    <div className="z-10 items-stretch justify-start flex-col flex box-border relative">
      <div className="box-border relative">
        <div className="basis-0 grow items-stretch justify-start flex-col flex bg-gray-900 box-border relative">
          <ul className="flex-col overflow-hidden flex min-w-0 box-border relative list-none p-0 m-0">
            <li key={"header"}>
              <div className="h-9.5 box-border overflow-hidden relative">
                <div className="shadow-none overflow-hidden rounded-xs list-none">
                  <div className="h-9.5 border-b-gray-600 bg-gray-700 border-solid border-b pr-4 pl-4 flex-row items-stretch flex justify-start box-border relative">
                    <div className="w-1/2 h-9.5 basis-0 grow items-center justify-between flex box-border relative">
                      <h3 className="text-ellipsis text-xs text-gray-300 box-border overflow-hidden relative m-0 p-0 font-inherit">
                        FANTASY BASKETBALL
                      </h3>
                    </div>
                    <div className="w-1/2 items-stretch justify-start flex-col flex box-border relative list-none">
                      <div className="grow items-center justify-between flex-row flex box-border relative list-none ml-4">
                        <div className="basis-0 grow justify-center items-center flex-row flex box-border relative">
                          <span className="font-[Proxima Nova Condensed, serif] tracking-[1px] uppercase text-gray-300 text-xs text-center box-border relative">
                            spread
                          </span>
                        </div>
                        <div className="basis-0 grow justify-center items-center flex-row flex box-border relative ml-4">
                          <span className="font-[Proxima Nova Condensed, serif] tracking-[1px] uppercase text-gray-300 text-xs text-center box-border relative">
                            total
                          </span>
                        </div>
                        <div className="basis-0 grow justify-center items-center flex-row flex box-border relative">
                          <span className="font-[Proxima Nova Condensed, serif] tracking-[1px] uppercase text-gray-300 text-xs text-center box-border relative ml-4">
                            money
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            {matchups.map((matchup: MatchupSchema) => (
              <li key={matchup.road.name + "-" + matchup.home.name}>
                <div className="h-[8.688rem] box-border overflow-hidden relative pl-4">
                  <div className="border-b-gray-700 border-b basis-0 grow pt-2 border-solid items-stretch justify-start flex-row flex box-border relative">
                    <div className="width-1/2 pr-3 basis-0 grow justify-center items-stretch flex-col flex box-border relative bg-transparent">
                      <div className="basis-0 grow items-stretch justify-start flex-col flex box-border relative cursor-pointer">
                        <div className="basis-0 grow justify-between flex-row items-stretch flex box-border relative">
                          <div className="min-w-[64px] min-h-[56px] basis-0 grow justify-center items-stretch flex-col flex box-border relative">
                            <div className="pr-[10px] items-center flex-row flex justify-start box-border relative">
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
                                      "text-center text-4xl " +
                                      matchup.road.color
                                    }
                                  >
                                    <FontAwesomeIcon
                                      icon={faBasketball as IconProp}
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="pl-4 basis-0 grow items-stretch justify-start flex-row flex box-border relative">
                                <span className="font-[ProximaNova-Bold, serif] text-gray-200 wrap-break-word hyphens-none text-ellipsis text-sm md:text-lg box-border overflow-hidden relative">
                                  {matchup.road.name}
                                </span>
                                <span className="font-[ProximaNova-Bold, serif] text-gray-400 wrap-break-word text-ellipsis text-[10px] md:text-xs hidden md:inline box-border overflow-hidden relative ml-2">
                                  {matchup.road.record}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pl-3 text-lg overflow-visible h-0.25 justify-center items-center z-40 flex-row flex box-border relative">
                        <FontAwesomeIcon
                          className="shrink-0 w-[15px] h-[15px] text-gray-300"
                          icon={faAt as IconProp}
                        />
                        <div className="h-[1px] bg-gray-700 basis-0 grow flex-row items-stretch justify-start box-border relative"></div>
                      </div>
                      <div className="basis-0 grow items-stretch justify-start flex-col flex box-border relative cursor-pointer">
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
                                <span className="font-[ProximaNova-Bold, serif] text-blue-400 text-sm md:text-lg wrap-break-word hyphens-none text-ellipsis box-border overflow-hidden relative">
                                  {matchup.home.name}
                                </span>
                                <span className="font-[ProximaNova-Bold, serif] text-gray-400 wrap-break-word text-ellipsis text-[10px] md:text-xs hidden md:inline box-border overflow-hidden relative ml-2">
                                  {matchup.home.record}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-1/2 items-stretch justify-start flex-col flex box-border relative">
                      <div className="flex-row flex h-[56px] mb-2 items-center justify-start box-border relative">
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
                        />
                      </div>
                      <div className="h-[56px] items-center flex-row flex justify-start box-border relative">
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
                        />
                      </div>
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
  /*
  return (
    <div>
      {matchups.length > 0 && (
        <div className="weekly-slate-matchup-wrapper">
          {matchups.map((matchup, index) => (
            <div key={index} className="weekly-slate-matchup">
              <Matchup {...matchup} />
            </div>
          ))}
        </div>
      )}
    </div>
  );*/
}
