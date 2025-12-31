# Financial Ledger System

A modern, enterprise-grade financial ledger and wallet management system built with Next.js. This application provides a complete solution for managing financial transactions with a focus on correctness, auditability, and resilience.

> **Note**: This project evolved from a frontend assessment test at Mainstack into a comprehensive financial ledger system. See the [About This Project](#about-this-project) section for details on the evolution.

## About This Project

This project **started as a frontend assessment test at Mainstack** and has been evolved into a comprehensive, production-ready financial ledger system. What began as a simple transaction management dashboard has been transformed into a full-featured application that demonstrates building a financial system without relying on external payment processors.

### Project Evolution

**Original Assessment (Initial State)**

- Basic transaction dashboard with filtering capabilities
- Simple transaction list and balance display
- Frontend-focused implementation

**Current State (Enhanced)**

- Complete financial ledger system with PostgreSQL backend
- Multi-currency wallet management
- Transaction lifecycle management with status transitions
- Comprehensive audit logging
- Transaction flow visualization
- Idempotency and error handling
- Real-world payment processing simulation
- Production-ready deployment configuration

This evolution showcases how a simple assessment project can be expanded into a robust, enterprise-grade application with proper architecture, database design, and real-world financial system patterns.

### Why We Built This

The goal was to create a financial ledger system that:

- **Ensures Correctness**: All balances are derived from transaction history, preventing discrepancies and ensuring data integrity
- **Provides Auditability**: Complete audit trails for all operations, making it easy to trace any transaction or system action
- **Maintains Resilience**: Built-in idempotency, transaction reversals, and proper error handling
- **Simulates Real-World Scenarios**: Mimics payment processing workflows with status transitions (pending → processing → successful/failed) without requiring external payment processors

### What It Achieves

This system demonstrates how to build a financial application that:

1. **Manages Multi-Currency Wallets**: Support for multiple currencies with proper decimal handling and currency-specific formatting
2. **Tracks Transaction Lifecycles**: Full support for transaction states (pending, processing, successful, failed, reversed)
3. **Calculates Balances Accurately**: Ledger balance and available balance are calculated from transaction history, not stored values
4. **Prevents Duplicate Transactions**: Idempotency keys ensure operations can be safely retried
5. **Provides Complete Audit Trails**: Every action is logged for compliance and debugging
6. **Visualizes Transaction Flows**: Interactive flow diagrams showing transaction processing steps
7. **Handles Manual Operations**: Support for manual credits and debits for testing and administrative purposes

## Features

### Core Functionality

- **Multi-Currency Wallet Management**

  - Support for multiple currencies (USD, NGN, EUR, GBP, etc.)
  - Currency-specific decimal precision handling
  - Real-time balance calculations (ledger balance and available balance)

- **Transaction Management**

  - Credit and debit operations
  - Withdrawal requests with VAT calculation
  - Manual credit/debit for administrative purposes
  - Transaction reversals
  - Idempotent transaction creation

- **Transaction Lifecycle**

  - Status tracking: pending → processing → successful/failed
  - Asynchronous status updates (simulating payment processor delays)
  - Transaction flow visualization with React Flow

- **Balance Tracking**

  - Ledger balance: All successful credits minus all successful debits
  - Available balance: Ledger balance minus pending debits
  - Real-time balance charts showing transaction history
  - Multi-currency balance support

- **Audit & Compliance**

  - Comprehensive audit logging for all operations
  - Immutable transaction records
  - Complete transaction history with metadata

- **User Interface**
  - Modern, responsive dashboard
  - Advanced filtering (date range, type, status, currency)
  - Transaction detail modals with flow visualization
  - Real-time balance charts
  - Landing page with feature showcase

### Technical Features

- **Authentication**: User registration and login with session management
- **Database**: PostgreSQL with proper schema design and migrations
- **API Routes**: RESTful API for all operations
- **Data Validation**: Zod schemas for runtime type checking
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **State Management**: Zustand for global state, TanStack Query for server state

## Tech Stack

The technology stack was chosen for convenience, out-of-the-box tooling, optimization techniques, and ease of development to meet project deadlines.

### Core Technologies

- **Next.js 15.2.6** - React framework for production

  - App Router for better performance and SEO
  - Server Components and API Routes
  - Built-in optimizations

- **TypeScript** - For type safety and better developer experience

  - Ensures code reliability and maintainability
  - Provides better IDE support and autocompletion
  - Runtime validation with Zod

- **PostgreSQL** - Relational database
  - Proper schema design with foreign keys and constraints
  - Migration system for version control
  - Serverless-optimized connection pooling

### State Management

- **Zustand** - Lightweight state management solution
  - Simple and intuitive API
  - Minimal boilerplate compared to Redux
  - Perfect for managing global application state (currency selection, UI state)
  - Built-in TypeScript support

### Data Fetching

- **TanStack Query (React Query)** - Data fetching and caching
  - Automatic background data updates
  - Built-in caching and invalidation
  - Optimistic updates for better UX
  - Automatic retry logic

### Styling

- **Tailwind CSS** - Utility-first CSS framework

  - Rapid UI development
  - Consistent design system
  - Zero-runtime CSS
  - Highly customizable

- **shadcn/ui** - Reusable components built with Radix UI
  - Accessible by default
  - Customizable and themeable
  - Built on top of Tailwind CSS
  - Copy-paste components for faster development

### Additional Libraries

- **React Flow** - For transaction flow visualization
- **date-fns** - Date formatting and manipulation
- **Zod** - Schema validation
- **pg** - PostgreSQL client for Node.js

## Project Structure

```
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── transactions/         # Transaction endpoints
│   │   ├── wallets/              # Wallet endpoints
│   │   └── audit/                # Audit log endpoints
│   ├── dashboard/               # Dashboard pages
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── balance-chart/       # Balance chart components
│   │   ├── transaction-flow.tsx # Transaction flow visualization
│   │   └── ...                   # Other dashboard components
│   ├── auth/                     # Authentication components
│   ├── landing/                  # Landing page components
│   └── ui/                       # Reusable UI components (shadcn/ui)
├── lib/                          # Utility functions and API calls
│   ├── db/                       # Database utilities
│   │   ├── migrations/          # Database migrations
│   │   └── queries/              # Database query functions
│   ├── api.ts                    # API client functions
│   ├── auth/                     # Authentication utilities
│   └── utils/                    # General utilities
├── store/                        # Zustand stores
│   └── currency-store.ts         # Currency selection store
└── public/                       # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon or Supabase recommended for deployment)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd mainstack
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and add your database connection string:

```env
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
NODE_ENV=development
```

4. Run database migrations:

```bash
npm run migrate
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Approach

This project was built with a focus on:

- **Clean and maintainable code**: Well-organized structure with clear separation of concerns
- **Type safety**: TypeScript throughout with runtime validation using Zod
- **Performance optimization**: Efficient data fetching, caching, and rendering
- **User experience**: Intuitive interface with real-time updates and clear feedback
- **Developer experience**: Easy to understand, modify, and extend

The combination of these technologies allows for rapid development while maintaining high standards of code quality and user experience.

## Deployment to Vercel

This project uses PostgreSQL and can be deployed to Vercel. Follow these steps:

### Prerequisites

1. A PostgreSQL database (choose one):
   - **Neon** (serverless PostgreSQL, recommended)
   - **Supabase** (PostgreSQL with additional features)

### Step 1: Set Up PostgreSQL Database

#### Option A: Neon (Recommended)

1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up or log in
3. Click **Create Project**
4. Choose a project name, region, and PostgreSQL version
5. Once created, go to your project dashboard
6. Navigate to **Connection Details**
7. Copy the connection string (it will look like: `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`)
8. **Important**: Make sure to copy the connection string that includes `?sslmode=require` for secure connections

#### Option B: Supabase

1. Go to [Supabase](https://supabase.com/)
2. Sign up or log in
3. Click **New Project**
4. Fill in your project details (name, database password, region)
5. Wait for the project to be created (takes a few minutes)
6. Once ready, go to **Project Settings** → **Database**
7. Scroll down to **Connection string** section
8. Select **URI** format
9. Copy the connection string (it will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`)
10. Replace `[YOUR-PASSWORD]` with your actual database password
11. Add `?sslmode=require` at the end if not already present

### Step 2: Configure Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:

   - **Name**: `DATABASE_URL`
   - **Value**: Your PostgreSQL connection string from Neon or Supabase
   - **Environment**: Select all (Production, Preview, Development)

4. Click **Save**

### Step 3: Run Database Migrations

You need to run migrations to set up your database schema. You have two options:

#### Option A: Run Migrations via Vercel Build Command (Recommended)

1. Go to **Settings** → **General** → **Build & Development Settings**
2. Update the **Build Command** to:
   ```bash
   npm run migrate:prod && npm run build
   ```
   **Note**: The `migrate:prod` script uses environment variables directly (no `--env-file` flag), which works perfectly with Vercel's automatic environment variable injection.
3. This will run migrations automatically on each deployment

#### Option B: Run Migrations Manually (One-time setup)

1. Install Vercel CLI if you haven't:

   ```bash
   npm i -g vercel
   ```

2. Pull environment variables:

   ```bash
   vercel env pull .env.local
   ```

3. Run migrations (this will connect to your production database):

   ```bash
   npm run migrate:prod
   ```

   **Note**: Use `migrate:prod` which reads from environment variables directly. The regular `migrate` command uses `--env-file=.env` for local development.

   **⚠️ Warning**: Make sure you're connecting to the correct database (production vs development) before running migrations.

#### Option C: Run Migrations via API Route (Alternative)

Create a one-time migration endpoint (remove after use for security):

```typescript
// app/api/migrate/route.ts
import { runMigrations } from '@/lib/db/migrations/migrate';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Add authentication/authorization check here
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.MIGRATION_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await runMigrations();
    return NextResponse.json({ message: 'Migrations completed' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Migration failed', details: error },
      { status: 500 }
    );
  }
}
```

Then call it once:

```bash
curl -X POST https://your-app.vercel.app/api/migrate \
  -H "Authorization: Bearer YOUR_MIGRATION_SECRET"
```

### Step 4: Deploy to Vercel

1. **If deploying via Git**:

   - Push your code to GitHub/GitLab/Bitbucket
   - Connect your repository to Vercel
   - Vercel will automatically deploy on push

2. **If deploying via CLI**:
   ```bash
   vercel --prod
   ```

### Step 5: Verify Deployment

1. Visit your deployed URL
2. Test the database connection by visiting `/api` (if you have a health check endpoint)
3. Try registering a new user to verify database writes work

### Troubleshooting

#### Database Connection Issues

- **Error**: "Database connection failed"
  - Verify `DATABASE_URL` is set correctly in Vercel
  - Check if your database allows connections from Vercel's IP ranges
  - For external databases, ensure SSL is enabled (`?sslmode=require`)

#### Migration Issues

- **Error**: "Migration already applied"

  - This is normal if migrations were run before
  - The migration system is idempotent and will skip already-applied migrations

- **Error**: "Cannot find migration files"
  - Ensure migration files are committed to your repository
  - Check that the build command has access to the `lib/db/migrations` directory

#### Build Failures

- If build fails during migration:
  - Run migrations manually first (Option B or C above)
  - Then remove the migration step from build command
  - Or fix the migration script to handle errors gracefully

### Environment Variables Summary

| Variable       | Description                          | Required |
| -------------- | ------------------------------------ | -------- |
| `DATABASE_URL` | PostgreSQL connection string         | Yes      |
| `NODE_ENV`     | Environment (production/development) | Optional |

### Database Connection Pool Configuration

The project is already configured for serverless environments:

- `max: 1` connection per pool (important for Vercel serverless functions)
- Connection timeout: 2 seconds
- Idle timeout: 30 seconds

This configuration prevents connection pool exhaustion in serverless environments.

## Improvements

These are some of the improvements that could be made to the project if not constrained by time:

### Component Architecture

- **Custom Icon Components**
  - Create a dedicated `components/icons` directory
  - Implement reusable icon components using figma assets
  - Add proper TypeScript types and props

### Code Organization

- **Component Breakdown**
  - Split large components into smaller, focused components
  - Create separate files for types and constants
  - Better organization of related components

### Performance Optimizations

- **Memoization**

  - Use `useMemo` for expensive computations
  - Implement `useCallback` for event handlers
  - Add `React.memo` for pure components

- **Code Splitting**
  - Implement dynamic imports for large components
  - Use Next.js dynamic imports for route-based code splitting
  - Lazy load components that are not immediately needed

### Type Safety

- **Shared Types**
  - Create a dedicated `types` directory
  - Use Zod for runtime type validation (partially implemented)

### Accessibility

- **ARIA Labels**
  - Add proper ARIA labels to interactive elements
  - Implement keyboard navigation for the Navbar
  - Ensure proper color contrast

### State Management

- **Store Organization**
  - Split Zustand stores by feature
  - Implement proper TypeScript types for store actions
  - Add middleware for logging and persistence

### Error Handling

- **Error Boundaries**
  - Implement React Error Boundaries
  - Add proper error states for components
  - Create reusable error components

### Documentation

- **Component Documentation**
  - Add JSDoc comments for complex functions
  - Document prop types and usage examples

These improvements would enhance the codebase's maintainability, performance, and developer experience while following React and TypeScript best practices.

## License

This project originated as a frontend assessment test at Mainstack and has been expanded into a comprehensive financial ledger system. It is maintained for demonstration and educational purposes, showcasing the evolution from a simple assessment project to a production-ready application.
