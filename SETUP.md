# Countdown App Setup Guide

## Overview
This is a modern countdown application built with Vite and Supabase. Users can create multiple countdowns for different events and view them in real-time.

## Features
- ✅ Create multiple countdown timers
- ✅ Real-time countdown updates
- ✅ Persistent storage with Supabase
- ✅ Responsive design
- ✅ Beautiful glassmorphism UI
- ✅ Delete countdowns

## Prerequisites
- Node.js (v18 or higher)
- A Supabase account and project

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Supabase Configuration
1. Create a new project at [Supabase](https://supabase.com)
2. Go to your project settings and copy:
   - Project URL
   - Anon/Public Key

3. Update `supabase-config.js`:
```javascript
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
```

### 3. Database Setup
Run the migration file `migrations/001_create_countdowns_table.sql` in your Supabase SQL editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `migrations/001_create_countdowns_table.sql`
4. Run the query

This will create:
- `countdowns` table with proper schema
- Row Level Security (RLS) policies
- Automatic timestamp updates
- Helper functions

### 4. Development
Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 5. Production Build
```bash
npm run build
npm run preview
```

## Database Schema

### Countdowns Table
```sql
countdowns (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    target_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

## Security Features
- Row Level Security (RLS) enabled
- SQL injection protection via Supabase client
- Input sanitization for XSS prevention
- Proper error handling

## Troubleshooting

### Common Issues

1. **"Failed to connect to database"**
   - Check your Supabase URL and API key in `supabase-config.js`
   - Ensure your Supabase project is active

2. **"Failed to load countdowns"**
   - Make sure the database migration has been run
   - Check RLS policies in Supabase dashboard

3. **Countdown not updating**
   - Check browser console for JavaScript errors
   - Ensure target date is in the future

### Environment Variables (Optional)
For better security in production, you can use environment variables:

Create a `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then update `supabase-config.js`:
```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_FALLBACK_URL'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_FALLBACK_KEY'
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
MIT License - see LICENSE file for details