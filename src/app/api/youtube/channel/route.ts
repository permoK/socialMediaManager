import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-server'
import { YouTubeAPIClient } from '@/lib/youtube-api'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient()

    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const youtubeClient = new YouTubeAPIClient(session.user.id)
    
    // Check if user has valid YouTube access
    const hasAccess = await youtubeClient.hasValidAccess()
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'YouTube account not connected' },
        { status: 403 }
      )
    }

    // Get channel information
    const channelInfo = await youtubeClient.getChannelInfo()
    
    if (!channelInfo) {
      return NextResponse.json(
        { error: 'No channel found' },
        { status: 404 }
      )
    }

    // Update channel info in database
    const { error: updateError } = await supabase
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

    if (updateError) {
      console.error('Error updating channel info:', updateError)
    }

    return NextResponse.json({ channel: channelInfo })
  } catch (error) {
    console.error('Error fetching channel info:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
