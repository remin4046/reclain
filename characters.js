/* 리클라인 캐릭터 렌더러
   사용법: ReclainChars.renderChar(ctx, ReclainChars.CLASSES[i], 각도, 프레임(0~3), 걷기여부, 발x, 발y, 배율)
   각도: 0=북, 90=동, 180=남, 270=서 (45도 단위 8방향). 배율 1 = 64px 캐릭터.
   CLASSES 순서: 여기사, 여요정, 여법사, 남법사, 군주, 남요정, 공주, 남기사 */
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
  const A=ang*Math.PI/180,fx=Math.sin(A),fy=Math.cos(A),rx=Math.cos(A),ry=-Math.sin(A);
  const ph=frame*Math.PI/2+Math.PI/4,sw=walking?Math.sin(ph):0,cw=walking?Math.cos(ph):0;
  const B=c.sex==='m'?MB:FB,bob=walking?Math.abs(cw)*1.0:0,pal=c.pal,lw=1.15*S,H2=Math.PI/2;
  const P=(lx,ly,lz)=>{const X=lx*rx+ly*fx,Y=lx*ry+ly*fy,z=lz+(lz>6?bob:0);return{x:cx+X*S,y:cy-(z*.92+Y*.45)*S,Y,X}};
  const cache={};const M=(k,t)=>cache[k+t]||(cache[k+t]=mk(pal[k]||k,t));
  const sh=(path,m,s,ex)=>shade(ctx,path,m,s*S,lw,ex);
  const circ=(p,r)=>(dx,dy)=>{ctx.moveTo(p.x+dx+r*S,p.y+dy);ctx.arc(p.x+dx,p.y+dy,r*S,0,Math.PI*2)};
  const ell=(p,a,b)=>(dx,dy)=>{ctx.moveTo(p.x+dx+a,p.y+dy);ctx.ellipse(p.x+dx,p.y+dy,a,b,0,0,Math.PI*2)};
  const cap=(p,q,r1,r2)=>(dx,dy)=>{const ax=p.x+dx,ay=p.y+dy,bx=q.x+dx,by=q.y+dy,an=Math.atan2(by-ay,bx-ax);
    ctx.moveTo(ax+Math.cos(an+H2)*r1*S,ay+Math.sin(an+H2)*r1*S);ctx.arc(ax,ay,r1*S,an+H2,an-H2);ctx.arc(bx,by,r2*S,an-H2,an+H2);ctx.closePath()};
  const poly=pts=>(dx,dy)=>{ctx.moveTo(pts[0].x+dx,pts[0].y+dy);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x+dx,pts[i].y+dy);ctx.closePath()};
  const add3=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
  const items=[];const add=(d,f)=>items.push({d,f});
  const pw=(h,d)=>Math.sqrt((h*rx)**2+(d*fx)**2)*S;
  const robe=c.body==='robe'||c.body==='dress';

  /* 발밑 그림자 */
  ctx.save();ctx.fillStyle='rgba(10,14,8,.3)';ctx.beginPath();ctx.ellipse(cx,cy,13*S,4.6*S,0,0,Math.PI*2);ctx.fill();ctx.restore();

  /* 슬롯: 망토 */
  if(c.cape){const fl=Math.abs(sw)*1.6;
    const tl=P(-(B.sx-1),-3.6,B.sh-.5),tr=P(B.sx-1,-3.6,B.sh-.5),bl=P(-(B.sx+3.6),-6.8-fl,5),br=P(B.sx+3.6,-6.8-fl,5),bm=P(0,-8-fl,3.2),tm=P(0,-4.2,B.sh+.8);
    add(-P(0,-5,22).Y,()=>sh((dx,dy)=>{ctx.moveTo(tl.x+dx,tl.y+dy);ctx.lineTo(bl.x+dx,bl.y+dy);ctx.quadraticCurveTo(bm.x+dx,bm.y+dy,br.x+dx,br.y+dy);ctx.lineTo(tr.x+dx,tr.y+dy);ctx.quadraticCurveTo(tm.x+dx,tm.y+dy,tl.x+dx,tl.y+dy);ctx.closePath()},M('cape','cloth'),6.5,
      ()=>{ctx.strokeStyle=M('cape','cloth').d;ctx.lineWidth=1*S;for(const k of[-.35,.35]){const a=P(k*(B.sx),-4,B.sh-3),b=P(k*(B.sx+2.5),-7-fl,6);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}))}
  /* 두건 뒤 자락 */
  if(c.hood){const a=P(0,-4.2,B.head-2.5),b=P(0,-5.4,B.sh-7);add(-P(0,-5,B.sh).Y,()=>sh(cap(a,b,5.4,6.6),M('cloth','cloth'),5))}
  /* 화살통 */
  if(c.quiver){const a=P(2.6,-4.6,B.sh+3.5),b=P(-2.8,-4.2,B.hip+2);add(-P(0,-4.4,B.sh-8).Y,()=>{
    for(const k of[-.8,.4,1.5]){const t=P(2.6+k,-4.6,B.sh+6.5);sh(circ(t,1.1),mk('#e8e0c8','cloth'),1.1)}
    sh(cap(a,b,2.3,2.1),M('leather','leather'),2.2)})}
  /* 긴 머리 / 포니테일 */
  if(c.hair==='long'){const len=c.body==='robe'?16:13,a=P(0,-3.7,B.head+.6),b=P(0,-4.6-Math.abs(sw)*.6,B.head-len);
    add(-P(0,-4.2,B.head-6).Y-.05,()=>sh(cap(a,b,B.hr*.86,B.hr*.6),M('hair','hair'),4.5,()=>{ctx.strokeStyle=M('hair','hair').d;ctx.lineWidth=.8*S;ctx.beginPath();const m1=P(-1.4,-4.6,B.head-3),m2=P(-1.8,-5,B.head-len+2);ctx.moveTo(m1.x,m1.y);ctx.lineTo(m2.x,m2.y);ctx.stroke()}))}
  if(c.hair==='ponytail'){const a=P(0,-B.hr*.9,B.head+2.6),b=P(sw*.6,-B.hr-3.6,B.head-9);
    add(-P(0,-B.hr-1.5,B.head-3).Y-.05,()=>sh(cap(a,b,2.9,1.7),M('hair','hair'),2.6))}

  /* 슬롯: 다리·부츠 */
  for(const sd of[-1,1]){
    const ly=sd<0?sw*5:-sw*5,lift=walking?Math.max(0,sd<0?-cw:cw)*2.2:0;
    if(robe){const f=P(sd*3,ly*.6+1.2,1.6+lift*.6),t=P(sd*3,ly*.6+3.6,1.4+lift*.6);add(-f.Y-.4,()=>sh(cap(f,t,2.3,2.1),M('leather','leather'),2.2));continue}
    const hip=P(sd*B.hx,0,B.hip),knee=P(sd*B.hx,ly*.5+1.1,(B.hip+2+lift)/2+1),foot=P(sd*(B.hx+.3),ly,2.2+lift),toe=P(sd*(B.hx+.3),ly+2.8,1.7+lift);
    const thigh=c.body==='plate'?M('pants','cloth'):M('pants','cloth'),shin=c.body==='plate'?M('armor','metal'):M('leather','leather');
    add(-knee.Y-.4,()=>{sh(cap(hip,knee,3.4,3.0),thigh,3.2);sh(cap(knee,foot,3.0,2.6),shin,2.9);sh(cap(foot,toe,2.5,2.2),c.body==='plate'?M('armor','metal'):M('leather','leather'),2.4);
      if(c.body==='plate')sh(circ(knee,2.2),M('armor','metal'),2.2)})}

  /* 슬롯: 몸통 갑옷·옷 */
  const torsoM=c.body==='plate'?M('armor','metal'):M('armor','cloth');
  add(0,()=>{const C=P(0,0,B.sh-1),W=P(0,0,B.hip+1.2),cwid=pw(B.sx-.6,B.cd),wwid=pw(B.hx+1.6,B.wd);
    sh((dx,dy)=>{ctx.moveTo(W.x-wwid+dx,W.y+dy);ctx.lineTo(C.x-cwid+dx,C.y+S+dy);ctx.quadraticCurveTo(C.x-cwid+dx,C.y-3*S+dy,C.x+dx,C.y-3.3*S+dy);
      ctx.quadraticCurveTo(C.x+cwid+dx,C.y-3*S+dy,C.x+cwid+dx,C.y+S+dy);ctx.lineTo(W.x+wwid+dx,W.y+dy);ctx.quadraticCurveTo(W.x+dx,W.y+2.6*S+dy,W.x-wwid+dx,W.y+dy);ctx.closePath()},torsoM,6.5,
      ()=>{if(c.body==='plate'){ctx.strokeStyle=mix(pal.armor,.62);ctx.lineWidth=1.2*S;ctx.beginPath();ctx.moveTo(C.x-cwid*.55,C.y+.5*S);ctx.lineTo(W.x-wwid*.5,W.y-2*S);ctx.stroke();
          ctx.strokeStyle=torsoM.d;ctx.lineWidth=.8*S;const m=P(0,0,B.hip+8);ctx.beginPath();ctx.moveTo(m.x-cwid*.8,m.y);ctx.quadraticCurveTo(m.x,m.y+1.5*S,m.x+cwid*.8,m.y);ctx.stroke()}
        if(c.body==='dress'){ctx.strokeStyle=M('trim','gold').m;ctx.lineWidth=1*S;const n=P(0,0,B.sh-1.5);ctx.beginPath();ctx.ellipse(n.x,n.y,cwid*.7,cwid*.3,0,0,Math.PI);ctx.stroke()}});
    /* 허리띠 */
    const bz=P(0,0,B.hip+2),bw=pw(B.hx+1.8,B.wd+.3),beltC=robe?M('trim','gold'):M('leather','leather');
    ctx.save();ctx.lineWidth=2.1*S;ctx.strokeStyle=beltC.o;ctx.beginPath();ctx.ellipse(bz.x,bz.y,bw,bw*.42,0,0,Math.PI);ctx.stroke();ctx.lineWidth=1.3*S;ctx.strokeStyle=beltC.m;ctx.stroke();ctx.restore();
    if(fy<.2){const bk=P(0,B.wd+.4,B.hip+2);sh(circ(bk,1.2),M('trim','gold'),1.2)}});

  /* 짧은 치마 / 긴 로브 */
  if(c.skirt||robe){const top=robe?B.hip+4:B.hip+3,bot=robe?2.4:B.hip-6.5,w1=robe?B.hx+2.6:B.hx+2.2,w2=robe?(c.body==='dress'?12.5:10.5):B.hx+6;
    const mat=c.body==='plate'?M('cloth','cloth'):M('armor','cloth');
    add(.15,()=>{const Wp=P(0,0,top),Hm=P(0,sw*1.3,bot),a=w1*S,b=w2*S;
      sh((dx,dy)=>{ctx.moveTo(Wp.x-a+dx,Wp.y+dy);ctx.lineTo(Hm.x-b+dx,Hm.y+dy);ctx.ellipse(Hm.x+dx,Hm.y+dy,b,b*.45,0,Math.PI,0,true);ctx.lineTo(Wp.x+a+dx,Wp.y+dy);ctx.ellipse(Wp.x+dx,Wp.y+dy,a,a*.45,0,0,Math.PI,true);ctx.closePath()},mat,w2*.9,
        ()=>{ctx.strokeStyle=mat.d;ctx.lineWidth=.9*S;for(const k of[-.45,.15]){ctx.beginPath();ctx.moveTo(Wp.x+a*k,Wp.y+2*S);ctx.lineTo(Hm.x+b*k*1.1,Hm.y+b*.35);ctx.stroke()}});
      ctx.save();ctx.strokeStyle=M('trim','gold').m;ctx.lineWidth=1.3*S;ctx.beginPath();ctx.ellipse(Hm.x,Hm.y,b-.6*S,(b-.6*S)*.45,0,0,Math.PI);ctx.stroke();ctx.restore()})}

  /* 슬롯: 팔·장갑·무기·방패 */
  for(const sd of[-1,1]){
    const right=sd>0,hold=right?['sword','staff','rapier'].includes(c.weapon):(c.off==='shield'||c.weapon==='bow');
    const S0=[sd*B.sx,0,B.sh-1.6];
    const hL=hold?[sd*(B.sx+.6),4.6+(walking?sw*sd*.8:0),B.sh-15]:[sd*(B.sx+1.7),right?sw*4:-sw*4,B.sh-17.5];
    const eL=hold?[sd*(B.sx+1.5),.4,B.sh-9]:[sd*(B.sx+1.3),hL[1]*.45-.6,B.sh-9];
    const s0=P(...S0),el=P(...eL),hd=P(...hL);
    const upM=c.body==='plate'?M('armor','metal'):M('armor','cloth'),foM=c.body==='plate'?M('armor','metal'):robe?M('armor','cloth'):M('leather','leather');
    const handM=c.body==='plate'?M('leather','leather'):M('skin','skin');
    add(-(hd.Y*.6+el.Y*.4)+.05,()=>{
      sh(cap(s0,el,robe?2.9:2.7,robe?2.7:2.4),upM,2.6);
      sh(cap(el,hd,robe?2.7:2.4,robe?3.5:2.1),foM,2.5);
      if(right&&c.weapon!=='bow'&&hold&&c.weapon==='staff'){}
      sh(circ(hd,1.95),handM,1.9);
      if(c.body==='plate')sh(circ(P(sd*(B.sx-.3),0,B.sh-.4),c.name==='군주'?4.4:4.1),M('armor','metal'),4,()=>{ctx.strokeStyle=M('trim','gold').m;ctx.lineWidth=.8*S;const p=P(sd*(B.sx-.3),0,B.sh-.4);ctx.beginPath();ctx.arc(p.x,p.y,3.4*S,Math.PI*.15,Math.PI*.85);ctx.stroke()});
      if(right&&hold)weapon(hL);
      if(!right&&hold){if(c.off==='shield')shield(hL);else bow(hL)}
    })}
  function weapon(h){
    if(c.weapon==='sword'||c.weapon==='rapier'){const thin=c.weapon==='rapier';
      const pom=P(...add3(h,[0,.3,-3])),g=P(...add3(h,[0,.9,1.8])),tip=P(...add3(h,thin?[.4,6.5,17.5]:[.6,7,19.5])),gl=P(...add3(h,[-3.2,.9,1.8])),gr=P(...add3(h,[3.2,.9,1.8]));
      sh(cap(pom,g,1.05,1.05),M('leather','leather'),1);
      sh(cap(g,tip,thin?1:1.55,thin?.35:.55),mk(pal.blade,'metal'),thin?1:1.5,()=>{ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=.6*S;ctx.beginPath();ctx.moveTo(g.x-.4*S,g.y-.8*S);ctx.lineTo((g.x+tip.x)/2-.3*S,(g.y+tip.y)/2);ctx.stroke()});
      if(thin)sh(circ(g,1.7),M('trim','gold'),1.6);else sh(cap(gl,gr,1.1,1.1),M('trim','gold'),1.1);
      sh(circ(pom,1.2),M('trim','gold'),1.2)}
    if(c.weapon==='staff'){const b=P(...add3(h,[0,.6,-13])),t=P(...add3(h,[0,1.2,24])),o=P(...add3(h,[0,1.3,27]));
      sh(cap(b,t,1.25,1.4),M('wood','wood'),1.3);sh(circ(t,1.9),M('trim','gold'),1.8);
      sh(circ(o,2.9),mk(pal.orb,'orb'),2.9,()=>{ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.arc(o.x-1*S,o.y-1*S,.8*S,0,7);ctx.fill()})}}
  function shield(h){const c0=P(...add3(h,[-1.2,2.3,3])),R=7;
    const nY=-.55*ry+.83*fy,v=-nY,w=R*S*Math.max(.22,Math.abs(nY)),hh=R*.95*S;
    const face=v>0;sh(ell(c0,w,hh),face?M('cloth','cloth'):M('wood','wood'),R*.8,()=>{
      if(face&&w>2.5*S){ctx.strokeStyle=M('trim','gold').m;ctx.lineWidth=1.5*S;ctx.beginPath();ctx.moveTo(c0.x,c0.y-hh*.62);ctx.lineTo(c0.x,c0.y+hh*.62);ctx.moveTo(c0.x-w*.55,c0.y-hh*.1);ctx.lineTo(c0.x+w*.55,c0.y-hh*.1);ctx.stroke()}});
    ctx.save();ctx.strokeStyle=mix(pal.armor||'#8a95a3',.15);ctx.lineWidth=1.3*S;ctx.beginPath();ctx.ellipse(c0.x,c0.y,Math.max(w-.7*S,.5),hh-.7*S,0,0,Math.PI*2);ctx.stroke();ctx.restore();
    if(face&&w>2*S)sh(circ(c0,1.3),M('armor','metal'),1.3)}
  function bow(h){const t=P(...add3(h,[-.3,1.6,15])),b=P(...add3(h,[-.3,1.6,-12.5])),q=P(...add3(h,[-.3,8,1.5])),m=M('wood','wood');
    ctx.save();ctx.lineCap='round';ctx.strokeStyle='#efe6cc';ctx.lineWidth=.55*S;ctx.beginPath();ctx.moveTo(t.x,t.y);ctx.lineTo(b.x,b.y);ctx.stroke();
    const cv=(w,col,ox,oy)=>{ctx.strokeStyle=col;ctx.lineWidth=w*S;ctx.beginPath();ctx.moveTo(t.x+ox,t.y+oy);ctx.quadraticCurveTo(q.x+ox,q.y+oy,b.x+ox,b.y+oy);ctx.stroke()};
    cv(3.3,m.o,0,0);cv(2.2,m.d,0,0);cv(1.3,m.m,-.35*S,-.3*S);cv(.6,m.l,-.6*S,-.55*S);ctx.restore();
    sh(circ(h.length?P(...add3(h,[-.3,1.6,0])):t,1.6),M('leather','leather'),1.5)}

  /* 슬롯: 머리·투구·장식 */
  add(100,()=>{
    const hz=B.head,hr=B.hr,Hc=P(0,0,hz),away=fy>.45,side=Math.abs(fx)>.3,hasHair=!c.helm&&!c.hood;
    const hairM=M('hair','hair'),skin=M('skin','skin'),hs=P(0,-1.7,hz+1.1),hsr=hr+.75;
    const hairSphere=()=>sh(circ(hs,hsr),hairM,hsr);
    const eyes=()=>{const out=[];for(const k of[-1,1]){const nx=k*.33,ny=.94,nY=nx*ry+ny*fy;if(-nY>.12)out.push(P(k*2.3,hr*.9,hz+.2))}return out};
    const ears=front=>{if(!c.ears)return;for(const k of[-1,1]){const nY=k*ry,isF=-nY>-.25;if(isF!==front)continue;
      sh(poly([P(k*hr*.82,-.2,hz+2),P(k*(hr+4.6),-2,hz+3.6),P(k*hr*.82,-.2,hz-1.6)]),skin,2)}};
    if(hasHair&&!away)hairSphere();
    ears(false);
    sh(cap(P(0,0,B.sh-1),P(0,0,hz-4),2.3,2.2),skin,2.2);
    sh(circ(Hc,hr),skin,hr);
    if(!away&&!c.hood){ctx.fillStyle='#2a1d18';for(const e of eyes()){ctx.beginPath();ctx.arc(e.x,e.y,.95*S,0,7);ctx.fill()}}
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

  items.sort((p,q)=>p.d-q.d).forEach(i=>i.f());
}

/* ---------- 바닥 타일 ---------- */
function ground(ctx,w,h,S){ctx.fillStyle='#4c6638';ctx.fillRect(0,0,w,h);const t=16*S;
  for(let y=0;y*t<h;y++)for(let x=0;x*t<w;x++){if((x+y)%2){ctx.fillStyle='#51703c';ctx.fillRect(x*t,y*t,t,t)}}
  let s=7;const rnd=()=>(s=(s*9301+49297)%233280)/233280;ctx.strokeStyle='#64854a';ctx.lineWidth=Math.max(1,.8*S);
  for(let i=0;i<34;i++){const x=rnd()*w,y=rnd()*h;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-1.2*S,y-2.6*S);ctx.moveTo(x,y);ctx.lineTo(x+1.1*S,y-2.2*S);ctx.stroke()}}


const ORDER=[180,225,270,315,0,45,90,135];
window.ReclainChars={CLASSES,renderChar,ORDER};
})();
