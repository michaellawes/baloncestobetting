import { v5 as uuidv5 } from "uuid";
import { SupabaseParlay } from "../components/parlays/Parlay";
import { ParlayTask } from "../App";
import { PropLineInterface } from "../components/dashboard/wagers/PropLine";

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

export const oddsToDecimal = (value: number) => {
  if (value > 0) {
    return 1 + value / 100;
  } else {
    return 1 - 100 / value;
  }
};

export const decimalToOdds = (decimal: number) => {
  if (decimal >= 2) {
    return (decimal - 1) * 100;
  } else {
    return -100 / (decimal - 1);
  }
};

export const getUuid = (id: string) => {
  const MY_NAMESPACE = "1b671a64-40d5-491e-99b0-da01ff1f3341";
  return uuidv5(id, MY_NAMESPACE);
};

export interface Player {
  name: string;
  team: string;
  status: string;
  average: number;
  games_left: number;
  live_total: number;
  position: string;
}

export interface PropLineMetadata extends PropLineInterface {
  live_value: string;
}

export interface Team {
  icon: string;
  name: string;
  record: string;
  color: string;
  spread: PropLineMetadata;
  points: PropLineMetadata;
  moneyline: PropLineMetadata;
  live_score: number;
  top_5: Player[];
}

export interface MatchupSchema {
  road: Team;
  home: Team;
}

export const getSuffix = (rank: number) => {
  if (rank % 10 == 1) {
    return "st";
  } else if (rank % 10 == 2) {
    return "nd";
  } else if (rank % 10 == 3) {
    return "rd";
  } else {
    return "th";
  }
};

export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getParlayType = (numberOfLegs: number) => {
  return numberOfLegs === 1 ? "Same Game Parlay" : "Same Game Parlay+";
};

export const getParlayTypeAbbreviated = (numberOfLegs: number) => {
  return numberOfLegs === 1 ? "SGP" : "SGP+";
};

export const refactoredDemo: MatchupSchema[] = [
  {
    road: {
      icon: "https://i.postimg.cc/P535NpGk/IMG-8105.jpg",
      name: "Professor Coach's Pupils",
      record: "1-2",
      color: "text-white",
      spread: { live_value: "200.5", text: "+70.5", odds: -110 },
      points: { live_value: "3000", text: "O 3985.5", odds: -150 },
      moneyline: { live_value: "2300-2200", text: "", odds: 200 },
      live_score: 1352.8,
      top_5: [
        {
          name: "Scottie Barnes",
          live_total: 140,
          team: "TOR",
          status: "ACTIVE",
          average: 58.8,
          games_left: 1,
          position: "SF",
        },
        {
          name: "Alex Sarr",
          live_total: 5,
          team: "WAS",
          status: "ACTIVE",
          average: 53.59,
          games_left: 1,
          position: "C",
        },
        {
          name: "Pascal Siakam",
          live_total: 7,
          team: "IND",
          status: "ACTIVE",
          average: 52.63,
          games_left: 1,
          position: "PF",
        },
        {
          name: "Evan Mobley",
          live_total: 5,
          team: "CLE",
          status: "ACTIVE",
          average: 52.38,
          games_left: 1,
          position: "PF",
        },
        {
          name: "Keyonte George",
          live_total: 11,
          team: "UTA",
          status: "ACTIVE",
          average: 47.78,
          games_left: 1,
          position: "PG",
        },
      ],
    },
    home: {
      icon: "https://i.pinimg.com/236x/06/11/27/061127dd8493543cf15f06950bfd0c17.jpg",
      name: "Sacred timeline TVA",
      record: "1-2",
      color: "text-black",
      spread: { live_value: "200.5", text: "-70.5", odds: -110 },
      points: { live_value: "3000", text: "U 3985.5", odds: 125 },
      moneyline: { live_value: "2300-2200", text: "", odds: -120 },
      live_score: 1449.85,
      top_5: [
        {
          name: "Shai Gilgeous-Alexander",
          live_total: 140,
          team: "OKC",
          status: "ACTIVE",
          average: 73.23,
          games_left: 1,
          position: "PG",
        },
        {
          name: "Donovan Mitchell",
          live_total: 140,
          team: "CLE",
          status: "ACTIVE",
          average: 65.2,
          games_left: 1,
          position: "SG",
        },
        {
          name: "Jalen Duren",
          live_total: 6,
          team: "DET",
          status: "DAY_TO_DAY",
          average: 53.12,
          games_left: 0,
          position: "C",
        },
        {
          name: "Miles Bridges",
          live_total: 6,
          team: "CHA",
          status: "ACTIVE",
          average: 51.91,
          games_left: 1,
          position: "SF",
        },
        {
          name: "Jrue Holiday",
          live_total: 9,
          team: "POR",
          status: "ACTIVE",
          average: 50.83,
          games_left: 1,
          position: "PG",
        },
      ],
    },
  },
  {
    road: {
      icon: "https://i.postimg.cc/P535NpGk/IMG-8105.jpg",
      name: "Mr. Send That Vid",
      record: "2-1",
      color: "text-white",
      spread: { live_value: "200.5", text: "+100.5", odds: -150 },
      points: { live_value: "3000", text: "O 3785.5", odds: -120 },
      moneyline: { live_value: "2300-2200", text: "", odds: 275 },
      live_score: 1223.15,
      top_5: [
        {
          name: "Tyrese Maxey",
          live_total: 2,
          team: "PHL",
          status: "ACTIVE",
          average: 73.05,
          games_left: 0,
          position: "PG",
        },
        {
          name: "Josh Giddey",
          live_total: 5,
          team: "CHI",
          status: "DAY_TO_DAY",
          average: 64.27,
          games_left: 1,
          position: "SG",
        },
        {
          name: "Anthony Edwards",
          live_total: 16,
          team: "MIN",
          status: "ACTIVE",
          average: 55.78,
          games_left: 1,
          position: "SG",
        },
        {
          name: "Ivica Zubac",
          live_total: 8,
          team: "LAC",
          status: "ACTIVE",
          average: 45.48,
          games_left: 1,
          position: "C",
        },
        {
          name: "Kon Knueppel",
          live_total: 9,
          team: "CHA",
          status: "ACTIVE",
          average: 41.12,
          games_left: 1,
          position: "SG",
        },
      ],
    },
    home: {
      icon: "https://i.postimg.cc/P535NpGk/IMG-8105.jpg",
      name: "Ion Run It",
      record: "2-1",
      color: "text-black",
      spread: { live_value: "200.5", text: "-100.5", odds: -110 },
      points: { live_value: "3000", text: "U 3785.5", odds: -130 },
      moneyline: { live_value: "2300-2200", text: "", odds: -120 },
      live_score: 1422.05,
      top_5: [
        {
          name: "Austin Reaves",
          live_total: 2,
          team: "LAL",
          status: "ACTIVE",
          average: 65.01,
          games_left: 1,
          position: "SG",
        },
        {
          name: "Julius Randle",
          live_total: 2,
          team: "MIN",
          status: "ACTIVE",
          average: 62.76,
          games_left: 1,
          position: "PF",
        },
        {
          name: "Jalen Johnson",
          live_total: 4,
          team: "ATL",
          status: "ACTIVE",
          average: 61.08,
          games_left: 1,
          position: "PF",
        },
        {
          name: "Karl-Anthony Towns",
          live_total: 3,
          team: "NYK",
          status: "ACTIVE",
          average: 59.27,
          games_left: 0,
          position: "C",
        },
        {
          name: "Norman Powell",
          live_total: 7,
          team: "MIA",
          status: "ACTIVE",
          average: 51.25,
          games_left: 0,
          position: "SG",
        },
      ],
    },
  },
  {
    road: {
      icon: "https://i.postimg.cc/P535NpGk/IMG-8105.jpg",
      name: "Zeke's spinal fluid",
      record: "3-0",
      color: "text-white",
      spread: { live_value: "200.5", text: "+35.5", odds: -110 },
      points: { live_value: "3000", text: "O 3800.5", odds: -220 },
      moneyline: { live_value: "2300-2200", text: "", odds: 200 },
      live_score: 1617.0,
      top_5: [
        {
          name: "Nikola Jokic",
          live_total: 140,
          team: "DEN",
          status: "DAY_TO_DAY",
          average: 95.28,
          games_left: 1,
          position: "C",
        },
        {
          name: "Stephen Curry",
          live_total: 7,
          team: "GSW",
          status: "ACTIVE",
          average: 59.48,
          games_left: 1,
          position: "PG",
        },
        {
          name: "Jaylen Brown",
          live_total: 2,
          team: "BOS",
          status: "ACTIVE",
          average: 51.63,
          games_left: 1,
          position: "SF",
        },
        {
          name: "Stephon Castle",
          live_total: 10,
          team: "SAS",
          status: "ACTIVE",
          average: 50.22,
          games_left: 1,
          position: "PG",
        },
        {
          name: "Mikal Bridges",
          live_total: 8,
          team: "NYK",
          status: "ACTIVE",
          average: 47.99,
          games_left: 0,
          position: "SF",
        },
      ],
    },
    home: {
      icon: "https://i.postimg.cc/P535NpGk/IMG-8105.jpg",
      name: "Amen's Shampoo",
      record: "1-1",
      color: "text-black",
      spread: { live_value: "200.5", text: "-35.5", odds: -150 },
      points: { live_value: "3000", text: "U 3800.5", odds: 125 },
      moneyline: { live_value: "2300-2200", text: "", odds: -185 },
      live_score: 1419.9,
      top_5: [
        {
          name: "Alperen Sengun",
          live_total: 4,
          team: "HOU",
          status: "ACTIVE",
          average: 64.31,
          games_left: 1,
          position: "C",
        },
        {
          name: "Deni Avdija",
          live_total: 3,
          team: "POR",
          status: "ACTIVE",
          average: 54.95,
          games_left: 1,
          position: "SF",
        },
        {
          name: "Franz Wagner",
          live_total: 4,
          team: "ORL",
          status: "ACTIVE",
          average: 50.03,
          games_left: 1,
          position: "SF",
        },
        {
          name: "Trey Murphy III",
          live_total: 9,
          team: "NOP",
          status: "ACTIVE",
          average: 47.88,
          games_left: 1,
          position: "SF",
        },
        {
          name: "Nikola Vucevic",
          live_total: 10,
          team: "CHI",
          status: "ACTIVE",
          average: 46.63,
          games_left: 1,
          position: "C",
        },
      ],
    },
  },
  {
    road: {
      icon: "https://i.postimg.cc/P535NpGk/IMG-8105.jpg",
      name: "Haruko Warriors",
      record: "2-1",
      color: "text-white",
      spread: { live_value: "200.5", text: "+35.5", odds: -110 },
      points: { live_value: "3000", text: "O 3985.5", odds: -220 },
      moneyline: { live_value: "2300-2200", text: "", odds: 200 },
      live_score: 1375.1,
      top_5: [
        {
          name: "Victor Wembanyama",
          live_total: 2,
          team: "SAS",
          status: "ACTIVE",
          average: 74.0,
          games_left: 1,
          position: "C",
        },
        {
          name: "Lauri Markkanen",
          live_total: 3,
          team: "UTA",
          status: "ACTIVE",
          average: 59.18,
          games_left: 1,
          position: "PF",
        },
        {
          name: "Jalen Brunson",
          live_total: 8,
          team: "NYK",
          status: "DAY_TO_DAY",
          average: 57.47,
          games_left: 0,
          position: "PG",
        },
        {
          name: "Derrick White",
          live_total: 6,
          team: "BOS",
          status: "ACTIVE",
          average: 43.34,
          games_left: 1,
          position: "SG",
        },
        {
          name: "Aaron Gordon",
          live_total: 13,
          team: "DEN",
          status: "ACTIVE",
          average: 41.94,
          games_left: 1,
          position: "PF",
        },
      ],
    },
    home: {
      icon: "https://i.postimg.cc/P535NpGk/IMG-8105.jpg",
      name: "Kane Train \ud83d\ude82",
      record: "1-2",
      color: "text-black",
      spread: { live_value: "200.5", text: "-35.5", odds: -150 },
      points: { live_value: "3000", text: "U 3985.5", odds: 125 },
      moneyline: { live_value: "2300-2200", text: "", odds: -185 },
      live_score: 1699.95,
      top_5: [
        {
          name: "Cade Cunningham",
          live_total: 4,
          team: "DET",
          status: "DAY_TO_DAY",
          average: 67.5,
          games_left: 0,
          position: "PG",
        },
        {
          name: "Jamal Murray",
          live_total: 14,
          team: "DEN",
          status: "ACTIVE",
          average: 53.06,
          games_left: 1,
          position: "PG",
        },
        {
          name: "Kevin Durant",
          live_total: 8,
          team: "HOU",
          status: "ACTIVE",
          average: 49.95,
          games_left: 1,
          position: "PF",
        },
        {
          name: "Domantas Sabonis",
          live_total: 13,
          team: "SAC",
          status: "ACTIVE",
          average: 48.93,
          games_left: 1,
          position: "C",
        },
        {
          name: "Ryan Rollins",
          live_total: 3,
          team: "MIL",
          status: "ACTIVE",
          average: 46.15,
          games_left: 1,
          position: "SG",
        },
      ],
    },
  },
  {
    road: {
      icon: "https://i.postimg.cc/P535NpGk/IMG-8105.jpg",
      name: "TUGBOBO MEDICAL CENTER",
      record: "0-4",
      color: "text-white",
      spread: { live_value: "200.5", text: "+35.5", odds: -110 },
      points: { live_value: "3000", text: "O 4100.5", odds: -220 },
      moneyline: { live_value: "2300-2200", text: "", odds: 200 },
      live_score: 1388.45,
      top_5: [
        {
          name: "Luka Doncic",
          live_total: 5,
          team: "LAL",
          status: "ACTIVE",
          average: 81.87,
          games_left: 1,
          position: "PG",
        },
        {
          name: "James Harden",
          live_total: 6,
          team: "LAC",
          status: "ACTIVE",
          average: 65.95,
          games_left: 1,
          position: "PG",
        },
        {
          name: "Michael Porter Jr.",
          live_total: 10,
          team: "BKN",
          status: "ACTIVE",
          average: 50.4,
          games_left: 1,
          position: "SF",
        },
        {
          name: "Jarrett Allen",
          live_total: 17,
          team: "CLE",
          status: "ACTIVE",
          average: 41.6,
          games_left: 1,
          position: "C",
        },
        {
          name: "Jaden McDaniels",
          live_total: 18,
          team: "MIN",
          status: "ACTIVE",
          average: 41.28,
          games_left: 1,
          position: "SF",
        },
      ],
    },
    home: {
      icon: "https://i.postimg.cc/P535NpGk/IMG-8105.jpg",
      name: "Mad Wrld",
      record: "0-3",
      color: "text-black",
      spread: { live_value: "200.5", text: "-35.5", odds: -150 },
      points: { live_value: "3000", text: "U 4100.5", odds: 125 },
      moneyline: { live_value: "2300-2200", text: "", odds: -185 },
      live_score: 1234.8,
      top_5: [
        {
          name: "Giannis Antetokounmpo",
          live_total: 140,
          team: "MIL",
          status: "DAY_TO_DAY",
          average: 81.25,
          games_left: 1,
          position: "PF",
        },
        {
          name: "Devin Booker",
          live_total: 3,
          team: "PHO",
          status: "ACTIVE",
          average: 59.3,
          games_left: 1,
          position: "PG",
        },
        {
          name: "Jimmy Butler III",
          live_total: 5,
          team: "GSW",
          status: "ACTIVE",
          average: 48.79,
          games_left: 1,
          position: "SF",
        },
        {
          name: "Kyshawn George",
          live_total: 13,
          team: "WAS",
          status: "ACTIVE",
          average: 41.43,
          games_left: 1,
          position: "SG",
        },
        {
          name: "Onyeka Okongwu",
          live_total: 9,
          team: "ATL",
          status: "ACTIVE",
          average: 41.29,
          games_left: 1,
          position: "C",
        },
      ],
    },
  },
];

export const demoParlays: SupabaseParlay[] = [
  {
    user_id: "c967b5a2-479d-5b20-9c58-27e164630d33",
    parlay_id: "67",
    frontend_is_active: false,
    is_payed_out: false,
    is_winner: false,
    legs: [
      {
        betType: "SPREAD BETTING",
        frontend_id: "JASON-SPREAD BETTING",
        odds: -150,
        team: "JASON",
        text: "+100.5",
      },
    ],
    payout: 16.67,
    created_at: 1762659052276,
    total_odds: -150,
    wager: 10,
    matchup_id: 4,
    expires_at: 1762659052276,
  },
  {
    user_id: "c967b5a2-479d-5b20-9c58-27e164630d33",
    parlay_id: "5555",
    matchup_id: 4,
    total_odds: 596,
    payout: 139.16,
    wager: 20,
    frontend_is_active: false,
    is_winner: false,
    is_payed_out: false,
    legs: [
      {
        frontend_id: "Amen's Shampoo-SPREAD BETTING",
        team: "Amen's Shampoo",
        betType: "SPREAD BETTING",
        text: "+141.5",
        odds: -110,
      },
      {
        frontend_id: "Amen's Shampoo v Ion Run It-U 2821.5",
        team: "Amen's Shampoo v Ion Run It",
        betType: "TOTAL POINTS",
        text: "O 2821.5",
        odds: -110,
      },
      {
        frontend_id: "Kane Train 🚂-MONEYLINE",
        team: "Kane Train 🚂",
        betType: "MONEYLINE",
        text: "",
        odds: -110,
      },
    ],
    created_at: 1762973845208,
    expires_at: 1763417915502,
  },
];

export const propField = ["SPREAD BETTING", "TOTAL POINTS", "MONEYLINE"];

export const evaluateLeg = (leg: ParlayTask, event: number) => {
  if (leg.betType == propField[0]) {
    return event <= Number(leg.text);
  } else if (leg.betType == propField[1]) {
    const totalPointsProps = leg.text.split(" ");
    if (totalPointsProps[0] === "O") {
      return event > Number(totalPointsProps[1]);
    } else {
      return event < Number(totalPointsProps[1]);
    }
  } else {
    return event === 1;
  }
};

export const getPropTextWithRespectToScreenSize = (
  leg: ParlayTask,
  screenWidth: number,
) => {
  if (leg.betType !== propField[1]) {
    return `${leg.team} ${leg.text}`;
  } else {
    let teamMatchupString: string = leg.frontend_id.split("-")[0];
    if (screenWidth < 500) {
      teamMatchupString =
        leg.frontend_id.split("-")[0].substring(0, 40) + "...";
    }

    return `${teamMatchupString} ${leg.text}`;
  }
};

export const round5 = (x: number) => {
  return Math.ceil(x / 5) * 5;
};

export const progressBarWidth: Map<string, string> = new Map([
  [
    "0",
    "h-[4px] z-50 bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-2/100",
  ],
  [
    "5",
    "h-[4px] z-50 bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-5/100",
  ],
  [
    "10",
    "h-[4px] bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-10/100 z-50",
  ],
  [
    "15",
    "h-[4px] bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-15/100 z-50",
  ],
  [
    "20",
    "h-[4px] bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-20/100 z-50",
  ],
  [
    "25",
    "h-[4px] bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-25/100 z-50",
  ],
  [
    "30",
    "h-[4px] bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-30/100 z-50",
  ],
  [
    "35",
    "h-[4px] bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-35/100 z-50",
  ],
  [
    "40",
    "h-[4px] bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-40/100 z-50",
  ],
  [
    "45",
    "h-[4px] bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-45/100 z-50",
  ],
  [
    "50",
    "h-[4px] bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-50/100 z-50",
  ],
  [
    "55",
    "h-[4px] bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-55/100 z-50",
  ],
  [
    "60",
    "h-[4px] bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-60/100 z-50",
  ],
  [
    "65",
    "h-[4px] bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-65/100 z-50",
  ],
  [
    "70",
    "h-[4px] bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-70/100 z-50",
  ],
  [
    "75",
    "h-[4px] bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-75/100 z-50",
  ],
  [
    "80",
    "h-[4px] bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-80/100 z-50",
  ],
  [
    "85",
    "h-[4px] bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-100/100 z-50",
  ],
  [
    "90",
    "h-[4px] bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-100/100 z-50",
  ],
  [
    "95",
    "h-[4px] bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-100/100 z-50",
  ],
  [
    "100",
    "h-[4px] bg-blue-900 bases-0 grow flex-roxbox-border rounded-l-md relative w-100/100 z-50",
  ],
]);
