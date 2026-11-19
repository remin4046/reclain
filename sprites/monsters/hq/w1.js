/* 리클라인 몬스터 고품질 업그레이드 — 작업자 1 */
(window.MRHQ=window.MRHQ||[]);
(function(){
const Q=window.MRHQ;
// ---------- 공통 헬퍼(작업자1 전용) ----------
const W1_a3=(a,b,s=1)=>[a[0]+b[0]*s,a[1]+b[1]*s,a[2]+b[2]*s];
const W1_mid=(a,b,t=.5)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const W1_n=(x,y,z)=>{const l=Math.hypot(x,y,z)||1;return[x/l,y/l,z/l];};
const nrmW=(x,y,z)=>{const l=Math.hypot(x,y,z)||1;return[x/l,y/l,z/l];};
const W1_cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
// biped 관절 재계산(plan과 같은 식)
function W1_joints(B){const J=B.J,p=J.p,bw=J.bw,H=J.H,sh=J.sh;const o={};
  o.sp=sg=>[9*sg*bw,0,sh-1];
  o.h=sg=>sg>0?p.hR:p.hL;
  o.el=sg=>{const h=o.h(sg);return[(9*sg*bw+h[0])/2+2*sg,h[1]/2-1.8,(sh-1+h[2])/2-1.5];};
  o.ft=sg=>sg>0?p.fR:p.fL;
  o.hip=sg=>[4*sg*bw,0,H];
  o.kn=sg=>{const ft=o.ft(sg);return[(4*sg*bw+ft[0])/2,ft[1]/2+2.5,(H+ft[2])/2+1];};
  o.ftp=sg=>{const ft=o.ft(sg);return[ft[0],ft[1],ft[2]+1.5];};
  o.wp=k=>W1_a3(p.hR,p.dS,k);
  o.HP=(x,y,z)=>[J.hd[0]+x*J.hr,J.hd[1]+y*J.hr,J.hd[2]+z*J.hr];
  return o;}
function W1_rivets(B,pts,col,r=.55){for(const q of pts)B.ball(q,r,col,{d:-.45});}
// 어깨 판금(겹판 + 리벳 + 선택적 가시)
function W1_pauldron(B,K,J,sg,col,o={}){const bw=J.bw,sh=J.sh,c=[9.6*sg*bw,.2,sh+.6],r=(o.r||4.2)*bw;
  B.ball(c,r,col,{sy:.78,d:-.32});B.ball(W1_a3(c,[1.6*sg,0,-2.6]),r*.82,K.tone(col,-.12),{sy:.6,d:-.33});
  B.cap(W1_a3(c,[-.4*sg,r*.75,-r*.35]),W1_a3(c,[2.4*sg,r*.65,-r*.55]),.7,K.tone(col,.35),{d:-.4});
  W1_rivets(B,[W1_a3(c,[0,r*.7,r*.25]),W1_a3(c,[1.8*sg,r*.55,-.2]),W1_a3(c,[-1.4*sg,r*.6,.4])],o.rivet||'#d8c890',.5);
  if(o.spikes)for(let i=0;i<o.spikes;i++){const a=W1_a3(c,[(.5+i*1.4)*sg,-.6+i*.8,r*.55]);B.cap(a,W1_a3(a,[1.2*sg,-.2,2.8]),1.1,o.spikeC||'#d8d0c0',{w1:.15,d:-.36});}}
// 팔뚝 보호대
function W1_bracer(B,K,W,sg,col,o={}){const el=W.el(sg),h=W.h(sg),a=W1_mid(el,h,.25),b=W1_mid(el,h,.8),w=(o.w||4.6);
  B.cap(a,b,w,col,{w1:w*.9,d:-.05});for(const t of[.1,.5,.9])B.cap(W1_a3(W1_mid(a,b,t),[-1,0,0],w*.42),W1_a3(W1_mid(a,b,t),[1,0,0],w*.42),.55,o.band||K.tone(col,-.4),{d:-.12});
  if(o.stud)W1_rivets(B,[W1_a3(W1_mid(a,b,.3),[0,w*.45,0]),W1_a3(W1_mid(a,b,.7),[0,w*.42,0])],o.stud,.45);}
// 정강이 보호대 + 무릎
function W1_greave(B,K,W,sg,col,o={}){const kn=W.kn(sg),ft=W.ftp(sg),a=W1_mid(kn,ft,.15),b=W1_mid(kn,ft,.85),w=o.w||5;
  B.cap(a,b,w,col,{w1:w*.8,d:-.06});B.ball(W1_a3(kn,[0,1.2,0]),w*.48,o.knee||K.tone(col,.15),{sy:.85,d:-.15});
  if(o.strap)for(const t of[.3,.7])B.cap(W1_a3(W1_mid(a,b,t),[-1,1,0],w*.4),W1_a3(W1_mid(a,b,t),[1,1,0],w*.4),.6,o.strap,{d:-.12});}
// 가슴 띠(대각 가죽끈 + 징)
function W1_harness(B,K,J,col,o={}){const bw=J.bw,H=J.H,sh=J.sh,y=(o.y||5.4)*bw;
  const a=[-8*bw,y*.75,sh-1],b=[6*bw,y,H+2.5];B.cap(a,b,1.9,col,{d:-.35});
  if(o.cross){const a2=[8*bw,y*.75,sh-1],b2=[-6*bw,y,H+2.5];B.cap(a2,b2,1.9,K.tone(col,-.1),{d:-.33});B.ball([0,y+.5,(sh+H)/2+1],1.5,o.stud||'#c8b070',{d:-.5});}
  if(o.stud)for(let i=1;i<5;i++)B.ball(W1_mid(a,b,i/5),.5,o.stud,{d:-.48});
  // 등쪽
  B.cap([-8*bw,-y*.7,sh-1],[6*bw,-y*.85,H+2.5],1.9,K.tone(col,-.2),{d:.0});}
function W1_buckle(B,J,col='#c8a850'){const bw=J.bw;B.ball([0,6.6*bw,J.H+1.5],1.5,col,{sx:1.2,sy:.9,d:-.5});B.ball([0,6.8*bw,J.H+1.5],.7,'#3a2a14',{flat:1,d:-.55});}
// 허리 앞뒤 천(로인클로스)
function W1_loin(B,K,J,col,o={}){const bw=J.bw,H=J.H,sw=J.p.sw||0,L=o.len||8,w=o.w||3.6;
  B.poly([[-w*bw,6*bw,H+1],[w*bw,6*bw,H+1],[w*.8*bw,6.4*bw+sw*1.2,H-L],[0,6.6*bw+sw*1.2,H-L-1.2],[-w*.8*bw,6.4*bw+sw*1.2,H-L]],col,{grad:1,d:-.38});
  if(o.back)B.poly([[-w*bw,-5.5*bw,H+1],[w*bw,-5.5*bw,H+1],[w*.8*bw,-6*bw-sw,H-L],[-w*.8*bw,-6*bw-sw,H-L]],K.tone(col,.12),{d:.1});}
// 무기 디테일
function W1_axe(B,K,W,s,o={}){const pt=W.wp,wc=s.wcol||'#9aa0a8',hi=o.hi||'#eef2f6';
  for(let i=0;i<4;i++)B.cap(pt(-1+i*1.3),pt(-.4+i*1.3),2.3,i%2?'#2a1a10':'#4a3020',{d:-.08});
  B.ball(pt(-6.3),1.4,'#7a7068',{d:-.05});
  const a=pt(15),b=pt(21);B.poly([a,b,W1_a3(b,[-1,0,0],2.6),W1_a3(W1_mid(a,b),[-1,0,0],4.2),W1_a3(a,[-1,0,0],2.6)],K.tone(wc,-.25),{grad:1,d:-.15});
  B.line([W1_a3(a,[1,0,0],6.6),W1_a3(W1_mid(a,b,.5),[1,0,0],7.2),W1_a3(b,[1,0,0],5.8)],hi,.8);
  B.cap(W1_a3(a,[1,0,0],.6),W1_a3(b,[1,0,0],.6),1.1,K.tone(wc,-.4),{d:-.25});W1_rivets(B,[W1_a3(W1_mid(a,b),[1.4,0,0])],'#d8c890',.5);
  B.cap(pt(20.6),pt(23),1.2,K.tone(wc,.1),{w1:.2,d:-.1});}
function W1_sword(B,K,W,s,o={}){const pt=W.wp,wc=s.wcol||'#b9c0c8',n=o.n||22;
  for(let i=0;i<3;i++)B.cap(pt(-3+i*1.7),pt(-2.2+i*1.7),2.3,i%2?'#1a120c':'#5a3a24',{d:-.08});B.ball(pt(-4),1.5,o.pommel||'#c0a050',{d:-.08});
  B.cap(pt(3),pt(n-2),.7,K.tone(wc,.5),{w1:.25,d:-.2});B.ball(pt(2),1.1,o.gem||'#a02020',{d:-.2});
  if(o.guard)B.cap(W1_a3(pt(2),[1,0,0],-4.2),W1_a3(pt(2),[1,0,0],4.2),1.6,o.guard,{d:-.15});}
function W1_spear(B,K,W,s,o={}){const pt=W.wp,wc=s.wcol||'#b9c0c8';
  for(let i=0;i<3;i++)B.cap(pt(-2+i*1.6),pt(-1.3+i*1.6),1.8,i%2?'#2a1a10':'#5a3a20',{d:-.08});
  B.cap(pt(20.5),pt(22.5),2,o.socket||'#5a5048',{d:-.1});B.cap(pt(23),pt(28.6),.6,K.tone(wc,.55),{w1:.15,d:-.2});
  B.cap(W1_a3(pt(22),[1,0,0],-2.4),W1_a3(pt(22),[1,0,0],2.4),.9,K.tone(wc,-.2),{d:-.12});
  if(o.tassel){const t=B.t,sw=Math.sin(t/250+B.f)*1;const a=pt(20.5);B.cap(a,W1_a3(a,[sw,-1,-5]),1.4,o.tassel,{w1:.5,d:-.05});B.cap(a,W1_a3(a,[sw-1,-1.5,-4]),1,K.tone(o.tassel,-.2),{w1:.4,d:-.04});}
  B.cap(pt(-16),pt(-14.5),1.6,'#7a7068',{d:-.05});}
function W1_club(B,K,W,s,o={}){const pt=W.wp,wc=s.wcol||'#6a4a2a';
  for(let i=0;i<3;i++)B.cap(pt(-2.5+i*1.5),pt(-1.8+i*1.5),2.6,i%2?'#2a1a10':'#4a3020',{d:-.08});
  for(const t of[9,14])B.cap(W1_a3(pt(t),[1,0,0],-2.6),W1_a3(pt(t),[1,0,0],2.6),1,o.band||'#5a5a60',{d:-.15});
  const sp=o.spikes??6;const d=W.dS||[0,0,1];
  for(let i=0;i<sp;i++){const a=i/sp*Math.PI*2,t=11+(i%3)*2.5;const u=W1_n(Math.cos(a),Math.sin(a)*.6,.2);const c=W1_a3(pt(t),u,2.6+t*.12);B.cap(c,W1_a3(c,u,2.2),1,o.spikeC||'#c8c8c0',{w1:.1,d:-.2});}
  B.cap(pt(12),pt(16),.9,K.tone(wc,.3),{d:-.2,alpha:.6});}
function W1_staff(B,K,W,s,o={}){const pt=W.wp;
  for(let i=0;i<4;i++)B.cap(pt(-2+i*1.4),pt(-1.4+i*1.4),1.8,i%2?'#1a1210':K.tone(s.scol||'#5a3e22',-.3),{d:-.08});
  B.cap(pt(-14),pt(-12.5),1.6,o.metal||'#a08a50',{d:-.06});B.cap(pt(12.5),pt(14),2.2,o.metal||'#a08a50',{d:-.1});
  for(const g of[-1,1]){const a=pt(13.5);B.cap(a,W1_a3(W1_a3(a,[g,0,0],3.2),W.dS||[0,0,1],4),.9,o.metal||'#a08a50',{w1:.4,d:-.12});B.cap(W1_a3(W1_a3(a,[g,0,0],3.2),W.dS||[0,0,1],4),W1_a3(pt(18.5),[g*.6,0,0]),.6,o.metal||'#a08a50',{w1:.3,d:-.12});}}
// 머리 디테일: 오크 얼굴
function W1_orcFace(B,K,J,W,s,o={}){const P=W.HP,r=J.hr,sk=s.skin;
  B.ball(P(0,.55,-.7),r*.55,K.tone(sk,-.2),{sx:1.15,sy:.6,d:-.02});
  for(const g of[-1,1]){B.cap(P(.32*g,.92,-.58),P(.42*g,1.1,.05),r*.2,'#efe6cc',{w1:r*.06,d:-.12});B.cap(P(.3*g,.95,-.55),P(.36*g,1,-.45),r*.12,'#b8a888',{d:-.11});}
  B.cap(P(-.62,.8,.38),P(-.05,.92,.28),r*.2,K.tone(sk,-.4),{d:-.08});B.cap(P(.62,.8,.38),P(.05,.92,.28),r*.2,K.tone(sk,-.4),{d:-.08});
  B.ball(P(0,1.02,-.12),r*.2,K.tone(sk,-.25),{sx:1.3,d:-.1});
  if(o.paint)B.cap(P(-.5,.88,.05),P(.5,.88,.05),r*.1,o.paint,{d:-.09,alpha:.85});
  if(o.scar)B.line([P(.2,.93,.6),P(.5,.85,-.1)],'#3a2018',.5);
  if(o.topknot){B.ball(P(0,-.35,.95),r*.38,o.topknot,{d:.02});B.cap(P(0,-.45,1.05),P(0,-1.2,.5),r*.25,o.topknot,{w1:r*.1,d:.05});B.cap(P(0,-.4,1),P(0,-.5,1.1),r*.24,'#b09050',{d:-.01});}
  if(o.earrings)for(const g of[-1,1])B.ball(P(1.35*g,-.25,.45),r*.12,o.earrings,{d:-.06});}
function W1_teeth(B,J,n=7){const bw=J.bw,z=J.sh+.3;for(let i=0;i<n;i++){const a=(i/(n-1)-.5)*1.9;const c=[Math.sin(a)*6.2*bw,Math.cos(a)*5.6*bw,z-Math.cos(a)*1.5];B.cap(c,[c[0],c[1]+.3,c[2]-1.8],.75,'#ece2c8',{w1:.2,d:-.45});}
  B.line(Array.from({length:9},(_,i)=>{const a=(i/8-.5)*2.1;return[Math.sin(a)*6.2*bw,Math.cos(a)*5.6*bw,z-Math.cos(a)*1.5+.2];}),'#3a2a1a',.4);}


// 활 디테일(왼손)
function W1_bow(B,K,J,o={}){const p=J.p,h=p.hL,up=[0,0,1],d=p.dL||[0,.5,.85];const top=W1_a3(h,up,12),bot=W1_a3(h,up,-12),m1=W1_a3(W1_mid(top,h),d,3.5),m2=W1_a3(W1_mid(bot,h),d,3.5);
  const wc=o.wood||'#5a3418';B.cap(h,m1,2,wc,{w1:1.5,d:-.1});B.cap(m1,top,1.5,wc,{w1:.8,d:-.1});B.cap(h,m2,2,wc,{w1:1.5,d:-.1});B.cap(m2,bot,1.5,wc,{w1:.8,d:-.1});
  B.cap(W1_a3(h,up,-1.6),W1_a3(h,up,1.6),2.4,o.grip||'#2a1a10',{d:-.15});for(const q of[top,bot])B.ball(q,.8,o.tip||'#d8cfb8',{d:-.12});
  B.line([W1_mid(top,m1),W1_a3(W1_mid(top,m1),d,.3)],'#c8a060',.6);
  const drawn=(B.mode==='attack'||B.mode==='skill')&&B.f<2;if(!drawn)B.line([top,bot],'#e8d8a8',.5);}
// 화살통(등)
function W1_quiver(B,K,J,o={}){const bw=J.bw,H=J.H,sh=J.sh,a=[-3.5*bw,-6.2*bw,sh+3],b=[3*bw,-6*bw,H+1];
  B.cap(a,b,3.6,o.col||'#4a2e18',{w1:3.2,d:.05});for(const t of[.15,.85])B.cap(W1_a3(W1_mid(a,b,t),[-1.8,0,0]),W1_a3(W1_mid(a,b,t),[1.8,0,0]),.7,'#a08850',{d:.02});
  for(let i=0;i<4;i++){const q=W1_a3(a,[(i-1.5)*.9,.2*(i%2),1.2+(i%2)*.8]);B.cap(q,W1_a3(q,[-.6,0,3.2]),.5,'#8a6a40',{d:.01});B.poly([W1_a3(q,[-.6,0,2.2]),W1_a3(q,[-1.6,0,3.8]),W1_a3(q,[-.6,0,3.6])],o.fl||'#d8d0c0',{d:0});}
  B.cap([-8*bw,4.8*bw,sh-.5],[5*bw,5.6*bw,H+3],1.4,'#3a2414',{d:-.35});}
// 판금 투구(코가리개·볼가리개·뿔/깃)
function W1_helm(B,K,J,W,col,o={}){const P=W.HP,r=J.hr;
  B.ball(P(0,-.02,.32),r*1.08,col,{sy:.78,d:-.04});B.cap(P(-1,.15,.05),P(1,.15,.05),r*.22,K.tone(col,-.2),{d:-.06});
  B.cap(P(0,.95,.45),P(0,1.12,-.25),r*.16,K.tone(col,.25),{w1:r*.1,d:-.14});
  for(const g of[-1,1])B.poly([P(.75*g,.55,.1),P(.95*g,.2,.05),P(.85*g,.25,-.75),P(.65*g,.65,-.55)],K.tone(col,-.1),{grad:1,d:-.1});
  B.cap(P(0,.4,1.05),P(0,-.9,.75),r*.14,K.tone(col,.35),{d:-.08});
  W1_rivets(B,[P(-.55,.85,.2),P(.55,.85,.2),P(-.95,.2,.1),P(.95,.2,.1)],o.rivet||'#d0c8a8',r*.08);
  if(o.horns)for(const g of[-1,1]){const a=P(.85*g,0,.55),b=P(1.5*g,.15,1.2),c=P(1.55*g,.5,1.9);B.cap(a,b,r*.32,o.horns,{w1:r*.2,d:-.05});B.cap(b,c,r*.2,o.horns,{w1:r*.04,d:-.05});}
  if(o.plume){const sw=Math.sin(B.t/300+B.f)*.15;B.cap(P(0,-.2,1.1),P(0,-1.2,1.5+sw),r*.3,o.plume,{w1:r*.22,d:.02});B.cap(P(0,-1.2,1.5+sw),P(0,-1.8,.4),r*.22,K.tone(o.plume,-.15),{w1:r*.08,d:.03});}}
// 비늘갑/사슬 질감(몸통 앞 점열)
function W1_scales(B,K,J,col,o={}){const bw=J.bw,H=J.H,sh=J.sh,rows=o.rows||4;
  for(let rI=0;rI<rows;rI++){const z=sh-2-rI*((sh-H-4)/rows),n=4-(rI>1?1:0);for(let i=0;i<n;i++){const x=(i-(n-1)/2)*2.8*bw+(rI%2)*.7,y=(6.4-rI*.25)*bw;B.ball([x,y,z],1.35*bw,i%2?col:K.tone(col,.12),{sy:.7,d:-.34});}}}
function W1_chain(B,K,J,col){const bw=J.bw,H=J.H,sh=J.sh;for(let r=0;r<6;r++){const z=H+2+r*(sh-H-3)/6,n=5;for(let i=0;i<n;i++){B.ball([(i-2)*2.2*bw+(r%2)*1.1,(6.2+r*.5)*bw,z],.55,r%2?col:K.tone(col,.25),{flat:1,d:-.33});}}}
// 방패 디테일
function W1_shield(B,K,J,o={}){const p=J.p,bw=J.bw,c0=W1_a3(p.hL,[0,2.5,0]),u=W1_n(1,.3,0),v=[0,0,1],R=5*bw,nn=W1_cross(u,v);const out=W1_a3(c0,nn,-.7);
  B.ball(out,1.5*bw,o.boss||'#b0a890',{d:-.75});for(let i=0;i<8;i++){const a=i/8*Math.PI*2;B.ball(W1_a3(W1_a3(out,u,Math.cos(a)*R*.82),v,Math.sin(a)*R*.82),.5,o.rivet||'#d8c890',{d:-.72});}
  if(o.mark){B.poly([W1_a3(out,v,R*.6),W1_a3(W1_a3(out,u,R*.45),v,-R*.35),W1_a3(W1_a3(out,u,-R*.45),v,-R*.35)],o.mark,{d:-.71,alpha:.9});}
  if(o.bar)B.cap(W1_a3(out,u,-R*.85),W1_a3(out,u,R*.85),1,o.bar,{d:-.72});}


// 로브 술사 세트
function W1_robe(B,K,J,W,o){const bw=J.bw,H=J.H,sh=J.sh,tr=o.trim,p=J.p;
  B.cap([-10*bw,4.3,1.4],[0,6.3,.4],1.3,tr,{d:-.18});B.cap([0,6.3,.4],[10*bw,4.3,1.4],1.3,tr,{d:-.18});
  B.cap([0,5.6*bw,sh-2],[0,6.4,1],2.6,o.band||K.tone(tr,-.45),{w1:3.4,d:-.3});
  for(let i=0;i<4;i++){const q=W1_mid([0,5.9*bw,sh-3],[0,6.6,3],i/3.3);B.ball(W1_a3(q,[0,.4,0]),.7,o.rune||tr,{flat:1,glow:o.rg,d:-.4});}
  for(const g of[-1,1]){B.line([[g*3*bw,3,H],[g*6*bw,4.8,1.2]],K.tone(o.robe,-.45),.6);B.line([[g*5*bw,2.6,H+1],[g*8.5*bw,4.4,1.2]],K.tone(o.robe,.15),.5);}
  B.cap([-7*bw,5.4*bw,H+2],[7*bw,5.4*bw,H+2],2.2,o.sash||K.tone(tr,-.3),{d:-.32});
  for(const g of[-1,1]){const a=[g*2.5,6*bw,H+1.5];B.cap(a,W1_a3(a,[g*.5,.5+p.sw*.5,-6]),1.1,o.sash||K.tone(tr,-.3),{w1:.6,d:-.33});B.ball(W1_a3(a,[g*.5,.5+p.sw*.5,-6.5]),.8,tr,{d:-.34});}
  // 어깨 망토(케이프렛)
  B.poly([[-9.5*bw,1,sh+1.5],[9.5*bw,1,sh+1.5],[11*bw,2,sh-5],[5*bw,6.5*bw,sh-6],[0,7*bw,sh-4],[-5*bw,6.5*bw,sh-6],[-11*bw,2,sh-5]],o.mantle,{grad:1,d:-.28});
  B.poly([[-9.5*bw,-1,sh+1.5],[9.5*bw,-1,sh+1.5],[11*bw,-2,sh-5],[6*bw,-6*bw,sh-7],[0,-7.5*bw,sh-8.5],[-6*bw,-6*bw,sh-7],[-11*bw,-2,sh-5]],K.tone(o.mantle,.08),{grad:1,d:.05});B.line([[11*bw,-2,sh-5],[6*bw,-6*bw,sh-7],[0,-7.5*bw,sh-8.5],[-6*bw,-6*bw,sh-7],[-11*bw,-2,sh-5]],tr,.7);
  B.line([[-11*bw,2,sh-5],[-5*bw,6.5*bw,sh-6],[0,7*bw,sh-4],[5*bw,6.5*bw,sh-6],[11*bw,2,sh-5]],tr,.7);
  // 넓은 소매 끝
  for(const g of[-1,1]){const h=W.h(g),el=W.el(g);B.cap(W1_mid(el,h,.45),W1_mid(el,h,.85),5.4*bw,o.robe,{w1:6.4*bw,d:-.02});B.cap(W1_a3(W1_mid(el,h,.86),[-2.4,0,0]),W1_a3(W1_mid(el,h,.86),[2.4,0,0]),.8,tr,{d:-.08});}
  // 두건 테두리
  const P=W.HP;B.line([P(-.7,.75,-.7),P(-.85,.72,.1),P(-.55,.75,.7),P(0,.82,.9),P(.55,.75,.7),P(.85,.72,.1),P(.7,.75,-.7)],tr,.8);}


// 해골 몸 세부(갈비·골반·쇄골·척추·관절·손가락·두개골)
function W1_skel(B,K,J,W,o={}){const bw=J.bw,H=J.H,sh=J.sh,bn=o.bone||'#e6dfcc',dk=K.tone(bn,-.35),P=W.HP,r=J.hr;
  for(let i=0;i<4;i++){const z=sh-2-i*3.2,wd=5.8-i*.5;for(const g of[-1,1]){B.cap([0,-1.5,z+.5],[g*wd,1,z],1.1,bn,{w1:1,d:-.05});B.cap([g*wd,1,z],[g*1.2,3.2,z-1.2],1,K.tone(bn,-.08),{w1:.7,d:-.12});}}
  B.cap([0,3.2,sh-1],[0,3.2,sh-10],1.5,K.tone(bn,.05),{w1:.9,d:-.15});
  for(const g of[-1,1])B.cap([g*1,2.5,sh+.5],[g*8.5*bw,.5,sh-.2],1.1,bn,{d:-.12});
  for(let i=0;i<5;i++)B.ball([0,-1.6,sh-1-i*2.6],1.1,dk,{d:.02});
  B.ball([0,.2,H+.5],3.6,bn,{sx:1.35,sy:.55,d:-.02});for(const g of[-1,1])B.ball([g*2.2,1.8,H+.5],1.1,'#2a2018',{flat:1,d:-.1});
  for(const g of[-1,1]){B.ball(W.el(g),1.4,bn,{d:-.05});B.ball(W1_a3(W.kn(g),[0,.8,0]),1.8,bn,{d:-.08});const h=W.h(g);for(let i=-1;i<=1;i++)B.cap(h,W1_a3(h,[i*.8,1.6,-1.4]),.55,bn,{w1:.3,d:-.1});}
  // 두개골: 이빨·광대·금
  for(let i=-2;i<=2;i++)B.cap(P(i*.13,.92,-.48),P(i*.13,.93,-.68),r*.09,'#f4eedc',{w1:r*.06,d:-.11});B.cap(P(-.35,.75,-.62),P(.35,.75,-.62),r*.12,'#c8c0a8',{d:-.1});
  for(const g of[-1,1])B.ball(P(.6*g,.62,-.15),r*.2,'#ddd6c0',{d:-.06});
  if(o.crack)B.line([P(.15,.8,.75),P(.3,.82,.5),P(.2,.88,.3)],'#5a4a3a',.4);
  if(o.jawDrop&&B.mode==='attack')B.ball(P(0,.6,-.85),r*.45,'#d6cfba',{sy:.6,d:-.04});}


// quad 상태 재계산(plan과 같은 식)
function W1_quad(B){const s=B.s,{mode,f,t}=B,run=mode==='run',walk=mode==='walk'||run;const h=s.h||14,L=s.len||12,bw=s.bulk||1;
  const ph=f*Math.PI/2+(run?Math.PI/4:0);let lunge=0,headUp=0,jaw=0;
  if(mode==='attack'){lunge=[-2,6,2][f];jaw=[0,1,.2][f];}if(mode==='buff'){headUp=[.4,.9,.9,.5][f];jaw=[.3,.8,.8,.3][f];}if(mode==='skill'){lunge=[-4,2,9,3][f];jaw=[0,.4,1,.2][f];}
  const ny=lunge,front=[0,L*.5+ny,h+1],R0=(s.bodyR||6)*bw,hd=[0,front[1]+4+(s.neckL||2)-headUp*2,h+5+headUp*7+(s.headZ||0)],r=(s.headR||4.3)*bw,fwd=W1_n(0,1-headUp*.3,headUp*.6),sn=s.snout??1.6,tip=W1_a3(W1_a3(hd,fwd,r*(1+sn)),[0,0,-r*.25]);
  const legs=[];const lp=[[-1,1],[1,1],[-1,-1],[1,-1],[-1,0],[1,0]].slice(0,s.legs||4);
  lp.forEach(([sx,sy],i)=>{const diag=(i%2===0)===(sy>0);const sw=walk?Math.cos(ph+(run?(sy>0?0:Math.PI*.6):(diag?0:Math.PI))):0,lift=walk?Math.max(0,Math.sin(ph+(diag?0:Math.PI)))*(run?4:2.5):0;
    const top=[sx*4*bw*(s.wideLegs||1),sy*L*.42+ny*(sy>0?1:.5),h-1],ft=[sx*4.6*bw*(s.wideLegs||1),sy*L*.42+ny*(sy>0?1:.5)+sw*(run?5:3.2),lift],kn=[top[0]*1.05,(top[1]+ft[1])/2+(sy>0?-1.5:1.5),(h+lift)/2];legs.push({sx,sy,top,kn,ft});});
  return{h,L,bw,ny,R0,hd,r,fwd,tip,jaw,headUp,legs,walk,run,ph,tail0:[0,-L*.6+ny*.5,h+2]};}
// bug 상태 재계산
function W1_bug(B){const s=B.s,{mode,f,t}=B,run=mode==='run',walk=mode==='walk'||run,bw=s.bulk||1,h=s.h||6;const ph=f*Math.PI/2+(run?Math.PI/4:0);let rear=0,lunge=0,snap=0,sting=0;
  if(mode==='attack'){lunge=[-1,4,1][f];snap=[0,1,.3][f];sting=[.3,1,.4][f];}if(mode==='buff'){rear=[.4,.9,.9,.5][f];}if(mode==='skill'){rear=[.3,.6,.2,0][f];lunge=[-2,0,5,1][f];sting=[.5,.8,1.2,.4][f];}
  const segs=s.segs,n=segs.length;const sp=segs.map(([x,y,z,r],i)=>({p:[x*bw,y+lunge*(i===n-1?1:.4),h+z+(i===n-1?rear*5:rear*2*(i/n))],r:r*bw}));
  const hd=segs[n-1],hp=[0,hd[1]+lunge,h+hd[2]+rear*5],hr=hd[3]*bw;const legs=[];const nl=s.legs||6,spread=s.spread||10;
  for(let i=0;i<nl;i++){const sg=i%2?1:-1,row=Math.floor(i/2),rows=nl/2,yb=(s.legY0??2)-row*(s.legStep||2.2)+lunge,tri=(row%2===0)===(sg>0);const sw=walk?Math.cos(ph+(tri?0:Math.PI))*(run?3.2:2.2):0,lift=walk?Math.max(0,Math.sin(ph+(tri?0:Math.PI)))*(run?2.5:1.6):0;
    legs.push({sg,root:[sg*2.5*bw,yb,h],knee:[sg*(spread*.6)*bw,yb+(row-(rows-1)/2)*2+sw*.5,h+(s.knee||5)],ft:[sg*spread*bw,yb+(row-(rows-1)/2)*4.5+sw,lift]});}
  return{bw,h,sp,hp,hr,lunge,rear,snap,sting,legs,walk};}

// ======================= 1 오크 =======================
Q.push(['오크',{cloth:'#5e4128',armor:'#4f4030',pants:'#3e3022',belt:'#2a1c10',skin:'#6a8540',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s;
  W1_harness(B,K,J,'#3a2616',{stud:'#9a9080'});W1_buckle(B,J,'#8a8070');W1_loin(B,K,J,'#4a3220',{back:1});
  W1_pauldron(B,K,J,-1,'#6a6e74',{spikes:2,rivet:'#c8c0a0'});
  B.ball([9.4*J.bw,0,J.sh+.4],3.4*J.bw,'#5a4028',{sy:.7,d:-.3});B.cap([7.5*J.bw,1.5,J.sh+1.5],[11*J.bw,1,J.sh-1.5],.7,'#2a1a10',{d:-.36});
  W1_bracer(B,K,W,1,'#4a3220',{stud:'#9a9080'});W1_bracer(B,K,W,-1,'#4a3220',{stud:'#9a9080'});
  W1_greave(B,K,W,1,'#4a3424',{strap:'#2a1a10',knee:'#6a6e74'});W1_greave(B,K,W,-1,'#4a3424',{strap:'#2a1a10',knee:'#6a6e74'});
  W1_teeth(B,J);W1_orcFace(B,K,J,W,s,{topknot:'#1a1410',paint:'#8a1a14',scar:1,earrings:'#c8b070'});
  W1_axe(B,K,W,s);}}]);

// ======================= 4 오크 스카우트 =======================
Q.push(['오크 스카우트',{armor:'#4e4029',pants:'#3e3020',cape:'#3e4e24',belt:'#2a1a10',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s;
  W1_quiver(B,K,J);W1_buckle(B,J,'#8a7a5a');W1_loin(B,K,J,'#3e4e24',{len:6});
  W1_bracer(B,K,W,-1,'#3a2414',{w:4.8,stud:'#a09070'});W1_bracer(B,K,W,1,'#3a2414',{stud:'#a09070'});
  W1_greave(B,K,W,1,'#3a2c1c',{strap:'#1e140c'});W1_greave(B,K,W,-1,'#3a2c1c',{strap:'#1e140c'});
  // 어깨 가죽 망토 고정(목 스카프)
  const bw=J.bw;B.cap([-7*bw,1,J.sh+.5],[7*bw,1,J.sh+.5],3,'#4a5a2a',{d:-.3});B.ball([0,5.2*bw,J.sh],1.6,'#b8a060',{d:-.4});B.poly([[-1,5*bw,J.sh],[1.5,5.4*bw,J.sh],[2.2,5.6*bw,J.sh-6],[-.6,5.3*bw,J.sh-5]],'#4a5a2a',{grad:1,d:-.38});
  W1_orcFace(B,K,J,W,s,{paint:'#2a3a18',earrings:'#c8b070'});
  // 가죽 두건(머리 위)
  const P=W.HP,r=J.hr;B.ball(P(0,-.1,.38),r*1.05,'#4a3a22',{sy:.7,d:-.03});B.cap(P(-.9,.4,.25),P(.9,.4,.25),r*.18,'#2a1c10',{d:-.05});B.cap(P(.4,-.5,.9),P(.9,-1.5,1.6),r*.2,'#c8c0b0',{w1:r*.05,d:.02});B.cap(P(.45,-.45,.85),P(1.1,-1.3,1.2),r*.16,'#7a4a20',{w1:r*.04,d:.02});
  W1_bow(B,K,J);}}]);
// ======================= 7 네루가 오크 =======================
Q.push(['네루가 오크',{armor:'#34404e',pants:'#24262c',skin:'#46663a',belt:'#1a1a20',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s;
  W1_scales(B,K,J,'#5a6a7c',{rows:4});W1_buckle(B,J,'#a0a8b0');W1_loin(B,K,J,'#2a3a5a',{back:1,len:9});
  B.poly([[-3*J.bw,6.3*J.bw,J.H-1],[3*J.bw,6.3*J.bw,J.H-1],[0,6.5*J.bw,J.H-5]],'#c0c8d0',{d:-.42,alpha:.6});
  for(const g of[-1,1]){W1_pauldron(B,K,J,g,'#5a6878',{spikes:g<0?3:0,rivet:'#c0c8d0',spikeC:'#c8d0d8'});W1_bracer(B,K,W,g,'#5a6878',{band:'#2a3038',stud:'#c0c8d0'});W1_greave(B,K,W,g,'#4a5868',{knee:'#6a7888',strap:'#1a1a20'});}
  W1_orcFace(B,K,J,W,s,{scar:1});W1_helm(B,K,J,W,'#4a5a6a',{horns:'#d8d0b8',rivet:'#c0c8d0'});
  W1_spear(B,K,W,s,{tassel:'#3a5aa0',socket:'#4a5868'});
  if(B.mode==='skill'||B.mode==='buff')B.glow(W.wp(26),3+B.f,'160,200,255',.5);}}]);
// ======================= 10 로바 오크 =======================
Q.push(['로바 오크',{armor:'#2a4636',pants:'#1e2c26',skin:'#567a56',belt:'#1a1410',wcol:'#c0c8c4',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s;
  W1_chain(B,K,J,'#8a948e');W1_harness(B,K,J,'#2a1c12',{cross:1,stud:'#c8b070'});W1_buckle(B,J,'#c8b070');W1_loin(B,K,J,'#2a4a3a',{back:1,len:9});
  for(const g of[-1,1]){W1_pauldron(B,K,J,g,'#3e5a4a',{spikes:g>0?2:3,rivet:'#c8b070',spikeC:'#e0dccc'});W1_bracer(B,K,W,g,'#2a3a30',{stud:'#c8b070'});W1_greave(B,K,W,g,'#2e4236',{knee:'#5a6a60',strap:'#1a1410'});}
  W1_teeth(B,J,5);W1_orcFace(B,K,J,W,s,{paint:'#c8e0c0',topknot:'#0e1a12',earrings:'#c8b070',scar:1});
  W1_shield(B,K,J,{mark:'#c0e0b0',boss:'#9aa8a0',bar:'#1a2a20'});W1_sword(B,K,W,s,{guard:'#8a7a50',gem:'#40d090'});
  if(B.mode==='skill')B.glow(W.wp(14),2+B.f,'140,255,200',.6);}}]);
// ======================= 13 코볼트 =======================
Q.push(['코볼트',{skin:'#9a5a34',cloth:'#4e3e2e',pants:'#3a2a1e',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,sk=s.skin;
  // 주둥이 이빨·콧구멍·눈두덩
  for(let i=0;i<4;i++)for(const g of[-1,1])B.cap(P(.22*g,.8+i*.2,-.45),P(.22*g,.82+i*.2,-.68),r*.08,'#f0e6d0',{w1:r*.02,d:-.1});
  B.ball(P(0,1.55,-.2),r*.2,'#0e0a08',{d:-.12});B.cap(P(-.55,.75,.35),P(.55,.75,.35),r*.18,K.tone(sk,-.35),{d:-.08});
  for(const g of[-1,1]){B.cap(P(.5*g,-.05,.82),P(.58*g,-.25,1.45),r*.15,'#e0a0a0',{w1:r*.04,d:-.06});B.cap(P(.3*g,.1,.95),P(.35*g,-.1,1.25),r*.14,'#e8dcc4',{w1:r*.04,d:-.04});}
  for(let i=0;i<5;i++)B.ball(P(Math.sin(i*2.4)*.55,-.2+i*.15,.5+Math.cos(i*1.7)*.3),r*.13,K.tone(sk,-.3),{flat:1,d:-.02});
  // 갈기·몸 털
  for(let i=0;i<5;i++)B.cap([0,-2-i*.3,J.sh+3-i*2.2],[0,-4.5-i*.3,J.sh+2-i*2.2],1.6,K.tone(sk,-.25),{w1:.3,d:.05});
  // 넝마 로인클로스·뼈 목걸이
  W1_loin(B,K,J,'#5a4430',{back:1,len:7,w:4});B.cap([-6*bw,6.2*bw,J.H+1.2],[6*bw,6.2*bw,J.H+1.2],1.6,'#2a1a10',{d:-.35});
  W1_teeth(B,J,5);B.ball([0,6*bw,J.sh-2.5],1.2,'#e8dcc4',{d:-.48});
  // 가죽 붕대·손발톱
  for(const g of[-1,1]){W1_bracer(B,K,W,g,'#6a5a44',{w:4,band:'#3a2a1a'});const ft=W.ftp(g);for(let i=-1;i<=1;i++)B.cap(W1_a3(ft,[i*.9,2,-.6]),W1_a3(ft,[i*1.1,3.4,-1.3]),.6,'#e8dcc4',{w1:.15,d:-.1});}
  // 꼬리 털끝
  for(let i=0;i<3;i++)B.cap([0,-7-i*3.5,J.H+.5-i*.6],[0,-9-i*3.5,J.H+2-i*.6],1.2,K.tone(sk,-.3),{w1:.2,d:-.05});
  // 조잡한 창: 돌촉 묶음 + 깃털
  const pt=W.wp;for(let i=0;i<3;i++)B.cap(pt(19.5+i*.8),pt(20+i*.8),1.9,'#6a5030',{d:-.12});B.cap(pt(19),W1_a3(pt(18),[1.5,0,-4]),.9,'#c84020',{w1:.3,d:-.1});B.cap(pt(19),W1_a3(pt(18),[-1,0,-4.5]),.9,'#e0d0b0',{w1:.3,d:-.1});
  B.cap(pt(23),pt(28.5),.5,'#c8ccd0',{w1:.1,d:-.2});}}]);
// ======================= 16 흑장로 =======================
Q.push(['흑장로',{cloth:'#1c1824',hood:'#18161f',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,f=B.f,t=B.t;
  W1_robe(B,K,J,W,{trim:'#8a2030',robe:s.cloth,mantle:'#2a1a22',rune:'#ff5070',rg:'255,50,80',sash:'#4a1018',band:'#140e14'});
  // 수염 가닥
  for(let i=-2;i<=2;i++)B.cap(P(i*.18,.92,-.4),P(i*.24,1.0+Math.abs(i)*.05,-1.5-(2-Math.abs(i))*.25),r*.14,i%2?'#b8b8c0':'#8a8a94',{w1:r*.04,d:-.22});
  B.cap(P(-.45,.9,-.25),P(.45,.9,-.25),r*.2,'#a8a8b0',{d:-.21});
  // 해골 장식 지팡이
  W1_staff(B,K,W,s,{metal:'#6a5a48'});const o=W.wp(16.5);B.ball(W.wp(11),1.9,'#d8d0bc',{d:-.15});B.ball(W1_a3(W.wp(11),[0,1.2,-.3]),.5,'#100808',{flat:1,glow:'255,40,70',d:-.2});
  for(let i=0;i<3;i++){const a=t/300+i*2.1+f*.7;B.ball(W1_a3(o,[Math.cos(a)*3.8,Math.sin(a)*3.8,Math.sin(a*2)*1.2]),.55,'#ff6080',{glow:'255,60,90',d:-.3});}
  // 허리 해골 장식·두루마리
  B.ball([-4*J.bw,6.4*J.bw,J.H+.5],1.3,'#d8d0bc',{d:-.45});B.ball([-4*J.bw,7*J.bw,J.H+.6],.4,'#100808',{flat:1,d:-.5});
  B.glow([0,7,J.sh-4],2.5,'255,40,70',.35);}}]);
// ======================= 19 메르키오르 =======================
Q.push(['메르키오르',{cloth:'#183626',hood:'#163224',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,f=B.f,t=B.t,bw=J.bw;
  W1_robe(B,K,J,W,{trim:'#d0c060',robe:s.cloth,mantle:'#0e2418',rune:'#80ffa0',rg:'90,255,140',sash:'#5a4a20',band:'#0e1e14'});
  // 금 메달리온·사슬
  B.line([[-6*bw,4.8*bw,J.sh+.5],[-2,6*bw,J.sh-3],[0,6.3*bw,J.sh-4],[2,6*bw,J.sh-3],[6*bw,4.8*bw,J.sh+.5]],'#e0d070',.5);
  B.ball([0,6.8*bw,J.sh-4.4],1.7,'#d8c050',{d:-.5});B.ball([0,7.2*bw,J.sh-4.4],.8,'#60ff90',{glow:'90,255,140',d:-.55});
  // 허리에 매단 마도서
  const bk=[5*bw,5*bw,J.H-1];B.poly([W1_a3(bk,[-1.6,0,1.8]),W1_a3(bk,[1.6,.5,1.8]),W1_a3(bk,[1.6,.5,-2]),W1_a3(bk,[-1.6,0,-2])],'#4a2a18',{grad:1,edge:'#d0c060',ew:.5,d:-.4});B.ball(W1_a3(bk,[0,.4,0]),.6,'#60ff90',{flat:1,glow:'90,255,140',d:-.45});
  // 두건 위 금관(관자 장식)
  for(let i=-1;i<=1;i++)B.cap(P(i*.35,.6,.75),P(i*.4,.55,1.15+(i?0:.25)),r*.14,'#d8c050',{w1:r*.04,d:-.1});B.ball(P(0,.75,.75),r*.14,'#60ff90',{flat:1,glow:'90,255,140',d:-.12});
  // 수염(짧은 흰)
  B.poly([P(-.4,.85,-.35),P(.4,.85,-.35),P(0,.92,-1.3)],'#d8d8d0',{grad:1,d:-.2});
  // 지팡이: 덩굴 감긴 나무 + 날개 고리
  W1_staff(B,K,W,s,{metal:'#c0a840'});for(let i=0;i<6;i++){const a=i*1.3;B.ball(W1_a3(W.wp(-8+i*3.4),[Math.cos(a)*1.1,Math.sin(a)*1.1,0]),.7,'#3a7a3a',{d:-.12});}
  for(let i=0;i<4;i++){const a=t/250+i*1.57;B.glow(W1_a3(W.wp(16.5),[Math.cos(a)*3.5,Math.sin(a)*3.5,Math.sin(a+f)*1.5]),1,'90,255,140',.7);}}}]);
// ======================= 22 라이칸스로프 =======================
Q.push(['라이칸스로프',{skin:'#3a3a42',cloth:'#3c3c44',fur:'#4c4c56',pants:'#26262b',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,f=B.f,t=B.t,sk=s.skin;
  const lt='#7a7a88',dk='#1e1e24';
  // 가슴 근육·복근
  for(const g of[-1,1]){B.ball([g*3.2*bw,5.6*bw,sh-4.5],3*bw,'#5a5a66',{flat:1,sx:1.1,sy:.55,d:-.3,alpha:.55});B.cap([g*.6,6*bw,sh-6.5],[g*5.5*bw,5.6*bw,sh-5.5],.6,'#1e1e24',{d:-.32,alpha:.6});}for(let i=0;i<3;i++)B.cap([-1.6,5.6*bw,H+7-i*2.2],[1.6,5.6*bw,H+7-i*2.2],.6,dk,{d:-.33,alpha:.7});
  // 어깨·등 털 갈기(층층이)
  for(let i=0;i<9;i++){const a=(i/8-.5)*2.6,x=Math.sin(a)*8*bw,y=-Math.cos(a)*3-1;const c=[x,y,sh+3-Math.abs(a)*1.2];B.cap(c,W1_a3(c,[x*.15,-3.5,-4.5]),2.4,i%2?lt:'#565662',{w1:.3,d:.02});}
  for(let i=0;i<5;i++){const c=[(i-2)*2.2,-5,sh-4-i%2*3];B.cap(c,W1_a3(c,[0,-2.5,-5]),2,i%2?'#4a4a54':lt,{w1:.2,d:.05});}
  for(let i=0;i<5;i++)B.cap([(i-2)*2.4*bw,4.2*bw,sh+1.5],[(i-2)*2.8*bw,5.6*bw,sh-3.5],2,i%2?lt:'#5a5a66',{w1:.3,d:-.35});
  // 팔·다리 털 뭉치
  for(const g of[-1,1]){const el=W.el(g);B.cap(el,W1_a3(el,[g*1.5,-2.2,-1.5]),2.2,lt,{w1:.2,d:.0});const kn=W.kn(g);B.cap(kn,W1_a3(kn,[g*1.2,-2.4,-2]),2.3,'#4a4a54',{w1:.2,d:.02});
    const h=W.h(g);for(let i=-1;i<=1;i++)B.cap(W1_a3(h,nrmW(i*.4,.8,-.3),2.5),W1_a3(h,nrmW(i*.45,.75,-.55),5.4),.75,'#f4ecd8',{w1:.12,d:-.15});
    const ft=W.ftp(g);for(let i=-1;i<=1;i++)B.cap(W1_a3(ft,[i*.9,2.2,-.8]),W1_a3(ft,[i*1.1,3.8,-1.4]),.7,'#e8e0c8',{w1:.15,d:-.1});}
  // 찢어진 바지 끝
  for(const g of[-1,1]){const kn=W.kn(g),ft=W.ftp(g),q=W1_mid(kn,ft,.35);for(let i=-1;i<=1;i++)B.poly([W1_a3(q,[i*1.6-1,1.5,1]),W1_a3(q,[i*1.6+1,1.5,1]),W1_a3(q,[i*1.6,1.7,-2.2])],'#26262b',{d:-.2});}
  // 꼬리 털
  const tb=[0,-12,H-2+Math.sin(t/300+f)*2];for(let i=0;i<4;i++)B.ball(W1_mid([0,-6,H+1],[0,-18,H+3],i/3.5+.05),2.6-i*.3,i%2?lt:'#4a4a54',{d:.02});
  // 얼굴: 송곳니, 벌어진 턱, 코, 눈두덩, 귀 속
  const jaw=B.mode==='attack'?[.2,1,.4][f]:B.mode==='skill'?[0,.5,1,.3][f]:B.mode==='buff'?.8:0;
  B.cap(P(0,.65,-.55),P(0,1.75,-.7-jaw*.5),r*.4,K.tone(sk,-.1),{w1:r*.26,d:-.06});if(jaw>.3)B.cap(P(0,.9,-.45),P(0,1.6,-.55-jaw*.25),r*.22,'#7a1a1a',{d:-.07});
  for(const g of[-1,1]){B.cap(P(.22*g,1.5,-.5),P(.22*g,1.52,-.85-jaw*.2),r*.11,'#f4ecd8',{w1:r*.03,d:-.12});B.cap(P(.2*g,1.25,-.75-jaw*.4),P(.2*g,1.27,-.45-jaw*.4),r*.09,'#f4ecd8',{w1:r*.03,d:-.12});
    B.cap(P(.62*g,.65,.42),P(.15*g,.85,.3),r*.18,dk,{d:-.09});B.cap(P(.5*g,-.05,.85),P(.6*g,-.15,1.45),r*.18,'#7a5a5a',{w1:r*.03,d:-.05});}
  B.ball(P(0,2.02,-.3),r*.18,'#0c0c0e',{d:-.12});for(let i=0;i<5;i++)B.cap(P((i-2)*.35,-.3,.6),P((i-2)*.45,-1.1,.2),r*.3,i%2?lt:'#4a4a54',{w1:r*.05,d:.03});
  if(B.mode==='buff'||B.mode==='skill')B.glow(P(0,1,0),r*1.5,'255,60,40',.35);}}]);
// ======================= 25 해골 =======================
Q.push(['해골',{armW:3.4,legW:3.8,wcol:'#a8a49a',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,bw=J.bw;
  W1_skel(B,K,J,W,{crack:1,jawDrop:1});
  // 녹슨 어깨갑·찢긴 허리천·가죽 허리띠
  W1_pauldron(B,K,J,-1,'#7a5a3a',{r:3.6,rivet:'#a08050'});B.cap([-7.5*bw,1,J.sh+1],[2,4.5,J.H+2],1,'#4a3020',{d:-.3});
  W1_loin(B,K,J,'#5a4a3a',{back:1,len:7,w:3.2});B.cap([-5,2.5,J.H+1.8],[5,2.5,J.H+1.8],1.4,'#3a2618',{d:-.3});W1_buckle(B,J,'#7a6040');
  // 녹슨 이 빠진 검
  W1_sword(B,K,W,s,{guard:'#6a5030',gem:'#4a3a2a',pommel:'#6a5030'});for(const k of[9,15])B.ball(W1_a3(W.wp(k),[.9,0,0]),.7,'#6a5a3a',{flat:1,d:-.22});}}]);
// ======================= 28 해골창병 =======================
Q.push(['해골창병',{armW:3.4,legW:3.8,shield:'#5a4630',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw;
  W1_skel(B,K,J,W,{});
  // 가죽 모자·가죽 흉갑 일부
  B.ball(P(0,.05,.42),r*1.05,'#5a3e26',{sy:.64,d:-.1});B.cap(P(-1,.2,.15),P(1,.2,.15),r*.16,'#3a2616',{d:-.05});W1_rivets(B,[P(-.5,.8,.3),P(.5,.8,.3)],'#a09070',r*.08);
  B.poly([[-5.5*bw,4,J.sh-1],[5.5*bw,4,J.sh-1],[4.5*bw,4.6,J.sh-6.5],[-4.5*bw,4.6,J.sh-6.5]],'#5a3e26',{grad:1,edge:'#2a1a10',ew:.5,d:-.3});W1_rivets(B,[[-3,4.8,J.sh-2],[3,4.8,J.sh-2],[-3,4.9,J.sh-5],[3,4.9,J.sh-5]],'#a09070',.45);
  W1_loin(B,K,J,'#4a3a2a',{len:6});W1_greave(B,K,W,-1,'#5a3e26',{w:4,strap:'#2a1a10'});
  W1_shield(B,K,J,{boss:'#8a8070',rivet:'#a09070',bar:'#3a2a1a'});W1_spear(B,K,W,s,{tassel:'#6a2020',socket:'#4a4038'});}}]);
// ======================= 31 가스트 =======================
Q.push(['가스트',{cloth:'#46566a',armor:'#46566a',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,t=B.t,f=B.f,mv=B.mode==='walk'||B.mode==='run'?1:0;
  // 수의 두건
  B.ball(P(0,-.25,.25),r*1.2,'#3a4858',{sy:.95,d:.06});B.poly([P(-1,.2,.9),P(1,.2,.9),P(.95,.55,-.6),P(-.95,.55,-.6)],'#4a5a6c',{grad:1,d:.04,alpha:.95});
  B.line([P(-1,.5,-.6),P(-1.05,.4,.4),P(-.6,.5,1.05),P(0,.55,1.2),P(.6,.5,1.05),P(1.05,.4,.4),P(1,.5,-.6)],'#8aa0b8',.6);
  // 너덜너덜한 옷자락(뒤로 날림)
  for(let i=0;i<6;i++){const x=(i-2.5)*2.6*bw,w=Math.sin(t/200+i*1.3+f)*1.5;const top=[x,-2,H+1],b=[x*1.2+w,-6-mv*4-(i%2)*2,H-10-(i%3)*2];B.poly([W1_a3(top,[-1.2,0,0]),W1_a3(top,[1.2,0,0]),b],i%2?'#3a4a5c':'#56687c',{alpha:.75,d:.1});}
  for(let i=0;i<4;i++){const w=Math.sin(t/250+i)*1;B.poly([[(i-1.5)*3,4,H],[(i-1.5)*3+2,4,H],[(i-1.5)*3.4+1+w,3.5,H-9-(i%2)*3]],'#4a5a6c',{alpha:.7,d:-.1});}
  // 갈비뼈 비침·사슬
  for(let i=0;i<3;i++)for(const g of[-1,1])B.cap([g*.8,4.5*bw,sh-3-i*2.6],[g*4.5,4.2*bw,sh-4-i*2.6],.8,'#c8d0d8',{w1:.5,d:-.3,alpha:.7});
  B.line([[-7*bw,4*bw,sh],[-3,5.6*bw,sh-5],[2,5.8*bw,H+4],[6*bw,4.6*bw,H+1]],'#7a8490',.9);for(let i=0;i<5;i++)B.ball(W1_mid([-7*bw,4*bw,sh],[6*bw,4.6*bw,H+1],i/4),.7,'#9aa4b0',{d:-.36});
  // 긴 손가락
  for(const g of[-1,1]){const h=W.h(g);for(let i=-1;i<=1;i++)B.cap(W1_a3(h,[i*.6,1.4,-.4]),W1_a3(h,[i*1.2,4.2,-2]),.55,'#c8d0d8',{w1:.15,d:-.1});}
  // 혼백 연기
  for(let i=0;i<4;i++){const ph=((t/900)+i/4)%1;B.glow([Math.sin(i*2.1)*4,-3-ph*6,H-4-ph*6],2.4*(1-ph)+.5,'150,220,255',(1-ph)*.45);}
  for(const g of[-1,1])B.glow(P(.36*g,.9,.08),r*.5,'150,220,255',.55);}}]);
// ======================= 34 킹 버그베어 =======================
Q.push(['킹 버그베어',{skin:'#74542f',cloth:'#5e2424',wcol:'#5a3a1e',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,sk=s.skin;
  // 털 망토 어깨(굵은 털 뭉치)
  for(let i=0;i<13;i++){const a=(i/12-.5)*3.6,x=Math.sin(a)*9.5*bw,y=Math.cos(a)*4.4*bw,c=[x,y,sh+2-Math.abs(a)*.5];B.cap(c,W1_a3(c,[x*.12,y*.25,-4.2]),2.4*bw,i%2?'#a88a58':'#7a5c36',{w1:.3,d:-.28});}
  for(let i=0;i<5;i++)B.cap([(i-2)*3*bw,-5*bw,sh+1],[(i-2)*3.3*bw,-6.5*bw,sh-5],2.4*bw,i%2?'#8a6a40':'#a08050',{w1:.4,d:-.05});
  // 망토 금테·문장
  B.line([[-10*bw,-5.5,4.5],[0,-8.2,2.5],[10*bw,-5.5,4.5]],'#e0b040',1);B.ball([0,-8.6,sh-6],2.4,'#e0b040',{flat:1,d:-.2});B.ball([0,-8.8,sh-6],1.2,'#7a1a1a',{flat:1,d:-.25});
  // 가슴 판금 + 해골 버클
  B.poly([[-6*bw,5.8*bw,sh-2],[6*bw,5.8*bw,sh-2],[5*bw,6.4*bw,H+6],[0,7*bw,H+4.5],[-5*bw,6.4*bw,H+6]],'#8a6a2a',{grad:1,edge:'#e0b040',ew:.6,d:-.32});
  B.cap([-8*bw,6.4*bw,H+1.5],[8*bw,6.4*bw,H+1.5],2.6,'#3a2414',{d:-.35});B.ball([0,7.2*bw,H+1.6],2,'#e8e0c8',{d:-.45});for(const g of[-1,1])B.ball([g*.8,7.6*bw,H+2],.6,'#1a1010',{flat:1,d:-.5});
  W1_loin(B,K,J,'#7a5a34',{len:9,w:4.2});
  for(const g of[-1,1]){W1_bracer(B,K,W,g,'#c0902a',{band:'#6a4a18',stud:'#f0d070'});W1_greave(B,K,W,g,'#5a3a20',{strap:'#2a1a10',knee:'#c0902a'});}
  // 얼굴: 덥수룩한 수염·송곳니·왕관 보석
  for(let i=-2;i<=2;i++)B.cap(P(i*.25,.75,-.4),P(i*.32,.85,-1.3+Math.abs(i)*.2),r*.3,i%2?'#5a3a20':'#4a2e18',{w1:r*.1,d:-.12});
  for(const g of[-1,1]){B.cap(P(.3*g,.95,-.5),P(.4*g,1.1,.1),r*.2,'#efe6cc',{w1:r*.06,d:-.15});B.cap(P(.62*g,.8,.42),P(.1*g,.92,.3),r*.2,K.tone(sk,-.45),{d:-.1});}
  for(let i=-2;i<=2;i++)B.cap(P(i*.32,.55,.75),P(i*.36,.5,1.3+(i%2?0:.3)),r*.18,'#e8c050',{w1:r*.05,d:-.08});
  B.cap(P(-.95,.3,.7),P(.95,.3,.7),r*.2,'#c89a30',{d:-.09});for(const[i,c]of[[-1,'#3060e0'],[0,'#e02020'],[1,'#20c060']])B.ball(P(i*.4,.85,.75),r*.13,c,{d:-.12});
  // 가시 박힌 철테 곤봉
  W1_club(B,K,W,s,{spikes:8,band:'#4a4a50'});}}]);
// ======================= 37 바포메트 =======================
Q.push(['바포메트',{
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,t=B.t,f=B.f,sk=s.skin;
  // 뿔 마디(고리)
  for(const g of[-1,1]){const a=P(.5*g,-.1,.8),b=P(1.3*g,-.6,1.5),c=P(1.6*g,-1.2,.7);for(let i=1;i<6;i++){const q=i<3?W1_mid(a,b,i/3):W1_mid(b,c,(i-2)/4);B.ball(q,r*(.36-i*.045),K.tone('#d8c8a8',-.25),{sy:.5,d:-.02});}B.ball(c,r*.07,'#1a1410',{d:-.03});}
  // 염소 수염·눈썹·주둥이 이빨
  B.poly([P(-.3,1.3,-.75),P(.3,1.3,-.75),P(.1,1.25,-2.1),P(-.1,1.25,-2.1)],'#2a2228',{grad:1,d:-.2});for(const g of[-1,1])B.cap(P(.65*g,.7,.55),P(.15*g,.9,.38),r*.22,'#2a2028',{d:-.1});
  for(let i=-1;i<=1;i++)B.cap(P(i*.15,1.55,-.55),P(i*.15,1.56,-.75),r*.07,'#f0e8d0',{d:-.12});
  // 가슴 근육 + 오각성 문양(빛남)
  for(const g of[-1,1])B.ball([g*3.4*bw,5.8*bw,sh-4.5],3*bw,K.tone(sk,.12),{flat:1,sx:1.1,sy:.55,d:-.3,alpha:.55});
  const pc=[0,6.6*bw,H+6.5],pr=3.2,pul=.6+.4*Math.sin(t/300+f);const st=[];for(let i=0;i<5;i++){const a=-Math.PI/2+i*4*Math.PI/5;st.push(W1_a3(pc,[Math.cos(a)*pr,0,-Math.sin(a)*pr]));}
  B.line([...st,st[0]],'rgba(255,80,50,'+(.55+.4*pul).toFixed(2)+')',.6);B.glow(pc,4,'255,70,40',.25*pul);
  // 가시 어깨판·사슬 허리띠·해골 장식
  for(const g of[-1,1])W1_pauldron(B,K,J,g,'#3a2a30',{spikes:3,rivet:'#c0a060',spikeC:'#d8c8a8'});
  B.cap([-7*bw,6*bw,H+1.4],[7*bw,6*bw,H+1.4],1.8,'#2a1e24',{d:-.33});for(let i=0;i<7;i++)B.ball([(i-3)*2*bw,6.4*bw,H+1.4],.7,'#9a9aa4',{d:-.38});B.ball([0,6.9*bw,H+1],1.7,'#e0d8c4',{d:-.45});
  W1_loin(B,K,J,'#3a1a20',{back:1,len:10,w:4});
  // 발굽
  for(const g of[-1,1]){const ft=W.ftp(g);B.ball(W1_a3(ft,[0,1.8,-.6]),2.6*bw,'#1a1416',{sy:.6,d:-.12});B.cap(W1_a3(ft,[0,3.4,-1]),W1_a3(ft,[0,4,-1.1]),.5,'#5a5054',{d:-.14});B.cap(W.kn(g),W1_a3(W.kn(g),[g*1,-2.5,-3]),2.6,'#4a3a40',{w1:.3,d:.02});}
  // 날개 뼈대·발톱
  const fl=Math.sin(f*1.6+(B.mode==='run'?1:0)+t/250)*4+(B.mode==='buff'?6:0);for(const g of[-1,1]){const r0=[5*g*bw,-3,sh-2],e1=[18*g*bw,-8,sh+8+fl],e2=[24*g*bw,-10,sh-2+fl],e3=[16*g*bw,-7,H-2+fl*.5];
    B.cap(r0,e1,1.6,'#2a1e26',{w1:1,d:.4});B.cap(e1,e2,1,'#2a1e26',{w1:.5,d:.4});B.cap(e1,e3,.8,'#2a1e26',{w1:.4,d:.4});B.cap(e1,W1_a3(e1,[g*.5,0,2.2]),.8,'#d8c8a8',{w1:.1,d:.38});}
  // 큰 낫: 날 하이라이트·해골 장식
  const pt=W.wp,a=pt(16),x=[1,0,0];B.line([W1_a3(a,x,1.6),W1_a3(W1_a3(a,x,-6),[0,0,1],-1.6),W1_a3(W1_a3(a,x,-12),[0,0,1],-5)],'#f4f4ff',.6);
  B.ball(pt(15.5),2,'#e0d8c4',{d:-.2});B.ball(W1_a3(pt(15.5),[0,1.4,0]),.6,'#200',{flat:1,glow:'255,60,40',d:-.25});for(let i=0;i<4;i++)B.cap(pt(-2+i*1.4),pt(-1.4+i*1.4),1.8,i%2?'#1a0e10':'#5a2a2a',{d:-.08});
  if(B.mode==='skill'||B.mode==='buff')B.glow(P(0,.9,.2),r*1.4,'255,60,40',.4);}}]);
// ======================= 40 무리안 =======================
Q.push(['무리안',{
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,sk=s.skin,t=B.t,f=B.f;
  // 비늘(몸통 앞)·배 밝은 색
  B.ball([0,5*bw,H+6],4.2*bw,'#a8d0c8',{flat:1,sy:1.2,d:-.29,alpha:.6});
  for(let rI=0;rI<5;rI++)for(let i=0;i<4;i++){const x=(i-1.5)*2.6*bw+(rI%2)*1.3-0.65;B.ball([x,5.6*bw,sh-2-rI*2.4],1.1*bw,rI%2?K.tone(sk,.15):K.tone(sk,-.08),{sy:.7,d:-.31,alpha:.8});}
  // 등지느러미·팔 지느러미
  const fn=s.fin,sw=Math.sin(t/250+f)*.5;B.poly([[0,-4,sh+2],[0,-7-sw,sh-2],[0,-7.5,H+6],[0,-4.5,H+3]],fn,{grad:1,alpha:.85,d:.05});for(let i=0;i<4;i++)B.line([[0,-4.2,sh+1-i*3],[0,-7.2,sh-2-i*2.6]],K.tone(fn,-.4),.4);
  for(const g of[-1,1]){const el=W.el(g);B.poly([el,W1_a3(el,[g*3.5,-2.5,1.5]),W1_a3(el,[g*2,-2,-3.5])],fn,{grad:1,alpha:.85,d:.02});W1_bracer(B,K,W,g,'#2a5a5a',{band:'#d0c080'});}
  // 아가미·입·눈 테
  for(const g of[-1,1])for(let i=0;i<3;i++)B.line([P(.82*g,.1-i*.2,.0),P(.78*g,.1-i*.2-.05,-.5)],'#1a3a48',.5);B.cap(P(-.45,.92,-.4),P(.45,.92,-.4),r*.1,'#1a2a30',{d:-.08});
  // 조개 허리띠·산호 목걸이
  B.cap([-7*bw,6*bw,H+1.4],[7*bw,6*bw,H+1.4],1.8,'#3a4a3a',{d:-.33});for(let i=0;i<5;i++)B.ball([(i-2)*2.6*bw,6.5*bw,H+1.2],1.1,i%2?'#f0d8c8':'#e8b8a0',{sy:.8,d:-.38});
  W1_loin(B,K,J,'#2a6a6a',{back:1,len:8});
  // 삼지창
  const pt=W.wp,wc='#d0e8f0';W1_spear(B,K,W,s,{socket:'#5a8a90'});for(const g of[-1,1]){const a=W1_a3(pt(22),[g*2.4,0,0]);B.cap(a,W1_a3(pt(26.5),[g*2.4,0,0]),.8,wc,{w1:.2,d:-.15});B.cap(W1_a3(pt(26),[g*2.4,0,0]),W1_a3(pt(25),[g*1.6,0,0]),.5,wc,{d:-.15});}
  if(B.mode==='skill')for(let i=0;i<3;i++)B.glow(W1_a3(pt(24+i*2),[0,0,0]),1.5+i,'120,220,255',.5);}}]);
// ======================= 58 서큐버스 =======================
Q.push(['서큐버스',{
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,t=B.t,f=B.f,sk=s.skin,hc=s.hair,gd='#e0c060';
  // 긴 머리칼(등 뒤로 흘러내림)
  for(let i=0;i<7;i++){const x=(i-3)*.28,w=Math.sin(t/300+i+f)*.15;B.cap(P(x,-.4,.5),P(x*1.3+w,-1.1,-1.4),r*.42,i%2?hc:K.tone(hc,.15),{w1:r*.3,d:.06});B.cap(P(x*1.3+w,-1.1,-1.4),P(x*1.5+w*2,-1.4,-3.2),r*.3,i%2?hc:K.tone(hc,.1),{w1:r*.06,d:.08});}
  for(const g of[-1,1])B.cap(P(.7*g,.3,.6),P(.95*g,.35,-1),r*.3,hc,{w1:r*.12,d:-.02});B.ball(P(0,.25,.7),r*.75,hc,{sy:.6,d:-.04});
  // 뿔 마디
  for(const g of[-1,1]){const a=P(.6*g,0,.6),b=P(1.2*g,-.3,1.5);for(let i=1;i<4;i++)B.ball(W1_mid(a,b,i/4),r*(.28-i*.05),'#4a3030',{sy:.55,d:-.01});}
  // 입술·눈매
  B.cap(P(-.15,.95,-.42),P(.15,.95,-.42),r*.1,'#a01840',{d:-.1});for(const g of[-1,1])B.cap(P(.2*g,.88,.32),P(.55*g,.75,.4),r*.07,'#1a0810',{d:-.1});
  // 코르셋(끈 교차)·가슴 장식·금 목걸이
  B.poly([[-5.5*bw,5.6*bw,sh-3],[5.5*bw,5.6*bw,sh-3],[4.5*bw,6*bw,H+1],[-4.5*bw,6*bw,H+1]],'#2a0820',{grad:1,edge:gd,ew:.5,d:-.32});
  for(let i=0;i<4;i++){const z=sh-4-i*2.2;B.line([[-1.2,6.2*bw,z],[1.2,6.2*bw,z-1.6]],gd,.35);B.line([[1.2,6.2*bw,z],[-1.2,6.2*bw,z-1.6]],gd,.35);}
  B.line([[-5*bw,4*bw,sh+1.2],[-2,5.2*bw,sh-.5],[0,5.4*bw,sh-1.2],[2,5.2*bw,sh-.5],[5*bw,4*bw,sh+1.2]],gd,.6);B.ball([0,5.7*bw,sh-1.6],1,'#ff60b0',{glow:'255,90,200',d:-.45});
  // 치마 갈라짐(앞 천 2장)
  for(const g of[-1,1]){const sw=J.p.sw||0;B.poly([[g*.5,6*bw,H+1],[g*5*bw,5.4*bw,H+1],[g*6*bw,5*bw+sw*g,H-9],[g*1.5,6*bw+sw*g,H-7]],'#4a1236',{grad:1,d:-.37});}
  // 팔찌·허벅지 부츠
  for(const g of[-1,1]){const el=W.el(g),h=W.h(g);B.cap(W1_mid(el,h,.75),W1_mid(el,h,.85),3.6,gd,{d:-.06});const kn=W.kn(g),ft=W.ftp(g);B.cap(W1_mid(kn,W.hip(g),.4),ft,4.6,'#1a0614',{w1:3.4,d:-.07});B.cap(W1_mid(kn,W.hip(g),.4),W1_a3(W1_mid(kn,W.hip(g),.4),[0,.1,-.8]),4.8,gd,{d:-.09});B.cap(W1_a3(ft,[0,1.5,-1.2]),W1_a3(ft,[0,1.2,-2.4]),.7,'#0a0208',{d:-.1});}
  // 날개 막 뼈대
  const fl=Math.sin(f*1.6+(B.mode==='run'?1:0)+t/250)*4+(B.mode==='buff'?6:0);for(const g of[-1,1]){const r0=[5*g*bw,-3,sh-2],e1=[18*g*bw,-8,sh+8+fl],e2=[24*g*bw,-10,sh-2+fl],e3=[16*g*bw,-7,H-2+fl*.5];B.cap(r0,e1,1.2,'#2a0a1e',{w1:.8,d:.4});B.cap(e1,e2,.8,'#2a0a1e',{w1:.3,d:.4});B.cap(e1,e3,.6,'#2a0a1e',{w1:.3,d:.4});B.cap(e1,W1_a3(e1,[g*.3,0,1.8]),.7,'#e0d0c0',{w1:.1,d:.38});}
  // 꼬리 끝 화살촉
  const c2=[0,-18,H+3];B.poly([W1_a3(c2,[0,-.5,-1.8]),W1_a3(c2,[-2,-1,0]),W1_a3(c2,[0,-3.8,.4]),W1_a3(c2,[2,-1,0])],'#7a2a4a',{grad:1,d:.0});
  if(B.mode==='skill'||B.mode==='buff')for(let i=0;i<3;i++){const a=t/300+i*2.1;B.glow([Math.cos(a)*8,Math.sin(a)*8,sh+Math.sin(a*2)*4],1.4,'255,90,200',.7);}}}]);
// ======================= 61 에틴 =======================
Q.push(['에틴',{
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,bw=J.bw,H=J.H,sh=J.sh,hr=J.hr,sk=s.skin,f=B.f;
  // 두 머리 각각: 눈썹·송곳니·머리털·흉터/코걸이
  const hs=[[-4.6*bw,J.hd[1],J.hz-1],[4.6*bw,J.hd[1],J.hz]];hs.forEach((hd,i)=>{const P=(x,y,z)=>[hd[0]+x*hr,hd[1]+y*hr,hd[2]+z*hr];
    for(const g of[-1,1]){B.cap(P(.3*g,.95,-.55),P(.38*g,1.08,0),hr*.18,'#efe6cc',{w1:hr*.06,d:-.12});B.cap(P(.62*g,.8,.45),P(.1*g,.92,.3),hr*.2,K.tone(sk,-.45),{d:-.1});}
    B.ball(P(0,1.02,-.1),hr*.2,K.tone(sk,-.2),{sx:1.3,d:-.1});
    if(i===0){for(let k=-2;k<=2;k++)B.cap(P(k*.3,-.1,.85),P(k*.4,-.6,1.4),hr*.24,'#3a2a18',{w1:hr*.06,d:.02});B.line([P(.2,.92,.65),P(.55,.82,-.2)],'#5a2a20',.5);}
    else{B.ball(P(0,-.15,.5),hr*.9,'#5a3a1a',{sy:.6,d:.02});B.cap(P(-.15,1.1,-.25),P(.15,1.1,-.25),hr*.12,'#c0a050',{d:-.12});B.cap(P(0,-.6,.7),P(0,-1.3,.2),hr*.28,'#5a3a1a',{w1:hr*.1,d:.05});}});
  // 가죽 띠·뼈 목걸이·배 흉터
  W1_harness(B,K,J,'#4a3220',{stud:'#a09070'});B.cap([-9*bw,6.4*bw,H+1.5],[9*bw,6.4*bw,H+1.5],2.6,'#3a2414',{d:-.35});W1_buckle(B,J,'#9a8a6a');
  for(const[a,b]of[[[-3,8.2*bw,H+7],[2,8.3*bw,H+4]],[[2.5,8.2*bw,H+8],[4.5,8.1*bw,H+5.5]]])B.line([a,b],'#5a3a28',.6);
  W1_teeth(B,J,7);W1_loin(B,K,J,'#6a5a3a',{back:1,len:10,w:5});
  for(const g of[-1,1]){W1_bracer(B,K,W,g,'#5a3a20',{w:6,stud:'#a09070'});const kn=W.kn(g);B.cap(W1_mid(kn,W.ftp(g),.5),W1_mid(kn,W.ftp(g),.75),6.2,'#7a6a4a',{d:-.06});}
  // 어깨 털가죽
  for(let i=0;i<6;i++){const x=(i-2.5)*3*bw;B.cap([x,-2,sh+2],[x*1.1,-5*bw,sh-4],1.8*bw,i%2?'#8a7a5a':'#6a5a3a',{w1:.3,d:.02});}
  W1_club(B,K,W,s,{spikes:7,band:'#3a3a40',spikeC:'#b8b8b0'});}}]);
// ======================= 64 해골근위병 =======================
Q.push(['해골근위병',{armW:3.4,legW:3.8,
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,gd='#b89a48';
  W1_skel(B,K,J,W,{});
  // 금 흉갑(갈비 위 반쪽)·푸른 휘장
  B.poly([[-6*bw,4.6,sh-.5],[6*bw,4.6,sh-.5],[5*bw,5.4,sh-7],[0,6,sh-8.5],[-5*bw,5.4,sh-7]],gd,{grad:1,edge:'#f0d878',ew:.6,d:-.3});B.cap([0,5.6,sh-1],[0,6,sh-7.5],.6,'#f0d878',{d:-.34});
  W1_rivets(B,[[-4,5.4,sh-1.5],[4,5.4,sh-1.5],[-3.5,5.8,sh-6],[3.5,5.8,sh-6]],'#f8e8a0',.45);
  const sw=J.p.sw||0;B.poly([[-3*bw,5.4,H+2],[3*bw,5.4,H+2],[2.6*bw,6+sw,H-9],[0,6.3+sw,H-10.5],[-2.6*bw,6+sw,H-9]],'#2a4a8a',{grad:1,edge:gd,ew:.5,d:-.38});B.ball([0,6.6,H-3],1.2,gd,{flat:1,d:-.42});
  B.poly([[-3*bw,-4.5,H+2],[3*bw,-4.5,H+2],[2.6*bw,-5-sw,H-9],[-2.6*bw,-5-sw,H-9]],'#24407a',{grad:1,edge:gd,ew:.5,d:.0});
  // 투구: 볼가리개·코가리개·깃털
  for(const g of[-1,1])B.poly([P(.75*g,.5,.15),P(.98*g,.15,.1),P(.88*g,.2,-.7),P(.68*g,.6,-.5)],K.tone(gd,-.1),{grad:1,d:-.1});B.cap(P(0,.95,.5),P(0,1.05,-.15),r*.14,K.tone(gd,.2),{w1:r*.08,d:-.14});
  B.cap(P(-1,.15,.2),P(1,.15,.2),r*.2,K.tone(gd,-.25),{d:-.06});
  for(const g of[-1,1]){W1_pauldron(B,K,J,g,gd,{r:4,rivet:'#f8e8a0'});W1_greave(B,K,W,g,'#9a8040',{w:4,knee:gd});W1_bracer(B,K,W,g,'#9a8040',{w:3.6,band:'#5a4818'});}
  W1_shield(B,K,J,{mark:'#2a4a8a',boss:'#e0c870',rivet:'#f0d878'});W1_sword(B,K,W,s,{guard:gd,gem:'#3060e0',pommel:gd});}}]);
// ======================= 43 세퍼드 =======================
Q.push(['세퍼드',{skin:'#8e6a40',chest:'#c8a272',mane:'#2e2216',
 detail(B,K){const s=B.s,Q2=W1_quad(B),{h,L,bw,ny,R0,hd,r,fwd,tip}=Q2,t=B.t,f=B.f;
  // 검은 안장 무늬·등 털결
  for(let i=0;i<4;i++)B.ball([0,-L*.35+i*L*.22+ny*.7,h+R0*.92],R0*.78,'#2a2018',{flat:1,sx:1,sy:.5,d:-.25,alpha:.9});
  for(let i=0;i<6;i++){const y=-L*.45+i*L*.17+ny*.7;for(const g of[-1,1])B.cap([g*R0*.55,y,h+R0*.85],[g*R0*.95,y-1.5,h+R0*.3],1.3,i%2?'#3a2c1e':'#4a3826',{w1:.2,d:-.22});}
  // 가슴 털 갈기·볼 털
  for(let i=0;i<4;i++)B.cap([(i-1.5)*1.8,L*.5+ny+2,h+2.5-i%2],[(i-1.5)*2,L*.5+ny+3,h-2.5],1.8,i%2?'#e0c090':'#c8a272',{w1:.3,d:-.2});
  for(const g of[-1,1])B.cap(W1_a3(hd,[g*r*.7,-r*.1,-r*.2]),W1_a3(hd,[g*r*1.15,-r*.5,-r*.6]),r*.45,'#c8a272',{w1:r*.1,d:-.05});
  // 주둥이 검정·눈두덩·혀
  B.cap(W1_a3(hd,fwd,r*1.2),tip,r*.62,'#2a2018',{w1:r*.45,d:-.08});B.ball(tip,r*.32,'#0e0a08',{d:-.12});
  for(const g of[-1,1])B.cap(W1_a3(W1_a3(hd,fwd,r*.6),[g*r*.7,0,r*.5]),W1_a3(W1_a3(hd,fwd,r*.75),[g*r*.15,0,r*.55]),r*.18,'#3a2a1a',{d:-.1});
  if(B.mode==='run'||B.mode==='walk'||B.mode==='idle')B.cap(W1_a3(tip,[0,-r*.5,-r*.45]),W1_a3(tip,[0,-r*.2,-r*1.1]),r*.25,'#d05060',{w1:r*.2,d:-.06});
  for(const g of[-1,1])B.cap(W1_a3(W1_a3(tip,[g*r*.3,-r*.1,-r*.25]),fwd,-r*.1),W1_a3(W1_a3(tip,[g*r*.3,-r*.1,-r*.65]),fwd,-r*.1),r*.1,'#f4ecd8',{w1:r*.03,d:-.1});
  // 귀 속·가죽 목걸이(징)
  for(const g of[-1,1])B.cap(W1_a3(hd,[g*r*.5,-r*.1,r*.7]),W1_a3(hd,[g*r*.65,-r*.35,r*1.3]),r*.2,'#5a3a2a',{w1:r*.04,d:-.08});
  const nk=[0,L*.5+ny+2.5,h+4.5];B.cap(W1_a3(nk,[-3.4*bw,-.5,0]),W1_a3(nk,[3.4*bw,-.5,0]),1.5,'#7a1a14',{d:-.2});for(let i=-1;i<=1;i++)B.ball(W1_a3(nk,[i*1.8,.6,0]),.5,'#d0c8b0',{d:-.3});
  // 발가락·꼬리털
  for(const lg of Q2.legs){for(let i=-1;i<=1;i++)B.cap(W1_a3(lg.ft,[i*.6,.8,.2]),W1_a3(lg.ft,[i*.7,1.7,0]),.6,'#2a2018',{w1:.3,d:-.1});B.cap(lg.top,lg.kn,(s.legW||3.6)*bw*.6,'#3a2a1c',{w1:.4,d:-.02,alpha:.5});}
  let a=Q2.tail0;for(let i=1;i<=3;i++){const b=[Math.sin(t/300+i+f)*1.5*i*.5,-L*.6-i*4,h+2+1.5*i-.2*i*i];B.cap(W1_mid(a,b,.5),W1_a3(b,[0,-.5,-1.4]),1.4,i===3?'#2a2018':'#5a4228',{w1:.3,d:-.02});a=b;}}}]);
// ======================= 46 바실리스크 =======================
Q.push(['바실리스크',{
 detail(B,K){const s=B.s,Q2=W1_quad(B),{h,L,bw,ny,R0,hd,r,fwd,tip,jaw}=Q2,t=B.t,f=B.f,sk=s.skin;
  // 등 비늘판(엇갈림)·옆구리 줄무늬
  for(let i=0;i<7;i++){const y=-L*.48+i*L*.15+ny*.7;for(const g of[-1,0,1])B.ball([g*R0*.55,y+(g?1:0),h+R0*(g?.75:.98)],R0*.32,i%2?K.tone(sk,.18):K.tone(sk,-.12),{flat:1,sy:.6,d:-.25});
    for(const g of[-1,1])B.cap([g*R0*.95,y,h+R0*.2],[g*R0*.8,y+1.5,h-R0*.1],.9,'#2a3a1e',{d:-.2,alpha:.7});}
  // 배 판(밝은 띠)
  for(let i=0;i<5;i++)B.cap([-R0*.5,-L*.35+i*L*.18+ny*.7,h-R0*.55],[R0*.5,-L*.35+i*L*.18+ny*.7,h-R0*.55],1,'#b0b878',{d:-.15});
  // 머리 왕관 가시·이빨·턱
  for(let i=-2;i<=2;i++){const a=W1_a3(hd,[i*r*.3,-r*.1,r*.75]);B.cap(a,W1_a3(a,[i*r*.25,-r*.6,r*(1.1-Math.abs(i)*.2)]),r*.22,'#d0b040',{w1:r*.03,d:-.1});}
  for(let i=0;i<4;i++)for(const g of[-1,1])B.cap(W1_a3(W1_a3(hd,fwd,r*(.9+i*.45)),[g*r*.45,0,-r*.4]),W1_a3(W1_a3(hd,fwd,r*(.9+i*.45)),[g*r*.45,0,-r*.75]),r*.09,'#f4ecd8',{w1:r*.02,d:-.1});
  for(const g of[-1,1]){B.cap(W1_a3(W1_a3(hd,fwd,r*.5),[g*r*.65,0,r*.55]),W1_a3(W1_a3(hd,fwd,r*.95),[g*r*.2,0,r*.6]),r*.2,K.tone(sk,-.4),{d:-.1});B.glow(W1_a3(W1_a3(hd,fwd,r*.62),[g*r*.52,0,r*.28]),r*.5,'255,230,60',.45);}
  // 발톱
  for(const lg of Q2.legs)for(let i=-1;i<=1;i++)B.cap(W1_a3(lg.ft,[i*.8,.8,.2]),W1_a3(lg.ft,[i*1.2,2.2,-.2]),.55,'#e8e0c0',{w1:.12,d:-.1});
  // 꼬리 고리 무늬·끝 가시
  let a=Q2.tail0;for(let i=1;i<=5;i++){const b=[Math.sin(t/300+i+f)*1.5*i*.5,-L*.6+ny*.5-i*4.5,h+2+1.5*i];if(i%2)B.ball(W1_mid(a,b),2.4*bw*(1-i/6*.6),'#2a3a1e',{flat:1,sx:1,sy:.4,d:-.1});a=b;}B.cap(a,W1_a3(a,[0,-3,1]),1,'#c0a040',{w1:.1,d:-.05});
  if(B.mode==='skill'&&f>=1)B.glow(tip,3+f,'200,255,90',.6);}}]);
// ======================= 49 거대 병정 개미 =======================
Q.push(['거대 병정 개미',{
 detail(B,K){const s=B.s,G=W1_bug(B),{bw,h,sp,hp,hr,snap}=G,t=B.t,f=B.f,sk=s.skin;
  // 광택 하이라이트·마디 홈
  sp.forEach((q,i)=>{B.ball(W1_a3(q.p,[-q.r*.3,q.r*.15,q.r*.45]),q.r*.35,'#ffffff',{flat:1,alpha:.22,sy:.6,d:-.2});});
  const ab=sp[0];for(let i=0;i<3;i++)B.ball(W1_a3(ab.p,[0,-ab.r*.45+i*ab.r*.4,ab.r*.5-Math.abs(i-1)*ab.r*.1]),ab.r*.8,K.tone(sk,-.3),{flat:1,sx:1,sy:.14,d:-.12,alpha:.45});
  // 허리 마디(페티올)·가슴 가시
  B.ball(W1_mid(sp[0].p,sp[1].p,.55),1.6*bw,K.tone(sk,-.15),{d:.05});for(const g of[-1,1])B.cap(W1_a3(sp[1].p,[g*1,-.5,sp[1].r*.7]),W1_a3(sp[1].p,[g*1.6,-2,sp[1].r*1.6]),.9,K.tone(sk,-.3),{w1:.1,d:-.1});
  // 머리: 큰 겹눈·꺾인 더듬이·큰 턱 이빨
  for(const g of[-1,1]){B.ball(W1_a3(hp,[g*hr*.65,hr*.35,hr*.35]),hr*.28,'#1a0c08',{d:-.12});B.ball(W1_a3(hp,[g*hr*.6,hr*.45,hr*.48]),hr*.09,'#ffffff',{flat:1,alpha:.6,d:-.14});
    const a=W1_a3(hp,[g*hr*.3,hr*.6,hr*.7]),el=W1_a3(a,[g*1.5,1+Math.sin(t/200+g+f)*.6,4.2]),tp=W1_a3(el,[g*1.8,4.2,-1.2+Math.sin(t/170+g)*.8]);B.cap(a,el,.7,'#2a0c06',{w1:.55,d:-.1});B.cap(el,tp,.55,'#2a0c06',{w1:.4,d:-.1});B.ball(tp,.6,'#3a1208',{d:-.1});
    const m0=W1_a3(hp,[g*hr*.5,hr*.7,-hr*.3]),m1=W1_a3(hp,[g*hr*(.9-snap*.6),hr*1.7,-hr*.4]);for(let i=1;i<3;i++){const q=W1_mid(m0,m1,i/3);B.cap(q,W1_a3(q,[-g*.8,.2,0]),.45,'#1a0804',{w1:.1,d:-.12});}}
  // 다리 관절 마디·가시털
  for(const lg of G.legs){B.ball(lg.knee,1*bw,K.tone(sk,-.2),{d:-.05});const q=W1_mid(lg.knee,lg.ft,.5);B.cap(q,W1_a3(q,[lg.sg*.8,0,.8]),.35,'#2a0c06',{w1:.1,d:-.05});}
  if(B.mode==='skill'&&f===2)B.glow(W1_a3(hp,[0,hr*1.8,-hr*.4]),4,'255,140,90',.6);}}]);
// ======================= 52 스콜피온 =======================
Q.push(['스콜피온',{
 detail(B,K){const s=B.s,G=W1_bug(B),{bw,h,sp,hp,hr,snap,lunge,rear,sting}=G,t=B.t,f=B.f,sk=s.skin,mode=B.mode;
  // 등판 마디(가로 띠)·광택
  for(const q of sp.slice(0,2))for(let i=0;i<3;i++)B.ball(W1_a3(q.p,[0,-q.r*.55+i*q.r*.5,q.r*.62]),q.r*.9,i%2?K.tone(sk,-.25):K.tone(sk,.1),{flat:1,sx:1,sy:.22,d:-.12,alpha:.85});
  for(const q of sp)B.ball(W1_a3(q.p,[-q.r*.3,q.r*.1,q.r*.5]),q.r*.3,'#ffffff',{flat:1,alpha:.2,sy:.6,d:-.2});
  // 머리 눈 무리
  for(let i=0;i<4;i++)B.ball(W1_a3(hp,[(i-1.5)*hr*.25,hr*.6,hr*.55+(i%2)*hr*.1]),hr*.09,'#100808',{flat:1,d:-.12});B.ball(W1_a3(hp,[0,hr*.2,hr*.7]),hr*.14,'#100808',{flat:1,d:-.12});
  // 집게 톱니·마디 줄
  for(const g of[-1,1]){const el=W1_a3(hp,[g*hr*1.9,hr*1.6+lunge*.3,1+rear*2]),cl=W1_a3(el,[g*-1*(1-snap*.5),3.5+snap*2,.5]);B.ball(W1_a3(el,[0,0,.6]),1.4*bw,K.tone(s.claw,.25),{flat:1,alpha:.4,d:-.12});
    for(let i=1;i<4;i++){const q=W1_mid(el,cl,i/4);B.cap(q,W1_a3(q,[g*.8,.1,0]),.4,'#e0c8a0',{w1:.1,d:-.12});}B.cap(W1_a3(hp,[g*hr*.8,hr*.3,0]),el,.6,K.tone(sk,-.35),{d:-.02,alpha:.6});}
  // 꼬리 마디 고리(plan과 같은 궤적)
  let a=W1_a3([0,s.segs[0][1],h+s.segs[0][2]],[0,-s.segs[0][3]*bw*.8,0]);const n=5;for(let i=1;i<=n;i++){const th=i/n*Math.PI*(.75+sting*.3);const b=[0,s.segs[0][1]-Math.sin(th)*9*bw+(i===n?sting*4:0),h+s.segs[0][2]+(1-Math.cos(th))*7*bw];B.ball(b,1.9*bw*(1-i*.1),K.tone(sk,-.3),{sy:.55,d:-.02});B.ball(W1_a3(b,[0,0,.6]),.6,K.tone(sk,.3),{flat:1,d:-.05});a=b;}
  B.ball(a,1.4,'#3a1a10',{d:-.05});B.glow(W1_a3(a,[0,2.5+sting,-1.5]),1.2+(mode==='skill'?2:0),'160,255,120',.55);
  for(const lg of G.legs)B.ball(lg.knee,.9*bw,K.tone(sk,-.25),{d:-.05});}}]);
// ======================= 55 브롭 =======================
Q.push(['브롭',{
 detail(B,K){const s=B.s,{mode,f,t}=B,run=mode==='run',walk=mode==='walk'||run,r=s.r||9,sk=s.skin;const ph=f*Math.PI/2;let hop=walk?Math.abs(Math.sin(ph))*(run?5:3):0,sq=walk?1+.12*Math.cos(ph*2):1,lunge=0;
  if(mode==='attack'){lunge=[-2,5,1][f];sq=[1.15,.85,1][f];}if(mode==='skill'){sq=[1.2,1.05,.9,1][f];lunge=[0,0,2,0][f];}const z0=hop,c=[0,lunge,z0+r*.7*sq];
  // 안쪽 거품·삼킨 뼈
  for(let i=0;i<6;i++){const a=i*2.3+t/900,rr=r*(.25+(i%3)*.12),q=W1_a3(c,[Math.cos(a)*rr,Math.sin(a)*rr*.6,((t/1200+i/6)%1-.5)*r*.45]);B.ball(q,r*(.06+(i%3)*.03),'#e8ffd0',{alpha:.5,d:.05});}
  B.cap(W1_a3(c,[-r*.35,-r*.1,-r*.15]),W1_a3(c,[r*.2,0,-r*.3]),r*.12,'#e8e0c8',{alpha:.55,d:.06});B.ball(W1_a3(c,[r*.25,-r*.15,0]),r*.16,'#e8e0c8',{alpha:.5,d:.06});
  // 바닥 고임·흘러내림
  B.ball([0,lunge,.2],r*1.15,K.tone(sk,-.15),{flat:1,sy:.45,alpha:.55,d:.3});
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2+.4,q=W1_a3(c,[Math.cos(a)*r*.85,Math.sin(a)*r*.7,-r*.35]);B.cap(q,W1_a3(q,[0,0,-r*.18-(i%2)*r*.12]),r*.16,sk,{w1:r*.11,alpha:.85,d:-.02});}
  // 반짝이는 하이라이트·윤곽·입
  B.ball(W1_a3(c,[-r*.45,r*.35,r*.55]),r*.15,'#ffffff',{flat:1,alpha:.75,d:-.15});B.ball(W1_a3(c,[-r*.15,r*.55,r*.6]),r*.07,'#ffffff',{flat:1,alpha:.7,d:-.15});
  const op=mode==='attack'?[.2,1,.4][f]:mode==='skill'?[.2,.6,1,.3][f]:.15;B.ball(W1_a3(c,[0,r*.85,-r*.1]),r*.3,'#1a3010',{flat:1,sx:1.3,sy:.3+op*.5,alpha:.85,d:-.1});
  for(const g of[-1,1])B.ball(W1_a3(c,[g*r*.3,r*.78,r*.12]),r*.08,'#e0ff90',{flat:1,glow:'170,255,120',d:-.12});
  if(mode==='skill'&&f>=1)for(let i=0;i<4;i++)B.glow(W1_a3(c,[Math.sin(i*1.7)*r,r*.9+i*2,r*.2-i]),1.2+i*.4,'170,255,120',.6);}}]);
// ---------- (2차) 공통 헬퍼 ----------
// biped 날개 뼈대·막 혈관(plan 날개와 같은 좌표)
function W1_wingBones(B,K,J,col,o={}){const{bw,sh,H}=J,f=B.f,t=B.t,mode=B.mode;const fl=Math.sin(f*1.6+(mode==='run'?1:0)+t/250)*4+(mode==='buff'?6:0);
  for(const sg of[-1,1]){const r0=[5*sg*bw,-3,sh-2],e=[18*sg*bw,-8,sh+8+fl],tp=[24*sg*bw,-10,sh-2+fl],m=[16*sg*bw,-7,H-2+fl*.5],l=[8*sg*bw,-4,H+2];
    if(o.mem)B.poly([e,tp,m],o.mem,{alpha:.55,d:.47});
    B.cap(r0,e,1.7,col,{w1:1.1,d:.44});for(const q of[tp,m,l])B.cap(e,q,.75,col,{w1:.3,d:.43});
    B.cap(e,W1_a3(e,[1.6*sg,-.4,2.4]),.9,o.claw||'#e8dcc0',{w1:.1,d:.42});B.ball(e,1,K.tone(col,.15),{d:.42});}}
// biped 꼬리 경로(plan과 같은 점)
function W1_tailPts(B){const J=B.J,H=J.H;return[[0,-4,H+2],[0,-12,H-2+Math.sin(B.t/300+B.f)*2],[0,-18,H+3]];}
// 맨몸 근육(가슴·복근)
function W1_muscle(B,K,J,col,o={}){const{bw,H,sh}=J,y=(o.y||6.6)*bw;
  for(const g of[-1,1])B.ball([g*3.4*bw,y+.6,sh-3.5],3.3*bw,K.tone(col,.1),{sy:.55,sx:1.1,d:-.3});
  for(let i=0;i<3;i++)for(const g of[-1,1])B.ball([g*1.5*bw,y-.2,sh-8-i*2.6],1.35*bw,i%2?K.tone(col,-.05):K.tone(col,.06),{sy:.6,d:-.32});
  B.cap([0,y+.4,sh-6],[0,y-.2,H+2],.5,K.tone(col,-.4),{d:-.34,alpha:.7});}
// 가죽 띠 + 징 일반(두 점 사이)
function W1_strap(B,a,b,col,w=1.4,stud){B.cap(a,b,w,col,{d:-.36});if(stud)for(let i=1;i<4;i++)B.ball(W1_mid(a,b,i/4),.45,stud,{d:-.45});}
// 머리 뿔 마디(두 점 사이 고리)
function W1_hornRings(B,a,b,w,col,n=3){for(let i=1;i<=n;i++)B.cap(W1_a3(W1_mid(a,b,i/(n+1)),[0,-.2,0]),W1_a3(W1_mid(a,b,i/(n+1)),[0,.2,0]),w*(1-i/(n+2)),col,{d:-.07});}

// ======================= 67 임프 =======================
Q.push(['임프',{skin:'#963322',cloth:'#5e1716',pants:'#3e0e0c',horns:'#241614',wings:'#5a1a1a',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,sk=s.skin,bw=J.bw,H=J.H,sh=J.sh;
  W1_wingBones(B,K,J,'#3a1210',{mem:'#7a2a20'});
  W1_muscle(B,K,J,s.cloth);
  // 등 가시 줄
  for(let i=0;i<4;i++){const z=sh-2-i*3.6;B.cap([0,-6.6*bw,z],[0,-8.4*bw,z+1.6],1.1,'#2a1410',{w1:.15,d:.05});}
  // 허리 천·해골 버클
  W1_loin(B,K,J,'#2a0e0c',{back:1,len:7,w:3});B.cap([-6.8*bw,1.6,H+1.8],[6.8*bw,1.6,H+1.8],1.8,'#2a1a14',{d:-.3});B.ball([0,6.7*bw,H+2],1.3,'#d8d0b8',{d:-.5});for(const g of[-1,1])B.ball([g*.5,7.2*bw,H+2.2],.35,'#1a0a08',{flat:1,d:-.55});
  // 팔찌(금)·손톱 진하게
  for(const g of[-1,1]){const el=W.el(g),h=W.h(g),a=W1_mid(el,h,.6);B.cap(W1_a3(a,[-1.8,0,0]),W1_a3(a,[1.8,0,0]),1.1,'#c8a040',{d:-.12});
    for(let i=-1;i<=1;i++)B.cap(W1_a3(h,[i*.8,.6,-.2]),W1_a3(h,[i*1.1,2.6,-1.6]),.65,'#1a0e0c',{w1:.1,d:-.15});}
  // 얼굴: 눈두덩·송곳니·귀·뿔 마디
  for(const g of[-1,1]){B.cap(P(.55*g,.72,.42),P(.12*g,.85,.3),r*.17,K.tone(sk,-.45),{d:-.1});B.cap(P(.22*g,1.25,-.5),P(.22*g,1.28,-.82),r*.1,'#f4ecd8',{w1:r*.03,d:-.14});
    B.cap(P(.85*g,0,.2),P(1.5*g,-.35,.5),r*.3,sk,{w1:r*.05,d:.02});B.cap(P(.9*g,.02,.22),P(1.35*g,-.25,.45),r*.12,K.tone(sk,-.35),{w1:r*.03,d:0});
    W1_hornRings(B,P(.5*g,-.1,.8),P(1.3*g,-.6,1.5),r*.42,'#4a302a',2);}
  B.ball(P(0,1.38,-.3),r*.14,'#1a0806',{flat:1,sx:1.4,d:-.12});
  // 꼬리 가시 촉
  const tp=W1_tailPts(B),c2=tp[2];for(let i=0;i<2;i++)B.ball(W1_mid(tp[i],tp[i+1]),1.2,K.tone(sk,-.3),{sy:.6,d:-.02});
  B.poly([W1_a3(c2,[0,1,2.2]),W1_a3(c2,[-2.4,-2,0]),W1_a3(c2,[0,-1,-1.4]),W1_a3(c2,[2.4,-2,0])],'#2a0e0c',{grad:1,d:-.04});
  if(B.mode==='skill')B.glow(J.p.hR,2+B.f,'255,120,60',.5);}}]);

// ======================= 70 아울베어 =======================
Q.push(['아울베어',{skin:'#6e5034',face:'#c8aa78',cloth:'#6a4c30',pants:'#5a3e24',fur:'#7c5c3a',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,sk=s.skin;
  // 몸 털결(앞뒤 겹 깃털털)
  for(let row=0;row<5;row++){const z=sh-1-row*3.2,n=5-(row>2?1:0);for(let i=0;i<n;i++){const x=(i-(n-1)/2)*3*bw+(row%2)*1.2;
    const j=Math.sin(i*3.7+row*1.9)*.8;B.cap([x+j,6.9*bw,z+.6],[x*1.05+j*1.4,7.3*bw,z-2],1.3*bw,(i+row)%2?'#7e603e':'#8a6a46',{w1:.3,d:-.3,alpha:.85});
    B.cap([x-j,-7.4*bw,z+.6],[x*1.05-j*1.4,-7.8*bw,z-2],1.4*bw,(i+row)%2?'#5e4228':'#664a2e',{w1:.3,d:.05,alpha:.85});}}
  // 가슴 V 무늬(흰 반점)
  for(let i=0;i<4;i++)for(const g of[-1,1])B.cap([g*(1+i*1.1)*bw,7.9*bw,sh-5-i*2.4],[g*(.4+i*1.1)*bw,7.9*bw,sh-6.2-i*2.4],.9,'#e0d0b0',{w1:.2,d:-.4,alpha:.8});
  // 옆구리·어깨 털뭉치
  for(const g of[-1,1]){for(let i=0;i<3;i++)B.cap([g*10*bw,(i-1)*2,sh-1-i*2],[g*11.5*bw,(i-1)*2-.5,sh-5-i*2],2.6*bw,i%2?'#7a5a38':'#634528',{w1:.6,d:-.1});
    const kn=W.kn(g);for(let i=0;i<3;i++)B.cap(W1_a3(kn,[(i-1)*1.6,1,1.5]),W1_a3(kn,[(i-1)*1.8,1.6,-2.6]),2*bw,i%2?'#5e4226':'#70522f',{w1:.4,d:-.12});
    const ft=W.ft(g);for(let i=-1;i<=1;i++)B.cap(W1_a3(ft,[i*1.2,2.8,1]),W1_a3(ft,[i*1.4,4.6,.2]),.8,'#1e1610',{w1:.15,d:-.15});
    const h=W.h(g),el=W.el(g);B.cap(W1_mid(el,h,.3),W1_mid(el,h,.75),5*bw,'#6a4c2e',{w1:3.6*bw,d:-.04,alpha:.9});
    for(let i=-1;i<=1;i++)B.cap(W1_a3(h,[i*1,1,0]),W1_a3(h,[i*1.4,4.2,-2]),.95,'#241a12',{w1:.15,d:-.16});}
  // 얼굴: 깃털 고리·부리 갈고리·눈썹 깃·귀깃
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2;B.cap(P(Math.cos(a)*.95,.45,Math.sin(a)*.8),P(Math.cos(a)*1.2,.25,Math.sin(a)*1.02),r*.22,i%2?'#4a3220':'#5e4228',{w1:r*.05,d:-.02});}
  for(const g of[-1,1]){B.cap(P(.1*g,.95,.45),P(.7*g,.75,.55),r*.14,'#3a2614',{w1:r*.05,d:-.1});B.ball(P(.36*g,.83,.12),r*.31,'#3a2614',{flat:1,d:-.055});B.ball(P(.36*g,.85,.12),r*.24,'#f8d860',{flat:1,glow:'255,230,120',d:-.065});B.ball(P(.36*g,.92,.12),r*.11,'#100',{flat:1,d:-.08});B.ball(P(.32*g,.94,.2),r*.04,'#fff',{flat:1,d:-.09});
    B.cap(P(.6*g,-.1,.8),P(.95*g,-.35,1.7),r*.2,'#3a2614',{w1:r*.04,d:-.03});}
  B.cap(P(0,1.05,.05),P(0,1.42,-.35),r*.3,'#3a3020',{w1:r*.1,d:-.12});B.cap(P(0,1.42,-.35),P(0,1.3,-.72),r*.12,'#2a2014',{w1:r*.03,d:-.13});
  if(B.mode==='attack'&&B.f===1)B.ball(P(0,1.15,-.55),r*.22,'#5a1010',{flat:1,d:-.11});}}]);

// ======================= 73 난쟁이족 전사 =======================
Q.push(['난쟁이족 전사',{armor:'#6e727a',pants:'#4e3624',belt:'#3a2410',beard:'#b0482e',helm:'#8e959e',pads:'#8a9098',shield:'#6a4a2c',skin:'#d09a74',wcol:'#a8aeb6',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H;
  W1_chain(B,K,J,'#8a8e96');W1_harness(B,K,J,'#4a2e18',{stud:'#c8b070'});
  B.ball([0,6.8*bw,H+1.6],2,'#c8a040',{sx:1.3,sy:.8,d:-.5});B.ball([0,7.2*bw,H+1.6],1.1,'#7a5a20',{sx:1.3,sy:.6,d:-.55});
  for(const g of[-1,1]){W1_pauldron(B,K,J,g,'#7a8088',{rivet:'#d8c890'});W1_bracer(B,K,W,g,'#5a3a22',{band:'#a0a6ae',stud:'#d0c090'});W1_greave(B,K,W,g,'#7a8088',{strap:'#3a2410'});}
  W1_helm(B,K,J,W,'#8e959e',{horns:'#e0d4b4'});
  // 땋은 수염·콧수염·구슬
  for(const g of[-1,1]){const a=P(.28*g,.9,-.8),b=P(.24*g,.92,-1.95);for(let i=0;i<4;i++)B.ball(W1_mid(a,b,i/3.4),r*.15,i%2?'#c05638':'#9a3e24',{d:-.22});B.ball(W1_a3(b,[0,0,-.4]),r*.13,'#d8b040',{d:-.24});
    B.cap(P(.05*g,1.02,-.3),P(.6*g,.95,-.55),r*.2,'#b84e30',{w1:r*.08,d:-.2});}
  for(let i=0;i<4;i++)B.cap(P((i-1.5)*.22,.88,-.4),P((i-1.5)*.18,.9,-1.3),r*.12,'#7a3420',{w1:r*.04,d:-.21,alpha:.7});
  B.ball(P(0,1.05,-.1),r*.2,'#c07a5a',{d:-.15});
  W1_axe(B,K,W,s);W1_shield(B,K,J,{boss:'#a8a090',bar:'#8a8e96',mark:'#c8a040'});}}]);

// ======================= 76 리자드맨 =======================
Q.push(['리자드맨',{skin:'#466e3e',cloth:'#4a3a22',pants:'#3a5634',crest:'#b89030',shield:'#5a3e24',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,sk=s.skin;
  // 배 판·비늘
  for(let i=0;i<5;i++)B.cap([-3*bw,6.9*bw,sh-3-i*2.6],[3*bw,6.9*bw,sh-3-i*2.6],1.5,i%2?'#c8b878':'#b0a060',{d:-.33});
  W1_harness(B,K,J,'#3a2814',{stud:'#c8b070'});W1_loin(B,K,J,'#5a4226',{back:1,len:7});
  for(let rI=0;rI<4;rI++)for(let i=0;i<3;i++)B.ball([(i-1)*3*bw+(rI%2)*1.4,-7*bw,sh-2-rI*3],1.6*bw,(i+rI)%2?K.tone(sk,-.2):K.tone(sk,.05),{sy:.6,d:.02});
  for(const g of[-1,1]){const el=W.el(g),h=W.h(g);for(let i=0;i<3;i++)B.ball(W1_mid(el,h,.2+i*.25),1.1,K.tone(sk,-.25),{flat:1,sy:.6,d:-.1});
    const ft=W.ft(g);for(let i=-1;i<=1;i++)B.cap(W1_a3(ft,[i*1,2.6,1]),W1_a3(ft,[i*1.3,4.4,.1]),.6,'#e0d8b8',{w1:.1,d:-.14});
    W1_bracer(B,K,W,g,'#5a4226',{band:'#2a1a10'});}
  // 머리: 볏 막·이빨·콧구멍·눈두덩
  B.poly([P(0,.5,.95),P(0,-.1,1.7),P(0,-1.2,1.35),P(0,-1.4,.5)],'#a07828',{grad:1,alpha:.85,d:.02});
  for(let i=0;i<5;i++)for(const g of[-1,1])B.cap(P(.3*g,.9+i*.25,-.48),P(.3*g,.9+i*.25,-.68),r*.08,'#f4ecd8',{w1:r*.02,d:-.12});
  B.cap(P(-.32,.85,-.5),P(-.28,2.05,-.55),r*.06,'#1a2014',{d:-.11});B.cap(P(.32,.85,-.5),P(.28,2.05,-.55),r*.06,'#1a2014',{d:-.11});
  for(const g of[-1,1]){B.ball(P(.18*g,2.1,-.2),r*.06,'#101',{flat:1,d:-.13});B.cap(P(.62*g,.62,.5),P(.2*g,.8,.42),r*.16,K.tone(sk,-.4),{d:-.1});}
  // 꼬리 등 돌기
  const tp=W1_tailPts(B);for(let i=0;i<2;i++)for(let j=1;j<3;j++){const q=W1_mid(tp[i],tp[i+1],j/3);B.cap(W1_a3(q,[0,0,1.2]),W1_a3(q,[0,-1,2.6]),.8,'#a07828',{w1:.1,d:-.03});}
  W1_spear(B,K,W,s,{tassel:'#c03020'});W1_shield(B,K,J,{boss:'#b8a888',mark:'#d0b040'});}}]);
// quad 꼬리 점들(plan과 같은 식)
function W1_tailQ(B,G){const s=B.s,n=s.tailN||3,{L,h,ny}=G;const pts=[[0,-L*.6+ny*.5,h+2]];for(let i=1;i<=n;i++)pts.push([Math.sin(B.t/300+i+B.f)*1.5*i*.5,-L*.6-i*(s.tailL||4),h+2+(s.tailUp||1.5)*i-(s.tailDrop||0)*i*i]);return pts;}
// quad 날개 뼈대
function W1_qWing(B,G,col,mem){const{L,h,ny,bw}=G,f=B.f,t=B.t,mode=B.mode;const fl=Math.sin(f*1.6+t/250)*5+(mode==='buff'?8:0)+(mode==='run'?4:0);
  for(const g of[-1,1]){const r0=[3*g,L*.1+ny,h+5],e=[18*g*bw,L*.1+ny-2,h+14+fl],tp=[26*g*bw,ny-6,h+6+fl],m=[14*g*bw,-L*.3,h+3+fl*.4],l=[3*g,-L*.2,h+4];
    if(mem)B.poly([e,tp,W1_mid(tp,m,.5),m],mem,{alpha:.45,d:.38});
    B.cap(r0,e,2,col,{w1:1.3,d:.35});for(const q of[tp,W1_mid(tp,m,.5),m])B.cap(e,q,.9,col,{w1:.35,d:.34});B.cap(e,W1_a3(e,[1.5*g,1,2.5]),1,'#e8e0c8',{w1:.1,d:.33});B.ball(e,1.2,col,{d:.33});}}
// 고드름/수정 기둥(밑점, 방향, 길이, 폭)
function W1_crystal(B,K,base,dir,len,w,col,o={}){const tip=W1_a3(base,dir,len);B.cap(base,tip,w*1.15,K.tone(col,-.45),{w1:w*.2,alpha:o.alpha??.95,d:(o.d??-.1)+.01});B.cap(base,tip,w,col,{w1:w*.15,alpha:o.alpha??.92,d:o.d??-.1});B.cap(W1_a3(base,dir,len*.15),W1_a3(base,dir,len*.8),w*.25,'#ffffff',{w1:w*.05,alpha:.55,d:(o.d??-.1)-.02});}

// ======================= 79 거대 여왕 개미 =======================
Q.push(['거대 여왕 개미',{skin:'#40220f',
 detail(B,K){const s=B.s,G=W1_bug(B),{bw,h,sp,hp,hr,snap,lunge}=G,t=B.t,f=B.f,sk=s.skin;
  // 거대 배: 마디 띠·광택·옅은 줄
  const ab=sp[0];for(let i=0;i<5;i++)B.ball(W1_a3(ab.p,[0,-ab.r*.7+i*ab.r*.36,ab.r*.55-Math.abs(i-2)*ab.r*.1]),ab.r*.9,i%2?K.tone(sk,-.35):K.tone(sk,.12),{flat:1,sx:1,sy:.16,d:-.12,alpha:.75});
  for(const g of[-1,1])for(let i=0;i<4;i++)B.ball(W1_a3(ab.p,[g*ab.r*.82,-ab.r*.55+i*ab.r*.36,0]),ab.r*.18,'#c8a070',{flat:1,sy:.5,d:-.1,alpha:.5});
  for(const q of sp)B.ball(W1_a3(q.p,[-q.r*.3,q.r*.15,q.r*.5]),q.r*.28,'#ffffff',{flat:1,alpha:.22,sy:.6,d:-.2});
  B.ball(W1_mid(sp[0].p,sp[1].p,.6),1.8*bw,K.tone(sk,-.15),{d:.05});B.ball(W1_mid(sp[1].p,sp[2].p,.5),1.5*bw,K.tone(sk,-.15),{d:.05});
  // 가슴 등판 돌기
  for(const g of[-1,1])B.cap(W1_a3(sp[1].p,[g*1.2,-.5,sp[1].r*.7]),W1_a3(sp[1].p,[g*2,-2.4,sp[1].r*1.5]),1,K.tone(sk,-.3),{w1:.15,d:-.1});
  // 머리: 여왕 왕관 돌기·겹눈·더듬이·큰 턱 톱니
  for(let i=-2;i<=2;i++){const a=W1_a3(hp,[i*hr*.28,-hr*.1,hr*.8]);B.cap(a,W1_a3(a,[i*.4,-.6,2.2-Math.abs(i)*.5]),.8,'#c8902a',{w1:.15,d:-.12});}
  B.cap(W1_a3(hp,[-hr*.7,-hr*.1,hr*.72]),W1_a3(hp,[hr*.7,-hr*.1,hr*.72]),.9,'#c8902a',{d:-.11});
  for(const g of[-1,1]){B.ball(W1_a3(hp,[g*hr*.65,hr*.35,hr*.35]),hr*.3,'#140804',{d:-.12});B.ball(W1_a3(hp,[g*hr*.6,hr*.45,hr*.5]),hr*.1,'#ffffff',{flat:1,alpha:.6,d:-.14});
    const a=W1_a3(hp,[g*hr*.3,hr*.6,hr*.7]),el=W1_a3(a,[g*1.6,1+Math.sin(t/200+g+f)*.6,4.6]),tp=W1_a3(el,[g*2,4.4,-1.2+Math.sin(t/170+g)*.8]);B.cap(a,el,.75,'#2a0c06',{w1:.6,d:-.1});B.cap(el,tp,.6,'#2a0c06',{w1:.4,d:-.1});B.ball(tp,.65,'#3a1208',{d:-.1});
    const m0=W1_a3(hp,[g*hr*.5,hr*.7,-hr*.3]),m1=W1_a3(hp,[g*hr*(.9-snap*.6),hr*1.7,-hr*.4]);for(let i=1;i<4;i++){const q=W1_mid(m0,m1,i/4);B.cap(q,W1_a3(q,[-g*.8,.2,0]),.45,'#1a0804',{w1:.1,d:-.12});}}
  // 다리 마디·털
  for(const lg of G.legs){B.ball(lg.knee,1*bw,K.tone(sk,-.2),{d:-.05});const q=W1_mid(lg.knee,lg.ft,.5);B.cap(q,W1_a3(q,[lg.sg*.8,0,.8]),.35,'#2a0c06',{w1:.1,d:-.05});}
  if(B.mode==='buff')for(let i=0;i<5;i++)B.glow(W1_a3(ab.p,[Math.sin(i*2.2)*ab.r,-ab.r*.3,ab.r*.4+i]),1.1,'255,220,140',.55);}}]);

// ======================= 82 아이스 골렘 =======================
Q.push(['아이스 골렘',{skin:'#9cc8e4',armor:'#9cc8e4',pants:'#84b4d8',pads:'#c0e0f4',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,ice='#d8f2ff',deep='#5a9ac8';
  // 가슴 금(얼음 깨짐)·면 하이라이트·핵
  B.line([[-6*bw,7.6*bw,sh-2],[-2*bw,8*bw,sh-6],[1*bw,8*bw,sh-5],[4*bw,7.8*bw,sh-10],[6*bw,7.2*bw,H+3]],deep,.6);
  B.line([[-2*bw,8*bw,sh-6],[-3*bw,7.6*bw,H+4]],deep,.5);B.line([[1*bw,8*bw,sh-5],[5*bw,7.8*bw,sh-3]],deep,.5);
  for(const g of[-1,1])B.poly([[g*1*bw,8.4*bw,sh-2],[g*6*bw,7.6*bw,sh-2.5],[g*5*bw,7.6*bw,sh-7],[g*1.5*bw,8.2*bw,sh-6]],'#ffffff',{alpha:.22,d:-.35});
  B.ball([0,8.2*bw,sh-7],2.4,'#e0ffff',{glow:'150,230,255',alpha:.9,d:-.4});
  // 어깨·등 수정 돌기
  for(const g of[-1,1]){const c=[9.6*g*bw,0,sh+1];W1_crystal(B,K,c,W1_n(.4*g,-.1,1),10,3.6,ice,{d:-.3});W1_crystal(B,K,W1_a3(c,[1.5*g,-1.5,-1]),W1_n(.9*g,-.3,.7),7,2.8,'#b8e0f8',{d:-.3});W1_crystal(B,K,W1_a3(c,[-1*g,1,0]),W1_n(.2*g,.4,1),6,2.2,'#e8f8ff',{d:-.31});}
  for(let i=0;i<3;i++)W1_crystal(B,K,[(i-1)*4*bw,-7*bw,sh-1-i*3],W1_n((i-1)*.4,-.8,.6),8-i,3,i%2?'#b8e0f8':ice,{d:.05});
  // 팔: 고드름·주먹 수정
  for(const g of[-1,1]){const el=W.el(g),h=W.h(g);for(let i=0;i<3;i++)W1_crystal(B,K,W1_a3(W1_mid(el,h,.2+i*.25),[0,0,-1.5]),[0,0,-1],2.5+i%2,1.3,'#d8f2ff',{d:-.08});
    for(let i=-1;i<=1;i++)W1_crystal(B,K,W1_a3(h,[i*1.6,1.6,1]),W1_n(i*.3,.5,.8),2.6,1.3,ice,{d:-.15});
    const kn=W.kn(g);B.ball(W1_a3(kn,[0,1.5,0]),3*bw,'#c8e8fa',{sy:.8,d:-.12,alpha:.9});}
  // 머리: 얼음 눈두덩·왕관 수정
  B.cap(P(-.8,.7,.45),P(.8,.7,.45),r*.32,'#c8eaff',{d:-.08});for(let i=-1;i<=1;i++)W1_crystal(B,K,P(i*.5,0,.8),W1_n(i*.3,-.1,1),r*(1.2-Math.abs(i)*.4),r*.4,ice,{d:-.05});
  B.ball(P(0,.9,-.4),r*.35,'#3a6a90',{flat:1,sx:1.4,sy:.4,d:-.09});
  for(let i=0;i<3;i++){const ph=((B.t/1500)+i/3)%1;B.glow([Math.sin(i*2.4)*8,Math.cos(i*1.6)*4,6+ph*40],1.2,'200,240,255',(1-ph)*.6);}}}]);

// ======================= 85 크로코다일 =======================
Q.push(['크로코다일',{skin:'#44522a',chest:'#a8a468',spines:'#2e3a18',
 detail(B,K){const s=B.s,G=W1_quad(B),{h,L,bw,ny,R0,hd,r,fwd,tip,jaw}=G,sk=s.skin;
  // 등 골판 2줄·옆 비늘 격자
  for(let i=0;i<8;i++){const y=-L*.5+i*L*.135+ny*.7;for(const g of[-1,1]){B.ball([g*R0*.35,y,h+R0*.98],R0*.24,(i%2)?K.tone(sk,-.25):K.tone(sk,-.1),{sy:.7,d:-.26});B.cap([g*R0*.35,y,h+R0*1.05],[g*R0*.35,y-.4,h+R0*1.25],.7,'#26301a',{w1:.2,d:-.27});}
    for(const g of[-1,1])B.ball([g*R0*.85,y,h+R0*.45],R0*.22,(i%2)?K.tone(sk,.08):K.tone(sk,-.15),{flat:1,sy:.8,d:-.2,alpha:.8});}
  for(let i=0;i<5;i++)B.cap([-R0*.55,-L*.35+i*L*.17+ny*.7,h-R0*.6],[R0*.55,-L*.35+i*L*.17+ny*.7,h-R0*.6],.8,'#c8c088',{d:-.12,alpha:.8});
  // 꼬리 골판
  const tp=W1_tailQ(B,G);for(let i=0;i<tp.length-1;i++){const q=W1_mid(tp[i],tp[i+1]),w=(s.tailW||2.4)*(1-(i+1)/(tp.length)*.6)*bw;for(const g of[-1,1])B.cap(W1_a3(q,[g*w*.3,0,w*.4]),W1_a3(q,[g*w*.2,-.6,w*.85]),.7,'#26301a',{w1:.15,d:-.08});}
  // 주둥이: 지그재그 이빨·콧구멍 혹·눈 혹·턱선
  const sn=s.snout??1.6;for(let i=0;i<6;i++){const q=W1_a3(hd,fwd,r*(.7+i*(sn*.9)/6));for(const g of[-1,1])B.cap(W1_a3(q,[g*r*.5,0,-r*.35]),W1_a3(q,[g*r*.52,0,-r*(i%2?.75:.6)]),r*.1,'#f0e8d0',{w1:r*.02,d:-.1});}
  for(const g of[-1,1]){B.cap(W1_a3(hd,[g*r*.55,0,-r*.3]),W1_a3(tip,[g*r*.4,-r*.1,-r*.1]),r*.12,'#2a2a14',{d:-.09});B.ball(W1_a3(tip,[g*r*.2,-r*.2,r*.45]),r*.17,K.tone(sk,-.15),{d:-.08});
    B.ball(W1_a3(W1_a3(hd,fwd,r*.5),[g*r*.45,0,r*.7]),r*.32,K.tone(sk,-.05),{d:-.07});B.ball(W1_a3(W1_a3(hd,fwd,r*.62),[g*r*.45,0,r*.85]),r*.16,'#d8c030',{flat:1,d:-.1});B.ball(W1_a3(W1_a3(hd,fwd,r*.66),[g*r*.45,0,r*.85]),r*.06,'#100',{flat:1,sx:.4,d:-.12});}
  for(let i=0;i<3;i++)B.ball(W1_a3(hd,fwd,r*(.9+i*.6)),r*.22,K.tone(sk,-.2),{flat:1,sy:.4,d:-.08,alpha:.7});
  for(const lg of G.legs)for(let i=-1;i<=1;i++)B.cap(W1_a3(lg.ft,[i*.9,.9,.2]),W1_a3(lg.ft,[i*1.3,2.2,-.1]),.5,'#d8d0b0',{w1:.1,d:-.1});}}]);

// ======================= 88 파푸리온 =======================
Q.push(['파푸리온',{skin:'#24587a',chest:'#80b8c8',wings:'#163852',spines:'#8ccae4',
 detail(B,K){const s=B.s,G=W1_quad(B),{h,L,bw,ny,R0,hd,r,fwd,tip,jaw,headUp}=G,sk=s.skin,t=B.t,f=B.f;
  W1_qWing(B,G,'#0e2638','#2a6a8a');
  // 등 비늘(엇갈림)·배 판
  for(let i=0;i<7;i++){const y=-L*.48+i*L*.15+ny*.7;for(const g of[-1,0,1])B.ball([g*R0*.55,y+(g?1:0),h+R0*(g?.78:1)],R0*.3,i%2?K.tone(sk,.15):K.tone(sk,-.15),{flat:1,sy:.6,d:-.25});}
  for(let i=0;i<5;i++)B.cap([-R0*.55,-L*.3+i*L*.17+ny*.7,h-R0*.55],[R0*.55,-L*.3+i*L*.17+ny*.7,h-R0*.55],1.2,i%2?'#a8d8e0':'#90c4d0',{d:-.15});
  // 목 비늘·지느러미 갈기
  const nk=[0,L*.5+ny+2,h+3+headUp*3];for(let i=0;i<4;i++){const q=W1_mid(nk,hd,i/4);B.cap(W1_a3(q,[0,-.5,2.6]),W1_a3(q,[0,-2,4.8]),1.5,'#8ccae4',{w1:.2,alpha:.85,d:-.05});B.cap([-2.2*bw,q[1]+.5,q[2]-1],[2.2*bw,q[1]+.5,q[2]-1],1,'#a8d8e0',{d:-.12});}
  // 머리: 지느러미 귀·뿔 마디·수염·이빨·눈두덩
  for(const g of[-1,1]){B.poly([W1_a3(hd,[g*r*.7,-r*.1,r*.3]),W1_a3(hd,[g*r*1.9,-r*.9,r*1.1]),W1_a3(hd,[g*r*1.6,-r*1.2,r*.1]),W1_a3(hd,[g*r*.8,-r*.5,-r*.1])],'#5aa8c8',{grad:1,alpha:.85,d:-.02});
    for(let i=1;i<3;i++)B.cap(W1_a3(hd,[g*r*.75,-r*.3,r*.1]),W1_a3(hd,[g*r*(1.2+i*.3),-r*(.6+i*.25),r*(.9-i*.35)]),.4,'#163852',{d:-.03});
    W1_hornRings(B,W1_a3(hd,[g*r*.4,-r*.3,r*.6]),W1_a3(hd,[g*r*.9,-r*1.6,r*1.4]),r*.34,'#9ac0d8',2);
    const w0=W1_a3(tip,[g*r*.35,-r*.2,-r*.2]),sw=Math.sin(t/300+g+f)*.8;B.cap(w0,W1_a3(w0,[g*3,-1,-2+sw]),.55,'#c0e8f8',{w1:.15,d:-.08});B.cap(W1_a3(w0,[g*3,-1,-2+sw]),W1_a3(w0,[g*5,-3,-1.5-sw]),.4,'#c0e8f8',{w1:.1,d:-.08});
    B.cap(W1_a3(W1_a3(hd,fwd,r*.45),[g*r*.7,0,r*.55]),W1_a3(W1_a3(hd,fwd,r*.85),[g*r*.25,0,r*.6]),r*.2,'#163852',{d:-.1});
    for(let i=0;i<3;i++)B.cap(W1_a3(W1_a3(hd,fwd,r*(1+i*.45)),[g*r*.42,0,-r*.42]),W1_a3(W1_a3(hd,fwd,r*(1+i*.45)),[g*r*.42,0,-r*.8]),r*.1,'#f4f8ff',{w1:r*.02,d:-.1});}
  // 꼬리 지느러미 끝
  const tp=W1_tailQ(B,G),e=tp[tp.length-1];B.poly([W1_a3(e,[0,1,1]),W1_a3(e,[-4,-4,3]),W1_a3(e,[0,-2.5,0]),W1_a3(e,[4,-4,3])],'#5aa8c8',{grad:1,alpha:.85,d:-.03});
  for(let i=1;i<tp.length-1;i+=2)B.cap(W1_a3(tp[i],[0,0,1.2]),W1_a3(tp[i],[0,-1.5,3]),1,'#8ccae4',{w1:.15,d:-.05});
  // 물방울 기운
  for(let i=0;i<4;i++){const ph=((t/1300)+i/4)%1;B.glow([Math.cos(i*1.7)*12,Math.sin(i*2.3)*8,6+ph*30],1.3,'140,220,255',(1-ph)*.6);}
  if(B.mode==='skill'&&f>=1)B.glow(tip,3+f,'140,220,255',.7);}}]);
// quad 몸 털뭉치(등·옆)
function W1_qFur(B,G,cols,o={}){const{L,h,ny,R0}=G;const n=o.n||6;for(let i=0;i<n;i++){const y=-L*.5+i*L/(n-1)*.95+ny*.7;for(const g of[-1,-.4,.4,1]){const c=cols[(i+Math.round(g*3))&1],side=Math.abs(g)>.5;
  const a=[g*R0*(side?.9:.45),y,h+R0*(side?.45:.95)],b=W1_a3(a,[g*(side?1.2:.5),-1.8,side?-2.2:-.6]);B.cap(a,b,R0*.38,c,{w1:.4,d:-.22,alpha:.9});}}}

// ======================= 91 크랩맨 =======================
Q.push(['크랩맨',{skin:'#b0402a',claw:'#c8503a',
 detail(B,K){const s=B.s,G=W1_bug(B),{bw,h,sp,hp,hr,snap,lunge,rear}=G,t=B.t,f=B.f,sk=s.skin;
  const cb=sp[0];
  // 등딱지: 테두리 돌기·혹·반점·광택
  for(let i=0;i<9;i++){const a=(i/8-.5)*2.6;const q=W1_a3(cb.p,[Math.sin(a)*cb.r*.95,Math.cos(a)*cb.r*.75,cb.r*.15]);B.cap(q,W1_a3(q,[Math.sin(a)*1.3,Math.cos(a)*1.2,.6]),.9,K.tone(sk,-.2),{w1:.15,d:-.15});}
  for(let i=0;i<7;i++){const q=W1_a3(cb.p,[Math.sin(i*2.4)*cb.r*.5,Math.cos(i*1.7)*cb.r*.4,cb.r*.62]);B.ball(q,cb.r*.13,K.tone(sk,i%2?.15:-.2),{sy:.7,d:-.14});}
  B.cap(W1_a3(cb.p,[-cb.r*.5,cb.r*.2,cb.r*.55]),W1_a3(cb.p,[cb.r*.5,cb.r*.2,cb.r*.55]),.6,K.tone(sk,-.4),{d:-.13,alpha:.6});
  B.ball(W1_a3(cb.p,[-cb.r*.3,cb.r*.1,cb.r*.6]),cb.r*.3,'#ffffff',{flat:1,alpha:.25,sy:.5,d:-.2});
  B.ball(W1_a3(cb.p,[0,0,-cb.r*.35]),cb.r*.85,'#e8c8a0',{flat:1,sy:.5,d:.05,alpha:.6});
  // 눈자루·입 수염
  for(const g of[-1,1]){const a=W1_a3(hp,[g*hr*.4,hr*.6,hr*.4]),b=W1_a3(a,[g*.5,.4,2.4]);B.cap(a,b,.7,K.tone(sk,-.1),{w1:.5,d:-.12});B.ball(b,.95,'#141010',{d:-.14});B.ball(W1_a3(b,[-.2,.3,.3]),.3,'#ffffff',{flat:1,d:-.16});
    B.cap(W1_a3(hp,[g*hr*.2,hr*.95,-hr*.1]),W1_a3(hp,[g*hr*.5,hr*1.6,-hr*.4+Math.sin(t/200+g)*.4]),.35,'#e8b090',{w1:.1,d:-.12});}
  for(let i=0;i<3;i++)B.ball(W1_a3(hp,[(i-1)*hr*.25,hr*.95,-hr*.35]),hr*.13,'#e8d8a8',{alpha:.7,d:-.12});
  // 집게: 움직이는 손가락·톱니·검은 끝
  for(const g of[-1,1]){const el=W1_a3(hp,[g*hr*1.9,hr*1.6+lunge*.3,1+rear*2]),cl=W1_a3(el,[g*-1*(1-snap*.5),3.5+snap*2,.5]);
    B.ball(W1_a3(el,[0,.5,.5]),2.2*bw,K.tone(s.claw,.08),{sy:.8,d:-.05});const mv=W1_a3(el,[g*(1.6+snap*1.4),3+snap*1.4,-.6]);B.cap(W1_a3(el,[g*.8,.8,-.4]),mv,1.2*bw,K.tone(s.claw,-.1),{w1:.35,d:-.07});
    for(let i=1;i<4;i++){const q=W1_mid(el,cl,i/4);B.cap(q,W1_a3(q,[g*.7,.1,-.3]),.35,'#f0d8b8',{w1:.1,d:-.1});}B.ball(cl,.6,'#2a1010',{d:-.1});B.ball(mv,.5,'#2a1010',{d:-.1});
    for(let i=0;i<4;i++)B.ball(W1_a3(el,[Math.sin(i*1.9)*1.2,Math.cos(i)*.8,.8+i*.2]),.35,K.tone(sk,.3),{d:-.08});}
  // 다리 줄무늬·관절
  for(const lg of G.legs){B.ball(lg.knee,.9*bw,K.tone(sk,-.25),{d:-.05});const q=W1_mid(lg.knee,lg.ft,.5);B.cap(W1_a3(q,[-.4,0,0]),W1_a3(q,[.4,0,0]),.8,'#e8c8a0',{d:-.06,alpha:.7});B.ball(lg.ft,.45,'#2a1010',{d:-.06});}
  if(B.mode==='skill')for(let i=0;i<4;i++)B.glow(W1_a3(hp,[Math.sin(i*2)*3,hr+2+i,i*.8]),1+i*.3,'220,240,255',.5);}}]);

// ======================= 94 일렉카둠 =======================
Q.push(['일렉카둠',{skin:'#6ab0f8',core:'#f0faff',
 detail(B,K){const s=B.s,{mode,f,t}=B,run=mode==='run',walk=mode==='walk'||run,r=s.r||9;const ph=f*Math.PI/2;let hop=walk?Math.abs(Math.sin(ph))*(run?5:3):0,lunge=0,pulse=0;
  if(mode==='attack')lunge=[-2,5,1][f];if(mode==='buff')pulse=[.05,.12,.12,.06][f];if(mode==='skill')lunge=[0,0,2,0][f];
  const z0=6+Math.sin(t/500+f)*1.5+hop,c0=[0,lunge,z0+r*1.2],R0=r*(.8+pulse);
  // 겹 껍질·속 핵·표면 무늬
  B.ball(c0,R0*1.08,'#1a3a70',{alpha:.35,d:.12});B.ball(c0,R0*.62,'#c8e8ff',{alpha:.7,d:.02});B.ball(c0,R0*.32,'#ffffff',{glow:'190,230,255',d:-.02});
  for(let i=0;i<3;i++){const a=t/700+i*2.1+f*.5;B.line(Array.from({length:7},(_,j)=>{const b=a+j*.45;return W1_a3(c0,[Math.cos(b)*R0*.95,Math.sin(b)*R0*.95*Math.cos(i),Math.sin(b)*R0*.95*Math.sin(i)*.9]);}),'#e8f6ff',.45);}
  B.ball(W1_a3(c0,[-R0*.35,R0*.3,R0*.45]),R0*.2,'#ffffff',{flat:1,alpha:.6,d:-.2});
  // 궤도 고리(금속 조각)·전극 돌기
  for(let i=0;i<6;i++){const a=t/450+i/6*Math.PI*2+f*.3;const q=W1_a3(c0,[Math.cos(a)*r*1.4,Math.sin(a)*r*1.4,Math.sin(a)*r*.3]);B.cap(q,W1_a3(q,[-Math.sin(a)*1.6,Math.cos(a)*1.6,0]),.9,i%2?'#8aa0b8':'#c8d4e0',{d:-.05});}
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2+.3;const q=W1_a3(c0,[Math.cos(a)*R0*.95,Math.sin(a)*R0*.95,R0*.15*(i%2?1:-1)]);B.cap(q,W1_a3(q,[Math.cos(a)*1.8,Math.sin(a)*1.8,0]),.7,'#d0e0f0',{w1:.2,d:-.08});B.glow(W1_a3(q,[Math.cos(a)*2,Math.sin(a)*2,0]),1.2,'180,220,255',.6);}
  // 번개 가지
  const nA=mode==='skill'||mode==='attack'?4:3;for(let i=0;i<nA;i++){const a=i*2.4+f*1.3+t/150;B.arc([c0,W1_a3(c0,[Math.cos(a)*r*1.3,Math.sin(a)*r*1.3,r*.6*Math.sin(i+f)]),W1_a3(c0,[Math.cos(a+.7)*r*1.45,Math.sin(a+.7)*r*1.45,-r*.3+i*.5])],'170,215,255',.7);}
  B.ball([0,lunge,.2],r*.9,'#5080c0',{flat:1,sy:.45,alpha:.25,d:.3});
  if(mode==='attack'&&f===1)B.spark(W1_a3(c0,[0,r*1.1,0]),4.5,'200,230,255',.9);}}]);

// ======================= 97 곰 =======================
Q.push(['곰',{skin:'#4e321e',chest:'#5c3e26',earC:'#3a2414',
 detail(B,K){const s=B.s,G=W1_quad(B),{h,L,bw,ny,R0,hd,r,fwd,tip,jaw}=G,sk=s.skin;
  W1_qFur(B,G,['#5a3c24','#45301c'],{n:6});
  // 어깨 혹 털·목 갈기
  B.ball([0,L*.3+ny,h+R0*1.05],R0*.6,'#5e4026',{sy:.8,d:-.2});for(let i=0;i<5;i++)B.cap([(i-2)*1.6,L*.38+ny,h+R0*1.2],[(i-2)*1.9,L*.3+ny-1.5,h+R0*.7],1.8,i%2?'#6a4a2c':'#553820',{w1:.3,d:-.22});
  for(const g of[-1,1])B.cap(W1_a3(hd,[g*r*.75,-r*.2,-r*.1]),W1_a3(hd,[g*r*1.15,-r*.7,-r*.6]),r*.5,'#4a2e1a',{w1:r*.1,d:-.04});
  // 주둥이 밝게·코·눈두덩·귀 속
  const sn=s.snout??1.6;B.cap(W1_a3(hd,fwd,r*.7),W1_a3(tip,fwd,-r*.15),r*.7,'#8a6a48',{w1:r*.55,d:-.06});B.ball(tip,r*.34,'#120c0a',{sx:1.2,sy:.8,d:-.1});B.ball(W1_a3(tip,[-r*.1,0,r*.12]),r*.09,'#ffffff',{flat:1,alpha:.5,d:-.12});
  B.cap(W1_a3(tip,[0,-r*.15,-r*.3]),W1_a3(tip,[0,-r*.6,-r*.4]),r*.08,'#1a0e0a',{d:-.1});
  for(const g of[-1,1]){B.cap(W1_a3(W1_a3(hd,fwd,r*.5),[g*r*.62,0,r*.5]),W1_a3(W1_a3(hd,fwd,r*.75),[g*r*.15,0,r*.55]),r*.18,'#2a1a10',{d:-.1});B.ball(W1_a3(hd,[g*r*.65,-r*.1,r*.8]),r*.2,'#7a5a40',{flat:1,d:-.02});
    if(jaw>.3)B.cap(W1_a3(tip,[g*r*.3,-r*.2,-r*.35]),W1_a3(tip,[g*r*.3,-r*.2,-r*.85]),r*.1,'#f0e8d0',{w1:r*.03,d:-.12});}
  if(jaw>.3)B.ball(W1_a3(tip,[0,-r*.3,-r*.55]),r*.3,'#701818',{flat:1,sy:.6,d:-.09});
  // 다리 털·발톱
  for(const lg of G.legs){B.cap(lg.top,W1_mid(lg.kn,lg.ft,.3),(s.legW||3.6)*bw*.95,'#47301c',{w1:2.6*bw,d:-.03,alpha:.8});for(let i=-1;i<=1;i++)B.cap(W1_a3(lg.ft,[i*.8,.9,.3]),W1_a3(lg.ft,[i*1.1,2.1,-.1]),.6,'#d8d0b8',{w1:.12,d:-.1});}}}]);

// ======================= 100 터틀 드래곤 =======================
Q.push(['터틀 드래곤',{skin:'#4e6c40',chest:'#b8a868',shell:'#5c4c30',
 detail(B,K){const s=B.s,G=W1_quad(B),{h,L,bw,ny,R0,hd,r,fwd,tip,jaw}=G,sk=s.skin,f=B.f;
  const sc=[0,ny*.6,h+R0*.55];
  // 등딱지: 판 테두리 선·성장선·가장자리 가시·중앙 혹
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2,c=W1_a3(sc,[Math.cos(a)*R0*.8,Math.sin(a)*R0*.8,R0*.6]);
    B.line(Array.from({length:7},(_,j)=>{const b=j/6*Math.PI*2;return W1_a3(c,[Math.cos(b)*R0*.36,Math.sin(b)*R0*.36,R0*.02]);}),'#2a2010',.5);
    B.line(Array.from({length:7},(_,j)=>{const b=j/6*Math.PI*2;return W1_a3(c,[Math.cos(b)*R0*.2,Math.sin(b)*R0*.2,R0*.03]);}),'#7a6a48',.35);
    B.cap(W1_a3(c,[0,0,R0*.03]),W1_a3(c,[Math.cos(a)*.4,Math.sin(a)*.4,R0*.25]),1,'#8a7850',{w1:.2,d:-.33});}
  B.cap(W1_a3(sc,[0,0,R0*.85]),W1_a3(sc,[0,-.5,R0*1.35]),2,'#8a7850',{w1:.3,d:-.35});
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2,q=W1_a3(sc,[Math.cos(a)*R0*1.45,Math.sin(a)*R0*1.45,-R0*.05]);B.cap(q,W1_a3(q,[Math.cos(a)*1.8,Math.sin(a)*1.8,.8]),1.4,'#d8d0a8',{w1:.15,d:-.25});}
  // 목 주름·뿔 마디·등 볏·이빨·눈두덩
  const nk=[0,L*.5+ny+2,h+3];for(let i=1;i<4;i++){const q=W1_mid(nk,hd,i/4);B.cap(W1_a3(q,[-2.2*bw,.3,-.5]),W1_a3(q,[2.2*bw,.3,-.5]),.7,K.tone(sk,-.25),{d:-.1});}
  for(const g of[-1,1]){W1_hornRings(B,W1_a3(hd,[g*r*.4,-r*.3,r*.6]),W1_a3(hd,[g*r*.9,-r*1.6,r*1.4]),r*.34,'#a09868',2);
    B.cap(W1_a3(W1_a3(hd,fwd,r*.45),[g*r*.65,0,r*.55]),W1_a3(W1_a3(hd,fwd,r*.85),[g*r*.2,0,r*.62]),r*.2,K.tone(sk,-.4),{d:-.1});
    for(let i=0;i<2;i++)B.cap(W1_a3(W1_a3(hd,fwd,r*(1.1+i*.45)),[g*r*.4,0,-r*.4]),W1_a3(W1_a3(hd,fwd,r*(1.1+i*.45)),[g*r*.4,0,-r*.75]),r*.11,'#f0e8d0',{w1:r*.03,d:-.1});}
  for(let i=0;i<3;i++)B.cap(W1_a3(hd,[0,-r*(.2+i*.5),r*.85]),W1_a3(hd,[0,-r*(.5+i*.5),r*1.4]),r*.2,'#c8b870',{w1:r*.03,d:-.06});
  // 다리 비늘·발톱·꼬리 가시
  for(const lg of G.legs){for(let i=0;i<3;i++)B.ball(W1_mid(lg.top,lg.kn,.3+i*.3),1.2*bw,K.tone(sk,i%2?.1:-.2),{flat:1,sy:.7,d:-.06});for(let i=-1;i<=1;i++)B.cap(W1_a3(lg.ft,[i*.9,.9,.2]),W1_a3(lg.ft,[i*1.3,2.2,-.1]),.6,'#e0d8b8',{w1:.12,d:-.1});}
  const tp=W1_tailQ(B,G);for(let i=1;i<tp.length;i++)B.cap(W1_a3(tp[i],[0,0,.8]),W1_a3(tp[i],[0,-1,2.4]),1,'#c8b870',{w1:.15,d:-.05});
  if(B.mode==='skill'&&f>=1)B.glow(tip,2.5+f,'200,255,140',.6);}}]);
// 불꽃 혀(점에서 위로 흔들리는 겹 불길)
function W1_flame(B,p,sz,ph=0,o={}){const t=B.t,f=B.f,w=Math.sin(t/120+f*1.9+ph)*.35*sz,w2=Math.cos(t/90+f*2.3+ph)*.3*sz;
  B.cap(p,W1_a3(p,[w,0,sz*1.6]),sz*.9,o.c1||'#d83010',{w1:sz*.1,alpha:.8,d:o.d??-.2});B.cap(W1_a3(p,[0,0,sz*.2]),W1_a3(p,[w2,0,sz*1.2]),sz*.6,o.c2||'#ff9020',{w1:sz*.08,alpha:.85,d:(o.d??-.2)-.02});
  B.cap(W1_a3(p,[0,0,sz*.25]),W1_a3(p,[w*.5,0,sz*.75]),sz*.3,o.c3||'#ffe890',{w1:sz*.06,alpha:.9,d:(o.d??-.2)-.04});if(!o.noGlow)B.glow(W1_a3(p,[0,0,sz*.6]),sz*1.1,o.g||'255,130,40',.35);}
// bird 상태 재계산
function W1_bird(B){const s=B.s,{mode,f,t}=B,run=mode==='run';let peck=0,wing=Math.sin(t/300+f)*2,up=0;if(mode==='attack')peck=[-.3,1,.4][f];if(mode==='buff'){wing=8+f*2;up=1;}if(mode==='skill'){peck=[0,.5,1,.3][f];wing=[2,8,4,2][f];}if(run)wing+=5;
  const h=s.h||12;if(s.fly)wing+=6+Math.sin(t/120+f*1.6)*6;const hd=[0,7+peck*5,h+14-peck*5+up*3];const tail=[[0,-5,h+4]];for(let i=1;i<=4;i++)tail.push([Math.sin(t/300+i)*1.2,-5-i*3.5,h+4-i*1.5+i*i*.25]);return{h,wing,peck,up,hd,tail};}
// 해골 위 불꽃 공통(관절·머리)
function W1_burnSkel(B,K,J,W){const P=W.HP,r=J.hr;W1_flame(B,P(0,-.2,.9),r*.55,0);W1_flame(B,P(-.45,-.3,.7),r*.38,1.7);W1_flame(B,P(.45,-.3,.7),r*.38,3.1);
  for(const g of[-1,1]){B.glow(W.el(g),1.6,'255,120,30',.4);B.glow(W1_a3(W.kn(g),[0,.8,0]),1.8,'255,120,30',.4);}
  B.glow([0,2,J.sh-5],3.5,'255,110,20',.45);for(let i=0;i<3;i++){const ph=((B.t/900)+i/3)%1;B.glow([Math.sin(i*2.1)*4,Math.cos(i*1.3)*3,J.H+ph*28],1,'255,180,80',(1-ph)*.8);}
  for(const g of[-1,1])B.ball(P(.36*g,.8,.08),r*.13,'#ffd070',{flat:1,d:-.08});}

// ======================= 103 데스 =======================
Q.push(['데스',{cloth:'#0c0c10',armor:'#0c0c10',wcol:'#cfd4d8',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,t=B.t,f=B.f,p=J.p;
  // 두건(해골 뒤·옆을 감쌈)·어깨 망토
  B.ball(P(0,-.25,.25),r*1.25,'#141418',{sy:.9,d:.06});for(const g of[-1,1])B.poly([P(1.05*g,.55,.9),P(1.2*g,.1,1.1),P(1.25*g,-.2,-.9),P(.95*g,.5,-1)],'#18181e',{grad:1,d:-.12});
  B.poly([P(-1,.4,1.05),P(1,.4,1.05),P(0,-.2,1.6)],'#18181e',{grad:1,d:-.08});
  B.poly([[-11*bw,-2,sh+1],[11*bw,-2,sh+1],[12*bw,3,sh-5],[0,7*bw,sh-7],[-12*bw,3,sh-5]],'#1c1c22',{grad:1,d:-.15,alpha:.95});
  // 찢긴 옷자락 끈
  const tw=B.mode==='run'?6:B.mode==='walk'?3:1;for(let i=0;i<7;i++){const x=(i-3)*2.2*bw,sw=Math.sin(t/260+i*1.3+f)*1.2;B.cap([x,1-Math.abs(x)*.1,H-4],[x*1.2+sw,-1-tw*.5-Math.abs(i-3)*.4,H-14-(i%3)*3],1.8,i%2?'#101014':'#1e1e26',{w1:.3,d:.02,alpha:.9});}
  // 가슴 갈비 틈·뼈 손
  B.poly([[-2.4,7*bw,sh-3],[2.4,7*bw,sh-3],[1,7*bw,H+2],[-1,7*bw,H+2]],'#060608',{d:-.3});for(let i=0;i<3;i++)B.cap([-1.8,7.2*bw,sh-5-i*2.4],[1.8,7.2*bw,sh-5-i*2.4],.6,'#c8c0aa',{d:-.32});
  for(const g of[-1,1]){const h=W.h(g);for(let i=-1;i<=1;i++)B.cap(h,W1_a3(h,[i*.8,1.6,-1.2]),.5,'#e6dfcc',{w1:.25,d:-.12});B.cap(W1_mid(W.el(g),h,.3),W1_mid(W.el(g),h,.85),4.6,'#16161c',{w1:5.4,d:-.05});}
  // 낫: 날 하이라이트·등뼈·자루 감기·해골 장식
  const pt=k=>W1_a3(p.hR,p.dS,k);const a=pt(16);B.line([W1_a3(a,[1.2,0,0]),W1_a3(W1_a3(a,[-6,0,0]),[0,0,-1.2]),W1_a3(W1_a3(a,[-12,0,0]),[0,0,-5])],'#ffffff',.6);
  B.cap(W1_a3(a,[-.5,0,0]),W1_a3(W1_a3(a,[-11,0,0]),[0,0,-4.4]),.6,'#7a8088',{w1:.2,d:-.05});
  for(let i=0;i<4;i++)B.cap(pt(-1+i*1.4),pt(-.4+i*1.4),2,i%2?'#1a1010':'#3a2a22',{d:-.08});B.ball(pt(15),1.6,'#e6dfcc',{d:-.06});B.ball(W1_a3(pt(15),p.dS,.2),.45,'#102018',{flat:1,glow:'120,255,180',d:-.08});
  B.cap(pt(-14),pt(-12.5),1.6,'#8a8a90',{d:-.05});
  // 영혼 불꽃
  for(let i=0;i<3;i++){const a2=t/700+i*2.1;B.glow([Math.cos(a2)*12,Math.sin(a2)*8,J.H+8+Math.sin(a2*2)*4],1.6,'120,255,180',.6);}
  for(const g of[-1,1])B.ball(P(.36*g,.8,.08),r*.1,'#d0ffe8',{flat:1,d:-.08});}}]);

// ======================= 106 불타는 전사 =======================
Q.push(['불타는 전사',{helm:'#2e140c',shield:'#3a1a0c',wcol:'#e87030',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s;
  W1_skel(B,K,J,W,{bone:'#d8ceb8',crack:1});
  // 그을린 판금(어깨·허리)·투구
  for(const g of[-1,1])W1_pauldron(B,K,J,g,'#3a2418',{rivet:'#ff9040',spikes:1,spikeC:'#2a1810'});
  B.poly([[-6*J.bw,6*J.bw,J.H+2],[6*J.bw,6*J.bw,J.H+2],[5*J.bw,6.6*J.bw,J.H-6],[-5*J.bw,6.6*J.bw,J.H-6]],'#2a160c',{grad:1,d:-.3});
  W1_helm(B,K,J,W,'#3a1c10',{rivet:'#ff9040'});
  W1_sword(B,K,W,s,{guard:'#5a3018',gem:'#ff6020',pommel:'#7a4020'});const pt=W.wp;for(let i=0;i<3;i++)W1_flame(B,pt(6+i*6),1.5,i*1.7,{noGlow:i%2});
  W1_shield(B,K,J,{boss:'#8a4020',rivet:'#ff9040',mark:'#ff7020'});
  W1_burnSkel(B,K,J,W);}}]);

// ======================= 109 피닉스 =======================
Q.push(['피닉스',{skin:'#f07018',wings:'#f04008',tailc:'#ffc838',
 detail(B,K){const s=B.s,G=W1_bird(B),{h,wing,peck,hd,tail}=G,t=B.t,f=B.f,mode=B.mode;
  // 날개 깃(뒷전 겹깃 + 끝 노랑)
  for(const g of[-1,1]){const r0=[g*5,2,h+8],e=[g*(12+wing*.4),-2,h+12+wing],tp=[g*(14+wing*.4),-8,h+6+wing*.6],bk=[g*6,-6,h+4];
    B.cap(r0,e,1.6,'#c82808',{w1:1,d:.25});
    for(let i=0;i<6;i++){const q=W1_mid(W1_mid(e,tp,i/5*.9),W1_mid(r0,bk,i/5),i/5*.6),dir=[g*(.4-i*.05),-1,-.5-i*.1];B.cap(q,W1_a3(q,dir,4.5+(5-i)*.6),2.4,i<2?'#ffd040':i<4?'#ff8a20':'#e84010',{w1:.7,d:.27});}
    for(let i=0;i<3;i++){const q=W1_mid(r0,e,.3+i*.25);B.ball(q,1.3,'#ff9a30',{sy:.6,d:.22});}}
  // 가슴 비늘깃·몸 불꽃
  for(let row=0;row<3;row++)for(let i=0;i<3;i++)B.ball([(i-1)*2.4+(row%2)*1.2-.6,5.6-row*.3,h+8-row*2.2],1.7,row%2?'#ffb040':'#ff8020',{flat:1,sy:.45,alpha:.75,d:-.15});
  W1_flame(B,[0,-2,h+9],3,0);W1_flame(B,[-3,-4,h+6],2.2,1.4);W1_flame(B,[3,-4,h+6],2.2,2.7);
  // 긴 꼬리 깃(세 가닥 + 눈무늬 끝)
  const e=tail[tail.length-1];for(const g of[-1,0,1]){const sw=Math.sin(t/260+g*1.7+f)*1.5,m=W1_a3(e,[g*3+sw,-5,-1]),q=W1_a3(e,[g*5.5+sw*1.6,-10,-1.5+Math.abs(g)]);B.poly([e,W1_a3(m,[1.8,0,.7]),W1_a3(q,[.8,-1.5,0]),W1_a3(q,[-.8,-1.5,0]),W1_a3(m,[-1.8,0,.7])],g?'#ff9a20':'#ffc838',{grad:1,d:.05});B.cap(e,q,.4,'#c83010',{d:.04});B.ball(W1_a3(q,[0,-.4,.1]),1.1,'#d02010',{flat:1,sy:.6,d:.03});B.ball(W1_a3(q,[0,-.4,.15]),.5,'#ffe890',{flat:1,d:.02});}
  // 머리: 볏 깃 다발·갈고리 부리·눈 테
  for(let i=0;i<4;i++){const a=W1_a3(hd,[0,-.5,2.4]),sw=Math.sin(t/200+i+f)*.6;B.cap(a,W1_a3(a,[(i-1.5)*.9+sw,-3-i*.6,3.2-i*.4]),.8,i%2?'#ffe060':'#ff9a20',{w1:.15,d:-.02});B.ball(W1_a3(a,[(i-1.5)*.9+sw,-3-i*.6,3.2-i*.4]),.5,'#ff5010',{d:-.03});}
  B.cap(W1_a3(hd,[0,2.2,.3]),W1_a3(hd,[0,4.2,-.5-peck]),1.6,'#e8b030',{w1:.6,d:-.08});B.cap(W1_a3(hd,[0,4.2,-.5-peck]),W1_a3(hd,[0,4.6,-1.8-peck]),.6,'#a06010',{w1:.15,d:-.09});
  for(const g of[-1,1])B.ball(W1_a3(hd,[g*1.9,1.3,.8]),.95,'#c02808',{flat:1,d:-.04});
  // 불씨
  for(let i=0;i<6;i++){const ph=((t/1100)+i/6)%1;B.glow([Math.sin(i*2.1)*9,-4+Math.cos(i*1.3)*6,h+2+ph*22],1.1,'255,170,60',(1-ph)*.8);}
  if(mode==='skill'&&f>=1)for(let i=0;i<3;i++)W1_flame(B,W1_a3(hd,[0,6+i*3,-2-i]),1.6+i*.5,i,{d:-.3});}}]);

// ======================= 112 불타는 궁수 =======================
Q.push(['불타는 궁수',{helm:'#2e140c',cape:'#4a1606',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,bw=J.bw,sh=J.sh,H=J.H,t=B.t,f=B.f;
  W1_skel(B,K,J,W,{bone:'#d8ceb8'});
  // 찢긴 망토 끝 불씨·가죽 흉갑끈·두건
  const cp=J.p.cape;for(let i=0;i<5;i++){const x=(i-2)*4*bw;B.cap([x,-5-cp*.9,6],[x+Math.sin(t/200+i+f),-5.5-cp,1.5+(i%2)*2],1.6,'#2a0c04',{w1:.3,d:.02});B.glow([x,-5.5-cp,2+(i%2)*2],1,'255,120,30',.5);}
  W1_strap(B,[-8*bw,4.5*bw,sh-1],[6*bw,5.5*bw,H+2],'#3a2010',1.5,'#ff9040');
  W1_helm(B,K,J,W,'#3a1c10',{rivet:'#ff9040'});
  for(const g of[-1,1])W1_bracer(B,K,W,g,'#3a2010',{band:'#1a0c06'});
  W1_bow(B,K,J,{wood:'#3a1a0a',grip:'#1a0a04',tip:'#ff9040'});W1_quiver(B,K,J,{col:'#2a1408',fl:'#ff8030'});
  if((B.mode==='attack'||B.mode==='skill')&&f<2){const a=J.p.hR,b=W1_a3(J.p.hL,[0,1,0],1);B.cap(a,W1_a3(b,[0,3,0]),.5,'#4a2a14',{d:-.2});W1_flame(B,W1_a3(b,[0,3,0]),1.3,0,{d:-.3});}
  W1_burnSkel(B,K,J,W);}}]);
// ======================= 115 발라카스 =======================
Q.push(['발라카스',{skin:'#6e1810',chest:'#d07a28',wings:'#4a0806',spines:'#ffa030',
 detail(B,K){const s=B.s,G=W1_quad(B),{h,L,bw,ny,R0,hd,r,fwd,tip,jaw,headUp}=G,sk=s.skin,t=B.t,f=B.f;
  W1_qWing(B,G,'#2a0604','#8a2010');
  // 등 비늘·용암 틈
  for(let i=0;i<7;i++){const y=-L*.48+i*L*.15+ny*.7;for(const g of[-1,0,1])B.ball([g*R0*.55,y+(g?1:0),h+R0*(g?.78:1)],R0*.3,i%2?K.tone(sk,.12):K.tone(sk,-.25),{flat:1,sy:.6,d:-.25});
    for(const g of[-1,1])B.line([[g*R0*.95,y,h+R0*.3],[g*R0*.85,y+1.2,h],[g*R0*.95,y+2,h-R0*.3]],'#ffb040',.5);}
  for(let i=0;i<5;i++)B.cap([-R0*.55,-L*.3+i*L*.17+ny*.7,h-R0*.55],[R0*.55,-L*.3+i*L*.17+ny*.7,h-R0*.55],1.2,i%2?'#e8a040':'#c86a20',{d:-.15});
  B.glow([0,L*.3+ny,h],3.5,'255,120,30',.35);
  // 목 가시·비늘 띠
  const nk=[0,L*.5+ny+2,h+3+headUp*3];for(let i=0;i<4;i++){const q=W1_mid(nk,hd,i/4);B.cap(W1_a3(q,[0,-.5,2.4]),W1_a3(q,[0,-2,4.6]),1.3,'#2a0a06',{w1:.15,d:-.05});B.cap([-2.2*bw,q[1]+.5,q[2]-1],[2.2*bw,q[1]+.5,q[2]-1],1,'#e8a040',{d:-.12});}
  // 머리: 큰 뿔 마디·볼 가시·이빨·눈두덩·콧김
  for(const g of[-1,1]){W1_hornRings(B,W1_a3(hd,[g*r*.4,-r*.3,r*.6]),W1_a3(hd,[g*r*.9,-r*1.6,r*1.4]),r*.34,'#4a3020',2);
    const hb=W1_a3(hd,[g*r*.9,-r*1.6,r*1.4]);B.cap(hb,W1_a3(hb,[g*r*.3,-r*.9,-r*.1]),r*.18,'#2a1a10',{w1:r*.03,d:-.03});
    for(let i=0;i<3;i++)B.cap(W1_a3(hd,[g*r*.8,-r*(.2+i*.3),-r*(.1+i*.1)]),W1_a3(hd,[g*r*(1.4+i*.1),-r*(.6+i*.35),-r*.3]),r*.14,'#2a0a06',{w1:r*.02,d:-.04});
    B.cap(W1_a3(W1_a3(hd,fwd,r*.45),[g*r*.7,0,r*.55]),W1_a3(W1_a3(hd,fwd,r*.85),[g*r*.25,0,r*.62]),r*.22,'#2a0806',{d:-.1});
    for(let i=0;i<3;i++)B.cap(W1_a3(W1_a3(hd,fwd,r*(1+i*.45)),[g*r*.42,0,-r*.42]),W1_a3(W1_a3(hd,fwd,r*(1+i*.45)),[g*r*.42,0,-r*.82]),r*.11,'#f8f0d8',{w1:r*.02,d:-.1});
    B.glow(W1_a3(tip,[g*r*.2,r*.1,r*.1]),1.2,'255,140,40',.5);}
  for(let i=0;i<3;i++)B.cap(W1_a3(hd,[0,r*(.3-i*.5),r*.85]),W1_a3(hd,[0,-r*(.1+i*.5),r*1.4]),r*.18,'#ffa030',{w1:r*.03,d:-.06});
  // 꼬리 가시·끝 창날
  const tp=W1_tailQ(B,G),e=tp[tp.length-1];for(let i=1;i<tp.length;i++)B.cap(W1_a3(tp[i],[0,0,1]),W1_a3(tp[i],[0,-1.2,2.8]),1.1,'#2a0a06',{w1:.15,d:-.05});
  B.poly([W1_a3(e,[0,1,.5]),W1_a3(e,[-2.6,-2,0]),W1_a3(e,[0,-4.5,0]),W1_a3(e,[2.6,-2,0])],'#3a0e08',{grad:1,d:-.04});
  for(const lg of G.legs)for(let i=-1;i<=1;i++)B.cap(W1_a3(lg.ft,[i*.9,.9,.2]),W1_a3(lg.ft,[i*1.3,2.3,-.1]),.6,'#1a0a06',{w1:.12,d:-.1});
  for(let i=0;i<5;i++){const ph=((t/1200)+i/5)%1;B.glow([Math.cos(i*1.7)*12,Math.sin(i*2.3)*8,6+ph*30],1.2,'255,140,40',(1-ph)*.7);}
  if(B.mode==='skill'&&f>=1)B.glow(tip,3+f,'255,120,30',.7);}}]);

// ======================= 118 좀비 엘모어 마법사 =======================
Q.push(['좀비 엘모어 마법사',{skin:'#7e8e6c',cloth:'#30304c',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,t=B.t,f=B.f;
  W1_robe(B,K,J,W,{trim:'#8a8a40',robe:s.cloth,mantle:'#26263e',rune:'#90ff90',rg:'120,255,120',sash:'#3a2a1a',band:'#1a1a2a'});
  // 해진 두건(머리 뒤·옆)
  B.ball(P(0,-.2,.25),r*1.1,'#3a3a58',{sy:.9,d:.06});B.cap(P(0,-.6,1),P(0,-1.1,-.6),r*.25,'#2a2a44',{d:.05});for(const g of[-1,1])B.poly([P(1.02*g,.5,.85),P(1.18*g,.1,1.05),P(1.2*g,-.2,-.9),P(.92*g,.45,-.95)],'#2e2e48',{grad:1,d:-.12});
  B.poly([P(-1,.35,1),P(1,.35,1),P(0,-.6,1.7)],'#2e2e48',{grad:1,d:-.08});
  // 썩은 얼굴: 퀭한 눈·드러난 이·꿰맨 자국
  for(const g of[-1,1])B.ball(P(.36*g,.82,.15),r*.26,'#1a2014',{flat:1,d:-.04});for(let i=-2;i<=2;i++)B.cap(P(i*.12,.9,-.42),P(i*.12,.92,-.62),r*.08,'#d8d0a8',{w1:r*.05,d:-.11});
  B.line([P(-.5,.85,.5),P(-.3,.9,.1),P(-.45,.85,-.2)],'#2a1a14',.5);for(let i=0;i<3;i++)B.line([P(-.48+i*.03,.86,.35-i*.25),P(-.3+i*.03,.9,.35-i*.25)],'#2a1a14',.35);
  // 찢긴 밑단 넝마
  for(let i=0;i<6;i++){const x=(i-2.5)*3.4*bw;B.poly([[x-1.4,4.6,2.2],[x+1.4,4.6,2.2],[x+.3+Math.sin(t/300+i)*.4,5,-.2-(i%2)]],'#22223a',{d:-.17});}
  // 뼈 드러난 손·팔 붕대
  for(const g of[-1,1]){const h=W.h(g),el=W.el(g);for(let i=-1;i<=1;i++)B.cap(h,W1_a3(h,[i*.8,1.6,-1.2]),.5,'#d8d0b8',{w1:.25,d:-.12});for(let i=0;i<3;i++)B.cap(W1_a3(W1_mid(el,h,.3+i*.2),[-2.2,0,0]),W1_a3(W1_mid(el,h,.35+i*.2),[2.2,0,0]),.6,'#b8b098',{d:-.1,alpha:.8});}
  // 지팡이: 뒤틀린 나무·초록 영혼석
  W1_staff(B,K,W,s,{metal:'#5a5a38'});B.ball(W.wp(16),2.4,'#90ff90',{glow:'120,255,120',d:-.15});
  for(let i=0;i<3;i++){const a=t/320+i*2.1+f*.7;B.ball(W1_a3(W.wp(16.5),[Math.cos(a)*3.6,Math.sin(a)*3.6,Math.sin(a*2)*1.2]),.5,'#b0ffb0',{glow:'120,255,120',d:-.3});}
  // 허리 해골 부적·책
  B.ball([-4*bw,6.4*bw,H+.5],1.3,'#d8d0bc',{d:-.45});B.ball([-4*bw,7*bw,H+.6],.4,'#102010',{flat:1,glow:'120,255,120',d:-.5});
  B.poly([[3*bw,6.2*bw,H+2],[6*bw,5.6*bw,H+2],[6*bw,5.6*bw,H-2.5],[3*bw,6.2*bw,H-2.5]],'#4a2a18',{grad:1,d:-.45});B.cap([3*bw,6.3*bw,H-.2],[6*bw,5.7*bw,H-.2],.4,'#c0a040',{d:-.47});
  for(let i=0;i<3;i++){const ph=((t/1300)+i/3)%1;B.glow([Math.sin(i*2)*6,Math.cos(i*1.4)*4,4+ph*30],1.1,'120,255,120',(1-ph)*.6);}}}]);

// ======================= 121 아이언 골렘 =======================
Q.push(['아이언 골렘',{skin:'#565a62',armor:'#565a62',pants:'#464a52',pads:'#686c76',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,t=B.t,f=B.f,met='#6a6e78';
  // 가슴판·이음선·리벳·용광로 창살
  B.poly([[-8*bw,7.2*bw,sh-1],[8*bw,7.2*bw,sh-1],[7*bw,7.6*bw,sh-9],[0,8*bw,sh-11],[-7*bw,7.6*bw,sh-9]],'#70747e',{grad:1,d:-.3});
  W1_rivets(B,[[-7*bw,7.8*bw,sh-1.6],[7*bw,7.8*bw,sh-1.6],[-6.4*bw,8*bw,sh-8.5],[6.4*bw,8*bw,sh-8.5],[0,8.3*bw,sh-10.4]],'#a0a4ac',.6);
  B.ball([0,8*bw,sh-5.5],3,'#1a1010',{flat:1,sx:1.2,sy:.9,d:-.36});B.ball([0,8*bw,sh-5.5],2.2,'#ff7020',{flat:1,glow:'255,110,30',sx:1.2,sy:.85,d:-.37});
  for(let i=-1;i<=1;i++)B.cap([i*1.3,8.3*bw,sh-3.4],[i*1.3,8.3*bw,sh-7.6],.5,'#2a2a2e',{d:-.4});
  for(let i=0;i<3;i++)B.cap([-6.5*bw,7.2*bw,H+1+i*2.2],[6.5*bw,7.2*bw,H+1+i*2.2],.6,'#3a3e46',{d:-.31});
  // 등 굴뚝·증기
  for(const g of[-1,1]){const a=[g*3.5*bw,-7.5*bw,sh-2];B.cap(a,W1_a3(a,[0,-.5,6]),2.4,'#3e424a',{w1:2.2,d:.02});B.cap(W1_a3(a,[0,-.5,5.2]),W1_a3(a,[0,-.5,6.4]),2.8,'#7a7e88',{d:.01});
    const ph=((t/900)+(g>0?.5:0))%1;B.glow(W1_a3(a,[0,-.5,7+ph*6]),1.4+ph*1.5,'200,200,210',(1-ph)*.4);}
  // 어깨·팔·다리 판금
  for(const g of[-1,1]){W1_pauldron(B,K,J,g,met,{r:5,rivet:'#a8acb4'});W1_bracer(B,K,W,g,'#5e626c',{w:6.6,band:'#2e3238',stud:'#a8acb4'});W1_greave(B,K,W,g,'#5e626c',{w:7,strap:'#2e3238'});
    const h=W.h(g);for(let i=-1;i<=1;i++)B.ball(W1_a3(h,[i*1.4,1.8,.8]),1.2,'#7a7e88',{d:-.15});}
  // 머리: 투구형 이마·눈 틈·턱 볼트
  B.ball(P(0,0,.4),r*1.08,'#62666e',{sy:.75,d:-.03});B.cap(P(-.7,.82,.15),P(.7,.82,.15),r*.26,'#120c0a',{d:-.08});for(const g of[-1,1])B.ball(P(.32*g,.9,.15),r*.16,'#ff7030',{flat:1,glow:'255,100,40',d:-.1});
  B.cap(P(0,.9,.9),P(0,.7,-.3),r*.14,'#80848e',{d:-.05});W1_rivets(B,[P(-.8,.55,-.3),P(.8,.55,-.3),P(-.85,.3,.6),P(.85,.3,.6)],'#a8acb4',r*.1);
  if(B.mode==='skill'||B.mode==='attack')B.glow([0,9,sh-5.5],3+f,'255,120,40',.5);}}]);

// ======================= 124 얼음 여왕 =======================
Q.push(['얼음 여왕',{skin:'#d4eaf8',hair:'#eaf8ff',cloth:'#94c8ec',cape:'#709ed4',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,t=B.t,f=B.f;
  W1_robe(B,K,J,W,{trim:'#e8f8ff',robe:s.cloth,mantle:'#b0dcf6',rune:'#c0f4ff',rg:'150,230,255',sash:'#5a88c0',band:'#4a78b0'});
  // 높은 얼음 깃(목 뒤 부채꼴)
  for(let i=0;i<7;i++){const a=(i/6-.5)*2.4;W1_crystal(B,K,[Math.sin(a)*4.5*bw,-2.5-Math.cos(a)*1.5,sh+.5],W1_n(Math.sin(a)*.8,-.4,1),5+(3-Math.abs(i-3))*1.2,1.8,i%2?'#c8ecff':'#eaf8ff',{d:.08});}
  // 어깨 수정·가슴 보석
  for(const g of[-1,1]){W1_crystal(B,K,[9*g*bw,0,sh],W1_n(.6*g,0,1),4,1.8,'#d8f4ff',{d:-.3});W1_crystal(B,K,[10*g*bw,-1,sh-1],W1_n(1*g,-.2,.4),3,1.4,'#b8e0f8',{d:-.3});}
  B.ball([0,6.6*bw,sh-2.5],1.4,'#80e0ff',{glow:'150,230,255',d:-.45});B.cap([-4*bw,6.2*bw,sh-1],[4*bw,6.2*bw,sh-1],.7,'#e8f8ff',{d:-.42});
  // 얼음 왕관(긴 수정)·흘러내린 머리칼
  for(let i=-2;i<=2;i++)W1_crystal(B,K,P(i*.32,.1,.85),W1_n(i*.25,-.1,1),r*(1.4-Math.abs(i)*.35),r*.3,i?'#d8f4ff':'#ffffff',{d:-.07});B.ball(P(0,.55,1.05),r*.14,'#60c8ff',{glow:'120,220,255',d:-.09});
  for(let i=0;i<5;i++){const x=(i-2)*.4,sw=Math.sin(t/400+i+f)*.15;B.cap(P(x,-.6,.2),P(x*1.3+sw,-1.1,-2.4-(i%2)*.5),r*.32,i%2?'#eaf8ff':'#d0e8f8',{w1:r*.12,d:.04});}
  for(const g of[-1,1])B.cap(P(.85*g,.1,.2),P(.95*g,.35,-1.6),r*.25,'#eaf8ff',{w1:r*.1,d:-.04});
  for(const g of[-1,1])B.cap(P(.5*g,.78,.38),P(.15*g,.86,.32),r*.07,'#6080a0',{d:-.1});B.ball(P(0,.9,-.4),r*.1,'#7a90c8',{flat:1,sx:1.6,d:-.1});
  // 지팡이: 눈꽃 수정 머리
  W1_staff(B,K,W,s,{metal:'#c8e4f4'});const o=W.wp(16);for(let i=0;i<6;i++){const a=i/6*Math.PI*2+t/900;W1_crystal(B,K,o,W1_n(Math.cos(a),0,Math.sin(a)),3.4,1,'#e8f8ff',{d:-.18});}B.ball(o,1.8,'#c0f4ff',{glow:'150,230,255',d:-.2});
  // 눈송이
  for(let i=0;i<6;i++){const ph=((t/1600)+i/6)%1;B.glow([Math.cos(i*1.9)*11,Math.sin(i*2.6)*7,40-ph*36],1,'230,248,255',(1-ph)*.8);}}}]);

// ======================= 127 도펠겡어 보스 =======================
Q.push(['도펠겡어 보스',{cloth:'#24083e',pants:'#160830',armor:'#2a1a40',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,t=B.t,f=B.f;
  // 흑자색 판금·룬 균열(빛남)
  W1_scales(B,K,J,'#3a2458',{rows:4});
  for(const g of[-1,1]){W1_pauldron(B,K,J,g,'#2e2040',{spikes:2,spikeC:'#8a60c0',rivet:'#c080ff'});W1_bracer(B,K,W,g,'#2e2040',{band:'#100818',stud:'#c080ff'});W1_greave(B,K,W,g,'#2e2040',{strap:'#100818'});}
  B.line([[-5*bw,7*bw,sh-2],[-2*bw,7.4*bw,sh-5],[1*bw,7.4*bw,sh-4],[3*bw,7.2*bw,sh-8],[5*bw,6.8*bw,H+3]],'#d0a0ff',.55);B.glow([0,7.4*bw,sh-5],3,'200,120,255',.4);
  W1_buckle(B,J,'#8a60c0');W1_loin(B,K,J,'#1a0a2a',{back:1,len:9});
  // 얼굴: 일그러진 가면 같은 얼굴·빛나는 금·뒤틀린 뿔
  B.ball(P(0,.55,-.1),r*.75,'#5a3a7a',{sy:.6,d:-.03});B.line([P(-.3,.95,.6),P(-.1,.98,.2),P(-.25,.96,-.2),P(0,.98,-.5)],'#e0c0ff',.5);
  B.cap(P(-.3,.95,-.45),P(.3,.95,-.45),r*.12,'#1a0a2a',{d:-.1});B.glow(P(0,1,-.45),r*.5,'200,120,255',.35);
  for(const g of[-1,1]){const a=P(.6*g,-.1,.7),b=P(1.1*g,-.6,1.4),c=P(1.3*g,-1.3,1.2);B.cap(a,b,r*.3,'#1a0a2a',{w1:r*.18,d:-.02});B.cap(b,c,r*.18,'#1a0a2a',{w1:r*.04,d:-.02});}
  // 검: 보라 날·가드·빛 흐름
  W1_sword(B,K,W,s,{guard:'#6a40a0',gem:'#e0a0ff',pommel:'#6a40a0'});for(let i=0;i<3;i++)B.glow(W.wp(7+i*6),1.6,'200,120,255',.45);
  // 그림자 잔상
  for(let i=0;i<4;i++){const ph=((t/1000)+i/4)%1;B.ball([Math.sin(i*2.2)*9,-4-ph*4,8+i*7],2.4*(1-ph),'#2a0a40',{alpha:.35*(1-ph),d:.3});}}}]);

// ======================= 130 산적 두목 =======================
Q.push(['산적 두목',{armor:'#4e3e2e',pants:'#32241a',cape:'#5e1414',pads:'#5e4e3e',wcol:'#9aa0a8',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh;
  // 가죽 갑옷: 박음질 판·가슴띠·허리 주머니
  for(let i=0;i<3;i++)B.cap([-6*bw,6.8*bw,sh-3-i*3.4],[6*bw,6.8*bw,sh-3-i*3.4],2.2,i%2?'#5a4632':'#4a3828',{d:-.3});
  W1_harness(B,K,J,'#2a1a0e',{stud:'#b0a080',cross:1});W1_buckle(B,J,'#b09040');
  for(const g of[-1,1]){B.poly([[g*4*bw,6.4*bw,H+1],[g*7*bw,5.4*bw,H+1],[g*6.6*bw,5.6*bw,H-3],[g*4.2*bw,6.5*bw,H-3]],'#3a2a1a',{grad:1,d:-.42});}
  // 털 망토 깃·어깨(한쪽 철판)
  for(let i=0;i<7;i++){const a=(i/6-.5)*2.6;B.ball([Math.sin(a)*8*bw,-1.5+Math.cos(a)*3,sh+.6],2.3*bw,i%2?'#6a5a48':'#58483a',{d:-.05});}
  W1_pauldron(B,K,J,1,'#7a7e86',{spikes:2,rivet:'#c8c0a0'});W1_pauldron(B,K,J,-1,'#5a4632',{rivet:'#b0a080'});
  for(const g of[-1,1]){W1_bracer(B,K,W,g,'#3a2a1a',{band:'#1a120a',stud:'#b0a080'});W1_greave(B,K,W,g,'#4a3828',{strap:'#1a120a'});}
  // 얼굴: 두건·안대·흉터·두꺼운 수염·귀걸이
  B.ball(P(0,-.05,.42),r*1.04,'#6a1a1a',{sy:.62,d:-.04});B.cap(P(0,-.9,.5),P(.3,-1.6,-.2),r*.25,'#6a1a1a',{w1:r*.12,d:.03});
  B.cap(P(-.95,.5,.45),P(.6,.95,.05),r*.07,'#1a1410',{d:-.09});B.ball(P(-.36,.9,.1),r*.2,'#1a1410',{flat:1,d:-.09});
  B.line([P(.2,.95,.55),P(.45,.88,.1),P(.38,.9,-.15)],'#7a3a2a',.5);
  B.poly([P(-.75,.75,-.1),P(.75,.75,-.1),P(.5,.8,-1.2),P(0,.85,-1.6),P(-.5,.8,-1.2)],'#241810',{grad:1,d:-.2});B.cap(P(-.5,.98,-.25),P(.5,.98,-.25),r*.18,'#2a1a10',{d:-.22});
  B.ball(P(.95,0,.0),r*.13,'#e0c050',{d:-.06});
  W1_axe(B,K,W,s);}}]);

// ---------- (3차) 공통 헬퍼 ----------
// 색 밝기 조절(결과를 #hex로 돌려줌 — 렌더러 그라데이션이 다시 tone 해도 깨지지 않게)
function W1_tone(h,a){h=String(h);let c;if(h.startsWith('rgb')){c=h.replace(/[^0-9,]/g,'').split(',').map(Number);}else{h=h.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h,16);c=[n>>16&255,n>>8&255,n&255];}
  return'#'+c.map(v=>Math.max(0,Math.min(255,Math.round(a>0?v+(255-v)*a:v*(1+a)))).toString(16).padStart(2,'0')).join('');}
// quad 목 시작점
function W1_qNeck(G){return[0,G.L*.5+G.ny+2,G.h+3+G.headUp*3];}
// quad 여러 머리(plan과 같은 식)
function W1_qHeads(B,G){const s=B.s,n=s.heads||1,out=[];const front1=G.L*.5+G.ny+1;for(let hi=0;hi<n;hi++){const off=n>1?(hi-(n-1)/2)*5*G.bw:0,a2=n>1?(hi-(n-1)/2)*.35:0;
  const neck=[off*.5,G.L*.5+G.ny+2,G.h+3+G.headUp*3],hd=[off,G.L*.5+G.ny+4+(s.neckL||2)-G.headUp*2,G.h+5+G.headUp*7+(s.headZ||0)],r=(s.headR||4.3)*G.bw,fwd=W1_n(Math.sin(a2),Math.cos(a2)*(1-G.headUp*.3),G.headUp*.6),sn=s.snout??1.6;
  out.push({neck,hd,r,fwd,a2,side:W1_n(Math.cos(a2),-Math.sin(a2),0),tip:W1_a3(W1_a3(hd,fwd,r*(1+sn)),[0,0,-r*.25])});}return out;}
// blob 상태 재계산
function W1_blob(B){const s=B.s,{mode,f,t}=B,run=mode==='run',walk=mode==='walk'||run,r=s.r||9;const ph=f*Math.PI/2;let hop=walk?Math.abs(Math.sin(ph))*(run?5:3):0,sq=walk?1+.12*Math.cos(ph*2):1,lunge=0,pulse=0;
  if(mode==='attack'){lunge=[-2,5,1][f];sq=[1.15,.85,1][f];}if(mode==='buff'){pulse=[.05,.12,.12,.06][f];}if(mode==='skill'){sq=[1.2,1.05,.9,1][f];lunge=[0,0,2,0][f];}
  const fl=s.float?6+Math.sin(t/500+f)*1.5:0;return{r,z0:fl+hop,sq,lunge,pulse,walk,run,ph};}
// 다리 발굽/발톱
function W1_qClaws(B,G,col,n=3){for(const lg of G.legs)for(let i=0;i<n;i++){const x=(i-(n-1)/2);B.cap(W1_a3(lg.ft,[x*.9,.9,.2]),W1_a3(lg.ft,[x*1.3,2.3,-.1]),.6,col,{w1:.12,d:-.1});}}
// 용 머리 공통(뿔 마디·눈두덩·이빨·볼가시)
function W1_dragonHead(B,K,H,o){const{hd,r,fwd,tip}=H,side=H.side||[1,0,0];const sx=g=>W1_a3([0,0,0],side,g);
  for(const g of[-1,1]){const hs=W1_a3(W1_a3(hd,sx(g*r*.45),1),[0,-r*.3,r*.6]),he=W1_a3(W1_a3(hd,sx(g*r*.95),1),[0,-r*1.7,r*1.3]);if(o.horn){B.cap(hs,he,r*.34,o.horn,{w1:r*.07,d:-.06});W1_hornRings(B,hs,he,r*.36,W1_tone(o.horn,-.35),3);}
    B.cap(W1_a3(W1_a3(hd,fwd,r*.45),sx(g*r*.68)).map((v,i)=>v+[0,0,r*.55][i]),W1_a3(W1_a3(hd,fwd,r*.9),sx(g*r*.22)).map((v,i)=>v+[0,0,r*.6][i]),r*.22,o.brow||'#1a1a14',{d:-.1});
    for(let i=0;i<3;i++){const q=W1_a3(W1_a3(hd,fwd,r*(1+i*.4)),sx(g*r*.4));B.cap(W1_a3(q,[0,0,-r*.42]),W1_a3(q,[0,0,-r*.82]),r*.1,'#f6eed6',{w1:r*.02,d:-.1});}
    for(let i=0;i<2;i++)B.cap(W1_a3(W1_a3(hd,sx(g*r*.8)),[0,-r*(.2+i*.35),-r*.1]),W1_a3(W1_a3(hd,sx(g*r*(1.45+i*.1))),[0,-r*(.6+i*.35),-r*.3]),r*.14,o.frill||'#2a2a20',{w1:r*.02,d:-.04});}
  B.ball(tip,r*.18,'#141010',{d:-.1});}

// ======================= 133 유니콘 =======================
Q.push(['유니콘',{skin:'#eef0f6',paw:'#d8b860',mane:null,
 detail(B,K){const s=B.s,G=W1_quad(B),{h,L,bw,ny,R0,hd,r,fwd,tip,headUp}=G,t=B.t,f=B.f,sk=s.skin;
  // 몸 근육 음영·배 그늘
  B.ball([0,ny*.7,h-R0*.55],R0*.8,W1_tone(sk,-.18),{sx:1.1,sy:.6,d:-.05,alpha:.6});
  // 갈기(목 따라 흐르는 결)
  const nk=W1_qNeck(G),ws=Math.sin(t/260+f)*.8;for(let i=0;i<7;i++){const q=W1_mid(nk,hd,i/7),c=i%2?'#c8daf8':'#e8f0ff';B.cap(W1_a3(q,[0,-.6,r*.75]),W1_a3(q,[-1.6-ws,-2.2,r*.1-1]),r*.42,c,{w1:r*.1,d:-.04});B.cap(W1_a3(q,[0,-.4,r*.7]),W1_a3(q,[1.6+ws,-2,r*.1-1]),r*.36,W1_tone(c,-.08),{w1:r*.08,d:-.03});}
  B.cap(W1_a3(hd,[0,-r*.2,r*.8]),W1_a3(W1_a3(hd,fwd,r*.9),[ws*.3,0,r*.3]),r*.32,'#e0ecff',{w1:r*.08,d:-.09});
  // 뿔: 나선 고리·빛
  const ha=W1_a3(W1_a3(hd,fwd,r*.5),[0,0,r*.7]),hb=W1_a3(W1_a3(hd,fwd,r*1.3),[0,0,r*2.4]);for(let i=1;i<6;i++){const q=W1_mid(ha,hb,i/6);B.cap(W1_a3(q,[-r*.18*(1-i/7),0,-r*.06]),W1_a3(q,[r*.18*(1-i/7),0,r*.06]),r*.08,'#fff4c0',{d:-.12});}
  B.glow(hb,2+(B.mode==='skill'?f*1.2:0),'255,240,190',.55);
  // 얼굴: 눈두덩·속눈썹·콧구멍·고삐 없는 금 이마 장식
  for(const g of[-1,1]){const e=W1_a3(W1_a3(hd,fwd,r*.62),[g*r*.52,0,r*.28]);B.cap(W1_a3(e,[g*r*.05,-r*.1,r*.2]),W1_a3(e,[-g*r*.1,r*.12,r*.22]),r*.1,'#b8c0d0',{d:-.08});B.ball(W1_a3(e,[0,r*.05,0]),r*.08,'#ffffff',{flat:1,d:-.09});
    B.ball(W1_a3(tip,[g*r*.3,r*.05,r*.05]),r*.1,'#6a6a78',{flat:1,d:-.1});}
  B.ball(W1_a3(W1_a3(hd,fwd,r*.75),[0,0,r*.62]),r*.18,'#e0c060',{d:-.11});B.ball(tip,r*.3,'#d8d8e4',{d:-.07});
  // 다리: 발목 깃털털·금 발굽
  for(const lg of G.legs){const a=W1_mid(lg.kn,lg.ft,.6);for(const g of[-1,0,1])B.cap(W1_a3(a,[g*.7,0,0]),W1_a3(lg.ft,[g*1.1,-.6,.3]),1,'#dce6ff',{w1:.2,d:-.05});B.ball(lg.ft,1.8*bw,'#d8b860',{sy:.55,d:-.08});B.cap(W1_a3(lg.ft,[-1.3,.5,.3]),W1_a3(lg.ft,[1.3,.5,.3]),.4,'#fff0b0',{d:-.1});}
  // 꼬리: 긴 비단 결
  const tp=W1_tailQ(B,G);for(let i=0;i<tp.length-1;i++)for(const g of[-1,1])B.cap(tp[i],W1_a3(tp[i+1],[g*1.1,-.5,-.8-i*.4]),1.6-i*.2,g>0?'#c8daf8':'#e8f0ff',{w1:.4,d:-.02});
  // 성스러운 빛 입자
  for(let i=0;i<4;i++){const ph=((t/1500)+i/4)%1;B.glow([Math.cos(i*1.9)*11,Math.sin(i*2.5)*8,4+ph*28],1.1,'220,235,255',(1-ph)*.6);}
  if(B.mode==='skill'&&f>=2)B.spark(W1_a3(hb,fwd,3),5,'230,240,255',.8);}}]);

// ======================= 136 댄싱 소드 =======================
Q.push(['댄싱 소드',{blade:'#d4dde8',guard:'#b89238',
 detail(B,K){const s=B.s,G=W1_blob(B),{r,z0,lunge}=G,{mode,f,t}=B;
  const sp=mode==='attack'?[-.6,1.2,.4][f]:mode==='skill'?[0,2,4,6][f]:mode==='buff'?f*1.5:Math.sin(t/400)*.15,c0=[0,lunge,z0+r*1.4],d=[Math.sin(sp)*.9,Math.sin(sp)*.3+(mode==='attack'?.5:0),Math.cos(sp)];
  const tip=W1_a3(c0,d,r*1.6),gd=W1_a3(c0,d,-r*.25),hilt=W1_a3(c0,d,-r*.5);let w=W1_cross(d,[0,1,0]);if(Math.hypot(...w)<.2)w=W1_cross(d,[1,0,0]);w=W1_n(...w);
  // 넓은 양날(그림자면·밝은면)·혈조·날 하이라이트
  const b0=W1_a3(gd,d,r*.1),bw0=r*.2;B.poly([W1_a3(b0,w,bw0),W1_a3(W1_a3(c0,d,r*1.2),w,bw0*.75),tip,W1_a3(W1_a3(c0,d,r*1.2),w,-bw0*.75),W1_a3(b0,w,-bw0)],'#b8c4d4',{grad:1,edge:'#f4f8ff',ew:.35,d:-.05});
  B.cap(W1_a3(b0,d,r*.1),W1_a3(c0,d,r*1.05),r*.05,'#7a8698',{d:-.08});B.line([W1_a3(b0,w,bw0*.9),W1_a3(W1_a3(c0,d,r*1.2),w,bw0*.7),tip],'#ffffff',.35);
  // 룬 문양(빛남)
  for(let i=0;i<3;i++){const q=W1_a3(W1_a3(c0,d,r*(.2+i*.32)),w,bw0*.45);B.ball(q,r*.05,'#9fd0ff',{flat:1,glow:'160,210,255',d:-.1});}
  // 장식 가드: 굽은 날개 끝·중앙 보석
  for(const g of[-1,1]){const a=W1_a3(gd,w,g*r*.45),c=W1_a3(W1_a3(gd,w,g*r*.7),d,r*.25);B.cap(a,c,r*.12,'#c8a040',{w1:r*.05,d:-.1});B.ball(c,r*.08,'#f0d070',{d:-.12});}
  B.ball(W1_a3(gd,d,r*.04),r*.16,'#9a2030',{glow:'255,80,100',d:-.14});
  // 손잡이 감기·폼멜
  for(let i=0;i<3;i++){const q=W1_mid(gd,hilt,(i+.5)/3.2);B.cap(W1_a3(q,w,-r*.13),W1_a3(q,w,r*.13),r*.07,i%2?'#2a1a10':'#5a3a22',{d:-.11});}
  B.ball(W1_a3(hilt,d,-r*.08),r*.17,'#c8a040',{d:-.1});
  // 유령 잔상·떠다니는 기운
  for(let i=1;i<=2;i++){const sp2=sp-i*.35,d2=[Math.sin(sp2)*.9,Math.sin(sp2)*.3,Math.cos(sp2)];B.cap(W1_a3(c0,d2,-r*.2),W1_a3(c0,d2,r*1.5),r*.22,'#a8c8ff',{w1:r*.04,alpha:.18/i,d:.2});}
  for(let i=0;i<4;i++){const ph=((t/1100)+i/4)%1;B.glow(W1_a3(c0,[Math.cos(i*1.6)*r*.6,Math.sin(i*2.2)*r*.4,-r*.8+ph*r*2.4]),r*.12,'170,210,255',(1-ph)*.7);}
  B.glow([0,lunge,z0-4],r*.45,'150,190,255',.25);}}]);

// ======================= 139 린드비오르 =======================
Q.push(['린드비오르',{wings:'#2a6a52',
 detail(B,K){const s=B.s,G=W1_quad(B),{h,L,bw,ny,R0,hd,r,fwd,tip,headUp}=G,sk=s.skin,t=B.t,f=B.f;
  W1_qWing(B,G,'#1e4a3a','#5ab090');
  // 등 비늘판(엇갈림)·배 판
  for(let i=0;i<7;i++){const y=-L*.48+i*L*.15+ny*.7;for(const g of[-1,0,1])B.ball([g*R0*.55,y+(g?1:0),h+R0*(g?.78:1)],R0*.28,i%2?W1_tone(sk,.15):W1_tone(sk,-.22),{flat:1,sy:.6,d:-.25});}
  for(let i=0;i<6;i++)B.cap([-R0*.55,-L*.35+i*L*.15+ny*.7,h-R0*.55],[R0*.55,-L*.35+i*L*.15+ny*.7,h-R0*.55],1.2,i%2?'#c8ecd4':'#90c4a4',{d:-.15});
  // 등 지느러미 가시(크게)
  for(let i=0;i<5;i++){const y=-L*.4+i*L*.2+ny*.7;B.poly([[0,y+1.5,h+R0*.95],[0,y-1,h+R0*1.7+1.5],[0,y-2.5,h+R0*.95]],'#a8e8c8',{grad:1,alpha:.85,d:-.27});}
  // 목 비늘 띠
  const nk=W1_qNeck(G);for(let i=0;i<4;i++){const q=W1_mid(nk,hd,i/4);B.cap([-2.2*bw,q[1]+.5,q[2]-1],[2.2*bw,q[1]+.5,q[2]-1],1,'#b8e4c8',{d:-.12});B.cap(W1_a3(q,[0,-.3,2.2]),W1_a3(q,[0,-1.8,4.2]),1.1,'#d0f8e0',{w1:.15,d:-.05});}
  W1_dragonHead(B,K,{hd,r,fwd,tip},{horn:'#e8f4ec',brow:'#1a3a2a',frill:'#a8e8c8'});
  // 꼬리 끝 지느러미
  const tp=W1_tailQ(B,G),e=tp[tp.length-1];for(let i=1;i<tp.length;i++)B.cap(W1_a3(tp[i],[0,0,.8]),W1_a3(tp[i],[0,-1.2,2.4]),1,'#a8e8c8',{w1:.15,d:-.05});
  B.poly([W1_a3(e,[0,1,0]),W1_a3(e,[-3,-3,1.5]),W1_a3(e,[0,-5,0]),W1_a3(e,[3,-3,1.5])],'#5ab090',{grad:1,alpha:.85,d:-.04});
  W1_qClaws(B,G,'#e0f0e0');
  // 바람 소용돌이
  for(let i=0;i<6;i++){const a=t/500+i*1.05,ph=((t/1300)+i/6)%1;B.glow([Math.cos(a)*15,Math.sin(a)*11,3+ph*26],1.3,'180,255,210',(1-ph)*.55);}
  if(B.mode==='skill'&&f>=1)B.glow(tip,3+f,'170,255,210',.7);}}]);

// ======================= 142 변종 라미아 =======================
Q.push(['변종 라미아',{wcol:'#c8b0e0',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,t=B.t,f=B.f,mode=B.mode,tc=s.tailc,gd='#d8b860';
  // 뱀 꼬리: 배 비늘 띠·등 무늬·지느러미 가시
  const w=Math.sin(t/300+f*1.4)*(mode==='walk'||mode==='run'?2.5:1);const pts=[[0,0,H],[0,2,H*.5],[w,1,4],[-w+3,-6,2.5],[w,-12,2.2],[-4-w,-16,2.6],[-7,-12+w,3.4]];
  for(let i=0;i<pts.length-1;i++){const ww=(11-i*1.4)*bw;for(let j=0;j<3;j++){const q=W1_mid(pts[i],pts[i+1],(j+.5)/3);
    if(i<2)B.cap(W1_a3(q,[-ww*.32,ww*.38,0]),W1_a3(q,[ww*.32,ww*.38,0]),.9,j%2?'#d8c8e0':'#b8a0c8',{d:-.05});
    B.ball(W1_a3(q,[0,0,ww*.4]),ww*.18,j%2?'#3a1a4a':'#8a4a9a',{flat:1,sy:.55,d:(i>1?.6:0)-.1});
    if(i>=2)B.cap(W1_a3(q,[0,0,ww*.42]),W1_a3(q,[0,-.8,ww*.42+1.6]),.7,'#e0a0f0',{w1:.1,d:(i>1?.6:0)-.12});}}
  B.cap(pts[6],W1_a3(pts[6],[-2.2,1.5,.6]),1.6,'#4a1a5a',{w1:.2,d:.5});
  // 비늘 허리띠·흉갑(금테 판)·목걸이 보석
  B.cap([-7*bw,5.2*bw,H+1.5],[7*bw,5.2*bw,H+1.5],2.6,'#2a1236',{d:-.3});W1_rivets(B,[[-4*bw,6.4*bw,H+1.5],[0,6.6*bw,H+1.5],[4*bw,6.4*bw,H+1.5]],gd,.6);
  for(const g of[-1,1])B.ball([g*3.2*bw,5.8*bw,sh-4],3*bw,'#5a2a6a',{sy:.6,sx:1.1,d:-.32});B.line([[-6*bw,5.4*bw,sh-4],[-3*bw,6.6*bw,sh-6.4],[0,6.4*bw,sh-4.5],[3*bw,6.6*bw,sh-6.4],[6*bw,5.4*bw,sh-4]],gd,.6);
  B.line([[-4.5*bw,4.8*bw,sh+.8],[0,6*bw,sh-1.8],[4.5*bw,4.8*bw,sh+.8]],gd,.5);B.ball([0,6.2*bw,sh-2.1],.9,'#ff60ff',{glow:'255,90,255',d:-.46});
  for(let i=0;i<3;i++){const z=sh-7-i*2.2;B.cap([-4*bw,6*bw,z],[4*bw,6*bw,z],1,i%2?'#a890b8':'#c0a8d0',{d:-.29});}
  // 어깨 비늘판·팔찌
  W1_pauldron(B,K,J,1,'#4a2a5a',{rivet:gd,r:3.6});W1_pauldron(B,K,J,-1,'#4a2a5a',{rivet:gd,r:3.6});for(const g of[-1,1])W1_bracer(B,K,W,g,'#3a1a4a',{band:gd,w:3.8});
  // 머리: 뱀 머리칼(뒤로)·티아라·눈매
  for(let i=0;i<6;i++){const a=(i/5-.5)*2.4,sw=Math.sin(t/260+i+f)*.25;const p0=P(Math.sin(a)*.7,-.4,.4),p1=P(Math.sin(a)*1.1+sw,-1.2,-.4),p2=P(Math.sin(a)*1.3-sw,-1.5,-1.4);B.cap(p0,p1,r*.24,i%2?'#5a2a6a':'#6a3a7a',{w1:r*.18,d:.05});B.cap(p1,p2,r*.18,'#5a2a6a',{w1:r*.06,d:.06});B.ball(p2,r*.14,'#7a4a8a',{d:.06});}
  for(let i=-2;i<=2;i++)B.cap(P(i*.25,.55,.8),P(i*.27,.5,1.1+(i%2?0:.25)),r*.12,gd,{w1:r*.04,d:-.1});B.ball(P(0,.82,.75),r*.14,'#ff60ff',{glow:'255,90,255',d:-.12});
  for(const g of[-1,1])B.cap(P(.2*g,.9,.35),P(.55*g,.78,.45),r*.08,'#1a0820',{d:-.1});B.cap(P(-.15,.95,-.45),P(.15,.95,-.45),r*.09,'#6a1a5a',{d:-.1});
  W1_spear(B,K,W,s,{tassel:'#8a3aa0',socket:'#6a5040'});
  // 독기
  for(let i=0;i<4;i++){const ph=((t/1200)+i/4)%1;B.glow([Math.cos(i*1.7+t/900)*9,Math.sin(i*2.3)*6-4,4+ph*30],1.4,'240,120,255',(1-ph)*.6);}}}]);

// ======================= 145 공포의 켈베로스 =======================
Q.push(['공포의 켈베로스',{
 detail(B,K){const s=B.s,G=W1_quad(B),{h,L,bw,ny,R0,jaw}=G,sk=s.skin,t=B.t,f=B.f;
  W1_qFur(B,G,['#2a1410','#140808'],{n:6});
  // 몸 용암 균열
  for(let i=0;i<5;i++){const y=-L*.42+i*L*.2+ny*.7;for(const g of[-1,1])B.line([[g*R0*.95,y,h+R0*.5],[g*R0*.9,y+1.3,h+R0*.1],[g*R0*1,y+.6,h-R0*.3]],'#ff5010',.55);}
  B.glow([0,ny*.6,h],R0*.9,'255,60,20',.25);
  // 등 가시
  for(let i=0;i<5;i++){const y=-L*.38+i*L*.18+ny*.7;B.cap([0,y,h+R0*.95],[0,y-1.5,h+R0*1.5+1.5],1.4,'#3a2020',{w1:.15,d:-.28});}
  // 세 머리: 가시 목걸이·불꽃 갈기·뿔·송곳니·불타는 눈
  for(const H of W1_qHeads(B,G)){const{hd,r,fwd,tip,neck,side}=H;
    const cm=W1_mid(neck,hd,.45);B.cap(W1_a3(cm,side,-r*.95),W1_a3(cm,side,r*.95),r*.4,'#2a2228',{d:-.15});for(let i=0;i<5;i++){const a=(i/4-.5)*2.6;const q=W1_a3(W1_a3(cm,side,Math.sin(a)*r*.9),[0,Math.cos(a)*r*.2,r*.3]);B.cap(q,W1_a3(q,[Math.sin(a)*.8,0,1.6]),.8,'#b8b0a8',{w1:.1,d:-.2});}
    W1_flame(B,W1_a3(W1_mid(neck,hd,.6),[0,-r*.5,r*.6]),r*.55,H.a2*5,{d:-.05});
    for(const g of[-1,1]){const hs=W1_a3(W1_a3(hd,side,g*r*.4),[0,-r*.2,r*.6]),he=W1_a3(W1_a3(hd,side,g*r*1),[0,-r*1.2,r*1.6]);B.cap(hs,he,r*.3,'#4a2a28',{w1:r*.06,d:-.06});W1_hornRings(B,hs,he,r*.32,'#1a0a0a',2);
      const e=W1_a3(W1_a3(W1_a3(hd,fwd,r*.62),side,g*r*.52),[0,0,r*.28]);B.cap(W1_a3(e,side,g*r*.2),W1_a3(W1_a3(e,side,-g*r*.15),[0,0,r*.05]),r*.14,'#0a0404',{d:-.08});B.glow(e,1.3,'255,80,20',.6);
      const q=W1_a3(W1_a3(hd,fwd,r*1.4),side,g*r*.35);B.cap(W1_a3(q,[0,0,-r*.4]),W1_a3(q,[0,0,-r*(.95+jaw*.3)]),r*.13,'#f4ecd6',{w1:r*.03,d:-.1});}
    B.ball(tip,r*.26,'#0a0606',{d:-.07});if(jaw>.3){B.ball(W1_a3(tip,[0,-r*.3,-r*.55]),r*.32,'#ff6020',{flat:1,sy:.6,glow:'255,90,20',d:-.09});}}
  // 꼬리 끝 불꽃·발톱
  const tp=W1_tailQ(B,G);W1_flame(B,tp[tp.length-1],2.4,1.3,{d:-.03});W1_qClaws(B,G,'#d8d0c0');
  for(let i=0;i<5;i++){const ph=((t/1100)+i/5)%1;B.glow([Math.cos(i*1.7)*12,Math.sin(i*2.3)*8,4+ph*30],1.2,'255,90,30',(1-ph)*.7);}}}]);

// ======================= 148 난폭한 스파토이 =======================
Q.push(['난폭한 스파토이',{armW:3.6,legW:4,
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,t=B.t,br='#a07a38';
  W1_skel(B,K,J,W,{crack:1});
  // 청동 흉갑(가슴 근육판)·가죽 띠 치마(프테루게스)
  B.poly([[-6*bw,4.4,sh-.5],[6*bw,4.4,sh-.5],[5*bw,5,sh-7],[0,5.4,sh-8.5],[-5*bw,5,sh-7]],br,{grad:1,edge:'#e0c070',ew:.5,d:-.3});
  for(const g of[-1,1])B.ball([g*2.6*bw,5.2,sh-3],2.4*bw,W1_tone(br,.15),{sy:.5,d:-.33});W1_rivets(B,[[-4.5,5.3,sh-1],[4.5,5.3,sh-1]],'#e8d090',.45);
  for(let i=0;i<6;i++){const x=(i-2.5)*2*bw,sw=(J.p.sw||0)*.8;B.cap([x,4.6,H+2],[x*1.15,5+sw,H-5],1.6,i%2?'#6a2010':'#8a3018',{w1:1.4,d:-.32});}
  // 투구 청동 볼가리개·붉은 깃
  B.ball(P(0,-.02,.34),r*1.06,br,{sy:.75,d:-.04});for(const g of[-1,1])B.poly([P(.72*g,.6,.15),P(.98*g,.15,.1),P(.85*g,.25,-.8),P(.55*g,.68,-.6)],W1_tone(br,-.12),{grad:1,d:-.1});
  B.cap(P(0,.95,.5),P(0,1.1,-.2),r*.14,W1_tone(br,.2),{w1:r*.08,d:-.14});const sw=Math.sin(t/300+B.f)*.12;for(let i=0;i<5;i++)B.cap(P(0,.7-i*.45,1.05+Math.sin(i/4*Math.PI)*.4),P(0,.5-i*.45,1.6+Math.sin(i/4*Math.PI)*.5+sw),r*.32,i%2?'#ff4010':'#c02008',{w1:r*.16,d:-.06});
  for(let i=0;i<3;i++)B.cap(P(0,-1.3,1.2-i*.2),P(0,-1.8-i*.2,.2-i*.3+sw),r*.25,'#c02008',{w1:r*.08,d:.03});
  // 청동 정강이·팔뚝
  for(const g of[-1,1]){W1_greave(B,K,W,g,br,{w:4.2,knee:'#c09048'});W1_bracer(B,K,W,g,br,{w:3.6,band:'#5a3a18'});}
  W1_shield(B,K,J,{boss:'#d0a850',rivet:'#e8d090',mark:'#7a1a08',bar:null});W1_spear(B,K,W,s,{tassel:'#c02008',socket:'#8a6a30'});
  // 분노 불길
  for(let i=0;i<3;i++)W1_flame(B,[Math.sin(i*2.1)*5,-2+Math.cos(i*1.3)*2,sh-3+i*3],1.6,i*1.7,{d:.1,noGlow:1});B.glow(P(0,.8,.1),r*.8,'255,60,30',.35);}}]);

// ======================= 151 난폭한 해골저격병 =======================
Q.push(['난폭한 해골저격병',{armW:3.4,legW:3.8,cape:'#2a2a30',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,t=B.t;
  W1_skel(B,K,J,W,{crack:1});
  // 너덜한 두건 망토(머리 위)·가죽 어깨덮개
  B.ball(P(0,-.15,.3),r*1.12,'#33333a',{sy:.82,d:.02});B.poly([P(-.9,.6,.5),P(-1,-.2,.9),P(0,-.5,1.3),P(1,-.2,.9),P(.9,.6,.5),P(0,.85,1)],'#3a3a42',{grad:1,d:-.05});
  for(let i=0;i<5;i++){const x=(i-2)*3.6*bw,cp=J.p.cape||1.5;B.poly([[x-1.6,-5.2,sh-1],[x+1.6,-5.2,sh-1],[x*1.2+.8,-6-cp,6+(i%2)*3],[x*1.2-.3,-6.5-cp,3+(i%3)*2]],i%2?'#2a2a30':'#22222a',{grad:1,d:.08});}
  W1_pauldron(B,K,J,-1,'#4a3a2c',{rivet:'#a09070',r:3.4});
  B.poly([[-5*bw,4.2,sh-1],[5*bw,4.2,sh-1],[4*bw,4.6,sh-6],[-4*bw,4.6,sh-6]],'#3e2e22',{grad:1,edge:'#1a120a',ew:.5,d:-.3});W1_harness(B,K,J,'#2a1a10',{stud:'#a09070'});
  W1_loin(B,K,J,'#2e2e34',{len:7,back:1});for(const g of[-1,1])W1_bracer(B,K,W,g,'#3a2a1e',{w:3.4,band:'#1a120a'});
  W1_bow(B,K,J,{wood:'#3a2418',grip:'#1a1010',tip:'#c0b8a0'});W1_quiver(B,K,J,{col:'#2e2018',fl:'#c02010'});
  // 붉은 눈빛 꼬리·분노 기운
  for(const g of[-1,1])B.glow(P(.36*g,.85,.08),r*.35,'255,60,30',.6);
  for(let i=0;i<4;i++){const ph=((t/1000)+i/4)%1;B.glow([Math.sin(i*2.1)*7,Math.cos(i*1.3)*4,H-4+ph*30],1.2,'255,70,30',(1-ph)*.7);}
  if((B.mode==='attack'||B.mode==='skill')&&B.f<2)B.glow(J.p.hR,1.6,'255,90,40',.6);}}]);

// ======================= 154 제니스 퀸 =======================
Q.push(['제니스 퀸',{
 detail(B,K){const s=B.s,G=W1_bug(B),{bw,h,sp,hp,hr,snap,lunge}=G,t=B.t,f=B.f,sk=s.skin,gd='#e0b040';
  const ab=sp[0];
  // 배: 마디 띠·금 모래시계 무늬·광택·털
  for(let i=0;i<5;i++)B.ball(W1_a3(ab.p,[0,-ab.r*.75+i*ab.r*.38,ab.r*.5-Math.abs(i-2)*ab.r*.12]),ab.r*.88,i%2?W1_tone(sk,-.35):W1_tone(sk,.15),{flat:1,sy:.16,d:-.12,alpha:.7});
  B.poly([W1_a3(ab.p,[-ab.r*.35,ab.r*.3,ab.r*.78]),W1_a3(ab.p,[ab.r*.35,ab.r*.3,ab.r*.78]),W1_a3(ab.p,[0,-ab.r*.05,ab.r*.8]),W1_a3(ab.p,[ab.r*.35,-ab.r*.45,ab.r*.7]),W1_a3(ab.p,[-ab.r*.35,-ab.r*.45,ab.r*.7]),W1_a3(ab.p,[0,-ab.r*.05,ab.r*.8])],gd,{d:-.16,alpha:.9});
  for(const g of[-1,1])for(let i=0;i<3;i++)B.ball(W1_a3(ab.p,[g*ab.r*.62,-ab.r*.4+i*ab.r*.4,ab.r*.4]),ab.r*.09,'#ffd860',{flat:1,glow:'255,210,80',d:-.15});
  B.ball(W1_a3(ab.p,[-ab.r*.3,ab.r*.2,ab.r*.6]),ab.r*.25,'#ffffff',{flat:1,alpha:.18,d:-.17});
  // 가슴·머리: 왕관 가시·협각 송곳니·눈 광택
  const th=sp[1];for(let i=-2;i<=2;i++)B.cap(W1_a3(hp,[i*hr*.3,-hr*.1,hr*.75]),W1_a3(hp,[i*hr*.38,-hr*.35,hr*(1.4+(i%2?0:.35))]),hr*.16,gd,{w1:hr*.04,d:-.12});
  B.ball(W1_a3(hp,[0,hr*.2,hr*.95]),hr*.15,'#ff60ff',{glow:'230,150,255',d:-.14});
  for(const g of[-1,1]){const a=W1_a3(hp,[g*hr*.35,hr*.8,-hr*.2]),b=W1_a3(hp,[g*hr*(.45-snap*.25),hr*1.35,-hr*.85]);B.cap(a,b,hr*.3,W1_tone(sk,-.2),{w1:hr*.16,d:-.12});B.cap(b,W1_a3(b,[-g*hr*.2,hr*.15,-hr*.45]),hr*.12,'#f0e8d0',{w1:hr*.02,d:-.14});
    B.cap(W1_a3(hp,[g*hr*.85,hr*.4,0]),W1_a3(hp,[g*hr*1.4,hr*1.2,-.2]),hr*.18,W1_tone(sk,.1),{w1:hr*.08,d:-.1});}
  // 다리: 마디 혹·털·끝 갈고리·줄무늬
  for(const lg of G.legs){B.ball(lg.knee,1.1*bw,W1_tone(sk,.15),{d:-.06});for(const tt of[.3,.65])B.cap(W1_a3(W1_mid(lg.knee,lg.ft,tt),[-.6,0,0]),W1_a3(W1_mid(lg.knee,lg.ft,tt),[.6,0,0]),.9,gd,{d:-.07,alpha:.8});
    for(let i=1;i<3;i++){const q=W1_mid(lg.root,lg.knee,i/3);B.cap(q,W1_a3(q,[lg.sg*.4,-.3,1.2]),.4,W1_tone(sk,-.3),{w1:.1,d:-.05});}B.cap(lg.ft,W1_a3(lg.ft,[lg.sg*.5,.4,-.4]),.5,'#1a0a1a',{w1:.1,d:-.08});}
  // 날개 맥
  const fl=Math.sin(t/60+f*2)*.6;for(const g of[-1,1])for(const[dy,len]of[[1,1],[-2,.85]]){const r0=[g*2,dy,h+s.segs[1][2]+2],tp=[g*(s.wingL||12)*len,dy+3,h+5+fl*4];B.line([r0,W1_mid(r0,tp,.5),tp],'#f0e0ff',.45);B.line([W1_mid(r0,tp,.45),[g*(s.wingL||12)*len*1.05,dy-2,h+4+fl*3]],'#d8c0f0',.35);}
  // 독 방울·기운
  if(B.mode==='attack'||B.mode==='skill')B.glow(W1_a3(hp,[0,hr*1.4,-hr*.9]),1.6,'200,255,100',.7);
  for(let i=0;i<4;i++){const ph=((t/1300)+i/4)%1;B.glow([Math.cos(i*1.7)*12,Math.sin(i*2.3)*9,3+ph*22],1.1,'230,150,255',(1-ph)*.6);}}}]);

// ======================= 157 뱀파이어 =======================
Q.push(['뱀파이어',{hair:'#141014',
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,t=B.t,f=B.f,gd='#c8a848',cp=J.p.cape||1.5;
  // 망토: 안감 진홍·겉 검정·박쥐 날개 끝단·높은 깃
  B.poly([[-8.5*bw,-4.3,sh-1],[8.5*bw,-4.3,sh-1],[10.5*bw,-5.4-cp,4],[5*bw,-6-cp*1.1,6],[0,-7.3-cp*1.3,2],[-5*bw,-6-cp*1.1,6],[-10.5*bw,-5.4-cp,4]],'#140a10',{grad:1,d:.02});
  for(const g of[-1,1]){B.poly([[g*4*bw,-1.5,sh+.5],[g*8*bw,-2.5,sh+.5],[g*10*bw,-1.5,sh+6.5],[g*5*bw,-1,sh+5]],'#8a0a1e',{grad:1,d:.1});B.poly([[g*4*bw,-2,sh+.5],[g*8*bw,-3,sh+.5],[g*10*bw,-2.2,sh+6.5],[g*5*bw,-1.6,sh+5]],'#1a0a10',{grad:1,d:.12});}
  // 조끼·금 단추·연미 코트 앞자락
  B.poly([[-3.5*bw,6.2*bw,sh-1.5],[3.5*bw,6.2*bw,sh-1.5],[2.5*bw,6.6*bw,H+1],[-2.5*bw,6.6*bw,H+1]],'#4a0a1a',{grad:1,d:-.33});for(let i=0;i<4;i++)B.ball([0,6.8*bw,sh-4-i*2.6],.55,gd,{d:-.45});
  for(const g of[-1,1]){B.poly([[g*3.5*bw,6*bw,sh-1],[g*7*bw,5*bw,sh-1],[g*7.5*bw,4.8*bw,H-5],[g*3*bw,6*bw,H]],'#1c0c14',{grad:1,edge:gd,ew:.35,d:-.31});}
  // 크라바트·루비 브로치·견장
  B.poly([[-2*bw,6.4*bw,sh+.5],[2*bw,6.4*bw,sh+.5],[1.2*bw,7*bw,sh-4],[0,7.2*bw,sh-5],[-1.2*bw,7*bw,sh-4]],'#ece6e0',{grad:1,d:-.4});B.ball([0,7.3*bw,sh-1.2],1,'#c01030',{glow:'255,40,60',d:-.48});
  for(const g of[-1,1]){const c=[9.4*g*bw,.5,sh+.4];B.ball(c,2.6*bw,'#1a0c12',{sy:.7,d:-.3});for(let i=0;i<4;i++)B.cap(W1_a3(c,[(-1+i*.7)*g,1.5,-.5]),W1_a3(c,[(-1+i*.7)*g*1.2,1.7,-2.6]),.35,gd,{d:-.36});}
  // 소매 레이스·긴 손톱
  for(const g of[-1,1]){const h=W.h(g),el=W.el(g);B.cap(W1_mid(el,h,.7),W1_mid(el,h,.85),4.4*bw,'#e8e0da',{w1:5.2*bw,d:-.05});for(let i=-1;i<=1;i++)B.cap(W1_a3(h,W1_n(i*.4,.8,-.3),2.6),W1_a3(h,W1_n(i*.45,.8,-.45),4.6),.4,'#3a1018',{w1:.1,d:-.08});}
  // 얼굴: 창백 광대·과부봉 머리·뾰족귀·송곳니·붉은 눈빛
  B.ball(P(0,-.3,.42),r*1.0,'#141014',{sy:.7,d:-.03});B.poly([P(-.45,.7,.62),P(0,.9,.42),P(.45,.7,.62),P(0,.5,.95)],'#141014',{d:-.07});
  for(const g of[-1,1]){B.ball(P(.55*g,.68,-.15),r*.2,'#c4b8c8',{d:-.06});B.cap(P(.18*g,.9,.38),P(.55*g,.75,.5),r*.08,'#1a0a10',{d:-.1});B.cap(P(.14*g,.92,-.5),P(.13*g,.93,-.78),r*.07,'#ffffff',{w1:r*.02,d:-.12});B.glow(P(.36*g,.9,.1),r*.2,'255,40,60',.35);}
  B.cap(P(-.2,.94,-.46),P(.2,.94,-.46),r*.07,'#5a0a14',{d:-.11});
  // 박쥐 떼·피안개
  const bats=(B.mode==='skill'||B.mode==='buff')?5:2;for(let i=0;i<bats;i++){const a=t/350+i*1.3+f*.5,c=[Math.cos(a)*(10+i),Math.sin(a)*(8+i)-2,sh+4+Math.sin(a*2+i)*5],fl=Math.sin(t/60+i)*1.2;
    B.poly([c,W1_a3(c,[-2.4,0,fl+1]),W1_a3(c,[-1.2,0,.2]),W1_a3(c,[0,0,.6]),W1_a3(c,[1.2,0,.2]),W1_a3(c,[2.4,0,fl+1])],'#1a0a12',{d:-.6});B.ball(W1_a3(c,[0,0,.2]),.5,'#2a1018',{d:-.62});}
  for(let i=0;i<4;i++){const ph=((t/1500)+i/4)%1;B.glow([Math.cos(i*1.7)*8,Math.sin(i*2.3)*6,1+ph*10],2.2,'160,10,30',(1-ph)*.45);}}}]);

// ======================= 160 와일드 매직 =======================
Q.push(['와일드 매직',{
 detail(B,K){const s=B.s,G=W1_blob(B),{r,z0,lunge,pulse}=G,{mode,f,t}=B;const c=[0,lunge,z0+r*1.2],R0=r*(.8+pulse);
  // 결정 껍질 조각(회전)
  for(let i=0;i<6;i++){const a=t/700+i*1.047,u=[Math.cos(a),Math.sin(a)*.8,Math.sin(i*1.9)*.5];const b=W1_a3(c,u,R0*.75);B.cap(b,W1_a3(b,u,R0*.55),R0*.22,i%2?'#c090ff':'#7040c0',{w1:R0*.04,alpha:.85,d:-.05});}
  // 핵: 겹 빛
  B.ball(c,R0*.5,'#f8eeff',{alpha:.75,d:-.1});B.ball(W1_a3(c,[-R0*.3,R0*.2,R0*.35]),R0*.22,'#ffffff',{flat:1,alpha:.4,d:-.12});
  // 궤도 고리 2개(점열)·룬
  for(const[tilt,col,sp]of[[.5,'#ffd060',1],[-.6,'#60e0ff',-1.3]])for(let i=0;i<10;i++){const a=t/400*sp+i*.628;const p=W1_a3(c,[Math.cos(a)*r*1.6,Math.sin(a)*r*1.6*Math.cos(tilt),Math.sin(a)*r*1.6*Math.sin(tilt)]);B.ball(p,r*(i%3?.06:.11),col,{d:-.02});}
  // 혼돈 불꽃(색이 바뀜)
  const pal=['255,90,90','90,255,140','120,160,255','255,220,80'];for(let i=0;i<5;i++){const ph=((t/900)+i/5)%1;B.glow(W1_a3(c,[Math.cos(i*2.3)*r*(1+ph),Math.sin(i*1.7)*r*(1+ph),(ph-.3)*r*2]),r*.25*(1-ph)+.6,pal[(i+f)%4],(1-ph)*.45);}
  if(mode==='skill'||mode==='attack')for(let i=0;i<2;i++){const a=t/150+i*3;B.arc([c,W1_a3(c,[Math.cos(a)*r*1.4,Math.sin(a)*r*1.4,r]),W1_a3(c,[Math.cos(a+.8)*r*2.4,Math.sin(a+.8)*r*2.4,-r*.6])],pal[(i+f)%4],.7);}
  B.glow([0,lunge,0],r*.9,'200,130,255',.22);}}]);
// 리자드맨 공통 머리·비늘·꼬리 디테일
function W1_lizBase(B,K,J,W,s,o={}){const P=W.HP,r=J.hr,bw=J.bw,sh=J.sh,sk=s.skin;
  for(let i=0;i<5;i++)for(const g of[-1,1])B.cap(P(.3*g,.9+i*.25,-.48),P(.3*g,.9+i*.25,-.68),r*.08,'#f4ecd8',{w1:r*.02,d:-.12});
  for(const g of[-1,1]){B.cap(P(.32*g,.85,-.5),P(.28*g,2.05,-.55),r*.06,'#1a2014',{d:-.11});B.cap(P(.62*g,.62,.5),P(.2*g,.8,.42),r*.16,W1_tone(sk,-.4),{d:-.1});B.ball(P(.18*g,2.1,-.2),r*.06,'#101',{flat:1,d:-.13});}
  if(o.crest)B.poly([P(0,.5,.95),P(0,-.1,1.7),P(0,-1.2,1.35),P(0,-1.4,.5)],o.crest,{grad:1,alpha:.85,d:.02});
  if(!o.noBack)for(let rI=0;rI<4;rI++)for(let i=0;i<3;i++)B.ball([(i-1)*3*bw+(rI%2)*1.4,-7*bw,sh-2-rI*3],1.6*bw,(i+rI)%2?W1_tone(sk,-.2):W1_tone(sk,.05),{sy:.6,d:.02});
  for(const g of[-1,1]){const ft=W.ft(g);for(let i=-1;i<=1;i++)B.cap(W1_a3(ft,[i*1,2.6,1]),W1_a3(ft,[i*1.3,4.4,.1]),.6,'#e0d8b8',{w1:.1,d:-.14});}
  const tp=W1_tailPts(B);for(let i=0;i<2;i++)for(let j=1;j<3;j++){const q=W1_mid(tp[i],tp[i+1],j/3);B.cap(W1_a3(q,[0,0,1.2]),W1_a3(q,[0,-1,2.6]),.8,o.spine||W1_tone(sk,-.3),{w1:.1,d:-.03});}}

// ======================= 163 헤비 리자드맨 =======================
Q.push(['헤비 리자드맨',{
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,pl='#6a6e78',dk='#3a3c44';
  W1_lizBase(B,K,J,W,s,{crest:'#8a7030',spine:'#5a5e66',noBack:1});
  // 판금 흉갑(겹판)·리벳·허리 철판 치마
  B.poly([[-7*bw,6.2*bw,sh],[7*bw,6.2*bw,sh],[6*bw,6.8*bw,sh-8],[0,7.2*bw,sh-9],[-6*bw,6.8*bw,sh-8]],pl,{grad:1,edge:'#a8acb4',ew:.5,d:-.32});
  for(let i=0;i<3;i++)B.cap([-6*bw,7*bw,sh-9.5-i*2.4],[6*bw,7*bw,sh-9.5-i*2.4],2.2,i%2?'#5a5e66':'#74787f',{d:-.33});
  B.cap([0,7.3*bw,sh-.5],[0,7.4*bw,sh-8],.7,'#a8acb4',{d:-.35});W1_rivets(B,[[-5*bw,6.9*bw,sh-1],[5*bw,6.9*bw,sh-1],[-4.5*bw,7.2*bw,sh-6],[4.5*bw,7.2*bw,sh-6]],'#d0c8a8',.55);
  for(let i=0;i<5;i++){const x=(i-2)*2.6*bw,sw=(J.p.sw||0)*.6;B.poly([[x-1.3,6.2*bw,H+1],[x+1.3,6.2*bw,H+1],[x*1.1+1.2,6.6*bw+sw,H-6],[x*1.1-1.2,6.6*bw+sw,H-6]],i%2?pl:W1_tone(pl,-.15),{grad:1,edge:dk,ew:.3,d:-.36});}
  // 등판·가시 어깨·건틀릿·정강이
  B.poly([[-7*bw,-7.4*bw,sh],[7*bw,-7.4*bw,sh],[6*bw,-6.8*bw,H+2],[-6*bw,-6.8*bw,H+2]],W1_tone(pl,-.1),{grad:1,edge:'#a8acb4',ew:.5,d:-.1});for(let i=0;i<3;i++)B.cap([-6*bw,-7.6*bw,sh-2-i*3.5],[6*bw,-7.6*bw,sh-2-i*3.5],.8,'#4a4c54',{d:-.12});
  for(const g of[-1,1]){W1_pauldron(B,K,J,g,pl,{spikes:3,spikeC:'#c8c4b8',rivet:'#d0c8a8',r:4.6});W1_bracer(B,K,W,g,pl,{band:dk,stud:'#d0c8a8',w:5});W1_greave(B,K,W,g,pl,{strap:'#2a1a10',knee:'#8a8e98',w:5.4});}
  // 머리 철 굴레(이마띠)
  B.cap(P(-.95,.35,.45),P(.95,.35,.45),r*.18,dk,{d:-.08});B.cap(P(0,.9,.55),P(0,1.6,.1),r*.14,pl,{d:-.12});W1_rivets(B,[P(-.6,.75,.55),P(.6,.75,.55)],'#d0c8a8',r*.07);
  W1_club(B,K,W,s,{band:'#3a3c44',spikes:8,spikeC:'#d8d4c8'});W1_shield(B,K,J,{boss:'#a8acb4',rivet:'#d0c8a8',bar:'#3a3c44'});}}]);

// ======================= 166 리자드맨 마법사 =======================
Q.push(['리자드맨 마법사',{
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,t=B.t,f=B.f;
  W1_lizBase(B,K,J,W,s,{crest:'#2a8aa0',spine:'#2a5a6a',noBack:1});
  W1_robe(B,K,J,W,{trim:'#c0a040',robe:'#3a3a6a',mantle:'#2a2a50',sash:'#6a3020',rune:'#80e0ff',rg:'130,220,255'});
  // 뼈·깃털 장식 목걸이·이마 보석
  for(let i=0;i<7;i++){const a=(i/6-.5)*2.4;const q=[Math.sin(a)*5.5*bw,Math.cos(a)*5*bw+1,sh+.5-Math.cos(a)*1.5];B.cap(q,W1_a3(q,[0,.3,-1.8]),.6,i%2?'#e8e0c8':'#3aa0c0',{w1:.2,d:-.42});}
  B.ball(P(0,.8,.55),r*.14,'#80e0ff',{glow:'130,220,255',d:-.12});for(const g of[-1,1])B.line([P(.25*g,.85,.4),P(.6*g,.6,.6)],'#80e0ff',.4);
  // 지팡이: 뱀 똬리·수정
  W1_staff(B,K,W,s,{metal:'#a08a50'});const pt=W.wp;for(let i=0;i<5;i++){const a=i*1.6;B.ball(W1_a3(pt(2+i*2.4),[Math.cos(a)*1.1,Math.sin(a)*1.1,0]),.75,'#4a8a5a',{d:-.12});}
  B.cap(pt(14),pt(17.5),1.6,'#9fe8ff',{w1:.3,alpha:.9,d:-.14});B.glow(pt(16),2.4+(B.mode==='skill'?f:0),'130,220,255',.55);
  for(let i=0;i<3;i++){const a=t/300+i*2.1;B.glow(W1_a3(pt(16),[Math.cos(a)*3,Math.sin(a)*3,Math.sin(a*2)]),.8,'160,240,255',.8);}}}]);

// ======================= 169 라버본 =======================
Q.push(['라버본',{armW:4.4,legW:4.8,
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,t=B.t,f=B.f;
  W1_skel(B,K,J,W,{bone:'#d8cdb4',crack:1,jawDrop:1});
  // 그을린 뼈·용암 틈
  for(let i=0;i<4;i++)B.line([[-4+i*2.4,2.6,sh-2-i*2.8],[-3+i*2.4,3.2,sh-4-i*2.8]],'#ff8020',.45);
  // 거친 가죽 갑·쇠사슬·두개골 견갑
  B.poly([[-6*bw,4.2,sh-.5],[6*bw,4.2,sh-.5],[5*bw,4.8,sh-6],[-5*bw,4.8,sh-6]],'#3a2a24',{grad:1,edge:'#1a100c',ew:.5,d:-.3});W1_rivets(B,[[-4,5,sh-1.5],[0,5.1,sh-1.5],[4,5,sh-1.5]],'#8a7a6a',.5);
  W1_harness(B,K,J,'#2a1a14',{stud:'#8a7a6a',cross:1});
  for(const g of[-1,1]){W1_pauldron(B,K,J,g,'#4a3a30',{spikes:2,spikeC:'#d8cdb4',rivet:'#8a7a6a'});const c=[9.6*g*bw,1.5,sh+2.2];B.ball(c,1.8,'#d8cdb4',{d:-.4});for(const e of[-1,1])B.ball(W1_a3(c,[e*.6,1.4,.1]),.45,'#1a0a04',{flat:1,glow:'255,120,30',d:-.45});}
  W1_loin(B,K,J,'#3a2a24',{back:1,len:8});for(const g of[-1,1])W1_bracer(B,K,W,g,'#3a2a24',{band:'#1a100c',stud:'#8a7a6a',w:4});
  // 해골 불꽃·용암 몽둥이
  W1_burnSkel(B,K,J,W);W1_club(B,K,W,s,{band:'#2a2a2a',spikes:7,spikeC:'#3a3030'});const pt=W.wp;for(const k of[10,13,16])B.glow(pt(k),1.6,'255,120,30',.55);B.line([pt(8),pt(11),pt(15)],'#ff9030',.6);
  if(B.mode==='attack'&&f===1)for(let i=0;i<3;i++)B.glow(pt(17+i*2),2,'255,140,40',.7);}}]);

// ======================= 172 맘보토끼 =======================
Q.push(['맘보토끼',{
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,t=B.t,sk=s.skin;
  // 털 결(가슴·볼)·뭉툭 꼬리
  for(let i=0;i<5;i++)B.cap([(i-2)*1.8*bw,6*bw,sh-1],[(i-2)*2*bw,6.6*bw,sh-4.5],1.6,i%2?'#fff8f0':'#e0d4c8',{w1:.4,d:-.36});
  for(const g of[-1,1]){B.ball(P(.55*g,.6,-.3),r*.3,'#fffaf4',{d:-.05});for(let i=0;i<3;i++)B.line([P(.3*g,1.05,-.35),P((.9+i*.1)*g,1.05,-.25-i*.1)],'#5a4a40',.25);}
  B.ball([0,-6.5*bw,H+2],2.8,'#fffaf4',{d:.05});
  // 큰 앞니·코·귀 안 결
  B.cap(P(-.07,1,-.58),P(-.07,1,-.82),r*.12,'#fffff0',{d:-.09});B.cap(P(.07,1,-.58),P(.07,1,-.82),r*.12,'#fffff0',{d:-.09});
  // 조끼: 단추·주머니·패치·밧줄 허리띠
  for(const g of[-1,1])B.poly([[g*.6,6.2*bw,sh-1],[g*6.5*bw,5*bw,sh-1],[g*6.5*bw,5.2*bw,H+1],[g*1,6.4*bw,H+1]],'#d06a24',{grad:1,edge:'#5a2a10',ew:.4,d:-.33});
  for(let i=0;i<3;i++)B.ball([1.2,6.7*bw,sh-3-i*3],.55,'#f0e0a0',{d:-.44});B.poly([[-5*bw,5.8*bw,H+5],[-2.5*bw,6.2*bw,H+5],[-2.5*bw,6.3*bw,H+2.6],[-5*bw,5.9*bw,H+2.6]],'#8a4a20',{edge:'#3a1a08',ew:.3,d:-.4});
  B.cap([-7*bw,5.8*bw,H+1],[7*bw,5.8*bw,H+1],1.8,'#a08050',{d:-.38});for(let i=0;i<5;i++)B.line([[-6*bw+i*3*bw,6.6*bw,H+1.8],[-5*bw+i*3*bw,6.6*bw,H+.2]],'#6a5030',.3);
  // 큰 발·발가락 털
  for(const g of[-1,1]){const ft=W.ft(g);B.ball(W1_a3(ft,[0,2.8,1]),2.2,'#f4ece4',{sy:.6,sx:.9,d:-.1});for(let i=-1;i<=1;i++)B.ball(W1_a3(ft,[i*.8,4.4,.9]),.6,'#fffaf4',{d:-.12});W1_bracer(B,K,W,g,'#c05a20',{band:'#5a2a10',w:3.6});}
  // 당근 장식 몽둥이(나무 결·못)
  W1_club(B,K,W,s,{band:'#5a3a1a',spikes:5,spikeC:'#c8c0b0'});const pt=W.wp;B.line([pt(4),pt(9),pt(15)],'#5a3a1a',.4);
  // 경쾌한 음표 기운
  for(let i=0;i<3;i++){const ph=((t/1400)+i/3)%1;B.glow([Math.cos(i*2.1)*8,Math.sin(i*1.7)*5,sh+ph*12],.9,'255,210,130',(1-ph)*.6);}}}]);

// ======================= 175 키위 패롯 =======================
Q.push(['키위 패롯',{
 detail(B,K){const s=B.s,G=W1_bird(B),{h,wing,peck,hd,tail}=G,t=B.t,f=B.f,sk=s.skin,wc=s.wings;
  // 몸 깃털 비늘(겹)·가슴 노랑
  for(let rI=0;rI<4;rI++)for(let i=0;i<5;i++){const a=(i/4-.5)*2.4,z=h+9-rI*2.2;B.ball([Math.sin(a)*6*(1-rI*.08),Math.cos(a)*5.2+.4,z],1.5,(i+rI)%2?W1_tone(sk,.15):W1_tone(sk,-.12),{sy:.7,d:-.05});}
  B.ball([0,5.6,h+3.5],3,'#f0d040',{sy:.75,d:-.08});B.ball([0,5.8,h+3.4],1.8,'#ffe070',{flat:1,sy:.7,d:-.1});
  // 날개: 덮깃 줄·첫째날개깃(파랑→남색)·노랑 끝
  for(const g of[-1,1]){const a0=[g*5,2,h+8],a1=[g*(12+wing*.4),-2,h+12+wing],a2=[g*(14+wing*.4),-8,h+6+wing*.6],a3=[g*6,-6,h+4];
    B.line([W1_mid(a0,a1,.5),W1_mid(a1,a2,.4),W1_mid(a3,a2,.5)],'#80c0ff',.5);for(let i=0;i<5;i++){const q=W1_mid(a1,a2,i/4);B.cap(q,W1_a3(q,[g*1.5,-2.2,-1.2]),1.3,i%2?'#2050a0':'#3070c8',{w1:.4,d:.25});}
    B.cap(W1_mid(a0,a3,.3),W1_mid(a1,a2,.2),1.2,'#e04030',{w1:.6,d:.26});}
  // 긴 꼬리깃(빨강·파랑 교차)
  const e=tail[tail.length-1];for(const[g,c]of[[-1,'#e04030'],[0,'#3070c8'],[1,'#e04030']])B.cap(tail[2],W1_a3(e,[g*1.4,-4,-1.5]),1.4,c,{w1:.3,d:.05});
  // 머리: 볏 깃·흰 눈테·볼 반점·갈고리 부리
  for(let i=0;i<4;i++)B.cap(W1_a3(hd,[0,-.5+i*.4,2.6]),W1_a3(hd,[(i-1.5)*.4,-2.5+i*.2,4.8-i*.3]),.9,i%2?'#f0d030':'#ffa020',{w1:.15,d:-.06});
  for(const g of[-1,1]){B.ball(W1_a3(hd,[g*1.9,1.4,.8]),1.05,'#f8f8f0',{flat:1,d:-.04});B.ball(W1_a3(hd,[g*1.95,1.5,.8]),.45,'#141010',{flat:1,d:-.07});B.ball(W1_a3(hd,[g*2,2,-.6]),.9,'#40a0e0',{flat:1,d:-.04});}
  const bl=s.beakL||3.8,bt=W1_a3(hd,[0,bl+.5,-1.8-peck]);B.cap(W1_a3(hd,[0,2.2,.2]),W1_a3(hd,[0,bl,-.4-peck]),1.9,'#3a3430',{w1:1,d:-.08});B.cap(W1_a3(hd,[0,bl,-.4-peck]),bt,1,'#3a3430',{w1:.2,d:-.09});
  B.cap(W1_a3(hd,[0,2.1,-1]),W1_a3(hd,[0,bl-.6,-1.6-peck*1.3]),1.2,'#1a1614',{w1:.4,d:-.07});B.ball(W1_a3(hd,[0,2.6,.9]),.35,'#141010',{flat:1,d:-.1});
  // 발: 회색 비늘 발·발톱
  for(const g of[-1,1]){const ft=[g*3,(B.mode==='walk'||B.mode==='run'?Math.cos(f*Math.PI/2+(B.mode==='run'?Math.PI/4:0))*(g>0?-1:1)*5:0),0];for(let i=-1;i<=1;i++)B.cap(W1_a3(ft,[i*1.4,2.2,0]),W1_a3(ft,[i*1.6,2.9,-.3]),.5,'#2a2420',{w1:.1,d:-.1});}
  for(let i=0;i<3;i++){const ph=((t/1300)+i/3)%1;B.glow([Math.cos(i*2.1)*9,Math.sin(i*1.7)*6,h+ph*14],.9,'160,255,140',(1-ph)*.5);}}}]);

// ======================= 178 불의 대정령 =======================
Q.push(['불의 대정령',{
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,t=B.t,f=B.f;
  // 용암 근육·갈라진 틈·심장 핵
  W1_muscle(B,K,J,'#c84a14');for(let i=0;i<5;i++){const x=(i-2)*2.4*bw;B.line([[x,6.8*bw,sh-1],[x+1,7*bw,sh-5],[x-.5,7*bw,sh-9],[x+.6,6.8*bw,H+2]],'#ffe070',.5);}
  B.ball([0,7*bw,sh-5],2.2,'#fff4b0',{glow:'255,180,60',d:-.4});B.glow([0,7*bw,sh-5],5+Math.sin(t/200)*.8,'255,140,40',.5);
  // 어깨 용암석 갑·불꽃
  for(const g of[-1,1]){const c=[9.6*g*bw,.2,sh+.6];B.ball(c,4*bw,'#4a1a0a',{sy:.8,d:-.32});B.line([W1_a3(c,[-2*g,3,1]),W1_a3(c,[0,3.4,-1]),W1_a3(c,[2*g,3,.5])],'#ffb040',.5);W1_flame(B,W1_a3(c,[g*.5,0,2.5]),2.6,g*2,{d:-.36});
    const el=W.el(g),h=W.h(g);W1_flame(B,W1_mid(el,h,.4),1.6,g+3,{d:-.1,noGlow:1});B.cap(W1_mid(el,h,.55),W1_mid(el,h,.95),4.2*bw,'#3a1408',{w1:4.6*bw,d:-.05});B.line([W1_mid(el,h,.6),W1_mid(el,h,.9)],'#ffb040',.5);
    for(let i=-1;i<=1;i++)B.cap(W1_a3(h,W1_n(i*.4,.8,-.3),2.6),W1_a3(h,W1_n(i*.45,.8,-.4),4.8),.5,'#fff0a0',{w1:.1,d:-.1});}
  // 머리: 불꽃 왕관·뿔 마디·이글거리는 입
  for(let i=0;i<5;i++)W1_flame(B,P((i-2)*.35,-.2,.85-Math.abs(i-2)*.12),r*(.5-Math.abs(i-2)*.08),i*1.3,{d:-.03,noGlow:i%2});
  for(const g of[-1,1])W1_hornRings(B,P(.5*g,-.1,.8),P(1.3*g,-.6,1.5),r*.42,'#7a2a08',2);
  B.cap(P(-.35,.9,-.45),P(.35,.9,-.45),r*.16,'#fff0a0',{glow:'255,200,80',d:-.12});for(const g of[-1,1])B.cap(P(.15*g,.95,.35),P(.55*g,.8,.5),r*.1,'#2a0a04',{d:-.1});
  // 아래 몸: 불꽃 꼬리 혀
  const tl=[0,-3-(B.mode==='run'?6:B.mode==='walk'?3:0),2];for(let i=0;i<5;i++){const x=(i-2)*2.6*bw;W1_flame(B,[x,1+(i%2),H-8-Math.abs(i-2)*2],2.4-Math.abs(i-2)*.3,i*1.9,{d:-.02,noGlow:1});}W1_flame(B,tl,2.6,.7,{d:.02});
  // 떠도는 용암석·불티
  for(let i=0;i<3;i++){const a=t/600+i*2.1;const c=[Math.cos(a)*13,Math.sin(a)*9,sh-4+Math.sin(a*2)*4];B.ball(c,1.3,'#3a1408',{d:-.02});B.ball(W1_a3(c,[0,.3,.4]),.5,'#ffb040',{flat:1,glow:'255,140,40',d:-.04});}
  for(let i=0;i<6;i++){const ph=((t/900)+i/6)%1;B.glow([Math.sin(i*2.1)*9,Math.cos(i*1.3)*6,H-6+ph*40],1.1,'255,180,60',(1-ph)*.8);}}}]);

// 각진 바위 덩이(앞면·윗면 다각형), n: 바깥 방향
function W1_rock(B,K,c,sz,col,n,o={}){const up=[0,0,1];let u=W1_cross(up,n);if(Math.hypot(...u)<.1)u=[1,0,0];u=W1_n(...u);const v=W1_cross(n,u);const sd=o.seed||0,pts=[];
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2+sd,rr=sz*(.8+.25*Math.sin(i*2.7+sd*3));pts.push(W1_a3(W1_a3(c,u,Math.cos(a)*rr),v,Math.sin(a)*rr*.85));}
  B.poly(pts,W1_tone(col,.12),{grad:1,edge:W1_tone(col,-.4),ew:.4,d:o.d??-.3});B.poly([pts[0],pts[1],pts[2],W1_mid(c,pts[1],.35)],W1_tone(col,.3),{d:(o.d??-.3)-.01,alpha:.8});B.poly([pts[3],pts[4],W1_mid(c,pts[4],.3)],W1_tone(col,-.25),{d:(o.d??-.3)-.01,alpha:.7});
  if(o.crack)B.line([W1_mid(pts[0],c,.2),c,W1_mid(pts[3],c,.3)],o.crack,.4);}
// ======================= 181 땅의 대정령 =======================
Q.push(['땅의 대정령',{
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,t=B.t,f=B.f,rk='#9a8866',ms='#5a7a2a',gl='#b8ff60';
  // 가슴 바위 판(각진 판·빛 균열)
  const fy=7.6*bw;const pl=[[-4,sh-2.5,3.6,0],[4,sh-3,3.8,1],[-2.5,sh-8.5,3.2,2],[3.5,sh-9,2.8,3],[0,H+3,3,4]];for(const[x,z,rr,i]of pl)W1_rock(B,K,[x*bw*.85,fy,z],rr*bw*.95,i%2?W1_tone(rk,.08):W1_tone(rk,-.06),[0,1,0],{seed:i,d:-.32,crack:i===1||i===2?gl:null});
  B.line([[-6*bw,fy+.3,sh-5.5],[-1,fy+.4,sh-6.5],[2,fy+.4,sh-5],[5.5*bw,fy+.2,sh-6.5]],gl,.55);B.glow([0,fy+.5,sh-6],3.2,'170,255,80',.45);
  // 등 바위·이끼·수정 군
  for(let i=0;i<3;i++)W1_rock(B,K,[(i-1)*4.6*bw,-8.2*bw,sh-3-i*2.5],3.3*bw,i%2?W1_tone(rk,-.12):rk,[0,-1,0],{seed:i+5,d:-.05});
  W1_crystal(B,K,[0,-8.6*bw,sh],W1_n(0,-.4,1),6,2,'#b8ff80',{d:-.06});W1_crystal(B,K,[-3*bw,-8*bw,sh-1],W1_n(-.4,-.4,1),4,1.4,'#90e060',{d:-.06});
  // 어깨 바위 견갑·이끼 덮개·수정
  for(const g of[-1,1]){const c=[10*g*bw,.5,sh+1.5];W1_rock(B,K,W1_a3(c,[0,3,0]),4*bw,rk,W1_n(g*.3,1,.2),{seed:g+2,d:-.33});W1_rock(B,K,W1_a3(c,[1.5*g,-.5,1.6]),3.2*bw,W1_tone(rk,.12),W1_n(g,0,.4),{seed:g+7,d:-.31});
    B.ball(W1_a3(c,[0,0,3.2]),2.6*bw,ms,{sy:.5,sx:1.3,d:-.34});for(let i=0;i<4;i++)B.cap(W1_a3(c,[(i-1.5)*1.2,1.5,3.4]),W1_a3(c,[(i-1.5)*1.4,2.2,1.4]),.6,'#4a6a1a',{w1:.2,d:-.35});
    W1_crystal(B,K,W1_a3(c,[g*.5,-1,3.2]),W1_n(g*.3,-.3,1),5,1.6,'#a8f070',{d:-.36});W1_crystal(B,K,W1_a3(c,[g*2.5,-1.5,1.5]),W1_n(g*.8,-.2,.7),3.4,1.2,'#88d050',{d:-.35});
    // 팔뚝 바위 판·무릎 바위
    const h=W.h(g),el=W.el(g);W1_rock(B,K,W1_a3(W1_mid(el,h,.55),[0,2.4*bw,0]),2.8*bw,W1_tone(rk,-.05),[0,1,0],{seed:g+11,d:-.08});
    W1_rock(B,K,W1_a3(W.kn(g),[0,3*bw,.5]),2.8*bw,rk,[0,1,0],{seed:g+13,d:-.14});B.ball(W1_a3(W.kn(g),[0,2.6*bw,2.4]),1.4*bw,ms,{sy:.45,sx:1.3,d:-.16});}
  // 머리: 바위 이마 판·이끼·수정 뿔
  W1_rock(B,K,P(0,.85,.55),r*.75,W1_tone(rk,-.1),W1_n(0,1,.4),{seed:3,d:-.08});B.ball(P(0,-.25,.78),r*.75,ms,{sy:.45,sx:1.2,d:-.05});
  for(let i=0;i<4;i++)B.cap(P((i-1.5)*.4,.45,.75),P((i-1.5)*.45,.75,.3),r*.1,'#4a6a1a',{w1:r*.05,d:-.1});W1_crystal(B,K,P(.3,-.2,.9),W1_n(.3,-.3,1),r*1.1,r*.3,'#c0ff70',{d:-.07});
  // 떠다니는 돌·흙먼지
  for(let i=0;i<4;i++){const a=t/700+i*1.57;const c=[Math.cos(a)*16,Math.sin(a)*11,8+Math.sin(a*2+i)*4+i*4];W1_rock(B,K,c,1+i%2*.5,i%2?W1_tone(rk,.1):W1_tone(rk,-.15),W1_n(Math.cos(a),Math.sin(a),.3),{seed:i,d:-.02});}
  for(let i=0;i<4;i++){const ph=((t/1500)+i/4)%1;B.glow([Math.cos(i*1.7)*10,Math.sin(i*2.3)*7,ph*6],2.4,'150,130,90',(1-ph)*.35);}}}]);

// ======================= 184 볼 라이트닝 =======================
Q.push(['볼 라이트닝',{
 detail(B,K){const s=B.s,G=W1_blob(B),{r,z0,lunge,pulse}=G,{mode,f,t}=B;const c=[0,lunge,z0+r*1.2],R0=r*(.8+pulse);
  // 겹 핵(흰 중심·노랑 껍질)
  B.ball(c,R0*.55,'#ffffff',{alpha:.95,d:-.1});B.ball(W1_a3(c,[-R0*.25,R0*.2,R0*.3]),R0*.2,'#ffffff',{flat:1,alpha:.5,d:-.12});
  // 지그재그 전류 가지(시간 변화)
  const sd=Math.floor(t/90)+f*7;for(let i=0;i<4;i++){const a=i*1.57+sd*.7,b=Math.sin(sd+i)*.6;let p=c;const pts=[c];for(let j=1;j<=3;j++){p=W1_a3(c,[Math.cos(a+Math.sin(sd*j+i)*.4)*r*j*.55,Math.sin(a+Math.cos(sd*j)*.4)*r*j*.55,b*r*j*.4]);pts.push(p);}
    B.line(pts,'rgba(255,255,190,.9)',.5);B.line(pts,'rgba(255,255,120,.35)',1.4);B.glow(p,.9,'255,255,160',.8);}
  // 전자 궤도 입자
  for(let i=0;i<3;i++){const a=t/180+i*2.09;B.ball(W1_a3(c,[Math.cos(a)*r*1.5,Math.sin(a)*r*1.5,Math.sin(a+i)*r*.6]),r*.12,'#fffff0',{glow:'255,255,170',d:-.03});}
  if(mode==='attack'||mode==='skill'){const tgt=W1_a3(c,[0,r*2.2,-r*.4]);B.arc([c,W1_a3(W1_mid(c,tgt),[Math.sin(t/50)*r*.5,0,r*.6]),tgt],'255,255,170',.8);B.glow(tgt,r*.6,'255,255,150',.8);}
  B.glow([0,lunge,0],r*.9,'255,255,150',.2);}}]);

// ======================= 187 밀림 호랑이 =======================
Q.push(['밀림 호랑이',{
 detail(B,K){const s=B.s,G=W1_quad(B),{h,L,bw,ny,R0,hd,r,fwd,tip,jaw}=G,sk=s.skin,t=B.t,st='#1a1008';
  // 흰 배·턱·볼털
  B.ball([0,ny*.7,h-R0*.5],R0*.85,'#f4ead8',{sx:1.05,sy:.55,d:-.06});B.ball([0,L*.48+ny,h-R0*.1],R0*.6,'#f8f0e0',{sy:.8,d:-.08});
  // 추가 줄무늬(옆구리 사선·다리·꼬리)
  for(let i=0;i<6;i++){const y=-L*.45+i*L*.18+ny*.7;for(const g of[-1,1])B.cap([g*R0*.98,y,h+R0*.15],[g*R0*.85,y+1.6,h-R0*.45],.9,st,{w1:.25,d:-.28});}
  for(const lg of G.legs)for(const tt of[.15,.35])B.cap(W1_a3(W1_mid(lg.top,lg.kn,tt*2),[-1.4,0,0]),W1_a3(W1_mid(lg.top,lg.kn,tt*2),[1.4,.2,-.4]),.7,st,{w1:.3,d:-.08});
  const tp=W1_tailQ(B,G);for(let i=1;i<tp.length;i++)B.cap(W1_a3(tp[i],[-1.4,0,0]),W1_a3(tp[i],[1.4,0,0]),.8,st,{d:-.06});B.ball(tp[tp.length-1],1.4,st,{d:-.06});
  // 머리: 볼 갈기·이마 王 무늬·흰 눈두덩·코·수염·귀 반점·송곳니
  for(const g of[-1,1]){for(let i=0;i<3;i++)B.cap(W1_a3(hd,[g*r*.7,r*(.1-i*.2),-r*(.1+i*.15)]),W1_a3(hd,[g*r*1.3,-r*(.1+i*.3),-r*(.3+i*.2)]),r*.32,i%2?'#f8f0e0':W1_tone(sk,.1),{w1:r*.06,d:-.04});
    const e=W1_a3(W1_a3(hd,fwd,r*.62),[g*r*.52,0,r*.28]);B.ball(W1_a3(e,[0,-r*.05,r*.2]),r*.22,'#f8f0e0',{flat:1,d:-.03});B.cap(W1_a3(e,[g*r*.2,-r*.1,0]),W1_a3(e,[g*r*.5,-r*.4,r*.1]),r*.08,st,{d:-.07});
    for(let i=0;i<3;i++)B.line([W1_a3(tip,[g*r*.25,-r*.2,-r*.1]),W1_a3(tip,[g*r*1.3,-r*(.1+i*.15),-r*(.05+i*.15)])],'#f0f0f0',.22);
    B.ball(W1_a3(hd,[g*r*.65,-r*.35,r*1]),r*.16,'#f8f0e0',{flat:1,d:.02});
    if(jaw>.3)B.cap(W1_a3(tip,[g*r*.28,-r*.2,-r*.3]),W1_a3(tip,[g*r*.28,-r*.2,-r*.85]),r*.12,'#f4ecd8',{w1:r*.03,d:-.12});}
  for(let i=0;i<3;i++)B.cap(W1_a3(hd,[-r*.35,r*(.4-i*.25),r*(.85-i*.05)]),W1_a3(hd,[r*.35,r*(.4-i*.25),r*(.85-i*.05)]),r*.08,st,{d:-.08});B.cap(W1_a3(hd,[0,r*.45,r*.9]),W1_a3(hd,[0,-r*.2,r*.92]),r*.08,st,{d:-.08});
  B.ball(tip,r*.26,'#3a2020',{sx:1.2,sy:.75,d:-.08});B.cap(W1_a3(W1_a3(hd,fwd,r*.9),[0,0,-r*.05]),W1_a3(tip,[0,0,-r*.05]),r*.4,'#f8f0e0',{w1:r*.3,d:-.06});
  if(jaw>.3)B.ball(W1_a3(tip,[0,-r*.3,-r*.55]),r*.3,'#701818',{flat:1,sy:.6,d:-.09});
  W1_qClaws(B,G,'#e8e0d0');
  for(let i=0;i<3;i++){const ph=((t/1600)+i/3)%1;B.glow([Math.cos(i*2.1)*11,Math.sin(i*1.7)*8,1+ph*6],1.6,'120,170,80',(1-ph)*.3);}}}]);

// ======================= 190 페르페르 =======================
Q.push(['페르페르',{
 detail(B,K){const s=B.s,G=W1_blob(B),{r,z0,lunge,sq,walk,ph}=G,{mode,f,t}=B,sk=s.skin;const c=[0,lunge,z0+r*.7*sq];
  // 복슬 털 뭉치(겹 결)
  for(let rI=0;rI<3;rI++)for(let i=0;i<9;i++){const a=i/9*Math.PI*2+rI*.35,zz=c[2]+(rI-1)*r*.45/sq;const rr=r*(rI===1?1.02:.85);const p=[Math.cos(a)*rr,lunge+Math.sin(a)*rr*.95,zz];
    B.cap(p,W1_a3(p,[Math.cos(a)*1.2,Math.sin(a)*1.2,-1.2+rI*.4]),r*.32,(i+rI)%2?W1_tone(sk,.12):W1_tone(sk,-.12),{w1:r*.06,d:-.02});}
  for(let i=0;i<5;i++)B.cap([(i-2)*r*.25,lunge-r*.1,c[2]+r*.7],[(i-2)*r*.32+Math.sin(t/300+i)*.4,lunge-r*.3,c[2]+r*1.05],r*.22,i%2?'#f0dca8':'#d8c088',{w1:r*.05,d:-.03});
  // 둥근 귀·얼굴: 큰 눈 광택·볼 홍조·작은 입·코
  for(const g of[-1,1]){B.ball([g*r*.6,lunge-r*.1,c[2]+r*.75],r*.3,W1_tone(sk,-.1),{d:.02});B.ball([g*r*.6,lunge,c[2]+r*.75],r*.17,'#e8a090',{flat:1,d:-.01});
    B.ball([g*r*.3,lunge+r*.78,c[2]+r*.08],r*.17,'#1a1210',{flat:1,d:-.07});B.ball([g*r*.26,lunge+r*.82,c[2]+r*.15],r*.06,'#ffffff',{flat:1,d:-.09});B.ball([g*r*.55,lunge+r*.7,c[2]-r*.1],r*.13,'#f0a090',{flat:1,alpha:.7,d:-.07});}
  B.ball([0,lunge+r*.86,c[2]-r*.05],r*.07,'#5a3020',{flat:1,d:-.08});B.cap([-r*.1,lunge+r*.84,c[2]-r*.2],[r*.1,lunge+r*.84,c[2]-r*.2],r*.05,'#5a3020',{d:-.08});
  if(mode==='attack'&&f===1)B.ball([0,lunge+r*.84,c[2]-r*.25],r*.14,'#802020',{flat:1,d:-.09});
  // 짧은 발·꼬리 술
  for(const g of[-1,1]){const fy=walk?Math.sin(ph+(g>0?0:Math.PI))*1.5:0;B.ball([g*r*.45,lunge+r*.3+fy,z0+.6],r*.22,'#c8aa70',{sy:.6,d:-.02});}
  B.cap([0,lunge-r*.8,c[2]-r*.2],[Math.sin(t/250+f)*1.5,lunge-r*1.4,c[2]+r*.3],r*.25,'#d8c088',{w1:r*.12,d:.05});
  for(let i=0;i<3;i++){const ph2=((t/1400)+i/3)%1;B.glow([Math.cos(i*2.1)*r,lunge+Math.sin(i*1.7)*r,c[2]+r+ph2*8],.8,'255,230,160',(1-ph2)*.6);}}}]);

// ======================= 193 와이번 =======================
Q.push(['와이번',{
 detail(B,K){const s=B.s,G=W1_quad(B),{h,L,bw,ny,R0,hd,r,fwd,tip,headUp}=G,sk=s.skin,t=B.t,f=B.f;
  W1_qWing(B,G,'#2e3a18','#7a8a3a');
  // 등 비늘·배 판
  for(let i=0;i<7;i++){const y=-L*.48+i*L*.15+ny*.7;for(const g of[-1,0,1])B.ball([g*R0*.55,y+(g?1:0),h+R0*(g?.78:1)],R0*.28,i%2?W1_tone(sk,.1):W1_tone(sk,-.12),{flat:1,sy:.6,d:-.25});}
  for(let i=0;i<5;i++)B.cap([-R0*.55,-L*.3+i*L*.17+ny*.7,h-R0*.55],[R0*.55,-L*.3+i*L*.17+ny*.7,h-R0*.55],1.2,i%2?'#d8c880':'#b0a060',{d:-.15});
  // 목 비늘 띠·가시
  const nk=W1_qNeck(G);for(let i=0;i<4;i++){const q=W1_mid(nk,hd,i/4);B.cap([-2*bw,q[1]+.5,q[2]-1],[2*bw,q[1]+.5,q[2]-1],1,'#c8b870',{d:-.12});B.cap(W1_a3(q,[0,-.3,2.2]),W1_a3(q,[0,-1.6,3.8]),1,'#3a2a14',{w1:.15,d:-.05});}
  W1_dragonHead(B,K,{hd,r,fwd,tip},{horn:'#d8d0b0',brow:'#2a3014',frill:'#4a3a1a'});
  // 꼬리: 독침(갈고리)·독방울
  const tp=W1_tailQ(B,G),e=tp[tp.length-1];for(let i=1;i<tp.length;i++)B.cap(W1_a3(tp[i],[0,0,.8]),W1_a3(tp[i],[0,-1,2.3]),.9,'#3a2a14',{w1:.12,d:-.05});
  const sting=W1_a3(e,[0,-4.5,1.5+(B.mode==='attack'||B.mode==='skill'?2:0)]);B.cap(e,sting,2.2,'#3a2a14',{w1:.3,d:-.05});B.cap(W1_a3(e,[0,-1.5,.5]),W1_a3(e,[0,-2.5,2.4]),1.2,'#2a1a0a',{w1:.2,d:-.06});
  B.glow(sting,1.4,'200,255,80',.7);if(B.mode==='skill'&&f>=1)for(let i=0;i<3;i++)B.glow(W1_a3(sting,[0,i*.5,-i*1.5]),1,'200,255,80',.7);
  W1_qClaws(B,G,'#e0d8c0');
  if(B.mode==='skill'&&f>=1)B.glow(tip,3+f,'220,255,110',.6);}}]);

// ======================= 196 해적 라쿤 =======================
Q.push(['해적 라쿤',{
 detail(B,K){const J=B.J,W=W1_joints(B),s=B.s,P=W.HP,r=J.hr,bw=J.bw,H=J.H,sh=J.sh,t=B.t,gd='#d8b048';
  // 줄무늬 셔츠·코트 앞자락·금 단추·붉은 허리띠
  for(let i=0;i<4;i++)B.cap([-2.6*bw,6.5*bw,sh-2-i*2.6],[2.6*bw,6.5*bw,sh-2-i*2.6],1,i%2?'#e8e4dc':'#3a4a8a',{d:-.33});
  for(const g of[-1,1]){B.poly([[g*2.8*bw,6.3*bw,sh],[g*7*bw,5*bw,sh-.5],[g*7.5*bw,4.6*bw,H-5],[g*3*bw,6.2*bw,H-1]],'#2a3a6a',{grad:1,edge:gd,ew:.4,d:-.32});for(let i=0;i<3;i++)B.ball([g*3.4*bw,6.5*bw,sh-3-i*3],.5,gd,{d:-.44});}
  B.cap([-7*bw,5.8*bw,H+1.5],[7*bw,5.8*bw,H+1.5],2.4,'#b02020',{d:-.36});const sw=J.p.sw||0;B.cap([3*bw,6.2*bw,H+1],[3.6*bw,6.6*bw+sw,H-4],1.2,'#b02020',{w1:.8,d:-.37});
  // 허리 권총
  B.cap([-3*bw,6.6*bw,H+2.4],[-1*bw,6.8*bw,H],1,'#5a3a1a',{d:-.4});B.cap([-1*bw,6.8*bw,H+2.6],[1.5*bw,6.9*bw,H+3.2],.7,'#8a8a90',{d:-.41});
  // 어깨 견장(금술)·소매 접단
  for(const g of[-1,1]){const c=[9.4*g*bw,.4,sh+.4];B.ball(c,2.4*bw,'#2a3a6a',{sy:.7,d:-.3});for(let i=0;i<4;i++)B.cap(W1_a3(c,[(-1+i*.7)*g,1.4,-.4]),W1_a3(c,[(-1+i*.7)*g*1.15,1.5,-2.2]),.3,gd,{d:-.36});
    const el=W.el(g),h=W.h(g);B.cap(W1_mid(el,h,.7),W1_mid(el,h,.82),4.4*bw,'#2a3a6a',{w1:4.8*bw,d:-.05});B.cap(W1_a3(W1_mid(el,h,.8),[-2,0,0]),W1_a3(W1_mid(el,h,.8),[2,0,0]),.5,gd,{d:-.08});
    // 접힌 부츠
    const kn=W.kn(g),ft=W.ftp(g);B.cap(W1_mid(kn,ft,.1),ft,4,'#2a1a10',{w1:3.4,d:-.07});B.cap(W1_a3(W1_mid(kn,ft,.1),[0,0,.4]),W1_a3(W1_mid(kn,ft,.1),[0,.5,-.6]),4.8,'#4a2e18',{d:-.09});}
  // 꼬리 고리
  const tp=W1_tailPts(B);for(let i=0;i<2;i++)for(let j=1;j<4;j++){const q=W1_mid(tp[i],tp[i+1],j/4);B.cap(W1_a3(q,[-1.6+i*.5,0,0]),W1_a3(q,[1.6-i*.5,0,0]),1.2-i*.3,j%2?'#2a2626':'#b8b4b0',{d:-.04});}B.ball(tp[2],1.1,'#2a2626',{d:-.05});
  // 얼굴: 안대·흉터·수염·금 귀걸이·두건 매듭
  B.cap(P(-.95,.4,.55),P(.6,.95,.15),r*.06,'#141010',{d:-.09});B.ball(P(-.36,.88,.12),r*.2,'#141010',{flat:1,d:-.1});
  for(const g of[-1,1])for(let i=0;i<3;i++)B.line([P(.25*g,1.2,-.35),P((.85+i*.08)*g,1.1,-.25-i*.12)],'#e8e8e8',.22);
  B.ball(P(.88,.1,.2),r*.12,gd,{d:-.06});B.cap(P(0,-.95,.5),P(.35,-1.5,-.3),r*.22,'#c02020',{w1:r*.1,d:.03});B.cap(P(0,-.95,.5),P(-.3,-1.6,-.1),r*.2,'#a01818',{w1:r*.1,d:.03});
  for(let i=0;i<4;i++)B.ball(P(-.6+i*.4,.3,.75),r*.08,'#f0f0f0',{flat:1,d:-.06});
  // 커틀러스
  W1_sword(B,K,W,s,{guard:gd,gem:'#d8b048',pommel:gd,n:20});const pt=W.wp;B.poly([pt(3),W1_a3(pt(10),[1.4,0,0]),W1_a3(pt(19),[.9,0,0]),pt(21)],'#c8d0d8',{d:-.18,alpha:.85});B.cap(W1_a3(pt(1.2),[-1.6,0,0]),W1_a3(pt(-2.5),[-1.6,0,0]),.5,gd,{d:-.12});}}]);
})();
