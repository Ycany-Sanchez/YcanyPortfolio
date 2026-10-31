import {readFile} from "node:fs/promises";
import path from "node:path";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import {projects,getProject} from "@/lib/projects";
import {Arrow} from "@/components/icons";
import {ProjectArt} from "@/components/project-art";
import {SystemFlow} from "@/components/system-flow";
import {Footer} from "@/components/footer";
export function generateStaticParams(){return projects.map(p=>({slug:p.slug}))}
export const dynamicParams=false;
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const p=getProject(slug);return {title:p?.name??"Project not found",description:p?.summary,...(process.env.SITE_URL?{alternates:{canonical:"/work/"+slug}}:{})}}
const anchor=(title:string)=>title.toLowerCase().replace(/[^a-z0-9 ]/g,"").replace(/ +/g,"-");
export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){
const {slug}=await params;const project=getProject(slug);if(!project)notFound();
const content=await readFile(path.join(process.cwd(),"content",project.slug+".mdx"),"utf8");
const headings=[...content.matchAll(/^## (.+)$/gm)].map(m=>m[1]);
const next=projects[(projects.findIndex(p=>p.slug===slug)+1)%projects.length];
return <main id="main" className="case-page section-light">
<div className="case-intro section-pad"><Link className="text-link back-link mono" href="/#work"><Arrow direction="left"/> BACK TO SELECTED WORK</Link><div className="section-label mono"><span>CASE STUDY / {project.category.toUpperCase()}</span><span>{project.number} / 05</span></div><h1>{project.name}<span className="text-blue">.</span></h1><div className="case-summary"><p>{project.summary}</p><div><span className="mono">MY ROLE</span><ul>{project.roles.map(r=><li key={r}>{r}</li>)}</ul></div></div><div className="case-cover"><ProjectArt slug={slug} name={project.name} large/></div><div className="case-facts"><div><span className="mono">CONTEXT</span><p>{project.status}</p></div><div><span className="mono">BUILT WITH</span><p>{project.stack.join(" · ")}</p></div>{project.sourceUrl&&<a className="text-link" target="_blank" rel="noreferrer" href={project.sourceUrl}>{project.sourceLabel||"Explore source"}<Arrow/></a>}</div></div>
<div className="case-body section-pad"><aside className="case-index"><span className="mono">IN THIS CASE STUDY</span><nav aria-label="Case study contents">{headings.map((h,i)=><a href={"#"+anchor(h)} key={h}><span className="mono">0{i+1}</span>{h}</a>)}</nav></aside><article className="case-prose"><ReactMarkdown components={{h1:({children})=><p className="case-prose-title">{children}</p>,h2:({children})=><h2 id={anchor(String(children))}>{children}</h2>,a:({children,href})=><a href={href} target="_blank" rel="noreferrer">{children}</a>}}>{content}</ReactMarkdown><SystemFlow slug={slug}/></article></div>
{project.recognition.length>0&&<section className="case-recognition section-pad"><div className="section-label mono"><span>RECOGNITION</span><span>TEAM EFFORT. SHARED MILESTONES.</span></div>{project.recognition.map(a=><div className="recognition-row" key={a.title+a.event}><h2>{a.title}</h2><p>{a.event}</p></div>)}</section>}
{project.media.length>0&&<section className="case-gallery section-pad" aria-label="Project evidence"><div className="section-label mono"><span>FROM THE JOURNEY</span><span>ORIGINAL EVENT ANNOUNCEMENTS</span></div><div className="gallery-grid">{project.media.map(m=><figure key={m.src}><a href={m.src} target="_blank" rel="noreferrer" aria-label={"Open full image: "+m.alt}><Image src={m.src} alt={m.alt} width={1000} height={1000} sizes="(max-width: 760px) 90vw, 45vw" style={{width:"100%",height:"auto"}}/></a><figcaption>{m.caption}</figcaption></figure>)}</div></section>}
<section className="next-project section-dark section-pad"><div className="mono">CONTINUE EXPLORING / NEXT PROJECT</div><Link href={"/work/"+next.slug}>{next.name}<Arrow/></Link><Link className="text-link" href="/#contact">Have something in mind? Let’s talk <Arrow/></Link></section><div className="case-footer section-dark section-pad"><Footer/></div>
</main>}
