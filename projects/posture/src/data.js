/* 身有度 | 姿势内容与来源。步骤为项目编排，不是临床操作处方。 */
(function (root, factory) {
  const data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.PostureData = data;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const sources = {
    oshaChair: { title: 'OSHA · 工作椅与支撑', organization: '美国职业安全与健康管理局', type: '工作环境指导', url: 'https://www.osha.gov/etools/computer-workstations/components/chairs', note: '脚掌获得支撑；肩部放松；椅背提供合适支撑。并未给出仅由身高决定的唯一椅高。' },
    oshaMonitor: { title: 'OSHA · 显示器位置', organization: '美国职业安全与健康管理局', type: '工作环境指导', url: 'https://www.osha.gov/etools/computer-workstations/components/monitors', note: '屏幕上缘在眼平或略低处；常用观看距离约 50–100 cm。应兼顾字号、视力和镜片。' },
    oshaPosition: { title: 'OSHA · 中性工作姿势', organization: '美国职业安全与健康管理局', type: '工作环境指导', url: 'https://www.osha.gov/etools/computer-workstations/positions', note: '手腕与前臂自然对齐，肘靠近身体，双脚有支撑；持续保持同一姿势并不理想。' },
    mayoOffice: { title: 'Mayo Clinic · 办公人体工学', organization: 'Mayo Clinic', type: '患者教育', url: 'https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/office-ergonomics/art-20046169', note: '先调整椅子和支撑，再安置输入设备、屏幕与常用物品。' },
    mayoSleep: { title: 'Mayo Clinic · 睡姿与背部舒适', organization: 'Mayo Clinic', type: '患者教育', url: 'https://www.mayoclinic.org/diseases-conditions/back-pain/in-depth/sleeping-positions/art-20546852', note: '侧卧可在膝间放枕，仰卧可尝试膝下支撑；枕头应支撑颈部。俯卧可能增加背部负担。' },
    mayoApnea: { title: 'Mayo Clinic · 阻塞性睡眠呼吸暂停', organization: 'Mayo Clinic', type: '患者教育', url: 'https://www.mayoclinic.org/diseases-conditions/obstructive-sleep-apnea/diagnosis-treatment/drc-20352095', note: '有呼吸暂停或憋醒时应就医；体位调整不能替代已开具的治疗。' },
    mattressTrial: { title: 'Kovacs 等 · 床垫硬度随机试验（2003）', organization: 'The Lancet / PubMed', type: '原始研究', url: 'https://pubmed.ncbi.nlm.nih.gov/14630439/', note: '针对慢性非特异性腰痛受试者，中等硬度床垫的部分结局优于硬床垫。不能推导出所有人都应选同一硬度。' },
    refluxStudy: { title: 'Schuitenmaker 等 · 夜间反流与卧位（2022）', organization: 'American Journal of Gastroenterology / PubMed', type: '原始研究', url: 'https://pubmed.ncbi.nlm.nih.gov/34928874/', note: '在该研究人群中，左侧卧与较短的夜间食管酸暴露时间相关；不是人人适用的治疗承诺。' },
    nhsBreath: { title: 'NHS · 温和的呼吸练习', organization: '英国国家医疗服务体系', type: '患者教育', url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/', note: '以舒适为限，不用力吸深、不勉强计数。本项目节拍是可选界面工具，不是医疗呼吸处方。' },
    posture: { title: 'MedlinePlus · 姿势基础', organization: '美国国家医学图书馆', type: '健康教育', url: 'https://medlineplus.gov/guidetogoodposture.html', note: '静态与动态姿势都需要关注；经常改变位置，维持自然的脊柱曲线，不把“挺直”理解成僵硬。' },
    walking: { title: 'Mayo Clinic · 步行技巧', organization: 'Mayo Clinic', type: '健康教育', url: 'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/walking/art-20046261', note: '视线向前，颈肩放松，自然摆臂。步态模型只演示交替迈步，不分析个人步态。' },
    lingyin: { title: '灵隐寺 · 吉祥卧的传统描述', organization: '灵隐寺', type: '文化资料（非医学证据）', url: 'https://www.lingyinsi.org/detail_7315.html', note: '用于说明吉祥卧的右侧卧文化形态。原文涉及健康效果的说法不作为本项目医学依据；项目采用枕头承头的舒适改良版。' },
    knee: { title: 'NHS · 膝关节疼痛', organization: '英国国家医疗服务体系', type: '患者教育', url: 'https://www.nhs.uk/symptoms/knee-pain/', note: '膝部疼痛、肿胀或负重困难不应靠强忍姿势解决；明显症状需要评估。' }
  };
  const S = (title, text, focus) => ({ title, text, focus });
  const postures = [
    {
      id: 'office', name: '电脑工位坐姿', en: 'DESK / SITTING', category: 'sit', scene: 'office', badge: '工作日常', aliases: '程序员 办公 电脑 工位 坐高 桌高 视线',
      brief: '先让脚有着落，再让双手和视线找到位置。',
      principle: '让家具适应你，而不是让身体迁就家具。',
      benefits: ['有支撑的双脚、前臂和背部，能减少持续悬空用力。', '输入设备与屏幕分别调整，避免为了看清而一直前探。'],
      cautions: ['“端正”不是收腹挺胸、整天不动；舒适姿势也需要变化。', '身高推算只是起点，腿长、坐高、鞋底和桌面条件会影响实际尺寸。'],
      steps: [S('先坐稳、双脚落地', '臀部坐入椅面，双脚自然放到地面。脚掌悬空时，先调整椅高或增加稳固脚踏，不用脚尖勉强支撑。', 'legs'), S('让靠背接住身体', '把背部轻靠到靠背上，腰部得到舒适支持；不要为了“坐直”而持续绷住腰背。', 'torso'), S('放好左手', '左上臂自然靠近身体，前臂朝键盘方向放置。肩膀不耸起，手腕不要大幅向上折。', 'leftArm'), S('放好右手', '右手轻放鼠标或键盘，鼠标靠近身体。不要为了够鼠标，长期把右肩向前伸出去。', 'rightArm'), S('最后调整视线', '把屏幕置于正前方，上缘在眼平或略低。先把字调清楚，再微调距离；双光或渐进镜片需要另行试调。', 'head'), S('给身体换个位置', '恢复自然呼吸，检查脚、肩和下巴是否放松。按自己的任务节奏换姿势、起身走动，不必守着一种形状。', 'all')],
      checkpoints: ['双脚是否有稳定支撑？', '输入时肩膀是否放松？', '是否能不伸脖子就看清？'], sources: ['oshaChair', 'oshaMonitor', 'oshaPosition', 'mayoOffice'], evidence: '一般指导'
    },
    {
      id: 'bench', name: '公园长椅坐姿', en: 'PARK / REST', category: 'sit', scene: 'bench', badge: '户外休息', aliases: '公园 长凳 长椅 坐',
      brief: '椅子不能调，就调整支撑与停留方式。', principle: '不是每张椅子都合身；不必硬坐出“标准答案”。',
      benefits: ['背靠长椅、双脚落地，是一个容易尝试的休息起点。', '适时起身或换位置，不必长时间依赖同一个受力点。'], cautions: ['固定座高可能不适合你的腿长；脚悬空时不建议一直脚尖撑地。', '长椅太深时不要为了碰到靠背，强行把腿压在椅缘上。'],
      steps: [S('检查长椅', '先确认椅面稳固、干燥。尽量选脚下平坦的位置，观察座面高度是否合适。', 'environment'), S('坐到有支撑的位置', '缓慢坐下，让臀部稳定。背部能舒服接触靠背就轻靠；够不到时换位置，不强行后挤。', 'torso'), S('双脚自然落下', '让脚掌有支撑，膝盖朝自然的方向。没有合适脚踏时，优先换更合身的椅子。', 'legs'), S('双手松放', '左右手分别轻放大腿或身旁，手指自然弯曲，肩膀放松。', 'arms'), S('抬眼休息一会儿', '视线自然看向前方，正常呼吸。觉得压迫或发麻就换姿势，不用忍着。', 'head')], checkpoints: ['椅缘是否顶住大腿后侧？', '双脚是否落地？', '需要换张椅子吗？'], sources: ['oshaChair', 'posture'], evidence: '一般原则改编'
    },
    {
      id: 'upright', name: '椅上端坐 · 正坐', en: 'CHAIR / AWARENESS', category: 'sit', scene: 'chair', badge: '安静片刻', aliases: '正坐 端坐 冥想 椅上 端正',
      brief: '头轻轻向上，身体不用硬挺。', principle: '端正而不僵，安静而不憋。',
      benefits: ['无需地面坐姿的髋膝活动度，容易利用现成椅子。', '双手与双脚都有着落，适合观察身体是否在多余用力。'], cautions: ['不是“脊柱越直越好”，不要主动抹平自然曲线。', '端坐不等于治疗颈腰痛，也不要求长时间坚持。'],
      steps: [S('找一把稳固的椅子', '先让双脚落地，坐到稳定的位置。椅背可以使用，端坐不要求悬空挺背。', 'legs'), S('整理躯干', '轻轻找回舒服的中间位置，头在躯干上方；不要挺胸、夹紧肩胛或憋住腹部。', 'torso'), S('安放左手', '左手掌轻放左大腿，手指自然放松，手肘不必向外支开。', 'leftArm'), S('安放右手', '右手掌轻放右大腿，双肩自然下沉，不把手掌用力压进腿里。', 'rightArm'), S('视线和呼吸松下来', '眼睛自然睁开或轻闭，正常呼吸。想换姿势就调整，不用完成固定时长。', 'head')], checkpoints: ['是否在用力挺胸？', '下巴、肩膀是否放松？', '能否自然呼吸？'], sources: ['posture', 'nhsBreath'], evidence: '一般原则改编'
    },
    {
      id: 'seiza', name: '跪坐 · 传统正坐', en: 'KNEELING / TRADITION', category: 'sit', scene: 'seiza', badge: '文化姿势', aliases: '正坐 日式 跪坐 正座 跪 脚背',
      brief: '认识传统坐法，但不把酸麻当作进步。', principle: '文化姿势可以了解；疼痛不是需要突破的关卡。',
      benefits: ['便于理解“正坐”在传统跪坐语境中的身体形态。', '使用软垫或较高坐垫，可以探索是否有更舒服的支撑。'], cautions: ['深屈膝和脚背接触会让部分人不适；已有膝踝症状者不要勉强尝试。', '麻木、针刺感或疼痛时立即改变姿势；不设“必须坚持几分钟”的目标。'],
      steps: [S('先决定是否适合尝试', '膝踝有疼痛、肿胀、术后限制，或无法舒适跪下时，直接改用“椅上端坐”。模型只是形态展示。', 'legs'), S('铺垫、准备支撑', '在稳定地面铺软垫；需要时在臀部下方放稳固坐垫，减少过深下沉。不要用不稳物品叠高。', 'environment'), S('缓慢落座', '在没有疼痛的范围内屈膝，脚背自然向后，臀部轻落到脚跟附近的支撑上，不向下硬压。', 'legs'), S('手放大腿', '左手放左大腿、右手放右大腿，肩膀放松；不靠按压双腿强行维持躯干。', 'arms'), S('及时退出', '保持正常呼吸。一有酸麻或不舒服，先借助稳定支撑缓慢起身，改到椅子上。', 'all')], checkpoints: ['膝踝是否完全舒适？', '是否出现麻木或针刺感？', '椅上端坐会不会更合适？'], sources: ['posture', 'knee'], evidence: '形态示意 / 谨慎尝试'
    },
    {
      id: 'cross', name: '垫上简易盘坐', en: 'FLOOR / EASY SITTING', category: 'sit', scene: 'cross', badge: '地面坐姿', aliases: '盘腿 盘坐 打坐 垫子 冥想',
      brief: '坐垫抬高一点，不把双腿拧成目标。', principle: '能轻松退出的姿势，才值得继续探索。',
      benefits: ['坐垫可为骨盆提供支撑，便于探索地面坐姿。', '不要求莲花坐或双膝贴地，强调可调整而不是摆造型。'], cautions: ['不要用手强压膝盖下沉；髋膝不适时改坐椅子。', '模型不是柔韧性测量，左右侧舒适度可能不同。'],
      steps: [S('放稳坐垫', '将坐垫放在平整稳定的地面，身旁保留起身空间。', 'environment'), S('双腿松松交叠', '坐稳后，让双腿在前方自然交叠，不把脚搬到大腿上，也不强压膝盖。', 'legs'), S('寻找轻松的躯干位置', '适当增加坐垫高度，让身体更容易立起来；仍需用力硬挺就改用椅子。', 'torso'), S('双手轻放', '左右手放在各自大腿或膝部附近，手掌放松，不用力向下压。', 'arms'), S('随时调整', '自然呼吸。可以换腿或换坐姿；出现麻木、刺痛就结束。', 'all')], checkpoints: ['是否强行压膝？', '坐垫是否稳定？', '双腿是否有麻木？'], sources: ['posture', 'knee'], evidence: '一般原则改编'
    },
    {
      id: 'stand', name: '自然站立', en: 'STANDING / EVERYDAY', category: 'stand', scene: 'stand', badge: '日常姿势', aliases: '站 住 站立 自然 排队',
      brief: '轻松地站着，不把自己站成一块木板。', principle: '站稳不是锁死；允许细小、自然的重心变化。',
      benefits: ['可作为观察脚下支撑、头肩位置的起点。', '能与坐姿、行走交替，不需要复杂器材。'], cautions: ['不要用力锁死膝盖或过度挺腰。', '站立不是对抗久坐的唯一答案，也不适合长时间一动不动。'],
      steps: [S('让双脚找到位置', '双脚按舒适距离分开，脚掌自然接触地面；不必追求完全相同的脚尖角度。', 'legs'), S('膝盖保持自然', '膝盖放在轻松的位置，不用力顶向后方，也不用刻意半蹲。', 'legs'), S('放松腰背与肩膀', '头轻轻位于身体上方，肩膀自然放下，不挺胸收腹到呼吸受限。', 'torso'), S('手臂自然下垂', '左右手臂放在身体两侧，手指不用伸直绷紧。', 'arms'), S('允许变化', '正常呼吸，间或换脚、走动或坐下，不把“静止”当作考核。', 'all')], checkpoints: ['膝盖是否被顶死？', '是否过度挺腰？', '需要走动或坐下吗？'], sources: ['posture'], evidence: '一般指导'
    },
    {
      id: 'standdesk', name: '站立工位', en: 'DESK / STANDING', category: 'stand', scene: 'standdesk', badge: '坐站交替', aliases: '升降桌 站着办公 站立工位',
      brief: '把工位升高，而不是把肩膀耸起来。', principle: '坐与站轮换，比把一种姿势做到极致更实用。',
      benefits: ['提供与坐姿不同的工作位置，便于穿插改变姿势。', '输入面和屏幕分开调节，能更贴近站立时的手、眼位置。'], cautions: ['持续站着同样可能疲劳；没有人人适用的固定坐站比例。', '桌子不合适时，不要长期踮脚、抬肩或弯腰去将就。'],
      steps: [S('先站得自然', '双脚按舒服的距离分开，膝盖不锁死，桌下保留站位空间。', 'legs'), S('调整输入面', '上臂自然垂下，前臂朝键盘方向放置。把输入面调到不必耸肩的位置。', 'environment'), S('左手靠近身体', '左手放键盘，肩膀放松，手腕避免明显折起。', 'leftArm'), S('右手就近操作', '右手在键盘或鼠标附近操作，不向前远伸。', 'rightArm'), S('调整显示器并准备交替', '屏幕上缘约在眼平或略低；调大字号避免探头。疲劳时坐下或走动，不必坚持站满某个时长。', 'head')], checkpoints: ['是否为了桌高而耸肩？', '脚下是否有站位空间？', '什么时候方便换姿势？'], sources: ['oshaPosition', 'oshaMonitor', 'mayoOffice'], evidence: '一般指导'
    },
    {
      id: 'quiet', name: '松静站立 · 觉察', en: 'STANDING / AWARENESS', category: 'stand', scene: 'quiet', badge: '轻柔觉察', aliases: '站桩 静立 松静 觉察 佛 道 内劲',
      brief: '少一点多余用力，不追求神秘体感。', principle: '松而不垮，静而不僵；不以酸、麻、抖作为功效指标。',
      benefits: ['提供一个检查下巴、肩膀、膝盖是否紧张的机会。', '不要求闭眼、不要求憋气，不需要追求动作幅度。'], cautions: ['本条目不是武术站桩、内劲或康复课程。', '头晕、明显疲劳、疼痛时停止；平衡不稳者不要独自闭眼站立。'],
      steps: [S('先保证站得稳', '在平坦处自然站立，旁边有可用的稳固支撑；不需要闭眼。', 'legs'), S('膝盖不锁死', '保持自然站立，不追求低架或明显半蹲。', 'legs'), S('少用一点肩颈力', '下巴、肩膀轻轻放松，头不前顶，腰不过度后拱。', 'torso'), S('双手自然垂放', '手臂垂在两侧，手指自然弯曲，不固定手型。', 'arms'), S('观察，不操控呼吸', '注意到吸气、呼气即可，不刻意把气压向腹部，不屏息。身体想调整时就调整。', 'head')], checkpoints: ['是否在追求酸麻或抖动？', '是否用力控制呼吸？', '能否轻松地结束？'], sources: ['posture', 'nhsBreath'], evidence: '觉察练习 / 非疗效声明'
    },
    {
      id: 'walk', name: '自然行走', en: 'WALKING / EVERYDAY', category: 'walk', scene: 'walk', badge: '动态姿势', aliases: '走路 行 步行 摆臂 步态',
      brief: '抬眼看路，双臂自然摆起来。', principle: '先走得稳、走得舒服，再谈节奏和距离。',
      benefits: ['交替迈步与自然摆臂，提供静坐之外的活动方式。', '可用慢速模型观察左右腿与相对侧手臂的配合。'], cautions: ['演示步频不是个人运动处方，也不能判断内外八、足弓或步态异常。', '疼痛、眩晕或平衡障碍时应停止，不照着模型强行改变步态。'],
      steps: [S('先看清前方', '选平坦安全的路线，视线自然向前，留意地面障碍，不一直盯着手机。', 'head'), S('肩颈自然放松', '头在躯干上方，不挺胸到腰部僵硬，手臂自然垂下。', 'torso'), S('迈出舒服的一步', '按自己舒服的步幅向前迈步，不追求大步跨出去，也不故意重踩地面。', 'legs'), S('让手臂自然配合', '一侧腿向前时，对侧手臂自然向前摆动。手肘略弯，不用刻意摆到固定高度。', 'arms'), S('按舒适节奏继续', '正常呼吸。步频滑块只控制模型播放速度，别为了追上数字而改变身体节奏。', 'all')], checkpoints: ['是否能看清前方？', '肩膀是否过紧？', '是否走得稳、没有疼痛？'], sources: ['walking', 'posture'], evidence: '一般指导'
    }
  ];
  function side(id, name, direction, extra) {
    const right = direction === '右', lower = right ? '右' : '左', upper = right ? '左' : '右';
    return Object.assign({
      id, name, en: (right ? 'RIGHT' : 'LEFT') + ' SIDE / SLEEP', category: 'lie', scene: 'sleep', side: direction, badge: '常见睡姿', aliases: direction + '侧卧 睡觉 睡姿 床垫 枕头',
      brief: '让枕头填好头肩间的空隙，不让手臂代替枕头。', principle: '有支撑、能放松，比一定睡哪一边更重要。',
      benefits: ['头枕与膝间支撑可帮助寻找舒适的排列。', right ? '喜欢右侧卧的人可以以此作为调整枕头和手臂的位置起点。' : '夜间反流人群中的研究提示，左侧卧可能有利；具体仍需结合个人情况。'],
      cautions: ['下侧肩臂受压不舒服时，应换边或重新调整，而不是强忍。', '持续打鼾伴憋醒、明显日间嗜睡或疼痛，需要专业评估。'],
      steps: [S('整理好支撑物', '准备合适头枕及可选膝间枕，移走不稳定物品；选择自己能安全上、下床的位置。', 'environment'), S('转为' + direction + '侧卧', '在舒适范围内转向' + direction + '侧，让肩和骨盆大致朝向同一边，不把上半身与下半身拧向相反方向。', 'torso'), S('让头靠枕，不靠手', '把枕头移到头颈下方，试调受压后的高度，让头不过度向床面垂下或被顶起。屏幕中的枕高是示意参数。', 'head'), S('放好下侧' + lower + '手', '把' + lower + '上臂稍放到身体前方，肘部自然弯曲，手掌轻放在枕前或身前；不要把整只手臂压在头下。', right ? 'rightArm' : 'leftArm'), S('放好上侧' + upper + '手', '把' + upper + '手轻放在身前、抱枕上或大腿侧，选择肩膀不被向前拉扯的位置。', right ? 'leftArm' : 'rightArm'), S('腿稍弯，恢复自然呼吸', '双腿舒适地微屈，需要时在膝间加枕，不强行并紧。放松下巴，正常呼吸，夜间可以自然翻身。', 'legs')],
      checkpoints: ['头是否被枕头顶歪或垂下？', '下侧手臂是否被压麻？', '肩膀和骨盆是否舒服？'], sources: ['mayoSleep', 'mattressTrial'].concat(right ? [] : ['refluxStudy']), evidence: '一般指导'
    }, extra || {});
  }
  postures.push(side('left', '左侧卧', '左'));
  postures.push(side('right', '右侧卧', '右'));
  postures.push({
    id: 'supine', name: '仰卧 · 膝下支撑', en: 'BACK / SLEEP', category: 'lie', scene: 'sleep', badge: '常见睡姿', aliases: '仰卧 平躺 朝上 睡觉 床垫', brief: '把头颈接住，需要时给膝下加一点支撑。', principle: '平躺不是把腰硬压平，也不是让下巴顶向胸口。',
    benefits: ['可以尝试膝下放枕，寻找腰背更轻松的位置。', '双手可放身侧，不必承受身体重量。'], cautions: ['有阻塞性睡眠呼吸暂停的人，仰卧可能不合适；遵循个人治疗建议。', '枕头过高可能让颈部持续前屈；不能从身高直接算出最优枕高。'],
    steps: [S('先准备枕头', '准备头枕及可选膝下枕；床垫不是越硬越好，应实际观察舒适度。', 'environment'), S('舒服地躺下', '用自己熟悉且安全的方式躺好；术后或起卧困难时按专业人员指导操作，模型不教授移乘。', 'torso'), S('托住头颈', '头放到枕上，试调高度，让颈部舒服、不明显低头。不要强行把腰压到床面。', 'head'), S('安放左手、右手', '双手分别轻放身旁或腹部附近，肩膀自然放松，不要求固定手印，也不用力压腹。', 'arms'), S('按需支撑膝下', '在膝下放一个舒适的枕头，让双腿自然放松；不舒服就撤掉或换姿势。', 'legs'), S('自然呼吸与翻身', '不控制睡着后的呼吸，也不要求整晚保持仰卧。若反复憋醒或有呼吸暂停，请就医。', 'all')], checkpoints: ['下巴是否被枕头推向胸口？', '膝下支撑是否舒服？', '是否有打鼾伴憋醒？'], sources: ['mayoSleep', 'mayoApnea', 'mattressTrial'], evidence: '一般指导'
  });
  postures.push({
    id: 'prone', name: '俯卧 · 注意颈腰', en: 'STOMACH / SLEEP', category: 'lie', scene: 'sleep', badge: '注意适配', aliases: '趴着睡 俯卧 趴睡 朝下', brief: '收录常见姿势，不意味着推荐你去适应它。', principle: '睡得习惯与身体舒服，不一定是同一回事。',
    benefits: ['帮助识别自己实际采用的姿势，便于记录醒来后的感受。', '提供调整支撑的讨论起点，而不是要求从侧卧改为俯卧。'], cautions: ['俯卧常需将头转向一侧，可能增加颈部与腰背不适。', '本项目不主动推荐俯卧，更不能把它当作呼吸疾病的治疗方法。'],
    steps: [S('先考虑替代姿势', '先看看侧卧或仰卧是否更舒服。不需要为了学习条目而刻意俯卧。', 'all'), S('仅观察习惯姿势', '已经习惯俯卧时，在清醒、能随时调整的情况下观察支撑；保证口鼻不被床品遮住。', 'head'), S('试调头部支撑', '避免厚枕把颈部进一步顶起；不把脸直接埋进枕头，颈部不舒服就换姿势。', 'head'), S('手臂不要压在头下', '左右手臂自然放在身旁或舒适的位置，不用手臂承受头部重量，不追求对称。', 'arms'), S('观察腹部与骨盆支撑', '必要时可尝试在下腹与髋部下放薄支撑，观察是否舒服；如果更不舒服，撤掉并调整姿势。', 'torso'), S('出现不适就换姿势', '自然呼吸。醒后反复颈腰痛，或呼吸不畅，应寻求专业建议，不靠调参数硬撑。', 'all')], checkpoints: ['口鼻是否完全通畅？', '颈部是否被扭得不舒服？', '侧卧是否更舒适？'], sources: ['mayoSleep'], evidence: '了解为主 / 非主动推荐'
  });
  postures.push(side('fetal', '蜷曲侧卧 · 放松版', '左', { en: 'CURLED SIDE / SLEEP', badge: '常见变式', aliases: '胎儿式 蜷缩 蜷曲 婴儿式 睡姿', brief: '可以微微蜷曲，不必把自己紧紧抱成一团。', principle: '留出舒适呼吸和翻身的空间。', cautions: ['不把膝盖用力拉向胸口，也不强行低头缩颈。', '不要求整夜固定蜷曲；出现肩、髋或膝部压迫就调整。'], evidence: '一般原则改编' }));
  postures.push(side('auspicious', '吉祥卧 · 唐僧睡', '右', {
    en: 'RIGHT SIDE / TRADITION', badge: '舒适改良版', aliases: '唐僧睡 吉祥卧 吉祥睡 狮子卧 佛 道 睡功 右侧',
    brief: '保留右侧微屈的形态，让枕头而不是手臂承头。', principle: '尊重传统，也把文化说法与医学证据分开。',
    benefits: ['帮助理解传统吉祥卧的右侧微屈形态。', '改用头枕承头，可以避免刻意用手掌或手臂托住头部。'], cautions: ['“唐僧睡”不是统一医学术语，也没有“包治失眠、必然秒睡”的可靠保证。', '传统动作存在不同说法；此处是本项目舒适改良版，不复制按穴、压耳或强制舌位。'],
    steps: [S('先准备枕头', '放好能够舒适承托头颈的枕头。此版本让枕头承重，不模仿影视里用手掌撑头。', 'environment'), S('轻轻转向右侧', '右侧身体朝床面，肩与骨盆大致同向。上半身保持舒适，不强行弯成固定弧度。', 'torso'), S('头落到枕上', '让头颈靠枕支撑，调整受压后的枕高，不要为了摆出造型使颈部侧折。', 'head'), S('右手轻放枕前', '右上臂略向身体前方，右肘自然弯曲；右手轻放在枕前、脸前的舒适位置，不塞到头下，不按压耳部。', 'rightArm'), S('左手轻放大腿侧', '左手自然放在左大腿侧，或者放身前的抱枕上；肩膀不前拉，手掌不用力压腿。', 'leftArm'), S('双腿微屈，松开要求', '双腿轻轻弯曲，需要时加膝间枕。下巴放松，正常呼吸；不屏息、不强制舌顶上腭，不要求整夜不翻身。', 'legs')],
    checkpoints: ['头部是不是由枕头承重？', '右手臂有没有受压？', '有没有为了“标准”而硬撑？'], sources: ['lingyin', 'mayoSleep', 'nhsBreath'], evidence: '传统形态 + 舒适改良'
  }));
  const categories = [{id:'all',name:'全部姿势',short:'全'}, {id:'walk',name:'行 · 行走',short:'行'}, {id:'stand',name:'住 · 站立',short:'住'}, {id:'sit',name:'坐 · 落座',short:'坐'}, {id:'lie',name:'卧 · 睡眠',short:'卧'}];
  return { version: 1, reviewed: '2026-10-16', sources, postures, categories };
});
