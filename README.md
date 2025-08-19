# 🎯 Millionaire Quiz (Nuxt 4)

A **Who Wants to Be a Millionaire?**-style quiz game built with **Nuxt 4**, **TypeScript**, and **TailwindCSS**. 
Answer questions, use lifelines, and climb your way to the million with smooth, game-like UI and responsive performance.

[![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

- 🎮 **15-question** ladder with increasing difficulty
- ⏱️ Per-question **countdown timer** with visual feedback
- 🛟 Lifelines: **50/50**, **Ask the Audience**, **Phone a Friend**
- 🧠 Clear state transitions (waiting → locking → reveal → next)
- 🌓 **Dark-mode** friendly UI (Tailwind utility tokens)
- 📱 Fully **responsive** and accessible

---

## 🧱 Tech Stack

- **Framework:** Nuxt 4 (Vue 3, Nitro)
- **Language:** TypeScript (strict)
- **UI:** TailwindCSS 4 (utility-first + CSS variables)
- **State:** Composables & reactive stores (no external state libs)

---

## 🚀 Getting Started

### 1) Clone

```bash
git clone https://github.com/ndlabdev/millionaire-quiz.git
cd millionaire-quiz
```

### 2) Install

```bash
# pick one
pnpm install
# or
yarn install
# or
npm install
```

### 3) Dev

```bash
pnpm dev
# or yarn dev / npm run dev
```

App runs at **http://localhost:3000** by default.

### 4) Build & Preview

```bash
pnpm build
pnpm preview
```

---

## ⚙️ Configuration

- **TypeScript:** Strict mode enabled, no `any` usage.
- **Tailwind:** Preconfigured with tokens for brand colors and dark mode. Adjust in `tailwind.config.ts` if needed.
- **Runtime:** Pure client-side game logic; no external API required.

---

## 📂 Project Structure

```
millionaire-quiz/
├─ app.vue                # Root shell (layout wrappers, theme classes)
├─ pages/
│  ├─ index.vue           # Start screen (Play, rules, banner)
│  └─ play.vue            # Main game screen
├─ components/
│  ├─ game/
│  │  ├─ QuestionCard.vue
│  │  ├─ AnswerButton.vue
│  │  ├─ LifelinesBar.vue
│  │  └─ LadderList.vue
│  └─ ui/                 # Buttons, modals, progress ring, toasts
├─ composables/
│  ├─ useGame.ts          # Core game state & transitions
│  ├─ useLifelines.ts     # 50/50, audience, phone logic
│  └─ useTimer.ts         # Countdown with pause/resume
├─ assets/
│  ├─ styles/             # Tailwind layers, tokens
│  └─ audio/              # Sounds (lock-in, correct, wrong)
├─ public/                # Static images (logo, banner)
└─ ...
```

---

## 🧪 Scripts

```json
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "lint": "eslint ."
  }
}
```

---

## 🖼️ Screenshots

> Add your screenshots in `public/screens` and reference them here.

```md
![Start](./public/screens/start.png)
![Gameplay](./public/screens/gameplay.png)
```

---

## ☁️ Deployment

- **Vercel** recommended (first-class Nuxt support). 
- Import repo → set build command automatically → deploy.  
- Static assets served from `public/`; Nitro handles routing.

---

## 🗺️ Roadmap

- [ ] Localized question sets (EN/VI)
- [ ] Persistent high scores (localStorage → server)
- [ ] Sound & music toggles + volume control

---

## 🙏 Acknowledgements

Inspired by the classic TV show *Who Wants to Be a Millionaire?*. 
This project is for learning and demonstration purposes.

---

## 📜 License

**MIT** – see `LICENSE` for details.
