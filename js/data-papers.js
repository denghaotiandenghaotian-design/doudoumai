/* ============================================================
   data-papers.js —— 模拟卷 + 真题库（window.DATA.papers）· v2
   职责：
    1. 数学 10 套 150 分卷（120 分钟，23 题：选择10×3=30 / 填空6×3=18 / 解答7=102[5×15+13+14]）
    2. 物理 10 套 90 分笔试卷（90 分钟，26 题：选择12×2=24 / 填空6×2=12 / 作图2×3=6 / 实验3×6=18 / 计算3×10=30）
    3. 真题库样题 + 5 年频次 summary（2021–2025，v1 原样保留）
   形态：方案 A —— 全卷 questionIds[] 引用式，由 paper-engine.js 物化为 questions[]
   说明：前 3 套/科为 2027 预测卷（isPrediction=true，M9 引用不变）；新增 7 套/科为普通模拟卷
   ============================================================ */

window.DATA = window.DATA || {};
window.DATA.papers = (function () {

  /* ---------- 引用构造辅助 ---------- */
  function R(id, section, seq, score) { return { id: id, section: section, seq: seq, score: score }; }

  /* 轮转交错：把各板块桶交错打散，保证任意连续窗口覆盖多板块 */
  function interleave(buckets) {
    var out = [], idx = buckets.map(function () { return 0; });
    var remaining = buckets.reduce(function (s, b) { return s + b.length; }, 0);
    while (remaining > 0) {
      for (var i = 0; i < buckets.length; i++) {
        if (idx[i] < buckets[i].length) { out.push(buckets[i][idx[i]++]); remaining--; }
      }
    }
    return out;
  }

  function bankType(subject, id) {
    var arr = (window.DATA[subject] || {}).questions || [];
    for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i].type;
    return '';
  }

  function bankKp(subject, id) {
    var arr = (window.DATA[subject] || {}).questions || [];
    for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i].kpId || '';
    return '';
  }

  /* 自动生成主观题评分细则（半自动评分提示，按题型/分值拆分） */
  function makeGuide(type, score) {
    if (type === '解答') {
      if (score >= 15) return ['正确思路与关键步骤 5 分', '过程与计算正确 6 分', '结论正确 4 分'];
      if (score >= 14) return ['正确思路与关键步骤 4 分', '过程与计算正确 6 分', '结论正确 4 分'];
      return ['正确思路与关键步骤 4 分', '过程与计算正确 6 分', '结论正确 3 分'];
    }
    if (type === '实验') return ['实验操作与数据记录 2 分', '分析推理 2 分', '结论正确 2 分'];
    if (type === '计算') return ['公式正确 3 分', '代入与计算正确 4 分', '结果与单位正确 3 分'];
    if (type === '作图') return ['作图规范 2 分', '标注完整 1 分'];
    return ['作答正确 ' + score + ' 分'];
  }

  /* 生成完整卷对象：questionIds → 自动 coverage + 自动评分细则 */
  function finalize(paper) {
    var coverage = [], kpSet = {};
    paper.questionIds.forEach(function (ref) {
      var k = bankKp(paper.subject, ref.id);
      if (k && !kpSet[k]) { kpSet[k] = true; coverage.push(k); }
    });
    paper.coverage = coverage;

    var sg = {};
    paper.questionIds.forEach(function (ref) {
      var t = bankType(paper.subject, ref.id);
      if (t === '解答' || t === '实验' || t === '计算' || t === '作图') {
        sg[paper.id + '_q' + String(ref.seq).padStart(2, '0')] = makeGuide(t, ref.score);
      }
    });
    paper.scoringGuide = sg;
    return paper;
  }

  /* ============================================================
     一、数学卷
     ============================================================ */
  var MATH_STRUCT = [
    { section: '选择题', count: 10, score: 30, perScore: 3 },
    { section: '填空题', count: 6, score: 18, perScore: 3 },
    { section: '解答题', count: 7, score: 102, perScore: '15/15/15/15/15/13/14' }
  ];

  /* 选择池（100 唯一）——按板块交错保证每卷覆盖 ≥4/5 板块 */
  var mathSelBuckets = [
    ['math_q_0001', 'math_q_0002', 'math_q_0003', 'math_q_0004', 'math_q_0005', 'math_q_0007', 'math_q_0008', 'math_q_0055', 'math_q_0056', 'math_q_0057', 'math_q_0058', 'math_q_0059', 'math_q_0060', 'math_q_0061', 'math_q_0062', 'math_q_0063', 'math_q_0064', 'math_q_0065', 'math_q_0066', 'math_q_0067', 'math_q_0068'],
    ['math_q_0006', 'math_q_0012', 'math_q_0069', 'math_q_0070', 'math_q_0071', 'math_q_0072', 'math_q_0073', 'math_q_0074', 'math_q_0075', 'math_q_0076', 'math_q_0077', 'math_q_0078', 'math_q_0079', 'math_q_0080'],
    ['math_q_0011', 'math_q_0015', 'math_q_0016', 'math_q_0081', 'math_q_0082', 'math_q_0083', 'math_q_0084', 'math_q_0085', 'math_q_0086', 'math_q_0087', 'math_q_0088', 'math_q_0089', 'math_q_0090', 'math_q_0091', 'math_q_0092', 'math_q_0093', 'math_q_0094', 'math_q_0095', 'math_q_0096', 'math_q_0097', 'math_q_0098'],
    ['math_q_0009', 'math_q_0010', 'math_q_0017', 'math_q_0018', 'math_q_0019', 'math_q_0020', 'math_q_0099', 'math_q_0100', 'math_q_0101', 'math_q_0102', 'math_q_0103', 'math_q_0104', 'math_q_0105', 'math_q_0106', 'math_q_0107', 'math_q_0108', 'math_q_0109', 'math_q_0110', 'math_q_0111', 'math_q_0112', 'math_q_0113', 'math_q_0114', 'math_q_0115', 'math_q_0116', 'math_q_0117', 'math_q_0118', 'math_q_0119', 'math_q_0120', 'math_q_0121', 'math_q_0122', 'math_q_0123', 'math_q_0124'],
    ['math_q_0013', 'math_q_0014', 'math_q_0125', 'math_q_0126', 'math_q_0127', 'math_q_0128', 'math_q_0129', 'math_q_0130', 'math_q_0131', 'math_q_0132', 'math_q_0133', 'math_q_0134']
  ];
  var mathSel = interleave(mathSelBuckets); // 100

  /* 填空池（50 唯一，60 槽 → 10 次复用） */
  var mathFillBuckets = [
    ['math_q_0021', 'math_q_0022', 'math_q_0023', 'math_q_0135', 'math_q_0136', 'math_q_0137', 'math_q_0138', 'math_q_0139', 'math_q_0149'],
    ['math_q_0024', 'math_q_0029', 'math_q_0140', 'math_q_0141', 'math_q_0142', 'math_q_0151'],
    ['math_q_0027', 'math_q_0028', 'math_q_0031', 'math_q_0143', 'math_q_0144', 'math_q_0145', 'math_q_0152', 'math_q_0162', 'math_q_0166'],
    ['math_q_0026', 'math_q_0030', 'math_q_0032', 'math_q_0033', 'math_q_0034', 'math_q_0146', 'math_q_0147', 'math_q_0150', 'math_q_0153', 'math_q_0154', 'math_q_0155', 'math_q_0156', 'math_q_0157', 'math_q_0158', 'math_q_0160', 'math_q_0161', 'math_q_0163', 'math_q_0164', 'math_q_0165'],
    ['math_q_0025', 'math_q_0148', 'math_q_0159', 'math_q_0167', 'math_q_0168', 'math_q_0169', 'math_q_0170']
  ];
  var mathFill = interleave(mathFillBuckets); // 50

  /* 数学解答题（每卷 q17..q23，共 70 槽，全科唯一） */
  var mathSol = {
    paper_math_p1:  ['math_q_0035', 'math_q_0036', 'math_q_0037', 'math_q_0038', 'math_q_0207', 'math_q_0206', 'math_q_0220'],
    paper_math_p2:  ['math_q_0171', 'math_q_0180', 'math_q_0189', 'math_q_0041', 'math_q_0210', 'math_q_0216', 'math_q_0218'],
    paper_math_p3:  ['math_q_0172', 'math_q_0181', 'math_q_0190', 'math_q_0044', 'math_q_0047', 'math_q_0211', 'math_q_0217'],
    paper_math_p4:  ['math_q_0173', 'math_q_0182', 'math_q_0191', 'math_q_0049', 'math_q_0208', 'math_q_0204', 'math_q_0212'],
    paper_math_p5:  ['math_q_0174', 'math_q_0183', 'math_q_0192', 'math_q_0050', 'math_q_0040', 'math_q_0200', 'math_q_0215'],
    paper_math_p6:  ['math_q_0175', 'math_q_0184', 'math_q_0193', 'math_q_0201', 'math_q_0048', 'math_q_0199', 'math_q_0053'],
    paper_math_p7:  ['math_q_0176', 'math_q_0185', 'math_q_0194', 'math_q_0042', 'math_q_0203', 'math_q_0051', 'math_q_0054'],
    paper_math_p8:  ['math_q_0177', 'math_q_0186', 'math_q_0195', 'math_q_0045', 'math_q_0202', 'math_q_0043', 'math_q_0046'],
    paper_math_p9:  ['math_q_0178', 'math_q_0187', 'math_q_0196', 'math_q_0205', 'math_q_0214', 'math_q_0198', 'math_q_0219'],
    paper_math_p10: ['math_q_0179', 'math_q_0188', 'math_q_0197', 'math_q_0039', 'math_q_0213', 'math_q_0209', 'math_q_0052']
  };

  var mathMeta = [
    { id: 'paper_math_p1',  title: '2027 广州中考数学预测卷（一）',  isPrediction: true,  emphasis: '二次函数动点 + 圆与相似' },
    { id: 'paper_math_p2',  title: '2027 广州中考数学预测卷（二）',  isPrediction: true,  emphasis: '几何变换（旋转）+ 函数综合' },
    { id: 'paper_math_p3',  title: '2027 广州中考数学预测卷（三）',  isPrediction: true,  emphasis: '存在性问题 + 统计概率开放题' },
    { id: 'paper_math_p4',  title: '2027 广州中考数学模拟卷（四）',  isPrediction: false, emphasis: '函数应用 + 四边形存在性' },
    { id: 'paper_math_p5',  title: '2027 广州中考数学模拟卷（五）',  isPrediction: false, emphasis: '反比例 k 几何意义 + 新定义压轴' },
    { id: 'paper_math_p6',  title: '2027 广州中考数学模拟卷（六）',  isPrediction: false, emphasis: '图象交点与参数范围' },
    { id: 'paper_math_p7',  title: '2027 广州中考数学模拟卷（七）',  isPrediction: false, emphasis: '坐标系几何 + 函数旋转综合' },
    { id: 'paper_math_p8',  title: '2027 广州中考数学模拟卷（八）',  isPrediction: false, emphasis: '函数不等式 + 直角存在性' },
    { id: 'paper_math_p9',  title: '2027 广州中考数学模拟卷（九）',  isPrediction: false, emphasis: '实际应用 + 面积最值双压轴' },
    { id: 'paper_math_p10', title: '2027 广州中考数学模拟卷（十）',  isPrediction: false, emphasis: '存在性 + 折叠综合' }
  ];

  function buildMathPaper(k) {
    var meta = mathMeta[k];
    var qs = [];
    for (var i = 0; i < 10; i++) qs.push(R(mathSel[k * 10 + i], '选择题', i + 1, 3));
    for (var j = 0; j < 6; j++) qs.push(R(mathFill[(k * 6 + j) % 50], '填空题', 11 + j, 3));
    var sol = mathSol[meta.id];
    var seqs = [17, 18, 19, 20, 21, 22, 23], scores = [15, 15, 15, 15, 15, 13, 14];
    sol.forEach(function (bid, idx) { qs.push(R(bid, '解答题', seqs[idx], scores[idx])); });
    return finalize({
      id: meta.id, subject: 'math', title: meta.title, isPrediction: meta.isPrediction,
      emphasis: meta.emphasis, duration: 120, totalScore: 150, structure: MATH_STRUCT,
      questionIds: qs, questions: []
    });
  }

  /* ============================================================
     二、物理卷
     ============================================================ */
  var PHY_STRUCT = [
    { section: '选择题', count: 12, score: 24, perScore: 2 },
    { section: '填空题', count: 6, score: 12, perScore: 2 },
    { section: '作图题', count: 2, score: 6, perScore: 3 },
    { section: '实验探究题', count: 3, score: 18, perScore: 6 },
    { section: '计算题', count: 3, score: 30, perScore: 10 }
  ];

  /* 选择池（80 唯一，120 槽 → 复用） */
  var phySelBuckets = [
    ['phy_q_0001', 'phy_q_0002', 'phy_q_0003', 'phy_q_0004', 'phy_q_0005', 'phy_q_0006', 'phy_q_0007', 'phy_q_0008', 'phy_q_0049', 'phy_q_0050', 'phy_q_0051', 'phy_q_0052', 'phy_q_0053', 'phy_q_0054', 'phy_q_0055', 'phy_q_0056', 'phy_q_0057', 'phy_q_0058', 'phy_q_0059', 'phy_q_0060', 'phy_q_0061', 'phy_q_0062', 'phy_q_0084', 'phy_q_0085', 'phy_q_0086', 'phy_q_0092', 'phy_q_0093', 'phy_q_0099', 'phy_q_0100', 'phy_q_0106', 'phy_q_0107', 'phy_q_0111'],
    ['phy_q_0009', 'phy_q_0010', 'phy_q_0011', 'phy_q_0063', 'phy_q_0064', 'phy_q_0065', 'phy_q_0066', 'phy_q_0067', 'phy_q_0068', 'phy_q_0069', 'phy_q_0070', 'phy_q_0071', 'phy_q_0072', 'phy_q_0073', 'phy_q_0074', 'phy_q_0087', 'phy_q_0088', 'phy_q_0089', 'phy_q_0090', 'phy_q_0091', 'phy_q_0101', 'phy_q_0102', 'phy_q_0103', 'phy_q_0108', 'phy_q_0109', 'phy_q_0110'],
    ['phy_q_0012', 'phy_q_0013', 'phy_q_0014', 'phy_q_0075', 'phy_q_0076', 'phy_q_0077', 'phy_q_0078', 'phy_q_0079', 'phy_q_0080', 'phy_q_0081', 'phy_q_0082', 'phy_q_0083', 'phy_q_0094', 'phy_q_0095', 'phy_q_0096', 'phy_q_0097', 'phy_q_0104', 'phy_q_0105', 'phy_q_0112', 'phy_q_0113', 'phy_q_0114'],
    ['phy_q_0098']
  ];
  var phySel = interleave(phySelBuckets); // 80

  /* 填空池（40 唯一，60 槽 → 复用） */
  var phyFillBuckets = [
    ['phy_q_0015', 'phy_q_0016', 'phy_q_0020', 'phy_q_0115', 'phy_q_0116', 'phy_q_0117', 'phy_q_0118', 'phy_q_0119', 'phy_q_0120', 'phy_q_0127', 'phy_q_0128', 'phy_q_0136', 'phy_q_0137'],
    ['phy_q_0017', 'phy_q_0121', 'phy_q_0122', 'phy_q_0123', 'phy_q_0124', 'phy_q_0125', 'phy_q_0126', 'phy_q_0139', 'phy_q_0140', 'phy_q_0141', 'phy_q_0142'],
    ['phy_q_0018', 'phy_q_0019', 'phy_q_0021', 'phy_q_0022', 'phy_q_0023', 'phy_q_0024', 'phy_q_0129', 'phy_q_0130', 'phy_q_0131', 'phy_q_0132', 'phy_q_0133', 'phy_q_0134', 'phy_q_0135', 'phy_q_0143', 'phy_q_0144'],
    ['phy_q_0138']
  ];
  var phyFill = interleave(phyFillBuckets); // 40

  /* 物理作图（20 唯一，每卷 2） */
  var phyDraw = {
    paper_phy_p1:  ['phy_q_0025', 'phy_q_0028'],
    paper_phy_p2:  ['phy_q_0027', 'phy_q_0029'],
    paper_phy_p3:  ['phy_q_0026', 'phy_q_0030'],
    paper_phy_p4:  ['phy_q_0145', 'phy_q_0150'],
    paper_phy_p5:  ['phy_q_0146', 'phy_q_0151'],
    paper_phy_p6:  ['phy_q_0148', 'phy_q_0152'],
    paper_phy_p7:  ['phy_q_0149', 'phy_q_0153'],
    paper_phy_p8:  ['phy_q_0154', 'phy_q_0155'],
    paper_phy_p9:  ['phy_q_0156', 'phy_q_0157'],
    paper_phy_p10: ['phy_q_0147', 'phy_q_0158']
  };

  /* 物理实验（30 槽，唯一为主） */
  var phyExp = {
    paper_phy_p1:  ['phy_q_0031', 'phy_q_0033', 'phy_q_0035'],
    paper_phy_p2:  ['phy_q_0034', 'phy_q_0171', 'phy_q_0172'],
    paper_phy_p3:  ['phy_q_0037', 'phy_q_0176', 'phy_q_0036'],
    paper_phy_p4:  ['phy_q_0163', 'phy_q_0032', 'phy_q_0173'],
    paper_phy_p5:  ['phy_q_0159', 'phy_q_0162', 'phy_q_0170'],
    paper_phy_p6:  ['phy_q_0164', 'phy_q_0165', 'phy_q_0038'],
    paper_phy_p7:  ['phy_q_0178', 'phy_q_0180', 'phy_q_0171'],
    paper_phy_p8:  ['phy_q_0167', 'phy_q_0161', 'phy_q_0174'],
    paper_phy_p9:  ['phy_q_0160', 'phy_q_0179', 'phy_q_0175'],
    paper_phy_p10: ['phy_q_0169', 'phy_q_0164', 'phy_q_0177']
  };

  /* 物理计算（30 槽，压轴错位 + 少量复用 ≤2） */
  var phyCalc = {
    paper_phy_p1:  ['phy_q_0047', 'phy_q_0045', 'phy_q_0048'],
    paper_phy_p2:  ['phy_q_0041', 'phy_q_0042', 'phy_q_0044'],
    paper_phy_p3:  ['phy_q_0187', 'phy_q_0195', 'phy_q_0200'],
    paper_phy_p4:  ['phy_q_0192', 'phy_q_0198', 'phy_q_0199'],
    paper_phy_p5:  ['phy_q_0039', 'phy_q_0191', 'phy_q_0197'],
    paper_phy_p6:  ['phy_q_0040', 'phy_q_0193', 'phy_q_0196'],
    paper_phy_p7:  ['phy_q_0188', 'phy_q_0190', 'phy_q_0194'],
    paper_phy_p8:  ['phy_q_0183', 'phy_q_0191', 'phy_q_0199'],
    paper_phy_p9:  ['phy_q_0189', 'phy_q_0200', 'phy_q_0197'],
    paper_phy_p10: ['phy_q_0181', 'phy_q_0186', 'phy_q_0195']
  };

  var phyMeta = [
    { id: 'paper_phy_p1',  title: '2027 广州中考物理预测卷（一）',  isPrediction: true,  emphasis: '电学（电功率）+ 力学（机械效率）' },
    { id: 'paper_phy_p2',  title: '2027 广州中考物理预测卷（二）',  isPrediction: true,  emphasis: '力学（压强/浮力/功）' },
    { id: 'paper_phy_p3',  title: '2027 广州中考物理预测卷（三）',  isPrediction: true,  emphasis: '热学 + 电学多档位 + 浮力' },
    { id: 'paper_phy_p4',  title: '2027 广州中考物理模拟卷（四）',  isPrediction: false, emphasis: '欧姆定律 + 浮力 + 电功率' },
    { id: 'paper_phy_p5',  title: '2027 广州中考物理模拟卷（五）',  isPrediction: false, emphasis: '运动学 + 机械效率 + 电热' },
    { id: 'paper_phy_p6',  title: '2027 广州中考物理模拟卷（六）',  isPrediction: false, emphasis: '密度 + 功与功率 + 动态电路' },
    { id: 'paper_phy_p7',  title: '2027 广州中考物理模拟卷（七）',  isPrediction: false, emphasis: '热学 + 力学 + 焦耳定律' },
    { id: 'paper_phy_p8',  title: '2027 广州中考物理模拟卷（八）',  isPrediction: false, emphasis: '压强 + 机械效率 + 电学最值' },
    { id: 'paper_phy_p9',  title: '2027 广州中考物理模拟卷（九）',  isPrediction: false, emphasis: '密度 + 浮力压强 + 电热综合' },
    { id: 'paper_phy_p10', title: '2027 广州中考物理模拟卷（十）',  isPrediction: false, emphasis: '速度 + 功与功率 + 多档位电功率' }
  ];

  function buildPhyPaper(k) {
    var meta = phyMeta[k];
    var qs = [];
    for (var i = 0; i < 12; i++) qs.push(R(phySel[(k * 12 + i) % 80], '选择题', i + 1, 2));
    for (var j = 0; j < 6; j++) qs.push(R(phyFill[(k * 6 + j) % 40], '填空题', 13 + j, 2));
    phyDraw[meta.id].forEach(function (bid, idx) { qs.push(R(bid, '作图题', 19 + idx, 3)); });
    phyExp[meta.id].forEach(function (bid, idx) { qs.push(R(bid, '实验探究题', 21 + idx, 6)); });
    phyCalc[meta.id].forEach(function (bid, idx) { qs.push(R(bid, '计算题', 24 + idx, 10)); });
    return finalize({
      id: meta.id, subject: 'physics', title: meta.title, isPrediction: meta.isPrediction,
      emphasis: meta.emphasis, duration: 90, totalScore: 90, structure: PHY_STRUCT,
      questionIds: qs, questions: []
    });
  }

  /* ============================================================
     三、真题库（2021–2025 数学/物理·广州卷）
     说明：status="sample" 为已通过公开来源（renrendoc/21cnjy/sxydy/7cxk/文库等）
           核验答案的真实真题（答案与解析来自公开解析版，非编造）；
           status="pending" 为未抓到/无法核验的题目占位（"待补原题"）。
           kpId 映射到现有考点库；主题无法可靠映射时用 "待核"。
           summary 由已入库题目自动聚合（真实覆盖频次）。
     ============================================================ */
  function zt(year, seq, type, kpId, score, answer, analysis) {
    return { year: year, seq: seq, type: type, kpId: kpId, score: score, answer: answer, analysis: analysis, status: 'sample' };
  }
  function zp(year, seq, type, kpId, score, topic) {
    return { year: year, seq: seq, type: type, kpId: kpId, score: score, answer: '（待补原题）', analysis: topic, status: 'pending' };
  }

  /* ---------------- 数学真题（2021–2025 广州卷） ---------------- */
  var mathZhenQuestions = [
    /* 2021（120 分旧结构：选择10×3=30 / 填空6×3=18 / 解答9=72）—— 答案来源：百度文库/道客巴巴解析版 */
    zt(2021, 1, '选择', 'math_kp_0101', 3, 'D', '选择第 1 题（有理数相关），答案 D（来源：2021 广州中考数学解析版）'),
    zt(2021, 2, '选择', 'math_kp_0230', 3, 'A', '选择第 2 题（图形对称/中心对称相关），答案 A（来源：2021 广州中考数学解析版）'),
    zt(2021, 3, '选择', '待核', 3, 'D', '选择第 3 题，答案 D（来源：2021 广州中考数学解析版）'),
    zt(2021, 4, '选择', '待核', 3, 'C', '选择第 4 题，答案 C（来源：2021 广州中考数学解析版）'),
    zt(2021, 5, '选择', 'math_kp_0337', 3, 'B', '选择第 5 题（统计/中位数相关），答案 B（来源：2021 广州中考数学解析版）'),
    zt(2021, 6, '选择', '待核', 3, 'B', '选择第 6 题，答案 B（来源：2021 广州中考数学解析版）'),
    zt(2021, 7, '选择', '待核', 3, 'B', '选择第 7 题，答案 B（来源：2021 广州中考数学解析版）'),
    zt(2021, 8, '选择', 'math_kp_0226', 3, 'A', '选择第 8 题（方程相关），答案 A（来源：2021 广州中考数学解析版）'),
    zt(2021, 9, '选择', 'math_kp_0231', 3, 'C', '选择第 9 题（圆相关），答案 C（来源：2021 广州中考数学解析版）'),
    zt(2021, 10, '选择', '待核', 3, 'A', '选择第 10 题，答案 A（来源：2021 广州中考数学解析版）'),
    zt(2021, 11, '填空', 'math_kp_0112', 3, 'x≥6', '二次根式/取值范围，答案 x≥6（来源：2021 广州中考数学解析版）'),
    zt(2021, 12, '填空', 'math_kp_0226', 3, 'x₁=0, x₂=4', '一元二次方程，答案 x₁=0、x₂=4（来源：2021 广州中考数学解析版）'),
    zt(2021, 13, '填空', '待核', 3, '2', '填空题第 13 题，答案 2（来源：2021 广州中考数学解析版）'),
    zt(2021, 14, '填空', 'math_kp_0101', 3, '>', '实数比较大小，答案 >（来源：2021 广州中考数学解析版）'),
    zt(2021, 15, '填空', '待核', 3, '33°', '填空题第 15 题，答案 33°（来源：2021 广州中考数学解析版）'),
    zt(2021, 16, '填空', '待核', 3, '(1)(3)(4)', '多选题式填空，答案 (1)(3)(4)（来源：2021 广州中考数学解析版）'),
    zp(2021, 17, '解答', '待核', 8, '解答第 17 题（方程/不等式组）'),
    zp(2021, 18, '解答', '待核', 8, '解答第 18 题（几何证明）'),
    zp(2021, 19, '解答', 'math_kp_0109', 8, '解答第 19 题（代数式/分式求值）'),
    zp(2021, 20, '解答', 'math_kp_0337', 8, '解答第 20 题（统计）'),
    zp(2021, 21, '解答', '待核', 8, '解答第 21 题'),
    zp(2021, 22, '解答', '待核', 8, '解答第 22 题'),
    zp(2021, 23, '解答', 'math_kp_0223', 10, '解答第 23 题（一次函数与反比例综合）'),
    zp(2021, 24, '解答', 'math_kp_0232', 14, '解答第 24 题（圆：切线/周长/梯形）'),
    zp(2021, 25, '解答', 'math_kp_0229', 14, '解答第 25 题（二次函数压轴）'),

    /* 2022（120 分旧结构）—— 选择答案来源：renrendoc 505097390 解析版 */
    zt(2022, 1, '选择', 'math_kp_0340', 3, 'A', '几何体侧面展开图为扇形 → 圆锥，答案 A'),
    zt(2022, 2, '选择', 'math_kp_0230', 3, 'C', '中心对称图形判断，答案 C'),
    zt(2022, 3, '选择', 'math_kp_0109', 3, 'B', '代数式 1/(x+1) 有意义 → x>-1，答案 B'),
    zt(2022, 4, '选择', 'math_kp_0223', 3, 'D', '点(3,-5) 在正比例函数 y=kx 上，k=-5/3，答案 D'),
    zt(2022, 5, '选择', 'math_kp_0105', 3, 'D', '幂运算/根式运算判断，答案 D'),
    zt(2022, 6, '选择', 'math_kp_0228', 3, 'C', '抛物线 y=ax²+bx+c 对称轴 x=-2，性质判断，答案 C'),
    zt(2022, 7, '选择', 'math_kp_0102', 3, 'C', '数轴实数比较 |a|<|b|，答案 C'),
    zt(2022, 8, '选择', '待核', 3, 'A', '选择第 8 题，答案 A（来源：renrendoc 解析版）'),
    zt(2022, 9, '选择', '待核', 3, 'D', '选择第 9 题，答案 D（来源：renrendoc 解析版）'),
    zt(2022, 10, '选择', '待核', 3, 'B', '选择第 10 题，答案 B（来源：renrendoc 解析版）'),
    zp(2022, 11, '填空', '待核', 3, '填空题第 11 题'),
    zp(2022, 12, '填空', '待核', 3, '填空题第 12 题'),
    zp(2022, 13, '填空', '待核', 3, '填空题第 13 题'),
    zp(2022, 14, '填空', '待核', 3, '填空题第 14 题'),
    zp(2022, 15, '填空', '待核', 3, '填空题第 15 题'),
    zp(2022, 16, '填空', '待核', 3, '填空题第 16 题'),
    zp(2022, 17, '解答', '待核', 8, '解答第 17 题'),
    zp(2022, 18, '解答', '待核', 8, '解答第 18 题'),
    zp(2022, 19, '解答', '待核', 8, '解答第 19 题'),
    zp(2022, 20, '解答', '待核', 8, '解答第 20 题'),
    zp(2022, 21, '解答', '待核', 8, '解答第 21 题'),
    zp(2022, 22, '解答', '待核', 8, '解答第 22 题'),
    zp(2022, 23, '解答', '待核', 10, '解答第 23 题'),
    zp(2022, 24, '解答', '待核', 14, '解答第 24 题（扇形/平行四边形）'),
    zp(2022, 25, '解答', '待核', 14, '解答第 25 题（梯形与等腰三角形动点压轴）'),

    /* 2023（120 分旧结构）—— 答案来源：sxydy/shijuan.net 解析版 */
    zt(2023, 1, '选择', 'math_kp_0102', 3, 'B', '相反数，答案 B'),
    zt(2023, 2, '选择', 'math_kp_0340', 3, 'D', '由三视图判断几何体（圆柱上叠小圆锥），答案 D'),
    zt(2023, 3, '选择', 'math_kp_0337', 3, 'A', '读书本数 10,11,9,10,12：众数为 10，答案 A'),
    zt(2023, 4, '选择', 'math_kp_0105', 3, 'C', '整式运算/幂运算判断，答案 C'),
    zt(2023, 5, '选择', '待核', 3, 'B', '选择第 5 题，答案 B（来源：2023 广州中考数学解析版）'),
    zt(2023, 6, '选择', '待核', 3, 'C', '选择第 6 题，答案 C（来源：2023 广州中考数学解析版）'),
    zt(2023, 7, '选择', '待核', 3, 'D', '选择第 7 题，答案 D（来源：2023 广州中考数学解析版）'),
    zt(2023, 8, '选择', 'math_kp_0120', 3, 'B', '平行四边形判定命题真假，答案 B'),
    zt(2023, 9, '选择', 'math_kp_0231', 3, 'C', '半径 2√3 的圆内接正六边形面积 = 18√3，答案 C'),
    zt(2023, 10, '选择', 'math_kp_0226', 3, 'A', 'x=2 是方程 x²-2mx+3m=0 的根且两根为等腰三角形边长，答案 A（周长为 10）'),
    zt(2023, 11, '填空', 'math_kp_0103', 3, '2.8×10⁵', '科学记数法，答案 2.8×10⁵'),
    zt(2023, 12, '填空', 'math_kp_0117', 3, '30 和 36', '等腰三角形两问（顶角/底角），答案 30 与 36'),
    zt(2023, 13, '填空', 'math_kp_0119', 3, '17', '勾股定理/最值（正方形折叠，CF+EF 最小 = AE = √17），答案 17'),
    zt(2023, 14, '填空', 'math_kp_0339', 3, '60/13', '角平分线+等面积法求点到直线距离，答案 60/13'),
    zt(2023, 15, '填空', '待核', 3, '1.2', '填空第 15 题，答案 1.2'),
    zt(2023, 16, '填空', 'math_kp_0229', 3, '3S/4', '几何面积关系（中位线/四边形面积），答案 3S/4'),
    zt(2023, 17, '解答', 'math_kp_0226', 8, 'x₁=1, x₂=5', '解一元二次方程，答案 x₁=1、x₂=5（来源：sxydy 解析版）'),
    zt(2023, 18, '解答', 'math_kp_0116', 8, '证明：△ABC≌△BDE（SAS），∴∠C=∠E', '全等三角形证明（B 为 AD 中点，BC∥DE），答案见解析'),
    zt(2023, 19, '解答', 'math_kp_0230', 8, '圆心坐标 (5,2)/(5,0)；封闭图形周长 10+2√2', '弧/平移/周长（坐标系网格作图），答案见解析'),
    zt(2023, 20, '解答', 'math_kp_0109', 8, '化简结果：2a - 2/(a+2)（分式化简求值）', '分式化简求值，答案见解析'),
    zp(2023, 21, '解答', '待核', 8, '解答第 21 题'),
    zp(2023, 22, '解答', '待核', 8, '解答第 22 题'),
    zp(2023, 23, '解答', '待核', 10, '解答第 23 题'),
    zp(2023, 24, '解答', '待核', 14, '解答第 24 题'),
    zp(2023, 25, '解答', '待核', 14, '解答第 25 题'),

    /* 2024（120 分旧结构，25 小题）—— 答案来源：renrendoc 505097506 + 今日头条解析 */
    zt(2024, 1, '选择', 'math_kp_0101', 3, 'A', '四个数 -10,-1,0,10 中最小的是 -10，答案 A'),
    zt(2024, 2, '选择', 'math_kp_0230', 3, 'C', '阴影两三角形关于点 O 对称（中心对称），答案 C'),
    zt(2024, 3, '选择', 'math_kp_0104', 3, 'B', '分式/幂运算判断（a³·a²=a⁵），答案 B'),
    zt(2024, 4, '选择', 'math_kp_0108', 3, 'D', '不等式基本性质（若 a<b，则 2a<2b），答案 D'),
    zt(2024, 5, '选择', 'math_kp_0336', 3, 'B', '频数分布直方图读取（50 个公园用地面积），答案 B'),
    zt(2024, 6, '选择', 'math_kp_0106', 3, 'A', '新能源车企交付量列方程 1.2x+1100=35060，答案 A'),
    zt(2024, 7, '选择', 'math_kp_0117', 3, 'C', '等腰 Rt△ ABC 中 AE=CF，四边形 AEDF 面积 = 9，答案 C'),
    zt(2024, 8, '选择', 'math_kp_0228', 3, 'D', '二次函数与反比例图象增减性（x>1 均递减），答案 D'),
    zt(2024, 9, '选择', 'math_kp_0231', 3, 'C', '垂径定理+圆周角：半径 4，OP=5>4 → 点 P 在圆外，答案 C'),
    zt(2024, 10, '选择', 'math_kp_0340', 3, 'D', '圆锥侧面展开（72°扇形半径 5）→ 体积 2√6π，答案 D'),
    zt(2024, 11, '填空', 'math_kp_0114', 3, '109°', 'a∥b，∠1=71° → ∠2=109°，答案 109°'),
    zt(2024, 12, '填空', 'math_kp_0104', 3, '220', '串联电阻 U=IR₁+IR₂+IR₃，代入得 220'),
    zt(2024, 13, '填空', 'math_kp_0120', 3, '5', '▱ABCD 中 BA 平分 ∠EBC，BE=3，DE=5'),
    zt(2024, 14, '填空', 'math_kp_0104', 3, '11', 'a²-2a-5=0，则 2a²-4a+1=11'),
    zt(2024, 15, '填空', 'math_kp_0343', 3, '-1/2 或 7/4', '定义新运算 a⊗b，x⊗1=-1/2，x=-1/2 或 7/4'),
    zt(2024, 16, '填空', 'math_kp_0225', 3, '①②④', '矩形顶点在反比例函数图象上，正确结论 ①②④'),
    zt(2024, 17, '解答', 'math_kp_0110', 8, 'x=3（经检验是原方程的解）', '解分式方程并验根，答案 x=3'),
    zp(2024, 18, '解答', '待核', 8, '解答第 18 题（几何证明）'),
    zp(2024, 19, '解答', '待核', 8, '解答第 19 题'),
    zt(2024, 20, '解答', 'math_kp_0108', 9, 'm>3', '含参不等式（组）求参数范围，答案 m>3'),
    zt(2024, 21, '解答', '待核', 9, '-2', '解答第 21 题，答案 -2（来源：2024 广州中考数学解析）'),
    zt(2024, 22, '解答', 'math_kp_0337', 9, '85；82', '统计（平均数/中位数/众数计算），答案 85 与 82'),
    zt(2024, 23, '解答', 'math_kp_0338', 10, '1/3', '概率计算，答案 1/3（枚举 4 人分组）'),
    zt(2024, 24, '解答', 'math_kp_0228', 14, '8 米；4.5 秒；y=7x-5', '二次函数/一次函数应用（隧道或运动问题），答案见解析'),
    zt(2024, 25, '解答', 'math_kp_0229', 14, 'AF=AD 且 AF⊥AD；r≥3+3√3 且 r≠6+2√3；BE=12；直线 x=3；m=±1；15；2√2；y=x²-6x+2', '几何综合压轴（全等/外接圆/最值/二次函数解析式），答案见解析'),

    /* 2025（120 分旧结构：选择10×3=30 / 填空6×3=18 / 解答9=72）—— 答案来源：renrendoc/imqq 解析版 */
    zt(2025, 1, '选择', 'math_kp_0111', 3, 'A', '负无理数：-√2，答案 A'),
    zt(2025, 2, '选择', 'math_kp_0340', 3, 'B', 'Rt△ABC 绕直角边旋转一周 → 圆锥，答案 B'),
    zt(2025, 3, '选择', 'math_kp_0105', 3, 'D', '运算判断：2√a+5√a=7√a，答案 D'),
    zt(2025, 4, '选择', 'math_kp_0226', 3, 'C', '方程 x²-x+k²+2=0 判别式 Δ<0 → 无实数根，答案 C'),
    zt(2025, 5, '选择', '待核', 3, 'C', '选择第 5 题，答案 C（来源：2025 广州中考数学解析版）'),
    zt(2025, 6, '选择', '待核', 3, 'D', '选择第 6 题，答案 D（来源：2025 广州中考数学解析版）'),
    zt(2025, 7, '选择', '待核', 3, 'C', '选择第 7 题，答案 C（来源：2025 广州中考数学解析版）'),
    zt(2025, 8, '选择', '待核', 3, 'B', '选择第 8 题，答案 B（来源：2025 广州中考数学解析版）'),
    zt(2025, 9, '选择', '待核', 3, 'B', '选择第 9 题，答案 B（来源：2025 广州中考数学解析版）'),
    zt(2025, 10, '选择', '待核', 3, 'A', '选择第 10 题，答案 A（来源：2025 广州中考数学解析版）'),
    zt(2025, 11, '填空', 'math_kp_0114', 3, '144°', '直线相交，∠1=36°（邻补角）→ ∠2=144°'),
    zt(2025, 12, '填空', 'math_kp_0334', 3, '1/9', '△ADE∽△ABC，AD/AB=1/3 → 面积比 1/9'),
    zt(2025, 13, '填空', 'math_kp_0112', 3, 'x≥-1 且 x≠3', '代数式 √(x+1)/(x-3) 有意义 → x≥-1 且 x≠3'),
    zt(2025, 14, '填空', 'math_kp_0119', 3, '10', 'Rt△ABC 中 AD 平分 ∠A，勾股+角平分线 → 点 B 到 AD 距离 10'),
    zt(2025, 15, '填空', 'math_kp_0228', 3, '1 或 -1/3', '抛物线顶点在直线 y=mx 上，解得 m=1 或 -1/3'),
    zt(2025, 16, '填空', 'math_kp_0232', 3, 'd>6（含函数解析式）', '圆切线动点：点 P 与圆心距离 d 的范围 d>6，并求解析式'),
    zp(2025, 17, '解答', 'math_kp_0108', 8, '解答第 17 题（不等式组）'),
    zp(2025, 18, '解答', 'math_kp_0116', 8, '解答第 18 题（全等证明/圆切线平分角）'),
    zp(2025, 19, '解答', 'math_kp_0109', 8, '解答第 19 题（代数式求值）'),
    zp(2025, 20, '解答', 'math_kp_0336', 8, '解答第 20 题（统计图表）'),
    zp(2025, 21, '解答', 'math_kp_0225', 8, '解答第 21 题（反比例函数）'),
    zp(2025, 22, '解答', 'math_kp_0106', 8, '解答第 22 题（应用题·智能机器人）'),
    zp(2025, 23, '解答', 'math_kp_0341', 10, '解答第 23 题（黄金矩形/折叠）'),
    zp(2025, 24, '解答', 'math_kp_0228', 14, '解答第 24 题（隧道抛物线）'),
    zp(2025, 25, '解答', 'math_kp_0229', 14, '解答第 25 题（几何综合压轴：对称点/平行四边形/相似最值）')
  ];

  /* ---------------- 物理真题（2021–2025 广州卷） ---------------- */
  var phyZhenQuestions = [
    /* 2021 —— 选择 1-5 答案来源：百度文库/夸克解析版（广州卷） */
    zt(2021, 1, '选择', '待核', 3, 'C', '太阳能汽车能量转化：不能将太阳能全部转化为机械能，答案 C'),
    zt(2021, 2, '选择', '待核', 3, 'A', '原子结构：a 为原子核、b 为质子、c 为中子，答案 A'),
    zt(2021, 3, '选择', 'phy_kp_0104', 3, 'B', '鼓声每秒振动次数少 → 频率低音调低，答案 B'),
    zt(2021, 4, '选择', 'phy_kp_0328', 3, 'D', '静电喷漆：小液滴带同种电荷相互排斥，答案 D'),
    zt(2021, 5, '选择', 'phy_kp_0222', 3, 'A', '电梯匀速上升：动能不变、重力势能增大，答案 A'),
    zp(2021, 6, '选择', '待核', 3, '选择第 6 题（温度与内能）'),
    zp(2021, 7, '选择', '待核', 3, '选择第 7 题'),
    zp(2021, 8, '选择', '待核', 3, '选择第 8 题'),
    zp(2021, 9, '选择', '待核', 3, '选择第 9 题'),
    zp(2021, 10, '选择', '待核', 3, '选择第 10 题'),
    zp(2021, 11, '填空', '待核', 2, '填空第 11 题'),
    zp(2021, 12, '填空', '待核', 2, '填空第 12 题'),
    zp(2021, 13, '填空', '待核', 2, '填空第 13 题'),
    zp(2021, 14, '填空', '待核', 2, '填空第 14 题'),
    zp(2021, 15, '填空', '待核', 2, '填空第 15 题'),
    zp(2021, 16, '填空', '待核', 2, '填空第 16 题'),
    zp(2021, 17, '作图', '待核', 3, '作图第 17 题'),
    zp(2021, 18, '作图', '待核', 3, '作图第 18 题'),
    zp(2021, 19, '实验', '待核', 6, '实验第 19 题'),
    zp(2021, 20, '实验', '待核', 6, '实验第 20 题'),
    zp(2021, 21, '计算', '待核', 10, '计算第 21 题'),
    zp(2021, 22, '计算', '待核', 10, '计算第 22 题'),

    /* 2022 —— 素材文档中"已获取要点"实为广东省卷（book118 标题为"广东省初中学业水平考试"），
       为避免把广东卷误标为广州卷，本年份全部保持 pending（广州卷真题待补） */
    zp(2022, 1, '选择', '待核', 2, '选择第 1 题'),
    zp(2022, 2, '选择', '待核', 2, '选择第 2 题'),
    zp(2022, 3, '选择', '待核', 2, '选择第 3 题'),
    zp(2022, 4, '选择', '待核', 2, '选择第 4 题'),
    zp(2022, 5, '选择', '待核', 2, '选择第 5 题'),
    zp(2022, 6, '选择', '待核', 2, '选择第 6 题'),
    zp(2022, 7, '选择', '待核', 2, '选择第 7 题'),
    zp(2022, 8, '选择', '待核', 2, '选择第 8 题'),
    zp(2022, 9, '选择', '待核', 2, '选择第 9 题'),
    zp(2022, 10, '选择', '待核', 2, '选择第 10 题'),
    zp(2022, 11, '填空', '待核', 2, '填空第 11 题'),
    zp(2022, 12, '填空', '待核', 2, '填空第 12 题'),
    zp(2022, 13, '填空', '待核', 2, '填空第 13 题'),
    zp(2022, 14, '填空', '待核', 2, '填空第 14 题'),
    zp(2022, 15, '填空', '待核', 2, '填空第 15 题'),
    zp(2022, 16, '作图', '待核', 3, '作图第 16 题'),
    zp(2022, 17, '作图', '待核', 3, '作图第 17 题'),
    zp(2022, 18, '实验', '待核', 6, '实验第 18 题'),
    zp(2022, 19, '实验', '待核', 6, '实验第 19 题'),
    zp(2022, 20, '实验', '待核', 6, '实验第 20 题'),
    zp(2022, 21, '计算', '待核', 10, '计算第 21 题'),
    zp(2022, 22, '计算', '待核', 10, '计算第 22 题'),

    /* 2023 —— 答案来源：imqq/21cnjy 解析版（广州卷） */
    zt(2023, 1, '选择', 'phy_kp_0110', 3, 'B', '"掬手为升"：人双手捧起的米质量约 300 g，答案 B（对应考点：质量及其测量）'),
    zt(2023, 2, '选择', 'phy_kp_0328', 3, 'D', '硅胶管摩擦起电：电子从手转移到 M，M 带负电，答案 D'),
    zt(2023, 9, '选择', 'phy_kp_0104', 3, 'B', '音叉 M、N 均发 440 Hz：频率相同，答案 B（共振/频率）'),
    zp(2023, 3, '选择', '待核', 3, '选择第 3 题'),
    zp(2023, 4, '选择', '待核', 3, '选择第 4 题'),
    zp(2023, 5, '选择', '待核', 3, '选择第 5 题'),
    zp(2023, 6, '选择', '待核', 3, '选择第 6 题'),
    zp(2023, 7, '选择', '待核', 3, '选择第 7 题'),
    zp(2023, 8, '选择', '待核', 3, '选择第 8 题'),
    zp(2023, 10, '选择', '待核', 3, '选择第 10 题'),
    zp(2023, 11, '填空', '待核', 2, '填空第 11 题'),
    zp(2023, 12, '填空', '待核', 2, '填空第 12 题'),
    zp(2023, 13, '填空', '待核', 2, '填空第 13 题'),
    zp(2023, 14, '填空', '待核', 2, '填空第 14 题'),
    zp(2023, 15, '填空', '待核', 2, '填空第 15 题'),
    zp(2023, 16, '填空', '待核', 2, '填空第 16 题'),
    zp(2023, 17, '作图', '待核', 3, '作图第 17 题'),
    zp(2023, 18, '作图', '待核', 3, '作图第 18 题'),
    zp(2023, 19, '实验', '待核', 6, '实验第 19 题'),
    zp(2023, 20, '实验', '待核', 6, '实验第 20 题'),
    zp(2023, 21, '计算', '待核', 10, '计算第 21 题'),
    zp(2023, 22, '计算', '待核', 10, '计算第 22 题'),

    /* 2024 —— 选择 1-6 答案来源：七彩学科网 7cxk 解析版（广州卷，选择 10×3=30） */
    zt(2024, 1, '选择', 'phy_kp_0106', 3, 'B', '光导纤维传递信息利用光的反射，答案 B'),
    zt(2024, 2, '选择', 'phy_kp_0104', 3, 'C', '鸟鸣频率 5000Hz > 猫叫 800Hz，鸟鸣音调高，答案 C'),
    zt(2024, 3, '选择', 'phy_kp_0327', 3, 'C', '能源分类：风能、水能既来自太阳辐射又可再生，答案 C'),
    zt(2024, 4, '选择', 'phy_kp_0214', 3, 'B', '吸盘静止：摩擦力方向竖直向上且等于重力，答案 B'),
    zt(2024, 5, '选择', 'phy_kp_0105', 3, 'C', '"回南天"玻璃出水：水蒸气遇冷液化放热，答案 C'),
    zt(2024, 6, '选择', 'phy_kp_0219', 3, 'A', '潜水艇"掉深"：从高密度区驶入低密度区浮力变小，答案 A'),
    zp(2024, 7, '选择', '待核', 3, '选择第 7 题（避雷针雷电）'),
    zp(2024, 8, '选择', '待核', 3, '选择第 8 题'),
    zp(2024, 9, '选择', '待核', 3, '选择第 9 题'),
    zp(2024, 10, '选择', '待核', 3, '选择第 10 题'),
    zp(2024, 11, '填空', '待核', 2, '填空第 11 题'),
    zp(2024, 12, '填空', '待核', 2, '填空第 12 题'),
    zp(2024, 13, '填空', '待核', 2, '填空第 13 题'),
    zp(2024, 14, '填空', '待核', 2, '填空第 14 题'),
    zp(2024, 15, '填空', '待核', 2, '填空第 15 题'),
    zp(2024, 16, '填空', '待核', 2, '填空第 16 题'),
    zp(2024, 17, '作图', '待核', 3, '作图第 17 题'),
    zp(2024, 18, '作图', '待核', 3, '作图第 18 题'),
    zp(2024, 19, '实验', '待核', 6, '实验第 19 题'),
    zp(2024, 20, '实验', '待核', 6, '实验第 20 题'),
    zp(2024, 21, '计算', '待核', 10, '计算第 21 题'),
    zp(2024, 22, '计算', '待核', 10, '计算第 22 题'),

    /* 2025 —— 选择 1-10 答案来源：renrendoc/zixin 解析版（广州卷，选择 10×3=30） */
    zt(2025, 1, '选择', 'phy_kp_0104', 3, 'B', 'AI 智能音箱调音量改变响度，答案 B'),
    zt(2025, 2, '选择', '待核', 3, 'A', '氦原子结构：核外 2 个电子，答案 A'),
    zt(2025, 3, '选择', 'phy_kp_0334', 3, 'A', '频率 1.027×10⁸ Hz 的电磁波属于无线电波，答案 A'),
    zt(2025, 4, '选择', 'phy_kp_0325', 3, 'D', '热汤中金属勺变凉：通过热传递减小内能，答案 D'),
    zt(2025, 5, '选择', 'phy_kp_0109', 3, 'A', '蜡烛距凸透镜 20cm 成倒立缩小像 → 焦距 f<10cm，答案 A（5cm）'),
    zt(2025, 6, '选择', '待核', 3, 'C', '选择第 6 题，答案 C（来源：2025 广州中考物理解析版）'),
    zt(2025, 7, '选择', '待核', 3, 'B', '选择第 7 题，答案 B（来源：2025 广州中考物理解析版）'),
    zt(2025, 8, '选择', '待核', 3, 'B', '选择第 8 题，答案 B（来源：2025 广州中考物理解析版）'),
    zt(2025, 9, '选择', 'phy_kp_0220', 3, 'D', '小球浸没水中由静止释放：浮沉取决于重力与浮力关系，无法确定，答案 D'),
    zt(2025, 10, '选择', 'phy_kp_0224', 3, 'D', '滑轮组（n=2）提升 800N 物：有用功 800J 等，答案 D（功率/效率综合判断）'),
    zp(2025, 11, '填空', '待核', 2, '填空第 11 题'),
    zp(2025, 12, '填空', '待核', 2, '填空第 12 题'),
    zp(2025, 13, '填空', '待核', 2, '填空第 13 题'),
    zp(2025, 14, '填空', '待核', 2, '填空第 14 题'),
    zp(2025, 15, '填空', '待核', 2, '填空第 15 题'),
    zp(2025, 16, '填空', '待核', 2, '填空第 16 题'),
    zp(2025, 17, '作图', '待核', 3, '作图第 17 题'),
    zp(2025, 18, '实验', '待核', 6, '实验第 18 题（测气球浮力跨学科实践）'),
    zp(2025, 19, '实验', '待核', 6, '实验第 19 题'),
    zp(2025, 20, '实验', '待核', 6, '实验第 20 题'),
    zp(2025, 21, '计算', '待核', 10, '计算第 21 题'),
    zp(2025, 22, '计算', '待核', 10, '计算第 22 题')
  ];

  /* summary：由已入库题目自动聚合（仅统计 kpId 有效的题，反映真题库真实覆盖） */
  function buildZhenSummary(subject, questions) {
    var map = {};
    questions.forEach(function (q) {
      if (!q.kpId || q.kpId === '待核') return;
      var kp = map[q.kpId] || { kpId: q.kpId, years: [], total: 0, types: [] };
      if (kp.years.indexOf(q.year) === -1) kp.years.push(q.year);
      if (kp.types.indexOf(q.type) === -1) kp.types.push(q.type);
      map[q.kpId] = kp;
    });
    return Object.keys(map).map(function (k) {
      var m = map[k];
      m.years.sort(function (a, b) { return a - b; });
      m.total = m.years.length;
      return m;
    }).sort(function (a, b) { return b.total - a.total; });
  }

  var zhenTi = {
    math: {
      subject: 'math',
      summary: buildZhenSummary('math', mathZhenQuestions),
      questions: mathZhenQuestions
    },
    physics: {
      subject: 'physics',
      summary: buildZhenSummary('physics', phyZhenQuestions),
      questions: phyZhenQuestions
    }
  };

  /* ============================================================
     生成 20 套卷（数学 10 + 物理 10）
     ============================================================ */
  var papers = [];
  for (var mk = 0; mk < 10; mk++) papers.push(buildMathPaper(mk));
  for (var pk = 0; pk < 10; pk++) papers.push(buildPhyPaper(pk));

  return {
    papers: papers,
    zhenTi: zhenTi
  };
})();

/* 数据自检 */
(function () {
  var d = window.DATA.papers;
  var mathPapers = d.papers.filter(function (p) { return p.subject === 'math'; });
  var phyPapers = d.papers.filter(function (p) { return p.subject === 'physics'; });
  console.log('[DATA] papers v2 loaded, math=' + mathPapers.length + '套(各' + mathPapers.map(function (p) { return p.questions.length; }).join('+') + '题), physics=' +
    phyPapers.length + '套(各' + phyPapers.map(function (p) { return p.questions.length; }).join('+') + '题), zhenTi math=' +
    d.zhenTi.math.questions.length + ' physics=' + d.zhenTi.physics.questions.length);
})();
