/* ============================================================
   MARFATIA — Layout Invention Build — Interactions
   ============================================================ */
(function(){
"use strict";
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
const rand=(a,b)=>Math.random()*(b-a)+a;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

window.addEventListener("load", ()=>{ setTimeout(()=>$("#preloader").classList.add("done"), 450); });
$("#year").textContent = new Date().getFullYear();

/* ---------------- scroll progress + clock ---------------- */
window.addEventListener("scroll", ()=>{
  const h = document.documentElement;
  const pct = h.scrollTop/(h.scrollHeight-h.clientHeight)*100;
  $("#scrollProgress").style.width = pct+"%";
}, {passive:true});
function tickClock(){
  const now=new Date(); const h=String(now.getHours()).padStart(2,"0"), m=String(now.getMinutes()).padStart(2,"0"), s=String(now.getSeconds()).padStart(2,"0");
  const el=$("#heroClock"); if(el) el.textContent=`${h}:${m}:${s}`;
}
setInterval(tickClock,1000); tickClock();

/* ---------------- reveal on scroll (fallback when GSAP absent) ----------------
   scrollfx.js animates section content with ScrollTrigger; this basic
   IntersectionObserver reveal only runs if GSAP failed to load. */
if(!window.gsap){
  const revealTargets=$$(".section-head, .feature, .seccard");
  revealTargets.forEach(el=>el.classList.add("reveal"));
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in-view"); io.unobserve(e.target); } });
  },{threshold:.12});
  revealTargets.forEach(el=>io.observe(el));
}

/* ---------------- cursor trail (trading candlesticks) + parallax illustrations ---------------- */
(function(){
  const canvas=$("#cursorTrail");
  const illusLayers=$$(".illus-layer");
  if(!canvas && !illusLayers.length) return;

  let mx=innerWidth/2, my=innerHeight/2, lastX=mx, lastY=my;
  window.addEventListener("mousemove", e=>{
    mx=e.clientX; my=e.clientY;
    const cxN=(e.clientX/innerWidth-0.5)*2, cyN=(e.clientY/innerHeight-0.5)*2;
    illusLayers.forEach(l=>{
      const depth=parseFloat(l.dataset.depth||0.03);
      l.style.transform=`translate(${cxN*depth*260}px, ${cyN*depth*260}px)`;
    });
  }, {passive:true});

  if(!canvas || reduceMotion){ if(canvas) canvas.style.display="none"; return; }

  const ctx=canvas.getContext("2d");
  function resize(){
    const dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=innerWidth*dpr; canvas.height=innerHeight*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  window.addEventListener("resize", resize);

  const candles=[];
  let spawnCooldown=0, lastFrame=performance.now();

  /* candle color cycles 3 green, 1 red, repeating — independent of cursor direction */
  let streakUp=true, streakLeft=3;
  function nextUp(){
    if(streakLeft<=0){
      streakUp=!streakUp;
      streakLeft=streakUp ? 3 : 1;
    }
    streakLeft--;
    return streakUp;
  }

  function spawn(x,y){
    const up=nextUp();
    const bodyH=rand(10,22);
    candles.push({
      x, y, bodyH, wickH:bodyH+rand(6,14), up,
      w:rand(4,6), born:performance.now(), life:750,
      driftY: up ? -rand(12,24) : rand(12,24),
    });
    if(candles.length>50) candles.shift();
  }

  function loop(now){
    const dt=now-lastFrame; lastFrame=now;
    ctx.clearRect(0,0,innerWidth,innerHeight);

    const dy=my-lastY;
    spawnCooldown-=dt;
    if(spawnCooldown<=0 && (Math.abs(mx-lastX)>2 || Math.abs(dy)>2)){
      spawn(mx,my);
      spawnCooldown=36;
    }
    lastX=mx; lastY=my;

    for(let i=candles.length-1;i>=0;i--){
      const c=candles[i];
      const p=(now-c.born)/c.life;
      if(p>=1){ candles.splice(i,1); continue; }
      const yy=c.y + c.driftY*p;
      ctx.globalAlpha=(1-p)*0.85;
      const color=c.up ? "#08753B" : "#C24A3F";
      ctx.strokeStyle=color; ctx.fillStyle=color; ctx.lineWidth=1.4;
      ctx.beginPath();
      ctx.moveTo(c.x, yy-c.wickH/2);
      ctx.lineTo(c.x, yy+c.wickH/2);
      ctx.stroke();
      ctx.fillRect(c.x-c.w/2, yy-c.bodyH/2, c.w, c.bodyH);
    }
    ctx.globalAlpha=1;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* ---------------- mouse tilt cards ---------------- */
$$(".cap-card, .tilt-card, .product-card").forEach(card=>{
  card.addEventListener("mousemove", e=>{
    const r=card.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width-0.5, py=(e.clientY-r.top)/r.height-0.5;
    card.style.transform=`perspective(700px) rotateY(${px*6}deg) rotateX(${-py*6}deg) translateY(-4px)`;
  });
  card.addEventListener("mouseleave", ()=>{ card.style.transform=""; });
});

/* ---------------- PMS bar-grow + stat counters ---------------- */
(function(){
  const illusPms=$(".illus--pms"), pmsStats=$(".pms-stats");
  if(!illusPms) return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        illusPms.classList.add("in-view");
        animateCount($("#pmsStat1"),50,1400);
        animateCount($("#pmsStat2"),12,1400);
        obs.disconnect();
      }
    });
  },{threshold:.3});
  obs.observe(pmsStats||illusPms);
})();

/* ---------------- magnetic buttons ---------------- */
$$(".magnetic").forEach(btn=>{
  btn.addEventListener("mousemove", e=>{
    const r=btn.getBoundingClientRect();
    btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*0.22}px, ${(e.clientY-r.top-r.height/2)*0.3}px)`;
  });
  btn.addEventListener("mouseleave", ()=>{ btn.style.transform="translate(0,0)"; });
});

/* ============================================================
   SEC-01 — LIVE STRIP NAV
   ============================================================ */
const strip=$("#strip");
window.addEventListener("scroll", ()=>{ strip.classList.toggle("scrolled", window.scrollY>30); }, {passive:true});

const stripNav=$("#stripNav"), stripBurger=$("#stripBurger");
stripBurger.addEventListener("click", ()=>{ stripNav.classList.toggle("open"); });

$$(".strip-link[data-drawer]").forEach(btn=>{
  btn.addEventListener("click", (e)=>{
    e.stopPropagation();
    const item = btn.closest(".nav-item");
    if (!item) return;
    const wasOpen = item.classList.contains("open");
    $$(".nav-item").forEach(i=>i.classList.remove("open"));
    if(!wasOpen){
      item.classList.add("open");
    }
  });
});
document.addEventListener("click", e=>{
  if(!e.target.closest(".nav-item")) {
    $$(".nav-item").forEach(i=>i.classList.remove("open"));
  }
});

/* mobile menu: mirror header-right links (login + CTA) into the side nav */
(function(){
  const loginMenu=$("#loginDdMenu"), dematBtn=$(".strip-right .btn-primary");
  if(!loginMenu) return;

  const loginBtn=document.createElement("button");
  loginBtn.className="strip-link mobile-only";
  loginBtn.dataset.drawer=""; // joins the accordion caret styling + close-others cleanup
  loginBtn.textContent="Login";
  const loginSub=document.createElement("div");
  loginSub.className="mobile-sub";
  const group=document.createElement("div");
  group.className="drawer-group";
  group.innerHTML=loginMenu.innerHTML;
  loginSub.appendChild(group);
  stripNav.appendChild(loginBtn);
  stripNav.appendChild(loginSub);

  loginBtn.addEventListener("click", ()=>{
    const opening=!loginBtn.classList.contains("sub-open");
    $$(".strip-link[data-drawer]").forEach(b=>b.classList.remove("sub-open"));
    $$(".mobile-sub").forEach(s=>{ s.style.maxHeight=null; });
    if(opening){ loginBtn.classList.add("sub-open"); loginSub.style.maxHeight=loginSub.scrollHeight+"px"; }
  });

  if(dematBtn){
    const cta=dematBtn.cloneNode(true);
    cta.classList.add("mobile-only","mobile-cta");
    stripNav.appendChild(cta);
  }
})();

// login dropdown
const loginDd=$("#loginDd"), loginDdTrigger=$("#loginDdTrigger");
if(loginDdTrigger){
  loginDdTrigger.addEventListener("click", e=>{
    e.stopPropagation();
    loginDd.classList.toggle("open");
  });
  document.addEventListener("click", e=>{
    if(!e.target.closest("#loginDd")) loginDd.classList.remove("open");
  });
}

// slot-machine index readout roll (live market status, shown in the extra header room)
let stripPrice=24812;
function rollStripIndex(){
  stripPrice += rand(-14,16);
  $("#stripIndexValue").textContent = Math.round(stripPrice).toLocaleString("en-IN");
  const chgEl=$("#stripIndexChg");
  const pct=((stripPrice-24812)/24812*100);
  chgEl.textContent=(pct>=0?"+":"")+pct.toFixed(2)+"%";
  chgEl.className="si-chg "+(pct>=0?"up":"down");
}
if($("#stripIndex")) setInterval(rollStripIndex,2400);

/* ============================================================
   CANDLESTICK CHART (hero float card)
   ============================================================ */
(function candles(){
  const canvas = $("#candleChart");
  if(!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = devicePixelRatio||1;
  canvas.width = canvas.offsetWidth*dpr; canvas.height = canvas.offsetHeight*dpr;
  ctx.scale(dpr,dpr);
  const W = canvas.offsetWidth, H = canvas.offsetHeight;

  let data = [];
  let price = 100;
  for(let i=0;i<28;i++){
    const open = price;
    const close = open + rand(-3,3.4);
    const high = Math.max(open,close)+rand(0,1.6);
    const low = Math.min(open,close)-rand(0,1.6);
    data.push({open,close,high,low});
    price = close;
  }

  function render(){
    ctx.clearRect(0,0,W,H);
    const allVals = data.flatMap(d=>[d.high,d.low]);
    const max = Math.max(...allVals), min = Math.min(...allVals);
    const cw = W/data.length;
    data.forEach((d,i)=>{
      const x = i*cw + cw/2;
      const up = d.close >= d.open;
      ctx.strokeStyle = ctx.fillStyle = up ? "#08753b" : "#d64545";
      const yHigh = H - ((d.high-min)/(max-min))*H;
      const yLow = H - ((d.low-min)/(max-min))*H;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x,yHigh); ctx.lineTo(x,yLow); ctx.stroke();
      const yOpen = H - ((d.open-min)/(max-min))*H;
      const yClose = H - ((d.close-min)/(max-min))*H;
      const top = Math.min(yOpen,yClose), bh = Math.max(Math.abs(yClose-yOpen),2);
      ctx.fillRect(x-cw*0.28, top, cw*0.56, bh);
    });
  }
  render();

  // live update: shift and add new candle
  setInterval(()=>{
    data.shift();
    const open = data[data.length-1].close;
    const close = open + rand(-3,3.4);
    const high = Math.max(open,close)+rand(0,1.6);
    const low = Math.min(open,close)-rand(0,1.6);
    data.push({open,close,high,low});
    render();
    const last = data[data.length-1];
    const pct = ((last.close-data[0].open)/data[0].open*100).toFixed(2);
    const badge = $("#niftyBadge");
    if(badge){
      const up = pct >= 0;
      badge.textContent = (up?"+":"") + pct + "%";
      badge.className = "fc-badge " + (up ? "fc-badge--up":"fc-badge--down");
      if(!up){ badge.style.background="rgba(214,69,69,.1)"; badge.style.color="#d64545"; }
      else { badge.style.background=""; badge.style.color=""; }
    }
  }, 1800);
})();

/* ============================================================
   HERO TICKER + STATIC MOVER DATA
   ============================================================ */
const TICKER_DATA = [
  {sym:"NIFTY 50", val:"24,812.35", chg:"+0.52%", up:true},
  {sym:"SENSEX", val:"81,559.54", chg:"+0.38%", up:true},
  {sym:"BANK NIFTY", val:"51,247.90", chg:"-0.16%", up:false},
  {sym:"RELIANCE", val:"2,940.15", chg:"+1.24%", up:true},
  {sym:"TCS", val:"4,102.60", chg:"+2.14%", up:true},
  {sym:"HDFCBANK", val:"1,678.20", chg:"-0.31%", up:false},
  {sym:"INFY", val:"1,894.75", chg:"+1.44%", up:true},
  {sym:"ICICIBANK", val:"1,241.05", chg:"+0.62%", up:true},
  {sym:"USDINR", val:"83.42", chg:"-0.08%", up:false},
  {sym:"GOLD", val:"71,240", chg:"+0.44%", up:true},
];
function buildTicker(container, dataset){
  if(!container) return;
  const html = dataset.map(d=>`<span class="ticker-item"><b>${d.sym}</b> ${d.val} <span class="${d.up?"up":"down"}">${d.chg}</span></span>`).join("");
  container.innerHTML = html + html; // duplicate for seamless loop
}
buildTicker($("#heroTickerTrack"), TICKER_DATA);

(function(){
  const stamps=$$(".stamp");
  const obs=new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        setTimeout(()=>e.target.classList.add("stamped"), i*120);
        obs.unobserve(e.target);
      }
    });
  },{threshold:.4});
  stamps.forEach(s=>obs.observe(s));
})();

/* ============================================================
   SEC-02 — LIVING LEDGER HERO
   ============================================================ */
(function ledgerHero(){
  const canvas=$("#ledgerCanvas"), h1=$("#ledgerH1");
  if(!canvas) return;
  const ctx=canvas.getContext("2d");
  const dpr=Math.min(devicePixelRatio||1,2);
  function resize(){
    canvas.width=canvas.offsetWidth*dpr; canvas.height=canvas.offsetHeight*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize(); window.addEventListener("resize", resize);

  const SYMS=["RELIANCE","TCS","HDFCBANK","INFY","ICICIBANK","SBIN","ITC","WIPRO","NIFTY","SENSEX","MTF","ALGO"];
  const cols=[];
  const colCount = 26;
  for(let i=0;i<colCount;i++){
    cols.push({ x:i*(1/colCount), y:rand(0,1), speed:rand(0.00025,0.0009), items:Array.from({length:14},()=>({sym:SYMS[Math.floor(rand(0,SYMS.length))], up:Math.random()>0.5, price:rand(80,4000).toFixed(1)})) });
  }
  let mx=0.5,my=0.3;
  window.addEventListener("mousemove", e=>{ mx=e.clientX/innerWidth; my=e.clientY/innerHeight; });

  function draw(){
    const W=canvas.offsetWidth, H=canvas.offsetHeight;
    ctx.clearRect(0,0,W,H);
    ctx.font="11px "+getComputedStyle(document.body).getPropertyValue("--font-mono");
    cols.forEach(col=>{
      col.y -= col.speed;
      if(col.y < -0.5) col.y = 1.2;
      const cx = col.x*W;
      const dist = Math.hypot(cx-mx*W, my*H - col.y*H*0.5);
      const glow = clamp(1-dist/260, 0, 1);
      col.items.forEach((it,idx)=>{
        const yy = (col.y*H) + idx*40;
        if(yy<-20||yy>H+20) return;
        const alpha = 0.10 + glow*0.55;
        ctx.fillStyle = it.up ? `rgba(8,117,59,${alpha})` : `rgba(194,74,63,${alpha})`;
        ctx.fillText(it.sym+" "+it.price, cx, yy);
      });
    });
    if(!reduceMotion) requestAnimationFrame(draw);
  }
  draw();

  // headline reads as "made of moving data": animated gradient text fill,
  // sitting directly over the live tick-field canvas behind it.
  // h1.classList.add("masked");
})();


// (function heroMesh(){
//   const canvas = $("#heroMesh");
//   if(!canvas) return;
//   const ctx = canvas.getContext("2d");
//   let w,h;
//   function resize(){
//     w = canvas.width = canvas.offsetWidth * devicePixelRatio;
//     h = canvas.height = canvas.offsetHeight * devicePixelRatio;
//   }
//   resize(); window.addEventListener("resize", resize);

//   let mx = 0.5, my = 0.3;
//   window.addEventListener("mousemove", e=>{
//     mx = e.clientX/innerWidth; my = e.clientY/innerHeight;
//   });

//   const blobs = [
//     {x:0.2,y:0.3,r:0.32,c:"rgba(8,117,59,0.10)"},
//     {x:0.8,y:0.25,r:0.28,c:"rgba(155,206,22,0.12)"},
//     {x:0.5,y:0.7,r:0.30,c:"rgba(8,117,59,0.07)"},
//   ];
//   let t=0;
//   function draw(){
//     t += 0.004;
//     ctx.clearRect(0,0,w,h);
//     blobs.forEach((b,i)=>{
//       const px = (b.x + Math.sin(t+i)*0.03 + (mx-0.5)*0.06) * w;
//       const py = (b.y + Math.cos(t+i)*0.03 + (my-0.5)*0.06) * h;
//       const grad = ctx.createRadialGradient(px,py,0,px,py,b.r*w);
//       grad.addColorStop(0,b.c);
//       grad.addColorStop(1,"rgba(255,255,255,0)");
//       ctx.fillStyle = grad;
//       ctx.beginPath(); ctx.arc(px,py,b.r*w,0,Math.PI*2); ctx.fill();
//     });
//     requestAnimationFrame(draw);
//   }
//   draw();
// })();




/* ---------------- Growth counter + gauge ---------------- */
function animateCount(el, target, duration=1800, prefix="", suffix=""){
  const start = performance.now();
  function step(now){
    const p = Math.min((now-start)/duration, 1);
    const eased = 1 - Math.pow(1-p, 3);
    el.textContent = prefix + Math.floor(eased*target).toLocaleString("en-IN") + suffix;
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const growthEl = $("#growthCounter");
if(growthEl){
  const growthObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ animateCount(growthEl, 284650); growthObs.disconnect(); }
    });
  });
  growthObs.observe(growthEl);
}
const gaugeFill = $("#gaugeFill");
if(gaugeFill){
  const gaugeObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ gaugeFill.style.strokeDashoffset = 35; gaugeObs.disconnect(); } });
  });
  gaugeObs.observe(gaugeFill);
}




/* ============================================================
   SEC-03 — STAMP LINE
   ============================================================ */
(function(){
  const stamps=$$(".stamp");
  const obs=new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        setTimeout(()=>e.target.classList.add("stamped"), i*120);
        obs.unobserve(e.target);
      }
    });
  },{threshold:.4});
  stamps.forEach(s=>obs.observe(s));
})();




/* ============================================================
   SEC-04 — FLOOR WALL (volume-weighted mosaic)
   ============================================================ */
const FLOOR_DATA=[
  {sym:"NIFTY 50",val:24812,chg:0.52,size:3},
  {sym:"SENSEX",val:81559,chg:0.38,size:3},
  {sym:"BANK NIFTY",val:51247,chg:-0.16,size:2},
  {sym:"RELIANCE",chg:1.24,size:2},
  {sym:"TCS",chg:2.14,size:2},
  {sym:"ADANIENT",chg:4.82,size:2},
  {sym:"TATASTEEL",chg:3.61,size:1},
  {sym:"BAJFINANCE",chg:2.94,size:1},
  {sym:"HDFCBANK",chg:-0.31,size:1},
  {sym:"COALINDIA",chg:-3.28,size:1},
  {sym:"ONGC",chg:-2.65,size:1},
  {sym:"WIPRO",chg:2.40,size:1},
  {sym:"ITC",chg:-1.35,size:1},
  {sym:"INFY",chg:1.44,size:1},
];
function heatColor(chg){
  const abs=Math.min(Math.abs(chg)/5,1);
  if(chg>=0) return `rgba(8,117,59,${0.55+abs*0.4})`;
  return `rgba(194,74,63,${0.55+abs*0.4})`;
}
function buildSpark(up){
  const pts=[]; let y=up?30:10;
  for(let x=0;x<=100;x+=10){ y+= up? rand(-4,2): rand(-2,4); y=clamp(y,4,26); pts.push(x+","+y); }
  return pts.join(" ");
}
const floorWall=$("#floorWall");
if(floorWall){
  const sizeSpan={3:{col:"span 5",row:"span 3"},2:{col:"span 4",row:"span 2"},1:{col:"span 3",row:"span 2"}};
  floorWall.innerHTML = FLOOR_DATA.map(d=>{
    const s=sizeSpan[d.size];
    const up=d.chg>=0;
    return `<div class="fw-tile" style="grid-column:${s.col};grid-row:${s.row};background:${heatColor(d.chg)}">
      <span class="fw-sym" style="font-size:${d.size===3?18:d.size===2?14:12}px">${d.sym}</span>
      <svg viewBox="0 0 100 34" class="fw-spark" preserveAspectRatio="none"><polyline points="${buildSpark(up)}"/></svg>
      <span class="fw-chg">${up?"+":""}${d.chg.toFixed(2)}%</span>
    </div>`;
  }).join("");
}

/* ============================================================
   SEC-05 — MARGIN NOTE (AI)
   ============================================================ */
const MARGIN_NOTES=[
  {t:"09:31",n:"IT sector +2.4% on 3 consecutive up days — INFY and TCS leading."},
  {t:"09:44",n:"BANK NIFTY lagging the broader index; HDFCBANK down on profit booking."},
  {t:"10:02",n:"ADANIENT volume 3.2x its 20-day average — largest mover on the floor right now."},
];
const marginNotes=$("#marginNotes");
if(marginNotes){ marginNotes.innerHTML = MARGIN_NOTES.map(m=>`<div class="margin-note"><span class="mn-time mono">${m.t}</span>${m.n}</div>`).join(""); }

const marginExpand=$("#marginExpand"), marginChat=$("#marginChat");
if(marginExpand){ marginExpand.addEventListener("click", ()=>{ marginChat.classList.toggle("open"); marginExpand.textContent = marginChat.classList.contains("open") ? "Hide ←" : "Ask about this →"; }); }

const aiChat=$("#aiChat");
$$(".ai-chip").forEach(chip=>{
  chip.addEventListener("click", ()=>{
    const u=document.createElement("div"); u.className="ai-bubble ai-bubble--user"; u.textContent=chip.textContent;
    aiChat.appendChild(u);
    setTimeout(()=>{
      const b=document.createElement("div"); b.className="ai-bubble ai-bubble--reply"; b.textContent=chip.dataset.reply;
      aiChat.appendChild(b); b.scrollIntoView({behavior:"smooth", block:"nearest"});
    }, 450);
  });
});

/* ============================================================
   SEC-07 — THE LOOM: book-page swipe — a real 3D page-flip stack.
   Now scroll-driven: pages flip in 3D dynamically as you scroll down
   the page. Responsive lerp interpolation is used to smooth out movement.
   ============================================================ */
(function(){
  const section = $("#algo");
  const pin = $("#algoPin");
  const stage = $("#bookStage");
  const dotsWrap = $("#bookDots");
  const prevBtn = $("#bookPrev");
  const nextBtn = $("#bookNext");
  if (!section || !stage || !dotsWrap) return;

  const cards = $$(".book-card", stage);
  const n = cards.length;

  let mobileActiveIdx = 0;

  // Cache static layout offset to prevent sticky offsetTop shift bugs on scroll
  let pinOffset = 0;
  function updatePinOffset() {
    if (!pin) return;
    pin.style.setProperty("position", "static", "important");
    pinOffset = pin.offsetTop;
    pin.style.removeProperty("position");
  }
  updatePinOffset();

  // Clear existing buttons and render dots
  dotsWrap.innerHTML = "";
  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "book-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Go to layer " + (i + 1));
    dot.addEventListener("click", () => {
      if (window.innerWidth < 768) {
        mobileActiveIdx = i;
        renderMobile(mobileActiveIdx);
        return;
      }
      // Map clicking a dot to scrolling directly to the right range
      let targetP = 0;
      if (i > 0) {
        if (i === n - 1) {
          targetP = 1;
        } else {
          targetP = (i - 0.5) / (n - 1);
        }
      }
      const stickyTop = parseInt(window.getComputedStyle(pin).top) || 0;
      const pinHeight = pin ? pin.offsetHeight : 0;
      const startScroll = pinOffset - stickyTop;
      const r = section.getBoundingClientRect();
      const totalStickyScroll = r.height - pinHeight - pinOffset;
      const scrollPos = window.scrollY + r.top + startScroll + targetP * totalStickyScroll;
      window.scrollTo({ top: scrollPos, behavior: "smooth" });
    });
    dotsWrap.appendChild(dot);
  });
  const dots = $$(".book-dot", dotsWrap);

  // Apply scroll-driven layout configuration
  cards.forEach((card, i) => {
    card.classList.add("scroll-driven");
    card.style.zIndex = n - i;

    // Dynamically insert a blank page back face if not present
    if (!card.querySelector(".page-back")) {
      const back = document.createElement("div");
      back.className = "page-back";
      card.appendChild(back);
    }
  });

  let targetProgress = 0;
  let currentProgress = 0;
  let rafId = null;

  function renderPages(p) {
    const numFlips = n - 1;
    for (let i = 0; i < n; i++) {
      // Ensure page shade element exists
      let shade = cards[i].querySelector(".page-shade");
      if (!shade) {
        shade = document.createElement("div");
        shade.className = "page-shade";
        cards[i].appendChild(shade);
      }

      // Default shade state (hidden)
      shade.style.opacity = 0;

      if (i < numFlips) {
        const start = i / numFlips;
        const end = (i + 1) / numFlips;
        const localP = clamp((p - start) / (end - start), 0, 1);

        // 3D curved transform calculations
        // 1. Base rotation from 0 to -178 degrees
        const rotY = localP * -178;

        // 2. translateZ to lift the page off the stack as it turns (peak depth in the middle)
        const maxZ = 120; // Maximum Z lift in pixels
        const transZ = Math.sin(localP * Math.PI) * maxZ;

        // 3. skewY to simulate paper bending/curl (peaks at 0.25 and 0.75 progress)
        const maxSkew = 8; // Max skew angle in degrees
        const skewY = Math.sin(localP * Math.PI * 2) * maxSkew;

        // 4. scaleX to simulate the horizontal width contraction of the curved page
        const maxScaleShrink = 0.12; // Shrink up to 12% width at the peak
        const scaleX = 1 - Math.sin(localP * Math.PI) * maxScaleShrink;

        cards[i].style.transform = `rotateY(${rotY}deg) translateZ(${transZ}px) skewY(${skewY}deg) scaleX(${scaleX})`;

        // Dynamic zIndex stacking order based on flip threshold
        if (localP > 0.5) {
          cards[i].style.zIndex = i + 1; // landing stack order on the left page
        } else {
          cards[i].style.zIndex = n - i; // starting stack order on the right page
        }

        // Hide card after it has folded past 150 degrees of movement to the left
        if (Math.abs(rotY) > 150) {
          cards[i].style.opacity = 0;
          cards[i].style.visibility = "hidden";
        } else {
          cards[i].style.opacity = 1;
          cards[i].style.visibility = "visible";
        }

        // Crease shadow on the page itself as it flips
        if (localP > 0 && localP < 1) {
          shade.style.opacity = Math.sin(localP * Math.PI) * 0.4;
          shade.style.background = "linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0) 60%)";
        }
      } else {
        // The last card remains flat
        cards[i].style.transform = "";
        cards[i].style.opacity = 1;
        cards[i].style.visibility = "visible";
        cards[i].style.zIndex = 1;
      }

      // Cast shadow on the next card below from the card above it turning
      if (i > 0) {
        const startPrev = (i - 1) / numFlips;
        const endPrev = i / numFlips;
        const localPPrev = clamp((p - startPrev) / (endPrev - startPrev), 0, 1);

        if (localPPrev > 0 && localPPrev < 1) {
          const rotYPrev = localPPrev * -178;
          shade.style.opacity = Math.sin(localPPrev * Math.PI) * 0.35;
          const shadowExtent = 20 + localPPrev * 40; // 20% to 60% width shadow spread
          shade.style.background = `linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) ${shadowExtent}%, rgba(0,0,0,0) 100%)`;
        }
      }
    }

    const visibleIdx = Math.min(n - 1, Math.max(0, Math.floor((p + 0.005) * numFlips + 0.5)));
    dots.forEach((d, i) => d.classList.toggle("active", i === visibleIdx));
    cards.forEach((card, i) => {
      card.style.pointerEvents = (i === visibleIdx) ? "auto" : "none";
    });
  }

  function renderMobile(activeIdx) {
    cards.forEach((card, i) => {
      card.classList.remove("scroll-driven", "mobile-active");
      card.style.zIndex = n - i;
      // Clear any inline transform/opacity/visibility set by desktop scroll mode
      card.style.transform = "";
      card.style.opacity = "";
      card.style.visibility = "";
    });
    // Mark active card so CSS makes it position:relative and visible
    if (cards[activeIdx]) cards[activeIdx].classList.add("mobile-active");
    dots.forEach((d, i) => d.classList.toggle("active", i === activeIdx));

    // Drive stage height from the active card's scroll height so section
    // expands naturally and doesn't clip/overlap the next section on mobile
    if (stage && cards[activeIdx]) {
      const activeCard = cards[activeIdx];
      // Temporarily make all cards visible to measure heights accurately
      stage.style.height = "auto";
      // Use scrollHeight of the active card to get full content height
      requestAnimationFrame(() => {
        const h = activeCard.scrollHeight || activeCard.offsetHeight;
        stage.style.height = h + "px";
      });
    }
  }

  function updateAnimation() {
    currentProgress += (targetProgress - currentProgress) * 0.15;
    if (Math.abs(targetProgress - currentProgress) < 0.0002) {
      currentProgress = targetProgress;
      renderPages(currentProgress);
      rafId = null;
    } else {
      renderPages(currentProgress);
      rafId = requestAnimationFrame(updateAnimation);
    }
  }

  function onScroll() {
    if (window.innerWidth < 768) return;
    const r = section.getBoundingClientRect();
    const stickyTop = parseInt(window.getComputedStyle(pin).top) || 0;
    const pinHeight = pin ? pin.offsetHeight : 0;
    const startScroll = pinOffset - stickyTop;
    const totalStickyScroll = r.height - pinHeight - pinOffset;
    if (totalStickyScroll <= 0) return;
    targetProgress = clamp((-r.top - startScroll) / totalStickyScroll, 0, 1);
    if (rafId === null) {
      rafId = requestAnimationFrame(updateAnimation);
    }
  }

  // Mobile arrow buttons click handlers
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (window.innerWidth < 768 && mobileActiveIdx > 0) {
        mobileActiveIdx--;
        renderMobile(mobileActiveIdx);
      }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (window.innerWidth < 768 && mobileActiveIdx < n - 1) {
        mobileActiveIdx++;
        renderMobile(mobileActiveIdx);
      }
    });
  }

  // Swipe support for mobile
  let touchStartX = 0;
  let touchStartY = 0;
  stage.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  stage.addEventListener("touchend", (e) => {
    if (window.innerWidth >= 768) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        if (mobileActiveIdx < n - 1) {
          mobileActiveIdx++;
          renderMobile(mobileActiveIdx);
        }
      } else {
        if (mobileActiveIdx > 0) {
          mobileActiveIdx--;
          renderMobile(mobileActiveIdx);
        }
      }
    }
  }, { passive: true });

  // Handle Resize and Orientation Change Mode Switching
  let lastWasMobile = window.innerWidth < 768;
  function handleResize() {
    updatePinOffset();
    const currentMobile = window.innerWidth < 768;
    if (currentMobile !== lastWasMobile) {
      lastWasMobile = currentMobile;
      if (currentMobile) {
        mobileActiveIdx = 0;
        renderMobile(0);
      } else {
        // Reset mobile state before switching back to desktop
        cards.forEach(card => {
          card.classList.remove("mobile-active");
          card.classList.add("scroll-driven");
          card.style.transform = "";
          card.style.opacity = "";
          card.style.pointerEvents = "";
        });
        stage.style.height = "";
        targetProgress = 0;
        currentProgress = 0;
        onScroll();
      }
    }
  }
  window.addEventListener("resize", handleResize);

  // Initialize correct mode on load
  if (window.innerWidth < 768) {
    renderMobile(0);
  } else {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Number animation observer
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount($("#loomPnl"), 284650, 2000);
        obs.disconnect();
      }
    });
  });
  obs.observe(stage);
})();

function animateCount(el,target,duration=1600,prefix="",suffix=""){
  if(!el) return;
  const start=performance.now();
  function step(now){
    const p=Math.min((now-start)/duration,1);
    const eased=1-Math.pow(1-p,3);
    el.textContent=prefix+Math.floor(eased*target).toLocaleString("en-IN")+suffix;
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ============================================================
   SEC-13 — NEWSROOM (ticker + IPO + Broadcast Desk content)
   ============================================================ */
const NEWSROOM_TICKER=[
  "NIFTY 24,812 +0.52%","SENSEX 81,559 +0.38%","Tech Giant India IPO — lot size 45 shares",
  "RBI holds repo rate at 6.5%","Green Energy Corp IPO opens 12 Jul","FIIs net buyers today",
  "Nifty option chain: heavy call writing at 24,300","Gold at fresh record highs",
];
const newsroomTicker=$("#newsroomTicker");
if(newsroomTicker){
  const html = NEWSROOM_TICKER.map(t=>`<span><b>●</b>${t}</span>`).join("");
  newsroomTicker.innerHTML = html + html;
}

const NEWS=[
  {tag:"BREAKING",headline:"RBI Policy Decision Implications",time:"08 Jul · 09:30 AM",source:"Interest rates held steady. High impact on banking sectors and market liquidity."},
  {tag:"DERIVATIVES",headline:"Nifty Option Chain Analysis",time:"08 Jul · 08:15 AM",source:"Heavy call writing seen at 24,300 level. Range-bound expiry expected today."},
  {tag:"TECHNICALS",headline:"Daily Technical Strategy Outlook",time:"07 Jul · 04:30 PM",source:"Support for NIFTY at 24,050. Key breakout levels and stock indicators identified."},
];
const rundown=$("#broadcastRundown");
if(rundown){
  rundown.innerHTML = NEWS.map((n,i)=>`<div class="bc-row ${i===0?"active":""}" data-i="${i}"><span class="bc-idx mono">0${i+1}</span><div class="bc-row-body"><h5>${n.headline}</h5><small>${n.tag} · ${n.time}</small></div></div>`).join("");
  $$(".bc-row").forEach(row=>{
    row.addEventListener("mouseenter", ()=>{
      const n=NEWS[+row.dataset.i];
      $$(".bc-row").forEach(r=>r.classList.remove("active"));
      row.classList.add("active");
      const feat=$("#broadcastFeatured");
      feat.style.opacity=0;
      setTimeout(()=>{
        $("#bcHeadline").textContent=n.headline;
        $("#bcTime").textContent=n.time;
        $("#bcSource").textContent=n.source;
        feat.querySelector(".bc-tag").innerHTML = n.tag+' <span class="dot dot--live"></span>';
        feat.style.opacity=1;
      },200);
    });
  });
}

/* ============================================================
   SEC-14 — UNFOLD SEQUENCE
   ============================================================ */
(function(){
  const section=$(".unfold-section"), phone=$("#unfoldPhone"), screen=$(".phone-screen");
  if(!section) return;
  function onScroll(){
    const r=section.getBoundingClientRect();
    const total=r.height-window.innerHeight;
    const progress=clamp(-r.top/total,0,1);
    const stage=clamp(progress*2.2,0,1);
    const rotY = -90 + stage*90;
    const scale = 0.6 + stage*0.4;
    phone.style.transform = `rotateY(${rotY}deg) scale(${scale})`;
    screen.style.opacity = clamp((progress-0.4)*3,0,1);
  }
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  const dl=$("#appDownloads");
  const obs=new IntersectionObserver(entries=>{ entries.forEach(e=>{ if(e.isIntersecting){ animateCount(dl,250000,1800,"","+"); obs.disconnect(); } }); });
  if(dl) obs.observe(dl);
})();

/* ============================================================
   SEC-15 — CONSTELLATION
   ============================================================ */
(function(){
  const canvas=$("#constellationCanvas");
  if(!canvas) return;
  const ctx=canvas.getContext("2d");
  const dpr=Math.min(devicePixelRatio||1,2);
  function resize(){ canvas.width=canvas.offsetWidth*dpr; canvas.height=canvas.offsetHeight*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }
  resize(); window.addEventListener("resize",resize);

  const REVIEWS=[
    {n:"Priya Shah",r:"Clean interface, blazing-fast order execution.",stars:5},
    {n:"Aman Verma",r:"The AI insights actually help me time entries better.",stars:5},
    {n:"Kavita Mehta",r:"Algo trading changed how I invest — hands-off now.",stars:5},
    {n:"Sanjay Patel",r:"Support team is responsive, platform never lags.",stars:4},
    {n:"Neha Joshi",r:"Mobile app is smoother than bigger brokers' apps.",stars:5},
    {n:"Vikram Rao",r:"MTF + algo strategies has been a game changer.",stars:5},
    {n:"Rohan Kapadia",r:"Switched from a legacy broker — best decision.",stars:5},
    {n:"Ishita Desai",r:"Onboarding was fast, KYC done in 10 minutes.",stars:4},
    {n:"Manav Shah",r:"Great research reports, very actionable.",stars:5},
    {n:"Ritu Singh",r:"Reliable during high-volatility sessions.",stars:5},
  ];
  let nodes=[];
  function buildNodes(){
    const W=canvas.offsetWidth, H=canvas.offsetHeight, cx=W/2, cy=H/2;
    nodes = REVIEWS.map((rv,i)=>{
      const angle = (i/REVIEWS.length)*Math.PI*2 + rand(-0.2,0.2);
      const dist = rand(H*0.22, H*0.42);
      return { ...rv, x:cx+Math.cos(angle)*dist, y:cy+Math.sin(angle)*dist, baseX:cx+Math.cos(angle)*dist, baseY:cy+Math.sin(angle)*dist, phase:rand(0,Math.PI*2), r:4+rv.stars*1.6 };
    });
  }
  buildNodes(); window.addEventListener("resize", buildNodes);

  let hovered=null;
  canvas.addEventListener("mousemove", e=>{
    const r=canvas.getBoundingClientRect();
    const mx=e.clientX-r.left, my=e.clientY-r.top;
    hovered = nodes.find(n=>Math.hypot(n.x-mx,n.y-my)<n.r+6) || null;
    const tip=$("#constellationTooltip");
    if(hovered){
      tip.innerHTML = `<b>${hovered.n}</b><span class="ct-stars">${"★".repeat(hovered.stars)}${"☆".repeat(5-hovered.stars)}</span><p style="margin-top:6px">"${hovered.r}"</p>`;
      tip.style.left=e.clientX+16+"px"; tip.style.top=e.clientY+16+"px";
      tip.classList.add("show");
    } else { tip.classList.remove("show"); }
  });

  function draw(){
    const W=canvas.offsetWidth, H=canvas.offsetHeight, cx=W/2, cy=H/2;
    ctx.clearRect(0,0,W,H);
    const t=Date.now()/1000;
    // center node
    ctx.fillStyle="#08753B";
    ctx.beginPath(); ctx.arc(cx,cy,10,0,Math.PI*2); ctx.fill();
    nodes.forEach(n=>{
      n.x = n.baseX + Math.sin(t*0.5+n.phase)*6;
      n.y = n.baseY + Math.cos(t*0.4+n.phase)*6;
      const isHover = hovered===n;
      ctx.strokeStyle = isHover ? "rgba(8,117,59,0.55)" : "rgba(13,33,24,0.12)";
      ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(n.x,n.y); ctx.stroke();
      const alpha = 0.45+ (n.stars/5)*0.5;
      ctx.fillStyle = isHover ? "#08753B" : `rgba(8,117,59,${alpha})`;
      ctx.beginPath(); ctx.arc(n.x,n.y,isHover?n.r+2:n.r,0,Math.PI*2); ctx.fill();
    });
    if(!reduceMotion) requestAnimationFrame(draw); else setTimeout(draw,600);
  }
  draw();
})();

/* ============================================================
   SEC-16 — CORE SAMPLE (drill marker)
   ============================================================ */
(function(){
  const section=$(".core-sample"), marker=$("#coreMarker");
  if(!section) return;
  function onScroll(){
    const r=section.getBoundingClientRect();
    const progress=clamp((window.innerHeight*0.5 - r.top)/r.height,0,1);
    marker.style.top = (progress*r.height)+"px";
  }
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();
})();

/* ============================================================
   SEC-17 — DESK QUERY (FAQ terminal)
   ============================================================ */
const DQ={
  account:[
    {q:"How do I open a demat account?",a:"Open online in under 10 minutes using PAN, Aadhaar and a selfie for e-KYC verification."},
    {q:"Is there a minimum balance required?",a:"No minimum balance is required to maintain your trading and demat account."},
    {q:"Can NRIs open an account?",a:"Yes — dedicated NRI investment services with PIS-linked accounts are available."},
  ],
  trading:[
    {q:"Which exchanges can I trade on?",a:"NSE, BSE and MCX for equity, derivatives, currency and commodity trading."},
    {q:"Is there a desktop terminal?",a:"Yes, alongside web and mobile apps, a dedicated desktop terminal is available."},
    {q:"What are trading hours?",a:"9:15 AM to 3:30 PM IST, Monday to Friday, excluding market holidays."},
  ],
  algo:[
    {q:"Is Retail Algo Trading really free?",a:"Yes — completely free for all clients, no subscription or setup fees."},
    {q:"Do I need coding knowledge?",a:"No. Choose from 20+ pre-built strategies or use the visual rule builder."},
    {q:"Can I backtest before going live?",a:"Yes — backtest against up to 10 years of historical tick data first."},
  ],
  charges:[
    {q:"What is the brokerage on equity delivery?",a:"Zero-brokerage on delivery. Intraday and F&O carry a flat per-order fee."},
    {q:"Are there hidden charges?",a:"No — STT, exchange fees, GST and stamp duty are shown before every order."},
    {q:"Does MTF have interest charges?",a:"Yes, a competitive daily rate, shown clearly in your order window."},
  ],
};
const dqChips=$("#dqChips"), dqOutput=$("#dqOutput");
function renderDQ(cat){
  dqChips.innerHTML = DQ[cat].map(item=>`<button class="dq-chip" data-a="${item.a.replace(/"/g,'&quot;')}">${item.q}</button>`).join("");
  $$(".dq-chip", dqChips).forEach(chip=>{
    chip.addEventListener("click", ()=>{
      const echo=document.createElement("div"); echo.className="dq-echo"; echo.textContent="> "+chip.textContent;
      const ans=document.createElement("div"); ans.className="dq-answer"; ans.textContent="";
      dqOutput.prepend(ans); dqOutput.prepend(echo);
      const full=chip.dataset.a;
      if(reduceMotion){ ans.textContent=full; return; }
      let i=0;
      const iv=setInterval(()=>{ ans.textContent=full.slice(0,i++); if(i>full.length) clearInterval(iv); }, Math.max(8, 900/full.length));
    });
  });
}
if(dqChips){
  renderDQ("account");
  $$(".dq-tab").forEach(tab=>{
    tab.addEventListener("click", ()=>{
      $$(".dq-tab").forEach(t=>t.classList.remove("active"));
      tab.classList.add("active");
      renderDQ(tab.dataset.cat);
    });
  });
}

/* ============================================================
   SEC-07b — EXPERIENCE SUITE (merged from marfatia-1)
   ============================================================ */
(function(){
  document.querySelectorAll(".suite-wrap").forEach(suite => {

    const menuButtons = suite.querySelectorAll(".suite-menu-btn");
    const panels = suite.querySelectorAll(".suite-panel");

    menuButtons.forEach(btn => {
        btn.addEventListener("click", () => {

            menuButtons.forEach(b => b.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));

            btn.classList.add("active");

            const panel = suite.querySelector(`#${btn.dataset.feature}`);
            if (panel) panel.classList.add("active");

            if (btn.dataset.feature === "feat-options") {
                drawOptionsStrategy();
            }
        });
    });

});

  // Feature 1: MTF leverage calculator
  const mtfSlider=$("#mtfLeverageSlider"), mtfOut=$("#mtfOutput"), mtfVal=$("#mtfLeverageVal");
  if(mtfSlider && mtfOut){
    mtfSlider.addEventListener("input", e=>{
      const leverage=parseInt(e.target.value);
      if(mtfVal) mtfVal.textContent=leverage+"X";
      mtfOut.textContent="₹"+(25000*leverage).toLocaleString("en-IN");
    });
  }

  // Feature 3: SIP compound wealth calculator
  const sipAmt=$("#sipAmountSlider"), sipDuration=$("#sipDurationSlider"), sipOut=$("#sipOutput");
  function calculateSip(){
    if(!sipAmt || !sipDuration || !sipOut) return;
    const monthly=parseInt(sipAmt.value), years=parseInt(sipDuration.value);
    const i=0.14/12, months=years*12;
    const wealth=monthly*((Math.pow(1+i,months)-1)/i)*(1+i);
    sipOut.textContent="₹"+Math.round(wealth).toLocaleString("en-IN");
  }
  if(sipAmt && sipDuration){
    sipAmt.addEventListener("input", e=>{
      $("#sipAmountVal").textContent="₹"+parseInt(e.target.value).toLocaleString("en-IN");
      calculateSip();
    });
    sipDuration.addEventListener("input", e=>{
      $("#sipDurationVal").textContent=e.target.value+" Yrs";
      calculateSip();
    });
  }

  // Feature 5: options strategy payoff drawer
  function drawOptionsStrategy(){
    const canvas=$("#payoffCanvas");
    if(!canvas || !canvas.parentElement.clientWidth) return;
    const ctx=canvas.getContext("2d");
    canvas.width=canvas.parentElement.clientWidth - 56; // widget padding
    canvas.height=180;
    const w=canvas.width, h=canvas.height;
    ctx.clearRect(0,0,w,h);

    // zero line
    ctx.strokeStyle="rgba(8,117,59,0.2)";
    ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(0,h/2); ctx.lineTo(w,h/2); ctx.stroke();

    const active=$(".strategy-pill.active");
    const type=active ? active.dataset.strategy : "bull";

    ctx.strokeStyle="#08753B";
    ctx.lineWidth=3;
    ctx.lineJoin="round";
    ctx.beginPath();
    if(type==="bull"){
      ctx.moveTo(10,h-35); ctx.lineTo(w*0.4,h-35); ctx.lineTo(w*0.7,35); ctx.lineTo(w-10,35);
    } else if(type==="bear"){
      ctx.moveTo(10,35); ctx.lineTo(w*0.3,35); ctx.lineTo(w*0.6,h-35); ctx.lineTo(w-10,h-35);
    } else {
      ctx.moveTo(10,20); ctx.lineTo(w/2,h-30); ctx.lineTo(w-10,20);
    }
    ctx.stroke();

    // shaded profit region
    ctx.fillStyle="rgba(155,206,22,0.12)";
    ctx.beginPath();
    if(type==="bull"){
      ctx.moveTo(w*0.55,h/2); ctx.lineTo(w*0.7,35); ctx.lineTo(w,35); ctx.lineTo(w,h/2);
    } else if(type==="bear"){
      ctx.moveTo(0,h/2); ctx.lineTo(0,35); ctx.lineTo(w*0.45,35); ctx.lineTo(w*0.45,h/2);
    } else {
      ctx.moveTo(0,20); ctx.lineTo(w*0.2,h/2); ctx.lineTo(0,h/2);
    }
    ctx.closePath(); ctx.fill();
  }
  $$(".strategy-pill").forEach(pill=>{
    pill.addEventListener("click", ()=>{
      $$(".strategy-pill").forEach(p=>p.classList.remove("active"));
      pill.classList.add("active");
      drawOptionsStrategy();
    });
  });
  window.addEventListener("resize", ()=>{
    if($("#feat-options") && $("#feat-options").classList.contains("active")) drawOptionsStrategy();
  });
  drawOptionsStrategy();
})();

/* ============================================================
   SEC-15 — TESTIMONIALS: TRUSTED BY INVESTORS (merged from marfatia-2)
   ============================================================ */
(function(){
  const track1=$("#reviewTrack1"), track2=$("#reviewTrack2");
  if(!track1 || !track2) return;
  const TESTI_REVIEWS=[
    {n:"Priya Shah", r:"Clean interface, blazing-fast order execution. Best broker I've used.", s:"★★★★★"},
    {n:"Aman Verma", r:"The AI insights actually help me time entries better.", s:"★★★★★"},
    {n:"Kavita Mehta", r:"Algo trading changed how I invest — completely hands-off now.", s:"★★★★★"},
    {n:"Sanjay Patel", r:"Support team is responsive, platform never lags during volatile sessions.", s:"★★★★☆"},
    {n:"Neha Joshi", r:"Mobile app is smoother than apps from bigger brokers.", s:"★★★★★"},
    {n:"Vikram Rao", r:"MTF leverage combined with algo strategies has been a game changer.", s:"★★★★★"},
    {n:"Ishita Desai", r:"Onboarding was fast, KYC done in 10 minutes.", s:"★★★★☆"},
    {n:"Manav Shah", r:"Great research reports, very actionable ideas every week.", s:"★★★★★"},
  ];
  function buildReviews(container, list){
    const html=list.map(r=>`<div class="review-card"><div class="review-stars">${r.s}</div><p>"${r.r}"</p><div class="review-name">${r.n}</div></div>`).join("");
    container.innerHTML=html+html; // duplicate for seamless loop
  }
  buildReviews(track1, TESTI_REVIEWS.slice(0,4));
  buildReviews(track2, TESTI_REVIEWS.slice(4));
})();

/* ============================================================
   SEC-14c — SOCIAL LIVE FEED: Facebook, Instagram and Pinterest
   rendered together in one combined section (three columns, always visible).
   NOTE: mock data below — swap the fetch layer for each platform's real
   Graph API / feed endpoint once API credentials exist; the render function
   (buildColumn) can stay as-is, it just needs live post arrays.
   ============================================================ */
(function(){
  const columns=$$(".social-column");
  if(!columns.length) return;
  const icon={
    facebook:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5H16l.4-3H13.5V8.4c0-.9.2-1.5 1.5-1.5H16.5V4.2C16.2 4.2 15.2 4 14 4c-2.4 0-4 1.5-4 4.1V10.5H7.5v3H10V21h3.5z"/></svg>',
    instagram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3.4"/></svg>',
    pinterest:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.6 2 3 5.9 3 10.3c0 2.6 1.4 4.7 3.5 5.5.3.1.6-.1.7-.4l.3-1.1c.1-.3 0-.5-.2-.7-.5-.6-.9-1.5-.9-2.7 0-3.5 2.6-6.5 6.8-6.5 3.7 0 5.8 2.3 5.8 5.3 0 4-1.7 7.3-4.4 7.3-1.4 0-2.5-1.2-2.1-2.6.4-1.7 1.2-3.7 1.2-5 0-1.1-.6-2-1.8-2-1.5 0-2.6 1.5-2.6 3.6 0 1.3.4 2.2.4 2.2s-1.5 6.3-1.7 7.4c-.3 1.5-.1 3.3 0 3.9.1.2.3.3.4.1.2-.2 2.1-2.6 2.8-5 .2-.7 1-3.9 1-3.9.5.9 1.9 1.7 3.4 1.7 4.5 0 7.6-4.2 7.6-9.6C21 5.4 17.2 2 12 2z" /></svg>'
  };
  const SOCIAL={
    facebook:[
      {c:"NIFTY snapshot: banking leads today's rally, IT lags behind.", likes:214, comments:18, t:"2h ago"},
      {c:"New IPO alert — subscription window closes Friday, don't miss the cut-off.", likes:341, comments:29, t:"6h ago"},
    ],
    instagram:[
      {c:"Chart of the day 📈 — NIFTY holding above the 20-EMA.", likes:892, comments:34, t:"1h ago"},
      {c:"Behind the desk at Marfatia HQ, Vadodara.", likes:1204, comments:52, t:"5h ago"},
    ],
    pinterest:[
      {c:"Candlestick patterns cheat-sheet — save for later.", likes:2100, comments:0, t:"3h ago"},
      {c:"Options strategy payoff diagrams, explained visually.", likes:1560, comments:0, t:"8h ago"},
    ],
  };
  function buildColumn(platform){
    const col=$("#social"+platform.charAt(0).toUpperCase()+platform.slice(1));
    if(!col) return;
    const posts=SOCIAL[platform].map(post=>`
      <div class="social-post">
        <div class="social-post-thumb">${icon[platform]}<span>${post.t}</span></div>
        <div class="social-post-body">
          <p>${post.c}</p>
          <!--<div class="social-post-meta"><span>♥ ${post.likes.toLocaleString("en-IN")}</span>${post.comments?`<span>💬 ${post.comments}</span>`:"<span>Pinned</span>"}</div>-->
        </div>
      </div>`).join("");
    col.insertAdjacentHTML("beforeend", posts);
  }
  ["facebook","instagram","pinterest"].forEach(buildColumn);
})();

/* ============================================================
   SEC-14d — YOUTUBE: live candlestick chart behind the hero + "up next" row
   (same trading-chart look as the hero float card, not a generic audio-style
   equalizer) — background texture for the video panels.
   NOTE: mock data — swap for the YouTube Data API (playlistItems.list)
   once a channel ID / API key is wired up.
   ============================================================ */
(function(){
  function initCandleCanvas(canvas, count, intervalMs){
    if(!canvas) return;
    const ctx=canvas.getContext("2d");
    const dpr=Math.min(devicePixelRatio||1,2);
    const W=canvas.offsetWidth||300, H=canvas.offsetHeight||150;
    canvas.width=W*dpr; canvas.height=H*dpr;
    ctx.scale(dpr,dpr);

    let data=[], price=100;
    for(let i=0;i<count;i++){
      const open=price, close=open+rand(-3,3.4);
      const high=Math.max(open,close)+rand(0,1.6), low=Math.min(open,close)-rand(0,1.6);
      data.push({open,close,high,low}); price=close;
    }
    function render(){
      ctx.clearRect(0,0,W,H);
      const vals=data.flatMap(d=>[d.high,d.low]);
      const max=Math.max(...vals), min=Math.min(...vals)||1;
      const cw=W/data.length;
      data.forEach((d,i)=>{
        const x=i*cw+cw/2;
        const up=d.close>=d.open;
        ctx.strokeStyle=ctx.fillStyle= up ? "#9BCE16" : "#F17B6E";
        const yHigh=H-((d.high-min)/(max-min))*H, yLow=H-((d.low-min)/(max-min))*H;
        ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(x,yHigh); ctx.lineTo(x,yLow); ctx.stroke();
        const yOpen=H-((d.open-min)/(max-min))*H, yClose=H-((d.close-min)/(max-min))*H;
        const top=Math.min(yOpen,yClose), bh=Math.max(Math.abs(yClose-yOpen),2);
        ctx.fillRect(x-cw*0.28, top, cw*0.56, bh);
      });
    }
    render();
    if(!reduceMotion){
      setInterval(()=>{
        data.shift();
        const open=data[data.length-1].close, close=open+rand(-3,3.4);
        const high=Math.max(open,close)+rand(0,1.6), low=Math.min(open,close)-rand(0,1.6);
        data.push({open,close,high,low});
        render();
      }, intervalMs);
    }
  }
  initCandleCanvas($("#ytHeroChart"), 46, 2200);

  const list=$("#ytList");
  if(!list) return;
  const playIcon='<svg viewBox="0 0 26 26" fill="none"><path d="M9 6.5v13l11-6.5-11-6.5z" fill="currentColor"/></svg>';
  const VIDEOS=[
    {t:"Weekly F&O Strategy: Bull Call Spread Walkthrough", d:"6:42"},
    {t:"Sector Rotation: Where Smart Money Moved This Week", d:"4:15"},
    {t:"How to Read Open Interest Like a Pro", d:"8:03"},
  ];
  list.innerHTML=VIDEOS.map(v=>`
    <div class="yt-next-card">
      <div class="yt-next-thumb">
        <canvas class="yt-next-chart"></canvas>
        <div class="yt-next-play">${playIcon}</div>
        <span class="yt-next-dur">${v.d}</span>
      </div>
      <div class="yt-next-body"><h5>${v.t}</h5><span>Marfatia Stock Broking</span></div>
    </div>`).join("");
  $$(".yt-next-chart", list).forEach(c=>initCandleCanvas(c, 20, rand(2000,3000)));
})();

/* ============================================================
   SEC-14e — DAILY LIVE BLOG (Medium feed)
   NOTE: mock data — swap for Medium's public RSS feed
   (medium.com/feed/@handle) parsed server-side once the handle is live.
   ============================================================ */
(function(){
  const grid=$("#blogGrid");
  if(!grid) return;
  const POSTS=[
    {tag:"Markets", title:"Why Banking Stocks Are Leading This Rally", excerpt:"A quick read on what's driving the sector and whether the move has legs.", date:"08 Jul", read:"4 min read"},
    {tag:"Algo Trading", title:"Backtesting 101: Avoiding the Overfitting Trap", excerpt:"The most common mistake new algo traders make, and how to avoid it.", date:"07 Jul", read:"6 min read"},
    {tag:"IPO", title:"How to Read a Draft Red Herring Prospectus", excerpt:"A plain-English walkthrough of the document every IPO applicant should skim.", date:"05 Jul", read:"5 min read"},
  ];
  grid.innerHTML=POSTS.map(p=>`
    <article class="blog-card">
      <span class="blog-tag mono">${p.tag}</span>
      <h4>${p.title}</h4>
      <p>${p.excerpt}</p>
      <div class="blog-meta"><span>${p.date}</span><span>${p.read}</span></div>
    </article>`).join("");
})();

/* ============================================================
   SEC-18 — SIGNAL SIGN-OFF
   ============================================================ */
(function(){
  const path=$("#signalPath"), band=$("#signalBand");
  if(!path) return;
  const jagged="M0,60 L60,60 L80,20 L100,90 L120,40 L150,60 L200,60 L230,15 L260,95 L300,60 L360,60 L390,30 L420,80 L460,60 L1440,60";
  const flat="M0,60 L1440,60";
  path.setAttribute("d", jagged);
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        path.style.transition="d 1.4s "+"cubic-bezier(.16,1,.3,1)";
        requestAnimationFrame(()=>{ try{ path.setAttribute("d",flat); }catch(err){} });
        obs.disconnect();
      }
    });
  });
  obs.observe(band);
})();

/* ============================================================
   SEC-08d — MTF LEVERAGE SLIDER
   ============================================================ */
(function(){
  const slider=$("#mtfSlider"), cap=$("#mtfCap"), pow=$("#mtfPow");
  if(!slider || !cap || !pow) return;
  const fmt=n=>n.toLocaleString("en-IN");
  function update(){
    const v=+slider.value;
    cap.textContent=fmt(v);
    pow.textContent=fmt(v*4);
    const pct=(v - +slider.min)/(+slider.max - +slider.min)*100;
    slider.style.setProperty("--fill", pct+"%");
  }
  slider.addEventListener("input", update);
  update();
})();

/* ============================================================
   SEC-08b — PMS EQUITY CURVE DRAW-IN
   ============================================================ */
(function(){
  const curve=$(".pms-curve");
  if(!curve) return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ curve.classList.add("drawn"); obs.disconnect(); }
    });
  },{threshold:.35});
  obs.observe(curve);
})();

/* ============================================================
   AI INVESTMENT ASSISTANT (ported from marfatia-1)
   ============================================================ */
(function(){
  const sphere=$("#aiAssistantSphere"), chatBox=$("#aiChatBox"), chatBody=$("#aiChatBody");
  const input=$("#chatInput"), sendBtn=$("#chatSendBtn");
  if(!sphere || !chatBox) return;

  sphere.addEventListener("click", ()=>{
    chatBox.classList.toggle("open");
    sphere.classList.toggle("ai-sphere-active");
  });

  function appendBubble(text, sender){
    const bubble=document.createElement("div");
    bubble.classList.add("chat-bubble", sender==="ai" ? "bubble-ai" : "bubble-user");
    bubble.textContent=text;
    chatBody.appendChild(bubble);
    chatBody.scrollTop=chatBody.scrollHeight;
  }

  const answers={
    "Best algo strategy?":"Based on the recent index trend, our Trend-Following Momentum Algorithmic model is showing 78.4% win-rate on NIFTY options. You can active it for FREE in your dashboard panel.",
    "Show momentum plays":"Momentum Stock Plays: TATA MOTORS (Buy @ ₹920, target ₹965), RELIANCE (Buy @ ₹2,420, target ₹2,485). Dynamic technical RSI scans showing bullish divergence.",
    "Calculate leverage cost":"We offer 4X Leverage under MTF (Margin Trading Facility). The interest rate is a premium 9.5% p.a., only calculated on day-to-day balance utility."
  };

  $$(".suggest-pill").forEach(pill=>{
    pill.addEventListener("click", ()=>{
      const q=pill.textContent;
      appendBubble(q,"user");
      setTimeout(()=>{
        appendBubble(answers[q] || "I am processing your query. Please look at our Retail Algo dashboard section or consult our execution managers.","ai");
      },700);
    });
  });

  function handleSend(){
    const val=input.value.trim();
    if(!val) return;
    appendBubble(val,"user");
    input.value="";
    setTimeout(()=>{
      appendBubble("Analyzing market indicators for your query... Our advisory algorithms suggest referring to our custom tools for optimal options modeling.","ai");
    },800);
  }
  sendBtn.addEventListener("click", handleSend);
  input.addEventListener("keypress", e=>{ if(e.key==="Enter") handleSend(); });
})();



})();
