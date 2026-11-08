(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function load(key, fallback) {
    try { var v = localStorage.getItem("forever-guide:" + key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem("forever-guide:" + key, JSON.stringify(value)); } catch (e) { /* storage off: progress lasts this visit */ }
  }

  /* ---------------- Night sky: stars, fireflies, shooting stars ---------------- */
  var canvas = document.querySelector(".sky");
  var ctx = canvas.getContext("2d");
  var stars = [], flies = [], meteors = [];
  var W = 0, H = 0, dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var nStars = Math.round(W * H / 4200);
    stars = [];
    for (var i = 0; i < nStars; i++) {
      stars.push({ x: Math.random() * W, y: Math.random() * H * 0.7, r: Math.random() * 1.3 + 0.2, p: Math.random() * Math.PI * 2, s: 0.5 + Math.random() * 1.5 });
    }
    var nFlies = Math.round(Math.min(70, W / 22));
    flies = [];
    for (var j = 0; j < nFlies; j++) flies.push(newFly(true));
  }
  function newFly(anywhere) {
    var warm = Math.random() < 0.7;
    return {
      x: Math.random() * W,
      y: anywhere ? H * (0.45 + Math.random() * 0.55) : H + 10,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(0.15 + Math.random() * 0.45),
      r: 1 + Math.random() * 2.2,
      p: Math.random() * Math.PI * 2,
      hue: warm ? 40 + Math.random() * 15 : 85 + Math.random() * 30,
      life: 0
    };
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    // moon with a soft halo
    var mx = W * 0.82, my = H * 0.17, mr = Math.max(28, Math.min(W, H) * 0.075);
    var halo = ctx.createRadialGradient(mx, my, mr * 0.8, mx, my, mr * 5);
    halo.addColorStop(0, "rgba(255,242,196,0.22)");
    halo.addColorStop(0.4, "rgba(159,185,224,0.08)");
    halo.addColorStop(1, "rgba(159,185,224,0)");
    ctx.globalAlpha = 1; ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(mx, my, mr * 5, 0, 6.283); ctx.fill();
    var disc = ctx.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, mr * 0.1, mx, my, mr);
    disc.addColorStop(0, "#fff9e6"); disc.addColorStop(0.6, "#eadfb8"); disc.addColorStop(1, "#cbb98c");
    ctx.fillStyle = disc;
    ctx.beginPath(); ctx.arc(mx, my, mr, 0, 6.283); ctx.fill();
    // stars
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      if (Math.abs(s.x - mx) < mr * 1.15 && Math.abs(s.y - my) < mr * 1.15) continue;
      var a = 0.35 + 0.65 * Math.abs(Math.sin(s.p + t * 0.001 * s.s));
      ctx.globalAlpha = a;
      ctx.fillStyle = "#fff6dc";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
    }
    // shooting stars
    if (!reduceMotion && Math.random() < 0.004 && meteors.length < 2) {
      meteors.push({ x: Math.random() * W * 0.8 + W * 0.1, y: Math.random() * H * 0.3, vx: 9 + Math.random() * 5, vy: 3 + Math.random() * 2, life: 1 });
    }
    for (var m = meteors.length - 1; m >= 0; m--) {
      var me = meteors[m];
      var g = ctx.createLinearGradient(me.x, me.y, me.x - me.vx * 12, me.y - me.vy * 12);
      g.addColorStop(0, "rgba(255,246,220," + me.life + ")");
      g.addColorStop(1, "rgba(255,246,220,0)");
      ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(me.x, me.y); ctx.lineTo(me.x - me.vx * 12, me.y - me.vy * 12); ctx.stroke();
      me.x += me.vx; me.y += me.vy; me.life -= 0.02;
      if (me.life <= 0) meteors.splice(m, 1);
    }
    // fireflies
    ctx.globalCompositeOperation = "lighter";
    for (var k = 0; k < flies.length; k++) {
      var f = flies[k];
      var glow = 0.45 + 0.55 * Math.sin(f.p + t * 0.003);
      var rad = f.r * 6;
      var grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, rad);
      grad.addColorStop(0, "hsla(" + f.hue + ",100%,75%," + (0.9 * glow) + ")");
      grad.addColorStop(0.25, "hsla(" + f.hue + ",100%,60%," + (0.35 * glow) + ")");
      grad.addColorStop(1, "hsla(" + f.hue + ",100%,50%,0)");
      ctx.globalAlpha = 1; ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(f.x, f.y, rad, 0, 6.283); ctx.fill();
      if (!reduceMotion) {
        f.x += f.vx + Math.sin(t * 0.0007 + f.p) * 0.3;
        f.y += f.vy;
        if (f.y < H * 0.15 || f.x < -20 || f.x > W + 20) flies[k] = newFly(false);
      }
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }

  var heroVisible = true, running = false;
  function loop(t) {
    if (!heroVisible || document.hidden) { running = false; return; }
    draw(t);
    requestAnimationFrame(loop);
  }
  function start() { if (!running && !reduceMotion) { running = true; requestAnimationFrame(loop); } }

  resize();
  draw(0); // first frame right away, even if animation never runs
  window.addEventListener("resize", function () { resize(); draw(performance.now()); });
  document.addEventListener("visibilitychange", function () { if (!document.hidden) start(); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; if (heroVisible) start(); }).observe(canvas);
  }
  start();

  /* ---------------- Parallax ridges + action bar ---------------- */
  var ridges = [
    [document.querySelector(".ridge-far"), 0.3],
    [document.querySelector(".ridge-mid"), 0.15]
  ];
  var bar = document.querySelector(".actionbar");
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (!reduceMotion && y < window.innerHeight * 1.2) {
      ridges.forEach(function (r) { r[0].style.transform = "translateY(" + (y * r[1]) + "px)"; });
    }
    bar.classList.toggle("shown", y > window.innerHeight * 0.55);
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------------- Section highlight + number-key jumps ---------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".actionbar ol a"));
  if ("IntersectionObserver" in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id); });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { secObs.observe(s); });
  }
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    var n = parseInt(e.key, 10);
    if (n >= 1 && n <= navLinks.length) {
      var a = navLinks[n - 1];
      a.classList.remove("pressed"); void a.offsetWidth; a.classList.add("pressed");
      document.querySelector(a.getAttribute("href")).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }
  });

  /* ---------------- Scroll reveal (staggered per group) ---------------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.hasAttribute("data-reveal"); });
        el.style.transitionDelay = Math.min(siblings.indexOf(el), 6) * 70 + "ms";
        el.classList.add("in");
        setTimeout(function () { el.style.transitionDelay = ""; }, 1300);
        revObs.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { revObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------------- Floating combat text + sparks ---------------- */
  var fct = document.querySelector(".fct");
  function floatText(x, y, text, cls) {
    var el = document.createElement("span");
    el.className = "fct-text" + (cls ? " " + cls : "");
    el.textContent = text;
    el.style.left = x + "px"; el.style.top = y + "px";
    fct.appendChild(el);
    setTimeout(function () { el.remove(); }, 1400);
  }
  function sparks(x, y, n) {
    if (reduceMotion || !fct.animate) return;
    for (var i = 0; i < n; i++) {
      var s = document.createElement("span");
      s.className = "spark";
      s.style.left = x + "px"; s.style.top = y + "px";
      fct.appendChild(s);
      var ang = Math.random() * Math.PI * 2, dist = 30 + Math.random() * 60;
      s.animate([
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: "translate(" + Math.cos(ang) * dist + "px," + (Math.sin(ang) * dist + 20) + "px) scale(0)", opacity: 0 }
      ], { duration: 600 + Math.random() * 400, easing: "cubic-bezier(.2,.8,.2,1)" }).onfinish = (function (el) { return function () { el.remove(); }; })(s);
    }
  }
  function centerOf(el) { var r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }

  /* ---------------- Banner ---------------- */
  var banner = document.querySelector(".banner");
  var bannerText = banner.querySelector(".banner-text");
  var bannerQueue = [], bannerBusy = false;
  function showBanner(text) { bannerQueue.push(text); if (!bannerBusy) nextBanner(); }
  function nextBanner() {
    var text = bannerQueue.shift();
    if (!text) { bannerBusy = false; return; }
    bannerBusy = true;
    bannerText.textContent = text;
    banner.classList.remove("show"); void banner.offsetWidth; banner.classList.add("show");
    setTimeout(nextBanner, 2700);
  }

  /* ---------------- XP: 11 commands + 9 tools = 20 XP, a level every 4 ---------------- */
  var copied = load("cmds", []);
  var builtin = load("builtin", []);
  var lines = Array.prototype.slice.call(document.querySelectorAll(".line"));
  var boxes = Array.prototype.slice.call(document.querySelectorAll(".checklist input"));
  var MAX_XP = lines.length + boxes.length;
  var xpEl = document.querySelector(".xpbar");
  var fill = xpEl.querySelector(".xp-fill");
  var lvlEl = xpEl.querySelector(".xp-level b");
  var xpText = xpEl.querySelector(".xp-text");
  function xpNow() { return copied.length + builtin.length; }
  function levelFor(xp) { return 1 + Math.floor(xp / 4); }
  var lastLevel = levelFor(xpNow());

  function renderXP(announce) {
    var xp = xpNow();
    var pct = Math.round(xp / MAX_XP * 100);
    fill.style.width = pct + "%";
    xpEl.setAttribute("aria-valuenow", pct);
    xpText.textContent = xp + " / " + MAX_XP + " XP";
    var lvl = levelFor(xp);
    lvlEl.textContent = lvl;
    if (announce && lvl > lastLevel) {
      lvlEl.classList.remove("bump"); void lvlEl.offsetWidth; lvlEl.classList.add("bump");
      showBanner(xp >= MAX_XP ? "Max level!" : "Level up!");
      var c = centerOf(lvlEl); sparks(c[0], c[1], 26);
    }
    lastLevel = lvl;
  }

  /* ---------------- Copy console lines ---------------- */
  lines.forEach(function (btn) {
    var cmd = btn.textContent.trim();
    if (copied.indexOf(cmd) !== -1) btn.classList.add("done");
    btn.addEventListener("click", function (e) {
      navigator.clipboard.writeText(cmd).then(function () {
        btn.classList.add("done");
        var x = e.clientX || centerOf(btn)[0], y = e.clientY || centerOf(btn)[1];
        floatText(x, y - 10, "Copied!");
        sparks(x, y, 12);
        if (copied.indexOf(cmd) === -1) {
          copied.push(cmd); save("cmds", copied);
          setTimeout(function () { floatText(x + 40, y + 10, "+1 XP", "xp"); }, 180);
          renderXP(true);
        }
      }, function () {
        floatText(e.clientX, e.clientY, "Select it and press Ctrl+C");
      });
    });
  });

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var text = document.querySelector(btn.dataset.copy).innerText.trim();
      navigator.clipboard.writeText(text).then(function () {
        var c = centerOf(btn);
        floatText(c[0], c[1] - 20, "Copied!");
        sparks(c[0], c[1], 14);
      });
    });
  });

  /* ---------------- Quest checklist ---------------- */
  var tallyN = document.querySelector(".tally-n");
  document.querySelector(".tally-d").textContent = boxes.length;
  function renderTally(animate) {
    tallyN.textContent = builtin.length;
    if (animate) { tallyN.classList.remove("bump"); void tallyN.offsetWidth; tallyN.classList.add("bump"); }
  }
  boxes.forEach(function (box) {
    box.checked = builtin.indexOf(box.value) !== -1;
    box.addEventListener("change", function () {
      builtin = boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.value; });
      save("builtin", builtin);
      renderTally(true);
      if (box.checked) {
        var c = centerOf(box);
        sparks(c[0], c[1], 10);
        floatText(c[0] + 30, c[1] - 10, "+1 XP", "xp");
        if (builtin.length === boxes.length) showBanner("Quest complete!");
      }
      renderXP(true);
    });
  });
  renderTally(false);
  renderXP(false);

  /* ---------------- Loot cards: tilt toward the cursor ---------------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".item").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "rotateY(" + px * 10 + "deg) rotateX(" + (-py * 10) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }
})();
