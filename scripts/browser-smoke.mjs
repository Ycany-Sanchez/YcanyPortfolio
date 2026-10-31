import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.PORTFOLIO_URL||'http://127.0.0.1:3000';
const endpoint=await (await fetch('http://127.0.0.1:9238/json/version')).json();
const socket=new WebSocket(endpoint.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true})});
let seq=0;const pending=new Map();let sessionId;const errors=[];const checks=[];
socket.addEventListener('message',event=>{const data=JSON.parse(event.data);if(data.id){const p=pending.get(data.id);if(p){clearTimeout(p.timer);pending.delete(data.id);data.error?p.reject(new Error(JSON.stringify(data.error))):p.resolve(data.result)}}else if(data.method==='Runtime.exceptionThrown')errors.push(data.params.exceptionDetails.text+' '+JSON.stringify(data.params.exceptionDetails.exception?.description||''))});
function command(method,params={},session=sessionId){return new Promise((resolve,reject)=>{const id=++seq;const timer=setTimeout(()=>{pending.delete(id);reject(new Error(method+' timed out'))},60000);pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params,...(session?{sessionId:session}:{})}))})}
async function evaluate(expression){const r=await command('Runtime.evaluate',{expression:typeof expression==='function'?'('+expression.toString()+')()':expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value}
const delay=ms=>new Promise(r=>setTimeout(r,ms));
function check(name,pass,detail=''){checks.push({name,pass,detail});console.log((pass?'PASS ':'FAIL ')+name+(detail?' '+detail:''))}
const {targetId}=await command('Target.createTarget',{url:'about:blank'},null);
sessionId=(await command('Target.attachToTarget',{targetId,flatten:true},null)).sessionId;
await command('Page.enable');await command('Runtime.enable');await command('Network.enable');
async function navigate(route){await command('Page.navigate',{url:base+route});for(let i=0;i<60;i++){await delay(150);const ready=await evaluate('document.readyState === "complete" && !!document.querySelector("main h1")').catch(()=>false);if(ready){await delay(1200);return}}throw new Error('Navigation timeout '+route)}
async function viewport(width,height){await command('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<760});}
await fs.mkdir('artifacts',{recursive:true});
for(const [width,height] of [[360,800],[390,844],[768,1024],[1366,900],[1920,1080]]){
await viewport(width,height);await navigate('/');
const metrics=await evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelector("h1").innerText,links:[...document.querySelectorAll("a")].filter(a=>a.getAttribute("href")?.startsWith("#")&&a.getAttribute("href").length>1).every(a=>document.getElementById(a.getAttribute("href").slice(1)))}));
check('Homepage fits '+width,metrics.scroll<=metrics.width+1,JSON.stringify(metrics));check('Anchors resolve '+width,metrics.links);
if(width===390||width===1366){
const shot=await command('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await fs.writeFile('artifacts/home-'+width+'.png',Buffer.from(shot.data,'base64'));
}
if(width===390){
await evaluate('document.querySelector(".menu-toggle").click()');
check('Mobile menu opens',await evaluate('document.querySelector(".menu-toggle").getAttribute("aria-expanded")==="true" && getComputedStyle(document.querySelector(".navigation")).display!=="none"'));
await command('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await command('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
check('Escape closes and restores focus',await evaluate('document.querySelector(".menu-toggle").getAttribute("aria-expanded")==="false" && document.activeElement===document.querySelector(".menu-toggle")'));
await evaluate(()=>{document.querySelector(".menu-toggle").click();document.querySelector(".navigation .nav-contact").click()});await delay(800);
check('Mobile navigation closes on selection',await evaluate('document.querySelector(".menu-toggle").getAttribute("aria-expanded")==="false"'));
check("Contact fallback is honest",await evaluate(()=>!!document.querySelector(".form-unavailable a")&&document.querySelector(".submit-button").disabled));
}
}
await viewport(1366,900);
await navigate('/');
await evaluate('new Promise(async resolve=>{for(let y=0;y<document.documentElement.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,70))}resolve(true)})');await delay(1000);
await evaluate('window.scrollTo({top:document.querySelector("#work").offsetTop,behavior:"instant"})');await delay(400);
let shot=await command('Page.captureScreenshot',{format:'png'});await fs.writeFile('artifacts/work-desktop.png',Buffer.from(shot.data,'base64'));
await evaluate('window.scrollTo({top:document.querySelector("#contact").offsetTop,behavior:"instant"})');await delay(400);shot=await command('Page.captureScreenshot',{format:'png'});await fs.writeFile('artifacts/contact-desktop.png',Buffer.from(shot.data,'base64'));
for(const slug of ['parola','bantai-buddy','tinhealth','imentia','foodpantry']){
await navigate('/work/'+slug);
check('Case study renders '+slug,await evaluate('!!document.querySelector(".case-prose h2") && document.querySelectorAll(".case-index a").length===5'));
check('Case study fits '+slug,await evaluate('document.documentElement.scrollWidth<=innerWidth+1'));
await evaluate('document.querySelectorAll(".flow-node")[1].click()');
check('Architecture step works '+slug,await evaluate('document.querySelectorAll(".flow-node")[1].getAttribute("aria-pressed")==="true"'));
if(slug==='bantai-buddy'){shot=await command('Page.captureScreenshot',{format:'png'});await fs.writeFile('artifacts/case-desktop.png',Buffer.from(shot.data,'base64'))}
}
await viewport(390,844);await navigate('/work/bantai-buddy');check('Mobile case fits',await evaluate('document.documentElement.scrollWidth<=innerWidth+1'));shot=await command('Page.captureScreenshot',{format:'png'});await fs.writeFile('artifacts/case-mobile.png',Buffer.from(shot.data,'base64'));
await command('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await navigate('/');check('Reduced motion stops decorative animation',await evaluate('document.getAnimations().filter(a=>a.playState==="running").length===0'));
await command('Emulation.setScriptExecutionDisabled',{value:true});await navigate('/');check('Homepage readable without JavaScript',await evaluate('!!document.querySelector("h1") && getComputedStyle(document.querySelector("h1")).opacity==="1"'));await command('Emulation.setScriptExecutionDisabled',{value:false});
check('Unknown project returns 404',(await fetch(base+'/work/does-not-exist')).status===404);
for(const route of ['/media/resume.pdf','/media/profile.webp','/sitemap.xml','/robots.txt','/opengraph-image','/icon.svg'])check('Asset '+route,(await fetch(base+route)).ok);
check('No browser exceptions',errors.length===0,errors.join('; '));
await fs.writeFile('artifacts/browser-results.json',JSON.stringify({checks,errors},null,2));
await command('Target.closeTarget',{targetId},null);socket.close();
if(checks.some(c=>!c.pass))process.exitCode=1;
