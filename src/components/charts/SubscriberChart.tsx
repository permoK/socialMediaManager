'use client'

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatNumber, formatDate } from '@/lib/utils'

interface SubscriberChartProps {
  data: Array<{
    date: string
    subscribersGained: number
    subscribersLost: number
    netGain?: number
  }>
  loading?: boolean
  title?: string
  description?: string
}

export function SubscriberChart({ 
  data, 
  loading = false, 
  title = "Subscriber Growth",
  description = "Daily subscriber gains and losses"
}: SubscriberChartProps) {
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
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxisLabel}
                className="text-xs text-gray-600"
              />
              <YAxis 
                tickFormatter={formatNumber}
                className="text-xs text-gray-600"
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
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="subscribersGained" 
                stackId="1"
                stroke="#10b981" 
                fill="#10b981"
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="subscribersLost" 
                stackId="2"
                stroke="#ef4444" 
                fill="#ef4444"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Subscribers Gained</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Subscribers Lost</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
