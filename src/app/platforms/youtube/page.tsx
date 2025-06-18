'use client'

import { useEffect, useState, Suspense } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { useYouTubeData } from '@/hooks/useYouTubeData'
import { KPICard } from '@/components/dashboard/KPICard'
import { YouTubeConnect } from '@/components/dashboard/YouTubeConnect'
import { VideoList } from '@/components/dashboard/VideoList'
import { ViewsChart } from '@/components/charts/ViewsChart'
import { SubscriberChart } from '@/components/charts/SubscriberChart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import {
  Eye,
  Users,
  Clock,
  ThumbsUp,
  MessageCircle,
  TrendingUp,
  Video,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Youtube,
  ArrowLeft
} from 'lucide-react'

// Component that handles search parameters
function SearchParamsHandler({
  setError,
  setSuccess,
  user,
  router,
  handleOAuthCallback
}: {
  setError: (error: string | null) => void
  setSuccess: (success: string | null) => void
  user: any
  router: any
  handleOAuthCallback: (code: string, state: string) => void
}) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      setError('YouTube connection was cancelled or failed')
      // Clean up URL
      router.replace('/platforms/youtube')
      return
    }

    if (code && state && user) {
      handleOAuthCallback(code, state)
    }
  }, [searchParams, user, router, setError, handleOAuthCallback])

  return null
}

// OAuth callback handler function
const createOAuthCallbackHandler = (
  setError: (error: string | null) => void,
  setSuccess: (success: string | null) => void,
  user: any,
  router: any
) => {
  return async (code: string, state: string) => {
    try {
      setError(null)

      // Verify state matches user ID for security
      if (state !== user?.id) {
        throw new Error('Invalid state parameter')
      }

      const response = await fetch('/api/auth/youtube/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      if (response.ok) {
        setSuccess('YouTube account connected successfully!')
        // Clean up URL
        router.replace('/platforms/youtube')
        // Refresh connection status
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to connect YouTube account')
      }
    } catch (error) {
      console.error('OAuth callback error:', error)
      setError(error instanceof Error ? error.message : 'Failed to connect YouTube account')
      // Clean up URL
      router.replace('/platforms/youtube')
    }
  }
}

export default function YouTubePlatformPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const {
    isConnected,
    checkingConnection,
    channelData,
    channelLoading,
    channelError,
    videos,
    videosLoading,
    videosError,
    hasMoreVideos,
    analyticsData,
    analyticsLoading,
    analyticsError,
    connectYouTube,
    refreshChannelData,
    loadMoreVideos,
    refreshAnalytics,
  } = useYouTubeData()

  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth')
    }
  }, [user, authLoading, router])

  // Create OAuth callback handler
  const handleOAuthCallback = createOAuthCallbackHandler(setError, setSuccess, user, router)

  const handleYouTubeConnect = async () => {
    try {
      setError(null)
      await connectYouTube()
    } catch (error) {
      console.error('YouTube connection error:', error)
      setError(error instanceof Error ? error.message : 'Failed to connect to YouTube')
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="p-6">
      {/* Handle search parameters with Suspense boundary */}
      <Suspense fallback={null}>
        <SearchParamsHandler
          setError={setError}
          setSuccess={setSuccess}
          user={user}
          router={router}
          handleOAuthCallback={handleOAuthCallback}
        />
      </Suspense>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
              <Youtube className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">YouTube Analytics</h1>
              <p className="text-gray-600">
                Monitor your YouTube channel's performance and analytics
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* YouTube Connection Status */}
        {checkingConnection ? (
          <div className="mb-8 flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="ml-3 text-gray-600">Checking YouTube connection...</span>
          </div>
        ) : !isConnected ? (
          <div className="mb-8">
            <YouTubeConnect
              isConnected={isConnected}
              onConnect={handleYouTubeConnect}
              loading={checkingConnection}
              error={error}
            />
          </div>
        ) : (
          <>
            {/* Channel Info */}
            {channelData && (
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <img
                      src={channelData.thumbnails.high?.url || channelData.thumbnails.medium?.url}
                      alt={channelData.title}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <CardTitle className="text-xl">{channelData.title}</CardTitle>
                      <CardDescription>{channelData.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KPICard
                title="Total Views"
                value={channelData?.statistics.viewCount || '0'}
                icon={Eye}
                color="blue"
                loading={channelLoading}
              />
              <KPICard
                title="Subscribers"
                value={channelData?.statistics.subscriberCount || '0'}
                icon={Users}
                color="green"
                loading={channelLoading}
              />
              <KPICard
                title="Total Videos"
                value={channelData?.statistics.videoCount || '0'}
                icon={Video}
                color="purple"
                loading={channelLoading}
              />
              <KPICard
                title="Avg. Watch Time"
                value="4:32"
                icon={Clock}
                color="orange"
                loading={analyticsLoading}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ViewsChart 
                data={analyticsData} 
                loading={analyticsLoading}
                error={analyticsError}
                onRefresh={refreshAnalytics}
              />
              <SubscriberChart 
                data={analyticsData} 
                loading={analyticsLoading}
                error={analyticsError}
                onRefresh={refreshAnalytics}
              />
            </div>

            {/* Recent Videos */}
            <VideoList
              videos={videos}
              loading={videosLoading}
              error={videosError}
              hasMore={hasMoreVideos}
              onLoadMore={loadMoreVideos}
              onRefresh={() => window.location.reload()}
            />
          </>
        )}
      </div>
    </div>
  )
}
