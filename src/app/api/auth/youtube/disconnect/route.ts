import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-server'
import { YouTubeAuth } from '@/lib/youtube-auth'

export async function POST(request: NextRequest) {
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

    const youtubeAuth = new YouTubeAuth()
    
    // Remove stored tokens
    await youtubeAuth.removeTokens(session.user.id)
    
    return NextResponse.json({ 
      success: true,
      message: 'YouTube account disconnected successfully' 
    })
  } catch (error) {
    console.error('Error disconnecting YouTube:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
