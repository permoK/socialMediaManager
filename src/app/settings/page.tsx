'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { usePlatforms } from '@/contexts/PlatformContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Trash2,
  LogOut,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function SettingsPage() {
  const { user, profile, signOut } = useAuth()
  const { connections, disconnectPlatform } = usePlatforms()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSignOut = async () => {
    try {
      setLoading(true)
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
      setMessage({ type: 'error', text: 'Failed to sign out' })
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnectPlatform = async (platformId: string) => {
    try {
      setLoading(true)
      await disconnectPlatform(platformId as any)
      setMessage({ type: 'success', text: `${platformId} disconnected successfully` })
    } catch (error) {
      console.error('Disconnect error:', error)
      setMessage({ type: 'error', text: `Failed to disconnect ${platformId}` })
    } finally {
      setLoading(false)
    }
  }

  const connectedPlatforms = Object.values(connections).filter(conn => conn.isConnected)

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">
                Manage your account and platform connections
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            {message.type === 'error' ? (
              <AlertCircle className="h-4 w-4 text-red-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <CardTitle>Account Information</CardTitle>
              </div>
              <CardDescription>
                Your account details and profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              {profile?.full_name && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <p className="text-gray-900">{profile.full_name}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700">Member Since</label>
                <p className="text-gray-900">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Connected Platforms */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-gray-600" />
                <CardTitle>Connected Platforms</CardTitle>
              </div>
              <CardDescription>
                Manage your social media platform connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {connectedPlatforms.length > 0 ? (
                <div className="space-y-4">
                  {connectedPlatforms.map((connection) => (
                    <div key={connection.platformId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{connection.platformId}</p>
                          {connection.accountInfo && (
                            <p className="text-sm text-gray-600">{connection.accountInfo.displayName}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnectPlatform(connection.platformId)}
                        disabled={loading}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Disconnect
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No platforms connected yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>
                Configure your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates about your platforms via email</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Platform Alerts</p>
                    <p className="text-sm text-gray-600">Get notified about platform connection issues</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Account Actions</CardTitle>
              <CardDescription>
                Manage your account settings and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                onClick={handleSignOut}
                disabled={loading}
                className="w-full justify-start text-gray-700 border-gray-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              
              <Button
                variant="outline"
                disabled
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
