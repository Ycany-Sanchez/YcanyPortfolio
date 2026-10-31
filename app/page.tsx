import Image from "next/image";
import Link from "next/link";
import {Arrow,Star} from "@/components/icons";
import {MotionToggle} from "@/components/motion-toggle";
import {Sphere} from "@/components/sphere";
import {ProjectArt} from "@/components/project-art";
import {ContactForm} from "@/components/contact-form";
import {Footer} from "@/components/footer";
import {projects,profile} from "@/lib/projects";
const services=[
{number:"01",title:"Backend & APIs",description:"Application logic, databases, and APIs that bring the moving parts together.",tools:"NODE.JS / JAVA / PYTHON / MYSQL"},
{number:"02",title:"AI integration",description:"Connect language models and data to useful features, with clear inputs and structured outputs.",tools:"LLM APIs / CONTENT ANALYSIS / DATA PIPELINES"},
{number:"03",title:"Workflow automation",description:"Connect your tools and turn repetitive steps into a workflow you can follow and maintain.",tools:"N8N / REST APIs / THIRD-PARTY INTEGRATIONS"}
];
export default function Home(){
const configured=!!(process.env.RESEND_API_KEY&&process.env.CONTACT_FROM_EMAIL);
return <main id="main">
<section className="hero section-dark" aria-labelledby="hero-title">
<div className="hero-topline mono"><span><span className="status-dot"/> FULL-STACK DEVELOPER</span><span>BASED IN CEBU, PHILIPPINES</span></div>
<div className="hero-composition"><div className="hero-copy"><h1 id="hero-title"><span className="hero-line"><span>Ideas into</span></span><span className="hero-line"><span>working</span></span><span className="hero-line"><span className="text-blue">systems.</span></span></h1><div className="hero-description"><p>I connect APIs, build backends, and turn complex workflows into useful digital experiences.</p><a className="text-link hero-link" href="#work">Explore selected work <span className="circle-arrow"><Arrow direction="down"/></span></a></div></div><Sphere/></div>
<div className="hero-bottom mono"><span>CODE WITH INTENT. BUILD WITH PURPOSE.</span><MotionToggle/><a href="#work">SCROLL TO EXPLORE <Arrow direction="down"/></a></div>
</section>
<section id="work" className="work-section section-light section-pad">
<div className="section-label mono"><span>(01 — SELECTED WORK)</span><span>IDEAS MADE TANGIBLE / 2025—2026</span></div>
<div className="section-heading" data-reveal><h2>Built around<br/>real problems<span className="text-blue">.</span></h2><p>School projects. Hackathon builds.<br/>A growing body of hands-on work.</p></div>
<div className="featured-projects">{projects.filter(p=>p.featured).map(p=><article className={"project project-"+p.slug} key={p.slug} data-reveal><Link className="project-cover" href={"/work/"+p.slug} aria-label={"Explore "+p.name+" case study"}><ProjectArt slug={p.slug} name={p.name}/></Link><div className="project-info"><div><span className="mono project-category">{p.number} / {p.category}</span><h3><Link href={"/work/"+p.slug}>{p.name}<Arrow/></Link></h3></div><p>{p.tagline}</p></div><div className="project-bottom mono"><span>{p.roles.slice(0,2).join(" / ")}</span><Link href={"/work/"+p.slug}>VIEW CASE STUDY <Arrow/></Link></div></article>)}</div>
<div className="more-work" data-reveal><div className="more-work-heading"><h3>More explorations</h3><span className="mono">DIFFERENT PLATFORMS. SAME CURIOSITY.</span></div>{projects.filter(p=>!p.featured).map(p=><Link href={"/work/"+p.slug} className="archive-row" key={p.slug}><span className="mono">{p.number}</span><h4>{p.name}</h4><span className="archive-description">{p.tagline}</span><span className="mono archive-category">{p.category}</span><Arrow/></Link>)}</div>
</section>
<section id="expertise" className="expertise-section section-light section-pad">
<div className="section-label mono"><span>(02 — EXPERTISE)</span><Star/></div>
<div className="section-heading expertise-heading" data-reveal><h2>The connections<br/>make the <span className="text-blue">difference.</span></h2><p>From the interface to what happens behind it, I enjoy making the pieces work together.</p></div>
<div className="services">{services.map(s=><a className="service-row" href="#contact" key={s.number} data-reveal><span className="mono service-number">{s.number}</span><h3>{s.title}</h3><div><p>{s.description}</p><span className="mono service-tools">{s.tools}</span></div><Arrow/></a>)}</div>
<div className="technology-strip mono"><span>TOOLS I WORK WITH</span><span>JAVA</span><span>PYTHON</span><span>NODE.JS</span><span>KOTLIN</span><span>REST</span><span>N8N</span><span>MYSQL</span></div>
</section>
<section className="process-section section-dark section-pad">
<div className="section-label mono"><span>(03 — THE APPROACH)</span><span>THINK CLEARLY. BUILD DELIBERATELY.</span></div>
<div className="process-title" data-reveal><h2>From a good question<br/>to a <span className="text-blue">working system.</span></h2><Star/></div>
<div className="process-grid">{[{n:"01",title:"Understand",text:"Start with the problem, the people using the system, and the constraints. Make the scope clear before the code."},{n:"02",title:"Build",text:"Connect the data, develop the logic, and make the experience usable. Keep the system understandable as it grows."},{n:"03",title:"Refine",text:"Test the important paths, look at what breaks, and improve the details. Document the decisions that matter."}].map(s=><div className="process-step" key={s.n} data-reveal><div className="process-track"><span className="mono">{s.n}</span><i/></div><h3>{s.title}</h3><p>{s.text}</p></div>)}</div>
</section>
<section id="about" className="about-section section-light section-pad">
<div className="section-label mono"><span>(04 — A LITTLE CONTEXT)</span><span>THE PERSON BEHIND THE CODE</span></div>
<div className="about-grid"><div className="about-copy" data-reveal><h2>Curious by nature.<br/><span className="text-blue">Practical by choice.</span></h2><p className="about-lead">I’m Ycany, a full-stack developer and computer science student in Cebu.</p><p>My work often starts behind the interface: application logic, APIs, databases, and the workflows connecting them. Through team projects and hackathons, I’ve explored everything from ocean-data advisories to AI-assisted message screening.</p><p>I’m currently taking on freelance work in backend development, integrations, and automation—bringing the same curiosity to each new problem.</p><a className="text-link" href={profile.resumeHref} download>Download résumé <Arrow/></a></div><figure className="portrait" data-reveal><div className="portrait-image"><Image src="/media/profile.webp" alt="Ycany Ashra T. Sanchez" fill sizes="(max-width: 760px) 90vw, 40vw" style={{objectFit:"cover",objectPosition:"center 30%"}}/></div><figcaption className="mono"><span>YCANY ASHRA T. SANCHEZ</span><span>CEBU, PH ↗</span></figcaption></figure></div>
<div className="about-facts" data-reveal><div><span className="mono">EDUCATION</span><p>BS Computer Science</p><small>Cebu Institute of Technology – University<br/>2024–2028 · Consistent Dean’s Lister</small></div><div><span className="mono">PAROLA / TEAM TIKI</span><p>Ideas beyond the classroom.</p><small>PSC XI — Central Visayas: Top 25 qualifier & Best Logo<br/>Iloilo AI Fest 2026: Top 5 finalist</small></div><div><span className="mono">BANTAI BUDDY / O1 DEVELOPERS</span><p>Built under pressure.</p><small>IBPAP Can You HackIt? Challenge 2025<br/>Top 2 among 28 teams</small></div></div>
<div className="certifications mono"><span>CONTINUING TO LEARN</span><span>JAVA OOP · CODECHUM</span><span>AI READY ASEAN · ASEAN FOUNDATION</span><span>GRAPHIC DESIGN ESSENTIALS · CANVA</span></div>
</section>
<section id="contact" className="contact-section section-blue section-pad">
<div className="section-label mono"><span>(05 — START A CONVERSATION)</span><span>GOOD THINGS START WITH A QUESTION.</span></div>
<div className="contact-grid"><div className="contact-copy" data-reveal><Star/><h2>Something<br/>in mind?</h2><p className="contact-subtitle">Let’s connect the dots.</p><p>Have an idea, an API to connect, or a workflow that could work better? Tell me a little about it.</p><a className="text-link contact-email" href={"mailto:"+profile.email}>Email me directly <Arrow/></a></div><ContactForm configured={configured}/></div>
<Footer/>
</section>
</main>}
