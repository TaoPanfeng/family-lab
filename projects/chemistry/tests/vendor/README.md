# DOM test dependency

LinkeDOM v0.18.12 worker build, unmodified upstream source:

- https://github.com/WebReflection/linkedom/blob/v0.18.12/worker.js
- https://github.com/WebReflection/linkedom/blob/v0.18.12/LICENSE

Retrieved via the read-only GitHub connector on 2026-10-19. See LINKEDOM-LICENSE (ISC).

Used only by local automated DOM event tests. Not shipped to the website and not needed to use the offline HTML. It does not implement a rendering engine and cannot verify browser layout, GPU rendering, or physical touch gestures. It is bundled so tests require no npm install or network access.
