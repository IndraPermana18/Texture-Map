// Audio manager: backsound (WebAudio, dibangkitkan langsung) + voice over (Web Speech id-ID) dengan antrean per scene.
const Au=(()=>{
let ctx,master,bgmG,seq,token=0,enabled=false,mood='open',cur=[],curOnLine=null,speaking=false,step=0,nextT=0,timer=null;
const S=JSON.parse(localStorage.getItem('mpi_audio')||'{"bgm":0.3,"vo":1,"mute":false}');
const save=()=>localStorage.setItem('mpi_audio',JSON.stringify(S));
const M=n=>440*Math.pow(2,(n-69)/12);
const MOODS={open:{ch:[[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,65]],sp:.26},learn:{ch:[[57,60,64],[53,57,60],[48,52,55],[55,59,62]],sp:.34},
 prak:{ch:[[62,65,69],[58,62,65],[55,58,62],[57,60,64]],sp:.28},quiz:{ch:[[62,65,69,72],[67,71,74],[60,64,67],[65,69,72]],sp:.2},hasil:{ch:[[60,64,67,72],[65,69,72],[67,71,74],[60,64,67,72]],sp:.24}};
function tone(f,t,dur,type,g){const o=ctx.createOscillator(),e=ctx.createGain();o.type=type;o.frequency.value=f;e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(g,t+.04);e.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(e).connect(bgmG);o.start(t);o.stop(t+dur+.05)}
function sched(){if(!ctx||!enabled)return;const m=MOODS[mood];while(nextT<ctx.currentTime+.6){const ch=m.ch[Math.floor(step/8)%m.ch.length],i=step%8;
 if(i===0)ch.forEach(n=>tone(M(n-12),nextT,m.sp*8,'triangle',.05));
 const arp=[0,1,2,1,2,1,0,2][i];tone(M(ch[arp%ch.length]+12),nextT,.5,'sine',.07);if(i%4===0)tone(M(ch[0]-24),nextT,.4,'sine',.1);
 nextT+=m.sp;step++}}
function vol(){if(!bgmG)return;const base=S.mute?0:S.bgm*.5*(speaking?.3:1);bgmG.gain.setTargetAtTime(base,ctx.currentTime,.15)}
function voice(sp){const vs=speechSynthesis.getVoices();return vs.find(v=>/^id/i.test(v.lang))||null}
function say(L,done,my){let fin=false;const go=()=>{if(fin)return;fin=true;clearTimeout(tm);if(my===token)done()};
 const txt=L[1],tm=setTimeout(go,Math.max(2500,txt.length*95)+1500);
 try{if(S.mute||!window.speechSynthesis){clearTimeout(tm);setTimeout(go,Math.max(1500,txt.length*55));fin=false;return}
  const u=new SpeechSynthesisUtterance(txt);u.lang='id-ID';const v=voice();if(v)u.voice=v;u.volume=S.vo;
  if(L[0]==='raka'){u.pitch=1.45;u.rate=1.02}else{u.pitch=1.12;u.rate=.95}u.onend=go;u.onerror=go;speechSynthesis.speak(u)}catch(e){go()}}
return{S,
 get enabled(){return enabled},
 unlock(){if(enabled)return;enabled=true;try{ctx=new(window.AudioContext||window.webkitAudioContext)();bgmG=ctx.createGain();bgmG.gain.value=0;bgmG.connect(ctx.destination);ctx.resume();nextT=ctx.currentTime+.1;timer=setInterval(sched,200);vol()}catch(e){}
  try{speechSynthesis.getVoices();const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u)}catch(e){}},
 mood(m){if(mood!==m){mood=m;step=0;if(ctx)nextT=ctx.currentTime+.1}},
 play(lines,onLine,onEnd){this.stop();const my=++token;cur=lines;curOnLine=onLine;let i=0;speaking=true;vol();
  const next=()=>{if(my!==token)return;if(i>=lines.length){speaking=false;vol();onEnd&&onEnd();return}const L=lines[i];onLine&&onLine(L,i);i++;say(L,next,my)};
  if(!enabled){speaking=false;return}next()},
 stop(){token++;speaking=false;try{speechSynthesis.cancel()}catch(e){}vol()},
 replay(){if(cur.length)this.play(cur,curOnLine)},
 set(k,v){S[k]=v;save();vol();if(k==='mute'&&v)try{speechSynthesis.cancel()}catch(e){}},
 get speaking(){return speaking}}})();
