# ProSpend — Expense Tracker (Next.js 14 + TypeScript + Tailwind)

A modern, professional expense tracking app with localStorage persistence, filtering, analytics, and CSV export.

## Features
- Add, edit, delete expenses (date, amount, category, description)
- Filter by date range, category, and keyword
- Dashboard with summary cards and charts (Recharts)
- Currency formatting via `Intl.NumberFormat`
- Form validation with Zod
- CSV export (filtered or all data)
- Local persistence via `localStorage`
- Responsive, modern UI (Tailwind CSS)

## Tech
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- Zod

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn
   ```

2. **Run in development**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

3. **Build & start**
   ```bash
   npm run build
   npm start
   ```

## Testing Features
- Add a few expenses using the **Add Expense** form
- Use **Filters** (date range, category, search) and see the list & charts update
- Use **Edit** and **Delete** in the table
- Click **Export CSV** to download the current (filtered) view
- Reload the page — your data persists via localStorage

## Notes
- Dates use the native HTML date input for simplicity and broad support.
- Amounts are stored as integer cents to avoid floating-point rounding issues.
- Colors/styles are defined in Tailwind and `app/globals.css`.

## Project Structure
- `app/` — App Router pages
- `components/` — UI and state provider
- `lib/` — types, utilities, storage, analytics
- `public/` — static assets
