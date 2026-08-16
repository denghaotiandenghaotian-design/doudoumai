/* ============================================================
   modules-plan.js —— 规划测评四模块
   职责：
    M2 真题库：年份×题型筛选 + 逐题卡片（含"待补原题"）+ 5 年频次矩阵
    M5 复习计划：PlanGenerator 三阶段算法 + 时间轴/周计划/每日清单/里程碑/压缩方案
    M6 思维导图：递归树（≤4 级）+ 折叠 + 叶子"会怎么考" + 公式清单
    M7 模拟考试：试卷列表 + 计时 + 答题卡 + ExamGrader 半自动评分 + 复盘 + 历史趋势
   依赖：store.js、router.js、data-*.js
   约定：不直接调用 localStorage；用户输入渲染前 esc()
   ============================================================ */

/* ==================== 计划生成器 PlanGenerator ==================== */
window.PlanGenerator = {
  /** 生成三阶段计划 */
  generate(params) {
    const days = Math.max(1, params.daysToExam || 90);
    const startDate = params.startDate || todayStr();
    let d1 = Math.max(0, Math.round(days * 0.40));
    let d2 = Math.max(0, Math.round(days * 0.35));
    let d3 = Math.max(14, days - d1 - d2);
    let compressed = false;
    if (days <= 21) {
      d1 = 0;
      d2 = Math.max(0, days - 14);
      d3 = 14;
      compressed = true;
    }
    const phases = [
      { name: '一轮基础', range: [startDate, addDays(startDate, Math.max(0, d1 - 1))], days: d1, goals: '回归教材，按册次逐章覆盖全部基础考点，整理错题', weekly: [] },
      { name: '二轮专题', range: [addDays(startDate, d1), addDays(startDate, d1 + Math.max(0, d2) - 1)], days: d2, goals: '按高频专题突破，薄弱板块加倍课时，穿插周测', weekly: [] },
      { name: '三轮冲刺', range: [addDays(startDate, d1 + d2), addDays(startDate, days - 1)], days: d3, goals: '每日 1 套限时模拟卷 + 复盘（对接模拟考试模块）', weekly: [] }
    ];
    this.buildWeekly(phases, params, compressed);
    const milestones = this.buildMilestones(phases, days);
    const plan = { params: params, phases: phases, milestones: milestones, progress: { weekIndex: 0, completed: false }, compressed: compressed };
    return plan;
  },

  /** 构建周计划表 */
  buildWeekly(phases, params, compressed) {
    const s = params.subject || 'math';
    const data = DATA[s] || { knowledgePoints: [], questions: [] };
    // 一轮：按教材册次顺序排章节
    const volumes = ['七上', '七下', '八上', '八下', '九上', '九下'];
    let chapters = [];
    volumes.forEach(v => {
      data.knowledgePoints.filter(k => k.volume === v).forEach(k => {
        if (chapters.indexOf(k.chapter) === -1) chapters.push(k.chapter);
      });
    });
    if (s === 'physics') {
      const pv = ['八上', '八下', '九全'];
      chapters = [];
      pv.forEach(v => {
        data.knowledgePoints.filter(k => k.volume === v).forEach(k => {
          if (chapters.indexOf(k.chapter) === -1) chapters.push(k.chapter);
        });
      });
    }
    // 二轮：按知识板块
    const boards = Array.from(new Set(data.knowledgePoints.map(k => k.board)));
    const weak = params.weakBoards || [];

    phases.forEach((ph, idx) => {
      const totalWeeks = Math.max(1, Math.ceil(ph.days / 7));
      for (let w = 1; w <= totalWeeks; w++) {
        let target, content, practice, selfCheck;
        if (idx === 0) {
          const ci = Math.min(chapters.length - 1, (w - 1) * 2);
          const c2 = ci + 1 < chapters.length ? chapters[ci + 1] : chapters[ci];
          target = '掌握 ' + chapters[ci] + (c2 !== chapters[ci] ? '、' + c2 : '');
          content = '回归教材精读 + 考点库对应考点（标 ⭐ 的高频优先）';
          practice = '完成题库基础题 15~20 道 + 错题整理';
          selfCheck = '章节自测（选择/填空）正确率 ≥ 80%';
        } else if (idx === 1) {
          const bi = Math.min(boards.length - 1, w - 1);
          const b = boards[bi];
          const isWeak = weak.indexOf(b) !== -1;
          target = '专题：' + b + (isWeak ? '（薄弱，双倍课时）' : '');
          content = '考点库高频考点（frequency≥3）逐一过 + 典型例题精讲';
          practice = '中档解答题 8~10 道 + 压轴题 2 道（错题重做）';
          selfCheck = (w % 2 === 1) ? '周末周测（真题/模拟卷 1 套限时）' : '专题自测 10 题';
        } else {
          target = '冲刺第 ' + w + ' 周：真题/模拟卷限时训练';
          content = '每日 1 套（数学 120min / 物理 90min）严格计时';
          practice = '对答案 + 逐题复盘，错题录入错题本';
          selfCheck = '失分点归因：计算/概念/方法，次日重做错题';
        }
        ph.weekly.push({ week: w, target: target, content: content, practice: practice, selfCheck: selfCheck });
      }
    });
  },

  /** 里程碑 */
  buildMilestones(phases, days) {
    const ms = [];
    phases.forEach(ph => {
      ms.push({ date: ph.range[0], title: ph.name + '开始', type: 'phaseStart' });
      ms.push({ date: ph.range[1], title: ph.name + '结束', type: 'phaseEnd' });
      // 每周日周测节点
      let cur = ph.range[0];
      let guard = 0;
      while (cur <= ph.range[1] && guard < 20) {
        const dt = new Date(cur + 'T00:00:00');
        if (dt.getDay() === 0) ms.push({ date: cur, title: '周测 + 自评', type: 'weekTest' });
        cur = addDays(cur, 1);
        guard++;
      }
    });
    const last = phases[phases.length - 1];
    ms.push({ date: addDays(last.range[1], -3), title: '回归错题本 + 必背清单', type: 'finalReview' });
    ms.push({ date: last.range[1], title: '考前最后一天：轻复习 + 调整心态', type: 'finalDay' });
    return ms;
  },

  /** 压缩方案说明 */
  compressed(plan) {
    return '当前距中考仅 ' + plan.params.daysToExam + ' 天，已自动压缩：一轮基础并入二轮专题（按薄弱板块优先），冲刺期保持 14 天每日一套限时卷。建议每天至少 ' + plan.params.dailyMinutes + ' 分钟，优先保证高频考点与压轴题复盘。';
  }
};

/* ==================== 模拟卷评分器 ExamGrader ==================== */
window.ExamGrader = {
  /** 归一化（复用全局 normalize，补一句声明） */
  normalize(s) { return normalize(s); },

  /**
   * 评分：客观题严格比对；主观题关键词命中→满分，否则 manual 待自评
   * @returns {{total:number, detail:Array, manualKeys:Array}}
   */
  grade(paper, answers) {
    let total = 0;
    const detail = [];
    const manualKeys = [];
    (paper.questions || []).forEach(q => {
      const a = answers[q.qId] || '';
      const std = q.body.answer || '';
      const max = q.score || 0;
      if (q.body.type === '选择' || q.body.type === '填空' || q.body.type === '作图') {
        const ok = normalize(a) === normalize(std);
        total += ok ? max : 0;
        detail.push({ qId: q.qId, seq: q.seq, type: q.body.type, score: ok ? max : 0, max: max, auto: true, correct: ok });
      } else {
        const ok = this.keywordHit(std, a);
        if (ok) { total += max; }
        else { manualKeys.push(q.qId); }
        detail.push({ qId: q.qId, seq: q.seq, type: q.body.type, score: ok ? max : 0, max: max, auto: ok, correct: ok, manual: !ok });
      }
    });
    return { total: total, detail: detail, manualKeys: manualKeys };
  },

  /** 关键词比对：答案含任一要点（分号/句号分隔） */
  keywordHit(std, a) {
    if (!a) return false;
    const na = normalize(a);
    if (normalize(std) === na) return true;
    const phrases = String(std).split(/[；;。\n]/).map(x => x.trim()).filter(x => x.length >= 2);
    for (const p of phrases) {
      if (na.indexOf(normalize(p)) !== -1) return true;
    }
    return false;
  },

  /** 生成复盘表 HTML 数据（含错因/补救） */
  reviewSheet(record) {
    return record;
  }
};

/* ==================== M2 真题库 ==================== */
function renderPastPapers(container) {
  const s = AppState.subject;
  const zt = (DATA.papers.zhenTi || {})[s];
  if (!zt) { container.innerHTML = '<div class="empty">暂无真题数据</div>'; return; }
  const f = AppState.zhenTiFilter;
  const years = ['全部'].concat(Array.from(new Set(zt.questions.map(q => q.year))).sort((a, b) => b - a));
  const types = ['全部'].concat(Array.from(new Set(zt.questions.map(q => q.type))));

  container.innerHTML =
    '<div class="page-head"><h2>🏛️ 真题库（2021–2025） <span class="muted small">' + SUBJECT_NAMES[s] + '</span></h2></div>' +
    '<div class="filter-bar">' +
      '<div class="filter-item"><label>年份</label><select class="select" data-zfilter="year">' + years.map(y => '<option value="' + y + '"' + (f.year === String(y) ? ' selected' : '') + '>' + y + '</option>').join('') + '</select></div>' +
      '<div class="filter-item"><label>题型</label><select class="select" data-zfilter="type">' + types.map(t => '<option value="' + t + '"' + (f.type === t ? ' selected' : '') + '>' + t + '</option>').join('') + '</select></div>' +
      '<button class="btn" data-action="resetZhenTiFilter">重置</button>' +
    '</div>' +
    '<div class="grid grid-3">' +
      '<div class="card" style="grid-column: span 2;">' +
        '<h3 class="card-title">📄 逐题卡片 <span class="card-sub">' + zt.questions.length + ' 条（含样题与待补原题）</span></h3>' +
        '<div id="zhenTiList">' + renderZhenTiList(zt, f) + '</div>' +
      '</div>' +
      '<div class="card"><h3 class="card-title">📊 5 年考点频次矩阵</h3>' + renderFrequencyMatrix(zt) + '</div>' +
    '</div>';

  container.querySelectorAll('[data-zfilter]').forEach(el => {
    el.addEventListener('change', function () {
      AppState.zhenTiFilter[this.getAttribute('data-zfilter')] = this.value;
      renderPastPapers(container);
    });
  });
}

function renderZhenTiList(zt, f) {
  let list = zt.questions.slice();
  if (f.year !== '全部') list = list.filter(q => String(q.year) === String(f.year));
  if (f.type !== '全部') list = list.filter(q => q.type === f.type);
  if (list.length === 0) return '<div class="empty">无符合条件的真题</div>';
  return list.map(q => {
    const kp = DataCenter.getKp(zt.subject || AppState.subject, q.kpId);
    const isPending = q.status === 'pending';
    return '<details class="collapse">' +
      '<summary>' + q.year + ' · 第' + q.seq + '题 · <span class="tag">' + esc(q.type) + '</span> <span class="tag tag-blue">' + esc(kp ? kp.name : '未知') + '</span> ' +
      '<span class="tag">' + (q.score || '?') + ' 分</span> ' +
      (isPending ? '<span class="tag tag-orange">待补原题</span>' : '<span class="tag tag-green">样题</span>') + '</summary>' +
      '<div class="collapse-body">' +
        '<div class="small"><span class="bold">考点：</span>' + esc(kp ? kp.name + '（' + kp.board + '）' : '未知') + '</div>' +
        '<div class="small"><span class="bold">答案：</span>' + esc(q.answer) + '</div>' +
        '<div class="small muted">' + esc(q.analysis) + '</div>' +
        (isPending ? '<div class="alert alert-warn" style="margin-top:6px">⚠️ 真题原文涉及版权，暂以占位展示；可对照纸质真题册/官方发布补录。</div>' : '') +
      '</div>' +
    '</details>';
  }).join('');
}

function renderFrequencyMatrix(zt) {
  const kpIds = Array.from(new Set(zt.summary.map(s => s.kpId)));
  const years = [2021, 2022, 2023, 2024, 2025];
  let rows = '';
  kpIds.forEach(kpId => {
    const kp = DataCenter.getKp(zt.subject || AppState.subject, kpId);
    const s = zt.summary.find(x => x.kpId === kpId);
    if (!s) return;
    let level = '冷门';
    if (s.total >= 4) level = '必考';
    else if (s.total >= 2) level = '轮考';
    const cell = y => {
      const has = s.years.indexOf(y) !== -1;
      return '<td style="text-align:center">' + (has ? '●' : '') + '</td>';
    };
    rows += '<tr><td class="small" style="max-width:150px">' + esc(kp ? kp.name : kpId) + '</td>' +
      years.map(cell).join('') +
      '<td><span class="tag ' + (level === '必考' ? 'tag-red' : level === '轮考' ? 'tag-orange' : '') + '">' + level + '</span></td></tr>';
  });
  return '<div class="table-wrap"><table class="data-table" style="min-width:420px"><thead><tr><th>考点</th><th>21</th><th>22</th><th>23</th><th>24</th><th>25</th><th>判断</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<p class="small muted">● 表示该年出现；必考 ≥4 次，轮考 2~3 次，冷门 ≤1 次。</p>';
}

/* ==================== M5 复习计划 ==================== */
function renderPlan(container) {
  const s = AppState.subject;
  // 若已有计划且属于当前学科，恢复展示
  if (AppState.plan && AppState.plan.params && AppState.plan.params.subject === s) {
    renderPlanResult(container, AppState.plan);
    return;
  }
  const data = DATA[s] || { knowledgePoints: [] };
  const boards = Array.from(new Set(data.knowledgePoints.map(k => k.board)));

  container.innerHTML =
    '<div class="page-head"><h2>🗺️ 复习计划生成 <span class="muted small">' + SUBJECT_NAMES[s] + '</span></h2></div>' +
    '<div class="card">' +
      '<h3 class="card-title">参数设置</h3>' +
      '<div class="field-group">' +
        '<div class="form-row"><label>当前日期</label><input class="input" type="date" id="plStart" value="' + todayStr() + '"></div>' +
        '<div class="form-row"><label>距中考天数</label><input class="input" type="number" id="plDays" min="1" max="365" value="120"></div>' +
        '<div class="form-row"><label>年级</label><select class="select" id="plGrade"><option value="九年级">九年级</option><option value="八年级">八年级</option><option value="七年级">七年级</option></select></div>' +
        '<div class="form-row"><label>每日时长（分钟）</label><input class="input" type="number" id="plMinutes" min="30" max="300" value="90"></div>' +
        '<div class="form-row"><label>目标分数</label><input class="input" type="number" id="plTarget" min="60" max="150" value="' + (s === 'math' ? 135 : 90) + '"></div>' +
      '</div>' +
      '<div class="form-row"><label>薄弱板块（可多选）</label><div class="field-group">' +
        boards.map(b => '<label style="display:flex;align-items:center;gap:4px;min-width:110px"><input type="checkbox" data-weak="' + esc(b) + '"> ' + esc(b) + '</label>').join('') +
      '</div></div>' +
      '<button class="btn btn-primary" id="btnGenPlan">生成三阶段计划</button> ' +
      (AppState.plan ? '<button class="btn" id="btnClearPlan">清除当前计划</button>' : '') +
    '</div>' +
    '<div id="planResultWrap"></div>';

  const gen = container.querySelector('#btnGenPlan');
  if (gen) gen.addEventListener('click', function () {
    const weak = [];
    container.querySelectorAll('[data-weak]:checked').forEach(el => weak.push(el.getAttribute('data-weak')));
    const params = {
      startDate: container.querySelector('#plStart').value || todayStr(),
      daysToExam: parseInt(container.querySelector('#plDays').value, 10) || 120,
      grade: container.querySelector('#plGrade').value,
      dailyMinutes: parseInt(container.querySelector('#plMinutes').value, 10) || 90,
      weakBoards: weak,
      targetScore: parseInt(container.querySelector('#plTarget').value, 10) || 120,
      subject: s
    };
    AppState.plan = PlanGenerator.generate(params);
    Store.savePlan();
    renderPlan(container);
  });
  const clear = container.querySelector('#btnClearPlan');
  if (clear) clear.addEventListener('click', function () {
    AppState.plan = null;
    Store.remove('plan');
    renderPlan(container);
  });
}

function renderPlanResult(container, plan) {
  const p = plan.params;
  const tab = AppState.planTab || 'overview';
  container.innerHTML =
    '<div class="page-head"><h2>🗺️ 复习计划 <span class="muted small">' + SUBJECT_NAMES[p.subject] + '</span></h2></div>' +
    '<div class="card">' +
      '<h3 class="card-title">计划总览 <span class="card-sub">' + p.startDate + ' 起 · 距中考 ' + p.daysToExam + ' 天 · 每日 ' + p.dailyMinutes + ' 分钟 · 目标 ' + p.targetScore + ' 分</span></h3>' +
      (plan.compressed ? '<div class="alert alert-warn">⚠️ ' + esc(PlanGenerator.compressed(plan)) + '</div>' : '') +
      renderPhaseBar(plan) +
      '<div class="seg-tabs no-print">' +
        '<button class="seg-tab' + (tab === 'overview' ? ' active' : '') + '" data-plantab="overview">时间轴</button>' +
        '<button class="seg-tab' + (tab === 'weekly' ? ' active' : '') + '" data-plantab="weekly">周计划</button>' +
        '<button class="seg-tab' + (tab === 'daily' ? ' active' : '') + '" data-plantab="daily">每日清单</button>' +
      '</div>' +
      '<div id="planTabBody">' + (tab === 'weekly' ? renderPlanWeekly(plan) : tab === 'daily' ? renderPlanDaily(plan) : renderPlanOverview(plan)) + '</div>' +
    '</div>';

  container.querySelectorAll('[data-plantab]').forEach(el => {
    el.addEventListener('click', function () {
      AppState.planTab = this.getAttribute('data-plantab');
      renderPlanResult(container, plan);
    });
  });
}

function renderPhaseBar(plan) {
  const total = plan.params.daysToExam;
  const w = p => Math.max(0, Math.round(p.days / total * 100));
  return '<div class="phase-bar">' +
    plan.phases.map((ph, i) => '<div class="phase-seg phase-' + (i + 1) + '" style="width:' + w(ph) + '%">' + esc(ph.name) + '<br><span class="small">' + ph.days + ' 天</span></div>').join('') +
    '</div>';
}

function renderPlanOverview(plan) {
  let html = '<div class="timeline">';
  plan.phases.forEach(ph => {
    html += '<div class="timeline-item"><div class="tl-title">' + esc(ph.name) + ' <span class="muted small">' + esc(ph.range[0]) + ' ~ ' + esc(ph.range[1]) + '（' + ph.days + ' 天）</span></div>' +
      '<div class="tl-sub">' + esc(ph.goals) + '</div></div>';
  });
  plan.milestones.slice(0, 12).forEach(m => {
    html += '<div class="timeline-item milestone"><div class="tl-title">📌 ' + esc(m.title) + '</div><div class="tl-sub">' + esc(m.date) + '</div></div>';
  });
  html += '</div>';
  return html;
}

function renderPlanWeekly(plan) {
  let html = '';
  plan.phases.forEach((ph, idx) => {
    html += '<div class="bold" style="margin:12px 0 6px">' + esc(ph.name) + '</div>' +
      '<div class="table-wrap"><table class="data-table" style="min-width:560px"><thead><tr><th>周</th><th>目标</th><th>内容</th><th>练习</th><th>自评</th></tr></thead><tbody>' +
      ph.weekly.map(w => '<tr><td>第 ' + w.week + ' 周</td><td class="small">' + esc(w.target) + '</td><td class="small">' + esc(w.content) + '</td><td class="small">' + esc(w.practice) + '</td><td class="small">' + esc(w.selfCheck) + '</td></tr>').join('') +
      '</tbody></table></div>';
  });
  return html;
}

function renderPlanDaily(plan) {
  const minutes = plan.params.dailyMinutes;
  const seg = Math.max(10, Math.round(minutes / 4));
  return '<div class="card" style="box-shadow:none;border:none;padding:0">' +
    '<div class="alert alert-info">每日清单模板（约 ' + minutes + ' 分钟）：</div>' +
    '<div class="timeline">' +
      '<div class="timeline-item"><div class="tl-title">① 知识点回顾（' + seg + ' 分钟）</div><div class="tl-sub">对照思维导图/考点库，梳理当日章节概念公式</div></div>' +
      '<div class="timeline-item"><div class="tl-title">② 基础练习（' + seg + ' 分钟）</div><div class="tl-sub">智能刷题选择"基础"难度 8~10 题，错题即时整理</div></div>' +
      '<div class="timeline-item"><div class="tl-title">③ 提升/压轴（' + seg + ' 分钟）</div><div class="tl-sub">薄弱板块中档题 3~5 道或压轴题 1~2 道精练</div></div>' +
      '<div class="timeline-item"><div class="tl-title">④ 错题整理 + 背诵（' + seg + ' 分钟）</div><div class="tl-sub">录入错题本自动诊断；背诵打卡完成今日任务</div></div>' +
    '</div>' +
    '<div class="small muted">按计划执行并在打卡日历记录，进度滞后时查看压缩方案。</div></div>';
}

/* ==================== M6 思维导图 ==================== */
function renderMindmap(container) {
  const s = AppState.subject;
  const root = DataCenter.getMindmap(s);
  if (!root) { container.innerHTML = '<div class="empty">暂无思维导图数据</div>'; return; }
  const chapters = root.children || [];
  const selected = AppState.mindmapChapter || (chapters.length ? chapters[0].id : null);

  container.innerHTML =
    '<div class="page-head"><h2>🧠 知识点思维导图 <span class="muted small">' + SUBJECT_NAMES[s] + '</span></h2></div>' +
    '<div class="grid grid-3">' +
      '<div class="card" style="grid-column: span 2;">' +
        '<h3 class="card-title">🌳 ' + esc(root.label) + '</h3>' +
        '<div class="filter-bar" style="box-shadow:none;padding:0 0 12px">' +
          '<div class="filter-item"><label>章节</label><select class="select" id="mmChapter">' +
            chapters.map(c => '<option value="' + esc(c.id) + '"' + (c.id === selected ? ' selected' : '') + '>' + esc(c.label) + '</option>').join('') +
          '</select></div>' +
        '</div>' +
        '<div id="mmTree">' + renderMmTree(chapters.find(c => c.id === selected)) + '</div>' +
        '<div class="alert alert-info" style="margin-top:10px">📝 知识脉络：' + esc(root.summary || '') + '</div>' +
        '<div id="mmLeafWrap"></div>' +
      '</div>' +
      '<div class="card"><h3 class="card-title">📐 必背公式清单</h3>' + renderFormulaList(s, root.formulas || []) + '</div>' +
    '</div>';

  const sel = container.querySelector('#mmChapter');
  if (sel) sel.addEventListener('change', function () {
    AppState.mindmapChapter = this.value;
    AppState.mindmapOpen = {};
    renderMindmap(container);
  });
}

function renderMmTree(node) {
  if (!node) return '<div class="empty">暂无章节</div>';
  const children = node.children || [];
  const open = AppState.mindmapOpen[node.id] !== false;
  let html = '<div class="mm-tree">';
  html += renderMmNode(node, open);
  html += '</div>';
  return html;
}

function renderMmNode(node, open) {
  const hasKids = node.children && node.children.length > 0;
  const isLeaf = !hasKids;
  const star = node.star ? '<span class="tag tag-star">⭐高频</span>' : '';
  const warn = node.warn ? '<span class="tag tag-red">⚠易错</span>' : '';
  const lvl = node.level || 1;
  const row =
    '<div class="mm-node-row level-' + lvl + '" data-action="toggleMmNode" data-id="' + esc(node.id) + '">' +
      '<span class="mm-arrow">' + (hasKids ? (open ? '▾' : '▸') : '·') + '</span>' +
      '<span class="' + (isLeaf ? 'mm-leaf' : '') + '">' + esc(node.label) + '</span>' + star + warn +
      (node.type ? '<span class="tag">' + esc(node.type) + '</span>' : '') +
    '</div>';
  let html = '<div class="mm-node">' + row;
  if (hasKids && open) {
    html += '<div class="mm-children">' + node.children.map(c => renderMmNode(c, AppState.mindmapOpen[c.id] !== false)).join('') + '</div>';
  }
  html += '</div>';
  return html;
}

function showMindmapLeaf(container, node) {
  const s = AppState.subject;
  const wrap = container.querySelector('#mmLeafWrap');
  let html = '<div class="card">' +
    '<h3 class="card-title">🔍 ' + esc(node.label) + ' <span class="card-sub">会怎么考</span></h3>';
  if (node.howToTest) html += '<div class="alert alert-info">🎯 ' + esc(node.howToTest) + '</div>';
  if (node.kpId) {
    const kp = DataCenter.getKp(s, node.kpId);
    if (kp) {
      html += '<div class="kp-detail-grid">' +
        '<div class="item"><span class="k">考点</span><span class="v">' + esc(kp.name) + '</span></div>' +
        '<div class="item"><span class="k">频次</span><span class="v">' + freqTag(kp.frequency) + '</span></div>' +
        '<div class="item"><span class="k">难度</span><span class="v">' + diffTag(kp.difficulty) + '</span></div>' +
        '<div class="item"><span class="k">题型</span><span class="v">' + esc((kp.questionTypes || []).join(' / ')) + '</span></div>' +
      '</div><div class="small">' + esc(kp.desc) + '</div>' +
      '<div class="small muted" style="margin-top:6px">' + esc(kp.examHint || '') + '</div>';
    }
  }
  html += '<div class="no-print" style="margin-top:8px"><button class="btn btn-sm" data-action="closeMmLeaf">收起</button></div></div>';
  wrap.innerHTML = html;
  wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderFormulaList(s, formulaIds) {
  const items = DataCenter.getReciteItems(s);
  const list = formulaIds.map(id => items.find(it => it.id === id)).filter(Boolean);
  if (list.length === 0) return '<div class="empty">本图暂无关联公式</div>';
  return list.map(it =>
    '<div class="diag-card diag-2" style="margin-bottom:8px"><div class="small bold">' + esc(it.content) + '</div>' +
    (it.note ? '<div class="small muted">' + esc(it.note) + '</div>' : '') + '</div>'
  ).join('');
}

/* ==================== M7 模拟考试 ==================== */
let examTimer = null;

function renderExam(container) {
  const s = AppState.subject;
  const papers = DataCenter.getPapers(s);

  // 恢复未完成的考试会话
  const session = AppState.examSession;
  if (session && !session.submitted && session.paper && session.paper.subject === s) {
    renderExamPaperView(container, session.paper);
    return;
  }

  const pending = AppState.examPendingPaper;
  const predCount = papers.filter(p => p.isPrediction).length;
  const mockCount = papers.length - predCount;
  const subText = papers.length + ' 套（其中 ' + predCount + ' 套 2027 预测卷' + (mockCount ? '、' + mockCount + ' 套模拟卷' : '') + '）';
  container.innerHTML =
    '<div class="page-head"><h2>📝 模拟考试 <span class="muted small">' + SUBJECT_NAMES[s] + '</span></h2></div>' +
    '<div class="card"><h3 class="card-title">试卷列表 <span class="card-sub">' + subText + '</span></h3>' +
      '<div class="grid grid-3">' + papers.map(p => {
        const struct = (p.structure || []).map(x => x.section + x.count + '题').join(' · ');
        const badge = p.isPrediction
          ? '<span class="tag tag-green">预测卷</span>'
          : '<span class="tag tag-blue">模拟卷</span>';
        return '<div class="card" style="margin-bottom:0">' +
          '<div class="bold" style="font-size:15px">' + esc(p.title) + '</div>' +
          (p.emphasis ? '<div class="small" style="margin:4px 0">🎯 ' + esc(p.emphasis) + '</div>' : '') +
          '<div class="small muted" style="margin:4px 0">' + esc(struct) + '</div>' +
          '<div style="margin:6px 0"><span class="tag tag-orange">' + p.totalScore + ' 分</span><span class="tag tag-purple">' + p.duration + ' 分钟</span>' + badge + '</div>' +
          '<button class="btn btn-exam btn-block" data-action="startExam" data-id="' + esc(p.id) + '">🚀 进入考试</button>' +
        '</div>';
      }).join('') + '</div>' +
    '</div>' +
    '<div class="card"><h3 class="card-title">📈 历史成绩</h3>' + renderExamHistory(s) + '</div>';

  if (pending) {
    const btn = container.querySelector('[data-action="startExam"][data-id="' + pending + '"]');
    if (btn) { btn.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    AppState.examPendingPaper = null;
  }
}

function startExam(container, paperId) {
  const paper = DataCenter.getPaper(paperId);
  if (!paper) return;
  if (examTimer) { clearInterval(examTimer); examTimer = null; }
  AppState.examSession = {
    paper: paper,
    answers: {},
    startTime: Date.now(),
    elapsed: 0,
    submitted: false,
    recordId: null
  };
  renderExamPaperView(container, paper);
}

function renderExamPaperView(container, paper) {
  const session = AppState.examSession;
  if (!session) return;
  const totalSec = paper.duration * 60;
  const remaining = Math.max(0, totalSec - Math.floor(session.elapsed));

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const warning = remaining <= 300 ? ' warning' : '';

  container.innerHTML =
    '<div class="exam-header">' +
      '<div><span class="bold">' + esc(paper.title) + '</span><div class="small muted">总分 ' + paper.totalScore + ' · 限时 ' + paper.duration + ' 分钟</div></div>' +
      '<div class="timer' + warning + '" id="examTimer">' + mm + ':' + ss + '</div>' +
      '<div class="answer-sheet" id="answerSheet">' +
        paper.questions.map(q => {
          const filled = session.answers[q.qId] ? ' filled' : '';
          return '<button class="sheet-btn' + filled + '" data-action="jumpToQuestion" data-id="' + esc(q.qId) + '">' + q.seq + '</button>';
        }).join('') +
      '</div>' +
      '<button class="btn btn-exam no-print" id="btnSubmitExam">交卷</button>' +
    '</div>' +
    '<div id="examBody">' + paper.questions.map((q, i) => renderExamQuestion(q, i, session)).join('') + '</div>';

  // 选择题点选
  container.querySelectorAll('[data-exam-option]').forEach(el => {
    el.addEventListener('click', function () {
      const qid = this.getAttribute('data-exam-option');
      const val = this.getAttribute('data-val');
      session.answers[qid] = val;
      container.querySelectorAll('[data-exam-option="' + qid + '"]').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      const btn = container.querySelector('[data-action="jumpToQuestion"][data-id="' + qid + '"]');
      if (btn) btn.classList.add('filled');
    });
  });
  // 主观题输入
  container.querySelectorAll('[data-exam-input]').forEach(el => {
    el.addEventListener('input', function () {
      session.answers[this.getAttribute('data-exam-input')] = this.value;
      const btn = container.querySelector('[data-action="jumpToQuestion"][data-id="' + this.getAttribute('data-exam-input') + '"]');
      if (btn && this.value.trim()) btn.classList.add('filled');
    });
  });

  // 计时器
  if (examTimer) clearInterval(examTimer);
  examTimer = setInterval(function () {
    const s2 = AppState.examSession;
    if (!s2 || s2.submitted) { clearInterval(examTimer); examTimer = null; return; }
    s2.elapsed = Math.floor((Date.now() - s2.startTime) / 1000);
    const rem = Math.max(0, paper.duration * 60 - s2.elapsed);
    const t = container.querySelector('#examTimer');
    if (t) {
      const m = String(Math.floor(rem / 60)).padStart(2, '0');
      const sec = String(rem % 60).padStart(2, '0');
      t.textContent = m + ':' + sec;
      if (rem <= 300) t.classList.add('warning');
    }
    if (rem <= 0) {
      clearInterval(examTimer); examTimer = null;
      submitExam(container, true);
    }
  }, 1000);

  const btn = container.querySelector('#btnSubmitExam');
  if (btn) btn.addEventListener('click', function () {
    if (confirm('确认交卷吗？交卷后将无法修改答案。')) submitExam(container, false);
  });

  // 跳题
  container.querySelectorAll('[data-action="jumpToQuestion"]').forEach(el => {
    el.addEventListener('click', function () {
      const qid = this.getAttribute('data-id');
      const qEl = container.querySelector('#examQ' + qid);
      if (qEl) qEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function renderExamQuestion(q, i, session) {
  const a = session.answers[q.qId] || '';
  let body = '';
  if (q.body.type === '选择') {
    body = '<div class="options-list">' + (q.body.options || []).map(opt => {
      const key = opt.charAt(0);
      return '<div class="option-item' + (a === key ? ' selected' : '') + '" data-exam-option="' + esc(q.qId) + '" data-val="' + key + '"><span class="opt-key">' + key + '.</span><span>' + esc(opt.slice(2)) + '</span></div>';
    }).join('') + '</div>';
  } else {
    body = '<textarea class="input" data-exam-input="' + esc(q.qId) + '" placeholder="作答区（' + esc(q.body.type) + '）…">' + esc(a) + '</textarea>';
  }
  return '<div class="question-card" id="examQ' + esc(q.qId) + '">' +
    '<div class="question-head"><span class="tag tag-blue">' + q.seq + '. ' + esc(q.body.type) + '</span><span class="tag">' + q.score + ' 分</span></div>' +
    '<div class="question-stem">' + esc(q.body.stem) + '</div>' + body +
  '</div>';
}

/** 交卷并评分 */
function submitExam(container, timeout) {
  const session = AppState.examSession;
  if (!session || session.submitted) return;
  session.submitted = true;
  if (examTimer) { clearInterval(examTimer); examTimer = null; }
  const paper = session.paper;
  const result = ExamGrader.grade(paper, session.answers);
  session.result = result;
  renderExamResult(container, session);
  if (timeout) alert('⏰ 时间到，已自动交卷。');
}

function renderExamResult(container, session) {
  const paper = session.paper;
  const result = session.result;
  container.innerHTML =
    '<div class="page-head"><h2>📊 成绩单 <span class="muted small">' + esc(paper.title) + '</span></h2></div>' +
    '<div class="card">' +
      '<h3 class="card-title">得分统计</h3>' +
      '<div class="stat-grid" style="grid-template-columns:repeat(3,1fr)">' +
        '<div class="stat-card"><div class="stat-num" style="color:var(--c-primary)">' + result.total + '</div><div class="stat-label">自动得分 / ' + paper.totalScore + '</div></div>' +
        '<div class="stat-card"><div class="stat-num" id="manualTotal" style="color:var(--c-exam)">0</div><div class="stat-label">自评主观分</div></div>' +
        '<div class="stat-card"><div class="stat-num" id="grandTotal" style="color:var(--c-success)">' + result.total + '</div><div class="stat-label">最终总分</div></div>' +
      '</div>' +
      '<div class="alert alert-info">客观题自动判分；主观题请对照评分细则，在下方输入自评得分，系统实时累加。</div>' +
      '<div id="examDetail">' + renderExamDetail(result, paper) + '</div>' +
      '<div class="no-print" style="margin-top:10px"><button class="btn btn-primary" id="btnSaveExam">保存成绩并复盘</button> <button class="btn" data-action="backToExamList">返回试卷列表</button></div>' +
    '</div>';

  // 自评输入实时累加
  container.querySelectorAll('[data-manual]').forEach(inp => {
    inp.addEventListener('input', function () {
      updateManualTotal(container, paper, result);
    });
  });

  const save = container.querySelector('#btnSaveExam');
  if (save) save.addEventListener('click', function () {
    saveExamRecord(container, session);
  });
}

function renderExamDetail(result, paper) {
  return result.detail.map(d => {
    const q = paper.questions.find(x => x.qId === d.qId);
    const guide = (paper.scoringGuide || {})[d.qId];
    let extra = '';
    if (d.manual) {
      extra = '<div class="pitfall-box">📐 评分细则（步骤分）：<ol class="analysis-steps">' +
        (guide || ['对照参考答案酌情给分']).map(g => '<li>' + esc(g) + '</li>').join('') + '</ol>' +
        '<div style="margin-top:6px">自评得分：<input class="input" type="number" min="0" max="' + d.max + '" value="0" data-manual="' + esc(d.qId) + '" style="width:90px;display:inline-block"> / ' + d.max + ' 分</div></div>';
    }
    return '<div class="question-card" style="border-left:4px solid ' + (d.correct ? 'var(--c-success)' : 'var(--c-mistake)') + '">' +
      '<div class="question-head"><span class="tag">' + d.seq + '. ' + esc(d.type) + '</span><span class="tag">' + d.score + '/' + d.max + ' 分</span>' +
      (d.correct ? '<span class="tag tag-green">✓</span>' : '<span class="tag tag-red">✗</span>') +
      (d.manual ? '<span class="tag tag-orange">待自评</span>' : '') + '</div>' +
      '<div class="question-stem">' + esc(q.body.stem) + '</div>' +
      '<div class="answer-box"><span class="bold">参考答案：</span>' + esc(q.body.answer) + '</div>' + extra +
    '</div>';
  }).join('');
}

function updateManualTotal(container, paper, result) {
  let sum = 0;
  container.querySelectorAll('[data-manual]').forEach(inp => {
    sum += Math.max(0, Math.min(Number(inp.value) || 0, Number(inp.getAttribute('max')) || 0));
  });
  const t = container.querySelector('#manualTotal');
  const g = container.querySelector('#grandTotal');
  if (t) t.textContent = sum;
  if (g) g.textContent = result.total + sum;
}

function saveExamRecord(container, session) {
  const paper = session.paper;
  const result = session.result;
  let manualSum = 0;
  const manualScores = {};
  container.querySelectorAll('[data-manual]').forEach(inp => {
    const v = Math.max(0, Math.min(Number(inp.value) || 0, Number(inp.getAttribute('max')) || 0));
    manualScores[inp.getAttribute('data-manual')] = v;
    manualSum += v;
  });
  const finalScore = result.total + manualSum;
  const record = {
    id: 'ex_' + Date.now(),
    paperId: paper.id,
    subject: paper.subject,
    date: todayStr(),
    durationUsed: Math.round(session.elapsed / 60),
    score: finalScore,
    totalScore: paper.totalScore,
    detail: result.detail,
    manualScores: manualScores,
    review: { wrongKps: [], errorTypes: [], remedy: '' }
  };
  AppState.examSession.recordId = record.id;
  AppState.exams.unshift(record);
  if (AppState.exams.length > 50) AppState.exams.length = 50;
  Store.saveExams();
  renderReviewSheet(container, record);
}

function renderReviewSheet(container, record) {
  const paper = DataCenter.getPaper(record.paperId);
  const wrongs = record.detail.filter(d => !d.correct);
  container.innerHTML =
    '<div class="page-head"><h2>📋 考后自评复盘 <span class="muted small">' + esc(paper.title) + '</span></h2></div>' +
    '<div class="card">' +
      '<h3 class="card-title">复盘表（总分 ' + record.score + '/' + record.totalScore + '）</h3>' +
      (wrongs.length === 0
        ? '<div class="alert alert-success">🎉 全对！无需复盘，继续保持。</div>'
        : '<div class="table-wrap"><table class="data-table"><thead><tr><th>题号</th><th>考点</th><th>失分</th><th>错因</th><th>补救建议</th></tr></thead><tbody>' +
          wrongs.map(d => {
            const q = paper.questions.find(x => x.qId === d.qId);
            const kp = q ? DataCenter.getKp(record.subject, q.body.kpId || '') : null;
            return '<tr><td>' + d.seq + '</td><td class="small">' + esc(kp ? kp.name : (q ? q.body.type + '题' : '—')) + '</td>' +
              '<td>' + (d.max - d.score) + '</td>' +
              '<td><select class="select" data-review-err="' + esc(d.qId) + '">' +
                ['概念不清', '公式记错', '计算失误', '审题偏差', '方法不会', '粗心'].map(t => '<option value="' + t + '">' + t + '</option>').join('') +
              '</select></td>' +
              '<td><input class="input" data-review-remedy="' + esc(d.qId) + '" placeholder="补救措施（如：重做同类题 3 道）"></td></tr>';
          }).join('') + '</tbody></table></div>') +
      '<div class="no-print" style="margin-top:10px"><button class="btn btn-success" id="btnSaveReview">保存复盘</button> <button class="btn" data-action="backToExamList">完成</button></div>' +
    '</div>';

  const btn = container.querySelector('#btnSaveReview');
  if (btn) btn.addEventListener('click', function () {
    const errorTypes = [];
    const wrongKps = [];
    const remedy = [];
    container.querySelectorAll('[data-review-err]').forEach(el => {
      const qid = el.getAttribute('data-review-err');
      const err = el.value;
      errorTypes.push(err);
      const q = paper.questions.find(x => x.qId === qid);
      if (q && q.body.kpId) wrongKps.push(q.body.kpId);
      const remEl = container.querySelector('[data-review-remedy="' + qid + '"]');
      if (remEl && remEl.value.trim()) remedy.push(remEl.value.trim());
    });
    record.review = { wrongKps: wrongKps, errorTypes: Array.from(new Set(errorTypes)), remedy: remedy.join('；') };
    const idx = AppState.exams.findIndex(x => x.id === record.id);
    if (idx !== -1) AppState.exams[idx] = record;
    Store.saveExams();
    alert('✅ 复盘已保存');
    Router.navigate('#/exam');
  });
}

function renderExamHistory(s) {
  const list = AppState.exams.filter(e => e.subject === s).slice(0, 8);
  if (list.length === 0) return '<div class="empty">暂无模拟成绩，快去考一套吧</div>';
  const recent = list.slice(0, 5).reverse();
  const bars = recent.map(r => {
    const pct = Math.max(3, Math.round(r.score / r.totalScore * 100));
    return '<div class="bar-col"><div class="bar" style="height:' + pct + '%" title="' + r.score + '/' + r.totalScore + '"></div>' +
      '<div class="bar-val">' + r.score + '</div><div class="bar-label">' + esc(r.date.slice(5)) + '</div></div>';
  }).join('');
  return '<div class="bar-chart">' + bars + '</div>' +
    '<div class="table-wrap" style="margin-top:8px"><table class="data-table" style="min-width:420px"><thead><tr><th>日期</th><th>试卷</th><th>得分</th><th>用时</th></tr></thead><tbody>' +
    list.map(r => '<tr><td>' + esc(r.date) + '</td><td class="small">' + esc((DataCenter.getPaper(r.paperId) || {}).title || r.paperId) + '</td>' +
      '<td><span class="bold">' + r.score + '</span>/' + r.totalScore + '</td><td>' + r.durationUsed + ' 分钟</td></tr>').join('') +
    '</tbody></table></div>';
}

/* ==================== 注册视图 ==================== */
Modules.register('pastPapers', renderPastPapers);
Modules.register('plan', renderPlan);
Modules.register('mindmap', renderMindmap);
Modules.register('exam', renderExam);

console.log('[Modules] modules-plan.js loaded (pastPapers/plan/mindmap/exam)');
