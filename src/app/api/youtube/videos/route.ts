import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-server'
import { YouTubeAPIClient } from '@/lib/youtube-api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const maxResults = parseInt(searchParams.get('maxResults') || '25')
    const pageToken = searchParams.get('pageToken') || undefined

    const supabase = await createServerComponentClient()

    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const youtubeClient = new YouTubeAPIClient(user.id)
    
    // Check if user has valid YouTube access
    const hasAccess = await youtubeClient.hasValidAccess()
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'YouTube account not connected' },
        { status: 403 }
      )
    }

    // Get videos
    const result = await youtubeClient.getChannelVideos(undefined, maxResults, pageToken)
    
    // Store/update video information in database
    if (result.videos.length > 0) {
      const videoData = result.videos.map(video => ({
        user_id: user.id,
        video_id: video.id,
        title: video.title,
        description: video.description,
        thumbnail_url: video.thumbnails.high?.url || video.thumbnails.medium?.url,
        published_at: video.publishedAt,
        duration: video.duration,
        view_count: parseInt(video.statistics.viewCount) || 0,
        like_count: parseInt(video.statistics.likeCount) || 0,
        comment_count: parseInt(video.statistics.commentCount) || 0,
      }))

      const { error: insertError } = await supabase
        .from('youtube_videos')
        .upsert(videoData, { onConflict: 'user_id,video_id' })

      if (insertError) {
        // Only log if it's not a duplicate key constraint (which is expected)
        if (insertError.code !== '23505') {
          console.error('Error storing video data:', insertError)
        }
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
