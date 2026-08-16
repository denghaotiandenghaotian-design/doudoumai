/* ============================================================
   data-olympiad.js —— 初中奥数数据（window.DATA.olympiad）
   职责：考点库 / 题库（全部 isOlympiad=true）/ 必背清单 / 思维导图
   定位：第三学科切换项；全部内容标"竞赛"标签，与常规内容分开展示
   依赖：无（纯数据）
   ============================================================ */

window.DATA = window.DATA || {};
window.DATA.olympiad = (function () {

  /* ================= 一、考点库（18 个） ================= */
  const knowledgePoints = [
    { id: 'oly_kp_0101', subject: 'olympiad', name: '整除与同余', board: '数论', grade: '七年级', volume: '竞赛', chapter: '数论基础', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['竞赛', '必会'], hotRank: 3, desc: '整除性质、带余除法、同余概念、模运算基本性质', examHint: '竞赛选择/填空常客，同余判断余数', relatedIds: ['oly_kp_0102', 'oly_kp_0103'] },
    { id: 'oly_kp_0102', subject: 'olympiad', name: '质数与合数', board: '数论', grade: '七年级', volume: '竞赛', chapter: '数论基础', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空'], tags: ['竞赛'], hotRank: null, desc: '质数定义、分解质因数、唯一分解定理', examHint: '分解质因数求约数个数', relatedIds: ['oly_kp_0101'] },
    { id: 'oly_kp_0103', subject: 'olympiad', name: '奇偶分析', board: '数论', grade: '七年级', volume: '竞赛', chapter: '数论基础', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['竞赛', '常考变形'], hotRank: null, desc: '奇偶性运算规律、奇偶分析法', examHint: '证明无解/唯一解的利器', relatedIds: ['oly_kp_0101'] },
    { id: 'oly_kp_0104', subject: 'olympiad', name: '完全平方数', board: '数论', grade: '八年级', volume: '竞赛', chapter: '数论进阶', frequency: 2, difficulty: '中档', questionTypes: ['选择', '填空'], tags: ['竞赛'], hotRank: null, desc: '完全平方数性质（末位、模4模3特征）', examHint: '判定一个数是否为完全平方数', relatedIds: ['oly_kp_0101'] },
    { id: 'oly_kp_0105', subject: 'olympiad', name: '不定方程', board: '数论', grade: '八年级', volume: '竞赛', chapter: '数论进阶', frequency: 3, difficulty: '压轴', questionTypes: ['填空', '解答'], tags: ['竞赛', '压轴'], hotRank: null, desc: '二元一次不定方程、因式分解法、整除放缩法', examHint: '竞赛解答题高频，用因式分解+整除求解', relatedIds: ['oly_kp_0101'] },
    { id: 'oly_kp_0106', subject: 'olympiad', name: '抽屉原理', board: '组合', grade: '七年级', volume: '竞赛', chapter: '组合初步', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['竞赛', '常考变形'], hotRank: 2, desc: '抽屉原理（鸽巢原理）及构造', examHint: '"保证至少"类问题', relatedIds: ['oly_kp_0112'] },
    { id: 'oly_kp_0107', subject: 'olympiad', name: '计数原理（加法/乘法）', board: '组合', grade: '七年级', volume: '竞赛', chapter: '组合初步', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空'], tags: ['竞赛'], hotRank: null, desc: '分类加法、分步乘法、简单排列组合', examHint: '计数选择题基础', relatedIds: ['oly_kp_0106'] },
    { id: 'oly_kp_0108', subject: 'olympiad', name: '组合最值', board: '组合', grade: '八年级', volume: '竞赛', chapter: '组合进阶', frequency: 2, difficulty: '压轴', questionTypes: ['解答'], tags: ['竞赛', '压轴'], hotRank: null, desc: '极端原理、构造法求最值、不等式放缩', examHint: '竞赛压轴，构造与证明结合', relatedIds: ['oly_kp_0106'] },
    { id: 'oly_kp_0109', subject: 'olympiad', name: '逻辑推理与构造', board: '组合', grade: '八年级', volume: '竞赛', chapter: '组合进阶', frequency: 3, difficulty: '中档', questionTypes: ['选择', '解答'], tags: ['竞赛', '常考变形'], hotRank: null, desc: '逻辑推理题、反证法、染色法、构造反例', examHint: '真假话/比赛积分推理', relatedIds: ['oly_kp_0106'] },
    { id: 'oly_kp_0110', subject: 'olympiad', name: '因式分解技巧', board: '代数', grade: '七年级', volume: '竞赛', chapter: '代数基础', frequency: 3, difficulty: '基础', questionTypes: ['选择', '填空', '解答'], tags: ['竞赛', '必会'], hotRank: 1, desc: '换元法、拆项添项法、十字相乘进阶、主元法', examHint: '竞赛代数解题基础，多项分解', relatedIds: ['oly_kp_0111'] },
    { id: 'oly_kp_0111', subject: 'olympiad', name: '绝对值方程与不等式', board: '代数', grade: '八年级', volume: '竞赛', chapter: '代数进阶', frequency: 2, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['竞赛'], hotRank: null, desc: '零点分段讨论、|a|±|b| 最值、三角不等式', examHint: '含绝对值分段讨论', relatedIds: ['oly_kp_0110'] },
    { id: 'oly_kp_0112', subject: 'olympiad', name: '一元二次方程根的讨论', board: '代数', grade: '九年级', volume: '竞赛', chapter: '代数进阶', frequency: 3, difficulty: '压轴', questionTypes: ['填空', '解答'], tags: ['竞赛', '压轴'], hotRank: null, desc: '判别式与整数根、韦达定理应用、根的分布', examHint: '整数根问题是竞赛高频', relatedIds: ['oly_kp_0110'] },
    { id: 'oly_kp_0113', subject: 'olympiad', name: '函数与方程思想', board: '代数', grade: '九年级', volume: '竞赛', chapter: '综合', frequency: 2, difficulty: '压轴', questionTypes: ['解答'], tags: ['竞赛', '压轴'], hotRank: null, desc: '构造方程、函数最值（二次函数/均值思想）', examHint: '构造法是竞赛压轴常用', relatedIds: ['oly_kp_0112'] },
    { id: 'oly_kp_0114', subject: 'olympiad', name: '三角形五心', board: '几何', grade: '八年级', volume: '竞赛', chapter: '几何基础', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['竞赛'], hotRank: null, desc: '重心/外心/内心/垂心/旁心及性质', examHint: '内心外心常与圆结合', relatedIds: ['oly_kp_0115'] },
    { id: 'oly_kp_0115', subject: 'olympiad', name: '面积法', board: '几何', grade: '八年级', volume: '竞赛', chapter: '几何基础', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['竞赛', '常考变形'], hotRank: null, desc: '等积变换、面积比与线段比、割补法', examHint: '用面积证明线段比', relatedIds: ['oly_kp_0114'] },
    { id: 'oly_kp_0116', subject: 'olympiad', name: '相似与比例线段进阶', board: '几何', grade: '九年级', volume: '竞赛', chapter: '几何进阶', frequency: 3, difficulty: '压轴', questionTypes: ['填空', '解答'], tags: ['竞赛', '压轴'], hotRank: null, desc: '梅涅劳斯/塞瓦定理、比例线段综合', examHint: '竞赛几何压轴高频定理', relatedIds: ['oly_kp_0115'] },
    { id: 'oly_kp_0117', subject: 'olympiad', name: '圆幂定理', board: '几何', grade: '九年级', volume: '竞赛', chapter: '几何进阶', frequency: 3, difficulty: '压轴', questionTypes: ['填空', '解答'], tags: ['竞赛', '压轴'], hotRank: null, desc: '相交弦定理、割线定理、切割线定理', examHint: '圆幂定理统一形式 PA·PB=PC·PD', relatedIds: ['oly_kp_0116'] },
    { id: 'oly_kp_0118', subject: 'olympiad', name: '几何最值与构造', board: '几何', grade: '九年级', volume: '竞赛', chapter: '综合', frequency: 2, difficulty: '压轴', questionTypes: ['解答'], tags: ['竞赛', '压轴'], hotRank: null, desc: '几何不等式、特殊位置取最值、旋转变换', examHint: '旋转/对称构造求最值', relatedIds: ['oly_kp_0117'] }
  ];

  const hotTop10 = knowledgePoints
    .filter(k => k.frequency >= 3)
    .sort((a, b) => (b.frequency - a.frequency) || ((a.hotRank || 99) - (b.hotRank || 99)))
    .slice(0, 10);

  const easyMistakes = knowledgePoints
    .filter(k => k.tags.indexOf('易错') !== -1)
    .map(k => ({ id: k.id, title: k.name, advice: k.examHint }));

  /* ================= 二、题库（24 题，全部 isOlympiad=true） ================= */
  const questions = [
    { id: 'oly_q_0001', subject: 'olympiad', type: '选择', kpId: 'oly_kp_0102', difficulty: 1, stem: '30 的约数共有（　）个', options: ['A．6', 'B．7', 'C．8', 'D．10'], answer: 'C', analysis: ['30 = 2×3×5', '约数个数 = (1+1)(1+1)(1+1) = 8'], pitfall: '分解质因数后各指数+1 相乘', variant: { stem: '12 的约数个数？', answer: '6', analysis: ['12 = 2²×3，(2+1)(1+1) = 6'] }, isOlympiad: true, isHot: false, selfTest: true },
    { id: 'oly_q_0002', subject: 'olympiad', type: '选择', kpId: 'oly_kp_0101', difficulty: 1, stem: '123456789 除以 9 的余数是（　）', options: ['A．0', 'B．1', 'C．2', 'D．3'], answer: 'A', analysis: ['被 9 整除判定：各位数字和能被 9 整除', '1+2+3+4+5+6+7+8+9 = 45，45 能被 9 整除', '余数为 0'], pitfall: '9 的整除判定用数字和', variant: { stem: '数字和 27 的数是 9 的倍数吗？', answer: '是', analysis: ['27 能被 9 整除，该数是 9 的倍数'] }, isOlympiad: true, isHot: true, selfTest: true },
    { id: 'oly_q_0003', subject: 'olympiad', type: '选择', kpId: 'oly_kp_0106', difficulty: 2, stem: '有 13 个苹果放进 4 个抽屉，则必有一个抽屉至少有（　）个苹果', options: ['A．2', 'B．3', 'C．4', 'D．5'], answer: 'C', analysis: ['13 ÷ 4 = 3 余 1', '抽屉原理：至少 3+1 = 4 个'], pitfall: '余数要加 1', variant: { stem: '5 个苹果 3 个抽屉，必有一个抽屉至少？', answer: '2', analysis: ['5÷3=1 余 2，至少 1+1=2'] }, isOlympiad: true, isHot: true, selfTest: true },
    { id: 'oly_q_0004', subject: 'olympiad', type: '选择', kpId: 'oly_kp_0110', difficulty: 1, stem: '因式分解：x² + 5x + 6 =（　）', options: ['A．(x+2)(x+3)', 'B．(x+1)(x+6)', 'C．(x-2)(x-3)', 'D．(x+2)(x-3)'], answer: 'A', analysis: ['十字相乘：找两数乘积 6、和 5，即 2 和 3', '(x+2)(x+3)'], pitfall: '常数项为正、一次项为正，两因皆正', variant: { stem: '分解 x² - 4x - 5', answer: '(x-5)(x+1)', analysis: ['两数积 -5、和 -4，即 -5 和 1'] }, isOlympiad: true, isHot: true, selfTest: true },
    { id: 'oly_q_0005', subject: 'olympiad', type: '选择', kpId: 'oly_kp_0103', difficulty: 2, stem: '若 n 为整数，则 n² + n 一定是（　）', options: ['A．奇数', 'B．偶数', 'C．质数', 'D．3 的倍数'], answer: 'B', analysis: ['n² + n = n(n+1)，连续两整数乘积必为偶数'], pitfall: '连续两整数一奇一偶，乘积为偶', variant: { stem: 'n(n+1)(n+2) 必是几的倍数？', answer: '6', analysis: ['三连续整数含 2 和 3 的倍数'] }, isOlympiad: true, isHot: true, selfTest: true },
    { id: 'oly_q_0006', subject: 'olympiad', type: '选择', kpId: 'oly_kp_0104', difficulty: 2, stem: '下列数中，是完全平方数的是（　）', options: ['A．222', 'B．484', 'C．1000', 'D．2024'], answer: 'B', analysis: ['484 = 22²，是完全平方数', 'A: 222 末位 2 不可能是平方数', 'C: 1000 的质因数分解 2³×5³，指数不全为偶', 'D: 2024 介于 44²=1936 与 45²=2025 之间，不是平方数'], pitfall: '完全平方数末位只能是 0,1,4,5,6,9，且质因数分解指数全为偶数', variant: { stem: '写出 144 的平方根', answer: '±12', analysis: ['12² = 144'] }, isOlympiad: true, isHot: false, selfTest: true },
    { id: 'oly_q_0007', subject: 'olympiad', type: '选择', kpId: 'oly_kp_0107', difficulty: 1, stem: '从 A 地到 B 地有 3 条路，从 B 地到 C 地有 2 条路，则从 A 经 B 到 C 共有（　）种走法', options: ['A．5', 'B．6', 'C．9', 'D．12'], answer: 'B', analysis: ['分步乘法原理：3 × 2 = 6'], pitfall: '分步用乘法、分类用加法', variant: { stem: '衣服 3 件、裤子 2 条，搭配？', answer: '6 种', analysis: ['3×2 = 6'] }, isOlympiad: true, isHot: false, selfTest: true },
    { id: 'oly_q_0008', subject: 'olympiad', type: '选择', kpId: 'oly_kp_0109', difficulty: 2, stem: '甲、乙、丙三人中只有一人会游泳。甲说"我会"，乙说"我不会"，丙说"甲不会"。已知三人中只有一人说真话，则会游泳的是（　）', options: ['A．甲', 'B．乙', 'C．丙', 'D．无法确定'], answer: 'B', analysis: ['假设甲会：甲真、乙假（乙会？矛盾乙不会为假则乙会）、丙假——甲真丙假，乙说"我不会"若乙会则假，成立？', '逐一验证：若乙会，甲说"我会"假，乙说"我不会"假，丙说"甲不会"真，恰一真 ✓', '选 B'], pitfall: '逐一假设验证真假', variant: { stem: '三张牌只有一张 A，A 说"我是 A"，B 说"我不是 A"，C 说"B 是 A"，仅一人真，A 是？', answer: 'B 或 C（需按题验证）', analysis: ['用假设法逐一检验'] }, isOlympiad: true, isHot: false, selfTest: false },
    { id: 'oly_q_0009', subject: 'olympiad', type: '选择', kpId: 'oly_kp_0114', difficulty: 2, stem: '三角形的重心是（　）', options: ['A．三条角平分线交点', 'B．三条中线交点', 'C．三边垂直平分线交点', 'D．三条高线交点'], answer: 'B', analysis: ['重心 = 三条中线的交点', '内心 = 角平分线交点；外心 = 垂直平分线交点；垂心 = 高线交点'], pitfall: '五心名称与定义对应', variant: { stem: '到三边距离相等的点是？', answer: '内心', analysis: ['角平分线交点到三边距离相等'] }, isOlympiad: true, isHot: true, selfTest: true },
    { id: 'oly_q_0010', subject: 'olympiad', type: '填空', kpId: 'oly_kp_0101', difficulty: 1, stem: '100 以内最大的质数是 ______。', options: [], answer: '97', analysis: ['97 不能被 2、3、5、7 整除', '100 以内最大质数为 97'], pitfall: '质数判断试除到 √n', variant: { stem: '50 以内最大的质数？', answer: '47', analysis: ['47 为质数'] }, isOlympiad: true, isHot: false, selfTest: true },
    { id: 'oly_q_0011', subject: 'olympiad', type: '填空', kpId: 'oly_kp_0103', difficulty: 2, stem: '1×2×3×…×20 的末尾共有 ______ 个连续的 0。', options: [], answer: '4', analysis: ['末尾 0 的个数 = 因子 5 的个数（2 足够多）', '1~20 中 5 的倍数：5,10,15,20 共 4 个（25 没有）', '共 4 个 0'], pitfall: '只数因子 5 的个数；25、125 要额外计', variant: { stem: '1~30 连乘末尾几个 0？', answer: '7', analysis: ['5 的倍数 6 个 + 25 多 1 个 = 7'] }, isOlympiad: true, isHot: true, selfTest: true },
    { id: 'oly_q_0012', subject: 'olympiad', type: '填空', kpId: 'oly_kp_0110', difficulty: 2, stem: '因式分解：x³ - x = ______。', options: [], answer: 'x(x+1)(x-1)', analysis: ['提公因式：x(x²-1)', '平方差：x(x+1)(x-1)'], pitfall: '先提公因式再套公式', variant: { stem: '分解 x⁴ - 1', answer: '(x²+1)(x+1)(x-1)', analysis: ['平方差两次'] }, isOlympiad: true, isHot: true, selfTest: true },
    { id: 'oly_q_0013', subject: 'olympiad', type: '填空', kpId: 'oly_kp_0111', difficulty: 2, stem: '方程 |x-1| = 3 的解为 ______。', options: [], answer: 'x = 4 或 x = -2', analysis: ['|x-1| = 3 → x-1 = 3 或 x-1 = -3', 'x = 4 或 x = -2'], pitfall: '绝对值方程分正负两种情况', variant: { stem: '|x+2| = 1 的解？', answer: 'x = -1 或 x = -3', analysis: ['x+2=±1'] }, isOlympiad: true, isHot: false, selfTest: true },
    { id: 'oly_q_0014', subject: 'olympiad', type: '填空', kpId: 'oly_kp_0115', difficulty: 2, stem: '△ABC 中 D 在 BC 上且 BD:DC = 2:1，则 S△ABD : S△ADC = ______。', options: [], answer: '2:1', analysis: ['同高三角形面积比 = 底边比', 'S△ABD:S△ADC = BD:DC = 2:1'], pitfall: '同高等底，面积比等于底边比', variant: { stem: '中线 AD 分出的两三角形面积？', answer: '相等', analysis: ['BD=DC，同高，面积相等'] }, isOlympiad: true, isHot: true, selfTest: true },
    { id: 'oly_q_0015', subject: 'olympiad', type: '填空', kpId: 'oly_kp_0112', difficulty: 3, stem: '一元二次方程 x² - 6x + k = 0 有整数根，则整数 k 的最大值为 ______。', options: [], answer: '9', analysis: ['设两根为 m、n 整数，m+n=6，mn=k', 'k = mn，m+n=6，m、n 整数', '求 mn 最大：m=n=3 时 k=9', '验证：x²-6x+9=0 根为 3、3 ✓'], pitfall: '用韦达定理转整数最值问题', variant: { stem: 'x²+px+6=0 有整数根，整数 p 有几个？', answer: '8', analysis: ['mn=6，(m,n) 组合 8 组（含符号）'] }, isOlympiad: true, isHot: true, selfTest: false },
    { id: 'oly_q_0016', subject: 'olympiad', type: '填空', kpId: 'oly_kp_0105', difficulty: 3, stem: '求方程 x² - y² = 15 的正整数解组数。', options: [], answer: '2 组', analysis: ['(x-y)(x+y) = 15', '15 = 1×15 = 3×5', 'x-y=1, x+y=15 → x=8,y=7', 'x-y=3, x+y=5 → x=4,y=1', '共 2 组'], pitfall: '因式分解后枚举因数对', variant: { stem: 'x²-y²=8 的正整数解？', answer: 'x=3,y=1', analysis: ['(x-y)(x+y)=8=2×4 → x=3,y=1'] }, isOlympiad: true, isHot: true, selfTest: false },
    { id: 'oly_q_0017', subject: 'olympiad', type: '解答', kpId: 'oly_kp_0110', difficulty: 2, stem: '因式分解：(x²+x)² - 8(x²+x) + 12。', options: [], answer: '(x+2)(x-1)(x²+x-6) 整理为 (x-1)(x+2)(x+3)(x-2)', analysis: ['换元：令 t = x²+x', 't² - 8t + 12 = (t-2)(t-6)', '回代：(x²+x-2)(x²+x-6)', '再分解：(x+2)(x-1)(x+3)(x-2)'], pitfall: '换元后记得回代并继续分解', variant: { stem: '分解 (x²+3x)² - 2(x²+3x) - 8', answer: '(x+4)(x-1)(x+1)(x+2)', analysis: ['t²-2t-8=(t-4)(t+2)，回代再分解'] }, isOlympiad: true, isHot: true, selfTest: false },
    { id: 'oly_q_0018', subject: 'olympiad', type: '解答', kpId: 'oly_kp_0111', difficulty: 2, stem: '解不等式：|x-1| + |x+2| < 6。', options: [], answer: '-3.5 < x < 2.5', analysis: ['零点分段：x=-2 和 x=1 分三段', 'x<-2：-(x-1)-(x+2)<6 → -2x-1<6 → x>-3.5，得 -3.5<x<-2', '-2≤x≤1：-(x-1)+(x+2)=3<6 恒成立，得 -2≤x≤1', 'x>1：x-1+x+2<6 → 2x<5 → x<2.5，得 1<x<2.5', '综上 -3.5 < x < 2.5'], pitfall: '绝对值不等式用零点分段', variant: { stem: '|x-1|+|x+2| 的最小值？', answer: '3', analysis: ['几何意义：数轴上到 1 和 -2 的距离和，最小 3'] }, isOlympiad: true, isHot: true, selfTest: false },
    { id: 'oly_q_0019', subject: 'olympiad', type: '解答', kpId: 'oly_kp_0106', difficulty: 2, stem: '证明：在任意 6 个人中，必有 3 个人互相认识或互相不认识。', options: [], answer: '用抽屉原理证明', analysis: ['任取一人 A，其余 5 人要么至少 3 人与 A 认识，要么至少 3 人与 A 不认识（抽屉原理：5 人分两类必有一类 ≥3）', '若 3 人与 A 认识：这 3 人中若有两人认识，则与 A 组成三人互相认识；否则这 3 人互相不认识', '另一情况同理', '命题得证'], pitfall: '拉姆齐 R(3,3)=6 的经典证明', variant: { stem: '6 点两两连红蓝线，必有同色三角形？', answer: '是', analysis: ['同构于上述证明'] }, isOlympiad: true, isHot: false, selfTest: false },
    { id: 'oly_q_0020', subject: 'olympiad', type: '解答', kpId: 'oly_kp_0115', difficulty: 3, stem: '如图，在 △ABC 中，D、E 分别在 AB、AC 上，且 AD:DB = 1:2，AE:EC = 2:1，BE 与 CD 交于 O。求 S△OBC : S△ABC。', options: [], answer: '1:3', analysis: ['设 S△ABC = S', 'S△ABE = 2/3 S（AE:AC=2:3 同高），S△ACD = 1/3 S（AD:AB=1:3）', 'BE 与 CD 交点 O：用面积比/塞瓦可算得 O 分 BE 的比例', '设 S△OBC = x，由共边比例可得 x = S/3，即 S△OBC:S△ABC = 1:3'], pitfall: '用面积比+共边比例算交点分线段比', variant: { stem: 'AD=DB、AE=EC（中点），重心分中线比？', answer: '2:1', analysis: ['重心将中线分为 2:1'] }, isOlympiad: true, isHot: true, selfTest: false },
    { id: 'oly_q_0021', subject: 'olympiad', type: '解答', kpId: 'oly_kp_0116', difficulty: 3, stem: '△ABC 中，D 在 BC 上，E 在 CA 上，F 在 AB 上，且 D、E、F 共线。若 BD:DC=2:1，CE:EA=1:1，求 AF:FB。', options: [], answer: 'AF:FB = 1:2', analysis: ['由梅涅劳斯定理：(BD/DC)×(CE/EA)×(AF/FB) = 1', '(2/1)×(1/1)×(AF/FB) = 1', 'AF/FB = 1/2，即 AF:FB = 1:2'], pitfall: '梅涅劳斯定理：三比乘积为 1（有向线段）', variant: { stem: '梅氏比乘积为 1 的适用前提？', answer: '三点共线', analysis: ['D、E、F 在三角形三边（延长线）上共线'] }, isOlympiad: true, isHot: true, selfTest: false },
    { id: 'oly_q_0022', subject: 'olympiad', type: '解答', kpId: 'oly_kp_0117', difficulty: 3, stem: '圆 O 中，两弦 AB 与 CD 交于圆内一点 P，PA=3，PB=4，PC=2，求 PD。', options: [], answer: 'PD = 6', analysis: ['相交弦定理：PA×PB = PC×PD', '3×4 = 2×PD，PD = 6'], pitfall: '相交弦定理：交点分割的两段乘积相等', variant: { stem: '割线定理：圆外一点 P 引两割线，PA·PB=PC·PD？', answer: '是', analysis: ['统一圆幂定理'] }, isOlympiad: true, isHot: true, selfTest: false },
    { id: 'oly_q_0023', subject: 'olympiad', type: '解答', kpId: 'oly_kp_0113', difficulty: 3, stem: '已知实数 a、b 满足 a² + b² = 1，求 a + b 的最大值。', options: [], answer: '√2', analysis: ['由 (a+b)² = a²+b²+2ab ≤ 2(a²+b²) = 2', 'a+b ≤ √2，当 a=b=√2/2 时取等', '最大值为 √2'], pitfall: '用不等式 (a+b)² ≤ 2(a²+b²)', variant: { stem: 'a+b=1 时 a²+b² 最小值？', answer: '1/2', analysis: ['a²+b² ≥ (a+b)²/2 = 1/2'] }, isOlympiad: true, isHot: false, selfTest: false },
    { id: 'oly_q_0024', subject: 'olympiad', type: '解答', kpId: 'oly_kp_0118', difficulty: 3, stem: '在边长为 1 的正方形 ABCD 内（含边界）找一点 P，使 PA+PB+PC+PD 最小，求最小值。', options: [], answer: '2√2（P 为正方形中心时取到）', analysis: ['由对称性，最小值在中心取得', 'P 为中心时 PA=PB=PC=PD = √2/2', '和 = 4×(√2/2) = 2√2', '可用三角不等式证明中心最优'], pitfall: '对称性+三角不等式证明', variant: { stem: '等边三角形内一点到三顶点距离和最小？', answer: '在中心（重心）取到', analysis: ['费马点，各角 120°'] }, isOlympiad: true, isHot: false, selfTest: false }
  ];

  /* ================= 三、必背清单（16 条，竞赛用） ================= */
  const reciteItems = [
    { id: 'rec_oly_001', subject: 'olympiad', type: '常用结论', content: '唯一分解定理：任何大于 1 的整数可唯一分解为质因数幂的乘积', note: '约数个数 = 各指数+1 的乘积', importance: 5, kpId: 'oly_kp_0102', isOlympiad: true },
    { id: 'rec_oly_002', subject: 'olympiad', type: '常用结论', content: '被 9 整除：各位数字和能被 9 整除；被 11 整除：奇偶位数字和之差', note: '整除判定法', importance: 4, kpId: 'oly_kp_0101', isOlympiad: true },
    { id: 'rec_oly_003', subject: 'olympiad', type: '常用结论', content: '同余：a≡b (mod m) 即 m | (a-b)，同余可加减乘', note: '模运算四则性质', importance: 4, kpId: 'oly_kp_0101', isOlympiad: true },
    { id: 'rec_oly_004', subject: 'olympiad', type: '常用结论', content: '奇偶性：奇±奇=偶，奇×奇=奇；n²+n 恒为偶数', note: '奇偶分析法', importance: 4, kpId: 'oly_kp_0103', isOlympiad: true },
    { id: 'rec_oly_005', subject: 'olympiad', type: '常用结论', content: '完全平方数末位只能是 0,1,4,5,6,9；模 4 余 0 或 1；模 3 余 0 或 1', note: '平方数特征快速判定', importance: 4, kpId: 'oly_kp_0104', isOlympiad: true },
    { id: 'rec_oly_006', subject: 'olympiad', type: '常用结论', content: '抽屉原理：把 n+1 个物体放入 n 个抽屉，必有一个抽屉至少 2 个物体', note: '推广：kn+1 个物体必有抽屉至少 k+1 个', importance: 5, kpId: 'oly_kp_0106', isOlympiad: true },
    { id: 'rec_oly_007', subject: 'olympiad', type: '经典模型', content: '乘法原理（分步相乘）+ 加法原理（分类相加）', note: '计数两大基本原理', importance: 4, kpId: 'oly_kp_0107', isOlympiad: true },
    { id: 'rec_oly_008', subject: 'olympiad', type: '常用结论', content: '因式分解常用技巧：提公因式、公式法、十字相乘、换元、拆项添项、主元法', note: '竞赛代数之基', importance: 5, kpId: 'oly_kp_0110', isOlympiad: true },
    { id: 'rec_oly_009', subject: 'olympiad', type: '经典模型', content: '绝对值三角不等式：|a|-|b| ≤ |a±b| ≤ |a|+|b|', note: '求最值利器', importance: 4, kpId: 'oly_kp_0111', isOlympiad: true },
    { id: 'rec_oly_010', subject: 'olympiad', type: '常用结论', content: '整数根问题：设两根 m、n 整数，用韦达定理 m+n、mn 转整数条件', note: '结合整除与因数分解', importance: 5, kpId: 'oly_kp_0112', isOlympiad: true },
    { id: 'rec_oly_011', subject: 'olympiad', type: '经典模型', content: '均值不等式：a²+b² ≥ 2ab；(a+b)² ≤ 2(a²+b²)', note: 'a=b 时取等', importance: 4, kpId: 'oly_kp_0113', isOlympiad: true },
    { id: 'rec_oly_012', subject: 'olympiad', type: '经典模型', content: '三角形五心：重心（中线交点 2:1）、内心（角平分线）、外心（垂直平分线）、垂心（高线）、旁心', note: '内心到三边等距，外心到三顶点等距', importance: 5, kpId: 'oly_kp_0114', isOlympiad: true },
    { id: 'rec_oly_013', subject: 'olympiad', type: '常用结论', content: '面积法：同高三角形面积比 = 底边比；等底等高等面积', note: '面积比↔线段比', importance: 4, kpId: 'oly_kp_0115', isOlympiad: true },
    { id: 'rec_oly_014', subject: 'olympiad', type: '定理', content: '梅涅劳斯定理：(BD/DC)×(CE/EA)×(AF/FB) = 1（D、E、F 共线）', note: '三点共线 ⇔ 比值乘积为 1', importance: 5, kpId: 'oly_kp_0116', isOlympiad: true },
    { id: 'rec_oly_015', subject: 'olympiad', type: '定理', content: '圆幂定理统一式：过 P 点直线交圆于 A、B，则 PA·PB = |圆幂|（相交弦/割线/切割线）', note: '相交弦 PA·PB=PC·PD；切割线 PA²=PC·PD', importance: 5, kpId: 'oly_kp_0117', isOlympiad: true },
    { id: 'rec_oly_016', subject: 'olympiad', type: '经典模型', content: '费马点：三角形内到三顶点距离和最小的点，各边张角 120°', note: '旋转变换构造', importance: 4, kpId: 'oly_kp_0118', isOlympiad: true }
  ];

  /* ================= 四、思维导图（竞赛拓展分支） ================= */
  const mindmap = {
    id: 'mm_oly_root', subject: 'olympiad', label: '初中奥数（竞赛拓展）', level: 0,
    summary: '数论（整除/同余/不定方程）→ 组合（抽屉/计数/逻辑）→ 代数（因式分解/绝对值/方程）→ 几何（五心/面积/梅塞/圆幂）；四大板块互相渗透',
    formulas: ['rec_oly_001', 'rec_oly_006', 'rec_oly_010', 'rec_oly_012', 'rec_oly_014', 'rec_oly_015', 'rec_oly_016'],
    children: [
      { id: 'mm_oly_1', subject: 'olympiad', label: '数论', level: 1, children: [
        { id: 'mm_oly_1_1', label: '整除与同余', level: 2, children: [
          { id: 'mm_oly_1_1_1', label: '整除判定与同余性质', level: 3, type: '概念', star: true, howToTest: '求余数选择/填空', kpId: 'oly_kp_0101' },
          { id: 'mm_oly_1_1_2', label: '质数与约数个数', level: 3, type: '概念', howToTest: '分解质因数求约数个数', kpId: 'oly_kp_0102' }
        ]},
        { id: 'mm_oly_1_2', label: '奇偶与平方数', level: 2, children: [
          { id: 'mm_oly_1_2_1', label: '奇偶分析', level: 3, type: '概念', howToTest: '连续整数乘积必为偶数', kpId: 'oly_kp_0103' },
          { id: 'mm_oly_1_2_2', label: '完全平方数特征', level: 3, type: '概念', howToTest: '末位/模特征快速判定', kpId: 'oly_kp_0104' }
        ]},
        { id: 'mm_oly_1_3', label: '不定方程', level: 2, children: [
          { id: 'mm_oly_1_3_1', label: '因式分解法求解', level: 3, type: '综合', star: true, howToTest: 'x²-y²=15 类整数解问题', kpId: 'oly_kp_0105' }
        ]}
      ]},
      { id: 'mm_oly_2', subject: 'olympiad', label: '组合', level: 1, children: [
        { id: 'mm_oly_2_1', label: '抽屉原理', level: 2, children: [
          { id: 'mm_oly_2_1_1', label: '抽屉构造与"保证至少"', level: 3, type: '概念', star: true, howToTest: '13 苹果 4 抽屉类问题', kpId: 'oly_kp_0106' }
        ]},
        { id: 'mm_oly_2_2', label: '计数', level: 2, children: [
          { id: 'mm_oly_2_2_1', label: '加法/乘法原理', level: 3, type: '概念', howToTest: '路径计数/搭配问题', kpId: 'oly_kp_0107' },
          { id: 'mm_oly_2_2_2', label: '组合最值与构造', level: 3, type: '综合', star: true, howToTest: '极端原理+构造证明', kpId: 'oly_kp_0108' }
        ]},
        { id: 'mm_oly_2_3', label: '逻辑推理', level: 2, children: [
          { id: 'mm_oly_2_3_1', label: '假设法/反证法', level: 3, type: '概念', howToTest: '真假话推理', kpId: 'oly_kp_0109' }
        ]}
      ]},
      { id: 'mm_oly_3', subject: 'olympiad', label: '代数', level: 1, children: [
        { id: 'mm_oly_3_1', label: '因式分解', level: 2, children: [
          { id: 'mm_oly_3_1_1', label: '换元/拆项/主元法', level: 3, type: '概念', star: true, howToTest: '高次式分解', kpId: 'oly_kp_0110' }
        ]},
        { id: 'mm_oly_3_2', label: '绝对值', level: 2, children: [
          { id: 'mm_oly_3_2_1', label: '零点分段与三角不等式', level: 3, type: '概念', howToTest: '含绝对值不等式与最值', kpId: 'oly_kp_0111' }
        ]},
        { id: 'mm_oly_3_3', label: '方程与函数', level: 2, children: [
          { id: 'mm_oly_3_3_1', label: '整数根与根的分布', level: 3, type: '综合', star: true, howToTest: '韦达定理转整数问题', kpId: 'oly_kp_0112' },
          { id: 'mm_oly_3_3_2', label: '构造方程/函数最值', level: 3, type: '综合', howToTest: 'a²+b²=1 求 a+b 最值', kpId: 'oly_kp_0113' }
        ]}
      ]},
      { id: 'mm_oly_4', subject: 'olympiad', label: '几何', level: 1, children: [
        { id: 'mm_oly_4_1', label: '三角形五心', level: 2, children: [
          { id: 'mm_oly_4_1_1', label: '重心/内心/外心/垂心', level: 3, type: '概念', howToTest: '五心定义辨析', kpId: 'oly_kp_0114' }
        ]},
        { id: 'mm_oly_4_2', label: '面积法', level: 2, children: [
          { id: 'mm_oly_4_2_1', label: '等积变换与面积比', level: 3, type: '概念', howToTest: '面积比求线段比', kpId: 'oly_kp_0115' }
        ]},
        { id: 'mm_oly_4_3', label: '比例定理', level: 2, children: [
          { id: 'mm_oly_4_3_1', label: '梅涅劳斯/塞瓦', level: 3, type: '定理', star: true, howToTest: '三点共线比例问题', kpId: 'oly_kp_0116' },
          { id: 'mm_oly_4_3_2', label: '圆幂定理', level: 3, type: '定理', star: true, howToTest: 'PA·PB=PC·PD 求线段', kpId: 'oly_kp_0117' }
        ]},
        { id: 'mm_oly_4_4', label: '最值', level: 2, children: [
          { id: 'mm_oly_4_4_1', label: '费马点与旋转变换', level: 3, type: '综合', howToTest: '到三顶点距离和最小', kpId: 'oly_kp_0118' }
        ]}
      ]}
    ]
  };

  return {
    knowledgePoints: knowledgePoints,
    hotTop10: hotTop10,
    easyMistakes: easyMistakes,
    questions: questions,
    reciteItems: reciteItems,
    mindmap: mindmap,
    prediction: null
  };
})();

/* 数据自检 */
(function () {
  const d = window.DATA.olympiad;
  console.log('[DATA] olympiad loaded, kps=' + d.knowledgePoints.length + ', questions=' + d.questions.length +
    ' (all isOlympiad=' + d.questions.every(q => q.isOlympiad === true) + '), recite=' + d.reciteItems.length +
    ', hotTop10=' + d.hotTop10.length);
})();
