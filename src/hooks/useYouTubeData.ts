'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface YouTubeChannel {
  id: string
  title: string
  description: string
  thumbnails: any
  statistics: {
    viewCount: string
    subscriberCount: string
    videoCount: string
  }
}

interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnails: any
  publishedAt: string
  duration: string
  statistics: {
    viewCount: string
    likeCount: string
    commentCount: string
  }
}

interface AnalyticsData {
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

interface UseYouTubeDataReturn {
  // Connection status
  isConnected: boolean
  checkingConnection: boolean
  
  // Channel data
  channelData: YouTubeChannel | null
  channelLoading: boolean
  channelError: string | null
  
  // Videos data
  videos: YouTubeVideo[]
  videosLoading: boolean
  videosError: string | null
  hasMoreVideos: boolean
  
  // Analytics data
  analyticsData: AnalyticsData[]
  analyticsLoading: boolean
  analyticsError: string | null
  
  // Actions
  connectYouTube: () => Promise<void>
  checkConnection: () => Promise<void>
  refreshChannelData: () => Promise<void>
  loadMoreVideos: () => Promise<void>
  refreshAnalytics: (startDate?: string, endDate?: string) => Promise<void>
}

export function useYouTubeData(): UseYouTubeDataReturn {
  const { user } = useAuth()
  
  // Connection status
  const [isConnected, setIsConnected] = useState(false)
  const [checkingConnection, setCheckingConnection] = useState(true)
  
  // Channel data
  const [channelData, setChannelData] = useState<YouTubeChannel | null>(null)
  const [channelLoading, setChannelLoading] = useState(false)
  const [channelError, setChannelError] = useState<string | null>(null)
  
  // Videos data
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [videosLoading, setVideosLoading] = useState(false)
  const [videosError, setVideosError] = useState<string | null>(null)
  const [hasMoreVideos, setHasMoreVideos] = useState(true)
  const [nextPageToken, setNextPageToken] = useState<string | undefined>()
  
  // Analytics data
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([])
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState<string | null>(null)

  // Check YouTube connection status
  const checkConnection = useCallback(async () => {
    if (!user) {
      setCheckingConnection(false)
      setIsConnected(false)
      setChannelData(null)
      return
    }

    try {
      setCheckingConnection(true)
      setChannelError(null)

      const response = await fetch('/api/youtube/channel')

      if (response.ok) {
        const data = await response.json()
        setChannelData(data.channel)
        setIsConnected(true)
        setChannelError(null)
      } else if (response.status === 403) {
        // YouTube not connected - this is expected for new users
        setIsConnected(false)
        setChannelData(null)
        setChannelError(null) // Don't show error for expected state
      } else if (response.status === 401) {
        // User not authenticated - redirect will be handled by dashboard
        setIsConnected(false)
        setChannelData(null)
        setChannelError(null)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        setChannelError(errorData.error || 'Failed to check connection')
        setIsConnected(false)
      }
    } catch (error) {
      console.error('Error checking connection:', error)
      setChannelError('Failed to check connection')
      setIsConnected(false)
    } finally {
      setCheckingConnection(false)
    }
  }, [user])

  // Connect to YouTube
  const connectYouTube = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/youtube')
      
      if (response.ok) {
        const data = await response.json()
        window.location.href = data.authUrl
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to initiate connection')
      }
    } catch (error) {
      console.error('Error connecting to YouTube:', error)
      throw error
    }
  }, [])

  // Refresh channel data
  const refreshChannelData = useCallback(async () => {
    if (!user || !isConnected) return
    
    try {
      setChannelLoading(true)
      setChannelError(null)
      
      const response = await fetch('/api/youtube/channel')
      
      if (response.ok) {
        const data = await response.json()
        setChannelData(data.channel)
      } else {
        const errorData = await response.json()
        setChannelError(errorData.error || 'Failed to fetch channel data')
      }
    } catch (error) {
      console.error('Error fetching channel data:', error)
      setChannelError('Failed to fetch channel data')
    } finally {
      setChannelLoading(false)
    }
  }, [user, isConnected])

  // Load videos
  const loadVideos = useCallback(async (pageToken?: string, append = false) => {
    if (!user || !isConnected) return
    
    try {
      setVideosLoading(true)
      setVideosError(null)
      
      const params = new URLSearchParams({
        maxResults: '25',
        ...(pageToken && { pageToken })
      })
      
      const response = await fetch(`/api/youtube/videos?${params}`)
      
      if (response.ok) {
        const data = await response.json()
        
        if (append) {
          setVideos(prev => [...prev, ...data.videos])
        } else {
          setVideos(data.videos)
        }
        
        setNextPageToken(data.nextPageToken)
        setHasMoreVideos(!!data.nextPageToken)
      } else {
        const errorData = await response.json()
        setVideosError(errorData.error || 'Failed to fetch videos')
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
      setVideosError('Failed to fetch videos')
    } finally {
      setVideosLoading(false)
    }
  }, [user, isConnected])

  // Load more videos
  const loadMoreVideos = useCallback(async () => {
    if (nextPageToken && hasMoreVideos) {
      await loadVideos(nextPageToken, true)
    }
  }, [loadVideos, nextPageToken, hasMoreVideos])

  // Refresh analytics
  const refreshAnalytics = useCallback(async (startDate?: string, endDate?: string) => {
    if (!user || !isConnected) return

    try {
      setAnalyticsLoading(true)
      setAnalyticsError(null)

      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await fetch(`/api/youtube/analytics?${params}`)

      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data.data)
      } else if (response.status === 403) {
        // Analytics not available - this is common for new/small channels
        console.warn('YouTube Analytics not available for this channel')
        setAnalyticsData([]) // Set empty data instead of error
        setAnalyticsError(null) // Don't show error for expected case
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        setAnalyticsError(errorData.error || 'Failed to fetch analytics')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setAnalyticsError('Analytics temporarily unavailable')
    } finally {
      setAnalyticsLoading(false)
    }
  }, [user, isConnected])

  // Initial data loading
  useEffect(() => {
    if (user) {
      checkConnection()
    }
  }, [user, checkConnection])

  // Load initial data when connected
  useEffect(() => {
    if (isConnected && channelData) {
      loadVideos()
      refreshAnalytics()
    }
  }, [isConnected, channelData, loadVideos, refreshAnalytics])

  return {
    // Connection status
    isConnected,
    checkingConnection,

    // Channel data
    channelData,
    channelLoading,
    channelError,

    // Videos data
    videos,
    videosLoading,
    videosError,
    hasMoreVideos,

    // Analytics data
    analyticsData,
    analyticsLoading,
    analyticsError,

    // Actions
    connectYouTube,
    checkConnection,
    refreshChannelData,
    loadMoreVideos,
    refreshAnalytics,
  }
}
