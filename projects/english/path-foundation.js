(function(r){
  'use strict';
  // 例句为本课程原创；资料链接用于核对用法，不为具体场景台词背书。
  const example = (label,en,zh,parts,why,scene) => ({label,en,zh,parts:parts.map(([text,role])=>({text,role})),why,scene});
  const lessons = [
    {
      id:'meaning',stage:0,order:0,title:'先有意思，再找句子',
      mission:'把需要、状态和请求说得让对方听懂。',
      intro:'玩具卡住了、口渴了、有人准备出门了。你最想让对方知道哪一件事？',
      child:'先在脑袋里放一段小电影：我想说谁？他怎么啦？我想请别人做什么？英语词语是帮你把电影放给别人看，不是把中文一个字一个字搬过去。',
      adult:'表达从交际任务开始：报告事情、描述状态、提出请求。普通完整陈述通常围绕一个主语和动词展开；主语是句子谈论的对象，不保证是动作执行者。真实对话也使用省略片段，祈使句通常不明说 you。这是选择表达的起点，不是能推出所有英语用法的万能公式。',
      steps:['先说清自己要报告、描述还是请求。','把信息分成谈论对象、核心意思和必要补充。','读给具体的人听，检查他能否知道下一步做什么。'],
      home:'喝水前先想：我要报告杯子空了，还是请家人给我一点水？目的不同，句子也可以不同。',
      work:'发消息前先选一个任务：报告打印机缺纸、请求同事加纸，或说明自己会去处理。别把三个目的挤成一团。',
      trap:'认识每个单词，不等于知道整句话在做什么；也不要把主语机械等同于“干活的人”。',
      limits:'本课先处理短陈述和礼貌请求。招牌、标题、聊天片段可以不具备完整陈述的形式；能在场景中理解，不代表适合所有正式写作。',
      sources:[['British Council：句子的组成与动词搭配','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/clause-structure-verb-patterns'],['Cambridge：小句和句子','https://dictionary.cambridge.org/us/grammar/british-grammar/clauses-and-sentences']],
      principle:{
        question:'为什么先问“我要让对方知道什么”，再挑单词？',
        reason:'同一场景可以有不同目的。杯子空了是状态，我想喝水是需要，请递水是请求；若目的没选好，词都对也可能让对方做错事。',
        steps:['选定听话的人和眼前的场景。','选定一个核心目的：告诉他，还是请他行动。','陈述先找谈论对象和动词；请求可以从 Please 加动作开始。','再补对方必需的信息，不为凑句型塞进无关词。'],
        boundary:'这是表达策略。具体用哪个动词、动词后面接什么仍要学习约定；逻辑清楚不能代替词汇搭配。'
      },
      cases:[
        example('报告需要','Mia needs water.','米娅需要水。',[['Mia','谈论谁'],['needs','说出需要'],['water.','需要什么']],'不是只喊出 water，而是说明谁需要它。needs 是这句的动词；它表达需要，不必是看得见的动作。','下午做完手工，米娅口渴；爸爸告诉正在厨房的妈妈。'),
        example('描述状态','The door is open.','门开着。',[['The door','谈论哪样东西'],['is','把门和状态连起来'],['open.','门现在的状态']],'这句让对方知道门的状态，并未直接命令关门。is 在这里连接对象和状态。','晚上出门前，你看到大家都知道的那扇门还开着，提醒家人检查。'),
        example('直接请求','Please sit here.','请坐这里。',[['Please','礼貌地开口'],['sit','请对方做的动作'],['here.','坐在哪里']],'这是向眼前的人发出请求，通常不用说出 you。不能因为没有明说主语，就把它判成无效英语。','客人刚到家，你指着为他准备好的椅子，请他坐下。')
      ],
      contrasts:[
        {a:'I am cold.',b:'It is cold.',aZh:'我觉得冷。',bZh:'天气冷／这里冷。',judgement:'different',reason:'两句都能成立。前句报告自己的感受，后句通常报告天气或环境；听话的人要不要给你外套，取决于你真正想说哪件事。'},
        {a:'I need water.',b:'Water, please.',aZh:'我需要水。',bZh:'请给我水。',judgement:'both',reason:'前句是完整的需要陈述，后句是有场景支撑的礼貌片段，在点单时很自然。片段不适合被当作所有书面句子的通用结构。'}
      ],
      transfer:{prompt:'从“报告需要”换到“请求帮助”“报告位置”“说明分工”，看看表达目的怎样改变。',variants:[
        example('请求帮助','Please help me.','请帮帮我。',[['Please','礼貌地开口'],['help','请求帮助'],['me.','谁需要帮助']],'先选请求的目的，再说明帮助的对象。me 在这里指说话的人。','孩子的积木盒打不开，正面对爸爸求助。'),
        example('报告位置','Your bag is here.','你的包在这里。',[['Your bag','谈论哪个包'],['is','把包和位置连起来'],['here.','所在的位置']],'这句报告包的位置，并不表示让别人把包送过来。','早晨妻子在找包，你在玄关看到了，告诉她。'),
        example('说明分工','I check the report.','我负责检查这份报告。',[['I','说明谁负责'],['check','负责做什么'],['the report.','检查的对象']],'在说明现行分工时，check 表示职责。这句不自动说明检查此刻正在进行。','团队例会上，大家介绍固定职责，你说明自己检查报告。')
      ]},
      challenge:[
        {id:'meaning-probe',kind:'probe',prompt:'Choose the request for help.',context:'Your toy box is stuck. You want Dad to open it with you.',options:[{text:'Please help me.',why:'直接向爸爸求助，表达目的与眼前困难吻合。'},{text:'I can help you.',why:'这是说“我能帮你”，英语成立，但帮助的方向反了。'},{text:'Please me help.',why:'想表达请求时，不能把 me 放在 help 前面充当动作。'},{text:'I help please you.',why:'这些词的组合没有形成此处要用的自然请求；可改为 Please help me。'}],answer:0,explanation:'先确定谁需要帮助、希望谁行动，再选请求。这里孩子需要爸爸帮忙，Please help me 把方向说清楚。',translation:'请选择求助的话。场景：你的玩具盒卡住了，希望爸爸和你一起打开。',skill:'meaning'},
        {id:'meaning-transfer',kind:'transfer',prompt:'Choose the message that reports the printer problem.',context:'The printer has no paper. Tell a coworker what it needs.',options:[{text:'I need the printer.',why:'意思是你需要使用打印机，可以成立，但没有报告缺纸。'},{text:'The printer needs paper.',why:'以打印机为谈论对象，说清缺的是什么，符合报告问题的目的。'},{text:'Please print the paper.',why:'这是请别人打印，可能是正常请求，却没有说明打印机需要加纸。'},{text:'Paper needs the printer.',why:'结构看起来整齐，却把纸说成需要打印机的一方，意思不合场景。'}],answer:1,explanation:'英语句子不能只检查词形和顺序，还要检查谁需要什么。打印机缺纸，因此报告 The printer needs paper。',translation:'请选择报告打印机问题的消息。场景：打印机没有纸了，请告诉同事它需要什么。',skill:'meaning'}
      ],
      nextUse:'选一件家里或工作中的小事，先用中文说明“我想让谁知道什么／做什么”，再试着写一句英语。自己检查目的是否明确；本页不会自动判断自由表达的对错。'
    },
    {
      id:'order',stage:0,order:1,title:'词序：谁对谁做什么',
      mission:'讲清楚动作方向，避免把帮助者和被帮助者说反。',
      intro:'一只小狗追着孩子跑，转眼孩子又追着小狗跑。词还是那些词，故事却变了。',
      child:'把名字当成小演员，把动词当成正在演的事情。谁站前面、谁在后面，常常决定谁追谁。换位置以前，先看看小电影有没有被你倒放啦。',
      adult:'普通主动陈述中，主语通常在动词前，动词所涉及的对象常在其后；有些动词无需对象，有些还需要地点等成分。词序有助于标出关系，但英语并非所有句子都必须“主语＋动词＋宾语”：疑问、祈使、被动与强调另有结构，主语也不总是动作发出者。',
      steps:['圈出动词，先确认这件事怎样发生。','确定此句的主语，以及动词后需要的对象或其他信息。','换人或移动时间地点后，再核对动作方向和自然词序。'],
      home:'分别说“哥哥帮妹妹”和“妹妹帮哥哥”，用玩偶演出来，检验词序有没有改变人物关系。',
      work:'写“谁把什么发给谁”时，先核对发送者、文件和接收者，尤其不要把客户写成发送方。',
      trap:'三个熟词排在一起不保证意思对；也不能因为看到了三个成分，就把最后一个全部叫作宾语。',
      limits:'本课用普通主动陈述练基础顺序。某些成分可以前移以强调，但不能据此随意倒置；特定动词需要的成分要随词学习。',
      sources:[['British Council：动词决定句子需要什么成分','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/clause-structure-verb-patterns'],['Cambridge：常见词序与强调词序','https://dictionary.cambridge.org/grammar/british-grammar/word-order-and-focus_2']],
      principle:{question:'同样的几个词，为什么换位置会改变意思？',reason:'英语常用位置告诉听者各部分怎样相连。在普通主动句中，动词前后的两个人通常承担不同角色。时间、地点却可能有多个自然位置，不能把所有换位都看成同一种事。',steps:['先定动作：help、follow、send 或 put。','把此句要谈的人放在主语位置。','按这个动词的用法补对象；需要地点时也补上。','最后放时间地点，并检查移动有没有改变强调或关系。'],boundary:'这是常见句式的使用说明，不是“英语只能这样排”的定律。被动中的主语可承受动作；本课暂不展开。'},
      cases:[
        example('跟随方向','The puppy follows Ben.','小狗跟着本。',[['The puppy','这句的主语'],['follows','发生的事情'],['Ben.','跟着谁']],'follows 前是小狗，后是本，表示小狗跟着本走。换成人名在前，跟随的方向就变了。','介绍平常放学后的路线：本通常往小区门口走，小狗跟在他身后。'),
        example('不必硬找对象','The baby smiles.','宝宝笑了。',[['The baby','谈论的宝宝'],['smiles.','宝宝的表现']],'smile 在这里不需要再接“笑什么”，这句话已经完整。不要为了套三个位置而随便加一个名词；这里采用图画故事的现在时讲述。','亲子读图画书，你指着这一格画面：家人一逗宝宝，宝宝露出笑容，用现在时讲述故事。'),
        example('动作需要位置','We put the coats on the chair.','我们把外套放在椅子上。',[['We','放外套的人'],['put','放置的动作'],['the coats','放什么'],['on the chair.','放在哪里']],'这里 put 不仅要说放什么，还要交代放在哪里。on the chair 是位置，不能当作第二件被放的物品。','进门后，你和孩子把外套放到椅子上，向家人复述通常的收纳步骤。')
      ],
      contrasts:[
        {a:'The dog follows Sam.',b:'Sam follows the dog.',aZh:'狗跟着萨姆。',bZh:'萨姆跟着狗。',judgement:'different',reason:'两句都符合普通主动陈述的顺序，但主语和对象交换后，谁跟谁就反了。语法通顺不等于忠实描述了现场。'},
        {a:'On Mondays, we check the lights.',b:'We check the lights on Mondays.',aZh:'每逢周一，我们检查灯。',bZh:'我们每逢周一检查灯。',judgement:'both',reason:'两句都自然，检查的主体和对象没有变。时间放前面先设定场景，放后面则先说检查这件事；不能由此推出所有成分都能随意移动。'}
      ],
      transfer:{prompt:'换掉行动者、动作需要的信息或使用场合，保持关系清楚。',variants:[
        example('交换人物','Ben follows the puppy.','本跟着小狗。',[['Ben','这句的主语'],['follows','发生的事情'],['the puppy.','跟着谁']],'与主例的角色反过来：这次是本跟在小狗后面，词序必须跟着意思调整。','介绍每周日的散步习惯：小狗通常先往草地走，本在后面慢慢跟着。'),
        example('说明接收方','I send the file to Lin.','我把文件发给林。',[['I','发送者'],['send','发送的动作'],['the file','发送什么'],['to Lin.','发给谁']],'to Lin 把接收方说清楚。在这句的分块里，它是介词短语，不与直接放在动词后的文件混为一谈。','介绍团队的固定交接流程时，你说明文件由你发送给林。'),
        example('先放场景','After dinner, we read together.','晚饭后，我们一起读书。',[['After dinner,','先说明时间'],['we','谁一起读'],['read','所做的事情'],['together.','一起进行']],'read 在这里可以不说明读哪本书。时间放开头不会把 dinner 变成读书的人。','家长介绍每天晚饭后的家庭阅读安排，不是在报告此刻的动作。')
      ]},
      challenge:[
        {id:'order-probe',kind:'probe',prompt:'Choose the sentence that matches the scene.',context:'Nora helps her brother with a puzzle. Her brother receives the help.',options:[{text:'Her brother helps Nora.',why:'这句英语成立，但它说哥哥帮助诺拉，帮助方向与场景相反。'},{text:'Nora helps her brother.',why:'诺拉在主语位置，哥哥在 helps 后，准确表达谁帮助谁。'},{text:'Helps Nora her brother.',why:'这里要普通陈述，不能把 helps 随意放到主语前。'},{text:'Nora her brother helps.',why:'不是本场景下自然的普通陈述顺序；应先放 Nora，再放 helps。'}],answer:1,explanation:'在这个普通主动句中，帮助者 Nora 放在 helps 前，接受帮助的人放在后。先核对事件方向，再核对词序。',translation:'请选择符合画面的句子。场景：诺拉帮哥哥拼图，哥哥得到帮助。',skill:'order'},
        {id:'order-transfer',kind:'transfer',prompt:'Choose the clear instruction for the storage task.',context:'The team needs to move the spare keyboard into the drawer. Tell them where to put it.',options:[{text:'Put the drawer on the keyboard.',why:'作为指令可以理解，却变成把抽屉放到键盘上，物品和位置反了。'},{text:'The keyboard is in the drawer.',why:'是有效的状态陈述，说键盘已经在抽屉里，没有发出本题所需的放置指令。'},{text:'Put the keyboard in the drawer.',why:'先说放什么，再用 in the drawer 指明放到哪里，完成收纳指令。'},{text:'Put in the keyboard the drawer.',why:'没有按这里 put 的自然结构把物品和地点连接起来。'}],answer:2,explanation:'put 在这条放置指令中需要“物品＋去处”。指令通常省去 you，不能强行在前面补一个人名才算句子。',translation:'请选择清楚的收纳指令。场景：团队要把备用键盘放进抽屉，请告诉他们放在哪里。',skill:'order'}
      ],
      nextUse:'拿一对人物和一个动作，写两句交换人物的英语，分别画出箭头。再写一句带地点的放置指令，自查“放什么、放哪里”是否齐全；不依赖自动评分。'
    },
    {
      id:'be',stage:0,order:2,title:'be：连接身份、状态和位置',
      mission:'告诉别人我是谁、现在怎么样、东西在哪里。',
      intro:'你准备好了，汤还烫，钥匙在包里。这些消息怎样各用一句话告诉家人？',
      child:'你可以给东西挂一张小标签：“我是……”“它现在……”“它在……”。英语里 am、is、are 常来帮忙把标签挂好。可不是每句话都要塞进一个 is 哦。',
      adult:'be 作联系动词时，可以把主语与身份、性质、状态或位置连接起来。现在时通常是 I am，单数第三人称 is，you、we、they 用 are。be 不是一律译为“是”，也不是“没有动作就必须补 be”：like、know、need 等动词自身就能表达状态；以后还会看到 be 作助动词。',
      steps:['先判断核心是在说身份、状态或位置，还是另有表达需要的动词。','若本句选用 be，再按主语选 am、is 或 are。','补足真正要说的身份、状态或位置，按整个意思理解。'],
      home:'出门前用一句话说自己准备好了，再用一句话告诉家人钥匙在哪里。',
      work:'会上分别说明“我负责的身份”“测试环境目前的状态”“文件在哪里”，不要把每个中文“是”都机械搬成 is。',
      trap:'I am like this game 不能表达“我喜欢这款游戏”；要说 I like this game。这里 like 是动词，不需要 am。',
      limits:'本课集中练 be 的一般现在时联系用法。并非所有身份都永久不变，也并非临时状态只能用进行时；过去、进行和被动会在后面另学。',
      sources:[['British Council：be 的形式及联系用法','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/verb-be'],['British Council：一般现在时的 be','https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/present-simple-be']],
      principle:{question:'为什么“我很饿”常用 am，而“我需要水”不用 am？',reason:'hungry 是描述状态的形容词，在普通完整陈述里可由 be 连接；need 本身是动词，已经承担核心工作。关键是英语词在句中怎样使用，不是中文有没有“是”字，也不是事情能不能被看成动作。',steps:['先选英语里的核心词，辨别 hungry 这样的描述词和 need 这样的动词。','用 be 连接时，I 配 am，you/we/they 配 are，he/she/it 及普通单数名词配 is。','说位置时保留需要的地点表达，如 in my bag。','连读整句，检查有没有多放或漏放动词。'],boundary:'这是本课所选普通现在时句式。be 有多种形式与用途，不能从此推出“任何形容词前只能有 be”或“任何动词前都不能出现 be”。'},
      cases:[
        example('表达自己的状态','I am ready.','我准备好了。',[['I','说话的我'],['am','与 I 配合的连接词'],['ready.','我现在的状态']],'ready 说明我现在怎样；am 使这句成为完整的普通陈述。这里不必硬译成“我是准备好的”。','早晨鞋穿好、书包背好，孩子告诉家长现在可以出发。'),
        example('介绍身份','My mother is a nurse.','我妈妈是一名护士。',[['My mother','介绍的人'],['is','连接身份'],['a nurse.','她的职业身份']],'母亲是单数人物，这里用 is。a nurse 是身份说明，不是妈妈正在做的另一个动作。','孩子做家庭介绍，说明妈妈现在的职业；不是说她此刻正在值班。'),
        example('说明物品位置','The keys are in my bag.','钥匙在我的包里。',[['The keys','谈论的钥匙'],['are','与复数钥匙配合'],['in my bag.','所在位置']],'keys 是复数，这里用 are。in my bag 提供位置，are 不必翻译成汉语的“是”。','下楼前妻子找车钥匙，你确认那串钥匙在自己的包里，马上告诉她。')
      ],
      contrasts:[
        {a:'She is quiet.',b:'She speaks quietly.',aZh:'她很安静。',bZh:'她说话声音轻。',judgement:'different',reason:'前句用 is 连接 quiet，描述她的状态或特点；后句 speaks 自己是动词，quietly 修饰说话方式。两句都对，安静和说话轻也不是同一件事。'},
        {a:'We are at home.',b:'We stay at home.',aZh:'我们在家。',bZh:'我们待在家里。',judgement:'different',reason:'前句直接报告位置。后句用 stay 表达停留，可用于说明习惯或安排，需要场景支持；它不是缺了 are。'}
      ],
      transfer:{prompt:'把同一种连接关系用到对方、团队事务和多个物品上。',variants:[
        example('对别人说','You are kind.','你很体贴。',[['You','正在对话的人'],['are','与 you 配合'],['kind.','对方的品质']],'you 无论指一个人还是多个人，在这里都用 are。kind 描述对方，并非一个要再接对象的动作。','妻子为你留了一份晚饭，你真诚地感谢她的体贴。'),
        example('说明会议形式','Our meeting is online.','我们的会议在线上进行。',[['Our meeting','谈论的会议'],['is','连接会议的情况'],['online.','会议的形式']],'meeting 在这里是单数名词，is 后的 online 说明会议的形式。这句话不表示会议一定此刻正在开。','上午向同事说明今天下午会议的既定形式，以免对方去实体会议室。'),
        example('复数物品状态','These shoes are wet.','这双鞋湿了。',[['These shoes','谈论的鞋'],['are','与复数 shoes 配合'],['wet.','鞋的状态']],'shoes 形式上是复数，因此用 are；不要照中文“一双”直接选 is。','孩子踩到水坑后回家，你指着鞋告诉家人需要先晾一晾。')
      ]},
      challenge:[
        {id:'be-probe',kind:'probe',prompt:'Choose the complete sentence about the bag now.',context:'There is one school bag. It feels heavy when you lift it.',options:[{text:'The bag are heavy.',why:'这里 bag 为单数，不能与 are 搭配。'},{text:'The bag is heavy.',why:'单数 bag 与 is 配合，heavy 说明重量感受，符合现在的情况。'},{text:'The bag heavy.',why:'在本题要求的完整普通陈述中，heavy 前缺少连接用的 is。对话片段另当别论。'},{text:'The bag is light.',why:'语法完整自然，但意思是包很轻，与提起时很重的场景相反。'}],answer:1,explanation:'本题用 be 把单数对象和状态连接：The bag is heavy。先对齐对象与状态，再选与主语配合的形式。',translation:'请选择描述书包现在情况的完整句。场景：只有一个书包，你提起它时觉得很重。',skill:'be'},
        {id:'be-transfer',kind:'transfer',prompt:'Choose the sentence about both coworkers now.',context:'You and Lee have finished preparing. Tell the team that both of you are ready.',options:[{text:'We is ready.',why:'we 在这里要与 are 配合，不能用 is。'},{text:'I am ready.',why:'英语成立，却只报告你自己准备好了，没有包含李。'},{text:'We are ready.',why:'we 包含你和李，are 与 we 配合，准确报告两个人的状态。'},{text:'We are prepare.',why:'prepare 是动词，不能直接放在 are 后替代 ready；若表达正在准备，另需 preparing，意思也会不同。'}],answer:2,explanation:'先选包含双方的 we，再用 are 连接 ready。不要只盯着 be 的形式，还要检查是否报告了题目要求的所有人。',translation:'请选择描述两位同事现在情况的句子。场景：你和李都已准备完毕，要告诉团队你们都好了。',skill:'be'}
      ],
      nextUse:'在家或办公室各挑一个对象，写一句身份、状态或位置陈述；再写一句含 need 或 like 的句子。自己比较哪一句使用 be、为什么；自由表达需自行复核。'
    },
    {
      id:'action',stage:0,order:3,title:'动词：事情怎样发生',
      mission:'选对动词，说明做什么、需要什么和接下来涉及谁。',
      intro:'读书、等车、需要帮助，看起来不是同一种事。你能说清每件事最关键的信息吗？',
      child:'动词像故事的小发动机：吃、等、喜欢、需要，都能让我们知道发生了什么。发动机各有接法，有的只说一件事就够，有的还得说清“什么东西”或“等谁”。',
      adult:'动词不只表达身体动作，也表达感受、拥有、需要与变化。不同动词有不同搭配：sleep 可以不接对象，need 常要说明需要什么，wait for 用 for 引出等待对象。句子结构由意义与词的惯常用法共同决定，不能把中文“等某人”逐字翻成 wait somebody。',
      steps:['用一个准确的动词说出核心事情。','查这个动词通常怎样搭配，补它需要的对象或介词。','再根据人物和时间选择动词形式，不额外硬塞 be。'],
      home:'一起做家务时，把“我洗杯子”和“我等你”分别说清楚，留意 wash 后接物品，wait 后怎样接人。',
      work:'说明职责时区分 check、send、need、wait for，确保同事能知道你在做什么、还缺什么。',
      trap:'不能把“有动作”当作唯一识别动词的标准；也不能认定每个动词后都直接接名词或都要先加一个介词。',
      limits:'本课先用现在时说现行习惯、职责或需要，不用这些形式笼统表示“此刻正在做”。第三人称词形会在习惯课继续练；动词搭配仍需逐词积累。',
      sources:[['British Council：及物、不及物和其他动词结构','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/clause-structure-verb-patterns'],['British Council：一般现在时的形式和用处','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/present-simple'],['Cambridge：wait 与 wait for','https://dictionary.cambridge.org/grammar/british-grammar/wait-or-wait-for']],
      principle:{question:'选出一个动词以后，为什么还要看它“怎么接”？',reason:'英语动词像不同接口。need 后可以直接说明需要的事物；wait 要用 for 引出所等的人或物。中文能直接相接，不保证英语也能。接口有约定，不能只靠一条抽象逻辑推算。',steps:['确定是工作、感受、需要还是等待等意义。','先学习一整小块搭配，如 need help、wait for the bus。','把真实的主体和对象放进去。','核对时间与主语：本课的 we work、she works 说现行情况，不自动等于现在正在做。'],boundary:'同一个动词可能有多种意义与结构，例如 eat 可接食物，也可不提食物。要依据本句含义检查，不能给一个词只贴一张永久标签。'},
      cases:[
        example('无需点出对象','We sleep well at home.','我们在家睡得好。',[['We','谁有这个体验'],['sleep','核心事情'],['well','睡得怎么样'],['at home.','通常睡得好的地方']],'sleep 在这里不需要“睡什么”。well 说明睡得怎么样，at home 说明地方，都不是睡眠的对象。','旅途中孩子想念自己的床，家长介绍一家人通常在家睡得好的体验，而非报告此刻正在睡觉。'),
        example('需要不是肢体动作','The team needs help.','团队需要帮助。',[['The team','谈论的团队'],['needs','表达需要'],['help.','需要什么']],'needs 虽然不是看得见的动作，仍是这句的动词；help 说明需要什么。本句把 team 作为一个整体，用单数 needs。','项目遇到接口问题，你在站会上说明团队目前的需要。'),
        example('用搭配引出对象','I wait for the bus.','我等公交车。',[['I','等车的人'],['wait','核心事情'],['for the bus.','等待的对象，用 for 引出']],'把 wait for 一起学习。本课把 for the bus 作为完整一块标出，不把 bus 误说成直接跟在 wait 后的宾语。','你向同事介绍通常的通勤过程：先到站台，然后等公交车，不是在直播此刻等车。')
      ],
      contrasts:[
        {a:'We eat at six.',b:'We eat noodles at six.',aZh:'我们六点吃饭。',bZh:'我们六点吃面。',judgement:'both',reason:'eat 在两句中都能用。前句不交代吃什么，后句加入 noodles；这说明有些动词可以接对象，也可以把对象留在背景中。'},
        {a:'I wait for you.',b:'I wait you.',aZh:'我等你。',bZh:'想表达“我等你”，但漏了 for。',judgement:'repair',reason:'a 是这里“等你”的正常搭配；b 在这个意思下缺少 for，应改为 a。不是所有动词都用 for，例如 I need you 不这样接。'}
      ],
      transfer:{prompt:'换动词时同时检查它需要的搭配，不只是替换一个中文词。',variants:[
        example('直接接物品','I wash the cups after breakfast.','我早饭后洗杯子。',[['I','洗杯子的人'],['wash','做什么'],['the cups','洗什么'],['after breakfast.','通常的时间']],'wash 在这里直接接 the cups，不需要 for。after breakfast 说明固定家务的时间。','你和妻子商量长期家务分工，说明自己负责早饭后的杯子。'),
        example('换人物后检查形式','My son reads comics.','我儿子读漫画。',[['My son','阅读的人'],['reads','现行习惯，单数人物用 reads'],['comics.','读什么']],'主语换成单数第三人称，普通现在时用 reads。这个形式本身不表示他此刻正拿着漫画。','向亲友介绍儿子的阅读兴趣，说明他平常喜欢读的内容。'),
        example('工作中需要对象','We need the error log.','我们需要错误日志。',[['We','提出需要的团队'],['need','核心的需要'],['the error log.','需要的资料']],'need 自身就承担动词工作，无须在前面加 are；the error log 点明双方知道的那份日志。','排查一次已知的程序故障时，你告诉同事当前缺少哪份资料。')
      ]},
      challenge:[
        {id:'action-probe',kind:'probe',prompt:'Choose the sentence about your normal trip.',context:'Every morning you stand at the stop until the school bus arrives.',options:[{text:'I wait the school bus.',why:'想表达等待公交车，这里 wait 后需要 for，不能直接接 the school bus。'},{text:'I need the school bus.',why:'英语可以成立，表示需要这辆校车，却没有表达在站台等车这个过程。'},{text:'I wait for the school bus.',why:'wait for 引出所等的车，符合每天到站台等车的习惯。'},{text:'I am wait for the school bus.',why:'am 后不能直接接原形 wait 来构成本题句子；正在等待要用另一种形式，而本题说日常过程。'}],answer:2,explanation:'学习动词时要同时学习搭配。本题说日常等车，用 I wait for the school bus；不要从中文“等校车”省掉 for。',translation:'请选择描述平常行程的句子。场景：每天早晨，你都在站台等校车到来。',skill:'action'},
        {id:'action-transfer',kind:'transfer',prompt:'Choose the sentence that asks for the missing item.',context:'Your team cannot debug the crash yet. The missing item is the error log.',options:[{text:'We are need the error log.',why:'need 已是动词，不能在这句里再直接加 are。'},{text:'We need for the error log.',why:'need 在这里直接接所需物，不用 for。'},{text:'The error log needs us.',why:'句子结构可以成立，但意思变成日志需要我们，关系颠倒。'},{text:'We need the error log.',why:'以团队为主体，用 need 直接接缺少的日志，清楚表达当前需求。'}],answer:3,explanation:'need 和 wait 的接法不同：need the log，wait for the log。不能把一种动词的接口原样套给另一种。',translation:'请选择索要缺少资料的句子。场景：团队暂时无法调试崩溃，缺的是错误日志。',skill:'action'}
      ],
      nextUse:'找三个自己真的会用的动词，各写一个完整搭配和一句家庭或工作用语。标出哪些能直接接对象、哪些需要介词；遇到不确定的接法查词典，自行检查。'
    },
    {
      id:'count',stage:1,order:4,title:'数量：在数个体，还是说一份量',
      mission:'买东西、分食物和索要资料时把数量说明白。',
      intro:'两个苹果、两瓶水、一点建议，都能谈数量，为什么英语里的接法不一样？',
      child:'苹果可以一只一只数，水可以用瓶子量。英语有时数的是东西，有时数的是盛东西的小盒子。先看这次到底在数什么，别给所有词都装上小尾巴 s。',
      adult:'可数与不可数是英语名词在某个意义下的用法区别，不等同于现实里能否分成小颗粒。rice 常作为不可数的食物量，advice 通常也是不可数。要数份数可加单位，如 two bottles of water。一个词换意义或场景也会换用法，例如 coffee 可指饮料整体，也可指一杯或一种咖啡。',
      steps:['确定名词在这句话里表示个体、材料、整体数量还是某种含义。','表示多个可数个体时检查复数，表示不可数用法时不要直接加 s。','需要精确数量时选择合适单位，并把单位变成所需的复数。'],
      home:'准备野餐时把“两只苹果、两瓶水、一点米饭”分开说；数水瓶不等于给 water 本身机械加 s。',
      work:'索要“一条建议、两条消息、一些资料”时先查 advice、message、information 的用法，它们不按中文的“条”统一处理。',
      trap:'米粒在现实中能数，不代表普通食物用法里的 rice 就能直接说 two rices；数具体米粒可用 two grains of rice。',
      limits:'本课教常见日常意义，不把一个名词永久划进唯一格子。餐饮中的 two coffees 可指两杯，专业语境还可能数种类；查学习词典的 C、U 标记时要连同词义一起看。',
      sources:[['British Council：可数与不可数名词基础','https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/nouns-countable-uncountable'],['British Council：同一词的可数、不可数与不同意义','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/common-problems-count-uncount-nouns'],['British Council：复数与不规则变化','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/count-nouns']],
      principle:{question:'为什么可以说 two apples，却常说 two bottles of water？',reason:'apples 在这里指两个完整个体。water 在这里指一种物质量，没有直接把每一个单位命名出来。加 bottles 就明说了正在数的容器；这既帮助表达，也符合这些词在这个意义下的约定。',steps:['先辨别本句是几个个体，还是多少材料／信息。','可数个体：one apple，two apples；有些复数另记，如 child → children。','不可数用法：some water、some advice，不直接套 two 加复数。','确实要数份数时说出单位，如 two bottles of water、a piece of advice。'],boundary:'“像水所以不可数”只能帮助理解部分例子，不能推出所有名词。advice 与 suggestion 意义相近，却有不同搭配，仍要记词语的用法。'},
      cases:[
        example('数完整个体','We have two apples.','我们有两个苹果。',[['We','拥有的人'],['have','说明有'],['two apples.','两个可数个体']],'这次说的是两个完整苹果，two 后用复数 apples。不是给 have 随意加数量标记。','出门野餐前，爸爸和孩子清点袋子里的整只苹果。'),
        example('说食物的量','We need some rice.','我们需要一些米。',[['We','提出需要的人'],['need','需要'],['some rice.','尚未精确计量的米']],'普通食材用法里的 rice 当作不可数的量；some 表示一些，不能仅因有许多米粒就换成 rices。','家里准备煮饭，米罐快空了，你向家人说明需要买的食材。'),
        example('借单位数建议','I need a piece of advice.','我需要一条建议。',[['I','求建议的人'],['need','需要'],['a piece of advice.','用一条这个单位说明数量']],'advice 通常不直接数一条两条。piece 是可数单位，a piece of advice 表示一条建议。','你准备第一次做项目演示，想请有经验的同事给一个具体建议。')
      ],
      contrasts:[
        {a:'We bought some chicken.',b:'We bought two chickens.',aZh:'我们买了一些鸡肉。',bZh:'我们买了两只鸡。',judgement:'different',reason:'a 把 chicken 当食物材料，b 把 chickens 当两个个体。两句都能成立，可数性随这里选择的意义而变；不是词尾改变了就只是数量不同。'},
        {a:'We ordered some coffee.',b:'We ordered two coffees.',aZh:'我们点了些咖啡。',bZh:'我们点了两杯咖啡。',judgement:'both',reason:'咖啡馆里两句都可用。a 不点明杯数，b 常把 coffees 理解为两份饮品；这不等于任何不可数名词都能随意加 s。'}
      ],
      transfer:{prompt:'从水果换到不规则复数、容器和工作材料，逐次确认数的是什么。',variants:[
        example('不规则复数','Three children share the crayons.','三个孩子共用这些蜡笔。',[['Three children','三个孩子，child 的复数'],['share','一起使用'],['the crayons.','共用的物品']],'数量是三，child 的复数要用 children，不能写成 childs；规则的 s 不是全部复数形式。','周末手工课，三个孩子围坐一桌，按安排共用一盒蜡笔。'),
        example('把瓶数说清楚','We need two bottles of water.','我们需要两瓶水。',[['We','提出需要的人'],['need','需要'],['two bottles','正在数两个瓶装单位'],['of water.','单位里装的是水']],'two 直接数 bottles，所以 bottles 变复数；water 在这里仍是物质量。','一家人要去公园，整理清单时明确要带两瓶水。'),
        example('材料不会跟着 more 变复数','The printer needs more paper.','打印机需要更多纸。',[['The printer','谈论的设备'],['needs','需要'],['more paper.','作为材料的更多纸']],'本句说打印用纸这一材料，paper 用不可数形式；papers 在其他意义中可以指文件或论文，不是本句的默认意思。','办公室打印任务快开始了，纸盘里的纸不够，你提醒同事补纸。')
      ]},
      challenge:[
        {id:'count-probe',kind:'probe',prompt:'Choose the question about the amount of rice.',context:'You are planning dinner. Ask about the amount of uncooked rice to buy, rather than the number of containers.',options:[{text:'How much rice do we need?',why:'询问食材 rice 的量，与本题要买多少米吻合。'},{text:'How many rice do we need?',why:'普通食材意义的 rice 不这样直接与 how many 搭配。'},{text:'How many bowls do we need?',why:'这是正确的英语，但它问碗的数量，题目明确要问米的量。'},{text:'How much rices do we need?',why:'本场景不是在数品种，rice 不加 s；much 也不与这种复数形式搭配。'}],answer:0,explanation:'这里谈普通米的用量，用 how much rice。若要数碗，则可问 how many bowls；先看要问的对象，而非只找固定关键词。',translation:'请选择询问米的用量的问题。场景：准备晚饭，要问买多少生米，而不是买几个容器。',skill:'count'},
        {id:'count-transfer',kind:'transfer',prompt:'Choose the request for exactly two suggestions.',context:'You will give a demo tomorrow. Ask your mentor for exactly two useful suggestions.',options:[{text:'Please give me two advices.',why:'advice 通常不可数，这里不能直接写 two advices。'},{text:'Please give me some advice.',why:'英语自然，但 some 没有明确提出本题要求的两条。'},{text:'Please give me two piece of advice.',why:'two 数的是 piece，因此单位本身要用 pieces。'},{text:'Please give me two pieces of advice.',why:'用复数单位 pieces 把不可数的 advice 分成两条，数量明确。'}],answer:3,explanation:'要表达两条建议，把“可数单位”和“建议内容”一起说：two pieces of advice。变化的是 pieces，advice 不加 s。',translation:'请选择明确索要两条建议的表达。场景：演示之前，向导师请教两条有用的建议。',skill:'count'}
      ],
      nextUse:'写一张真实的四项购物或工作清单：两项直接数个体，两项用合适单位表示数量。逐项查词义和数量表达；不要把能被网页接受当成英语已经正确。'
    },
    {
      id:'articles',stage:1,order:5,title:'a、an、the：让对方认出你指什么',
      mission:'说清“随便一个”和“我们都知道的那个”。',
      intro:'桌上好几支笔。你想要任意一支，还是只要刚才用过的那支？对方需要不同线索。',
      child:'a、an 像说“有这么一个”，the 像说“就是你也能找到的那个”。挑哪个小词，要想想听你说话的人知不知道你指谁，不能只数这是第几次提到哦。',
      adult:'冠词帮助标明指称方式。a/an 常用于一个未特定识别的可数单数；the 表示在当前语境中听者能够识别的对象，可来自前文、现场或限定信息。一般谈论复数类别、不可数材料时常用零冠词。a/an 按后面紧接词的起始发音选择，不只看字母。',
      steps:['先判断这里的名词是单数可数、复数还是不可数用法。','再问听者能否从当前场景识别具体是哪一个或哪一组。','选择 a/an、the 或此处合适的零冠词；已有 my、this 等时不要机械叠加。'],
      home:'请家人拿杯子时，练习表达“任意一个干净杯子”和“门边那个杯子”，让对方真的拿得到。',
      work:'提工单时用 a ticket 引入一张未特定的工单；双方知道编号后可用 the ticket，第一次提到但现场已明确也可用 the。',
      trap:'“第一次 a，第二次 the”只是常见故事顺序。哪怕第一次开口，只要双方都知道是哪扇门，也可以说 the door。',
      limits:'普通单数可数名词通常需要冠词或其他限定词，如 my、this；职业称谓、固定短语、机构活动等另有用法。本课不把零冠词和所有特殊名称一次讲完。',
      sources:[['British Council：a、an、the 与一般指称','https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2-grammar/articles-a-an-the'],['British Council：限定词的不同作用','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/determiners-quantifiers']],
      principle:{question:'为什么冠词要看听者知道什么，而不只看我知道什么？',reason:'你心里知道是哪支笔，不代表对方知道。a pen 可以从某一类里取一个；the pen 表示对方有足够线索定位。语言要协同两个人的注意，不能只在自己的脑内完成指认。',steps:['确定是在说一个个体，还是一类事物／材料。','单数可数而不要求识别特定对象时，用 a/an。','听者可定位具体对象或一组对象时，考虑 the。','泛谈复数或不可数类别时常不加冠词；选择 a/an 时听紧跟词的声音。'],boundary:'这是常用指称方式，不能从“the”推出只有一个对象存在，也不能把 a 理解成严格强调数字一。固定表达与不同语篇还需另学。'},
      cases:[
        example('引入一个尚未识别的物品','I found a key.','我找到了一把钥匙。',[['I','发现的人'],['found','已经发生的发现'],['a key.','引入一把钥匙']],'a key 告诉对方有这么一把钥匙，还不假定对方已经知道是哪把。found 是 find 的过去形式，此处先把它作为完整表达理解。','昨天你在公园捡到钥匙，今天第一次把这件事告诉同事；对方此前不知道。'),
        example('利用现场共同线索','Please close the window.','请关上这扇窗。',[['Please','礼貌请求'],['close','请做的动作'],['the window.','双方能认出的那扇窗']],'即使是第一次说 window，双方正对着房间里唯一开着的窗，也能用 the 共同定位。','晚饭时风把纸吹动了，你和家人看着那扇开窗，请身旁的人关上。'),
        example('谈一个类别','Dogs need exercise.','狗需要运动。',[['Dogs','泛谈狗这一类'],['need','表达需要'],['exercise.','泛指运动']],'Dogs 用复数且不加 the，表达类别层面的概括；不是指眼前某几只狗。exercise 在这里是不可数的活动量。','孩子想养狗，你在讨论养狗通常需要承担的照顾责任。')
      ],
      contrasts:[
        {a:'Please bring a chair.',b:'Please bring the chair.',aZh:'请拿一把椅子来。',bZh:'请把那把椅子拿来。',judgement:'different',reason:'两句都对。a 通常允许从合适椅子中取一把；the 要求有语境帮助对方认出哪一把。若现场不明确，后句可能需要补“门边的”等线索。'},
        {a:'We have an hour.',b:'We have a university nearby.',aZh:'我们有一个小时。',bZh:'我们附近有一所大学。',judgement:'both',reason:'hour 开头的 h 通常不发音，以元音音素开始，用 an；university 虽以字母 u 开头，却以 /j/ 的辅音音素开始，用 a。选择看紧接词的发音。'}
      ],
      transfer:{prompt:'改变听者掌握的线索、名词数量或后面词语的声音，再选择表达。',variants:[
        example('未指定的任意一个','Please bring a clean cup.','请拿一个干净的杯子来。',[['Please','礼貌地请求'],['bring','拿过来'],['a clean cup.','任何符合要求的一个杯子']],'clean 以辅音音素开始，前面用 a。这里要求干净，但没有指定橱柜里某个唯一的杯子。','早餐前桌上缺一个杯子，你请孩子从柜子里任选一个干净的。'),
        example('看声音，不看字母','We need an umbrella.','我们需要一把伞。',[['We','提出需要的人'],['need','需要'],['an umbrella.','未指定的一把伞']],'umbrella 起始是元音音素，前面用 an。这里提出需要，并未指定要拿哪一把伞。','出门突然下雨，你与妻子商量先找一把可用的伞。'),
        example('特指不可数材料','The water in this bottle is warm.','这个瓶子里的水是温的。',[['The water in this bottle','用瓶子范围认出的水'],['is','连接状态'],['warm.','水的温度']],'water 虽在这里不可数，仍能用 the 特指。in this bottle 给听者明确的定位线索；不可数不等于不能用 the。','孩子想喝水，你指着眼前的水瓶，说明这瓶里的水可以直接喝。')
      ]},
      challenge:[
        {id:'articles-probe',kind:'probe',prompt:'Choose the best request for this situation.',context:'You and Lee are looking at the only blue folder on the desk. Ask Lee to open that folder.',options:[{text:'Please open a blue folder.',why:'语法成立，通常是任选一个蓝文件夹；本题双方已共同定位那一个，用 the 更贴合。'},{text:'Please open the blue folder.',why:'双方都能认出桌上那个蓝文件夹，the 表达共同可识别的对象。'},{text:'Please open an blue folder.',why:'blue 以辅音音素开始，此处不能用 an；而且本题要指已识别的文件夹。'},{text:'Please open blue folder.',why:'在这里的普通单数可数用法中，folder 前缺合适限定词，不能直接省略。'}],answer:1,explanation:'关键不是是否第二次提到，而是听者能否定位。双方正在看唯一的蓝文件夹，因此 the blue folder 是最贴合的请求。',translation:'请选择最贴合场景的请求。场景：你和李正看着桌上唯一的蓝色文件夹，请李打开它。',skill:'articles'},
        {id:'articles-transfer',kind:'transfer',prompt:'Choose the sentence that says how long you need.',context:'You need one hour to finish the task. Tell your coworker the time you need.',options:[{text:'I need a hour.',why:'hour 通常以元音音素开始，不能因看到字母 h 就选 a。'},{text:'I need the hour.',why:'有特定时间段的语境时可以成立，但本题只是说明所需时长，没有共同识别的那个小时。'},{text:'I need an hour.',why:'用 an hour 自然说明一小时的时长，an 与 hour 的起始发音配合。'},{text:'I need an university.',why:'不但换成了大学而非时长，university 的起始声音也应配 a。'}],answer:2,explanation:'数量和意思先对齐，再听发音。这里要一小时时长，用 an hour；a/an 不能只靠首字母判断。',translation:'请选择说明所需时长的句子。场景：完成任务需要一个小时，请告诉同事。',skill:'articles'}
      ],
      nextUse:'用一件眼前物品写两个请求：一个允许任选，一个要让家人认出特定物品。再找一个发音决定 a/an 的例子，读出来并自查；不把第一次／第二次当硬规则。'
    },
    {
      id:'pronouns',stage:1,order:6,title:'代词：换名字，也要保留关系',
      mission:'少重复人名，又让对方分得清谁帮谁、东西归谁。',
      intro:'小林把电脑借给了小周。接着只说“他拿走了”，听的人一定知道是谁吗？',
      child:'代词像给人物换的小名牌：我、他、她、他们。换好以后，还得知道谁在帮忙、谁被帮助、东西是谁的。要是两个小朋友都能对上“他”，就把名字叫清楚。',
      adult:'人称代词替代已能识别的名词短语，并随句中作用选择 I/me、she/her、we/us 等形式。my、your 等通常放在名词前表示所属；mine、yours 等可以代替整个所属名词短语。代词必须让指向清楚，they 也可指身份未知或使用该代词的单个人，并非永远只表示复数。',
      steps:['先找代词实际指谁或什么，必要时保留名字。','做主语通常选 I/she/we 等，做动词对象或放在介词后通常选 me/her/us 等。','表示所属时区分 my book 和 mine，检查是否仍带名词。'],
      home:'讲一段家务分工时把自己和家人换成 I、you、we，再检查“我帮她”和“她帮我”有没有说反。',
      work:'代码审查消息出现两个同事时，别只写 he 或 she 让人猜；用名字说明“谁改哪段”，再在清楚的地方用代词。',
      trap:'代词不总指离它最近的人名。若有两个合适对象，重复名字往往比追求句子短更有用。',
      limits:'本课练常用主语、对象和所属形式，不全面处理反身代词或所有口语省略。人称用法还需尊重对方使用的代词；单数 they 在形式配合上仍说 they are。',
      sources:[['British Council：主语、宾语代词与单数 they','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/personal-pronouns'],['British Council：my/mine 等所属形式','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/possessives-pronouns']],
      principle:{question:'为什么同一个“我”有时是 I，有时是 me？',reason:'指的人可以不变，句中关系会变。I help her 里我在主语位置；She helps me 里我接受帮助。英语用不同形式提示这些作用，不能把所有位置都换成背熟的同一个词。',steps:['先用名字或完整名词把事件讲明白。','确定谁是本句主语，谁是动词或介词所连的对象。','分别换成适合位置的代词，如 she、her，we、us。','谈所属时，名词前用 my 等；代替整个 my book 时可用 mine。','回读一次：听者能唯一确定指向吗？不能就恢复名字。'],boundary:'这里说的是常用位置；如 It is me 在日常英语里很正常，不能把“be 后永远用主格”当硬规则。本课也不把所有出现 her 的地方都叫宾语，her book 里它表示所属。'},
      cases:[
        example('帮助的方向','I help her with the puzzle.','我帮她拼图。',[['I','主语：提供帮助的我'],['help','帮助'],['her','接受帮助的她'],['with the puzzle.','在哪件事上帮助']],'若 her 指前面已说清的姐姐，这里用 her 作 help 的对象。I 和 her 的形式保留了帮助的方向。','姐姐负责拼图，你向爸爸说明通常由自己在这项活动中帮助她；姐姐的指向已经明确。'),
        example('介词后的对象形式','They send the files to us.','他们把文件发给我们。',[['They','发送文件的人'],['send','发送'],['the files','发送的文件'],['to us.','接收方：我们']],'在 to 后面用 us，而不是 we；They 指前文已经确认的运维同事，不会凭空告诉听者是哪几个人。','介绍现行协作流程时，已提到运维小组，接着说明他们把文件发给开发组。'),
        example('独立表达归属','This notebook is mine.','这本笔记本是我的。',[['This notebook','正在指的笔记本'],['is','连接归属说明'],['mine.','我的笔记本，用所属代词替代']],'mine 在这里相当于 my notebook，不必在后面再重复 notebook。不是所有“我的”都能逐字换成 my。','家里整理书桌时，两本笔记本摆在一起，你指着其中一本说明归属。')
      ],
      contrasts:[
        {a:'This is my cup.',b:'This cup is mine.',aZh:'这是我的杯子。',bZh:'这个杯子是我的。',judgement:'both',reason:'两句都能表明归属。a 的 my 后面带 cup；b 的 mine 已替代“我的杯子”这一块，后面不用再加 cup。句子的起点略有不同，但都可以在指物时使用。'},
        {a:'I help her.',b:'She helps me.',aZh:'我帮助她。',bZh:'她帮助我。',judgement:'different',reason:'两句都正确，帮助方向相反。她做主语用 she，接受帮助用 her；我做主语用 I，接受帮助用 me。不能只说“把同一个人换了种拼法，意思没变”。'}
      ],
      transfer:{prompt:'把关系迁移到代码审查、递物和一位身份尚不明确的人。',variants:[
        example('所属形式仍带名词','She checks my code.','她检查我的代码。',[['She','前文已明确的审查者'],['checks','她的现行职责'],['my code.','所属形式 my 后带名词 code']],'She 在主语位置；my 不是把 code 删掉后的独立“我的”，而是限定 code 的所属。','已经介绍过代码审查同事林女士，现在说明她在团队里负责检查你的代码。'),
        example('两个对象都要看清','Please give it to him.','请把它给他。',[['Please','礼貌请求'],['give','递给'],['it','双方正在看的物品'],['to him.','递给哪位已明确的人']],'it 代表已能认出的物品；to 后用 him。若现场有好几位可能的接收者，要改用名字或更清楚的指示。','你和孩子正拿着一块橡皮，旁边只有刚被点名的本需要它，请孩子递给他。'),
        example('单个人也可以用 they','A new student is here. They need a seat.','来了一位新同学。这位同学需要一个座位。',[['A new student','新出现的一位同学'],['is here.','说明已到场'],['They','接着指这位同学'],['need','they 配合 need'],['a seat.','所需物品']],'不知道这位同学的身份信息时，可以用单数 they 接着指代；这里的 They 不是突然增加了几个人。','亲子活动来了一个尚未介绍姓名的新同学，你提醒组织者给这位同学安排座位。')
      ]},
      challenge:[
        {id:'pronouns-probe',kind:'probe',prompt:'Choose the sentence you can say about the help.',context:'Ella is your sister. You help Ella with her homework, rather than receiving help from Ella.',options:[{text:'I help her.',why:'I 指说话的你，her 指姐姐艾拉，帮助方向和代词位置都对。'},{text:'She helps me.',why:'英语正确，却变成姐姐帮助你，方向与本题相反。'},{text:'I help she.',why:'she 是常用主语形式；在 help 后接受帮助的人用 her。'},{text:'Me help her.',why:'本题要求完整的普通陈述，主语位置用 I，不用 me。'}],answer:0,explanation:'先确认帮助关系：你帮姐姐。随后才换代词，主语是 I，help 后的对象是 her。',translation:'请选择你可以说的句子。场景：艾拉是姐姐，你帮她做作业，而不是她帮你。',skill:'pronouns'},
        {id:'pronouns-transfer',kind:'transfer',prompt:'Choose the reply that identifies your own laptop.',context:'A coworker asks who owns the laptop you are pointing at. It belongs to you.',options:[{text:'This laptop is my.',why:'my 通常要带后面的名词，不能在这里单独代替“我的电脑”。'},{text:'This laptop is yours.',why:'英语自然，但表示属于听话的同事，归属与场景相反。'},{text:'This laptop is me.',why:'me 表示我这个人，不表示这台电脑归我所有。'},{text:'This laptop is mine.',why:'mine 独立表达“我的电脑”，准确说明归属。'}],answer:3,explanation:'当名词已在 This laptop 中出现，后面用 mine 表示“我的”。也可以说 This is my laptop，但不能只留下 my。',translation:'请选择认领自己电脑的回答。场景：同事问你指着的笔记本电脑是谁的，电脑属于你。',skill:'pronouns'}
      ],
      nextUse:'用真实分工写“我帮某人”和“某人帮我”，再各写一句 my 加名词与 mine 独立使用的归属表达。把每个代词连线到它指的人或物，自查是否歧义。'
    },
    {
      id:'modifiers',stage:1,order:7,title:'修饰：给对象加上辨认线索',
      mission:'让别人拿对物品，并把对象与它的特点分开看。',
      intro:'你说“拿盒子来”，家人看见三个盒子。还差什么信息，才能一次拿对？',
      child:'只说“盒子”，别人可能拿错；加上“小的”“门边的”，线索就清楚啦。找句子主角时，别把这些小线索当成新的主角，它们是在帮你认出同一个东西。',
      adult:'修饰成分为名词等增加信息。本课先看常见形容词放名词前，如 a small box，以及介词短语放名词后，如 the box by the door。名词短语是以名词为核心的一整块；短语里的描述不等于全句已经作了陈述。形容词也能在 be 等联系动词后描述主语，但位置随具体词语有边界。',
      steps:['先找核心名词，确定说的是哪样人或物。','用必要的颜色、大小、位置等信息缩小范围。','再找全句动词，检查整块对象是在做主语、对象还是另有作用。'],
      home:'请孩子从三个盒子里拿“小蓝盒子”，或者“门边的盒子”，让描述真的帮助辨认。',
      work:'排查故障时说明“支付服务的错误日志”或“昨天的失败请求”，先保留核心对象，避免堆一串术语仍不知道要找什么。',
      trap:'the small box 是一个名词短语，通常不是完整陈述；The box is small 才是在完整地说明盒子小。长短不能代替结构判断。',
      limits:'多数常见形容词可放名词前或联系动词后，但不是所有词都自由换位；如 asleep 通常用于 be 等之后。多个形容词有惯常顺序和语境差异，不把顺序口诀当数学定律。',
      sources:[['British Council：形容词常见位置','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/where-adjectives-go-sentence'],['British Council：名词短语和前置修饰','https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/noun-phrases'],['Cambridge：形容词位置与限制','https://dictionary.cambridge.org/grammar/british-grammar/adjective-phrases-position']],
      principle:{question:'为什么先找“盒子”，再看“小的、门边的”？',reason:'对象是核心，描述为这个对象添加线索。分清这两层，就能把 the small box by the door 当作一整块，而不因词多就丢失主语和主句动词。线索还要确实有区分力，不能只求越多越好。',steps:['找出核心名词，如 box。','名词前加常见描述词，如 small、red。','需要位置线索时，可在名词后加 by the door 等短语。','把整块放回句子，再找它与主句动词的关系。','核对描述词的惯常位置，不随意把 asleep 等词直接搬到名词前。'],boundary:'本课只是两类常见修饰方式。修饰也可作用于动词等成分，后面会学；介词短语有时修饰动作，必须看整句意思，不能见到介词就一律并进名词。'},
      cases:[
        example('用大小挑对物品','Please bring the small box.','请把小盒子拿来。',[['Please','礼貌请求'],['bring','拿过来'],['the small box.','整个取物对象，small 描述 box']],'small 在 box 前，帮双方从已知几个盒子中定位。the small box 是 bring 的整个对象，不是三个互不相干的词。','家人正在整理桌面，桌上有一个大盒和一个小盒，你要用小盒装卡片。'),
        example('把特点说成陈述','The box is small.','这个盒子很小。',[['The box','谈论的对象'],['is','把对象与特点连接'],['small.','正在说明的特点']],'small 这次放在 is 后，整句在判断盒子的大小；它不只是给别的句子准备一个物品名称。','你试装一件礼物，发现盒子容不下，向妻子解释需要换盒的原因。'),
        example('后面也能加辨认线索','The box by the door is mine.','门边的盒子是我的。',[['The box by the door','完整主语，by the door 说明哪个盒子'],['is','全句的连接动词'],['mine.','说明归属']],'by the door 紧跟 box，帮助认出是哪一个；全句真正要报告的是“属于我”，主句动词是 is。','快递送到后，玄关和桌边各放了一个盒子，你指明门边那个属于自己。')
      ],
      contrasts:[
        {a:'I need a clean cup.',b:'The cup is clean.',aZh:'我需要一个干净杯子。',bZh:'这个杯子是干净的。',judgement:'different',reason:'前句 clean 修饰 cup，整句表达需要；后句用 is 报告一个已知杯子的清洁状态。相同描述词的位置变化，也伴随不同的交际任务。'},
        {a:'The sleeping baby is here.',b:'The asleep baby is here.',aZh:'睡着的宝宝在这里。',bZh:'想说“睡着的宝宝在这里”，但此处 asleep 的位置不自然。',judgement:'repair',reason:'a 修正了 b：在 baby 前用 sleeping 描述睡着的宝宝。asleep 通常放在联系动词后，如 The baby is asleep；不能把形容词前置当无例外规则。'}
      ],
      transfer:{prompt:'增加数量、替换描述词，或把后置线索迁移到工作资料上，保持核心清楚。',variants:[
        example('数量加颜色','We need two red cups.','我们需要两个红杯子。',[['We','提出需要的人'],['need','需要'],['two red cups.','整个对象，two 表数量，red 表颜色']],'two 在 red 前，cups 作为可数复数表达两个杯子；red 不因为杯子变多就加 s。','亲子游戏要按颜色分组，你请家人准备两个红杯子。'),
        example('描述词换到联系动词后','These cups look clean.','这些杯子看起来很干净。',[['These cups','谈论的杯子'],['look','连接外观判断'],['clean.','杯子看起来的特点']],'look 在这里是联系动词，clean 描述杯子，不是描述“看”这个动作的方式。不是只有 be 才能连形容词。','洗杯子后你看了一眼，描述它们的外观；这里只是“看起来”，没有保证已消毒。'),
        example('用来源限定资料','The log from the payment service is useful.','支付服务的这份日志很有用。',[['The log from the payment service','完整主语，from 短语说明日志来源'],['is','全句动词'],['useful.','对日志的评价']],'先找 log 这份资料，再把 from the payment service 当来源线索。主语虽然变长，主句仍在说这份日志有用。','同事提供了几个服务的日志，你已经看过，指出支付服务那份有助于定位故障。')
      ]},
      challenge:[
        {id:'modifiers-probe',kind:'probe',prompt:'Choose the request that identifies the right box.',context:'There is a small box and a large box on the table. You want someone to bring the small one.',options:[{text:'Please bring the box small.',why:'在这条普通取物请求中，small 应放在 box 前；这不是自然的描述顺序。'},{text:'The box is small.',why:'这是自然的状态陈述，但没有发出本题要的拿取请求。'},{text:'Please bring the small box.',why:'small 在 box 前帮助定位，整块作为 bring 的对象，准确说明要拿哪个。'},{text:'Please bring the large box.',why:'语法自然，却要求拿大盒子，和目标物品相反。'}],answer:2,explanation:'先完成请求 bring，再用 small 缩小 box 的范围。正确表达既要说出动作，也要给出能区分物品的线索。',translation:'请选择能够认出目标盒子的请求。场景：桌上有一大一小两个盒子，你想请人拿小的。',skill:'modifiers'},
        {id:'modifiers-transfer',kind:'transfer',prompt:'Which sentence makes the payment-service log the useful item?',context:'You are comparing logs from several services. The payment-service log helped you find the bug.',options:[{text:'The log from the payment service is useful.',why:'from 短语锁定哪份日志，is useful 评价日志本身，符合排查后的判断。'},{text:'The payment service is useful.',why:'这是正常句子，但评价对象变成支付服务，未说明哪份日志有用。'},{text:'The useful is log from the payment service.',why:'没有把 log 放在该有的名词核心位置，也没有形成这里自然的陈述。'},{text:'The log from the payment service is useless.',why:'结构自然，却评价日志毫无用处，与帮助找到故障的场景相反。'}],answer:0,explanation:'长主语里先抓核心 log，再把来源信息加进去。整句评价的是日志，不要被 payment service 离动词更近这一点带偏。',translation:'哪句把支付服务的日志说成有用的资料？场景：比较几个服务的日志，支付服务那份帮助你找到了故障。',skill:'modifiers'}
      ],
      nextUse:'挑一个家中物品，写一句能让别人从几个物品里找到它的请求；再写一句评价它的陈述。圈出名词核心、描写线索与主句动词，自查各层关系是否清楚。'
    }
  ];
  r.EnglishPathData=r.EnglishPathData||[];
  r.EnglishPathData.push(...lessons);
})(typeof window!=='undefined'?window:globalThis);
