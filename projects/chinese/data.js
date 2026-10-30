/* Original teaching prose; quoted ancient works and sources are listed per card. */
(function(root){
"use strict";
const data={
  "entries": [
    {
      "id": "睡-shui4",
      "char": "睡",
      "numberPinyin": "shui4",
      "layout": "左右",
      "parts": [
        "目",
        "垂"
      ],
      "meaning": "闭上眼睛，让身体休息。",
      "memory": "眼皮垂下来，我要睡觉啦。",
      "words": [
        "睡眠",
        "入睡",
        "午睡"
      ],
      "sentence": "小猫把尾巴一卷，安安静静地睡着了。",
      "trap": "“垂”还承担历史表音作用；不能只按今天的读音判断声旁。",
      "etymology": {
        "type": "形声",
        "text": "目提示和眼睛有关，垂是声旁，帮助提示古代读音；早期用于坐着打盹。眼皮垂下的故事可助记，但不是完整的字源说明。"
      },
      "sourceChar": "睡",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=睡",
      "family": "身体与感受",
      "quotes": [
        "q1"
      ]
    },
    {
      "id": "休-xiu1",
      "char": "休",
      "numberPinyin": "xiu1",
      "layout": "左右",
      "parts": [
        "亻",
        "木"
      ],
      "meaning": "停下来休息，也表示停止。",
      "memory": "一个人靠着树，歇一歇再出发。",
      "words": [
        "休息",
        "午休",
        "休假"
      ],
      "sentence": "跑完一圈，我们到树荫下休息。",
      "trap": "休是人旁；体在木上多一横，意思也不同。",
      "etymology": {
        "type": "会意",
        "text": "早期字形可见人靠近树木，表示歇息。现代的亻是人作偏旁时的写法。"
      },
      "sourceChar": "休",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=休",
      "family": "木与树林",
      "quotes": []
    },
    {
      "id": "木-mu4",
      "char": "木",
      "numberPinyin": "mu4",
      "layout": "独体",
      "parts": [
        "木"
      ],
      "meaning": "树木，也指木材。",
      "memory": "中间像树干，撇捺像伸出的枝根。",
      "words": [
        "木头",
        "木材",
        "树木"
      ],
      "sentence": "爷爷用木头做了一把小椅子。",
      "trap": "木、本、末要看短横的位置。",
      "etymology": null,
      "sourceChar": "木",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=木",
      "family": "木与树林",
      "quotes": []
    },
    {
      "id": "林-lin2",
      "char": "林",
      "numberPinyin": "lin2",
      "layout": "左右",
      "parts": [
        "木",
        "木"
      ],
      "meaning": "成片的树木。",
      "memory": "两棵树并排，想起一片树林。",
      "words": [
        "树林",
        "林间",
        "竹林"
      ],
      "sentence": "我们沿着林间的小路往前走。",
      "trap": "林不是只指两棵树；部件重复可以提示“多”。",
      "etymology": null,
      "sourceChar": "林",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=林",
      "family": "木与树林",
      "quotes": []
    },
    {
      "id": "森-sen1",
      "char": "森",
      "numberPinyin": "sen1",
      "layout": "品字",
      "parts": [
        "木",
        "木",
        "木"
      ],
      "meaning": "树木多而密，也用于形容森严。",
      "memory": "上面一棵，下面两棵，树林越来越密。",
      "words": [
        "森林",
        "森严",
        "阴森"
      ],
      "sentence": "阳光从森林的树叶缝里照下来。",
      "trap": "三木不等于森林里恰好只有三棵树。",
      "etymology": {
        "type": "会意",
        "text": "用重复的木表现树木密集；“三”在这里可表示多，不是限定树木数目。"
      },
      "sourceChar": "森",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=森",
      "family": "木与树林",
      "quotes": []
    },
    {
      "id": "本-ben3",
      "char": "本",
      "numberPinyin": "ben3",
      "layout": "独体",
      "parts": [
        "本"
      ],
      "meaning": "根本、原来；也用作书的量词。",
      "memory": "木的下方多一横，提醒我注意树根。",
      "words": [
        "一本书",
        "本来",
        "本领"
      ],
      "sentence": "这本书让我认识了许多昆虫。",
      "trap": "“一本书”的本是量词，不能把每个用法都解释成树根。",
      "etymology": null,
      "sourceChar": "本",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=本",
      "family": "木与树林",
      "quotes": []
    },
    {
      "id": "末-mo4",
      "char": "末",
      "numberPinyin": "mo4",
      "layout": "独体",
      "parts": [
        "末"
      ],
      "meaning": "末端、最后。",
      "memory": "上面的一横长，记住枝梢的末端。",
      "words": [
        "末尾",
        "周末",
        "期末"
      ],
      "sentence": "故事的末尾，大家终于找到了小狗。",
      "trap": "末的上横长；未的上横短，意思不同。",
      "etymology": null,
      "sourceChar": "末",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=末",
      "family": "木与树林",
      "quotes": []
    },
    {
      "id": "日-ri4",
      "char": "日",
      "numberPinyin": "ri4",
      "layout": "独体",
      "parts": [
        "日"
      ],
      "meaning": "太阳，也表示一天。",
      "memory": "方框里一横，把它想成画得方方的太阳。",
      "words": [
        "日出",
        "日子",
        "日光"
      ],
      "sentence": "日出时，窗边的墙变成了金色。",
      "trap": "日和目不同：目里面有两横。",
      "etymology": null,
      "sourceChar": "日",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=日",
      "family": "自然与四季",
      "quotes": [
        "q6",
        "q14"
      ]
    },
    {
      "id": "月-yue4",
      "char": "月",
      "numberPinyin": "yue4",
      "layout": "独体",
      "parts": [
        "月"
      ],
      "meaning": "月亮，也表示月份。",
      "memory": "弯弯的外边，记住夜空里的月亮。",
      "words": [
        "月光",
        "月亮",
        "月份"
      ],
      "sentence": "月光落在窗台上，像一层银色的霜。",
      "trap": "有些月字旁来自“肉”，如肚；不能见月都说是月亮。",
      "etymology": null,
      "sourceChar": "月",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=月",
      "family": "自然与四季",
      "quotes": [
        "q2",
        "q3",
        "q9",
        "q16"
      ]
    },
    {
      "id": "明-ming2",
      "char": "明",
      "numberPinyin": "ming2",
      "layout": "左右",
      "parts": [
        "日",
        "月"
      ],
      "meaning": "明亮、清楚，也指接下来的。",
      "memory": "把日和月放在一起，联想到明亮。",
      "words": [
        "明亮",
        "明白",
        "明天"
      ],
      "sentence": "听完解释，我终于明白这道题了。",
      "trap": "日月是现代字形观察；古文字还有不同写法，不能仅凭今形断定全部字源。",
      "etymology": null,
      "sourceChar": "明",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=明",
      "family": "生活与表达",
      "quotes": [
        "q2",
        "q3",
        "q16",
        "q19"
      ]
    },
    {
      "id": "目-mu4",
      "char": "目",
      "numberPinyin": "mu4",
      "layout": "独体",
      "parts": [
        "目"
      ],
      "meaning": "眼睛，也指项目、目录等。",
      "memory": "竖起来的眼睛图形，帮助我记住目。",
      "words": [
        "目光",
        "目录",
        "目标"
      ],
      "sentence": "我先翻目录，再找想读的那一页。",
      "trap": "目标不是一只眼睛；字义会扩展。",
      "etymology": null,
      "sourceChar": "目",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=目",
      "family": "身体与感受",
      "quotes": [
        "q7"
      ]
    },
    {
      "id": "看-kan4",
      "char": "看",
      "numberPinyin": "kan4",
      "layout": "上下",
      "parts": [
        "手",
        "目"
      ],
      "meaning": "用眼睛观察、阅读。",
      "memory": "把手搭在眼睛上方，向远处看。",
      "words": [
        "看见",
        "看书",
        "观看"
      ],
      "sentence": "我抬头看见了高高的风筝。",
      "trap": "这里的手变了形，不是把完整“手”原样摞上去。",
      "etymology": null,
      "sourceChar": "看",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=看",
      "family": "身体与感受",
      "quotes": []
    },
    {
      "id": "看-kan1",
      "char": "看",
      "numberPinyin": "kan1",
      "layout": "上下",
      "parts": [
        "手",
        "目"
      ],
      "meaning": "照料、守护。",
      "memory": "同一个字换个读音，变成“守着、照看”。",
      "words": [
        "看守",
        "看门",
        "看护"
      ],
      "sentence": "值班叔叔认真看守仓库。",
      "trap": "看书读kàn；看守读kān，要把字放进词里读。",
      "etymology": null,
      "sourceChar": "看",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=看",
      "family": "身体与感受",
      "quotes": []
    },
    {
      "id": "青-qing1",
      "char": "青",
      "numberPinyin": "qing1",
      "layout": "上下",
      "parts": [
        "龶",
        "月"
      ],
      "meaning": "一种颜色；也常指年轻。",
      "memory": "记住这个字，再找清、晴、情里的共同部分。",
      "words": [
        "青草",
        "青年",
        "青山"
      ],
      "sentence": "春天，河边长出了青青的小草。",
      "trap": "古文中青的颜色范围较宽，不总等于现代绿色。",
      "etymology": null,
      "sourceChar": "青",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=青",
      "family": "青字家族",
      "quotes": []
    },
    {
      "id": "清-qing1",
      "char": "清",
      "numberPinyin": "qing1",
      "layout": "左右",
      "parts": [
        "氵",
        "青"
      ],
      "meaning": "清澈、清楚、洁净。",
      "memory": "三点水在旁边，先想清清的水。",
      "words": [
        "清水",
        "清楚",
        "清晨"
      ],
      "sentence": "池水很清，我能看见水底的小石头。",
      "trap": "清qīng与晴qíng的声母、韵母相同，声调不同；偏旁提示的意义也不同。",
      "etymology": {
        "type": "形声",
        "text": "水（氵）提示意义范围，青提示历史读音，早期意义与水清澈有关。声旁不保证今天读音、声调完全相同。"
      },
      "sourceChar": "清",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=清",
      "family": "青字家族",
      "quotes": [
        "q16"
      ]
    },
    {
      "id": "晴-qing2",
      "char": "晴",
      "numberPinyin": "qing2",
      "layout": "左右",
      "parts": [
        "日",
        "青"
      ],
      "meaning": "天空少云或无云，没有雨雪。",
      "memory": "日字旁提醒我看天气，今天放晴啦。",
      "words": [
        "晴天",
        "晴朗",
        "放晴"
      ],
      "sentence": "雨停以后，天空渐渐放晴了。",
      "trap": "晴qíng不是清qīng，声调也要看。",
      "etymology": null,
      "sourceChar": "晴",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=晴",
      "family": "青字家族",
      "quotes": []
    },
    {
      "id": "情-qing2",
      "char": "情",
      "numberPinyin": "qing2",
      "layout": "左右",
      "parts": [
        "忄",
        "青"
      ],
      "meaning": "感情、心情，也指情况。",
      "memory": "竖心旁在左边，想起心里的感觉。",
      "words": [
        "心情",
        "友情",
        "事情"
      ],
      "sentence": "收到朋友的信，我的心情特别好。",
      "trap": "“事情”的情不只表示情绪。",
      "etymology": null,
      "sourceChar": "情",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=情",
      "family": "青字家族",
      "quotes": []
    },
    {
      "id": "请-qing3",
      "char": "请",
      "numberPinyin": "qing3",
      "layout": "左右",
      "parts": [
        "讠",
        "青"
      ],
      "meaning": "有礼貌地请求或邀请。",
      "memory": "言字旁提醒我用话表达：请你帮个忙。",
      "words": [
        "请问",
        "邀请",
        "请求"
      ],
      "sentence": "请问，去图书馆应该走哪条路？",
      "trap": "请qǐng是第三声；情qíng是第二声。",
      "etymology": null,
      "sourceChar": "请",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=请",
      "family": "青字家族",
      "quotes": []
    },
    {
      "id": "睛-jing1",
      "char": "睛",
      "numberPinyin": "jing1",
      "layout": "左右",
      "parts": [
        "目",
        "青"
      ],
      "meaning": "眼珠；常用在“眼睛”里。",
      "memory": "目字旁提醒我，这个字和眼睛有关。",
      "words": [
        "眼睛",
        "目不转睛",
        "画龙点睛"
      ],
      "sentence": "我睁大眼睛，观察叶片上的纹路。",
      "trap": "“眼睛”里的睛口语常读轻声；单字注音为jīng。",
      "etymology": null,
      "sourceChar": "睛",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=睛",
      "family": "青字家族",
      "quotes": []
    },
    {
      "id": "眼-yan3",
      "char": "眼",
      "numberPinyin": "yan3",
      "layout": "左右",
      "parts": [
        "目",
        "艮"
      ],
      "meaning": "眼睛，也指小孔、关键位置等。",
      "memory": "目字旁在左，和睛、睡放在一组记。",
      "words": [
        "眼光",
        "眼前",
        "针眼"
      ],
      "sentence": "奶奶把线穿过小小的针眼。",
      "trap": "艮是字形部件，别随意编成“很”的意思。",
      "etymology": null,
      "sourceChar": "眼",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=眼",
      "family": "身体与感受",
      "quotes": []
    },
    {
      "id": "山-shan1",
      "char": "山",
      "numberPinyin": "shan1",
      "layout": "独体",
      "parts": [
        "山"
      ],
      "meaning": "地面上高起的部分。",
      "memory": "三个竖起来的峰，像连着的小山。",
      "words": [
        "山峰",
        "山路",
        "高山"
      ],
      "sentence": "沿着山路，我们看见了云海。",
      "trap": "山峰指山的高处或顶端；山脉是一系列相连的山。",
      "etymology": null,
      "sourceChar": "山",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=山",
      "family": "自然与四季",
      "quotes": [
        "q6",
        "q10",
        "q15"
      ]
    },
    {
      "id": "水-shui3",
      "char": "水",
      "numberPinyin": "shui3",
      "layout": "独体",
      "parts": [
        "水"
      ],
      "meaning": "常见的液体，生命离不开它。",
      "memory": "中间一笔像水流，两边像分开的水波。",
      "words": [
        "水杯",
        "河水",
        "水滴"
      ],
      "sentence": "一滴水从叶尖滑了下来。",
      "trap": "水变成偏旁时常写成氵，字形会变化。",
      "etymology": null,
      "sourceChar": "水",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=水",
      "family": "自然与四季",
      "quotes": []
    },
    {
      "id": "火-huo3",
      "char": "火",
      "numberPinyin": "huo3",
      "layout": "独体",
      "parts": [
        "火"
      ],
      "meaning": "燃烧时的光和热，也比喻急切或生气。",
      "memory": "两点向外散开，像跳动的火苗。",
      "words": [
        "火苗",
        "灯火",
        "火红"
      ],
      "sentence": "远处的灯火像一颗颗星星。",
      "trap": "这里学字不点火；火红是颜色，不是正在燃烧。",
      "etymology": null,
      "sourceChar": "火",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=火",
      "family": "自然与四季",
      "quotes": [
        "q19"
      ]
    },
    {
      "id": "土-tu3",
      "char": "土",
      "numberPinyin": "tu3",
      "layout": "独体",
      "parts": [
        "土"
      ],
      "meaning": "土壤、土地。",
      "memory": "一竖站在地面上，用长长的底横记位置。",
      "words": [
        "泥土",
        "土地",
        "土豆"
      ],
      "sentence": "种子在湿润的泥土里发芽了。",
      "trap": "土的下横长；士的上横长。",
      "etymology": null,
      "sourceChar": "土",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=土",
      "family": "自然与四季",
      "quotes": []
    },
    {
      "id": "石-shi2",
      "char": "石",
      "numberPinyin": "shi2",
      "layout": "半包围",
      "parts": [
        "厂",
        "口"
      ],
      "meaning": "石头、岩石。",
      "memory": "按现代字形，外面像厂，里面有口形。",
      "words": [
        "石头",
        "石桥",
        "岩石"
      ],
      "sentence": "小河边有一座古老的石桥。",
      "trap": "部件像口，不代表石头里真的有嘴；另有石dàn的用法，本馆暂不展开。",
      "etymology": null,
      "sourceChar": "石",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=石",
      "family": "自然与四季",
      "quotes": [
        "q16"
      ]
    },
    {
      "id": "田-tian2",
      "char": "田",
      "numberPinyin": "tian2",
      "layout": "独体",
      "parts": [
        "田"
      ],
      "meaning": "种庄稼的土地。",
      "memory": "方块分成小格，像一块块田地。",
      "words": [
        "田野",
        "水田",
        "田园"
      ],
      "sentence": "雨后的田野一片清新。",
      "trap": "田里的一横一竖不能漏。",
      "etymology": null,
      "sourceChar": "田",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=田",
      "family": "自然与四季",
      "quotes": []
    },
    {
      "id": "禾-he2",
      "char": "禾",
      "numberPinyin": "he2",
      "layout": "独体",
      "parts": [
        "禾"
      ],
      "meaning": "谷类植物的统称，也指禾苗。",
      "memory": "木上加一撇，像低垂的穗。",
      "words": [
        "禾苗",
        "禾田",
        "禾谷"
      ],
      "sentence": "田里的禾苗随风轻轻摆动。",
      "trap": "禾和木不同，头上的撇要看清。",
      "etymology": null,
      "sourceChar": "禾",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=禾",
      "family": "自然与四季",
      "quotes": []
    },
    {
      "id": "米-mi3",
      "char": "米",
      "numberPinyin": "mi3",
      "layout": "独体",
      "parts": [
        "米"
      ],
      "meaning": "谷物去壳后的颗粒，也是一种长度单位。",
      "memory": "几颗小粒围着中间，联想到米粒。",
      "words": [
        "大米",
        "米粒",
        "米饭"
      ],
      "sentence": "我把一粒米放在掌心仔细看。",
      "trap": "一米长的米是单位，不是米饭。",
      "etymology": null,
      "sourceChar": "米",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=米",
      "family": "自然与四季",
      "quotes": []
    },
    {
      "id": "竹-zhu2",
      "char": "竹",
      "numberPinyin": "zhu2",
      "layout": "独体",
      "parts": [
        "竹"
      ],
      "meaning": "一种茎有节、常中空的植物。",
      "memory": "左右两边像两枝细竹。",
      "words": [
        "竹子",
        "竹林",
        "竹笋"
      ],
      "sentence": "春雨过后，竹笋冒出了地面。",
      "trap": "竹作字头时常变成⺮，如笑、笔。",
      "etymology": null,
      "sourceChar": "竹",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=竹",
      "family": "自然与四季",
      "quotes": []
    },
    {
      "id": "草-cao3",
      "char": "草",
      "numberPinyin": "cao3",
      "layout": "上下",
      "parts": [
        "艹",
        "早"
      ],
      "meaning": "草本植物的通称，也指初步的。",
      "memory": "草字头在上，先联想地上的小草。",
      "words": [
        "小草",
        "草地",
        "草稿"
      ],
      "sentence": "我先在草稿纸上画出想法。",
      "trap": "草稿不是用草做的纸，是还要修改的稿子。",
      "etymology": null,
      "sourceChar": "草",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=草",
      "family": "自然与四季",
      "quotes": [
        "q13"
      ]
    },
    {
      "id": "花-hua1",
      "char": "花",
      "numberPinyin": "hua1",
      "layout": "上下",
      "parts": [
        "艹",
        "化"
      ],
      "meaning": "植物的花，也可表示耗费。",
      "memory": "草字头提示植物，花开了。",
      "words": [
        "花朵",
        "花园",
        "花费"
      ],
      "sentence": "我花了十分钟给花园里的植物浇水。",
      "trap": "两处花意思不同：一处是耗费，一处是植物。",
      "etymology": null,
      "sourceChar": "花",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=花",
      "family": "自然与四季",
      "quotes": [
        "q1",
        "q5",
        "q14"
      ]
    },
    {
      "id": "叶-ye4",
      "char": "叶",
      "numberPinyin": "ye4",
      "layout": "左右",
      "parts": [
        "口",
        "十"
      ],
      "meaning": "植物的叶片，也用于薄片状的物体。",
      "memory": "左口右十，先记现代简化字的样子。",
      "words": [
        "叶子",
        "绿叶",
        "枫叶"
      ],
      "sentence": "我捡起一片枫叶，观察它的叶脉。",
      "trap": "叶是葉的简化字，不能说古人用嘴和十发明叶子。",
      "etymology": null,
      "sourceChar": "葉",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=葉",
      "family": "自然与四季",
      "quotes": [
        "q9",
        "q14"
      ]
    },
    {
      "id": "果-guo3",
      "char": "果",
      "numberPinyin": "guo3",
      "layout": "独体",
      "parts": [
        "果"
      ],
      "meaning": "植物的果实，也指结果。",
      "memory": "上面像果子，下面像支撑它的树。",
      "words": [
        "水果",
        "果实",
        "结果"
      ],
      "sentence": "我们坚持浇水，小树终于结出了果实。",
      "trap": "结果也能表示一件事最后怎样，不只是果子。",
      "etymology": null,
      "sourceChar": "果",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=果",
      "family": "自然与四季",
      "quotes": []
    },
    {
      "id": "雨-yu3",
      "char": "雨",
      "numberPinyin": "yu3",
      "layout": "独体",
      "parts": [
        "雨"
      ],
      "meaning": "从云中落下的水滴。",
      "memory": "框里的小点像一滴滴雨。",
      "words": [
        "雨点",
        "雨伞",
        "春雨"
      ],
      "sentence": "雨点落在屋檐上，滴答滴答地响。",
      "trap": "本课读yǔ；古文“雨雪”的雨有时读yù。",
      "etymology": null,
      "sourceChar": "雨",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=雨",
      "family": "自然与四季",
      "quotes": [
        "q5",
        "q15",
        "q17"
      ]
    },
    {
      "id": "云-yun2",
      "char": "云",
      "numberPinyin": "yun2",
      "layout": "独体",
      "parts": [
        "云"
      ],
      "meaning": "天空中由小水滴或冰晶组成的云，也有“说”的古义。",
      "memory": "看字形像卷起的云，记住底下的厶。",
      "words": [
        "白云",
        "云朵",
        "云海"
      ],
      "sentence": "山顶的白云慢慢飘向远方。",
      "trap": "云是雲的简化字；“古人云”的云表示说。",
      "etymology": null,
      "sourceChar": "雲",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=雲",
      "family": "自然与四季",
      "quotes": [
        "q19"
      ]
    },
    {
      "id": "风-feng1",
      "char": "风",
      "numberPinyin": "feng1",
      "layout": "半包围",
      "parts": [
        "⺇",
        "乂"
      ],
      "meaning": "流动的空气，也指风格、消息等。",
      "memory": "外框围着里面的交叉笔画，记住简体风。",
      "words": [
        "微风",
        "风筝",
        "风景"
      ],
      "sentence": "微风吹来，树叶沙沙作响。",
      "trap": "不能把简化后的乂解释为风的古代来源。",
      "etymology": null,
      "sourceChar": "風",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=風",
      "family": "自然与四季",
      "quotes": [
        "q5",
        "q9",
        "q18"
      ]
    },
    {
      "id": "雪-xue3",
      "char": "雪",
      "numberPinyin": "xue3",
      "layout": "上下",
      "parts": [
        "雨",
        "彐"
      ],
      "meaning": "从云中降下的冰晶或雪片。",
      "memory": "雨字头下方像一把小扫帚，帮助我记形。",
      "words": [
        "雪花",
        "雪人",
        "下雪"
      ],
      "sentence": "我们在院子里堆了一个雪人。",
      "trap": "扫帚只是记形联想，不当作字源结论。",
      "etymology": null,
      "sourceChar": "雪",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=雪",
      "family": "自然与四季",
      "quotes": [
        "q11"
      ]
    },
    {
      "id": "星-xing1",
      "char": "星",
      "numberPinyin": "xing1",
      "layout": "上下",
      "parts": [
        "日",
        "生"
      ],
      "meaning": "夜空里可见的天体亮点等。",
      "memory": "上日下生，联想夜空亮起的小光点。",
      "words": [
        "星星",
        "星空",
        "星光"
      ],
      "sentence": "晴朗的夜里，我和爸爸一起看星星。",
      "trap": "星星不都是太阳系行星，也不要把字形联想当成天文学。",
      "etymology": null,
      "sourceChar": "星",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=星",
      "family": "自然与四季",
      "quotes": []
    },
    {
      "id": "光-guang1",
      "char": "光",
      "numberPinyin": "guang1",
      "layout": "上下",
      "parts": [
        "⺌",
        "兀"
      ],
      "meaning": "使我们看见物体的光，也可表示光滑、用尽。",
      "memory": "上面三笔像散开的亮光。",
      "words": [
        "阳光",
        "光线",
        "月光"
      ],
      "sentence": "阳光照在桌上，留下窗框的影子。",
      "trap": "“吃光了”的光表示一点不剩。",
      "etymology": null,
      "sourceChar": "光",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=光",
      "family": "自然与四季",
      "quotes": [
        "q2"
      ]
    },
    {
      "id": "春-chun1",
      "char": "春",
      "numberPinyin": "chun1",
      "layout": "上下",
      "parts": [
        "𡗗",
        "日"
      ],
      "meaning": "一年四季之一，冬后夏前。",
      "memory": "下方有日，联想春日渐暖。",
      "words": [
        "春天",
        "春风",
        "春雨"
      ],
      "sentence": "春天来了，枝头长出了新芽。",
      "trap": "看见日不代表所有带日的字都指春天。",
      "etymology": null,
      "sourceChar": "春",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=春",
      "family": "自然与四季",
      "quotes": [
        "q4",
        "q9",
        "q13",
        "q17"
      ]
    },
    {
      "id": "夏-xia4",
      "char": "夏",
      "numberPinyin": "xia4",
      "layout": "上下",
      "parts": [
        "𦣻",
        "夂"
      ],
      "meaning": "一年四季之一，春后秋前。",
      "memory": "上面笔画多，下面一撇一捺，分两部分观察。",
      "words": [
        "夏天",
        "夏季",
        "初夏"
      ],
      "sentence": "夏天，我们在树荫下吃西瓜。",
      "trap": "这里观察现代字形，不把部件硬编成天气的来源。",
      "etymology": null,
      "sourceChar": "夏",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=夏",
      "family": "自然与四季",
      "quotes": []
    },
    {
      "id": "秋-qiu1",
      "char": "秋",
      "numberPinyin": "qiu1",
      "layout": "左右",
      "parts": [
        "禾",
        "火"
      ],
      "meaning": "一年四季之一，夏后冬前。",
      "memory": "禾与火放一起，联想到秋日成熟的金色禾田。",
      "words": [
        "秋天",
        "秋风",
        "中秋"
      ],
      "sentence": "秋风一吹，银杏叶像小扇子飘下来。",
      "trap": "秋的古文字演变复杂；不要把“烧庄稼”当作确定字源。",
      "etymology": null,
      "sourceChar": "秋",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=秋",
      "family": "自然与四季",
      "quotes": [
        "q15"
      ]
    },
    {
      "id": "冬-dong1",
      "char": "冬",
      "numberPinyin": "dong1",
      "layout": "上下",
      "parts": [
        "夂",
        "两点"
      ],
      "meaning": "一年四季之一，秋后春前。",
      "memory": "下面两点像冰点，帮助我记冬天的冷。",
      "words": [
        "冬天",
        "冬季",
        "寒冬"
      ],
      "sentence": "冬天的清晨，玻璃上起了一层白雾。",
      "trap": "两点只是现代记形，不能据此断定古字来源。",
      "etymology": null,
      "sourceChar": "冬",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=冬",
      "family": "自然与四季",
      "quotes": []
    },
    {
      "id": "人-ren2",
      "char": "人",
      "numberPinyin": "ren2",
      "layout": "独体",
      "parts": [
        "人"
      ],
      "meaning": "人类，也可指某一个人。",
      "memory": "一撇一捺相互支撑，像站着的人。",
      "words": [
        "人们",
        "家人",
        "工人"
      ],
      "sentence": "家人一起把阳台整理得干干净净。",
      "trap": "人和入的两笔位置不一样。",
      "etymology": null,
      "sourceChar": "人",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=人",
      "family": "生活与表达",
      "quotes": [
        "q10"
      ]
    },
    {
      "id": "从-cong2",
      "char": "从",
      "numberPinyin": "cong2",
      "layout": "左右",
      "parts": [
        "人",
        "人"
      ],
      "meaning": "跟随，也表示起点。",
      "memory": "两个人一前一后走，联想跟从。",
      "words": [
        "从前",
        "跟从",
        "从来"
      ],
      "sentence": "我从学校走到公园。",
      "trap": "“从学校”的从指出发点，不是跟着某个人。",
      "etymology": null,
      "sourceChar": "从",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=从",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "众-zhong4",
      "char": "众",
      "numberPinyin": "zhong4",
      "layout": "品字",
      "parts": [
        "人",
        "人",
        "人"
      ],
      "meaning": "许多人，或数量多。",
      "memory": "三个人在一起，联想一群人。",
      "words": [
        "群众",
        "众人",
        "观众"
      ],
      "sentence": "演出结束后，观众热烈鼓掌。",
      "trap": "众人不是只能有三个人。",
      "etymology": null,
      "sourceChar": "眾",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=眾",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "口-kou3",
      "char": "口",
      "numberPinyin": "kou3",
      "layout": "独体",
      "parts": [
        "口"
      ],
      "meaning": "嘴，也指开口处或量词。",
      "memory": "四四方方的开口，记住口。",
      "words": [
        "开口",
        "门口",
        "口水"
      ],
      "sentence": "我站在门口，向老师问好。",
      "trap": "门口不是门的嘴，而是出入的地方。",
      "etymology": null,
      "sourceChar": "口",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=口",
      "family": "身体与感受",
      "quotes": []
    },
    {
      "id": "耳-er3",
      "char": "耳",
      "numberPinyin": "er3",
      "layout": "独体",
      "parts": [
        "耳"
      ],
      "meaning": "听声音的器官。",
      "memory": "长长的轮廓，联想侧面的耳朵。",
      "words": [
        "耳朵",
        "耳机",
        "木耳"
      ],
      "sentence": "我摘下耳机，听见窗外的鸟叫。",
      "trap": "木耳因为形状得名，不是树真的长了耳朵。",
      "etymology": null,
      "sourceChar": "耳",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=耳",
      "family": "身体与感受",
      "quotes": []
    },
    {
      "id": "手-shou3",
      "char": "手",
      "numberPinyin": "shou3",
      "layout": "独体",
      "parts": [
        "手"
      ],
      "meaning": "拿东西、做事情的身体部位。",
      "memory": "伸出小手，数数手指，再看字形。",
      "words": [
        "双手",
        "手心",
        "手工"
      ],
      "sentence": "我用双手折了一只纸船。",
      "trap": "手作偏旁时常写成扌，如拍、打。",
      "etymology": null,
      "sourceChar": "手",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=手",
      "family": "身体与感受",
      "quotes": [
        "q12"
      ]
    },
    {
      "id": "足-zu2",
      "char": "足",
      "numberPinyin": "zu2",
      "layout": "上下",
      "parts": [
        "口",
        "龰"
      ],
      "meaning": "脚，也表示充足。",
      "memory": "上下一起看，联想到站立和走路。",
      "words": [
        "足球",
        "足迹",
        "满足"
      ],
      "sentence": "沙滩上留下了我们长长的足迹。",
      "trap": "“足够”是够多，不是脚多。",
      "etymology": null,
      "sourceChar": "足",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=足",
      "family": "身体与感受",
      "quotes": []
    },
    {
      "id": "心-xin1",
      "char": "心",
      "numberPinyin": "xin1",
      "layout": "独体",
      "parts": [
        "心"
      ],
      "meaning": "心脏，也常表示感情或想法。",
      "memory": "几个点围着弯钩，记住心。",
      "words": [
        "心情",
        "用心",
        "爱心"
      ],
      "sentence": "我用心听完了朋友的故事。",
      "trap": "心作左旁常写成忄，下面也可变成⺗。",
      "etymology": null,
      "sourceChar": "心",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=心",
      "family": "身体与感受",
      "quotes": [
        "q13"
      ]
    },
    {
      "id": "思-si1",
      "char": "思",
      "numberPinyin": "si1",
      "layout": "上下",
      "parts": [
        "田",
        "心"
      ],
      "meaning": "想、考虑，也指想念。",
      "memory": "现代字形上田下心，联想把问题放在心里想。",
      "words": [
        "思考",
        "思念",
        "心思"
      ],
      "sentence": "遇到难题，我先自己思考。",
      "trap": "上部的古形不等于今天的田地，不用“种田的心”冒充字源。",
      "etymology": null,
      "sourceChar": "思",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=思",
      "family": "身体与感受",
      "quotes": [
        "q3"
      ]
    },
    {
      "id": "想-xiang3",
      "char": "想",
      "numberPinyin": "xiang3",
      "layout": "上下",
      "parts": [
        "相",
        "心"
      ],
      "meaning": "思考、希望、想念。",
      "memory": "心在下边，提醒我这和想法有关。",
      "words": [
        "想法",
        "想念",
        "理想"
      ],
      "sentence": "我想把今天看到的小鸟画下来。",
      "trap": "想可以表示愿望，不一定是在回忆。",
      "etymology": null,
      "sourceChar": "想",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=想",
      "family": "身体与感受",
      "quotes": []
    },
    {
      "id": "念-nian4",
      "char": "念",
      "numberPinyin": "nian4",
      "layout": "上下",
      "parts": [
        "今",
        "心"
      ],
      "meaning": "惦记，也指读出声音。",
      "memory": "今天记在心里，用来联想思念。",
      "words": [
        "思念",
        "念书",
        "纪念"
      ],
      "sentence": "我把这首小诗轻轻念给妈妈听。",
      "trap": "今没有令下面的点；“今天放在心里”是记忆办法。",
      "etymology": null,
      "sourceChar": "念",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=念",
      "family": "身体与感受",
      "quotes": []
    },
    {
      "id": "信-xin4",
      "char": "信",
      "numberPinyin": "xin4",
      "layout": "左右",
      "parts": [
        "亻",
        "言"
      ],
      "meaning": "相信、诚实，也指信件、消息。",
      "memory": "人加言，提醒我说话要守信。",
      "words": [
        "相信",
        "信用",
        "信封"
      ],
      "sentence": "我答应借书后按时归还，要做守信的人。",
      "trap": "人说的话不一定都是真的；这是价值联想，不是判断真假证据。",
      "etymology": null,
      "sourceChar": "信",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=信",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "言-yan2",
      "char": "言",
      "numberPinyin": "yan2",
      "layout": "独体",
      "parts": [
        "言"
      ],
      "meaning": "话语、说话。",
      "memory": "下面一个口，上方笔画排齐，记住言。",
      "words": [
        "语言",
        "发言",
        "言语"
      ],
      "sentence": "轮到我发言时，我先想清楚再开口。",
      "trap": "言变成简体偏旁时常写讠。",
      "etymology": null,
      "sourceChar": "言",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=言",
      "family": "生活与表达",
      "quotes": [
        "q13"
      ]
    },
    {
      "id": "语-yu3",
      "char": "语",
      "numberPinyin": "yu3",
      "layout": "左右",
      "parts": [
        "讠",
        "吾"
      ],
      "meaning": "语言、说的话。",
      "memory": "言字旁在左，表示这个字和说话有关。",
      "words": [
        "语文",
        "语言",
        "话语"
      ],
      "sentence": "同一句话，换个语气就会有不同感觉。",
      "trap": "本课读yǔ；古文中“告诉”的语另有yù音。",
      "etymology": null,
      "sourceChar": "語",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=語",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "诗-shi1",
      "char": "诗",
      "numberPinyin": "shi1",
      "layout": "左右",
      "parts": [
        "讠",
        "寺"
      ],
      "meaning": "一种凝练、有节奏的文学形式。",
      "memory": "言字旁提醒语言，右边的寺帮我记形。",
      "words": [
        "诗人",
        "诗句",
        "古诗"
      ],
      "sentence": "我把春雨写进了一首小诗。",
      "trap": "寺不是说诗必须在寺庙里写。",
      "etymology": null,
      "sourceChar": "詩",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=詩",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "读-du2",
      "char": "读",
      "numberPinyin": "du2",
      "layout": "左右",
      "parts": [
        "讠",
        "卖"
      ],
      "meaning": "看文字并理解，也可读出声音。",
      "memory": "言字旁加卖，先记住简体读的结构。",
      "words": [
        "读书",
        "阅读",
        "朗读"
      ],
      "sentence": "我读完一段，停下来想想它讲了什么。",
      "trap": "读不是“卖话”；简化字形不能硬当字源，句读另读dòu。",
      "etymology": null,
      "sourceChar": "讀",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=讀",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "书-shu1",
      "char": "书",
      "numberPinyin": "shu1",
      "layout": "独体",
      "parts": [
        "书"
      ],
      "meaning": "写下的文字或装订成册的作品等。",
      "memory": "看清两处转折和最后一点。",
      "words": [
        "书本",
        "图书",
        "书写"
      ],
      "sentence": "我把借来的图书放回书架。",
      "trap": "书是書的简化字，别按笔画编造历史。",
      "etymology": null,
      "sourceChar": "書",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=書",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "字-zi4",
      "char": "字",
      "numberPinyin": "zi4",
      "layout": "上下",
      "parts": [
        "宀",
        "子"
      ],
      "meaning": "记录语言的符号。",
      "memory": "宝盖头下面一个子，先记上下位置。",
      "words": [
        "文字",
        "汉字",
        "字典"
      ],
      "sentence": "遇到不认识的汉字，我先查字典。",
      "trap": "古义与今天不同；“孩子在房里”可记形，不是文字的完整起源。",
      "etymology": null,
      "sourceChar": "字",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=字",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "学-xue2",
      "char": "学",
      "numberPinyin": "xue2",
      "layout": "上下",
      "parts": [
        "⺍",
        "冖",
        "子"
      ],
      "meaning": "获得知识和本领。",
      "memory": "上部像屋顶，下面有子，联想孩子在学习。",
      "words": [
        "学习",
        "学校",
        "同学"
      ],
      "sentence": "我学会以后，又讲给同学听。",
      "trap": "学是學的简化字，不能把今形故事当唯一字源。",
      "etymology": null,
      "sourceChar": "學",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=學",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "问-wen4",
      "char": "问",
      "numberPinyin": "wen4",
      "layout": "半包围",
      "parts": [
        "门",
        "口"
      ],
      "meaning": "提出问题、询问。",
      "memory": "门里一个口，联想开口问一问。",
      "words": [
        "问题",
        "提问",
        "请问"
      ],
      "sentence": "我不懂就举手提问。",
      "trap": "不必站在门里才能问；故事只是帮助记形。",
      "etymology": null,
      "sourceChar": "問",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=問",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "闻-wen2",
      "char": "闻",
      "numberPinyin": "wen2",
      "layout": "半包围",
      "parts": [
        "门",
        "耳"
      ],
      "meaning": "听见、消息，也指用鼻子辨别气味。",
      "memory": "门里是耳，联想听到消息。",
      "words": [
        "新闻",
        "闻名",
        "听闻"
      ],
      "sentence": "我从新闻里知道了这次科学发现。",
      "trap": "闻花香用鼻子；不能说闻永远用耳朵。",
      "etymology": null,
      "sourceChar": "聞",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=聞",
      "family": "生活与表达",
      "quotes": [
        "q4"
      ]
    },
    {
      "id": "好-hao3",
      "char": "好",
      "numberPinyin": "hao3",
      "layout": "左右",
      "parts": [
        "女",
        "子"
      ],
      "meaning": "良好、美好。",
      "memory": "把女和子分开观察，再合起来写。",
      "words": [
        "好人",
        "好处",
        "美好"
      ],
      "sentence": "我和好朋友分享了一本有趣的书。",
      "trap": "字形不能用来给不同性别或家庭形式评高低。",
      "etymology": null,
      "sourceChar": "好",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=好",
      "family": "生活与表达",
      "quotes": [
        "q17"
      ]
    },
    {
      "id": "好-hao4",
      "char": "好",
      "numberPinyin": "hao4",
      "layout": "左右",
      "parts": [
        "女",
        "子"
      ],
      "meaning": "喜欢、爱做某件事。",
      "memory": "同一个字换成第四声，放进爱好里记。",
      "words": [
        "爱好",
        "好奇",
        "好学"
      ],
      "sentence": "我对星空很好奇，总想多问几个为什么。",
      "trap": "好学读hào xué；好人读hǎo rén。",
      "etymology": null,
      "sourceChar": "好",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=好",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "安-an1",
      "char": "安",
      "numberPinyin": "an1",
      "layout": "上下",
      "parts": [
        "宀",
        "女"
      ],
      "meaning": "平安、安定，也表示安排。",
      "memory": "宝盖头下面有女，先观察上下结构。",
      "words": [
        "安全",
        "安静",
        "安排"
      ],
      "sentence": "图书馆里很安静，大家都在认真读书。",
      "trap": "不把古代家庭观念说成今天女性应该待在家里。",
      "etymology": null,
      "sourceChar": "安",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=安",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "家-jia1",
      "char": "家",
      "numberPinyin": "jia1",
      "layout": "上下",
      "parts": [
        "宀",
        "豕"
      ],
      "meaning": "共同生活的家庭或住处。",
      "memory": "宝盖头下是豕，不是象，也不是逐。",
      "words": [
        "家人",
        "家乡",
        "回家"
      ],
      "sentence": "放学回家，我把新学的故事讲给家人听。",
      "trap": "豕表示猪的古字；不把字形简化成“养猪才有家”的结论。",
      "etymology": null,
      "sourceChar": "家",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=家",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "河-he2",
      "char": "河",
      "numberPinyin": "he2",
      "layout": "左右",
      "parts": [
        "氵",
        "可"
      ],
      "meaning": "地表流动的天然水道。",
      "memory": "三点水在左，联想流动的河水。",
      "words": [
        "河流",
        "河岸",
        "小河"
      ],
      "sentence": "小河绕过村庄，流向远处。",
      "trap": "河和何偏旁不同，意义也不同。",
      "etymology": null,
      "sourceChar": "河",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=河",
      "family": "自然与四季",
      "quotes": [
        "q6"
      ]
    },
    {
      "id": "江-jiang1",
      "char": "江",
      "numberPinyin": "jiang1",
      "layout": "左右",
      "parts": [
        "氵",
        "工"
      ],
      "meaning": "较大的河流，也用在江河名称里。",
      "memory": "三点水加工，先找与水有关的一边。",
      "words": [
        "江水",
        "长江",
        "江岸"
      ],
      "sentence": "轮船沿着江面缓缓前行。",
      "trap": "不是所有大河都一定叫江，名称有历史习惯。",
      "etymology": null,
      "sourceChar": "江",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=江",
      "family": "自然与四季",
      "quotes": [
        "q11",
        "q19"
      ]
    },
    {
      "id": "湖-hu2",
      "char": "湖",
      "numberPinyin": "hu2",
      "layout": "左右",
      "parts": [
        "氵",
        "胡"
      ],
      "meaning": "陆地上较大的积水区域。",
      "memory": "三点水加胡，湖里有水。",
      "words": [
        "湖水",
        "湖面",
        "湖泊"
      ],
      "sentence": "风停了，湖面像一面镜子。",
      "trap": "湖与河不同：湖是积水区域，河是水道。",
      "etymology": null,
      "sourceChar": "湖",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=湖",
      "family": "自然与四季",
      "quotes": []
    },
    {
      "id": "海-hai3",
      "char": "海",
      "numberPinyin": "hai3",
      "layout": "左右",
      "parts": [
        "氵",
        "每"
      ],
      "meaning": "大洋靠近陆地的部分，也比喻广大。",
      "memory": "三点水在左，想起宽阔的海面。",
      "words": [
        "大海",
        "海洋",
        "海风"
      ],
      "sentence": "我第一次见到大海，久久舍不得离开。",
      "trap": "人海是比喻人很多，不是真的海水。",
      "etymology": null,
      "sourceChar": "海",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=海",
      "family": "自然与四季",
      "quotes": [
        "q6"
      ]
    },
    {
      "id": "桥-qiao2",
      "char": "桥",
      "numberPinyin": "qiao2",
      "layout": "左右",
      "parts": [
        "木",
        "乔"
      ],
      "meaning": "架在水道或道路上方供通行的建筑。",
      "memory": "木字旁加乔，联想架起一座小桥。",
      "words": [
        "石桥",
        "桥梁",
        "天桥"
      ],
      "sentence": "我们走过天桥，安全地到达马路对面。",
      "trap": "有木字旁，不代表所有桥都用木头建造。",
      "etymology": null,
      "sourceChar": "橋",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=橋",
      "family": "木与树林",
      "quotes": []
    },
    {
      "id": "树-shu4",
      "char": "树",
      "numberPinyin": "shu4",
      "layout": "左右",
      "parts": [
        "木",
        "对"
      ],
      "meaning": "树木，也可表示建立。",
      "memory": "木字旁在左，树的右边是对。",
      "words": [
        "树叶",
        "大树",
        "树立"
      ],
      "sentence": "我给自己树立了一个阅读目标。",
      "trap": "树立是建立，不是把树搬起来；树是樹的简化字。",
      "etymology": null,
      "sourceChar": "樹",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=樹",
      "family": "木与树林",
      "quotes": [
        "q8"
      ]
    },
    {
      "id": "校-xiao4",
      "char": "校",
      "numberPinyin": "xiao4",
      "layout": "左右",
      "parts": [
        "木",
        "交"
      ],
      "meaning": "学校，学习知识和本领的地方。",
      "memory": "木和交左右并排，记住校门口的大树。",
      "words": [
        "学校",
        "校园",
        "校长"
      ],
      "sentence": "校园里的桂花开了。",
      "trap": "校另有jiào音，如校对；本馆用不同词卡区分。",
      "etymology": null,
      "sourceChar": "校",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=校",
      "family": "木与树林",
      "quotes": []
    },
    {
      "id": "校-jiao4",
      "char": "校",
      "numberPinyin": "jiao4",
      "layout": "左右",
      "parts": [
        "木",
        "交"
      ],
      "meaning": "核对、订正、比较。",
      "memory": "把两份内容交叉比较，联想校对。",
      "words": [
        "校对",
        "校正",
        "校订"
      ],
      "sentence": "我把抄好的诗和原文逐字校对。",
      "trap": "校对读jiào duì，学校读xué xiào。",
      "etymology": null,
      "sourceChar": "校",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=校",
      "family": "木与树林",
      "quotes": []
    },
    {
      "id": "鱼-yu2",
      "char": "鱼",
      "numberPinyin": "yu2",
      "layout": "独体",
      "parts": [
        "鱼"
      ],
      "meaning": "生活在水中的一类脊椎动物。",
      "memory": "上头像头，中间像身子，下横像尾部，帮我记形。",
      "words": [
        "小鱼",
        "鱼群",
        "金鱼"
      ],
      "sentence": "一群小鱼从水草旁游过。",
      "trap": "鱼是魚的简化字，不是“刀、田、一”的意思相加。",
      "etymology": null,
      "sourceChar": "魚",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=魚",
      "family": "自然与四季",
      "quotes": []
    },
    {
      "id": "鸟-niao3",
      "char": "鸟",
      "numberPinyin": "niao3",
      "layout": "独体",
      "parts": [
        "鸟"
      ],
      "meaning": "通常有羽毛、喙，前肢为翼的动物。",
      "memory": "注意头部一点，联想鸟的眼睛。",
      "words": [
        "小鸟",
        "鸟鸣",
        "飞鸟"
      ],
      "sentence": "清晨的小鸟在树枝上唱歌。",
      "trap": "鸟和乌不同，鸟多一点。",
      "etymology": null,
      "sourceChar": "鳥",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=鳥",
      "family": "自然与四季",
      "quotes": [
        "q4",
        "q10"
      ]
    },
    {
      "id": "虫-chong2",
      "char": "虫",
      "numberPinyin": "chong2",
      "layout": "独体",
      "parts": [
        "虫"
      ],
      "meaning": "日常对一些小动物的称呼。",
      "memory": "中竖穿过口形，下面还有提和点，别漏笔。",
      "words": [
        "昆虫",
        "虫子",
        "书虫"
      ],
      "sentence": "我在叶片背面发现了一条小虫。",
      "trap": "汉字里的虫不只对应现代昆虫分类，蜘蛛也不是昆虫。",
      "etymology": null,
      "sourceChar": "虫",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=虫",
      "family": "自然与四季",
      "quotes": []
    },
    {
      "id": "牛-niu2",
      "char": "牛",
      "numberPinyin": "niu2",
      "layout": "独体",
      "parts": [
        "牛"
      ],
      "meaning": "一种有蹄的哺乳动物。",
      "memory": "两横一竖加一撇，记住牛的轮廓。",
      "words": [
        "水牛",
        "牛奶",
        "小牛"
      ],
      "sentence": "小牛跟着母牛慢慢走。",
      "trap": "牛和午的竖长短、出头位置不同。",
      "etymology": null,
      "sourceChar": "牛",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=牛",
      "family": "自然与四季",
      "quotes": []
    },
    {
      "id": "羊-yang2",
      "char": "羊",
      "numberPinyin": "yang2",
      "layout": "独体",
      "parts": [
        "羊"
      ],
      "meaning": "一种有蹄的哺乳动物。",
      "memory": "上面两笔像角，竖笔把中间连起来。",
      "words": [
        "山羊",
        "羊毛",
        "小羊"
      ],
      "sentence": "小羊在草地上低头吃草。",
      "trap": "山羊与绵羊不是同一种动物。",
      "etymology": null,
      "sourceChar": "羊",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=羊",
      "family": "自然与四季",
      "quotes": []
    },
    {
      "id": "马-ma3",
      "char": "马",
      "numberPinyin": "ma3",
      "layout": "独体",
      "parts": [
        "马"
      ],
      "meaning": "一种常用于骑乘等的有蹄动物。",
      "memory": "先看转折，再看下面一横，记简体马。",
      "words": [
        "马路",
        "骏马",
        "木马"
      ],
      "sentence": "旋转木马一圈一圈转起来。",
      "trap": "马路今天不只让马走；马是馬的简化字。",
      "etymology": null,
      "sourceChar": "馬",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=馬",
      "family": "自然与四季",
      "quotes": []
    },
    {
      "id": "犬-quan3",
      "char": "犬",
      "numberPinyin": "quan3",
      "layout": "独体",
      "parts": [
        "犬"
      ],
      "meaning": "狗，常见于书面表达。",
      "memory": "大字右上角多一点，别漏掉它。",
      "words": [
        "猎犬",
        "警犬",
        "犬牙"
      ],
      "sentence": "警犬和训练员一起完成任务。",
      "trap": "犬与大不同；犬字旁写成犭时也有变化。",
      "etymology": null,
      "sourceChar": "犬",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=犬",
      "family": "自然与四季",
      "quotes": []
    },
    {
      "id": "猫-mao1",
      "char": "猫",
      "numberPinyin": "mao1",
      "layout": "左右",
      "parts": [
        "犭",
        "苗"
      ],
      "meaning": "一种常见的哺乳动物。",
      "memory": "反犬旁提示动物，右边是苗。",
      "words": [
        "小猫",
        "猫咪",
        "花猫"
      ],
      "sentence": "小猫轻轻地跳上了窗台。",
      "trap": "有反犬旁不等于它就是狗；苗不是说猫由苗长成。",
      "etymology": null,
      "sourceChar": "猫",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=猫",
      "family": "自然与四季",
      "quotes": []
    },
    {
      "id": "早-zao3",
      "char": "早",
      "numberPinyin": "zao3",
      "layout": "上下",
      "parts": [
        "日",
        "十"
      ],
      "meaning": "时间靠前。",
      "memory": "日字下面一个十，联想太阳早早升起。",
      "words": [
        "早晨",
        "早饭",
        "提早"
      ],
      "sentence": "我提早收好书包，出门就不慌了。",
      "trap": "“日加十”是观察字形，不是把太阳加十个。",
      "etymology": null,
      "sourceChar": "早",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=早",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "晚-wan3",
      "char": "晚",
      "numberPinyin": "wan3",
      "layout": "左右",
      "parts": [
        "日",
        "免"
      ],
      "meaning": "一天中靠后的时间，也指迟。",
      "memory": "日字旁在左，右边是免。",
      "words": [
        "晚上",
        "晚饭",
        "晚霞"
      ],
      "sentence": "晚上，我和爸爸把白天的问题再聊一遍。",
      "trap": "晚饭不一定等到天黑才吃；右边免不要误写成兔。",
      "etymology": null,
      "sourceChar": "晚",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=晚",
      "family": "生活与表达",
      "quotes": [
        "q15"
      ]
    },
    {
      "id": "天-tian1",
      "char": "天",
      "numberPinyin": "tian1",
      "layout": "独体",
      "parts": [
        "天"
      ],
      "meaning": "天空，也表示一天等。",
      "memory": "大上面加一横，联想头顶的天空。",
      "words": [
        "天空",
        "天气",
        "今天"
      ],
      "sentence": "今天的天空有一朵像小船的云。",
      "trap": "天和夫、夭要分清，第一笔和出头位置不同。",
      "etymology": null,
      "sourceChar": "天",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=天",
      "family": "自然与四季",
      "quotes": [
        "q14",
        "q15"
      ]
    },
    {
      "id": "上-shang4",
      "char": "上",
      "numberPinyin": "shang4",
      "layout": "独体",
      "parts": [
        "上"
      ],
      "meaning": "位置较高、方向向高处等。",
      "memory": "短笔在长横上面，记住上方。",
      "words": [
        "上面",
        "上升",
        "上午"
      ],
      "sentence": "我把故事书放在书架的上面。",
      "trap": "上学的上表示去学校，不是往天上走。",
      "etymology": null,
      "sourceChar": "上",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=上",
      "family": "生活与表达",
      "quotes": [
        "q2",
        "q7",
        "q12",
        "q16"
      ]
    },
    {
      "id": "下-xia4",
      "char": "下",
      "numberPinyin": "xia4",
      "layout": "独体",
      "parts": [
        "下"
      ],
      "meaning": "位置较低、方向向低处等。",
      "memory": "短笔在长横下面，记住下方。",
      "words": [
        "下面",
        "下雨",
        "下午"
      ],
      "sentence": "小猫躲在桌子下面。",
      "trap": "下雨的下表示降落，不是地点。",
      "etymology": null,
      "sourceChar": "下",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=下",
      "family": "生活与表达",
      "quotes": [
        "q8"
      ]
    },
    {
      "id": "左-zuo3",
      "char": "左",
      "numberPinyin": "zuo3",
      "layout": "半包围",
      "parts": [
        "𠂇",
        "工"
      ],
      "meaning": "面对同一方向时身体的一侧。",
      "memory": "里面是工，左工右口，先分清字形。",
      "words": [
        "左边",
        "左手",
        "左侧"
      ],
      "sentence": "我把水杯放在书的左边。",
      "trap": "左右依赖观察方向，转身以后不要只凭屏幕位置判断。",
      "etymology": null,
      "sourceChar": "左",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=左",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "右-you4",
      "char": "右",
      "numberPinyin": "you4",
      "layout": "半包围",
      "parts": [
        "𠂇",
        "口"
      ],
      "meaning": "与左相对的一侧。",
      "memory": "里面是口，和左的工对比。",
      "words": [
        "右边",
        "右手",
        "右侧"
      ],
      "sentence": "这张地图的右边画着一条河。",
      "trap": "“右边”不自动等于东方，要看地图方向。",
      "etymology": null,
      "sourceChar": "右",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=右",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "东-dong1",
      "char": "东",
      "numberPinyin": "dong1",
      "layout": "独体",
      "parts": [
        "东"
      ],
      "meaning": "太阳升起的大致方向，也用于方位。",
      "memory": "先记简化字的中竖和两侧点撇。",
      "words": [
        "东方",
        "东风",
        "东西"
      ],
      "sentence": "清晨，我们朝东方看日出。",
      "trap": "东西表示物品时，西常读轻声；不是每次都指两个方向。",
      "etymology": null,
      "sourceChar": "东",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=东",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "西-xi1",
      "char": "西",
      "numberPinyin": "xi1",
      "layout": "独体",
      "parts": [
        "西"
      ],
      "meaning": "与东相对的方向。",
      "memory": "外框里面还有两笔，别写成四。",
      "words": [
        "西方",
        "西瓜",
        "东西"
      ],
      "sentence": "太阳快落山时，西边的云红了。",
      "trap": "西与酉相似，酉里面还多一横。",
      "etymology": null,
      "sourceChar": "西",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=西",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "南-nan2",
      "char": "南",
      "numberPinyin": "nan2",
      "layout": "上下",
      "parts": [
        "十",
        "冂",
        "丷",
        "干"
      ],
      "meaning": "方向名，与北相对。",
      "memory": "把内部笔画分组，别遗漏里面的两点。",
      "words": [
        "南方",
        "南面",
        "指南"
      ],
      "sentence": "指南针帮我们辨认南北方向。",
      "trap": "古文“南无”另有特殊读音；本课只学方向义。",
      "etymology": null,
      "sourceChar": "南",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=南",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "北-bei3",
      "char": "北",
      "numberPinyin": "bei3",
      "layout": "左右",
      "parts": [
        "丬",
        "匕"
      ],
      "meaning": "方向名，与南相对。",
      "memory": "左右两边背向着站，帮助我记北。",
      "words": [
        "北方",
        "北面",
        "北风"
      ],
      "sentence": "北风吹来，我把外套拉链拉好了。",
      "trap": "这里的左右部件是记形辅助，不等于两个现代词的意义相加。",
      "etymology": null,
      "sourceChar": "北",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=北",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "大-da4",
      "char": "大",
      "numberPinyin": "da4",
      "layout": "独体",
      "parts": [
        "大"
      ],
      "meaning": "尺寸、数量、程度等较多或较强。",
      "memory": "伸开双臂，联想“大”。",
      "words": [
        "大海",
        "大家",
        "大小"
      ],
      "sentence": "大家一起抬起了大箱子。",
      "trap": "大小要比较同一种量，不能只凭图画占的面积。",
      "etymology": null,
      "sourceChar": "大",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=大",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "小-xiao3",
      "char": "小",
      "numberPinyin": "xiao3",
      "layout": "独体",
      "parts": [
        "小"
      ],
      "meaning": "尺寸、数量或程度等较少。",
      "memory": "中间竖钩，两边一撇一点，别挤在一起。",
      "words": [
        "小心",
        "小河",
        "大小"
      ],
      "sentence": "过马路时，我们要小心观察。",
      "trap": "小心不是心脏变小，而是注意、谨慎。",
      "etymology": null,
      "sourceChar": "小",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=小",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "多-duo1",
      "char": "多",
      "numberPinyin": "duo1",
      "layout": "上下",
      "parts": [
        "夕",
        "夕"
      ],
      "meaning": "数量较大，也可表示程度。",
      "memory": "两个夕上下相叠，联想比一个更多。",
      "words": [
        "多少",
        "许多",
        "多彩"
      ],
      "sentence": "我在公园里看见了许多不同的叶子。",
      "trap": "多不等于越多越好，要看需要。",
      "etymology": null,
      "sourceChar": "多",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=多",
      "family": "生活与表达",
      "quotes": [
        "q5"
      ]
    },
    {
      "id": "少-shao3",
      "char": "少",
      "numberPinyin": "shao3",
      "layout": "独体",
      "parts": [
        "少"
      ],
      "meaning": "数量不多，与多相对。",
      "memory": "和小比较，下面多一撇，记住少。",
      "words": [
        "多少",
        "少量",
        "缺少"
      ],
      "sentence": "盒子里的积木少了两块。",
      "trap": "少还有shào音，如少年；要看词义。",
      "etymology": null,
      "sourceChar": "少",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=少",
      "family": "生活与表达",
      "quotes": [
        "q5"
      ]
    },
    {
      "id": "少-shao4",
      "char": "少",
      "numberPinyin": "shao4",
      "layout": "独体",
      "parts": [
        "少"
      ],
      "meaning": "年纪比较轻，常用在少年、年少里。",
      "memory": "同一个字换声调，放进少年里记。",
      "words": [
        "少年",
        "年少",
        "少女"
      ],
      "sentence": "少年们一起完成了小发明。",
      "trap": "少量读shǎo；少年读shào。",
      "etymology": null,
      "sourceChar": "少",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=少",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "长-chang2",
      "char": "长",
      "numberPinyin": "chang2",
      "layout": "独体",
      "parts": [
        "长"
      ],
      "meaning": "长度大，也可指时间久。",
      "memory": "看清一竖提和伸出的捺，联想长长的路。",
      "words": [
        "长短",
        "长久",
        "长江"
      ],
      "sentence": "长江把沿岸许多城市连接起来。",
      "trap": "长短读cháng；长大读zhǎng。",
      "etymology": null,
      "sourceChar": "長",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=長",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "长-zhang3",
      "char": "长",
      "numberPinyin": "zhang3",
      "layout": "独体",
      "parts": [
        "长"
      ],
      "meaning": "生长，也指年长或负责人。",
      "memory": "一天天长高，读音也和“长短”不同。",
      "words": [
        "长大",
        "生长",
        "家长"
      ],
      "sentence": "小苗在阳光和雨水中慢慢长大。",
      "trap": "长大不是变得更长这一种变化，还包括成长。",
      "etymology": null,
      "sourceChar": "長",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=長",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "乐-le4",
      "char": "乐",
      "numberPinyin": "le4",
      "layout": "独体",
      "parts": [
        "乐"
      ],
      "meaning": "高兴、愉快。",
      "memory": "先认现代简体乐，再放进快乐里记音。",
      "words": [
        "快乐",
        "欢乐",
        "乐趣"
      ],
      "sentence": "和朋友一起读书，让我觉得很快乐。",
      "trap": "音乐的乐读yuè；不能见乐都读lè。",
      "etymology": null,
      "sourceChar": "樂",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=樂",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "乐-yue4",
      "char": "乐",
      "numberPinyin": "yue4",
      "layout": "独体",
      "parts": [
        "乐"
      ],
      "meaning": "音乐，或与音乐有关的事物。",
      "memory": "听一段乐曲，用词义分辨读音。",
      "words": [
        "音乐",
        "乐曲",
        "乐器"
      ],
      "sentence": "我用小鼓为乐曲打节拍。",
      "trap": "快乐读lè，音乐读yuè。",
      "etymology": null,
      "sourceChar": "樂",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=樂",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "行-xing2",
      "char": "行",
      "numberPinyin": "xing2",
      "layout": "左右",
      "parts": [
        "彳",
        "亍"
      ],
      "meaning": "走、行动，也可表示可以。",
      "memory": "左右两部分像道路，联想行走。",
      "words": [
        "行走",
        "行动",
        "出行"
      ],
      "sentence": "我们用行动把班级变得更整洁。",
      "trap": "银行、行业的行读háng。",
      "etymology": null,
      "sourceChar": "行",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=行",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "行-hang2",
      "char": "行",
      "numberPinyin": "hang2",
      "layout": "左右",
      "parts": [
        "彳",
        "亍"
      ],
      "meaning": "行列、行业等。",
      "memory": "一行树、一种行业，放进词里辨读音。",
      "words": [
        "银行",
        "行业",
        "行列"
      ],
      "sentence": "路边有一行整齐的小树。",
      "trap": "不把银行读成yín xíng。",
      "etymology": null,
      "sourceChar": "行",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=行",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "觉-jue2",
      "char": "觉",
      "numberPinyin": "jue2",
      "layout": "上下",
      "parts": [
        "⺍",
        "冖",
        "见"
      ],
      "meaning": "感到、察觉。",
      "memory": "下面有见，联想到发现变化。",
      "words": [
        "觉得",
        "感觉",
        "察觉"
      ],
      "sentence": "我察觉到窗外的风变大了。",
      "trap": "睡觉读jiào；感觉读jué。",
      "etymology": null,
      "sourceChar": "覺",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=覺",
      "family": "身体与感受",
      "quotes": [
        "q4"
      ]
    },
    {
      "id": "觉-jiao4",
      "char": "觉",
      "numberPinyin": "jiao4",
      "layout": "上下",
      "parts": [
        "⺍",
        "冖",
        "见"
      ],
      "meaning": "睡眠，常用于睡觉。",
      "memory": "和睡放一起，就读jiào。",
      "words": [
        "睡觉",
        "午觉",
        "一觉"
      ],
      "sentence": "午觉醒来，我觉得精神好多了。",
      "trap": "这一句“午觉”的觉和“觉得”的觉读音不同。",
      "etymology": null,
      "sourceChar": "覺",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=覺",
      "family": "身体与感受",
      "quotes": []
    },
    {
      "id": "种-zhong3",
      "char": "种",
      "numberPinyin": "zhong3",
      "layout": "左右",
      "parts": [
        "禾",
        "中"
      ],
      "meaning": "种子、种类。",
      "memory": "禾字旁让我想起植物的种子。",
      "words": [
        "种子",
        "种类",
        "品种"
      ],
      "sentence": "我把不同种类的种子分开放好。",
      "trap": "种花读zhòng；种子读zhǒng。",
      "etymology": null,
      "sourceChar": "種",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=種",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "种-zhong4",
      "char": "种",
      "numberPinyin": "zhong4",
      "layout": "左右",
      "parts": [
        "禾",
        "中"
      ],
      "meaning": "把种子或幼苗栽进土里。",
      "memory": "轮到动手播种了，读第四声。",
      "words": [
        "种花",
        "种树",
        "播种"
      ],
      "sentence": "春天，我们在花盆里种下一粒种子。",
      "trap": "同一句里种下与种子的种读音不同。",
      "etymology": null,
      "sourceChar": "種",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=種",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "重-zhong4",
      "char": "重",
      "numberPinyin": "zhong4",
      "layout": "独体",
      "parts": [
        "重"
      ],
      "meaning": "重量大，也指重要。",
      "memory": "抬起书包，感受轻与重。",
      "words": [
        "重量",
        "重要",
        "轻重"
      ],
      "sentence": "这个问题很重要，我要认真想一想。",
      "trap": "重要不是一定很沉；重新读chóng。",
      "etymology": null,
      "sourceChar": "重",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=重",
      "family": "生活与表达",
      "quotes": []
    },
    {
      "id": "重-chong2",
      "char": "重",
      "numberPinyin": "chong2",
      "layout": "独体",
      "parts": [
        "重"
      ],
      "meaning": "再一次、重复。",
      "memory": "重新做一遍，记住第二声。",
      "words": [
        "重新",
        "重复",
        "重逢"
      ],
      "sentence": "第一次没成功，我重新试了一次。",
      "trap": "重复读chóng，重量读zhòng。",
      "etymology": null,
      "sourceChar": "重",
      "source": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=重",
      "family": "生活与表达",
      "quotes": []
    }
  ],
  "quotes": [
    {
      "id": "q1",
      "title": "海棠",
      "author": "苏轼",
      "dynasty": "宋",
      "text": "只恐夜深花睡去，故烧高烛照红妆。",
      "explain": "诗人把花当成会睡着的人来写。这是拟人，不是花真的像人一样睡眠。",
      "url": "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=睡",
      "readings": {
        "睡": "shui4",
        "花": "hua1"
      }
    },
    {
      "id": "q2",
      "title": "静夜思",
      "author": "李白",
      "dynasty": "唐",
      "text": "床前明月光，疑是地上霜。",
      "explain": "明亮的月光落在床前，诗人一时觉得像地上的白霜。这里采用常见《唐诗三百首》版本。",
      "url": "https://zh.wikisource.org/wiki/靜夜思",
      "readings": {}
    },
    {
      "id": "q3",
      "title": "静夜思",
      "author": "李白",
      "dynasty": "唐",
      "text": "举头望明月，低头思故乡。",
      "explain": "抬头望月、低头思乡，动作把心里的想念表现出来。",
      "url": "https://zh.wikisource.org/wiki/靜夜思",
      "readings": {}
    },
    {
      "id": "q4",
      "title": "春晓",
      "author": "孟浩然",
      "dynasty": "唐",
      "text": "春眠不觉晓，处处闻啼鸟。",
      "explain": "春天醒来才发觉天亮了，四处传来鸟叫。觉在这里读jué，表示察觉。",
      "url": "https://zh.wikisource.org/wiki/春曉_(孟浩然)",
      "readings": {
        "觉": "jue2"
      }
    },
    {
      "id": "q5",
      "title": "春晓",
      "author": "孟浩然",
      "dynasty": "唐",
      "text": "夜来风雨声，花落知多少。",
      "explain": "想到昨夜的风雨，诗人关心花儿落了多少。少在这里读shǎo。",
      "url": "https://zh.wikisource.org/wiki/春曉_(孟浩然)",
      "readings": {
        "少": "shao3"
      }
    },
    {
      "id": "q6",
      "title": "登鹳雀楼",
      "author": "王之涣",
      "dynasty": "唐",
      "text": "白日依山尽，黄河入海流。",
      "explain": "太阳挨着山落下，黄河向大海流去；把目光从近处送向远处。",
      "url": "https://zh.wikisource.org/wiki/登鸛雀樓_(王之渙)",
      "readings": {}
    },
    {
      "id": "q7",
      "title": "登鹳雀楼",
      "author": "王之涣",
      "dynasty": "唐",
      "text": "欲穷千里目，更上一层楼。",
      "explain": "想看得更远，就再登高一层；目在这里与视野有关。",
      "url": "https://zh.wikisource.org/wiki/登鸛雀樓_(王之渙)",
      "readings": {}
    },
    {
      "id": "q8",
      "title": "咏柳",
      "author": "贺知章",
      "dynasty": "唐",
      "text": "碧玉妆成一树高，万条垂下绿丝绦。",
      "explain": "柳树像用碧玉装扮，枝条像下垂的绿色丝带。这是比喻。",
      "url": "https://zh.wikisource.org/wiki/詠柳_(賀知章)",
      "readings": {}
    },
    {
      "id": "q9",
      "title": "咏柳",
      "author": "贺知章",
      "dynasty": "唐",
      "text": "不知细叶谁裁出，二月春风似剪刀。",
      "explain": "春风像巧手拿着剪刀，把细叶裁出来；春风并不真的拿剪刀。",
      "url": "https://zh.wikisource.org/wiki/詠柳_(賀知章)",
      "readings": {}
    },
    {
      "id": "q10",
      "title": "江雪",
      "author": "柳宗元",
      "dynasty": "唐",
      "text": "千山鸟飞绝，万径人踪灭。",
      "explain": "山野静极了，看不见飞鸟，也看不见行人。",
      "url": "https://zh.wikisource.org/wiki/江雪",
      "readings": {}
    },
    {
      "id": "q11",
      "title": "江雪",
      "author": "柳宗元",
      "dynasty": "唐",
      "text": "孤舟蓑笠翁，独钓寒江雪。",
      "explain": "一位披蓑戴笠的老人，在寒冷的江上独自钓鱼；注意“独”的画面感。",
      "url": "https://zh.wikisource.org/wiki/江雪",
      "readings": {}
    },
    {
      "id": "q12",
      "title": "游子吟",
      "author": "孟郊",
      "dynasty": "唐",
      "text": "慈母手中线，游子身上衣。",
      "explain": "妈妈用针线为远行的孩子缝衣，把牵挂放在一个细小动作里。",
      "url": "https://zh.wikisource.org/wiki/遊子吟_(孟郊)",
      "readings": {}
    },
    {
      "id": "q13",
      "title": "游子吟",
      "author": "孟郊",
      "dynasty": "唐",
      "text": "谁言寸草心，报得三春晖。",
      "explain": "用小草和春日阳光，表达孩子对母亲养育之恩的感受。",
      "url": "https://zh.wikisource.org/wiki/遊子吟_(孟郊)",
      "readings": {}
    },
    {
      "id": "q14",
      "title": "晓出净慈寺送林子方",
      "author": "杨万里",
      "dynasty": "宋",
      "text": "接天莲叶无穷碧，映日荷花别样红。",
      "explain": "莲叶连到远方，荷花在阳光下格外红；用颜色和范围把景物写具体。",
      "url": "https://zh.wikisource.org/wiki/曉出淨慈寺送林子方",
      "readings": {}
    },
    {
      "id": "q15",
      "title": "山居秋暝",
      "author": "王维",
      "dynasty": "唐",
      "text": "空山新雨后，天气晚来秋。",
      "explain": "山里刚下过雨，傍晚有了秋天的凉意。",
      "url": "https://zh.wikisource.org/wiki/山居秋暝",
      "readings": {}
    },
    {
      "id": "q16",
      "title": "山居秋暝",
      "author": "王维",
      "dynasty": "唐",
      "text": "明月松间照，清泉石上流。",
      "explain": "月光从松间照下，清泉在石头上流动；一个写光，一个写水。",
      "url": "https://zh.wikisource.org/wiki/山居秋暝",
      "readings": {}
    },
    {
      "id": "q17",
      "title": "春夜喜雨",
      "author": "杜甫",
      "dynasty": "唐",
      "text": "好雨知时节，当春乃发生。",
      "explain": "诗人把及时来到的春雨写得像懂得时节一样。好在这里读hǎo。",
      "url": "https://zh.wikisource.org/wiki/春夜喜雨",
      "readings": {
        "好": "hao3"
      }
    },
    {
      "id": "q18",
      "title": "春夜喜雨",
      "author": "杜甫",
      "dynasty": "唐",
      "text": "随风潜入夜，润物细无声。",
      "explain": "小雨跟着风悄悄来到夜里，轻轻滋润万物。",
      "url": "https://zh.wikisource.org/wiki/春夜喜雨",
      "readings": {}
    },
    {
      "id": "q19",
      "title": "春夜喜雨",
      "author": "杜甫",
      "dynasty": "唐",
      "text": "野径云俱黑，江船火独明。",
      "explain": "小路和云都暗下来了，江船上的灯火却亮着；明暗形成对照。",
      "url": "https://zh.wikisource.org/wiki/春夜喜雨",
      "readings": {}
    }
  ]
};
if(typeof module==="object"&&module.exports)module.exports=data;else root.ChineseData=data;
})(typeof globalThis!=="undefined"?globalThis:this);
