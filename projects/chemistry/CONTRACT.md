# 化学探索馆 — module contract

Buildless static, Chinese, no external dependencies. Deliver dist/index.html load order: data.js, core.js, lab.js, explore.js, app.js. Scripts use IIFEs and globals; work with file:// and HTTP. Node tests may load scripts with require.

## Visual system
Cream canvas #f7f8f4, white cards, dark evergreen text #183a32, muted text #6c8079, primary teal #087f6a, accent lime #d9f286, orange #e9a568. Rounded 16–24px, thin borders #e2e8df. Friendly scientific workshop, precise custom SVGs. Desktop sidebar root owned, content max 1440px, mobile stacks.

Root owns app.js, styles.css, index.html, quiz/stoich/notebook/source routes. Agents own only assigned files.

## Shared globals
window.ChemData = { elements, reactions, isotopes, sources, ... }; core agent defines exact fields and informs others.
window.ChemCore = pure calculation/validation functions, CommonJS export optional.
window.ChemLab = { mount(container, ctx), experiments, ...pure state helpers }.
window.ChemExplore = { mount(route, container, ctx) }; routes: periodic, atom, decay, separation, ions, life.

ctx: { mode:'kids'|'advanced', navigate(route, params?), complete(id,title,details?), toast(message), icon(name, size=20), saveNote({title,body,...}), getProgress(), escape(value) }. mount may return cleanup function to cancel animations/listeners. Do not access ChemApp internal state. Shared classes: .panel .panel-head .eyebrow .muted .btn .btn.primary .btn.secondary .btn.small .chip .section-title .field .input .select .range .grid-2 .grid-3 .stat .note .empty-state .advanced-only .kids-only. Root owns these. Each agent scopes own CSS (lab.css, explore.css).

Scientific requirements: display model limits, not exact orbital paths; atomic weight != isotope mass number; all chemical equations atom balanced; no made-up result for unsupported mixes; fixed temperature/pressure for gas volume. Hazardous virtual demonstrations do not become real-world procedures. No White P material acquisition or ignition temperatures / doses. Public educational app stores progress locally, no backend/accounts/tracking.
