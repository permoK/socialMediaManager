'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { 
  User, 
  LogOut, 
  Menu, 
  X, 
  BarChart3,
  Youtube
} from 'lucide-react'

export function Navbar() {
  const { user, profile, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-lg">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                YouTube Analytics
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Profile"
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <User className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <span className="text-sm text-gray-700">
                      {profile?.full_name || user.email}
                    </span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {user ? (
              <>
                <Link href="/dashboard" className="block">
                  <Button
                    variant="ghost"
                    className="w-full justify-start flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                
                <div className="px-3 py-2 border-t border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Profile"
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <User className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <span className="text-sm text-gray-700">
                      {profile?.full_name || user.email}
                    </span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="w-full justify-start flex items-center space-x-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-2 px-3 py-2">
                <Link href="/auth" className="block">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth" className="block">
                  <Button
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
