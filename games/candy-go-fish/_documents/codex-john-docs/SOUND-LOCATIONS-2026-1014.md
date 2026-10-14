# Sound folder migration — October 14, 2026

Historical migration step: subsequent preload, music, speaker controls, set sounds and winner UI are in [the current handoff](CURRENT-STATE-2026-1014.md).

This update supersedes the October 13 handoff's sound paths, 18-clip count and unimplemented starter announcements. Other gameplay, volume, replay, spinner timing and pending work remain as documented there.

See [the sound folder guide](../../assets/sounds/README.md) for current paths. The three paired selector cues and confirmText now live directly in assets/sounds. Six starter recordings live in speech/goes-first; 36 victory recordings live in speech/victory. The generated victory catalog preserves the supplied filenames and covers every supported winner/loser and margin category.

The spinner announces the chosen character once when it lands and presents the goes-first message. Clicking to deal plays confirmText and stops remaining UI speech. Rotation is still silent. Victory announcement timing, replay and cancellation are unchanged. No preload, music, visible sound controls or new UI effects are added.

Validation passed: current asset references, victory selection/BIGWIN boundary/tie and missing-combination silence/cancellation, and all 46 paths plus MP3 decoding in Chrome. Direct file opening exercised welcome, spinner announcement, deal and mute. The file-open decoder test reads bytes through Node because browser XHR cannot read file URLs.

Cache stamp: 2026-1014-candy-sound-paths. No commit, push or deployment performed.
