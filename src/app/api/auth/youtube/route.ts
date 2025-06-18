import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-server'
import { YouTubeAuth } from '@/lib/youtube-auth'

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

    const youtubeAuth = new YouTubeAuth()
    
    // Generate state parameter to prevent CSRF attacks
    const state = session.user.id
    
    // Get the authorization URL
    const authUrl = youtubeAuth.getAuthUrl(state)
    
    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('Error generating YouTube auth URL:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
