import { createServerComponentClient } from '@/lib/supabase-server'

export interface YouTubeAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes: string[]
}

export interface YouTubeTokens {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
  scope: string
}

export class YouTubeAuth {
  private config: YouTubeAuthConfig

  constructor() {
    this.config = {
      clientId: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID!,
      clientSecret: process.env.YOUTUBE_CLIENT_SECRET!,
      redirectUri: process.env.NEXT_PUBLIC_YOUTUBE_REDIRECT_URI!,
      scopes: [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/yt-analytics.readonly',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ]
    }
  }

  /**
   * Generate the OAuth authorization URL
   */
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
      ...(state && { state })
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<YouTubeTokens> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.config.redirectUri,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Token exchange failed: ${error}`)
    }

    return response.json()
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<YouTubeTokens> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Token refresh failed: ${error}`)
    }

    const tokens = await response.json()
    
    // If no new refresh token is provided, keep the old one
    if (!tokens.refresh_token) {
      tokens.refresh_token = refreshToken
    }

    return tokens
  }

  /**
   * Store tokens in Supabase
   */
  async storeTokens(userId: string, tokens: YouTubeTokens): Promise<void> {
    const supabase = await createServerComponentClient()
    
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

    const { error } = await supabase
      .from('youtube_tokens')
      .upsert({
        user_id: userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: expiresAt,
        scope: tokens.scope,
        token_type: tokens.token_type,
      })

    if (error) {
      throw new Error(`Failed to store tokens: ${error.message}`)
    }
  }

  /**
   * Get stored tokens for a user
   */
  async getStoredTokens(userId: string) {
    const supabase = await createServerComponentClient()

    const { data, error } = await supabase
      .from('youtube_tokens')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get tokens: ${error.message}`)
    }

    return data
  }

  /**
   * Get valid access token (refresh if necessary)
   */
  async getValidAccessToken(userId: string): Promise<string | null> {
    const storedTokens = await this.getStoredTokens(userId)
    
    if (!storedTokens) {
      return null
    }

    const now = new Date()
    const expiresAt = new Date(storedTokens.expires_at)

    // If token is still valid, return it
    if (now < expiresAt) {
      return storedTokens.access_token
    }

    // If token is expired but we have a refresh token, refresh it
    if (storedTokens.refresh_token) {
      try {
        const newTokens = await this.refreshAccessToken(storedTokens.refresh_token)
        await this.storeTokens(userId, newTokens)
        return newTokens.access_token
      } catch (error) {
        console.error('Failed to refresh token:', error)
        // If refresh fails, remove the invalid tokens
        await this.removeTokens(userId)
        return null
      }
    }

    return null
  }

  /**
   * Remove stored tokens
   */
  async removeTokens(userId: string): Promise<void> {
    const supabase = await createServerComponentClient()

    const { error } = await supabase
      .from('youtube_tokens')
      .delete()
      .eq('user_id', userId)

    if (error) {
      throw new Error(`Failed to remove tokens: ${error.message}`)
    }
  }

  /**
   * Check if user has valid YouTube tokens
   */
  async hasValidTokens(userId: string): Promise<boolean> {
    const accessToken = await this.getValidAccessToken(userId)
    return accessToken !== null
  }
}
