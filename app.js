(function () {
  var toast = document.querySelector(".toast");
  var toastTimer;
  function say(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 1800);
  }

  // Copy buttons
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = document.querySelector(btn.dataset.copy).innerText.trim();
      var label = btn.textContent;
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = "Copied";
        btn.classList.add("done");
        say("Copied to clipboard");
        setTimeout(function () { btn.textContent = label; btn.classList.remove("done"); }, 1800);
      }, function () {
        say("Copy failed. Select the text and press Ctrl+C.");
      });
    });
  });

  // One-line console commands: click to copy
  document.querySelectorAll(".line").forEach(function (btn) {
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(btn.textContent.trim()).then(function () {
        document.querySelectorAll(".line.done").forEach(function (b) { b.classList.remove("done"); });
        btn.classList.add("done");
        say("Copied. Paste it into chat and press Enter.");
      }, function () {
        say("Copy failed. Select the text and press Ctrl+C.");
      });
    });
  });

  // Checklist that remembers ticks in this browser
  document.querySelectorAll(".checklist[data-store]").forEach(function (list) {
    var key = "forever-guide:" + list.dataset.store;
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) { saved = []; }
    list.querySelectorAll("input").forEach(function (box) {
      box.checked = saved.indexOf(box.value) !== -1;
      box.addEventListener("change", function () {
        var ticked = Array.prototype.filter.call(list.querySelectorAll("input"), function (b) { return b.checked; })
          .map(function (b) { return b.value; });
        try { localStorage.setItem(key, JSON.stringify(ticked)); } catch (e) { /* storage off: ticks last this visit */ }
      });
    });
  });

  // Highlight the current section in the contents list
  var links = document.querySelectorAll(".toc a");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { observer.observe(s); });
  }
})();
