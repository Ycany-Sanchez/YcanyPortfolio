import type {MetadataRoute} from "next";import {projects} from "@/lib/projects";
export default function sitemap():MetadataRoute.Sitemap{const base=(process.env.SITE_URL||"http://localhost:3000").replace(/\/$/,"");return [{url:base,changeFrequency:"monthly",priority:1},...projects.map(p=>({url:base+"/work/"+p.slug,changeFrequency:"monthly" as const,priority:.8}))]}
