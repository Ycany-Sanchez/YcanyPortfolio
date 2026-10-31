import type {Metadata,Viewport} from "next";
import "./globals.css";
import {Navigation} from "@/components/navigation";
import {MotionController} from "@/components/motion";
export const viewport:Viewport={themeColor:"#101114"};
export const metadata:Metadata={metadataBase:new URL(process.env.SITE_URL||"http://localhost:3000"),title:{default:"Ycany Sanchez — Full-stack developer",template:"%s — Ycany Sanchez"},description:"Full-stack developer in Cebu building backend systems, API integrations, AI features, and useful automations. Explore the work of Ycany Sanchez.",openGraph:{title:"Ycany Sanchez — Ideas into working systems.",description:"APIs. AI integrations. Automation. Thoughtful software for real problems.",type:"website",locale:"en_US"},twitter:{card:"summary_large_image"},robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body id="top"><a className="skip-link" href="#main">Skip to content</a><Navigation/>{children}<MotionController/></body></html>}
