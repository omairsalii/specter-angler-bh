/* Specter Angler BH — interactive tide centre (live gauge + countdown, tide coefficient, day picker, interactive chart) */
"use strict";
(function () {
  const DAY = 864e5, H = 36e5, LAT = 26.2, LNG = 50.6;
  const RM = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dayStart = t => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d; };
  const fmt = d => (typeof fmtH === "function" ? fmtH(new Date(+d)) : new Date(+d).toLocaleTimeString());
  const dur = ms => { ms = Math.max(0, ms); const h = Math.floor(ms / H), m = Math.round((ms % H) / 6e4); return (h ? `${h} س ` : "") + `${m} د`; };
  const dayName = (t, today) => {
    const d = dayStart(t), diff = Math.round((d - dayStart(today)) / DAY);
    if (diff === 0) return "اليوم"; if (diff === 1) return "غداً"; if (diff === -1) return "أمس";
    return d.toLocaleDateString("ar-BH-u-nu-latn", {weekday: "long", day: "numeric", month: "long"});
  };

  /* ---------- tide coefficient: daily range scaled 20 (weakest neap) … 120 (strongest spring) over a year ---------- */
  let RANGE = null;
  function rangeScale() {
    if (RANGE) return RANGE;
    const y = new Date().getFullYear(), k = "sab_tcoef_" + y;
    try { const c = JSON.parse(localStorage.getItem(k)); if (c && c.min) return (RANGE = c); } catch (e) {}
    let min = 1e9, max = -1e9; const t0 = +new Date(y, 0, 1);
    for (let d = 0; d < 366; d += 1) { const r = dayRange(t0 + d * DAY, 0); if (r < min) min = r; if (r > max) max = r; }
    RANGE = {min, max}; try { localStorage.setItem(k, JSON.stringify(RANGE)); } catch (e) {}
    return RANGE;
  }
  function dayRange(t, off) {               // highest high − lowest low within the day (30-min sampling is plenty for the range)
    let lo = 1e9, hi = -1e9;
    for (let m = 0; m <= 24 * 60; m += 30) { const v = HTIDE.level(+t + m * 6e4, off); if (v < lo) lo = v; if (v > hi) hi = v; }
    return hi - lo;
  }
  const coefOf = (t, off) => { const R = rangeScale(), r = dayRange(dayStart(t), off); return Math.round(20 + 100 * (r - R.min) / ((R.max - R.min) || 1)); };
  const coefLabel = c => c >= 95 ? ["مدّ قوي جداً", "#ff5d73"] : c >= 70 ? ["مدّ قوي", "#2ecc71"] : c >= 45 ? ["مدّ متوسط", "#f1c40f"] : ["مدّ ضعيف (ميت)", "#8fa8bf"];
  const moonIcon = d => {                     // icon only on the day the phase crosses new / first quarter / full / last quarter
    if (typeof moonPhase !== "function") return "";
    let a = moonPhase(new Date(d)), b = moonPhase(new Date(d + DAY)); if (b < a) b += 1;
    for (const [q, ic] of [[0, "🌑"], [0.25, "🌓"], [0.5, "🌕"], [0.75, "🌗"], [1, "🌑"]]) if (a <= q && b > q) return ic;
    return "";
  };

  /* ---------- state ---------- */
  const ST = {box: null, off: 0, sel: null, timer: 0, compact: false};

  function render(box, off) {
    ST.box = box; ST.off = off || 0;
    if (ST.sel == null) ST.sel = +dayStart(Date.now());
    box.innerHTML = `<div class="tp-head"><h2>🌊 المدّ والجزر</h2><span class="tp-src">محطة ميناء سلمان${ST.off ? ` · مُعايَر ${ST.off > 0 ? "+" : ""}${ST.off} د` : ""}</span></div>
      <div id="tpLive"></div>
      <div class="tp-days"><button class="tp-arr" data-tpd="-1" aria-label="اليوم السابق">›</button><div id="tpDayName"></div><button class="tp-arr" data-tpd="1" aria-label="اليوم التالي">‹</button></div>
      <div id="tpCoef"></div>
      <div id="tpTable"></div>
      <div id="tpSol"></div>
      <div class="tp-chartwrap"><div id="tpChart"></div><div id="tpTip"></div></div>
      <div class="tp-legend"><span><i style="background:rgba(46,204,113,.35)"></i> أفضل وقت (أول ساعتين من المدّ)</span><span><i style="background:rgba(0,0,0,.35)"></i> الليل</span><span><i style="background:#9b6bff"></i> سولونار كبرى</span><span><i style="background:rgba(155,107,255,.45)"></i> صغرى</span></div>
      <h3 style="margin-top:14px">معامل المدّ لثلاثين يوماً <span class="mute" style="font-size:12px">· اضغط أي يوم</span></h3>
      <div id="tpBars" class="tp-bars"></div>
      <div class="mute" style="font-size:11px;margin-top:8px">محسوب من ثوابت محطة قياس المدّ في ميناء سلمان (TICON-4). الارتفاع منسوب إلى متوسط سطح البحر. ليس للملاحة.</div>`;
    box.onclick = e => {
      const d = e.target.closest("[data-tpd]"), b = e.target.closest("[data-tpday]");
      if (d) { ST.sel += +d.dataset.tpd * DAY; ST.sel = +dayStart(ST.sel); paintDay(true); }
      if (b) { ST.sel = +b.dataset.tpday; paintDay(true); }
    };
    paintLive(); paintBars(); paintDay(false);
    clearInterval(ST.timer); ST.timer = setInterval(() => { if (document.body.contains(box)) paintLive(); else clearInterval(ST.timer); }, 30000);
  }

  /* ---------- live gauge + countdown ---------- */
  function paintLive() {
    const now = Date.now(), ev = HTIDE.extremes(now - 14 * H, now + 14 * H, ST.off);
    const prev = [...ev].reverse().find(e => e.t <= now), next = ev.find(e => e.t > now);
    const el = document.getElementById("tpLive"); if (!el || !prev || !next) return;
    const rising = next.type === "high", lvl = HTIDE.level(now, ST.off);
    const k = (now - prev.t) / (next.t - prev.t);                   // progress through this half-cycle
    const ang = 90 - 180 * k;                                       // needle travels from the previous extreme (right) to the next (left), matching the RTL layout
    const cPrev = prev.type === "low" ? "#ffb347" : "#4da3ff", cNext = next.type === "low" ? "#ffb347" : "#4da3ff";
    const sinceLow = !rising ? null : now - prev.t;
    const inWindow = rising && sinceLow < 2 * H;
    const R = 70, cx = 90, cy = 86, ax = a => cx + R * Math.sin(a * Math.PI / 180), ay = a => cy - R * Math.cos(a * Math.PI / 180);
    el.innerHTML = `<div class="tp-live">
      <div class="tp-side"><div class="mute">${prev.type === "low" ? "🟠 آخر جزر" : "🔵 آخر مدّ"}</div><b>${fmt(prev.t)}</b><div class="tp-cd">منذ ${dur(now - prev.t)}</div></div>
      <div class="tp-gauge"><svg viewBox="0 0 180 104" direction="ltr">
        <defs><linearGradient id="tpg" x1="0" x2="1"><stop offset="0" stop-color="${cNext}"/><stop offset=".5" stop-color="#2ec4b6"/><stop offset="1" stop-color="${cPrev}"/></linearGradient></defs>
        <path d="M${cx - R} ${cy} A${R} ${R} 0 0 1 ${cx + R} ${cy}" fill="none" stroke="#1f3a57" stroke-width="16" stroke-linecap="round"/>
        <path d="M${cx - R} ${cy} A${R} ${R} 0 0 1 ${cx + R} ${cy}" fill="none" stroke="url(#tpg)" stroke-width="16" stroke-linecap="round" opacity=".9"/>
        <g class="tp-needle" style="transform:rotate(${ang}deg);transform-origin:${cx}px ${cy}px"><line x1="${cx}" y1="${cy - 30}" x2="${cx}" y2="${cy - R + 4}" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="${cx}" cy="${cy - R + 4}" r="6" fill="#fff" stroke="#0b1f33" stroke-width="2"/></g>
        <text x="${cx - R}" y="${cy + 16}" fill="${cNext}" font-size="10" text-anchor="middle">${next.type === "low" ? "جزر" : "مدّ"}</text><text x="${cx + R}" y="${cy + 16}" fill="${cPrev}" font-size="10" text-anchor="middle">${prev.type === "low" ? "جزر" : "مدّ"}</text>
      </svg><div class="tp-now"><span>${lvl >= 0 ? "+" : ""}${lvl.toFixed(2)} م</span><em class="${rising ? "up" : "down"}">${rising ? "▲ يرتفع" : "▼ ينخفض"}</em></div></div>
      <div class="tp-side"><div class="mute">${next.type === "high" ? "🔵 المدّ القادم" : "🟠 الجزر القادم"}</div><b>${fmt(next.t)}</b><div class="tp-cd">بعد ${dur(next.t - now)}</div></div>
    </div>
    ${(() => { if (!window.Solunar) return ""; const cur = Solunar.at(now), nx = Solunar.next(now);
      return cur ? `<div class="tp-win sol">🌙 أنت في فترة سولونار ${cur.major ? "كبرى" : "صغرى"} (${Solunar.NAME[cur.type]}) حتى ${fmt(cur.end)}</div>`
        : nx ? `<div class="tp-solnext">🌙 السولونار القادمة: <b>${nx.major ? "كبرى" : "صغرى"}</b> ${fmt(nx.start)} – ${fmt(nx.end)} · بعد ${dur(nx.start - now)}</div>` : ""; })()}
    <div class="tp-prog"><i style="width:${(k * 100).toFixed(1)}%;background:linear-gradient(to left,${cPrev},${cNext})"></i></div>
    ${inWindow ? `<div class="tp-win">🟩 أنت الآن في أفضل نافذة: بقي ${dur(2 * H - sinceLow)} من أول ساعتين للمدّ</div>`
      : rising ? "" : `<div class="tp-win soft">⏳ أفضل نافذة القادمة تبدأ مع الجزر ${fmt(next.type === "low" ? next.t : ev.find(e => e.type === "low" && e.t > now).t)}</div>`}`;
  }

  /* ---------- selected day: name, coefficient, table, chart ---------- */
  function paintDay(scroll) {
    const now = Date.now(), d0 = ST.sel, d1 = d0 + DAY;
    document.getElementById("tpDayName").innerHTML = `<b>${dayName(d0, now)}</b><span class="mute">${new Date(d0).toLocaleDateString("ar-BH-u-nu-latn", {day: "numeric", month: "long", year: "numeric"})}</span>`;
    const c = coefOf(d0, ST.off), [lab, col] = coefLabel(c), mp = typeof moonPhase === "function" ? moonPhase(new Date(d0 + 12 * H)) : 0.5;
    document.getElementById("tpCoef").innerHTML = `<div class="tp-coef">
      <div class="tp-ring" style="--p:${(c - 20)}%;--c:${col}"><b>${c}</b><small>/120</small></div>
      <div><div style="font-weight:800;color:${col}">${lab}</div><div class="mute">قمر ${typeof moonName === "function" ? moonName(mp) : ""} · ${c >= 70 ? "التيار أقوى وحركة السمك أنشط" : c >= 45 ? "حركة ماء معتدلة" : "حركة الماء خفيفة: ركّز على الفجر والغروب"}</div></div></div>`;
    const ev = HTIDE.extremes(d0 - 3 * H, d1 + 3 * H, ST.off), inDay = ev.filter(e => e.t >= d0 && e.t < d1);
    document.getElementById("tpTable").innerHTML = `<div class="tp-rows">${inDay.map(e => {
      const past = e.t < now;
      return `<div class="tp-row ${past ? "past" : ""}"><span class="tp-ic ${e.type}">${e.type === "high" ? "▲" : "▼"}</span><div><b>${fmt(e.t)}</b><div class="mute">${e.type === "high" ? "أعلى مدّ" : "أدنى جزر"}</div></div><div class="tp-h">${e.h >= 0 ? "+" : ""}${e.h.toFixed(2)} م</div></div>`;
    }).join("")}</div>`;
    if (window.Solunar) {
      const ps = Solunar.periods(d0), st = typeof sunTimes === "function" ? sunTimes(new Date(d0 + 12 * H), LAT, LNG) : null, stars = Solunar.dayRating(d0, st);
      document.getElementById("tpSol").innerHTML = `<div class="tp-sol"><div class="tp-solh"><b>🌙 فترات السولونار</b><span title="تقييم اليوم">${"★".repeat(stars)}<em>${"★".repeat(4 - stars)}</em></span></div>
        <div class="tp-solg">${ps.map(p => `<div class="tp-sp ${p.major ? "maj" : "min"} ${p.end < now ? "past" : ""}"><small>${p.major ? "كبرى · ساعتان" : "صغرى · ساعة"}</small><b>${fmt(p.start)} – ${fmt(p.end)}</b><span>${Solunar.NAME[p.type]}</span></div>`).join("")}</div>
        <div class="mute" style="font-size:11px;margin-top:6px">نظرية السولونار: السمك أنشط حين يمرّ القمر فوق المكان أو تحته (الكبرى)، وعند شروقه وغروبه (الصغرى). وتكون أقوى إذا وافقت الفجر أو الغروب أو حركة المدّ.</div></div>`;
    }
    paintChart(d0, d1, ev);
    document.querySelectorAll("#tpBars [data-tpday]").forEach(b => b.classList.toggle("on", +b.dataset.tpday === d0));
    if (scroll) { const b = document.querySelector(`#tpBars [data-tpday="${d0}"]`); b && b.scrollIntoView({block: "nearest", inline: "center", behavior: RM ? "auto" : "smooth"}); }
  }

  function paintChart(d0, d1, ev) {
    const W = 340, Hh = 170, pl = 8, pr = 8, pt = 26, pb = 22, now = Date.now();
    const pts = []; for (let t = d0; t <= d1; t += 10 * 6e4) pts.push([t, HTIDE.level(t, ST.off)]);
    const lo = Math.min(...pts.map(p => p[1])) - 0.1, hi = Math.max(...pts.map(p => p[1])) + 0.1;
    const X = t => pl + (t - d0) / DAY * (W - pl - pr), Y = v => pt + (1 - (v - lo) / (hi - lo)) * (Hh - pt - pb);
    const line = pts.map((p, i) => (i ? "L" : "M") + X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1)).join(" ");
    const st = typeof sunTimes === "function" ? sunTimes(new Date(d0 + 12 * H), LAT, LNG) : null;
    const night = st ? `<rect x="${X(d0)}" y="${pt - 18}" width="${X(+st.sunrise) - X(d0)}" height="${Hh - pt - pb + 18}" fill="rgba(0,0,0,.35)"/><rect x="${X(+st.sunset)}" y="${pt - 18}" width="${X(d1) - X(+st.sunset)}" height="${Hh - pt - pb + 18}" fill="rgba(0,0,0,.35)"/>
      <line x1="${X(+st.sunrise)}" x2="${X(+st.sunrise)}" y1="${pt - 18}" y2="${Hh - pb}" stroke="#ffb347" stroke-dasharray="3 3" opacity=".7"/><line x1="${X(+st.sunset)}" x2="${X(+st.sunset)}" y1="${pt - 18}" y2="${Hh - pb}" stroke="#ffb347" stroke-dasharray="3 3" opacity=".7"/>
      <text x="${X(+st.sunrise)}" y="${pt - 6}" font-size="9" fill="#ffb347" text-anchor="middle">☀️ ${fmt(st.sunrise)}</text><text x="${X(+st.sunset)}" y="${pt - 6}" font-size="9" fill="#ffb347" text-anchor="middle">🌇 ${fmt(st.sunset)}</text>` : "";
    const flood = ev.filter(e => e.type === "low").map(e => { const a = Math.max(X(+e.t), pl), b = Math.min(X(+e.t + 2 * H), W - pr); return b > a ? `<rect x="${a}" y="${pt - 18}" width="${b - a}" height="${Hh - pt - pb + 18}" fill="rgba(46,204,113,.18)"/>` : ""; }).join("");
    const marks = ev.filter(e => e.t >= d0 && e.t < d1).map(e => `<circle cx="${X(+e.t)}" cy="${Y(e.h)}" r="4.5" fill="${e.type === "high" ? "#4da3ff" : "#ffb347"}" stroke="#0b1f33" stroke-width="1.5"/><text x="${X(+e.t)}" y="${e.type === "high" ? Y(e.h) - 8 : Y(e.h) + 15}" fill="#e8f1f8" font-size="10" font-weight="700" text-anchor="middle">${fmt(e.t)}</text>`).join("");
    const sol = window.Solunar ? Solunar.periods(d0).map(p => { const a = Math.max(X(+p.start), pl), b = Math.min(X(+p.end), W - pr); return b > a ? `<rect x="${a}" y="${Hh - pb - 7}" width="${b - a}" height="7" rx="3" fill="${p.major ? "#9b6bff" : "rgba(155,107,255,.45)"}"/>` : ""; }).join("") : "";
    let ticks = ""; for (let h = 0; h <= 24; h += 4) ticks += `<text x="${X(d0 + h * H)}" y="${Hh - 6}" fill="#8fa8bf" font-size="9" text-anchor="${h === 0 ? "start" : h === 24 ? "end" : "middle"}">${h}:00</text>`;
    const nowL = now >= d0 && now < d1 ? `<line x1="${X(now)}" x2="${X(now)}" y1="${pt - 18}" y2="${Hh - pb}" stroke="#ff5d73" stroke-width="1.5"/><circle class="tp-pulse" cx="${X(now)}" cy="${Y(HTIDE.level(now, ST.off))}" r="5" fill="#ff5d73"/>` : "";
    const el = document.getElementById("tpChart");
    el.innerHTML = `<svg viewBox="0 0 ${W} ${Hh}" class="tp-svg" direction="ltr"><defs><linearGradient id="tpa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2ec4b6" stop-opacity=".75"/><stop offset="1" stop-color="#1b4f8a" stop-opacity=".15"/></linearGradient></defs>
      ${night}${flood}<path class="tp-area" d="${line} L${X(d1)} ${Hh - pb} L${X(d0)} ${Hh - pb} Z" fill="url(#tpa)"/><path class="tp-line" d="${line}" fill="none" stroke="#2ec4b6" stroke-width="2.5"/>${marks}${sol}${nowL}${ticks}
      <g id="tpCross" style="display:none"><line id="tpCx" y1="${pt - 18}" y2="${Hh - pb}" stroke="#fff" stroke-dasharray="2 2"/><circle id="tpCd" r="5" fill="#fff"/></g></svg>`;
    // interactive scrubbing
    const svg = el.querySelector("svg"), tip = document.getElementById("tpTip"), cross = svg.querySelector("#tpCross");
    const move = ev2 => {
      const r = svg.getBoundingClientRect(), x = (ev2.touches ? ev2.touches[0].clientX : ev2.clientX) - r.left, sx = x / r.width * W;
      const t = d0 + clamp01((sx - pl) / (W - pl - pr)) * DAY, v = HTIDE.level(t, ST.off), v2 = HTIDE.level(t + 15 * 6e4, ST.off);
      cross.style.display = ""; svg.querySelector("#tpCx").setAttribute("x1", X(t)); svg.querySelector("#tpCx").setAttribute("x2", X(t));
      svg.querySelector("#tpCd").setAttribute("cx", X(t)); svg.querySelector("#tpCd").setAttribute("cy", Y(v));
      tip.style.display = "block"; tip.style.left = clamp(X(t) / W * r.width - 60, 0, r.width - 120) + "px";
      tip.innerHTML = `<b>${fmt(t)}</b> · ${v >= 0 ? "+" : ""}${v.toFixed(2)} م · ${v2 > v ? "▲ يرتفع" : "▼ ينخفض"}`;
    };
    const end = () => { cross.style.display = "none"; tip.style.display = "none"; };
    svg.addEventListener("pointermove", move); svg.addEventListener("pointerdown", move); svg.addEventListener("pointerleave", end); svg.addEventListener("pointerup", () => setTimeout(end, 1500));
    svg.addEventListener("touchmove", e => { move(e); e.preventDefault(); }, {passive: false});
  }
  const clamp01 = v => Math.max(0, Math.min(1, v)), clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- 30-day coefficient bars (also the date picker) ---------- */
  function paintBars() {
    const t0 = +dayStart(Date.now()), out = [];
    for (let i = 0; i < 30; i++) {
      const d = t0 + i * DAY, c = coefOf(d, ST.off), [, col] = coefLabel(c);
      const dt = new Date(d);
      out.push(`<button class="tp-bar" data-tpday="${d}" title="${c}"><span class="tp-moon">${moonIcon(d)}</span><i style="height:${Math.max(8, (c - 10) * 0.62)}px;background:${col}"></i><b>${c}</b><small>${i === 0 ? "اليوم" : dt.toLocaleDateString("ar-BH-u-nu-latn", {weekday: "short"})}</small><small>${dt.getDate()}</small></button>`);
    }
    document.getElementById("tpBars").innerHTML = out.join("");
  }

  window.TidePro = {render, coefOf, available: (lat, lng) => !!(window.HTIDE && HTIDE.available(lat, lng))};
})();
