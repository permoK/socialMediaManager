import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Zap, BarChart3, Users, TrendingUp, Youtube, Twitter, Instagram, Video } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-gray-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
              <Zap className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Social Media
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Management Platform</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Manage all your social media platforms in one place. Connect YouTube, Twitter, Instagram, TikTok, and more.
            Get comprehensive analytics, schedule content, and grow your audience across all platforms.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Get Started Free
              </Button>
            </Link>
            <Link href="/platforms">
              <Button variant="outline" size="lg">
                View Platforms
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need to manage your social media presence
          </h2>
          <p className="text-lg text-gray-600">
            Powerful tools to help you grow across all social media platforms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                <Youtube className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              YouTube Analytics
            </h3>
            <p className="text-gray-600">
              Track views, watch time, engagement rates, and revenue with comprehensive charts and metrics.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <Twitter className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Twitter Management
            </h3>
            <p className="text-gray-600">
              Schedule tweets, track engagement, and analyze your Twitter performance and growth.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-lg">
                <Instagram className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Instagram Insights
            </h3>
            <p className="text-gray-600">
              Monitor posts, stories, and reels performance. Track followers and engagement metrics.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Multi-Platform
            </h3>
            <p className="text-gray-600">
              Unified dashboard for TikTok, LinkedIn, and other platforms. More integrations coming soon.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to supercharge your social media presence?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of creators and businesses who use our platform to manage and grow their social media presence across all platforms.
          </p>
          <Link href="/auth">
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Managing Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
