import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
    
    if (!apiKey || apiKey === 'your_actual_youtube_api_key_here') {
      return NextResponse.json(
        { 
          error: 'YouTube API key not configured',
          message: 'Please set YOUTUBE_API_KEY in your .env.local file',
          configured: false
        },
        { status: 400 }
      )
    }

    // Test the API key with a simple request
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: 'test',
        type: 'video',
        maxResults: 1,
        key: apiKey
      }
    })

    return NextResponse.json({
      success: true,
      message: 'YouTube API key is working correctly',
      configured: true,
      testResult: {
        status: response.status,
        itemsFound: response.data.items?.length || 0
      }
    })

  } catch (error: any) {
    console.error('YouTube API test error:', error)
    
    if (error.response?.status === 403) {
      return NextResponse.json(
        {
          error: 'YouTube API access forbidden',
          message: 'API key may be invalid or YouTube Data API v3 is not enabled',
          configured: false,
          details: error.response?.data
        },
        { status: 403 }
      )
    }

    return NextResponse.json(
      {
        error: 'YouTube API test failed',
        message: error.message,
        configured: false
      },
      { status: 500 }
    )
  }
}
