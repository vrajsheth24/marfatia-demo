/* ============================================================
   MARFATIA — 2026 Enhancements
   Lead form · WhatsApp channel · Products slider ·
   Experience Suite (horizontal) · Footer interactions
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rand = (a, b) => Math.random() * (b - a) + a;

  /* ============================================================
     1 — LEAD GENERATION FORM (Trading & Demat)
     ============================================================ */
  (function leadForm() {
    const form = $("#leadForm");
    if (!form) return;
    const mobile = $("#leadMobile"), email = $("#leadEmail");
    const mobileField = mobile.closest(".lead-field"), emailField = email.closest(".lead-field");
    const mobileErr = $("#leadMobileErr"), emailErr = $("#leadEmailErr");
    const success = $("#leadSuccess"), reset = $("#leadReset");

    const isMobile = (v) => /^[6-9]\d{9}$/.test(v.trim());
    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

    // digits only for mobile
    mobile.addEventListener("input", () => {
      mobile.value = mobile.value.replace(/\D/g, "").slice(0, 10);
      liveState(mobile, mobileField, mobileErr, isMobile);
    });
    email.addEventListener("input", () => liveState(email, emailField, emailErr, isEmail));

    function liveState(input, field, err, test) {
      const v = input.value.trim();
      if (v === "") { field.classList.remove("valid", "invalid"); err.classList.remove("show"); return; }
      if (test(v)) { field.classList.add("valid"); field.classList.remove("invalid"); err.classList.remove("show"); }
      else { field.classList.remove("valid"); }
    }
    function validate(input, field, err, test) {
      const ok = test(input.value);
      field.classList.toggle("invalid", !ok);
      field.classList.toggle("valid", ok);
      err.classList.toggle("show", !ok);
      return ok;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const okM = validate(mobile, mobileField, mobileErr, isMobile);
      const okE = validate(email, emailField, emailErr, isEmail);
      if (!okM) { mobile.focus(); return; }
      if (!okE) { email.focus(); return; }
      success.classList.add("show");
      success.setAttribute("aria-hidden", "false");
    });

    reset.addEventListener("click", () => {
      form.reset();
      [mobileField, emailField].forEach(f => f.classList.remove("valid", "invalid"));
      [mobileErr, emailErr].forEach(x => x.classList.remove("show"));
      success.classList.remove("show");
      success.setAttribute("aria-hidden", "true");
      mobile.focus();
    });
  })();

  /* ============================================================
     1b — HERO FORM (Trading & Demat inline form)
     ============================================================ */
  (function heroForm() {
    const form = $("#heroLeadForm");
    if (!form) return;
    const mobile = $("#heroMobile"), email = $("#heroEmail");
    const mobileField = mobile.closest(".hero-form-field"), emailField = email.closest(".hero-form-field");
    const mobileErr = $("#heroMobileErr"), emailErr = $("#heroEmailErr");
    const success = $("#heroSuccess");

    const isMobile = (v) => /^[6-9]\d{9}$/.test(v.trim());
    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

    // digits only for mobile
    mobile.addEventListener("input", () => {
      mobile.value = mobile.value.replace(/\D/g, "").slice(0, 10);
      liveState(mobile, mobileField, mobileErr, isMobile);
    });
    email.addEventListener("input", () => liveState(email, emailField, emailErr, isEmail));

    function liveState(input, field, err, test) {
      const v = input.value.trim();
      if (v === "") { field.classList.remove("valid", "invalid"); err.classList.remove("show"); return; }
      if (test(v)) { field.classList.add("valid"); field.classList.remove("invalid"); err.classList.remove("show"); }
      else { field.classList.remove("valid"); }
    }
    function validate(input, field, err, test) {
      const ok = test(input.value);
      field.classList.toggle("invalid", !ok);
      field.classList.toggle("valid", ok);
      err.classList.toggle("show", !ok);
      return ok;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const okM = validate(mobile, mobileField, mobileErr, isMobile);
      const okE = validate(email, emailField, emailErr, isEmail);
      if (!okM) { mobile.focus(); return; }
      if (!okE) { email.focus(); return; }
      success.classList.add("show");
      success.setAttribute("aria-hidden", "false");
    });
  })();

  /* ============================================================
     3 — WHATSAPP CHANNEL (QR reveal + live counter)
     ============================================================ */
  (function whatsapp() {
    const qr = $("#waQr"), canvas = $("#waQrCanvas");
    if (qr && canvas) {
      // decorative deterministic QR-style matrix
      const ctx = canvas.getContext("2d");
      const N = 25, cell = canvas.width / N;
      ctx.fillStyle = "#0d2118";
      let seed = 7;
      const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        if (rnd() > 0.52) ctx.fillRect(x * cell, y * cell, cell + 0.5, cell + 0.5);
      }
      // finder squares
      const finder = (fx, fy) => {
        ctx.fillStyle = "#0d2118";
        ctx.fillRect(fx * cell, fy * cell, cell * 7, cell * 7);
        ctx.fillStyle = "#fff";
        ctx.fillRect((fx + 1) * cell, (fy + 1) * cell, cell * 5, cell * 5);
        ctx.fillStyle = "#08753B";
        ctx.fillRect((fx + 2) * cell, (fy + 2) * cell, cell * 3, cell * 3);
      };
      finder(0, 0); finder(N - 7, 0); finder(0, N - 7);

      const reveal = () => qr.classList.add("revealed");
      qr.addEventListener("click", reveal);
      qr.addEventListener("mouseenter", reveal);
      qr.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); reveal(); } });
    }

    // live-ish online member count wobble
    const online = $("#waOnline");
    if (online && !reduceMotion) {
      let n = 1284;
      setInterval(() => {
        n = Math.max(1200, n + Math.round(rand(-6, 9)));
        online.textContent = n.toLocaleString("en-IN");
      }, 2600);
    }
  })();

  /* ============================================================
     4 — PRODUCTS SHOWCASE SLIDER (Retail Algo)
     ============================================================ */
  (function algoSlider() {
    const slider = $("#algoSlider");
    if (!slider) return;
    const track = $("#algoTrack");
    const slides = $$(".algo-slide", slider);
    const dotsWrap = $("#algoDots");
    const prev = $("#algoPrev"), next = $("#algoNext");
    const play = $("#algoPlay");
    const progress = $("#algoProgress span");
    const stage = slider;
    const n = slides.length;
    let cur = 0, timer = null, rafStart = 0;
    const DURATION = 5200;

    // dots
    slides.forEach((_, i) => {
      const d = document.createElement("button");
      d.type = "button";
      d.setAttribute("aria-label", "Go to product " + (i + 1));
      if (i === 0) d.classList.add("active");
      d.addEventListener("click", () => { go(i); });
      dotsWrap.appendChild(d);
    });
    const dots = $$("button", dotsWrap);

    function go(i, resetTimer = true) {
      cur = (i + n) % n;
      track.style.transform = "translateX(" + (-cur * 100) + "%)";
      slides.forEach((s, k) => s.classList.toggle("active", k === cur));
      dots.forEach((d, k) => d.classList.toggle("active", k === cur));
      if (resetTimer) restart();
    }

    prev.addEventListener("click", () => go(cur - 1));
    next.addEventListener("click", () => go(cur + 1));

    // per-slide inner content tabs
    slides.forEach((slide) => {
      const subtabs = $$(".algo-subtab", slide);
      const subpanels = $$(".algo-subpanel", slide);
      subtabs.forEach((st) => st.addEventListener("click", () => {
        const t = st.dataset.t;
        subtabs.forEach(x => x.classList.toggle("active", x === st));
        subpanels.forEach(p => p.classList.toggle("active", p.dataset.t === t));
      }));
    });

    // autoplay + progress bar
    function tickProgress(now) {
      if (!rafStart) rafStart = now;
      const p = Math.min((now - rafStart) / DURATION, 1);
      if (progress) progress.style.width = (p * 100) + "%";
      if (p >= 1) { rafStart = 0; go(cur + 1, false); startProgress(); }
      else timer = requestAnimationFrame(tickProgress);
    }
    function startProgress() {
      if (reduceMotion) return;
      rafStart = 0;
      cancelAnimationFrame(timer);
      timer = requestAnimationFrame(tickProgress);
    }
    function stopProgress() { cancelAnimationFrame(timer); }
    function restart() { if (playing) startProgress(); }

    let playing = !reduceMotion;
    play.setAttribute("data-playing", String(playing));
    play.addEventListener("click", () => {
      playing = !playing;
      play.setAttribute("data-playing", String(playing));
      play.setAttribute("aria-label", playing ? "Pause autoplay" : "Play autoplay");
      if (playing) startProgress(); else { stopProgress(); if (progress) progress.style.width = "0%"; }
    });

    // pause on hover
    stage.addEventListener("mouseenter", stopProgress);
    stage.addEventListener("mouseleave", () => { if (playing) startProgress(); });

    // swipe support
    let sx = 0, sy = 0, swiping = false;
    stage.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; swiping = true; }, { passive: true });
    stage.addEventListener("touchend", (e) => {
      if (!swiping) return; swiping = false;
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? cur + 1 : cur - 1);
    }, { passive: true });

    // start when visible
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => { if (e.isIntersecting && playing) startProgress(); else stopProgress(); });
    }, { threshold: 0.25 });
    io.observe(slider);
  })();

  /* ============================================================
     5 — EXPERIENCE SUITE (horizontal scroll) + widget logic
     ============================================================ */
  (function xsuite() {
    const box = $("#xsuite");
    if (!box) return;
    const cards = $$(".xsc-card", box);

    function triggerVisualRenders(idx) {
      if (idx === 1) {
        updateOptimizerRings();
      } else if (idx === 2) {
        updateSipCurve();
      } else if (idx === 3) {
        updateIpoGauge();
      } else if (idx === 4) {
        drawPayoffCanvas();
      }
    }

    // Cache card offsets for performance
    let cardTops = [];
    function cacheCardTops() {
      cardTops = cards.map(card => card.getBoundingClientRect().top + window.scrollY);
    }

    // Stacking Scroll Handler
    function handleStackScroll() {
      const topOffset = window.innerWidth <= 900 ? 90 : 110;
      
      if (window.innerWidth <= 900) {
        // Reset styles for mobile viewports
        cards.forEach((card, idx) => {
          card.style.transform = "";
          card.style.filter = "";
          triggerVisualRenders(idx);
        });
        return;
      }

      if (cardTops.length === 0) cacheCardTops();

      cards.forEach((card, idx) => {
        const docTop = cardTops[idx];
        const scrollPast = window.scrollY - (docTop - topOffset);
        
        // 1. Perspective stack effects (Scale down and dim slightly as cards get stacked)
        if (scrollPast >= 0) {
          const progress = Math.min(1, scrollPast / 400);
          const scale = 1 - progress * 0.04;
          const translateY = progress * -8;
          card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
          card.style.filter = `brightness(${1 - progress * 0.25})`;
          triggerVisualRenders(idx);
        } else {
          card.style.transform = "scale(1) translateY(0px)";
          card.style.filter = "brightness(1)";
          
          // Trigger drawing if card is entering viewport
          const rect = card.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
            triggerVisualRenders(idx);
          }
        }
      });
    }

    window.addEventListener("scroll", handleStackScroll, { passive: true });
    window.addEventListener("resize", () => {
      cardTops = []; // recalculate on resize
      handleStackScroll();
    });

    // Run initial parse
    setTimeout(() => {
      cacheCardTops();
      handleStackScroll();
    }, 200);

    // Widget 1: MTF Leverage Simulator
    const mtfCapital = $("#newMtfCapital");
    const mtfPills = $$("#newMtfLeveragePills .term-pill");
    let currentLev = 2;

    function updateMtf() {
      if (!mtfCapital) return;
      const capital = parseInt(mtfCapital.value);
      $("#newMtfCapitalVal").textContent = "₹" + capital.toLocaleString("en-IN");
      
      const activePower = capital * currentLev;
      $("#newMtfBuyingPower").textContent = "₹" + activePower.toLocaleString("en-IN");

      const marginVal = capital;
      const coverVal = activePower - capital;

      const ml = $("#newMtfMarginLabel");
      const cl = $("#newMtfCoverLabel");
      if (ml) ml.textContent = "MARGIN: ₹" + marginVal.toLocaleString("en-IN");
      if (cl) cl.textContent = "COVER: ₹" + coverVal.toLocaleString("en-IN");

      const lVal = $("#newMtfLeverageVal");
      const sVal = $("#newMtfStatusVal");
      if (lVal) lVal.textContent = currentLev + "X";
      if (sVal) sVal.textContent = currentLev === 4 ? "MAX POWER" : "ACTIVE";

      // Set width ratios
      const total = activePower;
      const marginPct = (marginVal / total) * 100;
      const coverPct = (coverVal / total) * 100;

      const mFill = $("#newMtfMarginBar");
      const cFill = $("#newMtfCoverBar");
      if (mFill) mFill.style.width = marginPct + "%";
      if (cFill) cFill.style.width = coverPct + "%";
    }

    if (mtfCapital) {
      mtfCapital.addEventListener("input", updateMtf);
    }
    mtfPills.forEach(pill => {
      pill.addEventListener("click", () => {
        mtfPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        currentLev = parseInt(pill.dataset.lev);
        updateMtf();
      });
    });
    updateMtf();

    // Widget 2: Portfolio Optimizer
    const optSliders = {
      eq: $("#optEquities"),
      gd: $("#optGold"),
      bd: $("#optBonds")
    };
    const optVals = {
      eq: $("#optEquitiesVal"),
      gd: $("#optGoldVal"),
      bd: $("#optBondsVal")
    };

    let prevOptValues = { eq: 60, gd: 20, bd: 20 };

    function balanceSliders(changedId, val) {
      const keys = ["eq", "gd", "bd"];
      const remainingKeys = keys.filter(k => k !== changedId);
      const remainingSum = 100 - val;

      const k1 = remainingKeys[0], k2 = remainingKeys[1];
      const prevSum = prevOptValues[k1] + prevOptValues[k2];

      if (prevSum > 0) {
        // Proportional distribution
        let w1 = Math.round((prevOptValues[k1] / prevSum) * remainingSum);
        let w2 = remainingSum - w1;
        prevOptValues[changedId] = val;
        prevOptValues[k1] = w1;
        prevOptValues[k2] = w2;
      } else {
        // Equal split
        let w1 = Math.round(remainingSum / 2);
        let w2 = remainingSum - w1;
        prevOptValues[changedId] = val;
        prevOptValues[k1] = w1;
        prevOptValues[k2] = w2;
      }

      // Sync slider UI elements without triggering circular events
      keys.forEach(k => {
        if (optSliders[k]) {
          optSliders[k].value = prevOptValues[k];
        }
        if (optVals[k]) {
          optVals[k].textContent = prevOptValues[k] + "%";
        }
      });

      updateOptimizerRings();
    }

    function updateOptimizerRings() {
      const eq = prevOptValues.eq;
      const gd = prevOptValues.gd;
      const bd = prevOptValues.bd;

      const total = eq + gd + bd;
      const totEl = $("#optTotalVal");
      if (totEl) totEl.textContent = total + "%";

      // Sync badges
      const eqB = $("#optEquitiesBadge");
      const gdB = $("#optGoldBadge");
      const bdB = $("#optBondsBadge");
      if (eqB) eqB.textContent = eq + "%";
      if (gdB) gdB.textContent = gd + "%";
      if (bdB) bdB.textContent = bd + "%";

      // Classify risk
      let risk = "BALANCED";
      if (eq > 70) {
        risk = "AGGRESSIVE";
      } else if (bd > 50) {
        risk = "CONSERVATIVE";
      } else if (eq < 30) {
        risk = "DEFENSIVE";
      }
      
      const riskEl = $("#optRiskLabel");
      if (riskEl) {
        riskEl.textContent = risk;
        riskEl.style.color = risk === "AGGRESSIVE" ? "#ea4335" : (risk === "CONSERVATIVE" ? "var(--lime)" : "var(--green)");
      }

      // Draw SVG donut ring segments (Circumference = 534)
      const CIRC = 534;
      const ringEq = $("#ringEquities");
      const ringGd = $("#ringGold");
      const ringBd = $("#ringBonds");

      if (!ringEq || !ringGd || !ringBd) return;

      const eqLen = (eq / 100) * CIRC;
      ringEq.style.strokeDasharray = `${eqLen} ${CIRC - eqLen}`;
      ringEq.style.strokeDashoffset = "0";

      const gdLen = (gd / 100) * CIRC;
      ringGd.style.strokeDasharray = `${gdLen} ${CIRC - gdLen}`;
      ringGd.style.strokeDashoffset = -eqLen;

      const bdLen = (bd / 100) * CIRC;
      ringBd.style.strokeDasharray = `${bdLen} ${CIRC - bdLen}`;
      ringBd.style.strokeDashoffset = -(eqLen + gdLen);
    }

    if (optSliders.eq) optSliders.eq.addEventListener("input", (e) => balanceSliders("eq", parseInt(e.target.value)));
    if (optSliders.gd) optSliders.gd.addEventListener("input", (e) => balanceSliders("gd", parseInt(e.target.value)));
    if (optSliders.bd) optSliders.bd.addEventListener("input", (e) => balanceSliders("bd", parseInt(e.target.value)));
    
    updateOptimizerRings();

    // Widget 3: Systematic Wealth Planner
    const newSipAmt = $("#sipAmt"), newSipYr = $("#sipYr"), newSipRate = $("#sipRate");
    const newSipAmtVal = $("#sipAmtVal"), newSipYrVal = $("#sipYrVal"), newSipRateVal = $("#sipRateVal");
    const newSipTotalWealth = $("#sipTotalWealth");

    function updateSipCurve() {
      if (!newSipAmt || !newSipYr || !newSipRate) return;
      const P = parseInt(newSipAmt.value);
      const Y = parseInt(newSipYr.value);
      const R = parseInt(newSipRate.value) / 100;

      newSipAmtVal.textContent = "₹" + P.toLocaleString("en-IN");
      newSipYrVal.textContent = Y + " Yrs";
      newSipRateVal.textContent = Math.round(R * 100) + "%";

      const i = R / 12;
      const nMonths = Y * 12;
      
      const FV = P * ((Math.pow(1 + i, nMonths) - 1) / i) * (1 + i);
      newSipTotalWealth.textContent = "₹" + Math.round(FV).toLocaleString("en-IN");

      // Update Chart Labels
      const mxYr = $("#sipMaxYear");
      const mdYr = $("#sipMidYear");
      if (mxYr) mxYr.textContent = "Year " + Y;
      if (mdYr) mdYr.textContent = "Year " + Math.round(Y / 2);

      // Generate compound path
      const points = [];
      const steps = 15;
      const startX = 10, endX = 290;
      const startY = 110, endY = 30;

      for (let s = 0; s <= steps; s++) {
        const stepPct = s / steps;
        const x = startX + stepPct * (endX - startX);
        const subMonths = stepPct * nMonths;
        const subFV = P * ((Math.pow(1 + i, subMonths) - 1) / i) * (1 + i);
        const pctOfMax = FV > 0 ? subFV / FV : 0;
        const y = startY - pctOfMax * (startY - endY);
        points.push(`${Math.round(x)},${Math.round(y)}`);
      }

      const pathData = "M" + points.join(" L");
      const areaData = pathData + ` L290,110 L10,110 Z`;

      const lPath = $("#sipLinePath");
      const aPath = $("#sipAreaPath");
      if (lPath) lPath.setAttribute("d", pathData);
      if (aPath) aPath.setAttribute("d", areaData);
    }

    if (newSipAmt) newSipAmt.addEventListener("input", updateSipCurve);
    if (newSipYr) newSipYr.addEventListener("input", updateSipCurve);
    if (newSipRate) newSipRate.addEventListener("input", updateSipCurve);
    
    updateSipCurve();

    // Widget 4: IPO Tracker
    const ipoItems = $$(".ipo-item", box);
    const ipoDetails = {
      tata: {
        premium: "+84%",
        angle: 148,
        dashoffset: 50,
        steps: { bidding: "passed", allot: "passed", listing: "active" }
      },
      ola: {
        premium: "+18%",
        angle: 40,
        dashoffset: 195,
        steps: { bidding: "passed", allot: "active", listing: "" }
      },
      swiggy: {
        premium: "+26%",
        angle: 55,
        dashoffset: 175,
        steps: { bidding: "active", allot: "", listing: "" }
      }
    };

    function updateIpoGauge() {
      const activeItem = $(".ipo-item.active", box);
      const ipoKey = activeItem ? activeItem.dataset.ipo : "tata";
      const data = ipoDetails[ipoKey];
      if (!data) return;

      const needle = $("#gaugeNeedle");
      const fill = $("#gaugeFill");
      const prem = $("#ipoPremiumVal");

      if (needle) needle.style.transform = `rotate(${data.angle}deg)`;
      if (fill) fill.style.strokeDashoffset = data.dashoffset;
      if (prem) prem.textContent = data.premium;

      const stepBidding = $("#step-bidding");
      const stepAllot = $("#step-allot");
      const stepListing = $("#step-listing");

      if (stepBidding && stepAllot && stepListing) {
        stepBidding.className = "timeline-step " + data.steps.bidding;
        stepAllot.className = "timeline-step " + data.steps.allot;
        stepListing.className = "timeline-step " + data.steps.listing;
      }
    }

    ipoItems.forEach(item => {
      item.addEventListener("click", () => {
        ipoItems.forEach(it => it.classList.remove("active"));
        item.classList.add("active");
        updateIpoGauge();
      });
    });
    updateIpoGauge();

    // Widget 5: Options Strategy Payoff
    const payoffStrike = $("#newPayoffStrike");
    const payoffStrikeVal = $("#newPayoffStrikeVal");
    const strategyPills = $$("#optStrategyPills .term-pill");
    let activeStrategy = "bull";

    function drawPayoffCanvas() {
      const canvas = $("#newPayoffCanvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      
      const parentW = canvas.parentElement.clientWidth;
      canvas.width = parentW - 24;
      canvas.height = 140;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const strike = payoffStrike ? parseInt(payoffStrike.value) : 24500;
      if (payoffStrikeVal) payoffStrikeVal.textContent = strike.toLocaleString("en-IN");

      // Draw zero axis line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Draw strike indicator line
      ctx.strokeStyle = "rgba(155, 206, 22, 0.25)";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw strike text
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "10px monospace";
      ctx.fillText(strike.toString(), w / 2 - 15, h - 6);

      // Draw strategy payoff lines
      ctx.strokeStyle = "#08753b";
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.beginPath();

      if (activeStrategy === "bull") {
        $("#newPayoffMaxProfit").textContent = "₹12,500";
        $("#newPayoffMaxLoss").textContent = "₹4,200";

        ctx.moveTo(0, h / 2 + 30);
        ctx.lineTo(w * 0.35, h / 2 + 30);
        ctx.lineTo(w * 0.65, h / 2 - 40);
        ctx.lineTo(w, h / 2 - 40);
      } else if (activeStrategy === "bear") {
        $("#newPayoffMaxProfit").textContent = "₹11,800";
        $("#newPayoffMaxLoss").textContent = "₹4,800";

        ctx.moveTo(0, h / 2 - 38);
        ctx.lineTo(w * 0.35, h / 2 - 38);
        ctx.lineTo(w * 0.65, h / 2 + 32);
        ctx.lineTo(w, h / 2 + 32);
      } else {
        $("#newPayoffMaxProfit").textContent = "Unlimited";
        $("#newPayoffMaxLoss").textContent = "₹7,500";

        ctx.moveTo(10, 15);
        ctx.lineTo(w / 2, h / 2 + 40);
        ctx.lineTo(w - 10, 15);
      }
      ctx.stroke();

      // Fill shading
      ctx.fillStyle = "rgba(155, 206, 22, 0.06)";
      ctx.beginPath();
      if (activeStrategy === "bull") {
        ctx.moveTo(w * 0.5, h / 2);
        ctx.lineTo(w * 0.65, h / 2 - 40);
        ctx.lineTo(w, h / 2 - 40);
        ctx.lineTo(w, h / 2);
      } else if (activeStrategy === "bear") {
        ctx.moveTo(0, h / 2);
        ctx.lineTo(0, h / 2 - 38);
        ctx.lineTo(w * 0.5, h / 2 - 38);
        ctx.lineTo(w * 0.5, h / 2);
      } else {
        ctx.moveTo(10, h / 2);
        ctx.lineTo(10, 15);
        ctx.lineTo(w * 0.22, h / 2);
        ctx.moveTo(w * 0.78, h / 2);
        ctx.lineTo(w - 10, 15);
        ctx.lineTo(w - 10, h / 2);
      }
      ctx.closePath();
      ctx.fill();
    }

    if (payoffStrike) {
      payoffStrike.addEventListener("input", drawPayoffCanvas);
    }
    strategyPills.forEach(pill => {
      pill.addEventListener("click", () => {
        strategyPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        activeStrategy = pill.dataset.strat;
        drawPayoffCanvas();
      });
    });

    window.addEventListener("resize", drawPayoffCanvas);
    setTimeout(drawPayoffCanvas, 100);
  })();

  /* ============================================================
     7 — FOOTER: ticker · mouse glow · scroll-to-top progress
     ============================================================ */
  (function footer() {
    const track = $("#footerTicker");
    if (track) {
      const items = [
        ["NIFTY 50", "24,812.35", "+0.52%", true], ["SENSEX", "81,559.54", "+0.38%", true],
        ["BANK NIFTY", "51,247.90", "-0.16%", false], ["RELIANCE", "2,940.15", "+1.24%", true],
        ["TCS", "4,102.60", "+2.14%", true], ["HDFCBANK", "1,678.20", "-0.31%", false],
        ["INFY", "1,894.75", "+1.44%", true], ["GOLD", "71,240", "+0.44%", true],
        ["USDINR", "83.42", "-0.08%", false], ["ADANIENT", "3,120.00", "+4.82%", true],
      ];
      const html = items.map(([s, v, c, up]) =>
        `<span><b>${s}</b> ${v} <em class="${up ? "up" : "down"}" style="font-style:normal">${c}</em></span>`
      ).join("");
      track.innerHTML = html + html;
    }

    const glow = $(".footer-glow"), foot = $("#footer");
    if (glow && foot && !reduceMotion) {
      foot.addEventListener("pointermove", (e) => {
        const r = foot.getBoundingClientRect();
        glow.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
        glow.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
      }, { passive: true });
    }

    // scroll-to-top with progress ring
    const btn = $("#toTop"), prog = $("#toTopProg");
    if (btn) {
      const R = 19, CIRC = 2 * Math.PI * R;
      btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
      const onScroll = () => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const p = max > 0 ? doc.scrollTop / max : 0;
        if (prog) prog.style.strokeDashoffset = String(CIRC * (1 - p));
        btn.classList.toggle("show", doc.scrollTop > 600);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  })();

  /* ---------- Voluntary Freezing Modal Injection and Wiring (Home Page) ---------- */
  (function () {
    var vfModalHTML = 
      '<div id="freezingModal" class="pms-modal" aria-hidden="true">' +
      '  <div class="pms-modal-overlay"></div>' +
      '  <div class="pms-modal-content">' +
      '    <button class="pms-modal-close" id="closeFreezingModal" aria-label="Close modal">&times;</button>' +
      '    <div class="pms-modal-header">' +
      '      <h3>Account Security Switch</h3>' +
      '      <h2>Voluntary Freezing / Blocking</h2>' +
      '      <p>Submit this form to instantly initiate blocking online trading access to your account under SEBI regulations.</p>' +
      '    </div>' +
      '    <form id="freezingForm" class="pms-modal-form" data-api="https://api.marfatia.net/api/voluntary-freezing">' +
      '      <div class="form-row-2">' +
      '        <div class="form-group">' +
      '          <label for="vfClientCode">Client Code (UCC) *</label>' +
      '          <input type="text" id="vfClientCode" name="client_code" placeholder="e.g. M12345" required>' +
      '        </div>' +
      '        <div class="form-group">' +
      '          <label for="vfPan">PAN Card Number *</label>' +
      '          <input type="text" id="vfPan" name="pan" placeholder="10-digit PAN" pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" required style="text-transform: uppercase;">' +
      '        </div>' +
      '      </div>' +
      '      <div class="form-row-2">' +
      '        <div class="form-group">' +
      '          <label for="vfEmail">Registered Email ID *</label>' +
      '          <input type="email" id="vfEmail" name="email" placeholder="registered email address" required>' +
      '        </div>' +
      '        <div class="form-group">' +
      '          <label for="vfMobile">Registered Mobile Number *</label>' +
      '          <input type="tel" id="vfMobile" name="mobile" placeholder="10-digit mobile" pattern="[0-9]{10}" required>' +
      '        </div>' +
      '      </div>' +
      '      <div class="form-group">' +
      '        <label for="vfReason">Reason for Freezing *</label>' +
      '        <select id="vfReason" name="reason" required>' +
      '          <option value="" disabled selected>Select a reason...</option>' +
      '          <option value="Suspicious Activity">Suspicious activity detected in account</option>' +
      '          <option value="Compromised Credentials">Login credentials suspect or hacked</option>' +
      '          <option value="Temporary Stop">Voluntary temporary pause</option>' +
      '          <option value="Other">Other security concern</option>' +
      '        </select>' +
      '      </div>' +
      '      <div class="form-checkbox">' +
      '        <input type="checkbox" id="vfConfirm" name="confirm" required>' +
      '        <label for="vfConfirm">I authorize Marfatia Stock Broking to freeze online trading access for my account immediately. I understand that all pending orders will be cancelled.</label>' +
      '      </div>' +
      '      <div class="f-msg"></div>' +
      '      <button type="submit" class="btn btn-marfatia btn-block"><span>Request Immediate Block</span></button>' +
      '      <div class="form-footer-note">' +
      '        <p>Alternatively, you can email <a href="mailto:stoptrade@marfatia.net"><b>stoptrade@marfatia.net</b></a> from your registered email ID or call <a href="tel:02652351355"><b>0265-2351355</b></a>.</p>' +
      '      </div>' +
      '    </form>' +
      '  </div>' +
      '</div>';

    var div = document.createElement('div');
    div.innerHTML = vfModalHTML;
    document.body.appendChild(div.firstChild);

    var vfLink = $("#voluntaryFreezingLink");
    var vfModal = $("#freezingModal");
    var vfClose = $("#closeFreezingModal");

    if (vfLink && vfModal) {
      vfLink.addEventListener("click", function (e) {
        e.preventDefault();
        vfModal.classList.add("open");
      });
    }
    if (vfClose && vfModal) {
      vfClose.addEventListener("click", function () {
        vfModal.classList.remove("open");
      });
      $(".pms-modal-overlay", vfModal).addEventListener("click", function () {
        vfModal.classList.remove("open");
      });
    }

    var vfForm = $("#freezingForm");
    if (vfForm) {
      vfForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var msg = $(".f-msg", vfForm);
        var data = {};
        $$("input,textarea,select", vfForm).forEach(function (f) { if (f.name) data[f.name] = f.value; });
        var btn = $('button[type="submit"]', vfForm);
        if (btn) { btn.disabled = true; btn.style.opacity = .6; }
        fetch(vfForm.dataset.api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }).then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          if (msg) {
            msg.className = "f-msg ok";
            msg.style.color = "var(--green)";
            msg.textContent = "Request received — account freeze initiated successfully.";
          }
          vfForm.reset();
        }).catch(function () {
          if (msg) {
            msg.className = "f-msg err";
            msg.style.color = "var(--down)";
            msg.innerHTML = "Submission failed. Please email stoptrade@marfatia.net directly.";
          }
        }).finally(function () {
          if (btn) { btn.disabled = false; btn.style.opacity = 1; }
        });
      });
    }
  })();
})();
