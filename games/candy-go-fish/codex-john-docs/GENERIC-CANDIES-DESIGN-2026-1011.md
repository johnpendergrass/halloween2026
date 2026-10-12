# Generic wrapped candy concept

Built-in image generation created a horizontal, zero-degree purple wrapped-candy sprite based on John's clipboard reference. Transparent PNG, no logo or background. Preserved original generation and a 300x150 aspect-preserving export:

- assets/generic-candies/wrapped-candy-v1-source.png
- assets/generic-candies/wrapped-candy-v1-300x150.png

Design preview only; not yet placed on dishes. A large reference display width of 75% of the 21vw dish is 15.75vw, about 204.12 design pixels. Actual pile candies should be smaller; rotation, scale, position and hue can be assigned per item in the game. Layout should stay stable across render calls rather than rerandomizing whenever counts update.

One coherent colored base supports CSS hue-rotate variants retaining its alpha and shading. There is no need to generate separate color PNGs now. This is a practical hue palette, not exact arbitrary-color matching; precise recoloring could later use tint/luminance processing. Multiple silhouettes/wrapper designs would require additional artwork.

Do not associate decorative colors with actual candy identities: opponent/dish candies remain private. Counts and presentation density policies are still to be decided before pile rendering. The round central dish and rectangular player dishes are unchanged by this design step.

## Generation prompt

Create one generic wrapped candy game sprite, using the supplied candy illustration as the STYLE and SHAPE reference. Transform the diagonal orientation into EXACTLY HORIZONTAL zero degrees: oval/rounded candy body lies left-to-right, one twisted wrapper end on the left and one on the right. Straight horizontal main axis, no diagonal tilt, no perspective skew. Simple polished softly shaded cartoon illustration matching reference: lavender/purple candy wrapper with muted pink-purple base, darker purple outlines/shadows, and broad soft highlights. A clean oval center with two pleasing folded, twisted flared wrapper ends, compact readable silhouette. Use just one coherent saturated lavender/purple palette so the game can hue-shift the whole candy into other colors while retaining highlights and shadows. Transparent background, clean transparent outside edges, no white rectangle, no cast shadow outside the candy. Exactly one candy, no logos, no text, no logos or camera UI from reference, no background, no plate, no extra objects. Wide 2:1 canvas appropriate for a 300x150 PNG export, entire candy visible with a small transparent margin. Symmetrical balanced wrapper shape with subtle natural folds; crisp at small phone size. This is a generic anonymous candy, not a specific branded product. No candies overlapping one another. Deliver unrotated horizontal purple candy only.
