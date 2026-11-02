(function () {
  // —— Intro: FOCO 1H timer bar as loading gauge ——
  // Matches AE plate: olive cap → steel blue → white tip + glow
  var OLIVE_CAP = 0.36;
  var TIP_RATIO = 0.06;
  var LOAD_MS = 2200;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function setBarFill(frac) {
    var bar = document.getElementById("introBar");
    var oliveEl = document.getElementById("introOlive");
    var blueEl = document.getElementById("introBlue");
    var tipEl = document.getElementById("introTip");
    var glowEl = document.getElementById("introTipGlow");
    if (!bar || !oliveEl || !blueEl || !tipEl || !glowEl) return;

    var f = Math.max(0, Math.min(1, frac));
    var olive = Math.min(OLIVE_CAP, f);
    var tip = Math.min(TIP_RATIO, Math.max(0, f - olive));
    var blue = Math.max(0, f - olive - tip);

    oliveEl.style.width = olive * 100 + "%";
    blueEl.style.left = olive * 100 + "%";
    blueEl.style.width = blue * 100 + "%";
    tipEl.style.left = (olive + blue) * 100 + "%";
    tipEl.style.width = Math.max(f > 0 ? 0.8 : 0, tip * 100) + "%";
    glowEl.style.left = (olive + blue) * 100 + "%";
    glowEl.style.width = Math.max(f > 0 ? 1.2 : 0, tip * 100 + 1.5) + "%";
    bar.setAttribute("aria-valuenow", String(Math.round(f * 100)));
  }

  function finishIntro() {
    var intro = document.getElementById("intro");
    if (intro) intro.classList.add("is-done");
    document.body.classList.remove("is-loading");
    window.setTimeout(function () {
      if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
    }, 600);
  }

  function runIntro() {
    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !document.getElementById("introBar")) {
      setBarFill(1);
      finishIntro();
      return;
    }

    setBarFill(0);
    var t0 = null;
    function frame(now) {
      if (t0 === null) t0 = now;
      var p = Math.min(1, (now - t0) / LOAD_MS);
      setBarFill(easeOutCubic(p));
      if (p < 1) {
        window.requestAnimationFrame(frame);
      } else {
        window.setTimeout(finishIntro, 180);
      }
    }
    window.requestAnimationFrame(frame);
  }

  runIntro();

  var IDS = ["1H", "2H", "4H", "6H", "8H"];
  var SVGS = {
    "1H":
      '<svg viewBox="0 0 120 120"><line x1="60" y1="18" x2="60" y2="102" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>',
    "2H":
      '<svg viewBox="0 0 120 120"><line x1="60" y1="18" x2="60" y2="102" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><line x1="18" y1="60" x2="102" y2="60" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>',
    "4H":
      '<svg viewBox="0 0 120 120"><line x1="60" y1="18" x2="60" y2="102" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><line x1="18" y1="60" x2="102" y2="60" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><line x1="30" y1="30" x2="90" y2="90" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><line x1="90" y1="30" x2="30" y2="90" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>',
    "6H":
      '<svg viewBox="0 0 120 120"><g stroke="currentColor" stroke-width="5" stroke-linecap="round" transform="translate(60 60)"><line x1="0" y1="-42" x2="0" y2="42"/><line x1="-36.4" y1="-21" x2="36.4" y2="21"/><line x1="-36.4" y1="21" x2="36.4" y2="-21"/></g></svg>',
    "8H":
      '<svg viewBox="0 0 120 120"><g stroke="currentColor" stroke-width="5" stroke-linecap="round" transform="translate(60 60)"><line x1="0" y1="-42" x2="0" y2="42"/><line x1="-42" y1="0" x2="42" y2="0"/><line x1="-29.7" y1="-29.7" x2="29.7" y2="29.7"/><line x1="29.7" y1="-29.7" x2="-29.7" y2="29.7"/></g><circle cx="60" cy="60" r="3.5" fill="currentColor"/></svg>'
  };

  var lineup = document.getElementById("stageLineup");
  if (lineup) {
    var html = "";
    var i;
    for (i = 0; i < IDS.length; i++) {
      html +=
        '<div class="slot" data-id="' +
        IDS[i] +
        '">' +
        SVGS[IDS[i]] +
        "<em>" +
        IDS[i] +
        "</em></div>";
    }
    lineup.innerHTML = html;
  }

  var slots = lineup ? lineup.querySelectorAll(".slot") : [];
  var items = document.querySelectorAll(".motif-item");
  var idx = 0;
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setActive(n) {
    var j;
    for (j = 0; j < slots.length; j++) {
      if (j === n) slots[j].classList.add("is-hot");
      else slots[j].classList.remove("is-hot");
    }
    for (j = 0; j < items.length; j++) {
      if (j === n) items[j].classList.add("is-active");
      else items[j].classList.remove("is-active");
    }
  }

  if (!reduce && slots.length) {
    setActive(0);
    window.setInterval(function () {
      idx = (idx + 1) % IDS.length;
      setActive(idx);
    }, 900);
  } else if (slots.length) {
    setActive(0);
  }

  // Reveal sections lightly on scroll
  if (!reduce && "IntersectionObserver" in window) {
    var els = document.querySelectorAll(".section-head, .motif-row, .story, .stage-frame, .product-visual, .close-mark");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(18px)";
      el.style.transition = "opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)";
      io.observe(el);
    });
    var style = document.createElement("style");
    style.textContent = ".in{opacity:1!important;transform:none!important}";
    document.head.appendChild(style);
  }
})();
