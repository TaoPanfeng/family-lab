/* Original learning cards; references document scope, not copied textbook prose. */
(function(root){"use strict";const data={
  "groups": {
    "number": "数与运算",
    "fractions": "分数与比例",
    "geometry": "图形与测量",
    "algebra": "代数与方程",
    "functions": "函数与变化",
    "trig": "三角与向量",
    "statistics": "概率与统计",
    "calculus": "微积分",
    "linear": "线性代数",
    "logic": "离散与逻辑",
    "advanced": "大学进阶"
  },
  "stages": [
    "小学1–2年级",
    "小学3–6年级",
    "初中",
    "高中",
    "大学基础与进阶"
  ],
  "topics": [
    {
      "id": "counting",
      "stage": "小学1–2年级",
      "group": "number",
      "title": "数数与一一对应",
      "child": "给每个小朋友发一块积木，不多发也不漏发，就是在数数。",
      "formal": "有限集合的数量可以通过一一对应比较；数到的最后一个数表示总数。",
      "steps": [
        "先给4个空位各放1颗豆",
        "再添1颗，得到5颗",
        "把豆子换个排列，数量仍是5"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "清点书包里的铅笔，防止遗漏。"
        },
        {
          "kind": "工作中的用处",
          "text": "仓库盘点：实物、清单与编号要一一对应。"
        }
      ],
      "lab": "arithmetic",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "place-value",
      "stage": "小学1–2年级",
      "group": "number",
      "title": "十进制与数位",
      "child": "10根小棒捆成一捆，10捆再装成一箱。数字的位置告诉你有几箱、几捆、几根。",
      "formal": "十进制中，整数N=Σdₖ10ᵏ；每一位数字取0到9。",
      "steps": [
        "237有2个百、3个十、7个一",
        "展开成200+30+7",
        "同样的2，放在百位表示200"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "读价格与门牌，区别23元和230元。"
        },
        {
          "kind": "工作中的用处",
          "text": "软件处理金额时必须区分元、角、分，数据库字段也需要明确单位。"
        }
      ],
      "lab": "place",
      "prerequisites": [
        "counting"
      ],
      "source": "moe"
    },
    {
      "id": "addition",
      "stage": "小学1–2年级",
      "group": "number",
      "title": "加法：合在一起",
      "child": "我有7颗豆，你又给我5颗，现在一共有多少？",
      "formal": "自然数加法表示合并不相交集合的数量，也可看成数轴上向右移动。",
      "steps": [
        "从7出发",
        "先向右走3步到10，再走2步",
        "7+5=12"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "算一家人买了多少个苹果。"
        },
        {
          "kind": "工作中的用处",
          "text": "购物车把各件商品的数量或金额汇总。"
        }
      ],
      "lab": "arithmetic",
      "prerequisites": [
        "counting"
      ],
      "source": "moe"
    },
    {
      "id": "subtraction",
      "stage": "小学1–2年级",
      "group": "number",
      "title": "减法：拿走与比较",
      "child": "盒子里12块积木，拿走5块，还剩多少？",
      "formal": "减法是加法的逆运算；a−b=c等价于b+c=a。",
      "steps": [
        "从12向左走5步",
        "12−2−3=7",
        "检查7+5=12"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "检查买东西后应该找回多少钱。"
        },
        {
          "kind": "工作中的用处",
          "text": "库存扣减后检查剩余量，不能悄悄出现负库存。"
        }
      ],
      "lab": "subtract",
      "prerequisites": [
        "addition"
      ],
      "source": "moe"
    },
    {
      "id": "commutative",
      "stage": "小学1–2年级",
      "group": "number",
      "title": "交换位置，结果变吗",
      "child": "把3颗红豆和5颗蓝豆交换左右，豆子会变多吗？",
      "formal": "加法与乘法满足交换律；减法和除法一般不满足。",
      "steps": [
        "3+5=8，5+3=8",
        "2×4=8，4×2=8",
        "但5−3=2，3−5=−2"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "先算顺手的两个数，再算剩下的。"
        },
        {
          "kind": "工作中的用处",
          "text": "并行求和可以重新分组；浮点计算还需注意舍入差异。"
        }
      ],
      "lab": "arithmetic",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "multiplication",
      "stage": "小学1–2年级",
      "group": "number",
      "title": "乘法：一样多的几组",
      "child": "每盘放4块饼干，摆3盘。把3个4合起来，就是3×4。",
      "formal": "自然数乘法可用等量分组与矩形点阵表示。",
      "steps": [
        "每行4点，画3行",
        "4+4+4=12",
        "所以3×4=12"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "算3排座位，每排4个能坐几人。"
        },
        {
          "kind": "工作中的用处",
          "text": "排产：每盒装4件，3盒共12件。"
        }
      ],
      "lab": "multiply",
      "prerequisites": [
        "addition"
      ],
      "source": "moe"
    },
    {
      "id": "division",
      "stage": "小学1–2年级",
      "group": "number",
      "title": "除法：平均分",
      "child": "12块饼干分给3个人，怎样让大家一样多？",
      "formal": "整数除法a=bq+r，其中0≤r<b且b>0；整除时r=0。",
      "steps": [
        "每人先拿1块，轮流分",
        "12块恰好分成3份，每份4块",
        "检查3×4=12"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "公平分零食；有余数时说明剩下几块。"
        },
        {
          "kind": "工作中的用处",
          "text": "把任务分给相同容量的服务器，余数需要额外安排。"
        }
      ],
      "lab": "divide",
      "prerequisites": [
        "multiplication"
      ],
      "source": "moe"
    },
    {
      "id": "shapes",
      "stage": "小学1–2年级",
      "group": "geometry",
      "title": "认识平面图形",
      "child": "摸摸三角形有几个角，正方形的四条边是不是一样长？",
      "formal": "图形按边、角与对称关系分类；正方形是特殊的矩形。",
      "steps": [
        "三条线段围成三角形",
        "四个直角围成矩形",
        "矩形的四边又等长，就是正方形"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "识别路牌、窗户和地砖。"
        },
        {
          "kind": "工作中的用处",
          "text": "界面布局、零件设计先把物体抽象成形状。"
        }
      ],
      "lab": "area",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "length",
      "stage": "小学1–2年级",
      "group": "geometry",
      "title": "长度与单位",
      "child": "同一张桌子，用厘米量和用米量，数字不同，但桌子没有变长。",
      "formal": "1m=100cm，1cm=10mm；比较量之前必须统一单位。",
      "steps": [
        "1.2m换成120cm",
        "120cm比90cm长30cm",
        "不把1.2和90直接比较"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "判断书桌能不能放进房间。"
        },
        {
          "kind": "工作中的用处",
          "text": "建筑图纸和加工尺寸需要统一单位，单位错会造成严重误差。"
        }
      ],
      "lab": "units",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "clock",
      "stage": "小学1–2年级",
      "group": "geometry",
      "title": "时、分、秒",
      "child": "长针走一圈，短针前进一大格。我们把一小时分成60分钟。",
      "formal": "1h=60min，1min=60s；时间进位不同于十进制。",
      "steps": [
        "8:45过20分钟",
        "先走15分钟到9:00",
        "再走5分钟到9:05"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "安排上学、读书与休息时间。"
        },
        {
          "kind": "工作中的用处",
          "text": "程序用时间戳计算间隔，要分清时区和时长。"
        }
      ],
      "lab": "clock",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "money",
      "stage": "小学1–2年级",
      "group": "number",
      "title": "钱与小数的起点",
      "child": "10个一角合成一元；用整数“分”也能把钱算清楚。",
      "formal": "1元=10角=100分；用最小货币单位计算可避免部分小数舍入问题。",
      "steps": [
        "2元5角写作2.50元",
        "加上1元2角就是3.70元",
        "也可计算250分+120分=370分"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "核对收银小票。"
        },
        {
          "kind": "工作中的用处",
          "text": "支付系统常用整数分保存金额，而非不加约束的浮点数。"
        }
      ],
      "lab": "place",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "direction",
      "stage": "小学1–2年级",
      "group": "geometry",
      "title": "方向与位置",
      "child": "告诉朋友“右边第三格”，就能让他找到你藏的宝贝。",
      "formal": "位置需要参照物；平面坐标用一对有顺序的数表达位置。",
      "steps": [
        "从原点向右3格",
        "再向上2格",
        "位置记作(3,2)，不等于(2,3)"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "在棋盘、教室座位表上找位置。"
        },
        {
          "kind": "工作中的用处",
          "text": "屏幕像素、仓库货位和机器人定位都需要坐标。"
        }
      ],
      "lab": "vectors",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "data-count",
      "stage": "小学1–2年级",
      "group": "statistics",
      "title": "分类与统计表",
      "child": "把红、蓝、黄三种积木分堆，再数每堆有多少。",
      "formal": "频数是某一类别出现的次数；类别应明确且尽量避免重叠。",
      "steps": [
        "红色4块、蓝色3块、黄色2块",
        "总数4+3+2=9",
        "红色最多，不等于红色一定最好"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "统计全班喜欢的水果。"
        },
        {
          "kind": "工作中的用处",
          "text": "客服把问题按类型统计，找出最常见故障。"
        }
      ],
      "lab": "statistics",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "patterns",
      "stage": "小学1–2年级",
      "group": "algebra",
      "title": "找规律与反例",
      "child": "看到2、4、6，猜下一项是8很好；但要说清楚你用了什么规则。",
      "formal": "有限例子不能唯一确定规律；必须补充生成规则或更多条件。",
      "steps": [
        "规定每次增加2",
        "2、4、6之后是8",
        "若改成别的规则，前三项相同也可能有不同下一项"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "按颜色规律串珠。"
        },
        {
          "kind": "工作中的用处",
          "text": "程序必须明确规则，不能只凭几个样本猜算法。"
        }
      ],
      "lab": "sequence",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "sorting",
      "stage": "小学1–2年级",
      "group": "logic",
      "title": "分类、顺序与比较",
      "child": "先按大小排，再按颜色分；不同规则可能得到不同队伍。",
      "formal": "排序依赖比较规则；分类依赖属性，规则应保持一致。",
      "steps": [
        "把2、5、3从小到大排",
        "先比较2和5，再插入3",
        "得到2、3、5"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "整理书架，让同类书放在一起。"
        },
        {
          "kind": "工作中的用处",
          "text": "数据库ORDER BY和程序比较器必须给出明确顺序。"
        }
      ],
      "lab": "statistics",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "remainder",
      "stage": "小学3–6年级",
      "group": "number",
      "title": "余数与整除",
      "child": "17块糖每袋装5块，能装3袋，还剩2块。",
      "formal": "a=bq+r，0≤r<b；余数不能达到除数。",
      "steps": [
        "17=5×3+2",
        "商是3，余数是2",
        "若剩5块，还能多装1袋，不算规范余数"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "分组、打包时处理剩余物品。"
        },
        {
          "kind": "工作中的用处",
          "text": "数据分页：17条每页5条，需要4页而非3页。"
        }
      ],
      "lab": "modulo",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "factors",
      "stage": "小学3–6年级",
      "group": "number",
      "title": "因数与倍数",
      "child": "12块方砖能摆成1×12、2×6、3×4；这些边长都是12的因数。",
      "formal": "若a=bc且a,b,c为正整数，则b,c是a的因数，a是它们的倍数。",
      "steps": [
        "逐个试1、2、3、4、6、12",
        "都能整除12",
        "5不能整除12"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "摆座位、铺方砖，避免空缺。"
        },
        {
          "kind": "工作中的用处",
          "text": "选数据分块大小，减少不能整分的尾块。"
        }
      ],
      "lab": "divisors",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "primes",
      "stage": "小学3–6年级",
      "group": "number",
      "title": "质数与合数",
      "child": "有些数量只能摆成一条长队，不能摆成两行以上的整齐长方形。",
      "formal": "大于1且只有1和自身两个正因数的整数叫质数；1既不是质数也不是合数。",
      "steps": [
        "7只能分成1×7",
        "8还能分成2×4",
        "所以7是质数，8是合数"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "用筛子找出100以内的质数。"
        },
        {
          "kind": "工作中的用处",
          "text": "整数分解与某些公钥密码体系有关，但小质数实验不是安全加密。"
        }
      ],
      "lab": "divisors",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "gcd-lcm",
      "stage": "小学3–6年级",
      "group": "number",
      "title": "最大公因数与最小公倍数",
      "child": "12块和18块积木要分成一样大的小组，最大的组可以有几块？",
      "formal": "gcd(a,b)表示最大公因数，lcm(a,b)表示最小公倍数；正整数有gcd·lcm=ab。",
      "steps": [
        "12和18共同因数有1、2、3、6",
        "最大是6",
        "共同倍数最小是36"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "安排两项周期活动何时再次相遇。"
        },
        {
          "kind": "工作中的用处",
          "text": "齿轮周期、批处理任务调度用到整除与共同周期。"
        }
      ],
      "lab": "divisors",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "fractions",
      "stage": "小学3–6年级",
      "group": "fractions",
      "title": "分数：一样大的几份",
      "child": "把同一块饼平均切成8份，拿3份，就是八分之三。",
      "formal": "a/b表示把单位整体平均分成b份后取a份，b≠0；整体必须相同才能直接比较。",
      "steps": [
        "同样大小的一块饼切8份",
        "涂其中3份",
        "写作3/8，而不是3/5"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "分蛋糕、看量杯刻度。"
        },
        {
          "kind": "工作中的用处",
          "text": "加工配料与图形缩放需要准确表示部分和整体。"
        }
      ],
      "lab": "fractions",
      "prerequisites": [
        "division"
      ],
      "source": "moe"
    },
    {
      "id": "equivalent",
      "stage": "小学3–6年级",
      "group": "fractions",
      "title": "约分与通分",
      "child": "半块饼再切一次，变成四块里的两块，饼的多少没变。",
      "formal": "分子分母同乘或同除一个非零数，分数值不变。",
      "steps": [
        "1/2的每份再切成2份",
        "现在是2/4",
        "计算1/2+1/4时先写成2/4+1/4=3/4"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "比较不同切法的披萨份量。"
        },
        {
          "kind": "工作中的用处",
          "text": "统一不同数据的分母，避免把不同比例直接相加。"
        }
      ],
      "lab": "fractions",
      "prerequisites": [
        "fractions"
      ],
      "source": "moe"
    },
    {
      "id": "fraction-ops",
      "stage": "小学3–6年级",
      "group": "fractions",
      "title": "分数的四则运算",
      "child": "“半杯加四分之一杯”要先用一样大小的小份来数。",
      "formal": "a/b+c/d=(ad+bc)/(bd)；分数乘法逐项相乘，除以非零分数等于乘倒数。",
      "steps": [
        "1/2+1/3先通分成3/6+2/6",
        "得到5/6",
        "2/3的一半是2/3×1/2=1/3"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "按人数调整菜谱分量。"
        },
        {
          "kind": "工作中的用处",
          "text": "用有理数算法保持精确比例，避免累积舍入。"
        }
      ],
      "lab": "fractions",
      "prerequisites": [
        "equivalent"
      ],
      "source": "moe"
    },
    {
      "id": "decimals",
      "stage": "小学3–6年级",
      "group": "fractions",
      "title": "小数与精度",
      "child": "把一根米尺分成10格、100格，0.3米就是其中3个十分之一米。",
      "formal": "有限小数可写成以10的整数幂为分母的分数；数值与测量精度要区分。",
      "steps": [
        "0.25=25/100",
        "约分得到1/4",
        "0.250与0.25数值相同，测量语境下精度表达可不同"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "读体温、身高与电子秤。"
        },
        {
          "kind": "工作中的用处",
          "text": "软件中的二进制浮点通常不能精确表示0.1，需要误差意识。"
        }
      ],
      "lab": "fractions",
      "prerequisites": [
        "place-value",
        "fractions"
      ],
      "source": "moe"
    },
    {
      "id": "percent",
      "stage": "小学3–6年级",
      "group": "fractions",
      "title": "百分数与折扣",
      "child": "“百分之二十五”就是把整体看成100份，取25份。",
      "formal": "p%=p/100；百分比变化必须指定基数。",
      "steps": [
        "80元商品打七五折",
        "计算80×0.75=60元",
        "省下20元，占原价25%"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "核对折扣与电量百分比。"
        },
        {
          "kind": "工作中的用处",
          "text": "报表同比、转化率必须说明分母与时间范围。"
        }
      ],
      "lab": "ratio",
      "prerequisites": [
        "decimals"
      ],
      "source": "moe"
    },
    {
      "id": "ratio",
      "stage": "小学3–6年级",
      "group": "fractions",
      "title": "比与正比例",
      "child": "果汁2杯、水3杯，做两壶时两种材料都要翻倍。",
      "formal": "正比例y=kx，y/x=k不变；比用于比较同类或有明确单位的量。",
      "steps": [
        "果汁:水=2:3",
        "一起乘2得到4:6",
        "浓淡不变，总量变成原来的2倍"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "调饮料、放大食谱。"
        },
        {
          "kind": "工作中的用处",
          "text": "混料、地图比例尺与模型缩放。"
        }
      ],
      "lab": "ratio",
      "prerequisites": [
        "fractions"
      ],
      "source": "moe"
    },
    {
      "id": "inverse-ratio",
      "stage": "小学3–6年级",
      "group": "fractions",
      "title": "反比例",
      "child": "路程固定时，走得越快，用的时间越短；不是所有“一个多一个少”都叫反比例。",
      "formal": "反比例y=k/x，xy=k且x≠0。",
      "steps": [
        "路程12km",
        "速度3km/h要4h",
        "速度6km/h要2h，速度×时间仍是12"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "比较同一路程的步行与骑行时间。"
        },
        {
          "kind": "工作中的用处",
          "text": "理想条件下吞吐率与完成固定工作量的时间互为反比。"
        }
      ],
      "lab": "inverse",
      "prerequisites": [
        "ratio"
      ],
      "source": "moe"
    },
    {
      "id": "perimeter",
      "stage": "小学3–6年级",
      "group": "geometry",
      "title": "周长：围一圈",
      "child": "给花坛围栏，要算的是边缘有多长，不是里面有多大。",
      "formal": "矩形周长P=2(l+w)；长度与面积是不同维度的量。",
      "steps": [
        "长5m、宽3m",
        "周长是5+3+5+3=16m",
        "面积却是15m²，不能混用"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "买围栏、包书皮的边条。"
        },
        {
          "kind": "工作中的用处",
          "text": "零件边缘密封条与线路长度估算。"
        }
      ],
      "lab": "area",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "area",
      "stage": "小学3–6年级",
      "group": "geometry",
      "title": "面积与单位方格",
      "child": "用一样大的小方砖把地面铺满，数方砖就能量面积。",
      "formal": "矩形面积A=lw；面积单位是长度单位的平方。",
      "steps": [
        "长5格、宽3格",
        "每行5格，共3行",
        "5×3=15平方格"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "估算地板与墙漆覆盖面积。"
        },
        {
          "kind": "工作中的用处",
          "text": "图像像素数量、建筑面积与材料切割。"
        }
      ],
      "lab": "area",
      "prerequisites": [
        "multiplication",
        "length"
      ],
      "source": "moe"
    },
    {
      "id": "triangle-area",
      "stage": "小学3–6年级",
      "group": "geometry",
      "title": "三角形与平行四边形面积",
      "child": "把两个一模一样的三角形拼起来，就能看见一个平行四边形。",
      "formal": "三角形面积A=bh/2；h必须是对应底边的垂直高度。",
      "steps": [
        "底6cm，高4cm",
        "两块三角形拼成面积24cm²的平行四边形",
        "一块面积12cm²"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "裁一块三角形布料。"
        },
        {
          "kind": "工作中的用处",
          "text": "计算多边形网格面积，三维模型常拆成三角形。"
        }
      ],
      "lab": "triangle",
      "prerequisites": [
        "area"
      ],
      "source": "moe"
    },
    {
      "id": "circle",
      "stage": "小学3–6年级",
      "group": "geometry",
      "title": "圆、周长与面积",
      "child": "圆规针脚不动，另一头走一圈；所有点到针脚一样远。",
      "formal": "C=2πr，A=πr²；π是圆周长与直径的比。",
      "steps": [
        "半径2cm",
        "周长4πcm",
        "面积4πcm²；半径加倍，面积变4倍"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "估算圆桌桌布和车轮转一圈的路程。"
        },
        {
          "kind": "工作中的用处",
          "text": "机械圆轮、管道截面积与传感器角度设计。"
        }
      ],
      "lab": "circle",
      "prerequisites": [
        "area"
      ],
      "source": "moe"
    },
    {
      "id": "volume",
      "stage": "小学3–6年级",
      "group": "geometry",
      "title": "体积与表面积",
      "child": "盒子里能装多少小方块，和外面要贴多少纸，是两件事。",
      "formal": "长方体体积V=lwh，表面积S=2(lw+lh+wh)。",
      "steps": [
        "盒子长4、宽3、高2",
        "体积4×3×2=24",
        "表面积2×(12+8+6)=52"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "选择收纳盒、包装纸。"
        },
        {
          "kind": "工作中的用处",
          "text": "物流装箱、容积与散热表面积设计。"
        }
      ],
      "lab": "volume",
      "prerequisites": [
        "area"
      ],
      "source": "moe"
    },
    {
      "id": "symmetry",
      "stage": "小学3–6年级",
      "group": "geometry",
      "title": "对称、平移与旋转",
      "child": "把纸对折，两边能重合；转一下图形，它还可能和原来一样。",
      "formal": "平移和旋转保持长度与角度；轴对称改变定向但保持距离。",
      "steps": [
        "点(2,1)向右移3格到(5,1)",
        "关于y轴对称得到(−2,1)",
        "旋转90°得到(−1,2)"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "剪窗花、拼图与摆家具。"
        },
        {
          "kind": "工作中的用处",
          "text": "图形软件、游戏人物和数控机床的坐标变换。"
        }
      ],
      "lab": "vectors",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "mean",
      "stage": "小学3–6年级",
      "group": "statistics",
      "title": "平均数与中位数",
      "child": "把大家的豆子倒在一起再平均分，就是平均数；排队站中间的是中位数。",
      "formal": "均值为总和除以个数；中位数由排序后的位置决定，对极端值更稳健。",
      "steps": [
        "2、3、4、5、16总和30",
        "平均数6，中位数4",
        "把16改成6，平均数降到4，中位数仍为4"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "比较一周阅读量，不让某一天误导整体判断。"
        },
        {
          "kind": "工作中的用处",
          "text": "工资、响应时间报表应同时考虑均值、分位数与分布。"
        }
      ],
      "lab": "statistics",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "order-operations",
      "stage": "小学3–6年级",
      "group": "algebra",
      "title": "括号与运算顺序",
      "child": "同样的积木，先分组再计算，结果可能不一样；括号就是“先做这个”的标记。",
      "formal": "先括号，再乘除，后加减；同级通常从左到右。",
      "steps": [
        "3+2×4先算2×4=8",
        "所以结果11",
        "(3+2)×4先算5，结果20"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "读清套装价格中的“每份”和“总共”。"
        },
        {
          "kind": "工作中的用处",
          "text": "编程表达式依赖优先级，必要时用括号避免歧义。"
        }
      ],
      "lab": "arithmetic",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "simple-equations",
      "stage": "小学3–6年级",
      "group": "algebra",
      "title": "用方程找未知数",
      "child": "一个神秘盒子装着x颗珠子，再放3颗就有8颗，盒子里原来有多少？",
      "formal": "等式两边同时加减同一数，或乘除同一非零数，解集不变。",
      "steps": [
        "x+3=8",
        "两边都减3",
        "x=5，代回检验5+3=8"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "倒推原价或缺少的拼图块数。"
        },
        {
          "kind": "工作中的用处",
          "text": "根据约束反推参数，而不是盲目试值。"
        }
      ],
      "lab": "balance",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "integers",
      "stage": "初中",
      "group": "number",
      "title": "负数与数轴",
      "child": "零楼层往上是正数，往下是负数；负数不是“没有意义的数”。",
      "formal": "整数包含正整数、0和负整数；数轴方向明确大小与加减。",
      "steps": [
        "从2向左走5步",
        "经过0再继续",
        "得到2−5=−3"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "理解气温、地下楼层与收支差。"
        },
        {
          "kind": "工作中的用处",
          "text": "坐标、库存调整记录和带符号传感器数据。"
        }
      ],
      "lab": "subtract",
      "prerequisites": [
        "subtraction"
      ],
      "source": "moe"
    },
    {
      "id": "absolute",
      "stage": "初中",
      "group": "number",
      "title": "绝对值与距离",
      "child": "离家3步，向左或向右都是3步远；绝对值只问距离，不问方向。",
      "formal": "abs(x)是x到0的距离；两实数距离为abs(a−b)。",
      "steps": [
        "−4到0的距离是4",
        "所以abs(−4)=4",
        "−4到3的距离abs(−4−3)=7"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "计算两地温差。"
        },
        {
          "kind": "工作中的用处",
          "text": "误差大小、曼哈顿距离与异常偏差判断。"
        }
      ],
      "lab": "subtract",
      "prerequisites": [
        "integers"
      ],
      "source": "moe"
    },
    {
      "id": "real-numbers",
      "stage": "初中",
      "group": "number",
      "title": "平方根、无理数与实数",
      "child": "正方形面积是2，它的边长不是一个能写尽的小数。",
      "formal": "实数由有理数与无理数组成；√a是非负数a的非负平方根。",
      "steps": [
        "√9=3",
        "√2≈1.414但近似不等于精确",
        "可证明√2不能写成整数比"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "估算方形地块的边长。"
        },
        {
          "kind": "工作中的用处",
          "text": "几何计算既需精确符号，也需误差受控的数值近似。"
        }
      ],
      "lab": "pythagoras",
      "prerequisites": [
        "multiplication"
      ],
      "source": "moe"
    },
    {
      "id": "powers",
      "stage": "初中",
      "group": "algebra",
      "title": "乘方与科学记数法",
      "child": "2×2×2很长？用2³把重复乘法折起来。",
      "formal": "aᵐaⁿ=aᵐ⁺ⁿ；科学记数法为a×10ⁿ，其中1≤abs(a)<10。",
      "steps": [
        "2³=8",
        "2³×2²=2⁵=32",
        "350000写成3.5×10⁵"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "读很大的人口数或很小的长度。"
        },
        {
          "kind": "工作中的用处",
          "text": "存储容量、纳米制造和科学仪器量级表达。"
        }
      ],
      "lab": "exponential",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "polynomials",
      "stage": "初中",
      "group": "algebra",
      "title": "整式与同类项",
      "child": "3盒苹果加2盒苹果，可以合成5盒；苹果盒和梨盒不能胡乱合并。",
      "formal": "同类项的字母与次数相同；多项式运算遵守分配律。",
      "steps": [
        "3x+2x=5x",
        "3x+2y不能合成5xy",
        "x(x+2)=x²+2x"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "按商品类型合并数量。"
        },
        {
          "kind": "工作中的用处",
          "text": "符号代数、成本表达式和程序编译优化。"
        }
      ],
      "lab": "balance",
      "prerequisites": [
        "simple-equations"
      ],
      "source": "moe"
    },
    {
      "id": "identities",
      "stage": "初中",
      "group": "algebra",
      "title": "平方公式与因式分解",
      "child": "大正方形里有两个小正方形，还有两块长方形，不要漏掉它们。",
      "formal": "(a+b)²=a²+2ab+b²；a²−b²=(a−b)(a+b)。",
      "steps": [
        "把(a+b)×(a+b)拆开",
        "得到a²、ab、ab、b²",
        "合并中间两块就是2ab"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "心算21²=(20+1)²=441。"
        },
        {
          "kind": "工作中的用处",
          "text": "几何求面积、代数简化和数值公式变形。"
        }
      ],
      "lab": "area",
      "prerequisites": [
        "polynomials",
        "area"
      ],
      "source": "moe"
    },
    {
      "id": "rational-expressions",
      "stage": "初中",
      "group": "algebra",
      "title": "分式与定义域",
      "child": "不能把一块饼平均分给0个人；式子里的分母也不能是0。",
      "formal": "分式分母不得为0；约去因式不能丢掉原来的限制条件。",
      "steps": [
        "(x²−1)/(x−1)中x≠1",
        "因式分解后约去x−1",
        "得到x+1，但仍保留x≠1"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "比较每单位价格之前确认数量非零。"
        },
        {
          "kind": "工作中的用处",
          "text": "程序除法要防零值，数据清洗不能掩盖非法输入。"
        }
      ],
      "lab": "inverse",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "linear-equation",
      "stage": "初中",
      "group": "algebra",
      "title": "一元一次方程",
      "child": "天平两边同时拿走一样的东西，仍然平衡。",
      "formal": "ax+b=c在a≠0时唯一解x=(c−b)/a；a=0要另行判断。",
      "steps": [
        "2x+3=11",
        "两边减3得2x=8",
        "再除2得x=4"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "知道总价和单价，倒推出件数。"
        },
        {
          "kind": "工作中的用处",
          "text": "校准线性传感器、解配方约束。"
        }
      ],
      "lab": "balance",
      "prerequisites": [
        "simple-equations"
      ],
      "source": "moe"
    },
    {
      "id": "systems",
      "stage": "初中",
      "group": "algebra",
      "title": "二元一次方程组",
      "child": "两份不同的购物清单，可以一起告诉我们苹果和梨各卖多少钱。",
      "formal": "两个独立线性约束可确定两个未知数；平行或重合时不一定唯一。",
      "steps": [
        "x+y=7，x−y=1",
        "相加得2x=8，x=4",
        "代回得y=3"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "用两次购物记录还原单价。"
        },
        {
          "kind": "工作中的用处",
          "text": "电路节点计算、生产配比与线性系统。"
        }
      ],
      "lab": "matrix",
      "prerequisites": [
        "linear-equation"
      ],
      "source": "moe"
    },
    {
      "id": "inequalities",
      "stage": "初中",
      "group": "algebra",
      "title": "不等式与取值范围",
      "child": "预算最多20元，每本书5元，能买的数量有一个上限。",
      "formal": "不等式乘除负数时方向反转；解通常是区间而非单个数。",
      "steps": [
        "5x≤20",
        "得到x≤4",
        "买书数还必须是非负整数"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "控制预算、安排时间。"
        },
        {
          "kind": "工作中的用处",
          "text": "程序约束校验、资源容量与线性规划。"
        }
      ],
      "lab": "linear",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "coordinates",
      "stage": "初中",
      "group": "functions",
      "title": "平面直角坐标系",
      "child": "像给教室座位写“第几列、第几行”，两个数就能确定位置。",
      "formal": "有序对(x,y)表示位置；坐标轴相交于原点，单位尺度必须标清。",
      "steps": [
        "点A=(2,3)",
        "先横向走2，再纵向走3",
        "交换成(3,2)通常是另一个点"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "读棋盘和网格地图。"
        },
        {
          "kind": "工作中的用处",
          "text": "屏幕绘制、机器人运动和地理数据的平面表达。"
        }
      ],
      "lab": "vectors",
      "prerequisites": [
        "direction",
        "integers"
      ],
      "source": "moe"
    },
    {
      "id": "linear-function",
      "stage": "初中",
      "group": "functions",
      "title": "一次函数与斜率",
      "child": "起步先付3元，每走1km再付2元，费用按一条直线增加。",
      "formal": "y=kx+b；k表示x增加1时y的变化，b是x=0时的值。",
      "steps": [
        "y=2x+3",
        "走4km时y=11",
        "多走1km增加2元"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "比较两种收费方案。"
        },
        {
          "kind": "工作中的用处",
          "text": "线性标定、回归的基础形式和简单成本预测。"
        }
      ],
      "lab": "linear",
      "prerequisites": [
        "coordinates"
      ],
      "source": "moe"
    },
    {
      "id": "inverse-function",
      "stage": "初中",
      "group": "functions",
      "title": "反比例函数的图像",
      "child": "12块饼，分给的人越多，每人越少，但两者相乘总是12。",
      "formal": "y=k/x，x≠0；定义域、分支及单位限制必须说明。",
      "steps": [
        "x=2时y=6",
        "x=3时y=4",
        "图像不是直线，也不能经过x=0"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "分配固定总量。"
        },
        {
          "kind": "工作中的用处",
          "text": "理想电路定功率关系、固定工作量的时间估算。"
        }
      ],
      "lab": "inverse",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "quadratic",
      "stage": "初中",
      "group": "functions",
      "title": "二次方程与抛物线",
      "child": "小球飞起来再落下，某些简化模型里的高度像一座弯弯的小山。",
      "formal": "y=ax²+bx+c，a≠0；根由判别式Δ=b²−4ac决定。",
      "steps": [
        "x²−5x+6=0",
        "分解成(x−2)(x−3)=0",
        "解为2和3，代回都为0"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "求简单面积问题里的边长。"
        },
        {
          "kind": "工作中的用处",
          "text": "无空气阻力抛体、二次损失函数和轨迹近似。"
        }
      ],
      "lab": "quadratic",
      "prerequisites": [
        "polynomials",
        "coordinates"
      ],
      "source": "moe"
    },
    {
      "id": "angles",
      "stage": "初中",
      "group": "geometry",
      "title": "相交线、平行线与角",
      "child": "一条直线像半圈，转过去是180°；平行线能帮我们搬运角度。",
      "formal": "对顶角相等；平行线的同位角相等；条件不能省略。",
      "steps": [
        "两直线相交，一个角40°",
        "对顶角也是40°",
        "邻角为180°−40°=140°"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "读道路转角、制作折纸。"
        },
        {
          "kind": "工作中的用处",
          "text": "机械装配和二维制图的方向约束。"
        }
      ],
      "lab": "angles",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "triangle-sum",
      "stage": "初中",
      "group": "geometry",
      "title": "三角形内角和",
      "child": "把三个角剪下来，能拼成一条直线吗？",
      "formal": "欧氏平面中三角形三个内角和为180°；球面三角形不同。",
      "steps": [
        "已知两个角50°与60°",
        "第三角180°−50°−60°",
        "得到70°"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "确定三角支架角度。"
        },
        {
          "kind": "工作中的用处",
          "text": "平面网格构造；地球上的大范围测量不能照搬平面结论。"
        }
      ],
      "lab": "angles",
      "prerequisites": [
        "angles"
      ],
      "source": "moe"
    },
    {
      "id": "congruence",
      "stage": "初中",
      "group": "geometry",
      "title": "全等与相似",
      "child": "复印一张图：一样大叫全等，等比例放大叫相似。",
      "formal": "全等保持形状和大小；相似保持角度，长度按同一比例变化。",
      "steps": [
        "两三角形边长3、4、5与6、8、10",
        "对应边比都是2",
        "面积比却是2²=4"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "缩放照片时避免变形。"
        },
        {
          "kind": "工作中的用处",
          "text": "建筑比例模型、计算机视觉特征匹配。"
        }
      ],
      "lab": "ratio",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "pythagoras",
      "stage": "初中",
      "group": "geometry",
      "title": "勾股定理",
      "child": "直角三角形的三条边盖上正方形，最大的那块面积等于另外两块之和。",
      "formal": "直角三角形两直角边a,b与斜边c满足a²+b²=c²。",
      "steps": [
        "a=3，b=4",
        "c²=9+16=25",
        "c=5；不是c=3+4"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "求梯子、矩形对角线的长度。"
        },
        {
          "kind": "工作中的用处",
          "text": "定位距离、三维游戏中的向量长度。"
        }
      ],
      "lab": "pythagoras",
      "prerequisites": [
        "area",
        "triangle-area"
      ],
      "source": "moe"
    },
    {
      "id": "circle-angle",
      "stage": "初中",
      "group": "geometry",
      "title": "圆周角与圆的性质",
      "child": "同一条弦，从圆周不同位置望过去，夹角会有什么规律？",
      "formal": "同弧所对圆周角等于圆心角的一半；必须明确所对的弧。",
      "steps": [
        "某弧圆心角80°",
        "同弧的圆周角40°",
        "若取另一段弧，不能直接沿用80°"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "设计圆形视野与角度。"
        },
        {
          "kind": "工作中的用处",
          "text": "测量几何、光学反射中的圆形结构。"
        }
      ],
      "lab": "circle",
      "prerequisites": [],
      "source": "moe"
    },
    {
      "id": "right-trig",
      "stage": "初中",
      "group": "trig",
      "title": "直角三角形中的三角比",
      "child": "角度相同的坡，放大以后虽然更长，陡不陡却一样。",
      "formal": "sinθ=对边/斜边，cosθ=邻边/斜边，tanθ=对边/邻边。",
      "steps": [
        "3–4–5直角三角形",
        "取对边3的锐角",
        "sinθ=3/5，cosθ=4/5"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "用影长估计树高。"
        },
        {
          "kind": "工作中的用处",
          "text": "测绘、机械斜面与机器人姿态计算。"
        }
      ],
      "lab": "trig",
      "prerequisites": [
        "congruence",
        "pythagoras"
      ],
      "source": "moe"
    },
    {
      "id": "probability",
      "stage": "初中",
      "group": "statistics",
      "title": "概率与频率",
      "child": "硬币一半机会正面，不是每抛两次就一定一正一反。",
      "formal": "概率描述模型下的可能性；频率是有限实验的比例，两者不能混同。",
      "steps": [
        "假设正面概率1/2",
        "抛10次可能出现6次正面",
        "频率0.6不推翻概率0.5"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "比较抽签游戏是否公平。"
        },
        {
          "kind": "工作中的用处",
          "text": "模拟随机过程、抽样质检与负载测试。"
        }
      ],
      "lab": "probability",
      "prerequisites": [
        "fractions",
        "data-count"
      ],
      "source": "moe"
    },
    {
      "id": "spread",
      "stage": "初中",
      "group": "statistics",
      "title": "方差与数据波动",
      "child": "两组数平均数一样，一组很整齐，一组忽高忽低，哪组更稳定？",
      "formal": "总体方差为偏离均值的平方的平均；样本无偏估计常用n−1作分母。",
      "steps": [
        "2、4、6平均4",
        "偏差为−2、0、2",
        "总体方差(4+0+4)/3=8/3"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "看一周作息是否稳定。"
        },
        {
          "kind": "工作中的用处",
          "text": "制造公差、模型误差和服务延迟波动。"
        }
      ],
      "lab": "statistics",
      "prerequisites": [
        "mean"
      ],
      "source": "moe"
    },
    {
      "id": "sets",
      "stage": "高中",
      "group": "logic",
      "title": "集合与集合运算",
      "child": "把会游泳和会骑车的人画成两个圈，重叠处是谁？",
      "formal": "并集A∪B、交集A∩B和差集A\\\\B分别对应至少一个、两者都有、只在A中。",
      "steps": [
        "A={1,2,3}，B={3,4}",
        "交集{3}，并集{1,2,3,4}",
        "交集被重复数了一次，要减掉"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "整理两份名单并去重。"
        },
        {
          "kind": "工作中的用处",
          "text": "数据库集合运算、权限组合和搜索过滤。"
        }
      ],
      "lab": "sets",
      "prerequisites": [],
      "source": "high"
    },
    {
      "id": "logic",
      "stage": "高中",
      "group": "logic",
      "title": "命题、条件与反例",
      "child": "“下雨地面会湿”不代表“地面湿一定下雨”，洒水也可能让地面湿。",
      "formal": "p⇒q与q⇒p不同；否定“所有”只需找一个反例。",
      "steps": [
        "若正方形，则一定是矩形",
        "矩形不一定是正方形",
        "长5宽3的矩形就是反例"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "辨别广告与日常推理的漏洞。"
        },
        {
          "kind": "工作中的用处",
          "text": "程序条件、形式验证和需求边界检查。"
        }
      ],
      "lab": "sets",
      "prerequisites": [],
      "source": "high"
    },
    {
      "id": "function-domain",
      "stage": "高中",
      "group": "functions",
      "title": "函数、定义域与值域",
      "child": "一台机器每放进一个允许的数，只吐出一个结果，才叫函数。",
      "formal": "函数把定义域中每个元素唯一映到一个输出；值域是实际输出集合。",
      "steps": [
        "f(x)=1/x",
        "输入0不允许",
        "输入2唯一得到1/2"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "看一条收费规则是否说清适用条件。"
        },
        {
          "kind": "工作中的用处",
          "text": "API输入校验和函数契约。"
        }
      ],
      "lab": "inverse",
      "prerequisites": [
        "sets",
        "linear-function"
      ],
      "source": "high"
    },
    {
      "id": "function-transform",
      "stage": "高中",
      "group": "functions",
      "title": "函数的平移与伸缩",
      "child": "把一座小山向右搬两格，公式里为什么出现x−2？",
      "formal": "f(x−h)+k表示图像右移h、上移k；自变量与输出的变换不同。",
      "steps": [
        "原图y=x²",
        "新图y=(x−2)²+1",
        "顶点从(0,0)变到(2,1)"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "调整图片亮度曲线与曲线位置。"
        },
        {
          "kind": "工作中的用处",
          "text": "信号延时、动画曲线与模型参数化。"
        }
      ],
      "lab": "quadratic",
      "prerequisites": [],
      "source": "high"
    },
    {
      "id": "exponential",
      "stage": "高中",
      "group": "functions",
      "title": "指数增长与衰减",
      "child": "每次变成原来的两倍，前面看起来慢，后面却会飞快长大。",
      "formal": "y=aᵡ，a>0且a≠1；等时间间隔按固定倍数变化。",
      "steps": [
        "从1开始翻倍",
        "1、2、4、8、16",
        "第n次为2ⁿ，不是2n"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "观察折纸厚度的理想数量关系。"
        },
        {
          "kind": "工作中的用处",
          "text": "算法复杂度、细胞培养的早期简化模型与衰减模型。"
        }
      ],
      "lab": "exponential",
      "prerequisites": [
        "powers"
      ],
      "source": "high"
    },
    {
      "id": "logarithms",
      "stage": "高中",
      "group": "functions",
      "title": "对数：反过来问指数",
      "child": "不是问“2的3次方是多少”，而是问“2乘自己几次才到8”。",
      "formal": "logₐb=x等价于aˣ=b；a>0，a≠1，b>0。",
      "steps": [
        "2³=8",
        "所以log₂8=3",
        "log₂32=5"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "理解地震、声音等对数刻度的设计思想。"
        },
        {
          "kind": "工作中的用处",
          "text": "二分查找次数、信息量和跨数量级数据展示。"
        }
      ],
      "lab": "exponential",
      "prerequisites": [
        "exponential"
      ],
      "source": "high"
    },
    {
      "id": "arithmetic-sequence",
      "stage": "高中",
      "group": "algebra",
      "title": "等差数列与求和",
      "child": "每天比前一天多读2页，总共读了多少页？",
      "formal": "aₙ=a₁+(n−1)d；Sₙ=n(a₁+aₙ)/2。",
      "steps": [
        "1+2+…+10",
        "首尾配成11，一共5对",
        "总和55"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "计算逐日递增的训练计划总量。"
        },
        {
          "kind": "工作中的用处",
          "text": "阶梯生产、简单排程和循环次数分析。"
        }
      ],
      "lab": "sequence",
      "prerequisites": [
        "addition"
      ],
      "source": "high"
    },
    {
      "id": "geometric-sequence",
      "stage": "高中",
      "group": "algebra",
      "title": "等比数列与求和",
      "child": "每一步都乘同一个数，像连续放大或连续缩小。",
      "formal": "Sₙ=a₁(1−qⁿ)/(1−q)，q≠1；q=1时Sₙ=na₁。",
      "steps": [
        "1+2+4+8",
        "乘2得到2+4+8+16",
        "相减得S=16−1=15"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "理解连续折半的总量。"
        },
        {
          "kind": "工作中的用处",
          "text": "分层存储、递归树和信号衰减。"
        }
      ],
      "lab": "sequence",
      "prerequisites": [
        "multiplication"
      ],
      "source": "high"
    },
    {
      "id": "induction",
      "stage": "高中",
      "group": "algebra",
      "title": "数学归纳法",
      "child": "第一块骨牌会倒，而且每一块都能推倒下一块，就能一块接一块。",
      "formal": "证明基础情形，再证明P(k)⇒P(k+1)，可推出所有指定自然数情形。",
      "steps": [
        "先检验n=1的求和公式",
        "假设1+…+k=k(k+1)/2",
        "加k+1得到(k+1)(k+2)/2"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "检查重复规则为何一直成立。"
        },
        {
          "kind": "工作中的用处",
          "text": "证明递归算法和循环不变量。"
        }
      ],
      "lab": "sequence",
      "prerequisites": [
        "logic"
      ],
      "source": "high"
    },
    {
      "id": "radians",
      "stage": "高中",
      "group": "trig",
      "title": "弧度与单位圆",
      "child": "把弧长和半径作比较，就能用另一种方式量角。",
      "formal": "弧度θ=s/r；一整圈为2πrad=360°。",
      "steps": [
        "半径2，弧长π",
        "角度是π/2弧度",
        "对应90°"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "圆轮转动与弧长换算。"
        },
        {
          "kind": "工作中的用处",
          "text": "编程三角函数通常使用弧度，而不是角度。"
        }
      ],
      "lab": "trig",
      "prerequisites": [
        "circle"
      ],
      "source": "high"
    },
    {
      "id": "trig-functions",
      "stage": "高中",
      "group": "trig",
      "title": "正弦、余弦与周期",
      "child": "沿圆转一圈，你的高度会先升后降，再回到原点。",
      "formal": "单位圆点坐标为(cosθ,sinθ)，两函数的周期为2π。",
      "steps": [
        "θ=0时(1,0)",
        "θ=π/2时(0,1)",
        "θ=π时(−1,0)"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "描述季节、摆动等周期现象的模型。"
        },
        {
          "kind": "工作中的用处",
          "text": "声音合成、交流电与动画缓动。"
        }
      ],
      "lab": "trig",
      "prerequisites": [
        "right-trig",
        "radians"
      ],
      "source": "high"
    },
    {
      "id": "trig-identities",
      "stage": "高中",
      "group": "trig",
      "title": "三角恒等式",
      "child": "同一个圆上的点，不管怎么转，到圆心都保持距离1。",
      "formal": "sin²θ+cos²θ=1；加角公式连接不同角度。",
      "steps": [
        "θ=30°",
        "sinθ=1/2，cosθ=√3/2",
        "平方相加1/4+3/4=1"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "检验角度计算有没有出错。"
        },
        {
          "kind": "工作中的用处",
          "text": "信号分解和二维旋转矩阵。"
        }
      ],
      "lab": "trig",
      "prerequisites": [
        "trig-functions"
      ],
      "source": "high"
    },
    {
      "id": "sine-cosine-law",
      "stage": "高中",
      "group": "trig",
      "title": "正弦定理与余弦定理",
      "child": "不是直角的三角形，也能通过边和角互相找线索。",
      "formal": "c²=a²+b²−2abcosC；a/sinA=b/sinB=c/sinC=2R。",
      "steps": [
        "a=b=2，夹角60°",
        "c²=4+4−8×1/2=4",
        "所以c=2"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "从两个观察点估计距离。"
        },
        {
          "kind": "工作中的用处",
          "text": "测量三角网和机器人连杆几何。"
        }
      ],
      "lab": "vectors",
      "prerequisites": [],
      "source": "high"
    },
    {
      "id": "vectors",
      "stage": "高中",
      "group": "trig",
      "title": "向量：大小与方向",
      "child": "向东走3步再向北走4步，总移动不是“随便走7步”。",
      "formal": "向量用有序分量表示；相加按分量，长度使用欧氏范数。",
      "steps": [
        "(3,0)+(0,4)=(3,4)",
        "长度√(9+16)=5",
        "路程7与位移长度5不同"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "理解风向、位移与受力。"
        },
        {
          "kind": "工作中的用处",
          "text": "游戏运动、机械力与图像特征表示。"
        }
      ],
      "lab": "vectors",
      "prerequisites": [
        "coordinates",
        "pythagoras"
      ],
      "source": "high"
    },
    {
      "id": "dot-product",
      "stage": "高中",
      "group": "trig",
      "title": "数量积与投影",
      "child": "推箱子时，只有朝箱子移动方向的那部分力做功。",
      "formal": "a·b=Σaᵢbᵢ=‖a‖‖b‖cosθ；垂直非零向量数量积为0。",
      "steps": [
        "(3,0)·(0,4)=0",
        "它们互相垂直",
        "(3,0)·(2,0)=6"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "判断一个动作朝目标方向出了多少力。"
        },
        {
          "kind": "工作中的用处",
          "text": "相似度、投影、光照和功的计算。"
        }
      ],
      "lab": "vectors",
      "prerequisites": [
        "vectors",
        "right-trig"
      ],
      "source": "high"
    },
    {
      "id": "conics",
      "stage": "高中",
      "group": "geometry",
      "title": "圆锥曲线",
      "child": "圆、椭圆和抛物线不是随便画的弯线，它们各有固定的几何规则。",
      "formal": "椭圆到两焦点的距离和不变；抛物线到焦点与准线等距。",
      "steps": [
        "椭圆方程x²/9+y²/4=1",
        "长半轴3，短半轴2",
        "两焦点距离由c²=9−4得到"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "观察反光碗与椭圆跑道形状。"
        },
        {
          "kind": "工作中的用处",
          "text": "天体轨道近似、抛物面反射器与轨迹设计。"
        }
      ],
      "lab": "conics",
      "prerequisites": [],
      "source": "high"
    },
    {
      "id": "space-geometry",
      "stage": "高中",
      "group": "geometry",
      "title": "空间几何与投影",
      "child": "同一个积木，从前面、上面、侧面看，会看到不同形状。",
      "formal": "三维位置需要三个坐标；投影会丢失某些深度信息。",
      "steps": [
        "长4宽3高2的盒子",
        "俯视是4×3矩形",
        "正视可能是4×2，需说明观察方向"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "拼搭积木、读三视图。"
        },
        {
          "kind": "工作中的用处",
          "text": "CAD设计、三维打印与计算机图形学。"
        }
      ],
      "lab": "volume",
      "prerequisites": [],
      "source": "high"
    },
    {
      "id": "complex",
      "stage": "高中",
      "group": "algebra",
      "title": "复数：把数轴扩成平面",
      "child": "普通数轴左右走，复数再添一个上下方向，乘i会转四分之一圈。",
      "formal": "i²=−1；z=a+bi对应平面点(a,b)，模为√(a²+b²)。",
      "steps": [
        "(2+i)×i=−1+2i",
        "点(2,1)转到(−1,2)",
        "长度仍是√5"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "理解旋转与周期信号的简洁表达。"
        },
        {
          "kind": "工作中的用处",
          "text": "交流电相量、频域分析和数字信号处理。"
        }
      ],
      "lab": "complex",
      "prerequisites": [
        "real-numbers",
        "coordinates"
      ],
      "source": "high"
    },
    {
      "id": "permutations",
      "stage": "高中",
      "group": "statistics",
      "title": "排列与组合",
      "child": "选3个人和给3个人排座位，不是一回事：一个管顺序，一个不管。",
      "formal": "P(n,k)=n!/(n−k)!；C(n,k)=n!/[k!(n−k)!]。",
      "steps": [
        "从4人选2人有6种",
        "给两人排左右又有2种",
        "所以排2个座位有12种"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "安排座位、组队与抽奖。"
        },
        {
          "kind": "工作中的用处",
          "text": "测试组合覆盖、排程和概率计数。"
        }
      ],
      "lab": "combinations",
      "prerequisites": [
        "multiplication"
      ],
      "source": "high"
    },
    {
      "id": "binomial-theorem",
      "stage": "高中",
      "group": "statistics",
      "title": "二项式定理",
      "child": "展开(a+b)ⁿ时，每一项都来自n次选择：这次选a还是b？",
      "formal": "(a+b)ⁿ=ΣC(n,k)aⁿ⁻ᵏbᵏ，n为非负整数。",
      "steps": [
        "(a+b)³有8条选择路径",
        "选一个b有3种",
        "得到a³+3a²b+3ab²+b³"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "理解杨辉三角里的系数。"
        },
        {
          "kind": "工作中的用处",
          "text": "概率分布、近似计算与组合算法。"
        }
      ],
      "lab": "combinations",
      "prerequisites": [
        "permutations",
        "identities"
      ],
      "source": "high"
    },
    {
      "id": "conditional",
      "stage": "高中",
      "group": "statistics",
      "title": "条件概率与独立性",
      "child": "已知道抽到的是红牌，再问它是红桃，范围就变小了。",
      "formal": "P(A∣B)=P(A∩B)/P(B)，P(B)>0；独立要求P(A∩B)=P(A)P(B)。",
      "steps": [
        "一副牌红牌26张",
        "红桃13张",
        "已知红牌时红桃概率13/26=1/2"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "读“在某类人中”的调查结论。"
        },
        {
          "kind": "工作中的用处",
          "text": "推荐系统、风险模型和条件筛选。"
        }
      ],
      "lab": "bayes",
      "prerequisites": [
        "probability",
        "sets"
      ],
      "source": "high"
    },
    {
      "id": "random-variable",
      "stage": "高中",
      "group": "statistics",
      "title": "随机变量与期望",
      "child": "每次游戏拿到的分数可能不同；期望是按机会加权的平均，不是保证得分。",
      "formal": "离散期望E[X]=ΣxP(X=x)，方差E[(X−E[X])²]。",
      "steps": [
        "公平骰子点数1到6",
        "平均(1+2+3+4+5+6)/6=3.5",
        "一次不可能掷出3.5点"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "比较规则下的长期平均收益。"
        },
        {
          "kind": "工作中的用处",
          "text": "容量规划、随机算法与库存期望。"
        }
      ],
      "lab": "probability",
      "prerequisites": [
        "probability",
        "mean"
      ],
      "source": "high"
    },
    {
      "id": "regression",
      "stage": "高中",
      "group": "statistics",
      "title": "相关、回归与因果",
      "child": "冰淇淋卖得多的时候游泳的人也多，不代表冰淇淋让人去游泳。",
      "formal": "回归拟合变量关系；相关不等于因果，混杂因素必须考虑。",
      "steps": [
        "用直线y=kx+b近似一组点",
        "最小化竖直残差平方和",
        "拟合好不代表证明x导致y"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "读懂统计图，避免误解。"
        },
        {
          "kind": "工作中的用处",
          "text": "趋势建模、实验分析和预测误差评估。"
        }
      ],
      "lab": "regression",
      "prerequisites": [
        "linear-function",
        "spread"
      ],
      "source": "high"
    },
    {
      "id": "derivative-intro",
      "stage": "高中",
      "group": "calculus",
      "title": "导数：这一刻有多快",
      "child": "平均速度是一整段路的快慢，导数追问“就在这一刻呢”。",
      "formal": "f′(x)=lim[h→0](f(x+h)−f(x))/h，极限存在时才定义导数。",
      "steps": [
        "f(x)=x²，在x=2处",
        "差商为4+h",
        "h趋近0，导数为4"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "理解汽车速度表显示的瞬时速度。"
        },
        {
          "kind": "工作中的用处",
          "text": "优化、灵敏度分析和运动控制。"
        }
      ],
      "lab": "derivative",
      "prerequisites": [
        "quadratic"
      ],
      "source": "calculus"
    },
    {
      "id": "limits",
      "stage": "大学基础与进阶",
      "group": "calculus",
      "title": "极限：无限靠近",
      "child": "你每次走剩余路程的一半，会越来越接近终点；有限次和极限要分清。",
      "formal": "极限刻画输入或序号趋近时输出的趋势；趋近不等于已经达到。",
      "steps": [
        "数列1/2、3/4、7/8",
        "第n项是1−2⁻ⁿ",
        "与1的差2⁻ⁿ趋近0"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "理解不断提高精度的计算。"
        },
        {
          "kind": "工作中的用处",
          "text": "数值算法的收敛、微积分与误差控制。"
        }
      ],
      "lab": "sequence",
      "prerequisites": [
        "geometric-sequence"
      ],
      "source": "calculus"
    },
    {
      "id": "continuity",
      "stage": "大学基础与进阶",
      "group": "calculus",
      "title": "连续与间断",
      "child": "画图时不抬笔的感觉能帮助想象连续，但正式定义还要说明“靠近”。",
      "formal": "f在a连续要求lim[x→a]f(x)=f(a)，并且函数值存在。",
      "steps": [
        "f(x)=x²在2附近趋近4",
        "f(2)=4，所以连续",
        "人为把f(2)改成7就出现间断"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "识别平滑变化和突然跳变。"
        },
        {
          "kind": "工作中的用处",
          "text": "控制系统、插值与物理模型边界。"
        }
      ],
      "lab": "linear",
      "prerequisites": [
        "limits",
        "function-domain"
      ],
      "source": "calculus"
    },
    {
      "id": "derivatives",
      "stage": "大学基础与进阶",
      "group": "calculus",
      "title": "求导法则",
      "child": "复杂变化可以拆成加法、乘法和“机器套机器”，分别处理。",
      "formal": "(fg)′=f′g+fg′；复合函数求导(f∘g)′=f′(g)g′。",
      "steps": [
        "y=(3x+1)²",
        "外层求导是2(3x+1)",
        "再乘内层导数3，得6(3x+1)"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "分析某个参数变化会带来多大影响。"
        },
        {
          "kind": "工作中的用处",
          "text": "自动微分、神经网络反向传播与工程优化。"
        }
      ],
      "lab": "derivative",
      "prerequisites": [
        "derivative-intro",
        "limits"
      ],
      "source": "calculus"
    },
    {
      "id": "mean-value",
      "stage": "大学基础与进阶",
      "group": "calculus",
      "title": "中值定理",
      "child": "一段路的平均速度是60，满足平滑条件时，中间至少有一刻速度正好是60。",
      "formal": "若f在[a,b]连续且在(a,b)可导，则存在ξ使f′(ξ)=[f(b)−f(a)]/(b−a)。",
      "steps": [
        "f(x)=x²，区间[1,3]",
        "平均斜率(9−1)/2=4",
        "f′(2)=4，ξ=2"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "连接全程平均与某一时刻变化。"
        },
        {
          "kind": "工作中的用处",
          "text": "证明误差界、单调性和数值算法性质。"
        }
      ],
      "lab": "derivative",
      "prerequisites": [
        "derivatives",
        "continuity"
      ],
      "source": "calculus"
    },
    {
      "id": "optimization",
      "stage": "大学基础与进阶",
      "group": "calculus",
      "title": "极值与最优化",
      "child": "同样长的围栏，围成哪种长方形能装下最多面积？",
      "formal": "内部可导极值点须满足f′=0，但驻点未必是极值；还要检查端点与约束。",
      "steps": [
        "周长20，设一边x",
        "另一边10−x，面积x(10−x)",
        "最大在x=5，面积25"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "固定材料如何获得最大使用面积。"
        },
        {
          "kind": "工作中的用处",
          "text": "生产计划、模型训练与资源配置。"
        }
      ],
      "lab": "optimization",
      "prerequisites": [
        "derivatives",
        "quadratic"
      ],
      "source": "calculus"
    },
    {
      "id": "integral",
      "stage": "大学基础与进阶",
      "group": "calculus",
      "title": "定积分与黎曼和",
      "child": "把弯曲地面切成很多很窄的小条，先算每条，再加起来。",
      "formal": "定积分是满足条件的分割和的极限；可表示有符号面积与累积量。",
      "steps": [
        "求0到1下方x²的面积",
        "用n个小矩形近似",
        "n增大时，左右和夹向1/3"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "由变化的流量算总水量。"
        },
        {
          "kind": "工作中的用处",
          "text": "能量、概率、图像累积和工程载荷计算。"
        }
      ],
      "lab": "integral",
      "prerequisites": [
        "area",
        "limits"
      ],
      "source": "calculus"
    },
    {
      "id": "fundamental",
      "stage": "大学基础与进阶",
      "group": "calculus",
      "title": "微积分基本定理",
      "child": "“一小段怎样变”与“全部加起来多少”其实是一对互相联系的操作。",
      "formal": "连续f的累积函数F(x)=∫ₐˣf(t)dt满足F′=f；若G′=f，则∫ₐᵇf=G(b)−G(a)。",
      "steps": [
        "x²的一个原函数是x³/3",
        "0到1积分为1/3−0",
        "与矩形逼近结果一致"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "用速度算路程，再用路程求速度。"
        },
        {
          "kind": "工作中的用处",
          "text": "把累积计算化为端点求值，降低计算成本。"
        }
      ],
      "lab": "integral",
      "prerequisites": [
        "derivatives",
        "integral"
      ],
      "source": "calculus"
    },
    {
      "id": "integration-methods",
      "stage": "大学基础与进阶",
      "group": "calculus",
      "title": "换元与分部积分",
      "child": "有时换一个尺子，有时把乘积拆开，难算的累积就变简单。",
      "formal": "换元需同步处理微分与积分限；∫u dv=uv−∫v du。",
      "steps": [
        "∫₀¹2x·cos(x²)dx",
        "令u=x²，du=2x dx",
        "积分变∫₀¹cosu du=sin1"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "理解巧妙替换能简化问题。"
        },
        {
          "kind": "工作中的用处",
          "text": "解析建模、概率积分和微分方程求解。"
        }
      ],
      "lab": "integral",
      "prerequisites": [
        "fundamental"
      ],
      "source": "calculus"
    },
    {
      "id": "improper",
      "stage": "大学基础与进阶",
      "group": "calculus",
      "title": "反常积分",
      "child": "路一直延伸到无限远，面积也可能有一个有限总数。",
      "formal": "无穷区间或无界函数的积分用极限定义，必须判断收敛。",
      "steps": [
        "∫₁ᴿ1/x² dx=1−1/R",
        "R趋于无穷",
        "积分收敛到1，而∫₁∞1/x发散"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "区分“无穷长”和“无穷大”。"
        },
        {
          "kind": "工作中的用处",
          "text": "长尾分布、衰减与无限范围模型。"
        }
      ],
      "lab": "sequence",
      "prerequisites": [
        "integral",
        "limits"
      ],
      "source": "calculus"
    },
    {
      "id": "series",
      "stage": "大学基础与进阶",
      "group": "calculus",
      "title": "级数与收敛",
      "child": "无限多个小数相加，有时加得完，有时越加越大。",
      "formal": "级数收敛指部分和有有限极限；项趋于0是必要但不充分条件。",
      "steps": [
        "1/2+1/4+…部分和趋于1",
        "1+1/2+1/3+…各项也趋于0",
        "但调和级数仍发散"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "识别重复投入是否可能有有限总量。"
        },
        {
          "kind": "工作中的用处",
          "text": "误差展开、算法分析与信号表示。"
        }
      ],
      "lab": "sequence",
      "prerequisites": [
        "limits",
        "geometric-sequence"
      ],
      "source": "calculus"
    },
    {
      "id": "taylor",
      "stage": "大学基础与进阶",
      "group": "calculus",
      "title": "泰勒展开",
      "child": "复杂曲线附近，用一条越来越贴近的多项式来代替。",
      "formal": "在合适光滑与余项条件下，用各阶导数构造局部多项式；不能忽略余项。",
      "steps": [
        "eˣ≈1+x+x²/2",
        "x=0.1时近似1.105",
        "增加阶数并估计余项才能控制精度"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "用简单算式估计复杂函数。"
        },
        {
          "kind": "工作中的用处",
          "text": "计算器、仿真与数值函数库。"
        }
      ],
      "lab": "taylor",
      "prerequisites": [
        "series",
        "derivatives"
      ],
      "source": "calculus"
    },
    {
      "id": "parametric",
      "stage": "大学基础与进阶",
      "group": "calculus",
      "title": "参数方程与极坐标",
      "child": "可以用横纵坐标描述点，也可以用“离中心多远、转了多少角”来描述。",
      "formal": "极坐标转换x=r cosθ，y=r sinθ；参数曲线由同一个参数联系坐标。",
      "steps": [
        "r=2，θ=π/2",
        "x=0，y=2",
        "圆也可写x=2cost，y=2sint"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "旋转机械或雷达上的位置。"
        },
        {
          "kind": "工作中的用处",
          "text": "轨迹规划、动画路径与天体运动模型。"
        }
      ],
      "lab": "trig",
      "prerequisites": [
        "trig-functions"
      ],
      "source": "calculus"
    },
    {
      "id": "partial",
      "stage": "大学基础与进阶",
      "group": "calculus",
      "title": "偏导数与全微分",
      "child": "山坡上有东西、南北两个方向，沿哪个方向走更陡？",
      "formal": "偏导数研究固定其他变量时的变化；全微分是局部线性近似。",
      "steps": [
        "f(x,y)=x²+3y²",
        "∂f/∂x=2x，∂f/∂y=6y",
        "在(1,1)分别为2和6"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "比较多个条件对结果的影响。"
        },
        {
          "kind": "工作中的用处",
          "text": "多参数敏感度分析、曲面与优化。"
        }
      ],
      "lab": "gradient",
      "prerequisites": [
        "derivatives",
        "vectors"
      ],
      "source": "calculus"
    },
    {
      "id": "multiple-integrals",
      "stage": "大学基础与进阶",
      "group": "calculus",
      "title": "二重积分与三重积分",
      "child": "把一整块地面切成小格，每格上的高度加起来，就能估算体积。",
      "formal": "多重积分在区域内累积；换坐标时必须计入面积或体积伸缩因子。",
      "steps": [
        "单位正方形上f=x+y",
        "对y积分得x+1/2",
        "再对x从0到1积分，得到1"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "估算地形下方的体积。"
        },
        {
          "kind": "工作中的用处",
          "text": "质量分布、概率联合密度与流体计算。"
        }
      ],
      "lab": "volume",
      "prerequisites": [
        "integral",
        "partial"
      ],
      "source": "calculus"
    },
    {
      "id": "vector-calculus",
      "stage": "大学基础与进阶",
      "group": "calculus",
      "title": "梯度、散度与旋度",
      "child": "地图上每一点都有风向箭头：哪里往外冒风，哪里在打转？",
      "formal": "梯度描述标量场最陡方向；散度与旋度描述向量场的局部流出和旋转。",
      "steps": [
        "F=(x,y)",
        "二维散度∂x/∂x+∂y/∂y=2",
        "这是均匀向外扩散的示例"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "观察水流或温度场的方向变化。"
        },
        {
          "kind": "工作中的用处",
          "text": "电磁场、流体力学与计算物理。"
        }
      ],
      "lab": "gradient",
      "prerequisites": [
        "partial",
        "vectors"
      ],
      "source": "calculus"
    },
    {
      "id": "differential",
      "stage": "大学基础与进阶",
      "group": "calculus",
      "title": "微分方程",
      "child": "不是直接告诉你数量，而是告诉你“它怎样变化”，能反推出未来吗？",
      "formal": "微分方程联系未知函数及其导数；初始条件通常参与确定解。",
      "steps": [
        "y′=ky，y(0)=1",
        "解为y=eᵏᵗ",
        "k>0增长，k<0衰减"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "理解简化冷却和增长过程。"
        },
        {
          "kind": "工作中的用处",
          "text": "电路、机械振动、控制与动力系统。"
        }
      ],
      "lab": "differential",
      "prerequisites": [
        "derivatives",
        "exponential"
      ],
      "source": "calculus"
    },
    {
      "id": "matrices",
      "stage": "大学基础与进阶",
      "group": "linear",
      "title": "矩阵与线性变换",
      "child": "一张数字表可以把一整张网格拉长、压扁或旋转。",
      "formal": "矩阵A作用于列向量x得到Ax；矩阵乘法一般不可交换。",
      "steps": [
        "A=[[2,0],[0,1]]",
        "把(1,1)变成(2,1)",
        "横向放大2倍，纵向不变"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "改变图片的形状和方向。"
        },
        {
          "kind": "工作中的用处",
          "text": "图形渲染、数据计算与神经网络的线性层。"
        }
      ],
      "lab": "matrix",
      "prerequisites": [
        "vectors",
        "systems"
      ],
      "source": "linear"
    },
    {
      "id": "elimination",
      "stage": "大学基础与进阶",
      "group": "linear",
      "title": "高斯消元",
      "child": "把复杂的几条线索一步一步消去多余未知数，直到能直接读答案。",
      "formal": "初等行变换保持线性方程组的解集；零行可揭示无解或自由变量。",
      "steps": [
        "x+y=3，2x+y=4",
        "第二式减第一式，得x=1",
        "代回第一式得y=2"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "有条理地解多条数量约束。"
        },
        {
          "kind": "工作中的用处",
          "text": "电路计算、结构分析和科学计算基础。"
        }
      ],
      "lab": "matrix",
      "prerequisites": [
        "systems",
        "matrices"
      ],
      "source": "linear"
    },
    {
      "id": "determinant",
      "stage": "大学基础与进阶",
      "group": "linear",
      "title": "行列式：面积放大多少",
      "child": "把一个单位正方形变成斜四边形，面积变了几倍？",
      "formal": "二维矩阵detA=ad−bc，绝对值是有向面积的缩放；符号表示定向。",
      "steps": [
        "A=[[2,1],[0,3]]",
        "行列式2×3−1×0=6",
        "单位正方形面积变为6"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "判断变换是否把图形压扁成线。"
        },
        {
          "kind": "工作中的用处",
          "text": "坐标变换、可逆性判断与积分换元。"
        }
      ],
      "lab": "matrix",
      "prerequisites": [
        "matrices",
        "area"
      ],
      "source": "linear"
    },
    {
      "id": "inverse-matrix",
      "stage": "大学基础与进阶",
      "group": "linear",
      "title": "逆矩阵与可逆性",
      "child": "拉伸过的图，能不能完全拉回去？如果压成了一条线，就找不回所有细节。",
      "formal": "A可逆当且仅当detA≠0；二维逆矩阵为1/(ad−bc)[[d,−b],[−c,a]]。",
      "steps": [
        "A=diag(2,3)",
        "逆矩阵diag(1/2,1/3)",
        "先变换再逆变换回到原点坐标"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "恢复可逆几何变形。"
        },
        {
          "kind": "工作中的用处",
          "text": "坐标系统转换、线性方程和标定。"
        }
      ],
      "lab": "matrix",
      "prerequisites": [
        "determinant"
      ],
      "source": "linear"
    },
    {
      "id": "vector-spaces",
      "stage": "大学基础与进阶",
      "group": "linear",
      "title": "向量空间、基与维数",
      "child": "两支不平行的方向箭头能拼出平面上的任意位置。",
      "formal": "基是一组线性无关且张成整个空间的向量；维数是基中向量数。",
      "steps": [
        "(3,4)=3(1,0)+4(0,1)",
        "这两支单位向量是一组基",
        "若两支都水平，就到不了上方"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "理解用哪些基本方向描述位置。"
        },
        {
          "kind": "工作中的用处",
          "text": "数据特征空间、信号基与压缩表示。"
        }
      ],
      "lab": "vectors",
      "prerequisites": [
        "vectors",
        "systems"
      ],
      "source": "linear"
    },
    {
      "id": "rank",
      "stage": "大学基础与进阶",
      "group": "linear",
      "title": "零空间与秩",
      "child": "有些输入虽然不同，经过机器后却都变成0；信息在什么方向丢了？",
      "formal": "秩是像空间维数；对n列矩阵，rank(A)+nullity(A)=n。",
      "steps": [
        "A=[[1,0],[0,0]]",
        "任意(0,y)都被映到0",
        "秩1、零空间维数1，总和2"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "理解压缩时丢失了什么信息。"
        },
        {
          "kind": "工作中的用处",
          "text": "欠定系统、约束自由度和数据冗余。"
        }
      ],
      "lab": "matrix",
      "prerequisites": [
        "vector-spaces",
        "elimination"
      ],
      "source": "linear"
    },
    {
      "id": "eigen",
      "stage": "大学基础与进阶",
      "group": "linear",
      "title": "特征值与特征向量",
      "child": "有些箭头经过变换，只变长短，不转方向；它们特别值得注意。",
      "formal": "Av=λv且v≠0；λ是特征值，v是对应特征向量。",
      "steps": [
        "A=diag(2,3)",
        "(1,0)变为2(1,0)",
        "(0,1)变为3(0,1)"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "找出变换最自然的方向。"
        },
        {
          "kind": "工作中的用处",
          "text": "振动模态、稳定性和主成分分析。"
        }
      ],
      "lab": "matrix",
      "prerequisites": [
        "matrices",
        "quadratic"
      ],
      "source": "linear"
    },
    {
      "id": "orthogonal",
      "stage": "大学基础与进阶",
      "group": "linear",
      "title": "正交与投影",
      "child": "把斜着的箭头照到水平地面，影子就是它在这个方向的投影。",
      "formal": "单位向量u上的投影为(v·u)u；残差与u正交。",
      "steps": [
        "v=(3,4)，u=(1,0)",
        "投影=(3,0)",
        "残差(0,4)与u垂直"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "分解沿坡方向和垂直方向的力。"
        },
        {
          "kind": "工作中的用处",
          "text": "最小二乘、信号分解与去除冗余特征。"
        }
      ],
      "lab": "vectors",
      "prerequisites": [
        "dot-product"
      ],
      "source": "linear"
    },
    {
      "id": "least-squares",
      "stage": "大学基础与进阶",
      "group": "linear",
      "title": "最小二乘",
      "child": "数据点排得不整齐，找一条让整体偏差最小的线，而不是只讨好某一个点。",
      "formal": "最小化‖Ax−b‖²；正规方程AᵀAx=Aᵀb，唯一性需列满秩。",
      "steps": [
        "给定点(0,1),(1,2),(2,2)",
        "计算最小平方误差直线",
        "得到y=0.5x+7/6"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "从带噪声测量中寻找规律。"
        },
        {
          "kind": "工作中的用处",
          "text": "传感器标定、回归与参数估计。"
        }
      ],
      "lab": "regression",
      "prerequisites": [
        "orthogonal",
        "regression"
      ],
      "source": "linear"
    },
    {
      "id": "svd",
      "stage": "大学基础与进阶",
      "group": "linear",
      "title": "奇异值分解与降维",
      "child": "一台复杂的变形机器，可以拆成旋转、沿轴拉伸、再旋转。",
      "formal": "A=UΣVᵀ；保留最大的若干奇异值，可构造低秩近似。",
      "steps": [
        "矩阵diag(5,1)的奇异值是5和1",
        "只保留5得到diag(5,0)",
        "保留主方向，但丢失另一个方向"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "理解压缩不可能保留所有细节。"
        },
        {
          "kind": "工作中的用处",
          "text": "图像压缩、推荐系统与数值稳定计算。"
        }
      ],
      "lab": "matrix",
      "prerequisites": [
        "eigen",
        "orthogonal"
      ],
      "source": "linear"
    },
    {
      "id": "distributions",
      "stage": "大学基础与进阶",
      "group": "statistics",
      "title": "常见概率分布",
      "child": "数“成功几次”和量“身高多少”是两类随机问题，使用的模型不同。",
      "formal": "二项分布描述固定次数独立伯努利成功数；正态分布是连续密度模型。",
      "steps": [
        "10次独立试验，每次成功率0.5",
        "期望成功5次",
        "实际次数是0到10中的整数"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "合理选择“计数”或“连续量”的模型。"
        },
        {
          "kind": "工作中的用处",
          "text": "质量控制、测量噪声与随机建模。"
        }
      ],
      "lab": "probability",
      "prerequisites": [
        "random-variable"
      ],
      "source": "mit"
    },
    {
      "id": "normal",
      "stage": "大学基础与进阶",
      "group": "statistics",
      "title": "正态分布",
      "child": "钟形曲线中间高，表示那附近更常见；曲线的高度本身不是点的概率。",
      "formal": "正态密度由μ与σ>0确定；概率是区间下面的面积。",
      "steps": [
        "μ=0、σ=1",
        "密度以0为中心对称",
        "连续变量恰等于0的概率是0，不是曲线高度"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "理解测量误差的常用近似。"
        },
        {
          "kind": "工作中的用处",
          "text": "统计过程控制与噪声模型；需检验模型假设。"
        }
      ],
      "lab": "normal",
      "prerequisites": [
        "integral",
        "distributions"
      ],
      "source": "mit"
    },
    {
      "id": "bayes",
      "stage": "大学基础与进阶",
      "group": "statistics",
      "title": "贝叶斯：更新判断",
      "child": "故障灯亮了，不一定机器坏了；还要看故障原来有多常见、灯会不会误报。",
      "formal": "P(A∣B)=P(B∣A)P(A)/P(B)，要求P(B)>0。",
      "steps": [
        "1000台中假设10台故障",
        "90%能报警得到9个真警报，990台中1%误报约9.9个",
        "报警后故障概率9/(9+9.9)≈47.6%"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "读懂检测、分类与证据，不忽视基数。"
        },
        {
          "kind": "工作中的用处",
          "text": "故障诊断、垃圾邮件过滤与概率推断。"
        }
      ],
      "lab": "bayes",
      "prerequisites": [
        "conditional"
      ],
      "source": "mit"
    },
    {
      "id": "lln-clt",
      "stage": "大学基础与进阶",
      "group": "statistics",
      "title": "大数定律与中心极限定理",
      "child": "抛得更多，平均常常更稳定；但它们讲的不是“下一次一定补回来”。",
      "formal": "适当独立同分布与矩条件下，样本均值收敛；标准化误差分布可趋近正态。",
      "steps": [
        "公平硬币期望0.5",
        "比较100次与10000次频率",
        "样本更多通常更稳定，但并非每一步都更接近"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "不被几次偶然结果左右。"
        },
        {
          "kind": "工作中的用处",
          "text": "抽样精度、蒙特卡洛估计与统计误差。"
        }
      ],
      "lab": "probability",
      "prerequisites": [
        "spread",
        "distributions"
      ],
      "source": "mit"
    },
    {
      "id": "estimation",
      "stage": "大学基础与进阶",
      "group": "statistics",
      "title": "估计与置信区间",
      "child": "只量一小部分，想猜整体；除了给一个数，还要说明可能差多少。",
      "formal": "置信区间的覆盖率属于重复抽样方法，不是已固定参数在某次区间内随机游走。",
      "steps": [
        "反复抽取同样大小的样本",
        "每次都按同一规则建区间",
        "95%覆盖率指长期约95%的区间覆盖真值"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "阅读带误差范围的调查。"
        },
        {
          "kind": "工作中的用处",
          "text": "A/B实验、市场调查和测量不确定度。"
        }
      ],
      "lab": "probability",
      "prerequisites": [
        "lln-clt"
      ],
      "source": "mit"
    },
    {
      "id": "hypothesis",
      "stage": "大学基础与进阶",
      "group": "statistics",
      "title": "假设检验",
      "child": "先假设硬币公平，看看现在的结果在这个假设下有多意外。",
      "formal": "p值是原假设下至少同样极端结果的概率，不是原假设为真的概率。",
      "steps": [
        "设H₀为硬币公平",
        "记录试验次数和结果",
        "先定规则，再判断结果是否足够不寻常"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "避免“看到结果再改标准”。"
        },
        {
          "kind": "工作中的用处",
          "text": "科学实验与产品A/B测试，需考虑功效和多重比较。"
        }
      ],
      "lab": "probability",
      "prerequisites": [
        "conditional",
        "estimation"
      ],
      "source": "mit"
    },
    {
      "id": "combinatorics",
      "stage": "大学基础与进阶",
      "group": "logic",
      "title": "容斥、抽屉与计数",
      "child": "把5只袜子放进4个盒子，至少一个盒子里会有2只。",
      "formal": "抽屉原理：n+1个对象分入n个盒子至少一盒≥2；容斥修正重复计数。",
      "steps": [
        "两个班有20和18人参加活动",
        "其中5人同时参加两项",
        "不同人数20+18−5=33"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "合并名单去重、判断必然重复。"
        },
        {
          "kind": "工作中的用处",
          "text": "哈希碰撞、组合分析和资源分配。"
        }
      ],
      "lab": "sets",
      "prerequisites": [
        "sets",
        "permutations"
      ],
      "source": "mit"
    },
    {
      "id": "graphs",
      "stage": "大学基础与进阶",
      "group": "logic",
      "title": "图论与最短路径",
      "child": "把地点变成点，把道路变成线；最少经过几条路不一定是距离最短。",
      "formal": "图由顶点与边组成；非负权图可用Dijkstra算法求单源最短路径。",
      "steps": [
        "A到B长2，B到D长3",
        "A到D直达长7",
        "经B总长5更短"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "规划地铁换乘与送货路线。"
        },
        {
          "kind": "工作中的用处",
          "text": "网络路由、任务依赖和社交关系分析。"
        }
      ],
      "lab": "graph",
      "prerequisites": [
        "sets"
      ],
      "source": "mit"
    },
    {
      "id": "binary",
      "stage": "大学基础与进阶",
      "group": "logic",
      "title": "二进制与信息编码",
      "child": "电脑用两种状态记数，就像一排只会亮或灭的小灯。",
      "formal": "二进制N=Σbₖ2ᵏ，bₖ∈{0,1}；编码需要约定含义。",
      "steps": [
        "13=8+4+1",
        "写成1101₂",
        "按位读就是1×8+1×4+0×2+1"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "理解开关与数字存储。"
        },
        {
          "kind": "工作中的用处",
          "text": "位运算、网络协议和计算机表示。"
        }
      ],
      "lab": "binary",
      "prerequisites": [
        "place-value",
        "powers"
      ],
      "source": "mit"
    },
    {
      "id": "modular",
      "stage": "大学基础与进阶",
      "group": "logic",
      "title": "模运算与数论",
      "child": "钟表走过12再回到0；模运算就是研究“绕一圈后的余数”。",
      "formal": "a≡b(mod m)表示m整除a−b，m为正整数。",
      "steps": [
        "17除以5余2",
        "所以17≡2(mod5)",
        "再加5，余数仍是2"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "轮班、钟表和周期安排。"
        },
        {
          "kind": "工作中的用处",
          "text": "循环缓冲区、校验码与密码学基础。"
        }
      ],
      "lab": "modulo",
      "prerequisites": [
        "remainder"
      ],
      "source": "mit"
    },
    {
      "id": "algorithms",
      "stage": "大学基础与进阶",
      "group": "logic",
      "title": "算法复杂度与递推",
      "child": "每次查一半，比从头到尾一个个找，差别会越来越大。",
      "formal": "复杂度描述资源随输入规模的增长，不等于具体设备上的实际秒数。",
      "steps": [
        "有序表1023个数",
        "每次比较中间项并排除一半",
        "最多10次比较，而线性查找可能看1023项"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "高效查字典。"
        },
        {
          "kind": "工作中的用处",
          "text": "数据库索引、搜索与程序性能分析。"
        }
      ],
      "lab": "exponential",
      "prerequisites": [
        "logarithms"
      ],
      "source": "mit"
    },
    {
      "id": "numerical",
      "stage": "大学基础与进阶",
      "group": "advanced",
      "title": "数值分析与误差",
      "child": "计算机给了很多小数位，不代表答案真的那么准确。",
      "formal": "区分截断误差、舍入误差与输入误差；收敛性和稳定性需分别检查。",
      "steps": [
        "用矩形求曲线面积有截断误差",
        "增加小格通常减小这种误差",
        "但浮点舍入和错误模型不能靠加格全部解决"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "判断测量与计算的可信精度。"
        },
        {
          "kind": "工作中的用处",
          "text": "仿真、科学计算与工程求解器。"
        }
      ],
      "lab": "integral",
      "prerequisites": [
        "limits",
        "integral"
      ],
      "source": "mit"
    },
    {
      "id": "gradient",
      "stage": "大学基础与进阶",
      "group": "advanced",
      "title": "梯度下降",
      "child": "站在碗形地面上，朝最下坡的方向迈一小步，再重新判断方向。",
      "formal": "迭代xₖ₊₁=xₖ−η∇f(xₖ)；步长过大可能发散，非凸问题未必到全局最优。",
      "steps": [
        "f(x,y)=x²+2y²，起点(2,1)",
        "梯度(4,4)，步长0.1",
        "下一点(1.6,0.6)，函数值下降"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "理解不断试调参数的规律。"
        },
        {
          "kind": "工作中的用处",
          "text": "机器学习训练与数值最优化。"
        }
      ],
      "lab": "gradient",
      "prerequisites": [
        "partial",
        "optimization"
      ],
      "source": "mit"
    },
    {
      "id": "fourier",
      "stage": "大学基础与进阶",
      "group": "advanced",
      "title": "傅里叶：把波拆开",
      "child": "一个复杂声音，可以看成很多简单的正弦波叠在一起。",
      "formal": "周期函数可在适当条件下用傅里叶级数表示；跳跃附近有限和会出现振荡。",
      "steps": [
        "用sinx近似方波",
        "再加sin3x/3、sin5x/5",
        "形状更接近，但边缘仍有过冲"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "理解音色为什么不同。"
        },
        {
          "kind": "工作中的用处",
          "text": "音频处理、图像压缩与频谱分析。"
        }
      ],
      "lab": "fourier",
      "prerequisites": [
        "series",
        "trig-functions"
      ],
      "source": "mit"
    },
    {
      "id": "real-analysis",
      "stage": "大学基础与进阶",
      "group": "advanced",
      "title": "实分析：把“靠近”说严谨",
      "child": "“很近”到底多近？数学让你先指定要求，再保证能做到。",
      "formal": "ε–δ定义把极限表述为可量化的逻辑条件，强调任意精度要求。",
      "steps": [
        "证明lim[x→2]3x=6",
        "给定ε>0，取δ=ε/3",
        "若0<abs(x−2)<δ，则abs(3x−6)<ε"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "区分直观相信与严格保证。"
        },
        {
          "kind": "工作中的用处",
          "text": "数值算法误差证明与分析学基础。"
        }
      ],
      "lab": null,
      "prerequisites": [
        "logic",
        "limits"
      ],
      "source": "mit"
    },
    {
      "id": "abstract-algebra",
      "stage": "大学基础与进阶",
      "group": "advanced",
      "title": "抽象代数：运算的结构",
      "child": "钟表加法、旋转和普通整数看似不同，却可能遵守相似规则。",
      "formal": "群由集合与满足封闭、结合、单位元、逆元的运算构成；不要求交换。",
      "steps": [
        "模4的0、1、2、3按加法运算",
        "0是单位元，1的逆元是3",
        "1+3≡0(mod4)"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "把旋转与周期的规律统一起来。"
        },
        {
          "kind": "工作中的用处",
          "text": "对称性、编码与密码学中的代数结构。"
        }
      ],
      "lab": "modulo",
      "prerequisites": [
        "sets",
        "modular"
      ],
      "source": "mit"
    },
    {
      "id": "topology",
      "stage": "大学基础与进阶",
      "group": "advanced",
      "title": "拓扑：形状怎样连着",
      "child": "橡皮圈拉长变扁，只要不剪断、不粘连，仍然是一圈。",
      "formal": "拓扑研究在连续变形或同胚下保持的性质；几何长度通常不是拓扑不变量。",
      "steps": [
        "圆周与椭圆周可连续一一对应",
        "它们都只有一个连通部分",
        "线段却有两个端点，不能当作同一种结构"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "看地图线路的连接而非实际比例。"
        },
        {
          "kind": "工作中的用处",
          "text": "拓扑数据分析、网络连通与几何建模。"
        }
      ],
      "lab": null,
      "prerequisites": [
        "sets",
        "continuity"
      ],
      "source": "mit"
    },
    {
      "id": "modeling",
      "stage": "大学基础与进阶",
      "group": "advanced",
      "title": "数学建模：从问题到检验",
      "child": "先把问题说清，选需要的量，再用真实观察检查模型，不要让漂亮公式骗了你。",
      "formal": "建模包括假设、变量、关系、求解、验证与修正；简化模型有适用范围。",
      "steps": [
        "先假设骑车速度恒定",
        "用路程=速度×时间算预测",
        "遇到红灯后对比偏差，修正假设"
      ],
      "applications": [
        {
          "kind": "身边的用处",
          "text": "把现实问题变成能讨论、能验证的问题。"
        },
        {
          "kind": "工作中的用处",
          "text": "工程设计、运营分析与跨学科研究。"
        }
      ],
      "lab": "linear",
      "prerequisites": [
        "linear-function"
      ],
      "source": "mit"
    }
  ],
  "sources": {
    "moe": [
      "教育部 · 义务教育课程方案与标准（2022年版）",
      "https://www.moe.gov.cn/jyb_xwfb/gzdt_gzdt/s5987/202204/t20220421_620068.html"
    ],
    "high": [
      "教育部 · 普通高中课程标准（2017年版2020年修订）",
      "https://www.moe.gov.cn/srcsite/A26/s8001/202006/t20200603_462199.html"
    ],
    "calculus": [
      "OpenStax · Calculus 三卷课程结构（仅参考结构，不复制正文）",
      "https://openstax.org/books/calculus-volume-1/pages/preface"
    ],
    "linear": [
      "MIT · 18.06 线性代数课程",
      "https://web.mit.edu/18.06/"
    ],
    "mit": [
      "MIT OpenCourseWare · 数学课程目录",
      "https://ocw.mit.edu/search/?d=Mathematics"
    ]
  }
};root.MathAtlas=data;if(typeof module!=="undefined")module.exports=data;})(typeof globalThis!=="undefined"?globalThis:this);
