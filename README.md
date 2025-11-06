# ♟️ Chess.com Clone – MERN Edition

![Chess Logo](/client/public/icons/logo.png)

> A sleek, real-time chess platform inspired by Chess.com, built with the MERN stack.

---

## 🧩 README Structure Plan

- [Project Title & Logo](#️-chesscom-clone--mern-edition)
- [Description / Overview](#description--overview)
- [Features List](#-features-list)
  - [Core](#core)
  - [Multiplayer](#multiplayer)
  - [AI](#ai)
  - [UI](#ui)
- [Tech Stack](#-tech-stack)
- [Screenshots / Demo](#-screenshots--demo)
- [Installation Guide](#-installation-guide)
- [Environment Variables](#-environment-variables)
- [Folder Structure](#-folder-structure)
- [Future Enhancements](#-future-enhancements)
- [Contributors / Author Info](#-contributors--author-info)

---

## Description / Overview

Chess.com Clone – MERN Edition is a full-stack web application that lets users play classical, blitz, and bullet chess online.  
It supports real-time multiplayer matches, an AI opponent, move validation, Elo ratings, and a polished, responsive UI.

---

## ✨ Features List

### Core

- ♟️ Full FIDE rule enforcement (castling, en-passant, promotion, stalemate, etc.)
- 🔄 Undo / Redo for casual games
- 📈 Elo rating system with history graphs
- 🗃️ User profiles & game archives

### Multiplayer

- ⚡ Real-time gameplay via WebSockets (Socket.IO)
- 🏆 Matchmaking private rooms
- 💬 In-game chat with emoji support

### AI

- 🧠 Negamax with alpha-beta pruning & iterative deepening
- 📚 Opening book for the first 8 moves

### UI

- 📱 Fully responsive (mobile, tablet, desktop)
- 🎨 Animated pieces & board themes (wood, marble, neon)
- 🔊 move, capture, check, checkmate sounds

---

## 🛠 Tech Stack

| Layer      | Tech                                                                  |
| ---------- | --------------------------------------------------------------------- |
| Front-end  | React 18, Redux-Toolkit, Socket.IO-client, TailwindCSS, Framer-Motion |
| Back-end   | Node.js, Express, Socket.IO, JWT, bcryptjs                            |
| Database   | MongoDB Atlas + Mongoose ODM                                          |
| Deployment | Vercel (front-end) / Render (back-end)                                |
| CI/CD      | GitHub Actions (lint + test + deploy)                                 |
| Testing    | Jest + React Testing Library (client) / Mocha + Chai (server)         |

---

🎥 [Live Demo](https://your-demo-link.vercel.app)

---

### Developed by

## ~ Ansh Sharma (AnshCoder)
