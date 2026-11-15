/* Specter Angler BH — lure illustrations & step-by-step knot diagrams (original drawings) */
"use strict";

/* ======================= LURES ======================= */
const LURE_SVG = (() => {
  const treble = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})" stroke="#c9d3db" stroke-width="1.6" fill="none" stroke-linecap="round">
    <path d="M0 -6 V4"/><path d="M0 4 q-6 0 -6 -6 l2 -2"/><path d="M0 4 q6 0 6 -6 l-2 -2"/><path d="M0 4 q0 6 -5 6 l1 -3"/><circle cx="0" cy="-8" r="2"/></g>`;
  const eye = (x, y, r = 4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x}" cy="${y}" r="${r * 0.5}" fill="#111"/>`;
  const split = (x, y) => `<circle cx="${x}" cy="${y}" r="3.5" fill="none" stroke="#c9d3db" stroke-width="1.6"/>`;
  return {
    popper: `<svg viewBox="0 0 200 90"><defs><linearGradient id="lp1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2e86de"/><stop offset=".55" stop-color="#e8f1f8"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>
      <path d="M38 28 L150 34 Q172 40 150 48 L38 54 Z" fill="url(#lp1)" stroke="#123" stroke-width="1"/>
      <ellipse cx="38" cy="41" rx="7" ry="13" fill="#0b2033"/><ellipse cx="40" cy="41" rx="4" ry="10" fill="#1d4f7a"/>
      ${eye(52, 36)}${split(30, 41)}<path d="M26 41 h-14" stroke="#2ec4b6" stroke-width="2"/>
      ${treble(85, 62)}${treble(148, 60)}<path d="M150 41 h10" stroke="#c9d3db" stroke-width="1.6"/>
      <text x="100" y="86" text-anchor="middle" fill="#8fa8bf" font-size="10" font-family="Tajawal">وجه مقعّر يصنع فقاعات</text></svg>`,
    stickbait: `<svg viewBox="0 0 200 90"><defs><linearGradient id="ls1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a6b4a"/><stop offset=".5" stop-color="#cfe3d4"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>
      <path d="M20 41 Q40 30 110 31 Q170 33 182 41 Q170 49 110 51 Q40 52 20 41 Z" fill="url(#ls1)" stroke="#123" stroke-width="1"/>
      ${eye(36, 38)}${split(16, 41)}<path d="M12 41 h-8" stroke="#2ec4b6" stroke-width="2"/>
      ${treble(80, 62)}${treble(150, 60)}
      <text x="100" y="86" text-anchor="middle" fill="#8fa8bf" font-size="10" font-family="Tajawal">جسم طويل بلا لسان</text></svg>`,
    float_minnow: `<svg viewBox="0 0 200 90"><defs><linearGradient id="lm1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#20425f"/><stop offset=".45" stop-color="#c7d4de"/><stop offset="1" stop-color="#f4f6f8"/></linearGradient></defs>
      <path d="M8 46 L34 40 L30 64 Z" fill="rgba(210,230,245,.55)" stroke="#9fb6c8" stroke-width="1"/>
      <path d="M32 38 Q60 26 120 30 Q160 33 176 40 L186 32 L184 48 L176 44 Q160 52 120 54 Q60 56 32 46 Z" fill="url(#lm1)" stroke="#123" stroke-width="1"/>
      ${eye(48, 39)}${split(28, 46)}<path d="M24 47 h-12" stroke="#2ec4b6" stroke-width="2"/>
      ${treble(82, 66)}${treble(148, 64)}
      <text x="100" y="88" text-anchor="middle" fill="#8fa8bf" font-size="10" font-family="Tajawal">لسان كبير شفاف ويطفو</text></svg>`,
    sink_minnow: `<svg viewBox="0 0 200 90"><defs><linearGradient id="lm2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b5f68"/><stop offset=".45" stop-color="#d9dde2"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>
      <path d="M22 44 L36 41 L32 52 Z" fill="rgba(210,230,245,.55)" stroke="#9fb6c8" stroke-width="1"/>
      <path d="M34 36 Q62 26 118 29 Q156 32 170 40 L182 32 L180 50 L170 44 Q156 52 118 55 Q62 58 34 46 Z" fill="url(#lm2)" stroke="#123" stroke-width="1"/>
      ${eye(48, 38)}${split(30, 41)}<path d="M26 41 h-14" stroke="#2ec4b6" stroke-width="2"/>
      ${treble(82, 66)}${treble(145, 64)}
      <text x="100" y="88" text-anchor="middle" fill="#8fa8bf" font-size="10" font-family="Tajawal">لسان صغير ويغوص</text></svg>`,
    jig: `<svg viewBox="0 0 200 90"><defs><linearGradient id="lj1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9eef2"/><stop offset=".35" stop-color="#8fa3b4"/><stop offset=".55" stop-color="#ffffff"/><stop offset="1" stop-color="#6b7f90"/></linearGradient></defs>
      <path d="M40 40 Q60 33 110 34 Q160 36 178 42 Q160 48 110 50 Q60 51 40 44 Z" fill="url(#lj1)" stroke="#333" stroke-width="1"/>
      <path d="M100 36 L104 48 M120 36 L124 49" stroke="#2e86de" stroke-width="2" opacity=".5"/>
      ${split(34, 42)}<path d="M30 42 h-16" stroke="#2ec4b6" stroke-width="2"/>
      <path d="M36 44 q8 14 20 14" stroke="#ffb347" stroke-width="1.5" fill="none"/>
      <path d="M56 58 q8 0 8 -8 l-3 3" stroke="#c9d3db" stroke-width="1.8" fill="none"/>
      <text x="100" y="86" text-anchor="middle" fill="#8fa8bf" font-size="10" font-family="Tajawal">معدن ثقيل + كلّاب مساعد</text></svg>`,
    paddle: `<svg viewBox="0 0 200 90">
      <circle cx="40" cy="42" r="12" fill="#6d7680" stroke="#222"/>${eye(37, 39, 3.5)}
      <path d="M44 31 L44 22 M44 22 a3 3 0 1 1 0.1 0" stroke="#c9d3db" stroke-width="2" fill="none"/>
      <path d="M50 34 Q90 28 140 36 L150 40 L150 44 L140 48 Q90 56 50 50 Z" fill="#e6e9ec" stroke="#555" stroke-width="1"/>
      <path d="M60 36 v12 M70 35 v14 M80 34 v16 M90 34 v16" stroke="#b9c2ca" stroke-width="1"/>
      <path d="M148 34 Q168 20 176 26 Q182 42 176 58 Q168 64 148 50 Z" fill="#e6e9ec" stroke="#555" stroke-width="1"/>
      <path d="M100 30 q6 -10 14 -6" stroke="#c9d3db" stroke-width="2" fill="none"/>
      <path d="M28 42 h-16" stroke="#2ec4b6" stroke-width="2"/>
      <text x="100" y="86" text-anchor="middle" fill="#8fa8bf" font-size="10" font-family="Tajawal">رأس رصاص + جسم مطاطي بذيل عريض</text></svg>`,
    weedless: `<svg viewBox="0 0 200 90">
      <path d="M36 40 Q80 30 140 36 Q170 40 184 44 Q170 48 140 52 Q80 58 36 48 Z" fill="#7d6b4f" stroke="#3a2f20" stroke-width="1"/>
      <path d="M50 38 v12 M60 37 v14 M70 36 v16" stroke="#5e503a" stroke-width="1"/>
      <path d="M14 43 h14 q8 0 8 -4 v-6 q0 -4 6 -4 h52 q12 0 12 12 q0 6 -4 6" stroke="#c9d3db" stroke-width="2.2" fill="none"/>
      <circle cx="28" cy="43" r="3.5" fill="none" stroke="#c9d3db" stroke-width="1.6"/>
      <path d="M10 43 h-6" stroke="#2ec4b6" stroke-width="2"/>
      <text x="100" y="86" text-anchor="middle" fill="#8fa8bf" font-size="10" font-family="Tajawal">رأس الكلّاب مخفي داخل الطعم</text></svg>`,
    spoon: `<svg viewBox="0 0 200 90"><defs><linearGradient id="lsp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd27a"/><stop offset=".5" stop-color="#fff3cf"/><stop offset="1" stop-color="#c98f1c"/></linearGradient></defs>
      <path d="M50 42 Q70 22 120 26 Q160 30 160 42 Q160 54 120 58 Q70 62 50 42 Z" fill="url(#lsp)" stroke="#6b4a0e" stroke-width="1"/>
      ${split(46, 42)}<path d="M42 42 h-24" stroke="#2ec4b6" stroke-width="2"/>${split(164, 42)}${treble(176, 50)}
      <text x="100" y="86" text-anchor="middle" fill="#8fa8bf" font-size="10" font-family="Tajawal">صفيحة معدنية مقعّرة تلمع</text></svg>`
  };
})();

const LURES = {
  popper:      {name: "بوبر (Popper)", desc: "طعم سطحي بوجه مقعّر. عند نتره بطرف القصبة يُحدث فقاعات وصوتاً يجذب المفترس من بعيد.", q: "popper lure saltwater shore fishing"},
  stickbait:   {name: "ستكبيت (Stickbait)", desc: "طعم سطحي طويل بلا لسان. بالسحب المتقطّع يتمايل يميناً ويساراً على السطح كسمكة مصابة.", q: "stickbait walk the dog saltwater"},
  float_minnow:{name: "منو عائم (Floating minnow)", desc: "طعم صلب على شكل سمكة بلسان أمامي كبير. يطفو حين تتوقف، ويغوص قليلاً حين تسحب.", q: "floating minnow lure saltwater"},
  sink_minnow: {name: "منو غاطس (Sinking minnow)", desc: "يشبه المنو العائم لكن لسانه صغير ويغوص حين تتوقف، فيغطي الطبقات المتوسطة.", q: "sinking minnow lure shore casting"},
  jig:         {name: "جك معدني (Metal jig)", desc: "قطعة معدنية ثقيلة نحيفة بكلّاب مساعد عند الرأس. تُرمى أبعد من أي طعم وتغوص بسرعة.", q: "metal jig shore jigging casting"},
  paddle:      {name: "سوفت بيت بذيل متحرّك (Paddle tail)", desc: "جسم مطاطي بذيل عريض يهتز عند السحب، يُركّب على رأس رصاص فيه الكلّاب.", q: "paddle tail soft plastic jig head saltwater"},
  weedless:    {name: "سوفت بيت بكلّاب مخفي (Weedless)", desc: "جسم مطاطي بكلّاب معقوف يُخفى رأسه في ظهر الطعم، فلا يعلق بالصخور والأعشاب.", q: "weedless soft plastic rigging offset hook"},
  spoon:       {name: "ملعقة (Spoon)", desc: "صفيحة معدنية مقعّرة تتأرجح وتلمع عند السحب، بسيطة وفعّالة.", q: "spoon lure saltwater fishing"}
};
const ytSearch = q => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
let _uid = 0;
const uniq = svg => { const u = "_" + (++_uid); return svg.replace(/id="([a-z0-9]+)"/g, 'id="$1' + u + '"').replace(/url\(#([a-z0-9]+)\)/g, 'url(#$1' + u + ')'); };

/* Real lure photos — Wikimedia Commons (free licences; credit shown under each photo) */
const LURE_PHOTOS = {
  popper:      {file: "GT Poppers - Fishing Lures by Robert Stone.jpg", by: "", lic: ""},
  stickbait:   {file: "Zaraspook.jpg", by: "", lic: ""},
  float_minnow:{file: "Wobbler 2008 G1.jpg", by: "George Chernilevsky", lic: "ملكية عامة"},
  sink_minnow: {file: "Rapala fishing lure.jpg", by: "Ankara", lic: "CC BY-SA 3.0"},
  jig:         {file: "Pilker 1.JPG", by: "Gordito1869", lic: "CC BY 3.0"},
  paddle:      {file: "Bluefox Vibrotail jig fishing lure 29 gr.jpg", by: "", lic: "CC BY 4.0"},
  spoon:       {file: "Spoon-bait 2008 G1.jpg", by: "George Chernilevsky", lic: "ملكية عامة"}
};
const _cImg = (f, w) => "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(f.replace(/ /g, "_")) + "?width=" + w;
const _cPage = f => "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(f.replace(/ /g, "_"));
function lureMedia(key) {
  const mine = (typeof MYPHOTOS !== "undefined") && MYPHOTOS["lure_" + key];
  const svg = uniq(LURE_SVG[key]).replace("<svg ", '<svg class="fallback" ');
  if (mine) return `<div class="lph"><img src="${mine}" alt=""></div>`;
  const ph = LURE_PHOTOS[key];
  if (ph) return `<div class="lph"><img src="${_cImg(ph.file, 400)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.classList.add('err')">${svg}</div>`;
  return `<div class="lph err">${svg}</div>`;
}
function lureCredit(key) {
  if ((typeof MYPHOTOS !== "undefined") && MYPHOTOS["lure_" + key]) return `صورتك الخاصة · <a href="#" data-rmphoto="lure_${key}" style="color:var(--acc)">إعادة الصورة الأصلية</a>`;
  const ph = LURE_PHOTOS[key];
  if (!ph) return "رسم توضيحي — أضف صورة طعمك";
  return `صورة: ${ph.by ? ph.by + " · " : ""}${ph.lic ? ph.lic + " · " : ""}<a href="${_cPage(ph.file)}" target="_blank" rel="noopener" style="color:var(--acc)">Wikimedia Commons</a>`;
}
const LURE_GAL = {popper: "popper fishing lure", stickbait: "stickbait topwater lure", float_minnow: "minnow crankbait lure", sink_minnow: "sinking minnow lure", jig: "metal jig lure", paddle: "soft plastic paddle tail lure", weedless: "soft plastic lure weedless hook", spoon: "spoon fishing lure"};
const LURE_CATS = {popper: ["Poppers (fishing lures)"], float_minnow: ["Crankbaits"], sink_minnow: ["Crankbaits"], jig: ["Jigs (fishing)"], paddle: ["Soft plastic lures"], weedless: ["Soft plastic lures"], spoon: ["Spoon lures"]};
function lureCard(key, compact) {
  const L = LURES[key];
  return `<div class="lure"><div class="lureimg">${lureMedia(key)}<div class="lcred">${lureCredit(key)}</div></div>
    <div style="flex:1"><div style="font-weight:700">${L.name}</div>
    ${compact ? "" : `<div class="mute">${L.desc}</div>`}
    <a href="#" data-lmotion="${key}" style="color:var(--acc2);font-size:13px;font-weight:700">🎬 شاهد حركته في الماء</a><br>
    ${window.Gallery ? `<a href="#" data-gal="${encodeURIComponent(JSON.stringify(Gallery.spec(L.name, LURE_GAL[key] || L.q, LURE_CATS[key] || [], {web: ytSearch(L.q)})))}" style="color:var(--acc);font-size:13px;font-weight:700">📷 صور أكثر لهذا الطعم</a><br>` : ""}
    <a href="${ytSearch(L.q)}" target="_blank" rel="noopener" style="color:var(--acc);font-size:13px">▶ شاهد أمثلة وطريقة الاستعمال</a><br>
    <label style="color:var(--acc);font-size:13px;cursor:pointer">📷 أضف صورة طعمك<input type="file" accept="image/*" data-addphoto="lure_${key}" style="display:none"></label></div></div>`;
}

/* ======================= KNOT DIAGRAMS ======================= */
/* colours: main line (braid/standing) teal, tag end orange, leader white, metal grey */
const KC = {main: "#2ec4b6", tag: "#ffb347", leader: "#e8f1f8", metal: "#9aa8b4", arrow: "#ff6b6b"};
const kSvg = inner => uniq(`<svg viewBox="0 0 300 130" class="kstep">${inner}</svg>`);
const kLine = (d, c = KC.main, w = 4) => `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const kArrow = d => `<path d="${d}" stroke="${KC.arrow}" stroke-width="2" fill="none" stroke-dasharray="5 4" marker-end="url(#ah)"/>`;
const kDefs = `<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${KC.arrow}"/></marker></defs>`;
const kTxt = (x, y, t, c = "#8fa8bf") => `<text x="${x}" y="${y}" fill="${c}" font-size="11" font-family="Tajawal" text-anchor="middle">${t}</text>`;
/* hook/lure eye at (x,y), shank to the left */
const kHook = (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="none" stroke="${KC.metal}" stroke-width="4"/>
  <path d="M${x - 9} ${y} H${x - 70} q-22 0 -22 22 q0 18 18 18 l6 -8" stroke="${KC.metal}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
const coils = (x0, y, n, w, ry, c) => { let s = ""; for (let i = 0; i < n; i++) { const x = x0 + i * w; s += `<ellipse cx="${x}" cy="${y}" rx="${w * 0.55}" ry="${ry}" fill="none" stroke="${c}" stroke-width="3"/>`; } return s; };
const legend = (items) => `<g font-family="Tajawal" font-size="10">${items.map((it, i) => `<rect x="${292 - i * 78 - 12}" y="6" width="12" height="4" fill="${it[1]}"/><text x="${292 - i * 78 - 16}" y="11" fill="#8fa8bf" text-anchor="end">${it[0]}</text>`).join("")}</g>`;
const LEG_LINE = "";
const LEG_JOIN = "";

const KNOT_STEPS = {
  palomar: [
    {t: "اثنِ آخر 15 سم من القائد لتصنع خيطاً مزدوجاً على شكل حرف U.",
     s: kDefs + LEG_LINE + kLine("M20 60 H170", KC.main) + kLine("M20 72 H170", KC.tag) + kLine("M170 60 q14 6 0 12", KC.main) + kTxt(190, 100, "حلقة مزدوجة")},
    {t: "أدخل رأس الحلقة المزدوجة في عين الطعم أو الكلّاب.",
     s: kDefs + LEG_LINE + kHook(230, 66) + kLine("M20 60 H245", KC.main) + kLine("M20 72 H245", KC.tag) + kLine("M245 60 q14 6 0 12", KC.main) + kArrow("M150 40 H220")},
    {t: "اعقد عقدة بسيطة رخوة بالخيطين معاً (كأنك تعقد خيطاً واحداً)، واترك الطعم معلّقاً في الحلقة.",
     s: kDefs + LEG_LINE + kHook(250, 50) + kLine("M20 60 H90 q30 -40 50 -5 q15 30 -20 30 q-25 0 -5 -30 L250 50", KC.main) + kLine("M20 70 H92 q30 -36 54 -3 q12 32 -26 30", KC.tag) + kLine("M140 100 q60 20 115 -40", KC.main) + kTxt(110, 18, "عقدة بسيطة رخوة — لا تشدّ بعد")},
    {t: "مرّر الطعم أو الكلّاب كله من داخل الحلقة الكبيرة.",
     s: kDefs + LEG_LINE + kLine("M20 60 H110", KC.main) + kLine("M20 70 H110", KC.tag) + `<ellipse cx="125" cy="65" rx="16" ry="12" fill="none" stroke="${KC.main}" stroke-width="4"/>` + kLine("M140 62 q60 -50 120 0 q-60 50 -120 6", KC.main) + kHook(250, 66) + kArrow("M250 30 Q200 0 140 40")},
    {t: "بلّل العقدة، ثم اسحب الخيط الرئيسي والطرف معاً حتى تنقبض فوق العين، واقطع الطرف الزائد.",
     s: kDefs + LEG_LINE + kHook(230, 65) + kLine("M20 65 H205", KC.main) + `<rect x="200" y="56" width="20" height="18" rx="6" fill="${KC.main}"/>` + kLine("M200 70 l-14 10", KC.tag) + kArrow("M120 45 H40") + kTxt(110, 22, "عقدة مضغوطة قرب العين")}
  ],
  clinch: [
    {t: "أدخل طرف الخيط في عين الكلّاب واسحب منه 15 سم تقريباً.",
     s: kDefs + LEG_LINE + kHook(200, 60) + kLine("M20 60 H191", KC.main) + kLine("M209 60 q30 0 30 20 q0 20 -40 20 H90", KC.tag)},
    {t: "لُفّ الطرف حول الخيط الرئيسي 5 إلى 7 لفّات (أقل مع الخيط الثخين).",
     s: kDefs + LEG_LINE + kHook(230, 60) + kLine("M20 60 H221", KC.main) + coils(110, 60, 6, 14, 10, KC.tag) + kLine("M239 60 q25 0 25 20 q0 18 -40 18 H185 q-10 0 -10 -28", KC.tag) + kLine("M103 60 q-10 20 -30 24", KC.tag) + kTxt(150, 118, "لفّات حول الخيط الرئيسي")},
    {t: "أدخل الطرف في الحلقة الصغيرة المتكوّنة قرب العين.",
     s: kDefs + LEG_LINE + kHook(230, 60) + kLine("M20 60 H221", KC.main) + coils(110, 60, 6, 14, 10, KC.tag) + `<ellipse cx="200" cy="72" rx="14" ry="10" fill="none" stroke="${KC.tag}" stroke-width="3"/>` + kLine("M103 60 q-20 40 50 40 q40 0 47 -28", KC.tag) + kArrow("M150 120 Q190 115 198 85") + kTxt(200, 98, "الحلقة الصغيرة")},
    {t: "ثم أعد الطرف من داخل الحلقة الكبيرة التي تكوّنت للتو (هذه خطوة «المحسّنة»).",
     s: kDefs + LEG_LINE + kHook(230, 60) + kLine("M20 60 H221", KC.main) + coils(110, 60, 6, 14, 10, KC.tag) + kLine("M103 60 q-20 40 50 40 q40 0 47 -28 q-20 -30 -60 -20", KC.tag) + kArrow("M160 30 Q120 20 100 50") + kTxt(110, 122, "الحلقة الكبيرة")},
    {t: "بلّل العقدة، واسحب الخيط الرئيسي ببطء حتى تنقبض اللفّات على شكل حلزون مرتّب، ثم اقطع الطرف.",
     s: kDefs + LEG_LINE + kHook(230, 60) + kLine("M20 60 H221", KC.main) + coils(175, 60, 6, 7, 8, KC.tag) + kArrow("M110 40 H40") + kTxt(170, 100, "لفّات متراصّة")}
  ],
  loop: [
    {t: "اعقد عقدة بسيطة رخوة في القائد على بعد 10 سم تقريباً من طرفه، ولا تشدّها.",
     s: kDefs + LEG_LINE + kLine("M20 70 H100 q30 -45 50 -5 q12 28 -24 24 q-20 -4 0 -26 L200 60", KC.main) + kLine("M200 60 H270", KC.tag) + kTxt(130, 118, "عقدة بسيطة رخوة")},
    {t: "أدخل الطرف في عين الطعم، ثم أعده من داخل العقدة البسيطة من الجهة نفسها التي خرج منها.",
     s: kDefs + LEG_LINE + kHook(270, 50) + kLine("M20 70 H100 q30 -45 50 -5 q12 28 -24 24 q-20 -4 0 -26 L180 60 L261 50", KC.main) + kLine("M279 50 q14 30 -40 34 H140", KC.tag) + kArrow("M200 100 Q160 105 140 88")},
    {t: "لُفّ الطرف حول الخيط الرئيسي: 4 لفّات للقائد من 15 إلى 40 رطلاً، و3 لفّات للأثخن.",
     s: kDefs + LEG_LINE + kHook(270, 50) + kLine("M20 70 H261", KC.main) + `<ellipse cx="190" cy="64" rx="14" ry="10" fill="none" stroke="${KC.main}" stroke-width="4"/>` + coils(70, 70, 4, 16, 10, KC.tag) + kLine("M279 50 q14 30 -40 34 H190 q-60 0 -100 -14", KC.tag) + kTxt(95, 108, "4 لفّات")},
    {t: "أعد الطرف إلى داخل العقدة البسيطة من الجهة نفسها التي خرج منها أول مرة.",
     s: kDefs + LEG_LINE + kHook(270, 50) + kLine("M20 70 H261", KC.main) + `<ellipse cx="190" cy="64" rx="14" ry="10" fill="none" stroke="${KC.main}" stroke-width="4"/>` + coils(70, 70, 4, 16, 10, KC.tag) + kLine("M120 70 q30 40 70 -6", KC.tag) + kArrow("M140 110 Q180 110 188 80")},
    {t: "بلّل العقدة، واسحب الخيط الرئيسي ببطء ثم الطرف لإحكامها، فتبقى حلقة صغيرة حرّة عند العين. اقطع الطرف.",
     s: kDefs + LEG_LINE + kHook(270, 60) + kLine("M20 60 H220", KC.main) + `<rect x="210" y="52" width="18" height="16" rx="6" fill="${KC.main}"/>` + `<ellipse cx="246" cy="60" rx="20" ry="10" fill="none" stroke="${KC.main}" stroke-width="4"/>` + kTxt(246, 95, "حلقة حرّة 3–5 مم")}
  ],
  dbluni: [
    {t: "ضع طرف المضفّر وطرف القائد متداخلين بطول 20 سم تقريباً، كل واحد في اتجاه معاكس للآخر.",
     s: kDefs + LEG_JOIN + kLine("M10 58 H220", KC.main, 3) + kLine("M290 70 H80", KC.leader, 4) + kTxt(150, 105, "تداخل 20 سم")},
    {t: "بطرف القائد كوّن حلقة فوق الخيطين، ولُفّه داخلها حول الخيطين 4 إلى 5 لفّات، واشدده قليلاً.",
     s: kDefs + LEG_JOIN + kLine("M10 58 H220", KC.main, 3) + kLine("M290 70 H180", KC.leader, 4) + coils(100, 64, 5, 14, 13, KC.leader) + kLine("M180 70 q-10 -40 -90 -20", KC.leader, 4) + kTxt(130, 105, "عقدة القائد: 4–5 لفّات")},
    {t: "بطرف المضفّر افعل الشيء نفسه من الجهة الأخرى، لكن بعدد لفّات أكبر: 8 إلى 10 لفّات لأن المضفّر زلق.",
     s: kDefs + LEG_JOIN + kLine("M10 58 H120", KC.main, 3) + kLine("M290 70 H200", KC.leader, 4) + coils(60, 64, 5, 12, 12, KC.leader) + coils(160, 64, 9, 9, 11, KC.main) + kTxt(85, 105, "القائد") + kTxt(195, 105, "المضفّر: 8–10 لفّات")},
    {t: "بلّل العقدتين، ثم اسحب الخيطين الرئيسيين في اتجاهين متعاكسين، فتنزلق العقدتان وتلتقيان.",
     s: kDefs + LEG_JOIN + kLine("M10 64 H130", KC.main, 3) + kLine("M290 64 H170", KC.leader, 4) + coils(120, 64, 4, 9, 10, KC.leader) + coils(150, 64, 8, 6, 9, KC.main) + kArrow("M60 40 H15") + kArrow("M240 40 H285")},
    {t: "شدّ بقوة حتى تتلاصق العقدتان، ثم اقطع الطرفين الزائدين قريباً من العقدة.",
     s: kDefs + LEG_JOIN + kLine("M10 64 H140", KC.main, 3) + kLine("M290 64 H160", KC.leader, 4) + `<rect x="135" y="55" width="30" height="18" rx="7" fill="${KC.main}"/>` + kTxt(150, 105, "وصلة متينة")}
  ],
  fg: [
    {t: "شدّ المضفّر الخارج من البكرة شدّاً جيداً (اقفل الفرامل وثبّت القصبة، أو أمسك المضفّر بأسنانك).",
     s: kDefs + LEG_JOIN + kLine("M10 60 H290", KC.main, 3) + kArrow("M200 30 H285") + kTxt(150, 100, "المضفّر مشدود تماماً")},
    {t: "ضع القائد فوق المضفّر بزاوية مائلة، وأمسك طرفه بيدك الأخرى.",
     s: kDefs + LEG_JOIN + kLine("M10 60 H290", KC.main, 3) + kLine("M90 115 L230 30", KC.leader, 5) + kTxt(250, 110, "القائد بزاوية")},
    {t: "لُفّ المضفّر حول القائد بالتناوب: لفّة من فوقه ثم لفّة من تحته، فتتشابك على شكل ضفيرة. كرّر نحو 20 لفّة.",
     s: kDefs + LEG_JOIN + kLine("M30 70 H270", KC.leader, 6) + (() => { let s = ""; for (let i = 0; i < 9; i++) { const x = 80 + i * 18; s += kLine(`M${x} 50 L${x + 9} 90`, KC.main, 3) + kLine(`M${x + 9} 50 L${x} 90`, KC.main, 3); } return s; })() + kLine("M10 50 H80", KC.main, 3) + kTxt(150, 118, "نمط متصالب: فوق، تحت، فوق…")},
    {t: "ثبّت اللفّات مؤقتاً بعقدة نصفية واحدة بالمضفّر حول القائد، ثم بلّلها واشدد بقوة متزايدة حتى تقبض على القائد.",
     s: kDefs + LEG_JOIN + kLine("M30 65 H270", KC.leader, 6) + `<rect x="100" y="55" width="110" height="20" rx="6" fill="none" stroke="${KC.main}" stroke-width="3"/>` + (() => { let s = ""; for (let i = 0; i < 14; i++) { const x = 104 + i * 7.5; s += kLine(`M${x} 56 L${x + 4} 74`, KC.main, 2); } return s; })() + kArrow("M80 40 H25") + kArrow("M230 40 H285") + kTxt(155, 105, "شدّ حتى يتغيّر لون اللفّات")},
    {t: "اعقد 6 إلى 8 عقد نصفية متتالية بالمضفّر حول القائد والمضفّر معاً، متناوبة الاتجاه.",
     s: kDefs + LEG_JOIN + kLine("M10 65 H290", KC.leader, 6) + `<rect x="150" y="55" width="80" height="20" rx="6" fill="${KC.main}" opacity=".85"/>` + coils(95, 65, 6, 9, 12, KC.main) + kTxt(120, 105, "عقد نصفية")},
    {t: "اقطع طرف القائد الزائد قريباً من العقدة، ثم اعقد عقدتين أو ثلاثاً حول المضفّر وحده، واقطع الطرف.",
     s: kDefs + LEG_JOIN + kLine("M10 65 H95", KC.main, 3) + `<rect x="95" y="57" width="150" height="16" rx="8" fill="${KC.main}"/>` + kLine("M245 65 H290", KC.leader, 6) + kTxt(170, 105, "وصلة نحيفة تمرّ من الحلقات بسهولة")}
  ]
};

const KNOT_VIDEOS = {
  fg:      [["فيديو FG بالإنجليزية", "FG knot tutorial braid to leader"], ["فيديو بالعربية", "عقدة FG ربط المضفر بالليدر"]],
  dbluni:  [["فيديو Double Uni بالإنجليزية", "double uni knot braid to fluorocarbon"], ["فيديو بالعربية", "عقدة يوني المزدوجة ربط الخيط"]],
  palomar: [["فيديو Palomar بالإنجليزية", "palomar knot how to tie"], ["فيديو بالعربية", "عقدة بالومار"]],
  loop:    [["فيديو Non-Slip Loop بالإنجليزية", "non slip loop knot lure kreh"], ["فيديو بالعربية", "عقدة اللوب للطعم الصناعي"]],
  clinch:  [["فيديو Improved Clinch بالإنجليزية", "improved clinch knot"], ["فيديو بالعربية", "عقدة الكلينش المحسنة"]]
};
const KNOT_REF = {
  clinch: ["AnimatedKnots — رسوم متحركة خطوة بخطوة", "https://www.animatedknots.com/improved-clinch-knot"]
};
