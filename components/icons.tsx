export function Arrow({ direction = "up", className = "" }: { direction?: "up" | "right" | "down" | "left"; className?: string }) {
return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{transform:direction==="right"?"rotate(45deg)":direction==="down"?"rotate(135deg)":direction==="left"?"rotate(225deg)":undefined}}><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.4"/></svg>;
}
export function Star({className=""}:{className?:string}){return <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 0v64M0 32h64M9.4 9.4l45.2 45.2M9.4 54.6 54.6 9.4" stroke="currentColor" strokeWidth="1.5"/><circle cx="32" cy="32" r="12" stroke="currentColor"/></svg>}
