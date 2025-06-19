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
import { motion, AnimatePresence } from 'framer-motion'
import { formatNumber } from '@/lib/utils'
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
  ArrowLeft,
  RefreshCw,
  Download,
  Settings,
  Calendar,
  Filter,
  ChevronRight,
  Home,
  Loader2
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
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isExporting, setIsExporting] = useState(false)


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

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSuccess('Data exported successfully!')
    } catch (error) {
      setError('Failed to export data. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDateRangeToggle = () => {
    setShowDatePicker(!showDatePicker)
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
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(to bottom right, var(--muted), var(--secondary))' }}>
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
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-8 overflow-hidden"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(to bottom right, var(--card), var(--muted))' }} />
          <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(to right, var(--primary)/5, transparent)' }} />

          <div className="relative p-8">
            {/* Breadcrumb Navigation */}
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-2 text-sm text-gray-600 mb-6"
            >
              <Link href="/dashboard" className="transition-colors flex items-center" style={{ color: 'var(--muted-foreground)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}>
                <Home className="w-4 h-4 mr-1" />
                Dashboard
              </Link>
              <ChevronRight className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              <Link href="/platforms" className="transition-colors" style={{ color: 'var(--muted-foreground)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}>
                Platforms
              </Link>
              <ChevronRight className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              <span className="font-medium" style={{ color: 'var(--foreground)' }}>YouTube Analytics</span>
            </motion.nav>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              {/* Title Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-4 mb-6 lg:mb-0"
              >
                <div className="relative">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg">
                    <Youtube className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl font-bold"
                    style={{ color: 'var(--foreground)' }}
                  >
                    YouTube Analytics
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg mt-1"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Monitor your channel's performance and grow your audience
                  </motion.p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center space-x-3"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDateRangeToggle}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Date Range
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  {isExporting ? 'Exporting...' : 'Export'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Date Range Picker */}
        <AnimatePresence>
          {showDatePicker && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mb-6"
            >
              <Card style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--card)' }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium" style={{ color: 'var(--foreground)' }}>Select Date Range</h3>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Choose a custom date range for analytics</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button variant="outline" size="sm">
                        Last 7 days
                      </Button>
                      <Button variant="outline" size="sm">
                        Last 30 days
                      </Button>
                      <Button variant="outline" size="sm">
                        Last 90 days
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDatePicker(false)}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-8 flex items-center justify-center p-12"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--primary)' }}></div>
              <span className="text-lg" style={{ color: 'var(--muted-foreground)' }}>Checking YouTube connection...</span>
              <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>This may take a few moments</p>
            </div>
          </motion.div>
        ) : !isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <YouTubeConnect
              isConnected={isConnected}
              onConnect={handleYouTubeConnect}
              loading={checkingConnection}
              error={error}
            />
          </motion.div>
        ) : (
          <>
            {/* Enhanced Channel Info */}
            {channelData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="mb-8 overflow-hidden border-0 shadow-lg" style={{ background: 'linear-gradient(to bottom right, var(--card), var(--muted))' }}>
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, var(--primary), var(--primary))' }} />

                  <CardHeader className="pb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                      {/* Channel Info */}
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <motion.img
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            src={channelData.thumbnails.high?.url || channelData.thumbnails.medium?.url}
                            alt={channelData.title}
                            className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                          />
                          {/* Verified Badge */}
                          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-red-600 rounded-full flex items-center justify-center border-2 border-white">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                          >
                            <CardTitle className="text-2xl font-bold flex items-center space-x-2" style={{ color: 'var(--foreground)' }}>
                              <span>{channelData.title}</span>
                              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--success)' }} />
                            </CardTitle>
                            <CardDescription className="text-base max-w-md">
                              {channelData.description || 'No description available'}
                            </CardDescription>
                          </motion.div>

                          {/* Quick Stats */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="flex items-center space-x-6 text-sm"
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span className="font-medium">{formatNumber(parseInt(channelData.statistics.subscriberCount))} subscribers</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Video className="w-4 h-4" />
                              <span className="font-medium">{formatNumber(parseInt(channelData.statistics.videoCount))} videos</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span className="font-medium">{formatNumber(parseInt(channelData.statistics.viewCount))} total views</span>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 }}
                        className="flex items-center space-x-3"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={refreshChannelData}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refresh
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
                      </motion.div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            )}

            {/* KPI Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, staggerChildren: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <KPICard
                  title="Total Views"
                  value={channelData?.statistics.viewCount || '0'}
                  icon={Eye}
                  color="blue"
                  loading={channelLoading}
                  change={12.5}
                  changeLabel="vs last month"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <KPICard
                  title="Subscribers"
                  value={channelData?.statistics.subscriberCount || '0'}
                  icon={Users}
                  color="green"
                  loading={channelLoading}
                  change={8.3}
                  changeLabel="vs last month"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <KPICard
                  title="Total Videos"
                  value={channelData?.statistics.videoCount || '0'}
                  icon={Video}
                  color="purple"
                  loading={channelLoading}
                  change={5.2}
                  changeLabel="vs last month"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <KPICard
                  title="Avg. Watch Time"
                  value="4:32"
                  icon={Clock}
                  color="orange"
                  loading={analyticsLoading}
                  change={-2.1}
                  changeLabel="vs last month"
                />
              </motion.div>
            </motion.div>

            {/* Enhanced Charts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, staggerChildren: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 }}
              >
                <ViewsChart
                  data={analyticsData}
                  loading={analyticsLoading}
                  error={analyticsError}
                  onRefresh={refreshAnalytics}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
              >
                <SubscriberChart
                  data={analyticsData}
                  loading={analyticsLoading}
                  error={analyticsError}
                  onRefresh={refreshAnalytics}
                />
              </motion.div>
            </motion.div>

            {/* Enhanced Recent Videos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <VideoList
                videos={videos}
                loading={videosLoading}
                error={videosError}
                hasMore={hasMoreVideos}
                onLoadMore={loadMoreVideos}
                onRefresh={() => window.location.reload()}
              />
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
