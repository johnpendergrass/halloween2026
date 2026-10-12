# Verification — October 11, 2026 appearance/pile checkpoint

Publishing title: Update candy artwork, persistent piles and transfer visuals. Previous gameplay publish: 1d7a777, Overall gameplay ok, need to work on appearances. Cache stamp: 2026-1011-candy-piles in APP_VERSION and both root resource references.

Current game remains three-candy sets. Rules/AI were not changed by this appearance work. Runtime JSON and generated file-opening companion remain synchronized.

Passed for the current checkpoint:

- JavaScript syntax, Git whitespace and catalog naming/normalization validation.
- Engine legality, one-copy requests, finishing rules, privacy/card conservation, and 1,000 simulated games each with triples/quadruples.
- Quote regression: both actors' Yes/No, four-second automatic transfers and middle shortcuts, immediate matching-grid shortcuts, retained questions/dialog pause, reply styling, stationary quote fades, no source bounce, independent 1400ms travel and destination scaling.
- Go Fish reply regression: each middle target for both players, exactly one draw, retained text, Rules locking, breathing onset/peak and reduced-motion behavior.
- Full UI round, alternate names, phone 338x526 and desktop 547x850 layout/targets, Rules, sets/results/replay, and direct file opening.
- Shell registry/icon/menu, embedded layout and game-owned controls.
- verify-piles.cjs: both public request directions, actual player-draw artwork, generic Wendy private draw with correct landing scale, source/destination counts, and stable survivors after set removal.
- Targeted player draw test: flown image matches the actual drawn candy, not a generic wrapper. Automatic approval retry succeeded after the earlier usage-limit review failure.
- Live pile checks: initial counts, stable arrangement after Rules, successful request removal, Wendy incoming size/retained color/rotation, departure snapshot/landing width and removal of set cards without rearranging survivors.

Old quote/Go Fish fixtures omitted card IDs; they now assign unique IDs to match real engine cards. Quote flight checks accept the generic wrapper class and assert Wendy's smaller landing scale where applicable. No production rules changed for tests.

Development screenshots were refreshed by the browser/shell suites. Historical artwork studies and rollback directories remain in the repository. Actual iPhone Safari compositor behavior, subjective pile density and pacing still require device/user review. Delayed-timer stress aliases were not rerun for this checkpoint. Sound and Good Fish remain unimplemented.
