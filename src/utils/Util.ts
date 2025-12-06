import { v5 as uuidv5 } from "uuid";
import { propField } from "./Constants";
import {
  MatchupSchema,
  ParlayTask,
  SqlParlayMetadata,
  SqlPlayerLastGame,
  SqlPlayerMetadata,
  SqlPropSlate,
  SqlTeamMetadata,
  SupabaseParlay,
  Team,
} from "./Interfaces";
import supabase from "../config/supabaseConfig";
import html2canvas from "html2canvas-pro";

export const decimalToOdds = (decimal: number) => {
  if (decimal >= 2) {
    return (decimal - 1) * 100;
  } else {
    return -100 / (decimal - 1);
  }
};

const downloadImage = (blob: string, imageFileName: string) => {
  const fakeLink = window.document.createElement("a");
  fakeLink.style.display = "none";
  fakeLink.download = imageFileName;
  fakeLink.href = blob;
  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);
  fakeLink.remove();
};

export const evaluateLeg = (leg: ParlayTask, event: number) => {
  const betType =
    leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1];
  if (betType === propField[0]) {
    return event <= Number(leg.text);
  } else if (betType === propField[1]) {
    const totalPointsProps = leg.text.split(" ");
    if (totalPointsProps[0] === "O") {
      return event > Number(totalPointsProps[1]);
    } else {
      return event < Number(totalPointsProps[1]);
    }
  } else if (betType === propField[2]) {
    const matchup = leg.frontend_id.split("/")[0];
    if (matchup[0].includes(" v ")) {
      const teamNames = matchup.split(" v ");
      const roadName = teamNames[0];
      const homeName = teamNames[1];
      if (event === 1 && leg.team === homeName) {
        return true;
      } else return event === -1 && leg.team === roadName;
    } else {
      return event === 1;
    }
  } else if (betType === propField[3]) {
    const totalTeamScoreProps = leg.text.split(" ");
    if (totalTeamScoreProps[0] === "O") {
      return event > Number(totalTeamScoreProps[1]);
    } else {
      return event < Number(totalTeamScoreProps[1]);
    }
  } else if (betType === propField[4]) {
    const totalPlayerScoreProps = leg.text.split(" ");
    if (totalPlayerScoreProps[0] === "O") {
      return event > Number(totalPlayerScoreProps[1]);
    } else {
      return event < Number(totalPlayerScoreProps[1]);
    }
  }
};

export const exportAsImage = async (
  element: HTMLElement,
  imageFileName: string,
) => {
  const canvas = await html2canvas(element);
  const image = canvas.toDataURL("image/png", 1.0);
  downloadImage(image, imageFileName);
};

export const generateId = () => {
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
};

export const getAllParlayLegs = async (parlayIds: string[]) => {
  const { data, error } = await supabase
    .from("fb_parlay_legs")
    .select("*")
    .in("parlay_id", parlayIds);
  if (error) throw error;
  if (data) {
    return data;
  }
};

export const getAllPlayerLiveScores = (matchups: MatchupSchema[]) => {
  const allPlayerData = new Map<string, string>();
  for (const matchup of matchups) {
    for (const player of matchup.road.top_5) {
      allPlayerData.set(player.name, player.live_total.toString());
    }
    for (const player of matchup.home.top_5) {
      allPlayerData.set(player.name, player.live_total.toString());
    }
  }
  return allPlayerData;
};

export const getDaysSinceLastMonday = () => {
  return new Date().getDay() - 1;
};

export const getId = (
  teamName: string,
  text: string,
  secondIndex: number,
  roadName: string,
  homeName: string,
) => {
  return (
    (secondIndex === 1 ? roadName + " v " + homeName : teamName) +
    "/" +
    (secondIndex === 1
      ? text.substring(0, 1) + "/" + propField[secondIndex]
      : propField[secondIndex])
  );
};

export const getIndividualLegResultForParlays = async (
  parlay: SupabaseParlay,
) => {
  const matchup_id = Number(parlay.matchup_id);
  const query_ids = parlay.legs.map((leg: ParlayTask) => {
    const betType =
      leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1];
    if (betType === propField[4] || betType === propField[1]) {
      return leg.frontend_id.split("/")[0] + "/" + betType;
    } else {
      return leg.team + "/" + betType;
    }
  });

  const { data, error } = await supabase
    .from("fb_props")
    .select("*")
    .eq("matchup_id", matchup_id)
    .in("prop_id", query_ids);

  if (error) {
    console.log(error);
  }

  if (data) {
    const legDictionary = Object.assign(
      {},
      ...data.map((x) => ({ [x.prop_id]: x.live_value })),
    );
    for (const leg of parlay.legs) {
      const legTokens = leg.frontend_id.split("/");
      const betType = legTokens[legTokens.length - 1];
      const legId = legTokens[0] + "/" + betType;
      const lastLiveValue: number = legDictionary[legId];
      leg.did_hit = evaluateLeg(leg, lastLiveValue);
      leg.live_value =
        betType === propField[0]
          ? lastLiveValue
          : roundToInteger(lastLiveValue.toString());
    }
    parlay.is_winner = parlay.legs.every((leg: ParlayTask) => leg.did_hit);
    return parlay;
  }
};

export const getNotificationStyling = (type: string) => {
  if (type === "SUBMIT") {
    return "h-[16px] flex-row p-5 mt-16 fixed flex w-1/2 justify-center items-center text-center z-100 text-white bg-gray-900 border border-green-500 rounded-sm";
  } else if (type === "LIMIT") {
    return "h-[16px] flex-row p-5 mt-16 fixed flex w-1/2 justify-center items-center text-center z-100 text-white bg-gray-900 border border-red-500 rounded-sm";
  } else if (type === "CLIPBOARD") {
    return "h-[16px] flex-row p-5 mt-16 fixed flex w-1/2 justify-center items-center text-center z-100 text-white bg-gray-900 border border-blue-500 rounded-sm";
  } else if (type === "DOWNLOAD") {
    return "h-[16px] flex-row p-5 mt-16 fixed flex w-1/2 justify-center items-center text-center z-100 text-white bg-gray-900 border border-white rounded-sm";
  } else {
    return "h-[16px] flex-row p-5 mt-16 fixed flex w-1/2 justify-center items-center text-center z-100 text-white bg-gray-900 border border-gray-500 rounded-sm";
  }
};

export const getOppId = (
  oppName: string,
  oppPropText: string,
  secondIndex: number,
  roadName: string,
  homeName: string,
) => {
  const totalPointsTeam = roadName + " v " + homeName;
  return (
    (secondIndex === 1 ? totalPointsTeam : oppName) +
    "/" +
    (secondIndex === 1
      ? oppPropText.substring(0, 1) + "/" + propField[secondIndex]
      : propField[secondIndex])
  );
};

export const getOverUnderStyling = (prop: string) => {
  if (prop.startsWith("O")) {
    return "h-[4px] bg-green-400 basis-0 grow flex-rowbox-border rounded-md relative w-full";
  }
  return "h-[4px] bg-red-400 basis-0 grow flex-rowbox-border rounded-md relative w-full";
};

export const getParlayType = (numberOfLegs: number) => {
  return numberOfLegs === 1 ? "Same Game Parlay" : "Same Game Parlay+";
};

export const getParlayTypeAbbreviated = (numberOfLegs: number) => {
  return numberOfLegs === 1 ? "SGP" : "SGP+";
};

export const getParlaysWithLegs = async (fbParlays: SqlParlayMetadata[]) => {
  const frontendParlays: SupabaseParlay[] = [];
  const allParlayIds: string[] = fbParlays.map(
    (parlayMetadata) => parlayMetadata.parlay_id,
  );

  const allParlayLegs = await getAllParlayLegs(allParlayIds);
  const parlayIdToLegs = new Map<string, ParlayTask[]>();
  for (const leg of allParlayLegs) {
    const newLeg: ParlayTask = {
      text: leg["text"],
      team: leg["team"],
      odds: leg["odds"],
      matchup_id: leg["matchup_id"],
      day_id: leg["day_id"],
      parlay_id: leg["parlay_id"],
      frontend_id: leg["frontend_id"],
      index: leg["index"],
    };
    if (leg["live_value"] !== undefined && leg["live_value"] !== null) {
      newLeg.live_value = leg["live_value"];
    }
    if (leg["did_hit"] !== undefined && leg["did_hit"] !== null) {
      newLeg.did_hit = leg["did_hit"];
    }
    if (
      leg["special_leg_type"] !== undefined &&
      leg["special_leg_type"] !== null
    ) {
      newLeg.special_leg_type = leg["special_leg_type"];
    }
    if (parlayIdToLegs.has(leg.parlay_id)) {
      const legs: ParlayTask[] = parlayIdToLegs.get(leg.parlay_id);
      legs.push(newLeg);
      parlayIdToLegs.set(leg.parlay_id, legs);
    } else {
      const newLegs = [newLeg];
      parlayIdToLegs.set(leg.parlay_id, newLegs);
    }
  }
  for (const parlayId of allParlayIds) {
    const sortedLegs = parlayIdToLegs
      .get(parlayId)
      .sort((a, b) => a.index - b.index);
    parlayIdToLegs.set(parlayId, sortedLegs);
  }
  for (const parlay of fbParlays) {
    const frontendParlay: SupabaseParlay = {
      user_id: parlay.user_id,
      is_active: parlay.is_active,
      parlay_id: parlay.parlay_id,
      created_at: parlay.created_at,
      expires_at: parlay.expires_at,
      matchup_id: parlay.matchup_id,
      total_odds: parlay.total_odds,
      payout: parlay.payout,
      wager: parlay.wager,
      frontend_is_active: parlay.is_active,
      is_winner: parlay.is_winner,
      legs: parlayIdToLegs.get(parlay.parlay_id),
    };
    frontendParlays.push(frontendParlay);
  }
  return frontendParlays;
};

export const getPayoutWithRespectToScreenWidth = (payout: number) => {
  if (window.innerWidth < 501) {
    const fullText = `wins $${numberWithCommas(parseFloat(payout.toFixed(2)))}`;
    if (fullText.length > 20) {
      return "";
    } else if (fullText.length > 15) {
      return fullText.substring(0, 15) + "...";
    } else {
      return fullText;
    }
  } else {
    return `wins $${numberWithCommas(parseFloat(payout.toFixed(2)))}`;
  }
};

export const getPlayerNameIsTooLong = (playerName: string) => {
  return playerName.length > 15 && window.innerWidth < 501;
};

export const getPropTextWithRespectToScreenSize = (
  leg: ParlayTask,
  screenWidth: number,
) => {
  const betType =
    leg.frontend_id.split("/")[leg.frontend_id.split("/").length - 1];
  if (betType !== propField[1]) {
    if (betType === propField[4]) {
      return `${leg.frontend_id.split("/")[0]} ${leg.text}`;
    }
    return `${leg.team} ${leg.text}`;
  } else {
    let teamMatchupString: string = leg.frontend_id.split("/")[0];
    if (screenWidth < 500) {
      teamMatchupString =
        leg.frontend_id.split("/")[0].substring(0, 40) + "...";
    }

    return `${teamMatchupString} ${leg.text}`;
  }
};

export const getReadableDate = (d: Date) => {
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

export const getStandardTime = (hours: number, minutes: number) => {
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

export const getTeamData = (live_matchups: MatchupSchema[]) => {
  const teamData = new Map<string, Map<string, string>>();
  for (const matchup of live_matchups) {
    teamData.set(
      matchup.road.name,
      new Map<string, string>([
        ["live_score", matchup.road.live_score.toString()],
        ["live_spread", matchup.road.spread.live_value],
        ["live_points", matchup.road.points.live_value],
        ["live_moneyline", matchup.road.moneyline.live_value],
      ]),
    );
    for (const player of matchup.road.top_5) {
      teamData
        .get(matchup.road.name)
        .set(`${player.name}_score`, player.live_total.toString());
    }
    teamData.set(
      matchup.home.name,
      new Map<string, string>([
        ["live_score", matchup.home.live_score.toString()],
        ["live_spread", matchup.home.spread.live_value],
        ["live_points", matchup.home.points.live_value],
        ["live_moneyline", matchup.home.moneyline.live_value],
      ]),
    );
    for (const player of matchup.home.top_5) {
      teamData
        .get(matchup.home.name)
        .set(`${player.name}_score`, player.live_total.toString());
    }
  }
  return teamData;
};

export const getTeamNameIsTooLong = (teamName: string) => {
  return teamName.length > 16 && window.innerWidth < 469;
};

export const getUuid = (id: string) => {
  const MY_NAMESPACE = "1b671a64-40d5-491e-99b0-da01ff1f3341";
  return uuidv5(id, MY_NAMESPACE);
};

export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const oddsToDecimal = (value: number) => {
  if (value > 0) {
    return 1 + value / 100;
  } else {
    return 1 - 100 / value;
  }
};

export const getPropValue = (text: string) => {
  return text.substring(2);
};

const getPlayerLastGame = async () => {
  const { data, error } = await supabase
    .from("fb_player_last_game")
    .select("*");

  if (error) throw error;

  if (data) {
    return data;
  }
};

const getAllPlayerData = async () => {
  const { data, error } = await supabase
    .from("fb_players")
    .select("name, team, pos, status, fantasy_team_name, avg, games_left");

  if (error) throw error;

  if (data) {
    const typedData: SqlPlayerMetadata[] = data;
    const playerLastGameData: SqlPlayerLastGame[] = await getPlayerLastGame();
    const playerToLastGame = Object.assign(
      {},
      ...playerLastGameData.map((x) => ({ [x.name]: x.last_game })),
    );
    for (const player of typedData) {
      if (playerToLastGame[player.name] === undefined) {
        player.last_game = "";
      } else {
        player.last_game = playerToLastGame[player.name];
      }
    }
    return typedData;
  }
};

const getAllTeamData = async (teamNames: string[]) => {
  const { data, error } = await supabase
    .from("fb_fantasy_teams")
    .select("name, live_score, profile_url, wins, losses")
    .eq("league_id", 889646124)
    .in("name", teamNames);

  if (error) throw error;

  if (data) {
    return data;
  }
};

const getMatchupInformation = async (matchupId: number) => {
  const { data, error } = await supabase
    .from("fb_props")
    .select("*")
    .eq("matchup_id", matchupId);

  if (error) throw error;

  if (data) {
    const typedData: SqlPropSlate[] = data;
    const distinctTeams = Array.from(
      new Set<string>(
        typedData.map((prop_metadata) => prop_metadata.main_prop_id),
      ),
    );
    const allTeamMetadata: SqlTeamMetadata[] =
      await getAllTeamData(distinctTeams);
    const teamToMetadata = new Map<string, SqlTeamMetadata>();
    for (const teamMetadata of allTeamMetadata) {
      teamToMetadata.set(teamMetadata.name, teamMetadata);
    }

    const allPlayerMetadata: SqlPlayerMetadata[] = await getAllPlayerData();
    const playerToMetadata = new Map<string, SqlPlayerMetadata>();
    for (const playerMetadata of allPlayerMetadata) {
      playerToMetadata.set(playerMetadata.name, playerMetadata);
    }

    const matchups = Array.from(
      new Set(
        typedData.map((prop_metadata) => {
          if (prop_metadata.prop_id.split("/")[0].includes(" v ")) {
            return prop_metadata.prop_id.split("/")[0];
          }
        }),
      ),
    ).filter((matchup) => matchup !== undefined);
    const teamNameToTeam = new Map<string, Team>();
    for (const teamName of distinctTeams) {
      const metadata = teamToMetadata.get(teamName);
      teamNameToTeam.set(teamName, {
        icon: metadata.profile_url,
        name: teamName,
        top_5: [],
        team_total: { text: "", over_odds: 0, under_odds: 0 },
        points: { text: "", odds: 0, live_value: "" },
        live_score: metadata.live_score,
        record: `${metadata.wins}-${metadata.losses}`,
        moneyline: { text: "", odds: 0, live_value: "" },
        spread: { text: "", odds: 0, live_value: "" },
      });
    }

    const teamNameToMatchupName = new Map<string, string>();

    const matchupToMatchupSchema = new Map<string, MatchupSchema>();
    for (const matchup of matchups) {
      const teamNames = matchup.split(" v ");
      const roadTeam = teamNames[0];
      const homeTeam = teamNames[1];
      teamNameToMatchupName.set(roadTeam, matchup);
      teamNameToMatchupName.set(homeTeam, matchup);
      matchupToMatchupSchema.set(matchup, {
        road: teamNameToTeam.get(roadTeam),
        home: teamNameToTeam.get(homeTeam),
        isClose: false,
      });
    }
    for (const propInfo of typedData) {
      const propIdAndBetType = propInfo.prop_id.split("/");
      const propId = propIdAndBetType[0];
      const betType = propIdAndBetType[1];
      if (matchupToMatchupSchema.has(propId)) {
        const matchup = matchupToMatchupSchema.get(propId);
        const teamNames = propId.split(" v ");
        const homeTeam = teamNames[1];
        if (betType === propField[0]) {
          matchup.home.spread.odds = propInfo.main_prop_odds;
          matchup.road.spread.odds = propInfo.sub_prop_odds;
          matchup.home.spread.text =
            homeTeam === propInfo.main_prop_id
              ? "-" + propInfo.point_value
              : "+" + propInfo.point_value;
          matchup.road.spread.text =
            homeTeam !== propInfo.main_prop_id
              ? "-" + propInfo.point_value
              : "+" + propInfo.point_value;
        } else if (betType === propField[1]) {
          matchup.home.points.odds =
            homeTeam === propInfo.main_prop_id
              ? propInfo.main_prop_odds
              : propInfo.sub_prop_odds;
          matchup.road.points.odds =
            homeTeam !== propInfo.main_prop_id
              ? propInfo.main_prop_odds
              : propInfo.sub_prop_odds;
          matchup.home.points.text = "U " + propInfo.point_value;
          matchup.road.points.text = "O " + propInfo.point_value;
        } else if (betType === propField[2]) {
          matchup.home.moneyline.odds = propInfo.main_prop_odds;
          matchup.road.moneyline.odds = propInfo.sub_prop_odds;
        }
        matchupToMatchupSchema.set(propId, matchup);
      } else {
        if (teamNameToMatchupName.has(propId)) {
          const matchupName = teamNameToMatchupName.get(propId);
          const matchup = matchupToMatchupSchema.get(matchupName);
          const matchupTeam =
            matchup.home.name === propId ? matchup.home : matchup.road;
          matchupTeam.team_total.text = propInfo.point_value.toString();
          matchupTeam.team_total.over_odds = propInfo.main_prop_odds;
          matchupTeam.team_total.under_odds = propInfo.sub_prop_odds;
          matchupToMatchupSchema.set(matchupName, matchup);
        } else {
          const playerMetadata = playerToMetadata.get(propId);
          const matchupName = teamNameToMatchupName.get(propInfo.main_prop_id);
          const matchup = matchupToMatchupSchema.get(matchupName);
          if (matchup.home.name === propInfo.main_prop_id) {
            matchup.home.top_5.push({
              name: propId,
              average: playerMetadata.avg,
              position: playerMetadata.pos,
              status: playerMetadata.status,
              games_left: playerMetadata.games_left,
              team: playerMetadata.team,
              live_total: propInfo.live_value,
              prop_line: {
                text: propInfo.point_value.toString(),
                over_odds: propInfo.main_prop_odds,
                under_odds: propInfo.sub_prop_odds,
              },
              last_game: playerMetadata.last_game,
            });
          } else if (matchup.road.name === propInfo.main_prop_id) {
            matchup.road.top_5.push({
              name: propId,
              average: playerMetadata.avg,
              position: playerMetadata.pos,
              status: playerMetadata.status,
              games_left: playerMetadata.games_left,
              team: playerMetadata.team,
              live_total: propInfo.live_value,
              prop_line: {
                text: propInfo.point_value.toString(),
                over_odds: propInfo.main_prop_odds,
                under_odds: propInfo.sub_prop_odds,
              },
              last_game: playerMetadata.last_game,
            });
          }
          matchupToMatchupSchema.set(matchupName, matchup);
        }
      }
    }

    const weeklySlate: MatchupSchema[] = [];
    for (const matchup of matchups) {
      const matchupPropSlate: MatchupSchema =
        matchupToMatchupSchema.get(matchup);
      const roadLiveScore = matchupPropSlate.road.live_score;
      const homeLiveScore = matchupPropSlate.home.live_score;
      const roadName = matchupPropSlate.road.name;
      const homeName = matchupPropSlate.home.name;
      matchupPropSlate.road.top_5 = matchupPropSlate.road.top_5
        .sort((a, b) => b.average - a.average)
        .slice(
          0,
          matchupPropSlate.road.top_5.length < 10
            ? matchupPropSlate.road.top_5.length
            : 10,
        );
      matchupPropSlate.home.top_5 = matchupPropSlate.home.top_5
        .sort((a, b) => b.average - a.average)
        .slice(
          0,
          matchupPropSlate.home.top_5.length < 10
            ? matchupPropSlate.home.top_5.length
            : 10,
        );
      matchupPropSlate.road.moneyline.live_value =
        roadLiveScore === homeLiveScore
          ? "TIE"
          : homeLiveScore > roadLiveScore
            ? homeName
            : roadName;
      matchupPropSlate.road.spread.live_value =
        roadLiveScore === homeLiveScore
          ? "0.0"
          : (
              parseFloat((homeLiveScore - roadLiveScore).toFixed()) + 0.5
            ).toString();
      matchupPropSlate.road.points.live_value = (
        roadLiveScore + homeLiveScore
      ).toFixed();

      matchupPropSlate.home.moneyline.live_value =
        roadLiveScore === homeLiveScore
          ? "TIE"
          : homeLiveScore > roadLiveScore
            ? homeName
            : roadName;
      matchupPropSlate.home.spread.live_value =
        roadLiveScore === homeLiveScore
          ? "0.0"
          : (
              parseFloat((roadLiveScore - homeLiveScore).toFixed()) + 0.5
            ).toString();
      matchupPropSlate.home.points.live_value = (
        roadLiveScore + homeLiveScore
      ).toFixed();
      if (getDaysSinceLastMonday() == 6) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastDayRoadGamesSorted = matchupPropSlate.road.top_5
          .map((player) => new Date(player.last_game).getTime())
          .sort((a, b) => a - b)
          .filter((time) => time > today.getTime());
        matchupPropSlate.road.first_last_game = lastDayRoadGamesSorted[0];
        const lastDayHomeGamesSorted = matchupPropSlate.home.top_5
          .map((player) => new Date(player.last_game).getTime())
          .sort((a, b) => a - b)
          .filter((time) => time > today.getTime());
        matchupPropSlate.home.first_last_game = lastDayHomeGamesSorted[0];
        matchupPropSlate.lastGame = Math.max(
          lastDayHomeGamesSorted[lastDayHomeGamesSorted.length - 1],
          lastDayRoadGamesSorted[lastDayRoadGamesSorted.length - 1],
        );
      }
      weeklySlate.push(matchupPropSlate);
    }
    return weeklySlate;
  }
};

export const getDailySlate = async (matchupId: number) => {
  const matchupToMatchupSchema = await getMatchupInformation(matchupId);
  const slate = Array.from(matchupToMatchupSchema.values());
  for (const matchup of slate) {
    const roadScore =
      matchup.road.live_score > 0
        ? matchup.road.live_score
        : parseFloat(matchup.road.team_total.text);
    const homeScore =
      matchup.home.live_score > 0
        ? matchup.home.live_score
        : parseFloat(matchup.home.team_total.text);
    if (Math.abs(homeScore - roadScore) < 101) {
      matchup.isClose = true;
    }
  }
  return slate;
};

export const getTeamNameWithRespectToScreenSize = (teamName: string) => {
  if (window.innerWidth < 428) {
    return teamName.substring(0, 20) + "...";
  }
  return teamName;
};
export const round5 = (x: number) => {
  return Math.ceil(x / 5) * 5;
};

export const roundToInteger = (value: string) => {
  return parseFloat(parseFloat(value).toFixed());
};
