/**
 * 事件池：独立数据，便于扩展。
 * minAge/maxAge：触发年龄段；weight：基础权重；
 * originBias：出身额外乘数（缺省为 1）；origins：仅这些出身可出现（缺省为全部）。
 * choices[].delta：可含六维属性、银钱、田亩、亲缘好感（父亲/母亲/手足）、路径 path。
 */
window.GAME_EVENTS = [
  /* —— 幼年 0~5 —— */
  {
    minAge: 0, maxAge: 1, weight: 3, scene: "home",
    originBias: { 士族: 1.3, 商贾: 1.1 },
    title: "抓周礼",
    text: "周岁席上，笔墨、弓刀、算盘与脂粉一并排开。亲长含笑，看你爬向何物。",
    choices: [
      { label: "一把抓住毛笔，蘸墨乱涂。", note: "人谓“文脉有根”。", delta: { 才学: 6, 心性: 2 } },
      { label: "抱住小弓不放，咯咯直笑。", note: "尚武之气初见。", delta: { 体魄: 5, 才学: -2 } },
      { label: "只抓着糕饼往嘴里送。", note: "口腹之福，亦是一缘。", delta: { 体魄: 3, 家境: -1 } },
    ],
  },
  {
    minAge: 0, maxAge: 3, weight: 2, scene: "home",
    title: "襁褓风波",
    text: "夜来啼哭不止，大夫诊脉后嘱慎风寒。母亲衣不解带，家中亦因此费了些汤药钱。",
    choices: [
      { label: "家人厚待汤药，细心调养。", note: "体弱渐平，家赀略损。", delta: { 体魄: 4, 家境: -4, 母亲: 5 } },
      { label: "改用土方与艾灸，少进贵药。", note: "省钱而见效慢。", delta: { 体魄: 1, 家境: 1, 母亲: 3 } },
    ],
  },
  {
    minAge: 1, maxAge: 5, weight: 2, scene: "home",
    title: "庭前学步",
    text: "柳线垂阶，你扶墙学走，几次跌倒又爬起。乳母在旁，或搀或笑。",
    choices: [
      { label: "跌撞再试，终走得数步。", note: "筋骨渐壮。", delta: { 体魄: 6, 心性: 3 } },
      { label: "哭闹要抱，不肯再试。", note: "娇养之态。", delta: { 体魄: -2, 家境: -1 } },
    ],
  },
  {
    minAge: 2, maxAge: 5, weight: 2, scene: "city",
    title: "邻家爆竹",
    text: "除日邻家爆竹声声，你或惊或喜。父亲教你捂耳，母亲却说“岁岁平安”。",
    choices: [
      { label: "好奇探头去看火花。", note: "胆气略增。", delta: { 体魄: 2, 心性: 4, 父亲: 2 } },
      { label: "躲入母亲怀中。", note: "性情柔顺。", delta: { 心性: 5, 母亲: 4 } },
    ],
  },
  {
    minAge: 3, maxAge: 5, weight: 2, scene: "home",
    title: "竹马嬉春",
    text: "庭前杏花初开，邻童邀你追逐。先生却嘱你认字。父亲抚须而立，似在等你一句说法。",
    choices: [
      { label: "随顽童嬉闹半日，归来再临帖。", note: "筋骨结实，笔墨稍疏。", delta: { 体魄: 6, 才学: -3 } },
      { label: "婉拒嬉戏，整日摹写《千字文》。", note: "字渐端正，久坐体倦。", delta: { 才学: 8, 体魄: -4 } },
      { label: "对弈戏棋，胜负次之。", note: "幼有“早慧”之评。", delta: { 才学: 3, 声望: 2 } },
    ],
  },

  /* —— 启蒙 6~14 —— */
  {
    minAge: 6, maxAge: 10, weight: 3, scene: "home",
    originBias: { 士族: 1.25, 寒门: 1.15 },
    title: "开蒙识字",
    text: "塾师执戒尺而坐，授你《急就篇》。同窗或窃语，或肃坐。窗外蝉声一阵紧似一阵。",
    choices: [
      { label: "高声诵读，务求先背熟。", note: "记诵日进。", delta: { 才学: 8, 体魄: -2 } },
      { label: "先求写端正，背诵稍缓。", note: "字有骨力。", delta: { 才学: 5, 心性: 4 } },
      { label: "与同窗递纸条玩笑。", note: "人缘尚可，学业稍荒。", delta: { 声望: 3, 才学: -4 } },
    ],
  },
  {
    minAge: 7, maxAge: 12, weight: 2, scene: "home",
    title: "塾中罚站",
    text: "背书不熟，先生令你持简立于廊下。日影移动，足酸而心愧。",
    choices: [
      { label: "忍羞立完，夜里加倍温习。", note: "知耻后勇。", delta: { 才学: 7, 心性: 5 } },
      { label: "心中不服，口上仍应。", note: "棱角暗藏。", delta: { 心性: -3, 才学: 2 } },
    ],
  },
  {
    minAge: 8, maxAge: 14, weight: 2, scene: "city",
    title: "坊间说书",
    text: "西市人声鼎沸，说书人拍醒木讲古。你挤在人群里听得入神，忽闻身后有人问：课业可曾做完？",
    choices: [
      { label: "再听一回《游侠列传》，回家连夜补功课。", note: "热血与墨香并存。", delta: { 声望: 4, 才学: 5, 体魄: -2 } },
      { label: "立刻折返，闭门读书。", note: "邻里说你少年老成。", delta: { 才学: 6, 声望: -2 } },
      { label: "以几枚铜钱换一句“续貂”，作文时引用。", note: "文有奇气，囊中略绌。", delta: { 家境: -3, 才学: 4, 声望: 3 } },
    ],
  },
  {
    minAge: 8, maxAge: 14, weight: 2, scene: "home",
    title: "手足之争",
    text: "案上糕饼只剩一块，你与手足争执不下。母亲在厨下唤你们让一让。",
    choices: [
      { label: "主动让与年幼者。", note: "礼让之名。", delta: { 心性: 6, 母亲: 5, 手足: 4 } },
      { label: "据理力争，各分一半。", note: "不亏不欠。", delta: { 心性: 2, 手足: -2 } },
      { label: "赌气不食。", note: "孩童意气。", delta: { 体魄: -2, 父亲: -2 } },
    ],
  },
  {
    minAge: 9, maxAge: 14, weight: 2, scene: "city",
    originBias: { 商贾: 1.3 },
    title: "随父赴市",
    text: "阿爷带你穿过东西二市，胡商陈列琉璃香料，米行议价声不绝于耳。",
    choices: [
      { label: "留心议价与秤砣。", note: "稍解营生。", delta: { 心性: 4, 才学: 2, 父亲: 4, path: "经商" } },
      { label: "只看热闹，不问贵贱。", note: "眼界开而算学无增。", delta: { 声望: 2, 体魄: 2 } },
    ],
  },
  {
    minAge: 7, maxAge: 14, weight: 1, scene: "home",
    title: "疫疠流言",
    text: "坊间纷传城外有疫，母亲令你勿再往学馆。馆长遣经卷来，称可自行抄诵。",
    choices: [
      { label: "遵母命居家抄书，周济邻家童子粥饭。", note: "乡里称仁。", delta: { 才学: 4, 家境: -5, 母亲: 6, 声望: 3 } },
      { label: "随亲眷暂避乡墅。", note: "避祸得安，声名略损。", delta: { 体魄: 4, 声望: -3, 家境: -6 } },
      { label: "仍赴学馆，与同窗论辨虚实。", note: "意气可嘉，亦可伤身。", delta: { 声望: 5, 体魄: -5, 才学: 3 } },
    ],
  },

  /* —— 成年初期 15~22 —— */
  {
    minAge: 10, maxAge: 18, weight: 2, scene: "home",
    title: "尊亲违和",
    text: "父亲连日咳嗽，案上公文堆积。大夫说须静养，又需贵重药材。",
    choices: [
      { label: "亲侍汤药，代阅家书。", note: "孝行可感。", delta: { 父亲: 10, 家境: -8, 才学: 3 } },
      { label: "仍以外出会友为先。", note: "亲心稍凉。", delta: { 声望: 3, 父亲: -8, 心性: -4 } },
      { label: "变卖家藏古籍以凑药费。", note: "家学有损，亲体得养。", delta: { 家境: -10, 才学: -3, 父亲: 6 } },
    ],
  },
  {
    minAge: 13, maxAge: 20, weight: 2, scene: "wild",
    originBias: { 军户: 1.4 },
    title: "试弓骑马",
    text: "郊原草长，你从教习学骑射。马性尚烈，一次险些坠鞍。",
    choices: [
      { label: "再试，终能策马小圈。", note: "骑射稍进。", delta: { 体魄: 8, 才学: 2, path: "从军" } },
      { label: "改练步射，不勉强控马。", note: "稳妥。", delta: { 体魄: 4, 心性: 5 } },
      { label: "推说文书要紧，辞归书斋。", note: "武事生疏。", delta: { 才学: 5, 体魄: -2 } },
    ],
  },
  {
    minAge: 14, maxAge: 22, weight: 2, scene: "city",
    title: "曲江雅集",
    text: "春日曲江，士子佩茱萸。旧识邀你入诗社斗篇，又有人邀观胡旋舞，囊中有限。",
    choices: [
      { label: "赴诗社，酌酒成诗一首。", note: "清词传闻。", delta: { 声望: 8, 才学: 6, 家境: -4 } },
      { label: "观舞为乐，与胡商闲话丝路。", note: "眼界日阔。", delta: { 体魄: 3, 声望: 3, 才学: -2 } },
      { label: "婉谢两处，返家温习律赋。", note: "科考基渐牢。", delta: { 才学: 10, 声望: -4 } },
    ],
  },
  {
    minAge: 15, maxAge: 22, weight: 2, scene: "city",
    title: "议亲之说",
    text: "族中长辈提及姻事，或云某氏门第相配，或云再缓一科。你心下纷乱。",
    choices: [
      { label: "听从父母之命，以为正理。", note: "礼法俨然。", delta: { 心性: 3, 母亲: 5, 声望: 2 } },
      { label: "以功名未立恳辞。", note: "志在青云。", delta: { 才学: 5, 声望: 4, 母亲: -2 } },
      { label: "坦言已有心上人（不论虚实）。", note: "风波乍起。", delta: { 心性: 6, 父亲: -4, 声望: -2 } },
    ],
  },
  {
    minAge: 16, maxAge: 22, weight: 2, scene: "city",
    originBias: { 士族: 1.2, 寒门: 1.25 },
    title: "童子试与乡试",
    text: "场屋肃静，墨香与汗气混杂。你展卷构思，日影渐西。",
    choices: [
      { label: "按题稳扎稳打，不求险句。", note: "中规中举之机。", delta: { 才学: 6, 声望: 5, path: "读书求仕" } },
      { label: "立意奇崛，博座师一顾。", note: "或一鸣惊人，或落孙山。", delta: { 才学: 4, 声望: 8, 体魄: -4 } },
      { label: "场后自忖无望，转思他途。", note: "早作第二番打算。", delta: { 心性: 5, path: "经商" } },
    ],
  },
  {
    minAge: 15, maxAge: 25, weight: 2, scene: "home",
    title: "寒门知己",
    text: "邻巷有少年出身寒微，却好读书。你们月下论史，常至鸡鸣。",
    choices: [
      { label: "赠以旧籍与笔墨。", note: "义声小著。", delta: { 家境: -3, 声望: 5, 才学: 3 } },
      { label: "仅道义相交，不涉财物。", note: "清交如水。", delta: { 才学: 4, 心性: 5 } },
      { label: "渐与疏远，恐累及声名。", note: "势利之讥。", delta: { 声望: -4, 心性: -5 } },
    ],
  },
  {
    minAge: 15, maxAge: 28, weight: 1, scene: "city",
    origins: ["乐籍"],
    title: "乐坊雅集",
    text: "教坊新谱一曲，名伶云集。主事问你：可愿习拍板度曲，抑或只作座上宾？",
    choices: [
      { label: "习音律指法，朝夕不辍。", note: "技艺日进。", delta: { 才学: 6, 容貌: 5, 声望: 3, path: "乐坊" } },
      { label: "只观不演，结交词客。", note: "清名可保。", delta: { 声望: 4, 才学: 4 } },
    ],
  },
  {
    minAge: 16, maxAge: 35, weight: 1, scene: "home",
    origins: ["医家"],
    title: "医案初涉",
    text: "家中藏有《千金方》残卷，尊长问你：可愿抄录方书，随堂兄识药？",
    choices: [
      { label: "潜心抄方，随诊辨脉。", note: "仁术有基。", delta: { 才学: 7, 心性: 6, path: "学医" } },
      { label: "唯略知头痛医头，仍以举业为先。", note: "医名不显。", delta: { 才学: 3, 体魄: 2 } },
    ],
  },

  /* —— 事业 23+ —— */
  {
    minAge: 18, maxAge: 40, weight: 2, scene: "city",
    title: "坊间流言",
    text: "里巷忽传你与某氏有私，或云你借贷不还。辩白愈急，愈似欲盖弥彰。",
    choices: [
      { label: "请乡绅耆老当众剖白。", note: "是非渐明。", delta: { 声望: 5, 才学: 2, 家境: -3 } },
      { label: "闭门不出，待风波自息。", note: "清者自清，亦损时誉。", delta: { 声望: -3, 心性: 5 } },
      { label: "讼之于官。", note: "或直或曲。", delta: { 家境: -8, 声望: 6 } },
    ],
  },
  {
    minAge: 22, maxAge: 48, weight: 2, scene: "city",
    title: "幕僚之邀",
    text: "刺史府遣人问名，欲辟你为记室；同时州学亦缺一助教。二者不可兼得。",
    choices: [
      { label: "入幕参赞文书。", note: "吏道渐熟。", delta: { 才学: 5, 声望: 6, 家境: 4, path: "读书求仕" } },
      { label: "就教职，以讲学为安。", note: "清贵而薄俸。", delta: { 才学: 7, 声望: 4, 家境: -2 } },
    ],
  },
  {
    minAge: 20, maxAge: 50, weight: 2, scene: "city",
    originBias: { 商贾: 1.35 },
    title: "商路风波",
    text: "合伙贩绢的船只迟未抵埠，有人劝你抽身，有人劝你再垫本钱。",
    choices: [
      { label: "再垫本钱，共担风险。", note: "利险相随。", delta: { 家境: 10, 体魄: -4, 声望: 3 } },
      { label: "按契抽身，保本为先。", note: "无大赢亦无大亏。", delta: { 家境: 2, 心性: 4 } },
      { label: "诉诸市舶司理论。", note: "公断费时。", delta: { 声望: 4, 家境: -5 } },
    ],
  },
  {
    minAge: 18, maxAge: 38, weight: 2, scene: "wild",
    originBias: { 军户: 1.4 },
    title: "从军征召",
    text: "边关有警，里正籍册点名。或可纳绢代役，或亲自投军。",
    choices: [
      { label: "投笔从戎，愿赴行营。", note: "弓马沙场。", delta: { 体魄: 10, 声望: 5, 家境: -4, path: "从军" } },
      { label: "纳绢免役，以保家声。", note: "财去人安。", delta: { 家境: -12, 体魄: -2 } },
    ],
  },
  {
    minAge: 22, maxAge: 55, weight: 2, scene: "city",
    title: "县务繁剧",
    text: "乡里推你评理：田亩争水、商贾债契，俱在这一纸判词上。",
    choices: [
      { label: "详查律例，迟一二日再断。", note: "百姓口碑载道。", delta: { 声望: 8, 才学: 2, 家境: 2 } },
      { label: "当场折中，早结案。", note: "事息而怨未尽。", delta: { 声望: -3, 家境: 5 } },
      { label: "请德高望重长者共审。", note: "谦抑之美。", delta: { 声望: 6, 心性: 5 } },
    ],
  },
  {
    minAge: 25, maxAge: 58, weight: 2, scene: "city",
    title: "胡商宝货",
    text: "波斯商队停驻坊市，琉璃耀目。人劝合资贩往岭南，亦有人警你市估苛杂。",
    choices: [
      { label: "倾部分家财合资，立契分明。", note: "舟车劳顿，利亦随险。", delta: { 家境: 12, 声望: 4, 体魄: -3 } },
      { label: "仅购少许玩好自藏。", note: "雅玩怡情。", delta: { 家境: -6, 声望: 2, 才学: 2 } },
      { label: "一概谢绝，志在简素。", note: "清流自许。", delta: { 声望: 5, 家境: 1 } },
    ],
  },
  {
    minAge: 20, maxAge: 60, weight: 2, scene: "home",
    originBias: { 士族: 1.2 },
    title: "家道中落",
    text: "族产讼败，或祖业被奸人侵吞。仓猝之间，门庭冷落。",
    choices: [
      { label: "典卖田亩，先渡眼前急。", note: "根基动摇。", delta: { 家境: -15, 心性: 8, 声望: -3 } },
      { label: "四处借贷，力图复兴。", note: "负债累累。", delta: { 家境: -8, 才学: 4, 体魄: -5 } },
      { label: "携眷迁居小城，另起炉灶。", note: "忍辱负重。", delta: { 声望: -5, 体魄: 3, 才学: 3 } },
    ],
  },
  {
    minAge: 28, maxAge: 60, weight: 1, scene: "home",
    title: "田产纷争",
    text: "族叔占你名下薄田数亩，契书模糊。讼则伤和，忍则损实。",
    choices: [
      { label: "据理力争，告官确权。", note: "或直或枉。", delta: { 家境: 6, 声望: 3, 心性: -3 } },
      { label: "让利三分，息事宁人。", note: "吃亏是福。", delta: { 心性: 6, 家境: -4 } },
    ],
  },
  {
    minAge: 18, maxAge: 55, weight: 1, scene: "wild",
    title: "边塞诗笺",
    text: "驿道上传唱新诗，写陇右孤烟与江南春雨。你可寄和一首，亦可沉默。",
    choices: [
      { label: "和诗投递诗肆，换少许润笔。", note: "声中渐有人知。", delta: { 才学: 5, 家境: 3, 声望: 3 } },
      { label: "抄录藏之秘箧，不示外人。", note: "孤芳自赏。", delta: { 才学: 6, 声望: -2 } },
    ],
  },
  {
    minAge: 40, maxAge: 75, weight: 2, scene: "wild",
    title: "渭水秋风",
    text: "鬓边见霜。旧友或显达或山阿。案上尚有未完稿一卷，窗外梧桐叶落如雨。",
    choices: [
      { label: "焚膏继晷，务求成书。", note: "著述心热。", delta: { 才学: 10, 体魄: -8, 声望: 5 } },
      { label: "散尽藏书，设义学教邻里童子。", note: "薪火在人间。", delta: { 家境: -10, 声望: 8, 才学: 3 } },
      { label: "游山访寺，任岁月自流。", note: "晚景清旷。", delta: { 体魄: 6, 声望: 3, 才学: 2 } },
    ],
  },
  {
    minAge: 58, maxAge: 95, weight: 2, scene: "home",
    title: "暮山钟远",
    text: "齿落发白，晨起听山寺钟声。儿孙问：可还有未了心愿？",
    choices: [
      { label: "嘱缮家训一封。", note: "家风传之默默。", delta: { 声望: 4, 才学: 3 } },
      { label: "笑曰无事，惟求晒日一晌。", note: "知足者寿。", delta: { 体魄: 4, 家境: -2 } },
      { label: "以积余助修桥，不留姓名。", note: "阴德在耳目之外。", delta: { 家境: -12, 声望: 6, 心性: 5 } },
    ],
  },
  {
    minAge: 5, maxAge: 12, weight: 1, scene: "home",
    title: "生辰小宴",
    text: "是日家中略备面汤与红卵，母亲为你量新衣。手足亦有一二贺礼。",
    choices: [
      { label: "与手足分食，叙天伦之乐。", note: "和睦。", delta: { 手足: 6, 母亲: 4, 体魄: 2 } },
      { label: "独贪糕饼，不肯分与。", note: "小过。", delta: { 手足: -4, 心性: -2 } },
    ],
  },
  {
    minAge: 23, maxAge: 50, weight: 1, scene: "city",
    title: "投卷干谒",
    text: "科举将近，友人云某公喜清谈，可托门生投卷；另有一途：捐资修寺求荐书。",
    choices: [
      { label: "亲撰长卷，躬身谒见。", note: "气节为称。", delta: { 声望: 6, 才学: 4, 家境: -3 } },
      { label: "随俗修寺，以财换名。", note: "捷径多谤。", delta: { 家境: -10, 声望: 5, 才学: -3 } },
      { label: "皆辞，闭户三年。", note: "大器晚成之象。", delta: { 才学: 12, 声望: -5 } },
    ],
  },
];
