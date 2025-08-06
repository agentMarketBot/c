# Countdown App

A simple countdown timer application that stores countdown events in a Supabase database.

## Features

- Create multiple countdown timers with custom titles
- Real-time countdown display (days, hours, minutes, seconds)
- Persistent storage using Supabase database
- Responsive design with dark/light mode support
- Delete countdowns when no longer needed

## Setup

### Prerequisites

- Node.js (v18 or higher)
- A Supabase account and project

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Update `supabase.js` with your credentials:
     ```javascript
     const supabaseUrl = 'YOUR_SUPABASE_URL'
     const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
     ```

4. Set up the database:
   - Go to your Supabase dashboard
   - Navigate to the SQL Editor
   - Run the migration script from `migrations/001_create_countdowns_table.sql`

5. Start the development server:
   ```bash
   npm run dev
   ```

## Database Schema

The app uses a single table called `countdowns` with the following structure:

- `id` (BIGSERIAL PRIMARY KEY) - Unique identifier
- `title` (TEXT NOT NULL) - The countdown title/name
- `target_date` (TIMESTAMPTZ NOT NULL) - The target date and time
- `created_at` (TIMESTAMPTZ DEFAULT NOW()) - When the countdown was created
- `updated_at` (TIMESTAMPTZ DEFAULT NOW()) - Last update timestamp

## Usage

1. Enter a title for your countdown
2. Select the target date and time
3. Click "Add Countdown" to save it
4. Watch your countdowns update in real-time
5. Delete countdowns when they're no longer needed

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Security Note

This demo uses public access policies for simplicity. In a production app, you should:
- Implement user authentication
- Restrict database access to authenticated users
- Use environment variables for Supabase credentials
- Implement proper error handling and validation