'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { useYouTubeData } from '@/hooks/useYouTubeData'
import { 
  PlatformType, 
  PlatformConnection, 
  PlatformStats, 
  PLATFORM_CONFIGS 
} from '@/types/platforms'

interface PlatformContextType {
  // Connection management
  connections: Record<PlatformType, PlatformConnection>
  isLoading: boolean
  error: string | null
  
  // Platform operations
  connectPlatform: (platformId: PlatformType) => Promise<void>
  disconnectPlatform: (platformId: PlatformType) => Promise<void>
  refreshPlatform: (platformId: PlatformType) => Promise<void>
  refreshAllPlatforms: () => Promise<void>
  
  // Stats and analytics
  getConnectionStatus: (platformId: PlatformType) => boolean
  getTotalFollowers: () => number
  getConnectedPlatforms: () => PlatformConnection[]
  getAvailablePlatforms: () => PlatformType[]
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined)

interface PlatformProviderProps {
  children: ReactNode
}

export function PlatformProvider({ children }: PlatformProviderProps) {
  const { user } = useAuth()
  const [connections, setConnections] = useState<Record<PlatformType, PlatformConnection>>({} as any)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get YouTube data from existing hook
  const { 
    isConnected: youtubeConnected, 
    channelData, 
    connectYouTube,
    checkingConnection: youtubeLoading
  } = useYouTubeData()

  // Initialize platform connections
  useEffect(() => {
    if (user) {
      initializePlatforms()
    }
  }, [user, youtubeConnected, channelData])

  const initializePlatforms = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Build connections with real data
      const platformConnections: Record<PlatformType, PlatformConnection> = {
        youtube: {
          platformId: 'youtube',
          isConnected: youtubeConnected,
          connectedAt: youtubeConnected ? new Date().toISOString() : undefined,
          accountInfo: channelData ? {
            id: channelData.id,
            username: channelData.title.toLowerCase().replace(/\s+/g, ''),
            displayName: channelData.title,
            profileImage: channelData.thumbnails?.high?.url || channelData.thumbnails?.medium?.url,
            followerCount: parseInt(channelData.statistics.subscriberCount) || 0,
          } : undefined,
          lastSyncAt: youtubeConnected ? new Date().toISOString() : undefined,
        },
        twitter: {
          platformId: 'twitter',
          isConnected: false,
        },
        instagram: {
          platformId: 'instagram',
          isConnected: false,
        },
        tiktok: {
          platformId: 'tiktok',
          isConnected: false,
        },
        linkedin: {
          platformId: 'linkedin',
          isConnected: false,
        },
        facebook: {
          platformId: 'facebook',
          isConnected: false,
        },
      }

      setConnections(platformConnections)
    } catch (err) {
      console.error('Error initializing platforms:', err)
      setError('Failed to load platform connections')
    } finally {
      setIsLoading(false)
    }
  }

  const connectPlatform = async (platformId: PlatformType) => {
    try {
      setError(null)
      
      if (platformId === 'youtube') {
        await connectYouTube()
        return
      }
      
      // For other platforms, show coming soon
      throw new Error(`${PLATFORM_CONFIGS[platformId].name} integration coming soon!`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect platform'
      setError(errorMessage)
      throw err
    }
  }

  const disconnectPlatform = async (platformId: PlatformType) => {
    try {
      setError(null)
      
      if (platformId === 'youtube') {
        // Call YouTube disconnect API
        const response = await fetch('/api/auth/youtube/disconnect', {
          method: 'POST',
        })
        
        if (!response.ok) {
          throw new Error('Failed to disconnect YouTube')
        }
        
        // Update local state
        setConnections(prev => ({
          ...prev,
          youtube: {
            ...prev.youtube,
            isConnected: false,
            accountInfo: undefined,
            connectedAt: undefined,
            lastSyncAt: undefined,
          }
        }))
        return
      }
      
      // For other platforms
      setConnections(prev => ({
        ...prev,
        [platformId]: {
          ...prev[platformId],
          isConnected: false,
          accountInfo: undefined,
          connectedAt: undefined,
          lastSyncAt: undefined,
        }
      }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect platform'
      setError(errorMessage)
      throw err
    }
  }

  const refreshPlatform = async (platformId: PlatformType) => {
    try {
      setError(null)
      
      if (platformId === 'youtube') {
        // YouTube refresh is handled by the useYouTubeData hook
        await initializePlatforms()
        return
      }
      
      // For other platforms, implement refresh logic when available
      console.log(`Refreshing ${platformId} - not implemented yet`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh platform'
      setError(errorMessage)
      throw err
    }
  }

  const refreshAllPlatforms = async () => {
    try {
      setError(null)
      await initializePlatforms()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh platforms'
      setError(errorMessage)
      throw err
    }
  }

  // Helper functions
  const getConnectionStatus = (platformId: PlatformType): boolean => {
    return connections[platformId]?.isConnected || false
  }

  const getTotalFollowers = (): number => {
    return Object.values(connections).reduce((total, connection) => {
      return total + (connection.accountInfo?.followerCount || 0)
    }, 0)
  }

  const getConnectedPlatforms = (): PlatformConnection[] => {
    return Object.values(connections).filter(conn => conn.isConnected)
  }

  const getAvailablePlatforms = (): PlatformType[] => {
    return Object.keys(PLATFORM_CONFIGS).filter(
      platformId => PLATFORM_CONFIGS[platformId as PlatformType].isAvailable
    ) as PlatformType[]
  }

  const value: PlatformContextType = {
    // Connection management
    connections,
    isLoading: isLoading || youtubeLoading,
    error,
    
    // Platform operations
    connectPlatform,
    disconnectPlatform,
    refreshPlatform,
    refreshAllPlatforms,
    
    // Stats and analytics
    getConnectionStatus,
    getTotalFollowers,
    getConnectedPlatforms,
    getAvailablePlatforms,
  }

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  )
}

export function usePlatforms() {
  const context = useContext(PlatformContext)
  if (context === undefined) {
    throw new Error('usePlatforms must be used within a PlatformProvider')
  }
  return context
}
