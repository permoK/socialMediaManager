'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatNumber } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  value: number | string
  change?: number
  changeLabel?: string
  icon: LucideIcon
  format?: 'number' | 'currency' | 'percentage' | 'duration'
  loading?: boolean
}

export function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  format = 'number',
  loading = false
}: KPICardProps) {
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

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return '↗'
    if (change < 0) return '↘'
    return '→'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{formatValue(value)}</div>
        {change !== undefined && (
          <p className={`text-xs ${getChangeColor(change)} flex items-center mt-1`}>
            <span className="mr-1">{getChangeIcon(change)}</span>
            {Math.abs(change).toFixed(1)}%
            {changeLabel && (
              <span className="text-gray-500 ml-1">
                {changeLabel}
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
