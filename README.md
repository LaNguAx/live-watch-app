# Live Watch App 🎬 🔴
> **Watch YouTube together, in perfect sync — chat, search, and party with friends online or on the couch.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Features
- **Real-time watch parties** — ultra-low-latency sync of play, pause, seek, volume, and video swaps via Socket.IO  
- **Room system** — create public/private rooms, share invite codes, see who’s connected  
- **YouTube search & queue** — lightning-fast TanStack Query v5 search with debounce + caching  
- **Live chat** — emoji & username support  
- **Responsive UI** — React 18 + Tailwind + shadcn/ui, mobile-first & RTL-friendly  
- **Type-safe shared DTOs** between client and server  
- **Docker-first** images for effortless local or cloud deploys  

---

## 🛠️ Tech Stack

| Layer      | Technology |
| ---------- | ---------- |
| **Frontend** | React 18 + TypeScript, Vite, Redux Toolkit, TanStack Query v5, React Router v6, Tailwind CSS, Socket.IO-client |
| **Backend**  | Node.js 20, Express 5, Socket.IO v4, dotenv, cors |
| **Dev Ops**  | Docker & Compose, ESLint + Prettier, Husky + lint-staged, GitHub Actions CI |

---

## 🏗️ Architecture Overview
```
┌─────────────────────┐            ┌───────────────────────┐
│      Frontend       │  WebSock   │        Backend        │
│  React + TS + Vite  │◀──────────▶│  Express + Socket.IO  │
│  ─────────────────  │   REST     │  ───────────────────  │
│  TanStack Query     │◀───────┐   │  Room Manager (Map)   │
│  Redux Toolkit      │        │   │  YouTube oEmbed Proxy │
└─────────────────────┘        │   └───────────────────────┘
                               │
                      ┌────────▼────────┐
                      │     Client      │  Any number of peers
                      └──────────────────┘
```


## 🤝 Contributing
Pull requests are welcome! Follow conventional-commits, run `npm run lint` before pushing, and explain **what** & **why** in your PR.

---

## 📝 License
Distributed under the **MIT License** — see `LICENSE` for details.

---

> _Built with 💙 by [LaNguAx](https://github.com/LaNguAx) — stars and feedback always appreciated!_
