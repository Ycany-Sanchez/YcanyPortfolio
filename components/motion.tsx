"use client";
import {useEffect} from "react";
import {usePathname} from "next/navigation";
export function MotionController(){
const path=usePathname();
useEffect(()=>{
let active=true;let cleanup=()=>{};
const media=window.matchMedia("(prefers-reduced-motion: reduce)");
if(media.matches)return;
Promise.all([import("gsap"),import("gsap/ScrollTrigger")]).then(([{gsap},{ScrollTrigger}])=>{
if(!active)return;gsap.registerPlugin(ScrollTrigger);
const mm=gsap.matchMedia();cleanup=()=>mm.revert();
mm.add("(prefers-reduced-motion: no-preference)",()=>{
document.querySelectorAll<HTMLElement>("[data-reveal]").forEach(el=>{
gsap.fromTo(el,{y:30,opacity:0},{y:0,opacity:1,duration:.8,ease:"power3.out",clearProps:"transform,opacity",scrollTrigger:{trigger:el,start:"top 94%",once:true}});
});
if(document.querySelector(".hero-line > span"))gsap.fromTo(".hero-line > span",{y:"100%"},{y:"0%",duration:1.05,stagger:.12,ease:"power3.out",clearProps:"transform"});
if(document.querySelector(".sphere"))gsap.fromTo(".sphere",{opacity:0,rotate:-12},{opacity:1,rotate:0,duration:1.8,ease:"power2.out",clearProps:"transform,opacity"});
});
}).catch(()=>{ /* Content stays readable if the motion bundle is unavailable. */ });
return()=>{active=false;cleanup()};
},[path]);return null;
}
