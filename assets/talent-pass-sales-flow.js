(function () {
  "use strict";

  const root = document.querySelector(".tp-flow");
  if (!root) return;

  const checkoutUrl = root.dataset.checkoutUrl || "";
  const FLOW_STATE_KEY = "tp_flow_state_v1";
  const startStage = new URLSearchParams(window.location.search).get("tp_stage");
  const S = { bucket: null, split: null, lang: null, asp: null, feats: [], plan: "q" };
  let quizStep = "age";

  // Prevent UI flash when opened directly in result stage.
  if (startStage === "result") {
    const quizSection = document.getElementById("quiz-section");
    const staticPage = document.getElementById("static-page");
    if (quizSection) quizSection.style.display = "none";
    if (staticPage) staticPage.classList.add("visible");
  }

  const CATS = {
    color_wizards: {
      name: "Color Wizards",
      why: {
        confidence: "Color Wizards gives your child a national stage to show what their imagination creates.",
        recognition: "A specialist art judge writes a personalised report on their entry.",
        progress: "Every submission comes with detailed feedback on what to improve next.",
        joy: "A child who reaches for a pencil unprompted deserves this platform."
      },
      theme: "Monsoon Coloring",
      next1: "Nature and Wildlife",
      next2: "Festival of Colors",
      review: "My daughter was very proud after receiving her feedback report.",
      reviewer: "Priya Sharma - Mumbai"
    },
    handwriting: {
      name: "Handwriting Champs",
      why: {
        confidence: "Handwriting Champs rewards discipline and precision on a national stage.",
        recognition: "A specialist evaluates letter formation, spacing, and style.",
        progress: "Your child gets specific feedback on writing quality.",
        joy: "Perfect for children who enjoy craft and neatness."
      },
      theme: "Letters of Nature",
      next1: "My Favourite Story",
      next2: "Poetry in Ink",
      review: "The detailed notes helped visible improvement in weeks.",
      reviewer: "Godson Family - Bangalore"
    },
    dance: {
      name: "Dance Wizards",
      why: {
        confidence: "Dance Wizards gives your child a national stage from home.",
        recognition: "A professional choreographer evaluates every entry.",
        progress: "Technique, expression, and presence feedback in every submission.",
        joy: "A child who moves with music deserves this stage."
      },
      theme: "Monsoon Moves",
      next1: "Folk Fusion",
      next2: "Freestyle Showcase",
      review: "My daughter became much more confident after CKC.",
      reviewer: "Satya Sahoo - Bhubaneswar"
    },
    singing: {
      name: "Singing Stars",
      why: {
        confidence: "Singing Stars moves your child from home audience to national audience.",
        recognition: "A trained vocal judge reviews pitch, tone, and expression.",
        progress: "Specific musical feedback for each entry.",
        joy: "For children who sing naturally every day."
      },
      theme: "Monsoon Melodies",
      next1: "Bollywood Classics",
      next2: "Original Composition",
      review: "The vocal comments were practical and very encouraging.",
      reviewer: "Anita Verma - Delhi"
    },
    instrumental: {
      name: "Instrumental Genius",
      why: {
        confidence: "A national platform for years of hard-earned instrument practice.",
        recognition: "A trained musician evaluates technique and musicality.",
        progress: "Concrete advice for technical and expressive improvement.",
        joy: "For children who love instrument practice and performance."
      },
      theme: "Monsoon Ragas",
      next1: "Classical Showcase",
      next2: "Fusion and Original",
      review: "CKC finally gave my child a national instrument stage.",
      reviewer: "Kavitha Nair - Chennai"
    },
    master_orator: {
      name: "Master Orator",
      why: {
        confidence: "Built for children whose words are their superpower.",
        recognition: "A communication specialist evaluates delivery and impact.",
        progress: "Feedback on structure, vocabulary, and stage presence.",
        joy: "For children who love speaking and persuading."
      },
      theme: "Speak Your Truth",
      next1: "My Role Model",
      next2: "The World I Want",
      review: "Regular participation improved confidence and stage comfort.",
      reviewer: "Saurabh Gupta - Pune"
    },
    tell_ur_tale: {
      name: "Tell Ur Tale",
      why: {
        confidence: "A national audience for children who love storytelling.",
        recognition: "A narrative specialist evaluates story structure and voice.",
        progress: "Detailed feedback on plot, character, and language.",
        joy: "For children who naturally fill pages with stories."
      },
      theme: "Monsoon Stories",
      next1: "A Day in My Life",
      next2: "The Hero Within",
      review: "Our child finally had a real audience for his stories.",
      reviewer: "Rahul Mehta - Pune"
    },
    recite_english: {
      name: "Recite It! - English",
      why: {
        confidence: "A national stage for children who recite in English.",
        recognition: "Language specialists evaluate diction and expression.",
        progress: "Guidance on pronunciation, pacing, and delivery.",
        joy: "For children who enjoy rhythm and spoken poetry."
      },
      theme: "Monsoon Poetry",
      next1: "Classic Literature",
      next2: "Original Poem",
      review: "Our daughter improved diction and reading confidence.",
      reviewer: "Poulami Dey - Kolkata"
    },
    recite_hindi: {
      name: "Recite It! - Hindi",
      why: {
        confidence: "A national stage for Hindi poetry and expression.",
        recognition: "Hindi specialists assess pronunciation and feeling.",
        progress: "Clear guidance for diction and performance quality.",
        joy: "For children who enjoy kavita and spoken Hindi art."
      },
      theme: "Monsoon Kavita",
      next1: "Kabir Dohe",
      next2: "Classic Hindi Poems",
      review: "We saw discipline and clarity improve quickly.",
      reviewer: "Suresh Iyer - Hyderabad"
    },
    shloka: {
      name: "Shloka Scholars",
      why: {
        confidence: "Honors shloka discipline on a national stage.",
        recognition: "Sanskrit specialists evaluate pronunciation and clarity.",
        progress: "Feedback on articulation, rhythm, and accuracy.",
        joy: "For children who find meaning in shloka recitation."
      },
      theme: "Sacred Verses",
      next1: "Stotras",
      next2: "Upanishad Shlokas",
      review: "Pronunciation quality improved and confidence grew.",
      reviewer: "Meena Krishnan - Bangalore"
    },
    build_it: {
      name: "Build It!",
      why: {
        confidence: "A national stage for builders and creators.",
        recognition: "Specialists evaluate design thinking and execution.",
        progress: "Feedback on structure, innovation, and practicality.",
        joy: "For children who naturally solve with hands-on building."
      },
      theme: "Monsoon Architecture",
      next1: "Vehicles and Machines",
      next2: "Dream City",
      review: "This gave my son his first real engineering stage.",
      reviewer: "Vikram Patel - Ahmedabad"
    }
  };

  const FEATS_DATA = [
    { v: "feedback", main: "A personalised report from a real judge", tag: "g" },
    { v: "school", main: "School notified of their achievement", tag: "a" },
    { v: "medal", main: "A physical medal or trophy at home", tag: "a" },
    { v: "leaderboard", main: "Their name on a national leaderboard", tag: "a" },
    { v: "published", main: "Published in WKC magazine", tag: "g" },
    { v: "season", main: "A full season with levels to climb", tag: "a" }
  ];

  function resolveCat() {
    const bucket = S.bucket;
    const split = S.split;
    const lang = S.lang;
    if (bucket === "stem") return "build_it";
    if (bucket === "writing") return "tell_ur_tale";
    if (bucket === "arts") return split === "cw" ? "color_wizards" : "handwriting";
    if (bucket === "performing") {
      if (split === "dance") return "dance";
      if (split === "singing") return "singing";
      return "instrumental";
    }
    if (bucket === "speaking") {
      if (split === "orator") return "master_orator";
      if (lang === "english") return "recite_english";
      if (lang === "hindi") return "recite_hindi";
      return "shloka";
    }
    return null;
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function renderQuiz() {
    const qw = byId("quiz-wrapper");
    if (!qw) return;

    if (quizStep === "age") {
      qw.innerHTML = `
        <div class="prog">${[0, 1, 2, 3].map(() => `<div class="pseg"></div>`).join("")}</div>
        <div class="q-eyebrow">Step 1</div>
        <div class="q-title">How old is your child?</div>
        <div class="q-sub">This determines which league they compete in</div>
        <div class="bucket-grid">
          <div class="bucket" onclick="window.TalentPassFlow.setAge('lcl')">
            <div class="b-main">Ages 3-5</div><div class="b-sub">Little Champions League</div>
          </div>
          <div class="bucket" onclick="window.TalentPassFlow.setAge('ckc')" style="border-color:#F5A623;background:#FEF6E4">
            <div class="b-main">Ages 6-15</div><div class="b-sub">CKC Season 5</div>
          </div>
        </div>`;
      return;
    }

    if (quizStep === "lcl") {
      qw.innerHTML = `
        <div style="text-align:center;padding:10px 0 4px">
          <div style="font-size:26px;margin-bottom:8px">🌟</div>
          <div style="font-size:16px;color:#B45309;margin-bottom:6px;font-weight:600">LCL - Little Champions League</div>
          <div style="font-size:12px;color:#6B7280;line-height:1.6;margin-bottom:16px">No elimination. No rankings. Every child is celebrated.</div>
          <button class="btn-gold" onclick="window.TalentPassFlow.enrolNow()">Explore LCL Season 5</button>
          <button class="btn-ghost" onclick="window.TalentPassFlow.setAge('reset')">Change age</button>
        </div>`;
      return;
    }

    if (quizStep === "bucket") {
      const cards = [
        { v: "arts", label: "Arts", sub: "Drawing, coloring, handwriting" },
        { v: "performing", label: "Performing Arts", sub: "Dance, singing, instruments" },
        { v: "speaking", label: "Public Speaking", sub: "Oratory, recitation, shlokas" },
        { v: "stem", label: "STEM", sub: "Building, engineering, LEGO" },
        { v: "writing", label: "Creative Writing", sub: "Storytelling, story-writing" }
      ];
      qw.innerHTML = `
        <div class="prog">${[0, 1, 2, 3].map((i) => `<div class="pseg${i < 1 ? " done" : ""}"></div>`).join("")}</div>
        <div class="q-eyebrow">Question 1 of 4</div>
        <div class="q-title">What is your child naturally drawn to?</div>
        <div class="q-sub">Think about what they choose without being asked.</div>
        <div class="bucket-grid">
          ${cards
            .map(
              (b) => `<div class="bucket${S.bucket === b.v ? " sel" : ""}" onclick="window.TalentPassFlow.selectBucket('${b.v}')">
                  <div class="b-main">${b.label}</div>
                  <div class="b-sub">${b.sub}</div>
                </div>`
            )
            .join("")}
        </div>
        <button class="btn-purple" ${S.bucket ? "" : "disabled"} onclick="window.TalentPassFlow.nextFromBucket()">Next</button>`;
      return;
    }

    if (quizStep === "split") {
      const splits = {
        arts: [
          { v: "cw", main: "Imagination-led", sub: "Freestyle creative work" },
          { v: "hw", main: "Perfection-led", sub: "Neatness and precision" }
        ],
        performing: [
          { v: "dance", main: "Movement and dance", sub: "Rhythm and expression" },
          { v: "singing", main: "Voice and singing", sub: "Melody and tone" },
          { v: "instrument", main: "Musical instrument", sub: "Played skillfully" }
        ],
        speaking: [
          { v: "orator", main: "Their own words", sub: "Speech, argument, presentation" },
          { v: "recite", main: "Recitation", sub: "Poetry and memorised expression" }
        ]
      };
      const list = splits[S.bucket] || [];
      qw.innerHTML = `
        <div class="prog">${[0, 1, 2, 3].map((i) => `<div class="pseg${i < 2 ? " done" : ""}"></div>`).join("")}</div>
        <div class="q-eyebrow">Question 2 of 4</div>
        <div class="q-title">Which option fits best?</div>
        <div class="q-sub">Pick what is most natural for your child.</div>
        <div class="split-list">
          ${list
            .map(
              (s) => `<div class="split${S.split === s.v ? " sel" : ""}" onclick="window.TalentPassFlow.selectSplit('${s.v}')">
                  <div class="b-main">${s.main}</div><div class="b-sub">${s.sub}</div>
                </div>`
            )
            .join("")}
        </div>
        <button class="btn-purple" ${S.split ? "" : "disabled"} onclick="window.TalentPassFlow.nextFromSplit()">Next</button>
        <button class="btn-ghost" onclick="window.TalentPassFlow.backToBucket()">Back</button>`;
      return;
    }

    if (quizStep === "lang") {
      const langs = [
        { v: "english", name: "English" },
        { v: "hindi", name: "Hindi" },
        { v: "sanskrit", name: "Sanskrit" }
      ];
      qw.innerHTML = `
        <div class="prog">${[0, 1, 2, 3].map((i) => `<div class="pseg${i < 2 ? " done" : ""}"></div>`).join("")}</div>
        <div class="q-eyebrow">One more thing</div>
        <div class="q-title">Which language does your child recite in?</div>
        <div class="bucket-grid">
          ${langs
            .map(
              (l) => `<div class="bucket${S.lang === l.v ? " sel" : ""}" onclick="window.TalentPassFlow.selectLang('${l.v}')">
                  <div class="b-main">${l.name}</div>
                </div>`
            )
            .join("")}
        </div>
        <button class="btn-ghost" onclick="window.TalentPassFlow.backToSplit()">Back</button>`;
      return;
    }

    if (quizStep === "asp") {
      const opts = [
        { v: "confidence", main: "Confidence", sub: "Stage confidence and boldness" },
        { v: "recognition", main: "Recognition", sub: "Seen by experts" },
        { v: "progress", main: "Progress", sub: "Actionable growth feedback" },
        { v: "joy", main: "Joy", sub: "Meaningful activity away from screens" }
      ];
      qw.innerHTML = `
        <div class="prog">${[0, 1, 2, 3].map((i) => `<div class="pseg${i < 3 ? " done" : ""}"></div>`).join("")}</div>
        <div class="q-eyebrow">Question 3 of 4</div>
        <div class="q-title">What outcome matters most to you?</div>
        <div class="asp-list">
          ${opts
            .map(
              (o) => `<div class="asp${S.asp === o.v ? " sel" : ""}" onclick="window.TalentPassFlow.selectAsp('${o.v}')">
                  <div class="b-main">${o.main}</div><div class="b-sub">${o.sub}</div>
                </div>`
            )
            .join("")}
        </div>
        <button class="btn-purple" ${S.asp ? "" : "disabled"} onclick="window.TalentPassFlow.nextFromAsp()">Next</button>
        <button class="btn-ghost" onclick="window.TalentPassFlow.backFromAsp()">Back</button>`;
      return;
    }

    if (quizStep === "feats") {
      qw.innerHTML = `
        <div class="prog">${[0, 1, 2, 3].map(() => `<div class="pseg done"></div>`).join("")}</div>
        <div class="q-eyebrow">Final step</div>
        <div class="q-title">What would make your child proud?</div>
        <div class="feat-list">
          ${FEATS_DATA.map(
            (f) => `<div class="feat${S.feats.includes(f.v) ? " sel" : ""}" onclick="toggleFeat('${f.v}')">
              <div class="b-main">${f.main}</div>
            </div>`
          ).join("")}
        </div>
        <button class="btn-gold" ${S.feats.length ? "" : "disabled"} onclick="window.TalentPassFlow.resolveQuiz()">See my child's category</button>
        <button class="btn-ghost" onclick="window.TalentPassFlow.backToAsp()">Back</button>`;
    }
  }

  function renderPlan() {
    const plans = {
      q: { name: "Quarterly", price: "₹1,399", mo: "≈ ₹467/month", chip: "3 months · 3 categories", featured: true },
      sa: { name: "Semi-annual", price: "₹2,299", mo: "≈ ₹383/month", chip: "6 months · 5 categories", featured: false },
      an: { name: "Annual", price: "₹3,999", mo: "≈ ₹333/month", chip: "12 months · all 11 categories", featured: false }
    };
    const pl = plans[S.plan];
    const counts = { q: "3", sa: "6", an: "12" };
    byId("enrol-price").textContent = pl.price;
    byId("plan-card-container").innerHTML = `
      <div class="plan-card ${pl.featured ? "featured" : ""}">
        <div class="plan-top">
          <div class="plan-top-row">
            <div class="plan-name">${pl.name}</div>
            <div class="plan-price">${pl.price}</div>
          </div>
          <div class="plan-mo">${pl.mo}</div>
          <div class="plan-chip">${pl.chip}</div>
        </div>
        <div class="plan-feats">
          <div class="pf-row"><div class="pf-dot" style="background:#059669"></div><span class="pf-text">${counts[S.plan]} personalised feedback reports</span><span class="pf-pill" style="background:#ECFDF5;color:#059669">guaranteed</span></div>
          <div class="pf-row"><div class="pf-dot" style="background:#059669"></div><span class="pf-text">${counts[S.plan]} physical certificates delivered</span><span class="pf-pill" style="background:#ECFDF5;color:#059669">guaranteed</span></div>
          <div class="pf-row"><div class="pf-dot" style="background:#F5A623"></div><span class="pf-text">Competition medals if they win</span><span class="pf-pill" style="background:#FEF6E4;color:#B45309">aspirational</span></div>
        </div>
      </div>`;
  }

  function saveFlowState(payload) {
    try {
      window.sessionStorage.setItem(FLOW_STATE_KEY, JSON.stringify(payload));
    } catch (_err) {
      // Ignore storage errors (private mode, disabled storage, etc.)
    }
  }

  function loadFlowState() {
    try {
      const raw = window.sessionStorage.getItem(FLOW_STATE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (_err) {
      return null;
    }
  }

  function getResultUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set("tp_stage", "result");
    return url.toString();
  }

  function getQuizUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete("tp_stage");
    return url.toString();
  }

  function applyResolvedView(catKey) {
    const cat = catKey ? CATS[catKey] : null;
    if (!cat) return false;

    byId("r-name").textContent = cat.name;
    byId("r-why").textContent = cat.why[S.asp] || "";
    byId("theme-name").textContent = cat.theme;
    byId("sec-theme-title").textContent = cat.theme;
    byId("theme-next1").textContent = cat.next1;
    byId("theme-next2").textContent = cat.next2;
    byId("review-text").textContent = cat.review;
    byId("review-author").textContent = cat.reviewer + " · " + cat.name;
    byId("plan-cat-name").textContent = cat.name;
    byId("nav-cat-name").textContent = cat.name;
    byId("srb-name").textContent = cat.name;

    byId("nav-cat").classList.add("visible");
    byId("sticky-bar").classList.add("visible");

    const featRows = byId("feat-rows-display");
    featRows.innerHTML = S.feats
      .map((fv) => {
        const f = FEATS_DATA.find((x) => x.v === fv);
        if (!f) return "";
        const lbl = f.tag === "g" ? "guaranteed" : "aspirational";
        return `<div class="feat-row"><div class="fdot fdot-${f.tag}"></div><span class="feat-row-text">${f.main}</span><span class="fpill fpill-${f.tag}">${lbl}</span></div>`;
      })
      .join("");

    renderPlan();
    byId("quiz-section").style.display = "none";
    byId("static-page").classList.add("visible");
    byId("phone").scrollTop = 0;
    storyInit("story_a", 7);
    storyPersonalise("story_a", cat);
    return true;
  }

  function hydrateFromSavedState(savedState) {
    if (!savedState) return false;
    if (!savedState.catKey || !CATS[savedState.catKey]) return false;

    S.bucket = savedState.bucket || null;
    S.split = savedState.split || null;
    S.lang = savedState.lang || null;
    S.asp = savedState.asp || "confidence";
    S.feats = Array.isArray(savedState.feats) ? savedState.feats : [];
    S.plan = savedState.plan || "q";

    return applyResolvedView(savedState.catKey);
  }

  function resolveQuiz() {
    const catKey = resolveCat();
    if (!catKey || !CATS[catKey]) return;

    saveFlowState({
      catKey: catKey,
      bucket: S.bucket,
      split: S.split,
      lang: S.lang,
      asp: S.asp,
      feats: S.feats,
      plan: S.plan
    });

    // Multi-page behavior: move to result stage via full-page navigation.
    window.location.href = getResultUrl();
  }

  const storyState = {};

  function storyInit(id, n) {
    storyState[id] = { idx: 0, n: n || 7 };
    storyRender(id);
  }

  function storyNav(id, dir) {
    const st = storyState[id];
    if (!st) return;
    const next = st.idx + dir;
    if (next < 0 || next >= st.n) return;
    st.idx = next;
    storyRender(id);
  }

  function storyRender(id) {
    const st = storyState[id];
    if (!st) return;
    byId(id + "-track").style.transform = "translateX(-" + st.idx * 100 + "%)";
    byId(id + "-prog").innerHTML = Array.from({ length: st.n }, (_, i) => `<div class="spr-seg"><div class="spr-fill${i < st.idx ? " done" : ""}"></div></div>`).join("");
    byId(id + "-dots").innerHTML = Array.from({ length: st.n }, (_, i) => `<div class="sdn-dot${i === st.idx ? " active" : ""}"></div>`).join("");
    byId(id + "-hint").textContent = st.idx === st.n - 1 ? "scroll down to choose plan" : "tap to advance";
  }

  function storyPersonalise(id, cat) {
    const q = byId(id + "-q");
    const a = byId(id + "-attr");
    const fc = byId(id + "-fcat");
    const cd = byId(id + "-cdet");
    if (q) q.textContent = '"' + cat.review + '"';
    if (a) a.textContent = cat.reviewer;
    if (fc) fc.textContent = cat.name + " · Apr 2026";
    if (cd) cd.innerHTML = "For outstanding participation in<br><strong>" + cat.name + "</strong> · CKC Season 5<br>April 2026";
  }

  function enrolNow() {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
      return;
    }
    const plans = byId("plans-section");
    if (plans) plans.scrollIntoView({ behavior: "smooth" });
  }

  window.toggleFeat = function (v) {
    const i = S.feats.indexOf(v);
    if (i > -1) S.feats.splice(i, 1);
    else S.feats.push(v);
    renderQuiz();
  };
  window.setPlan = function (p, el) {
    S.plan = p;
    document.querySelectorAll(".ptab").forEach((t) => t.classList.remove("active"));
    if (el) el.classList.add("active");
    renderPlan();
  };
  window.storyNav = storyNav;

  window.TalentPassFlow = {
    enrolNow,
    resolveQuiz,
    setAge: function (age) {
      if (age === "reset") {
        quizStep = "age";
      } else if (age === "lcl") {
        quizStep = "lcl";
      } else {
        quizStep = "bucket";
      }
      renderQuiz();
    },
    selectBucket: function (value) {
      S.bucket = value;
      S.split = null;
      S.lang = null;
      renderQuiz();
    },
    nextFromBucket: function () {
      quizStep = S.bucket === "stem" || S.bucket === "writing" ? "asp" : "split";
      renderQuiz();
    },
    backToBucket: function () {
      quizStep = "bucket";
      renderQuiz();
    },
    selectSplit: function (value) {
      S.split = value;
      S.lang = null;
      renderQuiz();
    },
    nextFromSplit: function () {
      quizStep = S.split === "recite" ? "lang" : "asp";
      renderQuiz();
    },
    backToSplit: function () {
      quizStep = "split";
      renderQuiz();
    },
    selectLang: function (value) {
      S.lang = value;
      quizStep = "asp";
      renderQuiz();
    },
    selectAsp: function (value) {
      S.asp = value;
      renderQuiz();
    },
    nextFromAsp: function () {
      quizStep = "feats";
      renderQuiz();
    },
    backFromAsp: function () {
      quizStep = S.bucket === "stem" || S.bucket === "writing" ? "bucket" : (S.split === "recite" ? "lang" : "split");
      renderQuiz();
    },
    backToAsp: function () {
      quizStep = "asp";
      renderQuiz();
    }
  };

  if (startStage === "result") {
    const restored = hydrateFromSavedState(loadFlowState());
    if (!restored) {
      window.history.replaceState({}, "", getQuizUrl());
      renderQuiz();
    }
  } else {
    renderQuiz();
  }
})();
