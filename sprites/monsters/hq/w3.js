/* 리클라인 몬스터 고품질 업그레이드 — 작업자 3 */
(window.MRHQ=window.MRHQ||[]);
(function(){
const Q=window.MRHQ;
// ---------- 공통 헬퍼(작업자3 전용, 전부 W3_ 접두사) ----------
// 색: 항상 #hex 로 돌려줌(그라데이션 칠하기는 hex 만 해석 가능)
const W3_hx=h=>{h=String(h).replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255];};
const W3_T=(h,a)=>'#'+W3_hx(h).map(v=>Math.max(0,Math.min(255,Math.round(a>0?v+(255-v)*a:v*(1+a)))).toString(16).padStart(2,'0')).join('');
const W3_mix=(a,b,t)=>{const x=W3_hx(a),y=W3_hx(b);return'#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('');};
const W3_a=(a,b,s=1)=>[a[0]+b[0]*s,a[1]+b[1]*s,a[2]+b[2]*s];
const W3_m=(a,b,t=.5)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const W3_n=(x,y,z)=>{const l=Math.hypot(x,y,z)||1;return[x/l,y/l,z/l];};
const W3_x=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const W3_sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const W3_perp=d=>{let u=W3_x(d,[0,0,1]);if(Math.hypot(...u)<.2)u=W3_x(d,[0,1,0]);return W3_n(...u);};
// biped 관절(plan 과 같은 식)
function W3_J(B){const J=B.J,p=J.p,bw=J.bw,H=J.H,sh=J.sh,o={J,p,bw,H,sh};
  o.sp=sg=>[9*sg*bw,0,sh-1];o.h=sg=>sg>0?p.hR:p.hL;
  o.el=sg=>{const h=o.h(sg);return[(9*sg*bw+h[0])/2+2*sg,h[1]/2-1.8,(sh-1+h[2])/2-1.5];};
  o.ft=sg=>sg>0?p.fR:p.fL;o.hip=sg=>[4*sg*bw,0,H];
  o.kn=sg=>{const f=o.ft(sg);return[(4*sg*bw+f[0])/2,f[1]/2+2.5,(H+f[2])/2+1];};
  o.ftp=sg=>{const f=o.ft(sg);return[f[0],f[1],f[2]+1.5];};
  o.wp=k=>W3_a(p.hR,p.dS,k);
  o.HP=(x,y,z)=>[J.hd[0]+x*J.hr,J.hd[1]+y*J.hr,J.hd[2]+z*J.hr];
  return o;}
function W3_riv(B,pts,col,r=.5,d=-.45){for(const q of pts)B.ball(q,r,col,{d});}
// 가슴 판금(정면 판 + 중앙 능선 + 리벳), 등판
function W3_breast(B,W,col,o={}){const bw=W.bw,H=W.H,sh=W.sh,y=(o.y||6.2)*bw,wt=(o.wt||8)*bw,wb=(o.wb||5.6)*bw,zt=sh-1.2,zb=H+3.5+(o.lift||0);
  B.poly([[-wt,y-1.2,zt],[0,y+.6,zt+1.2],[wt,y-1.2,zt],[wb+.6,y,zb+4],[wb,y-.4,zb],[0,y+.4,zb-1.3],[-wb,y-.4,zb],[-wb-.6,y,zb+4]],col,{grad:1,edge:o.edge||W3_T(col,-.6),ew:.7,d:-.25});
  B.line([[0,y+.9,zt+.6],[0,y+.8,zb]],W3_T(col,.45),.8,{d:-.3});
  B.line([[-wt*.85,y-.6,zt-2.3],[0,y+.7,zt-1],[wt*.85,y-.6,zt-2.3]],W3_T(col,-.45),.6,{d:-.3});
  if(o.riv!==0)W3_riv(B,[[-wt*.75,y-.6,zt-1],[wt*.75,y-.6,zt-1],[-wb*.8,y,zb+1.2],[wb*.8,y,zb+1.2],[-wb*.9,y-.1,(zt+zb)/2],[wb*.9,y-.1,(zt+zb)/2]],o.riv||'#d8d0b8',.48,-.35);
  if(o.back)B.poly([[-wt,-y+1.6,zt],[wt,-y+1.6,zt],[wb,-y+.6,zb],[-wb,-y+.6,zb]],W3_T(col,-.1),{grad:1,edge:W3_T(col,-.6),ew:.6,d:.25});}
// 어깨 판금(겹판·테두리·리벳·가시)
function W3_paul(B,W,sg,col,o={}){const bw=W.bw,sh=W.sh,c=[9.4*sg*bw,.3,sh+.4],r=(o.r||4.3)*bw;
  B.ball(c,r,col,{sy:.8,d:-.34});B.ball(W3_a(c,[1.4*sg,0,-2.4]),r*.86,W3_T(col,-.15),{sy:.62,d:-.33});B.ball(W3_a(c,[2.2*sg,0,-4.4]),r*.7,W3_T(col,-.25),{sy:.5,d:-.32});
  B.cap(W3_a(c,[-r*.5*sg,r*.55,r*.1]),W3_a(c,[r*.75*sg,r*.55,-r*.55]),.75,o.rim||W3_T(col,.4),{d:-.42});
  W3_riv(B,[W3_a(c,[-.2*sg,r*.75,r*.2]),W3_a(c,[1.8*sg,r*.62,-1]),W3_a(c,[2.8*sg,r*.5,-3.6])],o.riv||'#e0d6b0',.45,-.44);
  if(o.spikes)for(let i=0;i<o.spikes;i++){const a=W3_a(c,[(.3+i*1.3)*sg,-.8+i*.9,r*.6-i*.4]);B.cap(a,W3_a(a,[1.6*sg,-.3,2.8]),1.15,o.spikeC||'#d8d0c0',{w1:.12,d:-.38});}}
// 팔뚝 보호대(가죽 + 띠 + 징)
function W3_bracer(B,W,sg,col,o={}){const el=W.el(sg),h=W.h(sg),a=W3_m(el,h,.2),b=W3_m(el,h,.82),w=(o.w||4.4)*W.bw,dv=W3_n(...W3_sub(b,a)),pp=W3_perp(dv);
  B.cap(a,b,w,col,{w1:w*.88,d:-.06});for(const t of[.12,.5,.88]){const q=W3_m(a,b,t);B.cap(W3_a(q,pp,-w*.46),W3_a(q,pp,w*.46),.6,o.band||W3_T(col,-.45),{d:-.12});}
  if(o.stud)W3_riv(B,[W3_a(W3_m(a,b,.32),[0,w*.42,.2]),W3_a(W3_m(a,b,.68),[0,w*.4,.2])],o.stud,.42,-.14);}
// 정강이(판금) + 무릎 + 장화 테
function W3_greave(B,W,sg,col,o={}){const kn=W.kn(sg),ft=W.ftp(sg),a=W3_m(kn,ft,.12),b=W3_m(kn,ft,.86),w=(o.w||5.2)*W.bw;
  B.cap(a,b,w,col,{w1:w*.78,d:-.06});B.line([W3_a(a,[0,w*.45,0]),W3_a(b,[0,w*.38,0])],W3_T(col,.45),.55,{d:-.12});
  B.ball(W3_a(kn,[0,1.4,.3]),w*.5,o.knee||W3_T(col,.12),{sy:.85,d:-.16});W3_riv(B,[W3_a(kn,[0,1.4+w*.48,.3])],o.riv||'#d8d0b8',.42,-.2);
  if(o.strap)for(const t of[.35,.72]){const q=W3_m(a,b,t);B.cap(W3_a(q,[-w*.48,.3,0]),W3_a(q,[w*.48,.3,0]),.6,o.strap,{d:-.12});}
  const f=W.ft(sg);B.cap([f[0]-1.9*W.bw,f[1]+.6,f[2]+2.4],[f[0]+1.9*W.bw,f[1]+.6,f[2]+2.4],1.1,o.cuff||W3_T(col,-.3),{d:-.14});}
// 허리띠(버클·주머니) + 비늘치마(앞·옆 판)
function W3_belt(B,W,col,o={}){const bw=W.bw,H=W.H,y=5.4*bw;
  B.cap([-7.2*bw,1.2,H+1.6],[7.2*bw,1.2,H+1.6],2.6,col,{d:-.2});B.cap([-6.6*bw,-1.4,H+1.6],[6.6*bw,-1.4,H+1.6],2.4,col,{d:.2});
  B.poly([[-1.5,y+.6,H+3],[1.5,y+.6,H+3],[1.5,y+.6,H+.2],[-1.5,y+.6,H+.2]],o.buckle||'#c8a048',{grad:1,edge:'#5a4018',ew:.5,d:-.34});
  B.ball([0,y+.9,H+1.6],.55,'#3a2a10',{d:-.36});
  if(o.pouch)B.ball([-5.2*bw,3.4*bw,H-.2],1.9,o.pouch,{sy:1.15,d:-.3});
  if(o.tasset){const tc=o.tasset;for(const[x,yy,ang]of[[-3.4,1,0],[3.4,1,0],[0,1.05,0]]){const yb=y*yy+.2,xb=x*bw;B.poly([[xb-2.2,yb,H+.6],[xb+2.2,yb,H+.6],[xb+2.5,yb+.6,H-6],[xb-2.5,yb+.6,H-6]],tc,{grad:1,edge:W3_T(tc,-.6),ew:.6,d:-.28});B.line([[xb-2.3,yb+.3,H-2.6],[xb+2.3,yb+.3,H-2.6]],W3_T(tc,-.5),.5,{d:-.3});W3_riv(B,[[xb,yb+.4,H-.6]],o.riv||'#d8d0b8',.42,-.32);}
    for(const sg of[-1,1])B.poly([[sg*7*bw,0,H+.6],[sg*7*bw,3,H+.6],[sg*7.6*bw,3,H-5],[sg*7.6*bw,-1.5,H-5]],W3_T(tc,-.1),{grad:1,edge:W3_T(tc,-.6),ew:.5,d:-.05});
    B.poly([[-6*bw,-y+.6,H+.6],[6*bw,-y+.6,H+.6],[6.4*bw,-y,H-5],[-6.4*bw,-y,H-5]],W3_T(tc,-.2),{grad:1,edge:W3_T(tc,-.6),ew:.5,d:.3});}}
// 털 뭉치(가는 cap 여러 개, 명암 교차)
function W3_fur(B,c,n,len,col,o={}){const dir=o.dir||[0,0,-1],sp=o.sp||2.4,w=o.w||1.4;for(let i=0;i<n;i++){const a=(i/(n-1||1)-.5),x=a*sp*(o.sx??1),y=a*sp*(o.sy??0),j=Math.sin(i*2.7)*.5;
    const p0=W3_a(c,[x,y,j*.6]),p1=W3_a(p0,W3_a(dir,[Math.sin(i*1.9)*.35,Math.cos(i*1.3)*.2,0]),len*(.8+.3*Math.abs(Math.sin(i*3.1))));
    B.cap(p0,p1,w,i%2?col:W3_T(col,i%3?-.22:.18),{w1:.2,d:o.d??-.2});}}
// 검(덮어 그리기): 홈·날빛·손잡이 감기·폼멜
function W3_sword(B,W,o={}){const h=W.p.hR,d=W.p.dS,pt=k=>W3_a(h,d,k),n=o.len||22,pp=W3_perp(d),bc=o.blade||'#c8d0d8';
  B.cap(pt(-3.6),pt(2),2.2,o.grip||'#3a2a1c',{d:-.04});for(let i=0;i<4;i++)B.cap(pt(-3+i*1.3),pt(-2.5+i*1.3),2.5,o.wrap||'#6a4a2a',{d:-.06});
  B.ball(pt(-4.4),1.5,o.guard||'#b08a3a',{d:-.06});
  B.cap(W3_a(pt(2.2),pp,-4),W3_a(pt(2.2),pp,4),1.5,o.guard||'#b08a3a',{d:-.06});for(const g of[-1,1])B.ball(W3_a(pt(2.2),pp,4.2*g),1,o.guard||'#b08a3a',{d:-.08});
  B.poly([W3_a(pt(2.6),pp,-1.3),W3_a(pt(2.6),pp,1.3),W3_a(pt(n-3),pp,1.1),pt(n+.5),W3_a(pt(n-3),pp,-1.1)],bc,{grad:1,edge:W3_T(bc,-.5),ew:.45,d:-.08});
  B.line([pt(3.2),pt(n-4)],W3_T(bc,-.35),.55,{d:-.1});B.line([W3_a(pt(3),pp,.9),W3_a(pt(n-3),pp,.75)],'#ffffff',.35,{d:-.1});}
// 도끼(덮어 그리기)
function W3_axe(B,W,o={}){const h=W.p.hR,d=W.p.dS,pt=k=>W3_a(h,d,k),pp=W3_perp(d),hc=o.blade||'#a8aeb6',L=o.L||20;
  B.cap(pt(-6.5),pt(L+1.5),1.9,o.haft||'#5a3a20',{d:-.04});for(let i=0;i<3;i++)B.cap(pt(-1.6+i*1.6),pt(-1+i*1.6),2.4,o.wrap||'#2a1a10',{d:-.06});B.ball(pt(-6.8),1.4,'#6a6e74',{d:-.06});
  const a=pt(L-6),b=pt(L+1.5),sz=o.size||1;const e1=W3_a(W3_a(b,d,2.2*sz),pp,8*sz),e2=W3_a(W3_a(a,d,-2.6*sz),pp,8.4*sz);
  B.poly([W3_a(a,pp,.6),W3_a(b,pp,.6),W3_a(b,pp,3.4*sz),e1,W3_a(W3_m(e1,e2),pp,.9*sz),e2,W3_a(a,pp,3.4*sz)],hc,{grad:1,edge:W3_T(hc,-.55),ew:.55,d:-.1});
  B.line([W3_a(e1,pp,-.5),W3_a(W3_m(e1,e2),pp,.4),W3_a(e2,pp,-.5)],'#f4f8ff',.5,{d:-.12});
  if(o.back!==0)B.poly([W3_a(W3_m(a,b,.25),pp,-.6),W3_a(W3_m(a,b,.75),pp,-.6),W3_a(W3_m(a,b,.5),pp,-4.4*sz)],W3_T(hc,-.1),{grad:1,edge:W3_T(hc,-.55),ew:.45,d:-.1});
  B.cap(W3_m(a,b,.15),W3_m(a,b,.85),2.6,o.bind||'#3a2a18',{d:-.12});W3_riv(B,[W3_a(W3_m(a,b,.3),pp,2),W3_a(W3_m(a,b,.7),pp,2)],'#d8d0b8',.45,-.14);}
// 곤봉(쇠띠·징)
function W3_club(B,W,o={}){const h=W.p.hR,d=W.p.dS,pt=k=>W3_a(h,d,k),wc=o.wood||'#6a4a2a',pp=W3_perp(d),qq=W3_n(...W3_x(d,pp));
  B.cap(pt(-3.4),pt(17),2.4,wc,{w1:5.4,d:-.04});B.ball(pt(17.2),3,wc,{d:-.05});
  B.line([pt(-1),pt(5),pt(12)],W3_T(wc,-.4),.5,{d:-.07});for(let i=0;i<3;i++)B.cap(pt(-3+i*1.5),pt(-2.4+i*1.5),2.9,o.wrap||'#3a2414',{d:-.06});
  for(const k of[10,15.8]){const w=2.4+(5.4-2.4)*(k+3.4)/20.4;B.cap(W3_a(pt(k),pp,-w*.55),W3_a(pt(k),pp,w*.55),1.1,o.band||'#585c62',{d:-.1});}
  for(let i=0;i<7;i++){const a=i/7*6.283,k=11+(i%3)*2.4,w=(2.4+3*(k+3.4)/20.4)*.5,dir=W3_a(W3_a([0,0,0],pp,Math.cos(a)),qq,Math.sin(a)),base=W3_a(pt(k),dir,w);B.cap(base,W3_a(base,dir,o.spk||2.2),.9,o.spike||'#c8ccd0',{w1:.1,d:-.12});}}
// 방패(덮어 그리기): 철테·리벳·보스·문양
function W3_shield(B,W,o={}){const c0=W3_a(W.p.hL,[0,2.5,0]),u=W3_n(1,.3,0),v=[0,0,1],nf=W3_n(-.3,1,0),r=5*W.bw,P=(a,rr,f=.2)=>W3_a(W3_a(W3_a(c0,u,Math.cos(a)*rr),v,Math.sin(a)*rr),nf,f);
  const ring=[];for(let i=0;i<20;i++)ring.push(P(i/20*6.283,r*1.02,.15));B.poly(ring,o.rim||'#5c6066',{edge:'#202226',ew:.6,d:-.62});
  const inner=[];for(let i=0;i<20;i++)inner.push(P(i/20*6.283,r*.84,.25));B.poly(inner,o.face||'#6a4a2a',{grad:1,d:-.64});
  for(const x of[-.45,0,.45])B.line([P(Math.acos(x),r*.84,.3),P(-Math.acos(x),r*.84,.3)],W3_T(o.face||'#6a4a2a',-.45),.45,{d:-.66});
  if(o.emblem)o.emblem(P,r);
  for(let i=0;i<8;i++)B.ball(P(i/8*6.283+.2,r*.93,.35),.42,'#d8d0b8',{d:-.7});
  B.ball(P(0,0,.6),r*.3,o.boss||'#8a8e96',{d:-.72});if(o.spike)B.cap(P(0,0,.8),P(0,0,3.6),1.2,'#d0d4d8',{w1:.1,d:-.74});}
// 오크 얼굴 보강(눈두덩·큰 엄니·코·흉터/문신)
function W3_orcFace(B,W,o={}){const P=W.HP,sk=o.skin;
  B.cap(P(-.62,.8,.36),P(.62,.8,.36),W.J.hr*.24,W3_T(sk,-.32),{d:-.08});
  B.ball(P(0,.98,-.05),W.J.hr*.2,W3_T(sk,-.12),{d:-.08});for(const g of[-1,1])B.ball(P(.1*g,1.1,-.12),W.J.hr*.05,'#1a1410',{flat:1,d:-.1});
  for(const g of[-1,1]){B.cap(P(.34*g,.92,-.62),P(.46*g,1.08,.02),W.J.hr*.2,o.tusk||'#ece0c0',{w1:W.J.hr*.05,d:-.12});}
  B.cap(P(-.4,.88,-.68),P(.4,.88,-.68),W.J.hr*.08,'#2a1008',{d:-.1});
  if(o.paint)for(const g of[-1,1])B.line([P(.5*g,.75,.05),P(.42*g,.82,-.35),P(.28*g,.86,-.5)],o.paint,.5,{d:-.1});
  if(o.ring)for(const g of[-1,1])B.ball(P(1.55*g,-.25,.25),W.J.hr*.12,o.ring,{d:-.05});}
// 오크 투구 장식(테·코가리개·뿔·볏)
function W3_orcHelm(B,W,col,o={}){const P=W.HP,hr=W.J.hr;for(let i=0;i<14;i++){const a=i/14*6.283;B.ball(P(Math.cos(a)*.98,Math.sin(a)*.98,.22),hr*.1,i%2?W3_T(col,.3):'#d8d0b8',{d:-.04});}
  B.cap(P(0,1.02,.62),P(0,1.12,-.05),hr*.2,W3_T(col,.15),{w1:hr*.12,d:-.1});
  B.cap(P(0,.9,.9),P(0,-.9,.9),hr*.18,W3_T(col,.3),{d:-.02});
  if(o.horn)for(const g of[-1,1]){const a=P(.82*g,0,.62),b=P(1.45*g,.15,1.05),c=P(1.55*g,.45,1.75);B.cap(a,b,hr*.34,o.horn,{w1:hr*.22,d:-.03});B.cap(b,c,hr*.22,o.horn,{w1:hr*.05,d:-.03});for(const t of[.35,.7])B.ball(W3_m(a,b,t),hr*.25,W3_T(o.horn,-.3),{sy:.5,d:-.04});}}

// 목걸이(이빨·뼈 구슬)
function W3_neck(B,W,col,o={}){const bw=W.bw,sh=W.sh,n=o.n||9;for(let i=0;i<n;i++){const a=(i/(n-1)-.5)*2.4,q=[Math.sin(a)*5.6*bw,Math.cos(a)*4.6*bw+.6,sh-1.2-Math.cos(a)*2.4];
  if(o.fang&&i%2===0)B.cap(q,W3_a(q,[0,.3,-2.4]),1.1,o.fang,{w1:.15,d:-.4});else B.ball(q,o.r||.8,col,{d:-.4});}}
// 모피 망토(어깨 위 털가리개)
function W3_mantle(B,W,col,o={}){const bw=W.bw,sh=W.sh;for(const sg of[-1,1]){for(let i=0;i<5;i++){const a=i/4,c=[sg*(3+a*7)*bw,(1-a)*3.2-1,sh+1.6-a*1.2];B.ball(c,2.4*bw,i%2?col:W3_T(col,-.15),{sy:.8,d:-.25});W3_fur(B,W3_a(c,[0,1,-.8]),3,3.2,col,{sp:2,sx:1,w:1.3,d:-.3});}}
  for(let i=0;i<5;i++)W3_fur(B,[(i-2)*3*bw,-4.2,sh+.4],3,4.5,W3_T(col,-.1),{sp:2,w:1.5,d:.25});}
// 지팡이(덮어 그리기): 마디진 자루·감은 띠·발톱 받침·매단 부적
function W3_staff(B,W,o={}){const h=W.p.hR,d=W.p.dS,pt=k=>W3_a(h,d,k),pp=W3_perp(d),wc=o.wood||'#5a3e22',qq=W3_n(...W3_x(d,pp));
  for(let i=0;i<6;i++){const a=-14+i*5,b=a+5,j=Math.sin(i*2.3)*.35;B.cap(W3_a(pt(a),pp,j),W3_a(pt(b),pp,-j),1.7-i*.05,i%2?wc:W3_T(wc,.12),{d:-.04});if(i)B.ball(W3_a(pt(a),pp,j),1.15,W3_T(wc,-.2),{d:-.05});}
  for(let i=0;i<3;i++)B.cap(pt(-1+i*1.2),pt(-.5+i*1.2),2.2,o.wrap||'#c0a050',{d:-.06});
  for(let i=0;i<4;i++){const a=i/4*6.283+.4,dir=W3_a(W3_a([0,0,0],pp,Math.cos(a)),qq,Math.sin(a));const b=W3_a(pt(13.4),dir,1.4),c=W3_a(W3_a(pt(16.6),dir,2.3),d,.2),e=W3_a(pt(18.4),dir,.9);B.cap(b,c,.9,o.claw||W3_T(wc,-.1),{w1:.6,d:-.08});B.cap(c,e,.6,o.claw||W3_T(wc,-.1),{w1:.15,d:-.08});}
  B.ball(pt(16),2.5,o.orb||'#9fdcff',{glow:o.fx,d:-.07});B.ball(W3_a(pt(16.6),[-.5,0,.6]),.8,'#ffffff',{flat:1,alpha:.7,d:-.1});
  if(o.charm){const a=pt(12.5),b=W3_a(a,[0,0,-4]);B.line([a,W3_a(b,[0,0,.6])],'#3a2a1a',.35,{d:-.06});B.ball(b,.9,o.charm,{glow:o.fx,d:-.07});for(const g of[-1,1])B.cap(W3_a(b,[0,0,-.6]),W3_a(b,[g*.6,0,-2.6]),.6,o.charm,{w1:.15,d:-.07});}}
// 마법사 로브 보강(앞 트임 장식선·밑단 문양·소매 종·어깨망토·허리 끈·수염 가닥)
function W3_mage(B,W,o){const bw=W.bw,H=W.H,sh=W.sh,cl=o.cloth,tr=o.trim,p=W.p;
  B.poly([[-7*bw,-2,H+2],[7*bw,-2,H+2],[10*bw,-4-p.cape*.3,1],[0,-6-p.cape*.5,0],[-10*bw,-4-p.cape*.3,1]],W3_T(cl,-.22),{grad:1,d:-.01});
  for(let i=0;i<3;i++){const x=(i-1)*4.4*bw;B.line([[x*.7,-2.6,H],[x,-4.6-p.cape*.35,1.4]],W3_T(cl,-.45),.6,{d:-.02});}
  B.poly([[-1.4,6.1*bw,sh-2],[1.4,6.1*bw,sh-2],[1.8,6.4,H+2],[1.6,5.4,H*.5],[.4,6.3,1],[-.4,6.3,1],[-1.6,5.4,H*.5],[-1.8,6.4,H+2]],W3_T(cl,-.3),{grad:1,d:-.3});
  for(const g of[-1,1]){B.line([[1.6*g,6.3*bw,sh-2],[2*g,6.5,H+2],[1.8*g,5.5,H*.5],[.7*g,6.4,1.2]],tr,.85,{d:-.32});}
  const hem=[];for(let i=0;i<=10;i++){const a=(i/10-.5)*2.4;hem.push([Math.sin(a)*10*bw,Math.cos(a)*5.4+.3,2.4+Math.abs(Math.sin(a))*-.4]);}B.line(hem,tr,1,{d:-.25});
  for(let i=1;i<10;i+=2){const q=hem[i];B.ball(W3_a(q,[0,.3,1.3]),.55,o.gem||tr,{glow:o.runeGlow,d:-.28});}
  for(const sg of[-1,1]){const el=W.el(sg),h=W.h(sg);B.cap(W3_m(el,h,.35),W3_m(el,h,.86),4.6*bw,cl,{w1:7*bw,d:-.06});B.cap(W3_a(W3_m(el,h,.86),[0,0,0]),W3_a(W3_m(el,h,.9),[0,0,0]),7.2*bw,tr,{d:-.08,alpha:.9});}
  // 어깨망토(짧은 케이프) 앞·뒤
  B.poly([[-9.5*bw,1,sh+1.2],[9.5*bw,1,sh+1.2],[10.5*bw,3.8*bw,sh-5],[0,6.8*bw,sh-6.4],[-10.5*bw,3.8*bw,sh-5]],o.mantle||W3_T(cl,-.18),{grad:1,edge:tr,ew:.8,d:-.33});
  B.poly([[-9.5*bw,-1,sh+1.2],[9.5*bw,-1,sh+1.2],[10.5*bw,-4.6*bw,sh-6],[0,-6.4*bw,sh-7.4],[-10.5*bw,-4.6*bw,sh-6]],o.mantle||W3_T(cl,-.18),{grad:1,edge:tr,ew:.8,d:.3});
  B.ball([0,6.9*bw,sh-5.4],1.2,o.gem||tr,{glow:o.runeGlow,d:-.4});
  // 허리 끈·술
  B.cap([-6.6*bw,1.2,H+2],[6.6*bw,1.2,H+2],1.6,o.sash||'#c8b070',{d:-.22});B.cap([-6*bw,-1.2,H+2],[6*bw,-1.2,H+2],1.5,o.sash||'#c8b070',{d:.22});
  for(const g of[-1,1]){const a=[g*2.2,6.4*bw,H+1.6];B.cap(a,W3_a(a,[g*.6,.6,-6.5]),.8,o.sash||'#c8b070',{d:-.3});B.cap(W3_a(a,[g*.6,.6,-6.5]),W3_a(a,[g*.7,.7,-8.4]),1.4,o.sash||'#c8b070',{w1:.6,d:-.3});}
  if(o.book){B.poly([[-6.4*bw,3.6,H+1],[-4.4*bw,5,H+1],[-4.6*bw,5.2,H-3.6],[-6.6*bw,3.8,H-3.6]],o.book,{grad:1,edge:'#c0a050',ew:.5,d:-.3});}
  if(o.beard){const P=W.HP,hr=W.J.hr;for(let i=0;i<7;i++){const x=(i-3)*.16;B.cap(P(x,.9,-.4),P(x*1.3+Math.sin(i)*.08,.98+Math.sin(i*1.7)*.1,-1.9-Math.abs(Math.sin(i*2.1))*.5),hr*.18,i%2?o.beard:W3_T(o.beard,-.15),{w1:hr*.05,d:-.22});}
    B.cap(P(-.5,.95,-.25),P(.5,.95,-.25),hr*.22,o.beard,{d:-.24});}}
// 늑대 머리 보강(주둥이 이빨·코·눈두덩·귀 안쪽·갈기)
function W3_wolfHead(B,W,o){const P=W.HP,hr=W.J.hr,sk=o.skin,dk=W3_T(sk,-.35),at=B.mode==='attack'&&B.f===1||B.mode==='skill'&&B.f===2;
  B.cap(P(0,.6,.35),P(0,1.7,-.02),hr*.36,W3_T(sk,.08),{w1:hr*.22,d:-.06});
  B.ball(P(0,2.02,-.22),hr*.2,'#141010',{d:-.1});B.ball(P(-.05,2.06,-.12),hr*.06,'#808080',{flat:1,d:-.12});
  B.cap(P(-.5,.78,.42),P(-.12,.95,.36),hr*.18,dk,{d:-.09});B.cap(P(.5,.78,.42),P(.12,.95,.36),hr*.18,dk,{d:-.09});
  const jo=at?.45:.12;B.cap(P(0,.7,-.6-jo*.4),P(0,1.75,-.62-jo),hr*.38,W3_T(sk,-.1),{w1:hr*.26,d:-.05});
  B.cap(P(-.28,.9,-.42-jo*.3),P(-.18,1.85,-.48-jo*.5),hr*.12,'#5a1a18',{d:-.06});B.cap(P(.28,.9,-.42-jo*.3),P(.18,1.85,-.48-jo*.5),hr*.12,'#5a1a18',{d:-.06});
  for(let i=0;i<4;i++){const y=1.0+i*.26;for(const g of[-1,1]){B.cap(P(.27*g,y,-.38),P(.27*g,y+.04,-.62-(i===0?.18:0)),hr*.07,'#f4ecd6',{w1:hr*.01,d:-.11});}}
  for(const g of[-1,1]){B.cap(P(.5*g,-.05,.78),P(.6*g,-.15,1.45),hr*.18,o.earIn||'#7a4a40',{w1:hr*.03,d:-.08});W3_fur(B,P(.85*g,.25,-.25),3,hr*.55,sk,{dir:[g*.8,-.3,-.4],sp:hr*.5,sx:0,sy:1,w:1.2,d:-.03});}
  for(let i=0;i<6;i++)B.cap(P(Math.sin(i*1.3)*.35,-.3-i*.18,.9-i*.12),P(Math.sin(i*1.3)*.5,-.9-i*.18,.7-i*.3),hr*.32,i%2?sk:dk,{w1:hr*.06,d:.04});}
// 근육 몸통(가슴·복근 명암) + 털 뭉치
function W3_beastBody(B,W,o){const bw=W.bw,H=W.H,sh=W.sh,sk=o.skin,y=6*bw,lt=o.chest||W3_T(sk,.12);
  for(const g of[-1,1])B.ball([g*3.4*bw,y-1.6,sh-4],3.3*bw,lt,{sx:1.15,sy:.62,d:-.2});
  for(let i=0;i<3;i++)for(const g of[-1,1])B.ball([g*1.6*bw,y-1.1,sh-9.2-i*2.6],1.6*bw,W3_T(lt,-.08),{sy:.8,d:-.2});
  B.line([[0,y-.4,sh-6],[0,y-.2,H+2]],W3_T(sk,-.4),.5,{d:-.24});
  for(let i=0;i<7;i++){const a=(i/6-.5)*2;W3_fur(B,[Math.sin(a)*8*bw,Math.cos(a)*3+(-1),sh+1.6-Math.abs(a)*.8],3,3.6,i%2?o.fur:W3_T(o.fur,-.12),{sp:2,sx:1,w:1.6,d:-.28});}
  for(let i=0;i<6;i++)W3_fur(B,[0,-5.2*bw,sh+.5-i*3.4],3,3.4,i%2?o.fur:W3_T(o.fur,-.2),{dir:[0,-.6,-.8],sp:3.4,sx:1,w:1.7,d:.28});
  for(const sg of[-1,1]){const el=W.el(sg),h=W.h(sg),kn=W.kn(sg),f=W.ftp(sg);
    W3_fur(B,W3_m(el,h,.45),3,3,o.fur,{dir:[sg*.5,-.6,-.4],sp:2,sx:0,sy:1,w:1.4,d:-.07});W3_fur(B,W3_a(kn,[0,-1,0]),3,3.4,o.fur,{dir:[sg*.4,-.5,-.6],sp:2.4,sx:1,w:1.5,d:-.07});
    for(let i=-1;i<=1;i++)B.cap(h,W3_a(h,W3_n(i*.45,.9,-.45),4.6),.9,'#f0e6cc',{w1:.12,d:-.1});}}
// 해골 몸(휜 갈비뼈·흉골·쇄골·골반·척추 마디·관절·손가락·이빨)
function W3_skel(B,W,o={}){const bw=W.bw,H=W.H,sh=W.sh,bc=o.bone||'#e6dfcc',dk=W3_T(bc,-.3);
  for(let i=0;i<5;i++){const z=sh-2.2-i*2.8,R=5.8-Math.abs(i-1.5)*.45;let prev=null;for(let j=0;j<=6;j++){const a=-1.75+j*3.5/6;const q=[Math.sin(a)*R,Math.cos(a)*3.6*bw-.4,z-Math.abs(Math.sin(a))*1.4];if(prev)B.cap(prev,q,1.05,j%2?bc:W3_T(bc,-.08),{d:-.15});prev=q;}}
  B.cap([0,3.6*bw,sh-1.4],[0,3.4*bw,sh-11],1.5,W3_T(bc,-.05),{w1:.9,d:-.2});
  for(const g of[-1,1])B.cap([g*1,2.6,sh-.2],[g*8.2*bw,.4,sh-.6],1.2,bc,{d:-.18});
  for(let i=0;i<7;i++)B.ball([0,-1.2,H+1+i*(sh-H)/7],1.25,i%2?bc:dk,{d:.05});
  B.ball([0,.6,H+.2],3.6*bw,W3_T(bc,-.08),{sx:1.3,sy:.5,d:-.05});for(const g of[-1,1])B.ball([g*2.2*bw,1.8,H-.2],1.2,'#2a2018',{flat:1,d:-.12});
  for(const sg of[-1,1]){B.ball(W.el(sg),1.6,bc,{d:-.08});B.ball(W.kn(sg),1.9,bc,{d:-.1});B.ball(W.sp(sg),2.1,bc,{d:-.06});
    const h=W.h(sg);if(o.fingers!==0)for(let i=-1;i<=1;i++)B.cap(h,W3_a(h,W3_n(i*.4+sg*.2,.6,-.8),2.4),.5,bc,{w1:.3,d:-.07});}
  const P=W.HP,hr=W.J.hr;for(let i=-3;i<=3;i++)B.cap(P(i*.11,.86,-.38),P(i*.11,.86,-.56),hr*.08,'#f4f0e0',{d:-.12});B.cap(P(-.4,.8,-.6),P(.4,.8,-.6),hr*.1,dk,{d:-.1});
  B.cap(P(-.62,.82,.36),P(.62,.82,.36),hr*.1,dk,{d:-.07});B.line([P(.25,.55,.95),P(.4,.68,.6),P(.3,.8,.45)],'#4a3e30',.35,{d:-.08});}
// 창(덮어 그리기): 잎날·물미·감은 끈
function W3_spear(B,W,o={}){const h=W.p.hR,d=W.p.dS,pt=k=>W3_a(h,d,k),pp=W3_perp(d),bc=o.blade||'#c8a860';
  B.cap(pt(-16),pt(22),1.4,o.haft||'#6a4a28',{d:-.04});for(let i=0;i<4;i++)B.cap(pt(-2+i*1.2),pt(-1.5+i*1.2),1.9,o.wrap||'#3a2414',{d:-.06});
  B.cap(pt(-16),pt(-19.5),1.5,bc,{w1:.2,d:-.05});B.cap(pt(21),pt(23),2,W3_T(bc,-.2),{d:-.06});
  B.poly([pt(22.5),W3_a(pt(25),pp,2),W3_a(pt(28.5),pp,1.4),pt(32),W3_a(pt(28.5),pp,-1.4),W3_a(pt(25),pp,-2)],bc,{grad:1,edge:W3_T(bc,-.5),ew:.45,d:-.08});
  B.line([pt(23),pt(31)],W3_T(bc,.5),.45,{d:-.1});
  if(o.tassel){B.cap(pt(21),W3_a(pt(19),[0,0,-3]),1,o.tassel,{w1:.3,d:-.05});}}
// 찢어진 천 자락(tabard): 앞/뒤
function W3_tabard(B,W,col,o={}){const bw=W.bw,H=W.H,sh=W.sh;for(const sd of[1,-1]){const y=sd*(sd>0?4.4:4.6)*bw,pts=[[-3.4*bw,y,sh-1],[3.4*bw,y,sh-1]];const n=6;for(let i=0;i<=n;i++){const x=3.6*bw-i*7.2*bw/n;pts.push([x,y+sd*.8,H-(o.len||7)+((i*7)%3)*1.4-(i%2?0:1.6)]);}
  B.poly(pts,sd>0?col:W3_T(col,-.15),{grad:1,edge:W3_T(col,-.6),ew:.5,d:sd>0?-.22:.22});if(o.emb&&sd>0)o.emb([0,y+.3,H+4]);}}
// 네발짐승 기하(plan.quad 와 같은 식) — 머리 1개 기준
function W3_Qg(B){const s=B.s,{mode,f,t}=B,run=mode==='run',walk=mode==='walk'||run;const h=s.h||14,L=s.len||12,bw=s.bulk||1;
  const ph=f*Math.PI/2+(run?Math.PI/4:0);let lunge=0,headUp=0,jaw=0;
  if(mode==='attack'){lunge=[-2,6,2][f];jaw=[0,1,.2][f];}if(mode==='buff'){headUp=[.4,.9,.9,.5][f];jaw=[.3,.8,.8,.3][f];}if(mode==='skill'){lunge=[-4,2,9,3][f];jaw=[0,.4,1,.2][f];}
  const ny=lunge,front=[0,L*.5+ny,h+1],R0=(s.bodyR||6)*bw;const hd=[0,front[1]+4+(s.neckL||2)-headUp*2,h+5+headUp*7+(s.headZ||0)],r=(s.headR||4.3)*bw,fwd=W3_n(0,1-headUp*.3,headUp*.6),sn=s.snout??1.6,tip=W3_a(W3_a(hd,fwd,r*(1+sn)),[0,0,-r*.25]);
  const legs=[];[[-1,1],[1,1],[-1,-1],[1,-1]].forEach(([sx,sy],i)=>{const diag=(i%2===0)===(sy>0);const sw=walk?Math.cos(ph+(run?(sy>0?0:Math.PI*.6):(diag?0:Math.PI))):0,lift=walk?Math.max(0,Math.sin(ph+(diag?0:Math.PI)))*(run?4:2.5):0;
    const top=[sx*4*bw*(s.wideLegs||1),sy*L*.42+ny*(sy>0?1:.5),h-1],ft=[sx*4.6*bw*(s.wideLegs||1),sy*L*.42+ny*(sy>0?1:.5)+sw*(run?5:3.2),lift],kn=[top[0]*1.05,(top[1]+ft[1])/2+(sy>0?-1.5:1.5),(h+lift)/2];legs.push({sx,sy,top,kn,ft});});
  return{s,mode,f,t,run,walk,h,L,bw,ny,front,R0,hd,r,fwd,sn,tip,jaw,headUp,legs,ph};}
// 벌레 기하(plan.bug 와 같은 식)
function W3_Bg(B){const s=B.s,{mode,f,t}=B,run=mode==='run',walk=mode==='walk'||run,bw=s.bulk||1,h=s.h||6;const ph=f*Math.PI/2+(run?Math.PI/4:0);let rear=0,lunge=0,snap=0;
  if(mode==='attack'){lunge=[-1,4,1][f];snap=[0,1,.3][f];}if(mode==='buff'){rear=[.4,.9,.9,.5][f];}if(mode==='skill'){rear=[.3,.6,.2,0][f];lunge=[-2,0,5,1][f];}
  const segs=s.segs||[[0,-8,1.2,6],[0,0,1,4.4],[0,5,1,3.6]],n=segs.length;const S=segs.map(([x,y,z,r],i)=>({p:[x*bw,y+lunge*(i===n-1?1:.4),h+z+(i===n-1?rear*5:rear*2*(i/n))],r:r*bw}));
  const nl=s.legs||6,spread=s.spread||10,L=[];for(let i=0;i<nl;i++){const sg=i%2?1:-1,row=Math.floor(i/2),rows=nl/2,yb=(s.legY0??2)-row*(s.legStep||2.2)+lunge,tri=(row%2===0)===(sg>0);
    const sw=walk?Math.cos(ph+(tri?0:Math.PI))*(run?3.2:2.2):0,lift=walk?Math.max(0,Math.sin(ph+(tri?0:Math.PI)))*(run?2.5:1.6):0;
    L.push({sg,row,root:[sg*2.5*bw,yb,h],knee:[sg*(spread*.6)*bw,yb+(row-(rows-1)/2)*2+sw*.5,h+(s.knee||5)],ft:[sg*spread*bw,yb+(row-(rows-1)/2)*4.5+sw,lift]});}
  const hs=S[n-1];return{s,mode,f,t,walk,run,bw,h,rear,lunge,snap,S,L,hp:hs.p,hr:hs.r,ph};}
// 둥근 몸 기하(plan.blob 과 같은 식)
function W3_Og(B){const s=B.s,{mode,f,t}=B,run=mode==='run',walk=mode==='walk'||run,r=s.r||9,ph=f*Math.PI/2;let hop=walk?Math.abs(Math.sin(ph))*(run?5:3):0,sq=walk?1+.12*Math.cos(ph*2):1,lunge=0,pulse=0;
  if(mode==='attack'){lunge=[-2,5,1][f];sq=[1.15,.85,1][f];}if(mode==='buff'){pulse=[.05,.12,.12,.06][f];}if(mode==='skill'){sq=[1.2,1.05,.9,1][f];lunge=[0,0,2,0][f];}
  const fl=s.float?6+Math.sin(t/500+f)*1.5:0;return{s,mode,f,t,walk,run,r,ph,sq,lunge,pulse,z0:fl+hop};}
// =====================================================================
// 3. 오크 전사 — 판금 흉갑·뿔 투구·철테 방패·장검
Q.push(['오크 전사',{armor:'#5e626c',pads:'#70747e',pants:'#3a3228',belt:'#3a2414',boot:'#2a1e16',helm:'#5a5e68',hand:'#56702f',
 detail(B,K){const W=W3_J(B),sk='#5f7a3a';
  W3_belt(B,W,'#3a2414',{tasset:'#62666e',pouch:'#5a3a1e'});
  W3_breast(B,W,'#7a7e88',{back:1});
  B.cap([-7.4*W.bw,5.2,W.sh-1],[6*W.bw,6.4,W.H+3],1.4,'#4a2e18',{d:-.4});
  for(const sg of[-1,1]){W3_paul(B,W,sg,'#7a7e88',{spikes:sg>0?3:0});W3_bracer(B,W,sg,'#4a3220',{stud:'#c8c0a8'});W3_greave(B,W,sg,'#6a6e78',{strap:'#3a2414'});}
  W3_orcFace(B,W,{skin:sk,paint:'#a02818'});W3_orcHelm(B,W,'#5a5e68',{horn:'#d8ccb0'});
  W3_sword(B,W,{blade:'#cdd4dc',guard:'#a88438'});
  W3_shield(B,W,{face:'#6a4a2a',spike:1,emblem:(P,r)=>{B.poly([P(1.57,r*.6,.32),P(.5,r*.55,.32),P(0,r*.1,.32),P(-.5,r*.55,.32),P(-1.57,r*.6,.32),P(3.14,r*.1,.32)],'#8a1a12',{d:-.68,alpha:.85});}});}}]);

// 6. 아투바 오크 — 부족 전사: 모피 망토·뼈 장식·붉은 전투 문신·양날 대도끼
Q.push(['아투바 오크',{armor:'#6a3020',pads:null,pants:'#3a2a20',belt:'#2a1a10',boot:'#2a1a12',hair:null,hand:'#6a6a32',
 detail(B,K){const W=W3_J(B),sk='#7a7a3a',bw=W.bw,H=W.H,sh=W.sh;
  // 가죽 흉갑 조각(겹친 가죽판 + 꿰맨 줄)
  for(let i=0;i<3;i++){const z=sh-3-i*4.2,w=(8-i*.9)*bw;B.poly([[-w,5.6*bw,z+1.6],[w,5.6*bw,z+1.6],[w-.8,6.1*bw,z-2.6],[-w+.8,6.1*bw,z-2.6]],i%2?'#7a3a26':'#8a4630',{grad:1,edge:'#2a120a',ew:.6,d:-.25});for(let j=-2;j<=2;j++)B.ball([j*2.6*bw,6.3*bw,z-2],.38,'#d0b890',{d:-.3});}
  B.cap([-7.4*bw,5.6,sh-1],[6*bw,6.6,H+3],1.6,'#3a2010',{d:-.42});B.cap([7.4*bw,5.6,sh-1],[-6*bw,6.6,H+3],1.6,'#3a2010',{d:-.41});
  B.ball([0,7.2*bw,(sh+H)/2+1],2.1,'#e6dcc4',{d:-.46});for(const g of[-1,1])B.ball([g*.75,7.9*bw,(sh+H)/2+1.3],.55,'#1a0a06',{flat:1,d:-.5});
  W3_mantle(B,W,'#5a4030');W3_neck(B,W,'#e8dcc0',{fang:'#f0e6cc',n:9});
  W3_belt(B,W,'#2a1a10',{pouch:'#4a2a18'});
  for(const x of[-3.6,0,3.6])B.poly([[x*bw-1.8,5.8*bw,H+.4],[x*bw+1.8,5.8*bw,H+.4],[x*bw+1.2,6.3*bw,H-7],[x*bw-1.4,6.3*bw,H-7.4]],x?'#5a4030':'#7a3a26',{grad:1,edge:'#1a0e08',ew:.5,d:-.26});
  for(const sg of[-1,1]){W3_bracer(B,W,sg,'#4a2a18',{band:'#c8b890'});
    const kn=W.kn(sg),f=W.ftp(sg);W3_fur(B,W3_a(W3_m(kn,f,.55),[0,0,1.5]),4,3.2,'#5a4030',{sp:3,sx:1,w:1.4,d:-.12});
    B.ball(W3_a(kn,[0,1.4,.2]),1.8,'#e6dcc4',{d:-.16});}
  // 어깨 뼈 견갑 + 가시
  for(const sg of[-1,1]){const c=[9.4*sg*bw,.4,sh+1.4];B.ball(c,3.4*bw,'#e0d4b8',{sy:.7,d:-.36});for(let i=0;i<2;i++)B.cap(W3_a(c,[(.5+i)*sg,-.4+i,1.2]),W3_a(c,[(2+i*1.2)*sg,-.6+i,4.8-i]),1.1,'#efe4cc',{w1:.12,d:-.38});}
  const P=W.HP,hr=W.J.hr;W3_orcFace(B,W,{skin:sk,paint:'#c0301c',ring:'#c8a048'});
  for(let i=0;i<5;i++){const y=.8-i*.42;B.cap(P(0,y,1.02-Math.abs(y)*.2),P(0,y-.2,1.5-Math.abs(y-.1)*.35),hr*.3,'#1a1210',{w1:hr*.1,d:-.02});}
  for(const g of[-1,1])B.line([P(.75*g,.58,.5),P(.2*g,.95,.45)],'#c0301c',.7,{d:-.1});
  B.cap(P(-.08,1.12,-.15),P(.08,1.12,-.15),hr*.12,'#c8a048',{d:-.12});
  W3_axe(B,W,{blade:'#a0a6ae',haft:'#4a2e18',size:1.12,bind:'#5a2a18'});
  {const h=W.p.hR,d=W.p.dS,pt=k=>W3_a(h,d,k);B.cap(pt(-5),pt(-8),.5,'#3a2010');B.ball(pt(-8.6),.9,'#e6dcc4',{d:-.06});B.cap(pt(-5),W3_a(pt(-8),[1.4,0,0]),.5,'#3a2010');B.ball(W3_a(pt(-8.6),[1.4,0,0]),.8,'#c03020',{d:-.06});}}}]);

// 9. 간디 오크 — 징 박은 가죽 갑옷·사슬 띠·땋은 머리·쇠징 곤봉
Q.push(['간디 오크',{armor:'#4a2232',pants:'#2a2028',belt:'#2a1418',boot:'#1e1418',hand:'#5a6a30',
 detail(B,K){const W=W3_J(B),sk='#6a7a3a',bw=W.bw,H=W.H,sh=W.sh,y=6.2*bw;
  B.poly([[-8*bw,y-1.2,sh-1],[8*bw,y-1.2,sh-1],[6*bw,y,H+3],[-6*bw,y,H+3]],'#5a2a3a',{grad:1,edge:'#1a0a10',ew:.7,d:-.25});
  for(let r=0;r<4;r++)for(let c=-2;c<=2;c++){const z=sh-2.4-r*3.4,x=c*2.6*bw*(1-r*.06);B.ball([x,y-.6+r*.2,z],.55,'#b8b0a0',{d:-.32});}
  // 등판 징
  B.poly([[-7.4*bw,-y+1.6,sh-1],[7.4*bw,-y+1.6,sh-1],[5.6*bw,-y+.6,H+3],[-5.6*bw,-y+.6,H+3]],'#4a2030',{grad:1,edge:'#1a0a10',ew:.6,d:.25});
  for(let r=0;r<3;r++)for(let c=-1;c<=1;c++)B.ball([c*3*bw,-y+.4,sh-3-r*4],.55,'#b8b0a0',{d:.2});
  // 사슬 대각 띠
  for(let i=0;i<10;i++){const t=i/9,q=W3_m([-8*bw,y-.5,sh],[6.5*bw,y+.4,H+2],t);B.ball(q,.85,i%2?'#80848c':'#a0a4aa',{sx:1.3,d:-.36});}
  W3_belt(B,W,'#2a1418',{tasset:'#4a2a30',riv:'#b8b0a0'});
  for(const g of[-1,1]){B.ball([g*4.6*bw,6.2*bw,H-1.5],1.6,'#e6dcc4',{d:-.4});B.ball([g*4.6*bw+.6*g*0,6.9*bw,H-1.2],.45,'#1a0a06',{flat:1,d:-.42});}
  for(const sg of[-1,1]){W3_paul(B,W,sg,'#5a2a3a',{rim:'#8a8e96',riv:'#c0b8a8',r:4.1,spikes:2,spikeC:'#a0a4aa'});W3_bracer(B,W,sg,'#3a1a22',{stud:'#b8b0a0'});W3_greave(B,W,sg,'#3a2a2e',{knee:'#70747c',strap:'#1a0a10'});}
  const P=W.HP,hr=W.J.hr;W3_orcFace(B,W,{skin:sk,ring:'#b8b0a0'});
  for(const g of[-1,1])B.line([P(.55*g,.7,.62),P(.25*g,.92,.1),P(.3*g,.94,-.3)],'#3a1a10',.45,{d:-.12});
  for(const g of[-1,1]){let a=P(.7*g,-.5,.3);for(let i=1;i<=4;i++){const b=P((.85+i*.04)*g,-.75-i*.12,.3-i*.45);B.ball(b,hr*.2,i%2?'#1e1410':'#2e2018',{d:.05});a=b;}B.ball(P(.95*g,-1.3,-1.6),hr*.16,'#c8a048',{d:.04});}
  B.ball(P(0,-.15,.42),hr*.98,'#1e1410',{sy:.72,d:.04});B.ball(P(0,-.95,.5),hr*.32,'#2a1a14',{d:.06});
  W3_club(B,W,{wood:'#5a3a22',spike:'#c0c4c8',band:'#4a4e54',spk:2.4});}}]);

// 12. 고블린 — 누더기 가죽 튜닉·붕대 감은 손발·매부리코·톱니 단검
Q.push(['고블린',{cloth:'#5a4026',pants:'#3a2c1c',boot:'#3a2a1a',hand:'#7a8a32',
 detail(B,K){const W=W3_J(B),sk='#8a9a3a',bw=W.bw,H=W.H,sh=W.sh,y=6*bw;
  // 누더기 자락(톱니 가장자리) 앞·뒤
  const rag=(yy,col,dd)=>{const pts=[[-6.4*bw,yy,H+3]];for(let i=0;i<=8;i++){const x=-6.6*bw+i*13.2*bw/8;pts.push([x,yy+(yy>0?.4:-.4),H-(i%2?3.6:6.2)-Math.sin(i*1.7)*.8]);}pts.push([6.4*bw,yy,H+3]);B.poly(pts,col,{grad:1,edge:'#1a1008',ew:.5,d:dd});};
  rag(y-.4,'#6a4a2a',-.22);rag(-y+.6,'#54381e',.22);
  for(const z of[sh-3,H+6])B.line([[-5*bw,y,z],[-1*bw,y+.3,z-.8],[3*bw,y+.2,z+.4]],'#2a1a0c',.45,{d:-.3});
  B.poly([[-2,y+.1,sh-4],[1.2,y+.2,sh-4.6],[1.6,y+.2,sh-7.4],[-1.6,y+.1,sh-7]],'#7a5a36',{grad:1,edge:'#2a1a0c',ew:.4,d:-.3});
  for(const q of[[-2,y+.3,sh-4.2],[1.2,y+.4,sh-4.8],[-1.6,y+.3,sh-6.8]])B.line([W3_a(q,[-.4,0,.4]),W3_a(q,[.4,0,-.4])],'#d0c0a0',.3,{d:-.33});
  B.cap([-7*bw,y-.6,sh-1],[5.6*bw,y,H+2],1.3,'#3a2414',{d:-.36});B.cap([-7*bw,1,H+1.4],[7*bw,1,H+1.4],2,'#3a2414',{d:-.2});
  B.ball([5*bw,y-.6,H-.4],1.8,'#5a3a1e',{sy:1.2,d:-.3});B.ball([-5.6*bw,y-1.2,H],1.4,'#6a4a2a',{d:-.3});
  for(const sg of[-1,1]){const el=W.el(sg),h=W.h(sg);for(let i=0;i<3;i++)B.cap(W3_m(el,h,.45+i*.16),W3_m(el,h,.52+i*.16),3.6*bw,i%2?'#c8b898':'#b0a080',{d:-.08});
    const kn=W.kn(sg),f=W.ftp(sg);for(let i=0;i<3;i++)B.cap(W3_m(kn,f,.5+i*.15),W3_m(kn,f,.57+i*.15),4.4*bw,i%2?'#a89870':'#8a7a58',{d:-.08});
    B.cap([9*sg*bw,0,sh],[9.6*sg*bw,1.6,sh-1],3.6,'#5a4026',{w1:2,d:-.3});}
  const P=W.HP,hr=W.J.hr;
  B.cap(P(0,.85,.25),P(0,1.45,-.25),hr*.3,'#7a8a2e',{w1:hr*.12,d:-.1});B.ball(P(.15,1.2,.05),hr*.08,'#6a7a28',{d:-.12});
  B.cap(P(-.62,.78,.42),P(-.12,.86,.34),hr*.16,'#5a6a22',{d:-.08});B.cap(P(.62,.78,.42),P(.12,.86,.34),hr*.16,'#5a6a22',{d:-.08});
  B.poly([P(-.45,.86,-.42),P(.45,.86,-.42),P(.3,.82,-.62),P(-.3,.82,-.62)],'#2a0a06',{d:-.1});
  for(let i=-2;i<=2;i++)B.cap(P(i*.18,.9,-.42),P(i*.18,.92,-.56),hr*.06,'#f0e8c8',{w1:hr*.01,d:-.12});
  for(const g of[-1,1])B.ball(P(2.3*g,-.25,.6),hr*.1,'#c8a048',{d:-.06});
  for(let i=0;i<5;i++)B.cap(P((i-2)*.22,-.1,.85),P((i-2)*.4,-.55,1.45+Math.sin(i*2)*.2),hr*.14,'#2a2010',{w1:hr*.03,d:.02});
  W3_sword(B,W,{len:11,blade:'#a8aeb4',guard:'#5a4a30',wrap:'#8a7a58'});
  {const h=W.p.hR,d=W.p.dS,pp=W3_perp(d);for(let i=0;i<4;i++){const q=W3_a(W3_a(h,d,4.5+i*1.7),pp,-1.25);B.cap(q,W3_a(W3_a(q,pp,-.9),d,-.4),.5,'#9aa0a6',{w1:.1,d:-.1});}}}}]);

// 15. 장로 — 금실 장식 로브·어깨망토·긴 흰 수염·발톱 받침 수정 지팡이
Q.push(['장로',{cloth:'#3e4e80',hood:'#3a4a7a',
 detail(B,K){const W=W3_J(B);W3_mage(B,W,{cloth:'#3e4e80',trim:'#d8c060',gem:'#b890ff',runeGlow:'180,140,255',mantle:'#2e3a64',sash:'#d0b868',book:'#5a2a1a',beard:'#eeeeea'});
  W3_staff(B,W,{wood:'#5a3e22',orb:'#b890ff',fx:'180,140,255',wrap:'#d8c060',claw:'#7a5a30',charm:'#d8c060'});}}]);

// 18. 카스파 — 서리 술사: 은빛 장식·푸른 수정 지팡이·별 문양 어깨망토
Q.push(['카스파',{cloth:'#1c2c50',hood:'#18284a',beard:'#c8d0d8',
 detail(B,K){const W=W3_J(B),bw=W.bw,sh=W.sh;W3_mage(B,W,{cloth:'#1c2c50',trim:'#c0c8d0',gem:'#60b8ff',runeGlow:'80,170,255',mantle:'#2a1c3c',sash:'#9aa4b0',beard:'#c8d0d8'});
  for(let i=0;i<3;i++){const a=(i-1)*.7;B.spark([Math.sin(a)*6*bw,Math.cos(a)*4.4*bw+1,sh-3.4],1.5,'80,170,255',.5);}
  const P=W.HP,hr=W.J.hr;for(let i=-2;i<=2;i++)B.cap(P(i*.28,.55,1.05),P(i*.32,.6,1.55+(i%2?0:.25)),hr*.14,'#c0c8d0',{w1:hr*.04,d:-.05});B.ball(P(0,.85,1.05),hr*.16,'#60b8ff',{glow:'80,170,255',d:-.08});
  W3_staff(B,W,{wood:'#2a2a3a',orb:'#60b8ff',fx:'80,170,255',wrap:'#c0c8d0',claw:'#9aa4b0',charm:'#80d0ff'});
  {const h=W.p.hR,d=W.p.dS,pt=k=>W3_a(h,d,k);for(let i=0;i<3;i++){const a=B.t/500+i*2.1+B.f;B.ball(W3_a(pt(16),[Math.cos(a)*4,Math.sin(a)*4,Math.sin(a*2)*1.5]),.6,'#c8ecff',{glow:'120,200,255',d:-.1});}}}}]);

// 21. 늑대인간 — 근육질 몸통·덥수룩한 털·찢어진 바지·이빨 드러낸 주둥이
Q.push(['늑대인간',{skin:'#5e4c3c',cloth:'#5e4c3c',hand:'#4e3e30',pants:'#3a3028',fur:null,boot:'#4a3e32',tail:0,
 detail(B,K){const W=W3_J(B),sk='#5e4c3c',bw=W.bw,H=W.H;
  W3_beastBody(B,W,{skin:sk,fur:'#54463a',chest:'#6e5c4c'});
  B.cap([-6.6*bw,1,H+1],[6.6*bw,1,H+1],1.6,'#5a4a2a',{d:-.2});B.cap([-6.4*bw,-1,H+1],[6.4*bw,-1,H+1],1.5,'#5a4a2a',{d:.2});B.cap([3*bw,5.4*bw,H+1],[3.8*bw,5.8*bw,H-4],.9,'#5a4a2a',{d:-.3});
  for(const sg of[-1,1]){const kn=W.kn(sg),f=W.ftp(sg),m=W3_m(kn,f,.45);const pts=[];for(let i=0;i<=6;i++){const a=i/6*6.283;pts.push(W3_a(m,[Math.cos(a)*2.9*bw,Math.sin(a)*2.9*bw+.4,(i%2?-1.6:.6)]));}
    for(let i=0;i<6;i+=2)B.poly([pts[i],pts[i+1],W3_a(pts[i+1],[0,0,1.4]),W3_a(pts[i],[0,0,2])],'#3a3028',{d:-.09});
    for(let i=-1;i<=1;i++)B.cap(W3_a(f,[i*1.1,2.6,-.4]),W3_a(f,[i*1.3,4.4,-1.4]),.7,'#e8dcc0',{w1:.1,d:-.1});W3_fur(B,W3_a(f,[0,.4,2.4]),4,2.4,sk,{sp:3,sx:1,w:1.4,d:-.1});}
  W3_wolfHead(B,W,{skin:sk,earIn:'#8a5a50'});
  {const sw=B.mode==='run'?2:B.mode==='walk'?1:.5;let a=[0,-4,H+2];for(let i=1;i<=4;i++){const b=[Math.sin(B.t/300+i+B.f)*sw,-4-i*3.4,H+2-i*1.4+i*i*.12];B.cap(a,b,(5.2-i*.6),i%2?'#5a4a3c':'#4a3c30',{w1:5-i*.8,d:.1});W3_fur(B,W3_a(b,[0,0,1]),3,2.6,i%2?'#6a5a48':'#3e3228',{dir:[0,-.6,-.3],sp:3,sx:1,w:1.5,d:.08});a=b;}B.cap(a,W3_a(a,[0,-3,-.6]),2.2,'#2a221c',{w1:.4,d:.1});}}}]);

// 24. 스파토이 — 용의 이빨 해골 전사: 청동 투구(붉은 말총 볏·볼가리개)·가죽 치마·청동 정강이·원형 방패·잎날 창
Q.push(['스파토이',{armW:3.6,legW:4,helm:'#9a7a40',crest:'#b02218',
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,bz='#a8823e';W3_skel(B,W);
  // 가죽 띠 치마(앞·옆·뒤)
  for(let i=0;i<9;i++){const a=(i/8-.5)*3.6,x=Math.sin(a)*6.4*bw,y=Math.cos(a)*4.4*bw;B.poly([[x-1.2*Math.cos(a),y+.2,H+1.6],[x+1.2*Math.cos(a),y+.2+0,H+1.6],[x*1.08+1.1*Math.cos(a),y*1.08+.4,H-6],[x*1.08-1.1*Math.cos(a),y*1.08+.4,H-6]],i%2?'#6a3a20':'#7a4628',{grad:1,edge:'#2a1408',ew:.4,d:-.1});B.ball([x*1.08,y*1.08+.5,H-5.4],.4,bz,{d:-.12});}
  B.cap([-7*bw,1.6,H+2],[7*bw,1.6,H+2],2,'#4a2a14',{d:-.22});B.cap([-6.6*bw,-1.6,H+2],[6.6*bw,-1.6,H+2],1.8,'#4a2a14',{d:.2});
  for(const sg of[-1,1]){W3_paul(B,W,sg,bz,{rim:'#d8b860',riv:'#f0d890',r:3.6});W3_greave(B,W,sg,bz,{knee:'#c09a50',riv:'#f0d890',w:4.4,cuff:'#6a4a20'});W3_bracer(B,W,sg,'#6a3a20',{w:3.4,band:bz});}
  const P=W.HP,hr=W.J.hr;for(const g of[-1,1])B.poly([P(.98*g,.15,.42),P(.92*g,.62,.36),P(.8*g,.66,-.35),P(.9*g,.25,-.45)],bz,{grad:1,edge:'#4a3010',ew:.5,d:-.06});
  B.cap(P(0,1.02,.62),P(0,1.06,.05),hr*.16,bz,{d:-.1});for(let i=0;i<12;i++){const a=i/12*6.283;B.ball(P(Math.cos(a)*1.0,Math.sin(a)*1.0,.25),hr*.09,'#e0c070',{d:-.04});}
  for(let i=0;i<9;i++){const t=i/8,y=.8-t*2.1,z=1.25-Math.pow(t-.4,2)*1.4;B.cap(P(0,y,z-.35),P(0,y-.25,z+.35-t*.5),hr*.3,i%2?'#b02218':'#8a1610',{w1:hr*.12,d:-.02});}
  for(let i=0;i<4;i++)B.cap(P(0,-1.25,.5),P(Math.sin(i)*.2,-1.55-i*.08,-.4-i*.35),hr*.16,'#8a1610',{w1:hr*.05,d:.03});
  W3_spear(B,W,{blade:'#c8a860',haft:'#5a3a20',tassel:'#b02218'});
  W3_shield(B,W,{rim:'#c09a50',face:'#a8823e',boss:'#d8b860',emblem:(P2,r)=>{for(let i=0;i<3;i++){const a=i*2.094;B.cap(P2(a,r*.1,.32),P2(a+.9,r*.6,.32),.9,'#2a1408',{w1:.4,d:-.68});}B.ball(P2(0,0,.33),r*.2,'#2a1408',{flat:1,d:-.68});}});}}]);

// 27. 해골도끼병 — 녹슨 철투구·사슬 어깨·찢어진 휘장·수염도끼
Q.push(['해골도끼병',{armW:3.6,legW:4,helm:'#6a625a',
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,ir='#6a625a';W3_skel(B,W);
  W3_tabard(B,W,'#3e4a5a',{len:8,emb:q=>{B.poly([W3_a(q,[0,.1,2.6]),W3_a(q,[1.8,.1,0]),W3_a(q,[0,.1,-2.6]),W3_a(q,[-1.8,.1,0])],'#a08a50',{d:-.26});B.ball(W3_a(q,[0,.2,0]),.7,'#3e4a5a',{flat:1,d:-.28});}});
  B.cap([-6.4*bw,1.4,H+1.4],[6.4*bw,1.4,H+1.4],1.8,'#3a2a1a',{d:-.24});B.poly([[-1.2,5,H+2.6],[1.2,5,H+2.6],[1.2,5,H+.2],[-1.2,5,H+.2]],'#8a7a50',{edge:'#3a2a10',ew:.4,d:-.28});
  for(const sg of[-1,1]){const c=[9*sg*bw,.2,sh];for(let r=0;r<3;r++)for(let i=0;i<4;i++){B.ball(W3_a(c,[sg*(r*.9),(i-1.5)*1.6,1.2-r*1.8]),.9,r%2?'#7a7470':'#5a5450',{d:-.3});}
    W3_greave(B,W,sg,'#5a524a',{knee:'#6a625a',w:4.2,riv:'#a09080',strap:'#3a2a1a'});}
  const P=W.HP,hr=W.J.hr;for(let i=0;i<12;i++){const a=i/12*6.283;B.cap(P(Math.cos(a)*1.0,Math.sin(a)*1.0,.18),P(Math.cos(a+.52)*1.0,Math.sin(a+.52)*1.0,.18),hr*.2,'#5a524a',{d:-.03});}
  B.ball(P(0,0,.95),hr*.3,'#7a726a',{d:-.04});for(let i=0;i<5;i++)B.ball(P(.4-i*.2,.55-i*.1,.75),hr*.08,'#8a5a30',{flat:1,alpha:.7,d:-.06});
  W3_axe(B,W,{blade:'#8a8680',haft:'#4a3420',size:1.2,bind:'#2a1a10',back:0});
  {const h=W.p.hR,d=W.p.dS,pt=k=>W3_a(h,d,k),pp=W3_perp(d);for(let i=0;i<3;i++)B.ball(W3_a(pt(16+i*1.4),pp,4+i*.8),.7,'#7a4a22',{flat:1,alpha:.6,d:-.13});}}}]);

// 30. 구울 — 앙상한 회색 시체: 드러난 갈비·척추 돌기·상처·찢어진 허리천·긴 손톱·찢어진 입
Q.push(['구울',{cloth:'#828c80',pants:'#2a2a30',skin:'#8a9488',hand:'#7a8478',forearm:'#828c80',sleeve:'#828c80',armW:4,legW:4.6,chestW:1.4,
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,sk='#8a9488',dk='#4a5048',y=5.4*bw;
  for(let i=0;i<4;i++){const z=sh-3-i*2.3;B.line([[-5.6*bw,y-2,z-1.2],[-2.6*bw,y-.6,z],[-.6,y-.3,z+.4]],dk,.7,{d:-.2});B.line([[5.6*bw,y-2,z-1.2],[2.6*bw,y-.6,z],[.6,y-.3,z+.4]],dk,.7,{d:-.2});}
  B.ball([0,y-1.6,H+4.5],3.2*bw,'#6e786c',{sx:1.2,sy:.6,d:-.15});
  for(let i=0;i<7;i++)B.ball([0,-5.8*bw+(i>3?.3:0),sh-1-i*2.4],1.1,i%2?'#a8b0a2':'#7a8478',{d:.25});
  for(const g of[-1,1])B.ball([g*3.4*bw,-5*bw,sh-3],2.6,'#7a8478',{sy:.6,d:.22});
  B.ball([2.4*bw,y-.8,sh-5],1.5,'#5a1010',{flat:1,sx:1.4,alpha:.85,d:-.24});B.line([[1.6*bw,y-.6,sh-4.4],[3.2*bw,y-.6,sh-5.6]],'#2a0606',.5,{d:-.26});
  B.ball([-3*bw,y-1,H+6],1.1,'#6a1a14',{flat:1,sx:1.6,alpha:.8,d:-.24});
  B.cap([-6.4*bw,1,H+1.2],[6.4*bw,1,H+1.2],1.6,'#3a3030',{d:-.2});
  const rag=(yy,col,dd)=>{const pts=[[-5*bw,yy,H+1.4],[5*bw,yy,H+1.4]];for(let i=0;i<=5;i++)pts.push([5.2*bw-i*10.4*bw/5,yy+(yy>0?.5:-.5),H-4-(i%2?2.6:0)]);B.poly(pts,col,{grad:1,edge:'#141010',ew:.4,d:dd});};rag(4.6*bw,'#3a3434',-.24);rag(-4.8*bw,'#2e2a2a',.24);
  for(const sg of[-1,1]){B.ball(W.el(sg),1.9,'#96a092',{d:-.08});B.ball(W3_a(W.kn(sg),[0,1.4,0]),2.2,'#7a8478',{d:-.12});const h=W.h(sg);
    for(let i=-1;i<=1;i++){const a=W3_a(h,W3_n(i*.45,.9,-.3),1.8);B.cap(a,W3_a(a,W3_n(i*.4,.8,-.7),4.6),.75,'#3a3028',{w1:.1,d:-.1});}
    const f=W.ft(sg);for(let i=-1;i<=1;i++)B.cap([f[0]+i*1.1,f[1]+3,f[2]+.8],[f[0]+i*1.3,f[1]+4.8,f[2]+.2],.6,'#3a3028',{w1:.1,d:-.1});}
  const P=W.HP,hr=W.J.hr;B.cap(P(-.62,.8,.4),P(.62,.8,.4),hr*.2,'#5e685c',{d:-.08});for(const g of[-1,1])B.ball(P(.36*g,.82,.12),hr*.27,'#2a1010',{flat:1,d:-.04});
  const at=(B.mode==='attack'&&B.f===1)||(B.mode==='skill'&&B.f>=1)?.25:0;
  B.poly([P(-.55,.86,-.3),P(.55,.86,-.3),P(.4,.8,-.72-at),P(-.4,.8,-.72-at)],'#200606',{d:-.08});
  for(let i=-3;i<=3;i++){B.cap(P(i*.14,.9,-.3),P(i*.14,.92,-.46),hr*.07,'#d8d0b0',{w1:hr*.01,d:-.1});B.cap(P(i*.14,.88,-.72-at),P(i*.14,.9,-.56-at),hr*.07,'#d8d0b0',{w1:hr*.01,d:-.1});}
  for(let i=0;i<7;i++){const a=(i/6-.5)*2.6;B.cap(P(Math.sin(a)*.8,Math.cos(a)*.3-.3,.75),P(Math.sin(a)*1.05,Math.cos(a)*.2-.9,-.6-Math.abs(Math.sin(i*2.3))*.7),hr*.1,i%2?'#3a3a3a':'#5a5a5a',{w1:hr*.03,d:.02});}}}]);

// 33. 버그베어 — 곰 같은 털복숭이 고블린족: 갈기·둥근 귀·가죽 멜빵·뼈 목걸이·쇠징 곤봉
Q.push(['버그베어',{fur:null,boot:'#3a2414',
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,sk='#8a6a40',fr='#6a4a28';
  W3_beastBody(B,W,{skin:sk,fur:fr,chest:'#7e6040'});
  B.cap([-7.6*bw,5.8*bw,sh-1],[6.2*bw,6.4*bw,H+2.4],1.7,'#3a2414',{d:-.38});B.cap([-7.4*bw,-5.4*bw,sh-1],[6.2*bw,-5.8*bw,H+2.4],1.7,'#3a2414',{d:.3});
  W3_riv(B,[[-4*bw,6.1*bw,sh-4.6],[0,6.3*bw,sh-9.2],[3.6*bw,6.4*bw,H+4.2]],'#c8c0a8',.5,-.42);W3_neck(B,W,'#e8dcc0',{fang:'#f0e8d0',n:7});
  W3_belt(B,W,'#3a2414',{pouch:'#5a3a1e'});
  const rag=(yy,col,dd)=>{const pts=[[-6.2*bw,yy,H+.6],[6.2*bw,yy,H+.6]];for(let i=0;i<=6;i++)pts.push([6.4*bw-i*12.8*bw/6,yy+(yy>0?.5:-.5),H-6-(i%2?1.8:0)]);B.poly(pts,col,{grad:1,edge:'#1a0e06',ew:.5,d:dd});};rag(5.4*bw,'#7a5a3a',-.24);rag(-5.4*bw,'#6a4a2e',.24);
  for(const sg of[-1,1]){const f=W.ft(sg);W3_fur(B,[f[0],f[1]+.6,f[2]+3.6],4,2.6,fr,{sp:4,sx:1,w:1.6,d:-.15});W3_bracer(B,W,sg,'#4a2a14',{stud:'#c8c0a8'});}
  const P=W.HP,hr=W.J.hr;for(let i=0;i<11;i++){const a=(i/10-.5)*3.6;W3_fur(B,P(Math.sin(a)*.95,Math.cos(a)*.35-.15,.5),2,hr*.7,i%2?fr:'#5a3a20',{dir:[Math.sin(a)*.5,-.4,-.7],sp:1,sx:1,w:1.7,d:.04});}
  for(const g of[-1,1]){B.ball(P(1.05*g,-.1,.7),hr*.36,sk,{d:.02});B.ball(P(1.1*g,.05,.7),hr*.2,'#5a3a24',{flat:1,d:-.01});}
  B.ball(P(0,1.05,-.1),hr*.26,'#2a1a10',{d:-.12});B.cap(P(-.6,.8,.38),P(.6,.8,.38),hr*.22,'#5a4026',{d:-.09});
  W3_club(B,W,{wood:'#5a3a20',spike:'#b8bcc0',band:'#4a4e54',spk:2.6});}}]);

// 36. 트롤 — 사마귀 난 녹회색 피부·긴 매부리코·긴 머리채·이끼·뼈 팔찌·뿌리 달린 통나무 곤봉
Q.push(['트롤',{hair:null,skin:'#5a7a6a',cloth:'#5a7a6a',pants:'#3a3a2c',
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,sk='#5a7a6a',dk='#3a5446',y=6*bw;
  W3_beastBody(B,W,{skin:sk,fur:'#3a4a30',chest:'#567666'});
  for(let i=0;i<14;i++){const a=i*2.39,z=H+3+((i*5)%9)*1.6;B.ball([Math.sin(a)*5.6*bw,Math.cos(a)*5.4*bw,z],.55+(i%3)*.2,i%2?'#4a6a58':'#7a9a7a',{d:Math.cos(a)>0?-.3:.3});}
  for(let i=0;i<4;i++)B.ball([(i-1.5)*3*bw,-5.6*bw,sh-1-i*1.2],1.8,'#4a6a2a',{flat:1,sx:1.4,alpha:.8,d:.3});
  const rag=(yy,col,dd)=>{const pts=[[-6*bw,yy,H+1.4],[6*bw,yy,H+1.4]];for(let i=0;i<=5;i++)pts.push([6.2*bw-i*12.4*bw/5,yy+(yy>0?.5:-.5),H-5-(i%2?2.2:0)]);B.poly(pts,col,{grad:1,edge:'#141008',ew:.5,d:dd});};rag(5.4*bw,'#4a3e2a',-.24);rag(-5.4*bw,'#3e3422',.24);
  B.cap([-6.6*bw,1,H+1.6],[6.6*bw,1,H+1.6],1.8,'#2a2214',{d:-.2});
  for(const sg of[-1,1]){const el=W.el(sg),h=W.h(sg);for(let i=0;i<5;i++){const q=W3_m(el,h,.7);const a=i/5*6.283;B.ball(W3_a(q,[Math.cos(a)*2.4,Math.sin(a)*2.4,0]),.7,'#e8dcc0',{d:-.1});}
    for(let i=-1;i<=1;i++)B.cap(h,W3_a(h,W3_n(i*.45,.85,-.5),3.6),.9,'#2a2a1a',{w1:.15,d:-.1});}
  const P=W.HP,hr=W.J.hr;B.cap(P(0,.8,.25),P(0,1.75,-.45),hr*.34,'#5a7a6a',{w1:hr*.16,d:-.1});B.ball(P(0,1.7,-.5),hr*.17,'#6a8a78',{d:-.12});
  for(const q of[P(.2,1.3,-.1),P(-.15,1.1,.1),P(.45,.85,.6),P(-.5,.6,.75)])B.ball(q,hr*.08,'#7a9a7a',{d:-.12});
  B.cap(P(-.62,.82,.42),P(.62,.82,.42),hr*.22,dk,{d:-.09});
  for(let i=0;i<9;i++){const a=(i/8-.5)*3.4;B.cap(P(Math.sin(a)*.85,-Math.cos(a)*.5-.1,.7),P(Math.sin(a)*1.2,-Math.cos(a)*.4-.7,-1.4-Math.abs(Math.sin(i*1.9))*.9),hr*.2,i%2?'#1e2a1e':'#2e3a2a',{w1:hr*.06,d:.03});}
  {const h=W.p.hR,d=W.p.dS,pt=k=>W3_a(h,d,k),pp=W3_perp(d),wc='#5a4a30';B.cap(pt(-3),pt(18),2.8,wc,{w1:5.4,d:-.04});
   for(let i=0;i<4;i++){const a=i*1.6;B.cap(pt(15+i),W3_a(W3_a(pt(19+i*.6),pp,Math.cos(a)*3),[0,0,Math.sin(a)*3]),1.2,W3_T(wc,-.1),{w1:.3,d:-.06});}
   for(const k of[4,9,13])B.ball(W3_a(pt(k),pp,1.6+k*.1),1,W3_T(wc,-.3),{d:-.07});B.ball(W3_a(pt(11),pp,-2.2),1.2,'#4a6a2a',{flat:1,d:-.08});
   B.line([pt(-1),pt(8),pt(16)],W3_T(wc,-.45),.6,{d:-.08});}}}]);

// 39. 하피 — 겹깃 날개·깃털 가슴·비늘 새다리와 갈고리 발톱·꼬리깃·금 머리띠
Q.push(['하피',{pants:'#7a5a6a',boot:'#c8a040',
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,{mode,f,t}=B,wc='#8a5a7a';
  const fl=Math.sin(f*1.6+(mode==='run'?1:0)+t/250)*4+(mode==='buff'?6:0);
  for(const sg of[-1,1]){const r0=[5*sg*bw,-3,sh-2],a1=[18*sg*bw,-8,sh+8+fl],a2=[24*sg*bw,-10,sh-2+fl],a3=[16*sg*bw,-7,H-2+fl*.5],a4=[8*sg*bw,-4,H+2];
    B.cap(r0,a1,1.6,W3_T(wc,-.2),{w1:1.1,d:.45});B.cap(a1,a2,1.1,W3_T(wc,-.2),{w1:.6,d:.45});
    for(let i=0;i<6;i++){const t0=i/5,base=W3_m(a2,a3,t0),root=W3_m(a1,W3_m(r0,a4,t0),.55),tip=W3_a(base,[sg*(2.6-i*.3),-1.2,-3.6-i*.4]);
      B.poly([root,W3_a(base,[0,0,1.2]),tip,W3_a(base,[-sg*1.4,0,-1])],i%2?'#9a6a8a':'#6a3a5a',{grad:1,edge:'#2a1020',ew:.4,d:.42});}
    for(let i=0;i<5;i++){const q=W3_m(r0,a1,.3+i*.15),q2=W3_m(a4,a2,.3+i*.15);B.poly([q,W3_m(q,q2,.55),W3_a(W3_m(q,q2,.5),[0,0,-1.2]),W3_a(q,[0,0,-1.6])],i%2?'#b07a9a':'#8a5a7a',{grad:1,d:.43,alpha:.95});}}
  // 깃털 가슴·치마깃
  for(let r=0;r<3;r++)for(let i=0;i<5;i++){const a=(i/4-.5)*2,x=Math.sin(a)*(6-r*.6)*bw,y=Math.cos(a)*5.2*bw-.6;const z=sh-3-r*3.2;B.poly([[x-1.4,y,z+1],[x+1.4,y,z+1],[x,y+.4,z-2.4]],r%2?'#c89ab8':'#a87898',{grad:1,edge:'#4a2040',ew:.3,d:-.22-r*.01});}
  for(let i=0;i<9;i++){const a=(i/8-.5)*3.4,x=Math.sin(a)*6*bw,y=Math.cos(a)*4.6*bw;B.poly([[x-1.6,y,H+2],[x+1.6,y,H+2],[x*1.1,y*1.1+.4,H-5-(i%2)*1.4]],i%2?'#6a3a5a':'#8a5a7a',{grad:1,edge:'#2a1020',ew:.35,d:-.12});}
  for(let i=0;i<5;i++){const a=(i-2)*.28;B.poly([[0,-4,H+2],[Math.sin(a)*2,-4.6,H+3],[Math.sin(a)*7,-11-Math.cos(a)*2,H-2+Math.sin(t/300+i)*.6]],i%2?'#6a3a5a':'#9a6a8a',{grad:1,edge:'#2a1020',ew:.35,d:.3});}
  for(const sg of[-1,1]){const kn=W.kn(sg),f2=W.ftp(sg);for(let i=0;i<4;i++)B.cap(W3_m(kn,f2,.3+i*.17),W3_m(kn,f2,.38+i*.17),3.1,i%2?'#c8a040':'#a88030',{d:-.08});
    W3_fur(B,W3_a(kn,[0,0,1.6]),4,3,'#8a5a7a',{sp:3.6,sx:1,w:1.6,d:-.1});
    const ft=W.ft(sg);for(let i=-1;i<=1;i++){const a=[ft[0]+i*1.2,ft[1]+2.2,ft[2]+.8];B.cap(a,W3_a(a,[i*.6,1.6,-.6]),.6,'#2a2018',{w1:.1,d:-.1});}B.cap([ft[0],ft[1]-.6,ft[2]+.8],[ft[0],ft[1]-2,ft[2]+.2],.6,'#2a2018',{w1:.1,d:-.1});}
  const P=W.HP,hr=W.J.hr;for(let i=0;i<9;i++){const a=i/9*6.283;B.ball(P(Math.cos(a)*.98,Math.sin(a)*.98,.42),hr*.09,'#e0b850',{d:-.04});}B.ball(P(0,.92,.62),hr*.1,'#d03070',{d:-.08});for(const g of[-1,1]){B.cap(P(.6*g,.8,.38),P(.15*g,.92,.3),hr*.1,'#6a3a5a',{d:-.09});B.ball(P(.36*g,.84,.12),hr*.2,'#ffe070',{flat:1,glow:'255,200,90',d:-.1});B.ball(P(.36*g,.88,.12),hr*.08,'#200808',{flat:1,d:-.12});}
  for(let i=0;i<7;i++){const a=(i/6-.5)*2.8;B.cap(P(Math.sin(a)*.8,-Math.cos(a)*.55-.2,.55),P(Math.sin(a)*1.2+Math.sin(t/400+i)*.1,-Math.cos(a)*.6-.9,-1.8-Math.abs(Math.sin(i*1.9))*.8),hr*.22,i%2?'#5a2a4a':'#7a4a6a',{w1:hr*.06,d:.04});}}}]);

// 42. 도베르만 — 검정·황갈 무늬, 선 귀, 근육 결, 가시 목걸이, 윤기
Q.push(['도베르만',{
 detail(B,K){const g=W3_Qg(B),{h,L,bw,ny,R0,hd,r,fwd,tip,jaw}=g,tan='#9a6232',bk='#2e2622';
  for(const lg of g.legs){B.cap(W3_m(lg.kn,lg.ft,.45),lg.ft,2.3*bw,tan,{w1:1.7*bw,d:-.06});for(let i=-1;i<=1;i++)B.cap(W3_a(lg.ft,[i*.6,.9,.2]),W3_a(lg.ft,[i*.7,1.8,-.2]),.45,'#141010',{w1:.1,d:-.08});}
  for(const sx of[-1,1]){B.line([[sx*R0*.85,L*.3+ny,h+R0*1.1],[sx*R0*.95,L*.15+ny,h+R0*.3]],'#4a403c',.5,{d:-.28});B.line([[sx*R0*.8,-L*.25+ny*.5,h+R0*1.1],[sx*R0*.95,-L*.4+ny*.5,h+R0*.4]],'#4a403c',.5,{d:-.28});for(let i=0;i<3;i++)B.line([[sx*R0*.98,L*(.05-i*.08)+ny*.8,h+R0*.9],[sx*R0*.98,L*(.02-i*.08)+ny*.8,h+R0*.2]],'#3e3632',.4,{d:-.27});}
  B.line([[0,-L*.5+ny*.5,h+1+R0*.98],[0,L*.1+ny*.8,h+1.3+R0*1.0],[0,L*.42+ny,h+2+R0*1.0]],'#7a6a66',.8,{d:-.3});
  B.ball([0,L*.48+ny,h+1.2],R0*.62,tan,{sy:.8,d:-.04});
  const nk=W3_m([0,L*.5+ny+2,h+3],hd,.45);for(let i=0;i<10;i++){const a=i/10*6.283;const q=W3_a(nk,[Math.cos(a)*3.4*bw,Math.sin(a)*1.6,Math.sin(a)*2.6]);B.ball(q,.75,'#5a2a1a',{d:-.05});if(i%2)B.cap(q,W3_a(q,[Math.cos(a)*1.6,Math.sin(a)*.6,Math.sin(a)*1.4]),.6,'#d0d4d8',{w1:.1,d:-.06});}
  B.cap(W3_a(hd,fwd,r*.7),W3_a(tip,[0,0,-r*.1]),r*.7,tan,{w1:r*.45,d:-.07});B.ball(tip,r*.3,'#141010',{d:-.1});
  for(const s2 of[-1,1]){B.ball(W3_a(W3_a(hd,fwd,r*.5),[s2*r*.45,0,r*.62]),r*.17,tan,{flat:1,d:-.07});
    const e0=W3_a(hd,[s2*r*.5,-r*.15,r*.65]),e1=W3_a(hd,[s2*r*.62,-r*.35,r*2.1]);B.cap(e0,e1,r*.42,bk,{w1:r*.06,d:-.02});B.cap(W3_a(e0,[0,.2,.2]),W3_a(e1,[0,.25,-.5]),r*.18,'#6a4040',{w1:r*.04,d:-.03});}
  if(jaw>.1)for(const s2 of[-1,1])B.cap(W3_a(tip,[s2*r*.3,-r*.3,-r*.35]),W3_a(tip,[s2*r*.3,-r*.25,-r*.35-r*.3*jaw]),r*.09,'#f4ecd8',{w1:.1,d:-.12});
  B.cap([0,-L*.5+ny*.5,h+2],[0,-L*.5-2.6+ny*.5,h+4.6],1.6,bk,{w1:1,d:.1});}}]);

// 45. 멧돼지 — 억센 갈기 털·굵은 휜 엄니·코판·쪼개진 발굽·흉터
Q.push(['멧돼지',{spines:null,tusks:0,
 detail(B,K){const g=W3_Qg(B),{h,L,bw,ny,R0,hd,r,fwd,tip,jaw,t}=g,sk='#5a4030',dk='#3a2a1a';
  for(let i=0;i<16;i++){const y=-L*.48+i*L*.075+ny*(.5+i/30),z=h+1+R0*(1.05-Math.abs(i-9)*.012);const lift=1.6+Math.sin(i*1.3)*.6+(i>7?1.2:0);B.cap([0,y,z-.6],[Math.sin(i*2.1)*.6,y-1.4,z+lift+1.2],1.3,i%2?dk:'#2a1a10',{w1:.15,d:-.3});}
  for(let i=0;i<22;i++){const a=i*2.4,y=-L*.45+(i*.37%1)*L*.9+ny*.7,ang=-1.1+((i*.61)%1)*2.2;const c=[Math.sin(ang)*R0*1.02,y,h+1+Math.cos(ang)*R0*.98];B.cap(c,W3_a(c,[Math.sin(ang)*.8,-1.6,-.9]),.9,i%3?'#4a3424':'#6a5038',{w1:.12,d:-.25});}
  B.line([[R0*.7,L*.1+ny,h+R0*.9],[R0*.85,-L*.05+ny,h+R0*.6]],'#8a6a50',.5,{d:-.32});B.line([[-R0*.75,L*.2+ny,h+R0*.8],[-R0*.9,L*.05+ny,h+R0*.5]],'#8a6a50',.5,{d:-.32});
  for(const lg of g.legs){const f=lg.ft;B.cap(W3_a(f,[-.5,.4,.6]),W3_a(f,[-.5,1.3,-.1]),.9,'#1a1410',{w1:.5,d:-.08});B.cap(W3_a(f,[.5,.4,.6]),W3_a(f,[.5,1.3,-.1]),.9,'#1a1410',{w1:.5,d:-.08});W3_fur(B,W3_a(lg.kn,[0,0,2]),3,2.4,dk,{sp:2,sx:1,w:1.2,d:-.05});}
  B.ball(W3_a(tip,[0,.3,0]),r*.46,'#a07060',{sx:1,sy:.8,d:-.12});for(const s2 of[-1,1])B.ball(W3_a(tip,[s2*r*.16,r*.62,0]),r*.1,'#2a1410',{flat:1,d:-.15});
  for(const s2 of[-1,1]){const a=W3_a(W3_a(tip,fwd,-r*.6),[s2*r*.42,0,-r*.3]),b=W3_a(W3_a(tip,fwd,-r*.25),[s2*r*.8,0,r*.35]),c=W3_a(W3_a(tip,fwd,-r*.6),[s2*r*.7,0,r*.85]);B.cap(a,b,r*.24,'#f0e6cc',{w1:r*.15,d:-.1});B.cap(b,c,r*.15,'#f6eed8',{w1:r*.03,d:-.1});
    B.cap(W3_a(hd,[s2*r*.7,r*.3,r*.55]),W3_a(hd,[s2*r*.15,r*.6,r*.6]),r*.2,dk,{d:-.07});}
  for(let i=0;i<5;i++)W3_fur(B,W3_a(hd,[(i-2)*r*.3,-r*.3,r*.7]),2,r*.7,dk,{dir:[0,-.5,.4],sp:1,w:1.2,d:-.05});
  {let a=[0,-L*.6+ny*.5,h+2];const b=[Math.sin(t/200)*1,-L*.6-3,h+1];B.cap(a,b,1,sk,{w1:.6,d:.1});W3_fur(B,b,3,2,'#1a1008',{dir:[0,-.4,-.8],sp:1,w:1,d:.1});}}}]);

// 48. 거대 개미 — 광택 키틴 마디·배 줄무늬·잘록 허리 마디·꺾인 더듬이·톱니 큰턱·가시 다리
Q.push(['거대 개미',{
 detail(B,K){const g=W3_Bg(B),{S,L,hp,hr,bw,t,snap}=g,sk='#3a2418',hi='#8a6a50';
  const ab=S[0],th=S[1];for(let i=0;i<4;i++){const yy=.55-i*.36,y=ab.p[1]+ab.r*yy,rr=ab.r*Math.sqrt(Math.max(.05,1-yy*yy))*1.02,pts=[];for(let j=0;j<=8;j++){const a=Math.PI*j/8;pts.push([Math.cos(a)*rr,y,ab.p[2]+Math.sin(a)*rr*.8]);}B.line(pts,i%2?'#1e1008':'#5a3a26',.7,{d:-.12});}
  B.ball(W3_a(ab.p,[-ab.r*.3,ab.r*.2,ab.r*.55]),ab.r*.28,'#c8a888',{flat:1,alpha:.35,d:-.2});B.ball(W3_a(th.p,[-th.r*.3,0,th.r*.6]),th.r*.3,'#c8a888',{flat:1,alpha:.35,d:-.2});B.ball(W3_a(hp,[-hr*.3,0,hr*.6]),hr*.25,'#c8a888',{flat:1,alpha:.35,d:-.2});
  B.ball(W3_m(ab.p,th.p,.5),1.5*bw,'#4a2c1a',{d:.05});B.ball(W3_m(ab.p,th.p,.3),1.3*bw,'#3a2214',{d:.06});
  for(const s2 of[-1,1])B.cap(W3_a(th.p,[s2*.8,-1,th.r*.7]),W3_a(th.p,[s2*1.2,-2.2,th.r*1.4]),.7,'#2a180c',{w1:.1,d:-.1});
  for(const lg of L){const m1=W3_m(lg.root,lg.knee,.5),m2=W3_m(lg.knee,lg.ft,.55);B.ball(lg.knee,1.05*bw,'#4a3020',{d:-.06});B.ball(m2,.75*bw,'#4a3020',{d:-.06});B.cap(m2,W3_a(m2,[lg.sg*.6,0,1.2]),.4,'#2a1a10',{w1:.05,d:-.07});B.cap(lg.ft,W3_a(lg.ft,[lg.sg*.8,.8,0]),.4,'#2a1a10',{w1:.05,d:-.07});}
  for(const s2 of[-1,1]){const a=W3_a(hp,[s2*hr*.35,hr*.55,hr*.55]),sw=Math.sin(t/250+s2)*.6,b=W3_a(a,[s2*1.4,.6,4.2+sw]),c=W3_a(b,[s2*1.2,3.4,-1.2+sw]);B.cap(a,b,.65,'#2a180c',{w1:.45,d:-.1});B.cap(b,c,.45,'#2a180c',{w1:.25,d:-.1});B.ball(c,.45,'#4a3020',{d:-.1});
    B.ball(W3_a(hp,[s2*hr*.72,hr*.45,hr*.3]),hr*.3,'#1a1010',{d:-.08});B.ball(W3_a(hp,[s2*hr*.78,hr*.55,hr*.42]),hr*.1,'#8a8a90',{flat:1,d:-.1});
    const m0=W3_a(hp,[s2*hr*.5,hr*.7,-hr*.3]),m1=W3_a(hp,[s2*hr*(.95-snap*.55),hr*1.75,-hr*.4]),m2=W3_a(hp,[s2*hr*(.2-snap*.3),hr*2.1,-hr*.4]);B.cap(m0,m1,1.4*bw,'#5a3a24',{w1:.9,d:-.09});B.cap(m1,m2,.9,'#5a3a24',{w1:.2,d:-.09});
    for(let i=0;i<3;i++){const q=W3_m(m0,m1,.4+i*.25);B.cap(q,W3_a(q,[-s2*.7,.3,0]),.35,'#d8c8a8',{w1:.05,d:-.1});}}}}]);

// 51. 웅골리언트 — 거대 거미: 털 난 마디 다리와 줄무늬·배의 해골 문양·독니·8눈 광택·실젖
Q.push(['웅골리언트',{
 detail(B,K){const g=W3_Bg(B),{S,L,hp,hr,bw,t,mode,f,snap,h}=g,fur='#2a2028',mk='#7a3aa0';
  const ab=S[0],ce=S[1];
  for(let i=0;i<26;i++){const a=i*2.39,el=((i*.37)%1)*1.2+.2;const c=W3_a(ab.p,[Math.cos(a)*Math.cos(el)*ab.r*.98,Math.sin(a)*Math.cos(el)*ab.r*.98,Math.sin(el)*ab.r*.82]);B.cap(c,W3_a(c,[Math.cos(a)*.8,Math.sin(a)*.8-.4,.6]),.7,i%2?fur:'#3a2e38',{w1:.1,d:-.05});}
  const top=W3_a(ab.p,[0,0,ab.r*.8]);B.ball(W3_a(top,[0,ab.r*.25,0]),ab.r*.36,mk,{flat:1,sy:.6,d:-.25,alpha:.9});for(const s2 of[-1,1])B.ball(W3_a(top,[s2*ab.r*.14,ab.r*.3,.1]),ab.r*.1,'#120a14',{flat:1,d:-.27});
  B.poly([W3_a(top,[0,-ab.r*.05,.1]),W3_a(top,[ab.r*.12,-ab.r*.25,.1]),W3_a(top,[0,-ab.r*.5,.1]),W3_a(top,[-ab.r*.12,-ab.r*.25,.1])],mk,{d:-.26,alpha:.9});
  for(let i=0;i<3;i++)for(const s2 of[-1,1])B.ball(W3_a(top,[s2*ab.r*(.42+i*.06),-ab.r*(.1+i*.22),-.4-i*.5]),ab.r*.09,'#a050d0',{flat:1,glow:i===0?'200,80,255':null,d:-.25});
  for(let i=-1;i<=1;i++)B.cap(W3_a(ab.p,[i*.8,-ab.r*.9,0]),W3_a(ab.p,[i*1,-ab.r*1.15,-.6]),.7,'#3a2a34',{w1:.3,d:.1});
  for(const lg of L){const segs=[[lg.root,lg.knee],[lg.knee,lg.ft]];B.ball(lg.knee,1.5*bw,'#2a1e28',{d:-.06});
    for(const[a,b]of segs){for(const tt of[.3,.62]){const lw=(a===lg.root?1.6-tt*.3:1.3-tt*.8)*bw*1.12;B.cap(W3_m(a,b,tt-.04),W3_m(a,b,tt+.04),lw,'#4a2a5a',{d:-.07});}for(let i=0;i<4;i++){const q=W3_m(a,b,.15+i*.22);B.cap(q,W3_a(q,[lg.sg*.5,(i%2?.5:-.5),1.2]),.35,'#3a2e38',{w1:.05,d:-.08});}}
    B.cap(lg.ft,W3_a(lg.ft,[lg.sg*.4,.4,-.2]),.5,'#0a0608',{w1:.05,d:-.08});}
  for(const s2 of[-1,1]){const a=W3_a(hp,[s2*hr*.35,hr*.75,-hr*.25]),b=W3_a(a,[s2*-.3*snap,1.2+snap*1.2,-2.2]);B.cap(a,W3_a(a,[0,.5,-.8]),1.6*bw,'#2a1e28',{w1:1.2,d:-.1});B.cap(W3_a(a,[0,.5,-.8]),b,.8,'#c8c0b0',{w1:.1,d:-.12});
    if(mode==='attack'||mode==='skill')B.glow(b,1.2,'160,255,90',.6);
    B.cap(W3_a(hp,[s2*hr*.55,hr*.7,-hr*.1]),W3_a(hp,[s2*hr*.9,hr*1.4,-hr*.2]),.8,'#2a1e28',{w1:.4,d:-.09});}
  for(const[x,z,r]of[[-.22,.4,.17],[.22,.4,.17],[-.5,.5,.11],[.5,.5,.11],[-.12,.72,.09],[.12,.72,.09],[-.6,.25,.08],[.6,.25,.08]]){B.ball(W3_a(hp,[x*hr,hr*.86,z*hr]),hr*r,'#a030e0',{d:-.11});B.ball(W3_a(hp,[x*hr-.15,hr*.92,z*hr+.15]),hr*r*.35,'#ffffff',{flat:1,alpha:.8,d:-.13});}
  for(let i=0;i<10;i++){const a=i/10*6.283;B.cap(W3_a(ce.p,[Math.cos(a)*ce.r*.9,Math.sin(a)*ce.r*.9,ce.r*.3]),W3_a(ce.p,[Math.cos(a)*ce.r*1.2,Math.sin(a)*ce.r*1.2,ce.r*.75]),.6,fur,{w1:.1,d:-.05});}}}]);

// 54. 펑거스 — 걷는 독버섯: 갓 밑 주름·솟은 사마귀 반점·턱받이 고리·섬유 자루·뿌리발·성난 얼굴·포자
Q.push(['펑거스',{
 detail(B,K){const g=W3_Og(B),{r,z0,lunge,sq,pulse,t,mode,f}=g,sk='#a03a2a',st='#e8dcc0';const cz=z0+r*1.35,R=r*(1.25+pulse);
  B.ball([0,lunge,cz-R*.12],R*.9,'#7a2418',{flat:1,sy:.3,alpha:.5,d:.15});
  for(let i=0;i<9;i++){const a=i*2.4,rr=R*(.25+((i*.37)%1)*.55);const q=[Math.cos(a)*rr,lunge+Math.sin(a)*rr,cz+R*.62*.62*Math.sqrt(Math.max(0,1-(rr/R)**2))*1.4];B.ball(q,r*(.1+(i%3)*.05),'#f4ead8',{sy:.6,d:-.14});}
  B.ball([-R*.3,lunge+R*.2,cz+R*.42],R*.25,'#ffffff',{flat:1,alpha:.18,d:-.15});
  for(let i=0;i<5;i++){const a=(i/4-.5)*2.4;B.line([[Math.sin(a)*r*.62,lunge+Math.cos(a)*r*.62,z0+r*.1],[Math.sin(a)*r*.52,lunge+Math.cos(a)*r*.55,z0+r*1]],'#b8a888',.4,{d:-.08});}
  const ring=[];for(let i=0;i<=12;i++){const a=i/12*6.283;ring.push([Math.cos(a)*r*.62,lunge+Math.sin(a)*r*.62,z0+r*.95+((i%2)?-.6:0)]);}B.poly(ring.slice(0,12),'#f0e6d0',{grad:1,edge:'#a89878',ew:.4,d:.02});
  for(const s2 of[-1,1]){for(let i=0;i<3;i++){const b=[s2*2.5,lunge+(g.walk?Math.sin(g.ph+(s2>0?0:Math.PI))*2:0),z0*.3+.6];B.cap(b,W3_a(b,[s2*(1+i*.6),(i-1)*1.4,-.6]),.7,'#c8b898',{w1:.15,d:-.05});}}
  const ang=mode==='attack'||mode==='skill';for(const s2 of[-1,1]){B.cap([s2*r*.42,lunge+r*.5,z0+r*.95],[s2*r*.1,lunge+r*.55,z0+r*.82],r*.1,'#6a4a30',{d:-.1});B.ball([s2*r*.25,lunge+r*.5,z0+r*.72],r*.11,'#ffe060',{flat:1,glow:ang?'255,220,80':null,d:-.12});}
  B.poly([[-r*.25,lunge+r*.52,z0+r*.5],[r*.25,lunge+r*.52,z0+r*.5],[r*.15,lunge+r*.5,z0+r*.3-(ang?r*.12:0)],[-r*.15,lunge+r*.5,z0+r*.3-(ang?r*.12:0)]],'#2a1008',{d:-.12});
  for(let i=0;i<6;i++){const ph2=((t/1600)+i/6+f*.1)%1,a=i*1.9;B.glow([Math.cos(a)*R*(.5+ph2*.6),lunge+Math.sin(a)*R*(.5+ph2*.6),cz+R*.4+ph2*10],.9,'200,255,150',(1-ph2)*.6);}}}]);

// 60. 비홀더 — 비늘 박힌 가죽·핏줄·무거운 눈꺼풀·이빨 두 줄·마디진 눈자루(색이 다른 눈)·아랫배 주름
Q.push(['비홀더',{
 detail(B,K){const g=W3_Og(B),{r,z0,lunge,sq,pulse,t,mode,f}=g,sk='#7a5a8a';const c=[0,lunge,z0+r],R0=r*(1+pulse)*sq,act=mode==='skill'||mode==='attack';
  for(let i=0;i<34;i++){const a=i*2.39996,el=Math.asin(((i*.618)%1)*1.8-.9);const n=[Math.cos(a)*Math.cos(el),Math.sin(a)*Math.cos(el),Math.sin(el)];if(n[1]>.55&&Math.abs(n[2]-.1)<.5&&Math.abs(n[0])<.6)continue;B.ball(W3_a(c,n,R0*.9),r*(.06+(i%3)*.025),i%2?'#9a7aaa':'#5a3a6a',{flat:1,alpha:.75,d:-.02});}
  for(let i=0;i<4;i++){const a=i*1.57+.6;const pts=[];for(let j=0;j<5;j++){const b=a+j*.18+Math.sin(j*2+i)*.1,el=-.3+j*.25;pts.push(W3_a(c,[Math.cos(b)*Math.cos(el),Math.sin(b)*Math.cos(el),Math.sin(el)],R0*1.0));}B.line(pts,'#4a1a3a',.5,{d:-.03});}
  const ey=[0,lunge+r*.72,z0+r*1.15];const lid=act?.0:.12;B.cap(W3_a(ey,[-r*.55,r*.02,r*.42-lid*r]),W3_a(ey,[r*.55,r*.02,r*.42-lid*r]),r*.3,'#6a4a7a',{d:-.05});B.cap(W3_a(ey,[-r*.5,0,-r*.46]),W3_a(ey,[r*.5,0,-r*.46]),r*.2,'#6a4a7a',{d:-.05});
  for(let i=-1;i<=1;i++)B.line([W3_a(ey,[i*r*.18,r*.1,r*.62]),W3_a(ey,[i*r*.26,r*.05,r*.85])],'#3a1a3a',.5,{d:-.07});
  B.ball(W3_a(ey,[-r*.12,r*.45,r*.12]),r*.07,'#ffffff',{flat:1,alpha:.85,d:-.12});
  const m=[0,lunge+r*.86,z0+r*.55];for(let i=0;i<7;i++){const x=-r*.48+i*r*.16;B.cap([x,m[1]+.4,m[2]+r*.15],[x,m[1]+.5,m[2]-r*.02],r*.08,'#f0e8d0',{w1:r*.02,d:-.07});B.cap([x+r*.08,m[1]+.3,m[2]-r*.18],[x+r*.08,m[1]+.4,m[2]-r*.02],r*.07,'#e0d8c0',{w1:r*.02,d:-.07});}
  if(act)B.ball([0,m[1]+.6,m[2]-r*.08],r*.14,'#c04060',{sx:1.6,d:-.08});
  B.ball([0,lunge,z0+r*.25],R0*.7,'#9a7aa0',{flat:1,sy:.4,alpha:.5,d:.02});for(let i=0;i<3;i++)B.line([[-r*.5,lunge+r*.5,z0+r*(.18+i*.12)],[0,lunge+r*.7,z0+r*(.12+i*.12)],[r*.5,lunge+r*.5,z0+r*(.18+i*.12)]],'#4a2a4a',.45,{d:-.04});
  const irs=['#e04040','#40a0e0','#e0c040','#40e080','#c060e0','#e08040','#60e0e0'];
  for(let i=0;i<7;i++){const a=i/7*Math.PI*2,sw=Math.sin(t/400+i)*1.2;const b=[Math.cos(a)*r*.55,lunge+Math.sin(a)*r*.55-r*.1,z0+r*1.75],tip=[Math.cos(a)*r*(1.1+sw*.05),lunge+Math.sin(a)*r*1.05-r*.2,z0+r*2.5+sw];
    for(let j=1;j<4;j++)B.ball(W3_m(b,tip,j/4),.95-j*.08,'#6a4a7a',{d:-.01});B.ball(tip,1.6,'#f4efe6',{d:-.02});B.ball(W3_a(tip,[0,1,0]),.85,irs[i],{flat:1,glow:act?'255,200,255':null,d:-.04});B.ball(W3_a(tip,[0,1.2,0]),.35,'#100',{flat:1,d:-.06});B.cap(W3_a(tip,[-1.3,.2,.7]),W3_a(tip,[1.3,.2,.7]),.7,'#6a4a7a',{d:-.05});}}}]);

// 57. 코카트리스 — 비늘 꼬리·겹깃 날개·늘어진 볏과 육수·갈퀴 발톱·석화 시선
Q.push(['코카트리스',{
 detail(B,K){const s=B.s,{mode,f,t}=B,run=mode==='run',walk=mode==='walk'||run,sk='#c8a050';const ph=f*Math.PI/2+(run?Math.PI/4:0),sw=walk?Math.cos(ph):0,cw=walk?Math.sin(ph):0;
  let peck=0,wing=Math.sin(t/300+f)*2,up=0;if(mode==='attack'){peck=[-.3,1,.4][f];}if(mode==='buff'){wing=8+f*2;up=1;}if(mode==='skill'){peck=[0,.5,1,.3][f];wing=[2,8,4,2][f];}if(run)wing+=5;const h=s.h||12;
  for(const g of[-1,1]){const w0=[g*5,2,h+8],w1=[g*(12+wing*.4),-2,h+12+wing],w2=[g*(14+wing*.4),-8,h+6+wing*.6],w3=[g*6,-6,h+4];
    for(let i=0;i<5;i++){const tt=i/4,base=W3_m(w1,w2,tt),root=W3_m(w0,w3,tt);B.poly([W3_m(root,base,.3),base,W3_a(base,[g*1.6,-2.2,-2.6]),W3_a(W3_m(root,base,.6),[0,-.5,-1.6])],i%2?'#7a5a28':'#a08040',{grad:1,edge:'#3a2410',ew:.35,d:.28});}
    B.cap(w0,w1,1.1,'#6a4a20',{w1:.6,d:.25});for(let i=0;i<4;i++){const q=W3_m(w0,W3_m(w1,w2,.5),.25+i*.18);B.poly([q,W3_a(q,[g*2.6,-.6,.4]),W3_a(q,[g*2,-1.6,-1.4]),W3_a(q,[0,-1,-1.2])],i%2?'#b09050':'#d0b068',{grad:1,d:.24,alpha:.95});}}
  for(let i=0;i<6;i++){const a=(i/5-.5)*2.2;B.poly([[Math.sin(a)*4,Math.cos(a)*2+2.4,h+8],[Math.sin(a)*4+1.3,Math.cos(a)*2+2.6,h+7.6],[Math.sin(a)*4.2,Math.cos(a)*2.4+2.8,h+3.8]],i%2?'#d8b870':'#b89048',{grad:1,edge:'#5a3a18',ew:.3,d:-.12});}
  let a=[0,-5,h+4];for(let i=1;i<=4;i++){const b=[Math.sin(t/300+i)*1.2,-5-i*3.5,h+4-i*1.5+i*i*.25];for(let j=0;j<3;j++){const q=W3_m(a,b,j/3);B.ball(W3_a(q,[0,0,(2.6-i*.4)*.4]),(2.6-i*.4)*.42,j%2?'#3a6a2a':'#5a8a3a',{sy:.7,d:-.03});}a=b;}
  B.poly([a,W3_a(a,[-1.6,-2.6,1.6]),W3_a(a,[0,-4,0]),W3_a(a,[1.6,-2.6,1.6])],'#2a4a1a',{grad:1,edge:'#102008',ew:.4,d:.02});
  for(const[g,ph2]of[[-1,1],[1,-1]]){const sw2=sw*ph2,ft=[g*3,sw2*5,Math.max(0,cw*ph2)*3];for(let i=0;i<3;i++){const q=W3_m([g*3,sw2*2.5+1.5,h*.5],ft,.2+i*.25);B.cap(W3_a(q,[-.9,.3,0]),W3_a(q,[.9,.3,0]),.6,'#a07a28',{d:-.06});}
    for(let i=-1;i<=1;i++)B.cap(W3_a(ft,[i*1.4,2.2,0]),W3_a(ft,[i*1.6,3.3,-.4]),.45,'#2a2018',{w1:.08,d:-.07});B.cap(W3_a(ft,[0,-.2,.2]),W3_a(ft,[0,-1.8,-.2]),.5,'#2a2018',{w1:.08,d:-.07});}
  const hd=[0,7+peck*5,h+14-peck*5+up*3];B.ball(W3_a(hd,[0,(s.beakL||5.4)*.5,-3.6-peck]),1.4,'#c02020',{sy:1.3,d:-.08});B.ball(W3_a(hd,[.8,(s.beakL||5.4)*.4,-3-peck]),1.1,'#a01818',{sy:1.2,d:-.07});
  for(let i=0;i<4;i++)B.cap(W3_a(hd,[0,1.2-i*1.4,2.6+Math.sin(i*1.3)*.6]),W3_a(hd,[0,1.4-i*1.6,4.8-i*.3]),1,'#e02828',{w1:.5,d:-.05});
  for(const g of[-1,1]){B.cap(W3_a(hd,[g*1.5,1.8,1.6]),W3_a(hd,[g*1.9,.6,1.4]),.5,'#5a3a10',{d:-.08});if(mode==='skill'&&f>=1)B.glow(W3_a(hd,[g*1.9,1.4,.8]),1.6,'200,255,100',.9);}
  B.line([W3_a(hd,[-.3,2.6,-.5]),W3_a(hd,[0,(s.beakL||5.4)-.4,-1-peck])],'#fff0b0',.35,{d:-.09});}}]);

// 63. 해골돌격병 — 녹슨 반쪽 흉갑·가시 견갑·뿔 투구·사슬·양날 전투도끼·붉은 눈빛
Q.push(['해골돌격병',{armW:3.8,legW:4.2,pads:null,helm:'#4e4e56',
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,ir='#5a5a62';W3_skel(B,W);
  B.poly([[-7*bw,4.4*bw,sh-.6],[1.6,5.6*bw,sh],[2.2,5.6*bw,sh-7],[.4,5.2*bw,sh-9.6],[-5.4*bw,4.4*bw,sh-8]],ir,{grad:1,edge:'#1e1e22',ew:.6,d:-.3});
  W3_riv(B,[[-5.6*bw,4.8*bw,sh-1.6],[0,5.6*bw,sh-1],[-4.6*bw,4.6*bw,sh-6.8],[1,5.4*bw,sh-7.6]],'#b8b0a0',.45,-.36);B.ball([-2.6*bw,5.2*bw,sh-4],1,'#7a3a18',{flat:1,alpha:.7,d:-.34});
  for(let i=0;i<9;i++){const q=W3_m([7.4*bw,4*bw,sh-.6],[-5*bw,4.6*bw,H+2],i/8);B.ball(q,.8,i%2?'#6a6a72':'#8a8a92',{sx:1.3,d:-.38});}
  W3_belt(B,W,'#2a1a10',{tasset:'#4e4e56',riv:'#b8b0a0'});
  for(const sg of[-1,1]){W3_paul(B,W,sg,'#5a5a62',{rim:'#7a7a82',riv:'#c0b8a8',spikes:3,spikeC:'#c8c0b0',r:4.6});W3_greave(B,W,sg,'#4e4e56',{knee:'#6a6a72',w:4.6,riv:'#b8b0a0',strap:'#2a1a10'});W3_bracer(B,W,sg,'#4e4e56',{w:3.6,band:'#2a2a2e',stud:'#b8b0a0'});}
  const P=W.HP,hr=W.J.hr;W3_orcHelm(B,W,'#4e4e56',{horn:'#d8d0c0'});
  {const h=W.p.hR,d=W.p.dS,pt=k=>W3_a(h,d,k),pp=W3_perp(d),hc='#8a8a90';B.cap(pt(-6.5),pt(22),1.9,'#3a2a1a',{d:-.04});for(let i=0;i<4;i++)B.cap(pt(-1.6+i*1.3),pt(-1.1+i*1.3),2.4,'#1a1410',{d:-.06});B.cap(pt(22),pt(25),1.2,'#a0a0a8',{w1:.1,d:-.06});
   const a=pt(13),b=pt(21);for(const g of[-1,1]){const e1=W3_a(W3_a(b,d,2.4),pp,7.6*g),e2=W3_a(W3_a(a,d,-2.4),pp,7.6*g);B.poly([W3_a(a,pp,.6*g),W3_a(b,pp,.6*g),e1,W3_a(W3_m(e1,e2),pp,-1.2*g),e2],hc,{grad:1,edge:'#2a2a2e',ew:.55,d:-.1});B.line([e1,W3_a(W3_m(e1,e2),pp,-.8*g),e2],'#f0f0f4',.45,{d:-.12});}
   B.cap(W3_m(a,b,.1),W3_m(a,b,.9),2.8,'#3a3a40',{d:-.12});B.ball(W3_m(a,b),1.3,'#8a2a18',{d:-.14});}}}]);

// 66. 그렘린 — 박쥐 귀·비늘 등가시·가죽 날개막·큰 눈·톱니 이빨·조끼와 장신구
Q.push(['그렘린',{cloth:'#3e2e4e',
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,sk='#6a8a6a',{t,f,mode}=B;
  B.poly([[-7*bw,5.4*bw,sh-1],[-1.2,6.4*bw,sh-2],[-1,6.4*bw,H+2.4],[-6*bw,5.6*bw,H+2]],'#4a3a5a',{grad:1,edge:'#1a1020',ew:.5,d:-.25});B.poly([[7*bw,5.4*bw,sh-1],[1.2,6.4*bw,sh-2],[1,6.4*bw,H+2.4],[6*bw,5.6*bw,H+2]],'#4a3a5a',{grad:1,edge:'#1a1020',ew:.5,d:-.25});
  for(let i=0;i<3;i++)B.ball([1.6,6.6*bw,sh-3-i*3],.5,'#d0b050',{d:-.3});B.ball([0,6.2*bw,(sh+H)/2],2,'#7a9a7a',{sy:.7,d:-.22});
  for(let i=0;i<6;i++){const z=sh+1-i*3;B.cap([0,-4.8*bw,z],[0,-6.6*bw,z+1.6],1.2,'#3a5a3a',{w1:.15,d:.3});}
  const fl=Math.sin(t/120+f*1.7)*3+(mode==='buff'?4:0)+(mode==='run'?3:0);for(const sg of[-1,1]){const r0=[3*sg*bw,-4,sh-1],a1=[11*sg,-7,sh+7+fl],a2=[15*sg,-8,sh+1+fl*.6],a3=[11*sg,-7,H+1+fl*.3],a4=[5*sg,-5,H+3];
    B.poly([r0,a1,W3_m(a1,a2,.5),a2,W3_a(W3_m(a2,a3),[-sg,0,1]),a3,a4],'#4a3048',{grad:1,edge:'#1a0e1a',ew:.5,d:.45,alpha:.95});for(const q of[a2,a3,W3_m(a1,a2,.5)])B.line([r0,q],'#2a1a2a',.55,{d:.44});B.cap(r0,a1,.9,'#3a2a3a',{w1:.4,d:.43});B.cap(a1,W3_a(a1,[sg*.6,.4,1.4]),.6,'#d8d0c0',{w1:.1,d:.42});}
  for(const sg of[-1,1]){const f2=W.ft(sg);for(let i=-1;i<=1;i++)B.cap([f2[0]+i,f2[1]+2.6,f2[2]+.8],[f2[0]+i*1.2,f2[1]+4,f2[2]+.2],.5,'#2a2018',{w1:.1,d:-.1});B.ball(W3_m(W.el(sg),W.h(sg),.7),1.6,'#d0b050',{sy:.6,d:-.1});}
  const P=W.HP,hr=W.J.hr;for(const g of[-1,1]){const a=P(.7*g,-.1,.4),b=P(2.2*g,-.3,1.4),c=P(1.6*g,-.2,.2);B.poly([a,b,P(1.9*g,-.25,.6),c],sk,{grad:1,edge:'#2a3a2a',ew:.4,d:.02});B.poly([P(.85*g,0,.42),P(1.95*g,-.2,1.25),P(1.5*g,-.1,.32)],'#a07080',{d:.0});}
  for(const g of[-1,1]){B.ball(P(.36*g,.8,.16),hr*.3,'#f8f0c0',{d:-.06});B.ball(P(.36*g,.92,.16),hr*.17,'#ffd040',{flat:1,glow:'255,220,80',d:-.09});B.ball(P(.36*g,.97,.16),hr*.08,'#100',{flat:1,d:-.11});B.cap(P(.62*g,.78,.5),P(.12*g,.9,.38),hr*.12,'#3a5a3a',{d:-.1});}
  B.poly([P(-.5,.88,-.32),P(.5,.88,-.32),P(0,.9,-.62)],'#2a0808',{d:-.08});for(let i=-2;i<=2;i++)B.cap(P(i*.18,.92,-.32),P(i*.15,.93,-.46),hr*.06,'#f4ecd8',{w1:hr*.01,d:-.1});}}]);

// ===================== 2차(67~132) =====================
// 단검(덮어 그리기): 휜 날·날빛·감은 손잡이·휜 코등이
function W3_dagger(B,h,d,o={}){const pt=k=>W3_a(h,d,k),pp=W3_perp(d),bc=o.blade||'#b8c0d8',n=o.len||12,g=o.guard||'#9a9ab0';
  B.cap(pt(-3),pt(1.6),1.8,o.grip||'#2a2028',{d:-.05});for(let i=0;i<3;i++)B.cap(pt(-2.6+i*1.4),pt(-2.1+i*1.4),2.1,o.wrap||'#5a4a6a',{d:-.06});
  B.ball(pt(-3.7),1.1,g,{d:-.06});B.cap(W3_a(pt(1.8),pp,-2.6),W3_a(pt(1.8),pp,2.6),1,g,{d:-.07});for(const s of[-1,1])B.cap(W3_a(pt(1.8),pp,2.6*s),W3_a(pt(3.2),pp,3.4*s),.7,g,{w1:.2,d:-.07});
  B.poly([W3_a(pt(2.2),pp,-1.1),W3_a(pt(2.2),pp,1.1),W3_a(pt(n*.62),pp,1.3),W3_a(pt(n+.6),pp,.9),W3_a(pt(n*.72),pp,-.5)],bc,{grad:1,edge:W3_T(bc,-.55),ew:.4,d:-.08});
  B.line([W3_a(pt(2.6),pp,.7),W3_a(pt(n*.62),pp,.95),W3_a(pt(n),pp,.85)],'#ffffff',.35,{d:-.1});
  if(o.fx)B.glow(pt(n*.6),2.2,o.fx,.35);}
// 긴 머리카락(뒤로 흘러내림)
function W3_hairLong(B,W,col,o={}){const P=W.HP,hr=W.J.hr,n=o.n||7,L=o.len||1,sw=Math.sin(B.t/400)*.12+(B.mode==='run'?-.25:B.mode==='walk'?-.12:0);
  for(let i=0;i<n;i++){const x=(i/(n-1)-.5)*1.5,a=P(x*.8,-.55,.55),b=P(x*1.05,-1.1+sw,-.6*L),c=P(x*1.15,-1.35+sw*1.6,-1.9*L-Math.abs(Math.sin(i*1.7))*.4);
    const cc=i%2?col:W3_T(col,i%3?-.18:.12);B.cap(a,b,hr*.42,cc,{w1:hr*.34,d:.12});B.cap(b,c,hr*.34,cc,{w1:hr*.08,d:.14});}
  for(let i=0;i<5;i++)B.cap(P((i-2)*.32,.55,.9),P((i-2)*.45,.25,.2),hr*.28,i%2?col:W3_T(col,.15),{w1:hr*.08,d:-.02});}

// 69. 다크 엘프 — 흑요 가죽 흉갑·은사 긴 머리·보라 문신·쌍단검(역수 보조검)
Q.push(['다크 엘프',{cloth:'#262636',armor:'#262636',pants:'#181822',boot:'#121218',cape:'#16162a',hand:'#4e4e6c',
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,y=6*bw,P=W.HP,hr=W.J.hr;
  W3_hairLong(B,W,'#e4e6f0',{n:7});
  W3_breast(B,W,'#34344a',{y:5.8,wt:7.4,wb:5.2,riv:'#a8a8c8',back:1,edge:'#0e0e18'});
  for(const s of[-1,1])B.cap([-7*s*bw,y-1.4,sh-1.2],[5*s*bw,y-.4,H+3.2],1,'#14141e',{d:-.36});B.ball([0,y+.2,(sh+H)/2+1.2],1.2,'#9a7aff',{glow:'170,130,255',d:-.4});
  W3_belt(B,W,'#1a1a26',{buckle:'#a8a8c8',pouch:'#2a2a3a'});
  W3_tabard(B,W,'#2e2440',{len:8,emb:q=>{B.line([W3_a(q,[0,0,1.6]),W3_a(q,[-1.2,0,-.6]),W3_a(q,[1.2,0,-.6]),W3_a(q,[0,0,1.6])],'#b090ff',.45,{d:-.3});}});
  for(const sg of[-1,1]){W3_paul(B,W,sg,'#3a3a52',{r:3.3,rim:'#8888b0',riv:'#c0c0e0',spikes:sg>0?0:2,spikeC:'#a0a0c0'});W3_bracer(B,W,sg,'#1e1e2a',{band:'#6a6a98',stud:'#b0b0d0',w:3.8});W3_greave(B,W,sg,'#2a2a3a',{strap:'#121218',knee:'#4a4a64',w:4.4});}
  // 얼굴: 날선 눈썹·광대 문신·귀걸이
  for(const g of[-1,1]){B.cap(P(.62*g,.78,.48),P(.14*g,.9,.32),hr*.12,'#d8d8e8',{d:-.09});B.line([P(.5*g,.78,.0),P(.4*g,.86,-.35),P(.2*g,.92,-.55)],'#a070ff',.45,{d:-.1});B.ball(P(1.25*g,-.12,.05),hr*.13,'#c0c0e0',{d:-.04});B.ball(P(1.28*g,-.12,-.35),hr*.1,'#9a7aff',{glow:'170,130,255',d:-.04});}
  B.line([P(0,.98,.65),P(0,1.0,.25)],'#a070ff',.4,{d:-.1});B.cap(P(-.22,.92,-.52),P(.22,.92,-.52),hr*.07,'#2a1a2a',{d:-.1});
  W3_dagger(B,W.p.hR,W.p.dS,{blade:'#b8c4f0',guard:'#8a8ab0',fx:'170,130,255'});
  W3_dagger(B,W.p.hL,W3_n(.15,.35,-1),{len:10,blade:'#a8b4e0',guard:'#8a8ab0'});}}]);

// 72. 홉고블린 — 비늘 철갑 조끼·볏 달린 투구·코가리개·부족 방패·장검·붉은 망토
Q.push(['홉고블린',{armor:'#5e5246',pads:null,pants:'#3e3226',boot:'#2a2018',helm:'#6e665e',cape:'#6a2418',belt:'#3a2414',hand:'#8a5e30',
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,y=6.1*bw,P=W.HP,hr=W.J.hr,sk='#a0703a';
  // 비늘 철판(줄마다 엇갈린 반원 판)
  B.poly([[-7.6*bw,y-1.3,sh-1],[7.6*bw,y-1.3,sh-1],[5.8*bw,y-.2,H+3],[-5.8*bw,y-.2,H+3]],'#4a4038',{grad:1,edge:'#1a140e',ew:.6,d:-.24});
  for(let r=0;r<5;r++){const z=sh-2.4-r*2.7,wr=7-r*.35;for(let c=0;c<6;c++){const x=(-wr+c*wr*2/5+(r%2?.9:0))*bw;if(Math.abs(x)>wr*bw)continue;B.ball([x,y-.9+r*.2,z],1.5,r%2?'#8a8278':'#9a9288',{sy:.75,d:-.3});}}
  B.poly([[-7*bw,-y+1.6,sh-1],[7*bw,-y+1.6,sh-1],[5.4*bw,-y+.6,H+3],[-5.4*bw,-y+.6,H+3]],'#5a5046',{grad:1,edge:'#1a140e',ew:.6,d:.25});
  W3_belt(B,W,'#3a2414',{tasset:'#6a6058',pouch:'#4a2e18'});
  for(const sg of[-1,1]){W3_paul(B,W,sg,'#7a7268',{r:4,rim:'#a89a70',spikes:0});W3_bracer(B,W,sg,'#4a3220',{stud:'#c8c0a8'});W3_greave(B,W,sg,'#5e564c',{strap:'#2a1a10'});}
  // 얼굴: 매부리코·눈두덩·아래 송곳니·귀 고리
  B.cap(P(-.6,.8,.42),P(.6,.8,.42),hr*.2,W3_T(sk,-.35),{d:-.08});B.cap(P(0,.9,.3),P(0,1.32,-.12),hr*.26,W3_T(sk,-.08),{w1:hr*.14,d:-.1});
  B.poly([P(-.42,.86,-.42),P(.42,.86,-.42),P(.28,.84,-.6),P(-.28,.84,-.6)],'#2a0a06',{d:-.1});for(const g of[-1,1])B.cap(P(.26*g,.9,-.6),P(.3*g,.96,-.25),hr*.1,'#f0e6c8',{w1:hr*.03,d:-.12});
  for(const g of[-1,1]){B.ball(P(2*g,-.22,.45),hr*.12,'#c8a048',{d:-.06});B.line([P(.6*g,.7,.0),P(.36*g,.86,-.3)],'#c03020',.5,{d:-.1});}
  W3_orcHelm(B,W,'#6e665e',{});for(let i=0;i<5;i++)B.cap(P(0,.5-i*.35,1.05-i*.04),P(0,.3-i*.4,1.6-i*.12),hr*.22,i%2?'#a02818':'#c03a20',{w1:hr*.08,d:-.01});
  W3_sword(B,W,{blade:'#c8d0d8',guard:'#8a7040',wrap:'#5a3a1e'});
  W3_shield(B,W,{face:'#6a4224',rim:'#5a5e66',spike:0,emblem:(Pp,r)=>{B.ball(Pp(0,0,.45),r*.5,'#a02818',{flat:1,d:-.68,alpha:.9});B.ball(Pp(0,0,.5),r*.22,'#e8dcc0',{flat:1,d:-.69});B.ball(Pp(0,0,.55),r*.1,'#1a0a06',{flat:1,d:-.7});}});}}]);

// 네발짐승 날개 꼭짓점(plan.quad 와 같은 식): [뿌리, 위 마디, 끝, 뒤, 뒤뿌리]
function W3_qWing(B,g,sg){const{h,L,bw,ny,mode,f,t,run}=g,fl=Math.sin(f*1.6+t/250)*5+(mode==='buff'?8:0)+(run?4:0);
  return[[3*sg,L*.1+ny,h+5],[18*sg*bw,L*.1+ny-2,h+14+fl],[26*sg*bw,ny-6,h+6+fl],[14*sg*bw,-L*.3,h+3+fl*.4],[3*sg,-L*.2,h+4]];}
// 꼬리 마디(plan.quad 와 같은 식)
function W3_qTail(B,g){const s=g.s,n=s.tailN||3,pts=[[0,-g.L*.6+g.ny*.5,g.h+2]];for(let i=1;i<=n;i++)pts.push([Math.sin(g.t/300+i+g.f)*1.5*i*.5,-g.L*.6-i*(s.tailL||4),g.h+2+(s.tailUp||1.5)*i-(s.tailDrop||0)*i*i]);return pts;}
// 박쥐 날개 막(뼈대·막 주름·발톱)
function W3_batWing(B,g,col,bone,o={}){for(const sg of[-1,1]){const w=W3_qWing(B,g,sg);
  B.cap(w[0],w[1],1.6*g.bw,bone,{w1:1.1*g.bw,d:.32});B.cap(w[1],w[2],1.1*g.bw,bone,{w1:.4,d:.32});B.cap(w[1],w[3],.8*g.bw,bone,{w1:.3,d:.33});B.cap(w[1],W3_m(w[3],w[4],.5),.7*g.bw,bone,{w1:.3,d:.33});
  B.cap(w[1],W3_a(w[1],[sg*.6,1.2,1.6]),1,o.claw||'#e8dcc0',{w1:.15,d:.3});
  for(let i=0;i<3;i++){const a=W3_m(w[2+(i>1?1:0)],w[3+(i>1?1:0)],i===1?.5:.45);B.line([W3_m(w[1],a,.25),W3_m(w[1],a,.85)],W3_T(col,-.35),.4,{d:.34});}
  B.line([w[2],W3_a(W3_m(w[2],w[3]),[0,1,1.2]),w[3],W3_a(W3_m(w[3],w[4]),[0,1,1]),w[4]],W3_T(col,-.5),.5,{d:.34});}}

// 75. 안타라스 — 대지의 용: 바위 같은 등판·겹 뿔·이빨 줄·뼈 날개·꼬리 가시·발톱·모래 숨결
Q.push(['안타라스',{spines:null,
 detail(B,K){const g=W3_Qg(B),{h,L,bw,ny,R0,hd,r,fwd,tip,jaw,t,mode,f}=g,sk='#6a5a3a',dk='#3e3220',lt='#a08a5a';
  // 몸 비늘(옆구리 판) + 등 바위 판
  for(let i=0;i<40;i++){const y=-L*.45+(i%10)*L*.1+ny*.75,sx=i%2?-1:1,row=(i>>1)%2,ang=.5+row*.45+((i*.37)%1)*.15;const c=[sx*Math.sin(ang)*R0*1.04,y+row*.8,h+1+Math.cos(ang)*R0*1.0];B.ball(c,R0*.17,(i>>2)%2?W3_T(sk,-.18):W3_T(sk,.06),{flat:1,sx:1.1,sy:.7,d:-.22});B.line([W3_a(c,[0,-R0*.15,-R0*.08]),W3_a(c,[0,R0*.12,-R0*.12])],dk,.35,{d:-.23});}
  for(let i=0;i<8;i++){const y=-L*.52+i*L*.14+ny*(.5+i/16),z=h+1.4+R0*.95,ht=2.2+Math.sin(i/7*3.1)*2.2;B.poly([[0,y-1.6,z],[0,y+1.4,z],[0,y-.6,z+ht]],i%2?'#c8a868':'#b09050',{grad:1,edge:dk,ew:.4,d:-.32});}
  // 배 띠(가로 주름 판)
  for(let i=0;i<4;i++){const y=L*.48+ny-i*2;B.cap([-R0*.6,y,h-R0*.35+i*.2],[R0*.6,y,h-R0*.35+i*.2],1.1,i%2?lt:W3_T(lt,-.15),{d:-.12});}
  W3_batWing(B,g,'#4a3a24','#7a6440',{claw:'#e0d0a8'});
  // 꼬리 가시 + 끝 뼈몽둥이
  {const tp=W3_qTail(B,g);for(let i=0;i<tp.length-1;i++)B.cap(tp[i],tp[i+1],(4.2-i*.6)*bw,i%2?sk:W3_T(sk,-.1),{w1:(3.6-i*.6)*bw,d:.05});for(let i=1;i<tp.length;i++){const q=tp[i];B.cap(W3_a(q,[0,1,1.2]),W3_a(q,[0,-.6,3.6-i*.3]),1.3-i*.1,'#c8a868',{w1:.15,d:-.1});}const e=tp[tp.length-1];B.ball(e,2,'#8a7448',{d:-.1});for(const s2 of[-1,1])B.cap(e,W3_a(e,[s2*2.6,-1.4,.8]),1,'#e0d0a8',{w1:.12,d:-.12});}
  // 발톱
  for(const lg of g.legs){for(let i=-1;i<=1;i++)B.cap(W3_a(lg.ft,[i*.9,.9,.4]),W3_a(lg.ft,[i*1.2,2.4,-.3]),.7,'#e8dcc0',{w1:.1,d:-.08});B.ball(lg.kn,2*bw,W3_T(sk,-.1),{sy:.8,d:-.06});B.ball(W3_a(lg.kn,[0,.6,.6]),.9*bw,'#c8a868',{d:-.07});}
  // 머리: 눈두덩·겹뿔 마디·뺨 가시·윗니·콧구멍
  for(const s2 of[-1,1]){const e=W3_a(W3_a(hd,fwd,r*.62),[s2*r*.52,0,r*.28]);B.cap(W3_a(e,[s2*r*.25,-r*.3,r*.2]),W3_a(e,[-s2*r*.05,r*.25,r*.18]),r*.22,dk,{d:-.09});
    const a=W3_a(hd,[s2*r*.4,-r*.3,r*.6]),b=W3_a(hd,[s2*r*.9,-r*1.6,r*1.4]);for(let i=1;i<4;i++)B.ball(W3_m(a,b,i*.22),r*.3*(1-i*.15),'#c8b898',{sy:.6,d:-.05});
    B.cap(W3_a(hd,[s2*r*.8,-r*.1,r*.1]),W3_a(hd,[s2*r*1.6,-r*1.2,-r*.1]),r*.24,'#d8c8a0',{w1:r*.04,d:-.03});B.cap(W3_a(hd,[s2*r*.85,r*.1,-r*.3]),W3_a(hd,[s2*r*1.4,-r*.5,-r*.7]),r*.16,'#d8c8a0',{w1:r*.03,d:-.03});
    for(let i=0;i<4;i++){const q=W3_a(W3_m(W3_a(hd,fwd,r*.6),tip,.2+i*.22),[s2*r*.45,0,-r*.3]);B.cap(q,W3_a(q,[0,0,-r*.3-jaw*.4]),r*.09,'#f4ecd8',{w1:r*.02,d:-.1});}
    B.ball(W3_a(tip,[s2*r*.18,r*.1,r*.15]),r*.09,'#1a0a06',{flat:1,d:-.12});}
  for(let i=0;i<3;i++)B.cap(W3_a(W3_m(hd,tip,.3+i*.2),[0,0,r*.55-i*.08]),W3_a(W3_m(hd,tip,.25+i*.2),[0,-r*.2,r*.95-i*.1]),r*.18,'#c8a868',{w1:r*.03,d:-.1});
  if(mode==='skill'&&f===2)for(let i=0;i<8;i++){const q=[Math.sin(i*2.3)*3,L*.5+ny+8+i*2.6,h+3+Math.cos(i*1.7)*2];B.ball(q,.8+(i%3)*.4,'#7a6440',{d:-.4});}
  if(mode==='buff')for(let i=0;i<6;i++){const a=i/6*6.283+f*.5;B.ball([Math.cos(a)*(14+f*2),Math.sin(a)*(14+f*2)*.9,1+(i%2)*1.5],1,'#8a7448',{d:-.2});}}}]);

// 78. 그리폰 — 독수리 머리(갈고리 부리·밀랍막·눈썹 깃)·목깃털·깃 겹친 날개·독수리 앞발/사자 뒷발·꼬리 술
Q.push(['그리폰',{mane:null,
 detail(B,K){const g=W3_Qg(B),{h,L,bw,ny,R0,hd,r,fwd,tip,t,mode,f}=g,fe='#f0ece0',wc='#8a6a3a';
  // 날개 깃털(뿌리 덮깃 + 끝 칼깃)
  for(const sg of[-1,1]){const w=W3_qWing(B,g,sg);
    for(let i=0;i<7;i++){const q=W3_m(w[2],w[3],i/6),root=W3_m(w[1],w[4],.15+i*.1);const tipq=W3_a(q,[sg*(1.8-i*.15),-1.2-i*.25,-1]);B.cap(W3_m(root,q,.3),tipq,2.6*bw,i%2?W3_T(wc,-.15):W3_T(wc,.05),{w1:.5,d:.3});B.line([W3_m(root,q,.4),W3_m(q,tipq,.6)],W3_T(wc,-.45),.3,{d:.29});}
    for(let i=0;i<6;i++){const q=W3_m(w[0],w[1],.15+i*.15),q2=W3_m(w[4],w[3],.1+i*.15);B.cap(q,W3_m(q,q2,.45),1.6*bw,i%2?'#a07a46':'#c09a60',{w1:.6,d:.31});}
    B.cap(w[0],w[1],1.4*bw,'#7a5a30',{w1:1,d:.3});B.cap(w[1],w[2],1,'#7a5a30',{w1:.4,d:.3});}
  // 목깃털(겹 비늘 깃)
  {const nk=[0,g.front[1]+2,h+3+g.headUp*3];for(let i=0;i<4;i++){const c=W3_m(nk,hd,.15+i*.22);for(let j=0;j<5;j++){const a=(j/4-.5)*2.6;W3_fur(B,W3_a(c,[Math.sin(a)*2.8*bw,Math.cos(a)*1.2,Math.cos(a)*1.4]),2,2.8,j%2?fe:'#d8cfb8',{dir:[Math.sin(a)*.5,-.6,-.6],sp:1,sx:1,w:1.5,d:-.05});}}}
  {const nk=[0,g.front[1]+2,h+3+g.headUp*3];B.cap(nk,hd,4.2*g.bw,fe,{w1:3.4*g.bw,d:-.02});}
  B.ball(hd,r*1.04,fe,{d:-.03});for(const s2 of[-1,1]){const e=W3_a(W3_a(hd,fwd,r*.62),[s2*r*.52,0,r*.28]);B.ball(e,r*.2,'#ffcc33',{flat:1,glow:'255,200,60',d:-.08});B.ball(W3_a(e,[0,r*.05,0]),r*.09,'#100',{flat:1,d:-.09});}
  // 부리: 밀랍막·갈고리
  {const b0=W3_a(hd,fwd,r*.5),b1=W3_a(W3_a(hd,fwd,r*1.75),[0,0,-r*.45]);B.cap(b0,W3_a(hd,fwd,r*.75),r*.62,'#e8c050',{d:-.07});B.cap(b1,W3_a(b1,[0,-r*.15,-r*.55]),r*.2,'#d0a030',{w1:r*.04,d:-.1});B.line([W3_a(b0,[0,0,-r*.2]),W3_a(b1,[0,-r*.3,r*.05])],'#5a3a10',.4,{d:-.1});
    for(const s2 of[-1,1]){B.ball(W3_a(W3_a(hd,fwd,r*.7),[s2*r*.2,0,r*.12]),r*.07,'#3a2a10',{flat:1,d:-.11});
      const e=W3_a(W3_a(hd,fwd,r*.62),[s2*r*.52,0,r*.28]);B.cap(W3_a(e,[s2*r*.3,-r*.25,r*.3]),W3_a(e,[-s2*r*.05,r*.3,r*.12]),r*.18,'#b8b0a0',{d:-.09});B.cap(W3_a(e,[s2*r*.25,-r*.3,r*.1]),W3_a(e,[s2*r*.5,-r*1.1,r*.15]),r*.14,'#5a4630',{w1:r*.02,d:-.06});}}
  // 앞다리: 노란 비늘 + 갈고리 발톱 / 뒷다리: 사자 발 + 털
  for(const lg of g.legs){if(lg.sy>0){B.cap(W3_m(lg.kn,lg.ft,.3),lg.ft,2.2*bw,'#d8b048',{w1:1.6*bw,d:-.06});for(let i=0;i<3;i++)B.cap(W3_m(lg.kn,lg.ft,.4+i*.2),W3_m(lg.kn,lg.ft,.46+i*.2),2.4*bw,'#b08a30',{d:-.07});for(let i=-1;i<=1;i++){const a=W3_a(lg.ft,[i*.9,.8,.2]),b=W3_a(lg.ft,[i*1.3,2.4,.4]);B.cap(a,b,.7,'#d8b048',{d:-.08});B.cap(b,W3_a(b,[0,.6,-.9]),.5,'#2a1a10',{w1:.1,d:-.09});}B.cap(lg.ft,W3_a(lg.ft,[0,-1.6,.2]),.5,'#2a1a10',{w1:.1,d:-.08});W3_fur(B,W3_a(lg.kn,[0,0,1]),3,2.6,fe,{sp:2,sx:1,w:1.3,d:-.07});}
    else{B.ball(W3_a(lg.ft,[0,.4,.3]),1.9*bw,'#c09a60',{sy:.7,d:-.06});for(let i=-1;i<=1;i++)B.ball(W3_a(lg.ft,[i*.8,1.4,.2]),.6,'#a07a46',{d:-.08});W3_fur(B,W3_a(lg.top,[0,-1,-1]),3,2.6,'#a07a46',{sp:2,sx:1,w:1.3,d:-.04});}}
  // 몸 털결 + 꼬리 술
  for(let i=0;i<10;i++){const y=-L*.45+i*L*.08+ny*.7;for(const sx of[-1,1])B.line([[sx*R0*.92,y,h+R0*.6],[sx*R0*.98,y-1.4,h+R0*.1]],'#8a6a3a',.35,{d:-.24});}
  {const tp=W3_qTail(B,g),e=tp[tp.length-1];W3_fur(B,e,5,4,'#5a4024',{dir:[0,-.7,-.6],sp:2,sx:1,w:1.6,d:-.02});}
  if(mode==='skill'&&f>=1)for(let i=0;i<6;i++){const ph=((t/500)+i/6)%1;B.glow([Math.sin(i*2)*12,Math.cos(i*1.3)*6-2,h+8+ph*10],1.5,'255,230,150',(1-ph)*.7);}}}]);

// 81. 미믹 — 나뭇결 판자·쇠 모서리 장식·리벳·자물쇠판·위아래 톱니 이빨·침·안쪽 눈빛·짧은 발톱 다리
Q.push(['미믹',{
 detail(B,K){const g=W3_Og(B),{r,z0,lunge,mode,f,walk,ph,t}=g,s=B.s;const W=r,D=r*.75,H0=r*.8,zb=z0,hz=zb+H0,wd='#9a6030',bd='#5a4a3a',gold='#c0a050';
  const open=mode==='attack'?[.2,1,.5][f]:mode==='skill'?[.3,.9,1.1,.4][f]:mode==='buff'?.6:walk?.25+.15*Math.sin(ph*2):.08;
  const ca=Math.cos(open*1.1),sa=Math.sin(open*1.1),lid=(x,yy,zz)=>[x,-D+lunge+yy*ca-zz*sa,hz+yy*sa+zz*ca];
  // 판자 결(앞·뒤·옆)
  for(const yy of[D,-D])for(let i=1;i<3;i++){const z=zb+H0*i/3;B.line([[-W*.98,yy+lunge+(yy>0?.05:-.05),z],[W*.98,yy+lunge+(yy>0?.05:-.05),z]],'#4a2a10',.45,{d:yy>0?-.08:.08});}
  for(const xx of[-W,W])for(let i=1;i<3;i++){const z=zb+H0*i/3;B.line([[xx*1.005,-D*.98+lunge,z],[xx*1.005,D*.98+lunge,z]],'#4a2a10',.45,{d:-.02});}
  for(let i=0;i<5;i++){const x=-W*.7+i*W*.35;B.line([[x,D+lunge+.06,zb+.5+((i*3)%2)],[x+.6,D+lunge+.06,zb+1.6+((i*3)%2)]],'#6a3a18',.3,{d:-.09});}
  // 쇠 모서리 + 리벳
  for(const x of[-W,W])for(const yy of[-D,D]){B.cap([x,yy+lunge,zb],[x,yy+lunge,hz],1.6,bd,{d:-.1});for(let i=0;i<3;i++)B.ball([x*1.02,yy*1.02+lunge,zb+1+i*(H0-2)/2],.45,gold,{d:-.14});B.ball([x,yy+lunge,zb],.9,bd,{d:-.1});}
  for(const x of[-W*.5,W*.5]){B.cap([x,D+lunge+.1,zb],[x,D+lunge+.1,hz],1.1,gold,{d:-.09});B.cap([x,-D+lunge-.1,zb],[x,-D+lunge-.1,hz],1.1,gold,{d:.09});}
  // 뚜껑: 가운데 띠·모서리 쇠·리벳·자물쇠
  for(const x of[-W*.5,W*.5])B.cap(lid(x,0,0),lid(x,2*D,0),1.1,gold,{d:-.14});for(const x of[-W,W])B.cap(lid(x,0,.2),lid(x,2*D,.2),1.3,bd,{d:-.14});
  for(const x of[-W*.75,-W*.25,W*.25,W*.75])B.ball(lid(x,D,.3),.45,gold,{d:-.16});
  B.poly([[-1.6,D+lunge+.2,hz-.2],[1.6,D+lunge+.2,hz-.2],[1.3,D+lunge+.2,hz-3],[-1.3,D+lunge+.2,hz-3]],'#c8a848',{grad:1,edge:'#5a4018',ew:.5,d:-.2});B.ball([0,D+lunge+.35,hz-1.5],.45,'#1a1008',{flat:1,d:-.22});B.cap([0,D+lunge+.35,hz-1.6],[0,D+lunge+.35,hz-2.4],.3,'#1a1008',{d:-.22});
  // 이빨(통 테두리·뚜껑 안쪽) + 침
  if(open>.15){for(let i=0;i<9;i++){const x=-W*.85+i*W*.21;B.cap([x,D*.88+lunge,hz],[x,D*.86+lunge,hz+1+open*.9],.8,'#f4ecd8',{w1:.12,d:-.21});B.cap(lid(x,2*D-.6,-.1),lid(x,2*D-.7,-1.3-open*.6),.75,'#efe6d0',{w1:.1,d:-.22});}
    for(const sx of[-1,1])for(let i=0;i<4;i++){const yy=-D*.6+i*D*.45;B.cap([sx*W*.88,yy+lunge,hz],[sx*W*.86,yy+lunge,hz+1.1],.7,'#e8dcc4',{w1:.1,d:-.12});}
    B.ball([0,D*.6+lunge,hz+.5],W*.55,'#3a0808',{flat:1,sy:.45,d:-.06});for(const sx of[-1,1])B.line([[sx*W*.3,D*.86+lunge,hz+.4],[sx*W*.32,D*.9+lunge,hz-1.6-open]],'rgba(220,230,255,.7)',.35,{d:-.23});
    B.ball(W3_a([0,D*1.4+lunge+open*3,hz+1+open*2],[0,0,.2]),1.1,'#d05070',{d:-.27});}
  // 짧은 발톱 다리 4개
  for(const x of[-W*.75,W*.75])for(const yy of[-D*.6,D*.6]){const sw=walk?Math.sin(ph+(x*yy>0?0:Math.PI))*1.4:0,a=[x,yy+lunge,zb+.8],b=[x*1.2,yy*1.1+lunge+sw,Math.max(0,zb-2.2)];B.cap(a,b,1.3,'#5a3020',{w1:.9,d:.05});for(let i=-1;i<=1;i++)B.cap(b,W3_a(b,[i*.7,.9,-.2]),.45,'#efe6d0',{w1:.08,d:.03});}
  if(mode==='skill'&&f>=1)for(let i=0;i<6;i++){const a=i*1.05+t/300;B.ball([Math.cos(a)*W*.5,D*.2+lunge+Math.sin(a)*2,hz+3+((i*5+f*7)%9)],.7,gold,{glow:'255,210,90',d:-.3});}}}]);

// 84. 실루엣 — 그림자 망령: 연기 꼬리·찢긴 외투 자락·두건 속 빛나는 눈매·그림자 발톱·흐릿한 잔상
Q.push(['실루엣',{hair:null,
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,t=B.t,f=B.f,c0='#141418';
  // 두건·외투
  B.ball(W3_a(W.J.hd,[0,-.4,.4]),hr*1.12,'#0c0c10',{d:.02});B.poly([P(-.75,-.4,.85),P(.75,-.4,.85),P(0,-1.5,1.7)],'#0c0c10',{grad:1,d:.06});
  B.ball(P(0,.5,-.05),hr*.72,'#020204',{sy:.95,d:-.04});
  for(const g of[-1,1]){B.poly([P(.18*g,1.02,.22),P(.62*g,.92,.34),P(.55*g,.95,.12)],'#f0f0ff',{d:-.1});B.glow(P(.4*g,1.0,.22),2.2,'200,200,255',.7);}
  for(const sd of[1,-1]){const y=sd*4.8*bw,pts=[[-7.4*bw,y,sh],[7.4*bw,y,sh]];for(let i=0;i<=8;i++){const x=7.8*bw-i*15.6*bw/8,wv=Math.sin(t/260+i*1.3+f)*1.2;pts.push([x,y+sd*(1.2+Math.abs(wv)),2+(i%2?3:0)+wv]);}B.poly(pts,sd>0?'#18181e':'#101014',{grad:1,alpha:.92,edge:'#2a2a3a',ew:.4,d:sd>0?-.15:.2});}
  B.cap([-7*bw,5.4,sh-1],[6.2*bw,5.8,H+2],1,'#2a2a38',{d:-.3});
  // 연기 꼬리·잔상
  for(let i=0;i<10;i++){const ph=((t/1300)+i/10)%1,a=i*2.4;B.ball([Math.cos(a)*(5+ph*5),-3-ph*6+Math.sin(a)*2,H*.4+ph*30],1.4+ph*2.2,'#1a1a24',{alpha:(1-ph)*.55,d:.3});}
  for(const g of[-1,1]){const sp=W.sp(g);for(let i=0;i<3;i++){const ph=((t/900)+i/3)%1;B.ball(W3_a(sp,[g*ph*3,-1-ph*3,2+ph*7]),1+ph*1.6,'#22222e',{alpha:(1-ph)*.6,d:.2});}}
  B.ball([0,-2.5,H+6],7*bw,'#3a3a5a',{alpha:.18,sy:1.6,d:.4});
  // 그림자 발톱(왼손) + 단검
  {const h=W.p.hL;for(let i=-1;i<=1;i++)B.cap(h,W3_a(h,W3_n(i*.4,.8,-.4),4.2),.7,'#2a2a3a',{w1:.08,d:-.1});}
  W3_dagger(B,W.p.hR,W.p.dS,{blade:'#3a3a52',guard:'#22222e',wrap:'#14141c',grip:'#0a0a0e',fx:'150,150,220'});
  {const h=W.p.hR,d=W.p.dS;B.line([W3_a(h,d,3),W3_a(h,d,12)],'rgba(190,190,255,.8)',.35,{d:-.12});}
  for(const g of[-1,1])B.line([W.sp(g),W.el(g),W.h(g)],'rgba(140,140,200,.35)',.5,{d:-.2});}}]);

// 87. 리빙아머 — 빈 판금 갑옷: 금테 흉갑·겹 견갑·건틀릿·무릎판·대투구 바이저 틈 푸른 빛·관절 틈 혼불·장식 장검·문장 방패
Q.push(['리빙아머',{pads:null,
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,t=B.t,st='#8a909c',gl='120,180,255',gold='#c8a850';
  W3_breast(B,W,'#9aa0ac',{back:1,riv:'#e0d8b0',edge:'#3a3e48'});
  B.line([[-7.6*W.bw,6.2*bw-1,sh-1.4],[0,6.2*bw+.8,sh],[7.6*bw,6.2*bw-1,sh-1.4]],gold,.7,{d:-.33});
  B.poly([[-1.6,6.6*bw,sh-4],[1.6,6.6*bw,sh-4],[0,6.8*bw,sh-8]],gold,{grad:1,d:-.34});
  for(let i=0;i<3;i++)B.cap([-5.4*bw,5.8*bw,H+2.8-i*1.6],[5.4*bw,5.8*bw,H+2.8-i*1.6],1.3,i%2?'#7a808c':'#8a909c',{d:-.24});
  W3_belt(B,W,'#4a4e58',{tasset:'#868c98',buckle:gold,riv:'#e0d8b0'});
  for(const sg of[-1,1]){W3_paul(B,W,sg,'#a0a6b2',{r:4.6,rim:gold,riv:'#e0d8b0'});W3_bracer(B,W,sg,'#8a909c',{band:'#5a606a',stud:gold,w:4.6});W3_greave(B,W,sg,'#8e94a0',{knee:'#a8aeba',strap:null,cuff:'#5a606a'});
    const h=W.h(sg);B.ball(h,2.5*bw,'#6a707c',{d:-.08});for(let i=-1;i<=1;i++)B.cap(W3_a(h,[i*.6,.6,.4]),W3_a(h,[i*.7,1.6,-.6]),.6,'#7a808c',{d:-.1});
    for(const q of[W.el(sg),W.kn(sg)])B.glow(q,2.2,gl,.45);}
  // 대투구: 세로 능선·바이저 슬롯·숨구멍·볏
  B.ball(W.J.hd,hr*1.08,'#8a909c',{d:-.02});B.cap(P(0,1.05,.95),P(0,1.1,-.75),hr*.18,'#a8aeba',{d:-.08});
  for(const g of[-1,1]){B.cap(P(.12*g,1.02,.28),P(.72*g,.85,.3),hr*.14,'#050810',{d:-.09});B.glow(P(.4*g,1,.28),1.8,gl,.8);for(let i=0;i<3;i++)B.ball(P(.35*g,.98,-.25-i*.18),hr*.05,'#050810',{flat:1,d:-.1});}
  for(let i=0;i<12;i++){const a=i/12*6.283;B.ball(P(Math.cos(a)*1.04,Math.sin(a)*1.04,-.35),hr*.08,i%2?gold:'#e0d8b0',{d:-.05});}
  for(let i=0;i<6;i++)B.cap(P(0,.6-i*.35,1.05-i*.05),P(0,.2-i*.4,1.7-i*.15),hr*.28,i%2?'#3a5aa0':'#4a6ac0',{w1:hr*.08,d:0});
  B.glow(W3_a(W.J.hd,[0,0,-hr*1.2]),3,gl,.35);
  W3_sword(B,W,{blade:'#d8e0ea',guard:gold,wrap:'#2a3a6a',len:23});
  {const h=W.p.hR,d=W.p.dS;B.line([W3_a(h,d,4),W3_a(h,d,20)],'rgba(150,200,255,.7)',.4,{d:-.12});}
  W3_shield(B,W,{face:'#3a4a7a',rim:'#a0a6b2',boss:gold,emblem:(Pp,r)=>{B.cap(Pp(1.57,r*.7,.4),Pp(-1.57,r*.7,.4),.9,gold,{d:-.69});B.cap(Pp(0,r*.6,.4),Pp(3.14,r*.6,.4),.9,gold,{d:-.69});}});
  if(B.mode==='idle'||B.mode==='buff')for(let i=0;i<4;i++){const ph=((t/1100)+i/4)%1;B.glow([Math.sin(i*2)*3,4,sh+2+ph*8],1,gl,(1-ph)*.6);}}}]);

// 90. 시댄서 — 바다 무희 해파리: 프릴 갓 테두리·방사 수관·발광 점·긴 리본 구완·가는 촉수 다발
Q.push(['시댄서',{
 detail(B,K){const g=W3_Og(B),{r,z0,lunge,sq,pulse,t,mode,f,walk}=g,sk='#a080e0',R0=r*(1+pulse),cz=z0+r*1.4,ry=.72*sq,bz=cz-R0*ry*.35;
  // 방사 수관(갓 위)
  for(let i=0;i<8;i++){const a=i/8*6.283+.2,pts=[];for(let j=0;j<=4;j++){const el=j/4*1.2+.25;pts.push([Math.cos(a)*Math.sin(el)*R0*.97,lunge+Math.sin(a)*Math.sin(el)*R0*.97,cz+Math.cos(el)*R0*ry*.97]);}B.line(pts,'rgba(255,220,255,.55)',.45,{d:-.12});}
  for(let i=0;i<4;i++){const a=i/4*6.283+.6;B.ball([Math.cos(a)*R0*.35,lunge+Math.sin(a)*R0*.35,cz+R0*ry*.55],r*.16,'#ffb0f0',{flat:1,glow:'255,160,240',alpha:.8,d:-.1});}
  // 프릴 테두리
  for(let i=0;i<16;i++){const a=i/16*6.283,w=Math.sin(t/200+i*1.7)*.5;B.ball([Math.cos(a)*R0*.92,lunge+Math.sin(a)*R0*.92,bz+w],r*.22,i%2?'#c8a8f8':'#b090ee',{sy:.6,alpha:.75,d:Math.sin(a)>0?-.05:.15});B.ball([Math.cos(a)*R0*.95,lunge+Math.sin(a)*R0*.95,bz-.6+w],r*.06,'#ffe8ff',{flat:1,glow:i%4?null:'255,200,255',d:-.08});}
  // 리본 구완(넓고 물결)
  for(let k=0;k<4;k++){const a=k/4*6.283+.8;let p0=[Math.cos(a)*r*.2,lunge+Math.sin(a)*r*.2,bz];for(let j=1;j<=6;j++){const wv=Math.sin(t/280+j*.9+k*1.6+f*.8),p1=[Math.cos(a)*r*(.25+j*.06)+wv*1.3,lunge+Math.sin(a)*r*(.25+j*.06)-(walk?j*.8:0)+Math.cos(t/300+j+k)*.8,bz-j*r*.32];
    B.cap(p0,p1,1.8-j*.18,j%2?'#e0b8ff':'#d0a0f8',{w1:1.6-j*.18,alpha:.7,d:.05});if(j%2)B.ball(p1,.45,'#fff0ff',{flat:1,glow:'255,200,255',alpha:.8,d:0});p0=p1;}}
  // 가는 촉수
  for(let i=0;i<10;i++){const a=i/10*6.283+.3;let p0=[Math.cos(a)*R0*.85,lunge+Math.sin(a)*R0*.85,bz-.5];for(let j=1;j<=5;j++){const p1=[p0[0]*.97+Math.sin(t/240+i+j)*.7,p0[1]-(walk?.9:.2)+Math.cos(t/330+i*j)*.4,bz-.5-j*r*.42];B.line([p0,p1],'rgba(230,200,255,.55)',.35-j*.03,{d:.1});p0=p1;}}
  B.ball([-R0*.35,lunge+R0*.3,cz+R0*ry*.6],r*.18,'#ffffff',{flat:1,alpha:.55,d:-.15});
  if(mode==='skill')for(let i=0;i<8;i++){const ph=((t/700)+i/8+f*.2)%1,a=i*.785;B.glow([Math.cos(a)*(R0+ph*12),lunge+Math.sin(a)*(R0+ph*12),cz-2],1.4,'220,150,255',(1-ph)*.8);}}}]);

// 93. 혈거인간 — 동굴 원시인: 짐승 가죽 어깨걸이·털 허리두르개·뼈 목걸이·덥수룩한 머리·두꺼운 눈두덩·돌 박은 곤봉·흙 문신
Q.push(['혈거인간',{fur:null,
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,sk='#b08a6a',fu='#7a5a3a',y=6*bw;
  for(const g of[-1,1])B.ball([g*3.4*bw,y-1.6,sh-4],3.2*bw,W3_T(sk,.06),{sx:1.15,sy:.6,d:-.2});for(let i=0;i<3;i++)for(const g of[-1,1])B.ball([g*1.6*bw,y-1.1,sh-9.2-i*2.4],1.5*bw,W3_T(sk,-.05),{sy:.8,d:-.2});
  for(const g of[-1,1])B.line([[g*5*bw,y-.6,sh-2],[g*2*bw,y,sh-6],[g*4*bw,y-.5,sh-9]],'#7a3a20',.6,{d:-.25});
  // 가죽 어깨걸이(한쪽 어깨) + 털 허리두르개
  B.poly([[-9*bw,1,sh+1],[-2*bw,y-.4,sh-1],[4*bw,y-.6,H+6],[1*bw,y-1,H+3],[-8*bw,2,sh-6]],'#8a6a44',{grad:1,edge:'#3a2810',ew:.5,d:-.28});
  W3_fur(B,[-6*bw,y-1,sh-3],5,3,fu,{dir:[.3,.4,-.8],sp:5,sx:1,w:1.6,d:-.3});
  for(let i=0;i<9;i++){const a=(i/8-.5)*2.6;W3_fur(B,[Math.sin(a)*7*bw,Math.cos(a)*5.4*bw*(Math.cos(a)>0?1:1),H+1.5],3,6+Math.sin(i*2.3)*1.4,i%2?fu:W3_T(fu,-.18),{sp:2.4,sx:1,w:2,d:Math.cos(a)>0?-.25:.2});}
  for(let i=0;i<5;i++){const a=(i/4-.5)*2.6;W3_fur(B,[Math.sin(a)*7*bw,-5.4*bw,H+1.5],3,6.5,W3_T(fu,-.1),{sp:2.4,sx:1,w:2,d:.25});}
  B.cap([-7*bw,1.2,H+2],[7*bw,1.2,H+2],1.6,'#4a3018',{d:-.24});
  W3_neck(B,W,'#e8dcc0',{fang:'#f4ecd8',n:9,r:.9});
  for(const sg of[-1,1]){const el=W.el(sg),h=W.h(sg);for(let i=0;i<3;i++)B.cap(W3_m(el,h,.55+i*.1),W3_m(el,h,.59+i*.1),4*bw,'#8a7050',{d:-.08});
    const kn=W.kn(sg),f=W.ftp(sg);W3_fur(B,W3_a(W3_m(kn,f,.6),[0,0,1.2]),4,3,fu,{sp:3,sx:1,w:1.5,d:-.1});B.cap(W3_m(kn,f,.75),W3_m(kn,f,.82),5*bw,'#6a4a2a',{d:-.1});}
  // 머리: 덥수룩 머리·눈두덩·납작코·수염·흙 칠
  for(let i=0;i<11;i++){const a=i/11*6.283;if(Math.sin(a)>.3)continue;B.cap(P(Math.cos(a)*.7,Math.sin(a)*.55-.2,.75),P(Math.cos(a)*1.25,Math.sin(a)*.9-.5,-.1-Math.abs(Math.sin(i*1.9))*.4),hr*.32,i%2?'#3a2a1a':'#2a1e12',{w1:hr*.1,d:Math.sin(a)>.4?-.02:.06});}
  B.cap(P(-.68,.82,.42),P(.68,.82,.42),hr*.3,W3_T(sk,-.25),{d:-.1});B.ball(P(0,1.02,0),hr*.26,W3_T(sk,-.1),{sx:1.3,d:-.1});
  for(let i=0;i<7;i++){const x=(i-3)*.17;B.cap(P(x,.86,-.35),P(x*1.3,.92,-1.3-Math.abs(Math.sin(i*2))*.4),hr*.2,i%2?'#3a2a1a':'#2a1e12',{w1:hr*.06,d:-.14});}
  for(const g of[-1,1])B.line([P(.6*g,.78,.15),P(.2*g,.95,.1)],'#7a3a20',.6,{d:-.13});
  // 곤봉: 굵은 뼈 + 박힌 돌조각 + 가죽끈
  {const h=W.p.hR,d=W.p.dS,pt=k=>W3_a(h,d,k),pp=W3_perp(d),qq=W3_n(...W3_x(d,pp));B.cap(pt(-3.4),pt(16),2.6,'#d8ccb0',{w1:4.4,d:-.05});B.ball(pt(16.4),3.2,'#e0d4b8',{d:-.06});B.ball(W3_a(pt(15),pp,2),2.2,'#d0c4a8',{d:-.06});
    for(let i=0;i<5;i++){const a=i*1.26,dir=W3_a(W3_a([0,0,0],pp,Math.cos(a)),qq,Math.sin(a));const b=W3_a(pt(11+(i%3)*2),dir,2);B.poly([b,W3_a(W3_a(b,dir,2.2),d,.8),W3_a(b,d,1.6)],'#5a5a62',{edge:'#2a2a30',ew:.3,d:-.1});}
    for(let i=0;i<3;i++)B.cap(pt(-2.6+i*1.4),pt(-2+i*1.4),3,'#4a3018',{d:-.07});}}}]);

// 96. 크러스트시안 — 거대 게: 가시 테 등딱지·혹·따개비·마디 띠 다리·톱니 집게·눈자루·입틀 거품
Q.push(['크러스트시안',{
 detail(B,K){const g=W3_Bg(B),{S,L,hp,hr,bw,t,snap,lunge,rear,mode,f,h}=g,sk='#8a3a3a',dk='#5a1e1e',lt='#c86a5a';
  const mid=S[1];const cR=6.6*bw,cz=mid.p[2]+1.6;
  // 등딱지(넓은 판) + 가장자리 가시 + 혹 + 따개비
  {const pts=[];for(let i=0;i<16;i++){const a=i/16*6.283;pts.push([Math.cos(a)*cR*1.15,mid.p[1]+Math.sin(a)*cR*.85,cz+Math.abs(Math.sin(a))*.2]);}B.poly(pts,sk,{grad:1,edge:dk,ew:.7,d:-.2});
    B.ball([0,mid.p[1],cz+.4],cR*.85,W3_T(sk,.05),{sy:.42,d:-.22});
    for(let i=0;i<10;i++){const a=(i/9)*Math.PI*.9+.15*Math.PI;for(const s2 of[-1,1]){const b=[s2*Math.cos(a-Math.PI/2)*0+Math.cos(a)*cR*1.12*s2,mid.p[1]+Math.sin(a)*cR*.82*(i<5?1:1),cz];if(i%2)B.cap(b,W3_a(b,[s2*Math.cos(a)*1.4,Math.sin(a)*1.2,.4]),.8,lt,{w1:.1,d:-.23});}}
    for(const[x,y]of[[-2.2,1.2],[2.2,1.2],[0,2.6],[-3.2,-1.4],[3.2,-1.4],[0,-.6]])B.ball([x*bw,mid.p[1]+y,cz+2.2-Math.abs(x)*.25],1.1*bw,W3_T(sk,.15),{d:-.26});
    B.line([[-cR*.8,mid.p[1]+cR*.3,cz+1.2],[0,mid.p[1]+cR*.55,cz+1.6],[cR*.8,mid.p[1]+cR*.3,cz+1.2]],dk,.5,{d:-.27});B.line([[0,mid.p[1]-cR*.6,cz+2],[0,mid.p[1]+cR*.4,cz+2.6]],dk,.4,{d:-.27});
    for(const[x,y]of[[-4,-2.6],[-3.3,-3.6],[4.2,-2]]){B.ball([x*bw,mid.p[1]+y,cz+1.3],.9,'#d8d0c0',{d:-.28});B.ball([x*bw,mid.p[1]+y+.1,cz+1.9],.35,'#4a4040',{flat:1,d:-.29});}}
  // 다리 마디 띠 + 가시 + 검은 끝
  for(const lg of L){B.ball(lg.knee,1.2*bw,lt,{d:-.06});for(const tt of[.35,.7]){const q=W3_m(lg.knee,lg.ft,tt);B.ball(q,.8*bw,dk,{d:-.07});B.cap(q,W3_a(q,[lg.sg*.4,0,1]),.35,lt,{w1:.05,d:-.08});}B.cap(W3_m(lg.knee,lg.ft,.85),lg.ft,.7,'#2a1010',{w1:.1,d:-.08});}
  // 집게 보강(톱니·혹·검은 끝)
  for(const s2 of[-1,1]){const el=W3_a(hp,[s2*hr*1.9,hr*1.6+lunge*.3,1+rear*2]),cl=W3_a(el,[s2*-1*(1-snap*.5),3.5+snap*2,.5]),cl2=W3_a(cl,[s2*1.6,-.5,0]);
    B.cap(el,W3_a(el,[s2*-.4,2.4,.3]),3.6*bw,'#a04a3a',{w1:2.6*bw,d:-.1});B.line([W3_a(el,[0,0,1.6]),W3_a(el,[s2*-.3,2.4,1.4])],lt,.5,{d:-.13});
    B.cap(W3_m(el,cl,.6),cl,1.3,'#2a1010',{w1:.3,d:-.12});B.cap(W3_m(el,cl2,.65),cl2,1,'#2a1010',{w1:.25,d:-.12});
    for(let i=0;i<3;i++){const q=W3_m(el,cl,.45+i*.15);B.cap(q,W3_a(q,[s2*.7,.2,0]),.45,'#f0e0c8',{w1:.1,d:-.13});}
    // 눈자루
    const eb=W3_a(hp,[s2*hr*.4,hr*.6,hr*.2]),et=W3_a(hp,[s2*hr*.55,hr*.85,hr*1.3+Math.sin(t/300+s2)*.3]);B.cap(eb,et,.8,'#7a3030',{w1:.6,d:-.08});B.ball(et,.9,'#101010',{d:-.1});B.ball(W3_a(et,[-.2,.2,.3]),.3,'#ffffff',{flat:1,d:-.11});}
  for(let i=0;i<4;i++){const ph=((t/700)+i/4)%1;B.ball(W3_a(hp,[Math.sin(i*2)*1.4,hr*.9+ph,hr*-.1+ph*2]),.4+ph*.5,'#e8f4ff',{alpha:(1-ph)*.7,d:-.15});}
  for(const s2 of[-1,1])B.cap(W3_a(hp,[s2*.6,hr*.8,-hr*.2]),W3_a(hp,[s2*.4,hr*1.1,-hr*.5]),.6,lt,{d:-.12});}}]);

// 99. 아스테 — 얼음 정령: 서리 결정 왕관·흐르는 빛머리·얼음 결정 띠 장식·떠 있는 얼음 파편·수정 지팡이
Q.push(['아스테',{scol:'#a0c8e0',
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,t=B.t,f=B.f,ic='#c0f0ff',cl='#80c0e0';
  W3_hairLong(B,W,'#a8e4ff',{n:7,len:1.2});
  // 왕관 결정
  for(let i=-2;i<=2;i++){const a=P(i*.32,.25-Math.abs(i)*.1,.85),b=P(i*.45,.2-Math.abs(i)*.15,1.7+(i===0?.6:0)-Math.abs(i)*.15);B.cap(a,b,hr*.2,i%2?'#e0faff':ic,{w1:hr*.02,d:-.04});}
  B.cap(P(-.8,.3,.7),P(.8,.3,.7),hr*.12,'#e8fcff',{d:-.05});B.ball(P(0,.85,.72),hr*.13,'#ffffff',{glow:'180,240,255',d:-.08});
  // 옷: 가슴 결정판·허리 끈·소매 서리 테·치맛자락 결정 끝
  for(const g2 of[-1,1])B.line([[g2*5.6*bw,5.4*bw,sh-1],[g2*1.4*bw,6.2*bw,sh-5],[0,6.3*bw,sh-7]],'#e8fcff',.6,{d:-.28});B.ball([0,6.4*bw,sh-4],1.1,'#ffffff',{glow:'180,240,255',d:-.32});
  B.cap([-6.4*bw,1.2,H+2],[6.4*bw,1.2,H+2],1.4,'#e0f6ff',{d:-.24});
  for(let i=0;i<7;i++){const a=(i/6-.5)*2.6,z=H-8-Math.abs(Math.sin(i*1.7))*3+Math.sin(t/300+i)*.6;const q=[Math.sin(a)*5.6*bw,Math.cos(a)*3*bw,z];B.cap(W3_a(q,[0,0,3]),q,1.4,i%2?ic:'#e0faff',{w1:.15,d:-.16,alpha:.85});}
  for(const sg of[-1,1]){const el=W.el(sg),h=W.h(sg);B.cap(W3_m(el,h,.5),W3_m(el,h,.88),3.6*bw,cl,{w1:5.4*bw,d:-.06,alpha:.9});B.cap(W3_m(el,h,.86),W3_m(el,h,.9),5.6*bw,'#e8fcff',{d:-.08});
    const sp=W.sp(sg);for(let i=0;i<3;i++)B.cap(W3_a(sp,[sg*i*1.2,0,.6]),W3_a(sp,[sg*(1+i*1.6),-.4,3.2-i*.6]),.9,'#e0faff',{w1:.1,d:-.3});}
  // 떠다니는 얼음 파편
  for(let i=0;i<5;i++){const a=t/900+i*1.256,z=H+4+Math.sin(t/500+i)*3;const c=[Math.cos(a)*13,Math.sin(a)*9,z];B.poly([W3_a(c,[0,0,2]),W3_a(c,[1,.3,0]),W3_a(c,[0,0,-2]),W3_a(c,[-1,-.3,0])],i%2?'#d8f8ff':'#a8e0f8',{edge:'#ffffff',ew:.3,alpha:.85,d:Math.sin(a)>0?-.3:.3});}
  W3_staff(B,W,{wood:'#a0c8e0',orb:'#e0fcff',fx:'160,230,255',wrap:'#e8fcff',claw:'#c0f0ff'});
  {const h=W.p.hR,d=W.p.dS,pt=k=>W3_a(h,d,k);for(let i=0;i<3;i++){const a=i*2.09;B.cap(pt(15),W3_a(pt(20.5),[Math.cos(a)*1.4,Math.sin(a)*1.4,0]),.9,'#e0fcff',{w1:.1,d:-.09});}}
  if(B.mode==='skill'||B.mode==='buff')for(let i=0;i<8;i++){const ph=((t/600)+i/8+f*.15)%1,a=i*.785;B.glow([Math.cos(a)*(6+ph*10),Math.sin(a)*(6+ph*10),H+ph*16],1.3,'200,245,255',(1-ph)*.8);}}}]);

// 102. 라미아 — 뱀 여인: 비늘 꼬리(배판·등 무늬)·청동 가슴가리개·금 장신구·긴 흑록 머리·뱀 눈 문양·창
Q.push(['라미아',{
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,{mode,f,t}=B,walk=mode==='walk'||mode==='run',tc='#4a8a4a',gold='#d8b050';
  const w=Math.sin(t/300+f*1.4)*(walk?2.5:1),pts=[[0,0,H],[0,2,H*.5],[w,1,4],[-w+3,-6,2.5],[w,-12,2.2],[-4-w,-16,2.6],[-7,-12+w,3.4]];
  // 꼬리 비늘: 등 마름모 무늬·배판 띠·끝 지느러미
  for(let i=1;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],ww=(11-i*1.4)*bw;for(let j=0;j<3;j++){const q=W3_m(a,b,j/3+.15);B.ball(W3_a(q,[0,0,ww*.42]),ww*.16,j%2?'#2a5a2a':'#6aaa5a',{flat:1,sx:1.2,sy:.6,d:-.08});
      const dv=W3_n(...W3_sub(b,a)),pp=W3_perp(dv);B.cap(W3_a(W3_a(q,pp,-ww*.38),[0,0,-ww*.22]),W3_a(W3_a(q,pp,ww*.38),[0,0,-ww*.22]),1.2,'#a8c890',{d:-.05});}}
  {const a=pts[pts.length-2],e=pts[pts.length-1];B.poly([e,W3_a(e,[-2,2,3]),W3_a(e,[-3.6,.4,1.2]),W3_a(e,[-2,-1.4,-.4])],'#7ac07a',{grad:1,edge:'#2a5a2a',ew:.4,alpha:.9,d:.05});}
  for(let i=0;i<4;i++){const q=W3_m(pts[0],pts[2],.3+i*.18);B.cap(W3_a(q,[-3.6*bw,3.4,0]),W3_a(q,[3.6*bw,3.4,0]),1.6,i%2?'#a8c890':'#98b880',{d:-.2});}
  // 상체: 청동 가슴가리개·허리 금띠·목걸이·팔찌
  for(const g of[-1,1]){B.ball([g*2.8*bw,5.4*bw,sh-4],2.6*bw,'#b08a40',{sx:1.1,sy:.75,d:-.25});B.line([[g*1*bw,5.8*bw,sh-4],[g*4.4*bw,5.6*bw,sh-4]],'#f0d890',.4,{d:-.3});}
  B.cap([-6*bw,1.2,H+3],[6*bw,1.2,H+3],1.8,gold,{d:-.24});B.cap([-6*bw,-1.2,H+3],[6*bw,-1.2,H+3],1.8,gold,{d:.24});for(let i=-2;i<=2;i++)B.cap([i*2.2*bw,5.4*bw,H+2.6],[i*2.4*bw,5.8*bw,H-1.6+Math.abs(i)*.4],.6,gold,{w1:.2,d:-.28});
  B.ball([0,6.2*bw,H+2.8],1,'#30c070',{glow:'120,255,160',d:-.3});
  W3_neck(B,W,gold,{n:11,r:.6});B.ball([0,6.6*bw,W.sh-3.6],.9,'#30c070',{d:-.42});
  for(const sg of[-1,1]){const el=W.el(sg),h=W.h(sg);for(const tt of[.2,.75])B.cap(W3_m(W.sp(sg),el,tt),W3_m(W.sp(sg),el,tt+.06),4*bw,gold,{d:-.1});B.cap(W3_m(el,h,.8),W3_m(el,h,.86),3.6*bw,gold,{d:-.1});}
  // 머리: 긴 머리·이마 장식·뱀 눈 세로동공·송곳니
  W3_hairLong(B,W,'#2e5a32',{n:9,len:1.4});
  B.cap(P(-.85,.5,.55),P(.85,.5,.55),hr*.1,gold,{d:-.05});B.ball(P(0,.95,.55),hr*.15,'#30c070',{glow:'120,255,160',d:-.08});
  for(const g of[-1,1]){B.cap(P(.38*g,.98,.2),P(.38*g,.98,.05),hr*.05,'#100800',{d:-.09});B.cap(P(.18*g,.9,-.5),P(.2*g,.92,-.72),hr*.06,'#ffffff',{w1:hr*.01,d:-.1});B.ball(P(1.2*g,-.1,0),hr*.12,gold,{d:-.04});}
  W3_spear(B,W,{blade:'#e0c870',haft:'#3a5a3a',wrap:gold,tassel:'#2a8a5a'});}}]);

// 바위 덩이 + 용암 틈(빛나는 선)
function W3_rock(B,c,r,col,o={}){B.ball(c,r,col,{sy:o.sy||.85,d:o.d??-.2});B.ball(W3_a(c,[-r*.25,r*.15,r*.35]),r*.45,W3_T(col,.18),{flat:1,sy:.6,alpha:.6,d:(o.d??-.2)-.01});}
function W3_crack(B,pts,o={}){B.line(pts,o.col||'#ffb030',o.w||.7,{d:o.d??-.3});B.line(pts,'#fff0a0',(o.w||.7)*.35,{d:(o.d??-.3)-.01});if(o.glow!==0)B.glow(pts[1]||pts[0],o.gr||1.6,o.gc||'255,140,30',.5);}

// 105. 라바 골렘 — 검은 현무암 덩이 몸·사이로 흐르는 용암 틈·가슴 용암 핵·바위 주먹·흘러내리는 용암 방울·연기
Q.push(['라바 골렘',{pads:null,
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,t=B.t,f=B.f,rk='#3a2418',rk2='#2a1a12';
  // 가슴 핵 + 몸통 바위판
  B.ball([0,6.2*bw,sh-6],3*bw,'#ff8a20',{glow:'255,140,30',d:-.24});B.ball([0,6.6*bw,sh-6],1.6*bw,'#fff0a0',{flat:1,d:-.26});
  for(const[x,z,r]of[[-4.6,-2.6,3.2],[4.6,-2.6,3.2],[-3.6,-9.6,2.8],[3.6,-9.6,2.8],[0,-13,2.6],[-5.6,-6.4,2.2],[5.6,-6.4,2.2]])W3_rock(B,[x*bw,5.4*bw,sh+z],r*bw,(x*z)%2?rk:rk2,{d:-.22});
  W3_crack(B,[[-2*bw,6.6*bw,sh-3],[-1*bw,6.8*bw,sh-8],[-2.6*bw,6.4*bw,sh-12]]);W3_crack(B,[[2.4*bw,6.6*bw,sh-4],[1.4*bw,6.8*bw,sh-9],[3*bw,6.4*bw,H+3]]);W3_crack(B,[[-6*bw,5.4*bw,sh-4],[-4*bw,6*bw,sh-8.6]],{glow:0});
  for(const[x,z,r]of[[-3.6,-3,3],[3.6,-3,3],[0,-9,3.2],[-4,-12,2.6],[4,-12,2.6]])W3_rock(B,[x*bw,-5*bw,sh+z],r*bw,rk,{d:.22});W3_crack(B,[[0,-6*bw,sh-1],[-1*bw,-6.2*bw,sh-6],[1*bw,-6*bw,H+4]],{d:.21,glow:0});
  for(const sg of[-1,1]){const sp=W.sp(sg),el=W.el(sg),h=W.h(sg),kn=W.kn(sg),ft=W.ftp(sg);
    W3_rock(B,W3_a(sp,[sg*1,0,1.4]),4.2*bw,rk2,{d:-.32});for(let i=0;i<3;i++)B.cap(W3_a(sp,[sg*(i-1)*1.6,-.4+i*.6,3.4]),W3_a(sp,[sg*(i-1)*2.2,-.8+i*.6,6.2-i*.6]),1.4,'#2a1a12',{w1:.2,d:-.34});
    W3_crack(B,[W3_a(sp,[0,2.6,-.4]),W3_a(sp,[sg*1.4,3,-2.6])],{glow:0,d:-.36});
    W3_rock(B,W3_m(sp,el,.55),3*bw,rk,{d:-.08});W3_rock(B,W3_m(el,h,.5),2.8*bw,rk2,{d:-.08});W3_crack(B,[W3_a(el,[0,1.6,.6]),W3_a(W3_m(el,h,.5),[0,2.4,0]),W3_a(h,[0,2.4,1])],{w:.6,gr:1.2,d:-.12});
    W3_rock(B,h,4.4*bw,'#3e2a1c',{d:-.1});for(let i=-1;i<=1;i++)B.ball(W3_a(h,[i*1.6,2.4,1.2]),1.3*bw,rk2,{d:-.13});B.glow(W3_a(h,[0,1.6,0]),2.2,'255,140,30',.5);
    W3_rock(B,W3_a(kn,[0,1.2,.5]),3.2*bw,rk2,{d:-.12});W3_crack(B,[W3_a(kn,[0,2.8,1.6]),W3_a(W3_m(kn,ft,.5),[0,2.8,0])],{w:.6,gr:1.2,d:-.14});W3_rock(B,W3_a(ft,[0,1.2,.6]),3*bw,rk,{sy:.55,d:-.1});}
  // 머리: 바위 이마·빛나는 입 틈·뿔 바위
  B.cap(P(-.8,.6,.55),P(.8,.6,.55),hr*.5,rk2,{d:-.06});for(const g of[-1,1])B.cap(P(.6*g,0,.8),P(1.1*g,-.3,1.5),hr*.36,rk,{w1:hr*.1,d:-.04});
  B.line([P(-.5,1,-.35),P(-.15,1.05,-.5),P(.2,1.04,-.35),P(.5,1,-.5)],'#ffb030',.8,{d:-.12});B.glow(P(0,1.05,-.4),2,'255,140,30',.6);
  // 용암 방울·연기
  for(let i=0;i<4;i++){const ph=((t/900)+i/4+f*.1)%1,base=[(i-1.5)*3.4*bw,6*bw,sh-4-i*2];B.ball(W3_a(base,[0,.3,-ph*12]),.7*(1-ph*.4),'#ffa020',{glow:'255,140,30',alpha:1-ph*.5,d:-.3});}
  for(let i=0;i<5;i++){const ph=((t/1500)+i/5)%1;B.ball([Math.sin(i*2.1)*5,-1+Math.cos(i)*2,sh+6+ph*16],1.4+ph*2.4,'#3a3030',{alpha:(1-ph)*.45,d:.2});}}}]);

// 108. 혼 켈베로스 — 지옥 삼두견: 머리마다 휜 마디 뿔·눈두덩·이빨·불꽃 갈기·가시 목줄·근육 결·불꽃 꼬리끝·잿불
Q.push(['혼 켈베로스',{
 detail(B,K){const g=W3_Qg(B),{h,L,bw,ny,R0,headUp,jaw,t,mode,f}=g,sk='#2a1410',s=B.s,fc='255,110,30';
  for(let hi=0;hi<3;hi++){const off=(hi-1)*5*bw,ang2=(hi-1)*.35,hd=[off,g.front[1]+4+(s.neckL||2)-headUp*2,h+5+headUp*7+(s.headZ||0)],r=(s.headR||4.3)*bw,fwd=W3_n(Math.sin(ang2),Math.cos(ang2)*(1-headUp*.3),headUp*.6),sd=[Math.cos(ang2),-Math.sin(ang2),0];
    const tip=W3_a(W3_a(hd,fwd,r*2.6),[0,0,-r*.25]),Hp=(x,y,z)=>W3_a(W3_a(W3_a(hd,sd,x*r),fwd,y*r),[0,0,z*r]);
    // 뿔(마디 띠)
    for(const g2 of[-1,1]){const a=Hp(.4*g2,-.3,.6),b=Hp(1.1*g2,-1.1,1.5),c=Hp(1.3*g2,-.4,2.2);B.cap(a,b,r*.36,'#d8b878',{w1:r*.24,d:-.03});B.cap(b,c,r*.24,'#e0c080',{w1:r*.04,d:-.03});for(const tt of[.3,.6,.9])B.ball(W3_m(a,b,tt),r*.3*(1-tt*.3),'#9a7a48',{sy:.45,d:-.04});
      B.cap(Hp(.55*g2,.45,.42),Hp(.1*g2,.85,.35),r*.2,'#140806',{d:-.08});}
    B.cap(Hp(0,.45,-.1),Hp(0,2.4,-.3),r*.62,W3_T(sk,.1),{w1:r*.38,d:-.06});B.ball(Hp(0,2.55,-.2),r*.2,'#0a0404',{d:-.1});
    for(let i=0;i<4;i++)for(const g2 of[-1,1])B.cap(Hp(.28*g2,1.1+i*.36,-.4),Hp(.27*g2,1.12+i*.36,-.72-(i===0?.2:0)-jaw*.3),r*.08,'#f4ecd6',{w1:r*.01,d:-.11});
    if(jaw>.3||mode==='idle')B.glow(Hp(0,2.2,-.6),1.6+jaw*1.4,fc,.4+jaw*.4);
    // 불꽃 갈기
    for(let i=0;i<5;i++){const ph=((t/400)+i/5+hi*.3)%1,b=Hp((i-2)*.3,-.6-i*.05,.6);B.cap(b,W3_a(b,[Math.sin(t/150+i)*.6,-1.4-ph*1.6,2.6+ph*2.6]),1.6*bw,i%2?'#ff6020':'#ffa030',{w1:.2,alpha:.85-ph*.5,d:.02});}
    B.glow(Hp(0,-.6,.9),3,fc,.35);}
  // 가시 목줄(가운데 목)
  {const nk=W3_m([0,g.front[1]+2,h+3+headUp*3],[0,g.front[1]+4+(s.neckL||2)-headUp*2,h+5+headUp*7],.3);for(let i=0;i<12;i++){const a=i/12*6.283,q=W3_a(nk,[Math.cos(a)*7*bw,Math.sin(a)*1.6,Math.sin(a)*2.6]);B.ball(q,.8,'#3a3a40',{d:-.05});if(i%2)B.cap(q,W3_a(q,[Math.cos(a)*1.8,Math.sin(a)*.6,Math.sin(a)*1.4+.4]),.6,'#c8ccd0',{w1:.1,d:-.06});}}
  // 몸 근육 결·갈비 그림자·불타는 금
  for(const sx of[-1,1]){for(let i=0;i<4;i++)B.line([[sx*R0*.95,L*(.2-i*.1)+ny*.8,h+R0*.9],[sx*R0*1.0,L*(.17-i*.1)+ny*.8,h+R0*.1]],'#140806',.5,{d:-.25});B.line([[sx*R0*.8,-L*.3+ny*.5,h+R0],[sx*R0*.95,-L*.1+ny*.6,h+R0*.5],[sx*R0*.9,L*.05+ny*.7,h+R0*.2]],'#ff6020',.4,{d:-.27});}
  for(let i=0;i<6;i++)B.cap([0,-L*.45+i*L*.15+ny*.6,h+1+R0*.95],[0,-L*.45+i*L*.15-1.4+ny*.6,h+3.6+R0],1.1,'#4a2a20',{w1:.15,d:-.3});
  for(const lg of g.legs){for(let i=-1;i<=1;i++)B.cap(W3_a(lg.ft,[i*.8,.8,.3]),W3_a(lg.ft,[i*1,2,-.2]),.5,'#e8dcc0',{w1:.1,d:-.08});B.ball(lg.kn,1.6*bw,'#3a1c14',{d:-.06});}
  {const tp=W3_qTail(B,g),e=tp[tp.length-1];for(let i=0;i<4;i++){const ph=((t/350)+i/4)%1;B.cap(e,W3_a(e,[Math.sin(t/130+i)*1,-1-ph*2,2+ph*3]),1.8,i%2?'#ff6020':'#ffb040',{w1:.2,alpha:.9-ph*.5,d:.02});}B.glow(e,3,fc,.5);}
  for(let i=0;i<6;i++){const ph=((t/1200)+i/6)%1;B.glow([Math.sin(i*2.4)*R0*1.4,-L*.4+i*L*.15,h+R0+ph*14],1,fc,(1-ph)*.8);}}}]);

// 111. 폭탄 꽃 — 쇠테 두른 폭탄 씨방·리벳·꼰 심지 불똥·뾰족 이중 꽃잎(잎맥)·가시 줄기·톱니 잎·뿌리 발톱
Q.push(['폭탄 꽃',{
 detail(B,K){const g=W3_Og(B),{r,lunge,mode,f,t,pulse}=g,sway=Math.sin(t/500+f)*1.2,bz=[sway,lunge,r*1.7],pc='#e05a8a',sk='#3a3a3a';
  // 꽃잎(뾰족, 두 겹, 잎맥)
  for(let k=0;k<2;k++)for(let i=0;i<6;i++){const a=i/6*6.283+k*.52+(mode==='buff'?f*.3:0),dir=[Math.cos(a),Math.sin(a),0],side=[-Math.sin(a),Math.cos(a),0],R=r*(k?1.15:1.35),lift=k?.5:-.3+(mode==='skill'?f*.2:0);
    const b0=W3_a(bz,dir,r*.35),tp=W3_a(W3_a(bz,dir,R),[0,0,lift+r*.25]);const col=k?W3_T(pc,.15):W3_T(pc,-.1);
    B.poly([b0,W3_a(W3_a(W3_m(b0,tp,.5),side,r*.3),[0,0,lift*.5]),tp,W3_a(W3_a(W3_m(b0,tp,.5),side,-r*.3),[0,0,lift*.5])],col,{grad:1,edge:W3_T(pc,-.5),ew:.35,d:k?.02:.12});
    B.line([b0,W3_m(b0,tp,.85)],W3_T(pc,-.35),.3,{d:k?.01:.11});}
  // 폭탄 씨방: 쇠테·리벳·광택
  const R0=r*(.55+pulse);B.ball(bz,R0*1.02,sk,{glow:mode==='skill'?'255,150,60':null,d:-.02});B.cap(W3_a(bz,[-R0,0,0]),W3_a(bz,[R0,0,0]),R0*.3,'#5a5a60',{d:-.04});B.cap(W3_a(bz,[0,-R0*.95,0]),W3_a(bz,[0,R0*.95,0]),R0*.22,'#5a5a60',{d:-.04});
  for(let i=0;i<6;i++){const a=i/6*6.283;B.ball(W3_a(bz,[Math.cos(a)*R0*.98,Math.sin(a)*R0*.98,0]),.4,'#b8b8c0',{d:-.06});}B.ball(W3_a(bz,[-R0*.35,R0*.3,R0*.45]),R0*.22,'#ffffff',{flat:1,alpha:.35,d:-.07});
  // 해골 표식 + 심지
  B.ball(W3_a(bz,[0,R0*.9,R0*.15]),R0*.28,'#e8e0d0',{flat:1,d:-.08});for(const g2 of[-1,1])B.ball(W3_a(bz,[g2*R0*.1,R0*.95,R0*.2]),R0*.07,'#1a1a1a',{flat:1,d:-.09});
  {let a=W3_a(bz,[0,0,R0*.9]);for(let i=1;i<=4;i++){const b=W3_a(bz,[Math.sin(i+t/400)*.6,-i*.3,R0*.9+i*1]);B.cap(a,b,.75,i%2?'#8a6a3a':'#6a4a2a',{d:-.05});a=b;}
    const sp=mode==='skill'?2.2:1;B.spark(a,2.6*sp+Math.sin(t/60)*.6,'255,180,60',.95);for(let i=0;i<4;i++){const ph=((t/300)+i/4)%1;B.glow(W3_a(a,[Math.sin(i*2.5)*ph*3,Math.cos(i*1.7)*ph*3,ph*4]),.6,'255,200,90',(1-ph));}}
  // 줄기 가시·잎맥·뿌리 발톱
  for(let i=0;i<4;i++){const z=r*.25+i*r*.28,q=[sway*z/(r*1.4),lunge*.5*z/(r*1.4),z],sg=i%2?1:-1;B.cap(q,W3_a(q,[sg*1.4,.2,.6]),.6,'#a0c070',{w1:.08,d:-.03});}
  for(const g2 of[-1,1]){B.line([[0,.6,r*.4],[g2*r*.6,.9,r*.55]],'#2a5a1a',.35,{d:-.05});for(let i=0;i<3;i++)B.cap([g2*r*(.3+i*.2),1,r*(.48+i*.06)],[g2*r*(.36+i*.2),1.3,r*(.62+i*.06)],.4,'#5aaa4a',{w1:.05,d:-.05});}
  for(let i=0;i<5;i++){const a=i/5*6.283+.3;B.cap([0,0,.6],[Math.cos(a)*3.4,Math.sin(a)*3.4,0],.9,'#5a4a2a',{w1:.2,d:.05});}
  if(mode==='attack'&&f===1)B.spark(W3_a(bz,[0,r*1.2,0]),6,'255,160,60',.9);}}]);

// 114. 아시타지오 — 마왕: 보라 룬 흑철 갑옷·가시 견갑·뼈대 박쥐 날개·해골 허리장식·송곳니 얼굴·해골 머리 지팡이
Q.push(['아시타지오',{
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,{mode,f,t}=B,ar='#2a1a3a',rn='#c080ff',rg='190,120,255';
  W3_breast(B,W,'#3a2a4a',{back:1,riv:'#c0a040',edge:'#0e0814'});
  for(const g of[-1,1])B.line([[g*1.2*bw,6.6*bw,W.sh-3],[g*3.6*bw,6.3*bw,W.sh-6],[g*1.6*bw,6.6*bw,W.sh-9],[g*3*bw,6.4*bw,H+4]],rn,.5,{d:-.33});B.ball([0,6.9*bw,W.sh-5],1.3,'#d0a0ff',{glow:rg,d:-.36});
  W3_belt(B,W,'#1a1028',{tasset:'#3a2a4a',buckle:'#c0a040',riv:'#c0a040'});
  B.ball([0,6.2*bw,H+1.6],1.8,'#e6dcc4',{d:-.4});for(const g of[-1,1])B.ball([g*.7,6.9*bw,H+1.9],.5,'#2a0a3a',{flat:1,glow:rg,d:-.44});
  for(const sg of[-1,1]){W3_paul(B,W,sg,'#3e2e50',{r:5,rim:'#c0a040',riv:'#c0a040',spikes:3,spikeC:'#d0c0a0'});W3_bracer(B,W,sg,'#2a1a3a',{band:'#c0a040',stud:'#d0c0a0',w:4.6});W3_greave(B,W,sg,'#2e2040',{knee:'#4a3a5a',strap:'#140a1e'});
    const h=W.h(sg);for(let i=-1;i<=1;i++)B.cap(W3_a(h,[i*.7,.6,.2]),W3_a(h,W3_n(i*.4,.8,-.5),3.8),.7,'#d8c8b0',{w1:.1,d:-.1});}
  // 날개 뼈대·막 주름·발톱
  {const fl=Math.sin(f*1.6+(mode==='run'?1:0)+t/250)*4+(mode==='buff'?6:0);for(const sg of[-1,1]){const r0=[5*sg*bw,-3,sh-2],a=[18*sg*bw,-8,sh+8+fl],b=[24*sg*bw,-10,sh-2+fl],c=[16*sg*bw,-7,H-2+fl*.5],d0=[8*sg*bw,-4,H+2];
    B.cap(r0,a,1.6,'#4a3a5a',{w1:1.1,d:.45});B.cap(a,b,1,'#4a3a5a',{w1:.3,d:.45});B.cap(a,c,.8,'#4a3a5a',{w1:.3,d:.46});B.cap(a,d0,.7,'#4a3a5a',{w1:.3,d:.46});B.cap(a,W3_a(a,[sg*.6,0,2.2]),.9,'#d8c8b0',{w1:.1,d:.44});
    B.line([b,W3_a(W3_m(b,c),[0,1,1.2]),c,W3_a(W3_m(c,d0),[0,1,1]),d0],'#100818',.5,{d:.47});}}
  // 얼굴: 눈두덩·송곳니·이마 보석·뺨 룬
  for(const g of[-1,1]){B.cap(P(.6*g,.82,.45),P(.12*g,.95,.3),hr*.16,'#1a0e24',{d:-.09});B.cap(P(.25*g,.92,-.5),P(.28*g,.96,-.85),hr*.09,'#f4ecd8',{w1:hr*.02,d:-.11});B.line([P(.6*g,.75,0),P(.42*g,.85,-.4)],rn,.45,{d:-.1});}
  B.ball(P(0,.95,.62),hr*.14,'#e0a0ff',{glow:rg,d:-.1});B.cap(P(-.4,.9,-.5),P(.4,.9,-.5),hr*.08,'#100818',{d:-.1});
  // 지팡이: 뒤틀린 흑목·해골 받침·보라 보주
  W3_staff(B,W,{wood:'#2a1a2a',orb:'#b060ff',fx:rg,wrap:'#c0a040',claw:'#d8c8b0',charm:'#c0a040'});
  {const h=W.p.hR,d=W.p.dS,pt=k=>W3_a(h,d,k);B.ball(pt(12.6),1.8,'#e6dcc4',{d:-.09});for(const g of[-1,1])B.ball(W3_a(pt(12.6),[g*.6,.9,.3]),.45,'#2a0a3a',{flat:1,glow:rg,d:-.12});}
  for(let i=0;i<5;i++){const ph=((t/1000)+i/5)%1;B.glow([Math.sin(i*2.2)*7,-4+Math.cos(i)*3,ph*10+2],1.2,rg,(1-ph)*.6);}}}]);

// 117. 샤벨 타이거 — 굵은 검기 송곳니·호랑이 줄무늬(몸·다리·꼬리)·흰 뺨털·근육 어깨·발톱·수염
Q.push(['샤벨 타이거',{stripes:null,
 detail(B,K){const g=W3_Qg(B),{h,L,bw,ny,R0,hd,r,fwd,tip,jaw,t}=g,sk='#d09040',bk='#2a1a10',wh='#f0e0c0';
  // 줄무늬(등에서 옆구리로 휜 띠)
  for(let i=0;i<7;i++){const y=-L*.45+i*L*.14+ny*.7;for(const sx of[-1,1]){B.line([[0,y,h+1+R0*1.0],[sx*R0*.55,y-.4,h+1+R0*.85],[sx*R0*.92,y+.3,h+1+R0*.35],[sx*R0*.98,y-.2,h+1-R0*.05]],bk,1.1-i*.05,{d:-.28});}}
  for(const sx of[-1,1])B.ball([sx*R0*.75,L*.38+ny,h+R0*.7],R0*.55,W3_T(sk,.06),{sy:.75,d:-.2});
  B.ball([0,L*.3+ny,h-R0*.4],R0*.75,wh,{sy:.6,d:-.12});
  for(const lg of g.legs){for(let i=0;i<2;i++){const q=W3_m(lg.top,lg.kn,.4+i*.35);B.cap(W3_a(q,[-1.8*bw,0,0]),W3_a(q,[1.8*bw,0,0]),.8,bk,{d:-.08});}B.ball(lg.ft,1.9*bw,wh,{sy:.6,d:-.07});for(let i=-1;i<=1;i++)B.cap(W3_a(lg.ft,[i*.8,1,.3]),W3_a(lg.ft,[i*.9,2.1,-.1]),.45,'#f4ecd8',{w1:.08,d:-.09});}
  {const tp=W3_qTail(B,g);for(let i=1;i<tp.length;i++){const q=tp[i];B.cap(W3_a(q,[-1.3,0,0]),W3_a(q,[1.3,0,0]),.9,bk,{d:-.05});}W3_fur(B,tp[tp.length-1],3,2,bk,{dir:[0,-.7,-.4],sp:1,sx:1,w:1.2,d:-.06});}
  // 머리: 흰 주둥이·뺨털·눈두덩·이마 줄·귀 안쪽·수염·큰 송곳니
  B.cap(W3_a(hd,fwd,r*.6),W3_a(tip,[0,0,-r*.1]),r*.78,wh,{w1:r*.5,d:-.07});B.ball(tip,r*.26,'#2a1410',{d:-.1});
  for(const s2 of[-1,1]){W3_fur(B,W3_a(hd,[s2*r*.85,r*.2,-r*.2]),3,r*.7,wh,{dir:[s2*.8,-.3,-.4],sp:r*.6,sx:0,sy:1,w:1.3,d:-.06});
    const e=W3_a(W3_a(hd,fwd,r*.62),[s2*r*.52,0,r*.28]);B.cap(W3_a(e,[s2*r*.3,-r*.2,r*.3]),W3_a(e,[-s2*r*.1,r*.3,r*.2]),r*.16,bk,{d:-.09});B.ball(W3_a(e,[0,r*.05,0]),r*.08,'#100',{flat:1,d:-.1});
    for(let i=0;i<3;i++)B.line([W3_a(tip,[s2*r*.3,-r*.2,-r*.05+i*r*.1]),W3_a(tip,[s2*r*1.5,-r*.4,-r*.1+i*r*.3])],'rgba(255,255,255,.8)',.25,{d:-.11});
    const ec=W3_a(hd,[s2*r*.6,-r*.3,r*.9]);B.ball(ec,r*.18,'#3a2010',{flat:1,d:-.05});
    // 송곳니: 굵고 길게, 홈
    const a=W3_a(W3_a(hd,fwd,r*(.9+1.6*.6)),[s2*r*.32,0,-r*.3]),b=W3_a(W3_a(hd,fwd,r*(.75+1.6*.6)),[s2*r*.32,0,-r*2.1-jaw*r*.3]);B.cap(a,b,r*.3,'#f6eedc',{w1:r*.06,d:-.12});B.line([W3_a(a,[s2*-.1,.15,-.2]),W3_a(b,[s2*-.05,.1,.5])],'#c8b890',.3,{d:-.13});}
  for(let i=0;i<3;i++)B.line([W3_a(hd,[-r*.05*(i-1)*3,r*.2,r*.95]),W3_a(hd,[-r*.08*(i-1)*3,-r*.4,r*.85])],bk,.6,{d:-.08});}}]);

// 120. 좀비 엘모어 장군 — 썩은 장군: 녹슨 금테 판금·찢긴 장군 망토·훈장·드러난 갈비·부패 얼굴(턱 늘어짐)·투구 깃·이빠진 장검·문장 방패
Q.push(['좀비 엘모어 장군',{pads:null,
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,t=B.t,ar='#5a5040',ru='#7a4a2a',gold='#a08a40',sk='#7a8a6a';
  W3_breast(B,W,'#5e5444',{back:1,riv:'#8a7a50',edge:'#1a160e'});
  // 갑옷 구멍 사이 갈비뼈 + 녹 얼룩
  B.ball([3*bw,6.6*bw,sh-7],2.6,'#2a1a14',{flat:1,sy:1.3,d:-.3});for(let i=0;i<3;i++)B.cap([1.6*bw,6.7*bw,sh-5.6-i*1.4],[4.4*bw,6.6*bw,sh-6-i*1.4],.6,'#d8d0b8',{d:-.32});
  for(const[x,z,r]of[[-3,-3,1.6],[-4,-10,1.3],[2,-11,1.1],[5,-3,1]])B.ball([x*bw,6.65*bw,sh+z],r,ru,{flat:1,alpha:.7,d:-.31});
  for(let i=0;i<3;i++)B.ball([(-4+i*1.4)*bw,6.7*bw,sh-3.4],.6,i===1?'#b02020':gold,{d:-.34});B.cap([-6.8*bw,6.4*bw,sh-1.4],[0,6.9*bw,H+3],1,'#6a1a1a',{d:-.33});
  W3_belt(B,W,'#2a2018',{tasset:'#5a5040',buckle:gold,riv:'#8a7a50'});
  for(const sg of[-1,1]){W3_paul(B,W,sg,'#6a6050',{r:4.8,rim:gold,riv:'#8a7a50',spikes:sg>0?2:0,spikeC:'#8a8070'});W3_bracer(B,W,sg,'#4a4030',{stud:'#8a7a50'});W3_greave(B,W,sg,'#5a5040',{strap:'#2a2018',knee:'#6a6050'});
    const sp=W.sp(sg);for(let i=0;i<3;i++)B.cap(W3_a(sp,[sg*(i-1)*1.6,1.6,-2]),W3_a(sp,[sg*(i-1)*1.8,2,-4.4-i*.4]),.5,gold,{w1:.3,d:-.36});}
  // 찢긴 망토 자락(뒤)
  for(let i=0;i<5;i++){const x=(i-2)*3.2*bw,z=3+(i%2)*2.4+Math.sin(i*2.3);B.poly([[x-1.6*bw,-5-W.p.cape,z+3],[x+1.6*bw,-5-W.p.cape,z+3],[x+.4,-5.6-W.p.cape*1.2,z-1.5],[x-.8,-5.4-W.p.cape*1.2,z]],'#3a1e1e',{d:.25});}
  // 얼굴: 꺼진 눈·늘어진 턱·드러난 이·꿰맨 자국
  B.ball(P(.3,.82,.15),hr*.3,'#1a1410',{flat:1,d:-.07});B.ball(P(.3,.9,.15),hr*.14,'#c0ff60',{flat:1,glow:'170,255,90',d:-.09});
  B.poly([P(-.5,.82,-.35),P(.45,.82,-.35),P(.35,.8,-.95),P(-.3,.8,-.9)],'#2a0a08',{d:-.09});for(let i=-2;i<=2;i++)B.cap(P(i*.17,.88,-.35),P(i*.17,.88,-.5),hr*.07,'#d8d0a8',{d:-.11});
  B.line([P(-.7,.7,.5),P(-.45,.82,.1),P(-.6,.75,-.2)],'#3a2a1a',.4,{d:-.1});for(let i=0;i<3;i++)B.line([P(-.7+i*.1,.72,.35-i*.2),P(-.48+i*.1,.8,.38-i*.2)],'#3a2a1a',.3,{d:-.11});
  W3_orcHelm(B,W,'#6a6050',{});for(let i=0;i<6;i++)B.cap(P(0,.4-i*.35,1.05-i*.04),P(0,.1-i*.45,1.55-i*.18),hr*.26,i%2?'#5a1a1a':'#7a2a22',{w1:hr*.06,d:0});
  W3_sword(B,W,{blade:'#9a9a90',guard:gold,wrap:'#3a2a1a',len:23});
  {const h=W.p.hR,d=W.p.dS,pp=W3_perp(d);for(const k of[9,15])B.poly([W3_a(W3_a(h,d,k),pp,1.4),W3_a(W3_a(h,d,k+1.2),pp,.4),W3_a(W3_a(h,d,k+2),pp,1.4)],'#4a5a3a',{d:-.11});B.ball(W3_a(W3_a(h,d,12),pp,-.8),.7,ru,{flat:1,d:-.11});}
  W3_shield(B,W,{face:'#4a2020',rim:'#6a6050',boss:gold,emblem:(Pp,r)=>{B.poly([Pp(1.57,r*.72,.4),Pp(.3,r*.3,.4),Pp(0,r*.72,.4),Pp(-.3,r*.3,.4),Pp(-1.57,r*.72,.4),Pp(3.14,r*.5,.4)],gold,{d:-.69,alpha:.8});}});
  for(let i=0;i<4;i++){const ph=((t/1300)+i/4)%1;B.ball([Math.sin(i*2)*5,1+Math.cos(i*3)*3,H*.3+ph*20],1.1+ph*1.5,'#8aaa50',{alpha:(1-ph)*.35,d:.1});}}}]);

// 123. 아이스 맨 — 얼음 거인: 각진 얼음 결정 판·속이 비치는 푸른 핵·서리 가시 등·고드름 수염·얼음 발톱·차가운 김
Q.push(['아이스 맨',{
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,t=B.t,f=B.f,ic='#c8e8f8',dp='#80b8e0';
  const shard=(c,dir,len,w,col,d)=>{const pp=W3_perp(W3_n(...dir));B.poly([W3_a(c,pp,-w),W3_a(c,dir,len),W3_a(c,pp,w),W3_a(c,dir,-len*.25)],col,{grad:1,edge:'#ffffff',ew:.35,d});};
  // 가슴 결정판 + 핵
  B.ball([0,5.6*bw,sh-6],2.4*bw,'#e0fbff',{glow:'170,230,255',alpha:.9,d:-.22});
  for(const[x,z,a]of[[-4.2,-2.4,.3],[4.2,-2.4,-.3],[-3.4,-9,-.2],[3.4,-9,.2],[0,-12.6,0],[-5.6,-6,.5],[5.6,-6,-.5]])shard([x*bw,6*bw,sh+z],[Math.sin(a),0,Math.cos(a)],3.2,2*bw,(x*z)>0?ic:dp,-.25);
  for(let i=0;i<6;i++)shard([(i%3-1)*3.4*bw,-5*bw,sh-2-(i>2?6:0)],W3_n((i%3-1)*.4,-.7,.7),4.4,1.3,i%2?ic:'#e8f8ff',.25);
  for(const sg of[-1,1]){const sp=W.sp(sg),el=W.el(sg),h=W.h(sg),kn=W.kn(sg),ft=W.ftp(sg);
    for(let i=0;i<3;i++)shard(W3_a(sp,[sg*(i*1.2),0,1.6]),W3_n(sg*(.3+i*.3),-.2,1),3.6-i*.6,1.1,i%2?ic:'#e8f8ff',-.3);
    shard(W3_m(el,h,.5),W3_n(sg,.2,.2),2.6,1.4,dp,-.1);shard(W3_a(W3_m(kn,ft,.5),[0,1.6,0]),[0,.4,1],3,1.6,ic,-.12);
    for(let i=-1;i<=1;i++)B.cap(h,W3_a(h,W3_n(i*.4,.8,-.4),4.6),.9,'#f0fcff',{w1:.08,d:-.11});}
  // 머리: 서리 머리칼 결정·눈두덩·고드름 수염
  for(let i=0;i<7;i++){const a=(i/6-.5)*2.4;shard(P(Math.sin(a)*.7,-.2,.75),W3_n(Math.sin(a)*.6,-.5,1),hr*.9,hr*.22,i%2?'#e8f8ff':ic,-.02);}
  B.cap(P(-.62,.82,.4),P(.62,.82,.4),hr*.2,dp,{d:-.08});for(let i=0;i<5;i++)B.cap(P((i-2)*.2,.9,-.4),P((i-2)*.22,.95,-1.1-(i%2)*.4),hr*.14,'#e8f8ff',{w1:hr*.02,d:-.11});
  for(let i=0;i<5;i++){const ph=((t/1100)+i/5+f*.1)%1;B.ball([Math.sin(i*2.4)*7,3+Math.cos(i)*3,H-6+ph*24],1.2+ph*2,'#e8f8ff',{alpha:(1-ph)*.3,d:-.1});}
  if(B.mode==='attack'&&f===1)for(let i=0;i<5;i++)shard([Math.sin(i)*4,14+i*1.5,H+8-i*2],[0,1,.2],2,.8,'#f0fcff',-.5);}}]);

// 126. 도펠갱어 — 변신 괴물: 흘러내리는 보라 점액 피부·무너진 반쪽 얼굴(다른 얼굴이 비침)·늘어난 발톱 팔·몸에 박힌 눈·찢어진 입
Q.push(['도펠갱어',{
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,t=B.t,f=B.f,sk='#6a4a8a',dk='#3a1a5a';
  // 흐르는 점액(몸·팔에서 아래로)
  for(let i=0;i<8;i++){const ph=((t/1600)+i/8)%1,x=(i%4-1.5)*3*bw,y=i<4?5*bw:-5*bw;B.cap([x,y,sh-2-i%3*2],[x,y*1.05,sh-6-ph*8-i%3*2],1.3-ph*.6,'#8a6aaa',{w1:.6,alpha:.85,d:i<4?-.25:.25});B.ball([x,y*1.06,sh-6-ph*8-i%3*2],.7,'#9a7aba',{alpha:1-ph*.6,d:i<4?-.26:.26});}
  B.ball([0,5.6*bw,sh-7],5*bw,dk,{sy:.55,alpha:.55,d:-.2});
  // 몸에 박힌 눈들
  for(const[x,z,r]of[[-3,-4,1],[3.4,-8,.8],[-1.6,-11,.7],[4.2,-3,.6]]){const q=[x*bw,6.1*bw,sh+z];B.ball(q,r*1.3,'#2a1040',{flat:1,d:-.26});B.ball(q,r,'#f0e8ff',{d:-.27});B.ball(W3_a(q,[0,.2,0]),r*.45,'#a040ff',{flat:1,glow:r>.8?'200,140,255':null,d:-.28});}
  for(const sg of[-1,1]){const el=W.el(sg),h=W.h(sg);B.cap(W3_m(el,h,.3),W3_m(el,h,.8),3*bw,'#7a5a9a',{w1:2.2*bw,d:-.07});for(let i=-1;i<=1;i++){const a=W3_a(h,W3_n(i*.4,.8,-.3),2),b=W3_a(h,W3_n(i*.5,.9,-.6),6.6);B.cap(h,a,.9,'#3a1a4a',{w1:.6,d:-.1});B.cap(a,b,.6,'#e8e0f0',{w1:.06,d:-.11});}
    const sp=W.sp(sg);for(let i=0;i<3;i++)B.ball(W3_a(sp,[sg*i*.6,-.6,1.2+i*.4]),1.6-i*.3,i%2?sk:'#7a5a9a',{alpha:.9,d:-.2});}
  // 얼굴: 반쪽은 녹아내린 살, 반쪽은 사람 얼굴(살빛) — 찢어진 입
  B.ball(P(-.35,.62,.05),hr*.66,'#d8a890',{sx:.9,d:-.04});B.ball(P(-.38,.95,.18),hr*.12,'#2a2030',{flat:1,d:-.08});B.cap(P(-.62,.82,.42),P(-.15,.88,.36),hr*.08,'#4a3020',{d:-.08});
  for(let i=0;i<4;i++)B.cap(P(.1+i*.18,.88,.2-i*.12),P(.12+i*.2,.86,-.4-i*.3-Math.sin(t/400+i)*.15),hr*.16,i%2?sk:'#8a6aaa',{w1:hr*.06,alpha:.9,d:-.07});
  B.poly([P(-.4,.92,-.38),P(.7,.85,-.3),P(.55,.82,-.72),P(-.25,.88,-.6)],'#1a0820',{d:-.1});for(let i=0;i<6;i++)B.cap(P(-.3+i*.18,.92,-.36),P(-.3+i*.18,.92,-.5),hr*.06,'#f0e8d8',{w1:hr*.01,d:-.12});
  for(let i=0;i<4;i++){const ph=((t/900)+i/4+f*.1)%1;B.glow([Math.sin(i*2)*6,-2+Math.cos(i)*3,H+ph*20],1.4,'200,140,255',(1-ph)*.5);}}}]);

// 129. 산적 — 가죽 조끼·붉은 두건·얼굴 복면 천·어깨 가죽패드·탄띠(단도)·허리 주머니·흉터·넓은 곡도
Q.push(['산적',{helm:null,
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,y=6*bw,lt='#5a3a20',rd='#8a2a22';
  B.poly([[-7.6*bw,y-1.3,sh-1],[-1.4*bw,y-.4,sh-1],[-1.8*bw,y,H+3],[-6*bw,y-.4,H+3]],lt,{grad:1,edge:'#1a0e06',ew:.5,d:-.25});B.poly([[7.6*bw,y-1.3,sh-1],[1.4*bw,y-.4,sh-1],[1.8*bw,y,H+3],[6*bw,y-.4,H+3]],lt,{grad:1,edge:'#1a0e06',ew:.5,d:-.25});
  for(let i=0;i<4;i++)for(const g of[-1,1])B.cap([g*1.4*bw,y,sh-3-i*3],[g*2.2*bw,y,sh-3.6-i*3],.4,'#c8b080',{d:-.3});
  B.poly([[-7*bw,-y+1.6,sh-1],[7*bw,-y+1.6,sh-1],[5.6*bw,-y+.6,H+3],[-5.6*bw,-y+.6,H+3]],lt,{grad:1,edge:'#1a0e06',ew:.5,d:.25});
  // 탄띠(단도)
  for(let i=0;i<7;i++){const q=W3_m([-7.4*bw,y-.5,sh-.5],[6.2*bw,y+.5,H+2],i/6);B.ball(q,.9,'#3a2414',{sx:1.3,d:-.36});if(i%2)B.cap(q,W3_a(q,[.2,.3,2.2]),.7,'#a8aeb4',{w1:.2,d:-.37});}
  W3_belt(B,W,'#3a2410',{pouch:'#6a4a2a',buckle:'#a88a48'});B.ball([5.6*bw,3.2*bw,H-.6],1.6,'#7a5a30',{sy:1.2,d:-.3});
  for(const sg of[-1,1]){const sp=W.sp(sg);B.ball(W3_a(sp,[0,0,1]),3.4*bw,'#4a2e18',{sy:.7,d:-.33});W3_riv(B,[W3_a(sp,[0,2.4,1.2])],'#c8b080',.45,-.36);W3_bracer(B,W,sg,'#4a2e18',{band:'#2a1a0c',stud:'#c8b080'});
    const kn=W.kn(sg),f=W.ftp(sg);for(const tt of[.5,.75])B.cap(W3_m(kn,f,tt),W3_m(kn,f,tt+.05),5*bw,'#3a2414',{d:-.1});}
  // 두건·복면·흉터
  B.ball(P(0,-.1,.38),hr*1.06,rd,{sy:.72,d:-.03});B.cap(P(-.2,-1,.3),P(-.6,-1.9,-.6),hr*.3,rd,{w1:hr*.15,d:.05});B.cap(P(.1,-1,.3),P(.3,-1.8,-.9),hr*.26,W3_T(rd,-.15),{w1:hr*.12,d:.05});B.ball(P(0,-1,.25),hr*.3,W3_T(rd,-.2),{d:.04});
  B.poly([P(-.9,.6,-.05),P(.9,.6,-.05),P(.85,.75,-.6),P(0,.98,-1),P(-.85,.75,-.6)],'#4a3a2a',{grad:1,edge:'#1a120a',ew:.4,d:-.1});
  B.cap(P(-.6,.82,.45),P(.6,.82,.45),hr*.15,'#3a2a1a',{d:-.09});B.line([P(.55,.78,.6),P(.4,.85,.05)],'#8a3a2a',.45,{d:-.11});
  // 곡도(넓은 휜 날)
  {const h=W.p.hR,d=W.p.dS,pt=k=>W3_a(h,d,k),pp=W3_perp(d);B.cap(pt(-3.6),pt(2),2.1,'#2a1a10',{d:-.05});for(let i=0;i<4;i++)B.cap(pt(-3+i*1.3),pt(-2.5+i*1.3),2.4,'#6a4a2a',{d:-.06});B.ball(pt(-4.3),1.3,'#a88a48',{d:-.06});
    B.cap(W3_a(pt(2.2),pp,-3),W3_a(pt(2.2),pp,3),1.3,'#a88a48',{d:-.07});
    B.poly([W3_a(pt(2.6),pp,-1.3),W3_a(pt(2.6),pp,1.3),W3_a(pt(12),pp,2.6),W3_a(pt(19),pp,3.2),W3_a(pt(21.5),pp,1.4),W3_a(pt(14),pp,-.9)],'#c0c6cc',{grad:1,edge:'#4a4e54',ew:.45,d:-.08});
    B.line([W3_a(pt(3),pp,1),W3_a(pt(12),pp,2.3),W3_a(pt(19),pp,2.9)],'#ffffff',.35,{d:-.1});}}}]);

// 132. 공포의 나이트메어 — 지옥 말: 불꽃 갈기·불타는 발굽·뒤틀린 뿔·해골 같은 얼굴(드러난 이)·갈비뼈 자국·가죽 마구·코 연기
Q.push(['공포의 나이트메어',{
 detail(B,K){const g=W3_Qg(B),{h,L,bw,ny,R0,hd,r,fwd,tip,jaw,t,mode,f,headUp}=g,fc='255,60,20';
  // 불꽃 갈기(목 따라)
  const nk0=[0,g.front[1]+2,h+3+headUp*3];for(let i=0;i<8;i++){const ph=((t/380)+i/8)%1,c=W3_m(nk0,hd,i/8);B.cap(W3_a(c,[0,-.6,r*.7]),W3_a(c,[Math.sin(t/140+i)*.8,-2.4-ph*2,r*.7+2.4+ph*2.4]),1.8*bw,i%2?'#d03010':'#ff7020',{w1:.2,alpha:.9-ph*.4,d:-.02});}
  B.glow(W3_m(nk0,hd,.5),4,fc,.35);
  // 꼬리 불꽃
  {const tp=W3_qTail(B,g);for(let i=1;i<tp.length;i++){const ph=((t/300)+i/5)%1;B.cap(tp[i],W3_a(tp[i],[Math.sin(t/120+i)*.6,-1.4-ph,1+ph*2]),1.6,i%2?'#d03010':'#ff8030',{w1:.2,alpha:.85-ph*.4,d:.03});}}
  // 발굽 불꽃 + 발굽
  for(const lg of g.legs){B.ball(W3_a(lg.ft,[0,.3,.6]),1.8*bw,'#0a0608',{sy:.8,d:-.07});const ph=((t/250)+lg.sx*.3+lg.sy*.2)%1;B.cap(W3_a(lg.ft,[0,0,.5]),W3_a(lg.ft,[0,-.6-ph,2+ph*2.4]),2,'#ff5010',{w1:.2,alpha:.8-ph*.4,d:-.08});B.glow(lg.ft,2.2,fc,.45);}
  // 갈비뼈 자국·마구
  for(const sx of[-1,1]){for(let i=0;i<4;i++)B.line([[sx*R0*.9,L*(.1-i*.1)+ny*.8,h+R0*.85],[sx*R0*1.0,L*(.06-i*.1)+ny*.8,h+R0*.1]],'#3a1a1a',.6,{d:-.26});
    B.line([[sx*R0*.95,-L*.2+ny*.6,h+R0*.6],[sx*R0*.95,L*.3+ny*.8,h+R0*.6]],'#5a1a14',.4,{d:-.27});}
  B.cap([-R0*1.02,L*.05+ny*.8,h+R0*.2],[R0*1.02,L*.05+ny*.8,h+R0*.2],1.2,'#3a2a20',{d:-.25});B.poly([[-R0*.9,-L*.2+ny*.6,h+R0*1.05],[R0*.9,-L*.2+ny*.6,h+R0*1.05],[R0,L*.15+ny*.8,h+R0*.6],[-R0,L*.15+ny*.8,h+R0*.6]],'#2a1414',{grad:1,edge:'#8a6a3a',ew:.6,d:-.28});
  for(const sx of[-1,1])B.ball([sx*R0*.95,L*.2+ny*.8,h+R0*.4],.7,'#a08a50',{d:-.3});
  // 머리: 해골 같은 이마판·드러난 이·뒤틀린 뿔·불 눈·콧김
  B.cap(W3_a(hd,fwd,r*.3),W3_a(hd,fwd,r*2.2),r*.55,'#2a1a1a',{w1:r*.3,d:-.06});B.line([W3_a(hd,[0,0,r*.9]),W3_a(W3_a(hd,fwd,r*2),[0,0,r*.2])],'#c8b8a0',.5,{d:-.08});
  for(const s2 of[-1,1]){for(let i=0;i<4;i++){const q=W3_a(W3_m(W3_a(hd,fwd,r*1.2),tip,i/4),[s2*r*.35,0,-r*.35]);B.cap(q,W3_a(q,[0,0,-r*.3-jaw*.6]),r*.1,'#e8dcc0',{w1:r*.02,d:-.1});}
    const a=W3_a(hd,[s2*r*.4,-r*.3,r*.6]),b=W3_a(hd,[s2*r*1.1,-r*1.2,r*1.4]),c=W3_a(hd,[s2*r*.8,-r*.6,r*2.6]),d0=W3_a(hd,[s2*r*1.3,r*.2,r*2.8]);B.cap(b,c,r*.22,'#3a2a2a',{w1:r*.14,d:-.03});B.cap(c,d0,r*.14,'#5a4a4a',{w1:r*.03,d:-.03});for(const tt of[.3,.65])B.ball(W3_m(a,b,tt),r*.28,'#2a1a1a',{sy:.5,d:-.04});
    const e=W3_a(W3_a(hd,fwd,r*.62),[s2*r*.52,0,r*.28]);B.cap(W3_a(e,[s2*r*.2,-r*.3,r*.25]),W3_a(e,[-s2*r*.1,r*.3,r*.18]),r*.15,'#0a0606',{d:-.09});
    const ph=((t/500)+(s2>0?.5:0))%1;B.ball(W3_a(W3_a(tip,[s2*r*.25,0,r*.1]),[s2*ph*2,ph*1.5,ph*2.6]),.8+ph*1.6,'#5a4a4a',{alpha:(1-ph)*.5,d:-.12});}
  for(let i=0;i<5;i++){const ph=((t/1100)+i/5)%1;B.glow([Math.sin(i*2.3)*R0,-L*.3+i*L*.15,h+R0+ph*12],1,fc,(1-ph)*.7);}}}]);


// ===================== 3라운드(133~196) =====================
// 네발짐승 여러 머리 중 hi번째 기하(plan.quad 와 같은 식)
function W3_qHead(B,g,hi,n){const s=g.s,off=n>1?(hi-(n-1)/2)*5*g.bw:0,ang2=n>1?(hi-(n-1)/2)*.35:0,hd=[off,g.front[1]+4+(s.neckL||2)-g.headUp*2,g.h+5+g.headUp*7+(s.headZ||0)],r=(s.headR||4.3)*g.bw,fwd=W3_n(Math.sin(ang2),Math.cos(ang2)*(1-g.headUp*.3),g.headUp*.6),sd=[Math.cos(ang2),-Math.sin(ang2),0],sn=s.snout??1.6;
  const tip=W3_a(W3_a(hd,fwd,r*(1+sn)),[0,0,-r*.25]),Hp=(x,y,z)=>W3_a(W3_a(W3_a(hd,sd,x*r),fwd,y*r),[0,0,z*r]),neck=[off*.5,g.front[1]+2,g.h+3+g.headUp*3];return{hd,r,fwd,sd,tip,Hp,neck,ang2,sn};}
// 색 바꿔 그리기: fn 안에서 그린 부품의 색을 map 대로 치환(변종이 기본형 HQ 디테일을 다른 색으로 재사용)
function W3_rc(B,map,fn){const o={ball:B.ball,cap:B.cap,poly:B.poly,line:B.line,glow:B.glow,spark:B.spark,arc:B.arc},M={};for(const k in map)M[String(k).toLowerCase()]=map[k];const c=v=>typeof v==='string'&&M[v.toLowerCase()]!==undefined?M[v.toLowerCase()]:v,sk=v=>c(v)===null;
  const co=op=>op&&(op.glow||op.edge)?{...op,glow:c(op.glow),edge:c(op.edge)}:op;
  B.ball=(p,r,col,op)=>{if(!sk(col))o.ball(p,r,c(col),co(op));};B.cap=(a,b,w,col,op)=>{if(!sk(col))o.cap(a,b,w,c(col),co(op));};B.poly=(pts,col,op)=>{if(!sk(col))o.poly(pts,c(col),co(op));};B.line=(pts,col,w,op)=>{if(!sk(col))o.line(pts,c(col),w,co(op));};
  B.glow=(p,r,cc,a)=>o.glow(p,r,c(cc),a);B.spark=(p,r,cc,a)=>o.spark(p,r,c(cc),a);B.arc=(pts,cc,w)=>o.arc(pts,c(cc),w);
  try{fn();}finally{Object.assign(B,o);}}
// 다른 HQ 항목(어느 작업자 파일이든) 찾기
function W3_base(n){const q=window.MRHQ||[];for(const e of q)if(e[0]===n)return e[1];return null;}
function W3_inh(B,K,n,map){const b=W3_base(n);if(!b||!b.detail)return;if(map)W3_rc(B,map,()=>b.detail(B,K));else b.detail(B,K);}

// 135. 키메라 — 사자 머리(갈기 목도리·송곳니)+염소 머리(감긴 뿔·수염), 근육 털결, 가죽 날개 뼈대, 뱀 머리 꼬리(비늘·독니), 발톱
Q.push(['키메라',{horns:null,
 detail(B,K){const g=W3_Qg(B),{h,L,bw,ny,R0,jaw,t,mode,f}=g,sk='#b08040',dk='#6a4a20',mn='#7a4a20',fc='255,140,60';
  // 털결(옆구리·등) + 근육 그림자
  for(let i=0;i<30;i++){const y=-L*.45+(i%10)*L*.1+ny*.75,sx=i%2?-1:1,ang=.35+((i*.53)%1)*1.0;const c=[sx*Math.sin(ang)*R0*1.02,y,h+1+Math.cos(ang)*R0*.98];B.cap(c,W3_a(c,[sx*.3,-1.6,-.5]),.7,(i>>1)%3?W3_T(sk,-.12):W3_T(sk,.14),{w1:.15,d:-.22});}
  for(const sx of[-1,1]){B.line([[sx*R0*.95,L*.3+ny,h+R0*.9],[sx*R0*1.02,L*.18+ny*.9,h+R0*.2],[sx*R0*.9,L*.05+ny*.8,h-R0*.3]],dk,.5,{d:-.24});B.line([[sx*R0*.9,-L*.25+ny*.5,h+R0*.8],[sx*R0*1.0,-L*.35+ny*.5,h]],dk,.5,{d:-.24});}
  W3_batWing(B,g,'#7a5a30','#a07a48',{claw:'#e0d0b0'});
  // 발톱·발목 털
  for(const lg of g.legs){for(let i=-1;i<=1;i++)B.cap(W3_a(lg.ft,[i*.9,.9,.4]),W3_a(lg.ft,[i*1.1,2.2,-.3]),.6,'#efe4c8',{w1:.1,d:-.08});for(let i=0;i<3;i++)B.cap(W3_a(lg.ft,[(i-1)*.8,-.5,2.2]),W3_a(lg.ft,[(i-1)*1,-1.2,.6]),.8,mn,{w1:.2,d:-.06});}
  // 머리 0: 사자
  {const H0=W3_qHead(B,g,0,2),{r,Hp,hd,neck}=H0;
    for(let i=0;i<14;i++){const a=i/14*6.283,c=Math.cos(a),sn=Math.sin(a);B.ball(Hp(c*1.0,-.25,sn*1.0),r*.42,i%2?mn:W3_T(mn,-.2),{d:.01});B.cap(Hp(c*1.1,-.3,sn*1.1),Hp(c*1.75,-.8,sn*1.6-.2),r*.3,i%2?W3_T(mn,-.3):mn,{w1:r*.06,d:.02});}
    for(let i=0;i<6;i++){const q=W3_m(neck,hd,i/6);B.ball(W3_a(q,[0,-.6,r*.6]),r*.55,i%2?mn:W3_T(mn,.12),{d:-.02});}
    for(const s2 of[-1,1]){B.cap(Hp(.55*s2,.5,.45),Hp(.1*s2,.85,.4),r*.18,W3_T(sk,-.4),{d:-.08});B.ball(Hp(.38*s2,1.6,-.15),r*.32,W3_T(sk,.25),{d:-.07});for(let i=0;i<3;i++)B.ball(Hp(.4*s2,1.65+i*.12,-.05-i*.05),r*.05,'#2a1a0a',{flat:1,d:-.1});
      B.cap(Hp(.25*s2,2.1,-.45),Hp(.25*s2,2.1,-.95-jaw*.3),r*.13,'#f4ecd6',{w1:r*.02,d:-.11});}
    B.ball(Hp(0,2.4,0),r*.22,'#3a2018',{sx:1.3,d:-.11});}
  // 머리 1: 염소(감긴 뿔·수염·가로 동공)
  {const H1=W3_qHead(B,g,1,2),{r,Hp,hd}=H1;B.ball(hd,r*1.02,'#b8ab94',{d:-.01});B.cap(Hp(0,.4,-.1),Hp(0,2.3,-.35),r*.9,'#c8bca8',{w1:r*.55,d:-.02});B.ball(Hp(0,2.35,-.25),r*.22,'#3a2a20',{sx:1.3,d:-.05});for(const s2 of[-1,1])B.ball(Hp(.5*s2,.62,.3),r*.2,'#ffd030',{flat:1,glow:'255,200,40',d:-.09});
    for(const s2 of[-1,1]){const pts=[];for(let i=0;i<=8;i++){const a=i/8*4.4;pts.push(Hp(s2*(.45+Math.sin(a)*.25+i*.06),-.2-Math.sin(a)*.9-i*.03,.8+Math.cos(a)*.75*(1-i*.05)));}
      for(let i=0;i<8;i++)B.cap(pts[i],pts[i+1],r*(.34-i*.03),i%2?'#d8c8a0':'#b8a478',{w1:r*(.31-i*.03),d:-.04});
      B.cap(Hp(.65*s2,-.1,.3),Hp(1.05*s2,-.3,.05),r*.22,W3_T(sk,-.05),{w1:r*.08,d:.02});B.cap(Hp(.5*s2,.62,.32),Hp(.3*s2,.66,.32),r*.08,'#1a1008',{d:-.1});}
    for(let i=0;i<4;i++)B.cap(Hp((i-1.5)*.12,1.9,-.5),Hp((i-1.5)*.15,1.7,-1.5-i%2*.3),r*.14,i%2?'#e0d8c8':'#c8bca8',{w1:r*.04,d:-.1});}
  // 뱀 꼬리(비늘 마디·뱀 머리·독니·혀)
  {const tp=W3_qTail(B,g);for(let i=1;i<tp.length;i++){const q=tp[i];for(const s2 of[-1,1])B.ball(W3_a(q,[s2*.6,0,.6]),.7*bw,i%2?'#3a6a2a':'#5a8a3a',{flat:1,sy:.7,d:-.05});}
    const e=tp[tp.length-1],pe=tp[tp.length-2],dv=W3_n(...W3_sub(e,pe)),sh=W3_a(e,dv,2.2);B.cap(e,sh,2.2*bw,'#4a7a3a',{w1:1.6*bw,d:-.06});B.ball(W3_a(sh,[0,0,.3]),1.7*bw,'#5a8a40',{sy:.8,d:-.07});
    for(const s2 of[-1,1])B.ball(W3_a(W3_a(sh,W3_perp(dv),s2*.9),[0,0,.8]),.45,'#ffe040',{flat:1,glow:'255,220,60',d:-.1});
    const at=mode==='attack'||mode==='skill';for(const s2 of[-1,1])B.cap(W3_a(W3_a(sh,dv,1),W3_perp(dv),s2*.5),W3_a(W3_a(W3_a(sh,dv,1.4),W3_perp(dv),s2*.5),[0,0,-1.2-(at?.6:0)]),.35,'#f4ecd6',{w1:.08,d:-.1});
    const tg=Math.sin(t/120+f)>0||at;if(tg){const a=W3_a(sh,dv,2),b=W3_a(sh,dv,3.6);B.line([a,b,W3_a(b,W3_perp(dv),.6)],'#d02040',.35,{d:-.1});B.line([a,b,W3_a(b,W3_perp(dv),-.6)],'#d02040',.35,{d:-.1});}}
  if(mode==='skill'&&f===2)for(let i=0;i<4;i++)B.glow([Math.sin(i*1.7)*3,L*.5+g.ny+8+i*3,h+4+Math.cos(i)*2],2.5,fc,.5);}}]);


// 138. 메두사 — 뱀 머리카락(머리마다 눈·혀), 비늘 꼬리(검은 띠·배판), 청동 비늘 흉갑·어깨 뱀 장식, 금 관, 각궁(뿔 끝·감은 손잡이·시위·화살), 화살통, 석화 눈빛
Q.push(['메두사',{cloth:'#3e4a2c',
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,{mode,f,t}=B,walk=mode==='walk'||mode==='run',hc='#3a6a2a',gold='#c8a040',br='#8a6a30';
  // 꼬리 비늘
  const w=Math.sin(t/300+f*1.4)*(walk?2.5:1),pts=[[0,0,H],[0,2,H*.5],[w,1,4],[-w+3,-6,2.5],[w,-12,2.2],[-4-w,-16,2.6],[-7,-12+w,3.4]];
  for(let i=1;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],ww=(11-i*1.4)*bw,dv=W3_n(...W3_sub(b,a)),pp=W3_perp(dv);for(let j=0;j<4;j++){const q=W3_m(a,b,j/4+.1);
      B.ball(W3_a(q,[0,0,ww*.42]),ww*.15,j%2?'#2a3a1a':'#7a9a4a',{flat:1,sx:1.3,sy:.55,d:-.08});for(const s2 of[-1,1])B.ball(W3_a(W3_a(q,pp,s2*ww*.36),[0,0,ww*.15]),ww*.1,'#4a6a2a',{flat:1,sy:.6,d:-.07});
      if(j===2)B.cap(W3_a(W3_a(q,pp,-ww*.42),[0,0,ww*.05]),W3_a(W3_a(q,pp,ww*.42),[0,0,ww*.05]),1.1,'#1e2a14',{d:-.06});
      B.cap(W3_a(W3_a(q,pp,-ww*.32),[0,0,-ww*.24]),W3_a(W3_a(q,pp,ww*.32),[0,0,-ww*.24]),1.1,'#c8c890',{d:-.05});}}
  {const e=pts[pts.length-1];for(let i=0;i<3;i++)B.ball(W3_a(e,[-1-i*.9,.2,.4+i*.3]),.8-i*.15,'#d8c8a0',{sy:.7,d:-.06});}
  for(let i=0;i<4;i++){const q=W3_m(pts[0],pts[2],.3+i*.18);B.cap(W3_a(q,[-3.6*bw,3.4,0]),W3_a(q,[3.6*bw,3.4,0]),1.5,i%2?'#c8c890':'#b0b078',{d:-.2});}
  // 청동 비늘 흉갑 + 허리 띠
  for(let r2=0;r2<4;r2++)for(let i=-2;i<=2;i++){const x=(i+(r2%2)*.5)*1.9*bw;if(Math.abs(x)>5*bw)continue;B.ball([x,5.8*bw,sh-2.4-r2*2],1.15*bw,r2%2?br:W3_T(br,.15),{flat:1,sy:1.2,d:-.26});}
  B.cap([-6*bw,1.3,H+3],[6*bw,1.3,H+3],1.8,gold,{d:-.27});B.cap([-6*bw,-1.3,H+3],[6*bw,-1.3,H+3],1.8,gold,{d:.24});B.ball([0,6.2*bw,H+3],1.3,'#40a060',{glow:'150,255,120',d:-.32});
  for(const sg of[-1,1]){const sp=W.sp(sg);B.ball(W3_a(sp,[0,0,.8]),3.2*bw,'#6a6a30',{sy:.7,d:-.3});for(let i=0;i<5;i++){const a=i/4*3.1;B.ball(W3_a(sp,[sg*Math.sin(a)*2.6,Math.cos(a)*2.6,1.6]),.6,i%2?hc:'#5a8a3a',{d:-.33});}B.ball(W3_a(sp,[sg*.6,2.6,1.8]),.5,'#ffe040',{flat:1,d:-.35});
    const el=W.el(sg),h=W.h(sg);for(let i=0;i<3;i++)B.cap(W3_m(el,h,.45+i*.14),W3_m(el,h,.5+i*.14),3.4*bw,i%2?gold:'#9a7a30',{d:-.1});}
  // 화살통(등)
  {const a=[-3*bw,-5.4*bw,sh+3],b=[2.6*bw,-5.4*bw,H+2];B.cap(a,b,3,'#4a2a18',{w1:2.6,d:.3});B.cap(W3_m(a,b,.1),W3_m(a,b,.14),3.3,gold,{d:.29});for(let i=0;i<4;i++)B.cap(W3_a(a,[i*.6-1,-.2,0]),W3_a(a,[i*.6-1.6,-.4,3]),.5,'#e8e0d0',{w1:.9,d:.28});B.cap([-6*bw,4,sh-1],[4*bw,4.6*bw,H+3],.7,'#3a2010',{d:-.3});}
  // 뱀 머리카락: 끝마다 뱀 머리(눈·혀)·띠 무늬
  const sw=Math.sin(B.t/250);for(let i=0;i<9;i++){const a=i/9*Math.PI*2,ww=Math.sin(B.t/250+i)*.35;const p0=P(Math.cos(a)*.75,Math.sin(a)*.6-.15,.55),p1=P(Math.cos(a)*1.5+ww,Math.sin(a)*1.2-.4,.9+Math.cos(i)*.3),p2=P(Math.cos(a)*1.9-ww,Math.sin(a)*1.5-.6,.4+ww);
    for(const tt of[.35,.7])B.cap(W3_m(p0,p1,tt),W3_m(p0,p1,tt+.08),hr*.24,'#1e3a14',{d:-.03});B.cap(W3_m(p1,p2,.5),W3_m(p1,p2,.6),hr*.18,'#c8c070',{d:-.03});
    const dv=W3_n(...W3_sub(p2,p1)),hh=W3_a(p2,dv,hr*.12);B.ball(hh,hr*.2,'#4a7a2a',{sx:1.2,d:-.04});const pp=W3_perp(dv);for(const s2 of[-1,1])B.ball(W3_a(W3_a(hh,pp,s2*hr*.12),[0,0,hr*.08]),hr*.06,'#ffe040',{flat:1,d:-.06});
    if((i+Math.floor(t/200))%3===0)B.line([W3_a(hh,dv,hr*.2),W3_a(hh,dv,hr*.5)],'#d02040',.3,{d:-.06});}
  // 금 관·얼굴(비늘 뺨·세로 동공·송곳니)
  for(let i=0;i<11;i++){const a=-1.3+i*.26;B.ball(P(Math.sin(a)*.9,Math.cos(a)*.82,.66),hr*.09,gold,{d:-.06});}B.cap(P(0,.85,.68),P(0,.9,1.05),hr*.16,gold,{w1:hr*.05,d:-.07});B.ball(P(0,.9,.78),hr*.12,'#40c070',{glow:'150,255,120',d:-.08});
  for(const g of[-1,1]){B.cap(P(.38*g,.98,.24),P(.38*g,.98,.08),hr*.05,'#100800',{d:-.09});for(let i=0;i<3;i++)B.ball(P(.62*g,.75,-.05-i*.16),hr*.08,'#6a8a4a',{flat:1,d:-.07});B.cap(P(.16*g,.92,-.5),P(.18*g,.94,-.7),hr*.06,'#ffffff',{w1:hr*.01,d:-.1});}
  if(mode==='skill'||mode==='buff')for(const g of[-1,1])B.glow(P(.38*g,1,.16),2.2,'230,255,120',.7);
  // 각궁(뿔 끝·손잡이 감기·시위·화살)
  {const h=W.p.hR,d=W.p.dS,up=[0,0,1],top=W3_a(h,up,12),bot=W3_a(h,up,-12),c1=W3_a(W3_m(top,h),d,3.5),c2=W3_a(W3_m(bot,h),d,3.5);
    B.cap(top,c1,1.2,'#3a2412',{w1:1.6,d:-.12});B.cap(c1,h,1.6,'#5a3a1a',{w1:1.8,d:-.12});B.cap(h,c2,1.8,'#5a3a1a',{w1:1.6,d:-.12});B.cap(c2,bot,1.6,'#3a2412',{w1:1.2,d:-.12});
    for(const e of[top,bot])B.cap(e,W3_a(e,[0,0,e===top?1.6:-1.6]),.8,'#e8dcc0',{w1:.2,d:-.13});for(let i=0;i<3;i++)B.cap(W3_a(h,up,-1.4+i*1.1),W3_a(h,up,-.9+i*1.1),2.1,'#8a2a20',{d:-.13});
    const dr=mode==='attack'?[3.5,5,0][f]:mode==='skill'?[2,4.5,5,0][f]:0,nk=W3_a(h,d,-dr);B.line([top,nk,bot],'#e8e0c8',.3,{d:-.14});
    if(dr>1){B.cap(nk,W3_a(nk,d,14),.5,'#8a6a40',{d:-.15});B.poly([W3_a(nk,d,13.6),W3_a(W3_a(nk,d,16),[0,0,.01]),W3_a(W3_a(nk,d,13.6),[0,0,1])],'#c0c8c0',{d:-.16});B.cap(nk,W3_a(nk,d,1.8),.9,'#40a060',{w1:.3,d:-.15});if(mode==='skill')B.glow(W3_a(nk,d,15),2.4,'230,255,120',.7);}}}}]);


// 141. 변종 웅골리언트 — 웅골리언트 HQ를 잿불색으로 + 등 용암 균열·다리 가시털·주황 독액·불티
Q.push(['변종 웅골리언트',{
 detail(B,K){W3_inh(B,K,'웅골리언트',{'#2a2028':'#2a1a0a','#3a2e38':'#3a2410','#2a1e28':'#24160a','#4a2a5a':'#6a2a0a','#3a2a34':'#3a200e','#7a3aa0':'#c04a08','#a050d0':'#ff8020','200,80,255':'255,120,30','#a030e0':'#ff7020','160,255,90':'255,150,40','#120a14':'#1a0804'});
  const g=W3_Bg(B),{S,L,bw,t,mode,f,hp,hr}=g,ab=S[0];
  // 등 용암 균열
  const top=W3_a(ab.p,[0,0,ab.r*.78]);for(const s2 of[-1,1]){W3_crack(B,[W3_a(top,[s2*ab.r*.2,ab.r*.35,0]),W3_a(top,[s2*ab.r*.45,0,-ab.r*.15]),W3_a(top,[s2*ab.r*.4,-ab.r*.4,-ab.r*.25])],{w:.6,gr:1.4});}
  W3_crack(B,[W3_a(top,[0,-ab.r*.55,-ab.r*.1]),W3_a(top,[ab.r*.1,-ab.r*.75,-ab.r*.4])],{w:.5,glow:0});
  for(let i=0;i<5;i++)B.cap(W3_a(ab.p,[(i-2)*ab.r*.18,-ab.r*.1+Math.abs(i-2)*.4,ab.r*.92]),W3_a(ab.p,[(i-2)*ab.r*.22,-ab.r*.3,ab.r*1.25]),.7,'#5a2a10',{w1:.1,d:-.28});
  // 다리 가시털(주황 끝)
  for(const lg of L){for(let i=0;i<3;i++){const q=W3_m(lg.root,lg.knee,.3+i*.25);B.cap(q,W3_a(q,[lg.sg*.4,0,1.6]),.45,'#ff7020',{w1:.05,d:-.1});}B.ball(lg.knee,.7,'#ff6010',{flat:1,glow:'255,120,30',d:-.09});}
  // 독니 주황 독액
  if(mode==='attack'||mode==='skill'||Math.sin(t/400)>.5)for(const s2 of[-1,1])B.ball(W3_a(hp,[s2*hr*.4,hr*1.4,-hr*.9-((t/30)%3)*.4]),.5,'#ff9030',{glow:'255,140,40',d:-.13});
  for(let i=0;i<4;i++){const ph=((t/1000)+i/4)%1;B.glow(W3_a(ab.p,[Math.sin(i*2.1)*ab.r,Math.cos(i*1.3)*ab.r*.6,ab.r+ph*8]),.9,'255,120,30',(1-ph)*.7);}}}]);

// 144. 사악한 미믹 — 미믹 HQ를 검붉은 나무·피빛 쇠테로 + 감긴 쇠사슬·해골 자물쇠·모서리 가시·뚜껑 안 외눈·붉은 틈빛
Q.push(['사악한 미믹',{
 detail(B,K){W3_inh(B,K,'미믹',{'#9a6030':'#4a2a3a','#4a2a10':'#24101a','#6a3a18':'#3a1a28','#5a4a3a':'#2a2224','#c0a050':'#8a2020','#c8a848':'#9a2a24','#5a4018':'#3a0a08','#d05070':'#9a1030','255,210,90':'255,60,60','#5a3020':'#2a1418'});
  const g=W3_Og(B),{r,z0,lunge,mode,f,walk,ph,t}=g,W=r,D=r*.75,H0=r*.8,zb=z0,hz=zb+H0;
  const open=mode==='attack'?[.2,1,.5][f]:mode==='skill'?[.3,.9,1.1,.4][f]:mode==='buff'?.6:walk?.25+.15*Math.sin(ph*2):.08;
  // 쇠사슬(몸통 대각선 감기)
  for(const sd of[-1,1])for(let i=0;i<9;i++){const tt=i/8,x=-W*.95+tt*W*1.9,z=zb+H0*(sd>0?tt:1-tt)*.9+.3;B.ball([x,D+lunge+.25,z],.55,i%2?'#5a5a60':'#8a8a90',{sx:i%2?.6:1.3,sy:i%2?1.3:.6,d:-.25});}
  // 모서리 가시
  for(const x of[-W,W])for(const yy of[-D,D])B.cap([x,yy+lunge,hz-.5],[x*1.18,yy*1.18+lunge,hz+.8],.9,'#3a3438',{w1:.1,d:-.12});
  // 해골 자물쇠판
  {const c=[0,D+lunge+.45,hz-1.6];B.ball(c,1.4,'#d8d0b8',{sy:1.1,d:-.24});for(const s2 of[-1,1])B.ball(W3_a(c,[s2*.5,.2,.2]),.38,'#1a0808',{flat:1,d:-.26});B.ball(W3_a(c,[0,.3,-.4]),.2,'#1a0808',{flat:1,d:-.26});for(let i=-1;i<=1;i++)B.cap(W3_a(c,[i*.35,.2,-.8]),W3_a(c,[i*.35,.2,-1.1]),.22,'#e8e0c8',{d:-.26});}
  // 틈 붉은 빛·안쪽 외눈
  B.glow([0,D*.9+lunge,hz],3+open*3,'255,40,40',.35+open*.3);
  if(open>.3){const e=[0,D*.2+lunge,hz+1.4+open*1.5];B.ball(e,1.8,'#f0e0d0',{d:-.08});B.ball(W3_a(e,[0,1.2,0]),1.1,'#d02020',{flat:1,glow:'255,50,50',d:-.1});B.cap(W3_a(e,[0,1.5,.6]),W3_a(e,[0,1.5,-.6]),.3,'#100000',{d:-.11});}
  if(mode==='skill')for(let i=0;i<5;i++){const a=i*1.26+t/250;B.glow([Math.cos(a)*W*.7,D*.2+lunge+Math.sin(a)*2,hz+2+((i*5+f*7)%9)],1.2,'255,60,60',.6);}}}]);


// 147. 공포의 이프리트 — 이프리트 HQ를 검붉은 지옥불로 + 흑철 장신구·끊어진 족쇄 사슬·흑철 뿔관·해골 허리장식·검은 연기·붉은 보석
Q.push(['공포의 이프리트',{cloth:'#8e1a0a',armor:'#4a0a04',sleeve:'#8a1a0a',forearm:'#8a1a0a',hand:'#8a1a0a',
 detail(B,K){W3_inh(B,K,'이프리트',{'#e8b040':'#4a3a3a','#8a5a1a':'#2a1a1a','#40d0ff':'#ff2010','120,220,255':'255,40,20','#ffb040':'#ff4010','#ff9a30':'#e02808','#ff6a10':'#a01004','#ff6010':'#a01004','255,140,40':'255,60,20','255,200,80':'255,90,30','255,200,90':'255,80,30','255,150,40':'255,60,20','255,220,120':'255,90,40','#6a1a08':'#2a0604','#8a2a0e':'#3a0a06'});
  const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,{mode,f,t}=B,ir='#2a2224';
  // 흑철 뿔관
  for(let i=0;i<7;i++){const a=-1.3+i*.43;B.cap(P(Math.sin(a)*.92,Math.cos(a)*.85-.1,.55),P(Math.sin(a)*1.05,Math.cos(a)*.95-.2,1.1+(i%2?0:.35)),hr*.14,ir,{w1:hr*.03,d:-.05});}
  B.cap(P(-.95,.3,.55),P(.95,.3,.55),hr*.14,ir,{d:-.05});B.ball(P(0,.92,.62),hr*.12,'#ff2010',{glow:'255,40,20',d:-.08});
  // 끊어진 족쇄(손목)·사슬
  for(const sg of[-1,1]){const el=W.el(sg),h=W.h(sg),c=W3_m(el,h,.72);B.cap(W3_m(el,h,.66),W3_m(el,h,.8),5.4*bw,ir,{d:-.06});W3_riv(B,[W3_a(c,[0,2.2*bw,.6]),W3_a(c,[sg*2.2*bw,0,.6])],'#6a5a5a',.4,-.08);
    let q=W3_a(c,[0,0,-1.5]);for(let i=0;i<4;i++){const nq=W3_a(q,[sg*.3+Math.sin(t/200+i)*.3,-.4,-1.3]);B.ball(nq,.55,i%2?'#3a3234':'#5a5254',{sx:i%2?.6:1.2,d:-.04});q=nq;}}
  // 해골 허리장식
  {const c=[0,6*bw,H+2.4];B.ball(c,1.5,'#d8ccb0',{sy:1.1,d:-.3});for(const s2 of[-1,1])B.ball(W3_a(c,[s2*.5,.2,.2]),.4,'#2a0404',{flat:1,glow:'255,40,20',d:-.32});for(let i=-1;i<=1;i++)B.cap(W3_a(c,[i*.35,.2,-.8]),W3_a(c,[i*.35,.2,-1.1]),.22,'#e8e0c8',{d:-.32});}
  // 검은 연기·지옥불 눈
  for(let i=0;i<6;i++){const ph=((t/1200)+i/6)%1;B.ball([Math.sin(i*2.2+ph*2)*6,Math.cos(i*1.6)*3-2,H-8+ph*26],1.4+ph*2.4,'#1a1010',{alpha:(1-ph)*.45,d:.2});}
  for(const g of[-1,1])B.glow(P(.36*g,.9,.2),1.6,'255,40,20',.8);
  // 가슴 용암 균열(검은 피부 사이)
  {const y=6.3*bw;for(const g of[-1,1])W3_crack(B,[[g*1*bw,y,sh-1],[g*3.4*bw,y-.4,sh-4],[g*2.2*bw,y-.2,sh-7],[g*4.2*bw,y-.8,H+4]],{w:.6,col:'#ff5020',gc:'255,60,20',gr:1.8});W3_crack(B,[[0,y+.2,sh-3],[.6,y+.2,sh-6],[-.4,y+.2,H+5]],{w:.5,col:'#ff5020',glow:0});}
  if(mode==='skill'&&f>=1)for(let i=0;i<6;i++){const a=i/6*6.283+t/200;B.glow([Math.cos(a)*10,Math.sin(a)*5,H-6+f*2],2.6,'255,40,10',.6);}}}]);


// 150. 난폭한 해골도끼병 — 해골도끼병 HQ를 피빛 휘장·검은 녹 쇠로 + 투구 가시 볏·붉은 안광·피 묻은 양날 도끼날·어깨 해골·붉은 기운
Q.push(['난폭한 해골도끼병',{armW:3.6,legW:4,helm:'#4a3e38',
 detail(B,K){W3_inh(B,K,'해골도끼병',{'#3e4a5a':'#5a1612','#6a625a':'#4a3e38','#5a524a':'#3e3430','#7a726a':'#5a4c44','#a08a50':'#c0a060','#8a8680':'#7a7470'});
  const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,{mode,f,t}=B;
  // 투구 가시 볏
  for(let i=0;i<5;i++)B.cap(P(0,.5-i*.38,1.0-i*.05),P(0,.35-i*.45,1.6-i*.08),hr*.14,'#3a302c',{w1:hr*.02,d:-.04});
  for(const g of[-1,1])B.ball(P(.36*g,.86,.1),hr*.18,'#ff2010',{flat:1,glow:'255,60,30',d:-.08});
  // 어깨 해골 장식
  for(const sg of[-1,1]){const sp=W.sp(sg),c=W3_a(sp,[sg*1.6,.4,2.6]);B.ball(c,1.5,'#d8d0b8',{sy:1.1,d:-.34});for(const s2 of[-1,1])B.ball(W3_a(c,[s2*.5,1.1,.2]),.38,'#200404',{flat:1,d:-.36});B.cap(W3_a(c,[0,1.2,-.6]),W3_a(c,[0,1.2,-1]),.5,'#e8e0c8',{d:-.36});}
  // 반대쪽 도끼날(양날) + 피
  {const h=W.p.hR,d=W.p.dS,pt=k=>W3_a(h,d,k),pp=W3_perp(d);const a=pt(14),b=pt(19.5);B.poly([a,b,W3_a(b,pp,-5.2),W3_a(W3_m(a,b),pp,-6.2),W3_a(a,pp,-5)],'#7a7470',{grad:1,edge:'#2a2420',ew:.5,d:-.12});B.line([W3_a(b,pp,-5),W3_a(W3_m(a,b),pp,-6),W3_a(a,pp,-4.8)],'#e8e8e8',.35,{d:-.13});
    for(let i=0;i<4;i++)B.ball(W3_a(pt(15+i*1.2),pp,(i%2?-1:1)*(3+i*.6)),.7-i*.08,'#8a0a08',{flat:1,alpha:.8,d:-.14});B.ball(W3_a(pt(16),pp,4.5),.45,'#8a0a08',{d:-.14});}
  for(let i=0;i<5;i++){const ph=((t/900)+i/5)%1;B.glow([Math.sin(i*2.4)*6,Math.cos(i*1.7)*3,H*.4+ph*22],1.3*(1-ph)+.5,'255,50,30',(1-ph)*.6);}
  if(mode==='attack'&&f===1)B.glow(W.wp(18),3.5,'255,60,30',.6);}}]);

// 153. 난폭한 구울 — 구울 HQ를 핏빛 살색으로 + 붉은 안광·피 묻은 입과 손톱·핏줄·찢긴 상처·뼈 돌기
Q.push(['난폭한 구울',{cloth:'#988088',pants:'#2a2228',skin:'#a08890',hand:'#8a7078',forearm:'#988088',sleeve:'#988088',armW:4,legW:4.6,chestW:1.4,
 detail(B,K){W3_inh(B,K,'구울',{'#8a9488':'#a08890','#7a8478':'#8a7078','#828c80':'#988088','#96a092':'#b09aa0','#6e786c':'#806870','#5e685c':'#705860','#a8b0a2':'#c0a8b0','#4a5048':'#5a3a42','#3a3028':'#2a1a14'});
  const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,{mode,f,t}=B,y=5.4*bw;
  for(const g of[-1,1])B.ball(P(.36*g,.86,.12),hr*.15,'#ff2020',{flat:1,glow:'255,40,40',d:-.07});
  // 피: 입가·턱·가슴 흘러내림
  B.ball(P(0,.86,-.85),hr*.25,'#7a0808',{flat:1,sx:1.4,alpha:.85,d:-.1});for(const g of[-.25,.2])B.line([P(g,.88,-.7),P(g*1.2,.85,-1.2)],'#8a0a0a',.5,{d:-.11});
  B.line([[-.6,y-.2,sh-1],[-.8,y-.4,sh-4],[-.4,y-.4,sh-6]],'#7a0808',.6,{d:-.27});
  // 핏줄·상처
  for(const sg of[-1,1]){const el=W.el(sg),h=W.h(sg);B.line([W3_m(el,h,.1),W3_a(W3_m(el,h,.5),[sg*.3,.6,0]),W3_m(el,h,.9)],'#6a2a4a',.35,{d:-.1});
    for(let i=-1;i<=1;i++){const a=W3_a(h,W3_n(i*.45,.9,-.3),3.6);B.ball(a,.45,'#7a0a0a',{d:-.12});}}
  for(let i=0;i<3;i++)B.line([[(-4+i*.8)*bw,y-.6,H+7-i*.4],[(-2.4+i*.8)*bw,y-.4,H+9-i*.4]],'#5a0606',.5,{d:-.26});
  // 척추 뼈 돌기
  for(let i=0;i<5;i++)B.cap([0,-5.8*bw,sh-1-i*2.6],[0,-7.2*bw,sh-.4-i*2.6],.6,'#d8d0b8',{w1:.1,d:.27});
  if(mode==='attack'||mode==='skill')for(const sg of[-1,1])B.glow(W.h(sg),2,'255,50,50',.5);}}]);

// 156. 좀비 로드 — 썩은 왕: 녹슨 금관(붉은 보석)·보라 왕망토(모피 깃)·녹슨 판금·드러난 갈비·해골 견갑·부패 얼굴·뼈 장식 대낫(녹·뒤틀린 날)·녹색 독기
Q.push(['좀비 로드',{pads:null,
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,{mode,f,t}=B,gold='#b89a40',ru='#7a4a2a',pu='#3a1a3a';
  W3_breast(B,W,'#4e4a3e',{back:1,riv:gold,edge:'#14120c'});
  B.ball([-3*bw,6.6*bw,sh-7],2.4,'#2a1a14',{flat:1,sy:1.3,d:-.3});for(let i=0;i<3;i++)B.cap([-4.4*bw,6.6*bw,sh-5.6-i*1.4],[-1.6*bw,6.7*bw,sh-6-i*1.4],.6,'#d8d0b8',{d:-.32});
  for(const[x,z,r]of[[3,-3,1.6],[4,-10,1.3],[-2,-11,1.1]])B.ball([x*bw,6.65*bw,sh+z],r,ru,{flat:1,alpha:.7,d:-.31});
  B.cap([6.8*bw,6.4*bw,sh-1.4],[0,6.9*bw,H+3],1.1,'#5a1a4a',{d:-.33});
  W3_belt(B,W,'#2a2018',{tasset:'#4e4a3e',buckle:gold,riv:gold});
  for(const sg of[-1,1]){W3_paul(B,W,sg,'#5a5444',{r:4.8,rim:gold,riv:gold});W3_bracer(B,W,sg,'#3e382c',{stud:gold});W3_greave(B,W,sg,'#4e4a3e',{strap:'#2a2018',knee:'#5a5444'});
    const c=W3_a(W.sp(sg),[sg*.8,.6,3]);B.ball(c,1.6,'#d8d0b8',{sy:1.1,d:-.36});for(const s2 of[-1,1])B.ball(W3_a(c,[s2*.5,1.2,.2]),.4,'#1a2a0a',{flat:1,glow:'170,255,90',d:-.38});}
  // 모피 깃 + 망토 찢긴 자락
  for(let i=0;i<12;i++){const a=(i/11-.5)*3.6;B.ball([Math.sin(a)*6.4*bw,Math.cos(a)*3.6*bw-1.4,sh+.6],1.6,i%2?'#d8d0c0':'#a89c88',{d:-.02});}
  for(let i=0;i<5;i++){const x=(i-2)*3.2*bw,z=3+(i%2)*2.4+Math.sin(i*2.3);B.poly([[x-1.6*bw,-5-W.p.cape,z+3],[x+1.6*bw,-5-W.p.cape,z+3],[x+.4,-5.6-W.p.cape*1.2,z-1.5],[x-.8,-5.4-W.p.cape*1.2,z]],pu,{d:.25});}
  // 금관(녹·보석)
  for(let i=0;i<14;i++){const a=i/14*6.283;B.cap(P(Math.cos(a)*.92,Math.sin(a)*.92,.62),P(Math.cos(a+.45)*.92,Math.sin(a+.45)*.92,.62),hr*.2,gold,{d:-.03});}
  for(let i=0;i<5;i++){const a=1.57+(i-2)*.55;B.cap(P(Math.cos(a)*.92,Math.sin(a)*.92,.7),P(Math.cos(a)*.95,Math.sin(a)*.95,1.25+(i%2?0:.25)),hr*.14,gold,{w1:hr*.03,d:-.04});}
  B.ball(P(0,.95,.72),hr*.14,'#b01818',{glow:'255,60,60',d:-.06});for(const g of[-1,1])B.ball(P(.55*g,.75,.72),hr*.09,'#40a040',{d:-.06});B.ball(P(.5,.6,.85),hr*.12,ru,{flat:1,alpha:.7,d:-.05});
  // 얼굴
  B.ball(P(-.3,.82,.15),hr*.3,'#1a1410',{flat:1,d:-.07});B.ball(P(-.3,.9,.15),hr*.13,'#c0ff60',{flat:1,glow:'170,255,90',d:-.09});
  B.poly([P(-.45,.82,-.35),P(.5,.82,-.35),P(.3,.8,-.95),P(-.35,.8,-.9)],'#2a0a08',{d:-.09});for(let i=-2;i<=2;i++)B.cap(P(i*.17,.88,-.35),P(i*.17,.88,-.5),hr*.07,'#d8d0a8',{d:-.11});
  B.line([P(.7,.7,.5),P(.45,.82,.1),P(.6,.75,-.2)],'#3a2a1a',.4,{d:-.1});
  // 대낫 강화
  {const h=W.p.hR,d=W.p.dS,pt=k=>W3_a(h,d,k),pp=W3_perp(d);for(let i=0;i<6;i++)B.cap(pt(-12+i*4),pt(-11.4+i*4),1.7,i%2?'#2a1a10':gold,{d:-.08});
    const a=pt(16);B.ball(a,1.6,'#d8d0b8',{d:-.1});for(const s2 of[-1,1])B.ball(W3_a(a,[0,0,.3]),.35,'#1a2a0a',{flat:1,d:-.11});
    B.poly([W3_a(a,[0,0,.4]),W3_a(a,[1,0,1.4]),W3_a(W3_a(a,[1,0,0],-7),[0,0,1]),W3_a(W3_a(a,[1,0,0],-13),[0,0,-5.5]),W3_a(W3_a(a,[1,0,0],-6),[0,0,-1.2]),W3_a(a,[-1,0,-.6])],'#7a7a70',{grad:1,edge:'#2a2a24',ew:.5,d:-.11});
    B.line([W3_a(W3_a(a,[1,0,0],-1),[0,0,1]),W3_a(W3_a(a,[1,0,0],-7),[0,0,.7]),W3_a(W3_a(a,[1,0,0],-12.5),[0,0,-5])],'#d8e0d0',.35,{d:-.12});
    for(const[k,z]of[[-4,0],[-9,-2.2]])B.ball(W3_a(W3_a(a,[1,0,0],k),[0,0,z]),.9,ru,{flat:1,alpha:.7,d:-.12});
    if(mode==='skill')B.glow(W3_a(a,[-6,0,-1]),4,'170,255,90',.55);}
  for(let i=0;i<5;i++){const ph=((t/1300)+i/5)%1;B.ball([Math.sin(i*2)*6,1+Math.cos(i*3)*3,H*.3+ph*22],1.1+ph*1.8,'#7aaa40',{alpha:(1-ph)*.35,d:.1});}}}]);


// 159. 와일드 팡 — 늑대 HQ(갈색) + 긴 검치·두꺼운 목갈기·등 뼈돌기 갈기·얼룩 줄무늬·흉터·근육 어깨
Q.push(['와일드 팡',{tailc:'#5a3a20',legC:'#6a4a2e',paw:'#2a1a10',earC:'#5a3a20',
 detail(B,K){W3_inh(B,K,'늑대',{'#9a9aa2':'#b08a60','#46464c':'#3a2412'});const g=W3_Qg(B),{h,L,bw,ny,R0,jaw,t,mode,f}=g,H0=W3_qHead(B,g,0,1),{r,Hp,neck,hd}=H0,mn='#5a3a20',dk='#3a2412';
  // 두꺼운 목갈기
  for(let i=0;i<14;i++){const a=(i/13-.5)*3.4,b=W3_a(W3_m(neck,hd,.3),[Math.sin(a)*4.6*bw,-1.2,Math.cos(a)*4*bw]);B.cap(b,W3_a(b,[Math.sin(a)*2,-3.6,Math.cos(a)*1.2-1]),2.4,i%3?mn:'#7a5a38',{w1:.35,d:-.04});}
  // 등 갈기 돌기
  for(let i=0;i<7;i++){const y=-L*.45+i*L*.14+ny*.7;B.cap([0,y,h+1+R0*.92],[0,y-1.6,h+3.2+R0],1.3,i%2?dk:mn,{w1:.2,d:-.3});}
  // 얼룩 줄무늬(옆구리)
  for(const sx of[-1,1])for(let i=0;i<3;i++){const y=-L*.3+i*L*.2+ny*.7;B.line([[sx*R0*.75,y,h+R0*.95],[sx*R0*1.0,y-.6,h+R0*.5]],dk,.9,{d:-.25});}
  B.line([[R0*1.0,L*.25+ny,h+R0*.8],[R0*1.02,L*.1+ny,h+R0*.2]],'#c8a080',.4,{d:-.27});
  // 검치·윗니·눈두덩·흉터
  for(const s2 of[-1,1]){const a=Hp(.3*s2,1.6,-.35);B.cap(a,W3_a(a,[0,.3,-r*1.7-jaw*.8]),r*.24,'#f4ecd8',{w1:r*.05,d:-.12});B.line([W3_a(a,[s2*.15,0,0]),W3_a(a,[s2*.1,.3,-r*1.5])],'#ffffff',.25,{d:-.13});
    B.cap(Hp(.6*s2,.5,.45),Hp(.15*s2,.85,.4),r*.18,dk,{d:-.09});}
  B.line([Hp(-.6,.5,.75),Hp(-.25,1.1,.2)],'#8a4a3a',.4,{d:-.1});
  if(mode==='attack'&&f===1)B.glow(H0.tip,2.4,'255,200,120',.5);}}]);

// 162. 하이 리자드맨 — 리자드맨 HQ + 금테 청동 흉갑·비늘 견갑·금 볏 장식관·청색 망토 금수·팔찌·창 장식
Q.push(['하이 리자드맨',{
 detail(B,K){W3_inh(B,K,'리자드맨');const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,{t}=B,gold='#e0c060',ar='#8a7a50';
  W3_breast(B,W,ar,{edge:'#3a3018',riv:gold,back:1});B.ball([0,6.9*bw,sh-4.5],1.3,'#40c0e0',{glow:'160,240,255',d:-.4});
  for(const sg of[-1,1]){const sp=W.sp(sg);for(let i=0;i<3;i++)B.ball(W3_a(sp,[sg*(.4+i*.5),.2,1.8-i*1.2]),3.6*bw-i*.5,i%2?ar:W3_T(ar,.15),{sy:.55,d:-.33-i*.01});B.cap(W3_a(sp,[sg*-1.4,2.6,1.6]),W3_a(sp,[sg*2.6,2.4,-1.4]),.5,gold,{d:-.37});
    W3_bracer(B,W,sg,ar,{band:gold,stud:gold});W3_greave(B,W,sg,ar,{knee:gold,strap:'#3a2a1a'});}
  // 볏 장식관
  for(let i=0;i<9;i++){const a=-1.2+i*.3;B.ball(P(Math.sin(a)*.85,Math.cos(a)*.75,.78),hr*.1,gold,{d:-.06});}B.cap(P(0,.7,.8),P(0,.6,1.3),hr*.18,gold,{w1:hr*.05,d:-.07});B.ball(P(0,.78,.9),hr*.12,'#40c0e0',{glow:'160,240,255',d:-.08});
  // 망토 금수 테두리
  {const c=W.p.cape||0;B.cap([-6*bw,-5.6-c,sh],[6*bw,-5.6-c,sh],1,gold,{d:.3});for(let i=0;i<4;i++)B.ball([(i-1.5)*3*bw,-5.8-c*1.1,H-2-(i%2)*2],.7,gold,{flat:1,d:.32});}
  W3_belt(B,W,'#3a2a14',{buckle:gold,riv:gold});}}]);

// 165. 리자드맨 전사 — 리자드맨 HQ(창 대신 도끼) + 뼈 장신구 목걸이·가죽 어깨덮개·전투 문신·뿔 투구 대신 뼈 머리장식·수염도끼(감은 손잡이·이빠진 날)
Q.push(['리자드맨 전사',{
 detail(B,K){const tn=K.tone;W3_inh(B,K,'리자드맨',{'#c03020':null,[tn('#c03020',-.2)]:null,'#5a5048':null,'#7a7068':null,[tn('#b9c0c8',.55)]:null,[tn('#b9c0c8',-.2)]:null});
  const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,lt='#7a6a4a';
  // 뼈 이빨 목걸이
  for(let i=0;i<9;i++){const a=(i/8-.5)*2.2,q=[Math.sin(a)*5*bw,Math.cos(a)*5.4*bw+.6,sh-1.2-Math.cos(a)*1.4];B.cap(q,W3_a(q,[0,.3,-1.6]),.6,'#efe6cc',{w1:.15,d:-.4});}
  // 가죽 어깨덮개(한쪽)·전투 문신
  {const sp=W.sp(-1);B.ball(W3_a(sp,[0,0,1]),3.6*bw,lt,{sy:.6,d:-.33});for(let i=0;i<3;i++)B.cap(W3_a(sp,[-1-i*.6,2.6,1.2-i*.6]),W3_a(sp,[-1.2-i*.6,2.8,-1.6-i*.6]),.5,'#3a2a14',{d:-.35});B.cap(W3_a(sp,[0,0,2.4]),W3_a(sp,[-1.4,-.6,4.6]),.9,'#efe6cc',{w1:.2,d:-.34});}
  for(const g of[-1,1])B.line([[g*1.5*bw,6.95*bw,sh-2],[g*3.5*bw,6.95*bw,sh-4],[g*2*bw,6.95*bw,sh-6]],'#a02818',.5,{d:-.36});
  // 뼈 머리장식
  for(let i=0;i<3;i++)B.cap(P((i-1)*.35,-.2,.85),P((i-1)*.6,-.6,1.7-Math.abs(i-1)*.3),hr*.13,'#efe6cc',{w1:hr*.03,d:-.03});B.ball(P(0,-.1,.85),hr*.2,'#a02818',{d:-.04});
  W3_axe(B,W,{blade:'#9a9a94',haft:'#4a3420',size:1.15,bind:'#2a1a10',back:1});}}]);


// 168. 블루 테일 — 푸른 도마뱀: 등 비늘 줄·청색 가시 볏·배 비늘판·꼬리 마디 고리와 빛나는 꼬리끝·눈두덩·갈래 혀·발가락 발톱
Q.push(['블루 테일',{spines:null,
 detail(B,K){const g=W3_Qg(B),{h,L,bw,ny,R0,jaw,t,mode,f}=g,H0=W3_qHead(B,g,0,1),{r,Hp,tip,fwd}=H0,sk='#4a5a7a',dk='#2a3450',sp='#80a0e0';
  for(let i=0;i<32;i++){const y=-L*.48+(i%8)*L*.13+ny*.75,sx=i%2?-1:1,row=(i>>1)%4,ang=.25+row*.33;const c=[sx*Math.sin(ang)*R0*1.02,y+(row%2)*.7,h+1+Math.cos(ang)*R0*.98];B.ball(c,R0*.2,(row+(i>>3))%2?W3_T(sk,-.18):W3_T(sk,.1),{flat:1,sx:1.1,sy:.65,d:-.22});}
  for(let i=0;i<8;i++){const y=-L*.5+i*L*.14+ny*(.5+i/16),z=h+1.2+R0*.92,ht=1.6+Math.sin(i/7*3.1)*1.6;B.poly([[0,y-1.3,z],[0,y+1.1,z],[0,y-.7,z+ht]],i%2?sp:W3_T(sp,-.2),{grad:1,edge:dk,ew:.35,d:-.3});}
  for(let i=0;i<4;i++){const y=L*.4+ny-i*2.2;B.cap([-R0*.6,y,h-R0*.6+i*.1],[R0*.6,y,h-R0*.6+i*.1],1,i%2?'#c0cce0':'#a0b0c8',{d:-.1});}
  {const tp=W3_qTail(B,g);for(let i=1;i<tp.length;i++){const q=tp[i];B.cap(W3_a(q,[-1.3,0,.2]),W3_a(q,[1.3,0,.2]),.7,i%2?'#2a5ad0':dk,{d:-.04});B.cap(W3_a(q,[0,.4,1]),W3_a(q,[0,-.6,2.2-i*.15]),.7,sp,{w1:.1,d:-.08});}
    const e=tp[tp.length-1];B.ball(e,1.6,'#4a8aff',{glow:'120,180,255',d:-.08});B.glow(e,3+Math.sin(t/150)*.6,'120,180,255',.5);}
  for(const lg of g.legs){for(let i=-1;i<=1;i++)B.cap(W3_a(lg.ft,[i*1.1,.8,.3]),W3_a(lg.ft,[i*1.8,2.4,0]),.55,'#e0e0d0',{w1:.1,d:-.08});B.ball(lg.kn,1.4*bw,W3_T(sk,-.2),{sy:.8,d:-.05});}
  for(const s2 of[-1,1]){B.cap(Hp(.55*s2,.5,.42),Hp(.15*s2,.9,.38),r*.16,dk,{d:-.08});B.ball(Hp(.2*s2,2.2,-.05),r*.06,'#101',{flat:1,d:-.1});for(let i=0;i<3;i++)B.cap(Hp((.75)*s2,-.1-i*.35,.2),Hp(1.15*s2,-.3-i*.4,.4),r*.14,sp,{w1:r*.03,d:-.02});}
  B.line([Hp(-.5,1.1,-.35),Hp(-.4,2.3,-.45)],dk,.35,{d:-.09});B.line([Hp(.5,1.1,-.35),Hp(.4,2.3,-.45)],dk,.35,{d:-.09});
  if(Math.sin(t/180+f*2)>.3||mode==='attack'){const a=W3_a(tip,fwd,r*.2),b=W3_a(a,fwd,2.4);B.line([a,b,W3_a(b,[.6,.4,0])],'#e04060',.35,{d:-.1});B.line([a,b,W3_a(b,[-.6,.4,0])],'#e04060',.35,{d:-.1});}}}]);

// 171. 라버본 헤드 — 불타는 해골 머리: 두개골 봉합선·용암 금·광대뼈·콧구멍·윗니 줄·벌어지는 아래턱·눈구멍 불꽃·정수리 불꽃 왕관·검게 탄 자국
Q.push(['라버본 헤드',{
 detail(B,K){const g=W3_Og(B),{r,z0,lunge,mode,f,t,pulse}=g,c0=[0,lunge,z0+r*1.3],R=r*(1+pulse),bc='#d8c8b0',fc='255,110,30';
  const Hc=(x,y,z)=>W3_a(c0,[x*R,y*R,z*R]),jaw=mode==='attack'?[.2,1,.4][f]:mode==='skill'?[.3,.7,1,.4][f]:.15+Math.sin(t/300)*.1;
  // 봉합선·용암 금·그을음
  B.line([Hc(0,.6,.8),Hc(.15,.1,1),Hc(-.1,-.4,.92),Hc(0,-.9,.45)],'#7a6a58',.35,{d:-.06});B.line([Hc(-.8,0,.6),Hc(-.3,-.2,.95),Hc(.35,-.15,.94),Hc(.82,.05,.58)],'#7a6a58',.35,{d:-.06});
  W3_crack(B,[Hc(.45,.5,.78),Hc(.6,.2,.75),Hc(.75,.25,.5)],{w:.5,col:'#ff7020',gc:fc,gr:1.4,d:-.07});W3_crack(B,[Hc(-.3,.65,.72),Hc(-.55,.45,.68),Hc(-.6,.6,.4)],{w:.45,col:'#ff7020',glow:0,d:-.07});
  for(const[x,y,z,rr]of[[-.6,-.3,.6,.3],[.5,-.5,.55,.25],[0,-.8,.3,.3]])B.ball(Hc(x,y,z),R*rr,'#3a2a20',{flat:1,alpha:.55,d:-.05});
  // 광대뼈·눈두덩·콧구멍
  for(const s2 of[-1,1]){B.ball(Hc(.62*s2,.62,-.15),R*.22,W3_T(bc,-.05),{sy:.7,d:-.04});B.cap(Hc(.6*s2,.72,.32),Hc(.12*s2,.86,.3),R*.12,W3_T(bc,-.2),{d:-.07});
    B.ball(Hc(.36*s2,.86,.08),R*.14,'#ff9030',{glow:fc,d:-.08});const ph=((t/260)+(s2>0?.5:0))%1;B.cap(Hc(.36*s2,.9,.12),Hc(.36*s2+Math.sin(t/100+s2)*.05,.9-ph*.1,.5+ph*.35),R*.13,ph<.5?'#ffb040':'#ff6010',{w1:R*.02,alpha:.9-ph*.4,d:-.09});}
  B.poly([Hc(0,.98,-.12),Hc(.1,.96,-.32),Hc(-.1,.96,-.32)],'#1a0a06',{d:-.08});
  // 윗니 줄 + 아래턱
  for(let i=-3;i<=3;i++)B.cap(Hc(i*.1,.92-Math.abs(i)*.03,-.48),Hc(i*.1,.93-Math.abs(i)*.03,-.62),R*.07,'#f0e8d4',{w1:R*.04,d:-.1});
  const jz=-.62-jaw*.5;B.cap(Hc(-.45,.5,-.5),Hc(-.35,.8,jz),R*.12,W3_T(bc,-.12),{d:-.06});B.cap(Hc(.45,.5,-.5),Hc(.35,.8,jz),R*.12,W3_T(bc,-.12),{d:-.06});B.cap(Hc(-.35,.82,jz-.05),Hc(.35,.82,jz-.05),R*.16,W3_T(bc,-.1),{d:-.07});
  for(let i=-2;i<=2;i++)B.cap(Hc(i*.11,.86,jz),Hc(i*.11,.87,jz+.14),R*.06,'#e8e0c8',{w1:R*.03,d:-.09});
  if(jaw>.4)B.glow(Hc(0,.9,-.6-jaw*.25),R*.6,fc,.6);
  // 정수리 불꽃 왕관
  for(let i=0;i<7;i++){const a=i/7*6.283+t/600,ph=((t/350)+i/7)%1,b=Hc(Math.cos(a)*.5,Math.sin(a)*.5-.1,.85);B.cap(b,W3_a(b,[Math.cos(a)*.8,Math.sin(a)*.5-.6,2.6+ph*2.6]),R*.26,i%2?'#ff6010':'#ffb040',{w1:R*.03,alpha:.9-ph*.4,d:.01});}
  B.glow(Hc(0,0,1.2),R*.9,fc,.4);for(let i=0;i<4;i++){const ph=((t/700)+i/4)%1;B.glow(Hc(Math.sin(i*2.3)*.7,-.3,1+ph*2.2),R*.25*(1-ph)+.3,'255,170,60',(1-ph)*.8);}}}]);

// 174. 열혈토끼 — 붉은 머리띠(펄럭이는 끈)·찢긴 귀·성난 눈썹·앞니·뺨 털·붕대 감은 팔·가죽 손목띠·강철 손톱·허리띠·솜꼬리·불꽃 투지
Q.push(['열혈토끼',{
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,{mode,f,t}=B,fur='#f4e4d8',rd='#c02020',run=mode==='run'||mode==='walk';
  // 머리띠(헬멧 위)·끈
  for(let i=0;i<12;i++){const a=i/12*6.283;B.cap(P(Math.cos(a)*1.0,Math.sin(a)*1.0,.42),P(Math.cos(a+.53)*1.0,Math.sin(a+.53)*1.0,.42),hr*.22,rd,{d:-.04});}
  const fl=Math.sin(t/120+f*1.7)*.4+(run?-.4:0);for(const k of[-1,1])B.cap(P(.15*k,-.98,.42),P(.5*k+fl*.3,-2.1+fl*.2,.1+k*.15),hr*.22,k>0?rd:W3_T(rd,-.2),{w1:hr*.12,d:.03});B.ball(P(0,-1,.42),hr*.2,W3_T(rd,-.15),{d:.02});
  B.ball(P(0,.98,.48),hr*.16,'#f0d040',{flat:1,d:-.07});
  // 찢긴 귀(왼쪽 귀 끝 홈)·얼굴
  B.poly([P(-.55,-.33,2.0),P(-.4,-.3,2.25),P(-.48,-.4,1.85)],'#2a1a18',{d:-.06});
  for(const g of[-1,1]){B.cap(P(.6*g,.82,.5),P(.12*g,.92,.32),hr*.12,'#5a1a14',{d:-.09});for(let i=0;i<3;i++)B.cap(P(.75*g,.55,-.1-i*.12),P(1.05*g,.5,-.15-i*.18),hr*.1,fur,{w1:hr*.02,d:-.04});}
  B.cap(P(-.07,.97,-.48),P(-.07,.97,-.72),hr*.1,'#ffffff',{w1:hr*.08,d:-.1});B.cap(P(.07,.97,-.48),P(.07,.97,-.72),hr*.1,'#ffffff',{w1:hr*.08,d:-.1});
  B.line([P(.55,.8,.25),P(.35,.9,-.2)],'#8a3a30',.35,{d:-.1});
  // 팔 붕대·손목띠·강철 손톱
  for(const sg of[-1,1]){const el=W.el(sg),h=W.h(sg);for(let i=0;i<4;i++)B.cap(W3_m(el,h,.12+i*.14),W3_m(el,h,.18+i*.14),4.2*bw,i%2?'#e8e0d0':'#d0c8b8',{d:-.16});B.cap(W3_m(el,h,.74),W3_m(el,h,.88),4.4*bw,'#4a2a18',{d:-.17});W3_riv(B,[W3_a(W3_m(el,h,.82),[0,1.4*bw,.4])],'#c0c0c8',.35,-.11);
    for(let i=-1;i<=1;i++){const a=W3_a(h,W3_n(i*.4,.9,-.2),1.2);B.cap(a,W3_a(a,W3_n(i*.35,.85,-.45),3.4),.6,'#c8d0d8',{w1:.08,d:-.12});}
    const ft=W.ftp(sg);B.ball(W3_a(ft,[0,1.4,-.6]),1.6,fur,{sx:.9,sy:1.4,d:-.06});}
  // 허리띠·솜꼬리·가슴 털
  W3_belt(B,W,'#3a2010',{buckle:'#c0a040'});B.ball([0,-5.4*bw,H+.5],2.4,fur,{d:.2});for(let i=0;i<5;i++)B.ball([Math.sin(i*1.3)*1.2,-6.2*bw,H+.5+Math.cos(i*1.7)*1.2],1,W3_T(fur,-.08),{d:.18});
  B.poly([[-3.4*bw,5.6*bw,sh-.6],[3.4*bw,5.6*bw,sh-.6],[1.6*bw,6.1*bw,sh-4],[0,6.2*bw,sh-5.2],[-1.6*bw,6.1*bw,sh-4]],fur,{grad:1,d:-.3});for(let i=0;i<5;i++)B.cap([(i-2)*1.1*bw,6.05*bw,sh-3.2],[(i-2)*1.2*bw,6.15*bw,sh-4.8+Math.abs(i-2)*.6],.8,W3_T(fur,-.1),{w1:.2,d:-.31});
  if(mode==='buff'||mode==='skill')for(let i=0;i<6;i++){const ph=((t/400)+i/6)%1;B.cap([Math.sin(i*2.1)*5,Math.cos(i*1.3)*2,H*.6+ph*14],[Math.sin(i*2.1)*5,Math.cos(i*1.3)*2-.4,H*.6+ph*14+3],1.2,i%2?'#ff5020':'#ffa040',{w1:.1,alpha:1-ph,d:.1});}}}]);


// 177. 네크로맨서 — 검은 로브(녹색 룬 테·찢긴 밑단)·뼈 견갑·두개골 허리장식·사슬·후드 속 해골 얼굴과 녹색 안광·해골 지팡이(뼈 마디·녹색 불꽃)·마도서·떠도는 영혼
Q.push(['네크로맨서',{
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,{mode,f,t}=B,cl='#1a1a20',gr='90,255,140',bone='#d8d0c0';
  W3_mage(B,W,{cloth:cl,trim:'#3a6a4a',mantle:'#24242c',gem:'#60ff90',runeGlow:gr,sash:'#3a3a40',book:'#2a3a2a'});
  // 찢긴 밑단
  for(let i=0;i<9;i++){const a=(i/8-.5)*2.6;B.poly([[Math.sin(a)*9.6*bw,Math.cos(a)*5.2,2.6],[Math.sin(a+.15)*9.6*bw,Math.cos(a+.15)*5.2,2.6],[Math.sin(a+.07)*10*bw,Math.cos(a+.07)*5.4,.2-(i%2)*.8]],'#141418',{d:-.24});}
  // 뼈 견갑(갈비 겹)·두개골 허리장식·사슬
  for(const sg of[-1,1]){const sp=W.sp(sg);for(let i=0;i<3;i++)B.cap(W3_a(sp,[sg*(-1+i*.3),2.6-i*1.6,2-i*.4]),W3_a(sp,[sg*(3.4+i*.2),1.8-i*1.6,-.6-i*.4]),.8,bone,{w1:.4,d:-.38});B.ball(W3_a(sp,[0,0,2.2]),1.3,bone,{d:-.38});}
  {const c=[2.6*bw,6.4*bw,H+.4];B.ball(c,1.3,bone,{sy:1.1,d:-.33});for(const s2 of[-1,1])B.ball(W3_a(c,[s2*.45,.9,.2]),.35,'#0a1a0a',{flat:1,glow:gr,d:-.35});B.cap(W3_a(c,[0,1,-.6]),W3_a(c,[0,1,-.9]),.45,'#e8e0d0',{d:-.35});}
  for(let i=0;i<7;i++){const q=W3_m([-6*bw,5.4*bw,sh-1],[2*bw,6.6*bw,H+2],i/6);B.ball(q,.5,i%2?'#5a5a60':'#8a8a90',{sx:i%2?.6:1.3,d:-.36});}
  // 후드 테·후드 속 그림자·해골 얼굴
  for(let i=0;i<11;i++){const a=-1.4+i*.28;B.ball(P(Math.sin(a)*1.0,Math.cos(a)*.95,.25+Math.cos(a)*.2),hr*.15,'#2a2a32',{d:-.05});}
  B.ball(P(0,.7,-.05),hr*.62,'#06060a',{flat:1,sy:1.1,d:-.06});B.ball(P(0,.78,-.12),hr*.45,'#b8b0a0',{sy:1.1,d:-.07});
  for(const g of[-1,1]){B.ball(P(.18*g,.95,0),hr*.13,'#0a0a0a',{flat:1,d:-.09});B.ball(P(.18*g,1,0),hr*.07,'#80ffa0',{flat:1,glow:gr,d:-.1});}
  for(let i=-2;i<=2;i++)B.cap(P(i*.08,.98,-.35),P(i*.08,.98,-.45),hr*.05,'#e8e0d0',{d:-.1});
  // 해골 지팡이
  {const h=W.p.hR,d=W.p.dS,pt=k=>W3_a(h,d,k),pp=W3_perp(d);for(let i=0;i<7;i++){B.cap(pt(-14+i*4.4),pt(-10.4+i*4.4),1.3,bone,{w1:1.1,d:-.04});B.ball(pt(-10+i*4.4),1.2,W3_T(bone,-.15),{d:-.05});}
    for(let i=0;i<3;i++)B.cap(pt(-1+i*1.2),pt(-.5+i*1.2),2.1,'#2a3a2a',{d:-.06});
    const sk=pt(18);B.ball(sk,2.4,bone,{sy:1.1,d:-.08});B.ball(W3_a(sk,[0,1.2,-1.2]),1.4,W3_T(bone,-.1),{sy:.7,d:-.08});for(const s2 of[-1,1])B.ball(W3_a(sk,[s2*.8,2,.2]),.6,'#0a1a0a',{flat:1,glow:gr,d:-.1});
    for(const s2 of[-1,1])B.cap(W3_a(sk,[s2*1.6,0,.8]),W3_a(sk,[s2*3.4,-.6,3]),.7,'#3a3a40',{w1:.1,d:-.07});
    for(let i=0;i<5;i++){const ph=((t/300)+i/5)%1;B.cap(W3_a(sk,[(i-2)*.5,0,1.8]),W3_a(sk,[(i-2)*.6+Math.sin(t/90+i)*.4,-.4,3.4+ph*3]),1.1,i%2?'#40e070':'#a0ffb0',{w1:.1,alpha:.85-ph*.5,d:-.09});}
    B.glow(W3_a(sk,[0,0,2]),3.4+(mode==='skill'?2:0),gr,.5);}
  // 떠도는 영혼
  for(let i=0;i<3;i++){const a=t/900+i*2.09,ph=((t/1500)+i/3)%1,q=[Math.cos(a)*11,Math.sin(a)*6,H*.6+Math.sin(t/400+i)*3+ph*6];B.ball(q,1.3,'#c0ffd0',{alpha:.5*(1-ph*.6),d:0});B.cap(q,W3_a(q,[-Math.sin(a)*3,Math.cos(a)*2,-1.4]),1.2,'#80e0a0',{w1:.1,alpha:.35,d:.01});B.glow(q,1.8,gr,.4);}
  if(mode==='skill'&&f>=1)for(let i=0;i<6;i++){const a=i/6*6.283;B.cap([Math.cos(a)*9,Math.sin(a)*5,0],[Math.cos(a)*8,Math.sin(a)*4.5,3+f],.8,bone,{w1:.3,d:0});B.glow([Math.cos(a)*9,Math.sin(a)*5,1],1.6,gr,.6);}}}]);

// 180. 바람의 대정령 — 하체 회오리(겹 나선 기류)·몸을 감는 바람 띠·흩날리는 긴 머리 기류·팔 수정 장식·가슴 바람 핵·떠도는 잎·눈부신 눈
Q.push(['바람의 대정령',{
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,{mode,f,t}=B,wc='200,255,230',sp=t/180+f*.8;
  // 회오리 하체
  for(let k=0;k<4;k++){const pts=[];for(let i=0;i<=10;i++){const a=i/10*6.283*1.2+sp+k*1.57,z=H-1-i*(H-1)/10,rr=2+(10-i)*.5+k*.4;pts.push([Math.cos(a)*rr*bw,Math.sin(a)*rr*.6,z]);}
    for(let i=0;i<pts.length-1;i++)B.cap(pts[i],pts[i+1],.9-i*.05,k%2?'#e0fff4':'#a0e0c8',{alpha:.55,d:Math.sin(i/10*6.283*1.2+sp+k*1.57)>0?-.3:.3});}
  for(let i=0;i<3;i++){const a=sp*1.4+i*2.1,z=4+i*4;B.arc([[Math.cos(a)*7,Math.sin(a)*4,z],[Math.cos(a+1)*9,Math.sin(a+1)*5,z+1.5],[Math.cos(a+2)*7,Math.sin(a+2)*4,z+2.5]],wc,.8);}
  // 몸 감는 바람 띠
  for(let k=0;k<2;k++){const a0=sp*.8+k*3.14,pts=[];for(let i=0;i<=8;i++){const a=a0+i*.7;pts.push([Math.cos(a)*10*bw,Math.sin(a)*6.5*bw,H+2+i*1.6]);}B.line(pts,'rgba(230,255,245,.6)',.6,{d:-.1});B.arc([pts[0],pts[4],pts[8]],wc,.5);}
  // 머리 기류(뒤로 흩날림)
  for(let i=0;i<7;i++){const a=(i/6-.5)*2.4,fl=Math.sin(t/150+i*1.3)*.3;const b=P(Math.sin(a)*.8,-.3,.6+Math.cos(a)*.2);B.cap(b,P(Math.sin(a)*1.2+fl,-1.6-i%2*.4,1.0+fl),hr*.22,i%2?'#e0fff4':'#c0f0e0',{w1:hr*.03,alpha:.8,d:.02});B.cap(P(Math.sin(a)*1.2+fl,-1.6-i%2*.4,1.0+fl),P(Math.sin(a)*1.4-fl,-2.6,.6),hr*.1,'#e0fff4',{w1:hr*.02,alpha:.5,d:.03});}
  // 이마 보석·눈 빛
  B.ball(P(0,.95,.45),hr*.13,'#80ffe0',{glow:wc,d:-.08});for(const g of[-1,1])B.glow(P(.36*g,.92,.15),1.3,wc,.8);
  // 팔 수정 장식·팔찌
  for(const sg of[-1,1]){const el=W.el(sg),h=W.h(sg),sp2=W.sp(sg);B.cap(W3_m(el,h,.7),W3_m(el,h,.8),4.2*bw,'#80c0b0',{d:-.08});for(let i=0;i<3;i++){const q=W3_m(el,h,.2+i*.2);B.cap(q,W3_a(q,[sg*1.6,-1.2,1.4]),.9,'#c0fff0',{w1:.1,alpha:.85,d:-.1});}
    B.cap(W3_a(sp2,[0,0,1.4]),W3_a(sp2,[sg*2.4,-.6,4.6]),1.4,'#a0f0dc',{w1:.15,alpha:.9,d:-.3});B.cap(W3_a(sp2,[sg*.6,.6,1.2]),W3_a(sp2,[sg*3,.2,3]),1,'#d0fff4',{w1:.1,alpha:.85,d:-.3});}
  // 가슴 바람 핵
  {const c=[0,6.4*bw,sh-4];B.ball(c,1.6,'#d0fff0',{glow:wc,d:-.32});for(let i=0;i<3;i++){const a=t/120+i*2.09;B.line([W3_a(c,[Math.cos(a)*1.4,.2,Math.sin(a)*1.4]),W3_a(c,[Math.cos(a+1.2)*2.8,.2,Math.sin(a+1.2)*2.8])],'#ffffff',.3,{d:-.34});}}
  // 떠도는 잎
  for(let i=0;i<5;i++){const a=sp*.6+i*1.26,z=3+((i*7+t/100)%22),q=[Math.cos(a)*(8+i),Math.sin(a)*5,z];B.poly([q,W3_a(q,[.8,.3,.5]),W3_a(q,[1.4,0,0]),W3_a(q,[.6,-.3,-.4])],i%2?'#7ac060':'#a0d070',{d:Math.sin(a)>0?-.4:.4});}
  if(mode==='skill')for(let i=0;i<3;i++){const a=t/80+i*2.1;B.arc([[Math.cos(a)*6,10+i*3,H],[Math.cos(a+1)*9,14+i*3,H+3],[Math.cos(a+2)*6,18+i*3,H]],wc,1.2);}}}]);

// 183. 독침 킬러비 — 가슴 솜털·배 줄무늬 띠(털)·겹눈 낱눈·더듬이·큰턱·날개 시맥·다리 마디와 털·독침 독방울
Q.push(['독침 킬러비',{
 detail(B,K){const g=W3_Bg(B),{S,L,bw,t,mode,f,snap,hp,hr,h}=g,ab=S[0],th=S[1],yl='#8ac020',bk='#1a2010',fc='170,255,60',att=mode==='attack'||mode==='skill';
  // 배 줄 띠 + 털 가장자리
  for(let i=0;i<4;i++){const y=ab.p[1]+ab.r*(.6-i*.42),rr=ab.r*Math.sqrt(Math.max(.1,1-Math.pow((.6-i*.42),2)))*.98;for(let k=0;k<8;k++){const a=(k/8-.5)*3.6,a2=((k+1)/8-.5)*3.6;B.cap(W3_a([0,y,ab.p[2]],[Math.sin(a)*rr,0,Math.cos(a)*rr*.82]),W3_a([0,y,ab.p[2]],[Math.sin(a2)*rr,0,Math.cos(a2)*rr*.82]),ab.r*.26,i%2?'#d8f040':bk,{d:-.12});}}
  for(let i=0;i<12;i++){const a=i/12*6.283;const c=W3_a(th.p,[Math.cos(a)*th.r*.9,Math.sin(a)*th.r*.5,th.r*.55+Math.abs(Math.sin(a))*.2]);B.cap(c,W3_a(c,[Math.cos(a)*.6,Math.sin(a)*.4,.7]),.6,i%2?'#c8e060':'#a0c030',{w1:.1,d:-.1});}
  B.ball(W3_a(th.p,[0,0,th.r*.5]),th.r*.7,'#a8d040',{flat:1,sy:.6,alpha:.8,d:-.11});
  // 겹눈(낱눈 점·광택)·더듬이·큰턱
  for(const s2 of[-1,1]){const e=W3_a(hp,[s2*hr*.55,hr*.45,hr*.2]);B.ball(e,hr*.42,'#801010',{sy:1.2,d:-.06});for(let i=0;i<5;i++)B.ball(W3_a(e,[s2*hr*.1*(i%2),hr*.15,hr*(.2-i*.1)]),hr*.07,'#c02020',{flat:1,d:-.08});B.ball(W3_a(e,[-s2*hr*.05,hr*.25,hr*.25]),hr*.1,'#ffffff',{flat:1,alpha:.7,d:-.09});
    const a=W3_a(hp,[s2*hr*.25,hr*.6,hr*.7]),b=W3_a(a,[s2*1.2,1.2,2.2+Math.sin(t/200+s2)*.3]),c=W3_a(b,[s2*.6,2,-.6]);B.cap(a,b,.35,bk,{d:-.07});B.cap(b,c,.3,bk,{w1:.2,d:-.07});B.ball(c,.35,bk,{d:-.07});
    B.cap(W3_a(hp,[s2*hr*.35,hr*.8,-hr*.35]),W3_a(hp,[s2*hr*(.15-snap*.2),hr*1.3,-hr*.6]),.5,'#3a2a10',{w1:.15,d:-.1});}
  // 날개 시맥
  {const fl=Math.sin(t/60+f*2)*.6;for(const gg of[-1,1])for(const[dy,len]of[[1,1],[-2,.85]]){const r0=[gg*2,dy,h+th.r*0+S[1].p[2]-h+2],tp=[gg*9*len,dy+3,h+5+fl*4],tq=[gg*9*len*1.05,dy-2,h+4+fl*3];B.line([r0,W3_m(tp,tq,.3)],'#8090a0',.25,{d:-.31});B.line([W3_m(r0,tp,.4),W3_m(tp,tq,.7)],'#8090a0',.2,{d:-.31});B.line([r0,tp],'#6a7a8a',.3,{d:-.31});}}
  // 다리 마디 털
  for(const lg of g.L){B.ball(lg.knee,.6,bk,{d:-.06});for(const tt of[.3,.6]){const q=W3_m(lg.knee,lg.ft,tt);B.cap(q,W3_a(q,[lg.sg*.5,-.3,.5]),.25,'#c8e060',{w1:.05,d:-.07});}}
  // 독침·독방울
  {const a=[0,ab.p[1]-ab.r*.8,ab.p[2]],b=W3_a(a,[0,-3-(att?2:0),-1.5]);B.cap(a,W3_m(a,b,.3),1.3,'#2a3010',{w1:1,d:-.05});B.line([W3_m(a,b,.4),b],'#e0e0d0',.25,{d:-.07});const ph=(t/300)%1;B.ball(W3_a(b,[0,-.2,-.4-ph*1.4]),.45,'#c0ff40',{glow:fc,alpha:1-ph*.6,d:-.08});if(att)B.glow(b,2.4,fc,.7);}}}]);


// 186. 꿈의 혼령 — 유령 HQ를 연보라 꿈빛으로(족쇄→별 리본) + 초승달 머리장식·흩날리는 긴 머리·반투명 나비 날개 베일·별 반짝임·꿈 방울
Q.push(['꿈의 혼령',{cloth:'#e8c8f0',armor:'#e8c8f0',sleeve:'#dcbce8',
 detail(B,K){W3_inh(B,K,'유령',{'#c8d4e0':'#e8d0f0','#c8d2dc':'#e8c8f0','190,225,255':'230,180,255','#e8f0f8':'#f8eeff','#d8e2ec':'#f0dcf8','#bcc8d4':'#dcbce8','#a8b6c4':'#c8a0d8','#a8b4c4':'#c8a8dc','#8e9cae':'#b090c8','#8a8a96':'#c0a8e0','#70707a':'#a888d0','#5a5a64':'#9a7ac8','#4a4a52':'#8a6ab8'});
  const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,{mode,f,t}=B,pc='230,180,255';
  // 나비 날개 베일(등)
  const fl=Math.sin(t/300+f)*.15;for(const g of[-1,1]){B.poly([[g*2,-4.5*bw,sh],[g*13,-7,sh+8+fl*10],[g*15,-8,sh+1],[g*9,-6,sh-3]],'#d8b0f0',{alpha:.38,edge:'#f8e8ff',ew:.4,d:.35});B.poly([[g*2,-4.5*bw,sh-3],[g*10,-7,sh-7],[g*8,-6.5,sh-12+fl*6],[g*3,-5,sh-8]],'#c8a0f0',{alpha:.32,edge:'#f8e8ff',ew:.4,d:.36});
    B.ball([g*11,-7.2,sh+3],1.1,'#ffffff',{alpha:.6,glow:pc,d:.34});}
  // 흩날리는 긴 머리
  for(let i=0;i<8;i++){const a=(i/7-.5)*2.6,sw=Math.sin(t/260+i)*.25;const b=P(Math.sin(a)*.85,-.4,.5),c=P(Math.sin(a)*1.1+sw,-1.4,-.4),d=P(Math.sin(a)*1.2-sw,-2,-1.6);B.cap(b,c,hr*.3,i%2?'#f8e8ff':'#e0c8f4',{w1:hr*.2,alpha:.9,d:.02});B.cap(c,d,hr*.2,i%2?'#f8e8ff':'#e0c8f4',{w1:hr*.04,alpha:.75,d:.03});}
  // 초승달 머리장식
  {const c=P(0,.3,1.1);B.ball(c,hr*.32,'#f8e890',{glow:'255,240,160',d:-.04});B.ball(W3_a(c,[.25*hr,.05,.1*hr]),hr*.28,'#e8c8f0',{d:-.05});B.ball(P(0,.95,.45),hr*.1,'#a080ff',{glow:pc,d:-.07});}
  // 별 반짝임·꿈 방울
  for(let i=0;i<6;i++){const ph=((t/1600)+i/6)%1,a=i*1.05+t/2000;const q=[Math.cos(a)*10,Math.sin(a)*6,H*.4+ph*24];if(i%2)B.spark(q,1.6*(1-ph)+.6,'255,240,200',(1-ph)*.8);else{B.ball(q,1+ph,'#f0e0ff',{alpha:(1-ph)*.35,d:0});B.ball(W3_a(q,[-.3,0,.4]),.3,'#ffffff',{flat:1,alpha:(1-ph)*.7,d:-.01});}}
  if(mode==='skill')for(let i=0;i<5;i++){const a=i/5*6.283+t/300;B.glow([Math.cos(a)*7,Math.sin(a)*4+4,H+4+f*2],2,pc,.6);}}}]);

// 189. 에이션트 자이언트 — 오우거 HQ를 회청 돌피부로 + 빛나는 고대 룬 문신·흰 수염 땋기·돌 견갑·이끼·석판 허리띠·돌 머리 몽둥이 보강·서리 숨
Q.push(['에이션트 자이언트',{sleeve:'#8a9aa0',cloth:'#4a5a6a',
 detail(B,K){W3_inh(B,K,'오우거',{'#a8805c':'#8a9aa0','#9c7656':'#4a5a6a','#3a2c1e':'#3a4a5a','#8a6a3a':'#6a7a7a','#6a5038':'#5a6a70','#4a3424':'#3a4450','#4a3020':'#3a4248'});
  const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,{mode,f,t}=B,rc='180,220,255',pu=.55+.3*Math.sin(t/300+f);
  // 룬 문신(가슴·팔)
  const y=6.6*bw;B.line([[-3*bw,y,sh-2],[-1*bw,y+.2,sh-4],[-3*bw,y,sh-6],[-1*bw,y+.2,sh-8]],'rgba(150,210,255,'+pu+')',.55,{d:-.38});B.line([[3*bw,y,sh-2],[1.5*bw,y+.2,sh-5],[3*bw,y,sh-8]],'rgba(150,210,255,'+pu+')',.55,{d:-.38});B.glow([0,y,sh-5],2.4,rc,.35*pu);
  for(const sg of[-1,1]){const el=W.el(sg),sp=W.sp(sg);B.line([W3_m(sp,el,.3),W3_a(W3_m(sp,el,.55),[0,1.4,0]),W3_m(sp,el,.8)],'rgba(150,210,255,'+pu+')',.5,{d:-.15});
    // 돌 견갑 + 이끼
    W3_rock(B,W3_a(sp,[sg*.6,0,1.4]),2.6*bw,'#7a8488',{sy:.6,d:-.34});for(let i=0;i<4;i++)B.ball(W3_a(sp,[sg*(i-1.5)*.9,1.4,3.1]),.7,i%2?'#5a7a3a':'#4a6a30',{flat:1,sy:.5,d:-.37});}
  // 석판 허리띠
  for(let i=-2;i<=2;i++)B.poly([[i*2.6*bw-1.2*bw,6.2*bw,H+3.4],[i*2.6*bw+1.2*bw,6.2*bw,H+3.4],[i*2.6*bw+1.1*bw,6.3*bw,H+.6],[i*2.6*bw-1.1*bw,6.3*bw,H+.6]],i%2?'#6a7478':'#7a8488',{grad:1,edge:'#2a3034',ew:.4,d:-.3});
  B.ball([0,6.5*bw,H+2],1,'#80c0ff',{glow:rc,d:-.32});
  // 흰 수염 땋기·눈썹
  for(let i=0;i<3;i++){const x=(i-1)*.3,a=P(x,.92,-.75),b=P(x*1.1,.98,-1.9-(i===1?.4:0));B.cap(a,b,hr*.26,'#dcdcdc',{w1:hr*.12,d:-.2});for(let k=0;k<4;k++)B.line([W3_m(a,b,k/4),W3_a(W3_m(a,b,k/4+.12),[hr*.12,0,0])],'#9aa0a8',.35,{d:-.21});B.cap(W3_m(a,b,.8),W3_m(a,b,.88),hr*.18,'#6a5a3a',{d:-.21});}
  for(const g of[-1,1])B.cap(P(.7*g,.75,.5),P(.15*g,.92,.38),hr*.18,'#e0e0e0',{w1:hr*.08,d:-.12});
  // 서리 숨
  for(let i=0;i<3;i++){const ph=((t/700)+i/3)%1;B.ball(P(Math.sin(i)*.2,1.2+ph*1.5,-.4+ph*.4),hr*(.2+ph*.4),'#e8f4ff',{alpha:(1-ph)*.35,d:-.25});}
  if(mode==='skill')for(let i=0;i<5;i++){const a=i/5*6.283;W3_rock(B,[Math.cos(a)*9,Math.sin(a)*5,.8+f*.4],1.2,'#7a8488',{d:0});}}}]);

// 192. 마이노 — 소머리 전사: 쇠고리 두른 마디 뿔·코뚜레·콧김·목 갈기·근육 결·가죽 멜빵(리벳)·털 허리가리개·편자 발굽·쇠 팔찌·못 박힌 큰 몽둥이
Q.push(['마이노',{
 detail(B,K){const W=W3_J(B),bw=W.bw,H=W.H,sh=W.sh,P=W.HP,hr=W.J.hr,{mode,f,t}=B,sk='#8a6a4a',dk='#4a3420',lt='#3a2414',ir='#6a6e74';
  // 뿔 쇠고리·마디
  for(const g of[-1,1]){const a=P(.7*g,0,.55),b=P(1.6*g,.3,.8),c2=P(1.7*g,.8,1.4);for(const tt of[.25,.5,.75])B.ball(W3_m(a,b,tt),hr*.33*(1-tt*.3),'#c8b898',{sy:.45,d:-.03});B.cap(W3_m(a,b,.55),W3_m(a,b,.65),hr*.4,ir,{d:-.04});W3_riv(B,[W3_a(W3_m(a,b,.6),[0,hr*.2,hr*.15])],'#c0c4c8',.35,-.05);B.cap(W3_m(b,c2,.75),c2,hr*.14,'#3a3020',{w1:hr*.05,d:-.04});}
  // 코뚜레·콧구멍·눈두덩·콧김
  {const c=P(0,1.38,-.55);for(let i=0;i<8;i++){const a=i/8*6.283;B.ball(W3_a(c,[Math.cos(a)*hr*.22,.1,Math.sin(a)*hr*.22-hr*.15]),hr*.06,'#d0b040',{d:-.12});}
   for(const g of[-1,1]){B.ball(P(.2*g,1.3,-.3),hr*.08,'#1a0a06',{flat:1,d:-.11});B.cap(P(.62*g,.62,.55),P(.15*g,.82,.45),hr*.18,dk,{d:-.09});const ph=((t/450)+(g>0?.5:0))%1;B.ball(P(.3*g+g*ph*.4,1.5+ph*.6,-.4-ph*.2),hr*(.12+ph*.25),'#e8e8e8',{alpha:(1-ph)*.45,d:-.12});}}
  // 목 갈기·어깨 털
  for(let i=0;i<10;i++){const a=(i/9-.5)*2.8;B.cap(P(Math.sin(a)*.8,-.6,.3),P(Math.sin(a)*1.2,-1.3,-.9),hr*.3,i%2?dk:'#5a4028',{w1:hr*.08,d:.02});}
  for(const sg of[-1,1]){const sp=W.sp(sg);for(let i=0;i<5;i++)B.cap(W3_a(sp,[sg*(i-2)*.8,.2,2]),W3_a(sp,[sg*(i-2)*1,1,-.6]),1.1,i%2?dk:'#5a4028',{w1:.2,d:-.3});
    W3_bracer(B,W,sg,ir,{band:'#3a3a40',stud:'#c0c4c8'});
    // 편자 발굽
    const ft=W.ft(sg);B.ball(W3_a(ft,[0,1.6,.5]),2.2*bw,'#2a1e14',{sy:1.2,d:-.08});B.cap(W3_a(ft,[-1.6*bw,2.4,.3]),W3_a(ft,[1.6*bw,2.4,.3]),.6,ir,{d:-.1});B.line([W3_a(ft,[0,3.2,.6]),W3_a(ft,[0,2.4,.8])],'#0a0604',.4,{d:-.11});}
  // 근육 결
  for(const g of[-1,1]){B.line([[g*.4,6.6*bw,sh-1],[g*3.6*bw,6.4*bw,sh-3.5],[g*4.2*bw,6*bw,sh-6]],dk,.6,{d:-.3});B.line([[g*1.2*bw,6.7*bw,sh-7],[g*3*bw,6.5*bw,sh-8.5]],dk,.5,{d:-.3});}
  // 가죽 멜빵(대각)·리벳
  B.cap([-7.4*bw,6*bw,sh-1],[6*bw,6.2*bw,H+3],1.6,lt,{d:-.34});for(let i=0;i<5;i++)W3_riv(B,[W3_m([-7.4*bw,6.6*bw,sh-1],[6*bw,6.8*bw,H+3],.1+i*.2)],'#c0c4c8',.4,-.37);
  B.cap([-7.4*bw,-6*bw,sh-1],[6*bw,-6.2*bw,H+3],1.6,lt,{d:.34});
  // 털 허리가리개
  W3_belt(B,W,lt,{buckle:'#d0b040'});for(let i=0;i<7;i++){const x=(i-3)*1.6*bw;B.cap([x,5.6*bw,H+1],[x*1.1,5.8*bw,H-4.5-(i%2)*1.2],1.5,i%2?'#6a5038':'#5a4028',{w1:.6,d:-.28});}
  // 못 박힌 큰 몽둥이
  W3_club(B,W,{wood:'#5a3a20',wrap:'#2a1a10',spikes:1});
  {const h=W.p.hR,d=W.p.dS,pt=k=>W3_a(h,d,k),pp=W3_perp(d),qq=W3_n(...W3_x(d,pp));for(let i=0;i<8;i++){const a=i/8*6.283,dir=W3_a(W3_a([0,0,0],pp,Math.cos(a)),qq,Math.sin(a)),q=W3_a(pt(13+(i%2)*3),dir,3.6);B.cap(q,W3_a(q,dir,1.8),.7,'#a8acb0',{w1:.1,d:-.07});}B.cap(pt(9),pt(10),5,ir,{d:-.06});}
  if(mode==='attack'&&f===1)B.glow(W.wp(16),3,'255,180,120',.5);}}]);

// 195. 테라 드래곤 — 드레이크 HQ(흙빛) + 이끼 낀 바위 등껍질 판·자라는 녹색 수정·대지 균열 빛·돌 뿔 마디·흙먼지 발걸음
Q.push(['테라 드래곤',{
 detail(B,K){W3_inh(B,K,'드레이크',{'#e0c080':'#8a9a5a','255,140,40':'190,255,90'});
  const g=W3_Qg(B),{h,L,bw,ny,R0,t,mode,f,walk}=g,sh=B.s.shell||'#5a6a3a',gc='190,255,90';
  // 바위 등판(가장자리 판)·이끼
  for(let i=0;i<8;i++){const a=i/8*6.283,c=[Math.cos(a)*R0*1.05,ny*.6+Math.sin(a)*R0*1.05,h+R0*.75];W3_rock(B,c,R0*.32,i%2?'#6a6a50':'#7a7458',{sy:.6,d:-.24});B.ball(W3_a(c,[0,0,R0*.2]),R0*.16,i%3?'#5a7a30':'#4a6a28',{flat:1,sy:.5,d:-.27});}
  for(let i=0;i<5;i++){const a=i*1.3;B.ball([Math.cos(a)*R0*.55,ny*.6+Math.sin(a)*R0*.55,h+R0*1.32],R0*.14,'#5a8a34',{flat:1,sy:.5,d:-.34});}
  // 수정(등 위로 솟음)
  for(const[x,y,ht,ang]of[[-.3,.2,5,-.3],[.35,-.25,6.5,.25],[0,-.6,4,0],[.1,.55,4.5,.15]]){const b=[x*R0,ny*.6+y*R0,h+R0*1.25],tp=W3_a(b,[ang*4,-1,ht]);B.cap(b,tp,1.7,'#80d060',{w1:.25,alpha:.9,d:-.36});B.cap(W3_a(b,[.3,0,0]),W3_a(tp,[.2,0,-.6]),.5,'#e0ffc0',{w1:.1,alpha:.8,d:-.37});B.glow(tp,1.4,gc,.5);}
  // 대지 균열 빛(옆구리)
  for(const sx of[-1,1])W3_crack(B,[[sx*R0*.98,L*.2+ny,h+R0*.3],[sx*R0*1.02,L*.05+ny,h+R0*.05],[sx*R0*.98,-L*.1+ny*.7,h+R0*.2]],{w:.6,col:'#a0e040',gc:gc,gr:1.6,d:-.25});
  // 돌 뿔 마디
  {const H0=W3_qHead(B,g,0,1),{r,Hp}=H0;for(const s2 of[-1,1]){const a=Hp(.4*s2,-.3,.6),b=Hp(.9*s2,-1.6,1.4);for(let i=1;i<4;i++)B.ball(W3_m(a,b,i*.24),r*.3*(1-i*.12),i%2?'#8a8470':'#a09a80',{sy:.55,d:-.05});}}
  // 흙먼지
  if(walk)for(const lg of g.legs)if(lg.ft[2]<.5)for(let i=0;i<2;i++)B.ball(W3_a(lg.ft,[(i-.5)*2,-1,.8]),1.4,'#a09070',{alpha:.3,d:-.02});
  if(mode==='skill'&&f===2)for(let i=0;i<4;i++)W3_rock(B,[Math.sin(i*1.7)*4,L*.5+ny+8+i*3.5,h+2+Math.cos(i)*2],1.4,'#8a7a58',{d:-.4});}}]);

})();
