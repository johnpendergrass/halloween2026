# Proposed starting rules

October 8, 2026

These rules make the initial concept executable. They are a proposed baseline for review and playtesting.

## Setup and objective

Shuffle a deck containing three copies of each of ten candy types. Deal five cards to each player and put the other twenty face down in a draw pile. The human starts in the first prototype. Automatically collect any complete triples dealt at setup, then refill an empty hand as described below.

A set consists of all three copies of one candy. Completed sets leave the hand and remain visible. Each is worth one point. The player with more sets after all ten are collected wins; five sets each is a tie.

## A turn

1. Choose a candy type currently in your hand and ask the other player for it.
2. If they hold that type, they give you all their copies. Collect any resulting triple. You take another turn.
3. If they hold none, go fish: draw the top card from the draw pile, if one remains.
4. If the drawn card is the requested type, collect any resulting triple and take another turn. Otherwise, collect any resulting triple and pass the turn.

A triple made by drawing a different type does not itself grant an extra turn. A successful request or drawing the requested type does.

Both players follow the same rules. Players may ask only for a type they currently hold. Hands stay hidden from the opponent; requests, transfers, hand counts, and completed sets are public. The human sees their own draws, but not the computer's unsuccessful draw type.

## Empty hands

After resolving a move and collecting triples, any player with an empty hand draws up to five cards from the remaining pile. Refill the acting player first, then the other player. Automatically collect triples from the refill; repeat if that leaves the hand empty and cards remain.

Refilling does not independently grant an extra turn. The original move determines who plays next. A player with no cards and no available draw skips their turn. If only one player has cards, that player continues.

## Empty draw pile and finishing

When the draw pile is empty, a failed request ends the turn without drawing. Successful requests still transfer all matching cards and grant another turn.

Play ends immediately when all ten triples have been collected. Empty draw pile alone does not end the game. With three copies per type and automatic collection, any uncollected type must be split between the hands once the pile is empty. A valid request can therefore transfer cards and make progress; the game needs no additional sudden-death rule.

## Examples

- You hold one Snickers and the computer holds two. Asking for Snickers transfers both and completes your set. You play again.
- You hold two Mounds, but the computer has none. You draw Mounds, complete the set, and play again.
- You ask for Dots but draw the third Butterfinger. You collect Butterfinger and pass the turn.
- You ask for Red Vines when the pile is empty and the opponent has none. Nothing moves; the turn passes. This case should be handled defensively even though a consistent three-copy endgame state should not produce it.

## Decisions to revisit after playtesting

Start player fairness, game duration, tie frequency, and whether five-card refills feel good. Keep these as review topics rather than extra settings on the initial screen.
