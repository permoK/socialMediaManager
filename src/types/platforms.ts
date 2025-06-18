export type PlatformType = 'youtube' | 'twitter' | 'instagram' | 'tiktok' | 'linkedin' | 'facebook'

export interface PlatformConfig {
  id: PlatformType
  name: string
  description: string
  icon: string
  color: string
  bgColor: string
  isAvailable: boolean
  isComingSoon?: boolean
}

export interface PlatformConnection {
  platformId: PlatformType
  isConnected: boolean
  connectedAt?: string
  accountInfo?: {
    id: string
    username: string
    displayName: string
    profileImage?: string
    followerCount?: number
    followingCount?: number
  }
  lastSyncAt?: string
  error?: string
}

export interface PlatformStats {
  platformId: PlatformType
  totalFollowers?: number
  totalPosts?: number
  totalEngagement?: number
  growthRate?: number
  lastUpdated: string
}

export interface PlatformQuickStats {
  platformId: PlatformType
  stats: {
    label: string
    value: string | number
    change?: number
    changeType?: 'increase' | 'decrease' | 'neutral'
  }[]
}

// Platform configurations
export const PLATFORM_CONFIGS: Record<PlatformType, PlatformConfig> = {
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    description: 'Video content analytics and channel management',
    icon: 'Youtube',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    isAvailable: true,
  },
  twitter: {
    id: 'twitter',
    name: 'Twitter',
    description: 'Tweet scheduling and engagement analytics',
    icon: 'Twitter',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    isAvailable: false,
    isComingSoon: true,
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    description: 'Photo and story performance insights',
    icon: 'Instagram',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    isAvailable: false,
    isComingSoon: true,
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    description: 'Short-form video analytics and trends',
    icon: 'Video',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    isAvailable: false,
    isComingSoon: true,
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Professional network and content analytics',
    icon: 'Briefcase',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    isAvailable: false,
    isComingSoon: true,
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    description: 'Page management and audience insights',
    icon: 'Users',
    color: 'text-blue-800',
    bgColor: 'bg-blue-50',
    isAvailable: false,
    isComingSoon: true,
  },
}
