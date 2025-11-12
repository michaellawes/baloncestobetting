// @ts-expect-error TS 5.0+ is broken
import { Team, TeamProps } from "./Team.tsx";
import { PropLine, PropLineInterface } from "./PropLine";

const TABLE_HEAD = ["Matchup", "Spread", "Points", "Moneyline"];

export interface MatchupProps {
  matchupSlate: TeamSlate[];
}

export interface TeamSlate {
  teamProps: TeamProps;
  propsLineProps: PropLineInterface[];
}

const propField = ["SPREAD BETTING", "TOTAL POINTS", "MONEYLINE"];

export function Matchup(props: MatchupProps) {
  const totalPointsTeam =
    props.matchupSlate[0].teamProps.name +
    " v " +
    props.matchupSlate[1].teamProps.name;

  const getOppId = (
    props: MatchupProps,
    index: number,
    secondIndex: number,
  ) => {
    return (
      (secondIndex === 1
        ? totalPointsTeam
        : props.matchupSlate[index ^ 1].teamProps.name) +
      "-" +
      (secondIndex === 1
        ? props.matchupSlate[index ^ 1].propsLineProps[1].text
        : propField[secondIndex])
    );
  };

  const getId = (
    teamProps: TeamProps,
    propLineProp: PropLineInterface,
    secondIndex: number,
  ) => {
    return (
      (secondIndex === 1 ? totalPointsTeam : teamProps.name) +
      "-" +
      (secondIndex === 1 ? propLineProp.text : propField[secondIndex])
    );
  };

  // have table-auto only effect desktop
  return (
    <table className="w-full min-w-max table-fixed md:table-auto text-left rounded-xs bg-blue-800 border-2 ">
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
        {props.matchupSlate.map(({ teamProps, propsLineProps }, index) => {
          const isLast = index === props.matchupSlate.length - 1;
          const classes = isLast ? "p-4" : "p-4 border-b border-gray-100";
          return (
            <tr key={index} className="w-full">
              <td className={classes}>
                <Team {...teamProps}></Team>
              </td>
              {propsLineProps.map((propLineProp, secondIndex) => (
                <td className={classes} key={secondIndex}>
                  <PropLine
                    team={secondIndex === 1 ? totalPointsTeam : teamProps.name}
                    betType={propField[secondIndex]}
                    text={propLineProp.text}
                    odds={propLineProp.odds}
                    id={getId(teamProps, propLineProp, secondIndex)}
                    oppId={getOppId(props, index, secondIndex)}
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
