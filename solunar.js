/* Specter Angler BH — solunar periods (moon transits = major, moonrise/moonset = minor) */
"use strict";
(function () {
  const rad = Math.PI / 180, e = rad * 23.4397, DAY = 864e5;
  const toDays = t => t / DAY - 0.5 + 2440588 - 2451545;
  function moonAt(t, lat, lng) {
    const d = toDays(t);
    const L = rad * (218.316 + 13.176396 * d), M = rad * (134.963 + 13.064993 * d), F = rad * (93.272 + 13.229350 * d);
    const l = L + rad * 6.289 * Math.sin(M), b = rad * 5.128 * Math.sin(F);
    const ra = Math.atan2(Math.sin(l) * Math.cos(e) - Math.tan(b) * Math.sin(e), Math.cos(l));
    const dec = Math.asin(Math.sin(b) * Math.cos(e) + Math.cos(b) * Math.sin(e) * Math.sin(l));
    let H = rad * (280.16 + 360.9856235 * d) - rad * -lng - ra;
    H = Math.atan2(Math.sin(H), Math.cos(H));                         // −π … π
    const phi = rad * lat;
    const alt = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H)) / rad;
    return {alt, H};
  }
  const cache = {};
  function events(dayStart, lat, lng) {         // moonrise, moonset, upper & lower transit within [dayStart, +24h)
    const key = dayStart + ":" + lat.toFixed(2);
    if (cache[key]) return cache[key];
    const out = [], step = 5 * 6e4, h0 = 0.133;
    let p = moonAt(dayStart - step, lat, lng);
    for (let t = dayStart; t < dayStart + DAY + step; t += step) {
      const c = moonAt(t, lat, lng), f = (a, b) => (0 - a) / (b - a);
      if ((p.alt - h0) < 0 && (c.alt - h0) >= 0) out.push({type: "rise", t: t - step + step * f(p.alt - h0, c.alt - h0)});
      if ((p.alt - h0) >= 0 && (c.alt - h0) < 0) out.push({type: "set", t: t - step + step * f(p.alt - h0, c.alt - h0)});
      if (p.H < 0 && c.H >= 0 && Math.abs(c.H) < 1) out.push({type: "upper", t: t - step + step * f(p.H, c.H)});
      if (p.H > 0 && c.H < 0 && Math.abs(c.H) > 2) out.push({type: "lower", t: t - step * 0.5});
      p = c;
    }
    return (cache[key] = out.filter(x => x.t >= dayStart && x.t < dayStart + DAY).sort((a, b) => a.t - b.t));
  }
  function periods(dayStart, lat = 26.2, lng = 50.6) {
    return events(dayStart, lat, lng).map(ev => {
      const major = ev.type === "upper" || ev.type === "lower", half = major ? 60 * 6e4 : 30 * 6e4;
      return {major, type: ev.type, center: new Date(ev.t), start: new Date(ev.t - half), end: new Date(ev.t + half)};
    });
  }
  function around(t, lat = 26.2, lng = 50.6) {    // all periods touching a moment (checks the neighbouring days too)
    const d = new Date(t); d.setHours(0, 0, 0, 0);
    return [-DAY, 0, DAY].flatMap(o => periods(+d + o, lat, lng));
  }
  function at(t, lat, lng) { return around(t, lat, lng).find(p => t >= p.start && t <= p.end) || null; }
  function next(t, lat, lng) { return around(t, lat, lng).concat(around(+t + DAY, lat, lng)).filter(p => p.start > t).sort((a, b) => a.start - b.start)[0] || null; }
  function dayRating(dayStart, sun) {           // 1–4 stars: moon near new/full, majors overlapping sunrise/sunset
    let s = 1;
    const mp = typeof moonPhase === "function" ? moonPhase(new Date(dayStart + DAY / 2)) : 0.25;
    const k = Math.abs(Math.cos(2 * Math.PI * mp)); if (k > 0.9) s += 2; else if (k > 0.6) s += 1;
    if (sun) { const near = (a, b) => Math.abs(a - b) < 75 * 6e4; if (periods(dayStart).some(p => near(+p.center, +sun.sunrise) || near(+p.center, +sun.sunset))) s += 1; }
    return Math.min(4, s);
  }
  const NAME = {upper: "القمر فوق الرأس", lower: "القمر تحت القدم", rise: "شروق القمر", set: "غروب القمر"};
  window.Solunar = {periods, at, next, dayRating, NAME};
})();
