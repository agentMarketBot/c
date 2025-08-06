# 🕰️ Countdown App

A beautiful, responsive countdown application built with Vite and Supabase that allows users to create, track, and manage multiple countdowns with real-time updates.

## Features

- ✨ **Create Multiple Countdowns**: Add unlimited countdowns with custom titles and descriptions
- ⏰ **Real-time Updates**: Live countdown displays that update every second
- 💾 **Database Storage**: All countdowns are stored in Supabase with real-time synchronization
- 📱 **Responsive Design**: Beautiful UI that works on desktop and mobile devices
- 🌙 **Dark/Light Mode**: Automatic theme switching based on system preferences
- 🔄 **Real-time Sync**: Changes are synchronized across all browser tabs/devices
- 🎉 **Completion Animations**: Special effects when countdowns reach zero

## Tech Stack

- **Frontend**: Vanilla JavaScript, Vite, CSS3
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime subscriptions
- **Styling**: CSS Grid, Flexbox, Glassmorphism effects

## Prerequisites

- Node.js (v18 or higher)
- A Supabase account and project

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd countdown-app
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project's SQL editor and run the migration file:
   ```sql
   -- Copy and paste the contents of migrations/001_create_countdowns.sql
   ```
3. Get your project URL and anon key from Settings > API

### 3. Environment Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 4. Run the Application

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

## Database Schema

The app uses a single `countdowns` table with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| title | VARCHAR(255) | Countdown title |
| description | TEXT | Optional description |
| target_date | TIMESTAMPTZ | Target date and time |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |
| is_active | BOOLEAN | Soft delete flag |

## Row Level Security (RLS)

The application uses Supabase's RLS with policies that allow:
- Public read access to all countdowns
- Public insert, update, and delete operations
- Real-time subscriptions

*Note: In a production environment, you should implement proper authentication and restrict access based on user roles.*

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features in Detail

### Creating Countdowns
- Fill out the form with title, optional description, and target date/time
- Target date must be in the future
- Form validates input and shows success/error notifications

### Managing Countdowns
- View all active countdowns in a responsive grid layout
- Each countdown shows live time remaining in days, hours, minutes, and seconds
- Delete countdowns with confirmation dialog
- Automatic cleanup when countdowns reach zero

### Real-time Updates
- Countdown timers update every second
- Database changes sync instantly across all connected clients
- Special animation when countdown reaches zero

## Customization

### Styling
Edit `src/style.css` to customize:
- Color schemes and gradients
- Layout and spacing
- Animations and transitions
- Responsive breakpoints

### Functionality
Modify `src/main.js` to add:
- Additional countdown formats
- Sound notifications
- Email alerts
- Custom completion actions

## Deployment

### Build for Production
```bash
npm run build
```

The `dist` folder contains the production-ready files that can be deployed to any static hosting service.

### Environment Variables for Production
Make sure to set the following environment variables in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Security Considerations

- The current implementation allows public access to all countdowns
- For production use, implement proper authentication
- Consider rate limiting for database operations
- Validate all inputs on both client and server side

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.