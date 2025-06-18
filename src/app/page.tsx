import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Youtube, BarChart3, Users, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="flex items-center justify-center w-20 h-20 bg-red-600 rounded-2xl">
              <Youtube className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            YouTube Analytics
            <span className="block text-red-600">Dashboard</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get comprehensive insights into your YouTube channel's performance.
            Track views, subscribers, engagement, and revenue all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                Get Started Free
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need to grow your channel
          </h2>
          <p className="text-lg text-gray-600">
            Powerful analytics tools to help you understand your audience and optimize your content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Detailed Analytics
            </h3>
            <p className="text-gray-600">
              Track views, watch time, engagement rates, and revenue with comprehensive charts and metrics.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Audience Insights
            </h3>
            <p className="text-gray-600">
              Understand your audience demographics, geography, and viewing patterns to create better content.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Growth Tracking
            </h3>
            <p className="text-gray-600">
              Monitor subscriber growth, video performance, and channel trends to optimize your strategy.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-red-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to grow your YouTube channel?
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Join thousands of creators who use our analytics dashboard to optimize their content and grow their audience.
          </p>
          <Link href="/auth">
            <Button size="lg" variant="outline" className="bg-white text-red-600 hover:bg-gray-100">
              Start Analyzing Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
