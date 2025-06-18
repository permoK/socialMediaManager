import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-server'
import { YouTubeAPIClient } from '@/lib/youtube-api'
import { format, subDays } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') || format(subDays(new Date(), 30), 'yyyy-MM-dd')
    const endDate = searchParams.get('endDate') || format(new Date(), 'yyyy-MM-dd')
    const metrics = searchParams.get('metrics')?.split(',') || [
      'views',
      'watchTimeMinutes',
      'subscribersGained',
      'subscribersLost'
    ]
    
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

    // Get channel info to get channel ID
    const channelInfo = await youtubeClient.getChannelInfo()
    if (!channelInfo) {
      return NextResponse.json(
        { error: 'No channel found' },
        { status: 404 }
      )
    }

    // Get analytics data
    let analyticsData = []
    try {
      analyticsData = await youtubeClient.getAnalyticsData(
        channelInfo.id,
        startDate,
        endDate,
        metrics
      )
    } catch (error: any) {
      if (error.response?.status === 403) {
        // Analytics not available for this channel (common for new/small channels)
        console.warn('YouTube Analytics not available for channel:', channelInfo.id)
        return NextResponse.json({
          data: [],
          message: 'Analytics not available for this channel'
        })
      }
      throw error // Re-throw other errors
    }
    
    // Store analytics data in database
    if (analyticsData.length > 0) {
      const analyticsRecords = analyticsData.map(data => ({
        user_id: session.user.id,
        channel_id: channelInfo.id,
        date: data.date,
        views: data.views || 0,
        watch_time_minutes: data.watchTimeMinutes || 0,
        subscribers_gained: data.subscribersGained || 0,
        subscribers_lost: data.subscribersLost || 0,
        likes: data.likes || 0,
        comments: data.comments || 0,
        shares: data.shares || 0,
        estimated_revenue: data.estimatedRevenue || 0,
      }))

      const { error: insertError } = await supabase
        .from('youtube_analytics')
        .upsert(analyticsRecords, { onConflict: 'user_id,channel_id,date' })

      if (insertError) {
        console.error('Error storing analytics data:', insertError)
      }
    }

    return NextResponse.json({ 
      data: analyticsData,
      startDate,
      endDate,
      metrics 
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
