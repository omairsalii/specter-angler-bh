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

  /* ---------- knot definitions (loose geometry: real gaps between strands so every pass is visible) ---------- */
  const EX = 280, ER = 10;
  const K = {};
  const seq = (...parts) => { const pts = join(...parts), ln = lengths(pts), tot = ln[ln.length - 1]; let acc = -1; const brk = parts.map(p => (acc += p.length - (acc < 0 ? 0 : 1), ln[Math.max(0, acc)] / tot)); return {pts, brk}; };
  const sq = (p, k, c, sx, sy, sz) => [c[0] + (p[0] - c[0]) * (1 - sx * k), c[1] + (p[1] - c[1]) * (1 - sy * k), p[2] * (1 - sz * k)];

  K.clinch = (() => {
    const S = seq(
      line([-10, AY, 0], [EX, AY, 0], 50),
      spline([[EX, AY, 0], [EX + 16, AY, 0], [EX + 24, AY + 12, 0], [EX + 12, AY + 24, 0], [EX - 14, AY + 22, 0], [EX - 30, AY + 14, 0]], 8),
      helix(EX - 30, EX - 112, AY, 14, 5, Math.PI, 1, 26),
      spline([[EX - 112, AY + 14, 0], [EX - 124, AY - 6, 8], [EX - 108, AY - 36, 14], [EX - 64, AY - 46, 16], [EX - 26, AY - 30, 14], [EX - 16, AY - 2, 10], [EX - 14, AY + 10, 0], [EX - 12, AY + 18, -12], [EX - 24, AY + 36, -14]], 9),
      spline([[EX - 24, AY + 36, -14], [EX - 50, AY + 30, -22], [EX - 66, AY - 8, -24], [EX - 66, AY - 26, -6], [EX - 66, AY - 30, 10], [EX - 70, AY - 42, 26], [EX - 82, AY - 70, 30]], 9)
    );
    const b = S.brk;
    return {
      view: [140, 330], cy: AY - 4,
      ropes: [{pts: S.pts, color: COL.main, w: 3.6, start: b[0] * 0.97}],
      metal: [{pts: ring(EX, AY, ER), color: COL.metal, w: 3.5}, {pts: hookShank(EX), color: COL.metal, w: 4}],
      steps: [
        {to: b[1], d: 2.2, cap: "أدخل طرف الخيط في عين الكلّاب واسحب نحو 15 سم."},
        {to: b[2], d: 5, cap: "لُفّ الطرف حول الخيط الرئيسي 5 إلى 7 لفّات، مبتعداً عن العين."},
        {to: b[3], d: 3, cap: "أعِد الطرف إلى الفتحة الصغيرة بين العين وأول لفّة، وأدخله فيها.", gap: [EX - 14, AY + 10, 0]},
        {to: 1, d: 3, cap: "ثم أدخله في الحلقة الكبيرة التي تكوّنت فوق اللفّات (هذه هي «المحسّنة»).", gap: [EX - 66, AY - 30, 8]},
        {tight: true, d: 2.8, cap: "بلّل العقدة واسحب الخيط الرئيسي بثبات حتى تنضمّ اللفّات على العين، ثم قصّ الطرف."}
      ],
      tight: (p, k, ri, i) => i < 50 ? p : sq(p, k, [EX - 6, AY], 0.62, 0.78, 0.78)
    };
  })();

  K.palomar = (() => {
    const S = seq(
      line([-10, AY, 0], [EX, AY, 0], 40),
      spline([[EX, AY, 0], [EX + 24, AY, 0], [EX + 32, AY + 14, 0], [EX + 16, AY + 30, 0], [EX - 30, AY + 34, 0]], 10),
      spline([[EX - 30, AY + 34, 0], [EX - 62, AY + 28, 8], [EX - 76, AY + 6, 12], [EX - 72, AY - 20, -14], [EX - 52, AY - 30, -12], [EX - 38, AY - 14, 16], [EX - 44, AY + 6, 18], [EX - 54, AY + 12, 0], [EX - 58, AY + 20, -16]], 10),
      spline([[EX - 58, AY + 20, -16], [EX - 24, AY + 54, -8], [EX + 40, AY + 68, 6], [EX + 94, AY + 46, 12], [EX + 100, AY + 8, 14], [EX + 72, AY - 20, 12], [EX + 26, AY - 16, 6], [EX + 8, AY - 6, 2]], 10)
    );
    const off = (pts, d) => pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], c = pts[Math.min(pts.length - 1, i + 1)]; const dx = c[0] - a[0], dy = c[1] - a[1], m = Math.hypot(dx, dy) || 1; return [p[0] - dy / m * d, p[1] + dx / m * d, p[2]]; });
    const b = S.brk;
    return {
      view: [160, 385], cy: AY + 16,
      ropes: [{pts: off(S.pts, 4), color: COL.main, w: 3, start: b[0] * 0.95}, {pts: off(S.pts, -4), color: COL.main, w: 3, start: b[0] * 0.95}],
      metal: [{pts: ring(EX, AY, ER + 2), color: COL.metal, w: 3.5}, {pts: hookShank(EX), color: COL.metal, w: 4}],
      steps: [
        {to: b[1], d: 2.6, cap: "اثنِ آخر 15 سم من الخيط ليصير مزدوجاً، وأدخل رأس الحلقة في عين الكلّاب."},
        {to: b[2], d: 4.2, cap: "اعقد عقدة بسيطة بالخيط المزدوج: لُفّ الحلقة خلف الخيطين ثم أدخلها من الأمام.", gap: [EX - 50, AY + 4, 0]},
        {to: 1, d: 3.8, cap: "مرّر الكلّاب أو الطعم كاملاً من داخل الحلقة.", gap: [EX + 48, AY + 20, 0]},
        {tight: true, d: 2.6, cap: "بلّل العقدة واسحب الطرفين معاً حتى تنضمّ فوق العين، ثم قصّ الطرف."}
      ],
      tight: (p, k) => p[0] > EX - 90 ? sq(p, k, [EX - 4, AY], 0.78, 0.82, 0.75) : p
    };
  })();

  K.loop = (() => {
    const OX = 150;
    const S = seq(
      line([-10, AY, 0], [OX - 20, AY, 0], 16),
      spline([[OX - 20, AY, 0], [OX, AY, 0], [OX + 20, AY - 10, 0], [OX + 22, AY - 36, 0], [OX + 2, AY - 48, 0], [OX - 16, AY - 32, 0], [OX - 6, AY - 6, -9], [OX + 12, AY + 8, -9], [OX + 34, AY + 4, 0], [OX + 60, AY, 0]], 9),
      line([OX + 60, AY, 0], [EX, AY, 0], 20),
      spline([[EX, AY, 0], [EX + 16, AY + 2, 0], [EX + 18, AY + 16, 0], [EX, AY + 22, 0], [OX + 60, AY + 20, 0], [OX + 22, AY + 6, 10], [OX + 10, AY - 18, 12], [OX + 4, AY - 26, 0], [OX - 2, AY - 30, -12], [OX - 20, AY - 20, -14]], 9),
      helix(OX - 28, OX - 92, AY, 12, 4, 0, 1, 26),
      spline([[OX - 92, AY - 12, 0], [OX - 84, AY - 38, -14], [OX - 34, AY - 44, -14], [OX - 4, AY - 32, -12], [OX + 4, AY - 24, 0], [OX + 10, AY - 18, 12], [OX + 26, AY + 10, 16], [OX + 20, AY + 42, 16]], 9)
    );
    const b = S.brk;
    return {
      view: [40, 330], cy: AY - 6,
      ropes: [{pts: S.pts, color: COL.main, w: 3.6, start: 0}],
      metal: [{pts: ring(EX, AY, ER), color: COL.metal, w: 3.5}, {pts: hookShank(EX), color: COL.metal, w: 4}],
      steps: [
        {to: b[1], d: 2.8, cap: "اعقد عقدة بسيطة مفتوحة في الخيط على بعد 20 سم من طرفه، واترك فتحتها واسعة."},
        {to: (b[2] + b[3]) / 2 * 0.2 + b[2] * 0.8, d: 2.4, cap: "أدخل الطرف في عين الطعم."},
        {to: b[3], d: 3, cap: "أعِده وأدخله في فتحة العقدة البسيطة من الجهة نفسها التي خرج منها الخيط.", gap: [OX + 4, AY - 24, 0]},
        {to: b[4], d: 3.8, cap: "لُفّ الطرف حول الخيط الرئيسي 4 لفّات."},
        {to: 1, d: 3, cap: "أعِده إلى فتحة العقدة البسيطة من الجهة التي خرج منها.", gap: [OX + 4, AY - 24, 0]},
        {tight: true, d: 2.8, cap: "بلّل واسحب الطرف قليلاً ثم الخيط الرئيسي بقوة، فتبقى حلقة حرّة عند العين."}
      ],
      tight: (p, k) => p[0] > OX - 100 && p[0] < OX + 50 ? sq(p, k, [OX, AY], 0.5, 0.78, 0.75) : p
    };
  })();

  K.dbluni = (() => {
    const yB = AY - 5, yL = AY + 5;
    const B = seq(
      line([-10, yB, 0], [262, yB, 0], 40),
      spline([[262, yB, 0], [278, yB - 14, 0], [266, yB - 44, 0], [222, yB - 52, 0], [184, yB - 40, 0], [180, yB - 16, 8]], 9),
      helix(186, 238, AY, 15, 4, 0, 1, 26),
      spline([[238, AY - 15, 0], [244, AY - 40, 12], [250, AY - 62, 16]], 6)
    );
    const L = seq(
      line([370, yL, 0], [96, yL, 0], 40),
      spline([[96, yL, 0], [80, yL + 14, 0], [92, yL + 44, 0], [136, yL + 52, 0], [174, yL + 40, 0], [178, yL + 16, -8]], 9),
      helix(172, 120, AY, 15, 4, Math.PI, -1, 26),
      spline([[120, AY + 15, 0], [114, AY + 40, -12], [108, AY + 62, -16]], 6)
    );
    return {
      view: [60, 300], cy: AY,
      ropes: [{pts: B.pts, color: COL.main, w: 3, start: B.brk[0] * 0.96}, {pts: L.pts, color: COL.leader, w: 4.4, start: L.brk[0] * 0.96}],
      metal: [],
      steps: [
        {r: 0, to: B.brk[1], d: 2.6, cap: "ضع المضفّر والقائد متوازيين متداخلين 20 سم، واثنِ طرف المضفّر لتصنع حلقة كبيرة فوق الخيطين."},
        {r: 0, to: 1, d: 4.4, cap: "لُفّ طرف المضفّر حول الخيطين من داخل الحلقة 6 إلى 8 لفّات، ثم شدّ الطرف.", gap: [212, AY - 30, 0]},
        {r: 1, to: L.brk[1], d: 2.4, cap: "كرّر بطرف القائد من الجهة الأخرى: حلقة كبيرة تحت الخيطين…"},
        {r: 1, to: 1, d: 4, cap: "…ثم 4 لفّات حول الخيطين من داخل الحلقة، وشدّ الطرف.", gap: [146, AY + 30, 0]},
        {tight: true, d: 2.8, cap: "بلّل واسحب الخيطين الرئيسيين في اتجاهين متعاكسين حتى تلتقي العقدتان، ثم قصّ الطرفين."}
      ],
      tight: (p, k, ri, i) => {
        const sh = 26 * k;
        if (ri === 0) return i >= 40 ? sq([p[0] - sh, p[1], p[2]], k, [212 - sh, AY], 0.45, 0.72, 0.65) : [Math.min(p[0], 262 - 40 * k - sh), p[1] + (AY - p[1]) * 0.5 * k * (p[0] > 120 ? 1 : 0), p[2]];
        if (ri === 1) return i >= 40 ? sq([p[0] + sh, p[1], p[2]], k, [146 + sh, AY], 0.45, 0.72, 0.65) : [Math.max(p[0], 96 + 40 * k + sh), p[1] + (AY - p[1]) * 0.5 * k * (p[0] < 240 ? 1 : 0), p[2]];
        return p;
      }
    };
  })();

  K.fg = (() => {
    const leader = line([370, AY, 0], [64, AY, 0], 40);
    const parts = [line([-10, AY - 34, 0], [66, AY - 14, 0], 14)];
    let x = 70; const r = 13, dx = 7.5;
    for (let i = 0; i < 14; i++) {                                     // alternate wraps: front strokes alternate \ and / → the FG "X" weave
      const front = i % 2 === 0;
      parts.push(spline([[x, AY - r, 0], [x + dx * 0.5, AY, front ? 11 : -11], [x + dx, AY + r, 0]], 7));
      parts.push(spline([[x + dx, AY + r, 0], [x + dx * 1.5, AY, front ? -11 : 11], [x + dx * 2, AY - r, 0]], 7));
      x += dx * 2 * 0.95;
    }
    const xe = x;
    for (let h = 0; h < 3; h++) parts.push(helix(xe + 4 + h * 14, xe + 4 + h * 14 + 12, AY, 11, 1, 0, 1, 20));
    parts.push(spline([[xe + 46, AY - 11, 0], [xe + 58, AY - 26, 6], [xe + 70, AY - 44, 8]], 6));
    const S = seq(...parts), b0 = S.brk[0], bW = S.brk[28];
    return {
      view: [20, 330], cy: AY - 8,
      ropes: [{pts: leader, color: COL.leader, w: 5, start: 1}, {pts: S.pts, color: COL.main, w: 2.6, start: b0}],
      metal: [],
      steps: [
        {r: 1, to: S.brk[2], d: 2, cap: "شدّ المضفّر جيداً، وضع القائد فوقه بزاوية."},
        {r: 1, to: bW, d: 7.5, cap: "لُفّ المضفّر حول القائد بالتناوب: مرة من فوق ومرة من تحت، 20 مرة، فيتكوّن نسيج متقاطع."},
        {r: 1, to: 1, d: 2.8, cap: "ثبّت اللفّات بعقد نصفية حول القائد والمضفّر معاً."},
        {tight: true, d: 2.6, cap: "بلّل واسحب بقوة: ينقبض النسيج على القائد ويصير وصلة نحيفة قوية. اقطع القائد الزائد."}
      ],
      tight: (p, k) => p[0] > 66 && p[0] < xe + 50 ? [66 + (p[0] - 66) * (1 - 0.3 * k), AY + (p[1] - AY) * (1 - 0.68 * k), p[2] * (1 - 0.62 * k)] : p
    };
  })();

  /* ---------- renderer ---------- */
  function drawScene(ctx, def, prog, k, W, Hh, cam, gapP) {
    const v = def.view || [0, VW], cx = (v[0] + v[1]) / 2, cy = def.cy || AY;
    const s = W / (v[1] - v[0]) * cam.zoom, D = 420;
    const cyw = Math.cos(cam.yaw), syw = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    const R = p => {                                                    // orbit camera: yaw around the vertical axis, then pitch
      const x = p[0] - cx, y = p[1] - cy, z = p[2];
      const x1 = x * cyw + z * syw, z1 = -x * syw + z * cyw;
      const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
      const f = D / (D - z2);
      return [W / 2 + x1 * f * s, Hh / 2 + y2 * f * s, z2, f];
    };
    // floor grid under the knot, so the rotation is easy to read
    ctx.lineWidth = 1;
    for (let i = -6; i <= 6; i++) {
      const g1 = R([cx + i * 20, cy + 55, -120]), g2 = R([cx + i * 20, cy + 55, 120]);
      const h1 = R([cx - 120, cy + 55, i * 20]), h2 = R([cx + 120, cy + 55, i * 20]);
      ctx.strokeStyle = i === 0 ? "rgba(46,196,182,.22)" : "rgba(255,255,255,.06)";
      ctx.beginPath(); ctx.moveTo(g1[0], g1[1]); ctx.lineTo(g2[0], g2[1]); ctx.moveTo(h1[0], h1[1]); ctx.lineTo(h2[0], h2[1]); ctx.stroke();
    }
    const segs = [];
    const push = (pts, color, w, upto, tf) => {
      let pa = R(tf(pts[0], 0));
      for (let i = 1; i <= upto && i < pts.length; i++) {
        const pb = R(tf(pts[i], i));
        segs.push({a: pa, b: pb, z: (pa[2] + pb[2]) / 2, color, w: w * (pa[3] + pb[3]) / 2});
        pa = pb;
      }
    };
    const id = p => p;
    (def.metal || []).forEach(m => push(m.pts, m.color, m.w, m.pts.length, id));
    let tip = null; const arrows = [];
    def.ropes.forEach((r, ri) => {
      const L = r._len || (r._len = lengths(r.pts)), tot = L[L.length - 1];
      const f = Math.max(r.start, prog[ri]); let n = L.findIndex(v => v >= f * tot); if (n < 0) n = r.pts.length - 1;
      const tf = k > 0 ? ((p, i) => def.tight(p, k, ri, i)) : id;
      push(r.pts, r.color, r.w, n, tf);
      if (prog._active === ri && f < 1) {
        tip = R(tf(r.pts[n], n));
        const i0 = L.findIndex(v => v >= r.start * tot);
        for (let i = n - 10, c = 0; i > Math.max(i0 + 4, 1) && c < 5; i -= 26, c++) arrows.push([R(tf(r.pts[i], i)), R(tf(r.pts[i + 2], i + 2))]);   // a few arrows trailing the tip
      }
    });
    segs.sort((u, v) => u.z - v.z);
    ctx.lineJoin = "round";
    for (const g of segs) {
      const [ax, ay] = g.a, [bx, by] = g.b, w = g.w * s, depth = 0.8 + Math.max(-0.25, Math.min(0.3, g.z / 160));
      ctx.strokeStyle = "rgba(4,12,22,.9)"; ctx.lineWidth = w + 2.6 * s; ctx.lineCap = "butt";
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      ctx.strokeStyle = shade(g.color, Math.min(1.15, depth)); ctx.lineWidth = w; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.32)"; ctx.lineWidth = Math.max(0.8, w * 0.25);
      ctx.beginPath(); ctx.moveTo(ax, ay - w * 0.22); ctx.lineTo(bx, by - w * 0.22); ctx.stroke();
    }
    // direction chevrons along the part of the line being tied
    if (arrows.length) {
      ctx.fillStyle = "rgba(255,179,71,.9)";
      for (const [pa, pb] of arrows) {
        const ang = Math.atan2(pb[1] - pa[1], pb[0] - pa[0]), L2 = 5.5 * s * pa[3];
        ctx.save(); ctx.translate(pa[0], pa[1] - 0.5 * s); ctx.rotate(ang);
        ctx.beginPath(); ctx.moveTo(L2, 0); ctx.lineTo(-L2 * 0.6, -L2 * 0.7); ctx.lineTo(-L2 * 0.2, 0); ctx.lineTo(-L2 * 0.6, L2 * 0.7); ctx.closePath(); ctx.fill(); ctx.restore();
      }
    }
    // the gap the line is about to go through
    if (gapP) {
      const [gx, gy] = R(gapP), pr = 0.5 + 0.5 * Math.sin(performance.now() / 260), rr = (10 + 5 * pr) * s;
      ctx.setLineDash([4 * s, 3 * s]); ctx.strokeStyle = `rgba(255,93,115,${0.6 + 0.4 * pr})`; ctx.lineWidth = 2 * s;
      ctx.beginPath(); ctx.arc(gx, gy, rr, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      ctx.font = `700 ${11 * s}px Tajawal, sans-serif`; ctx.fillStyle = "#ff8a9b"; ctx.textAlign = "center"; ctx.fillText("من هنا", gx, gy - rr - 4 * s);
    }
    if (tip) {
      const [tx, ty] = tip, g = ctx.createRadialGradient(tx, ty, 0, tx, ty, 16 * s);
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
    const prog = def.ropes.map(r => r.start); let k = 0, cap = def.steps[0].cap, stepI = 0, gap = null; prog._active = def.steps[0].r || 0;
    const from = {}; def.ropes.forEach((r, i) => from[i] = r.start);
    for (const sg of TL.segs) {
      const u = t <= sg.t0 ? 0 : t >= sg.t1 ? 1 : ease((t - sg.t0) / (sg.t1 - sg.t0));
      if (t >= sg.t0) { cap = sg.cap; stepI = sg.i; gap = sg.gap && t < sg.t1 ? sg.gap : null; }
      if (t < sg.t0) break;                                         // later steps have not started yet
      if (sg.tight) { k = u; prog._active = -1; }
      else { const ri = sg.r || 0, f0 = from[ri]; prog[ri] = f0 + (sg.to - f0) * u; from[ri] = sg.to; prog._active = ri; }
    }
    return {prog, k, cap, stepI, gap};
  }

  function mount(box, key) {
    const def = K[key]; if (!def) return false;
    const TL = timeline(def);
    box.dataset.ready = 1;
    box.innerHTML = `<canvas class="k3c"></canvas>
      <div class="k3cap"><span class="num">1</span><span class="tx"></span></div>
      <input type="range" dir="ltr" class="k3rng" min="0" max="1000" value="0" aria-label="تقدّم الربط">
      <div class="k3ctl"><button class="btn sm" data-k="play">⏸ إيقاف</button><button class="btn sec sm" data-k="slow">🐢 أبطأ</button>
        <button class="btn sec sm" data-k="prev" aria-label="الخطوة السابقة">⏪</button><button class="btn sec sm" data-k="next" aria-label="الخطوة التالية">⏩</button>
        <span class="k3steps">${def.steps.map((_, i) => `<i data-ks="${i}"></i>`).join("")}</span></div>
      <div class="k3view"><span class="mute">🖐️ اسحب على الرسم لتدويره، وقرّب بإصبعين</span>
        <button class="btn sec sm" data-v="front">أمام</button><button class="btn sec sm" data-v="top">من أعلى</button><button class="btn sec sm" data-v="side">جانب</button><button class="btn sec sm" data-v="spin">🔄 دوران</button></div>`;
    const cv = box.querySelector("canvas"), rng = box.querySelector(".k3rng"), num = box.querySelector(".num"), tx = box.querySelector(".tx"), pb = box.querySelector('[data-k="play"]'), sb = box.querySelector('[data-k="slow"]');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let W = 0, Hh = 0;
    const fit = () => { W = box.clientWidth - 20 || 320; Hh = Math.round(W * 0.58); cv.width = W * dpr; cv.height = Hh * dpr; cv.style.width = W + "px"; cv.style.height = Hh + "px"; };
    fit();
    let t = 0, playing = !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches), speed = 1, last = performance.now(), lastStep = -1, raf = 0;
    const ctx = cv.getContext("2d");
    const cam = {yaw: -0.35, pitch: 0.32, zoom: 1}, target = {yaw: -0.35, pitch: 0.32, zoom: 1};
    let spin = false;
    const VIEWS = {front: [0, 0], top: [0, 1.35], side: [-1.25, 0.15]};
    // drag to orbit, two fingers to zoom, double-tap to reset
    const ptrs = new Map(); let pinch0 = 0, zoom0 = 1, lastTap = 0;
    cv.style.touchAction = "none";
    cv.addEventListener("pointerdown", e => { cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]); spin = false;
      if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch0 = Math.hypot(a[0] - b[0], a[1] - b[1]); zoom0 = target.zoom; }
      const now = performance.now(); if (now - lastTap < 300) { Object.assign(target, {yaw: -0.35, pitch: 0.32, zoom: 1}); } lastTap = now; });
    cv.addEventListener("pointermove", e => {
      if (!ptrs.has(e.pointerId)) return; const pr = ptrs.get(e.pointerId); const dx = e.clientX - pr[0], dy = e.clientY - pr[1]; ptrs.set(e.pointerId, [e.clientX, e.clientY]);
      if (ptrs.size === 1) { target.yaw += dx * 0.012; target.pitch = Math.max(-1.45, Math.min(1.45, target.pitch + dy * 0.01)); Object.assign(cam, {yaw: target.yaw, pitch: target.pitch}); }
      else if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; target.zoom = Math.max(0.6, Math.min(3, zoom0 * Math.hypot(a[0] - b[0], a[1] - b[1]) / (pinch0 || 1))); cam.zoom = target.zoom; }
    });
    const up = e => ptrs.delete(e.pointerId); cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    cv.addEventListener("wheel", e => { e.preventDefault(); target.zoom = Math.max(0.6, Math.min(3, target.zoom * (e.deltaY < 0 ? 1.1 : 0.9))); }, {passive: false});
    const draw = () => {
      const st = stateAt(def, TL, Math.min(t, TL.total - 0.8));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = ctx.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, "#0d2740"); g.addColorStop(1, "#081a2b");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);
      drawScene(ctx, def, st.prog, st.k, W, Hh, cam, st.gap);
      if (st.stepI !== lastStep) { lastStep = st.stepI; num.textContent = st.stepI + 1; tx.textContent = st.cap; box.querySelectorAll("[data-ks]").forEach((d, i) => d.classList.toggle("on", i === st.stepI)); tx.parentNode.classList.remove("flash"); void tx.offsetWidth; tx.parentNode.classList.add("flash"); }
      rng.value = Math.round(t / TL.total * 1000);
    };
    const tick = now => {
      if (!document.body.contains(box)) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (playing) { t += dt * speed; if (t > TL.total) t = 0; }
      if (spin) target.yaw += dt * 0.6;
      cam.yaw += (target.yaw - cam.yaw) * 0.15; cam.pitch += (target.pitch - cam.pitch) * 0.15; cam.zoom += (target.zoom - cam.zoom) * 0.15;
      draw(); raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    rng.oninput = () => { t = rng.value / 1000 * TL.total; playing = false; pb.textContent = "▶ تشغيل"; draw(); };
    box.addEventListener("click", e => {
      const vb = e.target.closest("[data-v]");
      if (vb) { if (vb.dataset.v === "spin") { spin = !spin; vb.classList.toggle("on", spin); } else { spin = false; const [y, p2] = VIEWS[vb.dataset.v]; target.yaw = y; target.pitch = p2; target.zoom = 1; } return; }
      const b = e.target.closest("[data-k]"), d = e.target.closest("[data-ks]");
      if (d) { t = TL.segs[+d.dataset.ks].t0 + 0.01; draw(); return; }
      if (!b) return;
      if (b.dataset.k === "play") { playing = !playing; if (playing && t >= TL.total - 0.9) t = 0; pb.textContent = playing ? "⏸ إيقاف" : "▶ تشغيل"; }
      if (b.dataset.k === "prev" || b.dataset.k === "next") {
        const cur = TL.segs.findIndex(sg => t < sg.t1 + PAUSE); let i = cur < 0 ? TL.segs.length - 1 : cur;
        i = b.dataset.k === "next" ? Math.min(TL.segs.length - 1, (t > TL.segs[i].t0 + 0.05 ? i + 1 : i)) : Math.max(0, t - TL.segs[i].t0 > 0.6 ? i : i - 1);
        t = TL.segs[i].t0 + 0.01; playing = false; pb.textContent = "▶ تشغيل"; draw(); return;
      }
      if (b.dataset.k === "slow") { speed = speed === 1 ? 0.5 : 1; sb.textContent = speed === 1 ? "🐢 أبطأ" : "🐇 عادي"; }
    });
    window.addEventListener("resize", fit);
    return true;
  }
  window.Knot3D = {has: k => !!K[k], mount};
})();
