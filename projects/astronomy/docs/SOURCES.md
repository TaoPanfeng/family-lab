# 可核查来源

检索与确认日期：2026-10-16。项目运行不调用这些网页；它们用于来源说明、许可证确认和离线结果检查。

## 实际使用

**Three.js r140**：浏览器三维引擎，MIT。
<https://github.com/mrdoob/three.js/tree/r140>
<https://github.com/mrdoob/three.js/blob/r140/LICENSE>

**Swiss Ephemeris / Moshier**：生成日月视地心 EQD 数值的来源。显式选择 Moshier，不使用 Swiss/JPL 表；注意官方说明中这几种星历是不同选择，不能混用它们的精度声明。
<https://www.astro.com/swisseph/swephinfo_e.htm>
<https://github.com/aloistr/swisseph>
<https://github.com/astrorigin/pyswisseph>

**Natural Earth**：公共领域地形几何，仅用于示意纹理。
<https://www.naturalearthdata.com/about/terms-of-use/>

## 独立食甚对照

Eclipse Predictions by Fred Espenak, NASA's GSFC。

- 2009-07-22：<https://eclipse.gsfc.nasa.gov/SEbeselm/SEbeselm2001/SE2009Jul22Tbeselm.html>
- 2023-10-14：<https://eclipse.gsfc.nasa.gov/SEbeselm/SEbeselm2001/SE2023Oct14Abeselm.html>
- 2024-04-08：<https://eclipse.gsfc.nasa.gov/SEbeselm/SEbeselm2001/SE2024Apr08Tbeselm.html>
- 2025-03-14 / 2025-09-07 月食：<https://eclipse.gsfc.nasa.gov/LEcat5/LE2001-2100.html>

NASA 太阳食页面明确列出 UT 与 TDT；月食目录的主列是 TD，需要减去该列的 ΔT。不能直接把 06:59:56 TD 当成 06:59:56 UTC。原始模型、ΔT 约定和参考来源保存在 `tests/nasa-reference.json`。

## 前期研究但没有成为运行依赖的项目

Astronomy Engine、Spacekit、Stellarium Web Engine、Celestia 用于最初技术分析。**当前成品不包含这些库的代码，也不声称运行了 Astronomy Engine。** 最终为了完整离线交付采用独立的星历求值与交互层。开源许可证以实际随包内容为准。

## V2 交互与解释参考（2026-10-16 核对）

NASA 月相：<https://science.nasa.gov/moon/moon-phases/>

NASA 月球常见问题：<https://science.nasa.gov/moon/top-moon-questions/>

NASA 食现象：<https://science.nasa.gov/moon/eclipses/>

MDN localStorage（尤其 file: URL 的行为边界）：<https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage>

W3C 增强型触控目标尺寸：<https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html>

Three.js 官方手册：<https://threejs.org/manual/>

上述网页是说明与设计参考，不是运行依赖。本次继续使用随包 r140，不把最新文档的所有 API 假定成旧版 API。44 CSS 像素用于主要儿童流程控件的设计目标，不代表已经完成全站 WCAG 一致性认证。
