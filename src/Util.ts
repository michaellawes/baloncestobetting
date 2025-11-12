import { v5 as uuidv5 } from "uuid";
import { MatchupProps } from "./components/dashboard/wagers/Matchup";

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
        propLineProps: [
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
        propLineProps: [
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
        propLineProps: [
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
        propLineProps: [
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
        propLineProps: [
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
        propLineProps: [
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
        propLineProps: [
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
        propLineProps: [
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
        propLineProps: [
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
        propLineProps: [
          { text: "-35.5", odds: -150 },
          { text: "U 4100.5", odds: 125 },
          { text: "", odds: -185 },
        ],
      },
    ],
  },
];

export interface prop {
  matchup_id: number; // 4
  team: string; // Michael-Jaron
  bet_type: string; // [SPREAD BETTING, TOTAL POINTS, MONEYLINE]
  prop_hit: boolean;
}
