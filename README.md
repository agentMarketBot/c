# Countdown App

A modern countdown timer application built with Vite and Supabase that allows users to create, manage, and track multiple countdown timers with persistent storage.

## Features

- ⏰ Real-time countdown timers with days, hours, minutes, and seconds
- 💾 Persistent storage using Supabase database
- ➕ Add multiple countdown timers
- 🗑️ Delete countdown timers
- 📱 Responsive design
- 🎨 Modern dark theme UI

## Setup

### Prerequisites

- Node.js (v18 or higher)
- A Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file based on `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Fill in your Supabase credentials in the `.env` file

4. Run the database migration:
   - In your Supabase dashboard, go to the SQL Editor
   - Run the migration file: `supabase/migrations/20250106000001_create_countdowns_table.sql`

### Development

Start the development server:
```bash
npm run dev
```

### Build

Build for production:
```bash
npm run build
```

## Database Schema

The app uses a single `countdowns` table with the following structure:

- `id` (BIGSERIAL PRIMARY KEY)
- `title` (TEXT NOT NULL) - The name/title of the countdown
- `target_date` (TIMESTAMPTZ NOT NULL) - The target date and time
- `created_at` (TIMESTAMPTZ DEFAULT NOW()) - When the countdown was created

## Usage

1. Enter a title for your countdown
2. Select the target date and time
3. Click "Add Countdown" to save it
4. Watch your countdowns tick down in real-time
5. Delete countdowns using the × button

## Technologies Used

- **Vite** - Fast build tool and development server
- **Supabase** - Backend-as-a-Service for database and real-time features
- **Vanilla JavaScript** - Pure JavaScript with ES6+ features
- **CSS3** - Modern styling with flexbox and CSS variables