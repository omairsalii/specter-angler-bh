/* Specter Angler BH — continuous, pseudo-3D knot-tying animations (rope rendered as a tube with real over/under crossings) */
"use strict";
(function () {
  const VW = 360, VH = 200, AY = 100;               // virtual canvas, main axis
  const COL = {main: "#2ec4b6", leader: "#e8f1f8", metal: "#9aa8b4"};
  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, n >> 8 & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(v * k)))); return `rgb(${c.join(",")})`; };

  /* ---------- path helpers (all produce dense [x,y,z] points) ---------- */
  function spline(wp, sub = 10) {                     // Catmull-Rom through waypoints
    const out = [];
    for (let i = 0; i < wp.length - 1; i++) {
      const p0 = wp[i - 1] || wp[i], p1 = wp[i], p2 = wp[i + 1], p3 = wp[i + 2] || p2;
      for (let s = 0; s < sub; s++) {
        const t = s / sub, t2 = t * t, t3 = t2 * t;
        out.push([0, 1, 2].map(k => 0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
      }
    }
    out.push(wp[wp.length - 1].slice());
    return out;
  }
  function helix(x0, x1, yc, r, turns, ph = 0, hand = 1, n = 22) {   // wraps around a horizontal axis
    const out = [], N = Math.max(8, Math.round(turns * n));
    for (let i = 0; i <= N; i++) { const t = i / N, a = ph + hand * t * turns * 2 * Math.PI; out.push([x0 + (x1 - x0) * t, yc - r * Math.cos(a), r * Math.sin(a)]); }
    return out;
  }
  const line = (a, b, n = 12) => Array.from({length: n + 1}, (_, i) => a.map((v, k) => v + (b[k] - v) * i / n));
  const join = (...parts) => parts.reduce((acc, p) => acc.concat(acc.length ? p.slice(1) : p), []);
  function ring(cx, cy, R) {                          // hook eye standing in the y–z plane, slightly turned
    const pts = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * 2 * Math.PI; pts.push([cx + 0.45 * R * Math.sin(a), cy - R * Math.cos(a), R * Math.sin(a)]); }
    return pts;
  }
  function hookShank(ex) {                            // shank + bend to the right of the eye (drawn behind)
    return spline([[ex + 6, AY, -2], [ex + 50, AY, -2], [ex + 62, AY + 6, -2], [ex + 62, AY + 26, -2], [ex + 48, AY + 34, -2], [ex + 38, AY + 26, -2], [ex + 40, AY + 20, -2]], 8);
  }
  const lengths = pts => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2])); return L; };

  /* ---------- knot definitions ---------- */
  const EX = 280, ER = 10;
  const K = {};

  K.clinch = (() => {
    const L = join(
      line([-10, AY, 0], [EX - 120, AY, 0], 20),
      line([EX - 120, AY, 0], [EX, AY, 0], 20),                       // standing part to the eye
      spline([[EX, AY, 0], [EX + 14, AY + 2, 0], [EX + 18, AY + 10, 0], [EX + 8, AY + 14, 0], [EX - 14, AY + 12, 2]], 8),   // through the eye and back
      helix(EX - 16, EX - 86, AY + 3, 9, 5.5, Math.PI, 1),            // 5½ wraps around the standing part
      spline([[EX - 86, AY + 3 + 9 * Math.cos(Math.PI * 12), 0], [EX - 70, AY - 20, 6], [EX - 30, AY - 22, 6], [EX - 10, AY - 10, 4], [EX - 9, AY + 4, -6], [EX - 18, AY + 22, -2]], 8),  // back through the first small loop
      spline([[EX - 18, AY + 22, -2], [EX - 40, AY + 30, 6], [EX - 60, AY + 20, 6], [EX - 50, AY + 8, 6], [EX - 70, AY + 40, 2], [EX - 80, AY + 58, 0]], 8)   // improved: through the big loop, tail out
    );
    const ln = lengths(L), tot = ln[ln.length - 1], at = x => ln[L.findIndex(p => p[0] >= x)] / tot;
    const fEye = ln[40] / tot, fBack = ln[40 + 8 * 4] / tot;
    return {
      view: [150, 350], cy: AY + 14,
      ropes: [{pts: L, color: COL.main, w: 5, start: fEye * 0.92}],
      metal: [{pts: ring(EX, AY, ER), color: COL.metal, w: 4}, {pts: hookShank(EX), color: COL.metal, w: 4.5}],
      steps: [
        {to: fBack, d: 2.2, cap: "أدخل طرف الخيط في عين الكلّاب واسحب نحو 15 سم."},
        {to: 0.66, d: 4.5, cap: "لُفّ الطرف حول الخيط الرئيسي 5 إلى 7 لفّات، مبتعداً عن العين."},
        {to: 0.82, d: 2.2, cap: "أعِد الطرف وأدخله في الحلقة الصغيرة الملاصقة للعين."},
        {to: 1, d: 2.2, cap: "ثم أدخله في الحلقة الكبيرة التي تكوّنت للتو (هذه هي «المحسّنة»)."},
        {tight: true, d: 2.6, cap: "بلّل العقدة واسحب الخيط الرئيسي بثبات حتى تنضمّ اللفّات على العين، ثم قصّ الطرف."}
      ],
      tight: (p, k) => p[0] > EX - 100 && p[0] < EX - 4 ? [EX - 4 - (EX - 4 - p[0]) * (1 - 0.55 * k), AY + (p[1] - AY) * (1 - 0.7 * k), p[2] * (1 - 0.6 * k)] : p[0] <= EX - 100 && p[1] > AY + 20 ? [p[0] + 40 * k, AY + (p[1] - AY) * (1 - 0.4 * k), p[2]] : p
    };
  })();

  K.palomar = (() => {
    const tip = join(
      line([-10, AY, 0], [EX - 10, AY, 0], 30),
      spline([[EX - 10, AY, 0], [EX + 22, AY - 2, 0], [EX + 34, AY + 10, 2], [EX + 14, AY + 24, 4], [EX - 40, AY + 26, 4]], 10),   // doubled loop through the eye and back
      spline([[EX - 40, AY + 26, 4], [EX - 64, AY + 18, 4], [EX - 70, AY + 2, -8], [EX - 58, AY - 16, -6], [EX - 44, AY - 12, 8], [EX - 40, AY + 4, 8], [EX - 34, AY + 16, -6], [EX - 20, AY + 30, -4]], 10),   // overhand with the doubled line
      spline([[EX - 20, AY + 30, -4], [EX + 30, AY + 52, 4], [EX + 80, AY + 40, 8], [EX + 86, AY + 10, 8], [EX + 62, AY - 12, 6], [EX + 20, AY - 8, 4], [EX + 8, AY - 2, 2]], 10)   // pass the loop over the whole hook
    );
    const off = (pts, d) => pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; const dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1; return [p[0] - dy / m * d, p[1] + dx / m * d, p[2]]; });
    const ln = lengths(tip), tot = ln[ln.length - 1], f0 = ln[30] / tot;
    return {
      view: [170, 375], cy: AY + 18,
      ropes: [{pts: off(tip, 2.6), color: COL.main, w: 4, start: f0 * 0.9}, {pts: off(tip, -2.6), color: COL.main, w: 4, start: f0 * 0.9}],
      metal: [{pts: ring(EX, AY, ER), color: COL.metal, w: 4}, {pts: hookShank(EX), color: COL.metal, w: 4.5}],
      steps: [
        {to: 0.36, d: 2.6, cap: "اثنِ آخر 15 سم من الخيط ليصير مزدوجاً، وأدخل رأس الحلقة في عين الكلّاب."},
        {to: 0.68, d: 3.6, cap: "اعقد عقدة بسيطة بالخيط المزدوج، واترك الحلقة متدلّية."},
        {to: 1, d: 3.4, cap: "مرّر الكلّاب أو الطعم كاملاً من داخل الحلقة."},
        {tight: true, d: 2.6, cap: "بلّل العقدة واسحب الطرفين معاً حتى تنضمّ فوق العين، ثم قصّ الطرف."}
      ],
      tight: (p, k) => p[0] > EX - 80 ? [EX - 4 + (p[0] - (EX - 4)) * (1 - 0.75 * k), AY + (p[1] - AY) * (1 - 0.8 * k), p[2] * (1 - 0.7 * k)] : p
    };
  })();

  K.loop = (() => {
    const OX = 150;                                                    // overhand position
    const L = join(
      line([-10, AY, 0], [OX - 10, AY, 0], 16),
      spline([[OX - 10, AY, 0], [OX + 14, AY - 2, 4], [OX + 26, AY - 18, 4], [OX + 14, AY - 30, 0], [OX - 2, AY - 20, -6], [OX + 8, AY - 4, -6], [OX + 30, AY + 2, 4], [OX + 60, AY, 0]], 10),  // loose overhand
      line([OX + 60, AY, 0], [EX, AY, 0], 20),
      spline([[EX, AY, 0], [EX + 14, AY + 3, 0], [EX + 12, AY + 14, 0], [EX - 20, AY + 14, 0], [OX + 40, AY + 10, 0], [OX + 14, AY - 12, -6], [OX + 6, AY - 14, -2], [OX - 6, AY - 8, 6]], 10),  // through eye, back through the overhand
      helix(OX - 10, OX - 60, AY, 9, 4, -Math.PI / 2, 1),                // 4 wraps
      spline([[OX - 60, AY + 9 * Math.cos(-Math.PI / 2 + 8 * Math.PI) * -1, 0], [OX - 40, AY - 20, 6], [OX + 6, AY - 22, 6], [OX + 12, AY - 12, -6], [OX + 20, AY + 10, -4], [OX + 10, AY + 34, 0], [OX - 10, AY + 50, 0]], 10)   // back through the overhand, same side it came out
    );
    const ln = lengths(L), tot = ln[ln.length - 1];
    const iEye = L.findIndex((p, i) => i > 60 && p[0] >= EX - 0.5), fEye = ln[iEye] / tot;
    return {
      view: [70, 330], cy: AY + 8,
      ropes: [{pts: L, color: COL.main, w: 5, start: 0}],
      metal: [{pts: ring(EX, AY, ER), color: COL.metal, w: 4}, {pts: hookShank(EX), color: COL.metal, w: 4.5}],
      steps: [
        {to: 0.3, d: 2.6, cap: "اعقد عقدة بسيطة مفتوحة في الخيط على بعد 20 سم من طرفه."},
        {to: fEye + 0.02, d: 2.4, cap: "أدخل الطرف في عين الطعم."},
        {to: 0.68, d: 2.6, cap: "أعِده وأدخله في العقدة البسيطة من الجهة نفسها التي خرج منها الخيط."},
        {to: 0.84, d: 3.4, cap: "لُفّ الطرف حول الخيط الرئيسي 4 لفّات."},
        {to: 1, d: 2.2, cap: "أعِده إلى داخل العقدة البسيطة من الجهة التي خرج منها."},
        {tight: true, d: 2.8, cap: "بلّل واسحب الطرف قليلاً ثم الخيط الرئيسي بقوة، فتبقى حلقة حرّة عند العين."}
      ],
      tight: (p, k) => p[0] > OX - 70 && p[0] < OX + 40 ? [OX + (p[0] - OX) * (1 - 0.5 * k), AY + (p[1] - AY) * (1 - 0.65 * k), p[2] * (1 - 0.6 * k)] : p
    };
  })();

  K.dbluni = (() => {
    const yB = AY - 4, yL = AY + 4, C = 178;
    const braid = join(
      line([-10, yB, 0], [100, yB, 0], 16), line([100, yB, 0], [262, yB, 0], 24),
      spline([[262, yB, 0], [276, yB - 10, 0], [270, yB - 28, 0], [248, yB - 32, 0], [232, yB - 18, 0], [240, yB - 2, 4]], 8),   // loop back over both lines
      helix(240, 204, AY, 12, 4, 0, 1),                                  // 4 turns inside the loop, around both lines
      spline([[204, AY - 12, 0], [198, AY - 30, 0], [190, AY - 46, 0]], 6)
    );
    const leader = join(
      line([370, yL, 0], [260, yL, 0], 16), line([260, yL, 0], [94, yL, 0], 24),
      spline([[94, yL, 0], [80, yL + 10, 0], [86, yL + 28, 0], [108, yL + 32, 0], [124, yL + 18, 0], [116, yL + 2, -4]], 8),
      helix(116, 152, AY, 12, 4, Math.PI, -1),
      spline([[152, AY + 12, 0], [158, AY + 30, 0], [166, AY + 46, 0]], 6)
    );
    const lb = lengths(braid), ll = lengths(leader), fB = lb[40] / lb[lb.length - 1], fL = ll[40] / ll[ll.length - 1];
    const squeeze = (p, k, x0, x1, dx) => [x0 + (p[0] - x0) * (1 - 0.45 * k) + dx * k, AY + (p[1] - AY) * (1 - 0.7 * k), p[2] * (1 - 0.6 * k)];
    return {
      view: [60, 300], cy: AY,
      ropes: [{pts: braid, color: COL.main, w: 3.6, start: fB * 0.95}, {pts: leader, color: COL.leader, w: 5.5, start: fL * 0.95}],
      metal: [],
      steps: [
        {r: 0, to: 0.62, d: 2.4, cap: "ضع المضفّر والقائد متوازيين متداخلين 20 سم، واثنِ طرف المضفّر لتصنع حلقة فوق الخيطين."},
        {r: 0, to: 1, d: 3.6, cap: "لُفّ طرف المضفّر 6 إلى 8 لفّات حول الخيطين من داخل الحلقة، ثم شدّ الطرف."},
        {r: 1, to: 0.62, d: 2.2, cap: "كرّر بطرف القائد من الجهة الأخرى: حلقة فوق الخيطين…"},
        {r: 1, to: 1, d: 3.4, cap: "…ثم 4 لفّات حول الخيطين، وشدّ الطرف."},
        {tight: true, d: 2.8, cap: "بلّل واسحب الخيطين الرئيسيين في اتجاهين متعاكسين حتى تلتقي العقدتان، ثم قصّ الطرفين."}
      ],
      tight: (p, k, ri, i) => {
        const sh = 30 * k;                                              // each knot slides 30 units toward the other
        if (ri === 0) { if (i >= 40) return squeeze(p, k, 222, 0, -sh); return [Math.min(p[0], 222 + (262 - 222) * (1 - 0.45 * k) - sh), p[1] + (AY - p[1]) * 0.5 * k * (p[0] > 120 ? 1 : 0), p[2]]; }
        if (ri === 1) { if (i >= 40) return squeeze(p, k, 134, 0, sh); return [Math.max(p[0], 134 - (134 - 94) * (1 - 0.45 * k) + sh), p[1] + (AY - p[1]) * 0.5 * k * (p[0] < 240 ? 1 : 0), p[2]]; }
        return p;
      }
    };
  })();

  K.fg = (() => {
    const leader = line([370, AY, 0], [70, AY, 0], 40);
    const parts = [line([-10, AY - 30, 0], [70, AY - 12, 0], 14)];
    let x = 74; const r = 9, dx = 6.2;
    for (let i = 0; i < 18; i++) {                                     // alternate wraps: front strokes alternate \ and / → the FG "X" weave
      const front = i % 2 === 0;
      parts.push(spline([[x, AY - r, 0], [x + dx * 0.5, AY, front ? 7 : -7], [x + dx, AY + r, 0]], 6));
      parts.push(spline([[x + dx, AY + r, 0], [x + dx * 1.5, AY, front ? -7 : 7], [x + dx * 2, AY - r, 0]], 6));
      x += dx * 2 * 0.62;
    }
    const xe = x;
    for (let h = 0; h < 3; h++) parts.push(helix(xe + h * 9, xe + h * 9 + 8, AY, 8, 1, 0, 1, 18));   // half hitches
    parts.push(spline([[xe + 26, AY - 8, 0], [xe + 40, AY - 20, 0], [xe + 52, AY - 34, 0]], 6));
    const braid = join(...parts);
    const lb = lengths(braid), f0 = lb[14] / lb[lb.length - 1];
    return {
      view: [20, 330], cy: AY - 6,
      ropes: [{pts: leader, color: COL.leader, w: 6, start: 1}, {pts: braid, color: COL.main, w: 3, start: f0}],
      metal: [],
      steps: [
        {r: 1, to: 0.12, d: 1.8, cap: "شدّ المضفّر جيداً، وضع القائد فوقه بزاوية."},
        {r: 1, to: 0.82, d: 6.5, cap: "لُفّ المضفّر حول القائد بالتناوب: مرة من فوق ومرة من تحت، 20 مرة، فيتكوّن نسيج متقاطع."},
        {r: 1, to: 1, d: 2.4, cap: "ثبّت اللفّات بعقد نصفية حول القائد والمضفّر معاً."},
        {tight: true, d: 2.6, cap: "بلّل واسحب بقوة: ينقبض النسيج على القائد ويصير وصلة نحيفة قوية. اقطع القائد الزائد."}
      ],
      tight: (p, k) => p[0] > 72 && p[0] < xe + 30 ? [72 + (p[0] - 72) * (1 - 0.25 * k), AY + (p[1] - AY) * (1 - 0.6 * k), p[2] * (1 - 0.55 * k)] : p
    };
  })();

  /* ---------- renderer ---------- */
  function drawScene(ctx, def, prog, k, W, Hh) {
    const v = def.view || [0, VW], s = W / (v[1] - v[0]), oy = Hh / 2 - (def.cy || AY) * s;
    const P = p => [(p[0] - v[0]) * s, p[1] * s + oy];
    const segs = [];
    const push = (pts, color, w, upto, tf) => {
      for (let i = 1; i <= upto && i < pts.length; i++) {
        const a = tf(pts[i - 1], i - 1), b = tf(pts[i], i);
        segs.push({a, b, z: (a[2] + b[2]) / 2, color, w});
      }
    };
    const id = p => p;
    (def.metal || []).forEach(m => push(m.pts, m.color, m.w, m.pts.length, id));
    let tip = null;
    def.ropes.forEach((r, ri) => {
      const L = r._len || (r._len = lengths(r.pts)), tot = L[L.length - 1];
      const f = Math.max(r.start, prog[ri]); let n = L.findIndex(v => v >= f * tot); if (n < 0) n = r.pts.length - 1;
      const tf = k > 0 ? ((p, i) => def.tight(p, k, ri, i)) : id;
      push(r.pts, r.color, r.w, n, tf);
      if (prog._active === ri && f < 1) tip = tf(r.pts[n], n);
    });
    segs.sort((u, v) => u.z - v.z);
    ctx.lineJoin = "round";
    for (const g of segs) {
      const [ax, ay] = P(g.a), [bx, by] = P(g.b), w = g.w * s, depth = 0.82 + 0.03 * g.z;
      ctx.strokeStyle = "rgba(4,12,22,.9)"; ctx.lineWidth = w + 2.6 * s; ctx.lineCap = "butt";
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      ctx.strokeStyle = shade(g.color, Math.min(1.15, depth)); ctx.lineWidth = w; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = Math.max(0.8, w * 0.25);
      ctx.beginPath(); ctx.moveTo(ax, ay - w * 0.22); ctx.lineTo(bx, by - w * 0.22); ctx.stroke();
    }
    if (tip) {
      const [tx, ty] = P(tip), g = ctx.createRadialGradient(tx, ty, 0, tx, ty, 16 * s);
      g.addColorStop(0, "rgba(255,179,71,.95)"); g.addColorStop(1, "rgba(255,179,71,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(tx, ty, 16 * s, 0, 7); ctx.fill();
      ctx.fillStyle = "#ffb347"; ctx.beginPath(); ctx.arc(tx, ty, 3.2 * s, 0, 7); ctx.fill();
    }
  }

  const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const PAUSE = 0.9;                                                  // seconds held at the end of each step
  function timeline(def) {
    let t = 0; const out = [];
    def.steps.forEach((st, i) => { out.push({...st, i, t0: t, t1: t + st.d}); t += st.d + PAUSE; });
    return {segs: out, total: t + 0.8};
  }
  function stateAt(def, TL, t) {
    const prog = def.ropes.map(r => r.start); let k = 0, cap = def.steps[0].cap, stepI = 0; prog._active = def.steps[0].r || 0;
    const from = {}; def.ropes.forEach((r, i) => from[i] = r.start);
    for (const sg of TL.segs) {
      const u = t <= sg.t0 ? 0 : t >= sg.t1 ? 1 : ease((t - sg.t0) / (sg.t1 - sg.t0));
      if (t >= sg.t0) { cap = sg.cap; stepI = sg.i; }
      if (t < sg.t0) break;                                         // later steps have not started yet
      if (sg.tight) { k = u; prog._active = -1; }
      else { const ri = sg.r || 0, f0 = from[ri]; prog[ri] = f0 + (sg.to - f0) * u; from[ri] = sg.to; prog._active = ri; }
    }
    return {prog, k, cap, stepI};
  }

  function mount(box, key) {
    const def = K[key]; if (!def) return false;
    const TL = timeline(def);
    box.dataset.ready = 1;
    box.innerHTML = `<canvas class="k3c"></canvas>
      <div class="k3cap"><span class="num">1</span><span class="tx"></span></div>
      <input type="range" dir="ltr" class="k3rng" min="0" max="1000" value="0" aria-label="تقدّم الربط">
      <div class="k3ctl"><button class="btn sm" data-k="play">⏸ إيقاف</button><button class="btn sec sm" data-k="slow">🐢 أبطأ</button>
        <span class="k3steps">${def.steps.map((_, i) => `<i data-ks="${i}"></i>`).join("")}</span></div>`;
    const cv = box.querySelector("canvas"), rng = box.querySelector(".k3rng"), num = box.querySelector(".num"), tx = box.querySelector(".tx"), pb = box.querySelector('[data-k="play"]'), sb = box.querySelector('[data-k="slow"]');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let W = 0, Hh = 0;
    const fit = () => { W = box.clientWidth - 20 || 320; Hh = Math.round(W * 0.58); cv.width = W * dpr; cv.height = Hh * dpr; cv.style.width = W + "px"; cv.style.height = Hh + "px"; };
    fit();
    let t = 0, playing = !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches), speed = 1, last = performance.now(), lastStep = -1, raf = 0;
    const ctx = cv.getContext("2d");
    const draw = () => {
      const st = stateAt(def, TL, Math.min(t, TL.total - 0.8));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = ctx.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, "#0d2740"); g.addColorStop(1, "#081a2b");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);
      ctx.strokeStyle = "rgba(255,255,255,.035)"; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 24) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, Hh); ctx.stroke(); }
      drawScene(ctx, def, st.prog, st.k, W, Hh);
      if (st.stepI !== lastStep) { lastStep = st.stepI; num.textContent = st.stepI + 1; tx.textContent = st.cap; box.querySelectorAll("[data-ks]").forEach((d, i) => d.classList.toggle("on", i === st.stepI)); tx.parentNode.classList.remove("flash"); void tx.offsetWidth; tx.parentNode.classList.add("flash"); }
      rng.value = Math.round(t / TL.total * 1000);
    };
    const tick = now => {
      if (!document.body.contains(box)) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (playing) { t += dt * speed; if (t > TL.total) t = 0; }
      draw(); raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    rng.oninput = () => { t = rng.value / 1000 * TL.total; playing = false; pb.textContent = "▶ تشغيل"; draw(); };
    box.addEventListener("click", e => {
      const b = e.target.closest("[data-k]"), d = e.target.closest("[data-ks]");
      if (d) { t = TL.segs[+d.dataset.ks].t0 + 0.01; draw(); return; }
      if (!b) return;
      if (b.dataset.k === "play") { playing = !playing; if (playing && t >= TL.total - 0.9) t = 0; pb.textContent = playing ? "⏸ إيقاف" : "▶ تشغيل"; }
      if (b.dataset.k === "slow") { speed = speed === 1 ? 0.5 : 1; sb.textContent = speed === 1 ? "🐢 أبطأ" : "🐇 عادي"; }
    });
    window.addEventListener("resize", fit);
    return true;
  }
  window.Knot3D = {has: k => !!K[k], mount};
})();
