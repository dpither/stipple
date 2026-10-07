<p align="center"><img src="public/favicon.svg" width="100"></p>

<h1 align="center">⣫tipple</h1>

Stipple is a web application for creating braille animations. Instead of painfully searching for the characters you need, simply toggle dots to create the characters for each frame. Then copy the sequence as plain text or a JSON array.

I've always enjoyed the simplicity and charm of using text as an artistic medium, so I wanted to include some text animations on my website. However, exploring the possibilities of creating animations out of Braille characters was very difficult. Since no tool existed, I asked Claude to help me out; it gave me an ugly artifact, so I made it better.

## Preview

<p align="center">
  <img width="1920" height="1080" alt="stipple-preview" src="https://github.com/user-attachments/assets/ab53e447-f2a2-41a3-951b-dd875dc33768" />
</p>

## Features

- Copy frames as plain text, JSON, CSS or a sharable link
- Import frames as plain text or JSON
- Configurable playback speed (1-60 FPS)
- Configurable frame size up to 2 x 4 characters (8 x 8 dots)
- Drag frames to reorder
- Keyboard shortcuts
  - Toggle play - <kbd>Space</kbd>
  - Next frame - <kbd>.</kbd>
  - Previous frame - <kbd>,</kbd>
  - New blank frame - <kbd>Shift</kbd> + <kbd>N</kbd>
  - Duplicate current frame - <kbd>Shift</kbd> + <kbd>D</kbd>
  - Delete current frame - <kbd>Delete</kbd>
- Mobile Friendly

## Getting Started

### Prerequisites

- Node.js: 20.19+ or 22.12+

### Installation

```bash
git clone https://github.com/dpither/stipple.git
cd stipple
npm install
```

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm run preview
```

## Tech Stack

- [Typescript](https://www.typescriptlang.org/) - Type safety
- [Svelte](https://svelte.dev/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vite.dev/) - Build tool and dev server
- [Bits UI](https://www.bits-ui.com/) - Headless UI components
- [Svelte Sortable List](https://github.com/rodrigodagostino/svelte-sortable-list) - Sortable list

## Roadmap

- Undo/Redo Actions
- Erase Tool
- Paint Tool (Make default behaviour?)
