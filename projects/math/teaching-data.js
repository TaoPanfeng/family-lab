/* Original, individually reviewed alternate worked examples. */
(function(r){const d={
  "counting": {
    "formula": "N=5",
    "alternate": {
      "title": "停车位与小车",
      "setup": "4个车位，每个停1辆；还有1辆没位置。先把车和车位配成对。",
      "steps": [
        "4个车位，每个停1辆；还有1辆没位置。先把车和车位配成对。",
        "\\(5-4=1\\)",
        "没有空位不等于小车消失：总数仍是5，缺1个车位。"
      ]
    },
    "pitfall": "换排列不会改变数量；一辆车不能重复数两次。"
  },
  "place-value": {
    "formula": "237=2\\times100+3\\times10+7",
    "alternate": {
      "title": "拆开一捆再数",
      "setup": "把1捆10根小棒拆开，原来2捆3根，现在变成1捆13根。",
      "steps": [
        "把1捆10根小棒拆开，原来2捆3根，现在变成1捆13根。",
        "\\(2\\times10+3=1\\times10+13=23\\)",
        "写23时十位的2表示20；换包装不改变总数。"
      ]
    },
    "pitfall": "数位的权值不能漏掉。"
  },
  "addition": {
    "formula": "7+5=7+(3+2)=10+2=12",
    "alternate": {
      "title": "两段路合起来",
      "setup": "从家走6格到公园，再走4格到书店；两段方向相同。",
      "steps": [
        "从家走6格到公园，再走4格到书店；两段方向相同。",
        "\\(6+4=10\\)",
        "数轴上从6向右4格到10；物体合并与同向路程都能解释加法。"
      ]
    },
    "pitfall": "合并物品时不能把同一件算两遍。"
  },
  "subtraction": {
    "formula": "12-5=7,\\quad7+5=12",
    "alternate": {
      "title": "比较谁多，不拿走也能减",
      "setup": "小青有12张卡，小明有7张；先把7张一一配对。",
      "steps": [
        "小青有12张卡，小明有7张；先把7张一一配对。",
        "\\(12-7=5\\)",
        "没配上的5张就是相差的数量；减法不只有拿走一种意思。"
      ]
    },
    "pitfall": "问剩余还是问相差，先把对象说清楚。"
  },
  "commutative": {
    "formula": "a+b=b+a,\\qquad ab=ba",
    "alternate": {
      "title": "交换减法试试看",
      "setup": "8元花掉3元剩5元；把次序倒过来会得到另一个结果。",
      "steps": [
        "8元花掉3元剩5元；把次序倒过来会得到另一个结果。",
        "\\(8-3=5\\ne3-8=-5\\)",
        "点阵可以转置说明乘法交换；减法和除法不能照搬。"
      ]
    },
    "pitfall": "交换律不适用于所有运算。"
  },
  "multiplication": {
    "formula": "3\\times4=4+4+4=12",
    "alternate": {
      "title": "铺地砖",
      "setup": "一行5块方砖，铺2行；每行都一样多。",
      "steps": [
        "一行5块方砖，铺2行；每行都一样多。",
        "\\(2\\times5=5+5=10\\)",
        "横着数和竖着数得到同一批10块；把数量变成矩形点阵。"
      ]
    },
    "pitfall": "每组数量不相等时，不能直接用组数乘某一组数量。"
  },
  "division": {
    "formula": "12\\div3=4",
    "alternate": {
      "title": "每盒装几颗，与能装几盒",
      "setup": "12颗糖，每盒装4颗：不是分给4个人，而是数能装几盒。",
      "steps": [
        "12颗糖，每盒装4颗：不是分给4个人，而是数能装几盒。",
        "\\(12\\div4=3,\\qquad3\\times4=12\\)",
        "一种除法求每份，另一种求份数；都用乘法验算。"
      ]
    },
    "pitfall": "除数不能为0；公平分配要说明是否允许切分。"
  },
  "shapes": {
    "formula": "\\text{正方形}\\subset\\text{矩形}",
    "alternate": {
      "title": "转一转还是正方形吗",
      "setup": "把正方形纸转45度。角依然是直角，四边依然等长。",
      "steps": [
        "把正方形纸转45度。角依然是直角，四边依然等长。",
        "\\(4\\text{ 个直角}+4\\text{ 条等边}\\Rightarrow\\text{正方形}\\)",
        "朝向不决定图形种类；不要把斜放的正方形叫成另一类。"
      ]
    },
    "pitfall": "凭外观像不像不如核查边和角。"
  },
  "length": {
    "formula": "1\\,\\mathrm m=100\\,\\mathrm{cm}",
    "alternate": {
      "title": "书架能放下吗",
      "setup": "墙面宽90厘米，书架宽0.85米；先统一成厘米。",
      "steps": [
        "墙面宽90厘米，书架宽0.85米；先统一成厘米。",
        "\\(0.85\\times100=85,\\qquad90-85=5\\)",
        "还余5厘米；不能直接拿90和0.85比较。"
      ]
    },
    "pitfall": "显示屏上的尺子不是实际尺寸的量尺。"
  },
  "clock": {
    "formula": "1\\,\\mathrm h=60\\,\\mathrm{min}",
    "alternate": {
      "title": "跨过整点",
      "setup": "10点50分开始阅读，25分钟后结束；先走10分钟到11点。",
      "steps": [
        "10点50分开始阅读，25分钟后结束；先走10分钟到11点。",
        "\\(25=10+15,\\qquad10{:}50+25\\mathrm{min}=11{:}15\\)",
        "再走15分钟就是11点15分，不是10点75分。"
      ]
    },
    "pitfall": "时间按60进位，不是按100进位。"
  },
  "money": {
    "formula": "2.50+1.20=3.70",
    "alternate": {
      "title": "找零",
      "setup": "带5元，买3元6角的铅笔。先换成最小单位分。",
      "steps": [
        "带5元，买3元6角的铅笔。先换成最小单位分。",
        "\\(500-360=140\\text{ 分}=1.40\\text{ 元}\\)",
        "用整数分验算，比不受约束的计算机小数更可靠。"
      ]
    },
    "pitfall": "同一数额的不同小数位写法不改变价值。"
  },
  "direction": {
    "formula": "(3,2)\\ne(2,3)",
    "alternate": {
      "title": "藏宝格子",
      "setup": "以左下格为起点，向右2格、向上3格；先说横向再说纵向。",
      "steps": [
        "以左下格为起点，向右2格、向上3格；先说横向再说纵向。",
        "\\((0,0)\\to(2,0)\\to(2,3)\\)",
        "若先向右3再向上2，会找到别的格子。"
      ]
    },
    "pitfall": "坐标有顺序，也需要起点和方向。"
  },
  "data-count": {
    "formula": "4+3+2=9",
    "alternate": {
      "title": "图书分类",
      "setup": "6本书中3本故事、2本科普、1本诗歌；按主要类别只归一次。",
      "steps": [
        "6本书中3本故事、2本科普、1本诗歌；按主要类别只归一次。",
        "\\(3+2+1=6\\)",
        "把统计表各格加起来应与实物总数相同；分类规则要一致。"
      ]
    },
    "pitfall": "允许多选的调查不能把类别频数直接当总人数。"
  },
  "patterns": {
    "formula": "a_n=2n",
    "alternate": {
      "title": "相同开头可以有不同以后",
      "setup": "前3项都是2、4、6；比较下面两条明确的规则。",
      "steps": [
        "前3项都是2、4、6；比较下面两条明确的规则。",
        "\\(a_n=2n,\\quad b_n=2n+(n-1)(n-2)(n-3)\\)",
        "第4项分别是8和14。看到几个数不足以唯一确定规则。"
      ]
    },
    "pitfall": "写出生成规则，不把猜想冒充唯一答案。"
  },
  "sorting": {
    "formula": "2<3<5",
    "alternate": {
      "title": "同高时怎么排",
      "setup": "小林和小青同高，先按身高排序，再按名字排序。",
      "steps": [
        "小林和小青同高，先按身高排序，再按名字排序。",
        "\\(\\text{先身高}\\to\\text{相同再比较名字}\\)",
        "增加第二条规则才能决定并列项的先后。"
      ]
    },
    "pitfall": "不要在同一次排序中改变比较规则。"
  },
  "remainder": {
    "formula": "17=5\\times3+2",
    "alternate": {
      "title": "坐车要几辆",
      "setup": "17人，每辆车最多5人；3辆坐15人，还剩2人。",
      "steps": [
        "17人，每辆车最多5人；3辆坐15人，还剩2人。",
        "\\(17=5\\times3+2,\\qquad\\lceil17/5\\rceil=4\\)",
        "余下2人仍需1辆车，所以不是只准备3辆。"
      ]
    },
    "pitfall": "求商和求需要的容器数量不是同一道问题。"
  },
  "factors": {
    "formula": "12=1\\times12=2\\times6=3\\times4",
    "alternate": {
      "title": "摆座位",
      "setup": "18张椅子要排成同样长的整行；试3张一行和4张一行。",
      "steps": [
        "18张椅子要排成同样长的整行；试3张一行和4张一行。",
        "\\(18\\div3=6,\\qquad18=4\\times4+2\\)",
        "3是18的因数，4不是；因数对应无剩余的矩形排法。"
      ]
    },
    "pitfall": "讨论正因数时不把0当除数。"
  },
  "primes": {
    "formula": "7=1\\times7,\\qquad8=2\\times4",
    "alternate": {
      "title": "9能只排一行吗",
      "setup": "9还可以摆成3行3列；2只能摆1行2列或转置。",
      "steps": [
        "9还可以摆成3行3列；2只能摆1行2列或转置。",
        "\\(9=3\\times3,\\qquad2=1\\times2\\)",
        "9是合数，2是质数，而且是唯一的偶质数。"
      ]
    },
    "pitfall": "质数不是所有奇数；1既非质数也非合数。"
  },
  "gcd-lcm": {
    "formula": "\\gcd(12,18)=6,\\quad\\operatorname{lcm}(12,18)=36",
    "alternate": {
      "title": "两盏周期灯",
      "setup": "一盏每4秒闪，一盏每6秒闪；0秒同时亮，找下一次同时亮。",
      "steps": [
        "一盏每4秒闪，一盏每6秒闪；0秒同时亮，找下一次同时亮。",
        "\\(4,8,12;\\qquad6,12;\\qquad\\operatorname{lcm}(4,6)=12\\)",
        "12秒再相遇；平均分组求最大公因数，找共同周期求最小公倍数。"
      ]
    },
    "pitfall": "问题不同，不能见两个数就只算最大公因数。"
  },
  "fractions": {
    "formula": "\\frac38",
    "alternate": {
      "title": "一半到底有多少",
      "setup": "小饼和大饼都拿一半。先规定同一个整体，再比较。",
      "steps": [
        "小饼和大饼都拿一半。先规定同一个整体，再比较。",
        "\\(\\frac12\\times8=4,\\qquad\\frac12\\times12=6\\)",
        "相同比例不保证绝对数量相同；整体不一样。"
      ]
    },
    "pitfall": "分数必须说明把哪个整体平均分。"
  },
  "equivalent": {
    "formula": "\\frac12=\\frac24=\\frac48",
    "alternate": {
      "title": "两种切法比大小",
      "setup": "同一条巧克力，甲拿三分之一，乙拿六分之二。",
      "steps": [
        "同一条巧克力，甲拿三分之一，乙拿六分之二。",
        "\\(\\frac13=\\frac{1\\times2}{3\\times2}=\\frac26\\)",
        "把每一份再等分，两人拿的一样多。"
      ]
    },
    "pitfall": "分子分母须同乘同除非零数，不能只改一个。"
  },
  "fraction-ops": {
    "formula": "\\frac ab+\\frac cd=\\frac{ad+bc}{bd}",
    "alternate": {
      "title": "半杯里有几个四分之一杯",
      "setup": "量杯里有半杯水，每次倒四分之一杯，能倒几次？",
      "steps": [
        "量杯里有半杯水，每次倒四分之一杯，能倒几次？",
        "\\(\\frac12\\div\\frac14=\\frac12\\times4=2\\)",
        "先把半杯画成2个四分之一杯，再理解除以分数。"
      ]
    },
    "pitfall": "加法不能把分母直接相加；除法的除数非零。"
  },
  "decimals": {
    "formula": "0.25=\\frac{25}{100}=\\frac14",
    "alternate": {
      "title": "钱为什么能精确相加",
      "setup": "1角加2角是3角；写成元和写成分是同一回事。",
      "steps": [
        "1角加2角是3角；写成元和写成分是同一回事。",
        "\\(0.1+0.2=0.3,\\qquad10+20=30\\text{ 分}\\)",
        "数学的等式精确；某些程序显示长尾小数来自二进制浮点表示，不是数学加错。"
      ]
    },
    "pitfall": "数字位数多不等于测量更准确。"
  },
  "percent": {
    "formula": "80\\times75\\%=60",
    "alternate": {
      "title": "先涨后降回原价吗",
      "setup": "100元先涨10%，再在新价格上降10%。",
      "steps": [
        "100元先涨10%，再在新价格上降10%。",
        "\\(100\\times1.1\\times0.9=99\\)",
        "最后99元，因为两次百分比的基数不同。"
      ]
    },
    "pitfall": "上涨10%和下降10%不能直接抵消。"
  },
  "ratio": {
    "formula": "y=kx",
    "alternate": {
      "title": "食谱跟着人数变",
      "setup": "2个人用100克米，假设每人同量，6个人需要多少？",
      "steps": [
        "2个人用100克米，假设每人同量，6个人需要多少？",
        "\\(100\\div2=50,\\qquad50\\times6=300\\)",
        "先求每人50克，再乘人数；图上是过原点的直线。"
      ]
    },
    "pitfall": "配方比例要连同单位与假设说明。"
  },
  "inverse-ratio": {
    "formula": "xy=k,\\quad x\\ne0",
    "alternate": {
      "title": "固定任务量",
      "setup": "12个相同任务，每台机器每分钟做1个，2台与3台分别需多久？",
      "steps": [
        "12个相同任务，每台机器每分钟做1个，2台与3台分别需多久？",
        "\\(2\\times6=3\\times4=12\\)",
        "理想无协作开销时，时间分别6与4分钟。"
      ]
    },
    "pitfall": "真实并行计算存在通信成本，不保证机器翻倍时间减半。"
  },
  "perimeter": {
    "formula": "P=2(l+w)",
    "alternate": {
      "title": "面积一样，围栏一样吗",
      "setup": "比较长4宽4和长8宽2两个矩形。",
      "steps": [
        "比较长4宽4和长8宽2两个矩形。",
        "\\(4\\times4=8\\times2=16,\\quad P_1=16,\\quad P_2=20\\)",
        "面积同为16，周长却不相同。"
      ]
    },
    "pitfall": "长度单位和面积单位不能混写。"
  },
  "area": {
    "formula": "A=lw",
    "alternate": {
      "title": "放大照片",
      "setup": "长3宽2的图，每个方向都放大2倍。",
      "steps": [
        "长3宽2的图，每个方向都放大2倍。",
        "\\(A_1=3\\times2=6,\\quad A_2=6\\times4=24\\)",
        "面积变4倍，不是2倍；用方格逐行数就能看出。"
      ]
    },
    "pitfall": "放大倍数说的是长度还是面积要区分。"
  },
  "triangle-area": {
    "formula": "A=\\frac12bh",
    "alternate": {
      "title": "移动三角形顶点",
      "setup": "底边始终6，高始终4，让顶点向左右移动。",
      "steps": [
        "底边始终6，高始终4，让顶点向左右移动。",
        "\\(A=\\frac{6\\times4}{2}=12\\)",
        "只要垂直高不变，三角形面积仍为12。"
      ]
    },
    "pitfall": "斜边长度不是对应底边的高。"
  },
  "circle": {
    "formula": "C=2\\pi r,\\qquad A=\\pi r^2",
    "alternate": {
      "title": "车轮与圆桌",
      "setup": "半径从1变成2，分别比较一周路程和桌面大小。",
      "steps": [
        "半径从1变成2，分别比较一周路程和桌面大小。",
        "\\(\\frac{C_2}{C_1}=2,\\qquad\\frac{A_2}{A_1}=4\\)",
        "绕边是一维长度，铺面是二维面积。"
      ]
    },
    "pitfall": "圆周长与圆面积恰好数字相同也不能混用单位。"
  },
  "volume": {
    "formula": "V=lwh,\\quad S=2(lw+lh+wh)",
    "alternate": {
      "title": "盒子放大",
      "setup": "一个边长2的正方体换成边长4。",
      "steps": [
        "一个边长2的正方体换成边长4。",
        "\\(V_1=8,\\ V_2=64;\\qquad S_1=24,\\ S_2=96\\)",
        "边长2倍，体积8倍，表面积4倍；包装和容量分开算。"
      ]
    },
    "pitfall": "透视图只是观察辅助，不拿屏幕面积算容积。"
  },
  "symmetry": {
    "formula": " (x,y)\\mapsto(-x,y)",
    "alternate": {
      "title": "镜子里的位置",
      "setup": "在网格中把点(3,2)沿纵轴翻到另一边。",
      "steps": [
        "在网格中把点(3,2)沿纵轴翻到另一边。",
        "\\((3,2)\\mapsto(-3,2),\\qquad3+3=6\\)",
        "两点到镜面都为3格；方向改变，距离保持。"
      ]
    },
    "pitfall": "平移不是镜像，旋转也不是缩放。"
  },
  "mean": {
    "formula": "\\bar x=\\frac1n\\sum_{i=1}^{n}x_i",
    "alternate": {
      "title": "典型收入不能只看均值",
      "setup": "3个人的数字为3、3、30。先求和再平均，再找排中间的数。",
      "steps": [
        "3个人的数字为3、3、30。先求和再平均，再找排中间的数。",
        "\\(\\bar x=\\frac{3+3+30}{3}=12,\\qquad\\operatorname{median}=3\\)",
        "均值12被30拉高；“平均”不等于多数人的数值。"
      ]
    },
    "pitfall": "偶数个数据的中位数要取中间两数平均。"
  },
  "order-operations": {
    "formula": "3+2\\times4=11,\\quad(3+2)\\times4=20",
    "alternate": {
      "title": "一张券与几杯饮料",
      "setup": "3元门票加2杯每杯4元的饮料；不是3杯和2杯混成5杯。",
      "steps": [
        "3元门票加2杯每杯4元的饮料；不是3杯和2杯混成5杯。",
        "\\(3+(2\\times4)=11\\)",
        "括号表示先处理的数量关系；改括号也会改变故事。"
      ]
    },
    "pitfall": "乘除同级从左到右，不是所有乘法都先于除法。"
  },
  "simple-equations": {
    "formula": "x+3=8\\Rightarrow x=5",
    "alternate": {
      "title": "倒推花掉的钱",
      "setup": "口袋原来有一些钱，花掉4元后剩9元。",
      "steps": [
        "口袋原来有一些钱，花掉4元后剩9元。",
        "\\(x-4=9,\\qquad x=9+4=13\\)",
        "把13代回去，13减4确实是9。"
      ]
    },
    "pitfall": "移项不是魔法，而是等式两边做相同操作。"
  },
  "integers": {
    "formula": "2-5=-3",
    "alternate": {
      "title": "温度变化",
      "setup": "从零下2度升高5度，沿数轴向右走。",
      "steps": [
        "从零下2度升高5度，沿数轴向右走。",
        "\\(-2+5=3\\)",
        "走过0后到3度；起点和变化方向都要看。"
      ]
    },
    "pitfall": "负数不是“没有”，它需要一个参考零点。"
  },
  "absolute": {
    "formula": "|x|=\\begin{cases}x&x\\ge0\\\\-x&x<0\\end{cases}",
    "alternate": {
      "title": "两家相隔多远",
      "setup": "把家放在数轴的-4与3位置；数从-4到0再到3。",
      "steps": [
        "把家放在数轴的-4与3位置；数从-4到0再到3。",
        "\\(|3-(-4)|=4+3=7\\)",
        "距离非负；顺序反过来仍是7。"
      ]
    },
    "pitfall": "有符号变化量和距离不是一回事。"
  },
  "real-numbers": {
    "formula": "\\sqrt2\\notin\\mathbb Q",
    "alternate": {
      "title": "正方形的边长",
      "setup": "面积为9的方形边长3；面积为2的边长只能用根号准确写。",
      "steps": [
        "面积为9的方形边长3；面积为2的边长只能用根号准确写。",
        "\\(3^2=9,\\qquad(\\sqrt2)^2=2\\)",
        "1.414只是近似；根号是精确数，不是没算完。"
      ]
    },
    "pitfall": "平方根符号通常指非负主值，解平方方程可能有两根。"
  },
  "powers": {
    "formula": "a^m a^n=a^{m+n}",
    "alternate": {
      "title": "容量的连续翻倍",
      "setup": "从1格开始，每轮翻倍，4轮后有多少格？",
      "steps": [
        "从1格开始，每轮翻倍，4轮后有多少格？",
        "\\(2^4=2\\times2\\times2\\times2=16\\)",
        "乘方是重复相乘，不是底数乘次数。"
      ]
    },
    "pitfall": "幂的运算法则有适用条件，零次幂不能随意代入零底数。"
  },
  "polynomials": {
    "formula": "3x+2x=5x",
    "alternate": {
      "title": "水果账本",
      "setup": "3盒苹果再来2盒苹果，可以合成5盒；梨盒要另记。",
      "steps": [
        "3盒苹果再来2盒苹果，可以合成5盒；梨盒要另记。",
        "\\(3x+2x+4y=5x+4y\\)",
        "同类项按同一种“单位”合并；字母不同不能硬加。"
      ]
    },
    "pitfall": "相同字母的次数不同也不是同类项。"
  },
  "identities": {
    "formula": "(a+b)^2=a^2+2ab+b^2",
    "alternate": {
      "title": "心算平方",
      "setup": "边长21的正方形拆成长20和1的条块。",
      "steps": [
        "边长21的正方形拆成长20和1的条块。",
        "\\(21^2=20^2+2\\times20\\times1+1^2=441\\)",
        "两条长方形边条各20，漏一条就算错。"
      ]
    },
    "pitfall": "面积拼图先用于正长度，实数一般式由分配律证明。"
  },
  "rational-expressions": {
    "formula": "\\frac{x^2-1}{x-1}=x+1\\quad(x\\ne1)",
    "alternate": {
      "title": "化简没有补上缺口",
      "setup": "原式在x=1没有意义。化简之后也不能偷偷允许这个点。",
      "steps": [
        "原式在x=1没有意义。化简之后也不能偷偷允许这个点。",
        "\\(\\frac{2^2-1}{2-1}=3,\\qquad x=1\\text{ 仍排除}\\)",
        "曲线在该位置留空心点；定义域是原问题的一部分。"
      ]
    },
    "pitfall": "约分约的是因式，不是随意删去加号两边的项。"
  },
  "linear-equation": {
    "formula": "ax+b=c\\Rightarrow x=\\frac{c-b}{a}\\ (a\\ne0)",
    "alternate": {
      "title": "出租车的简化收费",
      "setup": "起步3元，之后每千米2元，共11元；设计费路程为x。",
      "steps": [
        "起步3元，之后每千米2元，共11元；设计费路程为x。",
        "\\(2x+3=11\\Rightarrow2x=8\\Rightarrow x=4\\)",
        "代回11元；真实收费要看分段与起步里程，不能用本简式替代。"
      ]
    },
    "pitfall": "a=0时需要另判无解或无穷多解。"
  },
  "systems": {
    "formula": "\\begin{cases}x+y=7\\\\x-y=1\\end{cases}\\Rightarrow(x,y)=(4,3)",
    "alternate": {
      "title": "两张购物清单",
      "setup": "一支笔一块橡皮共5元，两支笔一块橡皮共8元。",
      "steps": [
        "一支笔一块橡皮共5元，两支笔一块橡皮共8元。",
        "\\(\\begin{cases}p+e=5\\\\2p+e=8\\end{cases}\\Rightarrow p=3,\\ e=2\\)",
        "第二张减第一张，只剩一支笔；两条独立线索一起解。"
      ]
    },
    "pitfall": "两次买完全同样的比例不能提供独立信息。"
  },
  "inequalities": {
    "formula": "5x\\le20\\Rightarrow x\\le4",
    "alternate": {
      "title": "温差取负号",
      "setup": "想让某个数乘-2后不小于6，先在数轴试负数。",
      "steps": [
        "想让某个数乘-2后不小于6，先在数轴试负数。",
        "\\(-2x\\ge6\\Rightarrow x\\le-3\\)",
        "乘除负数把数轴方向翻转，所以不等号要翻。"
      ]
    },
    "pitfall": "只加减数不翻不等号。"
  },
  "coordinates": {
    "formula": "A=(2,3)",
    "alternate": {
      "title": "屏幕坐标要说明方向",
      "setup": "数学坐标常向上为正；屏幕坐标常向下为正。",
      "steps": [
        "数学坐标常向上为正；屏幕坐标常向下为正。",
        "\\((2,3)\\ne(3,2)\\)",
        "同一对数字要配合原点、尺度、方向才能找到位置。"
      ]
    },
    "pitfall": "坐标数字并不自带真实距离单位。"
  },
  "linear-function": {
    "formula": "y=kx+b",
    "alternate": {
      "title": "比较两种方案",
      "setup": "甲每月5元加每次2元；乙无月费每次3元。",
      "steps": [
        "甲每月5元加每次2元；乙无月费每次3元。",
        "\\(5+2x=3x\\Rightarrow x=5\\)",
        "5次打平；少于5次乙省，多于5次甲省。"
      ]
    },
    "pitfall": "交点以外还要比较哪条线在上方。"
  },
  "inverse-function": {
    "formula": "y=\\frac{k}{x},\\quad x\\ne0",
    "alternate": {
      "title": "每人分几块",
      "setup": "12块饼平均分给2人或3人。",
      "steps": [
        "12块饼平均分给2人或3人。",
        "\\(y(2)=6,\\quad y(3)=4,\\quad xy=12\\)",
        "多一个人时减少的份量不固定，所以图像不是直线。"
      ]
    },
    "pitfall": "实际人数是正整数，完整数学曲线定义域更广。"
  },
  "quadratic": {
    "formula": "x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}",
    "alternate": {
      "title": "围成一个花坛",
      "setup": "面积6，一边比另一边长1；设短边x。",
      "steps": [
        "面积6，一边比另一边长1；设短边x。",
        "\\(x(x+1)=6\\Rightarrow(x-2)(x+3)=0\\)",
        "数学根2和-3；长度为正，只保留2，另一边3。"
      ]
    },
    "pitfall": "代数解还要接受生活条件的检查。"
  },
  "angles": {
    "formula": "\\alpha+\\beta=180^\\circ",
    "alternate": {
      "title": "交叉路口",
      "setup": "两直线相交，一个角65度；找旁边和对面的角。",
      "steps": [
        "两直线相交，一个角65度；找旁边和对面的角。",
        "\\(\\beta=180^\\circ-65^\\circ=115^\\circ\\)",
        "旁边115度，对面65度；先分清邻角与对顶角。"
      ]
    },
    "pitfall": "同位角相等需要平行条件。"
  },
  "triangle-sum": {
    "formula": "A+B+C=180^\\circ",
    "alternate": {
      "title": "三角支架",
      "setup": "支架两角分别45度和65度。",
      "steps": [
        "支架两角分别45度和65度。",
        "\\(C=180^\\circ-45^\\circ-65^\\circ=70^\\circ\\)",
        "通过平行线把另外两角搬到顶点，三角拼成平角。"
      ]
    },
    "pitfall": "结论在欧氏平面成立，不照搬到球面。"
  },
  "congruence": {
    "formula": "\\frac{a'}a=\\frac{b'}b=\\frac{c'}c=k",
    "alternate": {
      "title": "等比例照片",
      "setup": "照片原长4宽3，长度变8，宽度应是多少？",
      "steps": [
        "照片原长4宽3，长度变8，宽度应是多少？",
        "\\(k=8/4=2,\\qquad3k=6\\)",
        "宽也变2倍才不变形；面积比例为4。"
      ]
    },
    "pitfall": "只有一对边比例相同不足以判定所有图形相似。"
  },
  "pythagoras": {
    "formula": "a^2+b^2=c^2",
    "alternate": {
      "title": "矩形屏幕对角线",
      "setup": "长12、宽5的矩形，画出对角线形成直角三角形。",
      "steps": [
        "长12、宽5的矩形，画出对角线形成直角三角形。",
        "\\(c=\\sqrt{12^2+5^2}=\\sqrt{169}=13\\)",
        "先平方相加，再开平方；不是把两边长度直接相加。"
      ]
    },
    "pitfall": "非直角三角形要换用更一般的关系。"
  },
  "circle-angle": {
    "formula": "\\angle ACB=\\frac12\\angle AOB",
    "alternate": {
      "title": "直径作底",
      "setup": "A、B为直径两端，C在圆周其他位置，观察同一半圆弧。",
      "steps": [
        "A、B为直径两端，C在圆周其他位置，观察同一半圆弧。",
        "\\(\\angle AOB=180^\\circ\\Rightarrow\\angle ACB=90^\\circ\\)",
        "半圆所对的圆周角是直角；可用等腰三角形角关系推得。"
      ]
    },
    "pitfall": "要明确同一条弧以及顶点位置。"
  },
  "right-trig": {
    "formula": "\\sin\\theta=\\frac{\\text{对边}}{\\text{斜边}}",
    "alternate": {
      "title": "影子量高度",
      "setup": "太阳角度45度，树的影子长6米，地面水平。",
      "steps": [
        "太阳角度45度，树的影子长6米，地面水平。",
        "\\(\\tan45^\\circ=\\frac h6=1\\Rightarrow h=6\\,\\mathrm m\\)",
        "用同角相似直角三角形，把角度连接到边长比例。"
      ]
    },
    "pitfall": "不能忽略地面坡度和影子起点。"
  },
  "probability": {
    "formula": "f_n=\\frac{N_{\\text{成功}}}{n}",
    "alternate": {
      "title": "连续两次正面之后",
      "setup": "公平独立硬币已出两次正面；第三次的概率仍是什么？",
      "steps": [
        "公平独立硬币已出两次正面；第三次的概率仍是什么？",
        "\\(P(H_3\\mid H_1H_2)=\\frac12\\)",
        "过去的结果不逼迫下一次“补回来”；频率波动不等于概率改变。"
      ]
    },
    "pitfall": "独立是模型条件，不是所有现实事件都独立。"
  },
  "spread": {
    "formula": "\\sigma^2=\\frac1n\\sum_{i=1}^{n}(x_i-\\bar x)^2",
    "alternate": {
      "title": "谁更稳定",
      "setup": "比较3、4、5与0、4、8，两组均值都为4。",
      "steps": [
        "比较3、4、5与0、4、8，两组均值都为4。",
        "\\(\\sigma_1^2=\\frac23,\\qquad\\sigma_2^2=\\frac{32}{3}\\)",
        "第二组离中心更远，所以方差大；平方防止正负偏差抵消。"
      ]
    },
    "pitfall": "总体方差和无偏样本方差的分母不同。"
  },
  "sets": {
    "formula": "|A\\cup B|=|A|+|B|-|A\\cap B|",
    "alternate": {
      "title": "|两份社团名单",
      "setup": "游泳名单小青、小林；骑车名单小林、小宇。",
      "steps": [
        "游泳名单小青、小林；骑车名单小林、小宇。",
        "\\(A\\cap B=\\{\\text{小林}\\},\\quad|A\\cup B|=2+2-1=3\\)",
        "小林出现两次但只算一个人；交集是共同成员。"
      ]
    },
    "pitfall": "圆面积不代表人数；集合比较的是成员而不是顺序。"
  },
  "logic": {
    "formula": "p\\Rightarrow q\\ \\not\\equiv\\ q\\Rightarrow p",
    "alternate": {
      "title": "找一个反例",
      "setup": "已知“正方形一定是矩形”，反过来“矩形一定是正方形”成立吗？",
      "steps": [
        "已知“正方形一定是矩形”，反过来“矩形一定是正方形”成立吗？",
        "\\(5\\ne3\\Rightarrow\\text{长5宽3的矩形不是正方形}\\)",
        "一张不等边的矩形卡片就反驳了“所有矩形都是正方形”。"
      ]
    },
    "pitfall": "下雨例子只是单向条件的教学假设；真实地面还受遮雨等因素影响。"
  },
  "function-domain": {
    "formula": "f(x)=\\frac1x,\\quad D=\\mathbb R\\setminus\\{0\\}",
    "alternate": {
      "title": "正方形面积反推边长",
      "setup": "面积输入x必须非负，输出非负边长。",
      "steps": [
        "面积输入x必须非负，输出非负边长。",
        "\\(f(x)=\\sqrt x,\\quad D=[0,\\infty),\\quad f(9)=3\\)",
        "9只输出3；解方程y²=9可有±3，但作为边长函数要选非负值。"
      ]
    },
    "pitfall": "“一个输入唯一输出”不要求不同输入的输出互不相同。"
  },
  "function-transform": {
    "formula": "y=(x-2)^2+1",
    "alternate": {
      "title": "什么时候抵达原来的山顶",
      "setup": "新图横坐标2处，括号里面正好等于0。",
      "steps": [
        "新图横坐标2处，括号里面正好等于0。",
        "\\(x-2=0\\Rightarrow x=2\\)",
        "因此顶点从0移到2，随后整体上移1；不能凭减号猜成左移。"
      ]
    },
    "pitfall": "自变量变换和输出变换的方向不同。"
  },
  "exponential": {
    "formula": "y=a^x\\quad(a>0,\\ a\\ne1)",
    "alternate": {
      "title": "每次剩一半",
      "setup": "一瓶假想染料每轮减少一半，开始100单位。",
      "steps": [
        "一瓶假想染料每轮减少一半，开始100单位。",
        "\\(100\\times(1/2)^3=12.5\\)",
        "3轮后剩12.5；每轮减少的绝对数量不同，比例相同。"
      ]
    },
    "pitfall": "这是比例衰减模型，不是所有生物或药物的真实预测。"
  },
  "logarithms": {
    "formula": "\\log_a b=x\\iff a^x=b",
    "alternate": {
      "title": "找隐藏卡片",
      "setup": "32张按顺序的卡，每次把候选数减半。",
      "steps": [
        "32张按顺序的卡，每次把候选数减半。",
        "\\(32\\to16\\to8\\to4\\to2\\to1,\\quad\\log_2 32=5\\)",
        "5次对半后只留1张；这里数的是对半次数。"
      ]
    },
    "pitfall": "底数必须正且不等于1，真数必须正。"
  },
  "arithmetic-sequence": {
    "formula": "S_n=\\frac{n(a_1+a_n)}2",
    "alternate": {
      "title": "每天多读两页",
      "setup": "第一天4页，以后每天多2页，5天共多少？",
      "steps": [
        "第一天4页，以后每天多2页，5天共多少？",
        "\\(4+6+8+10+12=\\frac{5(4+12)}2=40\\)",
        "首尾平均8页，5天共40；把高低配平。"
      ]
    },
    "pitfall": "不要把最后一天数量当成总量。"
  },
  "geometric-sequence": {
    "formula": "S_n=\\frac{a_1(1-q^n)}{1-q}\\ (q\\ne1)",
    "alternate": {
      "title": "连续折半的纸条",
      "setup": "剪下1、半条、四分之一条，共3次。",
      "steps": [
        "剪下1、半条、四分之一条，共3次。",
        "\\(1+\\frac12+\\frac14=\\frac74\\)",
        "乘半再相减可以消去中间项；有限次与无限和要分开。"
      ]
    },
    "pitfall": "公比为1时不能使用分母为0的形式。"
  },
  "induction": {
    "formula": "P(1),\\quad P(k)\\Rightarrow P(k+1)",
    "alternate": {
      "title": "奇数拼正方形",
      "setup": "1个方格开始，每次沿两边加一层L形。",
      "steps": [
        "1个方格开始，每次沿两边加一层L形。",
        "\\(1+3+5=9,\\quad k^2+(2k+1)=(k+1)^2\\)",
        "基础1成立；若k层是k²，加下一圈就得到下一平方。"
      ]
    },
    "pitfall": "只验证前几项不是归纳证明，还要证明任意下一步。"
  },
  "radians": {
    "formula": "\\theta=\\frac sr",
    "alternate": {
      "title": "一样角度不同半径",
      "setup": "弧长3、半径3的圆弧，与弧长5、半径5的圆弧。",
      "steps": [
        "弧长3、半径3的圆弧，与弧长5、半径5的圆弧。",
        "\\(\\theta_1=3/3=1,\\quad\\theta_2=5/5=1\\)",
        "两者角度均1弧度；弧度是长度比，不是长度。"
      ]
    },
    "pitfall": "三角函数的微积分公式通常要求弧度。"
  },
  "trig-functions": {
    "formula": "(x,y)=(\\cos\\theta,\\sin\\theta)",
    "alternate": {
      "title": "摩天轮上的高度",
      "setup": "半径2、圆心高3，从右端开始逆时针转。",
      "steps": [
        "半径2、圆心高3，从右端开始逆时针转。",
        "\\(h(\\theta)=3+2\\sin\\theta\\)",
        "转四分之一圈到最高5，半圈回到3；坐标与圆上位置对应。"
      ]
    },
    "pitfall": "简化模型忽略座舱自身摆动。"
  },
  "trig-identities": {
    "formula": "\\sin^2\\theta+\\cos^2\\theta=1",
    "alternate": {
      "title": "检查旋转后距离",
      "setup": "半径1的指针从正右方向逆时针转60度，针尖的横、纵坐标有什么关系？",
      "steps": [
        "半径1的指针从正右方向逆时针转60度，针尖的横、纵坐标有什么关系？",
        "\\(\\left(\\frac12\\right)^2+\\left(\\frac{\\sqrt3}{2}\\right)^2=1\\)",
        "横纵投影的平方和固定；数值例证帮助理解，一般式来自圆定义。"
      ]
    },
    "pitfall": "单个角度的验证不是全角度的证明。"
  },
  "sine-cosine-law": {
    "formula": "c^2=a^2+b^2-2ab\\cos C",
    "alternate": {
      "title": "两条连杆的端点",
      "setup": "两边长3和4，夹角60度。",
      "steps": [
        "两边长3和4，夹角60度。",
        "\\(c^2=9+16-24\\times\\frac12=13\\)",
        "对边为根号13；夹角90度才退化为勾股。"
      ]
    },
    "pitfall": "边与对角必须一一对应，不能把任意角代入。"
  },
  "vectors": {
    "formula": "\\|(3,4)\\|=\\sqrt{3^2+4^2}=5",
    "alternate": {
      "title": "绕路与直接距离",
      "setup": "向东3米再向北4米；把两支箭头首尾连接。",
      "steps": [
        "向东3米再向北4米；把两支箭头首尾连接。",
        "\\(\\text{路程}=3+4=7,\\quad\\text{位移长度}=5\\)",
        "走过的路径7米，起终点直线距离5米。"
      ]
    },
    "pitfall": "向量和不是直接把所有长度相加。"
  },
  "dot-product": {
    "formula": "\\boldsymbol a\\cdot\\boldsymbol b=\\|\\boldsymbol a\\|\\|\\boldsymbol b\\|\\cos\\theta",
    "alternate": {
      "title": "推箱子的方向",
      "setup": "恒力10牛与水平位移2米夹60度，只取沿位移分量。",
      "steps": [
        "恒力10牛与水平位移2米夹60度，只取沿位移分量。",
        "\\(W=10\\times2\\times\\cos60^\\circ=10\\,\\mathrm J\\)",
        "垂直方向不贡献这个方向的功；这是理想恒力模型。"
      ]
    },
    "pitfall": "功有正负，不能一律取力的大小乘路程。"
  },
  "conics": {
    "formula": "\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1",
    "alternate": {
      "title": "椭圆的端点",
      "setup": "椭圆长半轴3、短半轴2，检查右端和上端是否满足方程。",
      "steps": [
        "椭圆长半轴3、短半轴2，检查右端和上端是否满足方程。",
        "\\(\\frac{3^2}{9}+0=1,\\quad0+\\frac{2^2}{4}=1\\)",
        "焦距参数为根号5，半轴和焦距不是同一个量。"
      ]
    },
    "pitfall": "跑道弯道不一定是数学椭圆。"
  },
  "space-geometry": {
    "formula": "(x,y,z)\\mapsto(x,y)",
    "alternate": {
      "title": "看不见的高度",
      "setup": "宽长相同、一个高2另一个高5的盒子，从正上方看。",
      "steps": [
        "宽长相同、一个高2另一个高5的盒子，从正上方看。",
        "\\((4,3,2)\\mapsto(4,3),\\quad(4,3,5)\\mapsto(4,3)\\)",
        "俯视投影相同，不能只靠一张俯视图还原高度。"
      ]
    },
    "pitfall": "必须说明投影类型，透视与正投影不同。"
  },
  "complex": {
    "formula": "i^2=-1,\\quad(a+bi)i=-b+ai",
    "alternate": {
      "title": "连续转四次",
      "setup": "从复平面上的1点开始，每次乘以i，像指针每次逆时针转四分之一圈。",
      "steps": [
        "从复平面上的1点开始，每次乘以i，像指针每次逆时针转四分之一圈。",
        "\\(1\\to i\\to-1\\to-i\\to1\\)",
        "四次四分之一圈回到起点1（不是原点0）；乘法可以表达旋转。"
      ]
    },
    "pitfall": "虚部系数是实数，不要把i当普通未知数。"
  },
  "permutations": {
    "formula": "P(n,k)=\\frac{n!}{(n-k)!},\\quad C(n,k)=\\frac{n!}{k!(n-k)!}",
    "alternate": {
      "title": "选组长和副组长",
      "setup": "4人中选2人当不同职务；先选组长再选副组长。",
      "steps": [
        "4人中选2人当不同职务；先选组长再选副组长。",
        "\\(4\\times3=12,\\qquad\\binom42=6\\)",
        "职务有顺序得到12种；不分职务组队只有6种。"
      ]
    },
    "pitfall": "对象是否不同、是否计顺序必须先说清。"
  },
  "binomial-theorem": {
    "formula": "(a+b)^n=\\sum_{k=0}^{n}\\binom nk a^{n-k}b^k",
    "alternate": {
      "title": "展开两次选择",
      "setup": "两个括号分别选a或b，列出四条路径。",
      "steps": [
        "两个括号分别选a或b，列出四条路径。",
        "\\((a+b)^2=aa+ab+ba+bb=a^2+2ab+b^2\\)",
        "ab与ba合并，系数2是在数选择方式。"
      ]
    },
    "pitfall": "数值可交换时才可这样合并；矩阵一般不行。"
  },
  "conditional": {
    "formula": "P(A\\mid B)=\\frac{P(A\\cap B)}{P(B)}",
    "alternate": {
      "title": "名单范围变了",
      "setup": "10人中6人会骑车，其中3人也会游泳。已知会骑车，再问会游泳概率。",
      "steps": [
        "10人中6人会骑车，其中3人也会游泳。已知会骑车，再问会游泳概率。",
        "\\(P(\\text{游泳}\\mid\\text{骑车})=\\frac36=\\frac12\\)",
        "分母换成已知范围里的6人，不是全部10人。"
      ]
    },
    "pitfall": "条件概率与把两个概率相乘不是同一个操作。"
  },
  "random-variable": {
    "formula": "E[X]=\\sum_x xP(X=x)",
    "alternate": {
      "title": "不可能拿到的平均奖分",
      "setup": "游戏有一半机会得0分，一半得10分。",
      "steps": [
        "游戏有一半机会得0分，一半得10分。",
        "\\(E[X]=0\\times\\frac12+10\\times\\frac12=5\\)",
        "平均5分不表示单次会得到5分，更不是保底5分。"
      ]
    },
    "pitfall": "期望描述模型加权平均，不承诺个人结果。"
  },
  "regression": {
    "formula": "\\min_{a,b}\\sum_i(y_i-ax_i-b)^2",
    "alternate": {
      "title": "温度和冰淇淋",
      "setup": "高温天冰淇淋与游泳人数一起上升；温度可能同时影响两者。",
      "steps": [
        "高温天冰淇淋与游泳人数一起上升；温度可能同时影响两者。",
        "\\(\\text{相关}\\not\\Rightarrow\\text{因果}\\)",
        "拟合线能描述联系，不能据此断言吃冰淇淋使人去游泳。"
      ]
    },
    "pitfall": "外推到数据范围外需要额外依据。"
  },
  "derivative-intro": {
    "formula": "f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}h",
    "alternate": {
      "title": "这一刻的面积增长",
      "setup": "边长x的正方形再加一小段h，多出两条边条和一个角块。",
      "steps": [
        "边长x的正方形再加一小段h，多出两条边条和一个角块。",
        "\\(\\frac{(x+h)^2-x^2}{h}=2x+h\\to2x\\)",
        "小角块贡献除以h后趋于0，留下瞬时变化率2x。"
      ]
    },
    "pitfall": "h不能先设为0再做除法。"
  },
  "limits": {
    "formula": "\\lim_{n\\to\\infty}(1-2^{-n})=1",
    "alternate": {
      "title": "剩余误差要小于多少",
      "setup": "每轮把离终点的距离减半，初始差1。要求差小于0.01。",
      "steps": [
        "每轮把离终点的距离减半，初始差1。要求差小于0.01。",
        "\\(2^{-7}=\\frac1{128}<0.01\\)",
        "7轮满足这一误差要求，但仍未在有限轮准确等于终点。"
      ]
    },
    "pitfall": "趋近不等于每一步都取到极限值。"
  },
  "continuity": {
    "formula": "\\lim_{x\\to a}f(x)=f(a)",
    "alternate": {
      "title": "改一个点会怎样",
      "setup": "原图为平方函数，但人为指定x=2时输出7。",
      "steps": [
        "原图为平方函数，但人为指定x=2时输出7。",
        "\\(\\lim_{x\\to2}f(x)=4\\ne f(2)=7\\)",
        "附近的趋势没变，点值却跳开；函数在2不连续。"
      ]
    },
    "pitfall": "不抬笔只是直观，正式检查要看极限和点值。"
  },
  "derivatives": {
    "formula": "(f\\circ g)'=(f'\\circ g)g'",
    "alternate": {
      "title": "机器套机器",
      "setup": "先把x变成3x+1，再求平方；两层变化率相乘。",
      "steps": [
        "先把x变成3x+1，再求平方；两层变化率相乘。",
        "\\(\\frac{d}{dx}(3x+1)^2=2(3x+1)\\times3\\)",
        "外层对内层的变化乘内层对x的变化，就是链式法则。"
      ]
    },
    "pitfall": "不能漏掉内层导数3。"
  },
  "mean-value": {
    "formula": "f'(\\xi)=\\frac{f(b)-f(a)}{b-a}",
    "alternate": {
      "title": "割线和切线平行",
      "setup": "平方函数在0到2上的平均斜率。",
      "steps": [
        "平方函数在0到2上的平均斜率。",
        "\\(\\frac{4-0}{2-0}=2,\\qquad f'(1)=2\\)",
        "在中点1有一条切线和割线平行；一般定理需连续与可导条件。"
      ]
    },
    "pitfall": "尖角或跳跃函数不能直接套用。"
  },
  "optimization": {
    "formula": "A(x)=x(10-x)=25-(x-5)^2",
    "alternate": {
      "title": "多一点不一定更好",
      "setup": "总围栏20米，一边从4米改到5米，再改到6米。",
      "steps": [
        "总围栏20米，一边从4米改到5米，再改到6米。",
        "\\(A(4)=24,\\quad A(5)=25,\\quad A(6)=24\\)",
        "两边相等时面积最大；因为减去的平方非负。"
      ]
    },
    "pitfall": "驻点只是候选，还要查边界和函数形状。"
  },
  "integral": {
    "formula": "\\int_0^1x^2\\,dx=\\frac13",
    "alternate": {
      "title": "流量积成水量",
      "setup": "水以每秒2升的恒速流入，持续3秒。",
      "steps": [
        "水以每秒2升的恒速流入，持续3秒。",
        "\\(\\int_0^3 2\\,dt=2\\times3=6\\,\\mathrm L\\)",
        "图上的宽是时间、高是流量，面积单位是升。"
      ]
    },
    "pitfall": "定积分是有符号累积，不能总说成无符号面积。"
  },
  "fundamental": {
    "formula": "\\frac d{dx}\\int_a^x f(t)\\,dt=f(x)",
    "alternate": {
      "title": "速度与路程互相检查",
      "setup": "取速度v(t)=2t，初始路程0。",
      "steps": [
        "取速度v(t)=2t，初始路程0。",
        "\\(s(t)=\\int_0^t2u\\,du=t^2,\\qquad s'(t)=2t\\)",
        "累积速度得到路程，再求变化率回到速度。"
      ]
    },
    "pitfall": "条件和初始常数不能忽略。"
  },
  "integration-methods": {
    "formula": "\\int_0^1 2x\\cos(x^2)\\,dx=\\int_0^1\\cos u\\,du=\\sin1",
    "alternate": {
      "title": "乘积积分的拆法",
      "setup": "求0到1上x乘指数函数的积分，用乘积求导反推。",
      "steps": [
        "求0到1上x乘指数函数的积分，用乘积求导反推。",
        "\\(\\int_0^1xe^x\\,dx=[xe^x]_0^1-\\int_0^1e^x\\,dx=1\\)",
        "不是把两项各自积分后相乘；边界项很重要。"
      ]
    },
    "pitfall": "换元时微分和上下限必须同时改变。"
  },
  "improper": {
    "formula": "\\int_1^\\infty\\frac1{x^2}\\,dx=1",
    "alternate": {
      "title": "无限远也可有限",
      "setup": "先只算到R，不直接把无穷当普通数代入。",
      "steps": [
        "先只算到R，不直接把无穷当普通数代入。",
        "\\(\\int_1^R\\frac1{x^2}\\,dx=1-\\frac1R\\to1\\)",
        "延伸越远新添面积越小，有限上限的积分趋向1。"
      ]
    },
    "pitfall": "与积分1/x比较时后者发散，不能因都趋零就混同。"
  },
  "series": {
    "formula": "\\sum_{n=1}^{\\infty}2^{-n}=1",
    "alternate": {
      "title": "项趋零仍可能发散",
      "setup": "把调和级数按1项、2项、4项、8项分组。",
      "steps": [
        "把调和级数按1项、2项、4项、8项分组。",
        "\\(\\frac13+\\frac14\\ge\\frac12,\\quad\\frac15+\\cdots+\\frac18\\ge\\frac12\\)",
        "不断增加至少半个单位的分组，总和不会停在有限值。"
      ]
    },
    "pitfall": "单项趋零只是必要条件。"
  },
  "taylor": {
    "formula": "e^x=1+x+\\frac{x^2}{2!}+\\cdots",
    "alternate": {
      "title": "局部近似要查误差",
      "setup": "用二次式估计指数函数在0.1处的值。",
      "steps": [
        "用二次式估计指数函数在0.1处的值。",
        "\\(1+0.1+\\frac{0.1^2}2=1.105\\)",
        "真值约1.10517；余项界给出保证，增加小数位本身不保证准确。"
      ]
    },
    "pitfall": "远离展开点时同阶近似可能很差。"
  },
  "parametric": {
    "formula": "(x,y)=(r\\cos\\theta,r\\sin\\theta)",
    "alternate": {
      "title": "画一个圆",
      "setup": "半径2，用同一个角控制横纵两个坐标。",
      "steps": [
        "半径2，用同一个角控制横纵两个坐标。",
        "\\(\\theta=\\frac\\pi2\\Rightarrow(x,y)=(0,2)\\)",
        "两个坐标不能各自随便变化，否则就不一定在圆上。"
      ]
    },
    "pitfall": "极坐标角度可以相差整圈而指同一点。"
  },
  "partial": {
    "formula": "df=f_x\\,dx+f_y\\,dy",
    "alternate": {
      "title": "一项一项改条件",
      "setup": "价格函数f(x,y)=2x+3y，先只多买一种，再考虑两种同时变。",
      "steps": [
        "价格函数f(x,y)=2x+3y，先只多买一种，再考虑两种同时变。",
        "\\(f_x=2,\\quad f_y=3,\\quad\\Delta f=2\\Delta x+3\\Delta y\\)",
        "线性例子全微分恰好等于增量；非线性通常只是局部近似。"
      ]
    },
    "pitfall": "计算偏导时其他自变量保持不变。"
  },
  "multiple-integrals": {
    "formula": "\\iint_{[0,1]^2}(x+y)\\,dx\\,dy=1",
    "alternate": {
      "title": "均匀薄板质量",
      "setup": "长2宽3的板，面密度每单位面积4。",
      "steps": [
        "长2宽3的板，面密度每单位面积4。",
        "\\(m=\\int_0^2\\int_0^3 4\\,dy\\,dx=24\\)",
        "小块面积乘密度，再累加；单位也相乘。"
      ]
    },
    "pitfall": "换坐标要计入雅可比，不能只换字母。"
  },
  "vector-calculus": {
    "formula": "\\nabla\\cdot(x,y)=2",
    "alternate": {
      "title": "转圈不一定向外流",
      "setup": "比较向外场(x,y)与旋转场(-y,x)。",
      "steps": [
        "比较向外场(x,y)与旋转场(-y,x)。",
        "\\(\\nabla\\cdot(-y,x)=0,\\quad\\partial_x x-\\partial_y(-y)=2\\)",
        "后者局部旋转不为零，但净流出为零；旋度和散度不同。"
      ]
    },
    "pitfall": "箭头图仅是二维切片，不能代替全部三维场。"
  },
  "differential": {
    "formula": "y'=ky,\\quad y(0)=1\\Rightarrow y=e^{kt}",
    "alternate": {
      "title": "检查一个解",
      "setup": "给变化规则y′=2y，从1开始，试指数解。",
      "steps": [
        "给变化规则y′=2y，从1开始，试指数解。",
        "\\(y=e^{2t},\\qquad y'=2e^{2t}=2y\\)",
        "求导后确实满足方程，初始值也为1；两项都要核对。"
      ]
    },
    "pitfall": "若不指定初始值，会有一族解。"
  },
  "matrices": {
    "formula": "\\begin{pmatrix}2&0\\\\0&1\\end{pmatrix}\\binom11=\\binom21",
    "alternate": {
      "title": "旋转一支箭头",
      "setup": "把横向单位箭头转90度，使用旋转矩阵。",
      "steps": [
        "把横向单位箭头转90度，使用旋转矩阵。",
        "\\(\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}\\binom10=\\binom01\\)",
        "每一列是一个基向量变换后的去处；先列后乘。"
      ]
    },
    "pitfall": "矩阵乘法一般不能交换次序。"
  },
  "elimination": {
    "formula": "\\begin{cases}x+y=3\\\\2x+y=4\\end{cases}\\Rightarrow(x,y)=(1,2)",
    "alternate": {
      "title": "重复的方程够吗",
      "setup": "两式分别是x+y=3和2x+2y=6。",
      "steps": [
        "两式分别是x+y=3和2x+2y=6。",
        "\\(R_2-2R_1\\Rightarrow0=0\\)",
        "第二条只是第一条的倍数，仍有一条线的解而非唯一点。"
      ]
    },
    "pitfall": "把一行消成零不表示所有未知数都为零。"
  },
  "determinant": {
    "formula": "\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}=ad-bc",
    "alternate": {
      "title": "镜面翻转",
      "setup": "横坐标取反，纵坐标不变；单位方格面积仍为1。",
      "steps": [
        "横坐标取反，纵坐标不变；单位方格面积仍为1。",
        "\\(\\det\\begin{pmatrix}-1&0\\\\0&1\\end{pmatrix}=-1\\)",
        "负号表示定向翻转；普通面积取绝对值。"
      ]
    },
    "pitfall": "行列式不是矩阵全部元素直接相乘。"
  },
  "inverse-matrix": {
    "formula": "A^{-1}=\\frac1{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}",
    "alternate": {
      "title": "压扁后还能恢复吗",
      "setup": "变换把所有纵坐标都变成0。",
      "steps": [
        "变换把所有纵坐标都变成0。",
        "\\(\\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}\\binom xy=\\binom x0\\)",
        "不同y变成同一个结果，信息丢失，所以不存在唯一逆变换。"
      ]
    },
    "pitfall": "逆变换回到原来的坐标，不是所有点回到原点。"
  },
  "vector-spaces": {
    "formula": "\\binom34=3\\binom10+4\\binom01",
    "alternate": {
      "title": "两个方向都水平",
      "setup": "只有向右1格与向右2格两个箭头，能拼出上方点吗？",
      "steps": [
        "只有向右1格与向右2格两个箭头，能拼出上方点吗？",
        "\\(a(1,0)+b(2,0)=(a+2b,0)\\)",
        "纵坐标总为0，所以不能张成整个平面。"
      ]
    },
    "pitfall": "箭头的个数不自动等于维数，还要线性无关。"
  },
  "rank": {
    "formula": "\\operatorname{rank}A+\\dim\\ker A=n",
    "alternate": {
      "title": "投影丢了哪一维",
      "setup": "二维点投影到横轴，纵方向都被消去。",
      "steps": [
        "二维点投影到横轴，纵方向都被消去。",
        "\\(A=\\begin{pmatrix}1&0\\\\0&0\\end{pmatrix},\\quad1+1=2\\)",
        "留下1维像空间，丢失方向组成1维零空间。"
      ]
    },
    "pitfall": "零空间不是“什么都没有”，而是一组输入。"
  },
  "eigen": {
    "formula": "Av=\\lambda v,\\quad v\\ne0",
    "alternate": {
      "title": "没有实特征方向的旋转",
      "setup": "平面转90度，任意非零实箭头都改变方向。",
      "steps": [
        "平面转90度，任意非零实箭头都改变方向。",
        "\\(R=\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix},\\quad\\lambda^2+1=0\\)",
        "没有实特征值，但复数范围有正负i；需要说明数域。"
      ]
    },
    "pitfall": "特征值可负，负值会让箭头反向，仍在同一直线上。"
  },
  "orthogonal": {
    "formula": "\\operatorname{proj}_u v=\\frac{v\\cdot u}{u\\cdot u}u",
    "alternate": {
      "title": "斜箭头的水平影子",
      "setup": "v=(3,4)，参照箭头u=(2,0)，不是单位长度。",
      "steps": [
        "v=(3,4)，参照箭头u=(2,0)，不是单位长度。",
        "\\(\\frac{(3,4)\\cdot(2,0)}{(2,0)\\cdot(2,0)}(2,0)=(3,0)\\)",
        "归一化分母不可漏掉；剩余(0,4)与水平方向垂直。"
      ]
    },
    "pitfall": "只有u为单位向量时才能省去分母。"
  },
  "least-squares": {
    "formula": "\\min_x\\|Ax-b\\|^2",
    "alternate": {
      "title": "一个数代表三次读数",
      "setup": "读数1、2、6，用一个常数a代表全部，最小化平方误差。",
      "steps": [
        "读数1、2、6，用一个常数a代表全部，最小化平方误差。",
        "\\(L(a)=(1-a)^2+(2-a)^2+(6-a)^2,\\quad L'(a)=6a-18\\)",
        "在a=3最小；这是最小二乘的最简单特例。"
      ]
    },
    "pitfall": "平均绝对误差的最优值通常对应中位数，不是同一目标。"
  },
  "svd": {
    "formula": "A=U\\Sigma V^{\\mathsf T}",
    "alternate": {
      "title": "保留主要方向",
      "setup": "横向放大5倍、纵向放大1倍，近似时只保留强方向。",
      "steps": [
        "横向放大5倍、纵向放大1倍，近似时只保留强方向。",
        "\\(A=\\operatorname{diag}(5,1),\\quad A_1=\\operatorname{diag}(5,0)\\)",
        "压掉纵向可减少信息量，但误差不为零；最优需指定范数与秩。"
      ]
    },
    "pitfall": "实SVD的正交变换可能包含反射，不全是普通旋转。"
  },
  "distributions": {
    "formula": "P(X=k)=\\binom nk p^k(1-p)^{n-k}",
    "alternate": {
      "title": "两次硬币成功数",
      "setup": "公平独立硬币两次：反反、正反、反正、正正。",
      "steps": [
        "公平独立硬币两次：反反、正反、反正、正正。",
        "\\(P(X=0)=\\frac14,\\ P(X=1)=\\frac12,\\ P(X=2)=\\frac14\\)",
        "中间有两条路径，所以概率不是三个值各三分之一。"
      ]
    },
    "pitfall": "独立、固定次数与固定成功率是二项模型条件。"
  },
  "normal": {
    "formula": "f(x)=\\frac1{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}",
    "alternate": {
      "title": "密度可以高于1吗",
      "setup": "把标准差缩小，曲线更窄更高，但总面积仍是1。",
      "steps": [
        "把标准差缩小，曲线更窄更高，但总面积仍是1。",
        "\\(\\int_{-\\infty}^{\\infty}f(x)\\,dx=1,\\qquad P(X=\\mu)=0\\)",
        "概率看区间下面积，不是单个点的曲线高度。"
      ]
    },
    "pitfall": "正态分布是模型，不能强行套所有数据。"
  },
  "bayes": {
    "formula": "P(A\\mid B)=\\frac{P(B\\mid A)P(A)}{P(B)}",
    "alternate": {
      "title": "两种盒子里的球",
      "setup": "两个盒子等概率选：甲3红1蓝，乙1红3蓝，看到红球后猜来自甲。",
      "steps": [
        "两个盒子等概率选：甲3红1蓝，乙1红3蓝，看到红球后猜来自甲。",
        "\\(P(\\text{甲}\\mid\\text{红})=\\frac{\\frac12\\times\\frac34}{\\frac12\\times\\frac34+\\frac12\\times\\frac14}=\\frac34\\)",
        "先算各路径的红球概率，再在所有红球路径中看甲占多少。"
      ]
    },
    "pitfall": "不要把看到红球后的概率与选盒子的先验混淆。"
  },
  "lln-clt": {
    "formula": "\\frac{\\sqrt n(\\bar X_n-\\mu)}\\sigma\\Rightarrow N(0,1)",
    "alternate": {
      "title": "平均更稳不是必然更近",
      "setup": "独立同分布、有限方差样本均值的标准差随n变化。",
      "steps": [
        "独立同分布、有限方差样本均值的标准差随n变化。",
        "\\(\\operatorname{SD}(\\bar X_n)=\\frac\\sigma{\\sqrt n}\\)",
        "样本数变4倍，标准差减半；不是每次新抽样都更接近真值。"
      ]
    },
    "pitfall": "大数定律和中心极限定理的结论不同，均需条件。"
  },
  "estimation": {
    "formula": "\\hat p\\pm1.96\\sqrt{\\frac{\\hat p(1-\\hat p)}n}",
    "alternate": {
      "title": "估计有误差范围",
      "setup": "在适用正态近似的独立样本中，100次中60次成功。",
      "steps": [
        "在适用正态近似的独立样本中，100次中60次成功。",
        "\\(0.60\\pm1.96\\sqrt{0.60\\times0.40/100}\\approx[0.504,0.696]\\)",
        "这是近似95%方法区间；长期重复方法的覆盖率，不是固定参数随机移动。"
      ]
    },
    "pitfall": "小样本或比例极端时该简单区间不可靠。"
  },
  "hypothesis": {
    "formula": "p=P_{H_0}(\\text{至少同样极端})",
    "alternate": {
      "title": "五次全正面很特别吗",
      "setup": "预先约定双侧规则，公平硬币独立抛5次，观察全正面。",
      "steps": [
        "预先约定双侧规则，公平硬币独立抛5次，观察全正面。",
        "\\(p=P(5H\\text{ 或 }5T)=\\frac2{2^5}=0.0625\\)",
        "按预设5%阈值不拒绝公平假设；不等于证明它公平。"
      ]
    },
    "pitfall": "p值不是原假设为真的概率；不能看结果再改单双侧。"
  },
  "combinatorics": {
    "formula": "|A\\cup B|=|A|+|B|-|A\\cap B|",
    "alternate": {
      "title": "生日月份会重复吗",
      "setup": "13个人放入12个月份盒子，假设每盒最多1人。",
      "steps": [
        "13个人放入12个月份盒子，假设每盒最多1人。",
        "\\(13>12\\Rightarrow\\text{至少一月有2人}\\)",
        "反证：若每月至多1人，总数最多12，与13矛盾。"
      ]
    },
    "pitfall": "抽屉原理不告诉你究竟哪一月重复。"
  },
  "graphs": {
    "formula": "d(A,D)=\\min(7,2+3)=5",
    "alternate": {
      "title": "直达不总最快",
      "setup": "直达7分钟，经过B分别2和3分钟；把时间作为边权。",
      "steps": [
        "直达7分钟，经过B分别2和3分钟；把时间作为边权。",
        "\\(2+3=5<7\\)",
        "最少边数的路线未必总权最小；若改计票价需重新赋权。"
      ]
    },
    "pitfall": "Dijkstra要求非负边权。"
  },
  "binary": {
    "formula": "13=1\\times2^3+1\\times2^2+0\\times2+1",
    "alternate": {
      "title": "四盏开关灯",
      "setup": "开关从左到右权值8、4、2、1，只亮8与2。",
      "steps": [
        "开关从左到右权值8、4、2、1，只亮8与2。",
        "\\(1010_2=8+2=10_{10}\\)",
        "位置决定权重；每位只有0或1，但能表示很多数。"
      ]
    },
    "pitfall": "补码、有符号数和普通正整数编码规则不同。"
  },
  "modular": {
    "formula": "a\\equiv b\\pmod m\\iff m\\mid(a-b)",
    "alternate": {
      "title": "星期几循环",
      "setup": "今天周二，再过10天；只需看除以7的余数。",
      "steps": [
        "今天周二，再过10天；只需看除以7的余数。",
        "\\(10=7+3,\\quad\\text{周二}+3\\text{ 天}=\\text{周五}\\)",
        "走完一周回到同一天，再前进3天。"
      ]
    },
    "pitfall": "余数范围和负数取模规则要明确。"
  },
  "algorithms": {
    "formula": "T(n)=\\Theta(\\log n)",
    "alternate": {
      "title": "两种找法",
      "setup": "有序1023张卡，线性逐张比与每次比较中间项。",
      "steps": [
        "有序1023张卡，线性逐张比与每次比较中间项。",
        "\\(2^{10}-1=1023\\)",
        "至多10次中间项比较可覆盖这种规模；实际秒数还取决于设备与实现。"
      ]
    },
    "pitfall": "无序数组不能直接二分；复杂度不是精确耗时。"
  },
  "numerical": {
    "formula": "E_{\\rm total}\\ne E_{\\rm truncation}\\text{ 单独一项}",
    "alternate": {
      "title": "迭代还要检查残差",
      "setup": "用x近似根号2，试1.4与1.414。",
      "steps": [
        "用x近似根号2，试1.4与1.414。",
        "\\(1.4^2-2=-0.04,\\qquad1.414^2-2=-0.000604\\)",
        "残差变小提供证据，但需要条件才能把残差换成解的误差界。"
      ]
    },
    "pitfall": "多打印小数位不能修复模型和输入误差。"
  },
  "gradient": {
    "formula": "x_{k+1}=x_k-\\eta\\nabla f(x_k)",
    "alternate": {
      "title": "一步太大反而更远",
      "setup": "函数为x²，起点1；步长0.1与1.1比较。",
      "steps": [
        "函数为x²，起点1；步长0.1与1.1比较。",
        "\\(1-0.1\\times2=0.8,\\quad1-1.1\\times2=-1.2\\)",
        "前者函数值0.64下降，后者1.44上升；方向对还要控制步长。"
      ]
    },
    "pitfall": "非凸优化不保证找到全局最优。"
  },
  "fourier": {
    "formula": "S_N(x)=\\frac4\\pi\\sum_{k=0}^{N-1}\\frac{\\sin((2k+1)x)}{2k+1}",
    "alternate": {
      "title": "波形与音色",
      "setup": "同一基频叠加三倍频，保持每项频率与振幅可辨。",
      "steps": [
        "同一基频叠加三倍频，保持每项频率与振幅可辨。",
        "\\(f(x)=\\sin x+\\frac13\\sin3x\\)",
        "曲线形状改变；多项相加不是把频率简单平均。"
      ]
    },
    "pitfall": "方波展开的4/π系数不可漏掉；跳点有吉布斯现象。"
  },
  "real-analysis": {
    "formula": "\\forall\\varepsilon>0\\ \\exists\\delta>0:\\ 0<|x-a|<\\delta\\Rightarrow|f(x)-L|<\\varepsilon",
    "alternate": {
      "title": "先给容许误差",
      "setup": "证明x趋于2时3x趋于6。对方任意提出正误差ε。",
      "steps": [
        "证明x趋于2时3x趋于6。对方任意提出正误差ε。",
        "\\(\\delta=\\frac\\varepsilon3,\\quad|3x-6|=3|x-2|<3\\delta=\\varepsilon\\)",
        "先接收精度要求，再给输入范围保证；量词顺序重要。"
      ]
    },
    "pitfall": "不能只展示几个接近的数当严格证明。"
  },
  "abstract-algebra": {
    "formula": "1+3\\equiv0\\pmod4",
    "alternate": {
      "title": "旋转的逆操作",
      "setup": "正方形转90度后，怎样回到原朝向？",
      "steps": [
        "正方形转90度后，怎样回到原朝向？",
        "\\(90^\\circ+270^\\circ=360^\\circ\\equiv0^\\circ\\)",
        "零旋转是单位元，270度是90度的逆；群也不要求交换。"
      ]
    },
    "pitfall": "模加法的逆元不是普通实数倒数。"
  },
  "topology": {
    "formula": "S^1\\cong\\text{椭圆周}",
    "alternate": {
      "title": "拉伸与切断",
      "setup": "橡皮圈拉成椭圆仍连成闭环；剪开后出现两个端点。",
      "steps": [
        "橡皮圈拉成椭圆仍连成闭环；剪开后出现两个端点。",
        "\\(\\text{闭环}\\not\\cong[0,1]\\)",
        "同胚要求连续一一对应且逆也连续；长度不是这里的核心。"
      ]
    },
    "pitfall": "连通部分相同不保证两个空间同胚。"
  },
  "modeling": {
    "formula": "s=vt",
    "alternate": {
      "title": "骑车遇到红灯",
      "setup": "按每分钟200米骑5分钟预测1千米，但有1分钟停车。",
      "steps": [
        "按每分钟200米骑5分钟预测1千米，但有1分钟停车。",
        "\\(s=200\\times(5-1)=800\\,\\mathrm m\\)",
        "对照实际少了200米，修正“始终运动”的假设。"
      ]
    },
    "pitfall": "公式漂亮不代表假设正确；最后必须与观察核对。"
  }
};r.MathTeaching=d;if(typeof module!=="undefined")module.exports=d;})(typeof globalThis!=="undefined"?globalThis:this);
