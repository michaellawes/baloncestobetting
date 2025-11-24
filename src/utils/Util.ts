import { v5 as uuidv5 } from "uuid";
import { propField } from "./Constants";
import { MatchupSchema, ParlayTask } from "./Interfaces";
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

export const getParlayLegStyling = (frontend_is_active: boolean) => {
  if (frontend_is_active) {
    return "flex mb-2 max-h-110 overflow-y-scroll scrollbar-hide w-full flex-col bg-gray-900";
  } else {
    return "flex mb-2 max-h-64 overflow-y-scroll scrollbar-hide w-full flex-col bg-gray-900";
  }
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

export const round5 = (x: number) => {
  return Math.ceil(x / 5) * 5;
};

export const roundToInteger = (value: string) => {
  return parseFloat(parseFloat(value).toFixed());
};
