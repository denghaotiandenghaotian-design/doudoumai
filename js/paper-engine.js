/* ============================================================
   paper-engine.js —— 引用式组卷引擎 + 全量校验器（方案 A）
   职责：
    1. resolvePaper / resolveAll：把卷定义的 questionIds[] 物化为 v1 同构 questions[]（body 自包含）
    2. validatePaper / validateAll：结构/分值/引用/复用/难度/覆盖全量校验
    3. difficultyStats / coverageStats：难度分布与板块覆盖统计
   约定：
    - 数据层纯逻辑：不碰 DOM、不碰 localStorage
    - 幂等：已物化（questions 非空）的卷跳过
    - 物化早于 DataCenter 读取（index.html 加载顺序保证：data-papers 之后、store 之前）
    - qId 生成规则：paper.id + '_q' + pad2(seq)
   ============================================================ */

window.PaperEngine = (function () {
  /** 主观题类型（跨卷复用硬约束） */
  var SUBJECTIVE = { '解答': true, '实验': true, '计算': true, '作图': true };

  /** 题型 → 解答/实验/计算/作图 中是否算主观题（用于复用校验） */

  function pad2(n) { return String(n).padStart(2, '0'); }

  /** 单卷物化：questionIds[] → questions[]（v1 同构） */
  function resolvePaper(paper) {
    if (!paper || !paper.questionIds || (paper.questions && paper.questions.length)) return paper;
    var bank = (window.DATA[paper.subject] || {}).questions || [];
    var missing = [];
    paper.questions = paper.questionIds.map(function (ref) {
      var q = null;
      for (var i = 0; i < bank.length; i++) {
        if (bank[i].id === ref.id) { q = bank[i]; break; }
      }
      if (!q) { missing.push(ref.id); return null; }
      return {
        qId: paper.id + '_q' + pad2(ref.seq),
        section: ref.section,
        seq: ref.seq,
        score: ref.score,
        body: Object.assign({}, q)
      };
    });
    if (missing.length) {
      throw new Error('[PaperEngine] 卷 ' + paper.id + ' 引用缺失：' + missing.join(', '));
    }
    return paper;
  }

  /** 全量物化（幂等） */
  function resolveAll() {
    var papers = ((window.DATA || {}).papers || {}).papers || [];
    papers.forEach(function (p) { resolvePaper(p); });
    return papers.length;
  }

  /** 单卷校验：返回 errors[] */
  function validatePaper(paper) {
    var errors = [];
    var bank = (window.DATA[paper.subject] || {}).questions || [];
    var kps = (window.DATA[paper.subject] || {}).knowledgePoints || [];
    var byId = {};
    bank.forEach(function (q) { byId[q.id] = q; });

    // 引用存在性
    (paper.questionIds || []).forEach(function (ref) {
      if (!byId[ref.id]) errors.push(paper.id + ': 引用缺失 ' + ref.id);
    });

    // 物化结果
    var qs = paper.questions || [];
    if (!qs.length) { errors.push(paper.id + ': questions 为空（未物化）'); return errors; }

    // seq / qId 唯一
    var seqSet = {}, qidSet = {};
    qs.forEach(function (q) {
      if (seqSet[q.seq]) errors.push(paper.id + ': seq 重复 ' + q.seq);
      seqSet[q.seq] = true;
      if (qidSet[q.qId]) errors.push(paper.id + ': qId 重复 ' + q.qId);
      qidSet[q.qId] = true;
    });

    // 同卷内题型不重复（同卷内同一题库题不重复）
    var idInPaper = {};
    (paper.questionIds || []).forEach(function (ref) {
      if (idInPaper[ref.id]) errors.push(paper.id + ': 同卷内重复引用 ' + ref.id);
      idInPaper[ref.id] = true;
    });

    // 分值：Σ score === totalScore
    var sum = qs.reduce(function (s, q) { return s + q.score; }, 0);
    if (sum !== paper.totalScore) errors.push(paper.id + ': 总分不符 Σ=' + sum + ' 期望=' + paper.totalScore);

    // 结构：各 section 数量与分值
    (paper.structure || []).forEach(function (sec) {
      var secQs = qs.filter(function (q) { return q.section === sec.section; });
      if (secQs.length !== sec.count) errors.push(paper.id + ': ' + sec.section + ' 题数 ' + secQs.length + '≠' + sec.count);
      var secSum = secQs.reduce(function (s, q) { return s + q.score; }, 0);
      if (secSum !== sec.score) errors.push(paper.id + ': ' + sec.section + ' 分值 ' + secSum + '≠' + sec.score);
    });

    // 解答题 perSeq 分数与 perScore 串匹配（数学 15/15/15/15/15/13/14 等）
    var solveSec = (paper.structure || []).find(function (s) { return s.section === '解答题'; });
    if (solveSec && typeof solveSec.perScore === 'string') {
      var expects = solveSec.perScore.split('/').map(Number);
      var solveQs = qs.filter(function (q) { return q.section === '解答题'; }).slice().sort(function (a, b) { return a.seq - b.seq; });
      if (solveQs.length === expects.length) {
        solveQs.forEach(function (q, i) {
          if (q.score !== expects[i]) errors.push(paper.id + ': 解答题 seq' + q.seq + ' 分值 ' + q.score + '≠' + expects[i]);
        });
      }
    }

    // coverage 存在性
    (paper.coverage || []).forEach(function (kpId) {
      var found = kps.some(function (k) { return k.id === kpId; });
      if (!found) errors.push(paper.id + ': coverage 不存在 ' + kpId);
    });

    // scoringGuide 覆盖全部主观题
    if (paper.scoringGuide) {
      qs.forEach(function (q) {
        if (SUBJECTIVE[q.body.type] && !paper.scoringGuide[q.qId]) {
          errors.push(paper.id + ': 主观题缺评分细则 ' + q.qId);
        }
      });
    }

    return errors;
  }

  /** 全量校验：返回 {ok, errors[], reports} */
  function validateAll() {
    var papers = ((window.DATA || {}).papers || {}).papers || [];
    var errors = [];
    var bySubject = {};
    papers.forEach(function (p) {
      (bySubject[p.subject] = bySubject[p.subject] || []).push(p);
    });

    // 每科卷数 ≥ 10
    Object.keys(bySubject).forEach(function (subj) {
      if (bySubject[subj].length < 10) errors.push('学科 ' + subj + ' 卷数 ' + bySubject[subj].length + ' < 10');
    });

    // 主观题跨卷复用（同科）：>2 次报错；同卷内重复已在上层校验
    var subjUse = {};
    papers.forEach(function (p) {
      (p.questions || []).forEach(function (q) {
        if (SUBJECTIVE[q.body.type]) {
          var key = p.subject + ':' + (p.questionIds ? findRefId(p, q) : q.body.id || q.qId);
          subjUse[key] = (subjUse[key] || 0) + 1;
        }
      });
    });
    Object.keys(subjUse).forEach(function (key) {
      if (subjUse[key] > 2) errors.push('主观题复用超限(>' + 2 + '次)：' + key + ' ×' + subjUse[key]);
    });

    // 每卷校验
    papers.forEach(function (p) {
      validatePaper(p).forEach(function (e) { errors.push(e); });
    });

    // 难度分布 + 覆盖统计 + 压轴下限
    var reports = {};
    Object.keys(bySubject).forEach(function (subj) {
      var stats = difficultyStats(subj);
      var cov = coverageStats(subj);
      reports[subj] = {
        total: stats.total, diff1: stats.diff1, diff2: stats.diff2, diff3: stats.diff3,
        pct1: stats.pct1, pct2: stats.pct2, pct3: stats.pct3,
        perPaperBoards: cov.perPaperBoards, boardCounts: cov.boardCounts,
        zySolve: stats.zySolve, calcZY: stats.calcZY
      };
      if (Math.abs(stats.pct1 - 60) > 3) errors.push(subj + ': 基础题占比 ' + stats.pct1 + '% 偏离 60%');
      if (Math.abs(stats.pct2 - 25) > 3) errors.push(subj + ': 中档题占比 ' + stats.pct2 + '% 偏离 25%');
      if (Math.abs(stats.pct3 - 15) > 3) errors.push(subj + ': 压轴题占比 ' + stats.pct3 + '% 偏离 15%');
      if (subj === 'math' && stats.zySolve < 20) errors.push('math: 压轴解答 ' + stats.zySolve + ' < 20');
      if (subj === 'physics' && stats.calcZY < 10) errors.push('physics: 计算压轴 ' + stats.calcZY + ' < 10');
      // 每卷板块覆盖：数学 ≥4/5、物理 ≥3/4
      cov.perPaperBoards.forEach(function (r) {
        var expect = (subj === 'math' ? 4 : 3);
        var total = (subj === 'math' ? 5 : 4);
        if (r.boards < expect) errors.push(r.paperId + ': 覆盖板块 ' + r.boards + '/' + total + ' 不足');
      });
    });

    return { ok: errors.length === 0, errors: errors, reports: reports };
  }

  /** 找引用卷中某题对应的题库 id */
  function findRefId(paper, q) {
    var refs = paper.questionIds || [];
    for (var i = 0; i < refs.length; i++) {
      if (refs[i].seq === q.seq) return refs[i].id;
    }
    return q.body.id || '';
  }

  /** 难度分布统计：{total, diff1, diff2, diff3, pct1, pct2, pct3, zySolve, calcZY} */
  function difficultyStats(subject) {
    var bank = (window.DATA[subject] || {}).questions || [];
    var d1 = 0, d2 = 0, d3 = 0, zySolve = 0, calcZY = 0;
    bank.forEach(function (q) {
      if (q.difficulty === 1) d1++;
      else if (q.difficulty === 2) d2++;
      else if (q.difficulty === 3) d3++;
      if (q.type === '解答' && q.difficulty === 3) zySolve++;
      if (q.type === '计算' && q.difficulty === 3) calcZY++;
    });
    var total = bank.length || 1;
    return {
      total: bank.length, diff1: d1, diff2: d2, diff3: d3,
      pct1: Math.round(d1 / total * 100), pct2: Math.round(d2 / total * 100), pct3: Math.round(d3 / total * 100),
      zySolve: zySolve, calcZY: calcZY
    };
  }

  /** 板块覆盖统计：{boardCounts, perPaperBoards} */
  function coverageStats(subject) {
    var papers = ((window.DATA.papers || {}).papers || []).filter(function (p) { return p.subject === subject; });
    var kps = (window.DATA[subject] || {}).knowledgePoints || [];
    var kpBoard = {};
    kps.forEach(function (k) { kpBoard[k.id] = k.board; });

    var boardCounts = {};
    papers.forEach(function (p) {
      var boards = {};
      (p.coverage || []).forEach(function (kpId) {
        var b = kpBoard[kpId] || '未知';
        boards[b] = true;
        boardCounts[b] = (boardCounts[b] || 0) + 1;
      });
    });
    var perPaperBoards = papers.map(function (p) {
      var boards = {};
      (p.coverage || []).forEach(function (kpId) {
        var b = kpBoard[kpId] || '未知';
        boards[b] = true;
      });
      return { paperId: p.id, boards: Object.keys(boards).length, boardList: Object.keys(boards).join('/') };
    });
    return { boardCounts: boardCounts, perPaperBoards: perPaperBoards };
  }

  /** 输出校验报告（console.table + OK/FAIL） */
  function printReport(result) {
    var papers = ((window.DATA || {}).papers || {}).papers || [];
    var rows = papers.map(function (p) {
      var qs = p.questions || [];
      var subj = result.reports[p.subject] || {};
      return {
        卷: p.id, 科: p.subject, 题数: qs.length, 分值: p.totalScore,
        预测: p.isPrediction ? '是' : '否', 侧重: p.emphasis || '-',
        覆盖板块: (function () {
          var r = (subj.perPaperBoards || []).find(function (x) { return x.paperId === p.id; });
          return r ? r.boardList : '-';
        })()
      };
    });
    try { console.table(rows); } catch (e) { /* 旧浏览器忽略 */ }
    console.log('[PaperEngine] validate: ' + (result.ok ? 'OK' : 'FAIL') + (result.errors.length ? '\n  errors: ' + result.errors.join('\n  ') : ''));
    Object.keys(result.reports || {}).forEach(function (subj) {
      var r = result.reports[subj];
      console.log('[PaperEngine] ' + subj + ': 题库 ' + r.total + ' 题（基础' + r.pct1 + '%/中档' + r.pct2 + '%/压轴' + r.pct3 + '%），压轴解答=' + r.zySolve + '，计算压轴=' + r.calcZY + '，每卷覆盖板块=' + r.perPaperBoards.map(function (x) { return x.paperId + ':' + x.boards; }).join(' '));
    });
  }

  /* ---------- IIFE 末尾执行：物化 + 校验（题库已就绪、早于 DataCenter） ---------- */
  var initialized = false;
  function ensureInitialized() {
    if (initialized) return;
    initialized = true;
    try {
      var n = resolveAll();
      var result = validateAll();
      console.log('[PaperEngine] resolved ' + n + ' papers, ' + (window.DATA.papers ? window.DATA.papers.papers.length : 0) + ' total');
      printReport(result);
    } catch (e) {
      console.error('[PaperEngine] 初始化异常', e);
    }
  }

  return {
    resolveAll: resolveAll,
    resolvePaper: resolvePaper,
    validateAll: validateAll,
    validatePaper: validatePaper,
    difficultyStats: difficultyStats,
    coverageStats: coverageStats,
    ensureInitialized: ensureInitialized
  };
})();

/* 数据文件均已就绪后立即物化（index.html 中位于 data-*.js 之后、store.js 之前） */
PaperEngine.ensureInitialized();

console.log('[PaperEngine] paper-engine.js loaded');
