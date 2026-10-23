/* Continuous, seekable process state; timings are pedagogic, not biological durations. */
(function (root) {
  'use strict';
  const C = root.WorldCore || (typeof require === 'function' ? require('../../shared/core.js') : null);
  const ease = (t, a, b) => C.smooth(C.clamp((t - a) / (b - a), 0, 1));
  const mix = C.mix;
  const mitosisPhases = [
    [0, '复制准备', 'DNA 在分裂前复制。染色体仍为 4 条，但每条逐渐有了两份姐妹染色单体。'],
    [.18, '凝缩与连接', '染色体凝缩，核膜解体。两侧纺锤丝逐渐连接到姐妹染色单体。'],
    [.36, '排在中央', '四条复制过的染色体移到细胞中央；每个 X 的两半是一对姐妹。'],
    [.50, '姐妹分开', '姐妹染色单体向相反两极移动。分开之后，每一半才单独计为一条染色体。'],
    [.74, '重新包好', '两端分别形成细胞核；细胞膜逐渐向中间收拢。'],
    [.98, '成为两个细胞', '胞质分裂完成：每个子细胞各有 4 条染色体，保留原来的两套。']
  ];
  const meiosisPhases = [
    [0, '只复制一次', 'DNA 先复制；之后要连续分裂两次，中间不再复制。'],
    [.16, '同源配对', '同一对中的蓝色和粉色来自两个亲本。配对不等于姐妹染色单体。本例是一种分配方案，父母来源不必各去一侧。'],
    [.34, '同源排队', '两对同源染色体在中央排列。本简图省略交换，只追踪分离。'],
    [.46, '先分同源', '第一次分裂：同源染色体分开，姐妹仍连在一起。'],
    [.69, '两个细胞', '每个细胞只剩一套，但每条染色体仍含两条姐妹染色单体。'],
    [.74, '再分姐妹', '第二次分裂：姐妹分离。观察每个小细胞内部同时发生的过程。'],
    [.98, '四个单倍体', '完成后每个细胞有 2 条染色体。这里表示四个减数分裂产物，不模拟配子大小差异。']
  ];
  function state(mode, input) {
    if (!Number.isFinite(input)) throw Error('Invalid division time');
    if (!['mitosis', 'meiosis'].includes(mode)) throw Error('Unknown division mode');
    const t = C.clamp(input, 0, 1), mei = mode === 'meiosis';
    const phases = mei ? meiosisPhases : mitosisPhases;
    let phase = 0; phases.forEach((p, i) => { if (t >= p[0]) phase = i; });
    const duplication = ease(t, .01, .16), align = ease(t, mei ? .16 : .25, mei ? .38 : .48);
    const separate = ease(t, mei ? .46 : .50, mei ? .64 : .74);
    const second = mei ? ease(t, .76, .94) : 0;
    const chromosomes = [];
    for (let i = 0; i < 4; i++) {
      const pair = Math.floor(i / 2), parent = i % 2, color = parent ? '#f6a4bb' : '#80c6ff';
      const startX = [-76, 65, -58, 68][i], startY = [-67, -50, 60, 68][i];
      const y = mix(startY, mei ? (pair ? 47 : -47) : (i - 1.5) * 70, align);
      if (!mei) {
        for (const side of [-1, 1]) chromosomes.push({
          id: `p${pair}-${parent}-${side}`, x: mix(startX, 0, align) + side * (6 * duplication + 161 * separate) + (parent ? 25 : -25) * separate,
          y: mix(y, pair ? 49 : -49, separate), length: pair ? 23 : 34, color,
          visible: side === -1 ? 1 : duplication, side, joined: 1 - separate,
          parent, pair, daughter: separate > .99 ? (side === -1 ? 0 : 1) : null
        });
      } else {
        const side = (parent ^ pair) ? 1 : -1, x = mix(startX, side * 13, align);
        for (const sister of [-1, 1]) chromosomes.push({
          id: `p${pair}-${parent}-${sister}`, x: mix(x, side * 176 + (pair ? 28 : -28), separate) + sister * 5 * duplication * (1 - second),
          y: mix(y, sister * 112 + (pair ? 22 : -22), second), length: pair ? 22 : 31,
          color, visible: sister === -1 ? 1 : duplication, side: sister, joined: 1 - second,
          parent, pair, poleSide: side, daughter: second > .99 ? (side === -1 ? 0 : 1) * 2 + (sister === -1 ? 0 : 1) : null
        });
      }
    }
    return { mode, t, phase, phases, duplication, align, separate, second, chromosomes,
      pinch: ease(t, mei ? .56 : .76, mei ? .68 : .97),
      envelope: 1 - ease(t, .17, .32), envelopeNew: ease(t, mei ? .94 : .76, mei ? 1 : .91),
      cells: mei ? (t >= .98 ? 4 : t >= .69 ? 2 : 1) : t >= .98 ? 2 : 1,
      totalDNA: 4 * (1 + duplication), finalPerCell: t >= .98 ? (mei ? 2 : 4) : null
    };
  }
  function breathing(rate, depth, t) {
    if (!Number.isFinite(t) || !Number.isFinite(rate) || rate <= 0 || !Number.isFinite(depth)) throw Error('Invalid respiratory parameters');
    const seconds = C.clamp(t, 0, 1) * 18, phase = seconds * rate / 60 * 2 * Math.PI;
    return { seconds, phase, expansion: (1 - Math.cos(phase)) / 2 * C.clamp(depth / 100, 0, 1), inhaling: Math.sin(phase) >= 0 };
  }
  const api = { state, breathing, ease, mitosisPhases, meiosisPhases };
  root.BioProcess = api; if (typeof module !== 'undefined') module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
