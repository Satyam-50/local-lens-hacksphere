# 📰 LocalLens — Hyperlocal Citizen Journalism Platform

LocalLens is a full-stack web application that empowers citizens to report, share, and engage with hyperlocal news.  
It focuses on community-driven stories that are often ignored by mainstream media.

Built for **HackSphere Hackathon** 🚀

---

## ✨ Features

### 🔐 Authentication
- User Signup & Login using JWT
- Passwords hashed with bcrypt
- Auth-protected actions (post, like, comment)

### 📰 News Feed
- Preloaded dummy news articles for instant demo
- Categories: News, Culture, Business, Music
- Latest posts shown first
- Category-based filtering

### ✍️ Create Posts
- Only logged-in users can publish posts
- Posts stored persistently in MongoDB
- Real-time UI update

### 👍 Likes
- Likes stored as user IDs in MongoDB
- Like count persists after refresh

### 💬 Comments
- Authenticated users can comment
- Comments stored per post
- Reload-safe persistence

---

## 🛠 Tech Stack

Frontend:
- React + TypeScript
- React Router
- Vite

Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt
- Zod

---

## 🚀 How to Run Locally

### Backend
cd backend
npm install
node index.js

### Frontend
npm install
npm run dev

Frontend: http://localhost:5173  
Backend: http://localhost:5000

---

## 👥 Team
Abhinav Kumar — Full Stack  
Satyam — UI/UX & Frontend

Built with ❤️ for HackSphere