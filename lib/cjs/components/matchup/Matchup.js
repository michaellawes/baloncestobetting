import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useContext, useEffect } from "react";
import { getPlayerNameIsTooLong, getStandardTime, getTeamNameIsTooLong, roundToInteger, } from "../../utils/Util";
import { TasksContext } from "../reducer/TasksContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketball, faFaceDizzy, faFaceGrimace, faFaceGrin, } from "@fortawesome/free-solid-svg-icons";
import { PropLine } from "../dashboard/wagers/PropLine";
import { ErrorLander } from "../dashboard/ErrorLander";
import { propField } from "../../utils/Constants";
export function Matchup(props) {
    var matchup = props.matchup, setIsViewingDashboard = props.setIsViewingDashboard, setIsViewingMatchup = props.setIsViewingMatchup;
    var tasks = useContext(TasksContext);
    useEffect(function () {
        setIsViewingDashboard(false);
        setIsViewingMatchup(true);
        if (matchup !== null) {
            var tempRoadPlayers = matchup.road.top_5;
            var tempHomePlayers = matchup.home.top_5;
            matchup.road.top_5 = matchup.road.top_5.filter(function (player) { return player.status !== "OUT" && player.games_left > 0; });
            matchup.home.top_5 = matchup.home.top_5.filter(function (player) { return player.status !== "OUT" && player.games_left > 0; });
            if (matchup.road.top_5.length < 5) {
                var playersWithNoGamesLeft = tempRoadPlayers.filter(function (player) { return player.games_left == 0; });
                var availableSpots = 5 - matchup.road.top_5.length;
                var index = 0;
                while (availableSpots > 0) {
                    matchup.road.top_5.push(playersWithNoGamesLeft[index]);
                    index++;
                    availableSpots--;
                }
                if (matchup.road.top_5.length < 5) {
                    var injuredPlayers = tempRoadPlayers.filter(function (player) { return player.status === "OUT"; });
                    var availableSpots_1 = 5 - matchup.road.top_5.length;
                    var index_1 = 0;
                    while (availableSpots_1 > 0) {
                        matchup.road.top_5.push(injuredPlayers[index_1]);
                        index_1++;
                        availableSpots_1--;
                    }
                }
            }
            if (matchup.home.top_5.length < 5) {
                var playersWithNoGamesLeft = tempHomePlayers.filter(function (player) { return player.games_left == 0; });
                var availableSpots = 5 - matchup.home.top_5.length;
                var index = 0;
                while (availableSpots > 0) {
                    matchup.home.top_5.push(playersWithNoGamesLeft[index]);
                    index++;
                    availableSpots--;
                }
                if (matchup.home.top_5.length < 5) {
                    var injuredPlayers = tempRoadPlayers.filter(function (player) { return player.status === "OUT"; });
                    var availableSpots_2 = 5 - matchup.home.top_5.length;
                    var index_2 = 0;
                    while (availableSpots_2 > 0) {
                        matchup.home.top_5.push(injuredPlayers[index_2]);
                        index_2++;
                        availableSpots_2--;
                    }
                }
            }
        }
    }, []);
    var isPlayerLockedOut = function (lastGame) {
        return Date.now() >= new Date(lastGame).getTime();
    };
    var isTeamScoreLockedOut = function (lastFirstGame) {
        return Date.now() >= lastFirstGame;
    };
    var getFinalGameFormatted = function (lastGame) {
        var withRespectiveToTimezone = new Date(lastGame);
        return getStandardTime(withRespectiveToTimezone.getHours(), withRespectiveToTimezone.getMinutes());
    };
    var getTodayIsLastDay = function (lastGame) {
        var withRespectiveToTimezone = new Date(lastGame);
        withRespectiveToTimezone.setHours(0, 0, 0, 0);
        return Date.now() >= withRespectiveToTimezone.getTime();
    };
    if (!matchup) {
        return (_jsx(ErrorLander, { message: "Please return to the homepage and refresh..." }));
    }
    return (_jsx("div", { className: "w-full h-screen bg-gray-900", children: _jsx("div", { className: "z-10 items-stretch justify-start bg-gray-800 flex-col flex box-border relative", children: _jsxs("div", { className: "box-border flex relative  w-full flex-col justify-center text-white items-stretch", children: [_jsxs("div", { className: "flex flex-row w-full h-full pt-20 border-t-2", children: [_jsx("div", { className: "flex flex-col w-1/2 h-full", children: _jsxs("div", { className: "items-center  w-full flex-col flex justify-start box-border relative rounded-r-none pb-2", children: [_jsx("div", { className: "items-center w-full flex-col flex justify-start box-border relative ", children: _jsx("div", { className: "items-center w-full flex-col flex justify-start box-border relative", children: _jsxs("div", { className: "items-center w-full flex-col flex justify-start box-border relative", children: [_jsx("div", { className: "bg-no-repeat bg-center bg-contain w-full justify-center flex ", children: matchup.road.icon.length > 0 &&
                                                                !matchup.road.icon.startsWith("https://mystique") &&
                                                                !matchup.road.icon.startsWith("https://m.media-amazon") ? (_jsx("div", { className: "flex", children: _jsx("img", { src: matchup.road.icon, alt: "Can't Get Your PFP Buddy", className: "h-16 w-16 border-transparent border rounded-[40px]" }) })) : (_jsx("div", { className: "text-center text-[40px] pt-1 text-gray-200", children: _jsx(FontAwesomeIcon, { icon: faBasketball }) })) }), _jsxs("div", { className: " items-stretch justify-center text-center w-full flex-col flex box-border relative", children: [_jsx("span", { className: "font-[ProximaNova-Bold, serif] text-gray-200 text-lg wrap-break-word box-border overflow-hidden relative justify-center", children: getTeamNameIsTooLong(matchup.road.name)
                                                                        ? matchup.road.name.substring(0, 16) + "..."
                                                                        : matchup.road.name }), _jsx("span", { className: "font-[ProximaNova, serif] font-light text-gray-300 text-xs flex box-border overflow-hidden relative w-full justify-center", children: matchup.road.record }), _jsxs("span", { className: "font-[ProximaNova, serif] font-light text-white text-base flex box-border overflow-hidden relative w-full justify-center", children: [_jsx("span", { className: "font-[ProximaNova, serif] font-bold text-red-500 mr-2", children: "LIVE:" }), matchup.road.live_score, " fpts"] })] })] }) }) }), _jsx("div", { className: "w-full h-14 mt-2 items-center justify-center flex flex-row box-border relative px-6 py-1 ", children: isTeamScoreLockedOut(matchup.road.first_last_game) ? (_jsx(_Fragment, { children: _jsx("span", { className: "text-gray-500 uppercase", children: "first game started" }) })) : (_jsxs(_Fragment, { children: [_jsx(PropLine, { text: "O " + matchup.road.team_total.text, team: matchup.road.name, betType: propField[3], odds: matchup.road.team_total.over_odds, frontend_id: matchup.road.name + "/O/" + propField[3], oppId: matchup.road.name + "/U/" + propField[3] }), _jsx(PropLine, { text: "U " + matchup.road.team_total.text, team: matchup.road.name, betType: propField[3], odds: matchup.road.team_total.under_odds, frontend_id: matchup.road.name + "/U/" + propField[3], oppId: matchup.road.name + "/O/" + propField[3] })] })) })] }) }), _jsx("div", { className: "flex flex-col w-1/2 h-full", children: _jsxs("div", { className: "items-center w-full  flex-col flex justify-start box-border relative rounded-r-none pb-2", children: [_jsx("div", { className: "items-center w-full flex-col flex justify-start box-border relative", children: _jsxs("div", { className: "bg-gray-800 items-center w-full flex-col flex justify-start box-border relative", children: [_jsx("div", { className: "bg-no-repeat bg-center bg-contain w-full justify-center flex ", children: matchup.home.icon.length > 0 &&
                                                            !matchup.home.icon.startsWith("https://mystique") &&
                                                            !matchup.home.icon.startsWith("https://m.media-amazon") ? (_jsx("div", { className: "flex", children: _jsx("img", { src: matchup.home.icon, alt: "Can't Get Your PFP Buddy", className: "w-16 h-16 border-transparent border rounded-[40px]" }) })) : (_jsx("div", { className: "text-center text-[40px] pt-1 text-blue-400", children: _jsx(FontAwesomeIcon, { icon: faBasketball }) })) }), _jsxs("div", { className: " items-stretch justify-center text-center w-full flex-col flex box-border relative", children: [_jsx("span", { className: "font-[ProximaNova-Bold, serif] text-blue-400 text-lg wrap-break-word box-border overflow-hidden relative justify-center", children: getTeamNameIsTooLong(matchup.home.name)
                                                                    ? matchup.home.name.substring(0, 16) + "..."
                                                                    : matchup.home.name }), _jsx("span", { className: "font-[ProximaNova, serif] font-light text-gray-300 text-xs flex box-border overflow-hidden relative w-full justify-center", children: matchup.home.record }), _jsxs("span", { className: "font-[ProximaNova, serif] font-light text-white text-base flex box-border overflow-hidden relative w-full justify-center", children: [_jsx("span", { className: "font-[ProximaNova, serif] font-bold text-red-500 mr-2", children: "LIVE:" }), matchup.home.live_score, " fpts"] })] })] }) }), _jsx("div", { className: "w-full h-14 mt-2 items-center justify-center flex flex-row box-border relative px-6 py-1 ", children: isTeamScoreLockedOut(matchup.home.first_last_game) ? (_jsx(_Fragment, { children: _jsx("span", { className: "text-gray-500 uppercase", children: "first game started" }) })) : (_jsxs(_Fragment, { children: [_jsx(PropLine, { text: "O " + matchup.home.team_total.text, team: matchup.home.name, betType: propField[3], odds: matchup.home.team_total.over_odds, frontend_id: matchup.home.name + "/O/" + propField[3], oppId: matchup.home.name + "/U/" + propField[3] }), _jsx(PropLine, { text: "U " + matchup.home.team_total.text, team: matchup.home.name, betType: propField[3], odds: matchup.home.team_total.under_odds, frontend_id: matchup.home.name + "/U/" + propField[3], oppId: matchup.home.name + "/O/" + propField[3] })] })) })] }) })] }), _jsx("div", { className: "flex flex-row items-center justify-center w-full pb-2 border-b-gray-400 border-b-2 border-t-3 border-t-gray-400", children: _jsx("div", { className: "flex flex-col w-full justify-center items-center text-center", children: _jsx("span", { className: "font-[ProximaNova, serif] text-white font-bold pt-2", children: "Roster Info" }) }) }), _jsxs("div", { className: "flex flex-row items-center justify-center w-full grow", children: [_jsx("div", { className: "flex flex-row w-1/2 justify-center items-center text-center border-r-[0.5px] border-r-gray-400", children: _jsx("div", { className: "w-full flex flex-col justify-center text-center", children: _jsx("div", { className: "flex flex-col w-full justify-start", children: _jsx("div", { className: "w-full flex flex-col justify-center text-center", children: _jsx("div", { className: tasks.length > 0
                                                    ? "flex flex-col w-full justify-start mb-20"
                                                    : "flex flex-col w-full justify-start", children: matchup.road.top_5.slice(0, 5).map(function (player, index) { return (_jsxs("div", { className: "flex flex-col w-full border-b-2 border-b-gray-400", children: [_jsx("div", { className: "flex flex-row w-full justify-start ml-2 mt-1 font-bold items-start", children: _jsx("span", { className: "text-gray-300 text-xs", children: index + 1 }) }), _jsxs("div", { className: "flex flex-row justify-start text-4xl w-full", children: [_jsxs("div", { className: "flex w-2/8 justify-start flex-col items-center ml-2", children: [player.status === "ACTIVE" && (_jsx(FontAwesomeIcon, { className: "text-white", icon: faFaceGrin })), player.status === "DAY_TO_DAY" && (_jsx(FontAwesomeIcon, { className: "text-yellow-500", icon: faFaceGrimace })), player.status === "OUT" && (_jsx(FontAwesomeIcon, { className: "text-red-600", icon: faFaceDizzy }))] }), _jsxs("div", { className: "flex w-6/8 justify-start flex-col", children: [_jsx("div", { className: "flex flex-row justify-start items-center text-left", children: _jsx("span", { className: "text-base md:text-xl flex flex-col justify-start items-start", children: getPlayerNameIsTooLong(player.name)
                                                                                    ? player.name.substring(0, 15) + "..."
                                                                                    : player.name }) }), _jsx("div", { className: "flex flex-col justify-end w-full", children: _jsx("div", { className: "flex flex-row justify-start w-full", children: _jsx("div", { className: "flex flex-row w-full justify-start", children: _jsxs("span", { className: "text-xs text-gray-500 flex flex-col justify-end", children: [player.team, " " + player.position] }) }) }) })] })] }), _jsxs("div", { className: "flex flex-row justify-start w-full mt-2", children: [_jsx("div", { className: "flex flex-row justify-center w-1/2", children: _jsxs("div", { className: "flex flex-row justify-center text-sm items-center text-center", children: [_jsx("span", { className: "font-[ProximaNova, serif] font-bold text-blue-500 mr-1", children: "AVG:" }), roundToInteger(player.average.toString()) +
                                                                                " PPG"] }) }), _jsx("div", { className: "flex flex-row justify-center w-1/2 mr-1", children: _jsxs("div", { className: "flex flex-row justify-center text-sm items-center text-center", children: [_jsx("span", { className: "font-[ProximaNova, serif] font-bold text-green-500 mr-1", children: window.innerWidth < 469 ? "CUR:" : "TOTAL:" }), roundToInteger(player.live_total.toString()) +
                                                                                " PTS"] }) })] }), _jsx("div", { className: "flex flex-row justify-center w-full", children: _jsxs("div", { className: "flex flex-row justify-center text-sm items-center text-center my-2", children: [player.games_left == 1 &&
                                                                        getTodayIsLastDay(player.last_game) ? (_jsx("span", { className: "text-yellow-400 font-bold font-[ProximaNova, serif]", children: "Final Game Today @ " +
                                                                            getFinalGameFormatted(player.last_game) })) : (_jsx("span", { className: "font-[ProximaNova, serif] font-light text-white mr-1", children: "Games Left:" })), player.status === "OUT" ? (_jsx("span", { className: "text-gray-500", children: "TBD" })) : (_jsx("span", { children: player.games_left >= 1 &&
                                                                            !getTodayIsLastDay(player.last_game)
                                                                            ? player.games_left
                                                                            : "" }))] }) }), _jsx("div", { className: "w-full h-14 my-1 pt-2 items-center justify-center flex flex-row box-border border-t-1 border-t-gray-400 relative px-6 py-1 ", children: player.games_left < 1 ||
                                                                player.status === "OUT" ||
                                                                isPlayerLockedOut(player.last_game) ? (_jsx("div", { className: "text-gray-500 uppercase", children: isPlayerLockedOut(player.last_game) ? (_jsx("span", { children: "Last Game Started" })) : (_jsx("span", { children: player.status !== "OUT"
                                                                        ? "no games left"
                                                                        : player.status })) })) : (_jsxs(_Fragment, { children: [_jsx(PropLine, { text: "O " + player.prop_line.text, team: matchup.road.name, betType: propField[4], odds: player.prop_line.over_odds, frontend_id: player.name + "/O/" + propField[4], oppId: player.name + "/U/" + propField[4] }), _jsx(PropLine, { text: "U " + player.prop_line.text, team: matchup.road.name, betType: propField[4], odds: player.prop_line.under_odds, frontend_id: player.name + "/U/" + propField[4], oppId: player.name + "/O/" + propField[4] })] })) })] }, player.name)); }) }) }) }) }) }), _jsx("div", { className: "flex flex-row w-1/2 justify-center items-center text-center border-l-[0.5px] border-l-gray-400", children: _jsx("div", { className: "w-full flex flex-col justify-center text-center", children: _jsx("div", { className: "flex flex-col w-full justify-start", children: _jsx("div", { className: "w-full flex flex-col justify-center text-center", children: _jsx("div", { className: tasks.length > 0
                                                    ? "flex flex-col w-full justify-start mb-20"
                                                    : "flex flex-col w-full justify-start", children: matchup.home.top_5.slice(0, 5).map(function (player, index) { return (_jsxs("div", { className: "flex flex-col w-full border-b-2 border-b-gray-400", children: [_jsx("div", { className: "flex flex-row w-full justify-start ml-1 mt-1 font-bold items-start", children: _jsx("span", { className: "text-gray-300 text-xs", children: index + 1 }) }), _jsxs("div", { className: "flex flex-row justify-start text-4xl w-full", children: [_jsxs("div", { className: "flex w-2/8 justify-start flex-col items-center ml-2", children: [player.status === "ACTIVE" && (_jsx(FontAwesomeIcon, { className: "text-white", icon: faFaceGrin })), player.status === "DAY_TO_DAY" && (_jsx(FontAwesomeIcon, { className: "text-yellow-500", icon: faFaceGrimace })), player.status === "OUT" && (_jsx(FontAwesomeIcon, { className: "text-red-600", icon: faFaceDizzy }))] }), _jsxs("div", { className: "flex w-6/8 justify-start flex-col", children: [_jsx("div", { className: "flex flex-row justify-start items-center text-left", children: _jsx("span", { className: "text-base md:text-xl flex flex-col justify-start items-start", children: getPlayerNameIsTooLong(player.name)
                                                                                    ? player.name.substring(0, 15) + "..."
                                                                                    : player.name }) }), _jsx("div", { className: "flex flex-col justify-end w-full", children: _jsx("div", { className: "flex flex-row justify-start w-full", children: _jsx("div", { className: "flex flex-row w-full justify-start", children: _jsxs("span", { className: "text-xs text-gray-500 flex flex-col justify-end", children: [player.team, " " + player.position] }) }) }) })] })] }), _jsxs("div", { className: "flex flex-row justify-start w-full mt-2", children: [_jsx("div", { className: "flex flex-row justify-center w-1/2", children: _jsxs("div", { className: "flex flex-row justify-center text-sm items-center text-center", children: [_jsx("span", { className: "font-[ProximaNova, serif] font-bold text-blue-500 mr-1", children: "AVG:" }), roundToInteger(player.average.toString()) +
                                                                                " PPG"] }) }), _jsx("div", { className: "flex flex-row justify-center w-1/2 mr-1", children: _jsxs("div", { className: "flex flex-row justify-center text-sm items-center text-center", children: [_jsx("span", { className: "font-[ProximaNova, serif] font-bold text-green-500 mr-1", children: window.innerWidth < 469 ? "CUR:" : "TOTAL:" }), roundToInteger(player.live_total.toString()) +
                                                                                " PTS"] }) })] }), _jsx("div", { className: "flex flex-row justify-center w-full", children: _jsxs("div", { className: "flex flex-row justify-center text-sm items-center text-center my-2", children: [player.games_left == 1 &&
                                                                        getTodayIsLastDay(player.last_game) ? (_jsx("span", { className: "text-yellow-400 font-bold font-[ProximaNova, serif]", children: "Final Game Today @ " +
                                                                            getFinalGameFormatted(player.last_game) })) : (_jsx("span", { className: "font-[ProximaNova, serif] font-light text-white mr-1", children: "Games Left:" })), player.status === "OUT" ? (_jsx("span", { className: "text-gray-500", children: "TBD" })) : (_jsx("span", { children: player.games_left >= 1 &&
                                                                            !getTodayIsLastDay(player.last_game)
                                                                            ? player.games_left
                                                                            : "" }))] }) }), _jsx("div", { className: "w-full h-14 my-1 pt-2 items-center justify-center flex flex-row box-border border-t-1 border-t-gray-400 relative px-6 py-1 ", children: player.games_left < 1 ||
                                                                player.status === "OUT" ||
                                                                isPlayerLockedOut(player.last_game) ? (_jsx("div", { className: "text-gray-500 uppercase", children: isPlayerLockedOut(player.last_game) ? (_jsx("span", { children: "Last Game Started" })) : (_jsx("span", { children: player.status !== "OUT"
                                                                        ? "no games left"
                                                                        : player.status })) })) : (_jsxs(_Fragment, { children: [_jsx(PropLine, { text: "O " + player.prop_line.text, team: matchup.home.name, betType: propField[4], odds: player.prop_line.over_odds, frontend_id: player.name + "/O/" + propField[4], oppId: player.name + "/U/" + propField[4] }), _jsx(PropLine, { text: "U " + player.prop_line.text, team: matchup.home.name, betType: propField[4], odds: player.prop_line.under_odds, frontend_id: player.name + "/U/" + propField[4], oppId: player.name + "/O/" + propField[4] })] })) })] }, player.name)); }) }) }) }) }) })] })] }) }) }));
}
//# sourceMappingURL=Matchup.js.map