'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatNumber, formatDuration, formatDate } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Clock,
  Loader2,
  Grid3X3,
  List,
  Play,
  TrendingUp,
  ExternalLink,
  MoreHorizontal
} from 'lucide-react'

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
  error?: string
  hasMore?: boolean
  onLoadMore?: () => void
  onRefresh?: () => void
  loadingMore?: boolean
}

export function VideoList({
  videos,
  loading = false,
  error,
  hasMore = false,
  onLoadMore,
  onRefresh,
  loadingMore = false
}: VideoListProps) {
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

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
                <div className="w-32 h-20 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'var(--muted)' }}></div>
                  <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--muted)' }}></div>
                  <div className="flex space-x-4">
                    <div className="h-3 rounded w-16" style={{ backgroundColor: 'var(--muted)' }}></div>
                    <div className="h-3 rounded w-16" style={{ backgroundColor: 'var(--muted)' }}></div>
                    <div className="h-3 rounded w-16" style={{ backgroundColor: 'var(--muted)' }}></div>
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
          <div className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
            No videos found
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-lg overflow-hidden" style={{ background: 'linear-gradient(to bottom right, var(--card), var(--muted))' }}>
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, var(--accent), var(--accent))' }} />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Play className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                <span style={{ color: 'var(--foreground)' }}>Recent Videos</span>
              </CardTitle>
              <CardDescription>Your latest uploaded videos and their performance</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center rounded-lg p-1" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-7 px-3 text-xs"
                >
                  <List className="w-3 h-3 mr-1" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-7 px-3 text-xs"
                >
                  <Grid3X3 className="w-3 h-3 mr-1" />
                  Grid
                </Button>
              </div>
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}
            >
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`group ${viewMode === 'grid' ? 'rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300' : 'rounded-xl p-4 hover:shadow-md transition-all duration-300'}`}
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <div className="relative">
                      <div className="relative overflow-hidden">
                        <img
                          src={video.thumbnails.medium?.url || video.thumbnails.default?.url}
                          alt={video.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {formatDuration(video.duration)}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium line-clamp-2 transition-colors cursor-pointer" style={{ color: 'var(--foreground)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--foreground)'}>
                          {video.title}
                        </h3>
                        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{formatDate(video.publishedAt)}</p>
                        <div className="mt-3 flex items-center justify-between text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{formatNumber(parseInt(video.statistics.viewCount))}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{formatNumber(parseInt(video.statistics.likeCount))}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // List View
                    <div className="flex space-x-4">
                      {/* Enhanced Thumbnail */}
                      <div className="flex-shrink-0 relative group">
                        <img
                          src={video.thumbnails.medium?.url || video.thumbnails.default?.url}
                          alt={video.title}
                          className="w-40 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg flex items-center justify-center">
                          <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                          {formatDuration(video.duration)}
                        </div>
                      </div>

                      {/* Enhanced Video Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3
                            className="font-medium line-clamp-2 cursor-pointer transition-colors flex-1 mr-2"
                            style={{ color: 'var(--foreground)' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--foreground)'}
                            onClick={() => toggleExpanded(video.id)}
                          >
                            {video.title}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="mt-2 flex items-center space-x-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(video.publishedAt)}</span>
                          </div>
                        </div>

                        {/* Enhanced Stats */}
                        <div className="mt-3 grid grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                            <Eye className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                            <div>
                              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{formatNumber(parseInt(video.statistics.viewCount))}</p>
                              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Views</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                            <ThumbsUp className="w-4 h-4" style={{ color: 'var(--success)' }} />
                            <div>
                              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{formatNumber(parseInt(video.statistics.likeCount))}</p>
                              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Likes</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                            <MessageCircle className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                            <div>
                              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{formatNumber(parseInt(video.statistics.commentCount))}</p>
                              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Comments</p>
                            </div>
                          </div>
                        </div>

                        {/* Performance Indicator */}
                        <div className="mt-3 flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4" style={{ color: 'var(--success)' }} />
                          <span className="text-sm font-medium" style={{ color: 'var(--success)' }}>+12% vs avg</span>
                        </div>

                        {/* Expanded Description */}
                        <AnimatePresence>
                          {expandedVideo === video.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-3 text-sm overflow-hidden"
                              style={{ color: 'var(--muted-foreground)' }}
                            >
                              <p className="line-clamp-3">
                                {video.description || 'No description available'}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Enhanced Load More Button */}
          {hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center pt-6"
            >
              <Button
                variant="outline"
                onClick={onLoadMore}
                disabled={loadingMore}
                className="px-8"
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
              >
                {loadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Load More Videos
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
