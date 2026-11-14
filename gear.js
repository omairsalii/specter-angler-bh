/* Specter Angler BH — gear guide (rods, reels, lines), ready setups, and "my gear" */
"use strict";

const GEAR_BASICS = [
  {t: "القصبة (الصنارة)", b: [
    "<b>الطول:</b> للصيد من الشاطئ بالطعم الصناعي يناسبك بين 2.4 و3 أمتار (8 إلى 10 أقدام). الأطول يرمي أبعد، والأقصر أخف وأدق.",
    "<b>وزن الرمي (Lure weight / Casting weight):</b> أهم رقم مكتوب على القصبة، مثل 15–40g. لا ترمِ طعماً أثقل من الحد الأعلى حتى لا تنكسر القصبة.",
    "<b>رقم الخيط (PE):</b> مثل PE 0.8–2، وهو مدى المضفّر المناسب للقصبة.",
    "<b>الحركة (Action):</b> «Regular Fast» شائعة في قصبات الشاطئ، توازن بين الرمي البعيد وامتصاص ضربة السمكة.",
    "<b>عدد القطع:</b> القطعتان أقوى، والأربع قطع أسهل في الحمل والسفر."]},
  {t: "البكرة (المكينة)", b: [
    "<b>المقاس:</b> الرقم مثل 2500 أو 4000 يدل على حجم البكرة. للشاطئ: 2500–3000 للخفيف، و3000–4000 للمتوسط، و4000–5000 للكاسرات والسمك الكبير.",
    "<b>مقاومة ماء البحر:</b> اختر بكرة مصمّمة للماء المالح بجسم من الألمنيوم أو بإحكام ضد تسرّب الماء؛ ماء الخليج الحار والمالح يُتلف البكرات الرخيصة بسرعة.",
    "<b>قوة الفرامل (Max drag):</b> 7 كغم (15 رطلاً) أو أكثر تكفي لمعظم صيد الشاطئ.",
    "<b>العناية:</b> اغسل البكرة بماء عذب خفيف بعد كل رحلة، وجفّفها، ولا ترشّها بقوة."]},
  {t: "الخيوط", b: [
    "<b>المضفّر (PE):</b> الخيط الرئيسي على البكرة. رقمه يدل على سماكته: PE 0.8 ≈ 15 رطلاً، وPE 1 ≈ 18–20، وPE 1.5 ≈ 25، وPE 2 ≈ 30 تقريباً (تختلف قليلاً بين الماركات). اختر 8 جدائل (X8) لأنه أنعم وأبعد رمياً.",
    "<b>القائد (فلوروكربون):</b> متر إلى مترين في آخر الخيط. 15–20 رطلاً للماء الصافي والسمك الحذر، و25–30 للعام، و40–60 قرب الصخور والكاسرات.",
    "<b>النايلون (Mono):</b> رخيص ومتسامح للمبتدئ، لكنه يتمدّد ويضعف إحساسك بالضربة؛ المضفّر مع قائد أفضل للطعم الصناعي."]}
];

const GEAR_TIERS = {eco: "اقتصادي", mid: "متوسط", pro: "ممتاز"};
const GEAR_PRODUCTS = {
  reels: [
    {tier: "eco", name: "Shimano Sedona", note: "خيار اقتصادي من شيمانو، تصفه المراجعات بأنه من أكثر بكراتها قيمة مقابل السعر. اغسله جيداً بعد كل رحلة لأنه ليس محكم الإغلاق بالكامل."},
    {tier: "eco", name: "Penn Battle IV", note: "جسم ألمنيوم بالكامل وفرامل قوية، ومن أعلى البكرات تقييماً بين المشترين في فئته. ثقيل قليلاً لكنه متين جداً."},
    {tier: "eco", name: "Daiwa BG", note: "جسم ألمنيوم، ومعروف بمتانته في الماء المالح بسعر معقول."},
    {tier: "mid", name: "Daiwa BG MQ", note: "الجيل الأحدث من BG بجسم متماسك قطعة واحدة؛ ترقية واضحة في النعومة والإحكام."},
    {tier: "mid", name: "Penn Spinfisher VI", note: "بكرة إحكامها ضد الماء مصنّف (IPX5)، مناسبة للرذاذ والأمواج على الكاسرات."},
    {tier: "mid", name: "Shimano Nasci", note: "ناعمة وخفيفة ومريحة للرمي الطويل، لكنها ليست محكمة الإغلاق بالكامل؛ تحتاج عناية بعد كل رحلة."},
    {tier: "pro", name: "Shimano Stradic", note: "من أفضل بكرات الدوران في التقييمات عموماً، خفيفة ونعومتها عالية وفرامل حتى 9 كغم تقريباً."},
    {tier: "pro", name: "Daiwa Saltist / Saltiga", note: "فئة البحر الثقيلة من دايوا؛ للكاسرات والسمك الكبير والجكّات الثقيلة."}
  ],
  rods: [
    {tier: "eco", name: "Ugly Stik GX2 / Bigwater", note: "شبه غير قابلة للكسر، مثالية للمبتدئ، لكنها أثقل وأقل إحساساً بالضربة."},
    {tier: "eco", name: "Penn Squadron IV (9 قدم)", note: "قصبة شاطئ بسعر معقول، وزن رمي نحو 20–85 غراماً؛ مناسبة للجكّات المتوسطة والثقيلة."},
    {tier: "mid", name: "Major Craft Crostage (الجيل الثالث)", note: "القصبة اليابانية الأكثر انتشاراً لصيد الشاطئ بالطعم الصناعي في الخليج، بقطع Fuji. أختار لك منها الموديل المناسب في التجهيزات أدناه."},
    {tier: "mid", name: "Major Craft Crosride 3G", note: "من أفضل قصبات الشاطئ قيمة مقابل السعر، خفيفة جداً مع قوة كافية للسمك الكبير قرب الكاسرات."},
    {tier: "mid", name: "Daiwa Back Bay", note: "قصبة متوازنة ترمي بعيداً وظهرها قوي، لكن مدى وزن الرمي فيها محدود (حتى نحو 28 غراماً)."},
    {tier: "pro", name: "Shimano Teramar SE", note: "قصبة شيمانو للساحل بخامة متينة؛ متوفرة عبر المتاجر الإلكترونية في البحرين."},
    {tier: "pro", name: "Penn Carnage III / St. Croix Seage", note: "قصبات شاطئ احترافية خفيفة وقوية، للرمي البعيد ومواجهة السمك الكبير."}
  ],
  braid: [
    {tier: "eco", name: "KastKing SuperPower", note: "مضفّر اقتصادي مقبول للبداية."},
    {tier: "mid", name: "Daiwa J-Braid X8", note: "8 جدائل، ناعم ويرمي بعيداً، ويقيّمه كثيرون كأفضل مضفّر مقابل سعره."},
    {tier: "mid", name: "PowerPro (Super 8 Slick)", note: "اسم راسخ في المضفّرات، متين وموثوق في الماء المالح."},
    {tier: "pro", name: "Sufix 832", note: "من أفضل المضفّرات تقييماً للصيد من الشاطئ، حسّاس جداً ومقاوم للاحتكاك."},
    {tier: "pro", name: "Yo-Zuri Superbraid", note: "معروف بتحمّله القوي في ظروف البحر."}
  ],
  leader: [
    {tier: "eco", name: "Berkley Trilene 100% Fluorocarbon", note: "فلوروكربون اقتصادي جيد للبداية."},
    {tier: "mid", name: "Seaguar Blue Label", note: "أشهر قائد فلوروكربون للبحر، قوي ومقاوم جداً للاحتكاك، ويختفي في الماء."},
    {tier: "mid", name: "Sunline FC Sniper / FC Leader", note: "فلوروكربون ياباني ممتاز، ناعم ويسهل عقده."},
    {tier: "pro", name: "Seaguar Premier / Gold Label", note: "أنحف قوائد سيغوار وأنعمها؛ للماء الصافي والسمك الحذر."}
  ]
};

const GEAR_SETUPS = [
  {id: "light", name: "التجهيزة الخفيفة", for: "الفسكر، والسبيطي، والشعري الصغير، والصيد بطُعوم صغيرة قرب الشاطئ",
   rod: "2.4–2.7 م (8–9 أقدام)، وزن رمي نحو 5–30 غ، PE 0.6–1.2", reel: "مقاس 2500–3000", braid: "PE 0.6–0.8 (12–15 رطلاً)", leader: "فلوروكربون 12–16 رطلاً",
   lures: "سوفت بيت صغير، منو 7–10 سم، طُعوم 5–15 غ", eg: "مثال قصبة: Major Craft Crostage CRX-902SSJ (5–30 غ)"},
  {id: "mid", name: "التجهيزة المتوسطة (الأنسب لتبدأ بها)", for: "معظم صيد البحرين من الشاطئ: الشعري، والهامور الصغير، والجش، والملكة",
   rod: "2.7–2.9 م (9–9.6 أقدام)، وزن رمي نحو 15–50 غ، PE 0.8–2", reel: "مقاس 3000–4000", braid: "PE 1–1.2 (18–22 رطلاً)", leader: "فلوروكربون 20–30 رطلاً",
   lures: "منو، بوبر، ستكبيت، جكّات حتى 40 غ", eg: "مثال قصبة: Major Craft Crostage CRX-942SSJ (15–40 غ) أو Crosride 3G XR3-962M/LSJ (15–50 غ)"},
  {id: "heavy", name: "التجهيزة الثقيلة", for: "الكاسرات العميقة، والجش الكبير، والكنعد، والباراكودا",
   rod: "2.9–3 م (9.6–10 أقدام)، وزن رمي نحو 30–80 غ، PE 1–3", reel: "مقاس 4000–5000 مقاوم لماء البحر", braid: "PE 1.5–2 (25–30 رطلاً)", leader: "فلوروكربون 40–60 رطلاً + سلك معدني للكنعد",
   lures: "جكّات 30–60 غ، بوبر كبير، منو طويل", eg: "مثال قصبة: Major Craft Crostage CRX-962LSJ (30–50 غ) أو Crosride 3G XR3-1002M (حتى 80 غ)"}
];

const gSearch = q => "https://www.google.com/search?q=" + encodeURIComponent(q);

function gearProductsHtml(cat) {
  return ["eco", "mid", "pro"].map(t => {
    const items = GEAR_PRODUCTS[cat].filter(p => p.tier === t);
    if (!items.length) return "";
    return `<div style="margin-top:8px"><span class="chip ${t === "pro" ? "warn" : t === "mid" ? "ok" : ""}">${GEAR_TIERS[t]}</span>
      ${items.map(p => `<div class="gp"><div><b>${p.name}</b><div class="mute">${p.note}</div></div>
        <a href="${gSearch(p.name + " سعر البحرين")}" target="_blank" rel="noopener" class="gpl">السعر ↗</a></div>`).join("")}</div>`;
  }).join("");
}

function myGear() { try { return JSON.parse(localStorage.getItem("sab_mygear") || "null"); } catch (e) { return null; } }
function saveGear(g) { try { localStorage.setItem("sab_mygear", JSON.stringify(g)); return true; } catch (e) { return false; } }

function gearHtml() {
  const g = myGear() || {};
  return `
  <div class="card"><h2>دليل المعدّات</h2>
    <div class="mute">الترشيحات مبنية على مراجعات الاختبار والتقييمات المنشورة، مع تفضيل ما أثبت نفسه في الماء المالح. الأسعار تختلف كثيراً بين المحلات، فاضغط «السعر» لترى الأسعار الحالية في البحرين.</div></div>

  <div class="card" style="border-color:var(--acc2)"><h2>🧰 عدّتي</h2>
    <div class="mute">سجّل معدّاتك مرة واحدة، فيراعيها «ماذا أربط؟» وينبّهك إن اقترح طعماً لا يناسب قصبتك.</div>
    <div class="row"><div style="flex:1"><label class="f">أقل وزن رمي للقصبة (غ)</label><input type="number" id="gMin" value="${g.min ?? ""}" placeholder="مثلاً 15"></div>
      <div style="flex:1"><label class="f">أعلى وزن رمي للقصبة (غ)</label><input type="number" id="gMax" value="${g.max ?? ""}" placeholder="مثلاً 40"></div></div>
    <div class="row"><div style="flex:1"><label class="f">مقاس البكرة</label><input type="number" id="gReel" value="${g.reel ?? ""}" placeholder="مثلاً 3000"></div>
      <div style="flex:1"><label class="f">رقم المضفّر PE</label><input type="number" step="0.1" id="gPe" value="${g.pe ?? ""}" placeholder="مثلاً 1"></div>
      <div style="flex:1"><label class="f">القائد (رطل)</label><input type="number" id="gLeader" value="${g.leader ?? ""}" placeholder="مثلاً 25"></div></div>
    <div class="row" style="margin-top:10px"><button class="btn" id="gSave">حفظ عدّتي</button>${myGear() ? '<button class="btn sec sm" id="gClear">مسح</button>' : ""}</div>
    <div id="gSetupHint" style="margin-top:8px"></div></div>

  <div class="card"><h2>ثلاث تجهيزات جاهزة</h2>
    ${GEAR_SETUPS.map(s => `<div class="kstepbox"><h3 style="margin-top:0">${s.name}</h3><div class="mute">${s.for}</div>
      <div class="rec" style="margin-top:8px"><b>القصبة</b><span>${s.rod}</span><b>البكرة</b><span>${s.reel}</span><b>المضفّر</b><span>${s.braid}</span><b>القائد</b><span>${s.leader}</span><b>الطُّعوم</b><span>${s.lures}</span></div>
      <div class="mute" style="margin-top:6px">${s.eg}</div></div>`).join("")}</div>

  ${GEAR_BASICS.map(x => `<div class="card"><h2>كيف تختار ${x.t}؟</h2><ul>${x.b.map(i => `<li>${i}</li>`).join("")}</ul>
    ${x.t.startsWith("القصبة") ? gearProductsHtml("rods") : x.t.startsWith("البكرة") ? gearProductsHtml("reels") : `<h3>المضفّر</h3>${gearProductsHtml("braid")}<h3>القائد</h3>${gearProductsHtml("leader")}`}</div>`).join("")}

  <div class="card"><h2>من أين تشتري في البحرين؟</h2><ul>
    <li>محلات أدوات الصيد المحلية، حيث يمكنك لمس القصبة وتجربة البكرة قبل الشراء، وهذا الأفضل.</li>
    <li>ديكاثلون البحرين، وفيه بكرات وقصبات بأسعار معقولة.</li>
    <li>المتاجر الإلكترونية التي توصّل إلى البحرين، مع الانتباه لرسوم الشحن والجمارك.</li></ul>
    <div class="mute">نصيحة: اشترِ القصبة والبكرة معاً، وتأكد أن وزن البكرة يوازن القصبة حين تمسكها من مقبضها.</div></div>`;
}

function bindGear() {
  const sv = document.getElementById("gSave"); if (!sv) return;
  const hint = () => {
    const g = myGear(); const el = document.getElementById("gSetupHint"); if (!el) return;
    if (!g || !g.max) { el.innerHTML = ""; return; }
    const s = g.max <= 30 ? GEAR_SETUPS[0] : g.max <= 50 ? GEAR_SETUPS[1] : GEAR_SETUPS[2];
    el.innerHTML = `<div class="banner">عدّتك أقرب إلى <b>${s.name}</b>. ${s.for}.</div>`;
  };
  sv.onclick = () => {
    const n = id => { const v = parseFloat(document.getElementById(id).value); return isNaN(v) ? null : v; };
    const g = {min: n("gMin"), max: n("gMax"), reel: n("gReel"), pe: n("gPe"), leader: n("gLeader")};
    if (g.min && g.max && g.min > g.max) { const t = g.min; g.min = g.max; g.max = t; }
    saveGear(g); if (typeof toast === "function") toast("حُفظت عدّتك"); hint();
    if (typeof renderLearn === "function") renderLearn();
  };
  const cl = document.getElementById("gClear"); if (cl) cl.onclick = () => { try { localStorage.removeItem("sab_mygear"); } catch (e) {} if (typeof renderLearn === "function") renderLearn(); };
  hint();
}

/* compatibility check used by the rig advisor */
function gearCheck(r, ctx) {
  const g = myGear(); if (!g) return "";
  const out = [];
  const nums = (r.weight || "").match(/\d+/g);
  if (nums && (g.max || g.min)) {
    const lo = +nums[0], hi = +(nums[1] || nums[0]);
    if (g.max && lo > g.max) out.push(`⚠️ الوزن المقترح (${lo}–${hi} غ) أثقل من قصبتك (حتى ${g.max} غ). خذ أثقل طعم لا يتجاوز ${g.max} غ، وقد تقلّ مسافة الرمي قليلاً.`);
    else if (g.max && hi > g.max) out.push(`ℹ️ لا تتجاوز ${g.max} غ، وهو الحد الأعلى لقصبتك.`);
    if (g.min && hi < g.min) out.push(`⚠️ الوزن المقترح (${lo}–${hi} غ) أخف من أقل وزن تناسبه قصبتك (${g.min} غ)؛ ستقصر رميتك. فكّر في قصبة أخف لهذا النوع من الصيد.`);
  }
  if (g.leader && ctx && ctx.bottom === "rocks" && g.leader < 40) out.push(`⚠️ قائدك ${g.leader} رطلاً، والقاع صخري؛ يُفضَّل 40 رطلاً على الأقل قرب الصخور.`);
  if (g.pe && g.pe < 0.8 && ctx && (ctx.bottom === "rocks" || ctx.depth === "deep")) out.push(`ℹ️ مضفّرك رفيع (PE ${g.pe})؛ انتبه للاحتكاك بالصخور واضبط الفرامل برفق.`);
  if (g.reel && g.reel < 3000 && /جك/.test(r.lure || "")) out.push(`ℹ️ بكرتك (${g.reel}) صغيرة نسبياً للجكّات والسمك الكبير؛ 3000–4000 أنسب.`);
  return out.length ? `<div class="banner" style="margin-top:10px"><b>🧰 حسب عدّتك:</b><br>${out.join("<br>")}</div>` : `<div class="mute" style="margin-top:8px">🧰 التجهيزة تناسب عدّتك المسجّلة.</div>`;
}

/* ---------- Accessories ---------- */
const ACCESSORIES = [
  {g: "لا تخرج بدونها", items: [
    {n: "كمّاشة صيد (Fishing pliers)", w: "لإخراج الكلّاب من فم السمكة بأمان، وفتح حلقات الطُّعوم وإغلاقها. اختر واحدة من الألمنيوم أو الستانلس لأن الحديد يصدأ.", q: "saltwater fishing pliers aluminum"},
    {n: "مقص المضفّر (Braid scissors)", w: "المضفّر لا يُقطع بقصّافة الأظافر العادية بسهولة؛ هذا المقص مخصص له.", q: "braid scissors fishing"},
    {n: "ماسك الشفة (Lip grip)", w: "تمسك به فك السمكة فتتجنّب الأسنان والأشواك السامّة. ضروري مع الكنعد والصافي والملكة.", q: "fish lip grip saltwater"},
    {n: "علبة طُعوم صغيرة + حقيبة كتف", w: "علبة بفواصل للطُّعوم والمشابك، في حقيبة كتف تبقي يديك حرّتين على الصخور.", q: "lure box shoulder sling bag fishing"},
    {n: "مشابك (Snaps) وحلقات (Split rings)", w: "المشبك يجعل تغيير الطعم سريعاً دون قطع الخيط. اختر مشابك قوية للماء المالح.", q: "saltwater fishing snaps split rings"}]},
  {g: "لحمل السمك وحفظه", items: [
    {n: "حافظة ثلج (آيس بوكس)", w: "حرارة البحرين تُفسد السمك خلال ساعة؛ ضعه على الثلج فوراً. حافظة صغيرة بحزام كتف مناسبة للتنقّل بين النقاط.", q: "fishing cooler shoulder strap"},
    {n: "كيس سمك معزول (Fish bag)", w: "بديل أخف من الحافظة، يُطوى ويوضع فيه الثلج والسمك.", q: "insulated fish bag"},
    {n: "شبكة رفع (Landing net) بيد طويلة", w: "لرفع السمكة من الماء إلى الكاسر دون أن ينقطع الخيط. اختر يداً قابلة للتطويل.", q: "telescopic landing net shore fishing"},
    {n: "الخطّاف اليدوي (Gaff)", w: "للسمك الكبير فقط حين لا تكفي الشبكة. لا تستعمله مع سمكة ستطلقها.", q: "telescopic gaff shore fishing"},
    {n: "شريط قياس أو ميزان صغير", w: "لتعرف إن كانت السمكة صغيرة فتطلقها، ولتسجّل الحجم في سجلّك.", q: "fishing measuring tape scale"}]},
  {g: "للسلامة", items: [
    {n: "حذاء مانع للانزلاق", w: "أهم قطعة على الكاسرات: الصخور المبتلّة زلقة جداً، والنعل القوي يحميك أيضاً من الأشواك.", q: "rock fishing shoes non slip"},
    {n: "قفازات صيد", w: "تحمي يديك من الأشواك والخيط المشدود والشمس.", q: "fishing gloves sun protection"},
    {n: "كشاف رأس (Headlamp)", w: "للفجر والليل، يترك يديك حرّتين. يفضّل وضع الضوء الأحمر حتى لا يُخيف السمك.", q: "headlamp red light fishing"},
    {n: "حقيبة إسعافات صغيرة", w: "لاصقات، ومطهّر، وقاطع خيوط، ورقم الطوارئ 999.", q: "small first aid kit outdoor"}]},
  {g: "للراحة", items: [
    {n: "نظارة شمسية مستقطبة", w: "تزيل وهج الماء فترى القاع والأسماك وتحمي عينيك من الكلّاب المرتدّ.", q: "polarized fishing sunglasses"},
    {n: "قبعة وغطاء رقبة (Buff)", w: "حماية من شمس الخليج ساعات طويلة.", q: "fishing buff neck gaiter"},
    {n: "حامل قصبة بالحزام أو للأرض", w: "يريحك حين تغيّر الطعم أو تشرب الماء.", q: "rod holder belt shore fishing"}]}
];
const CHECKLIST = ["القصبة والبكرة","علبة الطُّعوم","قائد احتياطي ومشابك","الكمّاشة ومقص المضفّر","ماسك الشفة","حافظة ثلج","الحذاء المانع للانزلاق","كشاف الرأس (للفجر أو الليل)","النظارة المستقطبة والقبعة","ماء وجوال مشحون"];
function accHtml() {
  let done = {}; try { done = JSON.parse(localStorage.getItem("sab_check") || "{}"); } catch (e) {}
  return `<div class="card" style="border-color:var(--acc)"><h2>✅ قائمة ما قبل الخروج</h2>
    ${CHECKLIST.map((c, i) => `<label class="row" style="gap:10px;padding:5px 0;cursor:pointer"><input type="checkbox" data-chk="${i}" ${done[i] ? "checked" : ""} style="width:20px;height:20px">${c}</label>`).join("")}
    <button class="btn sec sm" id="chkReset" style="margin-top:8px">تفريغ القائمة</button></div>
  ${ACCESSORIES.map(grp => `<div class="card"><h2>${grp.g}</h2>${grp.items.map(it => `<div class="gp"><div><b>${it.n}</b><div class="mute">${it.w}</div></div>
    <a href="${gSearch(it.q)}" target="_blank" rel="noopener" class="gpl">أمثلة ↗</a></div>`).join("")}</div>`).join("")}`;
}
function bindAcc() {
  document.querySelectorAll("[data-chk]").forEach(c => c.onchange = () => {
    let d = {}; try { d = JSON.parse(localStorage.getItem("sab_check") || "{}"); } catch (e) {}
    d[c.dataset.chk] = c.checked; try { localStorage.setItem("sab_check", JSON.stringify(d)); } catch (e) {}
  });
  const r = document.getElementById("chkReset"); if (r) r.onclick = () => { try { localStorage.removeItem("sab_check"); } catch (e) {} document.querySelectorAll("[data-chk]").forEach(c => c.checked = false); };
}
