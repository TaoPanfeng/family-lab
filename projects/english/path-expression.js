(function (r) {
  'use strict';

  // Original teaching examples. Chunk labels describe their job in this context.
  const example = (label, zh, chunks, why, scene) => ({
    label, en: chunks.map(p => p[0]).join(' '), zh,
    parts: chunks.map(p => ({text: p[0], role: p[1]})), why, scene
  });
  const question = (lesson, kind, prompt, context, options, answer, explanation, translation) => ({
    id: lesson + '-' + kind, kind, prompt, context,
    options: options.map(o => ({text: o[0], why: o[1]})),
    answer, explanation, translation, skill: lesson
  });
  const src = {
    clauses: ['Cambridge：主从句与并列', 'https://dictionary.cambridge.org/grammar/british-grammar/subordinate-clauses'],
    finite: ['Cambridge：限定与非限定从句', 'https://dictionary.cambridge.org/grammar/british-grammar/clauses-finite-'],
    emphasis: ['British Council：强调结构', 'https://learnenglish.britishcouncil.org/free-resources/grammar/c1/emphasis-cleft-sentences-inversion-auxiliaries'],
    inversion: ['British Council：否定前置与倒装', 'https://learnenglish.britishcouncil.org/free-resources/grammar/c1/inversion-after-negative-adverbials'],
    clarity: ['Purdue OWL：句子清晰度', 'https://owl.purdue.edu/owl/general_writing/mechanics/sentence_clarity.html'],
    evidence: ['UNC Writing Center：证据如何支持观点', 'https://writingcenter.unc.edu/tips-and-tools/evidence/'],
    usage: ['Cambridge：搭配、语体与英语使用', 'https://dictionary.cambridge.org/grammar/british-grammar/using-english'],
    concise: ['Purdue OWL：有效而简洁的表达', 'https://owl.purdue.edu/owl/general_writing/academic_writing/conciseness/index.html'],
    paraphrase: ['Purdue OWL：用自己的话转述', 'https://owl.purdue.edu/owl/research_and_citation/using_research/quoting_paraphrasing_and_summarizing/paraphrasing.html'],
    cohesion: ['Purdue OWL：修改句间衔接', 'https://owl.purdue.edu/owl/general_writing/the_writing_process/proofreading/revising_for_cohesion.html'],
    transitions: ['UNC Writing Center：过渡表达', 'https://writingcenter.unc.edu/tips-and-tools/transitions/'],
    paragraphs: ['UNC Writing Center：段落的中心与展开', 'https://writingcenter.unc.edu/tips-and-tools/paragraphs/'],
    paragraphing: ['Purdue OWL：段落组织', 'https://owl.purdue.edu/owl/general_writing/academic_writing/paragraphs_and_paragraphing/index.html']
  };

  const lessons = [
    {
      id: 'main-clause', stage: 6, order: 24, title: '先认清整句在说什么',
      mission: '读一条复杂消息，找出对方真正作出的陈述。',
      intro: '消息前面有背景，中间有人物介绍。读完之后，你能用一句短话复述核心吗？',
      child: '一长串话就像一列小火车。先问它主要告诉我什么，再看看哪些车厢只是介绍谁、什么时候、为什么。',
      adult: '本课用普通陈述句练习主句与嵌入结构。先按从句边界识别主语和承担时态、情态的动词组，再找它们属于哪一层。was checking 是一个动词组；checking 本身不独立标记时态。第一个动词、甚至第一个限定动词，都可能在从句里。主干是理解入口，时间、否定与条件不能因此丢掉。',
      steps: ['找各层“谁／什么＋怎样”，把助动词和主要动词一起看。', '标出背景从句、修饰名词的从句、充当主语或宾语的从句。', '复述主句，再把影响结论的时间、否定、条件放回去。'],
      home: '读学校通知，分清“如果下雨”是条件，“活动取消”是条件满足后才成立的安排。',
      work: '读故障报告，分清工程师的观察、转述的内容与报告作者自己的结论。',
      trap: '不能拿第一个动词当主句动词，也不能把所有 that 后面的内容都当成人物介绍。',
      limits: '这里只训练常见书面陈述句的分层。祈使句、省略、并列、倒装和不同语法体系的术语还需另学；可独立使用不是对所有语境都机械有效的删词测试。',
      sources: [src.clauses, src.finite],
      principle: {
        question: '为什么找“第一个动词”会读错主干？',
        reason: '文字按顺序出现，句法却有层级；句首背景和主语内部也能装进完整小句。',
        steps: ['先圈带时态或情态的动词组，同时保留它对应的主语。', '借助 although、when、关系词和语义确定各层边界；连接词有时会省略。', '问哪一层被作者用来独立陈述，哪一层在说明背景、名词或内容。', '检查主句需要的主语和补足内容是否完整，最后恢复关键限定。'],
        boundary: '形式和意义要相互核对，不能只靠“删掉剩下能读”或只数动词。一个句子也可以有两个并列主句。'
      },
      cases: [
        example('背景先出现', '虽然雨已经停了，路面仍然是湿的。', [['Although the rain had stopped,', '让步背景'], ['the path', '主句谈论的路面'], ['was still wet.', '主句的状态判断']], 'had stopped 属于 although 引出的背景；主句判断是 the path was still wet。still 说明状态尚未改变，不能在复述中随便抹去。', '周六上午九点雨停了，九点十分爸爸检查小区步道，决定提醒孩子慢走。'),
        example('同一句中有不同任务的从句', '你留在桌上的那张便条解释了门为什么开着。', [['The note', '主句主语的中心'], ['that you left on the desk', '说明是哪张便条'], ['explains', '主句的现在时动词'], ['why the door was open.', '被解释的疑问内容']], '便条是 explains 的主语。that you left 中 left 后缺少的对象对应 note，是关系从句；why the door was open 是 explains 的内容，不是修饰 door 的关系从句。', '晚上回家看到门开着，你发现桌上有保洁人员留下的便条。'),
        example('第一个限定动词也未必是主干', '出发前查看地图让我们节省了十分钟。', [['Checking the map', '整个行为作主语'], ['before we left', '行为发生的时间'], ['saved', '主句的过去时动词'], ['us ten minutes.', '受益的人和节省的时间']], 'Checking 不是承担主句时态的动词。先出现的限定动词 left 在 before 从句中；saved 才作出整句判断。主语是“出发前查看地图”这个行为。', '昨天八点出发前全家看了地图，走了一条捷径，事后比较发现少走了十分钟。')
      ],
      contrasts: [
        {a: 'When the bell rang, the children left.', b: 'The bell rang, and the children left.', aZh: '铃响时，孩子们离开了。', bZh: '铃响了，孩子们离开了。', judgement: 'different', reason: '两句都成立。a 把铃响作为离开的时间背景；b 用两个并列主句报告两件事。b 的顺序可能让人推测先后，却没有直接编码“铃响时”。'},
        {a: 'The news that the bridge had reopened surprised us.', b: 'The news that we heard surprised us.', aZh: '桥重新开放的消息让我们惊讶。', bZh: '我们听到的消息让我们惊讶。', judgement: 'different', reason: 'a 的 that the bridge had reopened 交代消息内容，内部主语和动词完整；b 的 that we heard 修饰 news，heard 的对象对应 news。两个 that 不能只按外观归成一类。'}
      ],
      transfer: {prompt: '换一种主语或嵌入位置，重新找出整句的陈述。', variants: [
        example('完整小句作主语', '经理提出的建议让团队感到意外。', [['What the manager suggested', '建议的内容作主语'], ['surprised', '主句的过去时动词'], ['the team.', '感到意外的人']], '主句不是 manager suggested，而是“所提建议让团队意外”。what 从句在这里整体作主语；不同语法体系也会用融合关系结构解释它。', '周一会上经理建议暂停上线，团队原以为会立即发布。'),
        example('主语中间装介绍', '昨天修好水龙头的邻居今天给我们打了电话。', [['The neighbour', '主句主语的中心'], ['who fixed the tap yesterday', '识别哪位邻居'], ['called', '主句的过去时动词'], ['us today.', '对象与今天的时间']], 'fixed 是关系从句的动词，called 是主要陈述。两层时间不同：修理在昨天，打电话在今天。', '今天下午接到电话，说话的是昨天帮家里修水龙头的邻居。'),
        example('两个主句', '我检查了电池，而美检查了电源线。', [['I checked the battery,', '第一个独立陈述'], ['and', '并列连接'], ['Mei checked the cable.', '第二个独立陈述']], '这句有两个并列主句，不能硬挑出唯一一个“真正动词”。两个检查分别有人负责。', '晚上手电筒不亮，你和家人分工排查，随后向孩子解释各自做了什么。')
      ]},
      challenge: [
        question('main-clause', 'probe', 'Which statement gives the main assertion of the sentence?', 'Read: After the lights went out, the engineer who was on call restarted the server.', [
          ['The engineer restarted the server.', '这是主句的核心；who was on call 修饰工程师，after 从句提供时间背景。'],
          ['The lights went out.', '这是完整而正确的背景事实，但它位于 after 引出的时间从句，未概括主要陈述。'],
          ['The engineer was on call.', '这是关系从句里的身份说明，解释是哪位工程师。'],
          ['The server restarted the engineer.', '它把动作发出者和对象颠倒了，改变了原意。']
        ], 0, '先找边界：after 背景／the engineer 加身份介绍／restarted the server。主句是工程师重启了服务器。', '灯灭后，值班工程师重启了服务器。'),
        question('main-clause', 'transfer', 'Which verb carries the main past-tense assertion?', 'Read: Reading the note that she left helped me find the spare key.', [
          ['The verb is reading.', 'Reading 引出作主语的行为，本身没有承担主句过去时。'],
          ['The verb is left.', 'left 是第一个限定动词，但它在说明 note 的关系从句里。'],
          ['The verb is helped.', '主语是读便条这一行为，helped 判断这个行为起到了什么作用。'],
          ['The verb is find.', 'find 在 helped me find 结构中是原形，不承担主句过去时。']
        ], 2, '句子说“读那张便条帮助了我”。从句 she left 和后面的 find 都不能替代 helped 的层级。', '阅读她留下的便条帮助我找到了备用钥匙。')
      ],
      nextUse: '从一条英文通知中选一个长句，写下各层主语与动词组，再用自己的话复述主要陈述。自查：条件、否定和时间是否被误删？本页不自动判定开放回答。'
    },
    {
      id: 'focus', stage: 6, order: 25, title: '把读者的注意力放对地方',
      mission: '纠正一个误会，突出真正重要的人、物或时间。',
      intro: '对方记错了发现钥匙的人。怎样说，才能让他立刻听出你在纠正哪一处？',
      child: '说话像拿小手电照东西：你想让大家看见谁，就把光照到谁身上。整句话说同一件事，亮的地方也能不同。',
      adult: '强调改变信息焦点，也会带来对比、已知背景和语体差异。it 分裂句突出一个成分，what 结构把需要识别的内容放到后面，重读 do 可反驳否认。否定或限制状语前置时有特定倒装规则；Not until 后的小句保持普通次序，主句才倒装。不能把“强调”等同于随意换序。',
      steps: ['先确定对方误会的是谁、何时、什么，还是事情是否发生。', '选择普通句、分裂句或强调助动词，让形式匹配焦点。', '采用前置结构时检查倒装位置，并考虑是否过于正式。'],
      home: '孩子说是妈妈找到钥匙，你可以温和地突出真正找到的人，而不用重复整段经过。',
      work: '复盘时突出导致故障的是旧电源线；正式强调不能代替因果证据。',
      trap: 'Not until the test finished 后面不能倒装成 did the test finish；倒装在主句 did we restart。',
      limits: '语调、语境和不同英语变体都会影响焦点。这里讲常见书面结构；强调句不证明被强调的信息真实，也不是所有 only 开头的句子都倒装。',
      sources: [src.emphasis, src.inversion],
      principle: {
        question: '为什么意思接近的两句话，听起来却在回答不同问题？',
        reason: '交流既传事实，也告诉读者本次要更新哪一块信息。',
        steps: ['写出待纠正的旧看法，例如“是 Mia 找到的”。', '保留其余背景，把焦点放在新答案 Leo 上。', '若反驳“没有做”，可强调 do／did；若限定发生时间，检查前置规则。', '朗读检验：听者能否听出你是在纠正人、时间还是是否发生？'],
        boundary: '焦点表达有词汇、语法和语用惯例，不能从纯逻辑推出任意词序；普通句配合重音往往也足够。'
      },
      cases: [
        example('纠正人物', '找到那把丢失钥匙的人是里奥。', [['It was', '引出强调'], ['Leo', '被突出的发现者'], ['who found the missing key.', '已知的发现事件']], '谈话已知有人找到钥匙，待更新的是“谁”。此处分裂句突出 Leo；普通 Leo found the missing key 加重读 Leo 也可以纠正人物。', '晚饭时有人说美找到了钥匙，你亲眼看见是里奥找到的。'),
        example('突出需要什么', '我们需要的是更多时间。', [['What we need', '先提出待填内容'], ['is', '连接识别结果'], ['more time.', '真正需要的东西']], '把“需要什么”设成话题，再将 more time 放在焦点处。通常暗含对比：需要的是时间，而不是再添人或工具。', '项目会上大家建议买工具，但团队实际欠缺的是测试时间。'),
        example('强调直到某时才发生', '直到测试结束，我们才重启服务器。', [['Not until the test finished', '前置的时间限制'], ['did we restart', '主句助动词提前'], ['the server.', '重启的对象']], 'test finished 保持主语在前；主句原来是 we restarted，前置后用 did we restart。它突出重启没有早于测试结束，语气较正式。', '测试十点结束，工程师十点后重启；报告要强调没有在测试期间重启。')
      ],
      contrasts: [
        {a: 'Leo found the key yesterday.', b: 'It was Leo who found the key yesterday.', aZh: '里奥昨天找到了钥匙。', bZh: '昨天找到钥匙的人是里奥。', judgement: 'both', reason: '两句可报告同一事件。a 在中性语境很自然，也可用语调强调；b 更明确把发现者设为对比焦点，并把“有人发现钥匙”当作背景，不能说完全没有语用差别。'},
        {a: 'We did not restart the server until the test finished.', b: 'Not until the test finished did we restart the server.', aZh: '测试结束前，我们没有重启服务器。', bZh: '直到测试结束，我们才重启服务器。', judgement: 'both', reason: '在本课重启随后发生的语境中，两句传达相近时间限制。b 用前置和倒装加强限制，较正式；a 是自然的普通次序。不是使用 b 才算语法正确。'}
      ],
      transfer: {prompt: '分别改变“是否发生”、时间限制和原因焦点。', variants: [
        example('反驳没有发送', '我昨天确实发送了报告。', [['I', '发件人'], ['did send', '强调实际做了'], ['the report yesterday.', '对象与已知时间']], '重读 did 反驳“没有发”，send 保持原形。若问题只是几点发，用这个句子还没有答到重点。', '同事没收到邮件，误以为你昨天没发送；你查到已发送记录。'),
        example('限制状语包含完整从句', '客人离开之后，我们才洗碗。', [['Only after the guests had left', '前置的先后限制'], ['did we wash', '主句倒装'], ['the dishes.', '处理的对象']], 'had left 在 after 小句中不倒装；did we wash 才是主句倒装。Only the guests left 的 only 修饰主语，不套用这一规则。', '昨晚九点客人离开，九点十分开始洗碗，正式讲述收拾的先后。'),
        example('突出已查明的部件', '造成这次故障的是那根旧电源线。', [['It was', '强调结构开头'], ['the old cable', '突出的故障部件'], ['that caused the failure.', '其余已知事件']], '焦点是哪个部件。此结构本身不能给因果关系提供证据，仍需诊断记录支持。', '工程师已通过替换测试确认旧电源线损坏，正在纠正“电池坏了”的说法。')
      ]},
      challenge: [
        question('focus', 'probe', 'Which sentence most clearly puts the finder in contrast?', 'Mia and Leo searched yesterday. Leo found the missing key. A friend incorrectly says that Mia found it.', [
          ['It was yesterday that Leo found the missing key.', '语法成立且事实相符，但分裂句突出昨天，未把纠正焦点明确放在人物上。'],
          ['It was Leo who found the missing key.', '突出 Leo，直接纠正对发现者的误会。'],
          ['It was the missing key that Leo found.', '语法成立，但突出找到了什么，而语境要纠正谁找到。'],
          ['It was Mia who found the missing key.', '结构虽成立，却重复了语境已经说明的错误人物。']
        ], 1, '强调形式要服务于本次交流的问题。这里需要更正发现者，而不是日期或物品。', '美和里奥昨天一起找钥匙；实际上是里奥找到的，朋友却记成了美。'),
        question('focus', 'transfer', 'Which sentence starts with Not until and uses standard inversion?', 'The test finished at ten. We restarted the server after ten. Emphasise that the restart did not happen before the test ended.', [
          ['Not until did the test finish we restarted the server.', '把倒装放进 until 小句，主句却未作所需倒装，不符合这里的标准结构。'],
          ['Not until the test finished we restarted the server.', '此前置否定限制结构要求主句倒装，这里缺少 did we restart。'],
          ['We did not restart the server until the test finished.', '这是自然、正确的普通表达，但没有满足题目指定的 Not until 开头形式。'],
          ['Not until the test finished did we restart the server.', 'until 从句保持 the test finished；主句用 did we restart，顺序和意义都符合。']
        ], 3, 'Not until 后保留普通从句次序，主句才把助动词放在主语前面。普通次序的选项也正确，只是不符合指定改写形式。', '测试十点结束，重启在十点之后；要突出此前没有重启。')
      ],
      nextUse: '写一句普通事实，再设定一个真实误会，改成能纠正它的强调表达。自查：焦点是否对准误会？如果使用 Not until，倒装是否仅放在这里的主句？'
    },
    {
      id: 'long-sentence', stage: 6, order: 26, title: '把长句读成有层次的消息',
      mission: '准确复述长句，保留是谁说的、条件和结论。',
      intro: '一封邮件只有一句话，却包含报告、结论和上线条件。请把它读成几层清楚的信息。',
      child: '长句像套在一起的盒子。先找到大盒子说什么，再打开小盒子，别把盒子里的猜想说成已经发生的事情。',
      adult: '长句的难点常是嵌套、指代和信息密度。按层级恢复主语与动词，区别修饰名词的关系从句、补足内容的小句和条件背景。分块后还要检查否定、情态及范围；拆成短句是验证理解的方法，并不天然更高级或更准确。',
      steps: ['圈出每层主语和动词组，先读外层主干。', '给其余部分标记任务：识别人、报告内容、给出条件或原因。', '拆成短句复述，再检查来源、指代、否定和条件有没有改变。'],
      home: '读活动安排时，先弄清谁通知、活动怎样安排，再核对下雨等附加条件。',
      work: '评审长邮件，把“报告声称”“我们验证”“上线条件”分开复述，避免替别人担保结论。',
      trap: '把 suggests 译成 proves、把 if 后的情况读成已经发生，都比少认一个术语更影响理解。',
      limits: '有些介词短语、代词和原因从句有歧义，仅靠语法不能唯一确定。需要上下文时应询问作者；本课不宣称有适用于所有长句的唯一拆法。',
      sources: [src.clauses, src.finite, src.clarity],
      principle: {
        question: '为什么每个单词都认识，整句仍可能理解反了？',
        reason: '词义并不自动告诉你谁修饰谁、谁承担结论；嵌套改变了信息之间的关系。',
        steps: ['先写“外层谁＋说／判断／发生什么”。', '逐层展开：关系从句回到被修饰名词，内容从句回到所补足的动词或名词。', '保留可能、据称、没有、仅当等限定，不把限定当噪声。', '用短句回述，反问是否引入原句没有的原因或事实。'],
        boundary: '分块只是辅助。真正有歧义的句子要列出可能理解或补充语境，不能强行从字面选唯一答案。'
      },
      cases: [
        example('关系与内容各司其职', '玛雅昨天发来的报告显示，新路线更短。', [['The report', '外层谈论的报告'], ['that Maya sent yesterday', '识别哪份报告'], ['shows', '外层报告作用'], ['that the new route is shorter.', '报告显示的内容']], '第一个 that 小句对应 sent 的对象 report；第二个 that 后内部是 the new route is shorter，补充 shows 的内容。拆读：Maya sent a report yesterday. The report shows that the new route is shorter. 不能额外保证测量方法可靠。', '周二读路线比较邮件，附件是玛雅周一发送的报告。'),
        example('条件不是已经发生', '如果最后一次检查通过，审查了新版本的团队将于周五发布它。', [['If the final check passes,', '尚未满足的条件'], ['the team', '外层行动者'], ['that reviewed the new version', '识别团队'], ['will release it on Friday.', '有条件的发布安排']], 'reviewed 是已经完成的评审，passes 是条件中的将来事件，will release 是安排。it 回指 new version；不能复述成“最后检查已经通过”。只凭 if 也不能反推“未通过就一定不发布”。', '今天周三，评审已完成，最后检查定在周四；团队陈述检查通过时的周五发布安排，未说明未通过时怎么处理。'),
        example('内容里也能嵌入让步背景', '我认为，虽然本地测试通过了，服务器仍然需要在发布前重启。', [['I think', '作者限定为判断'], ['that, although the local test passed,', '内容里的让步背景'], ['the server still needs', '内容里的核心判断'], ['to be restarted before release.', '所需操作及期限']], '外层 I think 表示作者判断；内容层里 although 不推翻仍需重启的判断。to be restarted 不独立承担时态。拆开可以，但应保留“我认为”和“虽然”。', '周四上午本地测试已通过，工程师讨论周五发布前的剩余工作。')
      ],
      contrasts: [
        {a: 'The report suggests that the update is safe.', b: 'The report proves that the update is safe.', aZh: '报告表明更新可能是安全的。', bZh: '报告证明更新是安全的。', judgement: 'different', reason: '句法相近，但 proves 作出更强的证据承诺。语法正确不等于证据充分；没有足够验证，不能把 suggests 随意换成 proves。'},
        {a: 'The engineer said that the server had failed.', b: 'The engineer who said that resigned.', aZh: '工程师说服务器曾发生故障。', bZh: '说过那句话的工程师辞职了。', judgement: 'different', reason: 'a 的 that 引出 said 的内容；b 的 who said that 是修饰 engineer 的关系从句，其中 that 是指代前文内容的词。b 的主句动词是 resigned，不能看见 that 就开始统一切块。'}
      ],
      transfer: {prompt: '换到家校通知、技术说明和有歧义的邮件中，验证你的分层。', variants: [
        example('通知内容仍有条件', '老师说，如果周日下雨，户外课就会移到室内。', [['The teacher said', '消息来源'], ['that the outdoor lesson would move indoors', '被转述的安排'], ['if it rained on Sunday.', '安排的条件']], 'would 对应过去 said 中转述的将来安排，不是在这里自动表示虚构。下雨与移到室内都不能当作已发生事实。', '周五老师宣布周日课程的备用方案，目前还不知道周日天气。'),
        example('先行对象要找清', '我们昨晚修复的那个错误影响了已经退出登录的用户。', [['The bug', '外层主语中心'], ['we fixed last night', '省略关系词的识别信息'], ['affected', '外层的影响'], ['users who had logged out.', '受影响群体及限制']], 'bug 后没有写 that，关系从句仍然存在。who had logged out 修饰 users。过去完成时把退出登录放在相关过去参照点之前，具体参照需结合事故时间线。', '事故复盘中，昨晚已修好错误；日志显示事故当时受影响的是此前已退出登录的用户。'),
        example('识别真的歧义', '我用望远镜看见了那个男子／我看见了带着望远镜的那个男子。', [['I saw', '看见的事件'], ['the man', '被看见的人'], ['with the telescope.', '可能指工具，也可能介绍男子']], 'with the telescope 可说明看见的工具，也可修饰 man。单凭这一句不能唯一判断；澄清工具可说 I used the telescope to see the man，澄清携带者可说 I saw the man who was carrying the telescope。', '朋友发来一句没有更多背景的观鸟记录，你不知道望远镜在谁手里。')
      ]},
      challenge: [
        question('long-sentence', 'probe', 'Which reading preserves both the condition and the source?', 'Read: The manager said that the team would release the update if the final test passed. The final test has not happened yet.', [
          ['The manager said the final test had already passed.', '原句没有报告通过，补充语境还明确测试尚未进行。'],
          ['The team has already released the update.', 'would release 属于转述安排，不能变成已发布。'],
          ['The manager described release as the plan if the final test passed.', '保留经理作为来源，以及测试通过时发布这一条件性安排，不把 if 反读成只有通过才可发布。'],
          ['The team will release the update even if the final test fails.', 'even if fails 与原来的通过条件相反，加入了未给出的无条件承诺。']
        ], 2, '外层是经理说，内容层是团队有条件地发布；句子并未保证测试已通过或更新已发布。', '经理说，如果最后测试通过，团队就会发布更新；测试还未进行。'),
        question('long-sentence', 'transfer', 'Which rewrite clearly says that you used the telescope?', 'The sentence I saw the man with the telescope is ambiguous. In your intended meaning, you held the telescope and used it to see the man.', [
          ['Using the telescope, I saw the man.', 'Using 的动作执行者是主句 I，清楚表示我用望远镜看。'],
          ['I saw the man who was carrying the telescope.', '这是正确句子，但澄清成男子带着望远镜，与指定意思不同。'],
          ['I saw the man with the telescope.', '保留原句两种可能，没有完成消歧。'],
          ['The telescope saw the man.', '把无生命工具当成看见的人，改变了题目指定的行为主体。']
        ], 0, '歧义不能靠猜想解决。把工具动作和 I 明确联系，才表达了题目给定的意思。', '原句可能指我用望远镜，也可能指男子带望远镜；这里要表达前一种。')
      ],
      nextUse: '选一条不含隐私的英文长句，分层后写两到三句复述。用四项自查：谁的信息、时间顺序、否定范围、条件是否保留。遇到两种合理理解时，写一条澄清问题。'
    },
    {
      id: 'evidence', stage: 6, order: 27, title: '分清看见、推测与证明',
      mission: '报告发现时，让结论的力度配得上证据。',
      intro: '灯亮着、日志报错、一次测试变快：这些发现分别能让你说到哪一步？',
      child: '我看见灯亮着，就能说灯亮着。可我还没看见屋里的人呀！猜想可以说出来，也要告诉别人这只是猜想。',
      adult: '把可观察记录、解释和建议分层表达。观察可用 shows／recorded 加明确对象；推断可用 suggests／may／likely 并交代根据。语气变软不等于推理成立，单次成功也不能自动推出稳定效果，更不能从相关或先后直接推出因果。',
      steps: ['先说实际看到或记录了什么，标清时间、样本与来源。', '再说它支持什么解释，并保留其他合理解释。', '把建议与事实分开，说明下一步如何验证。'],
      home: '看到家里灯亮，可先报告灯亮着；是否有人在家，需要进一步确认。',
      work: '一次压测改善可以报告本次结果，再提出重复测试；不要直接宣布所有用户都会更快。',
      trap: '加上 may 不能拯救没有根据的猜测；写 proves 也不会让一次观察自动变成因果证明。',
      limits: '本课训练表达与基本证据意识，不代替统计推断、实验设计或领域专业判断。所有数字案例为原创练习情境，不是产品实测结论。',
      sources: [src.evidence, src.clarity],
      principle: {
        question: '怎样既不武断，也不把有用信息说得含糊？',
        reason: '别人要知道哪些可以复查、哪些是你的解释，才好据此行动或反驳。',
        steps: ['列事实：谁在什么条件下记录了什么。', '列推断：这条记录怎样支持你的解释，中间依赖什么假设。', '找反例：还有没有能产生同样现象的原因。', '按证据选强度，明确范围，再提出验证动作。'],
        boundary: '谨慎表达不是永远模棱两可。直接记录清楚的事可以明确说；超出记录的推广才需要另外的支持。'
      },
      cases: [
        example('观察与可能解释', '灯亮着，所以美可能在家。', [['The light is on,', '可观察状态'], ['so', '引出据此作的推断'], ['Mei may be home.', '未确认的可能解释']], '灯亮是观察，人在家是推断。may 保留定时灯、忘关灯等其他解释；它并不表示已计算出某个概率。', '晚上八点你从楼下看到美家窗户亮着，还没敲门或联系到她。'),
        example('把测试范围写出来', '在本地的二十次试验中，新版本在十八次试验里加载得更快。', [['In twenty local trials,', '测试范围'], ['the new version', '被测试对象'], ['loaded faster', '比较的结果'], ['in eighteen trials.', '结果出现的次数']], '报告的是这组本地比较，不是“所有设备都更快”。faster 还需要语境中的旧版本和相同条件作为比较基准。', '原创测试情境：同一电脑、同一网络分别比较新旧版本二十次，新版十八次更快。'),
        example('证据连接到有限解释', '日志显示反复出现超时，这表明连接可能不稳定。', [['The logs show repeated timeouts,', '可复查记录'], ['which suggests', '把记录连接到解释'], ['that the connection may be unstable.', '有限度的诊断假设']], 'show 的直接对象是记录中的超时，不是已经证明的根因。服务器负载等因素也可能造成超时，因此还要检查。', '今天十点到十点五分接口多次超时，工程师正读客户端日志，尚未查看服务端负载。')
      ],
      contrasts: [
        {a: 'The results suggest that the new method may help.', b: 'The results prove that the new method always works.', aZh: '结果表明新方法可能有帮助。', bZh: '结果证明新方法总是有效。', judgement: 'different', reason: '两句语法可成立，但证据承诺差很大。a 是有限推断；b 同时加强为证明和始终有效。小规模试验通常支持不了 b，不能把它当成更高级的同义句。'},
        {a: 'After the update, the error rate fell.', b: 'Because of the update, the error rate fell.', aZh: '更新之后，错误率下降了。', bZh: '由于这次更新，错误率下降了。', judgement: 'different', reason: 'a 报告先后，b 断言因果。若同期流量也下降，仅凭先后不能排除流量影响；有控制与排除其他解释的证据时，b 才更有支持。'}
      ],
      transfer: {prompt: '更换证据类型，并观察哪些结论仍然需要验证。', variants: [
        example('区分别人报告和亲眼验证', '据老师说，明天教室会关闭。', [['According to the teacher,', '交代消息来源'], ['the classroom will be closed tomorrow.', '被报告的安排']], '句子说明信息来自老师，并没有声称说话者亲自检查了明天的状态。准确转述也要核实老师原话和通知是否更新。', '今天周三老师口头说明周四教室维修，你正在向另一位家长转述。'),
        example('反例限制推广', '这个办法对我的手机有效，但我们还没有在其他设备上测试。', [['The fix worked on my phone,', '已观察到的范围'], ['but', '引出推广边界'], ['we have not tested it on other devices.', '尚未覆盖的对象']], '在自己手机上有效可以明确说；其他设备未知。后半句没有断言其他设备一定无效。', '下午你修复页面按钮，在自己的手机上复测成功，但尚无其他设备结果。'),
        example('建议也标记为建议', '我们应该重复测试，再决定是否发布。', [['We should repeat the test', '建议的下一步'], ['before deciding whether to release.', '决策顺序与待决内容']], 'should 提出建议，不是报告已经重测。whether to release 保留发布与不发布两个待选方向。', '本地一次测试变快，团队还没有批准发布；你建议先重复验证。')
      ]},
      challenge: [
        question('evidence', 'probe', 'Which conclusion stays within the evidence?', 'You ran one test on your laptop. The new version loaded in two seconds; the old version loaded in three. You have no results from other devices.', [
          ['The new version will always be faster on every device.', '把一次本机结果推广到所有设备和所有时间，证据不支持。'],
          ['The old version is faster on this laptop.', '与这次给定记录相反。'],
          ['The test proves that the update caused every speed improvement.', '单次结果没有排除网络、缓存等其他因素，更不能解释所有改善。'],
          ['The new version loaded faster in this test; more testing is needed.', '准确报告本次比较，并把进一步推广留给后续测试。']
        ], 3, '可以确定“这次更快”，不能自动确定原因、重复稳定性和其他设备表现。', '在你的笔记本上只测了一次，新版两秒、旧版三秒，没有其他设备记录。'),
        question('evidence', 'transfer', 'Which sentence separates observation from an uncertain explanation?', 'You can see a light through a house window. You cannot see inside, and you have not contacted the owner.', [
          ['The owner is definitely home because the light is on.', '把可能解释写成确定事实，忽略定时灯或忘关灯。'],
          ['The light is on, so the owner may be home.', '观察明确，人在家用 may 标为可能推断，符合有限证据。'],
          ['The owner cannot be home because the light is on.', '灯亮没有提供排除人在家的根据，推理不成立。'],
          ['The light is on.', '这是正确而谨慎的纯观察，但题目还要求表达一个不确定解释，因此未完成全部任务。']
        ], 1, '观察和推断都能表达，关键是不要混淆它们的证据地位。只报告灯亮也正确，但没有完成本题要求的两层表达。', '你只看到窗里亮着灯，还没看见屋内，也没有联系到主人。')
      ],
      nextUse: '写三句不含隐私的排查记录：我观察到什么；我据此怀疑什么；我准备怎样验证。自查每个“所以”中间有没有跳步，并写出一种替代解释。'
    },
    {
      id: 'translation', stage: 7, order: 28, title: '先懂意思，再换语言',
      mission: '把日常中文意思自然地传给英语读者。',
      intro: '同一句中文，在报平安、求帮助和写工作邮件时，英语表达可能不同。先确定你要让对方知道什么。',
      child: '翻译像把同一个故事换一身衣服。要保住谁做了什么和当时的心情，可不是把每个字排队换成英文。',
      adult: '先恢复中文省略的主语、时间和交流目的，再选择英语的句型、搭配与语体。译文应保留核心事实、否定和确定程度；必要时用不同词序或分句表达。自然与准确需要一起检查，不能为了顺口擅自添加人物、原因和承诺。',
      steps: ['用白话解释原意：谁、做什么、何时、说给谁听。', '选常用英语结构和搭配，不逐字搬运中文顺序。', '反向核对译文有没有多说、少说或变了语气。'],
      home: '说“家里没牛奶了”，通常是提醒补货；要表达现有库存用完，而非讨论牛奶这种物质不存在。',
      work: '译“会议改到周五了”时，若不知道谁改的，可让会议作主语，不替任何人认领决定。',
      trap: '认识单词不等于知道搭配。中文“很喜欢”不能机械排成 very like；英文也不能只靠中文逐字对应推导。',
      limits: '同一意思通常有多种合适译法，地域、语体和上下文会改变选择。本课是常见场景练习，不声称机器检查能证明译文唯一正确或达到专业翻译水平。',
      sources: [src.usage, src.concise],
      principle: {
        question: '为什么逐字都对，整句却可能让人误会？',
        reason: '语言对事件的切分、常见搭配和礼貌方式不同；词典对应只是起点。',
        steps: ['列出必须保留的信息：人物、事件、时间、否定和语气。', '判断交流目的：陈述现状、请求行动、表达感受还是转述通知。', '用熟悉而明确的英语构造完整句，允许换词序或拆句。', '把英语重新解释成中文，比对是否保留原意，并检查搭配与语体。'],
        boundary: '没有上下文时，应承认省略产生的多种理解；不能把自己的猜测偷偷翻进事实。'
      },
      cases: [
        example('很喜欢不是逐字排队', '我很喜欢这本书。', [['I', '表达感受的人'], ['really like', '自然表达较强喜爱'], ['this book.', '喜爱的对象']], 'really 可修饰 like；very 通常不能这样直接修饰 like。I like this book very much 也很自然，不能把本例当成唯一译法。', '你刚读完一本有趣的书，正在向朋友表达现在的喜爱，不是提出购买请求。'),
        example('传达用完的现状', '我们家没牛奶了。', [['We', '家庭库存的相关人'], ['are out of', '当前已经没有可用库存'], ['milk.', '用完的东西']], 'out of milk 是常用表达。We have no milk left 也可以；这里无需逐字翻出“家里”，因为谈话双方已知在说家庭补货。', '周三早上打开冰箱，最后一盒牛奶昨天喝完了，你提醒家人路上买一盒。'),
        example('落在某处不是掉落动作', '我把雨伞落在公交车上了。', [['I', '遗落的人'], ['left', '把东西留在原处'], ['my umbrella', '遗落的物品'], ['on the bus.', '遗落的位置']], 'left 表达离开后物品仍在那里。dropped 通常报告掉落动作，会改变事件；forgot to bring my umbrella 只说忘带，未说明在公交车上。', '今天早上你下车后才想起，雨伞仍放在公交车座位旁。')
      ],
      contrasts: [
        {a: 'I am bored.', b: 'I am boring.', aZh: '我感到无聊。', bZh: '我让人觉得无聊。', judgement: 'different', reason: '两句语法都成立。b 把自己说成让别人无聊的来源，也可描述此刻言行，不必是永久性格；a 报告自己的感受。不能仅按中文“无聊”选一个外形相近的词。'},
        {a: 'I left my umbrella on the bus.', b: 'I forgot to bring my umbrella.', aZh: '我把雨伞落在公交车上了。', bZh: '我忘记带雨伞了。', judgement: 'different', reason: 'a 给出遗落地点；b 表示没记得带伞，伞可能还在家里。某些情境可同时为真，但不能在要求保留公交车地点时当作完全等义替换。'}
      ],
      transfer: {prompt: '改变语境中的省略、礼貌和时间，让英语仍保留真实意思。', variants: [
        example('不擅自添加决定者', '会议已经改到周五了。', [['The meeting', '谈论的安排'], ['has been moved', '已作出的变动及当前结果'], ['to Friday.', '新的日期']], '中文没说谁改的，英语可用被动。The meeting is now on Friday 也能报告当前日期；本例更突出已经发生的改动，不等于周五开会已经发生。', '今天周二，收到通知说原定周四的会改为本周五，你只需转告新安排。'),
        example('有空时帮忙', '你有空的时候，能把文件发给我吗？', [['Could you send me the file', '较委婉的请求'], ['when you have a moment?', '尊重对方方便的时间']], 'could 在这里不是询问过去能力。Please send me the file when you have time 也可用，但会更像直接要求；具体礼貌程度依关系和语调判断。', '同事正在处理别的任务，文件今天稍后收到即可，你发一条不催促的消息。'),
        example('持续到现在的居住', '你在这里住多久了？', [['How long', '询问持续长度'], ['have you lived', '从过去延续到现在的居住'], ['here?', '现居地点']], '上下文确认对方现在仍住这里，不能只把中文“多久了”机械换成过去时。How long have you been living here 也自然，焦点略偏持续活动。', '你第一次见新邻居，知道他现在住在这栋楼，想了解他何时搬来并一直住到现在。')
      ]},
      challenge: [
        question('translation', 'probe', 'Which sentence naturally expresses your current strong liking?', 'You own a book and have just finished reading it. You want to tell a friend that you like it a lot, rather than ask to receive it.', [
          ['I very like this book.', '把 very 直接放在 like 前面，不符合这里常用的标准搭配。'],
          ['I really like this book.', '自然表达现在对这本书的强烈喜爱。'],
          ['I would like this book.', '语法成立，常表达想要这本书；与题目要表达的已有阅读感受不同。'],
          ['This book likes me.', '把喜欢的体验者与对象颠倒，也不符合普通书籍的语义。']
        ], 1, '先确定是在表达喜爱，而不是提出“想要”的请求。I like this book very much 也是可行译法，未列入本题选项。', '你已经拥有并读完这本书，要告诉朋友“我很喜欢它”，而不是要求拿到它。'),
        question('translation', 'transfer', 'Which announcement reports the change without adding an unknown decision-maker?', 'A notice says that the meeting, originally on Thursday, is now on Friday. You do not know who changed it. Announce the change neutrally.', [
          ['We have moved the meeting to Friday.', '句子自然，但 we 添加了“我们作出变动”的信息，题目没有提供。'],
          ['The meeting was cancelled on Friday.', '把改期说成取消，on Friday 还可能指取消发生的日期。'],
          ['The meeting has been moved to Friday.', '表达已经改期及现在的安排，同时保留决定者未说明。'],
          ['The meeting has moved Friday to Thursday.', '把会议写成移动日期的行动者，并颠倒时间方向。']
        ], 2, '准确翻译允许换结构；被动在决定者未知或不重要时有实际作用。', '会议原定周四，现在改到周五；你不知道决定者，只转告改期。')
      ],
      nextUse: '选一句今天真想说的中文，先写“我要让谁知道什么”，再写两个可行英文版本。用回译自查人物、时间、否定和礼貌；不确定的搭配查可靠词典。本页不自动判定开放翻译。'
    },
    {
      id: 'paraphrase', stage: 7, order: 29, title: '换一种说法，守住原意',
      mission: '为了读者改写一句话，并说明哪些含义保持、哪些改变。',
      intro: '同一条提醒，可以写得更简洁、换个关注对象，或解释给不同读者。先决定哪些信息绝不能丢。',
      child: '改写像换一种路线到同一个地方。路可以变，目的地别偷偷换；“可能会”不能一改就变成“一定会”。',
      adult: '改写要核对事件参与者、时间、否定、数量、情态和逻辑范围。主动与被动常能保留核心事件，但关注对象不同；近义词也可能改变程度和搭配。转述他人的观点仍需注明来源，换词并不会使其变成自己的发现。',
      steps: ['先列原句不可改变的事实与限定。', '依据读者需要改变结构、关注点或冗余表达。', '逐项比较新旧含义，并标明不完全等义的差别。'],
      home: '把“别忘记带水”改成“请记得带水”，核心提醒接近，但语气和暗示有细微不同。',
      work: '把被动报告改为主动时，保留已知执行者；不能为了句子简短删掉关键责任、限制或截止日期。',
      trap: '不是每个同义词都能互换；some 不是 all，may 不是 will，did not approve 不自动等于 rejected。',
      limits: '没有完全脱离语境的万能等义改写。体裁、礼貌、焦点和暗示可能变化；本课训练可解释的修改，不以词数下降或词汇变难衡量质量。',
      sources: [src.paraphrase, src.concise, src.usage],
      principle: {
        question: '怎样判断改写保住了意思，而不只是看起来差不多？',
        reason: '句子的事实条件和交流效果都重要；表面相近的词可能改变责任、数量或确定程度。',
        steps: ['把原句还原成信息清单：谁、什么、何时、多少、是否、可能或必须。', '先理解后重新表达，避免沿着原句逐词替换。', '找一种情境，让原句为真却让新句为假；若能找到，检查差异是否被允许。', '检查语体与焦点；使用他人观点时保留适当来源。'],
        boundary: '保持核心事件不等于保持全部语用效果。明确改变目的、强度或范围时，应称作调整内容，而不是完全等义改写。'
      },
      cases: [
        example('主动报告同一事件', '玛雅在周一修复了那个错误。', [['Maya', '已知执行者'], ['fixed', '过去的修复事件'], ['the bug', '受影响对象'], ['on Monday.', '保留的时间']], '原句为 The bug was fixed by Maya on Monday。改为主动保留谁修、修什么和何时；焦点从 bug 移到 Maya。被动原句同样正确。', '周二编辑技术周报，原稿已明确修复者是玛雅，你希望读者更容易看到分工。'),
        example('缩短表达不删核心', '请在周五之前把草稿发给我。', [['Please send me', '礼貌请求及收件人'], ['the draft', '应交付的内容'], ['before Friday.', '截止范围']], '较长原句是 Please send the draft to me before Friday begins。这里两句都把截止放在周五开始前。不能随便改成 by Friday，因为 by Friday 往往允许周五当天，具体截止仍要确认。', '团队约定周五开始前交稿，编辑在通知中用 before Friday 表达，不允许周五当天提交。'),
        example('保留可能性和原因', '如果下雨，野餐可能会推迟。', [['The picnic', '受影响的安排'], ['may be postponed', '仍不确定的变动'], ['if it rains.', '触发条件']], '原句为 If it rains, we may postpone the picnic。条件与可能性被保留，焦点改为 picnic；被动省去了 we，如责任人对读者很重要就应补回 by us 或保留主动。', '周五讨论周日野餐，家长尚未决定下雨时是否延期，只提出一个可能方案。')
      ],
      contrasts: [
        {a: 'Maya fixed the bug.', b: 'The bug was fixed by Maya.', aZh: '玛雅修复了那个错误。', bZh: '那个错误由玛雅修复了。', judgement: 'both', reason: '核心过去事件和执行者相同，但话题与焦点不同。讨论分工时 a 常自然，讨论错误处理情况时 b 也有价值，不能认定被动必然差。'},
        {a: 'Not all the tests passed.', b: 'None of the tests passed.', aZh: '并非所有测试都通过了。', bZh: '没有任何测试通过。', judgement: 'different', reason: 'a 只否定“全部通过”，逻辑上容许部分甚至全部未通过；日常说法常让人推测仍有一些通过，但不是严格保证。b 明确零个通过。例如十个里八个通过时 a 真、b 假，不能等义替换。'}
      ],
      transfer: {prompt: '更换关注点或礼貌形式，逐项核对保留下来的信息。', variants: [
        example('保留指定执行者的被动', '这封信是里奥昨天写的。', [['The letter', '新的话题'], ['was written', '保留的过去事件'], ['by Leo', '仍明确执行者'], ['yesterday.', '仍明确时间']], '原句 Leo wrote the letter yesterday。主动变被动只调整话题，不能省掉 Leo 后仍声称所有信息完整保留。', '今天回答“这封信是谁写的”，上下文已经知道是哪封信。'),
        example('提醒的语气调整', '请记得带水。', [['Please remember', '正面礼貌提醒'], ['to bring water.', '要做的动作']], '可回应原句 Do not forget to bring water。两句通常引导同一行动，后者强调避免遗忘；并非情绪、语气和所有暗示都完全一样。', '周日出门远足前，父母想给孩子一条友善提醒，不是在责备他已经忘记。'),
        example('删冗余而保留责任', '我们需要在发布前检查日志。', [['We need to check', '责任人与必要动作'], ['the logs', '检查对象'], ['before release.', '先后条件']], '原句是 It is necessary for us to check the logs before release。改写更直接但保留 us、necessary 和 before；若删成 Check the logs，责任与发布时间关系都不再完整。', '技术清单面向本团队，明确发布前必须完成日志检查，而不是事后抽查。')
      ]},
      challenge: [
        question('paraphrase', 'probe', 'Which rewrite preserves who acted, what happened, and when?', 'Original: The door was repaired by Mei on Tuesday. Use an active sentence and keep all the stated information.', [
          ['Mei repaired the door on Tuesday.', '主动句保留美、修门、周二三个明确要素。'],
          ['The door repaired Mei on Tuesday.', '把受事和执行者倒置，改变事件。'],
          ['Mei will repair the door on Tuesday.', '变成将来安排，丢失原来的已完成过去事件。'],
          ['The door was repaired on Tuesday.', '这句自然且可能正确，但仍是被动并删掉了已明确的修理者，未完成题目要求。']
        ], 0, '先保留事件信息，再调整结构。被动本来并没有错，本题只是指定换成主动且保留全部已给信息。', '原句说门由美在周二修好了；要求用主动句保留这些信息。'),
        question('paraphrase', 'transfer', 'Which sentence accurately reports the result without changing the quantity?', 'Eight of ten tests passed. Two failed. You want to emphasise that the full set did not pass.', [
          ['None of the tests passed.', 'none 表示零个通过，与八个通过的记录冲突。'],
          ['All the tests failed.', '把两次失败扩大为全部失败。'],
          ['All the tests passed.', '忽略两次失败，与记录不符。'],
          ['Not all the tests passed.', '否定全部通过，符合八个通过、两个失败，并突出未全过。']
        ], 3, 'not all 是否定“全”，不等于 none。若要完整报告数量，还可写 Eight of ten tests passed, but two failed。', '十个测试八个通过、两个失败；你要突出并非全部通过。')
      ],
      nextUse: '找一句自己写的英文，先列人物、时间、否定、数量、情态，再写一个简洁版和一个换焦点版。自查能否找到“原句真而改句假”的情境，并写出语气变化；本页不自动批改。'
    },
    {
      id: 'cohesion', stage: 7, order: 30, title: '让一句话牵住下一句',
      mission: '把几条正确的英文连成读者跟得上的消息。',
      intro: '三句话单独都看得懂，放在一起却可能跳来跳去。试着让读者知道每一句为什么接在这里。',
      child: '讲故事像牵着朋友的手走路。上一句说到了什么，下一句就接住它；换方向时，也要告诉朋友为什么转弯。',
      adult: '衔接依赖主题连续、清楚指代和真实的逻辑关系。重复关键词不一定笨拙，this problem 也常比孤立的 this 更清楚。however 标记反差，therefore 标记推出的结果；连词只能展示已有关系，不能凭空创造因果。',
      steps: ['先决定句子顺序，每句只推进一小步。', '用明确名词、合适代词或关键词接住已知信息。', '需要时加过渡表达，检查它是否准确标明关系。'],
      home: '说明周末路线选择时，先说两条路各有什么特点，再解释为什么选择其中一条。',
      work: '故障消息按“现象—影响—下一步”展开，避免突然从错误跳到发布日期而不解释关系。',
      trap: 'however 不是高级版 and，therefore 也不是“接下来”。连接词多不等于有逻辑。',
      limits: '旧信息到新信息是常用策略，不是所有句子的硬性词序。叙事、对话和文学可以故意跳跃；本课针对清楚的日常说明与工作短文。',
      sources: [src.cohesion, src.transitions, src.clarity],
      principle: {
        question: '为什么语法都正确，读者仍然跟不上？',
        reason: '读者还要知道话题是否延续、代词指谁、新信息与前句是什么关系。',
        steps: ['用几个中文词概括每句的任务，先检查顺序是否合理。', '标出重复话题与每个代词的所指，不清楚就用明确名词。', '让下一句从读者已知的东西出发，再加入新信息。', '最后选择对比、补充、结果等过渡词，删掉制造假关系的连接。'],
        boundary: '衔接不能替代证据与组织。顺口的 therefore 也可能掩盖推理跳步；语法通顺的 it 也可能指代不明。'
      },
      cases: [
        example('关键词接力', '我们发现厨房漏水。漏水损坏了地板的一块。我们先拍下受损处，再联系房东。', [['We found a leak in the kitchen.', '引入具体问题'], ['The leak damaged part of the floor.', '接住漏水并说明后果'], ['We photographed the damage before contacting the landlord.', '接住受损并交代行动顺序']], 'leak 从新信息变成下一句已知话题，damage 又承接损坏结果。这里适度重复能帮读者跟上，不必为了避免重复不断换冷僻近义词。', '周三晚上回家发现水管漏水，地板已有一块受损，你向家人说明处理经过。'),
        example('反差与选择有不同任务', '河边路线更短，但它更湿滑。我们想走得稳妥些，所以选择了公园路线。', [['The riverside route is shorter.', '先给一个优点'], ['However, it is more slippery.', '补充与优点相冲突的缺点'], ['We want a safer walk, so we chose the park route.', '提供目标并解释选择']], 'however 连接“更短”与“更滑”的取舍，so 则把安全目标与选择连接。这里因果由明确目标和路线比较支持，不是连词自己证明公园绝对安全。', '刚下过雨，家人比较两条已知路线；公园路线干燥且较长，大家优先考虑少滑倒。'),
        example('指名避免猜测', '里奥在会后与本谈了谈。本会在周五修改草稿。里奥会在修改完成后审核。', [['Leo spoke to Ben after the meeting.', '介绍两个人'], ['Ben will revise the draft on Friday.', '明确任务执行者'], ['Leo will review it after the revision.', '明确另一人和先后顺序']], '第二句用 Ben 而不是让人猜 he 指哪一位男性。it 的对象 draft 已清楚，最后的 revision 接住 revise。关键人物重复有助于准确分工。', '周三会后两位男同事分工：周五本改稿，改完由里奥审核，你给团队发摘要。')
      ],
      contrasts: [
        {a: 'The app froze during upload. This problem affected three users.', b: 'The app froze during upload. This affected three users.', aZh: '应用在上传时卡住了。这个问题影响了三位用户。', bZh: '应用在上传时卡住了。这影响了三位用户。', judgement: 'both', reason: '两句在短而明确的语境中都能理解，this 可以回指前一事件。a 加 problem 更明确；前文若列了多个事件，b 的 this 就可能不清楚，不能一概宣布 this 禁用。'},
        {a: 'The bus was late. Therefore, we missed the start.', b: 'The bus was late. However, we reached the start on time.', aZh: '公交晚点了，所以我们错过了开场。', bZh: '公交晚点了，不过我们仍准时赶到开场。', judgement: 'different', reason: 'a 表达造成的结果，b 表达与晚点引起的预期相反的结果。两段都可正确，但事实结局不同，不能只换连接词而不检查内容。'}
      ],
      transfer: {prompt: '用不同话题练习承接、补充与真实的因果说明。', variants: [
        example('承接新发现', '孩子选了一本关于鸟的书。这本书介绍了本地的鸟类。周日，我们去公园寻找其中的鸟。', [['Our child chose a book about birds.', '引入书的话题'], ['The book describes local species.', '承接书并添加内容'], ['On Sunday, we looked for those birds in the park.', '承接鸟类并推进活动']], 'the book 回到已引入的书，those birds 回到书里介绍的本地鸟。这里时间明确，无需每句都加连接词。', '周六借书读本地鸟类，周日全家去附近公园观察，讲述已完成的周末活动。'),
        example('补充不是因果', '新页面加载得更快。它还使用了更大的按钮。两项改动需要分别测试。', [['The new page loads faster.', '先报告一种变化'], ['It also uses larger buttons.', '补充另一种变化'], ['These two changes need separate tests.', '合并承接并提出验证']], 'also 是补充，并未声称按钮变大导致加载变快。these two changes 清楚概括前两句，最后解释测试安排。', '产品例会展示一个新版页面：速度与按钮同时改变，尚需分别验证各自效果。'),
        example('把中间原因补出来', '预约从两点改到了三点。这个变动与接孩子的安排冲突了。我请同事代为出席。', [['The appointment moved from two to three.', '报告时间变化'], ['This change clashed with school pickup.', '明确说明实际冲突'], ['I asked a colleague to attend instead.', '承接冲突后的应对']], '不是一换时间就必然要同事代去；第二句补足日程冲突，行动才有可理解的理由。this change 的所指明确。', '今天上午收到下午预约改期通知，你三点必须接孩子，所以联系同事代会。')
      ]},
      challenge: [
        question('cohesion', 'probe', 'Which continuation explicitly marks the contrast?', 'The first sentence is: The bus route is cheaper. You want to add a drawback: it takes longer than the train.', [
          ['Therefore, it takes longer than the train.', 'therefore 把便宜写成耗时更长的推理原因，语境未给出这种因果。'],
          ['For example, it takes longer than the train.', '更久不是“更便宜”的一个例子，例证关系不成立。'],
          ['It also takes longer than the train.', '这是可理解的补充句，但 also 没有明确标出题目要求的优点与缺点对比。'],
          ['However, it takes longer than the train.', 'however 明确标记取舍中的反差，符合本题目的。']
        ], 3, '先判断逻辑关系，再选词。这里是优点与缺点的对比，不是因果或例证；用 and 或 also 也能补充事实，但表达任务不同。', '公交线路更便宜，你还要明确对比它比火车更耗时这个缺点。'),
        question('cohesion', 'transfer', 'Which rewrite explicitly names the person who needs to bring a ticket?', 'Leo told Ben about the ticket requirement. Ben needs to bring a ticket. Use Ben\'s name rather than a pronoun for the person bringing it.', [
          ['Leo told Ben that he needed to bring a ticket.', '在很多语境中 he 自然指 Ben，但题目要求明确写出带票者名字，这里仍未点名。'],
          ['Leo told Ben that Ben needed to bring a ticket.', '明确重复 Ben，直接完成指定的人物点名要求。'],
          ['Leo told Ben that Leo needed to bring a ticket.', '明确但把需要带票的人改成 Leo，改变事实。'],
          ['Leo said that a ticket was needed.', '语法自然，却没有说明哪一个人需要带票，删掉了要求保留的信息。']
        ], 1, '避免重复不是最高目标。关键人物需要明确时，可以直接点名，不必强求每次都换代词。', '里奥告诉本要带票；需要带票的是本，这次要明确写出他的名字。')
      ],
      nextUse: '写一段三句英文消息：现象、影响、下一步。圈出第二三句怎样接住前句，逐个解释代词与连接词；若删去连接词仍无法说明关系，先修正内容和顺序。'
    },
    {
      id: 'paragraph', stage: 7, order: 31, title: '围绕一件事写成一段',
      mission: '给真实读者写一段有中心、有细节、有边界的说明。',
      intro: '试着给家人或同事说明一项小决定。让读者既知道你的主张，也知道依据和下一步。',
      child: '一段话像装一个小书包：先想这次要带什么，再把有用的东西放进去。别把不相干的玩具全塞进来呀。',
      adult: '段落由一个中心任务组织，句子按目的展开。说明性段落常用中心、细节、解释与收束，但叙事可按时间、操作可按步骤。主题句位置与句数不是固定公式；内容支持和读者理解比凑词数重要。一次小练习只能展示组织方法，不能证明已经掌握写作。',
      steps: ['明确读者、目的与一句话中心。', '选择能支持中心的具体细节，说明它们为何重要。', '检查每句任务、衔接与证据范围，删掉无关句后朗读。'],
      home: '说明为什么想调整家庭阅读时间，用实际遇到的问题和可执行的小计划，而非一串空泛口号。',
      work: '写发布建议时同时给结果、局限和后续动作，让接收者知道需要决定什么。',
      trap: '段落不是“五句话＋三个高级连词”的容器。一个漂亮开头不能弥补没有细节、证据或实际动作。',
      limits: '本课提供原创短段落与约120词练习脚手架，不是完整写作课程，也不自动评价自由作文。示例数据为练习设定，不能外推为教育、技术或出行效果的研究证据。',
      sources: [src.paragraphs, src.paragraphing, src.cohesion],
      principle: {
        question: '怎样知道一段话是在展开中心，还是只在堆句子？',
        reason: '每一句都应帮助特定读者完成同一个理解任务：知道发生什么、为何这样想或接下来怎么做。',
        steps: ['用一句中文写清读者与目的，再选一种组织方式：说明、叙事或过程。', '写中心句，或先安排必要背景；位置由理解顺序决定。', '给可核对的细节，并解释它与中心的联系。', '补充必要限制或下一步，逐句标注任务；不能说明作用的句子删改。', '朗读并回查主语、时间、指代和证据强度；优先修意思，再修词句。'],
        boundary: '中心—细节—解释—行动是说明文练习的支架，不是所有体裁必须遵守的套路；词数只是控制练习规模。'
      },
      cases: [
        example('家庭阅读：一个完整说明段', '我想把家庭阅读时间提前到晚饭后。上周我们三晚等到九点才开始，而孩子到那时已经累了。周四我们七点半读了十分钟，他问了好几个关于故事的问题。这只是一个晚上的观察，所以不能证明早读一定更好。我们可以试一周，再问每个人感觉如何。', [
          ['I would like to move our family reading time to just after dinner.', '提出一个具体调整'],
          ['Last week, we waited until nine on three evenings, and our child was already tired.', '给出原安排的问题'],
          ['On Thursday, we read for ten minutes at seven thirty, and he asked several questions about the story.', '给出可观察的尝试细节'],
          ['That is only one evening, so it does not prove that earlier reading is better.', '限制证据范围'],
          ['We could try it for a week and then ask everyone how it felt.', '提出小规模尝试与回顾']
        ], '全段只讨论阅读时间。例子后不仅说“很好”，还交代观察和局限；最后提出全家可商量的尝试，不把孩子当成需要被实验打分的对象。', '原创家庭场景：周日和家人商量下周阅读安排，给出上周四一次具体经历。'),
        example('工作建议：结果与边界一起写', '我建议周四前保持更新为内部版本。在周二的试验中，二十次上传有两次失败，这两次都涉及大图片。其他上传完成了，但我们还没检查较慢的网络。这意味着当前结果尚不能代表所有用户。周三我会重复图片测试，并请一位同事检查慢速连接。完成这些检查后我们再作发布决定。', [
          ['I recommend keeping the update internal until Thursday.', '中心建议'],
          ['In our Tuesday trial, two of twenty uploads failed, and both involved large images.', '给出具体结果'],
          ['The other uploads finished, but we have not checked slower networks.', '补充已知与未知'],
          ['This means the current results do not yet cover all users.', '解释结果与发布范围的关系'],
          ['I will repeat the image tests on Wednesday and ask a colleague to check a slow connection.', '明确后续责任与动作'],
          ['We can make the release decision after those checks.', '收束到决策']
        ], '每句都服务于“先内部保留再决定发布”。失败样本、覆盖局限和下一步构成可评审理由，而非把二十次测试包装成全面验证。', '原创团队场景：周二小规模上传测试后，工程师给负责周四发布的同事写建议。'),
        example('路线选择：解释取舍', '这周末我更想走公园路线。河边路线在地图上短了十分钟，但今天下雨后它的石阶仍是湿的。公园路线更长，步道却更宽，还有几个能休息的地方。既然我们带着孩子一起走，这些特点比省几分钟更重要。我们仍应在周日上午查看天气；如果又下大雨，就应把散步改到另一天。', [
          ['I prefer the park route for our walk this weekend.', '表明选择'],
          ['The riverside route is ten minutes shorter on the map, but its stone steps are still wet after today\'s rain.', '承认替代方案优点并指出局限'],
          ['The park route is longer, yet it has a wider path and several places to rest.', '给出偏好的具体根据'],
          ['Since we are walking with our child, those features matter more than saving a few minutes.', '解释取舍标准'],
          ['We should still check the weather on Sunday morning and postpone the walk if heavy rain returns.', '保留条件与备用行动']
        ], '这不是宣称公园绝对安全，而是基于特定天气、路线与家庭目标作取舍。比较细节之后解释“为什么与我们有关”，才能支撑偏好。', '原创周六场景：今天刚下雨，家人计划周日上午散步，两条路均为熟悉步道。')
      ],
      contrasts: [
        {a: 'We should repeat the test. One of five uploads failed, so we need to investigate that failure before release.', b: 'We should repeat the test. Uploads are important. Technology changes quickly. Friday is a busy day.', aZh: '我们应该重测。五次上传中一次失败，所以发布前需要查明这次失败。', bZh: '我们应该重测。上传很重要。技术变化很快。周五很忙。', judgement: 'different', reason: '两段句法都能成立，但 a 用具体失败及发布任务解释建议，b 的泛泛句没有建立与重测的明确联系。b 需要补足联系，不能靠堆连接词变好。'},
        {a: 'I suggest an earlier reading time. Our child was tired at nine. We could try seven thirty next week.', b: 'Our child was tired at nine. Next week, we could try reading at seven thirty. I suggest moving reading time earlier.', aZh: '我建议提前阅读时间。孩子九点已经累了。下周可以试试七点半。', bZh: '孩子九点已经累了。下周我们可以试试七点半阅读。我建议提前阅读时间。', judgement: 'both', reason: '两种顺序都能围绕一个中心，a 先给建议，b 先给观察再得出建议。选哪种取决于读者已有知识与语气，主题句不是必须永远在第一句。'}
      ],
      transfer: {prompt: '同一个“围绕中心”的原则，可以按叙事、步骤或建议三种目的组织。', variants: [
        example('叙事按时间推进', '周六去图书馆时，我们的小计划变了。我们到达时儿童区还没开放，所以在入口附近选了一本地图书。孩子看到一幅河流地图，问河流通向哪里。我们沿着蓝线用手指追踪，直到工作人员打开儿童区。我们花了二十分钟看地图，而不是原计划的故事。这个意外等待反而成了这次外出最有趣的一段。', [
          ['Our library visit took an unexpected turn on Saturday.', '叙事中心'],
          ['When we arrived, the children\'s area was not open yet, so we chose a map book near the entrance.', '起因与最初行动'],
          ['Our child noticed a river map and asked where the river ended.', '推动事件的细节'],
          ['We followed the blue line with our fingers until the staff opened the area.', '接续行动'],
          ['We spent twenty minutes exploring maps instead of reading the story we had planned.', '交代变化结果'],
          ['That unexpected wait became the most interesting part of our visit.', '回扣意外变化']
        ], '这里不必硬套论点与实验数据，时间顺序和具体动作就能展开“计划外的收获”。最后一句是本次个人感受，不代表所有等待都有好处。', '原创周六回忆：一家人在图书馆入口等儿童区开放，临时看了地图书。'),
        example('过程按依赖步骤组织', '开始改稿之前，先用一个清楚的名称保存一份副本。然后通读整段，不要停下来逐个修改单词。在旁边写一句话，说明这段的主要目的。之后检查每句是否支持这个目的，或提供必要背景。意思清楚后，再核对时间、指代与句间联系。最后把修改稿和原稿比较，确认没有丢掉重要事实。', [
          ['Before revising your draft, save a copy with a clear name.', '修改前的准备'],
          ['Then read the whole paragraph without stopping to fix individual words.', '先理解整体'],
          ['Write one sentence beside it that states its main purpose.', '明确修订标准'],
          ['Next, check whether each sentence supports that purpose or supplies necessary background.', '依标准检查内容'],
          ['Once the meaning is clear, review the time expressions, pronouns, and links between sentences.', '再处理句子层面'],
          ['Finally, compare the revision with the original to make sure no important fact has disappeared.', '核验改写结果']
        ], '每一步依赖上一步：先有目的才判断句子是否相关，先保意思再润色。步骤词对应真实流程，不是装饰。', '原创写作练习：读者已完成一个英文短段落，想按一套可执行顺序修改。'),
        example('建议须说明适用范围', '我建议为客户指南制作一页纸的检查清单。在周一的支持例会中，两位同事说读者经常漏掉最后一步。这份报告值得关注，但它只涵盖了一个团队一周的联系。短清单可能让最后一步更显眼。我们可以把清单给三位新读者，请他们解释每一步。若他们仍然困惑，我们就应该修改说明，而不是再增加更多警告。', [
          ['I suggest making a one-page checklist for the customer guide.', '明确建议'],
          ['During Monday\'s support meeting, two colleagues said that readers often missed the final step.', '给出来源明确的现象'],
          ['That report is useful, but it covers only one team\'s contacts for one week.', '限制证据范围'],
          ['A short checklist might make the final step easier to notice.', '提出待验证的解释'],
          ['We could show it to three new readers and ask them to explain each step.', '提出具体检验'],
          ['If they remain confused, we should revise the instructions rather than add more warnings.', '约定后续决策']
        ], '清单是可试的建议，不是已证实解决方案。段落把同事报告、小样本局限、推断和验证分别交代，避免把“做了东西”写成“问题已解决”。', '原创工作场景：周一支持例会反映指南漏读问题，你向文档负责人提出一个小规模改进计划。')
      ]},
      challenge: [
        question('paragraph', 'probe', 'Which sentence best supports the recommendation with a relevant detail?', 'Your paragraph recommends testing the new upload page again before release. In five trials, one upload failed. Choose the next sentence.', [
          ['Our office has a new coffee machine.', '句子完整，但与上传重测建议没有建立联系。'],
          ['Technology is very important in the modern world.', '泛泛陈述，不解释为什么这次上传页面需要重测。'],
          ['One of five uploads failed, so we need to investigate the failure before release.', '具体失败及其发布影响直接支持重测建议。'],
          ['All users will definitely have the same problem.', '从一次失败推广到全部用户，超出给定记录。']
        ], 2, '支持中心需要相关细节与解释，而不只是正确的常识或强烈措辞。', '段落建议发布前重测；已知五次上传中一次失败，要选择支持建议的下一句。'),
        question('paragraph', 'transfer', 'Which revision keeps a clear centre and gives the reader a practical next step?', 'Draft: We want an earlier family reading time. Our child was tired at nine last week. We have not tried an earlier time yet. Write a short proposal for next week.', [
          ['We could try reading at seven thirty for a week, then ask everyone how it felt.', '围绕提前阅读的中心提出可实施尝试与回顾，未假装效果已被证明。'],
          ['Earlier reading will solve every bedtime problem immediately.', '夸大到全部睡前问题，且没有实际验证。'],
          ['Books have existed for a long time, and libraries contain many books.', '是相关领域的常识，却没有推进本段的具体家庭安排。'],
          ['We tried seven thirty every night last week and proved that it works.', '捏造已经尝试的事实，与题目明确尚未试过冲突。']
        ], 0, '段落收束到与中心相连的下一步即可，不必强行写成已经证实的结论。', '想提前家庭阅读时间，孩子上周九点已经累，但还没试过提前；为下周提出短建议。')
      ],
      nextUse: '尝试给一个真实读者写约120词英文，主题选“一个家庭小调整”或“一项工作改进”。先用中文写读者和目的，再按需要取舍：约20词交代中心，约25词给具体观察，约25词解释联系，约20词说局限，约30词写行动或请求。词数只是支架，不必凑满，也可按叙事或步骤改结构。完成后逐句写中文任务标签，检查来源、时间、否定、指代与证据力度；最后请读者复述你的中心。此开放练习没有自动评分，不代表完成后已掌握写作。'
    }
  ];

  r.EnglishPathData = r.EnglishPathData || [];
  r.EnglishPathData.push(...lessons);
})(typeof window !== 'undefined' ? window : globalThis);
