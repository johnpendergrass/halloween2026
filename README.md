# Halloween 2026

A collection of Halloween mini games for phone, tablet and PC browser.

**Status: early scaffold (September 2026).** A home menu with four placeholder
games. The framework and the rules for writing mini games are being built
next.

## Running it on your own machine

Double-click **`start-local/start-halloween.bat`**. It starts a small web
server and opens the game at `http://localhost:8091/`. It also prints an
address for testing on a phone on the same Wi-Fi.

## What is in here

```text
index.html          the app's entry point (the 9:16 frame and its screens)
manifest.json       makes it installable / full screen on Android and desktop
app/                the app's CSS and JavaScript
start-local/        a small web server for testing on this machine
claude-john-docs/   design notes
```

Plain HTML, CSS and JavaScript. No framework, no build step.
