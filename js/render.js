// Mesin render material PBR sederhana (canvas) — dipakai untuk contoh visual, aktivitas, dan praktik.
const RN=(()=>{
const fr=x=>x-Math.floor(x),cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const h2=(x,y)=>fr(Math.sin(x*127.1+y*311.7)*43758.5453);
const vn=(x,y)=>{const i=Math.floor(x),j=Math.floor(y),fx=x-i,fy=y-j,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);return h2(i,j)*(1-u)*(1-v)+h2(i+1,j)*u*(1-v)+h2(i,j+1)*(1-u)*v+h2(i+1,j+1)*u*v};
const fbm=(x,y)=>.5*vn(x,y)+.3*vn(x*2.1,y*2.1)+.2*vn(x*4.3,y*4.3);
const T={
base:(u,v)=>[[.88,.1,.1],[.1,.28,.88],[.98,.78,.1]][(Math.floor(u*14)+Math.floor(v*8))%3],
rough:(u,v)=>.08+.9*fbm(u*34,v*20),
metal:(u,v)=>cl(Math.sin(u*Math.PI*14)*6+.5),
bump:(u,v)=>{const r=v*8,ri=Math.floor(r),c=u*14+(ri%2?.5:0),e=Math.min(fr(r),1-fr(r),fr(c),1-fr(c));return cl(e/.13)*(.85+.15*vn(u*50,v*50))},
emis:(u,v)=>{const l=(Math.abs(fr(u*12)-.5)>.42||Math.abs(fr(v*7)-.5)>.4)?1:0,k=l*(.65+.35*fbm(u*20,v*20));return [k*.1,k*.9,k]},
hgt:(u,v)=>fbm(u*16,v*10)
};
const norm=a=>{const l=Math.hypot(...a)||1;return a.map(x=>x/l)};
const L=norm([-.5,.6,.65]),Hh=norm([L[0],L[1],L[2]+1]);
function env(rx,ry,rz,r){const w=cl(ry*4+.5),g=[.07+.08*(ry+1),.06+.08*(ry+1),.16+.1*(ry+1)],sk=[.45+.5*Math.max(ry,0),.55+.45*Math.max(ry,0),.85+.15*Math.max(ry,0)];let c=g.map((x,i)=>x*(1-w)+sk[i]*w);
 if(ry>.3&&ry<.75&&Math.abs(rx+.4)<.22&&rz>0)c=[1.5,1.5,1.6];
 const b=cl(r**.7);return c.map(x=>x*(1-b)+.5*b)}
function sph(cv,o){const S=cv.width,ctx=cv.getContext('2d'),img=ctx.createImageData(S,S),d=img.data,R0=S*.45,cx=S/2;
 const bc=o.baseCol||[.8,.8,.8];
 for(let y=0;y<S;y++)for(let x=0;x<S;x++){let px=(x-cx)/R0,py=-(y-cx)/R0,lim=1;
  if(o.disp){const ph=Math.atan2(py,px);lim=1+o.hstr*.22*(fbm(ph*2.6+9,2.3)-.5)*2+o.hstr*.1*(vn(ph*9,4)-.5)}
  const r=Math.hypot(px,py);if(r>lim+.02)continue;
  const al=cl((lim-r)*R0*.9+.5);px/=lim;py/=lim;const q=Math.min(.999,px*px+py*py),nz=Math.sqrt(1-q);
  let N=[px,py,nz];const u=Math.atan2(px,nz)/(2*Math.PI)+.5,v=Math.acos(-cl(py,-1,1))/Math.PI;
  let hf=null,hs=0;if(o.nrm){hf=T.bump;hs=.012*o.nstr}else if(o.hmap&&!o.disp){hf=T.hgt;hs=.006*o.hstr*3}
  if(hf&&hs>0){const e=.004,gu=(hf(u+e,v)-hf(u-e,v))/(2*e),gv=(hf(u,v+e)-hf(u,v-e))/(2*e),tl=Math.hypot(nz,px)||1,Tt=[nz/tl,0,-px/tl],Bt=[py*Tt[2],nz*Tt[0]-px*Tt[2],-py*Tt[0]];
   N=norm([N[0]-hs*(gu*Tt[0]-gv*Bt[0]),N[1]-hs*(gu*Tt[1]-gv*Bt[1]),N[2]-hs*(gu*Tt[2]-gv*Bt[2])])}
  const B=o.baseMap?T.base(u,v):bc,ro=o.rmap?T.rough(u,v):o.rough,me=o.mmap?T.metal(u,v):o.metal;
  const nv=Math.max(.02,N[2]),nl=Math.max(0,N[0]*L[0]+N[1]*L[1]+N[2]*L[2]),nh=Math.max(0,N[0]*Hh[0]+N[1]*Hh[1]+N[2]*Hh[2]);
  const rx=2*nv*N[0],ry=2*nv*N[1],rz=2*nv*N[2]-1,E=env(rx,ry,rz,ro),fs=(1-nv)**5;
  const sh=Math.max(3,(1-ro)**3*500+4),sp=nh**sh*(1-ro*.7)*1.5;
  let col=[0,0,0];for(let k=0;k<3;k++){const F0=.04*(1-me)+B[k]*me,F=F0+(1-F0)*fs*(1-ro*.8);
   col[k]=(nl*.85+.18+.12*N[1])*B[k]*(1-me)+E[k]*F*(.9-ro*.3)+sp*(F0+.1)}
  if(o.emap||o.estr>0&&o.emisAlways){const em=o.emap?T.emis(u,v):[0,0,0];for(let k=0;k<3;k++)col[k]+=em[k]*o.estr}
  const i=(y*S+x)*4;for(let k=0;k<3;k++)d[i+k]=cl(Math.pow(cl(col[k],0,3),1/2.2))*255;d[i+3]=al*255}
 ctx.clearRect(0,0,S,S);ctx.putImageData(img,0,0)}
function map(cv,kind){const S=cv.width,ctx=cv.getContext('2d'),img=ctx.createImageData(S,S),d=img.data;
 for(let y=0;y<S;y++)for(let x=0;x<S;x++){const u=.2+.6*x/S,v=.15+.7*y/S;let c;
  if(kind==='base')c=T.base(u,v);else if(kind==='rough'){const g=T.rough(u,v);c=[g,g,g]}else if(kind==='metal'){const g=T.metal(u,v);c=[g,g,g]}
  else if(kind==='normal'){const e=.004,gu=(T.bump(u+e,v)-T.bump(u-e,v))/(2*e)*.012,gv=(T.bump(u,v+e)-T.bump(u,v-e))/(2*e)*.012,n=norm([-gu,gv,1]);c=[n[0]*.5+.5,n[1]*.5+.5,n[2]*.5+.5]}
  else if(kind==='emis')c=T.emis(u,v);else{const g=T.hgt(u,v);c=[g,g,g]}
  const i=(y*S+x)*4;d[i]=cl(c[0])*255;d[i+1]=cl(c[1])*255;d[i+2]=cl(c[2])*255;d[i+3]=255}
 ctx.putImageData(img,0,0)}
// preset bola per jenis map (untuk kartu & hiasan)
const PRE={base:{baseMap:1,rough:.45,metal:0},rough:{baseCol:[.55,.55,.58],rmap:1,rough:.5,metal:0},metal:{baseCol:[.85,.85,.9],rough:.12,metal:1},normal:{baseCol:[.45,.4,.95],nrm:1,nstr:1.2,rough:.5,metal:0},emis:{baseCol:[.03,.04,.08],emap:1,estr:2.2,rough:.35,metal:0},height:{baseCol:[.6,.45,.25],hmap:1,hstr:.9,rough:.8,metal:0}};
const ID={base:'base',rough:'rough',metal:'metal',normal:'normal',emis:'emis',height:'height'};
function preset(id,ex){return Object.assign({baseCol:[.8,.8,.8],rough:.5,metal:0,nstr:1,hstr:.6,estr:1},PRE[id],ex||{})}
return{sph,map,preset,PRE}})();
