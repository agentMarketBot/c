# Countdown App

A modern, responsive countdown timer application built with Vite and Supabase that allows users to create, manage, and track multiple countdown timers.

## Features

- ✨ Create multiple countdown timers with custom titles and descriptions
- ⏰ Real-time countdown display (days, hours, minutes, seconds)
- 🗄️ Persistent storage using Supabase database
- 💾 Local storage fallback when Supabase isn't configured
- 🎨 Modern, responsive dark/light mode UI
- 🗑️ Delete countdowns when no longer needed
- 🔄 Automatic timer updates every second
- 📱 Mobile-friendly responsive design

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- A Supabase account (optional - app works with localStorage fallback)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd countdown-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure Supabase (optional):
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

## Supabase Setup

### Option 1: Use with Supabase (Recommended)

1. Create a new project at [Supabase](https://supabase.com)
2. Run the migration file in your Supabase SQL editor:
   - Copy the contents of `supabase/migrations/20250805_create_countdowns_table.sql`
   - Paste and execute in your Supabase SQL editor
3. Get your project credentials from Settings > API
4. Copy `.env.example` to `.env` and add your credentials

### Option 2: Use with Local Storage

The app automatically falls back to localStorage if Supabase isn't configured. This is perfect for testing and development.

## Database Schema

The app uses a simple `countdowns` table:

```sql
CREATE TABLE countdowns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Usage

1. **Create a Countdown**: Fill in the form with a title, target date/time, and optional description
2. **View Countdowns**: All active countdowns are displayed with real-time updates
3. **Delete Countdowns**: Click the × button to remove countdowns you no longer need
4. **Expired Countdowns**: Timers that have reached zero display "Time's up!" with visual indicators

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run linter (if configured)

### Project Structure

```
├── src/
│   ├── main.js          # Application entry point
│   ├── countdown.js     # Main countdown app logic
│   ├── supabase.js      # Supabase client and database operations
│   └── style.css        # Application styles
├── supabase/
│   ├── migrations/      # Database migration files
│   └── config.toml      # Supabase configuration
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## Technologies Used

- **Vite** - Fast build tool and development server
- **Vanilla JavaScript** - No framework dependencies for simplicity
- **Supabase** - Backend-as-a-Service for database and real-time features
- **CSS3** - Modern styling with animations and transitions

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Create a Pull Request

## License

This project is open source and available under the MIT License.
