import { v5 as uuidv5 } from "uuid";
import { ParlaySlipProps } from "./components/parlays/Parlay";
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

export const demoParlays: ParlaySlipProps[] = [
  {
    id: "44d2e199-c29e-e300-984e-76e0c1435f67",
    isActive: false,
    isPayedOut: false,
    isWinner: false,
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
    timestamp: 1762659052276,
    totalOdds: -150,
    wager: 10,
  },
  {
    id: "7be5edb2-b80a-0e2c-b9df-913292fdfa90",
    isActive: true,
    isPayedOut: false,
    isWinner: false,
    legs: [
      {
        betType: "SPREAD BETTING",
        id: "SEB's TEAM-SPREAD BETTING",
        odds: -110,
        team: "SEB's TEAM",
        text: "+70.5",
      },
    ],
    payout: 19.09,
    timestamp: 1762659551675,
    totalOdds: -110,
    wager: 10,
  },
  {
    id: "77e798be-7a4a-bad0-c010-9afece9af2a9",
    isActive: false,
    isPayedOut: false,
    isWinner: false,
    legs: [
      {
        betType: "TOTAL POINTS",
        id: "SEB's TEAM-TOTAL POINTS",
        odds: -150,
        team: "SEB's TEAM v JEFE's TEAM",
        text: "O 3985.5",
      },
      {
        betType: "MONEYLINE",
        id: "SEB's TEAM-MONEYLINE",
        odds: 200,
        team: "SEB's TEAM",
        text: "",
      },
      {
        betType: "TOTAL POINTS",
        id: "JASON's TEAM-TOTAL POINTS",
        odds: -120,
        team: "JASON's TEAM v MICHAEL's TEAM",
        text: "O 3785.5",
      },
      {
        betType: "MONEYLINE",
        id: "MICHAEL's TEAM-MONEYLINE",
        odds: -120,
        team: "MICHAEL's TEAM",
        text: "",
      },
    ],
    payout: 168.06,
    timestamp: 1762659923491,
    totalOdds: 1581,
    wager: 10,
  },
  {
    id: "73d8db1c-5fc6-e506-b5dd-c796678143bd",
    isActive: false,
    isPayedOut: false,
    isWinner: true,
    legs: [
      {
        betType: "SPREAD BETTING",
        id: "JORDAN's TEAM-SPREAD BETTING",
        odds: -110,
        team: "JORDAN's TEAM",
        text: "+35.5",
      },
      {
        betType: "TOTAL POINTS",
        id: "JARON's TEAM-TOTAL POINTS",
        odds: 125,
        team: "JORDAN's TEAM v JARON's TEAM",
        text: "U 3985.5",
      },
      {
        betType: "TOTAL POINTS",
        id: "SEB's TEAM-TOTAL POINTS",
        odds: -150,
        team: "SEB's TEAM v JEFE's TEAM",
        text: "O 3985.5",
      },
      {
        betType: "SPREAD BETTING",
        id: "MICHAEL's TEAM-SPREAD BETTING",
        odds: -110,
        team: "MICHAEL's TEAM",
        text: "-100.5",
      },
      {
        betType: "SPREAD BETTING",
        id: "SEB's TEAM-SPREAD BETTING",
        odds: -110,
        team: "SEB's TEAM",
        text: "+70.5",
      },
    ],
    payout: 978.46,
    timestamp: 1762660109548,
    totalOdds: 9685,
    wager: 10,
  },
];

export const demo: MatchupProps[] = [
  {
    matchupSlate: [
      {
        teamProps: {
          icon: "IMAGE-2",
          name: "SEB's TEAM",
          record: "2-0",
          color: "text-white",
        },
        propLineProps: [
          { text: "+70.5", odds: -110 },
          { text: "O 3985.5", odds: -150 },
          { text: "", odds: +200 },
        ],
      },
      {
        teamProps: {
          icon: "IMAGE",
          name: "JEFE's TEAM",
          record: "2-0",
          color: "text-black",
        },
        propLineProps: [
          { text: "-70.5", odds: -110 },
          { text: "U 3985.5", odds: +125 },
          { text: "", odds: -120 },
        ],
      },
    ],
  },
  {
    matchupSlate: [
      {
        teamProps: {
          icon: "IMAGE-2",
          name: "JASON's TEAM",
          record: "0-2",
          color: "text-white",
        },
        propLineProps: [
          { text: "+100.5", odds: -150 },
          { text: "O 3785.5", odds: -120 },
          { text: "", odds: +275 },
        ],
      },
      {
        teamProps: {
          icon: "IMAGE",
          name: "MICHAEL's TEAM",
          record: "1-1",
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
          icon: "IMAGE-2",
          name: "JORDAN's TEAM",
          record: "0-2",
          color: "text-white",
        },
        propLineProps: [
          { text: "+35.5", odds: -110 },
          { text: "O 4100.5", odds: -220 },
          { text: "", odds: +200 },
        ],
      },
      {
        teamProps: {
          icon: "IMAGE",
          name: "JARON's TEAM",
          record: "1-1",
          color: "text-black",
        },
        propLineProps: [
          { text: "-35.5", odds: -150 },
          { text: "U 3985.5", odds: +125 },
          { text: "", odds: -185 },
        ],
      },
    ],
  },
];
