'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatNumber, formatDate } from '@/lib/utils'
import { motion } from 'framer-motion'
import { RefreshCw, Users, BarChart3, Activity } from 'lucide-react'
import { useState } from 'react'

interface SubscriberChartProps {
  data: Array<{
    date: string
    subscribersGained: number
    subscribersLost: number
    netGain?: number
  }>
  loading?: boolean
  error?: string
  title?: string
  description?: string
  onRefresh?: () => void
}

export function SubscriberChart({
  data,
  loading = false,
  error,
  title = "Subscriber Growth",
  description = "Daily subscriber gains and losses",
  onRefresh
}: SubscriberChartProps) {
  const [chartType, setChartType] = useState<'area' | 'line'>('area')
  // Calculate net gain for each data point
  const processedData = data.map(item => ({
    ...item,
    netGain: item.subscribersGained - item.subscribersLost
  }))

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
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, var(--success), var(--success))' }} />
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" style={{ color: 'var(--success)' }} />
                  <span style={{ color: 'var(--foreground)' }}>{title}</span>
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--success)' }}></div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Loading chart data...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            No data available
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
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, var(--success), var(--success))' }} />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" style={{ color: 'var(--success)' }} />
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
                  style={{ borderColor: 'var(--success)', color: 'var(--success)' }}
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
              {chartType === 'area' ? (
                <AreaChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gainedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="lostGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
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
                    formatter={(value: number, name: string) => {
                      const displayName = name === 'subscribersGained' ? 'Gained' :
                                       name === 'subscribersLost' ? 'Lost' : 'Net Gain'
                      return [formatTooltipValue(value), displayName]
                    }}
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
                    dataKey="subscribersGained"
                    stackId="1"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#gainedGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="subscribersLost"
                    stackId="2"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#lostGradient)"
                  />
                </AreaChart>
              ) : (
                <LineChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                    formatter={(value: number, name: string) => {
                      const displayName = name === 'subscribersGained' ? 'Gained' :
                                       name === 'subscribersLost' ? 'Lost' : 'Net Gain'
                      return [formatTooltipValue(value), displayName]
                    }}
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
                    dataKey="subscribersGained"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: 'white' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="subscribersLost"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2, fill: 'white' }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Enhanced Legend */}
          <div className="flex justify-center space-x-8 mt-6">
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--success)' }}></div>
              <span className="font-medium text-sm" style={{ color: 'var(--success)' }}>Subscribers Gained</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--destructive)' }}></div>
              <span className="font-medium text-sm" style={{ color: 'var(--destructive)' }}>Subscribers Lost</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
