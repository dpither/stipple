<p align="center"><img src="public/favicon.svg" width="100"></p>

<h1 align="center">⣫tipple</h1>

Stipple is a web application for creating braille animations. Instead of painfully searching for the characters you need, simply toggle dots to create the characters for each frame. Then copy the sequence as plain text or a JSON array.

I've always enjoyed the simplicity and charm of using text as an artistic medium, so I wanted to include some text animations on my website. However, exploring the possibilities of creating animations out of Braille characters was very difficult. Since no tool existed, I asked Claude to help me out; it gave me an ugly artifact, so I made it better.

## Preview

<p align="center">
  <img width="1920" height="1080" alt="stipple-preview" src="https://github.com/user-attachments/assets/dc747054-9f72-4e0a-b211-27c1caf7d4e2" />
</p>

## Features

- Import and copy frames as plain text or JSON
- Configurable playback speed (1-60 FPS)
- Configurable frame size up to 2 x 4 characters (8 x 8 dots)
- Keyboard shortcuts
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

- Typescript - Type safety
- Svelte - UI framework
- Tailwind CSS - Styling
- Bits UI - Headless UI components
- Vite - Build tool and dev server

## Roadmap

- Copy as CSS
- Drag and drop to reorder frames
- Preview window of actual text character animation
