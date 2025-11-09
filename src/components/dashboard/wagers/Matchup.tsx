// @ts-expect-error TS 5.0+ is broken
import { Team, TeamProps } from "./Team.tsx";
import { PropLine, PropLineInterface } from "./PropLine";

const TABLE_HEAD = ["Matchup", "Spread", "Points", "Moneyline"];

export interface MatchupProps {
  matchupSlate: TeamSlate[];
}

export interface TeamSlate {
  teamProps: TeamProps;
  propLineProps: PropLineInterface[];
}

const propField = ["SPREAD BETTING", "TOTAL POINTS", "MONEYLINE"];

export function Matchup(props: MatchupProps) {
  const totalPointsTeam =
    props.matchupSlate[0].teamProps.name +
    " v " +
    props.matchupSlate[1].teamProps.name;
  return (
    <table className="w-full min-w-max table-auto text-left rounded-xs bg-blue-800 border-2 ">
      <thead>
        <tr>
          {TABLE_HEAD.map((head) => (
            <th
              key={head}
              className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-white"
            >
              <span className="font-bold leading-none">{head}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.matchupSlate.map(({ teamProps, propLineProps }, index) => {
          const isLast = index === props.matchupSlate.length - 1;
          const classes = isLast ? "p-4" : "p-4 border-b border-gray-100";
          return (
            <tr key={index}>
              <td className={classes}>
                <Team {...teamProps}></Team>
              </td>
              {propLineProps.map((propLineProp, secondIndex) => (
                <td className={classes} key={secondIndex}>
                  <PropLine
                    team={secondIndex === 1 ? totalPointsTeam : teamProps.name}
                    betType={propField[secondIndex]}
                    text={propLineProp.text}
                    odds={propLineProp.odds}
                    id={
                      props.matchupSlate[index].teamProps.name +
                      propField[secondIndex]
                    }
                    oppId={
                      props.matchupSlate[index ^ 1].teamProps.name +
                      propField[secondIndex]
                    }
                  />
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
