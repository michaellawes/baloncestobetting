import { v5 as uuidv5 } from "uuid";
import { MatchupProps } from "../components/dashboard/wagers/Matchup";
import { SupabaseParlay } from "../components/parlays/Parlay";

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

export const demo: MatchupProps[] = [
  {
    matchupSlate: [
      {
        teamProps: {
          icon: "https://i.postimg.cc/P535NpGk/IMG-8105.jpg",
          name: "Michael",
          record: "1-2",
          color: "text-white",
        },
        propsLineProps: [
          { text: "+70.5", odds: -110 },
          { text: "O 3985.5", odds: -150 },
          { text: "", odds: 200 },
        ],
      },
      {
        teamProps: {
          icon: "",
          name: "Jaron",
          record: "1-2",
          color: "text-black",
        },
        propsLineProps: [
          { text: "-70.5", odds: -110 },
          { text: "U 3985.5", odds: 125 },
          { text: "", odds: -120 },
        ],
      },
    ],
  },
  {
    matchupSlate: [
      {
        teamProps: {
          icon: "",
          name: "Alex",
          record: "2-1",
          color: "text-white",
        },
        propsLineProps: [
          { text: "+100.5", odds: -150 },
          { text: "O 3785.5", odds: -120 },
          { text: "", odds: 275 },
        ],
      },
      {
        teamProps: {
          icon: "",
          name: "Jovawn",
          record: "2-1",
          color: "text-black",
        },
        propsLineProps: [
          { text: "-100.5", odds: -110 },
          { text: "U 3785.5", odds: -130 },
          { text: "", odds: -120 },
        ],
      },
    ],
  },
  {
    matchupSlate: [
      {
        teamProps: {
          icon: "",
          name: "Seb",
          record: "3-0",
          color: "text-white",
        },
        propsLineProps: [
          { text: "+35.5", odds: -110 },
          { text: "O 3800.5", odds: -220 },
          { text: "", odds: 200 },
        ],
      },
      {
        teamProps: {
          icon: "",
          name: "Jaden",
          record: "1-1",
          color: "text-black",
        },
        propsLineProps: [
          { text: "-35.5", odds: -150 },
          { text: "U 3800.5", odds: 125 },
          { text: "", odds: -185 },
        ],
      },
    ],
  },
  {
    matchupSlate: [
      {
        teamProps: {
          icon: "",
          name: "Justin",
          record: "2-1",
          color: "text-white",
        },
        propsLineProps: [
          { text: "+35.5", odds: -110 },
          { text: "O 3985.5", odds: -220 },
          { text: "", odds: 200 },
        ],
      },
      {
        teamProps: {
          icon: "",
          name: "Jordan",
          record: "1-2",
          color: "text-black",
        },
        propsLineProps: [
          { text: "-35.5", odds: -150 },
          { text: "U 3985.5", odds: 125 },
          { text: "", odds: -185 },
        ],
      },
    ],
  },
  {
    matchupSlate: [
      {
        teamProps: {
          icon: "",
          name: "Iyin",
          record: "0-4",
          color: "text-white",
        },
        propsLineProps: [
          { text: "+35.5", odds: -110 },
          { text: "O 4100.5", odds: -220 },
          { text: "", odds: 200 },
        ],
      },
      {
        teamProps: {
          icon: "",
          name: "Jason",
          record: "0-3",
          color: "text-black",
        },
        propsLineProps: [
          { text: "-35.5", odds: -150 },
          { text: "U 4100.5", odds: 125 },
          { text: "", odds: -185 },
        ],
      },
    ],
  },
];

export const demoParlays: SupabaseParlay[] = [
  {
    parlay_id: "44d2e199-c29e-e300-984e-76e0c1435f67",
    is_active: false,
    is_payed_out: false,
    is_winner: false,
    legs: [
      {
        betType: "SPREAD BETTING",
        id: "JASON's TEAMSPREAD BETTING",
        odds: -150,
        team: "JASON's TEAM",
        text: "+100.5",
      },
    ],
    payout: 16.67,
    created_at: 1762659052276,
    total_odds: -150,
    wager: 10,
    user_id: "",
    matchup_id: 4,
    expires_at: Date.now(),
  },
];

export interface prop {
  matchup_id: number; // 4
  team: string; // Michael-Jaron
  bet_type: string; // [SPREAD BETTING, TOTAL POINTS, MONEYLINE]
  prop_hit: boolean;
}
