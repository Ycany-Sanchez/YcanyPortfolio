"use client";
import {useEffect,useState} from "react";
export function MotionToggle(){const [paused,setPaused]=useState(false);useEffect(()=>{try{const saved=sessionStorage.getItem("ycany-motion")==="paused";setPaused(saved);document.documentElement.dataset.motion=saved?"paused":"on"}catch{}},[]);
function toggle(){const next=!paused;setPaused(next);document.documentElement.dataset.motion=next?"paused":"on";try{sessionStorage.setItem("ycany-motion",next?"paused":"on")}catch{}}
return <button type="button" className="motion-toggle mono" onClick={toggle} aria-label={paused?"Resume motion":"Pause motion"} aria-pressed={paused}>{paused?"RESUME MOTION":"PAUSE MOTION"} <span aria-hidden="true">{paused?"▷":"Ⅱ"}</span></button>}
