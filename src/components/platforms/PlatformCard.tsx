'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Youtube,
  Twitter,
  Instagram,
  Video,
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
  LogOut,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PlatformConfig, PlatformConnection, PlatformQuickStats } from '@/types/platforms'

const iconMap = {
  Youtube,
  Twitter,
  Instagram,
  Video,
  Briefcase,
  Users,
}

interface PlatformCardProps {
  config: PlatformConfig
  connection?: PlatformConnection
  quickStats?: PlatformQuickStats
  onConnect?: () => void
  onDisconnect?: () => void
}

export function PlatformCard({ 
  config, 
  connection, 
  quickStats, 
  onConnect, 
  onDisconnect 
}: PlatformCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const IconComponent = iconMap[config.icon as keyof typeof iconMap] || Users
  const isConnected = connection?.isConnected || false
  const isAvailable = config.isAvailable

  const handleConnect = async () => {
    if (!onConnect || !isAvailable) return
    
    setIsLoading(true)
    try {
      await onConnect()
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    if (!onDisconnect) return
    
    setIsLoading(true)
    try {
      await onDisconnect()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card
        className={`h-full transition-all duration-200 hover:shadow-lg ${!isAvailable ? 'opacity-75' : ''}`}
        style={{
          backgroundColor: 'var(--card)',
          border: isConnected ? '2px solid var(--success)' : '1px solid var(--border)'
        }}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${config.bgColor}`}>
                <IconComponent className={`w-6 h-6 ${config.color}`} />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {config.name}
                  {isConnected && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  {config.isComingSoon && (
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: 'var(--warning)',
                        color: 'var(--warning-foreground)'
                      }}
                    >
                      Coming Soon
                    </span>
                  )}
                </CardTitle>
                <CardDescription
                  className="text-sm"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {config.description}
                </CardDescription>
              </div>
            </div>
            
            {isConnected && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDisconnect}
                disabled={isLoading}
                title="Disconnect platform"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Connection Status */}
          <div className="mb-4">
            {isConnected && connection?.accountInfo ? (
              <div
                className="flex items-center space-x-3 p-3 rounded-lg border"
                style={{
                  backgroundColor: 'var(--muted)',
                  borderColor: 'var(--success)'
                }}
              >
                {connection.accountInfo.profileImage && (
                  <img
                    src={connection.accountInfo.profileImage}
                    alt={connection.accountInfo.displayName}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {connection.accountInfo.displayName}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    @{connection.accountInfo.username}
                  </p>
                </div>
              </div>
            ) : connection?.error ? (
              <div
                className="flex items-center space-x-2 p-3 rounded-lg border"
                style={{
                  backgroundColor: 'var(--muted)',
                  borderColor: 'var(--destructive)'
                }}
              >
                <Clock
                  className="w-4 h-4"
                  style={{ color: 'var(--destructive)' }}
                />
                <p
                  className="text-xs"
                  style={{ color: 'var(--destructive)' }}
                >
                  Connection error
                </p>
              </div>
            ) : null}
          </div>

          {/* Quick Stats */}
          {isConnected && quickStats && (
            <div className="mb-4 space-y-2">
              {quickStats.stats.slice(0, 2).map((stat, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span style={{ color: 'var(--muted-foreground)' }}>{stat.label}</span>
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>{stat.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {isConnected ? (
              <div className="space-y-2">
                <Link href={`/platforms/${config.id}`} className="block">
                  <Button className="w-full" variant="default">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : isAvailable ? (
              <Button 
                onClick={handleConnect}
                disabled={isLoading}
                className="w-full"
                variant="outline"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                ) : null}
                Connect {config.name}
              </Button>
            ) : (
              <Button
                disabled
                className="w-full"
                variant="outline"
                style={{
                  color: 'var(--muted-foreground)',
                  borderColor: 'var(--border)'
                }}
              >
                {config.isComingSoon ? 'Coming Soon' : 'Not Available'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
