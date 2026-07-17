/* ============================================================
   MARFATIA — GSAP Scroll FX layer
   Loads after main.js. If GSAP is missing (offline copy deleted)
   or the user prefers reduced motion, this file does nothing and
   main.js's IntersectionObserver reveals take over.
   ============================================================ */
(function(){
"use strict";
if(!window.gsap || !window.ScrollTrigger) return;
if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease:"power3.out", duration:0.9 });

const $$=(s,c=document)=>Array.from(c.querySelectorAll(s));

/* ---------------- split titles into per-word spans ----------------
   Walks text nodes (so <em>/<br> inside titles keep their styling)
   and wraps each word in an overflow-hidden mask. */
function splitWords(el){
  const walker=document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes=[];
  while(walker.nextNode()){
    if(walker.currentNode.nodeValue.trim()) textNodes.push(walker.currentNode);
  }
  textNodes.forEach(node=>{
    const frag=document.createDocumentFragment();
    node.nodeValue.split(/(\s+)/).forEach(part=>{
      if(!part) return;
      if(/^\s+$/.test(part)){ frag.appendChild(document.createTextNode(part)); return; }
      const mask=document.createElement("span"); mask.className="sw";
      const inner=document.createElement("span"); inner.className="sw-i";
      inner.textContent=part;
      mask.appendChild(inner); frag.appendChild(mask);
    });
    node.parentNode.replaceChild(frag,node);
  });
}

$$(".sec-title, .footer-top h2, .unfold-text h2").forEach(title=>{
  splitWords(title);
  const words=title.querySelectorAll(".sw-i");
  if(!words.length) return;
  gsap.set(words,{yPercent:112});
  gsap.to(words,{
    yPercent:0, duration:0.85, stagger:0.055, ease:"power4.out",
    scrollTrigger:{ trigger:title, start:"top 88%", once:true }
  });
});

/* ---------------- generic one-shot rise reveal ---------------- */
function rise(sel, vars={}){
  $$(sel).forEach(el=>{
    gsap.set(el,{ y:vars.y??34, opacity:0 });
    gsap.to(el,{
      y:0, opacity:1, duration:vars.dur??0.9, delay:vars.delay??0,
      ease:vars.ease??"power3.out", clearProps:"all",
      scrollTrigger:{ trigger:el, start:vars.start??"top 90%", once:true }
    });
  });
}

/* ---------------- staggered children reveal ---------------- */
function cascade(containerSel, childSel, vars={}){
  $$(containerSel).forEach(box=>{
    const kids=$$(childSel,box);
    if(!kids.length) return;
    gsap.set(kids,{ y:vars.y??44, opacity:0 });
    gsap.to(kids,{
      y:0, opacity:1, duration:vars.dur??0.85, stagger:vars.stagger??0.08,
      ease:vars.ease??"power3.out", clearProps:"all",
      scrollTrigger:{ trigger:box, start:vars.start??"top 85%", once:true }
    });
  });
}

/* eyebrows + section subtitles everywhere below the hero */
rise(".eyebrow",{ y:16, dur:0.7 });
rise(".sec-sub, .loom-sub",{ y:24, delay:0.1 });

/* SEC-06 capability grid */
cascade(".capgrid",".cap-card",{ y:56, stagger:0.07 });

/* SEC-06 our-products grid (merged from marfatia-1) */
cascade(".prodgrid",".product-card",{ y:56, stagger:0.07 });

/* SEC-07b experience suite (merged from marfatia-1) */
cascade(".suite-menu",".suite-menu-btn",{ y:34, stagger:0.08 });
(function(){
  const box=document.querySelector(".suite-panels");
  if(!box) return;
  gsap.set(box,{ y:60, rotationX:8, opacity:0, transformPerspective:900, transformOrigin:"center top" });
  gsap.to(box,{
    y:0, rotationX:0, opacity:1, duration:1.05, clearProps:"all",
    scrollTrigger:{ trigger:box, start:"top 85%", once:true }
  });
})();

/* SEC-07 loom text block */
cascade(".loom-stats","div",{ y:26, stagger:0.1, start:"top 92%" });
cascade(".loom-features",".loom-fcard",{ y:26, stagger:0.1, start:"top 92%" });
cascade(".loom-chips",".loom-chip",{ y:18, stagger:0.06, start:"top 94%" });
rise(".loom-text .btn",{ y:22 });

/* SEC-08a trading account */
cascade(".acct-checklist",".acct-row",{ y:24, stagger:0.1 });
cascade(".acct-features-grid", ".acct-feat-card", { y: 26, stagger: 0.08 });
(function(){
  const card=document.querySelector(".prod-account-visual");
  if(!card) return;
  gsap.set(card,{ clipPath:"inset(0 0 100% 0)", y:40 });
  gsap.to(card,{
    clipPath:"inset(0 0 0% 0)", y:0, duration:1.1, ease:"power4.out", clearProps:"all",
    scrollTrigger:{ trigger:card, start:"top 85%", once:true }
  });
})();

/* SEC-08b PMS stats */
cascade(".pms-stats",".pms-stat",{ y:44, stagger:0.12 });

/* SEC-08c mutual funds */
(function(){
  const icon=document.querySelector(".prod-mf-icon");
  if(!icon) return;
  gsap.set(icon,{ scale:0.5, rotation:-70, opacity:0 });
  gsap.to(icon,{
    scale:1, rotation:0, opacity:1, duration:1.1, ease:"back.out(1.6)", clearProps:"all",
    scrollTrigger:{ trigger:icon, start:"top 88%", once:true }
  });
})();
cascade(".mf-chips","span",{ y:18, stagger:0.05 });
rise(".prod-mf-text .btn",{ y:22 });

/* SEC-08d MTF — giant 4X pops in */
(function(){
  const giant=document.querySelector(".mtf-giant");
  if(!giant) return;
  gsap.set(giant,{ scale:0.35, opacity:0 });
  gsap.to(giant,{
    scale:1, opacity:1, duration:1.1, ease:"back.out(1.5)", clearProps:"all",
    scrollTrigger:{ trigger:giant, start:"top 85%", once:true }
  });
})();
rise(".mtf-equation",{ y:20, delay:0.15 });
rise(".prod-mtf .btn",{ y:22, delay:0.2 });

/* SEC-08e SLB compare */
(function(){
  const wrap=document.querySelector(".slb-compare");
  if(!wrap) return;
  const sides=$$(".slb-side",wrap), swap=wrap.querySelector(".slb-swap");
  gsap.set(sides[0],{ x:-70, opacity:0 });
  gsap.set(sides[1],{ x:70, opacity:0 });
  if(swap) gsap.set(swap,{ scale:0, opacity:0 });
  const tl=gsap.timeline({ scrollTrigger:{ trigger:wrap, start:"top 82%", once:true } });
  tl.to(sides,{ x:0, opacity:1, duration:0.9, clearProps:"all" })
    .to(swap,{ scale:1, opacity:1, duration:0.7, ease:"back.out(2)", clearProps:"opacity,scale" },"-=0.45");
})();
rise(".prod-slb > .btn",{ y:22 });

/* SEC-13 newsroom */
rise(".newsroom-ticker",{ y:20 });
rise(".newsroom-group-title",{ y:16, dur:0.7 });
cascade(".ipo-grid",".ipo-card",{ y:48, stagger:0.12 });
cascade(".broadcast-rundown",".bc-row",{ y:28, stagger:0.09 });
(function(){
  const feat=document.querySelector(".broadcast-featured");
  if(!feat) return;
  gsap.set(feat,{ clipPath:"inset(0 100% 0 0)" });
  gsap.to(feat,{
    clipPath:"inset(0 0% 0 0)", duration:1.15, ease:"power4.inOut", clearProps:"clipPath",
    scrollTrigger:{ trigger:feat, start:"top 82%", once:true }
  });
})();
(function(){
  const vid=document.querySelector(".video-feature");
  if(!vid) return;
  gsap.set(vid,{ y:50, scale:0.96, opacity:0 });
  gsap.to(vid,{
    y:0, scale:1, opacity:1, duration:1, clearProps:"all",
    scrollTrigger:{ trigger:vid, start:"top 86%", once:true }
  });
})();
$$(".newsroom-divider").forEach(div=>{
  gsap.set(div,{ scaleX:0, transformOrigin:"left center" });
  gsap.to(div,{ scaleX:1, duration:1.1, ease:"power2.inOut", clearProps:"all",
    scrollTrigger:{ trigger:div, start:"top 92%", once:true } });
});

/* SEC-14 unfold text extras */
cascade(".app-feats","li",{ y:18, stagger:0.07, start:"top 95%" });
cascade(".app-stats","div",{ y:24, stagger:0.12, start:"top 95%" });
rise(".app-buttons",{ y:20 });

/* SEC-15 constellation badge */
rise(".constellation-badge",{ y:20 });

/* SEC-15 testimonials (merged from marfatia-2) */
rise(".google-badge",{ y:20, delay:0.15 });
(function(){
  const feat=document.querySelector(".featured-review");
  if(!feat) return;
  gsap.set(feat,{ y:50, scale:0.96, opacity:0 });
  gsap.to(feat,{
    y:0, scale:1, opacity:1, duration:1, clearProps:"all",
    scrollTrigger:{ trigger:feat, start:"top 86%", once:true }
  });
})();
rise(".review-marquee",{ y:30 });

/* SEC-17 desk query console tips in */
(function(){
  const box=document.querySelector(".deskquery-console");
  if(!box) return;
  gsap.set(box,{ y:60, rotationX:8, opacity:0, transformPerspective:900, transformOrigin:"center top" });
  gsap.to(box,{
    y:0, rotationX:0, opacity:1, duration:1.05, clearProps:"all",
    scrollTrigger:{ trigger:box, start:"top 85%", once:true }
  });
})();

/* footer */
cascade(".footer-grid",".footer-col",{ y:36, stagger:0.09, start:"top 90%" });
rise(".footer-top .btn",{ y:22 });
rise(".footer-regbar, .footer-assoc",{ y:20 });

/* ---------------- scrubbed parallax layers ---------------- */

/* giant watermark words drift sideways with scroll */
$$(".bg-word").forEach(word=>{
  gsap.fromTo(word,{ xPercent:3 },{
    xPercent:-14, ease:"none",
    scrollTrigger:{ trigger:word.parentElement, start:"top bottom", end:"bottom top", scrub:1.1 }
  });
});

/* Beyond Algo ghost chapter numerals drift vertically with scroll */
$$(".chapter-num").forEach(num=>{
  gsap.fromTo(num,{ y:-30 },{
    y:60, ease:"none",
    scrollTrigger:{ trigger:num.closest("section")||num.parentElement, start:"top bottom", end:"bottom top", scrub:1 }
  });
});

/* candlestick art inside the featured news card */
(function(){
  const art=document.querySelector(".bc-art");
  if(!art) return;
  gsap.fromTo(art,{ y:-24 },{
    y:26, ease:"none",
    scrollTrigger:{ trigger:art.closest(".newsroom-group")||art, start:"top bottom", end:"bottom top", scrub:1.2 }
  });
})();

/* footer skyline rises as the footer scrolls into view */
(function(){
  const sky=document.querySelector(".footer-skyline");
  if(!sky) return;
  gsap.fromTo(sky,{ yPercent:46 },{
    yPercent:0, ease:"none",
    scrollTrigger:{ trigger:".site-footer", start:"top bottom", end:"bottom bottom", scrub:1 }
  });
})();

/* recalc trigger positions once everything (fonts/images) is loaded */
window.addEventListener("load", ()=>ScrollTrigger.refresh());
})();
