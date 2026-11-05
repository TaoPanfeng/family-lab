(function (r) {
  'use strict';

  // Original examples; reference links support usage, not these particular scenarios.
  const lessons = [
  {
    "id": "prepositions",
    "stage": 4,
    "order": 16,
    "title": "介词：把人和事放进关系里",
    "mission": "告诉对方在哪里、什么时候，以及和谁有关。",
    "intro": "朋友已经到车站了，你还需要知道他具体在哪里。几个小词能让同一幅画面变得清楚。",
    "child": "小词也能当路标！我说钥匙在包里面，你就不用跑到桌子上找啦。先想清楚它和谁、什么地方有关系。",
    "adult": "介词把后面的内容接成一种关系：空间、时间、话题、对象等。介词短语既能补充整个动作，也能限定某个名词。in、on、at 的空间图像有助理解，但用法还受说话视角和固定搭配约束，不能只按中文的‘在’或地方大小机械选择。",
    "steps": [
      "先确定要补充哪种关系：地点、时间还是对象。",
      "把介词和后面的名词短语一起读，检查它连到谁。",
      "检查常见搭配，并确认换介词是否换了意思。"
    ],
    "home": "向家人说明同一件东西在什么容器里、什么表面上、什么物体旁边，让对方照着找。",
    "work": "约会时把入口、日期和钟点说具体；处理依赖关系时查 wait for、depend on 这样的整体搭配。",
    "trap": "不能把中文一个‘在’固定换成 in。at the station 可以把车站当碰头地点，in the station 强调车站内部；两者不必描述不同的物理位置。",
    "limits": "in 常指内部、on 常指表面、at 常把地点看作一个点，但这是常见视角，不是几何定律。时间常见 at six、on Friday、in June；next Friday、every day 等时间表达通常不另加 at/on/in。交通、机构活动、固定搭配及英美差异需要另外查证。",
    "sources": [
      [
        "British Council：地点介词 in、on、at",
        "https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/prepositions-place"
      ],
      [
        "Cambridge：地点 at、on、in",
        "https://dictionary.cambridge.org/grammar/british-grammar/at-on-and-in-place"
      ],
      [
        "Cambridge：时间 at、on、in",
        "https://dictionary.cambridge.org/grammar/british-grammar/at-on-in-time"
      ],
      [
        "Cambridge：介词短语与补足内容",
        "https://dictionary.cambridge.org/grammar/british-grammar/prepositional-phrases"
      ]
    ],
    "principle": {
      "question": "我想用哪个参照物，说明怎样的关系？",
      "reason": "包、门口、晚饭本身只是事物；in、at、after 把它们分别变成内部位置、碰头地点、先后时间。先选关系再选小词，比按中文逐字替换可靠；有些关系的表达已经固定，还需要记住整组词。",
      "steps": [
        "找到被说明的人、物或动作。",
        "确定参照物：包、入口、某一天，还是讨论的话题。",
        "说明关系：内部、表面、时间点、之后、面向某人等。",
        "把整组短语放回句中检查，并查固定搭配。"
      ],
      "boundary": "空间图像是理解工具，不足以推导所有介词；同一地点可因说话视角采用不同介词。介词后不只可以是名词，也可以是代词或表示活动的 -ing 结构。"
    },
    "cases": [
      {
        "label": "把钥匙放进容器关系",
        "en": "The key is in the bag.",
        "zh": "钥匙在包里。",
        "parts": [
          {
            "text": "The key",
            "role": "被定位的东西"
          },
          {
            "text": "is",
            "role": "说明位置"
          },
          {
            "text": "in the bag.",
            "role": "包的内部"
          }
        ],
        "why": "bag 是参照物，in 把位置限定在包的内部。整组 in the bag 补足钥匙的位置，不是把 in 单独译成所有场合通用的‘在’。",
        "scene": "早上出门前，孩子看不见钥匙；你知道它放在拉链已经打开的包里面。"
      },
      {
        "label": "约定一个地点和钟点",
        "en": "Meet me at the gate at six.",
        "zh": "六点在大门口和我碰面。",
        "parts": [
          {
            "text": "Meet",
            "role": "向听者发出请求"
          },
          {
            "text": "me",
            "role": "碰面的对象"
          },
          {
            "text": "at the gate",
            "role": "作为集合点的大门"
          },
          {
            "text": "at six.",
            "role": "碰面的钟点"
          }
        ],
        "why": "前一个 at 把大门当作集合点，后一个 at 指钟点。两个短语都补充 meet。祈使句省去的是可理解的听者 you，并不是介词替代了句子的主语。",
        "scene": "下午五点你给朋友发消息，约他一小时后到公园大门口集合；不是让他爬到门上。"
      },
      {
        "label": "从位置关系走到话题关系",
        "en": "We talked about the new game after dinner.",
        "zh": "晚饭后，我们聊了那个新游戏。",
        "parts": [
          {
            "text": "We",
            "role": "聊天的人"
          },
          {
            "text": "talked",
            "role": "已经发生的聊天"
          },
          {
            "text": "about the new game",
            "role": "聊天的话题"
          },
          {
            "text": "after dinner.",
            "role": "晚饭之后的时间"
          }
        ],
        "why": "about 指话题，after 指先后顺序。两组内容回答不同问题：聊什么、什么时候聊。talk about 要作为常用组合学习，不能因为中文没有‘关于’就删掉 about。",
        "scene": "现在是晚上九点；一家人已经吃完晚饭，刚才讨论了周末买的新桌游。"
      }
    ],
    "contrasts": [
      {
        "a": "We are at the park.",
        "b": "We are in the park.",
        "aZh": "我们到公园这儿了。",
        "bZh": "我们在公园里面。",
        "judgement": "different",
        "reason": "两句都成立。a 常用于报告行程位置，把公园当一个地点；b 把公园看作有内部范围的地方。a 并不自动表示在公园外，也不保证已经进入内部。"
      },
      {
        "a": "We will meet on Friday.",
        "b": "We will meet next Friday.",
        "aZh": "我们星期五见面。",
        "bZh": "我们下个星期五见面。",
        "judgement": "both",
        "reason": "两句都是正常约时间的表达。a 用 on 接星期；b 的 next Friday 已直接作时间短语，通常不再加 on。next Friday 在实际对话中可能指即将到来或下一周的星期五，重要约定应补具体日期。"
      }
    ],
    "transfer": {
      "prompt": "保留‘说明关系’的思路，改变地点的观察方式，再换成等待的对象。",
      "variants": [
        {
          "label": "汇报行程上的一个点",
          "en": "We are at the station.",
          "zh": "我们在车站这儿。",
          "parts": [
            {
              "text": "We",
              "role": "被定位的人"
            },
            {
              "text": "are",
              "role": "说明位置"
            },
            {
              "text": "at the station.",
              "role": "行程上的车站这个点"
            }
          ],
          "why": "at 适合告诉接站的人你已经到车站一带；这句话没有精确承诺你在大厅内还是站前集合点。",
          "scene": "车刚到站，你先向来接你的朋友汇报地点，随后还会另说具体出口。"
        },
        {
          "label": "说明同一地点的内部范围",
          "en": "We are in the station.",
          "zh": "我们在车站里面。",
          "parts": [
            {
              "text": "We",
              "role": "被定位的人"
            },
            {
              "text": "are",
              "role": "说明位置"
            },
            {
              "text": "in the station.",
              "role": "车站的内部范围"
            }
          ],
          "why": "换成 in 后明确内部位置。不是‘车站更大所以用 in’，而是你现在需要区别站内和站外。",
          "scene": "朋友以为你在站外，你补充说自己已经进候车大厅，正在服务台旁边等。"
        },
        {
          "label": "改成动作指向的对象",
          "en": "I am waiting for the bus.",
          "zh": "我正在等公交车。",
          "parts": [
            {
              "text": "I",
              "role": "等待的人"
            },
            {
              "text": "am waiting",
              "role": "正在发生的等待"
            },
            {
              "text": "for the bus.",
              "role": "等待的对象"
            }
          ],
          "why": "for 说明等待针对什么；wait for 是常见搭配。不能用 bus 的大小或是否在内部来推导这里的介词。",
          "scene": "你站在公交站牌旁，车还没有来，向家人解释为什么暂时没有往家走。"
        }
      ]
    },
    "challenge": [
      {
        "id": "prepositions-probe",
        "kind": "probe",
        "prompt": "Which message gives the requested meeting place?",
        "context": "Ask your friend to wait at the entrance gate. The cafe is a different meeting place. Nobody needs to climb onto the gate.",
        "options": [
          {
            "text": "Wait for me at the gate.",
            "why": "at the gate 把大门当集合点，符合入口碰面的要求；wait for me 也说明等谁。"
          },
          {
            "text": "Wait for me on the gate.",
            "why": "on the gate 通常把人放在门的表面或门上方受支撑的位置，不是题中要求的门口集合。"
          },
          {
            "text": "Wait for me in the bag.",
            "why": "in the bag 指包的内部，改变了参照物，与大门入口无关。"
          },
          {
            "text": "Wait for me near the cafe.",
            "why": "句子成立，near 也能自然说明位置，但它约在咖啡馆附近，题中明确要在入口大门。"
          }
        ],
        "answer": 0,
        "explanation": "先判断需要‘把入口作为集合点’这层关系，再选 at。不能只看到中文‘在’就选 in 或 on。",
        "translation": "哪条消息给出了要求的集合地点？请朋友在入口大门等你；咖啡馆是另一个地点，也不需要爬到门上。正确表达：在大门口等我。",
        "skill": "prepositions"
      },
      {
        "id": "prepositions-transfer",
        "kind": "transfer",
        "prompt": "Which sentence gives the correct appointment time?",
        "context": "The call is scheduled for Friday at six. Thursday is not the correct day.",
        "options": [
          {
            "text": "The call is on six at Friday.",
            "why": "这里把常用时间搭配倒置了；钟点 six 通常接 at，星期 Friday 接 on。"
          },
          {
            "text": "The call is at six on Thursday.",
            "why": "这句时间搭配成立，但把星期五改成星期四，不符合题中的日程。"
          },
          {
            "text": "The call is at six on Friday.",
            "why": "at six 给钟点，on Friday 给星期，两个信息都符合日程。"
          },
          {
            "text": "The call is at Friday on six.",
            "why": "Friday 在这里不是 at 所接的钟点，six 也不是 on 所接的某一天，应改为 at six on Friday。"
          }
        ],
        "answer": 2,
        "explanation": "把星期与钟点分成两个关系组：on Friday、at six。换次序说 on Friday at six 也可以，关键是每组内部搭配和真实日程都正确。",
        "translation": "哪句说明了正确的约定时间？通话定在星期五六点，星期四不对。正确表达：通话在星期五六点。",
        "skill": "prepositions"
      }
    ],
    "nextUse": "写一条真实约见消息，说清地点、日期和钟点。再把地点换成内部位置，自己检查介词变化有没有改变信息；本框只供练说，不自动判分。"
  },
  {
    "id": "adverbs",
    "stage": 4,
    "order": 17,
    "title": "副词：调整动作、程度和焦点",
    "mission": "说清怎样做、多久一次，以及究竟只限谁。",
    "intro": "两个人都关上了门，一个怕吵醒宝宝，一个在着急。动作一样，传达的信息却可以很不一样。",
    "child": "我不光想说‘关门’，还想说‘轻轻地关门’。小词放得准，别人就能听懂我怎么做、是不是经常做。",
    "adult": "副词及副词短语可以补充动作的方式、频率、程度，也能限定某部分或评价整句话。位置受类型、信息重点和语境共同影响：quietly 说明怎样关门，usually 说明频率，only 限定焦点。不能把所有副词放到同一个位置，也不能把 -ly 当成判定副词的充分条件。",
    "steps": [
      "先问这个词补充方式、频率、程度，还是限定谁。",
      "找到它真正影响的内容，再选择自然的位置。",
      "换位置重读，检查重点是否变了，而非只检查有没有 -ly。"
    ],
    "home": "把‘我收好了玩具’分别说成轻轻收好、通常收好、只有我收好，听听三个信息差在哪里。",
    "work": "汇报时区分 nearly finished 和 finished：‘差不多完成’不能当成‘已经完成’；只允许某人操作时，把 only 的范围说清。",
    "trap": "hard 已可作‘努力地’的副词，hardly 通常是‘几乎不’。把 work hard 改成 work hardly，不是更标准，而是大幅改了意思。",
    "limits": "频率副词常在一般实义动词前、主要 be 后、首个助动词或情态动词后；方式副词常在动作及其宾语后，也能在适当语境前置。only 在口语中可放在动词前并依靠重音确定范围，不能只凭邻接机械断言唯一解读。friendly 通常是形容词；系动词后的形容词可说明主语，如 The soup smells good.。",
    "sources": [
      [
        "Cambridge：副词与副词短语的位置",
        "https://dictionary.cambridge.org/grammar/british-grammar/adverbs-and-adverb-phrases-position"
      ],
      [
        "Cambridge：only 的焦点",
        "https://dictionary.cambridge.org/us/grammar/british-grammar/only"
      ],
      [
        "Cambridge：hardly 不是 hard 的副词形式",
        "https://dictionary.cambridge.org/grammar/british-grammar/hardly"
      ],
      [
        "Cambridge：late 和 lately",
        "https://dictionary.cambridge.org/grammar/british-grammar/late-or-lately"
      ]
    ],
    "principle": {
      "question": "这个小词究竟改变哪一块意思？",
      "reason": "‘怎样做’连着动作，‘经常’连着发生频率，‘只有’排除某组替代选择。先找到它控制的信息范围，才能解释为什么移动位置有时自然、有时改变意思；位置不是孤立的排队口诀。",
      "steps": [
        "说出句子的基本事件。",
        "用自己的话解释增加的信息：方式、频率、程度或排除范围。",
        "按类型选常见位置，并保持动词与短宾语紧密相连。",
        "比较移动前后的解释；必要时补重音或改写消除歧义。"
      ],
      "boundary": "常见位置是起点，不是‘所有副词只能在这里’。某些副词可换位置，重音也能改变焦点；近似词形可能是完全不同的词。"
    },
    "cases": [
      {
        "label": "补充动作的方式",
        "en": "Maya closed the door quietly.",
        "zh": "玛雅轻轻地关上了门。",
        "parts": [
          {
            "text": "Maya",
            "role": "做动作的人"
          },
          {
            "text": "closed",
            "role": "过去的动作"
          },
          {
            "text": "the door",
            "role": "被关的东西"
          },
          {
            "text": "quietly.",
            "role": "关门的方式"
          }
        ],
        "why": "quietly 说明 closed 这个动作没有弄出大动静。这里放在短宾语 the door 后很自然；Maya quietly closed the door. 也成立，不能把后置说成唯一合法位置。",
        "scene": "昨晚宝宝已经睡着，玛雅走出房间时小心关门；现在你在讲述这件事。"
      },
      {
        "label": "补充发生的频率",
        "en": "I usually check the message after breakfast.",
        "zh": "我通常在早饭后查看那条消息。",
        "parts": [
          {
            "text": "I",
            "role": "有习惯的人"
          },
          {
            "text": "usually",
            "role": "通常发生的频率"
          },
          {
            "text": "check",
            "role": "习惯性的动作"
          },
          {
            "text": "the message",
            "role": "查看的内容"
          },
          {
            "text": "after breakfast.",
            "role": "日常时间"
          }
        ],
        "why": "usually 不描述查看得快慢，而描述这一安排经常出现。普通肯定句里通常放在 check 前；after breakfast 另外交代习惯发生的时间。",
        "scene": "班级每天早上发一条通知。你在向家人介绍平时如何安排查看，并不特指今天已经看过。"
      },
      {
        "label": "把焦点放在做事的人",
        "en": "Only Leo found the key.",
        "zh": "只有利奥找到了钥匙。",
        "parts": [
          {
            "text": "Only Leo",
            "role": "唯一找到的人"
          },
          {
            "text": "found",
            "role": "过去成功找到"
          },
          {
            "text": "the key.",
            "role": "找到的东西"
          }
        ],
        "why": "only 直接限制 Leo：在当前比较的这群人中，其他人没有找到。这句话不是说 Leo 只找到一件东西，也不是说世上只有一把钥匙。",
        "scene": "昨天下午三个人一起找钥匙。利奥找到了，另外两人没有；现在你在说明是谁找到的。"
      }
    ],
    "contrasts": [
      {
        "a": "I worked hard yesterday.",
        "b": "I hardly worked yesterday.",
        "aZh": "我昨天工作得很努力。",
        "bZh": "我昨天几乎没工作。",
        "judgement": "different",
        "reason": "hard 在 a 中已是表示努力程度的副词；hardly 在 b 中接近‘几乎不’，不是给 hard 加 -ly 后保持原义。两句都成立，但汇报的工作情况明显不同。"
      },
      {
        "a": "Only Leo found the blue key.",
        "b": "Leo found only the blue key.",
        "aZh": "只有利奥找到了那把蓝钥匙。",
        "bZh": "利奥只找到了那把蓝钥匙。",
        "judgement": "different",
        "reason": "a 排除其他找到的人；b 在当前寻找的物品中只肯定找到了蓝钥匙，没有说其他人找没找到。若写 Leo only found the blue key，日常口语还会靠重音和上下文确定范围，表达关键限制时宜主动改清楚。"
      }
    ],
    "transfer": {
      "prompt": "把频率放到 be 后，再观察助动词和 only 所带来的位置变化。",
      "variants": [
        {
          "label": "换成 be 描述状态",
          "en": "Maya is usually quiet after lunch.",
          "zh": "玛雅午饭后通常很安静。",
          "parts": [
            {
              "text": "Maya",
              "role": "被描述的人"
            },
            {
              "text": "is",
              "role": "连接状态"
            },
            {
              "text": "usually",
              "role": "这种状态常出现"
            },
            {
              "text": "quiet",
              "role": "主语的状态"
            },
            {
              "text": "after lunch.",
              "role": "观察的时间范围"
            }
          ],
          "why": "通常位置变成 be 后，不是见到频率副词就一律放在所有动词之前。quiet 是形容词，描述 Maya 的状态，并不是这里关门的方式。",
          "scene": "你观察了一星期午休情况，向老师介绍玛雅午饭后的常见状态。"
        },
        {
          "label": "换成带助动词的完成情况",
          "en": "Maya has already sent the photo.",
          "zh": "玛雅已经把照片发出去了。",
          "parts": [
            {
              "text": "Maya",
              "role": "发照片的人"
            },
            {
              "text": "has",
              "role": "完成形式的助动词"
            },
            {
              "text": "already",
              "role": "说明比当前预期更早完成"
            },
            {
              "text": "sent",
              "role": "发送的过去分词"
            },
            {
              "text": "the photo.",
              "role": "发送的东西"
            }
          ],
          "why": "already 常在首个助动词 has 后、主要动词形式 sent 前。这里回应‘还要不要提醒她’，发送已经完成，对现在有用。",
          "scene": "现在同事正准备提醒玛雅发照片，你确认照片刚刚已经发出，因而告诉他不必再提醒。"
        },
        {
          "label": "把限制焦点换成物品",
          "en": "Leo found only the blue key.",
          "zh": "利奥只找到了那把蓝钥匙。",
          "parts": [
            {
              "text": "Leo",
              "role": "找到的人"
            },
            {
              "text": "found",
              "role": "过去找到"
            },
            {
              "text": "only the blue key.",
              "role": "被找到的物品范围只限这一项"
            }
          ],
          "why": "only 靠近物品短语，明确限制找到什么。与 Only Leo found the key. 相比，排除的是其他寻找的物品，而不是其他人。",
          "scene": "你们昨天同时找蓝钥匙、红钥匙和卡片。利奥只找到蓝钥匙，另两件仍未找到。"
        }
      ]
    },
    "challenge": [
      {
        "id": "adverbs-probe",
        "kind": "probe",
        "prompt": "Which sentence describes the action naturally and accurately?",
        "context": "Nina put the glass on the shelf with care. She wanted to avoid breaking it.",
        "options": [
          {
            "text": "Nina placed carefully the glass on the shelf.",
            "why": "在这个普通短宾语结构中，把 carefully 插在 placed 与 the glass 之间不自然；可放在 Nina 后或 the glass 后。特殊长宾语等结构不能由这道题推广成一概禁止。"
          },
          {
            "text": "Nina placed the glass carefully on the shelf.",
            "why": "carefully 说明放置的方式，位于动词及其短宾语后，既自然又符合小心防碎的情境。"
          },
          {
            "text": "Nina placed the glass carelessly on the shelf.",
            "why": "句子成立，但 carelessly 是粗心地，和题中小心保护玻璃杯的做法相反。"
          },
          {
            "text": "Nina placed the glass careful on the shelf.",
            "why": "此处要说明怎样放，用 carefully；careful 通常描述人或事物的特征，不能在这里直接充当普通方式副词。"
          }
        ],
        "answer": 1,
        "explanation": "先锁定信息是‘小心地做动作’，再选择 carefully 并安排位置。Nina carefully placed the glass on the shelf. 也可自然表达同一事件，但本题选项里没有这句。",
        "translation": "哪句自然且准确地描述了这个动作？妮娜小心地把玻璃杯放到架子上，想避免摔碎。正确表达：妮娜小心地把杯子放在架子上。",
        "skill": "adverbs"
      },
      {
        "id": "adverbs-transfer",
        "kind": "transfer",
        "prompt": "Which sentence clearly says that no other person found the key?",
        "context": "Three people searched. Leo found the key. The other two people did not find it.",
        "options": [
          {
            "text": "Leo found only the key.",
            "why": "这句成立，但限制的是找到的物品：只找到钥匙。它没有明确排除另外两个人也找到钥匙。"
          },
          {
            "text": "Leo found the only key.",
            "why": "这句成立，却把 only 放进名词短语，说明相关范围中只有这一把钥匙，不说明谁是唯一找到的人。"
          },
          {
            "text": "Leo only found the key.",
            "why": "这句可以成立，但只看文字时，only 的焦点可依重音和语境变化，不如把 only 直接放在 Leo 前明确限定人。"
          },
          {
            "text": "Only Leo found the key.",
            "why": "Only Leo 明确把焦点放在找钥匙的人身上，排除同一搜索组中的另外两人。"
          }
        ],
        "answer": 3,
        "explanation": "信息重点是‘谁’，就写 Only Leo。选择题中的其他句子不必全都语法错误；它们限制的范围不同或不够明确。",
        "translation": "哪句清楚表示其他人都没找到钥匙？三个人寻找，只有利奥找到，另外两人没找到。正确表达：只有利奥找到了钥匙。",
        "skill": "adverbs"
      }
    ],
    "nextUse": "用真实小事各写一句：怎样完成、通常何时做、只有谁做了。给 only 的焦点画圈，再自己换一次位置，说明意思是否改变；本框不自动判分。"
  },
  {
    "id": "infinitives",
    "stage": 4,
    "order": 18,
    "title": "不定式：想做什么，为什么去做",
    "mission": "表达意愿、安排任务和行动目的。",
    "intro": "‘我打开窗户’只告诉别人发生了什么。你还可以接着说明，自己为什么这样做，或者希望谁来帮忙。",
    "child": "我想造小船，还没动手也可以先说计划！我去拿胶水，是为了把小船粘好。先分清是谁想、谁做、为了什么。",
    "adult": "to 加动词原形可组成不定式结构，补充想做的事、说明某人的任务，或给行动加目的。它不是一个独立的带时态谓语；谁来执行、何时发生，要结合上层动词、句型与语境确定。语义帮助解释作用，但 want to do、ask someone to do 等选择仍有词汇约定，不能看到‘要’或‘为了’就机械套用。",
    "steps": [
      "先确定第二个动作是内容、任务，还是目的。",
      "指出谁执行第二个动作，别默认永远与主句相同。",
      "检查前词要求的结构，并用时间和语境解释意思。"
    ],
    "home": "说一件你想和家人一起做的事，再说为此做了什么准备。把想做的内容和准备行动的目的区分开。",
    "work": "分派任务时区分 I want to check 和 I want you to check：谁检查不同，任务归属也不同。",
    "trap": "to 有两份不同工作：want to do 中是构成不定式的标记；look forward to doing 中是介词，不能把它们只凭同一个拼写混为一谈。help someone do 与 help someone to do 都可成立。",
    "limits": "不定式不等于将来时：She seems to know the answer. 可以说明现在知道。普通目的不定式的隐含执行者通常是主句主语，表达别人做事时要另说清；不是所有动词后都接 to do。情态动词后用原形，help 后带不带 to 均可，let 和主动 make 等另有搭配。",
    "sources": [
      [
        "Cambridge：带 to 与不带 to 的不定式",
        "https://dictionary.cambridge.org/uk/grammar/british-grammar/infinitives-"
      ],
      [
        "British Council：目的不定式",
        "https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/infinitive-purpose"
      ],
      [
        "Cambridge：不定式与 -ing 的动词搭配",
        "https://dictionary.cambridge.org/grammar/british-grammar/verb-patterns-verb-infinitive-or-verb-ing"
      ],
      [
        "Cambridge：look forward to 的搭配",
        "https://dictionary.cambridge.org/grammar/british-grammar/word-patterns-look-forward-to"
      ]
    ],
    "principle": {
      "question": "第二个动作在这句话中做什么工作，由谁执行？",
      "reason": "I want 后面需要说清愿望的内容；I opened the window 已能报告事件，后面的 to cool the room 另外解释目的。两者形状一样，句中功能不同。识别功能与执行者，才不会把每个 to do 都叫‘为了做’。",
      "steps": [
        "先读主句，找出已经说出的事件或意愿。",
        "问第二个动作是在补充什么内容，还是解释为何行动。",
        "分别指出上层动作与不定式动作的执行者。",
        "查前词搭配，再检查否定范围与实际时间。"
      ],
      "boundary": "不定式本身不标定过去、现在或将来。词语允许怎样的补足结构需要积累；help 可带或不带 to，不能据此把所有 to 都删掉。"
    },
    "cases": [
      {
        "label": "补全愿望的内容",
        "en": "I want to build a small boat.",
        "zh": "我想造一艘小船。",
        "parts": [
          {
            "text": "I",
            "role": "有愿望的人"
          },
          {
            "text": "want",
            "role": "表达意愿"
          },
          {
            "text": "to build a small boat.",
            "role": "愿望的内容，执行者也是我"
          }
        ],
        "why": "want 后面用 to build 说明想做什么。它不是说‘我为了造船而想’，也不证明船已经造好；这一结构通常把 I 理解成 build 的执行者。",
        "scene": "今天周末，你还没有开始动手，正在向家人说下午想完成的小制作。"
      },
      {
        "label": "给已经报告的行动加目的",
        "en": "I opened the window to cool the room.",
        "zh": "我打开了窗户，想让房间凉快一点。",
        "parts": [
          {
            "text": "I",
            "role": "采取行动的人"
          },
          {
            "text": "opened",
            "role": "过去已经做的动作"
          },
          {
            "text": "the window",
            "role": "被打开的东西"
          },
          {
            "text": "to cool the room.",
            "role": "开窗的目的"
          }
        ],
        "why": "I opened the window 已能独立报告事件，后面的不定式回答‘为什么开窗’。开窗已经发生，让房间变凉是行动的目的，并不保证目的已经实现。",
        "scene": "十分钟前室内很闷，你开了窗；现在家人问为什么窗户开着，你解释当时的用意。"
      },
      {
        "label": "第二个动作由别人执行",
        "en": "I asked Ben to carry the box.",
        "zh": "我请本帮忙搬箱子。",
        "parts": [
          {
            "text": "I",
            "role": "发出请求的人"
          },
          {
            "text": "asked",
            "role": "过去提出请求"
          },
          {
            "text": "Ben",
            "role": "被请求、要搬箱子的人"
          },
          {
            "text": "to carry the box.",
            "role": "请求他做的事"
          }
        ],
        "why": "ask someone to do 先指出请求对象，再说明任务。ask 的执行者是 I，carry 的执行者是 Ben。仅仅提出请求不能证明 Ben 已经搬了箱子。",
        "scene": "刚才搬家时箱子很重，你向本提出帮忙请求；现在只复述请求，还没有说明他是否答应。"
      }
    ],
    "contrasts": [
      {
        "a": "Mum helped me fix the toy.",
        "b": "Mum helped me to fix the toy.",
        "aZh": "妈妈帮我修好了玩具。",
        "bZh": "妈妈帮我修好了玩具。",
        "judgement": "both",
        "reason": "help someone 后原形和 to 加原形都成立，核心意思相同。这是 help 允许的搭配选择，不能据此推出 want me fix 或 ask me fix 也成立；句中是否确已修好还要看上下文，本场景设定已完成。"
      },
      {
        "a": "I remembered to call Dad.",
        "b": "I remembered calling Dad.",
        "aZh": "我记得去给爸爸打电话，后来也打了。",
        "bZh": "我想起自己给爸爸打过电话。",
        "judgement": "different",
        "reason": "a 把打电话当成待办事项，记起后执行；b 把已经发生的打电话当作回忆内容。不能仅凭整个句子用了过去式，就把两种后接结构当成同义替换。"
      }
    ],
    "transfer": {
      "prompt": "换一个执行者、加入否定，再用 help 的另一种合法形式。",
      "variants": [
        {
          "label": "换成她的期待",
          "en": "She hopes to see the moon tonight.",
          "zh": "她希望今晚能看到月亮。",
          "parts": [
            {
              "text": "She",
              "role": "抱有希望的人"
            },
            {
              "text": "hopes",
              "role": "当前的期待"
            },
            {
              "text": "to see the moon",
              "role": "希望发生的事，执行者是她"
            },
            {
              "text": "tonight.",
              "role": "所期待的时间"
            }
          ],
          "why": "hope 后接 to see，今晚的时间来自 tonight 和当前情境，不是 to 自带将来时。希望能看见也不保证天气配合。",
          "scene": "现在是白天，她正在准备今晚观察月亮；天空是否会放晴还不知道。"
        },
        {
          "label": "否定的是要做的事情",
          "en": "We decided not to share the photo.",
          "zh": "我们决定不分享这张照片。",
          "parts": [
            {
              "text": "We",
              "role": "作决定的人"
            },
            {
              "text": "decided",
              "role": "过去作出决定"
            },
            {
              "text": "not to share the photo.",
              "role": "决定的内容是不分享"
            }
          ],
          "why": "not 放在 to 前构成常见否定不定式，否定 share。它明确作出了‘不分享’的决定；We did not decide to share the photo. 只否定作出分享的决定，信息并不完全相同。",
          "scene": "昨晚大家看过合照，考虑到朋友还没有同意，最后共同决定先不发到群里。"
        },
        {
          "label": "help 后保留 to",
          "en": "Mum helped me to fix the toy.",
          "zh": "妈妈帮我修好了玩具。",
          "parts": [
            {
              "text": "Mum",
              "role": "提供帮助的人"
            },
            {
              "text": "helped",
              "role": "过去提供帮助"
            },
            {
              "text": "me",
              "role": "得到帮助、参与修理的人"
            },
            {
              "text": "to fix the toy.",
              "role": "获得帮助完成的事"
            }
          ],
          "why": "helped me to fix 与 helped me fix 都是可接受的标准搭配。这里 me 是得到帮助并参与修理的人，不应因看到主句主语 Mum 就说只有妈妈修。",
          "scene": "昨天下午你和妈妈一起把玩具修好，今天向朋友介绍妈妈给你的帮助。"
        }
      ]
    },
    "challenge": [
      {
        "id": "infinitives-probe",
        "kind": "probe",
        "prompt": "Which sentence asks the listener to do the action?",
        "context": "Ben is beside the closed window. You want Ben to open it. You are speaking directly to Ben.",
        "options": [
          {
            "text": "I want to open the window.",
            "why": "句子成立，但通常是我自己想开窗，没有把开窗任务交给正在听话的 Ben。"
          },
          {
            "text": "I want you open the window.",
            "why": "普通标准表达中 want someone 后接 to 加原形，不能照搬 help someone do 的无 to 形式。"
          },
          {
            "text": "I want you to open the window.",
            "why": "you 指正在听话的 Ben；want you to open 清楚表达希望他来开窗。语气较直接，更客气可另说 Could you open the window?。"
          },
          {
            "text": "I want you to opening the window.",
            "why": "want you to 后这里是构成不定式的 to，应接原形 open，而非 opening。"
          }
        ],
        "answer": 2,
        "explanation": "先找第二个动作的执行者：要 Ben 开窗，就说 want you to open。是否客气和结构是否成立是两个问题，真实请求还应结合关系选择语气。",
        "translation": "哪句请听话的人执行动作？本在关着的窗户旁，你直接对他说，希望他打开窗户。正确表达：我想让你打开窗户。",
        "skill": "infinitives"
      },
      {
        "id": "infinitives-transfer",
        "kind": "transfer",
        "prompt": "Which sentence explains the purpose of the pause?",
        "context": "You paused your walk because you needed to call home. After the call, you continued walking.",
        "options": [
          {
            "text": "I stopped to call home.",
            "why": "to call home 说明停下原来走路的目的：为了给家里打电话。"
          },
          {
            "text": "I stopped calling home.",
            "why": "这句成立，但表示停止给家里打电话，不是暂停走路去打电话。"
          },
          {
            "text": "I stopped for call home.",
            "why": "for 不能这样直接接 call home 的动词原形结构。可另说 stopped for a call，但这不是当前选项的形式。"
          },
          {
            "text": "I stopped to calling home.",
            "why": "这里要用目的不定式 to call；并非所有拼写为 to 的词都像 look forward to 中的介词那样接 -ing。"
          }
        ],
        "answer": 0,
        "explanation": "先还原事件链：走路，暂停，打电话，再走路。to call 是暂停的目的；calling 跟在 stopped 后则把打电话当成被停止的活动。",
        "translation": "哪句解释暂停的目的？你暂停散步，给家里打电话，之后继续走。正确表达：我停下来给家里打电话。",
        "skill": "infinitives"
      }
    ],
    "nextUse": "写三句真实表达：你想做什么、你请谁做什么、你做一件事是为了什么。逐句标出第二个动作的执行者，自己检查它是否清楚；本框不自动判分。"
  },
  {
    "id": "ing",
    "stage": 4,
    "order": 19,
    "title": "-ing：动作怎样成为一句话的一部分",
    "mission": "谈论活动、困难与期待，分清做事和正在做事。",
    "intro": "‘读故事让我开心’和‘我正在读故事’都谈到读，却在做不同的表达工作。先看整句话要传递什么。",
    "child": "‘游泳’可以是一件我喜欢的事，也可以是我现在正做的事。看到小尾巴 -ing，先别急着说‘正在’，看看它在句子里帮什么忙！",
    "adult": "-ing 是一种形式，并不只有一种功能：可把活动作为主语或补足内容，也可与 be 组成进行形式，或描述某个人和物。传统教学把活动作名词性用途称为动名词，把进行、描述等用途称为现在分词；名称不同不能代替功能分析。enjoy doing、have trouble doing 等结构有词汇搭配约束，并非每个 -ing 都来自删除介词或删除 who is。",
    "steps": [
      "先找句子的主干，检查 -ing 是主语、补足内容，还是描述。",
      "若前面有 be，检查它是否与 -ing 一起表示正在进行的动作。",
      "检查前词搭配，区分介词 to 和不定式 to，别随意补词或删词。"
    ],
    "home": "分别说‘我喜欢画画’和‘我正在画画’，让家人听出你在谈爱好还是此刻的活动。",
    "work": "说明实际遇到的困难时用 have trouble opening the file 一类表达；要表达费心做事，则另用 take the trouble to do，不只换一个后缀。",
    "trap": "have trouble (in) doing 中 in 可以出现，传统教学常称无 in 为省略；也可直接把无 in 的 -ing 结构分析为补充‘困难在哪件事上’的内容。这不是所有 -ing 都藏着 in 的证据；enjoy reading 不能随意改成 enjoy in reading。",
    "limits": "-ing 本身不等于‘现在’或‘正在’，时间由句中其他部分确定。look forward to 中的 to 是介词，后接活动时用 doing；want to do 中的 to 是不定式标记。某些 -ing 描述语可改说 who is doing，但这只是特定语境的改写，不是所有 -ing 的统一来源。搭配意义不能完全靠逻辑推导。",
    "sources": [
      [
        "British Council：-ing 的名词性、描述性与动词搭配",
        "https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/ing-forms"
      ],
      [
        "Cambridge：trouble 的 doing 与 take the trouble to do",
        "https://dictionary.cambridge.org/dictionary/learner-english/trouble"
      ],
      [
        "Cambridge：have difficulty doing 和 in doing 均可",
        "https://dictionary.cambridge.org/us/grammar/british-grammar/word-patterns-have-difficulty-doing-something"
      ],
      [
        "PONS：have trouble (in) doing 的词典搭配",
        "https://en.pons.com/translate/english-chinese/trouble"
      ],
      [
        "Cambridge：look forward to 后接 -ing",
        "https://dictionary.cambridge.org/grammar/british-grammar/word-patterns-look-forward-to"
      ],
      [
        "Cambridge：动词后接不定式或 -ing 的意义差异",
        "https://dictionary.cambridge.org/grammar/british-grammar/verb-patterns-verb-infinitive-or-verb-ing"
      ]
    ],
    "principle": {
      "question": "这里在把动作当作一件事谈，描述一个对象，还是把动作放进进行形式？",
      "reason": "句子需要能谈论‘做这件事’，不能总把每个动词都当成一个独立谓语。-ing 结构能保留动作和宾语，同时在更大的句子中承担别的工作；至于 enjoy、trouble、look forward to 后为什么选它，还要尊重英语已有的搭配约定。",
      "steps": [
        "先指出整句主语与主要谓语。",
        "说出 -ing 结构在句中承担的工作，而非先翻成‘正在’。",
        "若有介词，连同它一起检查；若没有，不凭空假设介词被删。",
        "比较 to do 时，检查前词是否允许，以及事件关系是否改变。"
      ],
      "boundary": "活动作名词性用途不代表它变成了普通名词：reading stories 仍可带宾语 stories。相同的 -ing 拼写不保证相同功能；可选 in 的分析局限于允许该形式的具体搭配。"
    },
    "cases": [
      {
        "label": "把活动放在主语位置",
        "en": "Swimming helps me relax.",
        "zh": "游泳有助于我放松。",
        "parts": [
          {
            "text": "Swimming",
            "role": "被谈论的活动，作主语"
          },
          {
            "text": "helps",
            "role": "说明活动的作用"
          },
          {
            "text": "me",
            "role": "获得帮助的人"
          },
          {
            "text": "relax.",
            "role": "得到帮助后做的事"
          }
        ],
        "why": "Swimming 指游泳这项活动，整句在谈它的作用，不断言我此刻在游泳。helps 才是本句带现在时变化的主要谓语；help 后的 relax 可带 to，也可不带。",
        "scene": "你正坐在家里聊天，介绍每周游泳给自己的感受，并没有在水中边游边说。"
      },
      {
        "label": "补充喜欢的内容",
        "en": "I enjoy reading stories.",
        "zh": "我喜欢读故事。",
        "parts": [
          {
            "text": "I",
            "role": "有这种喜好的人"
          },
          {
            "text": "enjoy",
            "role": "主要谓语，表达喜欢"
          },
          {
            "text": "reading stories.",
            "role": "喜欢的活动内容"
          }
        ],
        "why": "reading stories 整体说明 enjoy 的内容，reading 仍带宾语 stories。enjoy 的常用搭配选择 -ing；不是因为有隐藏的 in，也不能只凭‘喜欢以后要做’改为 enjoy to read。",
        "scene": "课间大家谈各自喜欢的休闲方式，你说自己爱读故事，不是在报告这一秒正在阅读。"
      },
      {
        "label": "说清困难发生在哪件事上",
        "en": "I have trouble opening this jar.",
        "zh": "我打开这个罐子有困难。",
        "parts": [
          {
            "text": "I",
            "role": "遇到困难的人"
          },
          {
            "text": "have trouble",
            "role": "主要谓语，说明有困难"
          },
          {
            "text": "opening this jar.",
            "role": "补充困难涉及的活动"
          }
        ],
        "why": "opening this jar 指出困难在哪件事上，have trouble doing 是现行搭配。带 in 的形式也可用；无 in 时不必把 opening 说成‘正在打开’或强行还原成一个完整从句。困难也不必等于最终失败。",
        "scene": "厨房里罐盖很紧，你试了几次仍觉得费劲，向家人求助；稍后是否打开还没确定。"
      }
    ],
    "contrasts": [
      {
        "a": "I have trouble opening this jar.",
        "b": "I have trouble in opening this jar.",
        "aZh": "我打开这个罐子有困难。",
        "bZh": "我在打开这个罐子这件事上有困难。",
        "judgement": "both",
        "reason": "两句都可表达这件事难做，日常表达常直接用 a。带 in 时，opening 是介词后的活动内容；传统教学可把 a 说成省略 in，也可直接分析为 -ing 补足困难内容。这里的可选性不能推广到 enjoy reading，不能凭空造出 enjoy in reading。"
      },
      {
        "a": "I stopped playing the game.",
        "b": "I stopped to play the game.",
        "aZh": "我停止玩那个游戏了。",
        "bZh": "我停下手头的事，去玩那个游戏。",
        "judgement": "different",
        "reason": "a 的 playing 是被停止的活动；b 的 to play 是停止另一件事的目的。两句都成立，却给出相反的事件走向，不能用‘动词后都一样’来互换。"
      }
    ],
    "transfer": {
      "prompt": "把同一种词形分别放进期待、进行和人物描述中，逐次说明它承担的功能。",
      "variants": [
        {
          "label": "介词 to 后的活动",
          "en": "We look forward to meeting your team.",
          "zh": "我们期待与你们团队见面。",
          "parts": [
            {
              "text": "We",
              "role": "怀有期待的人"
            },
            {
              "text": "look forward to",
              "role": "期待这一固定表达，to 是介词"
            },
            {
              "text": "meeting your team.",
              "role": "被期待的活动"
            }
          ],
          "why": "可说 look forward to the meeting，谈活动时用 meeting your team。这里 to 是介词，不是 want to meet 里的不定式标记；见面尚未发生，进一步说明 -ing 不自带‘正在’。",
          "scene": "现在双方刚确认下周的交流，你在邮件结尾表达期待；团队还没有见面。"
        },
        {
          "label": "与 be 一起组成进行形式",
          "en": "She is opening the jar now.",
          "zh": "她现在正在开那个罐子。",
          "parts": [
            {
              "text": "She",
              "role": "执行动作的人"
            },
            {
              "text": "is opening",
              "role": "be 与 -ing 合作构成现在进行形式"
            },
            {
              "text": "the jar",
              "role": "要打开的东西"
            },
            {
              "text": "now.",
              "role": "眼前这个时刻"
            }
          ],
          "why": "这里 is 与 opening 一起报告眼前进行中的动作，不是把 opening 单独当主语或困难内容。句子没有断言罐盖已经成功打开。",
          "scene": "你站在厨房门口，看到姐姐双手握着罐子正尝试拧盖，向另一位家人描述眼前画面。"
        },
        {
          "label": "描述是哪一个男孩",
          "en": "The boy holding the red kite is my brother.",
          "zh": "拿着红风筝的那个男孩是我弟弟。",
          "parts": [
            {
              "text": "The boy",
              "role": "被识别的人"
            },
            {
              "text": "holding the red kite",
              "role": "描述男孩、帮助辨认"
            },
            {
              "text": "is",
              "role": "整句的主要谓语"
            },
            {
              "text": "my brother.",
              "role": "说明身份"
            }
          ],
          "why": "holding the red kite 修饰 boy，主句主干仍是 The boy is my brother。这一眼前场景可改说 who is holding，但不能由这一个可行改写推出所有 -ing 都是删除 who is。",
          "scene": "公园里有几个男孩，你指给朋友看：现在拿着红风筝的那一个是你的弟弟。"
        }
      ]
    },
    "challenge": [
      {
        "id": "ing-probe",
        "kind": "probe",
        "prompt": "Which closing uses the requested expression correctly?",
        "context": "Your team will visit us on Friday. Write a warm closing with the expression look forward to.",
        "options": [
          {
            "text": "We look forward to see you on Friday.",
            "why": "look forward to 的 to 是介词，后面谈见面活动时用 seeing；不能照搬 want to see 的不定式形式。"
          },
          {
            "text": "We look forward to seeing you on Friday.",
            "why": "seeing you 补充期待的活动，符合 look forward to 的搭配，也表达了对星期五来访的期待。"
          },
          {
            "text": "We want to see you on Friday.",
            "why": "want to see 语法成立，也可表达想见面，但题目要求用 look forward to 作期待性的邮件结尾；这句换了表达方式与语气。"
          },
          {
            "text": "We look forward seeing you on Friday.",
            "why": "这里遗漏固定表达中的介词 to；不能因为 seeing 是 -ing 就推断介词可以省去。"
          }
        ],
        "answer": 1,
        "explanation": "先识别 to 的工作：介词 to 后用表示活动的 -ing；不定式标记 to 后接原形。相同拼写不保证相同语法身份。",
        "translation": "哪句正确使用了要求的表达作结尾？你们团队星期五来访，请用 look forward to 写一句热情的结束语。正确表达：我们期待星期五见到你们。",
        "skill": "ing"
      },
      {
        "id": "ing-transfer",
        "kind": "transfer",
        "prompt": "Which sentence reports the difficulty?",
        "context": "The file will not open when Nora clicks it. Report the difficulty without saying that she made a special effort.",
        "options": [
          {
            "text": "Nora has trouble to open the file.",
            "why": "在表示做某事有困难的 have trouble 结构中，通常用 opening，不用 to open。另一个 take the trouble to do 结构不能混进来。"
          },
          {
            "text": "Nora took the trouble to open the file.",
            "why": "这句成立，但表达她费心去打开文件，重心是付出努力，不是题中要求报告的打开困难。"
          },
          {
            "text": "Nora has trouble open the file.",
            "why": "have trouble 后不能在这个结构里直接接原形 open；这里需要表示困难所涉活动的 opening。"
          },
          {
            "text": "Nora has trouble opening the file.",
            "why": "opening the file 补充说明她做哪件事遇到困难，符合操作失败提示的情境；不必假设它本来有一个被删掉的完整从句。"
          }
        ],
        "answer": 3,
        "explanation": "have trouble doing 报告难处，take the trouble to do 强调费心。词组的整体结构和意思一起记，既不能只背后缀，也不能把每个 -ing 都说成省略介词。",
        "translation": "哪句报告了困难？诺拉点击后文件打不开，请说出这个困难，而不是说她特意费心去做。正确表达：诺拉打开这个文件有困难。",
        "skill": "ing"
      }
    ],
    "nextUse": "围绕同一件事写三句：你喜欢做、你做起来有困难、你此刻正在做。再写一个 look forward to 的真实期待，逐句说出 -ing 的工作；本框不自动判分。"
  },
  {
    "id": "connections",
    "stage": 5,
    "order": 20,
    "title": "连接关系：原因、结果与转折",
    "mission": "让听者知道两个事实为什么放在一起。",
    "intro": "两句话都听懂了，听者还可能不知道你是在解释、补充，还是表达意外。先决定两件事的关系。",
    "child": "我说“路结冰了”，你还不知道我想干什么；再说“所以坐火车”，两块意思就牵起手啦。先想这只小手是在说为什么、结果呢，还是竟然这样。",
    "adult": "连接词同时标明意义关系和结构关系。because 把原因分句接到主要陈述上；so 引出结果；but 可并列词、短语或分句；although 把让步事实设为背景，再突出与预期不同的主要陈述。意义相近不代表连接位置和标点可以互换，先辨认每段在整句承担什么工作。",
    "steps": [
      "先各自说清两个事实，避免把时间先后误当成因果。",
      "问自己：第二件事是原因、结果、补充，还是违背第一件事带来的预期？",
      "选连接方式后检查完整主句、分句层次和标点，再读出重心。"
    ],
    "home": "解释今天为什么提前离开公园，再说一件虽然不理想却仍然开心的事。",
    "work": "汇报故障时分开说观测事实、原因判断与处理结果；连接词不能代替证据。",
    "trap": "中文“虽然……但是……”不能逐词搬成同一层次的 Although A, but B。这里的 although 已把 A 接为 B 的让步背景，标准表达保留 Although A, B 或改为 A, but B。",
    "limits": "限制针对同一对分句的重复连接，不是禁止 although 与 but 在同一句出现。Although Mei was tired, she was cheerful but quiet. 中 although 连接分句，but 连接 cheerful 和 quiet，层次不同。however 可提示转折，但在本课完整分句间不能直接替代 but 而只留一个逗号。",
    "sources": [
      [
        "Cambridge：Conjunctions",
        "https://dictionary.cambridge.org/grammar/british-grammar/coordinating-conjunctions"
      ],
      [
        "Cambridge：Conjunctions: contrasting",
        "https://dictionary.cambridge.org/grammar/british-grammar/conjunctions-contrasting"
      ],
      [
        "Cambridge：Causes, reasons, results and purpose",
        "https://dictionary.cambridge.org/grammar/british-grammar/conjunctions-causes-reasons-results-and-purpose"
      ]
    ],
    "principle": {
      "question": "为什么“意思差不多”的连接词不能随便互换？",
      "reason": "听者需要两张地图：事实之间有什么关系，以及哪段是主要陈述、哪段是附属说明。because 与 although 各把自己引出的分句接到主句上；but 并列同类结构。换词后，事实可能没变，结构和说话重心已经变了。",
      "steps": [
        "先把每段还原成完整事实：谁、发生什么。",
        "给关系命名：原因、结果、意外转折或简单补充。",
        "找主要想让听者记住的一段，其他信息决定放在什么层次。",
        "检查连接词接的是词、短语还是分句，避免把两种结构叠在同一接口。"
      ],
      "boundary": "连接表达有约定，不能只靠中文译义推导；因果词表达的是说话者给出的解释，并不自动证明因果成立。"
    },
    "cases": [
      {
        "label": "解释一个选择",
        "en": "I stayed home because the road was icy.",
        "zh": "我待在家里，因为路面结冰了。",
        "parts": [
          {
            "text": "I",
            "role": "谁"
          },
          {
            "text": "stayed home",
            "role": "主要选择"
          },
          {
            "text": "because",
            "role": "引入原因"
          },
          {
            "text": "the road was icy.",
            "role": "完整的原因事实"
          }
        ],
        "why": "主句先告诉对方我的选择；because 后解释这个选择的原因。路面结冰不是第二个平行话题，而是回答“为什么待在家”。",
        "scene": "昨晚降温，今天早上出门前发现路面结冰；你解释今天为何没有外出。"
      },
      {
        "label": "从事实走向结果",
        "en": "The road was icy, so we took the train.",
        "zh": "路面结冰了，所以我们坐了火车。",
        "parts": [
          {
            "text": "The road was icy,",
            "role": "原因事实"
          },
          {
            "text": "so",
            "role": "引出结果"
          },
          {
            "text": "we took the train.",
            "role": "采取的行动"
          }
        ],
        "why": "so 后是由前面情况引出的结果或决定。这里先有路况问题，再说明出行选择；不能保持这套意思却把 so 分句随意搬到前面。",
        "scene": "今天早上看到结冰路面后，一家人改乘火车；晚上回顾出行决定。"
      },
      {
        "label": "承认坏消息并突出反应",
        "en": "Although the test failed, the team stayed calm.",
        "zh": "虽然测试失败了，团队仍保持冷静。",
        "parts": [
          {
            "text": "Although",
            "role": "引入让步背景"
          },
          {
            "text": "the test failed,",
            "role": "已经承认的事实"
          },
          {
            "text": "the team stayed calm.",
            "role": "主要陈述的反应"
          }
        ],
        "why": "失败可能让人慌乱，实际反应却是冷静。although 不是否认失败，而是承认它，再突出结果没有顺着常见预期发展。",
        "scene": "今天下午自动测试失败，大家一起定位问题；你在晚间复盘中评价团队反应。"
      }
    ],
    "contrasts": [
      {
        "a": "Although the bus was late, we arrived on time.",
        "b": "The bus was late, but we arrived on time.",
        "aZh": "虽然公交车晚点了，我们还是准时到了。",
        "bZh": "公交车晚点了，但我们准时到了。",
        "judgement": "both",
        "reason": "两句都成立，也都呈现意外对照。A 把晚点当作让步背景，重心在准时；B 先陈述晚点，再用 but 转向准时，两段并列。不能因为中文都有“但”就认定结构完全相同。"
      },
      {
        "a": "Although the bus was late, we arrived on time.",
        "b": "Although the bus was late, but we arrived on time.",
        "aZh": "虽然公交车晚点了，我们还是准时到了。",
        "bZh": "原意：虽然公交车晚点了，但是我们还是准时到了。",
        "judgement": "repair",
        "reason": "在标准英语里，B 用 although 与 but 重复连接同一对分句，需修成 A，或去掉 although 写成 The bus was late, but we arrived on time.。这不否定 but 在句内另一个层次连接词语的用法。"
      }
    ],
    "transfer": {
      "prompt": "分别把家庭原因、产品评价和两种连接层次说清楚。",
      "variants": [
        {
          "label": "原因放前面",
          "en": "Because my son was tired, we left the park early.",
          "zh": "因为儿子累了，我们提前离开了公园。",
          "parts": [
            {
              "text": "Because my son was tired,",
              "role": "先给出原因"
            },
            {
              "text": "we left the park early.",
              "role": "主句说明行动"
            }
          ],
          "why": "because 分句可先出现，为后面的行动铺背景；这里两个事实和因果关系都完整，并不需要再在主句前加 so。",
          "scene": "周日傍晚儿子玩累了，你向家人解释为什么比原计划早离开。"
        },
        {
          "label": "连接两个评价",
          "en": "The service is simple but reliable.",
          "zh": "这项服务简单，但很可靠。",
          "parts": [
            {
              "text": "The service",
              "role": "被评价的对象"
            },
            {
              "text": "is",
              "role": "连接对象与评价"
            },
            {
              "text": "simple",
              "role": "第一个评价"
            },
            {
              "text": "but",
              "role": "并列转折"
            },
            {
              "text": "reliable.",
              "role": "第二个评价"
            }
          ],
          "why": "but 连接的是两个评价词，不是两条完整分句。“简单”可能让人担心能力有限，“可靠”补上正面评价，结构保持同类并列。",
          "scene": "评审会上，你评价刚上线的内部服务：功能少，却一直稳定。"
        },
        {
          "label": "同一句里分层连接",
          "en": "Although Mei was tired, she was cheerful but quiet.",
          "zh": "虽然梅很累，她却心情愉快，只是不太说话。",
          "parts": [
            {
              "text": "Although Mei was tired,",
              "role": "让步背景"
            },
            {
              "text": "she was",
              "role": "主要陈述的主体与连接"
            },
            {
              "text": "cheerful",
              "role": "主要评价"
            },
            {
              "text": "but quiet.",
              "role": "同一主句内的补充对照"
            }
          ],
          "why": "although 连接“累”与整条主要陈述；but 只连接主句里的两个评价。两个连接词各管不同层次，所以并没有重复连接同一对分句。",
          "scene": "梅昨晚照顾孩子没睡好；今天聚餐时她笑着听大家说话，却很少开口。"
        }
      ]
    },
    "challenge": [
      {
        "id": "connections-probe",
        "kind": "probe",
        "prompt": "Which sentence best explains why you left early?",
        "context": "Your son felt tired at the park. You left before sunset because he needed rest.",
        "options": [
          {
            "text": "We left early because our son was tired.",
            "why": "直接把儿子疲倦作为提前离开的原因，符合题目要解释“为什么”的目标。"
          },
          {
            "text": "We left early although our son was tired.",
            "why": "结构可以成立，但把疲倦当作本来会阻碍早走的让步背景，关系与题设不同。"
          },
          {
            "text": "Because our son was tired, so we left early.",
            "why": "在这里 because 与 so 重复连接同一原因和结果；标准写法去掉其中一个。"
          },
          {
            "text": "We left early our son was tired.",
            "why": "两条完整陈述直接相接，缺少此处所需的连接或分句标点。"
          }
        ],
        "answer": 0,
        "explanation": "先辨意义关系：疲倦是离开的原因，不是被克服的阻碍。because 后跟原因分句，主句不再重复放 so。",
        "translation": "我们提前离开了，因为儿子累了。",
        "skill": "connections"
      },
      {
        "id": "connections-transfer",
        "kind": "transfer",
        "prompt": "Which sentence best reports the unexpected result in standard English?",
        "context": "A software test failed this afternoon. You expected panic, yet the team remained calm.",
        "options": [
          {
            "text": "The test failed because the team stayed calm.",
            "why": "句法可成立，却把冷静写成测试失败的原因，颠倒了题设要报告的关系。"
          },
          {
            "text": "Although the test failed, but the team stayed calm.",
            "why": "although 与 but 在这里重复连接同一对分句，不适合本题要求的标准写法。"
          },
          {
            "text": "Although the test failed, the team stayed calm.",
            "why": "承认测试失败，再突出团队冷静与预期慌乱不同，关系和结构都符合题设。"
          },
          {
            "text": "The test failed, however the team stayed calm.",
            "why": "however 能表达转折，但不能在这里仅靠一个逗号连接两条完整分句；可改句号，或写成 failed; however, the team stayed calm。"
          }
        ],
        "answer": 2,
        "explanation": "转折不只靠选词，还要看结构。although 把失败设为让步背景，完整主句陈述团队冷静；however 作为衔接副词有自己的标点安排。",
        "translation": "虽然测试失败了，团队仍保持冷静。",
        "skill": "connections"
      }
    ],
    "nextUse": "写两句真实近况：一句解释原因，一句承认困难并说出意外结果。自己圈出主句，检查连接词各自管哪一段；请同伴复述，看他听到的关系是否与你一致。"
  },
  {
    "id": "relatives",
    "stage": 5,
    "order": 21,
    "title": "关系从句：说清是哪一个",
    "mission": "用一条补充描述准确指出人或东西。",
    "intro": "桌上有三本书，办公室里有两位同事。只说“那本”“那位”不够时，要给听者一个能认出来的线索。",
    "child": "我想要的不是随便一本书，是“我昨天买的那本书”。把这段小线索挂在书后面，别人就知道递给我哪一本啦。线索里面谁在做事，也要说清楚哦。",
    "adult": "关系从句把一条描述接在名词后，既与前面的对象建立联系，也在从句内部留下该对象承担的角色。who/which/that 在基础教学中常叫关系代词。限定性从句中，它们若代表宾语，常可省略；若代表主语，不能在本课这种有自己带时态谓语的完整从句中直接删掉。逗号隔开的非限定性从句提供补充说明，通常不能省略关系词，也不用 that。",
    "steps": [
      "先确定要指认的人或东西，再决定是在筛选哪一个，还是补充已知对象的信息。",
      "把描述暂时还原成单句，找出该对象在描述中是做事的人，还是被动作涉及的对象。",
      "选关系词并接回名词后；需要省略时检查从句主语是否仍完整，避免重复放 he、she 或 it。"
    ],
    "home": "请家人拿“我昨天读过的那本书”，再指出“正在浇花的那个人”。",
    "work": "区分“我昨天修复的接口”与“昨天报错的接口”，别把修复者和报错对象弄反。",
    "trap": "不能只背“关系词后有动词就不能省略”这一表面口诀；根本要看谁承担从句主语。The book I bought ... 里 I 已是主语，书是买的对象；The book that fell ... 里 that 才承担 fell 的主语角色。",
    "limits": "本课讲常见完整关系从句。The person standing there 这类不带独立时态的动词形式可另作简化描述，不能当成从 The person who is standing there 随意删主语的一般许可证。限定性 which 和 that 都可用于事物，具体风格偏好有差异；不把 which 一概判错。",
    "sources": [
      [
        "British Council：Defining relative clauses",
        "https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/relative-clauses-defining-relative-clauses"
      ],
      [
        "Cambridge：Relative pronouns",
        "https://dictionary.cambridge.org/grammar/british-grammar/relative-pronouns"
      ],
      [
        "Cambridge：Defining and non-defining relative clauses",
        "https://dictionary.cambridge.org/grammar/british-grammar/relative-clauses-defining-and-non-defining"
      ]
    ],
    "principle": {
      "question": "为什么有时关系词能省，有时一删整句就坏了？",
      "reason": "关系从句像给名词挂上一张说明卡。卡片里面仍要有完整的参与者关系。I bought the book 里书是被买的对象，改成 the book I bought 时主语 I 还在；the book fell 里书自己是主语，接成 the book that fell 后，直接删 that 会让这条完整从句失去主语标记。",
      "steps": [
        "先把说明卡拆成单句，补回前面的名词。",
        "找动词，再问“谁在做事”和“动作涉及谁”。",
        "限定性从句里，若关系词是宾语且有自己的主语，可以考虑省略。",
        "若是主语，或是逗号隔开的补充说明，本课完整从句保留关系词。"
      ],
      "boundary": "省略规则看从句内部角色，不看前面的名词在主句里是主语还是宾语；也不等于所有关系词、所有从句都能按同一规则省略。"
    },
    "cases": [
      {
        "label": "用动作对象筛选书",
        "en": "The book that I bought yesterday is on the desk.",
        "zh": "我昨天买的那本书在书桌上。",
        "parts": [
          {
            "text": "The book",
            "role": "要指认的东西"
          },
          {
            "text": "that I bought yesterday",
            "role": "筛选是哪本书"
          },
          {
            "text": "is on the desk.",
            "role": "主句说明位置"
          }
        ],
        "why": "先还原 I bought the book yesterday：I 是买的人，书是被买的对象。因此 that 在描述中对应宾语，限定性从句里可说 The book I bought yesterday is on the desk.，但不能再在 bought 后重复加 it。",
        "scene": "昨天你买了一本书，今天桌上放着它；家人问的是这本新书在哪里。"
      },
      {
        "label": "描述自己做事的人",
        "en": "The neighbour who waters our plants has a spare key.",
        "zh": "帮我们浇花的那位邻居有一把备用钥匙。",
        "parts": [
          {
            "text": "The neighbour",
            "role": "要指认的人"
          },
          {
            "text": "who waters our plants",
            "role": "说明是哪位邻居"
          },
          {
            "text": "has a spare key.",
            "role": "主句给出的信息"
          }
        ],
        "why": "还原为 The neighbour waters our plants，邻居本来就是 waters 的主语。who 把这个角色带进从句，直接删掉会让这个完整从句缺少主语；也不应写 who he waters。",
        "scene": "楼里住着几位邻居，其中一位在你出差时照看植物；你告诉家人钥匙在谁手里。"
      },
      {
        "label": "给已知的人补充信息",
        "en": "My sister, who lives in Suzhou, visits us on Sundays.",
        "zh": "我姐姐住在苏州，她每周日来看我们。",
        "parts": [
          {
            "text": "My sister,",
            "role": "已确定的人"
          },
          {
            "text": "who lives in Suzhou,",
            "role": "插入的补充信息"
          },
          {
            "text": "visits us on Sundays.",
            "role": "主句的习惯事实"
          }
        ],
        "why": "这里已确定谈论的是姐姐，逗号中的从句补充她住在哪里，不用来从几位姐姐中筛选。非限定性从句保留 who，不换成 that；主句的 visits 仍由 My sister 决定。",
        "scene": "你只有一位姐姐；她长期住苏州，通常周日来上海和家人相聚。"
      }
    ],
    "contrasts": [
      {
        "a": "The book that I borrowed is useful.",
        "b": "The book I borrowed is useful.",
        "aZh": "我借的那本书很有用。",
        "bZh": "我借的那本书很有用。",
        "judgement": "both",
        "reason": "A 和 B 都是限定性描述，borrowed 的主语 I 都保留着，书是被借的对象，因此宾语位置的 that 可省。两句核心意义相同；这不能推广成删掉任何 who 或 that。"
      },
      {
        "a": "The neighbour who helped us is kind.",
        "b": "The neighbour helped us is kind.",
        "aZh": "帮助我们的那位邻居很友善。",
        "bZh": "原意：帮助我们的那位邻居很友善。",
        "judgement": "repair",
        "reason": "在本课要表达的一条完整句子里，B 直接删了从句主语位置的 who，导致 helped us 与主句 is kind 没有正确衔接。修成 A；若改成 The neighbour helped us and is kind.，则是另一种并列结构。"
      }
    ],
    "transfer": {
      "prompt": "把对象、动作角色或说明性质换一换，检查哪一段在修饰名词。",
      "variants": [
        {
          "label": "省掉宾语位置关系词",
          "en": "The report you sent this morning answers my question.",
          "zh": "你今天早上发的报告回答了我的问题。",
          "parts": [
            {
              "text": "The report",
              "role": "要指认的东西"
            },
            {
              "text": "you sent this morning",
              "role": "筛选是哪份报告"
            },
            {
              "text": "answers my question.",
              "role": "主句说明作用"
            }
          ],
          "why": "还原 you sent the report，you 是主语，report 是宾语。省略的是联系宾语的关系词，不是把 sent 的主语删了；主句动词仍是 answers。",
          "scene": "今天上午同事发来多份材料，你现在指出其中哪份解决了疑问。"
        },
        {
          "label": "关系词承担主语",
          "en": "The file that contains the photos is missing.",
          "zh": "存着那些照片的那个文件找不到了。",
          "parts": [
            {
              "text": "The file",
              "role": "要指认的对象"
            },
            {
              "text": "that contains the photos",
              "role": "描述文件自身的内容"
            },
            {
              "text": "is missing.",
              "role": "主句说明状态"
            }
          ],
          "why": "文件自身 contains the photos，that 承担 contains 的主语角色，不能在这个完整从句中直接省略。前面描述再长，也不要把主句 is missing 丢掉。",
          "scene": "共享盘里有多个文件，昨天还在的照片文件今天找不到了。"
        },
        {
          "label": "介词留在后面",
          "en": "The colleague I spoke to knows the answer.",
          "zh": "我刚才交谈的那位同事知道答案。",
          "parts": [
            {
              "text": "The colleague",
              "role": "要指认的人"
            },
            {
              "text": "I spoke to",
              "role": "含尾部介词的描述"
            },
            {
              "text": "knows the answer.",
              "role": "主句说明能力"
            }
          ],
          "why": "还原 I spoke to the colleague，I 是主语，同事是 to 的对象。限定性从句中可以省略宾语关系词，把 to 留在末尾；较正式的表达是 The colleague to whom I spoke knows the answer.，不能写 to that。",
          "scene": "会议室里有几位同事，你刚和其中一位说过话，现在指引新人去问他。"
        }
      ]
    },
    "challenge": [
      {
        "id": "relatives-probe",
        "kind": "probe",
        "prompt": "Which sentence identifies the book you bought yesterday?",
        "context": "There are several books on the desk. You bought one of them yesterday. That book has a blue cover.",
        "options": [
          {
            "text": "The book bought me yesterday has a blue cover.",
            "why": "把书变成买东西的行动者，还把 me 变成被买对象，角色与题设不同。"
          },
          {
            "text": "The book I bought yesterday has a blue cover.",
            "why": "I 是 bought 的主语，书是被买对象；限定性从句可省去宾语位置的关系词，准确筛选那本书。"
          },
          {
            "text": "The book that I bought it yesterday has a blue cover.",
            "why": "that 已联系被买的书，再用 it 重复占据 bought 的宾语位置，不适合这个关系从句。"
          },
          {
            "text": "The book that fell yesterday has a blue cover.",
            "why": "语法成立，也能筛选一本书，但线索变成昨天掉下来的书，题设没有提供这件事。"
          }
        ],
        "answer": 1,
        "explanation": "判断省略先看 bought 的参与者：I 买了书，主语没有缺失。I bought 后不再重复添加指向同一本书的 it。",
        "translation": "我昨天买的那本书有蓝色封面。",
        "skill": "relatives"
      },
      {
        "id": "relatives-transfer",
        "kind": "transfer",
        "prompt": "Which sentence identifies the neighbour by the help she gave you?",
        "context": "You have several neighbours. One neighbour helped you carry a table yesterday. You want to say that this neighbour has your spare key.",
        "options": [
          {
            "text": "The neighbour I helped yesterday has my spare key.",
            "why": "结构成立，但表示我帮助了邻居，帮助方向与题设正好相反。"
          },
          {
            "text": "The neighbour helped me yesterday has my spare key.",
            "why": "helped 的主语关系词被直接删去，两条动词结构没有正确衔接，需保留 who 或 that。"
          },
          {
            "text": "The neighbour who she helped me yesterday has my spare key.",
            "why": "who 已承担从句主语角色，再加 she 重复这个主语，不符合这里的标准关系从句。"
          },
          {
            "text": "The neighbour who helped me yesterday has my spare key.",
            "why": "who 代表帮助我的邻居，是 helped 的主语；完整保留后，主句 has my spare key 才能清楚接上。"
          }
        ],
        "answer": 3,
        "explanation": "谁帮助谁决定结构：邻居帮助我，所以 who 是从句主语，不能在这里省略。不是只看到 yesterday 就选某种固定句式。",
        "translation": "昨天帮过我的那位邻居有我的备用钥匙。",
        "skill": "relatives"
      }
    ],
    "nextUse": "从家里或工作中挑两样容易混淆的人或东西，用英文各加一条描述。再把描述拆回单句，口头指出谁做事、动作涉及谁，自己判断关系词能否省略。"
  },
  {
    "id": "content-clauses",
    "stage": 5,
    "order": 22,
    "title": "内容从句：把一整件事放进句子",
    "mission": "说明自己知道、相信或想弄清的具体内容。",
    "intro": "“我知道”还没说完，别人会问“知道什么”。有时候要填进去的不是一个词，而是一整件事。",
    "child": "“我知道一件事”里的“一件事”，可以换成“门已经开了”。把整件小事装进大句子里，我就能说清自己知道什么、还想问什么啦。",
    "adult": "内容从句用一整条命题或疑问补足知道、相信、问题等表达的内容，传统教学常把其中一些按功能叫宾语从句、表语从句等。I know that ... 陈述知道的内容；I wonder whether ... 提出未定的两种可能；I know where ... 指向某项疑问信息的答案。嵌入式疑问通常用陈述语序，不能把独立问句的倒装直接塞进去。",
    "steps": [
      "先说完整的外层态度或动作：我知道、我相信、我想弄清、问题是。",
      "辨认填入的是确定陈述、是否两种可能，还是地点时间等信息。",
      "把内部从句按自己的主语和动词组织起来，再检查整句到底是陈述还是提问。"
    ],
    "home": "告诉家人你知道接送时间，但还想确认是否需要带雨具。",
    "work": "区分“我知道服务已恢复”与“我想确认服务是否已恢复”，别把猜测汇报成事实。",
    "trap": "Could you tell me where the file is? 中外层是礼貌提问，内层 where the file is 仍用陈述语序。不能把 Where is the file? 的 is the file 原样搬入。",
    "limits": "that 的省略取决于具体结构和清晰度：在 I think (that) ... 这类常见动词补语中常可省略，不能推成所有位置的 that 都可删。who 本身是疑问从句主语时，如 I know who opened the door.，已经是主语在动词前，并不需要另加主语或辅助 do。",
    "sources": [
      [
        "Cambridge：That-clauses",
        "https://dictionary.cambridge.org/grammar/british-grammar/that-clauses"
      ],
      [
        "Cambridge：Reported speech: indirect speech",
        "https://dictionary.cambridge.org/grammar/british-grammar/indirect-speech-reporting-questions"
      ],
      [
        "Cambridge：If or whether?",
        "https://dictionary.cambridge.org/grammar/british-grammar/if-or-whether"
      ],
      [
        "Cambridge：Ellipsis",
        "https://dictionary.cambridge.org/grammar/british-grammar/ellipsis"
      ]
    ],
    "principle": {
      "question": "为什么一整句话能出现在“知道什么”的位置？",
      "reason": "句子里的位置承担功能，不是每个位置只能放一个单词。I know the answer 里的 the answer 是知道的对象；换成 that the door is open，就把知道的内容说完整。内部从句有自己的主语和动词，但它不是突然跳出来独立向听者提问，所以疑问内容通常保留陈述语序。",
      "steps": [
        "找外层主要表达，问它还缺什么内容。",
        "用“这件事”临时替换那段内容，确认它在外层承担的作用。",
        "再看内容属于陈述、是否疑问，还是某项未知信息。",
        "保留内部自己的主语与动词，区分外层问句语序和内层陈述语序。"
      ],
      "boundary": "名称帮助识别功能，不表示所有从句都相同。the report that I read 中 that 联系被读的报告；the news that the shop closed 中 that 后是消息的具体内容，两者不能仅凭外形判断。"
    },
    "cases": [
      {
        "label": "把确定内容告诉对方",
        "en": "I know that the door is open.",
        "zh": "我知道门开着。",
        "parts": [
          {
            "text": "I",
            "role": "外层的知道者"
          },
          {
            "text": "know",
            "role": "外层主要动作"
          },
          {
            "text": "that",
            "role": "引入知道的内容"
          },
          {
            "text": "the door is open.",
            "role": "内部完整陈述"
          }
        ],
        "why": "这里 know 的对象不是 door 这个物品，而是“门开着”这件事。that 引入内容，并不在从句里代替门；the door is open 自己已有主语和状态。",
        "scene": "你刚亲眼看过门；家人担心门是否关着，你确认自己知道它开着。"
      },
      {
        "label": "把是否作为未知内容",
        "en": "I wonder whether the museum is open today.",
        "zh": "我想知道博物馆今天是否开放。",
        "parts": [
          {
            "text": "I wonder",
            "role": "外层表达想弄清楚"
          },
          {
            "text": "whether",
            "role": "引入两种可能"
          },
          {
            "text": "the museum is open today.",
            "role": "内部按陈述顺序表达的内容"
          }
        ],
        "why": "whether 把“开”与“没开”作为待确认的可能，wonder 没有把开放说成事实。内部是 the museum is，而不是 is the museum；在这里也常可用 if 表示是否。",
        "scene": "今天早上准备带孩子去博物馆，但还没查到当天开放信息。"
      },
      {
        "label": "外层提问，内层装入问题内容",
        "en": "Could you tell me where the meeting room is?",
        "zh": "你能告诉我会议室在哪里吗？",
        "parts": [
          {
            "text": "Could you",
            "role": "外层礼貌提问的开头"
          },
          {
            "text": "tell me",
            "role": "希望对方做的事"
          },
          {
            "text": "where",
            "role": "内容涉及地点"
          },
          {
            "text": "the meeting room is?",
            "role": "内部主语和动词的顺序"
          }
        ],
        "why": "整个句子通过 Could you 提问，where 引入要获取的地点信息。内部 the meeting room 是主语，is 放在它后面；结尾问号属于整个礼貌请求。",
        "scene": "你第一次到新办公楼，站在前台礼貌询问会议室的位置。"
      }
    ],
    "contrasts": [
      {
        "a": "I know that the shop is open.",
        "b": "I wonder whether the shop is open.",
        "aZh": "我知道商店开着。",
        "bZh": "我想知道商店是否开着。",
        "judgement": "different",
        "reason": "两句都正确，但知识状态不同：A 说话者把开门当作已知，B 仍在开放与未开放之间求证。换 that 与 whether 时不能忽略外层 know 与 wonder 的含义。"
      },
      {
        "a": "Could you tell me where the lift is?",
        "b": "Could you tell me where is the lift?",
        "aZh": "你能告诉我电梯在哪里吗？",
        "bZh": "原意：你能告诉我电梯在哪里吗？",
        "judgement": "repair",
        "reason": "B 在嵌入式地点疑问里沿用了独立问句倒装；标准表达修成 A。直接问 Where is the lift? 则正确，因为那时整条地点疑问本身就是外层问句。"
      }
    ],
    "transfer": {
      "prompt": "把确定程度、外层态度和从句功能换一换，不只替换名词。",
      "variants": [
        {
          "label": "陈述相信的内容",
          "en": "We believe the new plan will save time.",
          "zh": "我们相信新计划会节省时间。",
          "parts": [
            {
              "text": "We believe",
              "role": "外层表达判断"
            },
            {
              "text": "the new plan",
              "role": "内部主语"
            },
            {
              "text": "will save time.",
              "role": "内部预测内容"
            }
          ],
          "why": "believe 后补足相信的整件事，常见的内容标记 that 在这里省略了。will 属于内部对新计划的预测；省略 that 不会把相信升级为已经证实。",
          "scene": "团队今天评审新流程，尚未实施；你说明大家对未来效果的判断。"
        },
        {
          "label": "询问是否，保留未来意义",
          "en": "I do not know if the supplier will call tomorrow.",
          "zh": "我不知道供应商明天是否会来电话。",
          "parts": [
            {
              "text": "I do not know",
              "role": "外层说明不知道"
            },
            {
              "text": "if",
              "role": "这里表示是否"
            },
            {
              "text": "the supplier",
              "role": "内部主语"
            },
            {
              "text": "will call tomorrow.",
              "role": "内部待确定的未来内容"
            }
          ],
          "why": "这里 if 等于 whether，内容是我不知道的事情，不是给“来电话”设条件。所以内部可以用 will 表达明天的预测，不能套用未来条件分句的常见现在时模式。",
          "scene": "今天下班前，供应商尚未确认明天是否回电，你如实汇报尚未知晓。"
        },
        {
          "label": "把内容放在说明问题的位置",
          "en": "The problem is that we have only one key.",
          "zh": "问题是我们只有一把钥匙。",
          "parts": [
            {
              "text": "The problem",
              "role": "外层谈论的事项"
            },
            {
              "text": "is",
              "role": "连接事项和具体内容"
            },
            {
              "text": "that we have only one key.",
              "role": "解释问题是什么"
            }
          ],
          "why": "that 后不是在描述哪一把钥匙，而是用“我们只有一把钥匙”这件事说明问题的内容。内容从句不仅能接在 know 后，也可放在这样的说明位置。",
          "scene": "两个人要分头办事，却只能共用一把钥匙，你说明安排困难的根源。"
        }
      ]
    },
    "challenge": [
      {
        "id": "content-clauses-probe",
        "kind": "probe",
        "prompt": "Which sentence reports the fact you have just checked?",
        "context": "You looked at the front door one minute ago. It was open, and you can still see it open now. Tell your family what you know.",
        "options": [
          {
            "text": "I wonder whether the door is open.",
            "why": "语法正确，但表达尚未确认，与刚检查且仍看得见门开着的题设不符。"
          },
          {
            "text": "I know whether is the door open.",
            "why": "whether 从句在这里不采用独立问句的倒装；还应按题意报告已知事实，而非是否答案。"
          },
          {
            "text": "I know that the door is open.",
            "why": "把门开着作为已经核实的内容，用 that 从句补足 know，准确符合题设。"
          },
          {
            "text": "I know that the door it is open.",
            "why": "the door 已是内部主语，再加 it 重复主语，不是这里的标准陈述结构。"
          }
        ],
        "answer": 2,
        "explanation": "先辨说话者知道什么，再选结构。题设要求报告已核实的“门开着”，不是表达待解的是否疑问。",
        "translation": "我知道门开着。",
        "skill": "content-clauses"
      },
      {
        "id": "content-clauses-transfer",
        "kind": "transfer",
        "prompt": "Which question politely asks for the lift location?",
        "context": "You are at a hotel desk. You do not know the location of the lift. Ask the receptionist to tell you.",
        "options": [
          {
            "text": "Could you tell me where the lift is?",
            "why": "外层 Could you 礼貌提问，内层 where the lift is 用陈述语序，获取的正是电梯位置。"
          },
          {
            "text": "Could you tell me where is the lift?",
            "why": "在嵌入式地点疑问里重复使用独立问句倒装，不符合此处标准语序。"
          },
          {
            "text": "Could you tell me whether the lift is working?",
            "why": "结构正确，也很礼貌，但问的是电梯能否运行，不是电梯在哪里。"
          },
          {
            "text": "Could you tell me that where the lift is?",
            "why": "that 与 where 在这里不能这样叠加引入同一疑问内容；直接接 where 从句即可。"
          }
        ],
        "answer": 0,
        "explanation": "这是一条外层问句里装入地点疑问的结构。疑问意义由 where 保留，内层无需再次把 is 提到主语前。",
        "translation": "你能告诉我电梯在哪里吗？",
        "skill": "content-clauses"
      }
    ],
    "nextUse": "先写一条你确实知道的事实，再写一条你仍想确认的事，最后向同伴礼貌询问一个地点。自己检查每个外层表达究竟在断言、判断还是求证。"
  },
  {
    "id": "conditions",
    "stage": 5,
    "order": 23,
    "title": "条件表达：如果怎样，便怎样",
    "mission": "区分日常规律、现实计划与另一种可能。",
    "intro": "“下雨就改计划”和“要是住得近就好了”都谈可能，却反映不同的现实判断。先确定你站在哪条时间线上。",
    "child": "“如果明天下雨，我们就在家玩”，是在准备一个可能用得上的办法。“如果我有翅膀就飞过去”，是在想象另一种世界。先看看自己是在做计划，还是开想象的小门吧。",
    "adult": "条件分句设定讨论范围，主句说明在该范围下的结果、能力或行动。常见现在时条件可谈规律，也可谈尚未确定的未来；过去形式配 would/could 常把现在或未来设想得离现实更远，并不一定在说过去。过去完成形式配 would have 则常回看与已知过去不同的可能。先看时间、现实态度和语义，再认常见形式。",
    "steps": [
      "先定条件发生在平常、未来、现在的设想，还是已经结束的过去。",
      "再定说话者把它看作开放的现实可能，还是与现实拉开距离的假设。",
      "让结果形式表达你真正的意思：习惯、预测、能力、建议或回看；不要机械地逢 if 就套一种模板。"
    ],
    "home": "为明天的天气写一个真实备用计划，再写一个改善居住条件的假想愿望。",
    "work": "给上线方案说明条件、后果和回退动作；不要把“如果满足条件”汇报成“已经满足条件”。",
    "trap": "If we lived closer, we could walk to school. 里的 lived 可表示现在住得不近这一假设，并非“我们过去住得近”。过去形式有时表达与现实的距离，时间要结合整句判断。",
    "limits": "本课示范常见模式，不穷尽混合条件、礼貌条件或上下文变体。未来条件中通常用现在形式，不等于 if 后永远不能有 will：意愿用法可说 If you will wait here, I will get the key.；I do not know if it will rain. 的 if 是“是否”，也不是条件分句。",
    "sources": [
      [
        "British Council：Conditionals: zero, first and second",
        "https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/conditionals-zero-first-second"
      ],
      [
        "Cambridge：Conditionals: if",
        "https://dictionary.cambridge.org/grammar/british-grammar/conditionals-if"
      ],
      [
        "Cambridge：Conditionals",
        "https://dictionary.cambridge.org/grammar/british-grammar/conditional-sentences"
      ],
      [
        "British Council：Verbs in time clauses and if clauses",
        "https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/verbs-time-clauses-if-clauses"
      ]
    ],
    "principle": {
      "question": "为什么 if 后用现在形式，也能说未来的事？",
      "reason": "条件部分先搭一个“假定如此”的范围，主句再在范围内预测或决定。If it rains tomorrow, we will stay home. 中 tomorrow 已给出未来时间，rains 不需要再用 will 才能指未来。这是英语的常见约定；另一组过去形式还能标示与现实的距离，不能把词形和时间一一死绑。",
      "steps": [
        "在纸上标出现在、未来、过去，确定条件属于哪处。",
        "问这是反复发生的规律、可执行的未来分支，还是离现实较远的设想。",
        "分别写条件和结果，确认前者没有被当成已发生事实。",
        "核对动词形式表达的是时间、假设距离还是意愿，必要时查具体用法。"
      ],
      "boundary": "if 不自动表示条件已成立，would 不自动表示过去；提出带条件的判断，也不能据此断定条件或结果已经发生。语言能说明安排或预测，不能替代事实核查。"
    },
    "cases": [
      {
        "label": "说家庭习惯",
        "en": "If I finish work early, I cook dinner.",
        "zh": "如果我早下班，我就做晚饭。",
        "parts": [
          {
            "text": "If I finish work early,",
            "role": "反复出现的条件"
          },
          {
            "text": "I cook dinner.",
            "role": "习惯性结果"
          }
        ],
        "why": "两部分现在时在此描述平常的安排：每逢较早结束工作，我通常负责晚饭。没有 tomorrow 等特定未来时间，也没有 will，因此重点不是明天的一次承诺。",
        "scene": "你向朋友介绍家里长期的晚饭分工，不是在承诺今天一定早下班。"
      },
      {
        "label": "为未来准备分支",
        "en": "If it rains tomorrow, we will play at home.",
        "zh": "如果明天下雨，我们就在家玩。",
        "parts": [
          {
            "text": "If it rains tomorrow,",
            "role": "未来尚未确定的条件"
          },
          {
            "text": "we will play at home.",
            "role": "该条件下的未来安排"
          }
        ],
        "why": "明天是否下雨仍开放；rains 在条件分句中用现在形式指未来，will 放在结果里表达计划。句子没有断言明天一定下雨，也没有说不下雨时一定怎么做。",
        "scene": "今天晚上，一家人准备明天去公园，同时商量下雨时的备用安排。"
      },
      {
        "label": "把现在想象得不同",
        "en": "If we lived closer, we could walk to school.",
        "zh": "如果我们住得近些，就能步行上学了。",
        "parts": [
          {
            "text": "If we lived closer,",
            "role": "与当前情况拉开距离的设想"
          },
          {
            "text": "we could walk to school.",
            "role": "设想中的能力或可能"
          }
        ],
        "why": "语境是现在住得较远，lived 的过去形式表达假设距离；could 表示在那个设想下具备步行条件，而不是保证每天都会走。",
        "scene": "现在家离学校较远，你们今天讨论理想住处，暂时没有具体搬家计划。"
      }
    ],
    "contrasts": [
      {
        "a": "If we move closer, we will walk to school.",
        "b": "If we moved closer, we would walk to school.",
        "aZh": "如果我们搬得近些，我们就步行上学。",
        "bZh": "要是我们搬得近些，我们就会步行上学。",
        "judgement": "different",
        "reason": "A 把搬家当作正在考虑的现实分支；B 用过去形式与 would，把同一未来可能拉得更远、更假设。不是 A 必然会搬、B 绝不可能搬，差别是说话者如何呈现现实距离。"
      },
      {
        "a": "If you will wait here, I will get the key.",
        "b": "If you wait here, I will get the key.",
        "aZh": "如果你愿意在这儿等，我就去拿钥匙。",
        "bZh": "如果你在这儿等，我就去拿钥匙。",
        "judgement": "both",
        "reason": "A 的条件分句里 will 表示愿意配合，语气可用于礼貌请求；B 直接把等待作为条件。两句都可成立，不能把“普通未来条件通常不用 will”扩大成 if 后一律禁止 will。"
      }
    ],
    "transfer": {
      "prompt": "改变时间线或现实距离，观察条件的意义怎样跟着变化。",
      "variants": [
        {
          "label": "结果改成行动建议",
          "en": "If the screen freezes, restart the app.",
          "zh": "如果屏幕卡住，就重启应用。",
          "parts": [
            {
              "text": "If the screen freezes,",
              "role": "可能发生的使用条件"
            },
            {
              "text": "restart the app.",
              "role": "条件成立时的操作指令"
            }
          ],
          "why": "主句是操作指令，不是 will 预测。条件表达可以配建议、命令或能力，不能只允许“if 现在时加 will”一种形式。",
          "scene": "你正在写应用的普通故障说明，告诉用户遇到界面卡住时可采取的动作。"
        },
        {
          "label": "回看另一种过去",
          "en": "If I had saved the file, I would not have lost my notes.",
          "zh": "如果我当时保存了文件，就不会丢掉笔记了。",
          "parts": [
            {
              "text": "If I had saved the file,",
              "role": "与已知过去不同的设想"
            },
            {
              "text": "I would not have lost my notes.",
              "role": "设想中的过去结果"
            }
          ],
          "why": "had saved 把条件放在过去更早的位置；would not have lost 想象随后的结果不同。此处已知实际没保存且笔记丢失，不是在决定下一次是否保存。",
          "scene": "昨晚应用关闭前你没有保存，笔记已经丢失；今天复盘当时本可采取的动作。"
        },
        {
          "label": "现实分支中的可能能力",
          "en": "If the shop is open tonight, we can buy a new cable.",
          "zh": "如果商店今晚开门，我们就可以买一根新线。",
          "parts": [
            {
              "text": "If the shop is open tonight,",
              "role": "今晚尚未确认的条件"
            },
            {
              "text": "we can buy a new cable.",
              "role": "条件允许的行动可能"
            }
          ],
          "why": "is open 用现在形式指今晚；can 说明获得购买机会，不是承诺一定购买，更不保证商店一定有货。条件和结果各自保留不确定性。",
          "scene": "今天下午发现充电线坏了，尚不知道附近商店今晚是否营业，你和家人讨论可行办法。"
        }
      ]
    },
    "challenge": [
      {
        "id": "conditions-probe",
        "kind": "probe",
        "prompt": "Which sentence best fits this practical plan for tomorrow?",
        "context": "You may go to the park tomorrow. Rain is possible. Your backup plan is to play at home if rain occurs.",
        "options": [
          {
            "text": "If it rained tomorrow, we would play at home.",
            "why": "可以作为更疏远、更假设的未来设想，但题设要给出仍然开放、准备执行的备用计划，现在形式更贴切。"
          },
          {
            "text": "If it rains tomorrow, we will play at home.",
            "why": "rains 在条件分句指明天的开放可能，主句 will 说明条件成立时的安排，符合题设。"
          },
          {
            "text": "If it will rain tomorrow, we will play at home.",
            "why": "本题是普通天气条件，不是意愿或评估未来结果的特殊用法；通常不用 will 仅标记条件分句的未来。"
          },
          {
            "text": "If it had rained tomorrow, we would have played at home.",
            "why": "had rained 与 would have played 在本课语境回看不同的过去，和尚未来到的 tomorrow 计划不合。"
          }
        ],
        "answer": 1,
        "explanation": "先确定时间和现实态度：这是明天可能发生、已准备执行的分支。未来时间由 tomorrow 和整体语境标明，条件中通常用 rains。",
        "translation": "如果明天下雨，我们就在家玩。",
        "skill": "conditions"
      },
      {
        "id": "conditions-transfer",
        "kind": "transfer",
        "prompt": "Which sentence imagines a different present situation?",
        "context": "Your home is far from school now. You are not planning a move, but you imagine how life could be easier if you lived nearby.",
        "options": [
          {
            "text": "If we had lived closer, we could have walked to school.",
            "why": "结构成立，但常回看过去本可不同的居住与上学情况，时间焦点与现在的设想不同。"
          },
          {
            "text": "If we live closer tomorrow, we walked to school yesterday.",
            "why": "条件在明天，结果却说昨天已经发生的步行；在本题没有跨时推理背景，时间关系不能表达所需设想。"
          },
          {
            "text": "If we would live closer, we could walk to school.",
            "why": "此处只是普通的远离现实的居住假设，不是意愿等特殊意义；通常用 lived，而不在 if 分句机械放 would。"
          },
          {
            "text": "If we lived closer, we could walk to school.",
            "why": "lived 表示把当前住得远的事实想象成另一种情况，could 表示该设想下能步行，符合现在的愿望。"
          }
        ],
        "answer": 3,
        "explanation": "本题不是追忆昨天，而是想象现在住得更近。过去形式 lived 在这里表达现实距离，不能仅凭形式把整句翻成过去。",
        "translation": "如果我们住得近些，就能步行上学了。",
        "skill": "conditions"
      }
    ],
    "nextUse": "为自己下一次出行写一个真实的如果计划，再写一个目前较难实现的如果愿望。标明时间和你觉得它离现实多远，并自查主句是在预测、给建议，还是表达能力。"
  }
];

  r.EnglishPathData = r.EnglishPathData || [];
  r.EnglishPathData.push(...lessons);
})(typeof window !== 'undefined' ? window : globalThis);
