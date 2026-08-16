/* ============================================================
   modules-predict.js —— 2027 预测 + 首页仪表盘
   职责：
    M9 2027 预测：学科 Tab + 知识点预测表 / 热点考点 / 可能题目 / 3 套预测卷 / 预测依据
    首页仪表盘：今日打卡、待复习错题、最近模拟成绩、计划进度、快捷入口
   依赖：store.js、router.js、modules-*.js（仅经 Modules/AppState 联动）
   ============================================================ */

/* ==================== M9 2027 预测 ==================== */
function renderPredict(container) {
  const s = AppState.subject;
  const pred = DataCenter.getPrediction(s);

  container.innerHTML =
    '<div class="page-head"><h2>🔮 2027 考试预测 <span class="muted small">' + SUBJECT_NAMES[s] + '</span></h2></div>' +
    '<div class="seg-tabs no-print">' +
      '<button class="seg-tab' + (s === 'math' ? ' active' : '') + '" data-action="switchSubject" data-id="math">数学</button>' +
      '<button class="seg-tab' + (s === 'physics' ? ' active' : '') + '" data-action="switchSubject" data-id="physics">物理</button>' +
      (s === 'olympiad' ? '<span class="muted small" style="align-self:center">初中奥数暂无预测报告</span>' : '') +
    '</div>';

  if (!pred) {
    container.innerHTML += '<div class="empty"><span class="empty-icon">🤖</span>初中奥数为竞赛拓展学科，暂无 2027 考试预测报告。<br>可切换到「数学 / 物理」查看预测。</div>';
    return;
  }

  const html =
    '<div class="card"><h3 class="card-title">① 知识点预测表 <span class="card-sub">共 ' + pred.knowledgePredictions.length + ' 项</span></h3>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>知识点</th><th>年级</th><th>预测依据</th><th>星级</th></tr></thead><tbody>' +
      pred.knowledgePredictions.map(k =>
        '<tr><td class="bold">' + esc(k.name) + '</td><td>' + esc(k.grade) + '</td><td class="small">' + esc(k.basis) + '</td>' +
        '<td><span class="stars">' + '★'.repeat(k.stars) + '</span></td></tr>'
      ).join('') + '</tbody></table></div>' +
    '</div>' +

    '<div class="card"><h3 class="card-title">② 热点考点预测 <span class="card-sub">真实事件 + 关联考查</span></h3>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>热点事件</th><th>关联知识点</th><th>可能考查方式</th></tr></thead><tbody>' +
      pred.hotTopics.map(h =>
        '<tr><td class="small bold" style="max-width:200px">' + esc(h.event) + '</td><td>' + (h.kps || []).map(k => '<span class="tag tag-blue">' + esc(k) + '</span>').join('') + '</td><td class="small">' + esc(h.how) + '</td></tr>'
      ).join('') + '</tbody></table></div>' +
    '</div>' +

    '<div class="card"><h3 class="card-title">③ 可能题目预测</h3>' +
      '<ol style="margin:0;padding-left:20px">' +
      pred.possibleQuestions.map(p => '<li style="margin-bottom:8px"><span class="tag tag-orange">' + esc(p.type) + '</span><div class="small" style="margin-top:4px">' + esc(p.desc) + '</div></li>').join('') +
      '</ol>' +
    '</div>' +

    '<div class="card"><h3 class="card-title">④ 3 套预测模拟卷 <span class="card-sub">压轴错位设计</span></h3>' +
      '<div class="grid grid-3">' +
      pred.papers.map(pid => {
        const p = DataCenter.getPaper(pid);
        if (!p) return '';
        const struct = (p.structure || []).map(x => x.section + ' ' + x.count + '题/' + x.score + '分').join('；');
        return '<div class="card" style="margin-bottom:0">' +
          '<div class="bold" style="font-size:14px">' + esc(p.title) + '</div>' +
          '<div class="small muted" style="margin:4px 0">卷面：' + esc(struct) + '</div>' +
          '<div class="small" style="margin:4px 0"><span class="tag tag-blue">' + p.totalScore + ' 分</span><span class="tag tag-orange">' + p.duration + ' 分钟</span></div>' +
          '<button class="btn btn-exam btn-sm btn-block" data-action="goToPaper" data-id="' + esc(pid) + '">去练习该卷 →</button>' +
        '</div>';
      }).join('') + '</div>' +
    '</div>' +

    '<div class="card"><h3 class="card-title">⑤ 预测依据来源</h3>' +
      '<ul style="margin:0;padding-left:20px">' +
      pred.sources.map(sr => '<li style="margin-bottom:6px"><span class="tag ' + (sr.type === '政策文件' ? 'tag-red' : sr.type === '命题趋势' ? 'tag-orange' : 'tag-blue') + '">' + esc(sr.type) + '</span> <span class="small">' + esc(sr.label) + '</span></li>').join('') +
      '</ul><p class="small muted">预测仅供参考，最终以广州市教育局官方发布为准。</p>' +
    '</div>';

  container.innerHTML += html;
}

/* ==================== 首页仪表盘 ==================== */
function renderDashboard(container) {
  const s = AppState.subject;
  const mistakes = AppState.mistakes.filter(m => !m.mastered);
  const today = todayStr();
  const checkins = AppState.checkins;
  const todayRec = (checkins && checkins.records[today]) || null;

  // 今日打卡统计（当前学科）
  let reciteText = '今日无任务';
  if (checkins) {
    const task = EbbinghausScheduler.getTodayTask(s, today);
    const total = task.newIds.length + task.reviewIds.length + task.selfTest.length;
    reciteText = todayRec ? '✅ 今日已打卡' : ('📌 今日 ' + task.newIds.length + ' 新背 + ' + task.reviewIds.length + ' 复习 + ' + task.selfTest.length + ' 自测');
    if (total === 0) reciteText = '🎉 今日无任务';
  }

  // 最近模拟成绩
  const recentExam = AppState.exams.slice().sort((a, b) => b.date.localeCompare(a.date))[0];

  // 计划进度
  let planPct = 0, planText = '尚未生成计划';
  if (AppState.plan) {
    const phases = AppState.plan.phases;
    let totalDays = 0, doneDays = 0;
    const start = AppState.plan.params.startDate;
    const end = phases[phases.length - 1].range[1];
    totalDays = Math.max(1, dayDiff(start, end) + 1);
    doneDays = Math.max(0, Math.min(totalDays, dayDiff(start, today) + 1));
    planPct = Math.round(doneDays / totalDays * 100);
    planText = AppState.plan.compressed ? '压缩冲刺计划' : '三阶段计划';
  }

  const quick = [
    { view: 'knowledge', icon: '📚', title: '考点库', desc: '高频 Top10 / 易错清单' },
    { view: 'practice', icon: '✏️', title: '智能刷题', desc: '按考点难度出题' },
    { view: 'mistakes', icon: '📕', title: '错题回顾', desc: '自动错因诊断' },
    { view: 'plan', icon: '🗺️', title: '复习计划', desc: '三阶段自动生成' },
    { view: 'exam', icon: '📝', title: '模拟考试', desc: '计时 + 自动评分' },
    { view: 'recite', icon: '🗓️', title: '背诵打卡', desc: '艾宾浩斯排程' },
    { view: 'mindmap', icon: '🧠', title: '思维导图', desc: '章节知识树' },
    { view: 'pastPapers', icon: '🏛️', title: '真题库', desc: '5 年频次矩阵' },
    { view: 'predict', icon: '🔮', title: '2027 预测', desc: '预测报告 + 预测卷' }
  ];

  container.innerHTML =
    '<div class="page-head"><h2>👋 欢迎回来 <span class="muted small">' + SUBJECT_NAMES[s] + ' · ' + today + ' ' + getDayCN(today) + '</span></h2></div>' +

    '<div class="stat-grid">' +
      '<div class="stat-card"><div class="stat-icon">🗓️</div><div class="stat-num" style="font-size:18px">' + esc(reciteText) + '</div><div class="stat-label">今日打卡</div></div>' +
      '<div class="stat-card"><div class="stat-icon">📕</div><div class="stat-num" style="color:var(--c-mistake)">' + mistakes.length + '</div><div class="stat-label">待复习错题</div></div>' +
      '<div class="stat-card"><div class="stat-icon">📝</div><div class="stat-num">' + (recentExam ? recentExam.score : '—') + (recentExam ? '<span class="small muted">/' + recentExam.totalScore + '</span>' : '') + '</div><div class="stat-label">最近模拟成绩</div></div>' +
      '<div class="stat-card"><div class="stat-icon">🗺️</div><div class="stat-num" style="font-size:22px">' + planPct + '%</div><div class="stat-label">计划进度</div></div>' +
    '</div>' +

    '<div class="grid grid-3">' +
      '<div class="card" style="grid-column: span 2;">' +
        '<h3 class="card-title">⚡ 快捷入口</h3>' +
        '<div class="quick-grid">' +
          quick.map(q => '<div class="quick-item" data-action="goView" data-id="' + q.view + '"><div class="q-icon">' + q.icon + '</div><div class="q-title">' + q.title + '</div><div class="q-desc">' + q.desc + '</div></div>').join('') +
        '</div>' +
      '</div>' +
      '<div>' +
        '<div class="card"><h3 class="card-title">📊 计划进度</h3>' +
          (AppState.plan
            ? '<div class="small muted" style="margin-bottom:6px">' + esc(planText) + ' · ' + esc(AppState.plan.params.startDate) + ' 起</div>' +
              '<div class="progress"><div class="progress-bar success" style="width:' + planPct + '%"></div></div>' +
              '<div class="small muted" style="margin-top:6px">已执行 ' + planPct + '%</div>' +
              '<div class="no-print" style="margin-top:8px"><button class="btn btn-sm" data-action="goView" data-id="plan">查看计划 →</button></div>'
            : '<div class="empty"><span class="empty-icon">🗺️</span>还没有复习计划<br><button class="btn btn-sm btn-primary" data-action="goView" data-id="plan" style="margin-top:6px">去生成</button></div>') +
        '</div>' +
        '<div class="card"><h3 class="card-title">📈 最近模拟</h3>' +
          (recentExam
            ? '<div class="bold" style="font-size:18px">' + recentExam.score + ' <span class="small muted">/ ' + recentExam.totalScore + ' 分</span></div>' +
              '<div class="small muted">' + esc(recentExam.date) + ' · ' + esc((DataCenter.getPaper(recentExam.paperId) || {}).title || '') + '</div>' +
              '<div class="no-print" style="margin-top:8px"><button class="btn btn-sm" data-action="goView" data-id="exam">查看历史 →</button></div>'
            : '<div class="empty"><span class="empty-icon">📝</span>还没有模拟成绩<br><button class="btn btn-sm btn-exam" data-action="goView" data-id="exam" style="margin-top:6px">去考试</button></div>') +
        '</div>' +
      '</div>' +
    '</div>';
}

/* ==================== 注册视图 ==================== */
Modules.register('dashboard', renderDashboard);
Modules.register('predict', renderPredict);

console.log('[Modules] modules-predict.js loaded (dashboard/predict)');
