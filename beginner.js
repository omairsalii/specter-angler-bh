/* Specter Angler BH — beginner mode: tappable terms + first-run tour */
"use strict";
(function () {
  const D = "[\\u064B-\\u0652\\u0640]*";                 // optional Arabic diacritics / tatweel
  const AR = "\\u0621-\\u064A";
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const loose = w => [...w].map(ch => esc(ch) + D).join("");

  const TERMS = [
    {t: "المضفّر (PE)", f: ["مضفر"], d: "خيط مجدول من ألياف رفيعة. قوي جداً مع قطر صغير، ولا يتمدّد، فتحسّ بالضربة فوراً. يُوصل في آخره بقائد."},
    {t: "القائد (Leader)", f: ["قائد"], d: "قطعة خيط من الفلوروكربون بطول متر إلى مترين، تُوصل بين المضفّر والطعم. تقاوم احتكاك الصخور وأسنان السمك، وتكاد لا تُرى في الماء."},
    {t: "الفلوروكربون", f: ["فلوروكربون"], d: "نوع خيط يكاد لا يُرى في الماء ويقاوم الاحتكاك، لذلك يُستعمل قائداً."},
    {t: "الدراغ (الفرامل)", f: ["دراغ"], d: "مقبض في البكرة يحدّد القوة التي تسحب عندها السمكة الخيط. إن كان مشدوداً جداً انقطع الخيط، وإن كان رخواً هربت السمكة."},
    {t: "الكلّاب", f: ["كلاب"], d: "الخطّاف المعدني المعقوف الذي تعلق فيه السمكة."},
    {t: "المنو (Minnow)", f: ["منو"], d: "طعم صلب على شكل سمكة صغيرة، في مقدّمته لسان يجعله يغوص ويتمايل عند السحب."},
    {t: "الجك (Jig)", f: ["جك"], d: "طعم معدني ثقيل ونحيف، يُرمى بعيداً ويغوص بسرعة."},
    {t: "السوفت بيت (Soft bait)", f: ["سوفت بيت"], d: "طعم مطاطي ليّن يُركّب على رأس رصاص فيه الكلّاب."},
    {t: "البوبر (Popper)", f: ["بوبر"], d: "طعم يطفو على السطح بوجه مقعّر، يُحدث فقاعات وصوتاً حين تنتره."},
    {t: "الستكبيت (Stickbait)", f: ["ستكبيت"], d: "طعم سطحي طويل بلا لسان، يتمايل يميناً ويساراً على السطح."},
    {t: "الرطل (lb)", f: ["رطل", "رطلا"], d: "وحدة قوة الخيط: الخيط 20 رطلاً يتحمّل نحو 9 كيلوغرامات قبل أن ينقطع."},
    {t: "المدّ", f: ["مد"], d: "ارتفاع ماء البحر. يحدث مرتين تقريباً في اليوم، ومعه يقترب السمك من الشاطئ."},
    {t: "الجزر", f: ["جزر"], d: "انخفاض ماء البحر بعد المدّ. حركة الماء في الحالتين تحرّك الطعام وتنشّط السمك."},
    {t: "الركود", f: ["ركود"], d: "فترة قصيرة عند ذروة المدّ أو الجزر يكاد الماء فيها لا يتحرك، والصيد فيها أضعف عادةً."},
    {t: "الكاسر", f: ["كاسر", "كاسرات"], d: "حاجز صخري في البحر يكسر الأمواج. الصخور تجمع صغار السمك فيأتي المفترس، لذلك هو من أفضل أماكن الصيد."},
    {t: "الفشت", f: ["فشت", "فشوت"], d: "منطقة شعاب ضحلة في البحر، يكثر فيها السمك."},
    {t: "العقدة النصفية", f: ["عقدة نصفية", "عقد نصفية"], d: "لفّة بسيطة بطرف الخيط حول خيط آخر ثم إدخاله في الحلقة، تُستعمل لتثبيت العُقد."},
    {t: "الخشخيشة (Rattle)", f: ["خشخيشة"], d: "كرات صغيرة داخل الطعم تُصدر صوتاً، يجذب السمك حين يكون الماء عكراً."},
    {t: "السلك المعدني (Wire)", f: ["سلك", "سلكا"], d: "قائد قصير من المعدن يوضع قبل الطعم، لأن أسنان الكنعد والباراكودا تقطع الخيط العادي."},
    {t: "الشارتروز", f: ["شارتروز"], d: "لون أخضر مصفرّ فاقع، يُرى جيداً في الماء العكر."},
    {t: "الطعم الطبيعي", f: ["صغار السمك"], d: "الأسماك الصغيرة كالسردين التي يأكلها المفترس. حيث تراها يكون المفترس قريباً."}
  ];
  TERMS.forEach(T => {
    const alts = T.f.map(loose).join("|");
    T.re = new RegExp(`(^|[^${AR}])((?:[وبلف]?ال|[وبلف])?(?:${alts}))(?=$|[^${AR}])`);
  });

  const SKIP = "[data-noterm],a,button,label,input,select,textarea,svg,text,h2,.term,.chip,.seg,nav";
  function markIn(root) {
    const used = new Set();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => (!n.nodeValue.trim() || n.parentElement.closest(SKIP)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      let text = node.nodeValue, hit = null;
      for (let i = 0; i < TERMS.length; i++) {
        if (used.has(i)) continue;
        const m = TERMS[i].re.exec(text);
        if (m && (!hit || m.index < hit.m.index)) hit = {i, m};
      }
      if (!hit) continue;
      used.add(hit.i);
      const start = hit.m.index + hit.m[1].length, word = hit.m[2];
      const span = document.createElement("span");
      span.className = "term"; span.dataset.term = hit.i; span.textContent = word;
      const after = node.splitText(start); after.nodeValue = after.nodeValue.slice(word.length);
      node.parentNode.insertBefore(span, after);
    }
  }
  function unmark(root) {
    root.querySelectorAll(".term").forEach(s => s.replaceWith(document.createTextNode(s.textContent)));
    root.normalize();
  }
  const ROOTS = ["#rigOut", "#learnOut", "#modalBody", "#nowFactors", "#tipCard", "#fishList"];
  let busy = false;
  function apply() {
    if (busy) return; busy = true;
    const on = typeof isBeg === "function" && isBeg();
    ROOTS.forEach(sel => { const el = document.querySelector(sel); if (!el) return; unmark(el); if (on) markIn(el); });
    busy = false;
  }
  let timer = null;
  const obs = new MutationObserver(() => { if (busy) return; clearTimeout(timer); timer = setTimeout(apply, 60); });
  obs.observe(document.querySelector("main"), {childList: true, subtree: true});
  obs.observe(document.getElementById("modal"), {childList: true, subtree: true});
  document.getElementById("begToggle").addEventListener("change", () => setTimeout(apply, 80));

  /* tap a term → explanation bubble */
  const tip = document.createElement("div");
  tip.id = "termTip";
  document.body.appendChild(tip);
  document.addEventListener("click", e => {
    const s = e.target.closest(".term");
    if (s) {
      e.preventDefault(); e.stopPropagation();
      const T = TERMS[+s.dataset.term];
      tip.innerHTML = `<b>${T.t}</b><div>${T.d}</div><small>اضغط في أي مكان للإغلاق</small>`;
      tip.classList.add("on");
      return;
    }
    if (tip.classList.contains("on")) tip.classList.remove("on");
  }, true);

  /* first-run tour */
  const TOUR = [
    {tab: null, t: "أهلاً بك في Specter Angler 🎣", d: "جولة سريعة في دقيقة تعرّفك بأقسام التطبيق. ويمكنك إعادتها لاحقاً من «عن التطبيق»."},
    {tab: "map", t: "الخريطة", d: "اضغط «📍 موقعي» لترى مكانك، و«مسح الساحل» ليقترح التطبيق نقاط الصيد. الرقم الكبير مؤشر الصيد الآن، والأعمدة الملوّنة أفضل ساعات اليوم."},
    {tab: "rig", t: "ماذا أربط؟", d: "اختر ما تراه من صفاء الماء والإضاءة والقاع، فيقترح عليك الطعم بصورته ولونه ووزنه، والخيط والعقدة المناسبة."},
    {tab: "fish", t: "الأسماك", d: "صور أشهر أسماك البحرين، وكيف تميّزها، وتحذيراتها. وفيها تنبيه بالأنواع الممنوع صيدها في موسمها."},
    {tab: "learn", t: "تعلّم", d: "العُقد خطوة بخطوة مع فيديو، ودليل الطُّعوم، ودروس قصيرة في قراءة البحر والسلامة."},
    {tab: "log", t: "سجلّي", d: "سجّل كل رحلة حتى لو لم تصد شيئاً. يحفظ التطبيق مكانها وظروف البحر، ويتعلّم مع الوقت ما ينجح معك."},
    {tab: null, t: "وضع المبتدئ", d: "وهو مفعّل الآن: الكلمات التي تحتها خط منقّط مثل <span class=\"term\" data-term=\"1\">القائد</span> اضغط عليها ليظهر معناها. تستطيع إطفاءه من الأعلى حين تتمرّس."}
  ];
  function goTab(v) { const b = [...document.querySelectorAll("#tabs button")].find(x => x.dataset.v === v); if (b) b.click(); }
  function showTour(i = 0) {
    document.querySelectorAll("#tabs button").forEach(b => b.classList.remove("pulse"));
    const st = TOUR[i];
    if (st.tab) { goTab(st.tab); const b = [...document.querySelectorAll("#tabs button")].find(x => x.dataset.v === st.tab); if (b) b.classList.add("pulse"); }
    let el = document.getElementById("tour");
    if (!el) { el = document.createElement("div"); el.id = "tour"; document.body.appendChild(el); }
    el.innerHTML = `<div class="tcard"><div class="mute">${i + 1} من ${TOUR.length}</div><h2>${st.t}</h2><p>${st.d}</p>
      <div class="row"><button class="btn" id="tNext">${i < TOUR.length - 1 ? "التالي" : "ابدأ"}</button>${i < TOUR.length - 1 ? '<button class="btn sec" id="tSkip">تخطَّ الجولة</button>' : ""}</div></div>`;
    el.style.display = "block";
    const end = () => { el.style.display = "none"; document.querySelectorAll("#tabs button").forEach(b => b.classList.remove("pulse")); goTab("map"); try { localStorage.setItem("sab_toured", "1"); } catch (e) {} };
    document.getElementById("tNext").onclick = () => i < TOUR.length - 1 ? showTour(i + 1) : end();
    const sk = document.getElementById("tSkip"); if (sk) sk.onclick = end;
  }
  window.startTour = () => showTour(0);
  let toured = null; try { toured = localStorage.getItem("sab_toured"); } catch (e) {}
  if (!toured && typeof isBeg === "function" && isBeg()) setTimeout(() => showTour(0), 900);
  setTimeout(apply, 300);
})();
