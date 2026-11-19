/* 리클라인 몬스터 렌더러 — 캐릭터·데스나이트와 같은 방식(입체 좌표 → 8방향)
   그리기: MR.render(ctx, MR.SPEC[이름], 각도, 프레임, 동작, 발x, 발y, 배율, 시간ms)
   동작: 'idle'(1) 'walk'(4) 'run'(4) 'attack'(3) 'buff'(4) 'skill'(4) / 각도 0 북 90 동 180 남 270 서
   시트: 20열(대기, 걷기1~4, 달리기1~4, 공격1~3, 버프1~4, 스킬1~4) × 8행(남·남서·서·북서·북·북동·동·남동) */
const MR=(function(){
const MOTION={idle:{frames:1,ms:0},walk:{frames:4,ms:150},run:{frames:4,ms:105},attack:{frames:3,ms:150},buff:{frames:4,ms:190},skill:{frames:4,ms:160}};
const SHEET=['idle',0,'walk',0,'walk',1,'walk',2,'walk',3,'run',0,'run',1,'run',2,'run',3,'attack',0,'attack',1,'attack',2,'buff',0,'buff',1,'buff',2,'buff',3,'skill',0,'skill',1,'skill',2,'skill',3];
const ROWS=[180,225,270,315,0,45,90,135];
const PS={quad:1.35,bug:1.9,blob:1.7,bird:1.35,fish:1.4};
const hx=h=>{h=String(h).replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255];};
const tone=(h,a)=>{const c=hx(h);return'rgb('+c.map(v=>Math.max(0,Math.min(255,Math.round(a>0?v+(255-v)*a:v*(1+a))))).join(',')+')';};
const rgb=h=>hx(h).join(',');
const nrm=(x,y,z)=>{const l=Math.hypot(x,y,z)||1;return[x/l,y/l,z/l];};
const add3=(a,b,s=1)=>[a[0]+b[0]*s,a[1]+b[1]*s,a[2]+b[2]*s];
const mid=(a,b,t=.5)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];

// ---------- 공통 그리기 ----------
function render(ctx,s,ang,frame,mode,cx,cy,S,t){mode=mode===true?'walk':(mode||'idle');frame=frame|0;t=t||0;
  const k=(s.k||1)*(PS[s.plan]||1),A=ang*Math.PI/180,fx=Math.sin(A),fy=Math.cos(A),rx=Math.cos(A),ry=-Math.sin(A);
  const st={lean:0,lz:20,bob:0,bz:12,pitch:0};
  const L=[],FX=[],G0=[];
  const B={st,s,mode,f:frame,t,
    ball:(p,r,col,o={})=>L.push({t:'b',p,r,col,o}),
    cap:(a,b,w0,col,o={})=>L.push({t:'c',a,b,w0,w1:o.w1??w0,col,o}),
    poly:(pts,col,o={})=>L.push({t:'p',pts,col,o}),
    line:(pts,col,w,o={})=>L.push({t:'l',pts,col,w,o}),
    glow:(p,r,c,a)=>FX.push({t:'g',p,r,c,a}),
    spark:(p,r,c,a)=>FX.push({t:'s',p,r,c,a}),
    ring:(r,c,a)=>G0.push({r,c,a}),
    arc:(pts,c,w)=>FX.push({t:'a',pts,c,w})};
  (PLANS[s.plan]||PLANS.biped)(B);
  const P=p=>{let[lx,ly,lz]=p;if(st.pitch)lz+=ly*st.pitch;if(lz>st.lz)ly+=(lz-st.lz)*st.lean/30;const z=(lz+(lz>st.bz?st.bob:0))*k;lx*=k;ly*=k;const X=lx*rx+ly*fx,Y=lx*ry+ly*fy;return{x:cx+X*S,y:cy-(z*.92+Y*.45)*S,Y};};
  const c=ctx;c.save();c.lineCap='round';c.lineJoin='round';
  // 바닥 그림자·고리
  for(const g of G0){const R=g.r*k*S;c.save();c.globalCompositeOperation='lighter';c.strokeStyle='rgba('+g.c+','+g.a+')';c.lineWidth=1.3*S;c.beginPath();c.ellipse(cx,cy,R,R*.45,0,0,7);c.stroke();c.restore();}
  for(const e of L){if(e.t==='b'){e.q=P(e.p);e.d=e.q.Y-(e.o.front?e.r*.0:0);}else if(e.t==='c'){e.qa=P(e.a);e.qb=P(e.b);e.d=(e.qa.Y+e.qb.Y)/2;}else{e.qs=e.pts.map(P);e.d=e.qs.reduce((a,q)=>a+q.Y,0)/e.qs.length;}e.d+=(e.o.d||0)*k;}
  L.sort((a,b)=>b.d-a.d);
  for(const e of L){c.globalAlpha=e.o.alpha??1;
    if(e.t==='b'){const q=e.q,r=e.r*k*S,sy=e.o.sy||1,sx=e.o.sx||1;if(e.o.flat){c.fillStyle=e.col;c.beginPath();c.ellipse(q.x,q.y,r*sx,r*sy,0,0,7);c.fill();}
      else{const g=c.createRadialGradient(q.x-r*.35,q.y-r*.45*sy,r*.1,q.x,q.y,r*Math.max(sx,sy));g.addColorStop(0,tone(e.col,.38));g.addColorStop(.55,e.col);g.addColorStop(1,tone(e.col,-.6));c.fillStyle=g;c.beginPath();c.ellipse(q.x,q.y,r*sx,r*sy,0,0,7);c.fill();}
      if(e.o.glow){c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(q.x,q.y,0,q.x,q.y,r*2.4);g.addColorStop(0,'rgba('+e.o.glow+',.8)');g.addColorStop(1,'rgba('+e.o.glow+',0)');c.fillStyle=g;c.beginPath();c.arc(q.x,q.y,r*2.4,0,7);c.fill();c.restore();}}
    else if(e.t==='c'){const a=e.qa,b=e.qb,w0=e.w0*k*S/2,w1=e.w1*k*S/2,an=Math.atan2(b.y-a.y,b.x-a.x),nx=-Math.sin(an),ny=Math.cos(an);
      const g=c.createLinearGradient(a.x+nx*w0,a.y+ny*w0,a.x-nx*w0,a.y-ny*w0);g.addColorStop(0,tone(e.col,.3));g.addColorStop(.5,e.col);g.addColorStop(1,tone(e.col,-.55));c.fillStyle=g;
      c.beginPath();c.moveTo(a.x+nx*w0,a.y+ny*w0);c.lineTo(b.x+nx*w1,b.y+ny*w1);c.arc(b.x,b.y,w1,an+Math.PI/2,an-Math.PI/2,true);c.lineTo(a.x-nx*w0,a.y-ny*w0);c.arc(a.x,a.y,w0,an-Math.PI/2,an+Math.PI/2,true);c.closePath();c.fill();}
    else if(e.t==='p'){c.beginPath();e.qs.forEach((q,i)=>i?c.lineTo(q.x,q.y):c.moveTo(q.x,q.y));c.closePath();
      if(e.o.grad){const ys=e.qs.map(q=>q.y),y0=Math.min(...ys),y1=Math.max(...ys);const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,tone(e.col,.25));g.addColorStop(1,tone(e.col,-.55));c.fillStyle=g;}else c.fillStyle=e.col;c.fill();
      if(e.o.edge){c.strokeStyle=e.o.edge;c.lineWidth=(e.o.ew||.6)*S;c.stroke();}}
    else if(e.t==='l'){c.strokeStyle=e.col;c.lineWidth=e.w*S;c.beginPath();e.qs.forEach((q,i)=>i?c.lineTo(q.x,q.y):c.moveTo(q.x,q.y));c.stroke();}}
  c.globalAlpha=1;c.globalCompositeOperation='lighter';
  for(const e of FX){if(e.t==='g'||e.t==='s'){const q=P(e.p),r=e.r*k*S;const g=c.createRadialGradient(q.x,q.y,0,q.x,q.y,r);g.addColorStop(0,'rgba(255,255,255,'+e.a+')');g.addColorStop(.3,'rgba('+e.c+','+e.a*.85+')');g.addColorStop(1,'rgba('+e.c+',0)');c.fillStyle=g;c.beginPath();c.arc(q.x,q.y,r,0,7);c.fill();
      if(e.t==='s'){c.strokeStyle='rgba('+e.c+','+e.a+')';c.lineWidth=1.2*S;for(let i=0;i<8;i++){const a=i/8*6.283;c.beginPath();c.moveTo(q.x+Math.cos(a)*r*.3,q.y+Math.sin(a)*r*.3);c.lineTo(q.x+Math.cos(a)*r*.9,q.y+Math.sin(a)*r*.9);c.stroke();}}}
    else if(e.t==='a'){const qs=e.pts.map(P);c.strokeStyle='rgba('+e.c+',.75)';c.lineWidth=e.w*S;c.beginPath();c.moveTo(qs[0].x,qs[0].y);c.quadraticCurveTo(qs[1].x,qs[1].y,qs[2].x,qs[2].y);c.stroke();c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=e.w*S*.35;c.stroke();}}
  c.restore();}

// ---------- 공통 부품 ----------
// 평면 원판(방패 등): 중심 p, 두 축 u,v
function disc(B,p,u,v,r,col,o={}){const pts=[];for(let i=0;i<14;i++){const a=i/14*Math.PI*2;pts.push(add3(add3(p,u,Math.cos(a)*r),v,Math.sin(a)*r));}B.poly(pts,col,{grad:1,...o});}
function weapon(B,kind,h,d,s){const pt=k=>add3(h,d,k),fxc=s.fx||'255,220,150',wc=s.wcol||'#b9c0c8';
  if(kind==='sword'||kind==='dagger'){const n=kind==='dagger'?11:22;B.cap(pt(-3.5),pt(2),2,'#3a2a1c');B.cap(add3(pt(2),[1,0,0],-3.5),add3(pt(2),[1,0,0],3.5),1.4,'#b08a3a');B.cap(pt(2.5),pt(n),2.2,wc,{w1:.6});}
  else if(kind==='axe'){B.cap(pt(-6),pt(20),1.6,'#5a3a20');const a=pt(15),b=pt(21);B.poly([a,b,add3(b,[1,0,0],6),add3(a,[1,0,0],7)],wc,{grad:1,d:-.2});}
  else if(kind==='club'){B.cap(pt(-3),pt(17),2.2,s.wcol||'#6a4a2a',{w1:5});B.ball(pt(17),2.8,s.wcol||'#6a4a2a');}
  else if(kind==='spear'){B.cap(pt(-16),pt(22),1.3,'#6a4a28');B.cap(pt(22),pt(29),2.2,wc,{w1:.4});}
  else if(kind==='staff'){B.cap(pt(-14),pt(14),1.4,s.scol||'#5a3e22');B.ball(pt(16),2.4,s.ocol||'#9fdcff',{glow:fxc});}
  else if(kind==='scythe'){B.cap(pt(-14),pt(16),1.3,'#3a2a20');const a=pt(16);B.poly([a,add3(a,[1,0,0],1.6),add3(add3(a,[1,0,0],-12),[0,0,1],-5),add3(a,[1,0,0],-1)],wc,{grad:1});}
  else if(kind==='bow'){const up=[0,0,1];const top=add3(h,up,12),bot=add3(h,up,-12),bel=add3(h,d,4);B.line([top,add3(mid(top,h),d,3.5),h,add3(mid(bot,h),d,3.5),bot],'#6a4422',1.5);}}
function eyes(B,hd,fw,sd,r,col,gl,yo=0,sp=.38){for(const s2 of[-1,1]){const p=add3(add3(add3(hd,fw,r*.82),sd,r*sp*s2),[0,0,1],r*(.12+yo));B.ball(p,r*.17,col,{flat:1,glow:gl,d:-.05});}}

// ---------- 몸 구조: 두 발(인간형) ----------
function bipedPose(B){const{s,mode,f}=B,run=mode==='run',walk=mode==='walk'||run,w=s.weapon||'none';
  const ph=f*Math.PI/2+(run?Math.PI/4:0),sw=walk?Math.cos(ph):0,cw=walk?Math.sin(ph):0;
  const p={sw,cw,lean:s.hunch||0,bob:0,hR:[10,4,s.hip+5],hL:[-10,2,s.hip+5],dS:nrm(.1,.6,.8),dL:nrm(0,.5,.85),fL:[-4,1,0],fR:[4,-1,0],fx:null,cape:1.5};
  const H=s.hip,sh=H+16;
  if(w==='bow'){p.hL=[-6,9,H+12];p.dL=nrm(0,.2,1);p.hR=[4,3,H+12];}
  if(w==='staff'){p.hR=[10,4,H+8];p.dS=nrm(0,.15,1);}
  if(w==='spear'){p.hR=[10,3,H+6];p.dS=nrm(0,.35,.94);}
  if(walk){const st=run?9:6,lift=run?6:4;p.fL=[-4,st*sw,Math.max(0,cw)*lift];p.fR=[4,-st*sw,Math.max(0,-cw)*lift];p.bob=run?1.2+.8*Math.sin(ph*2):Math.abs(cw)*1;p.cape=run?6:3;
    if(run){p.lean+=4;}
    if(w!=='bow'){p.hL=[-10,-5*sw,H+5];if(w!=='staff'&&w!=='spear')p.hR=[10,run?-2+2*sw:4-2*sw,H+6];}}
  else if(mode==='attack'){p.fL=[-5,-3,0];p.fR=[5,4,0];p.cape=3;
    if(w==='bow'){p.hL=[-5,11,H+13];if(f===0)p.hR=[2,6,H+13];else if(f===1)p.hR=[3,-2,H+14];else{p.hR=[7,-4,H+14];p.fx='arrow';}}
    else if(w==='spear'){if(f===0){p.hR=[8,-6,H+8];p.dS=nrm(0,1,.12);}else if(f===1){p.hR=[5,13,H+10];p.dS=nrm(0,1,.05);p.lean+=4;p.fx='thrust';}else{p.hR=[8,6,H+8];p.dS=nrm(0,.8,.5);}}
    else if(w==='staff'){if(f===0){p.hR=[8,0,sh+6];p.dS=nrm(0,.2,1);}else if(f===1){p.hR=[6,11,H+12];p.dS=nrm(0,1,.3);p.fx='bolt';p.lean+=2;}else{p.hR=[9,6,H+8];p.dS=nrm(0,.5,.8);}}
    else if(w==='none'||w==='claws'){if(f===0){p.hR=[9,-2,sh+6];p.hL=[-9,-2,sh+6];}else if(f===1){p.hR=[2,11,H+10];p.hL=[-4,9,H+14];p.lean+=4;p.fx='claw';}else{p.hR=[-4,8,H+2];p.hL=[-9,4,H+6];p.lean+=3;}}
    else{if(f===0){p.hR=[7,-3,sh+12];p.dS=nrm(.1,-.55,.83);p.hL=[-8,7,H+12];p.lean-=1.5;}else if(f===1){p.hR=[5,11,H+12];p.dS=nrm(-.05,.9,-.35);p.lean+=3;p.fR=[5,7,0];p.fx='slash';}else{p.hR=[-3,9,H-2];p.dS=nrm(-.55,.45,-.7);p.lean+=2.5;p.fR=[5,7,0];}}}
  else if(mode==='buff'){p.fL=[-6,0,0];p.fR=[6,0,0];p.fx='buff';p.lean-=1;p.cape=2+f;
    if(w==='bow'){p.hL=[-7,4,sh+10];p.dL=nrm(0,.1,1);p.hR=[7,2,sh+4];}else if(w==='none'||w==='claws'){p.hR=[10,3,sh+8];p.hL=[-10,3,sh+8];}else{p.hR=[2,8,H+10];p.hL=[-2,8,H+9];p.dS=nrm(0,.08,1);}}
  else if(mode==='skill'){p.fL=[-5,-3,0];p.fR=[5,3,0];
    if(w==='staff'||s.caster){const sp=[[9,-2,H+6],[8,2,sh+10],[5,12,sh],[9,6,H+6]][f];p.hR=sp;p.hL=[[-8,6,H+10],[-9,5,sh+6],[-4,12,sh-2],[-10,2,H+6]][f];p.dS=nrm(0,f===2?.9:.2,f===2?.4:1);p.fx=['charge','charge','burst','fade'][f];p.lean+=f===2?3:0;}
    else if(w==='bow'){p.hL=[-5,11,H+15];p.hR=[[2,6,H+15],[3,-3,H+16],[7,-5,H+16],[6,2,H+12]][f];p.dL=nrm(0,.15,1);p.fx=['charge','charge','volley','fade'][f];}
    else{p.hR=[[9,-6,H+6],[8,2,sh+12],[3,13,H+12],[9,6,H+6]][f];p.dS=[nrm(.3,-.8,-.25),nrm(.1,.3,.95),nrm(0,.95,-.3),nrm(.1,.6,.75)][f];p.hL=[[-7,9,H+14],[-9,4,sh+4],[-10,-3,H+6],[-11,1,H+4]][f];p.lean+=[1,-1,4,0][f];if(f===2)p.fR=[5,8,0];p.fx=['charge','charge','burst','fade'][f];}}
  return p;}
const PLANS={};
PLANS.biped=function(B){const s=B.s,{mode,f,t}=B;s.hip=s.hip||24;const p=bipedPose(B);const H=s.hip,T=s.torso||16,sh=H+T,hz=sh+(s.neck??6)+(s.headR||6.5)*.6,bw=(s.bulk||1),hr=s.headR||6.5;
  B.st.lean=p.lean;B.st.lz=H;B.st.bob=p.bob+(mode==='idle'?Math.sin(t/600)*.3:0);B.st.bz=H-6;
  const fw=[0,1,0],sd=[1,0,0],up=[0,0,1],sk=s.skin||'#8a9a6a',bc=s.cloth||s.armor||sk,ac=s.armor||bc;
  // 다리(떠다니는 유령은 옷자락)
  if(s.serpent){const w=Math.sin(t/300+f*1.4)*(mode==='walk'||mode==='run'?2.5:1);const pts=[[0,0,H],[0,2,H*.5],[w,1,4],[-w+3,-6,2.5],[w,-12,2.2],[-4-w,-16,2.6],[-7,-12+w,3.4]];for(let i=0;i<pts.length-1;i++){const ww=(11-i*1.4)*bw;B.cap(pts[i],pts[i+1],ww,i===0?bc:s.tailc||sk,{w1:ww-1.4*bw,d:i>1?.6:0});}}
  else if(s.float){B.st.bob+=1.5+Math.sin(t/400+f)*1;const tail=[0,-3-(mode==='run'?6:mode==='walk'?3:0),2];B.poly([[-7*bw,1,H+2],[7*bw,1,H+2],[4,-1,H-10],tail,[-4,-1,H-10]],bc,{grad:1,alpha:.9});}
  else if(s.robe){B.poly([[-7*bw,2,H+2],[7*bw,2,H+2],[10*bw,4,1],[0,6,0],[-10*bw,4,1]],bc,{grad:1,d:-.1});B.poly([[-7*bw,-2,H+2],[7*bw,-2,H+2],[10*bw,-4-p.cape*.3,1],[0,-6-p.cape*.5,0],[-10*bw,-4-p.cape*.3,1]],tone(bc,-.2),{grad:1});
    for(const ft of[p.fL,p.fR])B.ball([ft[0],ft[1]+2,ft[2]+1],2.2,s.boot||'#2a221c');}
  else for(const[sg,ft]of[[-1,p.fL],[1,p.fR]]){const hip=[4*sg*bw,0,H],kn=[(4*sg*bw+ft[0])/2,ft[1]/2+2.5,(H+ft[2])/2+1],ftp=[ft[0],ft[1],ft[2]+1.5];
    B.cap(hip,kn,(s.legW||6)*bw,s.pants||ac);B.cap(kn,ftp,(s.legW||6)*.85*bw,s.pants||ac,{w1:(s.legW||6)*.7*bw});B.ball([ft[0],ft[1]+2,ft[2]+1.2],2.4*bw,s.boot||tone(s.pants||ac,-.35),{sy:.7});
    if(s.bone){B.ball(kn,1.6,'#e6dfcc');}}
  // 망토
  if(s.cape)B.poly([[-8*bw,-4,sh-1],[8*bw,-4,sh-1],[10*bw,-5-p.cape,4],[0,-7-p.cape*1.3,2],[-10*bw,-5-p.cape,4]],s.cape,{grad:1});
  // 꼬리
  if(s.tail){const a=[0,-4,H+2],b=[0,-12,H-2+Math.sin(t/300+f)*2],c2=[0,-18,H+3];B.cap(a,b,3.5,s.tailc||sk,{w1:2.5});B.cap(b,c2,2.5,s.tailc||sk,{w1:1});}
  // 날개
  if(s.wings){const fl=Math.sin(f*1.6+(mode==='run'?1:0)+t/250)*4+(mode==='buff'?6:0);for(const sg of[-1,1]){const r0=[5*sg*bw,-3,sh-2];B.poly([r0,[18*sg*bw,-8,sh+8+fl],[24*sg*bw,-10,sh-2+fl],[16*sg*bw,-7,H-2+fl*.5],[8*sg*bw,-4,H+2]],s.wings,{grad:1,d:.5});}}
  // 몸통
  if(s.bone){B.cap([0,0,H],[0,0,sh],2,'#e6dfcc');for(let i=0;i<4;i++){const z=sh-2-i*3.2;B.cap([-5.5,1.5,z],[5.5,1.5,z],1.3,'#e6dfcc',{d:-.1});}B.ball([0,0,H],4,'#d9d2bf',{sy:.6});}
  else{const w0=13*bw*(s.belly?1.35:1),w1=(13+(s.chestW||3.5)*2)*bw;B.cap([0,0,H+1],[0,0,sh-1.5],w0,bc,{w1,d:.2});if(s.belly)B.ball([0,1.5,H+4],6.2*bw,tone(bc,.05),{sy:.85,d:.1});
    if(s.belt)B.cap([-7*bw,1.5,H+1.5],[7*bw,1.5,H+1.5],2.2,s.belt,{d:-.3});
    if(s.trim)B.cap([0,4.8*bw,H+3],[0,5.3*bw,sh-2],1.2,s.trim,{d:-.4});
    if(s.fur)for(let i=0;i<5;i++)B.ball([(i-2)*2.6*bw,2.5*bw,sh-1],1.9*bw,s.fur,{d:-.3});}
  if(s.pads)for(const sg of[-1,1])B.ball([9*sg*bw,0,sh],3.8*bw,s.pads,{d:-.3});
  // 팔
  const arm=(sg,h)=>{const sp=[9*sg*bw,0,sh-1],el=[(9*sg*bw+h[0])/2+2*sg,h[1]/2-1.8,(sh-1+h[2])/2-1.5];B.cap(sp,el,(s.armW||5)*bw,s.sleeve||(s.bone?'#e6dfcc':ac));B.cap(el,h,(s.armW||5)*.85*bw,s.bone?'#e6dfcc':s.forearm||sk);B.ball(h,(s.handR||2.2)*bw,s.bone?'#e6dfcc':s.hand||sk);};
  arm(1,p.hR);arm(-1,p.hL);
  if(s.claws)for(const h of[p.hR,p.hL])for(let i=-1;i<=1;i++)B.cap(h,add3(h,nrm(i*.4,.8,-.3),3.4),.7,'#efe6d0');
  // 무기·방패
  if(s.weapon&&s.weapon!=='none'&&s.weapon!=='claws')weapon(B,s.weapon,p.weapon==='bow'?p.hL:(s.weapon==='bow'?p.hL:p.hR),s.weapon==='bow'?p.dL:p.dS,s);
  if(s.weapon==='bow'&&(mode==='attack'||mode==='skill')&&f<2)B.line([p.hR,add3(p.hL,[0,1,0],1)],'#e8d8a8',.9);
  if(s.shield){const c0=add3(p.hL,[0,2.5,0]);disc(B,c0,nrm(1,.3,0),[0,0,1],5*bw,s.shield,{edge:s.trim||'#c9a24a',ew:.9,d:-.6});}
  // 머리
  const hd=[0,1+(s.headF||0),hz];if(s.heads===2){head(B,[-4.6*bw,hd[1],hz-1],hr,fw,sd,up);head(B,[4.6*bw,hd[1],hz],hr,fw,sd,up);}else head(B,hd,hr,fw,sd,up);
  // 이펙트
  fxBiped(B,p,hd,hr);};
function head(B,hd,r,fw,sd,up){const s=B.s,h=s.head||'plain',sk=s.skin||'#8a9a6a',ec=s.eye||'#ffdd55',eg=s.eyeGlow;
  const P=(x,y,z)=>[hd[0]+x*r,hd[1]+y*r,hd[2]+z*r];
  if(h==='skull'){B.ball(hd,r,'#e8e2d0');B.ball(P(0,.55,-.55),r*.55,'#d6cfba',{sy:.7});for(const g of[-1,1])B.ball(P(.36*g,.78,.08),r*.24,'#1a1210',{flat:1,glow:eg,d:-.05});B.ball(P(0,.92,-.25),r*.1,'#2a1a14',{flat:1,d:-.06});
    if(s.crest)B.poly([P(0,-.2,1),P(0,.7,1.25),P(0,1.1,.6),P(0,-1,.7)],s.crest,{grad:1,d:-.1});if(s.helm)B.ball(P(0,0,.35),r*1.02,s.helm,{sy:.7,d:-.02});return;}
  if(h==='helm'){B.ball(hd,r*1.05,s.helm||'#3a3d46');B.cap(P(-.6,.85,.05),P(.6,.85,.05),r*.22,'#08080a',{d:-.1});eyes(B,hd,fw,sd,r,s.eye||'#ff4030',eg||'255,80,40',0,.3);if(s.plume)B.cap(P(0,-.2,1),P(0,-1.4,.6),r*.35,s.plume,{w1:r*.15});return;}
  if(h==='hood'){B.ball(hd,r*1.12,s.hood||s.cloth||'#3a3a5a');B.ball(P(0,.48,-.12),r*.72,'#0a0810',{sy:.95,d:-.1});eyes(B,hd,fw,sd,r*.95,ec,eg||'255,230,140',-.1,.3);B.poly([P(-.7,-.3,.9),P(.7,-.3,.9),P(0,-1.2,1.9)],s.hood||s.cloth||'#3a3a5a',{grad:1,d:.1});if(s.beard)B.poly([P(-.5,.85,-.35),P(.5,.85,-.35),P(0,.95,-1.6)],s.beard,{grad:1,d:-.2});return;}
  B.ball(hd,r,sk);
  if(h==='owl'){B.ball(P(0,0,-.05),r*1.05,sk,{sx:1.08,sy:.95});B.ball(P(0,.55,0),r*.62,s.face||tone(sk,.25),{flat:1,sx:1.4,d:-.04});for(const g of[-1,1]){B.ball(P(.36*g,.82,.12),r*.26,'#f8e8a0',{flat:1,d:-.06,glow:eg});B.ball(P(.36*g,.9,.12),r*.11,'#100',{flat:1,d:-.08});B.cap(P(.6*g,-.1,.8),P(.8*g,-.3,1.5),r*.3,sk,{w1:r*.05});}B.cap(P(0,.95,-.05),P(0,1.35,-.4),r*.25,'#d0b060',{w1:r*.05,d:-.1});return;}
  if(h==='orc'||h==='brute'||h==='goblin'||h==='kobold'||h==='plain'||h==='zombie'||h==='fish'||h==='harpy'||h==='elf'||h==='cyclops'){
    const ear=h==='goblin'?1.4:h==='orc'?1:h==='kobold'?.9:h==='brute'||h==='cyclops'?.6:h==='elf'?1.5:0;
    if(ear&&h!=='kobold')for(const g of[-1,1])B.cap(P(.9*g,0,.15),P((1.2+ear)*g,-.3,.5+ear*.25),r*.35,sk,{w1:r*.08});
    if(h==='kobold'){for(const g of[-1,1])B.cap(P(.5*g,-.1,.8),P(.6*g,-.3,1.6),r*.3,sk,{w1:r*.08});B.cap(P(0,.6,-.2),P(0,1.5,-.3),r*.55,sk,{w1:r*.35});B.ball(P(0,1.55,-.2),r*.17,'#1a1412');}
    if(h==='goblin')B.ball(P(0,1,-.05),r*.28,tone(sk,-.15));
    if(h==='orc'||h==='brute'){B.ball(P(0,.7,-.45),r*.6,tone(sk,-.08),{sy:.7});for(const g of[-1,1])B.cap(P(.3*g,.95,-.55),P(.36*g,1.08,-.1),r*.17,'#efe6cc',{w1:r*.06});B.cap(P(-.55,.82,.42),P(.55,.82,.42),r*.18,tone(sk,-.35));}
    if(h==='fish'){B.poly([P(0,-.2,.7),P(0,.5,1.5),P(0,-1.1,1.1),P(0,-1.2,.2)],s.fin||'#3a8aa0',{grad:1,alpha:.9});for(const g of[-1,1])B.poly([P(.95*g,0,.1),P(1.6*g,-.4,.5),P(1.4*g,-.6,-.3)],s.fin||'#3a8aa0',{grad:1});}
    if(h==='harpy'){B.poly([P(-.9,-.3,.6),P(.9,-.3,.6),P(0,-1.6,1.4)],s.hair||'#6a3a5a',{grad:1});B.poly([P(-1,-.6,.2),P(1,-.6,.2),P(.9,-1.2,-1.4),P(-.9,-1.2,-1.4)],s.hair||'#6a3a5a',{grad:1,d:.3});B.cap(P(0,.85,-.1),P(0,1.25,-.35),r*.2,'#d0a040',{w1:r*.05});}
    if(h==='zombie'){B.ball(P(.15,.75,-.55),r*.32,'#3a1a14',{flat:1,d:-.06});}
    if(s.hair&&h!=='harpy')B.ball(P(0,-.15,.35),r*.98,s.hair,{sy:.75,d:.05});
    if(s.helm)B.ball(P(0,0,.38),r*1.05,s.helm,{sy:.68,d:-.03});
    if(s.horns)for(const g of[-1,1])B.cap(P(.6*g,0,.6),P(1.2*g,-.3,1.5),r*.32,s.horns,{w1:r*.06});
    if(s.beard)B.poly([P(-.6,.8,-.3),P(.6,.8,-.3),P(0,.85,-1.7)],s.beard,{grad:1,d:-.2});
    if(h==='cyclops'||s.oneEye){B.ball(P(0,.86,.2),r*.34,'#f6efd8',{d:-.05});B.ball(P(0,.98,.2),r*.17,s.eye||'#c02020',{flat:1,glow:eg,d:-.07});return;}
    eyes(B,hd,fw,sd,r,ec,eg,h==='zombie'?.05:0,h==='goblin'?.42:.36);return;}
  if(h==='wolf'||h==='demon'||h==='goat'||h==='rat'||h==='bull'||h==='lizard'||h==='hyena'){const sn=h==='goat'?1.3:h==='demon'?.9:h==='bull'?.75:h==='rat'?1.3:h==='lizard'?1.7:1.5;B.cap(P(0,.5,-.1),P(0,.5+sn,-.35),r*(h==='bull'?.85:.62),s.snoutC||sk,{w1:r*(h==='bull'?.7:h==='rat'?.3:.42)});
    if(h==='hyena')for(const g of[-1,1])B.cap(P(.5*g,-.1,.7),P(.62*g,-.2,1.4),r*.42,sk,{w1:r*.14});if(h==='hyena'&&s.spots)for(let i=0;i<4;i++)B.ball(P(Math.sin(i*2.1)*.6,-.3+i*.1,.4+Math.cos(i)*.3),r*.14,s.spots,{flat:1,d:-.02});
    if(h==='rat')for(const g of[-1,1])B.ball(P(.7*g,-.1,.75),r*.42,s.earC||'#d8a0a0',{sy:.95,d:.05});
    if(h==='bull'){for(const g of[-1,1]){const a=P(.7*g,0,.55),b=P(1.6*g,.3,.8),c2=P(1.7*g,.8,1.4);B.cap(a,b,r*.36,s.horns||'#e8dcc0',{w1:r*.22});B.cap(b,c2,r*.22,s.horns||'#e8dcc0',{w1:r*.06});}B.cap(P(-.25,1.3,-.6),P(.25,1.3,-.6),r*.09,'#d0b040',{d:-.1});}
    if(h==='lizard')for(let i=0;i<4;i++)B.cap(P(0,.2-i*.4,.85-i*.1),P(0,-.1-i*.4,1.3-i*.15),r*.18,s.crest||tone(sk,-.3),{w1:r*.04});B.ball(P(0,.55+sn,-.3),r*.2,'#1a1210');
    if(h==='wolf')for(const g of[-1,1])B.cap(P(.5*g,-.1,.7),P(.62*g,-.2,1.6),r*.38,sk,{w1:r*.06});
    if(h==='goat'||h==='demon'){for(const g of[-1,1]){const a=P(.5*g,-.1,.8),b=P(1.3*g,-.6,1.5),c=P(1.6*g,-1.2,.7);B.cap(a,b,r*.4,s.horns||'#cfc0a0',{w1:r*.25});B.cap(b,c,r*.25,s.horns||'#cfc0a0',{w1:r*.08});}if(h==='goat')B.poly([P(-.25,1.4,-.9),P(.25,1.4,-.9),P(0,1.3,-1.9)],s.beard||'#d8d0c0',{d:-.2});}
    if(s.crown)for(let i=-2;i<=2;i++)B.cap(P(i*.3,0,.85),P(i*.36,-.05,1.35+(i%2?0:.25)),r*.18,s.crown,{w1:r*.04});
    eyes(B,hd,fw,sd,r,ec,eg,.18,.42);return;}
  if(h==='golem'){B.ball(P(0,.1,-.1),r*1.05,sk,{sx:1.1,sy:.85});eyes(B,hd,fw,sd,r,s.eye||'#ffb040',eg||'255,170,60',.05,.32);return;}
  eyes(B,hd,fw,sd,r,ec,eg);}
function fxBiped(B,p,hd,hr){const s=B.s,c=s.fx||'255,220,150',{f,t}=B,wpt=k=>add3(s.weapon==='bow'?p.hL:p.hR,s.weapon==='bow'?p.dL:p.dS,k);
  if(p.fx==='slash')B.arc([[6,-2,s.hip+30],wpt(24),[-6,10,s.hip-6]],c,2.6);
  if(p.fx==='claw')for(let i=0;i<3;i++)B.arc([[6+i,-1,s.hip+24],[2+i*2,12,s.hip+12],[-6+i,8,s.hip+2]],c,1);
  if(p.fx==='thrust')B.spark(wpt(28),7,c,.8);
  if(p.fx==='bolt')B.glow(wpt(18),6,c,.9);
  if(p.fx==='arrow'){B.glow([0,22,s.hip+14],3,c,.6);}
  if(p.fx==='buff'){for(let i=0;i<2;i++){const kk=((f+i*2)%4)/4;B.ring(8+kk*14,c,(1-kk)*.8);}B.glow([0,4,s.hip+30],5+f*1.5,c,.55);for(let i=0;i<8;i++){const a=i/8*Math.PI*2+f*.4;B.glow([Math.cos(a)*11,Math.sin(a)*11,8+((i*7+f*9)%38)],1.6,c,.9);}}
  if(p.fx==='charge')B.glow(wpt(s.weapon==='staff'?16:20),5+f,c,.8);
  if(p.fx==='burst'){B.spark(wpt(s.weapon==='staff'?16:26),13,c,1);B.ring(14,c,.6);}
  if(p.fx==='volley')for(let i=-1;i<=1;i++)B.glow([i*5,20,s.hip+14],2.4,c,.8);
  if(p.fx==='fade')for(let i=0;i<9;i++)B.glow([Math.sin(i*2.3)*9,6+Math.cos(i*1.7)*6,16+i*3.5],1.4,c,.5);
  if(s.aura)for(let i=0;i<4;i++){const ph=((t/1400)+i/4)%1;B.glow([Math.cos(i*1.7+t/900)*8,Math.sin(i*2.3)*5,8+ph*44],1.4,s.aura,(1-ph)*.7);}}

// ---------- 네 발 짐승 ----------
PLANS.quad=function(B){const s=B.s,{mode,f,t}=B,run=mode==='run',walk=mode==='walk'||run;const h=s.h||14,L=s.len||12,bw=s.bulk||1,sk=s.skin||'#7a7a80';
  const ph=f*Math.PI/2+(run?Math.PI/4:0);let lunge=0,headUp=0,jaw=0,pitch=0,jump=0;
  if(mode==='attack'){lunge=[-2,6,2][f];jaw=[0,1,.2][f];pitch=[.05,-.12,0][f];}
  if(mode==='buff'){headUp=[.4,.9,.9,.5][f];jaw=[.3,.8,.8,.3][f];pitch=[.08,.18,.18,.1][f];}
  if(mode==='skill'){lunge=[-4,2,9,3][f];jump=[0,4,2,0][f];jaw=[0,.4,1,.2][f];pitch=[.1,-.05,-.15,0][f];}
  B.st.pitch=pitch;B.st.lz=999;B.st.bob=walk?(run?Math.abs(Math.sin(ph))*2.5:Math.abs(Math.sin(ph))*.8):(mode==='idle'?Math.sin(t/700)*.3:0)+jump;B.st.bz=h*.5;
  const ny=lunge;const legs=s.legs||4;const front=[0,L*.5+ny,h+1],rear=[0,-L*.5+ny*.5,h];
  // 다리
  const lp=[[-1,1],[1,1],[-1,-1],[1,-1],[-1,0],[1,0]].slice(0,legs);
  lp.forEach(([sx,sy],i)=>{const diag=(i%2===0)===(sy>0);const sw=walk?Math.cos(ph+(run?(sy>0?0:Math.PI*.6):(diag?0:Math.PI))):0,lift=walk?Math.max(0,Math.sin(ph+(diag?0:Math.PI)))*(run?4:2.5):0;
    const top=[sx*4*bw*(s.wideLegs||1),sy*L*.42+ny*(sy>0?1:.5),h-1],ft=[sx*4.6*bw*(s.wideLegs||1),sy*L*.42+ny*(sy>0?1:.5)+sw*(run?5:3.2),lift],kn=[top[0]*1.05,(top[1]+ft[1])/2+(sy>0?-1.5:1.5),(h+lift)/2];
    B.cap(top,kn,(s.legW||3.6)*bw,sk,{w1:(s.legW||3.6)*.8*bw});B.cap(kn,ft,(s.legW||3.6)*.8*bw,s.legC||sk,{w1:(s.legW||3.6)*.55*bw});B.ball(ft,1.6*bw,s.paw||tone(sk,-.3),{sy:.6});});
  // 몸
  {const R0=(s.bodyR||6)*bw;B.cap([0,-L*.5+ny*.5,h+1],[0,L*.45+ny,h+1+(s.chestUp||1)],R0*1.9,sk,{w1:R0*2.05,d:.1});if(s.chest)B.ball([0,L*.48+ny,h+(s.chestUp||1)-.5],R0*.8,s.chest,{sy:.9,d:.05});}
  if(s.shell){const R0=(s.bodyR||6)*bw;B.ball([0,ny*.6,h+R0*.55],R0*1.55,s.shell,{sy:.62,d:-.2});for(let i=0;i<6;i++){const a=i/6*Math.PI*2;B.ball([Math.cos(a)*R0*.8,ny*.6+Math.sin(a)*R0*.8,h+R0*1.15],R0*.35,tone(s.shell,.12),{flat:1,sy:.45,d:-.3});}B.ball([0,ny*.6,h+R0*1.4],R0*.42,tone(s.shell,.18),{flat:1,sy:.45,d:-.32});}
  if(s.stripes){const R0=(s.bodyR||6)*bw;for(let i=0;i<5;i++){const y=-L*.4+i*L*.2+ny*.7;B.cap([-R0*.75,y,h+R0*.5],[0,y+.5,h+R0*1.02],1.1,'#2a1a10',{w1:.3,d:-.3});B.cap([R0*.75,y,h+R0*.5],[0,y+.5,h+R0*1.02],1.1,'#2a1a10',{w1:.3,d:-.3});}}
  if(s.spines)for(let i=0;i<5;i++)B.cap([0,-L*.4+i*L*.2,h+1+(s.bodyR||6)*bw*.8],[0,-L*.4+i*L*.2-1,h+4+(s.bodyR||6)*bw],1.4,s.spines,{w1:.3});
  if(s.mane)for(let i=0;i<4;i++)B.ball([0,L*.35+ny-i*1.6,h+(s.bodyR||6)*bw*.8],3.2*bw,s.mane,{d:-.1});
  // 날개
  if(s.wings){const fl=Math.sin(f*1.6+t/250)*5+(mode==='buff'?8:0)+(run?4:0);for(const g of[-1,1])B.poly([[3*g,L*.1+ny,h+5],[18*g*bw,L*.1+ny-2,h+14+fl],[26*g*bw,ny-6,h+6+fl],[14*g*bw,-L*.3,h+3+fl*.4],[3*g,-L*.2,h+4]],s.wings,{grad:1,d:.4});}
  // 꼬리
  if(s.tail){const n=s.tailN||3;let a=[0,-L*.6+ny*.5,h+2];for(let i=1;i<=n;i++){const b=[Math.sin(t/300+i+f)*1.5*i*.5,-L*.6-i*(s.tailL||4),h+2+(s.tailUp||1.5)*i-(s.tailDrop||0)*i*i];B.cap(a,b,(s.tailW||2.4)*(1-i/(n+1)*.6)*bw,s.tailc||sk,{w1:(s.tailW||2.4)*(1-(i+1)/(n+1)*.6)*bw});a=b;}}
  // 머리(여러 개 가능)
  const heads=s.heads||1;for(let hi=0;hi<heads;hi++){const off=heads>1?(hi-(heads-1)/2)*5*bw:0,ang2=heads>1?(hi-(heads-1)/2)*.35:0;
    const neck=[off*.5,front[1]+2,h+3+headUp*3],hd=[off,front[1]+4+(s.neckL||2)-headUp*2,h+5+headUp*7+(s.headZ||0)];B.cap(neck,hd,4*bw,s.mane||sk,{w1:3.2*bw});
    const r=(s.headR||4.3)*bw,fwd=nrm(Math.sin(ang2),Math.cos(ang2)*(1-headUp*.3),headUp*.6);B.ball(hd,r,sk);
    const sn=s.snout??1.6,tip=add3(add3(hd,fwd,r*(1+sn)),[0,0,-r*.25]);if(s.beak){B.cap(add3(hd,fwd,r*.5),tip,r*.7,s.beak,{w1:r*.15});B.cap(tip,add3(tip,[0,0,-r*.5]),r*.18,s.beak,{w1:r*.05});}else{B.cap(add3(hd,fwd,r*.4),tip,r*.95,s.snoutC||sk,{w1:r*.6});B.ball(tip,r*.28,'#141010',{d:-.05});}
    if(s.sabers)for(const g of[-1,1])B.cap(add3(add3(hd,fwd,r*(.9+sn*.6)),[g*r*.32,0,-r*.3]),add3(add3(hd,fwd,r*(.8+sn*.6)),[g*r*.3,0,-r*1.7]),r*.2,'#f4ecd8',{w1:r*.05,d:-.08});
    if(jaw>.1)B.cap(add3(add3(hd,fwd,r*.5),[0,0,-r*.5]),add3(add3(tip,[0,0,-r*.7*jaw]),fwd,-r*.2),r*.5,tone(s.snoutC||sk,-.15),{w1:r*.35});
    if(jaw>.5)B.glow(add3(tip,[0,0,-r*.3]),2.2,s.fx||'255,200,120',.5);
    if(s.tusks)for(const g of[-1,1])B.cap(add3(add3(tip,[g*r*.4,0,-r*.3]),fwd,-r*.5),add3(add3(tip,[g*r*.6,0,r*.4]),fwd,-r*.1),r*.18,'#efe6cc',{w1:r*.07,d:-.06});
    if(s.ears==='round')for(const g of[-1,1])B.ball(add3(hd,[g*r*.65,-r*.2,r*.75]),r*.38,s.earC||sk,{d:.05});else if(s.ears)for(const g of[-1,1])B.cap(add3(hd,[g*r*.55,-r*.2,r*.6]),add3(hd,[g*r*.7,-r*.5,r*(s.ears==='flop'?.2:1.5)]),r*.4,s.earC||sk,{w1:r*.08});
    if(s.horns)for(const g of[-1,1])B.cap(add3(hd,[g*r*.4,-r*.3,r*.6]),add3(hd,[g*r*.9,-r*1.6,r*1.4]),r*.3,s.horns,{w1:r*.06});
    if(s.comb)B.poly([add3(hd,[0,r*.3,r*.8]),add3(hd,[0,-r*.2,r*1.7]),add3(hd,[0,-r*.9,r*.9])],s.comb,{grad:1});
    for(const g of[-1,1]){const e=add3(add3(add3(hd,fwd,r*.62),[Math.cos(ang2)*g*r*.52,0,0]),[0,0,r*.28]);B.ball(e,r*.2,s.eye||'#ffcc33',{flat:1,glow:s.eyeGlow,d:-.05});}}
  const c=s.fx||'255,200,120';
  if(mode==='buff'){for(let i=0;i<2;i++){const kk=((f+i*2)%4)/4;B.ring(8+kk*16,c,(1-kk)*.7);}}
  if(mode==='skill'&&f===2){if(s.breath)for(let i=1;i<6;i++)B.glow([0,L*.5+ny+6+i*4,h+4-i*.5],2+i*1.3,c,.75-i*.08);else B.spark([0,L*.5+ny+8,h+3],9,c,.8);}
  if(mode==='attack'&&f===1)B.arc([[-5,L*.5+ny+2,h+8],[0,L*.5+ny+9,h+3],[5,L*.5+ny+2,h-2]],c,1.6);};

// ---------- 벌레·거미·전갈·기어다니는 손 ----------
PLANS.bug=function(B){const s=B.s,{mode,f,t}=B,run=mode==='run',walk=mode==='walk'||run,sk=s.skin||'#3a2a20',bw=s.bulk||1,h=s.h||6;
  const ph=f*Math.PI/2+(run?Math.PI/4:0);let rear=0,lunge=0,snap=0,sting=0;
  if(mode==='attack'){lunge=[-1,4,1][f];snap=[0,1,.3][f];sting=[.3,1,.4][f];}
  if(mode==='buff'){rear=[.4,.9,.9,.5][f];}
  if(mode==='skill'){rear=[.3,.6,.2,0][f];lunge=[-2,0,5,1][f];sting=[.5,.8,1.2,.4][f];}
  B.st.lz=999;B.st.bob=walk?Math.abs(Math.sin(ph*2))*.5:(mode==='idle'?Math.sin(t/500)*.2:0);B.st.bz=-99;B.st.pitch=rear*.25;
  if(s.fly){B.st.bob+=s.fly+Math.sin(t/200+f)*1.2;B.st.bz=-999;}
  if(s.bwings){const fl=Math.sin(t/60+f*2)*.6;for(const g of[-1,1])for(const[dy,len]of[[1,1],[-2,.85]]){B.poly([[g*2,dy,h+s.segs[1][2]+2],[g*(s.wingL||12)*len,dy+3,h+5+fl*4],[g*(s.wingL||12)*len*1.05,dy-2,h+4+fl*3],[g*3,dy-1,h+s.segs[1][2]+1.5]],s.wingC||'#d8f0ff',{alpha:.55,d:-.3});}}
  const segs=s.segs||[[0,-8,1.2,6],[0,0,1,4.4],[0,5,1,3.6]];// [x,y,zOff,r]
  const nl=s.legs||6,spread=s.spread||10;
  for(let i=0;i<nl;i++){const sg=i%2?1:-1,row=Math.floor(i/2),rows=nl/2,yb=(s.legY0??2)-row*(s.legStep||2.2)+lunge,tri=(row%2===0)===(sg>0);
    const sw=walk?Math.cos(ph+(tri?0:Math.PI))*(run?3.2:2.2):0,lift=walk?Math.max(0,Math.sin(ph+(tri?0:Math.PI)))*(run?2.5:1.6):0;
    const root=[sg*2.5*bw,yb,h],knee=[sg*(spread*.6)*bw,yb+(row-(rows-1)/2)*2+sw*.5,h+(s.knee||5)],ft=[sg*spread*bw,yb+(row-(rows-1)/2)*4.5+sw,lift];
    B.cap(root,knee,(s.legW||1.6)*bw,s.legC||sk,{w1:(s.legW||1.6)*.85*bw});B.cap(knee,ft,(s.legW||1.6)*.8*bw,s.legC||sk,{w1:.5*bw});}
  segs.forEach(([x,y,z,r],i)=>B.ball([x*bw,y+lunge*(i===segs.length-1?1:.4),h+z+(i===segs.length-1?rear*5:rear*2*(i/segs.length))],r*bw,i===0&&s.abd?s.abd:sk,{sy:.8,d:.1}));
  const hd=segs[segs.length-1],hp=[0,hd[1]+lunge,h+hd[2]+rear*5],hr=hd[3]*bw;
  if(s.mand)for(const g of[-1,1]){const a=add3(hp,[g*hr*.5,hr*.7,-hr*.3]),b=add3(hp,[g*hr*(.9-snap*.6),hr*1.7,-hr*.4]);B.cap(a,b,1.2*bw,s.mand,{w1:.4});}
  if(s.pincer)for(const g of[-1,1]){const a=add3(hp,[g*hr*.8,hr*.3,0]),el=add3(hp,[g*hr*1.9,hr*1.6+lunge*.3,1+rear*2]),cl=add3(el,[g*-1*(1-snap*.5),3.5+snap*2,.5]);B.cap(a,el,2*bw,sk);B.ball(el,2.4*bw,s.claw||sk,{sy:.8});B.cap(el,cl,1.6*bw,s.claw||sk,{w1:.4});B.cap(el,add3(cl,[g*1.6,-.5,0]),1.2*bw,s.claw||sk,{w1:.3});}
  if(s.stinger){let a=add3([0,segs[0][1],h+segs[0][2]],[0,-segs[0][3]*bw*.8,0]);const n=5;for(let i=1;i<=n;i++){const th=i/n*Math.PI*(.75+sting*.3);const b=[0,segs[0][1]-Math.sin(th)*9*bw+ (i===n?sting*4:0),h+segs[0][2]+(1-Math.cos(th))*7*bw];B.cap(a,b,2*bw*(1-i*.1),sk,{w1:1.8*bw*(1-i*.12)});a=b;}B.cap(a,add3(a,[0,2.5+sting,-1.5]),1.4,'#2a1a10',{w1:.2});if(mode==='skill'&&f===2)B.glow(a,4,s.fx||'160,255,120',.9);}
  if(s.fingers){for(let i=0;i<4;i++)B.cap([-3+i*2,hd[1]+hr*.6,h],[-4+i*2.6,hd[1]+hr*.6+6+(walk?Math.sin(ph+i)*1.5:0),.6],1.3,sk,{w1:.9});}
  for(let i=0;i<(s.eyeN||2);i++){const g=s.eyeN>2?(i-(s.eyeN-1)/2)*.35:(i?1:-1)*.4;B.ball(add3(hp,[g*hr,hr*.82,hr*.32+(s.eyeN>2&&i%2?hr*.2:0)]),hr*.16,s.eye||'#ff3020',{flat:1,glow:s.eyeGlow,d:-.05});}
  if(s.marks)B.ball([0,segs[0][1],h+segs[0][2]+segs[0][3]*bw*.75],segs[0][3]*bw*.45,s.marks,{flat:1,sy:.5,d:-.1,alpha:.85});
  const c=s.fx||'200,255,140';if(mode==='buff'){const kk=(f%4)/4;B.ring(8+kk*14,c,(1-kk)*.7);}if(mode==='skill'&&f===2&&!s.stinger)B.spark([0,hd[1]+lunge+10,h+3],8,c,.85);if(mode==='attack'&&f===1)B.glow([0,hd[1]+lunge+hr+3,h+1],4,c,.6);};

// ---------- 둥근 몸(눈·슬라임·버섯) ----------
PLANS.blob=function(B){const s=B.s,{mode,f,t}=B,run=mode==='run',walk=mode==='walk'||run,sk=s.skin||'#7a9a3a',r=s.r||9;
  const ph=f*Math.PI/2;let hop=walk?Math.abs(Math.sin(ph))*(run?5:3):0,sq=walk?1+.12*Math.cos(ph*2):1,lunge=0,pulse=0;
  if(mode==='attack'){lunge=[-2,5,1][f];sq=[1.15,.85,1][f];}if(mode==='buff'){pulse=[.05,.12,.12,.06][f];}if(mode==='skill'){sq=[1.2,1.05,.9,1][f];lunge=[0,0,2,0][f];}
  const fl=s.float?6+Math.sin(t/500+f)*1.5:0;B.st.lz=999;B.st.bz=-99;B.st.bob=0;const z0=fl+hop;
  if(s.kind==='mush'){const st=[0,lunge,z0],cap0=[0,lunge,z0+r*1.1];B.cap([0,lunge,z0],cap0,r*.9,s.stem||'#e8dcc0',{w1:r*.75});for(const g of[-1,1])B.ball([g*2.5,lunge+(walk?Math.sin(ph+(g>0?0:Math.PI))*2:0),z0*.3+1],1.8,s.stem||'#e8dcc0',{sy:.6});
    B.ball([0,lunge,z0+r*1.35],r*(1.25+pulse),sk,{sy:.62*sq,d:.2});for(let i=0;i<6;i++){const a=i/6*Math.PI*2;B.ball([Math.cos(a)*r*.75,lunge+Math.sin(a)*r*.75,z0+r*1.55],r*.18,s.spots||'#f0e8d0',{flat:1,sy:.5,d:-.1});}
    for(const g of[-1,1])B.ball([g*r*.25,lunge+r*.42,z0+r*.75],r*.12,'#1a1410',{flat:1,d:-.06});B.cap([-r*.2,lunge+r*.44,z0+r*.45],[r*.2,lunge+r*.44,z0+r*.45],r*.06,'#3a2010',{d:-.06});}
  else if(s.kind==='beholder'){const R0=r*(1+pulse)*sq;B.ball([0,lunge,z0+r],R0,sk,{d:.1});B.ball([0,lunge+r*.72,z0+r*1.15],r*.5,'#f4efe6',{d:-.02});B.ball([0,lunge+r*.92,z0+r*1.15],r*.26,s.iris||'#40a040',{glow:mode==='skill'||mode==='attack'?s.fx:null,d:-.06});B.ball([0,lunge+r*.98,z0+r*1.15],r*.11,'#100',{flat:1,d:-.08});
    B.ball([0,lunge+r*.86,z0+r*.55],r*.42,'#3a0a10',{flat:1,sx:1.3,sy:.55,d:-.03});for(let i=0;i<5;i++)B.cap([-r*.4+i*r*.2,lunge+r*.9,z0+r*.68],[-r*.4+i*r*.2,lunge+r*.92,z0+r*.52],r*.07,'#f0e8d0',{w1:r*.02,d:-.05});
    for(let i=0;i<7;i++){const a=i/7*Math.PI*2,sw=Math.sin(t/400+i)*1.2;const b=[Math.cos(a)*r*.55,lunge+Math.sin(a)*r*.55-r*.1,z0+r*1.75],tip=[Math.cos(a)*r*(1.1+sw*.05),lunge+Math.sin(a)*r*1.05-r*.2,z0+r*2.5+sw];B.cap(b,tip,1.4,tone(sk,-.1),{w1:.8});B.ball(tip,1.5,'#f4efe6');B.ball(add3(tip,[0,1,0]),.7,s.iris||'#40a040',{flat:1,d:-.04});}
    if(mode==='skill'&&f>=2)for(let i=1;i<6;i++)B.glow([0,lunge+r+i*4,z0+r*1.15],1.6+i*.5,s.fx||'120,255,120',.85);}
  else if(s.kind==='chest'){const W=r,D=r*.75,H0=r*.8,open=mode==='attack'?[.2,1,.5][f]:mode==='skill'?[.3,.9,1.1,.4][f]:mode==='buff'?.6:walk?.25+.15*Math.sin(ph*2):.08;const zb=z0,c0=s.wood||'#7a4a24',band=s.band||'#c0a050';
    const box=(x0,x1,y0,y1,za,zb2,col,d)=>{B.poly([[x0,y0+lunge,za],[x1,y0+lunge,za],[x1,y0+lunge,zb2],[x0,y0+lunge,zb2]],col,{grad:1,d});B.poly([[x0,y1+lunge,za],[x1,y1+lunge,za],[x1,y1+lunge,zb2],[x0,y1+lunge,zb2]],col,{grad:1,d});B.poly([[x0,y0+lunge,za],[x0,y1+lunge,za],[x0,y1+lunge,zb2],[x0,y0+lunge,zb2]],tone(col,-.15),{grad:1,d});B.poly([[x1,y0+lunge,za],[x1,y1+lunge,za],[x1,y1+lunge,zb2],[x1,y0+lunge,zb2]],tone(col,-.15),{grad:1,d});};
    box(-W,W,-D,D,zb,zb+H0,c0,0);B.poly([[-W*.9,-D*.9+lunge,zb+H0],[W*.9,-D*.9+lunge,zb+H0],[W*.9,D*.9+lunge,zb+H0],[-W*.9,D*.9+lunge,zb+H0]],'#2a0a0a',{d:.05});
    const ca=Math.cos(open*1.1),sa=Math.sin(open*1.1),hz=zb+H0;const lid=(x,yy,zz)=>[x,-D+lunge+(yy)*ca-(zz)*sa,hz+(yy)*sa+(zz)*ca];
    B.poly([lid(-W,0,0),lid(W,0,0),lid(W,2*D,0),lid(-W,2*D,0)],c0,{grad:1,d:-.1});B.poly([lid(-W,0,0),lid(W,0,0),lid(W,0,H0*.45),lid(-W,0,H0*.45)],tone(c0,.1),{grad:1,d:-.12});B.cap(lid(-W,2*D,0),lid(W,2*D,0),1.2,band,{d:-.15});
    if(open>.3){for(let i=0;i<6;i++)B.cap([-W*.8+i*W*.32,D*.85+lunge,hz],[-W*.8+i*W*.32,D*.85+lunge,hz+1.6],.9,'#f4ecd8',{w1:.2,d:-.2});B.cap([0,0+lunge,hz],[0,D*1.4+lunge+open*3,hz+1+open*2],2.2,'#c04060',{w1:1.4,d:-.25});}
    for(const g of[-1,1])B.ball([g*W*.5,D*.6+lunge,hz+H0*.15*open+1],1.1,s.eye||'#ffd030',{flat:1,glow:s.eyeGlow||'255,200,60',d:-.3,alpha:open>.15?1:0});
    B.cap([-W,D+lunge,zb+H0*.5],[W,D+lunge,zb+H0*.5],1,band,{d:-.05});}
  else if(s.kind==='jelly'){const R0=r*(1+pulse);B.ball([0,lunge,z0+r*1.4],R0,sk,{sy:.72*sq,alpha:.75,d:.1});B.ball([-r*.3,lunge+r*.2,z0+r*1.7],r*.35,'#ffffff',{flat:1,alpha:.3,d:-.1});B.ball([0,lunge,z0+r*1.3],r*.35,s.core||'#ffe0ff',{glow:s.fx,alpha:.9,d:.05});
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2,bx=Math.cos(a)*r*.7,by=Math.sin(a)*r*.7;let p0=[bx,lunge+by,z0+r*1.0];for(let j=1;j<=3;j++){const p1=[bx*(1-j*.1)+Math.sin(t/300+i+j)*1.2,lunge+by*(1-j*.1)-(walk?j*1.2:0),z0+r*1.0-j*r*.33];B.cap(p0,p1,1.1-j*.2,tone(sk,.15),{w1:.9-j*.2,alpha:.7,d:.2});p0=p1;}}}
  else if(s.kind==='orb'){const R0=r*(.8+pulse);B.ball([0,lunge,z0+r*1.2],R0,sk,{glow:s.fx,d:.1});for(let i=0;i<4;i++){const a=t/300+i*1.57+f;B.ball([Math.cos(a)*r*1.4,lunge+Math.sin(a)*r*1.4,z0+r*1.2+Math.sin(a*2)*r*.4],r*.22,s.core||'#e0f0ff',{glow:s.fx});}
    for(let i=0;i<3;i++){const a=t/200+i*2.1;B.arc([[0,lunge,z0+r*1.2],[Math.cos(a)*r*1.3,lunge+Math.sin(a)*r*1.3,z0+r*1.8],[Math.cos(a+.6)*r*2,lunge+Math.sin(a+.6)*r*2,z0+r*.9]],s.fx||'160,220,255',.8);}}
  else if(s.kind==='egg'){const wob=walk?Math.sin(ph*2)*.12:Math.sin(t/500)*.04;B.ball([wob*r,lunge,z0+r*1.2],r*(1+pulse),sk,{sx:.85,sy:1.15*sq,d:.1});B.line([[-r*.5,lunge+r*.7,z0+r*1.6],[-r*.1,lunge+r*.8,z0+r*1.3],[r*.2,lunge+r*.78,z0+r*1.55],[r*.55,lunge+r*.6,z0+r*1.1]],'rgba(255,200,80,.95)',.9,{d:-.1});B.glow([0,lunge+r*.8,z0+r*1.3],r*.5+pulse*10,s.fx||'255,150,50',.6);}
  else if(s.kind==='flower'){const sway=Math.sin(t/500+f)*1.2;B.cap([0,0,0],[sway,lunge*.5,r*1.4],2.2,'#3a7a2a',{w1:1.6});for(const g of[-1,1])B.poly([[0,0,r*.4],[g*r*.9,1,r*.7],[g*r*.6,0,r*.25]],'#4a9a3a',{grad:1});
    const bz=[sway,lunge,r*1.7];for(let i=0;i<6;i++){const a=i/6*Math.PI*2+(mode==='buff'?f*.3:0);B.ball(add3(bz,[Math.cos(a)*r*.62,Math.sin(a)*r*.62,0]),r*.42,s.petal||'#e05a8a',{sy:.6,d:.1});}B.ball(bz,r*(.55+pulse),sk,{glow:mode==='skill'?s.fx:null,d:.05});B.cap(add3(bz,[0,0,r*.5]),add3(bz,[0,0,r*.95]),.8,'#3a2a1a');B.glow(add3(bz,[0,0,r*1]),1.4,'255,180,60',.9);
    if(mode==='skill'&&f===2)B.spark(bz,r*2,s.fx||'255,150,60',1);}
  else if(s.kind==='snowman'){const R0=r;B.ball([0,lunge,z0+R0*.85],R0,sk,{sy:.9,d:.2});B.ball([0,lunge,z0+R0*2.1],R0*.72,sk,{d:.15});const hz2=[0,lunge+(mode==='attack'?[0,1.5,.5][f]:0),z0+R0*3.05];B.ball(hz2,R0*.5,sk,{d:.1});
    for(const g of[-1,1]){B.ball(add3(hz2,[g*R0*.18,R0*.42,R0*.08]),R0*.07,'#141414',{flat:1,d:-.05});B.cap([g*R0*.6,lunge,z0+R0*2.3],[g*R0*1.5,lunge+(mode==='attack'&&f===1?R0:0),z0+R0*2.8+(mode==='buff'?R0*.6:0)],.9,'#5a3a1a');}
    B.cap(add3(hz2,[0,R0*.45,0]),add3(hz2,[0,R0*1.05,-.3]),R0*.14,'#f07a20',{w1:.2,d:-.06});B.cap(add3(hz2,[-R0*.48,0,R0*.32]),add3(hz2,[R0*.48,0,R0*.32]),R0*.22,s.hat||'#c03030',{d:-.02});for(let i=0;i<3;i++)B.ball([0,lunge+R0*.7,z0+R0*(1.7+i*.3)],R0*.06,'#141414',{flat:1,d:-.04});
    if(mode==='skill'&&f===2)for(let i=1;i<5;i++)B.glow([0,lunge+R0+i*4,z0+R0*2.4],1.6+i*.5,s.fx||'200,230,255',.8);}
  else if(s.kind==='eye'){B.ball([0,lunge,z0+r],r*(1+pulse)*sq,sk,{d:.1});const fw=[0,1,0];B.ball([0,lunge+r*.7,z0+r*1.05],r*.62,'#f4efe6',{d:-.02,sy:.95});B.ball([0,lunge+r*.92,z0+r*1.05],r*.32,s.iris||'#c02020',{glow:mode==='skill'?s.fx:null,d:-.06});B.ball([0,lunge+r*.98,z0+r*1.05],r*.14,'#100',{flat:1,d:-.08});
    for(let i=0;i<5;i++){const a=i/5*Math.PI*2+t/900;B.cap([Math.cos(a)*r*.5,lunge+Math.sin(a)*r*.5-r*.2,z0+r*.3],[Math.cos(a)*r*.9,lunge+Math.sin(a)*r*.9-r*.6,z0-r*.3+Math.sin(t/300+i)*1.5],1.4,tone(sk,-.15),{w1:.4,d:.2});}
    if(mode==='skill'&&f>=2)for(let i=1;i<5;i++)B.glow([0,lunge+r+i*4,z0+r],1.6+i*.4,s.fx||'255,80,80',.8);}
  else{B.ball([0,lunge,z0+r*.7*sq],r*(1+pulse),sk,{sy:.75/sq,alpha:.88,d:.1});B.ball([-r*.3,lunge+r*.3,z0+r*1.0*sq],r*.3,'#ffffff',{flat:1,alpha:.35,d:-.1});for(const g of[-1,1])B.ball([g*r*.3,lunge+r*.75,z0+r*.75*sq],r*.13,'#102010',{flat:1,d:-.06});
    if(s.core)B.ball([0,lunge,z0+r*.6],r*.3,s.core,{glow:s.fx,d:.05});}
  const c=s.fx||'180,255,140';if(mode==='buff'){const kk=(f%4)/4;B.ring(6+kk*14,c,(1-kk)*.7);B.glow([0,0,z0+r*1.2],r*.6+f,c,.4);}
  if(mode==='skill'&&f===2){if(s.kind==='mush')for(let i=0;i<10;i++)B.glow([Math.cos(i)*r*1.6,Math.sin(i*1.3)*r*1.6,z0+r*1.8+i%3*3],1.6,c,.8);else if(!['eye','beholder','flower','snowman','orb'].includes(s.kind))B.spark([0,lunge+r+5,z0+r*.6],8,c,.8);}};
// ---------- 물고기(상어) ----------
PLANS.fish=function(B){const s=B.s,{mode,f,t}=B,run=mode==='run',walk=mode==='walk'||run,sk=s.skin||'#6a7a8a',h=s.h||8,L=s.len||16;
  const ph=t/(run?120:220)+f*1.5,sw=Math.sin(ph)*(walk?3:1.5);let lunge=0,jaw=0,roll=0;if(mode==='attack'){lunge=[-2,6,2][f];jaw=[.2,1,.3][f];}if(mode==='buff'){roll=[.3,.6,.6,.3][f];}if(mode==='skill'){lunge=[-4,0,9,3][f];jaw=[0,.4,1,.2][f];}
  B.st.lz=999;B.st.bz=-999;B.st.bob=Math.sin(t/500)*.8;
  const head=[0,L*.5+lunge,h],mid=[sw*.3,lunge*.4,h+.5],tail=[sw,-L*.5+lunge*.2,h];B.cap(tail,mid,3.5,sk,{w1:8,d:.1});B.cap(mid,head,8,sk,{w1:5.5,d:.1});B.ball([0,L*.15+lunge,h-1.5],4.5,s.belly||'#e8e8e0',{sy:.6,d:.05});
  B.poly([[0,lunge*.4+1,h+3.5],[0,lunge*.4-3,h+10+roll*3],[0,lunge*.4-5,h+3.5]],tone(sk,-.1),{grad:1});B.poly([[sw,-L*.5+lunge*.2,h],[sw*1.6,-L*.5-5,h+7],[sw*1.3,-L*.5-3,h],[sw*1.6,-L*.5-5,h-5]],tone(sk,-.1),{grad:1});
  for(const g of[-1,1])B.poly([[g*3,L*.15+lunge,h-1],[g*9,L*.05+lunge-2,h-3-roll*2],[g*3,L*.02+lunge,h-1.5]],tone(sk,-.15),{grad:1});
  if(jaw>.2){B.cap(add3(head,[0,-1,-1.8]),add3(head,[0,3,-2.5-jaw*2]),3,'#7a2a2a',{w1:2,d:-.1});for(let i=-2;i<=2;i++)B.cap(add3(head,[i*1,2.4,-1.2]),add3(head,[i*1,2.6,-2]),.5,'#f8f0e0',{w1:.1,d:-.15});}
  for(const g of[-1,1])B.ball(add3(head,[g*2.3,0,.8]),.7,'#101010',{flat:1,d:-.05});
  const c=s.fx||'120,200,255';B.ring(10+Math.sin(t/300)*2,c,.25);if(mode==='buff'){const kk=(f%4)/4;B.ring(8+kk*14,c,(1-kk)*.7);}if(mode==='skill'&&f===2)B.spark(add3(head,[0,5,-1]),8,c,.8);if(mode==='attack'&&f===1)B.arc([[-4,L*.5+lunge+1,h+5],[0,L*.5+lunge+6,h],[4,L*.5+lunge+1,h-4]],c,1.4);};
// ---------- 두 발 새(코카트리스) ----------
PLANS.bird=function(B){const s=B.s,{mode,f,t}=B,run=mode==='run',walk=mode==='walk'||run,sk=s.skin||'#c09040';const ph=f*Math.PI/2+(run?Math.PI/4:0),sw=walk?Math.cos(ph):0,cw=walk?Math.sin(ph):0;
  let peck=0,wing=Math.sin(t/300+f)*2,up=0;if(mode==='attack'){peck=[-.3,1,.4][f];}if(mode==='buff'){wing=8+f*2;up=1;}if(mode==='skill'){peck=[0,.5,1,.3][f];wing=[2,8,4,2][f];}if(run)wing+=5;
  const h=s.h||12;B.st.lz=999;B.st.bz=h-4;B.st.bob=walk?Math.abs(cw)*1.2:0;if(s.fly){B.st.bz=-999;B.st.bob=s.fly+Math.sin(t/300+f)*1.5;wing+=6+Math.sin(t/120+f*1.6)*6;}
  for(const[g,ph2]of[[-1,1],[1,-1]]){const sw2=sw*ph2,top=[g*2.5,0,h],ft=[g*3,sw2*5,Math.max(0,cw*ph2)*3];B.cap(top,[g*3,sw2*2.5+1.5,h*.5],2.2,s.legC||'#d0a040',{w1:1.4});B.cap([g*3,sw2*2.5+1.5,h*.5],ft,1.4,s.legC||'#d0a040');for(let i=-1;i<=1;i++)B.cap(ft,add3(ft,[i*1.4,2.2,0]),.7,s.legC||'#d0a040');}
  B.ball([0,0,h+5],7,sk,{sx:1,sy:.85,d:.1});
  for(const g of[-1,1])B.poly([[g*5,2,h+8],[g*(12+wing*.4),-2,h+12+wing],[g*(14+wing*.4),-8,h+6+wing*.6],[g*6,-6,h+4]],s.wings||tone(sk,-.15),{grad:1,d:.3});
  let a=[0,-5,h+4];for(let i=1;i<=4;i++){const b=[Math.sin(t/300+i)*1.2,-5-i*3.5,h+4-i*1.5+i*i*.25];B.cap(a,b,2.6-i*.4,s.tailc||'#5a8a3a',{w1:2.2-i*.4});a=b;}
  const neck=[0,4+peck*2,h+9-peck*2+up*2],hd=[0,7+peck*5,h+14-peck*5+up*3];B.cap([0,3,h+7],neck,3.2,sk);B.cap(neck,hd,2.8,sk);B.ball(hd,3.4,sk);
  B.cap(add3(hd,[0,2.4,-.2]),add3(hd,[0,5.4,-1-peck]),1.6,'#e0b040',{w1:.3});B.poly([add3(hd,[0,0,2.8]),add3(hd,[0,-2.5,4.8]),add3(hd,[0,-3.5,1.2]),add3(hd,[0,1.8,2])],s.comb||'#d02020',{grad:1});
  B.cap(add3(hd,[0,2.2,-2]),add3(hd,[0,2.6,-4]),1.4,s.comb||'#d02020',{w1:.6});for(const g of[-1,1])B.ball(add3(hd,[g*1.9,1.4,.8]),.65,s.eye||'#ffdd30',{flat:1,glow:s.eyeGlow,d:-.05});
  const c=s.fx||'200,255,120';if(mode==='buff'){const kk=(f%4)/4;B.ring(8+kk*14,c,(1-kk)*.7);}if(mode==='skill'&&f>=2)for(let i=1;i<5;i++)B.glow(add3(hd,[0,4+i*3.5,-1-i*.6]),1.6+i*.6,c,.8-i*.1);if(mode==='attack'&&f===1)B.spark(add3(hd,[0,6,-2]),4,c,.7);};

// ---------- 몬스터 정의 ----------
const O={plan:'biped',head:'orc',skin:'#6f8a45',ear:1,belt:'#3a2a1a',eye:'#ffd040',fx:'255,200,120'};
const SPEC={
 '오크':{...O,cloth:'#6a4a2a',armor:'#5a4a3a',pants:'#4a3a2a',weapon:'axe',wcol:'#9aa0a8'},
 '오크 궁수':{...O,skin:'#7a8a4a',cloth:'#5a6a3a',armor:'#4a5a30',pants:'#3a3020',weapon:'bow',hood:'#4a5a30',fx:'255,230,160'},
 '오크 전사':{...O,skin:'#5f7a3a',armor:'#6a6e78',pants:'#3a3228',pads:'#7a7e88',weapon:'sword',shield:'#6a4a2a',helm:'#6a6e78',bulk:1.08},
 '오크 스카우트':{...O,skin:'#7a8f50',armor:'#5a4a30',pants:'#4a3a24',weapon:'bow',cape:'#4a5a2a',fx:'255,230,160'},
 '오크 마법사':{...O,skin:'#6a8a50',cloth:'#4a3a6a',robe:1,weapon:'staff',ocol:'#d070ff',fx:'210,120,255',caster:1,trim:'#c09040',hair:'#2a2018'},
 '아투바 오크':{...O,skin:'#7a7a3a',armor:'#7a3a2a',pants:'#3a2a20',weapon:'axe',pads:'#8a4a30',bulk:1.1,fx:'255,140,80'},
 '네루가 오크':{...O,skin:'#4a6a3a',armor:'#3a4a5a',pants:'#2a2a30',weapon:'spear',helm:'#4a5a6a',bulk:1.1,fx:'160,200,255'},
 '두다-마라 오크':{...O,skin:'#8a7a40',armor:'#8a6a2a',pants:'#4a3a20',weapon:'spear',pads:'#a08030',bulk:1.12,fx:'255,220,120'},
 '간디 오크':{...O,skin:'#6a7a3a',armor:'#5a2a3a',pants:'#2a2028',weapon:'club',bulk:1.15,fx:'255,140,160'},
 '로바 오크':{...O,skin:'#5a7a5a',armor:'#2a4a3a',pants:'#20302a',weapon:'sword',shield:'#2a4a3a',bulk:1.1,fx:'140,255,200'},
 '난쟁이':{plan:'biped',head:'plain',k:.78,skin:'#d8a07a',armor:'#7a6a5a',pants:'#5a4030',belt:'#3a2410',beard:'#a8743a',helm:'#9aa0a8',weapon:'axe',bulk:1.25,hip:18,torso:13,fx:'255,210,140'},
 '고블린':{plan:'biped',head:'goblin',k:.72,skin:'#8a9a3a',cloth:'#6a4a2a',pants:'#4a3a24',weapon:'dagger',hunch:4,fx:'220,255,140'},
 '코볼트':{plan:'biped',head:'kobold',k:.75,skin:'#a0603a',cloth:'#5a4a3a',pants:'#3a2a20',weapon:'spear',hunch:3,tail:1,fx:'255,200,140'},
 '돌 골렘':{plan:'biped',head:'golem',k:1.25,skin:'#8a8478',armor:'#8a8478',pants:'#7a7468',pads:'#9a9488',bulk:1.45,hip:21,torso:18,armW:7,legW:7.5,handR:4,neck:1,headR:5.5,headF:2,hunch:3,weapon:'none',fx:'255,180,80',eyeGlow:'255,170,60'},
 '장로':{plan:'biped',head:'hood',hood:'#4a5a8a',cloth:'#4a5a8a',robe:1,weapon:'staff',ocol:'#a8f',beard:'#e8e8e8',caster:1,trim:'#d8c060',fx:'180,140,255',eye:'#ffffff',eyeGlow:'200,200,255'},
 '흑장로':{plan:'biped',head:'hood',k:1.15,hood:'#1a1a24',cloth:'#1e1a26',robe:1,weapon:'staff',ocol:'#ff4060',beard:'#9a9aa0',caster:1,trim:'#8a2030',fx:'255,60,90',eye:'#ff3040',eyeGlow:'255,40,70',aura:'255,60,90'},
 '발터자르':{plan:'biped',head:'hood',k:1.1,hood:'#3a1a1a',cloth:'#4a1a1a',robe:1,weapon:'staff',ocol:'#ff7030',caster:1,trim:'#d0a040',fx:'255,120,50',eye:'#ffaa30',eyeGlow:'255,140,40',crown:'#d0a040'},
 '카스파':{plan:'biped',head:'hood',k:1.1,hood:'#1a2a4a',cloth:'#1a2a4a',robe:1,weapon:'staff',ocol:'#40a0ff',caster:1,trim:'#c0c8d0',fx:'80,160,255',eye:'#80d0ff',eyeGlow:'80,180,255'},
 '메르키오르':{plan:'biped',head:'hood',k:1.1,hood:'#1a3a2a',cloth:'#1a3a2a',robe:1,weapon:'staff',ocol:'#60ff90',caster:1,trim:'#d0c060',fx:'90,255,140',eye:'#a0ffa0',eyeGlow:'90,255,140'},
 '세마':{plan:'biped',head:'hood',k:1.1,hood:'#3a2a4a',cloth:'#3a2a4a',robe:1,weapon:'staff',ocol:'#ffe060',caster:1,trim:'#e0d0a0',fx:'255,230,100',eye:'#ffe080',eyeGlow:'255,220,90'},
 '늑대인간':{plan:'biped',head:'wolf',k:1.05,skin:'#6a5a4a',pants:'#3a3028',cloth:'#6a5a4a',fur:'#7a6a58',weapon:'claws',claws:1,hunch:5,tail:1,fx:'255,220,160',eye:'#ffe040'},
 '라이칸스로프':{plan:'biped',head:'wolf',k:1.15,skin:'#3a3a40',pants:'#2a2a2e',cloth:'#3a3a40',fur:'#4a4a52',weapon:'claws',claws:1,hunch:6,tail:1,bulk:1.15,fx:'255,90,90',eye:'#ff4030',eyeGlow:'255,60,40'},
 '흑기사':{plan:'biped',head:'helm',helm:'#2a2a30',armor:'#2a2a32',pants:'#1e1e24',pads:'#3a3a44',cape:'#5a1010',weapon:'sword',shield:'#2a2a32',trim:'#9a2020',plume:'#8a1010',fx:'255,80,80'},
 '스파토이':{plan:'biped',head:'skull',bone:1,crest:'#a02020',helm:'#8a7040',armor:'#e6dfcc',weapon:'spear',shield:'#8a7040',trim:'#c0a050',fx:'255,180,120',eyeGlow:'255,120,60'},
 '해골':{plan:'biped',head:'skull',bone:1,armor:'#e6dfcc',weapon:'sword',fx:'200,220,255',eyeGlow:'120,180,255'},
 '해골궁수':{plan:'biped',head:'skull',bone:1,armor:'#e6dfcc',weapon:'bow',fx:'200,220,255',eyeGlow:'120,180,255'},
 '해골도끼병':{plan:'biped',head:'skull',bone:1,armor:'#e6dfcc',weapon:'axe',helm:'#7a7068',fx:'200,220,255',eyeGlow:'120,180,255'},
 '해골창병':{plan:'biped',head:'skull',bone:1,armor:'#e6dfcc',weapon:'spear',shield:'#5a4a3a',fx:'200,220,255',eyeGlow:'120,180,255'},
 '좀비':{plan:'biped',head:'zombie',skin:'#7a8a6a',cloth:'#5a4a3a',pants:'#3a3a3a',weapon:'none',hunch:6,fx:'160,220,120',eye:'#e0e080'},
 '구울':{plan:'biped',head:'zombie',skin:'#9aa0a8',cloth:'#3a3a40',pants:'#2a2a30',weapon:'claws',claws:1,hunch:7,fx:'180,200,255',eye:'#ff5050',eyeGlow:'255,60,60'},
 '가스트':{plan:'biped',head:'skull',float:1,cloth:'#4a5a6a',armor:'#4a5a6a',weapon:'claws',claws:1,fx:'150,220,255',eyeGlow:'150,220,255',aura:'150,220,255',hand:'#c8d0d8',skin:'#c8d0d8'},
 '가스트 로드':{plan:'biped',head:'skull',float:1,k:1.2,cloth:'#2a2a4a',armor:'#2a2a4a',weapon:'scythe',crest:'#6a50c0',fx:'170,140,255',eyeGlow:'170,140,255',aura:'170,140,255',hand:'#c8d0d8',skin:'#c8d0d8'},
 '버그베어':{plan:'biped',head:'brute',k:1.15,skin:'#8a6a40',cloth:'#5a3a20',pants:'#4a3020',fur:'#9a7a4a',weapon:'club',bulk:1.25,ear:1,fx:'255,200,140'},
 '킹 버그베어':{plan:'biped',head:'brute',k:1.3,skin:'#7a5a34',cloth:'#6a2a2a',pants:'#3a2418',fur:'#a08050',weapon:'club',bulk:1.35,cape:'#7a1a1a',crown:'#e0b040',horns:null,helm:'#c0902a',fx:'255,170,90'},
 '오우거':{plan:'biped',head:'brute',k:1.4,skin:'#a07a5a',cloth:'#5a4a30',pants:'#4a3a28',weapon:'club',bulk:1.5,belly:1,armW:6.5,legW:7,headR:6,fx:'255,190,130'},
 '트롤':{plan:'biped',head:'brute',k:1.45,skin:'#5a7a6a',cloth:'#3a4a3a',pants:'#3a3a30',weapon:'club',bulk:1.4,hunch:6,armW:6,legW:6.5,hair:'#2a3a2a',fx:'140,255,170'},
 '바포메트':{plan:'biped',head:'goat',k:1.6,skin:'#5a4a52',armor:'#3a2a30',pants:'#2a1e24',fur:'#4a3a40',horns:'#d8c8a8',weapon:'scythe',wcol:'#c8c8d0',wings:'#3a2a34',tail:1,bulk:1.3,eye:'#ff3020',eyeGlow:'255,60,40',fx:'255,80,60',aura:'255,80,60'},
 '베레스':{plan:'biped',head:'demon',k:1.6,skin:'#7a2a2a',armor:'#3a1a1a',pants:'#2a1010',horns:'#2a2020',crown:'#e0b040',weapon:'sword',wcol:'#ff6a3a',wings:'#4a1a1a',tail:1,bulk:1.3,cape:'#2a0a0a',eye:'#ffcc30',eyeGlow:'255,200,60',fx:'255,120,50',aura:'255,120,50'},
 '하피':{plan:'biped',head:'harpy',skin:'#d8b0a0',cloth:'#7a4a6a',pants:'#5a3a50',hair:'#6a3a5a',wings:'#8a5a7a',weapon:'claws',claws:1,legW:3.5,fx:'255,160,220'},
 '무리안':{plan:'biped',head:'fish',skin:'#4a8aa0',cloth:'#2a5a6a',pants:'#2a4a5a',fin:'#2a7a90',weapon:'spear',wcol:'#d0e8f0',tail:1,tailc:'#3a7a90',fx:'120,220,255',eye:'#f0f080'},
 '늑대':{plan:'quad',skin:'#7a7a80',chest:'#9a9aa0',ears:1,tail:1,tailN:3,tailDrop:.15,eye:'#ffd040',fx:'255,230,160'},
 '도베르만':{plan:'quad',skin:'#2e2622',chest:'#8a5a30',snoutC:'#8a5a30',ears:1,tail:1,tailN:1,legW:3,bodyR:5,eye:'#e0b040',fx:'255,220,160'},
 '세퍼드':{plan:'quad',skin:'#8a6a42',chest:'#c09a6a',mane:'#3a2a1a',ears:1,tail:1,tailN:3,tailDrop:.2,eye:'#e0b040',fx:'255,220,160'},
 '켈베로스':{plan:'quad',k:1.4,skin:'#3a2420',chest:'#4a2a24',heads:3,ears:1,tail:1,tailN:4,mane:'#2a1810',eye:'#ff5020',eyeGlow:'255,80,30',breath:1,fx:'255,110,40'},
 '멧돼지':{plan:'quad',skin:'#5a4030',bodyR:6.5,h:10,legW:3.2,snout:.9,tusks:1,ears:'flop',spines:'#3a2a1a',tail:1,tailN:1,tailW:1,eye:'#201010',fx:'255,200,140'},
 '바실리스크':{plan:'quad',k:1.3,skin:'#4a6a3a',chest:'#8a9a5a',h:7,len:18,legs:6,wideLegs:1.4,legW:3,bodyR:5,snout:1.2,spines:'#c0a040',tail:1,tailN:5,tailL:4.5,tailUp:0,eye:'#ffe020',eyeGlow:'255,230,60',breath:1,fx:'200,255,90'},
 '드레이크':{plan:'quad',k:1.6,skin:'#6a2a2a',chest:'#c08a50',h:13,len:14,bodyR:6.5,neckL:5,headZ:4,snout:1.3,horns:'#e0d0b0',wings:'#5a1a1a',spines:'#e0c080',tail:1,tailN:5,tailL:4.5,eye:'#ffd030',eyeGlow:'255,200,40',breath:1,fx:'255,140,40'},
 '거대 개미':{plan:'bug',skin:'#3a2418',segs:[[0,-7,1.5,4.6],[0,-1,1.2,2.6],[0,3.5,1.6,3.2]],mand:'#5a3a24',fx:'255,220,140'},
 '거대 병정 개미':{plan:'bug',k:1.2,skin:'#5a1a10',segs:[[0,-7,1.5,4.6],[0,-1,1.2,2.6],[0,3.8,1.8,3.8]],mand:'#2a1008',bulk:1.1,fx:'255,140,90'},
 '셸로브':{plan:'bug',k:1.2,skin:'#2a2a2a',abd:'#3a3030',legs:8,spread:12,knee:7,segs:[[0,-7,3,6.5],[0,1,2,3.4]],eyeN:4,eye:'#ff2020',eyeGlow:'255,40,40',marks:'#a02020',fx:'200,255,140'},
 '웅골리언트':{plan:'bug',k:1.45,skin:'#1a1418',abd:'#241a24',legs:8,spread:13,knee:8,segs:[[0,-8,3.5,7.5],[0,1,2.2,3.8]],eyeN:6,eye:'#c040ff',eyeGlow:'200,80,255',marks:'#6a2a8a',fx:'200,120,255'},
 '스콜피온':{plan:'bug',k:1.25,skin:'#8a5a2a',legs:8,spread:9,segs:[[0,-5,1.5,4],[0,0,1.5,4.2],[0,4,1.4,3.2]],pincer:1,claw:'#6a3a18',stinger:1,eye:'#201010',fx:'160,255,120'},
 '크로울링 크로':{plan:'bug',k:.8,skin:'#b8a090',legs:2,spread:5,knee:2,segs:[[0,0,1.5,4.5]],fingers:1,eyeN:1,eye:'#ff4040',eyeGlow:'255,60,60',fx:'255,100,100'},
 '펑거스':{plan:'blob',kind:'mush',k:.8,skin:'#a03a2a',stem:'#e8dcc0',spots:'#f4ead8',r:7,fx:'200,255,150'},
 '브롭':{plan:'blob',k:.85,skin:'#5aa040',r:9,core:'#c0ff80',fx:'170,255,120'},
 '괴물 눈':{plan:'blob',kind:'eye',float:1,skin:'#8a5a6a',iris:'#c02030',r:7,fx:'255,80,90'},
 '코카트리스':{plan:'bird',k:1.2,skin:'#c8a050',wings:'#8a6a30',tailc:'#4a7a3a',comb:'#d02020',eye:'#ffe030',eyeGlow:'255,230,60',fx:'200,255,100'},
 '서큐버스':{plan:'biped',head:'elf',skin:'#c87a8a',hair:'#2a1020',cloth:'#4a1a3a',armor:'#3a1030',pants:'#2a0a20',horns:'#2a1a1a',wings:'#5a1a3a',tail:1,tailc:'#7a2a4a',weapon:'claws',claws:1,legW:4.5,armW:4,trim:'#c0a050',eye:'#ff70c0',eyeGlow:'255,90,200',fx:'255,100,200'},
 '서큐버스 퀸':{plan:'biped',head:'elf',k:1.2,skin:'#b86a7a',hair:'#1a0810',cloth:'#2a0a24',armor:'#2a0820',pants:'#1a0614',horns:'#e0c060',wings:'#3a0a2a',tail:1,tailc:'#5a1a3a',weapon:'staff',ocol:'#ff60c0',caster:1,cape:'#4a0a30',legW:4.5,armW:4,trim:'#e0c060',eye:'#ff70c0',eyeGlow:'255,90,200',fx:'255,100,200',aura:'255,100,200'},
 '비홀더':{plan:'blob',kind:'beholder',float:1,k:1.1,skin:'#7a5a8a',iris:'#40c060',r:9,fx:'120,255,140'},
 '에틴':{plan:'biped',head:'brute',heads:2,k:1.55,skin:'#a08a6a',cloth:'#5a4a30',pants:'#4a3a28',fur:'#7a6a4a',weapon:'club',bulk:1.5,belly:1,armW:6.5,legW:7,headR:5.5,fx:'255,200,130'},
 '해골저격병':{plan:'biped',head:'skull',bone:1,armor:'#e6dfcc',weapon:'bow',helm:'#5a5a60',cape:'#3a3a40',fx:'200,220,255',eyeGlow:'120,180,255'},
 '해골돌격병':{plan:'biped',head:'skull',bone:1,armor:'#e6dfcc',weapon:'axe',pads:'#6a6a70',helm:'#6a6a70',fx:'255,200,160',eyeGlow:'255,140,80'},
 '해골근위병':{plan:'biped',head:'skull',bone:1,armor:'#e6dfcc',weapon:'sword',shield:'#8a7040',helm:'#a08840',crest:'#2a4a8a',pads:'#a08840',trim:'#d0b050',fx:'200,220,255',eyeGlow:'120,180,255'},
 '아이들론':{plan:'biped',head:'golem',k:.8,skin:'#9a8a6a',armor:'#9a8a6a',pants:'#8a7a5a',bulk:1.3,neck:0,headR:5.5,float:1,cloth:'#9a8a6a',weapon:'none',eye:'#80e0ff',eyeGlow:'90,220,255',fx:'120,220,255'},
 '그렘린':{plan:'biped',head:'goblin',k:.6,skin:'#6a8a6a',cloth:'#4a3a5a',pants:'#3a2a3a',weapon:'claws',claws:1,hunch:5,eye:'#ffe060',eyeGlow:'255,220,80',fx:'200,255,140'},
 '임프':{plan:'biped',head:'demon',k:.6,skin:'#a03a2a',cloth:'#6a1a1a',pants:'#4a1010',horns:'#2a1a1a',wings:'#6a2020',tail:1,weapon:'claws',claws:1,hunch:3,eye:'#ffd030',eyeGlow:'255,200,40',fx:'255,120,60'},
 '임프 장로':{plan:'biped',head:'demon',k:.75,skin:'#8a2a3a',cloth:'#3a0a2a',robe:1,horns:'#d0c0a0',wings:'#4a1a2a',tail:1,weapon:'staff',ocol:'#ff5030',caster:1,beard:'#d8d0c0',eye:'#ffd030',eyeGlow:'255,200,40',fx:'255,100,60'},
 '다크 엘프':{plan:'biped',head:'elf',skin:'#5a5a7a',hair:'#e8e8f0',cloth:'#2a2a3a',armor:'#2a2a3a',pants:'#1a1a24',cape:'#1a1a2a',weapon:'dagger',wcol:'#a0b0ff',legW:4.8,armW:4.2,eye:'#c0a0ff',eyeGlow:'170,130,255',fx:'170,130,255'},
 '아울베어':{plan:'biped',head:'owl',k:1.35,skin:'#7a5a3a',face:'#c0a070',cloth:'#7a5a3a',pants:'#6a4a2a',fur:'#8a6a44',weapon:'claws',claws:1,bulk:1.4,belly:1,headR:6.5,eyeGlow:'255,230,120',fx:'255,220,150'},
 '오크 좀비':{plan:'biped',head:'orc',skin:'#7a8a6a',cloth:'#4a3a2a',pants:'#3a3028',weapon:'axe',wcol:'#7a7068',hunch:6,eye:'#e0e080',fx:'170,220,120'},
 '홉고블린':{plan:'biped',head:'goblin',k:.95,skin:'#a0703a',armor:'#6a5a4a',pants:'#4a3a2a',helm:'#7a7068',weapon:'sword',shield:'#6a4a2a',fx:'255,200,140'},
 '난쟁이족 전사':{plan:'biped',head:'plain',k:.82,skin:'#d8a07a',armor:'#8a8a92',pants:'#5a4030',belt:'#3a2410',beard:'#c0503a',helm:'#a0a8b0',pads:'#9aa0a8',weapon:'axe',shield:'#7a5a3a',bulk:1.3,hip:18,torso:13,fx:'255,210,140'},
 '사이클롭스':{plan:'biped',head:'cyclops',k:1.6,skin:'#a08a70',cloth:'#6a4a30',pants:'#5a3a24',weapon:'club',bulk:1.45,armW:6.5,legW:7,headR:6.5,eye:'#c02020',fx:'255,180,120'},
 '안타라스':{plan:'quad',k:2.3,skin:'#6a5a3a',chest:'#a08a5a',h:13,len:16,bodyR:7,neckL:6,headZ:5,snout:1.3,horns:'#e8dcc0',wings:'#4a3a24',spines:'#d0b070',tail:1,tailN:6,tailL:4.5,eye:'#ffd030',eyeGlow:'255,200,40',breath:1,fx:'220,180,90'},
 '리자드맨':{plan:'biped',head:'lizard',skin:'#4a7a4a',cloth:'#5a4a2a',pants:'#3a5a3a',crest:'#c0a040',tail:1,tailc:'#4a7a4a',weapon:'spear',shield:'#6a4a2a',hunch:3,eye:'#ffe030',fx:'200,255,120'},
 '데몬':{plan:'biped',head:'demon',k:1.7,skin:'#5a1a1a',armor:'#2a0a0a',pants:'#1a0606',horns:'#1a1010',wings:'#3a0a0a',tail:1,weapon:'sword',wcol:'#ff5a2a',bulk:1.35,cape:'#1a0404',eye:'#ffcc30',eyeGlow:'255,200,60',fx:'255,90,40',aura:'255,90,40'},
 '그리폰':{plan:'quad',k:1.5,skin:'#b08a50',chest:'#e8e0d0',mane:'#f0ece0',beak:'#e0b040',snout:.9,wings:'#8a6a3a',tail:1,tailN:3,ears:1,earC:'#f0ece0',eye:'#ffd030',fx:'255,230,150'},
 '거대 여왕 개미':{plan:'bug',k:1.6,skin:'#4a2a14',segs:[[0,-9,2,6.5],[0,-1,1.6,3],[0,4,2,3.8]],mand:'#2a1408',bwings:1,wingL:14,wingC:'#e8d8c0',bulk:1.15,eye:'#ffcc40',eyeGlow:'255,200,60',fx:'255,200,120'},
 '놀':{plan:'biped',head:'hyena',skin:'#a08a5a',spots:'#4a3a2a',cloth:'#5a4030',pants:'#4a3424',fur:'#6a5030',weapon:'axe',hunch:4,tail:1,eye:'#ffd040',fx:'255,210,140'},
 '미믹':{plan:'blob',kind:'chest',k:1,r:8,wood:'#9a6030',band:'#c0a050',eye:'#ffd030',fx:'255,200,90'},
 '아이스 골렘':{plan:'biped',head:'golem',k:1.3,skin:'#a8d0e8',armor:'#a8d0e8',pants:'#90c0e0',pads:'#c8e4f4',bulk:1.45,hip:21,torso:18,armW:7,legW:7.5,handR:4,neck:1,headR:5.5,headF:2,hunch:3,weapon:'none',eye:'#e0ffff',eyeGlow:'150,230,255',fx:'160,230,255'},
 '페이퍼 맨':{plan:'biped',head:'plain',skin:'#f0ece0',cloth:'#e8e2d0',pants:'#ded6c0',bulk:.75,armW:3.5,legW:4,weapon:'claws',eye:'#202020',fx:'240,240,220'},
 '실루엣':{plan:'biped',head:'plain',skin:'#141418',cloth:'#141418',pants:'#101014',hair:'#0a0a0e',weapon:'dagger',wcol:'#303040',eye:'#ffffff',eyeGlow:'220,220,255',fx:'150,150,200',aura:'120,120,160'},
 '크로코다일':{plan:'quad',k:1.5,skin:'#4a5a2a',chest:'#a0a060',h:6,len:18,wideLegs:1.5,legW:3.2,bodyR:5.2,snout:2.2,spines:'#3a4a1a',tail:1,tailN:5,tailL:4.5,tailUp:0,tailW:3.4,eye:'#ffe060',fx:'200,255,120'},
 '악어':{plan:'quad',k:1.25,skin:'#5a6a3a',chest:'#b0b070',h:6,len:16,wideLegs:1.5,legW:3,bodyR:4.8,snout:2,spines:'#4a5a2a',tail:1,tailN:5,tailL:4,tailUp:0,tailW:3,eye:'#ffe060',fx:'200,255,120'},
 '리빙아머':{plan:'biped',head:'helm',helm:'#7a808c',armor:'#7a808c',pants:'#5a606a',pads:'#8a909c',weapon:'sword',shield:'#5a606a',trim:'#c0a050',eye:'#80c0ff',eyeGlow:'120,180,255',fx:'150,200,255',aura:'120,180,255'},
 '파푸리온':{plan:'quad',k:2.3,skin:'#2a5a7a',chest:'#7ab0c0',h:13,len:16,bodyR:7,neckL:6,headZ:5,snout:1.4,horns:'#c0e0f0',wings:'#1a3a5a',spines:'#80c0e0',tail:1,tailN:6,tailL:4.5,eye:'#a0f0ff',eyeGlow:'120,230,255',breath:1,fx:'100,200,255'},
 '바쿡':{plan:'biped',head:'brute',k:1.45,skin:'#6a5a6a',cloth:'#3a2a3a',pants:'#2a2030',fur:'#5a4a5a',horns:'#d8c8b0',weapon:'club',wcol:'#4a3a2a',bulk:1.45,hunch:5,eye:'#ff8030',eyeGlow:'255,130,40',fx:'255,140,80'},
 '시댄서':{plan:'blob',kind:'jelly',float:1,k:1,skin:'#a080e0',core:'#ffe0ff',r:7,fx:'220,150,255'},
 '크랩맨':{plan:'bug',k:1.1,skin:'#c04a2a',legs:6,spread:10,segs:[[0,-1,2,6],[0,3,2.5,2.5]],pincer:1,claw:'#d05a3a',eyeN:2,eye:'#101010',bulk:1.1,fx:'255,160,120'},
 '랫맨':{plan:'biped',head:'rat',skin:'#8a7a70',cloth:'#5a4a3a',pants:'#4a3a30',earC:'#d8a0a0',tail:1,tailc:'#d8a0a0',weapon:'dagger',hunch:5,eye:'#ff3030',eyeGlow:'255,60,60',fx:'255,200,160'},
 '혈거인간':{plan:'biped',head:'brute',k:1.1,skin:'#b08a6a',cloth:'#6a4a2a',pants:'#5a3a20',fur:'#7a5a3a',hair:'#3a2a1a',weapon:'club',bulk:1.2,hunch:5,fx:'255,200,140'},
 '일렉카둠':{plan:'blob',kind:'orb',float:1,k:1,skin:'#80c0ff',core:'#e8f8ff',r:6,fx:'150,210,255'},
 '머맨':{plan:'biped',head:'fish',skin:'#3a7a6a',cloth:'#2a5a5a',pants:'#2a4a4a',fin:'#2a8a7a',tail:1,tailc:'#3a7a6a',weapon:'spear',wcol:'#e0f0f0',fx:'120,230,220',eye:'#f0f080'},
 '크러스트시안':{plan:'bug',k:1.2,skin:'#8a3a3a',legs:8,spread:9,segs:[[0,-6,1.5,3.6],[0,-1,1.6,4],[0,4,1.6,3.4]],pincer:1,claw:'#a04a3a',eyeN:2,eye:'#101010',stinger:0,fx:'255,140,120'},
 '곰':{plan:'quad',k:1.5,skin:'#5a3a24',chest:'#6a4a30',bodyR:7,h:12,legW:4.4,snout:.9,ears:'round',earC:'#4a2a18',tail:1,tailN:1,tailW:1.5,eye:'#201010',fx:'255,210,150'},
 '상어':{plan:'fish',k:1.2,skin:'#5a6a7a',belly:'#e8eae4',fx:'120,200,255'},
 '아스테':{plan:'biped',head:'elf',float:1,skin:'#d0e8f0',hair:'#a0e0ff',cloth:'#80c0e0',armor:'#80c0e0',weapon:'staff',ocol:'#c0f0ff',caster:1,eye:'#ffffff',eyeGlow:'180,240,255',fx:'160,230,255',aura:'160,230,255',alpha:.85},
 '터틀 드래곤':{plan:'quad',k:1.6,skin:'#5a7a4a',chest:'#c0b070',h:8,len:12,bodyR:6.5,wideLegs:1.3,legW:4.2,snout:1.1,horns:'#e0d8b0',shell:'#6a5a3a',tail:1,tailN:3,tailUp:0,eye:'#ffd030',breath:1,fx:'200,255,140'},
 '사라만다':{plan:'quad',k:1.1,skin:'#c04020',chest:'#f0a040',h:6,len:14,wideLegs:1.4,legW:2.8,bodyR:4.5,snout:1.3,spines:'#ffb040',tail:1,tailN:5,tailL:4,tailUp:.3,eye:'#ffe040',eyeGlow:'255,200,60',breath:1,fx:'255,130,40'},
 '라미아':{plan:'biped',head:'elf',serpent:1,skin:'#c8a080',hair:'#3a6a3a',cloth:'#3a6a4a',armor:'#3a6a4a',tailc:'#4a8a4a',weapon:'spear',wcol:'#e0d080',trim:'#d0b050',eye:'#ffe040',eyeGlow:'255,230,60',fx:'200,255,120'},
 '데스':{plan:'biped',head:'skull',float:1,k:1.3,cloth:'#101014',armor:'#101014',hood:'#101014',weapon:'scythe',wcol:'#d8dce0',crest:null,fx:'160,255,200',eyeGlow:'120,255,180',aura:'120,255,180',hand:'#e6dfcc',skin:'#e6dfcc'},
 '유령':{plan:'biped',head:'skull',float:1,cloth:'#d8e0e8',armor:'#d8e0e8',weapon:'claws',claws:1,fx:'200,230,255',eyeGlow:'150,200,255',aura:'200,230,255',hand:'#e0e8f0',skin:'#e0e8f0'},
 '라바 골렘':{plan:'biped',head:'golem',k:1.3,skin:'#4a2a1a',armor:'#4a2a1a',pants:'#3a2014',pads:'#5a3020',bulk:1.45,hip:21,torso:18,armW:7,legW:7.5,handR:4,neck:1,headR:5.5,headF:2,hunch:3,weapon:'none',eye:'#ffa020',eyeGlow:'255,140,30',fx:'255,120,30',aura:'255,120,30'},
 '불타는 전사':{plan:'biped',head:'skull',bone:1,armor:'#e6dfcc',helm:'#3a1a10',weapon:'sword',wcol:'#ff8030',shield:'#4a2010',trim:'#ff8030',fx:'255,120,30',eyeGlow:'255,120,30',aura:'255,120,30'},
 '이프리트':{plan:'biped',head:'demon',float:1,k:1.6,skin:'#d04a1a',cloth:'#ff7020',armor:'#c03010',horns:'#3a1a10',weapon:'claws',claws:1,bulk:1.3,eye:'#fff0a0',eyeGlow:'255,230,120',fx:'255,140,40',aura:'255,140,40'},
 '혼 켈베로스':{plan:'quad',k:1.5,skin:'#2a1410',chest:'#3a1a14',heads:3,ears:1,horns:'#e0c080',tail:1,tailN:4,mane:'#ff6020',eye:'#ffd020',eyeGlow:'255,180,30',breath:1,fx:'255,110,30'},
 '피닉스':{plan:'bird',k:1.6,fly:8,skin:'#ff7a20',wings:'#ff4a10',tailc:'#ffd040',comb:'#ffe060',eye:'#ffffff',eyeGlow:'255,240,160',fx:'255,150,40'},
 '파이어 에그':{plan:'blob',kind:'egg',k:.8,skin:'#8a3a1a',r:6,fx:'255,140,40'},
 '폭탄 꽃':{plan:'blob',kind:'flower',k:.8,skin:'#3a3a3a',petal:'#e05a8a',r:5,fx:'255,150,60'},
 '불타는 궁수':{plan:'biped',head:'skull',bone:1,armor:'#e6dfcc',helm:'#3a1a10',weapon:'bow',cape:'#5a1a08',fx:'255,120,30',eyeGlow:'255,120,30',aura:'255,120,30'},
 '드래곤 플라이':{plan:'bug',k:1,fly:7,skin:'#3a7a8a',legs:6,spread:5,knee:1,segs:[[0,-11,0,1.6],[0,-7,0,1.7],[0,-3,0,1.9],[0,1,.5,2.6],[0,4.5,.6,2.4]],bwings:1,wingL:13,wingC:'#c0f0ff',eye:'#40ff80',eyeN:2,fx:'160,255,220'},
 '아시타지오':{plan:'biped',head:'demon',k:1.5,skin:'#3a2a4a',armor:'#2a1a3a',pants:'#1a1028',horns:'#d0c0a0',crown:'#c0a040',wings:'#2a1a3a',weapon:'staff',ocol:'#b060ff',caster:1,cape:'#1a0a2a',bulk:1.2,eye:'#c080ff',eyeGlow:'190,120,255',fx:'190,120,255',aura:'190,120,255'},
 '발라카스':{plan:'quad',k:2.3,skin:'#7a1a10',chest:'#e08a30',h:13,len:16,bodyR:7,neckL:6,headZ:5,snout:1.3,horns:'#2a1a10',wings:'#5a0a08',spines:'#ffb040',tail:1,tailN:6,tailL:4.5,eye:'#ffe040',eyeGlow:'255,210,60',breath:1,fx:'255,110,30'},
 '눈사람':{plan:'blob',kind:'snowman',k:.9,skin:'#f4f8ff',hat:'#c03030',r:6,fx:'200,230,255'},
 '샤벨 타이거':{plan:'quad',k:1.4,skin:'#d09040',chest:'#f0e0c0',bodyR:6,snout:.9,ears:1,sabers:1,tail:1,tailN:4,tailDrop:.1,stripes:1,eye:'#a0e060',fx:'255,220,150'},
 '좀비 엘모어 마법사':{plan:'biped',head:'zombie',skin:'#8a9a7a',cloth:'#3a3a5a',robe:1,hood:'#3a3a5a',weapon:'staff',ocol:'#80ff80',caster:1,trim:'#8a8a40',hunch:4,eye:'#80ff80',eyeGlow:'120,255,120',fx:'120,255,120'},
 '에티':{plan:'biped',head:'brute',k:1.5,skin:'#d8e0e8',cloth:'#e8eef4',pants:'#d0d8e0',fur:'#f0f4f8',weapon:'claws',claws:1,bulk:1.45,belly:1,armW:6.5,legW:7,eye:'#3060c0',fx:'200,230,255'},
 '좀비 엘모어 장군':{plan:'biped',head:'zombie',k:1.2,skin:'#7a8a6a',armor:'#5a5040',pants:'#3a3428',helm:'#6a6050',pads:'#7a7058',cape:'#4a2a2a',weapon:'sword',shield:'#5a5040',trim:'#a08a40',hunch:2,eye:'#c0ff60',eyeGlow:'170,255,90',fx:'170,255,90'},
 '아이언 골렘':{plan:'biped',head:'golem',k:1.35,skin:'#5a5e66',armor:'#5a5e66',pants:'#4a4e56',pads:'#6a6e78',bulk:1.45,hip:21,torso:18,armW:7,legW:7.5,handR:4,neck:1,headR:5.5,headF:2,hunch:2,weapon:'none',eye:'#ff6030',eyeGlow:'255,100,40',fx:'255,150,80'},
 '좀비 엘모어 병사':{plan:'biped',head:'zombie',skin:'#7a8a6a',armor:'#4a4a3a',pants:'#3a3a2e',helm:'#5a5a4a',weapon:'spear',shield:'#4a4030',hunch:4,eye:'#c0ff60',fx:'170,255,90'},
 '아이스 맨':{plan:'biped',head:'plain',skin:'#b8dcf0',cloth:'#a0d0ec',pants:'#90c0e0',hair:'#e0f4ff',weapon:'claws',claws:1,bulk:1.1,eye:'#ffffff',eyeGlow:'180,230,255',fx:'170,230,255',aura:'170,230,255'},
 '얼음 여왕':{plan:'biped',head:'elf',k:1.2,skin:'#d8ecf8',hair:'#f0faff',cloth:'#a0d0f0',robe:1,weapon:'staff',ocol:'#c0f4ff',caster:1,cape:'#80b0e0',trim:'#e0f8ff',crown:'#e0f8ff',helm:null,eye:'#80e0ff',eyeGlow:'140,230,255',fx:'150,230,255',aura:'150,230,255'},
 '흑기사 수색대':{plan:'biped',head:'helm',helm:'#2a2a30',armor:'#2a2a32',pants:'#1e1e24',cape:'#3a2a20',weapon:'bow',trim:'#6a2020',fx:'255,120,100'},
 '도펠갱어':{plan:'biped',head:'plain',skin:'#6a4a8a',cloth:'#4a2a6a',pants:'#3a1a5a',hair:'#2a1a3a',weapon:'claws',claws:1,eye:'#ffffff',eyeGlow:'220,180,255',fx:'200,140,255',aura:'200,140,255'},
 '도펠겡어 보스':{plan:'biped',head:'plain',k:1.4,skin:'#4a2a6a',cloth:'#2a0a4a',pants:'#1a0a3a',hair:'#1a0a2a',cape:'#2a0a3a',weapon:'sword',wcol:'#c080ff',bulk:1.2,eye:'#ffffff',eyeGlow:'220,180,255',fx:'200,120,255',aura:'200,120,255'},
 '미노타우르스':{plan:'biped',head:'bull',k:1.5,skin:'#6a4a30',cloth:'#5a3a24',pants:'#4a2e1c',fur:'#5a3a24',horns:'#e8dcc0',weapon:'axe',wcol:'#a0a4aa',bulk:1.4,armW:6.5,legW:7,headR:6,eye:'#ff4030',eyeGlow:'255,60,40',fx:'255,160,100'},
 '산적':{plan:'biped',head:'plain',skin:'#d0a080',cloth:'#6a5a3a',pants:'#4a3a2a',hair:'#3a2a1a',helm:'#7a2a2a',belt:'#3a2410',weapon:'sword',fx:'255,220,160'},
 '산적 두목':{plan:'biped',head:'plain',k:1.2,skin:'#c89070',armor:'#5a4a3a',pants:'#3a2a1e',hair:'#1a1410',beard:'#2a1a10',cape:'#6a1a1a',belt:'#3a2410',pads:'#6a5a4a',weapon:'axe',bulk:1.2,fx:'255,190,120'},
};
// 크기별 시트 칸
function kOf(n){const s=SPEC[n];return(s.k||1)*(PS[s.plan]||1);}
function cellOf(n){const s=SPEC[n],k=kOf(n),big=s.plan==='quad'||s.plan==='bug'?1.25:1;return Math.round(Math.min(160,Math.max(80,96*k*big))/8)*8;}
function motionFor(speedPx,act){if(act)return{mode:act,...MOTION[act]};if(speedPx>=140)return{mode:'run',...MOTION.run};if(speedPx>1)return{mode:'walk',...MOTION.walk};return{mode:'idle',...MOTION.idle};}
return{render,SPEC,MOTION,SHEET,ROWS,cellOf,kOf,motionFor};
})();
