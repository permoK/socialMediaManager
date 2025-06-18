# YouTube Analytics Dashboard

A comprehensive YouTube analytics dashboard built with Next.js, Supabase, and Google OAuth 2.0. Track your YouTube channel's performance, view detailed analytics, and monitor your growth over time.

## Features

- 🔐 **Dual Authentication System**
  - Supabase email/password authentication for app access
  - Google OAuth 2.0 for YouTube data access

- 📊 **Comprehensive Analytics**
  - Channel statistics and subscriber count
  - Video performance metrics
  - Watch time and engagement analytics
  - Views over time charts
  - Subscriber growth tracking

- 🎨 **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Interactive charts with Recharts
  - Smooth animations with Framer Motion
  - Clean, professional interface

- 🔄 **Real-time Data**
  - Automatic token refresh
  - Data caching and optimization
  - Error handling and loading states

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Charts**: Recharts
- **Authentication**: Supabase Auth + Google OAuth 2.0
- **Database**: Supabase (PostgreSQL)
- **APIs**: YouTube Data API v3, YouTube Analytics API

## Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Supabase account** and project
4. **Google Cloud Console** project with YouTube APIs enabled
5. **YouTube channel** for testing

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd youtube-analytics-dashboard
npm install
```

### 2. Environment Configuration

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

Update `.env.local` with your actual values:

```env
# YouTube OAuth Configuration
NEXT_PUBLIC_YOUTUBE_CLIENT_ID=your_youtube_client_id_here
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret_here
NEXT_PUBLIC_YOUTUBE_REDIRECT_URI=http://localhost:3000/api/auth/youtube/callback

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_URI=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# YouTube API Configuration
YOUTUBE_API_KEY=your_youtube_api_key_here

# Application Configuration
NODE_ENV=development
```

### 3. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - YouTube Data API v3
   - YouTube Analytics API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/youtube/callback`
5. Copy the Client ID and Client Secret to your `.env.local`

### 4. Supabase Setup

1. Create a new Supabase project
2. Go to Settings > API to get your URL and anon key
3. Run the database schema:
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the script

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### 1. Create Account
- Visit the application and click "Get Started"
- Sign up with email/password or use magic link
- Verify your email if required

### 2. Connect YouTube
- After logging in, you'll see the dashboard
- Click "Connect YouTube Account"
- Authorize the application to access your YouTube data
- Grant permissions for analytics and channel data

### 3. View Analytics
- Once connected, your dashboard will display:
  - Channel overview with subscriber count, views, and videos
  - KPI cards showing recent performance
  - Charts for views over time and subscriber growth
  - List of recent videos with performance metrics

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── youtube/       # YouTube data endpoints
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Dashboard page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── charts/            # Chart components
│   ├── dashboard/         # Dashboard components
│   ├── layout/            # Layout components
│   └── ui/                # UI components
├── contexts/              # React contexts
├── hooks/                 # Custom hooks
└── lib/                   # Utility libraries
    ├── supabase.ts        # Supabase client config
    ├── supabase-server.ts # Supabase server config
    ├── youtube-auth.ts    # YouTube OAuth logic
    ├── youtube-api.ts     # YouTube API client
    └── utils.ts           # Utility functions
```

## API Endpoints

- `GET /api/auth/youtube` - Get YouTube OAuth URL
- `GET /api/auth/youtube/callback` - Handle OAuth callback
- `GET /api/youtube/channel` - Get channel information
- `GET /api/youtube/videos` - Get channel videos
- `GET /api/youtube/analytics` - Get analytics data

## Database Schema

The application uses the following main tables:

- `profiles` - User profile information
- `youtube_tokens` - OAuth tokens for YouTube access
- `youtube_channels` - Channel information and statistics
- `youtube_analytics` - Daily analytics data
- `youtube_videos` - Video information and metrics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.
# socialMediaManager
