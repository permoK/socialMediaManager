'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  ArrowLeft, 
  Clock, 
  Bell,
  Twitter,
  Instagram,
  Video,
  Briefcase,
  Users
} from 'lucide-react'
import { PlatformType, PLATFORM_CONFIGS } from '@/types/platforms'

const iconMap = {
  Twitter,
  Instagram,
  Video,
  Briefcase,
  Users,
}

interface ComingSoonProps {
  platformId: PlatformType
}

export function ComingSoon({ platformId }: ComingSoonProps) {
  const config = PLATFORM_CONFIGS[platformId]
  const IconComponent = iconMap[config.icon as keyof typeof iconMap] || Users

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">

        {/* Coming Soon Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex justify-center mb-8">
            <div className={`flex items-center justify-center w-20 h-20 rounded-2xl ${config.bgColor}`}>
              <IconComponent className={`w-10 h-10 ${config.color}`} />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {config.name} Integration
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {config.description}
          </p>

          <Card className="max-w-2xl mx-auto mb-8">
            <CardHeader>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
                <CardTitle className="text-orange-800">Coming Soon</CardTitle>
              </div>
              <CardDescription className="text-center">
                We're working hard to bring you {config.name} integration. This will include:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {getFeatures(platformId).map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <p className="text-gray-600">
              Want to be notified when {config.name} integration is ready?
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Bell className="w-4 h-4 mr-2" />
              Notify Me When Ready
            </Button>
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              In the meantime...
            </h3>
            <p className="text-blue-700 mb-4">
              You can start managing your other social media platforms that are already available.
            </p>
            <Link href="/platforms">
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                View Available Platforms
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function getFeatures(platformId: PlatformType): string[] {
  switch (platformId) {
    case 'twitter':
      return [
        'Tweet scheduling and management',
        'Engagement analytics and metrics',
        'Follower growth tracking',
        'Hashtag performance analysis',
        'Tweet performance insights',
        'Audience demographics',
        'Competitor analysis',
        'Content optimization suggestions'
      ]
    case 'instagram':
      return [
        'Post and story scheduling',
        'Engagement rate analysis',
        'Follower insights and demographics',
        'Hashtag performance tracking',
        'Story analytics and reach',
        'IGTV and Reels metrics',
        'Content performance optimization',
        'Competitor benchmarking'
      ]
    case 'tiktok':
      return [
        'Video performance analytics',
        'Trending hashtag discovery',
        'Audience engagement metrics',
        'Follower growth tracking',
        'Content optimization tips',
        'Viral content analysis',
        'Competitor insights',
        'Best posting time recommendations'
      ]
    case 'linkedin':
      return [
        'Professional content scheduling',
        'Connection growth analytics',
        'Post engagement metrics',
        'Industry insights and trends',
        'Company page management',
        'Lead generation tracking',
        'Professional network analysis',
        'Content performance optimization'
      ]
    case 'facebook':
      return [
        'Page management and scheduling',
        'Audience insights and demographics',
        'Post performance analytics',
        'Ad campaign integration',
        'Event management and tracking',
        'Community engagement metrics',
        'Content optimization suggestions',
        'Cross-platform posting'
      ]
    default:
      return [
        'Comprehensive analytics dashboard',
        'Content scheduling and management',
        'Audience insights and growth tracking',
        'Performance optimization suggestions'
      ]
  }
}
