import { SpecialsProps } from "../../utils/Interfaces";
import { getPlayerNameIsTooLong, roundToInteger } from "../../utils/Util";
import { PropLine } from "../wagers/PropLine";
import {
  discountTypes,
  propField,
  specialLegTypes,
} from "../../utils/Constants";
import * as React from "react";

export function Specials(props: SpecialsProps) {
  const { players } = props;
  return (
    <div className="w-full flex flex-row z-10 justify-start items-stretch box-border relative">
      <div className="w-full box-border relative mt-29">
        <div className="w-full py-2 px-4 flex flex-col justify-start bg-gray-900 box-border relative basis-0 grow text-white ">
          <div
            className={
              players.length < 3
                ? "w-full flex flex-row overflow-x-scroll justify-center"
                : "w-full flex flex-row overflow-x-scroll"
            }
          >
            {players.map((player) => (
              <div
                className="w-full min-w-[200px] max-w-[200px] flex flex-row"
                key={player.name}
              >
                <div className="w-full flex flex-row justify-center">
                  <div
                    className="flex flex-col w-full pt-2 mx-2 border-2 border-blue-300"
                    key={player.name}
                  >
                    <div className="flex flex-row justify-start w-full">
                      <div className="flex flex-col justify-center w-full">
                        <div className="flex flex-row justify-center text-sm items-center text-center">
                          <span className="text-base md:text-xl flex flex-col ">
                            {getPlayerNameIsTooLong(player.name, true)
                              ? player.name.substring(0, 15) + "..."
                              : player.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row justify-start w-full mb-1">
                      <div className="flex flex-row justify-center w-full mx-1">
                        <div className="flex flex-row justify-center text-sm items-center text-center">
                          <span className="font-[ProximaNova, serif] font-bold text-green-500 mr-1">
                            {window.innerWidth < 469 ? "CUR:" : "TOTAL:"}
                          </span>
                          {roundToInteger(player.live_total.toString()) +
                            " PTS"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row justify-center w-full"></div>
                    <div className="w-full h-14 my-1 pt-2 items-center justify-center flex flex-row box-border border-t-1 border-t-blue-300 relative px-6 py-1">
                      {player.discountType !== discountTypes[3] && (
                        <PropLine
                          text={"O " + player.prop_line.text}
                          team={player.fantasy_team_name}
                          betType={propField[4]}
                          odds={player.prop_line.over_odds}
                          frontend_id={player.name + "/O/" + propField[4]}
                          oppId={player.name + "/U/" + propField[4]}
                          isClose={false}
                          isDiscounted={true}
                          specialLegType={specialLegTypes[1]}
                          oldText={player.prop_line.old_text}
                        />
                      )}
                      {player.discountType === discountTypes[3] && (
                        <PropLine
                          text={"U " + player.prop_line.text}
                          team={player.fantasy_team_name}
                          betType={propField[4]}
                          odds={player.prop_line.under_odds}
                          frontend_id={player.name + "/U/" + propField[4]}
                          oppId={player.name + "/O/" + propField[4]}
                          isClose={false}
                          isDiscounted={true}
                          specialLegType={specialLegTypes[1]}
                          oldText={player.prop_line.old_text}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
