/* Stack o' Lantern: sound.js

   Every sound in the game, and the speaker switch that turns them off.

   The sounds are MADE IN CODE with the Web Audio API: short tones and
   bursts of noise, shaped by hand. No sound files to load, nothing to
   wait for. The game script (stack-o-lantern.js) only says WHICH sound,
   by name: playSound("perfect"). What that sounds like is decided here,
   in the SOUNDS table, so changing a sound touches this file only. One
   day a name may play a recorded voice from an MP3 instead (John,
   2026-10-17: a voice for each new height); the game script would not
   change for that either.

   JOHN'S RULE (2026-10-17): a sound starts at full strength the instant
   its event happens and fades from there. Nothing swells in. So every
   tone below is scheduled at the audio clock's "now", its volume set in
   a one-millisecond jump (a true zero-time jump clicks) and a fade
   written after it. The game calls playSound in the same frame as the
   landing, which is the frame of the tap (the slab does not fall).

   Loaded before stack-o-lantern.js, so the names here exist when the
   game script runs. */

"use strict";

/* ------------------------------------------------------------------------
   1. The speaker switch
   --------------------------------------------------------------------- */

// The speaker in the stage's top left corner (John, 2026-10-17: "a simple
// sound on/off switch ... mirroring the high score"). On by default. The
// choice is remembered on the device under the game's own key, so the
// app's Clear scores button leaves it alone.
const SOUND_KEY = "stack-o-lantern-sound";
const soundButton = document.getElementById("soundButton");

const sound = {
  enabled: true,
  context: null,     // the Web Audio context, made the first time a sound is wanted
  noise: null,       // half a second of white noise, made once, reused by every burst
};

/** Read the remembered choice. Anything but "off" (including no note at
    all, or a browser that refuses to remember) means on. */
function loadSoundSetting() {
  try {
    if (localStorage.getItem(SOUND_KEY) === "off") sound.enabled = false;
  } catch (error) {
    // Private browsing can throw here. Staying on is fine.
  }
}

function saveSoundSetting() {
  try {
    localStorage.setItem(SOUND_KEY, sound.enabled ? "on" : "off");
  } catch (error) {
    // Nothing to do: the switch still works for this visit.
  }
}

/** Make the button match sound.enabled: the CSS draws the slash when
    aria-pressed is "false", and screen readers read the label. */
function showSoundSwitch() {
  soundButton.setAttribute("aria-pressed", String(sound.enabled));
  soundButton.setAttribute("aria-label",
    sound.enabled ? "Sound on: tap to mute" : "Sound off: tap to turn on");
}

function toggleSound() {
  sound.enabled = !sound.enabled;
  saveSoundSetting();
  showSoundSwitch();
  if (sound.enabled) playSound("start");     // the same ding as a round's start: proof of life
}

/** The Web Audio context, made the first time a sound is wanted. Phones
    only let a page make sound after the player has tapped something, so
    the first call always comes from inside a tap handler (the speaker,
    or the stage); a context the phone has put to sleep is woken here. */
function audioContext() {
  if (!sound.context) {
    sound.context = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (sound.context.state === "suspended") sound.context.resume();
  return sound.context;
}

// A tap on the speaker must not reach the stage's tap handler, which
// would start a round or drop a pumpkin. pointerdown is what the stage
// listens for, so it is stopped here; the click still toggles.
soundButton.addEventListener("pointerdown", (event) => event.stopPropagation());
soundButton.addEventListener("click", toggleSound);
loadSoundSetting();
showSoundSwitch();

// Safari on the iPhone does not count a finger touching down as the tap
// that may start audio; it counts the finger lifting. The game acts on
// the touch-down (no delay), so a sound asked for then sits queued in a
// sleeping clock until something wakes it: without this, the start ding
// came out at the first wall tick (John, 2026-10-17). So every lift wakes
// the clock too, and the queued sound plays a blink after the tap.
document.addEventListener("pointerup", () => {
  if (sound.context && sound.context.state === "suspended") sound.context.resume();
});

/* ------------------------------------------------------------------------
   2. Two building blocks: a tone and a burst of noise

   Both take a `delay` in seconds for the second note of a two-note
   sound; the first note of every sound has none. Volumes are 0 to 1.
   Lengths are in seconds.
   --------------------------------------------------------------------- */

/** One tone that starts at full volume and dies away over `length`.
    `wave` is the oscillator's shape: "sine" is pure (a chime), "triangle"
    has a little edge (a wooden knock). `from` is the pitch in hertz; a
    `to` makes the pitch slide there over the length (a falling thud). */
function tone(context, { wave = "sine", from, to = null, volume, length, delay = 0 }) {
  const now = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = wave;
  oscillator.frequency.setValueAtTime(from, now);
  if (to) oscillator.frequency.exponentialRampToValueAtTime(to, now + length);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.001);          // the instant start
  gain.gain.exponentialRampToValueAtTime(0.0001, now + length);    // the fade
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + length + 0.02);
}

/** A burst of noise that starts at full volume and dies away: the
    scratch of a pumpkin on dirt, the crack of a miss. `cutoff` is a
    low-pass filter in hertz: lower = duller, higher = brighter. */
function noiseBurst(context, { volume, length, cutoff, delay = 0 }) {
  const now = context.currentTime + delay;
  if (!sound.noise) {
    // Half a second of random samples between -1 and 1: white noise.
    const frames = Math.floor(context.sampleRate * 0.5);
    sound.noise = context.createBuffer(1, frames, context.sampleRate);
    const samples = sound.noise.getChannelData(0);
    for (let i = 0; i < frames; i += 1) samples[i] = Math.random() * 2 - 1;
  }
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = sound.noise;
  filter.type = "lowpass";
  filter.frequency.value = cutoff;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + length);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  source.start(now);
  source.stop(now + length + 0.02);
}

/* ------------------------------------------------------------------------
   3. The sounds, by name

   Each entry is a function that schedules its tones on the context. To
   change a sound, change its numbers here; to add one, add a line and
   call playSound with its name from the game script. John's first set
   (2026-10-17): a light tick off the walls; a bright tink for a perfect
   landing (two of them for a WIDER); a duller tink for a near miss
   ("nice", "close one"); a thunk for a poor one ("yikes", "oof"); and
   a crack and thud for the miss that ends the round. Then the end
   screen's three fanfares (2026-10-17, later that day), one per tier.
   --------------------------------------------------------------------- */

const SOUNDS = {
  // The slab touching a wall. Fires often late in a round, so it is the
  // quietest and shortest sound in the game: a 25 ms blip.
  tick: (context) => {
    tone(context, { from: 1500, volume: 0.08, length: 0.025 });
  },

  // PERFECT: a bright tink. A high pure note with a fainter, brighter
  // partial an octave up that dies first, which is what makes it ring.
  perfect: (context) => {
    tone(context, { from: 1320, volume: 0.30, length: 0.18 });
    tone(context, { from: 2640, volume: 0.10, length: 0.08 });
  },

  // WIDER: the perfect tink, then a higher one right behind it.
  wider: (context) => {
    tone(context, { from: 1320, volume: 0.30, length: 0.15 });
    tone(context, { from: 1760, volume: 0.30, length: 0.25, delay: 0.09 });
  },

  // A near miss ("nice", "close one"): the same idea, lower and softer,
  // with the triangle wave's wooden edge. The duller tink.
  soft: (context) => {
    tone(context, { wave: "triangle", from: 660, volume: 0.25, length: 0.14 });
  },

  // A poor landing ("yikes", "oof"): a low note that falls in pitch, with
  // a short scrape of dull noise over it. The thunk.
  thunk: (context) => {
    tone(context, { from: 160, to: 70, volume: 0.50, length: 0.25 });
    noiseBurst(context, { volume: 0.25, length: 0.08, cutoff: 900 });
  },

  // The round starting: one bright "go" ding on the tap that starts it
  // (John, 2026-10-17). It is also what wakes the phone's audio clock,
  // inside a real tap, before any landing needs it. A little lower than
  // Scarecrow's arpeggio so it does not read as a milestone.
  start: (context) => {
    tone(context, { from: 523, volume: 0.30, length: 0.30 });        // the C above middle C
    tone(context, { from: 1046, volume: 0.10, length: 0.15 });       // its octave, for brightness
  },

  // A milestone: a fast rising three-note arpeggio, a major chord played
  // one note at a time, root, third, fifth, seventy milliseconds apart,
  // the last note ringing on (John, 2026-10-17: "a more celebratory 3
  // pitch fast arpeggio"; a single ding before that, a da-ding before
  // that). Only the HEIGHT milestones ring (the table's `sound`), so the
  // chord climbs with the tower. `pitch` is the entry's note from the
  // MILESTONES table, in semitones above the base; each semitone
  // multiplies the frequency by the twelfth root of two. It waits a tenth
  // of a second so the landing's tink, in the same frame, is heard first.
  milestone: (context, pitch = 0) => {
    const root = 659 * 2 ** (pitch / 12);      // 659 Hz is the E above the treble staff
    const third = root * 1.26;                 // a major third up (the 4th semitone)
    const fifth = root * 1.5;                  // a fifth up (the 7th semitone)
    tone(context, { from: root,  volume: 0.30, length: 0.12, delay: 0.10 });
    tone(context, { from: third, volume: 0.30, length: 0.12, delay: 0.17 });
    tone(context, { from: fifth, volume: 0.35, length: 0.40, delay: 0.24 });
    tone(context, { from: fifth * 2, volume: 0.10, length: 0.15, delay: 0.24 });   // a bright edge on the last note
  },

  // A BIG rung (50, 100, 200; John, 2026-10-18: "like the height sound,
  // but maybe a bit longer and louder"): the same climbing chord at the
  // rung's pitch, a touch louder, then the octave on top held for most
  // of a second with the chord ringing under it. About 1.1 s in all,
  // against the ordinary rung's 0.65 s. The fireworks pop beside it.
  bigMilestone: (context, pitch = 0) => {
    const root = 659 * 2 ** (pitch / 12);
    const third = root * 1.26;
    const fifth = root * 1.5;
    const octave = root * 2;
    tone(context, { from: root,   volume: 0.38, length: 0.12, delay: 0.10 });
    tone(context, { from: third,  volume: 0.38, length: 0.12, delay: 0.17 });
    tone(context, { from: fifth,  volume: 0.40, length: 0.14, delay: 0.24 });
    tone(context, { from: octave, volume: 0.42, length: 0.85, delay: 0.33 });   // the held top note
    tone(context, { wave: "triangle", from: octave, volume: 0.10, length: 0.60, delay: 0.33 });
    tone(context, { from: fifth,  volume: 0.18, length: 0.85, delay: 0.33 });   // the chord under it
    tone(context, { from: root,   volume: 0.14, length: 0.85, delay: 0.33 });
    tone(context, { from: octave * 2, volume: 0.08, length: 0.30, delay: 0.33 });   // a shimmer on top
  },

  // TIMBER: the classic two falling notes, "dee-dup" (John, 2026-10-17;
  // the first try, a crack and a thud, "does not register well"). The
  // first note sits below the duller tink, the second an octave below
  // that, hard on its heels and longer, drooping a little as it fades.
  miss: (context) => {
    tone(context, { wave: "triangle", from: 440, volume: 0.40, length: 0.16 });
    tone(context, { wave: "triangle", from: 220, to: 185, volume: 0.40, length: 0.45, delay: 0.13 });
  },

  // A FIREWORK bursting on the end screen: a short bright crack of noise
  // with a low thump under it, then three faint crackles as the sparks
  // spread. Played by the game at the moment the rocket bursts.
  pop: (context) => {
    noiseBurst(context, { volume: 0.30, length: 0.07, cutoff: 2500 });
    tone(context, { from: 500, to: 120, volume: 0.25, length: 0.08 });
    for (const at of [0.10, 0.17, 0.26]) {
      noiseBurst(context, { volume: 0.10, length: 0.02, cutoff: 5000, delay: at });
    }
  },

  // THE END SCREEN'S FANFARES. The game picks one by the round's tier
  // (stack-o-lantern.js, endTier) when the end screen appears, after the
  // miss has had its say. Each is longer than the last and ends on a held
  // note, which is what makes a fanfare feel like an ending rather than a
  // milestone (those are short and climb away).

  // "Good job", every round of 5 pumpkins or more that made no list: a
  // warm two-note "ta-daa", a short note then a held one a fifth up, with
  // a faint octave on the held note.
  fanfareGood: (context) => {
    tone(context, { from: 392, volume: 0.30, length: 0.15 });                   // G
    tone(context, { from: 587, volume: 0.32, length: 0.90, delay: 0.18 });      // D, held
    tone(context, { from: 1174, volume: 0.08, length: 0.60, delay: 0.18 });     // its octave, faint
  },

  // A top-five score: four notes, "ta-da-da-DAA", climbing a major chord
  // to the octave, the last note held with the fifth under it. The
  // triangle doubling gives the melody a brassier edge than the sine
  // chimes of the landings.
  fanfareTopFive: (context) => {
    const notes = [[523, 0.00], [659, 0.15], [784, 0.30]];                     // C E G
    for (const [pitch, at] of notes) {
      tone(context, { from: pitch, volume: 0.28, length: 0.14, delay: at });
      tone(context, { wave: "triangle", from: pitch, volume: 0.08, length: 0.14, delay: at });
    }
    tone(context, { from: 1046, volume: 0.32, length: 1.10, delay: 0.45 });     // C, held
    tone(context, { wave: "triangle", from: 1046, volume: 0.08, length: 0.80, delay: 0.45 });
    tone(context, { from: 784, volume: 0.16, length: 1.10, delay: 0.45 });      // the G under it
  },

  // A NEW HIGH SCORE: the full fanfare (John, 2026-10-17: "three sets
  // of climbing arpeggios, da da da ding, da da da ding, da da da ding
  // ding ding!"). Each set is three quick notes up a major chord and a
  // ding on the octave; each set starts a step higher and a little
  // louder than the last; the third set ends on three dings, the last
  // one long, with the chord under it and a shimmer on top (two
  // oscillators a few hertz apart beat against each other, which the ear
  // hears as a sparkle).
  fanfareBest: (context) => {
    const brass = (pitch, at, length, volume) => {
      tone(context, { from: pitch, volume: volume, length: length, delay: at });
      tone(context, { wave: "triangle", from: pitch, volume: volume * 0.3, length: length, delay: at });
    };
    const semitones = (root, n) => root * 2 ** (n / 12);
    // One set: root, third, fifth, then the ding on the octave.
    const set = (root, at, volume) => {
      brass(root, at, 0.10, volume);                            // da
      brass(semitones(root, 4), at + 0.11, 0.10, volume);       // da
      brass(semitones(root, 7), at + 0.22, 0.10, volume);       // da
      brass(root * 2, at + 0.33, 0.30, volume + 0.04);          // DING
    };
    set(523, 0.00, 0.24);      // in C
    set(587, 0.62, 0.27);      // in D
    set(659, 1.24, 0.30);      // in E, and then its ding comes three times:
    brass(1318, 1.76, 0.30, 0.34);                              // ding
    brass(1318, 1.96, 1.80, 0.36);                              // DING, the long last note...
    tone(context, { from: 659,  volume: 0.14, length: 1.80, delay: 1.96 });   // ...with E
    tone(context, { from: 830,  volume: 0.14, length: 1.80, delay: 1.96 });   // ...G sharp
    tone(context, { from: 988,  volume: 0.14, length: 1.80, delay: 1.96 });   // ...and B under it
    tone(context, { from: 2637, volume: 0.06, length: 1.40, delay: 1.96 });   // the shimmer: an octave up...
    tone(context, { from: 2643, volume: 0.06, length: 1.40, delay: 1.96 });   // ...and 6 Hz off it
  },
};

/** Play a sound by name, now. `detail` is passed on to the sound (the
    milestone's pitch); most sounds take none. Does nothing when the
    switch is off or the name is unknown (a typo in the game script logs
    a warning instead of stopping the game). */
function playSound(name, detail) {
  if (!sound.enabled) return;
  const play = SOUNDS[name];
  if (!play) { console.warn("sound.js: no sound called " + name); return; }
  play(audioContext(), detail);
}
