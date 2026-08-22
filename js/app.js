/* ============================================================
   app.js —— 启动装配 + 全局事件
   职责：
    1. App.init() 初始化：恢复状态 → 路由 → 导航 → 渲染
    2. 导航渲染（桌面侧边栏 / 移动底部 Tab）
    3. 学科切换 switchSubject（全局联动）
    4. 全局事件委托（#app 内 data-action 分发）+ 顶部栏动作
    5. 清空数据 / 打印导出
   依赖：全部 js（最后加载）
   ============================================================ */

window.App = {
  /** 导航项配置 */
  NAV: [
    { view: 'dashboard', icon: '🏠', title: '首页' },
    { view: 'knowledge', icon: '📚', title: '考点库' },
    { view: 'pastPapers', icon: '🏛️', title: '真题库' },
    { view: 'practice', icon: '✏️', title: '智能刷题' },
    { view: 'mistakes', icon: '📕', title: '错题回顾' },
    { view: 'plan', icon: '🗺️', title: '复习计划' },
    { view: 'mindmap', icon: '🧠', title: '思维导图' },
    { view: 'exam', icon: '📝', title: '模拟考试' },
    { view: 'recite', icon: '🗓️', title: '背诵打卡' },
    { view: 'predict', icon: '🔮', title: '2027 预测' }
  ],

  /** 应用启动 */
  init() {
    Store.loadAppState();
    // 兜底：确保引用式卷已物化（防御 file:// 时序差异；PaperEngine 已幂等）
    if (window.PaperEngine && PaperEngine.resolveAll) PaperEngine.resolveAll();
    this.renderNav();
    this.bindGlobalEvents();
    Router.init();
    // 首次无 hash 时落到首页
    if (!location.hash) Router.navigate('#/dashboard');
    this.syncSubjectUI();
  },

  /** 渲染导航（桌面侧边栏 + 移动底部 Tab） */
  renderNav() {
    const sidebar = document.getElementById('sidebarNav');
    const tabbar = document.getElementById('bottomTabbar');
    const current = AppState.view;
    if (sidebar) {
      sidebar.innerHTML = this.NAV.map(n =>
        '<button class="nav-item' + (n.view === current ? ' active' : '') + '" data-action="goView" data-id="' + n.view + '">' +
        '<span class="nav-icon">' + n.icon + '</span><span>' + n.title + '</span></button>'
      ).join('');
    }
    if (tabbar) {
      tabbar.innerHTML = this.NAV.map(n =>
        '<button class="tab-item' + (n.view === current ? ' active' : '') + '" data-action="goView" data-id="' + n.view + '">' +
        '<span class="tab-icon">' + n.icon + '</span><span>' + n.title + '</span></button>'
      ).join('');
    }
    this.syncSubjectUI();
  },

  /** 同步顶部学科切换器激活态 */
  syncSubjectUI() {
    document.querySelectorAll('#subjectSwitcher .subject-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-id') === AppState.subject);
    });
  },

  /** 学科切换（全局联动）：更新状态 → 持久化 → 重渲染当前视图 */
  switchSubject(s) {
    if (!DATA[s]) return;
    AppState.subject = s;
    AppState.prefs.subject = s;
    Store.savePrefs();
    this.renderNav();
    // 重渲染当前视图（各模块按 AppState.subject 取数，自动联动）
    Modules.render(AppState.view);
    window.scrollTo(0, 0);
  },

  /** 全局事件绑定（#app 事件委托 + 导航容器 + 顶部栏） */
  bindGlobalEvents() {
    // 统一的 data-action 委托分发处理器
    const delegate = (e) => {
      const el = e.target.closest('[data-action]');
      if (!el) return;
      const action = el.getAttribute('data-action');
      const id = el.getAttribute('data-id');
      const fn = this.ACTIONS[action];
      if (fn) {
        e.preventDefault();
        fn.call(this, e, id, el);
      }
    };

    // #app 内 data-action 委托分发
    const app = document.getElementById('app');
    if (app) app.addEventListener('click', delegate);

    // 导航容器在 #app 之外（桌面侧边栏 + 移动底部 Tab），必须单独绑定同一委托，
    // 否则 data-action="goView" 的导航点击不会触发视图切换
    ['sidebarNav', 'bottomTabbar'].forEach(id => {
      const nav = document.getElementById(id);
      if (nav) nav.addEventListener('click', delegate);
    });

    // 顶部栏动作（同样走 ACTIONS）
    document.querySelectorAll('.topbar [data-action]').forEach(el => {
      el.addEventListener('click', (e) => {
        const action = el.getAttribute('data-action');
        const id = el.getAttribute('data-id');
        const fn = this.ACTIONS[action];
        if (fn) { e.preventDefault(); fn.call(this, e, id, el); }
      });
    });
  },

  /** 全局动作注册表（data-action → handler(e, id, el)） */
  ACTIONS: {
    /* ----- 顶部栏 / 全局 ----- */
    goDashboard(e, id) { Router.navigate('#/dashboard'); },
    switchSubject(e, id) { App.switchSubject(id); },
    printView() { App.printView(); },
    clearData() { App.clearData(); },
    goView(e, id) { if (id) Router.navigate('#/' + id); },

    /* ----- M9 预测 → 模拟卷跳转 ----- */
    goToPaper(e, id) {
      AppState.examPendingPaper = id;
      AppState.examSession = null;
      Router.navigate('#/exam');
    },

    /* ----- M1 考点库 ----- */
    resetKpFilter() {
      AppState.kpFilter = { grade: '全部', board: '全部', difficulty: '全部', frequency: '全部' };
      renderKnowledge(document.getElementById('app'));
    },
    openKpDetail(e, id) { showKpDetail(document.getElementById('app'), id); },
    closeKpDetail() { const w = document.getElementById('kpDetailWrap'); if (w) w.innerHTML = ''; },
    practiceFromKp(e, id) {
      AppState.practicePresetKp = id;
      AppState.practiceSession = null;
      Router.navigate('#/practice');
    },

    /* ----- M3 智能刷题 ----- */
    pickOption(e, id, el) {
      const session = AppState.practiceSession;
      if (!session || session.submitted) return;
      const val = el.getAttribute('data-val');
      session.answers[id] = val;
      document.querySelectorAll('[data-action="pickOption"][data-id="' + id + '"]').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
    },
    restartPractice() {
      AppState.practiceSession = null;
      renderPractice(document.getElementById('app'));
    },
    openVariant(e, id) {
      const session = AppState.practiceSession;
      if (!session) return;
      const q = session.questions.find(x => x.id === id);
      const wrap = document.querySelector('[data-variant-wrap="' + id + '"]');
      if (!wrap || !q || !q.variant) return;
      if (wrap.innerHTML) { wrap.innerHTML = ''; return; }
      const v = q.variant;
      wrap.innerHTML =
        '<div class="diag-card diag-3"><div class="diag-title">🔁 变式重练</div>' +
        '<div class="question-stem small">' + esc(v.stem) + '</div>' +
        '<textarea class="input" data-variant-input="' + esc(id) + '" placeholder="作答变式…"></textarea>' +
        '<div style="margin-top:6px"><button class="btn btn-sm btn-primary" data-action="submitVariant" data-id="' + esc(id) + '">提交变式</button></div>' +
        '<div data-variant-result="' + esc(id) + '"></div></div>';
      wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },
    submitVariant(e, id) {
      const session = AppState.practiceSession;
      if (!session) return;
      const q = session.questions.find(x => x.id === id);
      const v = q && q.variant;
      if (!v) return;
      const input = document.querySelector('[data-variant-input="' + id + '"]');
      const result = document.querySelector('[data-variant-result="' + id + '"]');
      const ok = judgeAnswer({ type: '填空', answer: v.answer }, input ? input.value : '');
      result.innerHTML = ok
        ? '<div class="alert alert-success" style="margin-top:6px">✅ 变式做对了！</div>'
        : '<div class="alert alert-warn" style="margin-top:6px">❌ 参考答案：' + esc(v.answer) + '<br>解析：' + esc((v.analysis || []).join('；')) + '</div>';
    },

    /* ----- M2 真题库 ----- */
    resetZhenTiFilter() {
      AppState.zhenTiFilter = { year: '全部', type: '全部' };
      AppState.zhenTiOpen = {};
      renderPastPapers(document.getElementById('app'));
    },
    toggleZhenTiCard(e, id, el) {
      const key = el.getAttribute('data-key');
      if (!key) return;
      el.classList.toggle('open');
      if (!AppState.zhenTiOpen) AppState.zhenTiOpen = {};
      AppState.zhenTiOpen[key] = el.classList.contains('open');
    },

    /* ----- M4 错题回顾 ----- */
    deleteMistake(e, id) {
      if (!confirm('确定删除这条错题吗？')) return;
      AppState.mistakes = AppState.mistakes.filter(m => m.id !== id);
      Store.saveMistakes();
      renderMistakes(document.getElementById('app'));
    },
    toggleMastered(e, id) {
      const m = AppState.mistakes.find(x => x.id === id);
      if (!m) return;
      m.mastered = !m.mastered;
      Store.saveMistakes();
      renderMistakes(document.getElementById('app'));
    },
    viewMistake(e, id) { viewMistakeDetail(document.getElementById('app'), id); },

    /* ----- M6 思维导图 ----- */
    toggleMmNode(e, id) {
      const root = DataCenter.getMindmap(AppState.subject);
      if (!root) return;
      const node = App.findMmNode(root, id);
      if (!node) return;
      const hasKids = node.children && node.children.length > 0;
      if (!hasKids) {
        showMindmapLeaf(document.getElementById('app'), node);
        return;
      }
      AppState.mindmapOpen[id] = !(AppState.mindmapOpen[id] !== false);
      renderMindmap(document.getElementById('app'));
    },
    closeMmLeaf() { const w = document.getElementById('mmLeafWrap'); if (w) w.innerHTML = ''; },

    /* ----- M7 模拟考试 ----- */
    startExam(e, id) { startExam(document.getElementById('app'), id); },
    backToExamList() {
      AppState.examSession = null;
      if (examTimer) { clearInterval(examTimer); examTimer = null; }
      renderExam(document.getElementById('app'));
    }
  },

  /** 在思维导图树中查找节点 */
  findMmNode(node, id) {
    if (!node) return null;
    if (node.id === id) return node;
    if (node.children) {
      for (const c of node.children) {
        const r = this.findMmNode(c, id);
        if (r) return r;
      }
    }
    return null;
  },

  /** 打印当前视图 */
  printView() {
    const app = document.getElementById('app');
    app.classList.add('print-area');
    window.print();
    setTimeout(() => app.classList.remove('print-area'), 200);
  },

  /** 清空全部本地数据（确认后） */
  clearData() {
    if (!confirm('确定清空全部本地数据吗？（错题本 / 打卡记录 / 模拟成绩 / 计划将全部重置）')) return;
    Store.clearAll();
    location.reload();
  }
};

/* ---------- 启动 ---------- */
document.addEventListener('DOMContentLoaded', function () {
  App.init();
});

console.log('[App] app.js loaded, ready');
