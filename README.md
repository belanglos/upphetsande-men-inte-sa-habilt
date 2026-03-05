# Gravity Text Editor

A text editor where the laws of physics apply.

## Live Demo

[https://belanglos.github.io/upphetsande-men-inte-sa-habilt/](https://belanglos.github.io/upphetsande-men-inte-sa-habilt/)

## How It Works

Type normally into the editor. Each letter renders as an independent element. After 1.5 seconds of inactivity, letters lose their anchors, fall with gravity, bounce off each other and the floor, and pile up chaotically.

- **Escape** during gravity mode triggers an explosion, flinging all letters outward
- **Click** anywhere to reset everything back to readable text

## Tech Stack

- Svelte 5 + TypeScript
- Vite (dev server + build)
- Matter.js for 2D physics
- Vitest + @testing-library/svelte for testing

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Static output is generated in `dist/`.

## Testing

```bash
npm test
```

## CI/CD

The project includes three GitHub Actions workflows:

- **pr.yml** — Runs tests and type checking on pull requests to main
- **claude-review.yml** — AI-powered code review on pull requests
- **deploy.yml** — Builds and deploys to GitHub Pages on push to main

> **Note:** The `ANTHROPIC_API_KEY` must be added as a GitHub Actions secret for the Claude review workflow to work.
