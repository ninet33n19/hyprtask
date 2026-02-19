# Hyprtask

A full-stack task management application with workspaces, projects, and tasks. Built with Bun, Express, React, and PostgreSQL.

## Features

- User authentication (register, login, logout)
- Workspace management
- Project organization within workspaces
- Task management with status tracking (TODO, IN_PROGRESS, DONE)
- Task assignment and due dates

## Tech Stack

### Backend
- **Runtime**: [Bun](https://bun.sh) - fast all-in-one JavaScript runtime
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 17
- **Auth**: JWT with HTTP-only cookies
- **Validation**: Zod

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build**: Bun's built-in bundler
- **Dev Server**: Bun.serve with HMR

## Project Structure

```
hyprtask/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── db/
│   │   │   ├── migrations/  # SQL migration files
│   │   │   ├── pool.ts      # PostgreSQL connection pool
│   │   │   └── queries/     # Database query functions
│   │   ├── middleware/      # Auth & error middleware
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # JWT, hashing utilities
│   ├── docker-compose.yml
│   ├── package.json
│   └── .env
├── client/
│   ├── components/          # React components
│   ├── context/             # React context providers
│   ├── lib/                 # API client, auth utilities
│   ├── pages/               # Page components
│   ├── App.tsx
│   ├── main.tsx
│   ├── server.ts            # Dev server
│   └── types.ts
└── README.md
```

## Database Schema

### Users
| Column | Type |
|--------|------|
| id | UUID (PK) |
| email | TEXT (unique) |
| password_hash | TEXT |
| avatar_url | TEXT |
| created_at | TIMESTAMPTZ |

### Workspaces
| Column | Type |
|--------|------|
| id | UUID (PK) |
| name | TEXT |
| owner_id | UUID (FK → users) |
| created_at | TIMESTAMPTZ |

### Workspace Members
| Column | Type |
|--------|------|
| id | UUID (PK) |
| workspace_id | UUID (FK) |
| user_id | UUID (FK) |
| role | ENUM(ADMIN, MEMBER) |

### Projects
| Column | Type |
|--------|------|
| id | UUID (PK) |
| workspace_id | UUID (FK → workspaces) |
| name | TEXT |
| created_at | TIMESTAMPTZ |

### Tasks
| Column | Type |
|--------|------|
| id | UUID (PK) |
| project_id | UUID (FK → projects) |
| title | TEXT |
| description | TEXT |
| status | ENUM(TODO, PROGRESS, DONE) |
| assigned_to | UUID (FK → users) |
| due_date | TIMESTAMPTZ |
| created_at | TIMESTAMPTZ |

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| POST | `/logout` | Logout user | No |
| GET | `/me` | Get current user | Yes |

### Workspaces (`/api/workspaces`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create workspace | Yes |
| GET | `/` | List user's workspaces | Yes |

### Projects (`/api/projects`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create project | Yes |
| GET | `/` | List projects (query: `workspaceId`) | Yes |

### Tasks (`/api/tasks`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create task | Yes |
| GET | `/` | List tasks (query: `projectId`, `status`, `page`, `limit`) | Yes |
| PATCH | `/status` | Update task status | Yes |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- [Docker](https://docker.com) (for PostgreSQL)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hyprtask
```

2. Install dependencies:
```bash
cd backend
bun install
```

3. Start PostgreSQL:
```bash
docker compose up -d
```

4. Create `.env` file in `backend/`:
```env
PORT=8080
DATABASE_URL=postgresql://postgres:password@localhost:5432/hyprtask
JWT_SECRET=your-jwt-secret-here
NODE_ENV=development
```

5. Run database migrations:
```bash
bun run migrations
```

### Development

Start the backend server (from `backend/`):
```bash
bun run dev
```

Start the frontend dev server (from `client/`):
```bash
bun run dev
```

Or run both simultaneously (from `backend/`):
```bash
bun run dev:all
```

- Backend API: http://localhost:8080
- Frontend: http://localhost:3000

### Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start backend with hot reload |
| `bun run dev:client` | Start frontend dev server |
| `bun run dev:all` | Start both servers |
| `bun run migrations` | Run database migrations |
| `bun run lint` | Check code with Biome |
| `bun run lint:fix` | Auto-fix lint issues |
| `bun run format` | Format code with Biome |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `8080` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret for JWT signing | Required |
| `NODE_ENV` | Environment mode | `development` |

## License

MIT
