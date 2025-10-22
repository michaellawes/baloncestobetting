
export interface AuthProps {
    icon: string,
}

export function Auth(props: AuthProps) {
    const { icon } = props;
    return (
        <div className="auth-wrapper">
            <div className="user-icon">
                {icon}
            </div>
        </div>
    )
}