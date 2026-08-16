/* ============================================================
   modules-learn.js —— 学习闭环四模块
   职责：
    M1 考点库：筛选 / 表格 / 详情 / 高频 Top10 / 易错清单
    M3 智能刷题：QuestionPicker 抽题 + 作答 / 交卷判分 / 解析变式 / 历史持久化
    M4 错题回顾：录入 + MistakeEngine 错因规则引擎 + 四段诊断卡 + 变式 + 错题本管理
    M8 背诵打卡：EbbinghausScheduler 排程 + 今日任务 + 打卡日历 + 周总结
   依赖：store.js、router.js（Modules）、data-*.js（DATA）
   约定：不直接调用 localStorage，一律走 Store；用户输入渲染前 esc()
   ============================================================ */

/* ==================== 抽题器 QuestionPicker ==================== */
window.QuestionPicker = {
  /**
   * 按参数抽题：kpId + 难度过滤 → 星级升序 → 截断 ≤20
   * @param {Object} params {subject, kpId, difficulty, count}
   * @returns {Array} 题目数组
   */
  pick(params) {
    const subject = params.subject || AppState.subject;
    let list = DataCenter.getQuestions(subject).slice();
    if (params.kpId && params.kpId !== '全部') {
      list = list.filter(q => q.kpId === params.kpId);
    }
    if (params.difficulty && params.difficulty !== '全部') {
      list = list.filter(q => q.difficulty === Number(params.difficulty));
    }
    list = this.sortByDifficulty(list);
    const count = Math.min(Number(params.count) || 10, 20);
    return list.slice(0, count);
  },

  /** 按难度星级升序（1→3），同难度随机打乱 */
  sortByDifficulty(list) {
    return list.slice().sort((a, b) => (a.difficulty - b.difficulty) || (Math.random() - 0.5));
  }
};

/* ==================== 错因诊断引擎 MistakeEngine ==================== */
window.MistakeEngine = {
  TIP_MAP: {
    '概念不清': '先回归教材把定义读三遍，用一句话复述概念再做题。',
    '公式记错': '把公式抄在小卡片上，每天默写一遍，做题前先写公式。',
    '计算失误': '慢一点！每步都打草稿，算完用代入法验算结果。',
    '审题偏差': '圈出题干关键词（范围/条件/单位），下笔前复述题目要求。',
    '方法不会': '看解析后合上书重做一遍，隔天再做同类题检验。',
    '粗心': '做完检查三件事：符号、单位、是否答非所问。'
  },

  /** 规则引擎诊断 */
  diagnose(m) {
    const scores = { '概念不清': 0, '公式记错': 0, '计算失误': 0, '审题偏差': 0, '方法不会': 0, '粗心': 0 };
    const text = (m.question || '') + ' ' + (m.myAnswer || '');

    // 规则1 文本特征
    if (/看错|漏看|没看清|抄错|理解错题意|理解错/.test(text)) scores['审题偏差'] += 3;
    if (/算错|算成|结果不对|计算粗心|算出来不对/.test(m.myAnswer || '')) scores['计算失误'] += 3;
    if (/公式|定理|记错/.test(m.myAnswer || '')) scores['公式记错'] += 2;
    if (/不会|没思路|想不到|卡住|无从下手/.test(m.myAnswer || '')) scores['方法不会'] += 3;
    if (/粗心|马虎|不小心/.test(m.myAnswer || '')) scores['粗心'] += 2;

    // 规则2 考点与题型特征
    const kp = DataCenter.getKp(m.subject, m.kpId);
    const qType = this.inferType(m.question);
    if ((qType === '计算' || qType === '填空') && /[0-9]/.test(m.myAnswer || '') && /[0-9]/.test(m.correctAnswer || '') && normalize(m.myAnswer) !== normalize(m.correctAnswer)) {
      scores['计算失误'] += 2;
    }
    if (kp && kp.difficulty === '压轴' && qType === '解答') scores['方法不会'] += 2;
    if (kp && kp.tags && kp.tags.indexOf('易错') !== -1) scores['概念不清'] += 1;

    // 规则3 兜底
    let errorType = '概念不清';
    let max = 0;
    Object.keys(scores).forEach(k => { if (scores[k] > max) { max = scores[k]; errorType = k; } });
    if (max === 0) { scores['概念不清'] += 2; errorType = '概念不清'; }

    const solution = (kp ? kp.desc + '；' : '') + (this.cleanSolution(m));
    const tip = this.TIP_MAP[errorType];
    const variant = this.findVariant(m.subject, m.kpId, kp);
    const isHot = !!(kp && kp.frequency >= 3);

    return { errorType, scores, solution, tip, variant, isHot };
  },

  /** 从题干推断题型 */
  inferType(stem) {
    if (/如图|图形|几何|证明/.test(stem || '')) return '解答';
    if (/计算/.test(stem || '')) return '计算';
    if (/填空|______/.test(stem || '')) return '填空';
    return '解答';
  },

  /** 拼接正确思路（优先取题解析，否则用考点描述） */
  cleanSolution(m) {
    if (m.correctAnswer) return '正确答案：' + m.correctAnswer;
    return '建议先回顾对应考点，再做同类题巩固';
  },

  /**
   * 找变式：同 kp、难度相邻且 id 不同；无则同 board
   * @returns {Object|null} 变式题（含 stem/answer/analysis）
   */
  findVariant(subject, kpId, kp) {
    const qs = DataCenter.getQuestions(subject).filter(q => q.id !== undefined);
    let target = kpId ? qs.filter(q => q.kpId === kpId) : [];
    if (target.length === 0 && kp) {
      target = qs.filter(q => {
        const qkp = DataCenter.getKp(subject, q.kpId);
        return qkp && qkp.board === kp.board;
      });
    }
    if (target.length === 0) target = qs;
    const pick = target[Math.floor(Math.random() * target.length)];
    if (!pick) return null;
    return pick.variant || { stem: pick.stem, answer: pick.answer, analysis: pick.analysis };
  }
};

/* ==================== 艾宾浩斯排程 EbbinghausScheduler ==================== */
window.EbbinghausScheduler = {
  REVIEW_INTERVALS: [1, 2, 4, 7, 15],

  /** 排程：按 importance 降序分 21 天，返回 learnDay 映射 {itemId: day} */
  planRecite(subject, startDate, cycleDays) {
    const days = cycleDays || 21;
    const items = DataCenter.getReciteItems(subject).slice().sort((a, b) => b.importance - a.importance);
    const batchSize = Math.max(1, Math.round(items.length / days));
    const map = {};
    items.forEach((item, idx) => {
      map[item.id] = Math.floor(idx / batchSize);
    });
    return { items, batchSize, learnDay: map };
  },

  /** 计算某日任务 */
  getTodayTask(subject, today) {
    const checkins = AppState.checkins;
    if (!checkins) return { newIds: [], reviewIds: [], selfTest: [], batchSize: 1 };
    const plan = this.planRecite(subject, checkins.startDate, checkins.cycleDays);
    const d = dayDiff(checkins.startDate, today);
    const newIds = plan.items.filter(it => plan.learnDay[it.id] === d).map(it => it.id);
    const reviewIds = plan.items.filter(it => {
      const ld = plan.learnDay[it.id];
      if (ld >= d) return false;
      const gap = d - ld;
      return this.REVIEW_INTERVALS.indexOf(gap) !== -1;
    }).map(it => it.id);
    const selfTest = this.pickSelfTest(subject, newIds.concat(reviewIds));
    return { newIds, reviewIds, selfTest, batchSize: plan.batchSize };
  },

  /** 自测题：从题库取 selfTest=true 且 kp 关联当日清单，3~5 道 */
  pickSelfTest(subject, itemIds) {
    const kpSet = {};
    DataCenter.getReciteItems(subject).forEach(it => {
      if (itemIds.indexOf(it.id) !== -1 && it.kpId) kpSet[it.kpId] = true;
    });
    let pool = DataCenter.getQuestions(subject).filter(q => q.selfTest && (q.kpId && kpSet[q.kpId]));
    if (pool.length < 3) {
      pool = DataCenter.getQuestions(subject).filter(q => q.selfTest);
    }
    // 去重打乱取 3~5
    const seen = {};
    const out = [];
    for (const q of pool) {
      if (seen[q.id]) continue;
      seen[q.id] = true;
      out.push(q);
      if (out.length >= 5) break;
    }
    return out.slice(0, Math.min(5, Math.max(3, out.length)));
  }
};

/* ==================== M1 考点库 ==================== */
function renderKnowledge(container) {
  const s = AppState.subject;
  const data = DATA[s];
  const kps = data.knowledgePoints || [];
  const f = AppState.kpFilter;

  // 年级/板块/难度/频次 选项（数据驱动）
  const gradeOptions = ['全部'].concat(Array.from(new Set(kps.map(k => k.grade))));
  const boardOptions = ['全部'].concat(Array.from(new Set(kps.map(k => k.board))));
  const diffOptions = ['全部', '基础', '中档', '压轴'];
  const freqOptions = ['全部', '高频(≥4)', '必考(5)', '低频(≤1)'];

  const sel = (name, opts, val) =>
    '<select class="select" data-filter="' + name + '">' +
    opts.map(o => '<option value="' + esc(o) + '"' + (val === o ? ' selected' : '') + '>' + esc(o) + '</option>').join('') +
    '</select>';

  container.innerHTML =
    '<div class="page-head"><h2>📚 考点库 <span class="muted small">' + SUBJECT_NAMES[s] + '</span></h2></div>' +
    '<div class="filter-bar">' +
      '<div class="filter-item"><label>年级</label>' + sel('grade', gradeOptions, f.grade) + '</div>' +
      '<div class="filter-item"><label>知识板块</label>' + sel('board', boardOptions, f.board) + '</div>' +
      '<div class="filter-item"><label>难度</label>' + sel('difficulty', diffOptions, f.difficulty) + '</div>' +
      '<div class="filter-item"><label>频次</label>' + sel('frequency', freqOptions, f.frequency) + '</div>' +
      '<button class="btn" data-action="resetKpFilter">重置</button>' +
    '</div>' +
    '<div class="grid grid-3">' +
      '<div class="card" style="grid-column: span 2;">' +
        '<h3 class="card-title">考点列表（' + kps.length + ' 个）</h3>' +
        '<div class="table-wrap"><table class="data-table" id="kpTable"><thead><tr>' +
          '<th>考点</th><th>章节</th><th>年级</th><th>频次</th><th>难度</th><th>题型</th><th>标签</th>' +
        '</tr></thead><tbody>' + kpTableRows() + '</tbody></table></div>' +
      '</div>' +
      '<div>' +
        '<div class="card"><h3 class="card-title">🔥 高频 Top10</h3>' + renderHotTop10() + '</div>' +
        '<div class="card"><h3 class="card-title">⚠️ 易错点清单</h3>' + renderEasyMistakes() + '</div>' +
      '</div>' +
    '</div>' +
    '<div id="kpDetailWrap"></div>';

  // 筛选变化
  container.querySelectorAll('[data-filter]').forEach(selEl => {
    selEl.addEventListener('change', function () {
      AppState.kpFilter[this.getAttribute('data-filter')] = this.value;
      renderKnowledge(container);
    });
  });
}

function kpTableRows() {
  const s = AppState.subject;
  const f = AppState.kpFilter;
  let kps = DataCenter.getKnowledgePoints(s).slice();
  if (f.grade !== '全部') kps = kps.filter(k => k.grade === f.grade);
  if (f.board !== '全部') kps = kps.filter(k => k.board === f.board);
  if (f.difficulty !== '全部') kps = kps.filter(k => k.difficulty === f.difficulty);
  if (f.frequency !== '全部') {
    if (f.frequency === '高频(≥4)') kps = kps.filter(k => k.frequency >= 4);
    else if (f.frequency === '必考(5)') kps = kps.filter(k => k.frequency === 5);
    else if (f.frequency === '低频(≤1)') kps = kps.filter(k => k.frequency <= 1);
  }
  if (kps.length === 0) return '<tr><td colspan="7"><div class="empty">没有符合条件的考点</div></td></tr>';
  return kps.map(k =>
    '<tr data-action="openKpDetail" data-id="' + esc(k.id) + '">' +
      '<td><span class="bold">' + esc(k.name) + '</span>' + (k.hotRank ? ' <span class="tag tag-star">TOP' + k.hotRank + '</span>' : '') + '</td>' +
      '<td class="small">' + esc(k.chapter) + '</td>' +
      '<td>' + esc(k.grade) + '</td>' +
      '<td>' + freqTag(k.frequency) + '</td>' +
      '<td>' + diffTag(k.difficulty) + '</td>' +
      '<td class="small">' + esc((k.questionTypes || []).join(' / ')) + '</td>' +
      '<td>' + (k.tags || []).map(t => tagHtml(t)).join('') + '</td>' +
    '</tr>'
  ).join('');
}

function freqTag(n) {
  if (n >= 4) return '<span class="tag tag-red">' + n + ' 次</span>';
  if (n >= 2) return '<span class="tag tag-orange">' + n + ' 次</span>';
  return '<span class="tag">' + n + ' 次</span>';
}

function diffTag(d) {
  const map = { '基础': 'tag-green', '中档': 'tag-orange', '压轴': 'tag-red' };
  return '<span class="tag ' + (map[d] || '') + '">' + esc(d) + '</span>';
}

function tagHtml(t) {
  const map = { '必会': 'tag-blue', '易错': 'tag-red', '常考变形': 'tag-orange', '压轴': 'tag-red', '竞赛': 'tag-purple' };
  return '<span class="tag ' + (map[t] || '') + '">' + esc(t) + '</span>';
}

function renderHotTop10() {
  const s = AppState.subject;
  const hot = DATA[s].hotTop10 || [];
  if (hot.length === 0) return '<div class="empty">暂无高频数据</div>';
  return '<ol style="margin:0;padding-left:20px">' + hot.map((k, i) =>
    '<li style="margin-bottom:6px"><span class="bold">' + (i + 1) + '. ' + esc(k.name) + '</span> ' + freqTag(k.frequency) + '<div class="small muted">' + esc(k.board) + ' · ' + esc(k.grade) + '</div></li>'
  ).join('') + '</ol>';
}

function renderEasyMistakes() {
  const s = AppState.subject;
  const list = DATA[s].easyMistakes || [];
  if (list.length === 0) return '<div class="empty">暂无易错点</div>';
  return list.map(m =>
    '<div class="diag-card diag-4" style="margin-bottom:8px"><div class="bold" style="font-size:13.5px">⚠ ' + esc(m.title) + '</div><div class="small muted">' + esc(m.advice) + '</div></div>'
  ).join('');
}

function showKpDetail(container, kpId) {
  const s = AppState.subject;
  const k = DataCenter.getKp(s, kpId);
  if (!k) return;
  const related = (k.relatedIds || []).map(id => {
    const rk = DataCenter.getKp(s, id);
    return rk ? '<span class="tag tag-blue" data-action="openKpDetail" data-id="' + esc(id) + '" style="cursor:pointer">' + esc(rk.name) + '</span>' : '';
  }).join('') || '<span class="muted small">无</span>';

  const wrap = container.querySelector('#kpDetailWrap');
  wrap.innerHTML =
    '<div class="card">' +
      '<h3 class="card-title">📖 ' + esc(k.name) + ' <span class="card-sub">' + esc(k.id) + '</span></h3>' +
      '<div class="kp-detail-grid">' +
        '<div class="item"><span class="k">知识板块</span><span class="v">' + esc(k.board) + '</span></div>' +
        '<div class="item"><span class="k">年级册次</span><span class="v">' + esc(k.grade) + ' · ' + esc(k.volume) + '</span></div>' +
        '<div class="item"><span class="k">章节</span><span class="v">' + esc(k.chapter) + '</span></div>' +
        '<div class="item"><span class="k">近5年频次</span><span class="v">' + freqTag(k.frequency) + '</span></div>' +
        '<div class="item"><span class="k">难度</span><span class="v">' + diffTag(k.difficulty) + '</span></div>' +
        '<div class="item"><span class="k">常考题型</span><span class="v">' + esc((k.questionTypes || []).join(' / ')) + '</span></div>' +
      '</div>' +
      '<p><span class="bold">内容概述：</span>' + esc(k.desc) + '</p>' +
      '<div class="alert alert-info"><span class="bold">考情提示：</span>' + esc(k.examHint || '暂无') + '</div>' +
      '<p><span class="bold">关联考点：</span>' + related + '</p>' +
      '<div class="no-print"><button class="btn btn-sm" data-action="closeKpDetail">收起</button> ' +
      '<button class="btn btn-sm btn-primary" data-action="practiceFromKp" data-id="' + esc(k.id) + '">刷本题考点</button></div>' +
    '</div>';
  wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ==================== M3 智能刷题 ==================== */
function renderPractice(container) {
  const s = AppState.subject;
  const kps = DataCenter.getKnowledgePoints(s);
  const session = AppState.practiceSession;
  const presetKp = AppState.practicePresetKp || '';

  const kpOptions = '<option value="全部">全部考点</option>' + kps.map(k => '<option value="' + esc(k.id) + '"' + (presetKp === k.id ? ' selected' : '') + '>' + esc(k.name) + '</option>').join('');
  const diffOptions = ['全部', 1, 2, 3].map(d => '<option value="' + d + '">' + (d === '全部' ? '全部难度' : '★'.repeat(Number(d))) + '</option>').join('');

  let head = '<div class="page-head"><h2>✏️ 智能刷题 <span class="muted small">' + SUBJECT_NAMES[s] + '</span></h2></div>';

  if (!session || session.params.subject !== s || session.submitted === false) {
    // 参数面板
    container.innerHTML = head +
      '<div class="card">' +
        '<h3 class="card-title">出题参数</h3>' +
        '<div class="field-group">' +
          '<div class="form-row"><label>考点</label><select class="select" id="prKp">' + kpOptions + '</select></div>' +
          '<div class="form-row"><label>难度</label><select class="select" id="prDiff">' + diffOptions + '</select></div>' +
          '<div class="form-row"><label>题量（≤20）</label><input class="input" id="prCount" type="number" min="1" max="20" value="' + (AppState.prefs.lastPractice.count || 10) + '"></div>' +
          '<div class="form-row"><button class="btn btn-primary" id="btnStartPractice">开始刷题</button></div>' +
        '</div>' +
        '<p class="small muted" style="margin-bottom:0">按考点与难度抽题，由易到难排序，交卷后查看答案 / 分步解析 / 易错提醒 / 变式。</p>' +
      '</div>' +
      '<div class="card"><h3 class="card-title">📈 刷题记录 <span class="card-sub">最近 10 次</span></h3>' + renderHistoryList() + '</div>';

    const btn = container.querySelector('#btnStartPractice');
    btn.addEventListener('click', function () {
      const kpId = container.querySelector('#prKp').value;
      const difficulty = container.querySelector('#prDiff').value;
      const count = parseInt(container.querySelector('#prCount').value, 10) || 10;
      AppState.prefs.lastPractice = { difficulty: difficulty === '全部' ? 2 : Number(difficulty), count: count };
      Store.savePrefs();
      const questions = QuestionPicker.pick({ subject: s, kpId: kpId, difficulty: difficulty, count: count });
      if (questions.length === 0) { alert('该筛选条件下暂无题目，请放宽条件'); return; }
      AppState.practiceSession = { params: { subject: s, kpId: kpId, difficulty: difficulty, count: count }, questions: questions, answers: {}, submitted: false, correctCount: 0 };
      AppState.practicePresetKp = null;
      renderPractice(container);
    });
    return;
  }

  // 会话中（作答中 / 已交卷）
  const qs = session.questions;
  const submitted = session.submitted;
  container.innerHTML = head +
    '<div class="card">' +
      '<h3 class="card-title">📝 本次题组（' + qs.length + ' 题）<span class="card-sub">' + (submitted ? '已交卷' : '作答中') + '</span></h3>' +
      qs.map((q, i) => renderPracticeQuestion(q, i, session, submitted)).join('') +
      '<div class="no-print" style="margin-top:8px">' +
        (submitted
          ? '<button class="btn btn-primary" data-action="restartPractice">再练一组</button>'
          : '<button class="btn btn-exam" id="btnSubmitPractice">交卷判分</button>') +
      '</div>' +
    '</div>';

  if (!submitted) {
    const submitBtn = container.querySelector('#btnSubmitPractice');
    submitBtn.addEventListener('click', function () { gradePractice(container); });
  }
}

/** 渲染单题作答区 / 结果区 */
function renderPracticeQuestion(q, i, session, submitted) {
  const a = session.answers[q.id] || '';
  const type = q.type;
  let body = '';

  if (type === '选择') {
    const opts = (q.options || []).map(opt => {
      const key = opt.charAt(0);
      const cls = ['option-item'];
      if (!submitted && a === key) cls.push('selected');
      if (submitted) {
        if (normalize(key) === normalize(q.answer)) cls.push('correct');
        else if (a === key) cls.push('wrong');
      }
      return '<div class="' + cls.join(' ') + '"' + (submitted ? '' : ' data-action="pickOption" data-id="' + esc(q.id) + '" data-val="' + key + '"') + '>' +
        '<span class="opt-key">' + key + '.</span><span>' + esc(opt.slice(2)) + '</span></div>';
    }).join('');
    body = '<div class="options-list">' + opts + '</div>';
  } else {
    body = submitted
      ? '<div class="small"><span class="bold">我的答案：</span>' + (a ? esc(a) : '<span class="muted">未作答</span>') + '</div>'
      : '<textarea class="input" data-answer="' + esc(q.id) + '" placeholder="请输入你的答案…">' + esc(a) + '</textarea>';
  }

  let resultHtml = '';
  if (submitted) {
    const ok = session.correctMap && session.correctMap[q.id];
    resultHtml =
      '<div class="answer-box"><span class="bold">参考答案：</span>' + esc(q.answer) + '</div>' +
      '<div class="small muted" style="margin-top:6px"><span class="bold">分步解析：</span></div>' +
      '<ol class="analysis-steps">' + (q.analysis || []).map(s => '<li>' + esc(s) + '</li>').join('') + '</ol>' +
      '<div class="pitfall-box">💡 易错提醒：' + esc(q.pitfall || '无') + '</div>' +
      '<div class="no-print" style="margin-top:8px"><button class="btn btn-sm" data-action="openVariant" data-id="' + esc(q.id) + '">🔁 变式重练</button></div>' +
      '<div data-variant-wrap="' + esc(q.id) + '"></div>';
  }

  return '<div class="question-card">' +
    '<div class="question-head">' +
      '<span class="tag tag-blue">第 ' + (i + 1) + ' 题</span>' +
      '<span class="tag">' + esc(type) + '</span>' +
      '<span class="tag tag-star">' + '★'.repeat(q.difficulty || 1) + '</span>' +
      (q.isOlympiad ? '<span class="tag tag-purple">竞赛</span>' : '') +
      (q.isHot ? '<span class="tag tag-red">高频</span>' : '') +
      (submitted ? (ok ? '<span class="tag tag-green">✓ 对</span>' : '<span class="tag tag-red">✗ 错</span>') : '') +
    '</div>' +
    '<div class="question-stem">' + esc(q.stem) + '</div>' +
    body + resultHtml +
  '</div>';
}

/** 交卷判分 */
function gradePractice(container) {
  const session = AppState.practiceSession;
  if (!session) return;
  const qs = session.questions;
  let correctCount = 0;
  const correctMap = {};
  qs.forEach(q => {
    const a = session.answers[q.id] || '';
    const ok = judgeAnswer(q, a);
    correctMap[q.id] = ok;
    if (ok) correctCount++;
  });
  session.submitted = true;
  session.correctCount = correctCount;
  session.correctMap = correctMap;

  // 写入刷题历史
  const kpIds = Array.from(new Set(qs.map(q => q.kpId)));
  AppState.history.unshift({
    id: 'ph_' + Date.now(),
    date: todayStr(),
    subject: session.params.subject,
    mode: 'practice',
    kpIds: kpIds,
    questionCount: qs.length,
    correctCount: correctCount,
    durationMin: 0
  });
  if (AppState.history.length > 100) AppState.history.length = 100;
  Store.saveHistory();
  renderPractice(container);
}

/** 单题判分：客观题严格比对；主观题要点词命中提示 */
function judgeAnswer(q, a) {
  if (!a) return false;
  const std = normalize(q.answer);
  if (q.type === '选择' || q.type === '填空') {
    return normalize(a) === std;
  }
  // 主观题：要点词命中 ≥1 视为"要点命中"（结果注明自评）
  const phrases = String(q.answer).split(/[；;。\n]/).map(s => s.trim()).filter(s => s.length >= 2);
  const na = normalize(a);
  for (const p of phrases) {
    if (na.indexOf(normalize(p)) !== -1) return true;
  }
  return false;
}

/** 渲染刷题历史 */
function renderHistoryList() {
  const s = AppState.subject;
  const list = AppState.history.filter(h => h.subject === s).slice(0, 10);
  if (list.length === 0) return '<div class="empty">暂无刷题记录，开始刷一组吧</div>';
  return '<div class="table-wrap"><table class="data-table"><thead><tr><th>日期</th><th>题量</th><th>答对</th><th>正确率</th></tr></thead><tbody>' +
    list.map(h => {
      const rate = h.questionCount ? Math.round(h.correctCount / h.questionCount * 100) : 0;
      return '<tr><td>' + esc(h.date) + '</td><td>' + h.questionCount + '</td><td>' + h.correctCount + '</td>' +
        '<td><div style="display:flex;align-items:center;gap:8px"><div class="progress" style="width:80px"><div class="progress-bar ' + (rate >= 60 ? 'success' : '') + '" style="width:' + rate + '%"></div></div><span class="bold">' + rate + '%</span></div></td></tr>';
    }).join('') + '</tbody></table></div>';
}

/* ==================== M4 错题回顾 ==================== */
function renderMistakes(container) {
  const s = AppState.subject;
  const kps = DataCenter.getKnowledgePoints(s);
  const mistakes = AppState.mistakes.filter(m => m.subject === s);
  const kpOptions = kps.map(k => '<option value="' + esc(k.id) + '">' + esc(k.name) + '</option>').join('');
  const errOptions = ['概念不清', '公式记错', '计算失误', '审题偏差', '方法不会', '粗心']
    .map(t => '<option value="' + t + '">' + t + '</option>').join('');

  container.innerHTML =
    '<div class="page-head"><h2>📕 错题回顾 <span class="muted small">' + SUBJECT_NAMES[s] + '</span></h2></div>' +
    '<div class="grid grid-3">' +
      '<div class="card" style="grid-column: span 1;">' +
        '<h3 class="card-title">📝 录入错题</h3>' +
        '<div class="form-row"><label>题干 / 原题 <span class="hint">支持文字</span></label><textarea class="input" id="mkQuestion" placeholder="粘贴或输入错题题干…"></textarea></div>' +
        '<div class="form-row"><label>我的错误答案</label><textarea class="input" id="mkMyAnswer" placeholder="你当时是怎么答的…"></textarea></div>' +
        '<div class="form-row"><label>正确答案（可留空）</label><textarea class="input" id="mkCorrect" placeholder="正确答案 / 解题要点…"></textarea></div>' +
        '<div class="form-row"><label>关联考点</label><select class="select" id="mkKp">' + kpOptions + '</select></div>' +
        '<div class="form-row"><label>错因（可自动诊断后修改）</label><select class="select" id="mkErrType">' + errOptions + '</select></div>' +
        '<button class="btn btn-primary btn-block" id="btnSubmitMistake">提交并诊断</button>' +
      '</div>' +
      '<div style="grid-column: span 2;">' +
        '<div id="mkDiagnosisWrap"></div>' +
        '<div class="card"><h3 class="card-title">📚 错题本 <span class="card-sub">' + mistakes.length + ' 条</span></h3>' +
          (mistakes.length === 0 ? '<div class="empty">还没有错题，录入第一条吧</div>' : renderMistakeList(mistakes)) +
        '</div>' +
      '</div>' +
    '</div>';

  const btn = container.querySelector('#btnSubmitMistake');
  btn.addEventListener('click', function () { submitMistake(container); });
}

function submitMistake(container) {
  const question = container.querySelector('#mkQuestion').value.trim();
  if (!question) { alert('请先填写题干'); return; }
  const myAnswer = container.querySelector('#mkMyAnswer').value.trim();
  const correctAnswer = container.querySelector('#mkCorrect').value.trim();
  const kpId = container.querySelector('#mkKp').value;
  const manualType = container.querySelector('#mkErrType').value;

  const m = { subject: AppState.subject, question: question, myAnswer: myAnswer, correctAnswer: correctAnswer, kpId: kpId };
  const diag = MistakeEngine.diagnose(m);
  const kp = DataCenter.getKp(m.subject, m.kpId);

  const record = {
    id: 'mk_' + Date.now(),
    subject: m.subject,
    question: question,
    myAnswer: myAnswer,
    correctAnswer: correctAnswer,
    kpId: kpId,
    kpName: kp ? kp.name : '未知考点',
    errorType: manualType || diag.errorType,
    diagnosis: '主要错因：' + (manualType || diag.errorType) + '（诊断建议：' + diag.tip + '）',
    solution: diag.solution,
    tip: diag.tip,
    variantId: null,
    variantDone: false,
    isHot: diag.isHot,
    isOlympiad: m.subject === 'olympiad',
    createdAt: todayStr(),
    mastered: false
  };
  AppState.mistakes.unshift(record);
  Store.saveMistakes();

  // 渲染诊断卡
  const wrap = container.querySelector('#mkDiagnosisWrap');
  const v = diag.variant;
  wrap.innerHTML =
    '<div class="card">' +
      '<h3 class="card-title">🔬 错因诊断 <span class="card-sub">' + (record.isHot ? '🔥 广州高频考点' : '') + '</span></h3>' +
      '<div class="diag-card diag-1"><div class="diag-title">📌 错因诊断</div><div>主要错因：<span class="tag tag-red">' + esc(record.errorType) + '</span></div>' +
        '<div class="small muted" style="margin-top:6px">' + esc(record.diagnosis) + '</div></div>' +
      '<div class="diag-card diag-2"><div class="diag-title">🔧 正确解法</div><div class="small">' + esc(record.solution) + '</div></div>' +
      '<div class="diag-card diag-3"><div class="diag-title">🔁 变式巩固</div>' +
        (v ? '<div class="question-stem small">' + esc(v.stem) + '</div>' +
          '<textarea class="input" id="mkVariantAnswer" placeholder="作答变式题…"></textarea>' +
          '<div style="margin-top:6px"><button class="btn btn-sm btn-primary" id="btnSubmitVariant">提交变式</button></div>' +
          '<div id="mkVariantResult"></div>'
          : '<span class="muted">暂无合适变式</span>') +
      '</div>' +
      '<div class="diag-card diag-4"><div class="diag-title">💡 避坑口诀</div><div>' + esc(record.tip) + '</div></div>' +
    '</div>';
  wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  const vb = wrap.querySelector('#btnSubmitVariant');
  if (vb) {
    vb.addEventListener('click', function () {
      const ans = wrap.querySelector('#mkVariantAnswer').value.trim();
      const result = wrap.querySelector('#mkVariantResult');
      if (!v) return;
      const ok = judgeAnswer({ type: '填空', answer: v.answer }, ans) || (v.answer && normalize(ans).indexOf(normalize(v.answer)) !== -1);
      record.variantDone = true;
      Store.saveMistakes();
      result.innerHTML = ok
        ? '<div class="alert alert-success" style="margin-top:6px">✅ 变式做对了！已记录"变式巩固完成"。</div>'
        : '<div class="alert alert-warn" style="margin-top:6px">❌ 参考答案：' + esc(v.answer) + '。<br>解析：' + esc((v.analysis || []).join('；')) + '</div>';
    });
  }

  // 清空表单
  container.querySelector('#mkQuestion').value = '';
  container.querySelector('#mkMyAnswer').value = '';
  container.querySelector('#mkCorrect').value = '';
  renderMistakeListRefresh(container);
}

function renderMistakeList(mistakes) {
  return '<div class="table-wrap"><table class="data-table"><thead><tr><th>日期</th><th>题干</th><th>考点</th><th>错因</th><th>状态</th><th>操作</th></tr></thead><tbody>' +
    mistakes.map(m =>
      '<tr>' +
        '<td class="small">' + esc(m.createdAt) + '</td>' +
        '<td style="max-width:260px">' + esc(m.question.length > 30 ? m.question.slice(0, 30) + '…' : m.question) + '</td>' +
        '<td class="small">' + esc(m.kpName) + '</td>' +
        '<td><span class="tag tag-orange">' + esc(m.errorType) + '</span>' + (m.isHot ? '<span class="tag tag-red">高频</span>' : '') + '</td>' +
        '<td>' + (m.mastered ? '<span class="tag tag-green">已掌握</span>' : (m.variantDone ? '<span class="tag tag-blue">变式已做</span>' : '<span class="tag">待巩固</span>')) + '</td>' +
        '<td class="no-print" style="white-space:nowrap">' +
          '<button class="btn btn-sm" data-action="viewMistake" data-id="' + esc(m.id) + '">查看</button> ' +
          '<button class="btn btn-sm" data-action="toggleMastered" data-id="' + esc(m.id) + '">' + (m.mastered ? '取消掌握' : '标记掌握') + '</button> ' +
          '<button class="btn btn-sm btn-danger" data-action="deleteMistake" data-id="' + esc(m.id) + '">删除</button>' +
        '</td>' +
      '</tr>'
    ).join('') + '</tbody></table></div>';
}

function renderMistakeListRefresh(container) {
  const s = AppState.subject;
  const mistakes = AppState.mistakes.filter(m => m.subject === s);
  const card = container.querySelector('.card h3.card-title');
  if (card) {
    const wrap = card.closest('.card');
    const t = wrap.querySelector('.table-wrap');
    if (t) t.outerHTML = mistakes.length === 0 ? '<div class="empty">还没有错题</div>' : renderMistakeList(mistakes);
    card.innerHTML = '📚 错题本 <span class="card-sub">' + mistakes.length + ' 条</span>';
  }
}

function viewMistakeDetail(container, id) {
  const m = AppState.mistakes.find(x => x.id === id);
  if (!m) return;
  const v = MistakeEngine.findVariant(m.subject, m.kpId, DataCenter.getKp(m.subject, m.kpId));
  const wrap = container.querySelector('#mkDiagnosisWrap');
  wrap.innerHTML =
    '<div class="card">' +
      '<h3 class="card-title">🔬 ' + esc(m.kpName) + ' <span class="card-sub">' + (m.isHot ? '🔥 广州高频' : '') + '</span></h3>' +
      '<div class="diag-card diag-1"><div class="diag-title">📌 错因诊断</div><div>错因：<span class="tag tag-red">' + esc(m.errorType) + '</span></div><div class="small muted" style="margin-top:6px">' + esc(m.diagnosis) + '</div></div>' +
      '<div class="diag-card diag-2"><div class="diag-title">🔧 正确解法</div><div class="small">' + esc(m.solution) + '</div></div>' +
      '<div class="diag-card diag-3"><div class="diag-title">🔁 变式巩固' + (m.variantDone ? ' <span class="tag tag-green">已完成</span>' : '') + '</div>' +
        (v ? '<div class="question-stem small">' + esc(v.stem) + '</div>' +
          '<textarea class="input" id="mkVariantAnswer" placeholder="作答变式题…"></textarea>' +
          '<div style="margin-top:6px"><button class="btn btn-sm btn-primary" id="btnSubmitVariant">提交变式</button></div>' +
          '<div id="mkVariantResult"></div>' : '<span class="muted">暂无合适变式</span>') +
      '</div>' +
      '<div class="diag-card diag-4"><div class="diag-title">💡 避坑口诀</div><div>' + esc(m.tip) + '</div></div>' +
    '</div>';
  wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  const vb = wrap.querySelector('#btnSubmitVariant');
  if (vb) {
    vb.addEventListener('click', function () {
      const ans = wrap.querySelector('#mkVariantAnswer').value.trim();
      const result = wrap.querySelector('#mkVariantResult');
      const ok = v && (normalize(ans).indexOf(normalize(v.answer)) !== -1 || judgeAnswer({ type: '填空', answer: v.answer }, ans));
      m.variantDone = true;
      Store.saveMistakes();
      result.innerHTML = ok
        ? '<div class="alert alert-success" style="margin-top:6px">✅ 变式做对了！</div>'
        : '<div class="alert alert-warn" style="margin-top:6px">❌ 参考答案：' + esc(v ? v.answer : '') + '。<br>解析：' + esc(v ? (v.analysis || []).join('；') : '') + '</div>';
      renderMistakeListRefresh(container);
    });
  }
}

/* ==================== M8 背诵打卡 ==================== */
function renderRecite(container) {
  const s = AppState.subject;
  if (!AppState.checkins) {
    AppState.checkins = { startDate: todayStr(), cycleDays: AppState.prefs.lastReciteCycle || 21, records: {} };
    Store.saveCheckins();
  }
  const today = todayStr();
  const task = EbbinghausScheduler.getTodayTask(s, today);
  const newItems = DataCenter.getReciteItems(s).filter(it => task.newIds.indexOf(it.id) !== -1);
  const reviewItems = DataCenter.getReciteItems(s).filter(it => task.reviewIds.indexOf(it.id) !== -1);
  const done = !!(AppState.checkins.records[today] && AppState.checkins.records[today].done);

  container.innerHTML =
    '<div class="page-head"><h2>🗓️ 背诵打卡 <span class="muted small">' + SUBJECT_NAMES[s] + ' · 艾宾浩斯 1/2/4/7/15</span></h2></div>' +
    '<div class="grid grid-3">' +
      '<div style="grid-column: span 2;">' +
        '<div class="card">' +
          '<h3 class="card-title">📌 今日任务 <span class="card-sub">' + today + ' ' + getDayCN(today) + (done ? ' · ✅ 已打卡' : '') + '</span></h3>' +
          renderReciteTasks(newItems, reviewItems, task.selfTest, today, done) +
        '</div>' +
      '</div>' +
      '<div>' +
        '<div class="card"><h3 class="card-title">📅 打卡日历</h3>' + renderCheckinCalendar() + '</div>' +
        '<div class="card"><h3 class="card-title">📊 周总结</h3>' + renderWeeklySummary(s) + '</div>' +
        '<div class="card no-print"><h3 class="card-title">⚙️ 设置</h3>' +
          '<div class="form-row"><label>打卡周期（天）</label><input class="input" type="number" id="reciteCycle" min="7" max="60" value="' + (AppState.checkins.cycleDays || 21) + '"></div>' +
          '<button class="btn btn-sm" id="btnSaveCycle">保存周期</button> ' +
          '<button class="btn btn-sm" id="btnBackfill">补卡（选日期）</button>' +
          '<div id="backfillWrap"></div>' +
        '</div>' +
      '</div>' +
    '</div>';

  // 自测题作答绑定（input 时记录）
  const selfTest = task.selfTest;
  selfTest.forEach(q => {
    const el = container.querySelector('[data-selftest="' + q.id + '"]');
    if (el) {
      el.addEventListener('click', function () {
        const key = this.getAttribute('data-val');
        container.querySelectorAll('[data-selftest="' + q.id + '"]').forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
        this.setAttribute('data-picked', key);
      });
    }
  });

  if (!done) {
    const btn = container.querySelector('#btnCheckin');
    if (btn) {
      btn.addEventListener('click', function () { doCheckin(s, today, task); });
    }
  }

  const cycleBtn = container.querySelector('#btnSaveCycle');
  if (cycleBtn) {
    cycleBtn.addEventListener('click', function () {
      const days = parseInt(container.querySelector('#reciteCycle').value, 10) || 21;
      AppState.checkins.cycleDays = Math.min(60, Math.max(7, days));
      AppState.prefs.lastReciteCycle = AppState.checkins.cycleDays;
      Store.saveCheckins();
      Store.savePrefs();
      renderRecite(container);
    });
  }

  const backBtn = container.querySelector('#btnBackfill');
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      const wrap = container.querySelector('#backfillWrap');
      wrap.innerHTML = '<div style="margin-top:8px;display:flex;gap:6px"><input class="input" type="date" id="backfillDate" value="' + today + '">' +
        '<button class="btn btn-sm btn-primary" id="btnDoBackfill">补卡</button></div>';
      const doBtn = wrap.querySelector('#btnDoBackfill');
      doBtn.addEventListener('click', function () {
        const date = wrap.querySelector('#backfillDate').value;
        if (!date) return;
        const rec = AppState.checkins.records[date];
        if (rec && rec.done) { alert('该日期已打卡'); return; }
        const t = EbbinghausScheduler.getTodayTask(s, date);
        AppState.checkins.records[date] = { newIds: t.newIds, reviewIds: t.reviewIds, selfTest: { score: 0, total: t.selfTest.length, wrongIds: [] }, done: true, forgotten: [] };
        Store.saveCheckins();
        renderRecite(container);
      });
    });
  }
}

function renderReciteTasks(newItems, reviewItems, selfTest, today, done) {
  const fmtItem = it =>
    '<div class="diag-card diag-2" style="margin-bottom:8px"><div class="bold" style="font-size:14px">' + esc(it.content) + '</div>' +
    (it.note ? '<div class="small muted">💭 ' + esc(it.note) + '</div>' : '') +
    '<div style="margin-top:4px"><span class="tag tag-blue">' + esc(it.type) + '</span><span class="tag tag-star">重要度 ' + '★'.repeat(it.importance) + '</span>' + (it.isOlympiad ? '<span class="tag tag-purple">竞赛用</span>' : '') + '</div></div>';

  let html = '';
  if (newItems.length === 0 && reviewItems.length === 0) {
    html += '<div class="alert alert-success">🎉 今日没有新背与复习任务（可能已全部排完）。</div>';
  } else {
    if (newItems.length) html += '<div class="bold" style="margin:8px 0 6px">🆕 今日新背（' + newItems.length + ' 条）</div>' + newItems.map(fmtItem).join('');
    if (reviewItems.length) {
      html += '<div class="bold" style="margin:10px 0 6px">🔁 今日复习（' + reviewItems.length + ' 条）</div>';
      html += reviewItems.map(it => {
        const ld = EbbinghausScheduler.planRecite(it.subject, AppState.checkins.startDate, AppState.checkins.cycleDays).learnDay[it.id];
        const gap = dayDiff(AppState.checkins.startDate, today) - ld;
        return '<div class="diag-card diag-4" style="margin-bottom:8px"><div class="small"><span class="tag tag-orange">第 ' + gap + ' 天复习</span> ' + esc(it.content) + '</div>' +
          '<label class="small muted" style="display:flex;align-items:center;gap:4px;margin-top:4px"><input type="checkbox" data-forgot="' + esc(it.id) + '"> 这条我忘了</label></div>';
      }).join('');
    }
  }

  if (selfTest.length) {
    html += '<div class="bold" style="margin:10px 0 6px">🧠 记忆自测（' + selfTest.length + ' 题）</div>';
    html += selfTest.map(q => {
      const opts = q.type === '选择'
        ? '<div class="options-list">' + (q.options || []).map(opt => {
            const key = opt.charAt(0);
            return '<div class="option-item" data-selftest="' + esc(q.id) + '" data-val="' + key + '"><span class="opt-key">' + key + '.</span><span>' + esc(opt.slice(2)) + '</span></div>';
          }).join('') + '</div>'
        : '<input class="input" data-selftest-input="' + esc(q.id) + '" placeholder="作答…" style="margin-bottom:6px">';
      return '<div class="question-card" style="margin-bottom:8px"><div class="small"><span class="tag tag-blue">自测</span> ' + esc(q.stem) + '</div>' + opts + '</div>';
    }).join('');
  }

  html += '<div class="no-print" style="margin-top:10px">' +
    (done ? '<button class="btn btn-success" disabled>✅ 今日已打卡</button>'
          : '<button class="btn btn-success" id="btnCheckin">✅ 完成今日打卡</button>') +
    '</div>';
  return html;
}

function doCheckin(s, today, task) {
  const wrongIds = [];
  const selfTest = task.selfTest;
  let score = 0;
  selfTest.forEach(q => {
    const picked = document.querySelector('[data-selftest="' + q.id + '"][data-picked]');
    const inputVal = document.querySelector('[data-selftest-input="' + q.id + '"]');
    let ans = picked ? picked.getAttribute('data-picked') : (inputVal ? inputVal.value : '');
    if (judgeAnswer(q, ans)) score++;
    else wrongIds.push(q.id);
  });
  // 遗忘勾选
  const forgotten = [];
  document.querySelectorAll('[data-forgot]:checked').forEach(el => forgotten.push(el.getAttribute('data-forgot')));

  AppState.checkins.records[today] = {
    newIds: task.newIds,
    reviewIds: task.reviewIds,
    selfTest: { score: score, total: selfTest.length, wrongIds: wrongIds },
    done: true,
    forgotten: forgotten
  };
  Store.saveCheckins();
  renderRecite(document.getElementById('app'));
  alert('✅ 打卡成功！今日自测 ' + score + '/' + selfTest.length + (forgotten.length ? '，标记遗忘 ' + forgotten.length + ' 条。' : ''));
}

function renderCheckinCalendar() {
  const checkins = AppState.checkins;
  if (!checkins) return '<div class="empty">无打卡数据</div>';
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = todayStr();
  const heads = ['日', '一', '二', '三', '四', '五', '六'].map(h => '<div class="cal-head">' + h + '</div>').join('');
  let cells = '';
  for (let i = 0; i < firstDay; i++) cells += '<div class="cal-cell empty-cell"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    const rec = checkins.records[ds];
    const isDone = rec && rec.done;
    const isToday = ds === today;
    const isFuture = ds > today;
    cells += '<div class="cal-cell' + (isDone ? ' done' : '') + (isToday ? ' today' : '') + (isFuture ? ' future' : '') + '">' +
      '<div class="small">' + d + '</div>' + (isDone ? '<div class="cal-dot"></div>' : '') + '</div>';
  }
  // 连续天数
  let streak = 0;
  let cursor = new Date(today + 'T00:00:00');
  while (checkins.records[fmtDate(cursor)] && checkins.records[fmtDate(cursor)].done) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
    if (streak > 365) break;
  }
  return '<div class="calendar">' + heads + cells + '</div>' +
    '<div class="small muted" style="margin-top:8px">当前连续打卡：<span class="bold" style="color:var(--c-success)">' + streak + ' 天</span></div>';
}

function renderWeeklySummary(s) {
  const checkins = AppState.checkins;
  if (!checkins) return '<div class="empty">暂无数据</div>';
  const today = todayStr();
  const items = DataCenter.getReciteItems(s);
  let newCount = 0, reviewCount = 0, testTotal = 0, testScore = 0;
  const forgetCount = {};
  for (let i = 0; i < 7; i++) {
    const ds = addDays(today, -i);
    const rec = checkins.records[ds];
    if (!rec || !rec.done) continue;
    newCount += (rec.newIds || []).length;
    reviewCount += (rec.reviewIds || []).length;
    if (rec.selfTest) { testTotal += rec.selfTest.total || 0; testScore += rec.selfTest.score || 0; }
    (rec.forgotten || []).forEach(id => { forgetCount[id] = (forgetCount[id] || 0) + 1; });
  }
  const acc = testTotal ? Math.round(testScore / testTotal * 100) : 0;
  const topForgotten = Object.keys(forgetCount).sort((a, b) => forgetCount[b] - forgetCount[a]).slice(0, 3)
    .map(id => {
      const it = items.find(x => x.id === id);
      return '<li>' + esc(it ? it.content : id) + '（忘 ' + forgetCount[id] + ' 次）</li>';
    }).join('');

  return '<div class="small">' +
    '<div style="margin-bottom:6px">新背 <span class="bold">' + newCount + '</span> 条 · 复习 <span class="bold">' + reviewCount + '</span> 条</div>' +
    '<div style="margin-bottom:6px">自测正确率 <span class="bold" style="color:var(--c-success)">' + acc + '%</span>（' + testScore + '/' + testTotal + '）</div>' +
    '<div class="bold" style="margin:8px 0 4px">常遗忘 Top' + (topForgotten ? 3 : 0) + '</div>' +
    (topForgotten ? '<ul style="margin:0;padding-left:18px">' + topForgotten + '</ul>' : '<span class="muted">近 7 天无遗忘记录</span>') +
    '</div>';
}

/* ==================== 注册视图与事件 ==================== */
Modules.register('knowledge', renderKnowledge);
Modules.register('practice', renderPractice);
Modules.register('mistakes', renderMistakes);
Modules.register('recite', renderRecite);

/* 学科名映射（供各模块使用） */
window.SUBJECT_NAMES = { math: '数学', physics: '物理', olympiad: '初中奥数' };

console.log('[Modules] modules-learn.js loaded (knowledge/practice/mistakes/recite)');
