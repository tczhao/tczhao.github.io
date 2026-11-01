/* Marginalia (批注) - Mao's Selected Works, read for method, in Chinese.
 *
 * The five volumes are read here the way the rest of these sites read their
 * canon: one idea a day, something to try at work, and old entries coming back
 * as recall questions. The difference is the corpus. Practicum's sources are
 * management writers whose advice was never tested at the scale of a country,
 * and these were, so every entry carries what happened when the idea met
 * practice. Without that block the site would be a quote book, and the gap
 * between a text and its author's later conduct is often the most instructive
 * thing in it.
 *
 * worked is therefore required rather than optional, relabelled as the record,
 * and the engine places it straight after the error the text was written
 * against, so the reader compares the argument with its outcome before being
 * asked to apply anything.
 *
 * The corpus is the Chinese text: volumes one to four in the 1991 second
 * edition, which added 反对本本主义 to volume one, and volume five as published
 * in 1977. Source lines give the Chinese title and date exactly as the edition
 * prints them, so a reader can find the passage.
 *
 * The second facet is the volume rather than a level. Nothing in this corpus
 * divides by the reader's seniority, but it divides sharply by period: the
 * writing of a guerrilla leader in a mountain base and the writing of a head of
 * state are not the same kind of evidence, and the library should be able to
 * show one without the other.
 *
 * No gate, for practicum's reason. Each entry names a thing to try today, and a
 * commitment box in front of it would be ceremony rather than a mechanic.
 *
 * key and slug stay in Latin script: the slug is the URL, and the key names a
 * localStorage record that must never move once anyone has notes in it. */
window.SITE = {
  key: 'marginalia.v1',
  slug: 'marginalia',
  lang: 'zh-CN',
  name: '批注',
  eyebrow: '毛泽东选集',
  tagline: '毛选里的方法，与它们在实践中的记录',

  tracks: [
    { id: 'practice', name: '实践与调查' },
    { id: 'contradiction', name: '矛盾' },
    { id: 'strategy', name: '战略' },
    { id: 'operations', name: '作战' },
    { id: 'growth', name: '从小到大' },
    { id: 'leadership', name: '领导方法' },
    { id: 'discipline', name: '批评与纪律' },
    { id: 'writing', name: '文风与宣传' },
    { id: 'alliances', name: '统一战线与谈判' },
    { id: 'power', name: '执政' }
  ],

  /* Volume five is in, and labelled like the rest. It was published in 1977
     under Hua Guofeng and later withdrawn from circulation, but it holds the
     post-1949 texts most often cited, and leaving it out would end the record
     at the point where the author held the most power to act on his own
     advice. */
  levels: {
    v1: '第一卷（1925-1937）',
    v2: '第二卷（1937-1941）',
    v3: '第三卷（1941-1945）',
    v4: '第四卷（1945-1949）',
    v5: '第五卷（1949-1957）'
  },

  review: 'leitner',
  intervals: [1, 3, 7, 16, 35],

  extraRequired: ['worked'],

  /* Opt-in, as on practicum: an entry appears if it carries a cheat line. The
     corpus has an unusual number of texts that are already lists - the twelve
     points of 党委会的工作方法, the ten military principles, the eight charges
     against 党八股 - and those compress without loss. The argument-shaped texts
     do not, and stay off. */
  cheatsheet: true,

  /* The engine's defaults are English, so every label this site can reach is
     supplied here. Keys for mechanics the site does not use (the gate, the
     evidence block, the arithmetic gate, forecasts, expiry, attempts) are left
     out because nothing renders them. Copy that carries a count, a date or a
     name is a function of it. */
  copy: {
    // The page shell, replaced by the build
    skipLink: '跳到今天的条目',
    stampLabel: '条目',
    navLabel: '栏目',
    themeToggleLabel: '切换配色',

    // The spine
    tabToday: '今天',
    tabReview: '复习',
    tabLibrary: '目录',
    tabCheatsheet: '速查',
    tabJournal: '笔记',
    tabProgress: '进度',
    gaugeStreak: '连续',
    gaugeLogged: '已记',
    gaugeRetained: '记住',
    themeLight: '白天',
    themeDark: '灯下',
    badgeNew: '新',

    // Today
    storageBlockedMeta: '什么都没有保存',
    storageBlocked: '这个浏览器禁止了本地存储。',
    storageBlockedNote: '你可以阅读今天的条目，但连续天数、笔记和复习安排在刷新之后都会消失。常见原因是无痕浏览。请在普通窗口中打开，或者把文件下载下来直接打开。',
    todayEmpty: '没有可读的条目。',
    dueMeta: '读之前',
    dueCount: function (n) { return n + ' 张到期'; },
    dueCards: function (n) { return '之前的条目里有 ' + n + ' 张卡片到期了。'; },
    recallFirst: '先回忆，再阅读。把东西从脑子里取出来，它才真正留下。',
    dueCta: '开始复习',
    contentMissing: '没有加载到条目，内容文件没有运行。',

    // The entry, on Today and in the library
    sourcePrefix: '选自',
    readTime: function (minutes) { return '约 ' + minutes + ' 分钟'; },
    labelIdea: '论点',
    labelWhy: '论证',
    labelFailure: '它针对的错误',
    labelWorked: '实践记录',
    labelExperiment: '今天试一试',
    labelReflect: '记下来',
    reflectPlaceholder: '写实际发生了什么，而不是应该发生什么。',
    noteSaving: '正在保存…',
    noteSaved: '已保存在这个浏览器里',
    labelDeepDive: '继续追问',
    deepDiveNote: '把这段话复制给 Claude，拿你的真实处境检验这个想法。你在上面记下的内容会一起带上。',
    promptCopyCta: '复制提示',
    promptShowCta: '显示',
    completeCta: '记下这一条',
    loggedFor: function (date) { return '已于' + date + '记下'; },
    nextUp: function (date) { return '已进入复习卡组，下一次在' + date + '。'; },
    libraryBack: '回到目录',
    readingAhead: '这是提前阅读。条目只在它自己那一天记录。',

    // The reader
    listenCta: '朗读',
    listenStop: '停止',
    listenPause: '暂停',
    listenResume: '继续',
    listenNote: '由这个浏览器朗读。不下载任何东西，也不发送任何东西。',
    listenEmpty: '这一条没有可以朗读的内容',
    listenNoVoice: '这个浏览器没有可用的中文朗读声音',
    listenNetworkGone: '这个声音需要联网，而它没有回应',
    listenStopped: '声音停了，无法重新开始',
    autoplayCta: '连续播放',
    autoplayEnd: '这是最后一条',

    // The library pager
    pagerLabel: '前后条目',
    pagerPrev: '上一条',
    pagerNext: '下一条',
    pagerFirst: '第一条',
    pagerLast: '最后一条',

    // The deep-dive prompt; its opening and closing lines are in prompt below
    promptEntry: function (title) { return '条目：' + title; },
    promptIdea: function (idea) { return '论点：' + idea; },
    promptMechanism: function (why) { return '论证：' + why; },
    promptFailure: function (failureMode) { return '它针对的错误：' + failureMode; },
    promptSituation: function (text) { return '我的处境：' + text; },
    promptNoNote: '（我还没有写下来。请先问我，一次只问一个问题。）',
    toastPromptCopied: '提示已复制，粘贴给 Claude 吧',
    toastCopyBlocked: '这里无法复制，请直接选中下面的文字',

    // Review
    reviewNote: '翻卡之前先说出答案。如实给自己打分，复习安排只和打分一样准。',
    reviewNextOn: function (date) { return '现在没有到期的卡片。下一张在' + date + '回来。'; },
    reviewNoneYet: '现在没有到期的卡片。记下一条，明天开始就会有卡片。',
    deckCleared: function (n) { return '这一轮复习完了，共 ' + n + ' 张。会积累的正是这一部分。'; },
    readToday: '去读今天的条目',
    entryMeta: function (number) { return '第 ' + number + ' 条'; },
    cardBox: function (box) { return '第 ' + box + ' 盒'; },
    revealCta: '翻开卡片',
    gradeMiss: '没想起来',
    gradeMissHint: '回到第一盒',
    gradeClose: '差一点',
    gradeCloseHint: '留在这一盒',
    gradeGot: '想起来了',
    gradeGotHint: '升一盒',

    // The library
    libraryNote: function (n) { return '全部 ' + n + ' 条，按送达的顺序排列。可以随意往前读，记录仍然每天一次。'; },
    librarySearch: '搜索条目',
    allLevels: '全部五卷',
    allTracks: '全部主题',
    libraryEmpty: '没有匹配的条目。',
    pipUnserved: '尚未推送',
    pipSolid: '已牢固',
    pipReview: function (box) { return '复习中，第 ' + box + ' 盒'; },
    pipLogged: '已记录',

    // The cheatsheet
    cheatNote: '方法压缩成一句话之后仍然成立的条目。',
    cheatCount: function (shown, total) { return '共 ' + total + ' 条，收录 ' + shown + ' 条。'; },
    cheatOther: function (n, reason) { return '另外 ' + n + ' 条' + reason; },
    cheatWithheld: '没有收进来，因为它们的价值在论证或者实践记录里，压成一句就成了口号，而这些文字最常见的命运正是被压成口号。',

    // The journal
    journalNote: '你写下的一切。一年之后，这会是这里最有价值的东西：它记录了你自己判断的变化。',
    journalEmpty: '还没有记下任何内容。任何条目里的记录栏都会写到这里。',

    // Progress
    progressNote: '连续天数衡量的是有没有来。记住了多少衡量的是有没有留下。后者才是要紧的。',
    statStreak: '连续',
    statStreakUnit: function () { return '天，仍在继续'; },
    statBest: '最长连续',
    statBestUnit: '天',
    statLogged: '已记条目',
    statLoggedUnit: function (total) { return '共 ' + total + ' 条'; },
    statReviewed: '已复习卡片',
    statRecalled: function (pct) { return '记起 ' + pct + '%'; },
    noDataYet: '暂无数据',
    statSolid: '已牢固',
    statSolidUnit: '第四或第五盒',
    statDays: '在册天数',
    statDaysUnit: function (date) { return '自' + date + '起'; },
    labelCoverage: '各主题进度',
    labelRecord: '你的记录',
    recordNote: '所有内容只保存在这个浏览器里。清除网站数据就会全部抹掉，所以请不时备份一份，尤其是笔记。',
    exportCta: '下载备份',
    exportShowCta: '以文本显示',
    importOpenCta: '从备份恢复',
    importPlaceholder: '把备份粘贴到这里',
    importCta: '恢复',
    toastExported: '备份已下载',
    toastExportBlocked: '这里无法下载，请复制文本',
    toastImportEmpty: '先粘贴一份备份',
    toastImported: '已恢复',
    toastImportBad: function (name) { return '这不是' + name + '的备份，请检查是否粘贴了完整的文件'; },

    // Anywhere
    toastSaveFailed: '无法保存，浏览器存储已满或被禁止',
    toastLoggedReview: '已记下。明天它会回来复习。',
    toastLogged: '已记下。'
  },

  /* A reader's working copy rather than a red book: warm book stock, graphite
     for structure, and the red pencil kept for anything that asks you to act.
     Red is the colour the source is usually dressed in, so here it marks the
     reader's annotations and never the text. The display face is a book face,
     with a Song face behind it for the Chinese, because the thing being
     imitated is a printed volume with notes in it. */
  palette: {
    light: {
      paper: '#F4F1EA', paperRaised: '#FFFDF8', paperSunk: '#EAE5DA',
      gridTint: '#1E1C19', rule: '#DDD6C8', ruleStrong: '#BCB3A3',
      ink: '#1E1C19', inkMuted: '#5B564E', inkFaint: '#8D877D',
      accent: '#3B5068', accentInk: '#2D3E52', action: '#A3341E',
      solid: '#3F6B4A', shaky: '#8A6A1F'
    },
    dark: {
      paper: '#15140F', paperRaised: '#1D1B16', paperSunk: '#0F0E0B',
      gridTint: '#CFC6B4', rule: '#2B2822', ruleStrong: '#403B33',
      ink: '#E8E2D6', inkMuted: '#A59F93', inkFaint: '#736D64',
      accent: '#8FA7C0', accentInk: '#B4C7DA', action: '#E27A5E',
      solid: '#6DB087', shaky: '#C9A651'
    },
    faceDisplay: '"Iowan Old Style", "Songti SC", STSong, "Noto Serif CJK SC", "Source Han Serif SC", SimSun, Palatino, Georgia, serif'
  },

  prompt: {
    intro: '我在读《毛泽东选集》，想学其中的方法，并且想拿一个想法对照我的实际处境检验，而不是欣赏它。',
    closing: '请反驳我的推理，不要附和我。指出我在回避什么。具体，简短。'
  }
};
