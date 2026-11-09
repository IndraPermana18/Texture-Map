// ===== STATE & PROGRES (localStorage) =====
const KEY='mpi_texturemap_v1';
const fresh=()=>({name:'',kelas:'XI Multimedia',done:Array(6).fill(0),act:Array(6).fill(0),practice:0,quizDone:0,quiz:null});
let ST=(()=>{try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&Array.isArray(s.done)&&s.done.length===6)return Object.assign(fresh(),s)}catch(e){}return fresh()})();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(ST))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nm=()=>esc(ST.name||'Raka');
const isOpen=i=>i===0||!!ST.done[i-1];
const allDone=()=>ST.done.every(Boolean);
const nDone=()=>ST.done.filter(Boolean).length;
const pct=()=>Math.round((nDone()+ST.practice+ST.quizDone)/8*100);
const $=s=>document.querySelector(s);
// ===== SKALA FULL-FRAME 16:9 =====
function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080),W=innerWidth/s,H=innerHeight/s,st=$('#stage'),f=$('#frame');st.style.width=W+'px';st.style.height=H+'px';st.style.transform=`scale(${s})`;f.style.left=(W-1920)/2+'px';f.style.top=(H-1080)/2+'px'}
addEventListener('resize',fit);fit();
// ===== SCENE & NARASI =====
let SC={n:'opening'},NL=[];
const IMG=n=>`assets/${n}.png`;
const chr=(n,st)=>`<img class="chr" src="${IMG(n)}" style="${st}" alt="${n}">`;
const bub=(who,txt,st)=>`<div class="bub" id="bub-${who}" style="${st}"><span class="who">${who==='maya'?'Bu Maya':'Raka'}</span><span class="t">${txt}</span></div>`;
const first=(L,w)=>(L.find(x=>x[0]===w)||['',''])[1];
function fitB(b){const m=/top:(\d+)px/.exec(b.getAttribute('style')||''),mh=Math.min(m?1050-m[1]:230,230);b.dataset.fs=b.dataset.fs||parseFloat(getComputedStyle(b).fontSize);let f=+b.dataset.fs;b.style.fontSize=f+'px';while(b.offsetHeight>mh&&f>14){f--;b.style.fontSize=f+'px'}}
const fitAll=()=>document.querySelectorAll('.bub').forEach(fitB);
function onLine(L){const b=$('#bub-'+L[0]);document.querySelectorAll('.bub').forEach(x=>x.classList.remove('say'));if(b){b.classList.add('say');b.querySelector('.t').textContent=L[1];fitB(b)}}
function narr(lines){NL=lines;Au.play(lines,onLine)}
const MOOD={opening:'open',tujuan:'learn',menu:'learn',materi:'learn',praktik:'prak',kuis:'quiz',hasil:'hasil'};
function go(n,arg){Au.stop();SC={n,arg};render();}
const hexes='<div class="hex" style="left:60px;top:300px"></div><div class="hex" style="left:1700px;top:200px;animation-delay:2s"></div><div class="hex" style="left:900px;top:760px;animation-delay:4s;width:60px;height:60px"></div>';
function topbar(act){const nv=(k,l,d,on)=>`<button ${on?'class="on"':''} ${d?'disabled':''} data-a="go" data-n="${k}">${l}</button>`;
 return `<div class="a top"><div class="dark logo"><span style="font-size:48px">🟠</span><div>Misi Texture Map<i>Mengenal Jenis-Jenis Texture Map</i></div></div>
 <div class="dark nav">${nv('opening','🏠 Beranda',0,act==='opening')}${nv('menu','📖 Materi',0,act==='menu'||act==='materi')}${nv('praktik','🔧 Praktik',!allDone(),act==='praktik')}${nv('kuis','🏆 Kuis',!ST.practice,act==='kuis')}${nv('hasil','⭐ Hasil',!ST.quizDone,act==='hasil')}</div>
 <div class="prog" style="margin-left:auto">Progres Belajar <span style="float:right">${pct()}%</span><div class="bar"><b style="width:${pct()}%"></b></div></div>
 <button class="ibtn" data-a="audio" title="Audio">${Au.S.mute?'🔇':'🔊'}</button><button class="ibtn" data-a="help" title="Petunjuk">?</button></div>`}
const wrap=(h,f)=>`<div class="a${f===0?'':' fade'}" style="inset:0">${h}</div>`;
function render(){const{n,arg}=SC;let h='';$('#bg').innerHTML=hexes+'<div class="floor"></div>';
 if(n==='kuis'&&!ST.practice||n==='praktik'&&!allDone()||n==='hasil'&&!ST.quizDone){SC={n:'menu'};return render()}
 Au.mood(MOOD[n]);
 ({opening:sOpening,tujuan:sTujuan,menu:sMenu,materi:sMateri,praktik:sPraktik,kuis:sKuis,hasil:sHasil})[n](arg);}
function mount(h,lines){$('#scene').innerHTML=wrap(h);$('#ovl').innerHTML=ovlHTML();fitAll();if(lines)narr(lines)}
let ovlOn=true;
function ovlHTML(){if(!ovlOn||Au.enabled)return '';return `<div class="modal" style="z-index:80"><div class="glass mbox"><div style="font-size:64px">🔊</div><div class="h2" style="font-size:52px">Misi Texture Map</div><p style="margin:10px 0 24px">Media ini memakai <b>suara narasi Bu Maya &amp; Raka</b> dan musik latar. Aktifkan audio agar narasi diputar otomatis di setiap scene.</p><button class="yel" data-a="audioon">🔊 AKTIFKAN AUDIO</button><p style="margin-top:20px"><button class="pbtn" style="font-size:22px;padding:8px 26px" data-a="audiooff">Lanjut tanpa suara</button></p></div></div>`}
// ===== SCENE 1: OPENING =====
function sOpening(){const L=NARASI.opening;
 mount(`${topbar('opening').replace(/<div class="dark nav">.*?<\/div>\s*<div class="prog"/s,'<div class="prog"')}
 <div class="a pill" style="left:200px;top:170px;font-size:44px;background:linear-gradient(180deg,#ffe35a,#ffb300);color:#2a1f00;border-color:#fff3b0;box-shadow:0 6px 0 #c47d00">⭐ MISI TEXTURE MAP</div>
 <div class="a ttl" style="left:100px;top:245px;font-size:125px;line-height:1;-webkit-text-stroke:12px #3a1f9a;paint-order:stroke fill;text-shadow:0 8px 0 #3a1f9a">Jenis-Jenis</div>
 <div class="a ttl" style="left:60px;top:375px;font-size:138px;line-height:1;color:#ffcc1a;-webkit-text-stroke:14px #3a1f9a;paint-order:stroke fill;text-shadow:0 9px 0 #3a1f9a">Texture Map</div>
 <div class="a pill" style="left:130px;top:560px;font-size:30px;width:880px;text-align:center;font-style:normal">Membuat Material Objek 3D Lebih Realistis Menggunakan <span style="color:#ffcc1a">Blender</span></div>
 <div class="a dark" style="left:50px;top:700px;width:1010px;height:165px;border-radius:30px;display:flex;justify-content:space-around;align-items:center;padding:0 10px">${MAPS.map((m,i)=>`<div style="text-align:center;font-size:20px;font-weight:700"><canvas id="os${i}" width="140" height="140"></canvas><br>${m.short}</div>`).join('')}</div>
 ${chr('raka_full','left:1040px;top:130px;width:540px;height:790px')}${chr('maya_full','left:1490px;top:200px;width:430px;height:720px')}
 <div class="a glass" style="left:120px;top:880px;width:1000px;height:120px;border-radius:70px;display:flex;align-items:center;gap:20px;padding:0 40px;font-size:24px;font-weight:700">👤 <div style="flex:1">Nama Siswa<br><input id="in-n" maxlength="30" placeholder="Masukkan nama Anda…" value="${esc(ST.name)}" style="width:100%;font:inherit;font-size:24px;padding:6px 16px;border-radius:30px;border:3px solid #b5bbff"></div>🎓 <div style="width:290px">Kelas<br><select id="in-k" style="width:100%;font-size:24px;padding:6px 10px;border-radius:30px;border:3px solid #b5bbff"><option>XI Multimedia</option><option>XI DKV</option><option>XI Lainnya</option></select></div></div>
 <button class="a yel" data-a="start" style="left:1200px;top:885px;font-size:44px;z-index:5">▶ MULAI BELAJAR</button>
 <div class="a" style="right:50px;bottom:30px;font-size:32px;font-weight:800;font-style:italic;color:#fff">Belajar · Berlatih · Berkreasi</div>
 <div class="a" style="left:60px;bottom:24px;font-size:44px;font-weight:800;color:#fff">🟠 blender</div>`,L);
 $('#in-k').value=ST.kelas;
 MAPS.forEach((m,i)=>RN.sph($('#os'+i),RN.preset(m.id)));}
// ===== SCENE 2: TUJUAN =====
function sTujuan(){const L=NARASI.tujuan,G=['Menjelaskan pengertian texture map dan material PBR.','Mengidentifikasi fungsi serta karakteristik enam jenis texture map.','Membedakan texture map berdasarkan tampilan dan data yang disimpan.','Menghubungkan texture map ke node yang tepat pada Shader Editor Blender.','Membuat material sederhana pada objek 3D dengan memanfaatkan beberapa texture map.'],K=['Memahami konsep dasar texture map dan material PBR.','Mengenali karakteristik berbagai jenis texture map.','Menggunakan Shader Editor Blender untuk menghubungkan texture map.','Terampil membuat material pada objek 3D.'];
 mount(`${topbar('tujuan')}${chr('maya_full','left:30px;top:150px;width:430px;height:660px')}${bub('maya','Pada pembelajaran ini, kita akan mempelajari tujuan dan kompetensi yang harus kamu kuasai. Yuk, simak penjelasannya!','left:30px;top:830px;width:520px')}
 <div class="a glass" style="left:500px;top:140px;width:1390px;height:800px;padding:34px 40px">
 <div class="pill" style="display:inline-block;font-size:34px">🎯 Tujuan Pembelajaran</div>
 <div class="fx" style="gap:30px;margin-top:18px"><canvas id="cube" width="260" height="260" style="flex:none"></canvas><div style="flex:1">${G.map((g,i)=>`<div class="info" style="margin-bottom:6px;animation:fi .7s both;animation-delay:${.4+i*.9}s;font-size:23px;padding:6px 16px"><b style="color:#5b34d0;font-size:28px">${i+1}.</b> ${g}</div>`).join('')}</div></div>
 <div class="pill" style="display:inline-block;font-size:30px;margin-top:6px">🏆 Kompetensi yang Harus Dikuasai</div>
 <div style="margin-top:12px;font-size:22px;font-weight:700;display:grid;grid-template-columns:1fr 1fr;gap:6px 30px">${K.map((k,i)=>`<div style="animation:fi .7s both;animation-delay:${5+i*.4}s">✅ ${k}</div>`).join('')}</div></div>
 <button class="a yel" data-a="go" data-n="menu" style="right:40px;bottom:30px">LANJUTKAN ❯</button>`,L);
 RN.sph($('#cube'),RN.preset('base'))}
// ===== SCENE 3: MENU =====
function sMenu(){const L=NARASI.menu,nw=ST._new;ST._new=null;
 const cards=MAPS.map((m,i)=>{const st=ST.done[i]?'done':isOpen(i)?'open':'lock',x=600+(i%3)*430,y=330+Math.floor(i/3)*300;
  return `<div class="card glass ${st} ${nw===i?'new':''}" data-a="card" data-i="${i}" style="left:${x}px;top:${y}px;width:400px;height:280px"><div style="position:absolute;right:16px;top:10px;font-size:40px">${st==='lock'?'🔒':st==='done'?'✅':''}</div><canvas id="mc${i}" width="110" height="110"></canvas><div style="font-size:28px;font-weight:900;color:#3b2bb8">${i+1}. ${m.short}</div><div style="font-size:19px;font-weight:600">${m.desc}</div><span class="badge b-${st}">${st==='lock'?'TERKUNCI':st==='done'?'SELESAI':'TERBUKA'}</span><div class="pb"><b style="width:${ST.done[i]?100:0}%"></b></div></div>`}).join('');
 mount(`${topbar('menu')}${chr('raka_full','left:20px;top:280px;width:480px;height:720px')}${bub('raka',first(L,'raka'),'left:40px;top:170px;width:480px')}
 <div class="a dark" style="left:600px;top:140px;width:1260px;height:150px;display:flex;align-items:center;gap:30px;padding:0 50px"><span style="font-size:80px">🧊</span><div><div class="ttl" style="font-size:66px;line-height:1.05">Texture <span style="color:#ffcc1a">Map</span></div><div style="font-size:22px;font-weight:600">Pahami berbagai jenis Texture Map dan fungsinya dalam dunia 3D! · ${nDone()}/6 selesai</div></div></div>
 ${cards}
 <div class="a fx" style="left:600px;top:935px;gap:24px"><button class="pbtn" data-a="go" data-n="praktik" ${allDone()?'':'style="opacity:.55"'}>${allDone()?'🔧':'🔒'} Praktik Blender</button><button class="pbtn" data-a="go" data-n="kuis" ${ST.practice?'':'style="opacity:.55"'}>${ST.practice?'🏆':'🔒'} Kuis</button><button class="pbtn" data-a="go" data-n="hasil" ${ST.quizDone?'':'style="opacity:.55"'}>${ST.quizDone?'⭐':'🔒'} Hasil</button></div>
 <button class="a pbtn" data-a="askreset" style="right:60px;top:935px;font-size:24px;background:linear-gradient(180deg,#e5484d,#a02024);box-shadow:0 6px 0 #5a1012">↺ RESET PROGRES</button>`,L);
 MAPS.forEach((m,i)=>RN.sph($('#mc'+i),RN.preset(m.id)));}
// ===== SCENE 4-9: MATERI =====
let MP={i:0,p:0,A:{}};
function sMateri(i){i=i|0;if(!isOpen(i))return go('menu');MP={i,p:0,A:{moved:false,ok:!!ST.act[i],c:{}}};MAPS[i].ctrl.forEach(c=>MP.A.c[c.k]=c.v);drawMat(true)}
const PG=['Pengertian & Fungsi','Karakteristik & Data','Contoh Visual','Penerapan di Blender','Aktivitas Interaktif','Rangkuman'];
function lines(m,p){const j=a=>a.join(' ');return[[...m.intro,['maya',m.def]],[['maya','Karakteristik '+m.short+'. '+j(m.kar)],['maya','Data yang disimpan: '+m.data+'.']],[['raka','Wah, banyak sekali contohnya!'],['maya','Contoh penggunaan. '+m.contoh.map(c=>c[1]+' '+c[2]).join(' ')]],[['maya','Penerapan di Blender. '+j(m.steps)]],[['maya','Sekarang giliranmu mencoba! '+m.hint+' Lalu jawab pertanyaan singkatnya.']],[['maya','Rangkuman. '+j(m.sum)+' Jika sudah paham, tekan tombol Selesai Belajar.']]][p]}
function nodeSvg(m){const t={base:0,rough:1,metal:2,normal:3,emis:4}[m.id],socks=['Base Color','Roughness','Metallic','Normal','Emission Color'],two=m.nodes.length>1,hg=m.id==='height';
 let s=`<svg viewBox="0 0 640 330" width="100%" style="background:#2b2b2b;border-radius:16px"><g font-family="sans-serif" font-size="14" fill="#fff">`;
 const nd=(x,y,w,h,c,t2,rows)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#3b3b3b"/><rect x="${x}" y="${y}" width="${w}" height="24" rx="8" fill="${c}"/><text x="${x+8}" y="${y+17}" font-weight="bold">${t2}</text>${rows}`;
 s+=nd(15,100,150,90,'#c0561d','Image Texture',`<text x="25" y="150" fill="#ccc">${m.short}.png</text><text x="90" y="178" fill="#fc0">Color ●</text>`);
 let ox=165,oy=178;
 if(two){const mn=m.nodes[1];s+=nd(240,100,150,90,hg?'#7b3f9e':'#3a5fcf',mn,`<text x="250" y="150" fill="#ccc">${hg?'Height ←':'Color ←'}</text><text x="318" y="178" fill="#fc0">${hg?'Disp ●':'Normal ●'}</text>`);s+=`<path d="M165 178 C200 178 200 150 240 150" stroke="#fc0" fill="none" stroke-width="3"/>`;ox=390;oy=178}
 if(hg){s+=nd(440,20,185,170,'#7a1f1f','Material Output',`<text x="450" y="70" fill="#ccc">Surface</text><text x="450" y="100" fill="#ccc">Volume</text><circle cx="440" cy="140" r="7" fill="#fc0"/><text x="455" y="145" fill="#fc0">Displacement</text>`);s+=`<path d="M${ox} ${oy} C${ox+25} ${oy} 415 140 440 140" stroke="#fc0" fill="none" stroke-width="3"/>`}
 else{s+=nd(440,15,185,300,'#2f7a3a','Principled BSDF',socks.map((k,i)=>`<circle cx="440" cy="${70+i*40}" r="7" fill="${i===t?'#fc0':'#888'}"/><text x="455" y="${75+i*40}" fill="${i===t?'#fc0':'#ccc'}">${k}</text>`).join(''));
  s+=`<path d="M${ox} ${oy} C${ox+40} ${oy} 400 ${70+t*40} 440 ${70+t*40}" stroke="#fc0" fill="none" stroke-width="3"/>`}
 return s+'</g></svg>'}
function drawMat(nar){const m=MAPS[MP.i],p=MP.p,i=MP.i,A=MP.A,ctrl=m.ctrl;let body='';
 const mark=ok=>ok?'✅':'⬜';
 if(p===0)body=`<div class="fx" style="gap:30px"><div style="width:660px;text-align:center"><div class="fx c" style="gap:10px;margin-top:30px"><div><canvas id="c1" width="330" height="330"></canvas><div class="pill" style="font-size:22px;padding:4px 20px;font-style:normal">Contoh Objek 3D</div></div><span style="font-size:50px;color:#7c4cf0">»</span><div><canvas id="c2" width="250" height="250" style="border-radius:20px;border:4px solid #fff"></canvas><div class="pill" style="font-size:22px;padding:4px 20px;font-style:normal">${m.name}${m.alias?' ('+m.alias+')':''}</div></div></div></div><div style="flex:1;display:flex;flex-direction:column;gap:20px"><div class="info"><h3>💡 Pengertian</h3>${m.def}</div><div class="info"><h3>⚙️ Fungsi</h3>${m.fungsi}</div></div></div>`;
 if(p===1)body=`<div class="fx" style="gap:30px"><div style="flex:1;display:flex;flex-direction:column;gap:20px"><div class="info"><h3>⭐ Karakteristik</h3><ul>${m.kar.map(k=>`<li>${k}</li>`).join('')}</ul></div>${m.note?`<div class="info" style="border-color:#ffb300;background:#fff8dd"><h3>📌 Catatan penting</h3>${m.note}</div>`:''}</div><div style="width:520px;display:flex;flex-direction:column;gap:16px"><div class="info"><h3>💾 Data yang disimpan</h3>${m.data}<br><br><span class="chip">Tampilan: ${m.tampil}</span><br><span class="chip" style="margin-top:8px">Input Blender: ${m.input}</span><br><span class="chip" style="margin-top:8px">Color Space: ${m.cs}</span></div><div class="fx c"><canvas id="c2" width="220" height="220" style="border-radius:20px;border:4px solid #fff"></canvas></div></div></div>`;
 if(p===2)body=`<div class="fx" style="gap:30px"><div class="fx" style="gap:24px;width:700px"><div style="text-align:center"><canvas id="c1" width="330" height="330"></canvas><div class="chip">Tanpa ${m.short}</div></div><div style="text-align:center"><canvas id="c2" width="330" height="330"></canvas><div class="chip" style="background:#fff3b0">Dengan ${m.short}</div></div></div><div style="flex:1;display:flex;flex-direction:column;gap:14px"><div class="h2" style="font-size:34px">🧩 Contoh penerapan</div>${m.contoh.map(c=>`<div class="info fx" style="gap:18px;align-items:center"><span style="font-size:52px">${c[0]}</span><div><b>${c[1]}</b> ${c[2]}</div></div>`).join('')}</div></div>`;
 if(p===3)body=`<div class="fx" style="gap:26px"><div style="width:640px">${nodeSvg(m)}<div class="chip" style="margin-top:10px">Color Space: ${m.cs}</div></div><div class="info" style="flex:1;max-height:600px;overflow:auto"><h3>🛠️ Langkah di Blender</h3><ol style="padding-left:30px">${m.steps.map(s=>`<li style="margin:6px 0">${s}</li>`).join('')}</ol></div></div>${m.note?`<div class="info" style="margin-top:16px;border-color:#ffb300;background:#fff8dd;font-size:22px">📌 ${m.note}</div>`:''}`;
 if(p===4)body=`<div class="fx" style="gap:30px"><div style="width:520px;text-align:center"><canvas id="c1" width="420" height="420"></canvas>${ctrl.map(c=>c.t==='range'?`<div class="ctrl">${c.l}<input type="range" data-k="${c.k}" min="${c.min}" max="${c.max}" step="${c.s}" value="${A.c[c.k]}"><b id="v-${c.k}">${(+A.c[c.k]).toFixed(2)}</b></div>`:`<div class="ctrl">${c.l}<button class="tg ${A.c[c.k]?'on':''}" data-a="tg" data-k="${c.k}"></button></div>`).join('')}</div><div style="flex:1"><div class="info" style="margin-bottom:12px">🔬 <b>Eksplorasi:</b> ${m.hint}</div><div class="info"><h3>❓ Pertanyaan singkat</h3>${m.q.q}</div><div style="display:grid;gap:10px;margin-top:12px">${m.q.o.map((o,k)=>`<button class="opt ${A.sel===k?(k===m.q.a?'ok':'no'):''}" data-a="mq" data-k="${k}"><i>${'ABCD'[k]}</i>${o}</button>`).join('')}</div>${A.sel!=null?`<div class="fb ${A.sel===m.q.a?'ok':'no'}">${A.sel===m.q.a?'✅ Tepat! ':'❌ Belum tepat, coba lagi. '}${A.sel===m.q.a?m.q.w:''}</div>`:''}</div></div>`;
 if(p===5)body=`<div class="fx" style="gap:30px"><div style="width:470px;display:flex;flex-direction:column;gap:14px"><div class="info"><h3>📝 Rangkuman ${m.short}</h3><ul>${m.sum.map(s=>`<li>${s}</li>`).join('')}</ul></div><button class="yel" id="btn-fin" data-a="finish" style="font-size:34px;padding:16px 20px">${ST.done[i]?'↩ KEMBALI KE MENU':'✔ SELESAI BELAJAR'}</button></div><div style="flex:1"><table class="cmp"><tr><th>Jenis Map</th><th>Informasi</th><th>Tampilan</th><th>Input Blender</th></tr>${MAPS.map((x,k)=>`<tr class="${k===i?'hl':''}"><td>${x.short}</td><td>${x.desc}</td><td>${x.tampil}</td><td>${x.input}</td></tr>`).join('')}</table><div class="chip" style="margin-top:8px;font-size:17px">sRGB: Base Color &amp; Emission · Non-Color: Roughness, Metallic, Normal, Height</div></div></div>`;
 const L=lines(m,p),canNext=p<4||(p===4&&(A.ok&&(A.moved||ST.act[i])));
 const html=`${topbar('materi')}
 <div class="side">${MAPS.map((x,k)=>`<button class="${k===i?'on':''}" ${isOpen(k)?'':'disabled'} data-a="go" data-n="materi" data-i="${k}"><b>${x.icon}</b>${x.short}<span style="margin-left:auto">${ST.done[k]?'✅':isOpen(k)?'':'🔒'}</span></button>`).join('')}</div>
 <div class="a glass panel"><div class="fx" style="align-items:center;gap:16px;margin-bottom:14px"><div class="h2" style="margin:0">${m.name}</div><span class="chip" style="background:#ffe35a">${p+1}/6 · ${PG[p]}</span>${p===4?`<span style="margin-left:auto;display:flex;gap:8px"><span class="chip">${mark(A.moved||ST.act[i])} Eksplorasi</span> <span class="chip">${mark(A.ok)} Pertanyaan benar</span></span>`:''}</div>${body}</div>
 ${bub('raka',(()=>{const t=first(L,'raka')||first(lines(m,0),'raka');return t.length>75?t.slice(0,72)+'…':t})(),'left:25px;top:665px;width:265px;font-size:19px;padding:12px 16px')}${chr('raka_sit','left:15px;top:850px;width:250px;height:220px;object-position:top')}
 ${bub('maya',first(L,'maya').slice(0,120)+(first(L,'maya').length>120?'…':''),'left:1625px;top:150px;width:285px;font-size:21px;padding:14px 18px')}${chr('maya_sit','left:1620px;top:440px;width:290px;height:480px')}
 <button class="a pbtn" data-a="mback" style="left:330px;top:950px">❮ KEMBALI</button><div class="a dots" style="left:850px;top:975px">${PG.map((_,k)=>`<i class="${k===p?'on':''}"></i>`).join('')}</div>
 ${p<5?`<button class="a pbtn" id="btn-next" data-a="mnext" style="left:1280px;top:950px" ${canNext?'':'disabled'}>LANJUT ❯</button>`:''}`;
 $('#scene').innerHTML=wrap(html,0);$('#ovl').innerHTML=ovlHTML();fitAll();
 const dm=RN.preset(m.id);
 if(p===0||p===2){RN.sph($('#c1'),p===0?dm:Object.assign({},dm,WO[m.id]));if(p===2)RN.sph($('#c2'),dm);else RN.map($('#c2'),m.id==='metal'?'metal':m.id)}
 if(p===1)RN.map($('#c2'),m.id);if(p===4)actDraw();
 if(nar)narr(L)}
const WO={base:{baseMap:0},rough:{rmap:0,rough:.5,baseCol:[.55,.55,.58]},metal:{metal:0},normal:{nrm:0},emis:{emap:0,estr:0},height:{hmap:0}};
function actOpts(){const m=MAPS[MP.i],c=MP.A.c,o=RN.preset(m.id,{});const id=m.id;
 if(id==='base'){o.baseMap=!!c.map;o.baseCol=[.78,.78,.8];o.rough=.5}
 if(id==='rough'){o.rmap=0;o.rough=c.rough;o.baseCol=[.9,.55,.25]}
 if(id==='metal'){o.mmap=!!c.map;o.metal=c.metal;o.rough=.25;o.baseCol=[.9,.8,.55]}
 if(id==='normal'){o.nrm=!!c.map;o.nstr=c.nstr;o.baseCol=[.55,.5,.9];o.rough=.45}
 if(id==='emis'){o.emap=!!c.map;o.estr=c.estr;o.baseCol=[.03,.04,.08];o.rough=.4}
 if(id==='height'){o.hmap=1;o.hstr=c.hstr;o.disp=!!c.disp;o.baseCol=[.62,.45,.28];o.rough=.8}
 return o}
function actDraw(){const cv=$('#c1');if(cv)RN.sph(cv,actOpts())}
function updNext(){const b=$('#btn-next'),A=MP.A;if(b&&MP.p===4)b.disabled=!(A.ok&&(A.moved||ST.act[MP.i]))}
function actCheck(){const A=MP.A;if(A.ok&&A.moved&&!ST.act[MP.i]){ST.act[MP.i]=1;save()}updNext()}
function confetti(){let h='';for(let i=0;i<40;i++)h+=`<div class="conf" style="left:${Math.random()*1900}px;animation-delay:${Math.random()*1.2}s">${['⭐','🎉','✨','🟡'][i%4]}</div>`;const d=document.createElement('div');d.innerHTML=h;$('#stage').appendChild(d);setTimeout(()=>d.remove(),5500)}
function mayaModal(msg,btn,act,extra){const L=[['maya',msg.replace(/<[^>]+>/g,'')]];$('#ovl').innerHTML=`<div class="modal"><div class="glass mbox fx" style="gap:30px;align-items:center;text-align:left"><img src="${IMG('maya_sit')}" style="width:230px;height:300px;object-fit:cover;object-position:top"><div><div class="pill" style="display:inline-block;font-size:26px;margin-bottom:10px">Bu Maya</div><p>${msg}</p><div class="fx" style="gap:16px;margin-top:20px"><button class="yel" style="font-size:30px;padding:12px 34px" data-a="${act||'close'}">${btn||'OK, SIAP!'}</button>${extra||''}</div></div></div></div>`;Au.play(L,null)}
// ===== SCENE: PRAKTIK =====
let P=null;
const STEPS=[['Siapkan objek 3D','Buka Blender lalu buat objek melalui Add > Mesh > Cube.'],['Buat material baru','Pilih objek, buka Material Properties, lalu klik New.'],['Pindah ke workspace Shading','Klik tab Shading agar Shader Editor terlihat.'],['Base Color','Tambahkan Image Texture (Base Color), Color Space sRGB, hubungkan Color → Base Color.'],['Roughness','Tambahkan Image Texture (Roughness), ubah Color Space ke Non-Color, hubungkan ke Roughness.'],['Metallic','Tambahkan Image Texture (Metallic), Non-Color, hubungkan ke Metallic.'],['Atur nilai & amati','Tanpa map, atur Metallic mendekati 1 dan Roughness rendah. Bandingkan hasilnya.'],['Refleksi & simpan','Jawab pertanyaan refleksi, lalu simpan file Blender.']];
const NK=['base','rough','metal'],NL2={base:'Base Color',rough:'Roughness',metal:'Metallic'},CSR={base:'sRGB',rough:'Non-Color',metal:'Non-Color'};
function sPraktik(){P={s:0,obj:0,mat:0,tab:'layout',n:{base:{add:0,cs:'sRGB',link:0},rough:{add:0,cs:'sRGB',link:0},metal:{add:0,cs:'sRGB',link:0}},sel:null,manual:0,rough:.5,metal:0,refl:null,saved:0,msg:''};
 const L=NARASI.praktik;mount(`${topbar('praktik')}${chr('maya_sit','left:15px;top:440px;width:330px;height:500px')}${bub('maya',first(L,'maya'),'left:20px;top:160px;width:320px;font-size:21px')}${bub('raka',first(L,'raka'),'left:1575px;top:640px;width:340px;font-size:21px')}${chr('raka_sit','left:1600px;top:780px;width:300px;height:290px')}
 <div class="a glass" style="left:360px;top:140px;width:1200px;height:770px;padding:22px 28px" id="pmain"></div><div class="a glass" style="left:1580px;top:140px;width:330px;height:480px;padding:18px;border-radius:30px" id="pstep"></div>
 <button class="a pbtn" data-a="pback" style="left:380px;top:950px">❮ SEBELUMNYA</button><div class="a dots" id="pdots" style="left:850px;top:975px"></div><button class="a pbtn" id="pnext" data-a="pnext" style="left:1200px;top:950px">SELANJUTNYA ❯</button>`,L);pr()}
function stepOK(s){const n=P.n;return[P.obj,P.mat,P.tab==='shading',...NK.map(k=>n[k].add&&n[k].cs===CSR[k]&&n[k].link),P.manual&&P.metal>=.8&&P.rough<=.4,P.refl===PRAKTIK_Q.a&&P.saved][s]}
function pOpts(){const n=P.n,o=RN.preset('base',{baseMap:n.base.link,baseCol:[.75,.75,.78],rmap:n.rough.link&&!P.manual,mmap:n.metal.link&&!P.manual,rough:P.manual||!P.mat?P.rough:.5,metal:P.manual?P.metal:0});if(!P.manual&&!n.rough.link)o.rough=.5;return o}
function pnav(){const b=$('#pnext');if(!b)return;b.disabled=!stepOK(P.s);b.textContent=P.s===7?'✔ SELESAI PRAKTIK':'SELANJUTNYA ❯';b.className='a pbtn'+(P.s===7?' yel':'');b.style.fontSize=P.s===7?'30px':'';$('#pdots').innerHTML=STEPS.map((_,k)=>`<i class="${k===P.s?'on':''}"></i>`).join('')}
function pdraw(){const cv=$('#pv');if(cv&&P.obj){RN.sph(cv,pOpts())}}
function nodeEd(){const n=P.n,sk=(side,k,x,y)=>`<div class="sock ${P.sel===k&&side==='out'?'sel':''}" data-a="sock" data-d="${side}:${k}" style="left:${x}px;top:${y}px;background:${side==='out'?'#fc0':'#4a8'}"></div>`;let h='<div style="position:relative;width:600px;height:340px;background:#2b2b2b;border-radius:14px;overflow:hidden"><svg style="position:absolute;inset:0" width="600" height="340">';
 NK.forEach((k,i)=>{if(n[k].link)h+=`<path d="M200 ${i*110+72} C300 ${i*110+72} 300 ${70+i*34+10} 400 ${70+i*34+10}" stroke="#fc0" stroke-width="4" fill="none"/>`});h+='</svg>';
 h+=`<div class="node" style="left:400px;top:10px;width:190px;height:200px"><div class="nh" style="background:#2f7a3a">Principled BSDF</div><div class="nb">${NK.map((k,i)=>`<div style="position:absolute;left:34px;top:${58+i*34}px;font-size:16px">${NL2[k]}</div>`).join('')}</div>${NK.map((k,i)=>sk('in',k,-10,70+i*34)).join('')}</div>`;
 NK.forEach((k,i)=>{if(!n[k].add)return;h+=`<div class="node" style="left:10px;top:${i*110+10}px;width:190px;height:100px"><div class="nh" style="background:#c0561d">Image Texture</div><div class="nb" style="font-size:14px">${k}.png<br>Color Space<br><select style="font-size:14px"  data-a="cs" data-k="${k}"><option ${n[k].cs==='sRGB'?'selected':''}>sRGB</option><option ${n[k].cs==='Non-Color'?'selected':''}>Non-Color</option></select></div>${sk('out',k,180,52)}<div style="position:absolute;right:26px;top:32px;font-size:13px">Color</div></div>`});
 return h+'</div>'}
function pr(){const s=P.s,st=STEPS[s];
 $('#pstep').innerHTML=`<div class="pill" style="display:inline-block;font-size:24px;margin-bottom:8px">⚙ Langkah Praktik</div>${STEPS.map((x,k)=>`<div style="font-size:20px;font-weight:700;padding:5px 8px;border-radius:14px;${k===s?'background:#fff3b0':''}">${k<s||(k===s&&stepOK(k))?'✅':k===s?'▶':'⬜'} ${k+1}. ${x[0]}</div>`).join('')}`;
 let z='';
 if(s===0)z=`<button class="pbtn" data-a="padd" style="font-size:24px" ${P.obj?'disabled':''}>➕ Add ▸ Mesh ▸ Cube</button>`;
 if(s===1)z=`<button class="pbtn" data-a="pmat" style="font-size:24px" ${P.mat?'disabled':''}>🎨 Material Properties ▸ New</button>`;
 if(s===2)z=`<p style="font-size:23px;font-weight:700">👈 Klik tab <b>Shading</b> pada jendela Blender di sebelah kiri.</p>`;
 if(s>=3&&s<=5){const k=NK[s-3];z=`<button class="pbtn" data-a="pnode" data-k="${k}" style="font-size:22px;padding:10px 26px;margin-bottom:8px" ${P.n[k].add?'disabled':''}>➕ Add ▸ Texture ▸ Image Texture (${NL2[k]})</button>${nodeEd()}<div style="font-size:19px;font-weight:600;margin-top:6px">Klik titik kuning (output <b>Color</b>), lalu klik titik hijau <b>${NL2[k]}</b> pada Principled BSDF.</div>`}
 if(s===6)z=`<div class="ctrl">Nilai manual (tanpa map)<button class="tg ${P.manual?'on':''}" data-a="pman"></button></div><div class="ctrl">Metallic<input type="range" data-p="metal" min="0" max="1" step=".01" value="${P.metal}"><b id="pv-metal">${P.metal.toFixed(2)}</b></div><div class="ctrl">Roughness<input type="range" data-p="rough" min="0" max="1" step=".01" value="${P.rough}"><b id="pv-rough">${P.rough.toFixed(2)}</b></div><div class="info" style="font-size:21px">Targetmu: Metallic ≥ 0,80 dan Roughness ≤ 0,40. Amati: Metallic 0→1 membuat objek tampak logam; Roughness makin kecil membuat pantulan makin tajam.</div>`;
 if(s===7)z=`<div class="info" style="font-size:22px"><h3>❓ Refleksi</h3>${PRAKTIK_Q.q}</div><div style="display:grid;gap:8px;margin:10px 0">${PRAKTIK_Q.o.map((o,k)=>`<button class="opt" style="font-size:21px;padding:8px 16px;${P.refl===k?(k===PRAKTIK_Q.a?'border-color:#2fb84a;background:#dcffe4':'border-color:#e5484d;background:#ffe3e3'):''}" data-a="prefl" data-k="${k}"><i style="width:36px;height:36px;font-size:20px">${'ABCD'[k]}</i>${o}</button>`).join('')}</div><button class="pbtn" data-a="psave" style="font-size:22px" ${P.refl===PRAKTIK_Q.a&&!P.saved?'':'disabled'}>💾 Simpan: ${esc((ST.name||'NamaSiswa').replace(/\s+/g,''))}_MaterialLogam.blend</button>${P.saved?'<div class="fb ok">✅ File tersimpan. Klik SELESAI PRAKTIK!</div>':''}`;
 $('#pmain').innerHTML=`<div class="fx" style="align-items:center;gap:16px;margin-bottom:10px"><div class="h2" style="margin:0;font-size:38px">🔧 Praktik: Material Logam di Blender</div><span class="chip" style="background:#ffe35a">${s+1}/8</span></div>
 <div class="fx" style="gap:24px"><div style="width:470px"><div style="background:#2a2a2e;border-radius:16px;padding:10px;color:#ddd"><div class="fx" style="gap:8px;margin-bottom:8px">${['layout','shading'].map(t=>`<button data-a="ptab" data-t="${t}" style="padding:6px 18px;border-radius:8px;border:0;font-size:20px;font-weight:700;cursor:pointer;font-family:inherit;${P.tab===t?'background:#4772b3;color:#fff':'background:#3d3d42;color:#ccc'}">${t==='layout'?'Layout':'Shading'}</button>`).join('')}<span style="margin-left:auto;font-size:16px;align-self:center">${P.mat?'Material: Logam':''}</span></div>
 <div class="fx c" style="height:430px;background:radial-gradient(#4a4a52,#27272b);border-radius:10px">${P.obj?'<canvas id="pv" width="420" height="420"></canvas>':'<span style="font-size:22px;text-align:center">Viewport kosong<br>Tambahkan objek 3D</span>'}</div></div><div class="info" style="margin-top:12px;font-size:21px">Pratinjau Material (objek ditampilkan dengan lampu &amp; kamera)</div></div>
 <div style="flex:1"><div class="info" style="margin-bottom:12px"><h3>${s+1}. ${st[0]}</h3>${st[1]}</div>${z}${P.msg?`<div class="fb ${P.msg[0]==='✅'?'ok':'no'}" style="font-size:20px">${P.msg}</div>`:''}</div></div>`;
 pdraw();pnav()}
// ===== SCENE: KUIS =====
let Q=null;
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function sKuis(){Q={i:0,sel:null,chk:false,ans:[],ord:QUIZ.map(q=>shuf([0,1,2,3])),ok:0};const L=NARASI.kuis;mount(`${topbar('kuis')}<div id="kq"></div>`,L);kq()}
function kq(){const q=QUIZ[Q.i],ord=Q.ord[Q.i],last=Q.i===QUIZ.length-1,ok=Q.sel!=null&&ord[Q.sel]===q.a;
 $('#kq').innerHTML=`${chr('raka_full','left:10px;top:260px;width:380px;height:760px')}${chr('maya_sit','left:1560px;top:440px;width:340px;height:560px')}${bub('maya',Q.chk?(ok?'Benar! Hebat sekali!':'Belum tepat, baca penjelasannya ya.'):'Ayo, pilih jawaban yang paling tepat!','left:1530px;top:170px;width:380px')}${bub('raka','Hmm… perhatikan fungsi tiap map!','left:30px;top:170px;width:380px;font-size:22px')}
 <div class="a glass" style="left:430px;top:140px;width:1080px;height:790px;padding:30px 40px"><div class="fx" style="align-items:center;gap:20px"><div class="pill" style="font-size:32px">🏆 UJI PEMAHAMANMU</div><div style="flex:1;font-weight:800;font-size:22px">Soal ${Q.i+1} dari ${QUIZ.length}<div class="bar" style="background:#d4d8ff"><b style="width:${(Q.i+(Q.chk?1:0))/QUIZ.length*100}%"></b></div></div><span class="chip" style="background:#ffe35a">⭐ ${Q.ok*10}</span></div>
 <div class="info" style="margin-top:20px;font-size:30px;text-align:center;border:0;border-radius:24px">${q.q}</div>
 <div class="fx c" style="height:${q.img?170:20}px">${q.img?'<canvas id="kimg" width="160" height="160"></canvas>':''}</div>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">${ord.map((oi,k)=>`<button class="opt ${Q.sel===k&&!Q.chk?'sel':''} ${Q.chk&&oi===q.a?'ok':''} ${Q.chk&&Q.sel===k&&oi!==q.a?'no':''}" data-a="qo" data-k="${k}" ${Q.chk?'disabled':''} style="font-size:24px"><i>${'ABCD'[k]}</i>${q.o[oi]}</button>`).join('')}</div>
 ${Q.chk?`<div class="fb ${ok?'ok':'no'}" style="font-size:22px">${ok?'✅ Benar! ':'❌ Kurang tepat. '}${q.w}</div>`:''}</div>
 <div class="a fx c" style="left:430px;width:1080px;top:950px;gap:20px">${!Q.chk?`<button class="yel" data-a="qcheck" style="font-size:32px;padding:14px 50px" ${Q.sel==null?'disabled':''}>✔ PERIKSA JAWABAN</button>`:`<button class="yel" data-a="qnext" style="font-size:32px;padding:14px 50px">${last?'LIHAT HASIL ❯':'SOAL BERIKUTNYA ❯'}</button>`}<div class="dots">${QUIZ.map((_,k)=>`<i class="${k===Q.i?'on':''}" style="width:18px;height:18px"></i>`).join('')}</div></div>`;
 if(q.img)RN.sph($('#kimg'),RN.preset(q.img));fitAll()}
// ===== SCENE: HASIL =====
function sHasil(){const r=ST.quiz,sc=r.score,stars=sc>=95?5:sc>=80?4:sc>=65?3:sc>=50?2:1,lab=sc>=90?'Sangat Baik!':sc>=80?'Baik':sc>=65?'Cukup':'Perlu Berlatih',bd=sc>=80?['🏅','Texture Master']:sc>=65?['🥈','Texture Explorer']:['🌱','Texture Starter'];
 const msg=sc>=80?`Selamat, ${nm()}! Kamu sudah menyelesaikan Misi Texture Map. Teruslah berlatih dan kembangkan kreativitasmu!`:sc>=65?`Bagus, ${nm()}! Kamu sudah memahami sebagian besar materi. Ulangi bagian yang masih kurang, ya!`:`Jangan menyerah, ${nm()}! Yuk ulangi materi lalu coba kuisnya lagi. Kamu pasti bisa!`;
 mount(`${topbar('hasil')}${chr('maya_full','left:20px;top:150px;width:470px;height:660px')}${bub('maya',msg,'left:30px;top:850px;width:620px;font-size:23px')}
 <div class="a dark" style="left:620px;top:140px;width:1250px;height:130px;display:flex;align-items:center;justify-content:center;gap:20px"><span style="font-size:70px">🏆</span><div><div class="ttl" style="color:#ffcc1a;font-size:56px;line-height:1.1">Hasil Belajar</div><div style="font-size:24px;font-weight:600">Kamu telah menyelesaikan pembelajaran!</div></div></div>
 <div class="a glass fx col c" style="left:620px;top:300px;width:560px;height:400px"><div class="pill" style="font-size:30px">Nilai Akhir</div><div style="font-size:190px;font-weight:900;color:#1a1f9a;line-height:1.1"><span id="sc">0</span><span style="font-size:60px">/100</span></div><div class="yel" style="font-size:32px;padding:8px 36px;cursor:default">⭐ ${lab}</div></div>
 <div class="a glass fx col c" style="left:1210px;top:300px;width:660px;height:150px;gap:4px"><div class="pill" style="font-size:24px;padding:4px 30px">Bintang Pencapaian</div><div class="fx">${[1,2,3,4,5].map(k=>`<span class="star ${k<=stars?'on':''}" style="font-size:72px;transition-delay:${k*.25}s" data-s="${k}">⭐</span>`).join('')}</div></div>
 <div class="a glass fx c" style="left:1210px;top:470px;width:660px;height:230px;gap:24px"><div style="font-size:100px">${bd[0]}</div><div><div class="pill" style="font-size:22px;padding:4px 24px">Badge</div><div style="font-size:42px;font-weight:900;color:#3b2bb8;margin-top:8px">${bd[1]}</div></div></div>
 <div class="a fx" style="left:620px;top:725px;gap:24px;width:1250px"><div class="glass fx col c" style="flex:1;height:110px;border-radius:26px"><b style="font-size:40px;color:#2fb84a">${r.correct}</b>Jawaban Benar</div><div class="glass fx col c" style="flex:1;height:110px;border-radius:26px"><b style="font-size:40px;color:#e5484d">${r.wrong}</b>Jawaban Salah</div><div class="glass fx col c" style="flex:1;height:110px;border-radius:26px"><b style="font-size:40px;color:#3b2bb8">${sc}%</b>Persentase Pencapaian</div></div>
 <div class="a fx" style="left:620px;top:870px;gap:24px;align-items:center"><button class="yel" data-a="go" data-n="menu" style="font-size:34px">↻ ULANGI MATERI</button><button class="pbtn" data-a="go" data-n="opening">🏠 KEMBALI KE BERANDA</button><button class="pbtn" data-a="go" data-n="kuis" style="font-size:24px">Ulangi Kuis</button></div>`,[['maya',msg]]);
 const e=$('#sc');let t0=null;const tick=t=>{t0=t0||t;const p=Math.min(1,(t-t0)/1500);e.textContent=Math.round(sc*p);if(p<1&&document.body.contains(e))requestAnimationFrame(tick)};requestAnimationFrame(tick);
 setTimeout(()=>document.querySelectorAll('.star').forEach(s=>{}),0);if(stars>=3)confetti()}
// ===== EVENT HANDLER =====
const modalClose=()=>{ovlOn=false;$('#ovl').innerHTML=''};
const doSock=d=>{const[side,k]=d.split(':'),n=P.n;if(side==='out'){P.sel=k;P.msg='';}else{const cur=NK[P.s-3];if(!P.sel)P.msg='Klik dulu titik kuning (output Color) pada Image Texture.';else if(P.sel!==k)P.msg='❌ Salah sambungan. Hubungkan map ke input yang sesuai namanya.';else if(n[k].cs!==CSR[k])P.msg=`❌ Color Space belum sesuai. ${NL2[k]} harus ${CSR[k]}.`;else{n[k].link=1;P.msg='✅ Tersambung! Color → '+NL2[k];P.sel=null}}pr()};
document.addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(!t)return;const a=t.dataset.a,d=t.dataset;
 if(a==='audioon'){ovlOn=false;Au.unlock();$('#ovl').innerHTML='';narr(NL.length?NL:NARASI[SC.n]||[]);return}
 if(a==='audiooff'){ovlOn=false;$('#ovl').innerHTML='';return}
 if(a==='close'){modalClose();return}
 if(a==='go'){const n=d.n;if(n==='materi'){go('materi',d.i)}else go(n);return}
 if(a==='start'){ST.name=$('#in-n').value.trim();ST.kelas=$('#in-k').value;save();go('tujuan');return}
 if(a==='card'){const i=+d.i;if(!isOpen(i))mayaModal('Yuk, selesaikan materi sebelumnya terlebih dahulu agar materi berikutnya terbuka!');else go('materi',i);return}
 if(a==='audio'){const p=$('#ap');if(p){p.remove();return}const dv=document.createElement('div');dv.id='ap';dv.className='a glass';dv.style.cssText='right:30px;top:130px;width:430px;padding:24px;z-index:40;font-size:22px;font-weight:700;border-radius:28px';dv.innerHTML=`<div class="ctrl">Suara <button class="tg ${Au.S.mute?'':'on'}" data-a="mute"></button></div><div class="ctrl">Musik<input type="range" id="vb" min="0" max="1" step=".05" value="${Au.S.bgm}" style="width:240px"></div><div class="ctrl">Narasi<input type="range" id="vv" min="0" max="1" step=".05" value="${Au.S.vo}" style="width:240px"></div><button class="pbtn" style="font-size:22px;padding:8px 24px" data-a="replay">🔁 Ulangi Narasi</button>`;$('#frame').appendChild(dv);return}
 if(a==='mute'){Au.set('mute',!Au.S.mute);t.classList.toggle('on',!Au.S.mute);document.querySelectorAll('[data-a=audio]').forEach(b=>b.textContent=Au.S.mute?'🔇':'🔊');return}
 if(a==='replay'){if(!Au.enabled)Au.unlock();narr(NL);return}
 if(a==='help'){$('#ovl').innerHTML=`<div class="modal"><div class="glass mbox" style="text-align:left;font-size:25px"><div class="h2">❓ Petunjuk Penggunaan</div><ol style="padding-left:34px;line-height:1.5"><li>Isi nama, tekan <b>Mulai Belajar</b>, baca tujuan, lalu masuk ke <b>Menu Texture Map</b>.</li><li>Pelajari materi 1 sampai 6 <b>berurutan</b>. Materi terkunci 🔒 terbuka setelah materi sebelumnya <b>selesai</b>.</li><li>Tiap materi: baca sampai Rangkuman, selesaikan aktivitas, lalu tekan <b>Selesai Belajar</b>.</li><li>Setelah 6 materi selesai → <b>Praktik Blender</b> → <b>Kuis</b> → <b>Hasil Belajar</b>.</li><li>Gunakan tombol 🔊 untuk volume, mute, dan ulangi narasi. Progres tersimpan otomatis.</li></ol><div class="fx" style="gap:16px;margin-top:20px"><button class="yel" style="font-size:30px;padding:12px 40px" data-a="close">MENGERTI</button><button class="pbtn" data-a="askreset" style="background:linear-gradient(180deg,#e5484d,#a02024);box-shadow:0 6px 0 #5a1012">↺ Reset Progres</button></div></div></div>`;return}
 if(a==='askreset'){$('#ovl').innerHTML=`<div class="modal"><div class="glass mbox"><div style="font-size:70px">⚠️</div><p>Seluruh progres (materi, praktik, kuis, dan nilai) akan <b>dihapus</b>. Yakin ingin mereset?</p><div class="fx c" style="gap:20px;margin-top:20px"><button class="pbtn" style="background:linear-gradient(180deg,#e5484d,#a02024);box-shadow:0 6px 0 #5a1012" data-a="doreset">YA, HAPUS</button><button class="yel" style="font-size:30px;padding:12px 40px" data-a="close">BATAL</button></div></div></div>`;return}
 if(a==='doreset'){localStorage.removeItem(KEY);ST=fresh();modalClose();go('opening');return}
 // materi
 if(a==='mback'){if(MP.p>0){MP.p--;drawMat(1)}else go('menu');return}
 if(a==='mnext'){if(!t.disabled){MP.p++;drawMat(1)}return}
 if(a==='tg'){const k=d.k;MP.A.c[k]=MP.A.c[k]?0:1;MP.A.moved=true;t.classList.toggle('on');actDraw();actCheck();const ch=document.querySelectorAll('.chip');return drawMatChips()}
 if(a==='mq'){const m=MAPS[MP.i],k=+d.k;MP.A.sel=k;if(k===m.q.a)MP.A.ok=true;actCheck();drawMat();return}
 if(a==='finish'){const i=MP.i;if(ST.done[i]){go('menu');return}ST.done[i]=1;ST.act[i]=1;save();ST._new=i<5?i+1:null;confetti();const last=allDone();const msg=last?`Hebat, ${nm()}! Semua materi sudah selesai. <b>Praktik Blender</b> sekarang terbuka. Ayo lanjutkan misimu!`:`Hebat, ${nm()}! Kamu berhasil menyelesaikan materi ini. Sekarang materi berikutnya sudah terbuka. Ayo lanjutkan misimu!`;mayaModal('🎉 '+msg,'KEMBALI KE MENU','tomenu');return}
 if(a==='tomenu'){go(allDone()&&false?'praktik':'menu');return}
 // praktik
 const sk=()=>{P.msg='';};
 if(a==='padd'){P.obj=1;pr();return}if(a==='pmat'){P.mat=1;pr();return}
 if(a==='ptab'){if(!P.mat&&d.t==='shading'){P.msg='Buat material baru dulu (langkah 2).';}else{P.tab=d.t;P.msg=''}pr();return}
 if(a==='pnode'){P.n[d.k].add=1;pr();return}
 if(a==='sock'){doSock(d.d);return}
 if(a==='pman'){P.manual=P.manual?0:1;pr();return}
 if(a==='prefl'){P.refl=+d.k;pr();return}
 if(a==='psave'){P.saved=1;pr();return}
 if(a==='pback'){if(P.s>0){P.s--;P.msg='';pr()}return}
 if(a==='pnext'){if(t.disabled)return;if(P.s<7){P.s++;P.msg='';pr()}else{ST.practice=1;save();confetti();mayaModal(`Mantap, ${nm()}! Praktik selesai. <b>Kuis</b> sekarang terbuka. Siap menguji pemahamanmu?`,'MULAI KUIS','tokuis');}return}
 if(a==='tokuis'){go('kuis');return}
 // kuis
 if(a==='qo'){Q.sel=+d.k;kq();return}
 if(a==='qcheck'){const q=QUIZ[Q.i],ok=Q.ord[Q.i][Q.sel]===q.a;Q.chk=true;Q.ans.push(Q.ord[Q.i][Q.sel]);if(ok)Q.ok++;kq();Au.play([['maya',ok?'Benar! Hebat sekali. '+q.w:'Belum tepat. '+q.w]],null);return}
 if(a==='qnext'){if(Q.i<QUIZ.length-1){Q.i++;Q.sel=null;Q.chk=false;Au.stop();kq()}else{const c=Q.ok,n=QUIZ.length;ST.quiz={correct:c,wrong:n-c,score:Math.round(c/n*100),total:n};ST.quizDone=1;save();go('hasil')}return}});
function drawMatChips(){drawMat()}
document.addEventListener('input',e=>{const t=e.target;if(t.dataset.k&&t.type==='range'&&SC.n==='materi'){MP.A.c[t.dataset.k]=+t.value;MP.A.moved=true;$('#v-'+t.dataset.k).textContent=(+t.value).toFixed(2);actDraw();actCheck()}
 if(t.dataset.p){P[t.dataset.p]=+t.value;$('#pv-'+t.dataset.p).textContent=(+t.value).toFixed(2);pdraw();pnav()}
 if(t.id==='vb')Au.set('bgm',+t.value);if(t.id==='vv')Au.set('vo',+t.value)});
document.addEventListener('change',e=>{const t=e.target;if(t.dataset.a==='cs'){P.n[t.dataset.k].cs=t.value;P.msg='';pr()}});
go('opening');
