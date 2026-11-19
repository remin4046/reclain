/* 데스나이트 렌더러 — 캐릭터 렌더러(characters.js)와 같은 방식
   그리기: DKR.render(ctx, 각도, 프레임, 동작, 발x, 발y, 배율, 시간ms)
   동작: 'idle' 대기(1), 'walk' 걷기(0~3), 'run' 달리기(0~3), 'attack' 공격(0~2), 'buff' 버프 스킬(0~3), 'skill' 공격 스킬(0~3)
   각도: 0 북, 90 동, 180 남, 270 서 (45도 단위 8방향). 배율 1 ≈ 64px 높이.
   스프라이트 시트 칸 순서(20열): 대기, 걷기1~4, 달리기1~4, 공격1~3, 버프1~4, 스킬1~4 / 행: 남·남서·서·북서·북·북동·동·남동 */
const DKR=(function(){
const COL={bone:'#d9d1bb',boneLo:'#9a927e',st0:'#80889a',st1:'#3a3f4a',st2:'#15171c',cl0:'#33283f',cl1:'#1a1422',cl2:'#08060b'};
const SOUL='140,250,228';
const MOTION={idle:{frames:1,ms:0},walk:{frames:4,ms:150},run:{frames:4,ms:105},attack:{frames:3,ms:150},buff:{frames:4,ms:190},skill:{frames:4,ms:160}};
const SHEET=['idle',0,'walk',0,'walk',1,'walk',2,'walk',3,'run',0,'run',1,'run',2,'run',3,'attack',0,'attack',1,'attack',2,'buff',0,'buff',1,'buff',2,'buff',3,'skill',0,'skill',1,'skill',2,'skill',3];
const ROWS=[180,225,270,315,0,45,90,135];
const nrm=(x,y,z)=>{const l=Math.hypot(x,y,z)||1;return[x/l,y/l,z/l];};
const lerp=(a,b,t)=>a+(b-a)*t;
// 동작별 자세: 오른손 위치(hR), 검 방향(dS), 왼손(hL), 발(fL,fR), 상체 숙임(lean), 이펙트
function pose(mode,f){const walk=mode==='walk'||mode==='run',run=mode==='run';
  const ph=f*Math.PI/2+(run?Math.PI/4:0),sw=walk?Math.cos(ph):0,cw=walk?Math.sin(ph):0;
  const p={sw,cw,lean:0,bob:0,hR:[11,5,31],dS:nrm(.15,.55,.82),hL:[-11,2,30],fL:[-4.5,1,0],fR:[4.5,-1,0],flare:1.5,fx:null,glow:.35};
  if(walk){const st=run?10:7,lift=run?6:4;p.fL=[-4.5,st*sw,Math.max(0,cw)*lift];p.fR=[4.5,-st*sw,Math.max(0,-cw)*lift];
    p.bob=run?1.4+.8*Math.sin(ph*2):Math.abs(cw)*1.1;p.flare=run?7+2*Math.abs(cw):3+Math.abs(cw)*1.5;
    if(run){p.lean=3.5;p.hR=[11,-3+2*sw,29];p.dS=nrm(.25,-.75,.35);p.hL=[-11,6*sw,31];}
    else{p.hR=[11,4-2*sw,31];p.dS=nrm(.12,.6,.78);p.hL=[-11,-5*sw,30];}}
  else if(mode==='attack'){p.fL=[-5,-3,0];p.fR=[5,4,0];p.flare=3;
    if(f===0){p.hR=[7,-3,55];p.dS=nrm(.1,-.55,.83);p.hL=[-8,7,40];p.lean=-1.5;}
    else if(f===1){p.hR=[5,11,41];p.dS=nrm(-.05,.9,-.35);p.hL=[-9,3,33];p.lean=3;p.fR=[5,7,0];p.fx='slash';p.glow=.7;}
    else{p.hR=[-3,9,26];p.dS=nrm(-.55,.45,-.7);p.hL=[-11,-2,31];p.lean=2.5;p.fR=[5,7,0];}}
  else if(mode==='buff'){p.fL=[-6.5,0,0];p.fR=[6.5,0,0];p.hR=[2,8,38];p.hL=[-2,8,37];p.dS=nrm(0,.08,1);p.flare=2+f;p.fx='buff';p.glow=.5+f*.15;p.lean=-.5;}
  else if(mode==='skill'){p.fL=[-5,-3,0];p.fR=[5,3,0];p.glow=.9;
    if(f===0){p.hR=[9,-6,30];p.dS=nrm(.3,-.8,-.25);p.hL=[-7,9,40];p.lean=1;p.fx='charge';}
    else if(f===1){p.hR=[8,2,51];p.dS=nrm(.1,.3,.95);p.hL=[-9,4,44];p.lean=-1;p.fx='charge';}
    else if(f===2){p.hR=[3,13,36];p.dS=nrm(0,.95,-.3);p.hL=[-10,-3,32];p.lean=4;p.fR=[5,8,0];p.fx='burst';p.flare=6;}
    else{p.hR=[9,6,32];p.dS=nrm(.1,.6,.75);p.hL=[-11,1,30];p.fx='fade';p.glow=.5;}}
  return p;}
function render(ctx,ang,frame,mode,cx,cy,S,t){mode=mode===true?'walk':mode||'idle';t=t||0;
  const p=pose(mode,frame|0),A=ang*Math.PI/180,fx=Math.sin(A),fy=Math.cos(A),rx=Math.cos(A),ry=-Math.sin(A);
  const bob=p.bob+(mode==='idle'?Math.sin(t/600)*.4:0);
  const P=(lx,ly,lz)=>{if(lz>26)ly+=(lz-26)*p.lean/30;const z=lz+(lz>18?bob:0),X=lx*rx+ly*fx,Y=lx*ry+ly*fy;return{x:cx+X*S,y:cy-(z*.92+Y*.45)*S,X,Y};};
  const front=-fy; // 1: 정면(남), -1: 뒷모습
  const L=[];const add=(d,fn)=>L.push([d,fn]);
  const c=ctx;c.save();c.lineCap='round';c.lineJoin='round';
  const cap=(a,b,w,col,hi)=>{c.strokeStyle=col;c.lineWidth=w*S;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();if(hi){c.strokeStyle=hi;c.lineWidth=w*S*.35;c.beginPath();c.moveTo(a.x-w*S*.18,a.y-w*S*.1);c.lineTo(b.x-w*S*.18,b.y-w*S*.1);c.stroke();}};
  const disc=(q,r,g)=>{c.fillStyle=g;c.beginPath();c.arc(q.x,q.y,r*S,0,7);c.fill();};
  const rg=(q,r,a,b,cc)=>{const g=c.createRadialGradient(q.x-r*S*.35,q.y-r*S*.4,r*S*.1,q.x,q.y,r*S);g.addColorStop(0,a);g.addColorStop(.55,b);g.addColorStop(1,cc);return g;};
  const glow=(q,r,a)=>{const g=c.createRadialGradient(q.x,q.y,0,q.x,q.y,r*S);g.addColorStop(0,'rgba(235,255,252,'+a+')');g.addColorStop(.3,'rgba('+SOUL+','+a*.85+')');g.addColorStop(1,'rgba('+SOUL+',0)');c.save();c.globalCompositeOperation='lighter';c.fillStyle=g;c.beginPath();c.arc(q.x,q.y,r*S,0,7);c.fill();c.restore();};
  // ---- 망토 ----
  const cloakRef=P(0,-6.5,30);
  add(cloakRef.Y,()=>{const top=[],bot=[];for(let i=0;i<=10;i++){const th=i/10*Math.PI;top.push(P(Math.cos(th)*9.5,-5.5-Math.sin(th)*2,43.5));
      const fl=p.flare,wob=Math.sin(i*1.9+frame*1.3+t/400)*.8;bot.push(P(Math.cos(th)*(12.5+fl*.3),-6-Math.sin(th)*(4+fl)+wob,(i%2?7.5:3.5)+fl*.35));}
    const g=c.createLinearGradient(0,top[5].y,0,bot[5].y);g.addColorStop(0,COL.cl0);g.addColorStop(.6,COL.cl1);g.addColorStop(1,COL.cl2);c.fillStyle=g;
    c.beginPath();top.forEach((q,i)=>i?c.lineTo(q.x,q.y):c.moveTo(q.x,q.y));for(let i=10;i>=0;i--)c.lineTo(bot[i].x,bot[i].y);c.closePath();c.fill();
    c.strokeStyle='rgba(130,100,165,.35)';c.lineWidth=.6*S;for(const i of[2,4,6,8]){c.beginPath();c.moveTo(top[i].x,top[i].y);c.lineTo(bot[i].x,bot[i].y);c.stroke();}});
  // ---- 다리 ----
  for(const[s,ft]of[[-1,p.fL],[1,p.fR]]){const hip=P(4.5*s,0,26),foot=P(ft[0],ft[1],ft[2]),kn=P((4.5*s+ft[0])/2,(ft[1])/2+2.5,(26+ft[2])/2+1),toe=P(ft[0],ft[1]+3.5,ft[2]);
    add(Math.min(hip.Y,kn.Y,foot.Y)+.4,()=>{cap(hip,kn,6.6,COL.st1,'rgba(150,160,180,.35)');cap(kn,foot,5.6,'#262a32','rgba(150,160,180,.3)');disc(kn,2.6,rg(kn,2.6,'#8a93a5','#3f4552','#1a1c22'));
      cap(foot,toe,4.4,'#0f1014');});}
  // ---- 몸통(단면 타원을 이은 형태) ----
  const prof=[[26,7,5],[30,7.4,5.4],[34,8.2,5.8],[38,9.2,6],[42,10,6]];
  const torsoRef=P(0,0,34);
  add(torsoRef.Y,()=>{const Lp=[],Rp=[];for(const[z,wx,wy]of prof){const ctr=P(0,0,z),hw=Math.hypot(wx*rx,wy*fx)*S;Lp.push({x:ctr.x-hw,y:ctr.y});Rp.push({x:ctr.x+hw,y:ctr.y});}
    const g=c.createLinearGradient(Lp[2].x,0,Rp[2].x,0);g.addColorStop(0,COL.st0);g.addColorStop(.45,COL.st1);g.addColorStop(1,COL.st2);c.fillStyle=g;
    c.beginPath();Lp.forEach((q,i)=>i?c.lineTo(q.x,q.y):c.moveTo(q.x,q.y));const tp=P(0,0,45);c.quadraticCurveTo(tp.x,tp.y,Rp[4].x,Rp[4].y);for(let i=4;i>=0;i--)c.lineTo(Rp[i].x,Rp[i].y);c.closePath();c.fill();
    // 허리띠·갑옷 치마
    const bl=P(-7,0,26.5),br=P(7,0,26.5),bm=P(0,0,26.5);const bw=Math.hypot(7*rx,5*fx)*S;c.fillStyle='#1b1d23';c.fillRect(bm.x-bw,bm.y-1.8*S,bw*2,3.4*S);
    for(const lx of[-5,0,5]){const a=P(lx,5*(front>0?1:-1)*.9,25),b=P(lx,5.2*(front>0?1:-1),19.5);if(Math.abs(lx*rx)+Math.abs(5*fx)<.1)continue;cap(a,b,4.2,COL.st1,'rgba(160,170,190,.3)');}
    if(front>-.15){const v=Math.min(1,(front+.15)*1.6);c.globalAlpha=v;
      // 갈비뼈 무늬
      c.strokeStyle='rgba(217,209,187,.7)';c.lineWidth=.9*S;for(let i=0;i<3;i++){const z=39-i*3.6;for(const s of[-1,1]){const a=P(s*1,6.1,z),m=P(s*4.5,5.8,z-.6),b=P(s*7.2,4.6,z-2.4);c.beginPath();c.moveTo(a.x,a.y);c.quadraticCurveTo(m.x,m.y,b.x,b.y);c.stroke();}}
      const sp=P(0,6.2,30),sp2=P(0,6.2,41);c.strokeStyle='rgba(0,0,0,.45)';c.beginPath();c.moveTo(sp.x,sp.y);c.lineTo(sp2.x,sp2.y);c.stroke();
      const core=P(0,6.3,35);glow(core,4.2+p.glow*2,.85);c.strokeStyle='rgba('+SOUL+',1)';c.lineWidth=.8*S;const k1=P(.3,6.4,37.5),k2=P(-.6,6.4,35.5),k3=P(.6,6.4,33.8),k4=P(-.3,6.4,32);c.beginPath();c.moveTo(k1.x,k1.y);c.lineTo(k2.x,k2.y);c.lineTo(k3.x,k3.y);c.lineTo(k4.x,k4.y);c.stroke();
      const sk=P(0,5.3,26.6);disc(sk,1.9,COL.bone);c.fillStyle='#111';const e1=P(-.7,5.6,27),e2=P(.7,5.6,27);c.fillRect(e1.x-.4*S,e1.y-.4*S,.8*S,.8*S);c.fillRect(e2.x-.4*S,e2.y-.4*S,.8*S,.8*S);
      c.globalAlpha=1;}});
  // ---- 팔 ----
  const arm=(s,h)=>{const sh=P(9.5*s,0,42),hd=P(h[0],h[1],h[2]),el=P((9.5*s+h[0])/2+2*s,(h[1])/2-1.8,(42+h[2])/2-1.5);
    add(Math.min(el.Y,hd.Y)-.2,()=>{cap(sh,el,6.4,'#2c3039','rgba(150,160,180,.35)');cap(el,hd,5.8,'#22252c','rgba(150,160,180,.3)');disc(el,2.9,rg(el,2.9,'#7d8697','#363b46','#15171b'));disc(hd,3.6,rg(hd,3.6,'#5a606e','#1c1e24','#0b0c0f'));});return hd;};
  const hR=arm(1,p.hR);arm(-1,p.hL);
  // ---- 견갑 ----
  const topRef=Math.min(cloakRef.Y,torsoRef.Y)-.6;
  for(const s of[-1,1]){const q=P(10*s,0,43.5);add(Math.min(q.Y,topRef),()=>{for(const[dx,h]of[[-1.5,9],[1.5,7]]){const a=P(10*s+dx,-.5,45.5),b=P(11.5*s+dx*.6,-1.5,45.5+h),d=P(10*s+dx+1.6,-.5,45.5);c.fillStyle=COL.bone;c.beginPath();c.moveTo(a.x-1.1*S,a.y);c.lineTo(b.x,b.y);c.lineTo(a.x+1.1*S,a.y);c.closePath();c.fill();}
      const rr=5.8*S;const g=c.createRadialGradient(q.x-rr*.3,q.y-rr*.45,rr*.1,q.x,q.y,rr);g.addColorStop(0,'#8c95a7');g.addColorStop(.55,'#3a3f4b');g.addColorStop(1,'#121418');c.fillStyle=g;c.beginPath();c.ellipse(q.x,q.y,rr,rr*.82,0,0,7);c.fill();
      c.strokeStyle='rgba(255,255,255,.2)';c.lineWidth=.7*S;c.beginPath();c.ellipse(q.x,q.y,rr*.65,rr*.5,0,Math.PI*1.05,Math.PI*1.85);c.stroke();});}
  // ---- 머리(해골 투구) ----
  const H=P(0,0,52);
  add(Math.min(H.Y,topRef)-.3,()=>{const r=7.4*S;
    for(const[lx,h]of[[-4,6],[0,8],[4,6]]){const a=P(lx,-1.2,57.5),b=P(lx*1.1,-2.4,57.5+h);c.fillStyle=COL.bone;c.beginPath();c.moveTo(a.x-1.2*S,a.y+.5*S);c.lineTo(b.x,b.y);c.lineTo(a.x+1.2*S,a.y+.5*S);c.closePath();c.fill();}
    const g=c.createRadialGradient(H.x-r*.35,H.y-r*.45,r*.15,H.x,H.y,r);g.addColorStop(0,'#8d96a8');g.addColorStop(.55,'#353a45');g.addColorStop(1,'#101216');c.fillStyle=g;c.beginPath();c.ellipse(H.x,H.y,r,r*1.08,0,0,7);c.fill();
    if(front>-.25){const v=Math.min(1,(front+.25)*1.5);c.globalAlpha=v;
      const v1=P(-4.6,5.6,53.6),v2=P(4.6,5.6,53.6),v3=P(3.8,5.9,50.8),v4=P(-3.8,5.9,50.8);c.fillStyle='#050608';c.beginPath();c.moveTo(v1.x,v1.y);c.lineTo(v2.x,v2.y);c.lineTo(v3.x,v3.y);c.lineTo(v4.x,v4.y);c.closePath();c.fill();
      for(const s of[-1,1]){const e=P(2.3*s,6.2,52.3);glow(e,3.4,1);c.fillStyle='#f0fffc';c.fillRect(e.x-1*S,e.y-.5*S,2*S,1*S);}
      c.fillStyle=COL.bone;for(let i=0;i<5;i++){const q=P(-3.6+i*1.8,5.8,47.6);c.fillRect(q.x-.6*S,q.y-1.6*S,1.2*S,3*S);}
      c.globalAlpha=1;}
    else{c.strokeStyle='rgba(0,0,0,.45)';c.lineWidth=.9*S;const a=P(0,-6,57),b=P(0,-6.5,47);c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();}});
  // ---- 유령 대검 ----
  const d=p.dS,pt=(k)=>P(p.hR[0]+d[0]*k,p.hR[1]+d[1]*k,p.hR[2]+d[2]*k);const bladeMid=pt(16);
  add(Math.min(bladeMid.Y,hR.Y)-.25,()=>{const b0=pt(2.5),b1=pt(29),tip=pt(33),gu=pt(2),pm=pt(-4.5);
    cap(pm,gu,2.2,'#1a1c22');disc(pm,1.6,COL.bone);
    const ang2=Math.atan2(tip.y-b0.y,tip.x-b0.x),nx=-Math.sin(ang2),ny=Math.cos(ang2),w=1.7*S;
    c.strokeStyle=COL.bone;c.lineWidth=1.7*S;c.beginPath();c.moveTo(gu.x+nx*5*S,gu.y+ny*5*S);c.quadraticCurveTo(gu.x-(tip.x-b0.x)*.04,gu.y-(tip.y-b0.y)*.04,gu.x-nx*5*S,gu.y-ny*5*S);c.stroke();
    c.save();c.shadowColor='rgba('+SOUL+',1)';c.shadowBlur=(4+p.glow*8)*S/2;const g=c.createLinearGradient(b0.x+nx*w,b0.y+ny*w,b0.x-nx*w,b0.y-ny*w);g.addColorStop(0,'#8ea6b2');g.addColorStop(.5,'#ecfcff');g.addColorStop(1,'#6f8794');c.fillStyle=g;
    c.beginPath();c.moveTo(b0.x+nx*w,b0.y+ny*w);c.lineTo(b1.x+nx*w*.85,b1.y+ny*w*.85);c.lineTo(tip.x,tip.y);c.lineTo(b1.x-nx*w*.85,b1.y-ny*w*.85);c.lineTo(b0.x-nx*w,b0.y-ny*w);c.closePath();c.fill();c.restore();
    c.strokeStyle='rgba(50,215,190,.9)';c.lineWidth=.6*S;c.beginPath();for(let k=5;k<27;k+=4){const a=pt(k),b=pt(k+1.6);c.moveTo(a.x-nx*.6*S,a.y-ny*.6*S);c.lineTo(b.x+nx*.6*S,b.y+ny*.6*S);}c.stroke();
    if(p.glow>.6)glow(tip,3+p.glow*3,.6*p.glow);});
  L.sort((a,b)=>b[0]-a[0]);
  // 바닥 이펙트(몸보다 먼저)
  if(p.fx==='buff'){c.save();c.globalCompositeOperation='lighter';for(let i=0;i<2;i++){const k=((frame+i*2)%4)/4,R=(8+k*14)*S;c.strokeStyle='rgba('+SOUL+','+(1-k)*.8+')';c.lineWidth=1.4*S;c.beginPath();c.ellipse(cx,cy,R,R*.45,0,0,7);c.stroke();}c.restore();}
  if(p.fx==='burst'){c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(cx,cy,0,cx,cy,20*S);g.addColorStop(0,'rgba('+SOUL+',.5)');g.addColorStop(1,'rgba('+SOUL+',0)');c.fillStyle=g;c.beginPath();c.ellipse(cx,cy,20*S,9*S,0,0,7);c.fill();c.restore();}
  for(const[,fn]of L)fn();
  // 공중 이펙트
  c.save();c.globalCompositeOperation='lighter';
  for(let i=0;i<3;i++){const base=P(-3+i*3,-.5,59),tt=t/260+i*1.7+frame*.9,h=(6+i%2*2+(p.fx==='buff'?4:0))*S;c.fillStyle='rgba('+SOUL+','+(.3-i*.05)+')';c.beginPath();c.moveTo(base.x-2*S,base.y);c.quadraticCurveTo(base.x-3*S+Math.sin(tt)*1.5*S,base.y-h*.55,base.x+Math.sin(tt*1.6)*1.6*S,base.y-h);c.quadraticCurveTo(base.x+3*S+Math.cos(tt)*1.5*S,base.y-h*.5,base.x+2*S,base.y);c.fill();}
  if(p.fx==='slash'){const tip=P(p.hR[0]+d[0]*33,p.hR[1]+d[1]*33,p.hR[2]+d[2]*33),top=P(6,-2,62),low=P(-6,10,20);c.strokeStyle='rgba('+SOUL+',.75)';c.lineWidth=3*S;c.beginPath();c.moveTo(top.x,top.y);c.quadraticCurveTo(tip.x+(tip.x-cx)*.15,tip.y,low.x,low.y);c.stroke();c.strokeStyle='rgba(240,255,252,.8)';c.lineWidth=1*S;c.stroke();}
  if(p.fx==='buff'){for(let i=0;i<8;i++){const a=i/8*Math.PI*2+frame*.4,q=P(Math.cos(a)*11,Math.sin(a)*11,10+((i*7+frame*9)%40));c.fillStyle='rgba('+SOUL+',.85)';c.beginPath();c.arc(q.x,q.y,1*S,0,7);c.fill();}glow(P(0,8,62),5+frame*1.5,.6);}
  if(p.fx==='charge'){const tip=P(p.hR[0]+d[0]*30,p.hR[1]+d[1]*30,p.hR[2]+d[2]*30);for(let i=0;i<7;i++){const a=i/7*Math.PI*2+t/300,q={x:tip.x+Math.cos(a)*7*S,y:tip.y+Math.sin(a)*4*S};c.fillStyle='rgba('+SOUL+',.8)';c.beginPath();c.arc(q.x,q.y,.9*S,0,7);c.fill();}glow(tip,6,.8);}
  if(p.fx==='burst'){const tip=P(p.hR[0]+d[0]*33,p.hR[1]+d[1]*33,p.hR[2]+d[2]*33);glow(tip,14,1);c.strokeStyle='rgba('+SOUL+',.8)';c.lineWidth=1.6*S;for(let i=0;i<10;i++){const a=i/10*Math.PI*2;c.beginPath();c.moveTo(tip.x+Math.cos(a)*4*S,tip.y+Math.sin(a)*4*S);c.lineTo(tip.x+Math.cos(a)*12*S,tip.y+Math.sin(a)*12*S);c.stroke();}}
  if(p.fx==='fade'){for(let i=0;i<9;i++){const q=P(Math.sin(i*2.3)*9,6+Math.cos(i*1.7)*6,20+i*3.5);c.fillStyle='rgba('+SOUL+','+(.25+.05*(i%3))+')';c.beginPath();c.arc(q.x,q.y,.9*S,0,7);c.fill();}}
  c.restore();c.restore();}
function motionFor(speedPx,act){if(act)return{mode:act,frames:MOTION[act].frames,ms:MOTION[act].ms};if(speedPx>=140)return{mode:'run',...MOTION.run};if(speedPx>1)return{mode:'walk',...MOTION.walk};return{mode:'idle',...MOTION.idle};}
return{render,MOTION,SHEET,ROWS,motionFor,pose};
})();
