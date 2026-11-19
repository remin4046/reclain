/* 리클라인 캐릭터 렌더러
   그리기: ReclainChars.renderChar(ctx, ReclainChars.CLASSES[i], 각도, 프레임, 동작, 발x, 발y, 배율)
   동작: false=대기, true=걷기(0~3), 'run'=달리기(0~3), 'attack'=공격(0~2),
         'buff'=버프 스킬(0~3), 'skill'=공격 스킬(0~3)
   동작 고르기: const m = ReclainChars.motionFor(이동속도px초, 행동)  // 행동: 'attack' | 'buff' | 'skill' | 없음
     → m.mode를 동작 값으로, m.frames로 프레임 순환, m.ms마다 다음 프레임
   달리기 기준 속도: ReclainChars.MOTION.runSpeed (기본 140 px/초)
   각도: 0=북, 90=동, 180=남, 270=서. 배율 1 = 64px 캐릭터.
   CLASSES 순서: 여기사, 여요정, 여법사, 남법사, 군주, 남요정, 공주, 남기사 (pal.fx = 클래스 이펙트 색)
   스프라이트 시트(sprites/*.png): 64px 칸 20열 = 대기, 걷기1~4, 달리기1~4, 공격1~3, 버프1~4, 스킬1~4
     행 = 남·남서·서·북서·북·북동·동·남동 */
(function(){

/* ---------- 캐릭터 데이터 (manifest.json 클래스 순서) ---------- */
const CLASSES=[
 {name:'여기사',sex:'f',body:'plate',skirt:true,hair:'ponytail',gear:'circlet',weapon:'sword',off:'shield',
  desc:'판금 갑옷, 검과 방패, 포니테일',pal:{armor:'#8392a6',cloth:'#2f4f7a',trim:'#c9a24a',leather:'#5a4330',pants:'#3a3631',skin:'#e8bb9c',hair:'#7a3f22',blade:'#b9c3cf'}},
 {name:'여요정',sex:'f',body:'tunic',skirt:true,hair:'long',ears:true,gear:'circlet',weapon:'bow',quiver:true,
  desc:'가죽 튜닉, 장궁과 화살통',pal:{armor:'#517f46',cloth:'#517f46',trim:'#b8984f',leather:'#7a5a35',pants:'#5a4d38',skin:'#f1cba9',hair:'#e8cf86',wood:'#8a6238'}},
 {name:'여법사',sex:'f',body:'robe',hair:'long',gear:'circlet',weapon:'staff',
  desc:'긴 로브, 보주 지팡이',pal:{armor:'#4b2e6b',cloth:'#4b2e6b',trim:'#c9a24a',leather:'#3a2f28',pants:'#3a2f28',skin:'#ecc0a2',hair:'#2a2130',wood:'#5a4128',orb:'#c38bff'}},
 {name:'남법사',sex:'m',body:'robe',hood:true,beard:true,weapon:'staff',
  desc:'두건 로브, 수염, 보주 지팡이',pal:{armor:'#2e3d6b',cloth:'#2e3d6b',trim:'#c9a24a',leather:'#3a2f28',pants:'#3a2f28',skin:'#d2a07f',hair:'#a39d95',wood:'#5a4128',orb:'#6fb6ff'}},
 {name:'군주',sex:'m',body:'plate',hair:'short',gear:'crown',weapon:'sword',cape:true,
  desc:'흑강 판금, 왕관, 붉은 망토',pal:{armor:'#555b69',cloth:'#8e1b1b',trim:'#d4ad52',leather:'#3a2b20',pants:'#2e2a28',skin:'#d6a283',hair:'#2b2018',cape:'#8e1b1b',blade:'#c3ccd6'}},
 {name:'남요정',sex:'m',body:'tunic',skirt:true,hair:'long',ears:true,weapon:'bow',quiver:true,
  desc:'숲빛 튜닉, 장궁과 화살통',pal:{armor:'#3f6b3a',cloth:'#3f6b3a',trim:'#a88a4a',leather:'#6b4f2e',pants:'#4d4433',skin:'#e3bf9f',hair:'#d9d2bb',wood:'#7a5531'}},
 {name:'공주',sex:'f',body:'dress',hair:'long',gear:'tiara',weapon:'rapier',cape:true,
  desc:'궁정 드레스, 티아라, 세검',pal:{armor:'#8c2f5a',cloth:'#8c2f5a',trim:'#d4ad52',leather:'#4a3430',pants:'#4a3430',skin:'#f0c6a8',hair:'#d9b462',cape:'#2b3150',blade:'#c8d0d9'}},
 {name:'남기사',sex:'m',body:'plate',helm:true,weapon:'sword',off:'shield',cape:true,
  desc:'전신 판금, 투구, 검과 방패',pal:{armor:'#6b7a8f',cloth:'#7a1e1e',trim:'#c9a24a',leather:'#4a3a2c',pants:'#3a3631',skin:'#d9a887',hair:'#3a2a1c',cape:'#7a1e1e',blade:'#b9c3cf'}},
];
/* 클래스별 스킬 이펙트 색 */
['#ffe08a','#a8ff8e','#d6a3ff','#8fd3ff','#ff7a45','#c8ff7a','#ff9ad5','#ffd36b'].forEach((f,i)=>CLASSES[i].pal.fx=f);
const MB={hip:25,sh:43,head:51.5,hr:6.8,sx:8.6,hx:4.2,cd:5.6,wd:4.6};
const FB={hip:24.5,sh:41.5,head:49.6,hr:6.5,sx:7.3,hx:4.5,cd:5.0,wd:4.4};

/* ---------- 색: 같은 계열로 밝게/어둡게 ---------- */
function mix(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const t=f<0?[24,17,14]:[255,247,230],k=Math.abs(f);
  return `rgb(${Math.round(r+(t[0]-r)*k)},${Math.round(g+(t[1]-g)*k)},${Math.round(b+(t[2]-b)*k)})`}
const TONE={metal:[-.42,.38,-.6],cloth:[-.32,.17,-.58],skin:[-.24,.14,-.52],gold:[-.36,.4,-.58],leather:[-.3,.16,-.58],hair:[-.34,.2,-.58],wood:[-.32,.18,-.6],orb:[-.3,.45,-.5]};
function mk(hex,t){const T=TONE[t];return{m:hex,d:mix(hex,T[0]),l:mix(hex,T[1]),o:mix(hex,T[2]),t}}

/* ---------- 3단 명암 칠하기: 외곽선 → 그림자면 → 중간면 → 밝은면 ---------- */
function shade(ctx,path,m,s,lw,extra){
  ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  ctx.beginPath();path(0,0);ctx.lineWidth=lw;ctx.strokeStyle=m.o;ctx.stroke();
  ctx.beginPath();path(0,0);ctx.fillStyle=m.d;ctx.fill();ctx.clip();
  const a=s*.34,b=s*.3;
  ctx.beginPath();path(-a,-a*.85);ctx.fillStyle=m.m;ctx.fill();
  ctx.beginPath();path(0,0);path(b,b*.85);ctx.fillStyle=m.l;ctx.fill('evenodd');
  if(extra)extra();
  ctx.restore();
}

/* ---------- 캐릭터 렌더러 ---------- */
function renderChar(ctx,c,ang,frame,walking,cx,cy,S){
  const atk=walking==='attack',run=walking==='run',buff=walking==='buff',skl=walking==='skill',sf=frame%4;walking=walking===true||run;
  const jump=skl&&c.weapon==='sword'&&sf===1?5:0;
  const A=ang*Math.PI/180,fx=Math.sin(A),fy=Math.cos(A),rx=Math.cos(A),ry=-Math.sin(A);
  /* 보행 주기: sw=왼발 앞뒤 위치(cos), cw=어느 발이 떠서 앞으로 나가는지(sin). 걷기는 접지-교차-접지-교차, 달리기는 45도 어긋나 체공 자세 */
  const ph=frame*Math.PI/2+(run?Math.PI/4:0),sw=walking?Math.cos(ph):0,cw=walking?Math.sin(ph):0;
  const B=c.sex==='m'?MB:FB,bob=walking?(run?1.6+.9*Math.sin(ph*2):Math.abs(cw)*1.3):0,pal=c.pal,lw=1.15*S,H2=Math.PI/2;
  const sway=walking?-cw*(run?.6:.9):0;
  const P=(lx,ly,lz)=>{if(run&&lz>B.hip-2)ly+=(lz-B.hip+2)*.11;if(lz>B.hip-4)lx+=sway;const X=lx*rx+ly*fx,Y=lx*ry+ly*fy,z=lz+(lz>6?bob:0)+jump;return{x:cx+X*S,y:cy-(z*.92+Y*.45)*S,Y,X}};
  const cache={};const M=(k,t)=>cache[k+t]||(cache[k+t]=mk(pal[k]||k,t));
  const sh=(path,m,s,ex)=>shade(ctx,path,m,s*S,lw,ex);
  const circ=(p,r)=>(dx,dy)=>{ctx.moveTo(p.x+dx+r*S,p.y+dy);ctx.arc(p.x+dx,p.y+dy,r*S,0,Math.PI*2)};
  const ell=(p,a,b)=>(dx,dy)=>{ctx.moveTo(p.x+dx+a,p.y+dy);ctx.ellipse(p.x+dx,p.y+dy,a,b,0,0,Math.PI*2)};
  const cap=(p,q,r1,r2)=>(dx,dy)=>{const ax=p.x+dx,ay=p.y+dy,bx=q.x+dx,by=q.y+dy,an=Math.atan2(by-ay,bx-ax);
    ctx.moveTo(ax+Math.cos(an+H2)*r1*S,ay+Math.sin(an+H2)*r1*S);ctx.arc(ax,ay,r1*S,an+H2,an-H2);ctx.arc(bx,by,r2*S,an-H2,an+H2);ctx.closePath()};
  /* 관절이 이어진 한 덩어리 팔다리: 시작-관절-끝 세 점을 부드러운 곡선으로 연결 */
  const limb=(p0,p1,p2,r0,r1,r2)=>{const u=(a,b)=>{const x=b.x-a.x,y=b.y-a.y,L=Math.hypot(x,y)||1;return{x:x/L,y:y/L}};
    const d1=u(p0,p1),d2=u(p1,p2),n0={x:-d1.y,y:d1.x},n2={x:-d2.y,y:d2.x};let n1={x:n0.x+n2.x,y:n0.y+n2.y};const L1=Math.hypot(n1.x,n1.y)||1;n1={x:n1.x/L1,y:n1.y/L1};
    const k=1/Math.max(.55,(n0.x*n1.x+n0.y*n1.y)),a0=Math.atan2(n0.y,n0.x),a2=Math.atan2(n2.y,n2.x),R0=r0*S,R1=r1*S*k,R2=r2*S;
    return(dx,dy)=>{const X0=p0.x+dx,Y0=p0.y+dy,X1=p1.x+dx,Y1=p1.y+dy,X2=p2.x+dx,Y2=p2.y+dy;
      ctx.moveTo(X0+n0.x*R0,Y0+n0.y*R0);ctx.quadraticCurveTo(X1+n1.x*R1,Y1+n1.y*R1,X2+n2.x*R2,Y2+n2.y*R2);
      ctx.arc(X2,Y2,R2,a2,a2-Math.PI,true);
      ctx.quadraticCurveTo(X1-n1.x*R1,Y1-n1.y*R1,X0-n0.x*R0,Y0-n0.y*R0);
      ctx.arc(X0,Y0,R0,a0+Math.PI,a0,true);ctx.closePath()}};
  /* 관절 아래쪽만 다른 재질로 칠하기 (경계선 없이 부드럽게, 얇은 이음 자국만) */
  const splitShade=(path,a,b,mat,s,t)=>{const x=b.x-a.x,y=b.y-a.y,L=Math.hypot(x,y)||1,ux=x/L,uy=y/L,vx=-uy,vy=ux,qx=a.x+x*t,qy=a.y+y*t,K=80*S;
    ctx.save();ctx.beginPath();ctx.moveTo(qx+vx*K,qy+vy*K);ctx.lineTo(qx-vx*K,qy-vy*K);ctx.lineTo(qx-vx*K+ux*K,qy-vy*K+uy*K);ctx.lineTo(qx+vx*K+ux*K,qy+vy*K+uy*K);ctx.closePath();ctx.clip();
    sh(path,mat,s);ctx.restore();
    ctx.save();ctx.beginPath();path(0,0);ctx.clip();ctx.strokeStyle=mat.o;ctx.globalAlpha=.55;ctx.lineWidth=.8*S;ctx.beginPath();ctx.moveTo(qx+vx*6*S,qy+vy*6*S);ctx.lineTo(qx-vx*6*S,qy-vy*6*S);ctx.stroke();ctx.restore()};
  const poly=pts=>(dx,dy)=>{ctx.moveTo(pts[0].x+dx,pts[0].y+dy);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x+dx,pts[i].y+dy);ctx.closePath()};
  const add3=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
  const items=[];const add=(d,f)=>items.push({d,f});
  const fxc=pal.fx||'#ffe08a',rgba=(hex,a)=>{const n=parseInt(hex.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`};
  const glow=(x,y,r,a)=>{ctx.save();const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(fxc,a));g.addColorStop(.45,rgba(fxc,a*.45));g.addColorStop(1,rgba(fxc,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.restore()};
  const star=(x,y,r,col)=>{ctx.save();ctx.strokeStyle=col;ctx.lineWidth=.8*S;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x-r,y);ctx.lineTo(x+r,y);ctx.moveTo(x,y-r);ctx.lineTo(x,y+r);ctx.moveTo(x-r*.5,y-r*.5);ctx.lineTo(x+r*.5,y+r*.5);ctx.moveTo(x+r*.5,y-r*.5);ctx.lineTo(x-r*.5,y+r*.5);ctx.stroke();ctx.restore()};
  const pw=(h,d)=>Math.sqrt((h*rx)**2+(d*fx)**2)*S;
  const robe=c.body==='robe'||c.body==='dress';

  /* 발밑 그림자 */
  ctx.save();ctx.fillStyle='rgba(10,14,8,.3)';ctx.beginPath();ctx.ellipse(cx,cy,13*S*(1-jump*.05),4.6*S*(1-jump*.05),0,0,Math.PI*2);ctx.fill();ctx.restore();
  /* 달리기 흙먼지 */
  if(run&&frame%2===1){ctx.save();ctx.fillStyle='rgba(222,206,170,.45)';const sd0=frame===1?-1:1;for(const [lx,ly,r] of [[sd0*3,-7,2.6],[sd0*4.5,-10,1.9],[sd0*1.5,-11.5,1.4]]){const X=lx*rx+ly*fx,Y=lx*ry+ly*fy;ctx.beginPath();ctx.arc(cx+X*S,cy-(1.5+Y*.45)*S,r*S,0,7);ctx.fill()}ctx.restore()}

  /* 슬롯: 망토 */
  if(c.cape){const fl=Math.abs(sw)*1.6+(run?3.5:0);
    const tl=P(-(B.sx-1),-3.6,B.sh-.5),tr=P(B.sx-1,-3.6,B.sh-.5),bl=P(-(B.sx+3.6),-6.8-fl,5),br=P(B.sx+3.6,-6.8-fl,5),bm=P(0,-8-fl,3.2),tm=P(0,-4.2,B.sh+.8);
    add(-P(0,-5,22).Y,()=>sh((dx,dy)=>{ctx.moveTo(tl.x+dx,tl.y+dy);ctx.lineTo(bl.x+dx,bl.y+dy);ctx.quadraticCurveTo(bm.x+dx,bm.y+dy,br.x+dx,br.y+dy);ctx.lineTo(tr.x+dx,tr.y+dy);ctx.quadraticCurveTo(tm.x+dx,tm.y+dy,tl.x+dx,tl.y+dy);ctx.closePath()},M('cape','cloth'),6.5,
      ()=>{ctx.strokeStyle=M('cape','cloth').d;ctx.lineWidth=1*S;for(const k of[-.35,0,.35]){const a=P(k*(B.sx),-4,B.sh-3),b=P(k*(B.sx+2.5),-7-fl,6);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo((a.x+b.x)/2+k*1.5*S,(a.y+b.y)/2,b.x,b.y);ctx.stroke()}
        ctx.strokeStyle=M('trim','gold').m;ctx.lineWidth=1.1*S;ctx.beginPath();ctx.moveTo(tl.x,tl.y);ctx.lineTo(bl.x,bl.y);ctx.quadraticCurveTo(bm.x,bm.y,br.x,br.y);ctx.lineTo(tr.x,tr.y);ctx.stroke()}))}
  /* 두건 뒤 자락 */
  if(c.hood){const a=P(0,-4.2,B.head-2.5),b=P(0,-5.4,B.sh-7);add(-P(0,-5,B.sh).Y,()=>sh(cap(a,b,5.4,6.6),M('cloth','cloth'),5))}
  /* 화살통 */
  if(c.quiver){const a=P(2.6,-4.6,B.sh+3.5),b=P(-2.8,-4.2,B.hip+2);add(-P(0,-4.4,B.sh-8).Y,()=>{
    for(const k of[-.8,.4,1.5]){const t=P(2.6+k,-4.6,B.sh+6.5);sh(circ(t,1.1),mk('#e8e0c8','cloth'),1.1)}
    sh(cap(a,b,2.3,2.1),M('leather','leather'),2.2)})}
  /* 긴 머리 / 포니테일 */
  if(c.hair==='long'){const len=c.body==='robe'?16:13,a=P(0,-3.7,B.head+.6),b=P(0,-4.6-Math.abs(sw)*.6-(run?3:0),B.head-len);
    add(-P(0,-4.2,B.head-6).Y-.05,()=>sh(cap(a,b,B.hr*.86,B.hr*.6),M('hair','hair'),4.5,()=>{ctx.strokeStyle=M('hair','hair').d;ctx.lineWidth=.8*S;ctx.beginPath();const m1=P(-1.4,-4.6,B.head-3),m2=P(-1.8,-5,B.head-len+2);ctx.moveTo(m1.x,m1.y);ctx.lineTo(m2.x,m2.y);ctx.stroke()}))}
  if(c.hair==='ponytail'){const a=P(0,-B.hr*.9,B.head+2.6),b=P(sw*.6,-B.hr-3.6-(run?3.5:0),B.head-9+(run?3:0));
    add(-P(0,-B.hr-1.5,B.head-3).Y-.05,()=>sh(cap(a,b,2.9,1.7),M('hair','hair'),2.6))}

  /* 슬롯: 다리·부츠 */
  for(const sd of[-1,1]){
    const st=run?8:5,ly=(atk||skl)?(sd<0?3.5:-2.5)*(skl&&c.weapon==='rapier'?1.5:1):buff?(sd<0?.8:-.8):(sd<0?sw*st:-sw*st),swg=walking?Math.max(0,sd<0?-cw:cw):0,lift=swg*(run?4:2.8)+(run?swg*Math.max(0,-ly)*.55:0);
    if(robe){const f=P(sd*3,ly*.6+1.2,1.6+lift*.6),t=P(sd*3,ly*.6+3.6,1.4+lift*.6);add(-f.Y-.4,()=>sh(cap(f,t,2.3,2.1),M('leather','leather'),2.2));continue}
    const hip=P(sd*B.hx,0,B.hip),knee=P(sd*B.hx,ly*.5+1.1+swg*(run?3:2.2),(B.hip+2+lift)/2+1+swg*.8),foot=P(sd*(B.hx+.3),ly,2.2+lift),toe=P(sd*(B.hx+.3),ly+2.8,1.7+lift);
    const thigh=c.body==='plate'?M('pants','cloth'):M('pants','cloth'),shin=c.body==='plate'?M('armor','metal'):M('leather','leather');
    add(c.skirt?Math.min(-knee.Y-.4,-.2):-knee.Y-.4,()=>{{const Lg=limb(hip,knee,foot,3.4,2.95,2.55);sh(Lg,thigh,3.2);splitShade(Lg,knee,foot,shin,2.9,.08)}sh(cap(foot,toe,2.5,2.2),c.body==='plate'?M('armor','metal'):M('leather','leather'),2.4);
      if(c.body==='plate')sh(ell(knee,1.9*S,1.5*S),M('armor','metal'),1.6)})}

  /* 슬롯: 몸통 갑옷·옷 */
  const torsoM=c.body==='plate'?M('armor','metal'):M('armor','cloth');
  add(0,()=>{const C=P(0,0,B.sh-1),W=P(0,0,B.hip+1.2),cwid=pw(B.sx-.6,B.cd),wwid=pw(B.hx+1.6,B.wd);
    sh((dx,dy)=>{ctx.moveTo(W.x-wwid+dx,W.y+dy);ctx.lineTo(C.x-cwid+dx,C.y+S+dy);ctx.quadraticCurveTo(C.x-cwid+dx,C.y-3*S+dy,C.x+dx,C.y-3.3*S+dy);
      ctx.quadraticCurveTo(C.x+cwid+dx,C.y-3*S+dy,C.x+cwid+dx,C.y+S+dy);ctx.lineTo(W.x+wwid+dx,W.y+dy);ctx.quadraticCurveTo(W.x+dx,W.y+2.6*S+dy,W.x-wwid+dx,W.y+dy);ctx.closePath()},torsoM,6.5,
      ()=>{if(c.body==='plate'){ctx.strokeStyle=mix(pal.armor,.62);ctx.lineWidth=1.2*S;ctx.beginPath();ctx.moveTo(C.x-cwid*.55,C.y+.5*S);ctx.lineTo(W.x-wwid*.5,W.y-2*S);ctx.stroke();
          ctx.strokeStyle=torsoM.d;ctx.lineWidth=.8*S;const m=P(0,0,B.hip+8);ctx.beginPath();ctx.moveTo(m.x-cwid*.8,m.y);ctx.quadraticCurveTo(m.x,m.y+1.5*S,m.x+cwid*.8,m.y);ctx.stroke()}
        if(c.body==='dress'){ctx.strokeStyle=M('trim','gold').m;ctx.lineWidth=1*S;const n=P(0,0,B.sh-1.5);ctx.beginPath();ctx.ellipse(n.x,n.y,cwid*.7,cwid*.3,0,0,Math.PI);ctx.stroke()}
        const fv=fy<.45,gold=M('trim','gold'),ln=(pts,col,w)=>{ctx.strokeStyle=col;ctx.lineWidth=w*S;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.stroke()};
        if(c.body==='plate'){
          if(fv){ln([P(0,B.cd,B.sh-2.5),P(0,B.wd+.6,B.hip+3)],mix(pal.armor,.5),.8);ln([P(.35,B.cd,B.sh-2.5),P(.35,B.wd+.6,B.hip+3)],torsoM.d,.5);
            for(const k of[-1,1]){const r0=P(k*(B.sx-2.6),B.cd-.6,B.sh-3.2);ctx.fillStyle=mix(pal.armor,.7);ctx.beginPath();ctx.arc(r0.x,r0.y,.6*S,0,7);ctx.fill()}}
          else ln([P(0,-B.cd,B.sh-3),P(0,-B.wd,B.hip+4)],mix(pal.armor,.4),.7);
          const m2=P(0,0,B.hip+5);ln([{x:m2.x-wwid*.95,y:m2.y},{x:m2.x,y:m2.y+1.3*S},{x:m2.x+wwid*.95,y:m2.y}],torsoM.d,.7)}
        if(c.body==='tunic'&&fv){ln([P(-2.6,B.cd-.8,B.sh-1.2),P(0,B.cd,B.sh-5),P(2.6,B.cd-.8,B.sh-1.2)],M('leather','leather').d,.9);
          const lace=[];for(let i=0;i<5;i++){const z=B.sh-5-i*2.2;lace.push(P(i%2?1.2:-1.2,B.cd-.2,z))}ln(lace,'#e6d9b8',.6)}
        if(c.body==='robe'&&fv){ln([P(-2.8,B.cd-.8,B.sh-1),P(0,B.cd,B.sh-5.5),P(2.8,B.cd-.8,B.sh-1)],gold.m,1.1);ln([P(0,B.cd,B.sh-5.5),P(0,B.wd+.4,B.hip+2)],gold.m,1)}
        if(c.body==='dress'&&fv){const lace=[];for(let i=0;i<5;i++){const z=B.sh-4-i*2.2;lace.push(P(i%2?1:-1,B.cd-.1,z))}ln(lace,gold.l,.6)}});
    /* 망토 걸쇠 */
    if(c.cape&&fy<.35){const g=M('trim','gold'),a=P(-(B.sx-2.2),B.cd-1,B.sh-2),b=P(B.sx-2.2,B.cd-1,B.sh-2),m=P(0,B.cd,B.sh-3.4);
      ctx.save();ctx.strokeStyle=g.d;ctx.lineWidth=.6*S;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo(m.x,m.y+1.2*S,b.x,b.y);ctx.stroke();ctx.restore();sh(circ(a,1.2),g,1.2);sh(circ(b,1.2),g,1.2)}
    /* 허리띠 */
    const bz=P(0,0,B.hip+2),bw=pw(B.hx+1.8,B.wd+.3),beltC=robe?M('trim','gold'):M('leather','leather');
    ctx.save();ctx.lineWidth=2.1*S;ctx.strokeStyle=beltC.o;ctx.beginPath();ctx.ellipse(bz.x,bz.y,bw,bw*.42,0,0,Math.PI);ctx.stroke();ctx.lineWidth=1.3*S;ctx.strokeStyle=beltC.m;ctx.stroke();ctx.restore();
    if(fy<.2){const bk=P(0,B.wd+.4,B.hip+2);sh(circ(bk,1.2),M('trim','gold'),1.2)}
    if(c.body==='tunic'&&-ry>-.3){const pp=P(B.hx+2.3,.8,B.hip);sh(ell(pp,1.9*S,2.3*S),M('leather','leather'),1.8,()=>{ctx.strokeStyle=M('leather','leather').o;ctx.lineWidth=.5*S;ctx.beginPath();ctx.moveTo(pp.x-1.9*S,pp.y-.6*S);ctx.lineTo(pp.x+1.9*S,pp.y-.6*S);ctx.stroke()})}});

  /* 짧은 치마 / 긴 로브 */
  if(c.skirt||robe){const top=robe?B.hip+4:B.hip+3,bot=robe?2.4:B.hip-6.5,w1=robe?B.hx+2.6:B.hx+2.2,w2=robe?(c.body==='dress'?12.5:10.5):B.hx+6.8;
    const mat=c.body==='plate'?M('cloth','cloth'):M('armor','cloth');
    add(.15,()=>{const Wp=P(0,0,top),Hm=P(0,sw*(run?2.4:1.3)-(run?1.5:0),bot),a=w1*S,b=w2*S;
      sh((dx,dy)=>{ctx.moveTo(Wp.x-a+dx,Wp.y+dy);ctx.lineTo(Hm.x-b+dx,Hm.y+dy);ctx.ellipse(Hm.x+dx,Hm.y+dy,b,b*.45,0,Math.PI,0,true);ctx.lineTo(Wp.x+a+dx,Wp.y+dy);ctx.ellipse(Wp.x+dx,Wp.y+dy,a,a*.45,0,0,Math.PI,true);ctx.closePath()},mat,w2*.9,
        ()=>{ctx.strokeStyle=mat.d;ctx.lineWidth=.9*S;for(const k of[-.45,.15,.6]){ctx.beginPath();ctx.moveTo(Wp.x+a*k,Wp.y+2*S);ctx.quadraticCurveTo((Wp.x+a*k+Hm.x+b*k*1.1)/2+k*S,(Wp.y+Hm.y)/2,Hm.x+b*k*1.1,Hm.y+b*.35);ctx.stroke()}
          if(fy<.45){const f1=P(0,w1,top),f2=P(0,w2,bot);
            if(c.body==='dress'){const pl=[P(-1.4,w1,top),P(1.4,w1,top),P(4.6,w2,bot),P(-4.6,w2,bot)];ctx.fillStyle=mix(pal.armor,.22);ctx.beginPath();pl.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.closePath();ctx.fill();
              ctx.strokeStyle=M('trim','gold').m;ctx.lineWidth=.8*S;ctx.beginPath();ctx.moveTo(pl[0].x,pl[0].y);ctx.lineTo(pl[3].x,pl[3].y);ctx.moveTo(pl[1].x,pl[1].y);ctx.lineTo(pl[2].x,pl[2].y);ctx.stroke()}
            else if(c.body==='robe'){ctx.strokeStyle=M('trim','gold').m;ctx.lineWidth=1.1*S;ctx.beginPath();ctx.moveTo(f1.x,f1.y);ctx.lineTo(f2.x,f2.y);ctx.stroke()}
            else if(c.body==='plate'){ctx.strokeStyle=M('trim','gold').m;ctx.lineWidth=1.4*S;ctx.beginPath();ctx.moveTo(f1.x,f1.y);ctx.lineTo(f2.x,f2.y);ctx.stroke()}
            else{ctx.strokeStyle=mat.o;ctx.lineWidth=.9*S;ctx.beginPath();ctx.moveTo((f1.x+f2.x)/2,(f1.y+f2.y)/2);ctx.lineTo(f2.x,f2.y);ctx.stroke()}}});
      ctx.save();ctx.strokeStyle=M('trim','gold').m;ctx.lineWidth=1.3*S;ctx.beginPath();ctx.ellipse(Hm.x,Hm.y,b-.6*S,(b-.6*S)*.45,0,0,Math.PI);ctx.stroke();ctx.restore()})}

  /* 공격 자세 (3프레임) */
  const af=frame%3,sx=B.sx,shz=B.sh;
  const TAB={
    sword:[{h:[sx+1.2,-2,shz+3],e:[sx+2.6,-1,shz-4],t:[.5,-4,18]},{h:[sx-1,7.5,shz-6],e:[sx+2,3,shz-6],t:[-3,18,4]},{h:[1.5,8,B.hip+7],e:[sx,4,shz-10],t:[-13,9,-9]}],
    rapier:[{h:[sx+.5,-2.5,shz-12],e:[sx+2,-3,shz-6],t:[0,16,2]},{h:[sx-2,10,shz-8],e:[sx,5,shz-6],t:[-.5,17,.5]},{h:[sx-2,11,shz-8],e:[sx,5.5,shz-6],t:[-.5,17,.5]}],
    staff:[{h:[sx,3,shz+2],e:[sx+2,1,shz-6],b:[0,-2,-12],tp:[0,2,24]},{h:[sx-1,9,shz-7],e:[sx+1.5,4,shz-7],b:[0,-11,-6],tp:[0,21,11]},{h:[sx-1,9.5,shz-7],e:[sx+1.5,4,shz-7],b:[0,-11,-6],tp:[0,21,11]}],
    bowR:[{h:[-1.5,8.5,shz-6],e:[sx+1,3,shz-6]},{h:[sx-4,-.5,shz-4],e:[sx+2.5,-2,shz-3]},{h:[sx-1,-3,shz-3],e:[sx+2.5,-2.5,shz-4]}]};
  /* 버프 스킬 자세 (4프레임): 모으기 → 들어올리기 → 발동 → 유지 */
  const BUFF={
    sword:[{h:[sx+1,3,shz-12],e:[sx+2,0,shz-8],t:[.3,3,18]},{h:[sx-1,2,shz+2],e:[sx+2,0,shz-4],t:[0,.5,19]},{h:[sx-2,1,shz+9],e:[sx+1.5,.5,shz+1],t:[0,0,19]},{h:[sx-2,1,shz+9],e:[sx+1.5,.5,shz+1],t:[0,0,19]}],
    staff:[{h:[sx,3,shz-12],e:[sx+2,1,shz-8],b:[0,.6,-13],tp:[0,1.2,24]},{h:[sx-1,3,shz-2],e:[sx+2,1,shz-7],b:[0,0,-12],tp:[0,1,24]},{h:[sx-1.5,2,shz+5],e:[sx+2,1,shz-3],b:[0,0,-12],tp:[0,.5,24]},{h:[sx-1.5,2,shz+5],e:[sx+2,1,shz-3],b:[0,0,-12],tp:[0,.5,24]}],
    staffL:[{h:[-(sx+1),2,shz-15],e:[-(sx+1.5),.5,shz-9]},{h:[-(sx+2),3,shz-2],e:[-(sx+2),1,shz-8]},{h:[-(sx+2),3,shz+3],e:[-(sx+2.2),1,shz-5]},{h:[-(sx+2),3,shz+3],e:[-(sx+2.2),1,shz-5]}],
    bowR:[{h:[1.5,4.5,shz-7],e:[sx+1.5,2,shz-8]},{h:[sx+2,3.5,shz-1],e:[sx+2.5,1,shz-6]},{h:[sx+2.5,3,shz+6],e:[sx+3,1,shz-2]},{h:[sx+2.5,3,shz+6],e:[sx+3,1,shz-2]}]};
  /* 공격 스킬 자세 (4프레임) */
  const SKILL={
    sword:[{h:[sx,-3,shz+5],e:[sx+2,-2,shz-2],t:[0,-7,16]},{h:[sx-1,4,shz+8],e:[sx+2,1,shz+1],t:[0,2,19]},{h:[sx-2,9,B.hip+4],e:[sx,5,shz-8],t:[-1,12,-8]},{h:[sx-1,7,shz-10],e:[sx+1,3,shz-8],t:[-.5,15,5]}],
    rapier:[{h:[sx+.5,-2.5,shz-12],e:[sx+2,-3,shz-6],t:[0,16,2]},{h:[sx-2,10,shz-5],e:[sx,5,shz-4],t:[0,17,3]},{h:[sx-2,10,shz-11],e:[sx,5,shz-8],t:[0,17,-1]},{h:[sx-2.5,12,shz-8],e:[sx,6,shz-6],t:[-.5,17,.5]}],
    staff:[BUFF.staff[2],{h:[sx-1.5,2,shz+6],e:[sx+2,1,shz-2],b:[0,0,-12],tp:[0,.5,24]},TAB.staff[1],TAB.staff[2]],
    staffL:[BUFF.staffL[2],BUFF.staffL[2],{h:[-(sx-1),7,shz-9],e:[-(sx+1),3,shz-8]},{h:[-(sx-1),7,shz-9],e:[-(sx+1),3,shz-8]}],
    bowR:[{h:[-1.5,8.5,shz-6],e:[sx+1,3,shz-6]},{h:[sx-4,-1.5,shz-4],e:[sx+2.5,-2.5,shz-3]},{h:[sx-4.5,-2,shz-4],e:[sx+2.5,-3,shz-3]},{h:[sx-1,-3,shz-3],e:[sx+2.5,-2.5,shz-4]}]};
  function apose(right){const w=c.weapon;
    if(buff){if(w==='sword'||w==='rapier')return right?BUFF.sword[sf]:(c.off==='shield'?null:w==='rapier'?{h:[-1.5,4.5,shz-7],e:[-(sx+1.5),2,shz-8]}:{h:[-(sx+1.8),-1,B.hip+4],e:[-(sx+3.5),-1,shz-9]});
      if(w==='staff')return right?BUFF.staff[sf]:BUFF.staffL[sf];
      if(w==='bow')return right?BUFF.bowR[sf]:null}
    if(skl){if(w==='sword')return right?SKILL.sword[sf]:(c.off==='shield'?{h:[-(sx+.4),6,shz-13],e:[-(sx+1.5),1.5,shz-9]}:{h:[-(sx+1.5),5,shz-12],e:[-(sx+2),2,shz-8]});
      if(w==='rapier')return right?SKILL.rapier[sf]:{h:[-(sx+1.5),-3,shz-14],e:[-(sx+1.8),-1.5,shz-8]};
      if(w==='staff')return right?SKILL.staff[sf]:SKILL.staffL[sf];
      if(w==='bow')return right?SKILL.bowR[sf]:{h:[-(sx-2.5),9.5,shz-6],e:[-(sx+.5),5,shz-5]}}
    if(!atk)return null;
    if(w==='sword')return right?TAB.sword[af]:(c.off==='shield'?{h:[-(sx+.4),6,shz-13],e:[-(sx+1.5),1.5,shz-9]}:null);
    if(w==='rapier')return right?TAB.rapier[af]:{h:[-(sx+1.5),-3,shz-14],e:[-(sx+1.8),-1.5,shz-8]};
    if(w==='staff')return right?TAB.staff[af]:(af?{h:[-(sx-1),7,shz-9],e:[-(sx+1),3,shz-8]}:null);
    if(w==='bow')return right?TAB.bowR[af]:{h:[-(sx-2.5),9.5,shz-6],e:[-(sx+.5),5,shz-5]};
    return null}
  const nrm=v=>{const L=Math.hypot(...v)||1;return v.map(x=>x/L)};
  /* 슬롯: 팔·장갑·무기·방패 */
  for(const sd of[-1,1]){
    const right=sd>0,hold=right?['sword','staff','rapier'].includes(c.weapon):(c.off==='shield'||c.weapon==='bow');
    const S0=[sd*B.sx,0,B.sh-1.6];
    let hL=hold?[sd*(B.sx+.6),4.6+(walking?sw*sd*(run?2:.8):0),B.sh-15]:run?[sd*(B.sx+1.2),(right?sw:-sw)*7,B.sh-13]:[sd*(B.sx+1.7),right?sw*4:-sw*4,B.sh-17.5];
    let eL=hold?[sd*(B.sx+1.5),.4,B.sh-9]:run?[sd*(B.sx+1.6),hL[1]*.25-2.2,B.sh-9.5]:[sd*(B.sx+1.3),hL[1]*.45-.6,B.sh-9];
    const po=apose(right);if(po){hL=po.h;eL=po.e}
    const s0=P(...S0),el=P(...eL),hd=P(...hL);
    const upM=c.body==='plate'?M('armor','metal'):M('armor','cloth'),foM=c.body==='plate'?M('armor','metal'):robe?M('armor','cloth'):M('leather','leather');
    const handM=c.body==='plate'?M('leather','leather'):M('skin','skin');
    add(-(hd.Y*.6+el.Y*.4)+.05,()=>{
      {const La=limb(s0,el,hd,robe?2.9:2.7,robe?2.75:2.35,robe?3.5:2.1);sh(La,upM,2.6);if(foM!==upM)splitShade(La,el,hd,foM,2.5,.12)}
      if(right&&c.weapon!=='bow'&&hold&&c.weapon==='staff'){}
      if(c.body==='plate'){sh(circ(el,1.75),M('armor','metal'),1.7);const wr={x:el.x+(hd.x-el.x)*.72,y:el.y+(hd.y-el.y)*.72};sh(ell(wr,2.5*S,1.7*S),M('armor','metal'),1.8)}
      sh(circ(hd,1.95),handM,1.9);
      if(c.body==='plate')sh(circ(P(sd*(B.sx-.3),0,B.sh-.4),c.name==='군주'?4.4:4.1),M('armor','metal'),4,()=>{ctx.strokeStyle=M('trim','gold').m;ctx.lineWidth=.8*S;const p=P(sd*(B.sx-.3),0,B.sh-.4);ctx.beginPath();ctx.arc(p.x,p.y,3.4*S,Math.PI*.15,Math.PI*.85);ctx.stroke()});
      if(right&&hold)weapon(hL,po);
      if(!right&&hold){if(c.off==='shield')shield(hL);else bow(hL)}
    })}
  function weapon(h,po){
    if(c.weapon==='sword'||c.weapon==='rapier'){const thin=c.weapon==='rapier';
      const t=po?po.t:(thin?[.4,6.5,17.5]:[.6,7,19.5]),n=nrm(t),cb0=nrm([t[1],-t[0],0]),cb=Math.hypot(t[0],t[1])<.5?[3.2,0,0]:cb0.map(x=>x*3.2);
      const gL=add3(h,n.map(x=>x*1.8)),pom=P(...add3(h,n.map(x=>-x*3))),g=P(...gL),tip=P(...add3(h,t)),gl=P(...add3(gL,cb.map(x=>-x))),gr=P(...add3(gL,cb));
      if(atk&&!thin&&af>=1){const tp=TAB.sword.map(q=>P(...add3(q.h,q.t))),k={x:2*tp[1].x-(tp[0].x+tp[2].x)/2,y:2*tp[1].y-(tp[0].y+tp[2].y)/2};
        ctx.save();ctx.lineCap='round';ctx.strokeStyle=af===1?'rgba(255,252,236,.6)':'rgba(255,252,236,.25)';ctx.lineWidth=(af===1?2.6:1.6)*S;ctx.beginPath();ctx.moveTo(tp[0].x,tp[0].y);ctx.quadraticCurveTo(k.x,k.y,tp[2].x,tp[2].y);ctx.stroke();ctx.restore()}
      if((skl&&!thin&&sf<=2)||(buff&&sf>=2)){ctx.save();ctx.lineCap='round';ctx.strokeStyle=rgba(fxc,.35);ctx.lineWidth=5*S;ctx.beginPath();ctx.moveTo(g.x,g.y);ctx.lineTo(tip.x,tip.y);ctx.stroke();ctx.strokeStyle=rgba(fxc,.6);ctx.lineWidth=2.8*S;ctx.stroke();ctx.restore()}
      if(skl&&thin&&sf>=2){for(let j=1;j<sf;j++){const q=SKILL.rapier[j],nn=nrm(q.t),a=P(...add3(q.h,nn.map(x=>x*1.8))),z=P(...add3(q.h,q.t));ctx.save();ctx.lineCap='round';ctx.strokeStyle=rgba(fxc,.45);ctx.lineWidth=1.4*S;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(z.x,z.y);ctx.stroke();ctx.restore();star(z.x,z.y,2.6*S,fxc)}}
      sh(cap(pom,g,1.05,1.05),M('leather','leather'),1);
      sh(cap(g,tip,thin?1:1.55,thin?.35:.55),mk(pal.blade,'metal'),thin?1:1.5,()=>{ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=.6*S;ctx.beginPath();ctx.moveTo(g.x-.4*S,g.y-.8*S);ctx.lineTo((g.x+tip.x)/2-.3*S,(g.y+tip.y)/2);ctx.stroke();if(!thin){ctx.strokeStyle=mix(pal.blade,-.35);ctx.lineWidth=.5*S;ctx.beginPath();ctx.moveTo(g.x,g.y);ctx.lineTo(g.x+(tip.x-g.x)*.75,g.y+(tip.y-g.y)*.75);ctx.stroke()}});
      if(thin)sh(circ(g,1.7),M('trim','gold'),1.6);else sh(cap(gl,gr,1.1,1.1),M('trim','gold'),1.1);
      sh(circ(pom,1.2),M('trim','gold'),1.2);
      if(buff&&sf>=2){glow(tip.x,tip.y,(sf===2?8:6)*S,.75);star(tip.x,tip.y,3.6*S,'#ffffff')}
      if(skl&&thin&&sf>=1){glow(tip.x,tip.y,5*S,.7);star(tip.x,tip.y,3.2*S,'#ffffff')}
      if(atk&&thin&&af===2){ctx.save();ctx.strokeStyle='#fff6c8';ctx.lineWidth=.9*S;ctx.lineCap='round';ctx.beginPath();for(let i=0;i<4;i++){const an=i*Math.PI/4;ctx.moveTo(tip.x+Math.cos(an)*1.2*S,tip.y+Math.sin(an)*1.2*S);ctx.lineTo(tip.x+Math.cos(an)*3.6*S,tip.y+Math.sin(an)*3.6*S);ctx.moveTo(tip.x-Math.cos(an)*1.2*S,tip.y-Math.sin(an)*1.2*S);ctx.lineTo(tip.x-Math.cos(an)*3.6*S,tip.y-Math.sin(an)*3.6*S)}ctx.stroke();ctx.restore()}}
    if(c.weapon==='staff'){const bo=po?po.b:[0,.6,-13],to=po?po.tp:[0,1.2,24],n=nrm([to[0]-bo[0],to[1]-bo[1],to[2]-bo[2]]),b=P(...add3(h,bo)),t=P(...add3(h,to)),o=P(...add3(add3(h,to),n.map(x=>x*3)));
      if(atk&&af===2){ctx.save();ctx.fillStyle=pal.orb;for(const [r,a] of [[8,.16],[5.5,.28]]){ctx.globalAlpha=a;ctx.beginPath();ctx.arc(o.x,o.y,r*S,0,7);ctx.fill()}ctx.restore()}
      sh(cap(b,t,1.25,1.4),M('wood','wood'),1.3);for(const k of[.62,.8]){const q={x:b.x+(t.x-b.x)*k,y:b.y+(t.y-b.y)*k};sh(ell(q,1.6*S,.9*S),M('trim','gold'),1.2)}sh(circ(t,1.9),M('trim','gold'),1.8);
      if((buff&&sf>=2)||(skl&&sf<=1))glow(o.x,o.y,(skl&&sf===1?10:7)*S,.8);
      sh(circ(o,2.9),mk(pal.orb,'orb'),2.9,()=>{ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.arc(o.x-1*S,o.y-1*S,.8*S,0,7);ctx.fill()});
      if(buff&&sf===2)star(o.x,o.y,5*S,'#ffffff');
      if(skl&&sf===1){ctx.save();ctx.fillStyle=fxc;for(let i=0;i<7;i++){const an=i/7*Math.PI*2+frame;ctx.beginPath();ctx.arc(o.x+Math.cos(an)*8*S,o.y+Math.sin(an)*8*S,.8*S,0,7);ctx.fill()}ctx.restore()}
      if(atk&&af===2){ctx.save();ctx.strokeStyle='#ffffff';ctx.lineWidth=.8*S;ctx.lineCap='round';ctx.beginPath();for(let i=0;i<6;i++){const an=i*Math.PI/3+.3;ctx.moveTo(o.x+Math.cos(an)*4*S,o.y+Math.sin(an)*4*S);ctx.lineTo(o.x+Math.cos(an)*6.5*S,o.y+Math.sin(an)*6.5*S)}ctx.stroke();ctx.restore()}}}
  function shield(h){const c0=P(...add3(h,[-1.2,2.3,3])),R=7;
    const nY=-.55*ry+.83*fy,v=-nY,w=R*S*Math.max(.22,Math.abs(nY)),hh=R*.95*S;
    const face=v>0;sh(ell(c0,w,hh),face?M('cloth','cloth'):M('wood','wood'),R*.8,()=>{
      if(face&&w>2.5*S){ctx.strokeStyle=M('trim','gold').m;ctx.lineWidth=1.5*S;ctx.beginPath();ctx.moveTo(c0.x,c0.y-hh*.62);ctx.lineTo(c0.x,c0.y+hh*.62);ctx.moveTo(c0.x-w*.55,c0.y-hh*.1);ctx.lineTo(c0.x+w*.55,c0.y-hh*.1);ctx.stroke()}});
    ctx.save();ctx.strokeStyle=mix(pal.armor||'#8a95a3',.15);ctx.lineWidth=1.3*S;ctx.beginPath();ctx.ellipse(c0.x,c0.y,Math.max(w-.7*S,.5),hh-.7*S,0,0,Math.PI*2);ctx.stroke();ctx.restore();
    if(face&&w>3*S){ctx.fillStyle=mix(pal.armor||'#8a95a3',.55);for(let i=0;i<8;i++){const an=i*Math.PI/4+.39;ctx.beginPath();ctx.arc(c0.x+Math.cos(an)*(w-1.6*S),c0.y+Math.sin(an)*(hh-1.6*S),.55*S,0,7);ctx.fill()}}
    if(face&&w>2*S)sh(circ(c0,1.3),M('armor','metal'),1.3)}
  function bow(h){const t=P(...add3(h,[-.3,1.6,15])),b=P(...add3(h,[-.3,1.6,-12.5])),q=P(...add3(h,[-.3,8,1.5])),m=M('wood','wood');
    const bs=atk?['nock','draw','release'][af]:skl?['nock','draw','draw','release'][sf]:null,rp=bs?apose(true):null,pull=bs==='draw'?P(...rp.h):null;
    ctx.save();ctx.lineCap='round';ctx.strokeStyle='#efe6cc';ctx.lineWidth=.55*S;ctx.beginPath();ctx.moveTo(t.x,t.y);if(pull)ctx.lineTo(pull.x,pull.y);ctx.lineTo(b.x,b.y);ctx.stroke();
    const arrow=(a,z)=>{ctx.strokeStyle='#d9c79a';ctx.lineWidth=.8*S;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(z.x,z.y);ctx.stroke();ctx.fillStyle='#c3ccd6';ctx.beginPath();ctx.arc(z.x,z.y,1*S,0,7);ctx.fill();ctx.fillStyle='#e8e0c8';ctx.beginPath();ctx.arc(a.x,a.y,1*S,0,7);ctx.fill()};
    if(bs==='nock')arrow(P(...add3(h,[-.3,-1,.5])),P(...add3(h,[-.3,8,.5])));
    if(pull){const ah=P(...add3(h,[-.3,6,.5]));if(skl){ctx.save();ctx.lineCap='round';ctx.strokeStyle=rgba(fxc,.5);ctx.lineWidth=(sf===2?3.6:2.4)*S;ctx.beginPath();ctx.moveTo(pull.x,pull.y);ctx.lineTo(ah.x,ah.y);ctx.stroke();ctx.restore();glow(ah.x,ah.y,(sf===2?8:5)*S,.8)}arrow(pull,ah)}
    if(skl&&bs==='release'){const a=P(...add3(h,[-.3,5,.8])),z=P(...add3(h,[-.3,36,.8]));ctx.save();ctx.lineCap='round';for(const [w,col] of [[7,rgba(fxc,.25)],[4,rgba(fxc,.6)],[1.4,'#ffffff']]){ctx.strokeStyle=col;ctx.lineWidth=w*S;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(z.x,z.y);ctx.stroke()}ctx.restore();glow(a.x,a.y,7*S,.8);star(z.x,z.y,4*S,'#ffffff')}
    if(atk&&bs==='release'){const a=P(...add3(h,[-.3,14,.8])),z=P(...add3(h,[-.3,25,.8]));ctx.strokeStyle='rgba(255,252,236,.45)';ctx.lineWidth=.6*S;for(const k of[-1.2,1.2]){ctx.beginPath();ctx.moveTo(a.x,a.y+k*S);ctx.lineTo(a.x-(z.x-a.x)*.6,a.y-(z.y-a.y)*.6+k*S);ctx.stroke()}arrow(a,z)}
    const cv=(w,col,ox,oy)=>{ctx.strokeStyle=col;ctx.lineWidth=w*S;ctx.beginPath();ctx.moveTo(t.x+ox,t.y+oy);ctx.quadraticCurveTo(q.x+ox,q.y+oy,b.x+ox,b.y+oy);ctx.stroke()};
    cv(3.3,m.o,0,0);cv(2.2,m.d,0,0);cv(1.3,m.m,-.35*S,-.3*S);cv(.6,m.l,-.6*S,-.55*S);ctx.restore();
    sh(circ(h.length?P(...add3(h,[-.3,1.6,0])):t,1.6),M('leather','leather'),1.5)}

  /* 슬롯: 머리·투구·장식 */
  add(100,()=>{
    const hz=B.head,hr=B.hr,Hc=P(0,0,hz),away=fy>.45,side=Math.abs(fx)>.3,hasHair=!c.helm&&!c.hood;
    const hairM=M('hair','hair'),skin=M('skin','skin'),hs=P(0,-1.7,hz+1.1),hsr=hr+.75;
    const hairSphere=()=>sh(circ(hs,hsr),hairM,hsr,()=>{ctx.strokeStyle=hairM.l;ctx.lineWidth=.6*S;ctx.lineCap='round';for(const [o,r,a0,a1] of [[-.25,.62,1.08,1.45],[.05,.78,1.15,1.38],[-.1,.45,1.6,1.85]]){ctx.beginPath();ctx.arc(hs.x+o*hsr*S,hs.y+.15*hsr*S,r*hsr*S,Math.PI*a0,Math.PI*a1);ctx.stroke()}});
    const eyes=()=>{const out=[];for(const k of[-1,1]){const nx=k*.33,ny=.94,nY=nx*ry+ny*fy;if(-nY>.12)out.push(P(k*2.3,hr*.9,hz+.2))}return out};
    const ears=front=>{if(!c.ears)return;for(const k of[-1,1]){const nY=k*ry,isF=-nY>-.25;if(isF!==front)continue;
      sh(poly([P(k*hr*.82,-.2,hz+2),P(k*(hr+4.6),-2,hz+3.6),P(k*hr*.82,-.2,hz-1.6)]),skin,2)}};
    if(hasHair&&!away)hairSphere();
    ears(false);
    sh(cap(P(0,0,B.sh-1),P(0,0,hz-4),2.3,2.2),skin,2.2);
    if(c.body==='plate')sh(ell(P(0,0,B.sh+.2),4.3*S,2.4*S),M('armor','metal'),2.6);
    sh(circ(Hc,hr),skin,hr);
    if(!away&&!c.hood){const es=eyes();ctx.fillStyle='#2a1d18';for(const e of es){ctx.beginPath();ctx.arc(e.x,e.y,.95*S,0,7);ctx.fill();ctx.fillStyle='rgba(255,255,255,.8)';ctx.beginPath();ctx.arc(e.x-.3*S,e.y-.35*S,.32*S,0,7);ctx.fill();ctx.fillStyle='#2a1d18'}
      if(!c.helm){ctx.strokeStyle=mix(pal.hair,-.4);ctx.lineWidth=.6*S;ctx.lineCap='round';for(const e of es){ctx.beginPath();ctx.moveTo(e.x-1.1*S,e.y-1.5*S);ctx.lineTo(e.x+1.1*S,e.y-1.75*S);ctx.stroke()}}
      if(fy<-.55&&!c.helm){const mo=P(0,hr*.93,hz-2.7);ctx.strokeStyle=mix(pal.skin,-.38);ctx.lineWidth=.6*S;ctx.beginPath();ctx.moveTo(mo.x-.8*S,mo.y);ctx.quadraticCurveTo(mo.x,mo.y+.35*S,mo.x+.8*S,mo.y);ctx.stroke();
        ctx.fillStyle=mix(pal.skin,-.18);const no=P(0,hr*.98,hz-1.2);ctx.beginPath();ctx.arc(no.x+.2*S,no.y,.45*S,0,7);ctx.fill()}}
    if(hasHair){
      if(away)hairSphere();
      else if(side){const ux=fx,uy=-fy*.45,L=Math.hypot(ux,uy),u={x:ux/L,y:uy/L},v={x:-u.y,y:u.x},q={x:Hc.x+u.x*hr*.12*S,y:Hc.y+u.y*hr*.12*S},K=60*S;
        ctx.save();ctx.beginPath();ctx.moveTo(q.x+v.x*K,q.y+v.y*K);ctx.lineTo(q.x-v.x*K,q.y-v.y*K);ctx.lineTo(q.x-v.x*K-u.x*K,q.y-v.y*K-u.y*K);ctx.lineTo(q.x+v.x*K-u.x*K,q.y+v.y*K-u.y*K);ctx.closePath();ctx.clip();hairSphere();ctx.restore()}
      if(!away){const bp=P(0,hr*.45,hz+hr*.58);sh(ell(bp,hr*.92*S,hr*.44*S),hairM,hr*.6)}}
    ears(true);
    if(c.helm){const hp=P(0,-.25,hz+.7),r=hr+1.2,m=M('armor','metal');
      sh(circ(hp,r),m,r,()=>{ctx.strokeStyle=mix(pal.armor,.6);ctx.lineWidth=1*S;ctx.beginPath();ctx.arc(hp.x,hp.y,r*.68*S,Math.PI*1.08,Math.PI*1.42);ctx.stroke()});
      if(!away){const es=[];for(const k of[-1,1]){const nY=k*.33*ry+.94*fy;if(-nY>.0)es.push(P(k*2.4,r*.9,hz+.3))}
        ctx.save();ctx.strokeStyle='#121518';ctx.lineWidth=1.6*S;ctx.lineCap='round';ctx.beginPath();
        if(es.length===2){const dx=es[1].x-es[0].x,dy=es[1].y-es[0].y,L=Math.hypot(dx,dy)||1;ctx.moveTo(es[0].x-dx/L*1.2*S,es[0].y-dy/L*1.2*S);ctx.lineTo(es[1].x+dx/L*1.2*S,es[1].y+dy/L*1.2*S)}
        else if(es.length===1){ctx.moveTo(es[0].x-1.6*S,es[0].y);ctx.lineTo(es[0].x+1.6*S,es[0].y)}
        ctx.stroke();ctx.restore()}
      sh(cap(P(0,r*.55,hz+r*.85),P(0,-r*.85,hz+r*.55),1.25,1.25),M('trim','gold'),1.2)}
    if(c.hood){const hp=P(0,-.9,hz+.9),r=hr+1.75,m=M('cloth','cloth');
      sh(circ(hp,r),m,r);
      if(fy<.4){const k=Math.min(1,Math.max(.28,-fy*.75+.3)),fc=P(0,hr*.62,hz-.8),a=4.5*S*k,b=5*S;
        ctx.save();ctx.fillStyle=m.o;ctx.beginPath();ctx.ellipse(fc.x,fc.y,a+.9*S,b+.8*S,0,0,7);ctx.fill();ctx.restore();
        sh(ell(fc,a,b),skin,3);
        ctx.fillStyle='#2a1d18';for(const k2 of[-1,1]){const nY=k2*.33*ry+.94*fy;if(-nY>.12){const e=P(k2*2.1,hr*.95,hz);ctx.beginPath();ctx.arc(e.x,e.y,.95*S,0,7);ctx.fill()}}
        if(c.beard&&fy<-.05){const bd=P(0,hr*.8,hz-4.6);sh(ell(bd,3.3*S*Math.max(.4,-fy),3.8*S),hairM,3)}}}
    const ring=(zb,rr,wid,col,half)=>{const cb=P(0,0,zb);ctx.save();ctx.lineCap='round';ctx.strokeStyle=col.o;ctx.lineWidth=(wid+1)*S;ctx.beginPath();ctx.ellipse(cb.x,cb.y,rr*S,rr*.45*S,0,0,half?Math.PI:Math.PI*2);ctx.stroke();ctx.strokeStyle=col.m;ctx.lineWidth=wid*S;ctx.stroke();
      if(!half){ctx.strokeStyle=col.l;ctx.lineWidth=wid*.45*S;ctx.beginPath();ctx.ellipse(cb.x,cb.y-.3*S,rr*S,rr*.45*S,0,Math.PI*1.05,Math.PI*1.55);ctx.stroke()}ctx.restore()};
    const spikes=(zb,rr,h,filter,pred)=>{const g=M('trim','gold');for(let i=0;i<6;i++){const an=i/6*Math.PI*2,lx=Math.sin(an)*rr,ly=Math.cos(an)*rr,bp=P(lx,ly,zb);
      if(pred(bp.Y)!==filter)continue;if(pred.front&&ly<rr*.3)continue;sh(poly([{x:bp.x-1.3*S,y:bp.y},{x:bp.x,y:bp.y-h*S},{x:bp.x+1.3*S,y:bp.y}]),g,1.2)}};
    if(c.gear==='crown'){const zb=hz+hr*.6,rr=hr*.84,f=Y=>Y<0;spikes(zb,rr,3.8,false,f);ring(zb,rr,2,M('trim','gold'));spikes(zb,rr,3.8,true,f);
      if(!away){const g=P(0,rr,zb+.6);ctx.fillStyle='#b3202a';ctx.beginPath();ctx.arc(g.x,g.y,1*S,0,7);ctx.fill()}}
    if(c.gear==='tiara'){const zb=hz+hr*.32,rr=hr*1.02;ring(zb,rr,1.1,M('trim','gold'),true);
      if(!away){const g=P(0,rr,zb);sh(poly([{x:g.x-1.4*S,y:g.y},{x:g.x,y:g.y-3.4*S},{x:g.x+1.4*S,y:g.y}]),M('trim','gold'),1.2);ctx.fillStyle='#4aa3d8';ctx.beginPath();ctx.arc(g.x,g.y-1.2*S,.8*S,0,7);ctx.fill()}}
    if(c.gear==='circlet'){const zb=hz+hr*.3,rr=hr*1.04,col=c.body==='plate'?mk('#b9c3cf','metal'):M('trim','gold');ring(zb,rr,.85,col,true);
      if(!away){const g=P(0,rr,zb);ctx.fillStyle=c.body==='robe'?'#c38bff':'#3fae7a';ctx.beginPath();ctx.arc(g.x,g.y,.9*S,0,7);ctx.fill()}}
  });

  /* ---------- 스킬 이펙트 ---------- */
  if(buff){const k=[.45,.75,1,1][sf];
    add(-999,()=>{ctx.save();ctx.strokeStyle=fxc;ctx.globalAlpha=[.35,.6,.9,.6][sf];ctx.lineWidth=1.2*S;const Rr=15*k*S;
      ctx.beginPath();ctx.ellipse(cx,cy,Rr,Rr*.45,0,0,7);ctx.stroke();ctx.lineWidth=.7*S;ctx.beginPath();ctx.ellipse(cx,cy,Rr*.72,Rr*.72*.45,0,0,7);ctx.stroke();
      for(let i=0;i<8;i++){const an=i/8*Math.PI*2+sf*.25;ctx.beginPath();ctx.moveTo(cx+Math.cos(an)*Rr*.72,cy+Math.sin(an)*Rr*.72*.45);ctx.lineTo(cx+Math.cos(an)*Rr,cy+Math.sin(an)*Rr*.45);ctx.stroke()}ctx.restore()});
    if(sf>=2)add(-998,()=>{ctx.save();const g=ctx.createRadialGradient(cx,cy-28*S,4*S,cx,cy-28*S,34*S);g.addColorStop(0,rgba(fxc,sf===2?.45:.3));g.addColorStop(1,rgba(fxc,0));ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(cx,cy-28*S,17*S,36*S,0,0,7);ctx.fill();ctx.restore()});
    add(999,()=>{ctx.save();
      ctx.fillStyle=fxc;if(sf>0)for(const [x0,p0] of [[-9,0],[7,.3],[-4,.55],[11,.75],[2,.15],[-12,.9],[5,.45]]){const t=(p0+sf*.22)%1,px=cx+(x0+Math.sin(t*6+x0))*S,py=cy-(4+t*50)*S;ctx.globalAlpha=.95*(1-t);ctx.beginPath();ctx.arc(px,py,(1.2-t*.5)*S,0,7);ctx.fill()}
      ctx.restore();if(c.weapon==='bow'&&sf>=2){const hp=P(...BUFF.bowR[sf].h);glow(hp.x,hp.y,7*S,.8);star(hp.x,hp.y,3.6*S,'#ffffff')}})}
  if(skl&&c.weapon==='sword'&&sf>=2){const q=SKILL.sword[2],tl=add3(q.h,q.t),gp=P(tl[0],tl[1],0),k=sf===2?1:1.7,al=sf===2?.85:.35;
    add(-999,()=>{ctx.save();ctx.strokeStyle=rgba(fxc,al);ctx.lineWidth=1.6*S;ctx.beginPath();ctx.ellipse(gp.x,gp.y,9*k*S,9*k*.45*S,0,0,7);ctx.stroke();ctx.lineWidth=.9*S;ctx.beginPath();ctx.ellipse(gp.x,gp.y,5*k*S,5*k*.45*S,0,0,7);ctx.stroke();
      ctx.strokeStyle='rgba(40,30,20,.55)';ctx.lineWidth=.8*S;for(let i=0;i<6;i++){const an=i/6*Math.PI*2+.4;ctx.beginPath();ctx.moveTo(gp.x,gp.y);ctx.lineTo(gp.x+Math.cos(an)*7*S,gp.y+Math.sin(an)*3.2*S);ctx.stroke()}ctx.restore()});
    add(999,()=>{glow(gp.x,gp.y-2*S,(sf===2?11:7)*S,sf===2?.75:.3);if(sf===2){ctx.fillStyle='#8a7a5a';for(const [dx,dy] of [[-5,-6],[4,-8],[7,-4],[-8,-3],[1,-10]]){ctx.beginPath();ctx.arc(gp.x+dx*S,gp.y+dy*S,.9*S,0,7);ctx.fill()}}})}
  if(skl&&c.weapon==='staff'&&sf>=2){const ice=!!c.beard;
    if(sf===2){const pp=P(sx-1,17,shz-6),tail=P(sx-1,10,shz-6);add(-pp.Y+.5,()=>{ctx.save();ctx.lineCap='round';ctx.strokeStyle=rgba(fxc,.5);ctx.lineWidth=3*S;ctx.beginPath();ctx.moveTo(tail.x,tail.y);ctx.lineTo(pp.x,pp.y);ctx.stroke();ctx.restore();glow(pp.x,pp.y,9*S,.9);ctx.fillStyle=fxc;ctx.beginPath();ctx.arc(pp.x,pp.y,3.2*S,0,7);ctx.fill();ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(pp.x,pp.y,1.5*S,0,7);ctx.fill()})}
    else{const ep=P(0,26,0);add(-ep.Y+.5,()=>{glow(ep.x,ep.y-4*S,15*S,.85);ctx.save();ctx.strokeStyle=fxc;ctx.lineWidth=1.3*S;ctx.beginPath();ctx.ellipse(ep.x,ep.y,12*S,5.4*S,0,0,7);ctx.stroke();
      if(ice){ctx.fillStyle='#e8f6ff';ctx.strokeStyle='#5fa8d8';ctx.lineWidth=.6*S;for(const [dx,hh] of [[-6,7],[-2,10],[3,8],[7,6],[0,5]]){ctx.beginPath();ctx.moveTo(ep.x+(dx-1.4)*S,ep.y);ctx.lineTo(ep.x+dx*S,ep.y-hh*S);ctx.lineTo(ep.x+(dx+1.4)*S,ep.y);ctx.closePath();ctx.fill();ctx.stroke()}}
      else{for(const [dx,dy] of [[-7,-6],[6,-9],[0,-13],[9,-3],[-10,-2]])star(ep.x+dx*S,ep.y+dy*S,2.4*S,'#ffffff')}ctx.restore()})}}
  items.sort((p,q)=>p.d-q.d).forEach(i=>i.f());
}

/* ---------- 바닥 타일 ---------- */
function ground(ctx,w,h,S){ctx.fillStyle='#4c6638';ctx.fillRect(0,0,w,h);const t=16*S;
  for(let y=0;y*t<h;y++)for(let x=0;x*t<w;x++){if((x+y)%2){ctx.fillStyle='#51703c';ctx.fillRect(x*t,y*t,t,t)}}
  let s=7;const rnd=()=>(s=(s*9301+49297)%233280)/233280;ctx.strokeStyle='#64854a';ctx.lineWidth=Math.max(1,.8*S);
  for(let i=0;i<34;i++){const x=rnd()*w,y=rnd()*h;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-1.2*S,y-2.6*S);ctx.moveTo(x,y);ctx.lineTo(x+1.1*S,y-2.2*S);ctx.stroke()}}

/* ---------- 이동 속도 → 동작 선택 ---------- */
/* 속도 단위: px/초. runSpeed 이상이면 달리기, 그 미만이면 걷기. 게임에 맞게 MOTION.runSpeed만 바꾸면 됩니다. */
const MOTION={runSpeed:140,stopSpeed:1};
/* action: 'attack'(또는 true) | 'buff' | 'skill' | 없음 */
function motionFor(speed,action){
  if(action==='buff')return{mode:'buff',frames:4,ms:170,label:'버프 스킬'};
  if(action==='skill')return{mode:'skill',frames:4,ms:140,label:'공격 스킬'};
  if(action)return{mode:'attack',frames:3,ms:110,label:'공격'};
  if(speed<=MOTION.stopSpeed)return{mode:false,frames:1,ms:0,label:'대기'};
  const run=speed>=MOTION.runSpeed;
  return{mode:run?'run':true,frames:4,ms:Math.round(Math.max(60,Math.min(260,(run?13000:9600)/speed))),label:run?'달리기':'걷기'};
}


const ORDER=[180,225,270,315,0,45,90,135];
window.ReclainChars={CLASSES,renderChar,ORDER,MOTION,motionFor};
})();
