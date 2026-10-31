"use client";
import {useEffect,useRef,useState,type FormEvent} from "react";
import {budgetOptions,projectTypes,timelineOptions,type ContactResponse} from "@/lib/contact";
import {Arrow} from "./icons";
export function ContactForm({configured}:{configured:boolean}){
const [busy,setBusy]=useState(false);const [feedback,setFeedback]=useState<ContactResponse|null>(null);const [sent,setSent]=useState(false);
const startedAt=useRef(0);const submissionId=useRef("");const fingerprint=useRef("");const status=useRef<HTMLParagraphElement>(null);
useEffect(()=>{startedAt.current=Date.now();submissionId.current=crypto.randomUUID()},[]);
async function submit(e:FormEvent<HTMLFormElement>){
e.preventDefault();if(busy||sent)return;const form=e.currentTarget;
if(!form.reportValidity())return;const data=new FormData(form);const fields={name:String(data.get("name")??""),email:String(data.get("email")??""),projectType:String(data.get("projectType")??""),goals:String(data.get("goals")??""),budget:String(data.get("budget")??""),timeline:String(data.get("timeline")??""),website:String(data.get("website")??"")};
const key=JSON.stringify(fields);if(fingerprint.current&&fingerprint.current!==key)submissionId.current=crypto.randomUUID();fingerprint.current=key;
setBusy(true);setFeedback(null);
try{const response=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...fields,startedAt:startedAt.current,submissionId:submissionId.current}),signal:AbortSignal.timeout(20000)});const result=await response.json() as ContactResponse;if(response.status===400&&(result.fieldErrors?.startedAt||result.fieldErrors?.submissionId)){startedAt.current=Date.now()-3000;submissionId.current=crypto.randomUUID();setFeedback({message:"Your form session has been renewed. Your details are still here—please review your brief and send again."})}else{setFeedback(result)};if(response.ok){setSent(true);form.reset()}}
catch{setFeedback({message:"Your brief could not be sent. Your details are still here—please try again or email me directly."})}
finally{setBusy(false);setTimeout(()=>status.current?.focus(),0)}
}
const errors=feedback?.fieldErrors;
return <form className="contact-form" action="/api/contact" method="post" onSubmit={submit} aria-label="Project inquiry">
<div className="form-row"><label>Your name<input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="What should I call you?" aria-invalid={!!errors?.name} aria-describedby={errors?.name?"error-name":undefined}/>{errors?.name&&<span className="field-error" id="error-name">{errors.name}</span>}</label><label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" aria-invalid={!!errors?.email} aria-describedby={errors?.email?"error-email":undefined}/>{errors?.email&&<span className="field-error" id="error-email">{errors.email}</span>}</label></div>
<label>What are we building?<select name="projectType" defaultValue="" required><option value="" disabled>Select a project type</option>{projectTypes.map(x=><option key={x}>{x}</option>)}</select></label>
<label>A little about your project<textarea name="goals" required minLength={20} maxLength={5000} rows={3} placeholder="The idea, the problem, or the workflow you’d like to improve." aria-invalid={!!errors?.goals} aria-describedby={errors?.goals?"error-goals":undefined}/>{errors?.goals&&<span className="field-error" id="error-goals">{errors.goals}</span>}</label>
<div className="form-row"><label>Budget <span className="optional">(optional · USD)</span><select name="budget" defaultValue="Prefer to discuss">{budgetOptions.map(x=><option key={x}>{x}</option>)}</select></label><label>Timeline<select name="timeline" defaultValue="" required><option value="" disabled>When are you thinking?</option>{timelineOptions.map(x=><option key={x}>{x}</option>)}</select></label></div>
<div className="form-trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
<button className="submit-button" type="submit" disabled={!configured||busy||sent}><span>{sent?"Brief received. Thank you!":busy?"Sending your brief…":"Send project brief"}</span><Arrow/></button>
<p className="form-note">Your details are used only to respond to your inquiry.</p>
{!configured&&<p className="form-unavailable">The inquiry form is currently unavailable. <a href="mailto:ycanyashra.sanchez2006@gmail.com">Email your project brief instead <span aria-hidden="true">↗</span></a></p>}
{feedback&&<p ref={status} className={"form-feedback "+(sent?"is-success":"")} role={sent?"status":"alert"} tabIndex={-1}>{feedback.message}{errors&&Object.entries(errors).filter(([key])=>!["name","email","goals"].includes(key)).map(([key,value])=><span className="form-general-error" key={key}>{value}</span>)}</p>}
</form>
}
