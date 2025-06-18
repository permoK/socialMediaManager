'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatNumber, formatDuration, formatDate } from '@/lib/utils'
import { Eye, ThumbsUp, MessageCircle, Calendar, Clock, Loader2 } from 'lucide-react'

interface Video {
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

interface VideoListProps {
  videos: Video[]
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  loadingMore?: boolean
}

export function VideoList({ 
  videos, 
  loading = false, 
  hasMore = false, 
  onLoadMore,
  loadingMore = false 
}: VideoListProps) {
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null)

  const toggleExpanded = (videoId: string) => {
    setExpandedVideo(expandedVideo === videoId ? null : videoId)
  }

  if (loading && videos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Videos</CardTitle>
          <CardDescription>Your latest uploaded videos and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4 animate-pulse">
                <div className="w-32 h-20 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex space-x-4">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!videos || videos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Videos</CardTitle>
          <CardDescription>Your latest uploaded videos and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No videos found
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Videos</CardTitle>
        <CardDescription>Your latest uploaded videos and their performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {videos.map((video) => (
            <div key={video.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex space-x-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <img
                    src={video.thumbnails.medium?.url || video.thumbnails.default?.url}
                    alt={video.title}
                    className="w-32 h-20 object-cover rounded-lg"
                  />
                </div>
                
                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <h3 
                    className="font-medium text-gray-900 truncate cursor-pointer hover:text-red-600"
                    onClick={() => toggleExpanded(video.id)}
                  >
                    {video.title}
                  </h3>
                  
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(video.publishedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDuration(video.duration)}</span>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="mt-2 flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Eye className="w-4 h-4" />
                      <span>{formatNumber(parseInt(video.statistics.viewCount))}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{formatNumber(parseInt(video.statistics.likeCount))}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <MessageCircle className="w-4 h-4" />
                      <span>{formatNumber(parseInt(video.statistics.commentCount))}</span>
                    </div>
                  </div>
                  
                  {/* Expanded Description */}
                  {expandedVideo === video.id && (
                    <div className="mt-3 text-sm text-gray-600">
                      <p className="line-clamp-3">
                        {video.description || 'No description available'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={onLoadMore}
                disabled={loadingMore}
              >
                {loadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Load More Videos
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
