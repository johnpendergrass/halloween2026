# Pumpkin-field background experiment

**Rejected and reverted:** John requested restoration of the green background. The artwork is unused; the pre-experiment CSS is active again.

Created October 11, 2026 with the built-in image generation tool, using the home Pumpkin Patch painting as a style/mood reference only. No source/home-game artwork was changed.

The generated source is preserved at assets/backgrounds/pumpkin-patch-haunted-source.png (1006 x 1564). The game uses assets/backgrounds/pumpkin-patch-haunted-muted.jpg, exported to exactly 1296 x 2016 with aspect-preserving cover resampling and less than one output pixel of horizontal edge crop. JPEG quality 88; approximately 278 KiB. No creative edits were made during export.

The scene is a very muted pumpkin field with a distant haunted house on a hill and a full moon in the upper-right corner. It fills the game panel, with no baked-in UI or text. Game cards, speaker bubbles and interactions remain unchanged.

CSS uses --table-background for the scene and retains the original --green-table-background gradient. To restore the green table, set --table-background: var(--green-table-background). The body background can also be restored to #174b3c. Pre-change CSS and notes are saved in background-checkpoint-green-2026-1011/. Published pre-background checkpoint is 1d7a777. Avoid restoring the entire old CSS after later styling changes.

This is a local experiment; no commit/push was requested or performed for it.

## Generation prompt

Create a standalone painted background image for a Halloween candy mini-game. OUTPUT CANVAS: exactly 1296 x 2016 pixels, portrait 9:14 aspect ratio, edge to edge. Input image 1 is STYLE AND MOOD REFERENCE ONLY, not an edit target: the existing pumpkin patch home-game painting. Borrow its softly painted pumpkins, hazy moonlight, subdued olive-black shadows and autumn atmosphere, but make a new tall scene. Scene: a quiet pumpkin patch field filling the foreground and middle, a small haunted Victorian house silhouetted on a low hill in the distant upper portion, and a full moon in the upper-right corner. The full moon is a modest softly glowing circle, not huge; the house is readable but distant, with only faint warm window light. A few dark trees can frame the distant hill. Pumpkin shapes naturally recede into the distance. It must be VERY MUTED: low saturation, low contrast, dark dusk olive/charcoal/purple-gray, barely luminous desaturated amber pumpkins and subdued pale moon. Keep broad middle areas quiet and dark so colorful candy cards, white labels, and cream/green/coral speech bubbles laid on top dominate. Background illustration ONLY: no text, no UI, no borders, no cards, no people, no mascot, no bright jack-o-lantern faces, no decorative labels. Avoid a dramatic bright sky or distracting high-contrast details. Soft painterly storybook field scene inspired by the supplied painting. Exact 1296x2016 finished canvas.
