document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================================================
     MORPHING HEADER ON SCROLL
     ========================================================================== */
  const header = document.getElementById("morphing-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  /* Mobile Menu Toggle */
  const menuBtn = document.getElementById("menu-toggle-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    menuBtn.classList.toggle("active");
    const bars = menuBtn.querySelectorAll(".menu-bar");
    if(menuBtn.classList.contains("active")) {
      bars[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      bars[1].style.transform = "rotate(-45deg) translate(5px, -5px)";
    } else {
      bars[0].style.transform = "none";
      bars[1].style.transform = "none";
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      menuBtn.classList.remove("active");
      const bars = menuBtn.querySelectorAll(".menu-bar");
      bars[0].style.transform = "none";
      bars[1].style.transform = "none";
    });
  });

  /* ==========================================================================
     SECTION 1: HERO CANVAS WORLD MAP ANIMATION
     ========================================================================== */
  const canvas = document.getElementById("hero-canvas");
  const ctx = canvas.getContext("2d");
  const mapContainer = canvas.parentElement;

  // Handle Resize mapping coordinates
  function resizeCanvas() {
    const rect = mapContainer.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Coordinate converter SVG (1000x500 viewport) -> Canvas Pixels
  function getCanvasPos(svgX, svgY) {
    const scaleX = canvas.width / 1000;
    const scaleY = canvas.height / 500;
    return {
      x: svgX * scaleX,
      y: svgY * scaleY
    };
  }

  // Bezier curve calculations
  function getBezierPoint(t, p0, cp, p1) {
    const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * cp.x + t * t * p1.x;
    const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * cp.y + t * t * p1.y;
    return { x, y };
  }

  // Define 6 routes with ACCELERATED speeds (3.5x to 4x faster)
  // Mumbai [640, 230], Rotterdam [480, 130], Shanghai [780, 200], LA [160, 190], Dubai [570, 200], Hamburg [495, 120], Singapore [720, 310], NY [260, 160]
  const routes = [
    { from: [640, 230], to: [480, 130], t: 0, speed: 0.0085, trail: [] }, // Mumbai -> Rotterdam
    { from: [780, 200], to: [160, 190], t: 0.15, speed: 0.0055, trail: [] }, // Shanghai -> Los Angeles
    { from: [570, 200], to: [495, 120], t: 0.35, speed: 0.0090, trail: [] }, // Dubai -> Hamburg
    { from: [720, 310], to: [260, 160], t: 0.55, speed: 0.0062, trail: [] }, // Singapore -> New York
    { from: [640, 230], to: [570, 200], t: 0.05, speed: 0.0130, trail: [] }, // Mumbai -> Dubai
    { from: [780, 200], to: [480, 130], t: 0.75, speed: 0.0075, trail: [] }  // Shanghai -> Rotterdam
  ];

  function animateRoutes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    routes.forEach(route => {
      const start = getCanvasPos(route.from[0], route.from[1]);
      const end = getCanvasPos(route.to[0], route.to[1]);
      
      // Bezier control point offset
      const cp = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2 - Math.abs(start.x - end.x) * 0.18
      };

      route.t += route.speed;
      if (route.t > 1) {
        route.t = 0;
        route.trail = [];
      }

      const currentPos = getBezierPoint(route.t, start, cp, end);
      route.trail.push(currentPos);
      if (route.trail.length > 20) {
        route.trail.shift();
      }

      // Draw fading trail
      route.trail.forEach((pos, idx) => {
        const alpha = idx / route.trail.length * 0.35;
        ctx.fillStyle = `rgba(59, 111, 212, ${alpha})`;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Glowing shipment head
      ctx.shadowBlur = 16;
      ctx.shadowColor = "#3B6FD4";
      ctx.fillStyle = "#3B6FD4";
      ctx.beginPath();
      ctx.arc(currentPos.x, currentPos.y, 7, 0, Math.PI * 2);
      ctx.fill();
      
      // Clear shadow specs
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(animateRoutes);
  }
  requestAnimationFrame(animateRoutes);

  /* Cycling Floating Status Cards */
  const cardAContent = ["BL Verified  ✓", "Draft B/L Ready  ✓", "Docs Submitted  ✓"];
  const cardBContent = ["Customs Cleared ✓", "eSanchit Filed ✓", "ICEGATE ✓"];
  const cardCContent = ["ETA: 3 Days", "Vessel Departed", "At Port: Rotterdam"];

  const cardA = document.getElementById("card-a");
  const cardB = document.getElementById("card-b");
  const cardC = document.getElementById("card-c");

  let currentCardIndex = 0;

  function updateCardTexts() {
    cardA.innerText = cardAContent[currentCardIndex];
    cardB.innerText = cardBContent[currentCardIndex];
    cardC.innerText = cardCContent[currentCardIndex];
  }

  // Initial Setup
  updateCardTexts();
  cardA.classList.add("active");
  cardB.classList.add("active");
  cardC.classList.add("active");

  // Cycling intervals
  setInterval(() => {
    // Fade out at 3.5s
    setTimeout(() => {
      cardA.classList.remove("active");
      cardB.classList.remove("active");
      cardC.classList.remove("active");
    }, 3500);

    // Next item and fade back in at 4s
    setTimeout(() => {
      currentCardIndex = (currentCardIndex + 1) % 3;
      updateCardTexts();
      cardA.classList.add("active");
      cardB.classList.add("active");
      cardC.classList.add("active");
    }, 4000);
  }, 4000);

  /* Active Shipments counter up + Sparkline drawing */
  const sparkCanvas = document.getElementById("sparkline-canvas");
  if (sparkCanvas) {
    const sCtx = sparkCanvas.getContext("2d");
    sCtx.strokeStyle = "#3B6FD4";
    sCtx.lineWidth = 2;
    sCtx.beginPath();
    sCtx.moveTo(0, 15);
    sCtx.bezierCurveTo(15, 5, 30, 20, 45, 10);
    sCtx.lineTo(60, 2);
    sCtx.stroke();
  }

  /* Counter Ease Function Helper */
  function animateCounter(id, start, end, duration, suffix = "") {
    const el = document.getElementById(id);
    if (!el) return;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo curve
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const value = Math.floor(start + (end - start) * ease);
      el.innerText = value + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.innerText = end + suffix;
      }
    }
    requestAnimationFrame(update);
  }

  // Initial count of Active Shipments in Dashboard
  animateCounter("active-shipments-count", 0, 124, 1500);

  // Slide in staggered dashboard rows
  const dbRows = document.querySelectorAll(".db-row");
  dbRows.forEach((row, idx) => {
    setTimeout(() => {
      row.classList.add("visible");
    }, 200 + idx * 150);
  });

  /* ==========================================================================
     SCROLL OBSERVATION: INTERSECTION OBSERVER TRIGGERS
     ========================================================================== */
  // Highly robust scroll reveal observer (Triggers immediately on 1% visibility)
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      }
    });
  }, { threshold: 0.02, rootMargin: "0px 0px -40px 0px" });

  // Register multiple selectors dynamically (Clean and visibility-bug-free!)
  const elementsToObserve = [
    ".scroll-reveal",
    ".testimonial-card",
    ".cta-section"
  ];

  elementsToObserve.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      scrollObserver.observe(el);
    });
  });

  // 2. Trust Counter triggers
  const statCards = document.querySelectorAll(".animated-counter");
  const statCardsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (!el.classList.contains("counted")) {
          el.classList.add("counted");
          const val = parseInt(el.getAttribute("data-value"));
          const suffix = el.getAttribute("data-suffix");
          animateCounter(el.id, 0, val, 1400, suffix);
        }
      }
    });
  }, { threshold: 0.05 });

  statCards.forEach(card => statCardsObserver.observe(card));

  // 3. Bento Grid Cost Ticker Trigger
  const costCard = document.getElementById("cost-card-ticker");
  const costObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const tickerVal = document.getElementById("reconciliation-errors-count");
        if (!tickerVal.classList.contains("ticked")) {
          tickerVal.classList.add("ticked");
          // Count down from 482900 to 38200
          animateCounter("reconciliation-errors-count", 482900, 38200, 1500, "");
          
          // Shrink XEMI cost bar fill from 100% to 12% width
          const costBar = document.getElementById("cost-bar-fill");
          if (costBar) {
            costBar.style.width = "12%";
          }
        }
      }
    });
  }, { threshold: 0.05 });

  if (costCard) costObserver.observe(costCard);

  // 4. ICP Split Row Triggers (Milestones / Forms / Stamping / Live updates)
  const icpRows = document.querySelectorAll(".icp-row");
  const icpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const row = entry.target;
        row.classList.add("revealed");

        // Exporter Typing Effect
        if (row.id === "icp-row-2") {
          const inputs = row.querySelectorAll(".typewrite-field");
          inputs.forEach(inp => {
            const txt = inp.getAttribute("data-text");
            inp.value = "";
            let charIdx = 0;
            function typeChar() {
              if (charIdx < txt.length) {
                inp.value += txt.charAt(charIdx);
                charIdx++;
                setTimeout(typeChar, 40);
              }
            }
            setTimeout(typeChar, 200);
          });
        }

        // Customs checkmarks stamping
        if (row.id === "icp-row-3") {
          const rows = row.querySelectorAll(".queue-row");
          rows.forEach((qRow, idx) => {
            setTimeout(() => {
              qRow.classList.add("checked");
            }, 300 + idx * 800);
          });
        }
      }
    });
  }, { threshold: 0.1 });

  icpRows.forEach(row => icpObserver.observe(row));

  // 5. Always On Accordion Auto-Cycling & Satellites Sync
  const accordionItems = document.querySelectorAll(".accordion-item");
  const satellites = document.querySelectorAll(".satellite-node");
  let activeIndex = 0;
  let autoCycleTimer = null;
  let progressTimer = null;
  const cycleDuration = 4000; // 4 seconds

  function setActiveAccordionItem(index) {
    activeIndex = index;

    // Update accordion active states & progress bar widths
    accordionItems.forEach((item, idx) => {
      const fill = item.querySelector(".progress-fill");
      if (idx === index) {
        item.classList.add("active");
        if (fill) {
          // Trigger smooth width fill using CSS transition
          fill.style.transition = "none";
          fill.style.width = "0%";
          // Force layout reflow
          fill.offsetHeight;
          fill.style.transition = `width ${cycleDuration}ms linear`;
          fill.style.width = "100%";
        }
      } else {
        item.classList.remove("active");
        if (fill) {
          fill.style.transition = "none";
          fill.style.width = "0%";
        }
      }
    });

    // Update active satellite glow
    satellites.forEach((sat, idx) => {
      if (idx === index) {
        sat.classList.add("active-sat");
      } else {
        sat.classList.remove("active-sat");
      }
    });
  }

  function startAutoCycle() {
    stopAutoCycle();
    setActiveAccordionItem(activeIndex);

    autoCycleTimer = setInterval(() => {
      let nextIndex = (activeIndex + 1) % accordionItems.length;
      setActiveAccordionItem(nextIndex);
    }, cycleDuration);
  }

  function stopAutoCycle() {
    if (autoCycleTimer) {
      clearInterval(autoCycleTimer);
      autoCycleTimer = null;
    }
  }

  // Handle user clicks on accordion items
  accordionItems.forEach((item, idx) => {
    item.addEventListener("click", () => {
      stopAutoCycle();
      setActiveAccordionItem(idx);
      
      // Stop progress fill transition on click and make it stay full
      const fill = item.querySelector(".progress-fill");
      if (fill) {
        fill.style.transition = "none";
        fill.style.width = "100%";
      }

      // Resume auto-cycle after 6 seconds of inactivity
      clearTimeout(progressTimer);
      progressTimer = setTimeout(() => {
        activeIndex = (idx + 1) % accordionItems.length;
        startAutoCycle();
      }, 6000);
    });
  });

  // Start the auto cycle initially
  startAutoCycle();

  /* ==========================================================================
     BENTO CARD: VISIBILITY ACTIVE NODES RIPPLE
     ========================================================================== */
  const glowDot = document.getElementById("moving-glow-dot");
  const progressLine = document.getElementById("timeline-progress");
  const ripple = document.getElementById("timeline-ripple");
  const nodes = [40, 145, 250, 355, 460];
  const nodeTexts = document.querySelectorAll(".timeline-node-text");
  let activeTimelineNode = 0;

  function updateTimeline() {
    const nextNode = (activeTimelineNode + 1) % 5;
    activeTimelineNode = nextNode;
    const xPos = nodes[nextNode];
    
    // Move Dot
    if (glowDot) glowDot.setAttribute("cx", xPos);
    if (progressLine) progressLine.setAttribute("x2", xPos);
    
    // Pulse ripple
    if (ripple) ripple.style.left = `${(xPos / 500) * 100}%`;
    
    // Active node texts color toggle
    nodeTexts.forEach((txt, idx) => {
      if (idx === nextNode) {
        txt.classList.add("active");
      } else {
        txt.classList.remove("active");
      }
    });
  }

  setInterval(updateTimeline, 1600);

  // Card 2 Document Stacks class loop
  const docsStackEl = document.getElementById("docs-stack-el");
  if (docsStackEl) {
    setInterval(() => {
      docsStackEl.classList.remove("animating");
      setTimeout(() => {
        docsStackEl.classList.add("animating");
      }, 50);
    }, 4000);
    docsStackEl.classList.add("animating");
  }

  /* ==========================================================================
     SECTION 4: DRAG-SCROLL CAROUSEL MECHANICS
     ========================================================================== */
  const carousel = document.getElementById("outcomes-carousel");
  let isDown = false;
  let startX;
  let scrollLeft;
  let velocity = 0;
  let lastX = 0;
  let lastTime = 0;
  let decayRaf = null;

  if (carousel) {
    carousel.addEventListener("pointerdown", (e) => {
      isDown = true;
      carousel.classList.add("dragging");
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
      velocity = 0;
      lastX = e.pageX;
      lastTime = performance.now();
      cancelAnimationFrame(decayRaf);
    });

    carousel.addEventListener("pointerleave", () => {
      if (!isDown) return;
      isDown = false;
      carousel.classList.remove("dragging");
      startInertia();
    });

    carousel.addEventListener("pointerup", () => {
      if (!isDown) return;
      isDown = false;
      carousel.classList.remove("dragging");
      startInertia();
    });

    carousel.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5;
      carousel.scrollLeft = scrollLeft - walk;

      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) {
        velocity = (e.pageX - lastX) / dt;
      }
      lastX = e.pageX;
      lastTime = now;
    });
  }

  function startInertia() {
    function step() {
      if (Math.abs(velocity) < 0.05) {
        snapCarousel();
        return;
      }
      carousel.scrollLeft -= velocity * 15;
      velocity *= 0.95; // Friction
      decayRaf = requestAnimationFrame(step);
    }
    decayRaf = requestAnimationFrame(step);
  }

  function snapCarousel() {
    const cards = carousel.querySelectorAll(".carousel-card");
    const scrollX = carousel.scrollLeft;
    let closestCard = cards[0];
    let minDiff = Infinity;

    cards.forEach(card => {
      const diff = Math.abs(card.offsetLeft - scrollX);
      if (diff < minDiff) {
        minDiff = diff;
        closestCard = card;
      }
    });

    carousel.scrollTo({
      left: closestCard.offsetLeft - 24,
      behavior: "smooth"
    });
  }

  /* ==========================================================================
     SECTION 9: THREE INTERACTIVE COMPONENTS (TAB SWITCH)
     ========================================================================== */
  const tabs = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".hub-panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active-panel"));

      tab.classList.add("active");
      document.getElementById(tab.getAttribute("data-tab")).classList.add("active-panel");
    });
  });

  /* PANEL A: CLI MONOSPACE TERMINAL SIMULATOR */
  const cliPills = document.querySelectorAll(".portal-pill");
  const cliScreen = document.getElementById("terminal-screen");

  cliPills.forEach(pill => {
    pill.addEventListener("click", () => {
      if (pill.classList.contains("connected")) return;
      pill.classList.add("connected");
      
      const name = pill.getAttribute("data-name");
      const log1 = `> Connecting to ${name}...`;
      const log2 = `> Authenticating...`;
      const log3 = `> Connection live ✓`;
      
      appendCLILine(log1, 0);
      appendCLILine(log2, 300);
      appendCLILine(log3, 600);
    });
  });

  function appendCLILine(text, delay) {
    setTimeout(() => {
      const lineEl = document.createElement("div");
      lineEl.className = "cli-line";
      lineEl.innerText = "";
      cliScreen.appendChild(lineEl);
      
      let charIdx = 0;
      function type() {
        if (charIdx < text.length) {
          lineEl.innerText += text.charAt(charIdx);
          charIdx++;
          setTimeout(type, 15);
        }
      }
      type();
      
      cliScreen.scrollTop = cliScreen.scrollHeight;
    }, delay);
  }

  /* PANEL B: 3D SQUASH-ELLIPTICAL ORBIT RING */
  const orbitContainer = document.getElementById("orbit-badges-wrap");
  const orbitBadges = orbitContainer.querySelectorAll(".orbit-badge");
  const orbitTooltip = document.getElementById("carrier-tooltip");
  let baseAngle = 0;
  let orbitPaused = false;

  function updateEllipticalOrbit() {
    if (!orbitPaused) {
      baseAngle += 0.0035; // speed
    }
    
    orbitBadges.forEach((badge, index) => {
      const theta = baseAngle + index * (2 * Math.PI / 10);
      const rx = 180; // horizontal width
      const ry = 42;  // squashed vertical tilt
      
      const x = rx * Math.cos(theta);
      const y = ry * Math.sin(theta);

      // Front-to-back perspective scaling
      const scale = 0.82 + 0.28 * (y + ry) / (2 * ry);
      const zIndex = Math.floor(100 + y);
      const opacity = 0.45 + 0.55 * (y + ry) / (2 * ry);

      badge.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      badge.style.zIndex = zIndex;
      badge.style.opacity = opacity;
    });
    
    requestAnimationFrame(updateEllipticalOrbit);
  }
  if (orbitContainer) requestAnimationFrame(updateEllipticalOrbit);

  // Orbit hovering effects
  orbitBadges.forEach(badge => {
    badge.addEventListener("pointerenter", () => {
      orbitPaused = true;
      if (orbitTooltip) {
        orbitTooltip.innerText = `${badge.getAttribute("data-name")} · Connected ✓`;
        orbitTooltip.classList.add("active");
      }
    });

    badge.addEventListener("pointerleave", () => {
      orbitPaused = false;
      if (orbitTooltip) orbitTooltip.classList.remove("active");
    });
  });

  /* PANEL C: ERP & CRM SVG NODE GRAPH */
  const graphNodes = document.querySelectorAll(".graph-node");
  const graphLines = document.querySelectorAll(".node-line");
  const erpTooltip = document.getElementById("erp-node-tooltip");

  // Draw SVG lines on Panel scroll entry
  const nodeGraphPanel = document.getElementById("panel-nodes");
  const nodeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        graphLines.forEach((line, idx) => {
          setTimeout(() => {
            line.classList.add("drawn");
          }, idx * 180);
        });
      }
    });
  }, { threshold: 0.05 });

  if (nodeGraphPanel) nodeObserver.observe(nodeGraphPanel);

  // Node hovering and clicking interactions
  graphNodes.forEach((node, idx) => {
    const line = document.getElementById(`line-${idx + 1}`);
    
    node.addEventListener("pointerenter", () => {
      if (line) line.classList.add("active");
      if (erpTooltip) {
        erpTooltip.innerText = `${node.getAttribute("data-name")} · Sync Ready`;
        erpTooltip.classList.add("active");
      }
    });

    node.addEventListener("pointerleave", () => {
      if (line && !node.classList.contains("active")) line.classList.remove("active");
      if (erpTooltip) erpTooltip.classList.remove("active");
    });

    node.addEventListener("click", () => {
      node.classList.toggle("active");
      if (node.classList.contains("active")) {
        if (line) line.classList.add("active");
        if (erpTooltip) {
          erpTooltip.innerText = `${node.getAttribute("data-name")} · Syncing...`;
          setTimeout(() => {
            erpTooltip.innerText = `${node.getAttribute("data-name")} · Synced ✓`;
          }, 1000);
        }
      } else {
        if (line) line.classList.remove("active");
      }
    });
  });

  /* ==========================================================================
     SECTION 10: FINAL CTA CANVAS STAR DRIFT
     ========================================================================== */
  const ctaCanvas = document.getElementById("cta-canvas");
  if (ctaCanvas) {
    const cCtx = ctaCanvas.getContext("2d");
    let ctaW = ctaCanvas.width = ctaCanvas.offsetWidth;
    let ctaH = ctaCanvas.height = ctaCanvas.offsetHeight;

    window.addEventListener("resize", () => {
      if (ctaCanvas) {
        ctaW = ctaCanvas.width = ctaCanvas.offsetWidth;
        ctaH = ctaCanvas.height = ctaCanvas.offsetHeight;
      }
    });

    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * ctaW,
        y: Math.random() * ctaH,
        r: Math.random() * 1.8 + 1,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18
      });
    }

    function drawParticles() {
      cCtx.clearRect(0, 0, ctaW, ctaH);
      cCtx.fillStyle = "rgba(255, 255, 255, 0.15)";
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = ctaW;
        if (p.x > ctaW) p.x = 0;
        if (p.y < 0) p.y = ctaH;
        if (p.y > ctaH) p.y = 0;

        cCtx.beginPath();
        cCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cCtx.fill();
      });
      requestAnimationFrame(drawParticles);
    }
    requestAnimationFrame(drawParticles);
  }

  /* ==========================================================================
     SECTION 7: SECURITY INTERACTIVE COMPONENTS
     ========================================================================== */
  // 1. Padlock clicking & scrambler encryption ticker
  const padlock = document.getElementById("padlock-widget");
  const lockTicker = document.getElementById("lock-ticker");
  const lockScanner = document.getElementById("lock-scanner");
  let lockTickerInterval = null;

  if (padlock) {
    padlock.addEventListener("click", () => {
      padlock.classList.toggle("locked");
      
      // Trigger scan line
      if (lockScanner) {
        lockScanner.classList.remove("scanning");
        void lockScanner.offsetWidth; // trigger reflow
        lockScanner.classList.add("scanning");
      }

      if (padlock.classList.contains("locked")) {
        // Scramble hex code into clean "SECURE ENCRYPTION ACTIVE"
        scrambleTextTicker(lockTicker, "SECURE ENCRYPTION ACTIVE", true);
      } else {
        // Scramble sentence into continuous hex code
        scrambleTextTicker(lockTicker, "AES_256: F9B8A7D3C6E5F401B2D3A4B5", false);
      }
    });
  }

  function scrambleTextTicker(el, finalStr, secure) {
    if (!el) return;
    clearInterval(lockTickerInterval);
    let iterations = 0;
    const chars = "ABCDEF0123456789XEMI:";
    
    lockTickerInterval = setInterval(() => {
      el.innerText = finalStr
        .split("")
        .map((char, index) => {
          if (index < iterations) {
            return finalStr[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      iterations += 2;
      if (iterations >= finalStr.length + 2) {
        clearInterval(lockTickerInterval);
        el.innerText = finalStr;
        if (secure) {
          el.style.color = "var(--accent)";
          el.style.background = "rgba(59, 111, 212, 0.05)";
        } else {
          el.style.color = "#E74C3C";
          el.style.background = "rgba(231, 76, 60, 0.05)";
        }
      }
    }, 30);
  }

  // 2. Role Selector tab click updating Allowance Badges
  const rbacPills = document.querySelectorAll(".role-pill");
  const pFiling = document.getElementById("p-filing");
  const pRouting = document.getElementById("p-routing");
  const pAudit = document.getElementById("p-audit");

  const rbacPermissions = {
    admin: { filing: "Allow", routing: "Allow", audit: "Allow" },
    carrier: { filing: "Deny", routing: "Allow", audit: "Deny" },
    auditor: { filing: "Deny", routing: "Deny", audit: "Allow" }
  };

  rbacPills.forEach(pill => {
    pill.addEventListener("click", () => {
      rbacPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      
      const role = pill.getAttribute("data-role");
      const perm = rbacPermissions[role];
      
      updatePermBadge(pFiling, perm.filing);
      updatePermBadge(pRouting, perm.routing);
      updatePermBadge(pAudit, perm.audit);
    });
  });

  function updatePermBadge(el, state) {
    if (!el) return;
    el.style.transform = "scale(0.8)";
    setTimeout(() => {
      el.innerText = state;
      if (state === "Allow") {
        el.className = "perm-badge allow";
      } else {
        el.className = "perm-badge deny";
      }
      el.style.transform = "scale(1)";
    }, 150);
  }

  // 3. Certificate clicking verification identity scanner
  const certWidget = document.getElementById("cert-widget");
  const certScanner = document.getElementById("cert-scanner");
  const certLog = document.getElementById("cert-log-screen");
  let certTypewriterTimeout = null;

  if (certWidget) {
    certWidget.addEventListener("click", () => {
      // Trigger scan line
      if (certScanner) {
        certScanner.classList.remove("scanning");
        void certScanner.offsetWidth;
        certScanner.classList.add("scanning");
      }
      
      // Clear logs
      if (certLog) {
        certLog.style.color = "var(--accent)";
        certLog.innerText = "Scanning signature...";
        
        clearTimeout(certTypewriterTimeout);
        certTypewriterTimeout = setTimeout(() => {
          certLog.innerText = "Securing nodes...";
          
          certTypewriterTimeout = setTimeout(() => {
            certLog.style.color = "#27AE60";
            certLog.innerText = "SOC2 · ISO: Verified ✓";
          }, 600);
        }, 600);
      }
    });
  }

});
