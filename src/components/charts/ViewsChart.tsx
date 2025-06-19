'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatNumber, formatDate } from '@/lib/utils'
import { motion } from 'framer-motion'
import { RefreshCw, TrendingUp, BarChart3, Activity } from 'lucide-react'
import { useState } from 'react'

interface ViewsChartProps {
  data: Array<{
    date: string
    views: number
  }>
  loading?: boolean
  error?: string
  title?: string
  description?: string
  onRefresh?: () => void
}

export function ViewsChart({
  data,
  loading = false,
  error,
  title = "Views Over Time",
  description = "Daily views for your channel",
  onRefresh
}: ViewsChartProps) {
  const [chartType, setChartType] = useState<'line' | 'area'>('area')
  const formatTooltipValue = (value: number) => {
    return formatNumber(value)
  }

  const formatXAxisLabel = (tickItem: string) => {
    return formatDate(tickItem)
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-0 shadow-lg" style={{ background: 'linear-gradient(to bottom right, var(--card), var(--muted))' }}>
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, var(--primary), var(--primary))' }} />
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                  <span style={{ color: 'var(--foreground)' }}>{title}</span>
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Loading chart data...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card style={{ borderColor: 'var(--destructive)', backgroundColor: 'var(--destructive)/10' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2" style={{ color: 'var(--destructive)' }}>
                  <TrendingUp className="w-5 h-5" />
                  <span>{title}</span>
                </CardTitle>
                <CardDescription style={{ color: 'var(--destructive)' }}>{error}</CardDescription>
              </div>
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  style={{ borderColor: 'var(--destructive)', color: 'var(--destructive)' }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-0 shadow-lg" style={{ background: 'linear-gradient(to bottom right, var(--card), var(--muted))' }}>
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, var(--primary), var(--primary))' }} />
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                  <span style={{ color: 'var(--foreground)' }}>{title}</span>
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--muted-foreground)' }} />
                <p className="text-lg font-medium" style={{ color: 'var(--foreground)' }}>No data available</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Data will appear here once available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const renderChart = () => {
    if (chartType === 'area') {
      return (
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxisLabel}
            className="text-xs text-gray-600"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatNumber}
            className="text-xs text-gray-600"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            labelFormatter={(label) => formatDate(label)}
            formatter={(value: number) => [formatTooltipValue(value), 'Views']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              fontSize: '14px'
            }}
            labelStyle={{ color: '#374151', fontWeight: '600' }}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#viewsGradient)"
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
          />
        </AreaChart>
      )
    } else {
      return (
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxisLabel}
            className="text-xs text-gray-600"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatNumber}
            className="text-xs text-gray-600"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            labelFormatter={(label) => formatDate(label)}
            formatter={(value: number) => [formatTooltipValue(value), 'Views']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              fontSize: '14px'
            }}
            labelStyle={{ color: '#374151', fontWeight: '600' }}
          />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
          />
        </LineChart>
      )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-lg overflow-hidden" style={{ background: 'linear-gradient(to bottom right, var(--card), var(--muted))' }}>
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, var(--primary), var(--primary))' }} />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <span style={{ color: 'var(--foreground)' }}>{title}</span>
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                <Button
                  variant={chartType === 'area' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('area')}
                  className="h-7 px-3 text-xs"
                >
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Area
                </Button>
                <Button
                  variant={chartType === 'line' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('line')}
                  className="h-7 px-3 text-xs"
                >
                  <Activity className="w-3 h-3 mr-1" />
                  Line
                </Button>
              </div>
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
