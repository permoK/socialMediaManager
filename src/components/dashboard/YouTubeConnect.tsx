'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Youtube, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface YouTubeConnectProps {
  isConnected: boolean
  onConnect: () => void
  loading?: boolean
  error?: string
}

export function YouTubeConnect({ 
  isConnected, 
  onConnect, 
  loading = false, 
  error 
}: YouTubeConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await onConnect()
    } finally {
      setIsConnecting(false)
    }
  }

  if (isConnected) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">YouTube Connected</CardTitle>
          </div>
          <CardDescription className="text-green-700">
            Your YouTube account is successfully connected and ready to fetch analytics data.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
            <Youtube className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <CardTitle>Connect Your YouTube Account</CardTitle>
        <CardDescription>
          Connect your YouTube account to start analyzing your channel's performance, 
          view detailed analytics, and track your growth over time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">What you'll get access to:</p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                <span>Channel statistics and subscriber count</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                <span>Video performance metrics</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                <span>Watch time and engagement analytics</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                <span>Audience demographics and geography</span>
              </li>
            </ul>
          </div>
          
          <Button
            onClick={handleConnect}
            disabled={loading || isConnecting}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            size="lg"
          >
            {(loading || isConnecting) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <Youtube className="mr-2 h-4 w-4" />
            Connect YouTube Account
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            We'll redirect you to Google to authorize access to your YouTube data. 
            Your data is secure and we only access what's necessary for analytics.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
