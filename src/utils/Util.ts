import { v5 as uuidv5 } from "uuid";
import { propField } from "./Constants";
import {
  MatchupSchema,
  ParlayTask,
  SqlPlayerMetadata,
  SqlPropSlate,
  SqlTeamMetadata,
  Team,
} from "./Interfaces";
import { SupabaseParlay } from "../components/parlays/Parlay";
import supabase from "../config/supabaseConfig";
import html2canvas from "html2canvas-pro";

export const decimalToOdds = (decimal: number) => {
  if (decimal >= 2) {
    return (decimal - 1) * 100;
  } else {
    return -100 / (decimal - 1);
  }
};

const downloadImage = async (blob: string, imageFileName: string) => {
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
  if (leg.betType === propField[0]) {
    return event <= Number(leg.text);
  } else if (leg.betType === propField[1]) {
    const totalPointsProps = leg.text.split(" ");
    if (totalPointsProps[0] === "O") {
      return event > Number(totalPointsProps[1]);
    } else {
      return event < Number(totalPointsProps[1]);
    }
  } else if (leg.betType === propField[2]) {
    return event === 1;
  } else if (leg.betType === propField[3]) {
    const totalTeamScoreProps = leg.text.split(" ");
    if (totalTeamScoreProps[0] === "O") {
      return event > Number(totalTeamScoreProps[1]);
    } else {
      return event < Number(totalTeamScoreProps[1]);
    }
  } else if (leg.betType === propField[4]) {
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

export const getDaysSinceLastMonday = () => {
  return new Date().getDay() - 1;
};

export const getIndividualLegResultForParlays = async (
  parlay: SupabaseParlay,
) => {
  const matchup_id = Number(parlay.matchup_id);
  const query_ids = parlay.legs.map((leg) => {
    if (leg.betType === propField[4] || leg.betType === propField[1]) {
      return leg.frontend_id.split("/")[0] + "/" + leg.betType;
    } else {
      return leg.team + "/" + leg.betType;
    }
  });

  const { data, error } = await supabase
    .from("legs")
    .select("*")
    .eq("matchup_id", matchup_id)
    .in("id", query_ids);

  if (error) {
    console.log(error);
  }

  if (data) {
    const legDictionary = Object.assign(
      {},
      ...data.map((x) => ({ [x.id]: x.point_value })),
    );
    for (const leg of parlay.legs) {
      const legId =
        leg.betType !== propField[4] && leg.betType !== propField[1]
          ? leg.team + "/" + leg.betType
          : leg.frontend_id.split("/")[0] + "/" + leg.betType;
      const lastLiveValue: number = legDictionary[legId];
      /*if (lastLiveValue === undefined) {
        console.log(legId);
        leg.didHit = false;
        leg.lastValue = 0;
        console.log(
          `For ${legId} the lastLiveValue ${lastLiveValue} and it was true is? ${leg.didHit}`,
        );
      } else {*/
      leg.didHit = evaluateLeg(leg, lastLiveValue);
      leg.lastValue =
        leg.betType === propField[0]
          ? lastLiveValue
          : roundToInteger(lastLiveValue.toString());
      //}
    }
    parlay.is_winner = parlay.legs.every((leg) => leg.didHit);
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
  } else {
    return "h-[16px] flex-row p-5 mt-16 fixed flex w-1/2 justify-center items-center text-center z-100 text-white bg-gray-900 border border-gray-500 rounded-sm";
  }
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
  if (leg.betType !== propField[1]) {
    if (leg.betType === propField[4]) {
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

export const getReadableDate = (timestamp: number) => {
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

/*
export interface Team {
  icon: string;
  name: string;
  record: string;
  spread: PropLineMetadata;
  points: PropLineMetadata;
  moneyline: PropLineMetadata;
  live_score: number;
  team_total: IndividualLineMetadata;
  top_5: Player[];
}
* */

const getAllPlayerData = async (matchupId: number) => {
  const { data, error } = await supabase
    .from("fb_players")
    .select(
      "name, team, pos, live_score, status, fantasy_team_name, avg, games_left",
    )
    .eq("matchup_id", matchupId);

  if (error) throw error;

  if (data) {
    return data;
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
    .eq("matchup_id", matchupId)
    .eq("day_id", getDaysSinceLastMonday());

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

    const allPlayerMetadata: SqlPlayerMetadata[] =
      await getAllPlayerData(matchupId);
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
      });
    }
    const playerPropInfo: SqlPropSlate[] = [];
    for (const propInfo of typedData) {
      const propIdAndBetType = propInfo.prop_id.split("/");
      const propId = propIdAndBetType[0];
      const betType = propIdAndBetType[1];
      if (matchupToMatchupSchema.has(propId)) {
        const matchup = matchupToMatchupSchema.get(propId);
        const teamNames = propId.split(" v ");
        const homeTeam = teamNames[1];
        if (betType === propField[0]) {
          matchup.home.spread.odds =
            homeTeam === propInfo.main_prop_id
              ? propInfo.main_prop_odds
              : propInfo.sub_prop_odds;
          matchup.road.spread.odds =
            homeTeam !== propInfo.main_prop_id
              ? propInfo.main_prop_odds
              : propInfo.sub_prop_odds;
          matchup.home.spread.text =
            homeTeam === propInfo.main_prop_id
              ? "- " + propInfo.point_value
              : "+ " + propInfo.point_value;
          matchup.road.spread.text =
            homeTeam !== propInfo.main_prop_id
              ? "- " + propInfo.point_value
              : "+ " + propInfo.point_value;
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
          matchup.home.moneyline.odds =
            homeTeam === propInfo.main_prop_id
              ? propInfo.main_prop_odds
              : propInfo.sub_prop_odds;
          matchup.road.moneyline.odds =
            homeTeam !== propInfo.main_prop_id
              ? propInfo.main_prop_odds
              : propInfo.sub_prop_odds;
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
          console.log(propInfo);
          const playerMetadata = playerToMetadata.get(propId);
          const matchupName = teamNameToMatchupName.get(propInfo.main_prop_id);
          const matchup = matchupToMatchupSchema.get(matchupName);
          console.log(`${propId} is on ${propInfo.main_prop_id}`);
          if (matchup.home.name === propInfo.main_prop_id) {
            matchup.home.top_5.push({
              name: propId,
              average: playerMetadata.avg,
              position: playerMetadata.pos,
              status: playerMetadata.status,
              games_left: playerMetadata.games_left,
              team: playerMetadata.team,
              live_total: playerMetadata.live_score,
              prop_line: {
                text: propInfo.point_value.toString(),
                over_odds: propInfo.main_prop_odds,
                under_odds: propInfo.sub_prop_odds,
              },
            });
          } else if (matchup.road.name === propInfo.main_prop_id) {
            matchup.road.top_5.push({
              name: propId,
              average: playerMetadata.avg,
              position: playerMetadata.pos,
              status: playerMetadata.status,
              games_left: playerMetadata.games_left,
              team: playerMetadata.team,
              live_total: playerMetadata.live_score,
              prop_line: {
                text: propInfo.point_value.toString(),
                over_odds: propInfo.main_prop_odds,
                under_odds: propInfo.sub_prop_odds,
              },
            });
            console.log(
              `Matchup Road Top 5 Size: ${matchup.road.top_5.length}`,
            );
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
      weeklySlate.push(matchupPropSlate);
    }
    console.log(weeklySlate);
    return weeklySlate;
  }
};

export const getDailySlate = async (matchupId: number) => {
  const matchupToMatchupSchema = await getMatchupInformation(matchupId);
  return Array.from(matchupToMatchupSchema.values());
};

export const round5 = (x: number) => {
  return Math.ceil(x / 5) * 5;
};

export const roundToInteger = (value: string) => {
  return parseFloat(parseFloat(value).toFixed());
};
