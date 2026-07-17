/* ============================================================
   MARFATIA PMS — page-specific interaction and GSAP system
   ============================================================ */
(function (window, document) {
  "use strict";

  function initPmsPage() {
    var page = document.querySelector(".pms-page");
    if (!page) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var finePointer = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    var hasMotion = Boolean(gsap && ScrollTrigger && !reduceMotion);

    if (gsap && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    initProgress();
    initHomepageCursor();
    initAccordion();
    initTrustSeal();

    if (!hasMotion) {
      setAllContentVisible();
      initCounters(false);
      return;
    }

    initHero();
    initPmsReveals();
    initStaggers();
    initCounters(true);
    initComparison();
    initResearchProcess();
    initFeatureRows();
    initJourney();
    initProtectionLines();
    initRedesignedSections();
    initBackgroundMotion();
    initMagneticButtons();
    refreshTriggers();

    function initProgress() {
      var progress = document.getElementById("scrollProgress");
      if (!progress) return;

      function update() {
        var root = document.documentElement;
        var distance = root.scrollHeight - root.clientHeight;
        var value = distance > 0 ? root.scrollTop / distance * 100 : 0;
        progress.style.width = Math.min(100, Math.max(0, value)) + "%";
      }

      update();
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update, { passive: true });
    }

    /* Exact homepage canvas cursor: 3 green candles, then 1 red candle. */
    function initHomepageCursor() {
      var canvas = document.getElementById("cursorTrail");
      if (!canvas) return;
      if (!finePointer || reduceMotion) {
        canvas.style.display = "none";
        return;
      }

      var context = canvas.getContext("2d");
      if (!context) return;

      var mouseX = window.innerWidth / 2;
      var mouseY = window.innerHeight / 2;
      var lastX = mouseX;
      var lastY = mouseY;

      window.addEventListener("mousemove", function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
      }, { passive: true });

      function resize() {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      resize();
      window.addEventListener("resize", resize, { passive: true });

      var candles = [];
      var spawnCooldown = 0;
      var lastFrame = performance.now();
      var streakUp = true;
      var streakLeft = 3;

      function random(min, max) {
        return Math.random() * (max - min) + min;
      }

      function nextUp() {
        if (streakLeft <= 0) {
          streakUp = !streakUp;
          streakLeft = streakUp ? 3 : 1;
        }
        streakLeft -= 1;
        return streakUp;
      }

      function spawn(x, y) {
        var up = nextUp();
        var bodyHeight = random(10, 22);
        candles.push({
          x: x,
          y: y,
          bodyHeight: bodyHeight,
          wickHeight: bodyHeight + random(6, 14),
          up: up,
          width: random(4, 6),
          born: performance.now(),
          life: 750,
          driftY: up ? -random(12, 24) : random(12, 24)
        });
        if (candles.length > 50) candles.shift();
      }

      function loop(now) {
        var delta = now - lastFrame;
        lastFrame = now;
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        var deltaY = mouseY - lastY;
        spawnCooldown -= delta;
        if (spawnCooldown <= 0 && (Math.abs(mouseX - lastX) > 2 || Math.abs(deltaY) > 2)) {
          spawn(mouseX, mouseY);
          spawnCooldown = 36;
        }
        lastX = mouseX;
        lastY = mouseY;

        for (var index = candles.length - 1; index >= 0; index -= 1) {
          var candle = candles[index];
          var progress = (now - candle.born) / candle.life;
          if (progress >= 1) {
            candles.splice(index, 1);
            continue;
          }

          var y = candle.y + candle.driftY * progress;
          context.globalAlpha = (1 - progress) * .85;
          var color = candle.up ? "#08753B" : "#C24A3F";
          context.strokeStyle = color;
          context.fillStyle = color;
          context.lineWidth = 1.4;
          context.beginPath();
          context.moveTo(candle.x, y - candle.wickHeight / 2);
          context.lineTo(candle.x, y + candle.wickHeight / 2);
          context.stroke();
          context.fillRect(
            candle.x - candle.width / 2,
            y - candle.bodyHeight / 2,
            candle.width,
            candle.bodyHeight
          );
        }

        context.globalAlpha = 1;
        window.requestAnimationFrame(loop);
      }

      window.requestAnimationFrame(loop);
    }

    function setAllContentVisible() {
      page.querySelectorAll("[data-pms-reveal], [data-pms-stagger] > *, [data-pms-feature-row]").forEach(function (element) {
        element.style.opacity = "1";
        element.style.transform = "none";
      });
      page.style.setProperty("--pms-process-progress", "100%");
      var process = page.querySelector("[data-pms-process]");
      if (process) process.style.setProperty("--pms-process-progress", "100%");
      var journey = page.querySelector("[data-pms-journey]");
      if (journey) journey.style.setProperty("--pms-journey-progress", "100%");
      page.querySelectorAll("[data-pms-process-stage], .pms-journey-steps li").forEach(function (element) {
        element.classList.add("is-active");
      });
      page.querySelectorAll("[data-pms-rights-ledger] article").forEach(function (element) {
        element.style.setProperty("--pms-rights-line", "100%");
      });
      var finalCard = page.querySelector("[data-pms-final-card]");
      if (finalCard) finalCard.style.setProperty("--pms-final-line", "100%");
    }

    function initTrustSeal() {
      var ring = page.querySelector("[data-pms-trust-ring]");
      if (!ring || ring.children.length) return;
      var ringText = ring.getAttribute("data-ring-text") || "";

      Array.prototype.forEach.call(ringText, function (character, index) {
        var letter = document.createElement("span");
        letter.textContent = character === " " ? "\u00a0" : character;
        letter.style.setProperty("--pms-letter-angle", (360 / ringText.length * index) + "deg");
        ring.appendChild(letter);
      });
    }

    function initHero() {

      var timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .from("[data-pms-hero='eyebrow']", { opacity: 0, y: 18, duration: .55 })
        .from(".pms-hero-title .pms-title-mask > span", { yPercent: 108, duration: .78, stagger: .1, ease: "power4.out" }, .08)
        .from("[data-pms-hero='description']", { opacity: 0, y: 28, duration: .68 }, .34)
        .from("[data-pms-hero='registration'] > span", { opacity: 0, y: 18, duration: .55, stagger: .08 }, .49)
        .from("[data-pms-hero='actions'] > a", { opacity: 0, y: 22, duration: .6, stagger: .1 }, .62)
        .from("[data-pms-hero='visual']", { opacity: 0, y: 32, scale: .96, duration: .9, ease: "expo.out", clearProps: "opacity,transform" }, .24)
        .from(".pms-trust-core > *", { opacity: 0, scale: .72, duration: .52, stagger: .08, ease: "back.out(1.8)", clearProps: "opacity,transform" }, .67)
        .from(".pms-trust-proof", { opacity: 0, y: 16, duration: .48, stagger: .1, clearProps: "opacity,transform" }, .86)
        .from(".pms-trust-kicker", { opacity: 0, y: -12, duration: .45, clearProps: "opacity,transform" }, .78);

      gsap.to(".pms-decor--candles i", {
        y: -8,
        duration: 1.8,
        stagger: .16,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    function splitWords(element) {
      if (element.hasAttribute("data-pms-split")) return;
      element.setAttribute("data-pms-split", "true");
      var walker = document.createTreeWalker(element, window.NodeFilter.SHOW_TEXT);
      var textNodes = [];

      while (walker.nextNode()) {
        if (walker.currentNode.nodeValue.trim()) textNodes.push(walker.currentNode);
      }

      textNodes.forEach(function (node) {
        var fragment = document.createDocumentFragment();
        node.nodeValue.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            fragment.appendChild(document.createTextNode(part));
            return;
          }

          var mask = document.createElement("span");
          var inner = document.createElement("span");
          mask.className = "pms-word-mask";
          inner.className = "pms-word-inner";
          inner.textContent = part;
          mask.appendChild(inner);
          fragment.appendChild(mask);
        });
        node.parentNode.replaceChild(fragment, node);
      });
    }

    function initPmsReveals() {
      page.querySelectorAll(".pms-section .pms-title").forEach(function (title) {
        splitWords(title);
        var words = title.querySelectorAll(".pms-word-inner");
        gsap.set(words, { yPercent: 112 });
        gsap.to(words, {
          yPercent: 0,
          duration: .85,
          stagger: .045,
          ease: "power4.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: title,
            start: "top 86%",
            once: true
          }
        });
      });

      gsap.utils.toArray("[data-pms-reveal]").forEach(function (element) {
        if (element.classList.contains("pms-title")) return;

        var type = element.getAttribute("data-pms-reveal") || "up";
        var from = { opacity: 0, y: 38 };

        if (type === "left") from = { opacity: 0, x: -44 };
        if (type === "right") from = { opacity: 0, x: 44 };
        if (type === "scale") from = { opacity: 0, scale: .96 };

        gsap.from(element, {
          opacity: from.opacity,
          x: from.x || 0,
          y: from.y || 0,
          scale: from.scale || 1,
          duration: .82,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: element,
            start: "top 84%",
            once: true
          }
        });
      });
    }

    function initStaggers() {
      gsap.utils.toArray("[data-pms-stagger]").forEach(function (container) {
        var items = Array.from(container.children);
        if (!items.length) return;

        gsap.from(items, {
          opacity: 0,
          y: 38,
          duration: .8,
          stagger: .09,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: container,
            start: "top 84%",
            once: true
          }
        });
      });
    }

    function initCounters(animated) {
      page.querySelectorAll("[data-pms-count]").forEach(function (element) {
        var target = Number(element.getAttribute("data-pms-count"));
        var decimals = Number(element.getAttribute("data-pms-decimals") || 0);
        var complete = false;

        function setValue(value) {
          element.textContent = value.toLocaleString("en-IN", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          });
        }

        function run() {
          if (complete) return;
          complete = true;

          if (!animated) {
            setValue(target);
            return;
          }

          var state = { value: 0 };
          gsap.to(state, {
            value: target,
            duration: 1.25,
            ease: "power3.out",
            onUpdate: function () {
              setValue(state.value);
            },
            onComplete: function () {
              setValue(target);
            }
          });
        }

        if (animated) {
          ScrollTrigger.create({
            trigger: element,
            start: "top 90%",
            once: true,
            onEnter: run
          });
        } else {
          run();
        }
      });
    }

    function initComparison() {
      var comparison = page.querySelector(".pms-comparison");
      var line = page.querySelector(".pms-comparison-line i");
      var pmsCells = page.querySelectorAll(".pms-comparison-row span:nth-child(2)");
      if (!comparison || !line) return;

      gsap.set(line, { scaleY: 0 });
      gsap.to(line, {
        scaleY: 1,
        duration: 1.1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: comparison,
          start: "top 78%",
          once: true
        }
      });

      gsap.from(pmsCells, {
        backgroundColor: "rgba(234,243,234,0)",
        duration: .7,
        stagger: .09,
        ease: "power2.out",
        scrollTrigger: {
          trigger: comparison,
          start: "top 76%",
          once: true
        }
      });
    }

    function initResearchProcess() {
      var process = page.querySelector("[data-pms-process]");
      var stages = page.querySelectorAll("[data-pms-process-stage]");
      if (!process || !stages.length) return;

      var media = gsap.matchMedia();
      media.add("(min-width: 992px)", function () {
        ScrollTrigger.create({
          trigger: process,
          start: "top 70%",
          end: "bottom 42%",
          scrub: .45,
          onUpdate: function (self) {
            var progress = Math.max(0, Math.min(1, self.progress));
            var activeIndex = Math.min(stages.length - 1, Math.floor(progress * stages.length));
            process.style.setProperty("--pms-process-progress", (progress * 100).toFixed(2) + "%");
            stages.forEach(function (stage, index) {
              stage.classList.toggle("is-active", index === activeIndex);
            });
          }
        });
      });

      media.add("(max-width: 991px)", function () {
        process.style.setProperty("--pms-process-progress", "100%");
        stages.forEach(function (stage) {
          stage.classList.add("is-active");
        });
        gsap.from(stages, {
          opacity: 0,
          y: 30,
          duration: .76,
          stagger: .11,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: process,
            start: "top 83%",
            once: true
          }
        });
      });
    }

    function initFeatureRows() {
      page.querySelectorAll("[data-pms-feature-row]").forEach(function (row) {
        var number = row.querySelector(".pms-feature-number");
        var icon = row.querySelector(":scope > i");
        var copy = row.querySelector(":scope > div");
        var indicator = row.querySelector(".pms-feature-indicator");

        var timeline = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 82%",
            once: true
          }
        });

        timeline
          .to(row, { "--pms-feature-line": "100%", duration: .85, ease: "power2.inOut" })
          .from(number, { opacity: 0, x: -20, duration: .45 }, .1)
          .from(icon, { opacity: 0, scale: .65, rotate: -16, duration: .55, ease: "back.out(1.6)" }, .18)
          .from(copy, { opacity: 0, y: 28, duration: .68, ease: "power3.out" }, .2)
          .from(indicator, { opacity: 0, x: 18, duration: .5 }, .35);

        gsap.to(indicator, {
          y: -12,
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "top bottom",
            end: "bottom top",
            scrub: .7
          }
        });
      });
    }

    function initJourney() {
      var journey = page.querySelector("[data-pms-journey]");
      if (!journey) return;
      var steps = journey.querySelectorAll("li");
      var icons = journey.querySelectorAll("li > span i");
      var labels = journey.querySelectorAll("li > small");

      gsap.set(steps, { opacity: 0, y: 28 });
      var timeline = gsap.timeline({
        scrollTrigger: {
          trigger: journey,
          start: "top 82%",
          once: true
        }
      });

      timeline
        .to(journey, { "--pms-journey-progress": "100%", duration: 1.25, ease: "power2.inOut" })
        .to(steps, {
          opacity: 1,
          y: 0,
          duration: .65,
          stagger: .11,
          ease: "power3.out",
          onStart: function () {
            steps.forEach(function (step, index) {
              window.setTimeout(function () {
                step.classList.add("is-active");
              }, index * 110);
            });
          }
        }, .12)
        .from(icons, {
          opacity: 0,
          scale: .25,
          rotate: -24,
          duration: .48,
          stagger: .08,
          ease: "back.out(1.8)",
          clearProps: "opacity,transform"
        }, .28)
        .from(labels, {
          opacity: 0,
          x: -12,
          duration: .42,
          stagger: .07,
          ease: "power2.out",
          clearProps: "opacity,transform"
        }, .36);
    }

    function initProtectionLines() {
      var blocks = page.querySelectorAll(".pms-protection-block");
      if (!blocks.length) return;

      blocks.forEach(function (block, index) {
        gsap.to(block, {
          "--pms-protection-line": "100%",
          duration: .9,
          delay: index * .07,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: block,
            start: "top 84%",
            once: true
          }
        });
      });
    }

    function initRedesignedSections() {
      var whyProcess = page.querySelector(".pms-why .pms-process");
      if (whyProcess) {
        gsap.from(whyProcess, {
          opacity: 0,
          x: 54,
          scale: .975,
          duration: .95,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: whyProcess,
            start: "top 82%",
            once: true
          }
        });
      }

      var wayGrid = page.querySelector("[data-pms-way-grid]");
      if (wayGrid) {
        var wayCards = wayGrid.querySelectorAll(".pms-way-card");
        gsap.from(wayCards, {
          opacity: 0,
          y: 54,
          rotateX: 5,
          transformOrigin: "center bottom",
          duration: .9,
          stagger: .13,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: wayGrid,
            start: "top 82%",
            once: true
          }
        });

        wayCards.forEach(function (card, index) {
          var iconWrap = card.querySelector(".pms-way-icon");
          var icon = iconWrap && iconWrap.querySelector("i");
          var cardDetails = card.querySelectorAll(".pms-way-card-copy > *, .pms-way-card > small");
          if (!iconWrap || !icon) return;

          gsap.from(cardDetails, {
            opacity: 0,
            y: 18,
            duration: .68,
            delay: .18 + index * .08,
            stagger: .08,
            ease: "power2.out",
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: card,
              start: "top 84%",
              once: true
            }
          });

          gsap.to(iconWrap, {
            y: index % 2 ? -8 : 8,
            rotate: index % 2 ? 5 : -5,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: .7
            }
          });

          var iconLoop = gsap.timeline({ paused: true, repeat: -1, yoyo: true })
            .to(icon, {
              scale: 1.1,
              rotate: index % 2 ? 7 : -7,
              duration: 1.8 + index * .15,
              ease: "sine.inOut"
            });

          ScrollTrigger.create({
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            onEnter: function () { iconLoop.play(); },
            onEnterBack: function () { iconLoop.play(); },
            onLeave: function () { iconLoop.pause(); },
            onLeaveBack: function () { iconLoop.pause(); }
          });

          if (finePointer) {
            card.addEventListener("mousemove", function (event) {
              var bounds = card.getBoundingClientRect();
              var x = (event.clientX - bounds.left) / bounds.width - .5;
              var y = (event.clientY - bounds.top) / bounds.height - .5;
              gsap.to(icon, {
                x: x * 8,
                y: y * 8,
                duration: .35,
                ease: "power2.out",
                overwrite: "auto"
              });
            });

            card.addEventListener("mouseleave", function () {
              gsap.to(icon, {
                x: 0,
                y: 0,
                duration: .65,
                ease: "elastic.out(1,.5)",
                overwrite: "auto"
              });
            });
          }
        });
      }

      var rightsLedger = page.querySelector("[data-pms-rights-ledger]");
      if (rightsLedger) {
        var rightsRows = rightsLedger.querySelectorAll("article");
        var rightsTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: rightsLedger,
            start: "top 82%",
            once: true
          }
        });

        rightsTimeline
          .from(rightsRows, {
            opacity: 0,
            x: 42,
            duration: .72,
            stagger: .11,
            ease: "power3.out",
            clearProps: "opacity,transform"
          })
          .to(rightsRows, {
            "--pms-rights-line": "100%",
            duration: .65,
            stagger: .08,
            ease: "power2.inOut"
          }, .1);
      }

      var resourceHub = page.querySelector("[data-pms-resource-hub]");
      if (resourceHub) {
        var resourcePanels = resourceHub.querySelectorAll(".pms-resource-panel");
        var resourceTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: resourceHub,
            start: "top 82%",
            once: true
          }
        });

        resourceTimeline.from(resourcePanels, {
          opacity: 0,
          y: 48,
          scale: .98,
          duration: .85,
          stagger: .12,
          ease: "power3.out",
          clearProps: "opacity,transform"
        });

        resourcePanels.forEach(function (panel, index) {
          var links = panel.querySelectorAll("a");
          resourceTimeline.from(links, {
            opacity: 0,
            x: 18,
            duration: .48,
            stagger: .055,
            ease: "power2.out",
            clearProps: "opacity,transform"
          }, .3 + index * .09);
        });
      }

      var finalCard = page.querySelector("[data-pms-final-card]");
      if (finalCard) {
        var finalTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: finalCard,
            start: "top 84%",
            once: true
          }
        });

        finalTimeline
          .from(finalCard, {
            opacity: 0,
            y: 44,
            scale: .98,
            duration: .9,
            ease: "power3.out"
          })
          .to(finalCard, {
            "--pms-final-line": "100%",
            duration: .9,
            ease: "power2.inOut"
          }, .12)
          .from(finalCard.querySelectorAll(".pms-final-copy > *"), {
            opacity: 0,
            y: 25,
            duration: .65,
            stagger: .09,
            ease: "power3.out"
          }, .22)
          .from(finalCard.querySelector(".pms-contact-card"), {
            opacity: 0,
            x: 38,
            duration: .75,
            ease: "power3.out"
          }, .35)
          .from(finalCard.querySelectorAll(".pms-next-steps li"), {
            opacity: 0,
            y: 18,
            duration: .48,
            stagger: .09,
            ease: "power2.out",
            clearProps: "opacity,transform"
          }, .58)
          .from(finalCard.querySelector(".pms-desk-line"), {
            opacity: 0,
            y: 12,
            duration: .45,
            ease: "power2.out",
            clearProps: "opacity,transform"
          }, .76)
          .set(finalCard, { clearProps: "opacity,transform" });
      }
    }

    function initAccordion() {
      var items = page.querySelectorAll(".pms-accordion-item");
      if (!items.length) return;

      items.forEach(function (item, index) {
        var button = item.querySelector("button");
        var panel = item.querySelector(".pms-accordion-panel");
        if (!button || !panel) return;

        var buttonId = "pms-faq-button-" + (index + 1);
        var panelId = "pms-faq-panel-" + (index + 1);
        button.id = buttonId;
        panel.id = panelId;
        button.setAttribute("aria-controls", panelId);
        panel.setAttribute("role", "region");
        panel.setAttribute("aria-labelledby", buttonId);
        panel.setAttribute("aria-hidden", item.classList.contains("is-open") ? "false" : "true");

        button.addEventListener("click", function () {
          var shouldOpen = !item.classList.contains("is-open");

          items.forEach(function (other) {
            other.classList.remove("is-open");
            var otherButton = other.querySelector("button");
            var otherPanel = other.querySelector(".pms-accordion-panel");
            if (otherButton) otherButton.setAttribute("aria-expanded", "false");
            if (otherPanel) otherPanel.setAttribute("aria-hidden", "true");
          });

          if (shouldOpen) {
            item.classList.add("is-open");
            button.setAttribute("aria-expanded", "true");
            panel.setAttribute("aria-hidden", "false");
          }
        });
      });
    }

    function initBackgroundMotion() {
      gsap.utils.toArray(".pms-section .pms-decor, .pms-hero .pms-decor").forEach(function (decor, index) {
        gsap.fromTo(decor, {
          y: index % 2 ? -18 : 18
        }, {
          y: index % 2 ? 18 : -18,
          ease: "none",
          scrollTrigger: {
            trigger: decor.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: .7
          }
        });
      });
    }

    function initMagneticButtons() {
      if (!finePointer) return;

      page.querySelectorAll(".pms-button:not([data-pms-static-button])").forEach(function (button) {
        button.addEventListener("mousemove", function (event) {
          var rect = button.getBoundingClientRect();
          var x = (event.clientX - rect.left - rect.width / 2) * .12;
          var y = (event.clientY - rect.top - rect.height / 2) * .16;
          gsap.to(button, { x: x, y: y, duration: .28, ease: "power2.out" });
        });

        button.addEventListener("mouseleave", function () {
          gsap.to(button, { x: 0, y: 0, duration: .55, ease: "elastic.out(1,.45)" });
        });
      });
    }

    function refreshTriggers() {
      var resizeTimer;

      window.addEventListener("load", function () {
        ScrollTrigger.refresh();
      }, { once: true });

      window.addEventListener("resize", function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () {
          ScrollTrigger.refresh();
        }, 180);
      }, { passive: true });

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
          ScrollTrigger.refresh();
        });
      }

      page.querySelectorAll("img").forEach(function (image) {
        if (!image.complete) {
          image.addEventListener("load", function () {
            ScrollTrigger.refresh();
          }, { once: true });
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPmsPage, { once: true });
  } else {
    initPmsPage();
  }
})(window, document);
