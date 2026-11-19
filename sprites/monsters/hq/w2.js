/* 리클라인 몬스터 고품질 업그레이드 — 작업자 2 */
(window.MRHQ=window.MRHQ||[]);
(function(){
const Q=window.MRHQ;
// ---------- 공통 도구(이 파일 안에서만) ----------
const hx=h=>{h=String(h).replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255];};
const T=(h,a)=>{const c=hx(h);return'#'+c.map(v=>Math.max(0,Math.min(255,Math.round(a>0?v+(255-v)*a:v*(1+a)))).toString(16).padStart(2,'0')).join('');};
const A=(a,b,s=1)=>[a[0]+b[0]*s,a[1]+b[1]*s,a[2]+b[2]*s];
const M=(a,b,t=.5)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const N=(x,y,z)=>{const l=Math.hypot(x,y,z)||1;return[x/l,y/l,z/l];};
const SUB=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const DIR=(a,b)=>{const d=SUB(b,a);return N(d[0],d[1],d[2]);};
const CR=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const PERP=d=>{let u=CR(d,[0,0,1]);if(Math.hypot(...u)<.2)u=CR(d,[1,0,0]);return N(...u);};
// 인간형 관절(plan biped가 그린 위치와 같게 계산)
function J(B){const{p,H,sh,bw}=B.J;const r={};for(const[sg,h,ft,k]of[[1,p.hR,p.fR,'R'],[-1,p.hL,p.fL,'L']]){const sp=[9*sg*bw,0,sh-1],el=[(9*sg*bw+h[0])/2+2*sg,h[1]/2-1.8,(sh-1+h[2])/2-1.5],hip=[4*sg*bw,0,H],kn=[(4*sg*bw+ft[0])/2,ft[1]/2+2.5,(H+ft[2])/2+1],fp=[ft[0],ft[1],ft[2]+1.5];r[k]={sg,sp,el,h,hip,kn,fp,ft};}return r;}
// 몸통 반지름(높이 z)
function TR(B,z){const s=B.s,{bw,H,sh}=B.J;const w0=13*bw*(s.belly?1.35:1),w1=(13+(s.chestW||3.5)*2)*bw;const t=Math.max(0,Math.min(1,(z-H-1)/(sh-2.5-H)));let R=(w0+(w1-w0)*t)/2;if(z>sh-1.5){const R1=w1/2,dz=z-(sh-1.5);R=Math.sqrt(Math.max(R1*R1*.08,R1*R1-dz*dz));}else if(z<H+1){const R0=w0/2,dz=H+1-z;R=Math.sqrt(Math.max(R0*R0*.08,R0*R0-dz*dz));}return R;}
// 몸통 표면 점: a=각도(0 정면, +는 오른쪽), z 높이, o 바깥 여유
function SF(B,a,z,o=.3){const R=TR(B,z)+o;return[Math.sin(a)*R,Math.cos(a)*R,z];}
// 머리 상대 좌표
function HP(B,x,y,z,hd){const h=hd||B.J.hd,r=B.J.hr;return[h[0]+x*r,h[1]+y*r,h[2]+z*r];}
// 리벳 한 줄
function rivets(B,pts,col='#d8cfa8',r=.5){for(const p of pts)B.ball(p,r,col,{d:-.06});}
// 팔 보호대(아래팔)
function bracer(B,j,col,w,o={}){const a=M(j.el,j.h,.22),b=M(j.el,j.h,.78);B.cap(a,b,w,col,{w1:w*.9,d:-.02});const sc=o.strap||T(col,-.45);for(const t of[.35,.62])B.cap(M(j.el,j.h,t-.03),M(j.el,j.h,t+.03),w*1.12,sc,{d:-.03});if(o.rivet)rivets(B,[M(a,b,.5)].map(p=>A(p,[0,0,0])),o.rivet,.45);}
// 다리 보호대
function greave(B,j,col,w,o={}){const a=M(j.kn,j.fp,.12),b=M(j.kn,j.fp,.82);B.cap(a,b,w,col,{w1:w*.82,d:-.02});B.ball(A(j.kn,[0,.8,0]),w*.34,o.knee||T(col,.12),{sy:.9,d:-.05});if(o.strap)for(const t of[.4,.7])B.cap(M(j.kn,j.fp,t-.03),M(j.kn,j.fp,t+.03),w*1.08,o.strap,{d:-.03});}
// 견갑(겹판)
function pauldron(B,j,col,bw,o={}){const sg=j.sg,c=A(j.sp,[sg*1.2,0,1.8]);B.ball(c,4.4*bw*(o.s||1),col,{sy:.78,d:-.08});B.ball(A(c,[sg*1.6,0,-2.6]),3.6*bw*(o.s||1),T(col,-.12),{sy:.62,d:-.07});B.ball(A(c,[sg*2.4,0,-4.6]),2.9*bw*(o.s||1),T(col,-.22),{sy:.55,d:-.06});
  if(o.rivet)rivets(B,[A(c,[sg*.6,2.6*bw,1.4]),A(c,[sg*2.2,2.2*bw,-1]),A(c,[sg*.6,-2.6*bw,1.4])],o.rivet,.5);if(o.spike)B.cap(A(c,[sg*1,0,2.6]),A(c,[sg*3.4,-.5,7]),1.6,o.spike,{w1:.2,d:-.1});}
// 가죽 끈(두 점 사이) + 버클
function strap(B,a,b,col,w=1.4,buckle){B.cap(a,b,w,col,{d:-.04});if(buckle)B.ball(M(a,b,.5),w*.55,buckle,{d:-.08});}
// 털 다발: 점들 주변에 짧은 가닥
function fur(B,pts,col,len=2.6,w=1.6,seed=0){pts.forEach((p,i)=>{const a=Math.sin(i*7.3+seed)*.8,c=Math.cos(i*5.1+seed);B.cap(p,A(p,[a*len*.5,c*.4,-len]),w,i%2?col:T(col,-.18),{w1:.3,d:-.05});});}
// 몸통 앞 판금(행 단위 비늘·판)
function scales(B,z0,z1,rows,cols,col,a0=-.9,a1=.9,sz=1.6){const n=Math.max(3,cols);const hh=(z1-z0)/Math.max(1,rows);for(let r=0;r<rows;r++){const zt=z1-hh*r,zb=zt-hh*1.08,c=r%2?T(col,-.1):col;
  for(let i=0;i<n;i++){const aa=a0+(a1-a0)*i/n,ab=a0+(a1-a0)*(i+1)/n;B.poly([SF(B,aa,zt,.45),SF(B,ab,zt,.45),SF(B,ab,zb,.75),SF(B,aa,zb,.75)],i%2?T(c,-.06):c,{grad:1,edge:T(col,-.6),ew:.35,d:-.04-r*.002});}
  if(sz>1.5)for(let i=0;i<n;i++)B.ball(SF(B,a0+(a1-a0)*(i+.5)/n,zt-hh*.3,.8),.4,T(col,.5),{d:-.07});}}
// 이빨 한 줄(머리 상대)
function teeth(B,n,y,z,wd,col='#ece4cc',len=.22,hd){for(let i=0;i<n;i++){const x=(i/(n-1)-.5)*wd;B.cap(HP(B,x,y,z,hd),HP(B,x*1.05,y+.02,z-len,hd),B.J.hr*.09,col,{w1:B.J.hr*.02,d:-.08});}}
// 눈두덩
function brow(B,col,y=.8,z=.38,wd=.62,hd){B.cap(HP(B,-wd,y,z+.04,hd),HP(B,0,y+.1,z-.04,hd),B.J.hr*.26,col,{w1:B.J.hr*.18,d:-.07});B.cap(HP(B,wd,y,z+.04,hd),HP(B,0,y+.1,z-.04,hd),B.J.hr*.26,col,{w1:B.J.hr*.18,d:-.07});}
// 로브 보강(옆판·자락·장식선)
function robeHQ(B,col,trim,o={}){const s=B.s,{bw,H,p}=B.J,cp=p.cape||1.5;const dk=T(col,-.28);
  for(const g of[-1,1]){B.poly([[7*bw*g,2,H+2],[10*bw*g,4,1],[10.4*bw*g,0,.6],[10*bw*g,-4-cp*.3,1],[7*bw*g,-2,H+2]],T(col,-.12),{grad:1});}
  // 앞 주름
  for(const x of[-5,-2,2,5])B.line([[x*bw*.75,2.4,H],[x*bw*1.05,4.6+Math.abs(x)*.05,1.5]],'rgba(0,0,0,.28)',.7);
  // 자락 띠
  if(trim){B.line([[-10*bw,4.2,1.4],[0,6.3,.4],[10*bw,4.2,1.4]],trim,1.4);B.line([[-10*bw,-4.2-cp*.3,1.4],[0,-6.3-cp*.5,.4],[10*bw,-4.2-cp*.3,1.4]],trim,1.4);B.cap([0,2.6,H+1],[0,6.1,1.2],1.6,trim,{d:-.12});}
  if(o.hemDark)B.line([[-10*bw,4.1,2.6],[0,6.1,1.6],[10*bw,4.1,2.6]],dk,1.1);}
// 활 보강
function bowHQ(B,col,tip){const{p}=B.J,h=p.hL,d=p.dL,up=[0,0,1];const top=A(h,up,12),bot=A(h,up,-12),c1=A(M(top,h),d,3.5),c2=A(M(bot,h),d,3.5);
  B.line([top,c1,h,c2,bot],T(col,.35),.6);B.line([A(top,d,-.6),A(top,d,1.2)],tip,1.4);B.line([A(bot,d,-.6),A(bot,d,1.2)],tip,1.4);
  B.cap(A(h,up,-2.2),A(h,up,2.2),2.3,'#3a2416',{d:-.1});for(const z of[-1.4,0,1.4])B.cap(A(h,up,z-.25),A(h,up,z+.25),2.6,'#6a5030',{d:-.12});
  B.ball(c1,.8,tip,{d:-.05});B.ball(c2,.8,tip,{d:-.05});}
// 화살(활시위에 걸린)
function arrowNock(B,shaftC='#8a6a40',head='#c8ccd0',fl='#c03030'){const{p}=B.J,{mode,f}=B;if(!((mode==='attack'||mode==='skill')&&f<2))return;const a=p.hR,tip=A(p.hL,DIR(p.hR,p.hL),6);B.line([a,tip],shaftC,.8);const d=DIR(a,tip);B.cap(tip,A(tip,d,2.4),1.2,head,{w1:.1,d:-.1});const u=PERP(d);for(const g of[-1,1])B.poly([A(a,d,.4),A(A(a,d,3),u,g*1.1),A(a,d,3.4)],fl,{d:-.05});}
// 화살통(등)
function quiver(B,col,trim,o={}){const{sh,H,bw}=B.J;const a=SF(B,-2.6,H+3,.8),b=SF(B,-3.0,sh+3,.9);const top=A(b,[2*bw,0,2]),bot=A(a,[-2.5*bw,0,0]);B.cap(bot,top,4.2,col,{w1:4.8,d:.05});B.cap(A(top,DIR(bot,top),-.6),A(top,DIR(bot,top),.4),5.3,trim,{d:.04});B.cap(M(bot,top,.45),M(bot,top,.52),4.9,trim,{d:.04});
  const dd=DIR(bot,top);for(let i=0;i<4;i++){const q=A(A(top,[ (i-1.5)*.9,(i%2)*.6-.3,0]),dd,.4);const e=A(q,dd,3.2+i%2);B.line([q,e],'#d8d0b8',.6);B.poly([e,A(A(e,dd,-2),[.9,0,0]),A(e,dd,-2.6),A(A(e,dd,-2),[-.9,0,0])],o.fl||(i%2?'#b02828':'#e8e0d0'),{d:.03});}
  // 어깨끈
  const fr1=SF(B,-.6,sh-1,.5),fr2=SF(B,.5,H+2,.5);strap(B,top,SF(B,2.4,sh,.5),'#3a2618',1.3);strap(B,SF(B,2.4,sh,.5),fr1,'#3a2618',1.3);strap(B,fr1,fr2,'#3a2618',1.3,'#c0a050');strap(B,fr2,bot,'#3a2618',1.3);}
// 창 보강
function spearHQ(B,blade,band,tassel){const{p}=B.J,h=p.hR,d=p.dS,pt=k=>A(h,d,k),u=PERP(d);const b0=pt(21.5),b1=pt(31);
  B.poly([b0,A(pt(24),u,2.4),b1,A(pt(24),u,-2.4)],blade,{grad:1,edge:T(blade,.5),ew:.4,d:-.05});B.line([pt(22),pt(30.4)],T(blade,.6),.5);
  B.cap(pt(20),pt(22),2.4,band,{d:-.06});B.cap(pt(21.7),A(pt(21.4),u,3.2),1.1,band,{w1:.4,d:-.06});B.cap(pt(21.7),A(pt(21.4),u,-3.2),1.1,band,{w1:.4,d:-.06});
  if(tassel)for(let i=0;i<3;i++)B.cap(pt(20),A(A(pt(20),[0,0,-4.5-i]),u,(i-1)*.8),.9,i%2?tassel:T(tassel,-.2),{w1:.3});
  for(const k of[-2.4,-1,.4,1.8])B.cap(pt(k-.25),pt(k+.25),1.9,'#5a3a22',{d:-.06});B.cap(pt(-16.5),pt(-15),1.8,band,{d:-.04});}
// 지팡이 보강: 손잡이 감기 + 머리 갈퀴
function staffHQ(B,wood,claw,o={}){const{p}=B.J,h=p.hR,d=p.dS,pt=k=>A(h,d,k),u=PERP(d),v=N(...CR(d,u));
  for(const k of[-2.4,-1.2,0,1.2,2.4])B.cap(pt(k-.3),pt(k+.3),2,o.wrap||'#6a4a2a',{d:-.05});
  for(const k of[-8,6])B.ball(pt(k),1.1,T(wood,-.2),{d:-.03});
  for(let i=0;i<3;i++){const a=i/3*Math.PI*2;const off=A([0,0,0],A(u,v,0),0);const r=[u[0]*Math.cos(a)+v[0]*Math.sin(a),u[1]*Math.cos(a)+v[1]*Math.sin(a),u[2]*Math.cos(a)+v[2]*Math.sin(a)];const b=A(pt(14),r,1),c=A(pt(16.5),r,3),e=A(pt(18.6),r,1);B.cap(b,c,1.1,claw,{w1:.8});B.cap(c,e,.8,claw,{w1:.2});}
  if(o.charm){const c0=pt(12.5);B.line([c0,A(c0,[0,0,-3]),A(A(c0,[0,0,-5]),u,.6)],'#8a7a5a',.4);B.ball(A(A(c0,[0,0,-5.4]),u,.6),.9,o.charm,{d:-.05});}}


// 각진 바위(면마다 명암) — 중심 c, 반지름 rx,ry,rz
function rock(B,c,rx,ry,rz,col,seed=0,o={}){const n=o.n||6,v=[],u=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2+seed,j=.8+.3*Math.abs(Math.sin(seed*3.1+i*1.7));const dz=Math.sin(seed+i*2.3)*rz*.15;v.push([c[0]+Math.cos(a)*rx*j,c[1]+Math.sin(a)*ry*j,c[2]+dz]);u.push([c[0]+Math.cos(a+.3)*rx*j*.55,c[1]+Math.sin(a+.3)*ry*j*.55,c[2]+rz*.62+dz*.5]);}
  const bot=[c[0],c[1],c[2]-rz*(o.flatB?.35:.8)],ec=T(col,-.4),d=o.d||0;
  for(let i=0;i<n;i++){const a=v[i],b=v[(i+1)%n];const ang=(i+.5)/n*Math.PI*2+seed;const lx=-Math.cos(ang)*.07+Math.sin(ang)*.04;B.poly([a,b,bot],T(col,-.32+lx),{edge:ec,ew:.2,d});B.poly([a,b,u[(i+1)%n],u[i]],T(col,.02+lx*1.5),{edge:ec,ew:.2,d});}
  B.poly(u,T(col,.22),{edge:ec,ew:.2,d});}

// ======================= 2. 오크 궁수 =======================
Q.push(['오크 궁수',{cloth:'#55613a',armor:'#4a5530',pants:'#3b3222',boot:'#2a2018',sleeve:'#4f5a34',forearm:'#7a8a4a',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,j=J(B),sk=B.s.skin;
  // 가죽 조끼 판·끈
  scales(B,H+2,sh+4.5,4,5,'#5a452c',-1.1,1.1,1.2);
  strap(B,SF(B,-.9,sh-1),SF(B,.9,H+2),'#2e2014',1.5,'#b09040');
  B.cap(SF(B,-1.3,H+1.5,.4),SF(B,1.3,H+1.5,.4),2.6,'#2a1c10',{d:-.04});B.ball(SF(B,0,H+1.5,.9),1.2,'#b8a050',{sy:.8,d:-.08});
  for(const a of[-.6,.6])B.poly([SF(B,a-.25,H+1,.6),SF(B,a+.25,H+1,.6),SF(B,a+.2,H-6,.9),SF(B,a-.2,H-6,.9)],'#4a3a24',{grad:1,d:-.04});
  // 어깨 털
  fur(B,[SF(B,-1.6,sh+2,.2),SF(B,-1,sh+3.5,.2),SF(B,-.4,sh+4,.2),SF(B,.4,sh+4,.2),SF(B,1,sh+3.5,.2),SF(B,1.6,sh+2,.2),SF(B,3,sh+.5,.2),SF(B,-3,sh+.5,.2)],'#6a5a40',2.6,2.2,1);
  bracer(B,j.L,'#4a3620',5.2*bw);bracer(B,j.R,'#4a3620',4.8*bw);
  greave(B,j.L,'#3a2c1c',6*bw,{strap:'#20160e'});greave(B,j.R,'#3a2c1c',6*bw,{strap:'#20160e'});
  quiver(B,'#5a3a20','#a08040');
  // 얼굴: 눈두덩·이빨·코주름·귀고리·전투 문신
  brow(B,T(sk,-.35),.84,.4);teeth(B,4,.98,-.42,.36,'#e8dcb8',.14);
  B.line([HP(B,-.3,.98,-.05),HP(B,-.12,.9,.2)],T(sk,-.45),.5);B.line([HP(B,.3,.98,-.05),HP(B,.12,.9,.2)],T(sk,-.45),.5);
  for(const g of[-1,1]){B.line([HP(B,.18*g,.95,.05),HP(B,.62*g,.78,-.25)],'rgba(150,30,20,.85)',.7);B.ball(HP(B,1.35*g,-.15,.3),.55,'#c8b060',{d:-.04});}
  // 가죽 두건(뒤통수)
  B.ball(HP(B,0,-.22,.22),hr*.98,'#4a5530',{sy:.8,d:.06});B.cap(HP(B,0,-.4,.6),HP(B,0,-1.3,-.6),hr*.5,'#4a5530',{w1:hr*.25});
  bowHQ(B,'#5a3418','#e0d8c0');arrowNock(B);}
}]);

// ======================= 5. 오크 마법사 =======================
Q.push(['오크 마법사',{cloth:'#46346a',sleeve:'#3d2d5e',trim:'#c9a24a',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,j=J(B),sk=B.s.skin,fx=B.s.fx;
  robeHQ(B,B.s.cloth,'#c9a24a',{hemDark:1});
  // 허리띠·매듭·늘어진 띠
  B.cap(SF(B,-1.4,H+2,.5),SF(B,1.4,H+2,.5),2.4,'#7a2a24',{d:-.05});B.ball(SF(B,.4,H+2,1),1.3,'#8a3a2a',{d:-.08});
  B.cap(SF(B,.4,H+1,1),A(SF(B,.5,H+1,1.4),[0,.6,-8]),1.2,'#7a2a24',{w1:.8,d:-.08});
  // 가슴 룬(빛)
  const c0=SF(B,0,sh-1,.6);B.ball(c0,1.6,'#2a1a40',{flat:1,d:-.06});B.glow(c0,2.4,fx,.5+.2*Math.sin(B.t/300));
  for(const a of[-.5,.5])B.line([SF(B,a,sh+2,.5),SF(B,a*.3,sh-4,.5)],'rgba(220,160,255,.8)',.5);
  // 뼈 목걸이
  for(let i=0;i<7;i++){const a=(i-3)*.32;B.cap(SF(B,a,sh+3,.4),SF(B,a*1.05,sh+.5+Math.abs(i-3)*.3,.8),.9,'#ece2c6',{w1:.4,d:-.07});}
  
  // 털 망토깃
  fur(B,[SF(B,-1.8,sh+.5,.2),SF(B,-1.1,sh+1.2,.2),SF(B,-.4,sh+1.6,.2),SF(B,.4,sh+1.6,.2),SF(B,1.1,sh+1.2,.2),SF(B,1.8,sh+.5,.2),SF(B,2.6,sh+1,.1),SF(B,-2.6,sh+1,.1),SF(B,3.14,sh+1.2,.1)],'#5a4a3a',2.8,2.6,2);
  bracer(B,j.R,'#3a2a4a',4.6*bw,{strap:'#c9a24a'});bracer(B,j.L,'#3a2a4a',4.6*bw,{strap:'#c9a24a'});
  // 얼굴: 주술 문신·이빨·눈두덩·코걸이
  brow(B,T(sk,-.35),.84,.42);teeth(B,4,.98,-.42,.34,'#e8dcb8',.13);
  for(const g of[-1,1]){B.line([HP(B,.22*g,.92,.5),HP(B,.3*g,.95,-.1),HP(B,.5*g,.82,-.45)],'rgba(250,240,255,.75)',.55);}
  B.ball(HP(B,0,1.02,-.08),.6,'#d0b060',{d:-.1});
  // 머리 장식 깃·뼈 매듭
  for(let i=0;i<3;i++)B.cap(HP(B,(i-1)*.3,-.6,.7),HP(B,(i-1)*.6,-1.9,.1+i%2*.3),hr*.16,i%2?'#d8c8a0':'#7a3a2a',{w1:hr*.04,d:.05});
  B.ball(HP(B,0,-.2,.95),hr*.25,'#ece2c6',{d:.02});
  staffHQ(B,'#5a3e22','#ece2c6',{charm:'#c070ff'});}
}]);

// ======================= 8. 두다-마라 오크 =======================
Q.push(['두다-마라 오크',{armor:'#7a5c26',pads:'#a8862e',pants:'#3e3020',boot:'#2a1e12',sleeve:'#6a5022',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,j=J(B),sk=B.s.skin;const gold='#b8942e',dg='#6a4c18';
  // 비늘 갑옷 가슴
  scales(B,H+2.5,sh+5,6,6,'#9a7a2c',-1.1,1.1,1.7);
  scales(B,H+2.5,sh+4,5,4,'#86682a',2.1,4.2,1.6);
  B.poly([SF(B,-.45,sh+3,.9),SF(B,.45,sh+3,.9),SF(B,.3,sh-4,1.1),SF(B,0,sh-6,1.2),SF(B,-.3,sh-4,1.1)],gold,{grad:1,edge:'#4a3410',ew:.5,d:-.08});
  B.ball(SF(B,0,sh-1,1.6),1.3,'#c03020',{glow:'255,120,60',d:-.12});
  // 큰 허리띠 + 버클 + 앞치마 판
  B.cap(SF(B,-1.4,H+1.5,.6),SF(B,1.4,H+1.5,.6),3,'#3a2414',{d:-.05});B.ball(SF(B,0,H+1.5,1.2),1.8,gold,{sy:.85,d:-.1});
  for(const a of[-.55,0,.55])B.poly([SF(B,a-.24,H,.7),SF(B,a+.24,H,.7),SF(B,a+.2,H-7,1),SF(B,a-.2,H-7,1)],a?T(dg,.1):gold,{grad:1,edge:'#2a1a08',ew:.4,d:-.05});
  pauldron(B,j.R,gold,bw,{rivet:'#e8d890',spike:'#e0d8c0',s:.72});pauldron(B,j.L,gold,bw,{rivet:'#e8d890',spike:'#e0d8c0',s:.72});
  bracer(B,j.R,dg,5*bw,{strap:gold});bracer(B,j.L,dg,5*bw,{strap:gold});
  greave(B,j.R,'#6a5228',6.4*bw,{knee:gold,strap:'#2a1a0a'});greave(B,j.L,'#6a5228',6.4*bw,{knee:gold,strap:'#2a1a0a'});
  // 투구: 반구 + 코가리개 + 뿔
  B.ball(HP(B,0,-.02,.36),hr*1.07,gold,{sy:.7,d:-.03});B.cap(HP(B,-.95,.3,.3),HP(B,.95,.3,.3),hr*.22,dg,{d:-.05});
  B.cap(HP(B,0,1.02,.55),HP(B,0,1.06,-.05),hr*.2,dg,{w1:hr*.1,d:-.1});
  for(const g of[-1,1]){B.cap(HP(B,.8*g,0,.55),HP(B,1.5*g,.1,1.1),hr*.3,'#e8dcc0',{w1:hr*.2,d:-.04});B.cap(HP(B,1.5*g,.1,1.1),HP(B,1.6*g,.5,1.9),hr*.2,'#e8dcc0',{w1:hr*.05,d:-.04});B.cap(HP(B,1.48*g,.1,1.08),HP(B,1.53*g,.18,1.28),hr*.32,'#5a3a18',{d:-.05});}
  rivets(B,[HP(B,-.7,.6,.6),HP(B,.7,.6,.6),HP(B,0,.85,.75)],'#f0e0a0',.5);
  brow(B,T(sk,-.38),.86,.36);teeth(B,3,.98,-.42,.28,'#e8dcb8',.13);
  // 망토(짧은 붉은 천)
  const cp=p.cape||1.5;B.poly([[-8*bw,-5,sh-1],[8*bw,-5,sh-1],[9*bw,-6-cp,H-4],[0,-7-cp*1.2,H-6],[-9*bw,-6-cp,H-4]],'#7a2018',{grad:1,d:.05});
  spearHQ(B,'#d0d4d8',gold,'#b02a20');}
}]);
// 도끼 보강(양날·날빛·손잡이 감기)
function axeHQ(B,steel,o={}){const{p}=B.J,h=p.hR,d=p.dS,pt=k=>A(h,d,k),X=[1,0,0];const a=pt(15),b=pt(21);
  B.poly([a,b,A(b,X,6),A(a,X,7)],steel,{grad:1,edge:T(steel,-.5),ew:.4,d:-.21});B.line([A(b,X,6),A(a,X,7)],T(steel,.7),.7);
  if(o.double){B.poly([A(a,d,.5),A(b,d,-.5),A(A(b,d,-.5),X,-5),A(A(a,d,.5),X,-5.6)],T(steel,-.08),{grad:1,edge:T(steel,-.5),ew:.4,d:-.21});B.line([A(A(b,d,-.5),X,-5),A(A(a,d,.5),X,-5.6)],T(steel,.6),.6);}
  B.cap(pt(14.5),pt(21.5),2.4,o.band||'#8a7a5a',{d:-.22});rivets(B,[pt(16.5),pt(19)],'#e8d8a0',.5);
  B.cap(pt(21.3),pt(24),1.3,steel,{w1:.2,d:-.2});for(const k of[-4,-2.6,-1.2,.2,1.6])B.cap(pt(k-.3),pt(k+.3),2,o.wrap||'#5a3a20',{d:-.05});B.ball(pt(-6.2),1.3,o.band||'#8a7a5a',{d:-.05});}

// ======================= 11. 난쟁이 =======================
Q.push(['난쟁이',{armor:'#6a6e76',pants:'#5a4030',boot:'#3a2818',sleeve:'#7a5a3a',helm:'#8e949c',beard:'#b07a3a',hair:'#9a6a32',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,j=J(B);const st='#9aa0a8',br='#b08a3a';
  scales(B,H+2,sh+5,5,6,'#7c828c',-1.15,1.15,1.7);
  B.poly([SF(B,-.4,sh+4,.9),SF(B,.4,sh+4,.9),SF(B,.35,sh-2,1.1),SF(B,0,sh-4,1.2),SF(B,-.35,sh-2,1.1)],br,{grad:1,edge:'#4a3410',ew:.5,d:-.08});
  B.cap(SF(B,-1.4,H+1.5,.6),SF(B,1.4,H+1.5,.6),3.2,'#3a2410',{d:-.05});B.poly([SF(B,-.28,H+3.2,1.1),SF(B,.28,H+3.2,1.1),SF(B,.28,H,1.1),SF(B,-.28,H,1.1)],br,{grad:1,edge:'#3a2408',ew:.5,d:-.1});B.ball(SF(B,0,H+1.6,1.4),.9,'#c03020',{d:-.12});
  pauldron(B,j.R,st,bw,{rivet:'#e0d8b0',s:.8});pauldron(B,j.L,st,bw,{rivet:'#e0d8b0',s:.8});
  bracer(B,j.R,'#8a6a3a',5*bw,{strap:br});bracer(B,j.L,'#8a6a3a',5*bw,{strap:br});
  greave(B,j.R,'#7a8088',6.2*bw,{knee:st,strap:'#3a2410'});greave(B,j.L,'#7a8088',6.2*bw,{knee:st,strap:'#3a2410'});
  for(const jj of[j.R,j.L])fur(B,[A(jj.fp,[-1.5,.5,2.6]),A(jj.fp,[0,1.5,2.8]),A(jj.fp,[1.5,.5,2.6]),A(jj.fp,[0,-1.2,2.6])],'#8a6a48',1.6,1.6,jj.sg);
  // 수염 땋기
  const bc='#b07a3a';for(const g of[-1,0,1]){let a=HP(B,.32*g,.86,-.55);for(let i=1;i<=3;i++){const b=HP(B,.34*g*(1-i*.08),.9+i*.02,-.55-i*.42);B.cap(a,b,hr*(.3-i*.04),i%2?bc:T(bc,-.15),{w1:hr*(.26-i*.04),d:-.2});a=b;}B.cap(A(a,[0,0,.4]),A(a,[0,0,-.3]),hr*.24,br,{d:-.22});}
  B.cap(HP(B,-.55,.92,-.12),HP(B,0,1.02,-.25),hr*.22,T(bc,.1),{w1:hr*.16,d:-.19});B.cap(HP(B,.55,.92,-.12),HP(B,0,1.02,-.25),hr*.22,T(bc,.1),{w1:hr*.16,d:-.19});
  B.ball(HP(B,0,1.02,.02),hr*.2,'#e0907a',{d:-.12});brow(B,'#8a5a2a',.86,.36);
  // 투구: 코가리개·테·뿔
  B.cap(HP(B,-1,.2,.3),HP(B,1,.2,.3),hr*.24,br,{d:-.05});B.cap(HP(B,0,1.05,.62),HP(B,0,1.1,.0),hr*.2,'#8e949c',{w1:hr*.12,d:-.13});rivets(B,[HP(B,-.75,.6,.38),HP(B,.75,.6,.38),HP(B,0,.2,1.08)],'#f0e0a0',.5);
  for(const g of[-1,1]){B.cap(HP(B,.85*g,0,.45),HP(B,1.45*g,-.1,.95),hr*.26,'#ece0c4',{w1:hr*.16,d:-.04});B.cap(HP(B,1.45*g,-.1,.95),HP(B,1.5*g,.15,1.6),hr*.16,'#ece0c4',{w1:hr*.04,d:-.04});}
  axeHQ(B,'#b8bec8',{double:1,band:br});}
}]);

// ======================= 14. 돌 골렘 =======================
Q.push(['돌 골렘',{skin:'#8a8478',armor:'#7e786c',pants:'#736d62',pads:'#958f82',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,j=J(B),t=B.t,{mode,f}=B;const st='#8a8478',mo='#5a7a3a',gl='255,150,50';
  // 몸통 바위판
  const rk=[[-.7,sh+4,3.2],[.5,sh+5,3.4],[0,sh-1,3.2],[-.9,sh-3,2.6],[.9,sh-2,2.8],[-.3,H+4,3],[.6,H+3,2.6],[2.2,sh+2,3.4],[-2.2,sh+2,3.4],[3.14,sh+3,4],[2.7,H+5,3],[-2.7,H+5,3],[1.6,H+2,2.6],[-1.6,H+3,2.6]];
  rk.forEach(([a,z,r],i)=>{const c=SF(B,a,z,-.6);rock(B,c,r*bw*.95,r*bw*.95,r*bw*.75,i%3?T(st,(i%5-2)*.05):T(st,-.08),i*1.3,{d:-.03});});
  for(const[a,z]of[[-.6,sh+7],[.5,sh+8],[2.4,sh+6],[-2.6,sh+5]])B.ball(SF(B,a,z,.8),1.5*bw,mo,{sx:1.6,sy:.45,d:-.08});
  const pu=.55+.25*Math.sin(t/260)+(mode==='skill'?.3:0);
  const cr=[SF(B,-.5,sh+4,1.6),SF(B,-.15,sh+1,1.8),SF(B,.2,sh+2,1.8),SF(B,.05,sh-3,1.8),SF(B,.35,H+4,1.6)];B.line(cr,'#2a1a10',1.4);B.line(cr,'rgba(255,170,70,'+Math.min(1,pu)+')',.6);B.glow(SF(B,.05,sh,2),3.4,gl,pu*.6);
  for(const jj of[j.R,j.L]){rock(B,A(jj.sp,[jj.sg*1.6,0,2.4]),5*bw,4.6*bw,3.6*bw,T(st,.04),jj.sg*2,{d:-.06});B.ball(A(jj.sp,[jj.sg*1,0,5.6]),1.6*bw,mo,{sx:1.5,sy:.45,d:-.1});
    rock(B,M(jj.el,jj.h,.45),3.4*bw,3.4*bw,3*bw,T(st,-.04),jj.sg+1,{d:-.04});rock(B,jj.el,2.8*bw,2.8*bw,2.4*bw,T(st,.06),jj.sg+3,{d:-.04});
    rock(B,A(jj.h,[0,.8,0]),3.2*bw,3.2*bw,2.6*bw,T(st,-.08),jj.sg*5,{d:-.08});
    rock(B,M(jj.hip,jj.kn,.4),3.4*bw,3.4*bw,3*bw,T(st,-.04),jj.sg*7,{d:-.03});rock(B,A(jj.kn,[0,.6,0]),3*bw,3*bw,2.6*bw,T(st,.08),jj.sg*9,{d:-.05});rock(B,A(jj.fp,[0,1,.6]),3.6*bw,4*bw,2.2*bw,T(st,-.12),jj.sg*11,{d:-.04,flatB:1});}
  rock(B,HP(B,0,.15,.55),hr*.95,hr*.9,hr*.55,T(st,.06),2.2,{d:-.04});rock(B,HP(B,0,.5,-.5),hr*.75,hr*.55,hr*.4,T(st,-.12),4.1,{d:-.04});
  B.ball(HP(B,.25,-.1,1.05),hr*.3,mo,{sx:1.6,sy:.45,d:-.06});
  if(mode==='attack'&&f===1)for(let i=0;i<5;i++)rock(B,A(p.hR,[Math.sin(i*2)*3,3+i,Math.cos(i*3)*2]),.9,.9,.8,T(st,-.2),i,{d:-.2});}
}]);

// ======================= 17. 발터자르 =======================
Q.push(['발터자르',{cloth:'#541818',hood:'#3e1414',sleeve:'#4a1616',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,j=J(B),t=B.t;const gold='#d2a442',dg='#7a5418',fx=B.s.fx;
  robeHQ(B,B.s.cloth,gold);
  // 겹 망토
  const cp=p.cape||1.5;B.poly([[-9*bw,-5,sh+2],[9*bw,-5,sh+2],[11*bw,-7-cp,1.5],[0,-9-cp*1.3,.5],[-11*bw,-7-cp,1.5]],'#2a0c0c',{grad:1,d:.1});
  // 불꽃 문양 자락
  for(let i=-2;i<=2;i++){const x=i*3.6*bw,y=4.6-Math.abs(i)*.3;const fl=Math.sin(t/180+i)*.6;B.poly([[x-1.4,y,2],[x,y+.2,6.5+fl+(i%2?0:1.5)],[x+1.4,y,2]],'rgba(255,120,40,.85)',{d:-.12});B.poly([[x-.6,y+.1,2],[x,y+.3,4.4+fl],[x+.6,y+.1,2]],'rgba(255,220,120,.9)',{d:-.13});}
  // 금장 견갑·흉갑
  pauldron(B,j.R,gold,bw,{rivet:'#fff0c0',s:.7});pauldron(B,j.L,gold,bw,{rivet:'#fff0c0',s:.7});
  B.poly([SF(B,-.8,sh+4,.6),SF(B,.8,sh+4,.6),SF(B,.5,sh-3,.8),SF(B,0,sh-6,.9),SF(B,-.5,sh-3,.8)],gold,{grad:1,edge:dg,ew:.6,d:-.06});
  B.ball(SF(B,0,sh,1.4),1.8,'#ff5020',{glow:fx,d:-.1});
  for(const g of[-1,1])B.line([SF(B,.25*g,sh+3,1),SF(B,.6*g,sh,1),SF(B,.3*g,sh-3,1)],dg,.5);
  B.cap(SF(B,-1.3,H+2.5,.6),SF(B,1.3,H+2.5,.6),2.6,dg,{d:-.05});B.ball(SF(B,0,H+2.5,1.1),1.4,gold,{d:-.08});
  bracer(B,j.R,gold,4.6*bw,{strap:dg});bracer(B,j.L,gold,4.6*bw,{strap:dg});
  // 두건 금테·관
  B.cap(HP(B,-.95,.45,.55),HP(B,0,.95,.75),hr*.18,gold,{d:-.12});B.cap(HP(B,.95,.45,.55),HP(B,0,.95,.75),hr*.18,gold,{d:-.12});B.ball(HP(B,0,.98,.78),hr*.16,'#ff6020',{glow:fx,d:-.14});
  // 뿔 장식
  for(const g of[-1,1]){B.cap(HP(B,.7*g,.1,.9),HP(B,1.2*g,-.2,1.8),hr*.24,'#2a1a14',{w1:hr*.14});B.cap(HP(B,1.2*g,-.2,1.8),HP(B,1.1*g,-.7,2.4),hr*.14,'#2a1a14',{w1:hr*.03});}
  staffHQ(B,'#3a1a10',gold,{wrap:dg});const{p:pp}=B.J;B.glow(A(pp.hR,pp.dS,16.5),3+Math.sin(t/120),fx,.5);}
}]);

// 검 보강
function swordHQ(B,o={}){const{p}=B.J,h=p.hR,d=p.dS,pt=k=>A(h,d,k),X=[1,0,0];const n=o.len||22;
  B.line([pt(3),pt(n-2.5)],o.fuller||'rgba(40,40,50,.7)',.5);B.line([A(pt(3),X,.55),A(pt(n-1),X,.2)],'rgba(255,255,255,.75)',.35);
  B.ball(pt(-4.2),1.4,o.guard||'#b08a3a',{d:-.05});for(const k of[-3,-1.8,-.6,.6])B.cap(pt(k-.25),pt(k+.25),2.3,o.wrap||'#2a1a10',{d:-.05});
  for(const g of[-1,1]){B.cap(A(pt(2),X,g*3.3),A(A(pt(3.2),X,g*4.4),[0,0,0]),1.1,o.guard||'#b08a3a',{w1:.4,d:-.06});}B.ball(pt(2),1.2,o.gem||'#c02020',{d:-.08,glow:o.glow});}
// 방패 보강
function shieldHQ(B,rimC,emb,o={}){const s=B.s,{p,bw}=B.J,c0=A(p.hL,[0,2.5,0]),u=N(1,.3,0),v=[0,0,1],fr=N(-.3,1,0),r=5*bw;const P=(a,rr,o2=.25)=>A(A(A(c0,u,Math.cos(a)*rr),v,Math.sin(a)*rr),fr,o2);
  const rim=[];for(let i=0;i<=16;i++)rim.push(P(i/16*Math.PI*2,r*.94,.2));B.line(rim,rimC,1.1);for(let i=0;i<8;i++)B.ball(P(i/8*Math.PI*2+.2,r*.8,.35),.45,'#e0d8c0',{d:-.6});
  if(emb==='cross'){B.cap(P(Math.PI/2,r*.7),P(-Math.PI/2,r*.7),1.4,o.ec||'#9a2020',{d:-.6});B.cap(P(0,r*.55),P(Math.PI,r*.55),1.4,o.ec||'#9a2020',{d:-.6});}
  if(emb==='skull'){B.ball(P(0,0,.4),1.8,'#d8d0bc',{d:-.6});for(const g of[-1,1])B.ball(A(P(0,0,.8),u,g*.7),.45,'#1a1010',{flat:1,d:-.62});}
  B.ball(P(0,0,.5),1.3,o.boss||rimC,{d:-.62});}

// ======================= 20. 세마 =======================
Q.push(['세마',{cloth:'#3e2e52',hood:'#2e2240',sleeve:'#372a4a',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,j=J(B),t=B.t,{mode,f}=B;const iv='#e8dcb0',sv='#c8ccd8',fx=B.s.fx;
  robeHQ(B,B.s.cloth,iv);
  // 겹 숄·두루마리
  B.poly([SF(B,-1.6,sh+5,.5),SF(B,-.5,sh+6.5,.5),SF(B,.5,sh+6.5,.5),SF(B,1.6,sh+5,.5),SF(B,1.3,sh-1,.8),SF(B,0,sh-4,1),SF(B,-1.3,sh-1,.8)],'#5a4a70',{grad:1,edge:iv,ew:.6,d:-.05});
  for(let i=-2;i<=2;i++)B.ball(SF(B,i*.3,sh-.6-Math.abs(i)*.6,1.1),.7,i?iv:'#ffe060',{glow:i?null:fx,d:-.08});
  B.cap(SF(B,-1.3,H+2,.6),SF(B,1.3,H+2,.6),2.2,iv,{d:-.05});B.cap(SF(B,-.2,H+2,1),A(SF(B,-.25,H+2,1.2),[0,.4,-9]),1.6,'#d8c070',{w1:1.2,d:-.07});B.cap(SF(B,.2,H+2,1),A(SF(B,.25,H+2,1.2),[0,.4,-7]),1.6,iv,{w1:1.2,d:-.07});
  // 성문 자수
  for(let i=0;i<3;i++){const z=12-i*4;B.line([[-1,5.2-i*.3,z],[0,5.4-i*.3,z+1.4],[1,5.2-i*.3,z]],'rgba(255,230,130,.85)',.45);}
  bracer(B,j.R,'#5a4a70',4.6*bw,{strap:iv});bracer(B,j.L,'#5a4a70',4.6*bw,{strap:iv});
  // 두건 테·뒤 후광
  B.cap(HP(B,-.95,.45,.55),HP(B,0,.95,.72),hr*.16,iv,{d:-.12});B.cap(HP(B,.95,.45,.55),HP(B,0,.95,.72),hr*.16,iv,{d:-.12});B.ball(HP(B,0,.98,.75),hr*.14,'#ffe060',{glow:fx,d:-.14});
  const hc=HP(B,0,-1.3,.4),R=hr*1.55;const ring=[];for(let i=0;i<=20;i++){const a=i/20*Math.PI*2;ring.push(A(hc,[Math.cos(a)*R,0,Math.sin(a)*R]));}B.line(ring,'rgba(255,230,120,.8)',.7);
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2+t/900;B.cap(A(hc,[Math.cos(a)*R*.95,0,Math.sin(a)*R*.95]),A(hc,[Math.cos(a)*R*1.25,0,Math.sin(a)*R*1.25]),.6,'#e8d070',{w1:.1});}
  // 떠도는 빛 구슬
  for(let i=0;i<3;i++){const a=t/700+i*2.1+f*.3;B.glow([Math.cos(a)*12,Math.sin(a)*8,H+10+Math.sin(a*2)*4],1.8,fx,.7);}
  staffHQ(B,'#4a3a2a',sv,{wrap:'#5a4a70',charm:'#ffe060'});const{p:pp}=B.J;const top=A(pp.hR,pp.dS,16);for(let i=0;i<6;i++){const a=i/6*Math.PI*2+t/400;B.cap(A(top,[Math.cos(a)*3,0,Math.sin(a)*3]),A(top,[Math.cos(a)*5,0,Math.sin(a)*5]),.5,'#fff0b0',{w1:.1,d:-.1});}}
}]);

// ======================= 23. 흑기사 =======================
Q.push(['흑기사',{armor:'#26262e',pants:'#1c1c22',pads:'#34343e',helm:'#2a2a32',boot:'#141418',sleeve:'#2a2a32',forearm:'#2c2c34',hand:'#24242a',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,j=J(B);const pl='#30303a',rd='#8a1818',gm='#a8a8b4';
  scales(B,H+2,sh+5.5,3,4,'#32323c',-1.25,1.25,1.7);scales(B,H+2,sh+4,3,3,'#2a2a32',2.0,4.3,1.2);
  // 붉은 휘장(앞자락)
  B.poly([SF(B,-.42,H+3,.9),SF(B,.42,H+3,.9),SF(B,.38,H-9,1.4),SF(B,0,H-11,1.5),SF(B,-.38,H-9,1.4)],rd,{grad:1,edge:'#3a0808',ew:.4,d:-.07});
  B.line([SF(B,0,H+1,1.2),SF(B,0,H-8,1.6)],'#d0a040',.5);B.line([SF(B,-.25,H-3,1.3),SF(B,.25,H-3,1.3)],'#d0a040',.5);
  B.poly([SF(B,-.35,sh+4,1),SF(B,.35,sh+4,1),SF(B,.3,sh-2,1.2),SF(B,0,sh-4,1.3),SF(B,-.3,sh-2,1.2)],'#3a3a46',{grad:1,edge:gm,ew:.4,d:-.09});
  B.cap(SF(B,-1.4,H+1.5,.6),SF(B,1.4,H+1.5,.6),2.6,'#1a1416',{d:-.05});B.ball(SF(B,0,H+1.5,1.2),1.3,'#9a8a5a',{d:-.1});
  // 목가리개
  B.cap([-5*bw,0,sh+5.5],[5*bw,0,sh+5.5],5,'#33333d',{d:-.02});B.cap([-5*bw,.5,sh+6.5],[5*bw,.5,sh+6.5],.6,gm,{d:-.05});
  pauldron(B,j.R,pl,bw,{rivet:gm,spike:'#9a9aa6',s:.9});pauldron(B,j.L,pl,bw,{rivet:gm,spike:'#9a9aa6',s:.9});
  for(const jj of[j.R,j.L]){B.cap(A(jj.sp,[jj.sg*3.6,.6,3]),A(jj.sp,[jj.sg*5,.6,-3]),.6,rd,{d:-.1});
    bracer(B,jj,'#34343e',5*bw,{strap:gm});B.ball(A(jj.h,[0,.4,.3]),2.6*bw,'#2e2e38',{d:-.04});for(let i=-1;i<=1;i++)B.ball(A(jj.h,[i*.9,1.6,.9]),.6,gm,{d:-.08});
    B.ball(jj.el,2.8*bw,'#3a3a46',{d:-.05});B.cap(A(jj.el,[0,0,0]),A(jj.el,[jj.sg*1.2,-1.5,1.5]),1.2,'#9a9aa6',{w1:.2,d:-.06});
    greave(B,jj,'#2c2c36',6.6*bw,{knee:'#3a3a46',strap:gm});B.cap(A(jj.kn,[0,1.6,.4]),A(jj.kn,[0,3,2]),1.1,'#9a9aa6',{w1:.2,d:-.1});B.ball(A(jj.fp,[0,1.6,.2]),2.6*bw,'#26262e',{sy:.7,d:-.04});}
  // 투구: 볏·바이저 숨구멍·뿔장식
  B.cap(HP(B,0,.95,.95),HP(B,0,1.04,-.6),hr*.14,'#4a4a56',{d:-.12});for(const g of[-1,1]){for(let i=0;i<3;i++)B.cap(HP(B,.25*g+.1*i*g,.98,-.3),HP(B,.25*g+.1*i*g,.98,-.55),hr*.06,'#0a0a0c',{d:-.12});}
  B.cap(HP(B,-.8,.75,.55),HP(B,.8,.75,.55),hr*.12,rd,{d:-.13});
  for(const g of[-1,1]){B.cap(HP(B,.85*g,0,.6),HP(B,1.5*g,-.2,1.1),hr*.28,'#1a1a20',{w1:hr*.18});B.cap(HP(B,1.5*g,-.2,1.1),HP(B,1.4*g,.3,1.9),hr*.18,'#1a1a20',{w1:hr*.04});}
  for(let i=0;i<4;i++)B.cap(HP(B,0,-.2-i*.4,1.1-i*.15),HP(B,0,-.6-i*.45,.2-i*.4),hr*(.32-i*.05),i%2?'#6a0808':'#8a1010',{w1:hr*.1,d:.02});
  swordHQ(B,{guard:'#6a6a78',gem:'#c01818',glow:'255,60,60'});shieldHQ(B,'#8a8a98','cross',{ec:'#9a1818',boss:'#6a6a78'});
  const{mode,f}=B;if(mode==='skill'||mode==='buff')B.glow(A(p.hR,p.dS,14),3+f,'255,60,60',.5);}
}]);

// ======================= 26. 해골궁수 =======================
// 해골 몸 보강(갈비뼈 곡선·쇄골·골반·척추 마디)
function boneHQ(B,bc='#e6dfcc'){const{p,H,sh,bw}=B.J,j=J(B),dk=T(bc,-.3);
  for(let i=0;i<5;i++){const z=H+1+i*(sh-H)/5;B.ball([0,-.6,z],1.25,i%2?bc:T(bc,-.08),{sy:.8,d:.02});}
  for(let i=0;i<4;i++){const z=sh-2-i*3.2,w=5.8-i*.5;for(const g of[-1,1]){B.cap([0,-.8,z+.3],[g*w,.2,z-.4],1.1,bc,{w1:1,d:.03});B.cap([g*w,.2,z-.4],[g*w*.45,2.6,z-1.2],1,bc,{w1:.8,d:-.12});}}
  B.cap([0,2.6,sh-1],[0,2.4,sh-10],1.6,T(bc,-.05),{w1:1,d:-.14});
  for(const g of[-1,1])B.cap([0,1.4,sh+1],[g*8.5*bw,.2,sh-.5],1.1,bc,{d:-.08});
  B.poly([[-5,1.6,H+2],[5,1.6,H+2],[3.2,2.4,H-2.6],[0,2.8,H-1],[-3.2,2.4,H-2.6]],T(bc,-.05),{grad:1,edge:dk,ew:.3,d:-.05});for(const g of[-1,1])B.ball([g*2.2,2.2,H-.5],1,'#2a2018',{flat:1,d:-.07});
  for(const jj of[j.R,j.L]){B.ball(jj.el,1.3,T(bc,.05),{d:-.04});B.cap(M(jj.el,jj.h,.1),M(jj.el,jj.h,.9),.7,dk,{d:-.03});for(let i=-1;i<=1;i++)B.cap(jj.h,A(jj.h,[i*.7,1.6,-.8]),.5,bc,{w1:.25,d:-.05});
    B.cap(M(jj.kn,jj.fp,.1),M(jj.kn,jj.fp,.9),.8,dk,{d:-.03});for(let i=-1;i<=1;i++)B.cap(A(jj.fp,[i*.8,1,-.8]),A(jj.fp,[i*.9,3.4,-1.2]),.6,bc,{w1:.35,d:-.06});}}
function skullHQ(B,eg){const{hr}=B.J;teeth(B,6,.98,-.62,.5,'#f0ead8',.18);B.cap(HP(B,-.45,.85,-.4),HP(B,.45,.85,-.4),hr*.06,'#2a2018',{d:-.07});
  for(const g of[-1,1]){B.ball(HP(B,.55*g,.72,-.18),hr*.2,'#d8d0ba',{d:-.04});B.ball(HP(B,.36*g,.82,.32),hr*.24,'#cfc6ae',{sy:.4,d:-.08});}
  B.line([HP(B,.2,.6,.95),HP(B,.35,.75,.6),HP(B,.28,.85,.45)],'#5a4a38',.4);B.ball(HP(B,0,.9,-.75),hr*.42,'#d6cfba',{sx:1.2,sy:.5,d:-.03});
  if(eg)for(const g of[-1,1])B.glow(HP(B,.36*g,.9,.08),1.6,eg,.55);}
Q.push(['해골궁수',{legW:3,armW:2.6,handR:1.5,pants:'#e6dfcc',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,j=J(B);
  boneHQ(B);skullHQ(B,'120,180,255');
  // 낡은 두건·허리천
  B.ball(HP(B,0,-.25,.25),hr*1.04,'#4a4438',{sy:.82,d:.06});B.poly([HP(B,-.9,-.2,.3),HP(B,.9,-.2,.3),HP(B,.8,-.9,-1.6),HP(B,0,-1.1,-2.4),HP(B,-.8,-.9,-1.6)],'#4a4438',{grad:1,d:.1});
  for(const y of[1,-1])B.poly([[-4.5,y*2.2,H+1.5],[4.5,y*2.2,H+1.5],[4,y*3.4,H-7],[1.5,y*3.6,H-5],[0,y*3.6,H-8.5],[-2,y*3.6,H-5.5],[-4,y*3.4,H-7.5]],'#5a5244',{grad:1,d:y>0?-.04:.04});
  B.cap([-5,0,H+1.5],[5,0,H+1.5],1.6,'#3a2a1a',{d:-.03});
  // 녹슨 한쪽 견갑
  pauldron(B,j.L,'#6a5040',bw,{rivet:'#a08060',s:.75});
  quiver(B,'#4a3a2a','#8a7a5a',{fl:'#3a3a3a'});
  bowHQ(B,'#d8d0bc','#a09070');arrowNock(B,'#6a5a40','#9aa0a8','#2a2a2a');}
}]);

// 너덜너덜한 천 자락(z 높이에서 아래로)
function tatters(B,z,len,col,n,a0,a1,o=.5,sway=0){for(let i=0;i<n;i++){const a=a0+(a1-a0)*(i+.5)/n,w=(a1-a0)/n;const L=len*(.6+.4*Math.abs(Math.sin(i*2.7)));const sw=Math.sin(B.t/300+i)*sway;const p0=SF(B,a-w*.5,z,o),p1=SF(B,a+w*.5,z,o),tip=A(SF(B,a+sw*.1,z-L,o+.6),[0,0,0]);B.poly([p0,p1,tip],i%2?col:T(col,-.15),{grad:1,d:-.02});}}

// ======================= 29. 좀비 =======================
Q.push(['좀비',{skin:'#7a8a62',cloth:'#5a4a3a',pants:'#3a3832',sleeve:'#7a8a62',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,j=J(B),t=B.t;const sk=B.s.skin,rot='#4a5a3a',bl='#5a1410';
  // 찢긴 셔츠 자락
  tatters(B,H+1,6,'#5a4a3a',9,-1.6,1.6,.4);tatters(B,H+1,5,'#4a3c2e',6,2,4.3,.4);
  // 찢어진 구멍 사이 드러난 갈비뼈
  B.ball(SF(B,.35,sh,.2),3.2,'#3a2a22',{flat:1,sx:1,sy:1.2,d:-.05});for(let i=0;i<3;i++)B.cap(SF(B,.1,sh+2-i*1.8,.7),SF(B,.6,sh+1.6-i*1.8,.7),.8,'#d8d0b4',{d:-.07});
  // 상처·꿰맨 자국·썩은 반점
  for(const[a,z,r]of[[-.6,sh+3,1.3],[1.2,H+3,1.1],[-2.6,sh,1.4],[2.8,sh+2,1.2]])B.ball(SF(B,a,z,.6),r,rot,{flat:1,sx:1.3,d:-.04});
  B.ball(SF(B,-.4,H+4,.6),1.1,bl,{flat:1,sx:1.4,d:-.05});B.line([SF(B,-.9,sh-2,.7),SF(B,-.3,sh-4,.7)],'#2a1a10',.4);for(let i=0;i<4;i++){const q=M(SF(B,-.9,sh-2,.7),SF(B,-.3,sh-4,.7),i/3);B.line([A(q,[-.4,0,-.5]),A(q,[.4,0,.5])],'#1a1008',.3);}
  for(const jj of[j.R,j.L]){B.ball(M(jj.el,jj.h,.4),1,rot,{flat:1,d:-.05});B.ball(jj.el,1.4,T(sk,-.2),{d:-.04});for(let i=-1;i<=1;i++)B.cap(A(jj.h,[i*.8,1.2,-.3]),A(jj.h,[i*1,3,-1.2]),.6,'#c8c09a',{w1:.15,d:-.06});
    B.cap(M(jj.sp,jj.el,.2),M(jj.sp,jj.el,.6),5*bw*1.05,'#5a4a3a',{w1:4.6*bw,d:-.02});
    tatters(B,0,0,'#000',0,0,0);B.poly([A(jj.kn,[-2.4,.6,-1]),A(jj.kn,[2.4,.6,-1]),A(jj.kn,[1.2,1.2,-4]),A(jj.kn,[-.4,1,-2.6]),A(jj.kn,[-1.8,1,-4.2])],'#2e2c28',{grad:1,d:-.04});B.ball(A(jj.kn,[0,1.6,0]),1.2,'#6a7a52',{d:-.06});}
  // 얼굴: 늘어진 턱·이빨·튀어나온 눈·머리카락 몇 가닥
  B.ball(HP(B,0,.72,-.7),hr*.48,T(sk,-.12),{sy:.7,d:-.05});B.ball(HP(B,0,.88,-.62),hr*.3,'#2a0a08',{flat:1,sx:1.3,sy:.7,d:-.08});teeth(B,4,.95,-.48,.4,'#c8c090',.15);
  B.ball(HP(B,.36,.86,.16),hr*.22,'#e8e4c0',{d:-.07});B.ball(HP(B,.36,.98,.16),hr*.09,'#802010',{flat:1,d:-.09});
  B.cap(HP(B,-.62,.74,.42),HP(B,-.1,.86,.3),hr*.2,T(sk,-.35),{w1:hr*.12,d:-.08});
  for(let i=0;i<5;i++)B.cap(HP(B,-.5+i*.25,-.1,.85),HP(B,-.7+i*.3,-.5,-.1+Math.sin(i)*.2),hr*.08,'#2a2418',{w1:hr*.03,d:.02});
  B.ball(HP(B,.2,-.2,.92),hr*.3,'#5a1a10',{flat:1,sx:1.4,sy:.6,d:-.02});
  // 파리
  for(let i=0;i<3;i++){const a=t/90+i*2.1;B.ball(HP(B,Math.cos(a)*1.6,Math.sin(a)*1.2,1+Math.sin(a*1.7)*.4),.35,'#101010',{flat:1,d:-.3});}}
}]);

// ======================= 32. 가스트 로드 =======================
Q.push(['가스트 로드',{cloth:'#26264a',armor:'#2a2a4e',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,j=J(B),t=B.t,{mode,f}=B;const fx=B.s.fx,cl='#26264a';
  // 아래로 흩날리는 누더기 자락
  for(let i=0;i<9;i++){const a=(i/9)*Math.PI*2,w=.36;const sw=Math.sin(t/260+i*1.3)*1.6;const z0=H+1,L=10+Math.abs(Math.sin(i*2.3))*6;const p0=SF(B,a-w,z0,.2),p1=SF(B,a+w,z0,.2);const tip=[Math.sin(a)*9+sw,Math.cos(a)*9-2+(mode==='run'?-4:0),z0-L];B.poly([p0,p1,tip],i%2?cl:T(cl,-.25),{grad:1,alpha:.85,d:.02});}
  // 망토 깃·후드
  B.poly([SF(B,-2.2,sh+7,.3),SF(B,-1.2,sh+10,.2),SF(B,0,sh+11,.2),SF(B,1.2,sh+10,.2),SF(B,2.2,sh+7,.3),SF(B,1.6,sh,.6),SF(B,-1.6,sh,.6)],'#1a1a36',{grad:1,d:.1});
  B.ball(HP(B,0,-.35,.25),hr*1.25,'#1c1c3a',{sy:.9,d:.12});B.poly([HP(B,-1.1,-.1,.6),HP(B,0,.3,1.45),HP(B,1.1,-.1,.6),HP(B,0,-1,1.6)],'#22224a',{grad:1,d:.08});
  // 갈비 흉갑·사슬
  for(let i=0;i<4;i++){const z=sh+3-i*2.6;for(const g of[-1,1])B.cap(SF(B,0,z,.6),SF(B,g*1.2,z-1.2,.6),1,'#c8d0d8',{w1:.6,d:-.06});}B.cap(SF(B,0,sh+4,.7),SF(B,0,sh-7,.7),1.4,'#b0b8c8',{d:-.07});
  const ch=[];for(let i=0;i<=8;i++){const a=-1.5+i*3/8;ch.push(SF(B,a,H+4-Math.sin(i/8*Math.PI)*3,.9));}ch.forEach((q,i)=>B.ball(q,.7,i%2?'#7a7a90':'#9a9ab0',{sy:.6,d:-.06}));
  // 왕관 가시
  for(let i=-2;i<=2;i++)B.cap(HP(B,i*.32,.1,.75),HP(B,i*.4,0,1.45+(i%2?0:.35)),hr*.14,'#7a60d0',{w1:hr*.03,d:-.05});B.cap(HP(B,-.9,.2,.65),HP(B,.9,.2,.65),hr*.16,'#5a48a0',{d:-.04});B.ball(HP(B,0,.85,.75),hr*.16,'#c0a0ff',{glow:fx,d:-.1});
  skullHQ(B,fx);
  for(const jj of[j.R,j.L]){B.cap(M(jj.sp,jj.el,0),M(jj.el,jj.h,.4),5.6*bw,'#20203e',{w1:6.5*bw,alpha:.9,d:.03});for(let i=-1;i<=1;i++)B.cap(jj.h,A(jj.h,[i*.8,2,-.6]),.55,'#c8d0d8',{w1:.2,d:-.05});}
  // 큰 낫
  const h=p.hR,d=p.dS,pt=k=>A(h,d,k),X=[1,0,0],Z=[0,0,1];const a=pt(16);const bl=[];for(let i=0;i<=8;i++){const u=i/8;bl.push(A(A(a,X,-u*16),Z,-Math.sin(u*Math.PI*.9)*2-u*u*7));}
  const inner=bl.slice().reverse().map((q,i)=>A(q,Z,2.6*(1-(8-i)/8)+.2));B.poly([...bl,...inner],'#a8b0c0',{grad:1,edge:'#40405a',ew:.4,d:-.05});B.line(bl,'rgba(220,230,255,.9)',.5);
  B.ball(a,1.6,'#d8d0bc',{d:-.07});for(const g of[-1,1])B.ball(A(A(a,[0,.6,0]),X,g*.6),.4,'#401060',{flat:1,glow:fx,d:-.09});for(const k of[-10,-6,0,4])B.cap(pt(k-.3),pt(k+.3),1.7,'#5a48a0',{d:-.04});
  if(mode==='attack'||mode==='skill')B.glow(A(a,X,-8),4,fx,.4);
  for(let i=0;i<4;i++){const ph=((t/900)+i/4)%1;B.glow([Math.sin(i*2.1)*6,-2,H-12+ph*10],2.2*(1-ph),fx,(1-ph)*.5);}}
}]);

// ======================= 35. 오우거 =======================
Q.push(['오우거',{skin:'#a8805c',cloth:'#9c7656',sleeve:'#a8805c',pants:'#3a2c1e',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,j=J(B);const sk=B.s.skin,dk=T(sk,-.25);
  // 근육 음영·사마귀·흉터·혈관
  for(const g of[-1,1])B.line([SF(B,g*.15,sh+5,.5),SF(B,g*.9,sh+1,.5),SF(B,g*1.3,sh+4,.5)],dk,.6);B.line([SF(B,-.2,sh-2,.6),SF(B,0,sh-1,.6),SF(B,.2,sh-2,.6)],dk,.6);
  for(const[a,z]of[[-.9,sh+4],[.7,sh-1],[1.1,H+6],[-1.3,H+3],[2.6,sh+3]])B.ball(SF(B,a,z,.4),.8,T(sk,-.15),{d:-.05});
  B.line([SF(B,-.9,sh+5,.6),SF(B,-.2,sh+1,.6)],'#5a2a20',.7);B.line([SF(B,-.9,sh+5,.6),SF(B,-.2,sh+1,.6)],'rgba(255,200,180,.4)',.25);
  // 어깨끈·해골 장식 허리띠·털 허리가리개
  strap(B,SF(B,1.2,sh+6,.6),SF(B,-1,H+2,.6),'#3a2414',2.2,'#8a7a5a');strap(B,SF(B,4,sh+5,.6),SF(B,1.2,sh+6,.6),'#3a2414',2.2);
  B.cap(SF(B,-1.5,H+2,.7),SF(B,1.5,H+2,.7),3.4,'#3a2414',{d:-.04});
  for(const a of[-.7,0,.7]){const c=SF(B,a,H+2,1.6);B.ball(c,1.6,'#e0d8c0',{d:-.08});for(const g of[-1,1])B.ball(A(c,[g*.6,.9,.2]),.45,'#1a1010',{flat:1,d:-.1});}
  fur(B,[SF(B,-1.3,H+.5,.6),SF(B,-.8,H,.8),SF(B,-.3,H,.9),SF(B,.3,H,.9),SF(B,.8,H,.8),SF(B,1.3,H+.5,.6),SF(B,2.4,H,.6),SF(B,-2.4,H,.6),SF(B,3.14,H,.6)],'#6a5038',6,1.8,2);
  // 팔찌·손목 가죽
  for(const jj of[j.R,j.L]){bracer(B,jj,'#4a3020',6*bw,{strap:'#8a7a5a'});greave(B,jj,'#4a3424',6.2*bw,{knee:T(sk,-.05),strap:'#2a1a0a'});}
  // 얼굴: 큰 눈두덩·엄니·코고리·상투
  brow(B,dk,.84,.42,.7);B.cap(HP(B,0,.95,.15),HP(B,0,1.12,-.15),hr*.3,T(sk,-.08),{w1:hr*.36,d:-.08});B.ball(HP(B,0,1.15,-.3),hr*.14,'#c8b060',{d:-.1});
  for(const g of[-1,1])B.cap(HP(B,.34*g,.92,-.6),HP(B,.42*g,1.05,.0),hr*.18,'#efe6cc',{w1:hr*.05,d:-.1});teeth(B,4,.96,-.5,.4,'#d8ccaa',.12);
  B.ball(HP(B,0,-.4,.85),hr*.4,'#2a1a10',{d:.03});B.cap(HP(B,0,-.4,1),HP(B,0,-.7,1.6),hr*.3,'#2a1a10',{w1:hr*.18});B.cap(HP(B,0,-.4,1.05),HP(B,0,-.42,1.2),hr*.42,'#8a6a3a');
  for(const g of[-1,1])B.ball(HP(B,1.35*g,-.2,.15),.6,'#c8b060',{d:-.04});
  // 못 박힌 몽둥이
  const h=p.hR,d=p.dS,pt=k=>A(h,d,k),u=PERP(d),v=N(...CR(d,u));for(let i=0;i<10;i++){const k=9+(i%5)*1.8,a=i*2.4;const r=[u[0]*Math.cos(a)+v[0]*Math.sin(a),u[1]*Math.cos(a)+v[1]*Math.sin(a),u[2]*Math.cos(a)+v[2]*Math.sin(a)];const w=1.6+(k-3)/14*1.6;B.cap(A(pt(k),r,w*.9),A(pt(k),r,w+1.8),.7,'#8a8e94',{w1:.15,d:-.05});}
  B.cap(pt(13),pt(14),5.2,'#3a3a40',{d:-.05});for(const k of[-2,-.8,.4])B.cap(pt(k-.3),pt(k+.3),2.8,'#3a2414',{d:-.05});
  for(let i=0;i<3;i++)B.line([pt(4+i*3),A(pt(5.5+i*3),u,.6)],'rgba(30,20,10,.6)',.4);}
}]);

// 날개 뼈대·막 무늬(biped wings)
function wingHQ(B,bone,o={}){const s=B.s,{mode,f,t}=B,{H,sh,bw}=B.J;const fl=Math.sin(f*1.6+(mode==='run'?1:0)+t/250)*4+(mode==='buff'?6:0);
  for(const sg of[-1,1]){const r0=[5*sg*bw,-3,sh-2],a=[18*sg*bw,-8,sh+8+fl],b=[24*sg*bw,-10,sh-2+fl],c=[16*sg*bw,-7,H-2+fl*.5],e=[8*sg*bw,-4,H+2];
    B.cap(r0,a,1.8,bone,{w1:1.1,d:.45});B.cap(a,b,1.1,bone,{w1:.5,d:.45});B.cap(a,c,.8,bone,{w1:.4,d:.45});B.cap(a,e,.7,bone,{w1:.3,d:.45});B.cap(a,A(a,[sg*1,-.5,2.6]),1,o.claw||'#d8d0c0',{w1:.15,d:.44});
    if(o.vein)B.line([M(r0,a,.5),M(a,c,.5),M(c,e,.6)],o.vein,.35);}}

// ======================= 38. 베레스 =======================
Q.push(['베레스',{armor:'#2e1414',pants:'#200c0c',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,j=J(B),t=B.t,{mode,f}=B;const pl='#3a1a18',em='255,110,40',gold='#c89a38';
  wingHQ(B,'#2a1010',{vein:'rgba(255,90,40,.5)'});
  scales(B,H+2,sh+5.5,4,5,'#3a1616',-1.25,1.25,1.2);scales(B,H+2,sh+4,3,3,'#2e1212',2.0,4.3,1.2);
  // 용암 균열
  const pu=.5+.3*Math.sin(t/220);for(const g of[-1,1]){const cr=[SF(B,g*.15,sh+5,1),SF(B,g*.5,sh+2,1),SF(B,g*.3,sh-1,1),SF(B,g*.7,H+3,1)];B.line(cr,'rgba(255,140,50,'+pu+')',.6);}
  B.ball(SF(B,0,sh+1,1.4),2.2,'#ff6020',{glow:em,d:-.1});B.poly([SF(B,-.3,sh+4,1.2),SF(B,.3,sh+4,1.2),SF(B,.22,sh-2,1.3),SF(B,-.22,sh-2,1.3)].reverse(),gold,{alpha:.0,d:-.09});
  B.cap(SF(B,-1.4,H+1.5,.6),SF(B,1.4,H+1.5,.6),2.8,'#1a0a0a',{d:-.05});B.ball(SF(B,0,H+1.5,1.2),1.7,gold,{d:-.1});for(const g of[-1,1])B.ball(A(SF(B,0,H+1.5,1.8),[g*.6,0,.3]),.4,'#ff5020',{flat:1,glow:em,d:-.12});
  for(const a of[-.55,0,.55])B.poly([SF(B,a-.24,H,.7),SF(B,a+.24,H,.7),SF(B,a+.18,H-8,1),SF(B,a,H-9.5,1.1),SF(B,a-.18,H-8,1)],a?'#2a1010':'#4a1a14',{grad:1,edge:gold,ew:.3,d:-.05});
  for(const jj of[j.R,j.L]){pauldron(B,jj,pl,bw,{rivet:gold,spike:'#1a1010',s:.85});B.cap(A(jj.sp,[jj.sg*2.4,-1,3]),A(jj.sp,[jj.sg*5,-2.5,8]),1.4,'#1a1010',{w1:.2,d:-.1});
    bracer(B,jj,'#2a1212',5*bw,{strap:gold});for(let i=0;i<3;i++)B.cap(M(jj.el,jj.h,.3+i*.2),A(M(jj.el,jj.h,.3+i*.2),[jj.sg*2,-1,.6]),.8,'#1a0a0a',{w1:.1,d:-.06});
    for(let i=-1;i<=1;i++)B.cap(A(jj.h,[i*.9,1.4,-.2]),A(jj.h,[i*1.1,3.4,-1.2]),.7,'#e8dcc0',{w1:.15,d:-.06});
    greave(B,jj,'#2a1212',6.4*bw,{knee:pl,strap:'#140808'});B.cap(A(jj.kn,[0,1.4,.6]),A(jj.kn,[0,3.4,2.4]),1.2,'#1a1010',{w1:.2,d:-.1});}
  // 얼굴: 눈두덩·송곳니·뿔 마디
  const sk=B.s.skin;brow(B,T(sk,-.4),.95,.4,.6);teeth(B,5,1.75,-.5,.4,'#f0e6cc',.2);for(const g of[-1,1])B.cap(HP(B,.3*g,1.5,-.45),HP(B,.32*g,1.55,-.95),hr*.12,'#f0e6cc',{w1:hr*.03,d:-.12});
  for(const g of[-1,1])for(let i=0;i<4;i++){const q=M(HP(B,.5*g,-.1,.8),HP(B,1.3*g,-.6,1.5),i/4);B.cap(A(q,[0,0,-.3]),A(q,[0,0,.3]),hr*.44,'#3a2a24',{d:-.03});}
  // 꼬리 스페이드
  const c2=[0,-18,H+3];B.poly([A(c2,[0,1,-1]),A(c2,[2.6,-1.2,0]),A(c2,[0,-4,.6]),A(c2,[-2.6,-1.2,0])],'#4a1414',{grad:1,edge:'#1a0606',ew:.4});
  for(let i=0;i<4;i++){const q=M([0,-4,H+2],[0,-12,H-2+Math.sin(t/300+f)*2],i/4);B.cap(A(q,[0,0,1.2]),A(q,[0,-1,2.8]),.9,'#1a0a0a',{w1:.1});}
  // 불꽃 검
  swordHQ(B,{guard:'#2a1010',gem:'#ff6020',glow:em,fuller:'rgba(255,240,180,.8)'});const h=p.hR,d=p.dS;for(let i=0;i<5;i++){const k=5+i*4;B.glow(A(A(h,d,k),[0,0,1],Math.sin(t/90+i)*.8),2.2+Math.sin(t/120+i)*.6,em,.45);}
  if(mode==='skill'&&f===2)B.ring(20,em,.5);}
}]);

// ---------- 네 발 짐승 관절(plan quad와 같은 계산) ----------
function QJ(B){const s=B.s,{mode,f,t}=B,run=mode==='run',walk=mode==='walk'||run;const h=s.h||14,L=s.len||12,bw=s.bulk||1;
  const ph=f*Math.PI/2+(run?Math.PI/4:0);let lunge=0,headUp=0,jaw=0;if(mode==='attack'){lunge=[-2,6,2][f];jaw=[0,1,.2][f];}if(mode==='buff'){headUp=[.4,.9,.9,.5][f];jaw=[.3,.8,.8,.3][f];}if(mode==='skill'){lunge=[-4,2,9,3][f];jaw=[0,.4,1,.2][f];}
  const ny=lunge,front=[0,L*.5+ny,h+1];const legs=[];const lp=[[-1,1],[1,1],[-1,-1],[1,-1],[-1,0],[1,0]].slice(0,s.legs||4);
  lp.forEach(([sx,sy],i)=>{const diag=(i%2===0)===(sy>0);const sw=walk?Math.cos(ph+(run?(sy>0?0:Math.PI*.6):(diag?0:Math.PI))):0,lift=walk?Math.max(0,Math.sin(ph+(diag?0:Math.PI)))*(run?4:2.5):0;
    const top=[sx*4*bw*(s.wideLegs||1),sy*L*.42+ny*(sy>0?1:.5),h-1],ft=[sx*4.6*bw*(s.wideLegs||1),sy*L*.42+ny*(sy>0?1:.5)+sw*(run?5:3.2),lift],kn=[top[0]*1.05,(top[1]+ft[1])/2+(sy>0?-1.5:1.5),(h+lift)/2];legs.push({sx,sy,top,kn,ft});});
  const heads=[];const n=s.heads||1;for(let hi=0;hi<n;hi++){const off=n>1?(hi-(n-1)/2)*5*bw:0,ang2=n>1?(hi-(n-1)/2)*.35:0;const neck=[off*.5,front[1]+2,h+3+headUp*3],hd=[off,front[1]+4+(s.neckL||2)-headUp*2,h+5+headUp*7+(s.headZ||0)];
    const r=(s.headR||4.3)*bw,fwd=N(Math.sin(ang2),Math.cos(ang2)*(1-headUp*.3),headUp*.6);const sn=s.snout??1.6,tip=A(A(hd,fwd,r*(1+sn)),[0,0,-r*.25]);const sd=N(Math.cos(ang2),-Math.sin(ang2),0);heads.push({neck,hd,r,fwd,tip,sn,sd,ang2});}
  const tail=[];let a=[0,-L*.6+ny*.5,h+2];tail.push(a);for(let i=1;i<=(s.tailN||3);i++){a=[Math.sin(t/300+i+f)*1.5*i*.5,-L*.6-i*(s.tailL||4),h+2+(s.tailUp||1.5)*i-(s.tailDrop||0)*i*i];tail.push(a);}
  return{h,L,bw,ny,R:(s.bodyR||6)*bw,legs,heads,tail,jaw,headUp,walk,run,front};}
// 털 가닥(몸통 등선·옆구리)
function quadFur(B,q,col,dark,n=14,o={}){const{h,L,ny,R}=q;for(let i=0;i<n;i++){const u=i/(n-1),y=-L*.5+ny*.5+(L*.95+ny*.5)*u;for(let k=0;k<5;k++){const ang=(k-2)*.55+Math.sin(i*3.7+k)*.15;const base=[Math.sin(ang)*R*.97,y+Math.sin(i*1.3+k*2.1)*.6,h+1+Math.cos(ang)*R*.97];const tipp=A(base,[Math.sin(ang)*.9,-1.6-(o.len||0)-Math.abs(Math.sin(i+k))*.8,Math.cos(ang)*.4-.4]);B.cap(base,tipp,o.w||1.3,(i*3+k)%3===0?dark:(i+k)%2?col:T(col,-.06),{w1:.2,d:-.02});}}}
// 송곳니·코·눈두덩(quad 머리)
function quadFace(B,hh,jaw,o={}){const{hd,r,fwd,tip,sd}=hh;const up=[0,0,1];
  B.ball(A(tip,[0,0,.1]),r*.3,'#0e0a0a',{d:-.08});B.ball(A(A(tip,fwd,-.3),[0,0,r*.25]),r*.12,'#3a3030',{flat:1,d:-.09});
  for(const g of[-1,1]){B.cap(A(A(A(hd,fwd,r*.55),sd,g*r*.52),up,r*.55),A(A(A(hd,fwd,r*.9),sd,g*r*.3),up,r*.45),r*.22,o.brow||'#2a2a2a',{w1:r*.12,d:-.07});
    const fb=A(A(A(tip,fwd,-r*.35),sd,g*r*.3),up,-r*.25);B.cap(fb,A(fb,up,-r*(.28+jaw*.3)),r*.12,'#f0e8d4',{w1:r*.03,d:-.1});}
  if(jaw>.3){for(let i=0;i<4;i++){const q=A(A(A(tip,fwd,-r*(.4+i*.25)),up,-r*.55-jaw*r*.4),sd,(i%2?1:-1)*r*.25);B.cap(q,A(q,up,r*.3),r*.08,'#f0e8d4',{w1:r*.02,d:-.11});}B.ball(A(A(tip,fwd,-r*.6),up,-r*.5-jaw*r*.2),r*.25,'#6a1a1a',{flat:1,sx:1.3,d:-.08});}}

// ======================= 41. 늑대 =======================
Q.push(['늑대',{skin:'#6e6e74',chest:'#a4a4aa',tailc:'#5e5e64',legC:'#64646a',paw:'#3a3a3e',earC:'#5a5a60',
 detail(B,K){const q=QJ(B);const sk=B.s.skin,dk='#46464c',lt='#9a9aa2';
  quadFur(B,q,T(sk,.06),T(sk,-.18),11);
  const hh=q.heads[0];for(let i=0;i<9;i++){const a=(i/8-.5)*2.6;const base=A(hh.neck,[Math.sin(a)*3.4*q.bw,-.5,Math.cos(a)*3*q.bw]);B.cap(base,A(base,[Math.sin(a)*1.6,-2.6,Math.cos(a)*.8-.8]),2,i%2?lt:sk,{w1:.3,d:-.05});}
  // 가슴 흰털
  for(let i=0;i<5;i++){const b=[(i-2)*1.2*q.bw,q.L*.48+q.ny+1.5,q.h-1+Math.abs(i-2)*.4];B.cap(b,A(b,[0,.6,-2.6]),1.6,lt,{w1:.3,d:-.06});}
  // 다리 발톱·관절
  for(const lg of q.legs){for(let i=-1;i<=1;i++)B.cap(A(lg.ft,[i*.6,.8,.2]),A(lg.ft,[i*.7,1.9,-.1]),.45,'#e0d8c8',{w1:.1,d:-.06});B.cap(lg.kn,A(lg.kn,[0,lg.sy>0?-1.6:1.6,-1]),1.4,dk,{w1:.3,d:-.04});}
  // 덥수룩한 꼬리
  for(let i=1;i<q.tail.length;i++){const a=q.tail[i-1],b=q.tail[i];B.cap(a,b,(3.4-i*.5)*q.bw,T(sk,-.05),{w1:(3-i*.6)*q.bw,d:-.02});for(let k=0;k<4;k++){const c=M(a,b,k/4);B.cap(c,A(c,[Math.sin(k*2+i)*1.2,-1.8,Math.cos(k*3)*.8]),1.1,(k+i)%2?T(sk,-.2):T(sk,.1),{w1:.2,d:-.03});}}{const e=q.tail[q.tail.length-1];B.cap(e,A(e,[0,-1.8,.4]),1.4*q.bw,lt,{w1:.3,d:-.03});}
  quadFace(B,hh,q.jaw,{brow:dk});for(const g of[-1,1])B.ball(A(A(hh.hd,hh.sd,g*hh.r*.75),[0,0,-hh.r*.2]),hh.r*.4,lt,{sy:.8,d:-.02});}
}]);

// ======================= 44. 켈베로스 =======================
Q.push(['켈베로스',{skin:'#3a2420',chest:'#4a2a24',mane:'#2a1810',
 detail(B,K){const q=QJ(B),t=B.t,{mode,f}=B;const sk=B.s.skin,dk='#1e100c',em='255,110,40';
  quadFur(B,q,T(sk,.08),dk,14,{len:.6});
  // 등 가시·용암 균열
  for(let i=0;i<6;i++){const y=-q.L*.45+q.ny*.5+i*q.L*.17;const b=[0,y,q.h+1+q.R*.9];B.cap(b,A(b,[0,-1.4,3.4]),1.8,'#1a0e0a',{w1:.2,d:-.06});}
  const pu=.5+.3*Math.sin(t/200);for(const g of[-1,1])B.line([[g*q.R*.8,-q.L*.4,q.h+2],[g*q.R*.9,0,q.h+3],[g*q.R*.8,q.L*.4+q.ny,q.h+2]],'rgba(255,120,40,'+pu+')',.6);
  // 가시 목줄(각 머리)
  for(const hh of q.heads){const nc=M(hh.neck,hh.hd,.3);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;const r2=[Math.cos(a)*3.2*q.bw,Math.sin(a)*1.2,Math.sin(a)*2.8*q.bw];B.ball(A(nc,r2),.9,'#3a3a40',{d:-.05});if(i%2)B.cap(A(nc,r2),A(nc,[r2[0]*1.6,r2[1]*1.6,r2[2]*1.6]),.8,'#9a9aa6',{w1:.1,d:-.06});}
    quadFace(B,hh,Math.max(q.jaw,.35),{brow:dk});for(const g of[-1,1])B.cap(A(A(hh.hd,hh.sd,g*hh.r*.4),[0,-hh.r*.3,hh.r*.7]),A(A(hh.hd,hh.sd,g*hh.r*.7),[0,-hh.r*1.2,hh.r*1.4]),hh.r*.22,'#2a1a14',{w1:hh.r*.04});
    B.glow(A(A(hh.tip,hh.fwd,.5),[0,0,-hh.r*.5]),1.6+Math.sin(t/150)*.5,em,.55);}
  // 갈기 털
  for(let i=0;i<10;i++){const a=(i/9-.5)*3;const base=[Math.sin(a)*q.R*.9,q.L*.35+q.ny,q.h+1+Math.cos(a)*q.R*.9];B.cap(base,A(base,[Math.sin(a)*1.4,-3.4,Math.cos(a)*1.2]),2.2,i%2?'#2a1810':'#40261a',{w1:.3,d:-.05});}
  for(const lg of q.legs)for(let i=-1;i<=1;i++)B.cap(A(lg.ft,[i*.7,.8,.2]),A(lg.ft,[i*.8,2.2,-.1]),.55,'#d8ccb0',{w1:.1,d:-.06});
  const tl=q.tail[q.tail.length-1];B.glow(tl,2.4+Math.sin(t/120),em,.6);B.cap(tl,A(tl,[0,-2,1.6]),1.6,'#1a0e0a',{w1:.2});}
}]);

// ======================= 47. 드레이크 =======================
Q.push(['드레이크',{skin:'#6a2626',chest:'#c48a50',
 detail(B,K){const q=QJ(B),t=B.t,{mode,f}=B,s=B.s;const sk=s.skin,dk=T(sk,-.35),bel=s.chest,em='255,140,40';
  // 등 비늘(줄지어 겹친 판)
  for(let i=0;i<9;i++){const y=-q.L*.5+q.ny*.5+i*(q.L*.95+q.ny*.5)/8;for(let k=-2;k<=2;k++){const a=k*.42+(i%2?.21:0);if(Math.abs(a)>1)continue;B.ball([Math.sin(a)*q.R*.97,y,q.h+1+Math.cos(a)*q.R*.97],1.05*q.bw,(i+k)%2?T(sk,-.12):T(sk,-.22),{flat:1,sx:1.2,sy:.5,d:-.03});}}
  // 배 판
  for(let i=0;i<6;i++){const y=-q.L*.3+i*q.L*.15+q.ny*.6;B.cap([-q.R*.55,y,q.h+1-q.R*.75],[q.R*.55,y,q.h+1-q.R*.75],1.6,i%2?bel:T(bel,-.12),{d:-.02});}
  // 날개 뼈대
  const fl=Math.sin(f*1.6+t/250)*5+(mode==='buff'?8:0)+(mode==='run'?4:0);for(const g of[-1,1]){const bw=q.bw,ny=q.ny,L=q.L,h=q.h;const r0=[3*g,L*.1+ny,h+5],a=[18*g*bw,L*.1+ny-2,h+14+fl],b=[26*g*bw,ny-6,h+6+fl],c=[14*g*bw,-L*.3,h+3+fl*.4],e=[3*g,-L*.2,h+4];
    B.cap(r0,a,2.2,dk,{w1:1.3,d:.38});B.cap(a,b,1.3,dk,{w1:.5,d:.38});B.cap(a,c,1,dk,{w1:.4,d:.38});B.cap(a,M(e,c),.9,dk,{w1:.3,d:.38});B.cap(a,A(a,[g*1.2,1,2.4]),1.2,'#e0d0b0',{w1:.15,d:.37});
    B.line([M(r0,a,.6),M(a,c,.5),M(c,e,.5)],'rgba(255,120,60,.35)',.4);}
  // 가시 강화
  for(let i=0;i<5;i++){const y=-q.L*.4+i*q.L*.2,z=q.h+1+q.R;B.poly([[0,y+1.4,z-.4],[0,y-1.2,z+4.4-i*.3],[0,y-2,z-.4]],s.spines||'#e0c080',{grad:1,edge:T(s.spines||'#e0c080',-.5),ew:.3,d:-.05});}
  // 꼬리 끝 가시·꼬리 비늘
  for(let i=1;i<q.tail.length;i++){const a=q.tail[i];B.cap(A(a,[0,0,1]),A(a,[0,-1,2.8-i*.3]),1,'#e0c080',{w1:.15,d:-.04});}
  {const e=q.tail[q.tail.length-1],e0=q.tail[q.tail.length-2],dd=DIR(e0,e);B.poly([A(e,[2.2,0,0]),A(e,dd,3.6),A(e,[-2.2,0,0])],dk,{grad:1,d:-.03});}
  // 머리: 뿔 마디·이빨·눈두덩·턱 가시
  for(const hh of q.heads){const up=[0,0,1];for(const g of[-1,1]){for(let i=0;i<4;i++){const c=M(A(hh.hd,[g*hh.r*.4,-hh.r*.3,hh.r*.6]),A(hh.hd,[g*hh.r*.9,-hh.r*1.6,hh.r*1.4]),i/4);B.cap(A(c,[0,.2,-.2]),A(c,[0,-.2,.25]),hh.r*.36-i*.15,'#c8b898',{d:-.05});}
      B.cap(A(A(hh.hd,hh.sd,g*hh.r*.8),up,-hh.r*.3),A(A(hh.hd,hh.sd,g*hh.r*1.3),[0,-hh.r*.8,-hh.r*.4]),hh.r*.2,'#c8b898',{w1:hh.r*.03,d:-.04});}
    quadFace(B,hh,q.jaw,{brow:dk});if(mode==='skill'||(mode==='buff'))B.glow(A(hh.tip,[0,0,-hh.r*.4]),2+f*.5,em,.5);}
  for(const lg of q.legs){for(let i=-1;i<=1;i++)B.cap(A(lg.ft,[i*.8,.8,.3]),A(lg.ft,[i*1,2.6,-.1]),.7,'#e0d0b0',{w1:.12,d:-.06});B.ball(lg.kn,1.6*q.bw,T(sk,-.1),{d:-.03});}}
}]);

// ---------- 벌레 관절(plan bug와 같은 계산) ----------
function BJ(B){const s=B.s,{mode,f,t}=B,run=mode==='run',walk=mode==='walk'||run,bw=s.bulk||1,h=s.h||6;const ph=f*Math.PI/2+(run?Math.PI/4:0);let rear=0,lunge=0,snap=0;
  if(mode==='attack'){lunge=[-1,4,1][f];snap=[0,1,.3][f];}if(mode==='buff'){rear=[.4,.9,.9,.5][f];}if(mode==='skill'){rear=[.3,.6,.2,0][f];lunge=[-2,0,5,1][f];}
  const segs=s.segs||[[0,-8,1.2,6],[0,0,1,4.4],[0,5,1,3.6]];const nl=s.legs||6,spread=s.spread||10;const legs=[];
  for(let i=0;i<nl;i++){const sg=i%2?1:-1,row=Math.floor(i/2),rows=nl/2,yb=(s.legY0??2)-row*(s.legStep||2.2)+lunge,tri=(row%2===0)===(sg>0);const sw=walk?Math.cos(ph+(tri?0:Math.PI))*(run?3.2:2.2):0,lift=walk?Math.max(0,Math.sin(ph+(tri?0:Math.PI)))*(run?2.5:1.6):0;
    legs.push({sg,row,root:[sg*2.5*bw,yb,h],knee:[sg*(spread*.6)*bw,yb+(row-(rows-1)/2)*2+sw*.5,h+(s.knee||5)],ft:[sg*spread*bw,yb+(row-(rows-1)/2)*4.5+sw,lift]});}
  const sp=segs.map(([x,y,z,r],i)=>({p:[x*bw,y+lunge*(i===segs.length-1?1:.4),h+z+(i===segs.length-1?rear*5:rear*2*(i/segs.length))],r:r*bw}));
  const hd=segs[segs.length-1];const hp=[0,hd[1]+lunge,h+hd[2]+rear*5],hr=hd[3]*bw;return{bw,h,legs,sp,hp,hr,snap,rear,lunge,walk,ph};}

// ======================= 50. 셸로브 =======================
Q.push(['셸로브',{skin:'#262222',abd:'#342a2a',legC:'#2a2424',
 detail(B,K){const q=BJ(B),t=B.t,{mode,f}=B;const sk=B.s.skin;const ab=q.sp[0],ce=q.sp[1];
  // 다리 마디·털·발톱
  for(const lg of q.legs){B.ball(lg.knee,1.3*q.bw,T(sk,.1),{d:-.03});for(const u of[.3,.55,.8]){const c=M(lg.knee,lg.ft,u);B.cap(c,A(c,[lg.sg*.6,0,.9]),.4,'#4a4040',{w1:.1,d:-.04});B.cap(c,A(c,[lg.sg*-.4,-.3,.8]),.35,'#3a3030',{w1:.1,d:-.04});}
    for(const u of[.3,.7]){const c=M(lg.root,lg.knee,u);B.cap(c,A(c,[0,0,1.1]),.4,'#4a4040',{w1:.1,d:-.04});}
    B.cap(M(lg.knee,lg.ft,.15),M(lg.knee,lg.ft,.2),2,'#6a2020',{d:-.04});B.cap(lg.ft,A(lg.ft,[lg.sg*.4,.6,-.3]),.6,'#0a0808',{w1:.1,d:-.05});}
  // 배 무늬: 해골 모양 붉은 문양 + 털 + 광택
  const top=A(ab.p,[0,0,ab.r*.72]);B.ball(A(top,[0,.6,.1]),ab.r*.42,'#8a1818',{flat:1,sy:.55,d:-.12});for(const g of[-1,1])B.ball(A(top,[g*ab.r*.18,ab.r*.25,.2]),ab.r*.1,'#120808',{flat:1,d:-.13});B.cap(A(top,[0,-ab.r*.25,.1]),A(top,[0,-ab.r*.65,-.4]),ab.r*.12,'#8a1818',{w1:ab.r*.05,d:-.12});
  for(let i=0;i<4;i++)B.cap(A(top,[-ab.r*.55,-ab.r*(.1+i*.15),-.2-i*.3]),A(top,[ab.r*.55,-ab.r*(.1+i*.15),-.2-i*.3]),.35,'#a02020',{d:-.11});
  for(let i=0;i<22;i++){const a=i*2.4,e=Math.sin(i*1.7)*.8;const n=[Math.cos(a)*Math.cos(e),Math.sin(a)*Math.cos(e)*.8,Math.sin(e)*.8+.2];const b=A(ab.p,n,ab.r*.95);B.cap(b,A(b,n,1.4),.35,'#4a4040',{w1:.08,d:-.02});}
  B.ball(A(ab.p,[-ab.r*.3,ab.r*.2,ab.r*.6]),ab.r*.22,'#ffffff',{flat:1,alpha:.12,d:-.14});
  B.cap(A(ab.p,[0,-ab.r*.85,-ab.r*.1]),A(ab.p,[0,-ab.r*1.1,-ab.r*.25]),1.2,'#3a2a2a',{w1:.6,d:-.02});
  // 머리가슴: 송곳니(협각)·촉수·눈 여러 개
  const hp=q.hp,hr=q.hr;for(const g of[-1,1]){const a=A(hp,[g*hr*.35,hr*.75,-hr*.3]),b=A(hp,[g*hr*(.3-q.snap*.15),hr*1.4,-hr*.9-q.snap*.6]);B.cap(a,b,1.6*q.bw,'#1a1414',{w1:.5,d:-.08});B.cap(b,A(b,[g*-.4,.3,-1.4]),.6,'#d8d0c0',{w1:.1,d:-.09});
    const pa=A(hp,[g*hr*.6,hr*.7,-hr*.1]),pb=A(pa,[g*1.6,2.2,-1.6+(mode==='attack'?1.5:0)]);B.cap(pa,pb,.9,'#2e2626',{w1:.6,d:-.07});B.cap(pb,A(pb,[g*.2,1,-2]),.7,'#2e2626',{w1:.4,d:-.07});}
  for(let i=0;i<4;i++){const g=(i-1.5)*.25;B.ball(A(hp,[g*hr,hr*.9,hr*.62+(i%3?0:hr*.15)]),hr*.11,'#ff3020',{flat:1,glow:'255,40,30',d:-.08});}
  B.ball(A(hp,[0,0,hr*.6]),hr*.6,T(sk,.12),{sy:.5,d:-.03});
  // 거미줄 실(스킬)
  if(mode==='skill'&&f>=2){B.line([A(ab.p,[0,-ab.r,0]),[0,ab.p[1]-ab.r-6,0]],'rgba(230,230,240,.7)',.4);for(let i=0;i<4;i++){const a=i/4*Math.PI*2;B.line([[0,16,2],[Math.cos(a)*6,16+Math.sin(a)*3,2]],'rgba(230,230,240,.6)',.3);}}}
}]);

// ======================= 53. 크로울링 크로 =======================
Q.push(['크로울링 크로',{skin:'#b49c8a',legC:'#a48a78',
 detail(B,K){const q=BJ(B),t=B.t,{mode,f}=B,s=B.s;const sk=s.skin,dk=T(sk,-.3),hp=q.hp,hr=q.hr;const h=q.h,hd=s.segs[0];
  // 손등 뼈·핏줄·손목 절단면
  for(let i=0;i<4;i++){const x=-3+i*2;B.cap(A(hp,[x*.55,-hr*.3,hr*.75]),A(hp,[x*.7,hr*.55,hr*.55]),.9,T(sk,.12),{w1:.6,d:-.06});}
  B.line([A(hp,[-1.5,-hr*.2,hr*.8]),A(hp,[-.5,hr*.2,hr*.85]),A(hp,[.6,0,hr*.82]),A(hp,[1.5,hr*.4,hr*.7])],'rgba(90,60,120,.7)',.4);
  const w=A(hp,[0,-hr*.9,hr*.1]);B.ball(w,hr*.4,'#7a2a20',{sx:1.2,sy:.6,d:.02});B.ball(A(w,[-.4,-.4,0]),hr*.13,'#e8e0c8',{flat:1,d:-.01});B.ball(A(w,[.5,-.4,.1]),hr*.1,'#e8e0c8',{flat:1,d:-.02});
  for(let i=0;i<3;i++){const ph2=((t/500)+i/3)%1;B.ball(A(w,[Math.sin(i*2)*1.2,-1-ph2*1.2,-ph2*3]),.35*(1-ph2),'#8a1a10',{d:-.03});}
  // 손가락 마디·손톱(plan의 손가락 위 덧그림)
  for(let i=0;i<4;i++){const a=[-3+i*2,hd[1]+hr*.6,h],b=[-4+i*2.6,hd[1]+hr*.6+6+(q.walk?Math.sin(q.ph+i)*1.5:0),.6];B.ball(M(a,b,.45),.8,T(sk,.08),{d:-.04});B.ball(M(a,b,.75),.7,T(sk,.05),{d:-.04});
    const dd=DIR(a,b);B.cap(A(b,dd,-.3),A(A(b,dd,1.6),[0,0,-.4]),.9,'#e8dcc0',{w1:.2,d:-.06});B.line([M(a,b,.45),A(M(a,b,.45),[.2,0,.5])],dk,.3);}
  // 엄지
  const ta=A(hp,[-hr*.9,hr*.1,-hr*.1]),tb=A(ta,[-2.6,2.6+(q.walk?Math.cos(q.ph)*1:0),-1.4]);B.cap(ta,tb,1.4,sk,{w1:1,d:-.03});B.cap(tb,A(tb,[-.6,1.4,-.4]),.9,'#e8dcc0',{w1:.2,d:-.05});
  // 반지
  B.cap(A(hp,[-1+0.6,hr*.62,.5]),A(hp,[-1+0.6,hr*.62+1,.5]),1.7,'#c8a040',{d:-.07});B.ball(A(hp,[-.4,hr*.62+.5,1.2]),.6,'#40a0ff',{glow:'90,170,255',d:-.09});
  if(mode==='attack'&&f===1)for(let i=0;i<3;i++)B.arc([[-3+i*2,hp[1]+6,4],[-1+i*2,hp[1]+10,2],[1+i*2,hp[1]+6,0]],'255,90,90',.7);}
}]);

// ======================= 56. 괴물 눈 =======================
Q.push(['괴물 눈',{skin:'#8a5866',
 draw(B,K){const s=B.s,{mode,f,t}=B,r=s.r||9,sk=s.skin;K.PLANS.blob(B);let pulse=0,lunge=0,sq=1;const walk=mode==='walk'||mode==='run';const ph=f*Math.PI/2;if(walk)sq=1+.12*Math.cos(ph*2);if(mode==='attack'){lunge=[-2,5,1][f];sq=[1.15,.85,1][f];}if(mode==='buff')pulse=[.05,.12,.12,.06][f];if(mode==='skill')sq=[1.2,1.05,.9,1][f];
  const hop=walk?Math.abs(Math.sin(ph))*(mode==='run'?5:3):0,z0=6+Math.sin(t/500+f)*1.5+hop,c=[0,lunge,z0+r],R=r*(1+pulse)*sq;
  // 살갗 주름·혈관·종기
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2+.3,e=Math.sin(i*1.9)*.5;const n=[Math.cos(a)*Math.cos(e),Math.sin(a)*Math.cos(e),Math.sin(e)];if(n[1]>.55)continue;B.ball(A(c,n,R*.93),R*(.16+.05*Math.sin(i*3)),T(sk,(i%3-1)*.12),{d:-.02});}
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const pts=[];for(let k=0;k<4;k++){const aa=a+k*.18,ee=.3-k*.25;pts.push(A(c,[Math.cos(aa)*Math.cos(ee)*.62,.78-k*.12,Math.sin(ee)+Math.sin(aa)*.1],R*1.02));}B.line(pts,'rgba(120,20,40,.7)',.45);}
  // 눈꺼풀(위·아래)
  const ey=A(c,[0,R*.68,R*.05]);const lidUp=mode==='skill'?.2:mode==='attack'?.35:.55+.1*Math.sin(t/900);
  B.cap(A(ey,[-R*.62,-.2,R*lidUp]),A(ey,[R*.62,-.2,R*lidUp]),R*.32,T(sk,.08),{d:-.09});B.cap(A(ey,[-R*.6,-.2,-R*.5]),A(ey,[R*.6,-.2,-R*.5]),R*.26,T(sk,-.05),{d:-.09});
  for(let i=0;i<7;i++){const x=(i/6-.5)*R*1.1;B.cap(A(ey,[x,.6,R*(lidUp+.12)]),A(ey,[x*1.15,1.4,R*(lidUp+.45)]),.35,'#1a1010',{w1:.08,d:-.1});}
  // 홍채 무늬·반사
  const ir=A(c,[0,R*.9,R*.05]);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;B.line([A(ir,[Math.cos(a)*R*.14,.15,Math.sin(a)*R*.14]),A(ir,[Math.cos(a)*R*.3,.1,Math.sin(a)*R*.3])],'rgba(255,200,120,.55)',.3);}
  B.ball(A(ir,[-R*.12,.4,R*.14]),R*.07,'#ffffff',{flat:1,d:-.12});
  // 아래 촉수 끝 갈고리
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2+t/900;const tip=[Math.cos(a)*r*.9,lunge+Math.sin(a)*r*.9-r*.6,z0-r*.3+Math.sin(t/300+i)*1.5];B.cap(tip,A(tip,[Math.cos(a)*.6,0,-1.6]),.6,'#3a1a20',{w1:.1,d:.15});B.ball(M([Math.cos(a)*r*.5,lunge+Math.sin(a)*r*.5-r*.2,z0+r*.3],tip,.5),.9,T(sk,-.2),{d:.18});}
  // 위 작은 눈자루 3개
  for(let i=0;i<3;i++){const a=(i-1)*.7;const b=A(c,[Math.sin(a)*R*.5,-R*.2,R*.85]),tip=A(b,[Math.sin(a)*2.4,-.5+Math.sin(t/350+i)*.6,3.4]);B.cap(b,tip,1.1,T(sk,-.1),{w1:.6});B.ball(tip,1.1,'#f0ece0');B.ball(A(tip,[0,.8,0]),.5,s.iris||'#c02030',{flat:1,d:-.04});}
  if(mode==='skill'&&f>=2)B.ring(14,s.fx||'255,80,90',.5);}
}]);

// ======================= 59. 서큐버스 퀸 =======================
Q.push(['서큐버스 퀸',{cloth:'#2c0a26',armor:'#2a0820',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,j=J(B),t=B.t,{mode,f}=B;const gold='#d8b050',fx=B.s.fx,hair='#1a0810';
  wingHQ(B,'#2a0620',{vein:'rgba(255,90,200,.45)',claw:gold});
  // 코르셋(끈 장식)·금 목걸이
  B.poly([SF(B,-1,sh+4,.4),SF(B,1,sh+4,.4),SF(B,1.1,H+1,.5),SF(B,0,H-1,.6),SF(B,-1.1,H+1,.5)],'#4a0a34',{grad:1,edge:gold,ew:.5,d:-.04});
  for(let i=0;i<5;i++){const z=H+1.5+i*2.2;B.line([SF(B,-.18,z,.9),SF(B,.18,z+1.1,.9)],gold,.35);B.line([SF(B,.18,z,.9),SF(B,-.18,z+1.1,.9)],gold,.35);}
  const nk=[];for(let i=0;i<=8;i++){const a=-1.2+i*.3;nk.push(SF(B,a,sh+5.5-Math.sin(i/8*Math.PI)*2.4,.5));}B.line(nk,gold,.6);B.ball(SF(B,0,sh+3,1),1.2,'#ff3090',{glow:fx,d:-.08});
  // 금 견장·팔찌
  for(const jj of[j.R,j.L]){B.ball(A(jj.sp,[jj.sg*1,0,1.6]),2.8*bw,gold,{sy:.6,d:-.06});B.cap(A(jj.sp,[jj.sg*1.5,0,1.5]),A(jj.sp,[jj.sg*3.5,-.5,4.5]),1,gold,{w1:.15,d:-.07});
    for(const u of[.6,.8])B.cap(M(jj.el,jj.h,u-.03),M(jj.el,jj.h,u+.03),4.3*bw,gold,{d:-.03});B.cap(M(jj.sp,jj.el,.85),A(M(jj.sp,jj.el,.85),[jj.sg*1.5,-1,-5]),2,'#3a0a30',{w1:.8,alpha:.85,d:.03});}
  // 치마 자락(트임)
  const cp=p.cape||1.5;for(const g of[-1,1])B.poly([SF(B,g*.35,H+1,.5),SF(B,g*1.4,H+1,.5),[g*8*bw,1,6],[g*7*bw,-1,1.5-cp*.2],[g*3*bw,3.4,4]],'#3a0a2e',{grad:1,edge:gold,ew:.35,d:-.02});
  B.poly([SF(B,2.2,H+1,.5),SF(B,4.1,H+1,.5),[-6*bw,-4-cp*.6,1],[6*bw,-4-cp*.6,1]],'#300826',{grad:1,d:.05});
  // 긴 머리칼·티아라·입술
  for(let i=0;i<7;i++){const x=(i/6-.5)*1.6;const sw=Math.sin(t/400+i)*.4+(mode==='run'?-1:0);B.cap(HP(B,x,-.3,.4),HP(B,x*1.2+sw*.1,-.9+sw*.1,-1.6),hr*.32,i%2?hair:'#2a1020',{w1:hr*.25,d:.05});B.cap(HP(B,x*1.2,-.9,-1.6),HP(B,x*1.25,-1.1+sw*.2,-3.2),hr*.24,i%2?hair:'#2a1020',{w1:hr*.05,d:.05});}
  for(let i=-2;i<=2;i++)B.cap(HP(B,i*.28,.3,.82),HP(B,i*.32,.3,1.15+(i%2?0:.25)),hr*.1,gold,{w1:hr*.03,d:-.05});B.ball(HP(B,0,.55,.95),hr*.14,'#ff3090',{glow:fx,d:-.07});
  B.cap(HP(B,-.14,.93,-.45),HP(B,.14,.93,-.45),hr*.12,'#b01848',{d:-.08});for(const g of[-1,1])B.cap(HP(B,.25*g,.88,.36),HP(B,.55*g,.8,.42),hr*.07,'#1a0010',{d:-.08});
  // 뿔 마디
  for(const g of[-1,1])for(let i=0;i<3;i++){const q=M(HP(B,.6*g,0,.6),HP(B,1.2*g,-.3,1.5),i/3);B.cap(A(q,[0,0,-.25]),A(q,[0,0,.25]),hr*.4,'#a8862e',{d:-.04});}
  // 꼬리 하트 끝
  const c2=[0,-18,H+3];B.poly([A(c2,[0,1,-1.4]),A(c2,[2,-.6,0]),A(c2,[1.2,-2,.8]),A(c2,[0,-1.2,.4]),A(c2,[-1.2,-2,.8]),A(c2,[-2,-.6,0])],'#7a1048',{grad:1,edge:gold,ew:.3});
  // 지팡이: 초승달 머리
  const h=p.hR,d=p.dS,pt=k=>A(h,d,k),u=PERP(d);staffHQ(B,'#2a0a20',gold,{wrap:'#5a0a3a'});const c0=pt(16);const cr=[];for(let i=0;i<=8;i++){const a=-1.2+i*2.4/8;cr.push(A(A(c0,u,Math.sin(a)*4),d,Math.cos(a)*3.4-1.6));}B.line(cr,gold,1);
  for(let i=0;i<5;i++){const ph=((t/700)+i/5)%1;B.glow([Math.sin(i*2.6)*7,Math.cos(i*1.7)*4,H+ph*24],1.2,fx,(1-ph)*.6);}}
}]);

// ======================= 62. 해골저격병 =======================
Q.push(['해골저격병',{legW:3,armW:2.6,handR:1.5,pants:'#e6dfcc',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,j=J(B);const mt='#5a5a62',rs='#6a4a30';
  boneHQ(B);skullHQ(B,'120,180,255');
  // 투구: 코가리개·리벳·테·사슬 목가리개
  B.cap(HP(B,-1,.15,.35),HP(B,1,.15,.35),hr*.2,T(mt,-.2),{d:-.05});B.cap(HP(B,0,1.04,.62),HP(B,0,1.08,.05),hr*.17,mt,{w1:hr*.1,d:-.13});rivets(B,[HP(B,-.7,.65,.42),HP(B,.7,.65,.42),HP(B,0,.1,1.06)],'#b0a890',.45);
  B.cap(HP(B,0,0,1.02),HP(B,0,-.8,.7),hr*.14,T(mt,.15),{d:-.06});
  for(let i=0;i<9;i++){const a=Math.PI+(i/8-.5)*3.4;B.cap(HP(B,Math.sin(a)*.95,Math.cos(a)*.8-.1,.1),HP(B,Math.sin(a)*1.02,Math.cos(a)*.85-.15,-.55),hr*.16,i%2?'#6a6a74':'#55555e',{w1:hr*.13,d:Math.cos(a)>0?-.02:.03});}
  // 사슬 셔츠 조각·허리천·두건 망토
  scales(B,sh-2,sh+5,3,5,'#5a5a62',-1.1,1.1,1.2);
  for(const y of[1,-1])B.poly([[-4.5,y*2.2,H+1.5],[4.5,y*2.2,H+1.5],[4,y*3.4,H-7],[1.5,y*3.6,H-5],[0,y*3.6,H-8.5],[-2,y*3.6,H-5.5],[-4,y*3.4,H-7.5]],'#3a3a40',{grad:1,d:y>0?-.04:.04});
  B.cap([-5,0,H+1.5],[5,0,H+1.5],1.6,'#2a1a10',{d:-.03});
  const cp=p.cape||1.5;tatters(B,4,0,'#000',0,0,0);for(let i=0;i<5;i++){const x=(i-2)*3.6*bw;B.poly([[x-1.8,-5,8],[x+1.8,-5,8],[x+.4,-6-cp*1.2,1+Math.abs(i-2)]],'#34343a',{grad:1,d:.02});}
  pauldron(B,j.L,mt,bw,{rivet:'#b0a890',s:.75});bracer(B,j.L,rs,3.6,{strap:'#2a1a10'});bracer(B,j.R,rs,3.4,{strap:'#2a1a10'});
  quiver(B,'#3a2a1a','#6a6a72',{fl:'#2a2a2a'});
  bowHQ(B,'#4a3a2a','#9a9aa6');const{p:pp}=B.J;B.line([A(pp.hL,[0,0,9]),A(pp.hL,[0,1.2,7]),A(pp.hL,[0,0,5])],'#9a9aa6',.5);arrowNock(B,'#5a4a30','#b0b6c0','#3a3a3a');}
}]);

// ======================= 65. 아이들론 =======================
Q.push(['아이들론',{skin:'#9a8a6a',armor:'#8e7e60',cloth:'#8e7e60',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,j=J(B),t=B.t,{mode,f}=B;const st='#9a8a6a',cy='90,220,255';const pu=.55+.3*Math.sin(t/240)+(mode==='skill'?.35:0);
  // 몸통 석판
  const rk=[[-.6,sh+4,2.6],[.6,sh+4,2.6],[0,sh,2.4],[-.8,H+4,2.2],[.8,H+4,2.2],[2.6,sh+3,3],[-2.6,sh+3,3],[3.14,H+5,2.8]];rk.forEach(([a,z,r],i)=>rock(B,SF(B,a,z,-.6),r*bw,r*bw,r*bw*.7,T(st,(i%3-1)*.07),i*1.7,{d:-.03}));
  // 빛나는 룬 줄
  const rl=[SF(B,-.5,sh+5,1.6),SF(B,0,sh+2,1.8),SF(B,.5,sh+5,1.6)];B.line(rl,'rgba(140,235,255,'+Math.min(1,pu)+')',.7);B.line([SF(B,0,sh+2,1.8),SF(B,0,H+3,1.6)],'rgba(140,235,255,'+Math.min(1,pu)+')',.6);B.glow(SF(B,0,sh+2,2),3,cy,pu*.7);
  // 어깨 바위·팔 석판·주먹
  for(const jj of[j.R,j.L]){rock(B,A(jj.sp,[jj.sg*1.4,0,2]),3.6*bw,3.4*bw,2.8*bw,T(st,.05),jj.sg*3,{d:-.06});rock(B,M(jj.el,jj.h,.4),2.6*bw,2.6*bw,2.2*bw,T(st,-.05),jj.sg*5,{d:-.04});rock(B,A(jj.h,[0,.6,0]),2.4*bw,2.4*bw,2*bw,T(st,-.1),jj.sg*7,{d:-.07});
    B.glow(A(jj.h,[0,1,0]),1.6+(mode==='attack'?1.4:0),cy,.4+(mode==='attack'?.3:0));}
  // 머리: 왕관형 수정
  rock(B,HP(B,0,.1,.5),hr*.9,hr*.85,hr*.5,T(st,.08),1.1,{d:-.04});for(let i=-1;i<=1;i++){const b=HP(B,i*.45,-.1,.85);B.poly([A(b,[-.8,0,0]),A(b,[0,.4,3.2-Math.abs(i)*1.2]),A(b,[.8,0,0]),A(b,[0,-.5,.3])],'#a0e8ff',{alpha:.85,edge:'#e0f8ff',ew:.3,d:-.03});}
  // 하체 아래 떠있는 수정 조각
  for(let i=0;i<4;i++){const a=i/4*Math.PI*2+t/800;const c=[Math.cos(a)*6,Math.sin(a)*4,H-10+Math.sin(t/300+i)*1.5];B.poly([A(c,[0,0,2.4]),A(c,[1.1,0,0]),A(c,[0,0,-2]),A(c,[-1.1,0,0])],'#80d8ff',{alpha:.85,edge:'#e0f8ff',ew:.3});B.glow(c,1.6,cy,.4);}
  // 떠도는 돌 파편
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2+t/1100+f*.2;rock(B,[Math.cos(a)*13,Math.sin(a)*8,H+4+Math.sin(a*2+t/400)*4],1,1,.8,T(st,-.08),i,{d:0});}
  B.ring(9+Math.sin(t/300),cy,.3);}
}]);

// ======================= (2차) 공통 도구 =======================
// biped 꼬리 점(plan과 동일)
function W2_tail(B){const{H}=B.J,{t,f}=B;return[[0,-4,H+2],[0,-12,H-2+Math.sin(t/300+f)*2],[0,-18,H+3]];}
// 꼬리 끝 화살촉(악마 꼬리)
function W2_spade(B,col){const tl=W2_tail(B),e=tl[2],d=DIR(tl[1],e);const u=PERP(d);B.poly([A(e,d,-.5),A(A(e,d,1.2),u,1.8),A(e,d,3.6),A(A(e,d,1.2),u,-1.8)],col,{grad:1,edge:T(col,-.5),ew:.3,d:-.02});}
// 뿔 마디(head 뿔 경로 따라 고리)
function W2_hornRings(B,col,pts,n=3){for(const g of[-1,1]){const P=pts.map(q=>HP(B,q[0]*g,q[1],q[2]));for(let i=0;i<n;i++){const t=(i+1)/(n+1);const a=M(P[0],P[1],t);B.ball(a,B.J.hr*(.2-i*.03),col,{sy:.6,d:-.06});}}}
// 상처·흉터 선
function W2_scar(B,a,b,col='#5a1a14'){B.line([a,M(a,b,.5),b],col,.45);}
// 몸통 위 단추형 고정점 목록 → 가죽 벨트
function W2_belt(B,z,col,buckle,o=.6){const pts=[];for(let i=0;i<=10;i++)pts.push(SF(B,-1.55+i*.31,z,o));B.line(pts,col,2);B.ball(SF(B,0,z,o+.4),1.2,buckle,{d:-.08});}
// 허리 앞 가리개(천/가죽)
function W2_loin(B,z,len,col,w=.5,o=.8){const sw=Math.sin(B.t/350+B.f*1.3)*.6;B.poly([SF(B,-w,z,o),SF(B,w,z,o),A(SF(B,w*.8,z-len,o+1),[0,sw,0]),A(SF(B,0,z-len-1.2,o+1.2),[0,sw,0]),A(SF(B,-w*.8,z-len,o+1),[0,sw,0])],col,{grad:1,edge:T(col,-.5),ew:.3,d:-.05});}

// ======================= 68. 임프 장로 =======================
Q.push(['임프 장로',{cloth:'#3e0c2c',sleeve:'#4a1034',skin:'#8e2a38',hand:'#8e2a38',forearm:'#8e2a38',wings:'#4e1a2a',horns:'#c8b89a',beard:'#d8d2c6',boot:'#1e0a10',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,{mode,f,t}=B,j=J(B);const gold='#c8a048',dk='#2a0818';
  robeHQ(B,'#3e0c2c',gold,{hemDark:1});
  wingHQ(B,'#2a0c14',{claw:'#d8c8a8',vein:'rgba(160,40,60,.8)'});
  // 앞섶 띠·룬 문양
  B.poly([SF(B,-.32,sh+3,.8),SF(B,.32,sh+3,.8),SF(B,.22,H-1,1.1),SF(B,-.22,H-1,1.1)],'#5a1440',{grad:1,edge:gold,ew:.45,d:-.06});
  for(let i=0;i<3;i++){const z=sh-3-i*4;B.ball(SF(B,0,z,1.4),.75,i===1?'#ff6a30':gold,{d:-.09,glow:i===1?'255,110,50':null});}
  W2_belt(B,H+2,'#2a1410',gold);B.cap(SF(B,.9,H+1.5,1),SF(B,1.05,H-2.5,1.2),2,'#4a2a18',{w1:2.4,d:-.07});
  // 뼈 목걸이
  for(let i=0;i<7;i++){const a=-1+i*.333;const q=A(SF(B,a,sh+1.2,.9),[0,0,-Math.cos(a)*2]);B.cap(q,A(q,[0,.2,-1.4]),.8,'#e8dfc8',{w1:.4,d:-.1});}
  // 어깨 깃 장식
  for(const jj of[j.R,j.L]){B.ball(A(jj.sp,[jj.sg*.8,0,1.2]),3.4*bw,'#5a1440',{sy:.7,d:-.06});B.cap(A(jj.sp,[jj.sg*.2,1,2.6]),A(jj.sp,[jj.sg*2.6,.6,4.6]),.9,gold,{w1:.3,d:-.08});
    bracer(B,jj,'#3a1020',3.6*bw,{strap:gold});for(let i=-1;i<=1;i++)B.cap(jj.h,A(jj.h,[i*.6,1.5,-.9]),.45,'#1a0a0a',{w1:.1,d:-.08});}
  // 얼굴: 눈두덩·주름·이빨·긴 귀·수염 가닥
  brow(B,'#5a1420',.78,.42,.6);for(let i=0;i<3;i++)B.line([HP(B,-.35,.7,.62+i*.1),HP(B,.35,.7,.62+i*.1)],'rgba(40,0,10,.55)',.35);
  for(const g of[-1,1]){B.cap(HP(B,.85*g,.05,.1),HP(B,1.7*g,-.3,.45),hr*.3,'#8e2a38',{w1:hr*.04,d:.02});B.ball(HP(B,1.1*g,0,.2),hr*.1,gold,{d:-.03});}
  teeth(B,4,1.3,-.45,.35,'#f0e8d0',.2);
  for(let i=0;i<5;i++){const x=(i-2)*.22;B.cap(HP(B,x,.88,-.4),HP(B,x*1.4,.95,-1.6-Math.abs(Math.sin(i*2))*.35),hr*.12,i%2?'#e8e2d6':'#c6beb0',{w1:hr*.03,d:-.21});}
  W2_hornRings(B,'#8a7a62',[[.5,-.1,.8],[1.3,-.6,1.5]],3);
  // 지팡이: 손잡이 감기 + 해골 고리 + 불꽃 보주
  staffHQ(B,'#4a2a18','#c8b89a',{wrap:'#2a1410',charm:'#ff6a30'});{const pt=k=>A(p.hR,p.dS,k);B.ball(pt(13.2),1.6,'#e8dfc8',{d:-.04});for(const g of[-1,1])B.ball(A(A(pt(13.2),[g*.6,.9,0]),[0,0,0]),.4,'#1a0a0a',{flat:1,d:-.06});
    const fl=.6+.4*Math.sin(t/120+f);for(let i=0;i<3;i++)B.glow(A(pt(16),[Math.sin(i*2+t/200)*.7,0,1+i*1.3]),2.4-i*.5,'255,'+(120+i*40)+',40',.6*fl);}
  W2_spade(B,'#6a1a28');
  if(mode==='skill'||mode==='buff'){for(let i=0;i<5;i++){const a=i/5*Math.PI*2+t/400+f*.6;B.glow([Math.cos(a)*9,Math.sin(a)*9,H+8+Math.sin(a*2)*3],1.4,'255,90,40',.7);}}}
}]);

// ======================= 71. 오크 좀비 =======================
Q.push(['오크 좀비',{skin:'#74845e',cloth:'#463626',sleeve:'#463626',pants:'#362c22',boot:'#22180f',forearm:'#74845e',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,{mode,f,t}=B,j=J(B);const sk='#74845e',rot='#4a5a3a',blood='#4a1410';
  // 너덜너덜한 상의 자락·찢어진 구멍으로 갈비뼈
  tatters(B,H+2,6,'#3a2c1e',8,-1.6,1.6,.6,.4);
  B.ball(SF(B,.35,sh-4,.2),3.6,'#3a2a20',{sy:.9,flat:1,d:-.05});for(let i=0;i<3;i++){const z=sh-2.4-i*1.7;B.cap(SF(B,.05,z,.5),SF(B,.7,z-.4,.5),.8,'#d8d0b4',{w1:.6,d:-.08});}
  B.ball(SF(B,-.5,H+6,.4),1.6,rot,{flat:1,sy:.7,d:-.05});W2_scar(B,SF(B,-.8,sh-1,.6),SF(B,-.2,sh-7,.7),blood);
  // 붕대·밧줄 허리끈
  W2_belt(B,H+2,'#5a4a32','#6a6a60');for(let i=0;i<3;i++)B.cap(SF(B,1+i*.12,H+1.5,.9),SF(B,1.05+i*.16,H-2-i,1.1),.7,'#6a5a3a',{w1:.4,d:-.07});
  for(const jj of[j.R,j.L]){
    // 썩은 피부 반점·붕대
    B.ball(M(jj.sp,jj.el,.5),1.3,rot,{flat:1,d:-.05});
    if(jj.sg>0){for(let i=0;i<3;i++)B.cap(M(jj.el,jj.h,.25+i*.18),M(jj.el,jj.h,.3+i*.18),4.4*bw,i%2?'#cfc6a8':'#b8ae90',{d:-.03});}
    else{B.ball(jj.el,1.4,'#d8d0b4',{d:-.05});B.cap(M(jj.el,jj.h,.2),M(jj.el,jj.h,.6),.6,'#d8d0b4',{d:-.06});}
    for(let i=-1;i<=1;i++)B.cap(jj.h,A(jj.h,[i*.6,1.5,-1]),.5,'#2a2418',{w1:.15,d:-.08});
    // 찢어진 바지 사이 무릎뼈
    B.ball(A(jj.kn,[0,1,0]),1.3,jj.sg>0?'#d8d0b4':rot,{d:-.05});B.cap(A(jj.kn,[0,.6,-1.2]),A(jj.kn,[jj.sg*1.4,.9,-2.6]),1.2,'#2a2016',{w1:.3,d:-.04});}
  // 얼굴: 축 늘어진 턱·부러진 엄니·꿰맨 자국·탁한 한쪽 눈
  brow(B,'#4a5636',.8,.4,.6);B.ball(HP(B,0,.82,-.75),hr*.35,'#3a1a14',{flat:1,sx:1.3,sy:.6,d:-.07});teeth(B,4,.95,-.6,.4,'#bfb48e',.15);
  B.cap(HP(B,.3,.95,-.55),HP(B,.33,1.04,-.25),hr*.15,'#d8cca8',{w1:hr*.08,d:-.09});
  B.line([HP(B,-.7,.6,.6),HP(B,-.3,.8,.1)],'#2a1a10',.4);for(let i=0;i<3;i++){const c=M(HP(B,-.7,.6,.6),HP(B,-.3,.8,.1),.2+i*.3);B.line([A(c,[-.6,0,-.3]),A(c,[.6,0,.3])],'#2a1a10',.3);}
  B.ball(HP(B,-.36,.88,.12),hr*.2,'#d8dcc0',{flat:1,d:-.08});B.ball(HP(B,.36,.88,.12),hr*.18,'#e0e070',{flat:1,glow:'200,230,100',d:-.08});
  for(let i=0;i<4;i++)B.cap(HP(B,-.3+i*.2,-.1,.95),HP(B,-.4+i*.25,-.5,.6+i%2*.3),hr*.07,'#2a2a1a',{w1:hr*.02,d:.02});
  // 녹슨·이 빠진 도끼
  axeHQ(B,'#7a6a5a',{band:'#4a3a2a'});{const pt=k=>A(p.hR,p.dS,k),X=[1,0,0];for(let i=0;i<4;i++)B.ball(A(pt(15.8+i*1.6),X,4.5+Math.sin(i*3)*1.6),.7,'#8a4a24',{flat:1,alpha:.8,d:-.23});B.poly([A(pt(17),X,6.6),A(pt(18.3),X,5.2),A(pt(19.4),X,6.4)],'#3a5a2a',{d:-.24});for(const k of[-2,-.6,.8])B.cap(pt(k-.3),pt(k+.3),2,'#6a5a3a',{d:-.06});}
  // 썩은 기운
  for(let i=0;i<4;i++){const ph=((t/1600)+i/4+f*.1)%1;B.glow([Math.sin(i*2.1)*6,Math.cos(i*1.3)*3,H+4+ph*22],1.6*(1-ph)+.4,'150,200,90',(1-ph)*.45);}}
}]);

// ======================= 74. 사이클롭스 =======================
Q.push(['사이클롭스',{skin:'#94735a',cloth:'#94735a',sleeve:'#94735a',pants:'#5a3c26',boot:'#6a4c36',hand:'#94735a',forearm:'#94735a',wcol:'#5a4028',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,{mode,f,t}=B,j=J(B);const sk='#94735a',dk='#5a4030',fc='#4a3020',lth='#3e2616';
  // 가죽 허리 + 털 앞가리개 + 뒷가리개
  W2_belt(B,H+2.5,'#3a2414','#b0a080',.8);W2_loin(B,H+2,9,lth,.55,.9);B.poly([SF(B,Math.PI-.5,H+2,.8),SF(B,Math.PI+.5,H+2,.8),SF(B,Math.PI+.4,H-8,1.4),SF(B,Math.PI-.4,H-8,1.4)],T(lth,-.15),{grad:1,d:-.02});
  fur(B,[...Array(16)].map((_,i)=>SF(B,-3.14+i*.4,H+3.2,1.1)),fc,4.2,2.2,1);
  B.ball(SF(B,-.5,H+1.5,1.4),1.8,'#e6dcc4',{d:-.09});for(const g of[-1,1])B.ball(A(SF(B,-.5,H+1.5,2.6),[g*.6,0,.3]),.4,'#1a1010',{flat:1,d:-.1});
  // 가슴 X 가죽끈 + 뼈 장식
  strap(B,SF(B,-.95,sh+1,.5),SF(B,.6,H+3,.7),'#4a2e18',1.8);B.ball(SF(B,-.2,sh-4.5,1),1.3,'#b0a080',{d:-.09});
  // 근육선·흉터·가슴털
  B.line([SF(B,-.05,sh,.4),SF(B,-.05,sh-6,.5)],'rgba(60,40,20,.5)',.6);for(const g of[-1,1])B.line([SF(B,g*.15,sh-5.5,.5),SF(B,g*.7,sh-4,.4)],'rgba(60,40,20,.5)',.6);
  W2_scar(B,SF(B,.4,sh+1,.6),SF(B,.9,sh-6,.6),'#6a2a1a');for(let i=0;i<6;i++)B.cap(SF(B,-.4+i*.16,sh-2+Math.sin(i)*1.4,.6),SF(B,-.4+i*.16,sh-3.6+Math.sin(i)*1.4,.7),.5,'#5a3a22',{w1:.1,d:-.07});
  for(const jj of[j.R,j.L]){B.cap(M(jj.el,jj.h,.4),M(jj.el,jj.h,.85),5.8*bw,'#5a3a20',{d:-.02});for(const tt of[.5,.75])B.ball(M(jj.el,jj.h,tt),.65,'#c0b090',{d:-.06});
    for(let i=-1;i<=1;i++)B.cap(jj.h,A(jj.h,[i*1,2,-.9]),1.1,sk,{w1:.6,d:-.06});B.ball(A(jj.sp,[jj.sg*.5,0,1.5]),2.4,dk,{flat:1,alpha:.25,d:-.04});
    for(let i=-1;i<=1;i++)B.ball(A(jj.fp,[i*1.1,2.6,-.4]),.65,'#d8c8a8',{d:-.06});for(const tt of[.3,.75])B.cap(M(jj.kn,jj.fp,tt-.03),M(jj.kn,jj.fp,tt+.03),6.4*bw,'#2a1a0e',{d:-.03});}
  // 얼굴: 큰 눈두덩·핏줄 눈·주름·이빨·코
  B.cap(HP(B,-.55,.82,.55),HP(B,.55,.82,.55),hr*.3,'#8a7058',{d:-.09});B.ball(HP(B,0,.86,.2),hr*.38,'#f6efd8',{d:-.05});B.ball(HP(B,0,.98,.2),hr*.2,'#c02020',{flat:1,glow:'255,80,60',d:-.1});B.ball(HP(B,0,1.03,.2),hr*.08,'#100',{flat:1,d:-.11});
  for(const g of[-1,1])B.line([HP(B,.3*g,.85,.3),HP(B,.18*g,.94,.24)],'rgba(200,40,40,.8)',.3);B.cap(HP(B,0,.9,-.05),HP(B,0,1.05,-.25),hr*.2,'#9a7e64',{d:-.08});
  B.cap(HP(B,-.45,.86,-.5),HP(B,.45,.86,-.5),hr*.12,'#3a1a10',{d:-.08});teeth(B,5,.9,-.47,.6,'#e8dcb8',.15);for(const g of[-1,1])B.cap(HP(B,.38*g,.88,-.58),HP(B,.42*g,.95,-.22),hr*.14,'#efe4c4',{w1:hr*.04,d:-.1});
  for(let i=0;i<9;i++){const a=(i/8-.5)*2.6;B.cap(HP(B,Math.sin(a)*.8,-Math.cos(a)*.5,.75),HP(B,Math.sin(a)*1.05,-Math.cos(a)*.85-.25,-.2),hr*.28,i%2?'#2e2014':'#3e2a18',{w1:hr*.08,d:.04});}
  // 쇠 박힌 몽둥이
  {const pt=k=>A(p.hR,p.dS,k);for(let i=0;i<9;i++){const a=i*2.1,k=8+i*1.1,r=1.8+k*.08;const c=pt(k),u=PERP(p.dS),v=N(...CR(p.dS,u)),dir=A(A([0,0,0],u,Math.cos(a)),v,Math.sin(a));B.cap(A(c,dir,r),A(c,dir,r+1.6),.8,'#9aa0a8',{w1:.1,d:-.08});}
    for(let i=0;i<3;i++)B.cap(pt(-1+i*1.2),pt(-.6+i*1.2),2.8,'#3a2414',{d:-.05});B.cap(pt(12.5),pt(13.5),4.4,'#4a4a50',{d:-.05});}}
}]);

// ======================= 77. 데몬 =======================
Q.push(['데몬',{skin:'#5e1a18',armor:'#240808',sleeve:'#2a0a0a',forearm:'#5e1a18',pants:'#1a0606',boot:'#0e0404',wings:'#3e0c0c',horns:'#1a1010',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,{mode,f,t}=B,j=J(B);const pl='#2e0c0c',ed='#6a2a1a',lava='255,110,40',pu=.55+.35*Math.sin(t/180+f);
  wingHQ(B,'#1a0606',{claw:'#c8b8a0',vein:'rgba(255,90,40,.55)'});
  // 흉갑: 비늘판 + 용암 틈
  scales(B,H+2,sh+4.5,4,5,pl,-1.3,1.3,1.7);
  B.poly([SF(B,-.4,sh+3,1.1),SF(B,.4,sh+3,1.1),SF(B,.3,sh-5,1.3),SF(B,0,sh-8,1.4),SF(B,-.3,sh-5,1.3)],'#3a1010',{grad:1,edge:ed,ew:.5,d:-.09});
  B.line([SF(B,0,sh+1,1.6),SF(B,-.12,sh-3,1.7),SF(B,.08,sh-6,1.7)],'rgba(255,130,50,'+pu+')',.6);B.glow(SF(B,0,sh-3,2),2,lava,.5*pu);
  W2_belt(B,H+2,'#1a0606','#8a6a3a',.9);B.ball(SF(B,0,H+2,2),1.8,'#3a1010',{d:-.1});B.ball(SF(B,0,H+2,2.8),.7,'#ff6a30',{glow:lava,d:-.12});
  tatters(B,H+1.5,7,'#1a0404',7,-1.1,1.1,1,.3);
  for(const jj of[j.R,j.L]){pauldron(B,jj,pl,bw,{rivet:'#7a3a2a',spike:'#c8b8a0',s:1});B.cap(A(jj.sp,[jj.sg*2,-.5,2]),A(jj.sp,[jj.sg*3.5,-1.5,7.5]),1.4,'#d8c8b0',{w1:.15,d:-.1});
    bracer(B,jj,'#2a0a0a',4.6*bw,{strap:'#6a2a1a'});for(let i=0;i<3;i++)B.cap(M(jj.el,jj.h,.3+i*.2),A(M(jj.el,jj.h,.3+i*.2),[jj.sg*1.6,-.6,.4]),.8,'#c8b8a0',{w1:.1,d:-.07});
    for(let i=-1;i<=1;i++)B.cap(jj.h,A(jj.h,[i*.7,1.8,-1]),.6,'#d8ccb0',{w1:.1,d:-.08});
    greave(B,jj,'#2a0a0a',6*bw,{knee:'#3a1010',strap:'#6a2a1a'});B.cap(A(jj.kn,[0,1.4,.3]),A(jj.kn,[0,3.4,2.2]),1.2,'#d8c8b0',{w1:.15,d:-.1});
    for(let i=-1;i<=1;i++)B.cap(A(jj.fp,[i*1,1.5,-.6]),A(jj.fp,[i*1.1,3.4,-1.1]),.6,'#d8ccb0',{w1:.1,d:-.06});
    B.line([M(jj.sp,jj.el,.2),M(jj.sp,jj.el,.7)],'rgba(255,120,40,'+pu*.8+')',.4);}
  // 얼굴: 눈두덩·송곳니·뿔 마디·광대뼈
  brow(B,'#2a0808',.8,.42,.62);teeth(B,5,1.25,-.5,.4,'#f0e4c8',.22);for(const g of[-1,1]){B.cap(HP(B,.28*g,1.25,-.4),HP(B,.32*g,1.3,-.95),hr*.12,'#f4ead0',{w1:hr*.03,d:-.11});B.ball(HP(B,.62*g,.6,-.1),hr*.22,'#4a1210',{d:-.04});}
  W2_hornRings(B,'#3a2620',[[.5,-.1,.8],[1.3,-.6,1.5]],4);for(const g of[-1,1])B.cap(HP(B,1.6*g,-1.2,.7),HP(B,1.75*g,-1.15,.2),hr*.1,'#c8b8a0',{w1:hr*.02,d:-.02});
  B.ball(HP(B,0,.4,.95),hr*.15,'#ff6a30',{glow:lava,d:-.03});
  // 불타는 검: 손잡이·날 하이라이트·불꽃
  swordHQ(B,{guard:'#3a1a10',gem:'#ff5020',glow:lava,wrap:'#1a0808',fuller:'rgba(255,200,120,.6)'});
  {const pt=k=>A(p.hR,p.dS,k);for(let i=0;i<5;i++){const k=5+i*3.8;B.glow(A(pt(k),[Math.sin(t/90+i*1.7)*.6,0,.6]),1.8+Math.sin(t/120+i)*.4,lava,.55*pu+.2);}}
  W2_spade(B,'#3a0c0c');
  for(let i=0;i<4;i++){const ph=((t/1100)+i/4+f*.07)%1;B.glow([Math.sin(i*2.3)*5,-2+Math.cos(i*1.7)*3,2+ph*6],2*(1-ph)+.5,lava,(1-ph)*.5);}}
}]);


// ======================= 80. 놀 =======================
Q.push(['놀',{skin:'#a48a58',cloth:'#9a8052',sleeve:'#a48a58',forearm:'#a48a58',hand:'#8a7048',pants:'#43301f',boot:'#2a1e12',tailc:'#8a7048',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,{mode,f,t}=B,j=J(B);const sk='#a48a58',sp='#4a3a28',mn='#3a2a1a';
  // 갈기(뒷머리~등)
  for(let i=0;i<9;i++){const z=hd[2]-1-i*2.2,y=-hr*.6-i*.35;const b=[0,y,z];B.cap(b,A(b,[Math.sin(i*2)*.6,-2.6,1.4]),2,i%2?mn:'#5a4028',{w1:.3,d:.02});}
  for(let i=0;i<5;i++)B.cap(HP(B,-.3+i*.15,-.3,.9),HP(B,-.35+i*.18,-.9,.9),hr*.16,mn,{w1:hr*.04,d:.02});
  // 몸 반점
  for(let i=0;i<10;i++){const a=-2.6+i*.58,z=H+3+((i*7)%5)*2.6;B.ball(SF(B,a,z,.2),.9+(i%3)*.25,sp,{flat:1,alpha:.8,d:-.03});}
  for(const jj of[j.R,j.L])for(let i=0;i<3;i++)B.ball(M(jj.sp,jj.el,.2+i*.3),.7,sp,{flat:1,alpha:.8,d:-.04});
  // 가죽 조끼·하네스
  B.poly([SF(B,-1.5,sh+2,.5),SF(B,-.45,sh+2,.6),SF(B,-.4,H+2,.8),SF(B,-1.5,H+2,.7)],'#4e3828',{grad:1,edge:'#2a1a10',ew:.4,d:-.04});B.poly([SF(B,1.5,sh+2,.5),SF(B,.45,sh+2,.6),SF(B,.4,H+2,.8),SF(B,1.5,H+2,.7)],'#4e3828',{grad:1,edge:'#2a1a10',ew:.4,d:-.04});
  for(let i=0;i<3;i++){const z=sh-1-i*3.5;B.line([SF(B,-.42,z,.9),SF(B,.42,z-.6,.9)],'#8a6a40',.5);}
  W2_belt(B,H+2,'#2a1a10','#a08a5a',.8);W2_loin(B,H+1.5,6,'#5a4030',.45,.9);
  // 전리품: 뼈·이빨 목걸이
  for(let i=0;i<6;i++){const a=-.9+i*.36,q=A(SF(B,a,sh+.5,1),[0,0,-Math.cos(a)*1.5]);B.cap(q,A(q,[0,.3,-1.6]),.6,'#ece2c8',{w1:.15,d:-.1});}
  // 어깨 털 견갑
  for(const jj of[j.R,j.L]){B.ball(A(jj.sp,[jj.sg*.8,0,1.4]),3.2*bw,'#6a5030',{sy:.75,d:-.06});fur(B,[0,1,2,3].map(i=>A(jj.sp,[jj.sg*(.2+i*.8),-.5+i*.4,.6])),'#5a4028',2.4,1.3,jj.sg);
    bracer(B,jj,'#4e3828',3.8*bw,{strap:'#8a6a40'});for(let i=-1;i<=1;i++)B.cap(jj.h,A(jj.h,[i*.6,1.6,-1]),.5,'#2a2016',{w1:.1,d:-.08});
    for(let i=-1;i<=1;i++)B.cap(A(jj.fp,[i*.9,1.6,-.6]),A(jj.fp,[i*1,3,-1]),.5,'#2a2016',{w1:.1,d:-.06});}
  // 얼굴: 검은 주둥이·이빨·눈두덩·귀 안쪽
  B.cap(HP(B,0,1.3,-.25),HP(B,0,1.95,-.4),hr*.45,'#3a2a1c',{w1:hr*.32,d:-.06});B.ball(HP(B,0,2.0,-.3),hr*.17,'#0e0a08',{d:-.1});
  brow(B,'#5a4028',.75,.4,.55);for(let i=0;i<4;i++){const y=1.25+i*.2;for(const g of[-1,1])B.cap(HP(B,.22*g,y,-.55),HP(B,.22*g,y,-.8),hr*.08,'#efe6cc',{w1:hr*.02,d:-.1});}
  for(const g of[-1,1])B.cap(HP(B,.52*g,-.05,.78),HP(B,.6*g,-.12,1.25),hr*.22,'#3a2418',{w1:hr*.06,d:-.04});
  // 도끼(이빨 빠진 넓은 날)
  axeHQ(B,'#8a8a88',{band:'#5a4028'});{const pt=k=>A(p.hR,p.dS,k);for(const k of[-2,-.6,.8])B.cap(pt(k-.3),pt(k+.3),2,'#6a4a28',{d:-.06});B.line([pt(-5),A(pt(-6.5),[0,0,-2],1)],'#8a6a40',.5);B.ball(A(pt(-6.5),[0,0,-2.4]),.7,'#ece2c8',{d:-.05});}
  // 덥수룩 꼬리
  {const tl=W2_tail(B);for(let i=0;i<2;i++)for(let k=0;k<4;k++){const c=M(tl[i],tl[i+1],k/4);B.cap(c,A(c,[Math.sin(k*2+i)*1.2,-1.6,Math.cos(k*3)*1]),1.1,(k+i)%2?mn:'#6a5030',{w1:.2,d:-.03});}B.cap(tl[2],A(tl[2],[0,-1.6,.6]),1.6,mn,{w1:.3});}}
}]);

// ======================= 83. 페이퍼 맨 =======================
Q.push(['페이퍼 맨',{skin:'#efe9da',cloth:'#e6dfca',pants:'#dcd3ba',sleeve:'#e6dfca',forearm:'#efe9da',hand:'#efe9da',boot:'#cfc5aa',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,{mode,f,t}=B,j=J(B);const ink='#1a1a22',pp='#f4f0e4',ed='#b8ae94';
  // 겹친 종이 판(접힌 면)
  for(let r=0;r<4;r++){const z=sh+1-r*3.8;for(let i=0;i<8;i++){const a0=-3.14+i*.785,a1=a0+.82;B.poly([SF(B,a0,z,.4+r*.05),SF(B,a1,z+.3,.4),SF(B,a1-.05,z-4.2,.7),SF(B,a0+.08,z-4,.6)],(i+r)%2?pp:'#e2dac4',{edge:ed,ew:.3,d:-.03-r*.002});}}
  // 먹 글씨(부적 문자)
  for(let i=0;i<5;i++){const z=sh-1-i*2.4;B.line([SF(B,-.12,z,.9),SF(B,.05,z-.5,.9),SF(B,-.06,z-1.3,.9)],ink,.45);B.line([SF(B,.25,z-.3,.9),SF(B,.35,z-1,.9)],ink,.35);}
  // 펄럭이는 종이 띠
  for(let i=0;i<5;i++){const a=-2.2+i*.55+Math.PI*.4,sw=Math.sin(t/200+i+f*1.4)*1.5;const p0=SF(B,a,H+1,.6);B.poly([p0,SF(B,a+.25,H+1,.6),A(SF(B,a+.2,H-6-i%2*2,1.8),[sw,0,0]),A(SF(B,a,H-5.5-i%2*2,1.8),[sw,0,0])],i%2?pp:'#e8e0cc',{edge:ed,ew:.25,d:-.02});if(i===2)B.line([A(p0,[0,.2,-1.2]),A(p0,[0,.4,-3.6])],'#a02020',.6);}
  // 팔다리 접힌 마디(주름선)
  for(const jj of[j.R,j.L]){for(const tt of[.3,.6])B.cap(M(jj.sp,jj.el,tt),M(jj.sp,jj.el,tt+.06),3.8*bw,ed,{d:-.02});for(const tt of[.3,.6])B.cap(M(jj.el,jj.h,tt),M(jj.el,jj.h,tt+.05),3.2*bw,ed,{d:-.02});
    for(const tt of[.35,.7])B.cap(M(jj.kn,jj.fp,tt),M(jj.kn,jj.fp,tt+.05),3.6*bw,ed,{d:-.02});
    // 종이칼날 손톱
    for(let i=-1;i<=1;i++){const a=jj.h,b=A(jj.h,N(i*.4,.8,-.3),4.2),u=[0,0,1];B.poly([a,A(M(a,b,.4),u,.7),b,A(M(a,b,.5),u,-.3)],'#faf8f0',{edge:'#9a9080',ew:.3,d:-.06});}}
  // 머리: 접힌 각진 면·붉은 부적·먹 눈
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2;B.poly([HP(B,0,0,1.02),HP(B,Math.cos(a)*1,Math.sin(a)*1,.1),HP(B,Math.cos(a+1.26)*1,Math.sin(a+1.26)*1,.1)],i%2?pp:'#e4dcc6',{edge:ed,ew:.25,d:-.02});}
  B.poly([HP(B,-.22,.8,.62),HP(B,.22,.8,.62),HP(B,.24,1.0,-.35),HP(B,-.24,1.0,-.35)],'#f0e070',{edge:'#a08020',ew:.3,d:-.1});B.line([HP(B,0,.92,.5),HP(B,0,1.04,.3),HP(B,-.12,1.08,.1)],'#b01818',.55);B.line([HP(B,-.12,1.08,.6),HP(B,.12,1.08,.5)],'#b01818',.45);B.line([HP(B,-.1,1.08,-.05),HP(B,.12,1.08,-.25)],'#b01818',.45);
  for(const g of[-1,1]){B.ball(HP(B,.42*g,.86,.1),hr*.17,ink,{flat:1,sx:1.4,d:-.08});B.line([HP(B,.25*g,.88,.28),HP(B,.6*g,.82,.36)],ink,.4);}
  B.line([HP(B,-.35,.9,-.45),HP(B,0,.95,-.55),HP(B,.35,.9,-.45)],ink,.5);
  if(mode==='skill'||mode==='buff')for(let i=0;i<6;i++){const a=i/6*Math.PI*2+t/300+f*.5,q=[Math.cos(a)*10,Math.sin(a)*10,H+4+((i*5+f*4)%14)];B.poly([q,A(q,[1.2,.3,.6]),A(q,[.4,0,1.8]),A(q,[-.8,-.2,1])],i%2?'#f4f0e4':'#f0e070',{edge:ed,ew:.2,d:-.2});}}
}]);

// ======================= 86. 악어 =======================
Q.push(['악어',{skin:'#4e5e34',chest:'#a8a46a',legC:'#46542e',paw:'#2e3420',tailc:'#4a5830',spines:'#3a4826',
 detail(B,K){const q=QJ(B),{mode,f,t}=B;const sk='#4e5e34',dk='#323e20',sc='#5c6c3c',bl='#b4ae74';const{h,L,ny,R}=q;
  // 등 비늘판(골판) 두 줄 + 옆 비늘
  for(let i=0;i<9;i++){const y=-L*.55+ny*.5+i*(L*1.0)/8;for(const g of[-1,1,-2,2]){const x=g*R*(Math.abs(g)>1?.62:.24);const z=h+1+R*(Math.abs(g)>1?.72:.95);B.poly([[x-.9,y-1.2,z],[x+.9,y-1.2,z],[x+.7,y+1,z+.5],[x-.7,y+1,z+.5]],(i+Math.abs(g))%2?sc:T(sc,-.12),{edge:dk,ew:.3,d:-.05});B.cap([x,y-.6,z+.2],[x,y+.6,z+.9],.8,dk,{w1:.3,d:-.06});}}
  for(let i=0;i<10;i++)for(const g of[-1,1]){const y=-L*.5+ny*.5+i*L*.1;B.ball([g*R*.95,y,h+1+R*.15+(i%2)*.6],.9,i%2?dk:T(sk,.08),{flat:1,sy:.8,d:-.03});}
  // 배 비늘 줄
  for(let i=0;i<6;i++){const y=-L*.3+ny*.6+i*L*.14;B.cap([-R*.6,y,h+1-R*.75],[R*.6,y,h+1-R*.75],.4,'#7a7648',{d:-.02});}
  // 꼬리 위 이중 볏
  for(let i=1;i<q.tail.length;i++){const a=q.tail[i-1],b=q.tail[i];for(let k=0;k<3;k++){const c=M(a,b,k/3);for(const g of[-1,1])B.cap(A(c,[g*.9*(1-i*.15),0,1.2*(1-i*.1)]),A(c,[g*.9*(1-i*.15),-.6,2.6*(1-i*.15)]),1.2*(1-i*.12),dk,{w1:.2,d:-.04});}}
  // 발톱
  for(const lg of q.legs){for(let i=-1;i<=1;i++)B.cap(A(lg.ft,[i*.8,.6,.2]),A(lg.ft,[i*1.1,2,-.1]),.5,'#d8ccaa',{w1:.1,d:-.06});B.ball(lg.kn,1.6,dk,{d:-.03});}
  // 머리: 울퉁불퉁 주둥이·이빨 줄·눈두덩·콧구멍
  for(const hh of q.heads){const{hd,r,fwd,tip,sd}=hh,up=[0,0,1];
    for(let i=0;i<7;i++){const c=M(A(hd,fwd,r*.4),tip,i/6);B.ball(A(c,up,r*.42-i*.04),r*.16,i%2?dk:sc,{flat:1,sy:.6,d:-.04});
      for(const g of[-1,1]){const tb=A(A(c,sd,g*r*(.58-i*.05)),up,-r*.32);B.cap(tb,A(tb,up,-r*(.22+(i%2)*.12)),r*.09,'#efe6cc',{w1:r*.02,d:-.1});}}
    for(const g of[-1,1]){B.ball(A(A(A(hd,fwd,r*.5),sd,g*r*.5),up,r*.62),r*.32,dk,{sy:.8,d:-.04});B.ball(A(A(tip,sd,g*r*.22),up,r*.2),r*.1,'#141008',{flat:1,d:-.1});}
    B.ball(A(tip,up,r*.15),r*.3,T(sk,-.1),{sy:.7,d:-.06});
    B.line([A(A(hd,sd,-r*.6),up,-r*.3),A(A(tip,sd,-r*.35),up,-r*.3)],'#1a1a10',.4);B.line([A(A(hd,sd,r*.6),up,-r*.3),A(A(tip,sd,r*.35),up,-r*.3)],'#1a1a10',.4);}
  if(mode==='skill'&&f===2)B.ring(12,'200,255,120',.5);}
}]);

// ======================= 89. 바쿡 =======================
Q.push(['바쿡',{skin:'#6e5c6e',cloth:'#3a2a3a',sleeve:'#6e5c6e',forearm:'#6e5c6e',hand:'#5e4c5e',pants:'#2a2030',boot:'#1a141c',fur:'#4e3e4e',horns:'#d8c8b0',wcol:'#4a3a2a',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,{mode,f,t}=B,j=J(B);const sk='#6e5c6e',bone='#ddd0b8',lt='#3a2a20';
  // 털 망토(어깨~등)
  for(let i=0;i<14;i++){const a=Math.PI*.5+i/13*Math.PI,b=SF(B,a,sh+1,1.2);B.cap(b,A(b,[Math.sin(a)*1.4,-1.6,-7-(i%3)*1.6]),2.6,i%2?'#4e3e4e':'#3a2c3a',{w1:.6,d:.03});}
  fur(B,[...Array(10)].map((_,i)=>SF(B,-1.6+i*.36,sh+2,1.2)),'#5a4a5a',2.6,2,2);
  // 뼈 견갑
  for(const jj of[j.R,j.L]){const c=A(jj.sp,[jj.sg*1.3,0,2]);B.ball(c,3.8*bw,bone,{sy:.65,d:-.08});for(let i=0;i<3;i++)B.cap(A(c,[jj.sg*(i-1)*1.4,.4,1.2]),A(c,[jj.sg*((i-1)*1.8+1),.2,5.5-Math.abs(i-1)*1.8]),1.3,T(bone,-.08),{w1:.15,d:-.1});
    strap(B,A(c,[-jj.sg*2,1,-1]),SF(B,-jj.sg*.6,H+3,.8),lt,1.6);
    bracer(B,jj,'#2e2230',5*bw,{strap:'#8a7a60'});for(let i=0;i<3;i++)B.cap(M(jj.el,jj.h,.3+i*.2),A(M(jj.el,jj.h,.3+i*.2),[jj.sg*1.5,0,.6]),.8,bone,{w1:.1,d:-.07});
    for(let i=-1;i<=1;i++)B.cap(jj.h,A(jj.h,[i*.8,1.8,-.9]),.7,'#2a2016',{w1:.15,d:-.08});for(let i=-1;i<=1;i++)B.cap(A(jj.fp,[i*1,1.8,-.5]),A(jj.fp,[i*1.1,3.2,-1]),.6,'#2a2016',{w1:.1,d:-.06});}
  // 전투 문신(붉은 선)·해골 허리띠·가리개
  for(const g of[-1,1])B.line([SF(B,g*.5,sh,.6),SF(B,g*.25,sh-4,.6),SF(B,g*.55,sh-8,.6)],'rgba(180,30,30,.85)',.7);
  W2_belt(B,H+2,'#2a1e14','#b0a080',.9);W2_loin(B,H+1.5,8,'#3a2a3a',.5,1);for(const a of[-.7,.7]){const c=SF(B,a,H+1,1.8);B.ball(c,1.3,bone,{d:-.1});for(const g of[-1,1])B.ball(A(c,[g*.45,.9,.2]),.32,'#1a1010',{flat:1,d:-.11});}
  // 얼굴: 큰 엄니·눈두덩·코뼈 고리·뿔 마디
  brow(B,'#4a3a4a',.8,.42,.62);for(const g of[-1,1]){B.cap(HP(B,.3*g,.95,-.55),HP(B,.42*g,1.12,.1),hr*.2,'#efe4c8',{w1:hr*.06,d:-.11});}
  teeth(B,5,.92,-.5,.5,'#e8dcc0',.12);B.ball(HP(B,0,1.08,-.18),hr*.13,'#c0a050',{sy:.6,d:-.12});
  W2_hornRings(B,'#8a7a62',[[.6,0,.6],[1.2,-.3,1.5]],3);
  for(const g of[-1,1])B.line([HP(B,.5*g,.86,.25),HP(B,.65*g,.7,-.25)],'rgba(180,30,30,.85)',.5);
  // 뼈 박힌 몽둥이 + 손잡이 가죽
  {const pt=k=>A(p.hR,p.dS,k),u=PERP(p.dS),v=N(...CR(p.dS,u));for(let i=0;i<7;i++){const a=i*2.4,k=10+i*1.1,r=2+k*.1;const dir=A(A([0,0,0],u,Math.cos(a)),v,Math.sin(a));B.cap(A(pt(k),dir,r),A(pt(k),dir,r+2),.9,bone,{w1:.1,d:-.08});}
    for(let i=0;i<3;i++)B.cap(pt(-1+i*1.2),pt(-.6+i*1.2),2.6,lt,{d:-.05});B.cap(pt(13),pt(14),4.6,'#5a5258',{d:-.05});rivets(B,[A(pt(13.5),u,2.2),A(pt(13.5),u,-2.2)],'#b0a8a0',.5);}
  if(mode==='buff'||mode==='skill')B.glow(HP(B,0,1,.2),2+f*.6,'255,130,40',.5);}
}]);


// ======================= 92. 랫맨 =======================
Q.push(['랫맨',{skin:'#857468',cloth:'#4a3c30',sleeve:'#4a3c30',forearm:'#857468',hand:'#c89a94',pants:'#3e3228',boot:'#c89a94',tailc:'#d09a98',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,{mode,f,t}=B,j=J(B);const fr='#6e6056',dk='#3a2e26',pk='#d09a98';
  // 너덜한 두건 망토(등) + 자락
  B.poly([SF(B,Math.PI*.55,sh+2,1),SF(B,Math.PI*1.45,sh+2,1),SF(B,Math.PI*1.4,H-4,2),SF(B,Math.PI,H-7,2.4),SF(B,Math.PI*.6,H-4,2)],'#3a3028',{grad:1,edge:'#1e1812',ew:.4,d:.02});
  tatters(B,H-2,4,'#3a3028',6,Math.PI*.6,Math.PI*1.4,2.2,.5);
  B.ball(HP(B,0,-.45,.25),hr*1.0,'#3e3228',{sy:.8,d:.06});
  // 털 가닥(어깨·가슴)
  fur(B,[...Array(12)].map((_,i)=>SF(B,-1.8+i*.33,sh+1.5,.8)),fr,2.4,1.3,3);
  for(let i=0;i<6;i++)B.cap(SF(B,-.5+i*.2,sh-3-i%2,.6),SF(B,-.5+i*.2,sh-5-i%2,.7),.6,dk,{w1:.1,d:-.05});
  // 허리 주머니·벨트
  W2_belt(B,H+2,'#2a2018','#8a8070',.7);for(const a of[-.9,.8]){const c=SF(B,a,H+.8,1.6);B.ball(c,1.5,'#5a4630',{sy:.85,d:-.08});B.cap(A(c,[0,0,1.2]),A(c,[0,.4,.6]),1.4,'#4a3a28',{d:-.09});}
  B.line([SF(B,-.3,sh+1,1),SF(B,.6,H+2,1.1)],'#2a2018',1.2);
  for(const jj of[j.R,j.L]){bracer(B,jj,'#3e3228',3.6*bw,{strap:'#6a5a40'});for(let i=-1;i<=1;i++)B.cap(jj.h,A(jj.h,[i*.6,1.5,-.9]),.4,'#2a2018',{w1:.1,d:-.08});
    for(let i=-1;i<=1;i++)B.cap(A(jj.fp,[i*.8,1.6,-.6]),A(jj.fp,[i*.9,3,-1]),.4,pk,{w1:.1,d:-.06});}
  // 얼굴: 앞니·수염·코·눈두덩·귀 안쪽
  for(const g of[-1,1]){B.cap(HP(B,.06*g,1.55,-.5),HP(B,.07*g,1.6,-.85),hr*.1,'#f0e0a0',{w1:hr*.08,d:-.1});B.ball(HP(B,.7*g,-.05,.78),hr*.26,pk,{flat:1,d:-.02});
    for(let i=0;i<3;i++)B.line([HP(B,.15*g,1.7,-.25),HP(B,(.9+i*.1)*g,1.6+i*.15,-.2-i*.12)],'rgba(230,220,200,.8)',.25);}
  B.ball(HP(B,0,1.8,-.33),hr*.14,'#c06070',{d:-.1});brow(B,'#5a4a40',.75,.42,.5);
  // 단검: 굽은 날·독 방울
  {const pt=k=>A(p.hR,p.dS,k),u=PERP(p.dS);B.poly([pt(2.4),A(pt(6),u,1),A(pt(11),u,.6),pt(12.5),A(pt(7),u,-.4)],'#a8aeb0',{grad:1,edge:'#5a5e60',ew:.3,d:-.06});B.line([pt(3),A(pt(10),u,.4)],'#e8f0f0',.3);
    for(const k of[-2,-.8,.4])B.cap(pt(k-.25),pt(k+.25),1.8,'#3a2a1a',{d:-.06});B.glow(pt(11.5),1.4,'120,255,80',.6);B.ball(A(pt(11),[0,0,-1.2]),.4,'#80ff50',{d:-.08});}
  // 꼬리 마디 고리
  {const tl=W2_tail(B);for(let i=0;i<2;i++)for(let k=1;k<5;k++)B.cap(M(tl[i],tl[i+1],k/5-.02),M(tl[i],tl[i+1],k/5+.02),(i?2.3:3.2)-k*.15,'#a87070',{d:-.02});}}
}]);

// ======================= 95. 머맨 =======================
Q.push(['머맨',{skin:'#3e7e6c',cloth:'#3e7e6c',sleeve:'#3e7e6c',forearm:'#3e7e6c',hand:'#3e7e6c',pants:'#2c5c56',boot:'#24504a',fin:'#2aa08a',tailc:'#3a7466',wcol:'#d8e8e4',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,{mode,f,t}=B,j=J(B);const sc='#468a76',bel='#b8d0b0',fin='#2aa08a';
  // 몸 비늘(앞·옆·등) + 연한 배
  scales(B,H+2,sh+3,5,6,sc,-3.14,3.14,1.2);B.poly([SF(B,-.45,sh-1,.9),SF(B,.45,sh-1,.9),SF(B,.38,H+2,1),SF(B,-.38,H+2,1)],bel,{grad:1,d:-.06});for(let i=0;i<4;i++){const z=sh-2.5-i*3;B.line([SF(B,-.4,z,1.1),SF(B,.4,z,1.1)],'rgba(60,90,70,.6)',.4);}
  // 등지느러미(가시+막)
  for(let i=0;i<5;i++){const z=sh+1-i*3.2,b=SF(B,Math.PI,z,.4);B.poly([b,A(b,[0,-3.6+i*.3,1.6]),A(b,[0,-2.6,-3.2])],fin,{grad:1,alpha:.85,d:.02});B.cap(b,A(b,[0,-3.6+i*.3,1.6]),.5,'#1a5a4a',{w1:.1,d:.01});}
  // 해초 띠·조개 견갑
  B.line([SF(B,-.9,sh+1.5,.8),SF(B,-.2,sh-3,1),SF(B,.6,H+3,1),SF(B,1.1,H+1,.9)],'#4a6a20',1.1);for(let i=0;i<5;i++){const c=SF(B,-1.2+i*.6,H+1.5,1);B.cap(c,A(c,[Math.sin(t/300+i)*.8,.3,-3-i%2*1.5]),.9,i%2?'#4a7a24':'#3a5a1a',{w1:.4,d:-.06});}
  for(const jj of[j.R,j.L]){const c=A(jj.sp,[jj.sg*1,0,1.8]);B.ball(c,3.4*bw,'#d8b8a0',{sy:.6,d:-.08});for(let i=0;i<5;i++){const a=(i/4-.5)*2.2;B.line([A(c,[0,0,1.8]),A(c,[jj.sg*Math.sin(a)*3.2,Math.cos(a)*1.8,-.6])],'#a08068',.35);}
    // 팔지느러미·물갈퀴
    const fa=M(jj.el,jj.h,.3),fb=M(jj.el,jj.h,.8);B.poly([fa,A(fa,[jj.sg*3,-2,1]),A(fb,[jj.sg*2,-1.6,-.4]),fb],fin,{grad:1,alpha:.85,d:.01});
    for(let i=-1;i<=1;i++)B.cap(jj.h,A(jj.h,[i*.8,1.6,-.6]),.4,'#2a5a4c',{w1:.2,d:-.08});B.poly([A(jj.h,[-.8,1.6,-.6]),A(jj.h,[.8,1.6,-.6]),A(jj.h,[0,.4,0])],fin,{alpha:.7,d:-.07});
    B.poly([A(jj.kn,[jj.sg*.5,-.5,1]),A(jj.kn,[jj.sg*2.8,-2.5,0]),A(jj.kn,[jj.sg*.8,-.6,-3])],fin,{grad:1,alpha:.8,d:.02});
    for(let i=-1;i<=1;i++)B.cap(A(jj.fp,[i*.9,1.6,-.6]),A(jj.fp,[i*1.4,3.6,-1]),.5,fin,{w1:.3,d:-.06});}
  // 얼굴: 아가미·큰 눈·입
  for(const g of[-1,1]){for(let i=0;i<3;i++)B.line([HP(B,.75*g,.2-i*.18,.1),HP(B,.85*g,.15-i*.18,-.45)],'#1a4a3a',.45);B.ball(HP(B,.42*g,.75,.18),hr*.24,'#e8e890',{d:-.06});B.ball(HP(B,.45*g,.88,.18),hr*.11,'#101010',{flat:1,d:-.09});}
  B.cap(HP(B,-.45,.9,-.45),HP(B,.45,.9,-.45),hr*.12,'#1a2a24',{d:-.08});teeth(B,5,.92,-.42,.6,'#e8f0e8',.14);
  // 삼지창
  {const pt=k=>A(p.hR,p.dS,k),u=PERP(p.dS);B.cap(pt(21),pt(22),3,'#a08848',{d:-.06});B.cap(A(pt(21.5),u,-3.2),A(pt(21.5),u,3.2),1.2,'#b8c8c4',{d:-.06});
    for(const g of[-1,1]){B.cap(A(pt(21.5),u,g*3),A(pt(27),u,g*3.2),1,'#c8d8d4',{w1:.2,d:-.06});B.cap(A(pt(26),u,g*3.2),A(pt(25),u,g*2.2),.6,'#c8d8d4',{w1:.2,d:-.06});}
    B.line([pt(23),pt(29.5)],'#ffffff',.35);for(const k of[-2,-.6,.8])B.cap(pt(k-.25),pt(k+.25),1.7,'#2a5a4c',{d:-.06});B.ball(pt(21.5),.8,'#40e0d0',{glow:'120,230,220',d:-.08});}
  if(mode==='skill'||mode==='buff')for(let i=0;i<6;i++){const ph=((t/900)+i/6+f*.1)%1;B.ball([Math.sin(i*2.4)*8,Math.cos(i*1.9)*5,4+ph*36],.6+ph*.5,'#c0f0ff',{alpha:(1-ph)*.7,d:-.3});}}
}]);

// ======================= 98. 상어 =======================
Q.push(['상어',{skin:'#566676',belly:'#e8eae4',
 detail(B,K){const s=B.s,{mode,f,t}=B,run=mode==='run',walk=mode==='walk'||run;const h=s.h||8,L=s.len||16;
  const ph=t/(run?120:220)+f*1.5,sw=Math.sin(ph)*(walk?3:1.5);let lunge=0,jaw=0,roll=0;if(mode==='attack'){lunge=[-2,6,2][f];jaw=[.2,1,.3][f];}if(mode==='buff'){roll=[.3,.6,.6,.3][f];}if(mode==='skill'){lunge=[-4,0,9,3][f];jaw=[0,.4,1,.2][f];}
  const head=[0,L*.5+lunge,h],mid=[sw*.3,lunge*.4,h+.5],tail=[sw,-L*.5+lunge*.2,h];const dk='#3a4856',lt='#7a8a98';
  // 등 어두운 음영 + 옆 경계선
  B.cap(M(tail,mid,.3),M(mid,head,.7),3.6,dk,{w1:4.4,d:.02});
  for(const g of[-1,1]){B.line([A(M(tail,mid,.2),[g*2,0,-.4]),A(mid,[g*3.6,0,-.8]),A(M(mid,head,.7),[g*3.2,0,-.6]),A(head,[g*2.4,1.2,-.5])],'rgba(230,235,230,.55)',.6);
    // 아가미 구멍 5줄
    for(let i=0;i<5;i++){const c=A(M(mid,head,.42+i*.07),[g*3.4,0,0]);B.cap(A(c,[0,0,1.6]),A(c,[0,.3,-1.4]),.4,'#2a3440',{d:-.05});}
    // 큰 눈 + 반사
    const e=A(head,[g*2.4,-.2,.9]);B.ball(e,.95,'#0e0e12',{d:-.06});B.ball(A(e,[0,.2,.3]),.3,'#c8d8e8',{flat:1,d:-.08});
    // 콧구멍
    B.ball(A(head,[g*1.2,2.6,0]),.3,'#1a2028',{flat:1,d:-.06});}
  // 주둥이 끝
  B.ball(A(head,[0,2.6,.2]),2.4,'#5e6e7e',{sy:.8,d:.02});
  // 입선·이빨(항상 살짝)
  B.line([A(head,[-2.6,-.6,-1.6]),A(head,[0,2.4,-1.6]),A(head,[2.6,-.6,-1.6])],'#2a2a30',.5);
  for(let i=0;i<7;i++){const a=(i/6-.5)*2.4;const q=A(head,[Math.sin(a)*2.4,Math.cos(a)*2-.1,-1.5]);B.cap(q,A(q,[0,0,-.7-jaw*.6]),.4,'#f8f4ec',{w1:.05,d:-.12});}
  // 흉터·등지느러미 가장자리
  B.line([A(mid,[2,1,2.2]),A(mid,[3.2,3,1]),A(mid,[3,4.6,.4])],'#c8ccd0',.35);
  B.line([[0,lunge*.4+1,h+3.6],[0,lunge*.4-3,h+10+roll*3],[0,lunge*.4-5,h+3.6]],lt,.4);
  for(const g of[-1,1])B.line([[g*3,L*.15+lunge,h-1],[g*9,L*.05+lunge-2,h-3-roll*2]],lt,.35);
  B.poly([[sw*1.3,-L*.5-3.2,h+.2],[sw*1.6,-L*.5-5,h+7],[sw*1.45,-L*.5-4,h+.2]],dk,{d:-.02});
  // 물 튀김
  for(let i=0;i<5;i++){const ph2=((t/700)+i/5)%1;B.ball([Math.sin(i*2.7)*7,-L*.4+i*2,h-4+ph2*4],.5+ph2*.4,'#d8f0ff',{alpha:(1-ph2)*.6,d:-.4});}}
}]);

// ======================= 101. 사라만다 =======================
Q.push(['사라만다',{skin:'#b43a1c',chest:'#f0a040',legC:'#a4341a',paw:'#5a1a0a',tailc:'#b43a1c',spines:'#ffb040',
 detail(B,K){const q=QJ(B),{mode,f,t}=B;const sk='#b43a1c',dk='#6a1a0a',sc='#c84a24';const{h,L,ny,R}=q;const pu=.6+.35*Math.sin(t/150+f);
  // 비늘 점무늬
  for(let i=0;i<12;i++)for(let k=-2;k<=2;k++){const y=-L*.5+ny*.5+i*L*.09,a=k*.55;B.ball([Math.sin(a)*R*.98,y+(k%2)*.5,h+1+Math.cos(a)*R*.98],.75,(i+k)%3?sc:dk,{flat:1,sy:.8,d:-.03});}
  // 노란 띠 무늬
  for(let i=0;i<4;i++){const y=-L*.35+ny*.6+i*L*.25;B.cap([-R*.8,y,h+1+R*.4],[0,y+.4,h+1+R*1.02],1,'#f0c040',{w1:.4,d:-.04});B.cap([R*.8,y,h+1+R*.4],[0,y+.4,h+1+R*1.02],1,'#f0c040',{w1:.4,d:-.04});}
  // 불꽃 볏(등선)
  for(let i=0;i<7;i++){const y=-L*.45+ny*.5+i*L*.15,b=[0,y,h+1+R*.95],fl=Math.sin(t/90+i*1.3+f)*.6;B.cap(b,A(b,[fl,-1,3.2+i%2]),1.4,'#ff8a20',{w1:.2,d:-.06});B.glow(A(b,[0,-.4,2.4]),1.8,'255,150,40',.45*pu);}
  // 꼬리 끝 불꽃
  {const e=q.tail[q.tail.length-1];for(let i=0;i<3;i++)B.glow(A(e,[Math.sin(t/80+i)*.6,-.6,1+i*1.2]),2.6-i*.5,'255,'+(110+i*50)+',30',.75*pu);B.cap(e,A(e,[0,-1,2.4]),1.4,'#ffc040',{w1:.2});
    for(let i=1;i<q.tail.length;i++)B.cap(q.tail[i-1],A(q.tail[i-1],[0,-.8,2-i*.3]),1,'#ff9a30',{w1:.2,d:-.04});}
  for(const lg of q.legs){for(let i=-1;i<=1;i++)B.cap(A(lg.ft,[i*.7,.6,.2]),A(lg.ft,[i*.9,1.9,-.1]),.45,'#2a0a04',{w1:.1,d:-.06});B.ball(lg.kn,1.3,dk,{d:-.03});}
  for(const hh of q.heads){quadFace(B,hh,q.jaw,{brow:dk});const{hd,r,fwd,tip,sd}=hh,up=[0,0,1];
    for(const g of[-1,1]){B.cap(A(A(hd,sd,g*r*.5),up,r*.6),A(A(A(hd,sd,g*r*.9),up,r*1.4),fwd,-r*1.2),r*.24,'#3a1008',{w1:r*.05,d:-.05});B.ball(A(A(tip,sd,g*r*.25),up,r*.2),r*.1,'#1a0400',{flat:1,d:-.1});}
    B.glow(A(tip,up,-r*.2),1.2+q.jaw*2,'255,160,40',.5*pu);}
  if(mode==='skill'&&f>=1)for(let i=0;i<5;i++)B.glow([Math.sin(i*2)*4,Math.cos(i*3)*6,h+R+3+i],1.4,'255,180,60',.6);}
}]);


// ======================= 104. 유령 =======================
Q.push(['유령',{cloth:'#c8d2dc',armor:'#c8d2dc',sleeve:'#bcc8d4',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,{mode,f,t}=B,j=J(B);const sh1='#d8e2ec',sh2='#a8b6c4',gl='190,225,255';
  // 겹겹 수의 자락(흩날림)
  tatters(B,H+4,12,sh2,10,-3.14,3.14,1.2,2.2);tatters(B,sh-2,9,sh1,8,-3.14,3.14,1.5,1.4);
  for(let i=0;i<5;i++){const a=Math.PI+(i-2)*.35,sw=Math.sin(t/260+i+f)*2;const b=SF(B,a,H,1);B.poly([b,SF(B,a+.3,H,1),A(SF(B,a+.15,2,4),[sw,-3-(mode==='run'?5:mode==='walk'?2:0),0])],i%2?sh1:sh2,{grad:1,alpha:.7,d:.04});}
  // 두건(해골 위·뒤) + 너덜한 가장자리
  B.ball(HP(B,0,-.25,.25),hr*1.22,'#8e9cae',{sy:.92,d:.08});for(let i=0;i<7;i++){const a=(i/6-.5)*2.6;B.poly([HP(B,Math.sin(a)*1.05,Math.cos(a)*.35+.25,.85),HP(B,Math.sin(a+.25)*1.1,Math.cos(a+.25)*.35+.25,.7),HP(B,Math.sin(a+.12)*1.15,Math.cos(a+.12)*.3+.35,.35)],i%2?'#c8d4e0':'#a8b4c4',{d:-.03});}
  skullHQ(B,gl);
  // 쇠사슬 족쇄
  for(const jj of[j.R,j.L]){B.cap(M(jj.el,jj.h,.6),M(jj.el,jj.h,.82),3.6,'#4a4a52',{d:-.05});rivets(B,[M(jj.el,jj.h,.72)],'#8a8a96',.45);
    let a=M(jj.el,jj.h,.75);for(let i=0;i<5;i++){const b=A(a,[jj.sg*.4,-.9,-1.3+Math.sin(t/300+i)*.2]);B.ball(M(a,b,.5),.6,i%2?'#5a5a64':'#70707a',{sx:1.3,d:-.04});a=b;}
    B.cap(jj.h,A(jj.h,[0,.2,0]),1,'#c8d4e0',{alpha:.6});for(let i=-1;i<=1;i++)B.cap(jj.h,A(jj.h,N(i*.4,.8,-.3),4.2),.6,'#e8f0f8',{w1:.1,alpha:.85,d:-.07});}
  // 비치는 갈비뼈
  for(let i=0;i<3;i++){const z=sh-2-i*2.6;B.line([SF(B,-.9,z,.6),SF(B,-.1,z-.6,.8)],'rgba(70,80,100,.55)',.6);B.line([SF(B,.9,z,.6),SF(B,.1,z-.6,.8)],'rgba(70,80,100,.55)',.6);}
  B.line([SF(B,0,sh,.9),SF(B,0,H+2,.9)],'rgba(70,80,100,.5)',.6);
  // 영혼 잔광
  for(let i=0;i<6;i++){const ph=((t/1300)+i/6+f*.08)%1;B.glow([Math.sin(i*2.3+t/700)*7,-3+Math.cos(i*1.6)*4,4+ph*30],1.6*(1-ph)+.4,gl,(1-ph)*.6);}
  if(mode==='skill')B.glow(HP(B,0,1.2,-.4),3+f*1.2,gl,.6);}
}]);

// ======================= 107. 이프리트 =======================
Q.push(['이프리트',{skin:'#c8461a',cloth:'#ff7020',armor:'#a82a0e',sleeve:'#c8461a',forearm:'#c8461a',hand:'#c8461a',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,{mode,f,t}=B,j=J(B);const gold='#e8b040',pu=.6+.35*Math.sin(t/140+f);
  // 하체 불꽃 소용돌이
  for(let i=0;i<9;i++){const a=i/9*Math.PI*2+t/300+f*.7,r=4+(i%3)*1.5,z=H-6-(i%4)*3;B.glow([Math.cos(a)*r,Math.sin(a)*r*.6-1,z],3.2-(i%3)*.6,i%2?'255,140,40':'255,200,80',.6);}
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2+t/400;B.cap([Math.cos(a)*5,Math.sin(a)*3,H-2],[Math.cos(a+.8)*2,Math.sin(a+.8)*1.5-2,H-14-i%2*2],1.6,i%2?'#ff9a30':'#ff6010',{w1:.2,alpha:.8,d:.03});}
  // 근육선·용암 균열
  for(const g of[-1,1]){B.line([SF(B,g*.15,sh,.4),SF(B,g*.6,sh-4.5,.5),SF(B,g*.3,sh-7,.5)],'rgba(90,20,0,.6)',.6);B.line([SF(B,g*.9,sh-1,.5),SF(B,g*1.1,sh-5,.5),SF(B,g*.8,H+3,.5)],'rgba(255,220,120,'+pu+')',.45);}
  B.glow(SF(B,0,sh-3,1.5),2.4,'255,220,120',.5*pu);
  // 금 장신구: 가슴띠·팔찌·귀걸이·목걸이
  W2_belt(B,H+2,'#8a5a1a',gold,.8);for(let i=0;i<7;i++){const a=-1.1+i*.37,q=A(SF(B,a,sh+1.2,.9),[0,0,-Math.cos(a)*1.6]);B.ball(q,.55,gold,{d:-.1});}B.ball(SF(B,0,sh-.8,1.6),1,'#40d0ff',{glow:'120,220,255',d:-.12});
  for(const jj of[j.R,j.L]){for(const tt of[.15,.85])B.cap(M(jj.el,jj.h,tt-.05),M(jj.el,jj.h,tt+.05),4.8*bw,gold,{d:-.04});B.cap(M(jj.sp,jj.el,.55),M(jj.sp,jj.el,.65),5.2*bw,gold,{d:-.04});
    B.ball(A(jj.sp,[jj.sg*.5,0,1.4]),3.2*bw,'#8a2a0e',{sy:.7,d:-.05});for(let i=-1;i<=1;i++)B.cap(jj.h,A(jj.h,N(i*.4,.8,-.3),3.8),.75,'#2a0a04',{w1:.15,d:-.08});
    B.glow(jj.h,2+Math.sin(t/120+jj.sg)*.5,'255,150,40',.5);}
  for(const g of[-1,1]){B.ball(HP(B,.95*g,.05,-.25),hr*.14,gold,{d:-.04});B.ball(HP(B,.95*g,.05,-.55),hr*.1,gold,{d:-.04});}
  // 불꽃 갈기(머리 뒤)
  for(let i=0;i<8;i++){const a=(i/7-.5)*2.8,fl=Math.sin(t/80+i*1.7+f)*.25;const b=HP(B,Math.sin(a)*.8,-Math.cos(a)*.5-.2,.6);B.cap(b,HP(B,Math.sin(a)*1.1+fl,-Math.cos(a)*.9-.9,1.4+(i%2)*.4),hr*.3,i%2?'#ffb040':'#ff6a10',{w1:hr*.04,d:.02});}
  for(let i=0;i<4;i++)B.glow(HP(B,Math.sin(i*1.8)*.6,-.8,1.4+i*.2),2.2,'255,140,40',.5*pu);
  // 얼굴
  brow(B,'#6a1a08',.8,.42,.6);teeth(B,5,1.25,-.5,.4,'#fff0c0',.2);W2_hornRings(B,gold,[[.5,-.1,.8],[1.3,-.6,1.5]],2);
  for(let i=0;i<4;i++){const ph=((t/900)+i/4+f*.1)%1;B.glow([Math.sin(i*2.6)*8,Math.cos(i*1.7)*4,H+ph*30],1.2*(1-ph)+.4,'255,200,90',(1-ph)*.8);}}
}]);

// ======================= 110. 파이어 에그 =======================
function W2_blobZ(B){const s=B.s,{mode,f,t}=B,run=mode==='run',walk=mode==='walk'||run,r=s.r||9,ph=f*Math.PI/2;let hop=walk?Math.abs(Math.sin(ph))*(run?5:3):0,lunge=0;if(mode==='attack')lunge=[-2,5,1][f];if(mode==='skill')lunge=[0,0,2,0][f];const fl=s.float?6+Math.sin(t/500+f)*1.5:0;return{r,z0:fl+hop,lunge,walk,ph};}
Q.push(['파이어 에그',{skin:'#7a3418',
 detail(B,K){const{mode,f,t}=B,{r,z0,lunge,walk,ph}=W2_blobZ(B);const wob=walk?Math.sin(ph*2)*.12:Math.sin(t/500)*.04;const c=[wob*r,lunge,z0+r*1.2],pu=.55+.4*Math.sin(t/160+f*1.3),fx='255,140,40';
  const E=(ax,az,o=1.02)=>[c[0]+Math.sin(ax)*Math.cos(az)*r*.85*o,c[1]+Math.cos(ax)*Math.cos(az)*r*.85*o,c[2]+Math.sin(az)*r*1.15*o];
  // 껍질 판(어두운 바위 조각)
  for(let i=0;i<14;i++){const ax=i*2.39,az=Math.sin(i*1.7)*.9;B.ball(E(ax,az,.98),r*(.22+(i%3)*.05),i%2?'#4a1a0a':'#5e2410',{flat:1,sx:1.2,sy:.8,alpha:.9,d:-.02});}
  // 용암 균열망
  for(let k=0;k<4;k++){const ax0=k*1.57+.4;const pts=[];for(let i=0;i<6;i++)pts.push(E(ax0+Math.sin(i*1.9+k)*.35,-.9+i*.36,1.03));B.line(pts,'rgba(255,'+(150+k*20)+',60,'+(.6+pu*.4)+')',.7);B.line([pts[2],E(ax0+.6,-.1,1.03)],'rgba(255,200,90,.8)',.45);}
  B.glow(E(.2,.1,1),r*.45+pu*1.6,fx,.45);
  // 꼭대기 열기 가시
  for(let i=0;i<5;i++){const ax=i*1.26;B.cap(E(ax,1.1,.92),E(ax,1.35,1.15),1.1,'#3a1408',{w1:.2,d:-.02});}
  // 재·숯 둥지
  for(let i=0;i<9;i++){const a=i/9*Math.PI*2;B.ball([c[0]+Math.cos(a)*r*.8,lunge+Math.sin(a)*r*.6,z0+r*.25],r*.22,i%2?'#2a1a14':'#3a2418',{sy:.6,d:.05});if(i%3===0)B.glow([c[0]+Math.cos(a)*r*.8,lunge+Math.sin(a)*r*.6,z0+r*.3],1.4,fx,.5*pu);}
  for(let i=0;i<5;i++){const ph2=((t/900)+i/5+f*.12)%1;B.glow([Math.sin(i*2.3)*r*.6,lunge+Math.cos(i*1.7)*r*.4,z0+r*1.9+ph2*7],1.1*(1-ph2)+.3,'255,190,80',(1-ph2)*.85);}
  if(mode==='skill'&&f>=1)for(let i=0;i<6;i++){const a=i/6*Math.PI*2+f;B.glow([Math.cos(a)*r*1.6,lunge+Math.sin(a)*r*1.2,z0+r*1.2],1.6,fx,.7);}}
}]);

// ======================= 113. 드래곤 플라이 =======================
Q.push(['드래곤 플라이',{skin:'#2e6e80',wingC:'#c8f4ff',
 detail(B,K){const q=BJ(B),s=B.s,{mode,f,t}=B;const h=s.h||6,sk='#2e6e80',met='#4aa0a8',dk='#163a44';
  // 날개 맥(4장)
  const fl=Math.sin(t/60+f*2)*.6;for(const g of[-1,1])for(const[dy,len]of[[1,1],[-2,.85]]){const r0=[g*2.5,dy-.5,h+s.segs[1][2]+1.8],tip=[g*(s.wingL||12)*len*1.03,dy,h+4.5+fl*3.5];
    B.line([r0,M(r0,tip,.5),tip],'rgba(40,70,80,.7)',.35);B.line([A(r0,[0,.8,0]),[g*(s.wingL||12)*len*.95,dy+2.6,h+5+fl*4]],'rgba(40,70,80,.55)',.3);
    for(let k=1;k<5;k++){const a=M(r0,tip,k/5);B.line([A(a,[0,1.8*(1-k/6),.3]),A(a,[0,-1.6*(1-k/6),-.2])],'rgba(40,70,80,.4)',.25);}
    B.ball(A(M(r0,tip,.85),[0,.8,.2]),.5,'#1a3a44',{flat:1,sx:1.6,alpha:.8,d:-.32});}
  // 배 마디 고리·금속광
  const a=q.sp[0].p,b=q.sp[2].p;for(let i=0;i<7;i++){const c=M(A(a,[0,-.6,0]),b,i/7);B.cap(A(c,[0,-.25,0]),A(c,[0,.25,0]),(1.7+i*.08)*2,i%2?dk:met,{d:-.04});}
  for(const g of[-1,1])B.cap(A(a,[0,-1.2,.2]),A(a,[g*1,-2.8,.6]),.5,dk,{w1:.15});
  // 가슴 무늬
  const th=q.sp[3].p;B.ball(A(th,[0,0,q.sp[3].r*.6]),q.sp[3].r*.6,'#6ac0b0',{flat:1,sy:.45,d:-.06});for(const g of[-1,1])B.line([A(th,[g*1.4,-1.2,1.6]),A(th,[g*.6,1.2,2])],'#e8d040',.45);
  // 겹눈(큰 반구) + 턱
  const hp=q.hp,hr=q.hr;for(const g of[-1,1]){B.ball(A(hp,[g*hr*.55,hr*.25,hr*.35]),hr*.62,'#2ac860',{d:-.05});B.ball(A(hp,[g*hr*.45,hr*.45,hr*.6]),hr*.18,'#c8ffe0',{flat:1,alpha:.8,d:-.08});
    B.cap(A(hp,[g*hr*.3,hr*.8,-hr*.4]),A(hp,[g*hr*(.15-q.snap*.15),hr*1.3,-hr*.7]),.6,'#1a2a20',{w1:.2,d:-.07});}
  // 다리 털가시
  for(const lg of q.legs){B.ball(lg.knee,.6,dk,{d:-.03});for(let k=1;k<3;k++){const c=M(lg.knee,lg.ft,k/3);B.cap(c,A(c,[lg.sg*.4,.6,.4]),.3,dk,{w1:.05,d:-.03});}}
  if(mode==='skill'||mode==='buff')for(let i=0;i<5;i++){const a=i/5*Math.PI*2+t/200;B.glow([Math.cos(a)*9,Math.sin(a)*9,h+6+Math.sin(a*3)*2],1.2,'160,255,220',.7);}}
}]);


// ======================= 116. 눈사람 =======================
Q.push(['눈사람',{skin:'#f2f6fd',
 detail(B,K){const{mode,f,t}=B,{r,z0,lunge}=W2_blobZ(B);const R0=r,sk='#f2f6fd',sh='#c8d4e6';const hz2=[0,lunge+(mode==='attack'?[0,1.5,.5][f]:0),z0+R0*3.05];
  // 눈 덩이 질감(뭉친 덩어리)
  for(let i=0;i<16;i++){const a=i*2.39,zz=i<9?R0*.85:R0*2.1,rr=i<9?R0:R0*.72;const e=Math.sin(i*1.3)*.5;B.ball([Math.cos(a)*rr*.82*Math.cos(e),lunge+Math.sin(a)*rr*.82*Math.cos(e),z0+zz+Math.sin(e)*rr*.7],rr*.28,i%3?sk:sh,{sy:.8,alpha:.9,d:-.02});}
  B.ball([0,lunge,z0+R0*.2],R0*1.05,'#e4ecf8',{sy:.4,d:.25});
  // 목도리(감기 + 늘어진 끝, 술)
  const nz=z0+R0*2.68;for(let i=0;i<10;i++){const a=i/10*Math.PI*2;B.ball([Math.cos(a)*R0*.52,lunge+Math.sin(a)*R0*.52,nz],R0*.2,i%2?'#c03030':'#2a6a3a',{sy:.8,d:-.03});}
  const sw=Math.sin(t/260+f)*.8;for(let k=0;k<2;k++){const a0=[R0*(.25+k*.2),lunge+R0*.45,nz-.3],a1=[R0*(.4+k*.25)+sw,lunge+R0*.62,nz-R0*.9];B.cap(a0,a1,R0*.24,k?'#2a6a3a':'#c03030',{w1:R0*.22,d:-.06});for(let i=-1;i<=1;i++)B.cap(a1,A(a1,[i*.4,0,-1]),.35,'#e8d8a0',{d:-.07});}
  // 털모자(챙 + 방울)
  B.ball(A(hz2,[0,0,R0*.28]),R0*.46,'#c03030',{sy:.85,d:-.02});B.cap(A(hz2,[-R0*.5,0,R0*.22]),A(hz2,[R0*.5,0,R0*.22]),R0*.2,'#f0e8d8',{d:-.04});for(let i=0;i<3;i++)B.line([A(hz2,[-R0*.35,R0*.32,R0*(.35+i*.12)]),A(hz2,[R0*.35,R0*.32,R0*(.35+i*.12)])],'rgba(90,10,10,.6)',.35);
  B.ball(A(hz2,[0,-R0*.1,R0*.78]),R0*.18,'#f8f4ec',{d:-.05});
  // 석탄 눈·입, 당근 코 결
  for(let i=0;i<5;i++){const a=(i/4-.5)*1.4;B.ball(A(hz2,[Math.sin(a)*R0*.3,R0*.45,-R0*.18-Math.cos(a)*R0*.06]),R0*.045,'#1a1a1a',{flat:1,d:-.06});}
  for(let i=0;i<3;i++)B.line([A(hz2,[-.3,R0*(.6+i*.13),.1]),A(hz2,[.3,R0*(.62+i*.13),-.1])],'#b05010',.25);
  // 나뭇가지 손가락
  for(const g of[-1,1]){const e=[g*R0*1.5,lunge+(mode==='attack'&&f===1?R0:0),z0+R0*2.8+(mode==='buff'?R0*.6:0)];for(let i=-1;i<=1;i++)B.cap(e,A(e,[g*1.2,i*1,.8+i*.4]),.5,'#4a2e14',{w1:.15,d:-.03});B.cap(M([g*R0*.6,lunge,z0+R0*2.3],e,.5),A(M([g*R0*.6,lunge,z0+R0*2.3],e,.5),[0,-.4,1.2]),.4,'#4a2e14',{w1:.1});}
  // 고드름·반짝이
  for(let i=0;i<5;i++){const a=(i/4-.5)*2;B.cap([Math.sin(a)*R0*.62,lunge+Math.cos(a)*R0*.62,z0+R0*1.55],[Math.sin(a)*R0*.64,lunge+Math.cos(a)*R0*.64,z0+R0*1.1-(i%2)*.8],.6,'#d8f0ff',{w1:.1,alpha:.85,d:-.04});}
  for(let i=0;i<4;i++){const ph=((t/700)+i/4)%1;B.glow([Math.sin(i*2.6)*R0,lunge+Math.cos(i*1.9)*R0*.6,z0+R0*(1+i*.5)],.9*(1-ph)+.3,'220,240,255',(1-ph)*.8);}}
}]);

// ======================= 119. 에티 =======================
Q.push(['에티',{skin:'#e8eef4',cloth:'#e4eaf0',sleeve:'#e4eaf0',forearm:'#dfe6ee',hand:'#5e6a7a',pants:'#d4dce6',boot:'#5e6a7a',fur:'',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,{mode,f,t}=B,j=J(B);const w1='#f4f8fc',w2='#c8d4e2',fc='#5e6a7a';const fur=(B,pts,col,len,w,seed)=>pts.forEach((q,i)=>{const a=Math.sin(i*7.3+seed)*.8,c=Math.cos(i*5.1+seed);B.cap(q,A(q,[a*len*.4,c*.5,-len]),w*1.15,i%2?col:T(col,-.12),{w1:w*.55,d:-.05});});
  // 텁수룩한 털(몸통 링 3겹)
  for(let r=0;r<4;r++){const z=sh+1-r*4.6;fur(B,[...Array(16)].map((_,i)=>SF(B,-3.14+i*.39+r*.2,z,.6)),r%2?w1:w2,3.4,2.2,r);}
  fur(B,[...Array(14)].map((_,i)=>SF(B,-3.14+i*.45,H-1,.8)),w2,3.6,2.4,7);
  for(const jj of[j.R,j.L]){fur(B,[0,1,2,3,4].map(i=>A(M(jj.sp,jj.el,i/4),[jj.sg*1.6,0,.6])),w1,3,1.8,jj.sg);fur(B,[0,1,2,3].map(i=>A(M(jj.el,jj.h,i/4),[jj.sg*1.4,-.4,.6])),w2,2.6,1.6,jj.sg+3);
    fur(B,[0,1,2,3].map(i=>A(M(jj.hip,jj.kn,i/3),[jj.sg*2,0,0])),w1,3,2,jj.sg+5);fur(B,[0,1,2].map(i=>A(M(jj.kn,jj.fp,i/3),[jj.sg*1.8,.5,0])),w2,2.6,1.8,jj.sg+6);
    for(let i=-1;i<=1;i++)B.cap(jj.h,A(jj.h,N(i*.4,.8,-.4),3.4),.8,'#2a3038',{w1:.15,d:-.08});for(let i=-1;i<=1;i++)B.cap(A(jj.fp,[i*1.1,1.8,-.4]),A(jj.fp,[i*1.3,3.2,-1]),.6,'#2a3038',{w1:.1,d:-.06});
    // 어깨 얼음 결정
    for(let i=0;i<3;i++){const c=A(jj.sp,[jj.sg*(1+i*1.2),-.5,2.4-i*.6]);B.cap(c,A(c,[jj.sg*.6,-.4,2.4-i*.4]),1,'#bfe6ff',{w1:.1,alpha:.85,d:-.08});}}
  // 얼굴: 푸른 회색 가면·눈두덩·송곳니·입김
  B.ball(HP(B,0,.62,-.12),hr*.56,fc,{flat:1,sx:1.05,sy:.95,d:-.03});B.ball(HP(B,0,.7,-.1),hr*.42,T(fc,.15),{flat:1,alpha:.6,d:-.035});brow(B,'#3a4450',.82,.38,.55);B.ball(HP(B,0,1.0,-.1),hr*.16,'#1a2028',{d:-.08});
  B.ball(HP(B,0,.95,-.55),hr*.28,'#2a1820',{flat:1,sx:1.5,sy:.6,d:-.07});for(const g of[-1,1])B.cap(HP(B,.3*g,.98,-.45),HP(B,.32*g,1.02,-.8),hr*.12,'#f4f0e4',{w1:hr*.03,d:-.1});
  for(let i=0;i<10;i++){const a=(i/9-.5)*3.6;B.cap(HP(B,Math.sin(a)*.9,Math.cos(a)*.5+.1,.75),HP(B,Math.sin(a)*1.2,Math.cos(a)*.6-.1,.1),hr*.3,i%2?w1:w2,{w1:hr*.06,d:-.01});}
  if(mode==='attack'||mode==='skill'||mode==='idle')for(let i=0;i<3;i++){const ph=((t/800)+i/3)%1;B.ball(HP(B,0,1.3+ph*1.2,-.5+ph*.3),hr*(.12+ph*.15),'#e8f4ff',{alpha:(1-ph)*.5,d:-.3});}
  if(mode==='skill'||mode==='buff')for(let i=0;i<6;i++){const a=i/6*Math.PI*2+f*.5;B.glow([Math.cos(a)*11,Math.sin(a)*11,4+i%3*6],1.4,'200,230,255',.7);}}
}]);

// ======================= 122. 좀비 엘모어 병사 =======================
Q.push(['좀비 엘모어 병사',{skin:'#76866a',armor:'#4e4e40',sleeve:'#4a4a3c',forearm:'#76866a',hand:'#76866a',pants:'#3a3a2e',boot:'#26241c',helm:'#5c5c50',shield:'#4a4030',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,{mode,f,t}=B,j=J(B);const rust='#7a4a24',mail='#5a5a50',tab='#2e3a5a',gold='#a8904a';
  // 녹슨 사슬갑옷 + 바랜 엘모어 휘장(청·금) 찢어짐
  scales(B,H+1,sh+4,5,8,mail,-3.14,3.14,1);
  B.poly([SF(B,-.5,sh+2,1),SF(B,.5,sh+2,1),SF(B,.45,H-6,1.6),SF(B,.15,H-8,1.7),SF(B,0,H-5,1.7),SF(B,-.2,H-9,1.7),SF(B,-.45,H-6,1.6)],tab,{grad:1,edge:'#1a2036',ew:.4,d:-.07});
  B.line([SF(B,-.35,sh+1.5,1.4),SF(B,-.35,H-5,1.9)],gold,.45);B.line([SF(B,.35,sh+1.5,1.4),SF(B,.35,H-5,1.9)],gold,.45);
  B.poly([SF(B,0,sh-1,1.6),SF(B,.2,sh-3.5,1.6),SF(B,0,sh-6,1.6),SF(B,-.2,sh-3.5,1.6)],gold,{d:-.09});B.ball(SF(B,.25,H+2,1.6),1.4,'#3a2a20',{flat:1,alpha:.8,d:-.1});
  for(let i=0;i<5;i++)B.ball(SF(B,-2.4+i*1.2,sh-2-i%2*4,.8),1,rust,{flat:1,alpha:.75,d:-.06});
  W2_belt(B,H+1.5,'#2a2016','#7a6a4a',1.6);
  // 한쪽 견갑(찌그러짐)·팔 노출 상처
  pauldron(B,j.L,'#5a5a4e',bw,{rivet:'#8a7a5a',s:.85});B.ball(A(j.L.sp,[-2,1.6,1.4]),1,rust,{flat:1,d:-.1});
  for(const jj of[j.R,j.L]){bracer(B,jj,'#4a4a3c',4*bw,{strap:'#3a2a1a'});B.ball(M(jj.sp,jj.el,.6),1.1,'#4a1a14',{flat:1,d:-.05});
    greave(B,jj,'#4e4e42',5.6*bw,{knee:'#5c5c50',strap:'#3a2a1a'});for(let i=-1;i<=1;i++)B.cap(jj.h,A(jj.h,[i*.6,1.5,-1]),.5,'#2a2418',{w1:.15,d:-.08});}
  // 투구: 코가리개·찌그러짐·녹
  B.cap(HP(B,0,1.0,.6),HP(B,0,1.08,-.15),hr*.14,'#6a6a5e',{d:-.1});B.cap(HP(B,-.95,.3,.25),HP(B,.95,.3,.25),hr*.12,'#46463a',{d:-.06});
  for(let i=0;i<4;i++)B.ball(HP(B,-.7+i*.45,.62,.42),hr*.07,'#a09a84',{d:-.08});B.ball(HP(B,.5,.4,.7),hr*.22,rust,{flat:1,alpha:.8,d:-.07});B.cap(HP(B,0,-.2,1.1),HP(B,0,-.9,.8),hr*.12,'#6a6a5e',{d:-.03});
  B.ball(HP(B,-.36,.88,.1),hr*.18,'#c0ff60',{flat:1,glow:'170,255,90',d:-.09});teeth(B,4,.92,-.55,.4,'#b8b090',.15);B.ball(HP(B,0,.9,-.62),hr*.3,'#2a1410',{flat:1,sx:1.3,sy:.5,d:-.08});
  // 등에 박힌 부러진 화살
  for(const[a,z]of[[Math.PI+.3,sh-3],[Math.PI-.4,H+5]]){const b=SF(B,a,z,.5);B.line([b,A(b,[.6,-3.6,1.6])],'#6a5030',.6);B.poly([A(b,[.6,-3.6,1.6]),A(b,[1.4,-4,2.2]),A(b,[.6,-4.4,2.4])],'#a09080',{d:-.02});}
  spearHQ(B,'#8a7a68',rust,'#3a4a6a');shieldHQ(B,'#6a6a5e','cross',{ec:'#3a4a7a',boss:gold});
  for(let i=0;i<3;i++){const ph=((t/1500)+i/3)%1;B.glow([Math.sin(i*2.1)*5,0,H+6+ph*20],1.2*(1-ph)+.3,'170,255,90',(1-ph)*.4);}}
}]);

// ======================= 125. 흑기사 수색대 =======================
Q.push(['흑기사 수색대',{armor:'#2a2a32',pants:'#1e1e24',helm:'#2a2a32',cape:'#3a2a20',sleeve:'#3a2c22',forearm:'#2c2c34',hand:'#2a2420',boot:'#161418',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,{mode,f,t}=B,j=J(B);const rd='#7a1a1a',gm='#9a9aa6',lt='#3a2c22';
  // 가죽 상의 + 흉갑판
  scales(B,sh-4,sh+4,2,4,'#30303a',-1.1,1.1,1.6);B.poly([SF(B,-1.2,sh-4,.6),SF(B,1.2,sh-4,.6),SF(B,1.1,H+1,.7),SF(B,-1.1,H+1,.7)],lt,{grad:1,edge:'#1a1410',ew:.35,d:-.03});
  for(let i=0;i<3;i++)B.line([SF(B,-1,H+3+i*2.5,.9),SF(B,1,H+3+i*2.5,.9)],'rgba(0,0,0,.35)',.4);
  B.poly([SF(B,-.3,sh-3,1),SF(B,.3,sh-3,1),SF(B,.25,H-6,1.4),SF(B,0,H-8,1.5),SF(B,-.25,H-6,1.4)],rd,{grad:1,edge:'#3a0808',ew:.4,d:-.07});
  W2_belt(B,H+1.5,'#1a1410','#b09050',1);strap(B,SF(B,-.95,sh+1.5,.6),SF(B,.8,H+2,.8),'#1a1410',1.3,gm);
  for(const a of[.9,1.2]){const c=SF(B,a,H+.5,1.4);B.ball(c,1.2,'#3a2a1c',{sy:.85,d:-.08});}
  // 두건 망토 자락
  tatters(B,sh-1,14,'#3a2a20',6,Math.PI*.65,Math.PI*1.35,2,.6);
  quiver(B,'#3a2a1a','#7a1a1a',{fl:'#e0e0e0'});
  for(const jj of[j.R,j.L]){pauldron(B,jj,'#30303a',bw,{rivet:gm,s:.75});B.cap(A(jj.sp,[jj.sg*3,.6,2.2]),A(jj.sp,[jj.sg*4.2,.6,-2]),.5,rd,{d:-.1});
    bracer(B,jj,'#2c2c34',4*bw,{strap:gm});greave(B,jj,'#2a2a32',6*bw,{knee:'#3a3a46',strap:lt});
    for(let i=-1;i<=1;i++)B.ball(A(jj.h,[i*.7,1.4,.6]),.45,gm,{d:-.08});}
  // 투구: 눈 틈·볏·뺨가리개 + 두건 테두리
  B.ball(HP(B,0,-.35,.1),hr*1.15,'#3a2a20',{sy:.85,d:.08});
  B.cap(HP(B,0,.95,.9),HP(B,0,1.04,-.55),hr*.12,'#4a4a56',{d:-.12});for(const g of[-1,1]){for(let i=0;i<2;i++)B.cap(HP(B,.25*g+.1*i*g,.98,-.3),HP(B,.25*g+.1*i*g,.98,-.55),hr*.06,'#0a0a0c',{d:-.12});B.cap(HP(B,.85*g,.3,.1),HP(B,.75*g,.55,-.7),hr*.22,'#34343e',{d:-.06});}
  for(let i=0;i<3;i++)B.cap(HP(B,0,-.2-i*.4,1.08-i*.15),HP(B,0,-.6-i*.45,.3-i*.4),hr*(.26-i*.05),i%2?'#5a0a0a':'#7a1414',{w1:hr*.1,d:.02});
  bowHQ(B,'#2a1e16','#9a9aa6');arrowNock(B,'#4a3a2a','#c8ccd0','#8a1818');
  if(mode==='skill'||mode==='buff')B.glow(A(p.hL,[0,1,0]),2+f,'255,90,70',.5);}
}]);

// ======================= 128. 미노타우르스 =======================
Q.push(['미노타우르스',{skin:'#6a4a30',cloth:'#6a4a30',sleeve:'#6a4a30',forearm:'#6a4a30',hand:'#5a3e28',pants:'#4a2e1c',boot:'#1e1410',fur:'',horns:'#e8dcc0',
 detail(B,K){const{p,H,sh,bw,hd,hr}=B.J,{mode,f,t}=B,j=J(B);const fr='#4a3020',dk='#3a2416',lt='#7a5838';
  // 근육선·가슴털·흉터
  for(const g of[-1,1]){B.line([SF(B,g*.12,sh+.5,.4),SF(B,g*.7,sh-4.5,.5),SF(B,g*.25,sh-6,.5)],'rgba(40,20,10,.6)',.7);for(let i=0;i<3;i++)B.line([SF(B,g*.15,H+3+i*2.2,.5),SF(B,g*.5,H+3+i*2.2,.5)],'rgba(40,20,10,.45)',.5);}
  W2_scar(B,SF(B,-.6,sh,.6),SF(B,.2,sh-6,.6),'#4a1a10');W2_scar(B,SF(B,.7,sh-1,.6),SF(B,1,sh-5,.6),'#4a1a10');
  fur(B,[...Array(18)].map((_,i)=>SF(B,-3.14+i*.35,sh+2,.8)),fr,3.4,2.4,4);fur(B,[...Array(8)].map((_,i)=>SF(B,-1.4+i*.4,sh-2+Math.sin(i)*2,.6)),dk,2,1.2,2);
  // 가죽 허리·쇠 버클·가리개·해골
  W2_belt(B,H+2,'#2a1a10','#a0a4aa',1);W2_loin(B,H+1.5,9,'#4a2e1c',.55,1);B.ball(SF(B,.7,H+1,1.8),1.3,'#e8dcc0',{d:-.1});
  strap(B,SF(B,-.95,sh+1.5,.6),SF(B,.6,H+3,.8),'#2a1a10',1.8,'#a0a4aa');
  for(const jj of[j.R,j.L]){B.ball(A(jj.sp,[jj.sg*1,0,1.8]),3.6*bw,'#5a5e66',{sy:.65,d:-.07});rivets(B,[A(jj.sp,[jj.sg*1.5,2.2,2.2]),A(jj.sp,[jj.sg*2.6,1.6,.4])],'#c8c8cc',.5);B.cap(A(jj.sp,[jj.sg*1.5,0,3]),A(jj.sp,[jj.sg*3,-.6,6.4]),1.4,'#c8c8cc',{w1:.15,d:-.09});
    bracer(B,jj,'#3a2416',5.4*bw,{strap:'#8a8e96',rivet:'#c8c8cc'});fur(B,[0,1,2].map(i=>A(M(jj.hip,jj.kn,.4+i*.25),[jj.sg*2.2,-.5,0])),fr,2.6,1.6,jj.sg);
    // 굽(갈라진 발굽)
    B.ball(A(jj.fp,[0,1.6,-.6]),2.6*bw,'#1a1210',{sy:.7,d:-.05});B.cap(A(jj.fp,[0,2.2,-.9]),A(jj.fp,[0,4.2,-1.1]),.45,'#4a3a30',{d:-.07});
    for(let i=-1;i<=1;i++)B.cap(jj.h,A(jj.h,[i*.8,1.8,-.9]),.7,'#2a1a10',{w1:.2,d:-.08});}
  // 얼굴: 코뚜레·콧구멍·눈두덩·뿔 마디·이마 털
  B.ball(HP(B,0,1.32,-.42),hr*.4,'#3a2618',{sy:.7,d:-.06});for(const g of[-1,1])B.ball(HP(B,.18*g,1.5,-.4),hr*.08,'#0e0806',{flat:1,d:-.1});
  B.line([HP(B,-.18,1.55,-.55),HP(B,0,1.6,-.85),HP(B,.18,1.55,-.55)],'#d0b040',.7);brow(B,dk,.82,.4,.55);
  for(let i=0;i<6;i++)B.cap(HP(B,-.4+i*.16,.5,.85),HP(B,-.45+i*.18,.9,.55),hr*.14,i%2?fr:dk,{w1:hr*.03,d:-.07});
  for(const g of[-1,1])for(let i=0;i<3;i++){const c=M(HP(B,.7*g,0,.55),HP(B,1.6*g,.3,.8),.25+i*.25);B.ball(c,hr*(.34-i*.05),'#c8bc9e',{sy:.6,d:-.06});}
  for(const g of[-1,1])B.cap(HP(B,.85*g,-.1,.1),HP(B,1.4*g,-.35,0),hr*.28,'#6a4a30',{w1:hr*.08,d:.01});
  axeHQ(B,'#a0a4aa',{double:1,band:'#3a2416'});{const pt=k=>A(p.hR,p.dS,k);for(const k of[-2,-.6,.8,2.2])B.cap(pt(k-.3),pt(k+.3),2,'#2a1a10',{d:-.06});B.cap(pt(20.5),pt(23),1.2,'#a0a4aa',{w1:.2,d:-.22});}
  if(mode==='skill'||mode==='buff')for(let i=0;i<2;i++)B.ball(HP(B,.18*(i?1:-1),1.7+f*.2,-.45),hr*(.12+f*.04),'#e8e0d8',{alpha:.5,d:-.3});}
}]);

// ======================= 131. 나이트메어 =======================
Q.push(['나이트메어',{skin:'#1c161a',mane:'#4a1414',tailc:'#4a1414',legC:'#181216',paw:'#0a0808',
 detail(B,K){const q=QJ(B),{mode,f,t}=B;const sk='#1c161a',fl='255,80,30',pu=.6+.35*Math.sin(t/120+f);const{h,L,ny,R}=q;
  // 갈비뼈 드러난 옆구리
  for(const g of[-1,1])for(let i=0;i<4;i++){const y=-L*.1+ny*.7+i*1.6;B.cap([g*R*.98,y,h+R*.4],[g*R*.85,y+.4,h-R*.3],.6,'#5a4a4a',{w1:.4,d:-.04});}
  // 불타는 갈기(목선)
  const hh=q.heads[0];for(let i=0;i<9;i++){const c=M(A(hh.hd,[0,-1,2]),[0,L*.2+ny,h+R*.9],i/8),w=Math.sin(t/70+i*1.6+f)*.6;B.cap(c,A(c,[w,-2.4,2.6+(i%2)]),1.6,i%2?'#ff5a1a':'#c02a0a',{w1:.2,d:.02});B.glow(A(c,[0,-1.2,2]),2,fl,.45*pu);}
  // 마갑: 면갑(샤프롱)·목 판금·가죽 마구
  const{hd,r,fwd,tip,sd}=hh,up=[0,0,1];B.cap(A(A(hd,fwd,r*.2),up,r*.55),A(A(tip,fwd,-r*.4),up,r*.35),r*.5,'#3a3640',{w1:r*.35,d:-.05});B.cap(A(A(hd,fwd,r*.3),up,r*.9),A(A(hd,fwd,r*1.1),up,r*1.9),r*.25,'#8a8490',{w1:r*.03,d:-.07});
  for(const g of[-1,1]){B.ball(A(A(hd,sd,g*r*.7),up,r*.25),r*.3,'#3a3640',{sy:.8,d:-.05});B.line([A(A(hd,sd,g*r*.5),up,-r*.2),A(A(tip,sd,g*r*.35),up,-r*.1)],'#5a2a1a',.6);}
  for(let i=0;i<3;i++){const c=M(hh.neck,hh.hd,.15+i*.25);B.ball(A(c,up,1.4),2.2,i%2?'#2e2a34':'#3a3640',{sy:.6,d:-.04});}
  B.cap([-R*1,L*.25+ny,h+R*.3],[R*1,L*.25+ny,h+R*.3],1,'#3a2018',{d:-.03});B.ball([0,-L*.05+ny*.6,h+R*1.02],R*.6,'#2a1a1a',{sy:.5,d:-.04});B.cap([-R*.6,-L*.05+ny*.6,h+R*1],[R*.6,-L*.05+ny*.6,h+R*1],.8,'#b09050',{d:-.05});
  // 불꽃 발굽·꼬리
  for(const lg of q.legs){B.ball(A(lg.ft,[0,0,.4]),1.8,'#0a0606',{sy:.8,d:-.03});for(let i=0;i<2;i++)B.glow(A(lg.ft,[0,-.4,.6+i*1.2]),1.8-i*.5,fl,.65*pu);B.cap(A(lg.kn,[0,0,-.5]),A(lg.kn,[0,0,-2.4]),1.8,'#3a3640',{w1:1.6,d:-.04});}
  for(let i=1;i<q.tail.length;i++){const c=q.tail[i];B.glow(c,2.2,fl,.5*pu);B.cap(c,A(c,[Math.sin(t/80+i)*.6,-1.6,1.4]),1.2,'#ff5a1a',{w1:.2,alpha:.85});}
  // 붉은 눈 불꽃 꼬리
  for(const g of[-1,1]){const e=A(A(A(hd,fwd,r*.62),sd,g*r*.52),up,r*.28);B.cap(e,A(A(e,fwd,-r*1.2),up,r*.3),r*.12,'#ff6a2a',{w1:r*.02,alpha:.8,d:-.06});}
  B.glow(A(tip,up,-r*.1),1.4+q.jaw*1.5,fl,.5*pu);
  if(mode==='skill'||mode==='buff')for(let i=0;i<6;i++){const ph=((t/600)+i/6+f*.15)%1;B.glow([Math.sin(i*2.4)*R*1.4,-L*.4+i*2,ph*10],1.6*(1-ph)+.4,fl,(1-ph)*.7);}}
}]);


// ======================= 3차(133~196) 공통: 기반 HQ 상속·색 변환 =======================
// 기반 몬스터의 HQ detail(다른 작업자 것 포함)을 렌더 시점에 찾아 호출
function W2_base(n){const q=window.MRHQ||[];for(let i=q.length-1;i>=0;i--)if(q[i][0]===n)return q[i][1];return null;}
function W2_inh(B,K,n){const b=W2_base(n);if(b&&b.detail)b.detail(B,K);}
// 색 변환: fn([h,s,l]) → [h,s,l]
function W2_rgb2hsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;}return[h,s,l];}
function W2_hsl2rgb(h,s,l){h=((h%360)+360)%360/360;const f=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;return t<1/6?p+(q-p)*6*t:t<1/2?q:t<2/3?p+(q-p)*(2/3-t)*6:p;};if(!s)return[l*255,l*255,l*255].map(Math.round);const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;return[f(p,q,h+1/3),f(p,q,h),f(p,q,h-1/3)].map(v=>Math.round(Math.max(0,Math.min(1,v))*255));}
function W2_rcTriple(c,fn){const[h,s,l]=fn(W2_rgb2hsl(c[0],c[1],c[2]));return W2_hsl2rgb(h,Math.max(0,Math.min(1,s)),Math.max(0,Math.min(1,l)));}
function W2_rcCol(col,fn){if(typeof col!=='string')return col;let m=col.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)$/);if(m){const c=W2_rcTriple([+m[1],+m[2],+m[3]],fn);return m[4]!=null?'rgba('+c.join(',')+','+m[4]+')':'rgb('+c.join(',')+')';}
  if(col[0]==='#'){const c=W2_rcTriple(hx(col),fn);return'#'+c.map(v=>v.toString(16).padStart(2,'0')).join('');}return col;}
function W2_rcStr(c,fn){if(typeof c!=='string')return c;const m=c.split(',');if(m.length!==3)return c;return W2_rcTriple(m.map(Number),fn).join(',');}
function W2_RC(B,fn){const R=Object.create(B),m=c=>W2_rcCol(c,fn),ms=c=>W2_rcStr(c,fn),og=o=>o&&o.glow?{...o,glow:ms(o.glow)}:o;
  R.ball=(p,r,col,o={})=>B.ball(p,r,m(col),og(o));R.cap=(a,b,w,col,o={})=>B.cap(a,b,w,m(col),o);R.poly=(pts,col,o={})=>B.poly(pts,m(col),o);R.line=(pts,col,w,o={})=>B.line(pts,m(col),w,o);
  R.glow=(p,r,c,a)=>B.glow(p,r,ms(c),a);R.spark=(p,r,c,a)=>B.spark(p,r,ms(c),a);R.ring=(r,c,a)=>B.ring(r,ms(c),a);R.arc=(pts,c,w)=>B.arc(pts,ms(c),w);return R;}
// 색상 범위 [h0,h1]을 목표 색상 h2로(채도·밝기 배율)
const W2_hueTo=(h0,h1,h2,sm=1,lm=1)=>([h,s,l])=>{const inR=h0<=h1?(h>=h0&&h<=h1):(h>=h0||h<=h1);return inR&&s>.08?[h2+(h-(h0+h1)/2)*.2,s*sm,l*lm]:[h,s,l];};
const W2_chain=(...fs)=>c=>{let hsl=c;for(const f of fs)hsl=f(hsl);return hsl;};

// ======================= 134. 다이어울프 =======================
Q.push(['다이어울프',{tailc:'#3a3a40',legC:'#3e3e44',paw:'#222226',earC:'#38383e',
 detail(B,K){W2_inh(B,K,'늑대');const q=QJ(B),{mode,f,t}=B,hh=q.heads[0],{hd,r,fwd,tip,sd}=hh,up=[0,0,1];
  // 두꺼운 목 갈기
  for(let i=0;i<14;i++){const a=(i/13-.5)*3.4;const base=A(hh.neck,[Math.sin(a)*4.4*q.bw,-1.5-Math.abs(a)*.3,Math.cos(a)*3.8*q.bw]);B.cap(base,A(base,[Math.sin(a)*2.2,-3.6,Math.cos(a)*1-1.2]),2.4,i%3?'#2e2e34':'#4a4a52',{w1:.35,d:-.04});}
  // 등줄기 거친 털
  for(let i=0;i<8;i++){const y=-q.L*.45+q.ny*.5+i*q.L*.13;const b=[0,y,q.h+1+q.R*.98];B.cap(b,A(b,[Math.sin(i*2.1)*.6,-2.4,1.8]),1.5,i%2?'#26262a':'#3a3a42',{w1:.2,d:-.04});}
  // 얼굴 흉터
  B.line([A(A(A(hd,fwd,r*.3),sd,r*.6),up,r*.8),A(A(A(hd,fwd,r*.9),sd,r*.55),up,r*.1),A(A(tip,sd,r*.4),up,-r*.1)],'#7a3a34',.5);
  // 긴 송곳니
  for(const g of[-1,1]){const fb=A(A(A(tip,fwd,-r*.25),sd,g*r*.32),up,-r*.2);B.cap(fb,A(A(fb,up,-r*(.55+q.jaw*.25)),fwd,r*.05),r*.14,'#f4ecd4',{w1:r*.03,d:-.12});}
  // 빛나는 눈·잔광
  for(const g of[-1,1]){const e=A(A(A(hd,fwd,r*.62),sd,g*r*.52),up,r*.28);B.glow(e,1.6,'255,200,40',.55);if(q.walk)B.cap(e,A(A(e,fwd,-r*1.4),up,r*.15),r*.1,'#ffd040',{w1:r*.02,alpha:.5,d:-.06});}
  // 큰 발톱
  for(const lg of q.legs)for(let i=-1;i<=1;i++)B.cap(A(lg.ft,[i*.8,1,.3]),A(lg.ft,[i*.9,2.6,-.2]),.6,'#d8d0b8',{w1:.12,d:-.07});
  // 하울링 입김
  if(mode==="buff")for(let i=0;i<5;i++){const ph=((t/700)+i/5+f*.2)%1;B.glow(A(tip,[Math.sin(i*2)*1.5,1+ph*4,ph*2]),1.4*(1-ph)+.4,'230,230,240',(1-ph)*.5);}}
}]);

// ======================= 137. 레서 데몬 =======================
Q.push(['레서 데몬',{skin:'#6e2622',armor:'#3a1210',sleeve:'#6e2622',forearm:'#6e2622',pants:'#2a0a08',boot:'#160606',wings:'#4a1612',horns:'#2a1a14',cape:null,
 detail(B,K){const{p,H,sh,bw,hr}=B.J,{mode,f,t}=B,j=J(B),sk=B.s.skin,dk=T(sk,-.35),lava='255,110,40',pu=.55+.35*Math.sin(t/170+f);
  wingHQ(B,'#2a0a08',{claw:'#c8b8a0',vein:'rgba(255,90,40,.45)'});
  // 근육 음영·복근
  for(let i=0;i<3;i++)for(const g of[-1,1])B.ball(SF(B,g*.25,H+3+i*3,.3),1.5*bw,i%2?T(sk,-.1):T(sk,.04),{sy:.75,d:-.06});
  for(const g of[-1,1])B.line([SF(B,g*.1,sh+3,.6),SF(B,g*.75,sh-.5,.6),SF(B,g*1.3,sh+3,.6)],dk,.7);
  // 용암 문양
  B.line([SF(B,-.5,sh+2,.8),SF(B,-.2,sh-3,.8),SF(B,.2,sh-5,.8),SF(B,.5,sh-1,.8)],'rgba(255,120,40,'+(.4+pu*.5).toFixed(2)+')',.5);
  // 등뼈 가시
  for(let i=0;i<4;i++){const c=SF(B,3.14,sh+2-i*3.2,.4);B.cap(c,A(c,[0,-2.2,1.2]),1.2-i*.12,'#d8c8b0',{w1:.12,d:.04});}
  // 허리띠·찢어진 허리천
  W2_belt(B,H+2,'#2a0a08','#a08040',.8);tatters(B,H+1.5,6,'#2a0606',6,-1,1,1,.3);tatters(B,H+1.5,5,'#2a0606',5,2.3,4,1,.3);
  for(const jj of[j.R,j.L]){
    for(let i=0;i<3;i++)B.cap(A(jj.sp,[jj.sg*(1+i*.6),-1+i*.5,2.4-i*.6]),A(jj.sp,[jj.sg*(2+i*.9),-2.5+i*.4,5.6-i*1.2]),1.1-i*.15,'#d8c8b0',{w1:.12,d:-.1});
    bracer(B,jj,'#3a1210',4.4*bw,{strap:'#6a2a1a'});
    for(let i=-1;i<=1;i++){const a=A(jj.h,[i*.8,.8,-.2]),b=A(a,[i*.5,2.4,-1]);B.cap(a,b,.8,'#e0d4bc',{w1:.4,d:-.09});B.cap(b,A(b,[0,.8,-1.4]),.4,'#e0d4bc',{w1:.08,d:-.09});}
    greave(B,jj,'#3a1210',5.6*bw,{knee:'#4a1814',strap:'#6a2a1a'});
    for(let i=-1;i<=1;i++)B.cap(A(jj.fp,[i*1,1.5,-.6]),A(jj.fp,[i*1.1,3.2,-1.1]),.6,'#d8ccb0',{w1:.1,d:-.06});}
  // 얼굴
  brow(B,'#3a0c0a',.8,.42,.62);teeth(B,4,1.25,-.5,.36,'#f0e4c8',.2);
  for(const g of[-1,1])B.cap(HP(B,.28*g,1.25,-.4),HP(B,.3*g,1.3,-.85),hr*.11,'#f4ead0',{w1:hr*.03,d:-.11});
  W2_hornRings(B,'#4a2e24',[[.5,-.1,.8],[1.3,-.6,1.5]],3);
  W2_spade(B,'#4a1410');
  if(mode==='attack'&&f===1)for(const jj of[j.R,j.L])B.glow(A(jj.h,[0,2,0]),2.6,lava,.6);
  if(mode==='skill')B.glow(A(p.hR,[0,2,1]),2+f,lava,.6);}
}]);

// ======================= 140. 얼음 여왕의 시녀 =======================
Q.push(['얼음 여왕의 시녀',{cloth:'#86bce4',hair:'#e4f4ff',
 detail(B,K){const{p,H,sh,bw,hr}=B.J,{mode,f,t}=B,j=J(B),fx='150,230,255';
  robeHQ(B,'#86bce4','#e8f8ff',{hemDark:1});
  // 얼음 흉갑·보석
  B.poly([SF(B,-.7,sh+2,.7),SF(B,.7,sh+2,.7),SF(B,.5,sh-5,.9),SF(B,0,sh-7,1),SF(B,-.5,sh-5,.9)],'#b8e4fa',{grad:1,edge:'#ffffff',ew:.4,d:-.08});
  B.line([SF(B,0,sh+1.5,1),SF(B,0,sh-6,1.1)],'rgba(255,255,255,.6)',.35);B.ball(SF(B,0,sh-2,1.4),1.1,'#e8fcff',{glow:fx,d:-.1});
  W2_belt(B,H+2,'#4a78a8','#e8f8ff',.7);
  // 어깨 얼음 결정·팔 보호대
  for(const jj of[j.R,j.L]){for(let i=0;i<3;i++){const b=A(jj.sp,[jj.sg*(.5+i*1.2),-.5+i*.3,1.4]);B.poly([A(b,[-.7,0,0]),A(b,[jj.sg*.6,-.3,3.4-i*.8]),A(b,[.7,0,0]),A(b,[0,.4,-.6])],i%2?'#d8f6ff':'#a8dcf4',{grad:1,edge:'#ffffff',ew:.3,d:-.08});}
    bracer(B,jj,'#a8d8f4',3.6*bw,{strap:'#4a78a8'});}
  // 흘러내린 긴 머리칼
  for(let i=0;i<7;i++){const a=(i/6-.5)*2.6,sw=Math.sin(t/400+i)*.15;B.cap(HP(B,Math.sin(a)*.85,-Math.cos(a)*.5-.3,.4),HP(B,Math.sin(a)*1.1+sw,-Math.cos(a)*.6-.9,-2.6-Math.abs(Math.sin(i*1.7))*.6),hr*.26,i%2?'#e4f4ff':'#c4e0f4',{w1:hr*.1,d:.05});}
  // 얼음 티아라
  for(let i=-2;i<=2;i++)B.poly([HP(B,i*.28-.1,.55,.78),HP(B,i*.3,.55-Math.abs(i)*.1,1.25+(i===0?.45:0)-Math.abs(i)*.08),HP(B,i*.28+.1,.55,.78)],'#e0f8ff',{edge:'#ffffff',ew:.25,d:-.08});
  B.ball(HP(B,0,.85,.75),hr*.12,'#80e0ff',{glow:fx,d:-.1});
  // 얼음 창
  spearHQ(B,'#bfeeff','#e8f8ff','#a0d8ff');{const pt=k=>A(p.hR,p.dS,k);B.glow(pt(26),2.2,fx,.45);if(mode==='attack'&&f===1)B.spark(pt(30),5,fx,.7);}
  for(let i=0;i<5;i++){const ph=((t/1300)+i/5+f*.1)%1;B.glow([Math.cos(i*2.3)*9,Math.sin(i*1.9)*6,4+ph*30],1.1,fx,(1-ph)*.6);}}
}]);

// ======================= 143. 사악한 비홀더 =======================
const W2_evilRC=W2_chain(W2_hueTo(250,350,335,.9,.7),W2_hueTo(90,170,0,1.2,.9));
Q.push(['사악한 비홀더',{
 detail(B,K){W2_inh(W2_RC(B,W2_evilRC),K,'비홀더');const{mode,f,t}=B,{r,z0,lunge}=W2_blobZ(B),c=[0,lunge,z0+r],act=mode==='skill'||mode==='attack';
  // 핏줄
  for(let i=0;i<6;i++){const a=i*1.05+.3,pts=[];for(let k=0;k<5;k++){const b=a+Math.sin(k*1.7+i)*.25,el=.75-k*.32;pts.push(A(c,[Math.cos(b)*Math.cos(el),Math.sin(b)*Math.cos(el)*(Math.sin(b)>.4?.6:1),Math.sin(el)],r*1.01));}B.line(pts,'rgba(160,20,30,.75)',.45,{d:-.03});}
  // 뒤쪽 뼈 가시 능선
  for(let i=0;i<5;i++){const a=Math.PI*1.5+(i-2)*.38,el=.15+Math.abs(i-2)*.05;const b=A(c,[Math.cos(a)*Math.cos(el),Math.sin(a)*Math.cos(el),Math.sin(el)],r*.95);B.cap(b,A(b,[Math.cos(a)*1.5,Math.sin(a)*2.6,1.4]),1.3,'#d8c8b0',{w1:.15,d:.02});}
  // 핏빛 눈 기운·침
  B.glow([0,lunge+r*.95,z0+r*1.15],r*.35+(act?2:0),'255,40,40',act?.7:.35);
  if(act)for(let i=0;i<2;i++)B.cap([(i-.5)*r*.4,lunge+r*.9,z0+r*.45],[(i-.5)*r*.4,lunge+r*.92,z0+r*.45-1.6-f*.5],.35,'rgba(220,200,200,.7)',{w1:.2,d:-.08});
  if(mode==='buff'||mode==='skill')for(let i=0;i<5;i++){const ph=((t/900)+i/5)%1;B.glow([Math.sin(i*2.3)*r,lunge+Math.cos(i*1.3)*r*.6,z0+ph*r*2.6],1.2*(1-ph)+.3,'255,60,60',(1-ph)*.6);}}
}]);

// ======================= 146. 공포의 파이어 에그 =======================
Q.push(['공포의 파이어 에그',{
 detail(B,K){W2_inh(W2_RC(B,([h,s,l])=>[h<40||h>330?h-6:h,s,l*.8]),K,'파이어 에그');const{mode,f,t}=B,{r,z0,lunge,walk,ph}=W2_blobZ(B);const wob=walk?Math.sin(ph*2)*.12:Math.sin(t/500)*.04;const c=[wob*r,lunge,z0+r*1.2],pu=.55+.4*Math.sin(t/140+f*1.3),fx='255,60,20';
  const E=(ax,az,o=1.02)=>[c[0]+Math.sin(ax)*Math.cos(az)*r*.85*o,c[1]+Math.cos(ax)*Math.cos(az)*r*.85*o,c[2]+Math.sin(az)*r*1.15*o];
  // 흑요석 가시 껍질
  for(let i=0;i<10;i++){const ax=i*2.39+.5,az=-.5+(i%4)*.38;const b=E(ax,az,.98);B.cap(b,E(ax,az+.1,1.35),1.3,i%2?'#1a0806':'#2a0e0a',{w1:.15,d:-.03});}
  // 균열 사이 공포의 얼굴(정면: 두 눈구멍·입 균열)
  for(const g of[-1,1]){const e=E(g*.32,.25,1.03);B.ball(e,r*.13,'#ff8a30',{flat:1,sy:.7,glow:fx,d:-.06});}
  B.line([E(-.35,-.2,1.03),E(-.15,-.3,1.03),E(0,-.22,1.03),E(.15,-.32,1.03),E(.35,-.2,1.03)],'rgba(255,170,60,'+(.6+pu*.4).toFixed(2)+')',.8);
  B.glow(E(0,0,1),r*.6+pu*2,fx,.35+pu*.2);
  // 검은 연기·불티
  for(let i=0;i<5;i++){const ph2=((t/1100)+i/5+f*.1)%1;B.ball([Math.sin(i*2.1)*r*.5,lunge+Math.cos(i*1.3)*r*.3,z0+r*2.2+ph2*8],1.6+ph2*2,'#1a1010',{alpha:(1-ph2)*.5,d:.1});}
  if(mode==='skill'&&f>=1)for(let i=0;i<6;i++){const a=i/6*Math.PI*2+f;B.glow([Math.cos(a)*r*1.3,lunge+Math.sin(a)*r*1.3,z0+r*(.6+f*.3)],1.8,fx,.8);}}
}]);

// ======================= 149. 난폭한 해골돌격병 / 152. 난폭한 해골창병 =======================
function W2_rageSkel(B){const{p,H,sh,bw,hr}=B.J,{mode,f,t}=B,j=J(B),rf='255,50,30',pu=.55+.4*Math.sin(t/120+f);
  // 이마 핏빛 룬·눈 불꽃 꼬리
  B.line([HP(B,-.25,.88,.62),HP(B,0,.95,.85),HP(B,.25,.88,.62)],'rgba(255,60,40,.85)',.45);
  for(const g of[-1,1]){const e=HP(B,.36*g,.9,.1);B.glow(e,1.8,rf,.75*pu+.2);B.cap(e,A(HP(B,.5*g,.2,.45),[0,-1,1]),hr*.12,'#ff5030',{w1:hr*.02,alpha:.7,d:-.1});}
  // 갈비뼈 안 붉은 핵
  B.glow([0,1,sh-4],2.6+pu,rf,.5);
  // 찢어진 붉은 천(허리·견갑)
  tatters(B,H+1.6,7,'#6a1010',6,-1.1,1.1,1.1,.4);tatters(B,H+1.6,6,'#4a0a0a',4,2.3,4,1.1,.4);
  for(const jj of[j.R,j.L]){B.cap(A(jj.sp,[jj.sg*1.4,0,3]),A(jj.sp,[jj.sg*3.4,-.6,6.4]),1.1,'#d8d0c0',{w1:.12,d:-.12});B.cap(A(jj.sp,[jj.sg*.4,-.5,3.2]),A(jj.sp,[jj.sg*1.6,-1.6,6]),.8,'#c8c0b0',{w1:.1,d:-.12});
    B.cap(M(jj.el,jj.h,.4),M(jj.el,jj.h,.6),2.2,'#5a1010',{d:-.05});}
  // 무기 피 얼룩
  {const pt=k=>A(p.hR,p.dS,k);for(const k of[17,20])B.ball(pt(k),.7,'#7a1010',{flat:1,alpha:.8,d:-.25});}
  for(let i=0;i<4;i++){const ph=((t/900)+i/4+f*.08)%1;B.glow([Math.sin(i*2.3)*6,Math.cos(i*1.7)*4,6+ph*30],1.2*(1-ph)+.3,rf,(1-ph)*.55);}
  if(mode==='attack'&&f===1)B.glow(A(p.hR,p.dS,18),4,rf,.6);}
Q.push(['난폭한 해골돌격병',{
 detail(B,K){W2_inh(W2_RC(B,([h,s,l])=>s<.15&&l<.5?[h,s,l*.75]:[h,s,l]),K,'해골돌격병');W2_rageSkel(B);}
}]);
Q.push(['난폭한 해골창병',{
 detail(B,K){W2_inh(B,K,'해골창병');W2_rageSkel(B);}
}]);

// ======================= 155. 시어 =======================
const W2_seerRC=W2_chain(W2_hueTo(250,350,218,1,1),W2_hueTo(90,170,200,1,1.1));
Q.push(['시어',{
 detail(B,K){W2_inh(W2_RC(B,W2_seerRC),K,'비홀더');const{mode,f,t}=B,{r,z0,lunge}=W2_blobZ(B),c=[0,lunge,z0+r],fx='130,200,255',act=mode==='skill'||mode==='attack',pu=.55+.4*Math.sin(t/200+f);
  // 비전 문양 띠(몸 둘레)
  const pts=[];for(let i=0;i<=20;i++){const a=i/20*Math.PI*2;pts.push(A(c,[Math.cos(a),Math.sin(a),-.15],r*1.01));}B.line(pts,'rgba(150,210,255,'+(.35+pu*.4).toFixed(2)+')',.5);
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2+.2;const b=A(c,[Math.cos(a),Math.sin(a),-.15],r*1.02);B.ball(b,.55,'#d0f0ff',{flat:1,glow:fx,d:-.04,alpha:.9});}
  // 머리 위 떠다니는 수정
  const cz=[0,lunge-r*.1,z0+r*2.95+Math.sin(t/400)*1];B.poly([A(cz,[0,0,2.6]),A(cz,[1.3,0,0]),A(cz,[0,0,-2.2]),A(cz,[-1.3,0,0])],'#a8e0ff',{grad:1,edge:'#ffffff',ew:.3,d:-.02});B.glow(cz,3+pu*1.5,fx,.55);
  // 주위를 도는 빛 구슬
  for(let i=0;i<3;i++){const a=t/500+i*2.09+f*.4;B.ball([Math.cos(a)*r*1.5,lunge+Math.sin(a)*r*1.5,z0+r*1.2+Math.sin(a*2)*2],.9,'#e0f4ff',{glow:fx});}
  if(act)B.glow([0,lunge+r*1.05,z0+r*1.15],r*.4+f,fx,.6);}
}]);


// ======================= 158. 와일드 베놈 =======================
Q.push(['와일드 베놈',{
 detail(B,K){const q=QJ(B),{mode,f,t}=B,s=B.s,sk=s.skin,dk=T(sk,-.35),bel=s.chest,ven='180,255,60',pu=.55+.4*Math.sin(t/160+f);const{h,L,ny,R}=q,hh=q.heads[0],{hd,r,fwd,tip,sd}=hh,up=[0,0,1];
  // 등 비늘(돌기 줄)·독 반점
  for(let i=0;i<9;i++){const y=-L*.5+ny*.5+i*(L*.95+ny*.5)/8;for(let k=-2;k<=2;k++){const a=k*.45+(i%2?.22:0);if(Math.abs(a)>1.05)continue;B.ball([Math.sin(a)*R*.96,y,h+1+Math.cos(a)*R*.96],.95*q.bw,(i+k)%2?T(sk,-.15):T(sk,-.28),{flat:1,sx:1.2,sy:.7,d:-.02});}}
  for(let i=0;i<5;i++){const y=-L*.35+i*L*.18+ny*.6;for(const g of[-1,1])B.ball([g*R*.75,y,h+1+R*.62],.8,'#d0f040',{flat:1,glow:i%2?ven:null,alpha:.9,d:-.03});}
  // 배 판
  for(let i=0;i<6;i++){const y=-L*.35+i*L*.15+ny*.6;B.cap([-R*.5,y,h+1-R*.8],[R*.5,y,h+1-R*.8],1.3,i%2?bel:T(bel,-.15),{d:-.02});}
  // 목 주름 프릴(펼쳐짐: 버프·스킬)
  const op=mode==='buff'||mode==='skill'?1:.45;for(const g of[-1,1])for(let i=0;i<4;i++){const b=A(hh.neck,[g*2.2,0,1.5]);B.poly([b,A(b,[g*(2.5+op*3),-1+i*.6,2.5+op*2-i*1.6]),A(b,[g*(2+op*2.4),-.4+i*.6,.6-i*1.4])],i%2?'#a0c040':'#6a8a2a',{grad:1,edge:'#2a3a10',ew:.3,d:.02});}
  // 다리 발톱·관절 비늘
  for(const lg of q.legs){for(let i=-1;i<=1;i++)B.cap(A(lg.ft,[i*.7,.6,.2]),A(lg.ft,[i*1,2,-.1]),.5,'#e8e0c0',{w1:.1,d:-.07});B.ball(lg.kn,1.5,dk,{sy:.8,d:-.03});}
  // 꼬리 띠 무늬·끝 독침
  for(let i=1;i<q.tail.length;i++)B.cap(M(q.tail[i-1],q.tail[i],.45),M(q.tail[i-1],q.tail[i],.6),(2.6-i*.3)*q.bw,i%2?'#2a3a14':'#c0e040',{d:-.03});
  {const e=q.tail[q.tail.length-1],d=DIR(q.tail[q.tail.length-2],e);B.cap(e,A(e,d,2.4),.9,'#d8e090',{w1:.1,d:-.04});B.glow(A(e,d,2),1.2,ven,.5*pu);}
  // 얼굴: 눈두덩·송곳니·갈래 혀·독 침방울
  quadFace(B,hh,q.jaw,{brow:dk});
  if(mode!=='attack'||f!==1){const fl=Math.sin(t/90+f*2)>0?1:.4;const a=A(tip,fwd,r*.1),b=A(A(a,fwd,r*.9*fl),up,-r*.1);B.line([a,b],'#c02040',.4);for(const g of[-1,1])B.line([b,A(A(b,fwd,r*.35),sd,g*r*.2)],'#c02040',.3);}
  for(let i=0;i<2;i++){const ph=((t/700)+i*.5+f*.2)%1;B.ball(A(A(tip,[0,0,-r*.4-ph*3]),fwd,-r*.3*i),.45,'#c0ff40',{glow:ven,alpha:1-ph,d:-.1});}
  if(mode==='skill'&&f===2)for(let i=1;i<5;i++)B.glow(A(tip,fwd,i*3.5),1.4+i*.6,ven,.75-i*.1);}
}]);

// ======================= 리자드맨 공통(161·164) =======================
function W2_lizard(B,o){const{p,H,sh,bw,hr}=B.J,{mode,f,t}=B,j=J(B),sk=B.s.skin,dk=T(sk,-.32),bel=o.belly||'#c8b878';
  // 배 판·등 비늘
  for(let i=0;i<5;i++)B.cap(SF(B,-.45,sh-2-i*2.6,.25),SF(B,.45,sh-2-i*2.6,.25),1.5,i%2?bel:T(bel,-.15),{d:-.05});
  scales(B,H+3,sh+3,4,4,T(sk,-.12),2.2,4.1,1.2);
  for(let i=0;i<4;i++){const c=SF(B,3.14,sh+2-i*3.2,.5);B.cap(c,A(c,[0,-1.4,1.8]),1,o.crest,{w1:.12,d:.04});}
  // 가죽 멜빵·허리천
  strap(B,SF(B,-1.2,sh+3,.7),SF(B,.9,H+2,.7),o.leather,1.6,o.metal);strap(B,SF(B,1.9,sh+3,.7),SF(B,-1.2,sh+3,.7),o.leather,1.6);
  W2_belt(B,H+1.6,o.leather,o.metal,.6);W2_loin(B,H+1.4,6,o.cloth,.55,.9);
  for(const jj of[j.R,j.L]){for(let i=0;i<3;i++)B.ball(M(jj.el,jj.h,.2+i*.25),1,dk,{flat:1,sy:.6,d:-.05});bracer(B,jj,o.leather,3.8*bw,{strap:o.metal});
    for(let i=-1;i<=1;i++)B.cap(A(jj.h,[i*.7,.8,-.4]),A(jj.h,[i*.8,2,-1]),.5,'#e8e0c0',{w1:.1,d:-.08});
    B.ball(jj.kn,1.6,dk,{sy:.8,d:-.04});for(let i=-1;i<=1;i++)B.cap(A(jj.fp,[i*1,1.6,-.4]),A(jj.fp,[i*1.3,3.6,-1.1]),.6,'#e0d8b8',{w1:.1,d:-.1});}
  // 꼬리 비늘 띠
  const tl=W2_tail(B);for(let i=0;i<2;i++)for(let k=1;k<3;k++){const q=M(tl[i],tl[i+1],k/3);B.cap(A(q,[0,0,1]),A(q,[0,-1,2.4]),.8,o.crest,{w1:.1,d:.02});}
  // 머리: 눈두덩·이빨·콧구멍·볏 막
  B.poly([HP(B,0,.5,.95),HP(B,0,-.1,1.7+(o.tallCrest||0)),HP(B,0,-1.2,1.35+(o.tallCrest||0)*.6),HP(B,0,-1.4,.5)],o.crest,{grad:1,alpha:.9,d:.02});
  for(let i=0;i<5;i++)for(const g of[-1,1])B.cap(HP(B,.3*g,.9+i*.25,-.48),HP(B,.3*g,.9+i*.25,-.68),hr*.08,'#f4ecd8',{w1:hr*.02,d:-.12});
  for(const g of[-1,1]){B.ball(HP(B,.18*g,2.1,-.2),hr*.06,'#101',{flat:1,d:-.13});B.cap(HP(B,.62*g,.62,.5),HP(B,.2*g,.8,.42),hr*.16,T(sk,-.4),{d:-.1});}}

// ======================= 161. 매드 리자드맨 =======================
Q.push(['매드 리자드맨',{
 detail(B,K){const{p,hr,sh}=B.J,{mode,f,t}=B;W2_lizard(B,{crest:'#ff4020',leather:'#3a2014',metal:'#8a7a5a',cloth:'#5a1a10',belly:'#c8a070',tallCrest:.3});
  // 광기: 상처·핏자국·붉은 눈 잔광
  W2_scar(B,SF(B,-.8,sh+4,.8),SF(B,.1,sh-3,.8));W2_scar(B,SF(B,.6,sh-6,.8),SF(B,1.1,sh-11,.8));
  for(const g of[-1,1]){const e=HP(B,.42*g,.95,.3);B.glow(e,1.5,'255,60,30',.6);B.cap(e,HP(B,.6*g,-.2,.5),hr*.09,'#ff4020',{w1:hr*.02,alpha:.6,d:-.1});}
  // 거친 도끼(톱니날·피)
  axeHQ(B,'#8a8a90',{band:'#3a2014'});{const pt=k=>A(p.hR,p.dS,k);B.ball(pt(18),.9,'#7a1410',{flat:1,alpha:.8,d:-.24});for(let i=0;i<3;i++)B.cap(A(pt(16+i*2),[1,0,0],6.6),A(pt(16.6+i*2),[1,0,0],7.6),.6,'#6a6a70',{w1:.1,d:-.22});}
  if(mode==='buff')for(let i=0;i<4;i++){const ph=((t/600)+i/4)%1;B.glow([Math.sin(i*2)*6,Math.cos(i)*4,10+ph*26],1.3,'255,60,30',(1-ph)*.6);}}
}]);

// ======================= 164. 리자드맨 검사 =======================
Q.push(['리자드맨 검사',{wcol:'#d8e0e8',
 detail(B,K){const{p,H,sh,bw,hr}=B.J,{mode,f,t}=B,j=J(B);W2_lizard(B,{crest:'#d0b040',leather:'#4a3020',metal:'#c0a050',cloth:'#3a5a7a',belly:'#d8c890'});
  // 망토 테두리·한쪽 견갑·투구 띠
  B.line([[-10*bw,-5-p.cape,4],[0,-7-p.cape*1.3,2],[10*bw,-5-p.cape,4]],'#c0a050',1);
  pauldron(B,j.L,'#8a8a94',bw,{rivet:'#d8c890',s:.85});B.cap(HP(B,-.95,.1,.5),HP(B,.95,.1,.5),hr*.2,'#8a8a94',{d:-.04});B.ball(HP(B,0,.95,.55),hr*.14,'#c0a050',{d:-.08});
  // 곡도(시미터): 날 하이라이트·손잡이 감기
  swordHQ(B,{guard:'#c0a050',gem:'#40a0c0',wrap:'#3a2014',fuller:'rgba(60,70,90,.6)'});
  {const pt=k=>A(p.hR,p.dS,k),u=PERP(p.dS);B.poly([pt(4),A(pt(14),u,1.6),A(pt(22),u,.8),pt(23.5),pt(14)],'#e0e8f0',{grad:1,edge:'#8a9098',ew:.3,d:-.05});}
  if(mode==='skill'&&f>=1)B.glow(A(p.hR,p.dS,14),2.5+f,'220,255,200',.5);}
}]);

// ======================= 167. 도마뱀 =======================
Q.push(['도마뱀',{
 detail(B,K){const q=QJ(B),{mode,f,t}=B,sk=B.s.skin,dk=T(sk,-.35),lt=T(sk,.2);const{h,L,ny,R}=q,hh=q.heads[0],{hd,r,fwd,tip,sd}=hh,up=[0,0,1];
  // 등 비늘·띠 무늬
  for(let i=0;i<8;i++){const y=-L*.5+ny*.5+i*(L*.95+ny*.5)/7;for(let k=-2;k<=2;k++){const a=k*.45+(i%2?.22:0);if(Math.abs(a)>1.05)continue;B.ball([Math.sin(a)*R*.96,y,h+1+Math.cos(a)*R*.96],.7,(i+k)%2?T(sk,-.1):T(sk,-.22),{flat:1,sx:1.2,sy:.7,d:-.02});}
    if(i%2)B.cap([-R*.8,y,h+1+R*.5],[R*.8,y,h+1+R*.5],.6,'#4a3a20',{alpha:.6,d:-.03});}
  for(let i=0;i<3;i++)B.ball([0,-L*.2+i*L*.25+ny*.6,h+1+R*.98],.6,'#e0d070',{flat:1,d:-.04});
  // 배·턱 주머니
  for(let i=0;i<4;i++){const y=-L*.3+i*L*.2+ny*.6;B.cap([-R*.5,y,h+1-R*.8],[R*.5,y,h+1-R*.8],1,i%2?B.s.chest:T(B.s.chest,-.12),{d:-.02});}
  B.ball(A(A(hd,fwd,r*.5),up,-r*.75),r*.45,T(B.s.chest,-.05),{sy:.7,d:-.03});
  // 발가락(넓게 벌어진)
  for(const lg of q.legs)for(let i=-2;i<=2;i++)B.cap(A(lg.ft,[i*.5,.3,.2]),A(lg.ft,[i*1.1,1.6,0]),.45,dk,{w1:.2,d:-.06});
  // 눈두덩·콧구멍·혀
  for(const g of[-1,1]){B.ball(A(A(A(hd,fwd,r*.62),sd,g*r*.52),up,r*.42),r*.24,dk,{sy:.7,d:-.04});B.ball(A(A(tip,sd,g*r*.2),up,r*.25),r*.07,'#101008',{flat:1,d:-.09});}
  B.line([A(A(hd,fwd,r*.5),sd,-r*.6),A(A(tip,sd,-r*.35),up,-r*.25)],dk,.35);B.line([A(A(hd,fwd,r*.5),sd,r*.6),A(A(tip,sd,r*.35),up,-r*.25)],dk,.35);
  if(Math.sin(t/120+f*1.7)>.3||mode==='attack'){const a=A(tip,fwd,r*.1),b=A(A(a,fwd,r*.9),up,-r*.1);B.line([a,b],'#d04060',.35);for(const g of[-1,1])B.line([b,A(A(b,fwd,r*.3),sd,g*r*.18)],'#d04060',.25);}
  // 꼬리 띠
  for(let i=1;i<q.tail.length;i++)if(i%2)B.cap(M(q.tail[i-1],q.tail[i],.4),M(q.tail[i-1],q.tail[i],.6),(2-i*.25),'#4a3a20',{d:-.03,alpha:.8});}
}]);

// ======================= 170. 라버본 솔져 =======================
Q.push(['라버본 솔져',{legW:4.2,armW:3.8,
 detail(B,K){const{p,H,sh,bw,hr}=B.J,{mode,f,t}=B,j=J(B),lava='255,120,30',pu=.55+.4*Math.sin(t/150+f);
  boneHQ(B,'#d8cdb4');skullHQ(B,lava);
  // 그을림·용암 틈
  for(let i=0;i<4;i++)B.line([[-4+i*2.4,2.6,sh-2-i*2.8],[-3+i*2.4,3.2,sh-4-i*2.8]],'rgba(255,128,32,'+(.5+pu*.4).toFixed(2)+')',.45);
  B.line([HP(B,-.3,.6,.9),HP(B,-.1,.8,.5),HP(B,-.25,.88,.3)],'#ff8020',.4);
  // 가죽 흉갑·리벳·사슬띠
  B.poly([SF(B,-.75,sh,.9),SF(B,.75,sh,.9),SF(B,.6,sh-6,1),SF(B,-.6,sh-6,1)],'#3a2a24',{grad:1,edge:'#1a100c',ew:.5,d:-.08});rivets(B,[SF(B,-.5,sh-1,1.3),SF(B,0,sh-1,1.4),SF(B,.5,sh-1,1.3),SF(B,-.4,sh-5,1.3),SF(B,.4,sh-5,1.3)],'#8a7a6a',.45);
  for(let i=0;i<7;i++)B.ball(M(SF(B,1.3,sh+2,1),SF(B,-.9,H+2,1),i/6),.6,i%2?'#5a5a60':'#7a7a80',{d:-.1});
  W2_belt(B,H+1.6,'#2a1a14','#8a7a6a',.6);W2_loin(B,H+1.4,6,'#3a2a24',.5,1);
  // 녹슨 견갑(두개골 장식)·팔다리 가죽
  for(const jj of[j.R,j.L]){pauldron(B,jj,'#4a3a30',bw,{rivet:'#8a7a6a',s:.8});const c=A(jj.sp,[jj.sg*1.2,1.2,2.6]);B.ball(c,1.4,'#d8cdb4',{d:-.12});for(const e of[-1,1])B.ball(A(c,[e*.5,1.1,.1]),.35,'#1a0a04',{flat:1,glow:lava,d:-.14});
    bracer(B,jj,'#3a2a24',3.4*bw,{strap:'#1a100c'});greave(B,jj,'#3a2a24',4.2*bw,{strap:'#1a100c'});}
  // 투구(가죽 테·코 보호대)
  B.cap(HP(B,-1,.2,.18),HP(B,1,.2,.18),hr*.18,'#2a1a10',{d:-.05});B.cap(HP(B,0,.95,.6),HP(B,0,1.02,.05),hr*.12,'#5a4030',{d:-.1});
  // 창·방패
  spearHQ(B,'#9a8a80','#3a2a24','#8a2010');{const pt=k=>A(p.hR,p.dS,k);for(const k of[8,14])B.glow(pt(k),1.2,lava,.4*pu);B.line([pt(23),pt(27)],'#ff9030',.4);}
  shieldHQ(B,'#2a1a10','skull',{boss:'#6a4a30'});
  for(let i=0;i<4;i++){const ph=((t/900)+i/4+f*.07)%1;B.glow([Math.sin(i*2.3)*5,Math.cos(i*1.7)*3,sh-4+ph*14],1.1*(1-ph)+.3,lava,(1-ph)*.6);}}
}]);

// ======================= 173. 맘보토끼졸개 =======================
Q.push(['맘보토끼졸개',{
 detail(B,K){const{p,H,sh,bw,hr}=B.J,{mode,f,t}=B,j=J(B);
  // 가슴 털·볼 털·뭉툭 꼬리
  for(let i=0;i<5;i++)B.cap(SF(B,(i-2)*.3,sh,.2),SF(B,(i-2)*.32,sh-4,.6),1.4,i%2?'#f4ece0':'#d8c8b8',{w1:.35,d:-.06});
  for(const g of[-1,1]){B.ball(HP(B,.55*g,.6,-.3),hr*.3,'#f0e6da',{d:-.05});for(let i=0;i<3;i++)B.line([HP(B,.3*g,1.05,-.35),HP(B,(.9+i*.1)*g,1.05,-.25-i*.1)],'#5a4a40',.22);}
  B.ball(SF(B,3.14,H+2,.6),2.2,'#f4ece0',{d:.05});
  B.cap(HP(B,-.07,1,-.58),HP(B,-.07,1,-.8),hr*.12,'#fffff0',{d:-.09});B.cap(HP(B,.07,1,-.58),HP(B,.07,1,-.8),hr*.12,'#fffff0',{d:-.09});
  // 해진 조끼·밧줄 허리띠·두건
  for(const g of[-1,1])B.poly([SF(B,g*.15,sh-.5,.5),SF(B,g*1.4,sh-.5,.5),SF(B,g*1.4,H+1.5,.5),SF(B,g*.25,H+1.5,.5)],'#a06030',{grad:1,edge:'#4a2a10',ew:.35,d:-.07});
  B.poly([SF(B,-1.2,H+5,.9),SF(B,-.6,H+5,.9),SF(B,-.6,H+3,.9),SF(B,-1.2,H+3,.9)],'#6a4a2a',{edge:'#3a1a08',ew:.3,d:-.09});
  W2_belt(B,H+1,'#a08050','#6a5030',.6);
  B.ball(HP(B,0,-.05,.4),hr*1.04,'#5a7a3a',{sy:.55,d:-.03});B.cap(HP(B,-.3,-.8,.35),HP(B,-.4,-1.6,-.4),hr*.18,'#5a7a3a',{w1:hr*.1,d:.05});
  // 큰 발·손목 끈
  for(const jj of[j.R,j.L]){B.ball(A(jj.fp,[0,1.8,-.4]),1.8,'#ece4dc',{sy:.6,d:-.1});bracer(B,jj,'#8a4a20',2.8*bw,{strap:'#4a2a10'});}
  // 단검: 날 하이라이트·감은 손잡이
  {const pt=k=>A(p.hR,p.dS,k),X=[1,0,0];B.line([A(pt(3),X,.4),A(pt(10),X,.15)],'rgba(255,255,255,.8)',.3);for(const k of[-2.6,-1.4,-.2])B.cap(pt(k-.2),pt(k+.2),2.2,'#5a3a1a',{d:-.05});B.ball(pt(-3.8),1,'#b08a3a',{d:-.05});}
  if(mode==='attack'&&f===1)B.glow(A(p.hR,p.dS,9),2,'255,230,180',.6);}
}]);

// ======================= 176. 펠리컬 =======================
function W2_birdJ(B){const s=B.s,{mode,f,t}=B,run=mode==='run',walk=mode==='walk'||run;const ph=f*Math.PI/2+(run?Math.PI/4:0),sw=walk?Math.cos(ph):0,cw=walk?Math.sin(ph):0;
  let peck=0,wing=Math.sin(t/300+f)*2,up=0;if(mode==='attack')peck=[-.3,1,.4][f];if(mode==='buff'){wing=8+f*2;up=1;}if(mode==='skill'){peck=[0,.5,1,.3][f];wing=[2,8,4,2][f];}if(run)wing+=5;const h=s.h||12;
  const neck=[0,4+peck*2,h+9-peck*2+up*2],hd=[0,7+peck*5,h+14-peck*5+up*3];const feet=[];for(const[g,ph2]of[[-1,1],[1,-1]]){const sw2=sw*ph2;feet.push([g*3,sw2*5,Math.max(0,cw*ph2)*3]);}return{h,peck,wing,up,neck,hd,feet};}
Q.push(['펠리컬',{
 detail(B,K){const b=W2_birdJ(B),{mode,f,t}=B,{h,peck,wing,hd,neck}=b,s=B.s,bl=s.beakL||8;
  // 몸 깃털 결(겹친 비늘깃)
  for(let r=0;r<3;r++)for(let i=0;i<6;i++){const a=(i/5-.5)*2.6+(r%2)*.2;B.poly([[Math.sin(a)*6.2-1.1,Math.cos(a)*5.2-r*1.6,h+8-r*2.4],[Math.sin(a)*6.2+1.1,Math.cos(a)*5.2-r*1.6,h+8-r*2.4],[Math.sin(a)*6.6,Math.cos(a)*5.6-r*1.6-.6,h+5.4-r*2.4]],(r+i)%2?'#f4f4f0':'#d8d8d0',{grad:1,edge:'#a8a8a0',ew:.25,d:-.05});}
  // 날개 칼깃(끝이 검은 깃)
  for(const g of[-1,1]){const r0=[g*5,2,h+8],a=[g*(12+wing*.4),-2,h+12+wing],c=[g*(14+wing*.4),-8,h+6+wing*.6],e=[g*6,-6,h+4];
    for(let i=0;i<5;i++){const q=M(a,c,i/4),dir=N(g*.5,-1,-.3);B.cap(q,A(q,dir,4-i*.3),1.4,i<3?'#2a2a2a':'#d8d8d0',{w1:.3,d:.28});}
    for(let i=0;i<4;i++)B.line([M(r0,a,.3+i*.2),M(e,c,.3+i*.2)],'rgba(120,120,110,.6)',.35);}
  // 꼬리깃
  for(let i=-2;i<=2;i++)B.cap([0,-5,h+4],[i*1.3,-10,h+2.5-Math.abs(i)*.3],1.1,i%2?'#e0e0d8':'#c8c8c0',{w1:.3,d:.1});
  // 머리 깃털 볏·눈 주위 맨살·부리 끝 갈고리·주머니 주름
  for(let i=0;i<4;i++)B.cap(A(hd,[0,-1,2]),A(hd,[(i-1.5)*.5,-3-i*.4,3.4-i*.3]),.6,'#f8f0d8',{w1:.15,d:.02});
  for(const g of[-1,1]){B.ball(A(hd,[g*1.9,1.3,.8]),.9,'#f0c8a0',{flat:1,d:-.04});B.ball(A(hd,[g*2,1.5,.8]),.45,'#202020',{flat:1,d:-.06});}
  const bt=A(hd,[0,bl,-1-peck]);B.cap(A(hd,[0,2.4,.2]),bt,.5,'#f8c850',{w1:.3,d:-.08});B.cap(bt,A(bt,[0,.2,-1]),.7,'#e05030',{w1:.2,d:-.09});
  const pc=A(hd,[0,bl*.6,-2.2-peck]),open=mode==='attack'&&f===1?1:mode==='skill'&&f===2?1.3:0;B.ball(A(pc,[0,0,-open]),2+open*.4,'#f0a040',{sy:.7+open*.15,alpha:.9,d:-.05});for(let i=0;i<3;i++)B.line([A(pc,[-1.4,-1+i,-.4-open]),A(pc,[0,-.6+i,-1.6-open]),A(pc,[1.4,-1+i,-.4-open])],'rgba(160,90,30,.6)',.3);
  if(open)B.ball(A(pc,[0,.6,-.6]),.8,'#5a8ab0',{flat:1,alpha:.7,d:-.07});
  // 물갈퀴 발
  for(const ft of b.feet)B.poly([A(ft,[-1.6,2.4,0]),A(ft,[0,2.8,0]),A(ft,[1.6,2.4,0]),A(ft,[0,.2,0])],'#e0a040',{alpha:.85,d:-.03});
  if(mode==='skill'&&f>=2)for(let i=0;i<5;i++)B.ball(A(bt,[Math.sin(i*2)*1.5,i*2.2,-i*.6]),.7,'#a0d0ff',{alpha:.7,glow:'200,230,255'});}
}]);

})();
