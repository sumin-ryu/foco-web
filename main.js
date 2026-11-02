(function () {
  // —— Intro: recreate gauge-hd fill (CSS), not AE video ——
  // Segments: olive 0–38%, rest 38–46%, blue 46%→; active tip = color→#fff + glow
  var SEG_A = 0.38;
  var SEG_B0 = 0.46;
  var LOAD_MS = 3200;
  var HOLD_MS = 280;

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function clearActive(el) {
    if (!el) return;
    el.classList.remove("is-active");
  }

  function setFill(el, left, width, active) {
    if (!el) return;
    el.style.left = left * 100 + "%";
    el.style.width = Math.max(0, width) * 100 + "%";
    if (active && width > 0.0005) el.classList.add("is-active");
    else el.classList.remove("is-active");
  }

  function setGauge(frac) {
    var f = Math.max(0, Math.min(1, frac));
    var olive = document.getElementById("fillOlive");
    var rest = document.getElementById("fillRest");
    var blue = document.getElementById("fillBlue");
    var bar = document.getElementById("introBar");
    var pct = document.getElementById("introPercent");

    clearActive(olive);
    clearActive(rest);
    clearActive(blue);

    if (f <= SEG_A) {
      setFill(olive, 0, f, true);
      setFill(rest, SEG_A, 0, false);
      setFill(blue, SEG_B0, 0, false);
    } else if (f <= SEG_B0) {
      setFill(olive, 0, SEG_A, false);
      setFill(rest, SEG_A, f - SEG_A, true);
      setFill(blue, SEG_B0, 0, false);
    } else {
      setFill(olive, 0, SEG_A, false);
      setFill(rest, SEG_A, SEG_B0 - SEG_A, false);
      setFill(blue, SEG_B0, f - SEG_B0, true);
    }

    if (bar) bar.setAttribute("aria-valuenow", String(Math.round(f * 100)));
    if (pct) pct.textContent = Math.round(f * 100) + "%";
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
    if (!document.getElementById("introBar")) {
      finishIntro();
      return;
    }

    document.body.classList.add("is-loading");

    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setGauge(1);
      window.setTimeout(finishIntro, 700);
      return;
    }

    setGauge(0);
    var t0 = null;
    function frame(now) {
      if (t0 === null) t0 = now;
      var p = Math.min(1, (now - t0) / LOAD_MS);
      setGauge(easeInOut(p));
      if (p < 1) window.requestAnimationFrame(frame);
      else window.setTimeout(finishIntro, HOLD_MS);
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
