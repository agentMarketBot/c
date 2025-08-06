# Countdown App

A modern countdown application built with Vite and Supabase that allows users to create and track multiple countdowns.

## Features

- Create multiple named countdowns
- Real-time countdown display (days, hours, minutes, seconds)
- Persistent storage using Supabase database
- Responsive design with dark/light theme support
- Delete countdowns when no longer needed

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Supabase:
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run the migration file in your Supabase SQL editor:
     ```sql
     -- Copy and run the contents of supabase/migrations/001_create_countdowns_table.sql
     ```
   - Update `main.js` with your Supabase URL and anon key

3. Start development server:
   ```bash
   npm run dev
   ```

## Database Schema

The app uses a simple `countdowns` table with the following structure:

- `id`: UUID primary key
- `name`: Text name for the countdown
- `target_date`: Target date/time for the countdown
- `created_at`: When the countdown was created
- `updated_at`: When the countdown was last updated

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Production Deployment

1. Set up environment variables for Supabase credentials
2. Build the project: `npm run build`
3. Deploy the `dist` folder to your hosting provider

## Technologies Used

- Vite - Build tool and development server
- Supabase - Database and backend services
- Vanilla JavaScript - Frontend framework
- CSS3 - Styling with modern features