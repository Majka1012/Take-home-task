# Project

This repository contains two web-based advertising concepts, built with plain HTML, CSS and JavaScript, with GSAP for animations.

## Variants

### 1. Interactive game

An interactive game in which the player avoids obstacles. It includes:

- Player movement and jumping.
- Collision detection.
- Animated scrolling background.
- Win and lose states.
- Background music and sound effects.
- Restart functionality.

### 2. Multi-section animated advertisement

A multi-section advertisement consisting of three areas:

- Left vertical section (320 × 975 px).
- Top horizontal section (1032 × 250 px).
- Right vertical section (320 × 975 px).

The sections are displayed together in a 1672 × 975 px layout. GSAP is used for entrance animations, transitions and repeating visual effects.

## Running locally

No build step or server is required. The project is plain HTML, CSS and JavaScript.

Open the preview files directly in a browser:

- Game: `variant-a-game\src\index.html`
- Advertisement: `variant-b-fireplace\src\preview.html`

Double-click the HTML file, or drag it into your browser window or "Live Server" extension in VS Code.

## Known issues and implementation shortcuts

- The advertisement currently uses fixed dimensions and is designed around a 1672 × 975 px layout. Responsive scaling for different viewport sizes could be improved.
- The game uses DOM elements and GSAP rather than Canvas.
- The project uses local image and audio assets, so the original asset folder structure must be preserved.

## What I would improve with more time

- Improve keyboard and touch controls for the game (needs more playtesting)
- Fine-tune animation timing and transitions
- Test collision detection and game behaviour across different screen sizes and browsers
- Improve accessibility — keyboard navigation and reduced-motion support
- Use Webpack to bundle the project
- Move shared code into common files (the left and right banners are almost identical)
- Use SCSS for more reusable styling

## AI usage

I used Claude as a supporting tool during development, mainly for project structure, some minor logic, and debugging/error handling.

The AI also rewrote this README to bring my notes together into one consistent version.

## AI mistake

I had a problem with the layout in CSS, so I asked Claude to help me with it. First, Claude added (among other things) height: 100% on body, which broke the layout completely. Then, after my new prompt, the AI added a JS fit() function that re-centres and rescales the ad on every resize. This wasn't needed at that moment, because I didn't want to focus on resizing, I just wanted the layout to be correct.

The solution was simply to remove height. So, as usual, the AI created the problem and then found an overcomplicated workaround :D
