(function(r){
  'use strict';
  // 原创语境与练习；资料链接只支持语言用法，不为具体故事背书。
  const lessons = [
    {
      id:'habitual',stage:2,order:8,title:'说清平时怎样',
      mission:'介绍日常习惯和当前事实',
      intro:'新朋友问你怎样上班、孩子喜欢什么。你要介绍平常的生活，让对方知道你的日常安排。',
      child:'我说“我星期一骑车上班”，不是说我这会儿正骑着车。我是在告诉你，我平时就是这样安排的。',
      adult:'一般现在时常把事情当作当前成立的事实、习惯或规律来陈述，不把镜头放在某次活动的内部过程。它不等于“此刻正在”，也不保证事实永远不变。普通动词在第三人称单数主语后常用带 s 的形式；疑问、否定有 does 时，后面的动词回到原形。',
      steps:['先问：我要介绍通常怎样，还是眼前这一次？','若介绍习惯或当前事实，选一般现在时，再核对主语和动词。','时间短语补充范围；没有 every 也可以表达习惯。'],
      home:'向家人介绍你平时做的一件家务，再介绍孩子通常喜欢的一件事。',
      work:'向新同事介绍团队通常何时开会，而不是汇报此刻会议的进度。',
      trap:'❌ 看到“现在”就加 ing。I know the answer 说的是当前知道，通常不说 I am knowing the answer。',
      limits:'“一般”不是“永远”。住处、职业和习惯都可能改变；一般现在时还有时刻表、叙事等用法，本节先练习当前事实与习惯。',
      sources:[['British Council：Present simple','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/present-simple'],['British Council：Present simple and present continuous','https://learnenglishkids.britishcouncil.org/grammar-vocabulary/grammar-practice/present-simple-present-continuous']],
      principle:{
        question:'我是在交代日常事实，还是追踪某一次活动？',
        reason:'听者需要知道话语覆盖的范围。习惯句把多次经历概括成当前的生活安排，不要求说话当下也在做。',
        steps:['先确定要表达的是事实、习惯还是某次过程。','找出主语：I、you、复数，还是 he、she、it、单个人。','写普通动词；第三人称单数肯定句核对 s 或 es。','若用 do 或 does 提问、否定，后面的普通动词用原形。'],
        boundary:'这一视角帮助选择表达，不能推出所有词形。goes、has 等形式和动词搭配还需要按语言惯例学习。'
      },
      cases:[
        {label:'平常的交通方式',en:'I cycle to work on Mondays.',zh:'我星期一骑车上班。',parts:[{text:'I',role:'说的是我'},{text:'cycle',role:'平常做的事'},{text:'to work',role:'目的地'},{text:'on Mondays.',role:'重复的时间范围'}],why:'介绍星期一的通常安排，哪怕说话时正坐在沙发上也成立。cycle 不把镜头放进某一次骑行。',scene:'周日晚饭后，新同事问你平时怎样上班；你介绍每周一的通勤习惯。'},
        {label:'当前成立的喜好',en:'My son likes picture books.',zh:'我儿子喜欢图画书。',parts:[{text:'My son',role:'谈论的人'},{text:'likes',role:'当前的喜好'},{text:'picture books.',role:'喜欢的东西'}],why:'likes 陈述喜好，不是正在发生的身体动作。My son 是第三人称单数，所以这里用 likes。',scene:'你和老师谈孩子的阅读兴趣，孩子这会儿在操场，手里没有书。'},
        {label:'通常营业时间',en:'The shop opens at eight.',zh:'这家店八点开门。',parts:[{text:'The shop',role:'谈论的店'},{text:'opens',role:'通常发生的事'},{text:'at eight.',role:'具体时点'}],why:'谈的是店铺通常的开门安排，不需要每天开门的全部过程。The shop 后用 opens。',scene:'晚上邻居问明天何时能买早餐，你根据店门口的固定营业时间作答。'}
      ],
      contrasts:[
        {a:'I work from home.',b:'I am working from home this week.',aZh:'我在家办公。',bZh:'我这周在家办公。',judgement:'different',reason:'两句都可用。a 将在家办公作为当前通常的工作方式；b 把本周看作暂时安排，即使说话时已经下班也能这样说。'},
        {a:'I live in Shanghai.',b:'I am living in Shanghai.',aZh:'我住在上海。',bZh:'我目前住在上海。',judgement:'different',reason:'a 中性介绍目前的住处，并不承诺永不搬家。b 更容易把住上海呈现为当前阶段或暂时情况；临时与长期是说话者的表达视角，不是由城市名称决定。'}
      ],
      transfer:{prompt:'同样介绍日常生活，换主语，再换成否定和提问。',variants:[
        {label:'换成复数主语',en:'The children wash their hands before lunch.',zh:'孩子们午饭前洗手。',parts:[{text:'The children',role:'复数主语'},{text:'wash',role:'通常的行动'},{text:'their hands',role:'洗的部位'},{text:'before lunch.',role:'习惯发生的时段'}],why:'这是这群孩子的日常习惯。children 是复数，这里用 wash；句子本身没有说他们眼下正在洗手。',scene:'老师介绍班级的一日生活；现在刚上课，午饭还没有开始。'},
        {label:'否定一种日常安排',en:'Dad does not drive on Fridays.',zh:'爸爸星期五不开车。',parts:[{text:'Dad',role:'单个人'},{text:'does not',role:'否定通常安排'},{text:'drive',role:'原形动词'},{text:'on Fridays.',role:'每周的时间范围'}],why:'does 承担第三人称单数的变化，drive 不再加 s。句子否定星期五通常开车，不是否定爸爸开车的能力。',scene:'家里安排接送：爸爸其他工作日可能开车，星期五通常坐地铁。'},
        {label:'询问固定安排',en:'Does the library close at six?',zh:'图书馆六点关门吗？',parts:[{text:'Does',role:'询问通常是否如此'},{text:'the library',role:'谈论的图书馆'},{text:'close',role:'原形动词'},{text:'at six?',role:'要核实的时点'}],why:'问的是通常的关门时间。Does 已经承担变化，所以不是 Does the library closes。',scene:'下午你想下班后去还书，向工作人员核实图书馆的通常关门时间。'}]},
      challenge:[
        {id:'habitual-probe',kind:'probe',prompt:'Which sentence describes Mina\'s usual journey?',context:'Mina goes to school on foot every school day. She is at home this evening. Introduce her routine.',options:[{text:'She walks to school.',why:'✅ 概括她当前通常怎样上学，与此刻在家不冲突。'},{text:'She is walking to school.',why:'这句通常让人理解为她正在去学校的路上；在其他场景可用，但不是这里要介绍的习惯。'},{text:'She walked to school.',why:'这句可以叙述过去的一次或过去的习惯，这里需要当前的日常安排。'},{text:'She has walked to school.',why:'这句可以报告到现在为止有过步行上学的经历，不能单独明确表达每个上学日的习惯。'}],answer:0,explanation:'先确定要传达的是“平时怎样”。一般现在时呈现日常事实，不能只靠“上学是动作”就选进行形式。',translation:'米娜每个上学日步行上学，现在晚上在家。目标句：她平时步行上学。',skill:'habitual'},
        {id:'habitual-transfer',kind:'transfer',prompt:'Which reply states your current usual habit?',context:'You stopped drinking coffee several months ago. A colleague asks what you normally drink. State that coffee is no longer part of your routine.',options:[{text:'I am not drinking coffee today.',why:'只说今天不喝，可能平时仍喝；这是合理的临时安排，但范围不符合此处。'},{text:'I did not drink coffee yesterday.',why:'只报告昨天没喝，不能交代当前通常的习惯。'},{text:'I do not drink coffee.',why:'✅ 直接否定当前的喝咖啡习惯，符合已经戒掉几个月的情境。'},{text:'I have not drunk coffee yet today.',why:'只说今天到目前还没喝，并可能暗示稍后会喝，不等于日常不喝。'}],answer:2,explanation:'否定普通动词的当前习惯用 do not，加原形 drink。今天没喝与平时不喝是不同的信息范围。',translation:'你几个月前停止喝咖啡；同事问平时喝什么。目标句：我不喝咖啡。',skill:'habitual'}
      ],
      nextUse:'用英语介绍你和家人各一个真实习惯。再补一句今天临时不同的安排；自己核对“通常”与“这一次”有没有说清，不把输入框当作自动评分。'
    },
    {
      id:'ongoing',stage:2,order:9,title:'把镜头放进过程',
      mission:'说明此刻或当前阶段正在做什么',
      intro:'朋友打电话来，想知道你能不能马上出门。也有人问你最近在忙什么。你要让他们看见活动进行到哪里。',
      child:'把小镜头放进事情里面：饺子还在包，故事还在读。说“我这周在读一本书”，不代表我每一秒都捧着书呀。',
      adult:'进行形式把某个参照时刻或阶段看作活动的内部过程。现在进行时常用于说话时在做的事、当前阶段的暂时活动和变化；不保证说话这一秒一直在动。形式是 am、is、are 加动词 ing。知道、拥有等状态意义通常用一般形式，但同一动词换意义后用法也可能改变。',
      steps:['确定参照范围：这一刻，还是最近这段阶段。','确认你要突出的是正在展开的活动或变化。','使用合适的 be 加 ing，再核对该动词在这里表达的意义。'],
      home:'向孩子介绍厨房里正在进行的两件事，再说一个最近在做的家庭项目。',
      work:'汇报目前正在排查的问题；若只是通常职责，换用介绍日常事实的表达。',
      trap:'❌ 进行不等于每秒都不停做，也不能把中文“正在”机械换成 be 加 ing；I know 表示知道时通常不用进行式。',
      limits:'进行式还可表达已安排的未来、带情绪的反复活动等。状态动词不是一张永远禁用 ing 的名单，要看具体意义与语境。',
      sources:[['British Council：Present continuous','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/present-continuous'],['British Council：Advanced present simple and continuous','https://learnenglish.britishcouncil.org/grammar/c1-grammar/advanced-present-simple-continuous']],
      principle:{question:'我想让听者站在活动的哪个阶段看它？',reason:'介绍习惯像看一张生活说明卡；进行表达像把镜头放进一段活动。选哪一种，取决于要让对方知道什么。',steps:['标出现在或当前阶段作为参照范围。','判断要描述的是过程、暂时活动还是变化。','先选 am、is、are，再写 ing 形式，不能只留 ing。','检查动词在本句是否是适合表现过程的意义。'],boundary:'“镜头”只是帮助理解的比喻；词义、拼写变化和惯用表达仍须学习，不能由比喻推出所有英语。'},
      cases:[
        {label:'此刻的活动',en:'We are making dumplings.',zh:'我们正在包饺子。',parts:[{text:'We',role:'做事的人'},{text:'are',role:'当前过程的配合词'},{text:'making',role:'正在做的动作'},{text:'dumplings.',role:'正在做的食物'}],why:'镜头在包饺子的活动内部，没有说整顿饭已经做好。We 要和 are 配合，不能只写 We making。',scene:'现在是周日下午四点，一家人手里拿着饺子皮，朋友打电话问你们在做什么。'},
        {label:'当前阶段的项目',en:'I am reading a long story this week.',zh:'我这周在读一个长故事。',parts:[{text:'I',role:'做事的人'},{text:'am',role:'当前阶段的配合词'},{text:'reading',role:'正在推进的活动'},{text:'a long story',role:'阅读的内容'},{text:'this week.',role:'活动所在的阶段'}],why:'读故事是本周正在推进的项目。说话时书可以合着；进行式不要求此刻每秒都在阅读，也没有保证读完。',scene:'周三午饭时朋友问你最近读什么；你从周一读起，打算周日读完，现在正在吃饭。'},
        {label:'正在发生的变化',en:'The river is rising after the rain.',zh:'雨后河水正在上涨。',parts:[{text:'The river',role:'发生变化的事物'},{text:'is',role:'当前过程的配合词'},{text:'rising',role:'正在发生的变化'},{text:'after the rain.',role:'变化发生的背景'}],why:'重点是水位目前处在上升过程中，不是河流一贯的性质。is rising 不说明最后会涨到多高。',scene:'上午雨已停，监测记录显示九点到十点水位仍在升高，你描述眼前趋势。'}
      ],
      contrasts:[
        {a:'He has lunch at twelve.',b:'He is having lunch.',aZh:'他十二点吃午饭。',bZh:'他正在吃午饭。',judgement:'different',reason:'a 介绍通常的午饭时间；b 把眼前或已知参照时刻放在吃饭过程中。have 在这里表示吃饭，是活动，因此能用进行式。'},
        {a:'I think this map is useful.',b:'I am thinking about the route.',aZh:'我觉得这张地图有用。',bZh:'我正在考虑路线。',judgement:'different',reason:'a 的 think 表示看法，通常用一般形式；b 的 think about 表示思考这一活动，可以看作进行中的过程。区别来自这里的词义，不是 think 永远不能加 ing。'}
      ],
      transfer:{prompt:'从正在做，迁移到暂时安排、否定和询问进度。',variants:[
        {label:'暂时工作的地点',en:'She is working at home this month.',zh:'她这个月在家办公。',parts:[{text:'She',role:'谈论的人'},{text:'is',role:'当前阶段的配合词'},{text:'working',role:'当前阶段的活动'},{text:'at home',role:'工作的地点'},{text:'this month.',role:'暂时阶段'}],why:'突出这个月的暂时安排，不代表她二十四小时都在工作。She 后用 is，不用 are。',scene:'办公室装修一个月，她本月改在家办公；你周日向朋友介绍这个变化。'},
        {label:'否定当前活动',en:'The children are not watching television.',zh:'孩子们现在没在看电视。',parts:[{text:'The children',role:'谈论的人'},{text:'are not',role:'否定当前过程'},{text:'watching',role:'被否定的活动'},{text:'television.',role:'观看的对象'}],why:'not 放在 are 后，否定这次正在看电视；这不等于孩子们平时从不看电视。',scene:'晚上七点，孩子们正在搭积木。家人以为他们在看电视，你纠正眼前情况。'},
        {label:'询问此刻进度',en:'Are you checking the code now?',zh:'你现在正在检查代码吗？',parts:[{text:'Are',role:'询问当前过程'},{text:'you',role:'被询问的人'},{text:'checking',role:'要核实的活动'},{text:'the code',role:'检查的对象'},{text:'now?',role:'参照时刻'}],why:'把 are 放到 you 前询问这一刻的活动。问题不判断代码有没有检查完，也不是问平时是否负责检查。',scene:'下午两点你准备修改同一文件，先问同事是否正检查它，避免互相打断。'}]},
      challenge:[
        {id:'ongoing-probe',kind:'probe',prompt:'Which sentence best reports the activity in progress?',context:'You are on a video call. Your family started making soup ten minutes ago and is still cooking it. Describe what your family is doing.',options:[{text:'We make soup on Sundays.',why:'可介绍周日的惯例，但没有报告眼前这次做汤的进度。'},{text:'We have made the soup.',why:'通常把汤呈现为已经做好、结果可用；这里仍在烹饪。'},{text:'We are making soup.',why:'✅ 把镜头放进当前正在进行的做汤活动。'},{text:'We made soup yesterday.',why:'报告昨天的事情，与眼前这次活动的时间不同。'}],answer:2,explanation:'先看情境：活动已经开始且当前仍在进行。are making 展示过程；have made 更容易呈现结果。',translation:'视频通话中，一家人十分钟前开始做汤，现在还在做。目标句：我们正在做汤。',skill:'ongoing'},
        {id:'ongoing-transfer',kind:'transfer',prompt:'Which sentence presents this as a temporary project in progress?',context:'You started learning a song this month. You have not mastered it yet. You are eating dinner now, and a friend asks about your current project.',options:[{text:'I am learning a new song this month.',why:'✅ 用这个月作为活动阶段，即使吃饭时没有唱，也可以说明项目正在推进。'},{text:'I learn a new song every month.',why:'这是合理的习惯表达，但会把每月学歌说成常规安排；情境只交代当前项目。'},{text:'I learned a new song last month.',why:'把学歌放到上个月，时间和当前项目不符。'},{text:'I have mastered the song.',why:'宣称已经掌握，直接违背尚未学会的情况。'}],answer:0,explanation:'进行式可以覆盖当前阶段，而不只覆盖说话的一秒。“正在学”与“已经掌握”也不能互换。',translation:'你本月开始学一首歌，尚未掌握，此刻正在吃饭。目标句：我这个月在学一首新歌。',skill:'ongoing'}
      ],nextUse:'选一个你目前正在推进的小项目，用英语告诉家人。再说一句你此刻正在做的事，核对两句的参照范围；自行检查是否都有合适的 be。'
    },
    {
      id:'past',stage:2,order:10,title:'回到过去的现场',
      mission:'叙述过去事件并分清背景与发生的事',
      intro:'孩子问周末去了哪里，同事问昨天报警时你在做什么。你需要把大家带回那个过去的现场。',
      child:'讲昨天的故事，可以先说发生了什么，也可以说“公交车到的时候，我还在看地图”。一个交代事情，一个把镜头放进当时的过程。',
      adult:'一般过去时把事件或状态放在过去的时间框架内，可叙述单次事件、过去习惯和持续过一段时间的状态。过去进行时用 was 或 were 加 ing，展示某个过去时刻内部正在展开的活动。一般过去时不意味着这件事对现在毫无影响；时间范围与叙述焦点比中文有没有“了”更重要。',
      steps:['先定位谈话里的过去时段，可能明说，也可能双方已知。','叙述发生的事用一般过去视角；展示当时背景过程时考虑过去进行。','普通动词的否定、提问使用 did 后，后面的动词保持原形。'],
      home:'和孩子讲昨天的一件事，再补一句那件事发生时你正在做什么。',
      work:'复盘昨天的故障：先说报警何时出现，再说当时系统或人员正在做什么。',
      trap:'❌ 一般过去时不是“短动作”，过去进行时也不是“长动作”。I lived there for ten years 可以把十年作为一段过去经历来讲。',
      limits:'过去形式也能表达假设、礼貌等，并非看到过去式就能确定真实过去事件。这里先练叙事；不规则形式如 went、wrote 需要另记。',
      sources:[['British Council：Past continuous and past simple','https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/past-continuous-past-simple'],['British Council：Past tense','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/past-tense']],
      principle:{question:'我是把过去的事当作一个事件讲，还是站在当时看过程？',reason:'同一个过去现场，可以讲“车到了”，也可以讲“车到时我正在看地图”。两种视角让听者分清推进故事的事件与背景。',steps:['找到双方正在谈论的过去时间。','确定本句是在推进故事，还是展示当时进行中的背景。','普通事件核对过去式；背景过程核对 was 或 were 加 ing。','若借 did 提问或否定，后面的普通动词还原。'],boundary:'事件长短不能替你选形式。过去进行通常不交代活动完成与否；一般过去也可描述延续多年的状态。'},
      cases:[
        {label:'过去的一次参观',en:'We visited the museum last Saturday.',zh:'我们上周六参观了博物馆。',parts:[{text:'We',role:'过去做事的人'},{text:'visited',role:'过去发生的事'},{text:'the museum',role:'参观的地方'},{text:'last Saturday.',role:'已过去的时段'}],why:'从现在回头讲上周六的一次经历，visited 把参观作为过去事件陈述；不是在说此刻仍在馆里。',scene:'周一早上，老师问周末做了什么，你回顾上周六已经结束的出游。'},
        {label:'背景中的活动',en:'I was checking the map when the bus arrived.',zh:'公交车到时，我正在看地图。',parts:[{text:'I',role:'当时做事的人'},{text:'was checking',role:'当时进行中的背景活动'},{text:'the map',role:'查看的对象'},{text:'when the bus arrived.',role:'定位过去时刻的事件'}],why:'was checking 表示车到之前查看已经开始，镜头落在查看过程中；arrived 交代车到这个事件。句子不保证车一到查看就永远中止。',scene:'昨天下午三点公交车进站；你在两点五十九分已打开地图，讲述车到的那一刻。'},
        {label:'过去没有发生',en:'She did not send the email yesterday.',zh:'她昨天没有发送那封邮件。',parts:[{text:'She',role:'谈论的人'},{text:'did not',role:'否定过去事件'},{text:'send',role:'原形动词'},{text:'the email',role:'发送的对象'},{text:'yesterday.',role:'限定过去时段'}],why:'did 已经标出过去，后面用 send 而不是 sent。它只否定昨天发送，不保证今天也没发。',scene:'今天上午核对记录：她昨天只写了草稿，今天是否发送还需另查。'}
      ],
      contrasts:[
        {a:'When the phone rang, I was cooking.',b:'When the phone rang, I cooked dinner.',aZh:'电话响时，我正在做饭。',bZh:'电话响后，我做了晚饭。',judgement:'different',reason:'a 把响铃放在已开始的做饭过程中。b 在常见叙事理解下先有响铃，随后开始做晚饭，例如电话通知客人要来；先后关系还需结合上下文，不能只按动词长短判断。'},
        {a:'I lost my keys yesterday.',b:'I have lost my keys.',aZh:'我昨天丢了钥匙。',bZh:'我把钥匙弄丢了。',judgement:'different',reason:'a 把丢失放在昨天，不单靠形式说明现在是否找回。b 通常用来交代当前找不到钥匙等关联。a 也可能与现在有关，只是过去式本身不主动突出这层关联。'}
      ],
      transfer:{prompt:'换成长期过去经历、过去提问，再增加当时的背景。',variants:[
        {label:'很长的过去经历',en:'We lived near the river for five years.',zh:'我们曾在河边住了五年。',parts:[{text:'We',role:'曾居住的人'},{text:'lived',role:'放在过去的状态'},{text:'near the river',role:'曾居住的地点'},{text:'for five years.',role:'那段经历的长度'}],why:'五年也能作为一段过去经历来讲；一般过去不是只装得下几秒钟的动作。此处迁走的事实来自语境。',scene:'一家人2020年搬到河边，2025年迁走；现在回忆那段五年的生活。'},
        {label:'核实过去事件',en:'Did you save the file before lunch?',zh:'你午饭前保存文件了吗？',parts:[{text:'Did',role:'询问过去是否发生'},{text:'you',role:'被询问的人'},{text:'save',role:'原形动词'},{text:'the file',role:'保存的对象'},{text:'before lunch?',role:'过去时段的范围'}],why:'问今天午饭前那一段已经过去的操作。Did 后用 save，不用 saved；问题本身不预设已经保存。',scene:'现在是下午两点，午饭十二点结束，你向同事核实上午的保存操作。'},
        {label:'过去时刻的过程',en:'They were testing the app at nine last night.',zh:'他们昨晚九点正在测试应用。',parts:[{text:'They',role:'当时做事的人'},{text:'were testing',role:'过去时刻的过程'},{text:'the app',role:'测试的对象'},{text:'at nine last night.',role:'过去的参照时刻'}],why:'镜头落在昨晚九点的测试过程中；用 were 配合 They。句子没有交代九点后测试是否成功或何时结束。',scene:'测试从昨晚八点半持续到九点半；复盘时你描述九点截图中的活动。'}]},
      challenge:[
        {id:'past-probe',kind:'probe',prompt:'Which sentence reports the visit as an event on that finished day?',context:'Today is 20 May. Your family visited the aquarium on 12 May and left that afternoon. Write one sentence for the trip diary.',options:[{text:'We have visited the aquarium on 12 May.',why:'在此处普通叙事中，明确已结束的过去日期不与现在完成时这样搭配；要记录该日事件用 visited。'},{text:'We visited the aquarium on 12 May.',why:'✅ 把参观作为5月12日发生的过去事件记录。'},{text:'We are visiting the aquarium.',why:'通常呈现现在正在参观或另有未来安排，不记录已经结束的那次出游。'},{text:'We were visiting the aquarium at noon on 12 May.',why:'这句能自然描述当天中午的背景过程，但题目要把整次参观作为该日事件记录，焦点不同。'}],answer:1,explanation:'不是看到中文“了”才选过去式；先确定本句记录的是一个明确已过去日期里的事件。',translation:'今天5月20日，家人5月12日参观水族馆后已离开。目标句：我们5月12日参观了水族馆。',skill:'past'},
        {id:'past-transfer',kind:'transfer',prompt:'Which sentence places the reader inside the activity at nine?',context:'Yesterday, the team tested the app from 8:30 p.m. to 9:30 p.m. Describe what was happening at 9:00 p.m., rather than summarising the whole test.',options:[{text:'The team tests the app every night.',why:'这是当前习惯，不是昨晚九点那个现场。'},{text:'The team has tested the app.',why:'从现在报告已有测试经历或结果，没有把镜头放回昨晚九点。'},{text:'The team tested the app last night.',why:'这是正确的过去事件概述，但未突出九点时活动处于进行中。'},{text:'The team was testing the app at nine.',why:'✅ 已知测试八点半开始、九点半结束，用过去进行展示九点的内部过程。'}],answer:3,explanation:'两种过去表达可叙述同一晚；本题特别要求展示九点时正在做的背景，因此选 was testing。',translation:'昨晚测试从八点半持续到九点半。目标句：团队九点正在测试应用。',skill:'past'}
      ],nextUse:'讲一个昨天真实发生的小故事，先用一句交代事件，再用一句描绘当时正在做什么。自行画出先后顺序，检查句子是否把同一个现场讲清。'
    },
    {
      id:'perfect',stage:2,order:11,title:'过去怎样连到现在',
      mission:'报告当前结果、截至现在的经历和延续状态',
      intro:'钥匙找不到了、某个游戏玩过几次、在一个地方住到今天。这些话都要交代过去经历与眼前生活的联系。',
      child:'我说“我已经在这儿住了六年”，我可没有搬走呀。我们把以前的日子连到今天，告诉别人现在知道了什么、有什么结果。',
      adult:'现在完成形式是 have 或 has 加过去分词，从现在回看之前的事件或状态：可突出当前结果、截至现在的经历，也可表示延续至今的状态。因此“完成”不是一律做完，也不是中文“已经”的固定翻译。第三人称单数用 has，其余常用 have。过去分词是用在这类组合里的动词形式，规则词常与过去式同形，如 lived；不规则形式如 gone、written 要另记。',
      steps:['先问：要报告过去某日的事件，还是与现在相连的情况？','区分当前结果、到现在的经历、延续至今的状态。','选择 have 或 has 加过去分词；不要把明确结束的昨天直接装进这种普通用法。'],
      home:'告诉家人你到现在为止试过什么，或说明某种状态从何时持续到今天。',
      work:'向同事报告已有多少检查结果；若要记录昨天几点做的操作，改用过去事件叙述。',
      trap:'❌ have done 不总是“事情做完了”。She has lived here for six years 通常说六年住到现在；know 等状态也可持续至今。',
      limits:'现在关联有时来自结果，有时来自经历或持续状态，不能强找一个具体后果。英美用法在 just、already 等场合有差异；本节按常见标准用法练习，不把关键词当作自动选时态器。',
      sources:[['British Council：Present perfect','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/present-perfect'],['British Council：Present perfect simple and continuous','https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/present-perfect-simple-continuous']],
      principle:{question:'我为什么现在要提起这段过去？',reason:'谈过去某天的记录，与交代现在可用的结果、至今的经历或仍在持续的状态，是不同任务。完成视角把参照点放在现在，再回看之前。',steps:['先明确听者现在需要知道的情况。','判断过去与现在的联系是结果、经历还是持续状态。','选 have 或 has 加过去分词，核对不规则形式。','检查时间范围：明确结束的过去日期通常改用过去事件表达；持续范围可用 for 或 since。'],boundary:'不是任何与现在有关的过去事都必须用现在完成时。说话者也能用过去时叙述它，只是焦点不同；完成形式本身不保证动作已经停止。'},
      cases:[
        {label:'眼前需要处理的结果',en:'I have lost my key.',zh:'我把钥匙弄丢了。',parts:[{text:'I',role:'经历这件事的人'},{text:'have',role:'从现在回看的配合词'},{text:'lost',role:'丢失的过去分词'},{text:'my key.',role:'丢失的东西'}],why:'此处说丢失是为了解释现在进不了门。lost 是 lose 的过去分词；句子没有规定丢失发生在几分钟前。',scene:'你刚到家门口，发现唯一的钥匙仍找不到，打电话说明眼前的困难。'},
        {label:'延续至今的状态',en:'She has lived here for six years.',zh:'她在这里已经住了六年。',parts:[{text:'She',role:'谈论的人'},{text:'has',role:'单数主语的完成配合词'},{text:'lived',role:'居住的过去分词'},{text:'here',role:'居住的地点'},{text:'for six years.',role:'持续到现在的长度'}],why:'结合她现在仍住这里的情境，六年从过去延续至今，不表示居住已经做完。for 后面给长度。',scene:'她六年前搬来，现在仍住在同一小区；邻居问她在这里住了多久。'},
        {label:'截至现在的经历次数',en:'We have tried this game twice.',zh:'我们到现在玩过这个游戏两次。',parts:[{text:'We',role:'有经历的人'},{text:'have',role:'连接到现在'},{text:'tried',role:'尝试的过去分词'},{text:'this game',role:'尝试的对象'},{text:'twice.',role:'累计次数'}],why:'把过去两次尝试累积到现在，用来说明我们已有一点经验；没有给两次发生的具体过去日期。',scene:'今天朋友准备带你们玩一款游戏，你说明此前到现在已经试过两次，但并不声称完全精通。'}
      ],
      contrasts:[
        {a:'I lived here for six years.',b:'I have lived here for six years.',aZh:'我曾在这里住了六年。',bZh:'我在这里住了六年了。',judgement:'different',reason:'在通常的住处介绍中，a 把六年作为过去的一段经历，常见于已经迁走的语境；b 更自然地把六年连到现在。具体是否还住这里仍要结合上下文，不把“完成”理解成已经搬走。'},
        {a:'I have repaired the bike.',b:'I have been repairing the bike.',aZh:'我已经把自行车修好了。',bZh:'我这段时间一直在修自行车。',judgement:'different',reason:'a 在当前报修情境中突出修好的结果；b 突出此前持续的修车活动，可能还在修，也可能刚停下来，单靠 b 不保证车已修好。完成进行形式不是“肯定仍在做”。'}
      ],
      transfer:{prompt:'把现在关联迁移到认识时长、尚未完成和人生经历提问。',variants:[
        {label:'仍持续的认识',en:'The child has known her teacher since September.',zh:'这个孩子从九月起就认识她的老师了。',parts:[{text:'The child',role:'谈论的人'},{text:'has',role:'单数主语的完成配合词'},{text:'known',role:'认识的过去分词'},{text:'her teacher',role:'认识的人'},{text:'since September.',role:'持续状态的起点'}],why:'know 在此表示持续的认识状态，通常不说 has been knowing。since 给起点，认识一直延续到当前。',scene:'现在十一月，孩子九月入学认识老师，今天向家人介绍这段持续的关系。'},
        {label:'到现在尚未完成',en:'He has not finished the report yet.',zh:'他到现在还没有写完报告。',parts:[{text:'He',role:'谈论的人'},{text:'has not',role:'否定截至现在的情况'},{text:'finished',role:'完成的过去分词'},{text:'the report',role:'要完成的对象'},{text:'yet.',role:'到目前为止'}],why:'否定的是完成报告这件事到现在尚未发生，不意味着报告一个字也没写。not 放在 has 后。',scene:'下午四点同事在核对可提交的材料；他已经写了大半，但报告仍未完成。'},
        {label:'询问至今的经历',en:'Have you ever ridden a horse?',zh:'你曾经骑过马吗？',parts:[{text:'Have',role:'询问截至现在的经历'},{text:'you',role:'被询问的人'},{text:'ever',role:'到现在任何一次'},{text:'ridden',role:'骑的过去分词'},{text:'a horse?',role:'经历涉及的对象'}],why:'问的是人生至今有没有一次骑马经历，不是在追问某个已知过去日期。ridden 不能机械写成 rode。',scene:'在第一次骑马体验前，教练了解你的既往经历；没有指定是哪一年哪一天。'}]},
      challenge:[
        {id:'perfect-probe',kind:'probe',prompt:'Which sentence most directly presents the missing key as your current problem?',context:'You are outside your home. Your only key is missing and you still cannot find it. You want to explain why you cannot get in, without giving a past date.',options:[{text:'I lose my key every week.',why:'说的是反复习惯，并非眼前这一次造成的当前困难。'},{text:'I lost my key yesterday.',why:'这句可报告真实的过去事件，甚至也可解释当前困难，但额外给了昨天，并把焦点放在过去日期；不符合题目要求。'},{text:'I am losing my key.',why:'把丢失说成当前展开的过程，在此钥匙已经不见的场景不自然，也没有准确交代结果。'},{text:'I have lost my key.',why:'✅ 从现在报告丢失的结果，直接说明此刻找不到钥匙。'}],answer:3,explanation:'选择来自要沟通的焦点：目前无法进门。不是所有过去事件都必须用完成形式；本题明确要突出当前结果且不报过去日期。',translation:'唯一的钥匙仍找不到，你站在家门外进不去。目标句：我把钥匙弄丢了。',skill:'perfect'},
        {id:'perfect-transfer',kind:'transfer',prompt:'Which sentence says the residence began in 2020 and continues now?',context:'Ben moved here in 2020. He still lives here today. State the connection from that starting point to the present.',options:[{text:'Ben lived here in 2020.',why:'这句能说明他2020年住这里，但没有表达从那时持续到现在。'},{text:'Ben has lived here since 2020.',why:'✅ has lived 与 since 的起点共同把居住状态连到现在，符合他至今仍住这里。'},{text:'Ben is moving here tomorrow.',why:'说的是明天搬来的安排，和2020年已搬来且仍居住不同。'},{text:'Ben has lived here yesterday.',why:'普通的现在完成叙述不直接与已结束的 yesterday 这样搭配；而且题目要求从2020年至今。'}],answer:1,explanation:'这里没有“做完居住”。现在完成形式也能表达持续状态；since 给出起点，for 则通常给持续长度。',translation:'本2020年搬来，今天仍住这里。目标句：本从2020年起一直住在这里。',skill:'perfect'}
      ],nextUse:'用英语各说一句：一个影响你当前安排的结果，以及一种从过去持续到今天的状态。自己标出两句与“现在”的联系，别只寻找中文的“已经”。'
    },
    {
      id:'modal',stage:3,order:12,title:'说出能、该、必须与可能',
      mission:'区分能力、建议、许可、义务与不确定判断',
      intro:'同样是让人带一张票，可能是在建议、规定，也可能只是说不用带。用词一变，对方该采取的行动就变了。',
      child:'“你不必带”是可以不带，“你不许带”是不能带。它们可不一样！先想好想让朋友明白什么，再选英语里的小帮手。',
      adult:'can、could、should、must、might 等情态词给事件加上能力、许可、建议、义务或可能性的判断，通常后接动词原形，不因 he 或 she 加 s。否定的含义必须整体判断：must not 常表示禁止，do not have to 表示没有义务。could 在礼貌请求中不一定说过去，情态词也不是中文词的一对一替换。',
      steps:['先决定你在说能力、许可、建议、义务，还是不确定预测。','选择符合语气的表达，再接原形动词。','否定时检查：是不能、不许、不必，还是可能不发生。'],
      home:'把“不必带玩具”和“不许带玩具”分开说，避免孩子把选择理解成禁令。',
      work:'提需求时区分硬性要求与建议；给出理由，让同事知道哪些必须完成、哪些可以选择。',
      trap:'❌ 把 must not 当作“不必”，会把可选项变成禁令。could 用于请求时，也不等于“过去能”。',
      limits:'同一个情态词可能有多种意义；must 还可表达强推断。have to 表达义务但结构不同，需要 does、did 等变化。礼貌程度也受关系、语调和情境影响。',
      sources:[['British Council：Modal verbs','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/modal-verbs'],['British Council：Modals, permission and obligation','https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/modals-permission-obligation'],['British Council：Have to, must and should','https://learnenglishteens.britishcouncil.org/grammar/a1-a2-grammar/have-must-should-obligation-advice'],['Cambridge：Requests','https://dictionary.cambridge.org/us/grammar/british-grammar/requests']],
      principle:{question:'我想改变的是对方的行动选择，还是对事情的判断？',reason:'“会做”“可以做”“建议做”“必须做”“可能发生”把同一件事放进不同的关系。先定这层意思，再决定用词，才能避免把建议说成命令。',steps:['确定是能力、许可、建议、义务，还是可能性。','选择情态词并保留后面的动词原形。','提问时把情态词放到主语前；否定常把 not 放在其后。','特别核对禁止与无义务，以及可能不发生的区别。'],boundary:'have to 是表达义务的重要方式，却不是按所有核心情态词的结构变化。语气的温和程度也不能只按某一个词机械排名。'},
      cases:[
        {label:'表达能力',en:'I can carry this box.',zh:'我能搬这个箱子。',parts:[{text:'I',role:'有能力的人'},{text:'can',role:'表达当前能力'},{text:'carry',role:'原形动作'},{text:'this box.',role:'搬运的对象'}],why:'在试过重量的语境中，can 表示有能力搬动。carry 不加 to，也不因主语变化而加 s。',scene:'你试着抬起一个轻箱子，告诉家人这个你搬得动；并不是在规定谁必须搬。'},
        {label:'提出建议',en:'You should save a copy.',zh:'你应该另存一份。',parts:[{text:'You',role:'收到建议的人'},{text:'should',role:'提出建议'},{text:'save',role:'建议的原形动作'},{text:'a copy.',role:'要保留的副本'}],why:'should 在这里建议更稳妥的做法，语气弱于硬性规定；不代表对方已经保存，也不保证对方一定会做。',scene:'同事准备改动一份重要文档，你建议先保留副本；团队没有硬性制度要求。'},
        {label:'明确禁止',en:'You must not share this password.',zh:'你不得分享这个密码。',parts:[{text:'You',role:'收到要求的人'},{text:'must not',role:'明确禁止'},{text:'share',role:'被禁止的原形动作'},{text:'this password.',role:'不能分享的信息'}],why:'must not 否定许可，表示不允许分享，并不是“可以不分享”。必须根据整段表达理解否定的范围。',scene:'管理员给出某个共用设备的安全要求，明确禁止把访问密码转给其他人。'}
      ],
      contrasts:[
        {a:'You must not bring a laptop.',b:'You do not have to bring a laptop.',aZh:'你不许带笔记本电脑。',bZh:'你不必带笔记本电脑。',judgement:'different',reason:'a 是禁止携带；b 只取消义务，通常仍允许自愿携带。两句都正确，却给对方不同的行动范围。'},
        {a:'Can you open the door?',b:'Could you open the door?',aZh:'你能开一下门吗？',bZh:'能请你开一下门吗？',judgement:'both',reason:'两句都可用于当下请求。b 通常更间接、较客气，并不表示让对方过去开门；a 在熟人间也很自然。是否礼貌还取决于语调、关系与场合。'}
      ],
      transfer:{prompt:'换一个沟通目的：无义务、礼貌请求与不确定预测。',variants:[
        {label:'可以选择不做',en:'You do not have to print the ticket.',zh:'你不必打印这张票。',parts:[{text:'You',role:'有选择的人'},{text:'do not have to',role:'没有这项义务'},{text:'print',role:'可选择的动作'},{text:'the ticket.',role:'打印的对象'}],why:'电子票也可用，所以打印不是必须的；没有禁止自愿打印。have to 的否定使用 do not，与 must not 的意义不同。',scene:'场馆接受手机二维码，也允许纸质票；你解释不打印同样能够入场。'},
        {label:'请求当下帮助',en:'Could you lower the volume, please?',zh:'能请你把音量调低一点吗？',parts:[{text:'Could',role:'较间接地发出请求'},{text:'you',role:'被请求的人'},{text:'lower',role:'请求的原形动作'},{text:'the volume,',role:'调整的对象'},{text:'please?',role:'礼貌用语'}],why:'这里的 Could 请求对方现在调低音量，不在询问过去能力。没有 do，lower 直接保持原形。',scene:'孩子已经入睡，你对正在听音乐的家人提出当下请求，语气柔和。'},
        {label:'不把猜测说成事实',en:'The bus might be late.',zh:'公交车可能会晚点。',parts:[{text:'The bus',role:'判断涉及的事物'},{text:'might',role:'表示不确定可能性'},{text:'be',role:'原形连接词'},{text:'late.',role:'可能出现的情况'}],why:'might 把晚点呈现为一种可能，不保证一定晚点，也不是命令公交车晚点。be 在 might 后保持原形。',scene:'现在路上堵车，但你没有实时车辆位置，向同行人提醒晚点的可能。'}]},
      challenge:[
        {id:'modal-probe',kind:'probe',prompt:'Which sentence accurately explains the optional paper copy?',context:'The office accepts digital tickets. Paper tickets are also allowed, but nobody is required to print one.',options:[{text:'You must print the ticket.',why:'把可选事项说成强制要求，和接受电子票的规定不同。'},{text:'You do not have to print the ticket.',why:'✅ 表示没有打印义务，同时保留自愿打印的选择。'},{text:'You must not print the ticket.',why:'这是禁止打印的自然表达，但该办公室允许纸质票，意义不符。'},{text:'You cannot use a digital ticket.',why:'说不能使用电子票，直接与情境相反。'}],answer:1,explanation:'先分清行动范围：不必做仍可做，不许做则不能做。否定不能只给中文“必须”加一个“不”。',translation:'办公室接受电子票，也允许纸质票，但不强制打印。目标句：你不必打印这张票。',skill:'modal'},
        {id:'modal-transfer',kind:'transfer',prompt:'Which sentence most clearly makes an uncertain prediction?',context:'A parcel is on its way. You have no reliable arrival time. You want to say that arrival today is possible, without claiming certainty or setting a deadline.',options:[{text:'It will arrive today.',why:'这是自然的预测，但通常比此处想表达的“可能”更有把握。'},{text:'It must arrive today.',why:'可表示今天必须到的要求，或依据证据作强推断；都比此处的不确定预测更强。'},{text:'It might arrive today.',why:'✅ 明确留下今天可能到、也可能不到的余地。'},{text:'It arrived today.',why:'陈述已经发生的过去事件；此时包裹仍在途中。'}],answer:2,explanation:'这里需要的是判断的把握程度，不是时间到了就必须选 will。might 保留不确定性。',translation:'包裹在途中，你没有可靠到达时间。目标句：它今天可能会到。',skill:'modal'}
      ],nextUse:'给同一件家事各写一句建议、一句硬性要求和一句“不必做”。自己说明家人听到每句后还有哪些选择；再写一句保留不确定性的预测。'
    },
    {
      id:'questions',stage:3,order:13,title:'问到真正缺的信息',
      mission:'询问是否、具体信息与动作发出者',
      intro:'门开了，但你不知道是谁开的；订单可能发了，但你还没核实。先找出自己不知道的部分，才容易问得准确。',
      child:'我想知道“谁开的”，就把“谁”放在做事人的位置；我想问“姐姐在哪工作”，就保留姐姐，把不知道的地方问出来。先找小空格！',
      adult:'提问先确定未知的是整句真假、动作参与者还是时间地点。普通中性疑问中，已有 be、助动词或情态词时，通常把第一个放到主语前；一般现在、过去的普通动词常借 do、does、did，后接原形。若 who 等本身询问主语，通常直接占主语位置，不为倒装另加 do。',
      steps:['明确未知部分：是否如此、谁做的，还是在何处何时。','先辨认原句里的 be、助动词或情态词，再处理位置。','普通动词需要时借 do、does、did；问主语时另作检查。'],
      home:'向孩子提问时，一次问清一件事：是谁做的，还是某个人做了没有。',
      work:'核实订单、任务和结果时区分“已完成了吗”与“谁完成的”，避免一问包含几个不同问题。',
      trap:'❌ 问句不是把所有动词都搬到前面。Who opened the window? 中 who 已占做事者的位置，通常不额外借 did。',
      limits:'本节讨论普通直接疑问。回声问句、强调问句和间接疑问结构另有条件；Who did open it? 可用于强调，不能一概判错。否定疑问常带预期或惊讶，不只是中性问题加 not。',
      sources:[['British Council：Question forms','https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/question-forms'],['British Council：Questions and negatives','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/questions-negatives'],['Cambridge：Yes-no questions and negative questions','https://dictionary.cambridge.org/grammar/british-grammar/questions-yes-no'],['Cambridge：Yes in answers to negative questions','https://dictionary.cambridge.org/grammar/british-grammar/yes']],
      principle:{question:'这句话里，我真正不知道的是哪一个位置？',reason:'不知道做事的人，与知道人但不知道地点，是两个不同的问题。先定位信息缺口，再用英语的提问惯例组织句子。',steps:['想出一句可能的陈述，并圈出自己不知道的内容。','若问整句是否成立，先找已有的 be、助动词或情态词。','若是普通动词的一般现在或过去，按需借 do、does、did 并保留原形。','若未知内容本来就是主语，让 who 等留在主语位置。'],boundary:'英语并非所有问题都使用同一倒装模式。否定问题含有立场时，要核对自己是否真的想表达这种预期。'},
      cases:[
        {label:'核实眼前是否如此',en:'Are you waiting for the bus?',zh:'你在等公交车吗？',parts:[{text:'Are',role:'把是否在进行拿来询问'},{text:'you',role:'被询问的人'},{text:'waiting',role:'询问的活动'},{text:'for the bus?',role:'等候的对象'}],why:'陈述可以是 You are waiting for the bus；问是否如此，把已有的 are 放在 you 前，不再加 do。',scene:'你在车站看到朋友，但不知道他是等公交还是等人，于是中性核实。'},
        {label:'人已知，地点未知',en:'Where does your sister work?',zh:'你姐姐在哪里工作？',parts:[{text:'Where',role:'未知的工作地点'},{text:'does',role:'协助普通动词提问'},{text:'your sister',role:'已知的做事者'},{text:'work?',role:'原形动词'}],why:'已知问的是姐姐，未知的是工作地点。普通动词 work 用 does 提问后保持原形，不写 works。',scene:'朋友说姐姐换了工作，你知道是谁换工作，但不知道新工作地点。'},
        {label:'不知道谁做了',en:'Who opened the window?',zh:'谁打开了窗户？',parts:[{text:'Who',role:'未知的做事者'},{text:'opened',role:'过去发生的动作'},{text:'the window?',role:'动作涉及的对象'}],why:'Who 直接占原来做事者的位置，opened 保留过去形式。普通中性询问不需要额外加 did。',scene:'你刚进房间，知道窗户刚才被人打开了，但不知道是哪个人做的。'}
      ],
      contrasts:[
        {a:'Who called Lina?',b:'Who did Lina call?',aZh:'谁给莉娜打了电话？',bZh:'莉娜给谁打了电话？',judgement:'different',reason:'a 不知道来电的人，who 是做事者；b 已知莉娜是打电话的人，who 问接电话的对象，所以用 did 加原形 call。交换位置就改变了角色关系。'},
        {a:'Is the door open?',b:"Isn't the door open?",aZh:'门开着吗？',bZh:'门不是开着吗？',judgement:'different',reason:'a 较中性地核实状态；b 常带“我以为开着”的预期、惊讶或提醒。回答 Yes, it is 表示门开着，No, it is not 表示没开，不按中文“是的，你说得对”机械对应。'}
      ],
      transfer:{prompt:'把信息缺口换成过去结果、截至现在的完成情况与原因。',variants:[
        {label:'核实过去结果',en:'Did the test pass?',zh:'那次测试通过了吗？',parts:[{text:'Did',role:'询问过去是否发生'},{text:'the test',role:'谈论的那次测试'},{text:'pass?',role:'原形动词'}],why:'问刚才那次测试是否通过；did 后是 pass，不再加 ed。此处 test pass 是“测试通过”的常用搭配。',scene:'十分钟前自动测试已经结束，你没有看到结果，向同事核实。'},
        {label:'核实到现在的完成情况',en:'Have they finished the puzzle?',zh:'他们把拼图拼完了吗？',parts:[{text:'Have',role:'询问截至现在的情况'},{text:'they',role:'做事的人'},{text:'finished',role:'完成的过去分词'},{text:'the puzzle?',role:'要完成的对象'}],why:'从 They have finished the puzzle 组织问题，只将 have 放到 they 前，finished 不改成 finish，也不额外加 do。',scene:'孩子们下午一直拼拼图，现在该准备晚饭，你核实到此刻是否已完成。'},
        {label:'带情态否定的原因',en:"Why can't we use this entrance?",zh:'我们为什么不能用这个入口？',parts:[{text:'Why',role:'未知的原因'},{text:"can't",role:'询问不能的原因'},{text:'we',role:'涉及的人'},{text:'use',role:'原形动词'},{text:'this entrance?',role:'不能使用的入口'}],why:'情境已经告知不能使用，问题转而追问原因。can 的否定缩写放到 we 前，use 保持原形，不加 do。',scene:'工作人员刚拦住你们并说入口不开放，你接受这个限制，但想知道原因。'}]},
      challenge:[
        {id:'questions-probe',kind:'probe',prompt:'Which neutral question asks for the sender?',context:'A message was sent yesterday. You know that someone sent it, but you do not know who. Ask about that person, not the recipient or a current action.',options:[{text:'Who sent the message?',why:'✅ who 占未知发送者的位置，直接询问昨天是谁发的。'},{text:'Who did you send the message to?',why:'这是自然的问题，但问的是你发给谁，即接收者，不是未知发送者。'},{text:'Did you send the message?',why:'核实特定的你是不是发送者，通常以是或否回答；未直接请求对方给出未知发送者。'},{text:'Who is sending the message?',why:'问当前进行中的发送者，而情境中的发送发生在昨天。'}],answer:0,explanation:'先判断谁是未知角色。问做事者时，who 就放在做事者的位置，不用把它误当接收者。',translation:'昨天有人发出一条消息，你不知道发送者。目标句：谁发了那条消息？',skill:'questions'},
        {id:'questions-transfer',kind:'transfer',prompt:'Which question checks whether the order has been shipped by now?',context:'You are discussing one order that needs to leave soon. You have no information about its shipping status. Ask neutrally about completion up to the present.',options:[{text:'Did you ship the order yesterday?',why:'这是合理的过去问题，但限定昨天；即使昨天没发，今天也可能已经发了。'},{text:'Are you shipping the order tomorrow?',why:'问明天的安排，不核实到现在是否已经发出。'},{text:'Do you ship orders every Friday?',why:'问发货惯例，换成了复数 orders，也没有核实这一单。'},{text:'Have you shipped the order yet?',why:'✅ 用已有的 have 置于主语前，核实这一单截至现在是否已发出。'}],answer:3,explanation:'问题要对准信息缺口：这一单到现在发了没有，而非昨天是否发、明天是否发或通常何时发。',translation:'有一单需要尽快发走，你尚不知状态。目标句：你已经把这单发出去了吗？',skill:'questions'}
      ],nextUse:'针对同一件真实小事写三个英语问题：是否发生、谁做的、在哪里做的。自己用可能的回答检查：回答的是不是你真正想知道的信息。'
    },
    {
      id:'passive',stage:3,order:14,title:'先说我们关心的对象',
      mission:'围绕受影响的事物报告过程与结果',
      intro:'你关心的是桥修到哪里、报告是谁写的，不一定每次都先讲施工队或作者。选择句子的起点，能让话题接得更顺。',
      child:'大家都在问这座桥，我们就先说“桥”。桥不会自己盖自己哦！还要说清楚：它正在建，还是已经建好了。',
      adult:'被动表达通常把动作涉及的对象作为句子主语，让它成为话题起点；常见结构是 be 加过去分词，施事者需要时用 by 引出。时态和视角仍须区分：is being built 展示当前施工过程，has been built 在此突出已建成的当前结果。过去分词本身不等于过去时间，被动也不等于遭受坏事。',
      steps:['先判断听者正在关心谁或什么，再选句子的起点。','用合适的 be 结构加过去分词，明确过程、结果与时间。','只有需要指出动作发出者时才补 by，不编造未知责任人。'],
      home:'围绕自行车或家具说明正在维修还是已修好，让家人知道现在能不能使用。',
      work:'围绕订单、报告或版本报告状态；需要明确责任人时保留作者或执行者，避免用被动掩盖重要信息。',
      trap:'❌ The bridge is being built 与 The bridge has been built 不同。前者施工中，后者在普通建桥语境中说已经建成，不能因为都有 built 就当成同一进度。',
      limits:'不是所有动词都能随便变被动；此处先练能带对象的常见动作。be 加过去分词有时也可描述状态，如 closed，需要结合上下文区分，不只按外形贴标签。',
      sources:[['British Council：Passives','https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/passives'],['British Council：Active and passive voice','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/active-passive-voice'],['British Council：Advanced passives review','https://learnenglish.britishcouncil.org/free-resources/grammar/c1/advanced-passives-review']],
      principle:{question:'这次对话最需要从谁或什么说起？',reason:'主动表达常从做事者开始；被动表达能让已在谈论的对象留在句首。换话题起点之后，仍要准确交代动作的时间和进度。',steps:['先明确谁做了什么，以及动作影响谁或什么。','若想围绕受影响对象继续谈，将它放在主语位置。','按要说的过程或结果组成 be 加过去分词的结构。','若动作发出者重要，用 by 补充；不重要或未知时可不说。'],boundary:'话题选择并不是唯一因素，文体与固定搭配也有影响。完成被动不一律表示永久结束，具体结果要看动词意义；本节 built 的建造目标可视为完成。'},
      cases:[
        {label:'围绕桥说明施工中',en:'The bridge is being built.',zh:'这座桥正在建设中。',parts:[{text:'The bridge',role:'先谈论受影响的桥'},{text:'is being',role:'当前进行中的被动结构'},{text:'built.',role:'建造的过去分词'}],why:'桥是被建造的对象，is being 把当前时段放在施工过程中。built 的外形不能让本句变成“过去建完”。',scene:'场景甲：村口新桥上仍有工人在施工，今天还不能通行，你报告眼前进度。'},
        {label:'围绕桥说明已建成',en:'The bridge has been built.',zh:'这座桥已经建成。',parts:[{text:'The bridge',role:'先谈论受影响的桥'},{text:'has been',role:'连接当前结果的被动结构'},{text:'built.',role:'建造的过去分词'}],why:'在这里把建桥作为已经实现的结果报告。has been built 不是 is being built；是否通过验收、是否开放还要另行核实。',scene:'场景乙：另一座桥本周完成建设，你向邻居报告建造结果；尚未讨论开放日期。'},
        {label:'作者值得说明',en:'The report was written by Mei.',zh:'这份报告是梅写的。',parts:[{text:'The report',role:'对话里的报告'},{text:'was written',role:'过去被完成的写作动作'},{text:'by Mei.',role:'补充写作的人'}],why:'先沿用大家正在讨论的报告，再用 by Mei 说明作者。written 是 write 的过去分词，不能用 wrote 替换。',scene:'周五评审一份周四已写好的报告，大家问这份报告的作者是谁。'}
      ],
      contrasts:[
        {a:'The bridge is being built.',b:'The bridge has been built.',aZh:'桥正在建设中。',bZh:'桥已经建成。',judgement:'different',reason:'a 展示当前施工过程，不保证建成；b 在此建桥语境中呈现已建成的当前结果。两句都以桥为话题，也都用 built，但进行与完成的配合词改变了进度信息。'},
        {a:'Mei wrote the report.',b:'The report was written by Mei.',aZh:'梅写了这份报告。',bZh:'这份报告是梅写的。',judgement:'both',reason:'两句可描述同一次写作。a 从梅说起，适合介绍她做了什么；b 从报告说起，适合接着报告话题说明作者。被动并不自动比主动正式、客观或更好。'}
      ],
      transfer:{prompt:'换成发送、维修与要求，仍保留对象、进度和含义。',variants:[
        {label:'多件对象的当前结果',en:'The tickets have been sent.',zh:'票已经发出。',parts:[{text:'The tickets',role:'复数的已知话题'},{text:'have been',role:'连接当前结果的被动结构'},{text:'sent.',role:'发送的过去分词'}],why:'谈论的票已经发出；tickets 是复数，所以用 have。它不保证接收者已经阅读或收到所有通知。',scene:'你刚向家人发送完全部电子票，现在报告发出的结果，不再介绍是谁点的发送。'},
        {label:'当前维修过程',en:'The lift is being repaired.',zh:'电梯正在维修中。',parts:[{text:'The lift',role:'受影响的电梯'},{text:'is being',role:'当前进行中的被动结构'},{text:'repaired.',role:'维修的过去分词'}],why:'电梯接受维修，活动当前仍在进行。若说 has been repaired，通常会让人理解为维修已经完成。',scene:'维修人员正在工作，电梯现在不能使用，物业向住户解释。'},
        {label:'对象需要保持的状态',en:'This gate must be kept closed.',zh:'这道门必须保持关闭。',parts:[{text:'This gate',role:'规定涉及的门'},{text:'must',role:'明确要求'},{text:'be kept',role:'原形被动结构'},{text:'closed.',role:'要维持的状态'}],why:'must 后接原形 be，kept 表示这道门要被人保持在关闭状态；不是宣称门已经关好。',scene:'管理人员对储物区门的使用提出明确要求，要求使用后继续保持关闭。'}]},
      challenge:[
        {id:'passive-probe',kind:'probe',prompt:'Which notice reports the repair currently in progress?',context:'Workers started fixing the lift this morning. They are still working on it, and residents cannot use it yet.',options:[{text:'The lift has been repaired.',why:'通常表示维修已完成的当前结果，与仍在修且不能用的重点不符。'},{text:'The lift will be repaired tomorrow.',why:'把维修放到明天，而实际今天已经开始且正在进行。'},{text:'The lift is being repaired.',why:'✅ 以电梯为话题，明确当前处于被维修的过程。'},{text:'The lift was repaired last year.',why:'可以自然报告去年的维修，但没有说明眼前这次正在进行的维修。'}],answer:2,explanation:'is being repaired 同时保留电梯作为话题与维修正在进行的信息；不是看到 repaired 就判断已修好。',translation:'工人今天早晨开始修电梯，现在仍在修，住户还不能用。目标句：电梯正在维修中。',skill:'passive'},
        {id:'passive-transfer',kind:'transfer',prompt:'Which update keeps the messages as the topic and reports the completed sending?',context:'All five messages were sent a moment ago. None is still waiting to be sent. Report the result now, starting with "The messages".',options:[{text:'The messages have been sent.',why:'✅ 以 messages 为话题，用完成被动报告发送结果已实现。'},{text:'The messages are being sent.',why:'这是自然的过程表达，但呈现为还在发送中，与全部刚刚发完不符。'},{text:'The messages will be sent tomorrow.',why:'说的是明天的安排，与此刻已经发出相反。'},{text:'The messages were sent yesterday.',why:'过去被动结构正确，但把发送放到昨天，和刚刚发出的事实不同。'}],answer:0,explanation:'这里有两项要求：话题仍是消息，而且发送已全部完成。have been sent 同时交代这两项。',translation:'五条消息刚刚全部发出，没有待发消息。目标句：消息已经发出。',skill:'passive'}
      ],nextUse:'选一件家里或工作中真实受到处理的物品，分别说“正在处理”和“已经处理好”。再改成从做事者开始的句子，自己核对进度与责任人有没有被改掉。'
    },
    {
      id:'future',stage:3,order:15,title:'把将来安排说明白',
      mission:'区分临时提议、已有打算、约定和时刻表',
      intro:'你临时答应帮忙，家里已有春天的计划，也和老师约好了见面。它们都在未来，却需要让对方知道安排有多确定、从哪里来。',
      child:'“我来帮你！”像刚举起小手；“我打算种花”是心里早有计划；“明天四点见老师”可能已经约好了。先想自己要告诉别人哪一种。',
      adult:'英语可以用多种结构谈未来：will 常用于当下决定、提议、承诺和预测；be going to 常突出已有意图或眼前依据；现在进行式常呈现已安排的未来活动，一般现在式常用于固定时刻表。它们有重叠，不是每个未来事件只有一个合法形式。选择要表达的立场与安排，再用时间语境帮助听者理解。',
      steps:['先分清：当下提议、已有意图、已约安排、时刻表，还是预测。','选择最能表现这层意思的结构，并说明必要的时间。','检查其他形式是否也可用；可用时解释侧重点，不乱判成语法错误。'],
      home:'和家人说清周末是刚想到的建议、已有打算，还是已经订票并约好的安排。',
      work:'说版本计划时区分自己的打算、已协调的安排与对结果的预测，别把预测听起来像保证。',
      trap:'❌ 中文出现“将来”就只填 will。I am meeting the teacher tomorrow 可以说未来安排，并不是声称此刻已经在见老师。',
      limits:'这些形式常有交叠，不能只凭 tomorrow 断定一种答案。will 的预测也不保证事实一定发生；本节只练常见立场，不声称穷尽所有未来表达。',
      sources:[['British Council：Future forms, will, be going to and present continuous','https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/future-forms-will-be-going-present-continuous'],['British Council：Present simple and future time','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/present-simple'],['Cambridge：Future, be going to','https://dictionary.cambridge.org/grammar/british-grammar/future-going-to']],
      principle:{question:'我想让听者把未来这件事理解成哪一种安排或判断？',reason:'未来事情尚未发生，但说话者现在已能表明：这是即时提议、已有意图、已约好的活动还是根据证据作的预测。形式承载这层立场，不只指日期。',steps:['确定未来事件与当前的决定、证据或约定有什么关系。','临时提议可用 will，已有意图可用 be going to。','已安排活动可用现在进行式；固定时刻表可用一般现在式。','补充必要时间，再检查语气是否把预测说得过满。'],boundary:'这些是常见倾向，不是互相排斥的硬盒子。多个形式都合理时，应比较表达重点；未来时间还可由上下文体现。'},
      cases:[
        {label:'当下提出帮忙',en:'I will carry the bag for you.',zh:'我来帮你拿包。',parts:[{text:'I',role:'当下提出行动的人'},{text:'will',role:'提出意愿与即时帮助'},{text:'carry',role:'原形动作'},{text:'the bag',role:'要拿的东西'},{text:'for you.',role:'受帮助的人'}],why:'这里看到对方腾不开手，现场提出帮忙；will 把行动呈现为当下的主动提议，不只是给未来贴时间标签。',scene:'门口朋友双手抱着物品，你刚看到这个情况，马上提出帮他拿包。'},
        {label:'此前已有打算',en:'We are going to plant herbs this spring.',zh:'我们打算今年春天种香草。',parts:[{text:'We',role:'有计划的人'},{text:'are going to',role:'表达已有意图'},{text:'plant',role:'原形动作'},{text:'herbs',role:'种植的对象'},{text:'this spring.',role:'计划的时段'}],why:'are going to 加原形 plant 表达此前已有的计划，不表示此刻正往种植地点走。计划也不等于保证一定实现。',scene:'假设现在是二月，全家上周已经讨论春天的种植计划，今天向朋友介绍，还没有约定具体种植日。'},
        {label:'已经约好的活动',en:'I am meeting the teacher at four tomorrow.',zh:'我明天四点要见老师。',parts:[{text:'I',role:'参加约见的人'},{text:'am meeting',role:'呈现已安排的活动'},{text:'the teacher',role:'约见的对象'},{text:'at four tomorrow.',role:'约定的未来时点'}],why:'现在进行形式在明天的时间语境里表示已安排的约见，不是眼前正在见面。这个用法把安排已落实的侧重点说出来。',scene:'你与老师已经确认明天下午四点在学校见面，今天向家人说明行程。'}
      ],
      contrasts:[
        {a:'I will cook tonight.',b:'I am going to cook tonight.',aZh:'今晚我来做饭。',bZh:'我打算今晚做饭。',judgement:'both',reason:'两句都可谈今晚做饭。a 在分配家务时可呈现即时提议，也可作承诺；b 常强调已有意图。具体语境可让它们很接近，不能说提前计划就绝对禁用 will。'},
        {a:'We are meeting at six.',b:'We meet at six.',aZh:'我们约好六点见面。',bZh:'我们六点见面。',judgement:'different',reason:'a 常把某次未来会面呈现为已安排活动；b 可介绍固定日程或惯例，明确的既定行程中也能谈未来。若无上下文，b 的时间范围更需核实，不是句子本身错误。'}
      ],
      transfer:{prompt:'把未来意义迁移到时刻表、眼前证据和时间从句。',variants:[
        {label:'固定时刻表',en:'The train leaves at seven tomorrow.',zh:'火车明天七点发车。',parts:[{text:'The train',role:'有固定班次的列车'},{text:'leaves',role:'时刻表上的安排'},{text:'at seven tomorrow.',role:'未来发车时点'}],why:'一般现在形式可陈述固定班次，tomorrow 定位未来；不能看到 leaves 就断定这是此刻正在发车。',scene:'你查看明天的正式列车时刻表，向家人说明七点这一班的发车时间。'},
        {label:'根据眼前依据预测',en:'It is going to rain.',zh:'要下雨了。',parts:[{text:'It',role:'天气表达的形式主语'},{text:'is going to',role:'基于当前迹象的预测'},{text:'rain.',role:'将出现的天气'}],why:'看见当前的乌云后作预测，going to 不只表达人的计划。它传达当前依据，但仍不是天气必然发生的逻辑证明。',scene:'你站在窗边看到乌云逼近、天色变暗，提醒家人先收衣服，此刻还没有下雨。'},
        {label:'到达后再联系',en:'I will call you when I arrive.',zh:'我到了就给你打电话。',parts:[{text:'I',role:'作出承诺的人'},{text:'will call',role:'将采取的行动'},{text:'you',role:'联系的对象'},{text:'when I arrive.',role:'说明未来行动的时间条件'}],why:'主句用 will 作承诺；这里 when 引导未来时间从句，通常用 arrive 而不是机械再加 will。若问“何时会到”则是另一种结构。',scene:'你出门去车站，向家人承诺到站后联系；到达和打电话都还未发生。'}]},
      challenge:[
        {id:'future-probe',kind:'probe',prompt:'Which reply most clearly presents an offer made right now?',context:'A friend suddenly drops several books. You see the problem and immediately offer your help. You had no earlier plan about this.',options:[{text:'I am going to help you.',why:'可以表达即将帮助的意图，某些现场也能自然使用；但比起 will，没有同样直接地把话呈现为即时主动提议。'},{text:'I will help you.',why:'✅ 在这个突然出现的情境中，最直接地作出当下帮忙的提议。'},{text:'I helped you yesterday.',why:'回顾昨天的帮助，不是在眼前提供帮助。'},{text:'I help you every Friday.',why:'介绍定期帮助的习惯，不是此次临时提议。'}],answer:1,explanation:'本题选择最能体现“现在提出帮忙”的表达，不声称 going to 在所有现场都错。未来形式还表达说话者的立场。',translation:'朋友突然掉了几本书，你当场提出帮助。目标句：我来帮你。',skill:'future'},
        {id:'future-transfer',kind:'transfer',prompt:'Which sentence most clearly presents the confirmed appointment as an arrangement?',context:'Yesterday, you booked a dental appointment for your family. The clinic confirmed tomorrow at ten. Tell your partner about this settled plan.',options:[{text:'We saw the dentist yesterday.',why:'说昨天已经看过牙医；昨天实际只是预约，时间不符。'},{text:'We see the dentist every Tuesday.',why:'介绍每周二的习惯，情境没有提供这种固定频率。'},{text:'We will see the dentist at ten tomorrow.',why:'这句可正确谈未来就诊，也可能在上下文中指该预约；但形式本身没有同样突出预约已安排好的重点。'},{text:'We are seeing the dentist at ten tomorrow.',why:'✅ 结合已确认的时间，以现在进行形式清楚呈现已安排的未来就诊。'}],answer:3,explanation:'这里强调已有确认的安排，因而进行形式最贴切；其他未来形式可能也成立，不能把侧重点差异一概判成语法错误。',translation:'你昨天预约，诊所确认明天十点接诊。目标句：我们明天十点去看牙医。',skill:'future'}
      ],nextUse:'向家人用英语说一个刚作出的提议、一个已有打算和一个真正确认过的约定。自行核对事实，不把“我希望”说成“已经约好”；也可说明其他形式为何仍可能成立。'
    }
  ];
  r.EnglishPathData = r.EnglishPathData || [];
  r.EnglishPathData.push(...lessons);
})(typeof window !== 'undefined' ? window : globalThis);
