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
    '<div class="footer-brand-section">' +
    '<div class="footer-brand-logo">' +
    '<img class="logo-light" src="content/logo.png" alt="Marfatia Stock Broking">' +
    '<img class="logo-dark" src="content/marfatia-white.png" alt="Marfatia Stock Broking">' +
    '</div>' +
    '<div class="footer-brand-content">' +
    // '<p class="footer-brand-desc">Marfatia Stock Broking Private Limited (MARFATIA) Member of SEBI, NSE, BSE and CDSL \u2013 CIN U67120GJ2002PTC041373</p>' +
    '<div class="footer-brand-info-grid">' +
    '<div class="footer-contact-card">' +
    '<div class="fcc-item"><i class="bi bi-geo-alt-fill"></i><div><strong>Registered &amp; Correspondence Office Address:</strong><span>308 \u2013 311 Glacier Complex Jetalpur Road,<br>Vadodara 390007 Gujarat INDIA</span></div></div>' +
    '<div class="fcc-item"><i class="bi bi-telephone-fill"></i><span>18005702650 / 0265-2351355 / 0265-2351513</span></div>' +
    '<div class="fcc-item"><i class="bi bi-envelope-fill"></i><a href="mailto:compliance@marfatia.net">compliance@marfatia.net</a></div>' +
    '<div class="fcc-item"><i class="bi bi-globe"></i><a href="https://www.marfatia.net" target="_blank" rel="noopener">www.marfatia.net</a></div>' +
    '</div>' +
    '<div class="footer-brand-meta">' +
    '<div class="footer-compliance-card"><strong>Compliance Officer:</strong> Mr. Chintan Majumdar</div>' +
    '<div class="footer-social mt-3">' +
    '<a href="https://www.facebook.com/profile.php?id=61590507447571" target="_blank" rel="noopener" class="footer-social-ico" aria-label="Facebook"><i class="bi bi-facebook"></i></a>' +
    '<a href="https://www.instagram.com/marfatiastockbroking/" target="_blank" rel="noopener" class="footer-social-ico" aria-label="Instagram"><i class="bi bi-instagram"></i></a>' +
    '<a href="https://t.me/MarfatiaStockBroking" target="_blank" rel="noopener" class="footer-social-ico" aria-label="Telegram"><i class="bi bi-telegram"></i></a>' +
    '<a href="https://www.youtube.com/@MarfatiaStockBroking" target="_blank" rel="noopener" class="footer-social-ico" aria-label="YouTube"><i class="bi bi-youtube"></i></a>' +
    '<a href="https://whatsapp.com/channel/0029VbA6L3M7YSd8T7Yxyz" target="_blank" rel="noopener" class="footer-social-ico" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>' +
    '<a href="https://www.linkedin.com/company/marfatiastockbroking" target="_blank" rel="noopener" class="footer-social-ico" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>' +
    '<a href="https://medium.com/@marfatiastockbroking" target="_blank" rel="noopener" class="footer-social-ico" aria-label="Medium"><i class="bi bi-medium"></i></a>' +
    '<a href="https://in.pinterest.com/Marfatiabroking/" target="_blank" rel="noopener" class="footer-social-ico" aria-label="Pinterest"><i class="bi bi-pinterest"></i></a>' +
    '<a href="https://www.marfatia.net" target="_blank" rel="noopener" class="footer-social-ico" aria-label="Website"><i class="bi bi-globe"></i></a>' +
    '</div></div></div></div></div>' +
    '<div class="footer-links-grid">' +
    '<div class="footer-col"><h5>Quick Links</h5>' +
    '<a href="index.html"><i class="bi bi-house-door"></i> Home</a><a href="about.html"><i class="bi bi-info-circle"></i> About Us</a><a href="feedback.html"><i class="bi bi-chat-left-text"></i> Feedback &amp; Queries</a><a href="contact-us.html"><i class="bi bi-telephone"></i> Contact Us</a><a href="new-downloads.html"><i class="bi bi-download"></i> New Downloads</a><a href="https://attendee.gotowebinar.com/pageNotFound.tmpl" target="_blank" rel="noopener"><i class="bi bi-play-btn"></i> Webinar</a><a href="http://203.88.142.27:8181/webmail3/" target="_blank" rel="noopener"><i class="bi bi-envelope-open"></i> Web Mail Login</a></div>' +
    '<div class="footer-col"><h5>Grievance Resolution</h5>' +
    '<a href="complaints.html"><i class="bi bi-shield-exclamation"></i> Complaint to Marfatia</a><a href="https://api.marfatia.net/api/files/FilingComplaints.pdf" target="_blank" rel="noopener"><i class="bi bi-file-pdf"></i> Filing Complaints</a><a href="https://scores.sebi.gov.in/" target="_blank" rel="noopener"><i class="bi bi-shield-check"></i> SEBI Score Portal</a><a href="' + LINKS.odr + '" target="_blank" rel="noopener"><i class="bi bi-cpu"></i> Smart ODR</a><a href="contact-us.html"><i class="bi bi-envelope"></i> Quick Contact Form</a>' +
    '<h5 style="margin-top:20px;">Investor Awareness</h5>' +
    '<a href="https://investor.sebi.gov.in/" target="_blank" rel="noopener"><i class="bi bi-info-circle"></i> SEBI Investor</a><a href="https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListingAll=yes" target="_blank" rel="noopener"><i class="bi bi-file-text"></i> SEBI Circular</a><a href="https://www.nseindia.com/resources/exchange-communication-circulars" target="_blank" rel="noopener"><i class="bi bi-file-text"></i> NSE Circular</a><a href="https://www.bseindia.com/markets/marketinfo/noticescirculars?id=0" target="_blank" rel="noopener"><i class="bi bi-file-text"></i> BSE Circular</a><a href="https://www.cdslindia.com/eservices/Publications/Communique" target="_blank" rel="noopener"><i class="bi bi-file-text"></i> CDSL Circular</a>' +
    '<h5 style="margin-top:20px;">Grievance Resolution</h5>' +
    '<a href="https://investorhelpline.nseclearing.in/ClientCollateral/welcomeCLUser" target="_blank" rel="noopener"><i class="bi bi-briefcase"></i> Collateral NCL</a><a href="' + LINKS.evoting + '" target="_blank" rel="noopener"><i class="bi bi-check2-square"></i> CDSL E Voting</a></div>' +
    '<div class="footer-col"><h5>Marfatia Services</h5>' +
    '<a href="https://api.marfatia.net/api/files/NEWKYCFORM.pdf" target="_blank" rel="noopener"><i class="bi bi-file-earmark-person"></i> Client Registration Form</a><a href="https://api.marfatia.net/api/files/AUTHORISED_PERSON_LIST.pdf" target="_blank" rel="noopener"><i class="bi bi-person-badge"></i> Authorised Person List</a><a href="new-downloads.html"><i class="bi bi-folder2-open"></i> Download Forms</a><a href="client-bank-accounts.html"><i class="bi bi-bank"></i> Details of Client Bank Account</a><a href="https://api.marfatia.net/api/files/StepbyStep-Procedure-for-Account-opening.pdf" target="_blank" rel="noopener"><i class="bi bi-book"></i> Step by Step Procedure of eKYC</a><a href="key-managerial-personnel.html"><i class="bi bi-people"></i> Key Managerial Personnels</a><a href="branches.html"><i class="bi bi-geo-alt"></i> Registered Address of Head Office and Branches</a><a href="privacy-policy.html"><i class="bi bi-shield-lock"></i> Privacy Policy</a><a href="https://api.marfatia.net/api/files/Policies%20and%20Circulars.rar" target="_blank" rel="noopener"><i class="bi bi-file-text"></i> Policies and Circulars</a><a href="https://api.marfatia.net/api/files/VERNACULAR_LANGUAGES.rar" target="_blank" rel="noopener"><i class="bi bi-translate"></i> Vernacular Languages</a></div>' +
    '<div class="footer-col"><h5>Disclosures</h5>' +
    '<a href="dos-and-donts.html"><i class="bi bi-check2-circle"></i> Do\u2019s &amp; Don\u2019ts</a><a href="https://api.marfatia.net/api/files/MSBPL_PMS_Doslosure_Document-Oct_2024.pdf" target="_blank" rel="noopener"><i class="bi bi-journal-text"></i> PMS Disclosure Documents</a><a href="advisory-for-investors.html"><i class="bi bi-exclamation-triangle"></i> Caution for Investor</a><a href="terms-of-use.html"><i class="bi bi-file-earmark-text"></i> Terms &amp; Condition</a><a href="disclaimer.html"><i class="bi bi-file-earmark-break"></i> Disclaimer</a><a href="advisory-kyc-compliance.html"><i class="bi bi-check2-square"></i> Advisory KYC Compliance</a><a href="exchange-sebi-registration.html"><i class="bi bi-card-checklist"></i> Exchange/SEBI Registration Details</a>' +
    '<h5 style="margin-top:20px;">Investor Charter</h5>' +
    '<a href="investor-charter-stockbroker.html"><i class="bi bi-award"></i> Stock Broker</a><a href="investor-charter-dp.html"><i class="bi bi-shield-check"></i> Depository Participant</a><a href="investor-charter-pms.html"><i class="bi bi-pie-chart"></i> Portfolio Manager</a><a href="investor-charter-research-analyst.html"><i class="bi bi-person-lines-fill"></i> Research Analyst</a></div>' +
    '</div>' +
    '<div class="footer-regbar">' +
    '<span class="mono">SEBI Reg. No.: - INZ000215330</span><span class="mono">Member Code NSE: - 11925</span><span class="mono">Member Code BSE: - 3065</span><span class="mono">PMS SEBI Registration No.: INP000005117</span><span class="mono">DP SEBI Reg. No.:- IN-DP-CDSL-227-2016 - DP: CDSL - DP ID: 12044400</span>' +
    '</div>' +
    '<div class="footer-assoc"><span>SEBI</span><span>NSE</span><span>BSE</span><span>CDSL</span><span>NSDL</span><span>MCX</span><span>NCDEX</span><span>RBI</span></div>' +
    '<div class="footer-disclaimer" style="text-align: left; font-size: 0.8rem; color: var(--text-muted); line-height: 1.6;">' +
    '<p>Marfatia Stock Broking Private Limited (MARFATIA) Member of SEBI, NSE, BSE and CDSL – CIN U67120GJ2002PTC041373</p>'+
    '<p><strong>SEBI Registration Nos.:</strong> Marfatia Stock Broking Private Limited (MARFATIA), as Stock Broker INZ000215330 (BSE 3065/NSE 11925); as Depository Participant of CDSL: IN-DP-CDSL-227-2016 (12044400); as PMS: INP000005117; Other Registration with: APMI Member ID: 0264; LEI Registration Number 8945005ZUWZL7ILT9V25; ANMI Membership; GST Registration: 24AADCM6730B1ZY; STeADY Registration;</p>' +
    '<p>Please read the Risk Disclosure Document prescribed by the Stock Exchanges carefully before investing. There is no assurance or guarantee of the returns. #Such representations are not indicative of future results. Investment in securities market are subject to market risk, read all the related documents carefully before investing. Fixed returns do not constitute guaranteed or assured returns. Investments in corporate debt securities, municipal debt securities/securitised debt instruments are subject to credit risks, market risks and default risks including delay and/or default in payment. Read all the offer related documents carefully.</p>' +
    '<p><strong>Details of Compliance Officer:</strong> Name: Chintan Majmundar, Email ID: <a href="mailto:compliance@marfatia.net" style="text-decoration: underline; font-weight: 600; color: var(--green, #08753b);">Compliance@marfatia.net</a>, Contact No.: <a href="tel:18005702650" style="text-decoration: underline; font-weight: 600; color: var(--green, #08753b);">18005702650</a> / <a href="tel:02652351355" style="text-decoration: underline; font-weight: 600; color: var(--green, #08753b);">0265-2351355</a> / <a href="tel:02652351513" style="text-decoration: underline; font-weight: 600; color: var(--green, #08753b);">0265-2351513</a>. Customer having any query/feedback/ clarification may write to <a href="mailto:compliance@marfatia.net" style="text-decoration: underline; font-weight: 600; color: var(--green, #08753b);">Compliance@marfatia.net</a>. In case of grievances for services like Stock Broking and Depository services, any other services rendered by Marfatia Stock Broking Private Limited write to <a href="mailto:compliance@marfatia.net" style="text-decoration: underline; font-weight: 600; color: var(--green, #08753b);">Compliance@marfatia.net</a>. Marfatia Stock Broking Private Limited do carry Proprietary trading.</p>' +
    '<p><strong>Attention Investors</strong><br>Stock Brokers can accept securities as margin from clients only by way of pledge in the depository system w.e.f. September 1, 2020.<br>1. Update your mobile number &amp; email Id with your stock broker/depository participant and receive OTP directly from depository on your email id and/or mobile number to create pledge.<br>2. Pay 20% or "var + elm" whichever is higher as upfront margin of the transaction value to trade in cash market segment.<br>3. Investors may please refer to the Exchange\'s Frequently Asked Questions (FAQs) issued vide circular reference NSE/INSP/45191 dated July 31, 2020 and NSE/INSP/45534 and BSE vide notice no. 20200731-7 dated July 31, 2020 and 20200831-45 dated August 31, 2020 dated August 31, 2020 and other guidelines issued from time to time in this regard.<br>4. Check your Securities /MF/ Bonds in the consolidated account statement issued by NSDL/CDSL every month. Issued in the interest of Investors"</p>' +
    '<p><strong>Attention Investors:</strong><br>Facilities available Online: Account Opening, Account Modification, E-DIS, Account closure and more. For further details, please contact our customer care<br>1. Please Linking Your Aadhar With Your Demat Account<br>2. KYC is one time exercise while dealing in securities markets - once KYC is done through a SEBI registered intermediary (Broker, DP, Mutual Fund etc.), you need not undergo the same process again when you approach another intermediary<br>3. For Stock Broking Transaction \'Prevent unauthorised transactions in your account --&gt; Update your mobile numbers/email IDs with your stock brokers. Receive information of your transactions directly from Exchange on your mobile/email at the end of the day...Issued in the interest of Investors.<br>4. For Depository Transaction \'Prevent Unauthorized Transactions in your demat account --&gt; Update your Mobile Number with your Depository Participant. Receive alerts on your Registered Mobile for all debit and other important transactions in your demat account directly from CDSL/NSDL on the same day...Issued in the interest of investors.<br>5. No need to issue cheques by investors while subscribing to IPO. Just write the bank account number and sign in the application form to authorise your bank to make payment in case of allotment. No worries for refund as the money remains in investor\'s account.<br>6. Investors should be cautious on unsolicited emails and SMS advising to buy, sell or hold securities and trade only on the basis of informed decision. Investors are advised to invest after conducting appropriate analysis of respective companies and not to blindly follow unfounded rumours, tips etc. Further, you are also requested to share your knowledge or evidence of systemic wrongdoing, potential frauds or unethical behaviour through the anonymous portal facility provided on BSE &amp; NSE website.<br>7. Filing compliant on SCORES \u2013 Easy &amp; quick - a. register on SCORES portal. b. Mandatory details for filing complaints on SCORES: Name, PAN, Address, Mobile Number, Email ID. c. Benefits: Effective communication. Speedy redressal of the grievances Website: <a href="https://scores.sebi.gov.in/" target="_blank" style="text-decoration: underline; font-weight: 600; color: var(--green, #08753b);">https://scores.sebi.gov.in/</a><br>8. Filing compliant on SCORES - One of the pre requisite to file a complaint in SMART ODR is that investor has to take up the complaint with the intermediary before opting for ODR \u2013 a. Verify Prerequisites: Ensure your complaint has been raised with your broker, depository participant, or listed company, and that you are unsatisfied with their response (or if it remains unresolved beyond 21 days). b. Access Portal: Navigate to the SMART ODR Login Page and click on Create Account to register. c. File New Dispute: After logging in, select File a New Dispute from the sidebar or main menu. d. Select Intermediary: Choose the type of participant (e.g., Stock Broker, Depository Participant, Mutual Fund) and specifically select the entity you are filing against. e. Choose Category: Select the appropriate category and sub-category for your grievance (such as incorrect statement, trade dispute, or non-receipt of funds). f. Enter Details &amp; Upload: Provide a detailed description of your dispute and upload relevant proof(emails, contract notes, screenshots). The file limit is typically 20MB per dispute. f. Submit &amp; Track: Review the summary of your dispute and submit. You can track the progress and status updates directly on your dashboard\'s dispute timeline Website: <a href="https://smartodr.in/login" target="_blank" style="text-decoration: underline; font-weight: 600; color: var(--green, #08753b);">https://smartodr.in/login</a></p>' +
    '<p><strong>Fraud &amp; Investor Alert</strong><br>Important Notice: MARFATIA has become aware of fraudulent activities where unauthorized individuals are misusing our name and brand to deceive the public. These fraudsters may falsely claim to represent MARFATIA and solicit money by offering investment opportunities, brokerage services, mutual fund schemes, personal loans, or guaranteed returns.<br>Please note that MARFATIA has not authorized any third party, agent, advisor, or organization to provide investment advisory services or collect funds on our behalf. We do not share our research reports or clients\' personal or financial information with any unauthorized person.<br>Before acting on any investment offer or making any payment, please verify its authenticity through our official channels. Do not transfer funds or share your personal, banking, or financial details based on unsolicited calls, emails, SMS, WhatsApp messages, or social media communications.<br>For information about our products and services, please visit <a href="https://www.marfatia.net" target="_blank" style="text-decoration: underline; font-weight: 600; color: var(--green, #08753b);">www.marfatia.net</a> or contact us at <a href="mailto:compliance@marfatia.net" style="text-decoration: underline; font-weight: 600; color: var(--green, #08753b);">Compliance@marfatia.net</a>.<br>\u201CInvest wisely. Stay alert. Always deal only through authorized and SEBI-registered intermediaries.\u201D</p>' +
    '<p><strong>Segment Details</strong><br><strong>NSE:</strong> Capital Market (TM) - Enabled, Capital Market (SCM) - Enabled, Future &amp; Options (TM) - Enabled, Future &amp; Options (SCM) - Enabled, Currency Futures (TM) - Disabled, Interest Rate Futures (TM) - Enabled, MFSS - Enabled, Commodity (TM) - Surrendered Membership, Electronic Gold Receipts (TM) - Enabled.<br><strong>BSE:</strong> Commodity Derivatives (TM) - INACTIVE, Equity (TM) - ACTIVE, Currency Derivatives (TM) - ACTIVE, Debt (TM) - INACTIVE, Equity Derivatives (TM) - ACTIVE, StARMF - ACTIVE.</p>' +
    '<p class="footer-copy text-center mt-4">\u00A9 <span id="year"></span> Marfatia Stock Broking Pvt. Ltd. All Rights Reserved. Powered By: Barodaweb</p>' +
    '</div>';

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- header / footer (static in HTML) ---------- */
    var footer = $("#siteFooter") || $("#footer");
    if (footer) {
      /* inject scroll-to-top button after footer, same as index.html */
      if (!document.getElementById("toTop")) {
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
