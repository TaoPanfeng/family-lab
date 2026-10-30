# 英语、信息与编程、音乐 · 三个动手工作台

## 为什么增加这三馆

现有十一馆已经覆盖自然科学、人文、数学、识字与身体观察。新增三馆补上“表达意思、设计过程、创作作品”，不是把现有动画换个标题重复呈现。每馆三个精选主题，按顺序开发和局部验收，再接入首页与全站发布。

| 馆 | 主题 | 孩子实际能做什么 |
| --- | --- | --- |
| 英语 | 小球在哪里 | 切换四种相对位置，看句子与画面一致变化，再做不提前显示答案的看图选择 |
| 英语 | 句子积木 | 4组独立语境中点词排序、撤回、检查，反馈am/is/can/likes的不同作用 |
| 英语 | 单数与复数 | 操作四类物品、1—6个数量，比较s、es和不规则children |
| 信息与编程 | 网格机器人 | 前进、相对转向、有限重复、连续播放、单步、轨迹定位、碰墙停、保存程序 |
| 信息与编程 | 像素与编码 | 36个黑白像素逐格编辑、观察二进制和行程编码；比较变短与反而变长 |
| 信息与编程 | 查找 | 顺序与二分同步逐步显示；试1、16、32，分清个例和最坏比较次数 |
| 音乐 | 音高与频率 | 八键音阶、10毫秒正弦图、八度对比、频率与音量独立变化 |
| 音乐 | 节奏 | 2行×8拍格子、空拍、合成双音、音频时钟、变速、定位、保存 |
| 音乐 | 旋律 | 五声音阶×8拍、同一拍单音或休止、播放和保存原创建曲 |

## 一致的学习体验

每个主题都有儿童/进阶说明、三步观察、生活用途、职业用途、易错点和模型边界。桌面侧栏与手机可折叠菜单、搜索、收藏、发现记录、作品备份同时提供。操作优先点按，必须横滑的音乐网格只在局部横滑，正常页面纵向滚动保留；播放时只滚动网格以跟随当前拍，不跳动页面。

音乐默认没有创建AudioContext，必须明确点“开启声音”才启用。开启本身不播放；默认低合成增益，暂停、静音、退出及后台会停声。无麦克风、无录音、无上传，输出音量还受设备设置影响。音高采用A4=440 Hz的十二平均律，不是真实乐器采样或分贝测量。

英语本地语音是可选能力：仅localService英语声音可用时启用，缺少则明确解释，不向网络语音服务发送文字。不把机器朗读当真人发音评测。

作品是限定数组，不执行用户代码。存储分别使用各馆独立键，不覆盖原有十一馆记录。备份严格校验主题、条目、长度、数组和值域；合并保留当前同名笔记和作品。只在点击保存作品后保存程序、像素、节奏、旋律；发现笔记自动保存并可手动确认。看过或答对一次不标为掌握。

## 参考与许可（2026-10-30核对）

- British Council LearnEnglish Kids，方位介词、be动词和可数名词的语法分类：
  https://learnenglishkids.britishcouncil.org/grammar-vocabulary/grammar-practice/prepositions-place
  https://learnenglishkids.britishcouncil.org/grammar-vocabulary/grammar-practice/present-simple-verb-be
  https://learnenglishkids.britishcouncil.org/grammar-vocabulary/grammar-practice/nouns-countable-uncountable
- CS Unplugged，Kidbots和顺序/二分查找教学思想：
  https://www.csunplugged.org/en/topics/kidbots/
  https://www.csunplugged.org/en/topics/searching-algorithms/
- Chrome Music Lab及其开源项目，可视化音乐与格子创作思路：
  https://musiclab.chromeexperiments.com/
  https://github.com/googlecreativelab/chrome-music-lab
- MDN，Web Audio用户触发、控制和音频时钟：
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices
  https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/currentTime

仅参考思想与事实分类，没有复制以上项目的代码、教材、音频、图片、字体。三馆和shared/workshop为本项目原创MIT实现，不增加运行时外部依赖；不声称上游背书。

## 验收与边界

`node --test tests/workshops-models.test.cjs` 覆盖结构、精确数值、碰撞、比较次数、编码可逆性、单复数、备份及依赖边界。
`python tests/workshops-browser.py --file / --site / --base <根地址>` 分别执行真实离线、HTTP和公开网址点击、实际音频信号、时钟、暂停、逐页、记录以及可信手机触摸检查。`--inject`仅为受限环境的内容测试，不是实际导航或线上验收。

九个主题是入门，不是三门完整课程。机器人是二维确定性状态机，不是实体机器人动力学；像素位数忽略文件头；查找不算排序成本。音乐无作曲评分。自动音频检查不等于听过扬声器，不宣称全平台真机认证。旧馆回归全部保留。
