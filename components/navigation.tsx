"use client";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import {Arrow} from "./icons";
export function Navigation(){
const [open,setOpen]=useState(false);const trigger=useRef<HTMLButtonElement>(null);
useEffect(()=>{function close(e:KeyboardEvent){if(e.key==="Escape"&&open){setOpen(false);trigger.current?.focus()}} window.addEventListener("keydown",close);return()=>window.removeEventListener("keydown",close)},[open]);
return <header className="site-header"><Link className="wordmark" href="/" aria-label="Ycany Sanchez home">YCANY<span>.</span></Link><span className="header-caption mono">INDEPENDENT DEVELOPER</span><button className="menu-toggle" ref={trigger} type="button" aria-expanded={open} aria-controls="site-navigation" onClick={()=>setOpen(!open)}>{open?"Close":"Menu"}<span aria-hidden="true">{open?"−":"+"}</span></button><nav id="site-navigation" aria-label="Main navigation" className={open?"navigation is-open":"navigation"}><Link onClick={()=>setOpen(false)} href="/#work">Work <span>01</span></Link><Link onClick={()=>setOpen(false)} href="/#expertise">Expertise <span>02</span></Link><Link onClick={()=>setOpen(false)} href="/#about">About <span>03</span></Link><Link onClick={()=>setOpen(false)} href="/#contact" className="nav-contact">Let’s talk <Arrow/></Link></nav></header>
}
