# NEONVOX Social Platform

A modern, high-performance mini social media platform featuring an obsidian dark-mode interface with electric neon accents. Built with a clean separation between **Frontend** and **Backend**, powered by **React**, **Express.js**, and **MongoDB**.

---

## ⚡ Key Features

- **User Profiles**: Custom cyberpunk banners, glowing avatars, editable bios, locations, links, joined dates, and real-time follower/following counts.
- **Posts & Pulses**: Broadcast posts with rich text, hashtag parsing (`#WebGLArt`, `#CyberUI`), media image previews, and instant deletion.
- **Like & Follow System**: Interactive like animations with tabular numeral counters, instant follow/unfollow toggle, and dedicated follower/following modal lists.
- **Threaded Comments**: Real-time comment threads with individual comment likes and timestamps.
- **Dark Mode & Neon Aesthetics**: Bespoke obsidian surface styling with electric cyan (`#00F0FF`), neon violet (`#BD00FF`), and hot coral highlights.
- **Dual-Mode Backend**: Express.js server equipped with Mongoose schemas for MongoDB, with seamless in-memory fallback for local development.

---

## 📁 Project Architecture

The codebase is organized into two isolated directories:

```
├── /frontend/               # Client-Side Application
│   ├── /components/         # Navbar, PostCard, UserProfileView, CommentDrawer, etc.
│   ├── /services/api.ts     # Client HTTP service connecting to /api/*
│   ├── /styles/neon.css     # Dark mode & neon glow styling
│   ├── /types/              # Shared frontend TypeScript interfaces
│   └── App.tsx              # Root frontend coordinator
│
├── /backend/                # Express.js REST API
│   ├── /models/             # Mongoose schemas & data types (User, Post, Comment, Follow)
│   ├── /db/                 # MongoDB connection manager (mongo.ts) & seed data
│   ├── /routes/             # Express route handlers (/api/users, /api/posts, /api/comments)
│   ├── app.ts               # Express application middleware assembly
│   └── server.ts            # Production standalone Express entry point
│
├── .env.example             # Environment variable templates
├── package.json             # Scripts & dependencies
└── vite.config.ts           # Vite bundler with integrated Express API proxy
```

---

## 🚀 Getting Started

### 1. Clone the repository & Install dependencies

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Add your MongoDB connection string in `.env`:

```env
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/neonvox?retryWrites=true&w=majority"
```

> **Note**: If `MONGODB_URI` is not set, the Express backend automatically runs with an in-memory database preloaded with initial creator profiles so you can test immediately.

### 3. Start Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser. Both the Vite client and the Express `/api` backend run together seamlessly on port 3000.

### 4. Build & Run for Production

```bash
npm run build
npm start
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Express.js, Node.js
- **Database**: MongoDB (via Mongoose ODM)
- **Tooling**: Vite 8, TSX
