/**
 * 《长安岁华》核心逻辑：角色、家庭、资产、事件、界面与结局。
 */
(function () {
  "use strict";

  const ERA_START = 713;
  const ERA_NAME = "开元";

  const SCENES = {
    home: "assets/tang-scene-home.png",
    city: "assets/tang-scene-city.png",
    wild: "assets/tang-scene-wild.png",
  };
  const SCENE_LABEL = { home: "庭园", city: "城邑", wild: "山河" };

  const PORTRAIT = { 男: "assets/tang-portrait-male.png", 女: "assets/tang-portrait-female.png" };

  const ORIGINS = ["士族", "寒门", "商贾", "军户", "医家", "乐籍"];

  const CITIES = ["长安", "洛阳", "扬州", "益州", "幽州", "广州", "荆州", "苏州"];

  const STAT_KEYS = ["体魄", "才学", "容貌", "心性", "家境", "声望"];

  const STAT_META = {
    体魄: { emoji: "💪", cls: "hp", label: "体魄" },
    才学: { emoji: "📜", cls: "study", label: "才学" },
    容貌: { emoji: "🌸", cls: "look", label: "容貌" },
    心性: { emoji: "🎋", cls: "mind", label: "心性" },
    家境: { emoji: "🏯", cls: "home", label: "家境" },
    声望: { emoji: "🏮", cls: "fame", label: "声望" },
  };

  const STAT_MIN = 0;
  const STAT_MAX = 100;

  /** 出身 → 各属性随机区间 [min, max] */
  const ORIGIN_RANGES = {
    士族: { 体魄: [40, 55], 才学: [50, 68], 容貌: [48, 62], 心性: [42, 58], 家境: [68, 88], 声望: [45, 65] },
    寒门: { 体魄: [45, 62], 才学: [42, 58], 容貌: [40, 55], 心性: [48, 65], 家境: [18, 38], 声望: [25, 45] },
    商贾: { 体魄: [42, 55], 才学: [38, 55], 容貌: [42, 58], 心性: [45, 60], 家境: [55, 80], 声望: [30, 50] },
    军户: { 体魄: [55, 72], 才学: [35, 50], 容貌: [40, 55], 心性: [40, 55], 家境: [30, 50], 声望: [28, 48] },
    医家: { 体魄: [45, 58], 才学: [48, 65], 容貌: [42, 55], 心性: [50, 68], 家境: [38, 58], 声望: [35, 55] },
    乐籍: { 体魄: [40, 55], 才学: [45, 60], 容貌: [55, 75], 心性: [45, 62], 家境: [25, 48], 声望: [30, 50] },
  };

  const SURNAMES = [
    "李", "王", "张", "刘", "陈", "杨", "赵", "周", "吴", "郑", "孙", "马", "卢", "崔", "裴", "柳", "萧", "杜", "韦", "薛",
  ];
  const MALE_NAMES = [
    "子谦", "文远", "承业", "怀瑾", "景行", "彦修", "允之", "仲明", "季常", "公绰", "德润", "士则", "元度", "长卿",
  ];
  const FEMALE_NAMES = [
    "婉儿", "清漪", "如兰", "淑贞", "佩瑶", "文君", "玉筝", "素心", "若华", "令姜", "幼薇", "琼英", "慧娘", "凝之",
  ];

  const FATHER_NAMES = ["严君", "阿爷", "家君"];
  const MOTHER_NAMES = ["慈闱", "阿娘", "家慈"];

  const screens = {
    create: document.getElementById("screen-create"),
    play: document.getElementById("screen-play"),
    end: document.getElementById("screen-end"),
  };

  let gameState = null;
  let modalOpen = false;
  let subpageOpen = false;

  function randInt(a, b) {
    return a + Math.floor(Math.random() * (b - a + 1));
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function clampStat(n) {
    return Math.max(STAT_MIN, Math.min(STAT_MAX, Math.round(n)));
  }

  /**
   * 文案易读化：保留古风语感，但替换现代玩家不易理解的生僻词。
   * 只影响显示文本，不改动原始事件数据。
   */
  function readableCopy(input) {
    var s = String(input || "");
    const MAP = [
      ["襁褓", "幼时"],
      ["违和", "身体不适"],
      ["干谒", "拜访求荐"],
      ["讼败", "官司输了"],
      ["仓猝", "仓促"],
      ["门庭冷落", "家门冷清"],
      ["耆老", "乡里长者"],
      ["辟你为记室", "请你做幕僚文书"],
      ["纳绢代役", "交钱免役"],
      ["骑射", "骑马射箭"],
      ["投笔从戎", "弃文从军"],
      ["焚膏继晷", "日夜苦读"],
      ["檐马声稀", "屋檐风铃声也少了"],
      ["益州", "益州（蜀地）"],
      ["陇右", "西北边地"],
      ["落孙山", "考试落榜"],
      ["中规中举", "稳妥应试"],
      ["棱角暗藏", "心里不服但先忍着"],
      ["孤芳自赏", "只给自己看"],
      ["清议难避", "难免被人议论"],
    ];
    MAP.forEach(function (pair) {
      s = s.replace(new RegExp(pair[0], "g"), pair[1]);
    });
    return s;
  }

  function rollStatsForOrigin(origin) {
    const ranges = ORIGIN_RANGES[origin];
    const stats = {};
    STAT_KEYS.forEach(function (k) {
      const r = ranges[k];
      stats[k] = clampStat(randInt(r[0], r[1]));
    });
    return stats;
  }

  function dwellingFrom家境(v) {
    if (v >= 65) return "府邸";
    if (v >= 35) return "宅院";
    return "寒舍";
  }

  function silverFrom家境(家境) {
    return Math.max(5, Math.round(12 + 家境 * 0.88));
  }

  function genFamily(character) {
    const father = {
      title: "父亲",
      callName: pick(FATHER_NAMES),
      affinity: randInt(45, 70),
      status: "康健",
    };
    const mother = {
      title: "母亲",
      callName: pick(MOTHER_NAMES),
      affinity: randInt(48, 75),
      status: "操劳持家",
    };
    const nSib = randInt(1, 2);
    const siblings = [];
    const pool = character.gender === "男"
      ? ["长姊", "幼弟", "幼妹"]
      : ["长兄", "幼弟", "幼妹"];
    for (let i = 0; i < nSib; i++) {
      siblings.push({
        title: pool[i] || "手足",
        name: character.gender === "男" ? pick(FEMALE_NAMES) : pick(MALE_NAMES),
        affinity: randInt(40, 68),
        status: "同在檐下",
      });
    }
    return { father, mother, siblings, siblingAffinity: randInt(42, 65) };
  }

  function randomCharacter() {
    const gender = Math.random() < 0.5 ? "男" : "女";
    const origin = pick(ORIGINS);
    const city = pick(CITIES);
    const stats = rollStatsForOrigin(origin);
    const silver = silverFrom家境(stats.家境);
    const land = randInt(0, Math.floor(stats.家境 / 25));
    return {
      familyName: pick(SURNAMES),
      givenName: gender === "男" ? pick(MALE_NAMES) : pick(FEMALE_NAMES),
      gender: gender,
      origin: origin,
      city: city,
      age: 0,
      stats: stats,
      path: null,
    };
  }

  function lifePhase(age) {
    if (age <= 5) return "童蒙";
    if (age <= 14) return "少岁";
    if (age <= 22) return "及冠";
    if (age <= 54) return "壮年";
    return "暮年";
  }

  function getStatusLine(state) {
    const a = state.character.age;
    const y = ERA_START + a;
    return lifePhase(a) + " · 公元 " + y + " 年 · " + state.character.city;
  }

  function showScreen(name) {
    Object.keys(screens).forEach(function (k) {
      screens[k].classList.remove("active");
    });
    screens[name].classList.add("active");
  }

  /** 关键年龄节点：保证人生节奏有“关口感” */
  const MILESTONE_EVENTS = {
    6: function (state) {
      return {
        scene: "home",
        title: "六岁开蒙",
        text: "家中择日行开蒙礼。塾师执笔点额，问你往后愿走何途。",
        choices: [
          { label: "先立规矩，从《千字文》起。", note: "根基稳实，心性亦定。", delta: { 才学: 5, 心性: 4 } },
          { label: "愿习骑射，不只困于案前。", note: "筋骨见长，志气稍扬。", delta: { 体魄: 5, 才学: 1 } },
          { label: "想先看人间百业，再定志向。", note: "眼界先开。", delta: { 心性: 4, 声望: 2 } },
        ],
      };
    },
    15: function (state) {
      var genderLabel = state.character.gender === "男" ? "及冠之礼" : "及笄之礼";
      return {
        scene: "city",
        title: genderLabel,
        text: "宗族为你设礼，亲长与宾朋俱在。礼成之后，人人都在等你表明往后之志。",
        choices: [
          { label: "立志读书求仕。", note: "以经史为阶，愿登公门。", delta: { 才学: 6, 声望: 4, path: "读书求仕" } },
          { label: "愿试商路，先从市井学起。", note: "利与险并行。", delta: { 家境: 4, 心性: 3, path: "经商" } },
          { label: "愿习兵事，以身许国。", note: "弓马之外，亦见风霜。", delta: { 体魄: 7, 声望: 3, path: "从军" } },
        ],
      };
    },
    22: function (state) {
      return {
        scene: "city",
        title: "立身抉择",
        text: "二十有二，旧日同伴多已各归其途。你亦须定下一条可长可久的路。",
        choices: [
          { label: "先求一职，稳住家门生计。", note: "脚下渐稳。", delta: { 家境: 6, 声望: 3 } },
          { label: "再磨三年技艺，不急一时。", note: "厚积待发。", delta: { 才学: 5, 心性: 4 } },
          { label: "远行他州，凭本事闯一番。", note: "见识大增，劳顿亦多。", delta: { 声望: 4, 体魄: -2, 家境: 2 } },
        ],
      };
    },
  };

  /** 事件池无匹配时的兜底（理论上极少触发） */
  function fallbackEvent() {
    return {
      scene: "home",
      title: "静岁",
      text: "这一年无甚波澜，唯有案头尘起、檐马声稀。你自问可曾虚度光阴？",
      choices: [
        { label: "闭门读书，以自砥砺。", note: "寸进亦是进。", delta: { 才学: 4 } },
        { label: "走访亲友，叙寒暄。", note: "人情温厚。", delta: { 声望: 3, 家境: -1 } },
        { label: "调养身体，早眠早起。", note: "神气渐清。", delta: { 体魄: 4 } },
      ],
    };
  }

  function pickMilestoneEvent(state) {
    const builder = MILESTONE_EVENTS[state.character.age];
    if (!builder) return null;
    if (state.milestonesDone[state.character.age]) return null;
    const evt = builder(state);
    state.milestonesDone[state.character.age] = true;
    return evt;
  }

  function pickEvent(state) {
    const age = state.character.age;
    const origin = state.character.origin;
    const EVENTS = window.GAME_EVENTS || [];
    const pool = EVENTS.filter(function (e) {
      if (age < e.minAge || age > e.maxAge) return false;
      if (e.origins && e.origins.indexOf(origin) === -1) return false;
      return true;
    });
    if (!pool.length) return null;
    let total = 0;
    pool.forEach(function (e) {
      let w = e.weight || 1;
      if (e.originBias && e.originBias[origin]) w *= e.originBias[origin];
      // 降低连续重复事件，避免“同一年味道”过强
      if (state.recentEventTitles.indexOf(e.title) !== -1) w *= 0.25;
      if (state.character.path && e.pathBias && e.pathBias[state.character.path]) {
        w *= e.pathBias[state.character.path];
      }
      if (age <= 5 && e.minAge <= 2) w *= 1.1;
      if (age >= 23 && e.maxAge >= 30) w *= 1.1;
      total += w;
    });
    let r = Math.random() * total;
    for (let i = 0; i < pool.length; i++) {
      let w = pool[i].weight || 1;
      if (pool[i].originBias && pool[i].originBias[origin]) w *= pool[i].originBias[origin];
      if (state.recentEventTitles.indexOf(pool[i].title) !== -1) w *= 0.25;
      if (state.character.path && pool[i].pathBias && pool[i].pathBias[state.character.path]) {
        w *= pool[i].pathBias[state.character.path];
      }
      if (age <= 5 && pool[i].minAge <= 2) w *= 1.1;
      if (age >= 23 && pool[i].maxAge >= 30) w *= 1.1;
      r -= w;
      if (r <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  }

  function normalizeDelta(delta) {
    const d = Object.assign({}, delta || {});
    return d;
  }

  function ensureYearActionUsage(state) {
    if (!state.yearActionUsage || state.yearActionUsage.age !== state.character.age) {
      state.yearActionUsage = { age: state.character.age, used: {} };
    }
  }

  function isYearActionUsed(state, key) {
    ensureYearActionUsage(state);
    return !!state.yearActionUsage.used[key];
  }

  function markYearActionUsed(state, key) {
    ensureYearActionUsage(state);
    state.yearActionUsage.used[key] = true;
  }

  function handleRelationAction(state, actionKey) {
    if (isYearActionUsed(state, actionKey)) return;

    var line = "";
    if (actionKey === "greetParents") {
      const plus = 3 + randInt(0, 2);
      applyDelta(state, { 父亲: plus, 母亲: plus, 心性: 1 });
      line = "晨昏定省，你向双亲问安。父母神色稍和，家中气氛也更安稳。";
    } else if (actionKey === "spendWithSiblings") {
      applyDelta(state, { 手足: 5, 心性: 2, 体魄: 1 });
      line = "你与手足同游坊巷、闲话家常。争执少了，情分更近。";
    } else if (actionKey === "familyDuty") {
      // 同一按钮内做二选一，形成轻度风险/回报。
      if (Math.random() < 0.5) {
        applyDelta(state, { 银钱: 5, 父亲: -2, 母亲: -1, 心性: -1 });
        line = "你开口向家里索要资助，银钱宽裕了些，但长辈脸色不太好看。";
      } else {
        applyDelta(state, { 银钱: 3, 父亲: 3, 母亲: 3, 心性: 2, 体魄: -1 });
        line = "你替家里跑腿办事、对账收支，虽有些劳累，却更得长辈信任。";
      }
    } else {
      return;
    }

    markYearActionUsed(state, actionKey);

    const when = "公元 " + (ERA_START + state.character.age) + " 年（" + state.character.age + " 岁）";
    prependFeed(state, '<div class="when">' + when + "</div>" + line);
    renderHeader(state);
    renderStatBars(state);
    // 保持在关系页实时刷新按钮状态
    openSubpage("relations");
  }

  function applyDelta(state, delta) {
    const d = normalizeDelta(delta);
    const c = state.character;

    STAT_KEYS.forEach(function (k) {
      if (d[k] != null) c.stats[k] = clampStat(c.stats[k] + d[k]);
    });

    if (d.银钱 != null) {
      state.assets.silver = Math.max(0, Math.round(state.assets.silver + d.银钱));
    }
    if (d.田亩 != null) state.assets.land = Math.max(0, state.assets.land + d.田亩);

    if (d.父亲 != null) state.family.father.affinity = clampStat(state.family.father.affinity + d.父亲);
    if (d.母亲 != null) state.family.mother.affinity = clampStat(state.family.mother.affinity + d.母亲);
    if (d.手足 != null) state.family.siblingAffinity = clampStat(state.family.siblingAffinity + d.手足);

    if (d.path && !c.path) c.path = d.path;

    state.assets.dwelling = dwellingFrom家境(c.stats.家境);
  }

  function renderHeader(state) {
    const c = state.character;
    document.getElementById("hdr-name").textContent = c.familyName + c.givenName;
    document.getElementById("hdr-gender").textContent = c.gender === "男" ? "男子" : "女子";
    document.getElementById("hdr-origin").textContent = c.origin;
    document.getElementById("hdr-city").textContent = c.city;
    document.getElementById("hdr-age").textContent = String(c.age);
    document.getElementById("hdr-phase").textContent = lifePhase(c.age);
    document.getElementById("hdr-avatar").src = PORTRAIT[c.gender] || PORTRAIT["男"];
    document.getElementById("hdr-wealth").textContent = String(state.assets.silver);
    document.getElementById("hdr-status").textContent = getStatusLine(state);
    var pathEl = document.getElementById("hdr-path");
    if (pathEl) pathEl.textContent = c.path ? "志业：" + c.path : "志业未定向";
  }

  function renderStatBars(state) {
    const host = document.getElementById("stat-bars");
    const s = state.character.stats;
    host.innerHTML = STAT_KEYS.map(function (k) {
      const v = s[k];
      const meta = STAT_META[k];
      return (
        '<div class="stat-row">' +
        '<span class="stat-ico">' + meta.emoji + "</span>" +
        '<span class="stat-name">' + meta.label + '</span>' +
        '<div class="stat-track"><div class="stat-fill ' + meta.cls + '" style="width:' + v + '%"></div></div>' +
        '<span class="stat-pct">' + v + "</span>" +
        "</div>"
      );
    }).join("");
  }

  function renderEventCard(state) {
    const el = document.getElementById("event-card");
    if (!el) return;
    if (!state.lastEvent) {
      el.innerHTML = '<p class="event-card-placeholder">本年尚未推进光阴。点击「加一岁」以观际遇。</p>';
      return;
    }
    const e = state.lastEvent;
    el.innerHTML =
      '<h3 class="event-card-title">' +
      readableCopy(e.title) +
      "</h3>" +
      '<p class="event-card-desc">' +
      readableCopy(e.text) +
      "</p>" +
      '<p class="event-card-result">上年取舍：' +
      readableCopy(e.resultLabel) +
      " — " +
      readableCopy(e.resultNote) +
      "</p>";
  }

  function prependFeed(state, htmlLine) {
    state.feed = state.feed || [];
    state.feed.unshift({ html: htmlLine });
    renderFeed(state);
  }

  function renderFeed(state) {
    const el = document.getElementById("life-feed");
    if (!state.feed || !state.feed.length) {
      el.innerHTML =
        '<div class="feed-hint">纪事将随年岁增长而累叠。<br />请先点击底栏「加一岁」。</div>';
      return;
    }
    el.innerHTML = state.feed
      .map(function (row) {
        return '<div class="feed-line">' + row.html + "</div>";
      })
      .join("");
  }

  function openEventModal(evt) {
    modalOpen = true;
    var sceneKey = evt.scene && SCENES[evt.scene] ? evt.scene : "city";
    document.getElementById("modal-scene").src = SCENES[sceneKey];
    document.getElementById("modal-scene-tag").textContent = SCENE_LABEL[sceneKey] || "城邑";
    document.getElementById("modal-title").textContent = readableCopy(evt.title);
    document.getElementById("modal-body").textContent = readableCopy(evt.text);
    const box = document.getElementById("modal-choices");
    box.innerHTML = "";
    evt.choices.forEach(function (c, i) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.textContent = i + 1 + "）" + readableCopy(c.label);
      btn.addEventListener("click", function () {
        resolveEventChoice(gameState, evt, c);
      });
      box.appendChild(btn);
    });
    const m = document.getElementById("event-modal");
    m.classList.add("open");
    m.setAttribute("aria-hidden", "false");
    setAgeButtonState();
  }

  function setAgeButtonState() {
    const btn = document.getElementById("btn-next-year");
    btn.disabled = modalOpen || subpageOpen;
  }

  function closeEventModal() {
    modalOpen = false;
    const m = document.getElementById("event-modal");
    m.classList.remove("open");
    m.setAttribute("aria-hidden", "true");
    setAgeButtonState();
  }

  function resolveEventChoice(state, evt, choice) {
    applyDelta(state, choice.delta);
    const c = state.character;
    const when = "公元 " + (ERA_START + c.age) + " 年（" + c.age + " 岁）";
    const line =
      '<div class="when">' +
      when +
      "</div>" +
      "「" +
      readableCopy(evt.title) +
      "」" +
      readableCopy(choice.label).replace(/。$/, "") +
      "。" +
      readableCopy(choice.note);
    prependFeed(state, line);

    state.lastEvent = {
      title: readableCopy(evt.title),
      text: readableCopy(evt.text),
      resultLabel: readableCopy(choice.label),
      resultNote: readableCopy(choice.note),
    };
    state.journal = state.journal || [];
    state.journal.push({ age: c.age, title: evt.title, note: choice.note });
    state.recentEventTitles.push(evt.title);
    state.recentEventTitles = state.recentEventTitles.slice(-3);

    closeEventModal();
    renderHeader(state);
    renderStatBars(state);
    renderEventCard(state);
    const d = checkDeath(state);
    if (d) endGame(state, d);
  }

  function checkDeath(state) {
    const s = state.character.stats;
    if (s.体魄 <= 0) return { text: "病重不治，药石无功。", kind: "病殁" };
    if (s.家境 <= 0 && state.character.age >= 18) return { text: "家业荡然，无以自存。", kind: "困厄" };
    if (state.character.age >= state.lifespanCap) return { text: "天年已尽，如秋叶之静美。", kind: "寿终" };
    return null;
  }

  function summarizeIdentity(state) {
    const c = state.character;
    const s = c.stats;
    var parts = [];
    if (c.path) parts.push(c.path);
    if (s.声望 >= 60) parts.push("乡里有声");
    else if (s.才学 >= 65) parts.push("文名可诵");
    if (parts.length === 0) parts.push("浮生布衣");
    return c.origin + "出身 · " + parts.join(" · ");
  }

  function epitaphTag(state) {
    const s = state.character.stats;
    if (s.声望 >= 70 && s.心性 >= 60) return "仁厚有声";
    if (s.才学 >= 75) return "文心未泯";
    if (s.家境 >= 70) return "薄有积藏";
    if (s.声望 >= 65) return "清议所推";
    if (s.容貌 >= 70) return "仪止可念";
    return "平生倜傥";
  }

  function endGame(state, reason) {
    const c = state.character;
    const s = c.stats;
    document.getElementById("end-title").textContent = "一世已矣";
    document.getElementById("end-text").textContent =
      reason.text +
      " —— 享年" +
      c.age +
      "岁。时人谓其「" +
      epitaphTag(state) +
      "」。浮生若梦，惟余纸上一行名姓。";
    document.getElementById("end-identity").textContent = summarizeIdentity(state);
    document.getElementById("end-stats").textContent =
      "体魄" +
      s.体魄 +
      " · 才学" +
      s.才学 +
      " · 容貌" +
      s.容貌 +
      " · 心性" +
      s.心性 +
      " · 家境" +
      s.家境 +
      " · 声望" +
      s.声望;
    const endImg = document.getElementById("end-portrait");
    endImg.src = PORTRAIT[c.gender] || PORTRAIT["男"];
    endImg.hidden = false;
    gameState = null;
    closeEventModal();
    closeSubpage();
    showScreen("end");
  }

  function openSubpage(id) {
    if (!gameState) return;
    const titles = {
      family: "家庭",
      study: "学业与技艺",
      career: "仕途与营生",
      relations: "关系",
      assets: "资产",
    };
    document.getElementById("subpage-title").textContent = titles[id] || "";
    const body = document.getElementById("subpage-body");
    body.innerHTML = "";
    body.classList.remove("subpage-body-center");
    if (id === "family") body.innerHTML = renderFamilyHtml(gameState);
    else if (id === "study") body.innerHTML = renderStudyHtml(gameState);
    else if (id === "career") body.innerHTML = renderCareerHtml(gameState);
    else if (id === "relations") body.innerHTML = renderRelationsHtml(gameState);
    else if (id === "assets") body.innerHTML = renderAssetsHtml(gameState);
    document.getElementById("subpage-root").classList.add("open");
    document.getElementById("subpage-root").setAttribute("aria-hidden", "false");
    subpageOpen = true;
    setAgeButtonState();
  }

  function affinityBar(v) {
    var pct = clampStat(v);
    return (
      '<div class="affinity-track"><div class="affinity-fill" style="width:' + pct + '%"></div></div><span class="affinity-num">' +
      pct +
      "</span>"
    );
  }

  function renderFamilyHtml(state) {
    const f = state.family;
    let html = '<div class="detail-sheet">';
    html +=
      '<div class="detail-row"><span class="detail-k">' +
      f.father.title +
      "（" +
      f.father.callName +
      '）</span><span class="detail-v">' +
      f.father.status +
      "</span></div>";
    html += '<div class="detail-sub">亲睦 ' + affinityBar(f.father.affinity) + "</div>";
    html +=
      '<div class="detail-row"><span class="detail-k">' +
      f.mother.title +
      "（" +
      f.mother.callName +
      '）</span><span class="detail-v">' +
      f.mother.status +
      "</span></div>";
    html += '<div class="detail-sub">亲睦 ' + affinityBar(f.mother.affinity) + "</div>";
    f.siblings.forEach(function (s, i) {
      html +=
        '<div class="detail-row"><span class="detail-k">' +
        s.title +
        " " +
        s.name +
        '</span><span class="detail-v">' +
        s.status +
        "</span></div>";
    });
    html +=
      '<div class="detail-sub">手足情谊 ' + affinityBar(f.siblingAffinity) + "（合户手足）</div>";
    html += "</div>";
    return html;
  }

  function renderStudyHtml(state) {
    const c = state.character;
    var p = c.path;
    var line = "你在蒙学、经馆与自修之间辗转，尚未定格。";
    if (p === "读书求仕") line = "你已偏向举业与经史，案头常置墨卷。";
    else if (p === "学医") line = "方书脉案渐熟，仁术之心日长。";
    else if (p === "乐坊") line = "音律指法用功不辍，雅部俗部略知门径。";
    else if (p === "经商") line = "市估贵贱、契券往来，你已略窥堂奥。";
    return (
      '<div class="detail-sheet prose-block"><p>' +
      line +
      "</p><p class=\"muted\">第一版仅作志向雏形，后续可扩展师徒、书目与考课。</p></div>"
    );
  }

  function renderCareerHtml(state) {
    const c = state.character;
    var p = c.path;
    var line = "仕途与营生千途万径，机缘未至时且修身俟命。";
    if (p === "读书求仕") line = "幕职、教职与举场，皆可徐徐图之。";
    else if (p === "从军") line = "弓马行阵已非纸上，然功名尚待边功。";
    else if (p === "经商") line = "舟车市舶，利险相随，须守契与信。";
    else if (p === "学医") line = "方脉针石，贵在仁心与阅历；公门医署亦可徐徐图之。";
    else if (p === "乐坊") line = "教坊梨园，雅俗之间皆有生计，惟清议难避。";
    return (
      '<div class="detail-sheet prose-block"><p>' +
      line +
      "</p><p class=\"muted\">官职阶秩将在后续版本细化。</p></div>"
    );
  }

  function renderRelationsHtml(state) {
    var canGreet = !isYearActionUsed(state, "greetParents");
    var canSiblings = !isYearActionUsed(state, "spendWithSiblings");
    var canFamilyDuty = !isYearActionUsed(state, "familyDuty");
    return (
      '<div class="detail-sheet prose-block">' +
      "<p>亲族详列见「家庭」。这一版先开放三项日常互动，每项每年可做一次。</p>" +
      '<div class="detail-row"><span class="detail-k">问候父母</span><span class="detail-v">' +
      (canGreet ? "可进行" : "本年已做") +
      "</span></div>" +
      '<button type="button" class="subpage-back" data-rel-action="greetParents" ' +
      (canGreet ? "" : "disabled") +
      '>问候父母</button>' +
      '<div class="detail-row"><span class="detail-k">与手足相处</span><span class="detail-v">' +
      (canSiblings ? "可进行" : "本年已做") +
      "</span></div>" +
      '<button type="button" class="subpage-back" data-rel-action="spendWithSiblings" ' +
      (canSiblings ? "" : "disabled") +
      '>与手足相处</button>' +
      '<div class="detail-row"><span class="detail-k">索要资助 / 帮家里做事</span><span class="detail-v">' +
      (canFamilyDuty ? "可进行" : "本年已做") +
      "</span></div>" +
      '<button type="button" class="subpage-back" data-rel-action="familyDuty" ' +
      (canFamilyDuty ? "" : "disabled") +
      '>索要资助 / 帮家里做事</button>' +
      '<p class="muted">每次互动都会立即影响好感、家境或个人状态。</p>' +
      "</div>"
    );
  }

  function renderAssetsHtml(state) {
    const a = state.assets;
    const d = a.dwelling;
    return (
      '<div class="detail-sheet">' +
      '<div class="detail-row"><span class="detail-k">现银（概数）</span><span class="detail-v">' +
      a.silver +
      " 贯</span></div>" +
      '<div class="detail-row"><span class="detail-k">田产</span><span class="detail-v">' +
      a.land +
      " 亩</span></div>" +
      '<div class="detail-row"><span class="detail-k">住处</span><span class="detail-v">' +
      d +
      "</span></div>" +
      '<p class="muted small">银钱随际遇与家境浮动；住处随家境升降。</p>' +
      "</div>"
    );
  }

  function closeSubpage() {
    document.getElementById("subpage-root").classList.remove("open");
    document.getElementById("subpage-root").setAttribute("aria-hidden", "true");
    subpageOpen = false;
    setAgeButtonState();
  }

  function tryAdvanceYear() {
    if (!gameState || modalOpen || subpageOpen) return;
    const state = gameState;
    state.character.age += 1;
    const death = checkDeath(state);
    if (death) {
      renderHeader(state);
      renderStatBars(state);
      endGame(state, death);
      return;
    }
    const evt = pickMilestoneEvent(state) || pickEvent(state) || fallbackEvent();
    renderHeader(state);
    renderStatBars(state);
    openEventModal(evt);
  }

  function initPlay(state) {
    state.feed = [];
    state.lastEvent = null;
    prependFeed(
      state,
      '<div class="when">' +
        ERA_NAME +
        "元年（0 岁）</div>你降生于" +
        state.character.city +
        "一带，" +
        state.character.origin +
        "之门庭。此后每岁可点「加一岁」，观际遇起伏。"
    );
    renderHeader(state);
    renderStatBars(state);
    renderEventCard(state);
    setAgeButtonState();
  }

  function startGame() {
    var manualFamily = document.getElementById("familyName").value.trim();
    var manualGiven = document.getElementById("givenName").value.trim();
    var manualGender = document.getElementById("gender").value;

    var ch = randomCharacter();
    if (manualFamily) ch.familyName = manualFamily.slice(0, 2);
    if (manualGiven) ch.givenName = manualGiven.slice(0, 4);
    if (manualGender) ch.gender = manualGender;

    const family = genFamily(ch);
    const assets = {
      silver: silverFrom家境(ch.stats.家境),
      land: randInt(0, Math.floor(ch.stats.家境 / 22)),
      dwelling: dwellingFrom家境(ch.stats.家境),
    };

    gameState = {
      character: ch,
      family: family,
      assets: assets,
      feed: [],
      journal: [],
      yearActionUsage: { age: 0, used: {} },
      milestonesDone: {},
      recentEventTitles: [],
      lastEvent: null,
      lifespanCap: 65 + randInt(0, 28),
    };

    showScreen("play");
    initPlay(gameState);
  }

  document.getElementById("btn-next-year").addEventListener("click", tryAdvanceYear);
  document.getElementById("subpage-back").addEventListener("click", closeSubpage);
  document.getElementById("subpage-body").addEventListener("click", function (ev) {
    var target = ev.target;
    if (!target || !target.dataset) return;
    var action = target.dataset.relAction;
    if (!action || !gameState) return;
    handleRelationAction(gameState, action);
  });

  document.getElementById("btn-family").addEventListener("click", function () {
    openSubpage("family");
  });
  document.getElementById("btn-study").addEventListener("click", function () {
    openSubpage("study");
  });
  document.getElementById("btn-career").addEventListener("click", function () {
    openSubpage("career");
  });
  document.getElementById("btn-relations").addEventListener("click", function () {
    openSubpage("relations");
  });
  document.getElementById("btn-assets").addEventListener("click", function () {
    openSubpage("assets");
  });

  document.getElementById("btn-start").addEventListener("click", startGame);
  document.getElementById("btn-restart").addEventListener("click", function () {
    document.getElementById("end-portrait").hidden = true;
    showScreen("create");
  });

  document.getElementById("btn-randomize").addEventListener("click", function () {
    var ch = randomCharacter();
    document.getElementById("familyName").value = ch.familyName;
    document.getElementById("givenName").value = ch.givenName;
    document.getElementById("gender").value = ch.gender;
  });
})();
