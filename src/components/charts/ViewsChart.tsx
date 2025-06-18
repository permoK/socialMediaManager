'use client'

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatNumber, formatDate } from '@/lib/utils'

interface ViewsChartProps {
  data: Array<{
    date: string
    views: number
  }>
  loading?: boolean
  title?: string
  description?: string
}

export function ViewsChart({ 
  data, 
  loading = false, 
  title = "Views Over Time",
  description = "Daily views for your channel"
}: ViewsChartProps) {
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
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
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                formatter={(value: number) => [formatTooltipValue(value), 'Views']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#dc2626" 
                strokeWidth={2}
                dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#dc2626', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
