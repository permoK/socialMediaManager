'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlatforms } from '@/contexts/PlatformContext'
import { Button } from '@/components/ui/Button'
import { 
  PLATFORM_CONFIGS, 
  PlatformType 
} from '@/types/platforms'
import { 
  Zap,
  Home,
  Settings,
  ChevronLeft,
  ChevronRight,
  Youtube,
  Twitter,
  Instagram,
  Video,
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react'

const iconMap = {
  Youtube,
  Twitter,
  Instagram,
  Video,
  Briefcase,
  Users,
}

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { connections, getConnectionStatus } = usePlatforms()

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 }
  }

  const contentVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 }
  }

  return (
    <motion.div
      initial={false}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      className="border-r flex flex-col h-full"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                key="expanded-header"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>SocialHub</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {onToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="p-1 h-8 w-8"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            <Link href="/platforms">
              <Button
                variant={isActive('/platforms') && pathname === '/platforms' ? 'default' : 'ghost'}
                className={`w-full justify-start ${isCollapsed ? 'px-2' : ''}`}
              >
                <Home className="w-4 h-4" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      variants={contentVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="ml-2"
                    >
                      Overview
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>
          </div>

          {/* Platform Divider */}
          <div className="pt-4">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="px-2 mb-2"
                >
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Platforms
                  </h3>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Platform Links */}
            <div className="space-y-1">
              {Object.values(PLATFORM_CONFIGS).map((config) => {
                const IconComponent = iconMap[config.icon as keyof typeof iconMap] || Users
                const isConnected = getConnectionStatus(config.id)
                const platformPath = `/platforms/${config.id}`
                const isActivePlatform = isActive(platformPath)

                return (
                  <div key={config.id} className="relative">
                    <Link href={platformPath}>
                      <Button
                        variant={isActivePlatform ? 'default' : 'ghost'}
                        className={`w-full justify-start ${isCollapsed ? 'px-2' : ''} ${
                          !config.isAvailable ? 'opacity-60' : ''
                        }`}
                        disabled={!config.isAvailable}
                      >
                        <div className="relative">
                          <IconComponent className={`w-4 h-4 ${config.color}`} />
                          {isConnected && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white" />
                          )}
                        </div>
                        
                        <AnimatePresence>
                          {!isCollapsed && (
                            <motion.div
                              variants={contentVariants}
                              initial="collapsed"
                              animate="expanded"
                              exit="collapsed"
                              className="ml-2 flex-1 flex items-center justify-between"
                            >
                              <span>{config.name}</span>
                              <div className="flex items-center space-x-1">
                                {isConnected ? (
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                ) : config.isComingSoon ? (
                                  <Clock className="w-3 h-3 text-orange-500" />
                                ) : config.isAvailable ? (
                                  <Plus className="w-3 h-3 text-gray-400" />
                                ) : null}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Settings */}
          <div className="pt-4 border-t border-gray-200">
            <Link href="/settings">
              <Button
                variant={isActive('/settings') ? 'default' : 'ghost'}
                className={`w-full justify-start ${isCollapsed ? 'px-2' : ''}`}
              >
                <Settings className="w-4 h-4" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      variants={contentVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="ml-2"
                    >
                      Settings
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>
          </div>
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="text-xs text-gray-500 text-center"
            >
              SocialHub v1.0
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
