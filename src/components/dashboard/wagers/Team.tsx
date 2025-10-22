export interface TeamProps {
    name: string,
    icon: string,
    record: string,
}
export function Team(props: TeamProps) {
    return (
        <div className="team">
            <div className="team-icon">{props.icon}</div>
            <div className="team-name">{props.name}</div>
            <div className="team-record">{props.record}</div>
        </div>
    )
}