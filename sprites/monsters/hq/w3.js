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

})();
