'use client'

import { useEffect, useState } from 'react'
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
  BarChart3
} from 'lucide-react'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

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

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Handle URL parameters for success/error messages
  useEffect(() => {
    const errorParam = searchParams.get('error')
    const successParam = searchParams.get('success')

    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
    if (successParam) {
      setSuccess(decodeURIComponent(successParam))
    }
  }, [searchParams])

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth')
    }
  }, [user, authLoading, router])

  const handleYouTubeConnect = async () => {
    try {
      setError(null)
      await connectYouTube()
    } catch (err: any) {
      setError(err.message || 'Failed to connect to YouTube')
    }
  }

  // Aggregate analytics data for KPI cards
  const aggregatedAnalytics = analyticsData.reduce((acc, item) => ({
    views: acc.views + item.views,
    watchTimeMinutes: acc.watchTimeMinutes + item.watchTimeMinutes,
    subscribersGained: acc.subscribersGained + item.subscribersGained,
    subscribersLost: acc.subscribersLost + item.subscribersLost,
    likes: acc.likes + item.likes,
    comments: acc.comments + item.comments,
  }), {
    views: 0,
    watchTimeMinutes: 0,
    subscribersGained: 0,
    subscribersLost: 0,
    likes: 0,
    comments: 0,
  })

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to auth page
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitor your YouTube channel's performance and analytics
          </p>
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
                      <CardDescription className="mt-1">
                        {channelData.description.substring(0, 150)}...
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KPICard
                title="Total Views"
                value={channelData ? parseInt(channelData.statistics.viewCount) : 0}
                icon={Eye}
                loading={channelLoading}
              />
              <KPICard
                title="Subscribers"
                value={channelData ? parseInt(channelData.statistics.subscriberCount) : 0}
                icon={Users}
                loading={channelLoading}
              />
              <KPICard
                title="Total Videos"
                value={channelData ? parseInt(channelData.statistics.videoCount) : 0}
                icon={Video}
                loading={channelLoading}
              />
              <KPICard
                title="Watch Time"
                value={aggregatedAnalytics.watchTimeMinutes}
                icon={Clock}
                format="duration"
                loading={analyticsLoading}
              />
            </div>

            {/* Recent Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <KPICard
                title="Recent Views"
                value={aggregatedAnalytics.views}
                icon={Eye}
                changeLabel="last 30 days"
                loading={analyticsLoading}
              />
              <KPICard
                title="Subscribers Gained"
                value={aggregatedAnalytics.subscribersGained}
                icon={TrendingUp}
                changeLabel="last 30 days"
                loading={analyticsLoading}
              />
              <KPICard
                title="Total Engagement"
                value={aggregatedAnalytics.likes + aggregatedAnalytics.comments}
                icon={ThumbsUp}
                changeLabel="last 30 days"
                loading={analyticsLoading}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {analyticsData.length === 0 && !analyticsLoading ? (
                <div className="lg:col-span-2">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-6 text-center">
                      <div className="text-blue-600 mb-2">
                        <BarChart3 className="h-8 w-8 mx-auto" />
                      </div>
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        Analytics Coming Soon
                      </h3>
                      <p className="text-blue-700">
                        YouTube Analytics data will be available once your channel meets YouTube's requirements.
                        Keep creating content and your analytics will appear here!
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <>
                  <ViewsChart
                    data={analyticsData.map(item => ({
                      date: item.date,
                      views: item.views
                    }))}
                    loading={analyticsLoading}
                  />

                  <SubscriberChart
                    data={analyticsData.map(item => ({
                      date: item.date,
                      subscribersGained: item.subscribersGained,
                      subscribersLost: item.subscribersLost
                    }))}
                    loading={analyticsLoading}
                  />
                </>
              )}
            </div>

            {/* Video List */}
            <VideoList
              videos={videos}
              loading={videosLoading}
              hasMore={hasMoreVideos}
              onLoadMore={loadMoreVideos}
              loadingMore={videosLoading}
            />
          </>
        )}
      </div>
    </div>
  )
}
