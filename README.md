# Logistics Website

A full-featured international logistics company website built with Next.js 15, featuring a public-facing site and a comprehensive admin panel.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **UI**: React 19 + Tailwind CSS 4
- **Database**: SQLite (better-sqlite3, WAL mode)
- **Auth**: JWT + bcryptjs (cookie-based)
- **Editor**: @uiw/react-md-editor + react-markdown

## Features

### Public Site
- **Home** — Hero banners, stats, service highlights, CTA, partner logos
- **About** — Company introduction, mission, advantages
- **Services** — All services with features list, sub-items, "Get a Quote" link to contact
- **News** — Blog/news articles with Markdown rendering
- **Contact** — Contact info + inquiry form (with honeypot anti-spam), service pre-selection via URL params

### Admin Panel (`/admin`)
- **Dashboard** — Page views chart, inquiry stats, quick metrics
- **Pages** — Edit Home / About / Contact page content with live previews
- **Services** — CRUD with features list + sub-items management
- **News** — CRUD with Markdown editor + image picker
- **Inquiries** — 4-status workflow (new → processing → replied → closed), filters, admin notes
- **Banners** — CRUD with image picker, sort order, show/hide toggle
- **Partners** — CRUD with logo, website, sort order
- **Images** — Upload & manage images
- **Backup** — Database backup / restore
- **Settings** — Company info, footer links, admin password

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Seed the database with initial data
npm run seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

### Default Admin Credentials

After seeding, log in with:
- **Username**: `admin`
- **Password**: `admin123`

> Change the password immediately in Settings after first login.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database with sample data |

## Project Structure

```
src/
├── app/
│   ├── (user)/          # Public pages (Home, About, Services, News, Contact)
│   ├── admin/           # Admin panel pages
│   └── api/             # API routes
├── components/          # Shared React components
├── hooks/               # Custom React hooks
├── lib/                 # Database, auth, utilities
└── middleware.ts        # Auth middleware for /admin routes
data/                    # SQLite database files (gitignored)
public/images/uploads/   # User-uploaded images (gitignored)
scripts/                 # seed.ts
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `JWT_SECRET` | Secret key for JWT tokens | `logistics-jwt-secret-2024` |
| `NEXT_PUBLIC_SITE_URL` | Public URL for sitemap/robots | `https://localhost:3000` |

## Deployment

The project uses `output: 'standalone'` for easy containerized deployment.

```bash
npm run build
npm run start
```

Ensure the `data/` directory is writable for SQLite and `public/images/uploads/` for image uploads.

## License

Private
