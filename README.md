# 📰 LocalLens – Community News Platform

LocalLens is a lightweight, responsive community-driven news platform where users can share local news, interact through likes, comments, reposts, and explore updates in a clean, modern interface inspired by leading news platforms.

This project is built with simplicity, clarity, and usability in mind, making it easy to evaluate, run, and extend.

---

## 🚀 Features

- 📝 Post local news updates
- 👍 Like, 💬 comment, 🔁 repost, 📤 share posts (Facebook-style interactions)
- 🔐 Login & Signup UI (frontend simulated)
- 🧭 Clean header with navigation & search icon
- 📱 Fully responsive (desktop & mobile)
- 💾 Data persistence using `localStorage`
- 🎨 Minimal, modern UI (no heavy UI libraries)

---

## 🛠 Tech Stack

- **Frontend:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** Vanilla CSS (no Tailwind / UI frameworks)
- **State Management:** React Hooks
- **Storage:** Browser `localStorage`

---

## 📂 Project Structure

```text
local-lens/
├── public/
├── src/
│   ├── App.tsx        # Main application logic
│   ├── App.css        # Complete styling
│   ├── main.tsx       # React entry point
│   └── index.css      # Global styles
├── index.html
├── package.json
├── tsconfig.json
└── README.md
