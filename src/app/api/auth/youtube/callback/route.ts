import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-server'
import { YouTubeAuth } from '@/lib/youtube-auth'
import { YouTubeAPIClient } from '@/lib/youtube-api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      const errorDescription = searchParams.get('error_description') || 'Unknown error'
      console.error('YouTube OAuth error:', error, errorDescription)
      return NextResponse.redirect(
        new URL(`/dashboard?error=${encodeURIComponent(errorDescription)}`, request.url)
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/dashboard?error=Missing authorization code or state', request.url)
      )
    }

    const supabase = await createServerComponentClient()

    // Verify the state parameter matches the user ID
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session || session.user.id !== state) {
      return NextResponse.redirect(
        new URL('/dashboard?error=Invalid session or state mismatch', request.url)
      )
    }

    const youtubeAuth = new YouTubeAuth()
    
    try {
      // Exchange code for tokens
      const tokens = await youtubeAuth.exchangeCodeForTokens(code)
      
      // Store tokens in database
      await youtubeAuth.storeTokens(session.user.id, tokens)
      
      // Fetch and store channel information
      const youtubeClient = new YouTubeAPIClient(session.user.id)
      const channelInfo = await youtubeClient.getChannelInfo()
      
      if (channelInfo) {
        // Store channel information in database
        const { error: channelError } = await supabase
          .from('youtube_channels')
          .upsert({
            user_id: session.user.id,
            channel_id: channelInfo.id,
            channel_title: channelInfo.title,
            channel_description: channelInfo.description,
            thumbnail_url: channelInfo.thumbnails.high?.url || channelInfo.thumbnails.medium?.url,
            subscriber_count: parseInt(channelInfo.statistics.subscriberCount) || 0,
            video_count: parseInt(channelInfo.statistics.videoCount) || 0,
            view_count: parseInt(channelInfo.statistics.viewCount) || 0,
          })

        if (channelError) {
          console.error('Error storing channel info:', channelError)
        }
      }
      
      // Redirect to dashboard with success message
      return NextResponse.redirect(
        new URL('/dashboard?success=YouTube account connected successfully', request.url)
      )
    } catch (tokenError) {
      console.error('Error exchanging code for tokens:', tokenError)
      return NextResponse.redirect(
        new URL('/dashboard?error=Failed to connect YouTube account', request.url)
      )
    }
  } catch (error) {
    console.error('Error in YouTube callback:', error)
    return NextResponse.redirect(
      new URL('/dashboard?error=Internal server error', request.url)
    )
  }
}
