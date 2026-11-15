/* Specter Angler BH — in-app photo galleries (freely-licensed Wikimedia Commons photos), saved on the phone for offline use */
"use strict";
(function () {
  const API = "https://commons.wikimedia.org/w/api.php";
  const CACHE = "sab-gallery-v1", MAX = 8;
  const BAD = /\b(1[5-8]\d\d|19[0-5]\d)\b|book|page|catalog|catalogue|advert|poster|logo|map|diagram|drawing|patent|stamp|coat of arms|flag/i;

  const keyOf = spec => "sab_gal_" + (spec.q + "|" + (spec.cats || []).join(",")).toLowerCase().replace(/[^a-z0-9|,]+/g, "_").slice(0, 120);
  const strip = html => { const d = document.createElement("div"); d.innerHTML = html || ""; return (d.textContent || "").replace(/\s+/g, " ").trim(); };

  async function search(q) {
    const u = `${API}?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=16&gsrsearch=${encodeURIComponent(q)}&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=720&iiextmetadatafilter=LicenseShortName|Artist|ImageDescription|ObjectName`;
    const r = await fetch(u); const j = await r.json();
    const pages = Object.values((j.query && j.query.pages) || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
    return pages.map(p => {
      const ii = p.imageinfo && p.imageinfo[0]; if (!ii || !/jpeg|png|webp/.test(ii.mime || "")) return null;
      const m = ii.extmetadata || {}, title = p.title.replace(/^File:/, "");
      if (BAD.test(title)) return null;
      return {title, src: ii.thumburl || ii.url, page: ii.descriptionurl, lic: strip(m.LicenseShortName && m.LicenseShortName.value), by: strip(m.Artist && m.Artist.value).slice(0, 60),
        desc: strip((m.ImageDescription && m.ImageDescription.value) || (m.ObjectName && m.ObjectName.value) || title.replace(/\.\w+$/, "")).slice(0, 110)};
    }).filter(Boolean);
  }

  async function photos(spec) {
    const k = keyOf(spec);
    try { const c = JSON.parse(localStorage.getItem(k)); if (c && c.items && c.items.length) return c.items; } catch (e) {}
    const qs = [];
    if (spec.cats && spec.cats.length) qs.push(`incategory:${spec.cats.map(c => '"' + c.replace(/ /g, "_") + '"').join("|")} filetype:bitmap`);
    qs.push(`${spec.q} filetype:bitmap`);
    if (spec.q2) qs.push(`${spec.q2} filetype:bitmap`);
    let items = [];
    for (const q of qs) {
      try { const got = await search(q); got.forEach(g => { if (!items.some(x => x.title === g.title)) items.push(g); }); } catch (e) {}
      if (items.length >= MAX) break;
    }
    items = items.slice(0, MAX);
    if (items.length) try { localStorage.setItem(k, JSON.stringify({t: Date.now(), items})); } catch (e) {}
    return items;
  }

  // image bytes are kept in Cache Storage so they show without internet (works in the website and in the Android app)
  async function imgURL(src) {
    try {
      const c = await caches.open(CACHE); let r = await c.match(src);
      if (!r) { r = await fetch(src, {mode: "cors"}); if (r.ok) await c.put(src, r.clone()); }
      if (r.type === "opaque") return src;
      return URL.createObjectURL(await r.blob());
    } catch (e) { return src; }
  }

  async function open(spec) {
    openModal(`<h2>📷 ${spec.t}</h2><div class="gal-load"><span class="spin"></span> جارٍ تحضير الصور…</div>`);
    const items = await photos(spec);
    const body = document.getElementById("modalBody"); if (!body) return;
    if (!items.length) {
      body.innerHTML = `<h2>📷 ${spec.t}</h2><div class="banner">${navigator.onLine ? "لم أجد صوراً مناسبة لهذا الصنف." : "لا يوجد إنترنت، ولم تُحفظ صور هذا الصنف من قبل. افتحه مرة واحدة وأنت متصل، أو نزّل كل الصور من صفحة «عن التطبيق»."}</div>
        ${spec.web ? `<a class="btn sec sm" href="${spec.web}" target="_blank" rel="noopener" style="text-decoration:none">🔎 ابحث في الإنترنت ↗</a>` : ""}`;
      return;
    }
    body.innerHTML = `<h2>📷 ${spec.t}</h2>${spec.note ? `<div class="mute" style="margin-bottom:6px">${spec.note}</div>` : ""}
      <div class="galx" dir="ltr">${items.map((it, i) => `<figure class="gals"><div class="galimg"><img data-gi="${i}" alt=""></div>
        <figcaption><div class="gald">${it.desc.replace(/</g, "&lt;")}</div><div class="galc">📸 ${it.by ? it.by.replace(/</g, "&lt;") + " · " : ""}${it.lic || "رخصة حرّة"} · <a href="${it.page}" target="_blank" rel="noopener">Wikimedia Commons</a></div></figcaption></figure>`).join("")}</div>
      <div class="galdots" dir="ltr">${items.map((_, i) => `<i data-gd="${i}" class="${i ? "" : "on"}"></i>`).join("")}</div>
      <div class="mute" style="font-size:12px;margin-top:6px">اسحب يميناً ويساراً بين الصور. صور حرّة الاستخدام من ويكيميديا لتوضيح الصنف، وليست بالضرورة الموديل نفسه.</div>
      ${spec.web ? `<a class="btn sec sm" href="${spec.web}" target="_blank" rel="noopener" style="text-decoration:none;margin-top:8px">🔎 ابحث عن المنتج نفسه وسعره ↗</a>` : ""}`;
    const imgs = body.querySelectorAll("[data-gi]");
    imgs.forEach(async im => { const it = items[+im.dataset.gi]; im.src = await imgURL(it.src); im.onload = () => im.parentNode.classList.add("ok"); });
    const sx = body.querySelector(".galx"), dots = body.querySelectorAll("[data-gd]");
    sx.addEventListener("scroll", () => { const i = Math.round(sx.scrollLeft / sx.clientWidth); dots.forEach((d, j) => d.classList.toggle("on", j === i)); }, {passive: true});
    dots.forEach(d => d.onclick = () => sx.scrollTo({left: +d.dataset.gd * sx.clientWidth, behavior: "smooth"}));
  }

  /* ---------- every gallery in the app (used by "download all") ---------- */
  const REG = new Map();
  function spec(t, q, cats, extra) { const s = Object.assign({t, q, cats: cats || []}, extra || {}); REG.set(keyOf(s), s); return s; }
  const enc = s => encodeURIComponent(JSON.stringify(s));
  function btn(s, label) { return `<button class="gpl galbtn" data-gal="${enc(s)}">${label || "📷 أمثلة"}</button>`; }
  document.addEventListener("click", e => { const b = e.target.closest("[data-gal]"); if (!b) return; e.preventDefault(); try { open(JSON.parse(decodeURIComponent(b.dataset.gal))); } catch (x) {} });

  async function prefetchAll(onProgress) {
    const all = [...REG.values()]; let done = 0, imgs = 0;
    for (const s of all) {
      try { const items = await photos(s); for (const it of items) { await imgURL(it.src); imgs++; } } catch (e) {}
      done++; onProgress && onProgress(done, all.length, imgs);
    }
    return imgs;
  }
  async function cachedCount() { try { const c = await caches.open(CACHE); return (await c.keys()).length; } catch (e) { return 0; } }

  window.Gallery = {open, spec, btn, prefetchAll, cachedCount};
})();
