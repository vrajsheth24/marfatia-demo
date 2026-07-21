/* ============================================================
   BOOK FLIP — THREE.JS BEND for #bookStage
   Drop-in: include AFTER js/main.js:
     <script src="js/book-flip-three.js"></script>
   Loads three.js + html2canvas from CDN by itself.
   While a page is mid-turn the real .book-card is hidden and a
   WebGL plane (textured with a snapshot of the card) turns in
   its place, bending like real paper. main.js stays untouched —
   its own transform still runs underneath but the card is
   invisible during flight, so only the mesh shows.
   ============================================================ */
(function () {
  "use strict";
  var BEND = -0.55;        // curl strength (radians of extra curve at page middle)
  var TEX_SCALE = 1.25;   // snapshot resolution multiplier
  var HIDE_LO = 0.012, HIDE_HI = 0.988; // localP window where the real card is hidden

  var section = document.getElementById("algo");
  var pin = document.getElementById("algoPin");
  var stage = document.getElementById("bookStage");
  if (!section || !pin || !stage) return;
  var cards = Array.prototype.slice.call(stage.querySelectorAll(".book-card"));
  var n = cards.length;
  if (n < 2) return;

  // CSS that wins over main.js's inline styles while a page "flies"
  var st = document.createElement("style");
  st.textContent = ".book-card.gl-flying{opacity:0 !important;visibility:hidden !important;}" +
    "#glBookOverlay{position:fixed;inset:0;pointer-events:none;z-index:60;display:none;}";
  document.head.appendChild(st);

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  var libsReady = Promise.all([
    window.THREE ? 0 : loadScript("./js/three.min.js"),
    window.html2canvas ? 0 : loadScript("./js/html2canvas.min.js")
  ]);

  var overlay, renderer, scene, camera, vw = 0, vh = 0;
  function ensureGL() {
    var T = window.THREE;
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "glBookOverlay";
      document.body.appendChild(overlay);
      renderer = new T.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      overlay.appendChild(renderer.domElement);
      scene = new T.Scene();
    }
    if (vw !== window.innerWidth || vh !== window.innerHeight) {
      vw = window.innerWidth; vh = window.innerHeight;
      renderer.setSize(vw, vh);
      var fov = 2 * Math.atan((vh / 2) / 2000) * 180 / Math.PI; // match CSS perspective:2000px
      camera = new T.PerspectiveCamera(fov, vw / vh, 10, 6000);
      camera.position.set(0, 0, 2000);
    }
  }

  // ---- snapshots -------------------------------------------------
  var textures = new Array(n), capturing = new Array(n), backColors = new Array(n);
  function capture(i) {
    return new Promise(function(resolve){

        if (capturing[i] || !window.html2canvas){
            resolve();
            return;
        }

        capturing[i] = true;
      

    var card = cards[i];
    var rect = card.getBoundingClientRect();
    backColors[i] = getComputedStyle(card).backgroundColor;
    var opts = {
      width: rect.width, height: rect.height,
      windowWidth: document.documentElement.scrollWidth,
      backgroundColor: null, scale: TEX_SCALE, logging: false, useCORS: true,
      foreignObjectRendering: false, // classic renderer: FO mode renders blank in some sandboxes/CSP
      onclone: function (doc) {
        var clones = doc.querySelectorAll(".book-card");
        var c = clones[i];
        if (!c) return;
        c.style.setProperty("width", rect.width + "px", "important");
        c.style.setProperty("height", rect.height + "px", "important");
        // c.style.setProperty("border-radius", "20px", "important");
        c.style.setProperty("transform", "none", "important");
        c.style.setProperty("opacity", "1", "important");
        c.style.setProperty("visibility", "visible", "important");
        c.style.setProperty("backface-visibility", "visible", "important");
        c.classList.remove("gl-flying");
        // html2canvas skips subtrees with backface-visibility:hidden — force visible,
        // and undo GSAP reveal states (inline opacity/transform/clip-path)
        var all = c.querySelectorAll("*");
        for (var k = 0; k < all.length; k++) {
          var s = all[k].style;
          s.setProperty("backface-visibility", "visible", "important");
          if (s.opacity !== "") s.removeProperty("opacity");
          if (s.visibility !== "") s.removeProperty("visibility");
          if (s.transform !== "") s.removeProperty("transform");
          if (s.clipPath !== "") s.removeProperty("clip-path");
        }
        var wrap = c.querySelector(".suite-wrap"); if (wrap) wrap.style.setProperty("transform", "none", "important");
        var pb = c.querySelector(".page-back"); if (pb) pb.style.display = "none";
        var sh = c.querySelector(".page-shade"); if (sh) sh.style.display = "none";
      }
    };
    function isBlank(canvas) {
      try {
        var x0 = document.createElement("canvas"); x0.width = 60; x0.height = 60;
        var cx = x0.getContext("2d");
        var spots = [[0, 0], [canvas.width / 2 - 30, canvas.height / 2 - 30], [Math.max(0, canvas.width - 60), Math.max(0, canvas.height - 60)], [canvas.width / 4, canvas.height / 4]];
        var r0 = null, g0, b0;
        for (var s = 0; s < spots.length; s++) {
          cx.clearRect(0, 0, 60, 60);
          cx.drawImage(canvas, spots[s][0], spots[s][1], 60, 60, 0, 0, 60, 60); // 1:1 crop, no smoothing loss
          var d = cx.getImageData(0, 0, 60, 60).data;
          for (var j = 0; j < d.length; j += 4) {
            if (r0 === null) { r0 = d[j]; g0 = d[j + 1]; b0 = d[j + 2]; continue; }
            if (Math.abs(d[j] - r0) > 6 || Math.abs(d[j + 1] - g0) > 6 || Math.abs(d[j + 2] - b0) > 6) return false;
          }
        }
        return true; // every sampled region is one flat color = nothing was drawn
      } catch (e) { return true; }
    }
    function accept(canvas) {
      capturing[i] = false;
      if (window.THREE) {
        if (textures[i]) textures[i].dispose();
        textures[i] = null;
        killMesh(i);
        textures[i] = new window.THREE.CanvasTexture(canvas);
        textures[i].anisotropy = 4;
      }
      resolve();
    }
    window.html2canvas(card, opts).then(function (canvas) {
      if (!isBlank(canvas)) return accept(canvas);
      // retry with the foreignObject renderer (handles modern CSS like color-mix)
      var o2 = Object.assign({}, opts, { foreignObjectRendering: true });
      return window.html2canvas(card, o2).then(function (c2) {
        if (!isBlank(c2)) return accept(c2);
        capturing[i] = false; // give up on this card: it will flip with the original CSS animation
        resolve();
      });
    }).catch(function () { capturing[i] = false;resolve(); });
    });
  }
  // Re-snapshot a card when its inner tabs / widgets are used
  cards.forEach(function (card, i) {
    var t;
    card.addEventListener("click", function () { clearTimeout(t); t = setTimeout(function () { capture(i); }, 380); });
  });

  var themeObs = new MutationObserver(function () {
    var idx = 0;
    function captureNextTheme() {
      if (idx >= n) return;
      capture(idx);
      idx++;
      setTimeout(captureNextTheme, 400);
    }
    captureNextTheme();
  });
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // ---- scroll progress (same math as main.js) --------------------
  var pinOffset = 0;
  function updatePinOffset() {
    pin.style.setProperty("position", "static", "important");
    pinOffset = pin.offsetTop;
    pin.style.removeProperty("position");
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  var target = 0, current = 0, raf = null;

  function getTarget() {
    var r = section.getBoundingClientRect();
    var stickyTop = parseInt(getComputedStyle(pin).top) || 0;
    var startScroll = pinOffset - stickyTop;
    var total = r.height - pin.offsetHeight - pinOffset;
    if (total <= 0) return 0;
    return clamp((-r.top - startScroll) / total, 0, 1);
  }

  // ---- meshes -----------------------------------------------------
  var flights = {}; // i -> {group, geo, base, mF, mB, W, H}

  var sharedAlphaMap = null, sharedAlphaW = 0, sharedAlphaH = 0;
  function getAlphaMap(W, H) {
    if (sharedAlphaMap && sharedAlphaW === W && sharedAlphaH === H) return sharedAlphaMap;
    var c = document.createElement("canvas");
    c.width = W; c.height = H;
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(0, 0, W, H, 20); }
    else { ctx.rect(0, 0, W, H); } // fallback
    ctx.fill();
    sharedAlphaMap = new window.THREE.CanvasTexture(c);
    sharedAlphaW = W; sharedAlphaH = H;
    return sharedAlphaMap;
  }

  function ensureMesh(i, W, H) {
    var T = window.THREE, f = flights[i];
    if (f && (f.W !== W || f.H !== H)) { killMesh(i); f = null; }
    if (f) return f;
    var geo = new T.PlaneGeometry(W, H, 28, 1);
    var aMap = getAlphaMap(W, H);
    var mF = new T.MeshBasicMaterial({ map: textures[i] || null, color: textures[i] ? 0xffffff : 0xf3efe6, side: T.FrontSide, transparent: true, alphaMap: aMap, alphaTest: 0.1 });
    var mB = new T.MeshBasicMaterial({ color: new T.Color(backColors[i] || "#f3efe6"), side: T.BackSide, polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 2, transparent: true, alphaMap: aMap, alphaTest: 0.1 });
    var group = new T.Group();
    group.add(new T.Mesh(geo, mF)); group.add(new T.Mesh(geo, mB));
    scene.add(group);
    f = flights[i] = { group: group, geo: geo, base: geo.attributes.position.array.slice(), mF: mF, mB: mB, W: W, H: H };
    return f;
  }
  function killMesh(i) {
    var f = flights[i];
    if (!f) return;
    scene.remove(f.group); f.geo.dispose(); f.mF.dispose(); f.mB.dispose();
    delete flights[i];
  }

  function render(p) {
    var numFlips = n - 1, anyFlying = false;
    var sr = stage.getBoundingClientRect();
    var card0 = cards[0];
    var W = card0.offsetWidth, H = card0.offsetHeight;
    var spineX = sr.left - vw / 2;
    var cenY = vh / 2 - (sr.top + sr.height / 2);
    for (var i = 0; i < numFlips; i++) {
      var lp = clamp((p - i / numFlips) * numFlips, 0, 1);
      // only take over the flip when we have a real snapshot; otherwise the
      // original CSS flip in main.js keeps running for this card
      var flying = lp > HIDE_LO && lp < HIDE_HI && !!textures[i];
      cards[i].classList.toggle("gl-flying", flying);
      if (!flying) { killMesh(i); continue; }
      anyFlying = true;
      ensureGL();
      var f = ensureMesh(i, W, H);
      if (f.mF.map !== textures[i]) { f.mF.map = textures[i]; f.mF.color.set(0xffffff); f.mF.needsUpdate = true; }
      var a = lp * Math.PI * (178 / 180);
      var curl = BEND * Math.sin(Math.PI * lp);
      var pos = f.geo.attributes.position, base = f.base;
      for (var j = 0; j < pos.count; j++) {
        var x0 = base[j * 3] + W / 2; // 0 at spine … W at free edge
        var va = a + curl * Math.sin(Math.PI * x0 / W);
        pos.setX(j, x0 * Math.cos(va));
        pos.setZ(j, x0 * Math.sin(va));
      }
      pos.needsUpdate = true;
      f.group.position.set(spineX, cenY, (n - i) * 1.5);
    }
    if (overlay) {
      overlay.style.display = anyFlying ? "block" : "none";
      if (anyFlying) renderer.render(scene, camera);
    }
    return anyFlying;
  }

  function tick() {
    current += (target - current) * 0.15;
    if (Math.abs(target - current) < 0.0002) current = target;
    var flying = render(current);
    if (current !== target || flying) raf = requestAnimationFrame(tick);
    else raf = null;
  }
  function onScroll() {
    if (window.innerWidth < 768) return;
    target = getTarget();
    if (raf === null) raf = requestAnimationFrame(tick);
  }

  function init() {
    updatePinOffset();
    // capture snapshots only once the section approaches the viewport, after
    // the reveal animations have had time to run (content is opacity:0 before)
    var captured = false;
    // function captureAll() {
    //   if (captured) return; captured = true;
    //   function captureNext(idx) {
    //     if (idx >= n) return;
    //     capture(idx);
    //     // stagger the heavy html2canvas workloads by 400ms to prevent main thread freezing
    //     setTimeout(function () { captureNext(idx + 1); }, 400);
    //   }
    //   setTimeout(function () { captureNext(0); }, 900);
    // }
    async function captureAll() {

    if (captured) return;

    captured = true;

    await new Promise(r=>setTimeout(r,900));

    for(let i=0;i<n;i++){

        await capture(i);

    }

    if(window.hideWebsiteLoader){

        window.hideWebsiteLoader();

    }

}
    // if ("IntersectionObserver" in window) {
    //   var io = new IntersectionObserver(function (ents) {
    //     if (ents.some(function (e) { return e.isIntersecting; })) { captureAll(); io.disconnect(); }
    //   }, { rootMargin: "120% 0px" });
    //   io.observe(stage);
    // } else captureAll();
    captureAll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      updatePinOffset();
      for (var i = 0; i < n; i++) { killMesh(i); textures[i] && textures[i].dispose(); textures[i] = null; }
      var idle2 = window.requestIdleCallback || function (fn) { setTimeout(fn, 600); };
      idle2(function () { for (var i = 0; i < n; i++) capture(i); });
      onScroll();
    });
    onScroll();
  }

  libsReady.then(function () {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
  }).catch(function (err) {
    console.warn("[book-flip-three] Failed to load required libraries:", err);
  });
})();
