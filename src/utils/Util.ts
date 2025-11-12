import { v5 as uuidv5 } from "uuid";
import { MatchupProps } from "../components/dashboard/wagers/Matchup";
import { SupabaseParlay } from "../components/parlays/Parlay";
import { ParlayTask } from "../App";

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
    user_id: "c967b5a2-479d-5b20-9c58-27e164630d33",
    parlay_id: "44d2e199-c29e-e300-984e-76e0c1435f67",
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
    parlay_id: "42898341-32d3-9277-ccc0-58684ca67aeb",
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
        text: "U 2821.5",
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
    expires_at: 1762973845208,
  },
];

export const propField = ["SPREAD BETTING", "TOTAL POINTS", "MONEYLINE"];

export const evaluateLeg = (leg: ParlayTask, event: number) => {
  if (leg.betType == propField[0]) {
    if (leg.text.startsWith("-")) {
      return Number(leg.text) >= event;
    } else {
      return Number(leg.text) >= -1 * event;
    }
  } else if (leg.betType == propField[1]) {
    const totalPointsProps = leg.text.split(" ");
    if (totalPointsProps[0] === "O") {
      return event > Number(totalPointsProps[1]);
    } else {
      return event < Number(totalPointsProps[1]);
    }
  } else {
    return event;
  }
};
