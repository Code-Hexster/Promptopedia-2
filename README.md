<h1 align="center">
  <br>
  🧠 Promptopedia
  <br>
</h1>

<h4 align="center">A social platform for sharing, discovering, and remixing AI prompts.</h4>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-v20-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"/>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## Features

- 🔐 **Auth** — JWT-based registration and login
- 📝 **Prompts** — Create, edit, delete, and browse AI prompts
- ❤️ **Likes & Comments** — Engage with the community
- 🔁 **Remixes** — Fork and remix prompts from other users
- 👥 **Follow System** — Follow creators you love
- 🔔 **Notifications** — Real-time activity updates
- 💬 **Messages** — Direct messaging with Socket.io
- 📱 **Responsive Design** — Works great on all screen sizes

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6 |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL via Prisma ORM |
| **Auth** | JSON Web Tokens (JWT), bcryptjs |
| **Real-time** | Socket.io |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
prompt-social/
├── backend/                  # Express + TypeScript API
│   ├── src/
│   │   ├── config/           # Database config
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Auth & error middleware
│   │   ├── models/           # Prisma schema models
│   │   ├── routes/           # API route definitions
│   │   └── utils/            # Helpers & utilities
│   ├── .env.example          # Environment variable template
│   └── server.ts             # Entry point
│
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── api/              # Axios API client
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React context (Auth etc.)
│   │   ├── hooks/            # Custom React hooks
│   │   └── pages/            # Route-level page components
│   └── vite.config.js
│
├── package.json              # Root scripts (runs both)
└── DEPLOYMENT_GUIDE.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **PostgreSQL** running locally (or a connection string from [Supabase](https://supabase.com) / [Neon](https://neon.tech))
- **npm** v9+

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/promptopedia.git
cd promptopedia/prompt-social
```

### 2. Install all dependencies

```bash
npm run install:all
```

### 3. Configure environment variables

```bash
cp backend/.env.example backend/.env
# Now open backend/.env and fill in your DATABASE_URL and JWT_SECRET
```

### 4. Run database migrations

```bash
cd backend
npx prisma migrate dev
cd ..
```

### 5. Start the development servers

```bash
npm run dev
```

This starts both the backend (`:5000`) and frontend (`:5173`) concurrently.

---

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions on deploying to **Render** (backend) and **Vercel** (frontend).

---

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">Built with ❤️ by <a href="https://github.com/YOUR_USERNAME">YOUR_USERNAME</a></p>
