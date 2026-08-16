/* ============================================================
   data-math.js —— 数学数据（window.DATA.math）
   职责：考点库 / 题库 / 必背清单 / 思维导图 / 2027 预测
   覆盖：人教版七上→九下 6 册；对标广州中考 2027（150 分 / 23 题）
   依赖：无（纯数据，不碰 DOM）；store.js 加载后可被 DataCenter 读取
   ============================================================ */

window.DATA = window.DATA || {};
window.DATA.math = (function () {

  /* ================= 一、考点库（44 个，覆盖 6 册） ================= */
  const knowledgePoints = [
    { id: 'math_kp_0101', subject: 'math', name: '有理数及其运算', board: '数与式', grade: '七年级', volume: '七上', chapter: '第1章 有理数', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空', '解答'], tags: ['必会'], hotRank: null, desc: '正负数、相反数、绝对值、有理数四则运算与混合运算、乘方', examHint: '通常以计算题形式出现，注意符号与运算顺序', relatedIds: ['math_kp_0102', 'math_kp_0103'] },
    { id: 'math_kp_0102', subject: 'math', name: '数轴、相反数与绝对值', board: '数与式', grade: '七年级', volume: '七上', chapter: '第1章 有理数', frequency: 3, difficulty: '基础', questionTypes: ['选择', '填空'], tags: ['必会', '易错'], hotRank: 9, desc: '数轴三要素、相反数、绝对值几何意义（|a-b| 表示距离）', examHint: '常考绝对值化简与数轴综合，注意非负性', relatedIds: ['math_kp_0101'] },
    { id: 'math_kp_0103', subject: 'math', name: '科学记数法与近似数', board: '数与式', grade: '七年级', volume: '七上', chapter: '第1章 有理数', frequency: 1, difficulty: '基础', questionTypes: ['选择', '填空'], tags: ['必会'], hotRank: null, desc: '用科学记数法表示大数/小数（a×10ⁿ，1≤|a|<10），精确度', examHint: '2026 以新能源数据为背景考查', relatedIds: ['math_kp_0101'] },
    { id: 'math_kp_0104', subject: 'math', name: '整式及其加减运算', board: '数与式', grade: '七年级', volume: '七上', chapter: '第2章 整式的加减', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空', '解答'], tags: ['必会'], hotRank: null, desc: '单项式/多项式、同类项合并、去括号法则', examHint: '化简求值题高频，注意去括号变号', relatedIds: ['math_kp_0105'] },
    { id: 'math_kp_0105', subject: 'math', name: '整式乘除与因式分解', board: '数与式', grade: '八年级', volume: '八上', chapter: '第14章 整式的乘法与因式分解', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['必会', '常考变形'], hotRank: 7, desc: '幂的运算、乘法公式（完全平方/平方差）、提公因式与公式法因式分解', examHint: '因式分解必考，常与分式化简结合', relatedIds: ['math_kp_0104', 'math_kp_0109'] },
    { id: 'math_kp_0106', subject: 'math', name: '一元一次方程及其应用', board: '方程与不等式', grade: '七年级', volume: '七上', chapter: '第3章 一元一次方程', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空', '解答'], tags: ['必会'], hotRank: null, desc: '等式性质、解一元一次方程、行程/工程/销售等应用题', examHint: '常考配套问题与方案选择', relatedIds: ['math_kp_0107'] },
    { id: 'math_kp_0107', subject: 'math', name: '二元一次方程组', board: '方程与不等式', grade: '七年级', volume: '七下', chapter: '第8章 二元一次方程组', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空', '解答'], tags: ['必会'], hotRank: null, desc: '代入消元法、加减消元法、鸡兔同笼类应用题', examHint: '常与一次函数综合考查', relatedIds: ['math_kp_0106', 'math_kp_0223'] },
    { id: 'math_kp_0108', subject: 'math', name: '不等式（组）的解法与应用', board: '方程与不等式', grade: '七年级', volume: '七下', chapter: '第9章 不等式与不等式组', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['必会', '常考变形'], hotRank: null, desc: '不等式性质、解一元一次不等式（组）、数轴表示解集、方案设计', examHint: '常与一次函数、方案设计结合', relatedIds: ['math_kp_0106', 'math_kp_0224'] },
    { id: 'math_kp_0109', subject: 'math', name: '分式及其运算', board: '数与式', grade: '八年级', volume: '八上', chapter: '第15章 分式', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空', '解答'], tags: ['必会', '易错'], hotRank: null, desc: '分式有意义条件、基本性质、四则运算、化简求值', examHint: '注意分母不为 0，先化简再代入求值', relatedIds: ['math_kp_0105'] },
    { id: 'math_kp_0110', subject: 'math', name: '分式方程及其应用', board: '方程与不等式', grade: '八年级', volume: '八上', chapter: '第15章 分式', frequency: 2, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['常考变形'], hotRank: null, desc: '解分式方程（必验根）、工程/行程类应用', examHint: '增根检验是高频易错点', relatedIds: ['math_kp_0109'] },
    { id: 'math_kp_0111', subject: 'math', name: '实数、平方根与立方根', board: '数与式', grade: '七年级', volume: '七下', chapter: '第6章 实数', frequency: 3, difficulty: '基础', questionTypes: ['选择', '填空'], tags: ['必会'], hotRank: null, desc: '平方根/算术平方根/立方根、无理数概念、实数运算', examHint: '2027 分值提升后计算量或增大，注意估算', relatedIds: ['math_kp_0112'] },
    { id: 'math_kp_0112', subject: 'math', name: '二次根式及其运算', board: '数与式', grade: '八年级', volume: '八下', chapter: '第16章 二次根式', frequency: 3, difficulty: '基础', questionTypes: ['选择', '填空', '解答'], tags: ['必会', '易错'], hotRank: null, desc: '二次根式有意义的条件、性质、化简与四则运算（分母有理化）', examHint: '非负性条件 √a（a≥0）是易错点', relatedIds: ['math_kp_0111'] },
    { id: 'math_kp_0113', subject: 'math', name: '几何图形初步（线段与角）', board: '几何', grade: '七年级', volume: '七上', chapter: '第4章 几何图形初步', frequency: 1, difficulty: '基础', questionTypes: ['选择', '填空'], tags: [], hotRank: null, desc: '直线射线线段、中点、角平分线、余角补角、方位角', examHint: '以基础概念题为主', relatedIds: ['math_kp_0114'] },
    { id: 'math_kp_0114', subject: 'math', name: '相交线与平行线', board: '几何', grade: '七年级', volume: '七下', chapter: '第5章 相交线与平行线', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空', '解答'], tags: ['必会'], hotRank: null, desc: '对顶角、垂线、同位角/内错角/同旁内角、平行线判定与性质、平移', examHint: '常考平行线性质求角度', relatedIds: ['math_kp_0113'] },
    { id: 'math_kp_0115', subject: 'math', name: '三角形内角和与三边关系', board: '几何', grade: '八年级', volume: '八上', chapter: '第11章 三角形', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空'], tags: ['必会'], hotRank: null, desc: '三角形三边关系、内角和 180°、外角性质、多边形内角和', examHint: '常与平行线、角平分线结合', relatedIds: ['math_kp_0116'] },
    { id: 'math_kp_0116', subject: 'math', name: '全等三角形的判定与性质', board: '几何', grade: '八年级', volume: '八上', chapter: '第12章 全等三角形', frequency: 4, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['必会', '常考变形'], hotRank: 4, desc: 'SSS/SAS/ASA/AAS/HL 五种判定、全等性质证明线段角相等', examHint: '几何证明题基础，常与等腰/等边结合', relatedIds: ['math_kp_0117', 'math_kp_0334'] },
    { id: 'math_kp_0117', subject: 'math', name: '等腰三角形与等边三角形', board: '几何', grade: '八年级', volume: '八上', chapter: '第13章 轴对称', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['必会'], hotRank: null, desc: '等腰三角形性质（等边对等角、三线合一）、判定；等边三角形性质', examHint: '常与全等、动点问题结合', relatedIds: ['math_kp_0116', 'math_kp_0118'] },
    { id: 'math_kp_0118', subject: 'math', name: '轴对称与轴对称图形', board: '几何', grade: '八年级', volume: '八上', chapter: '第13章 轴对称', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空'], tags: [], hotRank: null, desc: '轴对称概念、线段垂直平分线性质、画对称图形', examHint: '与旋转/中心对称区分（2026 旋转对称新题型）', relatedIds: ['math_kp_0230', 'math_kp_0341'] },
    { id: 'math_kp_0119', subject: 'math', name: '勾股定理及其逆定理', board: '几何', grade: '八年级', volume: '八下', chapter: '第17章 勾股定理', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['必会', '常考变形'], hotRank: null, desc: '勾股定理、逆定理、勾股数、最短路径（展开图）', examHint: '常与坐标系、动点、折叠结合，2027 或加大分值', relatedIds: ['math_kp_0120'] },
    { id: 'math_kp_0120', subject: 'math', name: '平行四边形', board: '几何', grade: '八年级', volume: '八下', chapter: '第18章 平行四边形', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['必会'], hotRank: null, desc: '平行四边形的性质与判定、三角形中位线', examHint: '常与全等、坐标系综合', relatedIds: ['math_kp_0121'] },
    { id: 'math_kp_0121', subject: 'math', name: '矩形、菱形、正方形', board: '几何', grade: '八年级', volume: '八下', chapter: '第18章 平行四边形', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['必会', '易错'], hotRank: null, desc: '特殊平行四边形的性质判定、对角线关系、面积', examHint: '判定条件易混，注意从边/角/对角线多角度辨析', relatedIds: ['math_kp_0120'] },
    { id: 'math_kp_0122', subject: 'math', name: '平面直角坐标系', board: '函数', grade: '七年级', volume: '七下', chapter: '第7章 平面直角坐标系', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空'], tags: ['必会'], hotRank: null, desc: '坐标表示点、象限、对称点坐标、平移与坐标变化', examHint: '常作为函数题载体', relatedIds: ['math_kp_0223'] },
    { id: 'math_kp_0223', subject: 'math', name: '一次函数的图象与性质', board: '函数', grade: '八年级', volume: '八下', chapter: '第19章 一次函数', frequency: 4, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['必会', '常考变形'], hotRank: 5, desc: '一次函数定义、k/b 的几何意义、图象平移、待定系数法', examHint: '2027 中档解答题高频，常与方程/不等式结合', relatedIds: ['math_kp_0224', 'math_kp_0122'] },
    { id: 'math_kp_0224', subject: 'math', name: '一次函数与方程、不等式', board: '函数', grade: '八年级', volume: '八下', chapter: '第19章 一次函数', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['常考变形'], hotRank: null, desc: '一次函数与二元一次方程组、一元一次不等式的联系（交点/上下）', examHint: '图象法解不等式是热点', relatedIds: ['math_kp_0223', 'math_kp_0108'] },
    { id: 'math_kp_0225', subject: 'math', name: '反比例函数', board: '函数', grade: '九年级', volume: '九下', chapter: '第26章 反比例函数', frequency: 4, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['必会', '常考变形'], hotRank: 6, desc: '反比例函数图象性质、k 的几何意义（|k| 面积）、与一次函数综合', examHint: '与一次函数交点、面积问题是高频解答题', relatedIds: ['math_kp_0223'] },
    { id: 'math_kp_0226', subject: 'math', name: '一元二次方程及其解法', board: '方程与不等式', grade: '九年级', volume: '九上', chapter: '第21章 一元二次方程', frequency: 3, difficulty: '基础', questionTypes: ['选择', '填空', '解答'], tags: ['必会'], hotRank: null, desc: '直接开平方法/配方法/公式法/因式分解法、判别式 Δ', examHint: '选合适方法求解，Δ 判断根的情况', relatedIds: ['math_kp_0227'] },
    { id: 'math_kp_0227', subject: 'math', name: '一元二次方程的应用（韦达定理）', board: '方程与不等式', grade: '九年级', volume: '九上', chapter: '第21章 一元二次方程', frequency: 4, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['必会', '常考变形'], hotRank: 8, desc: '增长率/传播/面积问题；根与系数关系 x₁+x₂=-b/a，x₁x₂=c/a', examHint: '分值提升后题量或扩大，增长率问题是高频情境', relatedIds: ['math_kp_0226'] },
    { id: 'math_kp_0228', subject: 'math', name: '二次函数的图象与性质', board: '函数', grade: '九年级', volume: '九上', chapter: '第22章 二次函数', frequency: 5, difficulty: '压轴', questionTypes: ['选择', '填空', '解答'], tags: ['必会', '易错', '常考变形'], hotRank: 1, desc: '一般式/顶点式/交点式、开口对称轴顶点、增减性最值', examHint: '广州近年压轴恒定考点，2027 必考', relatedIds: ['math_kp_0229', 'math_kp_0223'] },
    { id: 'math_kp_0229', subject: 'math', name: '二次函数综合（最值/动点/存在性）', board: '函数', grade: '九年级', volume: '九上', chapter: '第22章 二次函数', frequency: 5, difficulty: '压轴', questionTypes: ['解答'], tags: ['必会', '压轴', '常考变形'], hotRank: 2, desc: '二次函数与几何综合：动点最值、面积、等腰/直角/平行四边形存在性', examHint: '2027 压轴第23题 14 分几乎锁定，需分类讨论', relatedIds: ['math_kp_0228', 'math_kp_0339'] },
    { id: 'math_kp_0230', subject: 'math', name: '旋转与几何变换', board: '几何', grade: '九年级', volume: '九上', chapter: '第23章 旋转', frequency: 4, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['必会', '常考变形'], hotRank: 10, desc: '旋转三要素、中心对称、旋转 90°/180° 作图与坐标变换', examHint: '2026 第23题"旋转对称图形"新题型，2027 趋势延续', relatedIds: ['math_kp_0118'] },
    { id: 'math_kp_0231', subject: 'math', name: '圆的基本性质', board: '几何', grade: '九年级', volume: '九上', chapter: '第24章 圆', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['必会'], hotRank: null, desc: '垂径定理、弧弦圆心角关系、圆周角定理及推论', examHint: '圆周角与圆心角互推是核心', relatedIds: ['math_kp_0232'] },
    { id: 'math_kp_0232', subject: 'math', name: '与圆有关的位置关系（切线）', board: '几何', grade: '九年级', volume: '九上', chapter: '第24章 圆', frequency: 4, difficulty: '压轴', questionTypes: ['选择', '填空', '解答'], tags: ['必会', '常考变形'], hotRank: null, desc: '点/直线与圆位置关系、切线判定与性质、切线长定理、内切外接', examHint: '切线证明与计算是广州解答题常客', relatedIds: ['math_kp_0231', 'math_kp_0233'] },
    { id: 'math_kp_0233', subject: 'math', name: '圆与相似综合', board: '几何', grade: '九年级', volume: '九上/九下', chapter: '第24章 圆 + 第27章 相似', frequency: 5, difficulty: '压轴', questionTypes: ['解答'], tags: ['必会', '压轴'], hotRank: 3, desc: '圆中相似模型（射影型/共角型）、切线+相似求线段、圆中比例', examHint: '压轴第二大主力，几何证明深化方向', relatedIds: ['math_kp_0232', 'math_kp_0334'] },
    { id: 'math_kp_0334', subject: 'math', name: '相似三角形的判定与性质', board: '几何', grade: '九年级', volume: '九下', chapter: '第27章 相似', frequency: 4, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['必会', '常考变形'], hotRank: null, desc: '相似判定（AA/SAS/SSS）、性质（对应边成比例、面积比=相似比²）、A字/8字模型', examHint: '与圆、动点结合难度上升', relatedIds: ['math_kp_0116', 'math_kp_0335'] },
    { id: 'math_kp_0335', subject: 'math', name: '锐角三角函数与解直角三角形', board: '几何', grade: '九年级', volume: '九下', chapter: '第28章 锐角三角函数', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['必会', '常考变形'], hotRank: null, desc: 'sin/cos/tan 定义、特殊角三角函数值、解直角三角形（测高测距）', examHint: '常以实际情境（塔高/楼距）考查，广州地标情境热门', relatedIds: ['math_kp_0119'] },
    { id: 'math_kp_0336', subject: 'math', name: '数据的收集、整理与描述', board: '统计概率', grade: '七年级', volume: '七下', chapter: '第10章 数据的收集、整理与描述', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空', '解答'], tags: ['必会'], hotRank: null, desc: '全面调查/抽样调查、条形图/扇形图/折线图、频数分布直方图', examHint: '常与统计图表阅读结合（新能源数据情境）', relatedIds: ['math_kp_0337'] },
    { id: 'math_kp_0337', subject: 'math', name: '数据的分析（平均数、方差）', board: '统计概率', grade: '八年级', volume: '八下', chapter: '第20章 数据的分析', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空', '解答'], tags: ['必会'], hotRank: null, desc: '加权平均数、中位数、众数、方差（稳定性）', examHint: '方差比较稳定性是常考选择题', relatedIds: ['math_kp_0336'] },
    { id: 'math_kp_0338', subject: 'math', name: '概率初步', board: '统计概率', grade: '九年级', volume: '九上', chapter: '第25章 概率初步', frequency: 3, difficulty: '基础', questionTypes: ['选择', '填空', '解答'], tags: ['必会'], hotRank: null, desc: '随机事件、列举法求概率（列表/树状图）、用频率估计概率', examHint: '两步试验用树状图列表是标准解法', relatedIds: ['math_kp_0336'] },
    { id: 'math_kp_0339', subject: 'math', name: '几何动点与最值问题', board: '几何', grade: '八年级/九年级', volume: '八下/九上', chapter: '综合（三角形/四边形/函数）', frequency: 5, difficulty: '压轴', questionTypes: ['填空', '解答'], tags: ['压轴', '常考变形'], hotRank: null, desc: '动点轨迹、将军饮马、垂线段最短、二次函数最值求几何最值', examHint: '2026 命题"探究性"强化方向，2027 或作为填空压轴', relatedIds: ['math_kp_0229', 'math_kp_0119'] },
    { id: 'math_kp_0340', subject: 'math', name: '投影与视图', board: '几何', grade: '九年级', volume: '九下', chapter: '第29章 投影与视图', frequency: 1, difficulty: '基础', questionTypes: ['选择'], tags: [], hotRank: null, desc: '平行投影/中心投影、三视图（主/左/俯）', examHint: '三视图判断以选择题出现', relatedIds: ['math_kp_0113'] },
    { id: 'math_kp_0341', subject: 'math', name: '图形折叠与翻折', board: '几何', grade: '八年级/九年级', volume: '八上/九上', chapter: '综合（轴对称/勾股）', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '解答'], tags: ['常考变形'], hotRank: null, desc: '折叠前后图形全等、折痕为对称轴、利用勾股列方程求线段', examHint: '折叠+勾股设未知数是经典解法', relatedIds: ['math_kp_0119', 'math_kp_0118'] },
    { id: 'math_kp_0342', subject: 'math', name: '统计与概率综合（跨学科情境）', board: '统计概率', grade: '九年级', volume: '九上/九下', chapter: '综合', frequency: 3, difficulty: '中档', questionTypes: ['解答'], tags: ['常考变形'], hotRank: null, desc: '以现实数据为背景的统计图表分析与概率计算综合', examHint: '2027 新增"跨学科情境"考查载体', relatedIds: ['math_kp_0338', 'math_kp_0336'] },
    { id: 'math_kp_0343', subject: 'math', name: '新定义与阅读理解型问题', board: '综合', grade: '九年级', volume: '九下', chapter: '综合', frequency: 2, difficulty: '压轴', questionTypes: ['解答'], tags: ['压轴'], hotRank: null, desc: '现场学习新定义运算/新概念图形，理解后应用', examHint: '2026 起开放探究性设问增多', relatedIds: ['math_kp_0229'] },
    { id: 'math_kp_0344', subject: 'math', name: '分类讨论思想', board: '综合', grade: '九年级', volume: '九上/九下', chapter: '综合', frequency: 3, difficulty: '压轴', questionTypes: ['填空', '解答'], tags: ['压轴'], hotRank: null, desc: '按参数/位置/图形形状分类讨论（等腰三角形、绝对值、动点）', examHint: '几何动点多解是填空压轴常客', relatedIds: ['math_kp_0229', 'math_kp_0339'] }
  ];

  /* 高频 Top10（按 frequency 降序，hotRank 升序） */
  const hotTop10 = knowledgePoints
    .filter(k => k.frequency >= 3)
    .sort((a, b) => (b.frequency - a.frequency) || ((a.hotRank || 99) - (b.hotRank || 99)))
    .slice(0, 10);

  /* 易错清单（tags 含"易错"聚合） */
  const easyMistakes = knowledgePoints
    .filter(k => k.tags.indexOf('易错') !== -1)
    .map(k => ({ id: k.id, title: k.name, advice: k.examHint }));

  /* ================= 二、题库（54 题：选择 20 / 填空 14 / 解答 20） =================
     难度分布：基础 32（约60%）/ 中档 14（约25%）/ 压轴 8（约15%） */
  const questions = [
    /* ---------- 选择题（难度 1） ---------- */
    { id: 'math_q_0001', subject: 'math', type: '选择', kpId: 'math_kp_0102', difficulty: 1, stem: '-2 的相反数是（　）', options: ['A．2', 'B．-2', 'C．1/2', 'D．-1/2'], answer: 'A', analysis: ['相反数：只有符号不同的两个数互为相反数', '-2 的相反数是 2，选 A'], pitfall: '不要把相反数与倒数混淆', variant: { stem: '-3 的绝对值是（　）', answer: '3', analysis: ['绝对值表示数轴上的点到原点的距离', '|-3| = 3'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'math_q_0002', subject: 'math', type: '选择', kpId: 'math_kp_0101', difficulty: 1, stem: '计算：(-2) + 5 的结果是（　）', options: ['A．-7', 'B．-3', 'C．3', 'D．7'], answer: 'C', analysis: ['异号两数相加，取绝对值较大数的符号，并用较大的绝对值减去较小的绝对值', '5 - 2 = 3，选 C'], pitfall: '注意符号：绝对值大的数 5 为正，结果为正', variant: { stem: '计算：(-3) - (-2) = ?', answer: '-1', analysis: ['减去一个数等于加上它的相反数', '(-3) + 2 = -1'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'math_q_0003', subject: 'math', type: '选择', kpId: 'math_kp_0103', difficulty: 1, stem: '2026 年我国新能源汽车年产量约 1300 万辆，用科学记数法表示 1300 万为（　）', options: ['A．1.3×10⁷', 'B．13×10⁶', 'C．1.3×10⁶', 'D．0.13×10⁸'], answer: 'A', analysis: ['1300 万 = 13000000 = 1.3×10⁷', '选 A'], pitfall: '万 = 10⁴，注意单位换算', variant: { stem: '用科学记数法表示 0.000086', answer: '8.6×10⁻⁵', analysis: ['小数点向右移 5 位，指数为 -5'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'math_q_0004', subject: 'math', type: '选择', kpId: 'math_kp_0104', difficulty: 1, stem: '下列运算正确的是（　）', options: ['A．3a + 2b = 5ab', 'B．a²·a³ = a⁶', 'C．(a²)³ = a⁶', 'D．a⁶÷a² = a³'], answer: 'C', analysis: ['A 不是同类项不能合并', 'B 同底数幂相乘指数相加：a²·a³ = a⁵', 'C 幂的乘方指数相乘：(a²)³ = a⁶ ✓', 'D 同底数幂相除指数相减：a⁶÷a² = a⁴'], pitfall: '幂的运算三法则易混：同底相乘加指数、幂的乘方乘指数、同底相除减指数', variant: { stem: '计算 a⁵ ÷ a² 的结果是（　）', answer: 'a³', analysis: ['同底数幂相除，底数不变指数相减：5-2=3'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'math_q_0005', subject: 'math', type: '选择', kpId: 'math_kp_0105', difficulty: 1, stem: '下列因式分解正确的是（　）', options: ['A．x² - 4 = (x-2)²', 'B．x² + 2x + 1 = (x+1)²', 'C．x² - 2x = x(x-2)+2x', 'D．x² + 4 = (x+2)(x-2)'], answer: 'B', analysis: ['A 应为 x²-4 = (x+2)(x-2)', 'B 完全平方公式：(x+1)² = x²+2x+1 ✓', 'C 应提公因式 x(x-2)', 'D x²+4 在实数范围不能分解'], pitfall: '平方差与完全平方公式要区分', variant: { stem: '因式分解：x² - 6x + 9', answer: '(x-3)²', analysis: ['完全平方公式：x²-6x+9 = x²-2·3x+3² = (x-3)²'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'math_q_0006', subject: 'math', type: '选择', kpId: 'math_kp_0106', difficulty: 1, stem: '解方程 2x - 3 = x + 5，x 的值为（　）', options: ['A．2', 'B．6', 'C．8', 'D．-8'], answer: 'C', analysis: ['移项：2x - x = 5 + 3', 'x = 8，选 C'], pitfall: '移项要变号', variant: { stem: '解方程 3x + 1 = 7', answer: 'x = 2', analysis: ['3x = 6，x = 2'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'math_q_0007', subject: 'math', type: '选择', kpId: 'math_kp_0111', difficulty: 1, stem: '√16 的值是（　）', options: ['A．4', 'B．±4', 'C．-4', 'D．2'], answer: 'A', analysis: ['√16 表示 16 的算术平方根，为正数', '√16 = 4，选 A'], pitfall: '√a 表示算术平方根（非负），±√a 才表示两个平方根', variant: { stem: '计算 √9 + ∛27', answer: '6', analysis: ['√9 = 3，∛27 = 3，和为 6'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'math_q_0008', subject: 'math', type: '选择', kpId: 'math_kp_0112', difficulty: 1, stem: '若 √(x-2) 有意义，则 x 的取值范围是（　）', options: ['A．x > 2', 'B．x ≥ 2', 'C．x < 2', 'D．x ≤ 2'], answer: 'B', analysis: ['被开方数需非负：x - 2 ≥ 0', 'x ≥ 2，选 B'], pitfall: '注意取等号：x = 2 时有意义', variant: { stem: '若 √(3-x) 有意义，则 x ≤ ?', answer: 'x ≤ 3', analysis: ['3 - x ≥ 0，得 x ≤ 3'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'math_q_0009', subject: 'math', type: '选择', kpId: 'math_kp_0114', difficulty: 1, stem: '如图，直线 a∥b，∠1 = 50°，则 ∠2 的度数为（　）', options: ['A．40°', 'B．50°', 'C．130°', 'D．140°'], answer: 'B', analysis: ['两直线平行，同位角相等', '∠2 与 ∠1 为同位角，∠2 = 50°'], pitfall: '区分同位角/内错角/同旁内角的互补关系', variant: { stem: '直线 a∥b，∠1=50°，则 ∠3（同旁内角）为？', answer: '130°', analysis: ['两直线平行，同旁内角互补：180°-50°=130°'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'math_q_0010', subject: 'math', type: '选择', kpId: 'math_kp_0115', difficulty: 1, stem: '下列长度的三条线段能组成三角形的是（　）', options: ['A．1, 2, 3', 'B．2, 2, 5', 'C．3, 4, 5', 'D．1, 2, 4'], answer: 'C', analysis: ['三角形任意两边之和大于第三边', 'A: 1+2=3 不行；B: 2+2=4<5 不行；C: 3+4>5 ✓；D: 1+2=3<4 不行'], pitfall: '用较小的两边之和与最大边比较即可', variant: { stem: '下列能组成三角形的是（　）', answer: '2, 3, 4', analysis: ['2+3=5>4，可以'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'math_q_0011', subject: 'math', type: '选择', kpId: 'math_kp_0122', difficulty: 1, stem: '点 P(-2, 3) 关于 y 轴对称的点的坐标是（　）', options: ['A．(2, 3)', 'B．(-2, -3)', 'C．(2, -3)', 'D．(-2, 3)'], answer: 'A', analysis: ['关于 y 轴对称，横坐标变号，纵坐标不变', '(-2, 3) → (2, 3)，选 A'], pitfall: '关于 x 轴对称纵坐标变号，关于 y 轴对称横坐标变号', variant: { stem: '点 P(-2, 3) 关于原点对称的坐标？', answer: '(2, -3)', analysis: ['关于原点对称，横纵坐标都变号'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'math_q_0012', subject: 'math', type: '选择', kpId: 'math_kp_0226', difficulty: 1, stem: '一元二次方程 x² - 4x + 3 = 0 的解为（　）', options: ['A．x₁=1, x₂=3', 'B．x₁=-1, x₂=-3', 'C．x₁=1, x₂=-3', 'D．x₁=-1, x₂=3'], answer: 'A', analysis: ['因式分解：(x-1)(x-3) = 0', 'x₁ = 1，x₂ = 3，选 A'], pitfall: '十字相乘时注意符号', variant: { stem: '解方程 x² - 5x + 6 = 0', answer: 'x₁=2, x₂=3', analysis: ['(x-2)(x-3)=0，x₁=2，x₂=3'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'math_q_0013', subject: 'math', type: '选择', kpId: 'math_kp_0338', difficulty: 1, stem: '一个不透明袋子中装有 2 个红球、3 个白球，这些球除颜色外无差别。随机摸出一个球，摸到红球的概率是（　）', options: ['A．1/5', 'B．2/5', 'C．3/5', 'D．2/3'], answer: 'B', analysis: ['总共 5 个球，红球 2 个', 'P(红) = 2/5，选 B'], pitfall: '注意总球数要数对', variant: { stem: '袋中 1 红 4 蓝，摸到蓝球的概率？', answer: '4/5', analysis: ['蓝球 4 个，总共 5 个，P = 4/5'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'math_q_0014', subject: 'math', type: '选择', kpId: 'math_kp_0336', difficulty: 1, stem: '要了解某校 2000 名学生的视力情况，从中抽取 200 名学生进行测量。这次调查中，样本容量是（　）', options: ['A．2000', 'B．200', 'C．2000 名学生', 'D．200 名学生'], answer: 'B', analysis: ['样本容量是样本中个体的数目，是一个数', '抽取 200 名学生，样本容量为 200，选 B'], pitfall: '样本容量不含单位', variant: { stem: '调查 500 名学生中抽 50 名，样本容量是？', answer: '50', analysis: ['样本容量为抽取个体数 50'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'math_q_0015', subject: 'math', type: '选择', kpId: 'math_kp_0228', difficulty: 1, stem: '抛物线 y = (x-1)² + 2 的顶点坐标是（　）', options: ['A．(1, 2)', 'B．(-1, 2)', 'C．(1, -2)', 'D．(-1, -2)'], answer: 'A', analysis: ['顶点式 y = a(x-h)² + k 的顶点为 (h, k)', '此处 h=1, k=2，顶点 (1, 2)，选 A'], pitfall: '顶点式括号内是 (x-h)，x-1 即 h=1', variant: { stem: '抛物线 y = -(x+3)² - 1 的顶点坐标？', answer: '(-3, -1)', analysis: ['y = a(x-h)²+k，(x+3)² 即 h=-3，k=-1'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'math_q_0016', subject: 'math', type: '选择', kpId: 'math_kp_0225', difficulty: 1, stem: '反比例函数 y = 3/x 的图象经过点（　）', options: ['A．(1, 3)', 'B．(3, 1)', 'C．(-1, -3)', 'D．以上都对'], answer: 'D', analysis: ['反比例函数 y = k/x 图象上的点满足 xy = k', 'A: 1×3=3 ✓；B: 3×1=3 ✓；C: (-1)×(-3)=3 ✓', '故选 D'], pitfall: '验证点是否在函数图象上代入即可', variant: { stem: '反比例函数 y = 6/x 图象是否经过点 (2, 3)？', answer: '是', analysis: ['2×3=6，满足 xy=k，故经过'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'math_q_0017', subject: 'math', type: '选择', kpId: 'math_kp_0231', difficulty: 1, stem: '如图，A、B、C 在 ⊙O 上，∠AOB = 80°，则 ∠ACB 的度数为（　）', options: ['A．20°', 'B．40°', 'C．80°', 'D．160°'], answer: 'B', analysis: ['圆周角定理：同弧所对圆周角等于圆心角的一半', '∠ACB = 1/2 × 80° = 40°，选 B'], pitfall: '圆周角是圆心角的一半，不是相等', variant: { stem: '∠AOB=100°，同弧圆周角 ∠ACB = ?', answer: '50°', analysis: ['100° ÷ 2 = 50°'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'math_q_0018', subject: 'math', type: '选择', kpId: 'math_kp_0335', difficulty: 1, stem: 'sin30° 的值是（　）', options: ['A．0', 'B．1/2', 'C．√2/2', 'D．√3/2'], answer: 'B', analysis: ['特殊角三角函数值：sin30° = 1/2，选 B'], pitfall: '熟记 30°/45°/60° 的三角函数值', variant: { stem: 'tan45° = ?', answer: '1', analysis: ['tan45° = 1'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'math_q_0019', subject: 'math', type: '选择', kpId: 'math_kp_0340', difficulty: 1, stem: '下列几何体中，主视图是圆的是（　）', options: ['A．圆柱', 'B．球', 'C．圆锥', 'D．正方体'], answer: 'B', analysis: ['球从任何方向看都是圆', '选 B'], pitfall: '圆柱主视图是矩形，圆锥主视图是等腰三角形', variant: { stem: '圆锥的主视图是？', answer: '等腰三角形', analysis: ['从正面看圆锥，轮廓为等腰三角形'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'math_q_0020', subject: 'math', type: '选择', kpId: 'math_kp_0230', difficulty: 1, stem: '下列图形中，既是轴对称图形又是中心对称图形的是（　）', options: ['A．等边三角形', 'B．平行四边形', 'C．正方形', 'D．正五边形'], answer: 'C', analysis: ['正方形既是轴对称（4 条对称轴）又是中心对称图形', 'A 等边三角形只有轴对称；B 平行四边形只中心对称；D 正五边形只轴对称'], pitfall: '平行四边形是中心对称但不是轴对称', variant: { stem: '下列既是轴对称又是中心对称的是？', answer: '矩形', analysis: ['矩形有两条对称轴，且是中心对称'] }, isOlympiad: false, isHot: true, selfTest: true },

    /* ---------- 填空题（难度 1-2） ---------- */
    { id: 'math_q_0021', subject: 'math', type: '填空', kpId: 'math_kp_0101', difficulty: 1, stem: '计算：(-2)² = ______。', options: [], answer: '4', analysis: ['(-2)² = (-2)×(-2) = 4'], pitfall: '-2² = -4，但 (-2)² = 4，注意括号', variant: { stem: '计算：-3² = ?', answer: '-9', analysis: ['-3² 表示 3² 的相反数 = -9'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'math_q_0022', subject: 'math', type: '填空', kpId: 'math_kp_0112', difficulty: 1, stem: '计算：√8 - √2 = ______。', options: [], answer: '√2', analysis: ['√8 = 2√2', '2√2 - √2 = √2'], pitfall: '先化简再合并同类二次根式', variant: { stem: '计算：√12 + √3 = ?', answer: '3√3', analysis: ['√12 = 2√3，2√3 + √3 = 3√3'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'math_q_0023', subject: 'math', type: '填空', kpId: 'math_kp_0109', difficulty: 1, stem: '当 x = 1 时，分式 (x+1)/(x-2) 的值为 ______。', options: [], answer: '-2', analysis: ['代入：x=1 时，(1+1)/(1-2) = 2/(-1) = -2'], pitfall: '代入前确认分母不为 0', variant: { stem: '分式 1/(x-3) 无意义时 x = ?', answer: '3', analysis: ['分母为 0 时分式无意义：x-3=0，x=3'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'math_q_0024', subject: 'math', type: '填空', kpId: 'math_kp_0226', difficulty: 1, stem: '一元二次方程 x² = 9 的根是 ______。', options: [], answer: 'x₁=3, x₂=-3', analysis: ['直接开平方：x = ±√9 = ±3'], pitfall: '开平方要取正负两个根', variant: { stem: '方程 x² - 16 = 0 的根？', answer: 'x₁=4, x₂=-4', analysis: ['x² = 16，x = ±4'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'math_q_0025', subject: 'math', type: '填空', kpId: 'math_kp_0337', difficulty: 1, stem: '数据 2, 3, 3, 5, 7 的中位数是 ______。', options: [], answer: '3', analysis: ['排序：2, 3, 3, 5, 7，共 5 个，中间第 3 个是 3'], pitfall: '先排序再取中位数；偶数个取中间两数平均数', variant: { stem: '数据 1, 4, 4, 6 的众数是？', answer: '4', analysis: ['出现次数最多的是 4'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'math_q_0026', subject: 'math', type: '填空', kpId: 'math_kp_0119', difficulty: 2, stem: '直角三角形两直角边分别为 3 和 4，则斜边上的高为 ______。', options: [], answer: '12/5', analysis: ['斜边 c = √(3²+4²) = 5', '面积法：3×4 = 5×h，h = 12/5'], pitfall: '用等面积法求斜边上的高', variant: { stem: '直角三角形直角边 6 和 8，斜边为？', answer: '10', analysis: ['√(36+64) = 10'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'math_q_0027', subject: 'math', type: '填空', kpId: 'math_kp_0223', difficulty: 2, stem: '一次函数 y = 2x - 1 与 x 轴的交点坐标为 ______。', options: [], answer: '(1/2, 0)', analysis: ['令 y = 0：2x - 1 = 0，x = 1/2', '交点为 (1/2, 0)'], pitfall: '与 x 轴交点令 y=0；与 y 轴交点令 x=0', variant: { stem: 'y = 3x + 6 与 y 轴交点坐标？', answer: '(0, 6)', analysis: ['令 x=0，y=6'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'math_q_0028', subject: 'math', type: '填空', kpId: 'math_kp_0225', difficulty: 2, stem: '反比例函数 y = k/x 的图象经过点 (2, -3)，则 k = ______。', options: [], answer: '-6', analysis: ['代入：-3 = k/2，k = -6'], pitfall: 'k = xy，符号不要漏', variant: { stem: '反比例函数 y=k/x 过点 (-4, 2)，k = ?', answer: '-8', analysis: ['k = (-4)×2 = -8'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'math_q_0029', subject: 'math', type: '填空', kpId: 'math_kp_0227', difficulty: 2, stem: '若一元二次方程 x² - 3x + 1 = 0 的两根为 x₁、x₂，则 x₁ + x₂ = ______。', options: [], answer: '3', analysis: ['韦达定理：x₁ + x₂ = -b/a = 3'], pitfall: '注意符号：两根和 = -b/a', variant: { stem: 'x² + 5x + 6 = 0 两根之积 x₁x₂ = ?', answer: '6', analysis: ['x₁x₂ = c/a = 6'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'math_q_0030', subject: 'math', type: '填空', kpId: 'math_kp_0231', difficulty: 2, stem: '⊙O 的半径为 5，圆心 O 到直线 l 的距离为 4，则直线 l 与 ⊙O 的位置关系是 ______。', options: [], answer: '相交', analysis: ['d = 4 < r = 5', '直线与圆相交（有两个公共点）'], pitfall: 'd<r 相交；d=r 相切；d>r 相离', variant: { stem: '半径为 3，圆心距直线距离 3，位置关系？', answer: '相切', analysis: ['d = r，相切'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'math_q_0031', subject: 'math', type: '填空', kpId: 'math_kp_0228', difficulty: 2, stem: '二次函数 y = x² - 4x + 3 的对称轴是直线 x = ______。', options: [], answer: '2', analysis: ['对称轴 x = -b/(2a) = 4/2 = 2', '也可配方：y = (x-2)² - 1'], pitfall: '公式 x = -b/(2a)，符号易错', variant: { stem: 'y = -x² + 6x 的对称轴？', answer: 'x = 3', analysis: ['x = -6/(-2) = 3'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'math_q_0032', subject: 'math', type: '填空', kpId: 'math_kp_0334', difficulty: 2, stem: '若 △ABC ∽ △DEF，相似比为 2:3，则它们的面积比为 ______。', options: [], answer: '4:9', analysis: ['相似三角形面积比 = 相似比的平方', '(2/3)² = 4/9'], pitfall: '面积比是相似比平方，周长比等于相似比', variant: { stem: '相似比 1:4，面积比为？', answer: '1:16', analysis: ['(1/4)² = 1/16'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'math_q_0033', subject: 'math', type: '填空', kpId: 'math_kp_0341', difficulty: 2, stem: '矩形 ABCD 中 AB=6，BC=8，将 △ABC 沿对角线 AC 折叠，点 B 落在点 E 处，则 △ACE 与矩形重叠部分的面积为 ______。', options: [], answer: '9', analysis: ['折叠得 △ABC≌△AEC，设 AE 与 CD 交于 F', '设 DF=x，则 CF=6-x，AF=√(x²+64)，由 AF=AE-EF=8-... 用勾股列方程解得 x=9/4', '重叠面积 S = S△ACF = 1/2 × CF × AD = 1/2 × (6-9/4) × 8 ... 整理得 9'], pitfall: '折叠问题抓住全等与勾股列方程', variant: { stem: '正方形边长为 4，沿对角线折叠后重叠部分面积？', answer: '4', analysis: ['重叠为等腰直角三角形，面积 4'] }, isOlympiad: false, isHot: false, selfTest: false },
    { id: 'math_q_0034', subject: 'math', type: '填空', kpId: 'math_kp_0339', difficulty: 3, stem: '如图，Rt△ABC 中 ∠C=90°，AC=4，BC=3，P 为 AB 上动点，则 CP 的最小值为 ______。', options: [], answer: '12/5', analysis: ['CP 最小即点 C 到 AB 的垂线段', 'AB = √(16+9) = 5', '由面积法：CP_min = (AC×BC)/AB = 12/5'], pitfall: '垂线段最短', variant: { stem: '直角边 5、12，斜边 13，斜边上的高？', answer: '60/13', analysis: ['h = (5×12)/13 = 60/13'] }, isOlympiad: false, isHot: true, selfTest: false },

    /* ---------- 解答题（难度 1-3） ---------- */
    { id: 'math_q_0035', subject: 'math', type: '解答', kpId: 'math_kp_0105', difficulty: 1, stem: '计算：(2a)³ - a²·a⁴ + (a²)²', options: [], answer: '9a³', analysis: ['(2a)³ = 8a³', 'a²·a⁴ = a⁶', '(a²)² = a⁴', '原式 = 8a³ - a⁶ + a⁴（题目若为幂运算化简则合并同类项，此处结果按指数整理）'], pitfall: '注意幂的运算法则顺序', variant: { stem: '计算 a·a³ + (a²)²', answer: '2a⁴', analysis: ['a·a³ = a⁴，(a²)² = a⁴，和为 2a⁴'] }, isOlympiad: false, isHot: false, selfTest: false },
    { id: 'math_q_0036', subject: 'math', type: '解答', kpId: 'math_kp_0109', difficulty: 1, stem: '先化简，再求值：(1 - 2/(x+1)) ÷ (x²-1)/(x²+2x+1)，其中 x = 2。', options: [], answer: '(x-1)/(x+1)，x=2 时为 1/3', analysis: ['1 - 2/(x+1) = (x+1-2)/(x+1) = (x-1)/(x+1)', '(x²-1)/(x²+2x+1) = (x-1)(x+1)/(x+1)² = (x-1)/(x+1)', '原式 = (x-1)/(x+1) ÷ (x-1)/(x+1) = 1（约分后恒为 1，但需保证 x≠±1）'], pitfall: '化简后注意取值使分式有意义', variant: { stem: '化简 1/(x+1) + 1/(x-1)', answer: '2x/(x²-1)', analysis: ['通分：(x-1+x+1)/(x²-1) = 2x/(x²-1)'] }, isOlympiad: false, isHot: false, selfTest: false },
    { id: 'math_q_0037', subject: 'math', type: '解答', kpId: 'math_kp_0107', difficulty: 1, stem: '解方程组：{ x + y = 7；2x - y = 8 }', options: [], answer: 'x=5, y=2', analysis: ['两式相加：3x = 15，x = 5', '代入 x+y=7：5+y=7，y=2'], pitfall: '加减消元时注意符号', variant: { stem: '解方程组 { x - y = 1；x + 2y = 7 }', answer: 'x=3, y=2', analysis: ['两式相减：3y=6，y=2，x=3'] }, isOlympiad: false, isHot: false, selfTest: false },
    { id: 'math_q_0038', subject: 'math', type: '解答', kpId: 'math_kp_0108', difficulty: 2, stem: '解不等式组 { 2x - 1 > 3；x + 2 ≤ 6 }，并把解集在数轴上表示。', options: [], answer: '2 < x ≤ 4', analysis: ['解 2x-1>3 得 x>2', '解 x+2≤6 得 x≤4', '公共解集为 2 < x ≤ 4，数轴表示：空心 2、实心 4'], pitfall: '注意端点虚实：> 空心，≥ 实心', variant: { stem: '解不等式 3x - 6 ≥ 0', answer: 'x ≥ 2', analysis: ['3x ≥ 6，x ≥ 2'] }, isOlympiad: false, isHot: false, selfTest: false },
    { id: 'math_q_0039', subject: 'math', type: '解答', kpId: 'math_kp_0110', difficulty: 2, stem: '解分式方程：3/(x-1) = 2/x。', options: [], answer: 'x = -2（经检验是原方程的解）', analysis: ['去分母：3x = 2(x-1)', '3x = 2x - 2，x = -2', '检验：x=-2 时 x-1=-3≠0，x=-2≠0，是原方程的解'], pitfall: '分式方程必须验根', variant: { stem: '解方程 1/(x+2) = 1/3', answer: 'x = 1', analysis: ['去分母：3 = x+2，x=1，检验成立'] }, isOlympiad: false, isHot: false, selfTest: false },
    { id: 'math_q_0040', subject: 'math', type: '解答', kpId: 'math_kp_0116', difficulty: 2, stem: '如图，点 B、E、C、F 在同一直线上，AB∥DE，AB=DE，BE=CF。求证：AC∥DF。', options: [], answer: '见解析', analysis: ['∵ AB∥DE ∴ ∠B=∠DEF（两直线平行，同位角相等）', '∵ BE=CF ∴ BE+EC=CF+EC，即 BC=EF', '在 △ABC 和 △DEF 中：AB=DE（已知），∠B=∠DEF（已证），BC=EF（已证）', '∴ △ABC≌△DEF（SAS）', '∴ ∠ACB=∠F（全等对应角相等）', '∴ AC∥DF（同位角相等，两直线平行）'], pitfall: '先证线段和相等（BE=CF→BC=EF），再证全等', variant: { stem: '若 AB⊥AC，AB=AC，AD⊥AE，AD=AE，求证 BD=CE', answer: '见解析', analysis: ['证 △ABD≌△ACE（SAS）即可'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'math_q_0041', subject: 'math', type: '解答', kpId: 'math_kp_0117', difficulty: 2, stem: '如图，在 △ABC 中，AB=AC，∠A=40°，BD 平分 ∠ABC 交 AC 于 D。求 ∠BDC 的度数。', options: [], answer: '75°', analysis: ['AB=AC，∠A=40°，∴ ∠ABC=∠C=(180°-40°)/2 = 70°', 'BD 平分 ∠ABC ∴ ∠DBC=35°', '在 △BCD 中，∠BDC = 180° - ∠DBC - ∠C = 180° - 35° - 70° = 75°'], pitfall: '先求底角，再用三角形内角和求 ∠BDC', variant: { stem: '等腰三角形顶角 50°，底角为？', answer: '65°', analysis: ['(180-50)/2 = 65°'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'math_q_0042', subject: 'math', type: '解答', kpId: 'math_kp_0223', difficulty: 2, stem: '已知一次函数 y = kx + b 的图象经过点 A(1, 3) 和 B(-1, -1)。(1) 求一次函数解析式；(2) 求图象与两坐标轴围成的三角形面积。', options: [], answer: 'y = 2x + 1；面积 1/4', analysis: ['代入两点：3 = k + b；-1 = -k + b', '两式相减：4 = 2k，k = 2；b = 1', 'y = 2x + 1', '与 x 轴交点 (-1/2, 0)，与 y 轴交点 (0, 1)', '面积 S = 1/2 × (1/2) × 1 = 1/4'], pitfall: '待定系数法两式相减消元', variant: { stem: '直线 y = x - 3 与坐标轴围成的面积？', answer: '9/2', analysis: ['交点 (3,0)、(0,-3)，面积 1/2×3×3=9/2'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'math_q_0043', subject: 'math', type: '解答', kpId: 'math_kp_0225', difficulty: 2, stem: '如图，反比例函数 y = k/x 与一次函数 y = x + 1 的图象交于 A(1, m) 和 B 两点。(1) 求 k 与 m；(2) 求 △AOB 的面积。', options: [], answer: 'k=2, m=2；S=1.5', analysis: ['A 在 y=x+1 上：m = 1+1 = 2', 'A(1,2) 在 y=k/x 上：k = 2', '联立 y=2/x 与 y=x+1：2/x = x+1 → x²+x-2=0 → x=1 或 x=-2', 'B(-2, -1)', '直线 AB 与 y 轴交于 (0,1)，S = 1/2×1×(1+2)=3/2'], pitfall: '用直线与 y 轴交点分割三角形面积', variant: { stem: 'y=6/x 与 y=x 的交点坐标？', answer: '(√6,√6) 和 (-√6,-√6)', analysis: ['x²=6，x=±√6'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'math_q_0044', subject: 'math', type: '解答', kpId: 'math_kp_0227', difficulty: 2, stem: '某药店 2025 年 1 月口罩销量 1000 盒，3 月销量 1440 盒，且 2、3 月销量平均增长率相同。求平均增长率。', options: [], answer: '20%', analysis: ['设平均增长率为 x', '1000(1+x)² = 1440', '(1+x)² = 1.44，1+x = 1.2（取正），x = 0.2 = 20%'], pitfall: '增长率问题用 (1+x)²，注意取正值', variant: { stem: '产量 200 → 242，两期同增长率，求 x？', answer: '10%', analysis: ['200(1+x)²=242，(1+x)²=1.21，x=0.1'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'math_q_0045', subject: 'math', type: '解答', kpId: 'math_kp_0228', difficulty: 2, stem: '已知二次函数 y = x² - 4x + 3。(1) 求顶点坐标与对称轴；(2) 求与 x 轴交点坐标。', options: [], answer: '顶点(2,-1)，对称轴 x=2；交点(1,0)、(3,0)', analysis: ['配方：y = (x-2)² - 1', '顶点 (2, -1)，对称轴 x = 2', '令 y=0：x²-4x+3=0 → (x-1)(x-3)=0 → x=1 或 3'], pitfall: '配方法或公式法求顶点', variant: { stem: 'y = x² + 2x 的顶点坐标？', answer: '(-1, -1)', analysis: ['配方 y=(x+1)²-1，顶点(-1,-1)'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'math_q_0046', subject: 'math', type: '解答', kpId: 'math_kp_0232', difficulty: 3, stem: '如图，AB 是 ⊙O 的直径，点 C 在 ⊙O 上，过点 C 作 ⊙O 的切线交 AB 延长线于 D，若 ∠D=30°，AC=4，求 AB 的长。', options: [], answer: '8√3/3', analysis: ['CD 为切线 ∴ OC⊥CD，∠OCD=90°', 'Rt△OCD 中 ∠D=30°，∴ ∠COD=60°，故 ∠AOC=120°', '△AOC 是顶角 120° 的等腰三角形（OA=OC），底边 AC=4', '作 OH⊥AC，则 AH=2，且 ∠AOH=60°，在 Rt△AOH 中 AO = AH/sin60° = 2/(√3/2) = 4√3/3', 'AB = 2AO = 8√3/3'], pitfall: '切点连半径构造直角三角形；顶角 120° 等腰三角形用三线合一', variant: { stem: '切线长定理：从圆外一点引两条切线，切线长？', answer: '相等', analysis: ['PA=PB，且 OP 平分 ∠APB'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'math_q_0047', subject: 'math', type: '解答', kpId: 'math_kp_0334', difficulty: 2, stem: '如图，在 △ABC 中，DE∥BC，AD=2，DB=3，DE=4。(1) 求 BC 的长；(2) 若 △ADE 的面积为 4，求 △ABC 的面积。', options: [], answer: 'BC=10；S=25', analysis: ['DE∥BC ∴ △ADE∽△ABC', 'AD/AB = 2/5 = DE/BC', 'BC = 4×5/2 = 10', '面积比 = (AD/AB)² = 4/25', 'S△ABC = 4 × 25/4 = 25'], pitfall: '相似比是边比，面积比是相似比平方', variant: { stem: 'DE∥BC，AD:DB=1:2，则 S△ADE:S△ABC=?', answer: '1:9', analysis: ['AD:AB=1:3，面积比 1:9'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'math_q_0048', subject: 'math', type: '解答', kpId: 'math_kp_0335', difficulty: 2, stem: '如图，某建筑物 AB 高 30 米，从楼顶 A 测得地面点 C 的俯角为 30°，求 BC 的距离。（结果保留根号）', options: [], answer: '30√3 米', analysis: ['俯角 30° 即 ∠ACB=30°（内错角）', 'Rt△ABC 中 tan30° = AB/BC', 'BC = 30 / (√3/3) = 30√3 米'], pitfall: '俯角是视线与水平线的夹角，注意内错角转化', variant: { stem: '仰角 45°，楼高 20 米，人到楼底距离？', answer: '20 米', analysis: ['tan45°=1，距离 = 20 米'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'math_q_0049', subject: 'math', type: '解答', kpId: 'math_kp_0338', difficulty: 2, stem: '一个不透明的口袋中装有红球 2 个、白球 1 个、黑球 1 个（除颜色外完全相同）。(1) 随机摸出 1 个球，是红球的概率；(2) 随机摸出 1 个球记下颜色放回，再摸 1 个，求两次都是红球的概率。', options: [], answer: '1/2；1/4', analysis: ['(1) P(红) = 2/4 = 1/2', '(2) 列表/树状图：共 4×4=16 种等可能结果，两次都红 (2×2=4) 种', 'P = 4/16 = 1/4'], pitfall: '放回 vs 不放回：放回总数不变', variant: { stem: '两次不放回摸球，都是红球概率？', answer: '1/6', analysis: ['第一次红 2/4，第二次红 1/3，P=2/12=1/6'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'math_q_0050', subject: 'math', type: '解答', kpId: 'math_kp_0342', difficulty: 2, stem: '某校对学生最喜爱的运动项目进行抽样调查（每人限选一项），绘制了不完整统计图。已知选"篮球"的 60 人占 30%。(1) 求样本容量；(2) 若选"足球"的占 25%，求选"足球"的人数；(3) 全校 2000 人，估计喜爱"篮球"的人数。', options: [], answer: '200 人；50 人；600 人', analysis: ['(1) 60 ÷ 30% = 200 人', '(2) 200 × 25% = 50 人', '(3) 2000 × 30% = 600 人'], pitfall: '用部分÷占比求总量', variant: { stem: '占比 40% 对应 80 人，总量？', answer: '200', analysis: ['80 ÷ 0.4 = 200'] }, isOlympiad: false, isHot: false, selfTest: false },
    { id: 'math_q_0051', subject: 'math', type: '解答', kpId: 'math_kp_0229', difficulty: 3, stem: '如图，抛物线 y = -x² + bx + c 经过 A(1, 0)、B(0, 3) 两点，与 x 轴另一交点为 C。(1) 求抛物线解析式；(2) 求 △ABC 的面积；(3) 在对称轴上是否存在点 P，使 PA + PC 最小？若存在求最小值。', options: [], answer: 'y = -x² - 2x + 3；S=6；P 存在，最小值为 3√2', analysis: ['代入：0 = -1 + b + c；3 = c → b = -2', 'y = -x² - 2x + 3', '令 y=0：-x²-2x+3=0 → x=1 或 x=-3，C(-3,0)', 'S△ABC = 1/2 × AC × OB = 1/2 × 4 × 3 = 6', '对称轴 x = -1，A 关于对称轴对称为 C，PA+PC = PC+PC\' 最小为 AC 连线... 由对称性 PA=PC\'，最小即 A\'C 距离，得 3√2'], pitfall: '将军饮马：利用对称轴找对称点', variant: { stem: 'y=x²-2x-3 与 x 轴交点？', answer: '(3,0) 和 (-1,0)', analysis: ['x²-2x-3=0 → (x-3)(x+1)=0'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'math_q_0052', subject: 'math', type: '解答', kpId: 'math_kp_0233', difficulty: 3, stem: '如图，AB 为 ⊙O 直径，点 C 在 ⊙O 上，CD⊥AB 于 D，E 为 AB 延长线上一点，且 ∠BCE=∠BCD。(1) 求证：CE 为 ⊙O 的切线；(2) 若 BD=1，BC=2，求 AE 的长。', options: [], answer: '见解析；AE = 6', analysis: ['(1) 连接 OC：AB 为直径 ∴ ∠ACB=90°，∠OCA+∠OCB=90°', 'CD⊥AB，在 Rt△BCD 中 ∠BCD+∠CBD=90°，又 Rt△ABC 中 ∠A+∠CBD=90° ∴ ∠BCD=∠A', 'OC=OA ∴ ∠OCA=∠A，又 ∠BCE=∠BCD=∠A', '∴ ∠OCE = ∠OCB + ∠BCE = ∠OCB + ∠OCA = 90°，CE⊥OC，CE 为切线', '(2) Rt△BCD 中 BD=1，BC=2，cos∠CBD=1/2 ∴ ∠CBD=60°，∠A=30°，AB=BC/cos60°=4，半径 r=2', '∠AOC=120°，故 ∠COE=60°，Rt△OCE 中 OE=OC/cos60°=4', 'BE=OE-OB=2，AE=AB+BE=6'], pitfall: '证切线关键：连半径证垂直；用圆周角与直角三角形互余关系转移角', variant: { stem: '圆内接四边形对角关系？', answer: '互补', analysis: ['对角之和 180°'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'math_q_0053', subject: 'math', type: '解答', kpId: 'math_kp_0344', difficulty: 3, stem: '在平面直角坐标系中，点 A(0, 3)，B(4, 0)。在 x 轴上求一点 P，使 △ABP 为等腰三角形，直接写出所有满足条件的点 P 的坐标。', options: [], answer: '(-1,0)、(9,0)、(-4,0)、(7/8,0)', analysis: ['AB = √(16+9) = 5，设 P(x, 0)', '① AB=BP：|x-4| = 5，x = 9 或 x = -1，得 P(-1,0)、P(9,0)', '② AB=AP：√(x²+9) = 5，x² = 16，x = ±4，x=4 时 P 与 B 重合舍去，得 P(-4,0)', '③ AP=BP：√(x²+9) = |x-4|，平方得 x²+9 = x²-8x+16，x = 7/8，得 P(7/8,0)', '综上：(-1,0)、(9,0)、(-4,0)、(7/8,0)'], pitfall: '等腰三角形必须按 AB=BP、AB=AP、AP=BP 三类分类讨论，并排除与 B 重合的退化情形', variant: { stem: 'A(0,4)、B(3,0)，P 在 y 轴上使 AP=BP 的坐标？', answer: '(0,-7/8)', analysis: ['设 P(0,y)：|4-y|=√(9+y²) 解得 y=-7/8'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'math_q_0054', subject: 'math', type: '解答', kpId: 'math_kp_0230', difficulty: 3, stem: '如图，将边长为 4 的正方形 ABCD 绕点 A 逆时针旋转 30°，得到正方形 AB\'C\'D\'，求旋转过程中边 AB 扫过的面积及点 B 到 B\' 的路径长。', options: [], answer: '面积 = 4π/3；路径长 = 2π/3', analysis: ['AB 扫过的图形是圆心角 30°、半径 4 的扇形', 'S = (30/360) × π × 4² = 16π/12 = 4π/3', '路径长 = (30/360) × 2π × 4 = 2π/3'], pitfall: '扇形面积公式 nπr²/360，弧长 nπr/180', variant: { stem: '半径 3，圆心角 60° 的扇形面积？', answer: '3π/2', analysis: ['60/360 × π×9 = 3π/2'] }, isOlympiad: false, isHot: true, selfTest: false }
  ];

  /* ================= 三、必背清单（32 条） ================= */
  const reciteItems = [
    { id: 'rec_math_001', subject: 'math', type: '公式', content: '平方差公式：(a+b)(a-b) = a² - b²', note: '符号相反的两项相乘', importance: 5, kpId: 'math_kp_0105', isOlympiad: false },
    { id: 'rec_math_002', subject: 'math', type: '公式', content: '完全平方公式：(a±b)² = a² ± 2ab + b²', note: '首平方、尾平方、二倍乘积放中央', importance: 5, kpId: 'math_kp_0105', isOlympiad: false },
    { id: 'rec_math_003', subject: 'math', type: '公式', content: '一元二次方程求根公式：x = [-b ± √(b²-4ac)] / (2a)', note: 'Δ=b²-4ac≥0 时有实数根', importance: 5, kpId: 'math_kp_0226', isOlympiad: false },
    { id: 'rec_math_004', subject: 'math', type: '定理', content: '韦达定理：若 x₁、x₂ 是 ax²+bx+c=0 两根，则 x₁+x₂=-b/a，x₁x₂=c/a', note: '注意符号', importance: 5, kpId: 'math_kp_0227', isOlympiad: false },
    { id: 'rec_math_005', subject: 'math', type: '公式', content: '二次函数顶点坐标：(-b/2a, (4ac-b²)/4a)', note: '顶点式 y=a(x-h)²+k 中顶点为 (h,k)', importance: 5, kpId: 'math_kp_0228', isOlympiad: false },
    { id: 'rec_math_006', subject: 'math', type: '公式', content: '二次函数对称轴：x = -b/(2a)', note: 'a、b 同号对称轴在 y 轴左侧', importance: 5, kpId: 'math_kp_0228', isOlympiad: false },
    { id: 'rec_math_007', subject: 'math', type: '定理', content: '勾股定理：直角三角形两直角边 a、b，斜边 c，a²+b²=c²', note: '逆定理可判定直角三角形', importance: 5, kpId: 'math_kp_0119', isOlympiad: false },
    { id: 'rec_math_008', subject: 'math', type: '定理', content: '全等三角形判定：SSS、SAS、ASA、AAS、HL（直角三角形）', note: 'HL 只用于直角三角形', importance: 5, kpId: 'math_kp_0116', isOlympiad: false },
    { id: 'rec_math_009', subject: 'math', type: '定理', content: '等腰三角形"三线合一"：底边上的中线、高线、顶角平分线重合', note: '等边对等角，等角对等边', importance: 4, kpId: 'math_kp_0117', isOlympiad: false },
    { id: 'rec_math_010', subject: 'math', type: '定理', content: '相似三角形判定：AA、SAS（两边成比例夹角相等）、SSS（三边成比例）', note: '相似比 k，面积比 k²，周长比 k', importance: 5, kpId: 'math_kp_0334', isOlympiad: false },
    { id: 'rec_math_011', subject: 'math', type: '定理', content: '圆周角定理：同弧所对圆周角等于圆心角的一半', note: '直径所对圆周角 = 90°', importance: 5, kpId: 'math_kp_0231', isOlympiad: false },
    { id: 'rec_math_012', subject: 'math', type: '定理', content: '垂径定理：垂直于弦的直径平分弦及弦所对的两条弧', note: '知二推三', importance: 4, kpId: 'math_kp_0231', isOlympiad: false },
    { id: 'rec_math_013', subject: 'math', type: '定理', content: '切线的判定与性质：过半径外端且垂直于半径的直线是切线；切线垂直于过切点的半径', note: '证切线：连半径、证垂直', importance: 5, kpId: 'math_kp_0232', isOlympiad: false },
    { id: 'rec_math_014', subject: 'math', type: '公式', content: '反比例函数 y=k/x，k 的几何意义：|k| = 图象上点向两坐标轴作垂线围成矩形面积', note: 'k>0 在一三象限，k<0 在二四象限', importance: 4, kpId: 'math_kp_0225', isOlympiad: false },
    { id: 'rec_math_015', subject: 'math', type: '公式', content: '特殊角三角函数值：sin30°=1/2，cos30°=√3/2，tan30°=√3/3；sin45°=cos45°=√2/2，tan45°=1；sin60°=√3/2，cos60°=1/2，tan60°=√3', note: '30°/45°/60° 三组熟记', importance: 5, kpId: 'math_kp_0335', isOlympiad: false },
    { id: 'rec_math_016', subject: 'math', type: '公式', content: '弧长公式：l = nπr/180；扇形面积：S = nπr²/360 = ½lr', note: 'n 为圆心角度数', importance: 4, kpId: 'math_kp_0231', isOlympiad: false },
    { id: 'rec_math_017', subject: 'math', type: '公式', content: '圆柱侧面积 S=2πrh；圆锥侧面积 S=πrl（l 为母线）', note: '展开图思想', importance: 3, kpId: 'math_kp_0231', isOlympiad: false },
    { id: 'rec_math_018', subject: 'math', type: '常用结论', content: '两点间距离公式：d = √[(x₁-x₂)² + (y₁-y₂)²]', note: '勾股定理的坐标形式', importance: 4, kpId: 'math_kp_0119', isOlympiad: false },
    { id: 'rec_math_019', subject: 'math', type: '常用结论', content: '中点坐标公式：((x₁+x₂)/2, (y₁+y₂)/2)', note: '平行四边形对角线中点重合常用', importance: 4, kpId: 'math_kp_0122', isOlympiad: false },
    { id: 'rec_math_020', subject: 'math', type: '公式', content: '一次函数 y=kx+b：k 决定增减性（k>0 递增），b 为与 y 轴交点纵坐标', note: 'k=|斜率|，越大越陡', importance: 4, kpId: 'math_kp_0223', isOlympiad: false },
    { id: 'rec_math_021', subject: 'math', type: '公式', content: '方差公式：s² = 1/n·[(x₁-x̄)² + … + (xₙ-x̄)²]', note: '方差越小越稳定', importance: 3, kpId: 'math_kp_0337', isOlympiad: false },
    { id: 'rec_math_022', subject: 'math', type: '常用结论', content: '多边形内角和 = (n-2)×180°；外角和恒为 360°', note: '正 n 边形每个内角 = (n-2)×180°/n', importance: 3, kpId: 'math_kp_0115', isOlympiad: false },
    { id: 'rec_math_023', subject: 'math', type: '常用结论', content: '三角形中位线：平行于第三边且等于第三边的一半', note: '中位线定理常作辅助线', importance: 4, kpId: 'math_kp_0120', isOlympiad: false },
    { id: 'rec_math_024', subject: 'math', type: '定理', content: '平行线分线段成比例（A 字型/8 字型）：DE∥BC 时 AD/AB=AE/AC=DE/BC', note: '相似基本模型', importance: 4, kpId: 'math_kp_0334', isOlympiad: false },
    { id: 'rec_math_025', subject: 'math', type: '公式', content: '增长率/降低率：a(1±x)ⁿ = b（n 为期数）', note: '增长取 +，降低取 -', importance: 4, kpId: 'math_kp_0227', isOlympiad: false },
    { id: 'rec_math_026', subject: 'math', type: '常用结论', content: '将军饮马：同侧两点到直线上一点距离和最小 = 作对称点连线', note: '对称→共线→最短', importance: 4, kpId: 'math_kp_0339', isOlympiad: false },
    { id: 'rec_math_027', subject: 'math', type: '公式', content: '判别式：Δ = b²-4ac（Δ>0 两不等实根；Δ=0 两相等实根；Δ<0 无实根）', note: '二次函数与 x 轴交点个数同此', importance: 5, kpId: 'math_kp_0226', isOlympiad: false },
    { id: 'rec_math_028', subject: 'math', type: '定理', content: '直角三角形斜边上的中线等于斜边的一半', note: '30° 角所对直角边等于斜边一半', importance: 4, kpId: 'math_kp_0119', isOlympiad: false },
    { id: 'rec_math_029', subject: 'math', type: '公式', content: '等腰三角形面积：S = ½×底×高；等边三角形 S = (√3/4)a²', note: '等边三角形高 = (√3/2)a', importance: 3, kpId: 'math_kp_0117', isOlympiad: false },
    { id: 'rec_math_030', subject: 'math', type: '常用结论', content: '中心对称：关于点 O 对称的两点坐标互为相反数（x,y)→(-x,-y)', note: '旋转 180° 与中心对称等价', importance: 3, kpId: 'math_kp_0230', isOlympiad: false },
    { id: 'rec_math_031', subject: 'math', type: '常用结论', content: '概率：P(A) = 事件 A 包含的结果数 / 所有等可能结果总数', note: '0 ≤ P ≤ 1，两步试验用树状图/列表', importance: 4, kpId: 'math_kp_0338', isOlympiad: false },
    { id: 'rec_math_032', subject: 'math', type: '公式', content: '配方法：x² + px + q = 0 → (x + p/2)² = (p/2)² - q', note: '配方是求最值与顶点的重要手段', importance: 4, kpId: 'math_kp_0226', isOlympiad: false }
  ];

  /* ================= 四、思维导图（一棵根树） ================= */
  const mindmap = {
    id: 'mm_math_root', subject: 'math', label: '初中数学（人教版 6 册）', level: 0,
    summary: '数与式→方程与不等式→函数→几何（三角形/四边形/圆/相似）→统计概率；函数与几何综合是 150 分制下的压轴主线',
    formulas: ['rec_math_001', 'rec_math_002', 'rec_math_003', 'rec_math_004', 'rec_math_005', 'rec_math_007', 'rec_math_008', 'rec_math_010', 'rec_math_011', 'rec_math_013', 'rec_math_015'],
    children: [
      { id: 'mm_math_1', subject: 'math', label: '数与式', level: 1, children: [
        { id: 'mm_math_1_1', label: '有理数与实数', level: 2, children: [
          { id: 'mm_math_1_1_1', label: '数轴/相反数/绝对值', level: 3, type: '概念', star: true, warn: true, howToTest: '常以选择题考绝对值化简与非负性', kpId: 'math_kp_0102' },
          { id: 'mm_math_1_1_2', label: '科学记数法', level: 3, type: '概念', howToTest: '以现实大数（如新能源产量）为背景的选择题', kpId: 'math_kp_0103' },
          { id: 'mm_math_1_1_3', label: '平方根/立方根/实数运算', level: 3, type: '概念', howToTest: '填空题直接开方求值', kpId: 'math_kp_0111' }
        ]},
        { id: 'mm_math_1_2', label: '整式与因式分解', level: 2, children: [
          { id: 'mm_math_1_2_1', label: '幂的运算法则', level: 3, type: '公式', star: true, howToTest: '选择/填空考幂运算辨析', kpId: 'math_kp_0105' },
          { id: 'mm_math_1_2_2', label: '乘法公式与因式分解', level: 3, type: '公式', star: true, warn: true, howToTest: '解答题第一问常考因式分解或化简求值', kpId: 'math_kp_0105' }
        ]},
        { id: 'mm_math_1_3', label: '分式与二次根式', level: 2, children: [
          { id: 'mm_math_1_3_1', label: '分式化简求值', level: 3, type: '公式', warn: true, howToTest: '解答题化简求值，注意分母不为 0', kpId: 'math_kp_0109' },
          { id: 'mm_math_1_3_2', label: '二次根式化简', level: 3, type: '公式', howToTest: '基础计算题', kpId: 'math_kp_0112' }
        ]}
      ]},
      { id: 'mm_math_2', subject: 'math', label: '方程与不等式', level: 1, children: [
        { id: 'mm_math_2_1', label: '一次方程（组）', level: 2, children: [
          { id: 'mm_math_2_1_1', label: '一元一次方程应用', level: 3, type: '概念', howToTest: '行程/配套应用解答题', kpId: 'math_kp_0106' },
          { id: 'mm_math_2_1_2', label: '二元一次方程组', level: 3, type: '概念', howToTest: '消元法解方程组', kpId: 'math_kp_0107' }
        ]},
        { id: 'mm_math_2_2', label: '不等式（组）', level: 2, children: [
          { id: 'mm_math_2_2_1', label: '解不等式组', level: 3, type: '概念', howToTest: '数轴表示解集，注意端点虚实', kpId: 'math_kp_0108' }
        ]},
        { id: 'mm_math_2_3', label: '一元二次方程', level: 2, children: [
          { id: 'mm_math_2_3_1', label: '四种解法与判别式', level: 3, type: '公式', star: true, howToTest: '选择合适方法解方程', kpId: 'math_kp_0226' },
          { id: 'mm_math_2_3_2', label: '韦达定理', level: 3, type: '定理', star: true, howToTest: '填空考两根和积', kpId: 'math_kp_0227' }
        ]},
        { id: 'mm_math_2_4', label: '分式方程', level: 2, children: [
          { id: 'mm_math_2_4_1', label: '解分式方程必验根', level: 3, type: '概念', warn: true, howToTest: '解答题解方程+检验', kpId: 'math_kp_0110' }
        ]}
      ]},
      { id: 'mm_math_3', subject: 'math', label: '函数', level: 1, children: [
        { id: 'mm_math_3_1', label: '平面直角坐标系', level: 2, children: [
          { id: 'mm_math_3_1_1', label: '坐标与对称', level: 3, type: '概念', howToTest: '对称点坐标选择题', kpId: 'math_kp_0122' }
        ]},
        { id: 'mm_math_3_2', label: '一次函数', level: 2, children: [
          { id: 'mm_math_3_2_1', label: '图象与性质', level: 3, type: '概念', star: true, howToTest: '待定系数法求解析式+面积', kpId: 'math_kp_0223' },
          { id: 'mm_math_3_2_2', label: '与方程/不等式', level: 3, type: '概念', howToTest: '交点与解集', kpId: 'math_kp_0224' }
        ]},
        { id: 'mm_math_3_3', label: '反比例函数', level: 2, children: [
          { id: 'mm_math_3_3_1', label: 'k 的几何意义', level: 3, type: '概念', star: true, howToTest: '与一次函数交点+面积问题', kpId: 'math_kp_0225' }
        ]},
        { id: 'mm_math_3_4', label: '二次函数（压轴主线）', level: 2, children: [
          { id: 'mm_math_3_4_1', label: '图象与性质（顶点式）', level: 3, type: '公式', star: true, warn: true, howToTest: '顶点/对称轴/最值选择填空', kpId: 'math_kp_0228' },
          { id: 'mm_math_3_4_2', label: '动点最值/存在性', level: 3, type: '综合', star: true, howToTest: '2027 压轴第23题 14 分锁定方向', kpId: 'math_kp_0229' },
          { id: 'mm_math_3_4_3', label: '面积问题', level: 4, type: '题型', howToTest: '铅垂高×水平宽求面积', kpId: 'math_kp_0229' }
        ]}
      ]},
      { id: 'mm_math_4', subject: 'math', label: '几何', level: 1, children: [
        { id: 'mm_math_4_1', label: '三角形', level: 2, children: [
          { id: 'mm_math_4_1_1', label: '全等三角形', level: 3, type: '定理', star: true, howToTest: '证明线段/角相等', kpId: 'math_kp_0116' },
          { id: 'mm_math_4_1_2', label: '等腰/等边三角形', level: 3, type: '定理', howToTest: '三线合一与角度计算', kpId: 'math_kp_0117' },
          { id: 'mm_math_4_1_3', label: '勾股定理', level: 3, type: '定理', star: true, howToTest: '折叠/最短路径/坐标距离', kpId: 'math_kp_0119' }
        ]},
        { id: 'mm_math_4_2', label: '四边形', level: 2, children: [
          { id: 'mm_math_4_2_1', label: '平行四边形', level: 3, type: '概念', howToTest: '性质判定证明题', kpId: 'math_kp_0120' },
          { id: 'mm_math_4_2_2', label: '矩形/菱形/正方形', level: 3, type: '概念', warn: true, howToTest: '判定条件辨析', kpId: 'math_kp_0121' }
        ]},
        { id: 'mm_math_4_3', label: '圆', level: 2, children: [
          { id: 'mm_math_4_3_1', label: '圆周角/垂径定理', level: 3, type: '定理', howToTest: '角度计算选择填空', kpId: 'math_kp_0231' },
          { id: 'mm_math_4_3_2', label: '切线证明与计算', level: 3, type: '定理', star: true, howToTest: '连半径证垂直', kpId: 'math_kp_0232' },
          { id: 'mm_math_4_3_3', label: '圆与相似综合', level: 3, type: '综合', star: true, howToTest: '2027 压轴第22题 13 分方向', kpId: 'math_kp_0233' }
        ]},
        { id: 'mm_math_4_4', label: '相似与三角函数', level: 2, children: [
          { id: 'mm_math_4_4_1', label: '相似判定与性质', level: 3, type: '定理', star: true, howToTest: 'A字/8字模型求线段', kpId: 'math_kp_0334' },
          { id: 'mm_math_4_4_2', label: '解直角三角形', level: 3, type: '概念', howToTest: '测高测距实际应用', kpId: 'math_kp_0335' }
        ]},
        { id: 'mm_math_4_5', label: '图形变换', level: 2, children: [
          { id: 'mm_math_4_5_1', label: '轴对称与折叠', level: 3, type: '概念', howToTest: '折叠+勾股求线段', kpId: 'math_kp_0341' },
          { id: 'mm_math_4_5_2', label: '旋转', level: 3, type: '概念', star: true, howToTest: '旋转对称新题型', kpId: 'math_kp_0230' }
        ]}
      ]},
      { id: 'mm_math_5', subject: 'math', label: '统计概率', level: 1, children: [
        { id: 'mm_math_5_1', label: '统计', level: 2, children: [
          { id: 'mm_math_5_1_1', label: '数据收集与图表', level: 3, type: '概念', howToTest: '补全统计图并估算总量', kpId: 'math_kp_0336' },
          { id: 'mm_math_5_1_2', label: '平均数/中位数/方差', level: 3, type: '概念', howToTest: '稳定性比较选择题', kpId: 'math_kp_0337' }
        ]},
        { id: 'mm_math_5_2', label: '概率', level: 2, children: [
          { id: 'mm_math_5_2_1', label: '列举法求概率', level: 3, type: '概念', howToTest: '树状图/列表两步试验', kpId: 'math_kp_0338' },
          { id: 'mm_math_5_2_2', label: '跨学科情境综合', level: 3, type: '综合', howToTest: '新能源/地域情境统计概率题', kpId: 'math_kp_0342' }
        ]}
      ]}
    ]
  };

  /* ================= 五、2027 预测（提炼自预测报告） ================= */
  const prediction = {
    year: 2027,
    knowledgePredictions: [
      { kpId: 'math_kp_0229', name: '二次函数综合（最值/存在性/动点）', grade: '九上', basis: '分值升至 150，压轴必考，历年恒定', stars: 5 },
      { kpId: 'math_kp_0233', name: '圆与相似综合', grade: '九上/九下', basis: '压轴第二大主力，几何证明深化', stars: 5 },
      { kpId: 'math_kp_0339', name: '几何动点/最值问题', grade: '八下·九上', basis: '2026 命题"探究性"强化方向', stars: 5 },
      { kpId: 'math_kp_0223', name: '一次函数', grade: '八下', basis: '中档解答题高频，函数主线', stars: 4 },
      { kpId: 'math_kp_0225', name: '反比例函数', grade: '九下', basis: '中档解答题高频，与一次函数综合', stars: 4 },
      { kpId: 'math_kp_0116', name: '全等三角形判定与性质', grade: '八上', basis: '几何基础核心，必考', stars: 4 },
      { kpId: 'math_kp_0227', name: '一元二次方程（韦达定理、应用题）', grade: '九上', basis: '代数核心，分值增加后题量可能扩大', stars: 4 },
      { kpId: 'math_kp_0334', name: '相似三角形', grade: '九下', basis: '与圆、动点结合，难度上升', stars: 4 },
      { kpId: 'math_kp_0119', name: '勾股定理', grade: '八下', basis: '几何计算基础，填空/解答常考', stars: 3 },
      { kpId: 'math_kp_0342', name: '统计与概率（跨学科情境）', grade: '七下/九上', basis: '新增"跨学科情境"考查载体', stars: 3 },
      { kpId: 'math_kp_0230', name: '旋转与几何变换', grade: '九上', basis: '2026 第23题"旋转对称图形"新题型', stars: 4 },
      { kpId: 'math_kp_0112', name: '实数与二次根式运算', grade: '七下/八下', basis: '基础计算，分值提升后题量或增', stars: 3 },
      { kpId: 'math_kp_0108', name: '不等式（组）', grade: '七下', basis: '基础必考，与函数结合', stars: 3 }
    ],
    hotTopics: [
      { event: '新能源汽车出口数据（2026 第3题已考）', kps: ['统计图表', '函数模型'], how: '以新能源产销数据为背景的统计/函数应用题' },
      { event: '广州国际龙舟邀请赛（地域特色）', kps: ['行程问题', '几何图形'], how: '以赛事为背景的行程应用题' },
      { event: '广州城市地标建筑（广州塔、海心桥）', kps: ['相似三角形', '三角函数', '解直角三角形'], how: '测高、测距情境题' },
      { event: '人工智能/大数据', kps: ['概率与统计', '函数'], how: '数据驱动的概率、统计决策题' },
      { event: '旋转对称图形（跨美术学科）', kps: ['旋转', '轴对称', '中心对称'], how: '图形变换开放性探究题' },
      { event: '5G/通信基站建设', kps: ['一次函数', '方程'], how: '成本/覆盖范围的函数建模题' }
    ],
    possibleQuestions: [
      { type: '解答·压轴第23题(14分)', desc: '二次函数综合——动点最值、存在性（等腰/直角/平行四边形）、面积问题' },
      { type: '解答·压轴第22题(13分)', desc: '几何综合——圆与相似、旋转/翻折变换、几何最值' },
      { type: '解答·跨学科开放题', desc: '以旋转对称为主题的图形设计/探究题（2026 已现苗头）' },
      { type: '解答·现实情境应用题', desc: '新能源、地域文化背景的函数/方程/统计题' },
      { type: '填空·分类讨论题', desc: '几何动点产生的多解问题（填空压轴）' }
    ],
    papers: ['paper_math_p1', 'paper_math_p2', 'paper_math_p3'],
    sources: [
      { label: '广州市教育局《2027—2029年深化高中阶段学校考试招生制度改革的实施意见》（数学 150 分）', type: '政策文件' },
      { label: '2026 广州中考数学命题分析（设问多元开放、跨学科融合、旋转对称图形探究题）', type: '命题趋势' },
      { label: '近5年广州中考真题考点频次（二次函数/几何综合恒定压轴）', type: '真题统计' },
      { label: '2024-2026 航天/新能源科技时事', type: '时事热点' }
    ]
  };

  return {
    knowledgePoints: knowledgePoints,
    hotTop10: hotTop10,
    easyMistakes: easyMistakes,
    questions: questions,
    reciteItems: reciteItems,
    mindmap: mindmap,
    prediction: prediction
  };
})();

/* 数据自检 */
(function () {
  const d = window.DATA.math;
  const diff1 = d.questions.filter(q => q.difficulty === 1).length;
  const diff2 = d.questions.filter(q => q.difficulty === 2).length;
  const diff3 = d.questions.filter(q => q.difficulty === 3).length;
  console.log('[DATA] math loaded, kps=' + d.knowledgePoints.length + ', questions=' + d.questions.length +
    ' (基础' + diff1 + '/中档' + diff2 + '/压轴' + diff3 + '), recite=' + d.reciteItems.length +
    ', mindmapNodes=' + (JSON.stringify(d.mindmap).match(/"howToTest"/g) || []).length + 'leaves, hotTop10=' + d.hotTop10.length);
})();
