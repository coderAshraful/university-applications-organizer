# 🎓 University Applications Organizer

A comprehensive web application to organize and track 20+ university applications with deadline management, requirements tracking, and intelligent worldwide university search.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Prisma](https://img.shields.io/badge/Prisma-7.4-green)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

## ✨ Features

### 📊 Dashboard
- **Stats Overview**: Track applications by status (Considering, Applied, Accepted, Waitlisted, Rejected, Enrolled)
- **Upcoming Deadlines**: View urgent deadlines with 7/14/30 day filters
- **Quick Actions**: Fast navigation to add universities or view timeline

### 🏫 Universities Management
- **Smart Search**: Search 180+ countries using official databases
  - 🇺🇸 US: College Scorecard API (US Dept of Education)
  - 🌍 International: Hipolabs University API (worldwide)
- **Auto-fill**: Name, location, and website populated automatically
- **Filters**: Search by name, status, or category (Reach/Target/Safety)
- **Card View**: Visual overview with progress tracking

### 📝 Detailed Tracking
- **Requirements Checklist**: Track essays, test scores, recommendations, transcripts
- **Deadline Manager**: Multiple deadline types (application, financial aid, tests, decisions)
- **Financial Information**: Tuition, fees, cost of living, scholarship notes
- **Personal Notes**: Why you're interested, concerns, visit impressions

### 📅 Timeline
- **Calendar View**: Visualize all deadlines in monthly calendar
- **Color-coded Urgency**: Red (urgent), Orange (soon), Blue (normal)
- **Filters**: By university or deadline type
- **Countdown**: Days until each deadline

### 🔍 Comparison
- **Side-by-side**: Compare multiple universities
- **Key Metrics**: Rankings, acceptance rates, costs, deadlines

## 🚀 Quick Start (One Command!)

```bash
npm run setup
```

This will:
1. ✅ Install all dependencies
2. ✅ Set up the SQLite database
3. ✅ Run database migrations
4. ✅ Seed with 5 sample universities
5. ✅ Start the development server

Then open [http://localhost:3000](http://localhost:3000) in your browser!

## 📋 Prerequisites

- **Node.js** 18.17 or higher
- **npm** 9 or higher

That's it! No separate database server needed - SQLite runs locally.

## 🔧 Manual Installation

If you prefer step-by-step:

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd university-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

The default `.env` works out of the box! Optional: Get a free API key at [https://api.data.gov/signup/](https://api.data.gov/signup/) for better rate limits.

### 4. Set up the database

```bash
npm run db:setup
```

This runs migrations and seeds sample data.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app!

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run setup` | 🚀 Complete setup (install, migrate, seed, start) |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:setup` | Set up database (migrate + seed) |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:reset` | Reset database (danger: deletes all data!) |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

## 🌐 Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy this Next.js app:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

**Or manually:**

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts. Vercel will:
   - Build your app
   - Set up environment variables (you'll need to add them)
   - Deploy to production

**Important**: For production, you'll want to use PostgreSQL instead of SQLite:

1. Create a PostgreSQL database (Vercel Postgres, Supabase, Railway, etc.)
2. Update `DATABASE_URL` in your environment variables
3. Update `prisma/schema.prisma` datasource to `postgresql`
4. Run migrations: `npx prisma migrate deploy`

### Deploy to Other Platforms

This app can be deployed to any platform that supports Next.js:

- **Railway**: [railway.app](https://railway.app) - Includes PostgreSQL
- **Render**: [render.com](https://render.com) - Free tier available
- **DigitalOcean**: App Platform
- **AWS**: Amplify or EC2
- **Self-hosted**: Any VPS with Node.js

## 🗄️ Database

### SQLite (Default - Development)

- Zero configuration
- File-based database: `prisma/dev.db`
- Perfect for single-user local development
- **Not recommended for production**

### PostgreSQL (Production)

To switch to PostgreSQL:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `.env`:
   ```bash
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

## 🔑 Environment Variables

Create a `.env` file (or copy `.env.example`):

```env
# Database
DATABASE_URL="file:./dev.db"

# College Scorecard API (optional)
# Get your free key at: https://api.data.gov/signup/
COLLEGE_SCORECARD_API_KEY=DEMO_KEY
```

## 🎨 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Prisma](https://www.prisma.io/) + SQLite (dev) / PostgreSQL (prod)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)

## 📁 Project Structure

```
university-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── universities/         # University CRUD
│   │   ├── requirements/         # Requirements CRUD
│   │   ├── deadlines/            # Deadlines CRUD
│   │   ├── stats/                # Dashboard stats
│   │   └── search-universities/  # University search API
│   ├── universities/             # Universities pages
│   ├── timeline/                 # Timeline page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Dashboard
├── components/                   # React components
│   ├── ui/                       # Shadcn components
│   ├── layout/                   # Navigation, headers
│   ├── dashboard/                # Dashboard widgets
│   ├── universities/             # University components
│   ├── detail/                   # Detail view components
│   └── timeline/                 # Timeline components
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Sample data
│   └── migrations/               # Migration history
├── lib/                          # Utilities
│   ├── db.ts                     # Prisma client
│   └── utils.ts                  # Helper functions
├── types/                        # TypeScript types
└── public/                       # Static assets
```

## 🛠️ Development

### Database Management

**View/edit data with Prisma Studio:**
```bash
npm run db:studio
```

**Create a new migration:**
```bash
npx prisma migrate dev --name your_migration_name
```

**Reset database (deletes all data!):**
```bash
npm run db:reset
```

### Adding New Features

1. Update database schema in `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev`
3. Generate Prisma client: `npx prisma generate`
4. Create API routes in `app/api/`
5. Create UI components in `components/`
6. Create pages in `app/`

## 🧪 Sample Data

The seed script creates 5 universities:

1. **MIT** (Reach, Applied) - Computer Science
2. **Stanford** (Reach, Applied) - Computer Science
3. **University of Washington** (Target, Accepted) - Computer Science
4. **Georgia Tech** (Target, Considering) - Computer Science
5. **Purdue** (Safety, Accepted) - Computer Science

Each includes requirements, deadlines, and financial information.

## 🔒 Data Privacy

- All data is stored locally (SQLite) or in your database
- No external analytics or tracking
- University search APIs used:
  - College Scorecard: Official US government data
  - Hipolabs: Public university information

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - feel free to use this for your university applications!

## 🆘 Troubleshooting

### Port 3000 already in use
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
# Or use a different port
PORT=3001 npm run dev
```

### Database issues
```bash
# Reset everything
npm run db:reset
# Or manually delete and recreate
rm prisma/dev.db
npx prisma migrate dev
npx prisma db seed
```

### Module not found errors
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

- **Issues**: Open a GitHub issue
- **Questions**: Check existing issues first
- **Feature Requests**: Open an issue with the "enhancement" label

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- University data from [College Scorecard](https://collegescorecard.ed.gov/) and [Hipolabs](http://universities.hipolabs.com/)

---

**Made for students, by students** 🎓

Happy applying! 🚀
