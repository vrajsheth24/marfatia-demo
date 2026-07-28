/* ============================================================
   MARFATIA — INNER PAGES SHARED RUNTIME
   Injects the site header + footer (same design as index.html,
   wired to real pages), and powers shared interactions:
   reveal-on-scroll, counters, tabs, accordions, nav drawers,
   zero-complaint table builder, sticky mobile CTA.
   ============================================================ */
(function () {
  "use strict";

  var LINKS = {
    demat: "https://live.meon.co.in/marfatia/individual",
    trade: "https://etrade.marfatia.net/#/app",
    backoffice: "https://backoffice.marfatia.net",
    ipo: "https://ipo.meon.co.in/marfatia",
    rekyc: "https://rekyc.meon.co.in//v1/company/marfatia/modification/login",
    closure: "https://closure.meon.co.in/cloud_closure/closure/Marfatia",
    mf: "https://marfatia.wealthmagic.in/",
    scores: "https://scores.sebi.gov.in",
    odr: "https://smartodr.in/login",
    evoting: "https://evoting.cdslindia.com/Evoting/EvotingLogin",
    playstore: "https://play.google.com/store/apps/details?id=com.msbpl.Share4SurePro",
    appstore: "https://apps.apple.com/in/app/share4surepro/id6446141699"
  };

  var HEADER_HTML =
    '<div class="header-top-bar">' +
    '  <div class="wrap header-top-bar-content">' +
    '    <div class="header-top-bar-info">' +
    '      <span><i class="bi bi-clock-fill"></i> Mon-Fri 10:00 am-6:00 pm</span>' +
    '      <span><i class="bi bi-telephone-fill"></i> 0265-2351355</span>' +
    '      <span><i class="bi bi-envelope-fill"></i> customercare@marfatia.net</span>' +
    '    </div>' +
    '    <a href="#" class="blink-link" id="voluntaryFreezingLink">Voluntary Freezing/Blocking of Trading Account by Client</a>' +
    '  </div>' +
    '</div>' +
    '<div class="strip-row">' +
    '<a href="index.html" class="strip-logo">' +
    '<img class="logo-light" src="content/logo.png" alt="Marfatia Stock Broking">' +
    '<img class="logo-dark" src="content/marfatia-white.png" alt="Marfatia Stock Broking">' +
    '</a>' +
    '<nav class="strip-nav" id="stripNav">' +
    '<div class="nav-item"><a class="strip-link" href="index.html">Home</a></div>' +
    '<div class="nav-item"><a class="strip-link" href="#">About Us</a></div>' +
    '<div class="nav-item">' +
    '  <button class="strip-link" data-drawer="services">Services</button>' +
    '  <div class="nav-dropdown services-grid-dropdown">' +
    '    <div class="dropdown-column">' +
    '      <a href="depository-participant.html" class="dd-item">' +
    '        <div class="dd-icon"><i class="bi bi-safe"></i></div>' +
    '        <div class="dd-text"><h4>DP</h4><p>Secure custody of stocks &amp; securities</p></div>' +
    '      </a>' +
    '      <a href="pms.html" class="dd-item">' +
    '        <div class="dd-icon"><i class="bi bi-briefcase"></i></div>' +
    '        <div class="dd-text"><h4>PMS</h4><p>Expert-managed customized portfolios</p></div>' +
    '      </a>' +
    '      <a href="mtf.html" class="dd-item">' +
    '        <div class="dd-icon"><i class="bi bi-percent"></i></div>' +
    '        <div class="dd-text"><h4>MTF</h4><p>Up to 4x leverage to buy stocks</p></div>' +
    '      </a>' +
    '      <a href="slbm.html" class="dd-item">' +
    '        <div class="dd-icon"><i class="bi bi-arrow-left-right"></i></div>' +
    '        <div class="dd-text"><h4>SLB</h4><p>Lend idle stocks to earn extra yield</p></div>' +
    '      </a>' +
    '      <a href="egr.html" class="dd-item">' +
    '        <div class="dd-icon"><i class="bi bi-gem"></i></div>' +
    '        <div class="dd-text"><h4>EGR</h4><p>Trade physical gold digitally</p></div>' +
    '      </a>' +
    '      <a href="equity-cash.html" class="dd-item">' +
    '        <div class="dd-icon"><i class="bi bi-cash-stack"></i></div>' +
    '        <div class="dd-text"><h4>Cash cm</h4><p>Delivery and intraday share trading</p></div>' +
    '      </a>' +
    '      <a href="derivatives-fo.html" class="dd-item">' +
    '        <div class="dd-icon"><i class="bi bi-graph-up-arrow"></i></div>' +
    '        <div class="dd-text"><h4>FO Derivative</h4><p>Trade market indices &amp; stock futures</p></div>' +
    '      </a>' +
    '    </div>' +
    '    <div class="dropdown-column">' +
    '      <a href="etf.html" class="dd-item">' +
    '        <div class="dd-icon"><i class="bi bi-layers"></i></div>' +
    '        <div class="dd-text"><h4>ETF</h4><p>Instant diversification via market baskets</p></div>' +
    '      </a>' +
    '      <a href="ipo.html" class="dd-item">' +
    '        <div class="dd-icon"><i class="bi bi-lightning"></i></div>' +
    '        <div class="dd-text"><h4>IPO</h4><p>Apply for upcoming public issues</p></div>' +
    '      </a>' +
    '      <a href="bond.html" class="dd-item">' +
    '        <div class="dd-icon"><i class="bi bi-bank"></i></div>' +
    '        <div class="dd-text"><h4>Bond</h4><p>Safe fixed-income investment options</p></div>' +
    '      </a>' +
    '      <a href="insurance.html" class="dd-item">' +
    '        <div class="dd-icon"><i class="bi bi-shield-check"></i></div>' +
    '        <div class="dd-text"><h4>Insurance</h4><p>Protect your health, life &amp; assets</p></div>' +
    '      </a>' +
    '      <a href="mutual-funds.html" class="dd-item">' +
    '        <div class="dd-icon"><i class="bi bi-pie-chart"></i></div>' +
    '        <div class="dd-text"><h4>MF</h4><p>Top mutual funds for every budget</p></div>' +
    '      </a>' +
    '      <a href="algo-trading.html" class="dd-item">' +
    '        <div class="dd-icon"><i class="bi bi-cpu-fill"></i></div>' +
    '        <div class="dd-text"><h4>Algo Trading</h4><p>Rule-based automated execution</p></div>' +
    '      </a>' +
    '      <a href="discount-broking.html" class="dd-item">' +
    '        <div class="dd-icon"><i class="bi bi-tags"></i></div>' +
    '        <div class="dd-text"><h4>Discount Broking</h4><p>Smart trading with low brokerage</p></div>' +
    '      </a>' +
    '    </div>' +
    '  </div>' +
    '</div>' +
    '<div class="nav-item"><a class="strip-link" href="#">Pricing</a></div>' +
    '<div class="nav-item">' +
    '  <button class="strip-link" data-drawer="calculators">Calculators</button>' +
    '  <div class="nav-dropdown calculators-dropdown">' +
    '    <div class="dropdown-column">' +
    '      <a href="#" class="dd-item-simple">Interest</a>' +
    '      <a href="#" class="dd-item-simple">SIP</a>' +
    '      <a href="#" class="dd-item-simple">Brokerage</a>' +
    '      <a href="#" class="dd-item-simple">Margin</a>' +
    '      <a href="#" class="dd-item-simple">CAGR</a>' +
    '      <a href="#" class="dd-item-simple">SWP</a>' +
    '    </div>' +
    '    <div class="dropdown-column">' +
    '      <a href="#" class="dd-item-simple">FD</a>' +
    '      <a href="#" class="dd-item-simple">RD</a>' +
    '      <a href="#" class="dd-item-simple">Lump sum</a>' +
    '      <a href="#" class="dd-item-simple">Future Value</a>' +
    '      <a href="#" class="dd-item-simple">EMI</a>' +
    '      <a href="#" class="dd-item-simple">Option Value</a>' +
    '    </div>' +
    '  </div>' +
    '</div>' +
    '<div class="nav-item"><a class="strip-link" href="#">Partner With Us</a></div>' +
    '<div class="nav-item"><a class="strip-link" href="#">Contact Us</a></div>' +
    '</nav>' +
    '<div class="strip-right">' +
    '<div class="login-dd" id="loginDd">' +
    '<button class="btn btn-ghost login-dd-trigger" id="loginDdTrigger">Login <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
    '<div class="login-dd-menu" id="loginDdMenu">' +
    '<a href="' + LINKS.trade + '" target="_blank" rel="noopener">Traders \u2197</a>' +
    '<a href="' + LINKS.backoffice + '" target="_blank" rel="noopener">Back Office \u2197</a>' +
    '<a href="' + LINKS.trade + '" target="_blank" rel="noopener">Client \u2197</a>' +
    '</div></div>' +
    '<a href="' + LINKS.demat + '" target="_blank" rel="noopener" class="btn btn-marfatia"><span>Open Demat Account</span></a>' +
    '</div>' +
    '<button class="strip-burger" id="stripBurger" aria-label="Menu"><span></span><span></span><span></span></button>' +
    '</div>' +
    '<div class="nav-backdrop" id="navBackdrop"></div>';

  var FOOTER_HTML =
    '<img class="footer-skyline" src="content/img/skyline.png" alt="" aria-hidden="true">' +
    '<div class="footer-glow" aria-hidden="true"></div>' +
    '<div class="footer-top"><h2>Ready to trade<br><em>on your terms?</em></h2>' +
    '<a href="' + LINKS.demat + '" target="_blank" rel="noopener" class="btn btn-accent btn-lg magnetic"><span>Open Demat Account \u2192</span></a></div>' +
    '<div class="footer-locate">' +
    '<a class="footer-map-compact" href="https://maps.app.goo.gl/VgQeNhWqs4mZZX2x9" target="_blank" rel="noopener">' +
    '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29529.76494906829!2d73.13594341083983!3d22.307494600000027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc8afb052a7d9%3A0xe7ea93d6d56a1976!2sMarfatia%20Stock%20Broking%20PVT%20LTD.!5e0!3m2!1sen!2sin!4v1783753821164!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>' +
    '<span class="footer-map-tag mono">\uD83D\uDCCD Open in Maps</span></a>' +
    '<div class="footer-reviews-compact">' +
    '<div class="google-badge"><svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.6H24v9h11.9c-.5 2.8-2.1 5.1-4.4 6.7v5.5h7.1c4.2-3.9 6.5-9.6 6.5-16.6z"/><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.8 28.2c-.4-1.3-.7-2.7-.7-4.2s.2-2.9.7-4.2v-5.7H4.5C3 17 2 20.4 2 24s1 7 4.5 9.9l7.3-5.7z"/><path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.4 2 8.1 7 4.5 14.1l7.3 5.7c1.7-5.2 6.5-9 12.2-9z"/></svg>' +
    '<span><b>4.8</b>/5 \u00B7 2,400+ Reviews</span></div>' +
    '<p class="footer-review-line mb-0">\u201CSwitched from a legacy broker \u2014 the algo automation alone paid for the switch.\u201D <span>\u2014 Rohan Kapadia</span></p>' +
    '<a href="https://maps.app.goo.gl/VgQeNhWqs4mZZX2x9" target="_blank" rel="noopener" class="btn btn-outline btn-sm"><span>Write a Review \u2192</span></a>' +
    '</div></div>' +
    '<div class="footer-grid">' +
    '<div class="footer-col footer-col--brand">' +
    '<img class="logo-light" src="content/logo.png" alt="Marfatia Stock Broking">' +
          '<img class="logo-dark" src="content/marfatia-white.png" alt="Marfatia Stock Broking">' +
    '<p>Marfatia Stock Broking Pvt. Ltd. \u2014 SEBI Registered Stock Broker. A trading platform built on real-time intelligence, automation and 30+ years of market trust.</p>' +
    '<address class="footer-address mono"><i class="bi bi-geo-alt-fill"></i> 216-219, Glacier Complex, Jetalpur Road,<br>Vadodara, Gujarat \u2013 390005, India</address>' +
    '<div class="footer-emails mono"><a href="mailto:compliance@marfatia.net"><i class="bi bi-envelope-fill"></i> compliance@marfatia.net</a><a href="mailto:customercare@marfatia.net"><i class="bi bi-envelope-fill"></i> customercare@marfatia.net</a></div>' +
    '<div class="footer-social">' +
    '<a href="https://www.facebook.com/profile.php?id=61590507447571" target="_blank" rel="noopener" class="footer-social-ico" aria-label="Facebook"><i class="bi bi-facebook"></i></a>' +
    '<a href="https://www.instagram.com/marfatiastockbroking/" target="_blank" rel="noopener" class="footer-social-ico" aria-label="Instagram"><i class="bi bi-instagram"></i></a>' +
    '<a href="https://t.me/MarfatiaStockBroking" target="_blank" rel="noopener" class="footer-social-ico" aria-label="Telegram"><i class="bi bi-telegram"></i></a>' +
    '<a href="https://www.youtube.com/@MarfatiaStockBroking" target="_blank" rel="noopener" class="footer-social-ico" aria-label="YouTube"><i class="bi bi-youtube"></i></a>' +
    '<a href="https://whatsapp.com/channel/0029VbA6L3M7YSd8T7Yxyz" target="_blank" rel="noopener" class="footer-social-ico" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>' +
    '<a href="https://www.linkedin.com/company/marfatiastockbroking" target="_blank" rel="noopener" class="footer-social-ico" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>' +
    '<a href="https://medium.com/@marfatiastockbroking" target="_blank" rel="noopener" class="footer-social-ico" aria-label="Medium"><i class="bi bi-medium"></i></a>' +
    '<a href="https://in.pinterest.com/Marfatiabroking/" target="_blank" rel="noopener" class="footer-social-ico" aria-label="Pinterest"><i class="bi bi-pinterest"></i></a>' +
    '<a href="https://www.marfatia.net" target="_blank" rel="noopener" class="footer-social-ico" aria-label="Website"><i class="bi bi-globe"></i></a>' +
    '</div></div>' +
    '<div class="footer-col"><h5>Quick Links</h5>' +
    '<a href="index.html"><i class="bi bi-house-door"></i> Home</a><a href="#"><i class="bi bi-info-circle"></i> About Us</a><a href="#"><i class="bi bi-people"></i> Key Managerial Personnels</a><a href="#"><i class="bi bi-chat-left-text"></i> Feedback &amp; Queries</a><a href="#"><i class="bi bi-telephone"></i> Contact Us</a><a href="#"><i class="bi bi-geo-alt"></i> Office Addresses</a><a href="#"><i class="bi bi-download"></i> New Downloads</a><a href="#"><i class="bi bi-play-btn"></i> News</a><a href="#"><i class="bi bi-images"></i> Gallery</a></div>' +
    '<div class="footer-col"><h5>Downloads &amp; Forms</h5>' +
    '<a href="https://api.marfatia.net/api/files/NEWKYCFORM 1.pdf" target="_blank" rel="noopener"><i class="bi bi-file-earmark-person"></i> Client Reg. Form (KYC)</a><a href="#"><i class="bi bi-folder2-open"></i> Download Forms Area</a><a href="#"><i class="bi bi-file-earmark-arrow-down"></i> NSE Exchange Margin File</a><a href="https://api.marfatia.net/api/files/VERNACULAR_LANGUAGES.pdf" target="_blank" rel="noopener"><i class="bi bi-translate"></i> Vernacular Languages</a><a href="#"><i class="bi bi-credit-card"></i> Withdraw Funds</a><a href="https://api.marfatia.net/api/files/StepbyStep-Procedure-for-Account-opening.pdf" target="_blank" rel="noopener"><i class="bi bi-book"></i> eKYC Step-by-Step Guide</a></div>' +
    '<div class="footer-col"><h5>Compliance &amp; Legal</h5>' +
    '<a href="#"><i class="bi bi-shield-lock"></i> Privacy Policy</a><a href="#"><i class="bi bi-file-earmark-check"></i> Terms &amp; Conditions</a><a href="#"><i class="bi bi-exclamation-triangle"></i> Disclaimer Policy</a><a href="https://api.marfatia.net/api/files/Policies and circular.pdf" target="_blank" rel="noopener"><i class="bi bi-file-earmark-text"></i> Policies and Circulars</a><a href="https://api.marfatia.net/api/files/MSBPL_PMS_Doslosure_Document-Oct_2024.pdf" target="_blank" rel="noopener"><i class="bi bi-journal-text"></i> PMS Disclosure Document</a><a href="https://api.marfatia.net/api/files/FilingComplaints on SCORES.pdf" target="_blank" rel="noopener"><i class="bi bi-question-circle"></i> How to File Complaints</a><a href="#"><i class="bi bi-megaphone"></i> Advisory for Investors</a><a href="#"><i class="bi bi-award"></i> Investor Charters</a><a href="#"><i class="bi bi-graph-up"></i> Investor Rights &amp; Responsibilities</a><a href="#"><i class="bi bi-clipboard-check"></i> Advisory \u2014 KYC Compliance</a><a href="' + LINKS.odr + '" target="_blank" rel="noopener"><i class="bi bi-cpu-fill"></i> Smart ODR Portal \u2197</a><a href="' + LINKS.scores + '" target="_blank" rel="noopener"><i class="bi bi-safe"></i> SEBI SCORES \u2197</a></div>' +
    '</div>' +
    '<div class="footer-regbar">' +
    '<span class="mono">Member Code NSE: 11925</span><span class="mono">Member Code BSE: 3065</span><span class="mono">SEBI Reg. No: INZ000215330</span><span class="mono">PMS SEBI Reg. No: INP000005117</span><span class="mono">Research Analyst SEBI Reg. No: INH000002178</span><span class="mono">Depository Participant: CDSL (DP ID: 12044400)</span>' +
    '</div>' +
    '<div class="footer-assoc"><span>SEBI</span><span>NSE</span><span>BSE</span><span>CDSL</span><span>NSDL</span><span>MCX</span><span>NCDEX</span><span>RBI</span></div>' +
    '<div class="footer-disclaimer">' +
    '<p>Investments in securities market are subject to market risks. Read all the related documents carefully before investing. Marfatia Stock Broking Pvt. Ltd. is a SEBI Registered Stock Broker, Portfolio Manager and Research Analyst. Member: NSE, BSE, MCX. Registered Office: Vadodara, Gujarat, India.</p>' +
    '<p class="footer-copy">\u00A9 <span id="year"></span> Marfatia Stock Broking Pvt. Ltd. All Rights Reserved. Powered By: Barodaweb</p>' +
    '</div>';

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- inject header / footer ---------- */
    var header = $("#siteHeader");
    if (header) { header.className = "strip"; header.id = "strip"; header.innerHTML = HEADER_HTML; }
    var footer = $("#siteFooter");
    if (footer) {
      footer.className = "site-footer";
      footer.id = "footer";
      footer.innerHTML = FOOTER_HTML;
      /* inject scroll-to-top button after footer, same as index.html */
      var toTop = document.createElement("button");
      toTop.className = "to-top";
      toTop.id = "toTop";
      toTop.setAttribute("aria-label", "Back to top");
      toTop.innerHTML =
        '<svg class="to-top-ring" viewBox="0 0 44 44" aria-hidden="true">' +
        '<circle class="to-top-track" cx="22" cy="22" r="19"></circle>' +
        '<circle class="to-top-prog" id="toTopProg" cx="22" cy="22" r="19"></circle></svg>' +
        '<svg class="to-top-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M12 19V6M6 12l6-6 6 6"/></svg>';
      footer.parentNode.insertBefore(toTop, footer.nextSibling);
      toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
      window.addEventListener("scroll", function () {
        toTop.classList.toggle("visible", window.scrollY > 300);
        var pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        var prog = document.getElementById("toTopProg");
        if (prog) prog.style.strokeDashoffset = 119.4 * (1 - pct);
      }, { passive: true });
    }

    var yearEl = $("#year"); if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* highlight current page in drawers */
    var here = location.pathname.split("/").pop() || "index.html";
    $$(".drawer-group a, .strip-nav a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === here) a.classList.add("here");
    });

    /* ---------- nav behaviour (mirrors homepage main.js) ---------- */
    var strip = $("#strip");
    function setHeaderHeightVar() {
      if (strip) document.documentElement.style.setProperty("--header-h", strip.offsetHeight + "px");
    }
    setHeaderHeightVar();
    window.addEventListener("load", setHeaderHeightVar);
    window.addEventListener("resize", setHeaderHeightVar);
    window.addEventListener("scroll", function () {
      if (strip) strip.classList.toggle("scrolled", window.scrollY > 30);
      setHeaderHeightVar();
    }, { passive: true });

    var stripNav = $("#stripNav"), stripBurger = $("#stripBurger"), navBackdrop = $("#navBackdrop");
    function isMobileNav() { return window.matchMedia("(max-width:1150px)").matches; }

    function closeAllDrawers() {
      $$(".nav-item.open").forEach(function (i) { i.classList.remove("open"); });
      $$(".strip-link.sub-open").forEach(function (b) { b.classList.remove("sub-open"); });
      $$(".mobile-sub").forEach(function (s) { s.style.maxHeight = ""; });
    }
    function closeMobileMenu() {
      if (!stripNav) return;
      stripNav.classList.remove("open");
      if (stripBurger) stripBurger.classList.remove("open");
      document.body.classList.remove("menu-open");
      closeAllDrawers();
    }
    if (stripBurger && stripNav) {
      stripBurger.addEventListener("click", function () {
        var opening = !stripNav.classList.contains("open");
        stripNav.classList.toggle("open", opening);
        stripBurger.classList.toggle("open", opening);
        document.body.classList.toggle("menu-open", opening);
        if (!opening) closeAllDrawers();
      });
    }
    if (navBackdrop) navBackdrop.addEventListener("click", closeMobileMenu);

    /* build a plain mobile accordion list (title-only links) for every
       Services/Calculators nav item — the icon+description mega-menu grid
       is desktop-only; mobile reuses the same .mobile-sub pattern as Login */
    $$(".nav-item").forEach(function (item) {
      var btn = item.querySelector(".strip-link[data-drawer]");
      var dropdown = item.querySelector(".nav-dropdown");
      if (!btn || !dropdown) return;
      var sub = document.createElement("div");
      sub.className = "mobile-sub";
      var group = document.createElement("div");
      group.className = "drawer-group";
      $$(".dd-item, .dd-item-simple", dropdown).forEach(function (a) {
        var link = document.createElement("a");
        link.href = a.getAttribute("href") || "#";
        var title = a.querySelector(".dd-text h4");
        link.textContent = title ? title.textContent : a.textContent.trim();
        group.appendChild(link);
      });
      sub.appendChild(group);
      btn.insertAdjacentElement("afterend", sub);
    });

    /* mobile menu: mirror header-right links (login + CTA) into the side nav */
    (function () {
      var loginMenu = $("#loginDdMenu"), dematBtn = $(".strip-right .btn-marfatia");
      if (stripNav && loginMenu) {
        var loginBtn = document.createElement("button");
        loginBtn.type = "button";
        loginBtn.className = "strip-link mobile-only";
        loginBtn.dataset.drawer = "";
        loginBtn.textContent = "Login";
        var loginSub = document.createElement("div");
        loginSub.className = "mobile-sub";
        var group2 = document.createElement("div");
        group2.className = "drawer-group";
        group2.innerHTML = loginMenu.innerHTML;
        loginSub.appendChild(group2);
        stripNav.appendChild(loginBtn);
        stripNav.appendChild(loginSub);
      }

      if (dematBtn) {
        var cta = dematBtn.cloneNode(true);
        cta.classList.add("mobile-only", "mobile-cta");
        if (stripNav) stripNav.appendChild(cta);
      }
    })();

    /* unified accordion toggle — Services / Calculators / Login all share
       the same button + adjacent .mobile-sub pattern on mobile; desktop
       keeps the original .nav-item.open + .nav-dropdown mega-menu untouched */
    $$(".strip-link[data-drawer]").forEach(function (btn) {
      btn.setAttribute("type", "button");
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var sub = btn.nextElementSibling;
        if (isMobileNav() && sub && sub.classList.contains("mobile-sub")) {
          var opening = !btn.classList.contains("sub-open");
          closeAllDrawers();
          if (opening) { btn.classList.add("sub-open"); sub.style.maxHeight = sub.scrollHeight + "px"; }
          return;
        }
        var item = btn.closest(".nav-item");
        if (!item) return;
        var wasOpen = item.classList.contains("open");
        closeAllDrawers();
        if (!wasOpen) item.classList.add("open");
      });
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".nav-item")) {
        closeAllDrawers();
      }
    });

    var loginDd = $("#loginDd"), loginDdTrigger = $("#loginDdTrigger");
    if (loginDdTrigger) {
      loginDdTrigger.addEventListener("click", function (e) { e.stopPropagation(); loginDd.classList.toggle("open"); });
      document.addEventListener("click", function (e) { if (!e.target.closest("#loginDd")) loginDd.classList.remove("open"); });
    }

    /* live index roll */
    var stripPrice = 24812;
    if ($("#stripIndex")) setInterval(function () {
      stripPrice += (Math.random() * 30 - 14);
      $("#stripIndexValue").textContent = Math.round(stripPrice).toLocaleString("en-IN");
      var chgEl = $("#stripIndexChg");
      var pct = ((stripPrice - 24812) / 24812 * 100);
      chgEl.textContent = (pct >= 0 ? "+" : "") + pct.toFixed(2) + "%";
      chgEl.className = "si-chg " + (pct >= 0 ? "up" : "down");
    }, 2400);

    /* ---------- reveal on scroll ---------- */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    $$("[data-reveal]").forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 8, 5) * 60) + "ms";
      io.observe(el);
    });

    /* ---------- counters ---------- */
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        var el = en.target, target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "";
        var dur = 1200, t0 = null;
        function tick(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / dur, 1);
          p = 1 - Math.pow(1 - p, 3);
          var v = Math.round(target * p);
          el.textContent = v.toLocaleString("en-IN") + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    $$("[data-count]").forEach(function (el) { cio.observe(el); });

    /* ---------- tabs ---------- */
    $$("[data-tabs]").forEach(function (group) {
      var btns = $$(".tab-btn", group);
      btns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          btns.forEach(function (b) { b.classList.remove("active"); });
          btn.classList.add("active");
          var scope = group.dataset.tabs ? document : group.parentElement;
          $$('.tab-panel[data-tab-group="' + (group.dataset.tabs || "") + '"]', scope.body ? document : scope).forEach(function (p) {
            p.classList.toggle("active", p.dataset.panel === btn.dataset.tab);
          });
        });
      });
    });

    /* ---------- accordions ---------- */
    $$(".acc-head").forEach(function (head) {
      head.addEventListener("click", function () {
        var acc = head.parentElement, body = $(".acc-body", acc);
        var open = acc.classList.contains("open");
        if (open) { body.style.maxHeight = "0"; acc.classList.remove("open"); }
        else { acc.classList.add("open"); body.style.maxHeight = body.scrollHeight + "px"; }
      });
    });

    /* ---------- zero complaint tables (compliance pages) ----------
       <div data-zerotable='{"cols":[...], "rows":[...] , "extra":n}'>  */
    $$("[data-zerotable]").forEach(function (host) {
      try {
        var cfg = JSON.parse(host.dataset.zerotable);
        var html = '<div class="table-wrap"><table class="dtable dtable--zero"><thead><tr><th>S.No</th>';
        cfg.cols.forEach(function (c) { html += "<th>" + c + "</th>"; });
        html += "</tr></thead><tbody>";
        cfg.rows.forEach(function (r, i) {
          html += "<tr><td>" + (i + 1) + "</td><td>" + r + "</td>";
          for (var k = 0; k < cfg.cols.length - 1; k++) html += "<td>0</td>";
          html += "</tr>";
        });
        html += '<tr><td></td><td><b>Grand Total</b></td>';
        for (var k2 = 0; k2 < cfg.cols.length - 1; k2++) html += "<td>0</td>";
        html += "</tr></tbody></table></div>";
        host.innerHTML = html;
      } catch (e) { /* leave empty */ }
    });

    /* ---------- legal TOC scroll-spy ---------- */
    var tocLinks = $$(".legal-toc a");
    if (tocLinks.length) {
      var secs = tocLinks.map(function (a) { return $(a.getAttribute("href")); }).filter(Boolean);
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            tocLinks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id); });
          }
        });
      }, { rootMargin: "-20% 0px -70% 0px" });
      secs.forEach(function (s) { spy.observe(s); });
    }

    /* ---------- sticky mobile CTA ---------- */
    var msticky = $(".msticky");
    if (msticky) {
      window.addEventListener("scroll", function () {
        msticky.classList.toggle("show", window.scrollY > 420);
      }, { passive: true });
    }

    /* ---------- generic API form handler ----------
       <form data-api="https://api.marfatia.net/api/feedback"> */
    $$("form[data-api]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var msg = $(".f-msg", form);
        var data = {};
        $$("input,textarea,select", form).forEach(function (f) { if (f.name) data[f.name] = f.value; });
        var btn = $('button[type="submit"]', form);
        if (btn) { btn.disabled = true; btn.style.opacity = .6; }
        fetch(form.dataset.api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }).then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          if (msg) { msg.className = "f-msg ok"; msg.textContent = "Thank you — your submission has been received. Our team will get back to you shortly."; }
          form.reset();
        }).catch(function () {
          if (msg) { msg.className = "f-msg err"; msg.innerHTML = "We couldn't submit this right now. Please email us directly at <a href='mailto:customercare@marfatia.net'>customercare@marfatia.net</a> or call 0265-2351355."; }
        }).finally(function () {
          if (btn) { btn.disabled = false; btn.style.opacity = 1; }
        });
      });
    });

    /* ---------- Voluntary Freezing Modal Injection and Wiring ---------- */
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

  });

  window.MARFATIA_LINKS = LINKS;
})();

/* ---------------- theme toggle (dark mode) ---------------- */
(function(){
  const btn = document.querySelector("#themeToggleBtn");
  if(!btn) return;

  btn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if(isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });
})();
