# NEONVOX — Cyber-Social Platform

A high-performance mini social media application featuring an obsidian dark-mode interface with electric neon accents (electric cyan, neon violet, and laser emerald). Built with a clean separation between **Frontend** and **Backend**, powered by **React**, **Express.js**, and **MongoDB**.

---

## ⚡ Features

### 👤 User Profiles
- **Profile Customization**: Custom banners, glowing avatars with initials fallback, bio, location, personal links, and joined date.
- **Dynamic Stats**: Real-time counter for Pulses (posts), Followers, and Following.
- **Follow System**: Instant 1-click follow/unfollow toggle with live count synchronization.
- **Followers & Following Modals**: Interactive modal to explore followers and followed accounts with inline follow toggles.
- **Account Switcher**: Quick terminal switcher in the navigation bar to test interactions across multiple creator profiles.

### 📝 Posts & Feeds
- **Rich Post Composer**: Text transmissions up to 350 characters with live character counter.
- **Media Support**: Image attachment via URL or one of the curated neon visual presets.
- **Automated Hashtags**: Built-in tag picker and automatic `#hashtag` and `@mention` highlighting.
- **Interactive Feed Filters**: Filter between **For You**, **Following**, **Trending**, or any specific `#tag`.
- **Search**: Instant client-side search across post content, authors, and hashtags.

### 💬 Likes & Threaded Comments
- **Glowing Likes**: Smooth heart popping animation with tabular figure counters.
- **Expandable Comment Drawer**: Threaded discussions with author previews, timestamps, and individual comment likes.

---

## 📁 Project Structure

The project maintains a strict separation between client-side and server-side code:

```
├── /frontend/                     # Client-Side Application
│   ├── /components/               # UI components
│   │   ├── Avatar.tsx             # Resilient glowing avatar with fallback
│   │   ├── CommentDrawer.tsx      # Threaded comments & replies
│   │   ├── CreatePostCard.tsx     # Post composer with tags & media
│   │   ├── EditProfileModal.tsx   # Profile editor dialog
│   │   ├── ExploreSidebar.tsx     # Trending tags & suggested pilots
│   │   ├── FeedTabs.tsx           # Segmented feed filter controls
│   │   ├── FollowModal.tsx        # Interactive followers/following list
│   │   ├── Navbar.tsx             # 3-zone top bar navigation
│   │   ├── PostCard.tsx           # Obsidian neon post card with like/share/delete
│   │   └── UserProfileView.tsx    # Full profile page with tabs (Pulses, Liked, Media)
│   ├── /services/api.ts           # HTTP client communicating with Express /api/*
│   ├── /styles/neon.css           # Dark mode styling & neon glow utilities
│   ├── /types/index.ts            # Frontend TypeScript models
│   └── App.tsx                    # Main frontend application coordinator
│
├── /backend/                      # Server-Side Application
│   ├── /db/                       # Database layer
│   │   ├── mongo.ts               # MongoDB Mongoose connector with in-memory fallback
│   │   └── seedData.ts            # Cyberpunk creator seed dataset
│   ├── /models/                   # Mongoose schemas & TypeScript interfaces
│   │   ├── schemas.ts             # User, Post, Comment, Follow Mongoose models
│   │   └── types.ts               # Core database interfaces
│   ├── /routes/                   # Express REST API routes
│   │   ├── comments.ts            # /api/comments routes
│   │   ├── posts.ts               # /api/posts routes
│   │   ├── system.ts              # /api/system health route
│   │   └── users.ts               # /api/users routes
│   ├── app.ts                     # Express app assembly & middleware
│   └── server.ts                  # Production standalone server entry point
│
├── .env.example                   # Environment variable template
├── .gitignore                     # Git ignore rules (protects .env and node_modules)
├── .npmrc                         # npm configuration (legacy-peer-deps=true)
├── package.json                   # Dependencies & npm scripts
└── vite.config.ts                 # Vite bundler with integrated Express middleware
```

---

## 🛠️ API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/posts` | Get posts (filters: `feedType`, `tag`, `authorId`, `currentUserId`) |
| `POST` | `/api/posts` | Create new post `{ authorId, content, mediaUrl, tags }` |
| `POST` | `/api/posts/:id/like` | Toggle like on a post `{ userId }` |
| `DELETE` | `/api/posts/:id` | Delete post `{ authorId }` |
| `GET` | `/api/comments?postId=:id` | Get comments for a post |
| `POST` | `/api/comments` | Create new comment `{ postId, authorId, content }` |
| `POST` | `/api/comments/:id/like` | Toggle like on comment `{ userId }` |
| `GET` | `/api/users` | List all users |
| `GET` | `/api/users/:id` | Get user profile by ID or username |
| `PUT` | `/api/users/:id` | Update profile `{ displayName, bio, location, website, avatar, banner }` |
| `POST` | `/api/users/:id/follow` | Toggle follow/unfollow `{ followerId }` |
| `GET` | `/api/users/:id/followers` | Get followers of a user |
| `GET` | `/api/users/:id/following` | Get users followed by this user |

---

## 🚀 Local Development Setup

### 1. Clone & Install

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables

Create your local `.env` file from the provided template:

```bash
cp .env.example .env
```

Set your MongoDB connection string in `.env`:

```env
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/neonvox?retryWrites=true&w=majority"
```

> **Instant Local Fallback**: If you do not provide a `MONGODB_URI`, the server will automatically run using the preloaded local store with sample creator profiles, posts, and comments.

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser. The Vite frontend and the Express backend run concurrently on port 3000.

---

## ☁️ Deployment Guide (Render.com)

To deploy on [Render.com](https://dashboard.render.com/):

1. **New Web Service**: Click **New +** → **Web Service** → Select your GitHub repository.
2. **Configure Settings**:
   - **Runtime**: `Node`
   - **Branch**: `main`
   - **Root Directory**: *(leave blank)*
   - **Build Command**:
     ```bash
     npm install --legacy-peer-deps && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
3. **Environment Variables**:
   Under **Environment Variables**, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection URI
   - `NODE_ENV`: `production`
4. Click **Deploy Web Service**.

---

## 📦 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend**: Express.js 4, Node.js
- **Database**: MongoDB & Mongoose 9 (with in-memory fallback)
- **Bundler & Server**: Vite 8, TSX
