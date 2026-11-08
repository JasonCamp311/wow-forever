/* Shared script for classes.html and leveling.html. Reads window.FOREVER from guide-data.js. */
(function () {
  "use strict";
  var F = window.FOREVER;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var page = document.body.getAttribute("data-page");

  function load(key, fallback) {
    try { var v = localStorage.getItem("forever-guide:" + key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem("forever-guide:" + key, JSON.stringify(value)); } catch (e) { /* storage off: progress lasts this visit */ }
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function $(sel, root) { return (root || document).querySelector(sel); }

  /* ---------------- floating text + sparks ---------------- */
  var fct = $(".fct");
  function floatText(x, y, text, cls) {
    if (!fct) return;
    var el = document.createElement("span");
    el.className = "fct-text" + (cls ? " " + cls : "");
    el.textContent = text; el.style.left = x + "px"; el.style.top = y + "px";
    fct.appendChild(el);
    setTimeout(function () { el.remove(); }, 1400);
  }
  function sparks(x, y, n) {
    if (!fct || reduceMotion || !fct.animate) return;
    for (var i = 0; i < n; i++) {
      var s = document.createElement("span");
      s.className = "spark"; s.style.left = x + "px"; s.style.top = y + "px";
      fct.appendChild(s);
      var a = Math.random() * Math.PI * 2, d = 30 + Math.random() * 50;
      s.animate([{ transform: "translate(0,0) scale(1)", opacity: 1 },
                 { transform: "translate(" + Math.cos(a) * d + "px," + (Math.sin(a) * d + 20) + "px) scale(0)", opacity: 0 }],
                { duration: 600 + Math.random() * 400, easing: "cubic-bezier(.2,.8,.2,1)" }).onfinish = (function (el) { return function () { el.remove(); }; })(s);
    }
  }
  function centerOf(el) { var r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }

  var banner = $(".banner"), bannerText = banner && $(".banner-text", banner);
  function showBanner(text) {
    if (!banner) return;
    bannerText.textContent = text;
    banner.classList.remove("show"); void banner.offsetWidth; banner.classList.add("show");
  }

  /* copy any [data-cmd] button */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-cmd]");
    if (!btn) return;
    var cmd = btn.getAttribute("data-cmd");
    var c = centerOf(btn);
    navigator.clipboard.writeText(cmd).then(function () {
      floatText(c[0], c[1] - 16, "Copied!"); sparks(c[0], c[1], 10);
    }, function () { floatText(c[0], c[1] - 16, "Select it and press Ctrl+C"); });
  });

  /* ---------------- shared bits ---------------- */
  var ROLE = { tank: "Tank", heal: "Healer", dps: "Damage" };
  function roleBadges(roles) {
    return roles.split(" ").map(function (r) { return '<span class="role role-' + r + '">' + ROLE[r] + "</span>"; }).join("");
  }
  function addonChip(u) {
    var id = typeof u === "string" ? u : u[0];
    var cmd = typeof u === "string" ? null : u[1];
    var a = F.addons[id];
    if (!a) return "";
    var shown = cmd || a.cmd;
    var tip = a.name + ": " + a.what + (a.installed ? "" : " (not in the installer script; get it from CurseForge)");
    return '<span class="chip q-' + a.q + (a.installed ? "" : " missing") + '" title="' + esc(tip) + '">' +
      '<span class="chip-name">' + esc(a.name) + "</span>" +
      (shown ? '<button type="button" class="chip-cmd" data-cmd="' + esc(shown) + '" aria-label="Copy ' + esc(shown) + '">' + esc(shown) + "</button>" : "") +
      "</span>";
  }
  function raceList(cls) {
    return Object.keys(F.races).filter(function (r) { return F.races[r].classes.indexOf(cls) !== -1; });
  }
  function raceName(r) { return F.races[r].name; }

  /* ---------------- scroll reveal ---------------- */
  function reveal(root) {
    var els = (root || document).querySelectorAll("[data-reveal]:not(.in)");
    if (!("IntersectionObserver" in window) || reduceMotion) { els.forEach(function (el) { el.classList.add("in"); }); return; }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* =================================================================== classes page */
  function renderClasses() {
    var nav = $(".class-nav"), out = $("#class-list");
    var keys = Object.keys(F.classes);
    nav.innerHTML = keys.map(function (k) {
      var c = F.classes[k];
      return '<a href="#' + k + '" style="--cc:' + c.color + '">' + c.name + "</a>";
    }).join("");

    out.innerHTML = keys.map(function (k) {
      var c = F.classes[k];
      var specs = c.specs.map(function (s) {
        var star = s[0] === c.level ? ' <span class="lvl-pick">Level as this</span>' : "";
        return '<li class="spec' + (s[0] === c.level ? " picked" : "") + '"><h4>' + s[0] + star + "</h4><p class=\"roles\">" + roleBadges(s[1]) + "</p><p>" + s[2] + "</p></li>";
      }).join("");
      var talents = c.talents.rows.map(function (r) { return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td></tr>"; }).join("");
      var allRaces = raceList(k);
      var raceLinks = allRaces.map(function (r) {
        return '<a class="race-link" href="leveling.html#' + r + "-" + k + '">' + raceName(r) + (F.races[r].newCombo.indexOf(k) !== -1 ? ' <span class="new">new</span>' : "") + "</a>";
      }).join("");
      var picks = c.races.map(function (r) { return "<li><strong>" + raceName(r[0]) + "</strong>: " + r[1] + "</li>"; }).join("");
      var spells = c.milestones.map(function (m) { return "<li><span class=\"lv\">" + m[0] + "</span> <strong>" + m[1] + "</strong>: " + m[2] + "</li>"; }).join("");
      return '<article class="frame classcard" id="' + k + '" style="--cc:' + c.color + '" data-reveal>' +
        '<header class="classcard-head"><h2>' + c.name + '</h2><p class="roles">' + uniqueRoles(c) + "</p></header>" +
        '<ul class="specs">' + specs + "</ul>" +
        '<div class="classcard-grid">' +
          '<section><h3>Leveling as ' + c.level + "</h3><p>" + c.levelWhy + "</p>" +
            "<table class=\"talents\"><thead><tr><th scope=\"col\">Level</th><th scope=\"col\">Talent points</th></tr></thead><tbody>" + talents + "</tbody></table>" +
            (c.talents.exact ? "" : '<p class="note">Icy Veins publishes this one as a priority list, not point by point. Fill the tiers in the order shown.</p>') +
          "</section>" +
          "<section><h3>At level 60</h3><p>" + c.endgame + "</p>" +
            "<h3>Class milestones to 20</h3><ul class=\"miles\">" + spells + "</ul>" +
            "<h3>Races that suit it</h3><ul class=\"picks\">" + picks + "</ul>" +
          "</section>" +
        "</div>" +
        '<footer class="classcard-foot"><span>1–20 guide for:</span> ' + raceLinks + "</footer>" +
      "</article>";
    }).join("");
    reveal(out);
  }
  function uniqueRoles(c) {
    var seen = {};
    c.specs.forEach(function (s) { s[1].split(" ").forEach(function (r) { seen[r] = 1; }); });
    return roleBadges(Object.keys(seen).sort(function (a, b) { return "tank heal dps".indexOf(a) - "tank heal dps".indexOf(b); }).join(" "));
  }

  /* =================================================================== leveling page */
  function renderPicker() {
    var factions = { Alliance: [], Horde: [] };
    Object.keys(F.races).forEach(function (r) { factions[F.races[r].faction].push(r); });
    $(".race-pick").innerHTML = Object.keys(factions).map(function (f) {
      return '<div class="faction faction-' + f.toLowerCase() + '"><h3>' + f + '</h3><div class="pick-row">' +
        factions[f].map(function (r) {
          return '<button type="button" class="pick" data-race="' + r + '" aria-pressed="false">' + raceName(r) + "</button>";
        }).join("") + "</div></div>";
    }).join("");
  }

  var state = { race: null, cls: null };
  function setFromHash() {
    var h = decodeURIComponent(location.hash.slice(1)).split("-");
    var r = h[0], c = h[1];
    if (F.races[r]) {
      state.race = r;
      state.cls = c && F.races[r].classes.indexOf(c) !== -1 ? c : null;
    }
    renderClassPick(); renderGuide();
  }
  function go(race, cls) {
    var h = race + (cls ? "-" + cls : "");
    if (location.hash.slice(1) !== h) history.replaceState(null, "", "#" + h);
    state.race = race; state.cls = cls;
    renderClassPick(); renderGuide();
  }
  function renderClassPick() {
    document.querySelectorAll("[data-race]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-race") === state.race)); });
    var box = $(".class-pick");
    if (!state.race) { box.innerHTML = '<p class="hint">Choose a race first.</p>'; return; }
    var race = F.races[state.race];
    box.innerHTML = race.classes.map(function (c) {
      var cl = F.classes[c];
      return '<button type="button" class="pick pick-class" style="--cc:' + cl.color + '" data-class="' + c + '" aria-pressed="' + (c === state.cls) + '">' +
        cl.name + (race.newCombo.indexOf(c) !== -1 ? ' <span class="new">new</span>' : "") + "</button>";
    }).join("");
  }

  function buildSteps(race, cls) {
    var R = F.races[race], C = F.classes[cls], route = F.routes[R.start];
    var steps = [];
    route.steps.forEach(function (s, i) {
      steps.push({ id: "r" + i, from: s[0], to: s[1], title: s[2], html: s[3], use: s[4] || [], opts: s[5] || {}, kind: (s[5] && s[5].kind) || "route", order: 0 });
    });
    var combo = F.combos[race + "-" + cls] || [];
    var comboLevels = {};
    combo.forEach(function (m, i) {
      comboLevels[m[5] || m[0]] = true;
      steps.push({ id: "x" + i, from: m[0], to: m[0], title: m[1], html: m[2], use: m[3] || [], opts: { verify: m[4] }, kind: "class", order: 1 });
    });
    C.milestones.forEach(function (m, i) {
      if (comboLevels[m[0]]) return; // a race-specific version replaces the generic one
      steps.push({ id: "c" + i, from: m[0], to: m[0], title: m[1], html: m[2], use: m[3] || [], opts: {}, kind: "class", order: 1 });
    });
    F.common.forEach(function (m, i) {
      steps.push({ id: "g" + i, from: m[0], to: m[0], title: m[1], html: m[2], use: m[3] || [], opts: {}, kind: "gear", order: 2 });
    });
    steps.sort(function (a, b) {
      if (a.kind === "setup") return -1; if (b.kind === "setup") return 1;
      return a.from - b.from || a.order - b.order;
    });
    return steps;
  }

  var BRACKETS = [[1, 5, "The first steps"], [6, 10, "Talents unlock"], [11, 15, "Leaving home"], [16, 20, "First dungeons"]];

  function renderGuide() {
    var out = $("#guide");
    if (!state.race || !state.cls) {
      out.innerHTML = state.race ? '<p class="hint big">Now choose a class.</p>' : "";
      updateBar(null);
      return;
    }
    var race = state.race, cls = state.cls;
    var R = F.races[race], C = F.classes[cls], route = F.routes[R.start];
    var key = race + "-" + cls;
    var steps = buildSteps(race, cls);
    var done = load("lvl:" + key, []);

    var racials = R.racials.map(function (r) { return "<li><strong>" + r[0] + "</strong>: " + r[1] + "</li>"; }).join("");
    var talentRows = C.talents.rows.map(function (r) { return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td></tr>"; }).join("");

    // addon loadout: every addon this guide calls for
    var used = {};
    steps.forEach(function (s) { s.use.forEach(function (u) { used[typeof u === "string" ? u : u[0]] = 1; }); });
    ["questie", "rxp", "pawn", "dj", "bis", "atlas"].forEach(function (k) { used[k] = 1; });
    var loadout = Object.keys(used).map(function (k) {
      var a = F.addons[k];
      return '<li class="q-' + a.q + '"><strong>' + a.name + "</strong>" + (a.cmd ? " <code>" + a.cmd + "</code>" : "") +
        (a.installed ? ' <span class="have">in installer</span>' : ' <a class="get" href="' + a.url + '">CurseForge</a>') +
        "<br><span>" + a.what + "</span></li>";
    }).join("");

    var html = '<div class="guide-head frame" style="--cc:' + C.color + '" data-reveal>' +
      '<p class="kicker">' + R.faction + " · " + route.name + "</p>" +
      "<h2>" + (R.short || R.name) + " " + C.name + (R.newCombo.indexOf(cls) !== -1 ? ' <span class="new">new in Forever</span>' : "") + "</h2>" +
      (R.pack ? '<p class="note">Skyborne need the Skyborne Heroic Pack or a higher edition.</p>' : "") +
      '<div class="guide-grid">' +
        "<section><h3>Racials that matter</h3><ul>" + racials + "</ul></section>" +
        "<section><h3>Level as " + C.level + ' <a class="small" href="classes.html#' + cls + '">class guide</a></h3><p>' + C.levelWhy + "</p>" +
          '<table class="talents"><tbody>' + talentRows + "</tbody></table></section>" +
      "</div></div>" +
      '<details class="frame loadout" data-reveal open><summary>Addon loadout for this guide</summary><ul>' + loadout + "</ul>" +
      '<p class="note">Missing ones install with <code>tools/install_addons.py</code> on the <a href="index.html#addons">main page</a>, or from CurseForge with WoW Forever selected.</p></details>';

    BRACKETS.forEach(function (b) {
      var inB = steps.filter(function (s) { return s.from >= b[0] && s.from <= b[1]; });
      if (!inB.length) return;
      html += '<section class="bracket"><h3 class="bracket-h"><span>Level ' + b[0] + "–" + b[1] + "</span> " + b[2] + '</h3><ol class="steps">';
      inB.forEach(function (s) {
        var lv = s.from === s.to ? s.from : s.from + "–" + s.to;
        var d = s.opts.dungeon && F.dungeons[s.opts.dungeon];
        html += '<li class="step step-' + s.kind + '"><label class="step-check"><input type="checkbox" data-step="' + s.id + '"' + (done.indexOf(s.id) !== -1 ? " checked" : "") + '><span class="sr">Done</span></label>' +
          '<div class="step-body"><p class="step-meta"><span class="lv">' + lv + "</span>" + kindLabel(s.kind) + "</p>" +
          "<h4>" + s.title + "</h4><p>" + s.html + "</p>" +
          (d ? '<div class="dungeon"><p><strong>' + d.name + "</strong>" + (d.isNew ? ' <span class="new">new</span>' : "") + " · level " + d.lvl + " · " + d.where + "</p>" +
               (d.quests ? "<p>Quests: " + d.quests + "</p>" : "") + (d.loot ? "<p>" + d.loot + "</p>" : "") + "</div>" : "") +
          (s.opts.verify ? '<p class="verify">Verify in game: ' + s.opts.verify + "</p>" : "") +
          (s.use.length ? '<p class="chips">' + s.use.map(addonChip).join("") + "</p>" : "") +
          "</div></li>";
      });
      html += "</ol></section>";
    });
    html += '<div class="frame next20" data-reveal><h3>Level 20</h3><p>That’s the end of this guide. When you get there, the 20–30 route for ' + (R.short || R.name) + " " + C.name + " comes next.</p></div>";
    out.innerHTML = html;
    reveal(out);

    var boxes = Array.prototype.slice.call(out.querySelectorAll("[data-step]"));
    function sync(announce, box) {
      done = boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.getAttribute("data-step"); });
      save("lvl:" + key, done);
      var lastLevel = 1;
      boxes.forEach(function (b, i) {
        b.closest(".step").classList.toggle("is-done", b.checked);
        if (b.checked) lastLevel = Math.max(lastLevel, steps[i].to);
      });
      updateBar({ n: done.length, total: boxes.length, level: lastLevel });
      if (announce && box && box.checked) {
        var c = centerOf(box); sparks(c[0], c[1], 10); floatText(c[0] + 30, c[1] - 10, "+1", "xp");
        if (done.length === boxes.length) showBanner("Level 20!");
      }
    }
    boxes.forEach(function (b) { b.addEventListener("change", function () { sync(true, b); }); });
    sync(false);
  }
  function kindLabel(k) {
    return { setup: '<span class="kind">Setup</span>', route: '<span class="kind kind-route">Questing</span>', "class": '<span class="kind kind-class">Class</span>', gear: '<span class="kind kind-gear">Gear &amp; addons</span>' }[k] || "";
  }

  function updateBar(p) {
    var bar = $(".xpbar");
    if (!bar) return;
    bar.hidden = !p;
    if (!p) return;
    var pct = Math.round(p.n / p.total * 100);
    $(".xp-fill", bar).style.width = pct + "%";
    bar.setAttribute("aria-valuenow", pct);
    $(".xp-level b", bar).textContent = p.level;
    $(".xp-text", bar).textContent = p.n + " / " + p.total + " steps";
  }

  reveal(document); // static frames (picker, explainer) fade in too

  if (page === "classes") {
    renderClasses();
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(function () { t.scrollIntoView(); }, 0); }
  }
  if (page === "leveling") {
    renderPicker();
    document.addEventListener("click", function (e) {
      var r = e.target.closest("[data-race]"), c = e.target.closest("[data-class]");
      if (r) go(r.getAttribute("data-race"), state.cls && F.races[r.getAttribute("data-race")].classes.indexOf(state.cls) !== -1 ? state.cls : null);
      if (c) { go(state.race, c.getAttribute("data-class")); var g = $("#guide"); if (g) g.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); }
    });
    window.addEventListener("hashchange", setFromHash);
    setFromHash();
  }
  $(".updated") && ($(".updated").textContent = F.updated + " (patch " + F.patch + ")");
})();
