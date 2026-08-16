/* ============================================================
   router.js —— hash 路由 + 视图分发器 Modules
   职责：
    1. hash 路由：解析 #/view-name → AppState.view → Modules.render
    2. Modules 注册表：views（view→渲染函数）+ actions（事件委托分发）
    3. 模块文件之间不互相引用，统一通过 Modules 注册
   依赖：store.js（AppState）
   ============================================================ */

window.Router = {
  /** 注册 hashchange 监听并解析当前 hash */
  init() {
    window.addEventListener('hashchange', () => this.parse());
    this.parse();
  },

  /** 导航到指定 hash（如 '#/knowledge'） */
  navigate(hash) {
    if (location.hash === hash) {
      this.parse();
    } else {
      location.hash = hash;
    }
  },

  /** 解析当前 hash 并分发渲染 */
  parse() {
    let h = location.hash || '';
    if (h.indexOf('#/') === 0) {
      h = h.slice(2);
    } else {
      h = 'dashboard';
    }
    AppState.view = h;
    if (AppState.prefs) AppState.prefs.lastView = h;
    window.scrollTo(0, 0);
    Modules.render(h);
    if (typeof App !== 'undefined' && App.renderNav) App.renderNav();
  }
};

/* ---------- 视图分发器（Modules 注册表） ---------- */
window.Modules = {
  views: {},     // view name -> render(container)
  actions: {},   // action name -> handler(e, id, el)

  /** 注册视图渲染函数 */
  register(view, fn) { this.views[view] = fn; },

  /** 注册事件委托处理器（data-action 分发） */
  on(action, fn) { this.actions[action] = fn; },

  /** 渲染指定视图到 #app */
  render(view) {
    const container = document.getElementById('app');
    if (!container) return;
    const fn = this.views[view];
    if (!fn) {
      container.innerHTML =
        '<div class="empty"><span class="empty-icon">🚧</span>「' + esc(view) + '」建设中，请稍候…</div>';
      return;
    }
    fn(container);
  }
};

console.log('[Router] router.js loaded');
