'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { usePlatforms } from '@/contexts/PlatformContext'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { PlatformCard } from '@/components/platforms/PlatformCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import {
  PLATFORM_CONFIGS,
  PlatformQuickStats,
  PlatformType
} from '@/types/platforms'
import {
  Zap,
  TrendingUp,
  Users,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react'

export default function PlatformsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [quickStats, setQuickStats] = useState<Record<PlatformType, PlatformQuickStats>>({} as any)

  // Get platform data from context
  const {
    connections,
    isLoading: platformsLoading,
    error: platformsError,
    connectPlatform,
    disconnectPlatform,
    getTotalFollowers,
    getConnectedPlatforms,
    getAvailablePlatforms
  } = usePlatforms()

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth')
    }
  }, [user, authLoading, router])

  // Load quick stats when connections change
  useEffect(() => {
    if (connections && Object.keys(connections).length > 0) {
      loadQuickStats()
    }
  }, [connections])

  const loadQuickStats = () => {
    const stats: Record<PlatformType, PlatformQuickStats> = {} as any

    Object.entries(connections).forEach(([platformId, connection]) => {
      const platform = platformId as PlatformType

      if (connection.isConnected && connection.accountInfo) {
        if (platform === 'youtube') {
          // For YouTube, we can get more detailed stats
          stats[platform] = {
            platformId: platform,
            stats: [
              {
                label: 'Subscribers',
                value: formatNumber(connection.accountInfo.followerCount || 0),
                change: 5.2,
                changeType: 'increase'
              },
              {
                label: 'Channel',
                value: connection.accountInfo.displayName,
              },
            ],
          }
        } else {
          stats[platform] = {
            platformId: platform,
            stats: [
              {
                label: 'Followers',
                value: formatNumber(connection.accountInfo.followerCount || 0)
              },
              {
                label: 'Account',
                value: connection.accountInfo.displayName
              },
            ],
          }
        }
      } else {
        stats[platform] = { platformId: platform, stats: [] }
      }
    })

    setQuickStats(stats)
  }

  // Helper function to format numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const handleConnect = async (platformId: PlatformType) => {
    try {
      await connectPlatform(platformId)
    } catch (error) {
      console.error('Platform connection error:', error)
      // Error is already handled in the context
    }
  }

  const handleDisconnect = async (platformId: PlatformType) => {
    try {
      await disconnectPlatform(platformId)
    } catch (error) {
      console.error('Platform disconnection error:', error)
      // Error is already handled in the context
    }
  }

  if (authLoading || platformsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  const connectedPlatforms = getConnectedPlatforms()
  const availablePlatforms = getAvailablePlatforms()
  const totalFollowers = getTotalFollowers()

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Overview</h1>
          <p className="text-gray-600">
            Connect and manage all your social media accounts in one place
          </p>
        </motion.div>

        {/* Error Alert */}
        {platformsError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{platformsError}</AlertDescription>
          </Alert>
        )}

        {/* Overview Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Connected</p>
                  <p className="text-2xl font-bold text-gray-900">{connectedPlatforms.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">{availablePlatforms.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Followers</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(totalFollowers)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                  <p className="text-2xl font-bold text-gray-900">+5.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Platform Cards */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {Object.values(PLATFORM_CONFIGS).map((config, index) => (
            <motion.div
              key={config.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <PlatformCard
                config={config}
                connection={connections[config.id]}
                quickStats={quickStats[config.id]}
                onConnect={() => handleConnect(config.id)}
                onDisconnect={() => handleDisconnect(config.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
