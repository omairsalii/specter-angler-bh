/* Specter Angler BH — live sea scene, lure-action animations, small UI motion */
"use strict";
(function () {
  const RM = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const TAU = Math.PI * 2;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const mix = (c1, c2, t) => `rgb(${c1.map((v, i) => Math.round(lerp(v, c2[i], t))).join(",")})`;

  function fitCanvas(cv, h) {
    const w = cv.parentNode.clientWidth || 340;
    cv.style.width = w + "px"; cv.style.height = h + "px";
    cv.width = Math.round(w * DPR); cv.height = Math.round(h * DPR);
    const ctx = cv.getContext("2d"); ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    return {ctx, w, h};
  }
  function loop(el, draw) {           // run only while visible on screen and page shown
    let vis = false, raf = 0, t0 = performance.now();
    const tick = now => { draw((now - t0) / 1000); if (vis && !document.hidden && !RM) raf = requestAnimationFrame(tick); };
    const start = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
    new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis) start(); }, {threshold: 0.05}).observe(el);
    document.addEventListener("visibilitychange", () => { if (!document.hidden && vis) start(); });
    draw(0);
    return {kick: start};
  }

  /* ============================ LIVE SEA SCENE ============================ */
  const S = {wave: 0.4, wind: 12, cloud: 20, level: 0, rate: 0, score: 50, sunPos: 0.5, phase: "day", moon: 0.5, label: ""};
  let scene = null;

  function skyColors(ph) {
    return {
      night: [[6, 12, 28], [16, 32, 58], [10, 30, 52]],
      dawn:  [[40, 50, 100], [245, 150, 90], [40, 80, 110]],
      dusk:  [[50, 40, 90], [250, 120, 70], [45, 70, 105]],
      day:   [[60, 140, 210], [170, 215, 240], [24, 110, 150]]
    }[ph];
  }

  function makeScene() {
    const card = document.getElementById("nowCard"); if (!card || document.getElementById("seaScene")) return;
    const wrap = document.createElement("div");
    wrap.id = "seaWrap";
    wrap.innerHTML = `<canvas id="seaScene" aria-label="مشهد حيّ لحالة البحر الآن"></canvas><div id="seaLabel"></div>`;
    card.insertBefore(wrap, card.firstChild);
    const cv = wrap.querySelector("canvas");
    let G = fitCanvas(cv, 168);
    window.addEventListener("resize", () => { G = fitCanvas(cv, 168); scene && scene.kick(); });

    const stars = Array.from({length: 40}, () => [Math.random(), Math.random() * 0.4, Math.random() * TAU]);
    const clouds = Array.from({length: 5}, (_, i) => [Math.random(), 0.06 + Math.random() * 0.2, 0.6 + Math.random() * 0.8, i]);
    const parts = Array.from({length: 28}, () => [Math.random(), Math.random(), Math.random()]);
    let jump = null, nextJump = 3;

    const draw = t => {
      const {ctx, w, h} = G;
      const hz = h * 0.40;                                  // horizon
      const [top, low, sea] = skyColors(S.phase);
      // sky
      let g = ctx.createLinearGradient(0, 0, 0, hz);
      g.addColorStop(0, mix(top, top, 0)); g.addColorStop(1, mix(low, low, 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, hz + 2);
      // stars
      if (S.phase === "night") stars.forEach(s => { ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.3 + s[2])); ctx.fillStyle = "#fff"; ctx.fillRect(s[0] * w, s[1] * hz, 1.4, 1.4); });
      ctx.globalAlpha = 1;
      // sun or moon on an arc
      const bx = w * (0.9 - 0.8 * S.sunPos), by = hz - Math.sin(Math.PI * clamp(S.sunPos, 0, 1)) * hz * 0.75 + 8;
      if (S.phase === "night") {
        ctx.fillStyle = "#f4f1e0"; ctx.beginPath(); ctx.arc(bx, by, 11, 0, TAU); ctx.fill();
        const f = (1 - Math.cos(TAU * S.moon)) / 2;          // lit fraction; shadow slides off as the moon fills
        ctx.fillStyle = mix(top, low, 0.25); ctx.beginPath(); ctx.arc(bx + (S.moon < 0.5 ? -1 : 1) * 23 * f, by - 1, 11.5, 0, TAU); ctx.fill();
      } else {
        const sg = ctx.createRadialGradient(bx, by, 2, bx, by, 34);
        sg.addColorStop(0, S.phase === "day" ? "rgba(255,250,220,1)" : "rgba(255,210,140,1)"); sg.addColorStop(0.35, S.phase === "day" ? "rgba(255,240,180,.7)" : "rgba(255,170,90,.6)"); sg.addColorStop(1, "rgba(255,200,120,0)");
        ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(bx, by, 34, 0, TAU); ctx.fill();
      }
      // clouds drift with wind
      const nC = Math.round(clamp(S.cloud / 20, 0, 5));
      clouds.slice(0, nC).forEach(c => {
        const x = ((c[0] * w + t * (4 + S.wind * 0.6) * c[2]) % (w + 120)) - 60, y = c[1] * hz + 6;
        ctx.fillStyle = S.phase === "night" ? "rgba(120,130,160,.35)" : "rgba(255,255,255,.75)";
        [[0, 0, 16], [16, -6, 14], [30, 0, 15], [14, 5, 13]].forEach(p => { ctx.beginPath(); ctx.ellipse(x + p[0] * c[2], y + p[1] * c[2], p[2] * c[2], p[2] * c[2] * 0.6, 0, 0, TAU); ctx.fill(); });
      });

      // sea: layered perspective rows (far → near)
      const amp0 = clamp(S.wave, 0.05, 2) * 9, speed = 0.8 + S.wind / 18, lvl = S.level * 9;
      const N = 15, rows = [];
      for (let i = 0; i <= N; i++) {
        const p = Math.pow(i / N, 1.55);
        rows.push({p, y: hz + p * (h - hz) - lvl * p, a: amp0 * (0.12 + 0.88 * p), k: 0.012 / (0.25 + p)});
      }
      ctx.fillStyle = mix(sea, sea, 0); ctx.fillRect(0, hz, w, h - hz);
      for (let i = 0; i <= N; i++) {
        const r = rows[i];
        ctx.beginPath(); ctx.moveTo(0, h);
        for (let x = 0; x <= w + 6; x += 6) {
          const y = r.y + r.a * Math.sin(x * r.k * 6 - t * speed * 1.4 + i * 0.9) * 0.6 + r.a * 0.4 * Math.sin(x * r.k * 13 + t * speed * 0.9 + i);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h); ctx.closePath();
        const shade = 0.25 + 0.75 * r.p;
        ctx.fillStyle = mix(sea.map(v => v * 0.55), sea.map(v => Math.min(255, v * 1.25 + 20)), shade * 0.85);
        ctx.fill();
        // crest highlight + whitecaps
        ctx.strokeStyle = `rgba(255,255,255,${0.05 + 0.25 * r.p * (S.phase === "night" ? 0.5 : 1)})`; ctx.lineWidth = 1; ctx.stroke();
        if (S.wind > 20 && i > 4) for (let x = (i * 37 + t * 20) % 60; x < w; x += 90) { ctx.fillStyle = `rgba(255,255,255,${0.35 * r.p})`; ctx.fillRect(x, r.y - r.a * 0.6, 8 * r.p + 2, 1.5); }
      }
      // sun / moon glitter path
      ctx.globalAlpha = S.phase === "day" ? 0.25 : 0.4;
      for (let i = 2; i <= N; i++) { const r = rows[i]; const jw = 6 + 24 * r.p; ctx.fillStyle = S.phase === "night" ? "#e8e8d0" : "#fff3c4"; ctx.fillRect(bx - jw / 2 + Math.sin(t * 3 + i) * 4, r.y + Math.sin(t * 2 + i) * 1.5, jw * (0.4 + 0.6 * Math.abs(Math.sin(t * 2.3 + i))), 1.6); }
      ctx.globalAlpha = 1;
      // tide current particles (rising → toward the shore on the left, falling → out to sea)
      const dir = S.rate > 0.005 ? -1 : S.rate < -0.005 ? 1 : 0, cs = 8 + Math.abs(S.rate) * 220;
      parts.forEach(q => {
        const r = rows[Math.floor(4 + q[1] * (N - 4))];
        q[0] += dir * cs * 0.0002 * (0.5 + q[2]); if (q[0] < -0.05) q[0] = 1.05; if (q[0] > 1.05) q[0] = -0.05;
        ctx.fillStyle = `rgba(200,240,255,${dir ? 0.45 * r.p : 0.15 * r.p})`; ctx.fillRect(q[0] * w, r.y + 3 + q[2] * 4, 3 + 5 * r.p, 1.2);
      });
      // fish jump when the score is good
      if (S.score >= 60 && !RM) {
        if (!jump && t > nextJump) jump = {t, x: w * (0.25 + Math.random() * 0.5), r: rows[Math.floor(N * 0.55)]};
        if (jump) {
          const u = (t - jump.t) / 1.1;
          if (u > 1.6) { jump = null; nextJump = t + 4 + Math.random() * 6; }
          else {
            if (u <= 1) {
              const fx = jump.x + u * 46, fy = jump.r.y - Math.sin(Math.PI * u) * 34, ang = Math.cos(Math.PI * u) * -0.9;
              ctx.save(); ctx.translate(fx, fy); ctx.rotate(ang);
              ctx.fillStyle = "#c9d6df"; ctx.beginPath(); ctx.ellipse(0, 0, 11, 4.2, 0, 0, TAU); ctx.fill();
              ctx.fillStyle = "#7f97a8"; ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(-17, -5); ctx.lineTo(-17, 5); ctx.fill();
              ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(7, -1, 1.1, 0, TAU); ctx.fill(); ctx.restore();
            }
            [[0, jump.x], [1, jump.x + 46]].forEach(([k, sx]) => {
              const v = u - k; if (v < 0 || v > 0.6) return;
              ctx.strokeStyle = `rgba(255,255,255,${0.8 * (1 - v / 0.6)})`; ctx.lineWidth = 1.3;
              ctx.beginPath(); ctx.ellipse(sx, jump.r.y, 4 + v * 30, 1.5 + v * 6, 0, 0, TAU); ctx.stroke();
            });
          }
        }
      }
      // breakwater rocks in the foreground (the water level visibly rises / falls on them)
      const rx = w * 0.70;
      ctx.fillStyle = "#2c3a44";
      ctx.beginPath(); ctx.moveTo(rx, h); ctx.lineTo(rx + 8, h - 40); ctx.lineTo(rx + 30, h - 58); ctx.lineTo(rx + 55, h - 50); ctx.lineTo(rx + 80, h - 66); ctx.lineTo(rx + 110, h - 54); ctx.lineTo(w + 5, h - 62); ctx.lineTo(w + 5, h); ctx.fill();
      ctx.fillStyle = "#3d4f5b";
      [[18, 44, 14], [48, 52, 16], [78, 58, 15], [105, 50, 14], [135, 56, 16]].forEach(([dx, dy, rr]) => { ctx.beginPath(); ctx.ellipse(rx + dx, h - dy, rr, rr * 0.7, 0.3, 0, TAU); ctx.fill(); });
      // water line wash over the rocks
      const wl = rows[N - 2].y + Math.sin(t * speed) * amp0 * 0.5;
      ctx.fillStyle = mix(sea.map(v => v * 0.9), sea.map(v => v * 1.2), 0.5); ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.moveTo(rx - 4, h); for (let x = rx - 4; x <= w + 6; x += 6) ctx.lineTo(x, wl + Math.sin(x * 0.07 - t * speed * 2) * 2.2); ctx.lineTo(w + 6, h); ctx.fill();
      ctx.globalAlpha = 1; ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 1.4;
      ctx.beginPath(); for (let x = rx - 4; x <= w + 6; x += 6) ctx.lineTo(x, wl + Math.sin(x * 0.07 - t * speed * 2) * 2.2); ctx.stroke();
      // angler silhouette with rod on the rocks
      const ax = rx + 62, ay = h - 70;
      ctx.fillStyle = "#0b1622"; ctx.strokeStyle = "#0b1622"; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(ax, ay - 20, 4, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(ax, ay - 16); ctx.lineTo(ax + 1, ay - 2); ctx.moveTo(ax + 1, ay - 2); ctx.lineTo(ax - 3, ay + 8); ctx.moveTo(ax + 1, ay - 2); ctx.lineTo(ax + 5, ay + 8); ctx.moveTo(ax, ay - 12); ctx.lineTo(ax - 8, ay - 8); ctx.stroke();
      const bend = Math.sin(t * 1.4) * 2;
      ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(ax - 8, ay - 8); ctx.quadraticCurveTo(ax - 28, ay - 34 + bend, ax - 44, ay - 44 + bend); ctx.stroke();
      ctx.strokeStyle = "rgba(220,240,255,.45)"; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(ax - 44, ay - 44 + bend); ctx.quadraticCurveTo(ax - 100, ay - 20, ax - 150, rows[N - 5].y); ctx.stroke();
    };
    scene = loop(cv, draw);
  }

  // called by the app after conditions are scored
  window.updateSea = function (rows, cur, lat, lng) {
    try {
      if (!cur) return; makeScene();
      const r = cur.row || cur, now = Date.now();
      S.wave = r.wave ?? 0.4; S.wind = r.wind ?? 12; S.cloud = r.cloud ?? 10; S.score = cur.score ?? 50;
      const lv = (rows || []).filter(x => x.sl != null && Math.abs(x.t - now) < 13 * 36e5).map(x => x.sl);
      if (lv.length > 3) {
        const lo = Math.min(...lv), hi = Math.max(...lv), slNow = (window.HTIDE && r.tideSrc === "harm") ? HTIDE.level(now, r.tideOff || 0) : r.sl;
        S.level = hi > lo ? ((slNow - lo) / (hi - lo)) * 2 - 1 : 0;
        const s2 = (window.HTIDE && r.tideSrc === "harm") ? HTIDE.level(now + 36e5, r.tideOff || 0) : null;
        S.rate = s2 != null ? s2 - slNow : 0;
      }
      if (typeof sunTimes === "function") {
        const noon = new Date(); noon.setHours(12, 0, 0, 0);
        const st = sunTimes(noon, lat || 26.1, lng || 50.55), sr = +st.sunrise, ss = +st.sunset;
        S.phase = Math.abs(now - sr) < 50 * 6e4 ? "dawn" : Math.abs(now - ss) < 50 * 6e4 ? "dusk" : (now > sr && now < ss) ? "day" : "night";
        if (S.phase === "night") { const nl = now > ss ? now - ss : now + 864e5 - ss, len = 864e5 - (ss - sr); S.sunPos = clamp(nl / len, 0, 1); }
        else S.sunPos = clamp((now - sr) / (ss - sr), 0, 1);
      }
      if (typeof moonPhase === "function") S.moon = moonPhase(new Date());
      const lab = document.getElementById("seaLabel");
      if (lab) {
        const tide = S.rate > 0.005 ? "⬆️ الماء يرتفع" : S.rate < -0.005 ? "⬇️ الماء ينخفض" : (r.tideState || "");
        lab.innerHTML = [tide, r.wave != null ? `🌊 موج ${r.wave.toFixed(1)} م` : "", r.wind != null ? `💨 ريح ${Math.round(r.wind)} كم/س` : ""].filter(Boolean).map(x => `<span>${x}</span>`).join("");
      }
      scene && scene.kick();
    } catch (e) { console.warn(e); }
  };

  /* ============================ LURE ACTION ============================ */
  const imgCache = {};
  function lureImg(key) {
    if (imgCache[key]) return imgCache[key];
    let svg = (typeof uniq === "function" ? uniq(LURE_SVG[key]) : LURE_SVG[key]).replace(/<text[\s\S]*?<\/text>/g, "");
    if (!/xmlns=/.test(svg)) svg = svg.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
    const im = new Image(); im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    return (imgCache[key] = im);
  }
  const TIPS = {
    popper: "اسحب بنترات قصيرة قوية من طرف القصبة ثم توقّف ثانية: كل نترة تصنع فقاعات وصوتاً على السطح.",
    stickbait: "نترات منتظمة وطرف القصبة إلى الأسفل، مع لمّ الخيط الرخو: يتمايل يميناً ويساراً (Walk the dog).",
    float_minnow: "لفّ بطيء ثابت فيغوص قليلاً ويرتعش، وإذا توقّفت يطفو للأعلى: التوقّف يغري المفترس.",
    sink_minnow: "اتركه يغوص للعمق الذي تريده (عُدّ ثوانيَ)، ثم لفّ بثبات أو بنترات خفيفة.",
    jig: "ارفع القصبة بقوة ثم اخفضها مع لمّ الخيط: الضربة غالباً أثناء نزوله المتراقص.",
    paddle: "لفّ ثابت قرب القاع أو في منتصف الماء: الذيل يرتجف وحده كسمكة تسبح.",
    weedless: "قفزات قصيرة على القاع بين الصخر والأعشاب: ارفع ثم اتركه يسقط.",
    spoon: "لفّ متوسط ثابت: يتأرجح ويعكس الضوء كوميض سمكة صغيرة."
  };
  function lurePattern(key, t, w, h) {
    const surf = 30, bot = h - 14, cyc = 5, u = (t % cyc) / cyc, x = lerp(w - 40, 40, u);
    switch (key) {
      case "popper": { const ph = (t % 0.9) / 0.9, jerk = ph < 0.15; return {x: x - (jerk ? 6 : 0), y: surf - 2, rot: jerk ? -0.25 : -0.05, splash: jerk}; }
      case "stickbait": return {x, y: surf - 1, rot: Math.sin(t * 7.5) * 0.5, wake: true};
      case "float_minnow": { const pause = (t % 2.4) > 1.9; const d = pause ? lerp(52, surf, ((t % 2.4) - 1.9) / 0.5) : Math.min(52, surf + (t % 2.4) * 40); return {x, y: d, rot: (pause ? -0.15 : 0.18) + Math.sin(t * 22) * 0.07}; }
      case "sink_minnow": { const d = u < 0.25 ? lerp(surf, h * 0.66, u / 0.25) : h * 0.66 + Math.sin(t * 2) * 3; return {x: u < 0.25 ? w - 40 : lerp(w - 40, 40, (u - 0.25) / 0.75), y: d, rot: u < 0.25 ? 0.6 : Math.sin(t * 20) * 0.08}; }
      case "jig": { const ph = (t % 1.6) / 1.6, up = ph < 0.25; const y = up ? lerp(bot - 4, h * 0.42, ph / 0.25) : lerp(h * 0.42, bot - 4, (ph - 0.25) / 0.75); return {x: lerp(w - 40, 40, u), y, rot: up ? -1.1 : Math.sin(t * 14) * 0.6, flash: !up}; }
      case "paddle": return {x, y: h * 0.66 + Math.sin(t * 3) * 4, rot: Math.sin(t * 16) * 0.06, tail: true};
      case "weedless": { const ph = (t % 1.3) / 1.3, hop = Math.sin(Math.PI * Math.min(ph / 0.7, 1)); return {x, y: bot - 6 - hop * 26, rot: ph < 0.35 ? -0.4 : 0.25, puff: ph > 0.68 && ph < 0.8}; }
      case "spoon": return {x, y: h * 0.55 + Math.sin(t * 2) * 6, rot: Math.sin(t * 10) * 0.7, flash: true};
    }
    return {x, y: h / 2, rot: 0};
  }
  function mountLureMotion(box, key) {
    box.innerHTML = `<canvas></canvas><div class="mute" style="font-size:12px;margin-top:4px">🎣 ${TIPS[key] || ""}</div>`;
    const cv = box.querySelector("canvas"); let G = fitCanvas(cv, 130); const im = lureImg(key);
    const bubbles = [];
    loop(cv, t => {
      const {ctx, w, h} = G;
      let g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#1c6f96"); g.addColorStop(1, "#0a2a40");
      ctx.fillStyle = "#0e2236"; ctx.fillRect(0, 0, w, 30); ctx.fillStyle = g; ctx.fillRect(0, 30, w, h - 30);
      // surface
      ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1.5; ctx.beginPath();
      for (let x = 0; x <= w; x += 5) ctx.lineTo(x, 30 + Math.sin(x * 0.05 + t * 2.4) * 1.8); ctx.stroke();
      // light rays
      ctx.fillStyle = "rgba(255,255,255,.04)"; for (let i = 0; i < 4; i++) { const x0 = (i * 110 + t * 8) % (w + 80) - 40; ctx.beginPath(); ctx.moveTo(x0, 30); ctx.lineTo(x0 + 30, 30); ctx.lineTo(x0 + 70, h); ctx.lineTo(x0 + 20, h); ctx.fill(); }
      // sand bottom
      ctx.fillStyle = "#3b4a46"; ctx.beginPath(); ctx.moveTo(0, h); for (let x = 0; x <= w; x += 10) ctx.lineTo(x, h - 10 + Math.sin(x * 0.08) * 3); ctx.lineTo(w, h); ctx.fill();
      const P = lurePattern(key, t, w, h);
      // line from the angler (off-screen left, above)
      const tx = P.x - 40 * Math.cos(P.rot), ty = P.y - 40 * Math.sin(P.rot);   // line tie at the lure's nose
      ctx.strokeStyle = "rgba(220,240,255,.55)"; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(0, 8); ctx.quadraticCurveTo(tx * 0.5, 30, tx, ty); ctx.stroke();
      if (P.splash && Math.random() < 0.6) for (let i = 0; i < 3; i++) bubbles.push([P.x - 42, 30, (Math.random() - 0.5) * 2, -1 - Math.random() * 2, 1]);
      if (P.puff) for (let i = 0; i < 2; i++) bubbles.push([P.x, h - 12, (Math.random() - 0.5) * 2, -0.6 - Math.random(), 1, 1]);
      if (Math.random() < 0.08) bubbles.push([P.x - 30, P.y, (Math.random() - 0.5) * 0.4, -0.5, 1]);
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i]; b[0] += b[2]; b[1] += b[3]; b[3] += b[5] ? 0.02 : 0.08; b[4] -= 0.03;
        if (b[4] <= 0) { bubbles.splice(i, 1); continue; }
        ctx.fillStyle = b[5] ? `rgba(180,170,140,${b[4] * 0.6})` : `rgba(255,255,255,${b[4] * 0.8})`; ctx.beginPath(); ctx.arc(b[0], b[1], b[5] ? 3 : 1.6, 0, TAU); ctx.fill();
      }
      if (P.wake) { ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.moveTo(P.x + 40, 30); ctx.lineTo(P.x + 90, 27); ctx.moveTo(P.x + 40, 31); ctx.lineTo(P.x + 90, 34); ctx.stroke(); }
      ctx.save(); ctx.translate(P.x, P.y); ctx.rotate(P.rot);
      if (im.complete && im.naturalWidth) ctx.drawImage(im, -45, -20, 90, 40.5);
      if (P.flash && Math.sin(t * 10) > 0.6) { ctx.fillStyle = "rgba(255,255,230,.55)"; ctx.beginPath(); ctx.ellipse(0, -2, 22, 6, 0, 0, TAU); ctx.fill(); }
      ctx.restore();
    });
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-lmotion]"); if (!b) return;
    e.preventDefault();
    const card = b.closest(".lure"); let box = card.nextElementSibling;
    if (box && box.classList.contains("lmotion")) { box.remove(); b.textContent = "🎬 شاهد حركته في الماء"; return; }
    box = document.createElement("div"); box.className = "lmotion"; card.after(box);
    mountLureMotion(box, b.dataset.lmotion); b.textContent = "✖ أخفِ الحركة";
  });

  /* ============================ SMALL UI MOTION ============================ */
  window.countUp = function (el, to, color) {
    if (!el) return; el.style.color = color || "";
    const from = parseInt(el.textContent) || 0; if (RM || isNaN(to)) { el.textContent = to; return; }
    const t0 = performance.now(), d = 900;
    const step = now => { const k = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); else { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); } };
    requestAnimationFrame(step);
  };
})();
