'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatNumber } from '@/lib/utils'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface KPICardProps {
  title: string
  value: number | string
  change?: number
  changeLabel?: string
  icon: LucideIcon
  format?: 'number' | 'currency' | 'percentage' | 'duration'
  loading?: boolean
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow'
  gradient?: boolean
}

export function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  format = 'number',
  loading = false,
  color = 'blue',
  gradient = true
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  // Animated counter effect
  useEffect(() => {
    if (loading || typeof value === 'string') return

    const numericValue = typeof value === 'number' ? value : parseInt(value.toString().replace(/,/g, ''))
    if (isNaN(numericValue)) return

    setIsAnimating(true)
    const duration = 1500
    const steps = 60
    const increment = numericValue / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= numericValue) {
        setDisplayValue(numericValue)
        setIsAnimating(false)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value, loading])

  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val

    switch (format) {
      case 'currency':
        return `$${formatNumber(val)}`
      case 'percentage':
        return `${val.toFixed(1)}%`
      case 'duration':
        const hours = Math.floor(val / 60)
        const minutes = val % 60
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
      default:
        return formatNumber(val)
    }
  }

  const getColorStyles = (colorName: string) => {
    const colors = {
      blue: {
        gradient: 'linear-gradient(to right, #3b82f6, #2563eb)',
        bg: 'var(--muted)',
        text: '#3b82f6',
        border: 'var(--border)',
        hover: 'var(--accent)'
      },
      green: {
        gradient: 'linear-gradient(to right, #10b981, #059669)',
        bg: 'var(--muted)',
        text: '#10b981',
        border: 'var(--border)',
        hover: 'var(--accent)'
      },
      purple: {
        gradient: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
        bg: 'var(--muted)',
        text: '#8b5cf6',
        border: 'var(--border)',
        hover: 'var(--accent)'
      },
      orange: {
        gradient: 'linear-gradient(to right, #f97316, #ea580c)',
        bg: 'var(--muted)',
        text: '#f97316',
        border: 'var(--border)',
        hover: 'var(--accent)'
      },
      red: {
        gradient: 'linear-gradient(to right, #ef4444, #dc2626)',
        bg: 'var(--muted)',
        text: '#ef4444',
        border: 'var(--border)',
        hover: 'var(--accent)'
      },
      yellow: {
        gradient: 'linear-gradient(to right, #eab308, #ca8a04)',
        bg: 'var(--muted)',
        text: '#eab308',
        border: 'var(--border)',
        hover: 'var(--accent)'
      }
    }
    return colors[colorName as keyof typeof colors] || colors.blue
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return { color: 'var(--success)' }
    if (change < 0) return { color: 'var(--destructive)' }
    return { color: 'var(--muted-foreground)' }
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return TrendingUp
    if (change < 0) return TrendingDown
    return null
  }

  const colorStyles = getColorStyles(color)

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="relative overflow-hidden transition-all duration-300" style={{ borderColor: colorStyles.border }}>
          {gradient && (
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: colorStyles.gradient }} />
          )}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
              {title}
            </CardTitle>
            <div className="p-2 rounded-lg" style={{ backgroundColor: colorStyles.bg }}>
              <Icon className="h-4 w-4" style={{ color: colorStyles.text }} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-8 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />
              <div className="h-4 rounded-lg animate-pulse w-24" style={{ backgroundColor: 'var(--muted)' }} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const ChangeIcon = getChangeIcon(change || 0)
  const currentValue = typeof value === 'number' ? displayValue : value

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg group h-full" style={{ borderColor: colorStyles.border }}>
        {gradient && (
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: colorStyles.gradient }} />
        )}

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium transition-colors" style={{ color: 'var(--muted-foreground)' }}>
            {title}
          </CardTitle>
          <motion.div
            className="p-2 rounded-lg group-hover:scale-110 transition-transform duration-200"
            style={{ backgroundColor: colorStyles.bg }}
            whileHover={{ rotate: 5 }}
          >
            <Icon className="h-4 w-4" style={{ color: colorStyles.text }} />
          </motion.div>
        </CardHeader>

        <CardContent>
          <motion.div
            className="text-2xl font-bold mb-2"
            style={{ color: 'var(--foreground)' }}
            animate={{ scale: isAnimating ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {formatValue(currentValue)}
          </motion.div>

          {change !== undefined && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs flex items-center"
              style={getChangeColor(change)}
            >
              {ChangeIcon && (
                <ChangeIcon className="w-3 h-3 mr-1" />
              )}
              <span className="font-medium">
                {change > 0 ? '+' : ''}{change?.toFixed(1)}%
              </span>
              {changeLabel && (
                <span className="ml-1" style={{ color: 'var(--muted-foreground)' }}>
                  {changeLabel}
                </span>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
