/* ============================================================
   data-physics.js —— 物理数据（window.DATA.physics）
   职责：考点库 / 题库 / 必背清单 / 思维导图 / 2027 预测
   覆盖：人教版八上→九全 3 册；对标广州中考（笔试 90 + 实验 10）
   依赖：无（纯数据）
   ============================================================ */

window.DATA = window.DATA || {};
window.DATA.physics = (function () {

  /* ================= 一、考点库（34 个，覆盖 3 册） ================= */
  const knowledgePoints = [
    { id: 'phy_kp_0101', subject: 'physics', name: '长度与时间的测量', board: '声光热', grade: '八年级', volume: '八上', chapter: '第1章 机械运动', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空'], tags: ['必会'], hotRank: null, desc: '刻度尺使用、估读、单位换算、误差', examHint: '读数估读是常考点', relatedIds: ['phy_kp_0102'] },
    { id: 'phy_kp_0102', subject: 'physics', name: '运动的描述与速度', board: '声光热', grade: '八年级', volume: '八上', chapter: '第1章 机械运动', frequency: 3, difficulty: '基础', questionTypes: ['选择', '填空', '计算'], tags: ['必会'], hotRank: null, desc: '参照物、匀速直线运动 v=s/t、平均速度测量', examHint: 's-t/v-t 图像分析是常考', relatedIds: ['phy_kp_0101'] },
    { id: 'phy_kp_0103', subject: 'physics', name: '声现象（产生与传播）', board: '声光热', grade: '八年级', volume: '八上', chapter: '第2章 声现象', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空'], tags: ['必会'], hotRank: null, desc: '声音由振动产生、需介质传播、真空不能传声、声速', examHint: '月面/太空情境判断（真空中不传声）', relatedIds: ['phy_kp_0104'] },
    { id: 'phy_kp_0104', subject: 'physics', name: '声音的特性与噪声', board: '声光热', grade: '八年级', volume: '八上', chapter: '第2章 声现象', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空'], tags: ['必会', '易错'], hotRank: null, desc: '音调（频率）、响度（振幅）、音色（材料结构）；噪声防治三途径', examHint: '"闻其声知其人"考音色', relatedIds: ['phy_kp_0103'] },
    { id: 'phy_kp_0105', subject: 'physics', name: '物态变化', board: '声光热', grade: '八年级', volume: '八上', chapter: '第3章 物态变化', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '简答'], tags: ['必会', '常考变形'], hotRank: null, desc: '六种物态变化、吸放热、熔点沸点、晶体非晶体', examHint: '航天返回舱"防热衣"熔化/汽化吸热情境题', relatedIds: ['phy_kp_0325'] },
    { id: 'phy_kp_0106', subject: 'physics', name: '光的直线传播与反射', board: '声光热', grade: '八年级', volume: '八上', chapter: '第4章 光现象', frequency: 3, difficulty: '基础', questionTypes: ['选择', '填空', '作图'], tags: ['必会'], hotRank: null, desc: '光沿直线传播、反射定律、镜面/漫反射', examHint: '作反射光路图', relatedIds: ['phy_kp_0107'] },
    { id: 'phy_kp_0107', subject: 'physics', name: '平面镜成像', board: '声光热', grade: '八年级', volume: '八上', chapter: '第4章 光现象', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空', '作图', '实验'], tags: ['必会'], hotRank: null, desc: '平面镜成像特点（等大、等距、垂直、虚像）、实验探究', examHint: '"探究平面镜成像特点"实验题', relatedIds: ['phy_kp_0106'] },
    { id: 'phy_kp_0108', subject: 'physics', name: '光的折射与色散', board: '声光热', grade: '八年级', volume: '八上', chapter: '第4章 光现象', frequency: 2, difficulty: '中档', questionTypes: ['选择', '填空', '作图'], tags: ['常考变形'], hotRank: null, desc: '折射规律、生活中的折射现象、光的色散', examHint: '池水变浅、海市蜃楼等生活情境', relatedIds: ['phy_kp_0106'] },
    { id: 'phy_kp_0109', subject: 'physics', name: '透镜及其应用（凸透镜成像规律）', board: '声光热', grade: '八年级', volume: '八上', chapter: '第5章 透镜及其应用', frequency: 4, difficulty: '中档', questionTypes: ['选择', '填空', '作图', '实验'], tags: ['必会', '常考变形'], hotRank: 5, desc: '凸透镜对光会聚、成像规律（u>2f 等）、照相机投影仪放大镜', examHint: '成像规律实验与生活应用高频', relatedIds: ['phy_kp_0108'] },
    { id: 'phy_kp_0110', subject: 'physics', name: '质量及其测量', board: '声光热', grade: '八年级', volume: '八上', chapter: '第6章 质量与密度', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空'], tags: ['必会'], hotRank: null, desc: '质量是物体属性、天平使用（放平、归零、左物右码）', examHint: '天平操作正误判断', relatedIds: ['phy_kp_0111'] },
    { id: 'phy_kp_0111', subject: 'physics', name: '密度', board: '声光热', grade: '八年级', volume: '八上', chapter: '第6章 质量与密度', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '计算'], tags: ['必会'], hotRank: null, desc: '密度 ρ=m/V、单位换算、密度是物质特性', examHint: '鉴别物质、空心实心判断', relatedIds: ['phy_kp_0110'] },
    { id: 'phy_kp_0112', subject: 'physics', name: '密度测量实验', board: '实验', grade: '八年级', volume: '八上', chapter: '第6章 质量与密度', frequency: 4, difficulty: '中档', questionTypes: ['实验'], tags: ['必会', '常考变形'], hotRank: 4, desc: '天平量筒测固体/液体密度、误差分析（先测体积后测质量偏大）', examHint: '2027 实验探究题常客', relatedIds: ['phy_kp_0111'] },
    { id: 'phy_kp_0213', subject: 'physics', name: '力（弹力、重力）', board: '力学', grade: '八年级', volume: '八下', chapter: '第7章 力', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空', '作图'], tags: ['必会'], hotRank: null, desc: '力的作用效果、弹力、重力 G=mg、重心、力的示意图', examHint: '画力的示意图是作图题常客', relatedIds: ['phy_kp_0214'] },
    { id: 'phy_kp_0214', subject: 'physics', name: '摩擦力', board: '力学', grade: '八年级', volume: '八下', chapter: '第8章 运动和力', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '实验'], tags: ['必会', '易错'], hotRank: null, desc: '滑动摩擦力影响因素（压力、粗糙程度）、增大减小摩擦方法', examHint: '探究影响摩擦力因素实验', relatedIds: ['phy_kp_0215'] },
    { id: 'phy_kp_0215', subject: 'physics', name: '牛顿第一定律与惯性', board: '力学', grade: '八年级', volume: '八下', chapter: '第8章 运动和力', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空'], tags: ['必会'], hotRank: null, desc: '牛顿第一定律、惯性（一切物体都有惯性）、力与运动关系', examHint: '安全带/刹车惯性情境，月球重力 1/6 辨析', relatedIds: ['phy_kp_0213'] },
    { id: 'phy_kp_0216', subject: 'physics', name: '二力平衡', board: '力学', grade: '八年级', volume: '八下', chapter: '第8章 运动和力', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空'], tags: ['必会'], hotRank: null, desc: '平衡状态、二力平衡条件（同体、等大、反向、共线）', examHint: '与相互作用力辨析', relatedIds: ['phy_kp_0215'] },
    { id: 'phy_kp_0217', subject: 'physics', name: '压强（固体）', board: '力学', grade: '八年级', volume: '八下', chapter: '第9章 压强', frequency: 4, difficulty: '中档', questionTypes: ['选择', '填空', '计算'], tags: ['必会', '常考变形'], hotRank: 6, desc: '压强 p=F/S、增大减小压强方法、压力与重力区别', examHint: '月球车车轮宽大/凸棱的压强分析', relatedIds: ['phy_kp_0218'] },
    { id: 'phy_kp_0218', subject: 'physics', name: '液体压强与大气压强', board: '力学', grade: '八年级', volume: '八下', chapter: '第9章 压强', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '计算'], tags: ['必会'], hotRank: null, desc: '液体压强 p=ρgh、连通器、大气压测量（托里拆利）、气压与沸点', examHint: '液体压强随深度增大、连通器应用', relatedIds: ['phy_kp_0217'] },
    { id: 'phy_kp_0219', subject: 'physics', name: '浮力与阿基米德原理', board: '力学', grade: '八年级', volume: '八下', chapter: '第10章 浮力', frequency: 5, difficulty: '压轴', questionTypes: ['选择', '填空', '实验', '计算'], tags: ['必会', '压轴', '常考变形'], hotRank: 1, desc: '浮力产生原因、阿基米德原理 F浮=ρ液gV排、称重法测浮力', examHint: '力学计算压轴核心，常与压强、功结合', relatedIds: ['phy_kp_0220', 'phy_kp_0218'] },
    { id: 'phy_kp_0220', subject: 'physics', name: '物体的浮沉条件及应用', board: '力学', grade: '八年级', volume: '八下', chapter: '第10章 浮力', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '计算'], tags: ['必会'], hotRank: null, desc: '浮沉条件（ρ液与ρ物比较）、轮船/潜水艇/气球原理', examHint: '同一物体在不同液体中浮沉比较', relatedIds: ['phy_kp_0219'] },
    { id: 'phy_kp_0221', subject: 'physics', name: '功与功率', board: '力学', grade: '八年级', volume: '八下', chapter: '第11章 功和机械能', frequency: 4, difficulty: '中档', questionTypes: ['选择', '填空', '计算'], tags: ['必会', '常考变形'], hotRank: 7, desc: '做功两要素、W=Fs、功率 P=W/t、P=Fv', examHint: '机械装置做功功率计算', relatedIds: ['phy_kp_0223'] },
    { id: 'phy_kp_0222', subject: 'physics', name: '机械能及其转化', board: '力学', grade: '八年级', volume: '八下', chapter: '第11章 功和机械能', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空'], tags: ['必会'], hotRank: null, desc: '动能、重力势能、弹性势能及相互转化、机械能守恒', examHint: '过山车/蹦极能量转化判断', relatedIds: ['phy_kp_0221'] },
    { id: 'phy_kp_0223', subject: 'physics', name: '杠杆', board: '力学', grade: '八年级', volume: '八下', chapter: '第12章 简单机械', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '作图', '实验'], tags: ['必会'], hotRank: null, desc: '杠杆五要素、平衡条件 F₁L₁=F₂L₂、省力费力杠杆、力臂作图', examHint: '画力臂作图 + 杠杆平衡条件应用', relatedIds: ['phy_kp_0224'] },
    { id: 'phy_kp_0224', subject: 'physics', name: '滑轮与机械效率', board: '力学', grade: '八年级', volume: '八下', chapter: '第12章 简单机械', frequency: 4, difficulty: '中档', questionTypes: ['选择', '填空', '计算', '实验'], tags: ['必会', '常考变形'], hotRank: 8, desc: '定/动滑轮、滑轮组、有用功额外功总功、η=W有/W总', examHint: '机械效率计算与实验（测滑轮组效率）', relatedIds: ['phy_kp_0223', 'phy_kp_0221'] },
    { id: 'phy_kp_0325', subject: 'physics', name: '内能与热传递', board: '声光热', grade: '九年级', volume: '九全', chapter: '第13章 内能', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空'], tags: ['必会'], hotRank: null, desc: '内能概念、改变内能两方式（做功/热传递）、热量', examHint: '航天返回舱摩擦生热情境', relatedIds: ['phy_kp_0326'] },
    { id: 'phy_kp_0326', subject: 'physics', name: '比热容与热量的计算', board: '声光热', grade: '九年级', volume: '九全', chapter: '第13章 内能', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '计算'], tags: ['必会', '常考变形'], hotRank: null, desc: '比热容是物质属性、Q=cmΔt、水的比热容大及应用', examHint: '沿海昼夜温差小（水的比热容大）', relatedIds: ['phy_kp_0325'] },
    { id: 'phy_kp_0327', subject: 'physics', name: '热机与内能的利用', board: '声光热', grade: '九年级', volume: '九全', chapter: '第14章 内能的利用', frequency: 3, difficulty: '基础', questionTypes: ['选择', '填空', '计算'], tags: ['必会'], hotRank: null, desc: '热机四冲程、能量转化、热值 q、热机效率', examHint: '四冲程判断与热值计算', relatedIds: ['phy_kp_0326'] },
    { id: 'phy_kp_0328', subject: 'physics', name: '电流、电路与串并联', board: '电学', grade: '九年级', volume: '九全', chapter: '第15章 电流和电路', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空', '作图'], tags: ['必会'], hotRank: null, desc: '电荷、电流方向、电路组成、串并联识别、电路图', examHint: '电路图与实物图互画', relatedIds: ['phy_kp_0329'] },
    { id: 'phy_kp_0329', subject: 'physics', name: '电流电压电阻', board: '电学', grade: '九年级', volume: '九全', chapter: '第16章 电压 电阻', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空'], tags: ['必会'], hotRank: null, desc: '电流表电压表使用、串并联电压电流规律、电阻影响因素', examHint: '电表读数与连接正误判断', relatedIds: ['phy_kp_0330'] },
    { id: 'phy_kp_0330', subject: 'physics', name: '欧姆定律及其应用', board: '电学', grade: '九年级', volume: '九全', chapter: '第17章 欧姆定律', frequency: 5, difficulty: '压轴', questionTypes: ['选择', '填空', '实验', '计算'], tags: ['必会', '压轴', '常考变形'], hotRank: 2, desc: 'I=U/R、伏安法测电阻、串并联电阻规律、动态电路分析', examHint: '电学核心，实验+计算双考', relatedIds: ['phy_kp_0329'] },
    { id: 'phy_kp_0331', subject: 'physics', name: '电功率', board: '电学', grade: '九年级', volume: '九全', chapter: '第18章 电功率', frequency: 5, difficulty: '压轴', questionTypes: ['选择', '填空', '实验', '计算'], tags: ['必会', '压轴', '常考变形'], hotRank: 3, desc: 'P=UI、额定功率实际功率、测小灯泡功率实验、电功 W=Pt', examHint: '多档位用电器计算压轴主力', relatedIds: ['phy_kp_0330', 'phy_kp_0332'] },
    { id: 'phy_kp_0332', subject: 'physics', name: '焦耳定律', board: '电学', grade: '九年级', volume: '九全', chapter: '第18章 电功率', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空', '计算'], tags: ['必会'], hotRank: null, desc: 'Q=I²Rt、电热器、电流热效应', examHint: '电热综合计算常与电功率结合', relatedIds: ['phy_kp_0331'] },
    { id: 'phy_kp_0333', subject: 'physics', name: '家庭电路与安全用电', board: '电学', grade: '九年级', volume: '九全', chapter: '第19章 生活用电', frequency: 2, difficulty: '基础', questionTypes: ['选择', '填空'], tags: ['必会'], hotRank: null, desc: '家庭电路组成、保险丝/空气开关、安全用电原则', examHint: '触电事故判断与预防', relatedIds: ['phy_kp_0328'] },
    { id: 'phy_kp_0334', subject: 'physics', name: '电与磁（电磁感应、电动机）', board: '电学', grade: '九年级', volume: '九全', chapter: '第20章 电与磁', frequency: 3, difficulty: '中档', questionTypes: ['选择', '填空'], tags: ['必会'], hotRank: null, desc: '磁场、电流磁效应、电磁铁、电动机（通电导线在磁场中受力）、发电机（电磁感应）', examHint: '电动机与发电机原理辨析（有无电源）', relatedIds: ['phy_kp_0328'] }
  ];

  const hotTop10 = knowledgePoints
    .filter(k => k.frequency >= 3)
    .sort((a, b) => (b.frequency - a.frequency) || ((a.hotRank || 99) - (b.hotRank || 99)))
    .slice(0, 10);

  const easyMistakes = knowledgePoints
    .filter(k => k.tags.indexOf('易错') !== -1)
    .map(k => ({ id: k.id, title: k.name, advice: k.examHint }));

  /* ================= 二、题库（48 题：选择14 / 填空10 / 作图6 / 实验8 / 计算10） ================= */
  const questions = [
    /* ---------- 选择题 ---------- */
    { id: 'phy_q_0001', subject: 'physics', type: '选择', kpId: 'phy_kp_0102', difficulty: 1, stem: '下列估测最接近实际的是（　）', options: ['A．中学生步行的速度约为 1.1 m/s', 'B．人感觉舒适的温度约为 40℃', 'C．一个鸡蛋的质量约为 500 g', 'D．教室门的高度约为 3 m'], answer: 'A', analysis: ['A 步行速度约 1.1 m/s ✓', 'B 舒适温度约 25℃，40℃ 偏热', 'C 鸡蛋约 50 g', 'D 门高约 2 m'], pitfall: '生活常识估测：速度 1m/s 左右、鸡蛋 50g、门高 2m', variant: { stem: '一支新铅笔长度约为？', answer: '18 cm', analysis: ['标准铅笔约 18 cm'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'phy_q_0002', subject: 'physics', type: '选择', kpId: 'phy_kp_0102', difficulty: 1, stem: '在匀速直线运动中，下列关于速度 v=s/t 的说法正确的是（　）', options: ['A．路程越大速度越大', 'B．速度与路程成正比，与时间成反比', 'C．速度是描述物体运动快慢的物理量', 'D．时间越短速度越大'], answer: 'C', analysis: ['匀速直线运动中速度是定值，与路程时间无关', '速度是表示运动快慢的物理量，选 C'], pitfall: '匀速运动 v 恒定，s/t 只是计算式', variant: { stem: '速度 5 m/s 表示？', answer: '每秒通过 5 米', analysis: ['v = 5 m/s 即每秒运动 5 m'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'phy_q_0003', subject: 'physics', type: '选择', kpId: 'phy_kp_0103', difficulty: 1, stem: '在月球上，两个宇航员不能直接对话，必须借助无线电，这是因为（　）', options: ['A．月球上没有空气，声音不能传播', 'B．月球上温度太低', 'C．月球上声音传播速度太慢', 'D．宇航员距离太远'], answer: 'A', analysis: ['声音传播需要介质，真空不能传声', '月球表面没有空气，故选 A'], pitfall: '电磁波可在真空传播，声音不能', variant: { stem: '声音在哪种介质中传播最快？', answer: '固体（钢铁）', analysis: ['v固 > v液 > v气'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'phy_q_0004', subject: 'physics', type: '选择', kpId: 'phy_kp_0104', difficulty: 1, stem: '"闻其声而知其人"，主要是根据声音的哪个特性判断的（　）', options: ['A．音调', 'B．响度', 'C．音色', 'D．声速'], answer: 'C', analysis: ['不同人发声的音色不同', '根据音色辨别发声体，选 C'], pitfall: '音调是高低、响度是大小、音色是品质', variant: { stem: '女高音与男低音主要是哪个特性不同？', answer: '音调', analysis: ['高低不同即音调不同'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'phy_q_0005', subject: 'physics', type: '选择', kpId: 'phy_kp_0105', difficulty: 1, stem: '下列物态变化中，属于熔化现象的是（　）', options: ['A．春天冰雪消融', 'B．夏天露珠形成', 'C．秋天霜的形成', 'D．冬天河水结冰'], answer: 'A', analysis: ['A 冰雪→水，固态变液态是熔化 ✓', 'B 露是液化', 'C 霜是凝华', 'D 结冰是凝固'], pitfall: '六种物态变化：熔化/凝固/汽化/液化/升华/凝华', variant: { stem: '冰棒"冒白气"属于？', answer: '液化', analysis: ['水蒸气遇冷液化成小水珠'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'phy_q_0006', subject: 'physics', type: '选择', kpId: 'phy_kp_0106', difficulty: 1, stem: '下列现象中，属于光的反射的是（　）', options: ['A．小孔成像', 'B．水中"倒影"', 'C．海市蜃楼', 'D．雨后彩虹'], answer: 'B', analysis: ['A 小孔成像——光沿直线传播', 'B 倒影——平面镜成像，光的反射 ✓', 'C 海市蜃楼——光的折射', 'D 彩虹——光的色散（折射）'], pitfall: '倒影是反射，池水变浅是折射', variant: { stem: '日食的形成原理是？', answer: '光的直线传播', analysis: ['月球挡住太阳光'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'phy_q_0007', subject: 'physics', type: '选择', kpId: 'phy_kp_0109', difficulty: 1, stem: '当物体距凸透镜 30 cm 时，在光屏上成倒立、放大的实像，则凸透镜焦距可能是（　）', options: ['A．10 cm', 'B．15 cm', 'C．20 cm', 'D．30 cm'], answer: 'C', analysis: ['成倒立放大实像：f < u < 2f', '即 f < 30 < 2f，得 15 < f < 30', '选项中只有 20 cm 符合'], pitfall: '凸透镜成像规律区间要记牢', variant: { stem: 'u=20cm 成倒立缩小实像，则 f 的范围？', answer: 'f < 10 cm', analysis: ['u > 2f，即 20 > 2f，f < 10'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'phy_q_0008', subject: 'physics', type: '选择', kpId: 'phy_kp_0111', difficulty: 1, stem: '关于密度，下列说法正确的是（　）', options: ['A．密度与质量成正比', 'B．密度与体积成反比', 'C．密度是物质的一种特性，与质量体积无关', 'D．同种物质密度一定不变'], answer: 'C', analysis: ['密度是物质的特性，由物质种类决定', '与质量和体积无关，选 C', 'D 错：温度、状态变化时密度会变'], pitfall: '密度是特性，ρ=m/V 是测量式不是决定式', variant: { stem: '一杯水喝掉一半，密度？', answer: '不变', analysis: ['密度是物质特性，与质量无关'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'phy_q_0009', subject: 'physics', type: '选择', kpId: 'phy_kp_0215', difficulty: 1, stem: '关于惯性，下列说法正确的是（　）', options: ['A．静止的物体没有惯性', 'B．物体速度越大惯性越大', 'C．一切物体在任何情况下都有惯性', 'D．只有运动物体才有惯性'], answer: 'C', analysis: ['惯性是物体固有属性，一切物体都有惯性', '惯性只与质量有关，与速度无关，选 C'], pitfall: '惯性大小只与质量有关', variant: { stem: '汽车刹车时乘客前倾是因为？', answer: '惯性', analysis: ['乘客上半身保持原来运动状态'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'phy_q_0010', subject: 'physics', type: '选择', kpId: 'phy_kp_0217', difficulty: 2, stem: '下列做法中，为了增大压强的是（　）', options: ['A．书包背带做得很宽', 'B．铁轨铺在枕木上', 'C．刀刃磨得很薄', 'D．载重汽车装很多轮子'], answer: 'C', analysis: ['增大压强：增大压力或减小受力面积', 'C 刀刃磨薄——减小受力面积增大压强 ✓', '其余均为减小压强'], pitfall: '受力面积小则压强大', variant: { stem: '月球车车轮宽大是为了？', answer: '减小压强', analysis: ['增大受力面积减小对月面压强'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'phy_q_0011', subject: 'physics', type: '选择', kpId: 'phy_kp_0219', difficulty: 2, stem: '同一物体先后浸没在水和盐水中，受到的浮力（　）', options: ['A．在水中大', 'B．在盐水中大', 'C．一样大', 'D．无法比较'], answer: 'B', analysis: ['F浮 = ρ液 g V排，V排 相同（都浸没）', 'ρ盐水 > ρ水，所以盐水中浮力大'], pitfall: '阿基米德原理：浮力与液体密度和排开体积有关', variant: { stem: '轮船从长江驶入大海，浮力？', answer: '不变', analysis: ['始终漂浮，浮力等于重力'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'phy_q_0012', subject: 'physics', type: '选择', kpId: 'phy_kp_0330', difficulty: 2, stem: '一段导体两端电压为 6 V 时电流为 0.3 A，若电压变为 12 V，则导体的电阻为（　）', options: ['A．10 Ω', 'B．20 Ω', 'C．30 Ω', 'D．40 Ω'], answer: 'B', analysis: ['R = U/I = 6/0.3 = 20 Ω', '电阻是导体属性，电压变化电阻不变，仍为 20 Ω'], pitfall: '电阻不变，不能 R=12/0.6 想当然，本题答案仍是 20Ω', variant: { stem: 'U=3V，I=0.15A，R=?', answer: '20 Ω', analysis: ['R = 3/0.15 = 20 Ω'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'phy_q_0013', subject: 'physics', type: '选择', kpId: 'phy_kp_0331', difficulty: 2, stem: '额定功率为 100 W 的灯泡正常工作 10 h 消耗的电能是（　）', options: ['A．0.1 kW·h', 'B．1 kW·h', 'C．10 kW·h', 'D．1000 J'], answer: 'B', analysis: ['W = Pt = 0.1 kW × 10 h = 1 kW·h', '选 B'], pitfall: '注意单位换算：100W = 0.1kW', variant: { stem: '40W 灯泡工作 25h 耗电？', answer: '1 kW·h', analysis: ['0.04 × 25 = 1 kW·h'] }, isOlympiad: false, isHot: true, selfTest: true },
    { id: 'phy_q_0014', subject: 'physics', type: '选择', kpId: 'phy_kp_0334', difficulty: 1, stem: '发电机的工作原理是（　）', options: ['A．电流的磁效应', 'B．电磁感应现象', 'C．通电导线在磁场中受力', 'D．磁场对电流的作用'], answer: 'B', analysis: ['发电机利用电磁感应（磁生电）', '电动机利用通电导线在磁场中受力（电生磁→力）'], pitfall: '电动机有电源、发电机无电源', variant: { stem: '电动机原理？', answer: '通电线圈在磁场中受力转动', analysis: ['磁场对电流的作用'] }, isOlympiad: false, isHot: false, selfTest: true },

    /* ---------- 填空题 ---------- */
    { id: 'phy_q_0015', subject: 'physics', type: '填空', kpId: 'phy_kp_0102', difficulty: 1, stem: '5 m/s = ______ km/h。', options: [], answer: '18', analysis: ['1 m/s = 3.6 km/h', '5 × 3.6 = 18 km/h'], pitfall: '速度单位换算 ×3.6', variant: { stem: '72 km/h = ? m/s', answer: '20', analysis: ['72 ÷ 3.6 = 20'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'phy_q_0016', subject: 'physics', type: '填空', kpId: 'phy_kp_0111', difficulty: 1, stem: '一块冰熔化成水后，质量 ______（填"变大/变小/不变"）。', options: [], answer: '不变', analysis: ['质量是物体属性，与状态无关', '冰→水只是状态变化，质量不变'], pitfall: '质量不随状态、位置、温度改变', variant: { stem: '宇航员从地球到月球，质量？', answer: '不变', analysis: ['质量是物体本身属性'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'phy_q_0017', subject: 'physics', type: '填空', kpId: 'phy_kp_0213', difficulty: 1, stem: '质量为 500 g 的物体所受重力为 ______ N。（g 取 10 N/kg）', options: [], answer: '5', analysis: ['G = mg = 0.5 × 10 = 5 N'], pitfall: '质量单位要换算成 kg', variant: { stem: 'g=10，质量 2 kg 重力？', answer: '20 N', analysis: ['G = 2×10 = 20 N'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'phy_q_0018', subject: 'physics', type: '填空', kpId: 'phy_kp_0218', difficulty: 2, stem: '潜水员在 10 m 深的水下，受到水的压强为 ______ Pa。（ρ水=1.0×10³ kg/m³，g=10 N/kg）', options: [], answer: '1.0×10⁵', analysis: ['p = ρgh = 1.0×10³ × 10 × 10 = 1.0×10⁵ Pa'], pitfall: '液体压强公式 p=ρgh，深度是到液面的距离', variant: { stem: '水深 5 m，底部压强？', answer: '5×10⁴ Pa', analysis: ['ρgh = 10³×10×5 = 5×10⁴'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0019', subject: 'physics', type: '填空', kpId: 'phy_kp_0326', difficulty: 2, stem: '质量为 2 kg 的水温度升高 10℃，吸收的热量为 ______ J。[c水=4.2×10³ J/(kg·℃)]', options: [], answer: '8.4×10⁴', analysis: ['Q = cmΔt = 4.2×10³ × 2 × 10 = 8.4×10⁴ J'], pitfall: '公式 Q=cmΔt，注意 Δt 是温度变化量', variant: { stem: '1kg 水升高 5℃ 吸热？', answer: '2.1×10⁴ J', analysis: ['4.2×10³ × 1 × 5 = 2.1×10⁴'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0020', subject: 'physics', type: '填空', kpId: 'phy_kp_0327', difficulty: 1, stem: '热机四个冲程中，将内能转化为机械能的是 ______ 冲程。', options: [], answer: '做功', analysis: ['做功冲程燃气推动活塞，内能→机械能', '压缩冲程机械能→内能'], pitfall: '压缩冲程与做功冲程能量转化相反', variant: { stem: '将机械能转化为内能的冲程？', answer: '压缩', analysis: ['压缩气体做功，内能增大'] }, isOlympiad: false, isHot: false, selfTest: true },
    { id: 'phy_q_0021', subject: 'physics', type: '填空', kpId: 'phy_kp_0330', difficulty: 2, stem: '两个电阻 R₁=10 Ω、R₂=20 Ω 串联，总电阻为 ______ Ω；并联总电阻为 ______ Ω。', options: [], answer: '30；20/3（约 6.67）', analysis: ['串联：R = R₁+R₂ = 30 Ω', '并联：1/R = 1/10 + 1/20 = 3/20，R = 20/3 Ω'], pitfall: '并联电阻小于任何一个分电阻', variant: { stem: '两个 6Ω 电阻并联，总电阻？', answer: '3 Ω', analysis: ['R = R/n = 6/2 = 3 Ω'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0022', subject: 'physics', type: '填空', kpId: 'phy_kp_0331', difficulty: 2, stem: '标有"220V 100W"的灯泡正常发光时的电流约为 ______ A。（保留两位小数）', options: [], answer: '0.45', analysis: ['I = P/U = 100/220 ≈ 0.45 A'], pitfall: '额定电流用额定功率额定电压计算', variant: { stem: '"220V 40W"的电流？', answer: '约 0.18 A', analysis: ['40/220 ≈ 0.18 A'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0023', subject: 'physics', type: '填空', kpId: 'phy_kp_0219', difficulty: 2, stem: '体积为 0.1 m³ 的物体完全浸没在水中，受到的浮力为 ______ N。（g=10 N/kg）', options: [], answer: '1000', analysis: ['F浮 = ρ水 g V排 = 1.0×10³ × 10 × 0.1 = 1000 N'], pitfall: '完全浸没 V排 = V物', variant: { stem: 'V排=0.02m³ 在水中浮力？', answer: '200 N', analysis: ['10³×10×0.02 = 200 N'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0024', subject: 'physics', type: '填空', kpId: 'phy_kp_0221', difficulty: 2, stem: '用 50 N 的水平力推着重 100 N 的物体沿水平方向前进 4 m，推力做功 ______ J，重力做功 ______ J。', options: [], answer: '200；0', analysis: ['W = Fs = 50 × 4 = 200 J', '重力方向竖直向下，物体水平移动，重力不做功 W=0'], pitfall: '做功两要素：力 + 在力的方向上移动距离', variant: { stem: '举高 2 m，重力 10 N，克服重力做功？', answer: '20 J', analysis: ['W = Gh = 10×2 = 20 J'] }, isOlympiad: false, isHot: true, selfTest: false },

    /* ---------- 作图题 ---------- */
    { id: 'phy_q_0025', subject: 'physics', type: '作图', kpId: 'phy_kp_0106', difficulty: 1, stem: '画出图中入射光线 AO 经平面镜反射后的反射光线 OB，并标出反射角。', options: [], answer: '按反射定律作图：反射角 = 入射角', analysis: ['过入射点 O 作法线（垂直于镜面）', '反射光线与法线夹角（反射角）等于入射角', '标出反射角'], pitfall: '法线用虚线，入射角反射角是光线与法线夹角', variant: { stem: '光从空气斜射入水中，画出折射光线大致方向', answer: '折射光线向法线偏折', analysis: ['光从空气斜射入水，折射角小于入射角，向法线偏折'] }, isOlympiad: false, isHot: false, selfTest: false },
    { id: 'phy_q_0026', subject: 'physics', type: '作图', kpId: 'phy_kp_0109', difficulty: 2, stem: '画出经过凸透镜的两条特殊光线（平行于主光轴的光线和过光心的光线）的折射光线。', options: [], answer: '平行光线→过焦点；过光心光线→方向不变', analysis: ['平行于主光轴的光线经凸透镜折射后过焦点', '过光心的光线传播方向不变'], pitfall: '凹透镜平行光线发散，折射光线的反向延长线过虚焦点', variant: { stem: '画出经凹透镜平行光线折射后的光路', answer: '发散，反向延长线过虚焦点', analysis: ['平行光经凹透镜发散，出射光线的反向延长线过虚焦点'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0027', subject: 'physics', type: '作图', kpId: 'phy_kp_0213', difficulty: 1, stem: '画出重为 20 N 的物体所受重力的示意图（作用点画在重心 O 上）。', options: [], answer: '竖直向下的箭头，标注 G=20N', analysis: ['重力方向竖直向下', '从重心 O 沿竖直向下方向画带箭头的线段，标 G=20N'], pitfall: '重力方向是竖直向下，不是垂直斜面向下', variant: { stem: '画出静止在斜面上的物体受到的摩擦力方向', answer: '沿斜面向上', analysis: ['摩擦力与相对运动趋势相反，沿斜面向上'] }, isOlympiad: false, isHot: false, selfTest: false },
    { id: 'phy_q_0028', subject: 'physics', type: '作图', kpId: 'phy_kp_0223', difficulty: 2, stem: '画出图中杠杆的动力臂 L₁ 和阻力臂 L₂。', options: [], answer: '从支点向力的作用线作垂线段', analysis: ['确定支点 O', '从支点分别向动力、阻力的作用线作垂线', '垂线段即力臂，用虚线+垂直符号'], pitfall: '力臂是从支点到力的作用线的距离，不是到作用点的距离', variant: { stem: '力臂为零说明什么？', answer: '力的作用线过支点，该力对杠杆转动无影响', analysis: ['力臂为 0，该力不产生转动效果'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0029', subject: 'physics', type: '作图', kpId: 'phy_kp_0328', difficulty: 1, stem: '根据电路图连接实物图：两盏灯 L₁、L₂ 并联，开关 S 控制整个电路。', options: [], answer: '并联连接，S 在干路', analysis: ['先连电源正极→开关 S→在 L₁、L₂ 并联点分支', '两灯分别连回电源负极', '确保 S 在干路控制全部'], pitfall: '并联要"先串后并"，分支点要画清', variant: { stem: '画两个开关分别控制两盏灯的电路图', answer: '两灯并联，各支路串联一个开关', analysis: ['S₁ 与 L₁ 串联，S₂ 与 L₂ 串联，两支路并联'] }, isOlympiad: false, isHot: false, selfTest: false },
    { id: 'phy_q_0030', subject: 'physics', type: '作图', kpId: 'phy_kp_0333', difficulty: 1, stem: '将三孔插座、开关和灯泡正确接入家庭电路。', options: [], answer: '开关接火线，灯泡接开关与零线之间，三孔插座左零右火上接地', analysis: ['开关接火线，断开开关灯座不带电', '灯泡：火线→开关→灯泡→零线', '三孔插座：左零右火上接地'], pitfall: '开关必须接火线；三孔插座上孔接地', variant: { stem: '测电笔使用方法？', answer: '手接触笔尾金属体', analysis: ['笔尖接触被测导线，手触笔尾金属体，氖管发光为火线'] }, isOlympiad: false, isHot: false, selfTest: false },

    /* ---------- 实验探究题 ---------- */
    { id: 'phy_q_0031', subject: 'physics', type: '实验', kpId: 'phy_kp_0112', difficulty: 2, stem: '小明用天平和量筒测量小石块的密度。(1) 天平放在水平台上，游码归零后发现指针偏左，应将平衡螺母向____调；(2) 测得石块质量 52 g，量筒中水 20 mL，放入石块后示数 40 mL，求石块密度。', options: [], answer: '右；2.6×10³ kg/m³', analysis: ['(1) 指针偏左说明左盘重，平衡螺母向右调', '(2) V石 = 40 - 20 = 20 mL = 20 cm³', 'ρ = m/V = 52/20 = 2.6 g/cm³ = 2.6×10³ kg/m³'], pitfall: '天平调节"左偏右调"；排水法测体积', variant: { stem: '测液体密度先测总质量再倒出测剩余，为什么？', answer: '避免挂壁液体导致误差', analysis: ['先测总质量，倒出部分测剩余质量，差值即倒出液体质量，减小误差'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0032', subject: 'physics', type: '实验', kpId: 'phy_kp_0107', difficulty: 2, stem: '在"探究平面镜成像特点"实验中：(1) 用玻璃板代替平面镜的目的是什么？(2) 实验用两段相同的蜡烛是为了比较什么关系？(3) 移去蜡烛 B 放光屏，光屏上能否承接到像？', options: [], answer: '便于确定像的位置；像与物大小关系；不能（成虚像）', analysis: ['玻璃板透明，能透过它看到后面的蜡烛，便于确定像的位置', 'B 与 A 的像完全重合，说明像与物等大', '平面镜成虚像，光屏不能承接'], pitfall: '虚像不能用光屏承接', variant: { stem: '若玻璃板未与桌面垂直，会怎样？', answer: '像与蜡烛 B 无法完全重合', analysis: ['像偏高或偏低，无法确定像的位置'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0033', subject: 'physics', type: '实验', kpId: 'phy_kp_0109', difficulty: 2, stem: '在"探究凸透镜成像规律"实验中，蜡烛、凸透镜、光屏依次放在光具座上。(1) 实验前要调节烛焰、凸透镜、光屏中心在同一高度，目的是什么？(2) 当蜡烛在 2f 之外时，光屏上成什么像？', options: [], answer: '使像成在光屏中央；倒立、缩小的实像', analysis: ['三心同高，像才能成在光屏中央', 'u > 2f 时成倒立缩小实像（照相机原理）'], pitfall: 'u>2f 缩小；f<u<2f 放大；u<f 虚像', variant: { stem: '光屏上成清晰的像后，蜡烛靠近凸透镜，光屏应向哪个方向移动？', answer: '远离凸透镜', analysis: ['物近像远像变大'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0034', subject: 'physics', type: '实验', kpId: 'phy_kp_0214', difficulty: 2, stem: '在"探究滑动摩擦力大小与什么因素有关"实验中，用弹簧测力计水平拉动木块做匀速直线运动。(1) 为什么必须匀速拉动？(2) 对比甲乙两次实验（压力不同），可得出什么结论？', options: [], answer: '使摩擦力等于拉力（二力平衡）；接触面粗糙程度相同时，压力越大滑动摩擦力越大', analysis: ['匀速直线运动时木块受力平衡，f = F拉', '控制接触面粗糙程度相同，改变压力，比较摩擦力'], pitfall: '必须沿水平方向匀速直线拉动', variant: { stem: '木块上放砝码增大了什么？', answer: '压力', analysis: ['增大对接触面的压力，摩擦力增大'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0035', subject: 'physics', type: '实验', kpId: 'phy_kp_0330', difficulty: 3, stem: '用伏安法测电阻 Rₓ：(1) 画出实验电路图（电源、开关、电流表、电压表、滑动变阻器、定值电阻串联）；(2) 滑动变阻器的作用是什么？(3) 若电流表示数为 0.2 A，电压表示数为 3 V，求 Rₓ。', options: [], answer: '见解析；保护电路 + 多次测量取平均值减小误差；15 Ω', analysis: ['(1) 电路图：电压表并联在 Rₓ 两端，其余串联', '(2) 滑动变阻器：保护电路；改变 Rₓ 两端电压多次测量', '(3) R = U/I = 3/0.2 = 15 Ω'], pitfall: '电压表并联、电流表串联，正负接线柱不能接反', variant: { stem: '测量小灯泡电阻实验中多次测量的目的？', answer: '探究灯丝电阻随温度变化规律', analysis: ['不能取平均（电阻变化），而是发现规律'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0036', subject: 'physics', type: '实验', kpId: 'phy_kp_0331', difficulty: 3, stem: '在"测量小灯泡额定功率"实验中，小灯泡标有"2.5V"字样。(1) 闭合开关前滑动变阻器滑片应放在____端；(2) 当电压表示数为 2.5 V 时，电流表示数为 0.3 A，求小灯泡额定功率；(3) 若电压表 0~3V 量程损坏，只有 0~15V，应如何操作？', options: [], answer: '阻值最大端；0.75 W；将电压表并联在滑动变阻器两端，示数调到 4.5V-2.5V=2V', analysis: ['闭合前滑片置于阻值最大处保护电路', 'P = UI = 2.5 × 0.3 = 0.75 W', '电源约 4.5V 时，滑阻电压 = 4.5 - 2.5 = 2 V，改测滑阻电压'], pitfall: '额定功率 = 额定电压 × 额定电流', variant: { stem: '灯泡亮度由什么决定？', answer: '实际功率', analysis: ['实际功率越大灯越亮'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0037', subject: 'physics', type: '实验', kpId: 'phy_kp_0219', difficulty: 3, stem: '在"探究浮力大小与哪些因素有关"实验中：(1) 用称重法测浮力，需要记录哪些数据？(2) 探究浮力与排开液体体积的关系时，应控制什么不变？(3) 实验结论是什么？', options: [], answer: '物体重力 G 和浸入液体后弹簧测力计示数 F；液体密度不变；浮力大小与排开液体体积和液体密度有关（F浮=ρ液gV排）', analysis: ['F浮 = G - F（称重法）', '控制液体密度相同，改变物体浸入体积', '归纳：物体浸入体积越大浮力越大；液体密度越大浮力越大'], pitfall: '控制变量法的"控制"对象', variant: { stem: '物体浸没后继续下沉，浮力如何变化？', answer: '不变', analysis: ['浸没后 V排 不变，浮力不变'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0038', subject: 'physics', type: '实验', kpId: 'phy_kp_0224', difficulty: 3, stem: '在"测滑轮组机械效率"实验中，用弹簧测力计竖直向上匀速拉动绳子自由端。(1) 为什么匀速？(2) 若钩码重 2 N，上升 0.1 m，拉力 0.8 N，绳子自由端移动 0.3 m，求机械效率。', options: [], answer: '使拉力稳定便于读数；约 83.3%', analysis: ['匀速拉动使弹簧测力计示数稳定', 'W有 = Gh = 2 × 0.1 = 0.2 J', 'W总 = Fs = 0.8 × 0.3 = 0.24 J', 'η = W有/W总 = 0.2/0.24 ≈ 83.3%'], pitfall: '绳子自由端移动距离与钩码上升距离关系 s=nh', variant: { stem: '增加钩码个数，机械效率如何变化？', answer: '变大', analysis: ['有用功占比增大，额外功基本不变'] }, isOlympiad: false, isHot: true, selfTest: false },

    /* ---------- 计算题 ---------- */
    { id: 'phy_q_0039', subject: 'physics', type: '计算', kpId: 'phy_kp_0102', difficulty: 1, stem: '一列火车长 200 m，以 20 m/s 的速度完全通过一座 1000 m 长的大桥，求火车完全通过大桥所需时间。', options: [], answer: '60 s', analysis: ['完全通过大桥的总路程 s = 桥长 + 车长 = 1000 + 200 = 1200 m', 't = s/v = 1200/20 = 60 s'], pitfall: '"完全通过"路程 = 桥长 + 车长', variant: { stem: '火车在桥上（完全在桥上）时间？', answer: '40 s', analysis: ['s = 1000 - 200 = 800 m，t = 800/20 = 40 s'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0040', subject: 'physics', type: '计算', kpId: 'phy_kp_0111', difficulty: 2, stem: '一个空瓶质量为 200 g，装满水后总质量为 700 g，装满某种液体后总质量为 600 g。求该液体的密度。', options: [], answer: '0.8×10³ kg/m³', analysis: ['m水 = 700 - 200 = 500 g，V瓶 = m水/ρ水 = 500/1 = 500 cm³', 'm液 = 600 - 200 = 400 g', 'ρ液 = m液/V瓶 = 400/500 = 0.8 g/cm³ = 0.8×10³ kg/m³'], pitfall: '同瓶同体积，用等体积法', variant: { stem: '装满水 700g，装满酒精（0.8g/cm³）总质量？', answer: '600 g', analysis: ['m酒 = 0.8×500 = 400 g，总 200+400=600 g'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0041', subject: 'physics', type: '计算', kpId: 'phy_kp_0217', difficulty: 2, stem: '质量为 60 kg 的人站立在水平地面上，双脚与地面总接触面积为 400 cm²，求人对地面的压强。（g=10 N/kg）', options: [], answer: '1.5×10⁴ Pa', analysis: ['F = G = mg = 60 × 10 = 600 N', 'S = 400 cm² = 0.04 m²', 'p = F/S = 600/0.04 = 1.5×10⁴ Pa'], pitfall: '单位换算：1 cm² = 10⁻⁴ m²', variant: { stem: '单脚站立时压强是双脚的几倍？', answer: '2 倍', analysis: ['受力面积减半，压强翻倍'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0042', subject: 'physics', type: '计算', kpId: 'phy_kp_0219', difficulty: 3, stem: '一个边长为 0.1 m 的正方体木块漂浮在水面上，露出水面的体积为总体积的 2/5。（ρ水=1.0×10³ kg/m³，g=10 N/kg）求：(1) 木块受到的浮力；(2) 木块的密度。', options: [], answer: '6 N；0.6×10³ kg/m³', analysis: ['V木 = 0.1³ = 10⁻³ m³，V排 = 3/5 × 10⁻³ = 6×10⁻⁴ m³', 'F浮 = ρ水gV排 = 10³×10×6×10⁻⁴ = 6 N', '漂浮：F浮 = G = ρ木gV木，ρ木 = F浮/(gV木) = 6/(10×10⁻³) = 0.6×10³ kg/m³'], pitfall: '漂浮时浮力等于重力；浸入体积占比 = 密度比', variant: { stem: '木块密度 0.6g/cm³ 漂浮时露出体积占比？', answer: '2/5', analysis: ['露出占比 = 1 - ρ物/ρ液 = 1 - 0.6 = 0.4'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0043', subject: 'physics', type: '计算', kpId: 'phy_kp_0218', difficulty: 2, stem: '一个底面积为 0.02 m² 的圆柱形容器装有 0.2 m 深的水，求容器底部受到水的压强和压力。（ρ水=1.0×10³ kg/m³，g=10 N/kg）', options: [], answer: '2000 Pa；40 N', analysis: ['p = ρgh = 10³ × 10 × 0.2 = 2000 Pa', 'F = pS = 2000 × 0.02 = 40 N'], pitfall: '液体对容器底压力 F=pS，不一定等于液体重力', variant: { stem: '深度增加到 0.3m，压强？', answer: '3000 Pa', analysis: ['10³×10×0.3 = 3000 Pa'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0044', subject: 'physics', type: '计算', kpId: 'phy_kp_0221', difficulty: 2, stem: '一台起重机将重 5000 N 的货物匀速提升 10 m，用时 20 s。求：(1) 起重机做的有用功；(2) 提升货物的功率。', options: [], answer: '5×10⁴ J；2.5×10³ W', analysis: ['W = Gh = 5000 × 10 = 5×10⁴ J', 'P = W/t = 5×10⁴/20 = 2.5×10³ W'], pitfall: '匀速提升时拉力等于重力', variant: { stem: '功率 1000W 工作 10s 做功？', answer: '1×10⁴ J', analysis: ['W = Pt = 1000×10 = 10⁴ J'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0045', subject: 'physics', type: '计算', kpId: 'phy_kp_0224', difficulty: 3, stem: '用滑轮组（n=3）匀速提升重 600 N 的物体，绳端拉力为 250 N，物体上升 2 m。求：(1) 有用功；(2) 总功；(3) 机械效率。', options: [], answer: '1200 J；1500 J；80%', analysis: ['W有 = Gh = 600 × 2 = 1200 J', 's = nh = 3 × 2 = 6 m，W总 = Fs = 250 × 6 = 1500 J', 'η = W有/W总 = 1200/1500 = 80%'], pitfall: '绳端移动距离 s = n·h', variant: { stem: '不计摩擦与绳重，动滑轮重？', answer: '150 N', analysis: ['G动 = nF - G = 750 - 600 = 150 N'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0046', subject: 'physics', type: '计算', kpId: 'phy_kp_0330', difficulty: 2, stem: '如图，R₁=10 Ω 与 R₂=20 Ω 串联接在 6 V 电源上。求：(1) 电路中的电流；(2) R₂ 两端的电压。', options: [], answer: '0.2 A；4 V', analysis: ['R总 = R₁ + R₂ = 10 + 20 = 30 Ω', 'I = U/R总 = 6/30 = 0.2 A', 'U₂ = IR₂ = 0.2 × 20 = 4 V'], pitfall: '串联分压：电压与电阻成正比', variant: { stem: 'R₁ 两端电压？', answer: '2 V', analysis: ['U₁ = 6 - 4 = 2 V 或 0.2×10=2V'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0047', subject: 'physics', type: '计算', kpId: 'phy_kp_0331', difficulty: 3, stem: '电热水壶标有"220V 1100W"。求：(1) 正常工作时电流和电阻；(2) 烧开一壶水用时 300 s，消耗的电能；(3) 若实际电压 200 V，实际功率多大（电阻不变）。', options: [], answer: '5 A；44 Ω；3.3×10⁵ J；约 909 W', analysis: ['I = P/U = 1100/220 = 5 A', 'R = U²/P = 220²/1100 = 44 Ω', 'W = Pt = 1100 × 300 = 3.3×10⁵ J', 'P实 = U实²/R = 200²/44 ≈ 909 W'], pitfall: '实际功率用实际电压计算', variant: { stem: '电阻 44Ω 接 110V 实际功率？', answer: '275 W', analysis: ['P = 110²/44 = 275 W'] }, isOlympiad: false, isHot: true, selfTest: false },
    { id: 'phy_q_0048', subject: 'physics', type: '计算', kpId: 'phy_kp_0332', difficulty: 3, stem: '某电热器电阻为 48.4 Ω，接在 220 V 电路中通电 100 s。求：(1) 电流；(2) 产生的热量。', options: [], answer: '约 4.55 A；约 1×10⁵ J', analysis: ['I = U/R = 220/48.4 ≈ 4.55 A', 'Q = I²Rt = 4.55² × 48.4 × 100 ≈ 1×10⁵ J', '（也可 Q = U²t/R = 220²×100/48.4 ≈ 1×10⁵ J）'], pitfall: '纯电阻电路 Q = W = UIt = I²Rt = U²t/R', variant: { stem: '电热丝发热 60s，电流 2A，电阻 10Ω，热量？', answer: '2400 J', analysis: ['Q = I²Rt = 4×10×60 = 2400 J'] }, isOlympiad: false, isHot: true, selfTest: false }
  ];

  /* ================= 三、必背清单（28 条） ================= */
  const reciteItems = [
    { id: 'rec_phy_001', subject: 'physics', type: '公式', content: '速度公式：v = s/t（s 路程 m，t 时间 s）', note: '1 m/s = 3.6 km/h', importance: 5, kpId: 'phy_kp_0102', isOlympiad: false },
    { id: 'rec_phy_002', subject: 'physics', type: '公式', content: '密度公式：ρ = m/V', note: '1 g/cm³ = 1×10³ kg/m³', importance: 5, kpId: 'phy_kp_0111', isOlympiad: false },
    { id: 'rec_phy_003', subject: 'physics', type: '公式', content: '重力公式：G = mg（g 取 9.8 或 10 N/kg）', note: '月球表面 g 约为地球的 1/6，但质量不变', importance: 5, kpId: 'phy_kp_0213', isOlympiad: false },
    { id: 'rec_phy_004', subject: 'physics', type: '公式', content: '压强公式：p = F/S', note: '1 Pa = 1 N/m²；增大压强减小受力面积', importance: 5, kpId: 'phy_kp_0217', isOlympiad: false },
    { id: 'rec_phy_005', subject: 'physics', type: '公式', content: '液体压强：p = ρgh', note: '与深度和液体密度有关，与容器形状无关', importance: 5, kpId: 'phy_kp_0218', isOlympiad: false },
    { id: 'rec_phy_006', subject: 'physics', type: '定律', content: '阿基米德原理：F浮 = G排 = ρ液 g V排', note: '浸在液体中的物体所受浮力等于排开液体所受的重力', importance: 5, kpId: 'phy_kp_0219', isOlympiad: false },
    { id: 'rec_phy_007', subject: 'physics', type: '公式', content: '功：W = Fs（力的方向上移动距离）', note: '不做功三情形：无力、无距离、力与距离垂直', importance: 5, kpId: 'phy_kp_0221', isOlympiad: false },
    { id: 'rec_phy_008', subject: 'physics', type: '公式', content: '功率：P = W/t = Fv', note: '1 kW = 1000 W', importance: 5, kpId: 'phy_kp_0221', isOlympiad: false },
    { id: 'rec_phy_009', subject: 'physics', type: '定律', content: '杠杆平衡条件：F₁L₁ = F₂L₂', note: '力臂是支点到力的作用线的距离', importance: 5, kpId: 'phy_kp_0223', isOlympiad: false },
    { id: 'rec_phy_010', subject: 'physics', type: '公式', content: '机械效率：η = W有/W总 ×100%', note: '滑轮组 s = nh；η = Gh/Fs', importance: 5, kpId: 'phy_kp_0224', isOlympiad: false },
    { id: 'rec_phy_011', subject: 'physics', type: '定律', content: '牛顿第一定律：一切物体在没有受到力的作用时，总保持静止或匀速直线运动状态', note: '惯性是属性，只与质量有关', importance: 5, kpId: 'phy_kp_0215', isOlympiad: false },
    { id: 'rec_phy_012', subject: 'physics', type: '定律', content: '二力平衡条件：大小相等、方向相反、作用在同一直线上、作用在同一物体上', note: '与相互作用力区别：是否同一物体', importance: 4, kpId: 'phy_kp_0216', isOlympiad: false },
    { id: 'rec_phy_013', subject: 'physics', type: '定律', content: '欧姆定律：I = U/R', note: '变形 U=IR、R=U/I；电阻是导体属性', importance: 5, kpId: 'phy_kp_0330', isOlympiad: false },
    { id: 'rec_phy_014', subject: 'physics', type: '公式', content: '电功率：P = UI = I²R = U²/R', note: '额定功率 vs 实际功率', importance: 5, kpId: 'phy_kp_0331', isOlympiad: false },
    { id: 'rec_phy_015', subject: 'physics', type: '定律', content: '焦耳定律：Q = I²Rt（纯电阻电路 Q = W = UIt）', note: '电热与电流平方成正比', importance: 4, kpId: 'phy_kp_0332', isOlympiad: false },
    { id: 'rec_phy_016', subject: 'physics', type: '公式', content: '热量（比热容）：Q = cmΔt', note: '水的比热容 4.2×10³ J/(kg·℃)，最大', importance: 5, kpId: 'phy_kp_0326', isOlympiad: false },
    { id: 'rec_phy_017', subject: 'physics', type: '公式', content: '热值：Q = mq（或 Q = Vq 气体）', note: '热值反映燃料放热能力', importance: 4, kpId: 'phy_kp_0327', isOlympiad: false },
    { id: 'rec_phy_018', subject: 'physics', type: '常数', content: '常用常数：光速 c=3×10⁸ m/s；声速 v=340 m/s（15℃空气）；g=9.8 N/kg', note: '光速远大于声速', importance: 4, kpId: 'phy_kp_0103', isOlympiad: false },
    { id: 'rec_phy_019', subject: 'physics', type: '实验要点', content: '测密度实验：天平测质量 + 量筒排水法测体积，ρ=m/V', note: '先测质量再测体积，避免挂壁误差', importance: 4, kpId: 'phy_kp_0112', isOlympiad: false },
    { id: 'rec_phy_020', subject: 'physics', type: '实验要点', content: '凸透镜成像规律：u>2f 倒立缩小实像；f<u<2f 倒立放大实像；u<f 正立放大虚像', note: '一倍焦距分虚实，二倍焦距分大小', importance: 5, kpId: 'phy_kp_0109', isOlympiad: false },
    { id: 'rec_phy_021', subject: 'physics', type: '定律', content: '物态变化：熔化/汽化/升华吸热；凝固/液化/凝华放热', note: '航天"防热衣"利用熔化汽化吸热', importance: 4, kpId: 'phy_kp_0105', isOlympiad: false },
    { id: 'rec_phy_022', subject: 'physics', type: '实验要点', content: '伏安法测电阻：R=U/I，多次测量取平均值减小误差', note: '滑动变阻器保护电路+调节电压', importance: 4, kpId: 'phy_kp_0330', isOlympiad: false },
    { id: 'rec_phy_023', subject: 'physics', type: '实验要点', content: '测量小灯泡电功率：P=UI，调节滑动变阻器使电压等于额定电压', note: '灯泡亮度由实际功率决定', importance: 4, kpId: 'phy_kp_0331', isOlympiad: false },
    { id: 'rec_phy_024', subject: 'physics', type: '常用结论', content: '漂浮条件：F浮 = G物，ρ物 < ρ液；浸没 V排 = V物', note: '轮船、密度计原理', importance: 5, kpId: 'phy_kp_0220', isOlympiad: false },
    { id: 'rec_phy_025', subject: 'physics', type: '常用结论', content: '安全用电原则：不接触低压带电体，不靠近高压带电体', note: '开关接火线，三孔插座左零右火上接地', importance: 4, kpId: 'phy_kp_0333', isOlympiad: false },
    { id: 'rec_phy_026', subject: 'physics', type: '常用结论', content: '电动机原理：通电导线在磁场中受力（有电源）；发电机原理：电磁感应（无电源）', note: '有无电源是判断关键', importance: 4, kpId: 'phy_kp_0334', isOlympiad: false },
    { id: 'rec_phy_027', subject: 'physics', type: '公式', content: '串并联规律：串联 R=R₁+R₂，U 按电阻分配；并联 1/R=1/R₁+1/R₂，I 按电阻反比分配', note: '并联总电阻小于任一分电阻', importance: 4, kpId: 'phy_kp_0330', isOlympiad: false },
    { id: 'rec_phy_028', subject: 'physics', type: '实验要点', content: '平面镜成像特点：等大、等距、垂直、虚像（像与物关于镜面对称）', note: '用玻璃板代替平面镜便于确定像的位置', importance: 4, kpId: 'phy_kp_0107', isOlympiad: false }
  ];

  /* ================= 四、思维导图 ================= */
  const mindmap = {
    id: 'mm_phy_root', subject: 'physics', label: '初中物理（人教版 3 册）', level: 0,
    summary: '声光热→力学（力/压强/浮力/机械）→电学（电路/欧姆定律/电功率）；电学与力学（浮力+压强+功）是笔试 90 分的压轴主线，实验探究约占 30%',
    formulas: ['rec_phy_001', 'rec_phy_002', 'rec_phy_004', 'rec_phy_005', 'rec_phy_006', 'rec_phy_007', 'rec_phy_009', 'rec_phy_010', 'rec_phy_013', 'rec_phy_014', 'rec_phy_015', 'rec_phy_016'],
    children: [
      { id: 'mm_phy_1', subject: 'physics', label: '声光热（八上/九全）', level: 1, children: [
        { id: 'mm_phy_1_1', label: '声现象', level: 2, children: [
          { id: 'mm_phy_1_1_1', label: '产生与传播（真空不传声）', level: 3, type: '概念', howToTest: '月球/太空情境判断', kpId: 'phy_kp_0103' },
          { id: 'mm_phy_1_1_2', label: '音调/响度/音色', level: 3, type: '概念', warn: true, howToTest: '"闻声知人"考音色', kpId: 'phy_kp_0104' }
        ]},
        { id: 'mm_phy_1_2', label: '物态变化', level: 2, children: [
          { id: 'mm_phy_1_2_1', label: '六种物态变化与吸放热', level: 3, type: '概念', star: true, howToTest: '返回舱"防热衣"熔化吸热情境题', kpId: 'phy_kp_0105' }
        ]},
        { id: 'mm_phy_1_3', label: '光现象', level: 2, children: [
          { id: 'mm_phy_1_3_1', label: '反射与平面镜成像', level: 3, type: '概念', star: true, howToTest: '光路作图+成像实验', kpId: 'phy_kp_0106' },
          { id: 'mm_phy_1_3_2', label: '折射与色散', level: 3, type: '概念', howToTest: '池水变浅等生活现象', kpId: 'phy_kp_0108' },
          { id: 'mm_phy_1_3_3', label: '凸透镜成像规律', level: 3, type: '概念', star: true, warn: true, howToTest: '成像规律实验与生活应用', kpId: 'phy_kp_0109' }
        ]},
        { id: 'mm_phy_1_4', label: '质量与密度', level: 2, children: [
          { id: 'mm_phy_1_4_1', label: '密度 ρ=m/V', level: 3, type: '公式', star: true, howToTest: '鉴别物质/空心实心', kpId: 'phy_kp_0111' },
          { id: 'mm_phy_1_4_2', label: '测密度实验', level: 3, type: '实验', star: true, howToTest: '2027 实验探究题常客', kpId: 'phy_kp_0112' }
        ]}
      ]},
      { id: 'mm_phy_2', subject: 'physics', label: '力学（八下）', level: 1, children: [
        { id: 'mm_phy_2_1', label: '力与运动', level: 2, children: [
          { id: 'mm_phy_2_1_1', label: '重力/弹力/摩擦力', level: 3, type: '概念', star: true, howToTest: '力的示意图作图', kpId: 'phy_kp_0213' },
          { id: 'mm_phy_2_1_2', label: '牛顿第一定律与惯性', level: 3, type: '定律', howToTest: '安全带/月球重力情境', kpId: 'phy_kp_0215' },
          { id: 'mm_phy_2_1_3', label: '二力平衡', level: 3, type: '定律', howToTest: '平衡力与相互作用力辨析', kpId: 'phy_kp_0216' }
        ]},
        { id: 'mm_phy_2_2', label: '压强与浮力', level: 2, children: [
          { id: 'mm_phy_2_2_1', label: '固体压强 p=F/S', level: 3, type: '公式', star: true, howToTest: '月球车车轮宽大分析', kpId: 'phy_kp_0217' },
          { id: 'mm_phy_2_2_2', label: '液体压强 p=ρgh', level: 3, type: '公式', howToTest: '潜水深度压强计算', kpId: 'phy_kp_0218' },
          { id: 'mm_phy_2_2_3', label: '浮力（阿基米德原理）', level: 3, type: '定律', star: true, howToTest: '力学计算压轴核心', kpId: 'phy_kp_0219' },
          { id: 'mm_phy_2_2_4', label: '浮沉条件', level: 3, type: '概念', howToTest: '轮船/潜水艇原理', kpId: 'phy_kp_0220' }
        ]},
        { id: 'mm_phy_2_3', label: '功与机械', level: 2, children: [
          { id: 'mm_phy_2_3_1', label: '功与功率', level: 3, type: '公式', star: true, howToTest: '机械做功功率计算', kpId: 'phy_kp_0221' },
          { id: 'mm_phy_2_3_2', label: '杠杆与力臂', level: 3, type: '概念', howToTest: '力臂作图+平衡条件', kpId: 'phy_kp_0223' },
          { id: 'mm_phy_2_3_3', label: '滑轮与机械效率', level: 3, type: '公式', star: true, howToTest: 'η 计算与实验', kpId: 'phy_kp_0224' }
        ]}
      ]},
      { id: 'mm_phy_3', subject: 'physics', label: '电学（九全）', level: 1, children: [
        { id: 'mm_phy_3_1', label: '电路基础', level: 2, children: [
          { id: 'mm_phy_3_1_1', label: '串并联电路识别', level: 3, type: '概念', howToTest: '电路图与实物图互画', kpId: 'phy_kp_0328' },
          { id: 'mm_phy_3_1_2', label: '电流/电压/电阻', level: 3, type: '概念', howToTest: '电表读数与连接', kpId: 'phy_kp_0329' }
        ]},
        { id: 'mm_phy_3_2', label: '欧姆定律', level: 2, children: [
          { id: 'mm_phy_3_2_1', label: 'I=U/R 与串并联', level: 3, type: '定律', star: true, howToTest: '动态电路分析', kpId: 'phy_kp_0330' },
          { id: 'mm_phy_3_2_2', label: '伏安法测电阻实验', level: 3, type: '实验', star: true, howToTest: '2027 实验压轴方向', kpId: 'phy_kp_0330' }
        ]},
        { id: 'mm_phy_3_3', label: '电功率', level: 2, children: [
          { id: 'mm_phy_3_3_1', label: 'P=UI 与多档位计算', level: 3, type: '公式', star: true, howToTest: '电学计算压轴主力', kpId: 'phy_kp_0331' },
          { id: 'mm_phy_3_3_2', label: '焦耳定律 Q=I²Rt', level: 3, type: '定律', howToTest: '电热综合计算', kpId: 'phy_kp_0332' },
          { id: 'mm_phy_3_3_3', label: '测小灯泡功率实验', level: 3, type: '实验', howToTest: '额定功率测量', kpId: 'phy_kp_0331' }
        ]},
        { id: 'mm_phy_3_4', label: '生活用电与电与磁', level: 2, children: [
          { id: 'mm_phy_3_4_1', label: '家庭电路与安全用电', level: 3, type: '概念', howToTest: '电路连接与触电判断', kpId: 'phy_kp_0333' },
          { id: 'mm_phy_3_4_2', label: '电动机与发电机', level: 3, type: '概念', howToTest: '有无电源辨析', kpId: 'phy_kp_0334' }
        ]}
      ]}
    ]
  };

  /* ================= 五、2027 预测（提炼自预测报告） ================= */
  const prediction = {
    year: 2027,
    knowledgePredictions: [
      { kpId: 'phy_kp_0330', name: '欧姆定律及其应用', grade: '九年级', basis: '电学核心，实验+计算双考', stars: 5 },
      { kpId: 'phy_kp_0331', name: '电功率、焦耳定律', grade: '九年级', basis: '电学综合计算压轴主力', stars: 5 },
      { kpId: 'phy_kp_0219', name: '浮力（阿基米德原理、沉浮条件）', grade: '八下', basis: '力学计算核心，高频', stars: 5 },
      { kpId: 'phy_kp_0217', name: '压强（固体/液体/大气压）', grade: '八下', basis: '力学重点，常结合实验', stars: 4 },
      { kpId: 'phy_kp_0221', name: '功、功率、机械效率', grade: '八下', basis: '简单机械综合计算', stars: 4 },
      { kpId: 'phy_kp_0109', name: '光的反射与折射、透镜成像', grade: '八上', basis: '作图+实验探究高频', stars: 4 },
      { kpId: 'phy_kp_0105', name: '物态变化', grade: '八上', basis: '航天/热学情境常考', stars: 3 },
      { kpId: 'phy_kp_0112', name: '密度测量实验', grade: '八上', basis: '实验探究题常客', stars: 4 },
      { kpId: 'phy_kp_0223', name: '简单机械（杠杆、滑轮）', grade: '八下', basis: '与功、机械效率结合', stars: 3 },
      { kpId: 'phy_kp_0326', name: '内能与热机', grade: '九年级', basis: '结合航天/新能源热点', stars: 3 },
      { kpId: 'phy_kp_0334', name: '电与磁（电磁感应、电动机）', grade: '九年级', basis: '与科技热点结合', stars: 3 }
    ],
    hotTopics: [
      { event: '神舟十八/十九号载人飞船返回（2024-2025）', kps: ['物态变化', '内能', '摩擦生热'], how: '返回舱"防热衣"熔化/汽化吸热情境题（2025 已考）' },
      { event: '嫦娥六号月球采样返回（2024）', kps: ['重力', '压强', '摩擦力'], how: '月球车车轮宽大/凸棱的压强、摩擦分析题' },
      { event: '嫦娥七号探月（2026 计划）', kps: ['声现象（真空中不传声）', '电磁波'], how: '月面探测情境的声/电磁波判断' },
      { event: '新能源汽车', kps: ['电功率', '能量转化', '电动机'], how: '电动车续航、能量转化的综合计算' },
      { event: '载人登月工程（2030 目标）', kps: ['惯性', '重力（1/6）', '质量'], how: '月球重力与质量关系的辨析题' },
      { event: '空间站应用（2026 深化）', kps: ['浮力（失重）', '光的传播'], how: '太空失重环境下物理现象判断' },
      { event: '5G/通信、北斗导航', kps: ['电磁波'], how: '电磁波传播特性题' }
    ],
    possibleQuestions: [
      { type: '计算·电学综合压轴', desc: '欧姆定律+电功率+焦耳定律串联（多档位用电器/电路改造）' },
      { type: '计算·力学综合压轴', desc: '浮力+压强+功/机械效率（打捞、桥梁、机械装置情境）' },
      { type: '实验·探究题', desc: '测密度、探究欧姆定律、探究浮力影响因素——重实验设计、数据记录、误差分析' },
      { type: '作图题', desc: '光路图（反射/折射/透镜）、力臂、电路图' },
      { type: '时事情境题', desc: '航天（返回舱/月球车）、新能源（电动车）、科技（电磁波）背景的选择/填空/简答' }
    ],
    papers: ['paper_phy_p1', 'paper_phy_p2', 'paper_phy_p3'],
    sources: [
      { label: '广州市教育局《2027—2029年深化高中阶段学校考试招生制度改革的实施意见》（物理保持 100 分 = 笔试 90 + 实验 10）', type: '政策文件' },
      { label: '2026 广州中考物理命题分析（实验探究占比约 30% 持续走高、跨学科融合）', type: '命题趋势' },
      { label: '近5年广州中考真题考点频次（电学/力学综合恒定压轴）', type: '真题统计' },
      { label: '2024-2026 航天/新能源科技时事（神舟、嫦娥、载人登月、新能源汽车）', type: '时事热点' }
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
  const d = window.DATA.physics;
  const types = {};
  d.questions.forEach(q => { types[q.type] = (types[q.type] || 0) + 1; });
  console.log('[DATA] physics loaded, kps=' + d.knowledgePoints.length + ', questions=' + d.questions.length +
    ' (' + Object.keys(types).map(t => t + types[t]).join('/') + '), recite=' + d.reciteItems.length +
    ', hotTop10=' + d.hotTop10.length);
})();
