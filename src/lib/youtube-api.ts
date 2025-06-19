import axios, { AxiosInstance } from 'axios'
import { YouTubeAuth } from './youtube-auth'

export interface YouTubeChannelInfo {
  id: string
  title: string
  description: string
  thumbnails: {
    default: { url: string }
    medium: { url: string }
    high: { url: string }
  }
  statistics: {
    viewCount: string
    subscriberCount: string
    videoCount: string
  }
  brandingSettings?: {
    channel?: {
      title: string
      description: string
    }
  }
}

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnails: {
    default: { url: string }
    medium: { url: string }
    high: { url: string }
    standard?: { url: string }
    maxres?: { url: string }
  }
  publishedAt: string
  duration: string
  statistics: {
    viewCount: string
    likeCount: string
    commentCount: string
  }
}

export interface YouTubeAnalyticsData {
  date: string
  views: number
  watchTimeMinutes: number
  subscribersGained: number
  subscribersLost: number
  likes: number
  comments: number
  shares: number
  estimatedRevenue?: number
}

export interface YouTubeSearchResult {
  videos: YouTubeVideo[]
  nextPageToken?: string
  totalResults: number
}

export class YouTubeAPIClient {
  private api: AxiosInstance
  private auth: YouTubeAuth
  private userId: string

  constructor(userId: string) {
    this.userId = userId
    this.auth = new YouTubeAuth()

    this.api = axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3',
      timeout: 30000,
    })

    // Add request interceptor to include access token and API key
    this.api.interceptors.request.use(async (config) => {
      // Always include API key
      const apiKey = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
      if (apiKey) {
        config.params = { ...config.params, key: apiKey }
      }

      // Include access token for authenticated requests
      const accessToken = await this.auth.getValidAccessToken(this.userId)
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }

      return config
    })

    // Add response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token might be invalid, try to refresh
          const accessToken = await this.auth.getValidAccessToken(this.userId)
          if (accessToken) {
            // Retry the request with new token
            error.config.headers.Authorization = `Bearer ${accessToken}`
            return this.api.request(error.config)
          }
        }
        return Promise.reject(error)
      }
    )
  }

  /**
   * Get user's channel information
   */
  async getChannelInfo(): Promise<YouTubeChannelInfo | null> {
    try {
      const response = await this.api.get('/channels', {
        params: {
          part: 'snippet,statistics,brandingSettings',
          mine: true,
        },
      })

      const channels = response.data.items
      if (channels && channels.length > 0) {
        const channel = channels[0]
        return {
          id: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description,
          thumbnails: channel.snippet.thumbnails,
          statistics: channel.statistics,
          brandingSettings: channel.brandingSettings,
        }
      }

      return null
    } catch (error) {
      console.error('Error fetching channel info:', error)
      throw error
    }
  }

  /**
   * Get channel videos
   */
  async getChannelVideos(
    channelId?: string,
    maxResults: number = 50,
    pageToken?: string
  ): Promise<YouTubeSearchResult> {
    try {
      // First get the channel ID if not provided
      let targetChannelId = channelId
      if (!targetChannelId) {
        const channelInfo = await this.getChannelInfo()
        if (!channelInfo) {
          throw new Error('No channel found')
        }
        targetChannelId = channelInfo.id
      }

      // Search for videos in the channel
      const searchResponse = await this.api.get('/search', {
        params: {
          part: 'snippet',
          channelId: targetChannelId,
          type: 'video',
          order: 'date',
          maxResults,
          pageToken,
        },
      })

      const videoIds = searchResponse.data.items.map((item: any) => item.id.videoId)
      
      if (videoIds.length === 0) {
        return {
          videos: [],
          nextPageToken: searchResponse.data.nextPageToken,
          totalResults: searchResponse.data.pageInfo.totalResults,
        }
      }

      // Get detailed video information
      const videosResponse = await this.api.get('/videos', {
        params: {
          part: 'snippet,statistics,contentDetails',
          id: videoIds.join(','),
        },
      })

      const videos: YouTubeVideo[] = videosResponse.data.items.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnails: video.snippet.thumbnails,
        publishedAt: video.snippet.publishedAt,
        duration: video.contentDetails.duration,
        statistics: {
          viewCount: video.statistics.viewCount || '0',
          likeCount: video.statistics.likeCount || '0',
          commentCount: video.statistics.commentCount || '0',
        },
      }))

      return {
        videos,
        nextPageToken: searchResponse.data.nextPageToken,
        totalResults: searchResponse.data.pageInfo.totalResults,
      }
    } catch (error) {
      console.error('Error fetching channel videos:', error)
      throw error
    }
  }

  /**
   * Get video details by ID
   */
  async getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
    try {
      const response = await this.api.get('/videos', {
        params: {
          part: 'snippet,statistics,contentDetails',
          id: videoId,
        },
      })

      const videos = response.data.items
      if (videos && videos.length > 0) {
        const video = videos[0]
        return {
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnails: video.snippet.thumbnails,
          publishedAt: video.snippet.publishedAt,
          duration: video.contentDetails.duration,
          statistics: {
            viewCount: video.statistics.viewCount || '0',
            likeCount: video.statistics.likeCount || '0',
            commentCount: video.statistics.commentCount || '0',
          },
        }
      }

      return null
    } catch (error) {
      console.error('Error fetching video details:', error)
      throw error
    }
  }

  /**
   * Get analytics data using YouTube Analytics API
   */
  async getAnalyticsData(
    channelId: string,
    startDate: string,
    endDate: string,
    metrics: string[] = ['views', 'watchTimeMinutes', 'subscribersGained', 'subscribersLost']
  ): Promise<YouTubeAnalyticsData[]> {
    try {
      const analyticsApi = axios.create({
        baseURL: 'https://youtubeanalytics.googleapis.com/v2',
        timeout: 30000,
      })

      const accessToken = await this.auth.getValidAccessToken(this.userId)
      if (!accessToken) {
        throw new Error('No valid access token')
      }

      const response = await analyticsApi.get('/reports', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          ids: `channel==${channelId}`,
          startDate,
          endDate,
          metrics: metrics.join(','),
          dimensions: 'day',
          sort: 'day',
        },
      })

      const rows = response.data.rows || []
      const columnHeaders = response.data.columnHeaders || []

      return rows.map((row: any[]) => {
        const data: any = { date: row[0] }
        
        columnHeaders.forEach((header: any, index: number) => {
          if (header.name !== 'day') {
            switch (header.name) {
              case 'views':
                data.views = parseInt(row[index]) || 0
                break
              case 'watchTimeMinutes':
                data.watchTimeMinutes = parseInt(row[index]) || 0
                break
              case 'subscribersGained':
                data.subscribersGained = parseInt(row[index]) || 0
                break
              case 'subscribersLost':
                data.subscribersLost = parseInt(row[index]) || 0
                break
              case 'likes':
                data.likes = parseInt(row[index]) || 0
                break
              case 'comments':
                data.comments = parseInt(row[index]) || 0
                break
              case 'shares':
                data.shares = parseInt(row[index]) || 0
                break
              case 'estimatedRevenue':
                data.estimatedRevenue = parseFloat(row[index]) || 0
                break
            }
          }
        })

        return data as YouTubeAnalyticsData
      })
    } catch (error: any) {
      // Don't log 403 errors as they're expected for many channels
      if (error.response?.status !== 403) {
        console.error('Error fetching analytics data:', error)
      }
      throw error
    }
  }

  /**
   * Check if user has valid YouTube access
   */
  async hasValidAccess(): Promise<boolean> {
    return await this.auth.hasValidTokens(this.userId)
  }

  /**
   * Get OAuth authorization URL
   */
  getAuthUrl(state?: string): string {
    return this.auth.getAuthUrl(state)
  }
}
