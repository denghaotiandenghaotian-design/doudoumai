/* ============================================================
   store.js —— 持久化层 + 全局状态 + 通用工具
   职责：
    1. localStorage 封装（key 前缀 gz_zk_，JSON 序列化 + try/catch 容错）
    2. AppState 全局单例状态对象
    3. 通用工具：esc() 防 XSS / 日期工具 / normalize()
   依赖：data-*.js（DATA 已就绪）
   约定：模块文件一律走 Store，禁止直接调用 localStorage
   ============================================================ */

/* ---------- 全局状态 ---------- */
window.AppState = {
  subject: 'math',                 // 学科真源：math | physics | olympiad
  view: 'dashboard',               // 当前视图
  prefs: { subject: 'math', lastView: 'dashboard', lastPractice: { difficulty: 2, count: 10 }, lastReciteCycle: 21 },
  kpFilter: { grade: '全部', board: '全部', difficulty: '全部', frequency: '全部' },
  practiceSession: null,           // 刷题会话 {params, questions, answers, submitted, correctCount}
  variantSession: null,            // 变式重练会话
  examSession: null,               // 模拟考试会话 {paper, answers, startTime, elapsed, submitted, recordId}
  mistakes: [],                    // 错题本
  checkins: null,                  // 打卡记录 {startDate, cycleDays, records}
  exams: [],                       // 模拟成绩记录
  history: [],                     // 刷题历史
  plan: null,                      // 复习计划
  zhenTiFilter: { year: '全部', type: '全部' },
  mindmapOpen: {},                 // 思维导图展开状态
  planTab: 'overview',             // 计划页当前 Tab
  predictTab: 'report',            // 预测页当前 Tab
  examPendingPaper: null           // 预测页跳转预选试卷 id
};

/* ---------- 通用工具 ---------- */
/** HTML 转义（防 XSS）：所有用户输入渲染前必须调用 */
window.esc = function (s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/** 日期格式化为 YYYY-MM-DD */
window.fmtDate = function (d) {
  const dt = (d instanceof Date) ? d : new Date(d);
  if (isNaN(dt.getTime())) return '';
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
};

/** 今天的日期字符串 */
window.todayStr = function () { return fmtDate(new Date()); };

/** 星期中文 */
window.getDayCN = function (dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return '';
  return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()];
};

/** 两个日期字符串相差天数（b - a） */
window.dayDiff = function (a, b) {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  if (isNaN(da.getTime()) || isNaN(db.getTime())) return 0;
  return Math.round((db - da) / 86400000);
};

/** 日期 + n 天 */
window.addDays = function (dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return fmtDate(d);
};

/** 文本归一化：去空格 / 全半角统一 / 大小写统一（评分用） */
window.normalize = function (s) {
  if (s === null || s === undefined) return '';
  let t = String(s).trim().toLowerCase();
  t = t.replace(/[\u3000\s]+/g, '');
  t = t.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (ch) {
    return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
  });
  t = t.replace(/[（]/g, '(').replace(/[）]/g, ')');
  return t;
};

/* ---------- Store ---------- */
window.Store = {
  PREFIX: 'gz_zk_',

  /** 读取：key 不含前缀；JSON 损坏返回 fallback 并清除 */
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(this.PREFIX + key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      try { localStorage.removeItem(this.PREFIX + key); } catch (e2) { /* ignore */ }
      return fallback;
    }
  },

  /** 写入：JSON 序列化 */
  set(key, value) {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('[Store] 写入失败', key, e);
    }
  },

  /** 删除单个 key */
  remove(key) {
    try { localStorage.removeItem(this.PREFIX + key); } catch (e) { /* ignore */ }
  },

  /** 清空全部 gz_zk_*（调用方需 confirm） */
  clearAll() {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf(this.PREFIX) === 0) keys.push(k);
      }
      keys.forEach(k => localStorage.removeItem(k));
    } catch (e) { console.warn('[Store] 清空失败', e); }
  },

  /** 从各分区 key 重建 AppState */
  loadAppState() {
    const prefs = this.get('prefs', null);
    if (prefs && typeof prefs === 'object') {
      AppState.prefs = Object.assign({}, AppState.prefs, prefs);
    }
    AppState.subject = AppState.prefs.subject || 'math';
    AppState.view = AppState.prefs.lastView || 'dashboard';
    AppState.mistakes = this.get('mistakes', []) || [];
    const ck = this.get('checkin', null);
    if (ck && typeof ck === 'object') {
      if (!ck.records || typeof ck.records !== 'object') ck.records = {};
      if (!ck.startDate) ck.startDate = todayStr();
      if (!ck.cycleDays) ck.cycleDays = AppState.prefs.lastReciteCycle || 21;
    }
    AppState.checkins = ck;
    AppState.exams = this.get('exams', []) || [];
    AppState.history = this.get('history', []) || [];
    AppState.plan = this.get('plan', null);
    return AppState;
  },

  savePrefs() { this.set('prefs', AppState.prefs); },
  saveMistakes() { this.set('mistakes', AppState.mistakes); },
  saveCheckins() { this.set('checkin', AppState.checkins); },
  saveExams() { this.set('exams', AppState.exams); },
  saveHistory() { this.set('history', AppState.history); },
  savePlan() { this.set('plan', AppState.plan); }
};

/* ---------- 数据访问中心（DataCenter，轻封装） ---------- */
window.DataCenter = {
  getKnowledgePoints(subject) { return (window.DATA[subject] || {}).knowledgePoints || []; },
  getQuestions(subject) { return (window.DATA[subject] || {}).questions || []; },
  getPapers(subject) { return (window.DATA.papers || {}).papers.filter(p => p.subject === subject); },
  getReciteItems(subject) { return (window.DATA[subject] || {}).reciteItems || []; },
  getMindmap(subject) { return (window.DATA[subject] || {}).mindmap || null; },
  getPrediction(subject) { return (window.DATA[subject] || {}).prediction || null; },
  getKp(subject, kpId) {
    const list = this.getKnowledgePoints(subject);
    for (let i = 0; i < list.length; i++) if (list[i].id === kpId) return list[i];
    return null;
  },
  getQuestion(subject, qId) {
    const list = this.getQuestions(subject);
    for (let i = 0; i < list.length; i++) if (list[i].id === qId) return list[i];
    return null;
  },
  getPaper(paperId) {
    const all = (window.DATA.papers || {}).papers || [];
    for (let i = 0; i < all.length; i++) if (all[i].id === paperId) return all[i];
    return null;
  }
};

/* ---------- 启动自检 ---------- */
console.log('[Store] store.js loaded, prefix = gz_zk_');
