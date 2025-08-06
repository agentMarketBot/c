# 🎯 Countdown App

A beautiful, modern countdown application built with React and Vite, featuring real-time countdowns and persistent storage with Supabase.

## Features

- ✨ **Beautiful UI**: Modern gradient design with glassmorphism effects
- ⏰ **Real-time Countdowns**: Live updates every second
- 💾 **Persistent Storage**: Save countdowns to Supabase database
- 🔐 **User Authentication**: Secure login/signup with Supabase Auth
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🗑️ **Easy Management**: Create, view, and delete countdowns
- 🎉 **Expiration Detection**: Visual indicators when countdowns expire

## Tech Stack

- **Frontend**: React 18 + Vite
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Modern CSS with custom properties
- **Deployment**: Ready for Vercel, Netlify, or any static host

## Quick Start

### Prerequisites

- Node.js 18+ (recommended)
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd countdown-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   
   Run the migration file in your Supabase SQL editor:
   ```sql
   -- Copy and paste the contents of supabase/migrations/20250101000000_create_countdowns_table.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## Database Schema

The app uses a single `countdowns` table with the following structure:

```sql
CREATE TABLE countdowns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true
);
```

### Security Features

- **Row Level Security (RLS)**: Users can only access their own countdowns
- **Authentication Required**: All operations require valid user session
- **Secure Policies**: CRUD operations restricted to countdown owners

## Usage

1. **Sign Up/Sign In**: Create an account or sign in to an existing one
2. **Create Countdown**: Fill in the title, target date, and optional description
3. **Watch the Magic**: Your countdowns update in real-time showing days, hours, minutes, and seconds remaining
4. **Manage Countdowns**: Delete countdowns you no longer need
5. **Visual Feedback**: Expired countdowns are highlighted with special styling

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/
│   ├── Auth.jsx              # Authentication component
│   ├── CountdownForm.jsx     # Form to create new countdowns
│   ├── CountdownList.jsx     # List container for countdowns
│   ├── CountdownItem.jsx     # Individual countdown card
│   └── *.css                 # Component-specific styles
├── lib/
│   └── supabase.js          # Supabase client configuration
├── App.jsx                  # Main application component
├── App.css                  # Global application styles
├── index.css               # Base CSS styles
└── main.jsx                # Application entry point
```

## Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Environment Variables for Production

Make sure to set these environment variables in your hosting platform:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Deployment Platforms

This app can be deployed to:

- **Vercel**: Connect your GitHub repo and deploy automatically
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **Any static hosting**: Upload the `dist` folder contents

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

Made with ❤️ using React, Vite, and Supabase