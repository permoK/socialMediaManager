import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

// Browser client for client components
export const createClientComponentClient = () => {
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!)
}

// Database types
export interface Profile {
  id: string
  email?: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface YouTubeToken {
  id: string
  user_id: string
  access_token: string
  refresh_token?: string
  expires_at: string
  scope?: string
  token_type: string
  created_at: string
  updated_at: string
}

export interface YouTubeChannel {
  id: string
  user_id: string
  channel_id: string
  channel_title: string
  channel_description?: string
  thumbnail_url?: string
  subscriber_count: number
  video_count: number
  view_count: number
  created_at: string
  updated_at: string
}

export interface YouTubeAnalytics {
  id: string
  user_id: string
  channel_id: string
  date: string
  views: number
  watch_time_minutes: number
  subscribers_gained: number
  subscribers_lost: number
  likes: number
  comments: number
  shares: number
  estimated_revenue: number
  created_at: string
  updated_at: string
}

export interface YouTubeVideo {
  id: string
  user_id: string
  channel_id: string
  video_id: string
  title: string
  description?: string
  thumbnail_url?: string
  published_at?: string
  duration?: string
  view_count: number
  like_count: number
  comment_count: number
  created_at: string
  updated_at: string
}
